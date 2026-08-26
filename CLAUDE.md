# CLAUDE.md — gopay

Instructions for AI coding agents (Claude Code and others) working in this repository.

## Project Overview

East African fintech super app. Wallet, mobile-money-style payments, government services, and merchant tools for the Tanzanian market. Currently pre-license: no real payment provider is connected, and the product is deliberately in sandbox/demo mode pending Bank of Tanzania (BoT) licensing and local incorporation.

## Product Purpose

Give East African users a single app for wallet balance, sending/receiving money, and paying bills — architected so that swapping the sandbox payment layer for a real regulated one (Selcom, M-Pesa, ClickPesa) is a configuration change, not a rewrite.

## Repository Structure

- `src/` — React/Vite frontend. `components/` holds screens (WalletPage.tsx, etc.); `utils/dataService.ts` is the shared API client used by multiple screens — check here first before assuming a screen's inline fetch call is the only caller of an endpoint.
- `supabase/functions/make-server-69a10ee8/` — the real, live edge function backend (Hono/Deno). 24+ route modules (wallet, shopping, rides, bills, compliance, payment-aggregator, etc.). **This is the one deployed function** — verify with `supabase functions list` before assuming any other `functions/*` directory is live; this repo has at least two other candidate directories (`server/`, `make-server/`) that are likely stale duplicates and have not been fully verified as dead.
- `supabase/functions/make-server-69a10ee8/providers/` — `IPaymentProvider.ts` interface + `MockPaymentProvider.ts`. Not yet wired into `payment-aggregator.tsx`, which still calls each carrier directly.
- `src/archive/` — ~112 historical "COMPLETE"/"PRODUCTION_READY" dev-session docs, moved here because their claims did not match the actual database state. Do not treat their content as current fact.

## Technology Stack

- Frontend: React, Vite, TypeScript
- Backend: Supabase Edge Functions (Deno, Hono)
- Database: Supabase Postgres
- Deployment: Vercel/Replit (frontend), Supabase (backend)

## Architecture

Wallet balance is derived from an **append-only ledger** (`gopay_ledger` table), never a mutable field. All balance-affecting writes go through the `process_wallet_transaction()` Postgres function, which:
- Claims a client-supplied idempotency key via `idempotency_keys` (unique constraint) — a retried request with the same key returns the cached result instead of re-running
- Uses `pg_advisory_xact_lock(hashtext(user_id::text))` to serialize concurrent writes per user
- Is `SECURITY DEFINER`, callable only via the service-role client — there is no client INSERT policy on the ledger table at all

When adding any new balance-affecting endpoint, call this function. Do not reintroduce direct `wallet.balance -= amount` mutation — that pattern caused a real double-processing bug (no idempotency, `Date.now()`-based IDs) that this architecture replaced.

## Development Workflow

`feature/* → dev → staging → main`. `main` and `staging` are protected (1 approval required, admins not exempt, CI must pass). Never push directly to `main`.

## Environment Variables

See `.env.example`. `SUPABASE_SERVICE_ROLE_KEY` is edge-function-only — never reference it from frontend code.

## Running Locally

```bash
npm install
npm run dev
```

## Testing / Linting / Build

`npm run build` is the current CI gate. No lint or test script exists yet in this repo's `package.json` — do not claim test coverage that isn't there.

## Database

Real tables: `gopay_ledger`, `idempotency_keys`, `gopay_wallet_balance` (view, `security_invoker`). Legacy: a generic `kv_store` table holds most other app state (wallet metadata, non-financial records) — this is a real, deliberate architecture choice from the original build, not a placeholder to "fix."

## Security

- Wallet PINs are compared in plaintext (`wallet.pin !== pin`) across ~12 call sites. This is a known, unresolved gap — do not assume it's handled.
- Do not wire real payment provider credentials or claim BoT licensing/certification. This is a hard product boundary, not a technical one.

## AI Agent Rules

- Before touching wallet/payment code, read `payment-aggregator.tsx` and confirm which provider path (Selcom/M-Pesa/ClickPesa/mock) a change actually affects.
- Before adding a new edge function file, confirm which `functions/*` directory is actually deployed (see Repository Structure above) — do not assume the first one you find.
- Do not add "Live"/"Active" UI labels to anything not actually wired to a real backend call.

## Definition of Done

Build passes. Any new balance-affecting endpoint uses `process_wallet_transaction()`, not direct mutation. No new hardcoded credentials, demo balances, or PINs. State what changed, why, and what wasn't touched.
