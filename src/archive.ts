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
  mode: "archive" | "reference";
};

export type SourceCatalog = {
  meta: ArchiveMeta;
  sources: SourceEntry[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isIsoDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const parsed = new Date(`${value}T00:00:00Z`);
  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === value
  );
}

function isHttpUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function isArchiveMeta(value: unknown): value is ArchiveMeta {
  return (
    isRecord(value) &&
    typeof value.source === "string" &&
    isIsoDate(value.retrieved) &&
    value.mode === "archive" &&
    typeof value.notes === "string"
  );
}

function isGameEvent(value: unknown): value is GameEvent {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    isIsoDate(value.date) &&
    (value.type === "flare" || value.type === "cme" || value.type === "sep") &&
    (value.hasCME === undefined || typeof value.hasCME === "boolean") &&
    (value.hasSEP === undefined || typeof value.hasSEP === "boolean") &&
    (value.donkiUrl === undefined || isHttpUrl(value.donkiUrl)) &&
    (value.title_fr === undefined || typeof value.title_fr === "string") &&
    (value.title_en === undefined || typeof value.title_en === "string") &&
    (value.linkedEvents === undefined ||
      (Array.isArray(value.linkedEvents) &&
        value.linkedEvents.every((id) => typeof id === "string"))) &&
    (value.cmeDelayDays === undefined ||
      (typeof value.cmeDelayDays === "number" &&
        Number.isInteger(value.cmeDelayDays) &&
        value.cmeDelayDays >= 1 &&
        value.cmeDelayDays <= 3))
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
  if (eventIds.size !== value.events.length) return false;

  let previousDate: Date | null = null;
  return value.scenario.days.every((day, index) => {
    if (
      !isRecord(day) ||
      day.day !== index + 1 ||
      !isIsoDate(day.date) ||
      !Array.isArray(day.eventIds) ||
      !day.eventIds.every(
        (id) => typeof id === "string" && eventIds.has(id),
      )
    ) {
      return false;
    }

    const currentDate = new Date(`${day.date}T00:00:00Z`);
    const isConsecutive =
      previousDate === null ||
      currentDate.getTime() - previousDate.getTime() === 24 * 60 * 60 * 1000;
    previousDate = currentDate;
    return isConsecutive;
  });
}

export function isSourceCatalog(value: unknown): value is SourceCatalog {
  return (
    isRecord(value) &&
    isArchiveMeta(value.meta) &&
    Array.isArray(value.sources) &&
    new Set(
      value.sources
        .filter(isRecord)
        .map((source) => source.id)
        .filter((id) => typeof id === "string"),
    ).size === value.sources.length &&
    value.sources.every(
      (source) =>
        isRecord(source) &&
        typeof source.id === "string" &&
        typeof source.name === "string" &&
        isHttpUrl(source.url) &&
        typeof source.usedFor_fr === "string" &&
        typeof source.usedFor_en === "string" &&
        (source.mode === "archive" || source.mode === "reference"),
    )
  );
}
