-- Security and feed-readiness hardening before the first live affiliate feed:
-- - the append-only audit trigger does not need SECURITY DEFINER privileges;
-- - public/authenticated API roles must not be able to call the trigger function directly;
-- - foreign-key columns used by feed/import maintenance get covering indexes.

alter function public.deny_operator_audit_event_mutation() security invoker;

revoke all on function public.deny_operator_audit_event_mutation() from public;
revoke all on function public.deny_operator_audit_event_mutation() from anon;
revoke all on function public.deny_operator_audit_event_mutation() from authenticated;
grant execute on function public.deny_operator_audit_event_mutation() to service_role;

create index if not exists categories_parent_id_idx
  on public.categories (parent_id);

create index if not exists offers_feed_source_id_idx
  on public.offers (feed_source_id);

create index if not exists product_identifiers_merchant_id_idx
  on public.product_identifiers (merchant_id);

create index if not exists product_identifiers_product_id_idx
  on public.product_identifiers (product_id);

create index if not exists product_match_reviews_merchant_id_idx
  on public.product_match_reviews (merchant_id);
