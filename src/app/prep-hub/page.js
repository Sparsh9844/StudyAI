import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Code2, Cpu, Brain, BookOpen,
  ChevronRight, Clock, Layers, FileText,
  Calculator, MessageSquare, Lightbulb, Database, Network, Monitor,
} from 'lucide-react'
import { dsaPatterns, allProblems } from '@/data/dsaSheet'
import { coreSubjects, allCoreTopics } from '@/data/coreCS'
import { aptitudeSections } from '@/data/aptitudeKit'
import { userStorage } from '@/lib/userStorage'

const TABS = [
  { id: 'dsa',      label: 'DSA',      icon: Code2  },
  { id: 'core-cs',  label: 'Core CS',  icon: Cpu    },
  { id: 'aptitude', label: 'Aptitude', icon: Brain  },
]

// ── DSA tab ───────────────────────────────────────────────────
function DSATab() {
  const solved = (() => {
    try { return JSON.parse(userStorage.getItem('dsa-sheet-solved') || '{}') } catch { return {} }
  })()

  const courses = [
    {
      title: 'DSA Pattern Sheet',
      desc: 'Pattern-wise DSA problems: Two Pointer, Sliding Window, DP, and more.',
      icon: Code2,
      modules: dsaPatterns.length,
      topics: allProblems.length,
      hrs: Math.round(allProblems.length * 0.5),
      href: '/dsa',
      label: 'Start Coding',
      color: 'bg-indigo-600/15 border-indigo-500/20',
      iconColor: 'text-indigo-400',
      iconBg: 'bg-indigo-600/20',
    },
  ]

  const patterns = dsaPatterns.map(p => ({
    ...p,
    done: p.problems.filter(pr => solved[pr.id]).length,
  }))

  return (
    <div className="space-y-6">
      {/* Hero course card */}
      {courses.map(c => (
        <div key={c.title} className={`glass rounded-2xl p-6 border ${c.color}`}>
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-14 h-14 rounded-2xl ${c.iconBg} flex items-center justify-center`}>
              <c.icon className={`w-7 h-7 ${c.iconColor}`} />
            </div>
            <div>
              <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-0.5">{c.label}</p>
              <h2 className="text-lg font-bold text-white">{c.title}</h2>
              <p className="text-zinc-400 text-sm">{c.desc}</p>
            </div>
          </div>
          <div className="flex items-center gap-5 text-xs text-zinc-500 mb-5">
            <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" />{c.modules} Patterns</span>
            <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" />{c.topics} Problems</span>
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />~{c.hrs} hrs</span>
          </div>
          <Link to={c.href}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all">
            Explore <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      ))}

      {/* Patterns grid */}
      <div>
        <h3 className="text-sm font-semibold text-zinc-400 mb-3">All Patterns</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {patterns.map(p => (
            <Link key={p.id} to={`/dsa`}>
              <div className="glass rounded-xl p-4 hover:bg-zinc-800/60 transition-all">
                <p className="text-white text-sm font-semibold">{p.name}</p>
                <p className="text-zinc-500 text-xs mt-0.5 line-clamp-1">{p.description}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-zinc-600 text-xs">{p.problems.length} problems</span>
                  <span className="text-indigo-400 text-xs font-semibold">{p.done}/{p.problems.length}</span>
                </div>
                <div className="h-1 bg-zinc-800 rounded-full overflow-hidden mt-1.5">
                  <div className="h-full bg-indigo-500 rounded-full transition-all"
                    style={{ width: `${p.problems.length ? (p.done / p.problems.length) * 100 : 0}%` }} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Core CS tab ───────────────────────────────────────────────
function CoreCSTab() {
  const done = (() => {
    try { return JSON.parse(userStorage.getItem('core-cs-done') || '{}') } catch { return {} }
  })()

  const SUBJECT_ICON = { dbms: Database, os: Monitor, cn: Network }
  const SUBJECT_COLOR = {
    dbms: { bg: 'bg-blue-600/15',   border: 'border-blue-500/20',    icon: 'text-blue-400',    bar: 'bg-blue-500'   },
    os:   { bg: 'bg-violet-600/15', border: 'border-violet-500/20',  icon: 'text-violet-400',  bar: 'bg-violet-500' },
    cn:   { bg: 'bg-emerald-600/15',border: 'border-emerald-500/20', icon: 'text-emerald-400', bar: 'bg-emerald-500'},
  }

  return (
    <div className="space-y-5">
      <p className="text-zinc-500 text-sm">
        Core Computer Science subjects asked in every technical interview.
        Tick off topics as you study them.
      </p>
      {coreSubjects.map(s => {
        const Icon = SUBJECT_ICON[s.id] || BookOpen
        const c = SUBJECT_COLOR[s.id] || { bg:'bg-zinc-800', border:'border-zinc-700', icon:'text-white', bar:'bg-indigo-500' }
        const doneCount = s.topics.filter(t => done[t.id]).length
        const pct = s.topics.length ? Math.round((doneCount / s.topics.length) * 100) : 0
        return (
          <div key={s.id} className={`glass rounded-2xl p-6 border ${c.border}`}>
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${c.icon}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-bold text-white">{s.name}</h2>
                <p className="text-zinc-500 text-xs mt-0.5">{s.description}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className={`text-lg font-bold ${c.icon}`}>{doneCount}<span className="text-zinc-600 text-sm font-normal">/{s.topics.length}</span></p>
                <p className="text-zinc-600 text-xs">{pct}% done</p>
              </div>
            </div>
            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden mb-4">
              <div className={`h-full ${c.bar} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
            </div>
            <div className="flex items-center gap-4 text-xs text-zinc-500 mb-4">
              <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" />{s.topics.length} Topics</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />~{s.topics.length * 0.5} hrs</span>
            </div>
            <Link to="/core-cs"
              className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-semibold rounded-xl transition-all border border-zinc-700">
              Explore <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )
      })}
    </div>
  )
}

