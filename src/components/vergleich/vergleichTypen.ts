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
  /** Kurzform fuer Tabelle und Karten (`src/data/kostenKurz.ts`); `text` bleibt der ganze Satz. */
  kurz?: string;
  quelle?: Quelle;
  status?: CheckStatus;
  /** true, false oder null fuer noch nicht geprueft. */
  jaNein?: boolean | null;
  /** Satz zur Ampel, steht beim aufgeklappten Angebot: was der Besucher tun oder lassen muss. */
  zusatz?: string;
  /** Eigene Achtung-Meldung, die es nur bei wenigen Angeboten gibt (automatischer Kredit). Steht beim aufgeklappten Angebot. */
  achtung?: string;
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
  /** Führt das Haus mehrere Produkte: was dieses von den anderen unterscheidet, mit Beleg (`produktUnterschiede.ts`). */
  unterschied?: { titel: string; satz: string } | null;
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
    achtung: zeilen.map((z) => spalte.werte[z.key]?.achtung).find(Boolean) ?? null,
    quellen: zeilen.flatMap((z) => {
      const w = spalte.werte[z.key];
      return w?.text && w.quelle?.anzeige ? [{ key: z.key, label: z.label, quelle: w.quelle }] : [];
    }),
  };
};

/** Ein Hinweis, der eine Ausnahme am Angebot erklärt. Im Hauptvergleich steht dafür nur das Zeichen. */
export type AngebotsHinweis = { art: "achtung" | "tarif" | "zins" | "unterschied"; titel: string; text: string };

/** Ein Tarif oder ein Unterschied zwischen Produkten ist keine Warnung: violett mit „?“. Gelb mit „!“ bleibt für Warnungen. */
export const istVorteil = (h: AngebotsHinweis) => h.art === "tarif" || h.art === "unterschied";

/**
 * Ein Zeichen („!“ oder „?“) trägt nur die Ausnahme, die ein einzelnes Angebot betrifft: automatischer Kredit,
 * Zinsen zum Abschalten, kostenpflichtiger Tarif. Der Unterschied zwischen den Produkten eines Hauses ist keine
 * Ausnahme, er steht ohne Zeichen beim geöffneten Angebot. Elias, 13.10.2026: „nur wenn sie relevant oder
 * Ausnahmen widerspiegeln“, „jetzt nicht alles voll mit diesem Fragezeichen“.
 */
export const hatZeichen = (h: AngebotsHinweis) => h.art !== "unterschied";

/** Was ein Premium-Tarif zusätzlich sagt (Elias, 12.10.2026): der Ton, kein Vorteil. */
export const TARIF_ERNSTER = "Hilfreich, wenn du das Ganze etwas ernster nehmen möchtest.";

/**
 * Die Ausnahmen eines Angebots: automatischer Kredit (Achtung), kostenpflichtiger Tarif, eine
 * Zins-Ampel auf „teils“, bei der der Besucher etwas abschalten muss, und der Unterschied zu den anderen
 * Produkten desselben Hauses. Hat ein Angebot eine davon,
 * steht beim aufgeklappten Angebot der markierte Hinweis mit dem Zeichen „!“. Im Hauptvergleich
 * steht das Zeichen nicht (Elias, 12.10.2026 nachts). Eine grüne Ampel mit „Du musst nichts einstellen“ ist keine Ausnahme.
 */
export const hinweiseAmAngebot = (spalte: VergleichsSpalte, zeilen: VergleichsZeile[]): AngebotsHinweis[] => {
  const liste: AngebotsHinweis[] = [];
  const e = einzelheiten(spalte, zeilen);
  if (e.achtung) liste.push({ art: "achtung", titel: "Achtung", text: e.achtung });
  if (spalte.tarif) {
    liste.push({ art: "tarif", titel: spalte.tarif.marke, text: `${spalte.tarif.satz} ${TARIF_ERNSTER}` });
  }
  const zinsZeile = zeilen.find((z) => spalte.werte[z.key]?.zusatz && spalte.werte[z.key]?.status === "teils");
  if (zinsZeile) liste.push({ art: "zins", titel: zinsZeile.label, text: spalte.werte[zinsZeile.key].zusatz! });
  if (spalte.unterschied) liste.push({ art: "unterschied", titel: spalte.unterschied.titel, text: spalte.unterschied.satz });
  return liste;
};

/** Trägt das Angebot etwas, das erst aufgeklappt zu sehen ist? */
export const hatEinzelheiten = (spalte: VergleichsSpalte, zeilen: VergleichsZeile[]) => {
  const e = einzelheiten(spalte, zeilen);
  return Boolean(e.zins) || Boolean(e.achtung) || Boolean(spalte.tarif) || Boolean(spalte.unterschied) || e.quellen.length > 0;
};
