import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { BEKANNTE, BETRAEGE, DEPOT_LOGOS, GIRO_MIT_ZINSEN, bausteine, euro, lagen, MONATLICH, PLAN_PFAD, SPIELRAUM } from "./portfolioPlan";
import { ANLAGE_ZEILE, ANLAGEN_KAUFBAR } from "./anlagenKaufbar";
import { anlageBySlug } from "./halalAnlagen";
import { depotAnzeige, girokontoAnzeige } from "./vergleichAnzeige";
import { empfehlbar } from "./vergleichAssistent";
import { alleRouten, bewusstDraussen, nichtIndexiert } from "./routen";

describe("Halal-Portfolio-Plan", () => {
  it("jede Lage ergibt 100 % und bei jedem Betrag die ganzen Euro", () => {
    for (const l of lagen) {
      expect(l.anteile.reduce((s, a) => s + a.prozent, 0)).toBe(100);
      for (const betrag of BETRAEGE) expect(l.anteile.reduce((s, a) => s + euro(a.prozent, betrag), 0)).toBe(betrag);
    }
    expect(BETRAEGE).toContain(MONATLICH);
  });

  it("Krypto und Einzelaktien nur im langen Plan, als Beispiel, zusammen höchstens 15 % (Elias, 28.10.2026)", () => {
    for (const l of lagen) {
      const riskant = l.anteile.filter((a) => SPIELRAUM.bausteine.includes(a.baustein));
      if (l.id !== "lang") expect(riskant).toHaveLength(0);
      expect(riskant.reduce((s, a) => s + a.prozent, 0)).toBeLessThanOrEqual(SPIELRAUM.hoechstens);
    }
    expect(SPIELRAUM.hoechstens).toBeLessThanOrEqual(15);
  });

  it("die Zahl bei Trade Republic stimmt mit den Kaufbar-Daten", () => {
    const etf = Object.keys(ANLAGE_ZEILE).filter((i) => ANLAGE_ZEILE[i] === "halalEtfsFonds");
    const ja = etf.filter((i) => ANLAGEN_KAUFBAR[i]?.kaufbar.some((k) => k.anbieter === "Trade Republic"));
    const tr = BEKANNTE.find((d) => d.name === "Trade Republic")!;
    expect(tr.gross).toBe(`${ja.length} von ${etf.length}`);
  });

  it("jedes Beispiel zeigt auf eine Seite, die es gibt", () => {
    for (const b of bausteine) if (b.beispiel?.slug) expect(anlageBySlug(b.beispiel.slug)).toBeDefined();
  });

  it("das Girokonto steht nur im kurzen Plan (Elias, 28.10.2026)", () => {
    for (const l of lagen) expect(l.anteile.some((a) => a.baustein === "konto")).toBe(l.id === "bald");
  });

  it("jeder Baustein im Plan ist erklärt", () => {
    const ids = new Set([...bausteine.map((b) => b.id), "konto"]);
    for (const l of lagen) for (const a of l.anteile) expect(ids.has(a.baustein)).toBe(true);
  });

  it("die Seite ist versteckt, aber vorgerendert: noindex, nicht in der Sitemap, bewusst draußen", () => {
    // Ohne Vorrendern liefert der Hoster eine echte 404 (routen.ts, nichtIndexiert).
    expect(nichtIndexiert).toContain(PLAN_PFAD);
    expect(alleRouten().map((r) => r.pfad)).not.toContain(PLAN_PFAD);
    expect(bewusstDraussen.map((b) => b.pfad)).toContain("/dein-plan/:schluessel");
    expect(readFileSync("src/pages/PortfolioPlan.tsx", "utf8")).toContain("noindex");
    expect(PLAN_PFAD.startsWith("/dein-plan/")).toBe(true);
  });

  it("die Girokonto-Logos zahlen laut Vergleich Zinsen, die Depot-Logos sind empfehlbar", () => {
    for (const g of GIRO_MIT_ZINSEN) {
      const konto = girokontoAnzeige.find((a) => a.id === g.id);
      expect(konto?.domain).toBe(g.domain);
      expect(konto?.name).toBe(g.name);
      expect(empfehlbar(g.id)).toBe(false);
    }
    for (const d of DEPOT_LOGOS) {
      expect(depotAnzeige.find((a) => a.id === d.id)?.domain).toBe(d.domain);
      expect(empfehlbar(d.id)).toBe(true);
    }
  });
});
