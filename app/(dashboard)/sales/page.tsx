'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { TrendingUp, Search, DollarSign, Calendar, FileText, ArrowUpRight } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function SalesPage() {
  const [salesData, setSalesData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [paymentMode, setPaymentMode] = useState('ALL')

  useEffect(() => {
    async function fetchSales() {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (search) params.append('q', search)
        if (paymentMode !== 'ALL') params.append('paymentMode', paymentMode)
        const res = await fetch(`/api/sales?${params.toString()}`)
        if (res.ok) {
          const json = await res.json()
          setSalesData(json)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchSales()
  }, [search, paymentMode])

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <TrendingUp className="w-7 h-7 text-blue-600" />
            Sales & Invoice Registry
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Ledger of tractor retail sales, dealer disbursements, and loan financings.
          </p>
        </div>

        {salesData?.metrics && (
          <div className="flex items-center gap-3">
            <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-right">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Total Revenue</span>
              <div className="text-base font-bold text-slate-900">
                {formatCurrency(salesData.metrics.totalRevenue)}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search invoice number, tractor ID, customer name, salesperson..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
          />
        </div>

        <select
          value={paymentMode}
          onChange={(e) => setPaymentMode(e.target.value)}
          className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-500"
        >
          <option value="ALL">All Payment Modes</option>
          <option value="LOAN">LOAN / Financing</option>
          <option value="CASH">CASH</option>
          <option value="EMI">EMI</option>
        </select>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Invoice # & Date</th>
                <th className="py-3 px-4">Tractor Sold</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Dealer</th>
                <th className="py-3 px-4">Payment & Bank</th>
                <th className="py-3 px-4 text-right">Final Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">Loading invoices...</td>
                </tr>
              ) : salesData?.sales?.map((s: any) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{s.invoiceNumber}</div>
                    <div className="text-[11px] text-slate-400">{formatDate(s.saleDate)}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <Link
                      href={`/tractors/${s.tractor?.id}`}
                      className="font-bold text-blue-600 hover:underline"
                    >
                      {s.tractor?.tractorId}
                    </Link>
                    <div className="text-[11px] text-slate-400">{s.tractor?.model?.modelName}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">{s.customer?.name}</div>
                    <div className="text-[11px] text-slate-400">{s.customer?.city}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">
                    {s.dealer?.name}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-800">{s.paymentMode}</span>
                    {s.loanBank && (
                      <div className="text-[10px] text-slate-400">{s.loanBank}</div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-slate-900 text-sm">
                    {formatCurrency(s.finalAmount)}
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
