'use client'

import { CheckCircle2, Circle, ArrowRight, Package, ShoppingCart, Store } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { motion } from 'framer-motion'

// Definisikan tipe status secara eksplisit agar TypeScript tidak bingung
type OnboardingStep = 'SETUP_BUSINESS' | 'CREATE_PRODUCT' | 'FIRST_TRANSACTION' | 'COMPLETED'

interface OnboardingProps {
  currentStep: OnboardingStep
}

export function OnboardingChecklist({ currentStep }: OnboardingProps) {
  // Jika sudah selesai, jangan tampilkan apa-apa
  if (currentStep === 'COMPLETED') return null

  const steps = [
    {
      id: 'SETUP_BUSINESS' as OnboardingStep,
      label: 'Daftarkan Bisnis',
      desc: 'Masukkan nama dan alamat toko Anda.',
      icon: Store,
      href: '/setup'
    },
    {
      id: 'CREATE_PRODUCT' as OnboardingStep,
      label: 'Tambah Produk Pertama',
      desc: 'Isi stok barang yang ingin Anda jual.',
      icon: Package,
      href: '/products'
    },
    {
      id: 'FIRST_TRANSACTION' as OnboardingStep,
      label: 'Catat Penjualan Pertama',
      desc: 'Coba simulasikan satu transaksi terjual.',
      icon: ShoppingCart,
      href: '/transactions/create'
    }
  ]

  const currentIndex = steps.findIndex(s => s.id === currentStep)

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-blue-600 rounded-3xl p-6 text-white mb-8 shadow-xl shadow-blue-200"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h3 className="text-xl font-bold flex items-center gap-2">
            Mari siapkan toko Anda 🚀
          </h3>
          <p className="text-blue-100 text-sm">Selesaikan langkah berikut untuk membuka fitur lengkap.</p>
        </div>
        <div className="bg-white/10 px-4 py-2 rounded-full text-xs font-bold border border-white/20">
          PROGRES: {currentIndex === -1 ? 0 : currentIndex} / 3 SELESAI
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mt-8">
        {steps.map((step, idx) => {
          // Perbaikan Logika: Bandingkan dengan aman
          const isCompleted = idx < currentIndex;
          const isCurrent = step.id === currentStep;

          return (
            <div 
              key={step.id}
              className={`p-5 rounded-2xl border transition-all duration-300 ${
                isCurrent 
                  ? 'bg-white text-blue-600 shadow-lg scale-105' 
                  : isCompleted 
                    ? 'bg-blue-500/50 text-blue-100 border-transparent opacity-60' 
                    : 'bg-blue-700/30 text-blue-200 border-blue-500/30'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className={`p-2 rounded-lg ${isCurrent ? 'bg-blue-100' : 'bg-white/10'}`}>
                  <step.icon className="w-5 h-5" />
                </div>
                {isCompleted ? <CheckCircle2 className="w-5 h-5 text-green-300" /> : <Circle className="w-5 h-5 opacity-30" />}
              </div>
              <h4 className="font-bold text-sm mb-1">{step.label}</h4>
              <p className={`text-[11px] leading-relaxed mb-4 ${isCurrent ? 'text-slate-500' : 'text-blue-100'}`}>
                {step.desc}
              </p>
              {isCurrent && (
                <Link href={step.href}>
                  <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2 text-xs rounded-xl font-bold">
                    Kerjakan <ArrowRight className="w-3 h-3" />
                  </Button>
                </Link>
              )}
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}