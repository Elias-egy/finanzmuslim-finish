import { halalAnlagen, type Anlage } from "@/data/halalAnlagen";
import { NACHWEIS } from "@/data/anlagenNachweis";
import { ANLAGEN_KAUFBAR, type AnlageKaufbar } from "@/data/anlagenKaufbar";
import { depotAnzeige } from "@/data/anzeige/depot";

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
 *  das sich mit einem anderen kannibalisiert).
 *  Der BNP Paribas Islamic Fund stellt sie auch nicht: Sein jüngster gefundener Nachweis ist der Halbjahresbericht
 *  2020, eine Frage „Ist … halal?“ in Title und H1 trüge das nicht (Halal-Prüfer RN19, A10; vorsichtigste Fassung,
 *  Elias entscheidet, ob die Frage zurückkommt). */
const OHNE_FRAGE = new Set(["bitcoin", "bnp-paribas-islamic-fund-hilal-income-classic-c"]);

/** Nur Bitcoin hat einen eigenen Beitrag, auf den die Detailseite verweist. */
export const hatEigenenBeitrag = (a: Anlage) => a.slug === "bitcoin";

export const fragtHalal = (a: Anlage) => !OHNE_FRAGE.has(a.slug);

/** Kürzere Schreibweise nur für den Title-Tag, wo der volle Name über 59 Zeichen ergäbe. H1 und Text tragen den vollen Namen. */
const TITEL_NAME: Record<string, string> = {
  "invesco-dow-jones-islamic-global-developed-markets": "Invesco Dow Jones Islamic Global Developed",
  "hsbc-msci-emerging-markets-islamic-screened-capped": "HSBC MSCI Emerging Markets Islamic Screened",
  "bnp-paribas-islamic-fund-hilal-income-classic-c": "BNP Paribas Islamic Fund Hilal Income",
};

const istKrypto = (a: Anlage) => a.kategorie === "krypto";

/** Der Nachweis in einer Zeile, aus den Daten. Dieselben Zeilen wie in der Liste und im Abschnitt Halal. */
export const nachweisKurz = (a: Anlage): string => {
  const n = NACHWEIS[a.slug];
  if (n) return n.grenze ? `${n.text}, ${n.grenze}` : n.text;
  if (istKrypto(a)) return `Sharia-Analyse, ${a.zertifizierer}, nach eigenen Worten vorläufig und keine Fatwa`;
  // Platin, Palladium und der Edelmetall-Korb: Prüfbericht des Al-Qalam-Panels vom 22. Juni 2026 nennt das Produkt ausdrücklich.
  if (a.zertifizierer.startsWith("Al-Qalam")) return "Prüfbericht 2026, Al-Qalam";
  return a.zertifizierer;
};

/** Der letzte Satz des Antwortsatzes. Wo die Daten keine Stelle nennen, die eingestuft hat, steht das da. */
const SCHLUSS = "Über die Einstufung entscheidet die Prüfstelle, nicht wir.";
const SCHLUSS_OHNE_STELLE = "Eine Stelle, die den Fonds eingestuft hat, haben wir nicht gefunden. Über die Einstufung entscheiden nicht wir.";

/** Der kurze, belegte Antwortsatz oben auf der Seite. Trägt jede Einschränkung des Nachweises und den Vorbehalt der Quelle (`hinweis`). */
export const antwortSatz = (a: Anlage): string => {
  const bedingung = a.hinweis ? ` ${a.hinweis}.` : "";
  const schluss = NACHWEIS[a.slug]?.ohnePruefstelle ? SCHLUSS_OHNE_STELLE : SCHLUSS;
  return `Der Nachweis, den wir gefunden haben: ${nachweisKurz(a)}.${bedingung} ${schluss}`;
};

const kostenText = (a: Anlage) => `${a.kostenLabel} Kosten pro Jahr`;

