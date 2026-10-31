import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { ANZAHL_DEPOT, BEKANNTE_DEPOTS, KARTEN_DEPOTS, NACHWEIS, SCHMERZ_SATZ, STUFEN_ZAHL, UEBERBLICK, kartenLogos, kaufGruppen, krypto, KRYPTO_PRUEFER, listenGruppen, nachweis } from "./anlagenListe";
import { kaufZeilen } from "./halalAnlagenKauf";
import { halalAnlagen } from "./halalAnlagen";
import { DEPOTS_GEPRUEFT, DEPOTS_MIT_ALLEN } from "./etfPlan";
import { depotAnzeige } from "./vergleichAnzeige";
import { empfehlbar } from "./vergleichAssistent";
import { nichtIndexiert } from "./routen";
import { optinFreebie, vollPfad } from "./optin";

const seite = readFileSync("src/pages/vorlagen/HalalAnlagenVoll.tsx", "utf8");

describe("Liste (MC7d13)", () => {
  it("die Kacheln oben zählen aus der Anlagen-Datenbank, nichts von Hand", () => {
    expect(UEBERBLICK.reduce((s, u) => s + u.zahl, 0)).toBe(ANZAHL_DEPOT + krypto.length);
    expect(ANZAHL_DEPOT).toBe(kaufZeilen.length);
    expect(krypto.length).toBe(halalAnlagen.filter((a) => a.kategorie === "krypto").length);
  });

  it("jede Karte hat eine Prüfstelle aus der Datenbank und Logos nur von Depots, die die Anlage führen", () => {
    for (const g of kaufGruppen)
      for (const z of g.zeilen) {
        expect(z.anlage.zertifizierer.length).toBeGreaterThan(3);
        const logos = kartenLogos(z);
        expect(logos.length).toBeLessThanOrEqual(3);
        for (const d of logos) expect(z.kaufbar.kaufbar.map((k) => k.anbieter)).toContain(d.name);
      }
  });

  it("die kleinen Logos sind empfehlbare, zinsfreie, ganz geprüfte Depots mit richtiger Domain", () => {
    for (const d of KARTEN_DEPOTS) {
      expect(depotAnzeige.find((a) => a.id === d.id)?.domain).toBe(d.domain);
      expect(empfehlbar(d.id)).toBe(true);
      expect(DEPOTS_GEPRUEFT.some((a) => a.id === d.id)).toBe(true);
    }
  });

  it("die Coins hat genau eine Stelle geprüft", () => {
    expect(KRYPTO_PRUEFER).toBe("Shariyah Review Bureau in Bahrain");
  });

  it("der eine Schmerz zählt wie der ETF-Plan", () => {
    expect(SCHMERZ_SATZ).toContain(`Von ${DEPOTS_GEPRUEFT.length} zinsfreien Depots`);
    expect(DEPOTS_MIT_ALLEN.length).toBeGreaterThan(0);
    expect(seite.match(/bg-loss-soft/g)).toHaveLength(1);
  });

  it("nur ein Weg raus: kein PDF, keine anderen Listen, kein Spickzettel, kein Formular, Kasten bleibt", () => {
    expect(seite).not.toMatch(/download|VorlagenSeite|"\/vorlagen|aktien-check|NewsletterBox|"\/halal-anlagen/);
    expect(seite).toContain('<NaechsterTeil wort="liste"');
    for (const ziel of seite.match(/listeLink\("([^"]+)"/g) ?? []) expect(ziel).toMatch(/listeLink\("\/vergleich\//);
  });

  it("jede Karte sagt, was geprüft ist; die Zeile oben zählt alle Karten", () => {
    for (const z of kaufZeilen) expect(nachweis(z), z.anlage.slug).toBeDefined();
    for (const slug of Object.keys(NACHWEIS)) expect(halalAnlagen.some((a) => a.slug === slug), slug).toBe(true);
    expect(STUFEN_ZAHL.reduce((s, x) => s + x.zahl, 0)).toBe(kaufZeilen.length);
    // Index-Stufe nur, wo die Datenbank selbst „index“ sagt; Zertifikat-Stufe nie bei „index“.
    for (const z of kaufZeilen) {
      if (nachweis(z).stufe === "index") expect(z.anlage.zertifikatArt).toBe("index");
      if (z.anlage.zertifikatArt === "index") expect(nachweis(z).stufe).toBe("index");
    }
    expect(listenGruppen.flatMap((g) => g.zeilen)).toHaveLength(kaufZeilen.length);
  });

  it("eine Zählweise: die geprüften Depots sind auch bei Sukuk und Edelmetallen ganz ausgezählt", () => {
    for (const d of DEPOTS_GEPRUEFT) {
      expect(String(d.werte.halalSukuk)).toMatch(/^\d+ von 3$/);
      expect(String(d.werte.halalEdelmetalle)).toMatch(/^\d+ von 7$/);
    }
    expect(seite).not.toMatch(/Anbietern/);
  });

  it("oben die bekannten Depots mit ihrer Zahl aus dem Depot-Vergleich", () => {
    expect(BEKANNTE_DEPOTS.map((d) => d.name)).toEqual(["Trade Republic", "Scalable Capital", "flatex"]);
    for (const d of BEKANNTE_DEPOTS) expect(DEPOTS_GEPRUEFT.find((a) => a.id === d.id)?.werte.halalEtfsFonds).toBe(`${d.zahl} von 12`);
  });

  it("kein Satz ohne Beleg: keine persönliche Rangfolge der Prüfstellen, kein Terminkontrakt-Grund", () => {
    expect(seite).not.toMatch(/Meine Einordnung|stärker ein|Terminkontrakte|entscheide selbst/);
  });

  it("die Seite bleibt versteckt: noindex, nicht in der Sitemap", () => {
    expect(seite).toContain("noindex");
    expect(nichtIndexiert).toContain(vollPfad(optinFreebie("halal-anlagen")!));
  });
});
