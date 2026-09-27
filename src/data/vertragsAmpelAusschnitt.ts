import type { AmpelZeile } from "@/data/vertragsAmpel";

/**
 * Der offene Ausschnitt der Vertrags-Ampel. Bewusst ohne Laufzeit-Import aus
 * `vertragsAmpel.ts`: Die offene Seite lädt nur zwei Verträge mit Farbe, alle zwölf mit Farbe
 * und Bedingung lädt erst die volle Fassung. Ein Test prüft, dass die zwei hier wortgleich dort
 * stehen. Plan 27.09.2026: alle Namen offen, zwei Farben (Depot grün, Dispo rot), an der Kante
 * zuerst Leasing, Kreditkarte und Versicherung ohne Farbe.
 */

/** Oben offen, mit Farbe und Bedingung. */
export const offen: AmpelZeile[] = [
  {
    vertrag: "Aktiendepot",
    unter: "Wertpapierdepot beim Broker",
    farbe: "gruen",
    woran:
      "Solange nur Anlagen drin liegen, die halal sind, und auf dem Verrechnungskonto keine Zinsen gutgeschrieben werden. Zinsangebot beim Anbieter abschalten.",
  },
  {
    vertrag: "Ratenkredit und Dispo",
    unter: "Konsumkredit, Überziehung",
    farbe: "rot",
    woran:
      "Du zahlst mehr zurück, als du bekommen hast, allein für die Zeit. Das ist Riba im Kern, unabhängig von der Höhe des Zinssatzes.",
  },
];

/** An der Schnittkante: Name ja, Farbe nein. */
export const kante: Pick<AmpelZeile, "vertrag" | "unter">[] = [
  { vertrag: "Leasing und Autoabo", unter: "Fahrzeug oder Gerät" },
  { vertrag: "Kreditkarte", unter: "Echte Kreditkarte mit Rahmen" },
  { vertrag: "Versicherungen", unter: "Konventionell, Sach und Haftpflicht" },
  { vertrag: "Ratenzahlung", unter: "Finanzierung im Laden oder online" },
  { vertrag: "Krypto-Wallet", unter: "Eigene Wallet oder Börsenkonto" },
  { vertrag: "Girokonto ohne Zinsen", unter: "Inklusive Debit- und Girocard" },
  { vertrag: "Tagesgeld, Festgeld, Sparbuch", unter: "Verzinste Einlagen" },
  { vertrag: "Bausparvertrag", unter: "Ansparen plus Darlehen" },
  { vertrag: "Klassische Lebens- und Rentenversicherung", unter: "Mit Garantiezins" },
  { vertrag: "CFDs, Hebelprodukte, Optionsscheine", unter: "Derivate" },
];
