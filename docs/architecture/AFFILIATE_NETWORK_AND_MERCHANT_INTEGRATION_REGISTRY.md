# Affiliate Network & Merchant Integration Registry

Status: M0.15 baseline.

## Purpose

Winkelnu must be able to connect merchants through affiliate networks, marketplaces and direct partner programs without leaking partner-specific concepts into products, offers, storefront pages or feed-domain rules.

The registry separates four concerns:

1. Merchant — the shop the consumer ultimately buys from.
2. Affiliate network / marketplace — the commercial or technical ecosystem mediating the partnership when applicable.
3. Merchant affiliate integration — the concrete merchant/program relationship used by Winkelnu.
4. Feed source — the API/XML/CSV/JSON/manual source that delivers catalog/offer data.

## Core relationships

A merchant may have multiple integrations over time or even concurrently.

A network or marketplace integration must reference an `affiliate_networks` record.

A direct merchant program deliberately has no network reference. We do not create fake network records merely to satisfy a schema shape.

A feed source may reference one merchant affiliate integration. This makes its commercial/provenance context explicit without making feed adapters vendor-specific.

## Secret boundary

The registry never stores API tokens, passwords, private keys or client secrets.

`secret_ref` is an opaque reference to server-side secret storage and the application baseline currently accepts only values shaped like:

`env:AFFILIATE_EXAMPLE_API_TOKEN`

The environment variable contains the real secret. GitHub, database rows, domain objects and logs must not contain that value.

`tracking_config` is non-secret metadata only, for example a sub-ID parameter name or static partner identifier that is safe to persist.

## Domain model

### AffiliateNetwork

- stable external id
- slug
- display name
- kind: `network` or `marketplace`
- optional website URL
- active flag

### MerchantAffiliateIntegration

- stable external id
- merchant id
- kind: `network`, `marketplace` or `direct`
- optional network id according to kind
- optional program identifier
- lifecycle status: `pending`, `active`, `paused`, `ended`
- optional secret reference
- non-secret tracking configuration

### AffiliateFeedSourceRegistration

- source key
- merchant id
- source type
- optional integration id
- active flag

## Lifecycle rules

- Direct integrations must not reference a network.
- Network/marketplace integrations must reference an existing active network of the same kind.
- Feed source merchant and integration merchant must match.
- Pausing/ending an integration is distinct from deleting historical records.
- Feed/source history and click history should remain attributable after a commercial program ends.

## Infrastructure

The application service depends on `AffiliateIntegrationRegistryRepository`.

Implementations:

- in-memory repository for deterministic tests/development;
- Supabase/Postgres repository for persistent registry state.

The storefront does not query this registry directly. Partner-specific adapters and later operations tooling use it to resolve integration context.

## Database schema

Migration `0005_affiliate_integration_registry.sql` adds:

- `affiliate_networks`
- `merchant_affiliate_integrations`
- `feed_sources.affiliate_integration_id`

Postgres UUIDs remain internal relation keys. Domain identity uses stable `external_key` values.

## Future extensions

Later milestones can add:

- program approval dates and commercial terms metadata;
- per-integration health/last-success state;
- partner terms/data-rights audit records;
- network-specific adapter factories;
- commission/conversion imports;
- operations UI;
- secret-manager providers beyond environment variables.

These additions must preserve the rule that actual secrets never enter registry records.
