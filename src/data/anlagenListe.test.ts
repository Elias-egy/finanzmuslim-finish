import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { ANZAHL_DEPOT, KARTEN_DEPOTS, NACHWEIS, STUFEN_ZAHL, UEBERBLICK, kartenLogos, kaufGruppen, krypto, KRYPTO_PRUEFER, listenGruppen, nachweis } from "./anlagenListe";
import { kaufZeilen } from "./halalAnlagenKauf";
import { halalAnlagen } from "./halalAnlagen";
import { DEPOTS_GEPRUEFT, ETF_ZAHL } from "./etfPlan";
import { CHECK, TOP3 } from "./depotTop3";
import { existsSync } from "node:fs";
import { istGueltigeQuelle } from "@/lib/attribution";
import { depotAnzeige } from "./vergleichAnzeige";
import { empfehlbar } from "./vergleichAssistent";
import { nichtIndexiert } from "./routen";
import { optinFreebie, vollPfad } from "./optin";

const seite = readFileSync("src/pages/vorlagen/HalalAnlagenVoll.tsx", "utf8");

describe("Liste (MC7d13)", () => {
  it("die Kacheln oben zählen aus der Anlagen-Datenbank, nichts von Hand", () => {
    expect(UEBERBLICK.reduce((s, u) => s + u.zahl, 0)).toBe(ANZAHL_DEPOT);
    expect(UEBERBLICK.some((u) => u.id === "krypto")).toBe(false);
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

  it("Top 3 statt Rot (MC7d13d): drei Depots ohne Kredit, alle ab dem ersten Tag ohne Zinsen, mit Wortmarke", () => {
    expect(TOP3).toHaveLength(3);
    expect(TOP3.filter((d) => d.nr1)).toHaveLength(1);
    for (const d of TOP3) {
      expect(d.zinsfreiAbStart, d.id).toBe(true);
      expect(empfehlbar(d.id), d.id).toBe(true);
      expect(d.punkte).toHaveLength(6);
      expect(d.punkte[0]).toEqual({ text: "Guthaben ohne Zinsen", wert: "", ok: true });
      expect(`${d.punkte[1].text} ${d.punkte[1].wert}`).toMatch(new RegExp(`^Islamic ETFs und Fonds: (mind\\. )?\\d+ von ${ETF_ZAHL}$`));
      expect(d.link).toMatch(/^\/out\//);
      expect(existsSync(`public/guides/assets/logos/${d.domain}.wortmarke.svg`), d.domain).toBe(true);
    }
    expect(CHECK.map((d) => d.gross)).toEqual([`6 von ${ETF_ZAHL}`, "Zinsen"]);
    expect(seite).not.toMatch(/bg-loss-soft|AlertTriangle/);
  });

  it("die Logos auf den Karten zeigen die Top 3 zuerst", () => {
    const top = TOP3.map((d) => d.id).filter((id) => KARTEN_DEPOTS.some((k) => k.id === id));
    expect(KARTEN_DEPOTS.slice(0, top.length).map((k) => k.id)).toEqual(top);
  });

  it("Reihenfolge: Top 3 nach den Aktien-ETFs, Kasten ganz unten, kein Krypto-Aufruf", () => {
    expect(seite).toContain('g.kategorie === "aktien" && <TopDrei />');
    expect(seite.indexOf('<NaechsterTeil wort="liste"')).toBeGreaterThan(seite.indexOf('id="gruppe-krypto"'));
    expect(seite.indexOf('<NaechsterTeil wort="liste"')).toBeLessThan(seite.indexOf("<footer"));
    expect(seite).not.toMatch(/vergleich\/krypto/);
  });

  it("Wege raus: Depots, Nummer 1 und die Anlage-Seite; kein PDF, keine anderen Listen, kein Formular", () => {
    expect(seite).not.toMatch(/download|VorlagenSeite|"\/vorlagen|aktien-check|NewsletterBox/);
    for (const ziel of seite.match(/listeLink\([`"]([^`"]+)[`"]/g) ?? [])
      expect(ziel).toMatch(/listeLink\([`"](\/vergleich\/depot|\/depot-nummer-1|\/halal-anlagen\/\$\{z\.anlage\.slug\})[`"]/);
    for (const stelle of ["top3", "nr1", "alle", "karte"]) expect(istGueltigeQuelle(`gl${stelle}`), stelle).toBe(true);
  });

  it("jede Karte sagt, was geprüft ist; die Zeile oben zählt alle Karten", () => {
    for (const z of kaufZeilen) expect(nachweis(z), z.anlage.slug).toBeDefined();
    for (const slug of Object.keys(NACHWEIS)) expect(halalAnlagen.some((a) => a.slug === slug), slug).toBe(true);
    expect(STUFEN_ZAHL.reduce((s, x) => s + x.zahl, 0)).toBe(kaufZeilen.length);
    // Ein nur auf Indexebene belegter Fonds steht nie in der obersten Stufe; „aktuell“ nennt immer ein Jahr ab 2025.
    for (const z of kaufZeilen) {
      if (z.anlage.zertifikatArt === "index") expect(nachweis(z).stufe).toBe("prospekt");
      if (nachweis(z).stufe === "aktuell") expect(nachweis(z).text).toMatch(/202[5-9]/);
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

  it("kein Satz ohne Beleg: keine persönliche Rangfolge der Prüfstellen, kein Terminkontrakt-Grund", () => {
    expect(seite).not.toMatch(/Meine Einordnung|stärker ein|Terminkontrakte|entscheide selbst/);
    // Keine Zeile behauptet ein Fehlen, das sich nicht zeigen lässt (Halal-Prüfer r2).
    for (const n of Object.values(NACHWEIS)) expect(n.text).not.toMatch(/^Nur |kein /i);
  });

  it("die Seite bleibt versteckt: noindex, nicht in der Sitemap", () => {
    expect(seite).toContain("noindex");
    expect(nichtIndexiert).toContain(vollPfad(optinFreebie("halal-anlagen")!));
  });
});
