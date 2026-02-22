'use client'

import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

const plans = [
  {
    name: "Starter",
    price: "0",
    desc: "Untuk UMKM kecil yang baru mulai",
    features: ["1 Bisnis Aktif", "Maksimal 50 Produk", "100 Transaksi / Bulan", "Dashboard Dasar", "Akses Mobile"],
    cta: "Mulai Gratis",
    popular: false
  },
  {
    name: "Basic",
    price: "29.000",
    desc: "Untuk bisnis yang ingin berkembang",
    features: ["1 Bisnis Aktif", "Produk Unlimited", "Transaksi Unlimited", "Smart Excel Import", "Insight Otomatis", "Install PWA & Support"],
    cta: "Upgrade Sekarang",
    popular: true
  }
]

export function Pricing() {
  return (
    <section id="pricing" className="py-24 px-6 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Harga Jujur & Terjangkau</h2>
          <p className="text-slate-600">Pilih paket yang sesuai dengan kebutuhan bisnis Anda.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {plans.map((plan, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -10 }}
              className={`relative p-8 rounded-3xl border ${plan.popular ? 'border-blue-600 bg-white shadow-2xl shadow-blue-100' : 'border-slate-200 bg-white shadow-sm'}`}
            >
              {plan.popular && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold">
                  PALING POPULER
                </span>
              )}
              <div className="mb-8">
                <h4 className="text-xl font-bold mb-2">{plan.name}</h4>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-bold text-slate-500 font-mono">Rp</span>
                  <span className="text-4xl font-black text-slate-900">{plan.price}</span>
                  <span className="text-slate-500 text-sm">/bulan</span>
                </div>
                <p className="text-slate-500 text-sm mt-2">{plan.desc}</p>
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
                    <Check className={`w-5 h-5 ${plan.popular ? 'text-blue-600' : 'text-green-500'}`} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/login">
                <Button className={`w-full h-12 rounded-xl font-bold ${plan.popular ? 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200' : 'bg-slate-900 hover:bg-slate-800'}`}>
                  {plan.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}