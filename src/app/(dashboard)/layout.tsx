import { Sidebar } from '@/components/layout/sidebar'
import { Topbar } from '@/components/layout/topbar'
import { MobileNav } from '@/components/layout/mobile-nav'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getOnboardingStatus } from '@/services/onboardingService'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  // 🔐 Proteksi Login
  if (error || !user) {
    redirect('/login')
  }

  // (Opsional) Jika nanti ingin aktifkan kembali onboarding check
  // const status = await getOnboardingStatus()

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      
      {/* ✅ Sidebar Desktop */}
      <aside className="hidden md:flex md:flex-shrink-0">
        <Sidebar />
      </aside>

      {/* ✅ Main Content Wrapper */}
      <div className="flex flex-1 flex-col overflow-hidden relative">
        
        {/* Topbar */}
        <Topbar />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>

          {/* ✅ Spacer agar konten tidak tertutup bottom nav (mobile only) */}
          <div className="h-20 md:hidden" />
        </main>

        {/* ✅ Bottom Navigation Mobile */}
        <MobileNav />
      </div>
    </div>
  )
}