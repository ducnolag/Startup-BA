"""Last-ditch effort: try alternative URL patterns."""
import asyncio
import json
import re
import time
import httpx

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36"


def _trunc(s, n=200):
    s = re.sub(r"\s+", " ", str(s)).strip()
    return s if len(s) <= n else s[:n] + "…"


async def probe(name, url, **kw):
    t0 = time.time()
    try:
        async with httpx.AsyncClient(timeout=15, follow_redirects=True) as client:
            r = await client.get(url, **kw)
            elapsed = int((time.time() - t0) * 1000)
            ct = r.headers.get("content-type", "")
            html = r.text
            m1 = re.search(r'<script id="__NEXT_DATA__"[^>]*>(.+?)</script>', html, re.S)
            m2 = re.search(r'window\.__NEXT_DATA__\s*=\s*({.+?})</script>', html, re.S)
            m3 = re.search(r'window\.__INITIAL_STATE__\s*=\s*({.+?});', html, re.S)
            m4 = re.search(r'window\.__PRELOADED_STATE__\s*=\s*({.+?});', html, re.S)
            m5 = re.search(r'"items"\s*:\s*(\[.+?\])', html, re.S)
            blob = m1 or m2 or m3 or m4 or m5
            if blob:
                try:
                    data = json.loads(blob.group(1) if blob.lastindex else blob.group(1))
                    sample = str(list(data.keys())[:10]) if isinstance(data, dict) else f"list len={len(data)}"
                    print(f"[PASS] {name:<32} status={r.status_code} elapsed={elapsed}ms ct={ct[:30]}")
                    print(f"      sample keys: {_trunc(sample, 200)}")
                    return True
                except Exception as e:
                    print(f"[FAIL] {name:<32} found blob but JSON parse error: {_trunc(str(e), 100)}")
                    return False
            # check for ld+json
            mld = re.findall(r'<script type="application/ld\+json">(.+?)</script>', html, re.S)
            if mld:
                print(f"[PASS] {name:<32} status={r.status_code} found {len(mld)} ld+json blobs, html={len(html)}")
                for i, b in enumerate(mld[:2]):
                    try:
                        d = json.loads(b)
                        if isinstance(d, dict) and ("name" in d or "@type" in d):
                            print(f"      ld+json[{i}]: {d.get('@type', '?')} {d.get('name', '?')[:80]}")
                    except Exception:
                        pass
                return True
            print(f"[FAIL] {name:<32} status={r.status_code} ct={ct[:30]} html={len(html)} elapsed={elapsed}ms")
            # show what scripts we DID find
            scripts = re.findall(r'<script[^>]*src="([^"]+)"', html)
            if scripts:
                print(f"      found {len(scripts)} external scripts (first: {scripts[0][:80]})")
            return False
    except Exception as e:
        elapsed = int((time.time() - t0) * 1000)
        print(f"[FAIL] {name:<32} EXC elapsed={elapsed}ms {_trunc(str(e), 200)}")
        return False


async def main():
    print("== LAST-DITCH VERIFICATION ==")
    await probe("shopee_search_html", "https://shopee.vn/search",
                params={"keyword": "iphone"}, headers={"User-Agent": UA})
    await probe("tiki_search_html", "https://tiki.vn/search",
                params={"q": "iphone"}, headers={"User-Agent": UA})
    await probe("cellphones_search_html", "https://cellphones.com.vn/search",
                params={"q": "iphone"}, headers={"User-Agent": UA})
    await probe("cellphones_v1", "https://cellphones.com.vn/",
                params={"s": "iphone"}, headers={"User-Agent": UA})
    await probe("fptshop_search", "https://fptshop.com.vn/search",
                params={"q": "iphone"}, headers={"User-Agent": UA})
    await probe("phongvu", "https://phongvu.vn/search",
                params={"q": "iphone"}, headers={"User-Agent": UA})
    await probe("hoangha", "https://hoanghamobile.com/search",
                params={"q": "iphone"}, headers={"User-Agent": UA})
    await probe("dienmayxanh", "https://www.dienmayxanh.com.vn/search",
                params={"q": "iphone"}, headers={"User-Agent": UA})
    await probe("mediamart", "https://mediamart.vn/search",
                params={"q": "iphone"}, headers={"User-Agent": UA})
    await probe("nguyenkim", "https://www.nguyenkim.com/tim-kiem",
                params={"key": "iphone"}, headers={"User-Agent": UA})


if __name__ == "__main__":
    asyncio.run(main())
