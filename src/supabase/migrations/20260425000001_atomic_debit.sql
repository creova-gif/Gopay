-- Atomic wallet debit: deducts `p_amount` from the KV wallet balance in one
-- statement, preventing TOCTOU races between concurrent withdrawal requests.
-- Returns the new balance, or NULL if balance was insufficient.
create or replace function atomic_debit_wallet(p_key text, p_amount numeric)
returns numeric
language plpgsql
security definer
as $$
declare
  v_new numeric;
begin
  update kv_store_69a10ee8
  set value = jsonb_set(value, '{balance}',
      to_jsonb((value->>'balance')::numeric - p_amount))
  where key = p_key
    and (value->>'balance')::numeric >= p_amount
  returning (value->>'balance')::numeric
  into v_new;

  return v_new; -- NULL when no row matched (insufficient balance)
end;
$$;

-- Revoke public access; Edge Functions use service-role which bypasses RLS.
revoke execute on function atomic_debit_wallet(text, numeric) from public;
grant  execute on function atomic_debit_wallet(text, numeric) to service_role;
