import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: string | Date | null): string {
  if (!date) return '—'
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: string | Date | null): string {
  if (!date) return '—'
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    ACTIVE: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    INACTIVE: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
    UNDER_SERVICE: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    SOLD: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    SCRAPPED: 'bg-red-500/10 text-red-600 border-red-500/20',
    OPEN: 'bg-red-500/10 text-red-600 border-red-500/20',
    IN_PROGRESS: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    RESOLVED: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    CLOSED: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
    ESCALATED: 'bg-rose-500/10 text-rose-700 border-rose-500/20',
    NEW: 'bg-violet-500/10 text-violet-600 border-violet-500/20',
    ASSIGNED: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    WAITING_FOR_PART: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    COMPLETED: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    EXPIRED: 'bg-red-500/10 text-red-600 border-red-500/20',
    VOID: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
    CLAIMED: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    IN_STOCK: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    LOW_STOCK: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    OUT_OF_STOCK: 'bg-red-500/10 text-red-600 border-red-500/20',
    PENDING: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    APPROVED: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    REJECTED: 'bg-red-500/10 text-red-600 border-red-500/20',
    SETTLED: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
    LOW: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
    MEDIUM: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    HIGH: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
    CRITICAL: 'bg-red-500/10 text-red-700 border-red-500/20',
  }
  return map[status] ?? 'bg-slate-500/10 text-slate-500 border-slate-500/20'
}

export function getPriorityIcon(priority: string): string {
  const map: Record<string, string> = {
    LOW: '↓',
    MEDIUM: '→',
    HIGH: '↑',
    CRITICAL: '⚡',
  }
  return map[priority] ?? '→'
}

export function daysDiff(date: Date | string): number {
  const d = new Date(date)
  const now = new Date()
  return Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.slice(0, length) + '…' : str
}
