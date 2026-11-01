import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { GIRO_CHECK, GIRO_TOP2 } from "./giroTop2";
import { bausteine } from "./portfolioPlan";
import { aktien } from "./top100Aktien";
import { listenQuellen } from "./boykottListe";
import { istGueltigeQuelle } from "@/lib/attribution";

describe("Girokonto-Aufruf (MC7d15)", () => {
  it("zeigt zwei Girokonten, beide ohne Zinsen ab Start und mit Partnerweg", () => {
    expect(GIRO_TOP2).toHaveLength(2);
    for (const g of GIRO_TOP2) {
      expect(g.zinsfreiAbStart).toBe(true);
      expect(g.link).toMatch(/^\/out\//);
    }
  });
  it("nennt nur Konten mit Zinsen laut Vergleich als Beispiel", () => {
    for (const c of GIRO_CHECK) expect(c.gross).toBe("Zinsen");
  });
  it("zählt jede Stelle", () => {
    for (const s of ["plgtop2", "plgalle", "vtgtop2", "vtgalle", "eftop3", "efalle", "efkarte", "gdtop3", "gdalle", "gdkarte"])
      expect(istGueltigeQuelle(s)).toBe(true);
  });
});

describe("Einzelaktien-Beispiel im Plan (MC7d15)", () => {
  const beispiel = bausteine.find((b) => b.id === "aktien")!.beispiel!;
  const namen = beispiel.titel.split(", ");
  it("sind halal in der Musaffa-Prüfung der 100", () => {
    for (const n of namen) expect(aktien.find((a) => a.name === n)?.status).toBe("Halal");
  });
  it("stehen auf keiner der gesicherten Boykott-Listen", () => {
    for (const q of listenQuellen) {
      const text = readFileSync(`docs/freebies/quellen/${q.datei}`, "utf8").toLowerCase();
      for (const n of namen) expect(text.includes(n.toLowerCase()), `${n} in ${q.datei}`).toBe(false);
    }
  });
});
