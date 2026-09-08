export type GuideSection = {
  heading: string
  paragraphs: string[]
  bullets?: string[]
}

export type BuyingGuide = {
  slug: string
  category: string
  title: string
  description: string
  intro: string
  updated: string
  readingMinutes: number
  quickChoice: { situation: string; advice: string }[]
  sections: GuideSection[]
  checklist: string[]
  sources: { title: string; url: string; note: string }[]
}

export const editorialCategories = [
  {
    slug: 'elektronica',
    title: 'Elektronica',
    description: 'Maak een bewuste keuze voor apparaten die passen bij je werk, studie en dagelijks gebruik.',
    intro: 'Een lange specificatielijst zegt niet automatisch welk apparaat het beste bij je past. Begin bij wat je ermee doet, bepaal welke eigenschappen belangrijk zijn en vergelijk daarna pas modellen en prijzen.',
    topics: ['Prestaties voor jouw gebruik', 'Comfort en dagelijks gemak', 'Aansluitingen en compatibiliteit', 'Onderhoud en levensduur'],
  },
  {
    slug: 'wonen-huishouden',
    title: 'Wonen & huishouden',
    description: 'Praktische keuzehulp voor huishoudelijke apparaten, van schoonmaken tot de was.',
    intro: 'Bij huishoudelijke apparaten tellen niet alleen de aanschafprijs en het vermogen. Formaat, energie- en waterverbruik, onderhoud en gebruiksgemak bepalen hoe prettig een apparaat op de lange termijn is.',
    topics: ['Afmetingen en capaciteit', 'Energie- en waterverbruik', 'Onderhoud en verbruikskosten', 'Geluid en gebruiksgemak'],
  },
  {
    slug: 'keuken-koffie',
    title: 'Keuken & koffie',
    description: 'Ontdek welke keukenapparaten aansluiten bij je kookgewoonten, huishouden en beschikbare ruimte.',
    intro: 'Een keukenapparaat is pas een goede aankoop wanneer je het regelmatig en met plezier gebruikt. Denk aan porties, bereidingstijd, schoonmaken en de ruimte op je aanrecht voordat je naar extra functies kijkt.',
    topics: ['Porties en capaciteit', 'Bereidingsmogelijkheden', 'Schoonmaken en onderhoud', 'Ruimte en gebruikskosten'],
  },
] as const

