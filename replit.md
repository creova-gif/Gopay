# GOPAY - Replit Configuration & Architecture Guide

## Overview

GOPAY is a Tanzania-focused fintech super app (Progressive Web App) built with React and TypeScript. It is designed to serve as a comprehensive digital wallet and lifestyle platform for the Tanzanian market, offering:

- Digital wallet with TZS currency support
- Mobile money integration (M-Pesa, Airtel Money, Tigo Pesa, Halopesa)
- Bill payments (TANESCO, DAWASCO, government services)
- Travel bookings (flights, ferries, buses)
- Merchant payments via QR code
- GOrewards loyalty program
- AI assistants and spending insights
- Micro-loans, group money pools, and multi-currency support

The app is exported from a Figma Make project and targets Swahili-speaking users in Tanzania, with Swahili-first UI labeling and Bank of Tanzania (BoT) compliance considerations.

---

## User Preferences

Preferred communication style: Simple, everyday language.

---

## System Architecture

### Frontend Architecture

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with `@vitejs/plugin-react`
- **Styling**: Tailwind CSS v4 (via `@tailwindcss/vite` plugin)
- **UI Components**: shadcn/ui pattern using Radix UI primitives for accessible, unstyled components
- **Animation**: Framer Motion (via `motion` package)
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Charts**: Recharts for analytics/spending visualization
- **Routing**: Manual page-state routing — a `currentPage` string state in `App.tsx` drives which component renders. There is no React Router; navigation is done via `setCurrentPage()` callbacks passed as `onNavigate` props.

### Page State Navigation Pattern

```
App.tsx holds currentPage state
  → Conditionally renders the correct page component
  → Each component receives onNavigate and onBack callbacks
  → No URL-based routing
```

All page components live in `src/components/`. Key pages include:
- `Dashboard.tsx` — main home screen with bottom navigation tabs
- `WalletPage.tsx`, `PaymentsPage.tsx`, `BillPaymentsPage.tsx`
- `SendMoneyPage.tsx`, `QRScanner.tsx`
- `TravelPageRedesigned.tsx`, `FerryBookingPage.tsx`
- `GOrewardsUltimate.tsx`, `InsightsPage.tsx`, `BudgetTracker.tsx`
- `SecuritySettings.tsx`, `SettingsPage.tsx`, `NotificationCenter.tsx`
- `MerchantPage.tsx`, `MerchantDashboard.tsx`, `MerchantOnboarding.tsx`
- `GovernmentServicesPage.tsx`, `MicroLoansPage.tsx`, `GroupMoneyPools.tsx`
- `MultiCurrencyWallet.tsx`, `ServicesHub.tsx`, `PerformanceMonitor.tsx`
- `AuthPage.tsx` — handles login/signup via Supabase

### User Type

```typescript
export type User = {
  id: string;
  email: string;
  name: string;
  phone: string;
  nida: string;         // Tanzania National ID
  profilePhoto?: string;
  loyaltyPoints?: number;
};
```

### Backend Architecture

- **Backend-as-a-Service**: Supabase (PostgreSQL + Auth + Realtime + Edge Functions)
- **Edge Functions**: Hono framework (`hono@4.0.0`) used inside Supabase Edge Functions for API route handling
- **API Base**: Supabase Edge Functions deployed at `https://{projectId}.supabase.co/functions/v1/`
- **Supabase Client**: Initialized in `src/utils/supabase/client.ts`; project info in `src/utils/supabase/info.ts`

Key backend capabilities:
- User authentication (email/password via `supabase.auth`)
- KV-style data storage patterns for user profiles, balances, and transactions
- Payment processing routes integrated with ClickPesa gateway
- Performance monitoring middleware

### Payment Integration

- **Primary Gateway**: ClickPesa (exclusive for mobile money and card payments in Tanzania)
  - Supports M-Pesa, Airtel Money, Tigo Pesa, Halopesa, Visa/Mastercard
  - Environment variables: `CLICKPESA_API_KEY`, `CLICKPESA_SECRET_KEY`, `CLICKPESA_MERCHANT_ID`
- **Direct Telco APIs**: Vodacom M-Pesa Daraja API, Airtel Money API (for direct integration)
- **Additional Aggregators**: Selcom, Pesapal, PayChangu, Jenga API (documented but secondary)

### PWA Support

- The app is configured as a Progressive Web App (PWA)
- Service worker located at `/public/service-worker.js`
- `InstallPrompt.tsx` component detects iOS/Android and guides users to install
- Offline-first features for QR payments and core wallet functions

### Asset Management

Static image assets (from Figma export) are aliased in `vite.config.ts`:
```
figma:asset/*.png → ./src/assets/*.png
```

---

## External Dependencies

### Core Runtime Dependencies

| Package | Purpose |
|---|---|
| `react` / `react-dom` | UI framework |
| `@vitejs/plugin-react` | Vite React support |
| `@tailwindcss/vite` | Tailwind CSS v4 integration |
| `@supabase/supabase-js` | Backend auth, database, realtime |
| `@jsr/supabase__supabase-js` | JSR mirror of Supabase client |
| `hono` | Lightweight HTTP framework for Edge Functions |
| `lucide-react` | Icon library |
| `motion` | Animation library (Framer Motion) |
| `recharts` | Charts for analytics/spending |
| `react-hook-form` | Form state management |
| `next-themes` | Dark/light theme switching |
| `embla-carousel-react` | Carousels for onboarding/promos |
| `input-otp` | OTP/PIN input component |
| `cmdk` | Command palette |
| `vaul` | Drawer/bottom sheet component |
| `sonner` | Toast notifications |
| `react-day-picker` | Date picker for bookings |
| `class-variance-authority` | Variant-based className management |
| `clsx` | Conditional classNames |

### Radix UI Primitives (via shadcn/ui pattern)

Full suite of `@radix-ui/react-*` components including: accordion, alert-dialog, avatar, checkbox, dialog, dropdown-menu, label, popover, progress, radio-group, scroll-area, select, separator, slider, switch, tabs, toggle, tooltip, and more.

### External Services & APIs

| Service | Purpose | Configuration |
|---|---|---|
| **Supabase** | Auth, database, edge functions | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` in env |
| **ClickPesa** | Mobile money + card payments (Tanzania) | `CLICKPESA_API_KEY`, `CLICKPESA_SECRET_KEY` in Supabase secrets |
| **Vodacom Daraja API** | Direct M-Pesa integration | API credentials in Supabase secrets |
| **Airtel Money API** | Direct Airtel integration | API credentials in Supabase secrets |
| **NIDA** | Tanzania National ID verification for KYC | Government API |
| **TANESCO / DAWASCO / TRA** | Utility and government bill payments | Via ClickPesa or N-Lynx |

### Development Commands

```bash
npm i          # Install dependencies
npm run dev    # Start Vite dev server
npm run build  # Production build
```