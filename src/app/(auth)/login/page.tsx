'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { signIn, signInWithGoogle } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Loader2, Mail, Lock } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await signIn(email, password)
      toast.success("Selamat datang kembali!")
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)
    try {
      await signInWithGoogle()
    } catch (error: any) {
      toast.error("Gagal terhubung ke Google")
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* SISI KIRI: FORM */}
      <div className="flex w-full flex-col justify-center px-8 lg:w-1/2 xl:px-24">
        <div className="mx-auto w-full max-w-sm">
          {/* Logo dengan Link Kembali ke Landing Page */}
          <div className="mb-8 flex flex-col items-center justify-center text-center">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <Image 
                src="/logo.png" 
                alt="BizInsight Logo" 
                width={220} 
                height={60} 
                className="mb-6 object-contain"
                priority
              />
            </Link>
            <p className="text-sm text-slate-500 uppercase tracking-widest font-semibold">
              Welcome To BizInsight
            </p>
          </div>

          {/* Tombol Google - Diletakkan di atas atau di bawah, di sini saya buat sangat menonjol */}
          <div className="mb-6">
            <Button 
              type="button"
              variant="outline" 
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
              className="w-full h-12 rounded-full border-slate-200 flex items-center justify-center gap-3 font-medium hover:bg-slate-50 transition-all"
            >
              {isGoogleLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5.04c1.94 0 3.68.67 5.05 1.97l3.77-3.77C18.54 1.25 15.52 0 12 0 7.31 0 3.25 2.69 1.19 6.6l4.41 3.42C6.64 7.04 9.11 5.04 12 5.04z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.76 2.91c2.2-2.02 3.66-5 3.66-8.73z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.6 14.98c-.24-.72-.37-1.49-.37-2.28s.13-1.56.37-2.28L1.19 6.6C.43 8.22 0 10.06 0 12s.43 3.78 1.19 5.4l4.41-3.42z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.76-2.91c-1.08.72-2.48 1.16-4.17 1.16-3.21 0-5.92-2.17-6.89-5.1L1.19 17.6C3.25 21.31 7.31 24 12 24z"
                    />
                  </svg>
                  Sign in with Google
                </>
              )}
            </Button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-100"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400">Or use email</span>
            </div>
          </div>

          {/* Form Login Email */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
              <Input 
                type="email" placeholder="Email address" 
                className="pl-11 h-12 rounded-full border-slate-200 focus:ring-rose-500"
                value={email} onChange={(e) => setEmail(e.target.value)} required 
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
              <Input 
                type="password" placeholder="Password" 
                className="pl-11 h-12 rounded-full border-slate-200 focus:ring-rose-500"
                value={password} onChange={(e) => setPassword(e.target.value)} required 
              />
            </div>

            <Button className="w-full h-12 rounded-full bg-rose-500 hover:bg-rose-600 font-bold shadow-lg shadow-rose-100 transition-all" type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "SIGN IN"}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              Don't have an account? <Link href="/register" className="font-bold text-rose-500 hover:underline">Sign Up Now</Link>
            </p>
          </div>
        </div>
      </div>

      {/* SISI KANAN */}
      <div className="hidden w-1/2 lg:block relative overflow-hidden bg-gradient-to-br from-[#0F172A] to-[#0D9488]">
          <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2026&auto=format&fit=crop')] bg-cover"></div>
          <div className="relative z-10 flex h-full flex-col items-center justify-center px-20 text-center text-white">
          <Image src="/logo.png" alt="BizInsight White" width={300} height={80} className="mb-8 brightness-0 invert" />
          <h2 className="text-4xl font-black mb-4 uppercase tracking-tight">Biz Insight</h2>
          <p className="text-slate-300 max-w-md text-lg">Kendalikan bisnis Anda dengan data yang akurat dan tampilan yang modern.</p>
        </div>
      </div>
    </div>
  )
}