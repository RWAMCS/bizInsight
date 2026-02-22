import { createClient } from '@/lib/supabase/server'

export async function getBusinesses() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function createBusiness(name: string, address: string) {
  const supabase = await createClient()
  
  // Ambil user ID saat ini
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User tidak ditemukan')

  const { data, error } = await supabase
    .from('businesses')
    .insert([{ name, address, user_id: user.id }])
    .select()
    .single()

  if (error) throw error
  return data
}
export async function updateBusiness(id: string, name: string, address: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('businesses')
    .update({ name, address })
    .eq('id', id)
    .select()

  if (error) throw error
  return data
}