import type { BuyingGuide } from './koopgidsen'

export const dierenEditorialCategory = {
  slug: 'dieren',
  title: 'Dieren',
  description: 'Praktische keuzehulp voor producten rond rust, verzorging, spelen en veilig vervoer van huisdieren.',
  intro: 'Bij producten voor huisdieren draait een goede keuze niet alleen om formaat of prijs. Het product moet passen bij het dier, de ruimte in huis en de manier waarop je het dagelijks gebruikt. Begin daarom bij gedrag, comfort, veiligheid en schoonmaakgemak voordat je naar extra functies kijkt.',
  topics: ['Formaat en comfort', 'Veiligheid en stevigheid', 'Gedrag en dagelijks gebruik', 'Schoonmaken en onderhoud'],
} as const

export const dierenBuyingGuides: BuyingGuide[] = [
  {
    slug: 'hondenmand-kopen',
    category: 'dieren',
    title: 'Hondenmand kopen: formaat, comfort en onderhoud',
    description: 'Kies een hondenmand op basis van formaat, liggedrag, materiaal, ondersteuning, wasbaarheid, plaatsing en dagelijks gebruik.',
    intro: 'Een hondenmand is vooral een vaste rustplek. Het juiste model geeft voldoende ruimte om comfortabel te liggen, past bij het liggedrag van je hond en is praktisch schoon te houden. Kijk daarom eerst naar formaat, materiaal en plaatsing en pas daarna naar vorm of uitstraling.',
    updated: '2026-09-11',
    readingMinutes: 5,
    quickChoice: [
      {
        situation: 'Je hond ligt graag languit',
        advice: 'Kies een mand of kussen met genoeg lengte en breedte zodat je hond zonder tegen de randen gedrukt te worden kan uitstrekken.',
      },
      {
        situation: 'Je hond rolt zich graag op',
        advice: 'Een model met opstaande randen kan prettig zijn, zolang de instap en binnenruimte bij formaat en mobiliteit van je hond passen.',
      },
      {
        situation: 'Je wilt de mand eenvoudig schoonhouden',
        advice: 'Let op een afneembare, wasbare hoes en controleer of ook de binnenvulling volgens de fabrikant gereinigd kan worden.',
      },
    ],
    sections: [
      {
        heading: 'Meet je hond en kijk naar liggedrag',
        paragraphs: [
          'Kies niet alleen op ras of een algemene maataanduiding. Kijk hoe je hond normaal slaapt en meet hoeveel ruimte hij inneemt wanneer hij ontspannen ligt. De mand moet groot genoeg zijn om comfortabel te kunnen liggen en van houding te veranderen.',
          'Let ook op de instaphoogte. Voor pups, kleine honden, oudere honden of dieren die minder gemakkelijk bewegen kan een hoge, harde rand onpraktisch zijn. Een lage opening of vlak hondenbed kan dan prettiger zijn.',
        ],
      },
      {
        heading: 'Materiaal, stevigheid en ondersteuning',
        paragraphs: [
          'Stoffen manden zijn vaak zacht en licht, terwijl kunststof modellen steviger en eenvoudiger af te nemen kunnen zijn. Sommige honden kauwen of graven veel in hun ligplek. Kies daarom materiaal dat past bij het normale gedrag van jouw hond en controleer regelmatig op losse of beschadigde delen.',
          'Bij een harde ondergrond kan een passend kussen of mat extra comfort geven. Hoeveel ondersteuning prettig is verschilt per hond; bij specifieke lichamelijke klachten is advies van een dierenarts belangrijker dan algemene marketingclaims over een zogenoemde orthopedische mand.',
        ],
      },
      {
        heading: 'Wasbaarheid en dagelijks onderhoud',
        paragraphs: [
          'Een ligplek verzamelt haren, vuil en geurtjes. Controleer daarom vóór aankoop of de hoes afneembaar is, op welke temperatuur die gewassen mag worden en hoe de vulling gereinigd moet worden. Een hoes die eenvoudig terug te plaatsen is maakt regelmatig schoonmaken realistischer.',
          'Bekijk naden, ritsen en antislipdelen geregeld op slijtage. Vervang of repareer de mand wanneer vulling vrijkomt of onderdelen losraken waar de hond op kan kauwen of die hij kan inslikken.',
        ],
      },
      {
        heading: 'Kies ook de juiste plek in huis',
        paragraphs: [
          'Een goede mand op de verkeerde plek wordt soms weinig gebruikt. Kies een rustige plaats waar je hond zich kan terugtrekken maar niet volledig van het gezin is afgesneden. Vermijd een plek midden in de doorloop, in felle zon, naast sterke warmtebronnen of op de tocht.',
          'Laat de mand een veilige rustplek blijven. Zeker in een huishouden met kinderen is het belangrijk dat een slapende of rustende hond daar met rust wordt gelaten.',
        ],
      },
    ],
    checklist: [
      'Meet hoeveel ruimte je hond nodig heeft wanneer hij ontspannen ligt.',
      'Kies een instaphoogte die past bij formaat en mobiliteit.',
      'Controleer of materiaal en naden tegen normaal gebruik bestand zijn.',
      'Kijk of hoes en vulling praktisch schoon te maken zijn.',
      'Plaats de mand op een rustige plek zonder tocht of felle warmte.',
      'Controleer de mand regelmatig op slijtage en losse onderdelen.',
    ],
    sources: [
      {
        title: 'LICG — Een eigen ligplaats voor de hond',
        url: 'https://www.licg.nl/honden/een-eigen-ligplaats-voor-de-hond/',
        note: 'Praktische informatie over formaat, materiaal, schoonmaak en plaatsing van een geschikte rustplek voor honden.',
      },
      {
        title: 'LICG — Houd uw hond gezond!',
        url: 'https://www.licg.nl/honden/houd-uw-hond-gezond/',
        note: 'Achtergrond over huisvesting, ligplaatsen en aandachtspunten voor honden van verschillende leeftijden en mobiliteit.',
      },
    ],
  },
  {
    slug: 'krabpaal-kiezen',
    category: 'dieren',
    title: 'Krabpaal kiezen: hoogte, stabiliteit en plaatsing',
    description: 'Kies een krabpaal op basis van hoogte, stabiliteit, krabrichting, materiaal, plaatsing, aantal katten en beschikbare ruimte.',
    intro: 'Krabben is normaal kattengedrag. Een goede krabvoorziening moet daarom niet alleen mooi in het interieur passen, maar vooral stevig staan, groot genoeg zijn om prettig te gebruiken en op een plek staan waar je kat daadwerkelijk wil krabben.',
    updated: '2026-09-11',
    readingMinutes: 5,
    quickChoice: [
      {
        situation: 'Je kat krabt vooral rechtop',
        advice: 'Kies een stabiele verticale paal die hoog genoeg is zodat je kat zich tijdens het krabben volledig kan uitstrekken.',
      },
      {
        situation: 'Je kat krabt liever aan vloer of kleed',
        advice: 'Bied naast een verticale paal ook een stevige horizontale krabplank of krabmat aan.',
      },
      {
        situation: 'Je hebt meerdere katten',
        advice: 'Plaats meerdere krabmogelijkheden op verschillende plekken zodat katten keuze hebben en elkaar niet steeds hoeven te passeren of verdringen.',
      },
    ],
    sections: [
      {
        heading: 'Let op hoogte en krabrichting',
        paragraphs: [
          'Veel katten krabben graag verticaal en strekken daarbij hun lichaam uit. Een te korte paal nodigt daar minder toe uit. Kijk daarom naar de lengte van je kat en kies een verticale krabplek die voldoende hoogte biedt.',
          'Niet iedere kat heeft dezelfde voorkeur. Sommige katten krabben horizontaal of schuin. Wanneer je kat nu al aan een bepaald oppervlak krabt, geeft dat vaak een bruikbare aanwijzing voor richting en materiaal die aantrekkelijk zijn.',
        ],
      },
      {
        heading: 'Stabiliteit is belangrijker dan extra plateaus',
        paragraphs: [
          'Een krabpaal moet de kracht van een krabbende of klimmende kat kunnen opvangen zonder voortdurend te schuiven of om te vallen. Controleer daarom de grootte en het gewicht van de voet en zet hogere constructies volgens de instructies vast wanneer dat wordt aangeraden.',
          'Een groot krabmeubel met veel plateaus is niet automatisch beter dan een eenvoudige paal. Kies extra ligplekken, huisjes en plateaus alleen wanneer ze passen bij je kat en de beschikbare ruimte.',
        ],
      },
      {
        heading: 'Materiaal en slijtage',
        paragraphs: [
          'Sisal, karton, hout en textiel voelen verschillend aan. Kijk naar wat je kat al gebruikt en controleer of het kraboppervlak stevig vastzit. Een oppervlak dat snel loslaat of lange losse draden vormt kan minder praktisch zijn.',
          'Krabmateriaal is bedoeld om te slijten. Controleer daarom regelmatig of palen, schroeven, touw en plateaus nog stevig zijn. Vervang versleten onderdelen wanneer de constructie instabiel wordt of materiaal loskomt.',
        ],
      },
      {
        heading: 'Plaatsing bepaalt of de paal wordt gebruikt',
        paragraphs: [
          'Zet een krabpaal niet automatisch in een afgelegen hoek. Katten krabben vaak op plekken die voor hen betekenis hebben, bijvoorbeeld bij een rustplek, looproute, deur of plek waar ze nu al aan meubels krabben.',
          'Heb je meerdere katten, verdeel krabmogelijkheden dan over verschillende delen van het huis. Zo geef je ieder dier keuze en voorkom je dat één voorziening op een onhandige of sociaal drukke plek staat.',
        ],
      },
    ],
    checklist: [
      'Observeer of je kat verticaal, horizontaal of beide richtingen krabt.',
      'Kies voldoende hoogte zodat de kat zich kan uitstrekken.',
      'Controleer voet, bevestigingen en totale stabiliteit.',
      'Kies materiaal dat aansluit bij de voorkeur van je kat.',
      'Plaats de krabvoorziening waar je kat hem logisch tegenkomt.',
      'Controleer regelmatig op slijtage, losse delen en instabiliteit.',
    ],
    sources: [
      {
        title: 'LICG — Krabgedrag bij de kat',
        url: 'https://www.licg.nl/katten/krabgedrag-bij-de-kat/',
        note: 'Achtergrond over natuurlijk krabgedrag, hoogte, stabiliteit, materiaal en geschikte plaatsing van krabvoorzieningen.',
      },
      {
        title: 'LICG — Een katvriendelijke woning',
        url: 'https://www.licg.nl/katten/een-katvriendelijke-woning/',
        note: 'Praktische informatie over krabpalen, horizontale en verticale krabmogelijkheden en inrichting van de leefomgeving.',
      },
    ],
  },
  {
    slug: 'transportbox-huisdier-kopen',
    category: 'dieren',
    title: 'Transportbox voor huisdier kopen: formaat en veilig vervoer',
    description: 'Kies een transportbox of reisbench op basis van dierformaat, stevigheid, ventilatie, sluitingen, draaggemak, schoonmaak en gebruik in de auto.',
    intro: 'Een transportbox moet vooral veilig en praktisch zijn. Het dier moet voldoende ruimte hebben voor de bedoelde reis, terwijl de box stevig blijft, goed ventileert en op de juiste manier in auto of andere vervoerssituaties kan worden gebruikt.',
    updated: '2026-09-11',
    readingMinutes: 6,
    quickChoice: [
      {
        situation: 'Kat of kleine hond voor korte ritten',
        advice: 'Kijk naar een stevige, goed ventilerende box met betrouwbare sluitingen die je stabiel en volgens actuele veiligheidsadviezen in de auto kunt plaatsen.',
      },
      {
        situation: 'Grotere hond in de auto',
        advice: 'Controleer maat, materiaal en de manier waarop de reisbench in jouw specifieke auto wordt geplaatst of bevestigd.',
      },
      {
        situation: 'Regelmatig reizen of dierenartsbezoek',
        advice: 'Let naast veiligheid op gewicht, handgrepen, eenvoudig openen, schoonmaak en of het dier rustig aan de box kan wennen.',
      },
    ],
    sections: [
      {
        heading: 'Kies het formaat voor dier én gebruik',
        paragraphs: [
          'De juiste maat hangt af van het dier en van het type vervoer. Een hond moet in een geschikte bench in ieder geval kunnen zitten, liggen en zich omdraaien. Voor katten en kleinere huisdieren moet de box voldoende bewegingsruimte en ventilatie geven zonder onnodig groot en instabiel te worden.',
          'Meet je dier voordat je bestelt en vergelijk die maten met de binnenmaten van het exacte model. Buitenmaten zeggen niet altijd hoeveel bruikbare ruimte binnen overblijft door schuine wanden, deurranden of verstevigingen.',
        ],
      },
      {
        heading: 'Stevigheid, deur en sluitingen',
        paragraphs: [
          'Controleer of wanden, bodem, handgrepen en deur stevig aanvoelen en of sluitingen niet eenvoudig vanzelf kunnen openen. Bij kunststof boxen zijn verbindingen tussen boven- en onderkant belangrijke controlepunten; bij metalen benches tellen laspunten, tralieafstand en scherpe randen mee.',
          'Gebruik een transportbox alleen zoals de fabrikant hem heeft ontworpen. Zelf geboorde gaten, losse spanbanden of geïmproviseerde sluitingen kunnen de constructie en veiligheid veranderen.',
        ],
      },
      {
        heading: 'Ventilatie, comfort en schoonmaak',
        paragraphs: [
          'Voldoende ventilatie is belangrijk, maar openingen moeten ook passen bij de grootte van het dier zodat poten, kop of andere lichaamsdelen niet klem kunnen raken. Leg alleen een ondergrond in de box die veilig ligt en niet gemakkelijk verschuift of wordt stukgetrokken.',
          'Een uitneembare of goed afwasbare bodem is praktisch bij ongelukjes onderweg. Controleer vooraf hoe deur, bodem en eventuele textiele onderdelen gereinigd mogen worden.',
        ],
      },
      {
        heading: 'Denk vooraf na over vervoer in de auto',
        paragraphs: [
          'Een losse box op een stoel of in de laadruimte kan bij hard remmen of een botsing verschuiven. De veiligste plaats en bevestigingsmethode hangen af van type box, dier en auto. Volg daarom zowel de instructies van de boxfabrikant als actuele onafhankelijke veiligheidsadviezen voor vervoer van huisdieren.',
          'Laat een dier vooraf rustig aan de box wennen in plaats van hem pas vlak voor vertrek voor het eerst te gebruiken. Controleer voor iedere rit of deur en bevestigingen goed dicht zitten en houd tijdens langere reizen rekening met passende rust- en verzorgingsmomenten.',
        ],
      },
    ],
    checklist: [
      'Meet je dier en controleer de binnenmaten van de box.',
      'Controleer bodem, deur, handgrepen en sluitingen op stevigheid.',
      'Zorg voor voldoende ventilatie zonder gevaarlijke openingen.',
      'Bekijk hoe de box gereinigd kan worden na gebruik.',
      'Controleer hoe het model in jouw auto geplaatst of bevestigd moet worden.',
      'Laat je huisdier vóór de eerste reis rustig aan de box wennen.',
    ],
    sources: [
      {
        title: 'LICG — Uw huisdier in de auto',
        url: 'https://www.licg.nl/uw-huisdier-in-de-auto/',
        note: 'Praktische en veiligheidstechnische informatie over vervoer van huisdieren en transportboxen in de auto.',
      },
      {
        title: 'LICG — Een hondenbench gebruiken',
        url: 'https://www.licg.nl/honden/een-hondenbench-gebruiken/',
        note: 'Achtergrond over typen benches, maatvoering, veilig gebruik en het rustig aanleren van een transport- of huiskamerbench.',
      },
    ],
  },
]
