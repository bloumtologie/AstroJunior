import { useState } from "react";
import type { SourceEntry } from "../archive";
import type { Locale } from "../i18n";
import { t } from "../i18n";
import { Glossary } from "./Glossary";
import { SourcesPanel } from "./SourcesPanel";

type Props = {
  locale: Locale;
  sources: SourceEntry[];
  archiveReady: boolean;
  onBack: () => void;
};

export function About({ locale, sources, archiveReady, onBack }: Props) {
  const [sourcesOpen, setSourcesOpen] = useState(false);

  return (
    <section className="panel space-y-5 p-5 sm:p-7">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="section-title">{t(locale, "aboutTitle")}</h1>
        <button className="secondary-button text-sm" onClick={onBack} type="button">
          ← {t(locale, "aboutBack")}
        </button>
      </header>
      <p className="text-sm leading-6 text-paper/90">
        {t(locale, "aboutIntro")}
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Glossary locale={locale} />
        <SourcesPanel
          archiveReady={archiveReady}
          locale={locale}
          onOpenChange={setSourcesOpen}
          open={sourcesOpen}
          sources={sources}
        />
      </div>
      <details className="rounded-3xl border border-white/15 bg-white/5 p-5">
        <summary className="cursor-pointer text-lg font-bold">
          {t(locale, "limitTitle")}
        </summary>
        <p className="mt-3 text-sm leading-6 text-paper/90">
          {t(locale, "limits")}
        </p>
      </details>
    </section>
  );
}
