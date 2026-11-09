/**
 * Die Basics hinter dem Plan, im neuen Stil (CV27P, 09.11.2026; Elias: „dann kommen dazu noch die Basics dazu. Aber
 * die Basics werden dann auch ein bisschen neu designt, natürlich im neuen Stil“).
 *
 * Texte aus dem Halal Investment Blueprint (~/rebrand/freebies/xxl.html, Seiten 16 bis 19, dort je Satz mit Beleg
 * geprüft, MC7d8), gekürzt auf das, was der Leser tut. Nisab aus ~/rebrand/freebies/xxl-daten.json (Stand 31.10.2026).
 *
 * CV30P (09.11.2026, Prüfer CV29P Funde 1, 6, 7, 8): keine Prüf-Apps und kein „prüfen“ nach außen (Leser-Regel: „Prüf-Apps
 * hat fast keiner Interesse“), Fachwörter mit Alltagswort (kein § 23 EStG, kein „ETCs“, kein „Lieferanspruch“), die
 * Gold-Steuer wortgleich mit dem Gold-Favoriten in portfolioDashboard.ts (BFH VIII R 7/17: steuerfrei nach zwölf
 * Monaten nur mit Anspruch auf Lieferung), ein Hinweis nur für den, den er betrifft (`hinweisNur`).
 */
import type { BausteinId } from "@/data/portfolioPlan";

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
  /** Der Hinweis gilt nur, wenn dieser Baustein im Plan ist. */
  hinweisNur?: BausteinId;
};

export const NISAB = { euro: 9543, gramm: 85, stand: "31.10.2026" };

export const BASICS: Basic[] = [
  {
    id: "ablauf",
    titel: "Dein fester Ablauf",
    kurz: "Vier Termine im Jahr, dann läuft dein Plan von selbst.",
    zahlen: [
      { wert: "4×", label: "im Jahr ins Depot schauen" },
      { wert: "1×", label: "im Jahr Aufteilung ansehen" },
      { wert: "1×", label: "im Mondjahr Zakat" },
    ],
    schritte: [
      "Jedes Quartal kurz ins Depot schauen, ob alles läuft.",
      "Einmal im Jahr, an deinem festen Tag: Bereinigung rechnen und schauen, ob die Aufteilung noch zu dir passt.",
      "Einmal im Mondjahr, also alle 354 Tage: Nisab nachsehen und Zakat auf das Depot zahlen.",
    ],
  },
  {
    id: "steuer",
    titel: "Steuer",
    kurz: "Zwei Zahlen und eine Frist, mehr brauchst du nicht.",
    zahlen: [
      { wert: "1.000 €", label: "im Jahr steuerfrei, Single" },
      { wert: "2.000 €", label: "im Jahr steuerfrei, verheiratet" },
      { wert: "12 Monate", label: "halten: Gewinn aus Gold und Krypto steuerfrei" },
    ],
    schritte: [
      "Freistellungsauftrag einmal beim Depot einrichten. Dann bleiben 1.000 € Gewinn im Jahr ohne Steuer, sonst zieht das Depot sie automatisch ab.",
      "Gold und Krypto länger als zwölf Monate halten: dann ist der Gewinn steuerfrei. Bei Gold nur, wenn du dir das Gold liefern lassen kannst.",
    ],
    hinweis: "Ein Reformentwurf von Juli 2026 will die Frist für Krypto abschaffen, ist aber noch kein Gesetz.",
    hinweisNur: "krypto",
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
      "Quote nachsehen: der kleine Anteil der Einnahmen, der nicht erlaubt war.",
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
      `Liegt dein Vermögen über dem Nisab, also über dem Wert von ${NISAB.gramm} g Gold, ist Zakat fällig. Den Wert von heute, auch nach Silber, zeigt der Zakat-Rechner auf finanzmuslim.com.`,
      "Beispiel: Depot 10.000 € heute, davon 25 % als Grundlage, davon 2,5 %: 62,50 € Zakat für dieses Jahr.",
    ],
    hinweis: "Die 25-Prozent-Regel ist eine Annäherung, kein Konsens. Im Zweifel fragst du eine islamische Stelle, der du vertraust.",
  },
];

/** Die Basics für diesen Plan: ein Hinweis nur, wenn sein Baustein dabei ist (Prüfer CV29P, Fund 6). */
export const basicsFuer = (bausteine: BausteinId[]): Basic[] =>
  BASICS.map((b) => (b.hinweisNur && !bausteine.includes(b.hinweisNur) ? { ...b, hinweis: undefined } : b));
