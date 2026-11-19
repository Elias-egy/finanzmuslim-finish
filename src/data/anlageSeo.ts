import { halalAnlagen, type Anlage } from "@/data/halalAnlagen";
import { NACHWEIS } from "@/data/anlagenNachweis";
import { ANLAGEN_KAUFBAR } from "@/data/anlagenKaufbar";

/**
 * Titel, H1, Meta, Antwortsatz, FAQ und Verknüpfungen der Anlage-Detailseiten (RN19).
 *
 * Warum: Wer sucht, tippt „ist <Name> halal“. Vorher stand auf keiner Detailseite diese Frage in Title, H1 oder Meta,
 * nur „Kurs, Kosten und Halal-Einordnung“ hinter einem 90 Zeichen langen Namen. Alles hier kommt aus den Daten der
 * Anlage (`halalAnlagen.ts`, `anlagenNachweis.ts`, `anlagenKaufbar.ts`). Es steht kein eigenes Urteil darin: Der Satz
 * nennt, welchen Nachweis es gibt und wer ihn ausgestellt hat, und sagt, dass die Prüfstelle einstuft, nicht wir.
 */

/** Bitcoin hat einen eigenen Beitrag (/blog/ist-bitcoin-halal) mit der Frage im Titel. Die Detailseite stellt sie nicht
 *  noch einmal, damit sich beide Seiten nicht gegenseitig die Suche wegnehmen (Regelbuch seo-und-blog, Nie: Kein Wort,
 *  das sich mit einem anderen kannibalisiert). */
const OHNE_FRAGE = new Set(["bitcoin"]);

export const fragtHalal = (a: Anlage) => !OHNE_FRAGE.has(a.slug);

/** Kürzere Schreibweise nur für den Title-Tag, wo der volle Name über 59 Zeichen ergäbe. H1 und Text tragen den vollen Namen. */
const TITEL_NAME: Record<string, string> = {
  "invesco-dow-jones-islamic-global-developed-markets": "Invesco Dow Jones Islamic Global Developed",
  "hsbc-msci-emerging-markets-islamic-screened-capped": "HSBC MSCI Emerging Markets Islamic Screened",
};

const istKrypto = (a: Anlage) => a.kategorie === "krypto";

/** Der Nachweis in einer Zeile, aus den Daten. Dieselben Zeilen wie in der Liste und im Abschnitt Halal. */
export const nachweisKurz = (a: Anlage): string => {
  const zeile = NACHWEIS[a.slug]?.text;
  if (zeile) return zeile;
  if (istKrypto(a)) return `Sharia-Analyse, ${a.zertifizierer}, nach eigenen Worten vorläufig und keine Fatwa`;
  // Platin, Palladium und der Edelmetall-Korb: Prüfbericht des Al-Qalam-Panels vom 22. Juni 2026 nennt das Produkt ausdrücklich.
  if (a.zertifizierer.startsWith("Al-Qalam")) return "Prüfbericht 2026, Al-Qalam";
  return a.zertifizierer;
};

/** Der kurze, belegte Antwortsatz oben auf der Seite. */
export const antwortSatz = (a: Anlage): string => {
  const bedingung = a.hinweis ? ` ${a.hinweis}.` : "";
  return `Der Nachweis, den wir gefunden haben: ${nachweisKurz(a)}.${bedingung} Über die Einstufung entscheidet die Prüfstelle, nicht wir.`;
};

const kostenText = (a: Anlage) => `${a.kostenLabel} Kosten pro Jahr`;

const kuerzen = (kandidaten: string[], min: number, max: number): string => {
  const passt = kandidaten.find((k) => k.length >= min && k.length <= max);
  if (passt) return passt;
  return [...kandidaten].filter((k) => k.length <= max).sort((x, y) => y.length - x.length)[0] ?? kandidaten[kandidaten.length - 1];
};

