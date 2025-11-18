import { Hono } from 'npm:hono';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

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

// Get membership status
app.get('/status', async (c) => {
  const userId = await verifyUser(c.req.header('Authorization'));
  
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const membershipKey = `membership:${userId}`;
    let membership = await kv.get(membershipKey);

    // If no membership exists, create free tier
    if (!membership) {
      membership = {
        tier: 'free',
        startDate: new Date().toISOString(),
        expiryDate: null,
        autoRenew: false,
      };
      await kv.set(membershipKey, membership);
    }

    // Check if membership has expired
    if (membership.expiryDate && new Date(membership.expiryDate) < new Date()) {
      membership.tier = 'free';
      membership.expiryDate = null;
      membership.autoRenew = false;
      await kv.set(membershipKey, membership);
    }

    return c.json({ membership });
  } catch (error: any) {
    console.error('Error fetching membership status:', error);
    return c.json({ error: error.message || 'Failed to fetch membership' }, 500);
  }
});

// Subscribe to membership
app.post('/subscribe', async (c) => {
  const userId = await verifyUser(c.req.header('Authorization'));
  
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { planId, planName, amount, period, pin } = await c.req.json();

    // Validate required fields
    if (!planId || !planName || !amount || !period || !pin) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Get wallet
    const wallet = await kv.get(`wallet:${userId}`);
    if (!wallet) {
      return c.json({ error: 'Wallet not found' }, 404);
    }

    // Verify PIN
    if (wallet.pin !== pin) {
      return c.json({ error: 'Invalid PIN' }, 401);
    }

    // Check balance
    if (wallet.balance < amount) {
      return c.json({ error: 'Insufficient balance' }, 400);
    }

    // Deduct from wallet
    const newBalance = wallet.balance - amount;
    await kv.set(`wallet:${userId}`, {
      ...wallet,
      balance: newBalance,
    });

    // Calculate expiry date
    const startDate = new Date();
    const expiryDate = new Date();
    if (period === 'annual') {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    } else {
      expiryDate.setMonth(expiryDate.getMonth() + 1);
    }

    // Update membership
    const membership = {
      tier: planId,
      startDate: startDate.toISOString(),
      expiryDate: expiryDate.toISOString(),
      autoRenew: true,
    };

    await kv.set(`membership:${userId}`, membership);

    // Track platform revenue (100% of subscription goes to business owner)
    const revenueKey = `platform_revenue:memberships`;
    const currentRevenue = await kv.get(revenueKey) || { totalRevenue: 0, totalSubscriptions: 0 };
    await kv.set(revenueKey, {
      totalRevenue: currentRevenue.totalRevenue + amount,
      totalSubscriptions: currentRevenue.totalSubscriptions + 1,
      lastUpdated: new Date().toISOString(),
    });

    // Track daily revenue
    const today = new Date().toISOString().split('T')[0];
    const dailyRevenueKey = `daily_revenue:${today}`;
    const dailyRevenue = await kv.get(dailyRevenueKey) || { 
      date: today,
      movies: 0,
      shopping: 0,
      travel: 0,
      bills: 0,
      memberships: 0,
      total: 0
    };
    await kv.set(dailyRevenueKey, {
      ...dailyRevenue,
      memberships: (dailyRevenue.memberships || 0) + amount,
      total: dailyRevenue.total + amount,
    });

    // Store transaction
    const transaction = {
      id: `txn-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      userId,
      type: 'membership_subscription',
      category: 'subscription',
      description: `${planName} Subscription`,
      amount: amount,
      status: 'completed',
      timestamp: new Date().toISOString(),
    };

    const transactionsKey = `transactions:${userId}`;
    const transactions = await kv.get(transactionsKey) || [];
    transactions.unshift(transaction);
    await kv.set(transactionsKey, transactions);

    return c.json({
      success: true,
      membership,
      newBalance,
    });

  } catch (error: any) {
    console.error('Error subscribing to membership:', error);
    return c.json({ error: error.message || 'Subscription failed' }, 500);
  }
});

// Cancel membership
app.post('/cancel', async (c) => {
  const userId = await verifyUser(c.req.header('Authorization'));
  
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const membershipKey = `membership:${userId}`;
    const membership = await kv.get(membershipKey);

    if (!membership) {
      return c.json({ error: 'No active membership' }, 404);
    }

    // Set autoRenew to false
    membership.autoRenew = false;
    await kv.set(membershipKey, membership);

    return c.json({
      success: true,
      message: 'Membership will not auto-renew',
      membership
    });

  } catch (error: any) {
    console.error('Error canceling membership:', error);
    return c.json({ error: error.message || 'Failed to cancel membership' }, 500);
  }
});

// Get membership benefits/discounts for transactions
app.get('/benefits', async (c) => {
  const userId = await verifyUser(c.req.header('Authorization'));
  
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const membershipKey = `membership:${userId}`;
    const membership = await kv.get(membershipKey) || { tier: 'free' };

    // Check if membership has expired
    if (membership.expiryDate && new Date(membership.expiryDate) < new Date()) {
      membership.tier = 'free';
    }

    // Define benefits based on tier
    const benefits = {
      free: {
        serviceFeeRate: 0.15, // 15%
        cashbackRate: 0.01, // 1%
        freeDeliveries: 0,
        monthlyVouchers: 0,
        prioritySupport: false,
      },
      plus: {
        serviceFeeRate: 0.10, // 10%
        cashbackRate: 0.03, // 3%
        freeDeliveries: 10,
        monthlyVouchers: 50000,
        prioritySupport: true,
      },
      premium: {
        serviceFeeRate: 0.05, // 5%
        cashbackRate: 0.05, // 5%
        freeDeliveries: -1, // unlimited
        monthlyVouchers: 150000,
        prioritySupport: true,
        vipSupport: true,
      }
    };

    return c.json({
      tier: membership.tier,
      benefits: benefits[membership.tier as keyof typeof benefits] || benefits.free,
      membership
    });

  } catch (error: any) {
    console.error('Error fetching membership benefits:', error);
    return c.json({ error: error.message || 'Failed to fetch benefits' }, 500);
  }
});

export default app;
