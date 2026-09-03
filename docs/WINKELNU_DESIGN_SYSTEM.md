# Winkelnu Design System v1.0

Status: active storefront design contract.

## Purpose

Winkelnu must feel like one coherent product. Storefront pages may have different information density, but they must share the same visual grammar, interaction hierarchy and accessibility rules.

The homepage is the first reference implementation; search, category, product, empty, error and future discovery surfaces should reuse this system instead of inventing page-specific styling.

## Brand character

Warm, friendly, trustworthy, modern and inviting. The tone should resemble a contemporary Dutch shopping street: familiar and pleasant, but never nostalgic, folkloric or discount-loud.

Avoid generic SaaS styling, neon/AI aesthetics, pure black as a dominant brand color and aggressive sale visuals.

## Core color tokens

```css
--wn-petrol: #123b3a;
--wn-petrol-deep: #0d2e2d;
--wn-petrol-soft: #dfe9e4;
--wn-cream: #f7f2e8;
--wn-sand: #e8ddcc;
--wn-warm: #e9783d;
--wn-ink: #1e2423;
--wn-white: #ffffff;
```

### Roles

- Petrol: primary brand anchor, primary actions, navigation, active states.
- Deep petrol: hover/high-emphasis dark state.
- Petrol soft: subtle brand surface and selection state.
- Cream: warm page canvas.
- Sand: secondary surfaces and image placeholders.
- Warm terracotta: selective discovery/deal accent; never the dominant page color.
- Ink: primary readable text.
- White: commerce cards, form surfaces and clean content panels.

## Gradient family

Use gradients only where they add brand atmosphere. Dense commerce surfaces remain calm.

- `--wn-gradient-welcome`: hero/discovery surface.
- `--wn-gradient-market`: compact brand/header surface.
- `--wn-gradient-morning`: light commerce background.
- `--wn-gradient-glow`: subtle warm hero highlight.
- `--wn-gradient-evening`: footer/editorial/high-emphasis dark surface.

## Typography

Current v1 system uses the application sans stack until the wordmark/typeface decision is made.

Hierarchy:

- Hero title: bold, tight tracking, responsive 3.5–4.5rem range.
- Page title: bold, tight tracking, typically 2.25–3rem.
- Section title: bold, typically 1.75–2rem.
- Product title: semibold, typically 1.125–1.25rem.
- Body: regular, comfortable 1.5–1.75 line height.
- Eyebrow/brand metadata: uppercase only when it adds structure; use sparingly.

Do not use uppercase for long labels or body copy.

## Layout and spacing

- Storefront maximum content width: `72rem` / `max-w-6xl`.
- Standard horizontal page padding: `1.5rem` with responsive expansion only where useful.
- Major section rhythm: approximately 3.5–5rem vertical spacing.
- Cards should align to the same grid and avoid arbitrary widths.
- Product grids prioritize scanability over decorative asymmetry.

## Radius system

- Small controls/badges: 0.75rem–9999px depending on semantic shape.
- Search/input surfaces: 1rem.
- Product cards/panels: 1rem–1.5rem.
- Avoid mixing many unrelated corner radii on one screen.

## Borders and shadows

Borders use low-opacity petrol/ink rather than cold generic gray.

Shadows are soft and low-contrast. Elevation should communicate interaction and grouping, not decoration.

Recommended card behavior:

- Rest: subtle border + small soft shadow.
- Hover: slightly stronger border/elevation; movement limited to ~1px–4px.

## Buttons and links

### Primary action

- Background: petrol.
- Foreground: white.
- Hover: deep petrol.
- Focus ring: warm terracotta or another tested high-contrast focus color.

Used for actions such as `Zoeken`, `Vergelijk aanbiedingen` and `Bekijk aanbieding`.

### Secondary action

Prefer white/cream surface, petrol text and petrol-tinted border. Do not introduce arbitrary black buttons.

### Text links

Use ink/petrol with a clear hover/focus treatment. Warm accent may be used as underline decoration, not as low-contrast body text.

## Product cards

Every storefront product card follows this order:

1. Product visual.
2. Brand/merchant metadata.
3. Product title.
4. Optional short description.
5. Price context and best known total price.
6. Availability state.
7. Primary comparison action.

Product imagery remains visually dominant once real feed images are present. Brand backgrounds must not compete with photographs.

## Price and offer semantics

- The main displayed price is the best known total purchase price when shipping is known.
- Price uses ink, not accent orange.
- Merchant count/source context is subdued but readable.
- Availability uses a restrained green success treatment.
- Warning/error/deal colors require semantic meaning; never use warm accent solely to make prices look cheaper.

## Forms and search

- White or near-white field surface on cream/gradient context.
- Clear petrol focus treatment.
- Labels remain visible on filter-heavy pages; placeholders are not labels.
- Search is a primary Winkelnu interaction and may receive stronger visual emphasis than ordinary inputs.

## Header

The public storefront uses one shared Winkelnu header component.

- Petrol/Market gradient surface.
- Winkelnu wordmark/brand link on the left.
- Minimal contextual promise/navigation on the right.
- Future navigation additions must preserve the same height, spacing and interaction treatment.

Internal operations may use a related but operationally denser variant; it must remain recognizably Winkelnu without pretending to be consumer storefront UI.

## Accessibility

- WCAG AA contrast is the minimum target for normal text and controls.
- Focus must be visible without relying on browser defaults alone.
- Color is never the only carrier of state.
- Hit targets must be practical on touch devices.
- Reduced-motion preferences should be respected when meaningful animation is introduced.

## Responsive behavior

Mobile is not a compressed desktop layout.

- Hero typography scales down without awkward line breaks.
- Search controls stay usable with one-hand/touch interaction.
- Product grids become one column before cards become cramped.
- Price and availability must not collide.
- Header text/navigation may simplify before wrapping into noisy multi-line layouts.

## Implementation rule

New storefront UI should first reuse or extend existing design tokens and shared components. Page-specific hardcoded colors, arbitrary shadows and unrelated button styles require a deliberate reason.

The next rollout sequence is:

1. Homepage reference implementation.
2. Search/results page.
3. Product detail page.
4. Category page.
5. Empty/error/unavailable states.
6. Shared responsive/accessibility polish.
