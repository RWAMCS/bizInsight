'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// 1. Definisi Aturan Main (Schema)
const productSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  category: z.string().optional(),
  sku: z.string().optional(),
  purchase_price: z.coerce.number().min(0, "Harga beli tidak boleh negatif"),
  selling_price: z.coerce.number().min(0, "Harga jual tidak boleh negatif"),
  stock_quantity: z.coerce.number().min(0, "Stok tidak boleh negatif"),
  min_stock_level: z.coerce.number().min(0, "Minimal stok tidak boleh negatif"),
  business_id: z.string().uuid()
})

export async function addProductAction(formData: z.infer<typeof productSchema>) {
  try {
    // Validasi ulang di sisi server (Security Layer)
    const validatedData = productSchema.parse(formData)
    
    const supabase = await createClient()
    
    const { error } = await supabase
      .from('products')
      .insert([validatedData])

    if (error) throw new Error(error.message)

    // Update tampilan halaman produk secara instan
    revalidatePath('/products')
    
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || "Gagal menambah produk" }
  }
}
// ... (tambahkan di bawah addProductAction)

export async function updateProductAction(id: string, formData: any) {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('products')
      .update(formData)
      .eq('id', id)

    if (error) throw new Error(error.message)
    revalidatePath('/products')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteProductAction(id: string) {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) throw new Error(error.message)
    revalidatePath('/products')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}