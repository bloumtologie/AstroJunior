import { useEffect, useState } from "react";
import { gameBalance, getEnergyCost } from "../engine/rules";
import type { Decision, State } from "../engine/types";
import type { Locale } from "../i18n";
import { t } from "../i18n";

type Props = {
  locale: Locale;
  state: State;
  decision: Decision;
  crewName: string;
  storm: boolean;
};

function astronautFace(health: number, index: number) {
  const expression = health > 65 ? "happy" : health > 30 ? "worried" : "sad";
  const cx = 294 + index * 70;
  return (
    <g key={index} transform={`translate(${cx} 150)`}>
      <circle cx="0" cy="0" fill="#fff8f0" r="20" stroke="#4fc3f7" strokeWidth="4" />
      <path d="M-11-3q11-12 22 0v7h-22z" fill="#17213d" />
      {expression === "happy" ? (
        <path d="M-5 8q5 6 10 0" fill="none" stroke="#e8643c" strokeLinecap="round" strokeWidth="3" />
      ) : expression === "worried" ? (
        <path d="M-5 10q5-4 10 0" fill="none" stroke="#e8643c" strokeLinecap="round" strokeWidth="3" />
      ) : (
        <path d="M-5 12q5-7 10 0" fill="none" stroke="#e8643c" strokeLinecap="round" strokeWidth="3" />
      )}
      <circle cx="-5" cy="0" fill="#fff8f0" r="1.7" />
      <circle cx="5" cy="0" fill="#fff8f0" r="1.7" />
      <path d="M-11 24h22l7 21h-36z" fill="#fff8f0" stroke="#4fc3f7" strokeWidth="3" />
      <path d="M-5 31h10" stroke="#e8643c" strokeLinecap="round" strokeWidth="3" />
    </g>
  );
}

