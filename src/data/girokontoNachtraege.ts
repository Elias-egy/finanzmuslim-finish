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
      karteOhneKredit: null,
    },
    quellen: {},
    finanzPunkte: {},
    note: null,
    abgeraten: false,
  },
];
