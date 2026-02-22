import { NextResponse } from 'next/server'
import { updateBusiness } from '@/services/businessService'

export async function POST(request: Request) {
  try {
    const { id, name, address } = await request.json()
    const data = await updateBusiness(id, name, address)
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}