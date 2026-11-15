export type Locale = "fr" | "en";
export type TextKey = keyof typeof messages.fr;

const messages = {
  fr: {
    title: "Mission Outpost",
    archiveLabel: "Archive NASA",
    language: "Langue",
    french: "Français",
    english: "English",
    loading: "Chargement de l’archive…",
    archiveErrorTitle: "Archive indisponible",
    archiveError: "La mission ne démarre pas sans données d’archive vérifiées.",
    archiveHttpError: "Le fichier {file} a répondu avec le code HTTP {status}.",
    archiveNotJson: "Le fichier {file} n’a pas fourni une réponse JSON.",
    archiveInvalid: "Le contenu de l’archive est incomplet ou invalide.",
    archiveRequestFailed:
      "Impossible de joindre l’archive. Vérifie que le serveur fonctionne.",
    tryAgain: "Réessayer",
    phase: "Mission",
    briefingEyebrow: "Centre de contrôle · Mars, cratère Jezero",
    briefingTitle: "Sept jours pour protéger ton équipage",
    briefingBody:
      "Tu diriges un avant-poste martien. Chaque jour, répartis l’énergie entre la vie, le bouclier, les communications et la science.",
    briefingFact:
      "Les événements solaires affichés dans cette mission viennent d’une archive, pas d’un flux en direct.",
    scenarioRange: "Dates de l’archive : du {start} au {end}.",
    archiveDate: "Date de l’archive : {date}",
    startMission: "Commencer la mission",
    dataNotReady: "L’archive de mission n’est pas encore chargée.",
    day: "Jour {day} sur {total}",
    choosePlan: "Choisis ton plan du jour",
    energy: "énergie",
    energyBudget: "Budget d’énergie",
    energyRemaining: "Énergie restante aujourd’hui",
    remaining: "restantes",
    notEnoughEnergy: "Pas assez d’énergie pour ce choix.",
    life: "Vie · air et serre",
    shield: "Bouclier",
    comms: "Communications",
    science: "Science",
    low: "Bas",
    medium: "Moyen",
    high: "Haut",
    none: "Aucun",
    light: "Léger",
    strong: "Fort",
    max: "Max",
    productionPreview:
      "La serre produit {production} oxygène et nourriture ; l’équipage en consomme {consumption} de chaque.",
    radioPreview:
      "Avec les communications choisies, l’alerte peut arriver jusqu’à {days} jour(s) avant.",
    advicePreview:
      "Les communications moyennes ou hautes donnent un conseil de la Terre sur la situation d’hier.",
    validatePlan: "Valider les choix du jour",
    resources: "Ressources de l’équipage",
    oxygen: "Oxygène",
    food: "Nourriture",
    crewHealth: "Santé de l’équipage",
    dose: "Dose cumulée",
    dailyReport: "Bilan du jour {day}",
    energySpent: "Énergie utilisée : {value}",
    decisionSummary:
      "Tu as choisi Vie {life}, Bouclier {shield}, Communications {comms} et Science {science}. Cela a coûté {energy} énergie ; la dose du jour est de {dose} mSv.",
    shieldEffect:
      "Sans bouclier, la dose aurait été de {dose} mSv.",
    oxygenStock: "Oxygène : {value}",
    foodStock: "Nourriture : {value}",
    healthValue: "Santé : {value} %",
    doseValue: "Dose du jour : {value} mSv",
    multiplierValue: "Intensité simulée : ×{value}",
    researchValue: "Recherche gagnée : {value}",
    radiationAlert:
      "Alerte : l’activité spatiale a augmenté la dose reçue aujourd’hui.",
    shortageAlert:
      "Attention : un stock est épuisé. La santé de l’équipage est en danger.",
    earthAdvice:
      "Conseil de la Terre reçu avec retard : il décrit le jour {day}.",
    noEarthAdvice:
      "Pas de conseil de la Terre aujourd’hui. Les communications coûtent de l’énergie et les nouvelles arrivent en retard.",
    cmeWarning:
      "Alerte précoce : événement CME attendu dans {days} jour(s).",
    eventSources: "Événements et sources",
    nextDay: "Continuer",
    debriefTitle: "Bilan de mission",
    tradeoffTitle: "Le compromis à retenir",
    nasaReference: "Le lien avec une vraie donnée NASA",
    nasaReferenceText:
      "Le jour {day}, la partie s’appuyait sur un événement {eventType} de l’archive NASA DONKI du {date}. Avec le bouclier {shield}, la dose simulée était de {dose} mSv. Cette valeur est un résultat du jeu, pas une mesure sur Mars.",
    openDonkiEvent: "Voir la fiche de l’événement NASA",
    issRadiationSampleTitle: "Exemple de mesure sur l’ISS — pas sur Mars",
    issRadiationSampleText:
      "Le {timestamp}, le dosimètre {instrument} de l’ISS a enregistré un débit de dose absorbée de {doseRate} µGy/heure. C’est un échantillon ponctuel, pas une moyenne ni une mesure de la surface martienne.",
    openRadlabSample: "Ouvrir la requête NASA RadLab",
    cmeEvent: "CME",
    sepEvent: "particules solaires (SEP)",
    flareEvent: "éruption solaire",
    missionSurvived: "Mission terminée : l’équipage est en vie.",
    missionFailed: "Mission interrompue : l’équipage n’a pas survécu.",
    dayHistory: "Chronologie de la mission",
    energyChart: "Énergie utilisée",
    oxygenChart: "Oxygène",
    foodChart: "Nourriture",
    doseChart: "Dose du jour",
    lessonTitle: "À retenir",
    lessonSurvived:
      "Protéger l’équipage demande de l’énergie, qui ne peut plus servir ailleurs.",
    lessonFailed:
      "Les ressources et la protection comptent ensemble : négliger l’une peut mettre l’équipage en danger.",
    "debrief.tradeoffMissed":
      "Le jour {day}, augmenter la Vie d’un cran aurait produit {extraProduction} unités de plus d’oxygène et de nourriture, pour {extraEnergy} énergie supplémentaires. Cela aurait pu réduire la pénurie, sans garantir de l’éviter.",
    "debrief.tradeoffNoShortage":
      "Les stocks d’oxygène et de nourriture ne sont pas tombés à zéro pendant la mission.",
    "debrief.tradeoffLifeMax":
      "Le jour {day}, la Vie était déjà au maximum ; il n’y avait pas de cran supérieur pour produire davantage.",
    replay: "Rejouer avec un autre plan",
    glossary: "Petit glossaire",
    radiationTerm: "Dose de radiation",
    radiationDefinition:
      "Une façon de mesurer l’énergie que les radiations déposent dans le corps.",
    flareTerm: "Éruption solaire",
    flareDefinition:
      "Une forte poussée de lumière et d’énergie venant du Soleil.",
    cmeTerm: "CME",
    cmeDefinition:
      "Un grand nuage de matière solaire qui peut voyager dans l’espace.",
    sepTerm: "SEP",
    sepDefinition:
      "Des particules très énergétiques envoyées par le Soleil.",
    commsTerm: "Délai de communication",
    commsDefinition:
      "Les messages entre la Terre et Mars mettent du temps à voyager ; une réponse peut décrire une situation passée.",
    sources: "Sources NASA",
    sourcesLoading: "Les sources seront affichées avec l’archive vérifiée.",
    archiveNotLoaded: "Archive non chargée",
    limitTitle: "Limites du modèle",
    limits:
      "Les événements solaires viennent de données NASA archivées. Les coûts, stocks et effets du jeu sont simplifiés ; ils ne sont pas des mesures médicales ni des prévisions pour Mars.",
    archiveMode: "Mode : archive",
    noEvents: "Aucun événement solaire n’est associé à ce jour.",
    backToBriefing: "Retour au briefing",
  },
  en: {
    title: "Mission Outpost",
    archiveLabel: "NASA archive",
    language: "Language",
    french: "Français",
    english: "English",
    loading: "Loading archive…",
    archiveErrorTitle: "Archive unavailable",
    archiveError: "The mission cannot start without verified archive data.",
    archiveHttpError: "The {file} file returned HTTP {status}.",
    archiveNotJson: "The {file} file did not return JSON.",
    archiveInvalid: "The archive content is incomplete or invalid.",
    archiveRequestFailed:
      "Could not reach the archive. Check that the server is running.",
    tryAgain: "Try again",
    phase: "Mission",
    briefingEyebrow: "Mission control · Mars, Jezero crater",
    briefingTitle: "Seven days to protect your crew",
    briefingBody:
      "You lead a Mars outpost. Each day, divide energy among life support, shielding, communications, and science.",
    briefingFact:
      "Solar events shown in this mission come from an archive, not a live feed.",
    scenarioRange: "Archive dates: {start} to {end}.",
    archiveDate: "Archive date: {date}",
    startMission: "Start mission",
    dataNotReady: "The mission archive has not loaded yet.",
    day: "Day {day} of {total}",
    choosePlan: "Choose today’s plan",
    energy: "energy",
    energyBudget: "Energy budget",
    energyRemaining: "Energy remaining today",
    remaining: "remaining",
    notEnoughEnergy: "Not enough energy for this choice.",
    life: "Life · air and greenhouse",
    shield: "Shield",
    comms: "Communications",
    science: "Science",
    low: "Low",
    medium: "Medium",
    high: "High",
    none: "None",
    light: "Light",
    strong: "Strong",
    max: "Max",
    productionPreview:
      "The greenhouse produces {production} oxygen and food; the crew uses {consumption} of each.",
    radioPreview:
      "With these communications, a warning can arrive up to {days} day(s) early.",
    advicePreview:
      "Medium or high communications deliver Earth’s advice about yesterday’s situation.",
    validatePlan: "Confirm today’s choices",
    resources: "Crew resources",
    oxygen: "Oxygen",
    food: "Food",
    crewHealth: "Crew health",
    dose: "Cumulative dose",
    dailyReport: "Day {day} report",
    energySpent: "Energy used: {value}",
    decisionSummary:
      "You chose Life {life}, Shield {shield}, Communications {comms}, and Science {science}. This used {energy} energy; today’s dose is {dose} mSv.",
    shieldEffect:
      "Without shielding, the dose would have been {dose} mSv.",
    oxygenStock: "Oxygen: {value}",
    foodStock: "Food: {value}",
    healthValue: "Health: {value}%",
    doseValue: "Dose today: {value} mSv",
    multiplierValue: "Simulated intensity: ×{value}",
    researchValue: "Research earned: {value}",
    radiationAlert:
      "Alert: space activity increased the dose received today.",
    shortageAlert:
      "Warning: a resource is empty. The crew’s health is at risk.",
    earthAdvice:
      "Delayed message from Earth: it describes day {day}.",
    noEarthAdvice:
      "No message from Earth today. Communications use energy and information arrives late.",
    cmeWarning:
      "Early warning: a CME event is expected in {days} day(s).",
    eventSources: "Events and sources",
    nextDay: "Continue",
    debriefTitle: "Mission debrief",
    tradeoffTitle: "The tradeoff to remember",
    nasaReference: "The link to real NASA data",
    nasaReferenceText:
      "On day {day}, the game used a {eventType} from the NASA DONKI archive dated {date}. With the {shield} shield, the simulated dose was {dose} mSv. This is a game result, not a Mars measurement.",
    openDonkiEvent: "View the NASA event record",
    issRadiationSampleTitle: "ISS measurement example — not Mars",
    issRadiationSampleText:
      "At {timestamp}, the ISS {instrument} dosimeter recorded an absorbed dose rate of {doseRate} µGy/hour. This is a single sample, not an average or a measurement of the Martian surface.",
    openRadlabSample: "Open the NASA RadLab query",
    cmeEvent: "CME",
    sepEvent: "solar particle (SEP) event",
    flareEvent: "solar flare",
    missionSurvived: "Mission complete: the crew is alive.",
    missionFailed: "Mission stopped: the crew did not survive.",
    dayHistory: "Mission timeline",
    energyChart: "Energy used",
    oxygenChart: "Oxygen",
    foodChart: "Food",
    doseChart: "Daily dose",
    lessonTitle: "Takeaway",
    lessonSurvived:
      "Protecting the crew takes energy that cannot be spent elsewhere.",
    lessonFailed:
      "Resources and protection both matter: neglecting either can put the crew at risk.",
    "debrief.tradeoffMissed":
      "On day {day}, increasing Life by one level would have produced {extraProduction} more units of oxygen and food for {extraEnergy} extra energy. It might have reduced the shortage, but could not guarantee avoiding it.",
    "debrief.tradeoffNoShortage":
      "Oxygen and food stocks did not reach zero during this mission.",
    "debrief.tradeoffLifeMax":
      "On day {day}, Life support was already at its highest level, so there was no higher setting to produce more.",
    replay: "Replay with a different plan",
    glossary: "Quick glossary",
    radiationTerm: "Radiation dose",
    radiationDefinition:
      "A way to measure the energy radiation deposits in the body.",
    flareTerm: "Solar flare",
    flareDefinition:
      "A strong burst of light and energy from the Sun.",
    cmeTerm: "CME",
    cmeDefinition:
      "A large cloud of solar material that can travel through space.",
    sepTerm: "SEP",
    sepDefinition:
      "Very energetic particles sent out by the Sun.",
    commsTerm: "Communication delay",
    commsDefinition:
      "Messages between Earth and Mars take time to travel, so a reply can describe a past situation.",
    sources: "NASA sources",
    sourcesLoading: "Sources will appear with the verified archive.",
    archiveNotLoaded: "Archive not loaded",
    limitTitle: "Model limitations",
    limits:
      "Solar events come from archived NASA data. Game costs, stocks, and effects are simplified; they are not medical measurements or forecasts for Mars.",
    archiveMode: "Mode: archive",
    noEvents: "No solar event is linked to this day.",
    backToBriefing: "Back to briefing",
  },
} as const;

export function t(
  locale: Locale,
  key: TextKey,
  params: Record<string, string | number> = {},
): string {
  let text: string = messages[locale][key];
  for (const [name, value] of Object.entries(params)) {
    text = text.replaceAll(`{${name}}`, String(value));
  }
  return text;
}
