import nisab from "@/data/nisab.json";
import type { Farbe } from "@/components/vorlagen/ampelTeile";

/**
 * Der volle Gold-Check: zehn Wege, Gold zu kaufen, je mit Urteil, Grund und Beispiel (Plan
 * Opt-in-Strecke P3, Elias 27.09.2026: „die müssen extrem Mehrwert liefern, mit klaren
 * Beispielen“). Nur die volle Fassung `GoldCheckVoll.tsx` importiert diese Datei; die offene
 * Seite lädt `goldCheckAusschnitt.ts`, ein Test hält beide gleich.
 *
 * Geprüft gegen die belegten Positionen im Fatwa-Skill (ilmCast, Folgen 15, 17, 18), Zitat mit
 * Folge und Zeitstempel je Aussage im Prüfprotokoll `~/rebrand/P3_GOLD_AUTO_PRUEFUNG.md`. Auf
 * der Seite wird kein Gelehrter namentlich zitiert (Elias' Vorgabe, `~/rebrand/WISSEN_CHECKUP.md`).
 * Beispielbeträge rechnen mit dem Goldpreis aus `nisab.json` und nennen dessen Stand.
 */
export type GoldFall = {
  id: string;
  fall: string;
  unter: string;
  farbe: Farbe;
  urteil: string;
  grund: string;
  beispiel: string;
};

const euro = (gramm: number) =>
  `${(Math.round((gramm * nisab.goldPreisJeGramm) / 10) * 10).toLocaleString("de-DE")} Euro`;
const preisStand = `Goldpreis vom ${nisab.stand}`;

export const faelle: GoldFall[] = [
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
  {
    id: "altgold",
    fall: "Altgold gegen neues Gold",
    unter: "Beim Juwelier in Zahlung geben",
    farbe: "rot",
    urteil: "Fällt weg, als ein Geschäft",
    grund:
      "Gold gegen Gold geht nur im gleichen Gewicht, egal ob Schmuck oder Barren, alt oder neu. Altgold plus Zuzahlung gegen einen Barren ist deshalb Riba, auch wenn der Juwelier es anders rechnet.",
    beispiel: `Du gibst eine 585er-Kette mit 20 g und legst Geld drauf, dafür bekommst du einen 10-g-Barren: fällt weg. Richtig sind zwei Geschäfte. Der Juwelier kauft die Kette an und zahlt dir den Betrag aus, ihr Feingoldwert liegt bei rund ${euro(20 * 0.585)} (${preisStand}). Danach kaufst du mit dem Geld den Barren, gern beim selben Juwelier.`,
  },
  {
    id: "sparplan-zertifikat",
    fall: "Goldsparplan mit Shariah-Zertifikat",
    unter: "Monatlich kaufen, von einem Gremium geprüft",
    farbe: "gruen",
    urteil: "Zulässig, wenn die Gebühren stimmen",
    grund:
      "Der Aufbau kann sauber sein: Du beauftragst den Anbieter, er kauft sofort und teilt dir das Gold zu. Das Zertifikat prüft diesen Ablauf, die Gebühren prüft es nicht, die schaust du selbst an.",
    beispiel:
      "INAIA lässt seinen Gold-Sparplan von Minhaj Shari'ah Financial Advisory in Dubai nach den AAOIFI-Kriterien prüfen. Das Gold lagert in Deutschland und der Schweiz, die Lagerung kostet 1 Euro im Monat, auf Wunsch wird geliefert. Vor dem Abschluss fragst du nach einer Abschlussgebühr: Steht ihr keine Leistung gegenüber, hilft auch das Zertifikat nicht.",
  },
  {
    id: "sparplan-ohne",
    fall: "Goldsparplan ohne Zertifikat",
    unter: "Oft mit Abschlussgebühr vorab",
    farbe: "gelb",
    urteil: "Prüfen, meist hakt es an der Gebühr",
    grund:
      "Die meisten Goldsparpläne sind nicht auf islamische Regeln ausgelegt. Der häufigste Haken ist eine Abschlussgebühr, die mit Sparsumme und Laufzeit wächst, obwohl die Leistung dieselbe bleibt.",
    beispiel:
      "Zwei Sparer, gleicher Vertrag: einer spart 50 Euro im Monat, der andere 150. Der zweite zahlt die dreifache Abschlussgebühr für dieselbe Beratung. Wird die Gebühr von den ersten Raten abgezogen, liegen nach einem halben Jahr oft erst ein, zwei Gramm im Tresor.",
  },
  {
    id: "etc",
    fall: "Gold-ETC mit echtem Metall",
    unter: "Wertpapier im Depot, physisch besichert",
    farbe: "gelb",
    urteil: "Gelehrte sind uneins",
    grund:
      "Hinter guten ETCs liegen nummerierte Barren, und ein Gremium prüft sie jedes Jahr. Ein Teil der Gelehrten lässt das gelten, ein anderer sagt, ohne Zugriff auf das Metall gibt es keine echte Übergabe.",
    beispiel:
      "Der ETC der Royal Mint lagert das Gold im eigenen Tresor in Cardiff, Privatanleger können sich Barren und Münzen ausliefern lassen, das Zertifikat kommt von Amanie Advisors. Bei den meisten anderen ETCs geht die Auslieferung nicht, und das Gremium der WisdomTree-Produkte schreibt selbst, dass erst nach zwei Tagen abgerechnet wird. Wer sichergehen will, kauft Barren oder fragt einen Gelehrten.",
  },
  {
    id: "online-lieferung",
    fall: "Online kaufen mit Lieferung",
    unter: "Shop eines Händlers, Versand nach Hause",
    farbe: "gruen",
    urteil: "Zulässig, wenn der Barren schon da ist",
    grund:
      "Online geht, wenn der Händler das Gold schon besitzt und ein bestimmtes Stück für dich verpackt. Kauft er erst nach deiner Zahlung ein, verkauft er dir etwas, das es noch nicht gibt.",
    beispiel:
      "Im Shop steht „sofort lieferbar, Versand in 1 bis 2 Werktagen“: Du zahlst per Sofortüberweisung, der Barren geht am nächsten Tag raus. Steht dort „Lieferzeit 3 bis 4 Wochen“ oder „Vorbestellung“, ist der Barren noch nicht da, dann kaufst du woanders.",
  },
  {
    id: "online-lagerung",
    fall: "Online kaufen, der Händler lagert",
    unter: "Tresor des Händlers oder Goldkonto",
    farbe: "gelb",
    urteil: "Kommt auf den Lagervertrag an",
    grund:
      "Du musst das Gold nicht in der Hand halten, es muss dir aber gehören. Sauber ist ein bestimmter Bestand auf deinen Namen, über den der Händler nicht mehr verfügen darf, heikel ist ein bloßes Lieferversprechen.",
    beispiel: `Du kaufst einen 50-g-Barren für einen Metallwert von rund ${euro(50)} (${preisStand}) und lässt ihn im Tresor des Händlers. Steht im Lagervertrag „Eigentum des Kunden“, „Sondervermögen“ oder deine Barrennummer, passt es. Steht dort nur, dass der Händler dir Gold „schuldet“ oder „liefert“, hast du einen Anspruch gekauft und kein Gold.`,
  },
  {
    id: "zertifikat-cfd",
    fall: "Gold-Zertifikat, CFD, Hebelprodukt",
    unter: "Papier, das dem Goldpreis folgt",
    farbe: "rot",
    urteil: "Fällt weg",
    grund:
      "Hier kaufst du kein Gramm Gold, sondern die Kursbewegung oder ein Zahlungsversprechen der Bank. CFDs, Futures und Hebel gelten unter Gelehrten ohne Gegenstimme als verboten.",
    beispiel:
      "Beim Broker kaufst du einen Gold-CFD mit Hebel: 500 Euro Einsatz bewegen eine Position von 10.000 Euro, über Nacht fallen Finanzierungskosten an. Gold bekommst du nie, auch nicht auf Wunsch. Ein Gold-Zertifikat ohne Metall ist eine Schuld der Bank, deren Wert dem Goldpreis folgt.",
  },
  {
    id: "schmuck",
    fall: "Goldschmuck kaufen",
    unter: "Ringe, Ketten, Brautschmuck",
    farbe: "gruen",
    urteil: "Zulässig, mit derselben Regel",
    grund:
      "Schmuck ist Gold, auch Weißgold und Roségold. Du zahlst und bekommst das Stück im selben Moment, Raten und Tausch gegen alten Schmuck mit Aufpreis fallen weg.",
    beispiel:
      "Du kaufst Brautschmuck in 22 Karat beim Juwelier, zahlst mit Karte und nimmst ihn mit: passt. Wird das Stück erst angefertigt und du zahlst vorab, gibt es beim Kauf noch nichts zu übergeben. Sauberer ist es, zu zahlen, wenn das fertige Stück vor dir liegt.",
  },
];

