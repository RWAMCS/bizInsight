'use client'

import { motion } from 'framer-motion'
import { UserPlus, UploadCloud, LineChart } from 'lucide-react'

const steps = [
  {
    title: "Buat Akun Gratis",
    desc: "Daftar hanya dengan email dan mulai kelola bisnis Anda dalam hitungan menit.",
    icon: UserPlus,
    color: "bg-blue-100 text-blue-600"
  },
  {
    title: "Tambah Produk atau Import Excel",
    desc: "Sudah punya data? Upload file Excel atau CSV, sistem akan membantu menyesuaikan kolom secara otomatis.",
    icon: UploadCloud,
    color: "bg-green-100 text-green-600"
  },
  {
    title: "Lihat Dashboard & Insight",
    desc: "Pantau penjualan, profit, dan produk terlaris dari satu dashboard sederhana yang mudah dipahami.",
    icon: LineChart,
    color: "bg-purple-100 text-purple-600"
  }
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Cara Kerja BizInsight</h2>
          <p className="text-slate-600">Mulai hanya dalam beberapa langkah sederhana.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Garis penghubung (Desktop only) */}
          <div className="hidden md:block absolute top-1/4 left-0 w-full h-0.5 bg-slate-100 -z-10" />
          
          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center group"
            >
              <div className={`w-20 h-20 rounded-full ${step.color} flex items-center justify-center mb-6 shadow-lg border-4 border-white transition-transform group-hover:scale-110`}>
                <step.icon className="w-8 h-8" />
              </div>
              <div className="bg-slate-900 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-4 shadow-md">
                {idx + 1}
              </div>
              <h4 className="text-xl font-bold mb-3">{step.title}</h4>
              <p className="text-slate-600 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}