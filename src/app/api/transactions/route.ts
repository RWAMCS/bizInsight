import { NextResponse } from 'next/server'
import { createTransaction } from '@/services/transactionService'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const {
      business_id,
      total_amount,
      total_profit,
      payment_method,
      items
    } = body

    if (!business_id || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Data transaksi tidak lengkap' },
        { status: 400 }
      )
    }

    const data = await createTransaction({
      business_id,
      total_amount,
      total_profit,
      payment_method,
      items
    })

    return NextResponse.json(data)
  } catch (error: any) {
    console.error(error)
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}