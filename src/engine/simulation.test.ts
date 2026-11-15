import eventsArchiveData from "../../public/data/events.json";
import { describe, expect, it } from "vitest";
import { isEventsArchive } from "../archive";
import type { EventsArchive } from "../archive";
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

function loadMay2024Archive(): EventsArchive {
  const parsed: unknown = eventsArchiveData;
  if (!isEventsArchive(parsed)) {
    throw new Error("The May 2024 DONKI archive failed validation.");
  }
  return parsed;
}

function playMay2024(
  strategy: (state: State, events: GameEvent[]) => Decision,
): State {
  const archive = loadMay2024Archive();
  const eventsById = new Map(archive.events.map((event) => [event.id, event]));
  let state = createInitialState();

  for (const scenarioDay of archive.scenario.days) {
    const events = scenarioDay.eventIds.map((id) => {
      const event = eventsById.get(id);
      if (!event) throw new Error(`Missing archive event: ${id}`);
      return event;
    });
    state = step(state, strategy(state, events), events).state;
    if (state.crewHealth <= 0) break;
  }
  return state;
}

const archiveNaive = () =>
  ({
    life: 0,
    shield: 0,
    comms: 0,
    science: 2,
  }) satisfies Decision;

const archiveAllShield = () =>
  ({
    life: 2,
    shield: 3,
    comms: 0,
    science: 0,
  }) satisfies Decision;

const archiveAdaptive = (state: State, events: GameEvent[]) => {
  const comms: Decision["comms"] = 2;
  const sepToday = events.some(
    (event) => event.type === "sep" || event.hasSEP === true,
  );
  const cmeArrivesToday = state.pending.some(
    (event) => event.arrivalDay === state.day,
  );
  const shield: Decision["shield"] = sepToday ? 3 : cmeArrivesToday ? 2 : 0;
  const science: Decision["science"] =
    shield === 3 ? 1 : shield === 2 ? 2 : 2;

  return {
    life: 1,
    shield,
    comms,
    science,
  } satisfies Decision;
};

describe("strategy balance simulation (archived May 2024 DONKI data)", () => {
  it("fails for the unshielded science-first strategy", () => {
    const result = playMay2024(archiveNaive);
    expect(result.crewHealth).toBe(0);
  });

  it("makes permanent maximum shielding spend all research energy", () => {
    const result = playMay2024(archiveAllShield);
    expect(result.crewHealth).toBeGreaterThan(0);
    expect(result.science).toBe(0);
  });

  it("lets a risk-adaptive shield strategy survive and earn research", () => {
    const result = playMay2024(archiveAdaptive);
    expect(result.crewHealth).toBeGreaterThan(0);
    expect(result.science).toBeGreaterThan(0);
  });
});
