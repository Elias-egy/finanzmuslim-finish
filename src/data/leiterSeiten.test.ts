import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { LEITER_WOERTER, NAECHSTE_FRAGE } from "./leiter";

// Die Seiten im Kasten stehen so im Guide (MC7d16, Elias: „Seitenzahlen nur aus dem echten Guide“).
const guide = readFileSync("src/guides/xxl.html", "utf8");
const titel = [...guide.matchAll(/<h1 class="xi-h1">([^<]*)<\/h1>/g)].map((m) => m[1]);
const seite = (nr: number) => titel[nr - 3];

describe("Guide-Kasten je Freebie", () => {
  it.each(LEITER_WOERTER)("%s: jede Seite passt zum Guide", (wort) => {
    for (const s of NAECHSTE_FRAGE[wort].seiten) {
      if (s.nr === "6–14") {
        expect(guide).toContain("Dein eigenes Halal-Portfolio");
        continue;
      }
      const nr = Number(s.nr);
      // Seite 13 heißt „Fünf Bausteine, fünf Aufgaben“; der Kasten nennt ihre Faustregel (Elias: „geile Sachen“).
      if (s.titel === "Wie viel ETF, wie viel Gold?") expect(nr).toBe(13);
      else expect(seite(nr)?.replace(/&nbsp;/g, " ").replace(/ /g, " ")).toBe(s.titel.replace(/ /g, " "));
    }
  });

  it("keine Seite zu Zakat, Steuer, AAOIFI oder Bereinigung", () => {
    const alle = LEITER_WOERTER.flatMap((w) => NAECHSTE_FRAGE[w].seiten.map((s) => s.titel)).join(" ");
    expect(alle).not.toMatch(/Zakat|Steuer|AAOIFI|bereinig|Purification/i);
  });
});
