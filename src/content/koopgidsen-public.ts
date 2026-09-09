import {
  type BuyingGuide,
  buyingGuides as baseBuyingGuides,
  editorialCategories as baseEditorialCategories,
} from './koopgidsen'

const additionalEditorialCategories = [
  {
    slug: 'huis-tuin-klussen',
    title: 'Huis, tuin & klussen',
    description: 'Praktische keuzehulp voor gereedschap, tuinonderhoud en klussen rond het huis.',
    intro: 'Goed gereedschap en tuinmateriaal passen bij de klus die je daadwerkelijk uitvoert. Kijk niet alleen naar vermogen of een lange functielijst, maar ook naar veiligheid, formaat, accuplatform, onderhoud en hoe vaak je het product gebruikt.',
    topics: ['Kracht en accuduur', 'Formaat en gebruiksgemak', 'Onderhoud en accessoires', 'Veilig werken binnen en buiten'],
  },
  {
    slug: 'sport-outdoor',
    title: 'Sport & outdoor',
    description: 'Van dagelijkse beweging tot wandelen en kamperen: kies materiaal dat past bij jouw activiteit en omgeving.',
    intro: 'Bij sport- en outdoorproducten bepalen pasvorm, weersomstandigheden, gebruiksduur en draagcomfort vaak meer dan een indrukwekkende specificatielijst. Begin daarom bij je activiteit en de omstandigheden waarin je het product gebruikt.',
    topics: ['Pasvorm en comfort', 'Duurzaamheid en materiaal', 'Weer en gebruiksomgeving', 'Meenemen, opladen en opbergen'],
  },
  {
    slug: 'speelgoed-hobby',
    title: 'Speelgoed & hobby',
    description: 'Spelen, bouwen en creatief bezig zijn met aandacht voor leeftijd, interesse, veiligheid en hergebruik.',
    intro: 'Een goede keuze sluit aan bij de leeftijd, interesse en manier van spelen of maken. Kijk daarnaast naar veiligheid, moeilijkheid, uitbreidbaarheid, materiaal en hoeveel ruimte je nodig hebt om alles te gebruiken en op te bergen.',
    topics: ['Leeftijd en niveau', 'Creativiteit en uitdaging', 'Samen of zelfstandig', 'Veiligheid en materiaal'],
  },
] as const

