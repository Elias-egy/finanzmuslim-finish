import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { istGesperrt, optinAdressen, optinFreebies, vollPfad } from "./optin";
import { vorlagen } from "./vorlagen";
import { aktien } from "./top100Aktien";
import { kante, offen } from "./top100Ausschnitt";

describe("gesperrte Freebies", () => {
  it("jede gesperrte Vorlage gibt es auch in vorlagen.ts", () => {
    const slugs = vorlagen.map((v) => v.slug);
    for (const f of optinFreebies.filter((x) => x.schluessel)) expect(slugs).toContain(f.id);
  });

  it("offen bleiben der Spickzettel und der Baraka-Blocker", () => {
    expect(istGesperrt("aktien-check")).toBe(false);
    expect(istGesperrt("baraka-blocker")).toBe(false);
    expect(istGesperrt("top-100-halal-aktien")).toBe(true);
  });

  it("jede Adresse gibt es genau einmal", () => {
    const a = optinAdressen();
    expect(new Set(a).size).toBe(a.length);
    for (const p of a) expect(p).toMatch(/^\/[a-z0-9/-]+$/);
  });

  it("der Guide führt je nach Stufe auf seinen Guide, ohne Stufe auf den Einsteiger", () => {
    const guide = optinFreebies.find((f) => f.id === "guide")!;
    expect(vollPfad(guide)).toBe("/dein-guide/start-2026");
    expect(vollPfad(guide, "profi")).toBe("/dein-guide/tiefe-2026");
  });
});

describe("Ausschnitt der 100 Halal-Aktien", () => {
  const nachName = new Map(aktien.map((a) => [a.name, a]));

  it("zeigt oben nur Titel, die als Halal in der Liste stehen, mit richtigem Ticker", () => {
    for (const a of offen) {
      expect(nachName.get(a.name)?.status).toBe("Halal");
      expect(nachName.get(a.name)?.ticker).toBe(a.ticker);
    }
  });

  it("nennt an der Schnittkante nur Namen, die die volle Fassung auch auflöst", () => {
    for (const a of kante) expect(nachName.has(a.name)).toBe(true);
  });

  it("mischt an der Schnittkante Halal und Fragliches, damit der Name nichts verrät", () => {
    const status = new Set(kante.map((a) => nachName.get(a.name)?.status));
    expect(status.size).toBeGreaterThan(1);
  });

  it("nennt an der Kante keinen Namen, den der offene Text schon verrät", () => {
    const seite = readFileSync("src/pages/vorlagen/Top100HalalAktien.tsx", "utf8");
    for (const a of kante) expect(seite).not.toContain(a.name);
  });

  it("enthält selbst kein Urteil", () => {
    const text = readFileSync("src/data/top100Ausschnitt.ts", "utf8");
    expect(text).not.toMatch(/Doubtful|status:/);
  });
});
