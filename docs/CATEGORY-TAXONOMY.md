# Winkelnu Category Taxonomy v1

Winkelnu gebruikt één vaste categorieboom voor redactionele pagina's, productfeeds en latere catalogusroutes.

## Bron van waarheid

De tien hoofdcategorieën staan in `src/content/categories/`. Iedere subcategorie heeft:

- een stabiele `slug` voor interne koppelingen, databasecategorieën en toekomstige URL's;
- een zichtbare titel en beschrijving;
- `feedAliases` voor bekende externe categoriebenamingen.

Titels mogen later redactioneel wijzigen. Slugs worden als stabiele identifiers behandeld.

## Feedresolutie

`src/application/catalog/feed-category-resolver.ts` vertaalt een externe `sourceCategory` naar een Winkelnu-hoofd- en eventueel subcategorie.

De resolver is bewust conservatief:

1. eerst een unieke exacte alias;
2. daarna unieke segmenten in een categoriepad, van rechts naar links;
3. geen fuzzy of AI-gok wanneer geen unieke match bestaat.

Voorbeeld:

`Electronics > Laptops` → `elektronica / laptops-computers`

Onbekende of conflicterende waarden blijven ongeclassificeerd zodat ze later gecontroleerd kunnen worden.

## Importpipeline

`importFeed` ondersteunt zowel:

- `categoryIdBySourceCategory` voor expliciete merchant/provider-overrides;
- `categoryIdResolver` voor de centrale taxonomy.

Een expliciete mapping heeft voorrang. De standaard taxonomy kan via `createTaxonomyCategoryIdResolver()` een subcategorie-ID kiezen en terugvallen op de ID van de hoofdcategorie.

## Uitbreiden

Bij een nieuwe subcategorie:

1. voeg de subcategorie één keer toe aan de juiste categoriebron;
2. kies een blijvende kebab-case slug;
3. voeg alleen sterke, ondubbelzinnige feedaliases toe;
4. laat de aliasconflicttest groen worden;
5. voeg provider-specifieke uitzonderingen alleen toe wanneer echte feeddata daar aanleiding toe geeft.
