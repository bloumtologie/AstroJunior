export type LifeLevel = 0 | 1 | 2;
export type ShieldLevel = 0 | 1 | 2 | 3;
export type CommsLevel = 0 | 1 | 2;
export type ScienceLevel = 0 | 1 | 2;

export type Decision = {
  life: LifeLevel;
  shield: ShieldLevel;
  comms: CommsLevel;
  science: ScienceLevel;
};

export type GameEvent = {
  id: string;
  date: string;
  type: "flare" | "cme" | "sep";
  hasCME?: boolean;
  hasSEP?: boolean;
  cmeDelayDays?: number;
  donkiUrl?: string;
  title_fr?: string;
  title_en?: string;
  linkedEvents?: string[];
};

export type PendingCME = {
  eventId: string;
  arrivalDay: number;
  donkiUrl?: string;
};

export type EventReference = {
  id: string;
  donkiUrl?: string;
};

export type EarthAdvice = {
  key: "earth.adviceDelayed";
  aboutDay: number;
  eventIds: string[];
};

export type CMEWarning = {
  daysAhead: number;
  eventIds: string[];
};

export type DayReport = {
  day: number;
  energyUsed: number;
  energyRemaining: number;
  oxygen: number;
  food: number;
  crewHealth: number;
  cumulativeDose: number;
  doseDay: number;
  radiationMultiplier: number;
  doseWithoutShield: number;
  science: number;
  scienceEarned: number;
  decision: Decision;
  eventRefs: EventReference[];
  cmeWarning: CMEWarning | null;
  earthAdvice: EarthAdvice | null;
  messageKeys: Array<"radiation.alert" | "resources.shortage">;
};

export type State = {
  day: number;
  oxygen: number;
  food: number;
  crewHealth: number;
  cumulativeDose: number;
  science: number;
  pending: PendingCME[];
  log: DayReport[];
};

export type StepResult = {
  state: State;
  report: DayReport;
};
