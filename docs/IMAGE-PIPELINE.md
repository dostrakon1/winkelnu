# Winkelnu Image Architecture v1

Doel: categorie-afbeeldingen één keer correct plaatsen en ze daarna automatisch op alle relevante Winkelnu-oppervlakken gebruiken, zonder losse padregistraties of tijdelijke cache-busterbestanden.

## Kernregel

Voor categoriebeelden is `public/images/categories/` de enige bron.

Bestandsnaam:

`<categorie-slug>-hero.webp`

Voorbeeld:

`dieren` → `public/images/categories/dieren-hero.webp`

Vóór iedere build scant `scripts/generate-category-image-manifest.mjs` deze map en genereert `src/generated/category-image-manifest.ts`. `src/content/category-images.ts` leidt het uiteindelijke pad daarna uitsluitend uit de categorie-slug af.

Daardoor hoeft bij een nieuwe categorie-afbeelding geen pad meer in TypeScript te worden toegevoegd. Alleen uitzonderingen, zoals een afwijkende `object-position` of bewust specifiekere alt-tekst, horen nog in de override-laag.

## Waar hetzelfde categoriebeeld wordt gebruikt

De centrale resolver kan hetzelfde masterbeeld leveren aan:

- categoriekaarten;
- categoriepagina hero;
- OpenGraph/social metadata;
- toekomstige componenten die `getCategoryImage()` gebruiken.

Ontbreekt een correct genoemd bestand in het gegenereerde manifest, dan geeft de resolver `undefined` terug en kan de bestaande Winkelnu Surface Motif als fallback worden gebruikt.

## Aanbevolen master

Nieuwe of vervangende categoriebeelden:

- WebP;
- 4:3;
- bij voorkeur 1600×1200 px;
- standaard WebP-kwaliteit 84;
- metadata gestript;
- geen kunstmatige upscaling van een kleine bron;
- compositie geschikt voor `object-fit: cover`.

Bestaande goedgekeurde beelden met een lagere resolutie of andere verhouding blijven technisch toegestaan. Vervang of snijd ze alleen opnieuw wanneer een betere originele bron beschikbaar is; verander bestaand goedgekeurd beeldmateriaal niet automatisch om alleen aan een nieuwe standaard te voldoen.

## Snel gebruik

Categoriebeeld:

```bash
npm run image:prepare -- --input ~/Downloads/baby.png --type category --name baby-kind
npm run check:images
```

Algemene hero:

```bash
npm run image:prepare -- --input ~/Downloads/hero.jpg --type hero --name voorjaar
```

Sectiebeeld:

```bash
npm run image:prepare -- --input ~/Downloads/foto.webp --type section --name keuzehulp
```

De output wordt automatisch op de vaste plek gezet:

- `category` → `public/images/categories/<naam>-hero.webp`
- `hero` → `public/images/heroes/<naam>-hero.webp`
- `section` → `public/images/sections/<naam>.webp`

## Wat `image:prepare` doet

Wanneer ImageMagick beschikbaar is:

- auto-orientation;
- maximale breedte 1600 px zonder kunstmatig vergroten;
- metadata strippen;
- WebP kwaliteit 84;
- WebP compressiemethode 6;
- technische WebP-validatie;
- voor nieuwe categoriebeelden: 4:3 afdwingen;
- waarschuwing geven wanneer een nieuwe master kleiner is dan 1200×900.

Ook een aangeleverde WebP wordt opnieuw geoptimaliseerd wanneer ImageMagick aanwezig is. Zonder ImageMagick kan een bestaande WebP nog steeds worden overgenomen, maar dan zonder hercompressie.

Op Pop!_OS/Ubuntu:

```bash
sudo apt install imagemagick
```

## Automatische build-koppeling

`npm run build` heeft een `prebuild`-stap die het categoriebeeldmanifest opnieuw genereert. Daardoor is de mapinhoud tijdens iedere Vercel-build leidend.

`npm run check:images` genereert hetzelfde manifest opnieuw en controleert daarna alle WebP-bestanden in de categoriemap op:

- vaste naamconventie;
- geldige WebP-header;
- leesbare afmetingen;
- minimale technische kwaliteit.

De controle meldt ook welke bestaande beelden nog afwijken van de nieuwe voorkeursstandaard van 4:3 en 1600×1200. Zulke legacy-afwijkingen zijn een waarschuwing, geen automatische crop of blokkade. Nieuwe categoriebeelden die via `image:prepare` binnenkomen worden wel op 4:3 afgedwongen.

De GitHub Quality-workflow voert `check:images` vóór lint, typecheck, tests en build uit.

## Verplichte visuele controle

Technische validatie kan niet beoordelen of een afbeelding inhoudelijk klopt. Volg bij vervanging daarom:

1. originele bron openen en visueel controleren;
2. `image:prepare` uitvoeren;
3. gegenereerde WebP openen;
4. `npm run check:images` uitvoeren;
5. commit/push;
6. preview controleren;
7. productie controleren.

Gebruik geen tijdelijke bestandsnamen zoals `*-definitief-hero.webp` om browsercache te omzeilen. De canonieke slug-bestandsnaam blijft altijd leidend.

## Praktisch resultaat

Voor een normale categorie is de workflow voortaan:

1. kies de categorie-slug;
2. voer één bronafbeelding door `image:prepare`;
3. commit het gegenereerde `<slug>-hero.webp`;
4. deploy.

Er is geen extra TypeScript-padregistratie nodig.
