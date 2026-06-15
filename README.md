# InvoiceAI 🧾

**AI-powered invoice generator with blockchain anchoring, cloud storage, and payment link generation.**

> Built for the H0 Hackathon & Casper Agentic Buildathon

🔗 **Live Demo:** [invoiceai-brown.vercel.app](https://invoiceai-brown.vercel.app)

-----

## What is InvoiceAI?

InvoiceAI lets you describe a job in plain English and instantly generates a fully structured invoice. The AI (Groq + Llama 3.3) extracts client details, line items, tax rates, and notes from your description. You can then save the invoice to AWS DynamoDB, anchor it permanently on the Casper blockchain as a tamper-proof record, and generate a Paystack payment link to collect payment — all in one flow.

-----

## Features

- 🤖 **AI Invoice Generation** — Describe your work in natural language; Llama 3.3 (via Groq) extracts structured invoice data instantly
- ⛓️ **Blockchain Anchoring** — SHA-256 invoice hash anchored on Casper testnet as a permanent, tamper-proof record
- ☁️ **Cloud Storage** — Invoices saved to AWS DynamoDB
- 💳 **Payment Links** — Paystack payment link generated directly from the invoice
- 🖨️ **Print / PDF Export** — Clean printable invoice layout
- ⚡ **Live Preview** — Real-time invoice preview as you edit

-----

## Tech Stack

|Layer     |Technology                            |
|----------|--------------------------------------|
|Frontend  |Next.js 14 + TypeScript + Tailwind CSS|
|AI        |Groq API (llama-3.3-70b-versatile)    |
|Blockchain|Casper Network (casper-js-sdk)        |
|Database  |AWS DynamoDB                          |
|Payments  |Paystack                              |
|Deployment|Vercel                                |

-----

## AI Usage (Groq + Llama 3.3)

InvoiceAI uses Groq’s API with the `llama-3.3-70b-versatile` model to convert a plain-English description into structured invoice data (client name, email, line items, tax rate, notes).

- **AI invoice generation action:**
  [`app/actions/generate-invoice.ts`](https://github.com/LrdSantan/invoiceai/blob/main/app/actions/generate-invoice.ts)
- **Groq API call (llama-3.3-70b-versatile):**
  [`app/actions/generate-invoice.ts#L30-L60`](https://github.com/LrdSantan/invoiceai/blob/main/app/actions/generate-invoice.ts#L30-L60)

-----

## Casper Blockchain Anchoring

Invoices are hashed with SHA-256 and anchored on the Casper testnet via a self-transfer deploy. This creates a permanent, immutable on-chain record of every invoice.

- **Invoice hashing (SHA-256):**
  [`lib/casper.ts#L6-L9`](https://github.com/LrdSantan/invoiceai/blob/main/lib/casper.ts#L6-L9)
- **Casper deploy + anchoring logic:**
  [`lib/casper.ts#L11-L60`](https://github.com/LrdSantan/invoiceai/blob/main/lib/casper.ts#L11-L60)
- **Anchor invoice server action:**
  [`app/actions/anchor-invoice.ts`](https://github.com/LrdSantan/invoiceai/blob/main/app/actions/anchor-invoice.ts)

-----

## AWS DynamoDB

Invoices are persisted to an AWS DynamoDB table (`invoices`) with full invoice metadata.

- **DynamoDB client setup:**
  [`lib/dynamodb.ts`](https://github.com/LrdSantan/invoiceai/blob/main/lib/dynamodb.ts)
- **Save invoice action (PutCommand):**
  [`app/actions/save-invoice.ts`](https://github.com/LrdSantan/invoiceai/blob/main/app/actions/save-invoice.ts)

-----

## Paystack Payment Links

A Paystack payment link is generated directly from the invoice total and client email, allowing clients to pay immediately.

- **Create payment link action:**
  [`app/actions/create-payment-link.ts`](https://github.com/LrdSantan/invoiceai/blob/main/app/actions/create-payment-link.ts)
- **Paystack API call:**
  [`app/actions/create-payment-link.ts#L20-L45`](https://github.com/LrdSantan/invoiceai/blob/main/app/actions/create-payment-link.ts#L20-L45)

-----

## How It Works

1. User describes their work in plain English (e.g. “Invoice Acme Corp for 3 days of React dev at $800/day”)
1. Groq + Llama 3.3 extracts structured data: client, line items, tax, notes
1. Live invoice preview updates in real time
1. User can:
- **Save** — stores invoice in AWS DynamoDB
- **Anchor** — hashes invoice and records it on Casper blockchain
- **Pay** — generates a Paystack payment link for the client
- **Print / Export** — downloads clean PDF

-----

## Local Setup

### Prerequisites

- Node.js 18+
- Groq API key
- AWS account with DynamoDB table named `invoices`
- Paystack secret key
- Casper testnet keypair

### Installation

```bash
git clone https://github.com/LrdSantan/invoiceai
cd invoiceai
pnpm install
```

### Environment Variables

```env
GROQ_API_KEY=your_groq_api_key
AWS_REGION=your_aws_region
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
PAYSTACK_SECRET_KEY=your_paystack_secret
CASPER_PRIVATE_KEY=your_casper_private_key_b64
CASPER_PUBLIC_KEY=your_casper_public_key_hex
```

### Run Development Server

```bash
pnpm dev
```

-----

## Project Structure

```
invoiceai/
├── app/
│   ├── actions/
│   │   ├── generate-invoice.ts   # Groq + Llama AI generation
│   │   ├── save-invoice.ts       # DynamoDB persistence
│   │   ├── create-payment-link.ts # Paystack payment links
│   │   └── anchor-invoice.ts     # Casper blockchain anchoring
│   └── page.tsx                  # Main app page
├── lib/
│   ├── casper.ts                 # Casper SDK + SHA-256 hashing
│   ├── dynamodb.ts               # DynamoDB client
│   ├── invoice-types.ts          # TypeScript types
│   └── utils.ts
└── components/                   # UI components
```

-----

## Built By

**Deji** ([@ifwayodeji](https://x.com/ifwayodeji)) — Frontend Engineer & Founder of [Tixora](https://tixoraafrica.com.ng)
GitHub: [LrdSantan](https://github.com/LrdSantan)

-----

## License

MIT