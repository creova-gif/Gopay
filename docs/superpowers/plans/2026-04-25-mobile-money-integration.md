# Mobile Money Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate Selcom (M-Pesa, Tigo, Airtel, HaloPesa) + Flutterwave card payments into goPay's wallet top-up, withdrawal, and external P2P transfer flows.

**Architecture:** Clean adapter layer under `src/supabase/functions/server/payments/` — each provider in its own file, routed through a central orchestrator. Wallet balance lives in the existing KV store (`wallet:${userId}`). Transaction history and Realtime events use a new Postgres `transactions` table. Frontend modals wire into existing `WalletPage.tsx` and `SendMoneyPage.tsx` — no new pages.

**Tech Stack:** Deno + Hono (Edge Functions), `jsr:@supabase/supabase-js@2`, React 18 + TypeScript + Vite, `motion/react`, Tailwind CSS v4, sonner (toasts), vitest + @testing-library/react (frontend tests)

---

## File Map

**Create:**
- `src/supabase/functions/server/payments/types.ts` — shared PaymentRequest, PaymentResult, TxStatus
- `src/supabase/functions/server/payments/utils.ts` — HMAC-SHA256 helper
- `src/supabase/functions/server/payments/selcom.ts` — Selcom C2B + B2C adapter
- `src/supabase/functions/server/payments/flutterwave.ts` — Flutterwave card adapter
- `src/supabase/functions/server/payments/payment-service.ts` — orchestrator (route by type + network)
- `src/supabase/functions/server/payments/webhook-handler.ts` — HMAC verify + state machine
- `src/supabase/functions/server/payments/__tests__/utils.test.ts`
- `src/supabase/functions/server/payments/__tests__/selcom.test.ts`
- `src/supabase/functions/server/payments/__tests__/flutterwave.test.ts`
- `src/supabase/functions/server/payments/__tests__/webhook-handler.test.ts`
- `src/supabase/migrations/20260425000000_payments.sql` — transactions table + pending view
- `src/components/TopUpModal.tsx` — network selector + amount input modal
- `src/components/WithdrawModal.tsx` — amount + phone + network modal
- `src/components/__tests__/TopUpModal.test.tsx`
- `src/components/__tests__/WithdrawModal.test.tsx`
- `vitest.config.ts`

**Modify:**
- `src/supabase/functions/server/payment-aggregator.tsx` — add new routes, delegate to service
- `src/supabase/functions/server/payments/deno.json` — import map for test runner
- `src/components/WalletPage.tsx` — wire TopUpModal + WithdrawModal + Realtime subscription
- `src/components/SendMoneyPage.tsx` — wire external mobile transfer to `/payment/send-external`
- `package.json` — add test script

---

## Task 1: Shared Types

**Files:**
- Create: `src/supabase/functions/server/payments/types.ts`

- [ ] **Step 1: Write the types file**

```typescript
// src/supabase/functions/server/payments/types.ts

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
  reference: string;
  description: string;
}

export interface PaymentResult {
  success: boolean;
  providerRef: string;
  status: TxStatus;
  message: string;
  demo?: boolean;
}

export interface WebhookEvent {
  providerRef: string;
  status: TxStatus;
  rawBody: string;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd src/supabase/functions/server
deno check payments/types.ts
```

Expected: no output (clean compile)

- [ ] **Step 3: Commit**

```bash
git add src/supabase/functions/server/payments/types.ts
git commit -m "feat(payments): add shared payment types"
```

---

## Task 2: HMAC Utility

**Files:**
- Create: `src/supabase/functions/server/payments/utils.ts`
- Create: `src/supabase/functions/server/payments/__tests__/utils.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// src/supabase/functions/server/payments/__tests__/utils.test.ts
import { assertEquals, assertNotEquals } from 'jsr:@std/assert';
import { computeHmac, constantTimeEqual } from '../utils.ts';

Deno.test('computeHmac returns a base64 string', async () => {
  const result = await computeHmac('hello', 'secret');
  assertEquals(typeof result, 'string');
  assertEquals(result.length > 0, true);
});

Deno.test('computeHmac same inputs produce same output', async () => {
  const a = await computeHmac('payload', 'mysecret');
  const b = await computeHmac('payload', 'mysecret');
  assertEquals(a, b);
});

Deno.test('computeHmac different payloads produce different output', async () => {
  const a = await computeHmac('payload1', 'mysecret');
  const b = await computeHmac('payload2', 'mysecret');
  assertNotEquals(a, b);
});

Deno.test('constantTimeEqual returns true for identical strings', () => {
  assertEquals(constantTimeEqual('abc123', 'abc123'), true);
});

Deno.test('constantTimeEqual returns false for different strings', () => {
  assertEquals(constantTimeEqual('abc123', 'xyz789'), false);
});
```

- [ ] **Step 2: Run to confirm failure**

```bash
cd src/supabase/functions/server
deno test --allow-env payments/__tests__/utils.test.ts
```

Expected: `error: Module not found "…/utils.ts"`

- [ ] **Step 3: Implement utils.ts**

```typescript
// src/supabase/functions/server/payments/utils.ts

export async function computeHmac(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

export function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  const aBytes = new TextEncoder().encode(a);
  const bBytes = new TextEncoder().encode(b);
  let diff = 0;
  for (let i = 0; i < aBytes.length; i++) {
    diff |= aBytes[i] ^ bBytes[i];
  }
  return diff === 0;
}
```

- [ ] **Step 4: Run tests — confirm pass**

```bash
deno test --allow-env payments/__tests__/utils.test.ts
```

Expected:
```
running 5 tests from payments/__tests__/utils.test.ts
computeHmac returns a base64 string ... ok
computeHmac same inputs produce same output ... ok
computeHmac different payloads produce different output ... ok
constantTimeEqual returns true for identical strings ... ok
constantTimeEqual returns false for different strings ... ok
ok | 5 passed | 0 failed
```

- [ ] **Step 5: Commit**

```bash
git add src/supabase/functions/server/payments/utils.ts \
        src/supabase/functions/server/payments/__tests__/utils.test.ts
git commit -m "feat(payments): add HMAC utility with constant-time comparison"
```

---

## Task 3: DB Migration

**Files:**
- Create: `src/supabase/migrations/20260425000000_payments.sql`

- [ ] **Step 1: Write the migration**

```sql
-- src/supabase/migrations/20260425000000_payments.sql

create table if not exists transactions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references auth.users not null,
  type         text not null check (type in ('topup','withdrawal','p2p_send','p2p_receive')),
  provider     text not null check (provider in ('selcom','flutterwave','internal')),
  network      text check (network in ('mpesa','tigo','airtel','halopesa','card')),
  amount       numeric(12,2) not null check (amount > 0),
  currency     text not null default 'TZS',
  status       text not null default 'pending'
               check (status in ('pending','processing','completed','failed','reversed')),
  provider_ref text,
  phone        text,
  metadata     jsonb,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists transactions_user_status_idx on transactions (user_id, status);
create index if not exists transactions_provider_ref_idx on transactions (provider_ref)
  where provider_ref is not null;

create or replace view pending_balance as
  select
    user_id,
    coalesce(sum(amount), 0) as locked
  from transactions
  where type = 'topup'
    and status = 'pending'
  group by user_id;

create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists transactions_updated_at on transactions;
create trigger transactions_updated_at
  before update on transactions
  for each row execute function update_updated_at();

alter table transactions enable row level security;

create policy "Users see own transactions"
  on transactions for select
  using (auth.uid() = user_id);
```

- [ ] **Step 2: Apply to Supabase**

Option A — Supabase CLI (if configured locally):
```bash
supabase db push
```

Option B — Supabase Dashboard: open SQL Editor at https://supabase.com/dashboard/project/smoaclzhvavtuzqgogse/sql/new, paste the migration, click Run.

Expected: no errors, table visible in Table Editor under `public.transactions`.

- [ ] **Step 3: Add pg_cron timeout job**

In the same SQL Editor session (or a new one), run:

