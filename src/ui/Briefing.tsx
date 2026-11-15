import type { Locale } from "../i18n";
import { t } from "../i18n";

type Props = {
  locale: Locale;
  disabledReason?: string;
  scenarioRange?: string;
  onStart: () => void;
};

export function Briefing({
  locale,
  disabledReason,
  scenarioRange,
  onStart,
}: Props) {
  return (
    <section className="panel mx-auto max-w-3xl p-6 sm:p-10">
      <p className="eyebrow">{t(locale, "briefingEyebrow")}</p>
      <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl">
        {t(locale, "briefingTitle")}
      </h1>
      <p className="mt-6 text-lg leading-8 text-slate-300">
        {t(locale, "briefingBody")}
      </p>
      <p className="mt-5 rounded-xl border border-sky-300/30 bg-sky-300/10 p-4 text-base leading-7 text-sky-100">
        {t(locale, "briefingFact")}
      </p>
      {scenarioRange && (
        <p className="mt-4 text-sm font-semibold text-slate-200">
          {scenarioRange}
        </p>
      )}
      {disabledReason && (
        <p className="mt-5 text-sm text-amber-200" role="status">
          {disabledReason}
        </p>
      )}
      <button
        className="primary-button mt-8"
        disabled={Boolean(disabledReason)}
        onClick={onStart}
        type="button"
      >
        {t(locale, "startMission")}
      </button>
    </section>
  );
}
