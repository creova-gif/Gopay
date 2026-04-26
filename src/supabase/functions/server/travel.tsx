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
  const stored = await kv.get(`user:${userId}:pin`);
  return stored?.pin === pin;
}

async function debitAndRecord(
  userId: string,
  amount: number,
  description: string,
  prefix: string,
): Promise<{ reference: string } | { error: string }> {
  const wallet = (await kv.get(`wallet:${userId}`)) as { balance: number } | null;
  const balance = wallet?.balance ?? 0;
  if (balance < amount) return { error: 'Salio halitosha' };

  await kv.set(`wallet:${userId}`, { ...wallet, balance: balance - amount });

  const reference = `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
  const txId = `tx_${crypto.randomUUID()}`;
  await kv.set(`transaction:${txId}`, {
    id: txId, userId, type: 'debit', amount,
    description, reference,
    timestamp: new Date().toISOString(),
    status: 'completed',
    category: 'travel',
  });

  return { reference };
}

// ── Bus booking ──────────────────────────────────────────────────────────────
app.post('/bus/book', async (c) => {
  try {
    const userId = await verifyUser(c.req.header('Authorization'));
    if (!userId) return c.json({ error: 'Unauthorized' }, 401);

    const { operator, from, to, date, seats, passengers, total, pin } = await c.req.json();
    if (!operator || !from || !to || !date || !total || !pin)
      return c.json({ error: 'Tafadhali jaza sehemu zote' }, 400);

    if (!(await verifyPin(userId, pin)))
      return c.json({ error: 'PIN si sahihi' }, 403);

    const result = await debitAndRecord(userId, total, `Bus: ${from}→${to} (${operator})`, 'BUS');
    if ('error' in result) return c.json(result, 400);

    return c.json({ success: true, reference: result.reference, operator, from, to, date, seats, passengers });
  } catch (e: unknown) {
    console.error('bus/book error:', e);
    return c.json({ error: 'Hitilafu ya seva' }, 500);
  }
});

// ── SGR (Train) booking ───────────────────────────────────────────────────────
app.post('/sgr/book', async (c) => {
  try {
    const userId = await verifyUser(c.req.header('Authorization'));
    if (!userId) return c.json({ error: 'Unauthorized' }, 401);

    const { route, schedule, class: travelClass, date, seats, passengers, total, pin } = await c.req.json();
    if (!route || !date || !total || !pin)
      return c.json({ error: 'Tafadhali jaza sehemu zote' }, 400);

    if (!(await verifyPin(userId, pin)))
      return c.json({ error: 'PIN si sahihi' }, 403);

    const result = await debitAndRecord(userId, total, `SGR: ${route} (${travelClass})`, 'SGR');
    if ('error' in result) return c.json(result, 400);

    return c.json({ success: true, reference: result.reference, route, schedule, class: travelClass, date, seats, passengers });
  } catch (e: unknown) {
    console.error('sgr/book error:', e);
    return c.json({ error: 'Hitilafu ya seva' }, 500);
  }
});

// ── Ferry booking ────────────────────────────────────────────────────────────
app.post('/ferry/book', async (c) => {
  try {
    const userId = await verifyUser(c.req.header('Authorization'));
    if (!userId) return c.json({ error: 'Unauthorized' }, 401);

    const { route, schedule, date, passengers, cabinClass, total, pin } = await c.req.json();
    if (!route || !date || !total || !pin)
      return c.json({ error: 'Tafadhali jaza sehemu zote' }, 400);

    if (!(await verifyPin(userId, pin)))
      return c.json({ error: 'PIN si sahihi' }, 403);

    const result = await debitAndRecord(userId, total, `Ferry: ${route}`, 'FERRY');
    if ('error' in result) return c.json(result, 400);

    return c.json({
      success: true, reference: result.reference,
      route, schedule, date, passengers, cabinClass,
      qrCode: `ferry-${result.reference}`,
    });
  } catch (e: unknown) {
    console.error('ferry/book error:', e);
    return c.json({ error: 'Hitilafu ya seva' }, 500);
  }
});

// ── National Parks booking ───────────────────────────────────────────────────
app.post('/parks/book', async (c) => {
  try {
    const userId = await verifyUser(c.req.header('Authorization'));
    if (!userId) return c.json({ error: 'Unauthorized' }, 401);

    const { park, package: pkg, date, visitors, visitorName, visitorPhone, nationality, total, pin } = await c.req.json();
    if (!park || !pkg || !date || !total || !pin)
      return c.json({ error: 'Tafadhali jaza sehemu zote' }, 400);

    if (!(await verifyPin(userId, pin)))
      return c.json({ error: 'PIN si sahihi' }, 403);

    const result = await debitAndRecord(userId, total, `Parks: ${park} - ${pkg}`, 'TANAPA');
    if ('error' in result) return c.json(result, 400);

    return c.json({ success: true, reference: result.reference, park, package: pkg, date, visitors, visitorName });
  } catch (e: unknown) {
    console.error('parks/book error:', e);
    return c.json({ error: 'Hitilafu ya seva' }, 500);
  }
});

// ── Multimodal trip planning ─────────────────────────────────────────────────
app.post('/multimodal/book', async (c) => {
  try {
    const userId = await verifyUser(c.req.header('Authorization'));
    if (!userId) return c.json({ error: 'Unauthorized' }, 401);

    const { segments, total, pin } = await c.req.json();
    if (!segments || !total || !pin)
      return c.json({ error: 'Tafadhali jaza sehemu zote' }, 400);

    if (!(await verifyPin(userId, pin)))
      return c.json({ error: 'PIN si sahihi' }, 403);

    const result = await debitAndRecord(userId, total, `Multimodal trip (${segments?.length ?? 0} legs)`, 'TRIP');
    if ('error' in result) return c.json(result, 400);

    return c.json({ success: true, reference: result.reference, segments });
  } catch (e: unknown) {
    console.error('travel/multimodal/book error:', e);
    return c.json({ error: 'Hitilafu ya seva' }, 500);
  }
});

export default app;
