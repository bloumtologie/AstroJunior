# PROMPT COPILOT — « Mission Outpost » — VERSION 24 H

> À coller dans `.github/copilot-instructions.md` ET comme premier message en mode Agent.
> Cette version **remplace** le prompt de 48 h : le scope est réduit, mais tout ce qui compte pour le jury est conservé.

---

## 0. Ton rôle et ta façon de travailler

Tu es un **développeur full-stack et ingénieur data senior**. Nous sommes une équipe étudiante qui participe au **NASA Space Apps Challenge 2026**. Nous avons **moins de 24 h** : livre un **prototype jouable, déployé et honnête**, pas un projet ambitieux et inachevé.

Règles :
1. **Priorités P0 > P1 > P2** (section 12). Ne commence jamais un P1 avant que tous les P0 fonctionnent. Si le temps manque, **coupe par le bas**.
2. **Démarre immédiatement** : pas de longue phase de questions. Si un point est ambigu, prends **l'hypothèse la plus simple**, note-la dans `DECISIONS.md` et continue. Pose au maximum 3 questions, uniquement si elles bloquent.
3. **Déploie dès le début** (Phase A) et redéploie à chaque jalon : on doit toujours avoir un lien public qui marche.
4. **N'invente jamais de données NASA ni d'endpoints.** Une valeur non vérifiée est soit retirée, soit présentée comme *paramètre de jeu* dans l'interface et la doc. N'utilise `"TODO_VERIFY"` que temporairement, et signale-moi chaque occurrence.
5. **Ne présente jamais du statique comme du « live ».** Le jeu affiche « Archive NASA DONKI (mai 2024) ».
6. Avant chaque phase : annonce en quelques lignes les fichiers que tu vas créer ; après : résumé de ce qui marche et de ce qui reste. Poursuis la phase suivante sans attendre, sauf blocage.
7. Code et identifiants en anglais ; textes affichés dans un dictionnaire FR/EN. Commentaires courts.
8. Commits petits et fréquents ; je pousse sur GitHub toutes les ~45 min.

---

## 1. Le défi (résumé fidèle)

**NASA Space Apps 2026 — « Build a Mission Simulator for Young Astronauts »** (niveau Intermédiaire / Débutant-Jeune).
Concevoir un **jeu ou une application interactive** où des **enfants de 7 à 12 ans gèrent un avant-poste lunaire ou martien**, en arbitrant entre **maintien en vie, protection contre les radiations, énergie, production alimentaire et délais de communication**, et en voyant comment leurs choix se jouent sur une mission simulée. Format libre. Livrable : un **prototype fonctionnel** qui montre clairement le mécanisme de compromis, avec une **courte explication des jeux de données NASA utilisés et pourquoi**.

