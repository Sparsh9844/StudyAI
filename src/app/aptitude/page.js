import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import {
  Brain, Search, RotateCcw, CheckCircle2, XCircle,
  Circle, ChevronDown, ChevronUp, Lightbulb,
  Trophy, Target, BookOpen, Zap, BarChart3,
  Calculator, Grid3x3,
} from 'lucide-react'
import toast from 'react-hot-toast'
import {
  aptitudeSections,
  allAptitudeQuestions,
  sectionMeta,
} from '@/data/aptitudeKit'

const STORAGE_KEY = 'aptitude-kit-state'

// Icon map — data file stores icon names as strings
const ICON_MAP = {
  calculator: Calculator,
  brain: Brain,
  'book-open': BookOpen,
  'bar-chart': BarChart3,
  grid: Grid3x3,
  zap: Zap,
}

function SectionIcon({ name, className }) {
  const Icon = ICON_MAP[name] || Brain
  return <Icon className={className} />
}

// ── Loads / saves answered state from localStorage ────────────
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : { answers: {}, revealed: {} }
  } catch {
    return { answers: {}, revealed: {} }
  }
}
function saveState(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch { /* ignore */ }
}

// ── Single question card ──────────────────────────────────────
function QuestionCard({ question, sectionId, idx, answered, revealed, onAnswer, onReveal }) {
  const meta = sectionMeta[sectionId]
  const isCorrect = answered === question.ans
  const isAnswered = answered !== undefined
  const isRevealed = revealed === true

  return (
    <Card className={`!p-5 transition-all ${isAnswered && isCorrect ? 'border-green-500/20' : isAnswered ? 'border-red-500/20' : ''}`}>
      {/* Question header */}
      <div className="flex items-start gap-3 mb-4">
        <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${meta.bg} ${meta.text} border ${meta.border}`}>
          {String(idx + 1).padStart(2, '0')}
        </span>
        <p className="text-white text-sm leading-relaxed font-medium">{question.q}</p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
        {question.opts.map((opt, i) => {
          let style = 'bg-white/[0.03] border-white/10 text-gray-300 hover:bg-white/[0.07] hover:border-white/20 cursor-pointer'
          if (isAnswered) {
            if (i === question.ans) {
              style = 'bg-green-500/10 border-green-500/30 text-green-300 cursor-default'
            } else if (i === answered && answered !== question.ans) {
              style = 'bg-red-500/10 border-red-500/30 text-red-300 cursor-default'
            } else {
              style = 'bg-white/[0.02] border-white/5 text-gray-600 cursor-default opacity-60'
            }
          }

          return (
            <button
              key={i}
              disabled={isAnswered}
              onClick={() => !isAnswered && onAnswer(question.id, i)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border text-sm text-left transition-all ${style}`}
            >
              <span className={`w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center text-xs font-bold
                ${isAnswered && i === question.ans ? 'border-green-500 bg-green-500/20 text-green-400'
                  : isAnswered && i === answered && answered !== question.ans ? 'border-red-500 bg-red-500/20 text-red-400'
                  : 'border-white/20 text-gray-500'}`}>
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
              {isAnswered && i === question.ans && (
                <CheckCircle2 className="w-4 h-4 text-green-400 ml-auto flex-shrink-0" />
              )}
              {isAnswered && i === answered && answered !== question.ans && (
                <XCircle className="w-4 h-4 text-red-400 ml-auto flex-shrink-0" />
              )}
            </button>
          )
        })}
      </div>

      {/* Result + explanation */}
      {isAnswered && (
        <div className={`mt-3 px-4 py-3 rounded-xl border text-sm ${isCorrect ? 'bg-green-500/5 border-green-500/15' : 'bg-red-500/5 border-red-500/15'}`}>
          <div className="flex items-center gap-2 font-semibold mb-2">
            {isCorrect
              ? <><CheckCircle2 className="w-4 h-4 text-green-400" /><span className="text-green-400">Correct!</span></>
              : <><XCircle className="w-4 h-4 text-red-400" /><span className="text-red-400">Incorrect — correct answer: {question.opts[question.ans]}</span></>
            }
          </div>
          <div className="flex items-start gap-2 mt-1 pt-2 border-t border-white/[0.06]">
            <Lightbulb className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-gray-300 text-xs leading-relaxed">{question.explanation}</p>
          </div>
        </div>
      )}

      {/* Reveal explanation before answering */}
      {!isAnswered && (
        <button
          onClick={() => onReveal(question.id)}
          className="mt-2 flex items-center gap-1.5 text-xs text-gray-600 hover:text-indigo-400 transition-colors"
        >
          <Lightbulb className="w-3.5 h-3.5" />
          {isRevealed ? 'Hide hint' : 'Show hint'}
        </button>
      )}
      {!isAnswered && isRevealed && (
        <p className="mt-2 text-xs text-indigo-300/70 italic pl-5">{question.explanation}</p>
      )}
    </Card>
  )
}

