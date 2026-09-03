# Winkelnu Visual Direction v0.1

Status: approved direction, not yet a full redesign specification.

## Brand feeling

Winkelnu should feel warm, friendly, trustworthy, modern and inviting. The visual language should feel more like a pleasant contemporary shopping street than a generic tech platform or a loud discount site.

The palette must work across very different product categories, so the brand colors support the commerce experience instead of dominating every product surface.

## Core palette

```css
--wn-petrol: #123B3A;
--wn-cream: #F7F2E8;
--wn-sand: #E8DDCC;
--wn-warm: #E9783D;
--wn-ink: #1E2423;
--wn-white: #FFFFFF;
```

### Intended roles

- `--wn-petrol`: primary brand anchor, navigation, high-emphasis surfaces and trustworthy CTAs.
- `--wn-cream`: primary warm page background.
- `--wn-sand`: secondary surfaces, separators, subtle cards and supporting backgrounds.
- `--wn-warm`: selective commerce/discovery accent; use sparingly for emphasis rather than as the dominant page color.
- `--wn-ink`: primary text and high-contrast content.
- `--wn-white`: clean card surfaces and content areas where contrast is needed.

## Gradient family

Gradients are supporting brand atmosphere, not decoration everywhere. Prefer large, soft transitions with low visual noise.

### 1. Winkelnu Welcome

Warm hero/background gradient.

```css
--wn-gradient-welcome: linear-gradient(
  135deg,
  #F7F2E8 0%,
  #F1E2D4 42%,
  #E9B69B 72%,
  #D98763 100%
);
```

Use for hero areas, seasonal discovery blocks and large introductory surfaces. Keep primary text dark.

### 2. Winkelnu Market

Brand-led petrol gradient with a warm finish.

```css
--wn-gradient-market: linear-gradient(
  135deg,
  #123B3A 0%,
  #1B514D 52%,
  #55766C 78%,
  #E9783D 135%
);
```

Use for compact brand panels, selected navigation/marketing surfaces or campaign sections. Do not use behind dense product grids.

### 3. Winkelnu Morning

Very light ambient gradient for commerce pages.

```css
--wn-gradient-morning: linear-gradient(
  180deg,
  #FFFFFF 0%,
  #F7F2E8 58%,
  #F0E7DA 100%
);
```

Use where a plain white/cream page needs subtle depth without reducing product readability.

### 4. Winkelnu Glow

Soft radial brand glow for hero composition.

```css
--wn-gradient-glow: radial-gradient(
  circle at 72% 28%,
  rgba(233, 120, 61, 0.28) 0%,
  rgba(232, 221, 204, 0.48) 34%,
  rgba(247, 242, 232, 0) 70%
);
```

Layer over cream or white backgrounds. Do not place body copy directly over the strongest glow.

### 5. Winkelnu Evening

Premium dark brand gradient.

```css
--wn-gradient-evening: linear-gradient(
  145deg,
  #0D2E2D 0%,
  #123B3A 50%,
  #244C48 100%
);
```

Use for footer, special editorial modules, or high-emphasis comparison/brand surfaces.

## Visual rules

1. Product photography and merchant content remain visually dominant on product pages and grids.
2. Cream and white are the default commerce canvas; petrol provides structure and trust.
3. Warm orange/terracotta is an accent, not a site-wide background color.
4. Gradients belong mainly to hero, editorial, discovery and brand surfaces.
5. Dense search/filter/product views should stay calm and high-contrast.
6. CTA contrast must be tested before release; never assume a color pairing is accessible.
7. Avoid a generic SaaS/AI look, neon gradients, flag-color combinations and aggressive discount styling.

## Current implementation note

This document captures the approved visual direction. Existing storefront colors should not all be replaced mechanically. The next visual implementation step should translate these tokens into components and validate contrast, hierarchy and product readability page by page.
