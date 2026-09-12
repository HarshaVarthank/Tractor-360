'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Shield, Sparkles, Tractor, Lock, Mail, ArrowRight, Loader2, Check } from 'lucide-react'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('admin@tractor360.com')
  const [password, setPassword] = useState('password123')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please enter email and password')
      return
    }
    setLoading(true)
    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (res?.error) {
        toast.error('Invalid credentials. Please check email and password.')
      } else {
        toast.success('Welcome back to Tractor 360°!')
        router.push('/')
        router.refresh()
      }
    } catch (err) {
      toast.error('An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (demoEmail: string, roleName: string) => {
    setEmail(demoEmail)
    setPassword('password123')
    toast.info(`Filled credentials for ${roleName}`)
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#0b101b] text-slate-100">
      {/* Left side: Enterprise Brand Showcase */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 xl:p-16 relative overflow-hidden bg-gradient-to-br from-[#0e1628] via-[#0b111e] to-[#070b14] border-r border-slate-800/80">
        {/* Glow ambient spots */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Branding */}
        <div className="relative z-10 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25 border border-blue-400/30 shrink-0">
            <Tractor className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
              Tractor <span className="text-blue-500">360°</span>
            </h1>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Enterprise Ag-Machinery Intelligence
            </p>
          </div>
        </div>

        {/* Central Hero Block */}
        <div className="relative z-10 my-auto py-12 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-300 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Unified Fleet & Customer Lifecycle Platform</span>
          </div>

          <h2 className="text-4xl xl:text-5xl font-black text-white leading-[1.15] tracking-tight mb-6">
            One Tractor.<br />
            One Customer.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">
              One Complete Data View.
            </span>
          </h2>

          <p className="text-slate-300 text-sm xl:text-base leading-relaxed mb-8">
            Consolidating scattered sales records, farmer profiles, service bay logs, warranty claims, spare parts inventory, and dealer performance into a single unified pane.
          </p>

          {/* Metric cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm">
              <div className="text-2xl font-black text-white mb-0.5">360°</div>
              <div className="text-xs text-slate-400 leading-snug">Unified lifecycle history per chassis & customer</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm">
              <div className="text-2xl font-black text-emerald-400 mb-0.5">14+</div>
              <div className="text-xs text-slate-400 leading-snug">Interconnected relational models & instant omni-search</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="relative z-10 pt-6 border-t border-slate-800/80 text-xs text-slate-500 flex items-center justify-between">
          <span>© 2026 Tractor 360° Platform</span>
          <span className="flex items-center gap-1.5 text-slate-400 font-medium">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            Role-Based Access Control
          </span>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Tractor className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Tractor <span className="text-blue-500">360°</span></h1>
              <p className="text-xs text-slate-400">Enterprise Intelligence</p>
            </div>
          </div>

          {/* Main Card */}
          <div className="bg-[#111726] border border-slate-800 rounded-2xl p-7 sm:p-8 shadow-2xl shadow-black/60">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white tracking-tight">Sign In to Console</h2>
              <p className="text-xs text-slate-400 mt-1">
                Enter your credentials or choose a 1-click demo profile below.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="flex items-center bg-[#090d16] border border-slate-700/80 rounded-xl px-3.5 h-11 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                  <Mail className="w-4 h-4 text-slate-400 mr-3 shrink-0" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@tractor360.com"
                    className="w-full bg-transparent border-none outline-none text-white text-xs sm:text-sm placeholder-slate-500"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Password
                  </label>
                  <span className="text-[11px] text-slate-400">Default: password123</span>
                </div>
                <div className="flex items-center bg-[#090d16] border border-slate-700/80 rounded-xl px-3.5 h-11 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                  <Lock className="w-4 h-4 text-slate-400 mr-3 shrink-0" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-transparent border-none outline-none text-white text-xs sm:text-sm placeholder-slate-500"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-3"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Fill Profiles */}
            <div className="mt-8 pt-6 border-t border-slate-800/80">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Demo Profiles (1-Click Fill)
                </span>
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <Check className="w-3 h-3" /> Ready
                </span>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => fillDemo('admin@tractor360.com', 'Admin')}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all group ${
                    email === 'admin@tractor360.com'
                      ? 'bg-slate-800/80 border-blue-500/50'
                      : 'bg-[#090d16] hover:bg-slate-800/50 border-slate-800'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-blue-400 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      Rajesh Kumar (Full Admin)
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">admin@tractor360.com</div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    Admin
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => fillDemo('manager@tractor360.com', 'Manager')}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all group ${
                    email === 'manager@tractor360.com'
                      ? 'bg-slate-800/80 border-blue-500/50'
                      : 'bg-[#090d16] hover:bg-slate-800/50 border-slate-800'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-blue-400 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      Priya Sharma (Operations)
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">manager@tractor360.com</div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    Manager
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => fillDemo('viewer@tractor360.com', 'Viewer')}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all group ${
                    email === 'viewer@tractor360.com'
                      ? 'bg-slate-800/80 border-blue-500/50'
                      : 'bg-[#090d16] hover:bg-slate-800/50 border-slate-800'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-blue-400 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-slate-400" />
                      Sunita Devi (Field View)
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">viewer@tractor360.com</div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-700/30 text-slate-300 border border-slate-700">
                    Viewer
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
