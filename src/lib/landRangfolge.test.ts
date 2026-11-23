import { describe, expect, it } from "vitest";
import { festeOrdnung } from "./landRangfolge";
import { rangfolge } from "./rangfolge";
import { OESTERREICH } from "@/data/land/oesterreich";
import { SCHWEIZ } from "@/data/land/schweiz";
import { DEPOT_FINANZ_MAX, GIRO_FINANZ_MAX } from "@/data/finanzMax";
import type { RohAnbieter } from "@/data/vergleichHelfer";

const depot = (id: string, link: boolean, zins: "gut" | "teils" | null = "gut"): RohAnbieter => ({
  id,
  name: id,
  produkt: "Depot",
  ...(link ? { link: `/out/${id}-at` } : {}),
  werte: { zinsfreiAbStart: zins },
  finanzPunkte: { depotgebuehr: 16 },
});

describe("Feste Rangfolge der Länderlisten (DACH1)", () => {
  it("folgt der Liste, Platz 1 nur mit eigenem Link (Regel 6)", () => {
    const liste = [depot("a", false), depot("b", true), depot("c", true)];
    const o = festeOrdnung(liste, ["a", "b", "c"], "depot", rangfolge(liste, "depot"));
    expect([...o.platz.entries()]).toEqual([["b", 1], ["a", 2], ["c", 3]]);
    expect(o.siegerId).toBe("b");
  });

  it("ohne Link bei allen: kein Kasten „Nummer 1“", () => {
    const liste = [depot("a", false), depot("b", false)];
    const o = festeOrdnung(liste, ["a", "b"], "depot", rangfolge(liste, "depot"));
    expect(o.siegerId).toBeNull();
    expect(o.platz.get("a")).toBe(1);
  });

  it("ein Anbieter mit abschaltbaren Zinsen wird nie Platz 1", () => {
    const liste = [depot("a", true, "teils"), depot("b", true)];
    const o = festeOrdnung(liste, ["a", "b"], "depot", rangfolge(liste, "depot"));
    expect(o.siegerId).toBe("b");
  });

  it("zeigt die Note nur, wenn sie in der Reihenfolge absteigt", () => {
    const gut = { ...depot("a", true), finanzPunkte: { depotgebuehr: 16, kapest: 9 } };
    const schwach = depot("b", true);
    const r = rangfolge([gut, schwach], "depot");
    expect(festeOrdnung([gut, schwach], ["a", "b"], "depot", r).noteZeigen).toBe(true);
    expect(festeOrdnung([gut, schwach], ["b", "a"], "depot", r).noteZeigen).toBe(false);
  });

  it("Österreich: Traders Place steht vorn, solange flatex keinen Link hat; N26 führt das Girokonto", () => {
    const d = OESTERREICH.depot;
    const od = festeOrdnung(d.anbieter, d.reihenfolge!, "depot", rangfolge(d.anbieter, "depot", { finanzMax: DEPOT_FINANZ_MAX }));
    expect(od.siegerId).toBe("traders-place-depot-at");
    expect(od.platz.get("flatex-depot-at")).toBe(2);
    const g = OESTERREICH.girokonto;
    const og = festeOrdnung(g.anbieter, g.reihenfolge!, "girokonto", rangfolge(g.anbieter, "girokonto", { finanzMax: GIRO_FINANZ_MAX }));
    expect(og.siegerId).toBe("n26-standard-at");
  });

  it("Schweiz: Depot ohne Partnerlink hat keine Nummer 1, Privatkonto führt N26", () => {
    const d = SCHWEIZ.depot;
    expect(festeOrdnung(d.anbieter, d.reihenfolge!, "depot", rangfolge(d.anbieter, "depot")).siegerId).toBeNull();
    const g = SCHWEIZ.girokonto;
    expect(festeOrdnung(g.anbieter, g.reihenfolge!, "girokonto", rangfolge(g.anbieter, "girokonto")).siegerId).toBe("n26-standard-ch");
  });
});
