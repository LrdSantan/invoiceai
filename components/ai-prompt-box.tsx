'use client'

import { useState } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { generateInvoiceFromText } from '@/app/actions/generate-invoice'
import type { InvoiceData, LineItem } from '@/lib/invoice-types'
import { emptyItem } from '@/lib/invoice-types'

const EXAMPLES = [
  '40 hours of web design at $95/hr for Acme Corp',
  'Logo package $1,200 and brand guidelines $800, 8.5% tax',
  'Monthly retainer $3,500 for Globex, due in 30 days',
]

export function AiPromptBox({
  onGenerated,
}: {
  onGenerated: (patch: Partial<InvoiceData>) => void
}) {
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleGenerate(text: string) {
    if (!text.trim() || loading) return
    setLoading(true)
    setError(null)

    const result = await generateInvoiceFromText(text)
    setLoading(false)

    if (!result.ok) {
      setError(result.error)
      return
    }

    const { data } = result
    const items: LineItem[] = (data.items ?? []).map((it) => ({
      ...emptyItem(),
      description: it.description ?? '',
      quantity: Number(it.quantity) || 1,
      rate: Number(it.rate) || 0,
    }))

    const patch: Partial<InvoiceData> = {}
    if (data.clientName) patch.clientName = data.clientName
    if (data.clientEmail) patch.clientEmail = data.clientEmail
    if (data.notes) patch.notes = data.notes
    if (typeof data.taxRate === 'number') patch.taxRate = data.taxRate
    if (items.length) patch.items = items

    onGenerated(patch)
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">Generate with AI</span>
      </div>

      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Describe what you want to invoice..."
        rows={3}
        className="resize-none bg-background"
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            handleGenerate(value)
          }
        }}
      />

      <div className="mt-2 flex flex-wrap gap-1.5">
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => setValue(ex)}
            className="rounded-full border border-border bg-secondary/50 px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            {ex}
          </button>
        ))}
      </div>

      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}

      <Button
        onClick={() => handleGenerate(value)}
        disabled={loading || !value.trim()}
        className="mt-3 w-full gap-2 font-medium"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            Generate
          </>
        )}
      </Button>
    </div>
  )
}
