import type { State } from "../engine/types";
import type { Locale } from "../i18n";
import { t } from "../i18n";

type Props = {
  locale: Locale;
  state: State;
};

function Gauge({
  label,
  value,
  max,
  unit,
}: {
  label: string;
  value: number;
  max: number;
  unit: string;
}) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div>
      <div className="mb-2 flex justify-between gap-2 text-sm font-semibold">
        <span>{label}</span>
        <span>{value.toFixed(value % 1 === 0 ? 0 : 1)} {unit}</span>
      </div>
      <div
        aria-label={`${label}: ${value.toFixed(1)} ${unit}`}
        aria-valuemax={max}
        aria-valuemin={0}
        aria-valuenow={Math.min(max, value)}
        className="h-3 overflow-hidden rounded-full bg-slate-700"
        role="progressbar"
      >
        <div
          className="h-full rounded-full bg-orange-300 transition-[width]"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export function Gauges({ locale, state }: Props) {
  return (
    <section className="panel p-5 sm:p-6">
      <h2 className="section-title">{t(locale, "resources")}</h2>
      <div className="mt-5 space-y-5">
        <Gauge label={t(locale, "oxygen")} value={state.oxygen} max={60} unit="u" />
        <Gauge label={t(locale, "food")} value={state.food} max={60} unit="u" />
        <Gauge
          label={t(locale, "crewHealth")}
          value={state.crewHealth}
          max={100}
          unit="%"
        />
        <Gauge
          label={t(locale, "dose")}
          value={state.cumulativeDose}
          max={20}
          unit="mSv"
        />
      </div>
    </section>
  );
}
