import { describe, expect, it } from "vitest";
import { createInitialState, step } from "./step";
import type { Decision, GameEvent, State } from "./types";

const fixtureScenario: GameEvent[][] = [
  [
    {
      id: "fixture-flare-cme-a",
      date: "fixture-day-1",
      type: "flare",
      hasCME: true,
      cmeDelayDays: 2,
    },
  ],
  [],
  [
    {
      id: "fixture-sep-a",
      date: "fixture-day-3",
      type: "sep",
    },
  ],
  [],
  [
    {
      id: "fixture-flare-cme-b",
      date: "fixture-day-5",
      type: "flare",
      hasCME: true,
      cmeDelayDays: 1,
    },
  ],
  [
    {
      id: "fixture-sep-b",
      date: "fixture-day-6",
      type: "sep",
    },
  ],
  [],
];

function play(strategy: (state: State, events: GameEvent[]) => Decision) {
  let state = createInitialState();
  for (const events of fixtureScenario) {
    state = step(state, strategy(state, events), events).state;
  }
  return state;
}

const naive = () => ({
  life: 0,
  shield: 0,
  comms: 0,
  science: 2,
}) satisfies Decision;

const allShield = () => ({
  life: 2,
  shield: 3,
  comms: 0,
  science: 0,
}) satisfies Decision;

const adaptive = (state: State, events: GameEvent[]) => {
  const incomingCME = state.pending.some(
    (event) => event.arrivalDay === state.day,
  );
  const activeRadiation = incomingCME || events.some(
    (event) => event.type === "sep" || event.hasSEP === true,
  );

  return {
    life: 1,
    shield: activeRadiation ? 3 : 0,
    comms: 1,
    science: 1,
  } satisfies Decision;
};

describe("strategy balance simulation (synthetic mechanics fixture)", () => {
  it("makes the unshielded science-first strategy fail", () => {
    const result = play(naive);
    expect(result.crewHealth).toBe(0);
  });

  it("makes permanent maximum shielding survive with very little science", () => {
    const result = play(allShield);
    expect(result.crewHealth).toBeGreaterThan(0);
    expect(result.science).toBe(0);
  });

  it("lets a warning-aware strategy survive while earning science", () => {
    const result = play(adaptive);
    expect(result.crewHealth).toBeGreaterThan(0);
    expect(result.science).toBeGreaterThan(0);
  });
});
