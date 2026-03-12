import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { BrandProfile, VoiceRules, AudienceProfile, ContentPillar, Offer } from '@/types/database'

// Fixed brand profile ID for solo-operator mode
const BRAND_ID = '00000000-0000-0000-0000-000000000001'

export function useBrandProfile() {
  const [profile, setProfile] = useState<BrandProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('brand_profile')
      .select('*')
      .eq('id', BRAND_ID)
      .single()
      .then(({ data, error }) => {
        if (!error && data) setProfile(data)
        setLoading(false)
      })
  }, [])

  const update = async (updates: Partial<BrandProfile>) => {
    const { data, error } = await supabase
      .from('brand_profile')
      .update(updates)
      .eq('id', BRAND_ID)
      .select()
      .single()
    if (!error && data) setProfile(data)
    return { data, error }
  }

  return { profile, loading, update, brandId: BRAND_ID }
}

export function useVoiceRules() {
  const [rules, setRules] = useState<VoiceRules | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('voice_rules')
      .select('*')
      .eq('brand_profile_id', BRAND_ID)
      .single()
      .then(({ data, error }) => {
        if (!error && data) setRules(data)
        setLoading(false)
      })
  }, [])

  const update = async (updates: Partial<VoiceRules>) => {
    if (!rules) return { data: null, error: new Error('No rules loaded') }
    const { data, error } = await supabase
      .from('voice_rules')
      .update(updates)
      .eq('id', rules.id)
      .select()
      .single()
    if (!error && data) setRules(data)
    return { data, error }
  }

  return { rules, loading, update }
}

export function useAudienceProfiles() {
  const [profiles, setProfiles] = useState<AudienceProfile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('audience_profiles')
      .select('*')
      .eq('brand_profile_id', BRAND_ID)
      .order('is_default', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setProfiles(data)
        setLoading(false)
      })
  }, [])

  return { profiles, loading }
}

export function useContentPillars() {
  const [pillars, setPillars] = useState<ContentPillar[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('content_pillars')
      .select('*')
      .eq('brand_profile_id', BRAND_ID)
      .order('sort_order')
      .then(({ data, error }) => {
        if (!error && data) setPillars(data)
        setLoading(false)
      })
  }, [])

  return { pillars, loading }
}

export function useOffers() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('offers')
      .select('*')
      .eq('brand_profile_id', BRAND_ID)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setOffers(data)
        setLoading(false)
      })
  }, [])

  return { offers, loading }
}
