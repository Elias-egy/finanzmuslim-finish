import type { Anlage } from "@/data/halalAnlagen";

/**
 * Gruppen der Anlagenliste. Jede Art bekommt eine eigene Überschrift und nur
 * die Spalten, in denen sie Werte hat. Eine Münze hat keine Kosten, keine
 * Fondsgröße und keine Ertragsverwendung, deshalb zeigt die Krypto-Gruppe
 * diese Spalten gar nicht statt drei leere Felder.
 */
export type GruppenKey =
  | "aktien-passiv"
  | "aktien-aktiv"
  | "sukuk"
  | "gold"
  | "silber"
  | "krypto";

export type Gruppe = {
  key: GruppenKey;
  titel: string;
  /** Kurzer Satz unter der Überschrift, höchstens eine Zeile. */
  zusatz?: string;
  passt: (a: Anlage) => boolean;
  kosten: boolean;
  groesse: boolean;
  ertrag: boolean;
  /** Hilfe-Symbol für passiv oder aktiv nur an den Fonds-Gruppen. */
  bauartHilfe?: boolean;
};

export const gruppen: Gruppe[] = [
  {
    key: "aktien-passiv",
    titel: "Aktien-ETF",
    zusatz: "passiv, bilden eine Liste geprüfter Firmen nach",
    passt: (a) => a.kategorie === "aktien" && a.bauart !== "aktiv",
    kosten: true,
    groesse: true,
    ertrag: true,
    bauartHilfe: true,
  },
  {
    key: "aktien-aktiv",
    titel: "Aktive Fonds",
    zusatz: "ein Team wählt die Firmen aus, deshalb teurer",
    passt: (a) => a.kategorie === "aktien" && a.bauart === "aktiv",
    kosten: true,
    groesse: true,
    ertrag: true,
    bauartHilfe: true,
  },
  {
    key: "sukuk",
    titel: "Sukuk",
    passt: (a) => a.kategorie === "sukuk",
    kosten: true,
    groesse: true,
    ertrag: true,
  },
  {
    key: "gold",
    titel: "Gold",
    passt: (a) => a.kategorie === "gold",
    kosten: true,
    groesse: true,
    ertrag: false,
  },
  {
    key: "silber",
    titel: "Silber",
    passt: (a) => a.kategorie === "silber",
    kosten: true,
    groesse: true,
    ertrag: false,
  },
  {
    key: "krypto",
    titel: "Krypto",
    zusatz: "ohne ISIN, ohne laufende Kosten",
    passt: (a) => a.kategorie === "krypto",
    kosten: false,
    groesse: false,
    ertrag: false,
  },
];

/** Teilt eine bereits sortierte Liste in Gruppen. Leere Gruppen fallen weg. */
export const inGruppen = (liste: Anlage[]) =>
  gruppen
    .map((g) => ({ gruppe: g, anlagen: liste.filter(g.passt) }))
    .filter((x) => x.anlagen.length > 0);
