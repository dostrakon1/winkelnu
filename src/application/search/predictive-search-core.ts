export type PredictiveSearchKind = 'category' | 'subcategory' | 'guide' | 'collection' | 'collection-section'

export type PredictiveSearchIndexItem = {
  id: string
  kind: PredictiveSearchKind
  eyebrow: string
  title: string
  description: string
  href: string
  terms: readonly string[]
  boost?: number
}

export type SearchIntentKey =
  | 'study'
  | 'work'
  | 'hand-luggage'
  | 'gift'
  | 'gift-father'
  | 'gift-mother'
  | 'gift-child'
  | 'birthday'
  | 'christmas'
  | 'valentine'
  | 'budget'

export type SearchIntentSignal = {
  key: SearchIntentKey
  label: string
  description: string
}

export type PredictiveSearchSuggestion = {
  kind: PredictiveSearchKind
  eyebrow: string
  title: string
  description: string
  href: string
  score: number
  reason: 'term' | 'fuzzy' | 'intent'
}

export type PredictiveSearchAnalysis = {
  originalTerm?: string
  normalizedTerm: string
  correctedTerm?: string
  productTerm?: string
  budgetMax?: number
  navigationOnly: boolean
  intents: SearchIntentSignal[]
  suggestions: PredictiveSearchSuggestion[]
}

const STOP_WORDS = new Set([
  'de', 'het', 'een', 'en', 'of', 'voor', 'van', 'met', 'naar', 'om', 'op', 'in', 'bij', 'mijn', 'je', 'ik',
  'zoek', 'zoeken', 'vind', 'vinden', 'nodig', 'kopen', 'koop', 'beste', 'best', 'goede', 'goed', 'goedkoop',
  'goedkope', 'aanbieding', 'aanbiedingen', 'online',
])

const GENERIC_NAVIGATION_WORDS = new Set([
  'cadeau', 'cadeaus', 'gift', 'gifts', 'geschenk', 'geschenken', 'feest', 'feestje',
])

const BUDGET_WORDS = new Set(['onder', 'tot', 'max', 'maximaal', 'beneden', 'budget', 'euro', 'eur'])

const intentRules: Array<{
  key: Exclude<SearchIntentKey, 'budget'>
  label: string
  description: string
  triggers: readonly string[]
  strip: readonly string[]
}> = [
  {
    key: 'study',
    label: 'Voor studie',
    description: 'Winkelnu herkent dat je iets zoekt voor school, studie of studentenwerk.',
    triggers: ['studie', 'student', 'studenten', 'school', 'college', 'universiteit'],
    strip: ['studie', 'student', 'studenten', 'school', 'college', 'universiteit'],
  },
  {
    key: 'work',
    label: 'Voor werk',
    description: 'Winkelnu herkent een werk- of thuiswerkcontext.',
    triggers: ['werk', 'werken', 'thuiswerk', 'thuiswerken', 'kantoorwerk'],
    strip: ['werk', 'werken', 'thuiswerk', 'thuiswerken', 'kantoorwerk'],
  },
  {
    key: 'hand-luggage',
    label: 'Handbagage & vliegen',
    description: 'Winkelnu herkent dat formaat en reisgebruik waarschijnlijk belangrijk zijn.',
    triggers: ['handbagage', 'cabinebagage', 'carry on', 'carryon', 'vliegtuig', 'vliegen'],
    strip: ['handbagage', 'cabinebagage', 'carry', 'on', 'carryon', 'vliegtuig', 'vliegen'],
  },
  {
    key: 'gift-father',
    label: 'Cadeau voor vader',
    description: 'Winkelnu kan cadeau-inspiratie voor hem en Vaderdag tonen.',
    triggers: ['vader', 'papa', 'pap'],
    strip: ['vader', 'papa', 'pap'],
  },
  {
    key: 'gift-mother',
    label: 'Cadeau voor moeder',
    description: 'Winkelnu kan cadeau-inspiratie voor haar en Moederdag tonen.',
    triggers: ['moeder', 'mama', 'mam'],
    strip: ['moeder', 'mama', 'mam'],
  },
  {
    key: 'gift-child',
    label: 'Cadeau voor kinderen',
    description: 'Winkelnu kan cadeau-inspiratie voor kinderen tonen.',
    triggers: ['kind', 'kinderen', 'jongen', 'meisje'],
    strip: ['kind', 'kinderen', 'jongen', 'meisje'],
  },
  {
    key: 'birthday',
    label: 'Verjaardag',
    description: 'Winkelnu herkent een verjaardag als cadeau- of feestmoment.',
    triggers: ['verjaardag', 'jarig', 'birthday'],
    strip: ['verjaardag', 'jarig', 'birthday'],
  },
  {
    key: 'christmas',
    label: 'Kerst',
    description: 'Winkelnu herkent Kerst als cadeau- of feestmoment.',
    triggers: ['kerst', 'kerstmis', 'christmas', 'xmas'],
    strip: ['kerst', 'kerstmis', 'christmas', 'xmas'],
  },
  {
    key: 'valentine',
    label: 'Valentijn',
    description: 'Winkelnu herkent Valentijn als cadeau- of feestmoment.',
    triggers: ['valentijn', 'valentijnsdag', 'valentine'],
    strip: ['valentijn', 'valentijnsdag', 'valentine'],
  },
  {
    key: 'gift',
    label: 'Cadeau-inspiratie',
    description: 'Winkelnu herkent dat inspiratie over meerdere productcategorieën nuttiger kan zijn dan één vaste categorie.',
    triggers: ['cadeau', 'cadeaus', 'gift', 'gifts', 'geschenk', 'geschenken'],
    strip: [],
  },
]