```sql
-- Enable pg_cron if not already enabled (requires Supabase Pro or enabled extension)
-- Dashboard → Database → Extensions → search "pg_cron" → Enable

-- Schedule: every 5 minutes, mark stale pending transactions as failed
select cron.schedule(
  'expire-pending-transactions',
  '*/5 * * * *',
  $$
    update transactions
    set status = 'failed', updated_at = now()
    where status = 'pending'
      and created_at < now() - interval '10 minutes';
  $$
);
```

Expected: `schedule` returns an integer job ID.

Note: if pg_cron is not available on your plan, this can be implemented as a Supabase Edge Function with a scheduled trigger via `supabase/functions/expire-pending-transactions/index.ts` and a cron trigger in `supabase/config.toml`. The SQL logic above is identical either way.

- [ ] **Step 4: Commit**

```bash
git add src/supabase/migrations/20260425000000_payments.sql
git commit -m "feat(payments): add transactions table with RLS and pending_balance view"
```

---

## Task 4: Selcom Adapter

**Files:**
- Create: `src/supabase/functions/server/payments/selcom.ts`
- Create: `src/supabase/functions/server/payments/__tests__/selcom.test.ts`

- [ ] **Step 1: Write the failing tests**

```typescript
// src/supabase/functions/server/payments/__tests__/selcom.test.ts
import { assertEquals } from 'jsr:@std/assert';
import {
  verifySelcomWebhook,
  parseSelcomWebhookEvent,
  initiateC2B,
  initiateB2C,
} from '../selcom.ts';
import type { PaymentRequest } from '../types.ts';

const BASE_REQ: PaymentRequest = {
  userId: 'user-123',
  type: 'topup',
  network: 'mpesa',
  amount: 10000,
  currency: 'TZS',
  phone: '+255712345678',
  reference: 'GO-TEST-001',
  description: 'Wallet top-up',
};

Deno.test('initiateC2B returns demo result when no env credentials', async () => {
  // Ensure env vars absent
  const result = await initiateC2B(BASE_REQ);
  assertEquals(result.success, true);
  assertEquals(result.status, 'pending');
  assertEquals(result.demo, true);
});

Deno.test('initiateB2C returns demo result when no env credentials', async () => {
  const req: PaymentRequest = { ...BASE_REQ, type: 'withdrawal' };
  const result = await initiateB2C(req);
  assertEquals(result.success, true);
  assertEquals(result.status, 'pending');
  assertEquals(result.demo, true);
});

Deno.test('verifySelcomWebhook returns false for wrong signature', async () => {
  const valid = await verifySelcomWebhook('{"amount":1000}', 'wrong-sig', 'mysecret');
  assertEquals(valid, false);
});

Deno.test('verifySelcomWebhook returns true for correct signature', async () => {
  const body = '{"amount":1000}';
  const secret = 'mysecret';
  // Compute what the correct sig should be
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(body));
  const correctSig = btoa(String.fromCharCode(...new Uint8Array(sig)));

  const valid = await verifySelcomWebhook(body, correctSig, secret);
  assertEquals(valid, true);
});

Deno.test('parseSelcomWebhookEvent maps success result code', () => {
  const body = { result: 'SUCCESS', transid: 'SEL-001', msisdn: '255712345678' };
  const event = parseSelcomWebhookEvent(body);
  assertEquals(event.providerRef, 'SEL-001');
  assertEquals(event.status, 'completed');
});

Deno.test('parseSelcomWebhookEvent maps failure result code', () => {
  const body = { result: 'FAILED', transid: 'SEL-002', msisdn: '255712345678' };
  const event = parseSelcomWebhookEvent(body);
  assertEquals(event.providerRef, 'SEL-002');
  assertEquals(event.status, 'failed');
});
```

- [ ] **Step 2: Run to confirm failure**

```bash
cd src/supabase/functions/server
deno test --allow-env payments/__tests__/selcom.test.ts
```

Expected: `error: Module not found "…/selcom.ts"`

- [ ] **Step 3: Implement selcom.ts**

```typescript
// src/supabase/functions/server/payments/selcom.ts
import type { PaymentRequest, PaymentResult, TxStatus } from './types.ts';
import { computeHmac, constantTimeEqual } from './utils.ts';

const SELCOM_C2B_URL = 'https://apigw.selcommobile.com/v1/checkout/create-order';
const SELCOM_B2C_URL = 'https://apigw.selcommobile.com/v1/checkout/wallet-to-phone';

function demoResult(req: PaymentRequest): PaymentResult {
  return {
    success: true,
    providerRef: `DEMO-SEL-${Date.now()}`,
    status: 'pending',
    message: '[DEMO] Selcom push sent — approve on your phone',
    demo: true,
  };
}

function selcomGateway(network: string): string {
  const map: Record<string, string> = {
    mpesa: 'MPESA',
    tigo: 'TIGOPESA',
    airtel: 'AIRTELMONEY',
    halopesa: 'HALOPESA',
  };
  return map[network] ?? 'MPESA';
}

async function selcomHeaders(
  apiKey: string,
  apiSecret: string,
  vendor: string,
  orderId: string,
  amount: number,
): Promise<Record<string, string>> {
  const timestamp = Date.now().toString();
  const sigPayload = `vendor=${vendor}&order_id=${orderId}&amount=${amount}&currency=TZS`;
  const digest = await computeHmac(sigPayload, apiSecret);
  return {
    'Content-Type': 'application/json',
    Authorization: `SELCOM ${apiKey}`,
    'Digest-Method': 'HS256',
    Digest: digest,
    Timestamp: timestamp,
  };
}

export async function initiateC2B(req: PaymentRequest): Promise<PaymentResult> {
  const apiKey = Deno.env.get('SELCOM_API_KEY');
  const apiSecret = Deno.env.get('SELCOM_API_SECRET');
  const vendor = Deno.env.get('SELCOM_VENDOR_ID') ?? 'GOPAY';

  if (!apiKey || !apiSecret) return demoResult(req);

  const orderId = req.reference;
  const body = {
    vendor,
    order_id: orderId,
    buyer_phone: req.phone.replace(/\D/g, ''),
    buyer_email: `user-${req.userId}@gopay.tz`,
    buyer_name: 'goPay User',
    amount: req.amount,
    currency: 'TZS',
    gateway: selcomGateway(req.network),
    payment_methods: [selcomGateway(req.network)],
    webhook_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/make-server-69a10ee8/payment/webhook/selcom`,
    no_of_items: 1,
  };

  const headers = await selcomHeaders(apiKey, apiSecret, vendor, orderId, req.amount);
  const res = await fetch(SELCOM_C2B_URL, { method: 'POST', headers, body: JSON.stringify(body) });
  const data = await res.json();

  if (!res.ok || data.result !== 0) {
    return { success: false, providerRef: orderId, status: 'failed', message: data.message ?? 'Selcom error' };
  }
  return { success: true, providerRef: orderId, status: 'pending', message: 'Angalia simu yako' };
}

