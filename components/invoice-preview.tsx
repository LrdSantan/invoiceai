'use client'

import { FileText } from 'lucide-react'
import type { InvoiceData } from '@/lib/invoice-types'
import { computeTotals, lineTotal, formatCurrency } from '@/lib/invoice-types'

const COMPANY = {
  name: 'Northwind Studio',
  email: 'hello@northwind.studio',
  address: '500 Market Street, San Francisco, CA',
}

function formatDate(value: string): string {
  if (!value) return '—'
  const d = new Date(value + 'T00:00:00')
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function InvoicePreview({ data }: { data: InvoiceData }) {
  const { subtotal, tax, total } = computeTotals(data)
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <div
      id="invoice-preview"
      className="rounded-xl bg-white p-8 text-zinc-900 shadow-2xl shadow-black/40 ring-1 ring-black/5"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-900 text-white">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-base font-semibold leading-tight">
              {COMPANY.name}
            </p>
            <p className="text-xs text-zinc-500">{COMPANY.email}</p>
            <p className="text-xs text-zinc-500">{COMPANY.address}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold tracking-tight text-zinc-900">
            INVOICE
          </p>
          <p className="mt-1 text-sm font-medium text-zinc-700">
            {data.invoiceNumber || '—'}
          </p>
        </div>
      </div>

      <div className="my-6 h-px bg-zinc-200" />

      {/* Bill to + dates */}
      <div className="flex justify-between gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Bill To
          </p>
          <p className="mt-1.5 text-sm font-medium text-zinc-900">
            {data.clientName || 'Client name'}
          </p>
          <p className="text-sm text-zinc-500">
            {data.clientEmail || 'client@email.com'}
          </p>
        </div>
        <div className="text-right text-sm">
          <div className="flex justify-between gap-8">
            <span className="text-zinc-400">Issued</span>
            <span className="font-medium text-zinc-700">{today}</span>
          </div>
          <div className="mt-1 flex justify-between gap-8">
            <span className="text-zinc-400">Due</span>
            <span className="font-medium text-zinc-700">
              {formatDate(data.dueDate)}
            </span>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="mt-6">
        <div className="grid grid-cols-[1fr_48px_88px_88px] gap-2 border-b border-zinc-200 pb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
          <span>Description</span>
          <span className="text-center">Qty</span>
          <span className="text-right">Rate</span>
          <span className="text-right">Amount</span>
        </div>
        <div className="divide-y divide-zinc-100">
          {data.items.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[1fr_48px_88px_88px] gap-2 py-2.5 text-sm"
            >
              <span className="text-zinc-800">
                {item.description || (
                  <span className="text-zinc-300">Item description</span>
                )}
              </span>
              <span className="text-center tabular-nums text-zinc-600">
                {item.quantity}
              </span>
              <span className="text-right tabular-nums text-zinc-600">
                {formatCurrency(item.rate)}
              </span>
              <span className="text-right font-medium tabular-nums text-zinc-900">
                {formatCurrency(lineTotal(item))}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="mt-4 flex justify-end">
        <div className="w-full max-w-[240px] space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-zinc-500">Subtotal</span>
            <span className="tabular-nums text-zinc-800">
              {formatCurrency(subtotal)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">
              Tax ({Number(data.taxRate) || 0}%)
            </span>
            <span className="tabular-nums text-zinc-800">
              {formatCurrency(tax)}
            </span>
          </div>
          <div className="mt-2 flex justify-between border-t border-zinc-200 pt-2.5">
            <span className="font-semibold text-zinc-900">Total</span>
            <span className="text-base font-bold tabular-nums text-zinc-900">
              {formatCurrency(total)}
            </span>
          </div>
        </div>
      </div>

      {data.notes && (
        <div className="mt-8 border-t border-zinc-100 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Notes
          </p>
          <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-zinc-600">
            {data.notes}
          </p>
        </div>
      )}
    </div>
  )
}
