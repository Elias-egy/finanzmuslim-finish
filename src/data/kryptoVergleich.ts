import type { VergleichsZeile } from "@/components/vergleich/vergleichTypen";
import { halalAnlagen } from "./halalAnlagen";
import type { RohAnbieter, RohWert } from "./vergleichHelfer";

/**
 * Anbieterdaten fuer den Krypto-Vergleich.
 *
 * Aufbau und Regeln wie in `brokerVergleich.ts`: jede inhaltliche Angabe ist
 * `null` und erscheint wörtlich als "noch nicht geprüft". Keine Schätzungen.
 *
 * Kriterien beschlossen am 14.09.2026, Herleitung in
 * `~/rebrand/KRITERIEN_VERGLEICHE.md`. Fast jede Börse bietet auch Hebel,
 * Futures oder Staking an. Das ist kein Minuspunkt. Gefragt wird nur, ob man
 * ab Start zinsfrei nutzen kann, wie viele unserer Halal-Coins es echt gibt
 * und ob man sie auf eine eigene Wallet holen kann. Staking wird nicht
 * einbezogen.
 *
 * Anbieter: alle 27 Produkte aus dem Finanzfluss-Krypto-Börsen-Vergleich,
 * Stand 14.09.2026, alphabetisch.
 *
 * Noch ohne eigene Seite und Route.
 */

/** Die Coins aus dem Halal-Anlagen-Vergleich, gegen die gezählt wird. */
const HALAL_COINS = halalAnlagen.filter((a) => a.kategorie === "krypto").map((a) => a.name);

export const KRYPTO_ZEILEN: VergleichsZeile[] = [
  { key: "__angebot", label: "Angebot", art: "text", gruppe: "angebot" },
  {
    key: "__note",
    label: "Halal-Note",
    art: "text",
    gruppe: "angebot",
    hinweis: "Wird erst vergeben, wenn alle Merkmale geprüft sind.",
  },

  {
    key: "zinsfreiAbStart",
    label: "Zinsfrei ab Start",
    art: "ampel",
    gruppe: "halal",
    imRaster: true,
    hinweis:
      "Bleiben Guthaben und Coins ohne Zins, Earn oder Lending, ohne dass du etwas abwählen musst?",
  },
  {
    key: "halalCoins",
    label: "Halal-Coins",
    art: "text",
    gruppe: "halal",
    imRaster: true,
    hinweis: `Wie viele der ${HALAL_COINS.length} Coins aus unserem Halal-Anlagen-Vergleich (${HALAL_COINS.join(", ")}) dort echt kaufbar sind, nicht als ETN oder CFD.`,
  },
  {
    key: "eigeneWallet",
    label: "Auszahlung auf eigene Wallet",
    art: "ampel",
    gruppe: "halal",
    hinweis: "Kannst du deine Coins auf eine eigene Wallet übertragen?",
  },

  { key: "anzahlCoins", label: "Anzahl Kryptowährungen", art: "text", gruppe: "kosten" },
  { key: "gesamtkosten", label: "Gesamtkosten pro 500 €", art: "text", gruppe: "kosten", imRaster: true },
  { key: "transparenteKosten", label: "Transparente Kosten", art: "janein", gruppe: "kosten" },
  { key: "auszahlungBitcoin", label: "Kosten Auszahlung Bitcoin", art: "text", gruppe: "kosten", imRaster: true },
  { key: "sparplan", label: "Sparplan möglich", art: "janein", gruppe: "kosten" },
  { key: "regulierung", label: "Regulierung", art: "text", gruppe: "kosten" },
  { key: "standort", label: "Anbieterstandort", art: "text", gruppe: "kosten" },
  { key: "sicherheit", label: "Sicherheitsfeatures", art: "text", gruppe: "kosten" },
  { key: "ident", label: "Ident-Verfahren", art: "text", gruppe: "kosten" },
  { key: "einzahlung", label: "Einzahlungswege", art: "text", gruppe: "kosten" },
  { key: "mindestbetrag", label: "Mindestbetrag", art: "text", gruppe: "kosten" },
  { key: "steuerbericht", label: "Kostenloser Steuerbericht", art: "janein", gruppe: "kosten" },
  { key: "appBewertung", label: "App-Bewertung", art: "text", gruppe: "kosten" },
];

const leer = (): Record<string, RohWert> =>
  Object.fromEntries(
    KRYPTO_ZEILEN.filter((z) => !z.key.startsWith("__")).map((z) => [z.key, null]),
  );

const slug = (name: string) =>
  name
    .toLowerCase()
    .replace(/\+/g, "-plus")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const platzhalter = (name: string, produkt: string, domain?: string): RohAnbieter => ({
  id: slug(`${name} ${produkt}`),
  name,
  produkt,
  domain,
  note: null,
  werte: leer(),
});

const anbieter: RohAnbieter[] = [
  platzhalter("21bitcoin", "App", "21bitcoin.app"),
  platzhalter("Binance", "Standard", "binance.com"),
  platzhalter("Binance", "Pro", "binance.com"),
  platzhalter("Bison", "App", "bisonapp.com"),
  platzhalter("Bitget", "Trading", "bitget.com"),
  platzhalter("Bitpanda", "Standard", "bitpanda.com"),
  platzhalter("Bitpanda", "Fusion", "bitpanda.com"),
  platzhalter("Bitvavo", "Standard", "bitvavo.com"),
  platzhalter("BSDEX", "Standard", "bsdex.de"),
  platzhalter("Coinbase", "Standard", "coinbase.com"),
  platzhalter("Coinbase", "Advanced", "coinbase.com"),
  platzhalter("crypto.com", "App", "crypto.com"),
  platzhalter("eToro", "Krypto", "etoro.com"),
  platzhalter("finanzen.net zero", "Krypto", "finanzen.net"),
  platzhalter("Finst", "Standard", "finst.com"),
  platzhalter("flatex", "Krypto", "flatex.de"),
  platzhalter("justTRADE", "Krypto", "justtrade.com"),
  platzhalter("Kraken", "Standard", "kraken.com"),
  platzhalter("Kraken", "Pro", "kraken.com"),
  platzhalter("OKX", "Trading", "okx.com"),
  platzhalter("Relai", "App", "relai.app"),
  platzhalter("Revolut", "Krypto", "revolut.com"),
  platzhalter("Robinhood", "Krypto", "robinhood.com"),
  platzhalter("Scalable Capital", "Krypto", "scalable.capital"),
  platzhalter("Smartbroker+", "Krypto", "smartbrokerplus.de"),
  platzhalter("Trade Republic", "Krypto", "traderepublic.com"),
  platzhalter("Traders Place", "Krypto", "tradersplace.de"),
];

const alphabetisch = (a: RohAnbieter, b: RohAnbieter) =>
  `${a.name} ${a.produkt}`.localeCompare(`${b.name} ${b.produkt}`, "de", { sensitivity: "base" });

export const kryptoVergleich: RohAnbieter[] = [...anbieter].sort(alphabetisch);

export const KRYPTO_FILTER = [
  { key: "zinsfreiAbStart", label: "Zinsfrei ab Start" },
  { key: "eigeneWallet", label: "Auszahlung auf eigene Wallet" },
];
