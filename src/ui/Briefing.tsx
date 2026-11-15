import type { Locale } from "../i18n";
import { t } from "../i18n";
import { MarsLandscape } from "./MarsLandscape";

type Props = {
  locale: Locale;
  disabledReason?: string;
  canRetry: boolean;
  scenarioRange?: string;
  onRetry: () => void;
  crewName: string;
  soundEnabled: boolean;
  voiceEnabled: boolean;
  onCrewNameChange: (name: string) => void;
  onLocaleChange: (locale: Locale) => void;
  onSoundToggle: () => void;
  onVoiceToggle: () => void;
  onShowSources: () => void;
  onStart: () => void;
  onHowToPlay: () => void;
};

export function Briefing({
  locale,
  disabledReason,
  canRetry,
  scenarioRange,
  onRetry,
  crewName,
  soundEnabled,
  voiceEnabled,
  onCrewNameChange,
  onLocaleChange,
  onSoundToggle,
  onVoiceToggle,
  onShowSources,
  onStart,
  onHowToPlay,
}: Props) {
  return (
    <section className="home-shell relative mx-auto flex min-h-[min(900px,calc(100svh-2rem))] max-w-5xl flex-col overflow-hidden rounded-bubble border border-white/10 px-5 pb-5 pt-6 shadow-soft sm:min-h-[760px] sm:px-10 sm:pt-8">
      <MarsLandscape />
      <header className="relative z-10 flex items-center justify-between gap-3">
        <div className="font-display text-lg font-extrabold tracking-wide text-paper sm:text-2xl">
          <span aria-hidden="true" className="mr-2">🚀</span>
          {t(locale, "title")}
        </div>
        <span className="rounded-full border border-life/60 bg-night/80 px-3 py-1 text-xs font-extrabold text-paper sm:text-sm">
          {t(locale, "verifiedNasaData")}
        </span>
      </header>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center py-8 text-center">
        <div className="mb-4 flex max-w-sm items-center gap-3 self-start rounded-3xl border border-white/20 bg-night/90 p-3 text-left shadow-soft sm:absolute sm:left-0 sm:top-8 sm:mb-0">
          <span aria-hidden="true" className="text-5xl sm:text-6xl">👩‍🚀</span>
          <span className="max-w-40 rounded-2xl bg-paper px-3 py-2 text-sm font-extrabold text-night">
            {t(locale, "mascotHomeLine")}
          </span>
        </div>

        <p className="mb-3 rounded-full border border-sand/50 bg-night/75 px-4 py-1 text-xs font-extrabold uppercase tracking-[0.16em] text-sand">
          {t(locale, "briefingEyebrow")}
        </p>
        <h1 className="font-display max-w-2xl text-4xl font-extrabold leading-tight text-paper drop-shadow sm:mt-12 sm:text-6xl">
          {t(locale, "homeSlogan")}
        </h1>
        {scenarioRange && (
          <p className="mt-4 rounded-full bg-night/75 px-4 py-2 text-sm font-bold text-paper">
            {scenarioRange}
          </p>
        )}
        {disabledReason && (
          <p className="mt-4 rounded-2xl border border-solar/60 bg-night/90 px-4 py-3 text-sm font-bold text-paper" role="status">
            {disabledReason}
          </p>
        )}
        <button
          aria-label={t(locale, "play")}
          className="home-play primary-button mt-7 min-h-16 min-w-56 rounded-full border-4 border-paper text-2xl sm:mt-10 sm:min-h-20 sm:min-w-72 sm:text-3xl"
          disabled={Boolean(disabledReason)}
          onClick={onStart}
          type="button"
        >
          {t(locale, "play")}
        </button>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-2xl rounded-3xl border border-white/15 bg-night/90 p-3 shadow-soft sm:p-4">
        <label className="mb-3 block text-left text-xs font-extrabold text-paper sm:text-sm">
          {t(locale, "crewNameLabel")}
          <input
            autoComplete="off"
            className="mt-1 min-h-12 w-full rounded-2xl border border-white/20 bg-white/10 px-4 text-base text-paper placeholder:text-white/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sand"
            maxLength={24}
            onChange={(event) => onCrewNameChange(event.target.value)}
            placeholder={t(locale, "crewNamePlaceholder")}
            value={crewName}
          />
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          <button className="secondary-button text-sm" onClick={onHowToPlay} type="button">
            {t(locale, "howToPlay")}
          </button>
          <label className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-2 text-sm font-bold text-paper">
            <span className="sr-only">{t(locale, "language")}</span>
            <select
              aria-label={t(locale, "language")}
              className="min-h-12 max-w-full bg-transparent text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-sand"
              onChange={(event) => onLocaleChange(event.target.value as Locale)}
              value={locale}
            >
              <option className="bg-night" value="fr">🇫🇷</option>
              <option className="bg-night" value="en">🇬🇧</option>
            </select>
          </label>
          <button
            aria-label={soundEnabled ? t(locale, "soundEnabled") : t(locale, "soundDisabled")}
            aria-pressed={soundEnabled}
            className="secondary-button text-sm"
            onClick={onSoundToggle}
            type="button"
          >
            {soundEnabled ? "🔊" : "🔇"} {t(locale, "soundControl")}
          </button>
          <button
            aria-label={voiceEnabled ? t(locale, "voiceEnabled") : t(locale, "voiceDisabled")}
            aria-pressed={voiceEnabled}
            className="secondary-button text-sm"
            onClick={onVoiceToggle}
            type="button"
          >
            🗣️ {t(locale, "voiceControl")}
          </button>
          <button
            className="secondary-button col-span-2 border-life/60 text-sm sm:col-span-1"
            onClick={onShowSources}
            type="button"
          >
            🛰️ {t(locale, "verifiedNasaData")}
          </button>
        </div>
      </div>
      {canRetry && disabledReason && (
        <button
          className="secondary-button relative z-10 mx-auto mt-3"
          onClick={onRetry}
          type="button"
        >
          {t(locale, "tryAgain")}
        </button>
      )}
    </section>
  );
}
