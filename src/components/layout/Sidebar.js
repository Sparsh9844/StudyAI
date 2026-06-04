'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/utils/helpers'
import {
  LayoutDashboard, BookOpen, CalendarRange, RefreshCw, BarChart3, Bot, LogOut, Sparkles,
} from 'lucide-react'
import { signOut } from '@/services/auth'
import { useRouter } from 'next/navigation'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/subjects', label: 'Subjects', icon: BookOpen },
  { href: '/study-plan', label: 'Study Plan', icon: CalendarRange },
  { href: '/revision', label: 'Revision', icon: RefreshCw },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/assistant', label: 'AI Assistant', icon: Bot },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/auth/login')
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-black/60 backdrop-blur-2xl border-r border-white/[0.04] p-5 flex flex-col z-40">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-3 mb-10 group">
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div>
          <h1 className="text-white font-bold text-lg tracking-tight">StudyAI</h1>
          <p className="text-gray-600 text-[11px] font-medium tracking-wider uppercase">Smart Study Planner</p>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname?.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 relative group',
                active
                  ? 'text-white'
                  : 'text-gray-500 hover:text-gray-300'
              )}
            >
              {active && (
                <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/15" />
              )}
              <Icon className={cn(
                'w-4 h-4 relative z-10 transition-colors',
                active ? 'text-indigo-400' : 'group-hover:text-indigo-400'
              )} />
              <span className="relative z-10">{label}</span>
              {active && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-lg shadow-indigo-400/50" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Sign Out */}
      <button
        onClick={handleSignOut}
        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-300 hover:bg-white/[0.03] transition-all group"
      >
        <LogOut className="w-4 h-4 group-hover:text-red-400 transition-colors" />
        Sign Out
      </button>

      {/* Bottom decoration */}
      <div className="mt-4 pt-4 border-t border-white/[0.04]">
        <p className="text-[11px] text-gray-600 text-center">StudyAI v1.0</p>
      </div>
    </aside>
  )
}
