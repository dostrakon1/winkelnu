insert into categories (external_key, slug, name, is_active)
values
  ('category:elektronica', 'elektronica', 'Elektronica', true),
  ('category:wonen', 'wonen', 'Wonen', true),
  ('category:tuin', 'tuin', 'Tuin', true),
  ('category:persoonlijke-verzorging', 'persoonlijke-verzorging', 'Persoonlijke verzorging', true),
  ('category:sport-vrije-tijd', 'sport-vrije-tijd', 'Sport & vrije tijd', true)
on conflict (external_key) do update
set slug = excluded.slug,
    name = excluded.name,
    is_active = excluded.is_active,
    updated_at = now();

-- Merchant rows are intentionally not seeded here.
-- Real merchants must be registered through the affiliate onboarding flow with verified domains/program context.
