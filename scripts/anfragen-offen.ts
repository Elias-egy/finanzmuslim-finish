/**
 * Schreibt src/data/anfragenOffen.ts: die Häuser, bei denen gerade eine Anfrage läuft.
 *
 *   npx tsx scripts/anfragen-offen.ts
 *
 * Nach jeder Änderung an src/data/anfragenLog.ts laufen lassen, und sobald eine eingeplante Mail
 * fällig geworden ist. Der Test src/lib/anfragenOffen.test.ts meldet beides.
 *
 * Regeln (P3-Spec 10.12, 26.09.2026): Offen ist ein Haus, dessen letzte Frage keine spätere
 * inhaltliche Antwort hat. Automatische Eingangsbestätigungen (`automatisch: true`) zählen nicht als
 * Antwort, Vorgänge mit Datum in der Zukunft (eingeplante Mails) zählen noch nicht. Ein Haus ohne
 * Mailweg ist nie offen. Das Log selbst wird nicht ausgeliefert, nur die Hausschlüssel verlassen es.
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { ANFRAGEN, type Anfrage } from "../src/data/anfragenLog";

/** Log-Schlüssel, deren Anfrage auch für ein anderes Haus in den Vergleichsdaten gilt. */
const AUCH_FUER: Record<string, string[]> = { scalable: ["scalable-prime"] };

/** "26.09.2026" -> "20260926", damit Textvergleich die Reihenfolge trifft. */
const sortierbar = (datum: string) => `${datum.slice(6, 10)}${datum.slice(3, 5)}${datum.slice(0, 2)}`;

export const offeneHaeuser = (anfragen: Record<string, Anfrage>, heute: string): string[] => {
  const offen = new Set<string>();
  for (const [haus, anfrage] of Object.entries(anfragen)) {
    if (anfrage.keinMailWeg) continue;
    const bisHeute = anfrage.vorgaenge.filter((v) => sortierbar(v.datum) <= sortierbar(heute));
    const letzteFrage = bisHeute.map((v) => v.richtung).lastIndexOf("raus");
    if (letzteFrage < 0) continue;
    const beantwortet = bisHeute.slice(letzteFrage + 1).some((v) => v.richtung === "rein" && !v.automatisch);
    if (beantwortet) continue;
    for (const h of [haus, ...(AUCH_FUER[haus] ?? [])]) offen.add(h);
  }
  return [...offen].sort();
};

export const dateiText = (haeuser: string[], stand: string): string =>
  [
    "// Erzeugt von scripts/anfragen-offen.ts aus src/data/anfragenLog.ts. Nicht von Hand ändern.",
    "// Nur Hausschlüssel, keine Adressen oder Ticketnummern. Wird von der Rangfolge gelesen.",
    `export const ANFRAGEN_STAND = ${JSON.stringify(stand)};`,
    "",
    "export const OFFENE_ANFRAGEN: ReadonlySet<string> = new Set([",
    ...haeuser.map((h) => `  ${JSON.stringify(h)},`),
    "]);",
    "",
  ].join("\n");

const heuteInBerlin = () =>
  new Date().toLocaleDateString("de-DE", { timeZone: "Europe/Berlin", day: "2-digit", month: "2-digit", year: "numeric" });

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const heute = heuteInBerlin();
  const haeuser = offeneHaeuser(ANFRAGEN, heute);
  const ziel = join(process.cwd(), "src/data/anfragenOffen.ts");
  writeFileSync(ziel, dateiText(haeuser, heute));
  console.log(`${haeuser.length} Häuser mit laufender Anfrage, Stand ${heute}: ${ziel}`);
}
