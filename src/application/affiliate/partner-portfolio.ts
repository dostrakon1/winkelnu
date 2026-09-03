import type { PartnerActivationGateStatus } from './partner-activation-gate'
import type { FeedHealth, FeedHealthStatus } from '@/domain/catalog/import-worker'

export type PartnerPortfolioEvidence = {
  key: string
  label: string
  verified: boolean
  requiredForProduction: boolean
}

export type PartnerPortfolioInput = {
  partnerKey: string
  displayName: string
  integrationKind: 'network' | 'marketplace' | 'direct'
  activationStatus: PartnerActivationGateStatus
  feedHealth?: FeedHealth
  evidence: PartnerPortfolioEvidence[]
}

export type PartnerPortfolioStatus = {
  partnerKey: string
  displayName: string
  integrationKind: PartnerPortfolioInput['integrationKind']
  activationStatus: PartnerActivationGateStatus
  feedHealthStatus: FeedHealthStatus | 'not_running'
  evidenceVerified: number
  evidenceRequired: number
  productionEvidenceComplete: boolean
  blockers: string[]
  nextAction?: string
  readyForProduction: boolean
}

export type PartnerPortfolioSummary = {
  totalPartners: number
  productionApproved: number
  repositoryReady: number
  blocked: number
  attentionRequired: number
  partners: PartnerPortfolioStatus[]
}

function evidenceBlockers(input: PartnerPortfolioInput): string[] {
  return input.evidence
    .filter((item) => item.requiredForProduction && !item.verified)
    .map((item) => item.label)
}

function feedBlocker(feedHealth?: FeedHealth): string | undefined {
  if (!feedHealth) return 'No live feed health has been observed yet.'
  if (feedHealth.status === 'attention_required') return feedHealth.lastError || 'Feed health requires operator attention.'
  if (feedHealth.status === 'failing') return feedHealth.lastError || 'Feed import is currently failing.'
  if (feedHealth.status === 'delayed') return 'Feed import is delayed beyond the operational threshold.'
  return undefined
}

export function buildPartnerPortfolio(inputs: PartnerPortfolioInput[]): PartnerPortfolioSummary {
  const partners = inputs.map((input): PartnerPortfolioStatus => {
    const requiredEvidence = input.evidence.filter((item) => item.requiredForProduction)
    const verifiedEvidence = requiredEvidence.filter((item) => item.verified)
    const blockers = evidenceBlockers(input)
    const healthBlocker = feedBlocker(input.feedHealth)
    if (healthBlocker) blockers.push(healthBlocker)
    if (input.activationStatus === 'blocked') blockers.unshift('Partner acceptance gate is blocked.')

    const readyForProduction = input.activationStatus === 'production_approved'
      && verifiedEvidence.length === requiredEvidence.length
      && input.feedHealth?.status === 'healthy'

    return {
      partnerKey: input.partnerKey,
      displayName: input.displayName,
      integrationKind: input.integrationKind,
      activationStatus: input.activationStatus,
      feedHealthStatus: input.feedHealth?.status ?? 'not_running',
      evidenceVerified: verifiedEvidence.length,
      evidenceRequired: requiredEvidence.length,
      productionEvidenceComplete: verifiedEvidence.length === requiredEvidence.length,
      blockers,
      nextAction: blockers[0],
      readyForProduction,
    }
  }).sort((a, b) => {
    const order: Record<PartnerActivationGateStatus, number> = {
      blocked: 0,
      repository_ready: 1,
      production_approved: 2,
    }
    return order[a.activationStatus] - order[b.activationStatus] || a.displayName.localeCompare(b.displayName)
  })

  return {
    totalPartners: partners.length,
    productionApproved: partners.filter((partner) => partner.activationStatus === 'production_approved').length,
    repositoryReady: partners.filter((partner) => partner.activationStatus === 'repository_ready').length,
    blocked: partners.filter((partner) => partner.activationStatus === 'blocked').length,
    attentionRequired: partners.filter((partner) => partner.feedHealthStatus === 'attention_required' || partner.feedHealthStatus === 'failing').length,
    partners,
  }
}
