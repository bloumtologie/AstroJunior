import { describe, expect, it } from "vitest";
import type { DayReport } from "./types";
import { getTradeoffInsight } from "./debrief";

function makeReport(
  overrides: Partial<DayReport> = {},
): DayReport {
  return {
    day: 1,
    energyUsed: 55,
    energyRemaining: 45,
    oxygen: 30,
    food: 30,
    crewHealth: 100,
    cumulativeDose: 0.5,
    doseDay: 0.5,
    radiationMultiplier: 1,
    doseWithoutShield: 0.5,
    science: 1,
    scienceEarned: 1,
    decision: { life: 0, shield: 0, comms: 1, science: 1 },
    eventRefs: [],
    cmeWarning: null,
    earthAdvice: null,
    messageKeys: [],
    ...overrides,
  };
}

describe("debrief tradeoff insight", () => {
  it("explains the next life-support step after the first observed shortage", () => {
    const insight = getTradeoffInsight([
      makeReport({ day: 2, oxygen: 0, decision: { life: 1, shield: 0, comms: 1, science: 1 } }),
      makeReport({ day: 3, food: 0 }),
    ]);

    expect(insight).toEqual({
      key: "debrief.tradeoffMissed",
      params: {
        day: 2,
        extraEnergy: 15,
        extraProduction: 4,
      },
    });
  });

  it("does not claim a shortage when all stocks remained above zero", () => {
    expect(getTradeoffInsight([makeReport()])).toEqual({
      key: "debrief.tradeoffNoShortage",
      params: {},
    });
  });

  it("reports when life support was already at its highest level", () => {
    expect(
      getTradeoffInsight([
        makeReport({
          day: 4,
          food: 0,
          decision: { life: 2, shield: 0, comms: 1, science: 1 },
        }),
      ]),
    ).toEqual({
      key: "debrief.tradeoffLifeMax",
      params: { day: 4 },
    });
  });
});
