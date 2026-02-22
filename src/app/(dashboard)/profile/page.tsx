'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'
import { User, Camera, Loader2, Save } from 'lucide-react'

export default function ProfilePage() {
  const [fullName, setFullName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        
        if (data) {
          setFullName(data.full_name || '')
          setAvatarUrl(data.avatar_url)
        }
      }
      setLoading(false)
    }
    loadProfile()
  }, [])

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      if (!event.target.files || event.target.files.length === 0) return

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      setAvatarUrl(publicUrl)
      toast.success("Foto berhasil diupload!")
    } catch (error) {
      toast.error("Gagal upload foto")
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    setUploading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: fullName,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })

      if (error) throw error
      toast.success("Profil diperbarui!")
    } catch (error) {
      toast.error("Gagal menyimpan profil")
    } finally {
      setUploading(false)
    }
  }

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Profil Saya</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Informasi Personal</CardTitle>
          <CardDescription>Kelola foto dan nama tampilan Anda.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <div className="relative group">
              <Avatar className="h-24 w-24 border-2 border-slate-100">
                <AvatarImage src={avatarUrl || ''} />
                <AvatarFallback className="bg-blue-50 text-blue-600 text-xl font-bold">
                  {fullName?.charAt(0).toUpperCase() || <User />}
                </AvatarFallback>
              </Avatar>
              <label 
                htmlFor="avatar-upload" 
                className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
              >
                <Camera className="h-6 w-6" />
              </label>
              <input 
                type="file" 
                id="avatar-upload" 
                className="hidden" 
                accept="image/*" 
                onChange={handleUpload} 
                disabled={uploading}
              />
            </div>
            <div className="text-center sm:text-left">
              <p className="font-medium text-lg">Foto Profil</p>
              <p className="text-sm text-muted-foreground">Klik foto untuk mengubah. Maksimal 2MB.</p>
            </div>
          </div>

          {/* Form Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nama Lengkap</Label>
              <Input 
                id="fullName" 
                placeholder="Masukkan nama lengkap Anda" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <Button 
              className="w-full gap-2 bg-blue-600 hover:bg-blue-700" 
              onClick={handleSave}
              disabled={uploading}
            >
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Simpan Perubahan
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}