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

async function verifyPin(userId: string, pin: string): Promise<boolean> {
  const wallet = (await kv.get(`wallet:${userId}`)) as { pin: string | null } | null;
  return wallet?.pin === pin;
}

// POST /subscriptions/subscribe
app.post('/subscribe', async (c) => {
  try {
    const userId = await verifyUser(c.req.header('Authorization'));
    if (!userId) return c.json({ error: 'Unauthorized' }, 401);

    const { service, plan, amount, pin } = await c.req.json();

    if (!service || !plan || !amount || !pin) {
      return c.json({ error: 'Tafadhali jaza sehemu zote' }, 400);
    }

    const n = Number(amount);
    if (!Number.isFinite(n) || n <= 0) {
      return c.json({ error: 'Kiasi si sahihi' }, 400);
    }

    if (!(await verifyPin(userId, pin))) {
      return c.json({ error: 'PIN si sahihi' }, 403);
    }

    const wallet = (await kv.get(`wallet:${userId}`)) as { balance: number } | null ?? { balance: 0 };
    if (wallet.balance < n) {
      return c.json({ error: 'Salio halitosha' }, 400);
    }

    await kv.set(`wallet:${userId}`, { ...wallet, balance: wallet.balance - n });

    const subId = `sub_${crypto.randomUUID()}`;
    const reference = `SUB-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    const txId = `tx_${crypto.randomUUID()}`;
    const renewsAt = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];

    await kv.set(`transaction:${txId}`, {
      id: txId, userId, type: 'debit', amount: n,
      description: `Usajili: ${service} (${plan})`,
      reference,
      timestamp: new Date().toISOString(),
      status: 'completed',
      category: 'subscription',
    });

    await kv.set(`subscription:${subId}`, {
      id: subId, userId, service, plan,
      amount: n, reference,
      renewsAt, active: true,
      subscribedAt: new Date().toISOString(),
    });

    return c.json({ success: true, reference, service, plan, renewsAt });
  } catch (e: unknown) {
    console.error('subscriptions/subscribe error:', e);
    return c.json({ error: 'Hitilafu ya seva' }, 500);
  }
});

// GET /subscriptions/active
app.get('/active', async (c) => {
  try {
    const userId = await verifyUser(c.req.header('Authorization'));
    if (!userId) return c.json({ error: 'Unauthorized' }, 401);

    const all = await kv.getByPrefix('subscription:');
    const subs = all
      .filter((s: any) => s.userId === userId && s.active)
      .sort((a: any, b: any) => new Date(b.subscribedAt).getTime() - new Date(a.subscribedAt).getTime());

    return c.json({ subscriptions: subs });
  } catch (e: unknown) {
    console.error('subscriptions/active error:', e);
    return c.json({ error: 'Hitilafu ya seva' }, 500);
  }
});

export default app;
