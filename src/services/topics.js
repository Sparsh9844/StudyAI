import { createClient } from '@/lib/supabase'

export async function getTopics(subjectId) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('topics')
    .select('*')
    .eq('subject_id', subjectId)
    .order('created_at', { ascending: true })
  return { data, error }
}

export async function createTopic(topic) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('topics')
    .insert(topic)
    .select()
    .single()
  return { data, error }
}

export async function updateTopic(id, updates) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('topics')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  return { data, error }
}

export async function deleteTopic(id) {
  const supabase = createClient()
  const { error } = await supabase
    .from('topics')
    .delete()
    .eq('id', id)
  return { error }
}
