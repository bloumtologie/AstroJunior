# Mission Outpost

Prototype de jeu éducatif où le joueur dirige un avant-poste sur Mars pendant
sept jours. Il doit arbitrer entre la vie de l'équipage, le bouclier,
les communications et la science.

## Démarrer en local

Prérequis : Node.js et npm.

```sh
npm install
npm run dev
```

Le prototype s'ouvre sur le serveur local indiqué par Vite. Pour vérifier le
build de production :

```sh
npm run build
npm run preview
```

## État du prototype

Le moteur déterministe, les contrôles de décision, les jauges, le bilan
quotidien, le débrief, le glossaire et les panneaux Sources/Limites sont en
place. L'archive NASA vérifiée est intégrée : elle contient les données DONKI
CME et SEP récupérées le 15 novembre 2026 pour mai 2024, et sélectionne les
sept jours du 10 au 16 mai. Les éruptions FLR ne sont pas incluses : leur route
DONKI a renvoyé HTTP 404 lors de la vérification.

Le navigateur ne fait aucun appel NASA : il lit les fichiers JSON archivés.
Pour régénérer l'archive, suivre les instructions de [data/README.md](./data/README.md).
Les paramètres numériques de [l'équilibrage](./public/data/balance.json) sont
des valeurs de jeu, pas des mesures NASA. Les hypothèses sont consignées dans
[DECISIONS.md](./DECISIONS.md).

## Vérifications

```sh
npm test
npm run build
```

Les tests comprennent une simulation de trois stratégies sur un scénario
synthétique de mécanique et sur l'archive DONKI de mai 2024. Seule la seconde
est constituée de données NASA archivées.