'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export function LandingNavbar() {
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 w-full z-50 border-b bg-white/80 backdrop-blur-md px-6 md:px-12 h-20 flex items-center justify-between"
    >
      {/* LOGO DENGAN LINK KE HOME */}
      <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <Image 
          src="/logo.png" 
          alt="BizInsight Logo" 
          width={180} 
          height={50} 
          className="object-contain"
          priority
        />
      </Link>

      <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
        <Link href="#features" className="hover:text-blue-600 transition-colors">Fitur</Link>
        <Link href="#how-it-works" className="hover:text-blue-600 transition-colors">Cara Kerja</Link>
        <Link href="#pricing" className="hover:text-blue-600 transition-colors">Harga</Link>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/login">
          <Button variant="ghost" className="text-slate-600 font-semibold">Masuk</Button>
        </Link>
        <Link href="/login">
          <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 px-6 font-bold">
            Mulai Gratis
          </Button>
        </Link>
      </div>
    </motion.nav>
  )
}