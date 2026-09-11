import {
  NOT_APPLICABLE_COMPARISON_VALUE,
  getProductComparisonGroup,
  type ProductComparisonGroup,
} from './comparison'
import type { Product, ProductVisualKind } from './types'

export type ComparisonImportance = 'primary' | 'secondary' | 'other'

type ComparisonDirection = 'higher' | 'lower' | 'neutral'
type MeasurementKind = 'storage' | 'weight' | 'duration' | 'volume' | 'count' | 'battery' | 'lumen' | 'rpm' | 'dpi'

type ComparisonMetricDefinition = {
  key: string
  label: string
  aliases: readonly string[]
  importance: Exclude<ComparisonImportance, 'other'>
  direction: ComparisonDirection
  measurement?: MeasurementKind
  standoutLabel?: string
  notApplicableFor?: readonly ProductVisualKind[]
}

type ComparisonProfile = {
  label: string
  focus: readonly string[]
  metrics: readonly ComparisonMetricDefinition[]
}

export type SmartComparisonRow = {
  key: string
  label: string
  values: Array<string | null>
  importance: ComparisonImportance
  isDifferent: boolean
  bestProductIndexes: number[]
  standoutLabel?: string
}

export type SmartComparisonResult = {
  group: ProductComparisonGroup
  groupLabel: string
  focus: readonly string[]
  rows: SmartComparisonRow[]
  keyDifferences: SmartComparisonRow[]
  productHighlights: string[][]
}

const metric = (
  key: string,
  label: string,
  aliases: readonly string[],
  importance: Exclude<ComparisonImportance, 'other'>,
  direction: ComparisonDirection = 'neutral',
  options: Pick<ComparisonMetricDefinition, 'measurement' | 'standoutLabel' | 'notApplicableFor'> = {},
): ComparisonMetricDefinition => ({ key, label, aliases, importance, direction, ...options })

