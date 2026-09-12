'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import {
  Search,
  Menu,
  Bell,
  LogOut,
  User,
  Shield,
  Plus,
  FileSpreadsheet,
  Command,
  ChevronDown,
} from 'lucide-react'
import Link from 'next/link'

export default function Header({
  onOpenSidebar,
  onOpenSearch,
}: {
  onOpenSidebar: () => void
  onOpenSearch: () => void
}) {
  const { data: session } = useSession()
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const roleColors: Record<string, string> = {
    ADMIN: 'bg-rose-50 text-rose-700 border-rose-200',
    MANAGER: 'bg-blue-50 text-blue-700 border-blue-200',
    SERVICE_MANAGER: 'bg-amber-50 text-amber-700 border-amber-200',
    DEALER: 'bg-purple-50 text-purple-700 border-purple-200',
    TECHNICIAN: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    VIEWER: 'bg-slate-100 text-slate-700 border-slate-200',
  }

  const role = session?.user?.role || 'ADMIN'

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left side: Hamburger + Omni Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search trigger bar */}
        <button
          onClick={onOpenSearch}
          className="w-full max-w-md h-9.5 px-3.5 rounded-xl bg-slate-100/90 hover:bg-slate-200/70 border border-slate-200/60 text-slate-500 hover:text-slate-800 flex items-center justify-between transition-all group shadow-xs"
        >
          <div className="flex items-center gap-2.5 text-xs">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
            <span className="hidden sm:inline">Search tractors, chassis, customers, parts, dealers...</span>
            <span className="sm:hidden">Search data...</span>
          </div>
          <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white text-[10px] font-semibold text-slate-400 border border-slate-200 shadow-2xs">
            <Command className="w-2.5 h-2.5" /> K
          </kbd>
        </button>
      </div>

      {/* Right side: Quick Actions + Alerts + Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Import shortcut */}
        <Link
          href="/import"
          className="hidden md:inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
          <span>Import CSV</span>
        </Link>

        {/* Quick Add action */}
        <Link
          href="/tractors"
          className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/20 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Explore Fleet</span>
        </Link>

        {/* Notification Bell */}
        <button
          onClick={() => {}}
          className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
        </button>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {session?.user?.name ? session.user.name.charAt(0) : 'U'}
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-semibold text-slate-800 leading-tight">
                {session?.user?.name || 'Enterprise User'}
              </div>
              <div className="text-[10px] text-slate-500 truncate max-w-[120px]">
                {session?.user?.email || 'admin@tractor360.com'}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
          </button>

          {/* Menu popup */}
          {userMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setUserMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs animate-fade-in">
                <div className="px-3.5 py-2.5 border-b border-slate-100">
                  <p className="font-semibold text-slate-900">{session?.user?.name || 'User'}</p>
                  <p className="text-[11px] text-slate-500 truncate">{session?.user?.email}</p>
                  <div className="mt-1.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        roleColors[role] || roleColors.VIEWER
                      }`}
                    >
                      <Shield className="w-2.5 h-2.5" />
                      {role}
                    </span>
                  </div>
                </div>

                <Link
                  href="/settings"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2 px-3.5 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Account Settings
                </Link>

                <div className="border-t border-slate-100 my-1" />

                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-rose-600 hover:bg-rose-50 transition-colors text-left font-medium"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-500" />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
