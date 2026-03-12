import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { KanbanBoard } from '@/components/dashboard/KanbanBoard'
import { QuickStats } from '@/components/dashboard/QuickStats'

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-near-black">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">This week's content pipeline</p>
        </div>
        <Link
          to="/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-rose text-white rounded-lg text-sm font-medium hover:bg-brand-deep-rose transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create New
        </Link>
      </div>

      {/* Kanban Board */}
      <KanbanBoard />

      {/* Quick Stats */}
      <QuickStats />

      {/* Recent Projects */}
      <div>
        <h2 className="text-lg font-semibold text-brand-near-black mb-3">Recent Projects</h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { title: 'Week 13 Social Batch', type: 'Weekly Batch', status: 'In Progress', date: 'Mar 10 - 16' },
            { title: 'Free Glute Guide', type: 'Ebook / PDF', status: 'Complete', date: 'Feb 28' },
            { title: 'Welcome Email Sequence', type: 'Email Sequence', status: 'Draft', date: 'Mar 8' },
          ].map(project => (
            <div key={project.title} className="bg-white rounded-xl border border-gray-100 p-4 hover:border-brand-rose/20 transition-colors cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-brand-teal bg-brand-teal/10 px-2 py-0.5 rounded-full">
                  {project.type}
                </span>
                <span className="text-xs text-gray-400">{project.date}</span>
              </div>
              <h3 className="font-medium text-brand-near-black">{project.title}</h3>
              <p className="text-xs text-gray-400 mt-1">{project.status}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
