import { useState, useEffect, useMemo } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import {
  Code2,
  Search,
  RotateCcw,
  CheckCircle2,
  Circle,
  ExternalLink,
  ChevronDown,
} from 'lucide-react'
import toast from 'react-hot-toast'
import {
  dsaPatterns,
  allProblems,
  patternMeta,
  difficultyVariant,
} from '@/data/dsaSheet'

const STORAGE_KEY = 'dsa-sheet-solved'
const DIFFICULTIES = ['Easy', 'Medium', 'Hard']

export default function DsaPage() {
  const [solved, setSolved] = useState({})
  const [patternFilter, setPatternFilter] = useState('all')
  const [difficultyFilter, setDifficultyFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [hideSolved, setHideSolved] = useState(false)
  const [collapsed, setCollapsed] = useState({})

  // Hydrate solved state from localStorage after mount (localStorage is an
  // external store, so reading it in an effect is the correct pattern and
  // avoids SSR/hydration mismatch).
  useEffect(() => {
    let next = {}
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) next = JSON.parse(raw)
    } catch {
      next = {}
    }
    setSolved(next)
  }, [])

  const persist = (next) => {
    setSolved(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      /* storage might be unavailable; ignore */
    }
  }

  const toggleSolved = (id) => {
    persist({ ...solved, [id]: !solved[id] })
  }

  const resetProgress = () => {
    if (!confirm('Reset all DSA sheet progress? This cannot be undone.')) return
    persist({})
    toast.success('Progress reset')
  }

  // Stats computed from the full problem set.
  const stats = useMemo(() => {
    const total = allProblems.length
    const done = Object.values(solved).filter(Boolean).length
    const byDiff = DIFFICULTIES.reduce((acc, d) => {
      const all = allProblems.filter((p) => p.difficulty === d)
      const doneCount = all.filter((p) => solved[p.id]).length
      acc[d] = { total: all.length, done: doneCount }
      return acc
    }, {})
    return { total, done, byDiff }
  }, [solved])

  // Filter patterns + problems by the active controls.
  const visiblePatterns = useMemo(() => {
    return dsaPatterns
      .filter((p) => patternFilter === 'all' || p.id === patternFilter)
      .map((pattern) => ({
        ...pattern,
        problems: pattern.problems.filter((p) => {
          if (difficultyFilter !== 'all' && p.difficulty !== difficultyFilter)
            return false
          if (hideSolved && solved[p.id]) return false
          if (search && !p.title.toLowerCase().includes(search.toLowerCase()))
            return false
          return true
        }),
      }))
      .filter((pattern) => pattern.problems.length > 0)
  }, [patternFilter, difficultyFilter, search, hideSolved, solved])

  const toggleCollapse = (id) => setCollapsed((c) => ({ ...c, [id]: !c[id] }))

  const diffColor = (d) =>
    d === 'Easy'
      ? 'text-green-400'
      : d === 'Medium'
        ? 'text-yellow-400'
        : 'text-red-400'

  const overallPct = stats.total
    ? Math.round((stats.done / stats.total) * 100)
    : 0

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Code2 className="w-5 h-5 text-white" />
            </span>
            DSA Sheet
          </h1>
          <p className="text-gray-400 mt-1">
            Pattern-wise practice problems with LeetCode &amp; GeeksforGeeks links
          </p>
        </div>
        <button
          onClick={resetProgress}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white/5 text-gray-400 border border-white/10 hover:text-white hover:bg-white/10 transition-all"
        >
          <RotateCcw className="w-4 h-4" /> Reset Progress
        </button>
      </div>

      {/* Overall progress */}
      <Card className="!p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-gray-400 text-sm">Overall Progress</p>
            <p className="text-2xl font-bold text-white">
              {stats.done}
              <span className="text-gray-500 text-lg font-normal"> / {stats.total} solved</span>
            </p>
          </div>
          <span className="text-3xl font-bold gradient-text">{overallPct}%</span>
        </div>
        <div className="h-2 rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
            style={{ width: `${overallPct}%` }}
          />
        </div>
        {/* Difficulty breakdown */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          {DIFFICULTIES.map((d) => {
            const { total, done } = stats.byDiff[d]
            const pct = total ? Math.round((done / total) * 100) : 0
            return (
              <div key={d} className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3">
                <p className={`text-sm font-medium ${diffColor(d)}`}>{d}</p>
                <p className="text-lg font-bold text-white mt-0.5">
                  {done}
                  <span className="text-gray-500 text-sm font-normal"> / {total}</span>
                </p>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden mt-2">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      d === 'Easy'
                        ? 'bg-green-500'
                        : d === 'Medium'
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Controls */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Search problems..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="!pl-10"
            />
          </div>
          <div className="flex items-center gap-1.5">
            {['all', ...DIFFICULTIES].map((d) => (
              <button
                key={d}
                onClick={() => setDifficultyFilter(d)}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all border ${
                  difficultyFilter === d
                    ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/30'
                    : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
                }`}
              >
                {d === 'all' ? 'All Levels' : d}
              </button>
            ))}
          </div>
          <button
            onClick={() => setHideSolved((v) => !v)}
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all border ${
              hideSolved
                ? 'bg-green-500/15 text-green-400 border-green-500/30'
                : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
            }`}
          >
            {hideSolved ? 'Hide Solved: On' : 'Hide Solved: Off'}
          </button>
        </div>

        {/* Pattern filter pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setPatternFilter('all')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all border ${
              patternFilter === 'all'
                ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/30'
                : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
            }`}
          >
            All Patterns ({stats.total})
          </button>
          {dsaPatterns.map((p) => {
            const count = p.problems.length
            const doneCount = p.problems.filter((pr) => solved[pr.id]).length
            const active = patternFilter === p.id
            return (
              <button
                key={p.id}
                onClick={() => setPatternFilter(p.id)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all border flex items-center gap-2 ${
                  active
                    ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/30'
                    : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full bg-gradient-to-br ${patternMeta[p.id]?.color}`}
                />
                {p.name}
                <span className="text-gray-500 text-xs">
                  {doneCount}/{count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Problem sections */}
      <div className="space-y-6">
        {visiblePatterns.length === 0 && (
          <Card className="text-center py-12">
            <Search className="w-10 h-10 text-gray-600 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-300">No problems match your filters</h3>
            <p className="text-gray-500 mt-1">Try clearing the search or changing the filters</p>
          </Card>
        )}

        {visiblePatterns.map((pattern) => {
          const total = pattern.problems.length
          const done = pattern.problems.filter((p) => solved[p.id]).length
          const isCollapsed = collapsed[pattern.id]
          return (
            <div key={pattern.id} className="animate-fade-in">
              {/* Section header */}
              <button
                onClick={() => toggleCollapse(pattern.id)}
                className="w-full flex items-center justify-between gap-3 mb-3 group"
              >
                <div className="flex items-center gap-3 text-left">
                  <span
                    className={`w-9 h-9 rounded-xl bg-gradient-to-br ${patternMeta[pattern.id]?.color} flex items-center justify-center shadow-lg`}
                  >
                    <Code2 className="w-4 h-4 text-white" />
                  </span>
                  <div>
                    <h2 className="text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors">
                      {pattern.name}
                    </h2>
                    <p className="text-gray-500 text-xs max-w-xl">{pattern.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-400">
                    {done}
                    <span className="text-gray-600">/{total}</span>
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform ${isCollapsed ? '' : 'rotate-180'}`}
                  />
                </div>
              </button>

              {!isCollapsed && (
                <div className="space-y-2">
                  {pattern.problems.map((p, idx) => {
                    const isSolved = !!solved[p.id]
                    return (
                      <Card
                        key={p.id}
                        className={`!p-4 transition-all ${isSolved ? 'opacity-60' : 'hover:bg-white/[0.07]'}`}
                      >
                        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                          {/* Solve toggle */}
                          <button
                            onClick={() => toggleSolved(p.id)}
                            className="shrink-0"
                            title={isSolved ? 'Mark as unsolved' : 'Mark as solved'}
                          >
                            {isSolved ? (
                              <CheckCircle2 className="w-5 h-5 text-green-400 hover:text-green-300" />
                            ) : (
                              <Circle className="w-5 h-5 text-gray-600 hover:text-indigo-400 transition-colors" />
                            )}
                          </button>

                          {/* Index + title */}
                          <span className="text-gray-600 text-xs w-6 text-right shrink-0">
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          <h3
                            className={`font-medium flex-1 min-w-0 truncate ${
                              isSolved ? 'text-gray-500 line-through' : 'text-white'
                            }`}
                          >
                            {p.title}
                          </h3>

                          <Badge variant={difficultyVariant[p.difficulty]}>{p.difficulty}</Badge>

                          {/* Links */}
                          <div className="flex items-center gap-2 shrink-0">
                            <a
                              href={p.leetcode}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500/20 transition-all"
                            >
                              LeetCode
                              <ExternalLink className="w-3 h-3" />
                            </a>
                            <a
                              href={p.gfg}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-all"
                            >
                              GFG
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
