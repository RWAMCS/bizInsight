'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCookie } from 'cookies-next'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { setActiveBusinessId } from '@/app/auth/business-actions'
import { Store, ChevronDown } from 'lucide-react'
import { AddBusinessModal } from '@/components/shared/add-business-modal' // Import modal baru

interface Business {
  id: string
  name: string
}

export function BusinessSwitcher({ businesses }: { businesses: Business[] }) {
  const router = useRouter()
  const [selected, setSelected] = useState<string>('')

  useEffect(() => {
    const activeId = getCookie('active_business_id') as string
    if (activeId) {
      setSelected(activeId)
    } else if (businesses.length > 0) {
      handleSelect(businesses[0].id)
    }
  }, [businesses])

  const handleSelect = async (id: string) => {
    setSelected(id)
    await setActiveBusinessId(id)
    router.refresh()
  }

  return (
    <div className="flex flex-col w-full md:w-auto">
      <Select value={selected} onValueChange={handleSelect}>
        <SelectTrigger className="w-full md:w-[220px] bg-slate-50 border-none shadow-none rounded-xl font-bold text-slate-700 focus:ring-0">
          <div className="flex items-center gap-2 overflow-hidden">
            <Store className="h-4 w-4 text-blue-600 shrink-0" />
            <div className="truncate">
              <SelectValue placeholder="Pilih Bisnis" />
            </div>
          </div>
        </SelectTrigger>
        <SelectContent className="rounded-2xl shadow-xl border-slate-100 p-0 overflow-hidden">
          <div className="p-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 py-2">Toko Anda</p>
            {businesses.map((biz) => (
              <SelectItem 
                key={biz.id} 
                value={biz.id}
                className="rounded-lg cursor-pointer py-3"
              >
                {biz.name}
              </SelectItem>
            ))}
          </div>
          
          {/* TOMBOL TAMBAH BISNIS DI DALAM DROPDOWN */}
          <AddBusinessModal />
        </SelectContent>
      </Select>
    </div>
  )
}