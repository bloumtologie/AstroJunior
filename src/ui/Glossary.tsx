import type { Locale } from "../i18n";
import { t } from "../i18n";

const terms = [
  ["radiationTerm", "radiationDefinition"],
  ["flareTerm", "flareDefinition"],
  ["cmeTerm", "cmeDefinition"],
  ["sepTerm", "sepDefinition"],
  ["commsTerm", "commsDefinition"],
] as const;

type Props = {
  locale: Locale;
};

export function Glossary({ locale }: Props) {
  return (
    <details className="panel p-5">
      <summary className="cursor-pointer text-lg font-bold">
        {t(locale, "glossary")}
      </summary>
      <dl className="mt-4 space-y-4">
        {terms.map(([term, definition]) => (
          <div key={term}>
            <dt className="font-semibold text-orange-100">{t(locale, term)}</dt>
            <dd className="mt-1 text-sm leading-6 text-slate-300">
              {t(locale, definition)}
            </dd>
          </div>
        ))}
      </dl>
    </details>
  );
}
