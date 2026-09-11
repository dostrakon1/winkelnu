import { categoryImageSlugs } from '@/generated/category-image-manifest'

export type CategoryImage = {
  src: string
  alt: string
  position: string
}

type CategoryImageOverride = Partial<Pick<CategoryImage, 'alt' | 'position'>>

/**
 * Category images follow one fixed convention:
 * public/images/categories/<category-slug>-hero.webp
 *
 * The generated manifest is refreshed automatically before each build, so a
 * correctly named file becomes available everywhere without adding another
 * path mapping. Keep overrides limited to editorial metadata or exceptional
 * crops; never repeat the file path here.
 */
const categoryImageOverrides: Record<string, CategoryImageOverride> = {
  elektronica: {
    alt: 'Laptop en koptelefoon op een lichte, moderne werkplek',
  },
  'wonen-huishouden': {
    alt: 'Moderne wasruimte met wasmachine, steelstofzuiger en robotstofzuiger',
  },
  'keuken-koffie': {
    alt: 'Espressomachine en airfryer in een lichte keuken',
  },
  'persoonlijke-verzorging': {
    alt: 'Elektrische tandenborstel en scheerapparaat in een lichte, moderne badkamer',
  },
  'huis-tuin-klussen': {
    alt: 'Grasmaaier en grastrimmer op een terras in een zonnige tuin',
  },
  'sport-outdoor': {
    alt: 'Wandelschoenen en rugzak naast een tent in een berglandschap',
  },
  'speelgoed-hobby': {
    alt: 'Kleurrijk speelgoed, bouwblokken en bordspellen in een speelkamer',
  },
  'baby-kind': {
    alt: 'Beige kinderwagen in een lichte, warme babykamer met houten ledikant en speelgoed',
  },
  dieren: {
    alt: 'Golden retriever in een hondenmand en kat op een krabpaal in een lichte, warme woonkamer',
  },
  'auto-fiets': {
    alt: 'Moderne auto met open kofferbak en elektrische fietsen bij een warme, moderne garage',
  },
}

const availableCategoryImages = new Set<string>(categoryImageSlugs)

export function getCategoryImage(slug: string, label?: string): CategoryImage | undefined {
  if (!availableCategoryImages.has(slug)) return undefined

  const override = categoryImageOverrides[slug]
  const displayLabel = label?.trim() || slug.split('-').join(' ')

  return {
    src: `/images/categories/${slug}-hero.webp`,
    alt: override?.alt ?? `Sfeerbeeld voor ${displayLabel}`,
    position: override?.position ?? 'center',
  }
}