export async function initiateB2C(req: PaymentRequest): Promise<PaymentResult> {
  const apiKey = Deno.env.get('SELCOM_API_KEY');
  const apiSecret = Deno.env.get('SELCOM_API_SECRET');
  const vendor = Deno.env.get('SELCOM_VENDOR_ID') ?? 'GOPAY';

  if (!apiKey || !apiSecret) return demoResult(req);

  const orderId = req.reference;
  const body = {
    vendor,
    order_id: orderId,
    msisdn: req.phone.replace(/\D/g, ''),
    amount: req.amount,
    currency: 'TZS',
    gateway: selcomGateway(req.network),
    webhook_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/make-server-69a10ee8/payment/webhook/selcom`,
  };

  const headers = await selcomHeaders(apiKey, apiSecret, vendor, orderId, req.amount);
  const res = await fetch(SELCOM_B2C_URL, { method: 'POST', headers, body: JSON.stringify(body) });
  const data = await res.json();

  if (!res.ok || data.result !== 0) {
    return { success: false, providerRef: orderId, status: 'failed', message: data.message ?? 'Selcom B2C error' };
  }
  return { success: true, providerRef: orderId, status: 'pending', message: 'Inatumwa kwa simu yako' };
}

export async function verifySelcomWebhook(
  rawBody: string,
  signature: string,
  secret: string,
): Promise<boolean> {
  const expected = await computeHmac(rawBody, secret);
  return constantTimeEqual(signature, expected);
}

export function parseSelcomWebhookEvent(body: unknown): { providerRef: string; status: TxStatus } {
  const b = body as Record<string, unknown>;
  const providerRef = String(b.transid ?? b.order_id ?? '');
  const result = String(b.result ?? '').toUpperCase();
  const status: TxStatus = result === 'SUCCESS' ? 'completed' : 'failed';
  return { providerRef, status };
}
```

- [ ] **Step 4: Run tests — confirm pass**

```bash
deno test --allow-env payments/__tests__/selcom.test.ts
```

Expected:
```
running 6 tests from payments/__tests__/selcom.test.ts
initiateC2B returns demo result when no env credentials ... ok
initiateB2C returns demo result when no env credentials ... ok
verifySelcomWebhook returns false for wrong signature ... ok
verifySelcomWebhook returns true for correct signature ... ok
parseSelcomWebhookEvent maps success result code ... ok
parseSelcomWebhookEvent maps failure result code ... ok
ok | 6 passed | 0 failed
```

- [ ] **Step 5: Commit**

```bash
git add src/supabase/functions/server/payments/selcom.ts \
        src/supabase/functions/server/payments/__tests__/selcom.test.ts
git commit -m "feat(payments): add Selcom C2B and B2C adapter with demo fallback"
```

---

## Task 5: Flutterwave Adapter

**Files:**
- Create: `src/supabase/functions/server/payments/flutterwave.ts`
- Create: `src/supabase/functions/server/payments/__tests__/flutterwave.test.ts`

- [ ] **Step 1: Write the failing tests**

```typescript
// src/supabase/functions/server/payments/__tests__/flutterwave.test.ts
import { assertEquals } from 'jsr:@std/assert';
import {
  initiateCard,
  verifyFlutterwaveWebhook,
  parseFlutterwaveWebhookEvent,
} from '../flutterwave.ts';
import type { PaymentRequest } from '../types.ts';

const CARD_REQ: PaymentRequest = {
  userId: 'user-456',
  type: 'topup',
  network: 'card',
  amount: 50000,
  currency: 'TZS',
  phone: '+255712345678',
  reference: 'GO-FW-TEST-001',
  description: 'Card top-up',
};

Deno.test('initiateCard returns demo result when no env credentials', async () => {
  const result = await initiateCard(CARD_REQ);
  assertEquals(result.success, true);
  assertEquals(result.status, 'pending');
  assertEquals(result.demo, true);
});

Deno.test('verifyFlutterwaveWebhook returns true when hash matches', () => {
  const valid = verifyFlutterwaveWebhook('my-secret-hash', 'my-secret-hash');
  assertEquals(valid, true);
});

Deno.test('verifyFlutterwaveWebhook returns false when hash differs', () => {
  const valid = verifyFlutterwaveWebhook('my-secret-hash', 'wrong-hash');
  assertEquals(valid, false);
});

Deno.test('parseFlutterwaveWebhookEvent maps successful charge', () => {
  const body = {
    event: 'charge.completed',
    data: { tx_ref: 'GO-FW-TEST-001', status: 'successful' },
  };
  const event = parseFlutterwaveWebhookEvent(body);
  assertEquals(event.providerRef, 'GO-FW-TEST-001');
  assertEquals(event.status, 'completed');
});

Deno.test('parseFlutterwaveWebhookEvent maps failed charge', () => {
  const body = {
    event: 'charge.completed',
    data: { tx_ref: 'GO-FW-TEST-002', status: 'failed' },
  };
  const event = parseFlutterwaveWebhookEvent(body);
  assertEquals(event.status, 'failed');
});
```

- [ ] **Step 2: Run to confirm failure**

```bash
deno test --allow-env payments/__tests__/flutterwave.test.ts
```

Expected: `error: Module not found "…/flutterwave.ts"`

- [ ] **Step 3: Implement flutterwave.ts**

```typescript
// src/supabase/functions/server/payments/flutterwave.ts
import type { PaymentRequest, PaymentResult, TxStatus } from './types.ts';
import { constantTimeEqual } from './utils.ts';

const FLW_PAYMENT_URL = 'https://api.flutterwave.com/v3/payments';

function demoResult(req: PaymentRequest): PaymentResult {
  return {
    success: true,
    providerRef: req.reference,
    status: 'pending',
    message: '[DEMO] Card payment initiated',
    demo: true,
  };
}

export async function initiateCard(req: PaymentRequest): Promise<PaymentResult> {
  const secretKey = Deno.env.get('FLUTTERWAVE_SECRET_KEY');
  if (!secretKey) return demoResult(req);

  const body = {
    tx_ref: req.reference,
    amount: req.amount,
    currency: 'TZS',
    redirect_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/make-server-69a10ee8/payment/flutterwave-redirect`,
    customer: {
      email: `user-${req.userId}@gopay.tz`,
      phonenumber: req.phone,
      name: 'goPay User',
    },
    customizations: {
      title: 'goPay Wallet Top-Up',
      description: req.description,
      logo: 'https://gopay.tz/logo.png',
    },
  };

  const res = await fetch(FLW_PAYMENT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${secretKey}`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();

  if (!res.ok || data.status !== 'success') {
    return { success: false, providerRef: req.reference, status: 'failed', message: data.message ?? 'Flutterwave error' };
  }
  return {
    success: true,
    providerRef: req.reference,
    status: 'pending',
    message: data.data?.link ?? 'Payment link ready',
  };
}

export function verifyFlutterwaveWebhook(
  storedHash: string,
  receivedHash: string,
): boolean {
  return constantTimeEqual(storedHash, receivedHash);
}

export function parseFlutterwaveWebhookEvent(body: unknown): { providerRef: string; status: TxStatus } {
  const b = body as Record<string, unknown>;
  const data = b.data as Record<string, unknown>;
  const providerRef = String(data?.tx_ref ?? '');
  const flwStatus = String(data?.status ?? '').toLowerCase();
  const status: TxStatus = flwStatus === 'successful' ? 'completed' : 'failed';
  return { providerRef, status };
}
```

- [ ] **Step 4: Run tests — confirm pass**

```bash
deno test --allow-env payments/__tests__/flutterwave.test.ts
```

Expected:
```
running 5 tests from payments/__tests__/flutterwave.test.ts
initiateCard returns demo result when no env credentials ... ok
verifyFlutterwaveWebhook returns true when hash matches ... ok
verifyFlutterwaveWebhook returns false when hash differs ... ok
parseFlutterwaveWebhookEvent maps successful charge ... ok
parseFlutterwaveWebhookEvent maps failed charge ... ok
ok | 5 passed | 0 failed
```

- [ ] **Step 5: Commit**

```bash
git add src/supabase/functions/server/payments/flutterwave.ts \
        src/supabase/functions/server/payments/__tests__/flutterwave.test.ts
git commit -m "feat(payments): add Flutterwave card adapter with demo fallback"
```

---

## Task 6: Payment Service Orchestrator

**Files:**
- Create: `src/supabase/functions/server/payments/payment-service.ts`

- [ ] **Step 1: Write payment-service.ts**

```typescript
// src/supabase/functions/server/payments/payment-service.ts
import type { SupabaseClient } from 'jsr:@supabase/supabase-js@2';
import type { PaymentRequest, PaymentResult, TxType } from './types.ts';
import { initiateC2B, initiateB2C } from './selcom.ts';
import { initiateCard } from './flutterwave.ts';

async function insertTransaction(
  db: SupabaseClient,
  req: PaymentRequest,
  type: TxType,
  providerRef: string,
  provider: string,
): Promise<void> {
  const { error } = await db.from('transactions').insert({
    user_id: req.userId,
    type,
    provider,
    network: req.network,
    amount: req.amount,
    currency: req.currency,
    status: 'pending',
    provider_ref: providerRef,
    phone: req.phone,
  });
  if (error) throw new Error(`DB insert failed: ${error.message}`);
}

export async function processTopUp(
  db: SupabaseClient,
  req: PaymentRequest,
): Promise<PaymentResult> {
  let result: PaymentResult;
  let provider: string;

  if (req.network === 'card') {
    result = await initiateCard(req);
    provider = 'flutterwave';
  } else {
    result = await initiateC2B(req);
    provider = 'selcom';
  }

  if (result.success) {
    await insertTransaction(db, req, 'topup', result.providerRef, provider);
  }
  return result;
}

export async function processWithdrawal(
  db: SupabaseClient,
  req: PaymentRequest,
  currentBalance: number,
): Promise<PaymentResult> {
  if (currentBalance < req.amount) {
    return { success: false, providerRef: '', status: 'failed', message: 'Salio halitosha' };
  }
  const result = await initiateB2C(req);
  if (result.success) {
    await insertTransaction(db, req, 'withdrawal', result.providerRef, 'selcom');
  }
  return result;
}

export async function processExternalSend(
  db: SupabaseClient,
  req: PaymentRequest,
  currentBalance: number,
): Promise<PaymentResult> {
  if (currentBalance < req.amount) {
    return { success: false, providerRef: '', status: 'failed', message: 'Salio halitosha' };
  }
  const result = await initiateB2C(req);
  if (result.success) {
    await insertTransaction(db, req, 'p2p_send', result.providerRef, 'selcom');
  }
  return result;
}
```

- [ ] **Step 2: Verify compiles cleanly**

```bash
cd src/supabase/functions/server
deno check payments/payment-service.ts
```

Expected: no output

- [ ] **Step 3: Commit**

```bash
git add src/supabase/functions/server/payments/payment-service.ts
git commit -m "feat(payments): add payment service orchestrator for topup/withdrawal/p2p"
```

---

## Task 7: Webhook Handler

**Files:**
- Create: `src/supabase/functions/server/payments/webhook-handler.ts`
- Create: `src/supabase/functions/server/payments/__tests__/webhook-handler.test.ts`

- [ ] **Step 1: Write the failing tests**

```typescript
// src/supabase/functions/server/payments/__tests__/webhook-handler.test.ts
import { assertEquals } from 'jsr:@std/assert';
import { handleSelcomWebhook, handleFlutterwaveWebhook } from '../webhook-handler.ts';

// Minimal SupabaseClient stub
function makeDb(txRow: Record<string, unknown> | null, updateError: string | null = null) {
  return {
    from: (_table: string) => ({
      select: (_cols: string) => ({
        eq: (_col: string, _val: string) => ({
          single: async () => ({ data: txRow, error: txRow ? null : { message: 'not found' } }),
        }),
      }),
      update: (_data: Record<string, unknown>) => ({
        eq: (_col: string, _val: string) => ({
          select: (_cols: string) => ({
            single: async () => ({
              data: updateError ? null : { ...txRow, status: 'completed' },
              error: updateError ? { message: updateError } : null,
            }),
          }),
        }),
      }),
    }),
  } as unknown as import('jsr:@supabase/supabase-js@2').SupabaseClient;
}

function makeKv() {
  const store: Record<string, unknown> = {};
  return {
    get: async (key: string) => store[key] ?? null,
    set: async (key: string, val: unknown) => { store[key] = val; },
  };
}

Deno.test('handleSelcomWebhook returns 401 on bad signature', async () => {
  const db = makeDb(null);
  const kv = makeKv();
  const res = await handleSelcomWebhook('{"transid":"X","result":"SUCCESS"}', 'bad-sig', 'secret', db, kv);
  assertEquals(res.status, 401);
});

Deno.test('handleSelcomWebhook returns 200 for unknown providerRef (idempotent)', async () => {
  const db = makeDb(null);
  const kv = makeKv();
  // Build correct sig
  const body = '{"transid":"UNKNOWN-001","result":"SUCCESS"}';
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', encoder.encode('secret'), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(body));
  const correctSig = btoa(String.fromCharCode(...new Uint8Array(sig)));

  const res = await handleSelcomWebhook(body, correctSig, 'secret', db, kv);
  assertEquals(res.status, 200);
});

Deno.test('handleSelcomWebhook returns 200 and marks completed on success', async () => {
  const tx = { id: 'tx-1', user_id: 'u-1', type: 'topup', amount: 10000, status: 'pending', provider_ref: 'SEL-001' };
  const kv = makeKv();
  await kv.set('wallet:u-1', { balance: 50000 });

  const db = makeDb(tx);
  const body = '{"transid":"SEL-001","result":"SUCCESS"}';
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', encoder.encode('secret'), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(body));
  const correctSig = btoa(String.fromCharCode(...new Uint8Array(sig)));

  const res = await handleSelcomWebhook(body, correctSig, 'secret', db, kv);
  assertEquals(res.status, 200);
  const wallet = await kv.get('wallet:u-1') as { balance: number };
  assertEquals(wallet.balance, 60000);
});

Deno.test('handleFlutterwaveWebhook returns 401 on hash mismatch', async () => {
  const db = makeDb(null);
  const kv = makeKv();
  const res = await handleFlutterwaveWebhook('{}', 'wrong', 'correct-hash', db, kv);
  assertEquals(res.status, 401);
});
```

- [ ] **Step 2: Run to confirm failure**

```bash
deno test --allow-env payments/__tests__/webhook-handler.test.ts
```

Expected: `error: Module not found "…/webhook-handler.ts"`

- [ ] **Step 3: Implement webhook-handler.ts**

```typescript
// src/supabase/functions/server/payments/webhook-handler.ts
import type { SupabaseClient } from 'jsr:@supabase/supabase-js@2';
import type { TxStatus } from './types.ts';
import { verifySelcomWebhook, parseSelcomWebhookEvent } from './selcom.ts';
import { verifyFlutterwaveWebhook, parseFlutterwaveWebhookEvent } from './flutterwave.ts';

interface KvStore {
  get(key: string): Promise<unknown>;
  set(key: string, value: unknown): Promise<void>;
}

interface HandlerResult {
  status: number;
  body: unknown;
}

async function applyWebhookEvent(
  providerRef: string,
  newStatus: TxStatus,
  db: SupabaseClient,
  kv: KvStore,
): Promise<HandlerResult> {
  const { data: tx, error } = await db
    .from('transactions')
    .select('id,user_id,type,amount,status')
    .eq('provider_ref', providerRef)
    .single();

  if (error || !tx) {
    console.warn('Webhook for unknown provider_ref:', providerRef);
    return { status: 200, body: { ok: true } };
  }

  if (tx.status === 'completed' || tx.status === 'failed') {
    return { status: 200, body: { ok: true, note: 'already settled' } };
  }

  const { error: updateError } = await db
    .from('transactions')
    .update({ status: newStatus })
    .eq('id', tx.id)
    .select('id')
    .single();

  if (updateError) {
    console.error('Failed to update transaction:', updateError.message);
    return { status: 500, body: { error: 'DB update failed' } };
  }

  if (newStatus === 'completed' && tx.type === 'topup') {
    const wallet = (await kv.get(`wallet:${tx.user_id}`) as { balance: number } | null) ?? { balance: 0 };
    await kv.set(`wallet:${tx.user_id}`, { ...wallet, balance: wallet.balance + Number(tx.amount) });
  }

  if (newStatus === 'failed' && (tx.type === 'withdrawal' || tx.type === 'p2p_send')) {
    const wallet = (await kv.get(`wallet:${tx.user_id}`) as { balance: number } | null) ?? { balance: 0 };
    await kv.set(`wallet:${tx.user_id}`, { ...wallet, balance: wallet.balance + Number(tx.amount) });
  }

  return { status: 200, body: { ok: true } };
}

export async function handleSelcomWebhook(
  rawBody: string,
  signature: string,
  secret: string,
  db: SupabaseClient,
  kv: KvStore,
): Promise<HandlerResult> {
  const valid = await verifySelcomWebhook(rawBody, signature, secret);
  if (!valid) return { status: 401, body: { error: 'Invalid signature' } };

  const body = JSON.parse(rawBody);
  const { providerRef, status } = parseSelcomWebhookEvent(body);
  return applyWebhookEvent(providerRef, status, db, kv);
}

export async function handleFlutterwaveWebhook(
  rawBody: string,
  verifHash: string,
  storedHash: string,
  db: SupabaseClient,
  kv: KvStore,
): Promise<HandlerResult> {
  const valid = verifyFlutterwaveWebhook(storedHash, verifHash);
  if (!valid) return { status: 401, body: { error: 'Invalid hash' } };

  const body = JSON.parse(rawBody);
  const { providerRef, status } = parseFlutterwaveWebhookEvent(body);
  return applyWebhookEvent(providerRef, status, db, kv);
}
```

- [ ] **Step 4: Run tests — confirm pass**

```bash
deno test --allow-env payments/__tests__/webhook-handler.test.ts
```

Expected:
```
running 4 tests from payments/__tests__/webhook-handler.test.ts
handleSelcomWebhook returns 401 on bad signature ... ok
handleSelcomWebhook returns 200 for unknown providerRef (idempotent) ... ok
handleSelcomWebhook returns 200 and marks completed on success ... ok
handleFlutterwaveWebhook returns 401 on hash mismatch ... ok
ok | 4 passed | 0 failed
```

- [ ] **Step 5: Commit**

```bash
git add src/supabase/functions/server/payments/webhook-handler.ts \
        src/supabase/functions/server/payments/__tests__/webhook-handler.test.ts
git commit -m "feat(payments): add webhook handler with HMAC verification and state machine"
```

---

## Task 8: Register Routes in payment-aggregator.tsx

**Files:**
- Modify: `src/supabase/functions/server/payment-aggregator.tsx`

- [ ] **Step 1: Add imports at the top of payment-aggregator.tsx**

After the existing imports (after `import * as kv from './kv_store.tsx';`), add:

```typescript
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { processTopUp, processWithdrawal, processExternalSend } from './payments/payment-service.ts';
import { handleSelcomWebhook, handleFlutterwaveWebhook } from './payments/webhook-handler.ts';
```

- [ ] **Step 2: Add a helper to build the service-role Supabase client**

Add this function after the imports, before any route definitions:

```typescript
function getDb() {
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );
}
```

- [ ] **Step 3: Add the three new POST routes**

Add these three routes anywhere before `export default paymentAggregatorApp;`:

```typescript
// ── C2B Top-Up ────────────────────────────────────────────────
paymentAggregatorApp.post('/topup', async (c) => {
  try {
    const authHeader = c.req.header('Authorization') ?? '';
    const { data: { user }, error: authError } = await createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    ).auth.getUser();
    if (authError || !user) return c.json({ error: 'Unauthorized' }, 401);

    const { network, amount } = await c.req.json();
    if (!network || !amount || amount <= 0) return c.json({ error: 'Missing network or amount' }, 400);

    const wallet = await kv.get(`wallet:${user.id}`);
    const phone = (wallet as Record<string, string>)?.phone ?? '';

    const reference = `GO-TOP-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const result = await processTopUp(getDb(), {
      userId: user.id, type: 'topup', network, amount,
      currency: 'TZS', phone, reference, description: 'Wallet top-up',
    });
    return c.json(result, result.success ? 200 : 400);
  } catch (e: unknown) {
    console.error('topup error:', e);
    return c.json({ error: 'Internal error' }, 500);
  }
});

