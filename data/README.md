# Données de mission

## Archive DONKI

`fetch_donki.py` interroge les routes NASA DONKI `CME` et `SEP` pour la période
du 1er au 31 mai 2024, puis écrit `public/data/events.json`. Le scénario de
sept jours est sélectionné à partir de la fenêtre calendaire contenant le plus
d’événements renvoyés par DONKI ; en cas d’égalité, la première fenêtre est
retenue. Les dates, identifiants et liens de chaque événement proviennent de la
réponse NASA.

La documentation DONKI/API consultée est liée dans [sources.json](../public/data/sources.json).
Les routes `CME` et `SEP` ont répondu avec des enregistrements à la requête
d’archive. La route `FLR` a renvoyé HTTP 404 lors de la vérification, et la clé
publique `DEMO_KEY` a ensuite atteint sa limite HTTP 429. Pour ne pas fabriquer
d’événements, cette première extraction ne prétend donc pas inclure les
éruptions FLR. Les événements SEP sont inclus comme événements de particules ;
les heures `startTime` des CME sont des heures de détection, pas des arrivées.
Le jeu applique donc le délai simplifié de deux jours configuré dans
`src/data/balance.json` ; ce délai est un paramètre de jeu, pas une estimation
NASA ni une prévision d’arrivée sur Mars.

## Préparer l’extraction

1. Copier `.env.example` en `.env` à la racine du dépôt et y mettre une clé NASA.
   Ne jamais partager ni committer `.env`.
2. Installer la dépendance dans un environnement Python local :

   ```sh
   python -m pip install -r data/requirements.txt
   ```

3. Lancer l’extraction :

   ```sh
   python data/fetch_donki.py
   ```

Le navigateur ne fait aucun appel à l’API ; il lit uniquement le JSON archivé.
Chaque fichier de données embarqué porte ses métadonnées `mode: "archive"`.
Les coûts, stocks et facteurs de santé de `src/data/balance.json` sont des
paramètres de jeu et non des mesures NASA. Les scripts `predev` et `prebuild`
copient ce fichier canonique vers `public/data/balance.json`. La dose de base
de 0,5 mSv/jour n’est pas une mesure de surface martienne.
