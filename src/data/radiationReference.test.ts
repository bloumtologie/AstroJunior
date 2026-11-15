import { describe, expect, it } from "vitest";
import {
  curiositySurfaceRadiation,
  issRadiationSample,
} from "./radiationReference";

describe("radiation references", () => {
  it("keeps the Curiosity daily average tied to its NASA source and Mars period", () => {
    expect(curiositySurfaceRadiation.averageDailyDoseEquivalentMSv).toBe(0.67);
    expect(curiositySurfaceRadiation.location).toBe("Gale Crater, Mars");
    expect(curiositySurfaceRadiation.period).toBe("August 2012 to June 2013");
    expect(curiositySurfaceRadiation.sourceUrl).toContain("nasa.gov/news-release/");
  });

  it("keeps the ISS sample separately identified as an absorbed dose rate", () => {
    expect(issRadiationSample.instrument).toBe("DosTel2");
    expect(issRadiationSample.absorbedDoseRateUGyPerHour).toBeCloseTo(
      10.2160856666667,
    );
    expect(issRadiationSample.sourceUrl).toContain("spacecraft=ISS");
  });
});
