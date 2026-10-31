import { describe, expect, it } from "vitest";
import { depotAnzeige } from "@/data/vergleichAnzeige";
import { DEPOT_FINANZ_MAX } from "@/data/brokerVergleich";
import { siegerDerSeite } from "@/lib/vergleichAssistent";
import { depotNummerEinsZiel } from "@/lib/depotNummerEins";

describe("depotNummerEinsZiel", () => {
  const sieger = siegerDerSeite(depotAnzeige, "depot", DEPOT_FINANZ_MAX);

  it("führt auf denselben Partnerweg wie der Kasten „Unsere Nummer 1“", () => {
    expect(sieger?.link).toMatch(/^\/out\//);
    expect(depotNummerEinsZiel()).toBe(sieger?.link);
  });

  it("hängt die Klickquelle an", () => {
    expect(depotNummerEinsZiel("?src=g3c")).toBe(`${sieger?.link}?src=g3c`);
  });
});
