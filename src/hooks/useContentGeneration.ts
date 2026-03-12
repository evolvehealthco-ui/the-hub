import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { ContentPiece, BrandProfile, VoiceRules, AudienceProfile, ContentPillar } from '@/types/database'

const BRAND_ID = '00000000-0000-0000-0000-000000000001'

interface GenerationRequest {
  contentType: 'weekly_batch' | 'single_piece' | 'ebook_outline' | 'email_sequence'
  audienceId?: string
  pillarId?: string
  topicHint?: string
  format?: string
  count?: number
}

interface GeneratedPiece {
  title: string
  hook: string
  script_body: string
  format: string
  pillar_id: string
  hashtags: string[]
  cta_text: string
  day_of_week: string
}

export function useContentGeneration() {
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generate = async (request: GenerationRequest): Promise<GeneratedPiece[] | null> => {
    setGenerating(true)
    setError(null)

    try {
      // 1. Assemble brand context from Supabase
      const context = await assembleBrandContext(request.audienceId)
      if (!context) throw new Error('Could not load brand context')

      // 2. Build the generation prompt
      const prompt = buildGenerationPrompt(context, request)

      // 3. Call the edge function
      const { data, error: fnError } = await supabase.functions.invoke('generate-content', {
        body: { prompt, request }
      })

      if (fnError) throw fnError
      return data?.pieces || null
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Generation failed'
      setError(msg)
      return null
    } finally {
      setGenerating(false)
    }
  }

  return { generate, generating, error }
}

// ------ Brand Context Assembly ------

interface BrandContext {
  profile: BrandProfile
  voice: VoiceRules
  audience: AudienceProfile
  pillars: ContentPillar[]
  recentFeedback: string[]
}

async function assembleBrandContext(audienceId?: string): Promise<BrandContext | null> {
  // Parallel fetch all brand data
  const [profileRes, voiceRes, audienceRes, pillarsRes, feedbackRes] = await Promise.all([
    supabase.from('brand_profile').select('*').eq('id', BRAND_ID).single(),
    supabase.from('voice_rules').select('*').eq('brand_profile_id', BRAND_ID).single(),
    audienceId
      ? supabase.from('audience_profiles').select('*').eq('id', audienceId).single()
      : supabase.from('audience_profiles').select('*').eq('brand_profile_id', BRAND_ID).eq('is_default', true).single(),
    supabase.from('content_pillars').select('*').eq('brand_profile_id', BRAND_ID).order('sort_order'),
    supabase.from('preferences_log').select('entry_text').eq('brand_profile_id', BRAND_ID).order('created_at', { ascending: false }).limit(10),
  ])

  if (!profileRes.data || !voiceRes.data || !audienceRes.data || !pillarsRes.data) return null

  return {
    profile: profileRes.data,
    voice: voiceRes.data,
    audience: audienceRes.data,
    pillars: pillarsRes.data,
    recentFeedback: (feedbackRes.data || []).map(f => f.entry_text),
  }
}

// ------ Prompt Builder ------

function buildGenerationPrompt(ctx: BrandContext, req: GenerationRequest): string {
  const { profile, voice, audience, pillars, recentFeedback } = ctx

  const pillarList = pillars.map(p => `- ${p.name} (${p.target_ratio}%): ${p.description}`).join('\n')
  const feedbackSection = recentFeedback.length > 0
    ? `\n## Recent Feedback & Learnings\n${recentFeedback.map(f => `- ${f}`).join('\n')}`
    : ''

  return `You are a content strategist writing as ${profile.business_name}.

## Brand Identity
Tagline: ${profile.tagline}
Mission: ${profile.mission}
Values: ${profile.values}
Personality: ${(profile.brand_personality_keywords || []).join(', ')}
Credentials: ${profile.credentials}

## Voice Rules
Signature phrases: ${(voice.signature_phrases || []).join(' | ')}
Language to use: ${voice.language_to_use}
Language to AVOID: ${voice.language_to_avoid}
Sentence style: ${voice.sentence_style}
Emotional tone: ${voice.emotional_tone}
${voice.additional_rules ? `Additional rules: ${voice.additional_rules}` : ''}

## Target Audience: ${audience.name}
Demographics: ${audience.demographics}
Pain points: ${audience.pain_points}
Aspirations: ${audience.aspirations}
Language they use: ${audience.language_they_use}

## Content Pillars
${pillarList}
${feedbackSection}

## Task
${getTaskInstructions(req, pillars)}

## Output Format
Return a JSON array of content pieces. Each piece must have:
- title (string): Compelling, scroll-stopping title
- hook (string): First line that grabs attention
- script_body (string): Full content body (formatted for the platform)
- format (string): e.g., "Reel", "Carousel", "Stories", "Static"
- pillar_id (string): UUID of the content pillar
- hashtags (string[]): 5-8 relevant hashtags
- cta_text (string): Call to action
- day_of_week (string): Suggested day (Mon-Sun)

IMPORTANT: Write in the brand's authentic voice. Never use language marked as "avoid". Match the emotional tone exactly.`
}

function getTaskInstructions(req: GenerationRequest, pillars: ContentPillar[]): string {
  switch (req.contentType) {
    case 'weekly_batch':
      return `Generate ${req.count || 7} content pieces for a full week of social media content.
Distribute across pillars proportionally to their target ratios.
Mix formats: at least 2 Reels, 1-2 Carousels, 1-2 Stories, 1 Static post.
${req.topicHint ? `Theme/focus for this week: ${req.topicHint}` : 'Choose timely, relevant topics for each pillar.'}`

    case 'single_piece':
      return `Generate 1 piece of content.
${req.format ? `Format: ${req.format}` : 'Choose the best format for maximum engagement.'}
${req.pillarId ? `Pillar: ${pillars.find(p => p.id === req.pillarId)?.name || 'Any'}` : ''}
${req.topicHint ? `Topic: ${req.topicHint}` : ''}`

    case 'ebook_outline':
      return `Create an outline for a lead magnet ebook.
${req.topicHint ? `Topic: ${req.topicHint}` : 'Choose a topic that addresses the audience\'s top pain point.'}
Include: title, subtitle, 8-12 chapter titles with 2-3 bullet points each, intro hook, closing CTA.`

    case 'email_sequence':
      return `Create a ${req.count || 5}-email nurture sequence.
${req.topicHint ? `Theme: ${req.topicHint}` : 'Welcome/onboarding sequence for new subscribers.'}
Each email needs: subject line, preview text, body, CTA.`

    default:
      return req.topicHint || 'Generate engaging content that serves the audience.'
  }
}
