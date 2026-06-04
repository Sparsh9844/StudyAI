import { createClient } from '@/lib/supabase'

export async function getSubjects(userId) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return { data, error }
}

export async function getSubject(id) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('subjects')
    .select('*, topics(*)')
    .eq('id', id)
    .single()
  return { data, error }
}

export async function createSubject(subject) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('subjects')
    .insert(subject)
    .select()
    .single()
  return { data, error }
}

export async function updateSubject(id, updates) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('subjects')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  return { data, error }
}

export async function deleteSubject(id) {
  const supabase = createClient()
  const { error } = await supabase
    .from('subjects')
    .delete()
    .eq('id', id)
  return { error }
}
