# Lootje & Lijstje — L0 Architecture

Status: **Approved L0 architecture baseline; no runtime implementation enabled yet.**

Date: 2026-09-13

Issue: #98 — `Winkelnu Lootje & Lijstje MVP`

## 1. Purpose

`Lootje & Lijstje` is a lightweight, no-login gifting module inside Winkelnu. It combines two flows that may be used independently or together:

1. **Lijstje** — create and share a wish list.
2. **Lootje** — create a group, invite participants, draw names and privately reveal one recipient per participant.

The combined product promise is:

> **Van lootje tot gekocht cadeau in één flow.**

The module must strengthen Winkelnu's existing shopping-discovery and affiliate journey rather than become a second standalone platform.

## 2. Fixed MVP constraints

The following are product constraints for v1:

- no consumer account;
- no password;
- no required email address;
- no required phone number;
- no public profile;
- no chat;
- no push notifications;
- no own checkout;
- no payment collection;
- no AI gift assistant;
- no price alerts;
- no birthday calendar;
- no scraping of external shops;
- no duplicate product catalogue;
- use existing Winkelnu catalogue/product/offer/affiliate logic where a Winkelnu product is selected.

Persistence must remain deliberately small. Supabase/PostgreSQL is used because Winkelnu already has a trusted server-side Supabase boundary; consumer auth is not introduced for this module.

## 3. UX principles

The experience is mobile-first because the dominant sharing path is expected to be:

`WhatsApp/share link -> join/open list -> add wishes -> reveal recipient -> find gift -> merchant`

The module must inherit `docs/WINKELNU_DESIGN_SYSTEM.md`:

- petrol/cream/white as the base visual system;
- warm terracotta only as a selective accent;
- existing button, card, focus and radius language;
- WCAG AA minimum contrast;
- touch-friendly controls;
- reduced-motion support for the reveal animation.

The module must feel playful but not childish or Sinterklaas-only. Seasonal copy may change, but the underlying product remains evergreen.

## 4. Canonical routes

### Public / discovery routes

- `/lootje-lijstje`
  - evergreen landing page;
  - explains `Maak een lijstje` and `Trek lootjes`;
  - may receive seasonal Sinterklaas/Kerst campaign copy.

- `/lootje-lijstje/lijstje/nieuw`
  - standalone list creation.

- `/lootje-lijstje/lijstje/[shareCode]`
  - read-only shared list;
  - unguessable share code;
  - `noindex, nofollow`.

- `/lootje-lijstje/groep/nieuw`
  - group creation.

- `/lootje-lijstje/groep/[groupCode]`
  - invitation/join surface;
  - shows only the minimum group information needed to join;
  - `noindex, nofollow`.

### Capability-protected routes

- `/lootje-lijstje/lijstje/[shareCode]/bewerken`
  - list-owner grant required.

- `/lootje-lijstje/groep/[groupCode]/mijn`
  - participant grant required.

- `/lootje-lijstje/groep/[groupCode]/mijn/lootje`
  - participant grant required;
  - only the participant's own assignment may be returned.

- `/lootje-lijstje/groep/[groupCode]/beheer`
  - organizer grant required;
  - organizer may manage group metadata/participants/exclusions but may not inspect the full draw mapping.

### Bootstrap access route

- `/lootje-lijstje/toegang/[token]`
  - no page UI;
  - accepts an opaque recovery/access token once;
  - validates its hash server-side;
  - exchanges it for an HttpOnly signed grant cookie;
  - immediately redirects to a token-free canonical route.

Opaque capability tokens may occur in a recovery URL, but no name, email, gift wish, recipient identity or other personal content may be encoded in the URL.

## 5. Main screen states

### 5.1 Landing

Primary actions:

- `Maak een lijstje`
- `Trek lootjes`

Secondary copy explains that no account is required.

### 5.2 Standalone list creation

Required:

- display name;
- occasion.

Optional:

- list title;
- minimum budget;
- maximum budget;
- event date.

After creation:

