import { describe, expect, it } from "vitest";
import { BROKER_START } from "@/data/brokerStart";
import { BROKER_START_KURZNAMEN, istBrokerStartSeite } from "@/lib/brokerStartPfad";

describe("schlanke Depot-Startseite", () => {
  it("Layout und Daten kennen dieselben Seiten", () => {
    expect([...BROKER_START_KURZNAMEN].sort()).toEqual(Object.keys(BROKER_START).sort());
  });
  it("nur die drei Seiten, nicht die Leer-Fassung", () => {
    expect(istBrokerStartSeite("/dein-investmentstart/flatex", "")).toBe(true);
    expect(istBrokerStartSeite("/dein-investmentstart/flatex", "?src=dmleer1")).toBe(false);
    expect(istBrokerStartSeite("/dein-investmentstart/dkb-depot", "")).toBe(false);
    expect(istBrokerStartSeite("/dein-investmentstart", "")).toBe(false);
  });
});
