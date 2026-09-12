'use client'

import { useSession } from 'next-auth/react'
import { Settings, Shield, User, Database, Building2, HardDrive, Bell } from 'lucide-react'

export default function SettingsPage() {
  const { data: session } = useSession()

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
          <Settings className="w-7 h-7 text-slate-700" />
          Enterprise Platform Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage system configurations, data pipelines, role permissions, and active credentials.
        </p>
      </div>

      {/* Account Info */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <User className="w-4 h-4 text-blue-600" />
          Active User Profile
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl space-y-1">
            <span className="text-slate-400 block font-medium">Logged in Name</span>
            <span className="text-sm font-bold text-slate-900">{session?.user?.name || 'Administrator'}</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl space-y-1">
            <span className="text-slate-400 block font-medium">Email Address</span>
            <span className="text-sm font-bold text-slate-900">{session?.user?.email || 'admin@tractor360.com'}</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl space-y-1">
            <span className="text-slate-400 block font-medium">Security Access Role</span>
            <span className="inline-block px-2.5 py-0.5 rounded text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
              {session?.user?.role || 'ADMIN'}
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl space-y-1">
            <span className="text-slate-400 block font-medium">Session Strategy</span>
            <span className="text-sm font-bold text-slate-900">NextAuth JWT Stateless</span>
          </div>
        </div>
      </div>

      {/* Database & Infrastructure Config */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-600" />
          Database & Storage Node
        </h2>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl">
            <div>
              <div className="font-bold text-slate-900">Database Engine</div>
              <div className="text-slate-400">Prisma ORM with SQLite file storage (`file:./dev.db`)</div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">
              HEALTHY / SYNCED
            </span>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl">
            <div>
              <div className="font-bold text-slate-900">Schema Relational Models</div>
              <div className="text-slate-400">14 relational models including Tractors, Customers, Sales, Service, Warranty</div>
            </div>
            <span className="font-mono font-bold text-slate-800">14 / 14 Active</span>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl">
            <div>
              <div className="font-bold text-slate-900">Universal Search Index</div>
              <div className="text-slate-400">Full-text search enabled for Tractor IDs, Chassis numbers, Customer names, and Spare parts</div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700">
              OPTIMIZED
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
