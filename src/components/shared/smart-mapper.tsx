'use client'

import { useState, useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Fuse from 'fuse.js'

interface SmartMapperProps {
  headers: string[]
  targetFields: { key: string; label: string }[]
  onMappingComplete: (mapping: Record<string, string>) => void
}

export function SmartMapper({ headers, targetFields, onMappingComplete }: SmartMapperProps) {
  const [mapping, setMapping] = useState<Record<string, string>>({})

  // Logika Tebak Otomatis (Smart Guessing) menggunakan Fuse.js
  useEffect(() => {
    const fuse = new Fuse(headers, { threshold: 0.4 })
    const initialMapping: Record<string, string> = {}

    targetFields.forEach(field => {
      const result = fuse.search(field.label)
      if (result.length > 0) {
        initialMapping[field.key] = result[0].item
      }
    })

    setMapping(initialMapping)
  }, [headers, targetFields])

  return (
    <Card className="p-6 border-blue-200 bg-blue-50/30">
      <h3 className="text-lg font-bold mb-4">Cocokkan Kolom Excel Anda</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {targetFields.map((field) => (
          <div key={field.key} className="space-y-2">
            <Label className="text-slate-600 uppercase text-[10px] font-bold tracking-wider">
              Field di Sistem: {field.label}
            </Label>
            <Select 
              value={mapping[field.key] || ""} 
              onValueChange={(val) => setMapping(prev => ({ ...prev, [field.key]: val }))}
            >
              <SelectTrigger className="bg-white border-blue-200">
                <SelectValue placeholder="Pilih kolom Excel..." />
              </SelectTrigger>
              <SelectContent>
                {headers.map(h => (
                  <SelectItem key={h} value={h}>{h}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
      <Button 
        className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white" 
        onClick={() => onMappingComplete(mapping)}
      >
        Terapkan Pemetaan & Preview Data
      </Button>
    </Card>
  )
}