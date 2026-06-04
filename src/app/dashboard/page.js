'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import {
  BookOpen, CheckCircle2, Clock, TrendingUp, Target, Sparkles, ArrowRight,
  Calendar, BrainCircuit, FileText, Download, GraduationCap, Zap,
} from 'lucide-react'
import Link from 'next/link'

function ProgressRing({ progress, size = 100, strokeWidth = 6, color = '#6366f1' }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="ring-progress">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.5s ease-in-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-white">{progress}%</span>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon: Icon, color, href, delay, suffix, trend }) {
  return (
    <Link href={href}>
      <div className={`glass rounded-2xl p-5 cursor-pointer group relative overflow-hidden animate-fade-in-up delay-${delay}`}>
        {/* Hover glow */}
        <div className={`absolute -inset-20 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-[0.03] blur-3xl transition-opacity duration-500`} />
        
        <div className="flex items-start justify-between relative z-10">
          <div className="space-y-2">
            <p className="text-gray-500 text-sm font-medium">{label}</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold text-white tracking-tight">{value}</span>
              {suffix && <span className="text-gray-400 text-sm font-medium">{suffix}</span>}
            </div>
            {trend && (
              <div className="flex items-center gap-1 text-xs text-emerald-400">
                <TrendingUp className="w-3 h-3" />
                {trend}
              </div>
            )}
          </div>
          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} p-2.5 shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
            <Icon className="w-full h-full text-white" />
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [subjects, setSubjects] = useState([])
  const [topics, setTopics] = useState([])
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }
      setUser(user)

      const { data: subjects } = await supabase.from('subjects').select('*').eq('user_id', user.id)
      const { data: topics } = await supabase.from('topics').select('*, subject:subjects(name)').eq('user_id', user.id)

      setSubjects(subjects || [])
      setTopics(topics || [])

      const total = topics?.length || 0
      const completed = topics?.filter(t => t.status === 'completed').length || 0
      const inProgress = topics?.filter(t => t.status === 'in_progress').length || 0
      const pending = topics?.filter(t => t.status === 'pending').length || 0

      setStats({
        totalSubjects: subjects?.length || 0,
        totalTopics: total,
        completed,
        inProgress,
        pending,
        completionRate: total ? Math.round((completed / total) * 100) : 0,
        upcomingExams: subjects?.filter(s => s.exam_date && new Date(s.exam_date) > new Date()).length || 0,
        r1: topics?.filter(t => t.revision_1).length || 0,
        r2: topics?.filter(t => t.revision_2).length || 0,
        r3: topics?.filter(t => t.revision_3).length || 0,
      })
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="shimmer h-48 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="shimmer h-28 rounded-2xl" />)}
        </div>
      </div>
    )
  }

  const statCards = [
    { label: 'Subjects', value: stats?.totalSubjects, icon: BookOpen, color: 'from-blue-500 to-cyan-500', href: '/subjects', delay: 100 },
    { label: 'Completed', value: stats?.completed, icon: CheckCircle2, color: 'from-emerald-500 to-green-500', href: '/subjects', delay: 200, suffix: `/ ${stats?.totalTopics}`, trend: stats?.totalTopics ? `${Math.round((stats.completed / stats.totalTopics) * 100)}% rate` : null },
    { label: 'In Progress', value: stats?.inProgress, icon: Clock, color: 'from-amber-500 to-orange-500', href: '/study-plan', delay: 300 },
    { label: 'Upcoming Exams', value: stats?.upcomingExams, icon: Target, color: 'from-purple-500 to-pink-500', href: '/subjects', delay: 400 },
  ]

  const subjectProgress = subjects.map(s => {
    const t = topics.filter(t => t.subject_id === s.id)
    const completed = t.filter(t => t.status === 'completed').length
    const pct = t.length ? Math.round((completed / t.length) * 100) : 0
    return { ...s, topicCount: t.length, completedCount: completed, progress: pct }
  }).sort((a, b) => b.progress - a.progress)

  const quickActions = [
    { label: 'Add Subject', desc: 'Create a new study subject', icon: BookOpen, href: '/subjects', color: 'from-blue-500 to-cyan-500' },
    { label: 'Generate Plan', desc: 'AI-powered study schedule', icon: BrainCircuit, href: '/study-plan', color: 'from-violet-500 to-purple-500' },
    { label: 'AI Assistant', desc: 'Chat, notes & doubt solving', icon: Sparkles, href: '/assistant', color: 'from-amber-500 to-pink-500' },
    { label: 'View Analytics', desc: 'Track your performance', icon: TrendingUp, href: '/analytics', color: 'from-emerald-500 to-teal-500' },
  ]

  const recentTopics = [...topics].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5)

  const name = user?.user_metadata?.full_name || 'there'

  return (
    <div className="space-y-8 pb-12">

      {/* ── Hero Header ── */}
      <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-pink-900/20 border border-white/[0.06] animate-scale-in">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium">
                StudyAI Dashboard
              </div>
              {stats?.completionRate >= 80 && (
                <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium flex items-center gap-1">
                  <Zap className="w-3 h-3" /> On Fire!
                </div>
              )}
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Welcome back, <span className="gradient-text">{name.split(' ')[0]}</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-xl">
              You&apos;ve completed <span className="text-white font-semibold">{stats?.completed}</span> of <span className="text-white font-semibold">{stats?.totalTopics}</span> topics across <span className="text-white font-semibold">{stats?.totalSubjects}</span> subjects.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <ProgressRing progress={stats?.completionRate || 0} size={110} strokeWidth={7} color="#818cf8" />
            <span className="text-gray-500 text-xs mt-2 font-medium">Overall Progress</span>
          </div>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(card => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Subject Progress ── */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Subject Progress</h2>
            <Link href="/subjects" className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {subjectProgress.length === 0 ? (
            <Card className="text-center py-12">
              <GraduationCap className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-300">No subjects yet</h3>
              <p className="text-gray-500 text-sm mt-1">Add your first subject to start tracking progress</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {subjectProgress.slice(0, 5).map((subject, idx) => (
                <Link key={subject.id} href={`/subjects/${subject.id}`}>
                  <div className={`glass rounded-2xl p-4 glass-hover animate-fade-in-up delay-${(idx + 1) * 100}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-600/20 flex items-center justify-center">
                          <BookOpen className="w-4 h-4 text-indigo-400" />
                        </div>
                        <div>
                          <h3 className="text-white font-medium text-sm">{subject.name}</h3>
                          <p className="text-gray-500 text-xs">{subject.completedCount}/{subject.topicCount} topics</p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-white">{subject.progress}%</span>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000"
                        style={{ width: `${subject.progress}%` }}
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* ── Right Column ── */}
        <div className="space-y-6">

          {/* Quick Actions */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map(({ label, desc, icon: Icon, href, color }, idx) => (
                <Link key={label} href={href}>
                  <div className={`glass rounded-2xl p-4 glass-hover h-full animate-fade-in-up delay-${(idx + 1) * 100}`}>
                    <div className="space-y-3">
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} p-2`}>
                        <Icon className="w-full h-full text-white" />
                      </div>
                      <div>
                        <h3 className="text-white text-sm font-medium">{label}</h3>
                        <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Revision Overview */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-white">Revision Progress</h2>
              <Link href="/revision">
                <ArrowRight className="w-4 h-4 text-gray-500 hover:text-white transition-colors cursor-pointer" />
              </Link>
            </div>
            {[1, 2, 3].map(rev => {
              const completed = rev === 1 ? stats?.r1 : rev === 2 ? stats?.r2 : stats?.r3
              const total = stats?.totalTopics || 1
              const pct = Math.round((completed / total) * 100)
              const colors = ['from-blue-500 to-cyan-500', 'from-purple-500 to-pink-500', 'from-emerald-500 to-teal-500']
              return (
                <div key={rev} className="mb-3 last:mb-0">
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="text-gray-400">Revision {rev}</span>
                    <span className="text-gray-300 font-medium">{completed}/{stats?.totalTopics}</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${colors[rev - 1]} transition-all duration-1000`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </Card>

          {/* AI Tip */}
          <Card className="relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-amber-500/10 to-pink-500/10 rounded-full blur-xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="text-white text-sm font-semibold">AI Study Tip</h3>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed">
                Try the Pomodoro technique: 25 min focused study, 5 min break. Your brain retains more with short, intense sessions.
              </p>
              <Link href="/assistant" className="mt-3 inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                Ask AI for more tips <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* ── Recent Activity ── */}
      {recentTopics.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Recent Topics</h2>
          <Card>
            <div className="divide-y divide-white/[0.04]">
              {recentTopics.map((topic, idx) => (
                <div key={topic.id} className={`flex items-center justify-between py-3 first:pt-0 last:pb-0 animate-fade-in-up delay-${(idx + 1) * 100}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      topic.status === 'completed' ? 'bg-emerald-400' :
                      topic.status === 'in_progress' ? 'bg-amber-400' : 'bg-gray-500'
                    }`} />
                    <div>
                      <p className="text-white text-sm font-medium">{topic.name}</p>
                      <p className="text-gray-500 text-xs">{topic.subject?.name}</p>
                    </div>
                  </div>
                  <Badge variant={
                    topic.status === 'completed' ? 'success' :
                    topic.status === 'in_progress' ? 'warning' : 'default'
                  }>
                    {topic.status === 'in_progress' ? 'In Progress' : topic.status.charAt(0).toUpperCase() + topic.status.slice(1)}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
