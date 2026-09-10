"""
agent_runner/runner.py — Standalone HTTP server wrapping the real ShoppingAgent.

POST /session  →  create session, return session_id (also accepted via /turn)
POST /turn     →  receive message, stream SSE response
GET  /health   →  health check

The /turn handler always emits SSE frames shaped for the UI:
    data: {"type": "<ui-event>", ...}

The ``type`` field carries the event name; there is no SSE ``event:`` line.
Sessions are auto-created when /turn arrives without a session_id.

Usage:
    python -m agent_runner.runner

Requires ANTHROPIC_API_KEY (and optionally AGENT_MODEL) in the environment.
"""

from __future__ import annotations

import asyncio
import json
import logging
import os
import sys
import uuid
from datetime import datetime
from typing import Any, AsyncGenerator

# Add parent directory to path for imports.
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agent_runner.agent_core import AgentCore

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger(__name__)

HOST = "localhost"
PORT = 8765
CORS_ORIGINS = ["http://localhost:3000", "http://127.0.0.1:3000"]

_sessions: dict[str, dict[str, Any]] = {}
_agent_core: AgentCore | None = None


def get_agent() -> AgentCore:
    """Singleton accessor; the agent holds its own API client."""
    global _agent_core
    if _agent_core is None:
        _agent_core = AgentCore()
    return _agent_core


def create_session() -> dict[str, Any]:
    """Create a new shopping session."""
    session_id = str(uuid.uuid4())
    user_id = f"user_{session_id[:8]}"
    session = {
        "session_id": session_id,
        "user_id": user_id,
        "created_at": datetime.utcnow().isoformat(),
        "messages": [],
    }
    _sessions[session_id] = session
    logger.info("Created session: %s", session_id)
    return session


def cors_headers() -> dict[str, str]:
    return {
        "Access-Control-Allow-Origin": ", ".join(CORS_ORIGINS),
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Expose-Headers": "X-Session-Id",
    }


async def handle_health() -> tuple[dict[str, Any], int]:
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    return {
        "status": "ok",
        "service": "toolify-agent-runner",
        "version": "1.0.0",
        "api_key_configured": bool(api_key),
        "model": os.environ.get("AGENT_MODEL", "claude-sonnet-4-5"),
    }, 200


async def handle_session_create() -> tuple[dict[str, Any], int, dict[str, str]]:
    session = create_session()
    body = {"session_id": session["session_id"], "user_id": session["user_id"]}
    headers = {"X-Session-Id": session["session_id"]}
    return body, 201, headers


async def stream_turn_events(
    session_id: str,
    user_id: str,
    message: str,
    message_history: list[dict[str, Any]] | None,
) -> AsyncGenerator[str, None]:
    """Yield SSE ``data:`` frames (root-level event payload, JSON, ensure_ascii=False)."""
    agent = get_agent()
    logger.info("turn session=%s message=%r", session_id, message[:100])

    # Yield the session id so the client can persist it.
    yield "data: " + json.dumps(
        {"type": "session_started", "session_id": session_id}, ensure_ascii=False
    ) + "\n\n"

    try:
        async for ui_event in agent.stream_turn(
            session_id=session_id,
            user_id=user_id,
            message=message,
            message_history=message_history,
        ):
            # Persist user message into the in-memory session record.
            session = _sessions.setdefault(
                session_id,
                {
                    "session_id": session_id,
                    "user_id": user_id,
                    "created_at": datetime.utcnow().isoformat(),
                    "messages": [],
                },
            )
            if ui_event.get("type") in {"turn_complete", "error"}:
                session["messages"].append(
                    {"role": "assistant", "content": "(turn finished)", "event": ui_event}
                )
            yield "data: " + json.dumps(ui_event, ensure_ascii=False) + "\n\n"
    except Exception as exc:  # noqa: BLE001
        logger.exception("stream_turn_events error")
        yield "data: " + json.dumps(
            {"type": "error", "message": str(exc)}, ensure_ascii=False
        ) + "\n\n"


def _resolve_turn_request(body: dict[str, Any]) -> tuple[str, str, list[dict[str, Any]] | None]:
    """Pull session_id, message, history out of the request body; auto-create a
    session when ``session_id`` is missing."""
    message = body.get("message", "")
    message_history = body.get("message_history") or body.get("history")

    session_id = body.get("session_id") or body.get("sessionId")
    if not session_id:
        session = create_session()
        session_id = session["session_id"]
    elif session_id not in _sessions:
        # Caller passed an id we never issued — adopt it under a stub session.
        _sessions[session_id] = {
            "session_id": session_id,
            "user_id": body.get("user_id") or f"user_{session_id[:8]}",
            "created_at": datetime.utcnow().isoformat(),
            "messages": [],
        }

    user_id = _sessions[session_id]["user_id"]
    return session_id, message, message_history


