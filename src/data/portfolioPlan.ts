/**
 * Der Halal-Portfolio-Plan, das Freebie zum Wort „Invest“ (Gesamtplan MC, Abschnitt 4, Sitzung MC3).
 *
 * Liegt versteckt unter /dein-plan/<schluessel>: nicht in Navigation, Sitemap oder Vorrendern,
 * noindex. Der Link kommt aus dem Instagram-Chat. Wer den Schlüssel ändert, macht alle
 * verschickten Links ungültig.
 *
 * Die Pläne sind Beispiele für eine Beispielperson, keine Empfehlung. Die Prozente stammen aus
 * Elias' Einsteiger-Guide (Ali, Seite 7) und den Stufen von Wahed (Blog vom 02.12.2025), Krypto
 * nur im langen Plan und klein (Elias, 27.10.2026). Die Lagen gehen nach Zeit, nicht nach Risiko:
 * 1 Jahr, 3 Jahre, 5 Jahre und mehr; wer es nicht weiß, nimmt die Mitte; der kurze Plan hält
 * einen Teil auf dem Girokonto ohne Zinsen (Elias, 28.10.2026, Vault
 * raw/2026-10-28-elias-mc3b-zeitlagen-krypto-bruecke.md). Jede Halal- und Zinsaussage hat ihren
 * Beleg in `docs/freebies/portfolio-plan.belege.md`.
 */
export const PLAN_SCHLUESSEL = "invest-5rk8";
export const PLAN_PFAD = `/dein-plan/${PLAN_SCHLUESSEL}`;

/** Jeder Link trägt seine Stelle, damit MC6 die Klicks je Stelle zählen kann. */
export const planLink = (ziel: string, stelle: string) => `${ziel}?src=ginvest-${stelle}`;

export type BausteinId = "konto" | "sukuk" | "gold" | "etf" | "aktien" | "krypto";

export type Baustein = {
  id: BausteinId;
  name: string;
  /** Höchstens zwei Zeilen am Handy (Elias, 28.10.2026: „Gold sieben Zeilen, das zu viel“). */
  satz: string;
  /**
   * Ein Beispiel mit Logo, nicht anklickbar (Elias, 28.10.2026: „das führt die Leute direkt
   * irgendwo anders hin“). Logo aus der Anlage (`slug`) oder über die Domain des Anbieters.
   */
  beispiel?: { slug?: string; domain?: string; titel: string };
  farbe: string;
};

export const bausteine: Baustein[] = [
  {
    id: "sukuk",
    name: "Sukuk",
    satz: "Schwankt wenig. Gut für Geld, das du bald brauchst.",
    beispiel: { slug: "ishares-usd-sukuk-ucits-etf", titel: "iShares USD Sukuk" },
    farbe: "#0E9F8A",
  },
  {
    id: "gold",
    name: "Gold",
    satz: "Hält seinen Wert. Liegt für dich im Tresor, nicht zu Hause.",
    beispiel: { slug: "invesco-physical-gold-etc", titel: "Invesco Physical Gold" },
    farbe: "#E0A21A",
  },
  {
    id: "etf",
    name: "Islamic ETF",
    satz: "Hunderte Firmen mit einem Kauf, jedes Quartal geprüft.",
    beispiel: { slug: "ishares-msci-world-islamic", titel: "iShares MSCI World Islamic" },
    farbe: "#0057FA",
  },
  {
    id: "aktien",
    name: "Einzelaktien",
    satz: "Firmen, die du selbst auswählst. Jede braucht ihre eigene Prüfung.",
    beispiel: { domain: "zoya.finance", titel: "Zoya, eine App zum Prüfen" },
    farbe: "#705FF1",
  },
  {
    id: "krypto",
    name: "Krypto",
    satz: "Schwankt am stärksten, deswegen freiwillig und mit Vorsicht.",
    beispiel: { slug: "bitcoin", titel: "Bitcoin" },
    farbe: "#F26B1D",
  },
];

/** Kein Anlage-Baustein, darum nicht in Schritt 2: Schritt 1 erklärt das Girokonto. */
export const konto: Baustein = {
  id: "konto",
  name: "Girokonto ohne Zinsen",
  satz: "Liegt da, wenn du es brauchst.",
  farbe: "#94A3B8",
};

export const bausteinById = (id: BausteinId) => (id === "konto" ? konto : bausteine.find((b) => b.id === id)!);

export type LageId = "bald" | "mittel" | "lang";

export type Lage = {
  id: LageId;
  /** Knopf: wann das Geld gebraucht wird. */
  wann: string;
  /** Aus der Seele des Lesers gesprochen (Elias, 28.10.2026). */
  seele: string;
  verhalten: string;
  anteile: { baustein: BausteinId; prozent: number }[];
};

