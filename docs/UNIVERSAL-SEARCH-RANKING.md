# Universal Search Results & Smart Ranking v1

Winkelnu search does not assume that the best answer is always a product. A useful answer can also be a subcategory, category, buying guide, collection or collection section.

## Goal

For a query such as `laptop voor studie`, the first screen should answer the user's intent before asking them to browse a large product grid.

Example:

1. Laptops & computers — specific product group
2. relevant laptop product
3. Laptop buying guide
4. another relevant product
5. Kantoor & studie — related route

The normal product grid remains available below the universal answer for full browsing and comparison.

## Ranking principles

1. Meaning beats monetisation.
2. Exact matches beat broad matches.
3. A specific subcategory receives a modest structural advantage over a broad root category.
4. Intent matches from the predictive engine receive an explicit boost.
5. Product commercial data is only a small tie-breaker.
6. A product can rank first when its name is an exact or very strong query match.
7. Pure navigational intents such as `cadeau voor vader` do not inject arbitrary products into the universal answer.
8. The universal answer stays diverse: it is not a second copy of the product grid.

## Product score

Product relevance is derived deterministically from:

- exact normalized title
- title prefix
- title substring
- query-token coverage in title/brand
- limited description fallback

Small quality tie-breakers may be added for:

- product image
- useful description
- a verified current offer
- multiple current offers

These quality signals are deliberately too small to overturn a substantially better semantic match.

## Route score

Routes reuse the Predictive Search & Intent Engine score and add small, explicit structure biases:

- subcategory: more specific product destination
- category: broad destination
- guide: decision support
- collection/collection section: cross-category inspiration

Navigation-only intent gets an additional route boost.

## Diversity

The universal answer is capped and mixed. It allows only a limited number of products and routes before the user reaches the full product catalog below. If both useful products and routes exist, at least one of each is retained.

## AI boundary

No AI model is needed for this ranking. The algorithm is deterministic, explainable and testable. A future AI layer may interpret harder natural-language requests, but it should feed structured intent into this ranking system rather than replace it.