/** Drei Fragen vor jedem Goldkauf, nur in der vollen Fassung. */
export const fragen: { titel: string; text: string }[] = [
  {
    titel: "Liegt das Gold schon beim Verkäufer?",
    text: "Frag nach der Lieferzeit. Zwei, drei Tage sind Versand, alles darüber heißt meist, der Barren wird erst nach deiner Zahlung besorgt.",
  },
  {
    titel: "Wechseln Geld und Gold im selben Moment?",
    text: "Keine Raten, keine Rechnung, keine Anzahlung mit Rest später. Altes Gold verkaufst du vorher in einem eigenen Geschäft.",
  },
  {
    titel: "Gehört dir ein bestimmtes Stück?",
    text: "Barrennummer, Zertifikatskarte oder eine Menge, die als dein Eigentum getrennt lagert. Ein bloßes Lieferversprechen ist kein Gold.",
  },
];

/** Gut zu wissen, am Ende der vollen Fassung. */
export const gutZuWissen: { titel: string; text: string }[] = [
  {
    titel: "Silber",
    text: "Für Silber gilt alles, was hier für Gold steht. Silber gegen Gold darf ungleich sein, muss aber sofort getauscht werden.",
  },
  {
    titel: "Platin und Palladium",
    text: "Für sie gilt die Sonderregel nicht. Du kaufst sie wie jede andere Ware.",
  },
  {
    titel: "Zakat",
    text: "Gold ist Sparen, kein Investment: Es arbeitet nicht. Liegst du über dem Nisab, fallen jedes Jahr 2,5 Prozent auf den Wert an.",
  },
];
