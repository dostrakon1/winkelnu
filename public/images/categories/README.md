# Winkelnu categorie-afbeeldingen

Deze map bevat de negen door de eigenaar goedgekeurde redactionele categorie-afbeeldingen.

Gebruik exact deze bestandsnamen:

- `elektronica-hero.webp`
- `wonen-huishouden-hero.webp`
- `keuken-koffie-hero.webp`
- `persoonlijke-verzorging-hero.webp`
- `huis-tuin-klussen-hero.webp`
- `sport-outdoor-hero.webp`
- `speelgoed-hobby-hero.webp`
- `baby-kind-hero.webp`
- `dieren-hero.webp`

De code is gekoppeld via `src/content/category-images.ts`. Alle negen gepubliceerde redactionele categorieën hebben daarmee een eigenaar-goedgekeurd beeld; de Winkelnu Surface Motif blijft alleen beschikbaar als technische fallback voor toekomstige categorieën waarvoor nog geen passend beeld is goedgekeurd.

Voor `persoonlijke-verzorging-hero.webp` gebruiken we de goedgekeurde warme badkamerscène met elektrische tandenborstel en scheerapparaat. Voor `huis-tuin-klussen-hero.webp` gebruiken we de goedgekeurde zonnige tuinscène met grasmaaier en trimmer, niet de eerdere afbeelding met witte achtergrond. Voor `baby-kind-hero.webp` gebruiken we de goedgekeurde warme babykamerscène met beige kinderwagen. Voor `dieren-hero.webp` gebruiken we de goedgekeurde warme huiskamerscène met golden retriever in een hondenmand en kat op een krabpaal.

## Nieuwe of vervangende afbeelding

Gebruik voortaan de vaste image pipeline:

```bash
npm run image:prepare -- --input ~/Downloads/bron.png --type category --name baby-kind
npm run check:images
```

Open de gegenereerde WebP altijd visueel vóór commit/push en controleer na deploy ook de productie-URL met een cache-buster. Technische validatie alleen kan een inhoudelijk verkeerde of volledig witte afbeelding niet uitsluiten.

Zie `docs/IMAGE-PIPELINE.md` voor de volledige procedure.