const PROFILES: Record<ProductComparisonGroup, ComparisonProfile> = {
  laptops: {
    label: 'Laptops',
    focus: ['Geheugen', 'Opslag', 'Scherm', 'Gewicht', 'Accuduur'],
    metrics: [
      metric('memory', 'Geheugen', ['geheugen', 'werkgeheugen', 'ram', 'basisgeheugen'], 'primary', 'higher', { measurement: 'storage', standoutLabel: 'Meer geheugen' }),
      metric('storage', 'Opslag', ['opslag', 'basisopslag', 'ssd', 'opslagcapaciteit'], 'primary', 'higher', { measurement: 'storage', standoutLabel: 'Meer opslag' }),
      metric('display', 'Scherm', ['scherm', 'display', 'beeldscherm'], 'primary'),
      metric('weight', 'Gewicht', ['gewicht'], 'primary', 'lower', { measurement: 'weight', standoutLabel: 'Lichtste' }),
      metric('battery-life', 'Accuduur', ['accuduur', 'batterijduur'], 'primary', 'higher', { measurement: 'duration', standoutLabel: 'Langste accuduur' }),
      metric('chip', 'Processor / chip', ['processor', 'cpu', 'chip'], 'secondary'),
      metric('ports', 'Aansluitingen', ['aansluitingen', 'poorten'], 'secondary'),
    ],
  },
  headphones: {
    label: 'Hoofdtelefoons',
    focus: ['Accuduur', 'Gewicht', 'Connectiviteit', 'Snelladen'],
    metrics: [
      metric('battery-life', 'Accuduur', ['accuduur', 'batterijduur'], 'primary', 'higher', { measurement: 'duration', standoutLabel: 'Langste accuduur' }),
      metric('weight', 'Gewicht', ['gewicht'], 'primary', 'lower', { measurement: 'weight', standoutLabel: 'Lichtste' }),
      metric('bluetooth', 'Bluetooth', ['bluetooth', 'bluetoothversie'], 'primary'),
      metric('quick-charge', 'Snelladen', ['snelladen', 'snel laden'], 'primary'),
      metric('noise-cancelling', 'Ruisonderdrukking', ['ruisonderdrukking', 'noise cancelling', 'anc'], 'secondary'),
    ],
  },
  tablets: {
    label: 'Tablets',
    focus: ['Scherm', 'Opslag', 'Gewicht', 'Batterij', 'Bescherming'],
    metrics: [
      metric('display', 'Scherm', ['display', 'scherm', 'beeldscherm'], 'primary'),
      metric('storage', 'Opslag', ['opslag', 'opslagcapaciteit'], 'primary', 'higher', { measurement: 'storage', standoutLabel: 'Meer opslag' }),
      metric('weight', 'Gewicht', ['gewicht'], 'primary', 'lower', { measurement: 'weight', standoutLabel: 'Lichtste' }),
      metric('battery', 'Batterij', ['batterij', 'accucapaciteit'], 'primary', 'higher', { measurement: 'battery', standoutLabel: 'Grotere batterij' }),
      metric('protection', 'Bescherming', ['bescherming', 'ip-classificatie', 'ip rating'], 'secondary'),
    ],
  },
  'computer-mice': {
    label: 'Computermuizen',
    focus: ['Sensor', 'Verbinding', 'Apparaten', 'Opladen'],
    metrics: [
      metric('sensor', 'Sensor', ['sensor', 'dpi', 'resolutie'], 'primary', 'higher', { measurement: 'dpi', standoutLabel: 'Hogere sensorresolutie' }),
      metric('connection', 'Verbinding', ['verbinding', 'connectiviteit'], 'primary'),
      metric('devices', 'Aantal apparaten', ['apparaten', 'gekoppelde apparaten'], 'primary', 'higher', { measurement: 'count', standoutLabel: 'Meer apparaten' }),
      metric('charging', 'Opladen', ['opladen', 'laadaansluiting'], 'primary'),
      metric('scroll', 'Scrollwiel', ['scrollwiel', 'scroll'], 'secondary'),
    ],
  },
  'vacuum-cleaners': {
    label: 'Stofzuigers',
    focus: ['Type', 'Gewicht', 'Gebruiksduur / actieradius', 'Stofopvang', 'Zuigprestaties'],
    metrics: [
      metric('weight', 'Gewicht', ['gewicht'], 'primary', 'lower', { measurement: 'weight', standoutLabel: 'Lichtste' }),
      metric('runtime', 'Gebruiksduur', ['gebruiksduur', 'accuduur'], 'primary', 'higher', { measurement: 'duration', standoutLabel: 'Langste gebruiksduur', notApplicableFor: ['canister-vacuum'] }),
      metric('radius', 'Actieradius', ['actieradius'], 'primary', 'higher', { standoutLabel: 'Grotere actieradius', notApplicableFor: ['stick-vacuum'] }),
      metric('bin', 'Stofreservoir', ['stofreservoir', 'stofbak'], 'primary', 'higher', { measurement: 'volume', standoutLabel: 'Groter stofreservoir', notApplicableFor: ['canister-vacuum'] }),
      metric('bag', 'Stofzak', ['stofzak'], 'primary', 'higher', { measurement: 'volume', standoutLabel: 'Grotere stofzak', notApplicableFor: ['stick-vacuum'] }),
      metric('suction', 'Zuigkracht', ['zuigkracht', 'air watt'], 'secondary'),
      metric('power', 'Vermogen', ['vermogen'], 'secondary'),
      metric('filtration', 'Filtratie', ['filtratie', 'filter'], 'secondary'),
    ],
  },
  'smart-lighting': {
    label: 'Slimme verlichting',
    focus: ['Lichtopbrengst', 'Kleurtemperatuur', 'Bridge', 'Levensduur'],
    metrics: [
      metric('brightness', 'Lichtopbrengst', ['lichtopbrengst', 'lumen'], 'primary', 'higher', { measurement: 'lumen', standoutLabel: 'Meer lichtopbrengst' }),
      metric('color-temperature', 'Kleurtemperatuur', ['kleurtemperatuur'], 'primary'),
      metric('bridge', 'Bridge / hub', ['bridge', 'hub'], 'primary'),
      metric('lifespan', 'Levensduur', ['levensduur', 'nominale levensduur'], 'primary', 'higher', { measurement: 'duration', standoutLabel: 'Langere levensduur' }),
      metric('lamps', 'Aantal lampen', ['lampen', 'aantal lampen'], 'secondary', 'higher', { measurement: 'count', standoutLabel: 'Meer lampen' }),
    ],
  },
  'washing-machines': {
    label: 'Wasmachines',
    focus: ['Vulgewicht', 'Centrifugeren', 'Afmetingen', 'Type', 'Gebruiksgemak'],
    metrics: [
      metric('load', 'Vulgewicht', ['vulgewicht', 'laadvermogen'], 'primary'),
      metric('spin', 'Centrifugeren', ['centrifugeren', 'toerental'], 'primary', 'higher', { measurement: 'rpm', standoutLabel: 'Hoger centrifugetoerental' }),
      metric('dimensions', 'Afmetingen', ['afmetingen', 'formaat'], 'primary'),
      metric('type', 'Type', ['type'], 'primary'),
      metric('refill', 'Bijvullen', ['bijvullen', 'bijvulfunctie'], 'secondary'),
    ],
  },
  airfryers: {
    label: 'Airfryers',
    focus: ['Capaciteit', 'Aantal zones', 'Kookfuncties', 'Vermogen', 'Afmetingen'],
    metrics: [
      metric('capacity', 'Capaciteit', ['capaciteit', 'totale capaciteit', 'inhoud'], 'primary', 'higher', { measurement: 'volume', standoutLabel: 'Grotere capaciteit' }),
      metric('zones', 'Lades / zones', ['lades', 'zones', 'kookzones'], 'primary', 'higher', { measurement: 'count', standoutLabel: 'Meer zones' }),
      metric('functions', 'Kookfuncties', ['kookfuncties', 'functies', 'programmas', "programma's"], 'primary', 'higher', { measurement: 'count', standoutLabel: 'Meer functies' }),
      metric('power', 'Vermogen', ['vermogen'], 'primary'),
      metric('dimensions', 'Afmetingen', ['afmetingen'], 'secondary'),
      metric('technology', 'Technologie', ['technologie'], 'secondary'),
    ],
  },
  'coffee-machines': {
    label: 'Koffiemachines',
    focus: ['Waterreservoir', 'Bonenreservoir', 'Drankfuncties', 'Melksysteem', 'Afmetingen'],
    metrics: [
      metric('water', 'Waterreservoir', ['waterreservoir'], 'primary', 'higher', { measurement: 'volume', standoutLabel: 'Groter waterreservoir' }),
      metric('beans', 'Bonenreservoir', ['bonenreservoir'], 'primary'),
      metric('functions', 'Drankfuncties', ['directe functies', 'drankfuncties', 'functies'], 'primary', 'higher', { measurement: 'count', standoutLabel: 'Meer drankfuncties' }),
      metric('milk', 'Melksysteem', ['melksysteem', 'melkopschuimer'], 'primary'),
      metric('pressure', 'Pompdruk', ['pompdruk', 'druk'], 'secondary'),
      metric('dimensions', 'Afmetingen', ['afmetingen'], 'secondary'),
    ],
  },
  'stand-mixers': {
    label: 'Keukenmachines',
    focus: ['Kominhoud', 'Vermogen', 'Aandrijving', 'Meegeleverde accessoires'],
    metrics: [
      metric('bowl', 'Kominhoud', ['hoofdkom', 'kominhoud', 'mengkom'], 'primary', 'higher', { measurement: 'volume', standoutLabel: 'Grotere kom' }),
      metric('power', 'Vermogen', ['vermogen'], 'primary'),
      metric('drive', 'Aandrijving', ['aandrijving'], 'primary'),
      metric('head', 'Kop', ['kop'], 'secondary'),
      metric('extra-bowl', 'Extra kom', ['extra kom'], 'secondary'),
    ],
  },
  'electric-toothbrushes': {
    label: 'Elektrische tandenborstels',
    focus: ['Poetsstanden', 'Accuduur', 'Timer', 'Druksensor', 'Opzetborstels'],
    metrics: [
      metric('modes', 'Poetsstanden', ['poetsstanden', 'standen'], 'primary', 'higher', { measurement: 'count', standoutLabel: 'Meer poetsstanden' }),
      metric('battery-life', 'Accuduur', ['accuduur', 'batterijduur'], 'primary', 'higher', { measurement: 'duration', standoutLabel: 'Langste accuduur' }),
      metric('pressure-sensor', 'Druksensor', ['druksensor', 'poetsdruksensor'], 'primary'),
      metric('timer', 'Timer', ['timer', 'poetstimer'], 'primary'),
      metric('brush-heads', 'Opzetborstels', ['opzetborstels'], 'secondary', 'higher', { measurement: 'count', standoutLabel: 'Meer opzetborstels' }),
    ],
  },
  shavers: {
    label: 'Scheerapparaten',
    focus: ['Accuduur', 'Laadtijd', 'Nat/droog', 'Scheersysteem', 'Accessoires'],
    metrics: [
      metric('battery-life', 'Accuduur', ['accuduur', 'batterijduur'], 'primary', 'higher', { measurement: 'duration', standoutLabel: 'Langste accuduur' }),
      metric('charge-time', 'Laadtijd', ['laadtijd'], 'primary', 'lower', { measurement: 'duration', standoutLabel: 'Kortste laadtijd' }),
      metric('wet-dry', 'Nat / droog', ['nat droog', 'wet dry', 'waterbestendig'], 'primary'),
      metric('system', 'Scheersysteem', ['scheersysteem'], 'primary'),
      metric('accessories', 'Accessoires', ['accessoires', 'meegeleverd'], 'secondary'),
    ],
  },
  epilators: {
    label: 'Epilators',
    focus: ['Gebruik nat/droog', 'Pincetten', 'Accuduur', 'Snelheden', 'Accessoires'],
    metrics: [
      metric('wet-dry', 'Nat / droog', ['nat droog', 'wet dry', 'waterbestendig'], 'primary'),
      metric('tweezers', 'Pincetten', ['pincetten'], 'primary', 'higher', { measurement: 'count', standoutLabel: 'Meer pincetten' }),
      metric('battery-life', 'Accuduur', ['accuduur', 'batterijduur'], 'primary', 'higher', { measurement: 'duration', standoutLabel: 'Langste accuduur' }),
      metric('speeds', 'Snelheden', ['snelheden', 'standen'], 'primary', 'higher', { measurement: 'count', standoutLabel: 'Meer snelheden' }),
      metric('accessories', 'Accessoires', ['accessoires', 'meegeleverd'], 'secondary'),
    ],
  },
  'fitness-wearables': {
    label: 'Sporthorloges & activity trackers',
    focus: ['Accuduur', 'Gewicht', 'GPS', 'Waterbestendigheid', 'Gezondheidsfuncties'],
    metrics: [
      metric('battery-life', 'Accuduur', ['accuduur', 'batterijduur'], 'primary', 'higher', { measurement: 'duration', standoutLabel: 'Langste accuduur' }),
      metric('weight', 'Gewicht', ['gewicht'], 'primary', 'lower', { measurement: 'weight', standoutLabel: 'Lichtste' }),
      metric('gps', 'GPS', ['gps'], 'primary'),
      metric('water', 'Waterbestendigheid', ['waterbestendigheid', 'waterdicht'], 'primary'),
      metric('health', 'Gezondheidsfuncties', ['gezondheidsfuncties', 'sensoren'], 'secondary'),
    ],
  },
  'drink-bottles': {
    label: 'Drinkflessen',
    focus: ['Inhoud', 'Gewicht', 'Materiaal', 'Isolatie', 'Vaatwasser'],
    metrics: [
      metric('capacity', 'Inhoud', ['inhoud', 'capaciteit'], 'primary', 'higher', { measurement: 'volume', standoutLabel: 'Grotere inhoud' }),
      metric('weight', 'Gewicht', ['gewicht'], 'primary', 'lower', { measurement: 'weight', standoutLabel: 'Lichtste' }),
      metric('material', 'Materiaal', ['materiaal'], 'primary'),
      metric('insulation', 'Isolatie', ['isolatie', 'warmhoudtijd', 'koudhoudtijd'], 'primary'),
      metric('dishwasher', 'Vaatwasser', ['vaatwasser', 'vaatwasserbestendig'], 'secondary'),
    ],
  },
  tents: {
    label: 'Tenten',
    focus: ['Aantal personen', 'Gewicht', 'Waterkolom', 'Opzettijd', 'Pakmaat'],
    metrics: [
      metric('persons', 'Aantal personen', ['personen', 'aantal personen'], 'primary', 'higher', { measurement: 'count', standoutLabel: 'Meer slaapplaatsen' }),
      metric('weight', 'Gewicht', ['gewicht'], 'primary', 'lower', { measurement: 'weight', standoutLabel: 'Lichtste' }),
      metric('water-column', 'Waterkolom', ['waterkolom'], 'primary'),
      metric('setup', 'Opzettijd', ['opzettijd'], 'primary', 'lower', { measurement: 'duration', standoutLabel: 'Sneller op te zetten' }),
      metric('pack-size', 'Pakmaat', ['pakmaat'], 'secondary'),
    ],
  },
  'lawn-mowers': {
    label: 'Grasmaaiers',
    focus: ['Maaibreedte', 'Maaihoogte', 'Opvangbak', 'Gewicht', 'Aandrijving'],
    metrics: [
      metric('cut-width', 'Maaibreedte', ['maaibreedte'], 'primary'),
      metric('cut-height', 'Maaihoogte', ['maaihoogte'], 'primary'),
      metric('collector', 'Opvangbak', ['opvangbak', 'grasopvang'], 'primary', 'higher', { measurement: 'volume', standoutLabel: 'Grotere opvangbak' }),
      metric('weight', 'Gewicht', ['gewicht'], 'primary', 'lower', { measurement: 'weight', standoutLabel: 'Lichtste' }),
      metric('drive', 'Aandrijving', ['aandrijving'], 'secondary'),
    ],
  },
  'pressure-washers': {
    label: 'Hogedrukreinigers',
    focus: ['Werkdruk', 'Wateropbrengst', 'Slanglengte', 'Gewicht', 'Accessoires'],
    metrics: [
      metric('pressure', 'Werkdruk', ['werkdruk', 'druk'], 'primary'),
      metric('flow', 'Wateropbrengst', ['wateropbrengst', 'waterdebiet'], 'primary'),
      metric('hose', 'Slanglengte', ['slanglengte'], 'primary'),
      metric('weight', 'Gewicht', ['gewicht'], 'primary', 'lower', { measurement: 'weight', standoutLabel: 'Lichtste' }),
      metric('accessories', 'Accessoires', ['accessoires', 'meegeleverd'], 'secondary'),
    ],
  },
  drills: {
    label: 'Accuboormachines',
    focus: ['Koppel', 'Accuspanning', 'Accucapaciteit', 'Gewicht', 'Meegeleverde accu’s'],
    metrics: [
      metric('torque', 'Koppel', ['koppel', 'maximaal koppel'], 'primary'),
      metric('voltage', 'Accuspanning', ['accuspanning', 'voltage'], 'primary'),
      metric('battery', 'Accucapaciteit', ['accucapaciteit'], 'primary'),
      metric('weight', 'Gewicht', ['gewicht'], 'primary', 'lower', { measurement: 'weight', standoutLabel: 'Lichtste' }),
      metric('batteries', 'Meegeleverde accu’s', ['meegeleverde accus', 'accus meegeleverd'], 'secondary', 'higher', { measurement: 'count', standoutLabel: 'Meer accu’s meegeleverd' }),
    ],
  },
}

