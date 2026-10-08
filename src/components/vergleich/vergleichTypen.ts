/**
 * Gemeinsame Form fuer alle Vergleiche.
 *
 * Depot und Girokonto liefern dieselbe Struktur, deshalb rendern beide mit
 * denselben Bausteinen: auf dem Laptop die gedrehte Tabelle, auf dem Handy
 * die Kartenliste. Ein dritter Vergleich braucht nur diese Form zu erfuellen.
 *
 * Alles, was noch nicht recherchiert ist, bleibt `null`. Die Bausteine machen
 * daraus woertlich "noch nicht geprueft" bzw. einen sichtbaren Platzhalter.
 * Nichts schaetzen.
 */

/** Ampel-Status eines Halal-Merkmals. "unbekannt" = noch nicht geprueft. */
export type CheckStatus = "unbekannt" | "gut" | "teils" | "schlecht";

export type ZeilenArt =
  /** Freitext, z. B. "0 €". null wird zu "noch nicht geprueft". */
  | "text"
  /** Punkt in Ampelfarbe plus Wort. Nur fuer Halal-Merkmale. */
  | "ampel"
  /** Haken oder Kreuz. null wird zu einem grauen Strich. */
  | "janein";

export type VergleichsZeile = {
  key: string;
  label: string;
  art: ZeilenArt;
  /** Erklaerung hinter dem kleinen i. */
  hinweis?: string;
  /** Steht in der Kartenansicht im Viererraster ganz oben. Genau vier. */
  imRaster?: boolean;
  /** Trennt die Halal-Merkmale von den Konditionen. */
  gruppe: "halal" | "angebot" | "kosten";
};

/**
 * Woher ein Wert stammt. Mit `anzeige` steht die Quelle samt Stand klein beim aufgeklappten
 * Angebot, ohne bleibt sie im Hintergrund.
 */
export type Quelle = { url?: string; stand?: string; hinweis?: string; anzeige?: string };

export type Zellwert = {
  text: string | null;
  quelle?: Quelle;
  status?: CheckStatus;
  /** true, false oder null fuer noch nicht geprueft. */
  jaNein?: boolean | null;
  /** Satz zur Ampel, steht beim aufgeklappten Angebot: was der Besucher tun oder lassen muss. */
  zusatz?: string;
};

export type VergleichsSpalte = {
  id: string;
  /** Name des Anbieters, steht im Logofeld. */
  anbieter: string;
  domain?: string;
  /** Name des Produkts, z. B. "Free Broker". */
  produkt: string;
  /** Nur setzen, wenn eine Partnerschaft besteht. Sonst Knopf ausgegraut. */
  link?: string;
  /**
   * Gesamtnote von 0 bis 5. `null` heisst: noch nicht bewertet. Dann stehen
   * dort fuenf leere Sterne und der Satz dazu. Eine Note wird erst vergeben,
   * wenn alle Halal-Merkmale geprueft sind, sonst bewertet sie Nichtwissen.
   */
  note: number | null;
  /** Monat und Jahr der Bewertung, z. B. "08/2026". */
  noteStand?: string;
  /** Etikett ueber der Spalte, z. B. "Bester Broker" oder "60 € Bonus". */
  etikett?: { text: string; ton: "empfehlung" | "bonus" | "hinweis" | "platz" } | null;
  /**
   * Von diesem Anbieter raten wir ab, weil ein Zins-Merkmal rot ist. Er steht
   * am Ende der Liste, wird rot umrandet und bekommt keinen Partnerlink
   * (Elias, 16.09.2026).
   */
  abgeraten?: boolean;
  /** Kostenpflichtiger Tarif: Marke am Produktnamen und ein Satz, was man für die Gebühr bekommt. */
  tarif?: { marke: string; satz: string } | null;
  werte: Record<string, Zellwert>;
};

/** Zelle ohne Angabe: ein Strich, nie ein Wort über den Stand der Prüfung (Elias, 05.10.2026). */
export const KEINE_ANGABE = "–";

/** Wort zur Note, wie man es aus Vergleichen kennt. */
export const noteWort = (note: number | null) => {
  if (note === null) return "–";
  if (note >= 4.5) return "Sehr gut";
  if (note >= 3.5) return "Gut";
  if (note >= 2.5) return "Befriedigend";
  if (note >= 1.5) return "Ausreichend";
  return "Mangelhaft";
};

/** Note mit Komma, wie im Deutschen ueblich. */
export const noteZahl = (note: number | null) =>
  note === null ? null : note.toFixed(1).replace(".", ",");

/** Quelle und Stand, wie sie beim aufgeklappten Angebot stehen. */
export const quellenText = (q: Quelle) => `${q.anzeige}${q.stand ? `, Stand ${q.stand}` : ""}`;

/** Was nur beim aufgeklappten Angebot steht: der Satz zur Zins-Ampel und die Quellen der Werte. */
export const einzelheiten = (spalte: VergleichsSpalte, zeilen: VergleichsZeile[]) => {
  const zinsZeile = zeilen.find((z) => spalte.werte[z.key]?.zusatz);
  return {
    zins: zinsZeile ? { label: zinsZeile.label, satz: spalte.werte[zinsZeile.key].zusatz! } : null,
    quellen: zeilen.flatMap((z) => {
      const w = spalte.werte[z.key];
      return w?.text && w.quelle?.anzeige ? [{ key: z.key, label: z.label, quelle: w.quelle }] : [];
    }),
  };
};

/** Trägt das Angebot etwas, das erst aufgeklappt zu sehen ist? */
export const hatEinzelheiten = (spalte: VergleichsSpalte, zeilen: VergleichsZeile[]) => {
  const e = einzelheiten(spalte, zeilen);
  return Boolean(e.zins) || e.quellen.length > 0;
};
