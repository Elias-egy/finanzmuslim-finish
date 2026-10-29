import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import {
  BEKANNTE_ETF,
  BROKER_SATZ,
  DEPOTS_GEPRUEFT,
  DEPOTS_MIT_ALLEN,
  ETF_BEISPIELE,
  ETF_BETRAEGE,
  ETF_DEPOT_LOGOS,
  ETF_ISINS,
  ETF_MONATLICH,
  ETF_PFAD,
  ETF_ZAHL,
  ISLAMIC_FIRMEN,
  WORLD_FIRMEN,
  anFinanz,
  schmerzSatz,
} from "./etfPlan";
import { ANLAGEN_KAUFBAR } from "./anlagenKaufbar";
import { brokerVergleich } from "./brokerVergleich";
import { anlageBySlug } from "./halalAnlagen";
import { depotAnzeige } from "./vergleichAnzeige";
import { empfehlbar } from "./vergleichAssistent";
import { alleRouten, bewusstDraussen, nichtIndexiert } from "./routen";
import { istGueltigeQuelle } from "@/lib/attribution";

describe("ETF-Plan", () => {
  it("die Geld-Frage hat drei Beträge, der Startwert ist einer davon", () => {
    expect(ETF_BETRAEGE).toHaveLength(3);
    expect(ETF_BETRAEGE).toContain(ETF_MONATLICH);
  });

  it("der Schmerz rechnet den Finanzanteil des MSCI World auf den Betrag", () => {
    expect(anFinanz(100)).toBe(16);
    expect(anFinanz(500)).toBe(79);
    expect(schmerzSatz(300)).toContain("rund 47 €");
    expect(ISLAMIC_FIRMEN).toBeLessThan(WORLD_FIRMEN);
  });

  it("in der Liste stehen 12 Islamic ETFs und Fonds, jedes mit Eintrag in der Anlagen-Datenbank", () => {
    expect(ETF_ZAHL).toBe(12);
    for (const isin of ETF_ISINS) expect(ANLAGEN_KAUFBAR[isin]).toBeDefined();
  });

  it("die Zahl bei Trade Republic stimmt mit den Kaufbar-Daten, jedes Stück mit Anbieter-Beleg", () => {
    const ja = ETF_ISINS.filter((i) =>
      ANLAGEN_KAUFBAR[i]?.kaufbar.some((k) => k.anbieter === "Trade Republic" && k.beleg.quelle === "anbieter"),
    );
    const tr = BEKANNTE_ETF.find((d) => d.name === "Trade Republic")!;
    expect(tr.gross).toBe(`${ja.length} von ${ETF_ZAHL}`);
    expect(brokerVergleich.find((a) => a.id === "trade-republic-depot")?.werte.halalEtfsFonds).toBe(tr.gross);
  });

  it("„Wo kann ich sie kaufen?“: gezählt nur aus zinsfreien, ganz geprüften Depots", () => {
    expect(DEPOTS_GEPRUEFT.length).toBeGreaterThan(DEPOTS_MIT_ALLEN.length);
    expect(DEPOTS_MIT_ALLEN.length).toBeGreaterThan(0);
    for (const a of DEPOTS_GEPRUEFT) {
      expect(a.abgeraten).toBeFalsy();
      expect(a.werte.zinsfreiAbStart).not.toBe("schlecht");
      expect(String(a.werte.halalEtfsFonds)).not.toContain("mind.");
    }
    expect(BROKER_SATZ).toContain(`Von ${DEPOTS_GEPRUEFT.length} zinsfreien Depots`);
  });

  it("die Depot-Logos im Aufruf sind empfehlbar, ganz geprüft und haben mindestens 8 der 12", () => {
    for (const d of ETF_DEPOT_LOGOS) {
      expect(depotAnzeige.find((a) => a.id === d.id)?.domain).toBe(d.domain);
      expect(empfehlbar(d.id)).toBe(true);
      const imVergleich = DEPOTS_GEPRUEFT.find((a) => a.id === d.id);
      expect(imVergleich).toBeDefined();
      expect(Number(String(imVergleich!.werte.halalEtfsFonds).split(" ")[0])).toBeGreaterThanOrEqual(8);
    }
  });

  it("jedes Beispiel gibt es in der Anlagen-Datenbank, mit Zertifikat-Link und unter den 12", () => {
    for (const e of ETF_BEISPIELE) {
      const a = anlageBySlug(e.slug);
      expect(a?.zertifikatLink).toBeTruthy();
      expect(ETF_ISINS).toContain(a!.isin);
    }
  });

  it("die Seite ist versteckt, aber vorgerendert: noindex, nicht in der Sitemap, bewusst draußen", () => {
    expect(nichtIndexiert).toContain(ETF_PFAD);
    expect(alleRouten().map((r) => r.pfad)).not.toContain(ETF_PFAD);
    expect(bewusstDraussen.map((b) => b.pfad)).toContain("/dein-etf/:schluessel");
    expect(readFileSync("src/pages/EtfPlan.tsx", "utf8")).toContain("noindex");
  });

  it("die ManyChat-Quellen für etf zählen", () => {
    expect(istGueltigeQuelle("dmetf")).toBe(true);
    expect(istGueltigeQuelle("dmnachetf")).toBe(true);
  });
});
