# Vercel deployment guard

Winkelnu deployt automatisch alleen vanaf `main`.

Alle andere Git-branches worden door `vercel.json` uitgesloten van automatische Vercel-deployments. Dit voorkomt onnodige Preview-builds en houdt deploymentgebruik en historie beheersbaar.

## Releaseflow

1. Werk op een branch en laat GitHub Quality de code controleren.
2. Maak en review de pull request zonder automatische Vercel Preview-deployment.
3. Merge pas na expliciete goedkeuring naar `main`.
4. Alleen de merge naar `main` mag automatisch een Vercel Production-deployment starten.
5. Wanneer een echte Preview nodig is, start die bewust en handmatig in plaats van automatisch per push.

Deze regel geldt bewust generiek voor alle branchnamen, zodat nieuwe prefixes zoals `feature/`, `docs/`, `chore/`, `test/` of andere toekomstige namen niet per ongeluk weer Preview-deployments starten.
