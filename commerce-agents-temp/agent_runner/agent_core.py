"""
agent_runner/agent_core.py — Real ShoppingAgent integration for Toolify.

Wires the commerce-agents ShoppingAgent to a Vietnamese storefront. The agent
turn loop drives Claude; the VNBackend (this module) implements the
StorefrontBackend interface against the local catalog in catalog.py, with
Tiki API as a live-search fallback when a query does not match local data.

The AgentCore translates AgentEvent objects from the turn loop into the SSE
shape lib/agent/types.ts expects (text_delta, present_products,
present_comparison, cart_update, turn_complete, error).
"""

from __future__ import annotations

import logging
import os
from datetime import datetime
from pathlib import Path
from typing import Any, AsyncGenerator

import httpx
from shopping_agent.backend import (
    NotOffered,
    StorefrontBackend,
    Unavailable,
)
from shopping_agent.config import ShoppingAgentConfig
from shopping_agent.types import (
    Cart,
    CartItem,
    FulfillmentOption,
    Order,
    OrderItem,
    OrderStatus,
    Policy,
    Product,
    ProductDetails,
    SearchFilters,
    ShoppingSessionContext,
    ShoppingSessionState,
    UserPreferences,
)
from shopping_agent_runtime.orchestrator import ShoppingAgent

from agent_runner.catalog import (
    CATALOG,
    POLICIES,
    find_policy,
    find_product,
    search_local,
)

logger = logging.getLogger(__name__)

# Tiki API config for live fallback search when local catalog misses.
TIKI_BASE_URL = "https://tiki.vn/api/v2"
TIKI_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept": "application/json",
    "Accept-Language": "vi-VN,vi;q=0.9,en;q=0.8",
    "Referer": "https://tiki.vn/",
}

# Paths are pinned to absolute locations; the runner module is loaded by sys.path.
SKILLS_DIR = Path(r"D:\Startup-BA\commerce-agents-temp\shopping-agent\skills")


# ---------------------------------------------------------------------------
# Helpers — convert commerce-agents objects to the UI's shape.
# ---------------------------------------------------------------------------


def _product_to_ui(product_dict: dict[str, Any]) -> dict[str, Any]:
    """Project an enriched payload `product` record to the Product shape
    lib/storefront/vn-backend.ts declares."""
    return {
        "product_id": product_dict.get("product_id"),
        "title": product_dict.get("title"),
        "brand": product_dict.get("brand"),
        "price": product_dict.get("price"),
        "original_price": product_dict.get("original_price"),
        "currency": product_dict.get("currency", "VND"),
        "rating": product_dict.get("rating"),
        "review_count": product_dict.get("review_count"),
        "image_url": product_dict.get("image_url"),
        "category": product_dict.get("category"),
        "labels": list(product_dict.get("labels") or []),
        "in_stock": product_dict.get("in_stock", True),
        "short_description": product_dict.get("short_description"),
    }


def _cart_dict_from_payload(cart_payload: dict[str, Any]) -> dict[str, Any]:
    """``cart_payload`` from cart_payload() already matches the UI's Cart shape
    (items, item_count, subtotal, currency). Drop empty optional fields."""
    return {
        "items": list(cart_payload.get("items", [])),
        "item_count": cart_payload.get("item_count", 0),
        "subtotal": cart_payload.get("subtotal", 0),
        "currency": cart_payload.get("currency", "VND"),
    }


def _entry_to_product(entry: dict[str, Any]) -> dict[str, Any]:
    """An enriched ``entries[i]`` payload: ``{product, reason, ...}``."""
    product = entry.get("product") or {}
    return _product_to_ui(product)


# ---------------------------------------------------------------------------
# Tiki live search (fallback only).
# ---------------------------------------------------------------------------


