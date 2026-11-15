import balance from "../data/balance.json";
import type {
  CMEWarning,
  Decision,
  GameEvent,
  PendingCME,
} from "./types";

export const gameBalance = balance;

export function getEnergyCost(decision: Decision): number {
  const life = gameBalance.lifeLevels.find((item) => item.level === decision.life);
  const shield = gameBalance.shieldLevels.find(
    (item) => item.level === decision.shield,
  );
  const comms = gameBalance.commsLevels.find(
    (item) => item.level === decision.comms,
  );
  const science = gameBalance.scienceLevels.find(
    (item) => item.level === decision.science,
  );

  if (!life || !shield || !comms || !science) {
    throw new RangeError("Decision contains an unsupported level.");
  }

  return (
    life.energyCost +
    shield.energyCost +
    comms.energyCost +
    science.energyCost
  );
}

export function isAffordable(
  decision: Decision,
  budget = gameBalance.dailyEnergyBudget,
): boolean {
  return Number.isFinite(budget) && budget >= 0 && getEnergyCost(decision) <= budget;
}

export function getRadiationMultiplier(
  hasFlare: boolean,
  hasCME: boolean,
  hasSEP: boolean,
): number {
  const multipliers = gameBalance.radiation.multipliers;

  if (hasCME && hasSEP) return multipliers.cmeAndSep;
  if (hasSEP) return multipliers.sep;
  if (hasCME) return multipliers.cme;
  if (hasFlare) return multipliers.flare;
  return multipliers.calm;
}

export function getUpcomingCMEWarning(
  pending: PendingCME[],
  todayEvents: GameEvent[],
  currentDay: number,
  warningDays: number,
): CMEWarning | null {
  const arrivals = [
    ...pending.map((event) => ({
      eventId: event.eventId,
      arrivalDay: event.arrivalDay,
    })),
    ...todayEvents.flatMap((event) =>
      event.hasCME &&
      event.cmeDelayDays !== undefined &&
      Number.isInteger(event.cmeDelayDays) &&
      event.cmeDelayDays >= 1 &&
      event.cmeDelayDays <= 3
        ? [{ eventId: event.id, arrivalDay: currentDay + event.cmeDelayDays }]
        : [],
    ),
  ];
  const warnedArrivals = arrivals
    .map((event) => ({
      eventId: event.eventId,
      daysAhead: event.arrivalDay - currentDay,
    }))
    .filter(
      (event) => event.daysAhead > 0 && event.daysAhead <= warningDays,
    );

  if (warnedArrivals.length === 0) return null;

  const daysAhead = Math.min(...warnedArrivals.map((event) => event.daysAhead));
  return {
    daysAhead,
    eventIds: warnedArrivals
      .filter((event) => event.daysAhead === daysAhead)
      .map((event) => event.eventId),
  };
}
