'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Loader2, Store } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { setActiveBusinessId } from '@/app/auth/business-actions'

export function AddBusinessModal() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/business', {
        method: 'POST',
        body: JSON.stringify({ name, address }),
      })

      const newBusiness = await response.json()

      if (response.ok) {
        toast.success(`Bisnis "${name}" berhasil dibuat!`)
        // Otomatis aktifkan bisnis yang baru dibuat
        await setActiveBusinessId(newBusiness.id)
        
        setOpen(false)
        setName('')
        setAddress('')
        
        // Refresh halaman agar data dashboard berubah
        router.push('/dashboard')
        router.refresh()
      } else {
        throw new Error(newBusiness.error || "Gagal membuat bisnis")
      }
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start text-blue-600 hover:text-blue-700 hover:bg-blue-50 gap-2 font-bold text-xs py-6 border-t rounded-none">
          <Plus className="h-4 w-4" /> Tambah Bisnis Baru
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-[2rem]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Store className="h-5 w-5 text-blue-600" /> Buat Bisnis Baru
          </DialogTitle>
          <DialogDescription>
            Pisahkan stok dan transaksi untuk cabang atau usaha Anda yang lain.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Bisnis</Label>
            <Input
              id="name"
              placeholder="Contoh: Cabang Sudirman"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Alamat (Opsional)</Label>
            <Input
              id="address"
              placeholder="Jl. Merdeka No. 10"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="rounded-xl"
            />
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl py-6 font-bold" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Konfirmasi & Buka Toko
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}