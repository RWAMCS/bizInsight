'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { getCookie } from 'cookies-next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from 'sonner'
import { Loader2, CheckCircle2, X, UploadCloud, ArrowLeftRight } from 'lucide-react'
import * as XLSX from 'xlsx'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { SmartMapper } from '@/components/shared/smart-mapper'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

const PRODUCT_FIELDS = [
  { key: 'name', label: 'Nama Produk' },
  { key: 'category', label: 'Kategori' },
  { key: 'purchase_price', label: 'Harga Beli' },
  { key: 'selling_price', label: 'Harga Jual' },
  { key: 'stock_quantity', label: 'Stok Saat Ini' }
]

const TRANSACTION_FIELDS = [
  { key: 'total_amount', label: 'Total Bayar' },
  { key: 'total_profit', label: 'Total Untung' },
  { key: 'created_at', label: 'Tanggal (YYYY-MM-DD)' }
]

export default function ImportPage() {
  const [type, setType] = useState<'products' | 'transactions'>('products')
  const [data, setData] = useState<any[]>([])
  const [rawHeaders, setRawHeaders] = useState<string[]>([])
  const [rawRows, setRawRows] = useState<any[]>([])
  const [showMapper, setShowMapper] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const businessId = getCookie('active_business_id') as string

  const processFile = (file: File) => {
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast.error("Hanya file Excel (.xlsx atau .xls) yang diizinkan")
      return
    }

    setFileName(file.name)

    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result
        const wb = XLSX.read(bstr, { type: 'binary' })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const json = XLSX.utils.sheet_to_json(ws)

        if (json.length > 0) {
          setRawHeaders(Object.keys(json[0] as object))
          setRawRows(json)
          setShowMapper(true)
          toast.success(`${json.length} baris berhasil dibaca!`)
        } else {
          toast.error("File Excel kosong")
        }
      } catch (err) {
        toast.error("Gagal membaca file")
      }
    }

    reader.readAsBinaryString(file)
  }

  const finalizeMapping = (mapping: Record<string, string>) => {
    const final = rawRows.map(row => {
      const obj: any = { business_id: businessId }

      if (type === 'products') {
        obj.name = row[mapping['name']] || 'Tanpa Nama'
        obj.category = row[mapping['category']] || 'Umum'
        obj.purchase_price = Number(row[mapping['purchase_price']] || 0)
        obj.selling_price = Number(row[mapping['selling_price']] || 0)
        obj.stock_quantity = Number(row[mapping['stock_quantity']] || 0)
        obj.min_stock_level = 5
      } else {
        obj.total_amount = Number(row[mapping['total_amount']] || 0)
        obj.total_profit = Number(row[mapping['total_profit']] || 0)
        obj.created_at = row[mapping['created_at']] || new Date().toISOString().split('T')[0]
      }

      return obj
    })

    setData(final)
    setShowMapper(false)
    toast.success("Pemetaan berhasil!")
  }

  const handleImport = async () => {
    if (data.length === 0) return

    setLoading(true)
    const endpoint = type === 'products'
      ? '/api/products/bulk'
      : '/api/transactions/bulk'

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify({ [type]: data })
      })

      if (response.ok) {
        toast.success(`Import ${type} Berhasil!`)
        router.push(type === 'products' ? '/products' : '/transactions')
      } else {
        throw new Error("Gagal menyimpan data")
      }
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const resetFile = () => {
    setData([])
    setRawRows([])
    setRawHeaders([])
    setFileName(null)
    setShowMapper(false)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">

      {/* HEADER RESPONSIVE */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">
            Smart Importer
          </h2>
          <p className="text-sm text-slate-500">
            Upload file Excel untuk import data secara masal.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Tabs
            value={type}
            onValueChange={(v) => {
              setType(v as 'products' | 'transactions')
              resetFile()
            }}
            className="w-full md:w-[300px]"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="products" className="text-xs">
                Produk
              </TabsTrigger>
              <TabsTrigger value="transactions" className="text-xs">
                Transaksi
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {(data.length > 0 || showMapper) && (
            <Button
              variant="ghost"
              size="icon"
              onClick={resetFile}
              className="text-red-500 shrink-0"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      {/* DROPZONE RESPONSIVE */}
      {!showMapper && data.length === 0 && (
        <motion.div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setIsDragging(false)
            const file = e.dataTransfer.files?.[0]
            if (file) processFile(file)
          }}
          whileHover={{ scale: 1.01 }}
          className={cn(
            "relative cursor-pointer rounded-3xl border-2 border-dashed p-8 md:p-16 text-center transition-all",
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-slate-300 bg-white hover:border-blue-400"
          )}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) processFile(file)
            }}
            accept=".xlsx, .xls"
            className="hidden"
          />

          <UploadCloud className="h-10 w-10 mx-auto text-blue-500 mb-4" />
          <p className="text-lg md:text-xl font-semibold">
            {fileName
              ? fileName
              : `Klik atau Tarik File Excel ${type === 'products' ? 'Produk' : 'Transaksi'}`}
          </p>
          <p className="text-xs text-slate-400 mt-2">
            Mendukung format .xlsx atau .xls
          </p>

          <AnimatePresence>
            {isDragging && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-blue-500/10 rounded-3xl border-4 border-blue-500 animate-pulse"
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* SMART MAPPER */}
      {showMapper && (
        <Card className="rounded-3xl border-none shadow-lg ring-1 ring-slate-200">
          <CardHeader className="border-b px-6 py-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <ArrowLeftRight className="h-5 w-5 text-blue-500" />
              Mapping Kolom
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <SmartMapper
              headers={rawHeaders}
              targetFields={type === 'products'
                ? PRODUCT_FIELDS
                : TRANSACTION_FIELDS}
              onMappingComplete={finalizeMapping}
            />
          </CardContent>
        </Card>
      )}

      {/* PREVIEW */}
      {data.length > 0 && !showMapper && (
        <Card className="rounded-3xl shadow-lg ring-1 ring-slate-200 overflow-hidden">
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-50 px-6 py-4">
            <CardTitle className="text-sm md:text-lg flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-green-500" />
              {data.length} data siap diimport
            </CardTitle>

            <Button
              onClick={handleImport}
              disabled={loading}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700"
            >
              {loading && (
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
              )}
              Konfirmasi Import
            </Button>
          </CardHeader>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs pl-6">
                    ITEM / TANGGAL
                  </TableHead>
                  <TableHead className="text-xs text-right pr-6">
                    NILAI
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.slice(0, 10).map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="text-xs pl-6 font-medium">
                      {item.name || item.created_at}
                    </TableCell>
                    <TableCell className="text-xs text-right pr-6 font-bold text-blue-600">
                      Rp {(item.selling_price || item.total_amount || 0).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
    </div>
  )
}