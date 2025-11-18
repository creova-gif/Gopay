import { Hono } from 'npm:hono';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Verify user helper
async function verifyUser(authHeader: string | null) {
  if (!authHeader) return null;
  const accessToken = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user?.id) return null;
  return user.id;
}

// Pay bill
app.post('/pay', async (c) => {
  try {
    const userId = await verifyUser(c.req.header('Authorization'));
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { provider, formData, amount, paymentMethod, pin, saveAsFavorite, nickname, schedulePayment } = await c.req.json();

    // Calculate fees and commission
    const commission = Math.round(amount * 0.15); // Your 15% profit
    
    let processingFee = 0;
    if (paymentMethod === 'card') {
      processingFee = Math.round(amount * 0.025); // 2.5% for cards
    } else if (['mpesa', 'tigopesa', 'airtelmoney', 'halopesa', 'ezypesa'].includes(paymentMethod)) {
      processingFee = Math.round(amount * 0.01); // 1% for mobile money
    } else if (['crdb', 'nmb', 'nbc', 'equity', 'stanbic'].includes(paymentMethod)) {
      processingFee = Math.round(amount * 0.015); // 1.5% for bank transfers
    }
    // goPay wallet has 0% processing fee
    
    const totalFees = commission + processingFee;
    const totalAmount = amount + totalFees;

    // In production, validate PIN and process payment through payment gateway
    // For demo, simulate successful payment
    
    const transactionId = `TXN${Date.now()}`;
    const transaction = {
      id: transactionId,
      userId,
      provider,
      formData,
      billAmount: amount,
      commission,
      processingFee,
      totalFees,
      totalAmount,
      paymentMethod,
      status: 'success',
      timestamp: new Date().toISOString(),
      type: 'bill_payment'
    };

    // Store transaction
    await kv.set(`transaction:${transactionId}`, JSON.stringify(transaction));

    // Store commission earnings (your revenue)
    const commissionRecord = {
      transactionId,
      userId,
      amount: commission,
      processingFee,
      totalEarned: totalFees,
      timestamp: new Date().toISOString(),
      provider,
      paymentMethod
    };
    await kv.set(`commission:${transactionId}`, JSON.stringify(commissionRecord));

    // Update total platform revenue
    const revenueData = await kv.get('platform_revenue');
    const currentRevenue = revenueData ? JSON.parse(revenueData) : { total: 0, transactions: 0 };
    currentRevenue.total += totalFees;
    currentRevenue.transactions += 1;
    await kv.set('platform_revenue', JSON.stringify(currentRevenue));

    // If goPay payment, deduct total amount from wallet balance
    if (paymentMethod === 'gopay') {
      const balanceData = await kv.get(`wallet:${userId}`);
      const currentBalance = balanceData ? JSON.parse(balanceData) : { balance: 450000, currency: 'TZS' };
      const newBalance = {
        balance: currentBalance.balance - totalAmount,
        currency: 'TZS'
      };
      await kv.set(`wallet:${userId}`, JSON.stringify(newBalance));
    }

    // Save as favorite if requested
    if (saveAsFavorite && nickname) {
      const favoriteId = `fav_${Date.now()}`;
      const favorite = {
        id: favoriteId,
        userId,
        provider,
        accountNumber: formData[Object.keys(formData)[0]],
        nickname,
        lastAmount: amount,
        createdAt: new Date().toISOString()
      };
      await kv.set(`favorite:${userId}:${favoriteId}`, JSON.stringify(favorite));
    }

    // Handle scheduled payment
    if (schedulePayment) {
      const scheduleId = `schedule_${Date.now()}`;
      const schedule = {
        id: scheduleId,
        userId,
        provider,
        formData,
        amount,
        paymentMethod,
        frequency: 'monthly',
        nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        active: true
      };
      await kv.set(`schedule:${userId}:${scheduleId}`, JSON.stringify(schedule));
    }

    return c.json({
      success: true,
      transactionId,
      commission,
      totalFees,
      totalAmount,
      message: 'Payment successful'
    });
  } catch (error) {
    console.error('Bill payment error:', error);
    return c.json({ error: 'Payment failed' }, 500);
  }
});

