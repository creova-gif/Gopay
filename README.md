# goPay 🟢

**A mobile-first financial super app built for East Africa — payments, government services, travel, and rewards in one place, Swahili-first from day one.**

[![Status](https://img.shields.io/badge/status-active_development-yellow)]()
[![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-blue)]()
[![License](https://img.shields.io/badge/license-proprietary-red)]()

![goPay demo screen](docs/screenshots/dashboard.png)

## Overview

goPay is a fintech super app designed around how money actually moves in East African markets — not a Western banking app translated into Swahili. It combines everyday payments, bill and government-service payments, travel booking, and a loyalty layer (GoRewards) into a single native mobile experience, with an offline USSD fallback path for users without reliable data access.

## Problem

Existing East African payment apps are either narrow single-purpose tools (mobile money only) or Western fintech products with localization bolted on afterward. Users juggle multiple apps for payments, bills, and government services, and low-connectivity users are often excluded entirely.

## Solution

A single native app, Swahili-first from the ground up, covering payments, government services, and travel, with an explicit offline fallback path. Positioning is closest to Revolut, WeChat Pay, and Selcom — but built specifically around Tanzanian payment rails and regulatory expectations rather than adapted after the fact.

## Key Capabilities

- Peer-to-peer transfers, merchant payments, bill pay
- Government services (integration path in progress)
- In-app travel booking
- GoRewards — loyalty and cashback across all transaction types
- Merchant-facing tools for accepting payments
- USSD fallback for low-connectivity users

## Architecture

Wallet balance is derived from an append-only ledger (`gopay_ledger`), never a mutable field — every balance-affecting write goes through a single Postgres function (`process_wallet_transaction`) that enforces idempotency via a client-supplied key and serializes concurrent writes per user with an advisory lock. This replaced an earlier direct-mutation pattern with no retry protection.

A provider-abstraction interface (`IPaymentProvider`) exists so that swapping the sandbox payment layer for a real regulated carrier (Selcom, M-Pesa, ClickPesa) after licensing is a configuration change, not a rewrite — though it is not yet wired into the live payment-routing code.

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend framework | React + Vite |
| UI components | Radix UI |
| Mobile shell | Capacitor (iOS + Android from one codebase) |
| Backend | Supabase Edge Functions (Deno, Hono) |
| Database | Supabase Postgres — append-only ledger, not mutable balance fields |
| Native builds | Android via Gradle, iOS via CocoaPods/Xcode |

## Repository Structure

```
Gopay/
├── android/                                  # Native Android project (Capacitor)
├── ios/                                      # Native iOS project (Capacitor)
├── src/                                      # React application source
├── supabase/functions/make-server-69a10ee8/  # Live edge function backend
├── .env.example
└── STORE_SUBMISSION.md
```

## Getting Started

### Prerequisites
- Node.js 18+, npm
- For mobile builds: Xcode (iOS) and/or Android Studio (Android)

### Installation

```bash
git clone https://github.com/creova-gif/gopay.git
cd gopay
npm install
```

## Configuration

Copy `.env.example` to `.env`:

| Variable | Required | Notes |
|---|---|---|
| `VITE_SUPABASE_PROJECT_ID` | Yes | Your Supabase project ID |
| `VITE_SUPABASE_ANON_KEY` | Yes | Public anon key only — never the service role key |

## Development

```bash
npm run dev
```

## Testing

No automated test suite currently exists. `npm run build` is the CI gate.

## Build

```bash
npm run build
npx cap sync
npx cap open ios      # requires macOS + Xcode
npx cap open android  # requires Android Studio
```

Full app store submission steps (bundle IDs, signing, store listing requirements) are in `STORE_SUBMISSION.md`.

## Security

- Wallet PIN comparison is currently plaintext across roughly a dozen call sites — a known, unresolved gap.
- Real payment provider credentials are deliberately not wired. This is a hard product boundary pending Bank of Tanzania licensing and local incorporation, not a technical limitation.
- Regulatory positioning note: goPay is being built with Tanzanian financial regulatory requirements in mind. Formal compliance status should be confirmed by legal/compliance review before being stated as fact in any investor-facing material.

## Project Status

Active development, pre-launch. Core UI, mobile shell, and the financial ledger/idempotency backend are built. Government services integration, real payment provider connection, and formal regulatory sign-off are outstanding.

## Roadmap

- [x] Core UI and navigation
- [x] Mobile shell (iOS + Android via Capacitor)
- [x] Append-only ledger + idempotency backend
- [ ] Government services integration
- [ ] PIN hashing (currently plaintext)
- [ ] Formal regulatory compliance review and sign-off
- [ ] App store submission

## Contributing

Private, proprietary CREOVA product. External contributions are not accepted at this time.

## License

Proprietary — All Rights Reserved. See `LICENSE`.

## Author / Organization

Built by [Justin Mafie](https://github.com/creova-gif) under CREOVA.

## Documentation

See `CLAUDE.md` for AI-agent-specific implementation notes (which edge function directory is actually live, known architectural rules). One of three connected products in the [East Africa Fintech Thesis](https://github.com/creova-gif/creova/blob/main/EAST-AFRICA-FINTECH-THESIS.md), alongside [Sauti-Os](https://github.com/creova-gif/sauti-os) and [Kultr-Hub](https://github.com/creova-gif/kultr-hub) — this is the consumer-facing app where earnings, payments, and everyday financial life happen.
