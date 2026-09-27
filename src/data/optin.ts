import type { MotivName } from "@/components/motive";
import type { Stufe } from "@/lib/optin";
import { guides } from "@/data/guides";

/**
 * Die Bestseller, die es nur gegen E-Mail gibt (Elias, 27.09.2026, Vault raw
 * 2026-09-26-doomscroll-web/08 und 09). Alles andere bleibt offen.
 *
 * Die offene Seite zeigt einen Ausschnitt. Das Ganze liegt unter einer Adresse mit
 * `schluessel`, wie beim Guide: nicht in der Sitemap, nicht in der Navigation, noindex.
 * Seit 27.09.2026 nachmittags (Vault raw 2026-09-26-doomscroll-web/11) öffnet die Danke-Seite
 * das Freebie sofort, wie bei SKAILE; die erste Mail nach der Bestätigung (B0) bringt den Link
 * noch einmal. Die Schranke ist weich wie beim Guide: Die Schlüssel stehen im JavaScript.
 * Wer den Schlüssel ändert, macht alle verschickten Links ungültig.
 *
 * Die Texte folgen der Sprachregel in CLAUDE.md: Verb zuerst, höchstens zwei Sätze.
 */
export type FreebieId = "guide" | "top-100-halal-aktien" | "halal-anlagen" | "vertrags-ampel" | "rizq";

export type OptinFreebie = {
  id: FreebieId;
  /** Kurzname, z. B. für den Seitentitel. */
  name: string;
  /** „Du bekommst die Liste …“ (Akkusativ) */
  objekt: string;
  /** „… dann kommt deine Liste“ */
  deinObjekt: string;
  /** Überschrift der Karte, der zweite Teil ist blau. */
  ueberschrift: [string, string];
  /** Ein Satz unter der Überschrift. */
  nutzen: string;
  /** Beschriftung des Knopfs. */
  knopf: string;
  /** Frage an der Schnittkante der Ausschnitt-Seite. */
  frage: string;
  /** Die offene Seite zum Freebie. */
  seite: string;
  schluessel?: string;
  motiv?: MotivName;
};

export const optinFreebies: OptinFreebie[] = [
  {
    id: "guide",
    name: "Halal Investment Guide",
    objekt: "den Guide",
    deinObjekt: "dein Guide",
    ueberschrift: ["Dein Guide in", "unter 30 Sekunden"],
    nutzen: "Lerne in deiner Stufe, wie du halal anlegst: Grundlagen, Prüfung und der erste Schritt.",
    knopf: "Guide holen",
    frage: "Du willst den Guide?",
    seite: "/halal-guide",
  },
  {
    id: "top-100-halal-aktien",
    name: "100 Halal-Aktien",
    objekt: "die Liste",
    deinObjekt: "deine Liste",
    ueberschrift: ["Hol dir die ganze Liste:", "100 bekannte Aktien"],
    nutzen: "Sieh alle 100 Titel mit Prüfergebnis, von Apple bis Nike, mit Stand und Fundstelle.",
    knopf: "Liste holen",
    frage: "Ist deine Aktie dabei?",
    seite: "/vorlagen/top-100-halal-aktien",
    schluessel: "voll-8mq4",
    motiv: "aktienPruefen",
  },
  {
    id: "halal-anlagen",
    name: "Halal-Anlagen",
    objekt: "die Liste",
    deinObjekt: "deine Liste",
    ueberschrift: ["Hol dir alle", "Halal-Anlagen"],
    nutzen: "Finde jede Anlage, die du wirklich kaufen kannst, mit ISIN und Prüfstelle.",
    knopf: "Liste holen",
    frage: "Du willst die ganze Liste?",
    seite: "/vorlagen/halal-anlagen",
    schluessel: "voll-3tz9",
    motiv: "liste",
  },
  {
    id: "vertrags-ampel",
    name: "Vertrags-Ampel",
    objekt: "die Ampel",
    deinObjekt: "deine Ampel",
    ueberschrift: ["Hol dir die", "Vertrags-Ampel"],
    nutzen: "Sieh auf einen Blick, welcher Vertrag grün, gelb oder rot ist, und die Bedingung dahinter.",
    knopf: "Ampel holen",
    frage: "Welche Farbe hat dein Vertrag?",
    seite: "/vorlagen/vertrags-ampel",
    schluessel: "voll-6kd2",
    motiv: "ampel",
  },
  {
    id: "rizq",
    name: "Duas für Rizq",
    objekt: "die Duas",
    deinObjekt: "deine Duas",
    ueberschrift: ["Hol dir alle", "14 Duas für Rizq"],
    nutzen: "Lies jedes Bittgebet mit Arabisch, Übersetzung und Fundstelle.",
    knopf: "Duas holen",
    frage: "Welche Dua suchst du?",
    seite: "/vorlagen/rizq",
    schluessel: "voll-9pw5",
    motiv: "kompass",
  },
];

export const optinFreebie = (id?: string) => optinFreebies.find((f) => f.id === id);

/** Eine Vorlage ist gesperrt, wenn sie hier mit Schlüssel steht. */
export const istGesperrt = (slug: string) => optinFreebies.some((f) => f.id === slug && f.schluessel);

/** Adresse der vollen Fassung. Beim Guide entscheidet die Stufe, ohne Stufe der Einsteiger. */
export const vollPfad = (f: OptinFreebie, stufe?: Stufe) => {
  if (f.id === "guide") {
    const g = guides.find((x) => x.stufe === (stufe ?? "einsteiger")) ?? guides[0];
    return `/dein-guide/${g.schluessel}`;
  }
  return `/vorlagen/${f.id}/${f.schluessel}`;
};

/** Alle Adressen, die als Datei existieren müssen, aber nicht in den Index gehören. */
export const optinAdressen = (): string[] => [
  ...optinFreebies.map((f) => `/gratis/${f.id}`),
  ...optinFreebies.map((f) => `/danke/${f.id}`),
  ...optinFreebies.filter((f) => f.schluessel).map((f) => vollPfad(f)),
];
