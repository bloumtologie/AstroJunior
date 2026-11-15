# Données de mission

## Archive DONKI

`fetch_donki.py` interroge les routes NASA DONKI
`https://api.nasa.gov/DONKI/CME` et `https://api.nasa.gov/DONKI/SEP` avec
`startDate=2024-05-01` et `endDate=2024-05-31`, puis écrit
`public/data/events.json`. Extraction réussie le **15 novembre 2026** :
**158 événements** (144 CME et 14 SEP). Les dates, identifiants, relations et
liens de chaque événement proviennent de la réponse NASA.

Le scénario de sept jours est la fenêtre calendaire contenant le plus
d’événements renvoyés par ces deux routes ; en cas d’égalité, la première
fenêtre est retenue. L’archive actuelle couvre le **10 au 16 mai 2024**.

La documentation DONKI/API consultée est liée dans [sources.json](../public/data/sources.json).
Les routes `CME` et `SEP` ont répondu avec des enregistrements à la requête
d’archive. La route `FLR` a renvoyé HTTP 404 lors de la vérification, et la clé
publique `DEMO_KEY` a ensuite atteint sa limite HTTP 429. Pour ne pas fabriquer
d’événements, cette première extraction ne prétend donc pas inclure les
éruptions FLR. L’archive générée contient les CME et SEP retournées lors de
l’extraction réussie avec une clé NASA personnelle. Les événements SEP sont
inclus comme événements de particules ;
les heures `startTime` des CME sont des heures de détection, pas des arrivées.
Le jeu applique donc le délai simplifié de deux jours configuré dans
`src/data/balance.json` ; ce délai est un paramètre de jeu, pas une estimation
NASA ni une prévision d’arrivée sur Mars.

## Préparer l’extraction

1. Copier `.env.example` en `.env` à la racine du dépôt et y mettre une clé
   NASA personnelle. La clé publique `DEMO_KEY` est limitée et a renvoyé HTTP
   429 ; ne jamais partager ni committer `.env`.
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

## Référence de radiation RadLab

Le bilan affiche aussi un échantillon NASA OSDR RadLab du dosimètre DosTel2 sur
l’ISS : **10,216 µGy/heure**, à l’horodatage `2022-04-01T23:00:00`. La requête
et sa réponse sont liées dans le bilan et dans [sources.json](../public/data/sources.json).
C’est un point de mesure de débit de dose absorbée, pas une moyenne de mission,
une dose journalière ou une mesure sur Mars. Il est présenté séparément afin
que les données de l’ISS ne soient pas confondues avec le scénario martien.

Le débrief cite également le communiqué NASA sur Curiosity RAD, qui rapporte
une moyenne de **0,67 mSv/jour** à Gale Crater entre août 2012 et juin 2013.
C’est un repère de dose moyenne historique, mesuré sur Mars et distinct de la
dose simulée dans la partie comme de l’échantillon ponctuel ISS. Ce chiffre
n’est pas une prévision, ni une mesure des conditions actuelles sur Mars.
