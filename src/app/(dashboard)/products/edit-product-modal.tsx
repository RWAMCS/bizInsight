'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { Pencil, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { updateProductAction } from './actions'

const formSchema = z.object({
  name: z.string().min(3, "Minimal 3 karakter"),
  category: z.string().min(1, "Kategori wajib"),
  purchase_price: z.coerce.number(),
  selling_price: z.coerce.number(),
  stock_quantity: z.coerce.number(),
})

export function EditProductModal({ product, open, setOpen }: { product: any, open: boolean, setOpen: (o: boolean) => void }) {
  const [loading, setLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product.name,
      category: product.category || '',
      purchase_price: product.purchase_price,
      selling_price: product.selling_price,
      stock_quantity: product.stock_quantity,
    },
  })

  async function onSubmit(values: any) {
    setLoading(true)
    const res = await updateProductAction(product.id, values)
    if (res.success) {
      toast.success("Produk berhasil diperbarui")
      setOpen(false)
    } else {
      toast.error(res.error)
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="rounded-3xl sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="w-5 h-5 text-blue-600" /> Edit Produk
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>Nama</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="purchase_price" render={({ field }) => (
                <FormItem><FormLabel>Harga Beli</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
              )} />
              <FormField control={form.control} name="selling_price" render={({ field }) => (
                <FormItem><FormLabel>Harga Jual</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
              )} />
            </div>
            <Button type="submit" className="w-full bg-blue-600 rounded-xl" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : "Simpan Perubahan"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}