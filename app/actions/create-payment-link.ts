'use server'

export async function createPaystackPaymentLink({
    email,
    amount,
    invoiceNumber,
    clientName,
}: {
    email: string
    amount: number
    invoiceNumber: string
    clientName: string
}): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
    if (!email) {
        return { ok: false, error: 'Client email is required to generate a payment link.' }
    }
    if (amount <= 0) {
        return { ok: false, error: 'Invoice total must be greater than 0.' }
    }

    try {
        const response = await fetch('https://api.paystack.co/transaction/initialize', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                amount: Math.round(amount * 100),
                currency: 'NGN',
                reference: `${invoiceNumber}-${Date.now()}`,
                metadata: {
                    invoice_number: invoiceNumber,
                    client_name: clientName,
                },
            }),
        })
        const result = await response.json()


        if (!result.status) {
            return { ok: false, error: result.message || 'Paystack error.' }
        }

        return { ok: true, url: result.data.authorization_url }
    } catch (err) {
        console.error('[paystack] error:', err)
        return { ok: false, error: 'Could not create payment link. Try again.' }
    }
}
