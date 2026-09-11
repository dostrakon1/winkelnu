export type OfferAvailabilityState = 'available' | 'unavailable' | 'unknown'

function normalizeAvailability(value?: string): string {
  return value?.trim().toLocaleLowerCase('en-US').replace(/[\s-]+/g, '_') ?? ''
}

const AVAILABLE = new Set([
  'in_stock',
  'instock',
  'available',
  'op_voorraad',
  'true',
  'yes',
  '1',
])

const UNAVAILABLE = new Set([
  'out_of_stock',
  'outofstock',
  'not_in_stock',
  'notinstock',
  'unavailable',
  'sold_out',
  'soldout',
  'niet_op_voorraad',
  'false',
  'no',
  '0',
])

export function classifyOfferAvailability(value?: string): OfferAvailabilityState {
  const normalized = normalizeAvailability(value)
  if (!normalized) return 'unknown'
  if (AVAILABLE.has(normalized)) return 'available'
  if (UNAVAILABLE.has(normalized)) return 'unavailable'
  return 'unknown'
}
