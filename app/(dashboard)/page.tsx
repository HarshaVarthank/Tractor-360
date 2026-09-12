'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Tractor,
  Users,
  Wrench,
  AlertCircle,
  TrendingUp,
  ShieldCheck,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  ChevronRight,
  RefreshCw,
  FileSpreadsheet,
} from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { formatCurrency, formatDate } from '@/lib/utils'

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4']

export default function OverviewPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchOverview = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/overview')
      if (res.ok) {
        const json = await res.json()
        setData(json)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOverview()
  }, [])

  if (loading || !data) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-slate-200 rounded-lg w-1/4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-slate-200 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-72 bg-slate-200 rounded-xl" />
          <div className="h-72 bg-slate-200 rounded-xl" />
        </div>
      </div>
    )
  }

  const { metrics, modelsDistribution, regionDistribution, recentComplaints, recentServices } = data

  const statCards = [
    {
      label: 'Total Tractors in Fleet',
      value: metrics.totalTractors,
      change: `${metrics.activeTractors} Active (${Math.round((metrics.activeTractors / metrics.totalTractors) * 100)}%)`,
      isPositive: true,
      icon: Tractor,
      href: '/tractors',
      color: 'blue',
    },
    {
      label: 'Registered Customers',
      value: metrics.totalCustomers,
      change: '100% Verified Profile CRM',
      isPositive: true,
      icon: Users,
      href: '/customers',
      color: 'emerald',
    },
    {
      label: 'Total Sales Invoiced',
      value: formatCurrency(metrics.totalRevenue),
      change: `${metrics.totalSales} units booked`,
      isPositive: true,
      icon: TrendingUp,
      href: '/sales',
      color: 'indigo',
    },
    {
      label: 'Open Complaints & Tickets',
      value: metrics.openComplaints,
      change: `${metrics.pendingService} in service bay`,
      isPositive: metrics.openComplaints < 15,
      icon: AlertCircle,
      href: '/complaints',
      color: 'amber',
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            <span>Tractor 360° Operations Command</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Fleet Intelligence & Lifecycle Hub
          </h1>
          <p className="text-sm text-slate-300 max-w-xl">
            Live overview across 50 tractors, service tickets, spare parts inventory, and dealer network.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchOverview}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium backdrop-blur-md transition-all border border-white/10"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
          <Link
            href="/import"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Import CSV
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon
          return (
            <Link
              key={i}
              href={card.href}
              className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">{card.label}</span>
                <div className="w-9 h-9 rounded-lg bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white flex items-center justify-center transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="my-3">
                <div className="text-2xl font-bold text-slate-900 tracking-tight">
                  {card.value}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                <span
                  className={`font-medium flex items-center gap-1 ${
                    card.isPositive ? 'text-emerald-600' : 'text-amber-600'
                  }`}
                >
                  {card.isPositive ? (
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5" />
                  )}
                  {card.change}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 transition-colors" />
              </div>
            </Link>
          )
        })}
      </div>

      {/* Charts Section: Model Distribution & Region Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model Breakdown Chart */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Fleet by Tractor Model</h2>
              <p className="text-xs text-slate-500">Distribution across HP categories</p>
            </div>
            <Link
              href="/tractors"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              All Tractors <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={modelsDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} name="Units" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Region Breakdown Chart */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Geographic Deployment</h2>
              <p className="text-xs text-slate-500">Tractors deployed across Indian regions</p>
            </div>
            <Link
              href="/dealers"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Dealer Map <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={regionDistribution}
                  dataKey="tractors"
                  nameKey="region"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={45}
                  paddingAngle={4}
                  label={({ region, tractors }) => `${region}: ${tractors}`}
                >
                  {regionDistribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom 2 Columns: Live Service Bay + Recent Complaints */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Service Records */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Wrench className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-900">Recent Service Activity</h2>
            </div>
            <Link
              href="/service"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View all 100 <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentServices.map((srv: any) => (
              <div key={srv.id} className="py-3 flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      {srv.serviceId}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700">
                      {srv.serviceType}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      • {srv.tractor.tractorId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-1">{srv.problemReported}</p>
                  <p className="text-[11px] text-slate-400">
                    Tech: {srv.technician?.name || 'Unassigned'} • {formatDate(srv.serviceDate)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-900">
                    {formatCurrency(srv.cost)}
                  </span>
                  <div className="text-[10px] font-semibold text-slate-500 uppercase mt-0.5">
                    {srv.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Complaints */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <AlertCircle className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-900">Recent Complaints & Issues</h2>
            </div>
            <Link
              href="/complaints"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View all 80 <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentComplaints.map((cmp: any) => (
              <div key={cmp.id} className="py-3 flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      {cmp.complaintId}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                        cmp.priority === 'CRITICAL'
                          ? 'bg-rose-100 text-rose-800'
                          : cmp.priority === 'HIGH'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {cmp.priority}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      • {cmp.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-1">{cmp.description}</p>
                  <p className="text-[11px] text-slate-400">
                    Customer: {cmp.customer.name} ({cmp.customer.phone})
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      cmp.status === 'RESOLVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : cmp.status === 'OPEN'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {cmp.status}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {formatDate(cmp.createdDate)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
