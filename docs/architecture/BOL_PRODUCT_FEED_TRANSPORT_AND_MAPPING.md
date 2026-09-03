# bol Product Feed Transport & Mapping Architecture

Status: repository-side implemented; real feed access/sample still required.

## Verified provider contract
Official bol Affiliate documentation states that product feeds are offered per product group as gzip-compressed CSV or XML files, CSV columns are separated by `|`, the first row contains the column names, and all feeds share the same structure. Feed snapshots are generated roughly every two hours; unavailable products are removed from the feed. Product URLs in the feed are normal bol URLs and must be transformed into Affiliate tracking URLs by the partner.

The current Affiliate FAQ states that feed access is through bol's FTP environment, requires one credential set per affiliate account, and uses IPv4 whitelisting. The old `bol_pricecompare` FTP location was retired in 2024. A later bol notice announced an FTP IP-range move in October 2025.

## Architecture decision
Winkelnu does not embed guessed FTP hostnames, credentials or column names in domain/application code.

Transport boundary:
`BolProductFeedTransport`
- `listFiles()` exposes eligible feed snapshots;
- `openLines(fileName)` exposes a decompressed streaming line source;
- a future live FTP implementation is server-only and may be swapped without changing mapping/import logic.

Mapping boundary:
`BolProductFeedMappingProfile`
- maps exact header names observed in a real feed to Winkelnu fields;
- no field binding is accepted implicitly;
- required bindings are merchant product id, title, product URL and price;
- optional bindings include GTIN, brand, description, category, image, availability, shipping and source-updated timestamp.

Schema inspection:
`inspectBolProductFeedSchema()`
- strips a UTF-8 BOM;
- parses the official `|` delimiter;
- rejects duplicate headers;
- rejects any mapping binding not present in the real header.

Sample validation:
`validateBolProductFeedSample()`
- validates schema first;
- maps each supplied data row through the explicit profile;
- generates bol Affiliate tracking URLs with the Winkelnu Site_ID;
- applies the existing Winkelnu `FeedCandidate` validation rules;
- defaults to a 95% minimum acceptance rate;
- fails closed on malformed rows or missing bindings.

## Important non-claim
Repository tests use synthetic header names solely to exercise the mapping engine. They are not treated as the official bol feed schema. A sanitized current feed header/sample remains mandatory before production mapping can be approved.

## Live transport gate
Do not implement or enable the production FTP adapter until all of these are known from the user's actual bol Affiliate account:
1. current connection endpoint/instructions;
2. credential delivery/configuration;
3. required outbound IPv4 to whitelist;
4. at least one current `.csv.gz` filename visible to the account;
5. the exact first/header row from a downloaded current feed.

Credentials remain server-only. Feed payloads are streamed rather than loaded wholesale into memory.
