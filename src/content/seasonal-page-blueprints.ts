export type SeasonalPlannerRoute = {
  label: string
  title: string
  description: string
  href: string
}

export type SeasonalBudgetTier = {
  label: string
  title: string
  description: string
  examples: readonly string[]
}

export type SeasonalChecklistItem = {
  title: string
  description: string
}

export type SeasonalSearchRoute = {
  label: string
  description: string
  query: string
}

export type SeasonalPageBlueprint = {
  heroCtaLabel: string
  planner: {
    eyebrow: string
    title: string
    description: string
    routes: readonly SeasonalPlannerRoute[]
  }
  budget: {
    eyebrow: string
    title: string
    description: string
    disclaimer: string
    tiers: readonly SeasonalBudgetTier[]
  }
  checklist: {
    eyebrow: string
    title: string
    description: string
    items: readonly SeasonalChecklistItem[]
  }
  search: {
    enabled: boolean
    eyebrow: string
    title: string
    description: string
    routes: readonly SeasonalSearchRoute[]
  }
}

const halloweenBlueprint = {
  heroCtaLabel: 'Plan je Halloween ↓',
  planner: {
    eyebrow: '✦ Begin bij je plan',
    title: 'Wat voor Halloween wil je maken?',
    description:
      'Begin niet bij losse producten, maar bij het moment dat je wilt creëren. Kies je plan en ga daarna gericht naar de relevante Winkelnu-rubrieken.',
    routes: [
      {
        label: 'Thuis vieren',
        title: 'Een sfeervolle Halloween-avond',
        description: 'Bouw eerst de basis met licht en decoratie en voeg daarna kleinere accenten toe.',
        href: '#decoratie-sfeer',
      },
      {
        label: 'Verkleden',
        title: 'Een look die als geheel klopt',
        description: 'Combineer kleding, accessoires en verzorging in plaats van alles los te kiezen.',
        href: '#verkleden-accessoires',
      },
      {
        label: 'Met kinderen',
        title: 'Spelen, maken en samen beleven',
        description: 'Kies voor creatieve activiteiten, spel en decoratie die bij de leeftijd en het moment passen.',
        href: '#spel-creatief',
      },
      {
        label: 'Buiten & entree',
        title: 'Maak de eerste indruk buiten',
        description: 'Werk met zichtbare sfeermakers en verlichting die geschikt zijn voor de plek waar je ze gebruikt.',
        href: '#licht-techniek',
      },
    ],
  },
  budget: {
    eyebrow: '✦ Budget als startpunt',
    title: 'Bepaal eerst hoeveel Halloween je wilt toevoegen.',
    description:
      'Een sterk thema hoeft niet uit veel losse aankopen te bestaan. Kies een budgetniveau en besteed het vooral aan onderdelen die samen één geheel vormen.',
    disclaimer: 'De bedragen zijn richtbedragen voor je planning, geen actuele prijs- of beschikbaarheidsbelofte.',
    tiers: [
      {
        label: 'Tot €15',
        title: 'Kleine sfeermakers',
        description: 'Geschikt als je met een paar details al duidelijk Halloween wilt laten voelen.',
        examples: ['Tafeldecoratie', 'Kleine accessoires', 'Knutselmateriaal'],
      },
      {
        label: '€15–€40',
        title: 'Een complete hoek of look',
        description: 'Handig voor een verkleedlook, een thematische tafel of een compacte sfeerset.',
        examples: ['Kostuumaccessoires', 'Verlichting', 'Spel of creatieve set'],
      },
      {
        label: '€40+',
        title: 'Grotere blikvangers',
        description: 'Voor herbruikbare decoratie of meerdere onderdelen die samen een grotere setting vormen.',
        examples: ['Herbruikbare decoratie', 'Slimme sfeerverlichting', 'Meerdere items binnen één thema'],
      },
    ],
  },
  checklist: {
    eyebrow: '✦ Slim kiezen',
    title: 'Vier checks vóór je iets toevoegt aan je Halloweenplan.',
    description:
      'Een korte controle voorkomt miskopen en helpt je om decoratie, verlichting en verkleding vaker dan één avond te gebruiken.',
    items: [
      {
        title: 'Binnen of buiten?',
        description: 'Controleer bij verlichting en decoratie of het product bedoeld is voor de plek waar je het wilt gebruiken.',
      },
      {
        title: 'Kan het volgend jaar weer?',
        description: 'Een paar stevige, neutrale basisstukken zijn vaak slimmer dan veel eenmalige decoratie.',
      },
      {
        title: 'Past en blijft het zichtbaar?',
        description: 'Let bij verkleding op pasvorm, bewegingsvrijheid en zichtbaarheid, zeker wanneer je buiten op pad gaat.',
      },
      {
        title: 'Licht liever zonder open vuur',
        description: 'Rond stoffen, kinderen of huisdieren zijn LED-kaarsen en andere vlamvrije sfeermakers meestal de praktischere keuze.',
      },
    ],
  },
  search: {
    enabled: false,
    eyebrow: '✦ Gericht producten ontdekken',
    title: 'Zoek vanuit je Halloweenplan verder.',
    description:
      'Gebruik de productzoeker om verschillende typen producten naast elkaar te bekijken. Zodra passende partnerdata beschikbaar is, kan Winkelnu hier actuele productselecties, winkelprijzen en aanbiedingen aan koppelen.',
    routes: [
      { label: 'Halloween decoratie', description: 'Sfeer voor tafel, kamer, tuin of entree.', query: 'halloween decoratie' },
      { label: 'Kostuum & accessoires', description: 'Verkleden, details en bijpassende accessoires.', query: 'halloween kostuum accessoires' },
      { label: 'Halloween verlichting', description: 'Licht en technische sfeermakers.', query: 'halloween verlichting' },
      { label: 'Spel & knutselen', description: 'Creatieve ideeën voor kinderen en samen thuis.', query: 'halloween knutselen speelgoed' },
    ],
  },
} as const satisfies SeasonalPageBlueprint

const seasonalPageBlueprints: Record<string, SeasonalPageBlueprint> = {
  halloween: halloweenBlueprint,
}

export function getSeasonalPageBlueprint(collectionSlug: string): SeasonalPageBlueprint | undefined {
  return seasonalPageBlueprints[collectionSlug]
}
