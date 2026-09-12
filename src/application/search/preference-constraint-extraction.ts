export type PreferenceConstraintKind = 'preference' | 'minimum' | 'maximum' | 'exact' | 'required'
export type PreferenceConstraintDirection = 'higher' | 'lower' | 'present'
export type PreferenceConstraintUnit = 'kg' | 'hours' | 'gb' | 'count' | 'liters' | 'db'

export type ExtractedPreferenceConstraint = {
  id: string
  label: string
  metricKey: string
  kind: PreferenceConstraintKind
  direction?: PreferenceConstraintDirection
  threshold?: {
    value: number
    unit: PreferenceConstraintUnit
  }
}

export type PreferenceConstraintEvaluation = 'match' | 'miss' | 'unknown'

const DUTCH_NUMBERS: Record<string, number> = {
  een: 1,
  twee: 2,
  drie: 3,
  vier: 4,
  vijf: 5,
  zes: 6,
}

const STRIP_WORDS_BY_SIGNAL: Record<string, readonly string[]> = {
  lightweight: ['licht', 'lichte', 'lichtgewicht', 'niet', 'zwaar'],
  'long-battery': ['lange', 'goede', 'lang', 'accuduur', 'batterijduur', 'meegaan', 'meegaat'],
  compact: ['compact', 'klein', 'kleine', 'formaat', 'weinig', 'ruimte', 'aanrecht'],
  quiet: ['stil', 'stille', 'geruisloos', 'weinig', 'geluid', 'laag', 'geluidsniveau'],
  'noise-cancelling': ['noise', 'cancelling', 'canceling', 'ruisonderdrukking', 'anc'],
  'large-capacity': ['grote', 'veel', 'ruime', 'capaciteit', 'inhoud'],
  'many-functions': ['veel', 'functies', 'programma', 'programmas'],
  'more-memory': ['veel', 'geheugen', 'ram'],
  'more-storage': ['veel', 'grote', 'opslag'],
  'max-weight': ['maximaal', 'max', 'onder', 'tot', 'lichter', 'dan', 'kg', 'kilogram', 'g', 'gram'],
  'min-battery-life': ['minimaal', 'minstens', 'ten', 'minste', 'meer', 'langer', 'dan', 'uur', 'uren', 'h', 'accu', 'accuduur', 'batterij', 'batterijduur'],
  'min-memory': ['minimaal', 'minstens', 'ten', 'minste', 'gb', 'tb', 'ram', 'werkgeheugen', 'geheugen'],
  'min-storage': ['minimaal', 'minstens', 'ten', 'minste', 'gb', 'tb', 'opslag', 'ssd'],
  'min-zones': ['minimaal', 'minstens', 'ten', 'minste', 'lade', 'lades', 'zone', 'zones'],
  'exact-zones': ['lade', 'lades', 'zone', 'zones'],
  'min-capacity': ['minimaal', 'minstens', 'ten', 'minste', 'l', 'liter', 'liters', 'inhoud', 'capaciteit'],
  'max-noise': ['maximaal', 'max', 'onder', 'tot', 'db', 'decibel', 'geluid', 'geluidsniveau'],
}

function normalizePreferenceText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('nl-NL')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function decimal(value: string): number | undefined {
  const parsed = Number(value.replace(',', '.'))
  return Number.isFinite(parsed) ? parsed : undefined
}

function numberToken(value: string): number | undefined {
  return DUTCH_NUMBERS[value] ?? decimal(value)
}

function pushUnique(target: ExtractedPreferenceConstraint[], signal: ExtractedPreferenceConstraint): void {
  if (target.some((candidate) => candidate.id === signal.id)) return
  target.push(signal)
}

function hasAny(normalized: string, phrases: readonly string[]): boolean {
  return phrases.some((phrase) => ` ${normalized} `.includes(` ${normalizePreferenceText(phrase)} `))
}

