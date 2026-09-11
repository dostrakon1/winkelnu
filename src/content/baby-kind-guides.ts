import type { BuyingGuide } from './koopgidsen'

export const babyKindEditorialCategory = {
  slug: 'baby-kind',
  title: 'Baby & kind',
  description: 'Praktische keuzehulp voor producten rond onderweg zijn, slapen, veiligheid en de dagelijkse verzorging van jonge kinderen.',
  intro: 'Bij baby- en kinderproducten wegen veiligheid, leeftijd, formaat en praktisch dagelijks gebruik vaak zwaarder dan extra functies. Begin bij de leeftijd en situatie waarin je een product gebruikt en controleer bij veiligheidsproducten altijd de actuele instructies en productspecificaties van het exacte model.',
  topics: ['Veiligheid en leeftijd', 'Dagelijks gebruik', 'Formaat en meenemen', 'Onderhoud en levensduur'],
} as const

export const babyKindBuyingGuides: BuyingGuide[] = [
  {
    slug: 'kinderwagen-kopen',
    category: 'baby-kind',
    title: 'Kinderwagen kopen: formaat, comfort en dagelijks gebruik',
    description: 'Kies een kinderwagen op basis van gebruikssituatie, formaat, inklappen, draagvermogen, remmen, harnas, opbergruimte en onderhoud.',
    intro: 'Een kinderwagen gebruik je vaak in heel verschillende situaties: op straat, in winkels, in het openbaar vervoer en in de auto. De beste keuze begint daarom bij waar je hem dagelijks gebruikt en hoeveel ruimte je hebt om hem te rijden, in te klappen en op te bergen.',
    updated: '2026-09-11',
    readingMinutes: 5,
    quickChoice: [
      {
        situation: 'Veel lopen in de stad en winkels',
        advice: 'Let op wendbaarheid, breedte, draaicirkel en of je de wagen eenvoudig met één hand kunt remmen en manoeuvreren.',
      },
      {
        situation: 'Vaak mee in auto of openbaar vervoer',
        advice: 'Controleer ingeklapt formaat, gewicht en of je hem praktisch kunt tillen zonder losse onderdelen die telkens verwijderd moeten worden.',
      },
      {
        situation: 'Langere wandelingen of ongelijke ondergrond',
        advice: 'Kijk naar wielmaat, vering, stabiliteit en of de fabrikant het model geschikt acht voor de ondergrond waarop jij hem wilt gebruiken.',
      },
    ],
    sections: [
      {
        heading: 'Begin bij je dagelijkse route',
        paragraphs: [
          'Meet doorgangen, lift, hal, kofferbak en andere plekken waar de kinderwagen vaak komt. Een model dat prettig rijdt maar nauwelijks in de auto of berging past kan in dagelijks gebruik alsnog onhandig zijn.',
          'Bedenk ook wie de wagen gebruikt. Verstelbare duwhoogte, bereikbare remmen en een logische vouwbeweging zijn vooral waardevol wanneer meerdere verzorgers ermee lopen.',
        ],
      },
      {
        heading: 'Veiligheid, remmen en harnas',
        paragraphs: [
          'Controleer bij het exacte model hoe remmen, vergrendelingen en het harnas werken en lees de gebruiksaanwijzing vóór het eerste gebruik. Gebruik de kinderwagen alleen voor leeftijden en gewichten die de fabrikant opgeeft.',
          'Een mand, tas of accessoire kan het zwaartepunt veranderen. Hang daarom geen zware spullen aan de duwstang als de fabrikant dat niet toestaat en gebruik alleen compatibele accessoires.',
        ],
      },
      {
        heading: 'Inklappen, tillen en opbergen',
        paragraphs: [
          'Vergelijk niet alleen het gewicht op papier, maar kijk ook hoe de kinderwagen wordt opgetild en of het frame na inklappen zelfstandig blijft staan. Een compact pakket kan vooral waardevol zijn in kleine auto’s, appartementen en druk openbaar vervoer.',
          'Controleer welke onderdelen moeten worden verwijderd voordat de wagen inklapt en hoeveel ruimte reiswieg, zitje of andere onderdelen apart innemen.',
        ],
      },
      {
        heading: 'Onderhoud, slijtage en productveiligheid',
        paragraphs: [
          'Wielen, remmen, scharnieren en bevestigingen krijgen veel belasting. Controleer ze regelmatig volgens de onderhoudsinstructies en stop met gebruiken wanneer een onderdeel beschadigd, los of vervormd is.',
          'Bij tweedehands aankoop is het belangrijk dat model, handleiding en historie voldoende duidelijk zijn. Controleer daarnaast of er veiligheidswaarschuwingen of terugroepacties voor het exacte product zijn gepubliceerd.',
        ],
      },
    ],
    checklist: [
      'Meet hal, lift, kofferbak en opbergruimte.',
      'Controleer leeftijds- en gewichtsgrenzen van het exacte model.',
      'Probeer rem, harnas en vouwmechanisme te begrijpen vóór aankoop.',
      'Vergelijk gewicht én ingeklapt formaat.',
      'Controleer welke accessoires officieel compatibel zijn.',
      'Kijk bij aankoop en later gebruik naar veiligheidswaarschuwingen of terugroepacties.',
    ],
    sources: [
      {
        title: 'Your Europe — Productveiligheid',
        url: 'https://europa.eu/youreurope/citizens/consumers/shopping/product-safety/index_nl.htm',
        note: 'Europese consumenteninformatie over veilige producten, waarschuwingen en terugroepacties.',
      },
      {
        title: 'Europese Commissie — Product safety',
        url: 'https://commission.europa.eu/topics/business-and-industry/product-safety_en',
        note: 'Officiële informatie over de General Product Safety Regulation en Safety Gate voor gevaarlijke non-foodproducten.',
      },
    ],
  },
  {
    slug: 'babyfoon-kopen',
    category: 'baby-kind',
    title: 'Babyfoon kopen: bereik, beeld en privacy',
    description: 'Kies een babyfoon op basis van audio of video, bereik, verbinding, meldingen, accuduur, plaatsing, updates en privacy.',
    intro: 'Een babyfoon moet vooral betrouwbaar passen bij de woning en manier waarop je hem gebruikt. Bij modellen die met wifi, een app of de cloud werken tellen naast beeld en bereik ook software-updates, accountbeveiliging en privacy mee.',
    updated: '2026-09-11',
    readingMinutes: 5,
    quickChoice: [
      {
        situation: 'Je wilt vooral geluid horen',
        advice: 'Een eenvoudige audio-babyfoon kan voldoende zijn wanneer bereik, storingsvrij gebruik en duidelijke waarschuwingen voor jouw woning belangrijker zijn dan video.',
      },
      {
        situation: 'Je wilt ook beeld zien',
        advice: 'Kijk naar nachtbeeld, schermgrootte of app-weergave en vooral of camera en kabels veilig en stabiel geplaatst kunnen worden.',
      },
      {
        situation: 'Je wilt op afstand via internet meekijken',
        advice: 'Controleer updatebeleid, privacyverklaring, accountbeveiliging en of functies via internet echt nodig zijn voor jouw gebruik.',
      },
    ],
    sections: [
      {
        heading: 'Audio, video en verbinding',
        paragraphs: [
          'Babyfoons kunnen rechtstreeks met een ouderunit communiceren of via wifi en een app werken. Een internetverbinding kan extra functies geven, maar maakt het apparaat ook afhankelijk van netwerk, app en online dienst.',
          'Bepaal vooraf wat je echt nodig hebt: geluid, beeld, terugspreken of waarschuwingen. Meer functies zijn niet automatisch nuttiger wanneer de basisverbinding voor jouw woning minder betrouwbaar wordt.',
        ],
      },
      {
        heading: 'Bereik, stroom en waarschuwingen',
        paragraphs: [
          'Praktisch bereik hangt af van muren, verdiepingen, storing en de gebruikte verbindingstechniek. Kijk daarom niet alleen naar een maximale afstand op de verpakking, maar controleer ook wat de fabrikant zegt over gebruik binnenshuis.',
          'Let op waarschuwingen voor lege accu, verbroken verbinding en eventueel buiten bereik raken. Bij een ouderunit is accuduur vooral relevant wanneer je die vaak door het huis meeneemt.',
        ],
      },
      {
        heading: 'Plaatsing en dagelijks veilig gebruik',
        paragraphs: [
          'Plaats camera, kabels en voedingen zo dat een kind er niet bij kan en volg de montage- en afstandsinstructies van het exacte model. Gebruik geen improvisaties met kabels, klemmen of accessoires die de fabrikant niet ondersteunt.',
          'Controleer regelmatig of bevestiging, kabel en adapter nog onbeschadigd zijn. Een goed beeld is minder belangrijk dan een stabiele en veilige plaatsing.',
        ],
      },
      {
        heading: 'Privacy, wachtwoorden en updates',
        paragraphs: [
          'Een slimme babyfoon kan informatie over je huis en omgeving verwerken. Lees daarom vóór aankoop de privacyverklaring en controleer hoe lang de fabrikant ondersteuning en beveiligingsupdates verwacht te leveren.',
          'Gebruik unieke sterke wachtwoorden, installeer software- en app-updates en schakel internettoegang uit wanneer je die functie niet nodig hebt. Controleer ook welke gebruikers toegang tot camera of account hebben.',
        ],
      },
    ],
    checklist: [
      'Bepaal of audio, video of internettoegang echt nodig is.',
      'Controleer bereik en waarschuwingen voor jouw woning.',
      'Bekijk accuduur en stroomvoorziening van ouderunit en camera.',
      'Plan een veilige plaats voor camera, kabels en adapter.',
      'Controleer updatebeleid, privacyverklaring en accountbeveiliging.',
      'Gebruik sterke wachtwoorden en voer beveiligingsupdates tijdig uit.',
    ],
    sources: [
      {
        title: 'Rijksoverheid — Hoe kan ik slimme apparaten veilig gebruiken?',
        url: 'https://www.rijksoverheid.nl/vraag-en-antwoord/bescherming-van-consumenten/hoe-kan-ik-slimme-apparaten-veilig-gebruiken',
        note: 'Praktische overheidsinformatie over privacy, sterke wachtwoorden en updates bij slimme apparaten.',
      },
      {
        title: 'NCSC — Basisbeveiligingsmaatregelen slimme apparaten',
        url: 'https://www.ncsc.nl/edge-devices/basisbeveiligingsmaatregelen-slimme-apparaten',
        note: 'Achtergrond over risico’s en basismaatregelen voor met internet verbonden apparaten.',
      },
    ],
  },
  {
    slug: 'autostoeltje-kiezen',
    category: 'baby-kind',
    title: 'Autostoeltje kiezen: maat, bevestiging en veiligheid',
    description: 'Kies een autostoeltje op basis van lengte van het kind, R129-goedkeuring, voertuigcompatibiliteit, bevestiging, rijrichting en correcte installatie.',
    intro: 'Bij een autostoeltje staat veiligheid voorop. Het juiste zitje moet passen bij het kind én bij de auto, correct worden geïnstalleerd en volgens de actuele instructies worden gebruikt. Beoordeel daarom nooit alleen prijs, merk of uiterlijk.',
    updated: '2026-09-11',
    readingMinutes: 6,
    quickChoice: [
      {
        situation: 'Je kiest een eerste zitje voor een baby',
        advice: 'Controleer de toegestane lengterange, achterwaarts gebruik, de actuele R129-markering en of het zitje aantoonbaar in jouw auto past.',
      },
      {
        situation: 'Je stapt over naar een groter zitje',
        advice: 'Gebruik lengte en de grenzen van het huidige en nieuwe zitje als uitgangspunt; stap niet alleen over omdat een bepaalde leeftijd is bereikt.',
      },
      {
        situation: 'Je gebruikt meerdere auto’s',
        advice: 'Controleer voor iedere auto afzonderlijk de goedgekeurde bevestigingsmethode, zitplaats en eventuele ISOFIX-compatibiliteit.',
      },
    ],
    sections: [
      {
        heading: 'Kies op kind én voertuig',
        paragraphs: [
          'Controleer de lengte- en gebruiksgrenzen van het exacte zitje en de compatibiliteitsinformatie van fabrikant en voertuig. Een zitje dat technisch in één auto past is niet automatisch geschikt voor iedere zitplaats of iedere andere auto.',
          'Probeer installatie en afstelling vóór aankoop wanneer dat mogelijk is. Let erop dat gordel, harnas en hoofdsteun volgens de handleiding correct kunnen worden ingesteld.',
        ],
      },
      {
        heading: 'R129, bevestiging en ISOFIX',
        paragraphs: [
          'Voor nieuwe aankopen is de actuele R129-regelgeving het relevante uitgangspunt. Controleer de markering van het exacte product en vertrouw niet alleen op een productnaam of algemene vermelding in een webshop.',
          'ISOFIX kan de bevestiging eenvoudiger en consistenter maken wanneer auto en zitje daarvoor geschikt zijn. Ook met ISOFIX blijft correcte montage volgens de handleiding noodzakelijk.',
        ],
      },
      {
        heading: 'Rijrichting en airbag',
        paragraphs: [
          'Volg de toegestane rijrichting en lengtegrenzen uit de handleiding. Europese veiligheidsregels stellen specifieke eisen aan achterwaarts en voorwaarts gebruik binnen R129.',
          'Gebruik een achterwaarts gericht zitje niet op een voorstoel met actieve airbag. Controleer voertuig- en zitjehandleiding voordat je een kinderzitje op de voorstoel plaatst.',
        ],
      },
      {
        heading: 'Tweedehands, slijtage en terugroepacties',
        paragraphs: [
          'Bij een tweedehands zitje moet de volledige historie betrouwbaar bekend zijn. Controleer model, goedkeuringslabel, handleiding, ontbrekende onderdelen en zichtbare schade en volg het advies van de fabrikant bij twijfel of na een ongeval.',
          'Controleer veiligheidswaarschuwingen en terugroepacties voor het exacte model. Recente Europese marktcontroles laten zien waarom markering, instructies en naleving van R129 niet als vanzelfsprekend moeten worden aangenomen.',
        ],
      },
    ],
    checklist: [
      'Controleer de lengterange en R129-markering van het exacte zitje.',
      'Controleer voertuig- en zitplaatscompatibiliteit.',
      'Volg de juiste bevestigingsmethode en installatie-instructies.',
      'Gebruik de voorgeschreven rijrichting voor de lengte van het kind.',
      'Controleer de airbagstatus bij gebruik op de voorstoel.',
      'Controleer historie, schade en eventuele terugroepacties bij een tweedehands zitje.',
    ],
    sources: [
      {
        title: 'European Commission — Children and road safety',
        url: 'https://road-safety.transport.ec.europa.eu/eu-road-safety-policy/priorities/safe-road-use/children_en',
        note: 'Officiële EU-informatie over kinderbeveiligingssystemen, lengte en veilig gebruik in voertuigen.',
      },
      {
        title: 'European Commission — EU testing of child car seats reveals multiple failures',
        url: 'https://single-market-economy.ec.europa.eu/news/eu-testing-child-car-seats-reveals-multiple-failures-2026-04-01_en',
        note: 'Recente EU-marktcontrole met aanbevelingen over R129, markering, installatie en voertuigcompatibiliteit.',
      },
    ],
  },
]
