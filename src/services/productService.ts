import { createClient } from '@/lib/supabase/server'

/**
 * Mengambil semua produk berdasarkan ID Bisnis
 */
export async function getProducts(businessId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('business_id', businessId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

/**
 * Membuat satu produk baru
 */
export async function createProduct(payload: any) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .insert([payload])
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Mengupdate data produk yang sudah ada
 */
export async function updateProduct(id: string, payload: any) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Menghapus produk dari database
 */
export async function deleteProduct(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (error) throw error
}

/**
 * Membuat banyak produk sekaligus (digunakan untuk fitur Import Excel)
 */
export async function bulkCreateProducts(products: any[]) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .insert(products)
    .select()

  if (error) throw error
  return data
}