export function extractPreferenceConstraints(term?: string): ExtractedPreferenceConstraint[] {
  const original = term?.trim()
  if (!original) return []

  const normalized = normalizePreferenceText(original)
  const lower = original.toLocaleLowerCase('nl-NL').replace(/\s+/g, ' ')
  const signals: ExtractedPreferenceConstraint[] = []

  if (hasAny(normalized, ['licht', 'lichte', 'lichtgewicht', 'niet zwaar'])) {
    pushUnique(signals, {
      id: 'lightweight',
      label: 'Lichtgewicht',
      metricKey: 'weight',
      kind: 'preference',
      direction: 'lower',
    })
  }

  if (hasAny(normalized, ['lange accuduur', 'lange batterijduur', 'goede accuduur', 'lang meegaan', 'lang meegaat'])) {
    pushUnique(signals, {
      id: 'long-battery',
      label: 'Lange accuduur',
      metricKey: 'battery-life',
      kind: 'preference',
      direction: 'higher',
    })
  }

  if (hasAny(normalized, ['compact', 'klein formaat', 'weinig ruimte', 'klein aanrecht'])) {
    pushUnique(signals, {
      id: 'compact',
      label: 'Compact formaat',
      metricKey: 'dimensions',
      kind: 'preference',
      direction: 'lower',
    })
  }

  if (hasAny(normalized, ['stil', 'stille', 'geruisloos', 'weinig geluid', 'laag geluidsniveau'])) {
    pushUnique(signals, {
      id: 'quiet',
      label: 'Stil gebruik',
      metricKey: 'noise',
      kind: 'preference',
      direction: 'lower',
    })
  }

  if (hasAny(normalized, ['noise cancelling', 'noise canceling', 'ruisonderdrukking', 'anc'])) {
    pushUnique(signals, {
      id: 'noise-cancelling',
      label: 'Ruisonderdrukking',
      metricKey: 'noise-cancelling',
      kind: 'required',
      direction: 'present',
    })
  }

  if (hasAny(normalized, ['grote capaciteit', 'veel inhoud', 'ruime inhoud', 'grote airfryer'])) {
    pushUnique(signals, {
      id: 'large-capacity',
      label: 'Grote capaciteit',
      metricKey: 'capacity',
      kind: 'preference',
      direction: 'higher',
    })
  }

  if (hasAny(normalized, ['veel functies', 'veel programma s', 'veel programma'])) {
    pushUnique(signals, {
      id: 'many-functions',
      label: 'Veel functies',
      metricKey: 'functions',
      kind: 'preference',
      direction: 'higher',
    })
  }

  if (hasAny(normalized, ['veel geheugen', 'veel ram'])) {
    pushUnique(signals, {
      id: 'more-memory',
      label: 'Veel geheugen',
      metricKey: 'memory',
      kind: 'preference',
      direction: 'higher',
    })
  }

  if (hasAny(normalized, ['veel opslag', 'grote opslag'])) {
    pushUnique(signals, {
      id: 'more-storage',
      label: 'Veel opslag',
      metricKey: 'storage',
      kind: 'preference',
      direction: 'higher',
    })
  }

  const weightMatch = lower.match(/(?:maximaal|max|onder|tot|lichter dan)\s*(\d+(?:[.,]\d+)?)\s*(kg|kilogram|g|gram)\b/i)
  if (weightMatch) {
    const rawValue = decimal(weightMatch[1])
    if (rawValue != null) {
      const value = /^(?:g|gram)$/i.test(weightMatch[2]) ? rawValue / 1000 : rawValue
      pushUnique(signals, {
        id: 'max-weight',
        label: `Maximaal ${new Intl.NumberFormat('nl-NL', { maximumFractionDigits: 2 }).format(value)} kg`,
        metricKey: 'weight',
        kind: 'maximum',
        threshold: { value, unit: 'kg' },
      })
    }
  }

  const batteryMatch = lower.match(/(?:minimaal|minstens|ten minste|meer dan|langer dan)\s*(\d+(?:[.,]\d+)?)\s*(uur|uren|h)\b/i)
  if (batteryMatch && /accu|batterij/.test(lower)) {
    const value = decimal(batteryMatch[1])
    if (value != null) {
      pushUnique(signals, {
        id: 'min-battery-life',
        label: `Minimaal ${new Intl.NumberFormat('nl-NL', { maximumFractionDigits: 1 }).format(value)} uur accuduur`,
        metricKey: 'battery-life',
        kind: 'minimum',
        threshold: { value, unit: 'hours' },
      })
    }
  }

  const memoryMatch = lower.match(/(?:minimaal|minstens|ten minste)\s*(\d+(?:[.,]\d+)?)\s*(gb|tb)\s*(?:ram|werkgeheugen|geheugen)\b/i)
  if (memoryMatch) {
    const rawValue = decimal(memoryMatch[1])
    if (rawValue != null) {
      const value = memoryMatch[2].toLocaleLowerCase('nl-NL') === 'tb' ? rawValue * 1024 : rawValue
      pushUnique(signals, {
        id: 'min-memory',
        label: `Minimaal ${new Intl.NumberFormat('nl-NL', { maximumFractionDigits: 0 }).format(value)} GB geheugen`,
        metricKey: 'memory',
        kind: 'minimum',
        threshold: { value, unit: 'gb' },
      })
    }
  }

  const storageMatch = lower.match(/(?:minimaal|minstens|ten minste)\s*(\d+(?:[.,]\d+)?)\s*(gb|tb)\s*(?:opslag|ssd)\b/i)
  if (storageMatch) {
    const rawValue = decimal(storageMatch[1])
    if (rawValue != null) {
      const value = storageMatch[2].toLocaleLowerCase('nl-NL') === 'tb' ? rawValue * 1024 : rawValue
      pushUnique(signals, {
        id: 'min-storage',
        label: `Minimaal ${new Intl.NumberFormat('nl-NL', { maximumFractionDigits: 0 }).format(value)} GB opslag`,
        metricKey: 'storage',
        kind: 'minimum',
        threshold: { value, unit: 'gb' },
      })
    }
  }

  const zonesMatch = normalized.match(/(?:(minimaal|minstens|ten minste) )?(\d+|een|twee|drie|vier|vijf|zes) (?:lades?|zones?)\b/)
  if (zonesMatch) {
    const value = numberToken(zonesMatch[2])
    if (value != null) {
      const minimum = Boolean(zonesMatch[1])
      pushUnique(signals, {
        id: minimum ? 'min-zones' : 'exact-zones',
        label: `${minimum ? 'Minimaal ' : ''}${value} ${value === 1 ? 'lade/zone' : 'lades/zones'}`,
        metricKey: 'zones',
        kind: minimum ? 'minimum' : 'exact',
        threshold: { value, unit: 'count' },
      })
    }
  }

  const capacityMatch = lower.match(/(?:minimaal|minstens|ten minste)\s*(\d+(?:[.,]\d+)?)\s*(l|liter|liters)\b/i)
  if (capacityMatch && /inhoud|capaciteit|airfryer/.test(lower)) {
    const value = decimal(capacityMatch[1])
    if (value != null) {
      pushUnique(signals, {
        id: 'min-capacity',
        label: `Minimaal ${new Intl.NumberFormat('nl-NL', { maximumFractionDigits: 1 }).format(value)} liter inhoud`,
        metricKey: 'capacity',
        kind: 'minimum',
        threshold: { value, unit: 'liters' },
      })
    }
  }

  const noiseMatch = lower.match(/(?:maximaal|max|onder|tot)\s*(\d+(?:[.,]\d+)?)\s*(?:db|decibel)\b/i)
  if (noiseMatch) {
    const value = decimal(noiseMatch[1])
    if (value != null) {
      pushUnique(signals, {
        id: 'max-noise',
        label: `Maximaal ${new Intl.NumberFormat('nl-NL', { maximumFractionDigits: 1 }).format(value)} dB`,
        metricKey: 'noise',
        kind: 'maximum',
        threshold: { value, unit: 'db' },
      })
    }
  }

  const constrainedMetrics = new Set(signals.filter((signal) => signal.threshold || signal.kind === 'required').map((signal) => signal.metricKey))
  return signals.filter((signal) => signal.kind !== 'preference' || !constrainedMetrics.has(signal.metricKey))
}

