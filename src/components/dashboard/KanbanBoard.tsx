import { useState } from 'react'
import { Film, Image, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PipelineStatus, ContentPiece } from '@/types/database'

const columns: { status: PipelineStatus; label: string; color: string }[] = [
  { status: 'idea', label: 'Idea', color: 'border-t-gray-300' },
  { status: 'scripted', label: 'Scripted', color: 'border-t-blue-400' },
  { status: 'filming', label: 'Filming', color: 'border-t-amber-400' },
  { status: 'editing', label: 'Editing', color: 'border-t-purple-400' },
  { status: 'scheduled', label: 'Scheduled', color: 'border-t-brand-teal' },
  { status: 'posted', label: 'Posted', color: 'border-t-green-500' },
]

const formatIcons: Record<string, typeof Film> = {
  reel: Film,
  carousel: Image,
  stories: MessageCircle,
}

// Demo data for initial render
const demoCards: Partial<ContentPiece>[] = [
  { id: '1', title: 'Breathwork for Beginners', format: 'reel', pipeline_status: 'scripted', day_of_week: 'Monday' },
  { id: '2', title: 'The 3 Lies You Tell Yourself', format: 'reel', pipeline_status: 'scripted', day_of_week: 'Tuesday' },
  { id: '3', title: 'My Sedona Packing List', format: 'carousel', pipeline_status: 'filming', day_of_week: 'Wednesday' },
  { id: '4', title: 'Why I Stopped Counting Calories', format: 'reel', pipeline_status: 'editing', day_of_week: 'Thursday' },
  { id: '5', title: 'April Retreat Early Bird', format: 'reel', pipeline_status: 'scheduled', day_of_week: 'Friday' },
  { id: '6', title: '5-Minute Morning Stretch', format: 'reel', pipeline_status: 'posted', day_of_week: 'Saturday' },
  { id: '7', title: 'Sunday Reset Ritual', format: 'carousel', pipeline_status: 'idea', day_of_week: 'Sunday' },
]

export function KanbanBoard() {
  const [cards, setCards] = useState(demoCards)
  const [dragging, setDragging] = useState<string | null>(null)

  function handleDragStart(id: string) {
    setDragging(id)
  }

  function handleDrop(targetStatus: PipelineStatus) {
    if (!dragging) return
    setCards(prev =>
      prev.map(c => (c.id === dragging ? { ...c, pipeline_status: targetStatus } : c))
    )
    setDragging(null)
  }

  return (
    <div className="grid grid-cols-6 gap-3">
      {columns.map(col => {
        const colCards = cards.filter(c => c.pipeline_status === col.status)
        return (
          <div
            key={col.status}
            className={cn(
              'bg-white rounded-xl border border-gray-100 border-t-4 min-h-[300px]',
              col.color
            )}
            onDragOver={e => e.preventDefault()}
            onDrop={() => handleDrop(col.status)}
          >
            <div className="p-3 border-b border-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {col.label}
                </h3>
                <span className="text-xs text-gray-400 bg-gray-50 rounded-full w-5 h-5 flex items-center justify-center">
                  {colCards.length}
                </span>
              </div>
            </div>
            <div className="p-2 space-y-2">
              {colCards.map(card => {
                const FormatIcon = formatIcons[card.format || 'reel'] || Film
                return (
                  <div
                    key={card.id}
                    draggable
                    onDragStart={() => handleDragStart(card.id!)}
                    className={cn(
                      'bg-brand-cream/50 rounded-lg p-3 cursor-grab active:cursor-grabbing border border-transparent hover:border-brand-rose/20 transition-all',
                      dragging === card.id && 'opacity-40'
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-brand-near-black leading-tight">
                        {card.title}
                      </p>
                      <FormatIcon className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5">{card.day_of_week}</p>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
