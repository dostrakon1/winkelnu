# Black Friday & Cyber Monday Campaign Architecture v1

## Doel

Black Friday en Cyber Monday vormen binnen Winkelnu één commerciële campagnefamilie met twee publieke zoekintenties. De campagne gebruikt dezelfde centrale engine-principes als de seizoenslaag, maar heeft een dynamische kalenderregel omdat de datum ieder jaar verschuift.

## Publieke routes

De canonieke publieke routes vallen onder de tijdelijke collectielaag:

- `/collecties/black-friday`
- `/collecties/cyber-monday`

De voormalige top-level routes blijven uitsluitend als permanente redirects bestaan:

- `/black-friday` → `/collecties/black-friday`
- `/cyber-monday` → `/collecties/cyber-monday`

Zo blijven bestaande links bruikbaar, terwijl alle tijdelijke themacampagnes publiek onder `/collecties` gegroepeerd zijn. De canonieke collectiepagina's blijven permanent beschikbaar en indexeerbaar. De campagnebalk, homepage-spotlight en megamenu-highlight worden alleen tijdens de actieve campagneperiode geactiveerd.

## Datumregel

Black Friday is de vrijdag na de vierde donderdag van november. Cyber Monday is de maandag erna.

De engine berekent voor ieder jaar automatisch:

1. Preview start: 11 dagen vóór Black Friday.
2. Black Friday Week: maandag vóór Black Friday.
3. Black Friday: berekende vrijdag.
4. Black Friday Weekend: zaterdag en zondag erna.
5. Cyber Monday: drie dagen na Black Friday.

Voor 2026 betekent dit:

- Preview: 16 november 2026
- Black Friday Week: 23 november 2026
- Black Friday: 27 november 2026
- Black Friday Weekend: 28–29 november 2026
- Cyber Monday: 30 november 2026

## Prioriteit ten opzichte van seizoenscampagnes

De commerce-eventlaag krijgt voorrang boven de bestaande Seasonal Campaign Layer. Hierdoor kan Sinterklaas van 1 november tot 5 december blijven bestaan, terwijl Black Friday/Cyber Monday van 16 tot en met 30 november tijdelijk de campagnebalk en homepage-spotlight overneemt. Vanaf 1 december kan Sinterklaas automatisch weer zichtbaar worden.

## Control Center

Route: `/intern/operations/campaigns`

v1 toont:

- automatisch berekende campagnekalender;
- huidige campagnefase;
- campagne aan/uit-status uit codeconfiguratie;
- publieke Black Friday- en Cyber Monday-links;
- bestaande seizoenscampagnes ter controle;
- jaarselector voor planning van toekomstige jaren.

## Persistence-roadmap

De datumregel en publieke pagina's zijn onafhankelijk van database-persistence. Een volgende Control Center-laag kan overrides opslaan voor:

- handmatige start- en einddatum;
- enabled/disabled;
- hero- en bannertekst;
- CTA;
- uitgelichte categorieën;
- merchants/deals;
- campagne-KPI's zoals bezoekers, outbound clicks, conversies en commissie.

Een handmatige override mag later nooit de automatische kalenderlogica verwijderen; de automatische regel blijft de fallback.

## Productdata

v1 bevat geen dummydeals en geen verzonnen prijzen. De pagina's sturen bezoekers naar bestaande koopgidsen en, als de publieke catalogus beschikbaar is, naar bestaande productzoekroutes. Echte deals worden pas zichtbaar zodra gecontroleerde partnerfeeddata beschikbaar is.

## Architectuurprincipes

- Eén campagnefamilie, twee publieke SEO-routes onder `/collecties`.
- Legacy top-level routes blijven als permanente redirects bestaan.
- Automatische kalender als bron van waarheid met toekomstige override-mogelijkheid.
- Commerce-events hebben tijdelijke presentatieprioriteit boven overlappende seizoenscampagnes.
- Geen nieuwe microservice of aparte repository.
- Geen afhankelijkheid van AI om de campagne correct te laten functioneren.
- Geen dummyprijzen of ongecontroleerde kortingsclaims.
