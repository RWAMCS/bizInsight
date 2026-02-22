'use client'

import React from 'react'
import { 
  LayoutDashboard, Package, ShoppingCart, BarChart3, 
  Settings, LogOut, DollarSign, TrendingUp, AlertTriangle, 
  ArrowLeft, Info
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SalesChart } from '@/components/shared/sales-chart'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

// DATA DUMMY UNTUK DEMO
const DUMMY_STATS = {
  totalRevenue: 25750000,
  totalProfit: 8400000,
  totalTransactions: 142,
  lowStockCount: 3,
  chartData: [
    { name: 'Sen', total: 1200000 },
    { name: 'Sel', total: 2100000 },
    { name: 'Rab', total: 1800000 },
    { name: 'Kam', total: 3400000 },
    { name: 'Jum', total: 2800000 },
    { name: 'Sab', total: 5400000 },
    { name: 'Min', total: 4200000 },
  ]
}

export default function DemoViewPage() {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* SIDEBAR SIMULASI */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold text-blue-400">BizInsight</h1>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Mode Demo</p>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <div className="flex items-center gap-3 bg-slate-800 text-blue-400 p-3 rounded-lg cursor-default">
            <LayoutDashboard className="w-5 h-5" /> <span>Dashboard</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400 p-3 hover:text-white transition-colors cursor-not-allowed">
            <Package className="w-5 h-5" /> <span>Produk</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400 p-3 hover:text-white transition-colors cursor-not-allowed">
            <ShoppingCart className="w-5 h-5" /> <span>Transaksi</span>
          </div>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <Link href="/">
            <Button variant="ghost" className="w-full justify-start text-red-400 hover:bg-red-500/10 hover:text-red-300">
              <LogOut className="mr-2 h-4 w-4" /> Keluar Demo
            </Button>
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT SIMULASI */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TOPBAR SIMULASI */}
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
               <Info className="w-3 h-3" /> DATA SIMULASI
             </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-bold">Tamu Pengunjung</p>
              <p className="text-[10px] text-slate-500">Viewer Mode</p>
            </div>
            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-500 italic">
              T
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Ringkasan Bisnis</h2>
                <p className="text-slate-500 mt-1">Inilah tampilan dashboard BizInsight yang akan Anda dapatkan.</p>
              </div>
              <Link href="/login">
                <Button className="bg-blue-600 hover:bg-blue-700">Daftar Sekarang Untuk Mulai</Button>
              </Link>
            </div>

            {/* STATS CARDS */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="border-none shadow-sm ring-1 ring-slate-200">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center text-slate-500">
                    <span className="text-xs font-bold uppercase tracking-wider">Pendapatan</span>
                    <DollarSign className="w-4 h-4 text-green-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-black">Rp {DUMMY_STATS.totalRevenue.toLocaleString()}</div>
                  <p className="text-[10px] text-green-600 font-bold mt-1">↑ 12% dari minggu lalu</p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm ring-1 ring-slate-200">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center text-slate-500">
                    <span className="text-xs font-bold uppercase tracking-wider">Profit Bersih</span>
                    <TrendingUp className="w-4 h-4 text-blue-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-black text-blue-600">Rp {DUMMY_STATS.totalProfit.toLocaleString()}</div>
                  <p className="text-[10px] text-slate-500 mt-1">Margin 32.6%</p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm ring-1 ring-slate-200">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center text-slate-500">
                    <span className="text-xs font-bold uppercase tracking-wider">Transaksi</span>
                    <ShoppingCart className="w-4 h-4 text-orange-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-black">{DUMMY_STATS.totalTransactions}</div>
                  <p className="text-[10px] text-slate-500 mt-1">Nota lunas terverifikasi</p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm ring-1 ring-slate-200 bg-red-50/50">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center text-slate-500">
                    <span className="text-xs font-bold uppercase tracking-wider">Stok Tipis</span>
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-black text-red-600">{DUMMY_STATS.lowStockCount}</div>
                  <p className="text-[10px] text-red-700/60 font-bold mt-1">Perlu segera restock</p>
                </CardContent>
              </Card>
            </div>

            {/* CHART SIMULASI */}
            <Card className="border-none shadow-xl ring-1 ring-slate-200">
              <CardHeader className="border-b bg-slate-50/50">
                <CardTitle className="text-lg">Grafik Penjualan Mingguan</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <SalesChart data={DUMMY_STATS.chartData} />
              </CardContent>
            </Card>

            {/* MESSAGE FOR USER */}
            <div className="bg-blue-600 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-200">
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Tertarik dengan analisa data seperti ini?</h3>
                <p className="text-blue-100 opacity-80">Gunakan BizInsight untuk bisnis asli Anda sekarang juga secara gratis.</p>
              </div>
              <Link href="/login">
                <Button variant="secondary" size="lg" className="font-bold px-8 py-6 rounded-xl">
                  Buat Akun Sekarang
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}