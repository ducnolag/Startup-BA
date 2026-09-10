"""Verify fallback sources for Shopee/Lazada (Tier 2)."""
import asyncio
import json
import re
import sys
import time
from typing import Any

import httpx

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36"


def _trunc(s: str, n: int = 220) -> str:
    s = re.sub(r"\s+", " ", s).strip()
    return s if len(s) <= n else s[:n] + "…"


def _result(name: str, ok: bool, status, elapsed, sample=None, error=None, notes=None):
    return {
        "name": name,
        "ok": ok,
        "status": status,
        "elapsed_ms": elapsed,
        "sample": sample,
        "error": _trunc(str(error), 200) if error else None,
        "notes": notes,
    }


async def test_shopee_session():
    t0 = time.time()
    try:
        async with httpx.AsyncClient(timeout=12, follow_redirects=True) as client:
            r0 = await client.get(
                "https://shopee.vn/",
                headers={
                    "User-Agent": UA,
                    "Accept": "text/html,application/xhtml+xml",
                    "Accept-Language": "vi-VN,vi;q=0.9",
                },
            )
            cookies = dict(r0.cookies)
            r = await client.get(
                "https://shopee.vn/api/v4/search/search_items",
                params={"by": "relevancy", "keyword": "iphone", "limit": 10},
                headers={
                    "User-Agent": UA,
                    "Accept": "application/json",
                    "Accept-Language": "vi-VN,vi;q=0.9",
                    "Referer": "https://shopee.vn/search?keyword=iphone",
                    "Origin": "https://shopee.vn",
                    "X-Requested-With": "XMLHttpRequest",
                    "Sec-Fetch-Site": "same-origin",
                },
                cookies=cookies,
            )
            elapsed = int((time.time() - t0) * 1000)
            if r.status_code == 200:
                data = r.json()
                items = data.get("items") or []
                sample = items[:2] if items else data
                return _result("shopee_session", True, r.status_code, elapsed, sample=sample,
                               notes=f"items={len(items)} cookies={list(cookies.keys())[:5]}")
            return _result("shopee_session", False, r.status_code, elapsed,
                           error=_trunc(r.text, 200))
    except Exception as e:
        return _result("shopee_session", False, None, int((time.time() - t0) * 1000), error=str(e))


async def test_lazada_html():
    t0 = time.time()
    try:
        async with httpx.AsyncClient(timeout=12, follow_redirects=True) as client:
            r = await client.get(
                "https://www.lazada.vn/tag/iphone/",
                headers={
                    "User-Agent": UA,
                    "Accept": "text/html,application/xhtml+xml",
                    "Accept-Language": "vi-VN,vi;q=0.9",
                },
            )
            elapsed = int((time.time() - t0) * 1000)
            html = r.text
            m = re.search(r"window\.__NEXT_DATA__\s*=\s*({.+?})</script>", html, re.S)
            m2 = re.search(r"window\.pageData\s*=\s*({.+?});\s*</script>", html, re.S)
            blob = m.group(1) if m else (m2.group(1) if m2 else None)
            if blob:
                data = json.loads(blob)
                return _result("lazada_html", True, r.status_code, elapsed,
                               sample=str(list(data.keys())[:15]),
                               notes="found pageData/__NEXT_DATA__")
            m3 = re.search(r'<script type="application/ld\+json">(.+?)</script>', html, re.S)
            if m3:
                ld = json.loads(m3.group(1))
                return _result("lazada_html", True, r.status_code, elapsed,
                               sample=str(ld)[:300], notes="found ld+json")
            return _result("lazada_html", False, r.status_code, elapsed,
                           error=f"no JSON blob (html len={len(html)})")
    except Exception as e:
        return _result("lazada_html", False, None, int((time.time() - t0) * 1000), error=str(e))


async def test_cellphones():
    t0 = time.time()
    try:
        async with httpx.AsyncClient(timeout=12, follow_redirects=True) as client:
            r = await client.get(
                "https://cellphones.com.vn/api/v1/search",
                params={"q": "iphone", "limit": 10},
                headers={
                    "User-Agent": UA,
                    "Accept": "application/json",
                    "Origin": "https://cellphones.com.vn",
                    "Referer": "https://cellphones.com.vn/",
                },
            )
            elapsed = int((time.time() - t0) * 1000)
            if r.status_code == 200:
                try:
                    data = r.json()
                    sample = data if isinstance(data, list) else data.get("data") or data.get("products") or data
                    items = sample if isinstance(sample, list) else []
                    return _result("cellphones_api", True, r.status_code, elapsed,
                                   sample=str(items[:1])[:400] if items else str(list(data.keys())[:10]),
                                   notes=f"items={len(items) if isinstance(items, list) else 'n/a'}")
                except json.JSONDecodeError:
                    return _result("cellphones_api", False, r.status_code, elapsed,
                                   error=f"JSONDecode, html len={len(r.text)}")
            return _result("cellphones_api", False, r.status_code, elapsed,
                           error=_trunc(r.text, 200))
    except Exception as e:
        return _result("cellphones_api", False, None, int((time.time() - t0) * 1000), error=str(e))


