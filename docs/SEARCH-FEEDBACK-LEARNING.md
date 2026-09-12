# Search Feedback & Learning Signals v1

## Doel

M0.48 geeft Winkelnu een privacy-minimale feedbacklus voor de zoekmachine. De laag verzamelt voldoende signalen om slechte of onduidelijke zoekervaringen terug te vinden, zonder bezoekers te volgen met een account, cookie, browseropslag of persistent bezoekers-ID.

De feedbacklaag verandert rankings **niet automatisch**. Verbeteringen blijven via code, tests, review en GitHub Quality lopen.

## Signalen

Winkelnu onderscheidt vijf gebeurtenissen:

- `search_performed` — een zoekresultatenweergave; `zero_results` geeft aan dat er geen concreet productresultaat was.
- `predictive_clicked` — een live suggestie uit Zoekkompas is gekozen.
- `best_match_clicked` — een categorie, subcategorie, koopgids of collectie uit de universele Beste matches is gekozen.
- `product_clicked` — een product vanuit Beste matches of de normale zoekresultatengrid is geopend.
- `search_refined` — een bestaande zoekvraag is direct vervangen door een andere zoekvraag.

## Privacygrens

De tabel bevat bewust geen:

- IP-adres;
- user-agent fingerprint;
- cookie-ID;
- localStorage- of sessionStorage-ID;
- account- of visitor-ID;
- externe referrer;
- advertentieprofiel.

Zoektekst wordt vóór opslag genormaliseerd. Waarschijnlijke e-mailadressen, URL's en langere telefoonnummers worden vervangen door `redacted`. De API accepteert alleen een klein, vast schema en interne target-identiteiten.

## Bewaartermijn

`SEARCH_FEEDBACK_RETENTION_DAYS` staat op 90 dagen. Na een geslaagde feedbackinsert verwijdert de server gebeurtenissen ouder dan die grens. De query-summary kijkt uitsluitend naar de laatste 90 dagen.

Dit is bewust geen langlopend bezoekersprofiel: er is geen identifier waarmee gebeurtenissen over tijd aan dezelfde bezoeker kunnen worden gekoppeld.

## Database

Migration `0021_search_feedback_learning_signals.sql` voegt toe:

- `search_feedback_events` — append-achtige learning events;
- RLS;
- expliciete revoke voor `public`, `anon` en `authenticated`;
- beperkte service-role toegang;
- indexes op query, eventtype en tijd;
- `search_feedback_query_summary` — rolling 90-day queryaggregatie.

De summary bevat per genormaliseerde query onder meer:

- searches;
- zero-result searches;
- predictive clicks;
- best-match clicks;
- product clicks;
- refinements;
- last seen;
- opportunity score.

## Opportunity score

De score is een **prioriteringssignaal**, geen rankingfactor:

```text
zero_result_searches × 6
+ refinements × 3
+ searches
- useful clicks
```

Een hoge score betekent: deze zoekvraag verdient waarschijnlijk menselijke of gecontroleerde technische aandacht.

Voorbeelden van vervolgstappen kunnen zijn:

- nieuw alias toevoegen;
- taxonomy verbeteren;
- koopgids koppelen;
- typo-vocabulaire verbeteren;
- ontbrekende productfeed herkennen;
- rankingregel testen.

## Clientgedrag

Feedback wordt best-effort verzonden met `navigator.sendBeacon` en valt terug op `fetch(..., keepalive: true)`. Een mislukte feedbackcall mag navigatie of zoeken nooit blokkeren.

De live predictive zoeklaag blijft lokaal draaien; M0.48 voegt dus geen API-call per toetsaanslag toe. Alleen een daadwerkelijke keuze, resultaatweergave of herformulering veroorzaakt een feedbackevent.

## Veiligheidsregel voor zelfverbetering

M0.48 is de observatielaag voor latere gecontroleerde self-improvement:

```text
signaal
→ opportunity
→ voorstel
→ test/evaluatie
→ menselijke/CI-goedkeuring
→ release
```

Er is in v1 geen pad van een bezoekerssignaal rechtstreeks naar een productie-rankingwijziging.
