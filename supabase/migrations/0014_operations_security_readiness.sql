create or replace function winkelnu_production_readiness()
returns table (
  rls_enabled_tables integer,
  published_products bigint,
  active_offers bigint,
  active_merchants bigint,
  active_feed_sources bigint,
  latest_successful_import_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select
    (
      select count(*)::integer
      from pg_class c
      join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'public'
        and c.relname = any(array[
          'merchants','categories','products','feed_sources','import_runs','offers','product_identifiers',
          'import_rejects','product_match_reviews','affiliate_click_events','affiliate_networks',
          'merchant_affiliate_integrations','feed_import_orchestration','operator_audit_events','operator_action_requests'
        ])
        and c.relrowsecurity
    ),
    (select count(*) from products where status = 'published'),
    (select count(*) from offers where is_active = true),
    (select count(*) from merchants where is_active = true),
    (select count(*) from feed_sources where is_active = true),
    (select max(finished_at) from import_runs where status in ('completed','completed_with_errors'));
$$;

revoke all on function winkelnu_production_readiness() from public, anon, authenticated;
grant execute on function winkelnu_production_readiness() to service_role;

create or replace function winkelnu_operations_security_readiness()
returns table (
  operator_rls_tables integer,
  operator_tables_without_policies integer,
  untrusted_operator_table_grants integer,
  service_role_table_contract boolean,
  recovery_functions_service_role boolean,
  recovery_functions_anon_denied boolean,
  recovery_functions_authenticated_denied boolean,
  audit_append_only_trigger boolean
)
language sql
stable
security definer
set search_path = public
as $$
  select
    (
      select count(*)::integer
      from pg_class c
      join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'public'
        and c.relname = any(array['operator_audit_events','operator_action_requests'])
        and c.relrowsecurity
    ),
    (
      select count(*)::integer
      from pg_policies p
      where p.schemaname = 'public'
        and p.tablename = any(array['operator_audit_events','operator_action_requests'])
    ),
    (
      select count(*)::integer
      from information_schema.role_table_grants g
      where g.table_schema = 'public'
        and g.table_name = any(array['operator_audit_events','operator_action_requests'])
        and g.grantee in ('PUBLIC','anon','authenticated')
    ),
    (
      has_table_privilege('service_role', 'public.operator_audit_events', 'SELECT')
      and has_table_privilege('service_role', 'public.operator_audit_events', 'INSERT')
      and not has_table_privilege('service_role', 'public.operator_audit_events', 'UPDATE')
      and not has_table_privilege('service_role', 'public.operator_audit_events', 'DELETE')
      and has_table_privilege('service_role', 'public.operator_action_requests', 'SELECT')
      and has_table_privilege('service_role', 'public.operator_action_requests', 'INSERT')
      and has_table_privilege('service_role', 'public.operator_action_requests', 'UPDATE')
      and not has_table_privilege('service_role', 'public.operator_action_requests', 'DELETE')
    ),
    (
      has_function_privilege('service_role', to_regprocedure('public.operator_retry_feed(text,text,timestamptz)'), 'EXECUTE')
      and has_function_privilege('service_role', to_regprocedure('public.operator_pause_feed(text,text)'), 'EXECUTE')
      and has_function_privilege('service_role', to_regprocedure('public.operator_resume_feed(text,text,timestamptz)'), 'EXECUTE')
    ),
    (
      not has_function_privilege('anon', to_regprocedure('public.operator_retry_feed(text,text,timestamptz)'), 'EXECUTE')
      and not has_function_privilege('anon', to_regprocedure('public.operator_pause_feed(text,text)'), 'EXECUTE')
      and not has_function_privilege('anon', to_regprocedure('public.operator_resume_feed(text,text,timestamptz)'), 'EXECUTE')
    ),
    (
      not has_function_privilege('authenticated', to_regprocedure('public.operator_retry_feed(text,text,timestamptz)'), 'EXECUTE')
      and not has_function_privilege('authenticated', to_regprocedure('public.operator_pause_feed(text,text)'), 'EXECUTE')
      and not has_function_privilege('authenticated', to_regprocedure('public.operator_resume_feed(text,text,timestamptz)'), 'EXECUTE')
    ),
    exists (
      select 1
      from pg_trigger t
      join pg_class c on c.oid = t.tgrelid
      join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'public'
        and c.relname = 'operator_audit_events'
        and t.tgname = 'operator_audit_events_append_only'
        and not t.tgisinternal
    );
$$;

revoke all on function winkelnu_operations_security_readiness() from public, anon, authenticated;
grant execute on function winkelnu_operations_security_readiness() to service_role;
