'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Users, Search, Phone, MapPin, Tractor, AlertCircle, Eye, Plus } from 'lucide-react'

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchCustomers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append('q', search)
      const res = await fetch(`/api/customers?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        setCustomers(data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [search])

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <Users className="w-7 h-7 text-emerald-600" />
            Customer Intelligence CRM
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Master database of all registered tractor owners, fleet operators, and enterprise accounts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100">
            {customers.length} Customers Active
          </span>
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer name, ID, phone number, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-3 py-12 text-center text-slate-400">Loading customer records...</div>
        ) : customers.map((c) => (
          <div
            key={c.id}
            className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{c.name}</h3>
                  <p className="text-[11px] text-slate-400">{c.customerId} • {c.type}</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {c._count?.tractors || 0} Tractors
                </span>
              </div>

              <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{c.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{c.city}, {c.state}</span>
                </div>
              </div>

              {c.tractors?.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                  {c.tractors.map((t: any) => (
                    <Link
                      key={t.id}
                      href={`/tractors/${t.id}`}
                      className="px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-semibold transition-colors"
                    >
                      {t.tractorId} ({t.model?.modelName})
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">
                {c._count?.complaints || 0} complaints logged
              </span>
              <Link
                href={`/customers/${c.id}`}
                className="inline-flex items-center gap-1 font-semibold text-emerald-600 hover:text-emerald-700"
              >
                <Eye className="w-3.5 h-3.5" /> Customer 360°
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