async def _read_request(reader: asyncio.StreamReader) -> tuple[str, str, dict[str, str], bytes]:
    request_line = await reader.readline()
    if not request_line:
        return "", "", {}, b""
    parts = request_line.decode().strip().split(" ")
    if len(parts) < 2:
        return "", "", {}, b""
    method, path = parts[0], parts[1]

    headers: dict[str, str] = {}
    content_length = 0
    while True:
        line = await reader.readline()
        if not line or line == b"\r\n":
            break
        decoded = line.decode().strip()
        if ":" not in decoded:
            continue
        key, value = decoded.split(":", 1)
        key = key.strip().lower()
        headers[key] = value.strip()
        if key == "content-length":
            content_length = int(value.strip())

    body = b""
    if content_length > 0:
        body = await reader.readexactly(content_length)
    return method, path, headers, body


def _serialize(body: dict[str, Any] | list[Any] | str) -> bytes:
    if isinstance(body, bytes):
        return body
    return json.dumps(body, ensure_ascii=False).encode()


def _http_response(
    status: int, headers: dict[str, str], body: bytes
) -> bytes:
    reason = {200: "OK", 201: "Created", 204: "No Content", 400: "Bad Request",
              404: "Not Found", 500: "Internal Server Error"}.get(status, "OK")
    head = (
        f"HTTP/1.1 {status} {reason}\r\n"
        + "\r\n".join(f"{k}: {v}" for k, v in headers.items())
        + f"\r\nContent-Length: {len(body)}\r\n\r\n"
    )
    return head.encode() + body


def _sse_headers(extra: dict[str, str] | None = None) -> dict[str, str]:
    headers = {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
        **cors_headers(),
    }
    if extra:
        headers.update(extra)
    return headers


def _sse_response_headers(headers: dict[str, str]) -> bytes:
    return (
        "HTTP/1.1 200 OK\r\n"
        + "\r\n".join(f"{k}: {v}" for k, v in headers.items())
        + "\r\n\r\n"
    ).encode()


async def handle_client(reader: asyncio.StreamReader, writer: asyncio.StreamWriter) -> None:
    addr = writer.get_extra_info("peername")
    logger.info("client connected: %s", addr)
    try:
        method, raw_path, _headers, body = await _read_request(reader)
        if not method:
            writer.close()
            return
        path = raw_path.split("?")[0]

        # Preflight.
        if method == "OPTIONS":
            writer.write(_http_response(204, cors_headers(), b""))
            await writer.drain()
            writer.close()
            return

        if path == "/health" and method == "GET":
            data, status = await handle_health()
            writer.write(
                _http_response(
                    status,
                    {"Content-Type": "application/json", **cors_headers()},
                    _serialize(data),
                )
            )
            await writer.drain()
            writer.close()
            return

        if path == "/session" and method == "POST":
            data, status, extra_headers = await handle_session_create()
            response_headers = {"Content-Type": "application/json", **cors_headers(), **extra_headers}
            writer.write(_http_response(status, response_headers, _serialize(data)))
            await writer.drain()
            writer.close()
            return

        if path == "/turn" and method == "POST":
            if not body:
                writer.write(
                    _http_response(
                        400,
                        {"Content-Type": "application/json", **cors_headers()},
                        _serialize({"error": "Missing body"}),
                    )
                )
                await writer.drain()
                writer.close()
                return
            try:
                payload = json.loads(body.decode())
            except json.JSONDecodeError:
                writer.write(
                    _http_response(
                        400,
                        {"Content-Type": "application/json", **cors_headers()},
                        _serialize({"error": "Invalid JSON"}),
                    )
                )
                await writer.drain()
                writer.close()
                return

            session_id, message, history = _resolve_turn_request(payload)
            user_id = _sessions[session_id]["user_id"]
            if not message:
                writer.write(
                    _http_response(
                        400,
                        {"Content-Type": "application/json", **cors_headers()},
                        _serialize({"error": "Missing message"}),
                    )
                )
                await writer.drain()
                writer.close()
                return

            sse_headers = _sse_headers({"X-Session-Id": session_id})
            writer.write(_sse_response_headers(sse_headers))
            await writer.drain()

            async for chunk in stream_turn_events(session_id, user_id, message, history):
                writer.write(chunk.encode())
                await writer.drain()
            writer.close()
            return

        # 404 fallback.
        writer.write(
            _http_response(
                404,
                {"Content-Type": "application/json", **cors_headers()},
                _serialize({"error": "Not found"}),
            )
        )
        await writer.drain()
        writer.close()
    except Exception as exc:  # noqa: BLE001
        logger.exception("client error: %s", exc)
        try:
            writer.close()
        except Exception:
            pass


async def run_server() -> None:
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        logger.warning("ANTHROPIC_API_KEY not set — agent will refuse to run turns")

    server = await asyncio.start_server(handle_client, HOST, PORT)
    logger.info("Agent runner listening on http://%s:%s", HOST, PORT)
    logger.info("Endpoints:")
    logger.info("  GET  /health        - health check")
    logger.info("  POST /session       - create session")
    logger.info("  POST /turn          - process message (SSE; data: lines)")

    async with server:
        await server.serve_forever()


def run() -> None:
    asyncio.run(run_server())


if __name__ == "__main__":
    run()
