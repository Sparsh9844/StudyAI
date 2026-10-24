import { useState, useEffect, useMemo } from 'react'
import { Card } from '@/components/ui/Card'
import {
  RotateCcw, ChevronLeft, ChevronRight,
  CheckCircle2, XCircle, Shuffle, Trophy,
  Brain, Layers,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { flashcardDecks, allFlashcards } from '@/data/flashcards'

const LS_KEY = 'studyai-flashcards'

function loadProgress() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}') } catch { return {} }
}
function saveProgress(p) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(p)) } catch {}
}

// ── Flip Card ────────────────────────────────────────────────
function FlipCard({ card, flipped, onFlip }) {
  return (
    <div
      className="relative w-full cursor-pointer select-none"
      style={{ perspective: '1000px', minHeight: '220px' }}
      onClick={onFlip}
    >
      <div
        className="relative w-full h-full transition-transform duration-500"
        style={{ transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)', minHeight: '220px' }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center p-8 glass rounded-2xl border border-zinc-700 backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <span className="text-xs text-zinc-600 uppercase tracking-widest mb-4 font-semibold">Question</span>
          <p className="text-white text-lg font-semibold text-center leading-relaxed">{card.q}</p>
          <p className="text-zinc-600 text-xs mt-6">Click to reveal answer</p>
        </div>
        {/* Back */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center p-8 glass rounded-2xl border border-indigo-500/30 bg-indigo-950/20 backface-hidden"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <span className="text-xs text-indigo-400 uppercase tracking-widest mb-4 font-semibold">Answer</span>
          <p className="text-zinc-200 text-sm text-center leading-relaxed">{card.a}</p>
        </div>
      </div>
    </div>
  )
}

export default function FlashcardsPage() {
  const [activeDeck, setActiveDeck]   = useState(flashcardDecks[0].id)
  const [cardIdx, setCardIdx]         = useState(0)
  const [flipped, setFlipped]         = useState(false)
  const [shuffled, setShuffled]       = useState(false)
  const [progress, setProgress]       = useState({})
  const [deckOrder, setDeckOrder]     = useState({})
  const [mode, setMode]               = useState('browse') // 'browse' | 'quiz'

  useEffect(() => { setProgress(loadProgress()) }, [])

  const deck = flashcardDecks.find(d => d.id === activeDeck)

  // Current card order — either default or shuffled per deck
  const cards = useMemo(() => {
    const base = deck?.cards || []
    const order = deckOrder[activeDeck]
    if (order) return order.map(i => base[i])
    return base
  }, [activeDeck, deck, deckOrder])

  const card = cards[cardIdx]

  const switchDeck = (id) => {
    setActiveDeck(id)
    setCardIdx(0)
    setFlipped(false)
  }

  const mark = (known) => {
    const key = `${activeDeck}:${card.id}`
    const next = { ...progress, [key]: known ? 'known' : 'unknown' }
    setProgress(next)
    saveProgress(next)
    if (known) toast.success('Marked as known ✓', { duration: 800 })
    // auto-advance
    if (cardIdx < cards.length - 1) { setCardIdx(i => i + 1); setFlipped(false) }
  }

  const shuffle = () => {
    const indices = deck.cards.map((_, i) => i)
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]]
    }
    setDeckOrder(d => ({ ...d, [activeDeck]: indices }))
    setCardIdx(0)
    setFlipped(false)
    toast.success('Deck shuffled!', { duration: 800 })
  }

  const reset = () => {
    const keysToDelete = Object.keys(progress).filter(k => k.startsWith(activeDeck + ':'))
    const next = { ...progress }
    keysToDelete.forEach(k => delete next[k])
    setProgress(next)
    saveProgress(next)
    setCardIdx(0)
    setFlipped(false)
    setDeckOrder(d => { const n = { ...d }; delete n[activeDeck]; return n })
    toast.success('Deck reset')
  }

  // Stats
  const deckStats = useMemo(() => {
    return flashcardDecks.map(d => {
      const known   = d.cards.filter(c => progress[`${d.id}:${c.id}`] === 'known').length
      const unknown = d.cards.filter(c => progress[`${d.id}:${c.id}`] === 'unknown').length
      return { id: d.id, total: d.cards.length, known, unknown, unseen: d.cards.length - known - unknown }
    })
  }, [progress])

  const currentStats = deckStats.find(s => s.id === activeDeck)
  const cardKey = `${activeDeck}:${card?.id}`
  const cardStatus = progress[cardKey]

  const prev = () => { if (cardIdx > 0) { setCardIdx(i => i - 1); setFlipped(false) } }
  const next = () => { if (cardIdx < cards.length - 1) { setCardIdx(i => i + 1); setFlipped(false) } }

  // All cards in deck known?
  const deckComplete = currentStats?.known === deck?.cards.length

  return (
    <div className="space-y-6 animate-fade-in pb-12">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </span>
            Flashcards
          </h1>
          <p className="text-zinc-500 text-sm mt-1 ml-12">Quick-fire revision — flip, mark, master</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={shuffle} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white text-xs font-medium border border-zinc-700 transition-all">
            <Shuffle className="w-3.5 h-3.5" /> Shuffle
          </button>
          <button onClick={reset} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white text-xs font-medium border border-zinc-700 transition-all">
            <RotateCcw className="w-3.5 h-3.5" /> Reset Deck
          </button>
        </div>
      </div>

      {/* Deck tabs */}
      <div className="flex gap-1 p-1 bg-zinc-900 rounded-xl border border-zinc-800 w-full overflow-x-auto">
        {flashcardDecks.map(d => {
          const s = deckStats.find(x => x.id === d.id)
          const pct = s ? Math.round((s.known / s.total) * 100) : 0
          return (
            <button
              key={d.id}
              onClick={() => switchDeck(d.id)}
              className={`flex-1 flex flex-col items-center py-2 px-3 rounded-lg text-xs font-semibold transition-all whitespace-nowrap min-w-[90px] ${
                activeDeck === d.id ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <span>{d.name}</span>
              <span className={`text-[10px] mt-0.5 font-normal ${activeDeck === d.id ? 'text-zinc-400' : 'text-zinc-700'}`}>
                {pct}% known
              </span>
            </button>
          )
        })}
      </div>

      {/* Main — card + controls */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-6">

        {/* Card area */}
        <div className="space-y-4">
          {/* Progress bar */}
          <div className="flex items-center gap-3">
            <span className="text-zinc-500 text-xs">{cardIdx + 1} / {cards.length}</span>
            <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                style={{ width: `${((cardIdx + 1) / cards.length) * 100}%` }}
              />
            </div>
            {cardStatus === 'known' && <span className="text-green-400 text-xs font-semibold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Known</span>}
            {cardStatus === 'unknown' && <span className="text-red-400 text-xs font-semibold flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Review</span>}
          </div>

          {deckComplete ? (
            <div className="glass rounded-2xl p-12 text-center border border-green-500/20">
              <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-white mb-1">Deck Complete!</h3>
              <p className="text-zinc-500 text-sm">You know all {deck?.cards.length} cards in {deck?.name}.</p>
              <button onClick={reset} className="mt-4 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all">
                Restart Deck
              </button>
            </div>
          ) : (
            <>
              <FlipCard card={card} flipped={flipped} onFlip={() => setFlipped(v => !v)} />

              {/* Mark buttons — only shown after flip */}
              <div className={`grid grid-cols-2 gap-3 transition-opacity duration-300 ${flipped ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                <button
                  onClick={() => mark(false)}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-red-900/30 hover:bg-red-900/50 text-red-400 font-semibold text-sm border border-red-800/40 transition-all"
                >
                  <XCircle className="w-4 h-4" /> Need Review
                </button>
                <button
                  onClick={() => mark(true)}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-green-900/30 hover:bg-green-900/50 text-green-400 font-semibold text-sm border border-green-800/40 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" /> Got It
                </button>
              </div>

              {/* Nav */}
              <div className="flex items-center justify-between">
                <button
                  onClick={prev}
                  disabled={cardIdx === 0}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium border border-zinc-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>
                <button
                  onClick={() => setFlipped(false)}
                  className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
                >
                  Flip back
                </button>
                <button
                  onClick={next}
                  disabled={cardIdx === cards.length - 1}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium border border-zinc-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Right — deck progress */}
        <div className="space-y-4">
          <Card className="!p-4">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" /> {deck?.name}
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Known',    val: currentStats?.known,   color: 'text-green-400', bar: 'bg-green-500' },
                { label: 'Review',   val: currentStats?.unknown, color: 'text-red-400',   bar: 'bg-red-500'   },
                { label: 'Unseen',   val: currentStats?.unseen,  color: 'text-zinc-400',  bar: 'bg-zinc-600'  },
              ].map(({ label, val, color, bar }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-zinc-500">{label}</span>
                    <span className={`font-semibold ${color}`}>{val}</span>
                  </div>
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div className={`h-full ${bar} rounded-full transition-all`}
                      style={{ width: `${currentStats?.total ? (val / currentStats.total) * 100 : 0}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Mini card list */}
            <div className="mt-5 space-y-1 max-h-64 overflow-y-auto pr-1">
              {cards.map((c, i) => {
                const key = `${activeDeck}:${c.id}`
                const s = progress[key]
                return (
                  <button
                    key={c.id}
                    onClick={() => { setCardIdx(i); setFlipped(false) }}
                    className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-all text-xs ${
                      i === cardIdx ? 'bg-indigo-600/15 text-white border border-indigo-500/20' : 'text-zinc-500 hover:bg-zinc-800/60 hover:text-zinc-300'
                    }`}
                  >
                    <span className={`w-4 h-4 flex-shrink-0 ${s === 'known' ? 'text-green-400' : s === 'unknown' ? 'text-red-400' : 'text-zinc-700'}`}>
                      {s === 'known' ? <CheckCircle2 className="w-4 h-4" /> : s === 'unknown' ? <XCircle className="w-4 h-4" /> : <span className="block w-1.5 h-1.5 rounded-full bg-zinc-700 mx-auto" />}
                    </span>
                    <span className="truncate">{c.q.slice(0, 40)}{c.q.length > 40 ? '…' : ''}</span>
                  </button>
                )
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
