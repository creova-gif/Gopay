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

// POST /parcel/book
app.post('/book', async (c) => {
  try {
    const userId = await verifyUser(c.req.header('Authorization'));
    if (!userId) return c.json({ error: 'Unauthorized' }, 401);

    const {
      operatorId, from, to, weight,
      description, recipientName, recipientPhone,
      addInsurance, declaredValue, totalAmount, pin,
    } = await c.req.json();

    if (!operatorId || !from || !to || !weight || !recipientName || !recipientPhone || !pin) {
      return c.json({ error: 'Tafadhali jaza sehemu zote' }, 400);
    }

    const n = Number(totalAmount);
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

    const parcelId = `parcel_${crypto.randomUUID()}`;
    const trackingNumber = `PCL-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const txId = `tx_${crypto.randomUUID()}`;

    await kv.set(`transaction:${txId}`, {
      id: txId, userId, type: 'debit', amount: n,
      description: `Mzigo: ${from} → ${to} (${recipientName})`,
      reference: trackingNumber,
      timestamp: new Date().toISOString(),
      status: 'completed',
      category: 'parcel',
    });

    await kv.set(`parcel:${parcelId}`, {
      id: parcelId, userId,
      operatorId, from, to,
      weight: Number(weight), description,
      recipientName, recipientPhone,
      addInsurance: !!addInsurance,
      declaredValue: addInsurance ? Number(declaredValue) : 0,
      totalAmount: n, trackingNumber,
      status: 'booked',
      bookedAt: new Date().toISOString(),
    });

    return c.json({ success: true, trackingNumber, from, to, recipientName });
  } catch (e: unknown) {
    console.error('parcel/book error:', e);
    return c.json({ error: 'Hitilafu ya seva' }, 500);
  }
});

// GET /parcel/track/:trackingNumber
app.get('/track/:trackingNumber', async (c) => {
  try {
    const userId = await verifyUser(c.req.header('Authorization'));
    if (!userId) return c.json({ error: 'Unauthorized' }, 401);

    const trackingNumber = c.req.param('trackingNumber');
    const all = await kv.getByPrefix('parcel:');
    const parcel = all.find((p: any) => p.trackingNumber === trackingNumber && p.userId === userId);

    if (!parcel) return c.json({ error: 'Mzigo haupatikani' }, 404);
    return c.json(parcel);
  } catch (e: unknown) {
    console.error('parcel/track error:', e);
    return c.json({ error: 'Hitilafu ya seva' }, 500);
  }
});

export default app;
