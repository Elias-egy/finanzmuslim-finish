/**
 * Kriterium „Bei meinen Lesern beliebt“ im Depot- und Girokonto-Vergleich (5 % der Note, `GEWICHT_BELIEBT` in
 * `src/lib/rangfolge.ts`). Elias, 08.11.2026 (A11): „Conversion, wie viel Geld man bekommt. Und was das Ranking ist.
 * … lass uns da ganz, ganz transparent sein“; 14.11.2026 (RK1-05): „Kleinigkeiten veränderst am Ranking, an den
 * Kriterien“; 15.11.2026 (RN3-07): „Flatex als einzige Nummer 1 … Smartbroker als Nummer 2“ (alle in raw/ im Vault).
 *
 * Gezählt wird, wie viele Leser nach einem Klick über finanzmuslim wirklich eröffnen: Abschlüsse, die das
 * Partnernetzwerk des Anbieters meldet, bestätigt oder noch offen, geteilt durch die Klicks. Abschluss heißt das
 * Ereignis, für das der Anbieter zahlt (Scalable: erste Einzahlung, darum 29 und nicht die 78 Anträge; norisbank: der
 * Antrag, financeAds meldet ihn als Abschluss; BBBank: 1 bezahlt plus 3 offene Anträge). Elias' eigene Anmeldungen
 * vom 08.11. sind abgezogen.
 *
 * Quelle aller Zahlen: Vault `hermes/renovierungskampagne/ergebnisse/03-vergleiche.md` Abschnitt 2a (Hermes, RK1,
 * 14.11.2026), dort aus `/home/agentos/conversion/netzwerke-tagesstand.jsonl` Stand 13.11.2026 23:50 und
 * `agentos-zentrale/backend/data/einnahmen.json`. Zeitraum seit 01.07.2026. PHASE1-ERKENNTNISSE.md §2 nennt „die
 * letzten 90 Tage“; eine Zählung je Anbieter für 90 Tage liegt nicht vor, darum steht hier der Zeitraum, den die
 * Quelle wirklich hat. Hermes rechnet monatlich neu (03 §4b).
 *
 * Ohne eigenen Partnerlink gibt es keinen Eintrag: Eröffnungen sehen wir nur über unseren Link. Kein Eintrag heißt
 * 0 Punkte in diesem Kriterium. Die Seite sagt das offen (Methodik).
 */

/** Gewicht des Kriteriums in der Note. Halal-Teil und Kosten teilen sich den Rest je zur Hälfte (47,5 %). */
export const GEWICHT_BELIEBT = 0.05;
export const BELIEBT_STAND = "13.11.2026";
export const BELIEBT_SEIT = "01.07.2026";
export const BELIEBT_KATEGORIEN = ["depot", "girokonto"] as const;
export type BeliebtKategorie = (typeof BELIEBT_KATEGORIEN)[number];

export type LeserEroeffnung = { klicks: number; abschluesse: number; notiz?: string };

export const LESER_EROEFFNUNGEN: Record<BeliebtKategorie, Record<string, LeserEroeffnung>> = {
  depot: {
    "flatex-depot": { klicks: 34, abschluesse: 3, notiz: "einer fraglich (11.11.), mitgezählt wie in der Quelle" },
    "smartbroker-plus-depot": { klicks: 50, abschluesse: 4 },
    "scalable-capital-free-broker": { klicks: 504, abschluesse: 29, notiz: "29 bezahlt bei erster Einzahlung, 78 Anträge" },
    "traders-place-depot": { klicks: 74, abschluesse: 1 },
    "consorsbank-depot": { klicks: 26, abschluesse: 0, notiz: "Klicks zusammen mit dem Girokonto gezählt, der eine Abschluss war das Girokonto" },
    "s-broker-direkt-depot": { klicks: 4, abschluesse: 0 },
    "comdirect-depot": { klicks: 28, abschluesse: 0 },
    "finanzen-net-zero-depot": { klicks: 13, abschluesse: 0 },
    "justtrade-depot": { klicks: 10, abschluesse: 0 },
  },
  girokonto: {
    "norisbank-top-girokonto": { klicks: 15, abschluesse: 5, notiz: "alle 5 Anträge noch offen" },
    "bbbank-bettersmart": { klicks: 44, abschluesse: 4, notiz: "1 bezahlt, 3 Anträge offen" },
    "consorsbank-girokonto": { klicks: 26, abschluesse: 1, notiz: "Klicks zusammen mit dem Depot gezählt" },
    "postbank-giro-pur": { klicks: 13, abschluesse: 0 },
    "n26-standard": { klicks: 18, abschluesse: 0 },
    "dkb-girokonto": { klicks: 6, abschluesse: 0 },
    "1822direkt-girodirekt": { klicks: 4, abschluesse: 0 },
  },
};

export const istBeliebtKategorie = (k: string): k is BeliebtKategorie => (BELIEBT_KATEGORIEN as readonly string[]).includes(k);

const quote = (e: LeserEroeffnung | undefined) => (e && e.klicks > 0 ? e.abschluesse / e.klicks : 0);

/**
 * Punkte 0 bis 5: der Anbieter mit der besten Quote im selben Vergleich bekommt 5, die anderen anteilig. Ohne
 * eigenen Link oder ohne Eintrag 0.
 */
export const beliebtPunkte = (kategorie: BeliebtKategorie, id: string, hatLink: boolean): number => {
  if (!hatLink) return 0;
  const tabelle = LESER_EROEFFNUNGEN[kategorie];
  const beste = Math.max(0, ...Object.values(tabelle).map(quote));
  return beste > 0 ? (5 * quote(tabelle[id])) / beste : 0;
};
