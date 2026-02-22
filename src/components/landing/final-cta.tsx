import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, PlayCircle } from 'lucide-react'

export function FinalCTA() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto bg-blue-600 rounded-[2.5rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-200">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
            Siap Kelola Bisnis Lebih <br className="hidden md:block" /> Rapi & Menguntungkan?
          </h2>
          <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
            Mulai gratis hari ini dan lihat sendiri bagaimana BizInsight membantu Anda memahami bisnis lebih mudah melalui dashboard cerdas.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-10 py-8 text-xl font-bold rounded-2xl gap-2 shadow-xl shadow-blue-900/20 transition-transform active:scale-95">
                Mulai Gratis Sekarang <ArrowRight className="w-6 h-6" />
              </Button>
            </Link>
            
            {/* LINK KE HALAMAN DEMO */}
            <Link href="/demo-view">
              <Button variant="ghost" className="text-white hover:bg-white/10 px-8 py-8 text-lg font-medium flex items-center gap-2">
                <PlayCircle className="w-5 h-5" /> Lihat Demo Terlebih Dahulu
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}