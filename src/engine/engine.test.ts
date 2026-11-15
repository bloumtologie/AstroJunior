import { describe, expect, it } from "vitest";
import { gameBalance, isAffordable } from "./rules";
import { createInitialState, step } from "./step";
import type { Decision, GameEvent } from "./types";

const balancedDecision: Decision = {
  life: 1,
  shield: 0,
  comms: 1,
  science: 1,
};

describe("mission engine", () => {
  it("keeps decisions within the daily energy budget", () => {
    expect(isAffordable(balancedDecision)).toBe(true);
    expect(
      isAffordable({ ...balancedDecision, shield: 3, science: 2 }),
    ).toBe(false);
  });

  it("calculates dose from the event multiplier and shield reduction", () => {
    const event: GameEvent = {
      id: "sep-test",
      date: "2024-05-01",
      type: "sep",
    };
    const { report } = step(
      createInitialState(),
      { ...balancedDecision, shield: 3 },
      [event],
    );
    const expected =
      gameBalance.radiation.baselineDose *
      gameBalance.radiation.multipliers.sep *
      (1 - gameBalance.shieldLevels[3].doseReduction);

    expect(report.doseDay).toBe(expected);
  });

  it("never lets oxygen or food stocks fall below zero", () => {
    const state = {
      ...createInitialState(),
      oxygen: 2,
      food: 1,
    };
    const { report } = step(
      state,
      { ...balancedDecision, life: 0 },
      [],
    );

    expect(report.oxygen).toBe(0);
    expect(report.food).toBe(0);
    expect(report.messageKeys).toContain("resources.shortage");
  });

  it("applies a flare's CME only after the configured delay", () => {
    const flare: GameEvent = {
      id: "flare-with-cme",
      date: "2024-05-01",
      type: "flare",
      hasCME: true,
      cmeDelayDays: 2,
    };
    const first = step(createInitialState(), balancedDecision, [flare]);
    const second = step(first.state, balancedDecision, []);
    const third = step(second.state, balancedDecision, []);

    expect(first.report.radiationMultiplier).toBe(
      gameBalance.radiation.multipliers.flare,
    );
    expect(second.report.radiationMultiplier).toBe(
      gameBalance.radiation.multipliers.calm,
    );
    expect(third.report.radiationMultiplier).toBe(
      gameBalance.radiation.multipliers.cme,
    );
  });

  it("delivers Earth information about the previous day", () => {
    const first = step(createInitialState(), balancedDecision, [
      { id: "flare-yesterday", date: "2024-05-01", type: "flare" },
    ]);
    const second = step(first.state, balancedDecision, []);

    expect(first.report.earthAdvice).toBeNull();
    expect(second.report.earthAdvice).toEqual({
      key: "earth.adviceDelayed",
      aboutDay: 1,
      eventIds: ["flare-yesterday"],
    });
  });

  it("is deterministic for identical inputs", () => {
    const event: GameEvent = {
      id: "sep-deterministic",
      date: "2024-05-01",
      type: "sep",
    };

    expect(step(createInitialState(), balancedDecision, [event])).toEqual(
      step(createInitialState(), balancedDecision, [event]),
    );
  });
});
