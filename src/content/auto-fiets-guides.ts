import type { BuyingGuide } from './koopgidsen'

export const autoFietsEditorialCategory = {
  slug: 'auto-fiets',
  title: 'Auto & fiets',
  description: 'Praktische keuzehulp voor accessoires en uitrusting waarmee je veiliger, comfortabeler en handiger onderweg bent.',
  intro: 'Bij auto- en fietsaccessoires draait een goede keuze vooral om compatibiliteit, veiligheid en dagelijks gebruiksgemak. Controleer daarom eerst of een product bij jouw voertuig, fiets of telefoon past en kijk daarna pas naar extra functies en prijs.',
  topics: ['Compatibiliteit en maatvoering', 'Veilig gebruik onderweg', 'Bevestiging en draagvermogen', 'Onderhoud en duurzaamheid'],
} as const

export const autoFietsBuyingGuides: BuyingGuide[] = [
  {
    slug: 'fietshelm-kopen',
    category: 'auto-fiets',
    title: 'Fietshelm kopen: pasvorm, type en veiligheid',
    description: 'Kies een fietshelm op basis van pasvorm, type fiets, keurmerk, ventilatie, gewicht, verstelmogelijkheden en dagelijks draagcomfort.',
    intro: 'Een fietshelm werkt alleen goed wanneer hij passend en correct gedragen wordt. Begin daarom bij je hoofdomtrek en het type fiets dat je gebruikt. Kijk daarna naar keurmerk, pasvorm, ventilatie en functies die je daadwerkelijk nodig hebt.',
    updated: '2026-09-11',
    readingMinutes: 5,
    quickChoice: [
      {
        situation: 'Dagelijks fietsen of woon-werkverkeer',
        advice: 'Kies vooral een helm die stevig maar comfortabel zit, eenvoudig verstelbaar is en voldoende ventileert voor jouw normale ritten.',
      },
      {
        situation: 'Je rijdt op een speedpedelec',
        advice: 'Controleer expliciet of de helm voldoet aan de eisen die voor speedpedelecs gelden en kies niet alleen op uiterlijk of een algemene fietshelm-aanduiding.',
      },
      {
        situation: 'Je wilt de helm vaak meenemen',
        advice: 'Let naast bescherming op gewicht, formaat, sluiting en hoe eenvoudig de helm in tas of fietstas past zonder beschadigd te raken.',
      },
    ],
    sections: [
      {
        heading: 'Pasvorm komt vóór extra functies',
        paragraphs: [
          'Meet je hoofdomtrek en vergelijk die met de maattabel van het exacte model. Een helm hoort horizontaal op het hoofd te zitten en mag niet gemakkelijk verschuiven wanneer hij goed is afgesteld.',
          'Pas de helm bij voorkeur met bril, kapsel of andere accessoires die je normaal tijdens het fietsen gebruikt. Controleer ook of riempjes en verstelsysteem zonder drukpunten aansluiten.',
        ],
      },
      {
        heading: 'Kies het juiste type voor jouw fiets',
        paragraphs: [
          'Een gewone stadsfiets, racefiets, mountainbike en speedpedelec stellen verschillende eisen aan ventilatie, dekking en goedkeuring. Gebruik daarom niet alleen de productnaam als leidraad maar controleer voor welk gebruik het model bedoeld is.',
          'Voor een speedpedelec gelden aparte regels. Controleer altijd de actuele wettelijke eisen en de markering van de helm voordat je hem aanschaft.',
        ],
      },
      {
        heading: 'Ventilatie, gewicht en comfort',
        paragraphs: [
          'Wie langere ritten maakt merkt het verschil in ventilatie en gewicht sneller dan iemand die vooral korte stadsritten rijdt. Meer ventilatieopeningen zijn niet automatisch beter; pasvorm en constructie blijven belangrijker.',
          'Let ook op de binnenvoering. Uitneembare en wasbare pads kunnen prettig zijn wanneer je vaak fietst, maar controleer hoe de fabrikant reiniging en vervanging voorschrijft.',
        ],
      },
      {
        heading: 'Vervang een helm na een harde impact',
        paragraphs: [
          'Een helm kan na een harde klap intern beschadigd zijn zonder dat dit aan de buitenkant duidelijk zichtbaar is. Volg daarom de vervangingsinstructies van de fabrikant na een val of impact.',
          'Controleer de helm daarnaast regelmatig op scheuren, versleten riempjes, beschadigde sluitingen en verouderd binnenmateriaal. Bewaar hem droog en uit extreme hitte.',
        ],
      },
    ],
    checklist: [
      'Meet je hoofdomtrek en controleer de maattabel.',
      'Pas de helm zoals je hem in de praktijk gaat dragen.',
      'Controleer keurmerk en geschiktheid voor jouw type fiets.',
      'Let op ventilatie, gewicht en eenvoudig afstellen.',
      'Controleer hoe voering en onderdelen onderhouden worden.',
      'Vervang de helm volgens fabrikantadvies na een harde impact.',
    ],
    sources: [
      {
        title: 'ANWB — Fietshelm kiezen: zo vind je de juiste',
        url: 'https://www.anwb.nl/fiets/accessoires-uitrusting/fietshelm/fietshelm-kiezen',
        note: 'Praktische keuzehulp over maat, pasvorm, type helm, materiaal en gebruik.',
      },
      {
        title: 'Rijksoverheid — Helmplicht brommer, snorfiets en speedpedelec',
        url: 'https://www.rijksoverheid.nl/vraag-en-antwoord/verkeersveiligheid/helmplicht-brommer-snorfiets-speedpedelec',
        note: 'Actuele informatie over verplichte goedkeuring en helmregels voor onder andere speedpedelecs.',
      },
    ],
  },
  {
    slug: 'fietsendrager-kopen',
    category: 'auto-fiets',
    title: 'Fietsendrager kopen: trekhaak, dak of achterklep',
    description: 'Kies een fietsendrager op basis van automodel, trekhaak, kogeldruk, aantal fietsen, totaalgewicht, e-bikes en dagelijks montagegemak.',
    intro: 'Een fietsendrager moet bij zowel je auto als je fietsen passen. Het aantal fietsen alleen zegt weinig: totaalgewicht, kogeldruk, framevorm, wielbasis en de manier waarop de drager op de auto wordt bevestigd bepalen of een combinatie geschikt is.',
    updated: '2026-09-11',
    readingMinutes: 6,
    quickChoice: [
      {
        situation: 'Je vervoert één of twee e-bikes',
        advice: 'Controleer eerst het maximale draagvermogen van de drager en de toegestane kogeldruk van auto en trekhaak voordat je een model kiest.',
      },
      {
        situation: 'Je auto heeft geen trekhaak',
        advice: 'Onderzoek een dak- of achterklepdrager en controleer expliciet of die geschikt is voor jouw automodel en voor het gewicht van je fietsen.',
      },
      {
        situation: 'Je gebruikt de drager vaak',
        advice: 'Let extra op eigen gewicht, montagegemak, kantelfunctie, bereikbaarheid van de achterklep en hoe compact de drager kan worden opgeborgen.',
      },
    ],
    sections: [
      {
        heading: 'Begin met auto, trekhaak en kogeldruk',
        paragraphs: [
          'Bij een trekhaakdrager moet de combinatie van drager en fietsen binnen de toegestane verticale belasting blijven. Controleer daarvoor de documentatie van auto, trekhaak en fietsendrager; neem nooit alleen een algemene gemiddelde waarde over.',
          'Heb je geen trekhaak, kijk dan of jouw auto geschikt is voor een dak- of achterklepdrager. Spoilers, glazen achterkleppen en voertuigvorm kunnen beperkingen geven.',
        ],
      },
      {
        heading: 'Tel het echte gewicht van je fietsen op',
        paragraphs: [
          'E-bikes zijn vaak zwaarder dan gewone fietsen. Weeg of controleer daarom het gewicht van ieder exemplaar en vergelijk dit met zowel het totale draagvermogen als het maximale gewicht per fietspositie.',
          'Controleer ook wielbasis, bandbreedte en framevorm. Een drager kan voldoende kilogrammen aankunnen en toch niet geschikt zijn voor een lange fiets, brede band of afwijkend frame.',
        ],
      },
      {
        heading: 'Montage en dagelijks gebruik',
        paragraphs: [
          'Een drager die je vaak gebruikt moet niet alleen veilig maar ook praktisch zijn. Kijk hoe de drager wordt vastgezet, hoe hoog de fietsen moeten worden opgetild en of een kantelfunctie toegang tot de bagageruimte mogelijk maakt.',
          'Controleer vóór iedere rit of drager, fietsen, spanbanden en klemmen goed vastzitten. Volg de montagevolgorde van de fabrikant en improviseer niet met extra bevestigingsmiddelen die niet voor het systeem bedoeld zijn.',
        ],
      },
      {
        heading: 'Verlichting, zichtbaarheid en opslag',
        paragraphs: [
          'Een fietsendrager kan verlichting of kenteken van de auto afdekken. Controleer daarom welke verlichtings- en kentekenvoorzieningen de gekozen drager heeft en welke regels voor jouw situatie gelden.',
          'Denk na de rit ook aan opslag. Een opvouwbaar model kan veel ruimte besparen, maar controleer of scharnieren en vergrendelingen stevig blijven en onderhoud bewegende delen volgens de handleiding.',
        ],
      },
    ],
    checklist: [
      'Controleer of de drager op jouw automodel en bevestigingssysteem past.',
      'Controleer maximale kogeldruk en draagvermogen.',
      'Tel het werkelijke gewicht van alle fietsen en accessoires op.',
      'Controleer wielbasis, bandbreedte en framecompatibiliteit.',
      'Bekijk verlichting, kentekenpositie en zicht rondom de auto.',
      'Test montage en toegang tot de bagageruimte vóór een lange rit.',
    ],
    sources: [
      {
        title: 'ANWB — Welke fietsendrager kiezen en kopen?',
        url: 'https://www.anwb.nl/fiets/accessoires-uitrusting/fietsendrager/fietsendrager-kiezen',
        note: 'Uitgebreide keuzehulp over trekhaak-, dak- en achterklepdragers, gewicht en kogeldruk.',
      },
      {
        title: 'ANWB — Fietsendragers: informatie en veelgestelde vragen',
        url: 'https://www.anwb.nl/fiets/accessoires-uitrusting/fietsendrager',
        note: 'Praktische achtergrond over montage, maximale belasting en verschillende dragersystemen.',
      },
    ],
  },
  {
    slug: 'telefoonhouder-auto-kopen',
    category: 'auto-fiets',
    title: 'Telefoonhouder voor de auto kopen: bevestiging en gebruik',
    description: 'Kies een telefoonhouder voor de auto op basis van bevestigingsplek, toestelmaat, hoesje, zichtlijn, stabiliteit, draaibaarheid en laadfunctie.',
    intro: 'Een telefoonhouder is pas handig wanneer hij stevig blijft zitten, je zicht niet onnodig belemmert en je telefoon zonder gedoe past. Bepaal daarom eerst waar de houder in jouw auto kan worden geplaatst en controleer daarna toestelmaat, bevestiging en eventuele laadfunctie.',
    updated: '2026-09-11',
    readingMinutes: 5,
    quickChoice: [
      {
        situation: 'Je gebruikt je telefoon vooral voor navigatie',
        advice: 'Kies een plek die goed afleesbaar is zonder je zicht onnodig te blokkeren en stel route en bestemming zoveel mogelijk vóór vertrek in.',
      },
      {
        situation: 'Je wisselt vaak van telefoon of deelt de auto',
        advice: 'Een verstelbare universele houder kan praktischer zijn dan een model dat alleen voor één specifieke toestelmaat of magnetisch systeem werkt.',
      },
      {
        situation: 'Je wilt onderweg draadloos opladen',
        advice: 'Controleer of telefoon en hoesje compatibel zijn met het gebruikte laadsysteem en of de houder stevig blijft bij het extra gewicht.',
      },
    ],
    sections: [
      {
        heading: 'Kies eerst de bevestigingsplek',
        paragraphs: [
          'Veel houders worden bevestigd aan voorruit, dashboard, ventilatierooster of bekerhouder. Welke oplossing prettig is hangt af van de vorm van je dashboard, de positie van bediening en ventilatie en je normale zitpositie.',
          'Plaats de houder zo dat het scherm leesbaar blijft zonder een groot deel van je zicht naar buiten te blokkeren. Controleer ook of knoppen, ventilatieroosters en airbags niet worden gehinderd.',
        ],
      },
      {
        heading: 'Controleer telefoon én hoesje',
        paragraphs: [
          'Meet de telefoon inclusief hoesje wanneer je die normaal laat zitten. Een universele klem kan passend lijken maar te smal worden zodra een stevige beschermhoes wordt gebruikt.',
          'Bij magnetische systemen is compatibiliteit belangrijk. Controleer of je toestel of hoesje geschikt is voor het systeem en of de magnetische bevestiging voldoende stevig is voor hobbelige wegen.',
        ],
      },
      {
        heading: 'Stabiliteit en draaien',
        paragraphs: [
          'Een goede houder moet het toestel stabiel houden zonder voortdurend naar beneden te zakken. Meer scharnieren en draaipunten geven extra instelmogelijkheden, maar kunnen ook meer speling ontwikkelen.',
          'Test of je de telefoon met weinig handelingen kunt plaatsen en verwijderen wanneer de auto stilstaat. Tijdens het rijden hoort de aandacht bij het verkeer te blijven.',
        ],
      },
      {
        heading: 'Laden en veilig gebruik onderweg',
        paragraphs: [
          'Sommige houders combineren bevestiging met draadloos laden. Controleer de laadstandaard van je telefoon, het beschikbare vermogen en welke kabel of autolader nodig is om de functie te gebruiken.',
          'In Nederland mag je tijdens het rijden geen mobiel elektronisch apparaat vasthouden. Gebruik een telefoonhouder daarom als hulpmiddel en stel navigatie, muziek of gesprekken bij voorkeur vóór vertrek in.',
        ],
      },
    ],
    checklist: [
      'Bepaal een bevestigingsplek die zicht en bediening niet onnodig hindert.',
      'Meet je telefoon inclusief het hoesje dat je dagelijks gebruikt.',
      'Controleer of klem, magneet of zuignap stevig genoeg blijft zitten.',
      'Kijk of horizontaal en verticaal draaien voor jou nodig is.',
      'Controleer compatibiliteit wanneer de houder draadloos kan laden.',
      'Stel navigatie en andere functies zoveel mogelijk in vóór vertrek.',
    ],
    sources: [
      {
        title: 'ANWB — Zo kies je een telefoonhouder voor je auto',
        url: 'https://www.anwb.nl/auto/auto-accessoires/telefoonhouder-kiezen',
        note: 'Keuzehulp over bevestigingsplek, toestelmaat, draaibaarheid en laadfunctie.',
      },
      {
        title: 'Rijksoverheid — Appen, bellen en muziek luisteren in het verkeer',
        url: 'https://www.rijksoverheid.nl/vraag-en-antwoord/voertuigen-op-de-weg/mag-ik-appen-bellen-en-naar-muziek-luisteren-als-ik-op-de-weg-rijd',
        note: 'Actuele Nederlandse regels voor het vasthouden en handsfree gebruiken van mobiele apparaten tijdens het rijden.',
      },
    ],
  },
]
