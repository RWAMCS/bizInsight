import { getDashboardStats } from '@/services/dashboardService'
import { getOnboardingStatus } from '@/services/onboardingService'
import { getActiveBusinessId } from '@/app/auth/business-actions'
import { OnboardingChecklist } from '@/components/shared/onboarding-checklist'
import { SalesChart } from '@/components/shared/sales-chart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, TrendingUp, ShoppingCart, AlertTriangle, LayoutDashboard } from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const activeBusinessId = await getActiveBusinessId()
  
  // Ambil status progres user
  const onboarding = await getOnboardingStatus()

  // Jika user benar-benar baru dan belum punya ID Bisnis, kita tidak panggil stats dulu
  const stats = activeBusinessId ? await getDashboardStats(activeBusinessId) : null

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">Dashboard</h2>
          <p className="text-slate-500">Pantau performa bisnis Anda secara real-time.</p>
        </div>
      </div>

      {/* PANDUAN LANGKAH AWAL (Akan hilang jika status COMPLETED) */}
      {onboarding && (
        <OnboardingChecklist currentStep={onboarding.step as any} />
      )}

      {/* DATA UTAMA */}
      {activeBusinessId && stats ? (
        <div className="space-y-8">
          {/* STATS CARDS */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-none shadow-sm ring-1 ring-slate-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-500">Pendapatan</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black">Rp {stats.totalRevenue.toLocaleString()}</div>
                <p className="text-[10px] text-muted-foreground mt-1">Total nota terjual</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm ring-1 ring-slate-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-500">Keuntungan</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black text-blue-600">Rp {stats.totalProfit.toLocaleString()}</div>
                <p className="text-[10px] text-muted-foreground mt-1">Estimasi laba kotor</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm ring-1 ring-slate-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-500">Transaksi</CardTitle>
                <ShoppingCart className="h-4 w-4 text-slate-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black">{stats.totalTransactions}</div>
                <p className="text-[10px] text-muted-foreground mt-1">Jumlah penjualan lunas</p>
              </CardContent>
            </Card>

            <Card className={`border-none shadow-sm ring-1 ${stats.lowStockCount > 0 ? 'ring-red-200 bg-red-50' : 'ring-slate-200'}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-500">Stok Rendah</CardTitle>
                <AlertTriangle className={`h-4 w-4 ${stats.lowStockCount > 0 ? 'text-red-600' : 'text-slate-400'}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-black ${stats.lowStockCount > 0 ? 'text-red-600' : 'text-slate-900'}`}>
                  {stats.lowStockCount}
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">Produk perlu restock</p>
              </CardContent>
            </Card>
          </div>

          {/* CHART AREA */}
          <Card className="border-none shadow-xl shadow-slate-200/50 ring-1 ring-slate-200 overflow-hidden rounded-3xl">
            <CardHeader className="bg-slate-50/50 border-b px-8 py-6">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <LayoutDashboard className="w-5 h-5 text-blue-600" />
                Tren Penjualan (7 Hari Terakhir)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <SalesChart data={stats.chartData} />
            </CardContent>
          </Card>
        </div>
      ) : (
        /* EMPTY STATE / LOADING */
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 text-slate-400">
          <LayoutDashboard className="w-12 h-12 mb-4 opacity-20" />
          <p className="text-center max-w-xs">
            Selesaikan panduan persiapan di atas untuk mulai melihat statistik bisnis Anda.
          </p>
        </div>
      )}
    </div>
  )
}