# Homepage editorial polish — review notes

This change improves the first public editorial release without changing the commerce architecture.

## Scope
- Shorter, more concrete hero and a compact three-step explanation.
- The existing public catalog release switch continues to determine whether product search is advertised. No synthetic offers or unapproved merchant relationships are introduced.
- Three existing editorial categories and all six existing guides remain available. The homepage guide cards receive small decorative, product-neutral inline SVG artwork. No remote images, scripts, fonts, cookies, analytics, or additional dependencies are added.
- The repeated lower choice-help section is replaced with a concise, transparent methodology section linking to the existing legal and editorial information.
- Footer spacing and mobile layout are more compact. Every existing legal, contact and commercial-disclosure link is retained.

## Verification before merging
Run `npm ci --legacy-peer-deps` and `npm run check` on Node 22+, then inspect the homepage at narrow mobile widths (320/375px), tablet and desktop. Check all guide/category links, keyboard navigation, focus visibility, footer disclosures, and both states of the catalog release switch. Confirm there is no horizontal overflow or clipped text at 200% zoom. Check actual preview-deployment settings and billing before enabling CI or merging. A draft PR is not a substitute for a successful final verification run.

No merchant activation, database migrations, production data writes, affiliate credentials, release switches, or legal policy changes are authorized by this visual improvement. The existing release gates remain authoritative.
