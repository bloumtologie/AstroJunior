# Scénario simple : une journée sur Mars

Ce guide raconte une partie type et explique à quoi sert chaque zone de
l’interface. Les choix proposés sont un exemple pour débuter, pas une stratégie
qui garantit de gagner : les événements et les ressources évoluent au fil des
jours.

## 1. Depuis l’accueil

La partie s’affiche en anglais au premier lancement. Le menu avec les drapeaux
permet de choisir 🇫🇷 pour le français ou 🇬🇧 pour l’anglais.

- **Nom de l’équipage** : facultatif ; le nom réapparaît dans la scène et le
  bilan final.
- **Comment jouer** : ouvre un petit tutoriel.
- **Sons** et **lecture à voix haute** : options désactivées au départ.
- **Vraies données NASA** : ouvre le panneau qui explique les sources.
- **JOUER / PLAY** : commence après le compte à rebours.

## 2. Lire l’écran des choix

L’écran de mission présente le jour en cours et quatre postes à régler :

| Poste | À quoi il sert | Exemple de niveau |
|---|---|---|
| Vie · air et serre | Produit l’oxygène et la nourriture | Moyen produit 10 de chaque par jour |
| Bouclier | Réduit la dose reçue pendant les événements solaires | Léger protège un peu ; Fort protège davantage |
| Communications | Permet de recevoir des alertes en avance et des conseils de la Terre | Moyen avertit jusqu’à un jour avant |
| Science | Fait gagner des points de recherche | Moyen rapporte 1 point par jour |

La scène SVG à côté des commandes illustre ces choix : quatre astronautes,
une serre, un réservoir d’oxygène, le bouclier, le compteur Geiger et l’énergie
disponible. Les expressions des astronautes et l’état des cultures évoluent
avec les ressources. Ouvre **Voir les détails** pour consulter les chiffres
exacts.

Les dix piles servent à augmenter un poste d’un cran :

1. Fais glisser une pile sur le poste voulu ; ou sélectionne-la puis touche le
   bouton **Améliorer** de ce poste.
2. Chaque pile ne peut être utilisée qu’une fois dans la journée.
3. Le choix n’est appliqué que si son coût reste dans le budget d’énergie.
4. Les boutons de niveau permettent aussi de choisir directement un réglage
   abordable.

Le nombre de piles est une aide visuelle pour répartir les améliorations ;
ce n’est pas une unité d’énergie. Les niveaux ont des coûts différents. Le
budget quotidien est de 100 unités dans les réglages actuels.

## 3. Exemple d’un joueur débutant

Imaginons Alex, qui veut d’abord garder son équipage en sécurité et apprendre
comment fonctionne la mission.

Au premier jour, Alex choisit :

- **Vie : Moyen** — coûte 35 unités et produit 10 oxygène et 10 nourriture.
- **Communications : Moyen** — coûte 10 unités et peut annoncer un événement
  un jour à l’avance.
- **Bouclier : Aucun** et **Science : Aucun** — Alex conserve de l’énergie pour
  l’instant.

Le plan coûte 45 unités sur 100. Avec les réglages actuels, l’équipage consomme
10 oxygène et 10 nourriture par jour : la production moyenne compense cette
consommation pour cette journée. Les ressources de départ sont de 40 unités
chacune.

Alex remarque une alerte de tempête ou un conseil avant de valider ? Il peut
ajouter un cran de bouclier si son budget le permet. Sinon, il peut conserver
de l’énergie ou choisir un autre poste. Il n’existe pas une seule bonne
réponse : chaque amélioration a un coût et un effet différent.

Quand son plan lui convient, Alex appuie sur **Valider les choix du jour**.
Le jeu simule la journée ; le résultat apparaît ensuite dans le bilan.

## 4. Comprendre le bilan quotidien

Le bilan résume ce qui s’est passé : énergie dépensée, stocks, santé, dose et
recherche gagnée. **Voir les détails** révèle les valeurs numériques. Les
alertes et les liens d’événements permettent de comprendre les nouvelles
rencontrées pendant la journée.

Alex lit le bilan, puis sélectionne **Continuer** pour passer au jour suivant.
Il peut réajuster son plan à chaque nouvelle journée selon les stocks et les
alertes. La partie se poursuit jusqu’à la fin des sept jours ou si la santé de
l’équipage tombe à zéro.

## 5. La scène pendant une tempête

Quand une tempête est signalée, le soleil et les particules s’animent dans la
scène. Avec un bouclier renforcé, les particules rebondissent visuellement sur
la bulle de protection ; sinon, un flash illustre l’impact. Le compteur Geiger
représente l’évolution de la dose. Ces dessins expliquent le résultat du jeu :
ils ne sont pas des instruments ou mesures en direct.

Les animations s’adaptent au réglage **prefers-reduced-motion** du système.
Les libellés, icônes et formes accompagnent les couleurs afin que l’information
ne repose pas uniquement sur la couleur.

## 6. Le bilan final

À la fin de la partie, l’écran de débrief présente le résultat de l’équipage,
les étoiles, les éventuels badges et l’historique de mission. Dans les règles
actuelles, un équipage encore en vie obtient des étoiles ; la recherche gagnée
peut ajouter une étoile et le badge Explorateurs. Le badge Équipage protégé
apparaît si l’équipage a survécu.

Le débrief aide à comparer les décisions et leurs compromis. Les chiffres de
la partie sont des résultats d’une simulation éducative, et non des prévisions
pour une vraie mission sur Mars.
