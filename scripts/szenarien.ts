/**
 * Szenario-Tafel: Für jeden Anbieter, der im Vergleich nicht gezeigt wird, weil Antworten fehlen, der beste
 * und der schlechteste Platz und was jede einzelne Antwort bewirkt.
 *
 *   npx tsx --tsconfig tsconfig.app.json scripts/szenarien.ts > szenarien.json
 *
 * Bester Fall: jede offene Zeile voll (alle Anlagen kaufbar). Schlechtester Fall: nur die belegte Untergrenze
 * ("mind. x von N" zählt x halb). Die Plätze stehen unter den heute gezeigten Anbietern desselben Vergleichs.
 */
import { rangfolge, ANTEIL_N, AMPEL_GEWICHTE, type RangKategorie } from "../src/lib/rangfolge";
import type { RohAnbieter } from "../src/data/vergleichHelfer";
import { brokerVergleich, DEPOT_FINANZ_MAX } from "../src/data/brokerVergleich";
import { girokontoVergleich, GIRO_FINANZ_MAX } from "../src/data/girokontoVergleich";
import { kryptoVergleich, KRYPTO_FINANZ_MAX } from "../src/data/kryptoVergleich";
import { depotAnzeige, girokontoAnzeige, kryptoAnzeige } from "../src/data/vergleichAnzeige";

type Kat = "depot" | "girokonto" | "krypto";
const sets: [Kat, string, RohAnbieter[], RohAnbieter[], Record<string, number>][] = [
  ["depot", "Depot", brokerVergleich, depotAnzeige, DEPOT_FINANZ_MAX],
  ["girokonto", "Girokonto", girokontoVergleich, girokontoAnzeige, GIRO_FINANZ_MAX],
  ["krypto", "Krypto", kryptoVergleich, kryptoAnzeige, KRYPTO_FINANZ_MAX],
];

const genau = (w: unknown) => typeof w === "string" && /^\s*\d+\s+von\s+\d+\s*$/.test(w);

/** Füllt eine Zeile (oder alle) für den besten oder schlechtesten Fall. */
const fuelle = (a: RohAnbieter, kat: Kat, fall: "best" | "schlecht", nur?: string): RohAnbieter => {
  const werte = { ...a.werte };
  const punkte = { ...(a.halalAnlagenPunkte ?? {}) };
  const tuer = werte.zinsfreiAbStart;
  if (tuer !== "gut" && tuer !== "teils" && tuer !== "schlecht") werte.zinsfreiAbStart = fall === "best" ? "gut" : "schlecht";
  if (kat !== "depot") {
    for (const [key] of AMPEL_GEWICHTE[kat]) {
      const w = werte[key];
      if (w !== "gut" && w !== "teils" && w !== "schlecht") werte[key] = fall === "best" ? "gut" : "schlecht";
    }
    return { ...a, werte };
  }
  for (const [key, n] of Object.entries(ANTEIL_N)) {
    if (genau(werte[key]) && typeof punkte[key] === "number") continue;
    const w = werte[key];
    const mind = typeof w === "string" ? Number(w.match(/(\d+)\s+von/)?.[1] ?? 0) : 0;
    const voll = fall === "best" && (nur === undefined || nur === key);
    werte[key] = `${voll ? n : mind} von ${n}`;
    punkte[key] = voll ? n : mind * 0.5;
  }
  return { ...a, werte, halalAnlagenPunkte: punkte };
};

const out: unknown[] = [];
for (const [kat, titel, alle, gezeigt, max] of sets) {
  const da = new Set(gezeigt.map((a) => a.id));
  const basis = rangfolge(gezeigt, kat as RangKategorie, { finanzMax: max });
  const platzVon = (a: RohAnbieter): { platz: number; note: number } | null => {
    const r = rangfolge([...gezeigt, a], kat as RangKategorie, { finanzMax: max });
    const b = r.gerankt.find((x) => x.anbieter.id === a.id);
    return b ? { platz: b.platz, note: b.note } : null;
  };
  const alleRang = rangfolge(alle, kat as RangKategorie, { finanzMax: max });
  const abgeraten = new Set(alleRang.abgeraten.map((x) => x.anbieter.id));
  for (const a of alle) {
    if (da.has(a.id) || abgeraten.has(a.id) || a.abgeraten) continue;
    const best = platzVon(fuelle(a, kat, "best"));
    const schlecht = platzVon(fuelle(a, kat, "schlecht"));
    const zeilen =
      kat === "depot"
        ? Object.entries(ANTEIL_N)
            .filter(([key]) => !(genau(a.werte[key]) && typeof a.halalAnlagenPunkte?.[key] === "number"))
            .map(([key, n]) => ({ zeile: key, n, platz: platzVon(fuelle(a, kat, "best", key))?.platz ?? null }))
        : [];
    out.push({ vergleich: titel, id: a.id, anbieter: `${a.name} ${a.produkt}`, link: Boolean(a.link), best, schlecht, zeilen, von: basis.gerankt.length + 1 });
  }
}
console.log(JSON.stringify(out, null, 1));
