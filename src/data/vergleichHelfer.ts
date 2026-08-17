import type {
  CheckStatus,
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
 *   keinGuthabenzins: "gut"    Ampel
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
};

const ampelText: Record<CheckStatus, string> = {
  unbekannt: "",
  gut: "erfüllt",
  teils: "teilweise",
  schlecht: "nicht erfüllt",
};

const istStatus = (w: RohWert): w is CheckStatus =>
  w === "gut" || w === "teils" || w === "schlecht" || w === "unbekannt";

/** Macht aus einem Roheintrag die Zelle, passend zur Art der Zeile. */
const zuZelle = (roh: RohWert, art: string): Zellwert => {
  if (art === "ampel") {
    const status = istStatus(roh) ? roh : "unbekannt";
    return { status, text: ampelText[status] };
  }
  if (art === "janein") {
    return { text: null, jaNein: typeof roh === "boolean" ? roh : null };
  }
  return { text: typeof roh === "string" && roh.trim() !== "" ? roh : null };
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
      werte[z.key] = zuZelle(a.werte[z.key] ?? null, z.art);
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

/** Zählt, bei wie vielen Anbietern überhaupt etwas geprüft ist. */
export const anzahlGeprueft = (anbieter: RohAnbieter[]) =>
  anbieter.filter((a) => Object.values(a.werte).some((w) => w !== null && w !== "unbekannt"))
    .length;

/** Die Halal-Zeilen einer Liste, für Filter und Zählungen. */
export const halalZeilen = (zeilen: VergleichsZeile[]) =>
  zeilen.filter((z) => z.gruppe === "halal" && z.art === "ampel");
