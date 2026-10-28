import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { BOYKOTT_PFAD, alleAlternativen, alleFirmen, artVon, bereiche, listenQuellen } from "./boykottListe";
import { alleRouten, bewusstDraussen, nichtIndexiert } from "./routen";
import { istGueltigeQuelle } from "@/lib/attribution";

const bds = readFileSync("docs/freebies/quellen/bds-what-to-boycott-2026-10-28.txt", "utf8");

describe("Boykott-Liste", () => {
  it("hat 20 bis 30 Firmen, jede nur einmal (Elias, 28.10.2026)", () => {
    expect(alleFirmen.length).toBeGreaterThanOrEqual(20);
    expect(alleFirmen.length).toBeLessThanOrEqual(30);
    expect(new Set(alleFirmen.map((f) => f.name)).size).toBe(alleFirmen.length);
  });

  it("stimmt mit den drei Gruppen der BDS-Seite überein: 13 Ziele, 7 von unten, 5 Druck", () => {
    const zahl = (g: string) => alleFirmen.filter((f) => f.gruppe === g).length;
    expect([zahl("ziel"), zahl("vonUnten"), zahl("druck")]).toEqual([13, 7, 5]);
  });

  it("jede Firma steht im gesicherten Wortlaut der BDS-Seite", () => {
    const imText: Record<string, string> = {
      "McDonald's": "McDonald’s",
      "Coca-Cola": "Coca Cola",
      "Domino's": "Domino's Pizza",
      "Papa John's": "Papa John’s",
      Wix: "WIX",
      Dell: "DELL",
      HP: "Hewlett Packard (HP)",
      "Booking.com": "Booking",
    };
    for (const f of alleFirmen) expect(bds, f.name).toContain(imText[f.name] ?? f.name);
  });

  it("nur Druck-Ziele heißen „meiden“, alle anderen „Boykott“", () => {
    for (const f of alleFirmen) expect(artVon(f)).toBe(f.gruppe === "druck" ? "meiden" : "boykott");
  });

  it("der Link aus dem Chat wird gezählt", () => {
    expect(istGueltigeQuelle("dmboykott")).toBe(true);
  });

  it("die Seite ist versteckt, aber vorgerendert: noindex, nicht in der Sitemap, bewusst draußen", () => {
    expect(nichtIndexiert).toContain(BOYKOTT_PFAD);
    expect(alleRouten().map((r) => r.pfad)).not.toContain(BOYKOTT_PFAD);
    expect(bewusstDraussen.map((b) => b.pfad)).toContain("/deine-boykottliste/:schluessel");
    expect(readFileSync("src/pages/BoykottListe.tsx", "utf8")).toContain("noindex");
  });

  it("jede Alternative steht in keiner der gesicherten Listen, auch nicht ihr Eigentümer (BK3)", () => {
    // Eigentümer laut Belegen: Hassia (Vita Cola), Paniceus (Peter Pane), Document Foundation (LibreOffice),
    // Seyidli (HalalBooking), Zinkann (Miele).
    const suche = [...alleAlternativen.map((a) => a.name), "Fritz", "Hassia", "Paniceus", "Document Foundation", "Halal Booking", "Seyidli", "Zinkann", "Wiegert", "Patrick Junge", "Thomas Wilde", "Sprügel"];
    expect(listenQuellen.length).toBe(6);
    for (const q of listenQuellen) {
      const text = readFileSync(`docs/freebies/quellen/${q.datei}`, "utf8").toLowerCase();
      expect(text.length, q.datei).toBeGreaterThan(1000);
      for (const name of suche) expect(text.includes(name.toLowerCase()), `${name} in ${q.datei}`).toBe(false);
    }
  });

  it("jede Alternative ersetzt eine Firma aus ihrem Bereich, jeder Bereich hat eine", () => {
    for (const b of bereiche) {
      expect(b.alternativen.length, b.id).toBeGreaterThan(0);
      for (const a of b.alternativen) expect(b.firmen.some((f) => a.statt.includes(f.name)), `${a.name} statt ${a.statt}`).toBe(true);
    }
  });

  it("Alternativen sind nicht anklickbar (Freebie-Regel: nur Links zum Vergleich führen weg)", () => {
    const seite = readFileSync("src/pages/BoykottListe.tsx", "utf8");
    const kasten = seite.slice(seite.indexOf("const AlternativenKasten"), seite.indexOf("const Bereich"));
    expect(kasten).not.toMatch(/<a |<Link |href=/);
  });
});