**Ce que le jury valorise :**
- Un **vrai compromis** : *aucun choix gratuit* (ex. : économiser de l'énergie aujourd'hui peut coûter de l'oxygène demain).
- De **vraies données ouvertes NASA**, avec **sources affichées dans l'outil** ; une archive curée est acceptable si on ne la présente pas comme du live.
- **Faible barrière d'entrée** : jouable dans le navigateur, sans téléchargement ni compte.
- **Rejouabilité** : on apprend de ses échecs, sans punition.
- **Langage simple** : les termes scientifiques (dose de radiation, CME…) sont expliqués en une phrase.
- **2 à 3 ressources**, pas 5 ou 6. **La mécanique prime sur le visuel.**
- Lien entre une décision de jeu et la **météo spatiale réelle** (DONKI).
- L'enfant doit **repartir en ayant compris une vraie contrainte**, pas seulement avoir joué.

---

## 2. Concept (scope réduit)

**Titre** : *Mission Outpost*. Le joueur est le **chef de mission** d'un avant-poste sur **Mars (cratère Jezero)**. **Une partie = 7 jours (sols)**, ≈ 5 minutes.

### Trois ressources seulement
**Énergie** (budget quotidien), **Oxygène** (stock), **Nourriture** (stock). La **santé de l'équipage** est un résultat (jauge), pas une ressource à gérer.

### Quatre postes de décision, boutons à crans (pas de curseurs)
Chaque jour, le joueur choisit un cran pour chaque poste. Le total ne peut pas dépasser le budget d'énergie : les crans trop chers sont désactivés.

| Poste | Crans (coût en énergie) | Effet |
|---|---|---|
| **Vie** (air + serre) | Bas 20 · Moyen 35 · Haut 50 | Produit oxygène **et** nourriture |
| **Bouclier** | Aucun 0 · Léger 10 · Fort 20 · Max 35 | Réduit la dose de radiation (0 / 40 / 70 / 90 %) |
| **Communications** | Bas 5 · Moyen 10 · Haut 20 | Alerte plus ou moins en avance + conseils de la Terre |
| **Science** | Aucun 0 · Moyen 10 · Haut 25 | Gagne des points de recherche (0 / 1 / 3) |

Budget : **100 énergie/jour**. Tout « Max » = 130 > 100 : **le joueur ne peut pas tout avoir**. C'est le cœur pédagogique.

### Production et consommation (paramètres de jeu, dans `balance.json`)
- Équipage : 4. Stocks de départ : oxygène 40, nourriture 40, santé 100.
- Consommation par jour : oxygène 10, nourriture 10.
- Production selon « Vie » : **Bas = 6 / Moyen = 10 / Haut = 14** (chacun pour oxygène et nourriture). Moyen = équilibre ; Bas vide les stocks ; Haut les remplit lentement.
- Stock ≤ 0 (oxygène ou nourriture) → forte perte de santé par jour.
- Victoire : survivre 7 jours avec santé > 0. Pas d'écran « perdu » punitif : on explique la cause et on propose **« Rejouer avec un autre plan »**.

### Radiations (corrigé : la dose dépend des particules/CME, pas de la seule classe d'éruption)
- `doseDay = baselineDose × multiplier × (1 − shieldReduction)`
- `crewHealth −= max(0, doseDay − safeThreshold) × healthPerMSv`

| Situation du jour (données DONKI) | Multiplicateur | Rôle |
|---|---|---|
| Calme | ×1 | — |
| Éruption (flare) sans CME ni SEP | ×1,5 | Surtout un **signal d'alerte** (et brouillage des comms) |
| Arrivée d'une **CME** | ×3 | Tempête géomagnétique/radiations |
| Événement **SEP** (particules énergétiques solaires) | ×6 | Risque radiation principal pour les astronautes |
| **CME + SEP** | ×12 | Tempête majeure |

- **Effet retardé** : une éruption est détectée le jour D ; la CME **arrive 1 à 3 jours plus tard** (valeur issue des données DONKI quand elle existe). Les **comms** déterminent l'avance de l'alerte : **Bas = 0 jour, Moyen = 1 jour, Haut = 2 jours**.
- **Dose de base** : `baselineDose` est un **paramètre de jeu** (valeur de départ 0,5 mSv/jour). **L'ISS (RadLab) n'est pas la surface de Mars.** Dans la doc et le debrief, distingue les deux. Cherche **une mesure publiée de radiation à la surface de Mars** (instrument RAD du rover Curiosity) et, si tu la retrouves avec certitude, utilise-la pour calibrer ; sinon garde 0,5 et indique-le clairement. À vérifier avant de l'écrire dans l'interface.

### Délai de communication = vraie mécanique
- Distance Terre-Mars : un signal met **de l'ordre de 4 à 24 minutes** (à vérifier et à sourcer avant affichage).
- Dans le jeu : avec **Comms ≥ Moyen**, le joueur reçoit un **conseil de la Terre**, mais il porte sur **la situation d'il y a 1 jour** (information en retard). Il faut donc décider **seul** avant d'avoir la réponse. Avec Comms Bas, pas de conseil. Le joueur voit pourquoi : « Ta radio met du temps : le conseil de la Terre arrive avec un jour de retard. »

### Exemple de compromis à garder dans le jeu et la démo
CME + SEP, bouclier **Max** : dose ≈ 0,5 × 12 × 0,1 = 0,6 mSv au lieu de 6, mais 35 énergie dépensées ; avec Vie Moyen (35) et comms Moyen (10), il reste ≈ 20 pour la science. Sacrifier la Vie → pénurie de stock en quelques jours.

### Rejouabilité
- Scénario principal **« Histoire vraie : mai 2024 »** : mappe sur les jours 1 à 7 de vrais événements DONKI de la période de la grande tempête solaire de mai 2024 (**dates exactes à lire dans les données, pas de mémoire**).
- Si le temps le permet (P1) : mode « Mission aléatoire » avec seed affichée.

---

## 3. Données NASA (réduit)

| Source | Usage | Priorité |
|---|---|---|
| **DONKI** — portail : https://ccmc.gsfc.nasa.gov/tools/DONKI/ ; accès API via https://api.nasa.gov/ (clé dans `.env`, jamais commitée) | Événements réels : éruptions (FLR), CME, SEP, tempêtes géomagnétiques → `events.json` | **P0** |
| **OSDR RadLab** : https://visualization.osdr.nasa.gov/radlab/gui/data-api/ | **Une** valeur d'ordre de grandeur de dosimétrie ISS, citée comme telle | **P0** |
| **OSDR recherche** : https://osdr.nasa.gov/osdr/data/search?term=KEYWORD (dépôt : https://osdr.nasa.gov/bio/repo/) | 2-3 cartes « le saviez-vous ? » sur la santé en vol | P1 |
| Donnée de surface Mars (rover) — **Mars Trek** : https://trek.nasa.gov/mars/ ; publication/jeu de données du rover à retrouver et à citer | 1 valeur sourcée dans `sites.json` et le debrief (Mars Trek : fond visuel, optionnel) | P1 |
| **ASC** (Agence spatiale canadienne), production alimentaire : https://www.asc-csa.gc.ca/eng/youth-educators/toolkits/food-production/ ; ressources jeunesse : https://www.asc-csa.gc.ca/eng/youth-educators/resources-stem-and-youth-organizations.asp | Inspiration/crédit pour les textes de la serre | P2 |

**Règles sur les liens :**
- Chaque lien utilisé dans le jeu doit figurer dans `sources.json` (avec son `url`), dans le panneau Sources et dans `data/README.md`.
- **Vérifie les endpoints exacts et les formats de réponse dans la documentation officielle** de ces pages avant de coder ; ne construis pas d'URL d'API de mémoire.
- Disclaimer NASA : la NASA n'approuve aucune entité non gouvernementale américaine et décline toute responsabilité sur leurs sites ; pour tout site tiers, respecte ses conditions d'utilisation des données et cite-le.

**Règles :**
- **Un seul script Python** `data/fetch_donki.py` (requests) qui récupère les événements de la fenêtre de mai 2024 et écrit `public/data/events.json`. Vérifie les endpoints dans la doc officielle ; si l'API est lente ou échoue, **crée `events.json` à la main à partir de vrais événements consultés** et marque-le `"mode": "archive"`.
- **Tout est embarqué** : le jeu ne fait **aucun appel API** à l'exécution.
- Chaque fichier JSON a un bloc `meta` : `source`, `retrieved` (date), `mode: "archive"`, `notes`.
- **Pas de mode live** dans cette version (coupé).

### Fichiers de données (`public/data/`)
- `events.json` : `meta`, `events[]` (`id`, `date`, `type`, `classType?`, `hasCME`, `hasSEP`, `cmeDelayDays?`, `title_fr`, `title_en`, `donkiUrl`), `scenario` (jours 1-7 → événements).
- `balance.json` : tous les nombres des sections 2 (budget, coûts, productions, consommations, multiplicateurs, seuils, durée).
- `sources.json` : `id`, `name`, `url`, `usedFor_fr/en`, `mode`.
- `facts.json` (P1) : cartes « le saviez-vous ? » avec `sourceId`.
- `sites.json` (P1) : Mars/Jezero, délai de communication, 1 valeur de surface sourcée.

---

## 4. Stack (le plus léger possible)

- **TypeScript + Vite + React 18 + Tailwind CSS.** Gestion d'état avec `useReducer` (pas de Zustand).
- **Pas** de Phaser, pas de framer-motion, pas de i18next : un simple dictionnaire `i18n.ts` FR/EN.
- **Vitest** pour 4 à 6 tests du moteur. ESLint minimal. **Pas de CI** obligatoire.
- Python 3.11 + `requests` pour le script de données.
- Déploiement : **Vercel ou Netlify** (lien public sans compte). Ne demande aucune dépendance de plus sans me prévenir.

### Arborescence minimale
```
mission-outpost/
├─ data/fetch_donki.py, data/README.md, .env.example
├─ public/data/{events,balance,sources,facts,sites}.json
├─ src/
│  ├─ engine/{types.ts,rules.ts,step.ts,engine.test.ts}
│  ├─ i18n.ts
│  ├─ ui/{Briefing,Controls,Gauges,DayResult,Debrief,SourcesPanel,Glossary}.tsx
│  └─ App.tsx, main.tsx
├─ DECISIONS.md, README.md
```

### Contrat du moteur (logique pure et déterministe)
```ts
type Level = 0 | 1 | 2 | 3;               // Bas/Moyen/Haut… ou Aucun/Léger/Fort/Max pour le bouclier
type Decision = { life: 0|1|2; shield: 0|1|2|3; comms: 0|1|2; science: 0|1|2 };
type State = { day: number; oxygen: number; food: number; crewHealth: number;
               cumulativeDose: number; science: number; pending: PendingCME[]; log: DayReport[] };
function isAffordable(d: Decision, budget: number): boolean;
function step(state: State, d: Decision, todayEvents: GameEvent[]): { state: State; report: DayReport };
```
`DayReport` contient des **clés i18n + paramètres** (jamais du texte en dur) : variations de stocks, dose du jour, santé, événement lié (`id`, `donkiUrl`), conseil de la Terre (en retard d'un jour).

---

## 5. Interface et expérience (enfants 7-12 ans)

- **Un écran = une idée** : Briefing → Décision → Résultat du jour → … → Debrief.
- **Jamais plus de 3 jauges + 1 jauge de dose.** Boutons larges (utilisables au doigt), texte ≥ 16 px, contraste élevé, pas d'information portée par la couleur seule, `aria-label` sur les boutons.
- **Énergie restante visible en permanence** ; les crans impossibles sont grisés avec la raison (« pas assez d'énergie »).
- **Aperçu de l'effet** avant de valider (ex. « Avec ce choix : oxygène −4 demain »).
- **Feedback causal chaque jour** en phrases courtes : « Tu as mis 35 énergie dans le bouclier : tu as reçu 0,6 mSv au lieu de 6, mais tes serres ont produit moins. »
- **Alerte radiation** : bannière + icône + texte, avec explication en une phrase.
- **Glossaire par info-bulles** (P0 minimal : dose de radiation, éruption solaire, CME, SEP, délai de communication).
- **Panneau « Sources NASA »** toujours accessible, qui affiche le mode (**archive**).
- **Encadré « Limites »** : « Les événements solaires viennent de vraies données NASA. Les chiffres du jeu (coûts, consommations, multiplicateurs) sont simplifiés. »
- Responsive (mobile d'abord), `prefers-reduced-motion` respecté, FR par défaut + bascule EN.

---

## 6. Debrief pédagogique (P0, c'est la valeur éducative)

L'écran de fin relie **décision de jeu ↔ donnée NASA réelle** :
> « Ce jour-là, la vraie tempête de mai 2024 (NASA DONKI) a envoyé des particules solaires vers la Terre et Mars… Tu as reçu X mSv parce que ton bouclier était au niveau N. »

Contenu minimal : chronologie des 7 jours (4 courbes simples : énergie utilisée, oxygène, nourriture, dose), **le meilleur compromis manqué** (« avec 10 énergie de plus pour la Vie, tu aurais évité la pénurie »), **une phrase-leçon** adaptée au résultat (ex. « Protéger l'équipage coûte de l'énergie, et cette énergie manque ailleurs »), 1 à 3 liens de sources, bouton **« Rejouer avec un autre plan »**.

---

## 7. Équilibrage (obligatoire mais léger)

Un script `npm run simulate` (ou un test) qui joue **3 stratégies automatiques** sur le scénario de mai 2024 :
1. **Naïve** (bouclier Aucun, tout en science) → doit **échouer** ;
2. **Tout-bouclier** (Max en permanence) → doit **échouer ou finir avec très peu de science** ;
3. **Adaptative** (bouclier selon l'alerte) → doit **réussir**.

S'il existe une stratégie qui gagne sans rien sacrifier, **ajuste `balance.json`** jusqu'à ce que chaque choix coûte quelque chose.

**Tests Vitest (4 à 6)** : budget respecté, dose = formule, stocks ≥ 0, CME retardée correctement, conseil de la Terre en retard d'un jour, déterminisme.

---

## 8. Livrables de soumission (à produire avec le code)

- **`README.md`** : objectif, comment jouer, lancer en local, structure, crédits (assets, polices, données).
- **`data/README.md`** : méthode, endpoints utilisés, dates de récupération, limites, valeurs « à vérifier » restantes.
- **Panneau Sources** dans le jeu cohérent avec `sources.json`.
- **Texte de déclaration des sources** (je le colle dans le formulaire) : DONKI (événements solaires réels, archive curée) ; RadLab/OSDR (ordre de grandeur de dosimétrie ISS) ; autres sources uniquement si **réellement utilisées** ; précision que les valeurs d'équilibrage sont des paramètres de jeu, pas des mesures NASA.
- **Vidéo** (60-90 s, je m'en occupe) : prévois dans le jeu un **mode démo** ou un scénario court facile à filmer.

---

## 9. Interdits

- Pas de nouvelle ressource, pas de 3D, pas de compte, pas de backend, pas de mode live, pas d'appel API à l'exécution.
- Pas de clé API dans le dépôt ni dans le front.
- Pas de valeurs NASA inventées ; pas de « live » affiché pour des données statiques.
- Pas de polish visuel avant que la mécanique soit validée par la simulation.
- Pas de texte en dur dans le moteur ; pas de dépendance ajoutée sans me le dire.

---

## 10. Plan (à rebours de notre deadline, gel du code 2 h avant)

| Phase | Contenu | Résultat |
|---|---|---|
| **A** | Projet Vite + React + TS + Tailwind, structure, **déploiement d'un « Hello »**, `balance.json` | Lien public qui marche |
| **B** | Moteur (`rules`, `step`) + 4-6 tests + simulation 3 stratégies | Mécanique validée |
| **C** (en parallèle) | `fetch_donki.py` → `events.json` (mai 2024), `sources.json`, valeur RadLab | Données réelles intégrées |
| **D** | UI : Briefing, Controls (crans), Gauges, DayResult, alertes | Partie complète de bout en bout |
| **E** | Debrief + phrase-leçon, glossaire, panneau Sources, encadré Limites | Valeur pédagogique visible |
| **F** | FR/EN, mobile, accessibilité, équilibrage final, README, data/README | Version candidate |
| **Gel** | Plus aucune fonctionnalité : correction de bugs, déploiement final, soumission | Soumis |

---

## 11. Définition de « terminé » (checklist de soumission)

- [ ] Partie de 7 jours jouable dans le navigateur, **sans compte**, sur téléphone aussi.
- [ ] Scénario **mai 2024** basé sur de vrais événements DONKI, affiché « Archive ».
- [ ] 3 ressources + 4 postes à crans ; **aucun choix gratuit** (simulation OK).
- [ ] Dose dépendant de **CME/SEP**, effet **retardé**, délai de communication en **vraie mécanique**.
- [ ] Debrief avec phrase-leçon + lien à une donnée NASA réelle + « Rejouer ».
- [ ] Panneau Sources + encadré Limites + glossaire.
- [ ] FR + EN.
- [ ] Tests verts, build OK, **déployé**, README + data/README.
- [ ] Aucun `TODO_VERIFY` visible dans l'interface.

---

## 12. Priorités (coupe par le bas si le temps manque)

**P0 (indispensable)** : moteur + table de dose, 4 postes à crans, scénario mai 2024 avec vraies données DONKI, effet retardé, comms/délai, debrief avec phrase-leçon, panneau Sources, encadré Limites, déploiement, README.

**P1 (si possible)** : valeur RadLab sourcée dans le debrief, valeur de surface Mars, cartes « le saviez-vous ? » OSDR, mode aléatoire avec seed, EN complet, mode démo pour la vidéo.

**P2 (probablement non)** : sons, animations, site Lune, Mars Trek, mode live, CI.

---

## 13. Premier message attendu de toi

1. En **5 lignes max**, confirme ta compréhension et liste les **hypothèses** que tu prends (max 3 questions bloquantes).
2. Donne la **liste des fichiers de la Phase A** et les commandes.
3. **Commence la Phase A immédiatement.**
4. a chaque etape push , mais rien d'important sans mon autorisation
5. utilise uniquement le disque D comme disque de resource. rien dans C/ surtout pas le C/.
 