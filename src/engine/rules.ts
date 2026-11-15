import balance from "../data/balance.json";
import type { Decision } from "./types";

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
