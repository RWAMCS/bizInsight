import { NextResponse } from 'next/server'
import { voidTransaction } from '@/services/transactionService'

export async function POST(request: Request) {
  try {
    const { id, reason } = await request.json()
    const result = await voidTransaction(id, reason)
    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}