'use client'

import { useEffect } from 'react'

export function PWARegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => console.log('SW Registered:', reg.scope))
        .catch((err) => console.error('SW Registration Failed:', err))
    }
  }, [])

  return null // Komponen ini tidak merender apa-apa
}