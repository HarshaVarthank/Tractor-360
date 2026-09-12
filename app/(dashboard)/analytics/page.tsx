'use client'

import { useState, useEffect } from 'react'
import {
  BarChart3,
  TrendingUp,
  PieChart as PieChartIcon,
  DollarSign,
  Wrench,
  AlertCircle,
  Download,
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
  LineChart,
  Line,
} from 'recharts'
import { formatCurrency } from '@/lib/utils'

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4']

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true)
      try {
        const res = await fetch('/api/analytics')
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
    fetchAnalytics()
  }, [])

  if (loading || !data) {
    return <div className="p-12 text-center text-slate-400 animate-pulse">Loading analytics engine...</div>
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <BarChart3 className="w-7 h-7 text-indigo-600" />
            Operational Analytics & Intelligence
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Deep dive data breakdowns across failure categories, service expenditures, and dealer franchise rankings.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Trend */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs space-y-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Monthly Revenue Invoiced (₹)</h2>
            <p className="text-xs text-slate-500">Aggregated sales disbursements</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.monthlyRevenue} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val: any) => [formatCurrency(val), 'Revenue']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="amount" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Complaints by Category */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs space-y-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Failure Modes by Subsystem</h2>
            <p className="text-xs text-slate-500">Engine vs Hydraulic vs Transmission breakdown</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.complaintCategories} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#ec4899" radius={[6, 6, 0, 0]} name="Issues Logged" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Maintenance Cost by Service Type */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs space-y-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Service Cost Distribution</h2>
            <p className="text-xs text-slate-500">Preventive vs Breakdown overhaul expenditure</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.serviceCostByType} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <XAxis dataKey="type" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val: any) => [formatCurrency(val), 'Total Cost']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="totalCost" fill="#10b981" radius={[6, 6, 0, 0]} name="Cost (₹)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dealer Sales Ranking */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs space-y-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Top Dealer Franchises by Revenue</h2>
            <p className="text-xs text-slate-500">Retail sales leaders across states</p>
          </div>
          <div className="divide-y divide-slate-100 text-xs max-h-64 overflow-y-auto">
            {data.dealerRank?.map((d: any, i: number) => (
              <div key={i} className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    i === 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {i + 1}
                  </span>
                  <span className="font-semibold text-slate-800">{d.dealer}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900">{formatCurrency(d.revenue)}</span>
                  <span className="text-slate-400 text-[11px] block">{d.tractorsSold} tractors</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