// Get saved billers (favorites)
app.get('/favorites', async (c) => {
  try {
    const userId = await verifyUser(c.req.header('Authorization'));
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const favorites = await kv.getByPrefix(`favorite:${userId}:`);
    const favoritesData = favorites.map(f => JSON.parse(f));

    return c.json({ favorites: favoritesData });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return c.json({ favorites: [] });
  }
});

// Get recent bill payments
app.get('/recent', async (c) => {
  try {
    const userId = await verifyUser(c.req.header('Authorization'));
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Get all transactions and filter for bill payments
    const transactions = await kv.getByPrefix(`transaction:`);
    const billPayments = transactions
      .map(t => JSON.parse(t))
      .filter(t => t.userId === userId && t.type === 'bill_payment')
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);

    return c.json({ payments: billPayments });
  } catch (error) {
    console.error('Error fetching recent payments:', error);
    return c.json({ payments: [] });
  }
});

// Get scheduled payments
app.get('/scheduled', async (c) => {
  try {
    const userId = await verifyUser(c.req.header('Authorization'));
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const schedules = await kv.getByPrefix(`schedule:${userId}:`);
    const scheduledData = schedules.map(s => JSON.parse(s)).filter(s => s.active);

    return c.json({ schedules: scheduledData });
  } catch (error) {
    console.error('Error fetching scheduled payments:', error);
    return c.json({ schedules: [] });
  }
});

// Delete favorite
app.delete('/favorites/:id', async (c) => {
  try {
    const userId = await verifyUser(c.req.header('Authorization'));
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const favoriteId = c.req.param('id');
    await kv.del(`favorite:${userId}:${favoriteId}`);

    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting favorite:', error);
    return c.json({ error: 'Failed to delete favorite' }, 500);
  }
});

// Cancel scheduled payment
app.delete('/scheduled/:id', async (c) => {
  try {
    const userId = await verifyUser(c.req.header('Authorization'));
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const scheduleId = c.req.param('id');
    const scheduleData = await kv.get(`schedule:${userId}:${scheduleId}`);
    
    if (scheduleData) {
      const schedule = JSON.parse(scheduleData);
      schedule.active = false;
      await kv.set(`schedule:${userId}:${scheduleId}`, JSON.stringify(schedule));
    }

    return c.json({ success: true });
  } catch (error) {
    console.error('Error canceling scheduled payment:', error);
    return c.json({ error: 'Failed to cancel schedule' }, 500);
  }
});

// Get platform revenue (Admin only)
app.get('/revenue', async (c) => {
  try {
    const userId = await verifyUser(c.req.header('Authorization'));
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Get total platform revenue
    const revenueData = await kv.get('platform_revenue');
    const revenue = revenueData ? JSON.parse(revenueData) : { total: 0, transactions: 0 };

    // Get all commission records
    const commissions = await kv.getByPrefix('commission:');
    const commissionRecords = commissions.map(c => JSON.parse(c));

    // Calculate breakdown by payment method
    const breakdown = commissionRecords.reduce((acc, record) => {
      if (!acc[record.paymentMethod]) {
        acc[record.paymentMethod] = {
          count: 0,
          commission: 0,
          processingFee: 0,
          total: 0
        };
      }
      acc[record.paymentMethod].count++;
      acc[record.paymentMethod].commission += record.amount;
      acc[record.paymentMethod].processingFee += record.processingFee;
      acc[record.paymentMethod].total += record.totalEarned;
      return acc;
    }, {} as Record<string, any>);

    return c.json({
      totalRevenue: revenue.total,
      totalTransactions: revenue.transactions,
      breakdown,
      averageCommission: revenue.transactions > 0 ? Math.round(revenue.total / revenue.transactions) : 0
    });
  } catch (error) {
    console.error('Error fetching revenue:', error);
    return c.json({ error: 'Failed to fetch revenue' }, 500);
  }
});

export default app;