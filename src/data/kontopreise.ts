import type { Quelle } from "@/components/vergleich/vergleichTypen";
import type { RohAnbieter } from "./vergleichHelfer";

/**
 * Kontoführung im Girokonto-Vergleich, beim Anbieter geprüft. Handgepflegt, wird nie erzeugt.
 *
 * Regel (Elias, 27.09.2026: „Wie Finanzfluss, komplett“):
 * - `aktiv` ist der Monatspreis bei 1.000 € Geldeingang im Monat und normaler Nutzung des Kontos selbst
 *   (Kartenzahlung, Handyzahlung, e-Postfach). So rechnet auch Finanzfluss („als aktives Konto“).
 *   Nicht erfüllt sind ein reines Alterslimit, Vermögen, Geldeingang über 1.000 € und alles, was ein
 *   zweites Produkt braucht (Sparplan, Trade, Depot). Befristete Neukundenaktionen und Gebühren bei
 *   Inaktivität zählen nicht.
 * - `grundpreis` ist der Monatspreis ohne jede Bedingung.
 * - Punkte: `kontofuehrung` nach der Finanzfluss-Formel auf `aktiv` (bis 15), dazu `ohneBedingung`
 *   (4 Punkte) nur, wenn `grundpreis` 0 ist. Finanzfluss nennt das „Kontoführung kostenlos und kein Aktivkonto“.
 * - Beleg nur vom Anbieter (Entgeltinformation, Preis- und Leistungsverzeichnis, Preisaushang), jedes Zitat
 *   wörtlich. Prüfung gegen die abgelegten Dateien: `npx tsx scripts/kontopreise-pruefen.ts`.
 *
 * Diese Datei wird ausgeliefert. Keine Dateipfade eintragen, nur Dokumentname und Zitat.
 */

export type Kontopreis = {
  /** Euro im Monat als aktives Konto. */
  aktiv: number;
  /** Euro im Monat ohne jede Bedingung. */
  grundpreis: number;
  /** Nur wenn `aktiv` unter `grundpreis` liegt: was den Preis senkt, z. B. "ab 900 € Geldeingang". */
  bedingung?: string;
  /** Noch günstiger unter einer Bedingung, die ein aktives Konto nicht erfüllt, z. B. Vermögen. */
  guenstiger?: { preis: number; bedingung: string };
  url: string;
  stand: string;
  /** Name des Dokuments, wie der Anbieter es nennt, mit Stand. */
  dokument: string;
  /** Wörtlich aus dem Dokument, eine bis drei Stellen. */
  zitate: string[];
};

export const OHNE_BEDINGUNG_PUNKTE = 4;

/** Finanzfluss-Formel „Kosten Kontoführung (als aktives Konto)“, bis 15 Punkte. */
export const punkteKontofuehrung = (euro: number): number =>
  euro === 0 ? 15 : euro <= 1 ? 7.5 : euro <= 3 ? 5 : euro <= 5 ? 3 : euro < 10 ? 0 : -Math.floor(euro / 10);

const betrag = (n: number) =>
  `${n.toLocaleString("de-DE", { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 })} €`;

/** Zelltext. Der erste Betrag ist immer `aktiv`, danach die Bedingung. */
export const kontopreisText = (k: Kontopreis): string => {
  const teile = [k.bedingung ? `${betrag(k.aktiv)} ${k.bedingung}, sonst ${betrag(k.grundpreis)}` : betrag(k.aktiv)];
  if (k.guenstiger) teile.push(`${betrag(k.guenstiger.preis)} ${k.guenstiger.bedingung}`);
  return teile.join(", ");
};

export const kontopreisQuelle = (k: Kontopreis): Quelle => ({
  url: k.url,
  stand: k.stand,
  hinweis: `${k.dokument}: ${k.zitate.map((z) => `„${z}“`).join(" … ")}`,
});

