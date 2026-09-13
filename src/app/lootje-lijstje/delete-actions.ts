'use server'

import { redirect } from 'next/navigation'
import { deleteStandaloneGiftList } from '@/application/gifting/gift-deletion'
import { requireGiftingEnabled } from '@/application/gifting/gifting-release'

function field(formData: FormData, name: string): string {
  const value = formData.get(name)
  return typeof value === 'string' ? value : ''
}

export async function deleteStandaloneGiftListAction(formData: FormData): Promise<void> {
  requireGiftingEnabled()
  const shareCode = field(formData, 'shareCode')
  if (field(formData, 'confirmation') !== 'VERWIJDER LIJSTJE') {
    redirect(`/lootje-lijstje/lijstje/${encodeURIComponent(shareCode)}/bewerken?fout=${encodeURIComponent('Typ exact VERWIJDER LIJSTJE om je lijstje definitief te verwijderen.')}`)
  }

  try {
    await deleteStandaloneGiftList(shareCode)
  } catch {
    redirect(`/lootje-lijstje/lijstje/${encodeURIComponent(shareCode)}/bewerken?fout=${encodeURIComponent('Het lijstje kon niet worden verwijderd. Controleer je beheer-toegang en probeer opnieuw.')}`)
  }

  redirect('/lootje-lijstje?verwijderd=lijstje')
}