const intentTargetBoosts: Partial<Record<SearchIntentKey, readonly string[]>> = {
  study: ['/categorie/laptops-computers', '/categorie/kantoor-studie', '/koopgidsen/laptop-kopen'],
  work: ['/categorie/kantoor-studie', '/categorie/laptops-computers'],
  'hand-luggage': ['/categorie/koffers', '/categorie/reisaccessoires', '/categorie/reizen-bagage'],
  gift: ['/collecties/cadeaus-feest'],
  'gift-father': ['/collecties/cadeaus-feest#cadeaus-voor-hem', '/collecties/cadeaus-feest#moederdag-vaderdag'],
  'gift-mother': ['/collecties/cadeaus-feest#cadeaus-voor-haar', '/collecties/cadeaus-feest#moederdag-vaderdag'],
  'gift-child': ['/collecties/cadeaus-feest#cadeaus-voor-kinderen'],
  birthday: ['/collecties/cadeaus-feest#verjaardag'],
  christmas: ['/collecties/cadeaus-feest#kerst'],
  valentine: ['/collecties/cadeaus-feest#valentijn'],
}

export function normalizeSearchText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('nl-NL')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function damerauLevenshtein(a: string, b: string): number {
  if (a === b) return 0
  if (!a) return b.length
  if (!b) return a.length

  const matrix = Array.from({ length: a.length + 1 }, () => Array<number>(b.length + 1).fill(0))
  for (let i = 0; i <= a.length; i += 1) matrix[i][0] = i
  for (let j = 0; j <= b.length; j += 1) matrix[0][j] = j

  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost,
      )

      if (
        i > 1
        && j > 1
        && a[i - 1] === b[j - 2]
        && a[i - 2] === b[j - 1]
      ) {
        matrix[i][j] = Math.min(matrix[i][j], matrix[i - 2][j - 2] + 1)
      }
    }
  }

  return matrix[a.length][b.length]
}

function fuzzyThreshold(token: string): number {
  if (token.length < 4) return 0
  if (token.length <= 8) return 1
  return 2
}

function vocabularyFromIndex(index: readonly PredictiveSearchIndexItem[]): string[] {
  const vocabulary = new Set<string>()
  for (const item of index) {
    for (const raw of [item.title, ...item.terms]) {
      for (const token of normalizeSearchText(raw).split(' ')) {
        if (token.length >= 4 && !STOP_WORDS.has(token)) vocabulary.add(token)
      }
    }
  }
  return [...vocabulary]
}