/** Title-Tag, unter 60 Zeichen. Beginnt wortgleich mit der H1. */
export const seoTitel = (a: Anlage): string => {
  if (!fragtHalal(a)) return kuerzen([`${a.name}: Kurs und Sharia-Analyse | finanzmuslim`, `${a.name}: Kurs und Sharia-Analyse`], 0, 59);
  const n = a.name;
  const k = TITEL_NAME[a.slug] ?? n;
  const kandidaten = [
    `Ist ${n} halal? Nachweis und Kosten | finanzmuslim`,
    `Ist ${n} halal? Nachweis und Kosten`,
    `Ist ${n} halal? | finanzmuslim`,
    `Ist ${n} halal?`,
    `Ist ${k} halal?`,
  ];
  return kandidaten.find((t) => t.length <= 59) ?? kandidaten[kandidaten.length - 1];
};

/** Meta-Beschreibung, 120 bis 160 Zeichen. */
export const seoBeschreibung = (a: Anlage): string => {
  const n = a.name;
  if (!fragtHalal(a)) {
    return kuerzen(
      [
        `${n} mit Kursverlauf in Euro und der Sharia-Analyse des Shariyah Review Bureau. Die ganze Diskussion steht im Beitrag Ist Bitcoin halal?`,
      ],
      120,
      160,
    );
  }
  if (istKrypto(a)) {
    return kuerzen(
      [
        `Ist ${n} halal? Nachweis: ${nachweisKurz(a)}. Dazu der Kursverlauf in Euro und die Quelle der Prüfstelle.`,
        `Ist ${n} halal? Nachweis: ${nachweisKurz(a)}. Dazu Kursverlauf in Euro.`,
      ],
      120,
      160,
    );
  }
  const isin = a.isin ? `ISIN ${a.isin}` : "";
  return kuerzen(
    [
      `Ist ${n} halal? Nachweis: ${nachweisKurz(a)}. ${isin}, ${kostenText(a)}, Kursverlauf.`,
      `Ist ${n} halal? Nachweis: ${nachweisKurz(a)}. ${isin} und ${kostenText(a)}.`,
      `Ist ${n} halal? Nachweis: ${nachweisKurz(a)}. Dazu ISIN, Kosten und Kursverlauf.`,
      `Ist ${n} halal? ${isin}, ${kostenText(a)}, Kursverlauf und der Nachweis der Prüfstelle mit Quelle.`,
      `Ist ${n} halal? Nachweis: ${nachweisKurz(a)}.`,
    ],
    120,
    160,
  );
};

/** Die H1: dieselbe Frage wie im Title. */
export const h1Text = (a: Anlage): string => (fragtHalal(a) ? `Ist ${a.name} halal?` : `${a.name}: Kurs und Sharia-Analyse`);

export type FaqEintrag = { q: string; a: string };

/** FAQ aus den vorhandenen Daten: sichtbar auf der Seite und gleichlautend im FAQPage-Schema. */
export const faqFuer = (a: Anlage): FaqEintrag[] => {
  const faq: FaqEintrag[] = [];
  if (fragtHalal(a)) {
    faq.push({ q: `Ist ${a.name} halal?`, a: `${antwortSatz(a)} Die Quelle steht im Abschnitt Halal dieser Seite.` });
  }
  faq.push({
    q: `Wer hat ${a.name} geprüft?`,
    a: `${a.zertifizierer}. Nachweis: ${nachweisKurz(a)}.`,
  });
  if (istKrypto(a)) {
    faq.push({
      q: `Ist die Prüfung von ${a.name} eine Fatwa?`,
      a: "Nein. Nach eigenen Worten ist die Sharia-Analyse eine vorläufige Einschätzung, keine Fatwa.",
    });
  } else {
    faq.push({ q: `Was kostet ${a.name} im Jahr?`, a: `Die laufenden Kosten betragen ${a.kostenLabel} pro Jahr.` });
  }
  if (a.isin) {
    faq.push({ q: `Welche ISIN hat ${a.name}?`, a: `Die ISIN lautet ${a.isin}.` });
  }
  const kaufbar = a.isin ? ANLAGEN_KAUFBAR[a.isin] : undefined;
  if (kaufbar && kaufbar.kaufbar.length > 0) {
    faq.push({
      q: `Wo kann ich ${a.name} kaufen?`,
      a: `Laut Wertpapiersuche oder Produktliste ist sie kaufbar bei ${kaufbar.kaufbar.slice(0, 5).map((k) => k.anbieter).join(", ")}${
        kaufbar.kaufbar.length > 5 ? ` und ${kaufbar.kaufbar.length - 5} weiteren` : ""
      }. Die ganze Liste steht im Abschnitt Kaufen. Nicht jeder Anbieter ist geprüft.`,
    });
  }
  return faq;
};

