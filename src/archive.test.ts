import { describe, expect, it } from "vitest";
import { isEventsArchive } from "./archive";

const archiveFixture = {
  meta: {
    source: "synthetic validation fixture",
    retrieved: "2026-11-14",
    mode: "archive",
    notes: "Test-only data; not a NASA event.",
  },
  events: [
    {
      id: "synthetic-test-event",
      date: "2024-05-01",
      type: "sep",
    },
  ],
  scenario: {
    titleKey: "testFixture",
    days: Array.from({ length: 7 }, (_, index) => ({
      day: index + 1,
      date: `2024-05-${String(index + 1).padStart(2, "0")}`,
      eventIds: index === 0 ? ["synthetic-test-event"] : [],
    })),
  },
};

describe("archive validation", () => {
  it("accepts a complete seven-day archive with valid event references", () => {
    expect(isEventsArchive(archiveFixture)).toBe(true);
  });

  it("rejects scenarios that reference missing events", () => {
    const invalidArchive = structuredClone(archiveFixture);
    invalidArchive.scenario.days[0].eventIds = ["missing-event"];

    expect(isEventsArchive(invalidArchive)).toBe(false);
  });
});
