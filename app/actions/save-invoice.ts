'use server'

import { PutCommand } from '@aws-sdk/lib-dynamodb'
import { dynamo } from '@/lib/dynamodb'
import type { InvoiceData } from '@/lib/invoice-types'

export async function saveInvoice(data: InvoiceData): Promise<{ ok: boolean }> {
    try {
        await dynamo.send(new PutCommand({
            TableName: 'invoices',
            Item: {
                invoiceId: data.invoiceNumber || `INV-${Date.now()}`,
                clientName: data.clientName,
                clientEmail: data.clientEmail,
                items: data.items,
                taxRate: data.taxRate,
                notes: data.notes,
                dueDate: data.dueDate,
                createdAt: new Date().toISOString(),
            },
        }))
        return { ok: true }
    } catch (err) {
        console.error('[dynamo] save error:', err)
        return { ok: false }
    }
}