/**
 * Der Halal-Portfolio-Plan, das Freebie zum Wort „Invest“ (Gesamtplan MC, Abschnitt 4, Sitzung MC3).
 *
 * Liegt versteckt unter /dein-plan/<schluessel>: nicht in Navigation, Sitemap oder Vorrendern,
 * noindex. Der Link kommt aus dem Instagram-Chat. Wer den Schlüssel ändert, macht alle
 * verschickten Links ungültig.
 *
 * Die Pläne sind Beispiele für eine Beispielperson, keine Empfehlung. Die Prozente stammen aus
 * Elias' Einsteiger-Guide (Ali, Seite 7) und den Stufen von Wahed (Blog vom 02.12.2025), Krypto
 * nur im offensiven Plan und klein (Elias, 27.10.2026). Jede Halal- und Zinsaussage hat ihren
 * Beleg in `docs/freebies/portfolio-plan.belege.md`.
 */
export const PLAN_SCHLUESSEL = "invest-5rk8";
export const PLAN_PFAD = `/dein-plan/${PLAN_SCHLUESSEL}`;

/** Jeder Link trägt seine Stelle, damit MC6 die Klicks je Stelle zählen kann. */
export const planLink = (ziel: string, stelle: string) => `${ziel}?src=ginvest-${stelle}`;

export type BausteinId = "sukuk" | "gold" | "etf" | "aktien" | "krypto";

export type Baustein = {
  id: BausteinId;
  name: string;
  rolle: string;
  satz: string;
  /** Kleine Zeile darunter: warum er halal sein kann, mit dem geprüften Beispiel. */
  pruefung: string;
  farbe: string;
};

export const bausteine: Baustein[] = [
  {
    id: "sukuk",
    name: "Sukuk",
    rolle: "Ruhe",
    satz: "Schwankt wenig. Passt für Geld, das du in ein bis drei Jahren brauchst.",
    pruefung: "Beispiel: iShares USD Sukuk, mit eigenem Shariah-Gremium und Fatwa.",
    farbe: "#0E9F8A",
  },
  {
    id: "gold",
    name: "Gold",
    rolle: "Schutz",
    satz: "Hält seinen Wert, wenn das Geld an Wert verliert. Du musst es nicht zu Hause haben: Es liegt für dich im Tresor.",
    pruefung: "Beispiel: Invesco Physical Gold, mit jährlichem Shariah-Zertifikat.",
    farbe: "#E0A21A",
  },
  {
    id: "etf",
    name: "Islamic ETF",
    rolle: "Wachstum",
    satz: "Hunderte Firmen mit einem Kauf. Ein Shariah-Gremium prüft jedes Quartal und sortiert aus, was nicht passt.",
    pruefung: "Beispiel: iShares MSCI World Islamic, mit eigenem Shariah-Gremium und Fatwa.",
    farbe: "#0057FA",
  },
  {
    id: "aktien",
    name: "Einzelaktien",
    rolle: "Auswahl",
    satz: "Firmen, die du selbst auswählst. Jede braucht ihre eigene Prüfung.",
    pruefung: "Geprüft wird jede Firma einzeln, nach Umsatz und Schulden.",
    farbe: "#705FF1",
  },
  {
    id: "krypto",
    name: "Krypto",
    rolle: "Chance",
    satz: "Schwankt am stärksten. Darum nur ein kleiner Teil, und nur wenn das Geld lange liegen bleibt.",
    pruefung: "Beispiel: Bitcoin, mit Shariah-Analyse des Shariyah Review Bureau.",
    farbe: "#F26B1D",
  },
];

export const bausteinById = (id: BausteinId) => bausteine.find((b) => b.id === id)!;

export type LageId = "sicher" | "mittel" | "offensiv";

export type Lage = {
  id: LageId;
  name: string;
  /** „Für dich, wenn …“ */
  fuerDich: string;
  beispiel: string;
  verhalten: string;
  anteile: { baustein: BausteinId; prozent: number }[];
};

/** Was Ali jeden Monat übrig hat (Elias, 27.10.2026: „Sagen wir 500 Euro übrig“). */
export const MONATLICH = 500;

export const lagen: Lage[] = [
  {
    id: "sicher",
    name: "Sicher",
    fuerDich: "du das Geld in ein bis drei Jahren brauchst.",
    beispiel: "Ali heiratet bald und spart für die Feier.",
    verhalten: "Schwankt am wenigsten.",
    anteile: [
      { baustein: "sukuk", prozent: 70 },
      { baustein: "gold", prozent: 20 },
      { baustein: "etf", prozent: 10 },
    ],
  },
  {
    id: "mittel",
    name: "Mittel",
    fuerDich: "du noch nicht weißt, wofür, und wenig Risiko willst.",
    beispiel: "Ali will Rücklagen aufbauen.",
    verhalten: "Wächst ruhig, schwankt mittel.",
    anteile: [
      { baustein: "etf", prozent: 50 },
      { baustein: "sukuk", prozent: 30 },
      { baustein: "gold", prozent: 20 },
    ],
  },
  {
    id: "offensiv",
    name: "Offensiv",
    fuerDich: "das Geld mindestens fünf Jahre liegen bleibt.",
    beispiel: "Ali baut Vermögen für später auf.",
    verhalten: "Schwankt am meisten und brachte langfristig im Schnitt am meisten.",
    anteile: [
      { baustein: "etf", prozent: 65 },
      { baustein: "gold", prozent: 10 },
      { baustein: "sukuk", prozent: 10 },
      { baustein: "aktien", prozent: 10 },
      { baustein: "krypto", prozent: 5 },
    ],
  },
];

export const euro = (prozent: number) => Math.round((MONATLICH * prozent) / 100);

/** Die belegten Zahlen für den Schmerz (Stand der Vergleiche, siehe Begleitdatei). */
export const SCHMERZ = {
  girokonto: "Etwa jedes achte Girokonto in meinem Vergleich zahlt dir Zinsen auf dein Guthaben. Bei den meisten davon kannst du das nicht abschalten.",
  depot: "Etwa jedes fünfte Depot in meinem Vergleich verzinst dein Guthaben, oft automatisch. Und nicht jedes hat alle Islamic ETFs: Von zwölf geprüften führen nur zwei alle, ein bekanntes nur sechs.",
};

export const quellen: { titel: string; url: string }[] = [
  { titel: "iShares II plc, Verkaufsprospekt (Shari'ah Panels für Islamic- und Sukuk-Fonds)", url: "https://www.blackrock.com/ch/individual/en/literature/prospectus/ishares-ii-plc-prospectus-en.pdf" },
  { titel: "Invesco Physical Gold ETC, Shariah-Zertifikat 2025", url: "https://www.invesco.com/content/dam/invesco/emea/en/product-documents/etf/fund/ssb-certificate/invesco-physical-gold-and-silver-etc_ssb-certficate_en_2025.pdf" },
  { titel: "Shariyah Review Bureau, Analyse zu Bitcoin", url: "https://shariyah.net/cryptocurrencies/bitcoin/" },
];
