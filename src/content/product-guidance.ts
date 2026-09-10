import type { ProductVisualKind } from '@/domain/catalog/types'
import { getBuyingGuide } from './koopgidsen-public'

export type ProductGuidance = {
  heading: string
  points: readonly [string, string, string]
  guideSlug?: string
}

export const productGuidanceByVisualKind = {
  laptop: {
    heading: 'Waar let je op bij een laptop?',
    points: [
      'Kijk eerst naar je zwaarste dagelijkse taken en kies processor, werkgeheugen en opslag daarop.',
      'Let op scherm, toetsenbord, gewicht en accuduur als je de laptop veel onderweg gebruikt.',
      'Controleer aansluitingen, besturingssysteem en compatibiliteit met je bestaande accessoires en software.',
    ],
    guideSlug: 'laptop-kopen',
  },
  headphones: {
    heading: 'Waar let je op bij een hoofdtelefoon?',
    points: [
      'Draagcomfort en pasvorm zijn belangrijk als je langere tijd achter elkaar luistert.',
      'Vergelijk noise cancelling, microfoon en verbinding op basis van hoe en waar je de hoofdtelefoon gebruikt.',
      'Controleer accuduur, bedrade mogelijkheden en of oorkussens of andere onderdelen vervangbaar zijn.',
    ],
    guideSlug: 'hoofdtelefoon-kopen',
  },
  tablet: {
    heading: 'Waar let je op bij een tablet?',
    points: [
      'Kies schermformaat en opslag op basis van lezen, video, studie, creatief werk of onderweg gebruik.',
      'Controleer accuduur, aansluitingen en ondersteuning voor toetsenbord, stylus of andere accessoires.',
      'Let op besturingssysteem, updatebeleid en compatibiliteit met apps en apparaten die je al gebruikt.',
    ],
  },
  mouse: {
    heading: 'Waar let je op bij een computermuis?',
    points: [
      'Vorm, formaat en gewicht moeten passen bij je hand en de manier waarop je de muis vasthoudt.',
      'Controleer of Bluetooth, een USB-ontvanger of bekabeld gebruik past bij je apparaten en werkplek.',
      'Let op batterijduur, programmeerbare knoppen en soepel wisselen tussen apparaten als je dat nodig hebt.',
    ],
  },
  'stick-vacuum': {
    heading: 'Waar let je op bij een steelstofzuiger?',
    points: [
      'Kijk naar gewicht, accuduur en hoe prettig het apparaat is bij trappen en snel tussendoor schoonmaken.',
      'Controleer welke vloerzuigmonden worden meegeleverd en of ze passen bij jouw harde vloeren en tapijt.',
      'Let op stofreservoir, filters, onderhoud en de kosten en beschikbaarheid van vervangbare onderdelen.',
    ],
    guideSlug: 'stofzuiger-kopen',
  },
  'canister-vacuum': {
    heading: 'Waar let je op bij een sledestofzuiger?',
    points: [
      'Controleer bereik, gewicht en wendbaarheid in de kamers en op de vloeren die je meestal schoonmaakt.',
      'Kijk welke zuigmonden en instellingen geschikt zijn voor jouw combinatie van harde vloer, tapijt en meubels.',
      'Let op stofzak of opvang, filters, geluid en de terugkerende kosten van onderhoudsartikelen.',
    ],
    guideSlug: 'stofzuiger-kopen',
  },
  'smart-lighting': {
    heading: 'Waar let je op bij slimme verlichting?',
    points: [
      'Controleer fitting, lichtopbrengst en kleurmogelijkheden voor de ruimte waarin je de lampen gebruikt.',
      'Kijk of een bridge nodig is en of het systeem samenwerkt met je bestaande smart-homeplatform.',
      'Let op app-ondersteuning, lokale bediening en wat er gebeurt als internet of de clouddienst niet beschikbaar is.',
    ],
  },
  'washing-machine': {
    heading: 'Waar let je op bij een wasmachine?',
    points: [
      'Stem het vulgewicht af op je huishouden in plaats van standaard voor de grootste trommel te kiezen.',
      'Vergelijk energielabel, waterverbruik en programmaduur op het exacte model.',
      'Controleer afmetingen, geluid, onderhoud en de plaats waar de machine daadwerkelijk komt te staan.',
    ],
    guideSlug: 'wasmachine-kopen',
  },
  airfryer: {
    heading: 'Waar let je op bij een airfryer?',
    points: [
      'Kies de bruikbare mandinhoud op basis van je normale porties en niet alleen op het opgegeven aantal liters.',
      'Vergelijk temperatuurregeling, voorverwarmen en praktische bereidingsruimte voor wat je vaak maakt.',
      'Let op schoonmaakgemak, formaat op het aanrecht en energiegebruik bij jouw normale bereidingen.',
    ],
    guideSlug: 'airfryer-kopen',
  },
  'dual-airfryer': {
    heading: 'Waar let je op bij een dual-zone airfryer?',
    points: [
      'Controleer de inhoud van beide manden afzonderlijk en of je normale porties er daadwerkelijk in passen.',
      'Kijk hoe temperatuur, tijd en synchronisatie tussen beide zones worden geregeld.',
      'Let op totale buitenmaat, schoonmaakgemak en het vermogen dat nodig is wanneer beide zones tegelijk draaien.',
    ],
    guideSlug: 'airfryer-kopen',
  },
  'coffee-machine': {
    heading: 'Waar let je op bij een koffiemachine?',
    points: [
      'Begin bij het type koffie dat je meestal drinkt en hoeveel koppen je achter elkaar zet.',
      'Vergelijk bediening, opwarmtijd en mogelijkheden voor melk of handmatige instellingen alleen als je die gebruikt.',
      'Neem ontkalken, schoonmaken, bonen of capsules en andere terugkerende kosten mee in je keuze.',
    ],
    guideSlug: 'koffiezetapparaat-kopen',
  },
  'stand-mixer': {
    heading: 'Waar let je op bij een keukenmachine?',
    points: [
      'Bepaal of je vooral wilt kneden, mengen of kloppen en controleer de aanbevolen hoeveelheden daarvoor.',
      'Let op kominhoud, stabiliteit en hoeveel werkruimte je nodig hebt tijdens gebruik.',
      'Bekijk welke accessoires standaard meekomen en hoeveel ruimte en onderhoud extra hulpstukken vragen.',
    ],
    guideSlug: 'keukenmachine-kopen',
  },
  toothbrush: {
    heading: 'Waar let je op bij een elektrische tandenborstel?',
    points: [
      'Kijk vooral naar een comfortabele borstelkop, eenvoudige bediening en een poetsroutine die je dagelijks volhoudt.',
      'Controleer welke poetsstanden en druksensorfuncties voor jou daadwerkelijk nuttig zijn.',
      'Let op accuduur en de prijs en beschikbaarheid van passende vervangende opzetborstels.',
    ],
  },
  shaver: {
    heading: 'Waar let je op bij een scheerapparaat?',
    points: [
      'Kies het scheersysteem op basis van je huid, baardgroei en hoe vaak je je scheert.',
      'Controleer of droog en nat gebruik mogelijk is als dat bij je routine past.',
      'Let op schoonmaken, accuduur en de kosten van vervangende scheerkoppen of mesonderdelen.',
    ],
  },
  epilator: {
    heading: 'Waar let je op bij een epilator?',
    points: [
      'Controleer welke lichaamszones en gebruiksmethoden volgens de fabrikant voor het apparaat bedoeld zijn.',
      'Kijk naar snelheidsstanden, meegeleverde opzetstukken en ergonomie tijdens langer gebruik.',
      'Let op schoonmaak, nat of droog gebruik en hoe eenvoudig onderdelen kunnen worden vervangen.',
    ],
  },
  watch: {
    heading: 'Waar let je op bij een sporthorloge?',
    points: [
      'Kies sensoren en sportprofielen op basis van de activiteiten die je echt wilt meten.',
      'Vergelijk batterijduur in de gebruiksstand die bij jou past, bijvoorbeeld met GPS of always-on scherm.',
      'Let op draagcomfort, app-koppelingen, gegevensbeheer en welke functies een abonnement vereisen.',
    ],
    guideSlug: 'sporthorloge-kopen',
  },
  'fitness-band': {
    heading: 'Waar let je op bij een fitnessband?',
    points: [
      'Bepaal welke dagelijkse activiteit en trainingen je wilt volgen en welke metingen daarvoor relevant zijn.',
      'Let op draagcomfort, schermleesbaarheid en batterijduur als je de band dag en nacht wilt dragen.',
      'Controleer app-koppelingen, privacyinstellingen en welke functies zonder betaald abonnement beschikbaar blijven.',
    ],
    guideSlug: 'sporthorloge-kopen',
  },
  bottle: {
    heading: 'Waar let je op bij een drink- of thermosfles?',
    points: [
      'Kies inhoud en formaat op basis van hoeveel je meeneemt en waar de fles in moet passen.',
      'Controleer materiaal, sluiting en isolatie-eigenschappen voor warme of koude dranken.',
      'Let op lekbestendigheid, schoonmaakgemak en of doppen en afdichtingen vervangbaar zijn.',
    ],
  },
  tent: {
    heading: 'Waar let je op bij een tent?',
    points: [
      'Kies slaap- en leefruimte op basis van het aantal personen en hoeveel bagage binnen moet blijven.',
      'Vergelijk gewicht, pakmaat en opzettijd met de manier waarop je de tent vervoert en gebruikt.',
      'Let op ventilatie, materiaal en geschiktheid voor de weersomstandigheden waarin je meestal kampeert.',
    ],
    guideSlug: 'kampeertent-kopen',
  },
  mower: {
    heading: 'Waar let je op bij een grasmaaier?',
    points: [
      'Stem maaibreedte en aandrijving af op het oppervlak en de vorm van je gazon.',
      'Controleer maaihoogtes, opvang en hoe makkelijk je langs randen en smalle doorgangen komt.',
      'Let op accuplatform of kabel, onderhoud en hoeveel opslagruimte de maaier nodig heeft.',
    ],
    guideSlug: 'grasmaaier-kopen',
  },
  'robot-mower': {
    heading: 'Waar let je op bij een robotmaaier?',
    points: [
      'Controleer voor welk gazonoppervlak en welke hellingen het model volgens de fabrikant geschikt is.',
      'Kijk hoe grenzen, smalle doorgangen en obstakels worden gedetecteerd of ingesteld.',
      'Let op installatie, beveiliging, app-afhankelijkheid, onderhoud en opslag buiten het maaiseizoen.',
    ],
    guideSlug: 'grasmaaier-kopen',
  },
  'pressure-washer': {
    heading: 'Waar let je op bij een hogedrukreiniger?',
    points: [
      'Kies druk en wateropbrengst op basis van de oppervlakken die je werkelijk wilt schoonmaken.',
      'Controleer drukregeling en passende accessoires voor bijvoorbeeld terras, fiets of auto.',
      'Let op slanglengte, opslag, onderhoud en verantwoord watergebruik.',
    ],
    guideSlug: 'hogedrukreiniger-kopen',
  },
  drill: {
    heading: 'Waar let je op bij een accuboormachine?',
    points: [
      'Bepaal welke materialen en klussen je doet en kies koppel en toerental daarop.',
      'Let op gewicht, boorkop, koppelregeling en comfort bij langere montage- of boorklussen.',
      'Controleer het accuplatform en welke accu, lader, bits of boren daadwerkelijk worden meegeleverd.',
    ],
    guideSlug: 'accuboormachine-kopen',
  },
} satisfies Record<ProductVisualKind, ProductGuidance>

export function getProductGuidance(visualKind?: ProductVisualKind): (ProductGuidance & { guide?: ReturnType<typeof getBuyingGuide> }) | null {
  if (!visualKind) return null
  const guidance = productGuidanceByVisualKind[visualKind]
  return {
    ...guidance,
    guide: guidance.guideSlug ? getBuyingGuide(guidance.guideSlug) : undefined,
  }
}
