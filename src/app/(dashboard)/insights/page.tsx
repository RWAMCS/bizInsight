import { getBusinessInsights, TopProduct } from '@/services/insightService' // PERBAIKAN IMPORT
import { getActiveBusinessId } from '@/app/auth/business-actions'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Trophy, 
  Lightbulb, 
  DollarSign,
  ArrowUpRight
} from 'lucide-react'

export default async function InsightsPage() {
  const activeBusinessId = await getActiveBusinessId()
  if (!activeBusinessId) redirect('/dashboard')

  const data = await getBusinessInsights(activeBusinessId)

  return (
    <div className="space-y-6 pb-24 md:pb-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-3xl border-none shadow-md bg-white overflow-hidden">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pendapatan Hari Ini</p>
                <h3 className="text-2xl font-black">Rp {data.kpi.salesToday.toLocaleString()}</h3>
              </div>
              <div className={`p-2 rounded-2xl ${data.kpi.growth >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {data.kpi.growth >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className={`text-xs font-bold ${data.kpi.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {data.kpi.growth >= 0 ? '↑' : '↓'} {Math.abs(data.kpi.growth).toFixed(1)}%
              </span>
              <span className="text-xs text-slate-400">vs kemarin</span>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 rounded-3xl border-none shadow-md bg-blue-600 text-white relative overflow-hidden">
          <Zap className="absolute right-[-10px] top-[-10px] w-32 h-32 opacity-10 rotate-12" />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-yellow-300" />
              <span className="text-xs font-bold uppercase tracking-tighter text-blue-100">Asisten BizInsight</span>
            </div>
            <div className="space-y-2">
              {data.recommendations.map((rec: string, i: number) => (
                <p key={i} className="text-sm font-medium leading-relaxed">• {rec}</p>
              ))}
              {data.recommendations.length === 0 && <p className="text-sm opacity-80">Terus tingkatkan transaksi untuk mendapatkan insight.</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-[2rem] border-none shadow-md bg-white">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-4">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" /> Top 5 Terlaris
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {data.topProducts.map((product: TopProduct, i: number) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-sm font-bold text-slate-700">{product.name}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-medium">Ranking #{i+1}</p>
                  </div>
                  <p className="text-sm font-black text-blue-600">{product.qty} Unit</p>
                </div>
                <div className="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="absolute left-0 top-0 h-full bg-blue-500 rounded-full transition-all duration-1000"
                    style={{ width: `${product.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-none shadow-md bg-white">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-4">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-500" /> Kontribusi Rupiah
            </CardTitle>
            <ArrowUpRight className="w-4 h-4 text-slate-300" />
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {data.topProducts.map((product: TopProduct, i: number) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[10px] font-black shadow-sm">
                      {i + 1}
                    </div>
                    <span className="text-sm font-bold text-slate-700">{product.name}</span>
                  </div>
                  <p className="text-sm font-black text-slate-900">
                    Rp {product.revenue.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}