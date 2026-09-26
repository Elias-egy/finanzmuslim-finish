/**
 * Belegte Zahlen für den Budget- und Sparzielrechner.
 *
 * Jede Zahl hat Quelle und Stand. Kein Live-Abruf, wird von Hand nachgezogen,
 * das Datum steht daneben und auf der Seite. Wer eine Zahl ändert, ändert die
 * Quelle mit.
 */

export type Quelle = { name: string; url: string; stand: string };

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
