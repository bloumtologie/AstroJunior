import { useEffect, useMemo, useState } from "react";
import {
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
import { t, type Locale, type TextKey } from "./i18n";
import { About } from "./ui/About";
import { Briefing } from "./ui/Briefing";
import { Controls } from "./ui/Controls";
import { Countdown } from "./ui/Countdown";
import { DayResult } from "./ui/DayResult";
import { Debrief } from "./ui/Debrief";
import { Gauges } from "./ui/Gauges";
import { HowToPlay } from "./ui/HowToPlay";

type Screen = "briefing" | "help" | "countdown" | "decision" | "result" | "debrief" | "about";
type LoadState = "loading" | "ready" | "error";
type ArchiveLoadError =
  | { key: "archiveHttpError"; params: { file: string; status: number } }
  | { key: "archiveNotJson"; params: { file: string } }
  | { key: "archiveInvalid"; params: Record<string, never> }
  | { key: "archiveRequestFailed"; params: Record<string, never> };

class ArchiveLoadFailure extends Error {
  constructor(readonly details: ArchiveLoadError) {
    super(details.key);
  }
}

const initialDecision: Decision = {
  life: 1,
  shield: 0,
  comms: 1,
  science: 1,
};

function formatArchiveDate(date: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00Z`));
}

function playCountdownTone() {
  if (typeof window.AudioContext !== "function") return;
  const context = new window.AudioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = "sine";
  oscillator.frequency.value = 620;
  gain.gain.setValueAtTime(0.06, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.16);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.16);
  oscillator.onended = () => void context.close();
}

function App() {
  const [locale, setLocale] = useState<Locale>("en");
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [archiveError, setArchiveError] = useState<ArchiveLoadError | null>(null);
  const [archive, setArchive] = useState<EventsArchive | null>(null);
  const [sources, setSources] = useState<SourceCatalog["sources"]>([]);
  const [screen, setScreen] = useState<Screen>("briefing");
  const [gameState, setGameState] = useState<State>(createInitialState);
  const [decision, setDecision] = useState<Decision>(initialDecision);
  const [report, setReport] = useState<DayReport | null>(null);
  const [gameError, setGameError] = useState("");
  const [crewName, setCrewName] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [aboutReturnScreen, setAboutReturnScreen] = useState<Screen>("briefing");

  async function loadArchive() {
    setLoadState("loading");
    setArchiveError(null);

    try {
      const [eventsResponse, sourcesResponse] = await Promise.all([
        fetch("/data/events.json"),
        fetch("/data/sources.json"),
      ]);
      if (!eventsResponse.ok) {
        throw new ArchiveLoadFailure({
          key: "archiveHttpError",
          params: { file: "events.json", status: eventsResponse.status },
        });
      }
      if (!sourcesResponse.ok) {
        throw new ArchiveLoadFailure({
          key: "archiveHttpError",
          params: { file: "sources.json", status: sourcesResponse.status },
        });
      }
      if (
        !eventsResponse.headers
          .get("content-type")
          ?.includes("application/json")
      ) {
        throw new ArchiveLoadFailure({
          key: "archiveNotJson",
          params: { file: "events.json" },
        });
      }
      if (
        !sourcesResponse.headers
          .get("content-type")
          ?.includes("application/json")
      ) {
        throw new ArchiveLoadFailure({
          key: "archiveNotJson",
          params: { file: "sources.json" },
        });
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
        throw new ArchiveLoadFailure({
          key: "archiveInvalid",
          params: {},
        });
      }

      setArchive(eventsData);
      setSources(sourcesData.sources);
      setLoadState("ready");
    } catch (error) {
      setArchive(null);
      setLoadState("error");
      setArchiveError(
        error instanceof ArchiveLoadFailure
          ? error.details
          : error instanceof SyntaxError
            ? { key: "archiveInvalid", params: {} }
            : { key: "archiveRequestFailed", params: {} },
      );
    }
  }

  useEffect(() => {
    void loadArchive();
  }, []);

  useEffect(() => {
    if (screen !== "countdown") return;
    setCountdown(3);
    let remaining = 3;
    let finishTimer: number | undefined;
    const timer = window.setInterval(() => {
      remaining -= 1;
      if (remaining > 0) {
        setCountdown(remaining);
        if (soundEnabled) playCountdownTone();
        return;
      }
      setCountdown(0);
      if (soundEnabled) playCountdownTone();
      window.clearInterval(timer);
      finishTimer = window.setTimeout(startMission, 750);
    }, 850);
    return () => {
      window.clearInterval(timer);
      if (finishTimer !== undefined) window.clearTimeout(finishTimer);
    };
  }, [screen, soundEnabled]);

  useEffect(() => {
    if (!voiceEnabled || typeof window.speechSynthesis === "undefined") return;
    const copyByScreen: Record<Screen, string> = {
      briefing: t(locale, "homeSlogan"),
      help: t(locale, "helpTitle"),
      countdown: countdown > 0
        ? `${t(locale, "countdownLabel")} ${countdown}`
        : t(locale, "countdownGo"),
      decision: t(locale, "choosePlan"),
      result: report ? t(locale, "dailyReport", { day: report.day }) : "",
      debrief: t(locale, "crewDebrief", {
        crew: crewName.trim() || t(locale, "crewDefault"),
      }),
      about: t(locale, "aboutTitle"),
    };
    const utterance = new SpeechSynthesisUtterance(copyByScreen[screen]);
    utterance.lang = locale === "fr" ? "fr-FR" : "en-US";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    return () => window.speechSynthesis.cancel();
  }, [countdown, crewName, locale, report, screen, voiceEnabled]);

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
  const scenarioRange = archive
    ? t(locale, "scenarioRange", {
        start: formatArchiveDate(archive.scenario.days[0].date, locale),
        end: formatArchiveDate(
          archive.scenario.days[archive.scenario.days.length - 1].date,
          locale,
        ),
      })
    : undefined;
  const currentScenarioDate = archive?.scenario.days.find(
    (item) => item.day === gameState.day,
  )?.date;
  const reportArchiveDate =
    archive && report
      ? archive.scenario.days.find((item) => item.day === report.day)?.date
      : undefined;
  const nasaReference = useMemo(() => {
    if (!archive) return undefined;

    const reportsByDose = [...gameState.log].sort(
      (left, right) => right.doseDay - left.doseDay,
    );
    for (const missionReport of reportsByDose) {
      const reportEvents = missionReport.eventRefs
        .map((reference) =>
          archive.events.find((event) => event.id === reference.id),
        )
        .filter((event) => event !== undefined);
      const event =
        reportEvents.find((item) => item.type === "sep") ?? reportEvents[0];
      if (!event) continue;

      const shieldNames: TextKey[] = ["none", "light", "strong", "max"];
      return {
        event,
        date: formatArchiveDate(event.date, locale),
        day: missionReport.day,
        dose: missionReport.doseDay.toFixed(2),
        shield: shieldNames[missionReport.decision.shield],
      };
    }
    return undefined;
  }, [archive, gameState.log, locale]);
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

  function beginCountdown() {
    setCountdown(3);
    setScreen("countdown");
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
  const missionDisabledReason =
    loadState === "loading"
      ? t(locale, "loading")
      : loadState === "error"
        ? `${t(locale, "archiveError")} ${archiveError ? t(locale, archiveError.key, archiveError.params) : ""}`
        : undefined;
  function showAbout() {
    setAboutReturnScreen(screen);
    setScreen("about");
  }

  return (
    <div className="min-h-screen bg-night px-3 py-3 font-body text-paper sm:px-6 sm:py-6">
      <div className={`mx-auto max-w-5xl ${screen === "briefing" ? "" : "space-y-5"}`}>
        {screen !== "briefing" && (
          <header className="flex flex-wrap items-center justify-between gap-3">
            <div className="font-display text-lg font-extrabold text-paper sm:text-2xl">
              🚀 {t(locale, "title")}
            </div>
            <div className="flex items-center gap-2">
              {screen !== "about" && (
                <button
                  aria-label={t(locale, "aboutTitle")}
                  className="secondary-button text-sm"
                  onClick={showAbout}
                  type="button"
                >
                  ℹ️ <span className="hidden sm:inline">{t(locale, "aboutTitle")}</span>
                </button>
              )}
              <label className="sr-only" htmlFor="mission-language">
                {t(locale, "language")}
              </label>
              <select
                className="min-h-12 rounded-2xl border border-white/20 bg-night px-3 font-bold text-paper"
                id="mission-language"
                onChange={(event) => setLocale(event.target.value as Locale)}
                value={locale}
              >
                <option value="fr">🇫🇷</option>
                <option value="en">🇬🇧</option>
              </select>
              <button
                aria-label={t(locale, "homeBack")}
                className="secondary-button text-sm"
                onClick={() => setScreen("briefing")}
                type="button"
              >
                🏠
              </button>
            </div>
          </header>
        )}

        {gameError && (
          <p className="rounded-2xl border border-red-300/60 bg-night px-4 py-3 text-paper" role="alert">
            {gameError}
          </p>
        )}

        <main className="space-y-5">
          <div className="screen-transition" key={screen}>
            {screen === "briefing" && (
              <Briefing
                canRetry={loadState === "error"}
                crewName={crewName}
                disabledReason={missionDisabledReason}
                locale={locale}
                onCrewNameChange={setCrewName}
                onHowToPlay={() => setScreen("help")}
                onLocaleChange={setLocale}
                onRetry={() => void loadArchive()}
                onShowAbout={showAbout}
                onSoundToggle={() => setSoundEnabled((enabled) => !enabled)}
                onStart={beginCountdown}
                onVoiceToggle={() => setVoiceEnabled((enabled) => !enabled)}
                scenarioRange={scenarioRange}
                soundEnabled={soundEnabled}
                voiceEnabled={voiceEnabled}
              />
            )}
            {screen === "help" && (
              <HowToPlay
                locale={locale}
                onBack={() => setScreen("briefing")}
                onStart={beginCountdown}
              />
            )}
            {screen === "countdown" && (
              <Countdown count={countdown} locale={locale} />
            )}
            {screen === "decision" && (
              <>
                <div className="flex items-center justify-between gap-3">
                  <p className="eyebrow">
                    {t(locale, "day", {
                      day: currentDay,
                      total: gameBalance.durationDays,
                    })}
                  </p>
                  {currentScenarioDate && (
                    <p className="rounded-full border border-white/20 bg-white/5 px-3 py-2 text-xs font-bold text-paper sm:text-sm">
                      {t(locale, "archiveDate", {
                        date: formatArchiveDate(currentScenarioDate, locale),
                      })}
                    </p>
                  )}
                </div>
                <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
                  <Controls
                    cmeWarning={decisionCMEWarning}
                    decision={decision}
                    locale={locale}
                    onChange={setDecision}
                    onConfirm={confirmDay}
                  />
                  <Gauges
                    crewName={crewName}
                    decision={decision}
                    locale={locale}
                    state={gameState}
                    storm={Boolean(decisionCMEWarning)}
                  />
                </div>
              </>
            )}
            {screen === "result" && report && (
              <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
                <DayResult
                  archiveDate={
                    reportArchiveDate
                      ? formatArchiveDate(reportArchiveDate, locale)
                      : undefined
                  }
                  eventTitles={eventTitles}
                  locale={locale}
                  onContinue={continueMission}
                  report={report}
                />
                <Gauges
                  crewName={crewName}
                  decision={report.decision}
                  locale={locale}
                  state={gameState}
                  storm={
                    Boolean(report.cmeWarning) ||
                    report.messageKeys.includes("radiation.alert")
                  }
                />
              </div>
            )}
            {screen === "debrief" && (
              <Debrief
                crewHealth={gameState.crewHealth}
                crewName={crewName.trim() || t(locale, "crewDefault")}
                log={gameState.log}
                locale={locale}
                nasaReference={nasaReference}
                onReplay={startMission}
              />
            )}
            {screen === "about" && (
              <About
                archiveReady={loadState === "ready"}
                locale={locale}
                onBack={() => setScreen(aboutReturnScreen)}
                sources={sources}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
