/**
 * Die Basics hinter dem Plan, im neuen Stil (CV27P, 09.11.2026; Elias: „dann kommen dazu noch die Basics dazu. Aber
 * die Basics werden dann auch ein bisschen neu designt, natürlich im neuen Stil“).
 *
 * Texte aus dem Halal Investment Blueprint (~/rebrand/freebies/xxl.html, Seiten 16 bis 19, dort je Satz mit Beleg
 * geprüft, MC7d8), gekürzt auf das, was der Leser tut. Nisab aus ~/rebrand/freebies/xxl-daten.json (Stand 31.10.2026).
 */
export type Basic = {
  id: string;
  titel: string;
  /** Eine Zeile, die sagt, was man davon hat. */
  kurz: string;
  /** Die großen Zahlen oder Begriffe oben in der Karte. */
  zahlen: { wert: string; label: string }[];
  schritte: string[];
  /** Ein Satz am Ende, wo Vorsicht nötig ist. */
  hinweis?: string;
};

export const NISAB = { euro: 9543, gramm: 85, stand: "31.10.2026" };

export const BASICS: Basic[] = [
  {
    id: "ablauf",
    titel: "Dein fester Ablauf",
    kurz: "Vier Termine im Jahr, dann läuft dein Plan von selbst.",
    zahlen: [
      { wert: "4×", label: "im Jahr Depot prüfen" },
      { wert: "1×", label: "im Jahr Aufteilung prüfen" },
      { wert: "1×", label: "im Mondjahr Zakat" },
    ],
    schritte: [
      "Jedes Quartal: alle Positionen mit Zoya oder Musaffa prüfen. Eine Übernahme kann eine Firma schnell in die Grauzone bewegen.",
      "Einmal im Jahr, an deinem festen Tag: Bereinigung rechnen und prüfen, ob die Aufteilung noch zu dir passt.",
      "Einmal im Mondjahr, also alle 354 Tage: Nisab prüfen und Zakat auf das Depot zahlen.",
    ],
  },
  {
    id: "steuer",
    titel: "Steuer",
    kurz: "Zwei Zahlen und eine Frist, mehr brauchst du nicht.",
    zahlen: [
      { wert: "1.000 €", label: "im Jahr steuerfrei, Single" },
      { wert: "2.000 €", label: "im Jahr steuerfrei, verheiratet" },
      { wert: "12 Monate", label: "halten: Gold und Krypto steuerfrei" },
    ],
    schritte: [
      "Freistellungsauftrag einmal beim Depot einrichten, sonst zieht es automatisch Kapitalertragsteuer ab.",
      "Gold, Silber und Krypto länger als zwölf Monate halten: dann ist der Gewinn steuerfrei (§ 23 EStG). Bei Gold gilt das auch für ETCs auf physisches Gold.",
    ],
    hinweis: "Ein Reformentwurf von Juli 2026 will die Frist für Krypto abschaffen, ist aber noch kein Gesetz.",
  },
  {
    id: "bereinigung",
    titel: "Bereinigung",
    kurz: "Den kleinen Anteil aus nicht erlaubten Einnahmen gibst du weiter.",
    zahlen: [
      { wert: "100 €", label: "Gewinn" },
      { wert: "2 %", label: "Haram-Anteil der Firma" },
      { wert: "2 €", label: "spendest du" },
    ],
    schritte: [
      "Quote nachsehen: Zoya und Musaffa zeigen dir je Firma den Anteil aus nicht erlaubten Einnahmen.",
      "Gewinn mal Quote ist dein Spendenbetrag, bei jedem verkauften Gewinn und jeder Dividende.",
      "Spenden und kurz notieren.",
    ],
  },
  {
    id: "zakat",
    titel: "Zakat auf dein Depot",
    kurz: "Erst ab dem Nisab, dann eine kleine Zahl vom heutigen Wert.",
    zahlen: [
      { wert: `${NISAB.euro.toLocaleString("de-DE")} €`, label: `Nisab, ${NISAB.gramm} g Gold, Stand ${NISAB.stand}` },
      { wert: "2,5 %", label: "auf Bargeld, Gold, ausgezahlte Gewinne" },
      { wert: "0,625 %", label: "Faustregel auf ETFs und Aktien im Depot" },
    ],
    schritte: [
      "Liegt dein Vermögen über dem Nisab, ist Zakat fällig. Den Wert von heute, auch nach Silber, zeigt der Zakat-Rechner auf finanzmuslim.com.",
      "Beispiel: Depot 10.000 € heute, davon 25 % als Grundlage, davon 2,5 %: 62,50 € Zakat für dieses Jahr.",
    ],
    hinweis: "Die 25-Prozent-Regel ist eine Annäherung, kein Konsens. Im Zweifel fragst du eine islamische Stelle, der du vertraust.",
  },
];
