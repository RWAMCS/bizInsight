import { LandingNavbar } from '@/components/landing/navbar'
import { Hero } from '@/components/landing/hero'
import { HowItWorks } from '@/components/landing/how-it-works'
import { Pricing } from '@/components/landing/pricing'
import { FAQ } from '@/components/landing/faq'
import { FinalCTA } from '@/components/landing/final-cta'
import { LogoTicker } from '@/components/landing/logo-ticker' // Import Ticker Baru
import { LayoutDashboard, ShoppingCart, FileUp, TrendingUp, CheckCircle2, Zap } from 'lucide-react'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <LandingNavbar />
      <Hero />

      {/* GANTI Trust Bar Lama dengan LogoTicker yang bergerak */}
      <LogoTicker />

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
        {/* ... (konten fitur tetap sama) ... */}
        <div className="text-center mb-16">
          <h2 className="text-blue-600 font-bold mb-4 uppercase tracking-widest text-sm">Fitur Unggulan</h2>
          <h3 className="text-4xl font-bold text-slate-900 leading-tight">Dirancang Untuk Masa Depan Bisnis Anda</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "Dashboard Visual", desc: "Lihat ringkasan bisnis dengan grafik yang mudah dipahami orang awam.", icon: LayoutDashboard },
            { title: "Manajemen Produk", desc: "Pantau stok, margin keuntungan, dan sisa barang secara otomatis.", icon: ShoppingCart },
            { title: "Smart Excel Import", desc: "Pindahkan data dari catatan lama Anda hanya dalam hitungan detik.", icon: FileUp },
            { title: "Insight Otomatis", desc: "Sistem cerdas kami memberi tahu produk mana yang paling laku.", icon: TrendingUp },
            { title: "Keamanan Data", desc: "Data bisnis Anda tersimpan aman dan terenkripsi di server kami.", icon: CheckCircle2 },
            { title: "Akses Mobile", desc: "Buka dari HP kapan saja, di mana saja. Bisa di-install seperti aplikasi.", icon: Zap },
          ].map((feature, idx) => (
            <div key={idx} className="p-8 rounded-3xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-blue-100 transition-all group">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <feature.icon className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold mb-3">{feature.title}</h4>
              <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <HowItWorks />
      <Pricing />
      <FAQ />
      <FinalCTA />

      <footer className="py-12 border-t px-6 text-center text-slate-500 text-sm bg-slate-50">
        <p>© 2026 BizInsight. Build with 💙 for Indonesian UMKM.</p>
      </footer>
    </main>
  )
}