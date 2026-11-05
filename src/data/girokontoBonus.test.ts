import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { BBBANK_PRAEMIE, BONUS_KONTEN, GIRO_BONUS_SRC } from "./girokontoBonus";
import { girokontoAnzeige } from "./vergleichAnzeige";
import { GIRO_FINANZ_MAX } from "./girokontoVergleich";
import { werteAus } from "@/lib/vergleichAssistent";
import { deals } from "./deals";
import { findPartnerLink } from "./partnerLinks";
import { istGueltigeQuelle } from "@/lib/attribution";
import { festeRouten } from "./routen";

const vergleich = (id: string) => girokontoAnzeige.find((a) => a.id === id)!;
const rang = werteAus(girokontoAnzeige, "girokonto", GIRO_FINANZ_MAX, { wuensche: [], gewichte: [] }).passt;

describe("Girokonto-Unterseite /vorlagen/girokonto-bonus (H15 5c)", () => {
  it("zeigt die ersten drei Girokonten des Vergleichs in dessen Reihenfolge", () => {
    expect(rang.slice(0, 3).map((t) => t.anbieter.id)).toEqual(BONUS_KONTEN.map((k) => k.id));
  });

  it("führt jedes Konto über einen aktiven Partnerlink", () => {
    for (const k of BONUS_KONTEN) {
      expect(findPartnerLink(k.out)?.aktiv, k.out).toBe(true);
      expect(vergleich(k.id).link, k.id).toBe(`/out/${k.out}`);
    }
  });

  it("hält die drei Häkchen (Zinsen, Dispo, Karte) wie der Vergleich", () => {
    for (const k of BONUS_KONTEN) {
      const w = vergleich(k.id).werte as Record<string, unknown>;
      expect(w.zinsfreiAbStart, k.id).toBe("gut");
      expect(w.keinDispoAbStart, k.id).toBe("gut");
      expect(w.karteOhneKredit, k.id).toBe("gut");
    }
  });

  it("nennt die Kontoführung wie der Vergleich", () => {
    for (const k of BONUS_KONTEN) {
      const text = String((vergleich(k.id).werte as Record<string, unknown>).kontofuehrung);
      expect(text, k.id).toContain(String(k.gratisAb).replace(/^(\d)(\d{3})$/, "$1.$2"));
      expect(text, k.id).toContain(String(k.sonst).replace(".", ","));
      expect(text, k.id).toContain(String(k.gratisUnter));
    }
  });

  it("hält die Prämie der BBBank wie deals.ts und belegt sie am 05.11.2026", () => {
    const d = deals.find((x) => x.partnerKurzname === "bbbank");
    expect(d?.betrag).toBe(BBBANK_PRAEMIE.betrag);
    expect(BBBANK_PRAEMIE.beleg.stand).toBe("05.11.2026");
    expect(BBBANK_PRAEMIE.beleg.wortlaut).toContain("50 € Startprämie");
  });

  it("führt bei norisbank und Consorsbank keine Prämie (Zinsprodukt, Geldeingänge)", () => {
    for (const k of BONUS_KONTEN.slice(1)) expect(Object.keys(k)).not.toContain("praemie");
  });

  it("belegt jede Angabe mit Adresse, Datum und Wortlaut", () => {
    for (const k of BONUS_KONTEN)
      for (const [feld, b] of Object.entries(k.belege)) {
        expect(b.url, `${k.id} ${feld}`).toMatch(/^https:\/\//);
        expect(b.stand, `${k.id} ${feld}`).toMatch(/^\d{2}\.\d{2}\.2026$/);
        expect(b.wortlaut.length, `${k.id} ${feld}`).toBeGreaterThan(20);
      }
  });

  it("zählt jede Stelle mit gültiger Kennung", () => {
    for (const s of Object.values(GIRO_BONUS_SRC)) expect(istGueltigeQuelle(s), s).toBe(true);
  });

  it("steht als Vorlage in der Sitemap", () => {
    expect(festeRouten.some((r) => r.pfad === "/vorlagen/girokonto-bonus")).toBe(true);
  });

  it("enthält weder Amanah noch Gedankenstriche in den Seitentexten", () => {
    for (const f of ["src/pages/vorlagen/GirokontoBonus.tsx"]) {
      const text = readFileSync(f, "utf8").replace(/\/\*[\s\S]*?\*\//g, "").replace(/\{\/\*[\s\S]*?\*\/\}/g, "");
      expect(/amanah/i.test(text)).toBe(false);
      expect(/[–—]/.test(text)).toBe(false);
    }
  });
});
