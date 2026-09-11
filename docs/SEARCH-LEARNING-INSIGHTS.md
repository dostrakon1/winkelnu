# Winkelnu Search Learning Insights v1

## Doel

Search Learning Insights voegt geen tweede dashboard toe. Het breidt de bestaande afgeschermde operatoromgeving uit met een aparte zoekanalyse-route:

`/intern/operations/search`

De pagina gebruikt dezelfde Supabase-authenticatie, operator-allowlist en rollen als `/intern/operations`.

## Databron

De pagina leest uitsluitend de geaggregeerde rolling 90-day view:

`search_feedback_query_summary`

De view komt uit migration `0021_search_feedback_learning_signals.sql` en bevat per genormaliseerde zoekvraag:

- aantal zoekopdrachten;
- aantal zoekopdrachten met 0 resultaten;
- predictive-suggestion clicks;
- beste-match clicks;
- product clicks;
- herformuleringen;
- laatste signaaltijd;
- opportunity score.

De pagina leest geen IP-adres, user-agent fingerprint, visitor-ID, cookie-ID of sessieprofiel. Zulke velden bestaan niet in de learning store.

## Schermen

### Kernmetrics

- unieke zoekvragen;
- zoekopdrachten;
- 0-resultaatratio;
- nuttige kliks;
- herformuleringen;
- live suggestiekliks.

### Verbeterprioriteit

Gesorteerd op de bestaande deterministische opportunity score:

`0-resultaten × 6 + herformuleringen × 3 + zoekopdrachten - nuttige kliks`

Deze score is uitsluitend een werklijst voor menselijke analyse. Hij verandert geen ranking automatisch.

V1 introduceert bewust nog geen labels als `kritiek`, `hoog` of `laag` op basis van willekeurige vaste grenzen. Zulke thresholds worden pas toegevoegd nadat echte Winkelnu-zoekdata voldoende basis geeft om ze te kalibreren.

### 0-resultaatvragen

Laat zien waar Winkelnu mogelijk productdata, aliases, taxonomy, content of rankinglogica mist.

### Sterke zoekroutes

Laat queries zien waarop bezoekers daadwerkelijk een predictive suggestion, Beste match of product openen.

### Recent gezien

Geeft de meest recent waargenomen geaggregeerde zoekvragen binnen de 90-dagenwindow.

## Filters

De interne operator kan queryregels tekstueel filteren. Dit filtert alleen geaggregeerde zoekvragen; er is geen visitor- of sessiefilter.

## Architectuurgrens

Search Learning Insights is read-only. De pagina mag geen taxonomy, aliases, content of rankingparameters zelfstandig wijzigen.

De verbeterflow blijft:

`signaal -> inzicht -> voorstel -> test/evaluatie -> menselijke/CI-goedkeuring -> release`
