# Affiliate Partner Readiness v1

Status: repository readiness audit for the next real affiliate integrations.

## Goal

Winkelnu must be able to add affiliate networks, marketplaces and direct merchants without rebuilding the storefront, catalog domain or click flow for every provider.

This document records what already exists, what is provider-specific and what must still happen before a provider can deliver real offers in production.

## Existing reusable foundation

The repository already contains the provider-neutral pieces required for multi-partner ingestion:

- affiliate network / marketplace / direct integration registry;
- merchant integration records with server-side secret references;
- feed source registrations for API, XML, CSV, JSON and manual sources;
- a common `FeedAdapter` contract that emits normalized `FeedCandidate` records;
- partner feed-source resolution and adapter-key resolution;
- partner onboarding and import orchestration;
- catalog validation, matching and offer persistence;
- affiliate redirects and click attribution;
- partner operations/read models;
- a production activation gate covering mapping, preview quality, catalog visibility, ranking/freshness, affiliate destination, redirect behavior, credentials and live preview evidence.

The storefront therefore does not need provider-specific product components. New providers belong behind the ingestion and affiliate boundaries.

## Provider readiness matrix

### Daisycon — adapter ready, externally gated

Repository support already includes:

- a Daisycon JSON product-feed adapter;
- adapter registration under `daisycon:json`;
- a baseline mapper into `FeedCandidate`;
- affiliate/deeplink mapping;
- dedicated readiness and hardening documentation.

What remains is external activation evidence rather than a new storefront implementation: approved publisher/program access, real credentials/feed access, a sanitized real feed sample, verified mapping, preview import and the existing production activation gate.

### bol — contract ready, adapter activation still required

Repository support already includes:

- a bol product-feed contract;
- bol affiliate tracking support;
- bol acceptance/readiness logic and documentation.

The repository does not currently expose a registered bol feed adapter alongside the Daisycon adapter. bol should therefore be treated as contract-ready, not yet as a production feed source. The next implementation step is to connect the real approved bol delivery format to the generic `FeedAdapter` boundary, then pass the normal preview and activation gates.

### Awin — planned provider

No Awin-specific feed adapter or contract is present in the repository today.

That is not a storefront gap. Awin should be added only after Winkelnu has access to the actual approved product-feed/API shape that will be used. We should not hard-code a guessed provider schema.

The Awin implementation should consist of:

1. register the network and merchant integration;
2. register the real source type and secret reference;
3. implement the smallest provider adapter needed to emit `FeedCandidate`;
4. capture a sanitized real sample and lock the mapping with tests;
5. run preview ingestion and inspect rejects/matching;
6. verify affiliate destinations and click redirects;
7. pass the existing production activation gate;
8. only then schedule production imports.

## Standard partner activation path

Every future provider should follow the same sequence:

1. **Commercial approval** — the Winkelnu publisher/account and merchant/program are approved.
2. **Registry** — network/marketplace, merchant integration and feed source are registered.
3. **Secrets** — credentials or generated feed URLs live only in server-side environment secrets.
4. **Adapter** — provider data is translated into the existing normalized feed contract.
5. **Real sample** — a sanitized provider sample verifies actual field names and semantics.
6. **Preview import** — validation, matching, rejects, prices, shipping, availability and affiliate URLs are checked before persistence is promoted.
7. **Catalog verification** — products/offers are visible through the normal catalog read path and ranking/freshness behave correctly.
8. **Affiliate verification** — destination validation, redirect behavior and click attribution are verified.
9. **Production gate** — `assessPartnerProductionActivation` must report `production_approved`.
10. **Scheduled import** — only after approval is the source enabled on a production schedule.

## Storefront contract

The public application consumes normalized products and offers. It must not know whether an offer originated from Daisycon, bol, Awin or a direct merchant.

That separation is the key Affiliate Partner Readiness v1 decision: **add providers behind the existing ingestion boundary; do not rebuild the storefront per network.**

## Next external milestone

The best first real activation remains one approved partner/feed at a time. Once one real provider completes the full path from sanitized sample to production-approved import, the same evidence flow becomes the template for the next network.
