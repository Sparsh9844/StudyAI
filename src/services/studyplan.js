import { createClient } from '@/lib/supabase'

export async function getStudyPlans(userId) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('study_plans')
    .select('*, study_plan_days(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return { data, error }
}

export async function createStudyPlan(plan) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('study_plans')
    .insert(plan)
    .select()
    .single()
  return { data, error }
}

export async function saveStudyPlanDays(days) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('study_plan_days')
    .insert(days)
    .select()
  return { data, error }
}

export async function updateStudyPlanDay(id, updates) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('study_plan_days')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  return { data, error }
}

export async function deleteStudyPlan(id) {
  const supabase = createClient()
  const { error } = await supabase
    .from('study_plans')
    .delete()
    .eq('id', id)
  return { error }
}
