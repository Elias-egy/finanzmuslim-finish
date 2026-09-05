/**
 * Pure arithmetic for the calculators. No React, no formatting, so every
 * number can be checked in a unit test before it reaches the screen.
 *
 * Conventions: amounts in euro, rates in percent per year, terms in years
 * unless the name says months. Nothing here rounds; the components do.
 */

/** Monthly rate for the classic annuity, so the rate stays constant over the term. */
export const annuitaet = (summe: number, zinsProzent: number, jahre: number): number => {
  if (summe <= 0 || jahre <= 0) return 0;
  const n = Math.round(jahre * 12);
  const r = zinsProzent / 100 / 12;
  if (r === 0) return summe / n;
  return (summe * r) / (1 - (1 + r) ** -n);
};

export type KreditKosten = {
  /** monthly payment */
  rate: number;
  /** everything paid back over the term */
  gesamt: number;
  /** the part of it that is interest */
  zinsen: number;
  /** gesamt divided by summe, "das Haus kostet 1,66-mal" */
  faktor: number;
};

export const kreditKosten = (summe: number, zinsProzent: number, jahre: number): KreditKosten => {
  const rate = annuitaet(summe, zinsProzent, jahre);
  const gesamt = rate * Math.round(jahre * 12);
  const zinsen = Math.max(0, gesamt - summe);
  return { rate, gesamt, zinsen, faktor: summe > 0 ? gesamt / summe : 1 };
};

export type KreditJahr = {
  jahr: number;
  /** cumulative interest paid by the end of the year */
  zinsen: number;
  /** cumulative principal repaid by the end of the year */
  tilgung: number;
  /** remaining debt at the end of the year */
  rest: number;
};

/** Year-by-year split of the annuity into interest and principal. */
export const kreditVerlauf = (summe: number, zinsProzent: number, jahre: number): KreditJahr[] => {
  const rate = annuitaet(summe, zinsProzent, jahre);
  const r = zinsProzent / 100 / 12;
  const n = Math.round(jahre * 12);
  const reihe: KreditJahr[] = [{ jahr: 0, zinsen: 0, tilgung: 0, rest: summe }];
  let rest = summe;
  let zinsen = 0;
  let tilgung = 0;
  for (let m = 1; m <= n; m++) {
    const z = rest * r;
    const t = Math.min(rest, rate - z);
    zinsen += z;
    tilgung += t;
    rest -= t;
    if (m % 12 === 0 || m === n) {
      reihe.push({ jahr: Math.ceil(m / 12), zinsen, tilgung, rest: Math.max(0, rest) });
    }
  }
  return reihe;
};

/** Monthly growth factor for a yearly return, compounded monthly. */
const monatsFaktor = (renditeProzent: number) => (1 + renditeProzent / 100) ** (1 / 12);

/**
 * Months until the goal is reached, saving `monatlich` at the end of each
 * month on top of `start`. Null if it can never be reached (cap 100 years).
 */
export const sparMonate = (
  ziel: number,
  start: number,
  monatlich: number,
  renditeProzent: number,
): number | null => {
  if (start >= ziel) return 0;
  if (monatlich <= 0 && renditeProzent <= 0) return null;
  const q = monatsFaktor(renditeProzent);
  let stand = start;
  for (let m = 1; m <= 1200; m++) {
    stand = stand * q + monatlich;
    if (stand >= ziel) return m;
  }
  return null;
};

/** The monthly amount needed to reach `ziel` in exactly `monate` months. */
export const monatlichFuerZiel = (
  ziel: number,
  start: number,
  monate: number,
  renditeProzent: number,
): number => {
  if (start >= ziel) return 0;
  if (monate <= 0) return ziel - start;
  const q = monatsFaktor(renditeProzent);
  const startWert = start * q ** monate;
  const rest = ziel - startWert;
  if (rest <= 0) return 0;
  if (renditeProzent === 0) return rest / monate;
  // geometric series: sum of q^0 .. q^(n-1)
  const reihe = (q ** monate - 1) / (q - 1);
  return rest / reihe;
};

export type SparJahr = { monat: number; stand: number; eingezahlt: number };

/** Balance at the end of each month, from 0 to `monate`. */
export const sparVerlauf = (
  start: number,
  monatlich: number,
  renditeProzent: number,
  monate: number,
): SparJahr[] => {
  const q = monatsFaktor(renditeProzent);
  const reihe: SparJahr[] = [{ monat: 0, stand: start, eingezahlt: start }];
  let stand = start;
  let eingezahlt = start;
  for (let m = 1; m <= monate; m++) {
    stand = stand * q + monatlich;
    eingezahlt += monatlich;
    reihe.push({ monat: m, stand, eingezahlt });
  }
  return reihe;
};

export type Budget = {
  /** housing + fixed costs, the "needs" */
  noetig: number;
  /** everyday and leisure, the "wants" */
  wuensche: number;
  /** what is left, never below zero */
  frei: number;
  freiProzent: number;
  /** how much the spending exceeds the income, zero if it does not */
  minus: number;
  /** 50/30/20 targets for this income */
  ziel: { noetig: number; wuensche: number; sparen: number };
};

export const budgetAufteilung = (
  netto: number,
  wohnen: number,
  fix: number,
  alltag: number,
): Budget => {
  const noetig = wohnen + fix;
  const wuensche = alltag;
  const rest = netto - noetig - wuensche;
  const frei = Math.max(0, rest);
  return {
    noetig,
    wuensche,
    frei,
    freiProzent: netto > 0 ? (frei / netto) * 100 : 0,
    minus: Math.max(0, -rest),
    ziel: { noetig: netto * 0.5, wuensche: netto * 0.3, sparen: netto * 0.2 },
  };
};
