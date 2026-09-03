-- M1.0 preview activation hardening:
-- Supabase projects with automatic table exposure disabled do not implicitly grant
-- Data API table privileges. Winkelnu keeps anon/authenticated fail-closed and
-- explicitly grants only the trusted server-side service_role the catalog/import
-- privileges required by the persistence and verification layers.

revoke all on table merchants from anon, authenticated;
revoke all on table categories from anon, authenticated;
revoke all on table products from anon, authenticated;
revoke all on table feed_sources from anon, authenticated;
revoke all on table import_runs from anon, authenticated;
revoke all on table offers from anon, authenticated;
revoke all on table product_identifiers from anon, authenticated;
revoke all on table import_rejects from anon, authenticated;
revoke all on table product_match_reviews from anon, authenticated;
revoke all on table affiliate_click_events from anon, authenticated;
revoke all on table affiliate_networks from anon, authenticated;
revoke all on table merchant_affiliate_integrations from anon, authenticated;
revoke all on table feed_import_orchestration from anon, authenticated;

grant select, insert, update, delete on table merchants to service_role;
grant select, insert, update, delete on table categories to service_role;
grant select, insert, update, delete on table products to service_role;
grant select, insert, update, delete on table feed_sources to service_role;
grant select, insert, update, delete on table import_runs to service_role;
grant select, insert, update, delete on table offers to service_role;
grant select, insert, update, delete on table product_identifiers to service_role;
grant select, insert, update, delete on table import_rejects to service_role;
grant select, insert, update, delete on table product_match_reviews to service_role;
grant select, insert, update, delete on table affiliate_click_events to service_role;
grant select, insert, update, delete on table affiliate_networks to service_role;
grant select, insert, update, delete on table merchant_affiliate_integrations to service_role;
grant select, insert, update, delete on table feed_import_orchestration to service_role;

-- Keep operator tables on their deliberately narrower contracts from 0011/0013.
-- Do not grant anon/authenticated any table access here.

grant usage on schema public to service_role;
