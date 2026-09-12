'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Tractor,
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  ChevronRight,
  Shield,
  Wrench,
  AlertCircle,
  Eye,
} from 'lucide-react'
import { formatDate, getStatusColor } from '@/lib/utils'

export default function TractorsPage() {
  const [tractors, setTractors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [regionFilter, setRegionFilter] = useState('ALL')

  const fetchTractors = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append('q', search)
      if (statusFilter !== 'ALL') params.append('status', statusFilter)
      if (regionFilter !== 'ALL') params.append('region', regionFilter)

      const res = await fetch(`/api/tractors?${params.toString()}`)
      if (res.ok) {
        const json = await res.json()
        setTractors(json.tractors)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTractors()
  }, [search, statusFilter, regionFilter])

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <Tractor className="w-7 h-7 text-blue-600" />
            Tractor Fleet Registry
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete master index of all 50 tractors across models, owners, and warranty terms.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
            {tractors.length} Tractors Loaded
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Tractor ID, Chassis No, Engine No, Customer, or Dealer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="UNDER_SERVICE">UNDER SERVICE</option>
            <option value="INACTIVE">INACTIVE</option>
            <option value="SOLD">SOLD</option>
          </select>

          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Regions</option>
            <option value="North">North</option>
            <option value="South">South</option>
            <option value="East">East</option>
            <option value="West">West</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Tractor ID & Model</th>
                <th className="py-3 px-4">Chassis & Engine</th>
                <th className="py-3 px-4">Owner (Customer)</th>
                <th className="py-3 px-4">Dealer & Region</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Service / Complaints</th>
                <th className="py-3 px-4 text-right">360° Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Loading tractor fleet records...
                  </td>
                </tr>
              ) : tractors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No tractors match the specified criteria.
                  </td>
                </tr>
              ) : (
                tractors.map((tr) => (
                  <tr
                    key={tr.id}
                    className="hover:bg-blue-50/40 transition-colors group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {tr.tractorId}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        {tr.model.modelName} • {tr.model.category} ({tr.model.horsePower} HP)
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                      <div>Ch: {tr.chassisNumber}</div>
                      <div className="text-slate-400">Eng: {tr.engineNumber}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">
                        {tr.customer?.name}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {tr.customer?.phone} • {tr.customer?.city}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-slate-700">{tr.dealer?.name}</div>
                      <span className="inline-block px-1.5 py-0.2 rounded text-[10px] bg-slate-100 text-slate-600 font-medium mt-0.5">
                        {tr.region} Region
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(
                          tr.status
                        )}`}
                      >
                        {tr.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3 text-[11px]">
                        <span className="flex items-center gap-1 text-slate-600">
                          <Wrench className="w-3 h-3 text-blue-500" />
                          {tr._count?.serviceRecords || 0}
                        </span>
                        <span className="flex items-center gap-1 text-slate-600">
                          <AlertCircle className="w-3 h-3 text-rose-500" />
                          {tr._count?.complaints || 0}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/tractors/${tr.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-all"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View 360°</span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