/**
 * Was der Leser jeden Monat übrig hat, oben auf der Seite gewählt: Der Klick markiert nur, Ring und
 * Euro-Beträge folgen dem Betrag (Elias, 28.10.2026, MC3c: „Wie viel Geld hast du übrig? Dann kommt
 * 100, 300, 500“, Vault raw/2026-10-28-elias-mc3c-als-kunde-durchgegangen.md).
 */
export const BETRAEGE = [100, 300, 500] as const;
export const MONATLICH = 500;

export const lagen: Lage[] = [
  {
    id: "bald",
    wann: "In 1 Jahr",
    seele: "Du hast bald etwas Großes vor: Auto, Hochzeit, Umzug. Dann muss das Geld da sein, wenn du es brauchst.",
    verhalten: "Schwankt am wenigsten. Die Hälfte bleibt einfach auf dem Girokonto.",
    anteile: [
      { baustein: "konto", prozent: 50 },
      { baustein: "sukuk", prozent: 40 },
      { baustein: "gold", prozent: 10 },
    ],
  },
  {
    id: "mittel",
    wann: "In 3 Jahren",
    seele: "Du fängst an und weißt noch nicht, wie lange das Geld liegen bleibt. Dann nimm die Mitte.",
    verhalten: "Wächst ruhig, schwankt mittel.",
    anteile: [
      { baustein: "etf", prozent: 50 },
      { baustein: "gold", prozent: 30 },
      { baustein: "sukuk", prozent: 20 },
    ],
  },
  {
    id: "lang",
    wann: "In 5+ Jahren",
    seele: "Das Geld bleibt mindestens fünf Jahre liegen. Du baust Vermögen für später auf.",
    verhalten: "Schwankt am meisten und brachte langfristig im Schnitt am meisten.",
    anteile: [
      { baustein: "etf", prozent: 60 },
      { baustein: "gold", prozent: 25 },
      { baustein: "aktien", prozent: 10 },
      { baustein: "krypto", prozent: 5 },
    ],
  },
];

/**
 * Einzelaktien und Krypto stehen nur im langen Plan, als Beispiel im Ring (10 und 5 %), und sind
 * freiwillig: Wer das Risiko nicht will, ergänzt mit Gold oder ETF (Elias, 28.10.2026, dritte
 * Nachricht, Vault raw/2026-10-28-elias-mc3b-nahbarer-broker-anzeige.md; zusammen höchstens 15 %).
 */
export const SPIELRAUM = { bausteine: ["aktien", "krypto"] as BausteinId[], hoechstens: 15 };

export const euro = (prozent: number, betrag: number = MONATLICH) => Math.round((betrag * prozent) / 100);

/** Die belegten Zahlen für den Schmerz (Stand der Vergleiche, siehe Begleitdatei). */
export const SCHMERZ = {
  girokonto: "Etwa jedes achte Girokonto zahlt dir Zinsen auf dein Geld.",
  /** Zweite, abgesetzte Zeile (Elias, 28.10.2026, MC3c); Beleg Sure 2, Vers 275, 278 und 279. */
  muslim: "Als Muslim meidest du Zinsen.",
};

/**
 * Die bekanntesten Depots, je mit einer belegten Tatsache, nie mit einem Urteil (Elias, 28.10.2026:
 * „die bekanntesten Broker sind nicht die besten“). Trade Republic: 6 von 12 Islamic ETFs und Fonds
 * aus `anlagenKaufbar.ts` (der Test zählt nach); XTB: Anbieter-Beleg https://www.xtb.com/de/zinsen.
 */
export const BEKANNTE = [
  // Farbe nach Elias, 28.10.2026, MC3c: Trade Republic gelb, XTB mit leichtem Rot.
  { name: "Trade Republic", domain: "traderepublic.com", gross: "6 von 12", klein: "Islamic ETFs", ton: "gelb" },
  { name: "XTB", domain: "xtb.com", gross: "Zinsen", klein: "automatisch eingeschaltet", ton: "rot" },
] as const;

export const quellen: { titel: string; url: string }[] = [
  { titel: "iShares II plc, Verkaufsprospekt (Shari'ah Panels für Islamic- und Sukuk-Fonds)", url: "https://www.blackrock.com/ch/individual/en/literature/prospectus/ishares-ii-plc-prospectus-en.pdf" },
  { titel: "Invesco Physical Gold ETC, Shariah-Zertifikat 2025", url: "https://www.invesco.com/content/dam/invesco/emea/en/product-documents/etf/fund/ssb-certificate/invesco-physical-gold-and-silver-etc_ssb-certficate_en_2025.pdf" },
  { titel: "Shariyah Review Bureau, Analyse zu Bitcoin", url: "https://shariyah.net/cryptocurrencies/bitcoin/" },
];
