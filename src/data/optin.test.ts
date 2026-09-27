import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { istGesperrt, optinAdressen, optinFreebies, vollPfad } from "./optin";
import { vorlagen } from "./vorlagen";
import { aktien, fraglich } from "./top100Aktien";
import { kante, offen } from "./top100Ausschnitt";
import { anliegen, duas, nummerVon } from "./duas";
import * as duasAusschnitt from "./duasAusschnitt";
import { zeilen as ampelZeilen } from "./vertragsAmpel";
import * as ampelAusschnitt from "./vertragsAmpelAusschnitt";
import { kaufGruppen, kaufZeilen } from "./halalAnlagenKauf";
import * as anlagenAusschnitt from "./halalAnlagenAusschnitt";
import { ANLAGEN_KAUFBAR } from "./anlagenKaufbar";

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
  const nachName = new Map([...aktien, ...fraglich.map((f) => ({ ...f, status: "Doubtful" as const }))].map((a) => [a.name, a]));

  it("führt alle 100 als halal und die sechs fraglichen getrennt", () => {
    expect(aktien).toHaveLength(100);
    expect(aktien.every((a) => a.status === "Halal")).toBe(true);
    expect(new Set(aktien.map((a) => a.ticker)).size).toBe(100);
    expect(fraglich).toHaveLength(6);
    for (const f of fraglich) expect(aktien.some((a) => a.ticker === f.ticker)).toBe(false);
  });

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

describe("Ausschnitt „Dua für was?“", () => {
  const nachNummer = new Map(duas.map((d) => [nummerVon(d), d]));

  it("zeigt oben Bittgebete wortgleich wie in der vollen Fassung", () => {
    for (const d of duasAusschnitt.offen) expect(nachNummer.get(nummerVon(d))).toEqual(d);
  });

  it("nennt an der Kante nur Anliegen, die die volle Fassung auflöst, und keins, das oben offen steht", () => {
    const oben = new Set(duasAusschnitt.offen.map(nummerVon));
    for (const k of duasAusschnitt.kante) {
      expect(nachNummer.get(k.nr)?.nr).toContain(k.name);
      expect(oben.has(k.nr)).toBe(false);
    }
  });

  it("ordnet jedes der 14 Bittgebete genau einem Anliegen zu", () => {
    const alle = anliegen.flatMap((a) => a.nummern).sort();
    expect(alle).toEqual(duas.map(nummerVon).sort());
  });

  it("lädt auf der offenen Seite weder die volle Liste noch einen gesperrten Wortlaut", () => {
    for (const datei of ["src/pages/vorlagen/Rizq.tsx", "src/components/vorlagen/rizqTeile.tsx", "src/data/duasAusschnitt.ts"]) {
      const text = readFileSync(datei, "utf8");
      expect(text).not.toMatch(/^import \{[^}]*\} from "@\/data\/duas";/m);
      for (const k of duasAusschnitt.kante) expect(text).not.toContain(nachNummer.get(k.nr)!.ar);
    }
  });
});

describe("Ausschnitt der Vertrags-Ampel", () => {
  const nachName = new Map(ampelZeilen.map((z) => [z.vertrag, z]));

  it("zeigt oben Depot grün und Dispo rot, wortgleich wie in der vollen Fassung", () => {
    expect(ampelAusschnitt.offen.map((z) => z.farbe)).toEqual(["gruen", "rot"]);
    for (const z of ampelAusschnitt.offen) expect(nachName.get(z.vertrag)).toEqual(z);
  });

  it("nennt alle übrigen Verträge genau einmal an der Kante, ohne Farbe", () => {
    const alle = [...ampelAusschnitt.offen, ...ampelAusschnitt.kante].map((z) => z.vertrag).sort();
    expect(alle).toEqual(ampelZeilen.map((z) => z.vertrag).sort());
    for (const z of ampelAusschnitt.kante) {
      expect(z).not.toHaveProperty("farbe");
      expect(nachName.get(z.vertrag)?.unter).toBe(z.unter);
    }
  });

  it("lädt auf der offenen Seite keine gesperrte Farbe und keine Bedingung", () => {
    for (const datei of ["src/pages/vorlagen/VertragsAmpel.tsx", "src/components/vorlagen/ampelTeile.tsx", "src/data/vertragsAmpelAusschnitt.ts"]) {
      const text = readFileSync(datei, "utf8");
      expect(text).not.toMatch(/^import \{[^}]*\} from "@\/data\/vertragsAmpel";/m);
      for (const k of ampelAusschnitt.kante) expect(text).not.toContain(nachName.get(k.vertrag)!.woran);
    }
  });
});

describe("Ausschnitt der Halal-Anlagen", () => {
  it("rechnet die Zahl im Titel aus den Belegen nach", () => {
    expect(anlagenAusschnitt.ANZAHL_KAUFBAR).toBe(kaufZeilen.length);
    expect(vorlagen.find((v) => v.slug === "halal-anlagen")?.titel).toMatch(new RegExp(`^${kaufZeilen.length} `));
  });

  it("zeigt je Gruppe dieselbe Anzahl wie die Kauf-Tabelle", () => {
    expect(anlagenAusschnitt.gruppen.map((g) => [g.kategorie, g.anzahl])).toEqual(
      kaufGruppen.map((g) => [g.kategorie, g.zeilen.length]),
    );
  });

  it("zeigt oben Häuser wortgleich wie die Belege", () => {
    for (const o of anlagenAusschnitt.offen) {
      const z = kaufZeilen.find((x) => x.anlage.slug === o.slug)!;
      expect(o.kaufbar.kaufbar.map((k) => [k.anbieter, k.hinweis])).toEqual(z.kaufbar.kaufbar.map((k) => [k.anbieter, k.hinweis]));
      expect(o.kaufbar.stand).toBe(z.kaufbar.stand);
      expect(o.kaufbar.nichtImAngebot).toEqual(z.kaufbar.nichtImAngebot);
    }
  });

  it("nimmt nur Anlagen mit Eigenbeleg in die Tabelle", () => {
    for (const z of kaufZeilen) expect(ANLAGEN_KAUFBAR[z.anlage.isin!].kaufbar.length).toBeGreaterThan(0);
  });

  it("lädt auf der offenen Seite keine Kaufbarkeit", () => {
    for (const datei of ["src/pages/vorlagen/HalalAnlagen.tsx", "src/components/vorlagen/anlagenTeile.tsx", "src/data/halalAnlagenAusschnitt.ts"]) {
      const text = readFileSync(datei, "utf8");
      expect(text).not.toMatch(/^import \{[^}]*\} from "@\/data\/(anlagenKaufbar|halalAnlagenKauf)";/m);
    }
  });
});