// ── B2C Withdrawal ────────────────────────────────────────────
paymentAggregatorApp.post('/withdraw', async (c) => {
  try {
    const authHeader = c.req.header('Authorization') ?? '';
    const { data: { user }, error: authError } = await createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    ).auth.getUser();
    if (authError || !user) return c.json({ error: 'Unauthorized' }, 401);

    const { network, amount, phone } = await c.req.json();
    if (!network || !amount || !phone) return c.json({ error: 'Missing fields' }, 400);

    const wallet = (await kv.get(`wallet:${user.id}`)) as { balance: number } | null;
    const balance = wallet?.balance ?? 0;

    const reference = `GO-WD-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const result = await processWithdrawal(getDb(), {
      userId: user.id, type: 'withdrawal', network, amount,
      currency: 'TZS', phone, reference, description: 'Wallet withdrawal',
    }, balance);

    if (result.success) {
      await kv.set(`wallet:${user.id}`, { ...wallet, balance: balance - amount });
    }
    return c.json(result, result.success ? 200 : 400);
  } catch (e: unknown) {
    console.error('withdraw error:', e);
    return c.json({ error: 'Internal error' }, 500);
  }
});

// ── P2P External Send ─────────────────────────────────────────
paymentAggregatorApp.post('/send-external', async (c) => {
  try {
    const authHeader = c.req.header('Authorization') ?? '';
    const { data: { user }, error: authError } = await createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    ).auth.getUser();
    if (authError || !user) return c.json({ error: 'Unauthorized' }, 401);

    const { network, amount, phone } = await c.req.json();
    if (!network || !amount || !phone) return c.json({ error: 'Missing fields' }, 400);

    const wallet = (await kv.get(`wallet:${user.id}`)) as { balance: number } | null;
    const balance = wallet?.balance ?? 0;

    const reference = `GO-EXT-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const result = await processExternalSend(getDb(), {
      userId: user.id, type: 'p2p_send', network, amount,
      currency: 'TZS', phone, reference, description: 'External transfer',
    }, balance);

    if (result.success) {
      await kv.set(`wallet:${user.id}`, { ...wallet, balance: balance - amount });
    }
    return c.json(result, result.success ? 200 : 400);
  } catch (e: unknown) {
    console.error('send-external error:', e);
    return c.json({ error: 'Internal error' }, 500);
  }
});

