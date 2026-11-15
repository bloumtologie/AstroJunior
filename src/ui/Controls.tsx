import { gameBalance, getEnergyCost, isAffordable } from "../engine/rules";
import type { CMEWarning, Decision } from "../engine/types";
import type { Locale, TextKey } from "../i18n";
import { t } from "../i18n";

type Choice = {
  key: keyof Decision;
  label: TextKey;
  options: Array<{ level: number; name: TextKey; cost: number }>;
};

function levelName(name: string): TextKey {
  switch (name) {
    case "low":
    case "medium":
    case "high":
    case "none":
    case "light":
    case "strong":
    case "max":
      return name;
    default:
      throw new RangeError(`Unsupported level label: ${name}`);
  }
}

const choices: Choice[] = [
  {
    key: "life",
    label: "life",
    options: gameBalance.lifeLevels.map((item) => ({
      level: item.level,
      name: levelName(item.name),
      cost: item.energyCost,
    })),
  },
  {
    key: "shield",
    label: "shield",
    options: gameBalance.shieldLevels.map((item) => ({
      level: item.level,
      name: levelName(item.name),
      cost: item.energyCost,
    })),
  },
  {
    key: "comms",
    label: "comms",
    options: gameBalance.commsLevels.map((item) => ({
      level: item.level,
      name: levelName(item.name),
      cost: item.energyCost,
    })),
  },
  {
    key: "science",
    label: "science",
    options: gameBalance.scienceLevels.map((item) => ({
      level: item.level,
      name: levelName(item.name),
      cost: item.energyCost,
    })),
  },
];

type Props = {
  locale: Locale;
  decision: Decision;
  cmeWarning: CMEWarning | null;
  onChange: (decision: Decision) => void;
  onConfirm: () => void;
};

export function Controls({
  locale,
  decision,
  cmeWarning,
  onChange,
  onConfirm,
}: Props) {
  const energyUsed = getEnergyCost(decision);
  const energyRemaining = gameBalance.dailyEnergyBudget - energyUsed;
  const lifeProduction = gameBalance.lifeLevels[decision.life];
  const comms = gameBalance.commsLevels[decision.comms];

  function choose(key: keyof Decision, level: number) {
    const next = { ...decision, [key]: level } as Decision;
    if (isAffordable(next)) onChange(next);
  }

  return (
    <section className="panel p-5 sm:p-7">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="section-title">{t(locale, "choosePlan")}</h2>
          <p className="mt-2 text-sm text-slate-300">
            {t(locale, "energyBudget")}: {gameBalance.dailyEnergyBudget}
          </p>
        </div>
        <p className="rounded-lg bg-slate-800 px-4 py-2 font-bold text-orange-200" aria-live="polite">
          {energyRemaining} {t(locale, "remaining")}
        </p>
      </div>

      <div className="mt-6 space-y-5">
        {choices.map((choice) => (
          <fieldset key={choice.key}>
            <legend className="mb-2 text-base font-bold text-white">
              {t(locale, choice.label)}
            </legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {choice.options.map((option) => {
                const next = { ...decision, [choice.key]: option.level } as Decision;
                const affordable = isAffordable(next);
                const selected = decision[choice.key] === option.level;

                return (
                  <button
                    key={option.level}
                    aria-label={`${t(locale, option.name)} — ${option.cost} ${t(locale, "energy")}${affordable ? "" : `, ${t(locale, "notEnoughEnergy")}`}`}
                    aria-pressed={selected}
                    className={`choice-button ${selected ? "choice-button-selected" : ""}`}
                    disabled={!affordable}
                    onClick={() => choose(choice.key, option.level)}
                    title={
                      affordable
                        ? `${option.cost} ${t(locale, "energy")}`
                        : t(locale, "notEnoughEnergy")
                    }
                    type="button"
                  >
                    <span>{t(locale, option.name)}</span>
                    <span className="mt-1 block text-xs font-medium opacity-80">
                      {option.cost} {t(locale, "energy")}
                    </span>
                  </button>
                );
              })}
            </div>
            {choice.options.some((option) => {
              const next = { ...decision, [choice.key]: option.level } as Decision;
              return !isAffordable(next);
            }) && (
              <p className="mt-2 text-xs text-slate-400">
                {t(locale, "notEnoughEnergy")}
              </p>
            )}
          </fieldset>
        ))}
      </div>

      <div className="mt-6 space-y-2 border-t border-slate-700 pt-5 text-sm leading-6 text-slate-300">
        <p>
          {t(locale, "productionPreview", {
            production: lifeProduction.oxygenProduced,
            consumption: gameBalance.dailyConsumption.oxygen,
          })}
        </p>
        <p>
          {t(locale, "radioPreview", { days: comms.warningDays })}
        </p>
        {comms.earthAdvice && <p>{t(locale, "advicePreview")}</p>}
      </div>
      {cmeWarning && (
        <p
          className="mt-4 rounded-lg border border-amber-300/50 bg-amber-300/10 p-4 text-amber-100"
          role="alert"
        >
          {t(locale, "cmeWarning", { days: cmeWarning.daysAhead })}
        </p>
      )}
      <button className="primary-button mt-6 w-full" onClick={onConfirm} type="button">
        {t(locale, "validatePlan")}
      </button>
    </section>
  );
}
