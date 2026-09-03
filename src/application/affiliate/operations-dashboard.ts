import type { PartnerOperationsReadModel } from './partner-operations-read-model'

export type OperationsIncidentSeverity = 'critical' | 'high' | 'medium' | 'low'
export type OperationsIncidentKind = 'feed_attention' | 'feed_failure' | 'feed_delay' | 'feed_not_running' | 'missing_credentials' | 'integration_inactive'

export type OperationsIncident = {
  id: string
  severity: OperationsIncidentSeverity
  kind: OperationsIncidentKind
  integrationId: string
  merchantId: string
  merchantName: string
  sourceKey?: string
  title: string
  detail: string
  operatorAction: string
}

export type OperationsDashboard = {
  generatedAt: string
  totals: {
    integrations: number
    activeIntegrations: number
    feeds: number
    incidents: number
    critical: number
    high: number
  }
  incidents: OperationsIncident[]
}

const severityOrder: Record<OperationsIncidentSeverity, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
}

export function buildOperationsDashboard(model: PartnerOperationsReadModel): OperationsDashboard {
  const incidents: OperationsIncident[] = []
  let feeds = 0

  for (const integration of model.integrations) {
    if (integration.integrationStatus === 'active' && !integration.hasSecretReference) {
      incidents.push({
        id: `${integration.integrationId}:missing-credentials`,
        severity: 'critical',
        kind: 'missing_credentials',
        integrationId: integration.integrationId,
        merchantId: integration.merchantId,
        merchantName: integration.merchantName,
        title: `${integration.merchantName}: credentials ontbreken`,
        detail: 'De actieve affiliate-integratie heeft geen server-side secret reference.',
        operatorAction: 'Configureer de vereiste partnercredential als server-only env secret en registreer alleen de env: reference.',
      })
    }

    if (integration.integrationStatus !== 'active') {
      incidents.push({
        id: `${integration.integrationId}:inactive`,
        severity: integration.integrationStatus === 'pending' ? 'medium' : 'low',
        kind: 'integration_inactive',
        integrationId: integration.integrationId,
        merchantId: integration.merchantId,
        merchantName: integration.merchantName,
        title: `${integration.merchantName}: integratie ${integration.integrationStatus}`,
        detail: `De integratie staat op ${integration.integrationStatus} en neemt niet normaal deel aan productie-imports.`,
        operatorAction: integration.integrationStatus === 'pending'
          ? 'Rond onboarding en acceptance evidence af voordat activatie wordt toegestaan.'
          : 'Controleer of deze status bewust is; activeer alleen na een nieuwe acceptance check.',
      })
    }

    for (const feed of integration.feeds) {
      feeds += 1
      if (!feed.isActive) continue

      if (!feed.health) {
        incidents.push({
          id: `${integration.integrationId}:${feed.sourceKey}:not-running`,
          severity: 'high',
          kind: 'feed_not_running',
          integrationId: integration.integrationId,
          merchantId: integration.merchantId,
          merchantName: integration.merchantName,
          sourceKey: feed.sourceKey,
          title: `${integration.merchantName}: feed nog niet uitgevoerd`,
          detail: 'Voor deze actieve feed is nog geen orchestration/health-observatie beschikbaar.',
          operatorAction: 'Voer eerst een gecontroleerde preview/import uit en verifieer scheduler/orchestration state.',
        })
        continue
      }

      const health = feed.health
      if (health.status === 'attention_required') {
        incidents.push({
          id: `${integration.integrationId}:${feed.sourceKey}:attention`,
          severity: 'critical',
          kind: 'feed_attention',
          integrationId: integration.integrationId,
          merchantId: integration.merchantId,
          merchantName: integration.merchantName,
          sourceKey: feed.sourceKey,
          title: `${integration.merchantName}: feed vereist direct aandacht`,
          detail: health.lastError ?? `Feed heeft ${health.failureCount} opeenvolgende fouten.`,
          operatorAction: 'Pauzeer zo nodig de feed, inspecteer de laatste importfout en herstel vóór een nieuwe run.',
        })
      } else if (health.status === 'failing') {
        incidents.push({
          id: `${integration.integrationId}:${feed.sourceKey}:failing`,
          severity: 'high',
          kind: 'feed_failure',
          integrationId: integration.integrationId,
          merchantId: integration.merchantId,
          merchantName: integration.merchantName,
          sourceKey: feed.sourceKey,
          title: `${integration.merchantName}: feed faalt`,
          detail: health.lastError ?? 'De laatste feedimport is mislukt.',
          operatorAction: 'Inspecteer mapping/transport/credentialfout en voer daarna een gecontroleerde retry uit.',
        })
      } else if (health.status === 'delayed') {
        incidents.push({
          id: `${integration.integrationId}:${feed.sourceKey}:delayed`,
          severity: 'medium',
          kind: 'feed_delay',
          integrationId: integration.integrationId,
          merchantId: integration.merchantId,
          merchantName: integration.merchantName,
          sourceKey: feed.sourceKey,
          title: `${integration.merchantName}: feed vertraagd`,
          detail: `De geplande import is langer dan de operationele drempel achterstallig${health.nextRunAt ? ` (next ${health.nextRunAt})` : ''}.`,
          operatorAction: 'Controleer scheduler-trigger, lease-status en workerbeschikbaarheid.',
        })
      }
    }
  }

  incidents.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity] || a.merchantName.localeCompare(b.merchantName) || a.id.localeCompare(b.id))

  return {
    generatedAt: model.generatedAt,
    totals: {
      integrations: model.integrations.length,
      activeIntegrations: model.integrations.filter((integration) => integration.integrationStatus === 'active').length,
      feeds,
      incidents: incidents.length,
      critical: incidents.filter((incident) => incident.severity === 'critical').length,
      high: incidents.filter((incident) => incident.severity === 'high').length,
    },
    incidents,
  }
}
