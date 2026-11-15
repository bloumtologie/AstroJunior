import type { Locale } from "../i18n";
import { t } from "../i18n";

type Props = {
  locale: Locale;
  onBack: () => void;
  onStart: () => void;
};

const cards = [
  { key: "helpStepOne" as const, image: "🧑‍🚀", label: "01" },
  { key: "helpStepTwo" as const, image: "🔋", label: "02" },
  { key: "helpStepThree" as const, image: "🛡️", label: "03" },
];

export function HowToPlay({ locale, onBack, onStart }: Props) {
  return (
    <section className="screen-transition panel mx-auto max-w-3xl p-5 sm:p-8">
      <div className="flex items-center justify-between gap-3">
        <h1 className="section-title text-2xl sm:text-3xl">{t(locale, "helpTitle")}</h1>
        <button className="secondary-button" onClick={onBack} type="button">
          {t(locale, "homeBack")}
        </button>
      </div>
      <div
        aria-label={t(locale, "helpTitle")}
        className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4"
        role="region"
        tabIndex={0}
      >
        {cards.map((card) => (
          <article
            className="flex min-h-72 min-w-[82%] snap-center flex-col items-center justify-center rounded-bubble border border-white/15 bg-white/5 p-6 text-center shadow-soft sm:min-w-[calc(33.333%-0.75rem)]"
            key={card.key}
          >
            <span className="text-sm font-extrabold tracking-widest text-sand">{card.label}</span>
            <span aria-hidden="true" className="my-5 text-7xl">{card.image}</span>
            <p className="font-display text-xl font-bold text-paper">{t(locale, card.key)}</p>
          </article>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-paper/80">
          {t(locale, "swipeInstructions")}
        </span>
        <button className="primary-button min-w-40" onClick={onStart} type="button">
          {t(locale, "helpStart")}
        </button>
      </div>
    </section>
  );
}
