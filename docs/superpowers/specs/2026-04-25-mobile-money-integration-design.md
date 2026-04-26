# Mobile Money Integration Design
**Date:** 2026-04-25  
**Project:** goPay Tanzania  
**Scope:** C2B top-up, B2C withdrawal, P2P external transfer via Selcom aggregator + Flutterwave cards

---

## Overview

Integrate all three mobile money payment flows into goPay's existing React/TypeScript/Vite frontend and Supabase Edge Function backend. Providers: Selcom (M-Pesa, Tigo Pesa, Airtel Money, HaloPesa) for mobile money, Flutterwave for card payments.

The implementation is decomposed into four ordered sub-projects, each independently testable:

1. **Payment Gateway Layer** — adapters, DB schema, webhooks (all others depend on this)
2. **C2B Top-Up UI** — wallet loading from mobile money
3. **B2C Withdrawal UI** — cash out to mobile money
4. **P2P External Transfer UI** — send to a raw mobile number (no goPay account needed)

---

## Architecture

### Adapter Pattern (Option B)

The existing `payment-aggregator.tsx` Hono route file is kept intact for backward compatibility. A new `payments/` directory inside the Edge Functions server folder contains all new logic. `payment-aggregator.tsx` is rewired to delegate to the service layer.

```
src/supabase/functions/server/
  payment-aggregator.tsx        ← existing, rewired to delegate to service
  payments/
    types.ts                    ← shared types: PaymentRequest, PaymentResult, TxState
    selcom.ts                   ← Selcom adapter: C2B STK push, B2C payout
    flutterwave.ts              ← Flutterwave adapter: card C2B
    payment-service.ts          ← orchestrator: routes by provider/flow type
    webhook-handler.ts          ← receives and verifies Selcom + Flutterwave webhooks
```

### Frontend (no new pages)

All four flows wire into existing pages:
- **C2B:** "Add Funds" button in `WalletPage.tsx` → new provider/network selector modal
- **B2C:** "Withdraw" button in `WalletPage.tsx` → new withdrawal modal
- **P2P external:** "Mobile Money" tab in `SendMoneyPage.tsx` → already exists, wired to new endpoint

### Environment Variables (credential-ready, demo fallback)

```
SELCOM_API_KEY
SELCOM_API_SECRET
SELCOM_VENDOR_ID
SELCOM_WEBHOOK_SECRET     ← HMAC verification
FLUTTERWAVE_SECRET_KEY
FLUTTERWAVE_WEBHOOK_HASH  ← verif-hash header verification
```

When credentials are absent, adapters return a fake successful demo response. All UI flows are fully testable without live keys.

---

## Database Schema

### `transactions` table

```sql
create table transactions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references auth.users not null,
  type         text check (type in ('topup','withdrawal','p2p_send','p2p_receive')),
  provider     text check (provider in ('selcom','flutterwave','internal')),
  network      text,           -- 'mpesa' | 'tigo' | 'airtel' | 'halopesa' | 'card'
  amount       numeric(12,2) not null,
  currency     text default 'TZS',
  status       text check (status in ('pending','processing','completed','failed','reversed')),
  provider_ref text,           -- Selcom order ID or Flutterwave tx reference
  phone        text,           -- source (topup) or destination (withdrawal/p2p)
  metadata     jsonb,          -- raw provider response, PII fields masked
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

create index on transactions (user_id, status);
create index on transactions (provider_ref);
```

### `wallets` table (extend existing)

No new columns needed. Confirmed balance only changes on webhook confirmation. Pending amounts are derived from the `pending_balance` view below, not stored as a denormalized column.

### Pending balance view

```sql
create view pending_balance as
  select user_id, coalesce(sum(amount), 0) as locked
  from transactions
  where type = 'topup' and status = 'pending'
  group by user_id;
```

---

## State Machine

Every transaction moves through these states:

```
pending → processing → completed
                     → failed
        → failed (timeout)
completed → reversed (post-completion refund)
```

**State transitions:**
- `pending`: transaction row created, USSD push sent to user's phone
- `processing`: provider acknowledged receipt (intermediate webhook, not all providers send this)
- `completed`: final webhook received + HMAC verified → wallet balance updated atomically
- `failed`: final webhook with failure code, OR timeout job fires after 10 minutes with no confirmation
- `reversed`: post-completion reversal (edge case; logged, ops notified)

---

## Webhook Flow

### Inbound webhook endpoint

`POST /make-server-69a10ee8/payment/webhook/:provider`

Accepts `provider` = `selcom` or `flutterwave`.

**Processing steps:**
1. Read raw body before JSON parsing (needed for HMAC computation)
2. Verify HMAC signature using provider-specific header and secret
3. Reject with 401 if signature invalid — no DB writes
4. Look up transaction by `provider_ref`
5. Update `status` based on provider result code
6. If `completed`: credit wallet balance in the same DB transaction (atomic)
7. Trigger Supabase Realtime broadcast on `transactions` channel for the user
8. Return 200 immediately — retries from provider are handled idempotently via `provider_ref` lookup

### Timeout job

An Edge Function cron (or Supabase pg_cron) runs every 5 minutes:

```sql
update transactions
set status = 'failed', updated_at = now()
where status = 'pending'
  and created_at < now() - interval '10 minutes';
```

