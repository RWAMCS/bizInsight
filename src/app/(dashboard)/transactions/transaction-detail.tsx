'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ReceiptText, Ban, Loader2, CheckCircle, XCircle } from "lucide-react"
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function TransactionDetail({ 
  transaction, 
  open, 
  setOpen 
}: { 
  transaction: any, 
  open: boolean, 
  setOpen: (o: boolean) => void 
}) {
  const [isVoiding, setIsVoiding] = useState(false)
  const [reason, setReason] = useState('')
  const router = useRouter()

  const handleVoid = async () => {
    if (!reason) return toast.error("Alasan pembatalan wajib diisi")
    
    setIsVoiding(true)
    try {
      const res = await fetch(`/api/transactions/void`, {
        method: 'POST',
        body: JSON.stringify({ id: transaction.id, reason })
      })

      if (res.ok) {
        toast.success("Transaksi berhasil dibatalkan & Stok dikembalikan")
        setOpen(false)
        router.refresh()
      } else {
        throw new Error("Gagal membatalkan transaksi")
      }
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsVoiding(false)
    }
  }

  if (!transaction) return null

  const isAlreadyVoid = transaction.status === 'void'

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px] rounded-[2rem]">
        
        {/* HEADER */}
        <DialogHeader className="border-b pb-4">
          <div className="flex justify-between items-center pr-6">
            <DialogTitle className="flex items-center gap-2">
              <ReceiptText className="h-5 w-5 text-blue-600" />
              Nota #{transaction.id.split('-')[0].toUpperCase()}
            </DialogTitle>

            {/* STATUS BADGE */}
            <Badge
              className={
                isAlreadyVoid
                  ? "bg-red-100 text-red-700 border-red-200 rounded-full flex items-center gap-1"
                  : "bg-green-100 text-green-700 border-green-200 rounded-full flex items-center gap-1"
              }
            >
              {isAlreadyVoid ? (
                <>
                  <XCircle className="w-3 h-3" /> Dibatalkan
                </>
              ) : (
                <>
                  <CheckCircle className="w-3 h-3" /> Berhasil
                </>
              )}
            </Badge>
          </div>
        </DialogHeader>

        {/* INFO */}
        <div className="grid grid-cols-2 gap-4 py-4 text-xs">
          <div className="space-y-1">
            <p className="text-slate-500 font-bold uppercase">Waktu</p>
            <p className="font-medium text-slate-900">
              {new Date(transaction.created_at).toLocaleString('id-ID')}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-slate-500 font-bold uppercase">Pembayaran</p>
            <p className="font-bold text-blue-600">
              {transaction.payment_method}
            </p>
          </div>
        </div>

        {/* VOID REASON */}
        {isAlreadyVoid && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl">
            <p className="text-[10px] text-red-600 font-bold uppercase">
              Alasan Pembatalan:
            </p>
            <p className="text-sm text-red-700 italic">
              "{transaction.void_reason}"
            </p>
          </div>
        )}

        {/* ITEMS TABLE */}
        <div className="rounded-2xl border overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="text-[10px] uppercase font-bold">
                  Item
                </TableHead>
                <TableHead className="text-center text-[10px] uppercase font-bold">
                  Qty
                </TableHead>
                <TableHead className="text-right text-[10px] uppercase font-bold">
                  Total
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transaction.transaction_items.map((item: any, idx: number) => (
                <TableRow key={idx}>
                  <TableCell className="text-sm font-medium">
                    {item.products?.name}
                  </TableCell>
                  <TableCell className="text-center text-sm">
                    {item.quantity}x
                  </TableCell>
                  <TableCell className="text-right text-sm font-bold">
                    Rp {Number(item.subtotal).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* TOTAL */}
        <div className="mt-4 p-4 bg-slate-900 text-white rounded-2xl">
          <div className="flex justify-between text-lg font-black">
            <span>Total Bayar</span>
            <span className="text-blue-400">
              Rp {Number(transaction.total_amount).toLocaleString()}
            </span>
          </div>
        </div>

        {/* VOID BUTTON */}
        {!isAlreadyVoid && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full mt-4 text-red-500 hover:bg-red-50 hover:text-red-600 gap-2"
              >
                <Ban className="w-4 h-4" /> Batalkan Transaksi Ini
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-3xl">
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Konfirmasi Pembatalan
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Stok barang akan dikembalikan otomatis. Transaksi yang dibatalkan tidak akan masuk dalam laporan pendapatan.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className="py-4">
                <Input 
                  placeholder="Contoh: Salah input barang / Pelanggan tidak jadi beli" 
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="rounded-xl"
                />
              </div>

              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-xl">
                  Kembali
                </AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleVoid} 
                  className="bg-red-600 hover:bg-red-700 rounded-xl"
                  disabled={isVoiding}
                >
                  {isVoiding ? (
                    <Loader2 className="animate-spin w-4 h-4" />
                  ) : (
                    "Ya, Batalkan Nota"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

      </DialogContent>
    </Dialog>
  )
}