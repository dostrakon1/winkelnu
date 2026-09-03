import { validateFeedCandidate } from '@/domain/catalog/validate-feed-candidate'
import {
  inspectBolProductFeedSchema,
  mapBolProductFeedRecord,
  parseBolProductFeedHeader,
  parseBolProductFeedRow,
  type BolProductFeedMappingProfile,
} from '@/infrastructure/feeds/bol/bol-product-feed-contract'

export type BolFeedSampleValidationReport = {
  schemaValid: boolean
  rowsChecked: number
  rowsAccepted: number
  acceptanceRate: number
  missingBindings: string[]
  duplicateHeaders: string[]
  issues: Array<{ row: number; issues: Array<{ field: string; code: string; message: string }> }>
  passed: boolean
}

export function validateBolProductFeedSample(input: {
  lines: string[]
  profile: BolProductFeedMappingProfile
  sourceKey: string
  siteId: string
  importedAt: string
  minimumAcceptanceRate?: number
}): BolFeedSampleValidationReport {
  const [headerLine, ...rows] = input.lines.filter((line) => line.trim().length > 0)
  if (!headerLine) {
    return {
      schemaValid: false,
      rowsChecked: 0,
      rowsAccepted: 0,
      acceptanceRate: 0,
      missingBindings: Object.values(input.profile).filter((value): value is string => Boolean(value)),
      duplicateHeaders: [],
      issues: [],
      passed: false,
    }
  }

  const schema = inspectBolProductFeedSchema(headerLine, input.profile)
  if (!schema.valid) {
    return {
      schemaValid: false,
      rowsChecked: 0,
      rowsAccepted: 0,
      acceptanceRate: 0,
      missingBindings: schema.missingBindings,
      duplicateHeaders: schema.duplicateHeaders,
      issues: [],
      passed: false,
    }
  }

  const headers = parseBolProductFeedHeader(headerLine)
  const issues: BolFeedSampleValidationReport['issues'] = []
  let accepted = 0

  rows.forEach((line, index) => {
    try {
      const record = parseBolProductFeedRow(headers, line)
      const candidate = mapBolProductFeedRecord({
        record,
        profile: input.profile,
        sourceKey: input.sourceKey,
        siteId: input.siteId,
        importedAt: input.importedAt,
      })
      const validation = validateFeedCandidate(candidate)
      if (validation.ok) accepted += 1
      else issues.push({ row: index + 2, issues: validation.issues })
    } catch (error) {
      issues.push({
        row: index + 2,
        issues: [{ field: 'row', code: 'parse_error', message: error instanceof Error ? error.message : 'Unknown parse error.' }],
      })
    }
  })

  const acceptanceRate = rows.length === 0 ? 0 : accepted / rows.length
  const minimum = input.minimumAcceptanceRate ?? 0.95

  return {
    schemaValid: true,
    rowsChecked: rows.length,
    rowsAccepted: accepted,
    acceptanceRate,
    missingBindings: [],
    duplicateHeaders: [],
    issues,
    passed: rows.length > 0 && acceptanceRate >= minimum,
  }
}
