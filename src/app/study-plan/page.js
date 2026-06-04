'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { MultiSelect } from '@/components/ui/MultiSelect'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { CalendarRange, Sparkles, Download, Trash2, AlertCircle, BrainCircuit } from 'lucide-react'
import toast from 'react-hot-toast'
import { formatDate } from '@/utils/helpers'
import { exportToPDF } from '@/utils/pdf'
import { exportToCSV } from '@/utils/export'

export default function StudyPlanPage() {
  const [subjects, setSubjects] = useState([])
  const [selectedSubjectIds, setSelectedSubjectIds] = useState([])
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [days, setDays] = useState(30)
  const [showPlanModal, setShowPlanModal] = useState(false)
  const [currentPlan, setCurrentPlan] = useState(null)
  const [validationError, setValidationError] = useState('')
  const [apiError, setApiError] = useState('')
  const supabase = createClient()

  const load = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data: s } = await supabase.from('subjects').select('id, name, exam_date').eq('user_id', user.id)
    const { data: p } = await supabase.from('study_plans').select('*, study_plan_days(*)').eq('user_id', user.id).order('created_at', { ascending: false })
    setSubjects(s || [])
    setPlans(p || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const generatePlan = async () => {
    setValidationError('')
    setApiError('')

    if (subjects.length === 0) {
      setValidationError('Add subjects first before generating a plan.')
      toast.error('Add subjects first')
      return
    }

    if (selectedSubjectIds.length === 0) {
      setValidationError('Please select at least one subject.')
      toast.error('Select at least one subject')
      return
    }

    if (days < 1) {
      setValidationError('Number of days must be at least 1.')
      return
    }

    if (days > 365) {
      setValidationError('Number of days cannot exceed 365.')
      return
    }

    setGenerating(true)
    try {
      const response = await fetch('/api/ai/study-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subjectIds: selectedSubjectIds, days }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Request failed (${response.status})`)
      }

      if (!data.plan || !Array.isArray(data.plan) || data.plan.length === 0) {
        throw new Error('AI generated an empty plan. Try different subjects or fewer days.')
      }

      // Save the plan
      const { data: { user } } = await supabase.auth.getUser()
      const selectedNames = subjects
        .filter(s => selectedSubjectIds.includes(s.id))
        .map(s => s.name)
        .join(', ')

      const { data: plan, error: planError } = await supabase.from('study_plans').insert({
        user_id: user.id,
        name: `Study Plan - ${selectedNames} (${days} days)`,
        total_days: days,
      }).select().single()

      if (planError) throw new Error('Failed to save plan: ' + planError.message)

      if (plan && data.plan.length) {
        const planDays = data.plan.map((d, i) => ({
          study_plan_id: plan.id,
          day_number: i + 1,
          date: d.date || new Date(Date.now() + i * 86400000).toISOString().split('T')[0],
          subject: d.subject,
          topics: Array.isArray(d.topics_to_cover) ? d.topics_to_cover.join(', ') : d.topics_to_cover || '',
          hours: d.hours || 2,
          focus_area: d.focus_area || '',
        }))

        const { error: daysError } = await supabase.from('study_plan_days').insert(planDays)
        if (daysError) throw new Error('Failed to save plan days: ' + daysError.message)
      }

      toast.success(`Study plan generated for ${selectedNames}!`)
      setSelectedSubjectIds([])
      setDays(30)
      load()
    } catch (err) {
      const msg = err.message || 'An unexpected error occurred'
      setApiError(msg)
      toast.error(msg)
    }
    setGenerating(false)
  }

  const viewPlan = (plan) => {
    setCurrentPlan(plan)
    setShowPlanModal(true)
  }

  const deletePlan = async (id) => {
    if (!confirm('Delete this study plan?')) return
    const { error } = await supabase.from('study_plans').delete().eq('id', id)
    if (error) toast.error('Failed to delete: ' + error.message)
    else { toast.success('Plan deleted'); load() }
  }

  const exportPlan = (plan) => {
    const rows = (plan.study_plan_days || []).map(d => [d.day_number, d.date, d.subject, d.topics, d.hours, d.focus_area])
    exportToPDF(plan.name, ['Day', 'Date', 'Subject', 'Topics', 'Hours', 'Focus Area'], rows, plan.name)
    const csvData = (plan.study_plan_days || []).map(d => ({ Day: d.day_number, Date: d.date, Subject: d.subject, Topics: d.topics, Hours: d.hours, 'Focus Area': d.focus_area }))
    exportToCSV(csvData, plan.name)
    toast.success('Plan exported!')
  }

  const subjectOptions = subjects.map(s => ({
    value: s.id,
    label: s.name,
    description: s.exam_date ? `Exam: ${formatDate(s.exam_date)}` : 'No exam date',
  }))

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Study Plan</h1>
          <p className="text-gray-400 mt-1">AI-generated day-wise study schedules for your subjects</p>
        </div>
      </div>

      {/* Generator Card */}
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-full blur-2xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 shadow-lg">
              <BrainCircuit className="w-full h-full text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Generate AI Study Plan</h2>
              <p className="text-gray-400 text-sm">Select subjects and set the duration to create a personalized study schedule</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <MultiSelect
              label="Select Subjects"
              options={subjectOptions}
              value={selectedSubjectIds}
              onChange={(ids) => { setSelectedSubjectIds(ids); setValidationError(''); setApiError('') }}
              placeholder="Choose subjects for the plan..."
              error={validationError && selectedSubjectIds.length === 0 ? validationError : ''}
            />
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Number of Days</label>
              <Input
                type="number"
                value={days}
                onChange={e => { setDays(Number(e.target.value)); setValidationError(''); setApiError('') }}
                min={1}
                max={365}
                placeholder="e.g. 30"
              />
            </div>
          </div>

          {/* Validation / API error */}
          {validationError && (
            <div className="flex items-start gap-2 p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{validationError}</span>
            </div>
          )}
          {apiError && (
            <div className="flex items-start gap-2 p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium mb-1">Generation failed:</p>
                <p className="text-red-300/80">{apiError}</p>
              </div>
            </div>
          )}

          <Button
            onClick={generatePlan}
            disabled={generating}
            className="w-full md:w-auto"
          >
            <Sparkles className={`w-4 h-4 mr-2 ${generating ? 'animate-spin' : ''}`} />
            {generating ? 'Generating AI Plan...' : `Generate AI Plan${selectedSubjectIds.length > 0 ? ` (${subjects.filter(s => selectedSubjectIds.includes(s.id)).map(s => s.name).join(', ')})` : ''}`}
          </Button>
        </div>
      </Card>

      {/* Generated Plans */}
      {plans.length === 0 ? (
        <Card className="text-center py-12">
          <CalendarRange className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-300">No study plans yet</h3>
          <p className="text-gray-500 mt-1">Select subjects above and generate your first AI-powered study plan</p>
        </Card>
      ) : (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Your Study Plans</h2>
          {plans.map(plan => (
            <Card key={plan.id} className="glass-hover group">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 flex items-center justify-center flex-shrink-0">
                    <CalendarRange className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                    <p className="text-gray-400 text-sm mt-0.5">
                      Created {formatDate(plan.created_at)} &middot; {plan.total_days} days &middot; {(plan.study_plan_days || []).length} sessions
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button variant="secondary" size="sm" onClick={() => viewPlan(plan)}>
                    View
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => exportPlan(plan)}>
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => deletePlan(plan.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* View Plan Modal */}
      <Modal isOpen={showPlanModal} onClose={() => setShowPlanModal(false)} title={currentPlan?.name || 'Study Plan'}>
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {(currentPlan?.study_plan_days || []).map(day => (
            <div key={day.id} className="p-4 rounded-xl bg-white/5 hover:bg-white/[0.07] transition-all">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="info">Day {day.day_number}</Badge>
                <span className="text-xs text-gray-500">{day.date}</span>
              </div>
              <h4 className="text-white font-medium">{day.subject}</h4>
              {day.topics && <p className="text-gray-400 text-sm mt-1">Topics: {day.topics}</p>}
              <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  {day.hours} hour{day.hours > 1 ? 's' : ''}
                </span>
                {day.focus_area && (
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    {day.focus_area}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  )
}
