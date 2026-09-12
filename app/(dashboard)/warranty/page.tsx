'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShieldCheck, Search, ShieldAlert, CheckCircle2, Clock } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function WarrantyPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function fetchWarranty() {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (search) params.append('q', search)
        const res = await fetch(`/api/warranty?${params.toString()}`)
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
    fetchWarranty()
  }, [search])

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <ShieldCheck className="w-7 h-7 text-indigo-600" />
            Warranty Coverage & Claims
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Factory warranties, terms expiration dates, and financial reimbursement claims.
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search warranty ID, tractor ID, chassis number, or customer name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-3 py-12 text-center text-slate-400">Loading warranty records...</div>
        ) : data?.warranties?.map((w: any) => (
          <div
            key={w.id}
            className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs">{w.warrantyId}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {w.status}
                </span>
              </div>

              <div className="mt-2">
                <Link
                  href={`/tractors/${w.tractor?.id}`}
                  className="text-sm font-bold text-blue-600 hover:underline"
                >
                  {w.tractor?.tractorId} ({w.tractor?.model?.modelName})
                </Link>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Owner: {w.tractor?.customer?.name}
                </div>
              </div>

              <div className="mt-3 p-3 bg-slate-50 rounded-lg space-y-1 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Coverage Level:</span>
                  <span className="font-bold text-slate-800">{w.coverage}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Expiry Date:</span>
                  <span className="font-bold text-slate-800">{formatDate(w.endDate)}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">{w.claims?.length || 0} claims filed</span>
              <Link
                href={`/tractors/${w.tractor?.id}`}
                className="font-semibold text-indigo-600 hover:text-indigo-700"
              >
                View 360° Profile →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
