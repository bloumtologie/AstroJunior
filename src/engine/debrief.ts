import { gameBalance } from "./rules";
import type { DayReport } from "./types";

export type TradeoffInsight =
  | {
      key: "debrief.tradeoffMissed";
      params: { day: number; extraEnergy: number; extraProduction: number };
    }
  | {
      key: "debrief.tradeoffNoShortage";
      params: Record<string, never>;
    }
  | {
      key: "debrief.tradeoffLifeMax";
      params: { day: number };
    };

export function getTradeoffInsight(log: DayReport[]): TradeoffInsight {
  const shortage = log.find((report) => report.oxygen === 0 || report.food === 0);
  if (!shortage) {
    return {
      key: "debrief.tradeoffNoShortage",
      params: {},
    };
  }

  const currentLife = gameBalance.lifeLevels[shortage.decision.life];
  const nextLife = gameBalance.lifeLevels[shortage.decision.life + 1];
  if (!nextLife) {
    return {
      key: "debrief.tradeoffLifeMax",
      params: { day: shortage.day },
    };
  }

  return {
    key: "debrief.tradeoffMissed",
    params: {
      day: shortage.day,
      extraEnergy: nextLife.energyCost - currentLife.energyCost,
      extraProduction: nextLife.oxygenProduced - currentLife.oxygenProduced,
    },
  };
}
