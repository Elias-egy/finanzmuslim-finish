import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { BEKANNTE_GOLD, GOLD_BETRAEGE, GOLD_DEPOT_LOGOS, GOLD_MONATLICH, GOLD_PFAD, gramm, grammText, wege } from "./goldPlan";
import { ANLAGEN_KAUFBAR } from "./anlagenKaufbar";
import { GOLD_ISINS, edelmetallVergleich } from "./edelmetallVergleich";
import { anlageBySlug } from "./halalAnlagen";
import { depotAnzeige } from "./vergleichAnzeige";
import { empfehlbar } from "./vergleichAssistent";
import { alleRouten, bewusstDraussen, nichtIndexiert } from "./routen";

describe("Gold-Plan", () => {
  it("die Geld-Frage hat drei Beträge, der Startwert ist einer davon", () => {
    expect(GOLD_BETRAEGE).toHaveLength(3);
    expect(GOLD_BETRAEGE).toContain(GOLD_MONATLICH);
  });

  it("Gramm rechnen mit dem Goldpreis und lesen sich deutsch", () => {
    expect(gramm(100)).toBeGreaterThan(0);
    expect(grammText(0.834)).toBe("0,8");
    expect(grammText(30.05)).toBe("30");
  });

  it("die Zahl bei finanzen.net zero stimmt mit den Kaufbar-Daten, jedes Stück mit Anbieter-Beleg", () => {
    const ja = GOLD_ISINS.filter((i) =>
      ANLAGEN_KAUFBAR[i]?.kaufbar.some((k) => k.anbieter === "finanzen.net zero" && k.beleg.quelle === "anbieter"),
    );
    const nicht = GOLD_ISINS.filter((i) => ANLAGEN_KAUFBAR[i]?.nichtImAngebot.includes("finanzen.net zero"));
    const zero = BEKANNTE_GOLD.find((d) => d.name === "finanzen.net zero")!;
    expect(ja.length + nicht.length).toBe(GOLD_ISINS.length);
    expect(zero.gross).toBe(`${ja.length} von ${GOLD_ISINS.length}`);
  });

  it("die Depot-Logos im Aufruf sind empfehlbar und haben alle Gold-ETCs", () => {
    for (const d of GOLD_DEPOT_LOGOS) {
      expect(depotAnzeige.find((a) => a.id === d.id)?.domain).toBe(d.domain);
      expect(empfehlbar(d.id)).toBe(true);
      const imVergleich = edelmetallVergleich.find((a) => a.id === d.id);
      expect(imVergleich?.werte.gold).toBe(`${GOLD_ISINS.length} von ${GOLD_ISINS.length}`);
    }
  });

  it("jedes Beispiel mit Anlage zeigt auf eine Seite, die es gibt", () => {
    for (const w of wege) if (w.beispiel.slug) expect(anlageBySlug(w.beispiel.slug)).toBeDefined();
  });

  it("die Seite ist versteckt, aber vorgerendert: noindex, nicht in der Sitemap, bewusst draußen", () => {
    expect(nichtIndexiert).toContain(GOLD_PFAD);
    expect(alleRouten().map((r) => r.pfad)).not.toContain(GOLD_PFAD);
    expect(bewusstDraussen.map((b) => b.pfad)).toContain("/dein-gold/:schluessel");
    expect(readFileSync("src/pages/GoldPlan.tsx", "utf8")).toContain("noindex");
  });
});
