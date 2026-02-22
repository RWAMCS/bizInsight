import { createClient } from '@/lib/supabase/server'

export async function getDashboardStats(businessId: string) {
  const supabase = await createClient()

  // PERBAIKAN: Tambahkan .eq('status', 'completed')
  const { data: transactions } = await supabase
    .from('transactions')
    .select('total_amount, total_profit, created_at, status')
    .eq('business_id', businessId)
    .eq('status', 'completed') // <--- KUNCI PERBAIKAN

  const { data: products } = await supabase
    .from('products')
    .select('stock_quantity, min_stock_level')
    .eq('business_id', businessId)

  const totalRevenue = transactions?.reduce((sum, trx) => sum + Number(trx.total_amount), 0) || 0
  const totalProfit = transactions?.reduce((sum, trx) => sum + Number(trx.total_profit), 0) || 0
  const lowStockCount = products?.filter(p => p.stock_quantity <= p.min_stock_level).length || 0

  // Siapkan data untuk Chart (Hanya yang completed)
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - i)
    return d.toISOString().split('T')[0]
  }).reverse()

  const chartData = last7Days.map(date => {
    const dayTotal = transactions
      ?.filter(trx => trx.created_at.startsWith(date))
      .reduce((sum, trx) => sum + Number(trx.total_amount), 0) || 0
    
    return {
      name: new Date(date).toLocaleDateString('id-ID', { weekday: 'short' }),
      total: dayTotal
    }
  })

  return {
    totalRevenue,
    totalProfit,
    totalTransactions: transactions?.length || 0,
    lowStockCount,
    chartData
  }
}