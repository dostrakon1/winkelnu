# Winkelnu Hierarchical Catalog Browsing v1

## Doel

De producttaxonomy bestaat uit 13 hoofdcategorieën met ieder 5 directe subcategorieën. Browsing en zoeken moeten dezelfde hiërarchie respecteren als de feedmapping en de Supabase-database.

## Filtersemantiek

- Een hoofdcategorie toont producten die direct aan de hoofdcategorie zijn gekoppeld én producten uit de 5 directe subcategorieën.
- Een subcategorie toont uitsluitend producten die exact aan die subcategorie zijn gekoppeld.
- De beheerde Winkelnu-taxonomy blijft bewust twee niveaus diep. Er is geen recursieve onbeperkte descendant-query.
- `Cadeaus & feest` blijft een collection-hub en valt niet onder deze producttaxonomy.

## Storefront

- De homepage toont alleen rootcategorieën.
- `/categorie/<root-slug>` toont de root, zijn subcategorienavigatie en de gecombineerde producten uit root + directe children.
- `/categorie/<child-slug>` toont alleen die subcategorie en een teruglink naar de parent.
- `/zoeken?categorie=<root-slug>` gebruikt dezelfde hiërarchische filters als de categoriepagina.

## Schaalbare Supabase-query

Migration `0020_hierarchical_catalog_browsing.sql` houdt filtering in `catalog_ranked_products` database-side. De categorie van een product wordt vergeleken met zowel `c.slug` als de slug van de directe parent. Daarmee blijft paginering en ranking vóór transport naar Next.js plaatsvinden.

## In-memory / curated mode

`InMemoryCatalogRepository` hanteert dezelfde root-versus-childsemantiek. Curated categorieën zonder children blijven daardoor backward-compatible.

## Invarianten

1. Rootcategorieën mogen hun directe children meenemen.
2. Childfilters mogen siblings of de parent niet meenemen.
3. Homepage-browsing gebruikt alleen categorieën zonder `parentId`.
4. De publieke rankingfunctie behoudt bestaande offer-hardening rond freshness, availability en onbekende verzendkosten.
