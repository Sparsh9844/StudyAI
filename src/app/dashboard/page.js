import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import {
  Code2, Brain, Cpu, ChevronRight,
  CalendarDays, Zap, Target, Briefcase,
  Circle, CheckCircle2, Layers,
} from 'lucide-react'
import { allProblems } from '@/data/dsaSheet'
import { userStorage } from '@/lib/userStorage'

// ── Time-based greeting ───────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours()
  if (h < 5)  return ['Night owl, huh?',   'Get some rest — you\'ll learn better fresh.']
  if (h < 12) return ['Good morning',       'A great day to get ahead.']
  if (h < 17) return ['Good afternoon',     'Stay focused, you\'re doing great.']
  if (h < 21) return ['Good evening',       'One last push before calling it a day.']
  return              ['Long day?',          'A little more and then rest well.']
}

// ── DSA progress from localStorage ───────────────────────────
function getDSAProgress() {
  try {
    const solved = JSON.parse(userStorage.getItem('dsa-sheet-solved') || '{}')
    const basic  = allProblems.filter(p => p.difficulty === 'Easy')
    const core   = allProblems.filter(p => p.difficulty === 'Medium')
    const pro    = allProblems.filter(p => p.difficulty === 'Hard')
    return {
      basic:  { done: basic.filter(p => solved[p.id]).length,  total: basic.length  },
      core:   { done: core.filter(p => solved[p.id]).length,   total: core.length   },
      pro:    { done: pro.filter(p => solved[p.id]).length,    total: pro.length    },
      total:  { done: Object.values(solved).filter(Boolean).length, total: allProblems.length },
    }
  } catch {
    return { basic:{done:0,total:0}, core:{done:0,total:0}, pro:{done:0,total:0}, total:{done:0,total:0} }
  }
}

// ── Problem of the Day ────────────────────────────────────────
function getProblemOfDay() {
  try {
    const solved  = JSON.parse(userStorage.getItem('dsa-sheet-solved') || '{}')
    const unsolved = allProblems.filter(p => !solved[p.id])
    if (!unsolved.length) return null
    return unsolved[new Date().getDate() % unsolved.length]
  } catch { return allProblems[0] }
}

// ── Interview tracker stats from localStorage ─────────────────
function getInterviewStats() {
  try {
    const entries = JSON.parse(userStorage.getItem('studyai-interview-tracker') || '[]')
    return {
      total:     entries.length,
      applied:   entries.filter(e => e.status === 'applied').length,
      interview: entries.filter(e => e.status === 'interview').length,
      offer:     entries.filter(e => e.status === 'offer').length,
      rejected:  entries.filter(e => e.status === 'rejected').length,
    }
  } catch { return { total:0, applied:0, interview:0, offer:0, rejected:0 } }
}

