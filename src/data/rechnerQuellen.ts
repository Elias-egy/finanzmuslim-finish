/**
 * Belegte Zahlen für den Kreditkosten-, Budget- und Sparzielrechner.
 *
 * Jede Zahl hat Quelle und Stand. Kein Live-Abruf, wird von Hand nachgezogen,
 * das Datum steht daneben und auf der Seite. Wer eine Zahl ändert, ändert die
 * Quelle mit.
 */

export type Quelle = { name: string; url: string; stand: string };

/** Effektivzinssatz Wohnungsbaukredite an private Haushalte, Neugeschäft, alle
 *  Zinsbindungen. Reihe BBIM1.M.DE.B.A2C.A.R.A.2250.EUR.N. */
export const bauzins = {
  prozent: 3.94,
  monat: "Juli 2026",
  quelle: {
    name: "Deutsche Bundesbank, Zinsstatistik, Wohnungsbaukredite an private Haushalte",
    url: "https://www.bundesbank.de/de/statistiken/geld-und-kapitalmaerkte/zinssaetze-und-renditen/wohnungsbaukredite-an-private-haushalte-hypothekarkredite-auf-wohngrundstuecke-615036",
    stand: "Juli 2026, veröffentlicht 02.09.2026",
  } satisfies Quelle,
};

/** Sparquote der privaten Haushalte, saisonbereinigt. */
export const sparquote = {
  prozent: 10.3,
  zeitraum: "1. Halbjahr 2025",
  vorjahr: 11.1,
  quelle: {
    name: "Statistisches Bundesamt, Pressemitteilung N059 vom 28.10.2025",
    url: "https://www.destatis.de/DE/Presse/Pressemitteilungen/2025/10/PD25_N059_81.html",
    stand: "1. Halbjahr 2025, abgerufen 06.09.2026",
  } satisfies Quelle,
};

/** Die 50/30/20-Faustregel. */
export const faustregel = {
  noetig: 50,
  wuensche: 30,
  sparen: 20,
  quelle: {
    name: "Elizabeth Warren und Amelia Warren Tyagi, All Your Worth, 2005",
    url: "https://www.acorns.com/learn/saving/50-30-20-budget-rule/",
    stand: "Buch von 2005, Regel unverändert",
  } satisfies Quelle,
};
