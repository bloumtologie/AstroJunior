import { describe, expect, it } from "vitest";
import {
  gameBalance,
  getUpcomingCMEWarning,
  isAffordable,
} from "./rules";
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

  it("treats a DONKI CME start as detection, then applies its default game delay", () => {
    const cme: GameEvent = {
      id: "cme-detection",
      date: "2024-05-01",
      type: "cme",
    };
    const first = step(createInitialState(), balancedDecision, [cme]);
    const second = step(first.state, balancedDecision, []);
    const third = step(second.state, balancedDecision, []);

    expect(first.report.radiationMultiplier).toBe(
      gameBalance.radiation.multipliers.calm,
    );
    expect(first.state.pending).toEqual([
      {
        eventId: cme.id,
        arrivalDay: 1 + gameBalance.radiation.defaultCmeDelayDays,
      },
    ]);
    expect(second.report.radiationMultiplier).toBe(
      gameBalance.radiation.multipliers.calm,
    );
    expect(third.report.radiationMultiplier).toBe(
      gameBalance.radiation.multipliers.cme,
    );
  });

  it("shows a CME warning before the player makes the protected-day decision", () => {
    const flare: GameEvent = {
      id: "flare-with-cme",
      date: "2024-05-01",
      type: "flare",
      hasCME: true,
      cmeDelayDays: 2,
    };
    const dayOneWarning = getUpcomingCMEWarning(
      [],
      [flare],
      1,
      gameBalance.commsLevels[2].warningDays,
    );
    const dayTwoWarning = getUpcomingCMEWarning(
      [{ eventId: flare.id, arrivalDay: 3 }],
      [],
      2,
      gameBalance.commsLevels[1].warningDays,
    );

    expect(dayOneWarning).toEqual({ daysAhead: 2, eventIds: [flare.id] });
    expect(dayTwoWarning).toEqual({ daysAhead: 1, eventIds: [flare.id] });
  });

  it("warns about a DONKI CME using the declared game delay", () => {
    const cme: GameEvent = {
      id: "cme-detection",
      date: "2024-05-01",
      type: "cme",
    };

    expect(
      getUpcomingCMEWarning(
        [],
        [cme],
        1,
        gameBalance.commsLevels[2].warningDays,
      ),
    ).toEqual({
      daysAhead: gameBalance.radiation.defaultCmeDelayDays,
      eventIds: [cme.id],
    });
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
