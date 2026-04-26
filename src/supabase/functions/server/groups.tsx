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

// ── Money Pools ───────────────────────────────────────────────────────────────

// POST /groups/pool/create
app.post('/pool/create', async (c) => {
  try {
    const userId = await verifyUser(c.req.header('Authorization'));
    if (!userId) return c.json({ error: 'Unauthorized' }, 401);

    const { name, description, targetAmount, deadline, category, visibility, autoDisburse } = await c.req.json();
    if (!name || !targetAmount || !deadline) {
      return c.json({ error: 'Jaza sehemu zote zinazohitajika' }, 400);
    }

    const poolId = `pool_${crypto.randomUUID()}`;
    const shareLink = `gopay.tz/pool/${name.toLowerCase().replace(/\s+/g, '-')}-${poolId.slice(-6)}`;

    const pool = {
      id: poolId,
      name,
      description: description || '',
      targetAmount: Number(targetAmount),
      currentAmount: 0,
      deadline,
      organizer: userId,
      organizerId: userId,
      contributors: [],
      status: 'active',
      visibility: visibility || 'private',
      autoDisburse: !!autoDisburse,
      category: category || 'savings',
      shareLink,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`pool:${poolId}`, pool);
    return c.json({ success: true, poolId, shareLink });
  } catch (e: unknown) {
    console.error('pool/create error:', e);
    return c.json({ error: 'Hitilafu ya seva' }, 500);
  }
});

// GET /groups/pool/list
app.get('/pool/list', async (c) => {
  try {
    const userId = await verifyUser(c.req.header('Authorization'));
    if (!userId) return c.json({ error: 'Unauthorized' }, 401);

    const all = await kv.getByPrefix('pool:');
    const pools = all
      .filter((p: any) => p.organizerId === userId || p.contributors?.some((ct: any) => ct.id === userId))
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return c.json({ pools });
  } catch (e: unknown) {
    console.error('pool/list error:', e);
    return c.json({ error: 'Hitilafu ya seva' }, 500);
  }
});

// POST /groups/pool/contribute
app.post('/pool/contribute', async (c) => {
  try {
    const userId = await verifyUser(c.req.header('Authorization'));
    if (!userId) return c.json({ error: 'Unauthorized' }, 401);

    const { poolId, amount, paymentMethod } = await c.req.json();
    const n = Number(amount);
    if (!poolId || !Number.isFinite(n) || n <= 0) {
      return c.json({ error: 'Kiasi si sahihi' }, 400);
    }

    const pool = (await kv.get(`pool:${poolId}`)) as any;
    if (!pool) return c.json({ error: 'Pool haipatikani' }, 404);
    if (pool.status !== 'active') return c.json({ error: 'Pool haifanyi kazi' }, 400);

    // Debit wallet if paying from wallet
    if (!paymentMethod || paymentMethod === 'wallet') {
      const wallet = (await kv.get(`wallet:${userId}`)) as { balance: number } | null ?? { balance: 0 };
      if (wallet.balance < n) return c.json({ error: 'Salio halitosha' }, 400);
      await kv.set(`wallet:${userId}`, { ...wallet, balance: wallet.balance - n });
    }

    // Record transaction
    const txId = `tx_${crypto.randomUUID()}`;
    await kv.set(`transaction:${txId}`, {
      id: txId, userId, type: 'debit', amount: n,
      description: `Mchango: ${pool.name}`,
      reference: poolId,
      timestamp: new Date().toISOString(),
      status: 'completed',
      category: 'group',
    });

    // Update pool
    const contributor = {
      id: userId,
      name: 'Contributor',
      amount: n,
      timestamp: new Date().toISOString(),
    };
    const updated = {
      ...pool,
      currentAmount: pool.currentAmount + n,
      contributors: [...(pool.contributors || []), contributor],
      status: pool.currentAmount + n >= pool.targetAmount ? 'completed' : 'active',
    };
    await kv.set(`pool:${poolId}`, updated);

    return c.json({ success: true, newTotal: updated.currentAmount });
  } catch (e: unknown) {
    console.error('pool/contribute error:', e);
    return c.json({ error: 'Hitilafu ya seva' }, 500);
  }
});

// ── Community Wallets ─────────────────────────────────────────────────────────

// POST /groups/community/create
app.post('/community/create', async (c) => {
  try {
    const userId = await verifyUser(c.req.header('Authorization'));
    if (!userId) return c.json({ error: 'Unauthorized' }, 401);

    const { name, purpose, goal } = await c.req.json();
    if (!name || !purpose) return c.json({ error: 'Jaza sehemu zote' }, 400);

    const walletId = `cw_${crypto.randomUUID()}`;
    const communityWallet = {
      id: walletId,
      name,
      purpose,
      balance: 0,
      goal: goal ? Number(goal) : undefined,
      members: [userId],
      memberCount: 1,
      adminId: userId,
      transactions: [],
      createdAt: new Date().toISOString(),
    };

    await kv.set(`community_wallet:${walletId}`, communityWallet);
    return c.json({ success: true, walletId });
  } catch (e: unknown) {
    console.error('community/create error:', e);
    return c.json({ error: 'Hitilafu ya seva' }, 500);
  }
});

// GET /groups/community/list
app.get('/community/list', async (c) => {
  try {
    const userId = await verifyUser(c.req.header('Authorization'));
    if (!userId) return c.json({ error: 'Unauthorized' }, 401);

    const all = await kv.getByPrefix('community_wallet:');
    const wallets = all
      .filter((w: any) => w.adminId === userId || w.members?.includes(userId))
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return c.json({ wallets });
  } catch (e: unknown) {
    console.error('community/list error:', e);
    return c.json({ error: 'Hitilafu ya seva' }, 500);
  }
});

// POST /groups/community/add-funds
app.post('/community/add-funds', async (c) => {
  try {
    const userId = await verifyUser(c.req.header('Authorization'));
    if (!userId) return c.json({ error: 'Unauthorized' }, 401);

    const { communityWalletId, amount, pin } = await c.req.json();
    const n = Number(amount);
    if (!communityWalletId || !Number.isFinite(n) || n <= 0) {
      return c.json({ error: 'Kiasi si sahihi' }, 400);
    }

    if (pin && !(await verifyPin(userId, pin))) {
      return c.json({ error: 'PIN si sahihi' }, 403);
    }

    const wallet = (await kv.get(`wallet:${userId}`)) as { balance: number } | null ?? { balance: 0 };
    if (wallet.balance < n) return c.json({ error: 'Salio halitosha' }, 400);
    await kv.set(`wallet:${userId}`, { ...wallet, balance: wallet.balance - n });

    const cw = (await kv.get(`community_wallet:${communityWalletId}`)) as any;
    if (!cw) return c.json({ error: 'Community wallet haipatikani' }, 404);

    const entry = { userId, amount: n, timestamp: new Date().toISOString() };
    await kv.set(`community_wallet:${communityWalletId}`, {
      ...cw,
      balance: cw.balance + n,
      transactions: [...(cw.transactions || []), entry],
    });

    const txId = `tx_${crypto.randomUUID()}`;
    await kv.set(`transaction:${txId}`, {
      id: txId, userId, type: 'debit', amount: n,
      description: `Mchango: ${cw.name}`,
      reference: communityWalletId,
      timestamp: new Date().toISOString(),
      status: 'completed',
      category: 'community',
    });

    return c.json({ success: true, newBalance: cw.balance + n });
  } catch (e: unknown) {
    console.error('community/add-funds error:', e);
    return c.json({ error: 'Hitilafu ya seva' }, 500);
  }
});

export default app;
