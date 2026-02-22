'use client'

import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { ArrowRight, PlayCircle, BarChart3, ShieldCheck, Zap } from 'lucide-react'
import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden bg-slate-50">
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-3xl -z-10" />
      
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold mb-6 border border-blue-100">
            <Zap className="w-3 h-3 fill-current" />
            <span>TERSEDIA UNTUK UMKM INDONESIA</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-[1.1] mb-6">
            Kelola & Analisa Bisnis <span className="text-blue-600">Tanpa Ribet.</span>
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed">
            Pahami penjualan, profit, dan performa stok produk Anda hanya dalam satu dashboard cerdas yang dirancang khusus untuk pengusaha sibuk.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/login">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-7 shadow-xl shadow-blue-200 rounded-2xl gap-2">
                Mulai Gratis Sekarang <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            
            {/* LINK KE HALAMAN DEMO */}
            <Link href="/demo-view">
              <Button size="lg" variant="outline" className="text-lg px-8 py-7 rounded-2xl gap-2 border-slate-200 hover:bg-white hover:border-blue-500 hover:text-blue-600 transition-all">
                <PlayCircle className="w-5 h-5" /> Lihat Demo
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative"
        >
          <div className="relative z-10 w-full aspect-[4/3] bg-white rounded-3xl shadow-2xl border border-slate-200 p-4 overflow-hidden group">
            <div className="w-full h-8 bg-slate-50 rounded-t-xl mb-4 flex items-center px-4 gap-2 border-b">
               <div className="w-2 h-2 rounded-full bg-red-400" />
               <div className="w-2 h-2 rounded-full bg-yellow-400" />
               <div className="w-2 h-2 rounded-full bg-green-400" />
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6">
               <div className="h-20 bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-center">
                  <BarChart3 className="text-blue-600 w-8 h-8 opacity-20" />
               </div>
               <div className="h-20 bg-slate-50 rounded-xl border border-slate-100" />
               <div className="h-20 bg-slate-50 rounded-xl border border-slate-100" />
            </div>
            <div className="space-y-3">
               <div className="h-4 w-1/2 bg-slate-100 rounded" />
               <div className="h-4 w-full bg-slate-50 rounded" />
               <div className="h-32 w-full bg-slate-50 rounded-xl border border-dashed border-slate-200 flex items-center justify-center">
                  <span className="text-xs text-slate-400 font-mono">Dashboard Preview Placeholder</span>
               </div>
            </div>
            <div className="absolute bottom-10 -right-4 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 animate-bounce shadow-blue-200">
               <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-green-600" />
               </div>
               <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Profit Hari Ini</p>
                  <p className="text-lg font-bold text-slate-900">+ Rp 1.250.000</p>
               </div>
            </div>
          </div>
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-[40px] opacity-20 blur-2xl -z-10" />
        </motion.div>
      </div>
    </section>
  )
}