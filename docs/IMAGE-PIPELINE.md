# Winkelnu Image Pipeline v1

Doel: een nieuwe afbeelding voortaan in één vaste, controleerbare flow verwerken zodat een verkeerd formaat, beschadigd bestand of verkeerde bestandsnaam niet pas op productie wordt ontdekt.

## Snel gebruik

Voor een categorie-afbeelding:

```bash
npm run image:prepare -- --input ~/Downloads/baby.png --type category --name baby-kind
```

Voor een algemene hero:

```bash
npm run image:prepare -- --input ~/Downloads/hero.jpg --type hero --name voorjaar
```

Voor een sectiebeeld:

```bash
npm run image:prepare -- --input ~/Downloads/foto.webp --type section --name keuzehulp
```

De output wordt automatisch op de vaste plek gezet:

- `category` → `public/images/categories/<naam>-hero.webp`
- `hero` → `public/images/heroes/<naam>-hero.webp`
- `section` → `public/images/sections/<naam>.webp`

## Wat het script controleert

- veilige bestandsnaam;
- echte WebP-header (`RIFF` + `WEBP`);
- leesbare WebP-afmetingen;
- minimale resolutie van 500×300;
- minimum bestandsgrootte van 5 KB;
- vaste map- en naamconventie.

PNG/JPG wordt via ImageMagick naar WebP geconverteerd, standaard met kwaliteit 82 en maximaal 1600 px. Op Pop!_OS/Ubuntu is ImageMagick eenmalig te installeren met:

```bash
sudo apt install imagemagick
```

Een aangeleverde WebP heeft geen ImageMagick nodig.

## Verplichte visuele controle

Technische validatie kan niet beoordelen of een afbeelding inhoudelijk klopt of bijvoorbeeld volledig wit is. Daarom geldt voor iedere vervanging deze volgorde:

1. bronbestand openen en visueel controleren;
2. `image:prepare` uitvoeren;
3. gegenereerde WebP lokaal openen en visueel controleren;
4. `npm run check:images` uitvoeren voor categoriebeelden;
5. commit/push;
6. na deploy de productie-URL openen met een cache-buster, bijvoorbeeld `?v=<commit-sha>`;
7. pas daarna de wijziging als afgerond beschouwen.

## Categorie-register

De centrale koppeling tussen categorie en bestand staat in `src/content/category-images.ts`. Voeg een categoriebeeld daar toe of wijzig het pad daar als de bestandsnaam verandert. Vermijd losse hardcoded paden in pagina's en componenten.

## ChatGPT/GitHub-regel

Wanneer een afbeelding via ChatGPT wordt geplaatst, moet dezelfde flow worden gevolgd: eerst lokaal converteren en visueel controleren, daarna binair naar GitHub uploaden, daarna productie opnieuw downloaden/openen ter verificatie. Een succesvolle Git-commit alleen is niet voldoende bewijs dat het zichtbare beeld goed staat.
