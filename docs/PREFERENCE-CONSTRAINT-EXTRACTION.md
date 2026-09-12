# M0.52 — Preference & Constraint Extraction v1

## Doel

Winkelnu moet niet alleen begrijpen **wat** iemand zoekt en **waarvoor**, maar ook welke eigenschappen de bezoeker letterlijk belangrijk maakt.

Voorbeeld:

`lichte laptop voor studie met minimaal 16 GB RAM en lange accuduur`

wordt opgesplitst in:

- productterm: `laptop`
- gebruikscontext: `studie`
- voorkeur: `lichtgewicht`
- voorkeur: `lange accuduur`
- concrete grens: `minimaal 16 GB geheugen`

De productterm blijft schoon voor catalogussearch; de overige informatie blijft beschikbaar voor Vergelijkkompas.

## Geen verborgen profiel

De extractor werkt uitsluitend op de actuele zoekvraag. Er wordt geen persoonlijk profiel, visitor-ID, sessieprofiel of langdurige voorkeurenlijst opgebouwd.

## Twee soorten signalen

### Zachte voorkeuren

Zachte voorkeuren veranderen de volgorde en nadruk in Vergelijkkompas, maar sluiten producten niet uit.

Voorbeelden:

- `licht`, `lichte`, `lichtgewicht` → Gewicht, lager is relevant
- `lange accuduur` → Accuduur, hoger is relevant
- `compact`, `klein formaat` → Afmetingen
- `stil`, `weinig geluid` → Geluid wanneer een bruikbaar specificatieveld aanwezig is
- `noise cancelling`, `ruisonderdrukking`, `ANC` → Ruisonderdrukking
- `grote capaciteit`, `veel inhoud` → Capaciteit
- `veel functies` → Functies
- `veel geheugen` → Geheugen
- `veel opslag` → Opslag

Expliciet genoemde voorkeuren krijgen voorrang op bredere afgeleide context zoals `voor studie` of `voor werk`.

### Concrete criteria

Concrete criteria kunnen per geselecteerd product als voldaan / niet voldaan / onbekend worden beoordeeld wanneer de productspecificatie veilig leesbaar is.

V1 ondersteunt onder meer:

- `maximaal 1,5 kg`
- `minimaal 10 uur accuduur`
- `minimaal 16 GB RAM`
- `minimaal 512 GB opslag`
- `twee lades`
- `minimaal 2 zones`
- `minimaal 8 liter inhoud`
- `maximaal 60 dB`
- vereiste ruisonderdrukking / ANC

## Unknown-first

Ontbrekende of niet veilig parseerbare productinformatie krijgt altijd status `unknown`.

Dus:

`gewicht ontbreekt` ≠ `te zwaar`

`accuduur ontbreekt` ≠ `te kort`

`prijs ontbreekt` ≠ `boven budget`

Dit voorkomt schijnzekerheid bij onvolledige affiliatefeeds.

## Eenheden

De evaluator kan voor concrete criteria enkele veelvoorkomende eenheden normaliseren:

- gram ↔ kilogram
- minuten / uren / dagen
- GB ↔ TB
- ml ↔ liter
- aantallen
- dB

Bronwaarden blijven zichtbaar; normalisatie dient alleen om een expliciet criterium veilig te toetsen.

## Search-koppeling

`stripPreferenceConstraintContext()` verwijdert alleen contextwoorden die daadwerkelijk door de preference-extractor zijn herkend.

Daarom wordt:

`grote airfryer met twee lades`

voor catalogussearch:

`airfryer`

terwijl `grote capaciteit` en `2 lades` beschikbaar blijven als vergelijkcontext.

We strippen dus niet globaal woorden zoals `grote`, `opslag` of `geheugen`; ze worden alleen verwijderd wanneer de volledige query een herkend preference/constraint-signaal bevat.

## Vergelijkkompas-koppeling

De bestaande application-adapter combineert:

1. expliciete voorkeuren en concrete criteria;
2. gebruikscontext uit Zoekkompas;
3. producttypeprofiel uit Vergelijkkompas.

Prioriteitsvolgorde:

`expliciete wens → expliciete grens → gebruikscontext → standaard producttypeprofiel`

Er ontstaat geen totaalscore, matchpercentage of automatische winnaar.

## UI

Wanneer context beschikbaar is, toont Vergelijkkompas:

- de oorspronkelijke zoekvraag;
- herkende voorkeuren;
- context die werkelijk kan worden toegepast;
- herkende maar nog niet meetbare voorkeuren;
- extra relevante vergelijkvelden;
- bij concrete criteria per product: `Voldoet`, `Voldoet niet` of `Nog onbekend`.

## Grenzen van v1

- kwalitatieve woorden als `mooi`, `premium`, `beste` of `goed` worden niet als betrouwbare productspecificatie geïnterpreteerd;
- `compact` kan een rij prioriteren maar krijgt pas een objectieve winnaar als afmetingen veilig vergelijkbaar zijn;
- `stil` kan alleen worden toegepast wanneer de productdata een bruikbaar geluid-/dB-veld bevat;
- voorkeuren filteren de zoekresultaten nog niet hard;
- er wordt geen AI-model gebruikt.

## Later

Met echte merchantfeeds kan dezelfde structuur worden uitgebreid met gestandaardiseerde attributen en meer productgroepen. Hard filteren op een criterium mag pas wanneer de datakwaliteit per attribuut aantoonbaar betrouwbaar genoeg is.
