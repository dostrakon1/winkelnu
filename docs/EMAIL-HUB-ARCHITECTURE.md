# Winkelnu Email Hub Architecture v1

Status: architecture approved; implementation not started.

## Purpose

Winkelnu needs one communication platform for marketing updates and product/service notifications without turning every email use case into a separate subsystem.

The Email Hub is the central boundary for:

1. **Winkelnu Updates** — new buying guides, noteworthy deals, seasonal pages and new Winkelnu features.
2. **Price alerts** — user-requested notifications such as “notify me below €300”.
3. **Saved items and lists** — later notifications such as “a saved product became cheaper”.
4. **Lootje & Lijstje** — invitations and practical gifting notifications.
5. **Account email** — magic-link login, verification and security/account messages.

Resend is the delivery provider. Supabase is the source of truth for contacts, permissions, subscriptions, alerts, campaigns and delivery state. Winkelnu decides why an email may be sent.

## Core principles

- No mandatory customer account is required to receive a requested alert.
- One email address is represented by one canonical contact record.
- Marketing consent is never inferred from use of a transactional feature.
- A price alert, gifting invitation or account email does **not** subscribe someone to Winkelnu Updates.
- Transactional/security email and optional marketing preferences remain separate.
- All provider callbacks are treated as untrusted input and verified before persistence.
- Raw access, unsubscribe and verification tokens are never stored; only hashes are persisted.
- Email identity must not silently become analytics identity. The existing privacy-safe web measurement boundary remains separate.
- Provider event handling must be idempotent.
- Suppressions override campaigns and automations where applicable.
- Secret gifting draw outcomes must never be exposed in generic email logs or the admin dashboard.

## Communication classes

### `marketing_updates`

Examples:
- new buying guides;
- selected deal roundups;
- seasonal collections;
- new Winkelnu features.

Requires an explicit marketing opt-in. V1 should use double opt-in before the contact becomes eligible for campaigns.

### `price_alerts`

A requested service tied to a specific product and optional target price. A contact may have several active alerts without being subscribed to marketing.

### `saved_item_updates`

Future opt-in notifications tied to favourites, wishlists or saved comparison shortlists. Examples include price decreases or a product becoming available again.

### `gifting_transactional`

Practical Lootje & Lijstje communication. This is service communication, not a marketing subscription. Admin visibility is limited to operational metadata such as delivery state; recipient pairing/draw secrets are excluded.

### `account_transactional`

Authentication, verification, recovery and security/account email. These messages are service/security messages and are not controlled by the marketing unsubscribe preference.

## Identity model

The Email Hub must support three stages of identity:

```text
anonymous visitor (optional visitor_id)
        ↓
email contact
        ↓
optional authenticated user_id
```

A contact can therefore exist without a Winkelnu account. Later, when an authenticated account is created, contact ownership and eligible saved data can be linked without recreating subscriptions or alerts.

`visitor_id` is optional and purpose-bound. If a future saved-items feature introduces a first-party anonymous identifier, it must not be reused by Vercel Web Analytics or treated as a cross-site tracking identifier.

## Proposed data model

The first schema milestone should introduce these tables. Exact SQL types and indexes are an implementation concern for the migration milestone, but the ownership boundaries below are fixed for v1.

### `email_contacts`

Canonical recipient identity.

Suggested fields:
- `id uuid primary key`
- `email text`
- `email_normalized text unique`
- `user_id uuid null`
- `visitor_id uuid/text null`
- `status` (`pending`, `active`, `suppressed`)
- `verified_at timestamptz null`
- `created_at`
- `updated_at`

Do not create duplicate contact rows for the same normalized email address.

### `email_preferences`

Current preference state per contact and communication class.

Suggested fields:
- `contact_id`
- `preference_key`
- `enabled boolean`
- `updated_at`

Marketing preferences and optional saved-item notifications live here. Transactional account email is not disabled through this table.

