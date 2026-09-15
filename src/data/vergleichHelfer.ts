import type {
  CheckStatus,
  Quelle,
  VergleichsSpalte,
  VergleichsZeile,
  Zellwert,
} from "@/components/vergleich/vergleichTypen";

/**
 * Bindeglied zwischen den Datendateien und den Bausteinen.
 *
 * In den Datendateien steht je Anbieter ein flaches Verzeichnis: Schlüssel der
 * Zeile, dahinter der Wert. Welcher Typ das ist, ergibt sich aus der Zeile
 * selbst, nicht aus der Schreibweise beim Eintragen. Damit ist das Ausfüllen so
 * einfach wie möglich:
 *
 *   depotgebuehr: "0 €"        Text
 *   zinsfreiAbStart: "gut"     Ampel
 *   xetra: true                Haken
 *   irgendwas: null            noch nicht geprüft
 */
export type RohWert = string | boolean | CheckStatus | null;

export type RohAnbieter = {
  id: string;
  /** Name des Anbieters. Steht im Logofeld. */
  name: string;
  /** Name des Produkts, z. B. "Free Broker". */
  produkt: string;
  domain?: string;
  /** Nur setzen, wenn eine Partnerschaft besteht. Sonst Knopf ausgegraut. */
  link?: string;
  /**
   * Note von 0 bis 5. Bleibt `null`, solange nicht alle Halal-Merkmale
   * geprüft sind. Eine Note auf halber Datenlage bewertet Nichtwissen.
   */
  note?: number | null;
  noteStand?: string;
  etikett?: { text: string; ton: "empfehlung" | "bonus" | "hinweis" } | null;
  werte: Record<string, RohWert>;
  /** Beleg je Wert: Finanzfluss-Vergleich oder Seite des Anbieters, mit Prüfdatum. */
  quellen?: Record<string, Quelle>;
  /** Anbieterhaus, dessen Halal-Fakten für alle seine Produkte gelten. */
  haus?: string;
  /** Herkunft im Finanzfluss-Vergleich, für Abgleich und Partnerliste. */
  finanzfluss?: { produkt: string; partnerlink: string | null };
  /** Finanzpunkte je Kriterium nach der Punktetabelle von Finanzfluss. */
  finanzPunkte?: Record<string, number>;
  /**
   * Gewichtete Halal-Anlagen je Zeile, nur bei "x von N": Fonds ohne
   * Ausgabeaufschlag 1, mit Rabatt 0,75, voll 0,5, börsengehandelte Papiere 1.
   * null heißt: ein kaufbarer Fonds hat einen unklaren Aufschlag, keine Note.
   */
  halalAnlagenPunkte?: Record<string, number | null>;
};

const ampelText: Record<CheckStatus, string> = {
  unbekannt: "",
  gut: "erfüllt",
  teils: "abschaltbar",
  schlecht: "nicht erfüllt",
};

const istStatus = (w: RohWert): w is CheckStatus =>
  w === "gut" || w === "teils" || w === "schlecht" || w === "unbekannt";

/** Macht aus einem Roheintrag die Zelle, passend zur Art der Zeile. */
const zuZelle = (roh: RohWert, art: string, quelle?: Quelle): Zellwert => {
  if (art === "ampel") {
    const status = istStatus(roh) ? roh : "unbekannt";
    return { status, text: ampelText[status], quelle: status === "unbekannt" ? undefined : quelle };
  }
  if (art === "janein") {
    const jaNein = typeof roh === "boolean" ? roh : null;
    return { text: null, jaNein, quelle: jaNein === null ? undefined : quelle };
  }
  const text = typeof roh === "string" && roh.trim() !== "" ? roh : null;
  return { text, quelle: text === null ? undefined : quelle };
};

/** Baut aus Rohdaten und Zeilenliste die Spalten für Tabelle und Karten. */
export const baueSpalten = (
  anbieter: RohAnbieter[],
  zeilen: VergleichsZeile[],
): VergleichsSpalte[] =>
  anbieter.map((a) => {
    const werte: Record<string, Zellwert> = {};
    for (const z of zeilen) {
      if (z.key.startsWith("__")) continue;
      werte[z.key] = zuZelle(a.werte[z.key] ?? null, z.art, a.quellen?.[z.key]);
    }
    return {
      id: a.id,
      anbieter: a.name,
      domain: a.domain,
      produkt: a.produkt,
      link: a.link,
      note: a.note ?? null,
      noteStand: a.noteStand,
      etikett: a.etikett ?? null,
      werte,
    };
  });

/** Zählt, bei wie vielen Anbietern alle Halal-Merkmale geprüft sind. */
export const anzahlHalalGeprueft = (anbieter: RohAnbieter[], zeilen: VergleichsZeile[]) => {
  const halal = zeilen.filter((z) => z.gruppe === "halal");
  return anbieter.filter((a) =>
    halal.every((z) => {
      const w = a.werte[z.key];
      return w !== null && w !== undefined && w !== "unbekannt";
    }),
  ).length;
};

/** Die Halal-Zeilen einer Liste, für Filter und Zählungen. */
export const halalZeilen = (zeilen: VergleichsZeile[]) =>
  zeilen.filter((z) => z.gruppe === "halal" && z.art === "ampel");
