import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { dateiText, offeneHaeuser } from "../../scripts/anfragen-offen";
import { ANFRAGEN, type Anfrage, type Vorgang } from "@/data/anfragenLog";
import { ANFRAGEN_STAND, OFFENE_ANFRAGEN } from "@/data/anfragenOffen";

/** Spec 10.12: welche Häuser gerade auf eine Antwort warten. Nur Hausschlüssel verlassen das Log. */

const raus = (datum: string, extra: Partial<Vorgang> = {}): Vorgang => ({ datum, richtung: "raus", kanal: "Mail", kern: "Frage", ...extra });
const rein = (datum: string, extra: Partial<Vorgang> = {}): Vorgang => ({ datum, richtung: "rein", kanal: "Mail", kern: "Antwort", ...extra });
const log = (vorgaenge: Vorgang[], extra: Partial<Anfrage> = {}): Record<string, Anfrage> => ({ haus: { anbieter: "Haus", vorgaenge, ...extra } });

describe("offeneHaeuser", () => {
  it("zählt eine Frage ohne Antwort als offen", () => {
    expect(offeneHaeuser(log([raus("21.09.2026")]), "26.09.2026")).toEqual(["haus"]);
  });

  it("schließt eine Frage mit späterer Antwort, auch am selben Tag", () => {
    expect(offeneHaeuser(log([raus("21.09.2026"), rein("21.09.2026")]), "26.09.2026")).toEqual([]);
  });

  it("zählt eine automatische Eingangsbestätigung nicht als Antwort", () => {
    expect(offeneHaeuser(log([raus("26.09.2026"), rein("26.09.2026", { automatisch: true })]), "26.09.2026")).toEqual(["haus"]);
  });

  it("öffnet erneut, wenn nach einer Antwort wieder gefragt wird", () => {
    expect(offeneHaeuser(log([raus("21.09.2026"), rein("22.09.2026"), raus("26.09.2026")]), "26.09.2026")).toEqual(["haus"]);
  });

  it("übergeht eingeplante Mails mit Datum in der Zukunft", () => {
    const vorgaenge = [raus("21.09.2026"), rein("22.09.2026"), raus("27.09.2026")];
    expect(offeneHaeuser(log(vorgaenge), "26.09.2026")).toEqual([]);
    expect(offeneHaeuser(log(vorgaenge), "27.09.2026")).toEqual(["haus"]);
  });

  it("vergleicht Daten über den Monatswechsel richtig", () => {
    expect(offeneHaeuser(log([raus("02.10.2026")]), "30.09.2026")).toEqual([]);
  });

  it("zählt ein Haus ohne Mailweg nie als offen", () => {
    expect(offeneHaeuser(log([raus("16.09.2026", { kanal: "Formular" })], { keinMailWeg: true }), "26.09.2026")).toEqual([]);
  });

  it("überträgt Scalable auf Prime+ und sortiert", () => {
    const anfragen = { zeta: { anbieter: "Z", vorgaenge: [raus("21.09.2026")] }, scalable: { anbieter: "S", vorgaenge: [raus("21.09.2026")] } };
    expect(offeneHaeuser(anfragen, "26.09.2026")).toEqual(["scalable", "scalable-prime", "zeta"]);
  });
});

describe("anfragenOffen.ts", () => {
  it("enthält weder Adressen noch Zeichen aus dem Log", () => {
    const text = dateiText(offeneHaeuser(ANFRAGEN, ANFRAGEN_STAND), ANFRAGEN_STAND);
    expect(text).not.toContain("@");
    for (const a of Object.values(ANFRAGEN)) for (const v of a.vorgaenge) if (v.zeichen) expect(text).not.toContain(v.zeichen);
  });

  it("ist frisch: passt zum Log in seinem Stand", () => {
    const aufPlatte = readFileSync(join(process.cwd(), "src/data/anfragenOffen.ts"), "utf8");
    expect(aufPlatte, "npx tsx scripts/anfragen-offen.ts ausführen").toBe(dateiText(offeneHaeuser(ANFRAGEN, ANFRAGEN_STAND), ANFRAGEN_STAND));
    expect([...OFFENE_ANFRAGEN]).toEqual(offeneHaeuser(ANFRAGEN, ANFRAGEN_STAND));
  });

  it("ist frisch: seit dem Stand ist keine eingeplante Mail fällig geworden", () => {
    const heute = new Date().toLocaleDateString("de-DE", { timeZone: "Europe/Berlin", day: "2-digit", month: "2-digit", year: "numeric" });
    expect(offeneHaeuser(ANFRAGEN, heute), "npx tsx scripts/anfragen-offen.ts ausführen").toEqual(offeneHaeuser(ANFRAGEN, ANFRAGEN_STAND));
  });

  it("anfragenLog wird von keinem ausgelieferten Modul importiert", () => {
    const dateien = (ordner: string): string[] =>
      readdirSync(ordner).flatMap((n) => {
        const pfad = join(ordner, n);
        return statSync(pfad).isDirectory() ? dateien(pfad) : [pfad];
      });
    const treffer = dateien(join(process.cwd(), "src"))
      .filter((p) => /\.(ts|tsx)$/.test(p) && !/\.test\.tsx?$/.test(p) && !p.endsWith("anfragenLog.ts"))
      .filter((p) => /from\s+["'][^"']*anfragenLog["']/.test(readFileSync(p, "utf8")));
    expect(treffer).toEqual([]);
  });
});
