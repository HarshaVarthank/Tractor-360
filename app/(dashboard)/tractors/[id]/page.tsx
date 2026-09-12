'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import {
  Tractor,
  Users,
  Wrench,
  AlertCircle,
  ShieldCheck,
  Package,
  TrendingUp,
  Calendar,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  FileText,
  BadgeCheck,
} from 'lucide-react'
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils'

export default function Tractor360ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params)
  const tractorId = resolvedParams.id

  const [tractor, setTractor] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'customer' | 'sales' | 'service' | 'complaints' | 'warranty' | 'parts'>('overview')

  useEffect(() => {
    async function fetchTractor() {
      setLoading(true)
      try {
        const res = await fetch(`/api/tractors/${tractorId}`)
        if (res.ok) {
          const data = await res.json()
          setTractor(data)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchTractor()
  }, [tractorId])

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-1/3" />
        <div className="h-44 bg-slate-200 rounded-2xl" />
        <div className="h-96 bg-slate-200 rounded-2xl" />
      </div>
    )
  }

  if (!tractor) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Tractor Profile Not Found</h2>
        <p className="text-sm text-slate-500">Could not find record for identifier &quot;{tractorId}&quot;</p>
        <Link
          href="/tractors"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Fleet
        </Link>
      </div>
    )
  }

  const { metrics } = tractor
  const healthColor =
    metrics.healthScore > 80
      ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
      : metrics.healthScore > 50
      ? 'text-amber-600 bg-amber-50 border-amber-200'
      : 'text-rose-600 bg-rose-50 border-rose-200'

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back Link */}
      <div>
        <Link
          href="/tractors"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Fleet Registry
        </Link>
      </div>

      {/* 360° Hero Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-700/60">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-blue-400" />
                TRACTOR 360° LIFECYCLE
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(
                  tractor.status
                )}`}
              >
                {tractor.status}
              </span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {tractor.tractorId}
                <span className="text-xl sm:text-2xl font-normal text-slate-300 ml-3">
                  {tractor.model?.modelName} ({tractor.model?.horsePower} HP)
                </span>
              </h1>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Chassis: <span className="text-slate-200">{tractor.chassisNumber}</span> • Engine: <span className="text-slate-200">{tractor.engineNumber}</span> • Reg: <span className="text-slate-200">{tractor.registrationNo || 'N/A'}</span>
              </p>
            </div>
          </div>

          {/* Health Score & Quick Metrics */}
          <div className="flex items-center gap-4 bg-slate-950/60 border border-slate-800 p-4 rounded-xl backdrop-blur-sm">
            <div className="text-center px-2">
              <div className="text-xs text-slate-400 font-medium">Fleet Health</div>
              <div className="text-3xl font-black text-emerald-400 tracking-tight">
                {metrics.healthScore}%
              </div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">
                {metrics.healthScore > 80 ? 'Optimal' : metrics.healthScore > 50 ? 'Fair' : 'Needs Bay'}
              </div>
            </div>

            <div className="h-10 w-px bg-slate-800" />

            <div className="space-y-1 text-xs">
              <div className="text-slate-400">
                Owner: <span className="text-white font-semibold">{tractor.customer?.name}</span>
              </div>
              <div className="text-slate-400">
                Dealer: <span className="text-white font-semibold">{tractor.dealer?.name}</span>
              </div>
              <div className="text-slate-400">
                Region: <span className="text-white font-semibold">{tractor.region}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-200 bg-white rounded-t-xl px-4 flex gap-2 overflow-x-auto text-xs font-semibold">
        {[
          { id: 'overview', label: '360° Overview', icon: Sparkles },
          { id: 'customer', label: `Customer (${tractor.customer?.name})`, icon: Users },
          { id: 'sales', label: 'Sales & Invoice', icon: TrendingUp },
          { id: 'service', label: `Service Logs (${tractor.serviceRecords?.length})`, icon: Wrench },
          { id: 'complaints', label: `Complaints (${tractor.complaints?.length})`, icon: AlertCircle },
          { id: 'warranty', label: 'Warranty & Claims', icon: ShieldCheck },
          { id: 'parts', label: 'Replaced Parts', icon: Package },
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-3 px-3 border-b-2 whitespace-nowrap transition-all ${
                isActive
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* TAB 1: 360° OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs">
              <div className="text-xs text-slate-400 font-medium">Total Maintenance Cost</div>
              <div className="text-xl font-bold text-slate-900 mt-1">
                {formatCurrency(metrics.totalMaintenanceCost)}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Across {metrics.totalServices} service visits</div>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs">
              <div className="text-xs text-slate-400 font-medium">Warranty Coverage</div>
              <div className="text-xl font-bold text-slate-900 mt-1">
                {tractor.warranty?.coverage || 'Standard'}
              </div>
              <div className="text-[11px] text-emerald-600 font-medium mt-1">
                Valid until {formatDate(tractor.warranty?.endDate)}
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs">
              <div className="text-xs text-slate-400 font-medium">Purchase Date</div>
              <div className="text-xl font-bold text-slate-900 mt-1">
                {formatDate(tractor.purchaseDate)}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Invoiced by {tractor.dealer?.name}</div>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs">
              <div className="text-xs text-slate-400 font-medium">Complaints Raised</div>
              <div className="text-xl font-bold text-slate-900 mt-1">
                {metrics.totalComplaints} Total
              </div>
              <div className="text-[11px] text-rose-600 font-medium mt-1">
                {metrics.criticalComplaints} Critical / Escalated
              </div>
            </div>
          </div>

          {/* Model & Specification Card */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Tractor className="w-4 h-4 text-blue-600" />
                Engineering & Model Specifications
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-400 block">Model Code</span>
                  <span className="font-bold text-slate-800">{tractor.model?.modelCode}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-400 block">Category / Horsepower</span>
                  <span className="font-bold text-slate-800">{tractor.model?.category} ({tractor.model?.horsePower} HP)</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-400 block">Engine Type</span>
                  <span className="font-bold text-slate-800">{tractor.model?.engineType}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-400 block">Color</span>
                  <span className="font-bold text-slate-800">{tractor.color || 'Agri Red'}</span>
                </div>
              </div>
              <p className="text-xs text-slate-500">{tractor.model?.description}</p>
            </div>

            {/* Quick Timeline */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                Recent Service & Maintenance Snapshot
              </h3>
              <div className="divide-y divide-slate-100 text-xs">
                {tractor.serviceRecords?.slice(0, 3).map((srv: any) => (
                  <div key={srv.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-800">{srv.serviceId} — {srv.serviceType}</div>
                      <div className="text-[11px] text-slate-400">{srv.problemReported}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-900">{formatCurrency(srv.cost)}</div>
                      <div className="text-[10px] text-slate-400">{formatDate(srv.serviceDate)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CUSTOMER & OWNERSHIP */}
      {activeTab === 'customer' && tractor.customer && (
        <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">{tractor.customer.name}</h3>
              <p className="text-xs text-slate-500">Customer ID: {tractor.customer.customerId} • Type: {tractor.customer.type}</p>
            </div>
            <Link
              href={`/customers/${tractor.customer.id}`}
              className="px-3.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold"
            >
              View Full Customer Profile
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 font-medium">
                <Phone className="w-3.5 h-3.5" /> Phone
              </div>
              <div className="text-sm font-bold text-slate-900">{tractor.customer.phone}</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 font-medium">
                <Mail className="w-3.5 h-3.5" /> Email
              </div>
              <div className="text-sm font-bold text-slate-900">{tractor.customer.email || 'None on file'}</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 font-medium">
                <MapPin className="w-3.5 h-3.5" /> Location
              </div>
              <div className="text-sm font-bold text-slate-900">{tractor.customer.city}, {tractor.customer.state}</div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Customer&apos;s Tractor Fleet ({tractor.customer.tractors?.length || 1} units)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {tractor.customer.tractors?.map((t: any) => (
                <div key={t.id} className="p-3 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{t.tractorId}</span>
                    <span className="text-slate-400 ml-2">({t.model?.modelName})</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusColor(t.status)}`}>
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SALES & FINANCIALS */}
      {activeTab === 'sales' && (
        <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-xs space-y-6">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            Original Sale & Invoice Record
          </h3>

          {tractor.sale ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block">Invoice Number</span>
                <span className="text-sm font-bold text-slate-900">{tractor.sale.invoiceNumber}</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block">Final Sale Amount</span>
                <span className="text-sm font-bold text-emerald-600">{formatCurrency(tractor.sale.finalAmount)}</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block">Payment Mode</span>
                <span className="text-sm font-bold text-slate-900">{tractor.sale.paymentMode} {tractor.sale.loanBank ? `(${tractor.sale.loanBank})` : ''}</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block">Salesperson</span>
                <span className="text-sm font-bold text-slate-900">{tractor.sale.salesperson}</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400">No sale invoice recorded directly for this tractor.</p>
          )}
        </div>
      )}

      {/* TAB 4: SERVICE LOGS */}
      {activeTab === 'service' && (
        <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Full Maintenance & Service History</h3>
            <span className="text-xs text-slate-500">{tractor.serviceRecords?.length} total records</span>
          </div>

          <div className="space-y-4 divide-y divide-slate-100">
            {tractor.serviceRecords?.map((srv: any) => (
              <div key={srv.id} className="pt-4 first:pt-0 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{srv.serviceId}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700">
                      {srv.serviceType}
                    </span>
                    <span className="text-slate-400">• {formatDate(srv.serviceDate)}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900">{formatCurrency(srv.cost)}</span>
                    <span className="ml-2 text-[10px] font-bold uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      {srv.status}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="text-slate-700"><span className="font-semibold">Problem:</span> {srv.problemReported}</div>
                  {srv.workPerformed && (
                    <div className="text-slate-600 mt-1"><span className="font-semibold">Work Performed:</span> {srv.workPerformed}</div>
                  )}
                  <div className="text-slate-400 text-[11px] mt-1">
                    Technician: {srv.technician?.name || 'Unassigned'} ({srv.technician?.phone || 'N/A'})
                  </div>
                </div>

                {srv.serviceParts?.length > 0 && (
                  <div className="pl-3">
                    <span className="text-[11px] font-semibold text-slate-400">Parts Replaced in this visit:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {srv.serviceParts.map((sp: any) => (
                        <span key={sp.id} className="px-2 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded text-[11px] font-medium">
                          {sp.sparePart?.partName} (Qty: {sp.quantity}) — {formatCurrency(sp.totalCost)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: COMPLAINTS */}
      {activeTab === 'complaints' && (
        <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Customer Complaints & Issue Tickets</h3>
            <span className="text-xs text-slate-500">{tractor.complaints?.length} tickets</span>
          </div>

          <div className="space-y-3">
            {tractor.complaints?.map((cmp: any) => (
              <div key={cmp.id} className="p-4 border border-slate-200 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{cmp.complaintId}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      Category: {cmp.category}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      cmp.priority === 'CRITICAL' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {cmp.priority}
                    </span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    cmp.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {cmp.status}
                  </span>
                </div>

                <p className="text-slate-700">{cmp.description}</p>
                {cmp.resolution && (
                  <div className="p-2.5 bg-emerald-50 text-emerald-900 rounded-lg text-[11px]">
                    <span className="font-bold">Resolution:</span> {cmp.resolution}
                  </div>
                )}
                <div className="text-[11px] text-slate-400">
                  Logged on {formatDate(cmp.createdDate)} • Resolved on {formatDate(cmp.resolvedDate)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: WARRANTY & CLAIMS */}
      {activeTab === 'warranty' && (
        <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-xs space-y-6">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            Warranty Coverage & Claim History
          </h3>

          {tractor.warranty ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block">Warranty ID</span>
                  <span className="text-sm font-bold text-slate-900">{tractor.warranty.warrantyId}</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block">Coverage Level</span>
                  <span className="text-sm font-bold text-blue-600">{tractor.warranty.coverage}</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block">Validity Period</span>
                  <span className="text-sm font-bold text-slate-900">
                    {formatDate(tractor.warranty.startDate)} to {formatDate(tractor.warranty.endDate)}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Claims Filed ({tractor.warranty.claims?.length || 0})
                </h4>
                {tractor.warranty.claims?.length === 0 ? (
                  <p className="text-xs text-slate-400">No warranty claims filed against this tractor.</p>
                ) : (
                  <div className="space-y-2 text-xs">
                    {tractor.warranty.claims?.map((claim: any) => (
                      <div key={claim.id} className="p-3 border border-slate-200 rounded-xl flex items-center justify-between">
                        <div>
                          <div className="font-bold text-slate-900">{claim.claimId} — {claim.description}</div>
                          <div className="text-[11px] text-slate-400">Filed: {formatDate(claim.claimDate)}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-slate-900">{formatCurrency(claim.amount)}</div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                            {claim.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <p className="text-xs text-slate-400">No warranty recorded for this unit.</p>
          )}
        </div>
      )}

      {/* TAB 7: REPLACED PARTS */}
      {activeTab === 'parts' && (
        <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-4 h-4 text-blue-600" />
            Component Replacement History
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-400">
                  <th className="py-2.5 px-3">Part Number</th>
                  <th className="py-2.5 px-3">Part Name</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Quantity</th>
                  <th className="py-2.5 px-3">Total Cost</th>
                  <th className="py-2.5 px-3">Replacement Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tractor.serviceRecords?.flatMap((s: any) => s.serviceParts || []).map((sp: any) => (
                  <tr key={sp.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{sp.sparePart?.partNumber}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">{sp.sparePart?.partName}</td>
                    <td className="py-2.5 px-3 text-slate-600">{sp.sparePart?.category}</td>
                    <td className="py-2.5 px-3 text-slate-600">{sp.quantity}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{formatCurrency(sp.totalCost)}</td>
                    <td className="py-2.5 px-3 text-slate-400">{formatDate(sp.replacementDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
