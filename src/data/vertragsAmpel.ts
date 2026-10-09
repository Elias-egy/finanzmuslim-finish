/**
 * Der Halal Vertrags-Check (Datei früher „Vertrags-Ampel“): zwölf Verträge mit Farbe und Bedingung. Gegen E-Mail seit 27.09.2026
 * (Elias, Vault raw 2026-09-26-doomscroll-web/09): Diese Datei lädt nur die volle Fassung. Die
 * offene Seite nimmt `vertragsAmpelAusschnitt.ts`, ein Test hält beide gleich.
 */
import type { Farbe } from "@/components/vorlagen/ampelTeile";

export type AmpelZeile = { vertrag: string; unter: string; farbe: Farbe; woran: string };

export const zeilen: AmpelZeile[] = [
  {
    vertrag: "Aktiendepot",
    unter: "Wertpapierdepot beim Broker",
    farbe: "gruen",
    woran:
      "Solange nur Anlagen drin liegen, die halal sind, und auf dem Verrechnungskonto keine Zinsen gutgeschrieben werden. Zinsangebot beim Anbieter abschalten.",
  },
  {
    vertrag: "Krypto-Wallet",
    unter: "Eigene Wallet oder Börsenkonto",
    farbe: "gruen",
    woran:
      "Solange die Coins selbst halal sind, du sie wirklich besitzt und weder Hebel noch Lending mit garantiertem Ertrag nutzt.",
  },
  {
    vertrag: "Girokonto ohne Zinsen",
    unter: "Inklusive Debit- und Girocard",
    farbe: "gruen",
    woran:
      "Reine Aufbewahrung und Zahlungsverkehr. Kein Guthabenzins, kein eingeräumter Dispo. Karten ohne Kreditrahmen sind unproblematisch.",
  },
  {
    vertrag: "Versicherungen",
    unter: "Konventionell, Sach und Haftpflicht",
    farbe: "gelb",
    woran:
      "Freiwillig abgeschlossen grundsätzlich problematisch, wegen Gharar und der verzinsten Kapitalanlage dahinter. Anerkannte Ausnahmen: gesetzliche Pflicht wie Kfz-Haftpflicht oder eine Berufshaftpflicht, ohne die du den Beruf nicht ausüben darfst, sowie echte Not. Mit einem Gelehrten klären.",
  },
  {
    vertrag: "Kreditkarte",
    unter: "Echte Kreditkarte mit Rahmen",
    farbe: "gelb",
    woran:
      "Der Vertrag enthält eine Zinsklausel, deshalb eher unzulässig. Nur bei echter Notwendigkeit, etwa Mietwagen oder Kaution im Ausland, und nur wenn du den Betrag immer sofort vollständig ausgleichst. Teilzahlung und Revolving fallen raus.",
  },
  {
    vertrag: "Ratenzahlung",
    unter: "Finanzierung im Laden oder online",
    farbe: "gelb",
    woran:
      "Hängt an den Bedingungen. Zahlst du in Raten genau den Barpreis, ohne Aufschlag, Gebühr oder Zins, ist das für viele Gelehrte in Ordnung. Jeder Cent Aufpreis gegenüber der Sofortzahlung ist Riba.",
  },
  {
    vertrag: "Leasing und Autoabo",
    unter: "Fahrzeug oder Gerät",
    farbe: "gelb",
    woran:
      "Miete gegen Gebühr ist zulässig. Problematisch wird es bei Kaufverpflichtung am Ende, aufgeschlagenem Zinsanteil oder wenn dir das Risiko am Fahrzeug aufgebürdet wird, obwohl es dir nicht gehört. Vertrag zeigen lassen.",
  },
  {
    vertrag: "Ratenkredit und Dispo",
    unter: "Konsumkredit, Überziehung",
    farbe: "rot",
    woran:
      "Du zahlst mehr zurück, als du bekommen hast, allein für die Zeit. Das ist Riba im Kern, unabhängig von der Höhe des Zinssatzes.",
  },
  {
    vertrag: "Tagesgeld, Festgeld, Sparbuch",
    unter: "Verzinste Einlagen",
    farbe: "rot",
    woran:
      "Garantierter Ertrag ohne echtes Risiko. Ein Konto ohne Zinsen zur reinen Aufbewahrung bleibt davon unberührt.",
  },
  {
    vertrag: "Bausparvertrag",
    unter: "Ansparen plus Darlehen",
    farbe: "rot",
    woran: "Beide Hälften sind verzinst, das Guthaben und das spätere Darlehen. Der Vertrag ist auf Zins gebaut.",
  },
  {
    vertrag: "Klassische Lebens- und Rentenversicherung",
    unter: "Mit Garantiezins",
    farbe: "rot",
    woran:
      "Verzinste Kapitalanlage plus Unsicherheit über Leistung und Gegenleistung. Ein Depot mit Auszahlplan bildet dieselbe Funktion ohne Zinsvertrag ab.",
  },
  {
    vertrag: "CFDs, Hebelprodukte, Optionsscheine",
    unter: "Derivate",
    farbe: "rot",
    woran:
      "Du besitzt nichts, du wettest auf eine Richtung, oft mit geliehenem Geld. Gharar und Maysir zugleich.",
  },
];

export const fragen = [
  {
    titel: "Muss ich das wirklich?",
    text: "Schreibt es ein Gesetz vor, oder ist es eine Bequemlichkeit? Pflicht und Wunsch werden unterschiedlich bewertet.",
  },
  {
    titel: "Zahle ich einen Aufpreis?",
    text: "Vergleiche den Gesamtpreis mit dem Barpreis. Jede Differenz für die Zeit ist der Punkt, an dem es kippt.",
  },
  {
    titel: "Gibt es eine Alternative, die grün ist?",
    text: "Sparen und bar zahlen, eine Debitkarte statt Kreditkarte, ein Depot statt Rentenversicherung. In den meisten Fällen gibt es einen Weg ohne Zinsvertrag. Er dauert nur länger.",
  },
];