### `email_consents`

Append-oriented evidence of consent/preference changes.

Suggested fields:
- `id`
- `contact_id`
- `consent_type`
- `action` (`granted`, `revoked`)
- `source` (`footer`, `price_alert`, `account`, `gifting`, `admin`, etc.)
- `policy_version`
- `occurred_at`

The current preference is held in `email_preferences`; the consent log provides evidence/history.

### `email_verification_tokens`

Short-lived hashed tokens for double opt-in and address verification.

Suggested fields:
- `id`
- `contact_id`
- `purpose`
- `token_hash`
- `expires_at`
- `used_at null`
- `created_at`

Raw tokens are sent to the user and never stored.

### `email_campaigns`

Operator-created Winkelnu Updates campaigns.

Suggested fields:
- `id`
- `name`
- `subject`
- `preview_text`
- `template_key`
- `content_json`
- `status` (`draft`, `scheduled`, `sending`, `sent`, `cancelled`)
- `scheduled_for null`
- `created_by`
- `created_at`
- `updated_at`

V1 must support draft and test-send before bulk send is enabled.

### `email_campaign_recipients`

Immutable campaign audience snapshot at send time.

Suggested fields:
- `campaign_id`
- `contact_id`
- `eligibility_state`
- `created_at`

This prevents a campaign audience from silently changing while a send is running.

### `email_deliveries`

One operational record per attempted message.

Suggested fields:
- `id`
- `contact_id null`
- `campaign_id null`
- `message_type`
- `template_key`
- `provider`
- `provider_message_id null`
- `status` (`queued`, `sent`, `delivered`, `bounced`, `complained`, `failed`)
- `last_error_code null`
- `created_at`
- `updated_at`

Do not store email bodies containing gifting secrets in generic delivery logs.

### `email_provider_events`

Idempotent audit boundary for verified Resend webhook events.

Suggested fields:
- `provider_event_id unique`
- `provider_message_id`
- `event_type`
- `occurred_at`
- `received_at`
- minimal verified metadata

### `email_suppressions`

Central safety boundary for addresses that must not receive optional/bulk email.

Suggested fields:
- `id`
- `contact_id`
- `reason` (`unsubscribe`, `bounce`, `complaint`, `manual`)
- `scope` (`marketing`, `all_optional`, `all` where legally/operationally appropriate)
- `created_at`
- `released_at null`

A complaint or hard bounce must be able to stop future bulk sends automatically.

### `price_alerts`

Requested product-price monitoring.

Suggested fields:
- `id`
- `contact_id`
- `product_id` / stable product external key
- `target_price_cents null`
- `currency`
- `status` (`pending_verification`, `active`, `triggered`, `paused`, `cancelled`)
- `last_observed_price_cents null`
- `triggered_at null`
- `created_at`
- `updated_at`

A unique/idempotency rule must prevent accidental duplicate active alerts for the same contact/product/threshold combination.

### `email_templates`

Versionable template metadata for the Email Hub.

Suggested fields:
- `key`
- `category`
- `version`
- `subject_template`
- `status`
- `updated_at`

The first implementation may keep React email rendering in code while storing template metadata/version information in the database.

## Public flows

### Winkelnu Updates subscription

```text
footer/form
→ normalize email
→ create/reuse contact
→ record pending marketing preference
→ create hashed verification token
→ Resend double-opt-in email
→ verification endpoint
→ mark address verified
→ record consent event
→ enable marketing_updates
```

The form must clearly state what the person is signing up for. No pre-checked unrelated preferences.

### Price alert

```text
product page
→ choose “notify me” and optional target price
→ provide email if no verified contact is known
→ create/reuse contact
→ verify address when required
→ activate price alert
→ feed/import updates product price
→ alert evaluator detects threshold
→ queue transactional notification
→ send through Resend
→ update delivery + alert state
```

Price-alert enrollment does not enable `marketing_updates`.

