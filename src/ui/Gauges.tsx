import type { Decision, State } from "../engine/types";
import type { Locale } from "../i18n";
import { MarsBaseScene } from "./MarsBaseScene";

type Props = {
  locale: Locale;
  state: State;
  decision: Decision;
  crewName: string;
  storm: boolean;
};

export function Gauges({ locale, state, decision, crewName, storm }: Props) {
  return (
    <MarsBaseScene
      crewName={crewName}
      decision={decision}
      locale={locale}
      state={state}
      storm={storm}
    />
  );
}
