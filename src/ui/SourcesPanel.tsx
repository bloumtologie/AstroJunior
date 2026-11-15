import type { SourceEntry } from "../archive";
import type { Locale } from "../i18n";
import { t } from "../i18n";

type Props = {
  locale: Locale;
  sources: SourceEntry[];
  archiveReady: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function SourcesPanel({
  locale,
  sources,
  archiveReady,
  open = false,
  onOpenChange,
}: Props) {
  return (
    <details
      className="panel p-5"
      onToggle={(event) => onOpenChange?.(event.currentTarget.open)}
      open={open}
    >
      <summary className="cursor-pointer text-lg font-bold">
        {t(locale, "sources")} ·{" "}
        {t(locale, archiveReady ? "archiveMode" : "archiveNotLoaded")}
      </summary>
      {sources.length === 0 ? (
        <p className="mt-4 text-sm leading-6 text-slate-300">
          {t(locale, "sourcesLoading")}
        </p>
      ) : (
        <ul className="mt-4 space-y-4">
          {sources.map((source) => (
            <li key={source.id}>
              <a className="font-semibold text-sky-200 underline underline-offset-4" href={source.url} rel="noreferrer" target="_blank">
                {source.name}
              </a>
              <p className="mt-1 text-sm leading-6 text-slate-300">
                {locale === "fr" ? source.usedFor_fr : source.usedFor_en}
              </p>
            </li>
          ))}
        </ul>
      )}
    </details>
  );
}
