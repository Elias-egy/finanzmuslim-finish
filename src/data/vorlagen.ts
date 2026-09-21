import type { MotivName } from "@/components/motive";

export type Vorlage = {
  slug: string;
  titel: string;
  kicker: string;
  kurzbeschreibung: string;
  nutzenZeile: string;
  kommentarKeyword: string;
  pdfPfad: string;
  motiv: MotivName;
};

/** Einzige Quelle fuer die drei kostenlosen Vorlagen. */
export const vorlagen: Vorlage[] = [
  {
    slug: "halal-anlagen",
    titel: "23 halal Anlagen, die du wirklich kaufen kannst",
    kicker: "Die Liste",
    kurzbeschreibung:
      "Aktien-ETFs, Sukuk, Edelmetalle und Krypto. Zu jeder Anlage die ISIN und die Stelle, die sie geprüft hat.",
    nutzenZeile: "Alle Halal-Anlagen auf einen Blick",
    kommentarKeyword: "LISTE",
    pdfPfad: "/downloads/halal-anlagen-liste.pdf",
    motiv: "liste",
  },
  {
    slug: "vertrags-ampel",
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
    titel: "100 bekannte Halal-Aktien",
    kicker: "Aktien-Liste",
    kurzbeschreibung:
      "Von Apple bis Nike: bekannte Marken mit Musaffa-Einzelprüfung und Fundstelle, redaktionell sortiert nach Bekanntheit.",
    nutzenZeile: "94 von 100 bekannten Aktien sind halal",
    kommentarKeyword: "AKTIE",
    pdfPfad: "/downloads/100-halal-aktien.pdf",
    motiv: "aktienPruefen",
  },
];

export const vorlageBySlug = (slug: string) => vorlagen.find((v) => v.slug === slug);
