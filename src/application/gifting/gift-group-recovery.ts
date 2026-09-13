import 'server-only'

import {
  grantGiftGroupOrganizerAccess,
  grantGiftGroupParticipantAccess,
} from '@/application/gifting/access-grants'
import {
  GiftGroupAccessError,
  getOrganizerGiftGroupContext,
  getParticipantGiftGroupContext,
} from '@/application/gifting/gift-groups'
import {
  createGiftRecoveryToken,
  hashGiftCapability,
} from '@/infrastructure/gifting/gift-capabilities'
import { SupabaseGiftGroupRecoveryRepository } from '@/infrastructure/gifting/supabase-gift-group-recovery-repository'
import { SupabaseGiftGroupRepository } from '@/infrastructure/gifting/supabase-gift-group-repository'

export type RecoveredGiftGroupAccess = 'organizer' | 'participant'

function isActive(expiresAt: string, status: string): boolean {
  return status !== 'closed' && new Date(expiresAt).getTime() > Date.now()
}

function recoveryPath(token: string, groupCode: string): string {
  return `/lootje-lijstje/toegang/${encodeURIComponent(token)}?groep=${encodeURIComponent(groupCode)}`
}

export async function createGiftGroupOrganizerRecoveryPath(groupCode: string): Promise<string> {
  const context = await getOrganizerGiftGroupContext(groupCode)
  if (!context) throw new GiftGroupAccessError('Beheer-toegang nodig om een nieuwe herstel-link te maken.')

  const token = createGiftRecoveryToken()
  await new SupabaseGiftGroupRecoveryRepository().rotateOrganizerToken(
    context.group.id,
    hashGiftCapability(token),
  )
  await grantGiftGroupOrganizerAccess(context.group.id, context.group.expiresAt)
  return recoveryPath(token, groupCode)
}

export async function createGiftGroupParticipantRecoveryPath(groupCode: string): Promise<string> {
  const context = await getParticipantGiftGroupContext(groupCode)
  if (!context) throw new GiftGroupAccessError('Deelnemerstoegang nodig om een nieuwe herstel-link te maken.')

  const token = createGiftRecoveryToken()
  await new SupabaseGiftGroupRecoveryRepository().rotateParticipantToken(
    context.participant.id,
    hashGiftCapability(token),
  )
  await grantGiftGroupParticipantAccess(context.participant.id, context.group.expiresAt)
  return recoveryPath(token, groupCode)
}

export async function recoverGiftGroupAccess(
  rawToken: string,
  groupCode: string,
): Promise<RecoveredGiftGroupAccess | null> {
  if (!rawToken || rawToken.length > 180 || !groupCode || groupCode.length > 120) return null

  const groupRepository = new SupabaseGiftGroupRepository()
  const group = await groupRepository.getGroupByCodeHash(hashGiftCapability(groupCode))
  if (!group || !isActive(group.expiresAt, group.status)) return null

  const tokenHash = hashGiftCapability(rawToken)
  const recoveryRepository = new SupabaseGiftGroupRecoveryRepository()

  if (await recoveryRepository.organizerTokenMatches(group.id, tokenHash)) {
    await grantGiftGroupOrganizerAccess(group.id, group.expiresAt)
    return 'organizer'
  }

  const participantId = await recoveryRepository.participantIdForToken(group.id, tokenHash)
  if (participantId) {
    await grantGiftGroupParticipantAccess(participantId, group.expiresAt)
    return 'participant'
  }

  return null
}
