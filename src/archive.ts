import type { GameEvent } from "./engine/types";

export type ArchiveMeta = {
  source: string;
  retrieved: string;
  mode: "archive";
  notes: string;
};

export type ScenarioDay = {
  day: number;
  date: string;
  eventIds: string[];
};

export type EventsArchive = {
  meta: ArchiveMeta;
  events: GameEvent[];
  scenario: {
    titleKey: string;
    days: ScenarioDay[];
  };
};

export type SourceEntry = {
  id: string;
  name: string;
  url: string;
  usedFor_fr: string;
  usedFor_en: string;
  mode: "archive";
};

export type SourceCatalog = {
  meta: ArchiveMeta;
  sources: SourceEntry[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isArchiveMeta(value: unknown): value is ArchiveMeta {
  return (
    isRecord(value) &&
    typeof value.source === "string" &&
    typeof value.retrieved === "string" &&
    value.mode === "archive" &&
    typeof value.notes === "string"
  );
}

function isGameEvent(value: unknown): value is GameEvent {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.date === "string" &&
    (value.type === "flare" || value.type === "cme" || value.type === "sep") &&
    (value.donkiUrl === undefined || typeof value.donkiUrl === "string") &&
    (value.cmeDelayDays === undefined ||
      (typeof value.cmeDelayDays === "number" &&
        Number.isInteger(value.cmeDelayDays)))
  );
}

export function isEventsArchive(value: unknown): value is EventsArchive {
  if (
    !isRecord(value) ||
    !isArchiveMeta(value.meta) ||
    !Array.isArray(value.events) ||
    !value.events.every(isGameEvent) ||
    !isRecord(value.scenario) ||
    typeof value.scenario.titleKey !== "string" ||
    !Array.isArray(value.scenario.days) ||
    value.scenario.days.length !== 7
  ) {
    return false;
  }

  const eventIds = new Set(value.events.map((event) => event.id));
  return value.scenario.days.every(
    (day, index) =>
      isRecord(day) &&
      day.day === index + 1 &&
      typeof day.date === "string" &&
      Array.isArray(day.eventIds) &&
      day.eventIds.every(
        (id) => typeof id === "string" && eventIds.has(id),
      ),
  );
}

export function isSourceCatalog(value: unknown): value is SourceCatalog {
  return (
    isRecord(value) &&
    isArchiveMeta(value.meta) &&
    Array.isArray(value.sources) &&
    value.sources.every(
      (source) =>
        isRecord(source) &&
        typeof source.id === "string" &&
        typeof source.name === "string" &&
        typeof source.url === "string" &&
        typeof source.usedFor_fr === "string" &&
        typeof source.usedFor_en === "string" &&
        source.mode === "archive",
    )
  );
}