async def test_cellphones_html():
    t0 = time.time()
    try:
        async with httpx.AsyncClient(timeout=12, follow_redirects=True) as client:
            r = await client.get(
                "https://cellphones.com.vn/v2/search",
                params={"query": "iphone"},
                headers={"User-Agent": UA, "Accept": "text/html"},
            )
            elapsed = int((time.time() - t0) * 1000)
            html = r.text
            m = re.search(r'<script id="__NEXT_DATA__" type="application/json">(.+?)</script>', html, re.S)
            if m:
                data = json.loads(m.group(1))
                return _result("cellphones_html", True, r.status_code, elapsed,
                               sample=str(list(data.keys())[:10]),
                               notes="found __NEXT_DATA__")
            return _result("cellphones_html", False, r.status_code, elapsed,
                           error=f"no __NEXT_DATA__ (html len={len(html)})")
    except Exception as e:
        return _result("cellphones_html", False, None, int((time.time() - t0) * 1000), error=str(e))


async def test_fpt_api():
    t0 = time.time()
    try:
        async with httpx.AsyncClient(timeout=12, follow_redirects=True) as client:
            r = await client.get(
                "https://api.fptshop.com.vn/v1/public/search",
                params={"q": "iphone", "limit": 10},
                headers={"User-Agent": UA, "Accept": "application/json"},
            )
            elapsed = int((time.time() - t0) * 1000)
            if r.status_code == 200:
                try:
                    data = r.json()
                    items = data if isinstance(data, list) else (data.get("data") or data.get("items") or [])
                    return _result("fpt_api", True, r.status_code, elapsed,
                                   sample=str(items[:1])[:400] if items else str(list(data.keys())[:10]),
                                   notes=f"items={len(items) if isinstance(items, list) else 'n/a'}")
                except json.JSONDecodeError:
                    return _result("fpt_api", False, r.status_code, elapsed,
                                   error=f"JSONDecode, html len={len(r.text)}")
            return _result("fpt_api", False, r.status_code, elapsed,
                           error=_trunc(r.text, 200))
    except Exception as e:
        return _result("fpt_api", False, None, int((time.time() - t0) * 1000), error=str(e))


async def test_fpt_html():
    t0 = time.time()
    try:
        async with httpx.AsyncClient(timeout=12, follow_redirects=True) as client:
            r = await client.get(
                "https://fptshop.com.vn/tim-kiem",
                params={"key": "iphone"},
                headers={"User-Agent": UA, "Accept": "text/html"},
            )
            elapsed = int((time.time() - t0) * 1000)
            html = r.text
            m = re.search(r'<script id="__NEXT_DATA__" type="application/json">(.+?)</script>', html, re.S)
            if m:
                data = json.loads(m.group(1))
                return _result("fpt_html", True, r.status_code, elapsed,
                               sample=str(list(data.keys())[:10]),
                               notes="found __NEXT_DATA__")
            m2 = re.search(r'window\.__INITIAL_STATE__\s*=\s*({.+?});', html, re.S)
            if m2:
                data = json.loads(m2.group(1))
                return _result("fpt_html", True, r.status_code, elapsed,
                               sample=str(list(data.keys())[:10]),
                               notes="found __INITIAL_STATE__")
            return _result("fpt_html", False, r.status_code, elapsed,
                           error=f"no data blob (html len={len(html)})")
    except Exception as e:
        return _result("fpt_html", False, None, int((time.time() - t0) * 1000), error=str(e))


async def main():
    tests = [
        test_shopee_session(),
        test_lazada_html(),
        test_cellphones(),
        test_cellphones_html(),
        test_fpt_api(),
        test_fpt_html(),
    ]
    results = await asyncio.gather(*tests, return_exceptions=True)
    print("== FALLBACK API VERIFICATION (Tier 1: Tiki; Tier 2 candidates: Shopee-session, Lazada-HTML, CellphoneS, FPT) ==")
    for r in results:
        if isinstance(r, Exception):
            print(f"[ERR] {r}")
            continue
        flag = "PASS" if r["ok"] else "FAIL"
        print(f"[{flag}] {r['name']:<22} status={r['status']} elapsed={r['elapsed_ms']}ms")
        if r.get("notes"):
            print(f"      notes: {r['notes']}")
        if r.get("error"):
            print(f"      error: {r['error']}")
        if r.get("sample"):
            print(f"      sample: {_trunc(str(r['sample']), 280)}")
    pass_count = sum(1 for r in results if isinstance(r, dict) and r.get("ok"))
    print(f"\n>> TIER 2 candidates PASS: {pass_count}/{len(results)}")


if __name__ == "__main__":
    asyncio.run(main())
