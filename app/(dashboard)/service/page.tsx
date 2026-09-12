'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Wrench, Search, Filter, CheckCircle2, Clock, AlertTriangle, ChevronRight, User } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function ServicePage() {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [typeFilter, setTypeFilter] = useState('ALL')

  const fetchServices = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append('q', search)
      if (statusFilter !== 'ALL') params.append('status', statusFilter)
      if (typeFilter !== 'ALL') params.append('type', typeFilter)

      const res = await fetch(`/api/service?${params.toString()}`)
      if (res.ok) {
        const json = await res.json()
        setServices(json)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [search, statusFilter, typeFilter])

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <Wrench className="w-7 h-7 text-blue-600" />
            Service Records & Maintenance Bay
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track scheduled maintenance, breakdown repairs, and parts replaced across 100 service jobs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
            {services.length} Jobs
          </span>
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search service ID, tractor ID, problem keywords, technician..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-500"
        >
          <option value="ALL">All Service Types</option>
          <option value="SCHEDULED">SCHEDULED</option>
          <option value="BREAKDOWN">BREAKDOWN</option>
          <option value="WARRANTY">WARRANTY</option>
          <option value="PREVENTIVE">PREVENTIVE</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-500"
        >
          <option value="ALL">All Statuses</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="IN_PROGRESS">IN PROGRESS</option>
          <option value="NEW">NEW</option>
          <option value="WAITING_FOR_PART">WAITING FOR PART</option>
        </select>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="py-12 text-center text-slate-400">Loading service logs...</div>
        ) : services.map((srv) => (
          <div
            key={srv.id}
            className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-900">{srv.serviceId}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700">
                  {srv.serviceType}
                </span>
                <Link
                  href={`/tractors/${srv.tractor?.id}`}
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  {srv.tractor?.tractorId} ({srv.tractor?.model?.modelName})
                </Link>
                <span className="text-[11px] text-slate-400">• {formatDate(srv.serviceDate)}</span>
              </div>

              <p className="text-xs font-medium text-slate-700">{srv.problemReported}</p>
              {srv.workPerformed && (
                <p className="text-[11px] text-slate-500 line-clamp-1">
                  <span className="font-semibold">Action:</span> {srv.workPerformed}
                </p>
              )}

              <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                <span>Owner: {srv.tractor?.customer?.name}</span>
                <span>Tech: {srv.technician?.name || 'Unassigned'}</span>
                {srv.serviceParts?.length > 0 && (
                  <span className="text-amber-600 font-medium">
                    {srv.serviceParts.length} parts replaced
                  </span>
                )}
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 shrink-0">
              <div className="text-right">
                <div className="text-sm font-bold text-slate-900">{formatCurrency(srv.cost)}</div>
                <span
                  className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    srv.status === 'COMPLETED' || srv.status === 'CLOSED'
                      ? 'bg-emerald-50 text-emerald-700'
                      : srv.status === 'IN_PROGRESS'
                      ? 'bg-blue-50 text-blue-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {srv.status}
                </span>
              </div>

              <Link
                href={`/tractors/${srv.tractor?.id}`}
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 sm:mt-2"
              >
                Tractor 360° <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
