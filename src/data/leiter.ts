/**
 * Der Kasten „Dein nächster Schritt“ am Ende jedes Freebies (MC7b, Entwurf
 * `~/Desktop/agentos/ops/leads/2026-10-29-mc7b-bindung-entwurf.md` Abschnitt 3.2): Der Profi-Guide liegt bereit,
 * kommt aber erst nach einem kleinen Schritt und der Antwort FERTIG.
 *
 * MC7d4 (Elias, 30.10.2026, Vault `raw/2026-10-30-elias-mc7d4-kasten-profi-guide.md`): „Generell soll es eher zum
 * Profi-Guide für alles. Bisschen ruhiger sein. Mehr so sprechen, hey, ich könnte dir den jetzt auch schicken, aber es
 * macht keinen Sinn.“ Der Schritt ist für alle derselbe: „öffne … das beste Depot für Muslime … investiere deine ersten
 * 5 Euro“, „direkt zum Depotvergleich“. Wir sagen nicht, welches das beste ist, der Link führt zum Vergleich. Keine
 * Werbezeile im Kasten: „Das steht doch, wenn du auf die Seite sowieso gehst.“ Damit hat auch Gold seinen Kasten.
 *
 * Der Profi-Guide liegt als `public/guides/finanzmuslim-profi-guide.pdf` (15 Seiten, `src/guides/profi.html`). Er wird
 * nie verlinkt, nur der Schritt (wie im alten Guide, `src/guides/einsteiger.html` Seite 10: Der Kasten führt zur Tat).
 * Derselbe Schritt steht in den Mails M1 (`~/rebrand/mails/bauen.py` v33, `_M1`); die Mail hat dazu die Werbezeile.
 * Wer einen Satz hier ändert, ändert ihn dort auch.
 *
 * Nach den Prüfern MC7d4: „das Depot, das zu dir passt“ (Elias' erste Fassung) statt „das beste Depot für Muslime“,
 * weil der Vergleich „Unsere Nummer 1“ sagt und nicht „das beste“ (Halal-Prüfer, `~/rebrand/mails/halal-mc7d4-kasten-m1.md`);
 * Inhalt des Guides genannt, Weg für FERTIG genannt, wer schon ein Depot ohne Zinsen hat, muss keins eröffnen
 * (Seiten-Prüfer, `docs/freebies/abnahme-naechster-teil-2.md` S1 bis S3).
 *
 * MC7d8 (30.10.2026, Plan `~/Desktop/agentos/ops/leads/2026-10-30-mc7d6-xxl-guide-plan.md` Abschnitt 8): Belohnung ist
 * der XXL-Guide (`/dein-guide/xxl-3j1ion`, `public/guides/finanzmuslim-xxl-guide-mt6puo.pdf`, 21 Seiten in drei Level
 * nach Elias, Vault `raw/2026-10-30-elias-mc7d7-level-statt-themen.md`), nicht mehr der Profi-Guide. Der Grund nennt die
 * Themen weiter beim Namen (Blindleser MC7d4: „kommt aus dem Nichts“), jetzt als Weg durch die drei Level.
 */

export const KASTEN = {
  titel: "Der XXL-Guide liegt schon bereit.",
  grund:
    "Ich habe noch einen Guide vorbereitet, der alles zusammenbringt: drei Level, vom ersten Depot über Steuern und Zakat bis zur eigenen Aktienprüfung. Ich könnte ihn dir jetzt schicken, aber er macht erst Sinn, wenn du angefangen hast.",
  schritt: "Öffne",
  link: { text: "das Depot, das zu dir passt", ziel: "/vergleich/depot" },
  zaehlt: ", und investiere deine ersten 5 €. Hast du schon eins ohne Zinsen, reicht das.",
  fertig: "Antworte auf meine Mail mit FERTIG oder schreib es mir auf Instagram (@finanz.muslim). Dann schicke ich ihn dir.",
} as const;

/** Die Freebies mit Kasten. Das Wort steht in der Klickzählung (k plus Wort, `src/lib/attribution.ts`). */
export const LEITER_WOERTER = ["liste", "aktie", "vertrag", "amin", "boykott", "plan", "etf", "gold"] as const;

export type LeiterWort = (typeof LEITER_WOERTER)[number];
