import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { SUKUK_DEPOTS_MIT_ALLEN, SUKUK_DEPOTS_ZINSFREI, SUKUK_TOP3, SUKUK_ZAHL } from "./depotTop3";
import {
  MERKSATZ,
  SUKUK_BETRAEGE,
  SUKUK_GESAMT_CHECK,
  SUKUK_MONATLICH,
  SUKUK_PFAD,
  SUKUK_ZEILEN,
  sukukQuellen,
  vergleich,
} from "./sukukPlan";
import * as plan from "./sukukPlan";
import { halalAnlagen } from "./halalAnlagen";
import { alleRouten, bewusstDraussen, nichtIndexiert } from "./routen";
import { FREEBIE_PDFS } from "./freebiePdfs";
import { istGueltigeQuelle } from "@/lib/attribution";

describe("Sukuk-Plan (MC7f)", () => {
  it("die Geld-Frage hat drei Beträge, der Startwert ist einer davon", () => {
    expect(SUKUK_BETRAEGE).toHaveLength(3);
    expect(SUKUK_BETRAEGE).toContain(SUKUK_MONATLICH);
  });

  it("die Erklärung steht so im Beitrag /blog/sukuk, nie „islamische Anleihe“", () => {
    const beitrag = readFileSync("src/pages/wissen/Sukuk.tsx", "utf8");
    expect(beitrag).toContain(MERKSATZ);
    // Was der Leser sieht: jede Textzeile aus sukukPlan.ts; der gedruckte Text der Seite steht in docs/freebies/sukuk-plan.txt.
    const texte = Object.values(plan).filter((v) => typeof v === "string").join(" ") + JSON.stringify(vergleich(100));
    expect(texte).not.toMatch(/islamische Anleihe/i);
    expect(readFileSync("docs/freebies/sukuk-plan.txt", "utf8")).not.toMatch(/islamische Anleihe/i);
    expect(vergleich(300)[0].anleihe).toContain("300");
  });

  it("zeigt alle Sukuk-ETFs und Fonds der Datenbank, jeden mit Nachweis-Link", () => {
    expect(SUKUK_ZEILEN.length).toBe(halalAnlagen.filter((a) => a.kategorie === "sukuk").length);
    expect(SUKUK_ZEILEN.length).toBe(SUKUK_ZAHL);
    expect(sukukQuellen).toHaveLength(SUKUK_ZEILEN.length + 1);
  });

  it("zeigt drei Depots ohne Zinsen mit allen Sukuk und zählt sie im Depot-Vergleich", () => {
    expect(SUKUK_TOP3).toHaveLength(3);
    for (const d of SUKUK_TOP3) {
      expect(d.zinsfreiAbStart).toBe(true);
      expect(d.nr1).toBe(false);
      expect(d.punkte.find((p) => p.text.startsWith("Sukuk"))?.wert).toBe(`${SUKUK_ZAHL} von ${SUKUK_ZAHL}`);
    }
    expect(SUKUK_DEPOTS_MIT_ALLEN).toBeGreaterThanOrEqual(3);
    expect(SUKUK_DEPOTS_MIT_ALLEN).toBeLessThan(SUKUK_DEPOTS_ZINSFREI);
    expect(SUKUK_GESAMT_CHECK[0].gross).toBe(`${SUKUK_DEPOTS_MIT_ALLEN} von ${SUKUK_DEPOTS_ZINSFREI}`);
  });

  it("jede Klickkennung der Seite zählt", () => {
    for (const k of ["sktop3", "skalle", "skkarte", "ksukuk", "dmsukuk", "dmnachsukuk"]) expect(istGueltigeQuelle(k)).toBe(true);
  });

  it("ist versteckt: noindex, nicht in der Sitemap, mit PDF", () => {
    expect(nichtIndexiert).toContain(SUKUK_PFAD);
    expect(alleRouten().map((r) => r.pfad)).not.toContain(SUKUK_PFAD);
    expect(bewusstDraussen.map((b) => b.pfad)).toContain("/dein-sukuk/:schluessel");
    expect(readFileSync("src/pages/SukukPlan.tsx", "utf8")).toContain("noindex");
    expect(FREEBIE_PDFS.sukuk.seite).toBe(SUKUK_PFAD);
  });
});
