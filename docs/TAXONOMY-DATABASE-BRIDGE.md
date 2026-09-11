# Taxonomy Database Bridge v1

Winkelnu houdt de producttaxonomy in `src/content/categories` als enige bron van waarheid. De database bewaart geen tweede handmatig onderhouden taxonomylijst.

## Identiteit

Iedere canonieke categorie en subcategorie krijgt een stabiele applicatie-identiteit:

```text
category:<slug>
```

Voorbeelden:

```text
category:elektronica
category:laptops-computers
category:reizen-bagage
category:koffers
```

De PostgreSQL/Supabase UUID blijft de relationele primary key. `external_key` vormt de brug tussen applicatie-identiteit en database-UUID.

## Synchronisatie

`SupabaseTaxonomyDatabaseBridge.ensureSynced()`:

1. leest de actuele `categories` rows;
2. projecteert de centrale Winkelnu-taxonomy naar database-nodes;
3. hergebruikt bestaande rows op `external_key` of `slug`;
4. weigert ambiguïteit wanneer slug en external key naar verschillende rows wijzen;
5. activeert en actualiseert de 13 hoofdcategorieën;
6. koppelt de 65 subcategorieën met hun echte `parent_id` UUID;
7. deactiveert alleen verouderde rows die expliciet onder de beheerde `category:` namespace vallen;
8. verifieert de uiteindelijke parent-child relaties;
9. retourneert een `slug -> UUID` en `slug -> external_key` snapshot.

Er worden geen gegenereerde UUID's in code of feedmappings vastgelegd.

## Feedimport

De production import composition synchroniseert de taxonomy pas nadat merchant en feedadapter geldig zijn. Daarna zet de bestaande feedresolver de externe feedcategorie om naar een stabiele `category:<slug>` identity. `SupabaseCatalogRepository` resolveert die identity vervolgens naar de database-UUID bij het opslaan van een product.

`Cadeaus & feest` blijft bewust buiten deze bridge: collections zijn redactionele dwarsdoorsneden en geen primaire productcategorieën.

## Veiligheid

De bridge gebruikt uitsluitend de server-side Supabase client met `SUPABASE_SERVICE_ROLE_KEY`; deze sleutel mag nooit naar de browser. De synchronisatie beheert alleen rows binnen de gereserveerde `category:` namespace en verwijdert geen database-rows.
