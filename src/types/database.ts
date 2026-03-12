export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      brand_profile: {
        Row: BrandProfile
        Insert: Omit<BrandProfile, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<BrandProfile, 'id'>>
      }
      voice_rules: {
        Row: VoiceRules
        Insert: Omit<VoiceRules, 'id' | 'updated_at'>
        Update: Partial<Omit<VoiceRules, 'id'>>
      }
      audience_profiles: {
        Row: AudienceProfile
        Insert: Omit<AudienceProfile, 'id' | 'created_at'>
        Update: Partial<Omit<AudienceProfile, 'id'>>
      }
      content_pillars: {
        Row: ContentPillar
        Insert: Omit<ContentPillar, 'id'>
        Update: Partial<Omit<ContentPillar, 'id'>>
      }
      offers: {
        Row: Offer
        Insert: Omit<Offer, 'id' | 'created_at'>
        Update: Partial<Omit<Offer, 'id'>>
      }
      sample_content: {
        Row: SampleContent
        Insert: Omit<SampleContent, 'id' | 'created_at'>
        Update: Partial<Omit<SampleContent, 'id'>>
      }
      content_templates: {
        Row: ContentTemplate
        Insert: Omit<ContentTemplate, 'id' | 'created_at'>
        Update: Partial<Omit<ContentTemplate, 'id'>>
      }
      projects: {
        Row: Project
        Insert: Omit<Project, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Project, 'id'>>
      }
      content_pieces: {
        Row: ContentPiece
        Insert: Omit<ContentPiece, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<ContentPiece, 'id'>>
      }
      preferences_log: {
        Row: PreferencesLog
        Insert: Omit<PreferencesLog, 'id' | 'created_at'>
        Update: Partial<Omit<PreferencesLog, 'id'>>
      }
      autopilot_settings: {
        Row: AutopilotSettings
        Insert: Omit<AutopilotSettings, 'id' | 'updated_at'>
        Update: Partial<Omit<AutopilotSettings, 'id'>>
      }
    }
  }
}

export interface BrandProfile {
  id: string
  business_name: string
  tagline: string | null
  origin_story: string | null
  brand_personality_keywords: string[] | null
  mission: string | null
  values: string | null
  credentials: string | null
  key_stats: string | null
  created_at: string
  updated_at: string
}

export interface VoiceRules {
  id: string
  brand_profile_id: string
  signature_phrases: string[] | null
  language_to_use: string | null
  language_to_avoid: string | null
  sentence_style: string | null
  emotional_tone: string | null
  additional_rules: string | null
  updated_at: string
}

export interface AudienceProfile {
  id: string
  brand_profile_id: string
  name: string
  demographics: string | null
  pain_points: string | null
  aspirations: string | null
  language_they_use: string | null
  is_default: boolean
  created_at: string
}

export interface ContentPillar {
  id: string
  brand_profile_id: string
  name: string
  description: string | null
  target_ratio: number
  color_hex: string
  sort_order: number
}

export interface Offer {
  id: string
  brand_profile_id: string
  name: string
  type: 'lead_magnet' | 'paid_product' | 'service' | 'event'
  price_point: string | null
  target_audience_id: string | null
  description: string | null
  cta_text: string | null
  url: string | null
  status: 'active' | 'draft' | 'retired'
  created_at: string
}

export interface SampleContent {
  id: string
  brand_profile_id: string
  title: string
  content_type: 'reel_script' | 'carousel' | 'email' | 'ebook_excerpt' | 'caption'
  content_body: string
  why_it_worked: string | null
  performance_views: number | null
  performance_saves: number | null
  performance_shares: number | null
  created_at: string
}

export interface ContentTemplate {
  id: string
  content_type: 'weekly_batch' | 'ebook' | 'program' | 'email_sequence' | 'sales_page' | 'client_resource'
  name: string
  brief_questions: Json
  default_outline_structure: Json
  system_prompt_template: string
  output_format: string
  created_at: string
}

export interface Project {
  id: string
  brand_profile_id: string
  content_template_id: string | null
  audience_profile_id: string | null
  linked_offer_id: string | null
  title: string
  brief_responses: Json | null
  outline: Json | null
  status: 'draft' | 'in_progress' | 'complete' | 'archived'
  created_at: string
  updated_at: string
}

export type PipelineStatus = 'idea' | 'scripted' | 'filming' | 'editing' | 'scheduled' | 'posted'
export type FeedbackRating = 'fire' | 'tweak' | 'redo'

export interface ContentPiece {
  id: string
  project_id: string
  week_number: number | null
  day_of_week: string | null
  pillar_id: string | null
  format: string
  title: string
  hook: string | null
  script_body: string | null
  shot_list: Json | null
  hashtags: string[] | null
  cta_text: string | null
  publish_date: string | null
  pipeline_status: PipelineStatus
  feedback_rating: FeedbackRating | null
  feedback_notes: string | null
  perf_views: number | null
  perf_likes: number | null
  perf_saves: number | null
  perf_shares: number | null
  perf_comments: number | null
  perf_notes: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

export interface PreferencesLog {
  id: string
  brand_profile_id: string
  source: 'feedback_rating' | 'performance_note' | 'weekly_retro' | 'manual'
  content_piece_id: string | null
  entry_text: string
  created_at: string
}

export interface AutopilotSettings {
  id: string
  brand_profile_id: string
  is_enabled: boolean
  frequency: 'weekly' | 'biweekly' | 'monthly'
  generation_day: string
  generation_time: string
  auto_publish_to_pipeline: boolean
  read_feedback_before_generating: boolean
  notification_method: 'push' | 'email' | 'both'
  pieces_per_batch: number
  updated_at: string
}
