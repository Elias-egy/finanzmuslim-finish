import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { SPERRE } from "@/data/sperrfenster";
import { guides } from "@/data/guides";
import { wartelisteDaten } from "@/lib/anmeldung";
import {
  ENDE_MS,
  abgelaufen,
  guideSchaltetFrei,
  istFrei,
  istFreigeschaltet,
  merkeFreischaltung,
  restzeit,
  schluesselPasst,
  sperreZeigen,
} from "@/lib/sperrfenster";

describe("Zeit", () => {
  it("endet am 9. Oktober 2026 um 07:00 in Berlin, in jeder Zeitzone", () => {
    expect(new Date(ENDE_MS).toISOString()).toBe("2026-10-09T05:00:00.000Z");
  });

  it("zählt Tage, Stunden, Minuten und Sekunden", () => {
    const jetzt = ENDE_MS - ((11 * 24 + 4) * 3600 + 45 * 60 + 12) * 1000;
    expect(restzeit(jetzt)).toEqual({ tage: 11, stunden: 4, minuten: 45, sekunden: 12 });
  });

  it("bleibt nach dem Ende bei null", () => {
    expect(restzeit(ENDE_MS + 5000)).toEqual({ tage: 0, stunden: 0, minuten: 0, sekunden: 0 });
  });

  it("gilt genau ab dem Zeitpunkt als abgelaufen", () => {
    expect(abgelaufen(ENDE_MS - 1)).toBe(false);
    expect(abgelaufen(ENDE_MS)).toBe(true);
  });
});

describe("freie Pfade", () => {
  it.each([
    "/impressum",
    "/datenschutz",
    "/datenschutz/",
    "/dein-investmentstart",
    "/dein-investmentstart/bunq",
    "/dein-guide/start-2026",
    "/gratis/guide",
    "/danke/guide",
    "/vorlagen/halal-anlagen/abc123",
  ])("%s ist frei", (pfad) => expect(istFrei(pfad)).toBe(true));

  it.each(["/", "/vergleich/depot", "/vorlagen/halal-anlagen", "/newsletter", "/impressum-alt", "/halal-guide"])(
    "%s ist gesperrt",
    (pfad) => expect(istFrei(pfad)).toBe(false),
  );
});

describe("Freischaltung", () => {
  const ablage = () => {
    const werte = new Map<string, string>();
    return {
      getItem: (k: string) => werte.get(k) ?? null,
      setItem: (k: string, v: string) => void werte.set(k, v),
    };
  };

  it("gilt bis zum Ende und danach nicht mehr", () => {
    const a = ablage();
    expect(istFreigeschaltet(ENDE_MS - 1000, a)).toBe(false);
    merkeFreischaltung(a);
    expect(istFreigeschaltet(ENDE_MS - 1000, a)).toBe(true);
    expect(istFreigeschaltet(ENDE_MS, a)).toBe(false);
  });

  it("übersteht einen gesperrten Speicher", () => {
    const kaputt = {
      getItem: () => {
        throw new Error("gesperrt");
      },
      setItem: () => {
        throw new Error("gesperrt");
      },
    };
    expect(() => merkeFreischaltung(kaputt)).not.toThrow();
    expect(istFreigeschaltet(0, kaputt)).toBe(false);
  });

  it("ein gültiger Guide-Link schaltet frei, ein erfundener nicht", () => {
    expect(guideSchaltetFrei(`/dein-guide/${guides[0].schluessel}`)).toBe(true);
    expect(guideSchaltetFrei("/dein-guide/geraten")).toBe(false);
    expect(guideSchaltetFrei("/dein-guide")).toBe(false);
  });

  it("nimmt nur den richtigen Schlüssel", async () => {
    expect(await schluesselPasst("falsch")).toBe(false);
    expect(await schluesselPasst("")).toBe(false);
    expect(await schluesselPasst(null)).toBe(false);
  });

  it("der Schlüssel steht nur als SHA-256 im Code", () => {
    expect(SPERRE.schluesselHash).toMatch(/^[0-9a-f]{64}$/);
    expect(SPERRE.schluesselHash).not.toBe(createHash("sha256").update("").digest("hex"));
  });
});

describe("sperreZeigen", () => {
  const vorher = ENDE_MS - 60_000;

  it("sperrt die Startseite vor dem Start", () => {
    expect(sperreZeigen({ pfad: "/", jetzt: vorher, freigeschaltet: false })).toBe(true);
  });

  it("lässt frei: nach dem Ende, mit Freischaltung, auf freien Pfaden", () => {
    expect(sperreZeigen({ pfad: "/", jetzt: ENDE_MS, freigeschaltet: false })).toBe(false);
    expect(sperreZeigen({ pfad: "/", jetzt: vorher, freigeschaltet: true })).toBe(false);
    expect(sperreZeigen({ pfad: "/impressum", jetzt: vorher, freigeschaltet: false })).toBe(false);
  });
});

describe("Warteliste", () => {
  it("schickt Quelle, Anliegen und Fassung der Einwilligung mit", () => {
    expect(wartelisteDaten({ email: " a@b.de ", pfad: "/", lang: "de", firma: "" })).toEqual({
      email: "a@b.de",
      quelle: "web:sperrfenster/startseite",
      sprache: "de",
      interesse: "warteliste",
      firma: "",
      einwilligung: "sperrfenster-2026-09-28",
    });
    expect(wartelisteDaten({ email: "a@b.de", pfad: "/vergleich/depot/", lang: "tr", firma: "" }).quelle).toBe(
      "web:sperrfenster/vergleich/depot",
    );
  });
});

describe("Skript im Kopf von index.html", () => {
  const html = readFileSync("index.html", "utf8");

  it("trägt denselben Zeitpunkt, Schalter und Merker", () => {
    expect(html).toContain(`Date.parse("${SPERRE.ende}")`);
    expect(html).toContain(`var aktiv = ${SPERRE.aktiv};`);
    expect(html).toContain(`localStorage.getItem("${SPERRE.merker}")`);
  });

  it("trägt dieselben freien Pfade", () => {
    const liste = /var frei = (\[[^\]]+\]);/.exec(html)?.[1];
    expect(JSON.parse(liste ?? "[]")).toEqual([...SPERRE.frei]);
  });
});
