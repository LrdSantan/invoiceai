'use client'

import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { InvoiceData, LineItem } from '@/lib/invoice-types'
import { emptyItem, lineTotal, formatCurrency } from '@/lib/invoice-types'

export function InvoiceForm({
  data,
  onChange,
}: {
  data: InvoiceData
  onChange: (patch: Partial<InvoiceData>) => void
}) {
  function updateItem(id: string, patch: Partial<LineItem>) {
    onChange({
      items: data.items.map((it) => (it.id === id ? { ...it, ...patch } : it)),
    })
  }

  function addItem() {
    onChange({ items: [...data.items, emptyItem()] })
  }

  function removeItem(id: string) {
    onChange({ items: data.items.filter((it) => it.id !== id) })
  }

  return (
    <div className="space-y-6">
      {/* Client + invoice meta */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="clientName">Client Name</Label>
          <Input
            id="clientName"
            value={data.clientName}
            onChange={(e) => onChange({ clientName: e.target.value })}
            placeholder="Acme Corporation"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="clientEmail">Client Email</Label>
          <Input
            id="clientEmail"
            type="email"
            value={data.clientEmail}
            onChange={(e) => onChange({ clientEmail: e.target.value })}
            placeholder="billing@acme.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="invoiceNumber">Invoice Number</Label>
          <Input
            id="invoiceNumber"
            value={data.invoiceNumber}
            onChange={(e) => onChange({ invoiceNumber: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date</Label>
          <Input
            id="dueDate"
            type="date"
            value={data.dueDate}
            onChange={(e) => onChange({ dueDate: e.target.value })}
          />
        </div>
      </div>

      {/* Line items */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Line Items</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addItem}
            className="h-8 gap-1.5 bg-transparent"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Item
          </Button>
        </div>

        <div className="overflow-hidden rounded-lg border border-border">
          <div className="grid grid-cols-[1fr_64px_88px_88px_36px] items-center gap-2 border-b border-border bg-secondary/40 px-3 py-2 text-xs font-medium text-muted-foreground">
            <span>Description</span>
            <span className="text-center">Qty</span>
            <span className="text-right">Rate</span>
            <span className="text-right">Amount</span>
            <span className="sr-only">Remove</span>
          </div>

          <div className="divide-y divide-border">
            {data.items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-[1fr_64px_88px_88px_36px] items-center gap-2 px-3 py-2"
              >
                <Input
                  value={item.description}
                  onChange={(e) =>
                    updateItem(item.id, { description: e.target.value })
                  }
                  placeholder="Service or product"
                  className="h-9 border-0 bg-transparent px-1.5 shadow-none focus-visible:bg-background"
                />
                <Input
                  type="number"
                  min={0}
                  value={item.quantity}
                  onChange={(e) =>
                    updateItem(item.id, { quantity: Number(e.target.value) })
                  }
                  className="h-9 border-0 bg-transparent px-1 text-center shadow-none focus-visible:bg-background"
                />
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={item.rate}
                  onChange={(e) =>
                    updateItem(item.id, { rate: Number(e.target.value) })
                  }
                  className="h-9 border-0 bg-transparent px-1 text-right shadow-none focus-visible:bg-background"
                />
                <span className="text-right text-sm tabular-nums text-foreground">
                  {formatCurrency(lineTotal(item))}
                </span>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  disabled={data.items.length === 1}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
                  aria-label="Remove item"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Label htmlFor="taxRate" className="text-muted-foreground">
            Tax Rate (%)
          </Label>
          <Input
            id="taxRate"
            type="number"
            min={0}
            step="0.1"
            value={data.taxRate}
            onChange={(e) => onChange({ taxRate: Number(e.target.value) })}
            className="h-9 w-24 text-right"
          />
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={data.notes}
          onChange={(e) => onChange({ notes: e.target.value })}
          rows={3}
          placeholder="Payment terms, thank-you note, etc."
          className="resize-none"
        />
      </div>
    </div>
  )
}
