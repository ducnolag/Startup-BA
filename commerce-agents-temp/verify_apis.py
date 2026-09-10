"""
verify_apis.py — verify public search APIs của 3 sàn Shopee, Lazada, Tiki.

Chạy: .venv\\Scripts\\Activate.ps1 ; python verify_apis.py

Mục đích: xác nhận trước khi build product_fetcher, các endpoint public sau vẫn
khả dụng và trả về schema có thể parse được.

Endpoints thử:
  - Shopee: GET https://shopee.vn/api/v4/search/search_items?by=relevancy&keyword=...
  - Lazada: GET https://www.lazada.vn/mobile/api/v2/search (mobile endpoint)
  - Tiki:   GET https://tiki.vn/api/v2/products?q=...

Script chỉ in ra — không ghi file, không thay đổi gì khác.
"""

from __future__ import annotations

import asyncio
import json
import sys
import time
from dataclasses import dataclass
from typing import Any

import httpx


QUERY = "iphone"
LIMIT = 10
USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
)
SHOPEE_AFFILIATE_HEADER = {
    "User-Agent": USER_AGENT,
    "Accept": "application/json",
    "Accept-Language": "vi-VN,vi;q=0.9,en;q=0.8",
    "Referer": "https://shopee.vn/",
    "X-Requested-With": "XMLHttpRequest",
}
LAZADA_HEADERS = {
    "User-Agent": USER_AGENT,
    "Accept": "application/json",
    "Accept-Language": "vi-VN,vi;q=0.9,en;q=0.8",
    "Referer": "https://www.lazada.vn/",
}
TIKI_HEADERS = {
    "User-Agent": USER_AGENT,
    "Accept": "application/json",
    "Accept-Language": "vi-VN,vi;q=0.9,en;q=0.8",
    "Referer": "https://tiki.vn/",
}


@dataclass
class ProbeResult:
    platform: str
    ok: bool
    status_code: int | None
    url: str
    elapsed_ms: int
    error: str | None
    sample: list[dict[str, Any]]
    notes: list[str]

    def render(self) -> str:
        lines: list[str] = []
        flag = "PASS" if self.ok else "FAIL"
        lines.append(f"[{flag}] {self.platform.upper()}  status={self.status_code}  "
                     f"elapsed={self.elapsed_ms}ms  url={self.url}")
        if self.error:
            lines.append(f"  error: {self.error}")
        for note in self.notes:
            lines.append(f"  note: {note}")
        if self.sample:
            lines.append(f"  sample ({len(self.sample)} items):")
            for idx, item in enumerate(self.sample[:3], start=1):
                lines.append(f"    {idx}. {json.dumps(item, ensure_ascii=False)[:300]}")
        return "\n".join(lines)


async def _probe_shopee(client: httpx.AsyncClient, query: str, limit: int) -> ProbeResult:
    url = "https://shopee.vn/api/v4/search/search_items"
    params = {"by": "relevancy", "keyword": query, "limit": limit}
    notes: list[str] = []
    started = time.perf_counter()
    try:
        resp = await client.get(url, params=params, headers=SHOPEE_AFFILIATE_HEADER, timeout=20)
        elapsed_ms = int((time.perf_counter() - started) * 1000)
        if resp.status_code != 200:
            return ProbeResult(
                platform="shopee", ok=False, status_code=resp.status_code, url=str(resp.request.url),
                elapsed_ms=elapsed_ms, error=f"non-200 status: {resp.text[:200]}",
                sample=[], notes=notes,
            )
        payload = resp.json()
    except Exception as exc:  # noqa: BLE001
        elapsed_ms = int((time.perf_counter() - started) * 1000)
        return ProbeResult(
            platform="shopee", ok=False, status_code=None, url=url,
            elapsed_ms=elapsed_ms, error=f"{type(exc).__name__}: {exc}", sample=[], notes=notes,
        )

    items = payload.get("items") or []
    notes.append(f"top-level keys: {sorted(payload.keys())}")
    sample: list[dict[str, Any]] = []
    for raw in items[:3]:
        item = raw if isinstance(raw, dict) else {}
        price_min = (item.get("price_min") or 0) / 100_000  # Shopee price stored x 100000
        sample.append({
            "name": item.get("name"),
            "price_min_vnd": price_min,
            "shopid": item.get("shopid"),
            "itemid": item.get("itemid"),
            "shop_location": item.get("shop_location"),
            "rating_star": item.get("item_rating", {}).get("rating_star") if isinstance(item.get("item_rating"), dict) else None,
            "historical_sold": item.get("historical_sold"),
        })
    ok = bool(items) and all(sample[0].get("name") for _ in [0] if sample)
    if not items:
        notes.append("items list empty — có thể bị rate-limit hoặc keyword không match")
    return ProbeResult(
        platform="shopee", ok=ok, status_code=200, url=str(resp.request.url),
        elapsed_ms=elapsed_ms, error=None, sample=sample, notes=notes,
    )


