'use client'

import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts'

interface ChartProps {
  data: { name: string; total: number }[]
}

export function SalesChart({ data }: ChartProps) {
  // 1. Fungsi pemformat angka untuk Sumbu Y
  const formatYAxis = (value: number) => {
    if (value >= 1000000) {
      return `Rp ${(value / 1000000).toFixed(1)}jt`
    } else if (value >= 1000) {
      return `Rp ${Math.floor(value / 1000)}rb`
    } else if (value === 0) {
      return "Rp 0"
    }
    return `Rp ${value}`
  }

  // 2. Fungsi pemformat angka untuk Tooltip (Menerima 'any' untuk keamanan TypeScript)
  const formatTooltipValue = (value: any) => {
    // Jaring pengaman: Jika nilai kosong atau bukan angka, kembalikan Rp 0
    const numericValue = Number(value) || 0;
    
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(numericValue)
  }

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="name" 
            stroke="#94a3b8" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            dy={10}
          />
          <YAxis 
            stroke="#94a3b8" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={formatYAxis}
            width={80}
          />
          <Tooltip 
            // PERBAIKAN: Menggunakan fungsi tunggal dan menangani kembalian dengan benar
            formatter={(value: any) => [formatTooltipValue(value), "Penjualan"]}
            contentStyle={{ 
              borderRadius: '12px', 
              border: 'none', 
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
              padding: '12px'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="total" 
            stroke="#2563eb" 
            strokeWidth={3} 
            dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 6, strokeWidth: 0, fill: '#2563eb' }}
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}