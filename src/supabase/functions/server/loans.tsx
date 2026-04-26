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

// POST /loans/apply
app.post('/apply', async (c) => {
  try {
    const userId = await verifyUser(c.req.header('Authorization'));
    if (!userId) return c.json({ error: 'Unauthorized' }, 401);

    const { amount, purpose, duration, pin } = await c.req.json();

    if (!amount || !purpose || !pin) {
      return c.json({ error: 'Tafadhali jaza sehemu zote' }, 400);
    }

    const n = Number(amount);
    if (!Number.isFinite(n) || n <= 0 || n > 500000) {
      return c.json({ error: 'Kiasi si sahihi (max TZS 500,000)' }, 400);
    }

    if (!(await verifyPin(userId, pin))) {
      return c.json({ error: 'PIN si sahihi' }, 403);
    }

    // Credit wallet with loan amount
    const wallet = (await kv.get(`wallet:${userId}`)) as { balance: number } | null ?? { balance: 0 };
    await kv.set(`wallet:${userId}`, { ...wallet, balance: wallet.balance + n });

    // Record loan disbursement transaction
    const loanId = `loan_${crypto.randomUUID()}`;
    const txId = `tx_${crypto.randomUUID()}`;
    const dueDate = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];

    await kv.set(`transaction:${txId}`, {
      id: txId, userId, type: 'credit', amount: n,
      description: `Mkopo: ${purpose}`,
      reference: loanId,
      timestamp: new Date().toISOString(),
      status: 'completed',
      category: 'loan',
    });

    await kv.set(`loan:${loanId}`, {
      id: loanId,
      userId,
      amount: n,
      purpose,
      duration: duration || '30 days',
      dueDate,
      totalDue: Math.floor(n * 1.05),
      paid: 0,
      status: 'active',
      disbursedAt: new Date().toISOString(),
    });

    return c.json({ success: true, loanId, amount: n, dueDate, totalDue: Math.floor(n * 1.05) });
  } catch (e: unknown) {
    console.error('loans/apply error:', e);
    return c.json({ error: 'Hitilafu ya seva' }, 500);
  }
});

// GET /loans/active
app.get('/active', async (c) => {
  try {
    const userId = await verifyUser(c.req.header('Authorization'));
    if (!userId) return c.json({ error: 'Unauthorized' }, 401);

    const allLoans = await kv.getByPrefix('loan:');
    const userLoans = allLoans
      .filter((l: any) => l.userId === userId && l.status !== 'paid')
      .sort((a: any, b: any) => new Date(b.disbursedAt).getTime() - new Date(a.disbursedAt).getTime());

    return c.json({ loans: userLoans });
  } catch (e: unknown) {
    console.error('loans/active error:', e);
    return c.json({ error: 'Hitilafu ya seva' }, 500);
  }
});

export default app;
