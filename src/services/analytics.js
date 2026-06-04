import { createClient } from '@/lib/supabase'

export async function getDashboardStats(userId) {
  const supabase = createClient()
  const { data: subjects } = await supabase
    .from('subjects')
    .select('id, name, exam_date')
    .eq('user_id', userId)

  const { data: topics } = await supabase
    .from('topics')
    .select('*, subject:subjects(name)')
    .eq('user_id', userId)

  const { data: studyPlans } = await supabase
    .from('study_plans')
    .select('*, study_plan_days(*)')
    .eq('user_id', userId)

  const { data: revisions } = await supabase
    .from('topics')
    .select('revision_1, revision_2, revision_3')
    .eq('user_id', userId)

  return { subjects, topics, studyPlans, revisions }
}

export function computeStats(data) {
  const totalSubjects = data.subjects?.length || 0
  const totalTopics = data.topics?.length || 0
  const pending = data.topics?.filter(t => t.status === 'pending').length || 0
  const inProgress = data.topics?.filter(t => t.status === 'in_progress').length || 0
  const completed = data.topics?.filter(t => t.status === 'completed').length || 0

  const r1 = data.revisions?.filter(t => t.revision_1).length || 0
  const r2 = data.revisions?.filter(t => t.revision_2).length || 0
  const r3 = data.revisions?.filter(t => t.revision_3).length || 0

  const subjectProgress = data.subjects?.map(s => {
    const subjTopics = data.topics?.filter(t => t.subject_id === s.id) || []
    const comp = subjTopics.filter(t => t.status === 'completed').length
    const pct = subjTopics.length ? Math.round((comp / subjTopics.length) * 100) : 0
    return { name: s.name, progress: pct, total: subjTopics.length, completed: comp }
  }) || []

  return {
    totalSubjects,
    totalTopics,
    pending,
    inProgress,
    completed,
    r1, r2, r3,
    subjectProgress,
    completionRate: totalTopics ? Math.round((completed / totalTopics) * 100) : 0,
  }
}