/** Beleg beim Anbieter gefunden, alle am 27.09.2026 abgerufen. Schlüssel ist die Produkt-ID im Vergleich. */
export const KONTOPREISE: Record<string, Kontopreis> = {
  "1822direkt-girodirekt": { aktiv: 0, grundpreis: 4.9, bedingung: "ab 700 € Geldeingang oder unter 30", url: "https://www.1822direkt.de/fileadmin/Home/Dokumente/PDF/Entgeltinformation_GiroDirekt.pdf", stand: "27.09.2026", dokument: "Entgeltinformation 1822direkt GiroDirekt (Frankfurter Sparkasse), Datum: 04.08.2026", zitate: ["Bei einem mtl. Geldeingang von mind. 700,00 EUR oder für Kontoinhaber bis zur Vollendung des 30. Lebensjahres", "sonst monatlich 4,90 EUR"] },
  "bbbank-bettersmart": { aktiv: 0, grundpreis: 4.95, bedingung: "unter 30 oder ab 1.000 € Geldeingang, jeweils mit e-Postfach", url: "https://atruvia.scene7.com/is/content/atruvia/Entgeltinformationen-und-Glossarpdf", stand: "27.09.2026", dokument: "Entgeltinformation BetterSmart Konto, Datum: Stand Juli 2026 (Sammel-PDF Entgeltinformationen und Glossar der BBBank eG)", zitate: ["Kontoführung Monatlich 4,95 EUR", "Beim monatlichen Geldeingang von mind. 1.000,00 EUR Monatlich 0,00 EUR", "(Erfordernis Geldeingang gilt nicht für Kontoinhaber unter"] },
  "bbbank-girokonto": { aktiv: 2.95, grundpreis: 2.95, url: "https://atruvia.scene7.com/is/content/atruvia/Entgeltinformationen-und-Glossarpdf", stand: "27.09.2026", dokument: "Entgeltinformation BBBank-Girokonto, Datum: Stand Juli 2026 (Sammel-PDF Entgeltinformationen und Glossar der BBBank eG)", zitate: ["Kontobezeichnung: BBBank-Girokonto", "Kontoführung Monatlich 2,95 EUR", "Jährliche Gesamtentgelte 35,40 EUR"] },
  "bbva-girokonto": { aktiv: 0, grundpreis: 0, url: "https://www.bbva.de/privat/produkte/konten/faqs-girokonto.html", stand: "27.09.2026", dokument: "BBVA FAQs Girokonto, abgerufen 27.09.2026", zitate: ["Das BBVA Online-Girokonto ist für dich gebührenfrei, ohne Eröffnungs- und Kontoführungsgebühren.", "Muss ich mein Gehalt einzahlen oder Lastschriften einrichten, um ein kostenloses Girokonto bei BBVA zu eröffnen? Nein, das ist nicht erforderlich."] },
  "berliner-volksbank-girokonto": { aktiv: 3.95, grundpreis: 3.95, url: "https://atruvia.scene7.com/is/content/atruvia/entgeltinformation-privatgiropdf", stand: "27.09.2026", dokument: "Vorvertragliche Entgeltinformation nach § 47 Abs. 2 ZKG, Girokonto, Stand: 05.10.2025", zitate: ["Kontobezeichnung: Girokonto", "Kontoführung monatlich 3,95 €", "[Girokonto] Jährliche Gesamtentgelte 47,40 €"] },
  "bforbank-bforbasic-konto": { aktiv: 0, grundpreis: 2, bedingung: "mit mindestens einer Kartenzahlung oder Abhebung im Monat", url: "https://bforbank.cdn.prismic.io/bforbank/agw5rKYofJOwHXAW_BforBank_Entgeltinformation-260518_1.pdf", stand: "27.09.2026", dokument: "Entgeltinformation BforBank S.A., Girokonto, Datum 18.05.2026", zitate: ["Kontoführung Monatlich 0,00 EUR", "[BforBASIC] Bei einem Einsatz zum Bezahlen oder zur Bargeldauszahlung von mindestens einmal im Monat", "Sonst monatlich 2,00 EUR"] },
  "bunq-core": { aktiv: 3.99, grundpreis: 3.99, url: "https://static.bunq.com/website/documents/bunq-information-sheet-pricing-de-de.pdf", stand: "27.09.2026", dokument: "bunq Entgeltinformationen Privatkunden und Geschäftskunden (Preisübersicht), 22/09/2026", zitate: ["Funktionen bunq Elite bunq Pro bunq Core bunq Free bunq Elite bunq Pro bunq Core bunq Free", "Kontoführung: Für 18,99 € pro Monat 9,99 € pro Monat 3,99 € pro Monat 0€"] },
  "bunq-elite": { aktiv: 18.99, grundpreis: 18.99, guenstiger: { preis: 9, bedingung: "für Studierende unter 26" }, url: "https://static.bunq.com/website/documents/bunq-information-sheet-pricing-de-de.pdf", stand: "27.09.2026", dokument: "bunq Entgeltinformationen Privatkunden und Geschäftskunden (Preisübersicht), 22/09/2026", zitate: ["Kontoführung: Für 18,99 € pro Monat 9,99 € pro Monat 3,99 € pro Monat 0€", "Kontoführung: 9 € pro Monat Kostenlos 3,99 € pro Monat N/A", "für <26-Jährige"] },
  "bunq-free": { aktiv: 0, grundpreis: 0, url: "https://static.bunq.com/website/documents/bunq-information-sheet-pricing-de-de.pdf", stand: "27.09.2026", dokument: "bunq Entgeltinformationen Privatkunden und Geschäftskunden (Preisübersicht), 22/09/2026", zitate: ["Funktionen bunq Elite bunq Pro bunq Core bunq Free bunq Elite bunq Pro bunq Core bunq Free", "Kontoführung: Für 18,99 € pro Monat 9,99 € pro Monat 3,99 € pro Monat 0€"] },
  "bunq-pro": { aktiv: 9.99, grundpreis: 9.99, guenstiger: { preis: 0, bedingung: "für Studierende unter 26" }, url: "https://static.bunq.com/website/documents/bunq-information-sheet-pricing-de-de.pdf", stand: "27.09.2026", dokument: "bunq Entgeltinformationen Privatkunden und Geschäftskunden (Preisübersicht), 22/09/2026", zitate: ["Kontoführung: Für 18,99 € pro Monat 9,99 € pro Monat 3,99 € pro Monat 0€", "Kontoführung: 9 € pro Monat Kostenlos 3,99 € pro Monat N/A", "für <26-Jährige"] },
  "c24-max": { aktiv: 9.9, grundpreis: 9.9, url: "https://api.c24.de/api/documents/c24max_fees/download/", stand: "27.09.2026", dokument: "Entgeltinformation C24 Maxkonto, Datum: 01.07.2026", zitate: ["Kontobezeichnung: C24 Maxkonto", "Kontoführung [C24 Maxkonto] 9,90 EUR monatlich"] },
  "c24-plus": { aktiv: 5.9, grundpreis: 5.9, url: "https://api.c24.de/api/documents/c24plus_fees/download/", stand: "27.09.2026", dokument: "Entgeltinformation C24 Pluskonto, Datum: 01.07.2026", zitate: ["Kontobezeichnung: C24 Pluskonto", "Kontoführung [C24 Pluskonto] 5,90 EUR monatlich"] },
  "c24-smart": { aktiv: 0, grundpreis: 0, url: "https://api.c24.de/api/documents/c24giro_fees/download/", stand: "27.09.2026", dokument: "Entgeltinformation C24 Smartkonto, Datum: 05.05.2026", zitate: ["Kontobezeichnung: C24 Smartkonto", "Kontoführung [C24 Smartkonto] Kostenlos"] },
  "comdirect-girokonto-aktiv": { aktiv: 0, grundpreis: 4.9, bedingung: "ab 700 € Geldeingang oder 3 Zahlungen mit Apple Pay oder Google Pay", url: "https://www.comdirect.de/cms/docs/cori10543.pdf", stand: "27.09.2026", dokument: "Entgeltinformation Girokonto (comdirect), Entgeltinformation nach § 47 Abs. 2 ZKG, Stand: 22.07.2026", zitate: ["pro Monat: 0,00 EUR", "- 700 Euro monatlicher Geldeingang oder - 3 Zahlungen über Apple Pay oder Google Pay pro Monat", "ansonsten pro Monat: 4,90 EUR"] },
  "commerzbank-girokonto": { aktiv: 4.9, grundpreis: 4.9, guenstiger: { preis: 0, bedingung: "ab 50.000 € Vermögen" }, url: "https://www.commerzbank.de/portal/media/efw-dokumente/ent_girokonto.pdf", stand: "27.09.2026", dokument: "Entgeltinformation GiroKonto (Commerzbank AG), Datum: 1.12.2025", zitate: ["Kontobezeichnung: GiroKonto", "Kontoführung monatlich 4,90 EUR", "50.000 Euro im Kalendermonat 0,00 EUR"] },
  "commerzbank-klassikkonto": { aktiv: 9.9, grundpreis: 9.9, url: "https://www.commerzbank.de/portal/media/efw-dokumente/ent_zkg_klassik.pdf", stand: "27.09.2026", dokument: "Entgeltinformation KlassikKonto (Commerzbank AG), Datum: 1.12.2025", zitate: ["Kontobezeichnung: KlassikKonto", "Kontoführung monatlich 9,90 EUR"] },
  "consorsbank-girokonto": { aktiv: 0, grundpreis: 4, bedingung: "ab 700 € Geldeingang oder unter 31", url: "https://www.consorsbank.de/content/dam/de-cb/editorial/PDF/Service-Beratung/Preise-Zinsen/CB.99.300_406-OL_Entgeltinformation-Consorsbank-Girokonto.pdf", stand: "27.09.2026", dokument: "Entgeltinformation Consorsbank! Girokonto, Stand: 09/2026 (CB.99.300_406)", zitate: ["Kontoführung Bei einem monatlichen Mindestgeldeingang von 700,00 Euro", "oder für Kontoinhaber unter 31 Jahren", "Sonst monatlich 4,00 Euro"] },
  "deutsche-bank-aktivkonto": { aktiv: 6.9, grundpreis: 6.9, url: "https://www.deutsche-bank.de/content/dam/deutschebank/de/shared/pdf/kontakt-und-service/entgeltinformation-aktivkonto-ag.pdf", stand: "27.09.2026", dokument: "Entgeltinformation AktivKonto (Deutsche Bank AG), Datum: 23.09.2026", zitate: ["Kontobezeichnung: AktivKonto", "Kontoführung Monatlich 6,90 EUR", "Jährliche Gesamtentgelte 82,80 EUR"] },
  "dkb-girokonto": { aktiv: 0, grundpreis: 4.5, bedingung: "ab 700 € Geldeingang oder unter 28", url: "https://www.dkb.de/fragen-antworten/was-muss-ich-zum-girokonto-wissen", stand: "27.09.2026", dokument: "DKB Fragen und Antworten „Wann ist mein Girokonto kostenlos?“, abgerufen 27.09.2026; dazu Entgeltinformation Girokonto, Stand 15.09.2026", zitate: ["Gehen auf einem Girokonto (als Erstkonto) mindestens 700 Euro pro Monat ein, bleibt dieses Girokonto kostenlos.", "Bis zu deinem 28. Geburtstag ist dein Girokonto (als Erstkonto) auch ohne monatlichen Geldeingang von 700 Euro kostenlos.", "Erstkonten, wenn keine der o.g. Bedingungen erfüllt ist: 4,50 Euro im Monat."] },
  "ethikbank-girokonto": { aktiv: 8.5, grundpreis: 8.5, url: "https://www.ethikbank.de/fileadmin/ethikbank/Dokumente/AGB-VVI-Sobe/Vorvertragliche_Entgeltinformation_EB.pdf", stand: "27.09.2026", dokument: "Entgeltinformation Girokonto, Datum: 01.02.2026 (Sammel-PDF Vorvertragliche Entgeltinformation der EthikBank)", zitate: ["Kontoführung monatlich 8,50 EUR", "Jährliche Gesamtentgelte 102,00 EUR", "2 gültig für 1 Jahr. Danach erfolgt ein automatischer Produktwechsel zum Girokonto."] },
  "gls-bank-gls-konto": { aktiv: 8.8, grundpreis: 8.8, guenstiger: { preis: 1, bedingung: "mit 18 bis 27 Jahren" }, url: "https://www.gls.de/konten-karten/konten/girokonto/", stand: "27.09.2026", dokument: "Produktseite GLS Konto, Konditionen (monatliche Kosten), Gesamt inklusive GLS Beitrag, abgerufen 27.09.2026", zitate: ["Kontoführung 3,80 € 0 € 0 € Gesamt monatlich inklusive GLS Beitrag 8,80 € 1,00 € 0 €", "Den GLS Beitrag zahlen alle Kontoinhaber*innen."] },
  "hamburger-sparkasse-haspajoker": { aktiv: 9.95, grundpreis: 9.95, url: "https://www.haspa.de/content/dam/myif/haspa/work/dokumente/pdf/haspa/ZKG/entgeltinformation-haspajoker.pdf?n=true", stand: "27.09.2026", dokument: "Entgeltinformation HaspaJoker, Datum: 15.08.2026 (1350010HA Fassung 14.08.2026)", zitate: ["Kontobezeichnung: HaspaJoker", "Kontoführung [HaspaJoker] monatlich 9,95 EUR"] },
  "hypovereinsbank-aktivkonto": { aktiv: 4.9, grundpreis: 4.9, guenstiger: { preis: 0, bedingung: "mit HVB valyou Gold (ab 75.000 € Vermögen)" }, url: "https://www.hypovereinsbank.de/content/dam/hypovereinsbank/shared/pdf/FID/FID_Akti.pdf", stand: "27.09.2026", dokument: "Entgeltinformation HVB AktivKonto (UniCredit Bank GmbH), Datum: 31.07.2026", zitate: ["Kontoführung [HVB AktivKonto] monatlich (1) 4,90 EUR", "Programmstufe Gold 100%, bei Silber 50% und bei Bronze 25%.", "Gold: Mindestens 75.000 EUR Vermögen oder Kreditsumme sowie mindestens 5 Produktpunkte"] },
  "hypovereinsbank-pluskonto": { aktiv: 9.9, grundpreis: 9.9, guenstiger: { preis: 0, bedingung: "für Neukunden ab 1.000 € Geldeingang mit HVB valyou" }, url: "https://www.hypovereinsbank.de/content/dam/hypovereinsbank/shared/pdf/FID/FID_Plus.pdf", stand: "27.09.2026", dokument: "Entgeltinformation HVB PlusKonto (UniCredit Bank GmbH), Datum: 31.07.2026", zitate: ["Kontoführung [HVB PlusKonto] monatlich (1) 9,90 EUR", "Für Neukunden (6) bei einem", "mind. 1.000 Euro (7) und Teilnahme"] },
  "ing-girokonto": { aktiv: 0, grundpreis: 4.9, bedingung: "ab 1.000 € Geldeingang oder unter 28", url: "https://www.ing.de/dokumente/entgeltinformation-girokonto/", stand: "27.09.2026", dokument: "Entgeltinformation Girokonto (ING-DiBa AG), Datum: 23.10.2025", zitate: ["Kontoführung [Girokonto] Bei einem mtl. Geldeingang1", "von mind. 1.000 Euro", "Sonst monatlich 4,90 Euro"] },
  "ing-girokonto-future": { aktiv: 1, grundpreis: 5.9, bedingung: "ab 1.000 € Geldeingang oder unter 28", url: "https://www.ing.de/dokumente/entgeltinformation-girokonto/", stand: "27.09.2026", dokument: "Entgeltinformation Girokonto (ING-DiBa AG), Datum: 23.10.2025", zitate: ["Erweiterung Girokonto Future 1 Euro monatlich", "von mind. 1.000 Euro", "Sonst monatlich 4,90 Euro"] },
  "klarna-guthaben": { aktiv: 0, grundpreis: 0, url: "https://locker.klarna.com/asset/429369d3-066e-4066-92a3-b578660d63ff/Web_FeeInformation_Document_KlarnaBalance_de-DE.pdf", stand: "27.09.2026", dokument: "Entgeltinformation Klarna Bank AB, German Branch, Klarna Guthaben „Klarna Balance“, Datum 2. June 2026", zitate: ["Kontoführung kostenlos", "Jährliche Gesamtentgelte: 0,00 €"] },
  "kt-bank-girokonto": { aktiv: 0, grundpreis: 0, url: "https://www.kt-bank.de/dokumente/entgeltinformation/", stand: "27.09.2026", dokument: "Entgeltinformation KT Bank AG, KT GiroKonto, Datum 23.06.2026", zitate: ["Kontoführung [KT GiroKonto] monatlich 0,00 EUR", "Jährliche Gesamtentgelte 0,00 EUR"] },
  "meine-bank-mein-girokonto": { aktiv: 0, grundpreis: 0, url: "https://atruvia.scene7.com/is/content/atruvia/meinebank-entgeltinformation-meingirokonto-065231mbpdf", stand: "27.09.2026", dokument: "Entgeltinformation MEIN Girokonto, Datum: 22.04.2026", zitate: ["Kontobezeichnung: MEIN Girokonto", "Kontoführung [Zuzüglich, im Auftrag des monatlich 0,00 EUR", "Jährliche Gesamtentgelte 0,00 EUR"] },
  "monese-pay-as-you-go": { aktiv: 0, grundpreis: 0, url: "https://cdn.prod.website-files.com/67d9807e0c2d6c210fedd9f5/6a4812f97c1a18c185373429_723a3ef63c3750f6fa1995f20e651ec8_20260703-zkg-fee-information-monese-pay-as-you-go-de.pdf", stand: "27.09.2026", dokument: "Entgeltinformation PPS EU SA / Monese EU SA, Monese EUR Account – Pay As You Go Tarif, Datum 03.07.2026", zitate: ["Kontobezeichnung: Monese EUR Account – Pay As You Go Tarif", "Kontoführung [Monese EUR Account – Pay As You Go] Pro Monat: 0,00 EUR", "Eingehende Überweisung [Zahlungseingang] Pro Überweisung: 0,99 EUR"] },
  "n26-flex": { aktiv: 8.9, grundpreis: 8.9, url: "https://docs.n26.com/legal/01+DE/02+ZKG/de/13zkg-pricelist-flex-account-de.pdf", stand: "27.09.2026", dokument: "Entgeltinformation N26 Flexkonto, Datum 03.08.2026", zitate: ["Kontobezeichnung: N26 Flexkonto", "Kontoführung Pro Monat 8,90 EUR", "106,80 EUR"] },
  "n26-go": { aktiv: 9.9, grundpreis: 9.9, url: "https://docs.n26.com/legal/01+DE/02+ZKG/de/13zkg-pricelist-standard-account-de.pdf", stand: "27.09.2026", dokument: "Entgeltinformation N26 Girokonto, Datum 03.08.2026", zitate: ["[N26 Go]", "Pro Monat 9,90 EUR", "118,80 EUR"] },
  "n26-metal": { aktiv: 16.9, grundpreis: 16.9, url: "https://docs.n26.com/legal/01+DE/02+ZKG/de/13zkg-pricelist-standard-account-de.pdf", stand: "27.09.2026", dokument: "Entgeltinformation N26 Girokonto, Datum 03.08.2026", zitate: ["[N26 Metal]", "Pro Monat 16,90 EUR", "202,80 EUR"] },
  "n26-smart": { aktiv: 4.9, grundpreis: 4.9, url: "https://docs.n26.com/legal/01+DE/02+ZKG/de/13zkg-pricelist-standard-account-de.pdf", stand: "27.09.2026", dokument: "Entgeltinformation N26 Girokonto, Datum 03.08.2026", zitate: ["[N26 Smart] Pro Monat 4,90 EUR", "58,80 EUR"] },
  "n26-standard": { aktiv: 0, grundpreis: 0, url: "https://docs.n26.com/legal/01+DE/02+ZKG/de/13zkg-pricelist-standard-account-de.pdf", stand: "27.09.2026", dokument: "Entgeltinformation N26 Girokonto, Datum 03.08.2026", zitate: ["Kontobezeichnung: N26 Girokonto", "Kontoführung [N26 Girokonto] 0,00 EUR"] },
  "norisbank-girokonto-plus": { aktiv: 7.9, grundpreis: 7.9, url: "https://www.norisbank.de/dam/norisbank/de/shared/pdf/entgeltinformation-girokonto-plus.pdf", stand: "27.09.2026", dokument: "Entgeltinformation Girokonto plus (norisbank GmbH), Datum: 15.07.2026", zitate: ["Kontobezeichnung: Girokonto plus", "Kontoführung Monatlich 7,90 EUR", "Jährliche Gesamtentgelte 94,80 EUR"] },
  "norisbank-top-girokonto": { aktiv: 0, grundpreis: 3.9, bedingung: "ab 500 € Geldeingang oder unter 30", url: "https://www.norisbank.de/dam/norisbank/de/shared/pdf/entgeltinformation-top-girokonto.pdf", stand: "27.09.2026", dokument: "Entgeltinformation Top-Girokonto (norisbank GmbH), Datum: 15.07.2026", zitate: ["Kontoführung Monatlich 3,90 EUR", "Bei einem mtl. Geldeingang von mind. 500,00 Monatlich 0,00 EUR", "EUR oder für Kontoinhaber unter 30 Jahren"] },
  "pax-bank-pax-bck-individuell": { aktiv: 2.5, grundpreis: 2.5, url: "https://www.vr-dokumente.de/zkg/37060193/Vorvertragliche_Entgeltinformation.pdf", stand: "27.09.2026", dokument: "Entgeltinformation Pax-BKC Individuell, Datum: 01.09.2026", zitate: ["Kontobezeichnung: Pax-BKC Individuell", "Kontoführung monatlich 2,50 EUR", "Jährliche Gesamtentgelte 30,00 EUR"] },
  "postbank-giro-pur": { aktiv: 0, grundpreis: 5.9, bedingung: "ab 900 € Geldeingang", url: "https://www.postbank.de/dam/postbank/pdf/privatkunden/konten/Postbank-Giro-pur-Entgeltinformation-923-960-085-0726.pdf", stand: "27.09.2026", dokument: "Entgeltinformation Postbank Giro pur, Datum: 15.07.2026 (923 960 085 07.26)", zitate: ["bei Geldeingang ab 900 EUR", "im Kalendermonat 0,00 EUR", "im Kalendermonat 5,90 EUR"] },
  "psd-bank-n-rnberg-girodirekt": { aktiv: 2.9, grundpreis: 2.9, url: "https://atruvia.scene7.com/is/content/atruvia/Entgeltinformation_PSDGiroDirektpdf", stand: "27.09.2026", dokument: "Entgeltinformation PSD GiroDirekt, Datum: 01.07.2026", zitate: ["Kontobezeichnung: PSD GiroDirekt", "Datum: 01.07.2026", "Kontoführung [PSD GiroDirekt] monatlich 2,90 EUR"] },
  "revolut-metal": { aktiv: 15.99, grundpreis: 15.99, url: "https://www.revolut.com/de-DE/legal/metal-fees/", stand: "27.09.2026", dokument: "Revolut Gebühren für Privatkunden (Metal), Teil I Zweigniederlassung Deutschland, Neukundenpreis, abgerufen 27.09.2026", zitate: ["Teil I: Gebühren für Privatkunden (Metal) der Revolut Bank UAB, Zweigniederlassung Deutschland.", "Anmeldung am oder nach dem 07. Mai 2026: 15,99 € pro Monat oder 155 € pro Jahr"] },
  "revolut-plus": { aktiv: 2.99, grundpreis: 2.99, url: "https://cdn.revolut.com/terms_and_conditions/pdf/entgeltinformation_revolut_bank_uab_zweigniederlassung_deutschland_6d6dd2df_1.1.1_1762355972_de.pdf", stand: "27.09.2026", dokument: "Entgeltinformation Revolut Bank UAB, Zweigniederlassung Deutschland, Girokonto, gültig ab 5. November 2025 (Version 1.1.1)", zitate: ["Plus Konto Monatliches Abonnement: 2,99 €", "Jahresabonnement: 29,99 €"] },
  "revolut-premium": { aktiv: 8.99, grundpreis: 8.99, url: "https://cdn.revolut.com/terms_and_conditions/pdf/pers_nliche_geb_hren_premium_b7803e21_2.8.0_1778139355_de.pdf", stand: "27.09.2026", dokument: "Revolut Bank UAB, Zweigniederlassung Deutschland: Gebühren für Privatkunden (Premium), Version 2.8.0 (gültig für Anmeldung ab 07. Mai 2026)", zitate: ["Gebühren für Privatkunden (Premium)", "Anmeldung am oder nach dem 07. Mai 2026: 8,99 € pro Monat oder 89 € pro Jahr"] },
  "revolut-standard": { aktiv: 0, grundpreis: 0, url: "https://cdn.revolut.com/terms_and_conditions/pdf/entgeltinformation_revolut_bank_uab_zweigniederlassung_deutschland_6d6dd2df_1.1.1_1762355972_de.pdf", stand: "27.09.2026", dokument: "Entgeltinformation Revolut Bank UAB, Zweigniederlassung Deutschland, Girokonto, gültig ab 5. November 2025 (Version 1.1.1)", zitate: ["Kontoführung 0€", "Standard Konto Kostenlos"] },
  "revolut-ultra": { aktiv: 65, grundpreis: 65, url: "https://cdn.revolut.com/terms_and_conditions/pdf/personal_fees_ultra_010d3a88_1.7.0_1778141184_en.pdf", stand: "27.09.2026", dokument: "Revolut Personal fees (Ultra) Version 1.7.0, Teil I: Revolut Bank UAB, Zweigniederlassung Deutschland, Gebühren für Privatkunden (Ultra), deutsche verbindliche Fassung", zitate: ["Gebühren für Privatkunden (Ultra)", "Anmeldung am oder nach dem 07. Mai 2026: 65,00 € pro Monat oder 650 € pro"] },
  "santander-bestgiro": { aktiv: 0, grundpreis: 0, url: "https://www.santander.de/privatkunden/konten-und-karten/konten/kostenloses-girokonto/", stand: "27.09.2026", dokument: "Produktseite BestGiro (santander.de), abgerufen 27.09.2026; dazu Entgeltinformation BestGiro, Datum: 03.08.2026 (Kontoanbieter Openbank Deutschland AG)", zitate: ["BestGiro: Kostenloses Girokonto mit Kreditkarte", "0€ Kontoführungsgebühr", "dauerhaft – ohne Mindestgeldeingang"] },
  "sumup-privatkonto": { aktiv: 0, grundpreis: 0, url: "https://www.sumup.com/de-de/privat/legal/fee-schedule/", stand: "27.09.2026", dokument: "SumUp Pay: Kostenübersicht (sumup.com/de-de/privat/legal/fee-schedule), abgerufen 27.09.2026", zitate: ["All das und mehr mit dem kostenlosen SumUp Pay Konto.", "Monatliche Gebühr 0 €"] },
  "targobank-online-konto": { aktiv: 0, grundpreis: 3.95, bedingung: "ab 600 € Gehaltseingang", url: "https://www.targobank.de/de/amc-content/pdf/dtls-07-28-a/Entgeltinformation_Online-Konto.pdf", stand: "27.09.2026", dokument: "Entgeltinformation Online-Konto, Datum: 01.12.2025 (P03BEI01)", zitate: ["Kontoführung monatlich 3,95 EUR", "monatlich 0,00 EUR", "Bei einem monatlichen Gehaltseingang von mindestens 600,00 EUR bei der TARGOBANK."] },
  "tomorrow-change": { aktiv: 8.9, grundpreis: 8.9, url: "https://www.solarisgroup.com/customer-information/germany/de-iban/german/entgeltinformationen-tomorrow-change", stand: "27.09.2026", dokument: "Entgeltinformation Solaris SE, Tomorrow – Change, Datum 02.06.2026", zitate: ["Kontobezeichnung: Tomorrow – Change (Kooperationspartner: Tomorrow GmbH)", "Kontoführung EUR 8,90 pro Monat"] },
  "tomorrow-now": { aktiv: 4.9, grundpreis: 4.9, url: "https://www.solarisgroup.com/customer-information/germany/de-iban/german/entgeltinformationen-tomorrow-now", stand: "27.09.2026", dokument: "Entgeltinformation Solaris SE, Tomorrow – Now, Datum 02.06.2026", zitate: ["Kontobezeichnung: Tomorrow – Now (Kooperationspartner: Tomorrow GmbH)", "Kontoführung EUR 4,90 pro Monat"] },
  "tomorrow-plus": { aktiv: 17.9, grundpreis: 17.9, url: "https://www.solarisgroup.com/customer-information/germany/de-iban/german/entgeltinformationen-tomorrow-plus", stand: "27.09.2026", dokument: "Entgeltinformation Solaris SE, Tomorrow – Plus, Datum 02.06.2026", zitate: ["Kontobezeichnung: Tomorrow – Plus (Kooperationspartner: Tomorrow GmbH)", "Kontoführung EUR 17,90 pro Monat"] },
  "trade-republic-girokonto": { aktiv: 0, grundpreis: 0, url: "https://assets.traderepublic.com/assets/files/FeeInformation_PaymentAccount_de.pdf", stand: "27.09.2026", dokument: "Entgeltinformation Trade Republic Bank GmbH, Girokonto, Datum 1. Januar 2025", zitate: ["Name des Kontoanbieters: Trade Republic Bank GmbH", "Kontoführung 0€"] },
  "umweltbank-umweltgiro": { aktiv: 4.9, grundpreis: 4.9, url: "https://www.umweltbank.de/download/f018", stand: "27.09.2026", dokument: "Entgeltinformation Girokonto, Datum: 24.09.2026", zitate: ["Kontoführung [Girokonto] monatlich 4,90 EUR", "Jährliche Gesamtentgelte 58,80 EUR", "Datum: 24.09.2026"] },
  "vivid-plus": { aktiv: 6.9, grundpreis: 6.9, url: "https://website-static.vivid.money/static/legal-docs/de-de/fee-information-document-plus.pdf", stand: "27.09.2026", dokument: "Entgeltinformation Vivid Money S.A., Vivid Money Plus Konto, Datum 09.09.2026", zitate: ["Kontoname: Vivid Money Plus Konto", "Monatlich 6.90€", "Jährliche Gesamtentgelte 82.80€"] },
  "vivid-prime": { aktiv: 9.9, grundpreis: 9.9, url: "https://website-static.vivid.money/static/legal-docs/de-de/fee-information-document-prime.pdf", stand: "27.09.2026", dokument: "Entgeltinformation Vivid Money S.A., Vivid Money Prime Konto, Datum 09.09.2026", zitate: ["Kontoname: Vivid Money Prime Konto", "9.90€", "118.80€"] },
  "vivid-standard": { aktiv: 4.9, grundpreis: 4.9, guenstiger: { preis: 0, bedingung: "ab 1.000 € Kartenzahlungen oder 3.000 € Guthaben im Monat" }, url: "https://website-static.vivid.money/static/legal-docs/de-de/fee-information-document-standard.pdf", stand: "27.09.2026", dokument: "Entgeltinformation Vivid Money S.A., Vivid Money Standard-Konto, Datum 09.09.2026", zitate: ["Die monatliche Kontoführungsgebühr von 4,90 € für die Standard-Version von Vivid Money wird nicht", "über ein kumuliertes positives Guthaben von mindestens 3.000 € auf allen", "Kalendermonat mit einer physischen und/oder virtuellen Vivid Card Karteneinkäufe im Gesamtwert von mindestens 1.000 € getätigt."] },
  "wise-konto": { aktiv: 0, grundpreis: 0, url: "https://wise.com/de/pricing/", stand: "27.09.2026", dokument: "Wise Gebühren & Preisstruktur (wise.com/de/pricing), abgerufen 27.09.2026", zitate: ["Du zahlst immer nur für das, was du auch wirklich benutzt, ganz ohne Abos oder Tarife.", "Registriere dich für ein Wise-Konto Kostenlos", "Keine Abo-Gebühren"] },
};

