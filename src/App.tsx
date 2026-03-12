import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Dashboard } from '@/pages/Dashboard'
import { CreateNew } from '@/pages/CreateNew'
import { BrandBrain } from '@/pages/BrandBrain'
import { ContentCalendar } from '@/pages/ContentCalendar'
import { PerformanceTracker } from '@/pages/PerformanceTracker'
import { ProjectLibrary } from '@/pages/ProjectLibrary'

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="flex h-screen bg-brand-cream">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main
        className={`flex-1 overflow-y-auto transition-all duration-300 ${
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        }`}
      >
        <div className="p-6 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create" element={<CreateNew />} />
            <Route path="/brand-brain" element={<BrandBrain />} />
            <Route path="/calendar" element={<ContentCalendar />} />
            <Route path="/performance" element={<PerformanceTracker />} />
            <Route path="/library" element={<ProjectLibrary />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}
