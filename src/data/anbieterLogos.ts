/**
 * Schriftzug-Logos je Anbieter, lokal unter public/logos (Elias SEO74: „Ich würde die von mit dem Namen benutzen von
 * Finanzfluss“). Schlüssel ist die Domain wie in den Vergleichsdaten. Herkunft je Datei: docs/LOGOS.md. Fehlt eine
 * Domain hier, zeigt AnbieterLogo das runde Symbol von Logo.dev, sonst das Kürzel. `dunkel`: weißer Schriftzug, steht
 * auf schwarzem Grund wie beim Anbieter.
 */
export type LogoEintrag = {
  datei: string;
  dunkel?: boolean;
  /** Höhe der Schrift in Pixeln auf der Fläche 134 × 36, gemessen bei Finanzfluss (PH4, 16.11.2026). */
  hoehe?: number;
  /** Nur dieser Teil der Datei (links, oben, rechts, unten als Anteil), wenn sie einen Zusatz trägt, den Finanzfluss weglässt. */
  ausschnitt?: [number, number, number, number];
};

export const ANBIETER_LOGOS: Record<string, LogoEintrag> = {
  "1822direkt.de": { datei: "/logos/1822direkt.de.svg" },
  "21bitcoin.app": { datei: "/logos/21bitcoin.app.svg" },
  "bbbank.de": { datei: "/logos/bbbank.de.png", ausschnitt: [0.086, 0.209, 0.569, 0.842] },
  "bbva.de": { datei: "/logos/bbva.de.svg", hoehe: 21.7 },
  "berliner-volksbank.de": { datei: "/logos/berliner-volksbank.de.png", ausschnitt: [0, 0, 0.474, 1] },
  "binance.com": { datei: "/logos/binance.com.png" },
  "bisonapp.com": { datei: "/logos/bisonapp.com.svg" },
  "bitget.com": { datei: "/logos/bitget.com.png" },
  "bitpanda.com": { datei: "/logos/bitpanda.com.svg" },
  "bsdex.de": { datei: "/logos/bsdex.de.svg" },
  "buhl.de": { datei: "/logos/buhl.de.svg" },
  "coinbase.com": { datei: "/logos/coinbase.com.svg" },
  "commerzbank.de": { datei: "/logos/commerzbank.de.svg" },
  "comdirect.de": { datei: "/logos/comdirect.de.svg", hoehe: 18.0 },
  "degiro.de": { datei: "/logos/degiro.de.svg" },
  "dkb.de": { datei: "/logos/dkb.de.svg", hoehe: 22.8, ausschnitt: [0, 0, 1, 0.661] },
  "elster.de": { datei: "/logos/elster.de.svg" },
  "ethikbank.de": { datei: "/logos/ethikbank.de.png" },
  "etoro.com": { datei: "/logos/etoro.com.svg" },
  "finst.com": { datei: "/logos/finst.com.svg" },
  "finvesto.de": { datei: "/logos/finvesto.de.svg" },
  "flatex.de": { datei: "/logos/flatex.de.svg", hoehe: 19.2, ausschnitt: [0, 0, 1, 0.584] },
  "gls.de": { datei: "/logos/gls.de.svg" },
  "hypovereinsbank.de": { datei: "/logos/hypovereinsbank.de.svg" },
  "ing.de": { datei: "/logos/ing.de.svg", hoehe: 23.3, ausschnitt: [0, 0, 0.599, 0.804] },
  "justtrade.com": { datei: "/logos/justtrade.com.svg" },
  "klarna.com": { datei: "/logos/klarna.com.svg" },
  "kraken.com": { datei: "/logos/kraken.com.svg" },
  "lexware.de": { datei: "/logos/lexware.de.svg" },
  "meinebank.de": { datei: "/logos/meinebank.de.png", hoehe: 21.3, ausschnitt: [0.003, 0, 0.516, 0.971] },
  "musaffa.com": { datei: "/logos/musaffa.com.webp" },
  "n26.com": { datei: "/logos/n26.com.svg", hoehe: 29.8 },
  "norisbank.de": { datei: "/logos/norisbank.de.svg", hoehe: 22.5 },
  "okx.com": { datei: "/logos/okx.com.svg" },
  "openbank.de": { datei: "/logos/openbank.de.svg", hoehe: 34.9 },
  "postbank.de": { datei: "/logos/postbank.de.svg" },
  "relai.app": { datei: "/logos/relai.app.svg" },
  "sbroker.de": { datei: "/logos/sbroker.de.png", hoehe: 17.7 },
  "scalable.capital": { datei: "/logos/scalable.capital.svg", hoehe: 35.7 },
  "smartbrokerplus.de": { datei: "/logos/smartbrokerplus.de.svg", dunkel: true, hoehe: 11.8 },
  "smartsteuer.de": { datei: "/logos/smartsteuer.de.svg", dunkel: true },
  "steuer.check24.de": { datei: "/logos/steuer.check24.de.svg" },
  "steuergo.de": { datei: "/logos/steuergo.de.png" },
  "steuertipps.de": { datei: "/logos/steuertipps.de.png" },
  "taxfix.de": { datei: "/logos/taxfix.de.svg" },
  "tomorrow.one": { datei: "/logos/tomorrow.one.svg", hoehe: 16.7 },
  "tradegate.direct": { datei: "/logos/tradegate.direct.svg", hoehe: 17.9 },
  "traderepublic.com": { datei: "/logos/traderepublic.com.svg", hoehe: 10.7 },
  "tradersplace.de": { datei: "/logos/tradersplace.de.svg", hoehe: 23.6 },
  "umweltbank.de": { datei: "/logos/umweltbank.de.svg" },
  "vivid.money": { datei: "/logos/vivid.money.svg" },
  "wundertax.de": { datei: "/logos/wundertax.de.svg" },
  "bitvavo.com": { datei: "/logos/bitvavo.com.svg" },
  "crypto.com": { datei: "/logos/crypto.com.svg" },
  "robinhood.com": { datei: "/logos/robinhood.com.svg" },
  "finispia.com": { datei: "/logos/finispia.com.svg" },
  "islamicly.com": { datei: "/logos/islamicly.com.svg" },
  // PH4 (16.11.2026): fehlten, darum stand dort das runde Bild. Herkunft je Datei in docs/LOGOS.md.
  "bforbank.de": { datei: "/logos/bforbank.de.svg" },
  "bunq.com": { datei: "/logos/bunq.com.svg" },
  "c24.de": { datei: "/logos/c24.de.svg", hoehe: 28.1 },
  "captrader.com": { datei: "/logos/captrader.com.svg" },
  "consorsbank.de": { datei: "/logos/consorsbank.de.svg", hoehe: 34 },
  "deutsche-bank.de": { datei: "/logos/deutsche-bank.de.svg" },
  "fidelity.de": { datei: "/logos/fidelity.de.svg" },
  "finanzen.net": { datei: "/logos/finanzen.net.svg" },
  "genobroker.de": { datei: "/logos/genobroker.de.png" },
  "getbux.com": { datei: "/logos/getbux.com.svg" },
  "haspa.de": { datei: "/logos/haspa.de.svg" },
  "interactivebrokers.com": { datei: "/logos/interactivebrokers.com.svg" },
  "joebroker.de": { datei: "/logos/joebroker.de.svg" },
  "kt-bank.de": { datei: "/logos/kt-bank.de.svg" },
  "lohnsteuer-kompakt.de": { datei: "/logos/lohnsteuer-kompakt.de.svg" },
  "lynxbroker.de": { datei: "/logos/lynxbroker.de.svg" },
  "maxblue.de": { datei: "/logos/maxblue.de.svg" },
  "monese.com": { datei: "/logos/monese.com.svg" },
  "pax-bank.de": { datei: "/logos/pax-bank.de.png" },
  "psd-nuernberg.de": { datei: "/logos/psd-nuernberg.de.png", ausschnitt: [0.006, 0.012, 0.228, 0.992] },
  "revolut.com": { datei: "/logos/revolut.com.svg", hoehe: 15.6 },
  "targobank.de": { datei: "/logos/targobank.de.svg" },
  "willbe-invest.com": { datei: "/logos/willbe-invest.com.svg" },
  "wise.com": { datei: "/logos/wise.com.svg" },
  "xtb.com": { datei: "/logos/xtb.com.svg", hoehe: 28.8 },
  "zoya.finance": { datei: "/logos/zoya.finance.png" },
  // DACH1 (23.11.2026): Österreich und Schweiz. Herkunft je Datei in docs/LOGOS.md. ubs.com fehlt (Seite sperrt Abruf).
  "easybank.at": { datei: "/logos/easybank.at.svg" },
  "bank99.at": { datei: "/logos/bank99.at.svg" },
  "bawag.at": { datei: "/logos/bawag.at.svg" },
  "dad.at": { datei: "/logos/dad.at.png" },
  "coinfinity.co": { datei: "/logos/coinfinity.co.svg" },
  "home.saxo": { datei: "/logos/home.saxo.svg" },
  "swissquote.com": { datei: "/logos/swissquote.com.svg" },
  "neon-free.ch": { datei: "/logos/neon-free.ch.svg" },
  "migrosbank.ch": { datei: "/logos/migrosbank.ch.svg" },
};

