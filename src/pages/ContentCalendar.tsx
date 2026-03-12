import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { StatusBadge } from '@/components/ui/StatusBadge'
import type { PipelineStatus } from '@/types/database'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

interface CalendarPiece {
  id: string
  title: string
  format: string
  pillar: string
  status: PipelineStatus
  color: string
}

// Demo data â will be replaced with Supabase queries
const demoWeek: Record<string, CalendarPiece[]> = {
  Mon: [
    { id: '1', title: '5 Myths About Protein', format: 'Reel', pillar: 'Health & Wellness', status: 'scripted', color: '#B5606B' },
  ],
  Tue: [],
  Wed: [
    { id: '2', title: 'My Morning Routine', format: 'Carousel', pillar: 'Lifestyle & Travel', status: 'filming', color: '#6B7280' },
    { id: '3', title: 'Client Win: Sarah', format: 'Stories', pillar: 'Community & Connection', status: 'idea', color: '#3D8E96' },
  ],
  Thu: [
    { id: '4', title: 'Why You\'re Not Seeing Results', format: 'Reel', pillar: 'Health & Wellness', status: 'editing', color: '#B5606B' },
  ],
  Fri: [
    { id: '5', title: 'Weekend Reset Challenge', format: 'Reel', pillar: 'Personal Transformation', status: 'scheduled', color: '#8B3A46' },
  ],
  Sat: [],
  Sun: [
    { id: '6', title: 'Week Ahead Preview', format: 'Stories', pillar: 'Community & Connection', status: 'idea', color: '#3D8E96' },
  ],
}

export function ContentCalendar() {
  const [view, setView] = useState<'week' | 'month'>('week')
  const [weekOffset, setWeekOffset] = useState(0)

  const getWeekLabel = () => {
    const now = new Date()
    const start = new Date(now)
    start.setDate(now.getDate() - now.getDay() + 1 + weekOffset * 7)
    const end = new Date(start)
    end.setDate(start.getDate() + 6)
    const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    return `${fmt(start)} â ${fmt(end)}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-near-black">Content Calendar</h1>
          <p className="text-sm text-gray-500 mt-1">Plan and schedule your content pipeline</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-brand-rose text-white rounded-lg text-sm font-medium hover:bg-brand-deep-rose transition-colors">
          <Plus className="w-4 h-4" />
          Add Piece
        </button>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between bg-white rounded-xl border border-gray-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setWeekOffset(w => w - 1)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          <span className="text-sm font-medium text-brand-near-black min-w-[180px] text-center">
            {getWeekLabel()}
          </span>
          <button
            onClick={() => setWeekOffset(w => w + 1)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => setWeekOffset(0)}
            className="text-xs text-brand-teal hover:text-brand-teal/80 font-medium ml-2"
          >
            Today
          </button>
        </div>

        <div className="flex gap-1 bg-gray-50 rounded-lg p-0.5">
          {(['week', 'month'] as const).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-md transition-colors capitalize',
                view === v ? 'bg-white text-brand-near-black shadow-sm' : 'text-gray-500 hover:text-gray-700'
              )}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Week Grid */}
      {view === 'week' && (
        <div className="grid grid-cols-7 gap-3">
          {DAYS.map(day => (
            <div key={day} className="space-y-2">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider text-center pb-1 border-b border-gray-100">
                {day}
              </div>
              <div className="space-y-2 min-h-[200px]">
                {(demoWeek[day] || []).map(piece => (
                  <div
                    key={piece.id}
                    className="bg-white rounded-lg border border-gray-100 p-3 cursor-pointer hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: piece.color }} />
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider">{piece.format}</span>
                    </div>
                    <p className="text-xs font-medium text-brand-near-black leading-snug mb-2">{piece.title}</p>
                    <StatusBadge status={piece.status} />
                  </div>
                ))}
                {/* Empty slot */}
                <button className="w-full border border-dashed border-gray-200 rounded-lg p-3 text-gray-300 hover:border-brand-teal hover:text-brand-teal transition-colors">
                  <Plus className="w-4 h-4 mx-auto" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Month placeholder */}
      {view === 'month' && (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <p className="text-sm text-gray-400">Month view coming in Phase 2</p>
        </div>
      )}
    </div>
  )
}
