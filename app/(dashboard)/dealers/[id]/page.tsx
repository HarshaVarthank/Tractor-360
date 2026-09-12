'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { Store, Phone, MapPin, Tractor, TrendingUp, Package, ArrowLeft, ExternalLink } from 'lucide-react'
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils'

export default function DealerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params)
  const dealerId = resolvedParams.id
  const [dealer, setDealer] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDealer() {
      setLoading(true)
      try {
        const res = await fetch(`/api/dealers/${dealerId}`)
        if (res.ok) {
          const data = await res.json()
          setDealer(data)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchDealer()
  }, [dealerId])

  if (loading) {
    return <div className="p-8 text-center text-slate-400 animate-pulse">Loading dealer record...</div>
  }

  if (!dealer) {
    return <div className="p-8 text-center text-slate-500">Dealer not found</div>
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Link
        href="/dealers"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Dealers
      </Link>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xl">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{dealer.name}</h1>
              <p className="text-xs text-slate-500">ID: {dealer.dealerId} • Owner: {dealer.ownerName} • Region: {dealer.region}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-3 py-2 rounded-lg">
            <Phone className="w-3.5 h-3.5 text-indigo-600" />
            <span>{dealer.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-3 py-2 rounded-lg">
            <MapPin className="w-3.5 h-3.5 text-indigo-600" />
            <span>{dealer.city}, {dealer.state}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Tractor className="w-4 h-4 text-blue-600" />
            Allocated / Dispatched Tractors ({dealer.tractors?.length || 0})
          </h2>

          <div className="divide-y divide-slate-100 text-xs">
            {dealer.tractors?.map((tr: any) => (
              <div key={tr.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">{tr.tractorId} — {tr.model?.modelName}</div>
                  <div className="text-slate-400 text-[11px]">Customer: {tr.customer?.name}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusColor(tr.status)}`}>
                    {tr.status}
                  </span>
                  <Link
                    href={`/tractors/${tr.id}`}
                    className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            Sales Generated ({dealer.sales?.length || 0})
          </h2>

          <div className="divide-y divide-slate-100 text-xs">
            {dealer.sales?.map((s: any) => (
              <div key={s.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">{s.invoiceNumber}</div>
                  <div className="text-slate-400 text-[11px]">{s.customer?.name} • {formatDate(s.saleDate)}</div>
                </div>
                <div className="font-bold text-slate-900">
                  {formatCurrency(s.finalAmount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