function normalizeLabel(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('nl-NL')
    .replace(/&/g, ' en ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ')
}

function findMetric(profile: ComparisonProfile, label: string): ComparisonMetricDefinition | undefined {
  const normalized = normalizeLabel(label)
  return profile.metrics.find((candidate) => candidate.aliases.some((alias) => {
    const normalizedAlias = normalizeLabel(alias)
    return normalized === normalizedAlias || normalized.startsWith(`${normalizedAlias} `)
  }))
}

function firstNumber(value: string): number | null {
  const match = value.replace(/\s/g, '').match(/\d+(?:[.,]\d+)?/)
  if (!match) return null
  const parsed = Number(match[0].replace(',', '.'))
  return Number.isFinite(parsed) ? parsed : null
}

function parseMeasurement(value: string, kind: MeasurementKind): number | null {
  const normalized = value.toLocaleLowerCase('nl-NL')
  const number = firstNumber(value)
  if (number === null) return null

  switch (kind) {
    case 'storage':
      if (/\btb\b/.test(normalized)) return number * 1024
      if (/\bgb\b/.test(normalized)) return number
      return null
    case 'weight':
      if (/\bkg\b/.test(normalized)) return number * 1000
      if (/\bg\b/.test(normalized)) return number
      return null
    case 'duration':
      if (/\b(?:uur|uren|hour|hours|h)\b/.test(normalized)) return number * 60
      if (/\b(?:min|minuut|minuten|minutes)\b/.test(normalized)) return number
      return null
    case 'volume':
      if (/\bml\b/.test(normalized)) return number / 1000
      if (/\b(?:l|liter|liters)\b/.test(normalized)) return number
      return null
    case 'battery':
      return /\bmah\b/.test(normalized) ? number : null
    case 'lumen':
      return /\b(?:lm|lumen)\b/.test(normalized) ? number : null
    case 'rpm':
      return /\b(?:rpm|tpm|toeren)\b/.test(normalized) ? number : null
    case 'dpi':
      return /\bdpi\b/.test(normalized) ? number : null
    case 'count':
      return number
  }
}

