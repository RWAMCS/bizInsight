import { createClient } from '@/lib/supabase/server'

/* ======================================================
   CREATE TRANSACTION
====================================================== */
export async function createTransaction(payload: {
  business_id: string
  total_amount: number
  total_profit: number
  payment_method: string
  items: any[]
}) {
  const supabase = await createClient()

  if (!payload.business_id) {
    throw new Error('Business ID tidak ditemukan')
  }

  if (!payload.items || payload.items.length === 0) {
    throw new Error('Keranjang kosong')
  }

  // 🔥 INSERT TRANSACTION
  const { data: transaction, error: transError } = await supabase
    .from('transactions')
    .insert([
      {
        business_id: payload.business_id,
        total_amount: payload.total_amount,
        total_profit: payload.total_profit,
        payment_method: payload.payment_method
      }
    ])
    .select()
    .single()

  if (transError) {
    console.error(transError)
    throw new Error('Gagal menyimpan transaksi')
  }

  // 🔥 INSERT ITEMS
  const transactionItems = payload.items.map(item => ({
    transaction_id: transaction.id,
    product_id: item.id,
    quantity: item.quantity,
    unit_price: item.selling_price,
    unit_cost: item.purchase_price,
    subtotal: item.quantity * item.selling_price
  }))

  const { error: itemsError } = await supabase
    .from('transaction_items')
    .insert(transactionItems)

  if (itemsError) {
    console.error(itemsError)
    throw new Error('Gagal menyimpan item transaksi')
  }

  // 🔥 UPDATE STOCK
  for (const item of payload.items) {
    const { error } = await supabase.rpc('decrement_stock', {
      row_id: item.id,
      count: item.quantity
    })

    if (error) {
      console.error(error)
      throw new Error('Gagal update stok')
    }
  }

  return transaction
}

/* ======================================================
   GET TRANSACTIONS (UNTUK RIWAYAT)
====================================================== */
export async function getTransactions(businessId: string) {
  const supabase = await createClient()

  if (!businessId) {
    throw new Error('Business ID tidak ditemukan')
  }

  const { data, error } = await supabase
    .from('transactions')
    .select(`
      *,
      transaction_items (
        *,
        products ( name )
      )
    `)
    .eq('business_id', businessId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error)
    throw new Error('Gagal mengambil data transaksi')
  }

  return data
}
/**
 * Membatalkan transaksi (Void) dan mengembalikan stok barang
 */
export async function voidTransaction(transactionId: string, reason: string) {
  const supabase = await createClient()

  // 1. Ambil detail item transaksi untuk tahu barang apa yang harus dikembalikan stoknya
  const { data: items, error: fetchError } = await supabase
    .from('transaction_items')
    .select('product_id, quantity')
    .eq('transaction_id', transactionId)

  if (fetchError) throw fetchError

  // 2. Update status transaksi menjadi 'void'
  const { error: updateError } = await supabase
    .from('transactions')
    .update({ 
      status: 'void',
      void_reason: reason 
    })
    .eq('id', transactionId)

  if (updateError) throw updateError

  // 3. Kembalikan stok produk (Looping increment)
  for (const item of items) {
    if (item.product_id) {
      await supabase.rpc('increment_stock', { 
        row_id: item.product_id, 
        count: item.quantity 
      })
    }
  }

  return { success: true }
}