# goPay Supabase Edge Functions

This directory contains the Supabase Edge Functions for the goPay Tanzania Super App.

## Structure

```
/supabase/functions/
├── make-server/           # Main entry point function
│   ├── index.ts          # Entry point that Supabase expects
│   └── deno.json         # Deno configuration for this function
├── server/               # Actual application logic
│   ├── index.tsx        # Main Hono app with all routes
│   ├── kv_store.tsx     # Key-value storage utilities
│   ├── user.tsx         # User management routes
│   ├── merchant.tsx     # Merchant functionality
│   └── ...              # Other feature modules
├── deno.json            # Global Deno configuration
└── .env.example         # Example environment variables
```

## Deployment

The edge functions are automatically deployed by Figma Make when you connect to Supabase.

### Manual Deployment (if needed)

If you need to manually deploy using Supabase CLI:

```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref smoaclzhvavtuzqgogse

# Deploy the function
supabase functions deploy make-server
```

## Environment Variables

The following environment variables are automatically provided by Supabase:

- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Public anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key for admin operations

## API Endpoints

All endpoints are prefixed with `/make-server-69a10ee8/`

### Authentication
- `POST /auth/signup` - User registration

### Wallet
- `GET /wallet/balance` - Get wallet balance
- `POST /wallet/add-funds` - Add funds to wallet
- `POST /wallet/send-money` - Send money to another user
- `POST /wallet/generate-qr` - Generate QR code for receiving money
- `POST /wallet/pay-qr` - Pay using QR code

### Transactions
- `GET /transactions/recent` - Get recent transactions

### Payments
- `POST /payments/process` - Process bill payment
- `POST /payments/bill-payment` - Process bill payment with control number

### User Profile
- `GET /user/profile` - Get user profile

See individual module files for complete API documentation.

## Features

- ✅ User authentication with Supabase Auth
- ✅ Wallet management (TZS currency)
- ✅ P2P money transfers
- ✅ QR code payments
- ✅ Bill payments with BOT compliance
- ✅ Transaction history
- ✅ Linked accounts management
- ✅ Favorites system
- ✅ Merchant payments
- ✅ Shopping features
- ✅ Travel bookings (flights, hotels, car rentals)
- ✅ GoSafari tourism features
- ✅ Security & fraud detection
- ✅ Analytics & performance monitoring

## Bank of Tanzania (BOT) Compliance

The payment system includes:
- Transaction logging for regulatory compliance
- Receipt generation
- Control number support for government payments
- Fee disclosure
- Audit trails
