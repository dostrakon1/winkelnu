# Winkelnu Design System v1.0

Status: foundation approved for implementation

## 1. Brand direction

Winkelnu should feel warm, calm, useful and trustworthy. It is a comparison and discovery platform, but should not visually collapse into a generic blue price-comparison website. The visual identity combines deep petrol with cream and sand, using warm orange as a precise accent.

Core principle: calm first, action second. Product information and price comparison stay dominant; decorative styling must never compete with clarity.

## 2. Color system

### Brand palette

| Token | Value | Primary use |
| --- | --- | --- |
| `--wn-petrol` | `#123B3A` | brand, primary buttons, headings on light surfaces |
| `--wn-petrol-deep` | `#0D2E2D` | hover states, dark surfaces, strong contrast |
| `--wn-petrol-soft` | `#DFE9E4` | subtle surfaces, secondary states, selection |
| `--wn-cream` | `#F7F2E8` | main page background |
| `--wn-sand` | `#E8DDCC` | dividers, warm neutral surfaces |
| `--wn-warm` | `#E9783D` | accent, focus, highlights, restrained CTA emphasis |
| `--wn-ink` | `#1E2423` | primary text |
| `--wn-white` | `#FFFFFF` | cards and clean surfaces |

Warm orange is an accent rather than the dominant brand color. Petrol remains the main interaction and trust color.

### Semantic states

Success uses muted green, warning uses warm amber, danger uses muted red. These states must not reuse the main petrol/warm brand pair when status meaning is more important than branding.

## 3. Typography

The v1 foundation uses a system sans-serif stack so the storefront stays fast and stable. A dedicated brand font may be introduced later only if it materially improves identity without hurting performance.

Hierarchy:

- Eyebrow: small, uppercase, high letter spacing, warm accent.
- H1: bold, tight tracking, strong scale.
- H2/H3: bold or semibold with tight tracking.
- Body: relaxed line-height for scanability.
- Metadata: smaller, quieter and never lighter than readable contrast permits.
- Price: strong weight; price must visually outrank merchant metadata.

## 4. Spacing

The spacing scale follows a 4 px base rhythm and is exposed through `--wn-space-*` tokens. Prefer the established scale over one-off values.

Page layout:

- Mobile horizontal gutter: 16 px.
- Desktop horizontal gutter: 24 px.
- Main content maximum width: 72rem / 1152 px.
- Section spacing: fluid between approximately 56 and 96 px.

## 5. Radius

Winkelnu is friendly but not bubbly. Use rounded shapes deliberately:

- Inputs and compact controls: medium radius.
- Cards and content surfaces: 24 px radius.
- Large feature surfaces: up to 32 px.
- Buttons and status chips: pill radius.

Do not make every nested element heavily rounded; preserve hierarchy.

## 6. Shadows and elevation

Use green-tinted low-opacity shadows instead of neutral black shadows. Elevation should communicate interaction or layering, not decoration.

- `xs`: tiny separation.
- `sm`: standard card elevation.
- `md`: hover/interactive card elevation.
- `lg`: hero search and floating feature surfaces.

Cards should primarily be defined by border + surface; shadow is secondary.

## 7. Buttons

### Primary

Petrol background, white text. Use for the main action in a local context: search, compare, continue.

### Secondary

White surface with petrol border/text. Use for lower-priority actions.

### Warm

Orange background, white text. Reserve for special highlights; do not turn the storefront into an orange CTA wall.

Buttons use pill shape, strong label weight, visible keyboard focus and subtle active feedback.

## 8. Inputs

Inputs use a white surface, quiet petrol border and medium radius. Focus increases border prominence and adds a soft petrol ring. Browser focus must remain clearly visible and accessible.

## 9. Cards

Base card anatomy:

1. image/media zone
2. brand or compact metadata
3. product title
4. short description where useful
5. offer summary / merchant context
6. price
7. availability status
8. compare CTA

Interactive product cards may lift by a maximum of 4 px on hover. Avoid excessive animation.

## 10. Header

The storefront header uses the dark petrol market gradient as a distinctive brand anchor. The logo/wordmark remains visually stronger than supporting copy.

The header should eventually support:

- Winkelnu wordmark/logo
- primary discovery/search access
- compact navigation as the product grows
- favorites later, without forcing it into v1 before the feature is ready

## 11. Product and offer states

Required visual states:

- In stock: success badge.
- Limited/uncertain availability: warning badge.
- Unavailable/expired: muted danger treatment, never a live purchase CTA.
- Stale offer: visibly quieter and not presented as fresh certainty.
- Best known offer: may receive subtle petrol emphasis; avoid fake urgency.

Price claims must reflect known total purchase price logic when shipping is known. UI language must not imply Winkelnu is the seller.

## 12. Interaction rules

- Every keyboard-interactive element needs a visible focus state.
- Hover is supplemental; functionality may not depend on hover.
- Motion is short and restrained.
- Respect `prefers-reduced-motion`.
- Primary touch targets should be approximately 44 px high or larger.

## 13. Reusable CSS primitives

The first shared primitives live in `src/app/globals.css`:

- `.wn-container`
- `.wn-section`
- `.wn-eyebrow`
- `.wn-heading`
- `.wn-body-muted`
- `.wn-surface`
- `.wn-card-interactive`
- `.wn-button`
- `.wn-button-primary`
- `.wn-button-secondary`
- `.wn-button-warm`
- `.wn-input`
- `.wn-badge`
- `.wn-badge-success`
- `.wn-badge-warning`
- `.wn-badge-danger`

New storefront work should prefer these foundations or corresponding future React primitives instead of introducing arbitrary one-off styling.

## 14. Design constraints

Winkelnu should not become:

- a generic blue comparison website;
- an over-styled marketplace full of competing badges;
- a dark-mode-first ecommerce site;
- an urgency-driven affiliate landing page;
- a visual copy of Bol, Amazon, Google Shopping or another merchant.

The long-term identity is: warm discovery + trustworthy comparison + calm action.
