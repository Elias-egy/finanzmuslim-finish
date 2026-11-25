/**
 * Ein Wortlaut für „Wie entsteht die Reihenfolge?“ im Depot- und Girokonto-Vergleich, auf der Methodik-Seite und im
 * Satz über der Liste. Pflicht nach UWG § 5b Abs. 2 (Hauptkriterien und Gewichte einer Rangliste nennen) und Anhang
 * Nr. 11a (bezahlte bessere Platzierung nie ohne Hinweis). Seit 25.11.2026 (Elias VG5-05) zählt die Note nur Halal-Merkmale
 * und Kosten, je zur Hälfte; das Kriterium „Bei meinen Lesern beliebt“ ist raus und steht nirgends mehr im Text.
 */

/**
 * Regel 13 der Rangfolge (Elias VG5-03, 24.11.2026): Die ersten Plätze im Depot legt Elias selbst fest. Das muss der Leser
 * erfahren (UWG § 5b Abs. 2: Hauptkriterien der Rangliste nennen), sonst stimmt der Satz „In jeder Gruppe zählt die Note“ nicht.
 */
export const SPITZE_SATZ_DEPOT =
  "Die ersten sieben Plätze lege ich selbst fest. Die Note daneben rechnet nach denselben Kriterien wie bei allen anderen.";

/** Der Satz über der Liste, vor dem Link zur Methodik. */
export const sortiertSatz = (was?: "Depot"): string =>
  (was === "Depot" ? `${SPITZE_SATZ_DEPOT} ` : "") +
  "Zuerst stehen Angebote, bei denen der Anbieter belegt, dass es ohne Zinsen geht, danach die mit offener Zins-Frage, ganz hinten, wer Zinsen zahlt. " +
  "Innerhalb jeder Gruppe zählt unsere Note: Halal-Merkmale und Kosten je zur Hälfte. Was wir an einem Angebot verdienen, zählt nie.";

/** Antwort auf „Wie entsteht die Reihenfolge?“. */
export const reihenfolgeAntwort = (was: "Depot" | "Konto"): string =>
  [
    "Die Note besteht zur Hälfte aus Halal-Merkmalen und zur Hälfte aus Kosten und Konditionen.",
    `Jedes Halal-Merkmal belegen wir beim Anbieter.`,
    ...(was === "Depot"
      ? [
          "Ein Halal-ETF zählt doppelt so viel wie ein Sukuk oder ein Edelmetall, Royal Mint Gold zählt wie ein ETF. Räumt dir ein Depot ab Start einen Kredit ein, zählen die Halal-Merkmale 10 % weniger.",
        ]
      : []),
    `Wie viel wir an einem ${was} verdienen, zählt nie.`,
    ...(was === "Depot" ? [SPITZE_SATZ_DEPOT] : []),
    `Die Liste steht in drei Gruppen: zuerst alle ${was === "Depot" ? "Depots" : "Konten"}, bei denen der Anbieter belegt, dass dein Guthaben ohne Zinsen liegt oder sich der Zins abschalten lässt, danach alle, bei denen er dazu nichts belegt („Offen“, kein Urteil, wir fragen nach), ganz hinten, wer Zinsen zahlt, die sich nicht abschalten lassen. In jeder Gruppe zählt die Note, die du siehst. Bei gleicher Note steht zuerst, was du über unseren Link eröffnen kannst.`,
    "Was nicht belegt ist, zählt 0 Punkte und wird nie geschätzt.",
    was === "Depot"
      ? "Platz 1 bekommt nur ein Depot ohne Zinsen ab Start, das du über unseren Link eröffnen kannst."
      : "Platz 1 bekommt nur ein Konto, das ohne Zinsen, ohne Dispo und ohne Kartenkredit startet und das du über unseren Link eröffnen kannst.",
  ].join(" ");

/**
 * Geschäftskonto (VG2, 23.11.2026): Die Note besteht je zur Hälfte aus Halal-Merkmalen und Kosten. „Bei meinen Lesern beliebt“
 * gibt es hier nicht, weil es keine Eröffnungen über unsere Links gibt. Fehlt es in der Rechnung, steht es auch nicht im Text.
 */
export const sortiertSatzGeschaeft = (): string =>
  "Zuerst stehen Konten, bei denen der Anbieter belegt, dass das Hauptkonto keinen Guthabenzins zahlt, danach die mit offener Zins-Frage, ganz hinten, wer Zinsen zahlt. " +
  "Innerhalb jeder Gruppe zählt unsere Note: Halal-Merkmale und Kosten je zur Hälfte. Was wir an einem Konto verdienen, zählt nie.";

export const reihenfolgeAntwortGeschaeft = (): string =>
  [
    "Die Note besteht zur Hälfte aus Halal-Merkmalen und zur Hälfte aus Kosten und Konditionen.",
    "Zu den Halal-Merkmalen zählen Zinsen, Dispo und Karte ohne Kredit. Jedes belegen wir beim Anbieter.",
    "Zu den Kosten zählen Kontoführung, Buchungen, Bargeld, Debitkarte, Unterkonten, Buchhaltung und Einlagensicherung, wie bei Finanzfluss gewichtet, ohne Tagesgeld.",
    "Zinsen, Aktionszinsen und Renditen von Geldmarktfonds zählen nie als Vorteil.",
    "Wie viel wir an einem Konto verdienen, zählt für die Note nie.",
    "Die Liste steht in drei Gruppen: zuerst alle Konten, bei denen der Anbieter belegt, dass das Hauptkonto keinen Guthabenzins zahlt, danach alle, bei denen er dazu nichts Ausdrückliches schreibt („Offen“, kein Urteil, wir fragen nach), ganz hinten, wer Zinsen auf das Guthaben zahlt. In jeder Gruppe entscheidet die Note, ein Link ändert nichts daran.",
    "Was der Anbieter bei Dispo oder Karte nicht ausdrücklich belegt, zählt als nicht erfüllt, bis er es belegt.",
  ].join(" ");
