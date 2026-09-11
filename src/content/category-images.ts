export type CategoryImage = {
  src: string
  alt: string
  position: string
}

/**
 * Owner-approved editorial imagery. This registry is separate from the commerce
 * taxonomy and does not publish categories or products by itself.
 *
 * The seven corresponding WebP files belong in public/images/categories/.
 */
export const categoryImages = {
  elektronica: {
    src: '/images/categories/elektronica-hero.webp',
    alt: 'Laptop en koptelefoon op een lichte, moderne werkplek',
    position: 'center',
  },
  'wonen-huishouden': {
    src: '/images/categories/wonen-huishouden-hero.webp',
    alt: 'Moderne wasruimte met wasmachine, steelstofzuiger en robotstofzuiger',
    position: 'center',
  },
  'keuken-koffie': {
    src: '/images/categories/keuken-koffie-hero.webp',
    alt: 'Espressomachine en airfryer in een lichte keuken',
    position: 'center',
  },
  'persoonlijke-verzorging': {
    src: '/images/categories/persoonlijke-verzorging-hero.webp',
    alt: 'Elektrische tandenborstel en scheerapparaat in een lichte, moderne badkamer',
    position: 'center',
  },
  'huis-tuin-klussen': {
    src: '/images/categories/huis-tuin-klussen-hero.webp',
    alt: 'Grasmaaier en grastrimmer op een terras in een zonnige tuin',
    position: 'center',
  },
  'sport-outdoor': {
    src: '/images/categories/sport-outdoor-hero.webp',
    alt: 'Wandelschoenen en rugzak naast een tent in een berglandschap',
    position: 'center',
  },
  'speelgoed-hobby': {
    src: '/images/categories/speelgoed-hobby-hero.webp',
    alt: 'Kleurrijk speelgoed, bouwblokken en bordspellen in een speelkamer',
    position: 'center',
  },
} as const satisfies Record<string, CategoryImage>

export type CategoryImageSlug = keyof typeof categoryImages

export function getCategoryImage(slug: string): CategoryImage | undefined {
  return Object.prototype.hasOwnProperty.call(categoryImages, slug)
    ? categoryImages[slug as CategoryImageSlug]
    : undefined
}