// ── Main page ─────────────────────────────────────────────────
export default function AptitudePage() {
  const [state, setState] = useState({ answers: {}, revealed: {} })
  const [activeSection, setActiveSection] = useState('all')
  const [search, setSearch] = useState('')
  const [collapsed, setCollapsed] = useState({})
  const [hideCorrect, setHideCorrect] = useState(false)
  const [initialized, setInitialized] = useState(false)
  const [searchParams] = useSearchParams()

  // Auto-select section from URL param e.g. /aptitude?section=logical
  useEffect(() => {
    const s = searchParams.get('section')
    if (s) setActiveSection(s)
  }, [searchParams])

  useEffect(() => {
    setState(loadState())
    setInitialized(true)
  }, [])

  const setAnswer = (id, optIdx) => {
    const next = { ...state, answers: { ...state.answers, [id]: optIdx } }
    setState(next)
    saveState(next)
    const q = allAptitudeQuestions.find(q => q.id === id)
    if (q) {
      if (optIdx === q.ans) toast.success('Correct!', { duration: 1200, icon: '✓' })
      else toast.error('Wrong answer', { duration: 1200 })
    }
  }

  const setRevealed = (id) => {
    const next = { ...state, revealed: { ...state.revealed, [id]: !state.revealed[id] } }
    setState(next)
    saveState(next)
  }

  const resetAll = () => {
    if (!confirm('Reset all aptitude progress?')) return
    const empty = { answers: {}, revealed: {} }
    setState(empty)
    saveState(empty)
    toast.success('Progress reset')
  }

  // ── Stats ──
  const stats = useMemo(() => {
    const total = allAptitudeQuestions.length
    const attempted = Object.keys(state.answers).length
    const correct = allAptitudeQuestions.filter(q => state.answers[q.id] === q.ans).length
    const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0
    const bySection = aptitudeSections.reduce((acc, s) => {
      const qs = s.questions
      acc[s.id] = {
        total: qs.length,
        attempted: qs.filter(q => state.answers[q.id] !== undefined).length,
        correct: qs.filter(q => state.answers[q.id] === q.ans).length,
      }
      return acc
    }, {})
    return { total, attempted, correct, accuracy, bySection }
  }, [state.answers])

  // ── Filtered view ──
  const visibleSections = useMemo(() => {
    return aptitudeSections
      .filter(s => activeSection === 'all' || s.id === activeSection)
      .map(s => ({
        ...s,
        questions: s.questions.filter(q => {
          if (hideCorrect && state.answers[q.id] === q.ans) return false
          if (search && !q.q.toLowerCase().includes(search.toLowerCase())) return false
          return true
        }),
      }))
      .filter(s => s.questions.length > 0)
  }, [activeSection, search, hideCorrect, state.answers])

  const toggleCollapse = id => setCollapsed(c => ({ ...c, [id]: !c[id] }))

  if (!initialized) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const overallPct = stats.total ? Math.round((stats.attempted / stats.total) * 100) : 0

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Brain className="w-5 h-5 text-white" />
            </span>
            Aptitude Kit
          </h1>
          <p className="text-gray-400 mt-1 ml-[52px]">
            Service-based company interview prep — TCS · Infosys · Wipro · Cognizant · Accenture
          </p>
        </div>
        <button
          onClick={resetAll}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white/5 text-gray-400 border border-white/10 hover:text-white hover:bg-white/10 transition-all"
        >
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
      </div>

      {/* ── Stats bar ── */}
      <Card className="!p-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {[
            { label: 'Total Questions', value: stats.total, icon: Target, color: 'text-gray-300' },
            { label: 'Attempted',        value: stats.attempted, icon: Circle, color: 'text-indigo-400' },
            { label: 'Correct',          value: stats.correct, icon: CheckCircle2, color: 'text-green-400' },
            { label: 'Accuracy',         value: `${stats.accuracy}%`, icon: Trophy, color: 'text-yellow-400' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="flex items-center gap-3">
              <Icon className={`w-5 h-5 ${color} flex-shrink-0`} />
              <div>
                <p className={`text-xl font-bold ${color}`}>{value}</p>
                <p className="text-gray-500 text-xs">{label}</p>
              </div>
            </div>
          ))}
        </div>
        {/* Overall progress bar */}
        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-700"
            style={{ width: `${overallPct}%` }}
          />
        </div>
        <p className="text-xs text-gray-600 mt-1.5">{overallPct}% attempted</p>
      </Card>

      {/* ── Section progress mini-cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {aptitudeSections.map(s => {
          const ss = stats.bySection[s.id]
          const pct = ss.total ? Math.round((ss.correct / ss.total) * 100) : 0
          const meta = sectionMeta[s.id]
          return (
            <button
              key={s.id}
              onClick={() => setActiveSection(activeSection === s.id ? 'all' : s.id)}
              className={`glass rounded-2xl p-3 text-left transition-all hover:bg-white/[0.06] ${activeSection === s.id ? `border ${meta.border}` : ''}`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${meta.bg}`}>
                <SectionIcon name={s.icon} className={`w-4 h-4 ${meta.text}`} />
              </div>
              <p className="text-white text-xs font-medium leading-snug line-clamp-2">{s.name}</p>
              <p className={`text-xs mt-1 font-semibold ${meta.text}`}>{ss.correct}/{ss.total}</p>
              <div className="h-1 rounded-full bg-white/5 overflow-hidden mt-1.5">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${s.color} transition-all duration-500`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </button>
          )
        })}
      </div>

      {/* ── Controls ── */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search questions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="!pl-10"
          />
        </div>
        <button
          onClick={() => setHideCorrect(v => !v)}
          className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
            hideCorrect
              ? 'bg-green-500/10 text-green-400 border-green-500/20'
              : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
          }`}
        >
          {hideCorrect ? 'Hiding Correct' : 'Hide Correct'}
        </button>
        <button
          onClick={() => setActiveSection('all')}
          className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
            activeSection === 'all'
              ? 'bg-violet-600/20 text-violet-400 border-violet-500/30'
              : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
          }`}
        >
          All Sections
        </button>
      </div>

      {/* ── Questions ── */}
      <div className="space-y-8">
        {visibleSections.length === 0 && (
          <Card className="text-center py-12">
            <Search className="w-10 h-10 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-300 font-medium">No questions match your filter</p>
            <p className="text-gray-600 text-sm mt-1">Try clearing search or turning off "Hide Correct"</p>
          </Card>
        )}

        {visibleSections.map(section => {
          const ss = stats.bySection[section.id]
          const meta = sectionMeta[section.id]
          const isCollapsed = collapsed[section.id]
          const sectionCorrect = section.questions.filter(q => state.answers[q.id] === q.ans).length

          return (
            <div key={section.id} className="animate-fade-in">
              {/* Section header */}
              <button
                onClick={() => toggleCollapse(section.id)}
                className="w-full flex items-center justify-between gap-3 mb-4 group"
              >
                <div className="flex items-center gap-3 text-left">
                  <span className={`w-10 h-10 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                    <SectionIcon name={section.icon} className="w-5 h-5 text-white" />
                  </span>
                  <div>
                    <h2 className="text-lg font-semibold text-white group-hover:text-violet-300 transition-colors">
                      {section.name}
                    </h2>
                    <p className="text-gray-500 text-xs max-w-xl">{section.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right hidden sm:block">
                    <p className={`text-sm font-semibold ${meta.text}`}>{ss.correct}/{ss.total}</p>
                    <p className="text-gray-600 text-xs">{ss.attempted} attempted</p>
                  </div>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${meta.bg}`}>
                    {isCollapsed
                      ? <ChevronDown className={`w-4 h-4 ${meta.text}`} />
                      : <ChevronUp className={`w-4 h-4 ${meta.text}`} />
                    }
                  </div>
                </div>
              </button>

              {!isCollapsed && (
                <div className="space-y-3">
                  {/* Section score if any answered */}
                  {ss.attempted > 0 && (
                    <div className={`flex items-center gap-3 px-4 py-2 rounded-xl ${meta.bg} border ${meta.border}`}>
                      <div className="h-1.5 flex-1 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${section.color} transition-all`}
                          style={{ width: `${ss.total ? Math.round((ss.correct / ss.total) * 100) : 0}%` }}
                        />
                      </div>
                      <span className={`text-xs font-semibold ${meta.text} flex-shrink-0`}>
                        {ss.correct}/{ss.total} correct
                      </span>
                    </div>
                  )}

                  {section.questions.map((q, idx) => (
                    <QuestionCard
                      key={q.id}
                      question={q}
                      sectionId={section.id}
                      idx={aptitudeSections.find(s => s.id === section.id)?.questions.indexOf(q) ?? idx}
                      answered={state.answers[q.id]}
                      revealed={state.revealed[q.id]}
                      onAnswer={setAnswer}
                      onReveal={setRevealed}
                    />
                  ))}

                  {/* Section complete badge */}
                  {ss.attempted === ss.total && ss.total > 0 && (
                    <div className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-green-500/5 to-teal-500/5 border border-green-500/15">
                      <Trophy className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-green-400 font-medium">
                        Section complete — {ss.correct}/{ss.total} correct
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
