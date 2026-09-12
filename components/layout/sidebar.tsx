'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Tractor,
  LayoutDashboard,
  Users,
  Wrench,
  AlertCircle,
  ShieldCheck,
  Package,
  Store,
  UserCheck,
  TrendingUp,
  FileSpreadsheet,
  BarChart3,
  Bot,
  Settings,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  {
    category: 'Core Operations',
    items: [
      { name: 'Overview', href: '/', icon: LayoutDashboard },
      { name: 'Tractors (Fleet 360°)', href: '/tractors', icon: Tractor, count: 50 },
      { name: 'Customers CRM', href: '/customers', icon: Users, count: 30 },
      { name: 'Sales & Invoices', href: '/sales', icon: TrendingUp },
    ],
  },
  {
    category: 'Aftersales & Service',
    items: [
      { name: 'Service Records', href: '/service', icon: Wrench, count: 100 },
      { name: 'Complaints', href: '/complaints', icon: AlertCircle, count: 80 },
      { name: 'Warranty & Claims', href: '/warranty', icon: ShieldCheck },
      { name: 'Spare Parts Stock', href: '/spare-parts', icon: Package, count: 40 },
    ],
  },
  {
    category: 'Network & Team',
    items: [
      { name: 'Dealers Network', href: '/dealers', icon: Store, count: 10 },
      { name: 'Technicians', href: '/technicians', icon: UserCheck, count: 20 },
    ],
  },
  {
    category: 'Intelligence & Tools',
    items: [
      { name: 'Data Import Hub', href: '/import', icon: FileSpreadsheet },
      { name: 'Analytics & KPIs', href: '/analytics', icon: BarChart3 },
      { name: 'AI Fleet Insights', href: '/ai-insights', icon: Bot, highlight: true },
      { name: 'Settings', href: '/settings', icon: Settings },
    ],
  },
]

export default function Sidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      {/* Brand Header */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Tractor className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-slate-900 flex items-center gap-1">
              Tractor <span className="text-blue-600">360°</span>
            </span>
            <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Unified Platform
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navigation.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <h3 className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {section.category}
            </h3>
            <div className="space-y-0.5 mt-1">
              {section.items.map((item) => {
                const Icon = item.icon
                const isActive =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(item.href)

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      'flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group',
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-semibold shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900',
                      item.highlight && !isActive && 'text-indigo-600 hover:bg-indigo-50/60'
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={cn(
                          'w-4 h-4 shrink-0 transition-colors',
                          isActive
                            ? 'text-blue-600'
                            : item.highlight
                            ? 'text-indigo-500 group-hover:text-indigo-600'
                            : 'text-slate-400 group-hover:text-slate-600'
                        )}
                      />
                      <span className="truncate">{item.name}</span>
                    </div>

                    {item.highlight ? (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700 uppercase tracking-wide">
                        AI
                      </span>
                    ) : item.count !== undefined ? (
                      <span
                        className={cn(
                          'text-[10px] px-1.5 py-0.2 rounded-md font-medium',
                          isActive
                            ? 'bg-blue-200/60 text-blue-800'
                            : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                        )}
                      >
                        {item.count}
                      </span>
                    ) : (
                      <ChevronRight
                        className={cn(
                          'w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity',
                          isActive && 'opacity-100 text-blue-400'
                        )}
                      />
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Status Card */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        <div className="p-3 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-md">
          <div className="flex items-center justify-between text-xs font-semibold mb-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              SQLite DB Online
            </span>
            <span className="text-[10px] text-slate-400">50 Tractors</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-tight">
            All 14 connected entity relations loaded and indexed.
          </p>
        </div>
      </div>
    </aside>
  )
}
