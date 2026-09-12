'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import {
  Users,
  Tractor,
  TrendingUp,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  ArrowLeft,
  Calendar,
  ExternalLink,
} from 'lucide-react'
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils'

export default function Customer360ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params)
  const customerId = resolvedParams.id
  const [customer, setCustomer] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCustomer() {
      setLoading(true)
      try {
        const res = await fetch(`/api/customers/${customerId}`)
        if (res.ok) {
          const data = await res.json()
          setCustomer(data)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchCustomer()
  }, [customerId])

  if (loading) {
    return <div className="p-8 text-center text-slate-400 animate-pulse">Loading customer profile...</div>
  }

  if (!customer) {
    return <div className="p-8 text-center text-slate-500">Customer not found</div>
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Link
        href="/customers"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Customers
      </Link>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl">
              {customer.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{customer.name}</h1>
              <p className="text-xs text-slate-500">ID: {customer.customerId} • Type: {customer.type}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-3 py-2 rounded-lg">
            <Phone className="w-3.5 h-3.5 text-emerald-600" />
            <span>{customer.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-3 py-2 rounded-lg">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>{customer.city}, {customer.state}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tractor Fleet */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Tractor className="w-4 h-4 text-blue-600" />
            Owned Tractors ({customer.tractors?.length || 0})
          </h2>

          <div className="divide-y divide-slate-100 text-xs">
            {customer.tractors?.map((tr: any) => (
              <div key={tr.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">{tr.tractorId} — {tr.model?.modelName}</div>
                  <div className="text-slate-400 text-[11px]">Chassis: {tr.chassisNumber}</div>
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

        {/* Complaints History */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            Customer Complaints History ({customer.complaints?.length || 0})
          </h2>

          <div className="divide-y divide-slate-100 text-xs">
            {customer.complaints?.map((cmp: any) => (
              <div key={cmp.id} className="py-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">{cmp.complaintId} ({cmp.category})</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    cmp.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                  }`}>
                    {cmp.status}
                  </span>
                </div>
                <p className="text-slate-600 line-clamp-1">{cmp.description}</p>
                <div className="text-[10px] text-slate-400">{formatDate(cmp.createdDate)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
