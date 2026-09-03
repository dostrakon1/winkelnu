# bol Affiliate Integration Readiness

Status: repository-side readiness profile implemented; real bol affiliate access and live feed validation pending.

## Verified official model (research date: 2026-09-03)

Winkelnu targets the **bol Affiliate Programma**, not the seller Retailer API.

Current official bol affiliate materials state that:
- affiliates can use productfeeds and a Marketing API;
- productfeeds are distributed per product group, in CSV/XML variants, and are regenerated every few hours;
- productfeed/API product URLs are normal bol product URLs and must be converted to an affiliate tracking URL by the affiliate;
- tracking uses the affiliate `Site_ID`, with optional link name/subid for reporting;
- client credentials must remain server-side;
- local caching/storage is permitted, but price/availability/delivery information must remain aligned with bol;
- bol content must be clearly attributed to bol, the application must not present itself as bol, and a Dutch consumer experience must be available;
- when API participation ends, locally stored bol content must be removed.

Official sources used for this milestone:
- https://affiliate.bol.com/nl/
- https://affiliate.bol.com/nl/handleiding/handleiding-productfeed/
- https://affiliate.bol.com/nl/handleiding/tracking-url/
- https://affiliate.bol.com/nl/handleiding/aan-de-slag-api/
- https://affiliate.bol.com/nl/algemene-voorwaarden/
- https://api.bol.com/marketing/docs/product-feed/product-feed-groups.html

## Architecture decision

The first bol bulk-ingestion path will be **productfeed-first**.

Reasoning:
- Winkelnu needs broad catalog ingestion rather than seller account management;
- bol exposes category/product-group feeds designed for affiliate/catalog use;
- the existing Winkelnu import architecture already handles feed traversal, matching, freshness, ranking and partner acceptance;
- the Marketing API remains available later for targeted enrichment or lookup when its current contract is useful.

The Retailer API is not used as the affiliate catalog ingestion source merely because it also exposes product/offer concepts. It serves seller/intermediary/advertiser use-cases and is a separate bol integration role.

## Tracking boundary

`buildBolAffiliateTrackingUrl()` converts a regular HTTPS bol product URL into a `https://partner.bol.com/click/click` tracking destination. It validates:
- numeric Site_ID;
- bol.com destination host;
- required tracking parameters;
- optional subid/name boundaries.

The generic Winkelnu redirect service continues to own click attribution and redirects to this generated destination.

## bol acceptance profile

`assessBolAffiliateReadiness()` extends the generic M0.27 partner gate with bol-specific checks:
1. expected numeric Site_ID configured;
2. tracking URL uses that exact Site_ID;
3. bol/source attribution is visible and Winkelnu does not impersonate bol;
4. Dutch experience is available;
5. price/availability/delivery freshness policy is enforced;
6. termination cleanup procedure exists;
7. real bol affiliate productfeed access is verified.

Repository tests can reach `repository_ready`. They can never manufacture `production_approved`: real feed access, a sanitized real feed sample, live Supabase readiness and a live non-destructive preview remain required.

## Transport boundary still pending

Official affiliate productfeeds are accessed through bol's feed access/FTP flow. Winkelnu does not currently contain a production FTP downloader and deliberately does not add one before real credentials and a sanitized current feed header/sample are available.

That prevents us from guessing:
- credential/host details;
- exact current CSV/XML field names;
- compression/encoding details;
- category-specific schema differences;
- production retry/resume behavior.

Once real access is available, the transport will download to a server-side staging boundary and hand parsed records to the existing `FeedAdapter`/`importFeed` path. Credentials must never reach the browser or source control.

## Production stop conditions

bol activation remains blocked when any of the following is true:
- Site_ID is missing or mismatched;
- tracking URL is not valid for the expected Site_ID;
- real productfeed access has not been verified;
- a sanitized current feed sample has not validated the mapper;
- preview acceptance is below 95% or requires manual matching;
- price/availability freshness cannot be kept current;
- bol attribution/legal presentation requirements are not met;
- termination cleanup is not operational;
- live Supabase readiness is not green.

## Next step

M0.29 should implement **bol Product Feed Transport & Real Mapping Validation** once real affiliate feed access or a sanitized current bol feed sample is available. Until then, M0.28 is repository-ready, not live-approved.