- issue owner grant;
- create share code;
- redirect to edit surface;
- display `Kopieer link` and `Deel via WhatsApp`.

### 5.3 List edit

Item types:

1. `winkelnu_product`
2. `external_link`
3. `text`

Winkelnu product selection reuses the existing catalogue/search layer. The gift module never creates a second product record.

### 5.4 Group creation

Required:

- group name;
- occasion.

Optional:

- budget per participant;
- event date.

The organizer receives a management grant and, by default, is added as the first participant. Before the draw, the organizer may remove their participant entry while retaining organizer access.

### 5.5 Group join

A participant enters a display name and joins through the group link.

Rules:

- duplicate normalized display names in one active group are rejected;
- the UI asks the second person to add an initial or distinguishing text;
- no email or phone number is requested;
- a participant list is created for that participant;
- a participant recovery link is generated once and can be copied/shared to self.

### 5.6 Pre-draw participant view

Shows:

- group name;
- date/budget when configured;
- participant names;
- readiness/list status;
- own wish-list edit action;
- no draw result before the group is drawn.

### 5.7 Draw reveal

The reveal surface starts with `Onthul mijn lootje` and then shows only:

- recipient display name;
- group budget/date;
- recipient wish-list items;
- relevant Winkelnu discovery links.

No API response used by a participant page may contain assignments belonging to other participants.

### 5.8 Organizer management

Organizer can:

- edit group name, date and budget before draw;
- remove participants before draw;
- add/remove exclusion pairs before draw;
- trigger draw;
- trigger full redraw after explicit confirmation;
- delete the group.

Organizer cannot:

- inspect all giver -> recipient mappings;
- change one recipient manually;
- secretly repair only one assignment after draw.

## 6. Access and capability model

Consumer access is capability-based, not account-based.

### 6.1 Token classes

Three long-lived recovery capabilities exist:

- list-owner token;
- organizer token;
- participant token.

Each token is generated with at least 256 bits of CSPRNG entropy and encoded as base64url.

Only `SHA-256(token)` is persisted. Raw recovery tokens are never stored in PostgreSQL and never written to application logs intentionally.

### 6.2 Share/group codes

List share codes and group invitation codes are separate from owner/participant capabilities.

They are:

- opaque;
- CSPRNG-generated;
- at least 128 bits of entropy;
- stored as SHA-256 hashes;
- intended for sharing;
- read/join capability only, never owner/organizer authority.

### 6.3 Bootstrap exchange

Opening `/lootje-lijstje/toegang/[token]` performs:

1. hash raw token;
2. resolve matching active capability server-side;
3. reject expired/deleted records;
4. add the corresponding grant to the signed HttpOnly session cookie;
5. redirect with HTTP 303 to the canonical token-free route.

### 6.4 Signed grant cookie

Use one first-party cookie, for example `wn_gift_access`.

Properties:

- `HttpOnly`;
- `Secure` in production;
- `SameSite=Lax`;
- path `/lootje-lijstje`;
- signed server-side using dedicated `WINKELNU_GIFT_SESSION_SECRET`;
- contains only opaque entity IDs/grant types/expiry, never wish text or recipient names;
- tampering invalidates the complete grant payload.

The signing secret must be separate from the Supabase service-role key.

A single cookie may contain multiple grants so a visitor can participate in more than one active group without repeatedly replacing access for the previous group.

### 6.5 Database boundary

Gift tables use the same security posture as the existing persistent catalogue:

- RLS enabled;
- no `anon` policy;
- no `authenticated` consumer policy;
- no direct browser CRUD;
- all persistence through trusted server-side service-role code;
- browser receives only application DTOs already filtered for the current capability.

The existing `createSupabaseServerClient()` server-only boundary remains the persistence entry point.

## 7. Exact L0 data model

The MVP uses seven small tables. PostgreSQL UUIDs are relational implementation details. Application-facing entities also receive stable `external_key` values in line with the existing database contract.

### 7.1 `gift_lists`

Purpose: standalone or participant-linked wish list.

Fields:

