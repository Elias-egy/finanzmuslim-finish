import { describe, expect, it } from "vitest";
import {
  depotAnzeige,
  edelmetallAnzeige,
  girokontoAnzeige,
  screenerAnzeige,
  steuerAnzeige,
} from "@/data/vergleichAnzeige";
import { DEPOT_FINANZ_MAX } from "@/data/brokerVergleich";
import { siegerDerSeite } from "@/lib/vergleichAssistent";
import guide from "@/guides/xxl.html?raw";

/**
 * Der XXL-Guide druckt die Nummer 1 und die Zahlen der Vergleiche aus einem Schnappschuss
 * (scripts/xxl-schnappschuss.ts, MC7d7). Wechselt die Nummer 1 oder eine Zahl, schlägt dieser Test an:
 * Schnappschuss neu, ~/rebrand/freebies/guides_v2.py, PDF und fuer_website.py neu bauen (MC7d8, 30.10.2026).
 * Geprüft wird die Website-Fassung src/guides/xxl.html; das PDF entsteht im selben Lauf aus denselben Daten.
 * MC7d9b (30.10.2026): Bausteine der neuen Innenseiten (Nummer 1 als .nr1b mit Liste, Girokonto als große Zahl,
 * Vergleiche nur noch auf Seite 17).
 */

describe("XXL-Guide hält die Vergleichsdaten", () => {
  const sieger = siegerDerSeite(depotAnzeige, "depot", DEPOT_FINANZ_MAX);

  it("nennt die Nummer 1 des Depot-Vergleichs", () => {
    expect(sieger).toBeTruthy();
    const block = guide.match(/<div class="nr1b">[\s\S]*?<div class="ad">/)?.[0] ?? "";
    expect(block).toContain(`<span class="marke">${sieger!.name}</span>`);
    expect(block).toContain(`img.logo.dev/${sieger!.domain}?`);
  });

  it("druckt die Fakten der Nummer 1 so, wie der Vergleich sie zeigt", () => {
    const w = sieger!.werte as Record<string, unknown>;
    const fakten = (guide.match(/<div class="nr1b">[\s\S]*?<ul>([\s\S]*?)<\/ul>/)?.[1] ?? "").replace(/&nbsp;/g, " ");
    expect(w.zinsfreiAbStart).toBe("gut");
    expect(fakten).toContain("Ohne Zinsen ab dem ersten Tag");
    expect(fakten).toContain(`${w.halalEtfsFonds} Islamic`);
    const rate = String(w.sparrate ?? "").match(/^([\d.,]+)\s*€/)?.[1];
    expect(fakten).toContain(`Sparplan ab ${rate} €`);
  });

  it("zählt die Vergleiche wie die Seiten", () => {
    expect(guide).toContain(`${depotAnzeige.length} Depots:`);
    expect(guide).toContain(`${girokontoAnzeige.length} Konten, sortiert`);
    expect(guide).toContain(
      `<b>${girokontoAnzeige.filter((a) => a.werte.zinsfreiAbStart === "schlecht").length}&thinsp;/&thinsp;${girokontoAnzeige.length}</b><span>Girokonten`,
    );
    expect(guide).toContain(`${edelmetallAnzeige.length} Anbieter für physisches Gold`);
    expect(guide).toContain(`${screenerAnzeige.length} Apps, mit denen`);
    expect(guide).toContain(`${steuerAnzeige.length} Programme für die Steuererklärung`);
  });
});
