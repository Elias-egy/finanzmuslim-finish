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
 *
 * MC7d14 (Elias, 01.11.2026, Vault `raw/2026-11-01-elias-mc7d14-manychat-alle-woerter-fertig.md`): nach außen heißt er
 * „der fortgeschrittene Guide“, nicht „XXL-Guide“ („der fortgeschrittene Guide liegt bereit … rückwirkend“); er folgt
 * damit auf den Einsteiger-Guide, der auf Seite 11 genauso endet.
 *
 * MC7d16 (Elias, 01.11.2026, Vault `raw/2026-11-01-elias-mc7d16-antworten-dua-kompakt.md`: „der Halal Investment Blueprint
 * ist gut“): ein Name, den es nur über die Freebies gibt, statt „der fortgeschrittene Guide“.
 */
export const GUIDE_NAME = "Halal Investment Blueprint";

/**
 * MC7d17 (Elias, 02.11.2026, Vault `raw/2026-11-02-elias-mc7d17-feedback-runde-4.md`): „Hast du schon eins ohne Zinsen,
 * reicht das?“ raus; der graue Satz über dem Fetten und „Ich könnte ihn dir schicken …“ raus („würde ich mir nicht
 * durchlesen … alles ein bisschen zu viel Text“). Statt dessen ein kurzer Übergang zu den zwei Schritten.
 */
export const KASTEN = {
  titel: `Der ${GUIDE_NAME} liegt bereit.`,
  grund: "Du bekommst ihn, sobald du angefangen hast:",
  schritt: "Öffne",
  link: { text: "das Depot, das zu dir passt", ziel: "/vergleich/depot" },
  zaehlt: ", und investiere deine ersten 5 €.",
  fertig: "Nach der Eröffnung schreibst du mir eine Mail mit FERTIG, und ich schicke ihn dir.",
  mail: { text: "Schick mir eine Mail mit FERTIG", ziel: "mailto:elias@finanzmuslim.com?subject=FERTIG" },
} as const;

/** Die Freebies mit Kasten. Das Wort steht in der Klickzählung (k plus Wort, `src/lib/attribution.ts`). */
export const LEITER_WOERTER = ["liste", "aktie", "vertrag", "amin", "boykott", "plan", "etf", "gold"] as const;

export type LeiterWort = (typeof LEITER_WOERTER)[number];

type GuideSeite = { nr: string; titel: string };

/**
 * Level 2 des Guides heißt „Dein eigenes Halal-Portfolio“ und geht von Seite 6 bis 14 (Übersicht in `src/guides/xxl.html`).
 * Es steht in jedem Kasten zuerst (Elias, 01.11.2026, MC7d15 Runde 2: „dein eigenes Halal-Portfolio und dann irgendwie
 * Seite das bis das … ich würde bei jedem sowas wie Halal-Portfolio reinpacken“).
 */
const PORTFOLIO: GuideSeite = { nr: "6–14", titel: "Dein eigenes Halal-Portfolio" };

/**
 * Je Wort die nächste Frage des Lesers und die Guide-Seiten dazu (MC7d12). Seit MC7d16 (Elias, 01.11.2026, Runde 2:
 * „wenn du Sachen teasst, dann schon die, die so sich wie Geldvermehrung anhören … Du musst nicht die gleichen drei Seiten
 * immer nehmen“): nur Seiten, die nach Geldvermehrung klingen, kein Zakat, keine Steuer, kein AAOIFI, kein Bereinigen.
 * Titel wie im Guide; „Wie viel ETF, wie viel Gold?“ ist die Faustregel von Seite 13 („Fünf Bausteine und wie du sie
 * mischst“), Elias nannte genau diese Zeile „geile Sachen“.
 */
export const NAECHSTE_FRAGE: Record<LeiterWort, { frage: string; seiten: readonly GuideSeite[] }> = {
  plan: {
    frage: "Wie baust du dein Halal-Portfolio auf?",
    seiten: [
      PORTFOLIO,
      { nr: "7", titel: "Welche Islamic ETFs gibt es?" },
      { nr: "14", titel: "Ein Beispiel-Portfolio, 500\u00a0€ im Monat" },
    ],
  },
  etf: {
    frage: "Welcher ETF, und was kommt dazu?",
    seiten: [
      PORTFOLIO,
      { nr: "13", titel: "Wie viel ETF, wie viel Gold?" },
      { nr: "14", titel: "Ein Beispiel-Portfolio, 500\u00a0€ im Monat" },
    ],
  },
  gold: {
    frage: "Wie viel Gold gehört in dein Portfolio?",
    seiten: [
      PORTFOLIO,
      { nr: "13", titel: "Wie viel ETF, wie viel Gold?" },
      { nr: "7", titel: "Welche Islamic ETFs gibt es?" },
    ],
  },
  boykott: {
    frage: "Und wohin mit deinem Geld?",
    seiten: [
      PORTFOLIO,
      { nr: "7", titel: "Welche Islamic ETFs gibt es?" },
      { nr: "3", titel: "Investieren ist nicht gleich Zinsen" },
    ],
  },
  liste: {
    frage: "Was davon passt zu dir, und wie viel?",
    seiten: [
      PORTFOLIO,
      { nr: "13", titel: "Wie viel ETF, wie viel Gold?" },
      { nr: "14", titel: "Ein Beispiel-Portfolio, 500\u00a0€ im Monat" },
    ],
  },
  aktie: {
    frage: "Wie kaufst du Halal-Aktien richtig?",
    seiten: [
      PORTFOLIO,
      { nr: "11", titel: "Einzelaktien: selbst prüfen" },
      { nr: "7", titel: "Welche Islamic ETFs gibt es?" },
    ],
  },
  vertrag: {
    frage: "Wo stecken sonst noch Zinsen?",
    seiten: [
      PORTFOLIO,
      { nr: "3", titel: "Investieren ist nicht gleich Zinsen" },
      { nr: "4", titel: "Wo Zinsen überall stecken" },
    ],
  },
  amin: {
    frage: "Wie wächst dein Rizq ohne Zinsen?",
    seiten: [
      PORTFOLIO,
      { nr: "3", titel: "Investieren ist nicht gleich Zinsen" },
      { nr: "14", titel: "Ein Beispiel-Portfolio, 500\u00a0€ im Monat" },
    ],
  },
};

/** Deckblatt des XXL-Guides, klein im Kasten. Nicht verlinkt: die Belohnung kommt erst nach FERTIG. */
export const DECKBLATT = "/guides/assets/xxl/deckblatt-klein.webp";

/**
 * Seitenbilder aus dem Guide-PDF (`public/guides/finanzmuslim-xxl-guide-mt6puo.pdf`, pdftoppm 360 px breit), damit der
 * Kasten „ein richtiges Bild vom Guide“ zeigt (Elias, MC7d17). Bei einem Bereich wie „6–14“ die erste Seite.
 * Ändert sich der Guide, die Bilder neu ziehen.
 */
export const seitenBild = (nr: string) => `/guides/assets/xxl/seite-${nr.split("–")[0]}.webp`;
export const DECKBLATT_GROSS = seitenBild("1");
