'use client'

import { useState, useEffect } from 'react'
import { UserCheck, Search, Phone, MapPin, Wrench, AlertCircle } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function TechniciansPage() {
  const [technicians, setTechnicians] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [specialization, setSpecialization] = useState('ALL')

  const fetchTechnicians = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append('q', search)
      if (specialization !== 'ALL') params.append('specialization', specialization)

      const res = await fetch(`/api/technicians?${params.toString()}`)
      if (res.ok) {
        const json = await res.json()
        setTechnicians(json)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTechnicians()
  }, [search, specialization])

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <UserCheck className="w-7 h-7 text-emerald-600" />
            Field Technicians Roster
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Certified service engineers, diagnostic specialists, and breakdown support crew.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100">
            {technicians.length} Technicians
          </span>
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search technician name, ID, phone number, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white"
          />
        </div>

        <select
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-emerald-500"
        >
          <option value="ALL">All Specializations</option>
          <option value="Engine">Engine</option>
          <option value="Hydraulic">Hydraulic</option>
          <option value="Electrical">Electrical</option>
          <option value="General">General</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-3 py-12 text-center text-slate-400">Loading technician team...</div>
        ) : technicians.map((tech) => (
          <div
            key={tech.id}
            className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{tech.name}</h3>
                  <p className="text-[11px] text-slate-400">{tech.techId} • {tech.region} Region</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {tech.specialization}
                </span>
              </div>

              <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{tech.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{tech.city}, {tech.state}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-slate-50 rounded-lg text-center">
                  <span className="text-slate-400 text-[10px] block font-semibold">Jobs Completed</span>
                  <span className="font-bold text-slate-900 text-sm">{tech._count?.serviceRecords || 0}</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg text-center">
                  <span className="text-slate-400 text-[10px] block font-semibold">Tickets Resolved</span>
                  <span className="font-bold text-slate-900 text-sm">{tech._count?.complaints || 0}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
              Joined {formatDate(tech.joinedDate)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