def _parse_tiki_product(raw: dict[str, Any]) -> dict[str, Any]:
    return {
        "product_id": str(raw.get("id", "")),
        "title": raw.get("name", ""),
        "brand": raw.get("brand_name"),
        "price": float(raw.get("price", 0)),
        "original_price": raw.get("original_price"),
        "currency": "VND",
        "rating": raw.get("rating_average"),
        "review_count": (
            raw.get("quantity_sold", {}).get("value")
            if isinstance(raw.get("quantity_sold"), dict)
            else None
        ),
        "image_url": raw.get("thumbnail_url"),
        "category": (
            raw.get("breadcrumbs", "").split("›")[-1].strip() if raw.get("breadcrumbs") else None
        ),
        "labels": ["Tiki"],
        "in_stock": True,
        "short_description": (
            raw.get("description", "")[:200] if raw.get("description") else None
        ),
    }


async def _tiki_search(
    query: str, limit: int, min_price: float | None, max_price: float | None
) -> list[dict[str, Any]]:
    """Fallback: hit Tiki's public search API. Used only when local catalog
    returns 0 results for a query."""
    async with httpx.AsyncClient(timeout=15.0, follow_redirects=True) as client:
        try:
            resp = await client.get(
                f"{TIKI_BASE_URL}/products",
                params={"q": query, "limit": limit},
                headers=TIKI_HEADERS,
            )
            if resp.status_code != 200:
                logger.warning("Tiki search non-200: %s", resp.status_code)
                return []
            items = (resp.json() or {}).get("data", []) or []
        except Exception:
            logger.exception("Tiki fallback search failed")
            return []
    out: list[dict[str, Any]] = []
    for raw in items:
        if not isinstance(raw, dict):
            continue
        product = _parse_tiki_product(raw)
        if min_price is not None and product["price"] < min_price:
            continue
        if max_price is not None and product["price"] > max_price:
            continue
        out.append(product)
        if len(out) >= limit:
            break
    return out


# ---------------------------------------------------------------------------
# VNBackend — implements shopping_agent.backend.StorefrontBackend.
# ---------------------------------------------------------------------------


