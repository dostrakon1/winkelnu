export type SeasonalCampaignTheme = 'halloween' | 'sinterklaas' | 'christmas'

export type SeasonalCampaign = {
  slug: string
  collectionSlug: string
  name: string
  theme: SeasonalCampaignTheme
  startsOn: string
  endsOn: string
  enabled: boolean
  href: string
  eyebrow: string
  title: string
  description: string
  ctaLabel: string
  bannerLabel: string
  imageSlug: string
  imageLabel: string
  heroGradient: string
  accent: string
  accentSoft: string
  chips: readonly { label: string; href: string }[]
}

export const seasonalCampaigns = [
  {
    slug: 'halloween-2026',
    collectionSlug: 'halloween',
    name: 'Halloween',
    theme: 'halloween',
    startsOn: '2026-10-01',
    endsOn: '2026-10-31',
    enabled: true,
    href: '/collecties/halloween',
    eyebrow: '✦ Seizoensselectie',
    title: 'Maak Halloween griezelig gezellig.',
    description: 'Ontdek inspiratie voor sfeer, verkleden, spel en feestelijke momenten — verzameld uit de vaste Winkelnu-rubrieken.',
    ctaLabel: 'Ontdek Halloween →',
    bannerLabel: 'Halloween komt eraan — ontdek de seizoensselectie',
    imageSlug: 'speelgoed-hobby',
    imageLabel: 'Speelgoed & hobby',
    heroGradient: 'linear-gradient(135deg, #111c1b 0%, #173b37 48%, #7a3d24 100%)',
    accent: '#ff9a52',
    accentSoft: '#ffd2ae',
    chips: [
      { label: 'Decoratie & sfeer', href: '/collecties/halloween#decoratie-sfeer' },
      { label: 'Verkleden', href: '/collecties/halloween#verkleden-accessoires' },
      { label: 'Spel & creatief', href: '/collecties/halloween#spel-creatief' },
    ],
  },
  {
    slug: 'sinterklaas-2026',
    collectionSlug: 'sinterklaas',
    name: 'Sinterklaas',
    theme: 'sinterklaas',
    startsOn: '2026-11-01',
    endsOn: '2026-12-05',
    enabled: true,
    href: '/collecties/sinterklaas',
    eyebrow: '✦ Pakjesavond',
    title: 'Cadeau-inspiratie voor Sinterklaas.',
    description: 'Van kleine schoencadeaus tot ideeën voor pakjesavond. Winkelnu brengt inspiratie uit meerdere categorieën samen.',
    ctaLabel: 'Ontdek Sinterklaas →',
    bannerLabel: 'Pakjesavond in zicht — ontdek Sinterklaascadeaus',
    imageSlug: 'cadeaus-feest',
    imageLabel: 'Cadeaus & feest',
    heroGradient: 'linear-gradient(135deg, #542727 0%, #7b3530 42%, #123b3a 100%)',
    accent: '#f2a269',
    accentSoft: '#ffd6b8',
    chips: [
      { label: 'Voor kinderen', href: '/collecties/sinterklaas#voor-kinderen' },
      { label: 'Schoencadeaus', href: '/collecties/sinterklaas#schoencadeaus' },
      { label: 'Pakjesavond', href: '/collecties/sinterklaas#pakjesavond' },
    ],
  },
  {
    slug: 'kerst-2026',
    collectionSlug: 'kerst',
    name: 'Kerst',
    theme: 'christmas',
    startsOn: '2026-12-06',
    endsOn: '2026-12-26',
    enabled: true,
    href: '/collecties/kerst',
    eyebrow: '✦ Kerstselectie',
    title: 'Kerstcadeaus voor ieder soort kerstvierder.',
    description: 'Ontdek warme cadeau-inspiratie voor thuis, familie, hobby, tech en tafelen — zonder de rust van Winkelnu te verliezen.',
    ctaLabel: 'Ontdek Kerst →',
    bannerLabel: 'Kerst bij Winkelnu — ontdek cadeau-inspiratie',
    imageSlug: 'cadeaus-feest',
    imageLabel: 'Cadeaus & feest',
    heroGradient: 'linear-gradient(135deg, #36070b 0%, #74131b 46%, #9d2430 68%, #143a33 100%)',
    accent: '#b51f2e',
    accentSoft: '#f3d39a',
    chips: [
      { label: 'Cadeaus', href: '/collecties/kerst#kerstcadeaus' },
      { label: 'Voor thuis', href: '/collecties/kerst#voor-thuis' },
      { label: 'Koken & tafelen', href: '/collecties/kerst#koken-tafelen' },
    ],
  },
] as const satisfies readonly SeasonalCampaign[]

export function getAmsterdamDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat('nl-NL', {
    timeZone: 'Europe/Amsterdam',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)

  const year = parts.find((part) => part.type === 'year')?.value
  const month = parts.find((part) => part.type === 'month')?.value
  const day = parts.find((part) => part.type === 'day')?.value

  if (!year || !month || !day) return ''
  return `${year}-${month}-${day}`
}

export function isSeasonalCampaignActive(campaign: SeasonalCampaign, date = new Date()) {
  if (!campaign.enabled) return false
  const dateKey = getAmsterdamDateKey(date)
  return Boolean(dateKey && dateKey >= campaign.startsOn && dateKey <= campaign.endsOn)
}

export function getActiveSeasonalCampaign(date = new Date()): SeasonalCampaign | undefined {
  return seasonalCampaigns.find((campaign) => isSeasonalCampaignActive(campaign, date))
}

export function getSeasonalCampaignByCollectionSlug(collectionSlug: string): SeasonalCampaign | undefined {
  return seasonalCampaigns.find((campaign) => campaign.collectionSlug === collectionSlug)
}