### Saved-item/list notification

Future flow:

```text
saved product/list
→ user enables notification type
→ preference/automation record
→ catalog event detects relevant change
→ dedupe/cooldown check
→ queue notification
```

A notification should be tied to a material event, not every feed refresh.

### Lootje & Lijstje email

Gifting can request email delivery for invitations/reminders. The Email Hub receives only the minimum message input necessary to deliver the communication. Pairing/draw information remains inside the gifting domain and must not be exposed in Email Hub admin listings.

### Account email

Supabase Auth remains responsible for authentication semantics. Resend can be used as the SMTP/delivery provider where supported. Account magic links and recovery messages are not campaign messages and do not depend on marketing preference.

## Admin experience

Add a fourth top-level internal operations destination:

```text
Partner operations
Search learning
Campagnes
E-mail
```

Proposed route: `/intern/operations/email`.

Inside E-mail:

```text
Overzicht
Contacten
Updates
Automatiseringen
Prijsalerts
Templates
Verzendingen
Afmeldingen
```

### Overview

Useful aggregate cards:
- total contacts;
- verified contacts;
- active Winkelnu Updates subscribers;
- active price alerts;
- sent today;
- delivery success rate;
- recent bounces;
- recent complaints;
- failed sends requiring attention.

Avoid vanity metrics that depend on invasive tracking. Open/click tracking is out of scope by default and requires a separate privacy/consent review before activation.

### Contacts

Allow operators to see:
- normalized email address;
- verification state;
- account link state;
- preference summary;
- suppression state;
- creation/source metadata.

Do not expose unnecessary browsing history or saved-item behaviour in the contact table.

### Winkelnu Updates

V1 campaign lifecycle:

```text
draft
→ preview
→ send test email
→ choose eligible audience
→ freeze audience snapshot
→ schedule/send
→ monitor delivery state
```

No free-form bulk send directly from an unreviewed text box.

### Price alerts

Show operational fields only:
- product;
- current/last known price;
- threshold;
- state;
- created/triggered date;
- contact eligibility/verification state.

### Deliveries

Filter by:
- message type;
- status;
- provider;
- date;
- campaign;
- email/contact.

Store operational metadata, not sensitive payloads.

## Operator authorization

The current internal role model is `owner`, `operator`, `read_only`. Email Hub should extend permissions rather than bypass this boundary.

Proposed permissions:
- `read_email_operations`
- `manage_email_contacts`
- `manage_email_campaigns`
- `send_email_campaigns`
- `manage_email_automations`

Recommended default mapping:

- `owner`: all email permissions;
- `operator`: read operations + manage drafts/automations, but bulk campaign send can initially remain owner-only;
- `read_only`: read email operations only.

All mutating admin actions should use the existing operator audit/idempotency patterns.

## Resend integration boundary

Resend is an adapter, not the domain model.

Create a provider-neutral application port such as:

```ts
interface EmailDeliveryProvider {
  send(message: OutboundEmail): Promise<ProviderDeliveryReceipt>
}
```

The Resend adapter lives in infrastructure. Application/domain code must not import Resend directly.

Required production concerns:
- API key only in server-side environment variables;
- verified Winkelnu sending domain;
- SPF/DKIM/DMARC configuration;
- signed webhook verification;
- idempotent webhook processing;
- provider timeouts/errors represented as operational states;
- retry policy with a strict cap;
- no secrets in client bundles or logs.

## Sending domain

Use a dedicated sending identity on Winkelnu's domain, for example:

- `updates@winkelnu.nl` for marketing/updates;
- `meldingen@winkelnu.nl` for alerts and gifting;
- authentication sender can use a suitable Winkelnu transactional address.

Exact addresses can be chosen during implementation. A separate subdomain such as `mail.winkelnu.nl` may be introduced if deliverability/segmentation later warrants it.

## Unsubscribe and preference management

