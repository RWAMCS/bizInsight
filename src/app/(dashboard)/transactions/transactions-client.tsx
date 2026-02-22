'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { PlusCircle, Download } from 'lucide-react'
import { TransactionDetail } from './transaction-detail'
import { formatRupiah } from '@/lib/format'

export default function TransactionsClient({ transactions }: any) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  // 🔥 STATE UNTUK MODAL DETAIL
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null)
  const [openDetail, setOpenDetail] = useState(false)

  const safeTransactions = Array.isArray(transactions)
    ? transactions
    : []

  const filteredTransactions = useMemo(() => {
    const now = new Date()

    return safeTransactions.filter((trx: any) => {
      const trxDate = new Date(trx.created_at)

      const matchSearch =
        trx.id?.toLowerCase().includes(search.toLowerCase())

      let matchFilter = true

      if (filter === 'today') {
        matchFilter =
          trxDate.toDateString() === now.toDateString()
      }

      if (filter === 'week') {
        const weekAgo = new Date()
        weekAgo.setDate(now.getDate() - 7)
        matchFilter = trxDate >= weekAgo
      }

      if (filter === 'month') {
        matchFilter =
          trxDate.getMonth() === now.getMonth() &&
          trxDate.getFullYear() === now.getFullYear()
      }

      return matchSearch && matchFilter
    })
  }, [safeTransactions, search, filter])

  const totalOmzet = filteredTransactions.reduce(
    (sum: number, trx: any) =>
      trx.status === 'void'
        ? sum
        : sum + Number(trx.total_amount || 0),
    0
  )

  const totalProfit = filteredTransactions.reduce(
    (sum: number, trx: any) =>
      trx.status === 'void'
        ? sum
        : sum + Number(trx.total_profit || 0),
    0
  )

  const exportCSV = () => {
    const header = ['ID', 'Tanggal', 'Metode', 'Total', 'Status']

    const rows = filteredTransactions.map((trx: any) => [
      trx.id,
      trx.created_at,
      trx.payment_method,
      trx.total_amount,
      trx.status,
    ])

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [header, ...rows].map((e) => e.join(',')).join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'transactions.csv')
    document.body.appendChild(link)
    link.click()
  }

  const openTransactionDetail = (trx: any) => {
    setSelectedTransaction(trx)
    setOpenDetail(true)
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">
            Riwayat Transaksi
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            Dashboard penjualan lengkap.
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>

          <Link href="/transactions/create">
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
              <PlusCircle className="h-4 w-4" />
              Tambah
            </Button>
          </Link>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl border bg-white">
          <p className="text-sm text-muted-foreground">Total Omzet</p>
          <p className="text-xl md:text-2xl font-bold text-blue-600">
            Rp {formatRupiah(totalOmzet)}
          </p>
        </div>

        <div className="p-5 rounded-xl border bg-white">
          <p className="text-sm text-muted-foreground">Total Profit</p>
          <p className="text-xl md:text-2xl font-bold text-green-600">
            Rp {formatRupiah(totalProfit)}
          </p>
        </div>

        <div className="p-5 rounded-xl border bg-white">
          <p className="text-sm text-muted-foreground">
            Jumlah Transaksi
          </p>
          <p className="text-xl md:text-2xl font-bold">
            {filteredTransactions.length}
          </p>
        </div>
      </div>

      {/* FILTER */}
      <div className="flex flex-wrap gap-2">
        {['all', 'today', 'week', 'month'].map((f) => (
          <Button
            key={f}
            variant={filter === f ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(f)}
          >
            {f.toUpperCase()}
          </Button>
        ))}

        <Input
          placeholder="Cari ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:max-w-xs md:ml-auto"
        />
      </div>

      {/* ===== MOBILE VIEW ===== */}
      <div className="md:hidden space-y-3">
        {filteredTransactions.map((trx: any) => {
          const isVoid = trx.status === 'void'

          return (
            <div
              key={trx.id}
              className={`bg-white rounded-xl border p-4 shadow-sm ${isVoid ? "opacity-60" : ""}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-slate-500 font-mono">
                    #{trx.id?.split('-')[0].toUpperCase()}
                  </p>
                  <p className={`text-sm ${isVoid ? "line-through" : ""}`}>
                    {trx.transaction_items?.[0]?.products?.name || 'Produk'}
                  </p>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openTransactionDetail(trx)}
                >
                  Detail
                </Button>
              </div>

              <div className="mt-3 text-lg font-bold text-right">
                Rp {formatRupiah(Number(trx.total_amount))}
              </div>

              {isVoid && (
                <Badge variant="destructive" className="mt-2 text-[10px] rounded-full">
                  VOID
                </Badge>
              )}
            </div>
          )
        })}
      </div>

      {/* ===== DESKTOP VIEW ===== */}
      <div className="hidden md:block rounded-xl border bg-white overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Nota</TableHead>
              <TableHead>Produk</TableHead>
              <TableHead>Metode</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredTransactions.map((trx: any) => {
              const isVoid = trx.status === 'void'

              return (
                <TableRow
                  key={trx.id}
                  className={isVoid ? "opacity-60 bg-slate-50" : ""}
                >
                  <TableCell className="font-mono text-xs">
                    #{trx.id?.split('-')[0].toUpperCase()}
                  </TableCell>

                  <TableCell>
                    <span className={isVoid ? "line-through" : ""}>
                      {trx.transaction_items?.[0]?.products?.name || 'Produk'}
                      {trx.transaction_items?.length > 1 &&
                        ` +${trx.transaction_items.length - 1} lainnya`}
                    </span>
                  </TableCell>

                  <TableCell>
                    {isVoid ? (
                      <Badge variant="destructive" className="rounded-full text-[10px]">
                        VOID
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="rounded-full text-[10px]">
                        {trx.payment_method}
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell
                    className={`text-right font-bold ${isVoid ? "line-through text-slate-400" : ""}`}
                  >
                    Rp {formatRupiah(Number(trx.total_amount))}
                  </TableCell>

                  <TableCell className="text-center">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openTransactionDetail(trx)}
                    >
                      Detail
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* 🔥 GLOBAL MODAL DETAIL */}
      {selectedTransaction && (
        <TransactionDetail
          transaction={selectedTransaction}
          open={openDetail}
          setOpen={setOpenDetail}
        />
      )}

    </div>
  )
}