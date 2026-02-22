import { createClient } from '@/lib/supabase/server'

export async function getProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Jika belum ada profil (user baru), kita buatkan barisnya
  if (error && error.code === 'PGRST116') {
    const { data: newProfile } = await supabase
      .from('profiles')
      .insert([{ id: user.id, full_name: user.email?.split('@')[0] }])
      .select()
      .single()
    return newProfile
  }

  return data
}

export async function updateProfile(fullName: string, avatarUrl: string | null) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: fullName,
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (error) throw error
  return { success: true }
}