'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { BarChart3, Download } from 'lucide-react'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, PointElement, LineElement,
  ArcElement, Title, Tooltip, Legend, Filler,
} from 'chart.js'
import { Bar, Line, Doughnut } from 'react-chartjs-2'
import toast from 'react-hot-toast'
import { exportToPDF } from '@/utils/pdf'
import { exportToCSV } from '@/utils/export'
import { computeStats } from '@/services/analytics'

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler)

export default function AnalyticsPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: subjects } = await supabase.from('subjects').select('id, name, exam_date').eq('user_id', user.id)
      const { data: topics } = await supabase.from('topics').select('*, subject:subjects(name)').eq('user_id', user.id)

      setStats(computeStats({ subjects, topics, revisions: topics }))
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>
  if (!stats) return null

  const statusChart = {
    labels: ['Pending', 'In Progress', 'Completed'],
    datasets: [{
      label: 'Topics',
      data: [stats.pending, stats.inProgress, stats.completed],
      backgroundColor: ['rgba(234,179,8,0.5)', 'rgba(59,130,246,0.5)', 'rgba(34,197,94,0.5)'],
      borderColor: ['rgb(234,179,8)', 'rgb(59,130,246)', 'rgb(34,197,94)'],
      borderWidth: 2,
    }],
  }

  const revisionChart = {
    labels: ['Revision 1', 'Revision 2', 'Revision 3'],
    datasets: [{
      label: 'Completed',
      data: [stats.r1, stats.r2, stats.r3],
      backgroundColor: ['rgba(59,130,246,0.5)', 'rgba(147,51,234,0.5)', 'rgba(16,185,129,0.5)'],
      borderColor: ['rgb(59,130,246)', 'rgb(147,51,234)', 'rgb(16,185,129)'],
      borderWidth: 2,
      fill: true,
    }],
  }

  const progressChart = {
    labels: stats.subjectProgress.map(s => s.name),
    datasets: [{
      data: stats.subjectProgress.map(s => s.progress),
      backgroundColor: [
        'rgba(99,102,241,0.7)',
        'rgba(139,92,246,0.7)',
        'rgba(59,130,246,0.7)',
        'rgba(16,185,129,0.7)',
        'rgba(234,179,8,0.7)',
        'rgba(239,68,68,0.7)',
      ],
      borderColor: [
        'rgb(99,102,241)', 'rgb(139,92,246)', 'rgb(59,130,246)',
        'rgb(16,185,129)', 'rgb(234,179,8)', 'rgb(239,68,68)',
      ],
      borderWidth: 2,
    }],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#9ca3af' },
      },
    },
    scales: {
      x: { ticks: { color: '#9ca3af' }, grid: { color: 'rgba(255,255,255,0.05)' } },
      y: { ticks: { color: '#9ca3af' }, grid: { color: 'rgba(255,255,255,0.05)' } },
    },
  }

  const doughnutOptions = {
    ...chartOptions,
    scales: undefined,
  }

  const handleExport = () => {
    const csvData = stats.subjectProgress.map(s => ({
      Subject: s.name,
      Progress: `${s.progress}%`,
      Topics: s.total,
      Completed: s.completed,
    }))
    exportToCSV(csvData, 'analytics')
    exportToPDF('Study Analytics', ['Subject', 'Progress', 'Topics', 'Completed'], csvData.map(d => [d.Subject, `${d.Progress}%`, d.Topics, d.Completed]), 'analytics')
    toast.success('Analytics exported!')
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <p className="text-gray-400 mt-1">Track your study performance</p>
        </div>
        <Button onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" /> Export
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <p className="text-gray-400 text-sm">Total Subjects</p>
          <p className="text-3xl font-bold text-white mt-1">{stats.totalSubjects}</p>
        </Card>
        <Card>
          <p className="text-gray-400 text-sm">Total Topics</p>
          <p className="text-3xl font-bold text-white mt-1">{stats.totalTopics}</p>
        </Card>
        <Card>
          <p className="text-gray-400 text-sm">Overall Completion</p>
          <p className="text-3xl font-bold text-white mt-1">{stats.completionRate}%</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Topic Status Distribution</h3>
          <div className="h-64">
            <Bar data={statusChart} options={chartOptions} />
          </div>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Revision Progress</h3>
          <div className="h-64">
            <Line data={revisionChart} options={chartOptions} />
          </div>
        </Card>
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-white mb-4">Subject Progress</h3>
          <div className="h-64 max-w-md mx-auto">
            <Doughnut data={progressChart} options={doughnutOptions} />
          </div>
        </Card>
      </div>
    </div>
  )
}
