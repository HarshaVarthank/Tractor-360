'use client'

import { useState, useEffect } from 'react'
import { Package, Search, AlertTriangle, CheckCircle2, XCircle, Plus, Filter } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function SparePartsPage() {
  const [parts, setParts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [stockStatusFilter, setStockStatusFilter] = useState('ALL')

  const fetchParts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append('q', search)
      if (categoryFilter !== 'ALL') params.append('category', categoryFilter)
      if (stockStatusFilter !== 'ALL') params.append('status', stockStatusFilter)

      const res = await fetch(`/api/spare-parts?${params.toString()}`)
      if (res.ok) {
        const json = await res.json()
        setParts(json)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchParts()
  }, [search, categoryFilter, stockStatusFilter])

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <Package className="w-7 h-7 text-amber-600" />
            Spare Parts Inventory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time stock levels, replenishment safety thresholds, and part catalogue pricing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-100">
            {parts.length} Catalog Items
          </span>
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search part number, part name, or supplier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-amber-500"
        >
          <option value="ALL">All Categories</option>
          <option value="Engine">Engine</option>
          <option value="Hydraulic">Hydraulic</option>
          <option value="Transmission">Transmission</option>
          <option value="Filter">Filter</option>
          <option value="Electrical">Electrical</option>
        </select>

        <select
          value={stockStatusFilter}
          onChange={(e) => setStockStatusFilter(e.target.value)}
          className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-amber-500"
        >
          <option value="ALL">All Stock Statuses</option>
          <option value="IN_STOCK">IN STOCK</option>
          <option value="LOW_STOCK">LOW STOCK (Alert)</option>
          <option value="OUT_OF_STOCK">OUT OF STOCK</option>
        </select>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Part # & Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Supplier</th>
                <th className="py-3 px-4">Current Stock / Min</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Unit Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">Loading spare parts catalogue...</td>
                </tr>
              ) : parts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{p.partName}</div>
                    <div className="text-[11px] font-mono text-slate-400">{p.partNumber}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium">
                    {p.category}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    {p.supplier || 'OEM Direct'}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{p.currentStock} units</div>
                    <div className="text-[10px] text-slate-400">Min safety: {p.minimumStock}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        p.stockStatus === 'IN_STOCK'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : p.stockStatus === 'LOW_STOCK'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {p.stockStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-slate-900 text-sm">
                    {formatCurrency(p.unitPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
