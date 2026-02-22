'use client'

import { createClient } from '@/lib/supabase/client'

/**
 * Mendaftarkan pengguna baru menggunakan email dan password.
 */
export async function signUp(email: string, password: string) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  })

  if (error) throw error
  return data
}

/**
 * Masuk menggunakan email dan password yang sudah terdaftar.
 */
export async function signIn(email: string, password: string) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

/**
 * Masuk menggunakan akun Google (OAuth).
 */
export async function signInWithGoogle() {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })

  if (error) throw error
  return data
}

/**
 * Keluar dari sesi saat ini dan mengarahkan pengguna ke halaman login.
 */
export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
  window.location.href = '/login'
}