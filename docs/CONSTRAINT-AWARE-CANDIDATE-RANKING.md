# M0.53 — Constraint-Aware Candidate Ranking v1

## Doel

Winkelnu gebruikt expliciete voorkeuren en controleerbare criteria uit de natuurlijke zoekvraag om concrete productkandidaten beter te ordenen. De bestaande catalogusrelevantie blijft de eerste poort; M0.53 herordent alleen relevante kandidaten op basis van bewijsbare productdata.

Voorbeeld:

`lichte laptop voor studie met minimaal 16 GB RAM en minstens 10 uur accuduur`

wordt inhoudelijk opgesplitst in:

- productterm: `laptop`
- context: `voor studie`
- zachte voorkeur: `lichtgewicht`
- hard criterium: minimaal 16 GB geheugen
- hard criterium: minimaal 10 uur accuduur

## Rankingprincipes

M0.53 gebruikt geen algemene persoonlijke matchscore en kiest geen winnaar voor de bezoeker.

De volgorde is:

1. bestaande catalogus-/tekstrelevantie bepaalt welke producten kandidaat zijn;
2. bekende harde matches krijgen een duidelijke positieve boost;
3. bekende harde mismatches mogen lager eindigen;
4. ontbrekende specificaties zijn altijd neutraal;
5. zachte voorkeuren geven alleen een gematigde relatieve boost wanneer meerdere kandidaten dezelfde eigenschap meetbaar bekend hebben;
6. commerciële beschikbaarheid blijft een kleine tie-breaker in de Universal Search-laag en vervangt inhoudelijke relevantie niet.

### Harde criteria

In v1:

- match: `+32`
- miss: `-16`
- onbekend: `0`

Een onbekende waarde is dus expliciet niet hetzelfde als een mismatch.

### Zachte voorkeuren

Een zachte voorkeur zoals `lichtgewicht` of `lange accuduur` wordt alleen onder bekende waarden relatief beoordeeld. De beste bekende waarde kan maximaal 14 punten extra krijgen. Een kandidaat zonder die specificatie krijgt 0 punten, geen straf.

## Candidate window vóór paginering

Production search gebruikt het Supabase read model als schaalbare eerste rankinglaag. M0.53 sorteert bewust niet alleen de al geopende pagina opnieuw.

Flow:

`database relevance gate → beperkte candidate window → preference/constraint evidence → herordening → paginering`

Voor contextgevoelige relevantie haalt `ScalableCatalogService` maximaal 96 relevante kandidaten op. De database-RPC staat maximaal 97 rijen toe zodat één lookahead voor `hasNext` mogelijk blijft.

Daarmee kan bijvoorbeeld kandidaat #31 met aantoonbaar 16 GB RAM alsnog pagina 1 bereiken wanneer kandidaat #1 aantoonbaar slechts 8 GB RAM heeft.

Buiten het contextvenster en bij expliciete sorteringen zoals prijs of A–Z blijft de normale databasepaginering leidend. Een zoekvoorkeur mag dus nooit stilletjes een door de bezoeker gekozen sorteervolgorde overschrijven.

## Attribute evidence bridge

M0.53 voegt de ontbrekende technische brug toe waarmee productspecificaties dezelfde route kunnen volgen als het product zelf:

`affiliate feed → FeedCandidate → canonical Product → Supabase products.specifications → catalog_ranked_products → Search / Vergelijkkompas`

`FeedCandidate` ondersteunt daarom optioneel:

- `specifications`
- `visualKind`

Specificaties worden vóór opslag begrensd en opgeschoond:

- maximaal 80 label/value-paren;
- label maximaal 120 tekens;
- value maximaal 500 tekens;
- lege waarden worden genegeerd;
- dubbele labels worden binnen één feedrecord verwijderd.

Een sparse tweede merchantfeed zonder specificaties mag bestaande bekende specificaties van hetzelfde canonieke product niet leegmaken. Daarom worden `specifications` en `visual_kind` alleen in de upsert meegenomen wanneer de inkomende kandidaat ze werkelijk levert.

## Database

Migration `0022_product_attribute_evidence.sql` voegt toe aan `products`:

- `specifications jsonb not null default '[]'`
- `visual_kind text`

De ranking-RPC retourneert beide velden server-side aan de catalogusreadlaag. De RPC blijft niet toegankelijk voor `anon` of `authenticated`; alleen `service_role` krijgt execute-recht.

## Universal Search

De gemengde `Winkelnu beste matches` gebruikt dezelfde evidence-laag. Een product kan daar bijvoorbeeld uitleggen:

`Past aantoonbaar bij je vraag: Minimaal 16 GB geheugen · Lichtgewicht`

Dit is een reden, geen marketingclaim als `beste voor jou`.

## Geen hard filtering in v1

M0.53 sluit een product niet uit omdat een specification ontbreekt of een criterium niet haalt. Het beïnvloedt alleen de volgorde bij `relevance`.

Reden: affiliatefeeds verschillen sterk in volledigheid. Hard filteren wordt pas verantwoord wanneer Winkelnu per attribuut/feed voldoende coverage en betrouwbaarheid kan aantonen.

## Toekomstige uitbreiding

Een volgende versie kan per merchant/feed attribuutkwaliteit meten, conflicterende bronwaarden normaliseren en pas bij voldoende coverage optionele harde filters aanbieden. Wijzigingen aan rankingregels blijven via tests, GitHub Quality en expliciete goedkeuring lopen; gedrag muteert niet autonoom in productie.