const additionalBuyingGuides: BuyingGuide[] = [
  {
    slug: 'monitor-kopen', category: 'elektronica', title: 'Monitor kopen: formaat, resolutie en werkcomfort',
    description: 'Kies een monitor op basis van schermformaat, resolutie, ergonomie, aansluitingen en jouw dagelijkse gebruik.',
    intro: 'Een groter scherm is niet automatisch prettiger. De juiste monitor hangt af van kijkafstand, werkzaamheden, beschikbare bureauruimte en de apparaten die je wilt aansluiten.',
    updated: '2026-09-09', readingMinutes: 5,
    quickChoice: [
      { situation: 'Kantoor, studie en thuiswerken', advice: 'Let vooral op een prettig formaat, scherpe tekst, hoogteverstelling en aansluitingen voor je laptop of desktop.' },
      { situation: 'Foto, video en ontwerp', advice: 'Kijk naast resolutie naar kleurweergave, paneeltype, helderheid en mogelijkheden voor kalibratie.' },
      { situation: 'Gaming', advice: 'Controleer verversingssnelheid, responstijd, adaptieve synchronisatie en of je computer de gewenste resolutie aankan.' },
    ],
    sections: [
      { heading: 'Formaat en resolutie samen bekijken', paragraphs: ['Schermformaat en resolutie bepalen samen hoe groot en scherp tekst en beeld ogen. Een hoge resolutie op een compact scherm kan extra scherpte geven, terwijl een groter scherm meer werkruimte biedt. Houd rekening met de schaalinstellingen van je besturingssysteem en je normale kijkafstand.', 'Meet je bureau voordat je kiest. Kijk ook naar de diepte van de standaard en de ruimte die je nodig hebt voor toetsenbord, laptop of speakers.'] },
      { heading: 'Ergonomie en beeldcomfort', paragraphs: ['Een in hoogte verstelbare standaard maakt het eenvoudiger om de bovenkant van het scherm op een comfortabele positie te brengen. Kantelen, draaien en een VESA-bevestiging kunnen nuttig zijn wanneer je de werkplek later wilt aanpassen.', 'Helderheid, reflecties en omgevingslicht beïnvloeden het kijkcomfort. Een marketingterm rond blauw licht of flikkervrij beeld vervangt geen goede werkhouding, voldoende pauzes en passende verlichting.'] },
      { heading: 'Aansluitingen en prestaties', paragraphs: ['Controleer HDMI, DisplayPort en USB-C op het exacte model. Niet iedere USB-C-aansluiting ondersteunt dezelfde beeldresolutie, datasnelheid of laadcapaciteit. Wie één kabel naar een laptop wil gebruiken, moet zowel video als het benodigde laadvermogen controleren.', 'Voor games of snelle bewegingen kunnen een hogere verversingssnelheid en lage vertraging prettig zijn. Die voordelen zijn alleen relevant wanneer je computer, kabel en aansluiting de gekozen combinatie van resolutie en verversingssnelheid ondersteunen.'] },
      { heading: 'Energie en totale aankoop', paragraphs: ['Bekijk het energielabel en productinformatieblad voor het exacte model. Neem ook een eventuele monitorarm, geschikte kabels, dock en garantie mee in de totale aankoopprijs.', 'Een monitor die goed instelbaar is en aansluit bij je dagelijkse werk kan waardevoller zijn dan een model met extra functies die je nauwelijks gebruikt.'] },
    ],
    checklist: ['Meet bureauruimte en kijkafstand.', 'Kies formaat en resolutie als combinatie.', 'Controleer hoogteverstelling of VESA-ondersteuning.', 'Controleer aansluitingen, kabels en USB-C-laadvermogen.', 'Bekijk energielabel, garantie en totale kosten.'],
    sources: [
      { title: 'Europese Commissie — Electronic displays', url: 'https://energy-efficient-products.ec.europa.eu/product-list/electronic-displays_en', note: 'Officiële informatie over energie- en productvereisten voor elektronische displays.' },
      { title: 'EPREL — Europese productdatabase', url: 'https://eprel.ec.europa.eu/', note: 'Controleer energielabel en productinformatie van een exact model.' },
    ],
  },
  {
    slug: 'luchtreiniger-kopen', category: 'wonen-huishouden', title: 'Luchtreiniger kopen: capaciteit, filters en geluid',
    description: 'Kies een luchtreiniger met aandacht voor ruimtegrootte, filtertype, luchtverplaatsing, geluid en onderhoudskosten.',
    intro: 'Een luchtreiniger kan bepaalde deeltjes uit binnenlucht filteren, maar vervangt ventilatie of het aanpakken van de bron van vervuiling niet. Bepaal daarom eerst welk probleem je wilt verminderen en hoe groot de ruimte is.',
    updated: '2026-09-09', readingMinutes: 5,
    quickChoice: [
      { situation: 'Pollen en zwevende deeltjes', advice: 'Kijk naar geschikte deeltjesfiltratie en voldoende luchtverplaatsing voor de ruimte waarin het apparaat staat.' },
      { situation: 'Slaapkamer', advice: 'Let extra op geluidsniveau op de stand die je ’s nachts daadwerkelijk gebruikt en op dimbare verlichting.' },
      { situation: 'Geuren of gasvormige stoffen', advice: 'Controleer of het apparaat daarvoor een passend filtermedium heeft; een deeltjesfilter verwijdert niet automatisch gassen of geuren.' },
    ],
    sections: [
      { heading: 'Wat een luchtreiniger wel en niet doet', paragraphs: ['Luchtreinigers kunnen afhankelijk van filter en ontwerp een deel van zwevende deeltjes uit de lucht halen. De werking hangt af van het type vervuiling, de hoeveelheid lucht die door het apparaat stroomt en hoe lang het draait.', 'Ventilatie, voldoende luchten waar dat passend is en het beperken van bronnen blijven belangrijk. Een luchtreiniger lost vochtproblemen, schimmelbronnen of een verbrandingsprobleem niet op.'] },
      { heading: 'Capaciteit en ruimtegrootte', paragraphs: ['Vergelijk de opgegeven luchtverplaatsing of CADR met de grootte van de kamer. Fabrikanten kunnen verschillende uitgangspunten gebruiken voor een aanbevolen oppervlak, waardoor alleen het aantal vierkante meters niet altijd goed vergelijkbaar is.', 'Een apparaat dat op een lagere, stillere stand draait verplaatst vaak minder lucht. Bedenk daarom op welke stand je het in de praktijk wilt gebruiken.'] },
      { heading: 'Filters, geluid en onderhoud', paragraphs: ['Controleer welke filters worden gebruikt, hoe vaak ze volgens de fabrikant moeten worden vervangen en wat vervangende filters kosten. Een sensor of app kan handig zijn, maar verandert niets aan de noodzaak om filters tijdig te onderhouden.', 'Geluid is vooral belangrijk in slaapkamers en werkkamers. Vergelijk geluidswaarden op vergelijkbare standen en let op extra geluiden zoals piepjes, ventilatortonen of automatische snelheidswisselingen.'] },
      { heading: 'Veilig gebruiken', paragraphs: ['Plaats het apparaat zo dat de luchtinlaat en uitblaas niet worden geblokkeerd en volg de vrije ruimte uit de handleiding. Controleer het energieverbruik wanneer het apparaat vele uren per dag draait.', 'Vermijd claims die een apparaat als volledige oplossing voor gezondheid of binnenmilieu presenteren. Bij medische klachten of structurele binnenluchtproblemen is professioneel advies belangrijker dan alleen een nieuw apparaat.'] },
    ],
    checklist: ['Bepaal welk type vervuiling je wilt verminderen.', 'Meet de ruimte en vergelijk luchtverplaatsing.', 'Controleer filtertype en vervangingskosten.', 'Vergelijk geluid op realistische gebruiksstanden.', 'Blijf ventilatie en bronaanpak meenemen.'],
    sources: [
      { title: 'US EPA — Air cleaners and air filters in the home', url: 'https://www.epa.gov/indoor-air-quality-iaq/air-cleaners-and-air-filters-home', note: 'Achtergrond over de mogelijkheden en beperkingen van luchtreinigers.' },
      { title: 'RIVM — Binnenmilieu', url: 'https://www.rivm.nl/binnenmilieu', note: 'Algemene achtergrond over factoren die de kwaliteit van het binnenmilieu beïnvloeden.' },
    ],
  },
  {
    slug: 'keukenmachine-kopen', category: 'keuken-koffie', title: 'Keukenmachine kopen: wat heb je echt nodig?',
    description: 'Vergelijk keukenmachines op gebruik, kominhoud, aandrijving, accessoires, schoonmaakgemak en beschikbare ruimte.',
    intro: 'Een keukenmachine kan kneden, mengen of met accessoires veel meer taken uitvoeren. De beste keuze begint niet bij het hoogste wattage, maar bij wat je wekelijks wilt maken en hoeveel ruimte je ervoor hebt.',
    updated: '2026-09-09', readingMinutes: 5,
    quickChoice: [
      { situation: 'Brood- en pizzadeeg', advice: 'Let op stabiliteit, bruikbare kominhoud, deeghaak en de aanbevolen maximale deeghoeveelheid.' },
      { situation: 'Taarten, beslag en slagroom', advice: 'Kijk naar garde, menghaak, lage én hogere snelheden en hoe goed kleine hoeveelheden worden bereikt.' },
      { situation: 'Veel verschillende keukentaken', advice: 'Een uitbreidbaar systeem kan handig zijn, maar tel accessoires, opslagruimte en schoonmaakwerk mee.' },
    ],
    sections: [
      { heading: 'Begin bij je recepten', paragraphs: ['Maak een lijst van wat je daadwerkelijk wilt kneden, kloppen, mengen, raspen of snijden. Een standmixer is sterk gericht op mengen en deeg, terwijl een foodprocessor doorgaans beter is in hakken, snijden en raspen. Sommige systemen combineren functies via accessoires.', 'Controleer maximale hoeveelheden in de handleiding. Een grote kom betekent niet dat het apparaat automatisch geschikt is voor zwaar deeg of juist kleine porties.'] },
      { heading: 'Vermogen, aandrijving en stabiliteit', paragraphs: ['Wattage is geen directe maat voor de uiteindelijke prestaties. Overbrenging, motorregeling, constructie en de vorm van het hulpstuk spelen ook mee. Kijk daarom naar gebruiksgrenzen en relevante praktijktests.', 'Bij stevig deeg is stabiliteit belangrijk. Controleer gewicht, antislipvoeten en of de machine tijdens gebruik op een vlakke ondergrond moet blijven staan.'] },
      { heading: 'Accessoires en schoonmaken', paragraphs: ['Extra hulpstukken zijn alleen waardevol wanneer je ze gebruikt. Bekijk vooraf wat standaard wordt meegeleverd en wat losse onderdelen kosten. Controleer ook of accessoires van verschillende generaties werkelijk compatibel zijn.', 'Losse delen die eenvoudig te verwijderen en te reinigen zijn maken regelmatig gebruik prettiger. Volg de handleiding voor onderdelen die wel of niet in de vaatwasser mogen.'] },
      { heading: 'Ruimte, veiligheid en kosten', paragraphs: ['Meet hoogte en diepte inclusief de ruimte die nodig is om de kop te kantelen of de kom te verwijderen. Denk ook aan opslag van hulpstukken en snoer.', 'Gebruik beveiligingen en accessoires zoals voorgeschreven en steek geen handen of voorwerpen in bewegende delen. Vergelijk de totale prijs inclusief hulpstukken die je voor jouw recepten echt nodig hebt.'] },
    ],
    checklist: ['Noteer je meest gemaakte recepten.', 'Controleer maximale hoeveelheden en kominhoud.', 'Bekijk meegeleverde en optionele accessoires.', 'Meet werk- en opslagruimte.', 'Vergelijk schoonmaakgemak, garantie en totale prijs.'],
    sources: [
      { title: 'Voedingscentrum — Veilig eten', url: 'https://www.voedingscentrum.nl/nl/thema/veilig-eten.aspx', note: 'Algemene achtergrond over veilig werken met voedsel en hygiëne.' },
      { title: 'Your Europe — Product safety', url: 'https://europa.eu/youreurope/citizens/consumers/shopping/product-safety/index_en.htm', note: 'Algemene Europese informatie over veilige consumentenproducten.' },
    ],
  },
  {
    slug: 'accuboormachine-kopen', category: 'huis-tuin-klussen', title: 'Accuboormachine kopen: kracht, accu en gebruik',
    description: 'Kies een accuboormachine op basis van klussen, koppel, toerental, accuplatform, gewicht en accessoires.',
    intro: 'Voor een kast monteren heb je iets anders nodig dan voor regelmatig boren in hout, metaal of metselwerk. Bepaal eerst welke klussen je uitvoert en hoe vaak je de machine gebruikt.',
    updated: '2026-09-09', readingMinutes: 5,
    quickChoice: [
      { situation: 'Lichte montage en schroefwerk', advice: 'Een compact en licht model met goede koppelregeling is vaak prettiger dan maximale kracht.' },
      { situation: 'Regelmatig boren in hout en metaal', advice: 'Let op boorkop, toerentalbereik, ergonomie en een accu die voldoende werktijd biedt.' },
      { situation: 'Af en toe boren in metselwerk', advice: 'Controleer of je een klopfunctie nodig hebt; voor zwaar beton kan ander gereedschap geschikter zijn.' },
    ],
    sections: [
      { heading: 'Boorschroefmachine, klopboor of ander type', paragraphs: ['Een accuboorschroefmachine combineert boren en schroeven. Een klopfunctie kan helpen bij bepaalde steenachtige materialen, maar is niet hetzelfde als een boorhamer. Kies het type op basis van het materiaal waarin je werkelijk werkt.', 'Gebruik altijd geschikte boren en bits. Het verkeerde hulpstuk kan slecht presteren en onveilig zijn, ook wanneer de machine krachtig genoeg is.'] },
      { heading: 'Koppel, snelheid en boorkop', paragraphs: ['Instelbaar koppel helpt voorkomen dat je schroeven te diep draait. Meerdere snelheidsbereiken maken het eenvoudiger om tussen gecontroleerd schroeven en sneller boren te wisselen.', 'Controleer de maximale boorkopmaat en welke diameters de fabrikant voor hout, metaal of steen opgeeft. Een hoog maximaal koppel is niet voor iedere klus nodig en kan een machine zwaarder maken.'] },
      { heading: 'Accuplatform en ergonomie', paragraphs: ['Wanneer meerdere machines hetzelfde accuplatform gebruiken, kun je accu’s en laders soms delen. Controleer altijd spanning, generatie en compatibiliteit binnen het exacte systeem.', 'Gewicht, balans en handgreep bepalen hoe prettig langdurig werken is. Voor bovenhands werk of montage op krappe plekken kan een compact model meer voordeel bieden dan een grotere accu.'] },
      { heading: 'Veiligheid en totale set', paragraphs: ['Draag passende oogbescherming en volg aanwijzingen voor het materiaal waarin je boort. Controleer vóór boren waar leidingen of kabels kunnen lopen en gebruik aanvullende detectie wanneer dat nodig is.', 'Vergelijk of accu, lader, koffer en benodigde boren of bits zijn inbegrepen. Een kale machine kan goedkoop lijken maar duurder uitvallen wanneer je nog geen passend accusysteem hebt.'] },
    ],
    checklist: ['Bepaal materialen en meest voorkomende klussen.', 'Kies passend type en boorkop.', 'Controleer koppel- en snelheidsregeling.', 'Bekijk accucompatibiliteit, gewicht en balans.', 'Tel lader, accu en accessoires mee in de totale prijs.'],
    sources: [
      { title: 'Arboportaal — Trillingen', url: 'https://www.arboportaal.nl/onderwerpen/trillingen', note: 'Achtergrond over blootstelling aan trillingen bij handgereedschap.' },
      { title: 'Your Europe — Product safety', url: 'https://europa.eu/youreurope/citizens/consumers/shopping/product-safety/index_en.htm', note: 'Algemene Europese informatie over veilige consumentenproducten.' },
    ],
  },
  {
    slug: 'grasmaaier-kopen', category: 'huis-tuin-klussen', title: 'Grasmaaier kopen: welke past bij jouw tuin?',
    description: 'Vergelijk grasmaaiers op gazonoppervlak, maaibreedte, aandrijving, accu, maaihoogte, opvang en opslag.',
    intro: 'De juiste grasmaaier past bij de grootte en vorm van je gazon. Een brede, zware maaier is niet altijd handig in een kleine tuin met smalle doorgangen, terwijl een compact model op een groot gazon veel tijd kan kosten.',
    updated: '2026-09-09', readingMinutes: 5,
    quickChoice: [
      { situation: 'Klein gazon dicht bij een stopcontact', advice: 'Een compact elektrisch model kan eenvoudig zijn; let op kabelbeheer, maaibreedte en opslag.' },
      { situation: 'Middelgroot gazon en flexibel werken', advice: 'Een accumaaier voorkomt een kabel; vergelijk accuduur, laadtijd en accuplatform.' },
      { situation: 'Regelmatig automatisch onderhoud', advice: 'Een robotmaaier kan geschikt zijn voor bepaalde gazons, maar vraagt installatie, veilige begrenzing en periodiek onderhoud.' },
    ],
    sections: [
      { heading: 'Gazonoppervlak en maaibreedte', paragraphs: ['Meet niet alleen de oppervlakte, maar kijk ook naar bochten, bomen, borders, hellingen en smalle doorgangen. Een grotere maaibreedte verkort rechte banen, maar maakt manoeuvreren in kleine hoeken lastiger.', 'Controleer welke gazongrootte de fabrikant bij het gekozen model en, bij accuversies, bij de betreffende accu adviseert. Omstandigheden zoals hoog of nat gras kunnen de werktijd beïnvloeden.'] },
      { heading: 'Maaihoogte en grasopvang', paragraphs: ['Centrale hoogteverstelling is handig wanneer je de maaihoogte regelmatig verandert. Kijk naar het bereik en het aantal standen, niet alleen naar het minimum.', 'Een opvangbak vermindert los maaisel, terwijl mulchen fijn gemaaid gras op het gazon terugbrengt. Controleer of een mulchfunctie echt onderdeel is van het model of een apart accessoire vereist.'] },
      { heading: 'Accu, geluid en opslag', paragraphs: ['Bij accumodellen zijn accucapaciteit, laadtijd en compatibiliteit met ander tuingereedschap relevant. Een tweede accu kan nuttig zijn, maar verhoogt de aanschafkosten.', 'Meet de opslagruimte en controleer of de duwboom inklapbaar is. Houd rekening met gewicht wanneer je de maaier over drempels of trappen moet verplaatsen.'] },
      { heading: 'Veilig maaien en onderhoud', paragraphs: ['Verwijder stenen, speelgoed en andere voorwerpen vóór het maaien. Houd mensen en dieren uit de directe werkomgeving en volg de veiligheidsafstand uit de handleiding.', 'Maak de maaier alleen schoon volgens de instructies en zorg dat messen niet onverwacht kunnen bewegen. Controleer beschikbaarheid en kosten van messen, accu’s en andere slijtdelen.'] },
    ],
    checklist: ['Meet gazon en smalle doorgangen.', 'Kies passende maaibreedte en maaihoogte.', 'Controleer opvang- of mulchmogelijkheden.', 'Vergelijk accu, laadtijd, gewicht en opslag.', 'Bekijk onderhoud, slijtdelen en veiligheidsinstructies.'],
    sources: [
      { title: 'Milieu Centraal — Tuin', url: 'https://www.milieucentraal.nl/huis-en-tuin/tuin/', note: 'Achtergrond over onderhoud en duurzame keuzes rond de tuin.' },
      { title: 'Your Europe — Product safety', url: 'https://europa.eu/youreurope/citizens/consumers/shopping/product-safety/index_en.htm', note: 'Algemene Europese informatie over veilige consumentenproducten.' },
    ],
  },
  {
    slug: 'hogedrukreiniger-kopen', category: 'huis-tuin-klussen', title: 'Hogedrukreiniger kopen: waar let je op?',
    description: 'Kies een hogedrukreiniger op basis van schoonmaakklus, wateropbrengst, drukregeling, accessoires en onderhoud.',
    intro: 'Meer druk is niet altijd beter. Een terras, tuinmeubel, fiets en auto vragen verschillende aanpak en afstand. Kies daarom op basis van de oppervlakken die je werkelijk schoonmaakt.',
    updated: '2026-09-09', readingMinutes: 5,
    quickChoice: [
      { situation: 'Terras en bestrating', advice: 'Kijk naar voldoende wateropbrengst, passende terrasreiniger en instelbare druk voor het oppervlak.' },
      { situation: 'Fiets, tuinmeubel of auto', advice: 'Gebruik lagere druk, meer afstand en geschikte accessoires om kwetsbare onderdelen en lak te beschermen.' },
      { situation: 'Grote of regelmatige klussen', advice: 'Let op slanglengte, werkbereik, koeling, aansluitingen en hoe eenvoudig accessoires te wisselen zijn.' },
    ],
    sections: [
      { heading: 'Druk en wateropbrengst', paragraphs: ['Druk helpt vuil los te maken, terwijl wateropbrengst bepaalt hoeveel water het vuil kan afvoeren. Een losse maximale drukwaarde zegt daarom niet alles over de praktische reinigingssnelheid.', 'Kies een machine die je kunt terugregelen voor kwetsbare oppervlakken. Begin bij lagere druk en grotere afstand wanneer je niet zeker weet hoe een materiaal reageert.'] },
      { heading: 'Accessoires per klus', paragraphs: ['Een terrasreiniger kan spatten beperken en gelijkmatiger werken op bestrating. Een vuilfrees concentreert de straal en is agressiever; gebruik die niet zonder te controleren of het oppervlak daarvoor geschikt is.', 'Voor voertuigen en fietsen zijn zachte borstels of schuimaccessoires alleen nuttig wanneer ze veilig worden gebruikt. Richt een krachtige straal niet op lagers, afdichtingen, banden of elektrische componenten.'] },
      { heading: 'Werkbereik en watergebruik', paragraphs: ['Controleer lengte van hogedrukslang, netsnoer en wateraansluiting. Een langere slang kan voorkomen dat je de machine steeds verplaatst.', 'Gebruik alleen een watervoorziening en toevoer die de fabrikant toestaat. Een hogedrukreiniger kan efficiënt vuil verwijderen, maar onnodig lang doorspuiten verspilt nog steeds water.'] },
      { heading: 'Onderhoud en vorst', paragraphs: ['Maak filters en accessoires schoon volgens de handleiding en laat water uit de machine wanneer dat wordt voorgeschreven. Achtergebleven water kan bij vorst schade veroorzaken.', 'Controleer opbergmogelijkheden voor slang, pistool en sproeiers. Neem vervangende koppelingen, accessoires en eventuele reinigingsmiddelen mee in de totale kosten.'] },
    ],
    checklist: ['Noteer de oppervlakken die je wilt reinigen.', 'Vergelijk druk én wateropbrengst.', 'Kies passende en veilige accessoires.', 'Controleer slanglengte en aansluitingen.', 'Bekijk onderhoud, vorstopslag en totale kosten.'],
    sources: [
      { title: 'Your Europe — Product safety', url: 'https://europa.eu/youreurope/citizens/consumers/shopping/product-safety/index_en.htm', note: 'Algemene Europese informatie over veilige consumentenproducten.' },
      { title: 'Milieu Centraal — Huis en tuin', url: 'https://www.milieucentraal.nl/huis-en-tuin/', note: 'Achtergrond over bewust watergebruik, schoonmaken en onderhoud rond huis en tuin.' },
    ],
  },
  {
    slug: 'wandelschoenen-kopen', category: 'sport-outdoor', title: 'Wandelschoenen kopen: pasvorm, zool en gebruik',
    description: 'Kies wandelschoenen op basis van route, pasvorm, ondersteuning, grip, materiaal en weersomstandigheden.',
    intro: 'De beste wandelschoen is vooral de schoen die goed past bij jouw voeten en routes. Een zwaar, hoog model is niet automatisch beter voor een eenvoudige dagwandeling.',
    updated: '2026-09-09', readingMinutes: 5,
    quickChoice: [
      { situation: 'Stad, park en lichte paden', advice: 'Een lichte lage wandelschoen kan voldoende zijn wanneer pasvorm en grip goed aansluiten.' },
      { situation: 'Dagtochten op wisselend terrein', advice: 'Kijk naar stevigheid, zoolgrip, teenbescherming en comfort met de sokken die je echt draagt.' },
      { situation: 'Ruw terrein of zwaardere bepakking', advice: 'Meer ondersteuning kan prettig zijn, maar test of de schoen voldoende bewegingsvrijheid en comfort houdt.' },
    ],
    sections: [
      { heading: 'Pasvorm komt eerst', paragraphs: ['Probeer schoenen bij voorkeur met de wandelsokken die je gebruikt. Je tenen moeten ruimte hebben bij afdalingen zonder dat je hiel bij iedere stap omhoogkomt.', 'Voeten kunnen tijdens een lange wandeling wat uitzetten. Een maatnummer alleen is daarom onvoldoende; leest, breedte en volume verschillen per merk en model.'] },
      { heading: 'Zool en grip', paragraphs: ['Profiel, rubbersamenstelling en zoolstijfheid beïnvloeden grip en loopgevoel. Een agressief profiel is nuttig op losse ondergrond, maar kan op vlak asfalt minder soepel lopen.', 'Geen enkele zool voorkomt uitglijden in alle omstandigheden. Pas tempo en route aan bij natte stenen, modder, ijs of andere gladde ondergronden.'] },
      { heading: 'Waterdicht of ademend', paragraphs: ['Een waterdicht membraan kan vocht van buiten tegenhouden, maar schoenen drogen soms langzamer en kunnen warmer aanvoelen. Voor droge, warme omstandigheden kan meer ventilatie prettiger zijn.', 'Onderhoud materiaal volgens de fabrikant. Een versleten bovenwerk of beschadigd membraan kan de oorspronkelijke eigenschappen verminderen.'] },
      { heading: 'Inlopen en totale set', paragraphs: ['Loop nieuwe schoenen vóór een lange tocht eerst op korte routes. Let op drukpunten en vetersluiting en verander niet vlak voor een meerdaagse tocht meerdere onderdelen van je uitrusting tegelijk.', 'Neem passende sokken, eventuele inlegzolen en onderhoudsmiddelen mee in je budget. Vervang schoenen wanneer zool, demping of bovenwerk niet meer veilig en comfortabel functioneren.'] },
    ],
    checklist: ['Bepaal terrein en afstand.', 'Pas met je eigen wandelsokken.', 'Controleer teenruimte en hielsluiting.', 'Kies grip en materiaal bij je gebruiksomgeving.', 'Loop schoenen in vóór lange tochten.'],
    sources: [
      { title: 'NKBV — Kenniscentrum', url: 'https://nkbv.nl/kenniscentrum', note: 'Algemene achtergrond over voorbereiding, materiaal en veilig bewegen in buitenterrein.' },
      { title: 'Your Europe — Product safety', url: 'https://europa.eu/youreurope/citizens/consumers/shopping/product-safety/index_en.htm', note: 'Algemene Europese informatie over veilige consumentenproducten.' },
    ],
  },
  {
    slug: 'sporthorloge-kopen', category: 'sport-outdoor', title: 'Sporthorloge kopen: welke functies heb je nodig?',
    description: 'Vergelijk sporthorloges op GPS, sensoren, accuduur, sportprofielen, comfort, apps en privacy.',
    intro: 'Een sporthorloge kan training en dagelijkse activiteit inzichtelijk maken, maar meer sensoren betekenen niet automatisch betere metingen. Kies functies die aansluiten bij jouw sport en manier van trainen.',
    updated: '2026-09-09', readingMinutes: 5,
    quickChoice: [
      { situation: 'Dagelijkse activiteit en eenvoudige trainingen', advice: 'Comfort, gebruiksgemak, batterij en duidelijke basisstatistieken zijn vaak belangrijker dan tientallen sportprofielen.' },
      { situation: 'Hardlopen en fietsen', advice: 'Let op GPS-kwaliteit, ronde- en intervalfuncties, leesbaarheid tijdens bewegen en koppeling met je trainingsplatform.' },
      { situation: 'Lange outdooractiviteiten', advice: 'Kijk naar GPS-accuduur, navigatie, robuustheid, knoppenbediening en offline functies.' },
    ],
    sections: [
      { heading: 'GPS en sensoren begrijpen', paragraphs: ['GPS- en hartslagmetingen zijn schattingen en kunnen worden beïnvloed door omgeving, pasvorm, huid, beweging en algoritmen. Vergelijk daarom niet alleen de hoeveelheid sensoren maar ook relevante onafhankelijke metingen.', 'Een horloge is geen vervanging voor medische apparatuur. Gebruik gezondheidsfuncties volgens de uitleg van de fabrikant en bespreek medische vragen met een deskundige.'] },
      { heading: 'Accuduur in jouw gebruik', paragraphs: ['Een opgegeven batterijduur kan sterk verschillen tussen dagelijks gebruik, continu GPS, muziek, navigatie en een altijd-aan-scherm. Vergelijk de stand die lijkt op jouw sportgebruik.', 'Voor meerdaagse activiteiten zijn energiebesparende GPS-modi nuttig, maar die kunnen minder vaak een positie vastleggen. Bepaal welke nauwkeurigheid je nodig hebt.'] },
      { heading: 'Comfort, bediening en scherm', paragraphs: ['Een horloge dat dag en nacht gedragen wordt moet prettig zitten. Let op gewicht, bandmaat, materiaal en of bediening met natte handen of handschoenen mogelijk is.', 'Schermtype en helderheid beïnvloeden leesbaarheid buiten en batterijgebruik. Een touchscreen kan handig zijn, terwijl fysieke knoppen tijdens sport juist betrouwbaarder kunnen voelen.'] },
      { heading: 'Apps, koppelingen en privacy', paragraphs: ['Controleer of het horloge synchroniseert met de sportapps die je gebruikt en welke functies zonder betaald abonnement beschikbaar blijven. Kijk ook of je gegevens kunt exporteren wanneer je later van platform wisselt.', 'Sport- en gezondheidsdata kunnen gevoelig zijn. Bekijk privacyinstellingen, deelopties en welke cloudfuncties noodzakelijk zijn voor de functies die jij gebruikt.'] },
    ],
    checklist: ['Bepaal je belangrijkste sporten en metingen.', 'Vergelijk GPS- en batterijduur in jouw gebruiksstand.', 'Test comfort, scherm en bediening.', 'Controleer app- en sensorcompatibiliteit.', 'Bekijk privacy, abonnementen en exportmogelijkheden.'],
    sources: [
      { title: 'WHO — Physical activity', url: 'https://www.who.int/news-room/fact-sheets/detail/physical-activity', note: 'Algemene achtergrond over bewegen; geen beoordeling van een specifiek sporthorloge.' },
      { title: 'Bluetooth SIG — Learn about Bluetooth', url: 'https://www.bluetooth.com/learn-about-bluetooth/', note: 'Achtergrond over Bluetooth en koppelingen met accessoires.' },
    ],
  },
  {
    slug: 'kampeertent-kopen', category: 'sport-outdoor', title: 'Kampeertent kopen: formaat, materiaal en seizoen',
    description: 'Kies een tent op basis van aantal personen, leefruimte, weersomstandigheden, gewicht, ventilatie en opzettijd.',
    intro: 'Een tent voor een vaste campingplaats hoeft niet aan dezelfde eisen te voldoen als een tent die je kilometers in een rugzak draagt. Begin daarom bij vervoer, aantal personen en het weer waarin je kampeert.',
    updated: '2026-09-09', readingMinutes: 5,
    quickChoice: [
      { situation: 'Weekend of festival', advice: 'Snel opzetten, eenvoudige ventilatie en voldoende slaapruimte kunnen belangrijker zijn dan minimaal gewicht.' },
      { situation: 'Gezin op de camping', advice: 'Kijk naar echte slaap- en leefruimte, stahoogte, meerdere ingangen en praktische opbergvakken.' },
      { situation: 'Trekken met rugzak of fiets', advice: 'Vergelijk totaalgewicht, pakvolume, windstabiliteit en hoeveel ruimte je voor bagage binnen nodig hebt.' },
    ],
    sections: [
      { heading: 'Aantal personen en bruikbare ruimte', paragraphs: ['Een aanduiding als twee- of vierpersoonstent zegt niet hoeveel leefruimte je prettig vindt. Meet slaapmatten en houd rekening met bagage, huisdieren of kinderen.', 'Voor langer verblijf zijn stahoogte, voortent en meerdere compartimenten belangrijker dan voor één nacht. Meer ruimte betekent meestal ook meer gewicht en een groter pakvolume.'] },
      { heading: 'Weer, ventilatie en condens', paragraphs: ['Buitendoek, binnentent, ventilatieopeningen en afstand tussen de lagen beïnvloeden condens en bescherming. Waterdichtheidswaarden kunnen nuttig zijn, maar naden, opzetkwaliteit en slijtage tellen ook mee.', 'Ventileer volgens het ontwerp van de tent en voorkom dat ventilatieopeningen onnodig worden afgesloten. Condens kan ook ontstaan in een technisch waterdichte tent.'] },
      { heading: 'Gewicht en opzetten', paragraphs: ['Bij autokamperen is gewicht vaak minder belangrijk dan comfort. Voor trekking telt iedere kilo en is ook het pakvolume relevant.', 'Oefen het opzetten thuis voordat je vertrekt. Controleer of stokken, haringen en scheerlijnen logisch gemarkeerd zijn en of je de tent bij regen efficiënt kunt opzetten.'] },
      { heading: 'Onderhoud en levensduur', paragraphs: ['Laat een natte tent niet langdurig verpakt liggen. Droog hem zo snel mogelijk en reinig materiaal volgens de instructies om coating en naden niet te beschadigen.', 'Controleer beschikbaarheid van losse stokken, haringen of reparatiemateriaal. Een goed passende reparatieset kan bij langere reizen waardevoller zijn dan extra accessoires die je niet gebruikt.'] },
    ],
    checklist: ['Bepaal personen, bagage en gewenste leefruimte.', 'Kies voor camping of lichtgewicht vervoer.', 'Controleer ventilatie en weerbestendigheid.', 'Vergelijk gewicht, pakvolume en opzettijd.', 'Bekijk onderhoud en reparatiemogelijkheden.'],
    sources: [
      { title: 'NKBV — Kenniscentrum', url: 'https://nkbv.nl/kenniscentrum', note: 'Algemene achtergrond over voorbereiding, materiaal en veilig verblijf in buitenterrein.' },
      { title: 'Your Europe — Product safety', url: 'https://europa.eu/youreurope/citizens/consumers/shopping/product-safety/index_en.htm', note: 'Algemene Europese informatie over veilige consumentenproducten.' },
    ],
  },
  {
    slug: 'bordspel-kiezen', category: 'speelgoed-hobby', title: 'Bordspel kiezen: welk spel past bij jouw gezelschap?',
    description: 'Kies een bordspel op basis van spelersaantal, leeftijd, speelduur, moeilijkheid, interactie en herspeelbaarheid.',
    intro: 'Een goed bordspel past niet alleen bij een thema dat je leuk vindt, maar vooral bij de mensen met wie je speelt. Spelersaantal, uitlegduur en gewenste interactie bepalen vaak of een spel daadwerkelijk op tafel komt.',
    updated: '2026-09-09', readingMinutes: 4,
    quickChoice: [
      { situation: 'Gezin met verschillende leeftijden', advice: 'Kies duidelijke regels, een haalbare speelduur en een leeftijdsniveau waarbij iedereen actief kan meedoen.' },
      { situation: 'Twee spelers', advice: 'Controleer of het spel specifiek goed werkt met twee personen en niet alleen technisch speelbaar is.' },
      { situation: 'Groep of feest', advice: 'Kijk naar korte uitleg, gelijktijdige betrokkenheid en of veel spelers zonder lange wachttijden mee kunnen doen.' },
    ],
    sections: [
      { heading: 'Spelers en speelduur', paragraphs: ['Controleer het aanbevolen én praktische spelersaantal. Sommige spellen veranderen sterk wanneer je met twee in plaats van vier mensen speelt.', 'De vermelde speelduur begint vaak nadat iedereen de regels kent. Voor een eerste speelsessie moet je uitleg en opzetten meetellen.'] },
      { heading: 'Moeilijkheid en type interactie', paragraphs: ['Bedenk of je samen wilt werken, elkaar direct wilt dwarszitten of vooral ieder aan een eigen strategie wilt bouwen. Niet ieder gezelschap vindt dezelfde mate van competitie leuk.', 'Leeftijdsadvies geeft een eerste indicatie, maar lees ook hoeveel tekst, planning en rekenwerk nodig is. Ervaring met spellen kan minstens zo belangrijk zijn als leeftijd.'] },
      { heading: 'Herspeelbaarheid en materiaal', paragraphs: ['Variabele kaarten, scenario’s of strategieën kunnen herspeelbaarheid vergroten, maar een eenvoudig spel dat vaak gespeeld wordt kan meer waarde bieden dan een grote doos die zelden op tafel komt.', 'Controleer taal, leesbaarheid en kwaliteit van onderdelen. Voor jonge kinderen zijn kleine onderdelen en productveiligheidsinformatie extra belangrijk.'] },
      { heading: 'Opslag en uitbreidingen', paragraphs: ['Kijk naar doosformaat en hoeveelheid onderdelen wanneer opbergruimte beperkt is. Sorteerbakjes of zakjes kunnen opzetten versnellen.', 'Uitbreidingen zijn geen reden om meteen meer te kopen. Speel het basisspel eerst voldoende om te bepalen of extra inhoud echt waarde toevoegt.'] },
    ],
    checklist: ['Bepaal normaal spelersaantal.', 'Kies gewenste speelduur en moeilijkheid.', 'Bepaal competitief, coöperatief of luchtig.', 'Controleer taal, leeftijd en kleine onderdelen.', 'Koop uitbreidingen pas wanneer het basisspel bevalt.'],
    sources: [
      { title: 'Europese Commissie — Toy safety', url: 'https://single-market-economy.ec.europa.eu/sectors/toys/toy-safety_en', note: 'Officiële achtergrond over Europese veiligheidseisen voor speelgoed.' },
      { title: 'Your Europe — Product safety', url: 'https://europa.eu/youreurope/citizens/consumers/shopping/product-safety/index_en.htm', note: 'Algemene Europese informatie over veilige consumentenproducten.' },
    ],
  },
  {
    slug: 'bouwsets-kiezen', category: 'speelgoed-hobby', title: 'Bouwsets kiezen: leeftijd, moeilijkheid en interesse',
    description: 'Kies een bouwset op basis van leeftijd, bouwervaring, aantal onderdelen, thema, uitbreidbaarheid en veiligheid.',
    intro: 'Een bouwset moet genoeg uitdaging bieden zonder dat het project vooral frustrerend wordt. Leeftijd, ervaring, interesse in het thema en de manier waarop iemand graag bouwt zijn daarom belangrijker dan alleen het aantal onderdelen.',
    updated: '2026-09-09', readingMinutes: 4,
    quickChoice: [
      { situation: 'Jonge bouwer', advice: 'Kies grotere, goed hanteerbare onderdelen en een duidelijke leeftijdsaanduiding; let extra op kleine onderdelen.' },
      { situation: 'Kind met bouwervaring', advice: 'Zoek een thema dat aanspreekt en een stap omhoog in techniek zonder extreem lange bouwtijd.' },
      { situation: 'Tiener of volwassen hobbyist', advice: 'Kijk naar bouwtechniek, presentatie, uitbreidbaarheid en of het proces of het eindmodel het belangrijkst is.' },
    ],
    sections: [
      { heading: 'Leeftijd en vaardigheid', paragraphs: ['Leeftijdsaanduidingen combineren vaak veiligheid en verwachte moeilijkheid. Neem waarschuwingen over kleine onderdelen serieus en kies geen set voor jongere kinderen alleen omdat ze graag bouwen.', 'Ervaring kan betekenen dat iemand een complexere set aankan, maar lange repetitieve stappen of kleine onderdelen vragen ook geduld en fijne motoriek.'] },
      { heading: 'Instructies of vrij bouwen', paragraphs: ['Sommige bouwers willen een duidelijk eindmodel, anderen gebruiken onderdelen liever opnieuw voor eigen creaties. Kijk of de set na het eerste bouwen uitnodigt tot hergebruik.', 'Digitale instructies kunnen handig zijn, maar controleer of een app verplicht is en of een papieren of offline alternatief beschikbaar is wanneer dat belangrijk is.'] },
      { heading: 'Compatibiliteit en uitbreiden', paragraphs: ['Binnen een bouwsysteem kunnen onderdelen vaak gecombineerd worden, maar compatibiliteit is niet vanzelfsprekend tussen merken of productlijnen. Controleer dit voordat je op toekomstige uitbreidingen rekent.', 'Een groot ecosysteem kan aantrekkelijk zijn, maar koop niet vooruit. Begin met één passende set en kijk hoe vaak de onderdelen opnieuw worden gebruikt.'] },
      { heading: 'Opslag en veiligheid', paragraphs: ['Veel kleine onderdelen vragen een vaste plek om verlies en struikelgevaar te beperken. Sorteerdozen kunnen helpen wanneer sets vaker worden afgebroken en opnieuw gebouwd.', 'Controleer beschadigde onderdelen en volg veiligheidswaarschuwingen. Houd kleine onderdelen buiten bereik van kinderen voor wie ze niet bedoeld zijn.'] },
    ],
    checklist: ['Controleer leeftijds- en veiligheidsaanduiding.', 'Kies moeilijkheid bij ervaring en geduld.', 'Bepaal eindmodel of vrij bouwen.', 'Controleer compatibiliteit alleen wanneer relevant.', 'Plan opslag voor kleine onderdelen.'],
    sources: [
      { title: 'Europese Commissie — Toy safety', url: 'https://single-market-economy.ec.europa.eu/sectors/toys/toy-safety_en', note: 'Officiële achtergrond over Europese veiligheidseisen voor speelgoed.' },
      { title: 'Your Europe — Product safety', url: 'https://europa.eu/youreurope/citizens/consumers/shopping/product-safety/index_en.htm', note: 'Algemene Europese informatie over veilige consumentenproducten.' },
    ],
  },
  {
    slug: 'creatieve-hobby-beginnen', category: 'speelgoed-hobby', title: 'Creatieve hobby beginnen: welke materialen heb je nodig?',
    description: 'Begin een creatieve hobby zonder onnodige aankopen: kies een project, basisgereedschap, veilige materialen en passende werkruimte.',
    intro: 'Voor tekenen, schilderen, papierkunst of textiel hoef je niet meteen een complete professionele uitrusting te kopen. Een klein, gericht startpakket maakt het eenvoudiger om te ontdekken wat je echt gebruikt.',
    updated: '2026-09-09', readingMinutes: 4,
    quickChoice: [
      { situation: 'Tekenen en schetsen', advice: 'Begin met enkele potloden of pennen, passend papier, gum en een eenvoudige map; breid uit op basis van wat je mist.' },
      { situation: 'Schilderen', advice: 'Kies één verfsoort, enkele geschikte penselen en het juiste oppervlak; controleer schoonmaak- en ventilatie-instructies.' },
      { situation: 'Knippen, plakken en handwerk', advice: 'Start met één concreet project en koop gereedschap en materiaal dat daarvoor nodig is in plaats van een grote gemengde set.' },
    ],
    sections: [
      { heading: 'Begin met één project', paragraphs: ['Kies eerst wat je wilt maken. Daardoor kun je een korte materiaallijst samenstellen en voorkom je dat gespecialiseerde materialen ongebruikt blijven.', 'Een starterset kan handig zijn wanneer de inhoud logisch bij elkaar past. Controleer per onderdeel de hoeveelheid en kwaliteit in plaats van alleen het aantal stuks op de verpakking.'] },
      { heading: 'Materiaal past bij techniek', paragraphs: ['Papier, verf, lijm, garen en gereedschap hebben verschillende eigenschappen. Gebruik materiaal dat bedoeld is voor de gekozen techniek en volg droogtijden, temperaturen en andere instructies.', 'Professionele materialen zijn niet automatisch nodig voor een beginner. Investeer eerder in een paar betrouwbare basisproducten en voeg specialistische varianten toe wanneer je weet waarom je ze nodig hebt.'] },
      { heading: 'Veiligheid en ventilatie', paragraphs: ['Lees waarschuwingen op verf, lijm, oplosmiddelen en gereedschap. Sommige materialen vragen ventilatie, handschoenen of een beschermde ondergrond. Producten voor volwassenen zijn niet automatisch geschikt voor kinderen.', 'Bewaar scherpe gereedschappen en chemische producten veilig. Eet of drink niet op een werkplek waar materialen gebruikt worden waarvoor dat wordt afgeraden.'] },
      { heading: 'Werkplek, opruimen en hergebruik', paragraphs: ['Een afwasbare mat, goede verlichting en eenvoudige bakken maken beginnen en opruimen makkelijker. Houd materialen droog en sluit verpakkingen zoals verf en lijm goed af.', 'Bewaar bruikbare reststukken wanneer je die realistisch opnieuw gebruikt, maar voorkom dat opslag de hobby overneemt. Vul materialen pas aan wanneer je weet welke kleuren, maten of soorten je vaak gebruikt.'] },
    ],
    checklist: ['Kies één eerste project.', 'Maak een korte basis-materiaallijst.', 'Controleer waarschuwingen en ventilatie.', 'Richt een eenvoudige werk- en opruimplek in.', 'Breid pas uit wanneer je weet wat je gebruikt.'],
    sources: [
      { title: 'ECHA — Chemicals in our life', url: 'https://echa.europa.eu/chemicals-in-our-life', note: 'Algemene informatie over veilig omgaan met chemische stoffen in consumentenproducten.' },
      { title: 'Your Europe — Product safety', url: 'https://europa.eu/youreurope/citizens/consumers/shopping/product-safety/index_en.htm', note: 'Algemene Europese informatie over veilige consumentenproducten.' },
    ],
  },
]

export const editorialCategories = [...baseEditorialCategories, ...additionalEditorialCategories] as const
export const buyingGuides: BuyingGuide[] = [...baseBuyingGuides, ...additionalBuyingGuides]

export function getBuyingGuide(slug: string): BuyingGuide | undefined {
  return buyingGuides.find((guide) => guide.slug === slug)
}

export function getEditorialCategory(slug: string) {
  return editorialCategories.find((category) => category.slug === slug)
}

export function guidesForCategory(slug: string): BuyingGuide[] {
  return buyingGuides.filter((guide) => guide.category === slug)
}
