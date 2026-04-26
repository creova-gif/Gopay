import { Hono } from 'npm:hono';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

async function verifyUser(authHeader: string | null): Promise<string | null> {
  if (!authHeader) return null;
  const token = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);
  return error || !user?.id ? null : user.id;
}

function getTier(points: number): string {
  if (points >= 15000) return 'Platinum';
  if (points >= 5000) return 'Gold';
  if (points >= 1000) return 'Silver';
  return 'Bronze';
}

async function getOrInitRewards(userId: string) {
  const existing = await kv.get(`rewards:${userId}`);
  if (existing) return existing as { points: number; cashback: number; lifetimeCashback: number; streak: number; lastActiveDate: string | null };
  const defaults = { points: 0, cashback: 0, lifetimeCashback: 0, streak: 0, lastActiveDate: null };
  await kv.set(`rewards:${userId}`, defaults);
  return defaults;
}

// GET /rewards/balance — points + tier + streak
app.get('/balance', async (c) => {
  try {
    const userId = await verifyUser(c.req.header('Authorization'));
    if (!userId) return c.json({ error: 'Unauthorized' }, 401);

    const rewards = await getOrInitRewards(userId);

    // Update streak
    const today = new Date().toISOString().slice(0, 10);
    let { streak, lastActiveDate } = rewards;
    if (lastActiveDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      streak = lastActiveDate === yesterday ? streak + 1 : 1;
      await kv.set(`rewards:${userId}`, { ...rewards, streak, lastActiveDate: today });
    }

    // Today's earned points: count transactions from today
    const allTx = await kv.getByPrefix('transaction:');
    const todayTx = allTx.filter((tx: any) =>
      tx.userId === userId &&
      tx.type === 'debit' &&
      tx.timestamp?.startsWith(today)
    );
    const todayEarnings = todayTx.reduce((sum: number, tx: any) => sum + Math.floor((tx.amount ?? 0) / 1000), 0);

    return c.json({
      points: rewards.points,
      tier: getTier(rewards.points),
      cashback: rewards.cashback,
      todayEarnings,
      streak,
    });
  } catch (e: unknown) {
    console.error('rewards/balance error:', e);
    return c.json({ error: 'Hitilafu ya seva' }, 500);
  }
});

// GET /rewards/cashback — cashback balance + lifetime total
app.get('/cashback', async (c) => {
  try {
    const userId = await verifyUser(c.req.header('Authorization'));
    if (!userId) return c.json({ error: 'Unauthorized' }, 401);

    const rewards = await getOrInitRewards(userId);
    return c.json({ cashbackBalance: rewards.cashback, lifetimeCashback: rewards.lifetimeCashback });
  } catch (e: unknown) {
    console.error('rewards/cashback error:', e);
    return c.json({ error: 'Hitilafu ya seva' }, 500);
  }
});

// POST /rewards/redeem — transfer cashback to wallet
app.post('/redeem', async (c) => {
  try {
    const userId = await verifyUser(c.req.header('Authorization'));
    if (!userId) return c.json({ error: 'Unauthorized' }, 401);

    const { amount } = await c.req.json();
    const n = Number(amount);
    if (!Number.isFinite(n) || n < 500) {
      return c.json({ error: 'Kiwango cha chini ni TZS 500' }, 400);
    }

    const rewards = await getOrInitRewards(userId);
    if (rewards.cashback < n) {
      return c.json({ error: 'Cashback haitoshi' }, 400);
    }

    await kv.set(`rewards:${userId}`, { ...rewards, cashback: rewards.cashback - n });

    const wallet = (await kv.get(`wallet:${userId}`)) as { balance: number } | null ?? { balance: 0 };
    await kv.set(`wallet:${userId}`, { ...wallet, balance: wallet.balance + n });

    const txId = `tx_${crypto.randomUUID()}`;
    await kv.set(`transaction:${txId}`, {
      id: txId, userId, type: 'credit', amount: n,
      description: 'GOrewards Cashback Redeem',
      reference: `CASHBACK-${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: 'completed',
      category: 'rewards',
    });

    return c.json({ success: true, redeemed: n });
  } catch (e: unknown) {
    console.error('rewards/redeem error:', e);
    return c.json({ error: 'Hitilafu ya seva' }, 500);
  }
});

// POST /rewards/earn — called internally when user makes a transaction (or manually)
app.post('/earn', async (c) => {
  try {
    const userId = await verifyUser(c.req.header('Authorization'));
    if (!userId) return c.json({ error: 'Unauthorized' }, 401);

    const { transactionAmount } = await c.req.json();
    const n = Number(transactionAmount);
    if (!Number.isFinite(n) || n <= 0) return c.json({ error: 'Invalid amount' }, 400);

    const pointsEarned = Math.floor(n / 1000);
    const cashbackEarned = Math.floor(n * 0.01);

    if (pointsEarned === 0 && cashbackEarned === 0) {
      return c.json({ success: true, pointsEarned: 0, cashbackEarned: 0 });
    }

    const rewards = await getOrInitRewards(userId);
    await kv.set(`rewards:${userId}`, {
      ...rewards,
      points: rewards.points + pointsEarned,
      cashback: rewards.cashback + cashbackEarned,
      lifetimeCashback: rewards.lifetimeCashback + cashbackEarned,
    });

    return c.json({ success: true, pointsEarned, cashbackEarned });
  } catch (e: unknown) {
    console.error('rewards/earn error:', e);
    return c.json({ error: 'Hitilafu ya seva' }, 500);
  }
});

export default app;
