import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';
import shoppingApp from './shopping.tsx';
import merchantApp from './merchant.tsx';
import adminApp from './admin.tsx';
import securityApp from './security.tsx';
import moviesApp from './movies.tsx';
import billsApp from './bills.tsx';
import membershipApp from './membership.tsx';
import restaurantsApp from './restaurants.tsx';
import ridesApp from './rides.tsx';
import profileApp from './profile.tsx';
import rentalsApp from './rentals.tsx';
import driversApp from './drivers.tsx';
import userApp from './user.tsx';
import notificationsApp from './notifications.tsx';
import analyticsApp from './analytics.tsx';
import budgetsApp from './budgets.tsx';
import gosafariApp from './gosafari.tsx';
import flightsApp from './flights.tsx';
import hotelsApp from './hotels.tsx';
import carsApp from './cars.tsx';
import complianceApp from './compliance.tsx';
import travelApp from './travel.tsx';
import paymentAggregatorApp from './payment-aggregator.tsx';
import loansApp from './loans.tsx';
import recurringApp from './recurring.tsx';
import subscriptionsApp from './subscriptions.tsx';
import parcelApp from './parcel.tsx';
import rewardsApp from './rewards.tsx';
import groupsApp from './groups.tsx';

const app = new Hono();

// Middleware
app.use('*', cors({
  origin: (origin) => {
    const allowed = [
      Deno.env.get('ALLOWED_ORIGIN') || 'https://gopay.tz',
      'http://localhost:3000',
      'http://localhost:5173',
    ];
    return allowed.includes(origin) ? origin : allowed[0];
  },
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

// Mount payment aggregator routes
app.route('/make-server-69a10ee8/payment-aggregator', paymentAggregatorApp);
app.route('/make-server-69a10ee8/payment', paymentAggregatorApp);

// Mount performance routes
import performanceApp from './performance.tsx';
app.route('/make-server-69a10ee8/performance', performanceApp);

// Mount integrations routes
import integrationsApp from './integrations.tsx';
app.route('/make-server-69a10ee8/integrations', integrationsApp);

// Mount all feature sub-apps
app.route('/make-server-69a10ee8/bills',         billsApp);
app.route('/make-server-69a10ee8/shopping',      shoppingApp);
app.route('/make-server-69a10ee8/merchant',      merchantApp);
app.route('/make-server-69a10ee8/admin',         adminApp);
app.route('/make-server-69a10ee8/security',      securityApp);
app.route('/make-server-69a10ee8/movies',        moviesApp);
app.route('/make-server-69a10ee8/membership',    membershipApp);
app.route('/make-server-69a10ee8/restaurants',   restaurantsApp);
app.route('/make-server-69a10ee8/rides',         ridesApp);
app.route('/make-server-69a10ee8/profile',       profileApp);
app.route('/make-server-69a10ee8/rentals',       rentalsApp);
app.route('/make-server-69a10ee8/drivers',       driversApp);
app.route('/make-server-69a10ee8/user',          userApp);
app.route('/make-server-69a10ee8/notifications', notificationsApp);
app.route('/make-server-69a10ee8/analytics',     analyticsApp);
app.route('/make-server-69a10ee8/budgets',       budgetsApp);
app.route('/make-server-69a10ee8/gosafari',      gosafariApp);
app.route('/make-server-69a10ee8/flights',       flightsApp);
app.route('/make-server-69a10ee8/hotels',        hotelsApp);
app.route('/make-server-69a10ee8/cars',          carsApp);
// compliance mounts at root prefix so /kyc/submit and /kyc/status resolve correctly
app.route('/make-server-69a10ee8',               complianceApp);
app.route('/make-server-69a10ee8/travel',        travelApp);
app.route('/make-server-69a10ee8/loans',         loansApp);
app.route('/make-server-69a10ee8/recurring',     recurringApp);
app.route('/make-server-69a10ee8/subscriptions', subscriptionsApp);
app.route('/make-server-69a10ee8/parcel',        parcelApp);
app.route('/make-server-69a10ee8/rewards',       rewardsApp);
app.route('/make-server-69a10ee8/groups',        groupsApp);

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Utility function to verify user
async function verifyUser(authHeader: string | null) {
  if (!authHeader) {
    return null;
  }
  
  const accessToken = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  
  if (error || !user?.id) {
    return null;
  }
  
  return user.id;
}

// Verify PIN with brute-force protection
async function verifyPin(userId: string, submittedPin: string): Promise<{ ok: boolean; error?: string; status?: number }> {
  const wallet = await kv.get(`wallet:${userId}`);
  if (!wallet) return { ok: false, error: 'Wallet not found', status: 404 };

  if (wallet.pinLockedUntil && Date.now() < wallet.pinLockedUntil) {
    const seconds = Math.ceil((wallet.pinLockedUntil - Date.now()) / 1000);
    return { ok: false, error: `PIN locked. Try again in ${seconds}s`, status: 429 };
  }

  if (wallet.pin !== submittedPin) {
    const attempts = (wallet.pinAttempts || 0) + 1;
    const update: Record<string, unknown> = { ...wallet, pinAttempts: attempts };
    if (attempts >= 5) {
      update.pinLockedUntil = Date.now() + 30 * 60 * 1000;
      update.pinAttempts = 0;
    }
    await kv.set(`wallet:${userId}`, update);
    const remaining = Math.max(0, 5 - attempts);
    return {
      ok: false,
      error: remaining > 0 ? `Invalid PIN. ${remaining} attempt(s) remaining` : 'PIN locked for 30 minutes',
      status: 400,
    };
  }

  if ((wallet.pinAttempts || 0) > 0) {
    await kv.set(`wallet:${userId}`, { ...wallet, pinAttempts: 0, pinLockedUntil: null });
  }
  return { ok: true };
}

// Validate transaction amount
function validateAmount(amount: unknown): { value: number; error?: string } {
  const n = Number(amount);
  if (!Number.isFinite(n) || n <= 0) return { value: 0, error: 'Amount must be a positive number' };
  if (n > 10_000_000) return { value: 0, error: 'Amount exceeds maximum transaction limit of 10,000,000 TZS' };
  return { value: Math.floor(n) };
}

// Auth Routes
app.post('/make-server-69a10ee8/auth/signup', async (c) => {
  try {
    const { name, email, phone, nida, password } = await c.req.json();

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: false,
      user_metadata: { name, phone, nida },
    });

    if (authError) {
      console.error('Auth signup error:', authError);
      return c.json({ error: authError.message }, 400);
    }

    const userId = authData.user.id;

    // Store user profile
    await kv.set(`user:${userId}`, {
      id: userId,
      email,
      name,
      phone,
      nida,
      createdAt: new Date().toISOString(),
    });

    // Initialize wallet — PIN must be set by user before first financial operation
    await kv.set(`wallet:${userId}`, {
      userId,
      balance: 100000,
      currency: 'TZS',
      pin: null,
      pinAttempts: 0,
      pinLockedUntil: null,
    });

    // Initialize empty linked accounts
    await kv.set(`linked_accounts:${userId}`, []);

    return c.json({ success: true, userId });
  } catch (error: any) {
    console.error('Signup error:', error);
    return c.json({ error: error.message || 'Signup failed' }, 500);
  }
});

// User Profile
app.get('/make-server-69a10ee8/user/profile', async (c) => {
  const userId = await verifyUser(c.req.header('Authorization'));
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const userProfile = await kv.get(`user:${userId}`);
    
    if (!userProfile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    return c.json(userProfile);
  } catch (error: any) {
    console.error('Error fetching profile:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Wallet Balance
app.get('/make-server-69a10ee8/wallet/balance', async (c) => {
  const userId = await verifyUser(c.req.header('Authorization'));
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const wallet = await kv.get(`wallet:${userId}`);
    
    if (!wallet) {
      return c.json({ balance: 0, currency: 'TZS' });
    }

    return c.json({ balance: wallet.balance, currency: wallet.currency });
  } catch (error: any) {
    console.error('Error fetching wallet balance:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Linked Accounts
app.get('/make-server-69a10ee8/wallet/linked-accounts', async (c) => {
  const userId = await verifyUser(c.req.header('Authorization'));
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const accounts = await kv.get(`linked_accounts:${userId}`) || [];
    return c.json({ accounts });
  } catch (error: any) {
    console.error('Error fetching linked accounts:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Link Account
app.post('/make-server-69a10ee8/wallet/link-account', async (c) => {
  const userId = await verifyUser(c.req.header('Authorization'));
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { type, provider, accountNumber, pin } = await c.req.json();

    const pinCheck = await verifyPin(userId, pin);
    if (!pinCheck.ok) return c.json({ error: pinCheck.error }, pinCheck.status as number);

    const accounts = await kv.get(`linked_accounts:${userId}`) || [];

    const newAccount = {
      id: `acc_${crypto.randomUUID()}`,
      type,
      provider,
      accountNumber,
      createdAt: new Date().toISOString(),
    };

    accounts.push(newAccount);
    await kv.set(`linked_accounts:${userId}`, accounts);

    return c.json({ success: true, account: newAccount });
  } catch (error: any) {
    console.error('Error linking account:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Add Funds
app.post('/make-server-69a10ee8/wallet/add-funds', async (c) => {
  const userId = await verifyUser(c.req.header('Authorization'));
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { amount, source, pin } = await c.req.json();

    const { value: amountNum, error: amountError } = validateAmount(amount);
    if (amountError) return c.json({ error: amountError }, 400);

    const pinCheck = await verifyPin(userId, pin);
    if (!pinCheck.ok) return c.json({ error: pinCheck.error }, pinCheck.status as number);

    const wallet = await kv.get(`wallet:${userId}`);
    const newBalance = wallet.balance + amountNum;
    wallet.balance = newBalance;
    await kv.set(`wallet:${userId}`, wallet);

    // Record transaction
    const transactionId = `tx_${crypto.randomUUID()}`;
    await kv.set(`transaction:${transactionId}`, {
      id: transactionId,
      userId,
      type: 'credit',
      amount: amountNum,
      description: `Added funds from ${source}`,
      timestamp: new Date().toISOString(),
      status: 'completed',
    });

    return c.json({ success: true, newBalance });
  } catch (error: any) {
    console.error('Error adding funds:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Send Money
app.post('/make-server-69a10ee8/wallet/send-money', async (c) => {
  const userId = await verifyUser(c.req.header('Authorization'));
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { recipient, amount, pin } = await c.req.json();

    const { value: amountNum, error: amountError } = validateAmount(amount);
    if (amountError) return c.json({ error: amountError }, 400);

    const pinCheck = await verifyPin(userId, pin);
    if (!pinCheck.ok) return c.json({ error: pinCheck.error }, pinCheck.status as number);

    const wallet = await kv.get(`wallet:${userId}`);
    if (wallet.balance < amountNum) {
      return c.json({ error: 'Insufficient balance' }, 400);
    }

    wallet.balance -= amountNum;
    await kv.set(`wallet:${userId}`, wallet);

    // Record transaction
    const transactionId = `tx_${crypto.randomUUID()}`;
    await kv.set(`transaction:${transactionId}`, {
      id: transactionId,
      userId,
      type: 'debit',
      amount: amountNum,
      description: `Sent to ${recipient}`,
      timestamp: new Date().toISOString(),
      status: 'completed',
    });

    return c.json({ success: true, newBalance: wallet.balance });
  } catch (error: any) {
    console.error('Error sending money:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Alias: /transfer/send → same handler as /wallet/send-money (SendMoneyPage uses this path)
app.post('/make-server-69a10ee8/transfer/send', async (c) => {
  return app.fetch(
    new Request(c.req.url.replace('/transfer/send', '/wallet/send-money'), {
      method: c.req.method,
      headers: c.req.raw.headers,
      body: c.req.raw.body,
    }),
    c.env,
  );
});

// Recent Transactions
app.get('/make-server-69a10ee8/transactions/recent', async (c) => {
  const userId = await verifyUser(c.req.header('Authorization'));
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const allTransactions = await kv.getByPrefix('transaction:');
    const userTransactions = allTransactions
      .filter((tx: any) => tx.userId === userId)
      .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);

    return c.json({ transactions: userTransactions });
  } catch (error: any) {
    console.error('Error fetching transactions:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Full Transaction History (paginated)
app.get('/make-server-69a10ee8/transactions/history', async (c) => {
  const userId = await verifyUser(c.req.header('Authorization'));
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const limit = Math.min(Number(c.req.query('limit') ?? 20), 50);
    const offset = Math.max(Number(c.req.query('offset') ?? 0), 0);

    const allTransactions = await kv.getByPrefix('transaction:');
    const userTransactions = allTransactions
      .filter((tx: any) => tx.userId === userId)
      .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const total = userTransactions.length;
    const page = userTransactions.slice(offset, offset + limit);

    return c.json({ transactions: page, total, hasMore: offset + limit < total });
  } catch (error: any) {
    console.error('Error fetching transaction history:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Process Payment
app.post('/make-server-69a10ee8/payments/process', async (c) => {
  const userId = await verifyUser(c.req.header('Authorization'));
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { provider, accountNumber, amount, pin } = await c.req.json();

    const { value: amountNum, error: amountError } = validateAmount(amount);
    if (amountError) return c.json({ error: amountError }, 400);

    const pinCheck = await verifyPin(userId, pin);
    if (!pinCheck.ok) return c.json({ error: pinCheck.error }, pinCheck.status as number);

    const wallet = await kv.get(`wallet:${userId}`);
    if (wallet.balance < amountNum) {
      return c.json({ error: 'Insufficient balance' }, 400);
    }

    wallet.balance -= amountNum;
    await kv.set(`wallet:${userId}`, wallet);

    const reference = `PAY${crypto.randomUUID().replace(/-/g, '').slice(0, 12).toUpperCase()}`;
    const transactionId = `tx_${crypto.randomUUID()}`;
    
    await kv.set(`transaction:${transactionId}`, {
      id: transactionId,
      userId,
      type: 'debit',
      amount: amountNum,
      description: `${provider} - ${accountNumber}`,
      timestamp: new Date().toISOString(),
      status: 'completed',
      category: 'bill_payment',
    });

    // Store payment record
    await kv.set(`payment:${reference}`, {
      reference,
      userId,
      provider,
      accountNumber,
      amount: amountNum,
      timestamp: new Date().toISOString(),
    });

    return c.json({ success: true, reference, newBalance: wallet.balance })
  } catch (error: any) {
    console.error('Error processing payment:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Process Bill Payment with Control Number
app.post('/make-server-69a10ee8/payments/bill-payment', async (c) => {
  const userId = await verifyUser(c.req.header('Authorization'));
  if (!userId) {
    return c.json({ error: 'Unauthorized - Bill payment requires authentication' }, 401);
  }

  try {
    const { provider, controlNumber, accountNumber, amount, phone, pin, paymentMethod, billDetails } = await c.req.json();

    const { value: amountNum, error: amountError } = validateAmount(amount);
    if (amountError) return c.json({ error: amountError }, 400);

    const pinCheck = await verifyPin(userId, pin);
    if (!pinCheck.ok) return c.json({ error: pinCheck.error }, pinCheck.status as number);

    const wallet = await kv.get(`wallet:${userId}`);
    if (!wallet) return c.json({ error: 'Wallet not found' }, 404);

    // Check balance (Tanzania BOT regulation: ensure sufficient funds)
    if (wallet.balance < amountNum) {
      return c.json({ error: 'Insufficient balance - Please top up your wallet' }, 400);
    }

    const reference = `BP${crypto.randomUUID().replace(/-/g, '').slice(0, 12).toUpperCase()}`;
    
    // Deduct from wallet
    wallet.balance -= amountNum;
    await kv.set(`wallet:${userId}`, wallet);

    const transactionId = `tx_${crypto.randomUUID()}`;
    await kv.set(`transaction:${transactionId}`, {
      id: transactionId,
      userId,
      type: 'debit',
      amount: amountNum,
      description: `Bill Payment - ${provider}${controlNumber ? ` (CN: ${controlNumber})` : ''}`,
      timestamp: new Date().toISOString(),
      status: 'completed',
      category: 'bill_payment',
      provider: provider,
      reference: reference,
    });

    // Store payment record with control number
    await kv.set(`payment:${reference}`, {
      reference,
      userId,
      provider,
      controlNumber: controlNumber || null,
      accountNumber: accountNumber || null,
      amount: amountNum,
      phone: phone,
      paymentMethod: paymentMethod,
      billDetails: billDetails,
      timestamp: new Date().toISOString(),
      status: 'completed',
      regulatoryCompliance: {
        botRegulated: true,
        transactionLogged: true,
        receiptGenerated: true,
        timestamp: new Date().toISOString()
      }
    });

    // In production, this would call the actual provider API to process the payment
    // For TANESCO, DAWASCO, TRA, etc., integration with TEPSA/GePG systems
    // Bill payment processed — no PII in logs

    return c.json({ 
      success: true, 
      reference, 
      newBalance: wallet.balance,
      message: 'Payment successful - Receipt sent to your phone'
    });
  } catch (error: any) {
    console.error('Error processing bill payment:', error);
    return c.json({ error: error.message || 'Payment processing failed' }, 500);
  }
});

// Generate Personal QR Code for receiving money
app.post('/make-server-69a10ee8/wallet/generate-qr', async (c) => {
  const userId = await verifyUser(c.req.header('Authorization'));
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { amount } = await c.req.json();
    const userProfile = await kv.get(`user:${userId}`);
    
    const qrCode = `PAY_${userId}_${amount || 0}_${Date.now()}`;
    
    // Store QR code details
    await kv.set(`qr:${qrCode}`, {
      qrCode,
      userId,
      userName: userProfile.name,
      amount: amount ? parseInt(amount) : 0,
      createdAt: new Date().toISOString(),
      status: 'active',
      type: 'personal',
    });

    return c.json({ qrCode, amount: amount || 0, userName: userProfile.name });
  } catch (error: any) {
    console.error('Error generating QR code:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Request Money
app.post('/make-server-69a10ee8/wallet/request-money', async (c) => {
  const userId = await verifyUser(c.req.header('Authorization'));
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { recipient, amount, message } = await c.req.json();
    const userProfile = await kv.get(`user:${userId}`);
    
    const requestId = `REQ_${Date.now()}`;
    
    await kv.set(`request:${requestId}`, {
      requestId,
      fromUserId: userId,
      fromUserName: userProfile.name,
      recipient,
      amount: parseInt(amount),
      message,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });

    return c.json({ success: true, requestId });
  } catch (error: any) {
    console.error('Error requesting money:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Pay QR Code (Personal or Merchant)
app.post('/make-server-69a10ee8/wallet/pay-qr', async (c) => {
  const userId = await verifyUser(c.req.header('Authorization'));
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { qrCode, amount, pin } = await c.req.json();

    const pinCheck = await verifyPin(userId, pin);
    if (!pinCheck.ok) return c.json({ error: pinCheck.error }, pinCheck.status as number);

    const wallet = await kv.get(`wallet:${userId}`);
    const qrData = await kv.get(`qr:${qrCode}`);
    if (!qrData || qrData.status !== 'active') {
      return c.json({ error: 'Invalid or expired QR code' }, 400);
    }

    const paymentAmount = qrData.amount > 0 ? qrData.amount : parseInt(amount);

    if (wallet.balance < paymentAmount) {
      return c.json({ error: 'Insufficient balance' }, 400);
    }

    // Deduct from payer
    wallet.balance -= paymentAmount;
    await kv.set(`wallet:${userId}`, wallet);

    // Add to recipient
    const recipientWallet = await kv.get(`wallet:${qrData.userId}`);
    if (recipientWallet) {
      recipientWallet.balance += paymentAmount;
      await kv.set(`wallet:${qrData.userId}`, recipientWallet);
    }

    // Mark QR as used if it's a one-time QR with fixed amount
    if (qrData.amount > 0) {
      qrData.status = 'used';
      await kv.set(`qr:${qrCode}`, qrData);
    }

    // Record transactions
    const transactionId = `tx_${crypto.randomUUID()}`;
    await kv.set(`transaction:${transactionId}`, {
      id: transactionId,
      userId,
      type: 'debit',
      amount: paymentAmount,
      description: `Payment to ${qrData.userName || 'merchant'}`,
      timestamp: new Date().toISOString(),
      status: 'completed',
      category: 'qr_payment',
    });

    const recipientTxId = `tx_${crypto.randomUUID()}`;
    await kv.set(`transaction:${recipientTxId}`, {
      id: recipientTxId,
      userId: qrData.userId,
      type: 'credit',
      amount: paymentAmount,
      description: `Received from user`,
      timestamp: new Date().toISOString(),
      status: 'completed',
      category: 'qr_payment',
    });

    return c.json({ 
      success: true, 
      amount: paymentAmount, 
      newBalance: wallet.balance,
      recipientName: qrData.userName 
    });
  } catch (error: any) {
    console.error('Error processing QR payment:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Get User Favorites
app.get('/make-server-69a10ee8/favorites', async (c) => {
  const userId = await verifyUser(c.req.header('Authorization'));
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const favorites = await kv.get(`favorites:${userId}`) || [];
    return c.json({ favorites });
  } catch (error: any) {
    console.error('Error fetching favorites:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Add to Favorites
app.post('/make-server-69a10ee8/favorites/add', async (c) => {
  const userId = await verifyUser(c.req.header('Authorization'));
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { type, provider, accountNumber, name } = await c.req.json();
    
    const favorites = await kv.get(`favorites:${userId}`) || [];
    
    const newFavorite = {
      id: `fav_${Date.now()}`,
      type,
      provider,
      accountNumber,
      name,
      createdAt: new Date().toISOString(),
    };

    favorites.push(newFavorite);
    await kv.set(`favorites:${userId}`, favorites);

    return c.json({ success: true, favorite: newFavorite });
  } catch (error: any) {
    console.error('Error adding favorite:', error);
    return c.json({ error: error.message }, 500);
  }
});

export default app;

// Deno.serve is now called from /supabase/functions/make-server/index.ts
// This allows the app to be imported and served from the proper entry point