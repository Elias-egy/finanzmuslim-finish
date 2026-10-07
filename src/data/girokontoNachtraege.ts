import { mitKontopreisen } from "./kontopreise";
import type { RohAnbieter } from "./vergleichHelfer";

/**
 * Aktuelle Produktnamen und neue Produkte bis zum nächsten geprüften Datenimport.
 * Danach die beim Anbieter geprüfte Kontoführung (`kontopreise.ts`).
 */
export const girokontoNachtraege = (anbieter: RohAnbieter[]): RohAnbieter[] => mitKontopreisen([
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
      girocard: "keine Girocard",
      debitkarte: "Mastercard, 0€",
      applePay: true,
      abhebungen: "3",
      bargeldEinzahlen: "nicht möglich",
      sepaKostenlos: true,
      kundenservice: "E-Mail",
      filialen: false,
      appIos: "4,5 / 5",
      appAndroid: "4,5 / 5",
      ident: "Ausweisfoto und Selfie",
      kontowechsel: false,
    },
    quellen: {
      karteOhneKredit: { url: "https://www.sumup.com/de-de/privat/konto/", stand: "21.09.2026", hinweis: "SumUp bezeichnet die SumUp Pay Mastercard als Debitkarte." },
      kontofuehrung: { url: "https://www.sumup.com/de-de/privat/konto/", stand: "21.09.2026", hinweis: "SumUp bewirbt das Privatkonto als kostenlos." },
      debitkarte: { url: "https://www.sumup.com/de-de/privat/konto/", stand: "27.09.2026", hinweis: "SumUp auf der Kontoseite: „Eine echte Karte für die echte Welt. Deine kostenlose SumUp Mastercard funktioniert überall auf der ganzen Welt – in Geschäften, Restaurants und an Geldautomaten.“ Die physische Karte bestellt man in der App („Physische Karte bestellen“)." },
      girocard: { url: "https://www.sumup.com/de-de/privat/konto/", stand: "27.09.2026", hinweis: "SumUp nennt nur die SumUp Mastercard, keine Girocard." },
      applePay: { url: "https://www.sumup.com/de-de/privat/konto/", stand: "27.09.2026", hinweis: "SumUp: „Mit Apple Pay und Google Pay bezahlen“." },
      abhebungen: { url: "https://www.sumup.com/de-de/privat/legal/fee-schedule/", stand: "27.09.2026", hinweis: "SumUp Kostenübersicht: „Monatliche Barabhebungen an Geldautomaten in Deutschland 3x kostenlos“, „Zusätzliche Abhebungen am Geldautomaten 2 % Gebühren“." },
      bargeldEinzahlen: { url: "https://www.sumup.com/de-de/privat/rechtliches/agb/", stand: "27.09.2026", hinweis: "SumUp AGB 7.2: Aufladen per „Banküberweisung von einem Konto“, „Debit- oder Kreditkarte auf Ihren Namen“ oder sonstige Zahlungsmethoden auf den eigenen Namen. Bargeld ist nicht vorgesehen." },
      sepaKostenlos: { url: "https://www.sumup.com/de-de/privat/legal/fee-schedule/", stand: "27.09.2026", hinweis: "SumUp Kostenübersicht: „Geld verschicken 0 €“. AGB 4.2 (c): das Wallet dient auch dazu, „Zahlungen auf Bankkonten zu tätigen oder Zahlungen von Bankkonten zu erhalten, falls diese Bankkonten durch das SEPA-Clearing-System erreichbar sind“." },
      kundenservice: { url: "https://www.sumup.com/de-de/privat/support/", stand: "27.09.2026", hinweis: "Die Supportseite verweist auf das Support-Team per Mail (paysupport@sumup.com), die AGB auf die „Support-Antragsfunktion („Support Request“) in der App“. Telefon oder Chat nennt SumUp für das Privatkonto nicht." },
      appIos: { url: "https://www.sumup.com/de-de/privat/konto/", stand: "27.09.2026", hinweis: "SumUp zeigt auf der Kontoseite 4,5 Sterne im App Store (3.000 Bewertungen)." },
      appAndroid: { url: "https://www.sumup.com/de-de/privat/konto/", stand: "27.09.2026", hinweis: "SumUp zeigt auf der Kontoseite 4,5 Sterne bei Google Play (2.490 Bewertungen)." },
      ident: { url: "https://www.sumup.com/de-de/privat/support/", stand: "27.09.2026", hinweis: "SumUp: „beide Seiten eines Ausweisdokuments (z. B. Reisepass, Personalausweis oder Führerschein) zu fotografieren und ein Selfie zu machen“. Kein Video-, Post- oder E-Ident, daher wie bei Finanzfluss 0 Punkte." },
    },
    // Finanzfluss führt SumUp nicht. Punkte nach der Finanzfluss-Tabelle (Bewertung Girokonto, 125 Punkte,
    // Stand 14.09.2026) aus SumUps eigenen Seiten gerechnet, 27.09.2026. Kontoführung setzt kontopreise.ts.
    finanzPunkte: {
      bankkarte: 10, girocard: 0, debitkarte: 5, abheben: 2.5, einzahlen: 0, mobilesBezahlen: 8, sepa: 10,
      support: 0, kontowechsel: 0, app: 2, ident: 0, abzug: 0,
    },
    note: null,
    abgeraten: false,
  },
]);
