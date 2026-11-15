import type { Locale } from "../i18n";
import { t } from "../i18n";

type Props = {
  locale: Locale;
  count: number;
};

export function Countdown({ locale, count }: Props) {
  return (
    <section
      aria-label={`${t(locale, "countdownLabel")} ${count || t(locale, "countdownGo")}`}
      aria-live="assertive"
      className="screen-transition panel mx-auto flex min-h-[60svh] max-w-2xl flex-col items-center justify-center p-8 text-center"
    >
      <span className="eyebrow">{t(locale, "countdownLabel")}</span>
      <span className="countdown-number mt-3 font-display text-8xl font-extrabold text-sand sm:text-9xl" key={count}>
        {count > 0 ? count : t(locale, "countdownGo")}
      </span>
    </section>
  );
}