// ── Multi-segment arc ring ────────────────────────────────────
function DSARing({ basic, core, pro, total, size = 110, sw = 9 }) {
  const r    = (size - sw) / 2
  const circ = 2 * Math.PI * r
  const basicFrac = basic.total ? (basic.done / basic.total) * 0.33 : 0
  const coreFrac  = core.total  ? (core.done  / core.total)  * 0.34 : 0
  const proFrac   = pro.total   ? (pro.done   / pro.total)   * 0.33 : 0
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={sw} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#22c55e" strokeWidth={sw} strokeLinecap="round"
          strokeDasharray={`${basicFrac * circ} ${circ}`} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#eab308" strokeWidth={sw} strokeLinecap="round"
          strokeDasharray={`${coreFrac * circ} ${circ}`}
          style={{ transform: `rotate(${basicFrac * 360}deg)`, transformOrigin: '50% 50%' }} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#ef4444" strokeWidth={sw} strokeLinecap="round"
          strokeDasharray={`${proFrac * circ} ${circ}`}
          style={{ transform: `rotate(${(basicFrac + coreFrac) * 360}deg)`, transformOrigin: '50% 50%' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-white">{total.done}</span>
        <span className="text-[10px] text-zinc-500">/ {total.total}</span>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  // AppShell only renders this page once auth has resolved
  const { user, loading } = useAuth()

  // Progress is stored per account — recompute when the user changes
  const userId = user?.id
  const dsaProgress    = useMemo(() => getDSAProgress(), [userId])
  const potd           = useMemo(() => getProblemOfDay(), [userId])
  const ivStats        = useMemo(() => getInterviewStats(), [userId])
  const [greeting, sub] = getGreeting()
  const firstName = user?.user_metadata?.full_name?.split(' ')[0]
                 || user?.email?.split('@')[0]
                 || 'there'

  // Flashcard progress
  const flashcardProgress = useMemo(() => {
    try {
      const p = JSON.parse(userStorage.getItem('studyai-flashcards') || '{}')
      const known = Object.values(p).filter(v => v === 'known').length
      const total = 48 // 4 decks × 12 cards
      return { known, total }
    } catch { return { known: 0, total: 48 } }
  }, [userId])

  const exploreCards = [
    { label: 'DSA Sheet',         desc: `${dsaProgress.total.done}/${allProblems.length} solved`,  icon: Code2,     href: '/dsa',               color: 'text-indigo-400',  bg: 'bg-indigo-500/10'  },
    { label: 'Core CS',           desc: 'DBMS · OS · Computer Networks',                           icon: Cpu,       href: '/core-cs',           color: 'text-blue-400',    bg: 'bg-blue-500/10'    },
    { label: 'Aptitude Kit',      desc: 'Placement test practice',                                 icon: Brain,     href: '/aptitude',          color: 'text-purple-400',  bg: 'bg-purple-500/10'  },
    { label: 'Interview Tracker', desc: `${ivStats.total} applications tracked`,                   icon: Briefcase, href: '/interview-tracker', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  ]

  if (loading) return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-6">
      <div className="space-y-5">
        <div className="shimmer h-14 rounded-xl" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1,2,3,4].map(i => <div key={i} className="shimmer h-20 rounded-xl" />)}
        </div>
      </div>
      <div className="shimmer h-56 rounded-xl" />
    </div>
  )

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-6 pb-12">

      {/* ── LEFT COLUMN ── */}
      <div className="space-y-6 min-w-0">

        {/* Greeting */}
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold text-white">
            {greeting}, <span className="text-indigo-400">{firstName}</span>
            {dsaProgress.total.done > 30 && (
              <span className="ml-2 text-sm font-medium text-amber-400">
                <Zap className="w-4 h-4 inline" /> On fire!
              </span>
            )}
          </h1>
          <p className="text-zinc-500 text-sm mt-0.5">{sub}</p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-fade-in">
          {[
            { label: 'DSA Solved',   val: dsaProgress.total.done,     color: 'text-indigo-400', href: '/dsa'               },
            { label: 'Flashcards',   val: `${flashcardProgress.known}/${flashcardProgress.total}`, color: 'text-violet-400', href: '/flashcards' },
            { label: 'Applications', val: ivStats.total,              color: 'text-emerald-400', href: '/interview-tracker' },
            { label: 'Offers',       val: ivStats.offer,              color: 'text-yellow-400',  href: '/interview-tracker' },
          ].map(({ label, val, color, href }) => (
            <Link key={label} to={href}>
              <div className="glass rounded-xl p-4 hover:bg-zinc-800/60 transition-all">
                <p className={`text-2xl font-bold ${color}`}>{val}</p>
                <p className="text-zinc-500 text-xs mt-0.5">{label}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Explore Popular Topics */}
        <div className="animate-fade-in">
          <h2 className="text-sm font-semibold text-zinc-400 mb-3 flex items-center gap-2">
            <Target className="w-4 h-4" /> Explore Popular Topics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {exploreCards.map(({ label, desc, icon: Icon, href, color, bg }) => (
              <Link key={label} to={href}>
                <div className="glass rounded-xl p-4 flex items-center gap-4 hover:bg-zinc-800/70 transition-all group">
                  <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-6 h-6 ${color}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-white font-semibold text-sm">{label}</p>
                    <p className="text-zinc-500 text-xs mt-0.5 truncate">{desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-zinc-400 flex-shrink-0 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Flashcards banner */}
        <div className="glass rounded-xl p-5 border border-indigo-500/10 animate-fade-in">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wider mb-1">Flashcards</p>
              <h3 className="text-white font-bold text-base">Quick-fire concept revision</h3>
              <p className="text-zinc-500 text-sm mt-0.5">OS · DBMS · CN · System Design — flip & master</p>
            </div>
            <Link to="/flashcards"
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all">
              Start Revision <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Interview pipeline */}
        {ivStats.total > 0 && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-zinc-400 flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> Interview Pipeline
              </h2>
              <Link to="/interview-tracker" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                View all <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'Applied',   val: ivStats.applied,   color: 'text-blue-400',   bg: 'bg-blue-500/10'   },
                { label: 'Interview', val: ivStats.interview, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                { label: 'Offer',     val: ivStats.offer,     color: 'text-green-400',  bg: 'bg-green-500/10'  },
                { label: 'Rejected',  val: ivStats.rejected,  color: 'text-red-400',    bg: 'bg-red-500/10'    },
              ].map(({ label, val, color, bg }) => (
                <div key={label} className={`glass rounded-xl p-3 text-center ${bg}`}>
                  <p className={`text-xl font-bold ${color}`}>{val}</p>
                  <p className="text-zinc-600 text-xs mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="space-y-5">

        {/* DSA Progress */}
        <div className="glass rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">DSA Progress</h3>
            <Link to="/dsa" className="text-xs text-indigo-400 hover:text-indigo-300">View →</Link>
          </div>
          <div className="flex justify-center mb-4">
            <DSARing {...dsaProgress} size={110} sw={9} />
          </div>
          <div className="space-y-2.5">
            {[
              { label: 'Easy',   color: '#22c55e', ...dsaProgress.basic },
              { label: 'Medium', color: '#eab308', ...dsaProgress.core  },
              { label: 'Hard',   color: '#ef4444', ...dsaProgress.pro   },
            ].map(({ label, color, done, total }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                  <span className="text-zinc-400 text-xs">{label}</span>
                </div>
                <span className="text-zinc-300 text-xs font-semibold">{done} / {total}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Problem of the Day */}
        <div className="glass rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" /> Problem of the Day
            </h3>
          </div>
          {potd ? (
            <>
              <p className="text-white text-sm font-medium mb-1">{potd.title}</p>
              <p className="text-zinc-500 text-xs mb-3">{potd.patternName}</p>
              <div className="flex gap-2">
                <a href={potd.leetcode} target="_blank" rel="noopener noreferrer"
                  className="flex-1 text-center py-2 rounded-lg bg-orange-500/10 text-orange-400 text-xs font-semibold border border-orange-500/20 hover:bg-orange-500/20 transition-all">
                  LeetCode
                </a>
                <a href={potd.gfg} target="_blank" rel="noopener noreferrer"
                  className="flex-1 text-center py-2 rounded-lg bg-green-500/10 text-green-400 text-xs font-semibold border border-green-500/20 hover:bg-green-500/20 transition-all">
                  GFG
                </a>
              </div>
            </>
          ) : (
            <p className="text-green-400 text-sm font-semibold">🎉 All problems solved!</p>
          )}
        </div>

        {/* Daily Planner */}
        <div className="glass rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-indigo-400" /> Daily Planner
            </h3>
            <Link to="/flashcards" className="text-xs text-indigo-400 hover:text-indigo-300">Study now →</Link>
          </div>
          <div className="space-y-1.5">
            {[
              { label: 'OS Flashcards',     href: '/flashcards' },
              { label: 'DBMS Flashcards',   href: '/flashcards' },
              { label: 'CN Flashcards',     href: '/flashcards' },
              { label: 'System Design',     href: '/flashcards' },
            ].map(({ label, href }) => (
              <Link key={label} to={href}>
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800/60 transition-all">
                  <Circle className="w-3.5 h-3.5 text-zinc-700 flex-shrink-0" />
                  <p className="text-zinc-400 text-xs">{label}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
