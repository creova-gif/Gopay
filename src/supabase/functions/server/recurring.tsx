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

// POST /recurring/create
app.post('/create', async (c) => {
  try {
    const userId = await verifyUser(c.req.header('Authorization'));
    if (!userId) return c.json({ error: 'Unauthorized' }, 401);

    const { categoryId, accountRef, amount, frequency } = await c.req.json();

    if (!categoryId || !accountRef || !amount || !frequency) {
      return c.json({ error: 'Tafadhali jaza sehemu zote' }, 400);
    }

    const n = Number(amount);
    if (!Number.isFinite(n) || n <= 0) {
      return c.json({ error: 'Kiasi si sahihi' }, 400);
    }

    const id = `recurring_${crypto.randomUUID()}`;
    const nextDate = new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 10);

    await kv.set(`recurring:${id}`, {
      id, userId, categoryId, accountRef,
      amount: n, frequency,
      nextDate,
      active: true,
      createdAt: new Date().toISOString(),
    });

    return c.json({ success: true, id, nextDate });
  } catch (e: unknown) {
    console.error('recurring/create error:', e);
    return c.json({ error: 'Hitilafu ya seva' }, 500);
  }
});

// GET /recurring/list
app.get('/list', async (c) => {
  try {
    const userId = await verifyUser(c.req.header('Authorization'));
    if (!userId) return c.json({ error: 'Unauthorized' }, 401);

    const all = await kv.getByPrefix('recurring:');
    const payments = all
      .filter((p: any) => p.userId === userId && p.active)
      .sort((a: any, b: any) => new Date(a.nextDate).getTime() - new Date(b.nextDate).getTime());

    return c.json({ payments });
  } catch (e: unknown) {
    console.error('recurring/list error:', e);
    return c.json({ error: 'Hitilafu ya seva' }, 500);
  }
});

// DELETE /recurring/:id
app.delete('/:id', async (c) => {
  try {
    const userId = await verifyUser(c.req.header('Authorization'));
    if (!userId) return c.json({ error: 'Unauthorized' }, 401);

    const id = c.req.param('id');
    const record = (await kv.get(`recurring:${id}`)) as { userId: string } | null;
    if (!record || record.userId !== userId) return c.json({ error: 'Not found' }, 404);

    await kv.set(`recurring:${id}`, { ...record, active: false });
    return c.json({ success: true });
  } catch (e: unknown) {
    console.error('recurring/delete error:', e);
    return c.json({ error: 'Hitilafu ya seva' }, 500);
  }
});

export default app;