export function stripPreferenceConstraintContext(term: string, originalTerm?: string): string {
  const signals = extractPreferenceConstraints(originalTerm ?? term)
  if (signals.length === 0) return term

  const wordsToStrip = new Set<string>()
  for (const signal of signals) {
    for (const word of STRIP_WORDS_BY_SIGNAL[signal.id] ?? []) wordsToStrip.add(word)
  }

  const stripNumericTokens = signals.some((signal) => Boolean(signal.threshold))
  return normalizePreferenceText(term)
    .split(' ')
    .filter((token) => {
      if (wordsToStrip.has(token)) return false
      if (stripNumericTokens && /^\d+(?:[.,]\d+)?$/.test(token)) return false
      if (signals.some((signal) => signal.metricKey === 'zones') && DUTCH_NUMBERS[token] != null) return false
      return true
    })
    .join(' ')
}

function firstNumericValue(value: string): number | undefined {
  const match = value.match(/\d+(?:[.,]\d+)?/)
  if (!match) return undefined
  const token = match[0]
  if (token.includes(',')) return decimal(token)
  if (/^\d{1,3}\.\d{3}$/.test(token)) return decimal(token.replace('.', ''))
  return decimal(token)
}

function parseComparableValue(value: string, unit: PreferenceConstraintUnit): number | undefined {
  const normalized = value.toLocaleLowerCase('nl-NL').replace(/\s+/g, ' ')
  const number = firstNumericValue(normalized)
  if (number == null) return undefined

  switch (unit) {
    case 'kg':
      if (/\b(?:kg|kilogram)\b/.test(normalized)) return number
      if (/\b(?:g|gram)\b/.test(normalized)) return number / 1000
      return undefined
    case 'hours':
      if (/\b(?:uur|uren|h)\b/.test(normalized)) return number
      if (/\b(?:min|minuut|minuten)\b/.test(normalized)) return number / 60
      if (/\b(?:dag|dagen)\b/.test(normalized)) return number * 24
      return undefined
    case 'gb':
      if (/\btb\b/.test(normalized)) return number * 1024
      if (/\bgb\b/.test(normalized)) return number
      return undefined
    case 'count':
      return numberToken(normalized.split(' ')[0]) ?? number
    case 'liters':
      if (/\bml\b/.test(normalized)) return number / 1000
      if (/\b(?:l|liter|liters)\b/.test(normalized)) return number
      return undefined
    case 'db':
      return /\b(?:db|decibel)\b/.test(normalized) ? number : undefined
  }
}

export function evaluatePreferenceConstraintValue(
  constraint: ExtractedPreferenceConstraint,
  value: string | null | undefined,
): PreferenceConstraintEvaluation {
  if (!value) return 'unknown'

  if (constraint.kind === 'required' && constraint.direction === 'present') {
    const normalized = normalizePreferenceText(value)
    if (!normalized) return 'unknown'
    if (/(^| )(nee|geen|zonder|no|false|niet)( |$)/.test(normalized)) return 'miss'
    return 'match'
  }

  if (!constraint.threshold) return 'unknown'
  const parsed = parseComparableValue(value, constraint.threshold.unit)
  if (parsed == null) return 'unknown'

  if (constraint.kind === 'minimum') return parsed >= constraint.threshold.value ? 'match' : 'miss'
  if (constraint.kind === 'maximum') return parsed <= constraint.threshold.value ? 'match' : 'miss'
  if (constraint.kind === 'exact') return parsed === constraint.threshold.value ? 'match' : 'miss'
  return 'unknown'
}
