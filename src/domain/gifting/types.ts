export const giftOccasions = ['sinterklaas', 'kerst', 'verjaardag', 'anders'] as const
export type GiftOccasion = (typeof giftOccasions)[number]

export const giftListItemTypes = ['winkelnu_product', 'external_link', 'text'] as const
export type GiftListItemType = (typeof giftListItemTypes)[number]

export type GiftListStatus = 'active' | 'archived'

export type GiftList = {
  id: string
  externalKey: string
  displayName: string
  title?: string
  occasion: GiftOccasion
  budgetMinCents?: number
  budgetMaxCents?: number
  eventDate?: string
  status: GiftListStatus
  expiresAt: string
  createdAt: string
  updatedAt: string
}

export type GiftListItem = {
  id: string
  giftListId: string
  itemType: GiftListItemType
  productExternalKey?: string
  externalUrl?: string
  title: string
  imageUrlSnapshot?: string
  priceCentsSnapshot?: number
  currencySnapshot?: string
  note?: string
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export type GiftListWithItems = GiftList & {
  items: GiftListItem[]
}

export type CreateGiftListInput = {
  displayName: string
  title?: string
  occasion: GiftOccasion
  budgetMinCents?: number
  budgetMaxCents?: number
  eventDate?: string
}

export type UpdateGiftListInput = CreateGiftListInput

export type CreateGiftListItemInput = {
  itemType: Extract<GiftListItemType, 'external_link' | 'text'>
  title: string
  externalUrl?: string
  note?: string
}
