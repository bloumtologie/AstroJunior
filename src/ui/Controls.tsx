import { useRef, useState } from "react";
import type { DragEvent } from "react";
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

const choiceIcons: Record<Choice["key"], string> = {
  life: "🫁",
  shield: "🛡️",
  comms: "📡",
  science: "🔬",
};

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
  const [usedBatteries, setUsedBatteries] = useState<number[]>([]);
  const [selectedBattery, setSelectedBattery] = useState<number | null>(null);
  const suppressClickUntil = useRef(0);

  function choose(key: keyof Decision, level: number) {
    const next = { ...decision, [key]: level } as Decision;
    if (isAffordable(next)) onChange(next);
  }

  function canUpgrade(choice: Choice) {
    const nextOption = choice.options.find(
      (option) => option.level > decision[choice.key],
    );
    return (
      nextOption !== undefined &&
      isAffordable({ ...decision, [choice.key]: nextOption.level } as Decision)
    );
  }

  function upgrade(key: keyof Decision, batteryId: number) {
    if (usedBatteries.includes(batteryId)) return;
    const choice = choices.find((item) => item.key === key);
    if (!choice) return;
    const currentIndex = choice.options.findIndex(
      (option) => option.level === decision[key],
    );
    const nextOption = choice.options[currentIndex + 1];
    if (!nextOption) return;
    const next = { ...decision, [key]: nextOption.level } as Decision;
    if (!isAffordable(next)) return;
    onChange(next);
    setUsedBatteries((previous) => [...previous, batteryId]);
    setSelectedBattery(null);
  }

  function handleDrop(
    event: DragEvent<HTMLFieldSetElement>,
    key: keyof Decision,
  ) {
    event.preventDefault();
    const batteryId = Number(event.dataTransfer.getData("text/plain"));
    if (Number.isInteger(batteryId)) {
      upgrade(key, batteryId);
      suppressClickUntil.current = Date.now() + 300;
    }
  }

  return (
    <section
      className="panel p-5 sm:p-7"
      onClickCapture={(event) => {
        if (Date.now() < suppressClickUntil.current) {
          event.preventDefault();
          event.stopPropagation();
        }
      }}
    >
      <h2 className="section-title">{t(locale, "choosePlan")}</h2>
      <div className="mt-5 rounded-3xl border border-white/15 bg-white/5 p-3">
        <p className="mb-2 text-sm font-extrabold text-paper">{t(locale, "batteryTokens")}</p>
        <div
          aria-label={t(locale, "batteryTokens")}
          className="flex flex-wrap gap-2"
          role="group"
        >
          {Array.from({ length: 10 }, (_, index) => {
            const used = usedBatteries.includes(index);
            return (
              <button
                aria-label={
                  used
                    ? t(locale, "batteryUsed")
                    : selectedBattery === index
                      ? t(locale, "batterySelected", { number: index + 1 })
                      : t(locale, "batteryName", { number: index + 1 })
                }
                aria-pressed={selectedBattery === index}
                className={`battery-token min-h-12 min-w-12 rounded-2xl border px-2 text-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-sand ${used ? "border-white/10 bg-white/5 opacity-35" : "border-solar/60 bg-white/5 hover:bg-solar/20"}`}
                draggable={!used}
                key={index}
                onClick={() => !used && setSelectedBattery(index)}
                onDragStart={(event) => {
                  if (used) {
                    event.preventDefault();
                    return;
                  }
                  event.dataTransfer.setData("text/plain", String(index));
                  event.dataTransfer.effectAllowed = "move";
                }}
                type="button"
              >
                <span aria-hidden="true">{used ? "▫️" : "🔋"}</span>
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-xs leading-5 text-paper/80">
          {t(locale, "batteryHint")}
          <span className="block sm:hidden">{t(locale, "batteryHintTouch")}</span>
        </p>
        {selectedBattery !== null && (
          <p className="mt-1 text-sm font-bold text-solar" role="status">
            {t(locale, "batterySelected", { number: selectedBattery + 1 })}
          </p>
        )}
      </div>

      <div className="mt-6 space-y-4">
        {choices.map((choice) => (
          <fieldset
            className="rounded-3xl border border-white/15 bg-white/5 p-3 sm:p-4"
            key={choice.key}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => handleDrop(event, choice.key)}
          >
            <legend className="mb-2 px-2 text-base font-bold text-paper">
              <span aria-hidden="true" className="mr-2">
                {choiceIcons[choice.key]}
              </span>
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
                    aria-label={t(locale, option.name)}
                    aria-pressed={selected}
                    className={`choice-button ${selected ? "choice-button-selected" : ""}`}
                    disabled={!affordable}
                    onClick={() => choose(choice.key, option.level)}
                    type="button"
                  >
                    <span>
                      {selected && <span aria-hidden="true" className="mr-1">✓</span>}
                      {t(locale, option.name)}
                    </span>
                  </button>
                );
              })}
            </div>
            {choice.options.some((option) => {
              const next = { ...decision, [choice.key]: option.level } as Decision;
              return !isAffordable(next);
            }) && (
              <p className="mt-2 text-xs text-paper/80">
                {t(locale, "notEnoughEnergy")}
              </p>
            )}
            <button
              aria-label={t(locale, "upgradeStation", {
                station: t(locale, choice.label),
              })}
              className="secondary-button mt-3 w-full text-sm"
              disabled={selectedBattery === null || !canUpgrade(choice)}
              onClick={() => {
                if (selectedBattery !== null) upgrade(choice.key, selectedBattery);
              }}
              type="button"
            >
              🔋 {t(locale, "upgradeStation", { station: t(locale, choice.label) })}
            </button>
          </fieldset>
        ))}
      </div>

      <details className="mt-5 rounded-2xl border border-white/15 bg-white/5 px-4 py-3">
        <summary className="min-h-8 cursor-pointer font-bold text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-sand">
          {t(locale, "details")}
        </summary>
        <ul className="mt-3 space-y-2 text-sm text-paper">
          <li>{t(locale, "energyBudgetDetails", { value: gameBalance.dailyEnergyBudget })}</li>
          <li>{t(locale, "energyUsed", { value: energyUsed })}</li>
          <li>{t(locale, "energyLeft", { value: energyRemaining })}</li>
          {choices.flatMap((choice) =>
            choice.options.map((option) => (
              <li key={`${choice.key}-${option.level}`}>
                {t(locale, choice.label)} · {t(locale, option.name)}:{" "}
                {t(locale, "stationEnergy", { value: option.cost })}
              </li>
            )),
          )}
          <li>
            {t(locale, "productionDetails", {
              value: `${lifeProduction.oxygenProduced} / ${gameBalance.dailyConsumption.oxygen}`,
            })}
          </li>
          <li>{t(locale, "radioPreview", { days: comms.warningDays })}</li>
        </ul>
      </details>

      {cmeWarning && (
        <p
          className="storm-alert mt-4 rounded-2xl border border-solar/60 bg-night/90 p-4 text-paper"
          role="alert"
        >
          <span aria-hidden="true" className="mr-2">🌩️</span>
          {t(locale, "cmeWarning", { days: cmeWarning.daysAhead })}
        </p>
      )}
      <button className="primary-button mt-6 w-full" onClick={onConfirm} type="button">
        {t(locale, "validatePlan")}
      </button>
    </section>
  );
}
