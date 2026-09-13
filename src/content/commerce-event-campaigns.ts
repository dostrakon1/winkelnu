import { getAmsterdamDateKey } from '@/content/seasonal-campaigns'

export type CommerceEventKind = 'black-friday' | 'cyber-monday'
export type CommerceEventPhase = 'scheduled' | 'preview' | 'black-friday-week' | 'black-friday' | 'black-friday-weekend' | 'cyber-monday' | 'ended'

export type CommerceEventCampaign = {
  slug: string
  name: string
  kind: CommerceEventKind
  year: number
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

export type BlackFridayCycle = {
  year: number
  previewStartsOn: string
  blackFridayWeekStartsOn: string
  blackFridayOn: string
  blackFridayWeekendEndsOn: string
  cyberMondayOn: string
  endsOn: string
}

function dateKeyFromUtc(date: Date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`
}

function addDays(dateKey: string, amount: number) {
  const [year, month, day] = dateKey.split('-').map(Number)
  return dateKeyFromUtc(new Date(Date.UTC(year, month - 1, day + amount)))
}

export function getBlackFridayDateKey(year: number) {
  const novemberFirst = new Date(Date.UTC(year, 10, 1))
  const firstThursdayOffset = (4 - novemberFirst.getUTCDay() + 7) % 7
  const fourthThursday = new Date(Date.UTC(year, 10, 1 + firstThursdayOffset + 21))
  return dateKeyFromUtc(new Date(Date.UTC(year, 10, fourthThursday.getUTCDate() + 1)))
}

export function getCyberMondayDateKey(year: number) {
  return addDays(getBlackFridayDateKey(year), 3)
}

export function getBlackFridayCycle(year: number): BlackFridayCycle {
  const blackFridayOn = getBlackFridayDateKey(year)
  const cyberMondayOn = getCyberMondayDateKey(year)
  return {
    year,
    previewStartsOn: addDays(blackFridayOn, -11),
    blackFridayWeekStartsOn: addDays(blackFridayOn, -4),
    blackFridayOn,
    blackFridayWeekendEndsOn: addDays(blackFridayOn, 2),
    cyberMondayOn,
    endsOn: cyberMondayOn,
  }
}

export function getCommerceEventCampaigns(year: number): readonly CommerceEventCampaign[] {
  const cycle = getBlackFridayCycle(year)

  return [
    {
      slug: `black-friday-${year}`,
      name: 'Black Friday',
      kind: 'black-friday',
      year,
      startsOn: cycle.previewStartsOn,
      endsOn: cycle.blackFridayWeekendEndsOn,
      enabled: true,
      href: '/black-friday',
      eyebrow: '✦ Black Friday bij Winkelnu',
      title: 'Black Friday: eerst vergelijken, dan pas kopen.',
      description: 'Ontdek categorieën, keuzehulpen en straks gecontroleerde aanbiedingen zonder je blind te staren op een kortingspercentage.',
      ctaLabel: 'Ontdek Black Friday →',
      bannerLabel: 'Black Friday komt eraan — vergelijk slimmer bij Winkelnu',
      imageSlug: 'elektronica',
      imageLabel: 'Elektronica',
      heroGradient: 'linear-gradient(135deg, #050706 0%, #0b1715 46%, #5d260f 76%, #ba4d20 100%)',
      accent: '#f06f32',
      accentSoft: '#ffd0ad',
      chips: [
        { label: 'Elektronica', href: '/koopgidsen/categorie/elektronica' },
        { label: 'Wonen', href: '/koopgidsen/categorie/wonen-huishouden' },
        { label: 'Keuken', href: '/koopgidsen/categorie/keuken-koffie' },
      ],
    },
    {
      slug: `cyber-monday-${year}`,
      name: 'Cyber Monday',
      kind: 'cyber-monday',
      year,
      startsOn: cycle.cyberMondayOn,
      endsOn: cycle.cyberMondayOn,
      enabled: true,
      href: '/cyber-monday',
      eyebrow: '✦ Cyber Monday finale',
      title: 'Cyber Monday: de digitale finale van het dealweekend.',
      description: 'Focus op elektronica, slimme apparaten, kantoor en andere online deals — met dezelfde rustige vergelijking als altijd bij Winkelnu.',
      ctaLabel: 'Ontdek Cyber Monday →',
      bannerLabel: 'Cyber Monday — bekijk de digitale finale bij Winkelnu',
      imageSlug: 'elektronica',
      imageLabel: 'Elektronica',
      heroGradient: 'linear-gradient(135deg, #050607 0%, #0b2024 48%, #123b3a 70%, #c45722 100%)',
      accent: '#e8652d',
      accentSoft: '#b9ebe4',
      chips: [
        { label: 'Elektronica', href: '/koopgidsen/categorie/elektronica' },
        { label: 'Kantoor & studie', href: '/koopgidsen/categorie/kantoor-studie' },
        { label: 'Wonen & huishouden', href: '/koopgidsen/categorie/wonen-huishouden' },
      ],
    },
  ] as const
}

export function getCommerceEventPhase(date = new Date(), year?: number): CommerceEventPhase {
  const dateKey = getAmsterdamDateKey(date)
  const resolvedYear = year ?? Number(dateKey.slice(0, 4))
  const cycle = getBlackFridayCycle(resolvedYear)

  if (!dateKey || dateKey < cycle.previewStartsOn) return 'scheduled'
  if (dateKey > cycle.cyberMondayOn) return 'ended'
  if (dateKey === cycle.cyberMondayOn) return 'cyber-monday'
  if (dateKey > cycle.blackFridayOn) return 'black-friday-weekend'
  if (dateKey === cycle.blackFridayOn) return 'black-friday'
  if (dateKey >= cycle.blackFridayWeekStartsOn) return 'black-friday-week'
  return 'preview'
}

export function getActiveCommerceEventCampaign(date = new Date()): CommerceEventCampaign | undefined {
  const dateKey = getAmsterdamDateKey(date)
  const year = Number(dateKey.slice(0, 4))
  if (!Number.isFinite(year)) return undefined
  return getCommerceEventCampaigns(year).find((campaign) => campaign.enabled && dateKey >= campaign.startsOn && dateKey <= campaign.endsOn)
}

export function getCommerceEventCampaignByKind(kind: CommerceEventKind, year: number) {
  return getCommerceEventCampaigns(year).find((campaign) => campaign.kind === kind)
}
