import { writeFileSync } from "node:fs";
import { test } from "vitest";
import { bewerte, HALAL_REGELN, teilKeys, type Kategorie } from "@/lib/bewertung";
import type { RohAnbieter } from "@/data/vergleichHelfer";
import { brokerVergleich, DEPOT_FINANZ_MAX } from "@/data/brokerVergleich";
import { girokontoVergleich, GIRO_FINANZ_MAX } from "@/data/girokontoVergleich";
import { kryptoVergleich, KRYPTO_FINANZ_MAX } from "@/data/kryptoVergleich";

/**
 * Interne Rangfolge, nicht für die Seite. Läuft nur mit Zielpfad:
 *
 *   RANGFOLGE_ZIEL=~/rebrand/RANGFOLGE_INTERN.md npx vitest run src/lib/rangfolgeIntern.test.ts
 *
 * Partnerstatus fließt nirgends ein, er steht nur als Spalte daneben. Wo Merkmale
 * fehlen, steht eine Spanne: schlechtester und bester Fall, wenn die Lücken
 * geprüft sind. Daraus folgt, wen zu prüfen sich zuerst lohnt.
 */

const ANTEIL_N: Record<string, number> = { halalEtfsFonds: 12, halalSukuk: 3, halalEdelmetalle: 8 };

const fuelle = (a: RohAnbieter, kat: Kategorie, fall: "best" | "schlecht"): RohAnbieter => {
  const regel = HALAL_REGELN[kat];
  const werte = { ...a.werte };
  const punkte = { ...(a.halalAnlagenPunkte ?? {}) };
  const tuer = werte[regel.tuersteher];
  if (tuer !== "gut" && tuer !== "teils" && tuer !== "schlecht") {
    werte[regel.tuersteher] = fall === "best" ? "gut" : "schlecht";
  }
  for (const teil of regel.teile) {
    for (const key of teilKeys(teil)) {
      const w = werte[key];
      if (teil.art === "ampel") {
        if (w !== "gut" && w !== "schlecht") werte[key] = fall === "best" ? "gut" : "schlecht";
        continue;
      }
      const n = ANTEIL_N[key];
      const genau = typeof w === "string" && /^\s*\d+\s+von\s+\d+\s*$/.test(w);
      if (genau && punkte[key] !== null) continue;
      const mind = typeof w === "string" ? Number(w.match(/(\d+)\s+von/)?.[1] ?? 0) : 0;
      const x = genau ? Number((w as string).match(/(\d+)/)![1]) : fall === "best" ? n : mind;
      werte[key] = `${x} von ${n}`;
      punkte[key] = fall === "best" ? x : x * 0.5;
    }
  }
  return { ...a, werte, halalAnlagenPunkte: punkte };
};

const note = (a: RohAnbieter, kat: Kategorie, max: Record<string, number>) => {
  const b = bewerte(a, kat, max);
  return b.status === "bewertet" ? b : null;
};

const f = (x: number) => x.toFixed(2).replace(".", ",");

test.skipIf(!process.env.RANGFOLGE_ZIEL)("interne Rangfolge schreiben", () => {
  const sets: [Kategorie, string, RohAnbieter[], Record<string, number>][] = [
    ["depot", "Depot", brokerVergleich, DEPOT_FINANZ_MAX],
    ["girokonto", "Girokonto", girokontoVergleich, GIRO_FINANZ_MAX],
    ["krypto", "Krypto", kryptoVergleich, KRYPTO_FINANZ_MAX],
  ];
  const z: string[] = [
    "# Interne Rangfolge der Vergleiche",
    "",
    `Erzeugt am ${new Date().toLocaleDateString("de-DE")} aus den Datendateien, mit \`bewerte()\` aus \`src/lib/bewertung.ts\`.`,
    "Nicht für die Seite. Partnerstatus fließt nicht ein, die Spalte P steht nur daneben.",
    "Neu erzeugen: `RANGFOLGE_ZIEL=~/rebrand/RANGFOLGE_INTERN.md npx vitest run src/lib/rangfolgeIntern.test.ts`",
    "",
  ];
  for (const [kat, titel, liste, max] of sets) {
    const fest = liste
      .map((a) => ({ a, b: note(a, kat, max) }))
      .filter((x) => x.b)
      .sort((p, q) => q.b!.note - p.b!.note || q.b!.halal - p.b!.halal || p.a.name.localeCompare(q.a.name));
    const gesperrt = liste.filter((a) => bewerte(a, kat, max).status === "gesperrt");
    const offen = liste
      .filter((a) => bewerte(a, kat, max).status === "offen")
      .map((a) => {
        const b = bewerte(a, kat, max);
        const best = note(fuelle(a, kat, "best"), kat, max);
        const schlecht = note(fuelle(a, kat, "schlecht"), kat, max);
        return { a, fehlt: b.status === "offen" ? b.fehlt : [], best, schlecht };
      })
      .sort((p, q) => (q.best?.note ?? 0) - (p.best?.note ?? 0) || p.a.name.localeCompare(q.a.name));

    z.push(`## ${titel}`, "", `${liste.length} Anbieter: ${fest.length} fertig bewertet, ${offen.length} offen, ${gesperrt.length} gesperrt (Zinsen nicht abschaltbar).`, "");
    if (fest.length > 0) {
      z.push("### Fertig bewertet", "", "| Platz | Anbieter | Note | Halal | Finanz | P |", "|---|---|---|---|---|---|");
      fest.forEach((x, i) => z.push(`| ${i + 1} | ${x.a.name} ${x.a.produkt} | **${f(x.b!.note)}** | ${f(x.b!.halal)} | ${f(x.b!.finanz)} | ${x.a.link ? "P" : ""} |`));
      z.push("");
    }
    if (offen.length > 0) {
      const schwelle = fest[0]?.b!.note ?? 0;
      z.push(
        "### Offen, sortiert nach bestem Fall",
        "",
        fest.length > 0
          ? `Wer im besten Fall über ${f(schwelle)} kommt, kann Platz 1 noch nehmen. Diese zuerst prüfen.`
          : "Noch niemand ist fertig. Wer im besten Fall oben steht, lohnt die Prüfung zuerst.",
        "",
        "| Anbieter | schlechtester Fall | bester Fall | Finanz | fehlt | P |",
        "|---|---|---|---|---|---|",
      );
      for (const x of offen) {
        z.push(`| ${x.a.name} ${x.a.produkt} | ${x.schlecht ? f(x.schlecht.note) : "gesperrt"} | **${x.best ? f(x.best.note) : "?"}** | ${x.best ? f(x.best.finanz) : "?"} | ${x.fehlt.join(", ")} | ${x.a.link ? "P" : ""} |`);
      }
      z.push("");
    }
    if (gesperrt.length > 0) z.push("### Gesperrt", "", gesperrt.map((a) => `${a.name} ${a.produkt}`).join(", "), "");
  }
  writeFileSync(process.env.RANGFOLGE_ZIEL!, z.join("\n"));
});
