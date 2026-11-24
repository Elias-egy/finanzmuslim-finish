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
 * Quelle aller Zahlen: `/home/agentos/conversion/netzwerke-tagesstand.jsonl` am VPS, Eintrag vom 23.11.2026 23:50 (Summe seit
 * 01.07.2026 je Programm), gelesen in VG5 am 24.11.2026. Vorher Vault `hermes/renovierungskampagne/ergebnisse/03-vergleiche.md`
 * Abschnitt 2a (Hermes, RK1, Stand 13.11.2026), Zuordnung wie dort: financeAds zählt Abschlüsse als „sales“, FinanceQuality
 * Anträge als „leads“ (BBBank 13.11.: 4 leads, davon 1 bezahlt). Zeitraum seit 01.07.2026. PHASE1-ERKENNTNISSE.md §2 nennt „die
 * letzten 90 Tage“; eine Zählung je Anbieter für 90 Tage liegt nicht vor, darum steht hier der Zeitraum, den die
 * Quelle wirklich hat. Hermes rechnet monatlich neu (03 §4b).
 *
 * Ohne eigenen Partnerlink gibt es keinen Eintrag: Eröffnungen sehen wir nur über unseren Link. Kein Eintrag heißt
 * 0 Punkte in diesem Kriterium. Die Seite sagt das offen (Methodik).
 */

/** Gewicht des Kriteriums in der Note. Halal-Teil und Kosten teilen sich den Rest je zur Hälfte (47,5 %). */
export const GEWICHT_BELIEBT = 0.05;
export const BELIEBT_STAND = "23.11.2026";
export const BELIEBT_SEIT = "01.07.2026";
export const BELIEBT_KATEGORIEN = ["depot", "girokonto"] as const;
export type BeliebtKategorie = (typeof BELIEBT_KATEGORIEN)[number];

export type LeserEroeffnung = { klicks: number; abschluesse: number; notiz?: string };

export const LESER_EROEFFNUNGEN: Record<BeliebtKategorie, Record<string, LeserEroeffnung>> = {
  depot: {
    "flatex-depot": { klicks: 85, abschluesse: 7 },
    "smartbroker-plus-depot": { klicks: 85, abschluesse: 11 },
    "scalable-capital-free-broker": { klicks: 534, abschluesse: 29, notiz: "29 bezahlt bei erster Einzahlung, 78 Anträge" },
    "traders-place-depot": { klicks: 116, abschluesse: 3 },
    "consorsbank-depot": {
      klicks: 44,
      abschluesse: 0,
      notiz: "Klicks zusammen mit dem Girokonto gezählt. 3 Abschlüsse im Programm: einer war am 13.11. das Girokonto, die zwei neuen sind keinem Produkt zugeordnet und zählen nicht",
    },
    "s-broker-direkt-depot": { klicks: 11, abschluesse: 0 },
    "comdirect-depot": { klicks: 51, abschluesse: 0 },
    "finanzen-net-zero-depot": { klicks: 17, abschluesse: 0 },
    "justtrade-depot": { klicks: 13, abschluesse: 0 },
  },
  girokonto: {
    "norisbank-top-girokonto": { klicks: 102, abschluesse: 31 },
    "bbbank-bettersmart": { klicks: 65, abschluesse: 13, notiz: "13 Anträge, davon 2 bezahlt" },
    "consorsbank-girokonto": { klicks: 44, abschluesse: 1, notiz: "Klicks zusammen mit dem Depot gezählt, nur der am 13.11. zugeordnete Abschluss zählt" },
    "postbank-giro-pur": { klicks: 16, abschluesse: 0 },
    "n26-standard": { klicks: 26, abschluesse: 0 },
    "dkb-girokonto": { klicks: 7, abschluesse: 0 },
    "1822direkt-girodirekt": { klicks: 14, abschluesse: 0 },
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
