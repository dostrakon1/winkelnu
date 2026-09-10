import type { BuyingGuide } from './koopgidsen'

export const personalCareEditorialCategory = {
  slug: 'persoonlijke-verzorging',
  title: 'Persoonlijke verzorging',
  description: 'Praktische keuzehulp voor elektrische verzorgingsapparaten die passen bij je dagelijkse routine.',
  intro: 'Bij persoonlijke verzorgingsapparaten zijn comfort, onderhoud en passend gebruik vaak belangrijker dan een lange lijst extra standen. Begin bij je eigen routine, controleer waarvoor een apparaat bedoeld is en neem vervangingsonderdelen en gebruikskosten mee in je keuze.',
  topics: ['Comfort en dagelijks gebruik', 'Nat of droog gebruiken', 'Onderhoud en hygiëne', 'Accu en vervangingsonderdelen'],
} as const

export const personalCareBuyingGuides: BuyingGuide[] = [
  {
    slug: 'elektrische-tandenborstel-kopen',
    category: 'persoonlijke-verzorging',
    title: 'Elektrische tandenborstel kopen: waar let je op?',
    description: 'Kies een elektrische tandenborstel op basis van borstelkop, druksensor, timer, accuduur, opzetborstels en dagelijks gebruiksgemak.',
    intro: 'Een elektrische tandenborstel hoeft niet veel poetsstanden of een uitgebreide app te hebben om prettig te zijn. Belangrijker is dat de borstel comfortabel in de hand ligt, passende opzetborstels beschikbaar zijn en je hem consequent op de juiste manier gebruikt.',
    updated: '2026-09-11',
    readingMinutes: 5,
    quickChoice: [
      {
        situation: 'Eenvoudig dagelijks poetsen',
        advice: 'Kijk vooral naar een comfortabele borstelkop, een timer en een bediening die je zonder extra stappen dagelijks gebruikt.',
      },
      {
        situation: 'Je poetst snel te hard',
        advice: 'Een duidelijke druksensor kan helpen om zichtbaar of voelbaar aan te geven wanneer je te veel druk zet.',
      },
      {
        situation: 'Meerdere gebruikers in huis',
        advice: 'Controleer de prijs en beschikbaarheid van passende opzetborstels en of borstelkoppen eenvoudig uit elkaar te houden zijn.',
      },
    ],
    sections: [
      {
        heading: 'Begin bij de borstelkop en bediening',
        paragraphs: [
          'Elektrische tandenborstels gebruiken verschillende bewegingen en borstelkopvormen. Kies niet alleen op de naam van het systeem, maar kijk ook of de kop prettig aanvoelt en of je gemakkelijk alle delen van je gebit kunt bereiken. Bij specifieke mondzorgbehoeften kan je tandarts of mondhygiënist helpen bepalen wat passend is.',
          'Een eenvoudige aan-uitknop en een goed afleesbare laadstatus zijn in dagelijks gebruik vaak waardevoller dan functies die je nauwelijks gebruikt. Controleer bij een exact model welke borstelkoppen compatibel zijn.',
        ],
      },
      {
        heading: 'Timer, druksensor en poetsstanden',
        paragraphs: [
          'Een timer kan ondersteunen bij een vaste poetsduur. Sommige modellen geven daarnaast intervallen aan om je poetsbeurt over verschillende delen van je mond te verdelen. Een druksensor kan nuttig zijn wanneer je de neiging hebt hard te drukken.',
          'Extra poetsstanden zoals gevoelig, intensief of whitening verschillen per fabrikant. Beoordeel of je zo’n stand daadwerkelijk nodig hebt en controleer de uitleg in de handleiding. Een extra stand vervangt geen goede poetstechniek of professioneel mondzorgadvies.',
        ],
      },
      {
        heading: 'Accu, opladen en reizen',
        paragraphs: [
          'Vergelijk accuduur op basis van je normale gebruik en kijk welk type lader wordt meegeleverd. Wie veel reist kan baat hebben bij een compacte lader of reisetui, maar controleer of die werkelijk onderdeel van de gekozen uitvoering zijn.',
          'Laat een elektrisch apparaat en laadstation niet onnodig in contact komen met water en volg de veiligheids- en laadinstructies van de fabrikant. Gebruik alleen onderdelen en laders die voor het exacte model zijn bedoeld.',
        ],
      },
      {
        heading: 'Opzetborstels, onderhoud en totale kosten',
        paragraphs: [
          'De terugkerende kosten zitten vooral in vervangende opzetborstels. Vergelijk daarom niet alleen de aanschafprijs van het handvat, maar ook de prijs en verkrijgbaarheid van passende borstelkoppen. Vervang een versleten borstelkop volgens de aanwijzingen van fabrikant en mondzorgprofessionals.',
          'Spoel en bewaar de borstel volgens de handleiding en laat onderdelen goed drogen. Controleer bij aankoop ook garantie, retourvoorwaarden en de beschikbaarheid van vervangende onderdelen.',
        ],
      },
    ],
    checklist: [
      'Kies een borstelkop en handvat die comfortabel aanvoelen.',
      'Bepaal of een timer en druksensor voor jou nuttig zijn.',
      'Controleer welke opzetborstels compatibel en verkrijgbaar zijn.',
      'Vergelijk accuduur, lader en eventuele reisaccessoires.',
      'Neem vervangende borstelkoppen mee in de totale gebruikskosten.',
      'Volg bij specifieke mondzorgvragen het advies van je tandarts of mondhygiënist.',
    ],
    sources: [
      {
        title: 'Oral Health Foundation — Oral care products',
        url: 'https://www.dentalhealth.org/oral-care-products',
        note: 'Achtergrond over tandenborstels, elektrische tandenborstels, timers, druksensoren en dagelijkse mondverzorging.',
      },
      {
        title: 'Your Europe — Productveiligheid',
        url: 'https://europa.eu/youreurope/citizens/consumers/shopping/product-safety/index_nl.htm',
        note: 'Europese consumenteninformatie over productveiligheid en elektrische en elektronische apparatuur.',
      },
    ],
  },
  {
    slug: 'scheerapparaat-kopen',
    category: 'persoonlijke-verzorging',
    title: 'Scheerapparaat kopen: systeem, comfort en onderhoud',
    description: 'Kies een elektrisch scheerapparaat op basis van scheersysteem, huidcomfort, nat of droog gebruik, accuduur, reiniging en vervangingsonderdelen.',
    intro: 'Een scheerapparaat gebruik je vaak meerdere keren per week. Kijk daarom niet alleen naar het aantal scheerelementen of standen, maar vooral naar het systeem dat bij je routine past, hoe gemakkelijk het apparaat schoon te maken is en welke onderdelen later vervangen moeten worden.',
    updated: '2026-09-11',
    readingMinutes: 5,
    quickChoice: [
      {
        situation: 'Dagelijks of zeer regelmatig scheren',
        advice: 'Let extra op handligging, eenvoudige reiniging en een scheersysteem dat comfortabel werkt bij jouw normale baardlengte.',
      },
      {
        situation: 'Je wilt onder de douche of met scheerproduct scheren',
        advice: 'Kies alleen een model waarvan de fabrikant expliciet aangeeft dat nat gebruik is toegestaan en volg de gebruiksinstructies.',
      },
      {
        situation: 'Veel onderweg',
        advice: 'Kijk naar accuduur, laadduur, reisvergrendeling en wat er daadwerkelijk aan reisetui of lader wordt meegeleverd.',
      },
    ],
    sections: [
      {
        heading: 'Folie of roterend systeem',
        paragraphs: [
          'Elektrische scheerapparaten werken meestal met een foliesysteem of met roterende scheerkoppen. De vorm en beweging verschillen, waardoor ook de manier van scheren anders is. Er is niet één systeem dat voor iedereen automatisch beter is.',
          'Kijk naar je baardgroei, hoe vaak je scheert en welke beweging prettig aanvoelt. Controleer de handleiding van het exacte model voor de aanbevolen scheertechniek en gebruik geen druk of beweging die de fabrikant afraadt.',
        ],
      },
      {
        heading: 'Nat, droog en huidcomfort',
        paragraphs: [
          'Niet ieder elektrisch scheerapparaat mag op dezelfde manier met water of scheerproducten worden gebruikt. Controleer daarom expliciet of het model geschikt is voor droog scheren, nat scheren of beide. Waterbestendigheid betekent niet automatisch dat elk gebruik onder de douche is toegestaan.',
          'Bij een gevoelige huid kan rustig werken en een verzorgde, schone scheerkop prettig zijn. Stop bij duidelijke irritatie of beschadiging en volg zo nodig professioneel advies in plaats van door te blijven scheren.',
        ],
      },
      {
        heading: 'Accu, laden en gebruik met snoer',
        paragraphs: [
          'Vergelijk accuduur en laadduur op basis van hoe vaak je het apparaat gebruikt. Controleer ook of het model tijdens het laden of met snoer gebruikt mag worden; bij apparaten voor nat gebruik kan dat om veiligheidsredenen beperkt zijn.',
          'Een snellaadfunctie kan handig zijn wanneer de accu onverwacht leeg is. Kijk wel naar de voorwaarden die de fabrikant daarvoor opgeeft en welke lader of aansluiting bij de gekozen uitvoering hoort.',
        ],
      },
      {
        heading: 'Reinigen, scheerkoppen en totale kosten',
        paragraphs: [
          'Scheerresten en huidvet kunnen zich in het scheersysteem verzamelen. Volg daarom de reinigingsinstructies en controleer of onderdelen afgespoeld mogen worden. Een automatisch reinigingsstation kan gemak bieden, maar brengt vaak extra verbruiksartikelen en ruimte op de wastafel met zich mee.',
          'Scheerkoppen en folies slijten. Controleer vooraf welke vervangingsonderdelen bij het model horen, hoe gemakkelijk ze verkrijgbaar zijn en wat ze kosten. Tel die kosten mee naast aanschafprijs, reinigingsmiddelen en eventuele accessoires.',
        ],
      },
    ],
    checklist: [
      'Kies tussen folie en roterend op basis van je eigen routine.',
      'Controleer expliciet of nat gebruik is toegestaan.',
      'Vergelijk accuduur, laadduur en reisfuncties.',
      'Bekijk hoe het scheersysteem gereinigd en onderhouden wordt.',
      'Controleer prijs en beschikbaarheid van vervangende scheerdelen.',
      'Lees de veiligheidsinstructies van het exacte model vóór gebruik.',
    ],
    sources: [
      {
        title: 'Your Europe — Productveiligheid',
        url: 'https://europa.eu/youreurope/citizens/consumers/shopping/product-safety/index_nl.htm',
        note: 'Europese consumenteninformatie over veiligheidseisen en waarschuwingen bij elektrische consumentenproducten.',
      },
      {
        title: 'Your Europe — Garanties en retourzendingen',
        url: 'https://europa.eu/youreurope/citizens/consumers/shopping/guarantees-returns/index_nl.htm',
        note: 'Algemene Europese consumenteninformatie over garantie en rechten bij aankopen.',
      },
    ],
  },
  {
    slug: 'epilator-kopen',
    category: 'persoonlijke-verzorging',
    title: 'Epilator kopen: gebruik, opzetstukken en onderhoud',
    description: 'Kies een epilator met aandacht voor lichaamszones, nat of droog gebruik, opzetstukken, accuduur, grip, reiniging en vervangbare onderdelen.',
    intro: 'Epilators verschillen in vorm, opzetstukken en de zones waarvoor ze bedoeld zijn. Een uitgebreid accessoirepakket is alleen nuttig wanneer je die onderdelen echt gebruikt. Begin daarom bij de lichaamszones en omstandigheden waarin je het apparaat wilt gebruiken.',
    updated: '2026-09-11',
    readingMinutes: 5,
    quickChoice: [
      {
        situation: 'Vooral benen en grotere zones',
        advice: 'Let op een brede, goed hanteerbare kop, prettige grip en hoe eenvoudig het apparaat tijdens langer gebruik schoon te houden is.',
      },
      {
        situation: 'Ook kleinere of gevoeligere zones',
        advice: 'Controleer welke zones volgens de fabrikant geschikt zijn en welke precisie- of beschermopzetstukken bij het exacte model horen.',
      },
      {
        situation: 'Gebruik in bad of onder de douche',
        advice: 'Kies uitsluitend een uitvoering die daar expliciet voor bedoeld is en volg de veiligheidsinstructies voor nat gebruik en opladen.',
      },
    ],
    sections: [
      {
        heading: 'Kijk eerst naar de bedoelde lichaamszones',
        paragraphs: [
          'Fabrikanten geven aan voor welke lichaamszones een epilator en de verschillende opzetstukken bedoeld zijn. Controleer dat vóór aankoop, zeker wanneer je het apparaat op kleinere of gevoeligere zones wilt gebruiken. Een accessoire voor precisie of bescherming is niet automatisch geschikt voor ieder lichaamsdeel.',
          'Bedenk daarnaast of je vooral snelheid op grotere zones belangrijk vindt of juist controle op kleinere plekken. Dat bepaalt welke kopvorm, grip en accessoires voor jou praktisch zijn.',
        ],
      },
      {
        heading: 'Nat of droog gebruiken',
        paragraphs: [
          'Sommige epilators zijn alleen voor droog gebruik bedoeld, andere mogen ook met water worden gebruikt. Controleer de aanduiding van het exacte model en de handleiding; ga niet alleen af op het uiterlijk van het apparaat of een algemene productfamilienaam.',
          'Bij nat gebruik gelden vaak specifieke instructies voor opladen, bewaren en schoonmaken. Houd laadapparatuur uit de buurt van water zoals de fabrikant voorschrijft.',
        ],
      },
      {
        heading: 'Snelheden, verlichting en opzetstukken',
        paragraphs: [
          'Meerdere snelheden kunnen extra controle geven, maar zijn alleen waardevol wanneer je ze daadwerkelijk gebruikt. Hetzelfde geldt voor ingebouwde verlichting, massage- of precisie-opzetstukken en aparte trim- of scheeraccessoires.',
          'Controleer wat standaard in de doos zit, want uitvoeringen met bijna dezelfde productnaam kunnen verschillende accessoires bevatten. Kijk ook hoeveel losse onderdelen je moet opbergen en reinigen.',
        ],
      },
      {
        heading: 'Accu, reiniging en gebruikskosten',
        paragraphs: [
          'Vergelijk accuduur en laadduur met de lengte en frequentie van je normale gebruik. Controleer of het apparaat alleen draadloos werkt of ook op een andere manier gebruikt kan worden, en volg altijd de veiligheidsbeperkingen van het model.',
          'Een afneembare kop kan onderhoud eenvoudiger maken wanneer die volgens de handleiding afgespoeld mag worden. Controleer daarnaast welke onderdelen vervangbaar zijn, of ze los verkrijgbaar zijn en wat een vervanging kost.',
        ],
      },
    ],
    checklist: [
      'Bepaal voor welke lichaamszones je het apparaat wilt gebruiken.',
      'Controleer of het model voor nat, droog of beide is bedoeld.',
      'Bekijk welke opzetstukken werkelijk bij de gekozen uitvoering zitten.',
      'Vergelijk grip, snelheidsstanden, accuduur en laadwijze.',
      'Controleer hoe de kop en accessoires gereinigd mogen worden.',
      'Lees de veiligheidsinstructies en controleer vervangbare onderdelen.',
    ],
    sources: [
      {
        title: 'Your Europe — Productveiligheid',
        url: 'https://europa.eu/youreurope/citizens/consumers/shopping/product-safety/index_nl.htm',
        note: 'Europese consumenteninformatie over productveiligheid en elektrische consumentenproducten.',
      },
      {
        title: 'Europese Commissie — Product safety',
        url: 'https://commission.europa.eu/topics/business-and-industry/product-safety_en',
        note: 'Achtergrond over Europese productveiligheidsregels en Safety Gate voor onveilige non-foodproducten.',
      },
    ],
  },
]