// ── Webhooks ──────────────────────────────────────────────────
paymentAggregatorApp.post('/webhook/:provider', async (c) => {
  const provider = c.req.param('provider');
  const rawBody = await c.req.text();
  const db = getDb();

  if (provider === 'selcom') {
    const sig = c.req.header('Digest') ?? '';
    const secret = Deno.env.get('SELCOM_WEBHOOK_SECRET') ?? '';
    const res = await handleSelcomWebhook(rawBody, sig, secret, db, kv);
    return c.json(res.body, res.status);
  }

  if (provider === 'flutterwave') {
    const verifHash = c.req.header('verif-hash') ?? '';
    const storedHash = Deno.env.get('FLUTTERWAVE_WEBHOOK_HASH') ?? '';
    const res = await handleFlutterwaveWebhook(rawBody, verifHash, storedHash, db, kv);
    return c.json(res.body, res.status);
  }

  return c.json({ error: 'Unknown provider' }, 400);
});
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
cd src/supabase/functions/server
deno check payment-aggregator.tsx
```

Expected: no output

- [ ] **Step 5: Commit**

```bash
git add src/supabase/functions/server/payment-aggregator.tsx
git commit -m "feat(payments): register topup/withdraw/send-external/webhook routes"
```

---

## Task 9: Frontend Test Setup

**Files:**
- Create: `vitest.config.ts`
- Modify: `package.json`

- [ ] **Step 1: Install vitest and testing library**

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

Expected: packages added to `node_modules/`, no peer dependency errors

- [ ] **Step 2: Create vitest.config.ts**

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
  },
});
```

- [ ] **Step 3: Create test setup file**

```typescript
// src/test-setup.ts
import '@testing-library/jest-dom';
```

- [ ] **Step 4: Add test script to package.json**

