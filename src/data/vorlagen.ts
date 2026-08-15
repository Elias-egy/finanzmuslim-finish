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
    titel: "21 halal Anlagen, die du wirklich kaufen kannst",
    kicker: "Die Liste",
    kurzbeschreibung:
      "Aktien-ETFs, Sukuk, Gold, Silber und Krypto. Zu jeder Anlage die ISIN und die Stelle, die sie geprüft hat.",
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
    kommentarKeyword: "AMPEL",
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
];

export const vorlageBySlug = (slug: string) => vorlagen.find((v) => v.slug === slug);
