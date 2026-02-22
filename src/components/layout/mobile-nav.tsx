'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Plus,
  Menu,
  FileUp,
  BarChart3,
  Settings,
  X
} from 'lucide-react'

export function MobileNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isActive = (href: string) => pathname === href

  return (
    <>
      {/* BOTTOM NAV */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <div className="absolute inset-0 bg-white/90 backdrop-blur-xl border-t border-slate-200" />

        <div className="relative grid grid-cols-5 items-center h-16">

          {/* DASHBOARD */}
          <NavItem
            href="/dashboard"
            label="Home"
            icon={LayoutDashboard}
            active={isActive('/dashboard')}
          />

          {/* PRODUK */}
          <NavItem
            href="/products"
            label="Produk"
            icon={Package}
            active={isActive('/products')}
          />

          {/* CENTER FAB TRANSAKSI */}
          <div className="flex justify-center">
            <Link
              href="/transactions/create"
              className="relative -top-6"
            >
              <div className="bg-blue-600 text-white p-4 rounded-2xl shadow-lg shadow-blue-200 active:scale-95 transition-transform">
                <Plus className="w-6 h-6" />
              </div>
            </Link>
          </div>

          {/* LIST TRANSAKSI */}
          <NavItem
            href="/transactions"
            label="Transaksi"
            icon={ShoppingCart}
            active={isActive('/transactions')}
          />

          {/* MENU */}
          <button
            onClick={() => setOpen(true)}
            className="flex flex-col items-center justify-center gap-1 text-slate-400"
          >
            <Menu className="w-5 h-5" />
            <span className="text-[10px] font-medium">Menu</span>
          </button>
        </div>
      </div>

      {/* SLIDE UP MENU (SEMUA FITUR SISA) */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 md:hidden">
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 space-y-4 animate-slideUp">

            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg">Menu</h3>
              <button onClick={() => setOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <MenuItem href="/import" icon={FileUp} label="Import Excel" />
            <MenuItem href="/insights" icon={BarChart3} label="Insight" />
            <MenuItem href="/settings" icon={Settings} label="Pengaturan" />

          </div>
        </div>
      )}
    </>
  )
}

function NavItem({ href, icon: Icon, label, active }: any) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center justify-center gap-1"
    >
      <Icon
        className={cn(
          "w-5 h-5 transition-all",
          active ? "text-blue-600 stroke-[2.5px]" : "text-slate-400"
        )}
      />
      <span
        className={cn(
          "text-[10px] font-medium",
          active ? "text-blue-600" : "text-slate-400"
        )}
      >
        {label}
      </span>
    </Link>
  )
}

function MenuItem({ href, icon: Icon, label }: any) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 transition"
    >
      <Icon className="w-5 h-5 text-slate-600" />
      <span className="font-medium">{label}</span>
    </Link>
  )
}