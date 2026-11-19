import { describe, expect, it } from "vitest";
import * as klein from "./finanzMax";
import { DEPOT_FINANZ_MAX } from "./brokerVergleich";
import { GIRO_FINANZ_MAX } from "./girokontoVergleich";
import { KRYPTO_FINANZ_MAX } from "./kryptoVergleich";

describe("finanzMax", () => {
  it("hat dieselben Höchstpunkte wie die erzeugten Datendateien", () => {
    expect(klein.DEPOT_FINANZ_MAX).toEqual(DEPOT_FINANZ_MAX);
    expect(klein.GIRO_FINANZ_MAX).toEqual(GIRO_FINANZ_MAX);
    expect(klein.KRYPTO_FINANZ_MAX).toEqual(KRYPTO_FINANZ_MAX);
  });
});