type Gruppe = "aktien" | "sukuk" | "metalle" | "krypto";

const gruppeVon = (a: Anlage): Gruppe =>
  a.kategorie === "aktien" ? "aktien" : a.kategorie === "sukuk" ? "sukuk" : a.kategorie === "krypto" ? "krypto" : "metalle";

/**
 * Vier verwandte Anlagen: dieselbe Gruppe, reihum ab der nächsten, damit jede Seite gleich viele Links bekommt.
 * Hat die Gruppe zu wenige (Sukuk, Krypto), füllen Anlagen der nächstverwandten Gruppe auf.
 */
export const verwandteAnlagen = (a: Anlage, anzahl = 4): Anlage[] => {
  const g = gruppeVon(a);
  const gleich = halalAnlagen.filter((x) => gruppeVon(x) === g);
  const i = gleich.findIndex((x) => x.slug === a.slug);
  const reihum = gleich.slice(i + 1).concat(gleich.slice(0, i));
  const auswahl = reihum.slice(0, anzahl);
  if (auswahl.length < anzahl) {
    const naechste: Gruppe = g === "sukuk" ? "aktien" : g === "krypto" ? "metalle" : "aktien";
    const auffuellen = halalAnlagen.filter((x) => gruppeVon(x) === naechste && !auswahl.includes(x));
    auswahl.push(...auffuellen.slice(0, anzahl - auswahl.length));
  }
  return auswahl;
};

export type WeiterLink = { to: string; name: string; text: string };

/** Vergleich (wo kaufen) und Beiträge, die zur Gruppe der Anlage gehören. */
export const weiterlesenFuer = (a: Anlage): WeiterLink[] => {
  const g = gruppeVon(a);
  if (g === "aktien") {
    return [
      { to: "/vergleich/depot", name: "Depot-Vergleich", text: "Wo du Halal-ETFs kaufst, mit Kosten und Merkmalen." },
      { to: "/blog/halal-etf", name: "Beste Halal ETFs 2026", text: "Acht Halal ETFs mit Kosten und Rendite." },
      { to: "/blog/sind-aktien-haram", name: "Sind Aktien haram?", text: "Wann eine Aktie halal ist und wer das prüft." },
    ];
  }
  if (g === "sukuk") {
    return [
      { to: "/vergleich/depot", name: "Depot-Vergleich", text: "Wo du Sukuk-ETFs kaufst, mit Kosten und Merkmalen." },
      { to: "/blog/sukuk", name: "Sukuk", text: "Was hinter islamischen Anleihen steckt." },
      { to: "/blog/halal-etf", name: "Beste Halal ETFs 2026", text: "Acht Halal ETFs mit Kosten und Rendite." },
    ];
  }
  if (g === "metalle") {
    return [
      { to: "/vergleich/edelmetalle", name: "Edelmetall-Vergleich", text: "Depots für Gold und Silber nach Rang." },
      { to: "/blog/halal-gold-kaufen", name: "Halal Gold kaufen", text: "Fünf Wege von Barren bis Gold-ETC." },
      { to: "/blog/nisab", name: "Nisab verstehen", text: "Welche der beiden Grenzen für dich gilt." },
    ];
  }
  return [
    { to: "/vergleich/krypto", name: "Krypto-Vergleich", text: "Börsen mit echten Coins und ohne Zinsen." },
    { to: "/blog/ist-bitcoin-halal", name: "Ist Bitcoin halal?", text: "Die drei Kategorien und der echte Streitpunkt." },
    { to: "/blog/zakat-auf-aktien-etf-krypto", name: "Zakat auf Aktien und ETFs", text: "Was von Depot und Krypto in die Zakat-Rechnung geht." },
  ];
};