- `id uuid primary key default gen_random_uuid()`
- `external_key text unique not null`
- `share_code_hash text unique not null`
- `owner_token_hash text unique null`
- `display_name text not null`
- `title text null`
- `occasion text not null`
- `budget_min_cents integer null`
- `budget_max_cents integer null`
- `event_date date null`
- `status text not null default 'active'`
- `expires_at timestamptz not null`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Rules:

- standalone lists receive an `owner_token_hash`;
- participant-linked lists may be managed through the participant grant and therefore do not require a second owner token;
- budget values must be non-negative and minimum may not exceed maximum;
- `status` is constrained to `active | archived` in v1.

### 7.2 `gift_list_items`

Purpose: wishes on a list.

Fields:

- `id uuid primary key default gen_random_uuid()`
- `gift_list_id uuid not null references gift_lists(id) on delete cascade`
- `item_type text not null`
- `product_external_key text null`
- `external_url text null`
- `title text not null`
- `image_url_snapshot text null`
- `price_cents_snapshot integer null`
- `currency_snapshot text null`
- `note text null`
- `sort_order integer not null default 0`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Rules:

- `item_type` is `winkelnu_product | external_link | text`;
- `winkelnu_product` requires `product_external_key`;
- `external_link` requires an HTTPS `external_url`;
- text wishes do not require URL/product identity;
- title and snapshots remain available if a catalogue product later disappears;
- snapshot fields are fallback presentation data, not a second catalogue.

### 7.3 `gift_groups`

Purpose: draw group and organizer state.

Fields:

- `id uuid primary key default gen_random_uuid()`
- `external_key text unique not null`
- `group_code_hash text unique not null`
- `organizer_token_hash text unique not null`
- `name text not null`
- `occasion text not null`
- `budget_cents integer null`
- `event_date date null`
- `status text not null default 'draft'`
- `draw_version integer not null default 0`
- `expires_at timestamptz not null`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Rules:

- `status` is `draft | drawn | closed`;
- only `draft` groups may change participant/exclusion structure;
- redraw is a deliberate transition from `drawn` through one atomic replacement operation, not manual editing of assignments;
- budget must be non-negative.

### 7.4 `gift_group_participants`

Purpose: one participant within one group.

Fields:

- `id uuid primary key default gen_random_uuid()`
- `external_key text unique not null`
- `group_id uuid not null references gift_groups(id) on delete cascade`
- `gift_list_id uuid unique not null references gift_lists(id) on delete cascade`
- `participant_token_hash text unique not null`
- `display_name text not null`
- `joined_at timestamptz not null default now()`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Rules:

- one list per participant in v1;
- participant display names are unique per group after lower-case/trim normalization;
- hard maximum: 50 participants per group;
- minimum to draw: 2 participants.

### 7.5 `gift_group_exclusions`

Purpose: directed forbidden giver -> recipient relation.

Fields:

- `id uuid primary key default gen_random_uuid()`
- `group_id uuid not null references gift_groups(id) on delete cascade`
- `participant_id uuid not null references gift_group_participants(id) on delete cascade`
- `excluded_recipient_id uuid not null references gift_group_participants(id) on delete cascade`
- `created_at timestamptz not null default now()`

Rules:

- participant may not equal excluded recipient;
- unique `(group_id, participant_id, excluded_recipient_id)`;
- both participant rows must belong to the same group;
- the v1 UI presents mutual exclusion pairs and writes both directed rows;
- the domain model keeps the relation directed so later rules can become more flexible without a schema break.

### 7.6 `gift_group_assignments`

Purpose: current secret draw mapping.

Fields:

- `id uuid primary key default gen_random_uuid()`
- `group_id uuid not null references gift_groups(id) on delete cascade`
- `draw_version integer not null`
- `giver_participant_id uuid not null references gift_group_participants(id) on delete cascade`
- `recipient_participant_id uuid not null references gift_group_participants(id) on delete cascade`
- `created_at timestamptz not null default now()`

Rules:

