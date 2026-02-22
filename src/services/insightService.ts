import { createClient } from '@/lib/supabase/server'

export interface TopProduct {
  name: string
  qty: number
  revenue: number
  percentage: number
}

export interface BusinessInsightData {
  kpi: {
    salesToday: number
    growth: number
    totalTrx: number
  }
  topProducts: TopProduct[]
  recommendations: string[]
}

export async function getBusinessInsights(businessId: string): Promise<BusinessInsightData> {
  const supabase = await createClient()

  const today = new Date().toISOString().split('T')[0]
  const yesterdayDate = new Date()
  yesterdayDate.setDate(yesterdayDate.getDate() - 1)
  const yesterday = yesterdayDate.toISOString().split('T')[0]

  // 1. Ambil Transaksi (Hanya Completed)
  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .eq('business_id', businessId)
    .eq('status', 'completed')

  const salesToday = transactions?.filter(t => t.created_at.startsWith(today))
    .reduce((sum, t) => sum + Number(t.total_amount), 0) || 0
  const salesYesterday = transactions?.filter(t => t.created_at.startsWith(yesterday))
    .reduce((sum, t) => sum + Number(t.total_amount), 0) || 0

  const growth = salesYesterday === 0 ? 100 : ((salesToday - salesYesterday) / salesYesterday) * 100

  // 2. PERBAIKAN UTAMA: Ambil item dengan join langsung ke tabel transactions
  // Kita pastikan mengambil item yang transaksinya milik bisnis ini dan berstatus 'completed'
  const { data: items, error: itemsError } = await supabase
    .from('transaction_items')
    .select(`
      quantity,
      subtotal,
      products (name),
      transactions!inner ( business_id, status )
    `)
    .eq('transactions.business_id', businessId)
    .eq('transactions.status', 'completed')

  if (itemsError) {
    console.error("Gagal mengambil item:", itemsError)
  }

  const productMap: Record<string, { name: string; qty: number; revenue: number }> = {}
  
  // 3. Gabungkan data ke dalam map
  items?.forEach((item: any) => {
    // Ambil nama dari join products, jika tidak ada (produk dihapus) beri nama cadangan
    const name = item.products?.name || 'Produk Tidak Dikenal'
    
    if (!productMap[name]) {
      productMap[name] = { name, qty: 0, revenue: 0 }
    }
    
    productMap[name].qty += Number(item.quantity)
    productMap[name].revenue += Number(item.subtotal)
  })

  // 4. Sorting & Formatting
  const sortedProducts = Object.values(productMap)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5)

  const maxQty = sortedProducts.length > 0 ? Math.max(...sortedProducts.map(p => p.qty)) : 1
  
  const topProducts = sortedProducts.map((p) => ({
    ...p,
    percentage: (p.qty / maxQty) * 100
  }))

  // 5. Generate Rekomendasi
  const recommendations = []
  if (growth > 0) recommendations.push(`Tren positif! Penjualan naik ${growth.toFixed(0)}% dibanding kemarin.`)
  if (topProducts.length > 0) recommendations.push(`${topProducts[0].name} adalah produk terlaris hari ini. Terus pantau stoknya!`)
  if (growth < 0) recommendations.push(`Penjualan turun ${Math.abs(growth).toFixed(0)}%. Pertimbangkan untuk membuat promo.`)
  if (topProducts.length === 0) recommendations.push(`Belum ada data produk terjual. Pastikan transaksi Anda sudah berstatus 'completed'.`)

  return {
    kpi: { salesToday, growth, totalTrx: transactions?.length || 0 },
    topProducts,
    recommendations
  }
}