'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Bot,
  Sparkles,
  AlertTriangle,
  ShieldAlert,
  TrendingUp,
  Package,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  ExternalLink,
} from 'lucide-react'

export default function AIInsightsPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchInsights = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/ai-insights')
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
    fetchInsights()
  }, [])

  if (loading || !data) {
    return <div className="p-12 text-center text-slate-400 animate-pulse">Running AI Fleet Telemetry Analysis...</div>
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autonomous Intelligence & Failure Prediction</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <Bot className="w-7 h-7 text-indigo-600" />
            AI Fleet Diagnostic Engine
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Continuous pattern recognition across 14 data pipelines diagnosing component stress, warranty leakage, and AMC conversion potential.
          </p>
        </div>

        <button
          onClick={fetchInsights}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Re-evaluate Telemetry
        </button>
      </div>

      {/* AI Insights Cards Grid */}
      <div className="space-y-4">
        {data.insights?.map((ins: any) => (
          <div
            key={ins.id}
            className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    ins.type === 'CRITICAL'
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : ins.type === 'WARNING'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : ins.type === 'OPPORTUNITY'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-blue-100 text-blue-800 border border-blue-200'
                  }`}
                >
                  {ins.type}
                </span>
                <span className="text-xs font-semibold text-slate-400">• {ins.category}</span>
              </div>

              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="text-slate-500">
                  Confidence Score: <span className="text-indigo-600 font-bold">{ins.confidence}</span>
                </span>
              </div>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900">{ins.title}</h2>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{ins.summary}</p>
            </div>

            <div className="p-4 bg-indigo-50/60 border border-indigo-100/80 rounded-xl space-y-1">
              <div className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                AI Recommended Action Protocol:
              </div>
              <p className="text-xs text-indigo-900 leading-relaxed">{ins.recommendation}</p>
            </div>

            {ins.affectedUnits?.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
                <span className="text-slate-400 font-semibold text-[11px]">Affected Entity IDs:</span>
                {ins.affectedUnits.map((unit: string) => (
                  <span
                    key={unit}
                    className="px-2 py-0.5 rounded bg-slate-100 font-mono text-[11px] font-bold text-slate-700"
                  >
                    {unit}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* High Failure Risk Tractors */}
      {data.atRiskFleet?.length > 0 && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            High Breakdown Probability Matrix (Priority Service Needed)
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-400">
                  <th className="py-2.5 px-3">Tractor ID</th>
                  <th className="py-2.5 px-3">Model</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Breakdowns</th>
                  <th className="py-2.5 px-3">Total Complaints</th>
                  <th className="py-2.5 px-3">Risk Index</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.atRiskFleet.map((tr: any) => (
                  <tr key={tr.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-bold text-blue-600 font-mono">{tr.tractorId}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">{tr.modelName}</td>
                    <td className="py-2.5 px-3 text-slate-600">{tr.customerName}</td>
                    <td className="py-2.5 px-3 text-rose-600 font-bold">{tr.breakdowns}</td>
                    <td className="py-2.5 px-3 text-amber-600 font-bold">{tr.totalComplaints}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-bold text-[10px]">
                        High Risk ({tr.riskScore} pts)
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <Link
                        href={`/tractors/${tr.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                      >
                        Inspect 360° <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
