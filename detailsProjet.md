# Détails du projet — Mission Outpost

## Que fait le projet et comment fonctionne-t-il ?

**Mission Outpost** est un jeu éducatif bilingue (français/anglais) qui invite
les enfants de 7 à 12 ans à diriger un avant-poste sur Mars pendant sept jours.
Le joueur répartit chaque jour un budget d’énergie entre quatre postes :

- **Vie** : produire l’oxygène et la nourriture de l’équipage ;
- **Bouclier** : réduire l’exposition simulée aux radiations ;
- **Communications** : recevoir des alertes en avance et des conseils différés
  de la Terre ;
- **Science** : gagner des points de recherche.

Les choix ont des coûts différents et doivent rester dans le budget quotidien.
Le moteur simule ensuite la journée à partir de la décision, des stocks et des
événements solaires associés. Le joueur consulte un bilan, ajuste son plan et
recommence jusqu’à la fin des sept jours ou jusqu’à ce que l’équipage ne puisse
plus poursuivre la mission.

Une scène SVG transforme les ressources et les événements en éléments
visuels : astronautes, cultures, réservoir d’oxygène, bouclier et compteur
Geiger. Les chiffres détaillés restent accessibles dans l’interface. Le
débrief présente le résultat, les compromis de la partie, des étoiles et des
badges.

Le scénario est une **archive**, pas un flux en direct. Les fichiers NASA sont
intégrés au projet et chargés localement par le navigateur. Les événements
DONKI CME et SEP de mai 2024 alimentent la fenêtre de mission du 10 au 16 mai.
Les coûts, les stocks de départ et les effets numériques sont des paramètres
de jeu ; ils ne sont pas présentés comme des mesures NASA. Le glossaire, les
références et les limites sont réunis dans la page « À propos ».

## Quels sont les avantages ?

- Le joueur comprend par l’expérience qu’il faut faire des compromis : toute
  amélioration consomme une partie d’un budget limité.
- Les données solaires réelles donnent un contexte scientifique à la
  simulation, tandis que les explications distinguent les données archivées
  des hypothèses et des résultats du jeu.
- Une partie courte et guidée rend accessibles des notions telles que les
  événements solaires, les radiations, la protection et les communications
  Terre-Mars.
- Le jeu peut être découvert dans un navigateur sans compte ni clé API NASA.
- La langue se choisit avec des drapeaux ; la lecture à voix haute est
  optionnelle et l’interface respecte le réglage de mouvement réduit du
  système.

## Quel est l’impact prévu ?

Le projet vise à éveiller la curiosité pour Mars, la météo spatiale et les
données ouvertes de la NASA. En comparant ses décisions au bilan de chaque
journée, l’enfant peut observer comment la protection, la production de
ressources, les communications et la recherche entrent en concurrence pour
l’énergie disponible.

L’impact attendu est éducatif : apprendre à raisonner avec des ressources
limitées et à distinguer une observation scientifique d’une hypothèse de
simulation. Il s’agit d’un objectif du projet, et non d’un impact mesuré à ce
jour.

## Quels outils, langages, matériel ou logiciels ont été utilisés ?

- **Langages** : TypeScript et JavaScript pour l’application ; HTML, CSS et SVG
  pour la structure, les styles et les illustrations ; Python pour l’outil
  d’extraction et de préparation de l’archive NASA.
- **Interface et outils de développement** : React, Vite et Tailwind CSS.
- **Tests** : Vitest pour les tests automatisés du moteur, des données et des
  comportements testés.
- **Fonctionnalités du navigateur** : Web Speech API pour la lecture vocale
  optionnelle.
- **Données** : archive NASA DONKI pour des événements CME et SEP de mai 2024 ;
  références documentaires à NASA OSDR RadLab et à Curiosity RAD. L’échantillon
  RadLab provient de l’ISS, et n’est donc pas présenté comme une mesure sur
  Mars.
- **Collaboration et versionnement** : Git et GitHub.
- **Matériel** : aucun matériel spatial ou capteur spécialisé n’est requis.
  Le développement se fait sur un ordinateur standard ; le jeu est conçu pour
  fonctionner dans un navigateur sur ordinateur, tablette ou téléphone.

## En quoi le projet est-il créatif ?

Le projet rapproche des archives d’événements solaires de décisions simples
compréhensibles par un jeune joueur. Il transforme des stocks et des résultats
de simulation en une scène de base martienne animée, tout en conservant un
accès aux valeurs exactes et à leurs explications.

Les dix piles affichées rendent les améliorations concrètes à manipuler :
elles permettent d’augmenter un poste d’un cran, mais ne remplacent pas les
coûts réels des niveaux. Cette interaction, les alertes, le bilan quotidien et
le débrief relient le geste du joueur à ses conséquences dans la simulation.

## Quels facteurs l’équipe a-t-elle pris en compte ?

- **Âge et accessibilité** : consignes courtes, commandes visibles,
  compatibilité mobile, navigation clavier, textes traduits, lecture vocale
  optionnelle et respect de `prefers-reduced-motion`.
- **Compréhension visuelle** : formes, icônes et libellés accompagnent les
  couleurs ; l’information ne dépend pas uniquement de la couleur.
- **Exactitude scientifique** : les sources sont affichées, l’archive est
  identifiée comme telle et les données de l’ISS sont distinguées de celles de
  Mars.
- **Honnêteté sur le modèle** : les coûts, stocks et facteurs simulés sont
  documentés comme paramètres de jeu, sans les confondre avec des mesures ou
  des prévisions.
- **Simplicité d’installation** : le jeu utilise les archives déjà présentes ;
  aucune clé API n’est nécessaire pour jouer en local.
- **Fluidité et sobriété** : interface mobile-first, SVG et CSS pour les
  éléments visuels, et aucune nouvelle dépendance n’a été ajoutée pour cette
  expérience.

## État du projet

Le prototype comprend le parcours de mission, le bilan quotidien, le débrief,
la page « À propos », le tutoriel, l’anglais par défaut avec choix de langue,
et les guides de lancement et de scénario. Le build et les tests automatisés
ont été vérifiés durant le développement. Le déploiement public reste à
configurer séparément si l’équipe souhaite publier le jeu sur Internet.