// ── Aptitude tab ──────────────────────────────────────────────
function AptitudeTab() {
  const answered = (() => {
    try { return JSON.parse(userStorage.getItem('aptitude-kit-state') || '{}').answers || {} } catch { return {} }
  })()

  const SECTION_CONFIG = {
    arithmetic:           { icon: Calculator,    color: 'text-blue-400',    bg: 'bg-blue-500/10',    bar: 'bg-blue-500',    border: 'border-blue-500/20',    label: 'Quantitative' },
    logical:              { icon: Lightbulb,     color: 'text-purple-400',  bg: 'bg-purple-500/10',  bar: 'bg-purple-500',  border: 'border-purple-500/20',  label: 'Logical'      },
    verbal:               { icon: MessageSquare, color: 'text-green-400',   bg: 'bg-green-500/10',   bar: 'bg-green-500',   border: 'border-green-500/20',   label: 'Verbal'       },
    'data-interpretation':{ icon: Layers,        color: 'text-orange-400',  bg: 'bg-orange-500/10',  bar: 'bg-orange-500',  border: 'border-orange-500/20',  label: 'Data Interp.' },
    puzzles:              { icon: Brain,          color: 'text-red-400',     bg: 'bg-red-500/10',     bar: 'bg-red-500',     border: 'border-red-500/20',     label: 'Puzzles'      },
    'mental-ability':     { icon: Code2,          color: 'text-indigo-400',  bg: 'bg-indigo-500/10',  bar: 'bg-indigo-500',  border: 'border-indigo-500/20',  label: 'Mental Ability'},
  }

  return (
    <div className="space-y-5">
      <p className="text-zinc-500 text-sm">
        Practice quantitative, logical, and verbal aptitude — essential for TCS, Infosys, Wipro, Cognizant placements.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {aptitudeSections.map(s => {
          const cfg = SECTION_CONFIG[s.id] || {}
          const Icon = cfg.icon || Brain
          const attempted = s.questions.filter(q => answered[q.id] !== undefined).length
          const correct   = s.questions.filter(q => answered[q.id] === q.ans).length
          const pct = s.questions.length ? Math.round((attempted / s.questions.length) * 100) : 0

          return (
            <Link key={s.id} to={`/aptitude?section=${s.id}`}>
              <div className={`glass rounded-xl p-5 border ${cfg.border || 'border-zinc-800'} hover:bg-zinc-800/50 transition-all`}>
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${cfg.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-bold">{cfg.label || s.name}</p>
                    <p className="text-zinc-500 text-xs mt-0.5 line-clamp-1">{s.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-zinc-600 mb-3">
                  <span>{s.questions.length} Questions</span>
                  <span className="text-green-400">{correct} Correct</span>
                </div>
                <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div className={`h-full ${cfg.bar} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                </div>
                <p className="text-zinc-600 text-xs mt-1">{pct}% attempted</p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────
export default function PrepHubPage() {
  const [activeTab, setActiveTab] = useState('dsa')

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Prep Hub</h1>
        <p className="text-zinc-500 text-sm mt-0.5">Structured learning paths for placements & interviews</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 p-1 bg-zinc-900 rounded-xl border border-zinc-800 w-fit">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === id
                ? 'bg-zinc-700 text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'dsa'      && <DSATab />}
      {activeTab === 'core-cs'  && <CoreCSTab />}
      {activeTab === 'aptitude' && <AptitudeTab />}
    </div>
  )
}