function correctToken(token: string, vocabulary: readonly string[]): string {
  if (token.length < 4 || vocabulary.includes(token)) return token
  const threshold = fuzzyThreshold(token)
  if (threshold === 0) return token

  let best = token
  let bestDistance = Number.POSITIVE_INFINITY
  let ties = 0

  for (const candidate of vocabulary) {
    if (Math.abs(candidate.length - token.length) > threshold) continue
    if (candidate[0] !== token[0]) continue
    const distance = damerauLevenshtein(token, candidate)
    if (distance < bestDistance) {
      best = candidate
      bestDistance = distance
      ties = 1
    } else if (distance === bestDistance) {
      ties += 1
    }
  }

  return bestDistance <= threshold && ties === 1 ? best : token
}

function detectBudget(original: string): number | undefined {
  const normalized = original.toLocaleLowerCase('nl-NL').replace(/\s+/g, ' ')
  const match = normalized.match(/(?:onder|tot|max|maximaal|beneden|budget(?:\s+van)?)\s*(?:€|eur\s*|euro\s*)?(\d{1,5}(?:[.,]\d{1,2})?)/i)
  if (!match) return undefined
  const value = Number(match[1].replace(',', '.'))
  return Number.isFinite(value) && value >= 0 ? value : undefined
}

function containsPhrase(normalized: string, trigger: string): boolean {
  const needle = normalizeSearchText(trigger)
  if (!needle) return false
  return ` ${normalized} `.includes(` ${needle} `)
}

function detectIntents(normalized: string, original: string): SearchIntentSignal[] {
  const signals: SearchIntentSignal[] = []
  const hasGiftWord = ['cadeau', 'cadeaus', 'gift', 'gifts', 'geschenk', 'geschenken'].some((word) => containsPhrase(normalized, word))

  for (const rule of intentRules) {
    const triggered = rule.triggers.some((trigger) => containsPhrase(normalized, trigger))
    if (!triggered) continue

    if ((rule.key === 'gift-father' || rule.key === 'gift-mother' || rule.key === 'gift-child') && !hasGiftWord) continue

    signals.push({ key: rule.key, label: rule.label, description: rule.description })
  }

  const budgetMax = detectBudget(original)
  if (budgetMax != null) {
    signals.push({
      key: 'budget',
      label: `Budget tot €${new Intl.NumberFormat('nl-NL', { maximumFractionDigits: 2 }).format(budgetMax)}`,
      description: 'Winkelnu herkent je budget. De prijsfilter wordt pas automatisch toepasbaar zodra gecontroleerde winkelprijzen beschikbaar zijn.',
    })
  }

  return signals.filter((signal, index, all) => all.findIndex((candidate) => candidate.key === signal.key) === index)
}

function stripProductContext(corrected: string, intents: readonly SearchIntentSignal[], budgetMax?: number): string | undefined {
  const stripWords = new Set(STOP_WORDS)

  for (const signal of intents) {
    const rule = intentRules.find((candidate) => candidate.key === signal.key)
    for (const word of rule?.strip ?? []) stripWords.add(word)
  }

  if (budgetMax != null) {
    for (const word of BUDGET_WORDS) stripWords.add(word)
  }

  const tokens = corrected.split(' ').filter(Boolean)
  const filtered = tokens.filter((token, index) => {
    if (stripWords.has(token)) return false
    if (budgetMax != null && /^\d+(?:[.,]\d+)?$/.test(token)) return false
    if (budgetMax != null && index > 0 && BUDGET_WORDS.has(tokens[index - 1])) return false
    return true
  })

  const meaningful = filtered.filter((token) => !GENERIC_NAVIGATION_WORDS.has(token))
  if (meaningful.length === 0) return undefined
  return meaningful.join(' ')
}

