# Partner Feed Adapter Resolution

## Purpose

M0.16 connects the affiliate integration registry to the feed ingestion boundary without leaking provider-specific implementation details into the application/domain layers.

Resolution path:

`feed source registration -> merchant integration -> optional affiliate network -> adapter key -> infrastructure feed adapter`

## Application responsibility

`PartnerFeedSourceResolver` only determines whether a registered source is currently usable.

It fails closed when:
- the feed source does not exist or is inactive;
- the linked integration does not exist or is not active;
- merchant ownership does not match;
- a non-direct integration has no network;
- the referenced network is missing/inactive;
- integration kind and network kind do not match.

The application layer never resolves secret values and never imports concrete partner adapters.

## Infrastructure responsibility

`PartnerFeedAdapterRegistry` maps a resolved source to a technical key:

- network/marketplace: `<network-slug>:<source-type>`
- direct program: `direct:<source-type>`
- unlinked generic source: `generic:<source-type>`

Examples:
- `awin:xml`
- `daisycon:api`
- `marketplace-x:json`
- `direct:csv`

Concrete partner adapter factories are registered against these keys.

## Credential boundary

Registry data may contain only a reference such as:

`env:AFFILIATE_PARTNER_TOKEN`

The actual environment variable is resolved only inside the infrastructure adapter registry immediately before constructing the adapter. Credentials therefore do not enter the domain or application result models.

## Composition

`resolvePartnerFeedAdapter()` performs the composition step:

1. resolve commercial/source context;
2. return `null` if the source is unusable;
3. select the registered technical adapter;
4. resolve server-only credential if required;
5. return a standard `FeedAdapter`.

The ingestion use case can therefore continue to depend only on the existing `FeedAdapter` contract.

## Scale rule

Adding a real affiliate provider should normally require:
- registry/network configuration;
- one or more infrastructure adapter factories;
- provider-specific mapping tests.

It should not require changes to canonical product, offer, matching, storefront or search domain models.
