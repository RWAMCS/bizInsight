'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  { q: "Apakah saya harus paham teknologi?", a: "Tidak. BizInsight dirancang sederhana dan mudah digunakan bahkan untuk pemula yang belum pernah menggunakan aplikasi kasir sebelumnya." },
  { q: "Apakah bisa digunakan di HP?", a: "Bisa. BizInsight sepenuhnya mobile-friendly dan bisa di-install ke layar utama HP Anda seperti aplikasi asli (PWA)." },
  { q: "Apakah data saya aman?", a: "Sangat aman. Kami menggunakan enkripsi standar industri dan server Supabase yang terpercaya untuk melindungi setiap data transaksi Anda." },
  { q: "Apakah bisa import data dari Excel lama?", a: "Tentu. Fitur Smart Importer kami bisa membaca berbagai format Excel Anda dan mencocokkan kolomnya secara otomatis." }
]

export function FAQ() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Pertanyaan Umum</h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-b border-slate-100 py-2">
              <AccordionTrigger className="text-left font-semibold hover:text-blue-600 transition-colors">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}