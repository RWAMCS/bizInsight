import { getProducts } from '@/services/productService'
import { getActiveBusinessId } from '@/app/auth/business-actions'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { redirect } from 'next/navigation'
import { AddProductModal } from './add-product-modal'
import { ProductActions } from './product-actions'
import { Package, Tag, ArrowUpRight, ArrowDownRight, Box } from 'lucide-react'

export default async function ProductsPage() {
  const activeBusinessId = await getActiveBusinessId()

  if (!activeBusinessId) {
    redirect('/dashboard')
  }

  const products = await getProducts(activeBusinessId)

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">
            Produk
          </h2>
          <p className="text-sm text-slate-500">
            Kelola stok dan harga jual produk Anda.
          </p>
        </div>
        <AddProductModal businessId={activeBusinessId} />
      </div>

      {/* ================= DESKTOP ================= */}
      <div className="hidden md:block rounded-3xl border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="pl-6">Nama Produk</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead className="text-right">Harga Beli</TableHead>
              <TableHead className="text-right text-blue-600">Harga Jual</TableHead>
              <TableHead className="text-center">Stok</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center pr-6">Aksi</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-40 text-center text-slate-400 italic">
                  Belum ada produk terdaftar.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow 
                  key={product.id} 
                  className="hover:bg-slate-50 transition-colors"
                >
                  <TableCell className="font-bold pl-6">
                    {product.name}
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline" className="font-normal">
                      {product.category || 'Umum'}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    Rp {product.purchase_price.toLocaleString()}
                  </TableCell>

                  <TableCell className="text-right font-bold text-blue-600">
                    Rp {product.selling_price.toLocaleString()}
                  </TableCell>

                  <TableCell className="text-center font-medium">
                    {product.stock_quantity}
                  </TableCell>

                  <TableCell className="text-center">
                    {product.stock_quantity <= product.min_stock_level ? (
                      <Badge variant="destructive" className="rounded-full">
                        Stok Tipis
                      </Badge>
                    ) : (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none rounded-full">
                        Tersedia
                      </Badge>
                    )}
                  </TableCell>

                  {/* ACTIONS */}
                  <TableCell className="text-center pr-6">
                    <div className="flex justify-center">
                      <ProductActions product={product} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* ================= MOBILE ================= */}
      <div className="md:hidden space-y-4">
        {products.length === 0 ? (
          <div className="p-10 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200 text-slate-400">
            Belum ada produk.
          </div>
        ) : (
          products.map((product) => (
            <div 
              key={product.id} 
              className="bg-white p-5 rounded-3xl border shadow-sm space-y-4"
            >
              {/* HEADER MOBILE CARD */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                    <Package className="w-5 h-5" />
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900">
                      {product.name}
                    </h4>
                    <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {product.category || 'Umum'}
                    </span>
                  </div>
                </div>

                {/* BADGE + ACTIONS */}
                <div className="flex items-center gap-2">
                  {product.stock_quantity <= product.min_stock_level ? (
                    <Badge variant="destructive" className="text-[10px]">
                      Tipis
                    </Badge>
                  ) : (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none text-[10px]">
                      Aman
                    </Badge>
                  )}

                  <ProductActions product={product} />
                </div>
              </div>

              {/* PRICE SECTION */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-slate-50 p-3 rounded-2xl">
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1 flex items-center gap-1">
                    <ArrowDownRight className="w-3 h-3 text-red-500" />
                    Beli
                  </p>
                  <p className="font-bold text-sm">
                    Rp {product.purchase_price.toLocaleString()}
                  </p>
                </div>

                <div className="bg-blue-50 p-3 rounded-2xl">
                  <p className="text-[10px] text-blue-500 uppercase font-bold mb-1 flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3 text-blue-500" />
                    Jual
                  </p>
                  <p className="font-bold text-sm text-blue-700">
                    Rp {product.selling_price.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* STOCK */}
              <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <Box className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-600 font-medium">
                    Sisa Stok
                  </span>
                </div>

                <span className="font-black text-slate-900">
                  {product.stock_quantity} unit
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}