'use client'

import { useState, useEffect } from 'react'
import { getCookie } from 'cookies-next'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Save, Building2, MapPin, Loader2 } from 'lucide-react'

export default function SettingsPage() {
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const businessId = getCookie('active_business_id') as string

  useEffect(() => {
    async function loadBusiness() {
      const supabase = createClient()
      const { data } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', businessId)
        .single()
      
      if (data) {
        setName(data.name)
        setAddress(data.address || '')
      }
    }
    if (businessId) loadBusiness()
  }, [businessId])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/business/update', {
        method: 'POST',
        body: JSON.stringify({ id: businessId, name, address }),
      })

      if (response.ok) {
        toast.success("Profil bisnis berhasil diperbarui!")
        window.location.reload() // Refresh untuk update nama di Topbar
      } else {
        throw new Error("Gagal memperbarui")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Pengaturan</h2>
        <p className="text-muted-foreground">Kelola profil dan konfigurasi bisnis Anda.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" /> Identitas Bisnis
          </CardTitle>
          <CardDescription>Informasi ini akan muncul di dashboard dan laporan.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Bisnis</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Alamat Lengkap</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="address" 
                  className="pl-9"
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)} 
                />
              </div>
            </div>
            <Button className="w-full gap-2" type="submit" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Simpan Perubahan
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}