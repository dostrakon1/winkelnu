'use server'

import { redirect } from 'next/navigation'
import { deleteGiftGroup } from '@/application/gifting/gift-deletion'
import { requireGiftingEnabled } from '@/application/gifting/gifting-release'

function field(formData: FormData, name: string): string {
  const value = formData.get(name)
  return typeof value === 'string' ? value : ''
}

export async function deleteGiftGroupAction(formData: FormData): Promise<void> {
  requireGiftingEnabled()
  const groupCode = field(formData, 'groupCode')
  if (field(formData, 'confirmation') !== 'VERWIJDER GROEP') {
    redirect(`/lootje-lijstje/groep/${encodeURIComponent(groupCode)}/beheer?fout=${encodeURIComponent('Typ exact VERWIJDER GROEP om de groep en bijbehorende lijstjes definitief te verwijderen.')}`)
  }

  try {
    await deleteGiftGroup(groupCode)
  } catch {
    redirect(`/lootje-lijstje/groep/${encodeURIComponent(groupCode)}/beheer?fout=${encodeURIComponent('De groep kon niet worden verwijderd. Controleer je beheer-toegang en probeer opnieuw.')}`)
  }

  redirect('/lootje-lijstje?verwijderd=groep')
}