- giver may not equal recipient;
- unique `(group_id, draw_version, giver_participant_id)`;
- unique `(group_id, draw_version, recipient_participant_id)`;
- both participants must belong to the same group;
- only the current draw is retained after a redraw; old mappings are deleted atomically to minimise sensitive retention.

### 7.7 `gift_item_reservations`

Purpose: allow the assigned giver to mark one of the recipient's wishes as arranged without leaking that state to the recipient.

Fields:

- `id uuid primary key default gen_random_uuid()`
- `group_id uuid not null references gift_groups(id) on delete cascade`
- `gift_list_item_id uuid not null references gift_list_items(id) on delete cascade`
- `reserved_by_participant_id uuid not null references gift_group_participants(id) on delete cascade`
- `created_at timestamptz not null default now()`

Rules:

- unique `(group_id, gift_list_item_id)`;
- reservation is only valid when `reserved_by_participant_id` is currently assigned to the participant who owns that list;
- list-owner DTOs never include reservation data;
- reservation is deleted automatically when the item/group disappears or when a redraw invalidates the giver-recipient relation.

## 8. Database indexes and checks

The first migration must include at minimum:

- unique indexes for every `external_key`;
- unique indexes for token/code hashes;
- group participant lookup index on `group_id`;
- list item lookup/sort index on `(gift_list_id, sort_order, created_at)`;
- exclusion lookup index on `(group_id, participant_id)`;
- assignment lookup indexes on giver and recipient;
- reservation lookup index on `gift_list_item_id`;
- check constraints for enum-like status/type values;
- check constraints for non-negative cents values;
- check constraint preventing giver = recipient;
- check constraint preventing self-exclusion.

Cross-row/same-group rules that cannot be expressed safely with simple checks are enforced in the transactional application/RPC layer and covered by tests.

## 9. Draw engine contract

The draw engine lives in `src/domain/gifting` and has no Supabase dependency.

Input:

- active participant IDs;
- directed exclusion pairs;
- CSPRNG-backed shuffle/random source abstraction.

Output:

- complete one-to-one assignment; or
- explicit `NO_VALID_DRAW` result.

Invariants:

1. every active participant is exactly one giver;
2. every active participant is exactly one recipient;
3. nobody receives themselves;
4. no exclusion edge is violated;
5. no partial assignment is persisted;
6. failure leaves the existing draw untouched.

Implementation strategy:

- build eligible-recipient sets per giver;
- randomize traversal/candidate order with a cryptographically secure random source;
- solve as a complete bipartite matching/backtracking problem;
- fail explicitly when no perfect matching exists.

Do not implement draw correctness as an unbounded `shuffle until it works` loop.

The public claim is `willekeurig verdeeld binnen de ingestelde uitsluitingen`; v1 does not claim mathematically uniform sampling across every possible valid permutation.

Reciprocal pairs are allowed unless the organizer explicitly excludes that relation.

## 10. Atomic draw and redraw

Draw persistence must be atomic.

The server operation must:

1. lock/read the target group in expected state;
2. load current participants/exclusions;
3. compute a complete valid draw;
4. revalidate participant/exclusion version/state before commit;
5. insert the complete assignment set;
6. increment `draw_version`;
7. change group status to `drawn`;
8. commit all changes together.

Redraw must:

1. compute a complete replacement first;
2. in one transaction delete old reservations;
3. replace old assignments;
4. increment `draw_version`;
5. keep only the new assignment set.

A PostgreSQL function/RPC or equivalent transaction boundary is preferred because multiple service-role REST calls cannot provide the required all-or-nothing guarantee by themselves.

## 11. Repository/component architecture

Internal module name: `gifting`.

### Domain

Create:

- `src/domain/gifting/types.ts`
- `src/domain/gifting/draw.ts`
- `src/domain/gifting/draw.test.ts`
- `src/domain/gifting/validation.ts`

Responsibilities:

- entities/value types;
- draw invariants;
- exclusion validation;
- pure validation;
- no React, Supabase or HTTP dependencies.

### Application

Create `src/application/gifting/` with use-case oriented modules such as:

