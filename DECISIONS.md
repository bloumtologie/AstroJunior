# Décisions de prototype

- L'équilibrage initial de `src/data/balance.json` est un paramètre de jeu, pas une mesure de la NASA.
- La perte de santé par mSv est provisoirement réglée à 10 pour rendre le compromis du bouclier visible dans le prototype ; cette valeur est un paramètre de jeu à réévaluer avec le scénario archive.
- Une entrée DONKI de type CME indique la détection/départ observé, pas son arrivée sur Mars. En l’absence d’un délai d’arrivée validé, le moteur applique le délai de jeu déclaré dans `src/data/balance.json` (2 jours), sans le présenter comme une donnée ou prévision NASA.
- La dose de base de 0,5 mSv/jour reste une hypothèse de jeu tant qu'une mesure de surface martienne vérifiée n'est pas intégrée.
- L’archive DONKI CME/SEP de mai 2024 a été extraite le 15 novembre 2026 : 158 événements, scénario du 10 au 16 mai. La route `FLR` a répondu HTTP 404 pendant la vérification, tandis que `DEMO_KEY` a atteint HTTP 429 ; aucune éruption n’a été inventée pour la remplacer.
- Le navigateur ne fait aucun appel API ; il valide les métadonnées, les sept dates consécutives, les références d’événements et les URL avant de permettre le démarrage.
- Le premier jalon est un prototype Vite/React local. Aucun fournisseur, compte ni identifiant de déploiement n'est configuré dans ce dépôt.
