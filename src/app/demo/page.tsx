'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

export default function DemoPage() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function handleDemoLogin() {
      try {
        // Melakukan login otomatis menggunakan akun demo publik
        const { error } = await supabase.auth.signInWithPassword({
          email: 'guest@bizinsight.com',
          password: 'guest123456',
        })

        if (error) throw error

        toast.success("Masuk sebagai Tamu Demo. Selamat mencoba!")
        
        // Redirect ke dashboard
        router.push('/dashboard')
        router.refresh()
      } catch (err: any) {
        toast.error("Maaf, sesi demo tidak tersedia saat ini.")
        console.error(err)
        router.push('/login')
      }
    }

    // Beri sedikit delay agar user sempat melihat animasi loading yang keren
    const timeout = setTimeout(() => {
      handleDemoLogin()
    }, 1500)

    return () => clearTimeout(timeout)
  }, [router, supabase])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6"
      >
        <div className="relative inline-block">
          <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto" />
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute inset-0 bg-blue-400 blur-2xl -z-10 rounded-full"
          />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-slate-900 flex items-center justify-center gap-2">
            BizInsight <Sparkles className="w-6 h-6 text-yellow-500 fill-current" />
          </h2>
          <p className="text-slate-500 font-medium animate-pulse">
            Menyiapkan akses demo untuk Anda...
          </p>
        </div>

        <div className="flex gap-2 justify-center">
          <div className="h-1.5 w-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="h-1.5 w-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="h-1.5 w-1.5 bg-blue-600 rounded-full animate-bounce" />
        </div>
      </motion.div>
    </div>
  )
}