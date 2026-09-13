export const giftOccasions = ['sinterklaas', 'kerst', 'verjaardag', 'anders'] as const
export type GiftOccasion = (typeof giftOccasions)[number]

export const giftListItemTypes = ['winkelnu_product', 'external_link', 'text'] as const
export type GiftListItemType = (typeof giftListItemTypes)[number]

export type GiftListStatus = 'active' | 'archived'
export type GiftGroupStatus = 'draft' | 'drawn' | 'closed'

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
  productSlugSnapshot?: string
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

export type GiftGroup = {
  id: string
  externalKey: string
  name: string
  occasion: GiftOccasion
  budgetCents?: number
  eventDate?: string
  status: GiftGroupStatus
  drawVersion: number
  expiresAt: string
  createdAt: string
  updatedAt: string
}

export type GiftGroupParticipant = {
  id: string
  externalKey: string
  groupId: string
  giftListId: string
  displayName: string
  joinedAt: string
  createdAt: string
  updatedAt: string
}

export type GiftGroupParticipantSummary = GiftGroupParticipant & {
  wishCount: number
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

export type CreateWinkelnuGiftListItemInput = {
  itemType: 'winkelnu_product'
  productExternalKey: string
  productSlugSnapshot: string
  title: string
  imageUrlSnapshot?: string
  priceCentsSnapshot?: number
  currencySnapshot?: 'EUR'
  note?: string
}

export type CreateGiftGroupInput = {
  name: string
  occasion: GiftOccasion
  organizerDisplayName: string
  budgetCents?: number
  eventDate?: string
}

export type JoinGiftGroupInput = {
  displayName: string
}
