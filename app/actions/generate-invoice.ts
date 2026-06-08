'use server'

import { z } from 'zod'

const itemSchema = z.object({
  description: z.string(),
  quantity: z.number(),
  rate: z.number(),
})

const invoiceSchema = z.object({
  clientName: z.string().nullable(),
  clientEmail: z.string().nullable(),
  notes: z.string().nullable(),
  taxRate: z.number().nullable(),
  items: z.array(itemSchema),
})

export type ParsedInvoice = z.infer<typeof invoiceSchema>

export async function generateInvoiceFromText(
  description: string,
): Promise<{ ok: true; data: ParsedInvoice } | { ok: false; error: string }> {
  if (!description.trim()) {
    return { ok: false, error: 'Please describe what you want to invoice.' }
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1000,
        messages: [
          {
            role: 'system',
            content: 'You are an assistant that converts a natural-language description into structured invoice data. Extract the client name, client email, any notes, a tax rate (as a percentage number, e.g. 8.5), and line items. Each line item has a description, a quantity, and a rate (unit price in USD). If the user mentions a lump sum for a service, use quantity 1 and put the amount as the rate. Infer reasonable quantities and rates when the user gives hourly work. If a value is not present, return null for it (or an empty array for items). Do not invent a client if none is mentioned. Respond ONLY with a valid JSON object with keys: clientName, clientEmail, notes, taxRate, items. No markdown, no backticks, no explanation.',
          },
          {
            role: 'user',
            content: description,
          },
        ],
      }),
    })

    const result = await response.json()
    const raw = JSON.parse(result.choices[0].message.content)

    const normalized = {
      clientName: raw.clientName ?? raw.client_name ?? null,
      clientEmail: raw.clientEmail ?? raw.client_email ?? null,
      notes: raw.notes ?? null,
      taxRate: raw.taxRate ?? raw.tax_rate ?? null,
      items: (raw.items ?? raw.line_items ?? raw.lineItems ?? []).map((i: any) => ({
        description: i.description ?? '',
        quantity: Number(i.quantity) || 1,
        rate: Number(i.rate) || 0,
      })),
    }

    const parsed = invoiceSchema.parse(normalized)
    return { ok: true, data: parsed }
  } catch (err) {
    console.log('[groq] generateInvoiceFromText error:', err)
    return {
      ok: false,
      error: 'Could not generate the invoice. Please try again.',
    }
  }
}