- `create-gift-list.ts`
- `add-gift-list-item.ts`
- `update-gift-list-item.ts`
- `create-gift-group.ts`
- `join-gift-group.ts`
- `update-gift-group.ts`
- `set-gift-group-exclusions.ts`
- `draw-gift-group.ts`
- `redraw-gift-group.ts`
- `get-participant-gift-view.ts`
- `reserve-gift-item.ts`
- `delete-gift-group.ts`
- `access-grants.ts`

Responsibilities:

- authorization by capability grant;
- DTO shaping/redaction;
- orchestration;
- calling domain rules and repository interfaces.

### Infrastructure

Create:

- `src/infrastructure/gifting/supabase-gift-repository.ts`
- `src/infrastructure/gifting/gift-capabilities.ts`
- `src/infrastructure/gifting/gift-session-cookie.ts`

Responsibilities:

- Supabase persistence;
- token hashing/generation;
- signed cookie encode/verify;
- transaction/RPC calls;
- no UI behavior.

### Components

Create `src/components/gifting/` with reusable surfaces:

- `gift-landing-hero.tsx`
- `gift-choice-card.tsx`
- `gift-list-form.tsx`
- `gift-list-item-card.tsx`
- `gift-list-item-editor.tsx`
- `gift-share-actions.tsx`
- `gift-group-form.tsx`
- `gift-group-participants.tsx`
- `gift-group-exclusions.tsx`
- `gift-draw-confirmation.tsx`
- `gift-reveal-card.tsx`
- `gift-recipient-list.tsx`
- `gift-empty-wishes.tsx`

Existing storefront primitives and design tokens must be reused before creating new generic primitives.

### App Router

Pages remain thin orchestration/rendering layers under `src/app/lootje-lijstje`.

Mutations should use server actions where they naturally belong to forms. Capability bootstrap and any endpoint requiring explicit redirect/HTTP semantics use Route Handlers.

No client component may import the service-role Supabase client.

## 12. Catalogue and affiliate integration

For `winkelnu_product` wishes:

- persist `product_external_key`, not a merchant offer ID;
- persist title/image/price snapshots only as graceful fallback;
- on render, try to resolve the current canonical product through the existing catalogue application layer;
- when current offers exist, reuse the existing product/offer/affiliate CTA path;
- never copy or persist affiliate destination URLs into the gift tables;
- never let commission become a gift recommendation ranking signal silently.

If the canonical product is no longer available, show the snapshot plus a neutral unavailable/alternative state rather than deleting the wish.

Text wishes and external links remain valid even before the first real affiliate partner is live.

## 13. Privacy and retention

`Lootje & Lijstje` introduces consumer-provided personal data and therefore requires an update to the public privacy/legal inventory before production launch.

Data minimisation rules:

- names only; no required email/phone/address/date of birth;
- wish text should not request sensitive information;
- no raw access tokens stored;
- no raw IP address stored in gift tables;
- no analytics event may include raw recovery tokens, group codes, wish text or recipient identity;
- capability/private pages are `noindex, nofollow`;
- gift routes must be excluded from any URL-level analytics that would capture capability-bearing bootstrap URLs.

Retention baseline:

- dated group: delete 120 days after `event_date`;
- undated group: delete 180 days after creation/last meaningful edit;
- standalone list: delete 180 days after last meaningful edit unless manually deleted earlier;
- deletion cascades through participants, assignments, items and reservations.

A scheduled server-only cleanup operation may reuse the existing trusted operations/cron boundary. Cleanup must not require a consumer account.

## 14. Abuse and safety limits

MVP hard limits:

- maximum 50 participants per group;
- maximum 100 items per list;
- bounded title/name/note lengths;
- external links must be valid HTTPS URLs;
- mutation payload sizes are bounded;
- capability lookup responses are deliberately generic for invalid/expired tokens.

Platform/application rate limiting is a launch gate for high-write actions such as group creation and join. It must not add raw IP storage to the gift tables. The exact rate-limit implementation belongs to the implementation milestone, not the domain schema.

## 15. SEO and metadata

