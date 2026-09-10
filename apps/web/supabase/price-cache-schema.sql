-- =====================================================================
-- Supabase schema cho price-scraper cache
-- Chạy trong Supabase SQL Editor: https://app.supabase.com/project/_/sql
-- =====================================================================

CREATE TABLE IF NOT EXISTS price_cache (
  url_hash text PRIMARY KEY,
  payload jsonb NOT NULL,
  scraped_at timestamptz NOT NULL DEFAULT now()
);

-- Index để cleanup expired rows
CREATE INDEX IF NOT EXISTS idx_price_cache_scraped_at ON price_cache(scraped_at);

-- Auto-cleanup: tự xóa cache > 7 ngày (giữ an toàn ngoài TTL 24h)
-- Có thể chạy manually: DELETE FROM price_cache WHERE scraped_at < now() - interval '7 days';

-- Optional: enable RLS nhưng service role bypass
ALTER TABLE price_cache ENABLE ROW LEVEL SECURITY;

-- Service role bypasses RLS, không cần policy cho public read