import { NextResponse } from 'next/server'
import { bulkCreateProducts } from '@/services/productService'

export async function POST(request: Request) {
  try {
    const { products } = await request.json()
    const data = await bulkCreateProducts(products)
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}