export function MarsBaseScene({ locale, state, decision, crewName, storm }: Props) {
  const [reducedMotion, setReducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  const health = Math.max(0, Math.min(100, state.crewHealth));
  const oxygen = Math.max(0, Math.min(60, state.oxygen));
  const food = Math.max(0, Math.min(60, state.food));
  const energyRemaining = Math.max(
    0,
    gameBalance.dailyEnergyBudget - getEnergyCost(decision),
  );
  const geigerAngle = Math.min(65, Math.max(-65, state.cumulativeDose * 6.5));
  const plantHeight = 8 + (food / 60) * 28;
  const plantsWilted = food < 15;
  const shieldActive = decision.shield > 0;
  const shieldStrong = decision.shield >= 2;
  const solarParticles = [
    { x: 25, y: 76, impactX: 202, impactY: 126, delay: "0s" },
    { x: 42, y: 116, impactX: 193, impactY: 174, delay: "350ms" },
    { x: 29, y: 155, impactX: 193, impactY: 208, delay: "700ms" },
    { x: 46, y: 190, impactX: 203, impactY: 238, delay: "1050ms" },
  ];
  const detailValues = [
    `${t(locale, "visualCrew")}: ${Math.ceil(health / 25)}/4`,
    `${t(locale, "oxygen")}: ${state.oxygen} u`,
    `${t(locale, "food")}: ${state.food} u`,
    `${t(locale, "crewHealth")}: ${Math.round(state.crewHealth)}%`,
    t(locale, "geigerDose", {
      value: state.cumulativeDose.toFixed(2),
    }),
    `${t(locale, "energyLeft", { value: energyRemaining })} / ${gameBalance.dailyEnergyBudget}`,
  ];

  return (
    <section className="panel overflow-hidden p-4 sm:p-6">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="section-title">{t(locale, "missionScene")}</h2>
        <span className="rounded-full border border-sand/50 bg-night/80 px-3 py-1 text-sm font-bold text-paper">
          👩‍🚀 {crewName || t(locale, "crewDefault")}
        </span>
      </div>
      <div className={`mission-landscape relative rounded-3xl ${storm ? "mission-shake" : ""}`}>
        <svg
          aria-hidden="true"
          className="mission-base-art"
          focusable="false"
          preserveAspectRatio="xMidYMid meet"
          viewBox="0 0 800 330"
        >
          <defs>
            <linearGradient id="base-ground" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#e8643c" />
              <stop offset="1" stopColor="#6d3340" />
            </linearGradient>
            <linearGradient id="base-dome" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor="#4fc3f7" stopOpacity=".4" />
              <stop offset="1" stopColor="#fff8f0" stopOpacity=".06" />
            </linearGradient>
            <radialGradient id="shield-glow">
              <stop offset=".68" stopColor="#4fc3f7" stopOpacity=".02" />
              <stop offset="1" stopColor="#4fc3f7" stopOpacity=".2" />
            </radialGradient>
          </defs>
          <circle cx="680" cy="55" fill="#fff8f0" opacity=".8" r="2" />
          <circle cx="600" cy="40" fill="#fff8f0" opacity=".65" r="1.5" />
          <circle cx="746" cy="102" fill="#fff8f0" opacity=".7" r="2" />
          <path d="M0 224q115-32 235 1t235 0 330-6v111H0z" fill="url(#base-ground)" />
          <path d="M0 260q150-24 295 8t250-2 255-2v66H0z" fill="#9d443e" opacity=".55" />
          {storm && (
            <g stroke="#ffd23f" strokeWidth="3">
              <g className="solar-eruption">
                <circle cx="42" cy="50" fill="#ffd23f" r="13" stroke="none" />
                <path d="M42 25v-9m0 68v-9M17 50H8m68 0h-9M24 32l-7-7m50 50-7-7m0-36 7-7m-50 50-7-7" />
                <path d="M44 48l-8 16h10l-6 14 19-21H48l8-9z" fill="#ffd23f" stroke="none" />
              </g>
              {solarParticles.map((particle, index) => {
                const path = shieldStrong
                  ? `M ${particle.x} ${particle.y} L ${particle.impactX} ${particle.impactY} Q ${particle.impactX - 8} ${particle.impactY - 15} ${particle.impactX - 72} ${particle.impactY - 24}`
                  : `M ${particle.x} ${particle.y} L 820 ${particle.y + 90}`;
                return (
                  <g key={`${particle.x}-${particle.y}`}>
                    {reducedMotion ? (
                      <circle
                        cx={particle.x}
                        cy={particle.y}
                        fill="#ffd23f"
                        r={index % 2 === 0 ? 4 : 3}
                        stroke="#fff8f0"
                        strokeWidth="1.5"
                      />
                    ) : (
                      <circle
                        cx="0"
                        cy="0"
                        fill="#ffd23f"
                        r={index % 2 === 0 ? 4 : 3}
                        stroke="#fff8f0"
                        strokeWidth="1.5"
                      >
                        <animateMotion
                          begin={particle.delay}
                          dur="1.8s"
                          path={path}
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}
                    {shieldStrong && (
                      <circle
                        className="shield-bounce-flash"
                        cx={particle.impactX}
                        cy={particle.impactY}
                        fill="none"
                        r="9"
                        style={{ animationDelay: particle.delay }}
                        stroke="#fff8f0"
                        strokeWidth="3"
                      />
                    )}
                  </g>
                );
              })}
            </g>
          )}
          {shieldActive && (
            <ellipse
              cx="421"
              cy="190"
              fill={shieldStrong ? "url(#shield-glow)" : "none"}
              opacity={shieldStrong ? ".95" : ".55"}
              rx="229"
              ry="146"
              stroke="#4fc3f7"
              strokeDasharray={shieldStrong ? "none" : "10 8"}
              strokeWidth={shieldStrong ? "5" : "3"}
            />
          )}
          {storm && shieldStrong && (
            <g fill="#4fc3f7" stroke="#fff8f0" strokeWidth="2">
              <path d="M196 128l-10-6 12 1-3-12 8 11 8-8-4 12 12 2-13 3" />
              <path d="M206 180l-10-6 12 1-3-12 8 11 8-8-4 12 12 2-13 3" />
            </g>
          )}
          <path d="M267 230a80 80 0 0 1 160 0" fill="url(#base-dome)" stroke="#fff8f0" strokeOpacity=".8" strokeWidth="4" />
          <path d="M267 230h160m-80-80v80" fill="none" stroke="#fff8f0" strokeOpacity=".55" strokeWidth="3" />
          {Array.from({ length: 4 }, (_, index) => astronautFace(health, index))}
          <path d="M444 228l52-48 61 48v41H444z" fill="#5bd99a" fillOpacity=".18" stroke="#fff8f0" strokeOpacity=".8" strokeWidth="3" />
          <path d="M444 228l52-48 61 48" fill="none" stroke="#fff8f0" strokeOpacity=".8" strokeWidth="3" />
          {[465, 496, 527].map((x, index) => (
            <g key={x}>
              <path d={`M${x} 255v-${plantHeight}`} stroke="#5bd99a" strokeLinecap="round" strokeWidth="4" />
              {food > 0 && (
                <ellipse
                  cx={x + (index % 2 === 0 ? -5 : 5)}
                  cy={255 - plantHeight + (plantsWilted ? 3 : 8)}
                  fill={plantsWilted ? "#f4b26a" : "#5bd99a"}
                  rx="6"
                  ry="3"
                  transform={`rotate(${plantsWilted ? 75 : index % 2 === 0 ? -25 : 25} ${x} ${255 - plantHeight + (plantsWilted ? 3 : 8)})`}
                />
              )}
            </g>
          ))}
          <rect fill="#19233f" height="56" rx="12" stroke="#fff8f0" strokeWidth="3" width="48" x="581" y="185" />
          <rect fill="#4fc3f7" height={`${Math.max(3, (oxygen / 60) * 35)}`} opacity=".9" rx="8" width="32" x="589" y={232 - Math.max(3, (oxygen / 60) * 35)} />
          <path d="M589 179h32v10h-32z" fill="#fff8f0" />
          {Array.from({ length: 5 }, (_, index) => (
            <circle
              className="oxygen-bubble"
              cx={596 + ((index * 9) % 18)}
              cy={222 - ((index * 13) % Math.max(14, (oxygen / 60) * 30))}
              fill="#fff8f0"
              key={index}
              opacity={oxygen > index * 10 ? ".85" : ".15"}
              r={2 + (index % 2)}
            />
          ))}
          <g transform="translate(680 205)">
            <circle cx="0" cy="0" fill="#0b1026" r="30" stroke="#fff8f0" strokeWidth="3" />
            <path d="M-19 8a21 21 0 0 1 38 0" fill="none" stroke="#ffd23f" strokeWidth="3" />
            <path d="M0 0l8-12" stroke="#e8643c" strokeLinecap="round" strokeWidth="4" transform={`rotate(${geigerAngle} 0 0)`} />
            <circle cx="0" cy="0" fill="#fff8f0" r="4" />
            <path d="M-14 17h28" stroke="#fff8f0" strokeWidth="3" />
          </g>
          <g aria-hidden="true" transform="translate(710 278)">
            {Array.from({ length: 10 }, (_, index) => {
              const fillLevel = energyRemaining / 10 - index;
              return (
                <rect
                  fill={fillLevel >= 1 ? "#ffd23f" : fillLevel > 0 ? "#ffd23f" : "#18213d"}
                  height="16"
                  key={index}
                  opacity={fillLevel > 0 ? "1" : ".5"}
                  rx="3"
                  stroke="#fff8f0"
                  strokeWidth="1"
                  width="7"
                  x={index * 8}
                  y="0"
                />
              );
            })}
          </g>
          {storm && !shieldStrong && (
            <circle
              className="impact-flash"
              cx="273"
              cy="210"
              fill="#ffd23f"
              opacity=".55"
              r="40"
            />
          )}
        </svg>
        <div className="absolute left-3 top-3 rounded-full border border-white/30 bg-night/85 px-3 py-1 text-xs font-extrabold text-paper sm:left-5 sm:top-4 sm:text-sm">
          {storm ? `⚡ ${t(locale, "stormActive")}` : `✨ ${t(locale, "baseStable")}`}
        </div>
        <div className="absolute bottom-3 left-3 max-w-[65%] rounded-2xl border border-white/25 bg-night/90 px-3 py-2 text-xs font-bold text-paper sm:bottom-4 sm:left-5 sm:text-sm">
          👩‍🚀 {t(locale, "mascotMissionLine")}
        </div>
      </div>
      <ul className="mt-3 grid grid-cols-2 gap-2 text-xs font-bold text-paper sm:grid-cols-3 sm:text-sm">
        <li>👩‍🚀 {t(locale, "visualCrew")}</li>
        <li>🫧 {t(locale, "visualOxygen")}</li>
        <li>🌱 {t(locale, "visualFood")}</li>
        <li>
          🛡️ {t(locale, "visualShield")}:{" "}
          {t(locale, shieldActive ? "shieldOn" : "shieldOff")}
        </li>
        <li>☢️ {t(locale, "visualGeiger")}</li>
        <li>🔋 {t(locale, "visualEnergy")}</li>
      </ul>
      <details className="mt-3 rounded-2xl border border-white/15 bg-white/5 px-4 py-3">
        <summary className="min-h-8 cursor-pointer font-bold text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-sand">
          {t(locale, "details")}
        </summary>
        <ul className="mt-3 grid gap-2 text-sm text-paper sm:grid-cols-2">
          {detailValues.map((value) => <li key={value}>{value}</li>)}
          <li>{t(locale, "energyBudgetDetails", { value: gameBalance.dailyEnergyBudget })}</li>
        </ul>
      </details>
    </section>
  );
}
