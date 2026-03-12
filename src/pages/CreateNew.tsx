import { useState } from 'react'
import {
  Film,
  BookOpen,
  Dumbbell,
  Mail,
  ShoppingBag,
  Users,
  ArrowLeft,
  Sparkles,
  Check,
  Pencil,
  Loader2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useContentGeneration } from '@/hooks/useContentGeneration'
import { useProjects, useContentPieces } from '@/hooks/useProjects'
import { useAudienceProfiles, useContentPillars, useOffers } from '@/hooks/useBrandProfile'

type Step = 'select' | 'brief' | 'generating' | 'review' | 'done'

const contentTypes = [
  {
    id: 'weekly_batch',
    icon: Film,
    title: 'Weekly Social Batch',
    description: '7-day content plan with hooks, scripts, and shot lists',
    estimate: '~5 min',
    color: 'text-brand-rose',
    bgColor: 'bg-brand-rose/5',
  },
  {
    id: 'ebook',
    icon: BookOpen,
    title: 'Ebook / PDF Guide',
    description: 'Structured long-form content with sections and tables',
    estimate: '~10 min',
    color: 'text-brand-teal',
    bgColor: 'bg-brand-teal/5',
  },
  {
    id: 'program',
    icon: Dumbbell,
    title: 'Multi-Week Program',
    description: 'Phased training or action plan with weekly breakdowns',
    estimate: '~10 min',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
  },
  {
    id: 'email_sequence',
    icon: Mail,
    title: 'Email Sequence',
    description: 'Connected emails with subject lines, CTAs, and timing',
    estimate: '~5 min',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
  },
  {
    id: 'sales_page',
    icon: ShoppingBag,
    title: 'Sales Page',
    description: 'Hero, problem, solution, proof, pricing, and CTA sections',
    estimate: '~8 min',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    id: 'client_resource',
    icon: Users,
    title: 'Client Resource',
    description: 'Onboarding packets, program guides, and FAQ docs',
    estimate: '~5 min',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
]

interface BriefAnswers {
  topic?: string
  audienceId?: string
  pillarId?: string
  offerId?: string
  formats?: string[]
  avoid?: string
  reviewFeedback?: boolean
  count?: number
  [key: string]: string | string[] | boolean | number | undefined
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

export function CreateNew() {
  const [step, setStep] = useState<Step>('select')
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [brief, setBrief] = useState<BriefAnswers>({ reviewFeedback: true })
  const [generated, setGenerated] = useState<GeneratedPiece[]>([])
  const [projectId, setProjectId] = useState<string | null>(null)

  const { generate, generating, error: genError } = useContentGeneration()
  const { create: createProject } = useProjects()
  const { bulkCreate } = useContentPieces(projectId || undefined)
  const { profiles: audiences } = useAudienceProfiles()
  const { pillars } = useContentPillars()
  const { offers } = useOffers()

  const handleSelectType = (typeId: string) => {
    setSelectedType(typeId)
    setBrief({ reviewFeedback: true })
    setStep('brief')
  }

  const handleGenerate = async () => {
    if (!selectedType) return
    setStep('generating')

    const pieces = await generate({
      contentType: selectedType as any,
      audienceId: brief.audienceId,
      pillarId: brief.pillarId,
      topicHint: brief.topic,
      count: brief.count || (selectedType === 'weekly_batch' ? 7 : undefined),
    })

    if (pieces && pieces.length > 0) {
      setGenerated(pieces)
      setStep('review')
    } else {
      setStep('brief') // Fall back on error
    }
  }

  const handlePushToPipeline = async () => {
    if (!selectedType || generated.length === 0) return

    // 1. Create the project
    const typeCfg = contentTypes.find(t => t.id === selectedType)
    const { data: project } = await createProject({
      title: brief.topic || `${typeCfg?.title} â ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
      audience_profile_id: brief.audienceId,
      linked_offer_id: brief.offerId,
      brief_responses: brief as any,
      status: 'in_progress',
    })

    if (!project) return

    setProjectId(project.id)

    // 2. Create all content pieces
    const piecesData = generated.map((piece, i) => ({
      project_id: project.id,
      title: piece.title,
      hook: piece.hook,
      script_body: piece.script_body,
      format: piece.format,
      pillar_id: piece.pillar_id || null,
      hashtags: piece.hashtags,
      cta_text: piece.cta_text,
      day_of_week: piece.day_of_week,
      pipeline_status: 'scripted' as const,
      sort_order: i + 1,
      week_number: null,
      shot_list: null,
      publish_date: null,
      feedback_rating: null,
      feedback_notes: null,
      perf_views: null,
      perf_likes: null,
      perf_saves: null,
      perf_shares: null,
      perf_comments: null,
      perf_notes: null,
    }))

    await bulkCreate(piecesData)
    setStep('done')
  }

  const handleStartOver = () => {
    setStep('select')
    setSelectedType(null)
    setBrief({ reviewFeedback: true })
    setGenerated([])
    setProjectId(null)
  }

  // ---- RENDER ----

  if (step === 'done') {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 space-y-4">
        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-brand-near-black">Content pushed to pipeline!</h1>
        <p className="text-gray-500">{generated.length} pieces created and ready for filming/scheduling.</p>
        <div className="flex gap-3 justify-center pt-4">
          <a
            href="/"
            className="px-4 py-2 bg-brand-rose text-white rounded-lg text-sm font-medium hover:bg-brand-deep-rose transition-colors"
          >
            View Dashboard
          </a>
          <button
            onClick={handleStartOver}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Create Another
          </button>
        </div>
      </div>
    )
  }

  if (step === 'generating') {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 space-y-4">
        <Loader2 className="w-10 h-10 text-brand-rose animate-spin mx-auto" />
        <h2 className="text-xl font-bold text-brand-near-black">Generating your content...</h2>
        <p className="text-sm text-gray-500">Assembling brand voice, checking recent feedback, and writing in your style.</p>
        {genError && (
          <div className="bg-red-50 border border-red-100 rounded-lg p-4 text-left mt-6">
            <p className="text-sm text-red-700 font-medium">Generation Error</p>
            <p className="text-sm text-red-600 mt-1">{genError}</p>
            <button
              onClick={() => setStep('brief')}
              className="mt-3 text-sm text-red-700 underline"
            >
              Go back and try again
            </button>
          </div>
        )}
      </div>
    )
  }

  if (step === 'review') {
    return (
      <ReviewStep
        pieces={generated}
        setPieces={setGenerated}
        contentType={selectedType!}
        onPush={handlePushToPipeline}
        onBack={() => setStep('brief')}
        pillars={pillars}
      />
    )
  }

  if (step === 'brief') {
    return (
      <BriefForm
        contentType={selectedType!}
        brief={brief}
        setBrief={setBrief}
        onBack={() => { setStep('select'); setSelectedType(null) }}
        onGenerate={handleGenerate}
        generating={generating}
        audiences={audiences}
        pillars={pillars}
        offers={offers}
      />
    )
  }

  // Step: select
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-near-black">Create New</h1>
        <p className="text-sm text-gray-500 mt-1">Choose a content type to get started</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {contentTypes.map(type => (
          <button
            key={type.id}
            onClick={() => handleSelectType(type.id)}
            className="text-left bg-white rounded-xl border border-gray-100 p-5 hover:border-brand-rose/30 hover:shadow-sm transition-all group"
          >
            <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center mb-3', type.bgColor)}>
              <type.icon className={cn('w-5 h-5', type.color)} />
            </div>
            <h3 className="font-semibold text-brand-near-black group-hover:text-brand-deep-rose transition-colors">
              {type.title}
            </h3>
            <p className="text-sm text-gray-500 mt-1">{type.description}</p>
            <p className="text-xs text-gray-400 mt-2">{type.estimate}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

// ============================
// BRIEF FORM
// ============================
function BriefForm({
  contentType,
  brief,
  setBrief,
  onBack,
  onGenerate,
  generating,
  audiences,
  pillars,
  offers,
}: {
  contentType: string
  brief: BriefAnswers
  setBrief: React.Dispatch<React.SetStateAction<BriefAnswers>>
  onBack: () => void
  onGenerate: () => void
  generating: boolean
  audiences: any[]
  pillars: any[]
  offers: any[]
}) {
  const type = contentTypes.find(t => t.id === contentType)
  const set = (key: string, val: any) => setBrief(prev => ({ ...prev, [key]: val }))

  return (
    <div className="max-w-2xl space-y-6">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-rose transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to content types
      </button>

      <div>
        <h1 className="text-2xl font-bold text-brand-near-black">{type?.title}</h1>
        <p className="text-sm text-gray-500 mt-1">Answer a few questions â your Brand Brain fills in the rest.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
        {/* Common fields */}
        <div>
          <label className="block text-sm font-medium text-brand-near-black mb-1">Topic / Theme</label>
          <textarea
            value={brief.topic || ''}
            onChange={e => set('topic', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal/30 bg-brand-cream/30 h-20 resize-none"
            placeholder={contentType === 'weekly_batch' ? 'breathwork, Sedona trip, new offer launch...' : 'Describe what you want to create...'}
          />
          <p className="text-xs text-gray-400 mt-1">Free text â what's on your mind?</p>
        </div>

        {/* Audience selector (all types) */}
        <div>
          <label className="block text-sm font-medium text-brand-near-black mb-1">Target Audience</label>
          <select
            value={brief.audienceId || ''}
            onChange={e => set('audienceId', e.target.value || undefined)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-teal bg-brand-cream/30"
          >
            <option value="">Default audience</option>
            {audiences.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>

        {/* Weekly batch specific */}
        {contentType === 'weekly_batch' && (
          <>
            <div>
              <label className="block text-sm font-medium text-brand-near-black mb-1">Number of pieces</label>
              <select
                value={brief.count || 7}
                onChange={e => set('count', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-teal bg-brand-cream/30"
              >
                {[5, 6, 7, 10].map(n => <option key={n} value={n}>{n} pieces</option>)}
              </select>
            </div>
            <FieldToggle
              label="Review last week's feedback before generating?"
              value={brief.reviewFeedback ?? true}
              onChange={v => set('reviewFeedback', v)}
            />
          </>
        )}

        {/* Email sequence specific */}
        {contentType === 'email_sequence' && (
          <>
            <div>
              <label className="block text-sm font-medium text-brand-near-black mb-1">Number of emails</label>
              <select
                value={brief.count || 5}
                onChange={e => set('count', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-teal bg-brand-cream/30"
              >
                {[3, 5, 7, 10].map(n => <option key={n} value={n}>{n} emails</option>)}
              </select>
            </div>
            {offers.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-brand-near-black mb-1">Linked Offer</label>
                <select
                  value={brief.offerId || ''}
                  onChange={e => set('offerId', e.target.value || undefined)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-teal bg-brand-cream/30"
                >
                  <option value="">None</option>
                  {offers.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                </select>
              </div>
            )}
          </>
        )}

        {/* Pillar selector for single-piece types */}
        {['sales_page', 'client_resource', 'program'].includes(contentType) && (
          <div>
            <label className="block text-sm font-medium text-brand-near-black mb-1">Content Pillar</label>
            <select
              value={brief.pillarId || ''}
              onChange={e => set('pillarId', e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-teal bg-brand-cream/30"
            >
              <option value="">Auto-assign</option>
              {pillars.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        )}

        {/* Avoid field */}
        <div>
          <label className="block text-sm font-medium text-brand-near-black mb-1">Anything to avoid?</label>
          <input
            type="text"
            value={brief.avoid || ''}
            onChange={e => set('avoid', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal/30 bg-brand-cream/30"
            placeholder="Optional â topics or formats to skip"
          />
        </div>

        <button
          onClick={onGenerate}
          disabled={generating}
          className="w-full py-3 bg-brand-rose text-white rounded-lg font-medium hover:bg-brand-deep-rose transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          Generate Content
        </button>
      </div>
    </div>
  )
}

// ============================
// REVIEW STEP
// ============================
function ReviewStep({
  pieces,
  setPieces,
  contentType,
  onPush,
  onBack,
  pillars,
}: {
  pieces: GeneratedPiece[]
  setPieces: (p: GeneratedPiece[]) => void
  contentType: string
  onPush: () => void
  onBack: () => void
  pillars: any[]
}) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0)
  const [pushing, setPushing] = useState(false)

  const handlePush = async () => {
    setPushing(true)
    await onPush()
    setPushing(false)
  }

  const getPillarName = (id: string) => pillars.find(p => p.id === id)?.name || 'Uncategorized'
  const getPillarColor = (id: string) => pillars.find(p => p.id === id)?.color_hex || '#6B7280'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-rose transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Regenerate
          </button>
          <h1 className="text-2xl font-bold text-brand-near-black">Review Generated Content</h1>
          <p className="text-sm text-gray-500 mt-1">{pieces.length} pieces ready â edit anything before pushing to pipeline.</p>
        </div>
        <button
          onClick={handlePush}
          disabled={pushing}
          className="px-6 py-3 bg-brand-rose text-white rounded-lg font-medium hover:bg-brand-deep-rose transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {pushing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          Push to Pipeline
        </button>
      </div>

      <div className="space-y-3">
        {pieces.map((piece, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            {/* Collapsed header */}
            <button
              onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-gray-400 w-6">{idx + 1}</span>
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: getPillarColor(piece.pillar_id) }} />
                <div>
                  <p className="font-semibold text-brand-near-black">{piece.title}</p>
                  <p className="text-xs text-gray-400">{piece.format} Â· {piece.day_of_week} Â· {getPillarName(piece.pillar_id)}</p>
                </div>
              </div>
              {expandedIndex === idx ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>

            {/* Expanded content */}
            {expandedIndex === idx && (
              <div className="px-5 pb-5 space-y-4 border-t border-gray-100 pt-4">
                <EditableField
                  label="Hook"
                  value={piece.hook}
                  onChange={val => {
                    const updated = [...pieces]
                    updated[idx] = { ...updated[idx], hook: val }
                    setPieces(updated)
                  }}
                />
                <EditableField
                  label="Script / Body"
                  value={piece.script_body}
                  multiline
                  onChange={val => {
                    const updated = [...pieces]
                    updated[idx] = { ...updated[idx], script_body: val }
                    setPieces(updated)
                  }}
                />
                <div className="flex gap-4">
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 font-medium mb-1">CTA</p>
                    <p className="text-sm text-brand-near-black">{piece.cta_text}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 font-medium mb-1">Hashtags</p>
                    <p className="text-sm text-brand-teal">{piece.hashtags?.join(' ')}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================
// REUSABLE COMPONENTS
// ============================
function EditableField({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string
  value: string
  onChange: (val: string) => void
  multiline?: boolean
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  if (editing) {
    return (
      <div>
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs text-gray-400 font-medium">{label}</p>
          <div className="flex gap-2">
            <button
              onClick={() => { onChange(draft); setEditing(false) }}
              className="text-xs text-brand-teal font-medium"
            >
              Save
            </button>
            <button
              onClick={() => { setDraft(value); setEditing(false) }}
              className="text-xs text-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
        {multiline ? (
          <textarea
            value={draft}
            onChange={e => setDraft(e.target.value)}
            className="w-full px-3 py-2 border border-brand-teal rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-teal/30 h-32 resize-none"
            autoFocus
          />
        ) : (
          <input
            type="text"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            className="w-full px-3 py-2 border border-brand-teal rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-teal/30"
            autoFocus
          />
        )}
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs text-gray-400 font-medium">{label}</p>
        <button onClick={() => setEditing(true)} className="text-gray-300 hover:text-brand-teal transition-colors">
          <Pencil className="w-3 h-3" />
        </button>
      </div>
      <p className="text-sm text-brand-near-black whitespace-pre-wrap">{value}</p>
    </div>
  )
}

function FieldToggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <label className="text-sm font-medium text-brand-near-black">{label}</label>
      <button
        onClick={() => onChange(!value)}
        className={cn(
          'relative w-10 h-5 rounded-full transition-colors',
          value ? 'bg-brand-teal' : 'bg-gray-300'
        )}
      >
        <span className={cn(
          'absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow-sm',
          value ? 'translate-x-5' : 'translate-x-0.5'
        )} />
      </button>
    </div>
  )
}
