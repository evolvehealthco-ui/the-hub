-- The Hub â Initial Database Schema
-- All 11 tables for the Content Command Center

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. Brand Profile (core identity)
-- ============================================================
CREATE TABLE brand_profile (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_name TEXT NOT NULL,
  tagline TEXT,
  origin_story TEXT,
  brand_personality_keywords TEXT[],
  mission TEXT,
  values TEXT,
  credentials TEXT,
  key_stats TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 2. Voice Rules
-- ============================================================
CREATE TABLE voice_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_profile_id UUID NOT NULL REFERENCES brand_profile(id) ON DELETE CASCADE,
  signature_phrases TEXT[],
  language_to_use TEXT,
  language_to_avoid TEXT,
  sentence_style TEXT,
  emotional_tone TEXT,
  additional_rules TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 3. Audience Profiles
-- ============================================================
CREATE TABLE audience_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_profile_id UUID NOT NULL REFERENCES brand_profile(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  demographics TEXT,
  pain_points TEXT,
  aspirations TEXT,
  language_they_use TEXT,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 4. Content Pillars
-- ============================================================
CREATE TABLE content_pillars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_profile_id UUID NOT NULL REFERENCES brand_profile(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  target_ratio INTEGER NOT NULL DEFAULT 25,
  color_hex TEXT NOT NULL DEFAULT '#6B7280',
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- ============================================================
-- 5. Offers
-- ============================================================
CREATE TABLE offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_profile_id UUID NOT NULL REFERENCES brand_profile(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('lead_magnet', 'paid_product', 'service', 'event')),
  price_point TEXT,
  target_audience_id UUID REFERENCES audience_profiles(id) ON DELETE SET NULL,
  description TEXT,
  cta_text TEXT,
  url TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'draft', 'retired')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 6. Sample Content
-- ============================================================
CREATE TABLE sample_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_profile_id UUID NOT NULL REFERENCES brand_profile(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('reel_script', 'carousel', 'email', 'ebook_excerpt', 'caption')),
  content_body TEXT NOT NULL,
  why_it_worked TEXT,
  performance_views INTEGER,
  performance_saves INTEGER,
  performance_shares INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 7. Content Templates
-- ============================================================
CREATE TABLE content_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_type TEXT NOT NULL CHECK (content_type IN ('weekly_batch', 'ebook', 'program', 'email_sequence', 'sales_page', 'client_resource')),
  name TEXT NOT NULL,
  brief_questions JSONB NOT NULL DEFAULT '[]'::jsonb,
  default_outline_structure JSONB NOT NULL DEFAULT '[]'::jsonb,
  system_prompt_template TEXT NOT NULL DEFAULT '',
  output_format TEXT NOT NULL DEFAULT 'markdown',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 8. Projects
-- ============================================================
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_profile_id UUID NOT NULL REFERENCES brand_profile(id) ON DELETE CASCADE,
  content_template_id UUID REFERENCES content_templates(id) ON DELETE SET NULL,
  audience_profile_id UUID REFERENCES audience_profiles(id) ON DELETE SET NULL,
  linked_offer_id UUID REFERENCES offers(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  brief_responses JSONB,
  outline JSONB,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'complete', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 9. Content Pieces
-- ============================================================
CREATE TABLE content_pieces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  week_number INTEGER,
  day_of_week TEXT,
  pillar_id UUID REFERENCES content_pillars(id) ON DELETE SET NULL,
  format TEXT NOT NULL,
  title TEXT NOT NULL,
  hook TEXT,
  script_body TEXT,
  shot_list JSONB,
  hashtags TEXT[],
  cta_text TEXT,
  publish_date DATE,
  pipeline_status TEXT NOT NULL DEFAULT 'idea' CHECK (pipeline_status IN ('idea', 'scripted', 'filming', 'editing', 'scheduled', 'posted')),
  feedback_rating TEXT CHECK (feedback_rating IN ('fire', 'tweak', 'redo')),
  feedback_notes TEXT,
  perf_views INTEGER,
  perf_likes INTEGER,
  perf_saves INTEGER,
  perf_shares INTEGER,
  perf_comments INTEGER,
  perf_notes TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 10. Preferences Log (learning loop)
-- ============================================================
CREATE TABLE preferences_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_profile_id UUID NOT NULL REFERENCES brand_profile(id) ON DELETE CASCADE,
  source TEXT NOT NULL CHECK (source IN ('feedback_rating', 'performance_note', 'weekly_retro', 'manual')),
  content_piece_id UUID REFERENCES content_pieces(id) ON DELETE SET NULL,
  entry_text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 11. Autopilot Settings
-- ============================================================
CREATE TABLE autopilot_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_profile_id UUID NOT NULL REFERENCES brand_profile(id) ON DELETE CASCADE,
  is_enabled BOOLEAN NOT NULL DEFAULT false,
  frequency TEXT NOT NULL DEFAULT 'weekly' CHECK (frequency IN ('weekly', 'biweekly', 'monthly')),
  generation_day TEXT NOT NULL DEFAULT 'Sunday',
  generation_time TEXT NOT NULL DEFAULT '20:00',
  auto_publish_to_pipeline BOOLEAN NOT NULL DEFAULT false,
  read_feedback_before_generating BOOLEAN NOT NULL DEFAULT true,
  notification_method TEXT NOT NULL DEFAULT 'push' CHECK (notification_method IN ('push', 'email', 'both')),
  pieces_per_batch INTEGER NOT NULL DEFAULT 7,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- Indexes for performance
-- ============================================================
CREATE INDEX idx_voice_rules_brand ON voice_rules(brand_profile_id);
CREATE INDEX idx_audience_profiles_brand ON audience_profiles(brand_profile_id);
CREATE INDEX idx_content_pillars_brand ON content_pillars(brand_profile_id);
CREATE INDEX idx_offers_brand ON offers(brand_profile_id);
CREATE INDEX idx_sample_content_brand ON sample_content(brand_profile_id);
CREATE INDEX idx_projects_brand ON projects(brand_profile_id);
CREATE INDEX idx_content_pieces_project ON content_pieces(project_id);
CREATE INDEX idx_content_pieces_status ON content_pieces(pipeline_status);
CREATE INDEX idx_content_pieces_publish ON content_pieces(publish_date);
CREATE INDEX idx_preferences_log_brand ON preferences_log(brand_profile_id);
CREATE INDEX idx_autopilot_brand ON autopilot_settings(brand_profile_id);

-- ============================================================
-- Updated_at triggers
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_brand_profile_updated
  BEFORE UPDATE ON brand_profile
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_voice_rules_updated
  BEFORE UPDATE ON voice_rules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_projects_updated
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_content_pieces_updated
  BEFORE UPDATE ON content_pieces
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_autopilot_updated
  BEFORE UPDATE ON autopilot_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
