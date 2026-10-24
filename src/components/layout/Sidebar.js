import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { cn } from '@/utils/helpers'
import {
  LayoutDashboard, BookOpen, RefreshCw,
  Bot, Code2, Brain, Cpu, LogOut, GraduationCap,
  ChevronUp, ChevronDown,
  Calculator, MessageSquare, Lightbulb, Target,
  Briefcase, Layers,
} from 'lucide-react'
import { signOut } from '@/services/auth'

// ── Nav structure ─────────────────────────────────────────────
// type: 'link'   → plain nav item
// type: 'group'  → collapsible group with children
//   children: array of 'link' or nested 'group'
const NAV = [
  {
    sectionLabel: 'General',
    items: [
      { type: 'link', href: '/dashboard',         label: 'Dashboard',         icon: LayoutDashboard },
      { type: 'link', href: '/prep-hub',          label: 'Prep Hub',          icon: Target          },
      { type: 'link', href: '/interview-tracker', label: 'Interview Tracker', icon: Briefcase       },
      { type: 'link', href: '/flashcards',        label: 'Flashcards',        icon: Layers          },
    ],
  },
  {
    sectionLabel: 'Practice',
    items: [
      {
        type: 'group',
        label: 'Practice',
        icon: Code2,
        id: 'practice',
        children: [
          { type: 'link', href: '/dsa',      label: 'DSA Sheet',    icon: Code2 },
          { type: 'link', href: '/core-cs',  label: 'Core CS',      icon: Cpu },
          {
            type: 'group',
            label: 'Aptitude',
            icon: Brain,
            id: 'aptitude',
            children: [
              { type: 'link', href: '/aptitude?section=arithmetic',        label: 'Quantitative', icon: Calculator },
              { type: 'link', href: '/aptitude?section=logical',           label: 'Logical',      icon: Lightbulb },
              { type: 'link', href: '/aptitude?section=verbal',            label: 'Verbal',       icon: MessageSquare },
            ],
          },
        ],
      },
    ],
  },
  {
    sectionLabel: 'Tools',
    items: [
      { type: 'link', href: '/assistant', label: 'Sage', icon: Bot },
    ],
  },
]

// ── Single flat link ───────────────────────────────────────────
function NavLink({ href, label, icon: Icon, depth = 0 }) {
  const pathname = useLocation().pathname
  const active = pathname === href || pathname === href.split('?')[0]

  return (
    <Link
      to={href}
      className={cn(
        'flex items-center gap-2.5 py-2 pr-3 rounded-lg text-sm transition-all duration-150 w-full',
        depth === 0 ? 'pl-3' : depth === 1 ? 'pl-4' : 'pl-5',
        active
          ? 'bg-indigo-600/15 text-white font-semibold'
          : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60 font-medium'
      )}
    >
      <Icon className={cn('w-4 h-4 flex-shrink-0', active ? 'text-indigo-400' : 'text-zinc-500')} />
      <span>{label}</span>
      {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />}
    </Link>
  )
}

// ── Collapsible group ──────────────────────────────────────────
function NavGroup({ item, depth = 0, defaultOpen = true }) {
  const pathname = useLocation().pathname
  const [open, setOpen] = useState(defaultOpen)

  // Auto-open if any child is active
  const isChildActive = (children) =>
    children?.some(c =>
      c.type === 'link'
        ? pathname === c.href || pathname === c.href.split('?')[0]
        : isChildActive(c.children)
    )

  const hasActive = isChildActive(item.children)
  const Icon = item.icon

  return (
    <div>
      {/* Group header button */}
      <button
        onClick={() => setOpen(v => !v)}
        className={cn(
          'flex items-center gap-2.5 w-full py-2 pr-3 rounded-lg text-sm transition-all duration-150',
          depth === 0 ? 'pl-3' : depth === 1 ? 'pl-4' : 'pl-5',
          hasActive
            ? 'text-indigo-300 font-semibold'
            : 'text-zinc-400 hover:text-white font-medium'
        )}
      >
        <Icon className={cn('w-4 h-4 flex-shrink-0', hasActive ? 'text-indigo-400' : 'text-zinc-500')} />
        <span className="flex-1 text-left">{item.label}</span>
        {open
          ? <ChevronUp className="w-3.5 h-3.5 text-zinc-600" />
          : <ChevronDown className="w-3.5 h-3.5 text-zinc-600" />
        }
      </button>

      {/* Children with tree line */}
      {open && (
        <div className={cn('relative mt-0.5', depth === 0 ? 'ml-[22px]' : 'ml-[22px]')}>
          {/* Vertical tree line */}
          <span className="absolute left-0 top-1 bottom-3 w-px bg-zinc-800" />
          <div className="space-y-0.5">
            {item.children.map((child, idx) => (
              <div key={child.href || child.id || idx} className="relative pl-4">
                {/* Horizontal connector tick */}
                <span className="absolute left-0 top-[17px] w-3 h-px bg-zinc-800" />
                {child.type === 'link'
                  ? <NavLink {...child} depth={depth + 1} />
                  : <NavGroup item={child} depth={depth + 1} defaultOpen={false} />
                }
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Sidebar ────────────────────────────────────────────────────
export function Sidebar() {
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/auth/login', { replace: true })
  }

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-screen w-60 bg-zinc-950 border-r border-zinc-800/60 flex-col z-40 overflow-y-auto">

      {/* Logo */}
      <div className="px-4 py-5 border-b border-zinc-800/60">
        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-none">StudyAI</p>
            <p className="text-[10px] text-zinc-500 mt-0.5 tracking-wide">Smart Planner</p>
          </div>
        </Link>
      </div>

      {/* Nav sections */}
      <nav className="flex-1 px-3 py-4 space-y-5">
        {NAV.map(section => (
          <div key={section.sectionLabel}>
            {/* Section label */}
            <p className="px-3 mb-1.5 text-[10px] font-semibold text-zinc-600 uppercase tracking-widest">
              {section.sectionLabel}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item, idx) =>
                item.type === 'link'
                  ? <NavLink key={item.href} {...item} depth={0} />
                  : <NavGroup key={item.id || idx} item={item} depth={0} defaultOpen={true} />
              )}
            </div>
          </div>
        ))}
      </nav>

      {/* Sign out */}
      <div className="px-3 py-4 border-t border-zinc-800/60">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm font-medium text-zinc-500 hover:bg-red-950/40 hover:text-red-400 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
        <p className="text-[10px] text-zinc-800 text-center mt-3">StudyAI v1.0</p>
      </div>
    </aside>
  )
}