/** Fläche, die ein Logo ohne Finanzfluss-Maß bekommt: so viel Schrift wie im Mittel bei Finanzfluss (rund 2.000 px²). */
const FLAECHE = 2000;
const MAX_BREITE = 134;
const MAX_HOEHE = 34;

/**
 * PH4 (16.11.2026, Elias: „die Logos alle anpassen, wie sie bei Finanzfluss sind … teilweise ein bisschen klein oder
 * komisch“): Finanzfluss legt jedes Logo auf dieselbe Fläche und setzt die Schrift von Hand optisch gleich groß.
 * Bisher zog AnbieterLogo jede Datei nur in den Kasten 134 × 36, lange Namen wurden winzig, kurze riesig. Hier: die
 * Schrift (ohne Rand der Datei, ohne Zusatz) bekommt die Höhe wie bei Finanzfluss oder, wo Finanzfluss den Anbieter
 * nicht zeigt, dieselbe Fläche. Ergebnis in Pixeln auf der Fläche 134 × 36.
 */
export const logoMass = (
  eintrag: LogoEintrag,
  masse: { bild: [number, number]; ink: [number, number, number, number] } | undefined,
): { breite: number; hoehe: number; ausschnitt: [number, number, number, number] } | undefined => {
  if (!masse) return undefined;
  const ausschnitt = eintrag.ausschnitt ?? masse.ink;
  const [x0, y0, x1, y1] = ausschnitt;
  const aspekt = ((x1 - x0) * masse.bild[0]) / ((y1 - y0) * masse.bild[1]);
  if (!(aspekt > 0)) return undefined;
  let hoehe = eintrag.hoehe ?? Math.min(26, Math.max(10, Math.sqrt(FLAECHE / aspekt)));
  let breite = hoehe * aspekt;
  if (breite > MAX_BREITE) {
    breite = MAX_BREITE;
    hoehe = breite / aspekt;
  }
  if (hoehe > MAX_HOEHE) {
    hoehe = MAX_HOEHE;
    breite = hoehe * aspekt;
  }
  return { breite: Math.round(breite * 10) / 10, hoehe: Math.round(hoehe * 10) / 10, ausschnitt };
};
