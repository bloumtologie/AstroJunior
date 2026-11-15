import {
  gameBalance,
  getCMEArrivalDay,
  getEnergyCost,
  getRadiationMultiplier,
  getUpcomingCMEWarning,
  isAffordable,
} from "./rules";
import type {
  DayReport,
  Decision,
  EventReference,
  GameEvent,
  PendingCME,
  State,
  StepResult,
} from "./types";

export function createInitialState(): State {
  return {
    day: 1,
    oxygen: gameBalance.startingResources.oxygen,
    food: gameBalance.startingResources.food,
    crewHealth: gameBalance.startingResources.crewHealth,
    cumulativeDose: 0,
    science: 0,
    pending: [],
    log: [],
  };
}

export function step(
  state: State,
  decision: Decision,
  todayEvents: GameEvent[],
): StepResult {
  const energyUsed = getEnergyCost(decision);
  if (!isAffordable(decision)) {
    throw new RangeError("Decision exceeds the daily energy budget.");
  }

  const day = state.day;
  const pending: PendingCME[] = [];
  const arrivedCmes = state.pending.filter((event) => event.arrivalDay <= day);
  for (const event of state.pending) {
    if (event.arrivalDay > day) pending.push(event);
  }

  const eventRefs: EventReference[] = todayEvents.map(({ id, donkiUrl }) => ({
    id,
    ...(donkiUrl ? { donkiUrl } : {}),
  }));
  const flareToday = todayEvents.some((event) => event.type === "flare");
  let hasCME = arrivedCmes.length > 0;
  let hasSEP = todayEvents.some(
    (event) => event.type === "sep" || event.hasSEP === true,
  );

  for (const event of arrivedCmes) {
    eventRefs.push({
      id: event.eventId,
      ...(event.donkiUrl ? { donkiUrl: event.donkiUrl } : {}),
    });
  }

  for (const event of todayEvents) {
    const arrivalDay = getCMEArrivalDay(event, day);
    if (arrivalDay !== null) {
      pending.push({
        eventId: event.id,
        arrivalDay,
        ...(event.donkiUrl ? { donkiUrl: event.donkiUrl } : {}),
      });
    }
  }

  const multiplier = getRadiationMultiplier(flareToday, hasCME, hasSEP);
  const shield = gameBalance.shieldLevels.find(
    (item) => item.level === decision.shield,
  );
  const life = gameBalance.lifeLevels.find(
    (item) => item.level === decision.life,
  );
  const comms = gameBalance.commsLevels.find(
    (item) => item.level === decision.comms,
  );
  const science = gameBalance.scienceLevels.find(
    (item) => item.level === decision.science,
  );

  if (!shield || !life || !comms || !science) {
    throw new RangeError("Decision contains an unsupported level.");
  }

  const doseDay =
    gameBalance.radiation.baselineDose *
    multiplier *
    (1 - shield.doseReduction);
  const doseWithoutShield =
    gameBalance.radiation.baselineDose * multiplier;
  const radiationHealthLoss =
    Math.max(0, doseDay - gameBalance.radiation.safeThreshold) *
    gameBalance.radiation.healthPerMSv;

  const oxygen = Math.max(
    0,
    state.oxygen +
      life.oxygenProduced -
      gameBalance.dailyConsumption.oxygen,
  );
  const food = Math.max(
    0,
    state.food + life.foodProduced - gameBalance.dailyConsumption.food,
  );
  const hasShortage = oxygen <= 0 || food <= 0;
  const shortageHealthLoss = hasShortage
    ? gameBalance.healthLossPerDayWithoutOxygenOrFood
    : 0;
  const crewHealth = Math.max(
    0,
    state.crewHealth - radiationHealthLoss - shortageHealthLoss,
  );
  const scienceEarned = science.researchPoints;
  const previousReport = state.log[state.log.length - 1];
  const earthAdvice =
    comms.earthAdvice && previousReport
      ? {
          key: "earth.adviceDelayed" as const,
          aboutDay: previousReport.day,
          eventIds: previousReport.eventRefs.map((event) => event.id),
        }
      : null;
  const cmeWarning = getUpcomingCMEWarning(
    pending,
    [],
    day,
    comms.warningDays,
  );

  const report: DayReport = {
    day,
    energyUsed,
    energyRemaining: gameBalance.dailyEnergyBudget - energyUsed,
    oxygen,
    food,
    crewHealth,
    cumulativeDose: state.cumulativeDose + doseDay,
    doseDay,
    radiationMultiplier: multiplier,
    doseWithoutShield,
    science: state.science + scienceEarned,
    scienceEarned,
    decision: { ...decision },
    eventRefs,
    cmeWarning,
    earthAdvice,
    messageKeys: [
      ...(multiplier > 1 ? (["radiation.alert"] as const) : []),
      ...(hasShortage ? (["resources.shortage"] as const) : []),
    ],
  };

  const nextState: State = {
    day: day + 1,
    oxygen,
    food,
    crewHealth,
    cumulativeDose: report.cumulativeDose,
    science: report.science,
    pending,
    log: [...state.log, report],
  };

  return { state: nextState, report };
}
