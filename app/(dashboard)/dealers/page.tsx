'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Store, Search, Phone, MapPin, Tractor, TrendingUp, ChevronRight, Eye } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function DealersPage() {
  const [dealers, setDealers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [regionFilter, setRegionFilter] = useState('ALL')

  const fetchDealers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append('q', search)
      if (regionFilter !== 'ALL') params.append('region', regionFilter)

      const res = await fetch(`/api/dealers?${params.toString()}`)
      if (res.ok) {
        const json = await res.json()
        setDealers(json)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDealers()
  }, [search, regionFilter])

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <Store className="w-7 h-7 text-indigo-600" />
            Dealer Distribution Network
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Authorised dealership franchise hubs, regional sales quotas, and inventory nodes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
            {dealers.length} Franchises Active
          </span>
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search dealer name, owner, city, dealer ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white"
          />
        </div>

        <select
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value)}
          className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-indigo-500"
        >
          <option value="ALL">All Regions</option>
          <option value="North">North</option>
          <option value="South">South</option>
          <option value="East">East</option>
          <option value="West">West</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-3 py-12 text-center text-slate-400">Loading dealer network...</div>
        ) : dealers.map((d) => (
          <div
            key={d.id}
            className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{d.name}</h3>
                  <p className="text-[11px] text-slate-400">{d.dealerId} • Owner: {d.ownerName}</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {d.region} Region
                </span>
              </div>

              <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{d.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{d.city}, {d.state}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-slate-50 rounded-lg text-center">
                  <span className="text-slate-400 text-[10px] block font-semibold">Tractors Sold</span>
                  <span className="font-bold text-slate-900 text-sm">{d._count?.tractors || 0}</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg text-center">
                  <span className="text-slate-400 text-[10px] block font-semibold">Invoices</span>
                  <span className="font-bold text-slate-900 text-sm">{d._count?.sales || 0}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">Joined {formatDate(d.joinedDate)}</span>
              <Link
                href={`/dealers/${d.id}`}
                className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-700"
              >
                <Eye className="w-3.5 h-3.5" /> Dealer Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
