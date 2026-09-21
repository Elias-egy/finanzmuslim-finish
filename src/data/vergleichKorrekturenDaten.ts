import type { Quelle } from "@/components/vergleich/vergleichTypen";
import type { RohWert } from "./vergleichHelfer";

/**
 * Redaktionelle Korrekturen zu den erzeugten Vergleichsdateien. HANDGEPFLEGT.
 *
 * `bauen.py` in ~/rebrand/data/vergleiche erzeugt brokerVergleich.ts, girokontoVergleich.ts,
 * kryptoVergleich.ts und anlagenKaufbar.ts neu, fasst diese Datei aber nie an. Jede Korrektur
 * hier überlebt also einen neuen Datenlauf. Positive Zins- und Bezahlmodell-Werte greifen nur mit
 * einem Eintrag in den *_QUELLEN (siehe vergleichKorrekturen.ts).
 */

type Werte = Record<string, Partial<Record<string, RohWert>>>;
type Quellen = Record<string, Record<string, Quelle>>;

const kryptoOptIn = {
  zinsfreiAbStart: "gut" as const,
  zinsfreiesModell: "gut" as const,
};

export const DEPOT_WERTE: Werte = {
  "bux-basic": { zinsfreiAbStart: "gut" },
  "consorsbank-depot": { zinsfreiAbStart: "gut" },
  "etoro-depot": { zinsfreiAbStart: "gut" },
  "revolut-standard": { zinsfreiAbStart: "gut" },
  "scalable-capital-prime-plus-broker": { zinsfreiAbStart: "gut" },
  "trading-212-depot": { zinsfreiAbStart: "gut" },
  "vivid-standard": { zinsfreiAbStart: "gut" },
  "trade-republic-depot": { zinsfreiAbStart: "gut", halalEdelmetalle: "mind. 6 von 8" },
};

export const DEPOT_QUELLEN: Quellen = {
  "bux-basic": { zinsfreiAbStart: { url: "https://getbux.com/de/preise/", stand: "20.09.2026", hinweis: "Das kostenlose BUX-Basic-Modell enthält keine automatische Verzinsung des nicht investierten Guthabens." } },
  "consorsbank-depot": { zinsfreiAbStart: { url: "https://www.consorsbank.de/web/Sparen-Anlegen/Sparen/Tagesgeld", stand: "20.09.2026", hinweis: "Die Verzinsung gehört zum separat eröffneten Tagesgeldkonto, nicht zum Verrechnungskonto des Depots." } },
  "etoro-depot": { zinsfreiAbStart: { url: "https://www.etoro.com/de/investing/interest-on-balance/", stand: "20.09.2026", hinweis: "Zinsen werden über ein eigenes Interest-on-Balance-Angebot nach Aktivierung gezahlt." } },
  "revolut-standard": { zinsfreiAbStart: { url: "https://www.revolut.com/de-DE/legal/terms/", stand: "20.09.2026", hinweis: "Revolut weist für das Standardkonto keine automatische Verzinsung des Guthabens aus." } },
  "scalable-capital-prime-plus-broker": { zinsfreiAbStart: { url: "https://de.scalable.capital/zinsuebersicht", stand: "20.09.2026", hinweis: "Das Verrechnungskonto wird mit 0 % p. a. geführt; das separate Tagesgeld muss aktiv gewählt und befüllt werden." } },
  "trading-212-depot": { zinsfreiAbStart: { url: "https://www.trading212.com/de/invest", stand: "20.09.2026", hinweis: "Die Verzinsung freier Mittel ist ein aktivierbares Zusatzangebot und nicht automatisch voreingestellt." } },
  "vivid-standard": { zinsfreiAbStart: { url: "https://vivid.money/de-de/personal/interest-rate-pocket/", stand: "20.09.2026", hinweis: "Der Ertrag setzt ein Interest-Rate-Pocket und eine eigene Einzahlung voraus." } },
  "trade-republic-depot": {
    zinsfreiAbStart: {
      url: "https://traderepublic.com/de-de/zinsen",
      stand: "20.09.2026",
      hinweis: "„Aktiviere Zinsen in der App“; Zinsen laufen nicht ohne eigene Aktivierung.",
    },
    halalEdelmetalle: {
      url: "https://assets.traderepublic.com/assets/files/DE/Instrument_Universe_DE_de.pdf",
      stand: "20.09.2026",
      hinweis: "Sechs Edelmetall-ISINs bestätigt; IE00B579F325 und XS3384723154 stehen zwar im Katalog, bleiben wegen des App-Widerspruchs ungeklärt.",
    },
  },
};

export const GIRO_WERTE: Werte = {
  "bforbank-bforbasic-konto": { keinDispoAbStart: "gut" },
  "1822direkt-girodirekt": { zinsfreiAbStart: "gut" },
  "ing-girokonto": { zinsfreiAbStart: "gut" },
  "ing-girokonto-future": { zinsfreiAbStart: "gut" },
  "norisbank-top-girokonto": { zinsfreiAbStart: "gut" },
  "revolut-standard": { zinsfreiAbStart: "gut" },
  "revolut-plus": { zinsfreiAbStart: "gut" },
  "revolut-premium": { zinsfreiAbStart: "gut" },
  "revolut-metal": { zinsfreiAbStart: "gut" },
  "revolut-ultra": { zinsfreiAbStart: "gut" },
  "tomorrow-now": { zinsfreiAbStart: "gut" },
  "tomorrow-change": { zinsfreiAbStart: "gut" },
  "tomorrow-plus": { zinsfreiAbStart: "gut" },
  "vivid-standard": { zinsfreiAbStart: "gut" },
  "vivid-plus": { zinsfreiAbStart: "gut" },
  "vivid-prime": { zinsfreiAbStart: "gut" },
};

