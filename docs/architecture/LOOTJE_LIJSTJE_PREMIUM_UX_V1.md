# Lootje & Lijstje — Premium UX v1

## Doel

Premium UX v1 maakt van `/lootje-lijstje` één herkenbare productervaring binnen Winkelnu, zonder de bewezen gifting-logica, privacygrenzen of databasecontracten opnieuw te ontwerpen.

De upgrade wordt in vier veilige stappen uitgerold:

1. Gift Shell & Design System
2. Landing & Onboarding
3. Groepsbeheer & Deelnemersflow
4. Reveal, cadeauflow & mobile polish

## Visuele richting

- Winkelnu blijft het moedermerk.
- Petrol, crème, wit en warm oranje blijven de primaire kleuren.
- Rustige, premium oppervlakken in plaats van dashboard-achtige drukte.
- Duidelijke primaire actie per scherm.
- Mobiel is leidend, omdat uitnodigingen vaak via WhatsApp worden geopend.
- Motion blijft subtiel en respecteert `prefers-reduced-motion`.

## Stap 1 — Gift Shell & Design System

Deze eerste upgradeversie introduceert:

- een compacte, sticky Lootje & Lijstje-header;
- een minimale gifting-footer;
- routebewuste navigatie voor Start, Lijstje en Groep/Mijn groep;
- een expliciete weg terug naar Winkelnu;
- een scoped gifting-palet, spacing, shadows en surface-tokens;
- premium refinements voor bestaande buttons, inputs en headings;
- herbruikbare primitives: `GiftSurface`, `GiftKicker`, `GiftStatusPill`, `GiftSectionHeading` en `GiftProgress`;
- het verwijderen van de tijdelijke release-diagnoselogging uit de route-layout.

De bestaande pagina's blijven in deze stap hun eigen businesslogica en server actions renderen. Hun legacy Winkelnu-header en footer worden alleen visueel onderdrukt door de route-shell, zodat er geen dubbele navigatie ontstaat.

## Niet in stap 1

- geen wijzigingen aan trekking-algoritme;
- geen wijzigingen aan capability cookies of recovery tokens;
- geen nieuwe databasekolommen of migraties;
- geen accounts of login;
- geen AI/chat/prijsalerts;
- geen volledige pagina-redesigns; die volgen in stap 2–4.

## Acceptatiecriteria stap 1

- alle `/lootje-lijstje`-routes tonen één consistente premium shell;
- er verschijnt geen dubbele Winkelnu-header/footer;
- bestaande formulieren en server actions blijven functioneel;
- release-gate blijft fail-closed;
- gifting-route blijft dynamic server-rendered;
- layout bevat geen tijdelijke secret/flag diagnose-output;
- CI lint, typecheck, tests en build zijn groen.
