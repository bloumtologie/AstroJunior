# Décisions de prototype

- L'équilibrage initial de `public/data/balance.json` est un paramètre de jeu, pas une mesure de la NASA.
- La perte de santé par mSv est provisoirement réglée à 10 pour rendre le compromis du bouclier visible dans le prototype ; cette valeur est un paramètre de jeu à réévaluer avec le scénario archive.
- Une entrée DONKI de type CME indique la détection/départ observé, pas son arrivée sur Mars. En l’absence d’un délai d’arrivée validé, le moteur applique le délai de jeu déclaré dans `src/data/balance.json` (2 jours), sans le présenter comme une donnée ou prévision NASA.
- La dose de base de 0,5 mSv/jour reste une hypothèse de jeu tant qu'une mesure de surface martienne vérifiée n'est pas intégrée.
- Les données DONKI seront embarquées en archive après vérification de la documentation et des dates ; le navigateur ne fera aucun appel API.
- Le 14 novembre 2026, la route DONKI `FLR` a répondu HTTP 404 et `DEMO_KEY` a atteint HTTP 429 sur les routes suivantes. Aucun événement de remplacement n’est créé ; l’archive de mission reste bloquée jusqu’à une extraction valide.
- Le démarrage de la partie reste désactivé tant que `events.json` n’est pas chargé et validé comme archive de sept jours.
- Le premier jalon est un prototype Vite/React local. Aucun fournisseur, compte ni identifiant de déploiement n'est configuré dans ce dépôt.
