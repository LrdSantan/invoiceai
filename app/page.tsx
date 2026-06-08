'use client'

import { useEffect, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { AiPromptBox } from '@/components/ai-prompt-box'
import { InvoiceForm } from '@/components/invoice-form'
import { InvoicePreview } from '@/components/invoice-preview'
import { InvoiceActions } from '@/components/invoice-actions'
import type { InvoiceData } from '@/lib/invoice-types'
import { defaultInvoice, freshInvoice } from '@/lib/invoice-types'

export default function Page() {
  const [data, setData] = useState<InvoiceData>(defaultInvoice)

  // Seed a unique invoice number + due date on the client to avoid SSR
  // hydration mismatches from Math.random() / Date.
  useEffect(() => {
    setData(freshInvoice())
  }, [])

  function patch(p: Partial<InvoiceData>) {
    setData((prev) => ({ ...prev, ...p }))
  }

  function newInvoice() {
    setData(freshInvoice())
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="print:hidden">
        <Navbar onNewInvoice={newInvoice} />
      </div>

      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-6 p-4 md:p-6 lg:grid-cols-2">
        {/* Left: editor */}
        <section className="space-y-5 print:hidden">
          <AiPromptBox onGenerated={patch} />
          <div className="rounded-xl border border-border bg-card p-5">
            <InvoiceForm data={data} onChange={patch} />
          </div>
        </section>

        {/* Right: live preview */}
        <section className="space-y-4 lg:sticky lg:top-22 lg:self-start">
          <div id="invoice-print-area">
            <InvoicePreview data={data} />
          </div>
          <div className="print:hidden">
            <InvoiceActions data={data} />
          </div>
        </section>
      </main>
    </div>
  )
}