function termScore(query: string, item: PredictiveSearchIndexItem): { score: number; reason: 'term' | 'fuzzy' } {
  if (!query) return { score: 0, reason: 'term' }
  const queryTokens = query.split(' ').filter((token) => token.length >= 2)
  let best = 0
  let fuzzy = false

  for (const raw of [item.title, ...item.terms]) {
    const value = normalizeSearchText(raw)
    if (!value) continue
    if (value === query) best = Math.max(best, 130)
    else if (value.startsWith(query) || query.startsWith(value)) best = Math.max(best, 108)
    else if (value.includes(query) || query.includes(value)) best = Math.max(best, 92)
    else {
      const candidateTokens = value.split(' ')
      const exactCoverage = queryTokens.filter((token) => candidateTokens.some((candidate) => candidate === token || candidate.startsWith(token))).length
      if (queryTokens.length > 0 && exactCoverage === queryTokens.length) best = Math.max(best, 78)
      else if (exactCoverage > 0) best = Math.max(best, 44 + exactCoverage * 8)

      const fuzzyCoverage = queryTokens.filter((token) => {
        const threshold = fuzzyThreshold(token)
        return threshold > 0 && candidateTokens.some((candidate) => candidate[0] === token[0] && damerauLevenshtein(token, candidate) <= threshold)
      }).length
      if (queryTokens.length > 0 && fuzzyCoverage === queryTokens.length) {
        best = Math.max(best, 68)
        fuzzy = true
      }
    }
  }

  return { score: best, reason: fuzzy && best <= 68 ? 'fuzzy' : 'term' }
}

function intentBoost(item: PredictiveSearchIndexItem, intents: readonly SearchIntentSignal[]): number {
  let boost = 0
  for (const intent of intents) {
    const targets = intentTargetBoosts[intent.key] ?? []
    const targetIndex = targets.indexOf(item.href)
    if (targetIndex >= 0) boost = Math.max(boost, 86 - targetIndex * 8)
  }
  return boost
}

export function analyzePredictiveSearch(
  term: string | undefined,
  index: readonly PredictiveSearchIndexItem[],
  limit = 7,
): PredictiveSearchAnalysis {
  const originalTerm = term?.trim() || undefined
  const normalizedTerm = normalizeSearchText(originalTerm ?? '')
  if (!normalizedTerm) {
    return {
      originalTerm,
      normalizedTerm: '',
      navigationOnly: false,
      intents: [],
      suggestions: [],
    }
  }

  const vocabulary = vocabularyFromIndex(index)
  const correctedTokens = normalizedTerm.split(' ').map((token) => {
    if (STOP_WORDS.has(token) || BUDGET_WORDS.has(token) || /^\d/.test(token)) return token
    return correctToken(token, vocabulary)
  })
  const corrected = correctedTokens.join(' ')
  const correctedTerm = corrected !== normalizedTerm ? corrected : undefined
  const intents = detectIntents(corrected, originalTerm ?? '')
  const budgetMax = detectBudget(originalTerm ?? '')
  const productTerm = stripProductContext(corrected, intents, budgetMax)
  const navigationOnly = !productTerm && intents.some((intent) => intent.key.startsWith('gift') || ['birthday', 'christmas', 'valentine'].includes(intent.key))

  const suggestions = index
    .map((item) => {
      const fullTermMatch = termScore(corrected, item)
      const productMatch = productTerm && productTerm !== corrected ? termScore(productTerm, item) : { score: 0, reason: 'term' as const }
      const semanticBoost = intentBoost(item, intents)
      const baseScore = Math.max(fullTermMatch.score, productMatch.score + (productMatch.score > 0 ? 8 : 0))
      const score = Math.max(baseScore, semanticBoost) + (item.boost ?? 0)
      const reason: PredictiveSearchSuggestion['reason'] = semanticBoost > baseScore
        ? 'intent'
        : (fullTermMatch.reason === 'fuzzy' || productMatch.reason === 'fuzzy' ? 'fuzzy' : 'term')

      return { item, score, reason }
    })
    .filter(({ score }) => score >= 44)
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title, 'nl-NL'))
    .filter(({ item }, position, all) => all.findIndex((candidate) => candidate.item.href === item.href) === position)
    .slice(0, Math.max(1, limit))
    .map(({ item, score, reason }) => ({
      kind: item.kind,
      eyebrow: item.eyebrow,
      title: item.title,
      description: item.description,
      href: item.href,
      score,
      reason,
    }))

  return {
    originalTerm,
    normalizedTerm,
    correctedTerm,
    productTerm,
    budgetMax,
    navigationOnly,
    intents,
    suggestions,
  }
}
