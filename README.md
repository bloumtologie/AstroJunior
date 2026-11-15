# Mission Outpost

Mission Outpost est un jeu éducatif en français et en anglais destiné aux
enfants de 7 à 12 ans. Le joueur dirige un avant-poste sur Mars pendant sept
jours et répartit son énergie entre la survie, le bouclier, les communications
et la science.

La langue affichée par défaut est l’anglais. Le sélecteur de langue utilise les
drapeaux 🇬🇧 et 🇫🇷 ; son libellé accessible reste « Language » ou « Langue ».

## Fonctionnalités

- Interface React mobile-first, illustrations SVG et styles Tailwind/CSS.
- Choix d’un plan quotidien avec dix piles d’énergie et quatre postes.
- Scène visuelle de la base, événements solaires, bilan quotidien et débrief.
- Page « À propos » regroupant le glossaire, les sources NASA et les limites
  du modèle.
- Textes en français et en anglais, lecture vocale optionnelle via Web Speech
  API, et prise en compte de `prefers-reduced-motion`.
- Page « À propos » regroupant le glossaire, les sources NASA et les limites
  du modèle.
- Archive d’événements solaires NASA intégrée au projet : le jeu lit les
  fichiers JSON locaux et n’appelle pas l’API NASA depuis le navigateur.

## Démarrage rapide

Prérequis : Node.js 20 LTS (ou version compatible avec Vite 6) et npm.

```sh
git clone --branch Test_V1 --single-branch https://github.com/bloumtologie/AstroJunior.git
cd AstroJunior
npm ci
npm run dev
```

Ouvre l’adresse locale affichée par Vite, généralement `http://localhost:5173`.
Le guide détaillé pour les coéquipiers est dans [ETAPES.md](./ETAPES.md).
Pour découvrir l’interface et suivre un exemple de partie, consulte
[SCENARIO.md](./SCENARIO.md).

## Commandes utiles

```sh
npm run dev       # Démarrer le serveur de développement
npm test          # Exécuter les tests automatisés
npm run build     # Vérifier les types et créer le build de production
npm run preview   # Prévisualiser le build après npm run build
```

## Organisation du projet

```text
src/
  engine/     règles, simulation et types du jeu
  data/       paramètres et références de données
  ui/         écrans, contrôles et scènes React/SVG
  App.tsx     navigation entre les écrans et orchestration
  i18n.ts     dictionnaire français/anglais
public/data/  archive JSON chargée par le navigateur
data/         outils et documentation de l’archive
scripts/      scripts de synchronisation des paramètres
```

Le moteur et les paramètres de simulation sont distincts de l’interface.
Les valeurs d’équilibrage sont des paramètres de jeu, pas des mesures NASA.
Les hypothèses et décisions de prototype sont consignées dans
[DECISIONS.md](./DECISIONS.md).

## Données NASA

L’application locale utilise les fichiers archivés dans `public/data/` ; une
clé API n’est pas nécessaire pour lancer le jeu. Pour régénérer les données,
consulte [data/README.md](./data/README.md). Ne commite jamais de fichier
`.env` ni de clé API.

## Contribuer

1. Crée une branche de travail à partir de `Test_V1`.
2. Installe les dépendances avec `npm ci`.
3. Lance `npm test` et `npm run build` avant de proposer tes changements.
4. Garde les modifications du moteur et des données séparées des changements
   d’interface, sauf si la tâche demande explicitement de les modifier.

Pour le détail de l’installation et du lancement, suis
[ETAPES.md](./ETAPES.md). Pour une explication guidée d’une partie,
consulte [SCENARIO.md](./SCENARIO.md).
