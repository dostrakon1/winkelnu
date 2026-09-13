import 'server-only'

import {
  canManageGiftGroup,
  giftGroupParticipantGrantIds,
  grantGiftGroupOrganizerAccess,
  grantGiftGroupParticipantAccess,
} from '@/application/gifting/access-grants'
import { getGiftCatalogProductBySlug } from '@/application/gifting/gift-catalog'
import { enforceGiftingRateLimit, GiftingRateLimitError } from '@/application/gifting/gifting-rate-limit'
import type {
  CreateGiftGroupInput,
  CreateGiftListItemInput,
  GiftGroup,
  GiftGroupParticipant,
  GiftGroupParticipantSummary,
  GiftListWithItems,
  JoinGiftGroupInput,
} from '@/domain/gifting/types'
import { normalizeGiftDisplayName, validateGiftNote } from '@/domain/gifting/validation'
import {
  createGiftExternalKey,
  createGiftRecoveryToken,
  createGiftShareCode,
  hashGiftCapability,
} from '@/infrastructure/gifting/gift-capabilities'
import { SupabaseGiftGroupRepository } from '@/infrastructure/gifting/supabase-gift-group-repository'
import { SupabaseGiftRepository } from '@/infrastructure/gifting/supabase-gift-repository'

const RETENTION_DAYS = 180

export class GiftGroupAccessError extends Error {
  constructor(message = 'Geen toegang tot deze groep.') {
    super(message)
    this.name = 'GiftGroupAccessError'
  }
}

function nextExpiry(): string {
  return new Date(Date.now() + RETENTION_DAYS * 24 * 60 * 60 * 1000).toISOString()
}

function active(group: GiftGroup): boolean {
  return group.status !== 'closed' && new Date(group.expiresAt).getTime() > Date.now()
}

async function applyRateLimit(action: 'create-group' | 'join-group'): Promise<void> {
  try {
    await enforceGiftingRateLimit(action)
  } catch (error) {
    if (error instanceof GiftingRateLimitError) throw new GiftGroupAccessError(error.message)
    throw error
  }
}

function repositoryErrorMessage(error: unknown): string {
  const raw = error instanceof Error ? error.message : ''
  if (raw.includes('gift_group_participants_display_name_unique')) {
    return 'Deze naam doet al mee in de groep. Voeg bijvoorbeeld een initiaal of andere herkenning toe.'
  }
  if (raw.includes('GIFT_GROUP_PARTICIPANT_LIMIT')) {
    return 'Deze groep heeft het maximum van 50 deelnemers bereikt.'
  }
  if (raw.includes('GIFT_GROUP_STRUCTURE_LOCKED')) {
    return 'De deelnemers kunnen niet meer worden aangepast nadat de trekking is gestart.'
  }
  if (raw.includes('GIFT_GROUP_NOT_JOINABLE')) {
    return 'Je kunt niet meer deelnemen aan deze groep.'
  }
  return 'Dat ging niet goed. Probeer het nog een keer.'
}

export type GiftGroupInviteView = {
  group: GiftGroup
  participantCount: number
  joinable: boolean
}

export type GiftGroupOrganizerContext = {
  group: GiftGroup
  participants: GiftGroupParticipantSummary[]
}

export type GiftGroupParticipantContext = {
  group: GiftGroup
  participant: GiftGroupParticipant
  participants: GiftGroupParticipantSummary[]
  list: GiftListWithItems
}

export async function createGiftGroup(input: CreateGiftGroupInput): Promise<{
  groupCode: string
  group: GiftGroup
  participant: GiftGroupParticipant
}> {
  await applyRateLimit('create-group')

  const groupCode = createGiftShareCode()
  const repository = new SupabaseGiftGroupRepository()
  const expiresAt = nextExpiry()
  const created = await repository.createGroupWithOrganizer({
    ...input,
    groupExternalKey: createGiftExternalKey('group'),
    groupCodeHash: hashGiftCapability(groupCode),
    organizerTokenHash: hashGiftCapability(createGiftRecoveryToken()),
    participantExternalKey: createGiftExternalKey('participant'),
    participantTokenHash: hashGiftCapability(createGiftRecoveryToken()),
    listExternalKey: createGiftExternalKey('list'),
    listShareCodeHash: hashGiftCapability(createGiftShareCode()),
    expiresAt,
  })

  await grantGiftGroupOrganizerAccess(created.group.id, created.group.expiresAt)
  await grantGiftGroupParticipantAccess(created.participant.id, created.group.expiresAt)
  return { groupCode, ...created }
}

async function getGroupByCode(groupCode: string): Promise<GiftGroup | null> {
  if (!groupCode || groupCode.length > 120) return null
  const repository = new SupabaseGiftGroupRepository()
  const group = await repository.getGroupByCodeHash(hashGiftCapability(groupCode))
  return group && active(group) ? group : null
}

export async function getGiftGroupInvite(groupCode: string): Promise<GiftGroupInviteView | null> {
  const group = await getGroupByCode(groupCode)
  if (!group) return null
  const participants = await new SupabaseGiftGroupRepository().listParticipantSummaries(group.id)
  return {
    group,
    participantCount: participants.length,
    joinable: group.status === 'draft' && participants.length < 50,
  }
}

