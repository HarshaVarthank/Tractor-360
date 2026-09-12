'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AlertCircle, Search, Filter, ShieldAlert, CheckCircle, Clock } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [priorityFilter, setPriorityFilter] = useState('ALL')

  const fetchComplaints = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append('q', search)
      if (statusFilter !== 'ALL') params.append('status', statusFilter)
      if (priorityFilter !== 'ALL') params.append('priority', priorityFilter)

      const res = await fetch(`/api/complaints?${params.toString()}`)
      if (res.ok) {
        const json = await res.json()
        setComplaints(json)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComplaints()
  }, [search, statusFilter, priorityFilter])

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <AlertCircle className="w-7 h-7 text-rose-600" />
            Complaints & Incident Tracking
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time monitoring of customer reported tractor issues, warranty tickets, and escalation statuses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-100">
            {complaints.length} Tickets
          </span>
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search complaint ID, issue description, tractor ID, customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:bg-white"
          />
        </div>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-rose-500"
        >
          <option value="ALL">All Priorities</option>
          <option value="CRITICAL">CRITICAL</option>
          <option value="HIGH">HIGH</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="LOW">LOW</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-rose-500"
        >
          <option value="ALL">All Statuses</option>
          <option value="OPEN">OPEN</option>
          <option value="IN_PROGRESS">IN PROGRESS</option>
          <option value="RESOLVED">RESOLVED</option>
          <option value="CLOSED">CLOSED</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 py-12 text-center text-slate-400">Loading complaints...</div>
        ) : complaints.map((cmp) => (
          <div
            key={cmp.id}
            className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-xs">{cmp.complaintId}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                    {cmp.category}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      cmp.priority === 'CRITICAL'
                        ? 'bg-rose-100 text-rose-800'
                        : cmp.priority === 'HIGH'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {cmp.priority}
                  </span>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    cmp.status === 'RESOLVED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : cmp.status === 'OPEN'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {cmp.status}
                </span>
              </div>

              <p className="text-xs text-slate-700 font-medium mt-2">{cmp.description}</p>

              {cmp.resolution && (
                <div className="mt-2.5 p-2.5 bg-emerald-50/70 border border-emerald-100 rounded-lg text-[11px] text-emerald-900">
                  <span className="font-bold">Resolution:</span> {cmp.resolution}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <div>
                Tractor:{' '}
                <Link
                  href={`/tractors/${cmp.tractor?.id}`}
                  className="font-bold text-blue-600 hover:underline"
                >
                  {cmp.tractor?.tractorId}
                </Link>{' '}
                • {cmp.customer?.name}
              </div>
              <div>{formatDate(cmp.createdDate)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
