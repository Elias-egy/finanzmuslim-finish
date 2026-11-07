import type { MotivName } from "@/components/motive";

/**
 * Das eine Register aller Wissensbeiträge. Reihenfolge = Anzeigereihenfolge
 * auf /blog und Reihenfolge für "Weiterlesen" am Ende jedes Beitrags.
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
  /** Eigene Adresse, wenn sie nicht /blog/<slug> ist (halal-etf, sind-aktien-haram, sind-versicherungen-haram). */
  pfad?: string;
  /** Sichtbares Datum auf der Blog-Übersicht: dateModified der Seite, sonst datePublished (Test hält beides gleich). */
  datum: string;
};

/** Adresse eines Beitrags: eigene oder /blog/<slug>. */
export const beitragPfad = (b: WissenBeitrag) => b.pfad ?? `/blog/${b.slug}`;

/* Reihenfolge nach dem Leser (SEO43, Vault-Skill leser-finanzmuslim): zuerst Geld anlegen, dann das Girokonto,
   Grundbegriffe und Pflichten danach; Bereinigung und Krypto nie oben („Krypto, wird eh nicht so oft gesucht“). */
export const wissenBeitraege: WissenBeitrag[] = [
  { slug: "halal-etfs", name: "Beste Halal ETFs 2026", motiv: "etf", desc: "Sieh, was in acht Halal ETFs steckt, was sie gebracht haben und was sie in Euro kosten.", thema: "Investieren", pfad: "/blog/halal-etf", datum: "3. November 2026" },
  { slug: "sind-aktien-halal", name: "Sind Aktien haram?", motiv: "aktienPruefen", desc: "Sieh, wann Aktien halal sind und wer das für dich prüft. Rechne, was 100 € im Monat im Halal ETF gebracht hätten.", thema: "Investieren", pfad: "/blog/sind-aktien-haram", datum: "6. November 2026" },
  { slug: "halal-gold-kaufen", name: "Halal Gold kaufen", motiv: "gold", desc: "Kauf Gold richtig: Händler, online oder Sparplan.", thema: "Investieren", datum: "4. November 2026" },
  { slug: "sukuk", name: "Sukuk", motiv: "sukuk", desc: "Sieh, was hinter islamischen Anleihen steckt.", thema: "Investieren", datum: "5. September 2026" },
  { slug: "ist-bitcoin-halal", name: "Ist Bitcoin halal?", motiv: "krypto", desc: "Verstehe die drei Kategorien und den echten Streitpunkt.", thema: "Investieren", datum: "5. September 2026" },
  { slug: "ertraege-reinigen", name: "Dividenden reinigen", motiv: "reinigen", desc: "Rechne aus, welchen Anteil du weitergibst, und wer es für dich macht.", thema: "Investieren", datum: "5. September 2026" },

  { slug: "girokonto-ohne-zinsen", name: "Girokonto ohne Zinsen", motiv: "karte", desc: "Stell dein Konto in zehn Minuten um.", thema: "Alltag", datum: "5. September 2026" },
  { slug: "kreditkarte-halal", name: "Ist die Kreditkarte haram?", motiv: "karteSicher", desc: "Erkenne, welche Karte du unterschreibst.", thema: "Alltag", datum: "5. September 2026" },
  { slug: "dispo-und-schulden", name: "Dispo und Schulden", motiv: "dispo", desc: "Komm in zwei Wegen aus dem Minus.", thema: "Alltag", datum: "5. September 2026" },
  { slug: "halal-kredit-ohne-zinsen", name: "Halal Kredit", motiv: "kredit", pfad: "/blog/halal-kredit", desc: "Sieh, was statt Kredit erlaubt ist, und rechne, was Sparen bringt.", thema: "Alltag", datum: "7. November 2026" },
  { slug: "ratenzahlung-haram", name: "Ist Ratenzahlung haram?", motiv: "raten", desc: "Prüf an der Kasse, wann Raten zur Zinsfalle werden.", thema: "Alltag", datum: "5. September 2026" },
  { slug: "auto-kaufen-ohne-zinsen", name: "Auto kaufen ohne Zinsen", motiv: "auto", desc: "Finde den Weg, der ohne Bank auskommt.", thema: "Alltag", datum: "5. September 2026" },
  { slug: "ist-leasing-haram", name: "Ist Leasing haram?", motiv: "auto", desc: "Prüf deinen Vertrag an fünf Punkten. Rechne, was deine Rate im Depot gebracht hätte.", thema: "Alltag", datum: "5. November 2026" },
  { slug: "haus-kaufen-ohne-zinsen", name: "Haus kaufen ohne Zinsen", motiv: "haus", desc: "Sieh drei Wege, ein Haus ohne Zinsen zu finanzieren.", thema: "Alltag", datum: "5. September 2026" },
  { slug: "ist-versicherung-haram", name: "Sind Versicherungen haram?", motiv: "versicherung", pfad: "/blog/sind-versicherungen-haram", desc: "Sieh, welche Versicherung Pflicht ist und welche nicht. Rechne, was dein Beitrag halal angelegt gebracht hätte.", thema: "Alltag", datum: "6. November 2026" },

  { slug: "zinsen-im-islam", name: "Zinsen im Islam", motiv: "zins", desc: "Verstehe, was verboten ist und was ausdrücklich nicht.", thema: "Grundlagen", datum: "5. September 2026" },
  { slug: "haeufige-fehler", name: "12 Fehler beim halal Investieren", motiv: "fehler", desc: "Umgeh zwölf Stolperfallen, die am Anfang Geld kosten.", thema: "Grundlagen", datum: "5. September 2026" },
  { slug: "gharar", name: "Was ist Gharar", motiv: "gharar", desc: "Prüf jeden Vertrag an vier Fragen.", thema: "Grundlagen", datum: "5. September 2026" },
  { slug: "maysir", name: "Glücksspiel (Maysir)", motiv: "maysir", desc: "Sieh, wo Investieren zur Wette wird.", thema: "Grundlagen", datum: "5. September 2026" },
  { slug: "trading-forex-cfd", name: "Trading, Forex und CFDs", motiv: "trading", desc: "Sieh, warum Hebel, Swap und Short kein Handel sind.", thema: "Grundlagen", datum: "5. September 2026" },

  { slug: "zakat-auf-aktien-etf-krypto", name: "Zakat auf Aktien und ETFs", motiv: "zakat", desc: "Rechne aus, was dein Depot an Zakat kostet.", thema: "Pflichten", datum: "5. September 2026" },
  { slug: "nisab", name: "Nisab verstehen", motiv: "nisab", desc: "Sieh, ab welchem Vermögen Zakat fällig wird.", thema: "Pflichten", datum: "5. September 2026" },
  { slug: "erbe", name: "Erbe nach islamischem Recht", motiv: "erbe", desc: "Regel dein Erbe, bevor deutsches Recht es tut.", thema: "Pflichten", datum: "5. September 2026" },
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
  { thema: "Investieren", id: "investieren", satz: "Wie du dein Geld anlegst, ohne gegen deine Überzeugung zu handeln." },
  { thema: "Alltag", id: "alltag", satz: "Verträge, die dir im normalen Leben begegnen, vom Konto bis zum Auto." },
  { thema: "Grundlagen", id: "grundlagen", satz: "Die Begriffe, ohne die alles andere schwer zu verstehen ist." },
  { thema: "Pflichten", id: "pflichten", satz: "Was der Islam an Abgaben und Regeln vorsieht, und wie du es ausrechnest." },
];
