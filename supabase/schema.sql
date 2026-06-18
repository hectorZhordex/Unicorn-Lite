-- ============================================================
-- ArtFlow - Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- CATEGORIES
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  icon        TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO categories (name, slug, icon) VALUES
  ('Logos',           'logos',          '✏️'),
  ('Posters',         'posters',        '🖼️'),
  ('Flyers',          'flyers',         '📄'),
  ('Wallpapers',      'wallpapers',     '🖥️'),
  ('Mockups',         'mockups',        '📱'),
  ('Social Media',    'social-media',   '📸'),
  ('PSD Templates',   'psd-templates',  '📁')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- ARTWORKS
-- ============================================================
CREATE TABLE IF NOT EXISTS artworks (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title         TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  description   TEXT,
  preview_url   TEXT NOT NULL,
  download_url  TEXT NOT NULL,
  category_id   UUID REFERENCES categories(id) ON DELETE SET NULL,
  tags          TEXT[] DEFAULT '{}',
  resolution    TEXT,
  file_size     TEXT,
  file_format   TEXT,
  views         INTEGER DEFAULT 0,
  downloads     INTEGER DEFAULT 0,
  is_featured   BOOLEAN DEFAULT FALSE,
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS artworks_category_idx ON artworks(category_id);
CREATE INDEX IF NOT EXISTS artworks_slug_idx ON artworks(slug);
CREATE INDEX IF NOT EXISTS artworks_featured_idx ON artworks(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS artworks_active_idx ON artworks(is_active) WHERE is_active = TRUE;

-- ============================================================
-- VERIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS verifications (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  artwork_id       UUID NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
  session_id       TEXT NOT NULL,
  steps_completed  INTEGER DEFAULT 0,
  required_steps   INTEGER DEFAULT 4,
  completed        BOOLEAN DEFAULT FALSE,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(artwork_id, session_id)
);

CREATE INDEX IF NOT EXISTS verifications_artwork_idx ON verifications(artwork_id);
CREATE INDEX IF NOT EXISTS verifications_session_idx ON verifications(session_id);

-- ============================================================
-- DOWNLOADS
-- ============================================================
CREATE TABLE IF NOT EXISTS downloads (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  artwork_id  UUID NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
  session_id  TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS downloads_artwork_idx ON downloads(artwork_id);
CREATE INDEX IF NOT EXISTS downloads_created_idx ON downloads(created_at);

-- ============================================================
-- STORED PROCEDURES
-- ============================================================

-- Increment views
CREATE OR REPLACE FUNCTION increment_views(artwork_id UUID)
RETURNS VOID AS $$
  UPDATE artworks SET views = views + 1 WHERE id = artwork_id;
$$ LANGUAGE SQL;

-- Increment downloads
CREATE OR REPLACE FUNCTION increment_downloads(artwork_id UUID)
RETURNS VOID AS $$
  UPDATE artworks SET downloads = downloads + 1 WHERE id = artwork_id;
$$ LANGUAGE SQL;

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER artworks_updated_at
  BEFORE UPDATE ON artworks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER verifications_updated_at
  BEFORE UPDATE ON verifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;

-- Public read for active artworks
CREATE POLICY "Public read artworks" ON artworks
  FOR SELECT USING (is_active = TRUE);

-- Public read categories
CREATE POLICY "Public read categories" ON categories
  FOR SELECT USING (TRUE);

-- Service role can do anything (for API routes)
CREATE POLICY "Service role full access artworks" ON artworks
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access verifications" ON verifications
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access downloads" ON downloads
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================================
-- SUPABASE STORAGE BUCKETS
-- ============================================================
-- Run these in Supabase Dashboard > Storage, or via API:

-- INSERT INTO storage.buckets (id, name, public) VALUES ('previews', 'previews', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('downloads', 'downloads', false);

-- Storage policies for previews (public read)
-- CREATE POLICY "Public read previews" ON storage.objects FOR SELECT USING (bucket_id = 'previews');
-- CREATE POLICY "Service upload previews" ON storage.objects FOR INSERT USING (auth.role() = 'service_role' AND bucket_id = 'previews');

-- Storage policies for downloads (authenticated via signed URLs only)
-- CREATE POLICY "Service manage downloads" ON storage.objects FOR ALL USING (auth.role() = 'service_role' AND bucket_id = 'downloads');
