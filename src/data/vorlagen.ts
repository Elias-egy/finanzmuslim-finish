import type { MotivName } from "@/components/motive";
import { ANZAHL_KAUFBAR } from "@/data/halalAnlagenZahl";

export type Vorlage = {
  slug: string;
  titel: string;
  kicker: string;
  kurzbeschreibung: string;
  nutzenZeile: string;
  kommentarKeyword: string;
  pdfPfad: string;
  motiv: MotivName;
  /** Ganz nur gegen E-Mail (`src/data/optin.ts`, ein Test hält beides gleich). */
  gegenEmail?: true;
};

/** Einzige Quelle fuer die drei kostenlosen Vorlagen. */
export const vorlagen: Vorlage[] = [
  {
    slug: "halal-anlagen",
    gegenEmail: true,
    titel: `${ANZAHL_KAUFBAR} halal Anlagen, die du wirklich kaufen kannst`,
    kicker: "Die Liste",
    kurzbeschreibung:
      "Finde Aktien-ETFs, Sukuk und Edelmetalle mit Kaufbeleg. Zu jeder Anlage die ISIN und die Anbieter, bei denen du sie kaufen kannst.",
    nutzenZeile: "Alle Halal-Anlagen auf einen Blick",
    kommentarKeyword: "LISTE",
    pdfPfad: "/downloads/halal-anlagen-liste.pdf",
    motiv: "liste",
  },
  {
    slug: "vertrags-ampel",
    gegenEmail: true,
    titel: "Grün, gelb, rot: welchen Vertrag du unterschreibst",
    kicker: "Die Ampel",
    kurzbeschreibung:
      "Zwölf Verträge aus dem Alltag, jeweils mit einer klaren Farbe und der Bedingung dahinter.",
    nutzenZeile: "In Sekunden wissen, woran du bist",
    kommentarKeyword: "VERTRAG",
    pdfPfad: "/downloads/vertrags-ampel.pdf",
    motiv: "ampel",
  },
  {
    slug: "aktien-check",
    titel: "Ist diese Aktie halal?",
    kicker: "Der Spickzettel",
    kurzbeschreibung:
      "Die drei Grenzwerte, nach denen jeder Screener entscheidet, und die Werkzeuge, die sie dir ausrechnen.",
    nutzenZeile: "Jede Aktie in unter einer Minute einordnen",
    kommentarKeyword: "CHECK",
    pdfPfad: "/downloads/aktien-spickzettel.pdf",
    motiv: "spickzettel",
  },
  {
    slug: "rizq",
    gegenEmail: true,
    titel: "14 Duas für Rizq, mit Quelle und Übersetzung",
    kicker: "Rizq",
    kurzbeschreibung:
      "Sechs Bittgebete aus dem Quran, acht aus der Sunnah. Arabisch, Umschrift, Übersetzung, Fundstelle.",
    nutzenZeile: "Belegte Bittgebete statt loser Zitate",
    kommentarKeyword: "RIZQ",
    pdfPfad: "/downloads/duas-fuer-rizq.pdf",
    motiv: "kompass",
  },
  {
    slug: "baraka-blocker",
    titel: "Zehn Dinge, die deiner Baraka im Weg stehen",
    kicker: "Baraka",
    kurzbeschreibung:
      "Zehn belegte Rizq-Blocker aus Quran und Sunnah, jeweils mit Fundstelle und dem, was stattdessen geht.",
    nutzenZeile: "Nicht mehr bekommen, sondern weniger verlieren",
    kommentarKeyword: "BARAKA",
    pdfPfad: "/downloads/baraka-blocker.pdf",
    motiv: "fehler",
  },
  {
    slug: "top-100-halal-aktien",
    gegenEmail: true,
    titel: "100 bekannte Halal-Aktien",
    kicker: "Aktien-Liste",
    kurzbeschreibung:
      "Von Apple bis Nike: bekannte Marken mit Musaffa-Einzelprüfung und Fundstelle, redaktionell sortiert nach Bekanntheit.",
    nutzenZeile: "Alle 100 bekannten Aktien sind halal",
    kommentarKeyword: "AKTIE",
    pdfPfad: "/downloads/100-halal-aktien.pdf",
    motiv: "aktienPruefen",
  },
  {
    slug: "gold-check",
    gegenEmail: true,
    // Die Zahl prüft ein Test gegen src/data/goldCheck.ts.
    titel: "Gold-Check: 10 Wege, Gold zu kaufen",
    kicker: "Gold-Check",
    kurzbeschreibung:
      "Prüfe zehn Wege zu Gold, vom Barren beim Händler bis zum Sparplan. Zu jedem das Urteil, der Grund und ein Beispiel.",
    nutzenZeile: "Vor dem Goldkauf wissen, was geht",
    kommentarKeyword: "GOLD",
    pdfPfad: "/downloads/gold-check.pdf",
    motiv: "gold",
  },
];

export const vorlageBySlug = (slug: string) => vorlagen.find((v) => v.slug === slug);
