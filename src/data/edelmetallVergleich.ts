// Zwei Teile. Die Depots kommen aus brokerVergleich.ts (erzeugt) und werden hier nur nach Gold
// und Silber gelesen. Die drei Wege darunter sind von Hand gepflegt, jeder Wert hat eine Quelle
// mit Prüfdatum.
import type { VergleichsZeile } from "@/components/vergleich/vergleichTypen";
import type { RohAnbieter } from "./vergleichHelfer";
import { brokerVergleich, DEPOT_FINANZ_MAX, DEPOT_ZEILEN } from "./brokerVergleich";
import { ANLAGEN_KAUFBAR, ANLAGE_ZEILE } from "./anlagenKaufbar";
import { halalAnlagen } from "./halalAnlagen";

/**
 * Edelmetalle im Depot (Elias, 06.10.2026): dieselben Depots wie im Depot-Vergleich, noch einmal
 * nach Gold und Silber gerankt, so wie Finanzfluss Kinderdepot oder Geschäftskonto neben den
 * allgemeinen Vergleich stellt. Gezählt werden die physisch hinterlegten Gold- und Silber-ETCs
 * aus dem Halal-Anlagen-Vergleich, die beim Anbieter einzeln belegt kaufbar sind.
 *
 * Aufnahme: Zins-Tor nicht rot und mindestens ein belegtes Papier. Rote Depots stehen nur im
 * Depot-Vergleich (Aufnahmeregel vom 26.09.2026).
 */
const METALL_ISINS = Object.keys(ANLAGE_ZEILE).filter((isin) => ANLAGE_ZEILE[isin] === "halalEdelmetalle");
const kategorieVon = (isin: string) => halalAnlagen.find((a) => a.isin === isin)?.kategorie;
export const GOLD_ISINS = METALL_ISINS.filter((isin) => kategorieVon(isin) === "gold");
export const SILBER_ISINS = METALL_ISINS.filter((isin) => kategorieVon(isin) === "silber");

/** Kaufbeleg je ISIN. Ein Eintrag unter dem Tarif geht vor dem Hauseintrag, wie in anlagen_matrix.py. */
const belegt = (a: RohAnbieter, isin: string): boolean => {
  const e = ANLAGEN_KAUFBAR[isin];
  if (!e) return false;
  const vom = (keys: unknown[]) => e.kaufbar.some((k) => [k.haus, ...(k.haeuser ?? [])].some((h) => keys.includes(h)));
  const produkt = a.finanzfluss?.produkt;
  if (produkt && (vom([produkt]) || e.nichtImAngebot.includes(`${a.name} ${a.produkt}`))) return vom([produkt]);
  return vom([a.haus, produkt].filter(Boolean));
};

const depotZeile = (key: string): VergleichsZeile => DEPOT_ZEILEN.find((z) => z.key === key)!;

export const EDELMETALL_ZEILEN: VergleichsZeile[] = [
  { key: "__angebot", label: "Angebot", art: "text", gruppe: "angebot" },
  {
    ...depotZeile("zinsfreiAbStart"),
    hinweis: "Grün: das Guthaben liegt ab Eröffnung ohne Zins. Gelb: Zinsen laufen, lassen sich aber abschalten.",
  },
  {
    key: "gold",
    label: "Gold",
    art: "text",
    gruppe: "halal",
    imRaster: true,
    hinweis: `Wie viele der ${GOLD_ISINS.length} Gold-ETCs aus unserem Halal-Anlagen-Vergleich dort kaufbar sind. Hinter jedem liegen Barren im Tresor.`,
  },
  {
    key: "silber",
    label: "Silber",
    art: "text",
    gruppe: "halal",
    imRaster: true,
    hinweis: `Wie viele der ${SILBER_ISINS.length} Silber-ETCs aus unserem Halal-Anlagen-Vergleich dort kaufbar sind. Hinter jedem liegen Barren im Tresor.`,
  },
  depotZeile("orderkosten"),
  { ...depotZeile("depotgebuehr"), imRaster: false },
  ...["handelsplaetze", "kapest", "appIos", "appAndroid", "kundenservice", "bank"].map(depotZeile),
];

/**
 * Kosten für den Kauf eines Papiers: die Kriterien des Depot-Vergleichs ohne die Sparplan-Zeilen.
 * Ob ein ETC sparplanfähig ist, steht in keinem Beleg, also zählt es hier nicht.
 */
