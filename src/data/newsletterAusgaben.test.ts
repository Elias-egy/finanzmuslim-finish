import { describe, expect, it } from "vitest";
import {
  eingetragen,
  sichtbar,
  ausgabeAusSlug,
  ausgabePfad,
  datumLang,
  nachbarn,
  neuesteZuerst,
  type Ausgabe,
} from "./newsletterAusgaben";

const beispiel = (nr: number, datum: string, thema: string): Ausgabe => ({
  nr,
  datum,
  thema,
  titel: `Titel ${nr}`,
  kurz: `Worum es in Nr. ${nr} ging.`,
  lesezeitMin: 5,
  rubriken: [{ titel: "Diese Woche wichtig", absaetze: ["Text."] }],
});

const liste = [
  beispiel(1, "2026-10-09", "boykott"),
  beispiel(3, "2026-10-23", "miete"),
  beispiel(2, "2026-10-16", "doener-index"),
];

describe("ausgabePfad", () => {
  it("setzt Datum und Thema zusammen", () => {
    expect(ausgabePfad(liste[0])).toBe("/newsletter/2026-10-09-boykott");
  });
});

describe("ausgabeAusSlug", () => {
  it("findet die Ausgabe zum Adressteil", () => {
    expect(ausgabeAusSlug("2026-10-16-doener-index", liste)?.nr).toBe(2);
  });

  it("gibt nichts zurück, wenn es die Ausgabe nicht gibt", () => {
    expect(ausgabeAusSlug("2026-10-16-gibt-es-nicht", liste)).toBeUndefined();
    expect(ausgabeAusSlug(undefined, liste)).toBeUndefined();
  });
});

describe("neuesteZuerst", () => {
  it("sortiert nach Datum, neueste oben", () => {
    expect(neuesteZuerst(liste).map((a) => a.nr)).toEqual([3, 2, 1]);
  });
});

describe("nachbarn", () => {
  it("nennt die vorige und die nächste Ausgabe", () => {
    const { vorige, naechste } = nachbarn(liste[2], liste);
    expect(vorige?.nr).toBe(1);
    expect(naechste?.nr).toBe(3);
  });

  it("lässt an den Rändern leer", () => {
    expect(nachbarn(liste[0], liste).vorige).toBeUndefined();
    expect(nachbarn(liste[1], liste).naechste).toBeUndefined();
  });
});

describe("datumLang", () => {
  it("schreibt das Datum aus, ohne Zeitzonenfehler", () => {
    expect(datumLang("2026-10-09")).toBe("9. Oktober 2026");
  });
});

describe("sichtbar", () => {
  const nr2 = { ...beispiel(2, "2026-10-16", "islamic"), sichtbarAb: "2026-10-16T05:00:00Z" };

  it("zeigt eine Ausgabe erst ab ihrer Versandzeit", () => {
    expect(sichtbar(nr2, Date.parse("2026-10-16T04:59:59Z"))).toBe(false);
    expect(sichtbar(nr2, Date.parse("2026-10-16T05:00:00Z"))).toBe(true);
  });

  it("zeigt eine Ausgabe ohne Versandzeit sofort", () => {
    expect(sichtbar(liste[0], Date.parse("2000-01-01T00:00:00Z"))).toBe(true);
  });
});

describe("die echten Ausgaben", () => {
  it("tragen eine lesbare Versandzeit in UTC, wenn sie eine haben", () => {
    for (const a of eingetragen)
      if (a.sichtbarAb) expect(a.sichtbarAb, `${a.nr}`).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
  });

  it("haben gültige, eindeutige Adressen und Nummern", () => {
    const pfade = eingetragen.map(ausgabePfad);
    expect(new Set(pfade).size).toBe(pfade.length);
    expect(new Set(eingetragen.map((a) => a.nr)).size).toBe(eingetragen.length);
    for (const a of eingetragen) {
      expect(a.datum).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(a.thema).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(a.rubriken.length).toBeGreaterThan(0);
    }
  });
});

describe("eingetragene Ausgaben, auch die noch nicht sichtbaren", () => {
  it("haben je eine eigene Adresse", () => {
    const pfade = eingetragen.map(ausgabePfad);
    expect(new Set(pfade).size).toBe(pfade.length);
  });

  it("springen aus der Inhaltsliste nur auf Rubriken, die es gibt", () => {
    for (const a of eingetragen) {
      const ziele = new Set(a.rubriken.map((r) => r.anker).filter(Boolean));
      for (const z of a.inhalt ?? []) if (z.anker) expect(ziele.has(z.anker), `${a.nr} #${z.anker}`).toBe(true);
    }
  });

  it("verlinken nur Seiten von finanzmuslim und laden Bilder über https", () => {
    for (const a of eingetragen) {
      const texte = [...(a.einleitung ?? []), ...a.rubriken.flatMap((r) => r.absaetze)].join("\n");
      for (const [, pfad] of texte.matchAll(/\[\[[^|\]]+\|([^\]]+)\]\]/g)) expect(pfad.trim().startsWith("/"), pfad).toBe(true);
      for (const [, src] of texte.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)) expect(src.startsWith("https://"), src).toBe(true);
      for (const r of a.rubriken) if (r.link) expect(r.link.to.startsWith("/")).toBe(true);
    }
  });

  it("tragen kein HTML außer fett und klein", () => {
    for (const a of eingetragen) {
      const texte = [...(a.einleitung ?? []), ...a.rubriken.flatMap((r) => [r.titel, ...r.absaetze])].join("\n");
      expect(texte.replace(/<\/?(strong|small)>/g, "")).not.toMatch(/<[a-z]/i);
    }
  });
});
