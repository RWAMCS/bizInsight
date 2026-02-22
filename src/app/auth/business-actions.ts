'use server'

import { cookies } from 'next/headers'

export async function setActiveBusinessId(id: string) {
  const cookieStore = await cookies()
  cookieStore.set('active_business_id', id, {
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 1 minggu
  })
}

export async function getActiveBusinessId() {
  const cookieStore = await cookies()
  return cookieStore.get('active_business_id')?.value
}