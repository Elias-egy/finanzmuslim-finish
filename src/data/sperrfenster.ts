/**
 * Sperrfenster bis zum Start am 9. Oktober 2026.
 *
 * Die Seite liegt sichtbar im Hintergrund, darüber schwarzes Glas mit Timer und
 * Anmeldung zur Warteliste. Das Fenster fällt zum Zeitpunkt `ende` von selbst.
 * `aktiv: false` schaltet es sofort ab (wirkt mit der nächsten Auslieferung).
 *
 * Dieselben Werte stehen im kleinen Skript im Kopf von `index.html`, das das Glas
 * zeigt, bevor React geladen ist. `src/lib/sperrfenster.test.ts` prüft, dass beide
 * Stellen übereinstimmen.
 */
export const SPERRE = {
  aktiv: true,
  /** Freitag, 9. Oktober 2026, 07:00 Uhr in Berlin. Immer mit Zeitzone schreiben. */
  ende: "2026-10-09T07:00:00+02:00",
  /** SHA-256 des Schlüssels aus `?zugang=`. Der Klartext steht nicht im Repo. */
  schluesselHash: "acf395a99967dc40aef1cd44dbe1793de3884a18dc9592bf3b4211324b867dba",
  /** Name des Eintrags im localStorage, Wert ist der Zeitpunkt `ende` in Millisekunden. */
  merker: "fm_zugang",
  /**
   * Pfade ohne Sperre, jeweils samt Unterseiten. Rechtstexte müssen erreichbar
   * bleiben, die Guides verlinken auf den Investmentstart, `/gratis` und `/danke`
   * gehören zur Opt-in-Strecke.
   */
  frei: [
    "/impressum",
    "/datenschutz",
    "/dein-investmentstart",
    "/dein-investment-start",
    "/dein-guide",
    "/gratis",
    "/danke",
    "/out",
  ],
  /**
   * Anzahl der Anlagen im Bonus-PDF. Gehört zum PDF, nicht zur Liste der Seite.
   * PDF: public/downloads/v/bonus-lv1d/halal-anlagen-liste.pdf, verlinkt nur aus der Willkommensmail der
   * Warteliste. Gebaut mit ~/rebrand/freebies/anlagen_bonus.py, das abbricht, wenn die Zahl nicht passt.
   */
  bonusAnzahl: 30,
} as const;
