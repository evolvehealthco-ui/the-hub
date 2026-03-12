import { useState } from 'react'
import { Search, FolderOpen, Clock, ChevronRight, FileText, Book, Layers, Mail, ShoppingBag, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

type ProjectStatus = 'draft' | 'in_progress' | 'complete' | 'archived'
type ContentType = 'weekly_batch' | 'ebook' | 'program' | 'email_sequence' | 'sales_page' | 'client_resource'

interface ProjectSummary {
  id: string
  title: string
  contentType: ContentType
  status: ProjectStatus
  piecesCount: number
  createdAt: string
  updatedAt: string
}

const typeConfig: Record<ContentType, { icon: typeof FileText; label: string; color: string }> = {
  weekly_batch: { icon: Layers, label: 'Weekly Batch', color: 'bg-brand-rose/10 text-brand-rose' },
  ebook: { icon: Book, label: 'Ebook', color: 'bg-purple-50 text-purple-600' },
  program: { icon: Users, label: 'Program', color: 'bg-blue-50 text-blue-600' },
  email_sequence: { icon: Mail, label: 'Email Sequence', color: 'bg-green-50 text-green-600' },
  sales_page: { icon: ShoppingBag, label: 'Sales Page', color: 'bg-amber-50 text-amber-600' },
  client_resource: { icon: FileText, label: 'Client Resource', color: 'bg-gray-50 text-gray-600' },
}

const statusColors: Record<ProjectStatus, string> = {
  draft: 'bg-gray-100 text-gray-600',
  in_progress: 'bg-blue-50 text-blue-600',
  complete: 'bg-green-50 text-green-700',
  archived: 'bg-gray-50 text-gray-400',
}

// Demo data
const demoProjects: ProjectSummary[] = [
  { id: '1', title: 'Week of Mar 10 â Social Batch', contentType: 'weekly_batch', status: 'in_progress', piecesCount: 7, createdAt: '2026-03-08', updatedAt: '2026-03-10' },
  { id: '2', title: 'Week of Mar 3 â Social Batch', contentType: 'weekly_batch', status: 'complete', piecesCount: 7, createdAt: '2026-03-01', updatedAt: '2026-03-07' },
  { id: '3', title: 'Free Glute Guide', contentType: 'ebook', status: 'complete', piecesCount: 12, createdAt: '2026-02-15', updatedAt: '2026-02-28' },
  { id: '4', title: '12-Week Coaching Launch Emails', contentType: 'email_sequence', status: 'draft', piecesCount: 5, createdAt: '2026-02-20', updatedAt: '2026-02-20' },
  { id: '5', title: 'Coaching Program Sales Page', contentType: 'sales_page', status: 'draft', piecesCount: 1, createdAt: '2026-02-18', updatedAt: '2026-02-18' },
  { id: '6', title: 'Week of Feb 24 â Social Batch', contentType: 'weekly_batch', status: 'complete', piecesCount: 7, createdAt: '2026-02-22', updatedAt: '2026-02-28' },
  { id: '7', title: 'Postpartum Recovery Guide', contentType: 'client_resource', status: 'in_progress', piecesCount: 8, createdAt: '2026-02-10', updatedAt: '2026-03-05' },
  { id: '8', title: '4-Week Kickstart Program', contentType: 'program', status: 'complete', piecesCount: 28, createdAt: '2026-01-15', updatedAt: '2026-02-12' },
]

export function ProjectLibrary() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | ProjectStatus>('all')
  const [typeFilter, setTypeFilter] = useState<'all' | ContentType>('all')

  const filtered = demoProjects.filter(p => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false
    if (statusFilter !== 'all' && p.status !== statusFilter) return false
    if (typeFilter !== 'all' && p.contentType !== typeFilter) return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-brand-near-black">Project Library</h1>
        <p className="text-sm text-gray-500 mt-1">All your content projects in one place</p>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal/30 bg-white"
          />
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as 'all' | ProjectStatus)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-brand-teal"
        >
          <option value="all">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="in_progress">In Progress</option>
          <option value="complete">Complete</option>
          <option value="archived">Archived</option>
        </select>

        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value as 'all' | ContentType)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-brand-teal"
        >
          <option value="all">All Types</option>
          <option value="weekly_batch">Weekly Batch</option>
          <option value="ebook">Ebook</option>
          <option value="program">Program</option>
          <option value="email_sequence">Email Sequence</option>
          <option value="sales_page">Sales Page</option>
          <option value="client_resource">Client Resource</option>
        </select>
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(project => {
          const typeCfg = typeConfig[project.contentType]
          return (
            <div
              key={project.id}
              className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm transition-shadow cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium', typeCfg.color)}>
                    <typeCfg.icon className="w-3 h-3" />
                    {typeCfg.label}
                  </span>
                  <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium capitalize', statusColors[project.status])}>
                    {project.status.replace('_', ' ')}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-brand-teal transition-colors" />
              </div>

              <h3 className="font-semibold text-brand-near-black mb-2">{project.title}</h3>

              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <FolderOpen className="w-3 h-3" />
                  {project.piecesCount} pieces
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Updated {new Date(project.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <FolderOpen className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-400">No projects match your filters.</p>
        </div>
      )}
    </div>
  )
}
