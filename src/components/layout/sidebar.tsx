'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  FileUp, 
  Settings,
  LogOut,
  User
} from 'lucide-react'
import { signOut } from '@/app/auth/actions'

const routes = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Produk', icon: Package, href: '/products' },
  { label: 'Transaksi', icon: ShoppingCart, href: '/transactions' },
  { label: 'Import Excel', icon: FileUp, href: '/import' },
  { label: 'Insight', icon: BarChart3, href: '/insights' },
  { label: 'Pengaturan', icon: Settings, href: '/settings' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col bg-[#0f172a] text-slate-300 w-64 border-r border-slate-800/50">
      {/* AREA LOGO */}
      <div className="p-6 mb-4">
        <Link href="/dashboard" className="flex items-center justify-center bg-white rounded-2xl p-4 shadow-xl shadow-blue-900/20 group transition-all hover:scale-105">
          <Image 
            src="/logo.png" 
            alt="BizInsight Logo" 
            width={180} 
            height={50} 
            className="object-contain"
            priority
          />
        </Link>
      </div>

      {/* NAVIGASI MENU */}
      <nav className="flex-1 space-y-1 px-4">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 px-2">Main Menu</p>
        {routes.map((route) => {
          const isActive = pathname === route.href
          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "group flex items-center rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 mb-1",
                isActive 
                  ? "bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-lg shadow-blue-900/50" 
                  : "hover:bg-slate-800/50 hover:text-white"
              )}
            >
              <route.icon className={cn(
                "mr-3 h-5 w-5 transition-colors",
                isActive ? "text-white" : "text-slate-400 group-hover:text-teal-400"
              )} />
              {route.label}
            </Link>
          )
        })}
      </nav>

      {/* FOOTER SIDEBAR (PROFIL & LOGOUT) */}
      <div className="p-4 mt-auto border-t border-slate-800/50 space-y-2">
        <Link href="/profile">
            <div className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors hover:bg-slate-800/50 cursor-pointer",
                pathname === '/profile' ? "text-teal-400" : "text-slate-400"
            )}>
                <User className="h-5 w-5" />
                <span className="text-sm font-medium">Profil Saya</span>
            </div>
        </Link>
        <button 
          onClick={() => signOut()}
          className="flex w-full items-center px-4 py-3 text-sm font-medium text-slate-500 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all group"
        >
          <LogOut className="mr-3 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          Keluar
        </button>
      </div>
    </div>
  )
}