class VNBackend(StorefrontBackend):
    """Vietnamese storefront backend.

    Reads: catalog (local), policies (local). Writes: in-memory carts keyed by
    session_id, demo orders. Search runs against local catalog first; when that
    returns 0 hits, Tiki's public API is the fallback so the agent can answer
    broad queries that exceed the 18-product local seed.
    """

    def __init__(self) -> None:
        self._carts: dict[str, dict[str, dict[str, Any]]] = {}
        self._orders: dict[str, Order] = {}
        self._seed_demo_orders()

    # -- Catalog ----------------------------------------------------------------

    async def search_products(
        self,
        session: ShoppingSessionContext,
        query: str,
        filters: SearchFilters | None = None,
        limit: int = 8,
    ) -> list[Product]:
        del session
        min_price = filters.min_price if filters else None
        max_price = filters.max_price if filters else None
        local = search_local(query, limit=limit, min_price=min_price, max_price=max_price)
        if local:
            return [Product(**entry) for entry in local]
        # Fallback to live Tiki search only when local misses.
        if not query.strip():
            return []
        tiki = await _tiki_search(query, limit, min_price, max_price)
        return [Product(**entry) for entry in tiki]

    async def get_product_details(
        self, session: ShoppingSessionContext, product_id: str
    ) -> ProductDetails | None:
        del session
        entry = find_product(product_id)
        if entry is None:
            return None
        return ProductDetails(
            product_id=entry["product_id"],
            title=entry["title"],
            brand=entry.get("brand"),
            price=entry["price"],
            original_price=entry.get("original_price"),
            currency=entry.get("currency", "VND"),
            rating=entry.get("rating"),
            review_count=entry.get("review_count"),
            image_url=entry.get("image_url"),
            category=entry.get("category"),
            labels=list(entry.get("labels") or []),
            in_stock=entry.get("in_stock", True),
            short_description=entry.get("short_description"),
            long_description=entry.get("long_description"),
            specs=dict(entry.get("specs") or {}),
        )

    # -- Cart -------------------------------------------------------------------

    def _cart_dict(self, session_id: str) -> dict[str, Any]:
        items = list(self._carts.get(session_id, {}).values())
        subtotal = sum(item["price"] * item["quantity"] for item in items)
        item_count = sum(item["quantity"] for item in items)
        return {
            "items": items,
            "currency": "VND",
            "subtotal": subtotal,
            "item_count": item_count,
        }

    async def get_cart(self, session: ShoppingSessionContext) -> Cart:
        cart_dict = self._cart_dict(session.session_id)
        cart_items = [
            CartItem(
                product_id=item["product_id"],
                title=item["title"],
                price=item["price"],
                quantity=item["quantity"],
                image_url=item.get("image_url"),
            )
            for item in cart_dict["items"]
        ]
        return Cart(items=cart_items, currency="VND")

    async def add_to_cart(
        self, session: ShoppingSessionContext, product_id: str, quantity: int
    ) -> Cart:
        entry = find_product(product_id)
        if entry is None:
            raise Unavailable(f"Sản phẩm '{product_id}' không tồn tại.")
        if not entry.get("in_stock", True):
            raise Unavailable(f"Sản phẩm '{entry['title']}' hiện hết hàng.")
        if quantity <= 0:
            raise ValueError("quantity must be positive")
        bucket = self._carts.setdefault(session.session_id, {})
        existing = bucket.get(product_id)
        new_qty = (existing["quantity"] if existing else 0) + quantity
        bucket[product_id] = {
            "product_id": entry["product_id"],
            "title": entry["title"],
            "price": entry["price"],
            "quantity": new_qty,
            "image_url": entry.get("image_url"),
        }
        return await self.get_cart(session)

    async def update_cart_item(
        self, session: ShoppingSessionContext, product_id: str, quantity: int
    ) -> Cart:
        if quantity <= 0:
            return await self.remove_from_cart(session, product_id)
        bucket = self._carts.get(session.session_id, {})
        if product_id not in bucket:
            return await self.get_cart(session)
        bucket[product_id]["quantity"] = quantity
        return await self.get_cart(session)

    async def remove_from_cart(
        self, session: ShoppingSessionContext, product_id: str
    ) -> Cart:
        bucket = self._carts.get(session.session_id)
        if bucket and product_id in bucket:
            del bucket[product_id]
        return await self.get_cart(session)

    # -- Customer, orders, policies --------------------------------------------

    async def get_preferences(self, session: ShoppingSessionContext) -> UserPreferences:
        return UserPreferences(
            user_id=session.user_id,
            display_name=None,
            loyalty_tier="standard",
            default_location="VN",
            preferences={
                "currency": "VND",
                "language": "vi",
                "location": "VN",
                "price_sensitivity": "medium",
                "brand_preference": "",
            },
        )

    async def get_account_context(
        self, session: ShoppingSessionContext
    ) -> dict[str, Any] | None:
        del session
        return None

    async def get_orders(
        self, session: ShoppingSessionContext, limit: int = 5
    ) -> list[Order]:
        del session
        orders = sorted(self._orders.values(), key=lambda o: o.placed_at, reverse=True)
        return orders[:limit]

    async def get_order(
        self, session: ShoppingSessionContext, order_id: str
    ) -> Order | None:
        del session
        return self._orders.get(order_id)

    async def search_policies(
        self, session: ShoppingSessionContext, query: str
    ) -> list[Policy]:
        del session
        rows = find_policy(query)
        return [
            Policy(
                policy_id=row["policy_id"],
                title=row["title"],
                category=row.get("category"),
                content=row["content"],
            )
            for row in rows
        ]

    # -- Fulfillment ------------------------------------------------------------

    async def get_fulfillment_options(
        self, session: ShoppingSessionContext, product_ids: list[str]
    ) -> list[FulfillmentOption]:
        del session
        known_ids = [pid for pid in product_ids if find_product(pid) is not None]
        if not known_ids:
            return []
        options: list[FulfillmentOption] = [
            FulfillmentOption(method="delivery", eta="2-5 ngày làm việc", fee=0, location="Toàn quốc"),
            FulfillmentOption(
                method="delivery",
                eta="1-2 ngày làm việc",
                fee=25_000,
                location="Nội thành HCM/HN",
            ),
        ]
        instant_eligible = all(
            (entry := find_product(pid)) is not None
            and (entry.get("category") in {"Phụ kiện", "Sách", "Thời trang"})
            for pid in known_ids
        )
        if instant_eligible:
            options.append(
                FulfillmentOption(
                    method="delivery",
                    eta="Giao trong 2 giờ",
                    fee=45_000,
                    location="Nội thành HCM/HN",
                )
            )
        return options

    # -- Demo orders ------------------------------------------------------------

    def _seed_demo_orders(self) -> None:
        now = datetime.utcnow()
        demos = [
            Order(
                order_id="DH001",
                status=OrderStatus.DELIVERED,
                placed_at=now,
                items=[
                    OrderItem(
                        product_id="airpods-pro-2",
                        title="AirPods Pro 2 USB-C",
                        quantity=1,
                        price=6_490_000,
                    )
                ],
                total=6_490_000,
                currency="VND",
                estimated_delivery="Đã giao",
                tracking_url="https://tracking.example/DH001",
            ),
            Order(
                order_id="DH002",
                status=OrderStatus.SHIPPED,
                placed_at=now,
                items=[
                    OrderItem(
                        product_id="macbook-air-m3-13",
                        title="MacBook Air M3 13 inch",
                        quantity=1,
                        price=27_990_000,
                    )
                ],
                total=27_990_000,
                currency="VND",
                estimated_delivery="Dự kiến 5 ngày",
                tracking_url="https://tracking.example/DH002",
            ),
        ]
        self._orders = {order.order_id: order for order in demos}


