// Von Hand gepflegt. Wie bei den Screening-Apps steht hinter diesem Vergleich keine
// Finanzfluss-Tabelle. Jeder Wert ist beim Anbieter selbst geprüft, mit Quelle und
// Prüfdatum. Was null ist, ist noch nicht geprüft und wird auch so angezeigt.
//
// Die Übersichten von Finanzfluss und Finanztip widersprachen sich bei den Preisen,
// deshalb zählt hier ausschliesslich die Seite des Herstellers.
import type { VergleichsZeile } from "@/components/vergleich/vergleichTypen";
import type { RohAnbieter } from "./vergleichHelfer";

/**
 * Steuersoftware im Vergleich.
 *
 * Warum diese Merkmale: Ein Steuerprogramm hat keine Halal-Frage. Es rechnet die
 * Steuer aus, und das tun alle nach demselben Gesetz. Der Unterschied liegt darin,
 * welche Einkünfte es überhaupt annimmt, was es kostet und wann man zahlt.
 *
 * Für unsere Leser zählt vor allem eine Zeile: Kapitalerträge. Wer über uns ein
 * Depot oder ein Krypto-Konto eröffnet, muss seine Erträge angeben. Ein Programm,
 * das die Anlage KAP nicht kann, nützt ihm nichts, auch wenn es billiger ist.
 *
 * Die zweite wichtige Zeile ist der Zeitpunkt der Zahlung. Wer erst bei der Abgabe
 * zahlt, sieht vorher, ob sich die Erklärung überhaupt lohnt.
 */
export const STEUER_ZEILEN: VergleichsZeile[] = [
  { key: "__angebot", label: "Angebot", art: "text", gruppe: "angebot" },
  {
    key: "plattform",
    label: "Läuft auf",
    art: "text",
    gruppe: "angebot",
    imRaster: true,
    hinweis:
      "Browser und Apps laufen überall. Die reinen Windows-Programme setzen einen Rechner mit Windows 10 oder 11 voraus, auf einem Mac oder am Handy laufen sie nicht.",
  },
  {
    key: "kapital",
    label: "Kapitalerträge",
    art: "text",
    gruppe: "angebot",
    imRaster: true,
    hinweis:
      "Nimmt das Programm Einkünfte aus Kapitalvermögen an, also die Anlage KAP? Das brauchst du, sobald du Zinsen, Dividenden oder Gewinne aus Verkäufen hattest, die nicht schon versteuert wurden. Wer im Ausland anlegt, kommt daran nicht vorbei.",
  },
  {
    key: "selbststaendige",
    label: "Selbstständige",
    art: "text",
    gruppe: "angebot",
    hinweis:
      "Kann das Programm eine Einnahmenüberschussrechnung, Umsatzsteuer und Gewerbesteuer? Für Angestellte ohne Nebengewerbe ist diese Zeile ohne Bedeutung.",
  },
  {
    key: "vermietung",
    label: "Vermietung",
    art: "text",
    gruppe: "angebot",
    hinweis: "Nimmt das Programm Einkünfte aus Vermietung und Verpachtung an, also die Anlage V?",
  },
  {
    key: "belegabruf",
    label: "Daten vom Finanzamt",
    art: "janein",
    gruppe: "angebot",
    hinweis:
      "Holt das Programm die Daten, die dem Finanzamt schon vorliegen, automatisch ab: Lohn, Renten, Beiträge zur Kranken- und Rentenversicherung. Das spart das Abtippen und verhindert Zahlendreher.",
  },
  { key: "sprache", label: "Sprache", art: "text", gruppe: "angebot" },
  {
    key: "preis",
    label: "Preis",
    art: "text",
    gruppe: "kosten",
    imRaster: true,
  },
  {
    key: "zahlung",
    label: "Wann du zahlst",
    art: "text",
    gruppe: "kosten",
    imRaster: true,
    hinweis:
      "Erst bei Abgabe heisst: Du füllst alles aus, siehst deine Erstattung und entscheidest dann, ob du abgibst. Vor dem Ausfüllen heisst: Du kaufst zuerst und weisst noch nicht, ob sich die Erklärung lohnt.",
  },
  {
    key: "abgaben",
    label: "Erklärungen je Kauf",
    art: "text",
    gruppe: "kosten",
    hinweis:
      "Wie viele Steuererklärungen du mit einem Kauf abgeben darfst. Wer sie mit der Familie teilt, zahlt je Erklärung deutlich weniger.",
  },
];

