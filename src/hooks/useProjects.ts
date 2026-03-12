import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Project, ContentPiece, PipelineStatus, FeedbackRating } from '@/types/database'

const BRAND_ID = '00000000-0000-0000-0000-000000000001'

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('brand_profile_id', BRAND_ID)
      .order('updated_at', { ascending: false })
    if (!error && data) setProjects(data)
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const create = async (project: {
    title: string
    content_template_id?: string
    audience_profile_id?: string
    linked_offer_id?: string
    brief_responses?: Record<string, string>
    outline?: Record<string, unknown>
    status?: Project['status']
  }) => {
    const { data, error } = await supabase
      .from('projects')
      .insert({ ...project, brand_profile_id: BRAND_ID })
      .select()
      .single()
    if (!error && data) setProjects(prev => [data, ...prev])
    return { data, error }
  }

  const update = async (id: string, updates: Partial<Project>) => {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (!error && data) {
      setProjects(prev => prev.map(p => p.id === id ? data : p))
    }
    return { data, error }
  }

  return { projects, loading, create, update, refetch: fetch }
}

export function useContentPieces(projectId?: string) {
  const [pieces, setPieces] = useState<ContentPiece[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    if (!projectId) { setPieces([]); setLoading(false); return }
    setLoading(true)
    const { data, error } = await supabase
      .from('content_pieces')
      .select('*')
      .eq('project_id', projectId)
      .order('sort_order')
    if (!error && data) setPieces(data)
    setLoading(false)
  }, [projectId])

  useEffect(() => { fetch() }, [fetch])

  const create = async (piece: Omit<ContentPiece, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('content_pieces')
      .insert(piece)
      .select()
      .single()
    if (!error && data) setPieces(prev => [...prev, data])
    return { data, error }
  }

  const update = async (id: string, updates: Partial<ContentPiece>) => {
    const { data, error } = await supabase
      .from('content_pieces')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (!error && data) {
      setPieces(prev => prev.map(p => p.id === id ? data : p))
    }
    return { data, error }
  }

  const updatePipelineStatus = async (id: string, status: PipelineStatus) => {
    return update(id, { pipeline_status: status })
  }

  const setFeedback = async (id: string, rating: FeedbackRating, notes?: string) => {
    return update(id, { feedback_rating: rating, feedback_notes: notes || null })
  }

  const bulkCreate = async (piecesData: Omit<ContentPiece, 'id' | 'created_at' | 'updated_at'>[]) => {
    const { data, error } = await supabase
      .from('content_pieces')
      .insert(piecesData)
      .select()
    if (!error && data) setPieces(prev => [...prev, ...data])
    return { data, error }
  }

  return { pieces, loading, create, update, updatePipelineStatus, setFeedback, bulkCreate, refetch: fetch }
}

/** Fetch all posted pieces across all projects for the Performance Tracker */
export function usePostedPieces() {
  const [pieces, setPieces] = useState<(ContentPiece & { pillar_name?: string; pillar_color?: string })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      // Get posted pieces with their pillar info
      const { data: piecesData, error } = await supabase
        .from('content_pieces')
        .select('*, content_pillars!content_pieces_pillar_id_fkey(name, color_hex)')
        .eq('pipeline_status', 'posted')
        .order('publish_date', { ascending: false })

      if (!error && piecesData) {
        const enriched = piecesData.map((p: any) => ({
          ...p,
          pillar_name: p.content_pillars?.name || 'Uncategorized',
          pillar_color: p.content_pillars?.color_hex || '#6B7280',
        }))
        setPieces(enriched)
      }
      setLoading(false)
    })()
  }, [])

  return { pieces, loading }
}

/** Fetch pieces for the Content Calendar view */
export function useCalendarPieces(startDate: string, endDate: string) {
  const [pieces, setPieces] = useState<(ContentPiece & { pillar_name?: string; pillar_color?: string })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('content_pieces')
        .select('*, content_pillars!content_pieces_pillar_id_fkey(name, color_hex)')
        .gte('publish_date', startDate)
        .lte('publish_date', endDate)
        .order('publish_date')

      if (!error && data) {
        const enriched = data.map((p: any) => ({
          ...p,
          pillar_name: p.content_pillars?.name || 'Uncategorized',
          pillar_color: p.content_pillars?.color_hex || '#6B7280',
        }))
        setPieces(enriched)
      }
      setLoading(false)
    })()
  }, [startDate, endDate])

  return { pieces, loading }
}
