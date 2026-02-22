'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { createBusiness } from '@/services/businessService' // Kita panggil langsung (Client side wrapper needed or Server Action)
// Catatan: Agar aman, kita buat wrapper sederhana di sini

export default function SetupPage() {
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Kita butuh Server Action sebenarnya, tapi untuk tahap ini
      // kita akan kirim data ke API Route atau call service di Server Action
      // Mari kita buat cara termudah & aman:
      const response = await fetch('/api/business', {
        method: 'POST',
        body: JSON.stringify({ name, address }),
      })

      if (response.ok) {
        router.push('/dashboard')
        router.refresh()
      } else {
        alert('Gagal membuat bisnis')
      }
    } catch (error) {
      alert('Terjadi kesalahan')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Daftarkan Bisnis Anda</CardTitle>
          <CardDescription>
            Langkah terakhir sebelum mengelola stok dan transaksi.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Bisnis / Toko</Label>
              <Input 
                id="name" 
                placeholder="Contoh: Toko Berkah Jaya" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Alamat (Opsional)</Label>
              <Input 
                id="address" 
                placeholder="Jl. Merdeka No. 1" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? 'Menyimpan...' : 'Mulai Sekarang'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}