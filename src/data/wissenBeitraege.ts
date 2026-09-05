import type { MotivName } from "@/components/motive";

/**
 * Das eine Register aller Wissensbeiträge. Reihenfolge = Anzeigereihenfolge
 * auf /wissen und Reihenfolge für "Weiterlesen" am Ende jedes Beitrags.
 *
 * Wer einen Beitrag anlegt, trägt ihn hier ein. Die Übersicht, die
 * Vor/Zurück-Navigation und die Suche lesen alle aus dieser Liste.
 */
export type WissenThema = "Grundlagen" | "Investieren" | "Alltag" | "Pflichten";

export type WissenBeitrag = {
  slug: string;
  /** Kurzer Name für Karten und Navigation. */
  name: string;
  /** Ein Satz, beginnt mit einem Verb. Höchstens zwei Sätze. */
  desc: string;
  thema: WissenThema;
  motiv: MotivName;
  /** Beitrag ist noch nicht online: erscheint als "bald" ohne Link. */
  bald?: boolean;
  /** Frisch veröffentlicht: violettes Etikett auf der Übersicht. */
  neu?: boolean;
};

export const wissenBeitraege: WissenBeitrag[] = [
  { slug: "zinsen-im-islam", name: "Zinsen im Islam", motiv: "zins", desc: "Verstehe, was verboten ist und was ausdrücklich nicht.", thema: "Grundlagen" },
  { slug: "gharar", name: "Was ist Gharar", motiv: "gharar", desc: "Prüf jeden Vertrag an vier Fragen.", thema: "Grundlagen" },
  { slug: "maysir", name: "Glücksspiel (Maysir)", motiv: "maysir", desc: "Sieh, wo Investieren zur Wette wird.", thema: "Grundlagen" },
  { slug: "haeufige-fehler", name: "Die häufigsten Fehler", motiv: "fehler", desc: "Umgeh zwölf Stolperfallen, die am Anfang Geld kosten.", thema: "Grundlagen" },
  { slug: "trading-forex-cfd", name: "Trading, Forex und CFDs", motiv: "trading", desc: "Sieh, warum Hebel, Swap und Short kein Handel sind.", thema: "Grundlagen", neu: true, bald: true },

  { slug: "halal-etfs", name: "Halal ETFs", motiv: "etf", desc: "Prüf einen Fonds an vier Fragen.", thema: "Investieren" },
  { slug: "sind-aktien-halal", name: "Aktien richtig prüfen", motiv: "aktienPruefen", desc: "Lerne die zwei Ebenen und drei Grenzwerte kennen.", thema: "Investieren" },
  { slug: "ertraege-reinigen", name: "Aktienbereinigung", motiv: "reinigen", desc: "Rechne aus, welchen Anteil du weitergibst, und wer es für dich macht.", thema: "Investieren" },
  { slug: "sukuk", name: "Sukuk", motiv: "sukuk", desc: "Sieh, was hinter islamischen Anleihen steckt.", thema: "Investieren" },
  { slug: "halal-gold-kaufen", name: "Gold kaufen", motiv: "gold", desc: "Kauf Gold richtig: Händler, online oder Sparplan.", thema: "Investieren" },
  { slug: "ist-bitcoin-halal", name: "Krypto", motiv: "krypto", desc: "Verstehe die drei Kategorien und den echten Streitpunkt.", thema: "Investieren" },

  { slug: "girokonto-ohne-zinsen", name: "Girokonto ohne Zinsen", motiv: "karte", desc: "Stell dein Konto in zehn Minuten um.", thema: "Alltag" },
  { slug: "kreditkarte-halal", name: "Kreditkarte", motiv: "karteSicher", desc: "Erkenne, welche Karte du unterschreibst.", thema: "Alltag", neu: true, bald: true },
  { slug: "dispo-und-schulden", name: "Dispo und Schulden", motiv: "dispo", desc: "Komm in zwei Wegen aus dem Minus.", thema: "Alltag", neu: true, bald: true },
  { slug: "halal-kredit-ohne-zinsen", name: "Kredit ohne Zinsen", motiv: "kredit", desc: "Sieh, welche Verträge einen Kredit ersetzen.", thema: "Alltag" },
  { slug: "ratenzahlung-haram", name: "Ratenkauf", motiv: "raten", desc: "Prüf an der Kasse, wann Raten zur Zinsfalle werden.", thema: "Alltag" },
  { slug: "auto-kaufen-ohne-zinsen", name: "Auto kaufen ohne Zinsen", motiv: "auto", desc: "Finde den Weg, der ohne Bank auskommt.", thema: "Alltag", neu: true, bald: true },
  { slug: "ist-leasing-haram", name: "Leasing", motiv: "auto", desc: "Prüf deinen Vertrag an fünf Punkten.", thema: "Alltag" },
  { slug: "haus-kaufen-ohne-zinsen", name: "Haus kaufen ohne Zinsen", motiv: "haus", desc: "Die drei Wege, ein Haus ohne Zinsen zu finanzieren.", thema: "Alltag" },
  { slug: "ist-versicherung-haram", name: "Versicherung", motiv: "versicherung", desc: "Sieh, welche Versicherung Pflicht ist und welche nicht.", thema: "Alltag" },

  { slug: "nisab", name: "Nisab verstehen", motiv: "nisab", desc: "Sieh, ab welchem Vermögen Zakat fällig wird.", thema: "Pflichten" },
  { slug: "zakat-auf-aktien-etf-krypto", name: "Zakat auf Aktien und ETFs", motiv: "zakat", desc: "Rechne aus, was dein Depot an Zakat kostet.", thema: "Pflichten", neu: true, bald: true },
  { slug: "erbe", name: "Erbe nach islamischem Recht", motiv: "erbe", desc: "Regel dein Erbe, bevor deutsches Recht es tut.", thema: "Pflichten" },
];

export const beitragBySlug = (slug: string) => wissenBeitraege.find((b) => b.slug === slug);

/** Vorheriger und nächster Beitrag in der Liste, nur fertige. */
export const nachbarn = (slug: string) => {
  const fertig = wissenBeitraege.filter((b) => !b.bald);
  const i = fertig.findIndex((b) => b.slug === slug);
  if (i < 0) return { vorher: undefined, nachher: undefined };
  return {
    vorher: i > 0 ? fertig[i - 1] : undefined,
    nachher: i < fertig.length - 1 ? fertig[i + 1] : undefined,
  };
};

export const themen: { thema: WissenThema; id: string; satz: string }[] = [
  { thema: "Grundlagen", id: "grundlagen", satz: "Die Begriffe, ohne die alles andere schwer zu verstehen ist." },
  { thema: "Investieren", id: "investieren", satz: "Wie du dein Geld anlegst, ohne gegen deine Überzeugung zu handeln." },
  { thema: "Alltag", id: "alltag", satz: "Verträge, die dir im normalen Leben begegnen, vom Konto bis zum Auto." },
  { thema: "Pflichten", id: "pflichten", satz: "Was der Islam an Abgaben und Regeln vorsieht, und wie du es ausrechnest." },
];
