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

  // MC7d9e (Elias 31.10.2026, wie Finanzfluss): die Nummer 1 steht als erste von drei Depot-Karten auf Seite 7.
  const karten = guide.match(/<div class="xd">[\s\S]*?<\/a><\/div>/g) ?? [];

  it("nennt die Nummer 1 des Depot-Vergleichs als erste der drei besten Depots", () => {
    expect(sieger).toBeTruthy();
    expect(karten).toHaveLength(3);
    expect(karten[0]).toContain(`${sieger!.name}<span class="nr1">Meine Nummer 1</span>`);
    expect(karten[0]).toContain(`logos/${sieger!.domain}.png`);
    expect(karten[0]).toContain("/depot-nummer-1?src=xxlnr1");
  });

  it("druckt die Fakten der Nummer 1 so, wie der Vergleich sie zeigt", () => {
    const w = sieger!.werte as Record<string, unknown>;
    const fakten = (karten[0] ?? "").replace(/&nbsp;/g, " ");
    expect(w.zinsfreiAbStart).toBe("gut");
    expect(guide).toContain("Alle drei starten <b>ohne Zinsen</b>");
    expect(fakten).toContain(`${w.halalEtfsFonds} Islamic`);
    const rate = String(w.sparrate ?? "").match(/^([\d.,]+)\s*€/)?.[1];
    expect(fakten).toContain(`Sparplan ab ${rate} €`);
  });

  it("zählt die Vergleiche wie die Seiten", () => {
    expect(guide).toContain(`${depotAnzeige.length} Depots:`);
    expect(guide).toContain(`${girokontoAnzeige.length} Konten, sortiert`);
    expect(guide).toContain(
      `<b>${girokontoAnzeige.filter((a) => a.werte.zinsfreiAbStart === "schlecht").length} von ${girokontoAnzeige.length}</b><span>Girokonten`,
    );
    expect(guide).toContain(`${edelmetallAnzeige.length} Anbieter für physisches Gold`);
    expect(guide).toContain(`${screenerAnzeige.length} Apps, mit denen`);
    expect(guide).toContain(`${steuerAnzeige.length} Programme für die Steuererklärung`);
  });
});
