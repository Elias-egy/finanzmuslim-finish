import type { RohAnbieter } from "./vergleichHelfer";

/** Aktuelle Produktnamen und neue Produkte bis zum nächsten geprüften Datenimport. */
export const girokontoNachtraege = (anbieter: RohAnbieter[]): RohAnbieter[] => [
  ...anbieter.map((a) => a.id === "bforbank-bforbasic-konto" ? {
    ...a,
    name: "BforBank",
    produkt: "Girokonto",
    finanzfluss: a.finanzfluss ? { ...a.finanzfluss, produkt: "BforBank Girokonto" } : undefined,
  } : a),
  {
    id: "sumup-privatkonto",
    name: "SumUp",
    produkt: "Privatkonto",
    domain: "sumup.com",
    haus: "sumup",
    finanzfluss: { produkt: "SumUp", partnerlink: null },
    werte: {
      zinsfreiAbStart: null,
      keinDispoAbStart: null,
      karteOhneKredit: "gut",
      kontofuehrung: "0€",
      debitkarte: "Mastercard, 0€",
      applePay: true,
    },
    quellen: {
      karteOhneKredit: { url: "https://www.sumup.com/de-de/privat/konto/", stand: "21.09.2026", hinweis: "SumUp bezeichnet die SumUp Pay Mastercard als Debitkarte." },
      kontofuehrung: { url: "https://www.sumup.com/de-de/privat/konto/", stand: "21.09.2026", hinweis: "SumUp bewirbt das Privatkonto als kostenlos." },
      debitkarte: { url: "https://www.sumup.com/de-de/privat/konto/", stand: "21.09.2026", hinweis: "SumUp nennt eine kostenlose Mastercard." },
      applePay: { url: "https://www.sumup.com/de-de/privat/konto/", stand: "21.09.2026", hinweis: "SumUp nennt Apple Pay und Google Pay." },
    },
    finanzPunkte: {},
    note: null,
    abgeraten: false,
  },
];
