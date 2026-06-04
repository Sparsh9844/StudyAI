'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { Plus, BookOpen, Calendar, Trash2, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'
import { formatDate, getDaysUntil } from '@/utils/helpers'

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editSubject, setEditSubject] = useState(null)
  const [form, setForm] = useState({ name: '', description: '', exam_date: '' })
  const supabase = createClient()
  const router = useRouter()

  const load = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('subjects').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    setSubjects(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    if (editSubject) {
      const { error } = await supabase.from('subjects').update(form).eq('id', editSubject.id)
      if (error) toast.error(error.message)
      else toast.success('Subject updated')
    } else {
      const { error } = await supabase.from('subjects').insert({ ...form, user_id: user.id })
      if (error) toast.error(error.message)
      else toast.success('Subject added')
    }
    setShowModal(false)
    setEditSubject(null)
    setForm({ name: '', description: '', exam_date: '' })
    load()
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this subject and all its topics?')) return
    const { error } = await supabase.from('subjects').delete().eq('id', id)
    if (error) toast.error(error.message)
    else toast.success('Subject deleted')
    load()
  }

  const openEdit = (subject) => {
    setEditSubject(subject)
    setForm({ name: subject.name, description: subject.description || '', exam_date: subject.exam_date?.split('T')[0] || '' })
    setShowModal(true)
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Subjects</h1>
          <p className="text-gray-400 mt-1">Manage your study subjects and exam dates</p>
        </div>
        <Button onClick={() => { setEditSubject(null); setForm({ name: '', description: '', exam_date: '' }); setShowModal(true) }}>
          <Plus className="w-4 h-4 mr-2" /> Add Subject
        </Button>
      </div>

      {subjects.length === 0 ? (
        <Card className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-300">No subjects yet</h3>
          <p className="text-gray-500 mt-1">Add your first subject to get started</p>
          <Button className="mt-4" onClick={() => setShowModal(true)}>Add Subject</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map(subject => (
            <Card key={subject.id} className="group hover:bg-white/[0.07] transition-all cursor-pointer" onClick={() => router.push(`/subjects/${subject.id}`)}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-indigo-400" />
                </div>
                <button onClick={e => { e.stopPropagation(); openEdit(subject) }} className="text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">{subject.name}</h3>
              {subject.description && <p className="text-gray-400 text-sm mb-3 line-clamp-2">{subject.description}</p>}
              <div className="flex items-center gap-2 text-xs text-gray-500">
                {subject.exam_date && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(subject.exam_date)}</span>
                    <Badge variant={getDaysUntil(subject.exam_date) <= 30 ? 'danger' : 'default'}>
                      {getDaysUntil(subject.exam_date)} days
                    </Badge>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editSubject ? 'Edit Subject' : 'Add Subject'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Subject Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Mathematics" required />
          <Input label="Description (optional)" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Brief description" />
          <Input label="Exam Date (optional)" type="date" value={form.exam_date} onChange={e => setForm({ ...form, exam_date: e.target.value })} />
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit">{editSubject ? 'Update' : 'Add Subject'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