Every marketing message must contain a working unsubscribe/preference link.

Preferred flow:

```text
signed/opaque token
→ preference page
→ marketing_updates off
→ consent event recorded
→ suppression/preference state updated
```

One-click unsubscribe support should be added where supported by the sending stack.

Users must be able to stop an individual price alert without globally unsubscribing from required account communication.

## Security and privacy boundaries

- Email addresses are personal data and are not public-readable.
- Client-side code must never query the contact table directly.
- Public actions run through server actions/routes with rate limits and validation.
- Use strict RLS/service-role boundaries consistent with the existing production architecture.
- Admin pages require the operator session and explicit email permissions.
- All public verification/unsubscribe tokens are high entropy, single purpose and hashed at rest.
- Do not persist raw Resend webhook bodies unless required for a short diagnostic window; persist minimal normalized metadata.
- Do not add marketing tracking pixels in v1.
- Do not infer consent from a previously visited page, saved product, gifting action or affiliate click.

## Retention

Retention values should be implemented explicitly instead of keeping all operational records forever.

Initial policy proposal:
- campaign and delivery operational detail: limited retention window, with aggregate reporting retained longer if needed;
- expired verification tokens: delete after a short grace period;
- cancelled/expired price alerts: clean up after an operational retention window;
- consent/withdrawal evidence: retain only as long as needed to demonstrate the relevant permission state/legal history;
- suppressed addresses: retain the minimum information necessary to respect the suppression.

Exact periods should be finalized in the migration/legal implementation milestone and reflected in the public privacy documentation.

## Cost guardrail

Do not build an always-on queueing platform before volume requires it.

V1 can use:
- Next.js server routes/actions;
- Supabase persistence;
- scheduled/controlled worker invocation for alert evaluation;
- Resend for delivery.

Add a dedicated queue/provider only when actual send volume, retry pressure or execution limits demonstrate the need.

## Rollout milestones

### E1 — Data and authorization foundation

- schema migration after current migration `0029`;
- Email Hub tables, constraints, RLS/grants and indexes;
- operator permission expansion;
- domain/application ports and repositories;
- no public form yet.

### E2 — Resend transactional foundation

- provider-neutral delivery service;
- Resend adapter;
- sending-domain configuration;
- webhook verification + delivery-state ingestion;
- test email from internal environment.

### E3 — Admin Email Hub read model

- `/intern/operations/email`;
- overview;
- contacts;
- deliveries;
- suppressions;
- price-alert operational view.

### E4 — Winkelnu Updates

- footer/public signup;
- double opt-in;
- unsubscribe/preferences;
- campaign draft/preview/test-send;
- owner-controlled send;
- public privacy/legal copy update.

### E5 — Price alerts

- product-page alert control;
- threshold persistence;
- evaluator triggered by fresh catalog prices;
- transactional email;
- alert management/cancellation.

### E6 — Saved items and lists email

- connect future favourites/saved-items identity to contacts;
- opt-in notification rules;
- material price/availability change notifications;
- dedupe/cooldowns.

### E7 — Lootje & Lijstje email

- invitations/reminders through Email Hub;
- gifting-specific templates;
- secret-safe admin delivery metadata.

### E8 — Optional customer accounts

- account/contact linking;
- merge eligible anonymous data into user identity;
- Supabase Auth transactional email via the same delivery infrastructure where practical.

## Definition of done for v1 architecture

This architecture is considered established when:

- the Email Hub is treated as one shared platform rather than five independent mailing systems;
- marketing and transactional permissions are explicitly separated;
- Resend is only a provider adapter;
- Supabase remains the source of truth;
- admin visibility is part of the design from the first migration;
- price alerts can exist without a customer account;
- future favourites/lists can link to the same contact identity;
- the existing privacy-safe analytics boundary is not weakened;
- gifting secrets remain outside generic email administration;
- implementation proceeds through the E1–E8 milestones above.