export async function joinGiftGroup(groupCode: string, input: JoinGiftGroupInput): Promise<GiftGroupParticipant> {
  await applyRateLimit('join-group')

  const group = await getGroupByCode(groupCode)
  if (!group || group.status !== 'draft') throw new GiftGroupAccessError('Je kunt niet meer deelnemen aan deze groep.')

  const repository = new SupabaseGiftGroupRepository()
  const participants = await repository.listParticipantSummaries(group.id)
  const normalizedName = normalizeGiftDisplayName(input.displayName)
  if (participants.some((participant) => normalizeGiftDisplayName(participant.displayName) === normalizedName)) {
    throw new GiftGroupAccessError('Deze naam doet al mee in de groep. Voeg bijvoorbeeld een initiaal of andere herkenning toe.')
  }

  try {
    const participant = await repository.joinGroup({
      group,
      displayName: input.displayName,
      participantExternalKey: createGiftExternalKey('participant'),
      participantTokenHash: hashGiftCapability(createGiftRecoveryToken()),
      listExternalKey: createGiftExternalKey('list'),
      listShareCodeHash: hashGiftCapability(createGiftShareCode()),
    })
    await grantGiftGroupParticipantAccess(participant.id, group.expiresAt)
    return participant
  } catch (error) {
    throw new GiftGroupAccessError(repositoryErrorMessage(error))
  }
}

export async function getOrganizerGiftGroupContext(groupCode: string): Promise<GiftGroupOrganizerContext | null> {
  const group = await getGroupByCode(groupCode)
  if (!group || !(await canManageGiftGroup(group.id))) return null
  const participants = await new SupabaseGiftGroupRepository().listParticipantSummaries(group.id)
  return { group, participants }
}

export async function getParticipantGiftGroupContext(groupCode: string): Promise<GiftGroupParticipantContext | null> {
  const group = await getGroupByCode(groupCode)
  if (!group) return null

  const repository = new SupabaseGiftGroupRepository()
  const grantIds = await giftGroupParticipantGrantIds()
  const participant = await repository.getParticipantForGroupByIds(group.id, grantIds)
  if (!participant) return null

  const [participants, list] = await Promise.all([
    repository.listParticipantSummaries(group.id),
    repository.getParticipantList(participant),
  ])
  return { group, participant, participants, list }
}

async function requireParticipantContext(groupCode: string): Promise<GiftGroupParticipantContext> {
  const context = await getParticipantGiftGroupContext(groupCode)
  if (!context) throw new GiftGroupAccessError('Deelnemerstoegang nodig.')
  if (context.group.status !== 'draft') throw new GiftGroupAccessError('Je lijstje kan na de trekking niet via deze stap worden aangepast.')
  return context
}

export async function removeGiftGroupParticipant(groupCode: string, participantId: string): Promise<void> {
  const context = await getOrganizerGiftGroupContext(groupCode)
  if (!context || context.group.status !== 'draft') throw new GiftGroupAccessError()
  if (!participantId) throw new GiftGroupAccessError('Ongeldige deelnemer.')

  try {
    const removed = await new SupabaseGiftGroupRepository().removeParticipant(context.group.id, participantId)
    if (!removed) throw new GiftGroupAccessError('Deze deelnemer bestaat niet meer.')
  } catch (error) {
    if (error instanceof GiftGroupAccessError) throw error
    throw new GiftGroupAccessError(repositoryErrorMessage(error))
  }
}

export async function addParticipantGiftListItem(groupCode: string, input: CreateGiftListItemInput): Promise<void> {
  const context = await requireParticipantContext(groupCode)
  await new SupabaseGiftRepository().addListItem(context.list.id, input, context.group.expiresAt)
}

export async function addWinkelnuProductToParticipantList(
  groupCode: string,
  productSlug: string,
  rawNote = '',
): Promise<void> {
  const context = await requireParticipantContext(groupCode)
  const product = await getGiftCatalogProductBySlug(productSlug)
  if (!product) throw new GiftGroupAccessError('Dit Winkelnu-product is niet meer beschikbaar.')

  if (context.list.items.some((item) => item.itemType === 'winkelnu_product' && item.productExternalKey === product.productExternalKey)) {
    throw new GiftGroupAccessError('Dit Winkelnu-product staat al op je lijstje.')
  }

  await new SupabaseGiftRepository().addWinkelnuProductItem(context.list.id, {
    itemType: 'winkelnu_product',
    productExternalKey: product.productExternalKey,
    productSlugSnapshot: product.slug,
    title: product.title,
    imageUrlSnapshot: product.imageUrl,
    priceCentsSnapshot: product.priceCents,
    currencySnapshot: product.currency,
    note: validateGiftNote(rawNote),
  }, context.group.expiresAt)
}

export async function updateParticipantGiftListItem(
  groupCode: string,
  itemId: string,
  input: CreateGiftListItemInput,
): Promise<void> {
  const context = await requireParticipantContext(groupCode)
  if (!itemId) throw new GiftGroupAccessError('Ongeldige wens.')
  await new SupabaseGiftRepository().updateListItem(context.list.id, itemId, input, context.group.expiresAt)
}

export async function updateParticipantWinkelnuProductNote(
  groupCode: string,
  itemId: string,
  rawNote: string,
): Promise<void> {
  const context = await requireParticipantContext(groupCode)
  if (!itemId) throw new GiftGroupAccessError('Ongeldige wens.')
  await new SupabaseGiftRepository().updateWinkelnuProductNote(
    context.list.id,
    itemId,
    validateGiftNote(rawNote),
    context.group.expiresAt,
  )
}

export async function deleteParticipantGiftListItem(groupCode: string, itemId: string): Promise<void> {
  const context = await requireParticipantContext(groupCode)
  if (!itemId) throw new GiftGroupAccessError('Ongeldige wens.')
  await new SupabaseGiftRepository().deleteListItem(context.list.id, itemId, context.group.expiresAt)
}