const kuerzen = (kandidaten: string[], min: number, max: number): string => {
  const passt = kandidaten.find((k) => k.length >= min && k.length <= max);
  if (passt) return passt;
  return [...kandidaten].filter((k) => k.length <= max).sort((x, y) => y.length - x.length)[0] ?? kandidaten[kandidaten.length - 1];
};

/** Title-Tag, unter 60 Zeichen. Beginnt wortgleich mit der H1. */
export const seoTitel = (a: Anlage): string => {
  const n = a.name;
  const k = TITEL_NAME[a.slug] ?? n;
  if (hatEigenenBeitrag(a)) return kuerzen([`${n}: Kurs und Sharia-Analyse | finanzmuslim`, `${n}: Kurs und Sharia-Analyse`], 0, 59);
  if (!fragtHalal(a)) {
    const kandidaten = [`${n}: Kurs und Nachweis | finanzmuslim`, `${n}: Kurs und Nachweis`, `${k}: Kurs und Nachweis`];
    return kandidaten.find((x) => x.length <= 59) ?? kandidaten[kandidaten.length - 1];
  }
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
  if (hatEigenenBeitrag(a)) {
    return kuerzen(
      [
        `${n} mit Kursverlauf in Euro und der Sharia-Analyse des Shariyah Review Bureau. Die ganze Diskussion steht im Beitrag Ist Bitcoin halal?`,
      ],
      120,
      160,
    );
  }
  if (!fragtHalal(a)) {
    const isin0 = a.isin ? `ISIN ${a.isin}, ` : "";
    return kuerzen(
      [
        `${n}: ${isin0}${kostenText(a)}, Kursverlauf. Nachweis: ${nachweisKurz(a)}.`,
        `${n}: ${isin0}${kostenText(a)}. Nachweis: ${nachweisKurz(a)}.`,
        `${n}: Kursverlauf und Kosten. Nachweis: ${nachweisKurz(a)}.`,
        `${n}. Nachweis: ${nachweisKurz(a)}.`,
      ],
      120,
      160,
    );
  }
  if (istKrypto(a)) {
    // Chainlink: Die Bedingung der Prüfer gehört in die Meta (Halal-Prüfer RN19, A14); die volle Fassung steht in Antwortsatz und FAQ.
    if (a.hinweis) {
      return kuerzen(
        [
          `Ist ${n} halal? Nachweis: vorläufige Sharia-Analyse, keine Fatwa, an eine Bedingung der Prüfer geknüpft. Dazu Kursverlauf in Euro.`,
          `Ist ${n} halal? Nachweis: vorläufige Sharia-Analyse, keine Fatwa, an eine Bedingung geknüpft.`,
        ],
        120,
        160,
      );
    }
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
      `Ist ${n} halal? Nachweis: ${nachweisKurz(a)}. ${isin}.`,
      `Ist ${n} halal? Nachweis: ${nachweisKurz(a)}.`,
      `Ist ${TITEL_NAME[a.slug] ?? n} halal? Nachweis: ${nachweisKurz(a)}.`,
    ],
    120,
    160,
  );
};

/** Die H1: dieselbe Frage wie im Title. */
export const h1Text = (a: Anlage): string =>
  fragtHalal(a) ? `Ist ${a.name} halal?` : hatEigenenBeitrag(a) ? `${a.name}: Kurs und Sharia-Analyse` : `${a.name}: Kurs und Nachweis`;

export type FaqEintrag = { q: string; a: string };

