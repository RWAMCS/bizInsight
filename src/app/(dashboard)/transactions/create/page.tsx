'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCookie } from 'cookies-next'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'
import { ShoppingCart, Trash2, Plus, Minus, CheckCircle } from 'lucide-react'

export default function CreateTransactionPage() {
  const [products, setProducts] = useState<any[]>([])
  const [cart, setCart] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // 🔥 PAYMENT STATE
  const [paymentMethod, setPaymentMethod] = useState('Tunai')
  const [paymentDetail, setPaymentDetail] = useState('')

  const router = useRouter()
  const businessId = getCookie('active_business_id') as string

  useEffect(() => {
    const fetchProducts = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('business_id', businessId)
        .gt('stock_quantity', 0)

      if (data) setProducts(data)
    }

    if (businessId) fetchProducts()
  }, [businessId])

  const addToCart = (product: any) => {
    const existing = cart.find(item => item.id === product.id)

    if (existing) {
      if (existing.quantity >= product.stock_quantity) {
        toast.error("Stok tidak mencukupi")
        return
      }

      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
  }

  const updateQuantity = (id: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta
        const product = products.find(p => p.id === id)
        if (!product) return item

        if (newQty > product.stock_quantity) {
          toast.error("Melebihi stok")
          return item
        }

        return newQty > 0 ? { ...item, quantity: newQty } : item
      }
      return item
    }))
  }

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id))
  }

  const totalAmount = cart.reduce(
    (sum, item) => sum + (item.selling_price * item.quantity),
    0
  )

  const totalProfit = cart.reduce(
    (sum, item) =>
      sum + ((item.selling_price - item.purchase_price) * item.quantity),
    0
  )

  const handleCheckout = async () => {
    if (cart.length === 0) return

    if ((paymentMethod === 'Transfer' || paymentMethod === 'E-Wallet') && !paymentDetail) {
      toast.error("Pilih detail pembayaran terlebih dahulu")
      return
    }

    setLoading(true)

    const finalPayment =
      paymentMethod === 'Transfer' || paymentMethod === 'E-Wallet'
        ? `${paymentMethod} - ${paymentDetail}`
        : paymentMethod

    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_id: businessId,
          total_amount: totalAmount,
          total_profit: totalProfit,
          payment_method: finalPayment,
          items: cart
        })
      })

      if (response.ok) {
        toast.success("Transaksi Berhasil!")
        router.push('/transactions')
        router.refresh()
      } else {
        throw new Error("Gagal menyimpan transaksi")
      }
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* LEFT */}
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Pilih Produk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {products.map(product => (
                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="p-4 border rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                >
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Stok: {product.stock_quantity}
                  </p>
                  <p className="mt-2 font-bold text-blue-600">
                    Rp {product.selling_price.toLocaleString()}
                  </p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* RIGHT */}
      <div>
        <Card className="sticky top-20">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" /> Keranjang
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            <ScrollArea className="h-[350px] p-4">
              {cart.length === 0 && (
                <p className="text-center text-muted-foreground mt-10">
                  Keranjang kosong
                </p>
              )}

              {cart.map(item => (
                <div key={item.id} className="flex justify-between mb-4 border-b pb-4">
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Rp {item.selling_price.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item.id, -1)}>
                      <Minus className="h-3 w-3" />
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)}>
                      <Plus className="h-3 w-3" />
                    </button>
                    <button onClick={() => removeFromCart(item.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </ScrollArea>

            <div className="p-6 bg-slate-50 space-y-4">

              {/* PAYMENT METHOD */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-500">
                  Metode Pembayaran
                </label>

                <div className="grid grid-cols-2 gap-2">
                  {['Tunai', 'QRIS', 'Transfer', 'E-Wallet'].map(m => (
                    <Button
                      key={m}
                      type="button"
                      variant={paymentMethod === m ? 'default' : 'outline'}
                      onClick={() => {
                        setPaymentMethod(m)
                        setPaymentDetail('')
                      }}
                      className="h-9 text-xs"
                    >
                      {m}
                    </Button>
                  ))}
                </div>
              </div>

              {/* TRANSFER OPTIONS */}
              {paymentMethod === 'Transfer' && (
                <div className="grid grid-cols-2 gap-2">
                  {['BRI', 'BCA', 'Mandiri', 'BNI'].map(bank => (
                    <Button
                      key={bank}
                      type="button"
                      variant={paymentDetail === bank ? 'default' : 'outline'}
                      onClick={() => setPaymentDetail(bank)}
                      className="h-8 text-xs"
                    >
                      {bank}
                    </Button>
                  ))}
                </div>
              )}

              {/* E-WALLET OPTIONS */}
              {paymentMethod === 'E-Wallet' && (
                <div className="grid grid-cols-2 gap-2">
                  {['OVO', 'DANA', 'GoPay', 'ShopeePay'].map(wallet => (
                    <Button
                      key={wallet}
                      type="button"
                      variant={paymentDetail === wallet ? 'default' : 'outline'}
                      onClick={() => setPaymentDetail(wallet)}
                      className="h-8 text-xs"
                    >
                      {wallet}
                    </Button>
                  ))}
                </div>
              )}

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-blue-600">
                  Rp {totalAmount.toLocaleString()}
                </span>
              </div>

              <Button
                className="w-full h-12"
                disabled={cart.length === 0 || loading}
                onClick={handleCheckout}
              >
                {loading ? "Memproses..." : "Bayar Sekarang"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}