import { createClient } from '@/lib/supabase/server'

export async function getOnboardingStatus() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  // 1. Cek Toko
  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('user_id', user.id)
    .limit(1)
    .single()

  if (!business) return { step: 'SETUP_BUSINESS' }

  // 2. Cek Produk
  const { data: product } = await supabase
    .from('products')
    .select('id')
    .eq('business_id', business.id)
    .limit(1)
    .single()

  if (!product) return { step: 'CREATE_PRODUCT', businessId: business.id }

  // 3. Cek Transaksi
  const { data: transaction } = await supabase
    .from('transactions')
    .select('id')
    .eq('business_id', business.id)
    .limit(1)
    .single()

  if (!transaction) return { step: 'FIRST_TRANSACTION', businessId: business.id }

  return { step: 'COMPLETED' }
}