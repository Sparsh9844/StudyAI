import { useState, useEffect, useMemo } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import {
  Cpu, Search, RotateCcw, CheckCircle2, Circle,
  ExternalLink, ChevronDown, ChevronUp, Trophy,
  Database, Network, Monitor,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { coreSubjects, allCoreTopics, tagVariant } from '@/data/coreCS'

const STORAGE_KEY = 'core-cs-done'

const SUBJECT_ICON = { dbms: Database, os: Monitor, cn: Network }

function loadDone() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}
function saveDone(done) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(done)) } catch { /* ignore */ }
}

export default function CoreCSPage() {
  const [done, setDone] = useState({})
  const [activeSubject, setActiveSubject] = useState('all')
  const [search, setSearch] = useState('')
  const [hideDone, setHideDone] = useState(false)
  const [collapsed, setCollapsed] = useState({})
  const [initialized, setInitialized] = useState(false)

  useEffect(() => { setDone(loadDone()); setInitialized(true) }, [])

  const toggle = (id) => {
    const next = { ...done, [id]: !done[id] }
    setDone(next)
    saveDone(next)
  }

  const resetAll = () => {
    if (!confirm('Reset all Core CS progress?')) return
    setDone({})
    saveDone({})
    toast.success('Progress reset')
  }

  // ── Stats ──────────────────────────────────────────────────
  const stats = useMemo(() => {
    const total = allCoreTopics.length
    const completed = allCoreTopics.filter(t => done[t.id]).length
    const bySubject = coreSubjects.reduce((acc, s) => {
      acc[s.id] = {
        total: s.topics.length,
        done: s.topics.filter(t => done[t.id]).length,
      }
      return acc
    }, {})
    return { total, completed, bySubject }
  }, [done])

  // ── Filtered view ──────────────────────────────────────────
  const visibleSubjects = useMemo(() => {
    return coreSubjects
      .filter(s => activeSubject === 'all' || s.id === activeSubject)
      .map(s => ({
        ...s,
        topics: s.topics.filter(t => {
          if (hideDone && done[t.id]) return false
          if (search && !t.title.toLowerCase().includes(search.toLowerCase()) &&
              !t.desc.toLowerCase().includes(search.toLowerCase())) return false
          return true
        }),
      }))
      .filter(s => s.topics.length > 0)
  }, [activeSubject, search, hideDone, done])

  const toggleCollapse = id => setCollapsed(c => ({ ...c, [id]: !c[id] }))

  const overallPct = stats.total ? Math.round((stats.completed / stats.total) * 100) : 0

  if (!initialized) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Header ── */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Cpu className="w-5 h-5 text-white" />
            </span>
            Core CS
          </h1>
          <p className="text-gray-400 mt-1 ml-[52px]">
            Interview-ready theory for DBMS · OS · Computer Networks — with source links
          </p>
        </div>
        <button
          onClick={resetAll}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white/5 text-gray-400 border border-white/10 hover:text-white hover:bg-white/10 transition-all"
        >
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
      </div>

      {/* ── Overall progress ── */}
      <Card className="!p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-gray-400 text-sm">Overall Progress</p>
            <p className="text-2xl font-bold text-white">
              {stats.completed}
              <span className="text-gray-500 text-lg font-normal"> / {stats.total} topics</span>
            </p>
          </div>
          <span className="text-3xl font-bold gradient-text">{overallPct}%</span>
        </div>
        <div className="h-2 rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-700"
            style={{ width: `${overallPct}%` }}
          />
        </div>

        {/* Per-subject breakdown */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          {coreSubjects.map(s => {
            const ss = stats.bySubject[s.id]
            const pct = ss.total ? Math.round((ss.done / ss.total) * 100) : 0
            const Icon = SUBJECT_ICON[s.id] || Cpu
            return (
              <button
                key={s.id}
                onClick={() => setActiveSubject(activeSubject === s.id ? 'all' : s.id)}
                className={`rounded-xl p-3 text-left transition-all border ${
                  activeSubject === s.id
                    ? `${s.bg} ${s.border}`
                    : 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06]'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center ${s.bg}`}>
                    <Icon className={`w-4 h-4 ${s.text}`} />
                  </span>
                  <span className="text-white text-sm font-semibold">{s.short}</span>
                </div>
                <p className={`text-lg font-bold ${s.text}`}>
                  {ss.done}<span className="text-gray-500 text-sm font-normal">/{ss.total}</span>
                </p>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden mt-1.5">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${s.color} transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </button>
            )
          })}
        </div>
      </Card>

      {/* ── Controls ── */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search topics..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="!pl-10"
          />
        </div>
        <button
          onClick={() => setHideDone(v => !v)}
          className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
            hideDone
              ? 'bg-green-500/10 text-green-400 border-green-500/20'
              : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
          }`}
        >
          {hideDone ? 'Hiding Done' : 'Hide Done'}
        </button>
        <button
          onClick={() => setActiveSubject('all')}
          className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
            activeSubject === 'all'
              ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/30'
              : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
          }`}
        >
          All Subjects
        </button>
      </div>

      {/* ── Topic list ── */}
      <div className="space-y-8">
        {visibleSubjects.length === 0 && (
          <Card className="text-center py-12">
            <Search className="w-10 h-10 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-300 font-medium">No topics match your filter</p>
            <p className="text-gray-600 text-sm mt-1">Clear the search or turn off "Hide Done"</p>
          </Card>
        )}

        {visibleSubjects.map(subject => {
          const ss = stats.bySubject[subject.id]
          const isCollapsed = collapsed[subject.id]
          const Icon = SUBJECT_ICON[subject.id] || Cpu
          const allDone = ss.done === ss.total && ss.total > 0

          return (
            <div key={subject.id} className="animate-fade-in">
              {/* Subject header */}
              <button
                onClick={() => toggleCollapse(subject.id)}
                className="w-full flex items-center justify-between gap-3 mb-3 group"
              >
                <div className="flex items-center gap-3 text-left">
                  <span className={`w-10 h-10 rounded-xl bg-gradient-to-br ${subject.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                    <Icon className="w-5 h-5 text-white" />
                  </span>
                  <div>
                    <h2 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors flex items-center gap-2">
                      {subject.name}
                      {allDone && <Trophy className="w-4 h-4 text-yellow-400" />}
                    </h2>
                    <p className="text-gray-500 text-xs max-w-xl mt-0.5">{subject.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`text-sm font-semibold ${subject.text}`}>
                    {ss.done}/{ss.total}
                  </span>
                  {isCollapsed
                    ? <ChevronDown className="w-5 h-5 text-gray-500" />
                    : <ChevronUp className="w-5 h-5 text-gray-500" />
                  }
                </div>
              </button>

              {!isCollapsed && (
                <div className="space-y-2.5">
                  {subject.topics.map(topic => {
                    const isDone = !!done[topic.id]
                    return (
                      <Card
                        key={topic.id}
                        className={`!p-4 transition-all group/card ${isDone ? 'opacity-70' : 'hover:bg-white/[0.06]'}`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Checkbox */}
                          <button
                            onClick={() => toggle(topic.id)}
                            className="mt-0.5 flex-shrink-0"
                            title={isDone ? 'Mark as pending' : 'Mark as done'}
                          >
                            {isDone
                              ? <CheckCircle2 className={`w-5 h-5 ${subject.text}`} />
                              : <Circle className="w-5 h-5 text-gray-600 hover:text-indigo-400 transition-colors" />
                            }
                          </button>

                          <div className="flex-1 min-w-0">
                            {/* Title + tags */}
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <h3 className={`text-sm font-semibold ${isDone ? 'text-gray-500 line-through' : 'text-white'}`}>
                                {topic.title}
                              </h3>
                              {topic.tags.map(tag => (
                                <Badge key={tag} variant={tagVariant[tag] || 'default'}>
                                  {tag}
                                </Badge>
                              ))}
                            </div>

                            {/* Description */}
                            <p className="text-gray-400 text-xs mb-3 leading-relaxed">{topic.desc}</p>

                            {/* Source links */}
                            <div className="flex flex-wrap gap-2">
                              {topic.links.map(link => (
                                <a
                                  key={link.url}
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${subject.bg} ${subject.text} ${subject.border} hover:opacity-90`}
                                >
                                  {link.label}
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Card>
                    )
                  })}

                  {/* Subject complete badge */}
                  {allDone && (
                    <div className={`flex items-center justify-center gap-2 py-3 rounded-xl border ${subject.bg} ${subject.border}`}>
                      <Trophy className="w-4 h-4 text-yellow-400" />
                      <span className={`text-sm font-medium ${subject.text}`}>
                        {subject.short} complete!
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