async def _probe_lazada(client: httpx.AsyncClient, query: str, limit: int) -> ProbeResult:
    url = "https://www.lazada.vn/mobile/api/v2/search"
    params = {"q": query, "page": 1}
    notes: list[str] = []
    started = time.perf_counter()
    try:
        resp = await client.get(url, params=params, headers=LAZADA_HEADERS, timeout=20)
        elapsed_ms = int((time.perf_counter() - started) * 1000)
        if resp.status_code != 200:
            return ProbeResult(
                platform="lazada", ok=False, status_code=resp.status_code, url=str(resp.request.url),
                elapsed_ms=elapsed_ms, error=f"non-200 status: {resp.text[:200]}",
                sample=[], notes=notes,
            )
        payload = resp.json()
    except Exception as exc:  # noqa: BLE001
        elapsed_ms = int((time.perf_counter() - started) * 1000)
        return ProbeResult(
            platform="lazada", ok=False, status_code=None, url=url,
            elapsed_ms=elapsed_ms, error=f"{type(exc).__name__}: {exc}", sample=[], notes=notes,
        )

    # Lazada mobile v2 trả về mods.listItems[] cho kết quả search.
    mods = payload.get("mods") if isinstance(payload, dict) else None
    items: list[dict[str, Any]] = []
    if isinstance(mods, dict):
        for mod in mods.get("listItems", []) or []:
            if isinstance(mod, dict):
                items.append(mod)
    if not items and isinstance(payload, dict):
        # fallback path
        items = payload.get("items") or []
    notes.append(f"top-level keys: {sorted(payload.keys()) if isinstance(payload, dict) else 'not-dict'}")
    sample: list[dict[str, Any]] = []
    for raw in items[:3]:
        sample.append({
            "name": raw.get("name"),
            "price": raw.get("price") or raw.get("priceShow"),
            "originalPrice": raw.get("originalPrice"),
            "itemId": raw.get("itemId"),
            "shopName": raw.get("shopName"),
            "ratingScore": raw.get("ratingScore"),
            "image": raw.get("image"),
        })
    ok = bool(items) and any(s.get("name") for s in sample)
    if not items:
        notes.append("mods.listItems empty — endpoint mobile v2 có thể đã ngừng trả public")
    return ProbeResult(
        platform="lazada", ok=ok, status_code=200, url=str(resp.request.url),
        elapsed_ms=elapsed_ms, error=None, sample=sample, notes=notes,
    )


async def _probe_tiki(client: httpx.AsyncClient, query: str, limit: int) -> ProbeResult:
    url = "https://tiki.vn/api/v2/products"
    params = {"q": query, "limit": limit}
    notes: list[str] = []
    started = time.perf_counter()
    try:
        resp = await client.get(url, params=params, headers=TIKI_HEADERS, timeout=20)
        elapsed_ms = int((time.perf_counter() - started) * 1000)
        if resp.status_code != 200:
            return ProbeResult(
                platform="tiki", ok=False, status_code=resp.status_code, url=str(resp.request.url),
                elapsed_ms=elapsed_ms, error=f"non-200 status: {resp.text[:200]}",
                sample=[], notes=notes,
            )
        payload = resp.json()
    except Exception as exc:  # noqa: BLE001
        elapsed_ms = int((time.perf_counter() - started) * 1000)
        return ProbeResult(
            platform="tiki", ok=False, status_code=None, url=url,
            elapsed_ms=elapsed_ms, error=f"{type(exc).__name__}: {exc}", sample=[], notes=notes,
        )

    items = payload.get("data") or []
    notes.append(f"top-level keys: {sorted(payload.keys()) if isinstance(payload, dict) else 'not-dict'}")
    sample: list[dict[str, Any]] = []
    for raw in items[:3]:
        if not isinstance(raw, dict):
            continue
        sample.append({
            "name": raw.get("name"),
            "price": raw.get("price"),
            "original_price": raw.get("original_price"),
            "id": raw.get("id"),
            "url_path": raw.get("url_path"),
            "thumbnail_url": raw.get("thumbnail_url"),
            "rating_average": raw.get("rating_average"),
            "quantity_sold": raw.get("quantity_sold", {}).get("value") if isinstance(raw.get("quantity_sold"), dict) else None,
            "brand_name": raw.get("brand_name"),
        })
    ok = bool(items) and any(s.get("name") for s in sample)
    return ProbeResult(
        platform="tiki", ok=ok, status_code=200, url=str(resp.request.url),
        elapsed_ms=elapsed_ms, error=None, sample=sample, notes=notes,
    )


async def main() -> int:
    print(f"== verify_apis.py | query={QUERY!r} limit={LIMIT} ==")
    async with httpx.AsyncClient(http2=False, follow_redirects=True) as client:
        results = await asyncio.gather(
            _probe_shopee(client, QUERY, LIMIT),
            _probe_lazada(client, QUERY, LIMIT),
            _probe_tiki(client, QUERY, LIMIT),
        )
    for res in results:
        print(res.render())
        print()
    failed = [r.platform for r in results if not r.ok]
    if failed:
        print(f"== FAILED platforms: {failed} ==")
        print("Stop build cho tới khi quyết định phương án fallback.")
        return 1
    print("== ALL 3 APPS PASS ==")
    return 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
