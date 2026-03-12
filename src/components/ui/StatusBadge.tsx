import { cn } from '@/lib/utils'
import type { PipelineStatus, FeedbackRating } from '@/types/database'

const statusColors: Record<PipelineStatus, string> = {
  idea: 'bg-gray-100 text-gray-600',
  scripted: 'bg-blue-50 text-blue-700',
  filming: 'bg-amber-50 text-amber-700',
  editing: 'bg-purple-50 text-purple-700',
  scheduled: 'bg-brand-teal/10 text-brand-teal',
  posted: 'bg-green-50 text-green-700',
}

const statusLabels: Record<PipelineStatus, string> = {
  idea: 'Idea',
  scripted: 'Scripted',
  filming: 'Filming',
  editing: 'Editing',
  scheduled: 'Scheduled',
  posted: 'Posted',
}

export function StatusBadge({ status }: { status: PipelineStatus }) {
  return (
    <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', statusColors[status])}>
      {statusLabels[status]}
    </span>
  )
}

const feedbackIcons: Record<FeedbackRating, { emoji: string; label: string }> = {
  fire: { emoji: '\uD83D\uDD25', label: 'Fire' },
  tweak: { emoji: '\u270F\uFE0F', label: 'Tweak' },
  redo: { emoji: '\uD83D\uDD04', label: 'Redo' },
}

export function FeedbackBadge({ rating }: { rating: FeedbackRating }) {
  const { emoji, label } = feedbackIcons[rating]
  return (
    <span className="inline-flex items-center gap-1 text-xs" title={label}>
      {emoji}
    </span>
  )
}
