import { NextResponse } from 'next/server'
import { createBusiness } from '@/services/businessService'

export async function POST(request: Request) {
  try {
    const { name, address } = await request.json()
    const data = await createBusiness(name, address)
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}