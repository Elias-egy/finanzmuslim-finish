import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { BOYKOTT_PFAD, BOYKOTT_STAND, alleAlternativen, alleFirmen, artVon, bdsFirmen, bereiche, boykottQuellen, listenQuellen, starkeFirmen } from "./boykottListe";
import { alleRouten, bewusstDraussen, nichtIndexiert } from "./routen";
import { istGueltigeQuelle } from "@/lib/attribution";

const bds = readFileSync("docs/freebies/quellen/bds-what-to-boycott-2026-10-28.txt", "utf8");
const bdsNeu = readFileSync("docs/freebies/quellen/bds-what-to-boycott-2026-11-21.txt", "utf8");

describe("Boykott-Liste", () => {
  it("hat 20 bis 30 Firmen, jede nur einmal (Elias, 28.10.2026)", () => {
    expect(alleFirmen.length).toBeGreaterThanOrEqual(20);
    expect(alleFirmen.length).toBeLessThanOrEqual(30);
    expect(new Set(alleFirmen.map((f) => f.name)).size).toBe(alleFirmen.length);
  });

  it("stimmt mit den drei Gruppen der BDS-Seite überein: 13 Ziele, 7 von unten, 5 Druck", () => {
    const zahl = (g: string) => bdsFirmen.filter((f) => f.gruppe === g).length;
    expect([zahl("ziel"), zahl("vonUnten"), zahl("druck")]).toEqual([13, 7, 5]);
    expect(bdsFirmen.length).toBe(25);
  });

  it("BK7: 29 Firmen, Stand 21.11.2026, vier mit starkem Befund außerhalb der BDS-Seite", () => {
    expect(alleFirmen.length).toBe(29);
    expect(BOYKOTT_STAND).toBe("21.11.2026");
    expect(starkeFirmen.map((f) => f.name).sort()).toEqual(["ExxonMobil", "Shell", "Sony", "Zara"]);
    const bereichVon = (n: string) => bereiche.find((b) => b.firmen.some((f) => f.name === n))?.id;
    expect([bereichVon("Zara"), bereichVon("Sony"), bereichVon("Shell"), bereichVon("ExxonMobil")]).toEqual(["haushalt", "technik", "reisen", "reisen"]);
    expect(bereiche.find((b) => b.id === "haushalt")?.titel).toBe("Mode, Haushalt, Gesundheit, Versicherung");
    for (const f of starkeFirmen) {
      expect(artVon(f)).toBe("stark");
      expect(f.quelle, f.name).toBeTruthy();
      expect(bdsNeu.toLowerCase(), `${f.name} steht nicht auf der BDS-Seite`).not.toContain(f.name.toLowerCase());
    }
  });

  it("BK7: jeder starke Befund steht im gesicherten Wortlaut seiner Quelle", () => {
    const q = (d: string) => readFileSync(`docs/freebies/quellen/${d}`, "utf8");
    const zara = q("bds-boycott-zara-2025-07-24-abruf-2026-11-21.txt");
    expect(zara).toContain("Boycott ZARA until it ends its criminal complicity");
    expect(zara).toContain("Published 24-07-2025");
    for (const marke of ["Massimo Dutti", "Pull & Bear", "Bershka", "Oysho", "Stradivarius", "ZARA Home"]) expect(zara).toContain(marke);
    expect(zara).toContain("largest-ever store in Israel");
    expect(q("afsc-sony-2026-11-21.txt")).toMatch(/surveillance systems in the occupied West Bank and Gaza Strip[\s\S]*checkpoints in the besieged Gaza Strip/);
    expect(q("afsc-shell-2026-11-21.txt")).toContain("5% of the total crude oil that Israel imported");
    expect(q("afsc-shell-2026-11-21.txt")).toContain("major fuel suppliers of the Israeli military");
    const exxon = q("afsc-exxon-mobil-2026-11-21.txt");
    expect(exxon).toContain("fuel for fighter jets");
    expect(exxon).toContain("diesel fuel for use in its jeeps");
    for (const url of ["bdsmovement.net/news/boycott-zara", "afsc.org/company/sony", "afsc.org/company/shell", "afsc.org/company/exxon-mobil"])
      expect(boykottQuellen.some((b) => b.url.includes(url)), url).toBe(true);
  });

  it("BK7: die BDS-Seite vom 21.11.2026 nennt weiter alle 25", () => {
    const imText: Record<string, string> = { "McDonald's": "McDonald’s", "Coca-Cola": "Coca Cola", "Domino's": "Domino's Pizza", "Papa John's": "Papa John’s", Wix: "WIX", Dell: "DELL", HP: "Hewlett Packard (HP)", "Booking.com": "Booking" };
    for (const f of bdsFirmen) expect(bdsNeu, f.name).toContain(imText[f.name] ?? f.name);
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
    for (const f of bdsFirmen) expect(bds, f.name).toContain(imText[f.name] ?? f.name);
  });

  it("nur Druck-Ziele heißen „meiden“, alle anderen von der BDS-Seite „Boykott“", () => {
    for (const f of bdsFirmen) expect(artVon(f)).toBe(f.gruppe === "druck" ? "meiden" : "boykott");
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
