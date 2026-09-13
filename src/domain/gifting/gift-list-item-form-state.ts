export type GiftListItemFormValues = {
  itemType: 'text' | 'external_link'
  title: string
  externalUrl: string
  note: string
}

export type GiftListItemFormState = {
  error?: string
  revision: number
  values: GiftListItemFormValues
}

export const initialGiftListItemFormState: GiftListItemFormState = {
  revision: 0,
  values: {
    itemType: 'text',
    title: '',
    externalUrl: '',
    note: '',
  },
}
