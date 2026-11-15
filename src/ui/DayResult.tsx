import type { DayReport } from "../engine/types";
import type { Locale, TextKey } from "../i18n";
import { t } from "../i18n";

type Props = {
  locale: Locale;
  report: DayReport;
  archiveDate?: string;
  eventTitles: Record<string, string>;
  onContinue: () => void;
};

export function DayResult({
  locale,
  report,
  archiveDate,
  eventTitles,
  onContinue,
}: Props) {
  const lifeNames: TextKey[] = ["low", "medium", "high"];
  const shieldNames: TextKey[] = ["none", "light", "strong", "max"];
  const commsNames: TextKey[] = ["low", "medium", "high"];
  const scienceNames: TextKey[] = ["none", "medium", "high"];

  return (
    <section className="panel p-5 sm:p-7">
      <h2 className="section-title">{t(locale, "dailyReport", { day: report.day })}</h2>
      {archiveDate && (
        <p className="mt-2 text-sm text-slate-300">
          {t(locale, "archiveDate", { date: archiveDate })}
        </p>
      )}
      <p className="mt-4 leading-7 text-slate-200">
        {t(locale, "decisionSummary", {
          life: t(locale, lifeNames[report.decision.life]),
          shield: t(locale, shieldNames[report.decision.shield]),
          comms: t(locale, commsNames[report.decision.comms]),
          science: t(locale, scienceNames[report.decision.science]),
          energy: report.energyUsed,
          dose: report.doseDay.toFixed(2),
        })}
      </p>
      <p className="mt-2 text-sm text-slate-300">
        {t(locale, "shieldEffect", {
          dose: report.doseWithoutShield.toFixed(2),
        })}
      </p>
      <ul className="mt-5 grid gap-3 text-base sm:grid-cols-2">
        <li className="rounded-lg bg-slate-800 p-3">
          {t(locale, "energySpent", { value: report.energyUsed })}
        </li>
        <li className="rounded-lg bg-slate-800 p-3">
          {t(locale, "oxygenStock", { value: report.oxygen })}
        </li>
        <li className="rounded-lg bg-slate-800 p-3">
          {t(locale, "foodStock", { value: report.food })}
        </li>
        <li className="rounded-lg bg-slate-800 p-3">
          {t(locale, "healthValue", { value: Math.round(report.crewHealth) })}
        </li>
        <li className="rounded-lg bg-slate-800 p-3">
          {t(locale, "doseValue", { value: report.doseDay.toFixed(2) })}
        </li>
        <li className="rounded-lg bg-slate-800 p-3">
          {t(locale, "multiplierValue", { value: report.radiationMultiplier })}
        </li>
        <li className="rounded-lg bg-slate-800 p-3 sm:col-span-2">
          {t(locale, "researchValue", { value: report.scienceEarned })}
        </li>
      </ul>

      {report.messageKeys.includes("radiation.alert") && (
        <p className="mt-4 rounded-lg border border-amber-300/50 bg-amber-300/10 p-4 text-amber-100" role="alert">
          ☀️ {t(locale, "radiationAlert")}
        </p>
      )}
      {report.messageKeys.includes("resources.shortage") && (
        <p className="mt-4 rounded-lg border border-red-300/50 bg-red-300/10 p-4 text-red-100" role="alert">
          ⚠️ {t(locale, "shortageAlert")}
        </p>
      )}
      {report.cmeWarning && (
        <p className="storm-alert mt-4 rounded-lg border border-sky-300/50 bg-sky-300/10 p-4 text-sky-100" role="alert">
          <span aria-hidden="true" className="mr-2">🌩️</span>
          {t(locale, "cmeWarning", { days: report.cmeWarning.daysAhead })}
        </p>
      )}
      {report.earthAdvice ? (
        <p className="mt-4 rounded-lg bg-slate-800 p-4 text-slate-200">
          {t(locale, "earthAdvice", { day: report.earthAdvice.aboutDay })}
        </p>
      ) : (
        <p className="mt-4 text-sm leading-6 text-slate-300">
          {t(locale, "noEarthAdvice")}
        </p>
      )}

      <div className="mt-5 border-t border-slate-700 pt-4">
        <h3 className="font-bold">{t(locale, "eventSources")}</h3>
        {report.eventRefs.length === 0 ? (
          <p className="mt-2 text-sm text-slate-300">{t(locale, "noEvents")}</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {report.eventRefs.map((event) => (
              <li key={`${event.id}-${event.donkiUrl ?? ""}`}>
                {event.donkiUrl ? (
                  <a className="text-sky-200 underline underline-offset-4" href={event.donkiUrl} rel="noreferrer" target="_blank">
                    {eventTitles[event.id] ?? event.id}
                  </a>
                ) : (
                  <span>{eventTitles[event.id] ?? event.id}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      <button className="primary-button mt-6 w-full" onClick={onContinue} type="button">
        {t(locale, "nextDay")}
      </button>
    </section>
  );
}
