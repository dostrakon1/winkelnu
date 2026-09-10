# Winkelnu Hero Style Guide v1.0

Status: **actief**  
Scope: homepage, hoofdcategorieën en toekomstige hero-uitbreidingen  
Doel: nieuwe hero-afbeeldingen en hero-layouts laten voelen alsof ze uit één vaste Winkelnu-campagneshoot komen.

## 1. Kernprincipe

**De foto geeft emotie; de Winkelnu-gradient geeft het merk.**

Hero-afbeeldingen vervangen de Winkelnu-vormgeving niet. Ze vormen een lifestylelaag binnen dezelfde crème-, groen- en petrolwereld. Tekst, navigatie en CTA's blijven altijd belangrijker dan het beeld.

## 2. Visuele identiteit

Elke Winkelnu-hero moet realistisch, warm, modern, vrolijk, rustig en betrouwbaar aanvoelen. Het beeld ondersteunt ontdekken, oriënteren, vergelijken en bewust kiezen.

Gebruik bij voorkeur:

- natuurlijk daglicht;
- warme maar neutrale witbalans, niet geel;
- crème, zacht groen, petrol, hout en natuurlijke materialen;
- moderne Nederlandse/Europese lifestyle-omgevingen;
- echte gebruiksmomenten in plaats van geposeerde reclamebeelden;
- menselijke aanwezigheid wanneer dat de categorie natuurlijker en levendiger maakt.

Vermijd:

- neon of extreem verzadigde kleuren;
- harde donkere fotografie;
- studiofoto's op een effen achtergrond;
- overdreven luxe/fashion-campagnestijl;
- stockfoto-achtige poses en onnatuurlijke glimlachen;
- tekst of slogans in de afbeelding;
- herkenbare winkelketens, merklogo's of andere commerciële branding.

## 3. Compositie

De standaard hero is breed en landschappelijk.

- Houd ongeveer **40–45% van de linkerzijde rustig** als tekstveilige zone.
- Plaats het belangrijkste onderwerp voornamelijk rechts of rechts van het midden.
- Zet geen gezicht, product of belangrijk detail direct achter headline, bodytekst of CTA's.
- De scène moet ook na een responsive crop herkenbaar blijven.
- Een duidelijke focal point aan de rechterzijde heeft de voorkeur.

De homepage gebruikt de algemene winkelwereld als universele Winkelnu-hero. Hoofdcategorieën gebruiken inhoudelijk passende scènes binnen exact dezelfde beeldtaal.

## 4. Beeldbehandeling in de website

Een hero-foto wordt nooit kaal als volledige achtergrond gebruikt. De vaste lagen zijn:

1. `WinkelnuHero` basis met `--wn-gradient-welcome`;
2. lifestyle-afbeelding met responsive `object-position` en gecontroleerde opacity;
3. crème/groen/petrol readability-overlay die links sterker is dan rechts;
4. subtiele Winkelnu glow;
5. contentlaag met eyebrow, headline, bodytekst, CTA's en eventueel een ondersteunende glass-card.

De linker tekstzone moet op alle breakpoints voldoende contrast behouden. Het beeld mag zichtbaar en sfeervol zijn, maar nooit concurreren met de inhoud.

## 5. Glass-cards op hero-afbeeldingen

Wanneer een informatieve kaart over het beeld staat, gebruikt Winkelnu geen hard wit blok. Gebruik een zachte, transparante crème/groene glass-behandeling met:

- circa **60–65%** achtergronddekking als richtwaarde;
- ongeveer **10–14px backdrop blur**;
- subtiele lichte border;
- zachte petrol-getinte schaduw;
- donkere tekst voor voldoende leesbaarheid.

De exacte waarden mogen per foto licht worden aangepast, maar de kaart moet zichtbaar deel blijven van de scène in plaats van de achtergrond volledig te verbergen.

## 6. Responsive gedrag

Desktop is de primaire brede compositie. Op mobiel:

- behoud de tekst als eerste informatielaag;
- crop rond het belangrijkste focal point;
- verlaag de beeldsterkte wanneer tekstcontrast dat vereist;
- voorkom dat een persoon of essentieel onderwerp volledig buiten beeld valt;
- gebruik pas een aparte `-mobile` asset wanneer één bronbeeld niet betrouwbaar genoeg cropt.

Mobiele variant indien nodig:

`hero-<slug>-mobile.webp`

## 7. Bestandsstructuur en naamgeving

Hero-assets staan in:

`public/images/heroes/`

De naam beschrijft de vaste rol op de site, niet de toevallige inhoud van de foto. Hierdoor kan een afbeelding later worden vervangen zonder de architectuur te wijzigen.

Vaste startset:

- `hero-home.webp` — algemene shopping-/winkelwereld;
- `hero-elektronica.webp` — moderne tech-/elektronicaomgeving;
- `hero-wonen-huishouden.webp` — warme interieur-/woonsetting;
- `hero-keuken-koffie.webp` — lichte keuken-/koffiesetting;
- `hero-persoonlijke-verzorging.webp` — rustige self-care-/badkameromgeving;
- `hero-sport-outdoor.webp` — actieve buiten-/natuuromgeving;
- `hero-tuin-klussen.webp` — zonnige tuin-/klusomgeving.

Nieuwe categorieën volgen hetzelfde patroon, bijvoorbeeld:

- `hero-huisdieren.webp`
- `hero-gaming.webp`
- `hero-baby-gezin.webp`

## 8. Technische basis

Herbruikbaar component:

`src/components/storefront/winkelnu-hero.tsx`

Hero-afbeeldingen worden met `next/image` geladen. De homepage-hero mag `priority` gebruiken; niet-kritieke hero's moeten dit alleen krijgen wanneer daar een concrete performance-redenen voor bestaan.

Nieuwe pagina's moeten de bestaande hero-architectuur hergebruiken in plaats van per pagina een los achtergrond- en overlaysysteem te bouwen.

## 9. Categorie-uitbreiding

Voor iedere toekomstige categorie veranderen alleen onderwerp en scène. De volgende onderdelen blijven herkenbaar Winkelnu:

- fotografie- en lichtstijl;
- rustige compositie;
- tekstveilige linkerzone;
- crème/groen/petrol beeldbehandeling;
- vorm, ritme en typografie van de hero;
- naamgevings- en assetstructuur.

Zo kan de collectie onbeperkt groeien zonder dat Winkelnu visueel uiteenvalt.

## 10. Implementatiefasen

**Stap A — Homepage**  
Universele Winkelnu-shoppingfoto en het herbruikbare hero-component.

**Stap B — Hoofdcategorieën**  
Elektronica, Wonen & huishouden, Keuken & koffie, Persoonlijke verzorging, Sport & outdoor en Tuin & klussen.

**Stap C — Verdere pagina's**  
Koopgidsen, vergelijken en Over Winkelnu wanneer dat inhoudelijk en visueel passend is.

## 11. Reviewregel

Een nieuwe hero wordt pas definitief wanneer minimaal desktop en mobiel visueel zijn gecontroleerd op:

- leesbaarheid;
- crop/focal point;
- merkconsistentie;
- rust in de tekstzone;
- balans tussen foto en gradient;
- correcte performance en assetgrootte.