# ---------------------------------------------------------------------------
# AgentCore — wires VNBackend to ShoppingAgent.
# ---------------------------------------------------------------------------


class AgentCore:
    """Holds one ShoppingAgent (Claude + tools) and runs turn loops.

    All calls share the same VNBackend instance so cart state and order seed
    data persist across turns of the same session. The agent is created lazily
    so module import does not require ANTHROPIC_API_KEY.
    """

    def __init__(self) -> None:
        self._backend = VNBackend()
        self._agent: ShoppingAgent | None = None
        self._states: dict[str, ShoppingSessionState] = {}
        self._histories: dict[str, list[dict[str, Any]]] = {}
        # Custom Vietnamese prompt for Toolify — overrides commerce-agents'
        # ACME voice. Loaded from prompts.py.
        from agent_runner.prompts import build_system_prompt

        self._brand_voice = build_system_prompt()
        self._model = os.environ.get("AGENT_MODEL", "claude-sonnet-4-6")
        logger.info("AgentCore initialised (model=%s)", self._model)

    def _ensure_agent(self) -> ShoppingAgent:
        if self._agent is None:
            if not os.environ.get("ANTHROPIC_API_KEY"):
                raise RuntimeError(
                    "ANTHROPIC_API_KEY is not set; export it before invoking the agent."
                )
            config = ShoppingAgentConfig(
                model=self._model,
                brand_name="Toolify.vn",
                assistant_name="trợ lý mua sắm Toolify",
                brand_voice=self._brand_voice,
                domain_search_notes=(
                    "VN storefront. Currency is VND. Search covers the local catalog first; "
                    "live Tiki API is the fallback for queries outside the 18-product seed."
                ),
                enable_cart=True,
                enable_orders=True,
                enable_policies=True,
                enable_fulfillment=True,
            )
            self._agent = ShoppingAgent(
                backend=self._backend,
                skills_dir=SKILLS_DIR,
                config=config,
            )
        return self._agent

    async def stream_turn(
        self,
        session_id: str,
        user_id: str,
        message: str,
        message_history: list[dict[str, Any]] | None = None,
    ) -> AsyncGenerator[dict[str, Any], None]:
        """Run one user turn. Yields UI-shaped SSE dicts.

        The session's message history persists in memory so Claude sees prior
        turns. Tool results follow commerce-agents conventions (ids only).
        """
        try:
            agent = self._ensure_agent()
        except RuntimeError as exc:
            yield {"type": "error", "message": str(exc)}
            return

        session = ShoppingSessionContext(
            session_id=session_id,
            user_id=user_id,
            now=datetime.utcnow(),
        )
        state = self._states.setdefault(session_id, ShoppingSessionState())
        messages = self._histories.setdefault(session_id, [])
        # Append the user message; the agent extends the list in place.
        messages.append({"role": "user", "content": message})

        try:
            async for event in agent.stream_turn(messages, session, state):
                translated = self._translate(event)
                if translated is not None:
                    yield translated
        except Exception as exc:  # noqa: BLE001
            logger.exception("stream_turn failed")
            yield {"type": "error", "message": str(exc)}

    @staticmethod
    def _translate(event: Any) -> dict[str, Any] | None:
        """Map commerce_common AgentEvent -> UI SSE dict.

        The tool_call/tool_result/ui_partial frames are dropped: the UI does
        not render them. ``text_delta`` moves its body to the root. ``ui``
        payloads are split into present_products, present_comparison, or
        cart_update based on the component name.
        """
        event_type = getattr(event, "type", None)
        data: dict[str, Any] = getattr(event, "data", None) or {}

        if event_type == "text_delta":
            return {"type": "text_delta", "delta": data.get("text", "")}

        if event_type == "cart_update":
            return {
                "type": "cart_update",
                "cart": _cart_dict_from_payload(data.get("cart", {})),
            }

        if event_type == "turn_complete":
            usage = data.get("usage") or {}
            return {
                "type": "turn_complete",
                "usage": {
                    "input_tokens": int(usage.get("input_tokens", 0)),
                    "output_tokens": int(usage.get("output_tokens", 0)),
                },
            }

        if event_type == "error":
            return {"type": "error", "message": data.get("message", "Unknown error")}

        if event_type == "ui":
            component = data.get("component")
            payload = data.get("payload") or {}
            return AgentCore._translate_ui(component, payload)

        if event_type == "ui_partial":
            # Skip; the final `ui` event carries the same stream_id.
            return None

        # tool_call, tool_result, progress, change_update: no UI hook.
        return None

    @staticmethod
    def _translate_ui(component: str | None, payload: dict[str, Any]) -> dict[str, Any] | None:
        if component == "products":
            items = payload.get("items") or []
            products = [_entry_to_product(entry) for entry in items if entry]
            if not products:
                return None
            best_pick_id = payload.get("recommended_id")
            best_index = 0
            if best_pick_id is not None:
                for idx, entry in enumerate(items):
                    if (entry.get("product") or {}).get("product_id") == best_pick_id:
                        best_index = idx
                        break
            return {
                "type": "present_products",
                "products": products,
                "bestPickIndex": best_index,
                "query": payload.get("query"),
            }

        if component == "comparison":
            entries = payload.get("entries") or []
            products = [_entry_to_product(entry) for entry in entries if entry]
            if not products:
                return None
            # Best pick: prefer price_delta.low_product_id (the cheapest), else first.
            best_index = 0
            delta = payload.get("price_delta") or {}
            low_id = delta.get("low_product_id")
            if low_id is not None:
                for idx, entry in enumerate(entries):
                    if (entry.get("product") or {}).get("product_id") == low_id:
                        best_index = idx
                        break
            return {
                "type": "present_comparison",
                "products": products,
                "bestPickIndex": best_index,
            }

        if component == "cart":
            # The cart card payload contains an embedded cart dict.
            cart_section = payload.get("cart") or {}
            return {
                "type": "cart_update",
                "cart": _cart_dict_from_payload(cart_section),
            }

        if component == "order_status":
            order = payload.get("order") or {}
            return {"type": "present_order_status", "order": order}

        # plan, guide, disclosure, checkout, suggestions: UI has no handler.
        return None
