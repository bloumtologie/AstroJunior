import { useEffect, useMemo, useState } from "react";
import {
  getEnergyCost,
  getUpcomingCMEWarning,
  isAffordable,
  gameBalance,
} from "./engine/rules";
import { createInitialState, step } from "./engine/step";
import type { Decision, DayReport, State } from "./engine/types";
import {
  isEventsArchive,
  isSourceCatalog,
  type SourceCatalog,
  type EventsArchive,
} from "./archive";
import { t, type Locale } from "./i18n";
import { Briefing } from "./ui/Briefing";
import { Controls } from "./ui/Controls";
import { DayResult } from "./ui/DayResult";
import { Debrief } from "./ui/Debrief";
import { Gauges } from "./ui/Gauges";
import { Glossary } from "./ui/Glossary";
import { SourcesPanel } from "./ui/SourcesPanel";

type Screen = "briefing" | "decision" | "result" | "debrief";
type LoadState = "loading" | "ready" | "error";

const initialDecision: Decision = {
  life: 1,
  shield: 0,
  comms: 1,
  science: 1,
};

function App() {
  const [locale, setLocale] = useState<Locale>("fr");
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [archiveError, setArchiveError] = useState("");
  const [archive, setArchive] = useState<EventsArchive | null>(null);
  const [sources, setSources] = useState<SourceCatalog["sources"]>([]);
  const [screen, setScreen] = useState<Screen>("briefing");
  const [gameState, setGameState] = useState<State>(createInitialState);
  const [decision, setDecision] = useState<Decision>(initialDecision);
  const [report, setReport] = useState<DayReport | null>(null);
  const [gameError, setGameError] = useState("");

  async function loadArchive() {
    setLoadState("loading");
    setArchiveError("");

    try {
      const [eventsResponse, sourcesResponse] = await Promise.all([
        fetch("/data/events.json"),
        fetch("/data/sources.json"),
      ]);
      if (!eventsResponse.ok) {
        throw new Error(`events.json returned HTTP ${eventsResponse.status}`);
      }
      if (!sourcesResponse.ok) {
        throw new Error(`sources.json returned HTTP ${sourcesResponse.status}`);
      }
      if (
        !eventsResponse.headers
          .get("content-type")
          ?.includes("application/json")
      ) {
        throw new Error("events.json is missing or did not return JSON.");
      }
      if (
        !sourcesResponse.headers
          .get("content-type")
          ?.includes("application/json")
      ) {
        throw new Error("sources.json is missing or did not return JSON.");
      }

      const [eventsData, sourcesData]: [unknown, unknown] = await Promise.all([
        eventsResponse.json(),
        sourcesResponse.json(),
      ]);
      if (
        !isEventsArchive(eventsData) ||
        !isSourceCatalog(sourcesData) ||
        eventsData.scenario.days.length !== gameBalance.durationDays
      ) {
        throw new Error("Archive metadata or scenario length is invalid.");
      }

      setArchive(eventsData);
      setSources(sourcesData.sources);
      setLoadState("ready");
    } catch (error) {
      setArchive(null);
      setLoadState("error");
      setArchiveError(
        error instanceof Error ? error.message : "Unknown archive loading error.",
      );
    }
  }

  useEffect(() => {
    void loadArchive();
  }, []);

  const eventTitles = useMemo(
    () =>
      Object.fromEntries(
        (archive?.events ?? []).map((event) => [
          event.id,
          locale === "fr"
            ? event.title_fr ?? `${event.type.toUpperCase()} · ${event.date}`
            : event.title_en ?? `${event.type.toUpperCase()} · ${event.date}`,
        ]),
      ),
    [archive, locale],
  );
  const dayEvents = useMemo(() => {
    if (!archive) return [];
    const scenarioDay = archive.scenario.days.find(
      (item) => item.day === gameState.day,
    );
    if (!scenarioDay) return [];

    return scenarioDay.eventIds.map((id) => {
      const event = archive.events.find((item) => item.id === id);
      if (!event) throw new Error(`Scenario references missing event: ${id}`);
      return event;
    });
  }, [archive, gameState.day]);

  function startMission() {
    setGameState(createInitialState());
    setDecision(initialDecision);
    setReport(null);
    setGameError("");
    setScreen("decision");
  }

  function confirmDay() {
    try {
      if (!isAffordable(decision)) {
        throw new RangeError("Decision exceeds the daily energy budget.");
      }
      const result = step(gameState, decision, dayEvents);
      setGameState(result.state);
      setReport(result.report);
      setScreen("result");
    } catch (error) {
      setGameError(
        error instanceof Error ? error.message : "Unknown mission error.",
      );
    }
  }

  function continueMission() {
    setReport(null);
    if (gameState.day > gameBalance.durationDays || gameState.crewHealth <= 0) {
      setScreen("debrief");
    } else {
      setDecision(initialDecision);
      setScreen("decision");
    }
  }

  const currentDay = Math.min(gameState.day, gameBalance.durationDays);
  const comms = gameBalance.commsLevels[decision.comms];
  const decisionCMEWarning = getUpcomingCMEWarning(
    gameState.pending,
    dayEvents,
    gameState.day,
    comms.warningDays,
  );
  const visibleEnergyRemaining =
    screen === "result" && report
      ? report.energyRemaining
      : screen === "debrief"
        ? gameState.log[gameState.log.length - 1]?.energyRemaining ??
          gameBalance.dailyEnergyBudget
        : gameBalance.dailyEnergyBudget - getEnergyCost(decision);
  const missionDisabledReason =
    loadState === "loading"
      ? t(locale, "loading")
      : loadState === "error"
        ? `${t(locale, "archiveError")} (${archiveError})`
        : undefined;

  return (
    <div className="min-h-screen px-4 py-5 sm:px-7 sm:py-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="eyebrow">{t(locale, "archiveLabel")}</p>
            <p className="mt-1 text-xl font-extrabold">{t(locale, "title")}</p>
          </div>
          <label className="flex items-center gap-3 text-sm font-semibold">
            <span>{t(locale, "language")}</span>
            <select
              className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white"
              onChange={(event) => setLocale(event.target.value as Locale)}
              value={locale}
            >
              <option value="fr">{t(locale, "french")}</option>
              <option value="en">{t(locale, "english")}</option>
            </select>
          </label>
        </header>

        {loadState === "error" && screen === "briefing" && (
          <div className="panel mb-6 border-amber-300/40 p-5" role="alert">
            <h2 className="font-bold text-amber-100">{t(locale, "archiveErrorTitle")}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-200">
              {t(locale, "archiveError")} {archiveError}
            </p>
            <button className="secondary-button mt-4" onClick={() => void loadArchive()} type="button">
              {t(locale, "tryAgain")}
            </button>
          </div>
        )}

        {gameError && (
          <p className="mb-5 rounded-lg border border-red-300/40 bg-red-300/10 p-4 text-red-100" role="alert">
            {gameError}
          </p>
        )}

        <main className="space-y-6">
          {screen !== "briefing" && (
            <p className="panel px-5 py-3 text-right font-bold text-orange-100" aria-live="polite">
              {t(locale, "energyRemaining")}: {visibleEnergyRemaining}{" "}
              {t(locale, "energy")}
            </p>
          )}
          {screen === "briefing" && (
            <Briefing
              disabledReason={missionDisabledReason}
              locale={locale}
              onStart={startMission}
            />
          )}
          {screen === "decision" && (
            <>
              <p className="eyebrow">
                {t(locale, "day", {
                  day: currentDay,
                  total: gameBalance.durationDays,
                })}
              </p>
              <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
                <Controls
                  cmeWarning={decisionCMEWarning}
                  decision={decision}
                  locale={locale}
                  onChange={setDecision}
                  onConfirm={confirmDay}
                />
                <Gauges locale={locale} state={gameState} />
              </div>
            </>
          )}
          {screen === "result" && report && (
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <DayResult
                eventTitles={eventTitles}
                locale={locale}
                onContinue={continueMission}
                report={report}
              />
              <Gauges locale={locale} state={gameState} />
            </div>
          )}
          {screen === "debrief" && (
            <Debrief
              crewHealth={gameState.crewHealth}
              log={gameState.log}
              locale={locale}
              onReplay={startMission}
            />
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <Glossary locale={locale} />
            <SourcesPanel
              archiveReady={loadState === "ready"}
              locale={locale}
              sources={sources}
            />
          </div>
          <section className="panel border-slate-700 p-5">
            <h2 className="font-bold">{t(locale, "limitTitle")}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              {t(locale, "limits")}
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
