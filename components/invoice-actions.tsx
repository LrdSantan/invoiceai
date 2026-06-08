'use client'

import { useState } from 'react'
import { Download, Link2, Check, Copy, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { InvoiceData } from '@/lib/invoice-types'
import { computeTotals, formatCurrency, lineTotal } from '@/lib/invoice-types'
import jsPDF from 'jspdf'
import { createPaystackPaymentLink } from '@/app/actions/create-payment-link'

export function InvoiceActions({ data }: { data: InvoiceData }) {
  const [generating, setGenerating] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [paymentLink, setPaymentLink] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const { subtotal, tax, total } = computeTotals(data)

  function handleDownloadPdf() {
    setDownloading(true)
    try {
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' })
      const W = pdf.internal.pageSize.getWidth()
      let y = 40

      // Header
      pdf.setFillColor(24, 24, 27)
      pdf.rect(40, y, 40, 40, 'F')
      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(10)
      pdf.text('INV', 48, y + 25)

      pdf.setTextColor(24, 24, 27)
      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Northwind Studio', 92, y + 12)
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(9)
      pdf.setTextColor(113, 113, 122)
      pdf.text('hello@northwind.studio', 92, y + 24)
      pdf.text('500 Market Street, San Francisco, CA', 92, y + 36)

      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(22)
      pdf.setTextColor(24, 24, 27)
      pdf.text('INVOICE', W - 40, y + 16, { align: 'right' })
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(113, 113, 122)
      pdf.text(data.invoiceNumber || '—', W - 40, y + 30, { align: 'right' })

      y += 60
      pdf.setDrawColor(228, 228, 231)
      pdf.line(40, y, W - 40, y)
      y += 20

      // Bill to + dates
      pdf.setFontSize(8)
      pdf.setTextColor(161, 161, 170)
      pdf.setFont('helvetica', 'bold')
      pdf.text('BILL TO', 40, y)
      y += 14
      pdf.setFontSize(10)
      pdf.setTextColor(24, 24, 27)
      pdf.text(data.clientName || 'Client name', 40, y)
      y += 13
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(113, 113, 122)
      pdf.text(data.clientEmail || 'client@email.com', 40, y)

      const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      const due = data.dueDate ? new Date(data.dueDate + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'
      pdf.setTextColor(161, 161, 170)
      pdf.text('Issued', W - 160, y - 13)
      pdf.setTextColor(24, 24, 27)
      pdf.text(today, W - 40, y - 13, { align: 'right' })
      pdf.setTextColor(161, 161, 170)
      pdf.text('Due', W - 160, y)
      pdf.setTextColor(24, 24, 27)
      pdf.text(due, W - 40, y, { align: 'right' })

      y += 24
      pdf.setDrawColor(228, 228, 231)
      pdf.line(40, y, W - 40, y)
      y += 16

      // Table header
      pdf.setFontSize(8)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(161, 161, 170)
      pdf.text('DESCRIPTION', 40, y)
      pdf.text('QTY', W - 200, y, { align: 'right' })
      pdf.text('RATE', W - 120, y, { align: 'right' })
      pdf.text('AMOUNT', W - 40, y, { align: 'right' })
      y += 8
      pdf.setDrawColor(228, 228, 231)
      pdf.line(40, y, W - 40, y)
      y += 14

      // Line items
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(10)
      data.items.forEach((item) => {
        pdf.setTextColor(24, 24, 27)
        pdf.text(item.description || 'Item', 40, y)
        pdf.setTextColor(113, 113, 122)
        pdf.text(String(item.quantity), W - 200, y, { align: 'right' })
        pdf.text(formatCurrency(item.rate), W - 120, y, { align: 'right' })
        pdf.setTextColor(24, 24, 27)
        pdf.setFont('helvetica', 'bold')
        pdf.text(formatCurrency(lineTotal(item)), W - 40, y, { align: 'right' })
        pdf.setFont('helvetica', 'normal')
        y += 18
        pdf.setDrawColor(244, 244, 245)
        pdf.line(40, y - 4, W - 40, y - 4)
      })

      y += 10

      // Totals
      pdf.setFontSize(9)
      pdf.setTextColor(113, 113, 122)
      pdf.text('Subtotal', W - 160, y)
      pdf.setTextColor(24, 24, 27)
      pdf.text(formatCurrency(subtotal), W - 40, y, { align: 'right' })
      y += 16
      pdf.setTextColor(113, 113, 122)
      pdf.text(`Tax (${Number(data.taxRate) || 0}%)`, W - 160, y)
      pdf.setTextColor(24, 24, 27)
      pdf.text(formatCurrency(tax), W - 40, y, { align: 'right' })
      y += 10
      pdf.setDrawColor(228, 228, 231)
      pdf.line(W - 180, y, W - 40, y)
      y += 14
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(11)
      pdf.setTextColor(24, 24, 27)
      pdf.text('Total', W - 160, y)
      pdf.text(formatCurrency(total), W - 40, y, { align: 'right' })

      // Notes
      if (data.notes) {
        y += 30
        pdf.setDrawColor(244, 244, 245)
        pdf.line(40, y, W - 40, y)
        y += 14
        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(8)
        pdf.setTextColor(161, 161, 170)
        pdf.text('NOTES', 40, y)
        y += 12
        pdf.setFont('helvetica', 'normal')
        pdf.setFontSize(9)
        pdf.setTextColor(113, 113, 122)
        const lines = pdf.splitTextToSize(data.notes, W - 80)
        pdf.text(lines, 40, y)
      }

      pdf.save(`${data.invoiceNumber || 'invoice'}.pdf`)
    } catch (err) {
      console.error('PDF error:', err)
    }
    setDownloading(false)
  }

  async function handleGenerateLink() {
    if (!data.clientEmail) {
      alert('Add a client email first to generate a payment link.')
      return
    }
    setGenerating(true)
    setPaymentLink(null)
    const result = await createPaystackPaymentLink({
      email: data.clientEmail,
      amount: total,
      invoiceNumber: data.invoiceNumber || 'INV',
      clientName: data.clientName || '',
    })
    setGenerating(false)
    if (!result.ok) {
      alert(result.error)
      return
    }
    setPaymentLink(result.url)
  }

  async function copyLink() {
    if (!paymentLink) return
    await navigator.clipboard.writeText(paymentLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={handleDownloadPdf}
          disabled={downloading}
          className="gap-2 bg-transparent font-medium"
        >
          {downloading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {downloading ? 'Generating...' : 'Download PDF'}
        </Button>
        <Button
          onClick={handleGenerateLink}
          disabled={generating}
          className="gap-2 font-medium"
        >
          {generating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Link2 className="h-4 w-4" />
          )}
          Generate Payment Link
        </Button>
      </div>
      {paymentLink && (
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
          <p className="mb-2 text-xs font-medium text-primary">
            Payment link ready · {formatCurrency(total)}
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 truncate rounded-md bg-background px-2.5 py-1.5 text-xs text-muted-foreground">
              {paymentLink}
            </code>
            <Button
              size="sm"
              variant="secondary"
              onClick={copyLink}
              className="h-8 shrink-0 gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}