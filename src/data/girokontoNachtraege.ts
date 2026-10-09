import { mitKontopreisen } from "./kontopreise";
import type { RohAnbieter } from "./vergleichHelfer";

/**
 * Ident-Verfahren, das der Import nicht kennt (dort zählen nur Video-, Post- und E-Ident), beim
 * Anbieter gelesen am 09.10.2026. Die Punkte bleiben wie im Import.
 */
const IDENT_JE_HAUS: Record<string, { wert: string; quelle: { url: string; stand: string; hinweis: string } }> = {
  bunq: {
    wert: "Ausweisfoto und Selfie",
    quelle: {
      url: "https://together.bunq.com/d/24112-how-do-i-verify-my-identity-with-incode",
      stand: "09.10.2026",
      hinweis: "bunq: „Follow the verification flow: scan your identification document and take a selfie“. Die Prüfung läuft in der App, bunq akzeptiert nur ein Foto des Originaldokuments.",
    },
  },
  wise: {
    wert: "Ausweisfoto und Live-Foto",
    quelle: {
      url: "https://wise.com/de/help/articles/3lclMmfpEuLXpf6uEkbhaL/bestatigung-deiner-identitat-mit-einem-foto-deines-ausweises-und-einem-selfie",
      stand: "09.10.2026",
      hinweis: "Wise: „Für diese Prüfung machst du zuerst ein Foto deines Ausweises und anschließend ein separates Live-Foto deines Gesichts.“ Im EWR gelten Reisepass oder Personalausweis.",
    },
  },
  monese: {
    wert: "Ausweis-Scan und Video-Selfie",
    quelle: {
      url: "https://www.monese.com/terms/deutschland-personal-terms-and-conditions-03-07-2026",
      stand: "09.10.2026",
      hinweis: "Monese, AGB Deutschland vom 03.07.2026: „Dazu können wir Ihr Ausweisdokument scannen oder ein Selfie-Video- oder Live-Agent-Video-Interview durchführen.“ Auf monese.com nennt Monese als Ablauf ein Ausweisdokument und „ein kurzes Video-Selfie in der App zur Bestätigung Ihrer Identität“.",
    },
  },
  vivid: {
    wert: "Ausweisfoto und Selfie",
    quelle: {
      url: "https://support.vivid.money/de/articles/12324949-wie-aktiviere-ich-den-kamerazugriff-um-meine-identitatsprufung-abzuschliessen",
      stand: "09.10.2026",
      hinweis: "Vivid: „Nach dem Herunterladen und Starten der Vivid-App wirst du aufgefordert, deine Identität per Fotoprüfung zu bestätigen.“ und „einschließlich eines Selfies zusammen mit deinem Ausweisdokument“. Die Prüfung läuft in der App.",
    },
  },
};

const mitIdent = (a: RohAnbieter): RohAnbieter => {
  const ident = a.haus ? IDENT_JE_HAUS[a.haus] : undefined;
  if (!ident || a.werte.ident) return a;
  return { ...a, werte: { ...a.werte, ident: ident.wert }, quellen: { ...a.quellen, ident: ident.quelle } };
};

/**
 * Aktuelle Produktnamen und neue Produkte bis zum nächsten geprüften Datenimport.
 * Danach die beim Anbieter geprüfte Kontoführung (`kontopreise.ts`).
 */
export const girokontoNachtraege = (anbieter: RohAnbieter[]): RohAnbieter[] => mitKontopreisen([
  ...anbieter.map(mitIdent).map((a) => a.id === "bforbank-bforbasic-konto" ? {
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