/** FAQ aus den vorhandenen Daten: sichtbar auf der Seite und gleichlautend im FAQPage-Schema. */
export const faqFuer = (a: Anlage): FaqEintrag[] => {
  const faq: FaqEintrag[] = [];
  if (fragtHalal(a)) {
    faq.push({ q: `Ist ${a.name} halal?`, a: `${antwortSatz(a)} Die Quelle steht im Abschnitt Halal dieser Seite.` });
  } else if (!hatEigenenBeitrag(a)) {
    faq.push({ q: `Welchen Nachweis gibt es für ${a.name}?`, a: `${antwortSatz(a)} Die Quelle steht im Abschnitt Halal dieser Seite.` });
  }
  const n = NACHWEIS[a.slug];
  if (n?.faqFrage && n.faqAntwort) {
    // Index, Board oder Berater statt „geprüft“ (Halal-Prüfer RN19, A7 bis A9): die Frage nennt, was die Quelle wirklich sagt.
    faq.push({ q: n.faqFrage.replace("{name}", a.name), a: n.faqAntwort });
  } else {
    faq.push({
      q: `Wer hat ${a.name} geprüft?`,
      a: `${a.zertifizierer}. Nachweis: ${nachweisKurz(a)}.${a.hinweis ? ` ${a.hinweis}.` : ""}`,
    });
  }
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
    const ohneRot = kaufbarOhneZinsenRot(kaufbar);
    const gezeigt = ohneRot.slice(0, 5).map((k) => k.anbieter);
    const rest = ohneRot.length - gezeigt.length;
    const zinsen =
      gezeigt.length > 0
        ? ` Im Depot-Vergleich stehen davon bei „ohne Zinsen nutzbar“ grün: ${gezeigt.join(", ")}${rest > 0 ? ` und ${rest} weitere` : ""}. Bei den übrigen Anbietern steht „ohne Zinsen nutzbar“ im Depot-Vergleich nicht grün, oder sie fehlen dort.`
        : " Bei keinem dieser Anbieter steht „ohne Zinsen nutzbar“ im Depot-Vergleich grün.";
    faq.push({
      q: `Wo kann ich ${a.name} kaufen?`,
      a: `Laut Wertpapiersuche oder Produktliste ist sie bei ${kaufbar.kaufbar.length} ${kaufbar.kaufbar.length === 1 ? "Anbieter" : "Anbietern"} kaufbar.${zinsen} Die ganze Liste steht im Abschnitt Kaufen. Nicht bei jedem Anbieter haben wir die Kaufbarkeit geprüft.`,
    });
  }
  return faq;
};

/**
 * Die Anbieter aus der Kaufbar-Liste, die im Depot-Vergleich bei „ohne Zinsen nutzbar“ grün stehen (RN19, Halal-Prüfer A17).
 * Zählt nur, wer im angezeigten Depot-Vergleich vorkommt und dort in jeder Zeile (Produkt) seines Hauses grün ist; wer rot
 * oder gelb ist, nicht auftaucht oder nur zum Teil grün ist, wird im FAQ nicht genannt (Regelbuch: wer nicht zinsfrei
 * nutzbar ist, steht unten, rot; bei Zinsen zählt nur der Beleg vom Anbieter).
 */
export const kaufbarOhneZinsenRot = (kaufbar: AnlageKaufbar): AnlageKaufbar["kaufbar"] => {
  const zeilenJeHaus = new Map<string, boolean[]>();
  for (const z of depotAnzeige) {
    if (!z.haus) continue;
    const gruen = !z.abgeraten && z.werte.zinsfreiAbStart === "gut";
    zeilenJeHaus.set(z.haus, [...(zeilenJeHaus.get(z.haus) ?? []), gruen]);
  }
  const gruen = (haus: string) => {
    const z = zeilenJeHaus.get(haus);
    return !!z && z.every(Boolean);
  };
  return kaufbar.kaufbar.filter((k) => (k.haeuser?.length ? k.haeuser : [k.haus]).every(gruen));
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
    { to: "/vergleich/krypto", name: "Krypto-Vergleich", text: "Börsen mit echten Coins, mit Angabe zu den Zinsen je Anbieter." },
    { to: "/blog/ist-bitcoin-halal", name: "Ist Bitcoin halal?", text: "Die drei Kategorien und der echte Streitpunkt." },
    { to: "/blog/zakat-auf-aktien-etf-krypto", name: "Zakat auf Aktien und ETFs", text: "Was von Depot und Krypto in die Zakat-Rechnung geht." },
  ];
};