In `package.json`, change:
```json
"scripts": {
  "dev": "vite",
  "build": "vite build"
}
```
to:
```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

- [ ] **Step 5: Verify setup works**

```bash
npm test
```

Expected: `No test files found, exiting with code 0`

- [ ] **Step 6: Commit**

```bash
git add vitest.config.ts src/test-setup.ts package.json
git commit -m "chore: add vitest + @testing-library/react test infrastructure"
```

---

## Task 10: TopUpModal Component

**Files:**
- Create: `src/components/TopUpModal.tsx`
- Create: `src/components/__tests__/TopUpModal.test.tsx`
- Modify: `src/components/WalletPage.tsx`

- [ ] **Step 1: Write the failing tests**

```typescript
// src/components/__tests__/TopUpModal.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TopUpModal } from '../TopUpModal';

const baseProps = {
  open: true,
  onClose: vi.fn(),
  accessToken: 'test-token',
  userId: 'user-1',
  onSuccess: vi.fn(),
};

describe('TopUpModal', () => {
  it('renders network selector options', () => {
    render(<TopUpModal {...baseProps} />);
    expect(screen.getByText('M-Pesa')).toBeInTheDocument();
    expect(screen.getByText('Tigo Pesa')).toBeInTheDocument();
    expect(screen.getByText('Airtel Money')).toBeInTheDocument();
    expect(screen.getByText('HaloPesa')).toBeInTheDocument();
    expect(screen.getByText('Card')).toBeInTheDocument();
  });

  it('disables confirm button when amount is empty', () => {
    render(<TopUpModal {...baseProps} />);
    const button = screen.getByRole('button', { name: /thibitisha|confirm/i });
    expect(button).toBeDisabled();
  });

  it('enables confirm button when network and amount are set', () => {
    render(<TopUpModal {...baseProps} />);
    fireEvent.click(screen.getByText('M-Pesa'));
    const input = screen.getByPlaceholderText(/kiasi|amount/i);
    fireEvent.change(input, { target: { value: '10000' } });
    const button = screen.getByRole('button', { name: /thibitisha|confirm/i });
    expect(button).not.toBeDisabled();
  });

  it('calls onClose when cancel button clicked', () => {
    const onClose = vi.fn();
    render(<TopUpModal {...baseProps} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: /ghairi|cancel/i }));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
```

- [ ] **Step 2: Run to confirm failure**

```bash
npm test
```

Expected: `Cannot find module '../TopUpModal'`

- [ ] **Step 3: Implement TopUpModal.tsx**

```tsx
// src/components/TopUpModal.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { X, Loader2 } from 'lucide-react';
import { projectId } from '../utils/supabase/info';

type Network = 'mpesa' | 'tigo' | 'airtel' | 'halopesa' | 'card';

const NETWORKS: { id: Network; label: string; color: string }[] = [
  { id: 'mpesa',   label: 'M-Pesa',       color: '#16a34a' },
  { id: 'tigo',    label: 'Tigo Pesa',    color: '#0ea5e9' },
  { id: 'airtel',  label: 'Airtel Money', color: '#ef4444' },
  { id: 'halopesa',label: 'HaloPesa',     color: '#f97316' },
  { id: 'card',    label: 'Card',         color: '#8b5cf6' },
];

const QUICK_AMOUNTS = [5000, 10000, 20000, 50000, 100000];

interface TopUpModalProps {
  open: boolean;
  onClose: () => void;
  accessToken: string;
  userId: string;
  onSuccess: () => void;
}

export function TopUpModal({ open, onClose, accessToken, onSuccess }: TopUpModalProps) {
  const [network, setNetwork] = useState<Network | null>(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingRef, setPendingRef] = useState<string | null>(null);

  const numericAmount = parseFloat(amount) || 0;
  const canSubmit = network !== null && numericAmount > 0 && !loading;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/payment/topup`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
          body: JSON.stringify({ network, amount: numericAmount }),
        },
      );
      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.message ?? 'Imeshindwa. Jaribu tena.');
        return;
      }
      setPendingRef(data.providerRef);
      toast.info('Angalia simu yako kukamilisha malipo...', { duration: 10000 });
    } catch {
      toast.error('Hitilafu ya mtandao. Jaribu tena.');
    } finally {
      setLoading(false);
    }
  };

  const handleDone = () => {
    onSuccess();
    onClose();
    setNetwork(null);
    setAmount('');
    setPendingRef(null);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/60" onClick={onClose} />
          <motion.div
            className="relative w-full max-w-md rounded-t-3xl p-6 pb-10 space-y-5"
            style={{ background: '#0f1a0f', border: '1px solid rgba(255,255,255,0.1)' }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          >
            {pendingRef ? (
              <div className="text-center py-6 space-y-4">
                <div className="text-4xl">📲</div>
                <p style={{ color: '#4ade80', fontWeight: 700, fontSize: '18px' }}>Angalia simu yako</p>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
                  Ombi limetumwa. Thibitisha kwenye simu yako.
                </p>
                <button
                  onClick={handleDone}
                  className="w-full h-12 rounded-xl font-semibold text-white"
                  style={{ background: '#16a34a' }}
                >
                  Nimemaliza
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h2 style={{ color: '#fff', fontWeight: 700, fontSize: '18px' }}>Weka Fedha</h2>
                  <button onClick={onClose} aria-label="Ghairi">
                    <X className="size-5 text-white opacity-60" />
                  </button>
                </div>

                <div>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginBottom: '10px', letterSpacing: '0.3px' }}>
                    CHAGUA MTANDAO
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {NETWORKS.map(n => (
                      <button
                        key={n.id}
                        onClick={() => setNetwork(n.id)}
                        className="h-10 rounded-xl text-sm font-semibold transition-all"
                        style={{
                          background: network === n.id ? n.color : 'rgba(255,255,255,0.06)',
                          color: '#fff',
                          border: `1px solid ${network === n.id ? n.color : 'rgba(255,255,255,0.1)'}`,
                        }}
                      >
                        {n.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginBottom: '8px', letterSpacing: '0.3px' }}>
                    KIASI (TZS)
                  </p>
                  <input
                    type="number"
                    placeholder="Kiasi"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl outline-none"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '16px' }}
                  />
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {QUICK_AMOUNTS.map(a => (
                      <button
                        key={a}
                        onClick={() => setAmount(String(a))}
                        className="px-3 h-7 rounded-full text-xs"
                        style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' }}
                      >
                        {(a / 1000).toFixed(0)}k
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="w-full h-12 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-opacity"
                  style={{ background: canSubmit ? '#16a34a' : 'rgba(255,255,255,0.1)', opacity: canSubmit ? 1 : 0.5 }}
                  aria-label="Thibitisha"
                >
                  {loading ? <Loader2 className="size-4 animate-spin" /> : 'Thibitisha'}
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 4: Run tests — confirm pass**

```bash
npm test
```

Expected:
```
✓ src/components/__tests__/TopUpModal.test.tsx (4 tests)
Test Files  1 passed (1)
Tests  4 passed (4)
```

- [ ] **Step 5: Wire into WalletPage.tsx**

At the top of `src/components/WalletPage.tsx`, add the import:
```typescript
import { TopUpModal } from './TopUpModal';
```

Add state near the existing `showAddFunds` state:
```typescript
const [showTopUpModal, setShowTopUpModal] = useState(false);
```

Find the existing "Add Funds" button (searches for `setShowAddFunds(true)`) and add a second handler. Replace the onClick to open the new modal:
```typescript
onClick={() => setShowTopUpModal(true)}
```

Add `<TopUpModal>` before the closing `</div>` of the component's return:
```tsx
<TopUpModal
  open={showTopUpModal}
  onClose={() => setShowTopUpModal(false)}
  accessToken={accessToken}
  userId={user.id}
  onSuccess={fetchWalletData}
/>
```

- [ ] **Step 6: Build to verify no TypeScript errors**

```bash
npm run build
```

Expected: `✓ built in X.Xs` with no errors

- [ ] **Step 7: Commit**

```bash
git add src/components/TopUpModal.tsx \
        src/components/__tests__/TopUpModal.test.tsx \
        src/components/WalletPage.tsx
git commit -m "feat(payments): add TopUpModal with network selector + wire to WalletPage"
```

---

## Task 11: WithdrawModal Component

**Files:**
- Create: `src/components/WithdrawModal.tsx`
- Create: `src/components/__tests__/WithdrawModal.test.tsx`
- Modify: `src/components/WalletPage.tsx`

- [ ] **Step 1: Write the failing tests**

```typescript
// src/components/__tests__/WithdrawModal.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { WithdrawModal } from '../WithdrawModal';

const baseProps = {
  open: true,
  onClose: vi.fn(),
  accessToken: 'test-token',
  userId: 'user-1',
  balance: 50000,
  onSuccess: vi.fn(),
};

describe('WithdrawModal', () => {
  it('renders amount and phone inputs', () => {
    render(<WithdrawModal {...baseProps} />);
    expect(screen.getByPlaceholderText(/kiasi|amount/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/namba|phone/i)).toBeInTheDocument();
  });

  it('disables confirm when amount exceeds balance', () => {
    render(<WithdrawModal {...baseProps} />);
    fireEvent.click(screen.getByText('M-Pesa'));
    const amountInput = screen.getByPlaceholderText(/kiasi|amount/i);
    fireEvent.change(amountInput, { target: { value: '100000' } });
    const phoneInput = screen.getByPlaceholderText(/namba|phone/i);
    fireEvent.change(phoneInput, { target: { value: '+255712345678' } });
    const button = screen.getByRole('button', { name: /thibitisha|confirm/i });
    expect(button).toBeDisabled();
  });

  it('enables confirm when amount is within balance and phone is set', () => {
    render(<WithdrawModal {...baseProps} />);
    fireEvent.click(screen.getByText('M-Pesa'));
    const amountInput = screen.getByPlaceholderText(/kiasi|amount/i);
    fireEvent.change(amountInput, { target: { value: '10000' } });
    const phoneInput = screen.getByPlaceholderText(/namba|phone/i);
    fireEvent.change(phoneInput, { target: { value: '+255712345678' } });
    const button = screen.getByRole('button', { name: /thibitisha|confirm/i });
    expect(button).not.toBeDisabled();
  });
});
```

- [ ] **Step 2: Run to confirm failure**

```bash
npm test
```

Expected: `Cannot find module '../WithdrawModal'`

- [ ] **Step 3: Implement WithdrawModal.tsx**

```tsx
// src/components/WithdrawModal.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { X, Loader2 } from 'lucide-react';
import { projectId } from '../utils/supabase/info';

type Network = 'mpesa' | 'tigo' | 'airtel' | 'halopesa';

const NETWORKS: { id: Network; label: string; color: string }[] = [
  { id: 'mpesa',    label: 'M-Pesa',       color: '#16a34a' },
  { id: 'tigo',     label: 'Tigo Pesa',    color: '#0ea5e9' },
  { id: 'airtel',   label: 'Airtel Money', color: '#ef4444' },
  { id: 'halopesa', label: 'HaloPesa',     color: '#f97316' },
];

interface WithdrawModalProps {
  open: boolean;
  onClose: () => void;
  accessToken: string;
  userId: string;
  balance: number;
  onSuccess: () => void;
}

export function WithdrawModal({ open, onClose, accessToken, balance, onSuccess }: WithdrawModalProps) {
  const [network, setNetwork] = useState<Network | null>(null);
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingRef, setPendingRef] = useState<string | null>(null);

  const numericAmount = parseFloat(amount) || 0;
  const canSubmit =
    network !== null &&
    numericAmount > 0 &&
    numericAmount <= balance &&
    phone.trim().length >= 10 &&
    !loading;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/payment/withdraw`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
          body: JSON.stringify({ network, amount: numericAmount, phone }),
        },
      );
      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.message ?? 'Imeshindwa. Jaribu tena.');
        return;
      }
      setPendingRef(data.providerRef);
      toast.info('Fedha zinatumwa...', { duration: 10000 });
    } catch {
      toast.error('Hitilafu ya mtandao. Jaribu tena.');
    } finally {
      setLoading(false);
    }
  };

  const handleDone = () => {
    onSuccess();
    onClose();
    setNetwork(null);
    setAmount('');
    setPhone('');
    setPendingRef(null);
  };

  const formatBalance = (n: number) =>
    new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', minimumFractionDigits: 0 }).format(n);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/60" onClick={onClose} />
          <motion.div
            className="relative w-full max-w-md rounded-t-3xl p-6 pb-10 space-y-5"
            style={{ background: '#0f1a0f', border: '1px solid rgba(255,255,255,0.1)' }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          >
            {pendingRef ? (
              <div className="text-center py-6 space-y-4">
                <p style={{ color: '#4ade80', fontWeight: 700, fontSize: '18px' }}>Inatumwa</p>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
                  Fedha zinatumwa kwa {phone}
                </p>
                <button
                  onClick={handleDone}
                  className="w-full h-12 rounded-xl font-semibold text-white"
                  style={{ background: '#16a34a' }}
                >
                  Sawa
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h2 style={{ color: '#fff', fontWeight: 700, fontSize: '18px' }}>Toa Fedha</h2>
                  <button onClick={onClose} aria-label="Ghairi">
                    <X className="size-5 text-white opacity-60" />
                  </button>
                </div>

                <div className="px-4 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>Salio linalopatikana</p>
                  <p style={{ color: '#4ade80', fontWeight: 700, fontSize: '18px' }}>{formatBalance(balance)}</p>
                </div>

                <div>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginBottom: '10px', letterSpacing: '0.3px' }}>
                    CHAGUA MTANDAO
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {NETWORKS.map(n => (
                      <button
                        key={n.id}
                        onClick={() => setNetwork(n.id)}
                        className="h-10 rounded-xl text-sm font-semibold transition-all"
                        style={{
                          background: network === n.id ? n.color : 'rgba(255,255,255,0.06)',
                          color: '#fff',
                          border: `1px solid ${network === n.id ? n.color : 'rgba(255,255,255,0.1)'}`,
                        }}
                      >
                        {n.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginBottom: '8px', letterSpacing: '0.3px' }}>
                    NAMBA YA SIMU
                  </p>
                  <input
                    type="tel"
                    placeholder="Namba ya simu (+255...)"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl outline-none"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '15px' }}
                  />
                </div>

                <div>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginBottom: '8px', letterSpacing: '0.3px' }}>
                    KIASI (TZS)
                  </p>
                  <input
                    type="number"
                    placeholder="Kiasi cha kutoa"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl outline-none"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: `1px solid ${numericAmount > balance && numericAmount > 0 ? '#ef4444' : 'rgba(255,255,255,0.12)'}`,
                      color: '#fff',
                      fontSize: '16px',
                    }}
                  />
                  {numericAmount > balance && numericAmount > 0 && (
                    <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>Salio halitosha</p>
                  )}
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="w-full h-12 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-opacity"
                  style={{ background: canSubmit ? '#16a34a' : 'rgba(255,255,255,0.1)', opacity: canSubmit ? 1 : 0.5 }}
                  aria-label="Thibitisha"
                >
                  {loading ? <Loader2 className="size-4 animate-spin" /> : 'Thibitisha'}
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 4: Run tests — confirm pass**

```bash
npm test
```

Expected:
```
✓ src/components/__tests__/TopUpModal.test.tsx (4 tests)
✓ src/components/__tests__/WithdrawModal.test.tsx (3 tests)
Test Files  2 passed (2)
Tests  7 passed (7)
```

- [ ] **Step 5: Wire into WalletPage.tsx**

Add import at top:
```typescript
import { WithdrawModal } from './WithdrawModal';
```

Add state:
```typescript
const [showWithdrawModal, setShowWithdrawModal] = useState(false);
```

Find the existing "Withdraw" or send money button and change its onClick to:
```typescript
onClick={() => setShowWithdrawModal(true)}
```

Add `<WithdrawModal>` before the closing `</div>`:
```tsx
<WithdrawModal
  open={showWithdrawModal}
  onClose={() => setShowWithdrawModal(false)}
  accessToken={accessToken}
  userId={user.id}
  balance={balance}
  onSuccess={fetchWalletData}
/>
```

- [ ] **Step 6: Build to verify**

```bash
npm run build
```

Expected: `✓ built in X.Xs` with no errors

- [ ] **Step 7: Commit**

```bash
git add src/components/WithdrawModal.tsx \
        src/components/__tests__/WithdrawModal.test.tsx \
        src/components/WalletPage.tsx
git commit -m "feat(payments): add WithdrawModal and wire to WalletPage"
```

---

## Task 12: Wire SendMoneyPage External Transfer

**Files:**
- Modify: `src/components/SendMoneyPage.tsx`

- [ ] **Step 1: Locate the mobile transfer method handling**

In `SendMoneyPage.tsx`, find `handlePinComplete`. It currently sends all transfers to `/transfer/send` regardless of method. The `transferMethod` state is `'gopay' | 'mobile' | 'bank'`.

- [ ] **Step 2: Add network state and split the submit handler**

Add state after the existing state declarations:
```typescript
const [mobileNetwork, setMobileNetwork] = useState<'mpesa' | 'tigo' | 'airtel' | 'halopesa'>('mpesa');
```

In `handlePinComplete`, replace the single `fetch` call with a conditional:

```typescript
const isExternal = transferMethod === 'mobile';
const url = isExternal
  ? `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/payment/send-external`
  : `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/transfer/send`;

const body = isExternal
  ? JSON.stringify({ network: mobileNetwork, amount: numericAmount, phone: recipient })
  : JSON.stringify({ method: transferMethod, recipient, amount: numericAmount, message: note, pin: enteredPin });

const response = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
  body,
});
```

- [ ] **Step 3: Add network selector to the mobile method UI section**

Find the JSX that renders the `transferMethod === 'mobile'` section (the section with phone number input). Add a network selector above the phone input:

```tsx
{transferMethod === 'mobile' && (
  <div className="flex gap-2 flex-wrap mb-3">
    {(['mpesa','tigo','airtel','halopesa'] as const).map(n => (
      <button
        key={n}
        onClick={() => setMobileNetwork(n)}
        className="px-3 h-8 rounded-full text-xs font-semibold transition-all"
        style={{
          background: mobileNetwork === n ? '#16a34a' : 'rgba(255,255,255,0.08)',
          color: '#fff',
          border: `1px solid ${mobileNetwork === n ? '#16a34a' : 'rgba(255,255,255,0.12)'}`,
        }}
      >
        {n === 'mpesa' ? 'M-Pesa' : n === 'tigo' ? 'Tigo' : n === 'airtel' ? 'Airtel' : 'Halo'}
      </button>
    ))}
  </div>
)}
```

- [ ] **Step 4: Build to verify**

```bash
npm run build
```

Expected: `✓ built in X.Xs` with no errors

- [ ] **Step 5: Commit**

```bash
git add src/components/SendMoneyPage.tsx
git commit -m "feat(payments): wire SendMoneyPage mobile method to external payment endpoint"
```

---

## Task 13: Supabase Realtime Subscription

**Files:**
- Modify: `src/components/WalletPage.tsx`
- Modify: `src/components/SendMoneyPage.tsx`

- [ ] **Step 1: Add Supabase client import to WalletPage.tsx**

At the top of `WalletPage.tsx`, the project already imports `projectId` from `utils/supabase/info`. Add:
```typescript
import { createClient } from '@supabase/supabase-js';
import { anonKey } from '../utils/supabase/info';
```

If `anonKey` is not exported from `info.tsx`, open `src/utils/supabase/info.tsx` and add:
```typescript
export const anonKey: string =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || 'eyJhb...';
```
(copy the existing anon key value from the file)

- [ ] **Step 2: Add Realtime subscription in WalletPage.tsx**

In the `useEffect` that calls `fetchWalletData()`, add a Supabase Realtime subscription after the fetch calls:

```typescript
useEffect(() => {
  fetchWalletData();
  fetchLinkedAccounts();

  if (!accessToken) return;
  const supabase = createClient(
    `https://${projectId}.supabase.co`,
    anonKey,
    { global: { headers: { Authorization: `Bearer ${accessToken}` } } },
  );

  const channel = supabase
    .channel('wallet-transactions')
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'transactions' },
      (payload) => {
        const tx = payload.new as { status: string; type: string };
        if (tx.status === 'completed' && tx.type === 'topup') {
          fetchWalletData();
          toast.success('Fedha zimeongezwa kwenye akaunti yako!');
        }
        if (tx.status === 'failed' && (tx.type === 'withdrawal' || tx.type === 'p2p_send')) {
          fetchWalletData();
          toast.error('Uhamisho umeshindwa. Salio limerudishwa.');
        }
      },
    )
    .subscribe();

  return () => { supabase.removeChannel(channel); };
}, [accessToken]);
```

- [ ] **Step 3: Add Realtime subscription in SendMoneyPage.tsx**

In `SendMoneyPage.tsx`, add the same `createClient` import. Then in the existing `useEffect`, add after the balance fetch:

```typescript
const supabase = createClient(
  `https://${projectId}.supabase.co`,
  anonKey,
  { global: { headers: { Authorization: `Bearer ${accessToken}` } } },
);

