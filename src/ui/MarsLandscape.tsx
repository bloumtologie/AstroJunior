export function MarsLandscape() {
  return (
    <svg
      aria-hidden="true"
      className="mars-art"
      focusable="false"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 900 680"
    >
      <defs>
        <linearGradient id="mars-ground" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#e8643c" />
          <stop offset="1" stopColor="#672d37" />
        </linearGradient>
        <linearGradient id="dome-glass" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#4fc3f7" stopOpacity=".5" />
          <stop offset="1" stopColor="#fff8f0" stopOpacity=".08" />
        </linearGradient>
        <radialGradient id="greenhouse-light">
          <stop offset="0" stopColor="#5bd99a" stopOpacity=".7" />
          <stop offset="1" stopColor="#5bd99a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g fill="#fff8f0">
        <circle className="scene-star" cx="98" cy="90" r="2" />
        <circle className="scene-star" cx="233" cy="61" r="1.5" style={{ animationDelay: "1s" }} />
        <circle className="scene-star" cx="385" cy="116" r="1.7" style={{ animationDelay: "1.8s" }} />
        <circle className="scene-star" cx="620" cy="70" r="2" style={{ animationDelay: ".5s" }} />
        <circle className="scene-star" cx="800" cy="142" r="1.6" style={{ animationDelay: "1.4s" }} />
        <circle cx="748" cy="210" fill="#4fc3f7" r="8" />
        <circle cx="745" cy="207" fill="#fff8f0" opacity=".8" r="2" />
      </g>
      <path d="M0 416 Q138 375 276 413 T560 401 T900 418 V680 H0Z" fill="url(#mars-ground)" />
      <path d="M0 470 Q185 435 370 472 T730 458 T900 470 V680 H0Z" fill="#9d443e" opacity=".44" />
      <g className="scene-dust" fill="#f4b26a" opacity=".42">
        <circle cx="110" cy="500" r="2" />
        <circle cx="285" cy="536" r="1.5" />
        <circle cx="720" cy="500" r="2" />
        <circle cx="835" cy="560" r="1.4" />
      </g>
      <ellipse cx="474" cy="530" fill="#e8643c" opacity=".16" rx="270" ry="70" />
      <g stroke="#fff8f0" strokeOpacity=".52" strokeWidth="4">
        <path d="M328 458a75 75 0 0 1 150 0" fill="url(#dome-glass)" />
        <path d="M328 458h150" />
        <path d="M403 384v74" />
      </g>
      <path d="M337 457h132v45H337z" fill="#222b43" stroke="#fff8f0" strokeOpacity=".28" strokeWidth="3" />
      <g className="scene-greenhouse">
        <path d="M490 457l52-49 57 49v44H490z" fill="url(#greenhouse-light)" />
        <path d="M490 457l52-49 57 49v44H490z" fill="#5bd99a" fillOpacity=".2" stroke="#fff8f0" strokeOpacity=".5" strokeWidth="3" />
        <path d="M516 465v28m24-33v33m24-26v26" stroke="#5bd99a" strokeLinecap="round" strokeWidth="5" />
      </g>
      <g className="scene-rover">
        <path d="M184 485h70l-9-24h-47z" fill="#f4b26a" stroke="#fff8f0" strokeWidth="3" />
        <path d="M211 460l7-21 17 20" fill="#4fc3f7" stroke="#fff8f0" strokeWidth="3" />
        <path d="M206 449h-16v-10h18" fill="none" stroke="#fff8f0" strokeWidth="3" />
        <g fill="#202941" stroke="#fff8f0" strokeWidth="3">
          <circle className="scene-wheel" cx="199" cy="490" r="10" />
          <circle className="scene-wheel" cx="241" cy="490" r="10" />
        </g>
      </g>
      <path d="M74 590q20-18 40 0m-16-2q18-17 35 0" fill="none" stroke="#f4b26a" strokeLinecap="round" strokeWidth="3" opacity=".45" />
      <path d="M747 608q16-14 32 0m-8-2q14-13 28 0" fill="none" stroke="#f4b26a" strokeLinecap="round" strokeWidth="3" opacity=".45" />
    </svg>
  );
}
