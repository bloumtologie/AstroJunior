# Étapes pour installer Mission Outpost en local

Ce guide permet de récupérer le projet et de lancer le jeu sur son ordinateur.
Il n’est pas nécessaire de créer une clé NASA pour jouer : l’application lit
les archives JSON déjà présentes dans le dépôt.

## 1. Installer les outils nécessaires

Installe :

- **Git**, pour cloner le dépôt.
- **Node.js 20 LTS** (ou une version compatible avec Vite 6). npm est fourni
  avec Node.js.
- Un navigateur récent, par exemple Firefox, Chrome ou Edge.

Vérifie l’installation dans un terminal :

```sh
git --version
node --version
npm --version
```

## 2. Cloner le dépôt

La branche de travail de l’interface est `Test_V1`. Clone-la ainsi :

```sh
git clone --branch Test_V1 --single-branch https://github.com/bloumtologie/AstroJunior.git
cd AstroJunior
```

Si tu as déjà cloné le dépôt, mets-toi à jour avec :

```sh
git fetch origin
git switch Test_V1
git pull
```

## 3. Installer les dépendances

À la racine du dépôt, exécute :

```sh
npm ci
```

Cette commande installe les versions enregistrées dans `package-lock.json`.
Une connexion Internet est nécessaire pendant cette installation.

## 4. Démarrer le jeu

```sh
npm run dev
```

Vite affiche une adresse locale, généralement :

```text
http://localhost:5173
```

Ouvre cette adresse dans ton navigateur. Laisse le terminal ouvert pendant
que tu joues ; arrête le serveur avec `Ctrl+C`.

## 5. Vérifier les changements

Avant de partager du code, lance les tests et le build :

```sh
npm test
npm run build
```

Les scripts `predev` et `prebuild` synchronisent automatiquement les paramètres
du jeu vers `public/data/balance.json`. Évite de modifier ce fichier généré à
la main.

## 6. Travailler sur une branche

Crée une branche dédiée à ta tâche :

```sh
git switch -c nom-de-ta-branche
```

Après tes modifications, vérifie les fichiers affectés et leur état :

```sh
git status
git diff
```

N’ajoute au commit que les fichiers liés à ta tâche. Ne partage jamais de
secrets ou de clé API.

## Dépannage

- **`npm` ou `node` introuvable** : installe Node.js LTS, puis ouvre un nouveau
  terminal.
- **Port déjà utilisé** : Vite propose normalement un autre port dans le
  terminal ; ouvre l’adresse qu’il indique.
- **L’archive ne charge pas** : vérifie que le serveur Vite est toujours actif
  et que les fichiers `public/data/events.json` et `public/data/sources.json`
  existent.
- **Besoin de reconstruire l’archive NASA** : suis les consignes de
  [data/README.md](./data/README.md). Cette opération de maintenance requiert
  Python et une clé NASA ; elle n’est pas nécessaire pour jouer.
