'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

/** * LOGO CLIENT UPDATE:
 * Menggunakan file client1.png sampai client6.png
 * Pastikan file berada di folder: public/clients/
 */
const CLIENT_LOGOS = [
  "/clients/client1.png",
  "/clients/client2.png",
  "/clients/client3.jpeg",
  "/clients/client4.jpeg",
  "/clients/client5.png",
  "/clients/client6.png",
]

export function LogoTicker() {
  return (
    <div className="py-12 border-y bg-white overflow-hidden relative">
      {/* Overlay Gradasi untuk efek halus di pinggir */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />

      <motion.div 
        className="flex gap-20 whitespace-nowrap items-center"
        animate={{ x: [0, -1000] }} // Mengatur jarak geser agar loop halus
        transition={{ 
          duration: 25, // Kecepatan ticker
          repeat: Infinity, 
          ease: "linear" 
        }}
      >
        {/* Duplikasi array agar animasi berjalan tanpa putus (infinite loop) */}
        {[...CLIENT_LOGOS, ...CLIENT_LOGOS, ...CLIENT_LOGOS].map((item, idx) => (
          <div key={idx} className="flex-shrink-0">
            <Image 
              src={item} 
              alt={`Client Logo ${idx + 1}`} 
              width={140} 
              height={50} 
              className="h-12 w-auto grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer object-contain"
            />
          </div>
        ))}
      </motion.div>
    </div>
  )
}