export const GIRO_QUELLEN: Quellen = {
  "bforbank-bforbasic-konto": { keinDispoAbStart: { url: "https://www.bforbank.com/de/haeufig-gestellte-fragen?category=karte&page=4", stand: "21.09.2026", hinweis: "BforBank: Ein Dispositionskredit ist aktuell nicht verfügbar." } },
  "1822direkt-girodirekt": { zinsfreiAbStart: { url: "https://www.1822direkt.de/sparen/tagesgeldkonto/", stand: "20.09.2026", hinweis: "Das automatisch eröffnete Tagesgeldkonto bleibt ohne Einzahlung leer; verzinst wird nur dessen Guthaben." } },
  "ing-girokonto": { zinsfreiAbStart: { url: "https://www.ing.de/girokonto/kundenservice/", stand: "20.09.2026", hinweis: "Das Extra-Konto wird als separates Konto eröffnet; eine Verzinsung setzt eine eigene Einzahlung voraus." } },
  "ing-girokonto-future": { zinsfreiAbStart: { url: "https://www.ing.de/girokonto/kundenservice/", stand: "20.09.2026", hinweis: "Das Extra-Konto wird als separates Konto eröffnet; eine Verzinsung setzt eine eigene Einzahlung voraus." } },
  "norisbank-top-girokonto": { zinsfreiAbStart: { url: "https://www.norisbank.de/produkte/girokonto.html", stand: "20.09.2026", hinweis: "Das optionale Top-Zinskonto ist ein separates Konto und wird erst durch eine eigene Einzahlung relevant." } },
};

export const KRYPTO_WERTE: Werte = {
  "binance-pro": kryptoOptIn,
  "binance-standard": kryptoOptIn,
  "bison-app": kryptoOptIn,
  "bitget-trading": kryptoOptIn,
  "bitvavo-standard": kryptoOptIn,
  "coinbase-advanced": kryptoOptIn,
  "coinbase-standard": kryptoOptIn,
  "etoro-krypto": kryptoOptIn,
  "finanzen-net-zero-krypto": kryptoOptIn,
  "finst-standard": kryptoOptIn,
  "flatex-krypto": kryptoOptIn,
  "justtrade-krypto": kryptoOptIn,
  "kraken-pro": kryptoOptIn,
  "kraken-standard": kryptoOptIn,
  "okx-trading": kryptoOptIn,
  "revolut-krypto": kryptoOptIn,
  "scalable-capital-krypto": kryptoOptIn,
  "smartbroker-plus-krypto": kryptoOptIn,
  "trade-republic-krypto": kryptoOptIn,
  "traders-place-krypto": kryptoOptIn,
};

export const KRYPTO_QUELLEN: Quellen = {
  "bitvavo-standard": {
    zinsfreiAbStart: { url: "https://support.bitvavo.com/hc/de/articles/4405227858449", stand: "20.09.2026", hinweis: "Bitvavo beschreibt Erträge als aktivierbare Funktion; ohne Aktivierung wird das Guthaben nicht automatisch verzinst." },
    zinsfreiesModell: { url: "https://support.bitvavo.com/hc/de/articles/4405243949841-Staking-at-Bitvavo", stand: "21.09.2026", hinweis: "Schriftlich bestätigt vom Bitvavo-Kundenservice am 18.09.2026 (Ticket #1934199): „es gibt bei uns kein Kontomodell, das automatisch Zinsen auf ungenutztes Euro-Guthaben generiert“. „Auto Earn“ ist „nicht automatisch aktiv“, Margin- und Hebelhandel sind „bei Kontoeröffnung nicht aktiviert“." },
  },
  "smartbroker-plus-krypto": {
    zinsfreiAbStart: { url: "https://www.smartbrokerplus.de/de-de/kryptowaehrungen-kaufen/", stand: "21.09.2026", hinweis: "Schriftlich bestätigt vom Smartbroker+-Kundenservice am 16.09.2026: „Das Guthaben auf dem Zinskonto wird nicht verzinst. Wir bieten dafür ein Zinskonto an, was Sie eröffnen können aber nicht müssen.“ Gemeint ist das Verrechnungskonto; das Zinskonto ist freiwillig." },
    zinsfreiesModell: { url: "https://www.smartbrokerplus.de/de-de/kryptowaehrungen-kaufen/", stand: "21.09.2026", hinweis: "Schriftlich bestätigt vom Smartbroker+-Kundenservice am 16.09.2026: „Das Konto kann auch ohne Kreditfunktionen genutzt werden.“ Das Zinskonto ist freiwillig." },
  },
};

/** Kaufbar-Treffer, die trotz Beleg bis zur Gegenprobe nicht gezeigt werden: ISIN -> Anbieter.
 *  Die beiden TR-Invesco-Goldtreffer stehen im öffentlichen Katalog, widersprechen aber der App. */
export const KAUFBAR_UNKLAR: Record<string, string[]> = {
  IE00B579F325: ["Trade Republic"],
  XS3384723154: ["Trade Republic"],
};
