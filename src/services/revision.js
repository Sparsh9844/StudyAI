import { createClient } from '@/lib/supabase'

export async function getRevisions(userId) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('revisions')
    .select('*, revision_items(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return { data, error }
}

export async function createRevision(revision) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('revisions')
    .insert(revision)
    .select()
    .single()
  return { data, error }
}

export async function updateRevisionItem(id, updates) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('revision_items')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  return { data, error }
}

export async function getRevisionProgress(userId) {
  const supabase = createClient()
  const { data: topics, error } = await supabase
    .from('topics')
    .select('id, name, revision_1, revision_2, revision_3, subject:subjects(name)')
    .eq('user_id', userId)
  return { data: topics, error }
}
