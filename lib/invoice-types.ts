export type LineItem = {
  id: string
  description: string
  quantity: number
  rate: number
}

export type InvoiceData = {
  clientName: string
  clientEmail: string
  invoiceNumber: string
  dueDate: string
  items: LineItem[]
  notes: string
  taxRate: number
}

export function emptyItem(): LineItem {
  return {
    id: Math.random().toString(36).slice(2, 9),
    description: '',
    quantity: 1,
    rate: 0,
  }
}

export function lineTotal(item: LineItem): number {
  return (Number(item.quantity) || 0) * (Number(item.rate) || 0)
}

export function computeTotals(data: InvoiceData) {
  const subtotal = data.items.reduce((sum, item) => sum + lineTotal(item), 0)
  const tax = subtotal * ((Number(data.taxRate) || 0) / 100)
  const total = subtotal + tax
  return { subtotal, tax, total }
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number.isFinite(value) ? value : 0)
}

// Deterministic default — safe for SSR (no Math.random / Date).
// Use freshInvoice() on the client to populate a unique number and due date.
export function defaultInvoice(): InvoiceData {
  return {
    clientName: '',
    clientEmail: '',
    invoiceNumber: 'INV-0000',
    dueDate: '',
    items: [
      {
        id: 'item-1',
        description: '',
        quantity: 1,
        rate: 0,
      },
    ],
    notes: 'Thank you for your business. Payment is due within 14 days.',
    taxRate: 0,
  }
}

export function freshInvoice(): InvoiceData {
  const due = new Date()
  due.setDate(due.getDate() + 14)
  return {
    ...defaultInvoice(),
    invoiceNumber: `INV-${new Date().getFullYear()}-${String(
      Math.floor(Math.random() * 9000) + 1000,
    )}`,
    dueDate: due.toISOString().slice(0, 10),
    items: [emptyItem()],
  }
}