function applicableMissingValue(product: Product, metricDefinition: ComparisonMetricDefinition): string | null {
  if (!product.visualKind) return null
  return metricDefinition.notApplicableFor?.includes(product.visualKind)
    ? NOT_APPLICABLE_COMPARISON_VALUE
    : null
}

function valuesDiffer(values: Array<string | null>): boolean {
  const meaningful = values.filter((value): value is string => Boolean(value))
  if (meaningful.length < 2) return meaningful.length === 1 && values.includes(NOT_APPLICABLE_COMPARISON_VALUE)
  return new Set(meaningful.map(normalizeLabel)).size > 1
}

function bestIndexes(
  values: Array<string | null>,
  metricDefinition: ComparisonMetricDefinition | undefined,
): number[] {
  if (!metricDefinition?.measurement || metricDefinition.direction === 'neutral') return []
  const parsed = values.map((value) => value && value !== NOT_APPLICABLE_COMPARISON_VALUE
    ? parseMeasurement(value, metricDefinition.measurement!)
    : null)

  if (parsed.some((value) => value === null)) return []
  const numbers = parsed as number[]
  if (new Set(numbers).size < 2) return []
  const target = metricDefinition.direction === 'higher' ? Math.max(...numbers) : Math.min(...numbers)
  return numbers.flatMap((value, index) => value === target ? [index] : [])
}

