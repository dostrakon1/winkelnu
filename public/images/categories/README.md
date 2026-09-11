# Winkelnu categorie-afbeeldingen

Deze map is de enige bron voor redactionele categorie-afbeeldingen.

## Vaste conventie

Gebruik altijd:

`<categorie-slug>-hero.webp`

Voorbeelden:

- `elektronica-hero.webp`
- `baby-kind-hero.webp`
- `dieren-hero.webp`
- `auto-fiets-hero.webp`

De categorie-slug en bestandsnaam horen exact bij elkaar. Er is geen handmatige padregistratie meer nodig: vóór iedere build scant Winkelnu deze map en genereert automatisch `src/generated/category-image-manifest.ts`.

Een correct genoemd bestand wordt daarna via dezelfde resolver gebruikt op de categoriekaart, categoriepagina en waar relevant in metadata. Ontbreekt een bestand, dan blijft de bestaande visuele fallback beschikbaar.

## Aanbevolen masterkwaliteit

Voor nieuwe of vervangende categoriebeelden:

- verhouding: 4:3;
- aanbevolen master: 1600×1200 px;
- formaat: WebP;
- standaard kwaliteit: 84;
- geen zichtbare merken of watermerken tenzij inhoudelijk bewust gekozen;
- behoud een nette compositie die ook bij `object-fit: cover` werkt.

Kleinere bestaande, al goedgekeurde beelden blijven toegestaan totdat ze bewust vanuit een betere bron worden vervangen. Niet kunstmatig opschalen.

## Nieuwe of vervangende afbeelding

Gebruik de vaste pipeline:

```bash
npm run image:prepare -- --input ~/Downloads/bron.png --type category --name baby-kind
npm run check:images
```

De output wordt automatisch:

`public/images/categories/baby-kind-hero.webp`

`image:prepare` optimaliseert via ImageMagick wanneer beschikbaar. Ook een aangeleverde WebP wordt dan opnieuw gestript en geoptimaliseerd. De controle valideert vervolgens de bestandsnaam, WebP, minimale technische kwaliteit en 4:3-verhouding.

Open het gegenereerde beeld altijd visueel vóór commit/push. Technische controles kunnen niet beoordelen of de gekozen scène inhoudelijk de juiste is.

Zie `docs/IMAGE-PIPELINE.md` voor de volledige werkwijze.