---

## Payment Flow Details

### C2B — Top-Up (money in)

1. User selects network (M-Pesa / Tigo / Airtel / HaloPesa / Card) and enters amount
2. `POST /payment/topup` — creates `pending` transaction, calls `selcom.initiateC2B()` (or `flutterwave.initiateCard()` for card); Selcom uses the phone number from the user's profile (not user input — reduces errors)
3. Selcom sends USSD push to user's registered phone number
4. User approves on their phone
5. Selcom POSTs webhook → balance credited
6. Frontend listens on Supabase Realtime, updates wallet balance live when `completed`

**Balance rule:** wallet balance does NOT increase on step 2. Only on step 5.

### B2C — Withdrawal (money out)

1. User enters amount and destination phone number
2. `POST /payment/withdraw` — verifies sufficient balance, deducts amount immediately (pessimistic lock), creates `pending` transaction, calls `selcom.initiateB2C()`
3. Selcom pushes funds to destination number
4. Webhook confirms delivery → status set to `completed`
5. If webhook reports failure → amount refunded back to wallet, status `failed`

**Balance rule:** balance is debited immediately on step 2. Refunded only on confirmed failure.

### P2P Internal — Send to goPay User

Uses the existing `/transfer/send` endpoint. Pure DB operation, no provider call. Not modified by this integration.

### P2P External — Send to Mobile Number

1. User enters recipient mobile number (non-goPay user) and amount in `SendMoneyPage.tsx`
2. `POST /payment/send-external` — same flow as B2C withdrawal but tagged as `p2p_send`
3. Selcom delivers funds to the raw mobile number via mobile money network
4. Recipient receives money directly to their mobile wallet (no goPay account needed)

---

## Provider Adapter Interfaces

### `types.ts`

```typescript
export type Network = 'mpesa' | 'tigo' | 'airtel' | 'halopesa' | 'card';
export type TxType = 'topup' | 'withdrawal' | 'p2p_send';
export type TxStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'reversed';

export interface PaymentRequest {
  userId: string;
  type: TxType;
  network: Network;
  amount: number;
  currency: 'TZS';
  phone: string;
  reference: string;   // internal transaction ID
  description: string;
}

export interface PaymentResult {
  success: boolean;
  providerRef: string;
  status: TxStatus;
  message: string;
  demo?: boolean;
}
```

### `selcom.ts` exports

```typescript
export async function initiateC2B(req: PaymentRequest): Promise<PaymentResult>
export async function initiateB2C(req: PaymentRequest): Promise<PaymentResult>
export function verifyWebhook(rawBody: string, signature: string): boolean
export function parseWebhookEvent(body: unknown): { providerRef: string; status: TxStatus }
```

### `flutterwave.ts` exports

```typescript
export async function initiateCard(req: PaymentRequest): Promise<PaymentResult>
export function verifyWebhook(rawBody: string, verifHash: string): boolean
export function parseWebhookEvent(body: unknown): { providerRef: string; status: TxStatus }
```

---

## Frontend Component Changes

### `WalletPage.tsx`

- "Add Funds" button opens new `TopUpModal` component (inline, not a new page)
- `TopUpModal`: network selector (4 mobile money + card), amount input, confirm button
- "Withdraw" button opens new `WithdrawModal` component
- `WithdrawModal`: amount input, phone number input, network selector, confirm button
- Both modals poll the transaction status via Supabase Realtime after submission
- Pending state shown as a non-blocking toast: "Waiting for your M-Pesa confirmation..."

### `SendMoneyPage.tsx`

- "Mobile Money" transfer method tab already exists
- Wire its submit handler to `POST /payment/send-external` instead of the current stub
- Show pending state same as wallet modals

---

## Error Handling

| Scenario | Handling |
|----------|----------|
| Selcom credentials missing | Demo mode: return fake `completed` response after 2s delay |
| HMAC verification failure | Return 401, log provider IP, do not touch DB |
| Webhook for unknown `provider_ref` | Return 200 (idempotent), log warning |
| Duplicate webhook (same `provider_ref`, already `completed`) | Return 200, skip DB write |
| Insufficient balance on withdrawal | Return 400 before any provider call |
| Network timeout calling Selcom API | Mark transaction `failed`, surface error to user |

---

## Implementation Order

1. `payments/types.ts` — types first, everything imports from here
2. DB migration — `transactions` table + index + pending view
3. `payments/selcom.ts` — C2B and B2C adapters with demo fallback
4. `payments/flutterwave.ts` — card C2B adapter with demo fallback
5. `payments/payment-service.ts` — orchestrator
6. `payments/webhook-handler.ts` — HMAC verification + state machine transitions
7. Register new routes in `payment-aggregator.tsx`
8. `TopUpModal` + `WithdrawModal` UI components
9. Wire `SendMoneyPage.tsx` external transfer to `/payment/send-external`
10. Supabase Realtime subscription in wallet/send pages

---

## Out of Scope

- Recurring/scheduled payments (separate feature)
- Refund initiation from the UI (ops-only via DB for now)
- Multi-currency beyond TZS
- Flutterwave B2C/P2P (Selcom handles all outbound for Tanzania)
