import type { DayReport } from "../engine/types";
import type { Locale } from "../i18n";
import { t } from "../i18n";

type Props = {
  locale: Locale;
  log: DayReport[];
  crewHealth: number;
  onReplay: () => void;
};

export function Debrief({ locale, log, crewHealth, onReplay }: Props) {
  const charts = [
    { key: "energyChart" as const, value: (report: DayReport) => report.energyUsed, max: 100 },
    { key: "oxygenChart" as const, value: (report: DayReport) => report.oxygen, max: 60 },
    { key: "foodChart" as const, value: (report: DayReport) => report.food, max: 60 },
    { key: "doseChart" as const, value: (report: DayReport) => report.doseDay, max: 6 },
  ];

  return (
    <section className="panel p-5 sm:p-7">
      <h2 className="section-title">{t(locale, "debriefTitle")}</h2>
      <p className="mt-3 text-lg leading-7" role="status">
        {crewHealth > 0
          ? t(locale, "missionSurvived")
          : t(locale, "missionFailed")}
      </p>
      <h3 className="mt-7 font-bold">{t(locale, "dayHistory")}</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {charts.map((chart) => (
          <div className="rounded-xl bg-slate-800 p-4" key={chart.key}>
            <h4 className="text-sm font-bold">{t(locale, chart.key)}</h4>
            <div className="mt-3 flex h-24 items-end gap-2" aria-label={t(locale, chart.key)}>
              {log.map((report) => {
                const value = chart.value(report);
                const height = Math.min(100, Math.max(4, (value / chart.max) * 100));
                return (
                  <div className="flex min-w-0 flex-1 flex-col items-center gap-1" key={report.day}>
                    <span className="text-xs text-slate-300">{value.toFixed(value % 1 === 0 ? 0 : 1)}</span>
                    <div className="w-full rounded-t bg-orange-300" style={{ height: `${height}%` }} />
                    <span className="text-xs text-slate-400">{report.day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-xl border border-orange-200/30 bg-orange-200/10 p-4">
        <h3 className="font-bold text-orange-100">{t(locale, "lessonTitle")}</h3>
        <p className="mt-2 leading-7 text-slate-100">
          {crewHealth > 0
            ? t(locale, "lessonSurvived")
            : t(locale, "lessonFailed")}
        </p>
      </div>
      <button className="primary-button mt-6 w-full" onClick={onReplay} type="button">
        {t(locale, "replay")}
      </button>
    </section>
  );
}
