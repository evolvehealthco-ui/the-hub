import { useState } from 'react'
import { TrendingUp, Eye, Heart, Bookmark, Share2, MessageCircle, Flame, Pencil, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { StatusBadge } from '@/components/ui/StatusBadge'
import type { FeedbackRating } from '@/types/database'

interface PostedPiece {
  id: string
  title: string
  format: string
  pillar: string
  pillarColor: string
  publishDate: string
  views: number
  likes: number
  saves: number
  shares: number
  comments: number
  feedbackRating: FeedbackRating | null
  feedbackNotes: string | null
}

// Demo data
const demoPosts: PostedPiece[] = [
  {
    id: '1', title: '5 Myths About Protein', format: 'Reel', pillar: 'Health & Wellness', pillarColor: '#B5606B',
    publishDate: '2026-03-08', views: 12400, likes: 843, saves: 312, shares: 89, comments: 47,
    feedbackRating: 'fire', feedbackNotes: 'Hook crushed it â keep myth-busting format',
  },
  {
    id: '2', title: 'Morning Routine: No Alarms', format: 'Carousel', pillar: 'Lifestyle & Travel', pillarColor: '#6B7280',
    publishDate: '2026-03-06', views: 8200, likes: 621, saves: 198, shares: 42, comments: 31,
    feedbackRating: 'tweak', feedbackNotes: 'Good saves, weak shares â add shareable quote slide',
  },
  {
    id: '3', title: 'Why Your Squat Feels Off', format: 'Reel', pillar: 'Health & Wellness', pillarColor: '#B5606B',
    publishDate: '2026-03-04', views: 15700, likes: 1102, saves: 487, shares: 156, comments: 73,
    feedbackRating: 'fire', feedbackNotes: null,
  },
  {
    id: '4', title: 'Postpartum Check-In', format: 'Stories', pillar: 'Community & Connection', pillarColor: '#3D8E96',
    publishDate: '2026-03-03', views: 3100, likes: 210, saves: 45, shares: 12, comments: 18,
    feedbackRating: null, feedbackNotes: null,
  },
  {
    id: '5', title: 'I Almost Quit Coaching', format: 'Reel', pillar: 'Personal Transformation', pillarColor: '#8B3A46',
    publishDate: '2026-03-01', views: 22300, likes: 1890, saves: 612, shares: 340, comments: 128,
    feedbackRating: 'fire', feedbackNotes: 'Vulnerability + real talk = best performing combo',
  },
]

const feedbackIcons: Record<FeedbackRating, { icon: typeof Flame; label: string; className: string }> = {
  fire: { icon: Flame, label: 'Fire', className: 'text-orange-500 bg-orange-50' },
  tweak: { icon: Pencil, label: 'Tweak', className: 'text-amber-600 bg-amber-50' },
  redo: { icon: RotateCcw, label: 'Redo', className: 'text-red-500 bg-red-50' },
}

function formatNum(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return n.toString()
}

export function PerformanceTracker() {
  const [filter, setFilter] = useState<'all' | 'fire' | 'tweak' | 'redo'>('all')

  const filtered = filter === 'all'
    ? demoPosts
    : demoPosts.filter(p => p.feedbackRating === filter)

  // Aggregate stats
  const totalViews = demoPosts.reduce((s, p) => s + p.views, 0)
  const totalSaves = demoPosts.reduce((s, p) => s + p.saves, 0)
  const avgEngagement = demoPosts.length
    ? ((demoPosts.reduce((s, p) => s + p.likes + p.saves + p.shares + p.comments, 0) / demoPosts.reduce((s, p) => s + p.views, 0)) * 100).toFixed(1)
    : '0'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-brand-near-black">Performance Tracker</h1>
        <p className="text-sm text-gray-500 mt-1">Review posted content, log feedback, and track what resonates</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Views', value: formatNum(totalViews), icon: Eye, color: 'text-blue-500' },
          { label: 'Total Saves', value: formatNum(totalSaves), icon: Bookmark, color: 'text-brand-teal' },
          { label: 'Avg Engagement', value: `${avgEngagement}%`, icon: TrendingUp, color: 'text-green-500' },
          { label: 'Posts Tracked', value: demoPosts.length.toString(), icon: MessageCircle, color: 'text-brand-rose' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={cn('w-4 h-4', stat.color)} />
              <span className="text-xs text-gray-400 font-medium">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-brand-near-black">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {[
          { key: 'all' as const, label: 'All Posts' },
          { key: 'fire' as const, label: 'Fire' },
          { key: 'tweak' as const, label: 'Tweak' },
          { key: 'redo' as const, label: 'Redo' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
              filter === f.key
                ? 'bg-brand-rose/10 text-brand-deep-rose'
                : 'text-gray-500 hover:bg-gray-50'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wider">
              <th className="text-left px-4 py-3 font-medium">Content</th>
              <th className="text-center px-3 py-3 font-medium"><Eye className="w-3.5 h-3.5 mx-auto" /></th>
              <th className="text-center px-3 py-3 font-medium"><Heart className="w-3.5 h-3.5 mx-auto" /></th>
              <th className="text-center px-3 py-3 font-medium"><Bookmark className="w-3.5 h-3.5 mx-auto" /></th>
              <th className="text-center px-3 py-3 font-medium"><Share2 className="w-3.5 h-3.5 mx-auto" /></th>
              <th className="text-center px-3 py-3 font-medium"><MessageCircle className="w-3.5 h-3.5 mx-auto" /></th>
              <th className="text-center px-3 py-3 font-medium">Rating</th>
              <th className="text-left px-4 py-3 font-medium">Notes</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(post => (
              <tr key={post.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: post.pillarColor }} />
                    <div>
                      <p className="text-sm font-medium text-brand-near-black">{post.title}</p>
                      <p className="text-xs text-gray-400">{post.format} Â· {new Date(post.publishDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    </div>
                  </div>
                </td>
                <td className="text-center px-3 py-3 text-sm text-gray-600">{formatNum(post.views)}</td>
                <td className="text-center px-3 py-3 text-sm text-gray-600">{formatNum(post.likes)}</td>
                <td className="text-center px-3 py-3 text-sm text-gray-600">{formatNum(post.saves)}</td>
                <td className="text-center px-3 py-3 text-sm text-gray-600">{formatNum(post.shares)}</td>
                <td className="text-center px-3 py-3 text-sm text-gray-600">{formatNum(post.comments)}</td>
                <td className="text-center px-3 py-3">
                  {post.feedbackRating ? (
                    <FeedbackButton rating={post.feedbackRating} />
                  ) : (
                    <div className="flex justify-center gap-1">
                      {(['fire', 'tweak', 'redo'] as FeedbackRating[]).map(r => {
                        const cfg = feedbackIcons[r]
                        return (
                          <button
                            key={r}
                            className="p-1 rounded hover:bg-gray-100 text-gray-300 hover:text-gray-500 transition-colors"
                            title={cfg.label}
                          >
                            <cfg.icon className="w-3.5 h-3.5" />
                          </button>
                        )
                      })}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  {post.feedbackNotes ? (
                    <p className="text-xs text-gray-500 max-w-[200px] truncate">{post.feedbackNotes}</p>
                  ) : (
                    <button className="text-xs text-brand-teal hover:text-brand-teal/80">+ Add note</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="p-8 text-center text-sm text-gray-400">
            No posts with that rating yet.
          </div>
        )}
      </div>
    </div>
  )
}

function FeedbackButton({ rating }: { rating: FeedbackRating }) {
  const cfg = feedbackIcons[rating]
  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium', cfg.className)}>
      <cfg.icon className="w-3 h-3" />
      {cfg.label}
    </span>
  )
}