export const buyingGuides: BuyingGuide[] = [
  {
    slug: 'laptop-kopen', category: 'elektronica', title: 'Laptop kopen: welke past bij jouw gebruik?',
    description: 'Een praktische laptopkeuzehulp over prestaties, geheugen, scherm, accu, aansluitingen en de totale kosten.',
    intro: 'Een goede laptop is niet per se de snelste of duurste. Voor tekstverwerking en internet heb je andere eigenschappen nodig dan voor videobewerking, softwareontwikkeling of games. Begin bij je dagelijkse taken en kies daarna pas een model.',
    updated: '2026-09-08', readingMinutes: 6,
    quickChoice: [
      { situation: 'E-mail, internet en lichte studie', advice: 'Kies vooral voor een prettig scherm, voldoende geheugen, een goede accu en een comfortabel toetsenbord.' },
      { situation: 'Veel programma’s tegelijk', advice: 'Let extra op werkgeheugen, processorprestaties en een snelle SSD; controleer of geheugen later uitbreidbaar is.' },
      { situation: 'Video, 3D of veeleisende games', advice: 'Controleer de eisen van je software en kijk naar grafische prestaties, koeling, scherm en aansluitingen.' },
    ],
    sections: [
      { heading: 'Begin bij je werkzaamheden', paragraphs: ['Schrijf op welke programma’s je gebruikt en welke daarvan tegelijk openstaan. Controleer de aanbevolen systeemeisen van de zwaarste software. Een laptop die ruim genoeg is voor jouw werkzaamheden kan jarenlang prettiger blijven dan een model dat alleen op een lage prijs is gekozen.', 'Voor reizen en studie zijn gewicht, accuduur en een compact formaat belangrijk. Bij langdurig bureauwerk kunnen een groter scherm, een extern toetsenbord en een monitor juist meer comfort opleveren.'] },
      { heading: 'Processor, geheugen en opslag', paragraphs: ['De processor bepaalt mede hoe vlot berekeningen en programma’s verlopen. Vergelijk niet alleen een merknaam of het aantal kernen, maar ook de exacte processorgeneratie en onafhankelijke, relevante prestatietests.', 'Werkgeheugen helpt bij multitasken. Voor lichte taken is 8 GB soms voldoende, terwijl 16 GB vaak meer ruimte biedt voor intensiever dagelijks gebruik. Zware creatieve toepassingen kunnen meer nodig hebben. Controleer altijd de daadwerkelijke software-eisen en of het geheugen vastgesoldeerd is.', 'Een SSD zorgt voor snelle opslag en opstarttijden. Kies de capaciteit op basis van je bestanden en programma’s. Houd rekening met ruimte voor updates en controleer of opslag later kan worden uitgebreid.'] },
      { heading: 'Scherm, toetsenbord en accu', paragraphs: ['Let op schermformaat, resolutie, helderheid en ontspiegeling. Wie veel buiten of bij ramen werkt, heeft baat bij een goed afleesbaar scherm. Voor kleurkritisch werk zijn kleurdekking en kalibratie belangrijker dan alleen een hoge resolutie.', 'Probeer het toetsenbord en touchpad indien mogelijk zelf. Accuclaims van fabrikanten zijn onder verschillende omstandigheden gemeten en vormen geen garantie voor jouw gebruik. Vergelijk tests met vergelijkbare helderheid en werkzaamheden.'] },
      { heading: 'Aansluitingen en compatibiliteit', paragraphs: ['Controleer welke USB-, video- en netwerkaansluitingen je nodig hebt. Niet iedere USB-C-poort ondersteunt opladen, beeldschermuitvoer of dezelfde datasnelheid. Controleer de specificaties van het exacte model en van een eventuele dock.', 'Let ook op het besturingssysteem en de compatibiliteit met je bestaande software, printer en accessoires. Een goedkope laptop kan minder aantrekkelijk zijn wanneer je extra adapters of nieuwe software nodig hebt.'] },
      { heading: 'Vergelijk de totale aankoop', paragraphs: ['Neem garantie, reparatiemogelijkheden, accu- en opslagvervanging, eventuele softwarelicenties en noodzakelijke accessoires mee. Bekijk bij een echte aanbieding ook de verzendkosten, levertijd, retourvoorwaarden en de uiteindelijke verkoper.', 'Laat je niet leiden door een kortingspercentage zonder de actuele prijs en het exacte model te controleren. Winkelnu publiceert in deze redactionele fase nog geen live laptopprijzen of eigen prestatietests.'] },
    ],
    checklist: ['Noteer je belangrijkste programma’s en systeemeisen.', 'Bepaal hoeveel geheugen en SSD-ruimte je werkelijk nodig hebt.', 'Controleer scherm, toetsenbord, gewicht en aansluitingen.', 'Vergelijk accutests onder vergelijkbare omstandigheden.', 'Controleer uitbreidbaarheid, garantie en reparatiemogelijkheden.', 'Bereken de totale prijs inclusief noodzakelijke accessoires.'],
    sources: [
      { title: 'Microsoft — Windows 11-specificaties en systeemvereisten', url: 'https://www.microsoft.com/nl-nl/windows/windows-11-specifications', note: 'Basisvereisten voor Windows; applicaties kunnen zwaardere eisen stellen.' },
      { title: 'Apple — Mac-modellen vergelijken', url: 'https://www.apple.com/nl/mac/compare/', note: 'Controleer de actuele specificaties van een exact Mac-model bij de fabrikant.' },
    ],
  },
  {
    slug: 'hoofdtelefoon-kopen', category: 'elektronica', title: 'Hoofdtelefoon kopen: waar let je op?',
    description: 'Kies een hoofdtelefoon op basis van draagcomfort, geluidskwaliteit, noise cancelling, verbinding en batterij.',
    intro: 'Of je nu in de trein zit, thuiswerkt of muziek luistert: draagcomfort en gebruikssituatie zijn minstens zo belangrijk als technische specificaties. Deze gids helpt je bepalen welke eigenschappen de moeite waard zijn.',
    updated: '2026-09-08', readingMinutes: 5,
    quickChoice: [
      { situation: 'Reizen en woon-werkverkeer', advice: 'Let op draagcomfort, actieve ruisonderdrukking, accuduur en een stevige opbergmogelijkheid.' },
      { situation: 'Thuiswerken en videogesprekken', advice: 'Test microfoonkwaliteit, multipoint-verbindingen en comfort bij langdurig dragen.' },
      { situation: 'Thuis muziek luisteren', advice: 'Vergelijk klank, pasvorm en een bedrade aansluiting; noise cancelling is niet altijd nodig.' },
    ],
    sections: [
      { heading: 'Over-ear, on-ear of in-ear', paragraphs: ['Over-ear modellen omsluiten je oren en kunnen comfortabel zijn bij langdurig gebruik, maar nemen meer ruimte in. On-ear modellen rusten op de oren en zijn vaak compacter. In-ear modellen zijn klein en geschikt voor onderweg, maar de pasvorm verschilt sterk per persoon.', 'Een goede afsluiting kan achtergrondgeluid verminderen zonder elektronische ruisonderdrukking. Probeer verschillende pasvormen en oorkussens wanneer mogelijk. Een comfortabel model is niet automatisch het model met de beste specificaties.'] },
      { heading: 'Actieve ruisonderdrukking en veiligheid', paragraphs: ['Actieve ruisonderdrukking, vaak ANC genoemd, gebruikt microfoons en elektronische verwerking om omgevingsgeluid te verminderen. De werking verschilt per model en per type geluid. Vooral aanhoudende lage geluiden kunnen goed worden verminderd; stemmen en onverwachte geluiden verdwijnen niet altijd.', 'Een transparantiemodus kan omgevingsgeluid doorlaten. Gebruik je hoofdtelefoon zo dat je verkeerssignalen en andere belangrijke waarschuwingen kunt blijven waarnemen. Ruisonderdrukking is geen gehoorbescherming en vervangt geen daarvoor gecertificeerde beschermingsmiddelen.'] },
      { heading: 'Geluid en microfoon', paragraphs: ['Geluidsvoorkeuren zijn persoonlijk. Een neutrale klank, extra bas of juist een heldere weergave kan voor verschillende luisteraars prettig zijn. Vergelijk bij voorkeur dezelfde muziek op een gelijkwaardig volume en beoordeel ook hoe het geluid bij zacht luisteren klinkt.', 'Voor bellen is de microfoon minstens zo belangrijk als de luidsprekers. Zoek naar onafhankelijke voorbeelden in een stille én rumoerige omgeving. Een hoge resolutieclaim of een groot frequentiebereik zegt op zichzelf weinig over de ervaren geluidskwaliteit.'] },
      { heading: 'Bluetooth, kabel en compatibiliteit', paragraphs: ['Controleer welke Bluetooth-codecs, multipointfuncties en aansluitingen daadwerkelijk door zowel je hoofdtelefoon als je telefoon of computer worden ondersteund. Een codec alleen garandeert geen betere klank of lagere vertraging.', 'Voor games en muziekproductie kan een geschikte bedrade of speciale draadloze verbinding nuttig zijn om vertraging te beperken. Controleer of een audiokabel ook werkt wanneer de accu leeg is en of de microfoon dan beschikbaar blijft.'] },
      { heading: 'Accu, onderhoud en totale kosten', paragraphs: ['Fabrikanten meten accuduur onder verschillende omstandigheden. ANC, volume, codec en gesprekken kunnen het verbruik beïnvloeden. Vergelijk daarom tests met een vergelijkbare meetmethode.', 'Kijk of oorkussens, kabels en accu vervangbaar zijn en wat onderdelen kosten. Controleer garantie en retourvoorwaarden. Een hoofdtelefoon die je prettig draagt en kunt onderhouden is vaak een betere keuze dan een model met functies die je nooit gebruikt.'] },
    ],
    checklist: ['Kies het type dat bij je gebruik en pasvorm past.', 'Probeer het draagcomfort bij voorkeur langere tijd.', 'Vergelijk ANC en microfoons met relevante tests.', 'Controleer Bluetooth- en kabelcompatibiliteit.', 'Bekijk accuduur onder vergelijkbare omstandigheden.', 'Controleer vervangbare onderdelen en de totale aankoopprijs.'],
    sources: [
      { title: 'WHO — Deafness and hearing loss: safe listening', url: 'https://www.who.int/news-room/questions-and-answers/item/deafness-and-hearing-loss-safe-listening', note: 'Achtergrond over veilig luisteren en het beperken van blootstelling aan hard geluid.' },
      { title: 'Bluetooth SIG — Learn about Bluetooth', url: 'https://www.bluetooth.com/learn-about-bluetooth/', note: 'Algemene uitleg over Bluetooth-technologie en compatibiliteit.' },
    ],
  },
  {
    slug: 'stofzuiger-kopen', category: 'wonen-huishouden', title: 'Stofzuiger kopen: welke soort past bij je huis?',
    description: 'Vergelijk sledestofzuigers, steelstofzuigers en robotstofzuigers op vloer, gebruiksgemak, onderhoud en kosten.',
    intro: 'Een stofzuiger die prettig werkt op een harde vloer is niet automatisch de beste keuze voor hoogpolig tapijt of een huis met veel trappen. Bepaal eerst hoe je schoonmaakt en welke ondergronden je hebt.',
    updated: '2026-09-08', readingMinutes: 6,
    quickChoice: [
      { situation: 'Grondig schoonmaken van meerdere vloertypen', advice: 'Bekijk een sledestofzuiger met geschikte vloerzuigmonden, voldoende bereik en goede stofopvang.' },
      { situation: 'Snel tussendoor en veel trappen', advice: 'Een lichte steelstofzuiger kan handig zijn; controleer gewicht, accuduur en reinigingsprestaties.' },
      { situation: 'Regelmatig onderhoud van open vloeren', advice: 'Een robotstofzuiger kan aanvullen, maar vervangt niet in ieder huis het handmatig schoonmaken.' },
    ],
    sections: [
      { heading: 'Kies eerst het type', paragraphs: ['Een sledestofzuiger heeft doorgaans een aparte stofopvangunit en een slang. Hij is geschikt voor langere schoonmaakbeurten, maar moet worden meegesleept. Een steelstofzuiger is vaak snel te pakken en gemakkelijk te verplaatsen, maar gewicht, opvangcapaciteit en accuduur kunnen beperkingen zijn.', 'Een robotstofzuiger kan zelfstandig onderhoudsrondes uitvoeren. Drempels, kabels, speelgoed, hoogpolig tapijt en moeilijk bereikbare hoeken kunnen de werking beperken. Controleer de afmetingen en navigatiemogelijkheden voor jouw woning.'] },
      { heading: 'Vloeren, haren en reinigingsprestaties', paragraphs: ['Harde vloeren, tapijt en meubels vragen verschillende zuigmonden en borstels. Voor tapijt en dierenharen is de werking van de gemotoriseerde borstel belangrijk. Controleer of borstels gemakkelijk te reinigen zijn en of lange haren zich snel vastdraaien.', 'Een hoog opgegeven motorvermogen of een losse zuigkrachtwaarde vertelt niet hoe goed een stofzuiger op jouw vloer schoonmaakt. Kijk naar onafhankelijke praktijktests met vergelijkbare ondergronden en zuigmonden.'] },
      { heading: 'Stofopvang en filtratie', paragraphs: ['Een stofzak kan het legen hygiënischer maken en houdt stof in een gesloten zak. Een zakloos model bespaart de aanschaf van zakken, maar de stofbak moet regelmatig worden geleegd en gereinigd. De beste keuze hangt af van je voorkeur en gevoeligheid voor stof.', 'Let op de filtratie van het hele apparaat, niet alleen op de naam van één filter. Voor mensen met allergieën kan een goed afgesloten systeem met geschikte filtratie nuttig zijn. Een filterlabel alleen bewijst niet hoeveel stof het complete apparaat terug de kamer in blaast.'] },
      { heading: 'Bereik, accu en geluid', paragraphs: ['Controleer het werkbereik van een snoermodel, inclusief snoer en slang. Voor een steelstofzuiger zijn gewicht in de hand, accuduur op de gebruikte stand en eventuele vervangbaarheid van de accu belangrijk. De maximale accuduur wordt vaak op een lichte stand gemeten en is niet representatief voor iedere schoonmaakbeurt.', 'Vergelijk geluidsmetingen alleen wanneer de meetmethode overeenkomt. Probeer indien mogelijk hoe gemakkelijk de stofzuiger onder meubels komt en of hij stabiel kan worden opgeborgen.'] },
      { heading: 'Onderhoud en kosten', paragraphs: ['Neem stofzakken, filters, borstels en een eventuele vervangende accu mee in je berekening. Controleer of onderdelen verkrijgbaar zijn en hoe eenvoudig je het apparaat kunt reinigen.', 'Bij robotstofzuigers kunnen extra functies zoals een leegstation, dweilsysteem of app de prijs en onderhoudskosten verhogen. Kies deze alleen wanneer ze je daadwerkelijk tijd besparen. Winkelnu toont momenteel geen eigen testwinnaars of actuele stofzuigerprijzen.'] },
    ],
    checklist: ['Inventariseer vloertypen, tapijt en dierenharen.', 'Bepaal of je een hoofdapparaat of een aanvulling zoekt.', 'Controleer gewicht, bereik en accuduur op relevante standen.', 'Vergelijk reinigingsprestaties in onafhankelijke tests.', 'Bekijk filtratie, stofopvang en onderhoudsgemak.', 'Bereken kosten van zakken, filters, borstels en accu.'],
    sources: [
      { title: 'Milieu Centraal — Stofzuiger', url: 'https://www.milieucentraal.nl/energie-besparen/apparaten-in-huis/stofzuiger/', note: 'Achtergrond over energie, gebruik en duurzame keuzes bij stofzuigers.' },
      { title: 'European Commission — Ecodesign for vacuum cleaners', url: 'https://energy-efficient-products.ec.europa.eu/product-list/vacuum-cleaners_en', note: 'Informatie over Europese productregels; controleer de actuele toepasselijkheid per apparaatcategorie.' },
    ],
  },
  {
    slug: 'wasmachine-kopen', category: 'wonen-huishouden', title: 'Wasmachine kopen: capaciteit, energie en gebruiksgemak',
    description: 'Een wasmachine kiezen met aandacht voor vulgewicht, energielabel, waterverbruik, geluid, programma’s en onderhoud.',
    intro: 'Een wasmachine koop je voor jarenlang gebruik. Kijk daarom verder dan de aanschafprijs: de juiste capaciteit, het energie- en waterverbruik, het geluid en de plaats in huis zijn minstens zo belangrijk.',
    updated: '2026-09-08', readingMinutes: 6,
    quickChoice: [
      { situation: 'Klein huishouden met beperkte was', advice: 'Kies een capaciteit die past bij je gebruik en voorkom dat je structureel een veel te grote machine koopt.' },
      { situation: 'Gezin met veel wasgoed', advice: 'Let op voldoende trommelruimte, programma’s voor verschillende stoffen en de totale kosten per gebruik.' },
      { situation: 'Wasmachine in een kleine of open ruimte', advice: 'Controleer exacte afmetingen, geluidsniveau bij centrifugeren en de mogelijkheden om de machine stabiel te plaatsen.' },
    ],
    sections: [
      { heading: 'Welk vulgewicht heb je nodig?', paragraphs: ['Het vulgewicht geeft aan hoeveel droog wasgoed de machine bij het daarvoor bedoelde programma kan verwerken. Een grotere trommel is handig voor veel wasgoed of grote stukken, maar is niet automatisch zuiniger voor een klein huishouden.', 'Kijk naar je werkelijke wasgewoonten. Een klein huishouden kan vaak met een compactere capaciteit uit de voeten, terwijl een gezin met veel was ruimte nodig heeft. Controleer ook de maximale belading van speciale programma’s: die kan lager zijn dan de nominale capaciteit.'] },
      { heading: 'Het Europese energielabel begrijpen', paragraphs: ['Het huidige Europese energielabel voor huishoudelijke wasmachines gebruikt de schaal A tot en met G. Het vermeldt onder meer het energieverbruik per 100 cycli van het eco 40-60-programma, het waterverbruik per cyclus, de nominale capaciteit, programmaduur en het geluidsniveau bij centrifugeren.', 'Vergelijk energiecijfers van machines met een capaciteit die bij je huishouden past. De werkelijke kosten hangen af van hoe vaak je wast, gekozen programma’s, belading en je energie- en watertarieven. Een zuinig label betekent niet dat ieder afzonderlijk programma hetzelfde verbruikt.'] },
      { heading: 'Programma’s, centrifugeren en geluid', paragraphs: ['Controleer of de machine programma’s heeft voor de stoffen die je gebruikt. Snelle programma’s, een stoomfunctie of automatische dosering kunnen handig zijn, maar zijn geen noodzakelijke functies voor iedereen. Lees welke beperkingen voor belading en temperatuur gelden.', 'Een hoger maximaal centrifugetoerental kan helpen om meer water uit wasgoed te verwijderen, maar de daadwerkelijke restvochtigheid en geschiktheid voor de stof zijn belangrijker dan het toerental alleen. Bekijk de centrifugeerklasse en geluidsgegevens op het label.'] },
      { heading: 'Afmetingen en plaatsing', paragraphs: ['Meet de beschikbare breedte, hoogte en diepte. Houd rekening met slangen, deurzwaai, ventilatie en de ruimte die de fabrikant voorschrijft. Controleer of de machine door deuren, gangen en trappen past.', 'Een stabiele, vlakke plaatsing en het verwijderen van transportbouten volgens de handleiding zijn belangrijk. Laat elektrische en wateraansluitingen zo nodig door een vakbekwame installateur controleren. Stapel een droger alleen met een geschikte, door de fabrikant toegestane oplossing.'] },
      { heading: 'Onderhoud, garantie en totale kosten', paragraphs: ['Reinig filters, lade en trommel volgens de handleiding en controleer regelmatig de deurrubber en slangen. De juiste dosering wasmiddel en passende programma’s helpen onnodig verbruik en vervuiling te voorkomen.', 'Vergelijk de totale aankoopprijs inclusief bezorging, installatie, afvoer van een oud apparaat en eventuele accessoires. Kijk naar garantie, onderdelen en reparatiemogelijkheden. Een groot kortingspercentage zegt niets over de werkelijke prijs-kwaliteitverhouding zonder een actuele prijsvergelijking.'] },
    ],
    checklist: ['Bepaal je gebruikelijke hoeveelheid was en passend vulgewicht.', 'Vergelijk kWh per 100 eco 40-60-cycli en water per cyclus.', 'Controleer programmaduur, centrifugeerklasse en geluid.', 'Meet de volledige plaatsingsruimte inclusief aansluitingen.', 'Bekijk onderhoud, garantie en beschikbaarheid van onderdelen.', 'Neem bezorging, installatie en afvoer mee in de totale prijs.'],
    sources: [
      { title: 'Europese Commissie — Washing machines and washer-dryers', url: 'https://energy-efficient-products.ec.europa.eu/product-list/washing-machines-and-washer-dryers_en', note: 'Officiële uitleg over energielabels en productvereisten.' },
      { title: 'EPREL — Europese productdatabase', url: 'https://eprel.ec.europa.eu/', note: 'Controleer het energielabel en het productinformatieblad van een exact model.' },
      { title: 'Milieu Centraal — Wasmachine', url: 'https://www.milieucentraal.nl/energie-besparen/apparaten-in-huis/wasmachine/', note: 'Praktische achtergrond over energiezuinig wassen en gebruik.' },
    ],
  },
  {
    slug: 'koffiezetapparaat-kopen', category: 'keuken-koffie', title: 'Koffiezetapparaat kopen: van filter tot volautomaat',
    description: 'Kies een koffiezetapparaat op basis van smaak, gebruiksgemak, onderhoud, hoeveelheid koffie en terugkerende kosten.',
    intro: 'Een koffiezetapparaat moet aansluiten bij hoe je koffie drinkt. Zet je vooral een volle kan, wil je met één druk op de knop espresso of vind je het leuk om zelf te experimenteren? Het antwoord bepaalt welk type zinvol is.',
    updated: '2026-09-09', readingMinutes: 6,
    quickChoice: [
      { situation: 'Meerdere koppen gewone koffie', advice: 'Een filterkoffiezetapparaat is vaak praktisch en overzichtelijk in gebruik.' },
      { situation: 'Snel één kop met weinig handelingen', advice: 'Een capsule- of padsysteem kan handig zijn; vergelijk de terugkerende kosten en afvalstromen.' },
      { situation: 'Verse bonen en automatisch espresso', advice: 'Een volautomaat biedt gemak, maar vraagt regelmatig reinigen en onderhoud.' },
      { situation: 'Zelf controle over espresso', advice: 'Een halfautomaat met geschikte molen biedt veel instelmogelijkheden en vraagt meer oefening.' },
    ],
    sections: [
      { heading: 'De belangrijkste soorten', paragraphs: ['Filterkoffieapparaten zetten koffie door heet water langs gemalen koffie te laten lopen. Ze zijn geschikt voor wie meerdere koppen tegelijk wil zetten. Een thermoskan kan helpen de koffie warm te houden zonder voortdurend een warmhoudplaat te gebruiken.', 'Capsule- en padsystemen zijn gericht op gemak en consistente porties. Let op de beschikbaarheid, prijs en compatibiliteit van de benodigde capsules of pads. Een volautomaat maalt meestal zelf bonen en zet koffie met weinig handelingen, maar is doorgaans groter en onderhoudsintensiever.', 'Een halfautomaat geeft je zelf controle over het malen, doseren en zetten. Dat kan aantrekkelijk zijn voor een hobbyist, maar een geschikte koffiemolen en enige oefening zijn belangrijk voor een goed resultaat.'] },
      { heading: 'Smaak en instelmogelijkheden', paragraphs: ['Smaak wordt beïnvloed door bonen, maling, water, temperatuur, verhouding en zetmethode. Een duur apparaat garandeert geen koffie die jij lekkerder vindt. Bepaal of je vooral een betrouwbare dagelijkse kop zoekt of graag zelf instellingen verandert.', 'Kijk bij espressoapparaten naar de praktische instelmogelijkheden en de kwaliteit van de molen. Een hoge pompdruk op de verpakking is op zichzelf geen bewijs van betere espresso. Voor melkdranken zijn het type melkopschuimer en het schoonmaakgemak belangrijk.'] },
      { heading: 'Hoeveel koffie zet je?', paragraphs: ['Let op de capaciteit van het waterreservoir, de bonen- of koffiebak en de hoeveelheid koffie die je achter elkaar wilt zetten. Voor een huishouden met meerdere koffiedrinkers kan een apparaat met een grotere capaciteit prettig zijn.', 'Wanneer je vooral af en toe één kop drinkt, kan een groot apparaat onnodig veel ruimte innemen. Controleer ook de opwarmtijd en of je verschillende kopgroottes kunt instellen.'] },
      { heading: 'Schoonmaken en ontkalken', paragraphs: ['Koffieresten, melk en kalk vragen regelmatig onderhoud. Lees vóór aankoop welke onderdelen je dagelijks en periodiek moet reinigen. Sommige zetgroepen zijn uitneembaar, andere apparaten gebruiken een automatisch reinigingsprogramma. Beide systemen hebben onderhoud nodig.', 'Gebruik de door de fabrikant aanbevolen reinigingsmiddelen en ontkalkingsmethode. De waterhardheid in jouw omgeving en het gebruik beïnvloeden de onderhoudsfrequentie. Melksystemen verdienen extra aandacht voor hygiëne.'] },
      { heading: 'Terugkerende kosten en duurzaamheid', paragraphs: ['Bereken niet alleen de aanschafprijs, maar ook de kosten van koffie, filters of capsules, reinigingsmiddelen en eventuele waterfilters. De kosten per kop verschillen sterk per systeem en gekozen koffie.', 'Controleer of onderdelen, zoals een kan, zetgroep of melkreservoir, verkrijgbaar zijn. Kies een formaat en systeem dat je daadwerkelijk gebruikt. Een goed te onderhouden apparaat kan aantrekkelijker zijn dan een model met veel extra functies die ongebruikt blijven.'] },
    ],
    checklist: ['Bepaal hoeveel koppen je meestal achter elkaar zet.', 'Kies tussen gemak en zelf controle over het zetproces.', 'Controleer ruimte, waterreservoir en eventuele molen.', 'Bekijk reiniging, ontkalking en melksysteemonderhoud.', 'Bereken koffie- en onderhoudskosten per gebruik.', 'Controleer garantie, onderdelen en eventuele systeemcompatibiliteit.'],
    sources: [
      { title: 'Milieu Centraal — Water koken en koffiezetten', url: 'https://www.milieucentraal.nl/energie-besparen/apparaten-in-huis/water-koken-en-koffiezetten/', note: 'Officiële achtergrond over energieverbruik, warmhouden en het voorkomen van verspilling bij koffiezetten.' },
      { title: 'Specialty Coffee Association — Coffee Standards', url: 'https://sca.coffee/research/coffee-standards', note: 'Algemene achtergrond over koffie- en zetstandaarden; geen endorsement van een specifiek apparaat.' },
    ],
  },
  {
    slug: 'airfryer-kopen', category: 'keuken-koffie', title: 'Airfryer kopen: capaciteit, functies en onderhoud',
    description: 'Een airfryer kiezen met aandacht voor porties, luchtcirculatie, bakresultaat, energieverbruik en schoonmaken.',
    intro: 'Een airfryer is een compacte heteluchtoven die hete lucht rond het eten laat circuleren. Het apparaat kan handig zijn voor kleine porties en krokante bereidingen, maar de juiste keuze hangt af van je huishouden en kookgewoonten.',
    updated: '2026-09-08', readingMinutes: 5,
    quickChoice: [
      { situation: 'Eén of twee personen', advice: 'Een compact model kan voldoende zijn; controleer de bruikbare mandinhoud in plaats van alleen de opgegeven liters.' },
      { situation: 'Grotere porties of een gezin', advice: 'Bekijk het bruikbare bakoppervlak en of meerdere porties tegelijk passen zonder de luchtcirculatie te blokkeren.' },
      { situation: 'Twee gerechten tegelijk', advice: 'Een model met twee zones kan handig zijn, maar vraagt meer aanrechtruimte en is niet voor iedereen nodig.' },
    ],
    sections: [
      { heading: 'Wat doet een airfryer precies?', paragraphs: ['Een airfryer verwarmt en circuleert lucht rond het voedsel. Daardoor kunnen sommige gerechten met weinig toegevoegde olie krokant worden. Het is geen traditionele friteuse en de smaak en textuur verschillen per gerecht, hoeveelheid en bereidingsmethode.', 'Niet ieder gerecht wordt automatisch gezonder door een airfryer te gebruiken. De ingrediënten, portiegrootte, toegevoegde olie en bereidingstemperatuur blijven belangrijk. Volg voedselveiligheids- en bereidingsinstructies voor het betreffende product.'] },
      { heading: 'Capaciteit en bruikbaar bakoppervlak', paragraphs: ['De opgegeven inhoud in liters vertelt niet precies hoeveel eten je in één keer goed kunt bereiden. Een brede mand kan voor bepaalde gerechten praktischer zijn dan een diepe mand met hetzelfde volume. Vergelijk daarom ook de afmetingen van het bakoppervlak en de aanbevolen porties.', 'Een te volle mand kan de luchtcirculatie beperken en tot ongelijkmatige bereiding leiden. Voor grotere hoeveelheden zijn soms meerdere rondes nodig. Bedenk of een gewone oven voor jouw gebruik handiger is.'] },
      { heading: 'Temperatuur, programma’s en functies', paragraphs: ['Controleer het temperatuurbereik, de timer en de instelmogelijkheden. Voorgeprogrammeerde standen kunnen handig zijn, maar zijn geen garantie dat ieder gerecht goed lukt. De hoeveelheid, begintemperatuur en vorm van het voedsel beïnvloeden de bereiding.', 'Een dubbele mand of twee kookzones kan verschillende gerechten tegelijk bereiden. Let op de daadwerkelijke capaciteit per zone en of de bediening past bij jouw gebruik. Extra accessoires hebben alleen waarde wanneer je ze regelmatig gebruikt.'] },
      { heading: 'Energieverbruik en bereidingstijd', paragraphs: ['Een kleine heteluchtoven kan bij kleine porties voordelen hebben doordat minder ruimte hoeft te worden verwarmd. Dat betekent niet dat iedere airfryer altijd minder energie verbruikt dan iedere oven. Het werkelijke verbruik hangt af van vermogen, opwarmtijd, bereidingsduur en de hoeveelheid eten.', 'Vergelijk apparaten op basis van dezelfde bereiding en portie. Een hoog wattage betekent niet automatisch een hoger totaalverbruik: een apparaat dat korter werkt kan anders uitkomen. Gebruik het opgegeven vermogen niet als enige maatstaf voor energiezuinigheid.'] },
      { heading: 'Schoonmaken, ruimte en veiligheid', paragraphs: ['Meet de ruimte op je aanrecht en houd de vrije ruimte aan die de fabrikant voorschrijft voor ventilatie. Controleer of de mand en losse onderdelen gemakkelijk schoon te maken zijn en of ze volgens de handleiding in de vaatwasser mogen.', 'De buitenkant, mand en uitstromende lucht kunnen heet worden. Gebruik het apparaat op een geschikte hittebestendige ondergrond en volg de veiligheidsinstructies. Controleer ook de snoerlengte, garantie en beschikbaarheid van vervangende onderdelen.'] },
    ],
    checklist: ['Bepaal je gebruikelijke porties en bruikbare bakoppervlak.', 'Controleer afmetingen en benodigde ventilatieruimte.', 'Kies alleen extra functies die je werkelijk gebruikt.', 'Vergelijk energieverbruik bij vergelijkbare bereidingen.', 'Bekijk schoonmaakgemak en onderdelen.', 'Controleer veiligheidsinstructies, garantie en totale prijs.'],
    sources: [
      { title: 'Voedingscentrum — Veilig eten', url: 'https://www.voedingscentrum.nl/nl/thema/veilig-eten.aspx', note: 'Algemene informatie over veilig bewaren en bereiden van voedsel.' },
      { title: 'Milieu Centraal — Energie besparen in de keuken', url: 'https://www.milieucentraal.nl/energie-besparen/apparaten-in-huis/', note: 'Achtergrond over energieverbruik van huishoudelijke apparaten.' },
    ],
  },
]

export function getBuyingGuide(slug: string): BuyingGuide | undefined {
  return buyingGuides.find((guide) => guide.slug === slug)
}

export function getEditorialCategory(slug: string) {
  return editorialCategories.find((category) => category.slug === slug)
}

export function guidesForCategory(slug: string): BuyingGuide[] {
  return buyingGuides.filter((guide) => guide.category === slug)
}
