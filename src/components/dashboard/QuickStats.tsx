import { FileText, TrendingUp, Zap, Target } from 'lucide-react'

const stats = [
  { label: 'Content Pieces', value: '47', sublabel: 'all time', icon: FileText, color: 'text-brand-rose' },
  { label: 'This Week', value: '7', sublabel: 'scripted', icon: Zap, color: 'text-brand-teal' },
  { label: 'Top Pillar', value: 'Personal', sublabel: 'last 30 days', icon: Target, color: 'text-purple-500' },
  { label: 'Top Format', value: 'Reels', sublabel: '82% engagement', icon: TrendingUp, color: 'text-amber-500' },
]

export function QuickStats() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map(stat => (
        <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">{stat.label}</span>
            <stat.icon className={`w-4 h-4 ${stat.color}`} />
          </div>
          <p className="text-2xl font-bold text-brand-near-black">{stat.value}</p>
          <p className="text-xs text-gray-400 mt-0.5">{stat.sublabel}</p>
        </div>
      ))}
    </div>
  )
}
