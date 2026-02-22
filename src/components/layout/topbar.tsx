import { createClient } from '@/lib/supabase/server'
import { BusinessSwitcher } from './business-switcher'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import Image from 'next/image'
import { User, Settings, LogOut } from 'lucide-react'

export async function Topbar() {
  const supabase = await createClient()
  
  // 1. Ambil data Auth & Profile
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url')
    .eq('id', user?.id)
    .single()
  
  // 2. Ambil daftar bisnis untuk switcher
  const { data: businesses } = await supabase
    .from('businesses')
    .select('id, name')
    .order('name')

  const displayName = profile?.full_name || user?.email?.split('@')[0]

  return (
    <header className="h-16 border-b bg-white px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-3">
        {/* ICON LOGO KHUSUS MOBILE (Hanya tampil di layar < 768px) */}
        <Link href="/dashboard" className="md:hidden shrink-0">
          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 shadow-sm active:scale-95 transition-transform">
            <Image 
              src="/icon.png" 
              alt="BizInsight Icon" 
              width={28} 
              height={28} 
              className="object-contain"
              priority
            />
          </div>
        </Link>

        {/* Pemisah Garis Tipis di Mobile */}
        <div className="w-[1px] h-6 bg-slate-200 md:hidden" />

        {/* Switcher Bisnis */}
        <BusinessSwitcher businesses={businesses || []} />
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Nama User (Hanya tampil di Desktop) */}
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold leading-none text-slate-900">{displayName}</p>
          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-bold">Admin</p>
        </div>

        {/* Menu Profil */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-9 w-9 cursor-pointer border-2 border-white ring-1 ring-slate-200 hover:ring-blue-500 transition-all">
              <AvatarImage src={profile?.avatar_url || ''} />
              <AvatarFallback className="bg-blue-600 text-white text-xs font-bold">
                {displayName?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-2xl shadow-xl border-slate-100">
            <DropdownMenuLabel className="font-bold text-slate-500 text-[10px] uppercase tracking-widest">Akun Saya</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/profile">
              <DropdownMenuItem className="cursor-pointer py-3 rounded-xl">
                <User className="mr-3 h-4 w-4 text-slate-400" />
                <span className="font-medium">Edit Profil</span>
              </DropdownMenuItem>
            </Link>
            <Link href="/settings">
              <DropdownMenuItem className="cursor-pointer py-3 rounded-xl">
                <Settings className="mr-3 h-4 w-4 text-slate-400" />
                <span className="font-medium">Pengaturan Bisnis</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 cursor-pointer py-3 rounded-xl focus:bg-red-50 focus:text-red-600">
              <LogOut className="mr-3 h-4 w-4" />
              <span className="font-bold">Keluar</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}