export function buildSmartComparison(products: Product[]): SmartComparisonResult | null {
  if (products.length === 0) return null
  const group = getProductComparisonGroup(products[0])
  if (!group || !products.every((product) => getProductComparisonGroup(product) === group)) return null

  const profile = PROFILES[group]
  const rowsByKey = new Map<string, SmartComparisonRow>()
  const metricByKey = new Map(profile.metrics.map((definition) => [definition.key, definition]))

  for (const definition of profile.metrics) {
    rowsByKey.set(definition.key, {
      key: definition.key,
      label: definition.label,
      values: products.map((product) => applicableMissingValue(product, definition)),
      importance: definition.importance,
      isDifferent: false,
      bestProductIndexes: [],
      standoutLabel: definition.standoutLabel,
    })
  }

  products.forEach((product, productIndex) => {
    for (const specification of product.specifications ?? []) {
      const label = specification.label.trim()
      const value = specification.value.trim()
      if (!label || !value) continue
      const definition = findMetric(profile, label)
      const key = definition?.key ?? `raw:${normalizeLabel(label)}`
      const existing = rowsByKey.get(key)

      if (existing) {
        if (!existing.values[productIndex] || existing.values[productIndex] === NOT_APPLICABLE_COMPARISON_VALUE) {
          existing.values[productIndex] = value
        }
        continue
      }

      const values = products.map(() => null as string | null)
      values[productIndex] = value
      rowsByKey.set(key, {
        key,
        label,
        values,
        importance: 'other',
        isDifferent: false,
        bestProductIndexes: [],
      })
    }
  })

  const metricOrder = new Map(profile.metrics.map((definition, index) => [definition.key, index]))
  const importanceOrder: Record<ComparisonImportance, number> = { primary: 0, secondary: 1, other: 2 }
  const rows = Array.from(rowsByKey.values())
    .filter((row) => row.values.some(Boolean))
    .map((row) => {
      const definition = metricByKey.get(row.key)
      return {
        ...row,
        isDifferent: valuesDiffer(row.values),
        bestProductIndexes: bestIndexes(row.values, definition),
      }
    })
    .sort((left, right) => {
      const importance = importanceOrder[left.importance] - importanceOrder[right.importance]
      if (importance !== 0) return importance
      return (metricOrder.get(left.key) ?? Number.MAX_SAFE_INTEGER) - (metricOrder.get(right.key) ?? Number.MAX_SAFE_INTEGER)
    })

  const keyDifferences = [
    ...rows.filter((row) => row.importance === 'primary' && row.isDifferent),
    ...rows.filter((row) => row.importance === 'secondary' && row.isDifferent),
  ].slice(0, 4)

  const productHighlights = products.map(() => [] as string[])
  for (const row of rows) {
    if (!row.standoutLabel) continue
    for (const index of row.bestProductIndexes) {
      if (productHighlights[index].length < 3) productHighlights[index].push(row.standoutLabel)
    }
  }

  return {
    group,
    groupLabel: profile.label,
    focus: profile.focus,
    rows,
    keyDifferences,
    productHighlights,
  }
}
