import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'BizInsight - Smart POS',
    short_name: 'BizInsight',
    description: 'Manajemen bisnis, stok, dan transaksi dalam satu genggaman',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2563eb', // Warna biru primer kita
    icons: [
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '192x192',
        type: 'image/png',
      },
    ],
  }
}