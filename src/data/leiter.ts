/**
 * Die Leiter der Freebies (MC7b, Entwurf `~/Desktop/agentos/ops/leads/2026-10-29-mc7b-bindung-entwurf.md`
 * Abschnitt 3.2): Nach jedem Freebie liegt der nächste Teil bereit, kommt aber erst nach einem kleinen Schritt
 * und der Antwort FERTIG. Elias, 29.10.2026 nachts: „in den Guides, im Freebie, im Guide selber haben wir gesagt,
 * hey, du kriegst den fortgeschrittenen Guide, wenn du das machst … ich schicke dir den bewusst nicht“
 * (Vault `raw/2026-10-29-elias-mc7d2-bedingung-im-freebie.md`).
 *
 * Der Wortlaut je Sprosse ist derselbe wie in den Mails M1 (`~/rebrand/mails/bauen.py` v31, `_M1`). Wer einen
 * Satz hier ändert, ändert ihn dort auch. Die Belohnung wird nie verlinkt, nur der Schritt (wie im alten Guide,
 * `src/guides/einsteiger.html` Seite 10: Der Kasten führt zur Tat).
 *
 * Gold fehlt mit Absicht: Seine Belohnung wäre Sukuk, und das Freebie gibt es noch nicht.
 */

export type Sprosse = {
  /** Name der Belohnung, so wie sie im Kasten steht. */
  belohnung: string;
  /** Was drin ist, ein halber Satz. */
  vorschau: string;
  /** Der kleine Schritt, vor dem Link. */
  schritt: string;
  /** Linktext und Ziel des Schritts. */
  link: { text: string; ziel: string };
  /** Satz nach dem Link. */
  zaehlt: string;
};

const EINSTIEG: Sprosse = {
  belohnung: "Dein Portfolio-Plan",
  vorschau: "wie du 100, 300 oder 500 € im Monat aufteilen könntest",
  schritt: "Mach",
  link: { text: "den Test", ziel: "/vergleich/start" },
  zaehlt: ", es sind nur ein paar Fragen. Hast du schon ein Depot ohne Zinsen, reicht das.",
};

export const LEITER = {
  liste: EINSTIEG,
  aktie: EINSTIEG,
  vertrag: EINSTIEG,
  amin: EINSTIEG,
  boykott: EINSTIEG,
  plan: {
    belohnung: "Dein ETF-Plan",
    vorschau: "wie ein Islamic ETF Banken aussortiert und welche es gibt",
    schritt: "Eröffne",
    link: { text: "das Depot, das zu dir passt", ziel: "/vergleich/start" },
    zaehlt: ", und leg 5 € in einen Islamic ETF. Hast du schon ein Depot ohne Zinsen, reicht das.",
  },
  etf: {
    belohnung: "Dein Gold-Plan",
    vorschau: "woran du beim Broker eine Wette auf den Preis erkennst",
    schritt: "Richte",
    link: { text: "einen Sparplan auf einen Islamic ETF", ziel: "/vergleich/depot" },
    zaehlt: " ein, egal wie klein. Hast du schon einen, reicht das.",
  },
} satisfies Record<string, Sprosse>;

export type LeiterWort = keyof typeof LEITER;