export const EDELMETALL_FINANZ_MAX: Record<string, number> = Object.fromEntries(
  ["depotgebuehr", "orderProzent", "orderPauschal", "handelsplaetze", "kapest", "kundenservice", "app"].map((k) => [k, DEPOT_FINANZ_MAX[k]]),
);

const anzahl = (a: RohAnbieter, isins: string[]) => {
  const n = isins.filter((isin) => belegt(a, isin)).length;
  const mindestens = String(a.werte.halalEdelmetalle ?? "").startsWith("mind.") && n < isins.length;
  return `${mindestens ? "mind. " : ""}${n} von ${isins.length}`;
};

export const edelmetallVergleich: RohAnbieter[] = brokerVergleich
  .filter((a) => !a.abgeraten && a.werte.zinsfreiAbStart !== "schlecht" && (a.halalAnlagenPunkte?.halalEdelmetalle ?? 0) > 0)
  .map((a) => ({
    ...a,
    werte: { ...a.werte, gold: anzahl(a, GOLD_ISINS), silber: anzahl(a, SILBER_ISINS) },
    quellen: { ...a.quellen, gold: a.quellen?.halalEdelmetalle, silber: a.quellen?.halalEdelmetalle } as RohAnbieter["quellen"],
  }));

export const EDELMETALL_FILTER = [
  { key: "gold", label: "Alle Gold-ETCs kaufbar", erlaubt: [`${GOLD_ISINS.length} von ${GOLD_ISINS.length}`] },
  { key: "silber", label: "Alle Silber-ETCs kaufbar", erlaubt: [`${SILBER_ISINS.length} von ${SILBER_ISINS.length}`] },
];

/* ------------------------------------------------------------------ Wege */

/**
 * Die drei Wege zu Gold und Silber, bei denen echtes Metall übergeben wird. Sie stehen als
 * Abschnitt unter dem Depot-Ranking und werden nicht gerankt.
 *
 * Die Regel dahinter steht in /wissen/halal-gold-kaufen: Bei Gold und Silber müssen Zahlung und
 * Übergabe zusammenfallen. Schuldverschreibungen und Wetten auf den Preis sind seit 26.09.2026
 * draußen (Elias, raw/2026-09-26-finanzmuslim-online-prio-3.md im Vault).
 */
export const WEGE_ZEILEN: VergleichsZeile[] = [
  { key: "__angebot", label: "Angebot", art: "text", gruppe: "angebot" },
  {
    key: "uebergabe",
    label: "Übergabe fällt mit der Zahlung zusammen",
    art: "ampel",
    gruppe: "halal",
    imRaster: true,
    hinweis:
      "Die Kernregel bei Gold und Silber. Grün: Du zahlst, und im selben Moment gehört dir bestimmtes Metall. Gelb: Es kommt auf den Vertrag an. Rot: Zwischen Zahlung und Metall liegt ein Versprechen.",
  },
  {
    key: "echtesMetall",
    label: "Echtes Metall dahinter",
    art: "ampel",
    gruppe: "halal",
    imRaster: true,
    hinweis:
      "Liegt hinter dem, was du kaufst, wirklich Metall, und ist es dir zugeordnet? Grün: ja, mit Nummer und Liste. Gelb: Metall liegt da, gehört dir aber nur als Anspruch. Rot: kein Metall, nur ein Kurs.",
  },
  {
    key: "nachweis",
    label: "Shariah-Nachweis vorhanden",
    art: "ampel",
    gruppe: "halal",
    imRaster: true,
    hinweis:
      "Gibt es ein Gutachten oder Zertifikat eines Gelehrtengremiums, das du selbst lesen kannst? Grün: ja, mindestens ein Anbieter auf diesem Weg hat eines. Rot: nein, keiner.",
  },
  {
    key: "ausliefern",
    label: "Ausliefern möglich",
    art: "ampel",
    gruppe: "halal",
    hinweis:
      "Kommst du an das Metall heran, wenn du es willst? Das ist die Probe darauf, ob hinter dem Papier wirklich Barren liegen.",
  },
  { key: "anbieter", label: "Wer das anbietet", art: "text", gruppe: "angebot" },
  { key: "kosten", label: "Was es kostet", art: "text", gruppe: "kosten", imRaster: true },
  { key: "einstieg", label: "Kleinster Einstieg", art: "text", gruppe: "kosten" },
  { key: "aufbewahrung", label: "Aufbewahrung", art: "text", gruppe: "kosten" },
  { key: "sparplan", label: "Monatlich möglich", art: "janein", gruppe: "kosten" },
  { key: "steuer", label: "Steuer nach einem Jahr", art: "text", gruppe: "kosten" },
];

