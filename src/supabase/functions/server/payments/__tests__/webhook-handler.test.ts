import { assertEquals } from 'jsr:@std/assert';
import { handleSelcomWebhook, handleFlutterwaveWebhook } from '../webhook-handler.ts';
import type { SupabaseClient } from 'jsr:@supabase/supabase-js@2';

function makeDb(txRow: Record<string, unknown> | null) {
  return {
    from: (_table: string) => ({
      select: (_cols: string) => ({
        eq: (_col: string, _val: string) => ({
          single: async () => ({ data: txRow, error: txRow ? null : { message: 'not found' } }),
        }),
      }),
      update: (_data: Record<string, unknown>) => ({
        eq: (_col: string, _val: string) => ({
          select: (_cols: string) => ({
            single: async () => ({
              data: txRow ? { ...txRow, status: 'completed' } : null,
              error: null,
            }),
          }),
        }),
      }),
    }),
  } as unknown as SupabaseClient;
}

function makeKv() {
  const store: Record<string, unknown> = {};
  return {
    get: async (key: string) => store[key] ?? null,
    set: async (key: string, val: unknown) => { store[key] = val; },
  };
}

Deno.test('handleSelcomWebhook returns 401 on bad signature', async () => {
  const db = makeDb(null);
  const kv = makeKv();
  const res = await handleSelcomWebhook('{"transid":"X","result":"SUCCESS"}', 'bad-sig', 'secret', db, kv);
  assertEquals(res.status, 401);
});

Deno.test('handleSelcomWebhook returns 200 for unknown providerRef (idempotent)', async () => {
  const db = makeDb(null);
  const kv = makeKv();
  const body = '{"transid":"UNKNOWN-001","result":"SUCCESS"}';
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', encoder.encode('secret'), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(body));
  const correctSig = btoa(String.fromCharCode(...new Uint8Array(sig)));

  const res = await handleSelcomWebhook(body, correctSig, 'secret', db, kv);
  assertEquals(res.status, 200);
});

Deno.test('handleSelcomWebhook credits wallet on completed topup', async () => {
  const tx = { id: 'tx-1', user_id: 'u-1', type: 'topup', amount: 10000, status: 'pending', provider_ref: 'SEL-001' };
  const kv = makeKv();
  await kv.set('wallet:u-1', { balance: 50000 });

  const db = makeDb(tx);
  const body = '{"transid":"SEL-001","result":"SUCCESS"}';
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', encoder.encode('secret'), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(body));
  const correctSig = btoa(String.fromCharCode(...new Uint8Array(sig)));

  const res = await handleSelcomWebhook(body, correctSig, 'secret', db, kv);
  assertEquals(res.status, 200);
  const wallet = await kv.get('wallet:u-1') as { balance: number };
  assertEquals(wallet.balance, 60000);
});

Deno.test('handleFlutterwaveWebhook returns 401 on hash mismatch', async () => {
  const db = makeDb(null);
  const kv = makeKv();
  const res = await handleFlutterwaveWebhook('{}', 'wrong', 'correct-hash', db, kv);
  assertEquals(res.status, 401);
});
