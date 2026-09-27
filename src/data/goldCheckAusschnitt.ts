import nisab from "@/data/nisab.json";
import type { GoldFall } from "@/data/goldCheck";

/**
 * Der offene Ausschnitt des Gold-Checks. Bewusst ohne Laufzeit-Import aus `goldCheck.ts`: Die
 * offene Seite lädt nur zwei Fälle mit Urteil, alle zehn lädt erst die volle Fassung. Ein Test
 * prüft, dass die zwei hier wortgleich dort stehen. Plan Opt-in-Strecke P3: offen die Grundregel
 * und zwei Fälle, an der Kante zuerst Altgold, Goldsparplan und Gold-ETC ohne Urteil.
 */
const euro = (gramm: number) =>
  `${(Math.round((gramm * nisab.goldPreisJeGramm) / 10) * 10).toLocaleString("de-DE")} Euro`;
const preisStand = `Goldpreis vom ${nisab.stand}`;

/** Oben offen, mit Urteil, Grund und Beispiel. */
export const offen: GoldFall[] = [
  {
    id: "haendler",
    fall: "Barren und Münzen beim Händler",
    unter: "In der Filiale, bar oder mit Karte",
    farbe: "gruen",
    urteil: "Zulässig",
    grund:
      "Du zahlst und bekommst im selben Moment ein bestimmtes Stück, genau dafür ist die Regel gemacht. Mit Karte geht es auch, solange du die Zahlung nicht mehr zurückholen kannst.",
    beispiel: `Du kaufst in einer Filiale einen 10-g-Barren. Der reine Metallwert liegt bei rund ${euro(10)} (${preisStand}), dazu kommt der Aufschlag des Händlers. Du zahlst mit Girocard und nimmst den Barren mit.`,
  },
  {
    id: "raten",
    fall: "Gold auf Raten oder auf Rechnung",
    unter: "Sofort bekommen, später zahlen",
    farbe: "rot",
    urteil: "Fällt weg",
    grund:
      "Liegt das Gold bei dir und das Geld erst Tage später beim Händler, fallen Übergabe und Zahlung auseinander. Genau das verbietet die Regel, auch wenn kein Cent Zins anfällt.",
    beispiel:
      "Ein Shop bietet „Kauf auf Rechnung, zahlbar in 14 Tagen“ oder Ratenzahlung über einen Zahlungsdienst an. Du bekommst den Barren und zahlst später: fällt weg. Andersherum genauso, wenn du heute zahlst und der Barren erst in vier Wochen kommt.",
  },
];

/** An der Schnittkante: Name ja, Urteil nein. */
export const kante: Pick<GoldFall, "id" | "fall" | "unter">[] = [
  { id: "altgold", fall: "Altgold gegen neues Gold", unter: "Beim Juwelier in Zahlung geben" },
  { id: "sparplan-zertifikat", fall: "Goldsparplan mit Shariah-Zertifikat", unter: "Monatlich kaufen, von einem Gremium geprüft" },
  { id: "sparplan-ohne", fall: "Goldsparplan ohne Zertifikat", unter: "Oft mit Abschlussgebühr vorab" },
  { id: "etc", fall: "Gold-ETC mit echtem Metall", unter: "Wertpapier im Depot, physisch besichert" },
  { id: "online-lieferung", fall: "Online kaufen mit Lieferung", unter: "Shop eines Händlers, Versand nach Hause" },
  { id: "online-lagerung", fall: "Online kaufen, der Händler lagert", unter: "Tresor des Händlers oder Goldkonto" },
  { id: "zertifikat-cfd", fall: "Gold-Zertifikat, CFD, Hebelprodukt", unter: "Papier, das dem Goldpreis folgt" },
  { id: "schmuck", fall: "Goldschmuck kaufen", unter: "Ringe, Ketten, Brautschmuck" },
];

/** Zahl für Titel und Knopf, aus dem Ausschnitt gezählt (ein Test rechnet gegen die volle Datei nach). */
export const ANZAHL_FAELLE = offen.length + kante.length;
