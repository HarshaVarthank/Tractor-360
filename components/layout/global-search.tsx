'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  Search,
  Tractor,
  Users,
  Store,
  Wrench,
  AlertCircle,
  Package,
  X,
  ArrowRight,
  Loader2,
  CornerDownLeft,
} from 'lucide-react'

interface SearchResult {
  tractors: Array<{ id: string; tractorId: string; chassisNumber: string; model: { modelName: string; category: string }; customer: { name: string } }>
  customers: Array<{ id: string; customerId: string; name: string; phone: string; city: string }>
  dealers: Array<{ id: string; dealerId: string; name: string; city: string; state: string }>
  parts: Array<{ id: string; partNumber: string; partName: string; category: string }>
  complaints: Array<{ id: string; complaintId: string; category: string; status: string; tractor: { tractorId: string } }>
}

export default function GlobalSearch({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<SearchResult | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        if (isOpen) onClose()
        else {
          // Open
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      setQuery('')
      setResults(null)
    }
  }, [isOpen])

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults(null)
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        if (res.ok) {
          const data = await res.json()
          setResults(data)
        }
      } catch (err) {
        console.error('Search error', err)
      } finally {
        setLoading(false)
      }
    }, 200)

    return () => clearTimeout(timer)
  }, [query])

  if (!isOpen) return null

  const handleNavigate = (path: string) => {
    onClose()
    router.push(path)
  }

  const hasAnyResults =
    results &&
    (results.tractors.length > 0 ||
      results.customers.length > 0 ||
      results.dealers.length > 0 ||
      results.parts.length > 0 ||
      results.complaints.length > 0)

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div
        className="fixed inset-0"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden z-10 flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 gap-3">
          <Search className="w-5 h-5 text-blue-600 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tractors (TR-001, chassis), customers, parts, dealers, tickets..."
            className="flex-1 bg-transparent border-none text-slate-800 placeholder-slate-400 text-sm focus:outline-none"
          />
          {loading && <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />}
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 rounded bg-slate-100 text-[11px] font-medium text-slate-500 border border-slate-200">
            ESC
          </kbd>
        </div>

        {/* Search Results / Suggestions */}
        <div className="overflow-y-auto p-4 space-y-4 flex-1">
          {!query && (
            <div className="py-8 text-center text-slate-400 space-y-2">
              <p className="text-xs font-medium text-slate-500">Quick Searches to Try:</p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                {['TR-001', 'PowerMaster', 'Ramesh', 'Ludhiana', 'Engine', 'PRT-001', 'CMP-001'].map(
                  (term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-xs font-medium text-slate-600 transition-colors"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </div>
          )}

          {query && !loading && !hasAnyResults && (
            <div className="py-12 text-center text-slate-400">
              <p className="text-sm font-semibold text-slate-700">No records found for &quot;{query}&quot;</p>
              <p className="text-xs text-slate-400 mt-1">
                Try searching with a tractor chassis number, customer phone, dealer city, or part ID.
              </p>
            </div>
          )}

          {results && hasAnyResults && (
            <div className="space-y-4">
              {/* Tractors */}
              {results.tractors.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
                    <Tractor className="w-3.5 h-3.5 text-blue-600" />
                    Tractors ({results.tractors.length})
                  </div>
                  <div className="space-y-1">
                    {results.tractors.map((tr) => (
                      <button
                        key={tr.id}
                        onClick={() => handleNavigate(`/tractors/${tr.id}`)}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-blue-50/70 border border-transparent hover:border-blue-100 text-left transition-colors group"
                      >
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-800 group-hover:text-blue-700 flex items-center gap-2">
                            <span>{tr.tractorId}</span>
                            <span className="font-normal text-slate-500">— {tr.model.modelName} ({tr.model.category})</span>
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">
                            Chassis: {tr.chassisNumber} • Owner: {tr.customer?.name}
                          </div>
                        </div>
                        <span className="text-[11px] font-semibold text-blue-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          View 360° <ArrowRight className="w-3 h-3" />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Customers */}
              {results.customers.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-emerald-600" />
                    Customers ({results.customers.length})
                  </div>
                  <div className="space-y-1">
                    {results.customers.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => handleNavigate(`/customers/${c.id}`)}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-50/70 border border-transparent hover:border-emerald-100 text-left transition-colors group"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-800 group-hover:text-emerald-700">
                            {c.name} ({c.customerId})
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {c.phone} • {c.city}
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-emerald-600 opacity-0 group-hover:opacity-100" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Spare Parts */}
              {results.parts.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-amber-600" />
                    Spare Parts ({results.parts.length})
                  </div>
                  <div className="space-y-1">
                    {results.parts.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handleNavigate(`/spare-parts`)}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-amber-50/70 border border-transparent hover:border-amber-100 text-left transition-colors group"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-800">
                            {p.partNumber} — {p.partName}
                          </div>
                          <div className="text-[11px] text-slate-400">Category: {p.category}</div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-amber-600 opacity-0 group-hover:opacity-100" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Complaints / Tickets */}
              {results.complaints.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                    Complaints & Tickets ({results.complaints.length})
                  </div>
                  <div className="space-y-1">
                    {results.complaints.map((cmp) => (
                      <button
                        key={cmp.id}
                        onClick={() => handleNavigate(`/complaints`)}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-rose-50/70 border border-transparent hover:border-rose-100 text-left transition-colors group"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-800">
                            {cmp.complaintId} — {cmp.category} ({cmp.tractor?.tractorId})
                          </div>
                          <div className="text-[11px] text-slate-400">Status: {cmp.status}</div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-rose-600 opacity-0 group-hover:opacity-100" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Search index spans 14 relational data tables</span>
          <span className="flex items-center gap-1 font-medium text-slate-600">
            Press <CornerDownLeft className="w-3 h-3" /> to navigate
          </span>
        </div>
      </div>
    </div>
  )
}
