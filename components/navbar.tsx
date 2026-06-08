'use client'

import { FileText, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Navbar({ onNewInvoice }: { onNewInvoice: () => void }) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <FileText className="h-5 w-5" strokeWidth={2.25} />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            Invoice
            <span className="text-primary">AI</span>
          </span>
        </div>

        <Button onClick={onNewInvoice} className="gap-2 font-medium">
          <Plus className="h-4 w-4" />
          New Invoice
        </Button>
      </div>
    </header>
  )
}
