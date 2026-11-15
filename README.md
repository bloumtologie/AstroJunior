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
place. La partie reste bloquée tant que l'archive vérifiée `public/data/events.json`
n'a pas été générée : le jeu n'invente pas de scénario de remplacement.

Pour préparer l'archive, suivre les instructions de [data/README.md](./data/README.md).
Le navigateur ne fait aucun appel NASA : il lit les fichiers JSON archivés.
Les paramètres numériques de [l'équilibrage](./public/data/balance.json) sont
des valeurs de jeu, pas des mesures NASA. Les hypothèses sont consignées dans
[DECISIONS.md](./DECISIONS.md).

## Vérifications

```sh
npm test
npm run build
```

Les tests comprennent une simulation de trois stratégies sur un scénario
synthétique de mécanique ; ce scénario de test n'est pas présenté comme une
archive NASA.