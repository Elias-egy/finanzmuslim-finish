/**
 * Kurzform der Kosten fuer Tabelle, Karten und den Kasten "Unsere Nummer 1". Drei Zahlen in einer
 * Zelle verwirren ("knapp 5 Euro plus 0,25 % in Klammern mindestens 9,95, max 69 Euro", Elias,
 * 15.10.2026). Die Kurzform nennt, was eine Order beim Anbieter mindestens kostet; jede Zahl steht
 * so im belegten Satz, nichts ist neu gerechnet. Der ganze Satz bleibt beim aufgeklappten Angebot
 * ("genau"). Fehlt eine Kurzform, steht der ganze Satz wie bisher.
 */
export const KOSTEN_KURZ: Record<string, Record<string, string>> = {
  "bbbank-depot": { orderkosten: "ab 9,90€" },
  "bux-basic": { orderkosten: "ab 0,99€" },
  "comdirect-depot": { orderkosten: "3,90€ für Neukunden" },
  "commerzbank-direktdepot": { orderkosten: "ab 9,90€" },
  "commerzbank-klassikdepot": { orderkosten: "ab 49,90€" },
  "consorsbank-depot": { orderkosten: "ab 9,95€" },
  "degiro-depot": { orderkosten: "ab 1€" },
  "etoro-depot": { orderkosten: "0$ bei ETFs" },
  "finanzen-net-zero-depot": { orderkosten: "0€ ab 500€" },
  "finvesto-depot": { orderkosten: "1,99€ bis März 2027" },
  "finvesto-depot-basis": { orderkosten: "1,99€ bis März 2027" },
  "flatex-depot": { orderkosten: "ab 5,90€" },
  "freedom24-all-inclusive": { orderkosten: "ab 1,20€ + 0,5%" },
  "freedom24-smart": { orderkosten: "ab 2€" },
  "geno-broker-genobasis-depot": { orderkosten: "ab 9,95€" },
  "geno-broker-genoprofi": { orderkosten: "ab 9,95€" },
  "gls-bank-depot": { orderkosten: "ab 15€" },
  "justtrade-depot": { orderkosten: "1€ plus Spread" },
  "maxblue-depot": { orderkosten: "ab 8,90€" },
  "pax-bank-klassisches-depot": { orderkosten: "ab 50€" },
  "pax-bank-online-brokerage": { orderkosten: "ab 10€" },
  "plus500-depot": { orderkosten: "ab 2€" },
  "revolut-standard": { orderkosten: "ab 1€" },
  "santander-wertpapierdepot": { orderkosten: "ab 7,90€" },
  "scalable-capital-free-broker": { orderkosten: "0,99€, ETF-Kauf ab 250€: 0€" },
  "scalable-capital-prime-plus-broker": { orderkosten: "0€ ab 250€" },
  "smartbroker-plus-depot": { orderkosten: "0€ ab 500€" },
  "traders-place-depot": { orderkosten: "0€ ab 500€" },
  "1822direkt-aktiv-depot": { orderkosten: "ab 9,90€" },
  "captrader-depot": { orderkosten: "ab 4€" },
  "hypovereinsbank-hvb-depot": { orderkosten: "ab 20€" },
  "hypovereinsbank-smartdepot": { orderkosten: "ab 8,90€" },
  "ing-direkt-depot": { orderkosten: "ab 4,90€" },
  "interactive-brokers-depot": { orderkosten: "ab 1,25€" },
  "lynx-depot": { orderkosten: "ab 5$" },
};

export const kostenKurz = (anbieterId: string, key: string): string | undefined => KOSTEN_KURZ[anbieterId]?.[key];