const stand = "16.09.2026";
const artikel = { url: "/wissen/halal-gold-kaufen", stand, hinweis: "Hergeleitet aus der Regel zur sofortigen Übergabe, siehe unser Beitrag Halal Gold kaufen." };

export const EDELMETALL_WEGE: RohAnbieter[] = [
  {
    id: "barren-beim-haendler",
    name: "Barren und Münzen",
    produkt: "beim Händler",
    werte: {
      uebergabe: "gut",
      echtesMetall: "gut",
      nachweis: "gut",
      ausliefern: "gut",
      anbieter: "philoro, Degussa, pro aurum, Ophirum, dazu jeder Juwelier",
      kosten: "Aufschlag auf den Metallpreis, bei kleinen Einheiten deutlich höher",
      einstieg: "ab 1 Gramm, sinnvoll ab 10 Gramm",
      aufbewahrung: "selbst, oder Schließfach gegen Gebühr",
      sparplan: false,
      steuer: "steuerfrei",
    },
    quellen: {
      uebergabe: {
        stand,
        hinweis:
          "Der unstrittige Fall: Du zahlst und nimmst das Metall mit. Beim Versand gilt dasselbe, solange der Händler den Barren schon hat und die Lieferzeit kurz ist.",
      },
      echtesMetall: { stand, hinweis: "Du hältst den Barren in der Hand, mit Prägung, Gewicht und meist Nummer." },
      nachweis: {
        stand,
        hinweis:
          "Für den Kauf eines Barrens gegen sofortige Zahlung braucht es kein Produktzertifikat. Die Zulässigkeit folgt unmittelbar aus der Regel, darüber streitet niemand.",
      },
      ausliefern: { stand, hinweis: "Du hast es bereits." },
      anbieter: {
        url: "https://www.proaurum.de/shop/",
        stand,
        hinweis:
          "Große Häuser mit Filialen und Versand in Deutschland: philoro, Degussa, pro aurum und Ophirum. pro aurum und Ophirum betreiben mit pro aurum Tresorgold ein gemeinsames Lagerangebot.",
      },
      kosten: { stand, hinweis: "Kein Händler verkauft zum reinen Metallpreis. Der Abstand zwischen Ankaufs- und Verkaufspreis ist der tatsächliche Verlust am ersten Tag." },
      einstieg: { stand, hinweis: "Sehr kleine Einheiten kosten anteilig deutlich mehr Aufschlag." },
      steuer: {
        stand,
        hinweis:
          "Anlagegold ist beim Kauf von der Umsatzsteuer befreit, der Gewinn nach mehr als einem Jahr ist nach derzeitiger Rechtslage steuerfrei. Keine Steuerberatung.",
      },
    },
  },
  {
    id: "goldsparplan-mit-zuteilung",
    name: "Sparplan mit Zuteilung",
    produkt: "monatlich kaufen",
    werte: {
      uebergabe: "teils",
      echtesMetall: "gut",
      nachweis: "gut",
      ausliefern: "gut",
      anbieter: "INAIA mit Shariah-Zertifikat, daneben Auvesta und SOLIT ohne",
      kosten: "Aufschlag je Kauf, dazu Lagergebühr, bei INAIA 1 Euro im Monat",
      einstieg: "monatlich kleine Beträge",
      aufbewahrung: "Tresor des Anbieters, bei INAIA in Deutschland und der Schweiz",
      sparplan: true,
      steuer: "steuerfrei bei physischem Bestand",
    },
    quellen: {
      uebergabe: {
        stand,
        hinweis:
          "Kommt auf den Vertrag an. Sauber ist er, wenn für deine Einzahlung sofort gekauft und dir ein bestimmter Bestand zugeordnet wird. Die typischen Fallen sind eine Abschlussgebühr ohne Gegenleistung und Granulat statt eines bestimmbaren Barrens.",
      },
      echtesMetall: { stand, hinweis: "Das Metall liegt im Tresor und wird dem Kunden zugeordnet." },
      nachweis: {
        url: "https://www.inaia.finance/en/gold-dinar/",
        stand,
        hinweis:
          "INAIA, nach eigener Angabe Deutschlands erstes islamisches Fintech, lässt den Sparplan prüfen: „Verified and certified by Minhaj Shari'ah Financial Advisory in Dubai (UAE) according to the Islamic Finance criteria of AAOIFI.“ Für Auvesta und SOLIT haben wir keinen Shariah-Nachweis gefunden, das heißt nicht, dass ihre Verträge unzulässig sind, sondern dass du sie selbst prüfen musst.",
      },
      ausliefern: {
        url: "https://www.inaia.finance/en/gold-dinar/",
        stand,
        hinweis: "„Because your gold is physically present, we can also deliver it to your home upon request.“",
      },
      anbieter: {
        url: "https://www.inaia.finance/en/savings-plan/",
        stand,
        hinweis: "INAIA bietet Gold und Silber als Sparplan an. Auvesta und SOLIT sind die bekanntesten deutschen Anbieter ohne Shariah-Prüfung.",
      },
      kosten: { url: "https://www.inaia.finance/en/gold-dinar/", stand, hinweis: "INAIA: „a fixed price of only €1 per month per account, regardless of the quantity stored“. Der Aufschlag je Kauf steht dort nicht." },
      aufbewahrung: { url: "https://www.inaia.finance/en/gold-dinar/", stand, hinweis: "Hochsichere Tresore in Deutschland und in der Schweiz." },
      steuer: { stand, hinweis: "Physisch zugeordnetes Metall wird steuerlich wie ein Barren behandelt. Keine Steuerberatung." },
    },
  },
  {
    id: "zertifizierter-etc",
    name: "Zertifizierter ETC",
    produkt: "im Depot",
    werte: {
      uebergabe: "teils",
      echtesMetall: "gut",
      nachweis: "gut",
      ausliefern: "teils",
      anbieter: "Royal Mint, Invesco, WisdomTree, alle mit jährlichem Zertifikat",
      kosten: "0,12 bis 0,49 Prozent im Jahr, dazu die Ordergebühr",
      einstieg: "ein Anteil, oft unter 100 Euro",
      aufbewahrung: "Tresor der Verwahrstelle, bei RMAU die Royal Mint in Cardiff",
      sparplan: true,
      steuer: "meist Abgeltungsteuer",
    },
    quellen: {
      uebergabe: {
        stand,
        hinweis:
          "Der Streitpunkt. Dir wird Metall zugeordnet und es ist vom Vermögen des Anbieters getrennt, aber du hältst es nicht. Ein Teil der Gelehrten lässt das gelten, ein anderer nicht. Das Al-Qalam-Gremium schreibt in seinem WisdomTree-Bericht offen, dass die Abrechnung erst nach zwei Tagen erfolgt, und begründet, warum es das dennoch für vertretbar hält.",
      },
      echtesMetall: { stand, hinweis: "Physisch besichert mit nummerierten Barren, die Barrenlisten sind veröffentlicht." },
      nachweis: {
        url: "https://hanetf.com/wp-content/assets/The%20Royal%20Mint%20ETC%20-%20Shariah%20Compliance%20Cert%20-%202025.pdf",
        stand,
        hinweis:
          "Jährliche Zertifikate liegen vor: Amanie Advisors für den Royal-Mint-ETC und für die Invesco-ETCs, das Al-Qalam-Panel für die WisdomTree-Produkte. Alle sind in unserer Anlagen-Datenbank verlinkt.",
      },
      ausliefern: {
        url: "https://hanetf.com/de/fund/rmau-the-royal-mint-responsibly-sourced-physical-gold-etc/",
        stand,
        hinweis:
          "Nur bei wenigen Produkten. Der Royal-Mint-ETC ist die Ausnahme: Das Gold liegt im Tresor der Royal Mint in Cardiff statt bei einer Bank, und Privatanleger können sich Barren und Münzen ausliefern lassen. Bei den meisten anderen geht das nicht.",
      },
      anbieter: { url: "/halal-anlagen", stand, hinweis: "Sieben Gold- und Silberprodukte mit Zertifikat stehen in unserer Anlagen-Datenbank, dazu Platin, Palladium und ein Korb." },
      kosten: { url: "/halal-anlagen", stand, hinweis: "Laufende Kosten zwischen 0,12 und 0,49 Prozent im Jahr, je Produkt in der Datenbank ausgewiesen." },
      aufbewahrung: { url: "https://hanetf.com/de/fund/rmau-the-royal-mint-responsibly-sourced-physical-gold-etc/", stand, hinweis: "Beim Royal-Mint-ETC im Tresor der Royal Mint in Cardiff, außerhalb des Londoner Bankensystems." },
      steuer: {
        stand,
        hinweis:
          "Steuerfrei nach einem Jahr ist der Gewinn nur, wenn du dir das Metall ausliefern lassen kannst. Bei den meisten ETCs geht das nicht, dann greift die Abgeltungsteuer. Keine Steuerberatung.",
      },
    },
  },
];
