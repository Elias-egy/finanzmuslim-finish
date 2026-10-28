import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { bausteine, euro, lagen, MONATLICH, PLAN_PFAD, SPIELRAUM } from "./portfolioPlan";
import { anlageBySlug } from "./halalAnlagen";
import { alleRouten, bewusstDraussen, nichtIndexiert } from "./routen";

describe("Halal-Portfolio-Plan", () => {
  it("jede Lage ergibt 100 % und die ganzen 500 €", () => {
    for (const l of lagen) {
      expect(l.anteile.reduce((s, a) => s + a.prozent, 0)).toBe(100);
      expect(l.anteile.reduce((s, a) => s + euro(a.prozent), 0)).toBe(MONATLICH);
    }
  });

  it("Krypto und Einzelaktien in keinem Plan, nur freiwillig, zusammen höchstens 15 % (Elias, 28.10.2026)", () => {
    for (const l of lagen) expect(l.anteile.filter((a) => SPIELRAUM.bausteine.includes(a.baustein))).toHaveLength(0);
    expect(SPIELRAUM.hoechstens).toBeLessThanOrEqual(15);
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
});
