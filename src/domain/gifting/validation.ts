import {
  giftOccasions,
  type CreateGiftGroupInput,
  type CreateGiftListInput,
  type CreateGiftListItemInput,
  type GiftOccasion,
  type JoinGiftGroupInput,
} from './types'

export class GiftValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'GiftValidationError'
  }
}

export function normalizeGiftText(value: string): string {
  return value.replace(/\s+/g, ' ').trim()
}

export function normalizeGiftDisplayName(value: string): string {
  return normalizeGiftText(value).toLocaleLowerCase('nl-NL')
}

export function validateGiftNote(value: string): string | undefined {
  const note = normalizeGiftText(value)
  if (note.length > 300) throw new GiftValidationError('De toelichting mag maximaal 300 tekens zijn.')
  return note || undefined
}

export function parseGiftOccasion(value: string): GiftOccasion {
  if ((giftOccasions as readonly string[]).includes(value)) return value as GiftOccasion
  throw new GiftValidationError('Kies een geldige gelegenheid.')
}

export function parseOptionalEuroAmount(value: string): number | undefined {
  const normalized = value.trim().replace(',', '.')
  if (!normalized) return undefined
  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) {
    throw new GiftValidationError('Vul een geldig bedrag in.')
  }

  const cents = Math.round(Number(normalized) * 100)
  if (!Number.isSafeInteger(cents) || cents < 0 || cents > 10_000_000) {
    throw new GiftValidationError('Het bedrag valt buiten het toegestane bereik.')
  }
  return cents
}

export function parseOptionalGiftDate(value: string): string | undefined {
  const normalized = value.trim()
  if (!normalized) return undefined
  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    throw new GiftValidationError('Kies een geldige datum.')
  }

  const date = new Date(`${normalized}T00:00:00Z`)
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== normalized) {
    throw new GiftValidationError('Kies een geldige datum.')
  }
  return normalized
}

function validateDisplayName(raw: string): string {
  const displayName = normalizeGiftText(raw)
  if (displayName.length < 2 || displayName.length > 80) {
    throw new GiftValidationError('Je naam moet tussen 2 en 80 tekens zijn.')
  }
  return displayName
}

export function validateGiftListInput(input: {
  displayName: string
  title?: string
  occasion: string
  budgetMin?: string
  budgetMax?: string
  eventDate?: string
}): CreateGiftListInput {
  const displayName = validateDisplayName(input.displayName)
  const title = normalizeGiftText(input.title ?? '')
  const occasion = parseGiftOccasion(input.occasion)
  const budgetMinCents = parseOptionalEuroAmount(input.budgetMin ?? '')
  const budgetMaxCents = parseOptionalEuroAmount(input.budgetMax ?? '')
  const eventDate = parseOptionalGiftDate(input.eventDate ?? '')

  if (title.length > 100) throw new GiftValidationError('De titel mag maximaal 100 tekens zijn.')
  if (budgetMinCents !== undefined && budgetMaxCents !== undefined && budgetMinCents > budgetMaxCents) {
    throw new GiftValidationError('Het minimumbudget mag niet hoger zijn dan het maximumbudget.')
  }

  return {
    displayName,
    title: title || undefined,
    occasion,
    budgetMinCents,
    budgetMaxCents,
    eventDate,
  }
}

export function validateGiftGroupInput(input: {
  name: string
  occasion: string
  organizerDisplayName: string
  budget?: string
  eventDate?: string
}): CreateGiftGroupInput {
  const name = normalizeGiftText(input.name)
  const organizerDisplayName = validateDisplayName(input.organizerDisplayName)
  const occasion = parseGiftOccasion(input.occasion)
  const budgetCents = parseOptionalEuroAmount(input.budget ?? '')
  const eventDate = parseOptionalGiftDate(input.eventDate ?? '')

  if (name.length < 2 || name.length > 100) {
    throw new GiftValidationError('De groepsnaam moet tussen 2 en 100 tekens zijn.')
  }

  return { name, occasion, organizerDisplayName, budgetCents, eventDate }
}

export function validateGiftGroupJoinInput(input: { displayName: string }): JoinGiftGroupInput {
  return { displayName: validateDisplayName(input.displayName) }
}

export function validateGiftListItemInput(input: {
  itemType: string
  title: string
  externalUrl?: string
  note?: string
}): CreateGiftListItemInput {
  if (input.itemType !== 'text' && input.itemType !== 'external_link') {
    throw new GiftValidationError('Dit type wens is nog niet beschikbaar.')
  }

  const title = normalizeGiftText(input.title)
  const note = validateGiftNote(input.note ?? '')
  const externalUrl = input.externalUrl?.trim()

  if (title.length < 2 || title.length > 120) {
    throw new GiftValidationError('De wens moet tussen 2 en 120 tekens zijn.')
  }

  if (input.itemType === 'external_link') {
    if (!externalUrl) throw new GiftValidationError('Plak een https-link naar het product.')
    let parsed: URL
    try {
      parsed = new URL(externalUrl)
    } catch {
      throw new GiftValidationError('Plak een geldige productlink.')
    }
    if (parsed.protocol !== 'https:') throw new GiftValidationError('Gebruik alleen een beveiligde https-link.')
  }

  return {
    itemType: input.itemType,
    title,
    externalUrl: input.itemType === 'external_link' ? externalUrl : undefined,
    note,
  }
}
