'use client'

import { useState } from 'react'
import Sidebar from '@/components/layout/sidebar'
import Header from '@/components/layout/header'
import GlobalSearch from '@/components/layout/global-search'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col antialiased">
      {/* Sidebar navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content wrapper */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
        <Header
          onOpenSidebar={() => setSidebarOpen(true)}
          onOpenSearch={() => setSearchOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Global Search dialog */}
      <GlobalSearch
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </div>
  )
}
