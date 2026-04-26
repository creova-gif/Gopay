import type { SupabaseClient } from 'jsr:@supabase/supabase-js@2';
import type { TxStatus } from './types.ts';
import { verifySelcomWebhook, parseSelcomWebhookEvent } from './selcom.ts';
import { verifyFlutterwaveWebhook, parseFlutterwaveWebhookEvent } from './flutterwave.ts';

interface KvStore {
  get(key: string): Promise<unknown>;
  set(key: string, value: unknown): Promise<void>;
}

interface HandlerResult {
  status: number;
  body: unknown;
}

async function applyWebhookEvent(
  providerRef: string,
  newStatus: TxStatus,
  db: SupabaseClient,
  kv: KvStore,
): Promise<HandlerResult> {
  const { data: tx, error } = await db
    .from('transactions')
    .select('id,user_id,type,amount,status')
    .eq('provider_ref', providerRef)
    .single();

  if (error || !tx) {
    console.warn('Webhook for unknown provider_ref:', providerRef);
    return { status: 200, body: { ok: true } };
  }

  if (tx.status === 'completed' || tx.status === 'failed') {
    return { status: 200, body: { ok: true, note: 'already settled' } };
  }

  const { error: updateError } = await db
    .from('transactions')
    .update({ status: newStatus })
    .eq('id', tx.id)
    .select('id')
    .single();

  if (updateError) {
    console.error('Failed to update transaction:', updateError.message);
    return { status: 500, body: { error: 'DB update failed' } };
  }

  if (newStatus === 'completed' && tx.type === 'topup') {
    const wallet = (await kv.get(`wallet:${tx.user_id}`) as { balance: number } | null) ?? { balance: 0 };
    await kv.set(`wallet:${tx.user_id}`, { ...wallet, balance: wallet.balance + Number(tx.amount) });
  }

  if (newStatus === 'failed' && (tx.type === 'withdrawal' || tx.type === 'p2p_send')) {
    const wallet = (await kv.get(`wallet:${tx.user_id}`) as { balance: number } | null) ?? { balance: 0 };
    await kv.set(`wallet:${tx.user_id}`, { ...wallet, balance: wallet.balance + Number(tx.amount) });
  }

  return { status: 200, body: { ok: true } };
}

export async function handleSelcomWebhook(
  rawBody: string,
  signature: string,
  secret: string,
  db: SupabaseClient,
  kv: KvStore,
): Promise<HandlerResult> {
  const valid = await verifySelcomWebhook(rawBody, signature, secret);
  if (!valid) return { status: 401, body: { error: 'Invalid signature' } };

  const body = JSON.parse(rawBody);
  const { providerRef, status } = parseSelcomWebhookEvent(body);
  return applyWebhookEvent(providerRef, status, db, kv);
}

export async function handleFlutterwaveWebhook(
  rawBody: string,
  verifHash: string,
  storedHash: string,
  db: SupabaseClient,
  kv: KvStore,
): Promise<HandlerResult> {
  const valid = verifyFlutterwaveWebhook(storedHash, verifHash);
  if (!valid) return { status: 401, body: { error: 'Invalid hash' } };

  const body = JSON.parse(rawBody);
  const { providerRef, status } = parseFlutterwaveWebhookEvent(body);
  return applyWebhookEvent(providerRef, status, db, kv);
}
