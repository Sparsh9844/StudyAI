'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { RefreshCw, CheckCircle2, Circle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function RevisionPage() {
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const supabase = createClient()

  const load = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('topics')
      .select('*, subject:subjects(name)')
      .eq('user_id', user.id)
      .order('subject_id')
    setTopics(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const toggleRevision = async (topicId, revision) => {
    const topic = topics.find(t => t.id === topicId)
    const { error } = await supabase
      .from('topics')
      .update({ [revision]: !topic[revision] })
      .eq('id', topicId)
    if (error) toast.error(error.message)
    else {
      toast.success(`Revision ${revision.replace('revision_', '')} updated`)
      load()
    }
  }

  const filtered = filter === 'all' ? topics : topics.filter(t => !t[`revision_${filter}`])

  const stats = {
    r1: topics.filter(t => t.revision_1).length,
    r2: topics.filter(t => t.revision_2).length,
    r3: topics.filter(t => t.revision_3).length,
    total: topics.length,
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white">Revision Tracker</h1>
        <p className="text-gray-400 mt-1">Track your revision progress across all topics</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Revision 1', value: stats.r1, color: 'from-blue-500 to-cyan-500' },
          { label: 'Revision 2', value: stats.r2, color: 'from-purple-500 to-pink-500' },
          { label: 'Revision 3', value: stats.r3, color: 'from-green-500 to-emerald-500' },
        ].map(({ label, value, color }) => (
          <Card key={label} className="text-center">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mx-auto mb-2`}>
              <RefreshCw className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-white">{value}/{stats.total}</p>
            <p className="text-gray-400 text-sm">{label}</p>
          </Card>
        ))}
      </div>

      <div className="flex items-center gap-2">
        {['all', '1', '2', '3'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              filter === f
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                : 'bg-white/5 text-gray-400 border border-white/10 hover:text-white'
            }`}
          >
            {f === 'all' ? 'All Topics' : `Pending R${f}`}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map(topic => (
          <Card key={topic.id} className="hover:bg-white/[0.07] transition-all">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">{topic.name}</h3>
                <p className="text-gray-400 text-xs">{topic.subject?.name}</p>
              </div>
              <div className="flex items-center gap-2">
                {[1, 2, 3].map(rev => (
                  <button
                    key={rev}
                    onClick={() => toggleRevision(topic.id, `revision_${rev}`)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                      topic[`revision_${rev}`]
                        ? 'bg-green-500/10 text-green-400 border-green-500/30'
                        : 'bg-white/5 text-gray-500 border-white/10 hover:text-gray-300'
                    }`}
                  >
                    {topic[`revision_${rev}`] ? <CheckCircle2 className="w-3 h-3" /> : <Circle className="w-3 h-3" />}
                    R{rev}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="text-gray-400 text-center py-8">No topics match this filter.</p>
        )}
      </div>
    </div>
  )
}
