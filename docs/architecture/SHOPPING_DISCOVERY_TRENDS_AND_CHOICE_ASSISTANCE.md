# Shopping Discovery, Trends & Choice Assistance

Version: 1.0
Status: Accepted strategic architecture
Date: 2026-09-06

## 1. Decision

Winkelnu is not only a price-comparison or affiliate catalogue. Its long-term product direction is:

**Shopping discovery + comparison + trends + smart choice assistance.**

The platform should help a visitor answer four questions:

1. What is interesting right now?
2. Why is it interesting or popular?
3. What alternatives should I consider?
4. Where can I buy it on sensible terms?

Price comparison remains a core capability, but discovery and decision support become equally important product layers.

## 2. Strategic product pillars

### Winkelnu Pulse

Winkelnu Pulse is the internal signal layer that combines evidence about product momentum, price movement and shopper interest.

Potential signal families include:

- product-view growth;
- favourites / saves;
- internal search growth;
- outbound click growth;
- price reductions;
- new or expanding merchant coverage;
- offer availability changes;
- externally sourced trend signals where legally and technically permitted.

Pulse is an architecture concept, not a public score that may be fabricated. Any public claim derived from Pulse must be explainable from real data.

### TrendRadar

TrendRadar is the discovery layer for identifying products or product themes gaining attention outside Winkelnu.

Candidate sources include:

- TikTok-related trend signals;
- Google Trends-related signals;
- Pinterest-related signals;
- later, other suitable public, licensed or partner-provided trend sources.

TrendRadar must not rely on prohibited scraping or unverified popularity claims. Every external source must be evaluated for permitted access, data-use rights, update frequency and attribution requirements before activation.

### Slim Vergelijken

Slim Vergelijken is the decision layer above the canonical catalogue and multi-merchant offer model.

It should evolve toward:

- best-known total price where shipping is known;
- price history and meaningful price-drop context;
- merchant and availability comparison;
- product alternatives;
- category-relative choices;
- explainable recommendation logic;
- later, natural-language and AI-assisted product selection for defined user problems.

AI is an interaction and reasoning layer over verified catalogue data; it may not invent products, prices, availability, reviews or popularity.

## 3. Discovery surfaces

The storefront may eventually expose surfaces such as:

- Trending now;
- Trending on TikTok;
- Fast-rising products;
- Price drops;
- Popular under a price threshold;
- Most saved;
- Most viewed;
- Newly discovered;
- Smart alternatives;
- Trending by category;
- Viral products with multiple merchant offers.

These surfaces must be data-backed. Labels such as `Trending on TikTok` are only valid when a documented TikTok-related signal supports the claim.

Winkelnu must never present wording that implies endorsement by TikTok, Google, Pinterest or another platform unless such endorsement actually exists.

## 4. Trend signal model

The future architecture should separate raw observations from derived scores.

Conceptual entities:

### Trend Source

The origin of a signal, for example `tiktok`, `google_trends`, `pinterest` or `winkelnu_internal`.

### Trend Observation

A time-bound observation connected to a canonical product, brand, category or search concept.

Typical fields may include:

- source;
- subject identity;
- observed_at;
- metric type;
- metric value;
- source confidence;
- provenance / retrieval reference;
- expiry or freshness horizon.

### Product Trend Signal

A normalised product-level signal derived from one or more observations.

### Pulse Score

An optional derived ranking input that combines multiple normalised signals. It must remain explainable and may not silently replace price, relevance or quality ranking rules.

## 5. Product matching for external trends

External trends often refer to names, hashtags, videos, brands or informal product descriptions rather than exact catalogue identifiers.

Matching must therefore use confidence-aware resolution:

1. exact identifiers where available;
2. brand + model / MPN matching;
3. structured aliases;
4. controlled text matching;
5. manual/operator review for uncertain matches.

A low-confidence social trend may not silently attach itself to an unrelated canonical product.

## 6. Price intelligence

Price intelligence is a first-class future capability.

The platform should preserve historical offer snapshots or an equivalent price-history model sufficient to support claims such as:

- price decreased since a prior period;
- current price is near a recent low;
- a merchant became cheaper than another merchant;
- a product gained more eligible offers.

A merchant-provided `sale` label is not by itself evidence of a real price decrease. Winkelnu should distinguish merchant promotion metadata from Winkelnu-observed price history.

## 7. Personal utility

Future user-value features may include:

- favourites / wishlists;
- price alerts;
- saved comparisons;
- saved searches;
- notifications when a selected threshold is reached.

These features should default to low-data designs and must respect the privacy/compliance baseline.

## 8. Visual and semantic search

Future discovery may support:

- image-based product search;
- finding a product from a pasted product name or external reference;
- similarity search for alternatives.

Such features must resolve into the canonical Winkelnu product layer before merchant offers are presented. The discovery input itself is not a merchant offer.

## 9. Smart choice assistance

Winkelnu may evolve from filter-only shopping toward question-based decision support.

Example intent:

`I need a robot vacuum under EUR 300 for a home with a dog.`

A future choice-assistance layer may return a small set of explainable candidates and compare them against the user's constraints.

Requirements:

- recommendations must be grounded in known product attributes and live eligible offers;
- commercial commission may not silently determine the recommendation;
- uncertainty or missing product attributes must remain visible;
- generated explanations may not masquerade as independent reviews or user experience.

## 10. Merchant and network expansion

The multi-merchant foundation remains essential. The current practical partner sequence is:

1. Daisycon as first real affiliate-network/feed activation;
2. bol.com affiliate integration when account/media requirements permit;
3. Awin;
4. TradeTracker;
5. direct merchant programmes and other suitable marketplaces/networks.

This is a rollout preference, not a permanent exclusivity order. Every partner remains subject to current commercial terms, feed/API availability, data rights and technical fit.

The architecture must continue to normalise all partner-specific records into canonical products plus merchant-specific offers.

## 11. Ranking boundary

Trend and popularity signals are ranking inputs, not absolute truth.

Ranking must keep separate concepts for:

- textual/search relevance;
- offer eligibility and freshness;
- price / known total price;
- catalogue quality;
- merchant coverage;
- trend momentum;
- internal shopper interest;
- sponsored/paid placement, if ever introduced.

Affiliate commission may not silently become an organic ranking factor. Sponsored placement requires explicit policy and labelling.

## 12. Trust rules

Modern discovery must not reduce trust.

Hard rules:

- no fabricated trend badges;
- no fake scarcity;
- no fake social proof;
- no unverified `viral` claims;
- no suggestion that a social platform endorses a product unless true;
- no invented review scores;
- no hidden commission-based ranking;
- no prohibited scraping as a shortcut to trend data;
- explain when shipping, stock, history or trend evidence is incomplete.

## 13. Delivery order

The strategic direction is accepted now, but implementation must remain staged.

### Current priority

Establish real merchant/feed coverage and catalogue quality first.

### Next layer

Add internal Winkelnu signals such as views, favourites, clicks and price-history observations.

### Then

Introduce external trend-source adapters and TrendRadar, beginning only with sources that have a documented permitted acquisition method.

### Later

Add advanced recommendation, visual search and AI-assisted choice flows once product attributes and catalogue coverage are sufficiently reliable.

## 14. Success criterion

Winkelnu should eventually be useful both when a visitor already knows the exact product and when the visitor only knows the shopping problem or wants to discover what is becoming interesting.

The desired product identity is therefore:

**Winkelnu = a modern shopping discovery platform that combines multi-store comparison, trend intelligence and explainable choice assistance.**