const channel = supabase
  .channel('send-transactions')
  .on(
    'postgres_changes',
    { event: 'UPDATE', schema: 'public', table: 'transactions' },
    (payload) => {
      const tx = payload.new as { status: string; type: string };
      if (tx.status === 'completed' && tx.type === 'p2p_send') {
        toast.success('Uhamisho umekamilika!');
      }
      if (tx.status === 'failed' && tx.type === 'p2p_send') {
        toast.error('Uhamisho umeshindwa. Salio limerudishwa.');
        setBalance(b => b !== null ? b + (parseFloat(amount) || 0) : b);
      }
    },
  )
  .subscribe();

return () => { supabase.removeChannel(channel); };
```

- [ ] **Step 4: Build to verify**

```bash
npm run build
```

Expected: `✓ built in X.Xs` with no errors

- [ ] **Step 5: Run all tests**

```bash
npm test
```

Expected:
```
✓ src/components/__tests__/TopUpModal.test.tsx (4 tests)
✓ src/components/__tests__/WithdrawModal.test.tsx (3 tests)
Test Files  2 passed (2)
Tests  7 passed (7)
```

- [ ] **Step 6: Commit**

```bash
git add src/components/WalletPage.tsx src/components/SendMoneyPage.tsx src/utils/supabase/info.tsx
git commit -m "feat(payments): add Supabase Realtime subscriptions for live balance updates"
```

---

## Final Verification

- [ ] **Run full Deno test suite**

```bash
cd src/supabase/functions/server
deno test --allow-env payments/__tests__/
```

Expected:
```
ok | 15 passed | 0 failed
```

- [ ] **Run full frontend test suite**

```bash
npm test
```

Expected:
```
Tests  7 passed (7)
```

- [ ] **Production build**

```bash
npm run build
```

Expected: `✓ built in X.Xs` — zero TypeScript errors

- [ ] **Manual smoke test (demo mode)**

```bash
npm run dev
```

1. Open wallet → click "Add Funds" → TopUpModal opens → select M-Pesa → enter 10000 → Thibitisha → toast "Angalia simu yako" appears
2. Click "Withdraw" → WithdrawModal opens → select M-Pesa → enter phone → enter 5000 → Thibitisha → toast "Inatumwa" appears
3. Navigate to Send Money → select Mobile tab → network selector visible → enter phone and amount → proceed through PIN flow

---

## Environment Variables Checklist

Before going live, set these in Supabase Dashboard → Settings → Edge Functions:

| Variable | Source |
|----------|--------|
| `SELCOM_API_KEY` | Selcom developer portal |
| `SELCOM_API_SECRET` | Selcom developer portal |
| `SELCOM_VENDOR_ID` | Selcom merchant ID |
| `SELCOM_WEBHOOK_SECRET` | Set in Selcom dashboard + match here |
| `FLUTTERWAVE_SECRET_KEY` | Flutterwave dashboard |
| `FLUTTERWAVE_WEBHOOK_HASH` | Set in Flutterwave dashboard + match here |