const stand = "19.09.2026";

/** Kurzform, damit nicht in jeder Zeile dieselbe Seite steht. */
const q = (url: string, hinweis: string) => ({ url, stand, hinweis });

/**
 * `preisEinzel` ist der Preis für die Rangfolge (P3-Spec 10.9, 26.09.2026): eine Erklärung,
 * einmalig statt Abo, reguläre Grundfassung statt Aktionspreis. Er steht wörtlich im Feld
 * `preis` und hat dieselbe Quelle.
 *
 * Sortiert nach Preis, die kostenlosen zuerst. Das ist die ehrliche Reihenfolge
 * und zugleich die unbequeme: Die beiden Programme an der Spitze zahlen uns
 * nichts, weil sie nichts kosten.
 */
export const steuersoftwareVergleich: RohAnbieter[] = [
  {
    id: "elster",
    name: "Mein ELSTER",
    produkt: "Amtlich",
    domain: "elster.de",
    preisEinzel: 0,
    werte: {
      plattform: "Browser, App MeinELSTER+",
      kapital: "ja",
      selbststaendige: "ja",
      vermietung: "ja",
      belegabruf: true,
      sprache: "Deutsch",
      preis: "0 €",
      zahlung: "entfällt",
      abgaben: "unbegrenzt",
    },
    quellen: {
      plattform: q("https://www.elster.de/", "Zugang über den Browser, dazu die App MeinELSTER+ für Handy und Tablet."),
      kapital: q("https://www.elster.de/", "Der Anbieter nennt Kapitalerträge ausdrücklich als abgedeckte Einkunftsart."),
      selbststaendige: q("https://www.elster.de/", "Auch Einkünfte aus selbstständiger Arbeit und betriebliche Erklärungen sind möglich."),
      vermietung: q("https://www.elster.de/", "Einkünfte aus Vermietung sind ausdrücklich genannt."),
      belegabruf: q("https://www.elster.de/", "Die vorausgefüllte Steuererklärung übernimmt die Daten, die der Verwaltung vorliegen."),
      preis: q("https://www.elster.de/", "ELSTER ist das Portal der Steuerverwaltung und vollständig kostenlos."),
      abgaben: q("https://www.elster.de/", "Es gibt keine Lizenz und damit keine Begrenzung der Abgaben."),
      sprache: q("https://www.elster.de/", "Das Portal gibt es nur auf Deutsch."),
    },
  },
  {
    id: "check24-steuer",
    name: "CHECK24 Steuer",
    produkt: "Web und App",
    domain: "steuer.check24.de",
    preisEinzel: 0,
    werte: {
      plattform: "Web, iOS, Android",
      kapital: "ja",
      selbststaendige: "ja",
      vermietung: "ja",
      belegabruf: true,
      sprache: "Deutsch",
      preis: "0 €",
      zahlung: "entfällt",
      abgaben: null,
    },
    quellen: {
      plattform: q("https://steuer.check24.de/", "Der Anbieter nennt eine Webfassung und eine App fürs Handy."),
      kapital: q("https://steuer.check24.de/", "Kapitalanleger stehen in der Liste der unterstützten Fälle."),
      selbststaendige: q("https://steuer.check24.de/", "Selbstständige stehen in der Liste der unterstützten Fälle."),
      vermietung: q("https://steuer.check24.de/", "Vermieter stehen in der Liste der unterstützten Fälle."),
      belegabruf: q("https://steuer.check24.de/", "Der Steuer-Abruf holt die Daten laut Anbieter direkt vom Finanzamt."),
      preis: q("https://steuer.check24.de/", "Der Anbieter wirbt ausdrücklich mit kostenloser Abgabe, auch bei Zusammenveranlagung."),
      sprache: q("https://steuer.check24.de/", "Das Angebot gibt es nur auf Deutsch."),
    },
  },
  {
    id: "steuereasy",
    name: "STEUEReasy",
    produkt: "Windows",
    domain: "steuertipps.de",
    preisEinzel: 17.99,
    werte: {
      plattform: "nur Windows",
      kapital: null,
      selbststaendige: "nein",
      vermietung: "nein",
      belegabruf: null,
      sprache: "Deutsch",
      preis: "15,99 €, regulär 17,99 €",
      zahlung: "vor dem Ausfüllen",
      abgaben: "1",
    },
    quellen: {
      plattform: q("https://www.steuertipps.de/shop/software/steuereasy", "Vorausgesetzt wird Windows 10 oder 11 in der 64-Bit-Fassung. Eine Mac-Fassung gibt es nicht."),
      selbststaendige: q("https://www.steuertipps.de/shop/software/steuereasy", "Das Programm ist auf einfache Fälle zugeschnitten, Selbstständige nennt der Anbieter nicht."),
      vermietung: q("https://www.steuertipps.de/shop/software/steuereasy", "Vermietung nennt der Anbieter nicht, das Programm zielt auf Angestellte, Studierende und Berufseinsteiger."),
      preis: q("https://www.steuertipps.de/shop/software/steuereasy", "15,99 € im Angebot, regulär 17,99 €, als Sofort-Download."),
      abgaben: q("https://www.steuertipps.de/shop/software/steuereasy", "Eine Abgabe ist enthalten, weitere lassen sich nicht nachkaufen."),
      sprache: q("https://www.steuertipps.de/shop/software/steuereasy", "Nur auf Deutsch."),
    },
  },
  {
    id: "quicksteuer",
    name: "QuickSteuer",
    produkt: "Windows",
    domain: "lexware.de",
    preisEinzel: 19.99,
    werte: {
      plattform: "nur Windows",
      kapital: "ja",
      selbststaendige: "ja, EÜR nur in der Fassung Deluxe",
      vermietung: "ja",
      belegabruf: true,
      sprache: "Deutsch",
      preis: "19,99 €, Deluxe 34,99 €",
      zahlung: "vor dem Ausfüllen",
      abgaben: "3, Deluxe 5",
    },
    quellen: {
      plattform: q("https://shop.lexware.de/quicksteuer", "Vorausgesetzt wird Windows 10 oder 11 in der 64-Bit-Fassung."),
      kapital: {
        url: "https://shop.lexware.de/quicksteuer",
        stand: "26.09.2026",
        hinweis:
          "Im Leistungsvergleich des Shops steht bei beiden Fassungen als enthalten markiert: „Amtliche Formulare und Steueranlagen (Mantelbogen, N, Kind, KAP, SO, R, V, FW, AUS, G, S, Unterhalt, L, AV, Vorsorgeaufwand, Eigenheimzulage)“, darunter die Anlage KAP.",
      },
      selbststaendige: q("https://shop.lexware.de/quicksteuer", "Beide Fassungen nennen Freiberufler und Selbstständige. Den EÜR-Rechner und die gewerbliche Erklärung hat nur Deluxe."),
      vermietung: {
        url: "https://shop.lexware.de/quicksteuer",
        stand: "26.09.2026",
        hinweis:
          "Dieselbe Zeile im Leistungsvergleich, „Amtliche Formulare und Steueranlagen (Mantelbogen, N, Kind, KAP, SO, R, V, FW, AUS, G, S, Unterhalt, L, AV, Vorsorgeaufwand, Eigenheimzulage)“, nennt auch die Anlage V und ist bei beiden Fassungen enthalten markiert.",
      },
      belegabruf: {
        url: "https://shop.lexware.de/quicksteuer",
        stand: "26.09.2026",
        hinweis:
          "Im Leistungsvergleich ist die Zeile „Vorausgefüllte Steuererklärung (VaSt)“ bei beiden Fassungen als enthalten markiert.",
      },
      preis: q("https://shop.lexware.de/quicksteuer", "19,99 € für die Standardfassung, 34,99 € für Deluxe, jeweils inklusive Mehrwertsteuer."),
      abgaben: q("https://shop.lexware.de/quicksteuer", "Bis zu 3 Steuererklärungen in der Standardfassung, bis zu 5 in Deluxe, jeweils Privatlizenz für einen Arbeitsplatz."),
      sprache: q("https://shop.lexware.de/quicksteuer", "Nur auf Deutsch."),
    },
  },
  {
    id: "taxman",
    name: "Taxman",
    produkt: "Windows",
    domain: "lexware.de",
    preisEinzel: 34.9,
    werte: {
      plattform: "nur Windows",
      kapital: "ja",
      selbststaendige: "ja",
      vermietung: "ja",
      belegabruf: true,
      sprache: "Deutsch",
      preis: "34,90 €",
      zahlung: "vor dem Ausfüllen",
      abgaben: "bis 5",
    },
    quellen: {
      plattform: q("https://shop.lexware.de/taxman", "Windows 10 oder 11 in der 64-Bit-Fassung. Der Anbieter nennt ausdrücklich keine Mac-Unterstützung."),
      kapital: {
        url: "https://shop.lexware.de/taxman",
        stand: "26.09.2026",
        hinweis:
          "Im Leistungsvergleich des Shops steht bei beiden Fassungen als enthalten markiert: „Amtliche Formulare und Steueranlagen (Mantelbogen, N, Kind, KAP, SO, R, V, FW, AUS, G, S, Unterhalt, L, AV, Vorsorgeaufwand, Eigenheimzulage)“, darunter die Anlage KAP.",
      },
      selbststaendige: q("https://shop.lexware.de/taxman", "Der Anbieter nennt Selbstständige und Freiberufler als Zielgruppe der Standardfassung."),
      belegabruf: {
        url: "https://shop.lexware.de/taxman",
        stand: "26.09.2026",
        hinweis:
          "Im Leistungsvergleich ist die Zeile „Vorausgefüllte Steuererklärung (VaSt)“ bei beiden Fassungen als enthalten markiert.",
      },
      vermietung: q("https://shop.lexware.de/taxman", "Vermieter stehen in der Zielgruppe der Standardfassung."),
      preis: q("https://shop.lexware.de/taxman", "34,90 € inklusive Mehrwertsteuer für Taxman 2026. Die Fassung für Steuerberater kostet 172,43 €."),
      abgaben: q("https://shop.lexware.de/taxman", "Bis zu 5 Steuererklärungen je Privatlizenz."),
      sprache: q("https://shop.lexware.de/taxman", "Nur auf Deutsch."),
    },
  },
  {
    id: "steuergo",
    name: "SteuerGo",
    produkt: "Web und App",
    domain: "steuergo.de",
    preisEinzel: 34.95,
    werte: {
      plattform: "Web, iOS, Android",
      kapital: "ja",
      selbststaendige: "ja",
      vermietung: "ja",
      belegabruf: true,
      sprache: "Deutsch, Englisch, Polnisch, Rumänisch, Russisch",
      preis: "34,95 €, 3 für 89,95 €, 4 für 114,95 €",
      zahlung: "erst bei Abgabe",
      abgaben: "1 je Kauf",
    },
    quellen: {
      plattform: q("https://www.steuergo.de", "Browser auf Windows, Mac und Linux, dazu Apps für iOS und Android."),
      kapital: q("https://www.steuergo.de", "Kapitalerträge nennt der Anbieter unter den abgedeckten Einkunftsarten."),
      belegabruf: {
        url: "https://www.steuergo.de/de/texte/0/460/belegabruf_die_vorausgefuellte_steuererklaerung_vast",
        stand: "26.09.2026",
        hinweis:
          "„SteuerGo bietet als besonderen Service den Datenabruf an. Dadurch haben Sie die Möglichkeit, personenbezogene Daten abzurufen, die beim Finanzamt über Sie gespeichert sind. Diese Daten können Sie direkt in Ihre Steuererklärung importieren.“",
      },
      selbststaendige: q("https://www.steuergo.de", "Der Anbieter nennt Selbstständige unter den abgedeckten Fällen."),
      vermietung: q("https://www.steuergo.de", "Einkünfte aus Vermietung nennt der Anbieter ausdrücklich."),
      sprache: q("https://www.steuergo.de", "Die Oberfläche gibt es auf Deutsch, Englisch, Polnisch, Rumänisch und Russisch. Das ist unter allen Anbietern die grösste Auswahl."),
      preis: q("https://www.steuergo.de/du/start/preise", "34,95 € für eine Erklärung, 89,95 € für drei, 114,95 € für vier, jeweils inklusive Mehrwertsteuer."),
      zahlung: q("https://www.steuergo.de/du/start/preise", "Kostenlos ausfüllen, bezahlt wird erst bei der Abgabe."),
      abgaben: q("https://www.steuergo.de/du/start/preise", "Je Kauf eine Abgabe, die Pakete gelten für mehrere Jahre oder mehrere Personen und sind an das Benutzerkonto gebunden."),
    },
  },
  {
    id: "lohnsteuer-kompakt",
    name: "Lohnsteuer kompakt",
    produkt: "Web und App",
    domain: "lohnsteuer-kompakt.de",
    preisEinzel: 34.95,
    werte: {
      plattform: "Web, iOS, Android",
      kapital: "ja",
      selbststaendige: null,
      vermietung: "ja",
      belegabruf: true,
      sprache: "Deutsch",
      preis: "34,95 €, 3 für 89,95 €, 4 für 114,95 €",
      zahlung: "erst bei Abgabe",
      abgaben: "1 je Kauf",
    },
    quellen: {
      plattform: q("https://www.lohnsteuer-kompakt.de/", "Läuft im Browser ohne Installation, dazu Apps für iOS und Android."),
      kapital: {
        url: "https://www.lohnsteuer-kompakt.de/de/feldhilfe/2025/40/947/einkprozc3prozbcnfte+aus+kapitalvermprozc3prozb6gen-+anlage+kap+-",
        stand: "26.09.2026",
        hinweis:
          "Die Feldhilfe zur Steuererklärung 2025 fragt wörtlich: „Haben Sie Einkünfte aus Kapitalvermögen erzielt? (Anlage KAP, KAP-BET oder KAP-INV)“. Das ist ein Eingabefeld im Interview für das laufende Steuerjahr.",
      },
      selbststaendige: q("https://www.lohnsteuer-kompakt.de/", "Der Anbieter nennt auf der Startseite Angestellte, Rentner und Studierende. Zu Selbstständigen steht dort nichts, deshalb ungeprüft. Ratgeberseiten zur Anlage EÜR (Stand 26.09.2026) belegen keine Funktion im Programm."),
      vermietung: {
        url: "https://www.lohnsteuer-kompakt.de/de/feldhilfe/2025/40/950/einkprozc3prozbcnfte+aus+vermietung+proz26+verpachtung-+anlage+v+-",
        stand: "26.09.2026",
        hinweis:
          "Die Feldhilfe zur Steuererklärung 2025 fragt wörtlich: „Erwirtschafteten Sie Einkünfte aus Vermietung und Verpachtung? (Anlage V)“.",
      },
      belegabruf: {
        url: "https://www.lohnsteuer-kompakt.de/texte/0/460/elektronischer_datenabruf_die_vorausgefuellte_steuererklaerung",
        stand: "26.09.2026",
        hinweis:
          "„Lohnsteuer kompakt bietet als besonderen Service den Datenabruf an. Dadurch haben Sie die Möglichkeit, personenbezogene Daten abzurufen, die beim Finanzamt über Sie gespeichert sind. Diese Daten können Sie direkt in Ihre Steuererklärung importieren.“",
      },
      preis: q("https://www.lohnsteuer-kompakt.de/", "34,95 € für eine Erklärung, 89,95 € für drei, 114,95 € für vier."),
      zahlung: q("https://www.lohnsteuer-kompakt.de/", "„Kostenlos testen, erst bei Abgabe bezahlen.“ Kein Abo, jedes Paket ist ein Einmalkauf."),
      abgaben: q("https://www.lohnsteuer-kompakt.de/", "Je Kauf eine Abgabe, das Paket ist an das Benutzerkonto gebunden."),
      sprache: q("https://www.lohnsteuer-kompakt.de/", "Nur auf Deutsch."),
    },
  },
  {
    id: "steuersparerklaerung",
    name: "SteuerSparErklärung",
    produkt: "Download und Online",
    domain: "steuertipps.de",
    preisEinzel: 34.95,
    werte: {
      plattform: "Windows, Mac, Online, App",
      kapital: "ja",
      selbststaendige: "nur in der Fassung für Selbstständige, 94,95 €",
      vermietung: "nur in der Fassung plus, 45,95 €",
      belegabruf: true,
      sprache: "Deutsch",
      preis: "ab 34,95 €, plus 45,95 €, Selbstständige 94,95 €",
      zahlung: "vor dem Ausfüllen",
      abgaben: "1, in der Fassung plus bis 5",
    },
    quellen: {
      plattform: q("https://www.steuertipps.de/shop/software", "Die Online-Fassung läuft auf Windows, Mac und Linux, dazu gibt es Download, DVD und eine App."),
      kapital: {
        url: "https://www.steuertipps.de/shop/software",
        stand: "26.09.2026",
        hinweis:
          "Im Abschnitt „Mehr als nur eine Steuererklärung“ zur SteuerSparErklärung nennt der Anbieter: „Abgeltungsteuer: Ist die Abgabe der Anlage KAP für Kapitalerträge für Sie von Vorteil?“",
      },
      vermietung: {
        url: "https://www.steuertipps.de/shop/software",
        stand: "26.09.2026",
        hinweis:
          "Vermietung nennt der Anbieter nur bei der Plus-Version: „Die Plus-Version richtet sich an alle, die mehr steuerliche Themen abdecken möchten: Immobilien (Kauf, Bau, Vermietung, Abschreibung)“. Bei der Standardfassung fehlt das Thema in der Beschreibung.",
      },
      belegabruf: {
        url: "https://www.steuertipps.de/shop/software",
        stand: "26.09.2026",
        hinweis:
          "„Vorausgefüllte Steuererklärung (VaSt): Die vom Arbeitgeber, Rententräger und Versicherungen gemeldeten Daten (z.B. die Lohnsteuerbescheinigung, Rentenbezugsmitteilung) können über ELSTER in die SteuerSparErklärung übernommen werden.“",
      },
      selbststaendige: q("https://www.steuertipps.de/shop/software", "Erst die Fassung für Selbstständige zu 94,95 € bringt Einnahmenüberschussrechnung, Umsatzsteuer und Gewerbesteuer."),
      preis: q("https://www.steuertipps.de/shop/software", "Standard ab 34,95 €, plus ab 45,95 €, Fassung für Selbstständige ab 94,95 €."),
      abgaben: q("https://www.steuertipps.de/shop/software", "Die Standardfassung erlaubt eine Abgabe je Lizenz, die Fassung plus bis zu fünf."),
      sprache: q("https://www.steuertipps.de/shop/software", "Nur auf Deutsch."),
    },
  },
  {
    id: "wundertax",
    name: "wundertax",
    produkt: "Web",
    domain: "wundertax.de",
    preisEinzel: 34.99,
    werte: {
      plattform: "Web",
      kapital: null,
      selbststaendige: "ja",
      vermietung: null,
      belegabruf: null,
      sprache: "Deutsch, Englisch über germantaxes.de",
      preis: "34,99 €, zusammen veranlagt 49,99 €",
      zahlung: "erst bei Abgabe",
      abgaben: "1 je Kauf",
    },
    quellen: {
      plattform: q("https://wundertax.de/", "Läuft im Browser, eine eigene App nennt der Anbieter nicht."),
      selbststaendige: q("https://wundertax.de/", "Selbstständige stehen in der Liste der Zielgruppen, daneben eigene Seiten für Studierende, Polizei und Bundeswehr."),
      sprache: q("https://wundertax.de/", "Für Menschen ohne Deutschkenntnisse führt der Anbieter die Schwesterseite germantaxes.de auf Englisch."),
      preis: q("https://wundertax.de/preise/", "34,99 € für eine Erklärung, 49,99 € bei Zusammenveranlagung, Pakete ab 89,99 € für drei."),
      zahlung: q("https://wundertax.de/preise/", "Die Gebühr fällt erst an, wenn du die ausgefüllte Erklärung ans Finanzamt schickst."),
      abgaben: q("https://wundertax.de/preise/", "Je Kauf eine Abgabe, Pakete für drei und vier Erklärungen sind günstiger."),
    },
  },
  {
    id: "wiso-steuer",
    name: "WISO Steuer",
    produkt: "Abo oder Einzelkauf",
    domain: "buhl.de",
    preisEinzel: 45.99,
    werte: {
      plattform: "Windows, Mac, Web, iOS, Android",
      kapital: "ja",
      selbststaendige: "ja",
      vermietung: "ja",
      belegabruf: true,
      sprache: "Deutsch",
      preis: "35,99 € im Abo, 45,99 € einmalig",
      zahlung: "erst bei Abgabe",
      abgaben: "bis 5",
    },
    quellen: {
      plattform: q("https://www.buhl.de/steuer/", "Web ohne Installation, dazu Windows 10 und 11, macOS ab 12 Monterey sowie Apps für iOS und Android. Das ist die breiteste Abdeckung im Vergleich."),
      kapital: {
        url: "https://www.buhl.de/steuer/tipps/aktien/",
        stand: "26.09.2026",
        hinweis:
          "„Schluss mit Formular-Chaos. WISO Steuer importiert deine Depot-Daten automatisch und erledigt die Anlage KAP für dich.“",
      },
      selbststaendige: q("https://www.buhl.de/steuer/", "Der Anbieter nennt Selbstständige unter den abgedeckten Fällen."),
      vermietung: q("https://www.buhl.de/steuer/", "Einkünfte aus Vermietung nennt der Anbieter ausdrücklich."),
      belegabruf: q("https://www.buhl.de/steuer/", "Amtlich anerkannte Datenübertragung nach § 87c AO, die Daten des Finanzamts werden übernommen."),
      preis: q("https://www.buhl.de/steuer/", "Testfassung 0 €, Vorteils-Abo 35,99 € im Jahr mit automatischer Verlängerung, Einzelkauf 45,99 €."),
      zahlung: q("https://www.buhl.de/steuer/", "Alles kostenlos ausprobieren, bezahlt wird erst bei der Abgabe."),
      abgaben: q("https://www.buhl.de/steuer/", "Mit einer Lizenz bis zu 5 Steuererklärungen, also auch für Ehepartner und Kinder."),
      sprache: q("https://www.buhl.de/steuer/", "Nur auf Deutsch. Das Programm gilt nur für in Deutschland unbeschränkt Steuerpflichtige."),
    },
  },
  {
    id: "smartsteuer",
    name: "smartsteuer",
    produkt: "Web",
    domain: "smartsteuer.de",
    preisEinzel: 39.99,
    werte: {
      plattform: "Browser, auch am Handy",
      kapital: "ja",
      selbststaendige: "ja",
      vermietung: "ja",
      belegabruf: true,
      sprache: "Deutsch",
      preis: "39,99 € je Steuerjahr",
      zahlung: "erst bei Abgabe",
      abgaben: "5 im selben Steuerjahr",
    },
    quellen: {
      plattform: q("https://www.smartsteuer.de/online/", "Keine eigene App: Die Anwendung läuft im Browser auf Handy, Laptop und Tablet."),
      kapital: q("https://www.smartsteuer.de/online/", "Einkünfte aus Kapitalvermögen nennt der Anbieter unter den abgedeckten Einkunftsarten."),
      vermietung: {
        url: "https://www.smartsteuer.de/online/faqs/",
        stand: "26.09.2026",
        hinweis:
          "Die eigene FAQ-Rubrik führt „Vermietung & Verpachtung“ mit den Unterthemen „Abschreibung“ und „Untervermietung“ als eigene Kategorie, dazu eine „Anlage V (Einkünfte aus Vermietung und Verpachtung) – Ausfüllhilfe“.",
      },
      belegabruf: {
        url: "https://www.smartsteuer.de/online/faq/du-gibt-es-anleitungen-zum-belegabruf/",
        stand: "26.09.2026",
        hinweis:
          "Die Anleitung beschreibt den Ablauf im eigenen Konto: „Gehe rechts in den Bereich vorausgefüllte Steuererklärung und klicke auf › Daten abholen ‹.“",
      },
      selbststaendige: q("https://www.smartsteuer.de/online/", "Für Selbstständige auch Umsatzsteuer- und Gewerbesteuererklärung."),
      preis: q("https://www.smartsteuer.de/online/preise/", "39,99 € je Steuerjahr, inklusive Mehrwertsteuer."),
      zahlung: q("https://www.smartsteuer.de/online/preise/", "Bezahlt wird im Bereich Abgabe, also am Ende. Zahlung per PayPal, Lastschrift oder Karte."),
      abgaben: q("https://www.smartsteuer.de/online/preise/", "Fünf Abgaben je Kauf, aber nur im selben Steuerjahr. Geteilt mit der Familie sind das rund 8 € je Person."),
      sprache: q("https://www.smartsteuer.de/online/", "Nur auf Deutsch."),
    },
  },
  {
    id: "steuerbot",
    name: "Steuerbot",
    produkt: "Web und App",
    domain: "steuerbot.com",
    preisEinzel: 39.99,
    werte: {
      plattform: "Web, iOS, Android",
      kapital: "nein",
      selbststaendige: "nein",
      vermietung: "nein",
      belegabruf: true,
      sprache: "Deutsch",
      preis: "39,99 €",
      zahlung: "erst bei Abgabe",
      abgaben: "1",
    },
    quellen: {
      plattform: q("https://www.steuerbot.com/", "Apps für iOS und Android, dazu die Fassung im Browser."),
      belegabruf: {
        url: "https://www.steuerbot.com/vorausgefuellte-steuererklaerung",
        stand: "26.09.2026",
        hinweis: "„Wir rufen deine Steuerdaten beim Finanzamt ab, sobald diese vorliegen.“",
      },
      kapital: q("https://www.steuerbot.com/", "Kapitalerträge gehören laut Anbieter nicht zu den unterstützten Fällen."),
      selbststaendige: q("https://www.steuerbot.com/", "Selbstständige unterstützt der Anbieter nicht, das Programm ist auf Angestellte zugeschnitten."),
      vermietung: q("https://www.steuerbot.com/", "Vermietung gehört nicht zu den unterstützten Fällen."),
      preis: q("https://www.steuerbot.com/", "39,99 € je Steuererklärung."),
      zahlung: q("https://www.steuerbot.com/", "Die Berechnung der Erstattung ist kostenlos, bezahlt wird vor der Abgabe."),
      abgaben: q("https://www.steuerbot.com/", "Eine Erklärung je Kauf."),
      sprache: q("https://www.steuerbot.com/", "Nur auf Deutsch."),
    },
  },
  {
    id: "taxfix",
    name: "Taxfix",
    produkt: "Web und App",
    domain: "taxfix.de",
    preisEinzel: 49.99,
    werte: {
      plattform: "Web, iOS, Android",
      kapital: "ja",
      selbststaendige: "ja",
      vermietung: "ja",
      belegabruf: true,
      sprache: "Deutsch",
      preis: "39,99 € im Abo, 49,99 € einmalig",
      zahlung: "erst bei Abgabe",
      abgaben: "1",
    },
    quellen: {
      plattform: q("https://taxfix.de/kosten/", "Apps für iOS und Android, dazu die Fassung im Browser."),
      belegabruf: {
        url: "https://taxfix.de/ratgeber/dokumente-fristen/vorausgefuellte-steuererklaerung/",
        stand: "26.09.2026",
        hinweis:
          "„Auch bei der Taxfix Steuer-App ist diese Funktion durch die enge Zusammenarbeit mit ELSTER möglich!“",
      },
      kapital: q("https://taxfix.de/kosten/", "Kapitalerträge nennt der Anbieter unter den abgedeckten Fällen."),
      selbststaendige: q("https://taxfix.de/kosten/", "Selbstständige und Kleinunternehmer nennt der Anbieter unter den abgedeckten Fällen."),
      vermietung: q("https://taxfix.de/kosten/", "Einkünfte aus Vermietung nennt der Anbieter unter den abgedeckten Fällen."),
      preis: q(
        "https://taxfix.de/kosten/",
        "39,99 € im Jahresabo, 49,99 € als Einmalzahlung. Zusammen veranlagt 59,99 € im Abo und 69,99 € einmalig. Der Experten-Service kostet 20 Prozent der Erstattung, mindestens 99,99 €, und wird auch fällig, wenn nicht abgegeben wird.",
      ),
      zahlung: q("https://taxfix.de/kosten/", "Ausfüllen und Erstattung berechnen ist kostenlos, bezahlt wird bei der Abgabe. Bezahlt wird nur per Lastschrift, weder Karte noch PayPal."),
      abgaben: q("https://taxfix.de/kosten/", "Eine Erklärung je Kauf, die Zusammenveranlagung zählt als eine."),
      sprache: q("https://taxfix.de/kosten/", "Nur auf Deutsch."),
    },
  },
];

export const STEUER_FILTER = [
  { key: "kapital", label: "Kapitalerträge", erlaubt: ["ja"] },
  { key: "selbststaendige", label: "Selbstständige", erlaubt: ["ja"] },
];
