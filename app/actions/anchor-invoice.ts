'use server'
import { hashInvoice, anchorInvoiceOnCasper } from '@/lib/casper'
import type { InvoiceData } from '@/lib/invoice-types'

export async function anchorInvoice(
  data: InvoiceData,
): Promise<{ ok: true; deployHash: string; invoiceHash: string } | { ok: false; error: string }> {
  const invoiceHash = hashInvoice({
    invoiceNumber: data.invoiceNumber,
    clientName: data.clientName,
    clientEmail: data.clientEmail,
    items: data.items,
    taxRate: data.taxRate,
    dueDate: data.dueDate,
  })

  const result = await anchorInvoiceOnCasper(invoiceHash)

  if (!result.ok) return result

  return {
    ok: true,
    deployHash: result.deployHash,
    invoiceHash,
  }
}