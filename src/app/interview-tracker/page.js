import { useState, useEffect, useMemo } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import {
  Briefcase, Plus, Trash2, ChevronRight,
  Building2, CalendarDays, StickyNote,
  Trophy, XCircle, Clock, CheckCircle2, Loader,
} from 'lucide-react'
import toast from 'react-hot-toast'

const LS_KEY = 'studyai-interview-tracker'

const STATUSES = [
  { id: 'applied',   label: 'Applied',      color: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/20',   icon: Briefcase   },
  { id: 'oa',        label: 'Online Assessment', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: Clock },
  { id: 'interview', label: 'Interview',    color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: Loader      },
  { id: 'offer',     label: 'Offer',        color: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/20',  icon: CheckCircle2 },
  { id: 'rejected',  label: 'Rejected',     color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/20',    icon: XCircle     },
]

const ROUNDS = ['Applied', 'OA', 'Tech Round 1', 'Tech Round 2', 'HR Round', 'Offer', 'Rejected']

function loadEntries() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]') } catch { return [] }
}
function saveEntries(e) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(e)) } catch {}
}

const EMPTY_FORM = { company: '', role: '', status: 'applied', date: '', round: 'Applied', notes: '', ctc: '', location: '' }

export default function InterviewTrackerPage() {
  const [entries, setEntries]     = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId]       = useState(null)
  const [form, setForm]           = useState(EMPTY_FORM)
  const [filterStatus, setFilterStatus] = useState('all')
  const [search, setSearch]       = useState('')

  useEffect(() => { setEntries(loadEntries()) }, [])

  const persist = (next) => { setEntries(next); saveEntries(next) }

  const openAdd = () => { setForm(EMPTY_FORM); setEditId(null); setShowModal(true) }
  const openEdit = (e) => {
    setForm({ company: e.company, role: e.role, status: e.status, date: e.date, round: e.round, notes: e.notes || '', ctc: e.ctc || '', location: e.location || '' })
    setEditId(e.id)
    setShowModal(true)
  }

  const handleSubmit = (ev) => {
    ev.preventDefault()
    if (!form.company.trim()) { toast.error('Company name required'); return }
    if (editId) {
      persist(entries.map(e => e.id === editId ? { ...e, ...form } : e))
      toast.success('Updated')
    } else {
      persist([{ ...form, id: Date.now().toString(), createdAt: new Date().toISOString() }, ...entries])
      toast.success('Application added!')
    }
    setShowModal(false)
  }

  const del = (id) => {
    if (!confirm('Remove this application?')) return
    persist(entries.filter(e => e.id !== id))
    toast.success('Removed')
  }

  // Stats
  const stats = useMemo(() => {
    const total    = entries.length
    const byStatus = STATUSES.reduce((a, s) => ({ ...a, [s.id]: entries.filter(e => e.status === s.id).length }), {})
    return { total, ...byStatus }
  }, [entries])

  // Filter
  const filtered = useMemo(() =>
    entries.filter(e => {
      if (filterStatus !== 'all' && e.status !== filterStatus) return false
      if (search && !e.company.toLowerCase().includes(search.toLowerCase()) &&
          !e.role.toLowerCase().includes(search.toLowerCase())) return false
      return true
    }),
    [entries, filterStatus, search]
  )

  const getStatus = (id) => STATUSES.find(s => s.id === id) || STATUSES[0]

  return (
    <div className="space-y-6 animate-fade-in pb-12">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </span>
            Interview Tracker
          </h1>
          <p className="text-zinc-500 text-sm mt-1 ml-12">Track every application — from Applied to Offer</p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="w-4 h-4 mr-2" /> Add Application
        </Button>
      </div>

      {/* Stats pipeline */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {STATUSES.map(s => {
          const Icon = s.icon
          const count = stats[s.id] || 0
          return (
            <button
              key={s.id}
              onClick={() => setFilterStatus(filterStatus === s.id ? 'all' : s.id)}
              className={`glass rounded-xl p-4 text-left transition-all border ${
                filterStatus === s.id ? s.border : 'border-transparent hover:border-zinc-700'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center mb-2`}>
                <Icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <p className={`text-2xl font-bold ${s.color}`}>{count}</p>
              <p className="text-zinc-600 text-xs mt-0.5">{s.label}</p>
            </button>
          )
        })}
      </div>

      {/* Search + filter bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[180px]">
          <Building2 className="w-4 h-4 text-zinc-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search company or role..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="!pl-10"
          />
        </div>
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
            filterStatus === 'all' ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/30' : 'bg-zinc-800 text-zinc-500 border-zinc-700 hover:text-white'
          }`}
        >
          All ({stats.total})
        </button>
      </div>

      {/* Empty state */}
      {entries.length === 0 && (
        <Card className="text-center py-16">
          <Briefcase className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-1">No applications yet</h3>
          <p className="text-zinc-500 text-sm mb-5">Start tracking your placement journey</p>
          <Button onClick={openAdd}><Plus className="w-4 h-4 mr-2" /> Add First Application</Button>
        </Card>
      )}

      {/* Cards */}
      {filtered.length === 0 && entries.length > 0 && (
        <p className="text-zinc-500 text-center py-8 text-sm">No applications match your filter.</p>
      )}

      <div className="space-y-3">
        {filtered.map(entry => {
          const s = getStatus(entry.status)
          const Icon = s.icon
          return (
            <div
              key={entry.id}
              className={`glass rounded-xl p-4 border transition-all hover:bg-zinc-800/50 ${s.border}`}
            >
              <div className="flex items-start gap-4">
                {/* Company icon */}
                <div className={`w-11 h-11 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  <Building2 className={`w-5 h-5 ${s.color}`} />
                </div>

                <div className="flex-1 min-w-0">
                  {/* Company + role */}
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <h3 className="text-white font-bold text-base">{entry.company}</h3>
                      <p className="text-zinc-400 text-sm">{entry.role || 'Software Engineer'}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${s.bg} ${s.color} ${s.border}`}>
                        <Icon className="w-3 h-3" /> {s.label}
                      </span>
                    </div>
                  </div>

                  {/* Meta row */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                    {entry.date && (
                      <span className="text-zinc-600 text-xs flex items-center gap-1">
                        <CalendarDays className="w-3 h-3" />
                        {new Date(entry.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    )}
                    {entry.round && (
                      <span className="text-zinc-600 text-xs flex items-center gap-1">
                        <ChevronRight className="w-3 h-3" /> {entry.round}
                      </span>
                    )}
                    {entry.ctc && (
                      <span className="text-emerald-400 text-xs font-semibold">₹ {entry.ctc} LPA</span>
                    )}
                    {entry.location && (
                      <span className="text-zinc-600 text-xs">{entry.location}</span>
                    )}
                  </div>

                  {/* Notes */}
                  {entry.notes && (
                    <div className="mt-2 flex items-start gap-1.5">
                      <StickyNote className="w-3.5 h-3.5 text-zinc-600 flex-shrink-0 mt-0.5" />
                      <p className="text-zinc-500 text-xs leading-relaxed line-clamp-2">{entry.notes}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => openEdit(entry)}
                    className="p-1.5 rounded-lg text-zinc-600 hover:text-white hover:bg-zinc-700 transition-all"
                    title="Edit"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => del(entry.id)}
                    className="p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-900/20 transition-all"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Offer celebration */}
      {(stats.offer || 0) > 0 && (
        <Card className="text-center py-6 border-green-500/20 bg-green-950/10">
          <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
          <p className="text-green-400 font-bold">{stats.offer} Offer{stats.offer > 1 ? 's' : ''} received! 🎉</p>
          <p className="text-zinc-600 text-xs mt-1">Congratulations — your hard work paid off.</p>
        </Card>
      )}

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editId ? 'Edit Application' : 'Add Application'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Input label="Company *" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="e.g. TCS, Infosys" required />
            </div>
            <Input label="Role" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} placeholder="Software Engineer" />
            <Input label="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Bangalore" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-zinc-200 mb-1.5">Status</label>
              <select
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              >
                {STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-zinc-200 mb-1.5">Current Round</label>
              <select
                value={form.round}
                onChange={e => setForm({ ...form, round: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              >
                {ROUNDS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input label="Date Applied" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
            <Input label="CTC (LPA)" type="number" step="0.1" value={form.ctc} onChange={e => setForm({ ...form, ctc: e.target.value })} placeholder="e.g. 12.5" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-200 mb-1.5">Notes</label>
            <textarea
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              placeholder="Interview experience, topics asked, tips..."
              rows={3}
              className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 resize-none"
            />
          </div>

          <div className="flex gap-3 justify-end pt-1">
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit">{editId ? 'Update' : 'Add Application'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
