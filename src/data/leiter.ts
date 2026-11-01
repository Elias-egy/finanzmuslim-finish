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
 *
 * MC7c (31.10.2026): FERTIG läuft nur per Mail, wie beim Einsteiger-Guide (Elias, Vault
 * `raw/2026-10-31-elias-mc7d11-fertig-nur-per-mail.md`: „schick mir eine Mail mit fertig“). Unten im Kasten steht der
 * Link, der die Mail öffnet; `scripts/scheduler/zoho_antworten.py` (Repo agentos, Timer alle 15 Minuten) antwortet mit
 * dem XXL-Guide. Kein Instagram mehr.
 *
 * MC7d12 (31.10.2026, Plan Vault `fundament/upgrade/MC7D11_2026-10-31/plan.html`, Baustein 2): Der Kasten nennt je Wort
 * die drei Guide-Seiten zur nächsten Frage dieses Lesers und zeigt das Deckblatt klein. Seitenzahlen und Titel aus der
 * Übersicht in `src/guides/xxl.html` (Seite 2); ändert sich dort die Reihenfolge, ändern sie sich hier auch.
 * Der allgemeine Inhalt („drei Level, vom ersten Depot …“) fällt weg, die drei Seiten sagen es genauer.
 * Elias zum Entwurf (Vault `raw/2026-10-31-elias-mc7d12-kasten-oben-raus-fertig-nach-eroeffnung.md`): der Satz
 * „Guide vorbereitet, 21 Seiten“ kann raus; Schritt 2 sagt klar „nach der Eröffnung … Mail mit FERTIG … ich schicke dir den“.
 */

/**
 * MC7d13d (Elias, 31.10.2026, Vault `raw/2026-10-31-elias-mc7d13d-werbung-plan-kasten-anleitung.md`): der Titel sagt, was
 * der Leser will, „die 1:1-Anleitung“, ein Guide, „der dich Schritt für Schritt durch alle Investment führt“; vorher
 * „Der XXL-Guide liegt schon bereit.“
 */
export const KASTEN = {
  titel: "Deine 1:1-Anleitung liegt schon bereit.",
  unter: "Der XXL-Guide führt dich Schritt für Schritt durch alle Anlagen, bis dein Portfolio steht.",
  grund: "Ich könnte ihn dir jetzt schicken, aber er macht erst Sinn, wenn du angefangen hast.",
  schritt: "Öffne",
  link: { text: "das Depot, das zu dir passt", ziel: "/vergleich/depot" },
  zaehlt: ", und investiere deine ersten 5 €. Hast du schon eins ohne Zinsen, reicht das.",
  fertig: "Nach der Eröffnung schreibst du mir eine Mail mit FERTIG, und ich schicke ihn dir.",
  mail: { text: "Schick mir eine Mail mit FERTIG", ziel: "mailto:elias@finanzmuslim.com?subject=FERTIG" },
} as const;

/** Die Freebies mit Kasten. Das Wort steht in der Klickzählung (k plus Wort, `src/lib/attribution.ts`). */
export const LEITER_WOERTER = ["liste", "aktie", "vertrag", "amin", "boykott", "plan", "etf", "gold"] as const;

export type LeiterWort = (typeof LEITER_WOERTER)[number];

type GuideSeite = { nr: number; titel: string };

/** Je Wort die nächste Frage des Lesers und die drei Guide-Seiten, die sie beantworten (MC7d12). */
export const NAECHSTE_FRAGE: Record<LeiterWort, { frage: string; seiten: readonly GuideSeite[] }> = {
  plan: {
    frage: "Was ist mit Steuer und Zakat?",
    seiten: [
      { nr: 17, titel: "Steuer und Förderung" },
      { nr: 18, titel: "Zakat auf Investments" },
      { nr: 19, titel: "Vier feste Termine für dein Portfolio" },
    ],
  },
  etf: {
    frage: "Welcher ETF, und was kommt dazu?",
    seiten: [
      { nr: 7, titel: "Welche Islamic ETFs es gibt: alle 12" },
      { nr: 13, titel: "Wie viel ETF, wie viel Gold?" },
      { nr: 14, titel: "Ein Beispiel-Portfolio, 500 € im Monat" },
    ],
  },
  gold: {
    frage: "Wie viel Gold, und was ist mit Steuer und Zakat?",
    seiten: [
      { nr: 13, titel: "Wie viel ETF, wie viel Gold?" },
      { nr: 17, titel: "Steuer und Förderung" },
      { nr: 18, titel: "Zakat auf Investments" },
    ],
  },
  boykott: {
    frage: "Und wohin mit meinem Geld?",
    seiten: [
      { nr: 3, titel: "Investieren ist nicht gleich Zinsen" },
      { nr: 4, titel: "Wo Zinsen überall stecken" },
      { nr: 5, titel: "Aktie, ETF, Islamic ETF in Bildern" },
    ],
  },
  liste: {
    frage: "Was davon passt zu mir, und wie viel?",
    seiten: [
      { nr: 13, titel: "Wie viel ETF, wie viel Gold?" },
      { nr: 14, titel: "Ein Beispiel-Portfolio, 500 € im Monat" },
      { nr: 19, titel: "Vier feste Termine für dein Portfolio" },
    ],
  },
  aktie: {
    frage: "Wie prüfe ich eine Aktie selbst?",
    seiten: [
      { nr: 11, titel: "Einzelaktien, mit Zoya und Musaffa" },
      { nr: 15, titel: "AAOIFI: die drei Kennzahlen" },
      { nr: 16, titel: "Gewinne bereinigen (Purification)" },
    ],
  },
  vertrag: {
    frage: "Wo stecken sonst noch Zinsen?",
    seiten: [
      { nr: 3, titel: "Investieren ist nicht gleich Zinsen" },
      { nr: 4, titel: "Wo Zinsen überall stecken" },
      { nr: 17, titel: "Steuer und Förderung" },
    ],
  },
  amin: {
    frage: "Wie wächst mein Rizq ohne Zinsen?",
    seiten: [
      { nr: 3, titel: "Investieren ist nicht gleich Zinsen" },
      { nr: 4, titel: "Wo Zinsen überall stecken" },
      { nr: 18, titel: "Zakat auf Investments" },
    ],
  },
};

/** Deckblatt des XXL-Guides, klein im Kasten. Nicht verlinkt: die Belohnung kommt erst nach FERTIG. */
export const DECKBLATT = "/guides/assets/xxl/deckblatt-klein.webp";