/** Kein Anbieterbeleg gefunden: Finanzfluss-Wert bleibt, keine Extrapunkte. Wert ist der Grund. */
export const KONTOPREIS_OFFEN: Record<string, string> = {
};

/** "0€", "4,90€", "60€" aus dem Finanzfluss-Import. */
const ersterBetrag = (wert: unknown): number | null => {
  if (typeof wert !== "string") return null;
  const m = wert.match(/(\d+(?:,\d+)?)\s*€/);
  return m ? Number(m[1].replace(",", ".")) : null;
};

const hatPunkte = (a: RohAnbieter) => !!a.finanzPunkte && Object.keys(a.finanzPunkte).length > 0;

/**
 * Setzt Text, Beleg und Punkte der Kontoführung. Anbieter ohne Finanzpunkte (SumUp) bekommen nur den Text,
 * sonst würden sie mit Nullen gerankt.
 */
export const mitKontopreisen = (liste: RohAnbieter[]): RohAnbieter[] =>
  liste.map((a) => {
    const k = KONTOPREISE[a.id];
    if (!k) {
      const n = ersterBetrag(a.werte.kontofuehrung);
      return {
        ...a,
        werte: n === null ? a.werte : { ...a.werte, kontofuehrung: betrag(n) },
        finanzPunkte: hatPunkte(a) ? { ...a.finanzPunkte, ohneBedingung: 0 } : a.finanzPunkte,
      };
    }
    return {
      ...a,
      werte: { ...a.werte, kontofuehrung: kontopreisText(k) },
      quellen: { ...a.quellen, kontofuehrung: kontopreisQuelle(k) },
      finanzPunkte: hatPunkte(a)
        ? {
            ...a.finanzPunkte,
            kontofuehrung: punkteKontofuehrung(k.aktiv),
            ohneBedingung: k.grundpreis === 0 ? OHNE_BEDINGUNG_PUNKTE : 0,
          }
        : a.finanzPunkte,
    };
  });