- landing page may be indexable and receives normal page-specific OG/Twitter metadata;
- new/create/edit/join/private/reveal/manage pages are `noindex`;
- shared lists are `noindex, nofollow` in v1;
- group/list names must never be inserted into public sitemap generation;
- private pages must not emit recipient/wish content into Open Graph metadata.

## 16. Error/edge-state contract

The UI needs explicit states for:

- invalid or expired invite link;
- invalid or expired recovery link;
- duplicate participant name;
- group full;
- group already drawn;
- participant removed before draw;
- no valid draw due to exclusions;
- product no longer available;
- external link invalid;
- wish list empty;
- group deleted/expired;
- stale form submission after another participant/group change.

No error screen may reveal whether a guessed token/code belongs to a specific named person.

## 17. Required tests before production

### Domain tests

- 2, 3, 10 and 50 participant draws;
- no self assignment;
- unique giver/recipient assignment;
- directed exclusions respected;
- impossible graph returns `NO_VALID_DRAW`;
- deterministic injected random source for repeatable unit tests.

### Access/security tests

- raw token never persisted;
- wrong token cannot create grant;
- tampered signed grant cookie rejected;
- participant cannot read another assignment;
- organizer cannot fetch full mapping;
- recipient-facing list DTO never exposes reservation state;
- private routes emit `noindex`.

### Persistence/transaction tests

- draw commits all assignments or none;
- concurrent draw attempts cannot create two active mappings;
- redraw replaces all mappings atomically;
- redraw deletes stale reservations;
- cascade deletion removes group-linked personal data;
- retention cleanup removes expired groups/lists.

### Storefront integration tests

- current Winkelnu product resolves by `product_external_key`;
- missing product falls back to stored snapshot;
- outbound offer CTA continues to use existing affiliate redirect/attribution behavior;
- gift data never changes organic offer ranking.

## 18. Migration/database contract work required in L1

When implementation starts, the first database PR must:

1. add the seven gift tables in the next numbered migration;
2. enable RLS on every gift table with no anon/auth policies;
3. add required service-role grants following existing migration conventions;
4. add atomic draw/redraw RPC(s) where needed;
5. update `scripts/verify-database-contract.mjs`;
6. update/generate `src/infrastructure/supabase/database.types.ts` from the target preview schema;
7. add preview schema verification;
8. run the normal repository quality/build checks before merge.

No production migration should be applied casually while the UX/application layer is incomplete.

## 19. Build sequence after L0

- **L1 — Standalone Lijstje foundation**
  - migration + repository + list create/edit/share;
- **L2 — Winkelnu product wishes**
  - catalogue search/select + snapshot fallback;
- **L3 — Group creation and joining**
  - group state + participants + group-linked lists;
- **L4 — No-login capability access**
  - recovery token exchange + signed grant cookie;
- **L5 — Draw engine and exclusions**
  - pure matching engine + atomic persistence;
- **L6 — Reveal, reservation and Winkelnu journey**
  - recipient list + `geregeld` state + existing affiliate path;
- **L7 — Privacy, retention, mobile QA and production acceptance**
  - compliance update + cleanup + edge cases + live verification.

## 20. L0 decision summary

L0 fixes the following decisions so implementation does not reopen them casually:

- consumer product name: **Lootje & Lijstje**;
- no mandatory account/login;
- App Router routes under `/lootje-lijstje`;
- capability-based access with hashed recovery tokens;
- token exchange to signed HttpOnly grant cookie;
- server-only Supabase service-role persistence;
- seven-table minimal schema;
- pure domain draw engine with exact validity constraints;
- atomic draw/redraw transaction;
- organizer cannot inspect the complete mapping;
- reservation state is isolated from recipient-facing list data;
- existing Winkelnu catalogue/offer/affiliate path is reused;
- mobile-first Winkelnu design system;
- private/share pages stay out of search engines in v1;
- automatic retention/deletion is part of production readiness.

Any change to one of these rules during implementation should be treated as an explicit architecture change rather than an incidental coding choice.
