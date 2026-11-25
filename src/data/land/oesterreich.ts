/**
 * Österreich-Version der Vergleiche (DACH1, 23.11.2026). HANDGEPFLEGT, Stand 23.11.2026. Reihenfolge je Vergleich nach der
 * Rangfolge-Entscheidung DACH1 (`reihenfolge`, siehe `typen.ts`). Kosten-Punkte nach den Regeln des deutschen Generators
 * (~/rebrand/data/vergleiche/bauen.py, depot_punkte und giro_punkte), Werte aus dem Finanzfluss Depot-Vergleich Österreich
 * (Stand 01.10.2026), den Preisblättern der Banken und justETF Österreich.
 *
 * Belegregel: Deutsche Produkte, die Kunden in Österreich nehmen (Traders Place, Smartbroker+, DKB), tragen die Belege des
 * deutschen Vergleichs, Abweichungen in Österreich stehen dabei (nicht steuereinfach). Österreichische Niederlassungen
 * (flatex, Trade Republic, Scalable) tragen nur Belege für Österreich. Fehlt einer, steht null („noch nicht geprüft“), nie
 * grün ohne Zitat. Der Royal-Mint-Vorteil „nach einem Jahr steuerfrei“ gilt in Österreich nicht belegt und steht hier nie.
 */
import { leereListe, type LandDaten } from "./typen";

/**
 * Prüfung 2 (23.11.2026): Gezählt wird nur, was der Emittent für Österreich bestätigt: iShares MSCI World Islamic
 * IE00B27YCN58 und iShares USD Sukuk IE000929U2U9 (BlackRock Österreich „Zum Vertrieb zugelassen“), Royal Mint Physical
 * Gold ETC XS2115336336 (HANetf, Registrations „Austria“). Die Seite zeigt den Namen statt „1 von 1“.
 */
const ANLAGEN_ANZEIGE = {
  halalEtfsFonds: { "1 von 1": "World Islamic" },
  halalSukuk: { "1 von 1": "USD Sukuk" },
  halalEdelmetalle: { "1 von 1": "Royal Mint Gold" },
};

export const OESTERREICH: LandDaten = {
  "depot": {
    entwurf: false,
    stand: "23.11.2026",
    quellenHinweis: "Basis: Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026; eigene Halal-Prüfung mit Anbieter-Belegen. Traders Place, Smartbroker+ und DKB: Belege des deutschen Vergleichs, dasselbe Depot. Kaufbare Halal-ETFs bei Trade Republic: justETF Österreich, Stand 11/2026.",
    /* Prüfung 2 (S-2): ein Satz, er steht am Handy unter der Liste. */
    einleitung: ["Hier stehen Depots, die du mit Wohnsitz in Österreich eröffnen kannst. Steuereinfach heißt: Die Bank führt die KESt für dich ab."],
    kriterien: [{"titel": "Ohne Zinsen nutzbar", "text": "Liegt dein Guthaben ohne Zins, oder lassen sich die Zinsen abschalten? Nur mit Beleg des Anbieters steht ein Depot hier."}, {"titel": "Halal-Anlagen für Österreich", "text": "Kannst du dort den iShares MSCI World Islamic, den iShares USD Sukuk und den Royal Mint Gold-ETC kaufen? Für diese drei bestätigen die Herausgeber die Zulassung in Österreich."}],
    reihenfolge: ["flatex-depot-at", "traders-place-depot-at", "smartbroker-plus-depot-at", "trade-republic-depot-at", "dkb-depot-at", "scalable-capital-depot-at", "dadat-depot-at", "easybank-depot-at"],
    anteilN: {"halalEtfsFonds": 1, "halalSukuk": 1, "halalEdelmetalle": 1},
    anzeige: ANLAGEN_ANZEIGE,
    seoText: "Welches Depot ist halal? {anzahl} Depots für Österreich im Vergleich: ohne Zinsen nutzbar, steuereinfach mit KESt, und welche Halal-ETFs, Sukuk und Gold-ETCs dort kaufbar sind.",
    anbieter: [
      {
        "id": "flatex-depot-at",
        "name": "flatex",
        "produkt": "Depot",
        "domain": "flatex.de",
        "haus": "flatex-at",
        "werte": {
          "zinsfreiAbStart": "gut",
          "halalEtfsFonds": "1 von 1",
          "halalSukuk": null,
          "halalEdelmetalle": "1 von 1",
          "depotgebuehr": "0 €",
          "orderkosten": "5,90 € bis 3.500 € Ordervolumen (Wien und Deutschland)",
          "etfSparplanKosten": "1,50 € je Ausführung, über 700 Premium-Sparpläne 0 €",
          "sparrate": "25 € bis unbegrenzt",
          "intervalle": "Monat, Quartal, Halbjahr, Jahr",
          "handelsplaetze": "AT, Europa (ex-AT), USA, Sonstige, OTC",
          "kapest": true,
          "appIos": "4,6 / 5",
          "kundenservice": "E-Mail, Telefon"
        },
        "quellen": {
          "depotgebuehr": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "sparrate": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "intervalle": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "handelsplaetze": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "kapest": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "appIos": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "kundenservice": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "zinsfreiAbStart": {
            "url": "https://konto.flatex.de/formularcenter_at_bank/public/5100100.pdf",
            "stand": "23.11.2026",
            "hinweis": "Preis- und Leistungsverzeichnis der flatexDEGIRO Bank SE Niederlassung Österreich, gültig ab 20.11.2026: „Guthabenzins (freibleibend) 0,00 % p.a.“"
          },
          "orderkosten": {
            "url": "https://www.flatex.at/preise/",
            "stand": "23.11.2026",
            "hinweis": "flatex.at, Preise: 5,90 € je Order bis 3.500 € Ordervolumen an den Börsen Wien und Deutschland."
          },
          "etfSparplanKosten": {
            "url": "https://www.flatex.at/preise/",
            "stand": "23.11.2026",
            "hinweis": "flatex.at, Preise: Sparplan 1,50 € je Ausführung, über 700 Premium-Sparpläne ohne Ausführungsgebühr."
          },
          "halalEtfsFonds": {
            "url": "https://www.broker-test.at/depot/flatex/",
            "stand": "18.09.2025",
            "hinweis": "Kaufbar: iShares MSCI World Islamic, HANetf Saturna Al-Kawthar Global Focused Equity. broker-test.at, Antwort des Autors vom 18.09.2025 zu flatex Österreich: „IE00B27YCN58 | IE00BMYMHS24 Den ersten ETF gibt es auch als Sparplan, den zweiten ETF leider nur als Kauf über den Handelsplatz.“ In Österreich gezählt wird nur der iShares MSCI World Islamic (IE00B27YCN58): BlackRock Österreich nennt ihn „Zum Vertrieb Zugelassen In … Österreich“ (blackrock.com/at, 23.11.2026). Für die übrigen Halal-ETFs fehlt ein Zulassungsbeleg des Emittenten, sie zählen nicht. Nicht zugelassen laut justETF Österreich: iShares MSCI USA und EM Islamic, alle HSBC-ETFs."
          },
          "halalEdelmetalle": {
            "url": "https://www.finanzfluss.de/informer/etf/xs2115336336/",
            "stand": "25.11.2026",
            "hinweis": "Kaufbar: Royal Mint Physical Gold ETC (XS2115336336). Finanzfluss Informer, gelesen am 25.11.2026: „Den HANetf The Royal Mint Physical Gold ETC Securities kannst du bei 1822direkt, Bitpanda, Consorsbank, DKB, Flatex, Flatex AT, Freedom24, N26, S Broker, Scalable Capital, Trade Republic, Trading 212 und comdirect mit einem Sparplan besparen.“ Flatex AT steht dort als eigener Broker neben Flatex. Wer das Papier im Sparplan führt, verkauft es auch einzeln. In Österreich registriert laut HANetf (Registrations: Austria). Die übrigen Edelmetall-ETCs zählen in Österreich erst mit Beleg der Zulassung."
          }
        },
        "finanzPunkte": {
          "depotgebuehr": 16,
          "etfSparplanProzent": 6,
          "etfSparplanPauschal": 1.333,
          "orderProzent": 3,
          "orderPauschal": 0,
          "mindestsparrate": 1,
          "maximalsparrate": 1,
          "intervalle": 2.0,
          "handelsplaetze": 2,
          "kapest": 9,
          "kundenservice": 4,
          "app": 5,
          "abzug": 0
        },
        "halalAnlagenPunkte": {
          "halalEtfsFonds": 1,
          "halalEdelmetalle": 1
        }
      },
      {
        "id": "traders-place-depot-at",
        "name": "Traders Place",
        "produkt": "Depot",
        "domain": "tradersplace.de",
        "haus": "traders-place",
        "werte": {
          "zinsfreiAbStart": "gut",
          "halalEtfsFonds": "1 von 1",
          "halalSukuk": "1 von 1",
          "halalEdelmetalle": "1 von 1",
          "depotgebuehr": "0€",
          "orderkosten": "0,95€ je Order unter 500€, ab 500€: 0€",
          "etfSparplanKosten": "0€ bei Amundi, DWS, DJE, Xtrackers, iShares und Vanguard, sonst 0,50€",
          "sparrate": "1€ bis 7.500€",
          "intervalle": "Woche, Zweiwöchentlich, Monat, Zweimonatlich, Quartal, Halbjahr, Jahr",
          "kundenservice": "E-Mail, Telefon, Chat",
          "handelsplaetze": "AT, Europa (ex-AT), USA, Sonstige, OTC",
          "kapest": false,
          "appIos": "4,3 / 5"
        },
        "quellen": {
          "zinsfreiAbStart": {
            "url": "https://tradersplace.de/konditionen/deine-konditionen",
            "stand": "19.09.2026",
            "hinweis": "Beleg aus dem deutschen Vergleich, dasselbe Produkt für Kunden in Österreich: Reiter Kontokonditionen, „Zinssätze Verrechnungskonto … EUR-Verrechnungskonto Guthabenzinssatz 0% p.a. … Fremdwährungs-Verrechnungskonto (USD, CHF, GBP) Guthabenzinssatz 0% p.a.“ / Zinskonto (tradersplace.de/angebot/uebersicht/zinskonto): „Um das Zinskonto zu eröffnen, benötigst du ein Traders Place Depot. Einzahlungen auf das Zinskonto können nur von deinem bestehenden Traders Place Verrechnungskonto erfolgen“"
          },
          "orderkosten": {
            "url": "https://tradersplace.de/konditionen/deine-konditionen",
            "stand": "06.10.2026",
            "hinweis": "Beleg aus dem deutschen Vergleich, dasselbe Produkt für Kunden in Österreich: Handelsplatz gettex: „Gebühr je Order bei Aktien, ETFs, Fonds und Anleihen“ „€ 0,00“, „Gebühr bei Orders unter € 500,- Kurswert“ „€ 0,95“."
          },
          "etfSparplanKosten": {
            "url": "https://tradersplace.de/konditionen/deine-konditionen",
            "stand": "06.10.2026",
            "hinweis": "Beleg aus dem deutschen Vergleich, dasselbe Produkt für Kunden in Österreich: „Sparpläne in ETFs und Fonds unserer Premium Partner Amundi, DWS, DJE, DWS xtrackers, iShares und Vanguard“ „€ 0,00“, „Sonstige Sparpläne in ETFs und Fonds“ „€ 0,50“."
          },
          "kapest": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026: „Steuereinfach in Österreich“ nein. Die KESt führst du über die Steuererklärung selbst ab."
          },
          "appIos": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "handelsplaetze": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "halalEtfsFonds": {
            "url": "https://www.tradersplace.de/wertpapiersuche",
            "stand": "16.10.2026",
            "hinweis": "Kaufbar: iShares MSCI World Islamic, Invesco MSCI ACWI Islamic, Invesco Dow Jones Islamic Global Developed Markets, HANetf Saturna Al-Kawthar Global Focused Equity. Traders Place Wertpapiersuche (deutscher Vergleich, dasselbe Depot). In Österreich gezählt wird nur der iShares MSCI World Islamic (IE00B27YCN58): BlackRock Österreich nennt ihn „Zum Vertrieb Zugelassen In … Österreich“ (blackrock.com/at, 23.11.2026). Für die übrigen Halal-ETFs fehlt ein Zulassungsbeleg des Emittenten, sie zählen nicht. Nicht zugelassen laut justETF Österreich: iShares MSCI USA und EM Islamic, alle HSBC-ETFs."
          },
          "halalSukuk": {
            "url": "https://www.tradersplace.de/wertpapiersuche",
            "stand": "16.10.2026",
            "hinweis": "Kaufbar: iShares USD Sukuk (IE000929U2U9). Traders Place Wertpapiersuche (deutscher Vergleich, dasselbe Depot). In Österreich zugelassen laut BlackRock Österreich; Xtrackers Salam Sukuk laut justETF Österreich nicht zugelassen."
          },
          "halalEdelmetalle": {
            "url": "https://www.tradersplace.de/wertpapiersuche",
            "stand": "04.11.2026",
            "hinweis": "Kaufbar: Royal Mint Physical Gold ETC (XS2115336336). Traders Place Wertpapiersuche (deutscher Vergleich, dasselbe Depot). In Österreich registriert laut HANetf (Registrations: Austria). Die übrigen Edelmetall-ETCs zählen in Österreich erst mit Beleg der Zulassung."
          }
        },
        "finanzPunkte": {
          "depotgebuehr": 16,
          "etfSparplanProzent": 6,
          "etfSparplanPauschal": 4,
          "orderProzent": 3,
          "orderPauschal": 6,
          "mindestsparrate": 3,
          "maximalsparrate": 0.667,
          "intervalle": 2.5,
          "handelsplaetze": 2,
          "kapest": 0,
          "kundenservice": 5,
          "app": 5,
          "abzug": 0
        },
        "halalAnlagenPunkte": {
          "halalEtfsFonds": 1,
          "halalSukuk": 1,
          "halalEdelmetalle": 1
        },
        "link": "/out/traders-place-at"
      },
      {
        "id": "smartbroker-plus-depot-at",
        "name": "Smartbroker+",
        "produkt": "Depot",
        "domain": "smartbrokerplus.de",
        "haus": "smartbroker",
        "werte": {
          "zinsfreiAbStart": "gut",
          "halalEtfsFonds": "1 von 1",
          "halalSukuk": "1 von 1",
          "halalEdelmetalle": "1 von 1",
          "depotgebuehr": "0€",
          "orderkosten": "1€ je Order unter 500€, ab 500€: 0€",
          "etfSparplanKosten": "0€",
          "sparrate": "1€ bis 5.000€",
          "intervalle": "Monat, Zweimonatlich, Quartal, Halbjahr, Jahr",
          "kundenservice": "E-Mail, Telefon, Chat",
          "handelsplaetze": "AT, Europa (ex-AT), USA, Sonstige, OTC",
          "kapest": false,
          "appIos": "4,2 / 5"
        },
        "quellen": {
          "zinsfreiAbStart": {
            "url": "https://www.smartbrokerplus.de/de-de/konditionen/",
            "stand": "20.09.2026",
            "hinweis": "Beleg aus dem deutschen Vergleich, dasselbe Produkt für Kunden in Österreich: Konditionen: „Wertpapierverwahrung und Kontoführung (Baader): Depotführung inklusive Nebendepots kostenlos, Kontoführung inklusive Währungskonten kostenlos“; Guthabenzinsen werden nur unter „Zinskonto (Baader)“ genannt: „Zinssatz für Guthaben auf dem Zinskonto 2,25 % p.a.“ / Zinskonto-Seite: „auf das Guthaben auf einem separat zu eröffnendem Zinskonto“"
          },
          "orderkosten": {
            "url": "https://www.smartbrokerplus.de/de-de/konditionen/",
            "stand": "06.10.2026",
            "hinweis": "Beleg aus dem deutschen Vergleich, dasselbe Produkt für Kunden in Österreich: Transaktionspreise, gettex (Aktien, Anleihen, ETFs/ETPs, Fonds): „0 EUR (ab 500 EUR Ordervolumen)“, „1 EUR (bis 499,99 EUR Ordervolumen)“."
          },
          "kapest": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026: „Steuereinfach in Österreich“ nein. Die KESt führst du über die Steuererklärung selbst ab."
          },
          "appIos": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "handelsplaetze": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "halalEtfsFonds": {
            "url": "https://www.smartbrokerplus.de/",
            "stand": "21.10.2026",
            "hinweis": "Kaufbar: iShares MSCI World Islamic, Invesco MSCI ACWI Islamic, Invesco Dow Jones Islamic Global Developed Markets, HANetf Saturna Al-Kawthar Global Focused Equity. Smartbroker+ (deutscher Vergleich, dasselbe Depot). In Österreich gezählt wird nur der iShares MSCI World Islamic (IE00B27YCN58): BlackRock Österreich nennt ihn „Zum Vertrieb Zugelassen In … Österreich“ (blackrock.com/at, 23.11.2026). Für die übrigen Halal-ETFs fehlt ein Zulassungsbeleg des Emittenten, sie zählen nicht. Nicht zugelassen laut justETF Österreich: iShares MSCI USA und EM Islamic, alle HSBC-ETFs."
          },
          "halalSukuk": {
            "url": "https://www.smartbrokerplus.de/api/data/tradeable-assets/?q=IE000929U2U9",
            "stand": "25.09.2026",
            "hinweis": "Kaufbar: iShares USD Sukuk (IE000929U2U9). Smartbroker+ Wertpapierliste (deutscher Vergleich, dasselbe Depot). In Österreich zugelassen laut BlackRock Österreich; Xtrackers Salam Sukuk laut justETF Österreich nicht zugelassen."
          },
          "halalEdelmetalle": {
            "url": "https://www.smartbrokerplus.de/api/data/tradeable-assets/?q=XS2115336336",
            "stand": "04.11.2026",
            "hinweis": "Kaufbar: Royal Mint Physical Gold ETC (XS2115336336). Smartbroker+ Wertpapierliste (deutscher Vergleich, dasselbe Depot). In Österreich registriert laut HANetf (Registrations: Austria). Die übrigen Edelmetall-ETCs zählen in Österreich erst mit Beleg der Zulassung."
          }
        },
        "finanzPunkte": {
          "depotgebuehr": 16,
          "etfSparplanProzent": 6,
          "etfSparplanPauschal": 4,
          "orderProzent": 3,
          "orderPauschal": 6,
          "mindestsparrate": 3,
          "maximalsparrate": 0.667,
          "intervalle": 2.5,
          "handelsplaetze": 2,
          "kapest": 0,
          "kundenservice": 5,
          "app": 5,
          "abzug": 0
        },
        "halalAnlagenPunkte": {
          "halalEtfsFonds": 1,
          "halalSukuk": 1,
          "halalEdelmetalle": 1
        },
        "link": "/out/smartbroker-at"
      },
      {
        "id": "trade-republic-depot-at",
        "name": "Trade Republic",
        "produkt": "Depot",
        "domain": "traderepublic.com",
        "haus": "trade-republic",
        "werte": {
          "zinsfreiAbStart": "gut",
          "halalEtfsFonds": "1 von 1",
          "halalSukuk": "1 von 1",
          "halalEdelmetalle": "1 von 1",
          "depotgebuehr": "0 €",
          "orderkosten": "1 € (Wiener Börse 2 €)",
          "etfSparplanKosten": "0 €",
          "sparrate": "1 € bis 10.000 €",
          "intervalle": "Woche, Zweiwöchentlich, Monat, Quartal",
          "handelsplaetze": "AT, Europa (ex-AT), USA, Sonstige, OTC",
          "kapest": true,
          "appIos": "4,4 / 5",
          "kundenservice": "Telefon, Chat"
        },
        "quellen": {
          "depotgebuehr": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "orderkosten": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "etfSparplanKosten": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "sparrate": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "intervalle": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "handelsplaetze": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "kapest": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "appIos": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "kundenservice": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "zinsfreiAbStart": {
            "url": "https://traderepublic.com/de-at/zinsen",
            "stand": "23.11.2026",
            "hinweis": "Trade Republic Österreich, Zinsseite: „Aktiviere die Zinsfunktion in der App und erhalte Zinsen auf dein gesamtes Cash.“ und „Ja, du kannst die Zinsen in der App deaktivieren“. Zinsen laufen also erst nach eigener Aktivierung. Anbieter: „Trade Republic Bank GmbH, Branch Austria, Kärntner Ring 5-7, 1010 Wien“."
          },
          "halalEtfsFonds": {
            "url": "https://www.justetf.com/at/etf-profile.html?isin=IE00B27YCN58",
            "stand": "23.11.2026",
            "hinweis": "Kaufbar: iShares MSCI World Islamic, Invesco MSCI ACWI Islamic, Invesco Dow Jones Islamic Global Developed Markets, HANetf Saturna Al-Kawthar Global Focused Equity. justETF Österreich, Sparplan-Angebote für Österreich, Stand 11/2026: Trade Republic bei allen vier (IE00B27YCN58, IE000LFC57H7, IE000UOXRAM8, IE00BMYMHS24). In Österreich gezählt wird nur der iShares MSCI World Islamic (IE00B27YCN58): BlackRock Österreich nennt ihn „Zum Vertrieb Zugelassen In … Österreich“ (blackrock.com/at, 23.11.2026). Für die übrigen Halal-ETFs fehlt ein Zulassungsbeleg des Emittenten, sie zählen nicht. Nicht zugelassen laut justETF Österreich: iShares MSCI USA und EM Islamic, alle HSBC-ETFs."
          },
          "halalSukuk": {
            "url": "https://www.justetf.com/at/etf-profile.html?isin=IE000929U2U9",
            "stand": "23.11.2026",
            "hinweis": "Kaufbar: iShares USD Sukuk (IE000929U2U9). justETF Österreich, Sparplan-Angebote für Österreich, Stand 11/2026: Trade Republic. In Österreich zugelassen laut BlackRock Österreich; Xtrackers Salam Sukuk laut justETF Österreich nicht zugelassen."
          },
          "halalEdelmetalle": {
            "url": "https://www.justetf.com/at/etf-profile.html?isin=XS2115336336",
            "stand": "23.11.2026",
            "hinweis": "Kaufbar: Royal Mint Physical Gold ETC (XS2115336336). justETF Österreich, Sparplan-Angebote für Österreich, Stand 11/2026: Trade Republic. In Österreich registriert laut HANetf (Registrations: Austria). Die übrigen Edelmetall-ETCs zählen in Österreich erst mit Beleg der Zulassung."
          }
        },
        "finanzPunkte": {
          "depotgebuehr": 16,
          "etfSparplanProzent": 6,
          "etfSparplanPauschal": 4,
          "orderProzent": 3,
          "orderPauschal": 4,
          "mindestsparrate": 3,
          "maximalsparrate": 0.667,
          "intervalle": 2.0,
          "handelsplaetze": 2,
          "kapest": 9,
          "kundenservice": 3,
          "app": 5,
          "abzug": 0
        },
        "halalAnlagenPunkte": {
          "halalEtfsFonds": 1,
          "halalSukuk": 1,
          "halalEdelmetalle": 1
        }
      },
      {
        "id": "dkb-depot-at",
        "name": "DKB",
        "produkt": "Depot",
        "domain": "dkb.de",
        "haus": "dkb",
        "werte": {
          "zinsfreiAbStart": "gut",
          "halalEtfsFonds": "1 von 1",
          "halalSukuk": null,
          "halalEdelmetalle": "1 von 1",
          "depotgebuehr": "0€",
          "orderkosten": "10€",
          "etfSparplanKosten": "1,50€",
          "sparrate": "25€ bis 5.000€",
          "intervalle": "Monat, Zweimonatlich, Quartal, Halbjahr, Jahr",
          "kundenservice": "E-Mail, Telefon, Chat",
          "handelsplaetze": "DE, Europa (ex-DE), USA, Sonstige, OTC",
          "kapest": false,
          "appIos": "4,6 / 5"
        },
        "quellen": {
          "kapest": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026: „Der Nachteil ist allerdings, dass ein deutscher Depotanbieter die Kapitalertragsteuer nicht automatisch an das Finanzamt abführt.“ Als deutsche Broker mit steuereinfachem Depot nennt die Seite nur Trade Republic und Flatex. Die DKB hat keine Niederlassung in Österreich, die KESt führst du über die Steuererklärung selbst ab."
          },
          "zinsfreiAbStart": {
            "url": "https://dok.dkb.de/pdf/plv_pk_konten.pdf",
            "stand": "20.09.2026",
            "hinweis": "Beleg aus dem deutschen Vergleich, dasselbe Produkt für Kunden in Österreich: Preis- und Leistungsverzeichnis Konten, Stand 15. September 2026: „Guthabenzinsen (variabel) für Guthaben auf dem Girokonto, Girokonto u18 und Basiskonto 0,00% p. a.“ Kunden mit Wohnsitz in Österreich können das Depot laut Programmbeschreibung der DKB bei FinanceQuality eröffnen (Kampagne DKB-Broker, gelesen 23.11.2026)."
          },
          "appIos": {
            "url": "https://www.finanzfluss.de/vergleich/depot/",
            "stand": "14.09.2026",
            "hinweis": "Finanzfluss Depot-Vergleich (Deutschland), App-Bewertung iOS und Android je 4,6 / 5; DKB steht nicht im Österreich-Vergleich von Finanzfluss."
          },
          "halalEtfsFonds": {
            "url": "https://www.finanzfluss.de/informer/etf/ie00b27ycn58/",
            "stand": "07.11.2026",
            "hinweis": "Kaufbar: iShares MSCI World Islamic, Invesco Dow Jones Islamic Global Developed Markets, HANetf Saturna Al-Kawthar Global Focused Equity. Laut deutschem Vergleich kaufbar, dasselbe Depot; Invesco MSCI ACWI Islamic bei der DKB noch nicht bestätigt. In Österreich gezählt wird nur der iShares MSCI World Islamic (IE00B27YCN58): BlackRock Österreich nennt ihn „Zum Vertrieb Zugelassen In … Österreich“ (blackrock.com/at, 23.11.2026). Für die übrigen Halal-ETFs fehlt ein Zulassungsbeleg des Emittenten, sie zählen nicht. Nicht zugelassen laut justETF Österreich: iShares MSCI USA und EM Islamic, alle HSBC-ETFs."
          },
          "halalEdelmetalle": {
            "url": "https://www.finanzfluss.de/informer/etf/xs2115336336/",
            "stand": "07.11.2026",
            "hinweis": "Kaufbar: Royal Mint Physical Gold ETC (XS2115336336). Finanzfluss Informer nennt die DKB (deutscher Vergleich, dasselbe Depot). In Österreich registriert laut HANetf (Registrations: Austria). Die übrigen Edelmetall-ETCs zählen in Österreich erst mit Beleg der Zulassung."
          }
        },
        "finanzPunkte": {
          "depotgebuehr": 16,
          "etfSparplanProzent": 6,
          "etfSparplanPauschal": 1.333,
          "orderProzent": 3,
          "orderPauschal": 0,
          "mindestsparrate": 1,
          "maximalsparrate": 0.667,
          "intervalle": 2.5,
          "handelsplaetze": 2,
          "kapest": 0,
          "kundenservice": 5,
          "app": 5,
          "abzug": 0
        },
        "halalAnlagenPunkte": {
          "halalEtfsFonds": 1,
          "halalEdelmetalle": 1
        },
        "link": "/out/dkb-depot-at"
      },
      {
        "id": "scalable-capital-depot-at",
        "name": "Scalable Capital",
        "produkt": "Free Broker",
        "domain": "scalable.capital",
        "haus": "scalable-at",
        "link": "/out/scalable-at",
        "werte": {
          "zinsfreiAbStart": "gut",
          "halalEtfsFonds": "1 von 1",
          "halalSukuk": "1 von 1",
          "halalEdelmetalle": "1 von 1",
          "depotgebuehr": "0 €",
          "orderkosten": "0,99 € (gettex), Xetra 1,99 €",
          "etfSparplanKosten": "0 €",
          "sparrate": "1 € bis 5.000 €",
          "intervalle": "Monat, Zweimonatlich, Quartal, Halbjahr, Jahr",
          "handelsplaetze": "Europa (ex-AT)",
          "kapest": true,
          "appIos": "4,6 / 5",
          "kundenservice": "E-Mail, Telefon, Chat"
        },
        "quellen": {
          "depotgebuehr": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "etfSparplanKosten": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "sparrate": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "intervalle": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "handelsplaetze": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "appIos": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "kundenservice": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "kapest": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026: „Steuereinfach für Neukunden“."
          },
          "orderkosten": {
            "url": "https://at.scalable.capital/trading-gebuehren",
            "stand": "23.11.2026",
            "hinweis": "Scalable Capital Österreich, Trading-Gebühren: 0,99 € je Order über gettex, Xetra 1,99 €."
          },
          "halalEtfsFonds": {
            "url": "https://www.justetf.com/at/etf-profile.html?isin=IE00B27YCN58",
            "stand": "23.11.2026",
            "hinweis": "Kaufbar: iShares MSCI World Islamic, Invesco MSCI ACWI Islamic, HANetf Saturna Al-Kawthar Global Focused Equity. justETF Österreich, Sparplan-Angebote für Österreich, Stand 11/2026: Scalable Capital bei IE00B27YCN58, IE000LFC57H7 und IE00BMYMHS24; beim Invesco Dow Jones Islamic nicht genannt. In Österreich gezählt wird nur der iShares MSCI World Islamic (IE00B27YCN58): BlackRock Österreich nennt ihn „Zum Vertrieb Zugelassen In … Österreich“ (blackrock.com/at, 23.11.2026). Für die übrigen Halal-ETFs fehlt ein Zulassungsbeleg des Emittenten, sie zählen nicht. Nicht zugelassen laut justETF Österreich: iShares MSCI USA und EM Islamic, alle HSBC-ETFs."
          },
          "halalSukuk": {
            "url": "https://www.justetf.com/at/etf-profile.html?isin=IE000929U2U9",
            "stand": "23.11.2026",
            "hinweis": "Kaufbar: iShares USD Sukuk (IE000929U2U9). justETF Österreich, Sparplan-Angebote für Österreich, Stand 11/2026: Scalable Capital. In Österreich zugelassen laut BlackRock Österreich; Xtrackers Salam Sukuk laut justETF Österreich nicht zugelassen."
          },
          "halalEdelmetalle": {
            "url": "https://www.justetf.com/at/etf-profile.html?isin=XS2115336336",
            "stand": "23.11.2026",
            "hinweis": "Kaufbar: Royal Mint Physical Gold ETC (XS2115336336). justETF Österreich, Sparplan-Angebote für Österreich, Stand 11/2026: Scalable Capital. In Österreich registriert laut HANetf (Registrations: Austria). Die übrigen Edelmetall-ETCs zählen in Österreich erst mit Beleg der Zulassung."
          },
          "zinsfreiAbStart": {
            "url": "https://at.scalable.capital/country-annex-austria",
            "stand": "25.11.2026",
            "hinweis": "Länderanhang Österreich der Scalable Capital Bank GmbH Zweigniederlassung Österreich (Kundendokumente ab 20.11.2026), Preis- und Leistungsverzeichnis Österreich, Verzinsung von Guthaben: „Verrechnungskonten: 0,00 % p.a.“ Zinsübersicht Österreich (at.scalable.capital/zinsuebersicht, gelesen 25.11.2026): Verrechnungskonten „0 % p.a.“, mit und ohne PRIME+. Zinsen gibt es nur auf dem Tagesgeld, einem eigenen Konto (Hilfe Österreich, help.scalable.capital/de-AT, „Wie eröffne ich das Tagesgeldkonto?“): „Nach der Eröffnung erhält Ihr Tagesgeldkonto eine eigene IBAN.“ und für den Zins „müssen Sie Guthaben aktiv auf dieses Konto einzahlen“."
          }
        },
        "finanzPunkte": {
          "depotgebuehr": 16,
          "etfSparplanProzent": 6,
          "etfSparplanPauschal": 4,
          "orderProzent": 3,
          "orderPauschal": 4,
          "mindestsparrate": 3,
          "maximalsparrate": 0.667,
          "intervalle": 2.5,
          "handelsplaetze": 1,
          "kapest": 9,
          "kundenservice": 5,
          "app": 5,
          "abzug": 0
        },
        "halalAnlagenPunkte": {
          "halalEtfsFonds": 1,
          "halalSukuk": 1,
          "halalEdelmetalle": 1
        }
      },
      {
        "id": "dadat-depot-at",
        "name": "DADAT",
        "produkt": "Depot",
        "domain": "dad.at",
        "haus": "dadat",
        "werte": {
          "zinsfreiAbStart": "gut",
          "halalEtfsFonds": null,
          "halalSukuk": null,
          "halalEdelmetalle": null,
          "depotgebuehr": "0 €",
          "orderkosten": "1,90 € + 0,1 % (Wiener Börse 3,90 € + 0,13 %)",
          "etfSparplanKosten": "0,75 €",
          "sparrate": "10 € bis unbegrenzt",
          "intervalle": "Monat, Quartal",
          "handelsplaetze": "AT, Europa (ex-AT), USA, Sonstige, OTC",
          "kapest": true,
          "appIos": "4,5 / 5",
          "kundenservice": "E-Mail, Telefon, Chat"
        },
        "quellen": {
          "depotgebuehr": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "orderkosten": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "etfSparplanKosten": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "sparrate": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "intervalle": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "handelsplaetze": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "kapest": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "appIos": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "kundenservice": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "zinsfreiAbStart": {
            "url": "https://www.dad.at/service/service/konditionen",
            "stand": "23.11.2026",
            "hinweis": "DADAT Konditionen, Verrechnungskonto: „Habenzinssatz 0,00%“."
          }
        },
        "finanzPunkte": {
          "depotgebuehr": 16,
          "etfSparplanProzent": 6,
          "etfSparplanPauschal": 2.667,
          "orderProzent": 1.5,
          "orderPauschal": 2,
          "mindestsparrate": 2,
          "maximalsparrate": 1,
          "intervalle": 1.0,
          "handelsplaetze": 2,
          "kapest": 9,
          "kundenservice": 5,
          "app": 5,
          "abzug": 0
        },
        "halalAnlagenPunkte": {}
      },
      {
        "id": "easybank-depot-at",
        "name": "easybank",
        "produkt": "easy Wertpapierdepot",
        "domain": "easybank.at",
        "haus": "easybank",
        "link": "/out/easybank-depot-at",
        "werte": {
          "zinsfreiAbStart": "gut",
          "halalEtfsFonds": null,
          "halalSukuk": null,
          "halalEdelmetalle": null,
          "depotgebuehr": "0,12 % (mindestens 5,40 € je Position und 15 € je Depot), dazu 18 € im Jahr fürs Verrechnungskonto",
          "orderkosten": "4,95 €",
          "etfSparplanKosten": "1,25 €",
          "sparrate": "50 € bis unbegrenzt",
          "intervalle": "Monat",
          "handelsplaetze": "AT, Europa (ex-AT), USA, Sonstige, OTC",
          "kapest": true,
          "appIos": "4,6 / 5",
          "kundenservice": "Telefon, Chat"
        },
        "quellen": {
          "depotgebuehr": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "orderkosten": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "etfSparplanKosten": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "sparrate": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "intervalle": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "handelsplaetze": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "kapest": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "appIos": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "kundenservice": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "zinsfreiAbStart": {
            "url": "https://www.easybank.at/resource/blob/85454/c7d4ef0b47283c7f966292c3c97d9f22/easy-flat-wertpapierdepot-data.pdf",
            "stand": "23.11.2026",
            "hinweis": "easybank Konditionen easy Wertpapierdepot, gültig ab 10.11.2026: „easy Verrechnungskonto EUR (obligatorisch zum Depot) Grundzinssatz 0,00 % p.a., fix“."
          }
        },
        "finanzPunkte": {
          "depotgebuehr": 0,
          "etfSparplanProzent": 6,
          "etfSparplanPauschal": 1.333,
          "orderProzent": 3,
          "orderPauschal": 2,
          "mindestsparrate": 0,
          "maximalsparrate": 1,
          "intervalle": 0.5,
          "handelsplaetze": 2,
          "kapest": 9,
          "kundenservice": 3,
          "app": 5,
          "abzug": 0
        },
        "halalAnlagenPunkte": {}
      }
    ],
  },
  "girokonto": {
    entwurf: false,
    stand: "23.11.2026",
    quellenHinweis: "Basis: Preisblätter und Entgeltinformationen der Banken für Österreich, gelesen am 23.11.2026; DKB mit den Belegen des deutschen Vergleichs. Auswahl angelehnt an den Capitalo Girokonto-Vergleich, Stand 12.11.2026. Eigene Halal-Prüfung mit Anbieter-Belegen.",
    einleitung: ["Hier stehen Girokonten für Wohnsitz in Österreich: ohne Zinsen, ohne Überziehungsrahmen ab Start und mit Karte ohne Kreditrahmen."],
    kriterien: [{"titel": "Ohne Zinsen nutzbar", "text": "Kein Guthabenzins und kein verzinstes Unterkonto, oder lässt sich beides abschalten?"}, {"titel": "Keine Überziehung ab Start", "text": "Wird dir nach der Eröffnung kein Überziehungsrahmen eingeräumt?"}, {"titel": "Karte ohne Kredit", "text": "Ist die Standardkarte ohne Kreditrahmen und ohne Teilzahlung?"}],
    reihenfolge: ["n26-standard-at", "easybank-easy-gratis-at", "dkb-girokonto-at", "trade-republic-girokonto-at", "bank99-smartkonto99-at", "bawag-kontobox-small-at"],
    anbieter: [
      {
        "id": "n26-standard-at",
        "name": "N26",
        "produkt": "Standard",
        "domain": "n26.com",
        "haus": "n26",
        "link": "/out/n26-at",
        "werte": {
          "zinsfreiAbStart": "gut",
          "keinDispoAbStart": "gut",
          "karteOhneKredit": "gut",
          "kontofuehrung": "0 €",
          "debitkarte": "Mastercard, 0 €",
          "applePay": true,
          "abhebungen": "Unbegrenzt",
          "bargeldEinzahlen": "1,5 % über CASH26 bei Handelspartnern",
          "auslandAbheben": "0 €",
          "auslandFremdAbheben": "1,7 %",
          "auslandFremdZahlen": "0 €",
          "sepaKostenlos": true,
          "kundenservice": "Chat",
          "filialen": false,
          "appIos": "4,8 / 5 (iOS), 4,3 / 5 (Android)"
        },
        "quellen": {
          "zinsfreiAbStart": {
            "url": "https://n26.com/de-at/sparkonto",
            "stand": "23.11.2026",
            "hinweis": "N26 Österreich, Tagesgeldkonto: „Die Zinsen werden nur auf dein Guthaben auf diesem separaten Tagesgeldkonto gezahlt.“ Das Hauptkonto wird nicht verzinst."
          },
          "keinDispoAbStart": {
            "url": "https://n26.com/de-at/ueberziehungsrahmen",
            "stand": "23.11.2026",
            "hinweis": "N26 Österreich, Überziehungsrahmen: „Akzeptiere die AGB – nach einer kurzen Überprüfung kannst du deinen Überziehungsrahmen aktivieren.“ Er wird also erst auf eigenen Wunsch eingeräumt."
          },
          "karteOhneKredit": {
            "url": "https://n26.com/de-at/konten-vergleichen",
            "stand": "23.11.2026",
            "hinweis": "N26 Österreich, Konten vergleichen, Standard: „Kostenlose virtuelle Debitkarte“."
          },
          "kontofuehrung": {
            "url": "https://docs.n26.com/legal/02+AT/01+Account/de/13account-pricelist-de.pdf",
            "stand": "23.11.2026",
            "hinweis": "N26 Preisliste für Kunden mit Lieferadresse in Österreich, Version 3.7 vom 26.06.2026: „N26 Girokonto Kostenlos“."
          },
          "debitkarte": {
            "url": "https://n26.com/de-at/kostenloses-girokonto",
            "stand": "23.11.2026",
            "hinweis": "N26 Österreich: „Für die Ausstellung der physischen Mastercard Debitkarte fällt eine einmalige Gebühr von 10 € an.“"
          },
          "applePay": {
            "url": "https://n26.com/de-at/kostenloses-girokonto",
            "stand": "23.11.2026",
            "hinweis": "N26 Österreich: „Verknüpfe sie mit Apple Pay, Google Pay oder Garmin Pay“."
          },
          "abhebungen": {
            "url": "https://docs.n26.com/legal/02+AT/01+Account/de/13account-pricelist-de.pdf",
            "stand": "23.11.2026",
            "hinweis": "N26 Preisliste für Kunden mit Lieferadresse in Österreich, Version 3.7 vom 26.06.2026: „Mastercard Abhebungen an Geldautomaten in € … N26 Girokonto Kostenlos“, „Fair Use policy trifft nicht zu auf Kunden mit ursprünglicher Lieferadresse in Österreich“."
          },
          "bargeldEinzahlen": {
            "url": "https://docs.n26.com/legal/02+AT/01+Account/de/13account-pricelist-de.pdf",
            "stand": "23.11.2026",
            "hinweis": "N26 Preisliste für Kunden mit Lieferadresse in Österreich, Version 3.7 vom 26.06.2026: „CASH26 Einzahlungen … 1,5% des Betrags“."
          },
          "auslandAbheben": {
            "url": "https://docs.n26.com/legal/02+AT/01+Account/de/13account-pricelist-de.pdf",
            "stand": "23.11.2026",
            "hinweis": "N26 Preisliste für Kunden mit Lieferadresse in Österreich, Version 3.7 vom 26.06.2026: Abhebungen in € kostenlos."
          },
          "auslandFremdAbheben": {
            "url": "https://docs.n26.com/legal/02+AT/01+Account/de/13account-pricelist-de.pdf",
            "stand": "23.11.2026",
            "hinweis": "N26 Preisliste für Kunden mit Lieferadresse in Österreich, Version 3.7 vom 26.06.2026: „Mastercard Abhebungen an Geldautomaten in sonstigen Währungen … Für Business- und Girokonto … 1,7% vom Umsatzes“."
          },
          "auslandFremdZahlen": {
            "url": "https://docs.n26.com/legal/02+AT/01+Account/de/13account-pricelist-de.pdf",
            "stand": "23.11.2026",
            "hinweis": "N26 Preisliste für Kunden mit Lieferadresse in Österreich, Version 3.7 vom 26.06.2026: „Bargeldlose Zahlungen mit Mastercard & Maestro Karte weltweit und in allen Währungen Kostenlos … ohne Fremdwährungszuschlag“."
          },
          "sepaKostenlos": {
            "url": "https://docs.n26.com/legal/02+AT/01+Account/de/13account-pricelist-de.pdf",
            "stand": "23.11.2026",
            "hinweis": "N26 Preisliste für Kunden mit Lieferadresse in Österreich, Version 3.7 vom 26.06.2026: „Ausgehende Überweisungen innerhalb und zwischen Staaten … Kostenlos“."
          },
          "filialen": {
            "url": "https://n26.com/de-at/kostenloses-girokonto",
            "stand": "23.11.2026",
            "hinweis": "N26 Österreich: „N26 Standard ist ein kostenloses, 100 % mobiles Online-Konto“."
          },
          "kundenservice": {
            "url": "https://n26.com/de-at/kostenloses-girokonto",
            "stand": "23.11.2026",
            "hinweis": "N26 Österreich: „24/7 Chat-Support“."
          },
          "appIos": {
            "url": "https://www.finanzfluss.de/vergleich/girokonto/",
            "stand": "14.09.2026",
            "hinweis": "Finanzfluss Girokonto-Vergleich (Deutschland), dieselbe App."
          }
        },
        "finanzPunkte": {
          "kontofuehrung": 15,
          "bankkarte": 10,
          "girocard": 0,
          "debitkarte": 5,
          "abheben": 5,
          "einzahlen": 1.5,
          "mobilesBezahlen": 8,
          "sepa": 10,
          "support": 2.5,
          "kontowechsel": 0,
          "app": 2,
          "ident": 0,
          "ohneBedingung": 4,
          "ausland": 8.0,
          "abzug": 0
        }
      },
      {
        "id": "easybank-easy-gratis-at",
        "name": "easybank",
        "produkt": "easy gratis",
        "domain": "easybank.at",
        "haus": "easybank",
        "link": "/out/easybank-girokonto-at",
        "werte": {
          "zinsfreiAbStart": "gut",
          "keinDispoAbStart": null,
          "karteOhneKredit": "gut",
          "kontofuehrung": "0 € ab 400 € Gehaltseingang oder unter 27, sonst 14,70 € im Quartal",
          "debitkarte": "easy karte, 0 €",
          "applePay": null,
          "abhebungen": "12 Automaten-Transaktionen im Quartal gratis, danach 1 €",
          "bargeldEinzahlen": "am BAWAG-Automaten im Kontingent, am Schalter 4,90 €",
          "auslandAbheben": null,
          "auslandFremdAbheben": "1,82 € + 0,75 %",
          "auslandFremdZahlen": "1,09 € + 0,75 %",
          "sepaKostenlos": true,
          "kundenservice": null,
          "filialen": null,
          "appIos": "4,7 / 5"
        },
        "quellen": {
          "zinsfreiAbStart": {
            "url": "https://www.easybank.at/resource/blob/49330/58e8bb9ab6f54f0bcdc2bd68ba7df2ca/easy-gratis-data.pdf",
            "stand": "23.11.2026",
            "hinweis": "easybank Konditionen easy gratis, Stand 14.10.2026: „Zinsen bei Guthaben 0% p.a.“."
          },
          "karteOhneKredit": {
            "url": "https://www.easybank.at/resource/blob/49330/58e8bb9ab6f54f0bcdc2bd68ba7df2ca/easy-gratis-data.pdf",
            "stand": "23.11.2026",
            "hinweis": "easybank Konditionen easy gratis: „easy karte (Debitkarte) … GRATIS“. Eine Kreditkarte gibt es nur auf Wunsch."
          },
          "kontofuehrung": {
            "url": "https://www.easybank.at/resource/blob/49330/58e8bb9ab6f54f0bcdc2bd68ba7df2ca/easy-gratis-data.pdf",
            "stand": "23.11.2026",
            "hinweis": "easybank Konditionen easy gratis: kostenlos ab 400 € Gehaltseingang im Monat, unter 27 Jahren ohne Mindesteingang, sonst 14,70 € je Quartal. Voraussetzung: „Hauptwohnsitz in Österreich“."
          },
          "debitkarte": {
            "url": "https://www.easybank.at/resource/blob/49330/58e8bb9ab6f54f0bcdc2bd68ba7df2ca/easy-gratis-data.pdf",
            "stand": "23.11.2026",
            "hinweis": "easybank Konditionen easy gratis: „easy karte (Debitkarte) … GRATIS“."
          },
          "abhebungen": {
            "url": "https://www.easybank.at/resource/blob/49330/58e8bb9ab6f54f0bcdc2bd68ba7df2ca/easy-gratis-data.pdf",
            "stand": "25.11.2026",
            "hinweis": "easybank Preisblatt easy gratis, Stand 14.10.2026: „12 Automaten Transaktionen im Quartal, z.B. Bargeldbehebung am Geldausgabeautomat GRATIS“, „Ab der 13. Automaten Transaktion im Quartal € 1,00“."
          },
          "bargeldEinzahlen": {
            "url": "https://www.easybank.at/resource/blob/49330/58e8bb9ab6f54f0bcdc2bd68ba7df2ca/easy-gratis-data.pdf",
            "stand": "25.11.2026",
            "hinweis": "easybank Preisblatt easy gratis, Stand 14.10.2026: Automaten-Transaktionen umfassen „Bareinzahlungen auf das eigene Konto“ (BAWAG Selbstbedienungszone und BAWAG Geldautomaten); „Bareinzahlung und Barauszahlung in BAWAG P.S.K. Geschäftsstellen € 4,90“."
          },
          "auslandFremdAbheben": {
            "url": "https://www.easybank.at/resource/blob/49330/58e8bb9ab6f54f0bcdc2bd68ba7df2ca/easy-gratis-data.pdf",
            "stand": "25.11.2026",
            "hinweis": "easybank Preisblatt easy gratis, Stand 14.10.2026: „Bargeldbehebung mit easy karte (Debitkarte) außerhalb des Euroraums € 1,82 + 0,75% vom Behebungsbetrag“."
          },
          "auslandFremdZahlen": {
            "url": "https://www.easybank.at/resource/blob/49330/58e8bb9ab6f54f0bcdc2bd68ba7df2ca/easy-gratis-data.pdf",
            "stand": "25.11.2026",
            "hinweis": "easybank Preisblatt easy gratis, Stand 14.10.2026: „Handelskasse und Online Shop Transaktion außerhalb des Euroraums € 1,09 + 0,75% vom Umsatzbetrag“."
          },
          "sepaKostenlos": {
            "url": "https://www.easybank.at/resource/blob/49330/58e8bb9ab6f54f0bcdc2bd68ba7df2ca/easy-gratis-data.pdf",
            "stand": "25.11.2026",
            "hinweis": "easybank Preisblatt easy gratis, Stand 14.10.2026: „alle elektronischen Transaktionen GRATIS“, Fußnote: „Gut- und Lastschriften im eBanking und Zahlungen mit Konto-/Debitkarte oder Kreditkarte“."
          },
          "appIos": {
            "url": "https://apps.apple.com/at/app/easybank-%C3%B6sterreich/id1468066542",
            "stand": "25.11.2026",
            "hinweis": "App Store Österreich, App „easybank Österreich“ (easybank AG), Bewertung 4,65 von 5 aus 5.295 Bewertungen, abgerufen am 25.11.2026 über die öffentliche iTunes-Suche von Apple."
          }
        },
        "finanzPunkte": {
          "kontofuehrung": 15,
          "bankkarte": 10,
          "girocard": 0,
          "debitkarte": 5,
          "abheben": 2.5,
          "einzahlen": 1.5,
          "mobilesBezahlen": 0,
          "sepa": 10,
          "support": 0,
          "kontowechsel": 0,
          "app": 2,
          "ident": 0,
          "ohneBedingung": 0,
          "ausland": 0.0,
          "abzug": 0
        }
      },
      {
        "id": "dkb-girokonto-at",
        "name": "DKB",
        "produkt": "Girokonto",
        "domain": "dkb.de",
        "haus": "dkb",
        "link": "/out/dkb-girokonto-at",
        "werte": {
          "zinsfreiAbStart": "gut",
          "keinDispoAbStart": "teils",
          "karteOhneKredit": "gut",
          "kontofuehrung": "0 € ab 700 € Geldeingang oder unter 28, sonst 4,50 €",
          "debitkarte": "VISA, 0€",
          "applePay": true,
          "abhebungen": "Unbegrenzt",
          "bargeldEinzahlen": "1,5% per Cash im Shop",
          "auslandAbheben": "0 €",
          "auslandFremdAbheben": "0 €",
          "auslandFremdZahlen": "0 €",
          "sepaKostenlos": true,
          "kundenservice": "E-Mail, Chat",
          "filialen": false,
          "appIos": "4,6 / 5"
        },
        "quellen": {
          "zinsfreiAbStart": {
            "url": "https://dok.dkb.de/pdf/plv_pk_konten.pdf",
            "stand": "20.09.2026",
            "hinweis": "Beleg aus dem deutschen Vergleich, dasselbe Produkt für Kunden in Österreich: 2 Einlagen auf Konten - Guthabenzinsen (variabel) für Guthaben auf dem Girokonto, Girokonto u18 und Basiskonto 0,00% p. a. Für Wohnsitz Österreich: Programm „DKB Girokonto Österreich“ bei FinanceQuality, laut Beschreibung der DKB abschließbar, Legitimation nur per VideoIdent (gelesen 23.11.2026)."
          },
          "keinDispoAbStart": {
            "url": "https://www.dkb.de/fragen-antworten/ich-habe-mein-konto-ueberzogen-was-muss-ich-tun",
            "stand": "23.09.2026",
            "hinweis": "Beleg aus dem deutschen Vergleich, dasselbe Produkt für Kunden in Österreich: Für dein Girokonto haben wir dir in der Regel einen Dispokredit eingeräumt. Bis zu diesem Betrag darfst du mit deinem Girokonto ins Minus gehen. Hast du keinen Dispokredit, darfst du das Girokonto nur im Guthaben führen. Gelb statt rot nach Elias’ Regel vom 28.09.2026: Ein Dispo macht ein Konto nicht haram wie Zinsen, zählt aber in die Wertung."
          },
          "karteOhneKredit": {
            "url": "https://www.dkb.de/fragen-antworten/was-muss-ich-zum-girokonto-wissen",
            "stand": "27.09.2026",
            "hinweis": "Beleg aus dem deutschen Vergleich, dasselbe Produkt für Kunden in Österreich: DKB Fragen und Antworten „Wann ist mein Girokonto kostenlos?“, abgerufen 27.09.2026; dazu Entgeltinformation Girokonto, Stand 15.09.2026: „Visa Debitkarte“. Ersetzt am 27.09.2026 den Finanzfluss-Vergleich als Quelle."
          },
          "kontofuehrung": {
            "url": "https://www.dkb.de/fragen-antworten/was-muss-ich-zum-girokonto-wissen",
            "stand": "27.09.2026",
            "hinweis": "Beleg aus dem deutschen Vergleich, dasselbe Produkt für Kunden in Österreich: DKB Fragen und Antworten „Wann ist mein Girokonto kostenlos?“, abgerufen 27.09.2026; dazu Entgeltinformation Girokonto, Stand 15.09.2026: „Gehen auf einem Girokonto (als Erstkonto) mindestens 700 Euro pro Monat ein, bleibt dieses Girokonto kostenlos.“ … „Bis zu deinem 28. Geburtstag ist dein Girokonto (als Erstkonto) auch ohne monatlichen Geldeingang von 700 Euro kostenlos.“ … „Erstkonten, wenn keine der o.g. Bedingungen erfüllt ist: 4,50 Euro im Monat.“"
          },
          "auslandAbheben": {
            "url": "https://www.finanzfluss.de/vergleich/girokonto/",
            "stand": "19.09.2026",
            "hinweis": "Beleg aus dem deutschen Vergleich, dasselbe Produkt für Kunden in Österreich: Finanzfluss-Vergleich, Stand 19.09.2026"
          },
          "auslandFremdAbheben": {
            "url": "https://www.finanzfluss.de/vergleich/girokonto/",
            "stand": "19.09.2026",
            "hinweis": "Beleg aus dem deutschen Vergleich, dasselbe Produkt für Kunden in Österreich: Finanzfluss-Vergleich, Stand 19.09.2026"
          },
          "auslandFremdZahlen": {
            "url": "https://www.finanzfluss.de/vergleich/girokonto/",
            "stand": "19.09.2026",
            "hinweis": "Beleg aus dem deutschen Vergleich, dasselbe Produkt für Kunden in Österreich: Finanzfluss-Vergleich, Stand 19.09.2026"
          },
          "appIos": {
            "url": "https://www.finanzfluss.de/vergleich/girokonto/",
            "stand": "14.09.2026",
            "hinweis": "Finanzfluss Girokonto-Vergleich (Deutschland), iOS und Android je 4,6 / 5."
          }
        },
        "finanzPunkte": {
          "kontofuehrung": 15,
          "bankkarte": 10,
          "girocard": 0,
          "debitkarte": 5,
          "abheben": 5,
          "einzahlen": 1.5,
          "mobilesBezahlen": 8,
          "sepa": 10,
          "support": 2.5,
          "kontowechsel": 2,
          "app": 2,
          "ident": 2,
          "abzug": 0,
          "ohneBedingung": 0,
          "ausland": 12
        }
      },
      {
        "id": "trade-republic-girokonto-at",
        "name": "Trade Republic",
        "produkt": "Girokonto",
        "domain": "traderepublic.com",
        "haus": "trade-republic",
        "werte": {
          "zinsfreiAbStart": "gut",
          "keinDispoAbStart": "gut",
          "karteOhneKredit": "gut",
          "kontofuehrung": "0 €",
          "debitkarte": "Debitkarte, 0 €",
          "applePay": null,
          "abhebungen": "ab 100 € kostenlos, darunter 1 €",
          "bargeldEinzahlen": "nicht möglich",
          "auslandAbheben": "ab 100 € 0 €, darunter 1 €",
          "auslandFremdAbheben": "ab 100 € 0 €, darunter 1 €",
          "auslandFremdZahlen": "0 €",
          "sepaKostenlos": true,
          "kundenservice": "Telefon, Chat",
          "filialen": null,
          "appIos": "4,4 / 5"
        },
        "quellen": {
          "zinsfreiAbStart": {
            "url": "https://traderepublic.com/de-at/zinsen",
            "stand": "23.11.2026",
            "hinweis": "Trade Republic Österreich: „Aktiviere die Zinsfunktion in der App und erhalte Zinsen auf dein gesamtes Cash.“ und „Ja, du kannst die Zinsen in der App deaktivieren“. Zinsen laufen erst nach eigener Aktivierung."
          },
          "keinDispoAbStart": {
            "url": "https://assets.traderepublic.com/assets/files/FeeInformation_PaymentAccount_at.pdf",
            "stand": "23.11.2026",
            "hinweis": "Entgeltinformation Trade Republic Bank GmbH, Girokonto, Fassung für Österreich, Datum April 2025: „Eingeräumte Kontoüberziehung Dienst nicht verfügbar“, „Geduldete Kontoüberziehung Dienst nicht verfügbar“."
          },
          "karteOhneKredit": {
            "url": "https://assets.traderepublic.com/assets/files/FeeInformation_PaymentAccount_at.pdf",
            "stand": "23.11.2026",
            "hinweis": "Entgeltinformation Trade Republic Bank GmbH, Girokonto, Fassung für Österreich, Datum April 2025: „Ausgabe einer Debitkarte … virtuelle Debitkarte 0€“, „Ausgabe einer Kreditkarte Dienst nicht verfügbar“."
          },
          "kontofuehrung": {
            "url": "https://assets.traderepublic.com/assets/files/FeeInformation_PaymentAccount_at.pdf",
            "stand": "23.11.2026",
            "hinweis": "Entgeltinformation Trade Republic Bank GmbH, Girokonto, Fassung für Österreich, Datum April 2025: „Kontoführung 0€“."
          },
          "debitkarte": {
            "url": "https://assets.traderepublic.com/assets/files/FeeInformation_PaymentAccount_at.pdf",
            "stand": "23.11.2026",
            "hinweis": "Entgeltinformation Trade Republic Bank GmbH, Girokonto, Fassung für Österreich, Datum April 2025: „virtuelle Debitkarte 0€ … physische Debitkarte Classic (einmalig) 5€“."
          },
          "abhebungen": {
            "url": "https://assets.traderepublic.com/assets/files/FeeInformation_PaymentAccount_at.pdf",
            "stand": "23.11.2026",
            "hinweis": "Entgeltinformation Trade Republic Bank GmbH, Girokonto, Fassung für Österreich, Datum April 2025: „Bargeldauszahlung mit der Debitkarte am Geldautomaten Abhebungen unter 100€ 1€, Abhebungen ab 100€ 0€“."
          },
          "bargeldEinzahlen": {
            "url": "https://assets.traderepublic.com/assets/files/FeeInformation_PaymentAccount_at.pdf",
            "stand": "23.11.2026",
            "hinweis": "Entgeltinformation Trade Republic Bank GmbH, Girokonto, Fassung für Österreich, Datum April 2025: „Bargeldeinzahlung Dienst nicht verfügbar“."
          },
          "auslandAbheben": {
            "url": "https://assets.traderepublic.com/assets/files/FeeInformation_PaymentAccount_at.pdf",
            "stand": "23.11.2026",
            "hinweis": "Entgeltinformation Trade Republic Bank GmbH, Girokonto, Fassung für Österreich, Datum April 2025: Abhebungen unter 100 € 1 €, ab 100 € 0 €."
          },
          "auslandFremdAbheben": {
            "url": "https://assets.traderepublic.com/assets/files/FeeInformation_PaymentAccount_at.pdf",
            "stand": "23.11.2026",
            "hinweis": "Entgeltinformation Trade Republic Bank GmbH, Girokonto, Fassung für Österreich, Datum April 2025: „an fremden Geldautomaten in Fremdwährung Abhebungen unter 100€ 1€, Abhebungen ab 100€ 0€, Fremdwährungsumrechnung 0€“."
          },
          "auslandFremdZahlen": {
            "url": "https://assets.traderepublic.com/assets/files/FeeInformation_PaymentAccount_at.pdf",
            "stand": "23.11.2026",
            "hinweis": "Entgeltinformation Trade Republic Bank GmbH, Girokonto, Fassung für Österreich, Datum April 2025: „Einsatz der Debitkarte zum Bezahlen in Fremdwährung 0€ … Fremdwährungsumrechnung 0€“."
          },
          "sepaKostenlos": {
            "url": "https://assets.traderepublic.com/assets/files/FeeInformation_PaymentAccount_at.pdf",
            "stand": "23.11.2026",
            "hinweis": "Entgeltinformation Trade Republic Bank GmbH, Girokonto, Fassung für Österreich, Datum April 2025: „Überweisung 0€“."
          },
          "kundenservice": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026: Kundenservice Telefon und Chat."
          },
          "appIos": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          }
        },
        "finanzPunkte": {
          "kontofuehrung": 15,
          "bankkarte": 10,
          "girocard": 0,
          "debitkarte": 5,
          "abheben": 2.5,
          "einzahlen": 0,
          "mobilesBezahlen": 0,
          "sepa": 10,
          "support": 5,
          "kontowechsel": 0,
          "app": 2,
          "ident": 0,
          "ohneBedingung": 4,
          "ausland": 4.0,
          "abzug": 0
        }
      },
      {
        "id": "bank99-smartkonto99-at",
        "name": "bank99",
        "produkt": "smartkonto99",
        "domain": "bank99.at",
        "haus": "bank99",
        "werte": {
          "zinsfreiAbStart": "gut",
          "keinDispoAbStart": null,
          "karteOhneKredit": "gut",
          "kontofuehrung": "1,99 €",
          "debitkarte": "Debitkarte, 0 €",
          "applePay": null,
          "abhebungen": "1 Automaten-Leistung im Monat gratis, danach 0,80 €",
          "bargeldEinzahlen": "am Automaten im Kontingent, danach 0,80 €; am Schalter 2 im Jahr gratis, danach 4,79 €",
          "auslandAbheben": "im Euro-Raum 1 im Monat gratis, danach 0,80 €",
          "auslandFremdAbheben": null,
          "auslandFremdZahlen": null,
          "sepaKostenlos": true,
          "kundenservice": null,
          "filialen": null,
          "appIos": "1,5 / 5"
        },
        "quellen": {
          "zinsfreiAbStart": {
            "url": "https://assets.bank99.at/documents/w225-konditionen_konto99.pdf",
            "stand": "23.11.2026",
            "hinweis": "bank99 Konditionen konto99, Stand Februar 2026: „Guthabenzins (fix) p. a. 0,00 %“."
          },
          "karteOhneKredit": {
            "url": "https://assets.bank99.at/documents/w225-konditionen_konto99.pdf",
            "stand": "23.11.2026",
            "hinweis": "bank99 Konditionen konto99: „Debitkarte Inkludiert“."
          },
          "kontofuehrung": {
            "url": "https://assets.bank99.at/documents/w225-konditionen_konto99.pdf",
            "stand": "23.11.2026",
            "hinweis": "bank99 Konditionen konto99: smartkonto99 1,99 € im Monat. Voraussetzung: „Hauptwohnsitz in Österreich“."
          },
          "debitkarte": {
            "url": "https://assets.bank99.at/documents/w225-konditionen_konto99.pdf",
            "stand": "23.11.2026",
            "hinweis": "bank99 Konditionen konto99: „Debitkarte Inkludiert“."
          },
          "abhebungen": {
            "url": "https://assets.bank99.at/documents/w225-konditionen_konto99.pdf",
            "stand": "25.11.2026",
            "hinweis": "bank99 Konditionenübersicht konto99, Stand Februar 2026, smartkonto99: Selbstbedienungsgeräte (im Foyer und Geldautomaten) „1x/Monat kostenlos, jede weitere Leistung € 0,80“ für „Bargeldbehebung im Euro-Raum“ und „Bargeldeinzahlungen auf eigenes Konto“."
          },
          "bargeldEinzahlen": {
            "url": "https://assets.bank99.at/documents/w225-konditionen_konto99.pdf",
            "stand": "25.11.2026",
            "hinweis": "bank99 Konditionenübersicht konto99, Stand Februar 2026, smartkonto99: am Selbstbedienungsgerät „1x/Monat kostenlos, jede weitere Leistung € 0,80“; am Schalter Bargeldeinzahlung „2x/Jahr kostenlos, jede weitere € 4,79“."
          },
          "auslandAbheben": {
            "url": "https://assets.bank99.at/documents/w225-konditionen_konto99.pdf",
            "stand": "25.11.2026",
            "hinweis": "bank99 Konditionenübersicht konto99, Stand Februar 2026, smartkonto99: „Bargeldbehebung im Euro-Raum“ an Selbstbedienungsgeräten „1x/Monat kostenlos, jede weitere Leistung € 0,80“."
          },
          "sepaKostenlos": {
            "url": "https://assets.bank99.at/documents/w225-konditionen_konto99.pdf",
            "stand": "25.11.2026",
            "hinweis": "bank99 Konditionenübersicht konto99, Stand Februar 2026: „Online-Banking (Internetbanking) und App: Zugang inkl. alle Funktionen kostenlos“. SEPA-Überweisung am Selbstbedienungsgerät 0,80 €, am Schalter 4,79 €."
          },
          "appIos": {
            "url": "https://apps.apple.com/at/app/meine99-online-banking/id1497542355",
            "stand": "25.11.2026",
            "hinweis": "App Store Österreich, App „meine99 | Online Banking“ (bank99 AG), Bewertung 1,5 von 5 aus 754 Bewertungen, abgerufen am 25.11.2026 über die öffentliche iTunes-Suche von Apple."
          }
        },
        "finanzPunkte": {
          "kontofuehrung": 5,
          "bankkarte": 10,
          "girocard": 0,
          "debitkarte": 5,
          "abheben": 2.5,
          "einzahlen": 1.5,
          "mobilesBezahlen": 0,
          "sepa": 10,
          "support": 0,
          "kontowechsel": 0,
          "app": 0,
          "ident": 0,
          "ohneBedingung": 0,
          "ausland": 0.0,
          "abzug": 0
        }
      },
      {
        "id": "bawag-kontobox-small-at",
        "name": "BAWAG",
        "produkt": "KontoBox Small",
        "domain": "bawag.at",
        "haus": "bawag",
        "werte": {
          "zinsfreiAbStart": "gut",
          "keinDispoAbStart": null,
          "karteOhneKredit": "gut",
          "kontofuehrung": "6,08 €, die ersten 6 Monate 0 €",
          "debitkarte": "Kontokarte (Debitkarte), inkludiert",
          "applePay": null,
          "abhebungen": "1 Automaten-Transaktion im Monat inkludiert, danach 0,51 €",
          "bargeldEinzahlen": "am BAWAG-Automaten im Kontingent, danach 0,51 €; am Schalter 4,12 €",
          "auslandAbheben": null,
          "auslandFremdAbheben": "1,82 € + 0,75 %",
          "auslandFremdZahlen": "1,09 € + 0,75 %",
          "sepaKostenlos": true,
          "kundenservice": null,
          "filialen": true,
          "appIos": "4,7 / 5"
        },
        "quellen": {
          "zinsfreiAbStart": {
            "url": "https://www.bawag.at/resource/blob/17844/fc3015a250213d6d43c8e3e32ce4f36a/giro-preisblatt-kontoboxen-neukunden-data.pdf",
            "stand": "23.11.2026",
            "hinweis": "BAWAG Preisblatt KontoBoxen für Neukunden, Stand 23.09.2026: „Habenzinssatz 0,00% p.a.“."
          },
          "kontofuehrung": {
            "url": "https://www.bawag.at/resource/blob/17844/fc3015a250213d6d43c8e3e32ce4f36a/giro-preisblatt-kontoboxen-neukunden-data.pdf",
            "stand": "23.11.2026",
            "hinweis": "BAWAG Preisblatt KontoBoxen für Neukunden: KontoBox Small 6,08 € im Monat, die ersten 6 Monate gratis."
          },
          "karteOhneKredit": {
            "url": "https://www.bawag.at/resource/blob/17844/fc3015a250213d6d43c8e3e32ce4f36a/giro-preisblatt-kontoboxen-neukunden-data.pdf",
            "stand": "25.11.2026",
            "hinweis": "BAWAG Konditionenübersicht Giroprodukte, Stand 23.9.2026: KontoBox Small „Inkludiert: alle elektronischen Transaktionen, eBanking, PDF-Auszug, eine Automaten Transaktion, eine Kontokarte“; die Kontokarte steht unter „Debitkarte/Kontokarte“. Eine Kreditkarte gibt es nur in der KontoBox Large oder gegen Entgelt, „Vorbehaltlich einer positiven Bonitätsprüfung durch die BAWAG“."
          },
          "debitkarte": {
            "url": "https://www.bawag.at/resource/blob/17844/fc3015a250213d6d43c8e3e32ce4f36a/giro-preisblatt-kontoboxen-neukunden-data.pdf",
            "stand": "25.11.2026",
            "hinweis": "BAWAG Konditionenübersicht Giroprodukte, Stand 23.9.2026: KontoBox Small „Inkludiert: … eine Kontokarte“, Abschnitt „Debitkarte/Kontokarte“."
          },
          "abhebungen": {
            "url": "https://www.bawag.at/resource/blob/17844/fc3015a250213d6d43c8e3e32ce4f36a/giro-preisblatt-kontoboxen-neukunden-data.pdf",
            "stand": "25.11.2026",
            "hinweis": "BAWAG Konditionenübersicht Giroprodukte, Stand 23.9.2026: KontoBox Small inkludiert „eine Automaten Transaktion“; Postenentgelt „Automaten Transaktionen € 0,51“. Automaten Transaktionen sind Barauszahlungen und Bareinzahlungen an BAWAG Geldautomaten."
          },
          "bargeldEinzahlen": {
            "url": "https://www.bawag.at/resource/blob/17844/fc3015a250213d6d43c8e3e32ce4f36a/giro-preisblatt-kontoboxen-neukunden-data.pdf",
            "stand": "25.11.2026",
            "hinweis": "BAWAG Konditionenübersicht Giroprodukte, Stand 23.9.2026: Automaten Transaktionen umfassen „Bareinzahlungen auf das eigene Konto“, je € 0,51 nach der inkludierten; „Manuelle Buchungen und Schaltertransaktionen € 4,12“."
          },
          "auslandFremdAbheben": {
            "url": "https://www.bawag.at/resource/blob/17844/fc3015a250213d6d43c8e3e32ce4f36a/giro-preisblatt-kontoboxen-neukunden-data.pdf",
            "stand": "25.11.2026",
            "hinweis": "BAWAG Konditionenübersicht Giroprodukte, Stand 23.9.2026, Debitkarte/Kontokarte: „Manipulationsentgelt für Kartentransaktionen 0,75%“ „zuzüglich an Geldautomaten € 1,82“ für Umsätze in Nicht-EUR-Währungen; dazu „Allfällige Fremdspesen“."
          },
          "auslandFremdZahlen": {
            "url": "https://www.bawag.at/resource/blob/17844/fc3015a250213d6d43c8e3e32ce4f36a/giro-preisblatt-kontoboxen-neukunden-data.pdf",
            "stand": "25.11.2026",
            "hinweis": "BAWAG Konditionenübersicht Giroprodukte, Stand 23.9.2026, Debitkarte/Kontokarte: „Manipulationsentgelt für Kartentransaktionen 0,75%“ „an Handelskassen und Online Shops € 1,09“ für Umsätze in Nicht-EUR-Währungen."
          },
          "sepaKostenlos": {
            "url": "https://www.bawag.at/resource/blob/17844/fc3015a250213d6d43c8e3e32ce4f36a/giro-preisblatt-kontoboxen-neukunden-data.pdf",
            "stand": "25.11.2026",
            "hinweis": "BAWAG Konditionenübersicht Giroprodukte, Stand 23.9.2026: KontoBox Small „Inkludiert: alle elektronischen Transaktionen“, Fußnote „Gut- und Lastschriften im eBanking und Zahlungen mit Kontokarte oder Kreditkarte“."
          },
          "filialen": {
            "url": "https://www.bawag.at/resource/blob/17844/fc3015a250213d6d43c8e3e32ce4f36a/giro-preisblatt-kontoboxen-neukunden-data.pdf",
            "stand": "25.11.2026",
            "hinweis": "BAWAG Konditionenübersicht Giroprodukte, Stand 23.9.2026: „Manuelle Buchungen und Schaltertransaktionen € 4,12“, die Bank hat also Schalter."
          },
          "appIos": {
            "url": "https://apps.apple.com/at/app/bawag-banking-app/id1444730051",
            "stand": "25.11.2026",
            "hinweis": "App Store Österreich, App „BAWAG Banking App“ (BAWAG P.S.K.), Bewertung 4,74 von 5 aus 14.796 Bewertungen, abgerufen am 25.11.2026 über die öffentliche iTunes-Suche von Apple."
          }
        },
        "finanzPunkte": {
          "kontofuehrung": 0,
          "bankkarte": 10,
          "girocard": 0,
          "debitkarte": 5,
          "abheben": 2.5,
          "einzahlen": 1.5,
          "mobilesBezahlen": 0,
          "sepa": 10,
          "support": 0,
          "kontowechsel": 0,
          "app": 2,
          "ident": 0,
          "ohneBedingung": 0,
          "ausland": 0.0,
          "abzug": 0
        }
      }
    ],
  },
  "krypto": {
    entwurf: false,
    stand: "23.11.2026",
    quellenHinweis: "Basis: Finanzfluss Krypto-Börsen-Vergleich (Deutschland), Stand 14.09.2026, für Anbieter mit demselben Angebot in Österreich; Trade Republic mit Belegen für Österreich. Eigene Halal-Prüfung mit Anbieter-Belegen.",
    einleitung: ["Hier stehen Krypto-Anbieter, die du mit Wohnsitz in Österreich nutzen kannst.", "Entscheidend sind echte Coins, die Auszahlung auf deine eigene Wallet und ein Guthaben ohne Zinsen oder Staking ab Start."],
    reihenfolge: ["bitpanda-standard-at", "finst-standard-at", "trade-republic-krypto-at", "bitvavo-standard-at"],
    anbieter: [
      {
        "id": "bitpanda-standard-at",
        "name": "Bitpanda",
        "produkt": "Standard",
        "domain": "bitpanda.com",
        "haus": "bitpanda",
        "werte": {
          "zinsfreiAbStart": "teils",
          "echteCoins": "gut",
          "eigeneWallet": "gut",
          "zinsfreiesModell": "gut",
          "anzahlCoins": "650+",
          "gesamtkosten": "7,95€",
          "transparenteKosten": "nein",
          "auszahlungBitcoin": "0,40 €",
          "sparplan": true,
          "regulierung": "MiCA-Lizenz (Österreich)",
          "sicherheit": "2FA mit TOTP",
          "einzahlung": "SEPA-Echtzeitüberweisung, Kreditkarte, PayPal",
          "mindestbetrag": "1€"
        },
        "quellen": {
          "zinsfreiAbStart": {
            "url": "https://support.bitpanda.com/hc/de/articles/24873644625820-Bitpanda-Passive-Earn",
            "stand": "20.09.2026",
            "hinweis": "Beleg aus dem deutschen Vergleich, dasselbe Produkt für Kunden in Österreich: Mit der Annahme unserer neuesten AGB nimmst du automatisch an Passive Earn teil. ... Solange deine Assets die Voraussetzungen erfüllen, erhältst du automatisch Rewards - allein durch das Halten deiner Assets. Ein manuelles Staking ist nicht erforderlich. ... Du kannst Passive Earn jederzeit deaktivieren, indem du unseren Kundensupport kontaktierst."
          },
          "echteCoins": {
            "url": "https://support.bitpanda.com/hc/de/articles/360000902845-Kryptow%C3%A4hrungen-auszahlen",
            "stand": "27.09.2026",
            "hinweis": "Beleg aus dem deutschen Vergleich, dasselbe Produkt für Kunden in Österreich: Auszahlung auf eine eigene Wallet ist laut Anbieter möglich, das geht nur mit echten Coins: „Finde heraus, wie Kryptowährungen von Bitpanda an externe Wallets gesendet werden können und was dabei zu beachten ist.“ Ersetzt am 27.09.2026 den Finanzfluss-Vergleich als Quelle."
          },
          "eigeneWallet": {
            "url": "https://support.bitpanda.com/hc/de/articles/360000902845-Kryptow%C3%A4hrungen-auszahlen",
            "stand": "27.09.2026",
            "hinweis": "Beleg aus dem deutschen Vergleich, dasselbe Produkt für Kunden in Österreich: „Finde heraus, wie Kryptowährungen von Bitpanda an externe Wallets gesendet werden können und was dabei zu beachten ist.“ Ersetzt am 27.09.2026 den Finanzfluss-Vergleich als Quelle."
          },
          "zinsfreiesModell": {
            "url": "https://www.bitpanda.com/de/bitpanda-club",
            "stand": "23.09.2026",
            "hinweis": "Beleg aus dem deutschen Vergleich, dasselbe Produkt für Kunden in Österreich: Wie werde ich ein Gold Member? Unser Premium-Service basiert auf deinem Trade-Volumen, d. h. 100k in einem der letzten 6 Monate, Assets + Fiat-Guthaben über 400 € und mindestens 5 Trades."
          },
          "anzahlCoins": {
            "url": "https://www.finanzfluss.de/vergleich/krypto-boersen/",
            "stand": "14.09.2026",
            "hinweis": "Finanzfluss Krypto-Börsen-Vergleich (Deutschland), dasselbe Angebot für Kunden in Österreich."
          },
          "gesamtkosten": {
            "url": "https://www.finanzfluss.de/vergleich/krypto-boersen/",
            "stand": "14.09.2026",
            "hinweis": "Finanzfluss Krypto-Börsen-Vergleich (Deutschland), dasselbe Angebot für Kunden in Österreich."
          },
          "transparenteKosten": {
            "url": "https://www.finanzfluss.de/vergleich/krypto-boersen/",
            "stand": "14.09.2026",
            "hinweis": "Finanzfluss Krypto-Börsen-Vergleich (Deutschland), dasselbe Angebot für Kunden in Österreich."
          },
          "auszahlungBitcoin": {
            "url": "https://www.finanzfluss.de/vergleich/krypto-boersen/",
            "stand": "14.09.2026",
            "hinweis": "Finanzfluss Krypto-Börsen-Vergleich (Deutschland), dasselbe Angebot für Kunden in Österreich."
          },
          "sparplan": {
            "url": "https://www.finanzfluss.de/vergleich/krypto-boersen/",
            "stand": "14.09.2026",
            "hinweis": "Finanzfluss Krypto-Börsen-Vergleich (Deutschland), dasselbe Angebot für Kunden in Österreich."
          },
          "regulierung": {
            "url": "https://www.finanzfluss.de/vergleich/krypto-boersen/",
            "stand": "14.09.2026",
            "hinweis": "Finanzfluss Krypto-Börsen-Vergleich (Deutschland), dasselbe Angebot für Kunden in Österreich."
          },
          "sicherheit": {
            "url": "https://www.finanzfluss.de/vergleich/krypto-boersen/",
            "stand": "14.09.2026",
            "hinweis": "Finanzfluss Krypto-Börsen-Vergleich (Deutschland), dasselbe Angebot für Kunden in Österreich."
          },
          "einzahlung": {
            "url": "https://www.finanzfluss.de/vergleich/krypto-boersen/",
            "stand": "14.09.2026",
            "hinweis": "Finanzfluss Krypto-Börsen-Vergleich (Deutschland), dasselbe Angebot für Kunden in Österreich."
          },
          "mindestbetrag": {
            "url": "https://www.finanzfluss.de/vergleich/krypto-boersen/",
            "stand": "14.09.2026",
            "hinweis": "Finanzfluss Krypto-Börsen-Vergleich (Deutschland), dasselbe Angebot für Kunden in Österreich."
          }
        },
        "finanzPunkte": {
          "gebuehren": 30,
          "transparenz": 0,
          "transferkosten": 40,
          "sicherheit": 50,
          "verifizierung": 40,
          "bezahlmethoden": 50,
          "mica": 30,
          "sparplan": 20,
          "mindestbetrag": 20,
          "abzug": 0
        }
      },
      {
        "id": "finst-standard-at",
        "name": "Finst",
        "produkt": "Standard",
        "domain": "finst.com",
        "haus": "finst",
        "werte": {
          "zinsfreiAbStart": "gut",
          "echteCoins": "gut",
          "eigeneWallet": "gut",
          "zinsfreiesModell": "gut",
          "anzahlCoins": "400+",
          "gesamtkosten": "0,75€",
          "transparenteKosten": "ja",
          "auszahlungBitcoin": "2,61 €",
          "sparplan": true,
          "regulierung": "MiCA-Lizenz (Niederlande)",
          "sicherheit": "2FA per SMS",
          "einzahlung": "SEPA-Echtzeitüberweisung",
          "mindestbetrag": "0,05€"
        },
        "quellen": {
          "zinsfreiAbStart": {
            "url": "https://finst.com/de/staking",
            "stand": "20.09.2026",
            "hinweis": "Beleg aus dem deutschen Vergleich, dasselbe Produkt für Kunden in Österreich: Wie starte ich mit dem Staking bei Finst? Das Staking von Kryptowährungen bei Finst ist ganz einfach. Sobald du deine Lieblingskryptowährung gekauft hast, kannst du das Staking mit einem Klick direkt in deinem Finst-Konto aktivieren. Ab dann erhältst du automatisch wöchentlich Staking-Rewards."
          },
          "echteCoins": {
            "url": "https://help.finst.com/de/article/wie-kann-ich-kryptowahrungen-an-eine-externe-wallet-auszahlen-abheben-1x588wu/",
            "stand": "27.09.2026",
            "hinweis": "Beleg aus dem deutschen Vergleich, dasselbe Produkt für Kunden in Österreich: Auszahlung auf eine eigene Wallet ist laut Anbieter möglich, das geht nur mit echten Coins: „Es ist möglich, deine Krypto an verschiedene Exchanges oder persönliche Wallets zu senden.“ Ersetzt am 27.09.2026 den Finanzfluss-Vergleich als Quelle."
          },
          "eigeneWallet": {
            "url": "https://help.finst.com/de/article/wie-kann-ich-kryptowahrungen-an-eine-externe-wallet-auszahlen-abheben-1x588wu/",
            "stand": "27.09.2026",
            "hinweis": "Beleg aus dem deutschen Vergleich, dasselbe Produkt für Kunden in Österreich: „Es ist möglich, deine Krypto an verschiedene Exchanges oder persönliche Wallets zu senden.“ Einschränkung laut Anbieter: „Abhebungen auf selbst gehostete Wallets (z. B. Ledger, MetaMask usw.) sind weiterhin möglich.“ Ersetzt am 27.09.2026 den Finanzfluss-Vergleich als Quelle."
          },
          "zinsfreiesModell": {
            "url": "https://finst.com/de/fees",
            "stand": "20.09.2026",
            "hinweis": "Beleg aus dem deutschen Vergleich, dasselbe Produkt für Kunden in Österreich: Gebühr (%) 0,15% ... Kein extra Spread. Kostenlose Ein- und Auszahlungen. Keine Inaktivitätsgebühren. Keine Verwahrgebühren. Kein Mindesthandelsbetrag."
          },
          "anzahlCoins": {
            "url": "https://www.finanzfluss.de/vergleich/krypto-boersen/",
            "stand": "14.09.2026",
            "hinweis": "Finanzfluss Krypto-Börsen-Vergleich (Deutschland), dasselbe Angebot für Kunden in Österreich."
          },
          "gesamtkosten": {
            "url": "https://www.finanzfluss.de/vergleich/krypto-boersen/",
            "stand": "14.09.2026",
            "hinweis": "Finanzfluss Krypto-Börsen-Vergleich (Deutschland), dasselbe Angebot für Kunden in Österreich."
          },
          "transparenteKosten": {
            "url": "https://www.finanzfluss.de/vergleich/krypto-boersen/",
            "stand": "14.09.2026",
            "hinweis": "Finanzfluss Krypto-Börsen-Vergleich (Deutschland), dasselbe Angebot für Kunden in Österreich."
          },
          "auszahlungBitcoin": {
            "url": "https://www.finanzfluss.de/vergleich/krypto-boersen/",
            "stand": "14.09.2026",
            "hinweis": "Finanzfluss Krypto-Börsen-Vergleich (Deutschland), dasselbe Angebot für Kunden in Österreich."
          },
          "sparplan": {
            "url": "https://www.finanzfluss.de/vergleich/krypto-boersen/",
            "stand": "14.09.2026",
            "hinweis": "Finanzfluss Krypto-Börsen-Vergleich (Deutschland), dasselbe Angebot für Kunden in Österreich."
          },
          "regulierung": {
            "url": "https://www.finanzfluss.de/vergleich/krypto-boersen/",
            "stand": "14.09.2026",
            "hinweis": "Finanzfluss Krypto-Börsen-Vergleich (Deutschland), dasselbe Angebot für Kunden in Österreich."
          },
          "sicherheit": {
            "url": "https://www.finanzfluss.de/vergleich/krypto-boersen/",
            "stand": "14.09.2026",
            "hinweis": "Finanzfluss Krypto-Börsen-Vergleich (Deutschland), dasselbe Angebot für Kunden in Österreich."
          },
          "einzahlung": {
            "url": "https://www.finanzfluss.de/vergleich/krypto-boersen/",
            "stand": "14.09.2026",
            "hinweis": "Finanzfluss Krypto-Börsen-Vergleich (Deutschland), dasselbe Angebot für Kunden in Österreich."
          },
          "mindestbetrag": {
            "url": "https://www.finanzfluss.de/vergleich/krypto-boersen/",
            "stand": "14.09.2026",
            "hinweis": "Finanzfluss Krypto-Börsen-Vergleich (Deutschland), dasselbe Angebot für Kunden in Österreich."
          }
        },
        "finanzPunkte": {
          "gebuehren": 100,
          "transparenz": 100,
          "transferkosten": 40,
          "sicherheit": 25,
          "verifizierung": 40,
          "bezahlmethoden": 50,
          "mica": 30,
          "sparplan": 20,
          "mindestbetrag": 20,
          "abzug": 0
        },
        "link": "/out/finst-at"
      },
      {
        "id": "trade-republic-krypto-at",
        "name": "Trade Republic",
        "produkt": "Krypto",
        "domain": "traderepublic.com",
        "haus": "trade-republic",
        "werte": {
          "zinsfreiAbStart": "gut",
          "echteCoins": null,
          "eigeneWallet": null,
          "zinsfreiesModell": null,
          "anzahlCoins": "50+",
          "gesamtkosten": "4,90€",
          "transparenteKosten": "nein",
          "auszahlungBitcoin": "0,13 €",
          "sparplan": true,
          "regulierung": "MiCA-Lizenz (Deutschland)",
          "sicherheit": "2FA mit TOTP",
          "einzahlung": "SEPA-Echtzeitüberweisung, Kreditkarte",
          "mindestbetrag": "1€"
        },
        "quellen": {
          "zinsfreiAbStart": {
            "url": "https://traderepublic.com/de-at/zinsen",
            "stand": "23.11.2026",
            "hinweis": "Trade Republic Österreich: „Aktiviere die Zinsfunktion in der App und erhalte Zinsen auf dein gesamtes Cash.“ Zinsen laufen erst nach eigener Aktivierung."
          },
          "anzahlCoins": {
            "url": "https://www.finanzfluss.de/vergleich/krypto-boersen/",
            "stand": "14.09.2026",
            "hinweis": "Finanzfluss Krypto-Börsen-Vergleich (Deutschland), dasselbe Angebot für Kunden in Österreich."
          },
          "gesamtkosten": {
            "url": "https://www.finanzfluss.de/vergleich/krypto-boersen/",
            "stand": "14.09.2026",
            "hinweis": "Finanzfluss Krypto-Börsen-Vergleich (Deutschland), dasselbe Angebot für Kunden in Österreich."
          },
          "transparenteKosten": {
            "url": "https://www.finanzfluss.de/vergleich/krypto-boersen/",
            "stand": "14.09.2026",
            "hinweis": "Finanzfluss Krypto-Börsen-Vergleich (Deutschland), dasselbe Angebot für Kunden in Österreich."
          },
          "auszahlungBitcoin": {
            "url": "https://www.finanzfluss.de/vergleich/krypto-boersen/",
            "stand": "14.09.2026",
            "hinweis": "Finanzfluss Krypto-Börsen-Vergleich (Deutschland), dasselbe Angebot für Kunden in Österreich."
          },
          "sparplan": {
            "url": "https://www.finanzfluss.de/vergleich/krypto-boersen/",
            "stand": "14.09.2026",
            "hinweis": "Finanzfluss Krypto-Börsen-Vergleich (Deutschland), dasselbe Angebot für Kunden in Österreich."
          },
          "regulierung": {
            "url": "https://www.finanzfluss.de/vergleich/krypto-boersen/",
            "stand": "14.09.2026",
            "hinweis": "Finanzfluss Krypto-Börsen-Vergleich (Deutschland), dasselbe Angebot für Kunden in Österreich."
          },
          "sicherheit": {
            "url": "https://www.finanzfluss.de/vergleich/krypto-boersen/",
            "stand": "14.09.2026",
            "hinweis": "Finanzfluss Krypto-Börsen-Vergleich (Deutschland), dasselbe Angebot für Kunden in Österreich."
          },
          "einzahlung": {
            "url": "https://www.finanzfluss.de/vergleich/krypto-boersen/",
            "stand": "14.09.2026",
            "hinweis": "Finanzfluss Krypto-Börsen-Vergleich (Deutschland), dasselbe Angebot für Kunden in Österreich."
          },
          "mindestbetrag": {
            "url": "https://www.finanzfluss.de/vergleich/krypto-boersen/",
            "stand": "14.09.2026",
            "hinweis": "Finanzfluss Krypto-Börsen-Vergleich (Deutschland), dasselbe Angebot für Kunden in Österreich."
          }
        },
        "finanzPunkte": {
          "gebuehren": 50,
          "transparenz": 0,
          "transferkosten": 40,
          "sicherheit": 50,
          "verifizierung": 40,
          "bezahlmethoden": 50,
          "mica": 30,
          "sparplan": 20,
          "mindestbetrag": 20,
          "abzug": 0
        }
      },
      {
        "id": "bitvavo-standard-at",
        "name": "Bitvavo",
        "produkt": "Standard",
        "domain": "bitvavo.com",
        "haus": "bitvavo",
        "werte": {
          "zinsfreiAbStart": "gut",
          "echteCoins": "gut",
          "eigeneWallet": "gut",
          "zinsfreiesModell": "gut",
          "anzahlCoins": "400+",
          "gesamtkosten": "1,30€",
          "transparenteKosten": "ja",
          "auszahlungBitcoin": "1,27 €",
          "sparplan": true,
          "regulierung": "MiCA-Lizenz (Niederlande)",
          "sicherheit": "2FA mit TOTP, Anti-Phishing Code",
          "einzahlung": "SEPA-Echtzeitüberweisung, Kreditkarte, PayPal",
          "mindestbetrag": "5€"
        },
        "quellen": {
          "zinsfreiAbStart": {
            "url": "https://bitvavo.com/de/earn",
            "stand": "24.09.2026",
            "hinweis": "Beleg aus dem deutschen Vergleich, dasselbe Produkt für Kunden in Österreich: Bitvavo auf der eigenen Earn-Seite: „Einmalige Aktivierung — Aktiviere Auto Earn im Earn Hub vom Account-Menü aus, um automatisch mit über 65 berechtigten Kryptowährungen zu verdienen.“ Der Knopf heißt „Staking aktivieren“. Ohne diese Aktivierung läuft kein Ertrag. Deckt sich mit der schriftlichen Antwort von Bitvavo vom 18.09.2026 (Ticket #1934199)."
          },
          "echteCoins": {
            "url": "https://support.bitvavo.com/hc/de/articles/4405186610193-Wie-kann-ich-Kryptow%C3%A4hrungen-von-meinem-Bitvavo-Account-auf-meine-externe-Wallet-auszahlen-senden",
            "stand": "27.09.2026",
            "hinweis": "Beleg aus dem deutschen Vergleich, dasselbe Produkt für Kunden in Österreich: Auszahlung auf eine eigene Wallet ist laut Anbieter möglich, das geht nur mit echten Coins: „Sobald diese beiden Schritte erledigt sind, kannst du deine Kryptowährung an deine externe Wallet senden, indem du die unten beschriebenen Schritte befolgst.“ Ersetzt am 27.09.2026 den Finanzfluss-Vergleich als Quelle."
          },
          "eigeneWallet": {
            "url": "https://support.bitvavo.com/hc/de/articles/4405186610193-Wie-kann-ich-Kryptow%C3%A4hrungen-von-meinem-Bitvavo-Account-auf-meine-externe-Wallet-auszahlen-senden",
            "stand": "27.09.2026",
            "hinweis": "Beleg aus dem deutschen Vergleich, dasselbe Produkt für Kunden in Österreich: „Sobald diese beiden Schritte erledigt sind, kannst du deine Kryptowährung an deine externe Wallet senden, indem du die unten beschriebenen Schritte befolgst.“ Ersetzt am 27.09.2026 den Finanzfluss-Vergleich als Quelle."
          },
          "zinsfreiesModell": {
            "url": "https://support.bitvavo.com/hc/de/articles/4405243949841-Staking-at-Bitvavo",
            "stand": "21.09.2026",
            "hinweis": "Beleg aus dem deutschen Vergleich, dasselbe Produkt für Kunden in Österreich: Schriftlich bestätigt vom Bitvavo-Kundenservice am 18.09.2026 (Ticket #1934199): „es gibt bei uns kein Kontomodell, das automatisch Zinsen auf ungenutztes Euro-Guthaben generiert“. „Auto Earn“ ist „nicht automatisch aktiv“, Margin- und Hebelhandel sind „bei Kontoeröffnung nicht aktiviert“."
          },
          "anzahlCoins": {
            "url": "https://www.finanzfluss.de/vergleich/krypto-boersen/",
            "stand": "14.09.2026",
            "hinweis": "Finanzfluss Krypto-Börsen-Vergleich (Deutschland), dasselbe Angebot für Kunden in Österreich."
          },
          "gesamtkosten": {
            "url": "https://www.finanzfluss.de/vergleich/krypto-boersen/",
            "stand": "14.09.2026",
            "hinweis": "Finanzfluss Krypto-Börsen-Vergleich (Deutschland), dasselbe Angebot für Kunden in Österreich."
          },
          "transparenteKosten": {
            "url": "https://www.finanzfluss.de/vergleich/krypto-boersen/",
            "stand": "14.09.2026",
            "hinweis": "Finanzfluss Krypto-Börsen-Vergleich (Deutschland), dasselbe Angebot für Kunden in Österreich."
          },
          "auszahlungBitcoin": {
            "url": "https://www.finanzfluss.de/vergleich/krypto-boersen/",
            "stand": "14.09.2026",
            "hinweis": "Finanzfluss Krypto-Börsen-Vergleich (Deutschland), dasselbe Angebot für Kunden in Österreich."
          },
          "sparplan": {
            "url": "https://www.finanzfluss.de/vergleich/krypto-boersen/",
            "stand": "14.09.2026",
            "hinweis": "Finanzfluss Krypto-Börsen-Vergleich (Deutschland), dasselbe Angebot für Kunden in Österreich."
          },
          "regulierung": {
            "url": "https://www.finanzfluss.de/vergleich/krypto-boersen/",
            "stand": "14.09.2026",
            "hinweis": "Finanzfluss Krypto-Börsen-Vergleich (Deutschland), dasselbe Angebot für Kunden in Österreich."
          },
          "sicherheit": {
            "url": "https://www.finanzfluss.de/vergleich/krypto-boersen/",
            "stand": "14.09.2026",
            "hinweis": "Finanzfluss Krypto-Börsen-Vergleich (Deutschland), dasselbe Angebot für Kunden in Österreich."
          },
          "einzahlung": {
            "url": "https://www.finanzfluss.de/vergleich/krypto-boersen/",
            "stand": "14.09.2026",
            "hinweis": "Finanzfluss Krypto-Börsen-Vergleich (Deutschland), dasselbe Angebot für Kunden in Österreich."
          },
          "mindestbetrag": {
            "url": "https://www.finanzfluss.de/vergleich/krypto-boersen/",
            "stand": "14.09.2026",
            "hinweis": "Finanzfluss Krypto-Börsen-Vergleich (Deutschland), dasselbe Angebot für Kunden in Österreich."
          }
        },
        "finanzPunkte": {
          "gebuehren": 100,
          "transparenz": 100,
          "transferkosten": 40,
          "sicherheit": 50,
          "verifizierung": 40,
          "bezahlmethoden": 50,
          "mica": 30,
          "sparplan": 20,
          "mindestbetrag": 15,
          "abzug": 0
        }
      }
    ],
  },
  "edelmetalle": {
    entwurf: false,
    stand: "23.11.2026",
    quellenHinweis: "Basis: Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026. Royal Mint Gold-ETC: in Österreich registriert laut HANetf, kaufbar laut justETF Österreich (Stand 11/2026) oder laut deutschem Vergleich bei demselben Depot. Eigene Halal-Prüfung mit Anbieter-Belegen.",
    einleitung: ["Hier stehen Depots, in denen du mit Wohnsitz in Österreich den Royal Mint Gold-ETC kaufen kannst. Hinter jedem Anteil liegt echtes Gold, Barren und Münzen lassen sich ausliefern.", "Wie Gewinne aus dem Gold-ETC in Österreich besteuert werden, klärst du am besten mit einem Steuerberater."],
    reihenfolge: ["traders-place-depot-gold-at", "smartbroker-plus-depot-gold-at", "trade-republic-depot-gold-at", "dkb-depot-gold-at"],
    untertitel: "Welcher Broker passt, wenn du Gold islamkonform kaufen willst",
    seoText: "Wo kannst du Gold halal kaufen? {anzahl} Depots für Österreich im Vergleich: ohne Zinsen nutzbar, mit dem Royal Mint Gold-ETC und den Kosten pro Kauf.",
    anteilN: {"halalEtfsFonds": 1, "halalSukuk": 1, "halalEdelmetalle": 1},
    anzeige: ANLAGEN_ANZEIGE,
    kriterien: [{"titel": "Ohne Zinsen nutzbar", "text": "Liegt dein Guthaben ohne Zins, oder lassen sich die Zinsen abschalten? Nur solche Depots stehen in diesem Vergleich."}, {"titel": "Royal Mint kaufbar", "text": "Kannst du dort den Royal Mint Gold-ETC kaufen? Er ist in Österreich registriert, nur solche Depots stehen hier."}, {"titel": "Halal-Anlagen im selben Depot", "text": "Bekommst du im selben Depot auch Halal-ETFs und Sukuk, die in Österreich zugelassen sind? Gold gehört zum Anlegen, du brauchst dafür kein zweites Depot."}, {"titel": "Kosten pro Kauf", "text": "Was kostet dich ein Kauf? Es zählen Depotgebühr, Orderkosten, Handelsplätze, Steuerabführung, Service und App."}],
    anbieter: [
      {
        "id": "traders-place-depot-gold-at",
        "name": "Traders Place",
        "produkt": "Depot",
        "domain": "tradersplace.de",
        "haus": "traders-place",
        "werte": {
          "zinsfreiAbStart": "gut",
          "halalEtfsFonds": "1 von 1",
          "halalSukuk": "1 von 1",
          "halalEdelmetalle": "1 von 1",
          "depotgebuehr": "0€",
          "orderkosten": "0,95€ je Order unter 500€, ab 500€: 0€",
          "etfSparplanKosten": "0€ bei Amundi, DWS, DJE, Xtrackers, iShares und Vanguard, sonst 0,50€",
          "sparrate": "1€ bis 7.500€",
          "intervalle": "Woche, Zweiwöchentlich, Monat, Zweimonatlich, Quartal, Halbjahr, Jahr",
          "kundenservice": "E-Mail, Telefon, Chat",
          "handelsplaetze": "AT, Europa (ex-AT), USA, Sonstige, OTC",
          "kapest": false,
          "appIos": "4,3 / 5",
          "royalMint": "ja"
        },
        "quellen": {
          "zinsfreiAbStart": {
            "url": "https://tradersplace.de/konditionen/deine-konditionen",
            "stand": "19.09.2026",
            "hinweis": "Beleg aus dem deutschen Vergleich, dasselbe Produkt für Kunden in Österreich: Reiter Kontokonditionen, „Zinssätze Verrechnungskonto … EUR-Verrechnungskonto Guthabenzinssatz 0% p.a. … Fremdwährungs-Verrechnungskonto (USD, CHF, GBP) Guthabenzinssatz 0% p.a.“ / Zinskonto (tradersplace.de/angebot/uebersicht/zinskonto): „Um das Zinskonto zu eröffnen, benötigst du ein Traders Place Depot. Einzahlungen auf das Zinskonto können nur von deinem bestehenden Traders Place Verrechnungskonto erfolgen“"
          },
          "orderkosten": {
            "url": "https://tradersplace.de/konditionen/deine-konditionen",
            "stand": "06.10.2026",
            "hinweis": "Beleg aus dem deutschen Vergleich, dasselbe Produkt für Kunden in Österreich: Handelsplatz gettex: „Gebühr je Order bei Aktien, ETFs, Fonds und Anleihen“ „€ 0,00“, „Gebühr bei Orders unter € 500,- Kurswert“ „€ 0,95“."
          },
          "etfSparplanKosten": {
            "url": "https://tradersplace.de/konditionen/deine-konditionen",
            "stand": "06.10.2026",
            "hinweis": "Beleg aus dem deutschen Vergleich, dasselbe Produkt für Kunden in Österreich: „Sparpläne in ETFs und Fonds unserer Premium Partner Amundi, DWS, DJE, DWS xtrackers, iShares und Vanguard“ „€ 0,00“, „Sonstige Sparpläne in ETFs und Fonds“ „€ 0,50“."
          },
          "kapest": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026: „Steuereinfach in Österreich“ nein. Die KESt führst du über die Steuererklärung selbst ab."
          },
          "appIos": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "handelsplaetze": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "halalEtfsFonds": {
            "url": "https://www.tradersplace.de/wertpapiersuche",
            "stand": "16.10.2026",
            "hinweis": "Kaufbar: iShares MSCI World Islamic, Invesco MSCI ACWI Islamic, Invesco Dow Jones Islamic Global Developed Markets, HANetf Saturna Al-Kawthar Global Focused Equity. Traders Place Wertpapiersuche (deutscher Vergleich, dasselbe Depot). In Österreich gezählt wird nur der iShares MSCI World Islamic (IE00B27YCN58): BlackRock Österreich nennt ihn „Zum Vertrieb Zugelassen In … Österreich“ (blackrock.com/at, 23.11.2026). Für die übrigen Halal-ETFs fehlt ein Zulassungsbeleg des Emittenten, sie zählen nicht. Nicht zugelassen laut justETF Österreich: iShares MSCI USA und EM Islamic, alle HSBC-ETFs."
          },
          "halalSukuk": {
            "url": "https://www.tradersplace.de/wertpapiersuche",
            "stand": "16.10.2026",
            "hinweis": "Kaufbar: iShares USD Sukuk (IE000929U2U9). Traders Place Wertpapiersuche (deutscher Vergleich, dasselbe Depot). In Österreich zugelassen laut BlackRock Österreich; Xtrackers Salam Sukuk laut justETF Österreich nicht zugelassen."
          },
          "halalEdelmetalle": {
            "url": "https://www.tradersplace.de/wertpapiersuche",
            "stand": "04.11.2026",
            "hinweis": "Kaufbar: Royal Mint Physical Gold ETC (XS2115336336). Traders Place Wertpapiersuche (deutscher Vergleich, dasselbe Depot). In Österreich registriert laut HANetf (Registrations: Austria). Die übrigen Edelmetall-ETCs zählen in Österreich erst mit Beleg der Zulassung."
          },
          "royalMint": {
            "url": "https://www.tradersplace.de/wertpapiersuche",
            "stand": "04.11.2026",
            "hinweis": "Kaufbar: Royal Mint Physical Gold ETC (XS2115336336). Traders Place Wertpapiersuche (deutscher Vergleich, dasselbe Depot). In Österreich registriert laut HANetf (Registrations: Austria). Die übrigen Edelmetall-ETCs zählen in Österreich erst mit Beleg der Zulassung."
          }
        },
        "finanzPunkte": {
          "depotgebuehr": 16,
          "etfSparplanProzent": 6,
          "etfSparplanPauschal": 4,
          "orderProzent": 3,
          "orderPauschal": 6,
          "mindestsparrate": 3,
          "maximalsparrate": 0.667,
          "intervalle": 2.5,
          "handelsplaetze": 2,
          "kapest": 0,
          "kundenservice": 5,
          "app": 5,
          "abzug": 0
        },
        "halalAnlagenPunkte": {
          "halalEtfsFonds": 1,
          "halalSukuk": 1,
          "halalEdelmetalle": 1
        },
        "link": "/out/traders-place-at"
      },
      {
        "id": "smartbroker-plus-depot-gold-at",
        "name": "Smartbroker+",
        "produkt": "Depot",
        "domain": "smartbrokerplus.de",
        "haus": "smartbroker",
        "werte": {
          "zinsfreiAbStart": "gut",
          "halalEtfsFonds": "1 von 1",
          "halalSukuk": "1 von 1",
          "halalEdelmetalle": "1 von 1",
          "depotgebuehr": "0€",
          "orderkosten": "1€ je Order unter 500€, ab 500€: 0€",
          "etfSparplanKosten": "0€",
          "sparrate": "1€ bis 5.000€",
          "intervalle": "Monat, Zweimonatlich, Quartal, Halbjahr, Jahr",
          "kundenservice": "E-Mail, Telefon, Chat",
          "handelsplaetze": "AT, Europa (ex-AT), USA, Sonstige, OTC",
          "kapest": false,
          "appIos": "4,2 / 5",
          "royalMint": "ja"
        },
        "quellen": {
          "zinsfreiAbStart": {
            "url": "https://www.smartbrokerplus.de/de-de/konditionen/",
            "stand": "20.09.2026",
            "hinweis": "Beleg aus dem deutschen Vergleich, dasselbe Produkt für Kunden in Österreich: Konditionen: „Wertpapierverwahrung und Kontoführung (Baader): Depotführung inklusive Nebendepots kostenlos, Kontoführung inklusive Währungskonten kostenlos“; Guthabenzinsen werden nur unter „Zinskonto (Baader)“ genannt: „Zinssatz für Guthaben auf dem Zinskonto 2,25 % p.a.“ / Zinskonto-Seite: „auf das Guthaben auf einem separat zu eröffnendem Zinskonto“"
          },
          "orderkosten": {
            "url": "https://www.smartbrokerplus.de/de-de/konditionen/",
            "stand": "06.10.2026",
            "hinweis": "Beleg aus dem deutschen Vergleich, dasselbe Produkt für Kunden in Österreich: Transaktionspreise, gettex (Aktien, Anleihen, ETFs/ETPs, Fonds): „0 EUR (ab 500 EUR Ordervolumen)“, „1 EUR (bis 499,99 EUR Ordervolumen)“."
          },
          "kapest": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026: „Steuereinfach in Österreich“ nein. Die KESt führst du über die Steuererklärung selbst ab."
          },
          "appIos": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "handelsplaetze": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "halalEtfsFonds": {
            "url": "https://www.smartbrokerplus.de/",
            "stand": "21.10.2026",
            "hinweis": "Kaufbar: iShares MSCI World Islamic, Invesco MSCI ACWI Islamic, Invesco Dow Jones Islamic Global Developed Markets, HANetf Saturna Al-Kawthar Global Focused Equity. Smartbroker+ (deutscher Vergleich, dasselbe Depot). In Österreich gezählt wird nur der iShares MSCI World Islamic (IE00B27YCN58): BlackRock Österreich nennt ihn „Zum Vertrieb Zugelassen In … Österreich“ (blackrock.com/at, 23.11.2026). Für die übrigen Halal-ETFs fehlt ein Zulassungsbeleg des Emittenten, sie zählen nicht. Nicht zugelassen laut justETF Österreich: iShares MSCI USA und EM Islamic, alle HSBC-ETFs."
          },
          "halalSukuk": {
            "url": "https://www.smartbrokerplus.de/api/data/tradeable-assets/?q=IE000929U2U9",
            "stand": "25.09.2026",
            "hinweis": "Kaufbar: iShares USD Sukuk (IE000929U2U9). Smartbroker+ Wertpapierliste (deutscher Vergleich, dasselbe Depot). In Österreich zugelassen laut BlackRock Österreich; Xtrackers Salam Sukuk laut justETF Österreich nicht zugelassen."
          },
          "halalEdelmetalle": {
            "url": "https://www.smartbrokerplus.de/api/data/tradeable-assets/?q=XS2115336336",
            "stand": "04.11.2026",
            "hinweis": "Kaufbar: Royal Mint Physical Gold ETC (XS2115336336). Smartbroker+ Wertpapierliste (deutscher Vergleich, dasselbe Depot). In Österreich registriert laut HANetf (Registrations: Austria). Die übrigen Edelmetall-ETCs zählen in Österreich erst mit Beleg der Zulassung."
          },
          "royalMint": {
            "url": "https://www.smartbrokerplus.de/api/data/tradeable-assets/?q=XS2115336336",
            "stand": "04.11.2026",
            "hinweis": "Kaufbar: Royal Mint Physical Gold ETC (XS2115336336). Smartbroker+ Wertpapierliste (deutscher Vergleich, dasselbe Depot). In Österreich registriert laut HANetf (Registrations: Austria). Die übrigen Edelmetall-ETCs zählen in Österreich erst mit Beleg der Zulassung."
          }
        },
        "finanzPunkte": {
          "depotgebuehr": 16,
          "etfSparplanProzent": 6,
          "etfSparplanPauschal": 4,
          "orderProzent": 3,
          "orderPauschal": 6,
          "mindestsparrate": 3,
          "maximalsparrate": 0.667,
          "intervalle": 2.5,
          "handelsplaetze": 2,
          "kapest": 0,
          "kundenservice": 5,
          "app": 5,
          "abzug": 0
        },
        "halalAnlagenPunkte": {
          "halalEtfsFonds": 1,
          "halalSukuk": 1,
          "halalEdelmetalle": 1
        },
        "link": "/out/smartbroker-at"
      },
      {
        "id": "trade-republic-depot-gold-at",
        "name": "Trade Republic",
        "produkt": "Depot",
        "domain": "traderepublic.com",
        "haus": "trade-republic",
        "werte": {
          "zinsfreiAbStart": "gut",
          "halalEtfsFonds": "1 von 1",
          "halalSukuk": "1 von 1",
          "halalEdelmetalle": "1 von 1",
          "depotgebuehr": "0 €",
          "orderkosten": "1 € (Wiener Börse 2 €)",
          "etfSparplanKosten": "0 €",
          "sparrate": "1 € bis 10.000 €",
          "intervalle": "Woche, Zweiwöchentlich, Monat, Quartal",
          "handelsplaetze": "AT, Europa (ex-AT), USA, Sonstige, OTC",
          "kapest": true,
          "appIos": "4,4 / 5",
          "kundenservice": "Telefon, Chat",
          "royalMint": "ja"
        },
        "quellen": {
          "depotgebuehr": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "orderkosten": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "etfSparplanKosten": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "sparrate": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "intervalle": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "handelsplaetze": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "kapest": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "appIos": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "kundenservice": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "zinsfreiAbStart": {
            "url": "https://traderepublic.com/de-at/zinsen",
            "stand": "23.11.2026",
            "hinweis": "Trade Republic Österreich, Zinsseite: „Aktiviere die Zinsfunktion in der App und erhalte Zinsen auf dein gesamtes Cash.“ und „Ja, du kannst die Zinsen in der App deaktivieren“. Zinsen laufen also erst nach eigener Aktivierung. Anbieter: „Trade Republic Bank GmbH, Branch Austria, Kärntner Ring 5-7, 1010 Wien“."
          },
          "halalEtfsFonds": {
            "url": "https://www.justetf.com/at/etf-profile.html?isin=IE00B27YCN58",
            "stand": "23.11.2026",
            "hinweis": "Kaufbar: iShares MSCI World Islamic, Invesco MSCI ACWI Islamic, Invesco Dow Jones Islamic Global Developed Markets, HANetf Saturna Al-Kawthar Global Focused Equity. justETF Österreich, Sparplan-Angebote für Österreich, Stand 11/2026: Trade Republic bei allen vier (IE00B27YCN58, IE000LFC57H7, IE000UOXRAM8, IE00BMYMHS24). In Österreich gezählt wird nur der iShares MSCI World Islamic (IE00B27YCN58): BlackRock Österreich nennt ihn „Zum Vertrieb Zugelassen In … Österreich“ (blackrock.com/at, 23.11.2026). Für die übrigen Halal-ETFs fehlt ein Zulassungsbeleg des Emittenten, sie zählen nicht. Nicht zugelassen laut justETF Österreich: iShares MSCI USA und EM Islamic, alle HSBC-ETFs."
          },
          "halalSukuk": {
            "url": "https://www.justetf.com/at/etf-profile.html?isin=IE000929U2U9",
            "stand": "23.11.2026",
            "hinweis": "Kaufbar: iShares USD Sukuk (IE000929U2U9). justETF Österreich, Sparplan-Angebote für Österreich, Stand 11/2026: Trade Republic. In Österreich zugelassen laut BlackRock Österreich; Xtrackers Salam Sukuk laut justETF Österreich nicht zugelassen."
          },
          "halalEdelmetalle": {
            "url": "https://www.justetf.com/at/etf-profile.html?isin=XS2115336336",
            "stand": "23.11.2026",
            "hinweis": "Kaufbar: Royal Mint Physical Gold ETC (XS2115336336). justETF Österreich, Sparplan-Angebote für Österreich, Stand 11/2026: Trade Republic. In Österreich registriert laut HANetf (Registrations: Austria). Die übrigen Edelmetall-ETCs zählen in Österreich erst mit Beleg der Zulassung."
          },
          "royalMint": {
            "url": "https://www.justetf.com/at/etf-profile.html?isin=XS2115336336",
            "stand": "23.11.2026",
            "hinweis": "Kaufbar: Royal Mint Physical Gold ETC (XS2115336336). justETF Österreich, Sparplan-Angebote für Österreich, Stand 11/2026: Trade Republic. In Österreich registriert laut HANetf (Registrations: Austria). Die übrigen Edelmetall-ETCs zählen in Österreich erst mit Beleg der Zulassung."
          }
        },
        "finanzPunkte": {
          "depotgebuehr": 16,
          "etfSparplanProzent": 6,
          "etfSparplanPauschal": 4,
          "orderProzent": 3,
          "orderPauschal": 4,
          "mindestsparrate": 3,
          "maximalsparrate": 0.667,
          "intervalle": 2.0,
          "handelsplaetze": 2,
          "kapest": 9,
          "kundenservice": 3,
          "app": 5,
          "abzug": 0
        },
        "halalAnlagenPunkte": {
          "halalEtfsFonds": 1,
          "halalSukuk": 1,
          "halalEdelmetalle": 1
        }
      },
      {
        "id": "dkb-depot-gold-at",
        "name": "DKB",
        "produkt": "Depot",
        "domain": "dkb.de",
        "haus": "dkb",
        "werte": {
          "zinsfreiAbStart": "gut",
          "halalEtfsFonds": "1 von 1",
          "halalSukuk": null,
          "halalEdelmetalle": "1 von 1",
          "depotgebuehr": "0€",
          "orderkosten": "10€",
          "etfSparplanKosten": "1,50€",
          "sparrate": "25€ bis 5.000€",
          "intervalle": "Monat, Zweimonatlich, Quartal, Halbjahr, Jahr",
          "kundenservice": "E-Mail, Telefon, Chat",
          "handelsplaetze": "DE, Europa (ex-DE), USA, Sonstige, OTC",
          "kapest": false,
          "appIos": "4,6 / 5",
          "royalMint": "ja"
        },
        "quellen": {
          "kapest": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026: „Der Nachteil ist allerdings, dass ein deutscher Depotanbieter die Kapitalertragsteuer nicht automatisch an das Finanzamt abführt.“ Als deutsche Broker mit steuereinfachem Depot nennt die Seite nur Trade Republic und Flatex. Die DKB hat keine Niederlassung in Österreich, die KESt führst du über die Steuererklärung selbst ab."
          },
          "zinsfreiAbStart": {
            "url": "https://dok.dkb.de/pdf/plv_pk_konten.pdf",
            "stand": "20.09.2026",
            "hinweis": "Beleg aus dem deutschen Vergleich, dasselbe Produkt für Kunden in Österreich: Preis- und Leistungsverzeichnis Konten, Stand 15. September 2026: „Guthabenzinsen (variabel) für Guthaben auf dem Girokonto, Girokonto u18 und Basiskonto 0,00% p. a.“ Kunden mit Wohnsitz in Österreich können das Depot laut Programmbeschreibung der DKB bei FinanceQuality eröffnen (Kampagne DKB-Broker, gelesen 23.11.2026)."
          },
          "appIos": {
            "url": "https://www.finanzfluss.de/vergleich/depot/",
            "stand": "14.09.2026",
            "hinweis": "Finanzfluss Depot-Vergleich (Deutschland), App-Bewertung iOS und Android je 4,6 / 5; DKB steht nicht im Österreich-Vergleich von Finanzfluss."
          },
          "halalEtfsFonds": {
            "url": "https://www.finanzfluss.de/informer/etf/ie00b27ycn58/",
            "stand": "07.11.2026",
            "hinweis": "Kaufbar: iShares MSCI World Islamic, Invesco Dow Jones Islamic Global Developed Markets, HANetf Saturna Al-Kawthar Global Focused Equity. Laut deutschem Vergleich kaufbar, dasselbe Depot; Invesco MSCI ACWI Islamic bei der DKB noch nicht bestätigt. In Österreich gezählt wird nur der iShares MSCI World Islamic (IE00B27YCN58): BlackRock Österreich nennt ihn „Zum Vertrieb Zugelassen In … Österreich“ (blackrock.com/at, 23.11.2026). Für die übrigen Halal-ETFs fehlt ein Zulassungsbeleg des Emittenten, sie zählen nicht. Nicht zugelassen laut justETF Österreich: iShares MSCI USA und EM Islamic, alle HSBC-ETFs."
          },
          "halalEdelmetalle": {
            "url": "https://www.finanzfluss.de/informer/etf/xs2115336336/",
            "stand": "07.11.2026",
            "hinweis": "Kaufbar: Royal Mint Physical Gold ETC (XS2115336336). Finanzfluss Informer nennt die DKB (deutscher Vergleich, dasselbe Depot). In Österreich registriert laut HANetf (Registrations: Austria). Die übrigen Edelmetall-ETCs zählen in Österreich erst mit Beleg der Zulassung."
          },
          "royalMint": {
            "url": "https://www.finanzfluss.de/informer/etf/xs2115336336/",
            "stand": "07.11.2026",
            "hinweis": "Kaufbar: Royal Mint Physical Gold ETC (XS2115336336). Finanzfluss Informer nennt die DKB (deutscher Vergleich, dasselbe Depot). In Österreich registriert laut HANetf (Registrations: Austria). Die übrigen Edelmetall-ETCs zählen in Österreich erst mit Beleg der Zulassung."
          }
        },
        "finanzPunkte": {
          "depotgebuehr": 16,
          "etfSparplanProzent": 6,
          "etfSparplanPauschal": 1.333,
          "orderProzent": 3,
          "orderPauschal": 0,
          "mindestsparrate": 1,
          "maximalsparrate": 0.667,
          "intervalle": 2.5,
          "handelsplaetze": 2,
          "kapest": 0,
          "kundenservice": 5,
          "app": 5,
          "abzug": 0
        },
        "halalAnlagenPunkte": {
          "halalEtfsFonds": 1,
          "halalEdelmetalle": 1
        },
        "link": "/out/dkb-depot-at"
      }
    ],
  },
  "etf-sparplan": {
    entwurf: false,
    stand: "23.11.2026",
    quellenHinweis: "Basis: Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026; Sparplan-Angebote für Österreich laut justETF, Stand 11/2026. Eigene Halal-Prüfung mit Anbieter-Belegen.",
    einleitung: ["Hier stehen Depots, in denen der ETF-Sparplan für Kunden in Österreich nichts kostet und Halal-ETFs kaufbar sind.", "Gezählt wird der iShares MSCI World Islamic: Für ihn bestätigt BlackRock die Zulassung in Österreich."],
    kriterien: [{"titel": "Sparplan kostenlos", "text": "Die Ausführung des ETF-Sparplans kostet 0 €, ganz oder bei den großen Fondsgesellschaften. Nur solche Depots stehen hier."}, {"titel": "Ohne Zinsen nutzbar", "text": "Liegt dein Guthaben ohne Zins, oder lassen sich die Zinsen abschalten? Nur mit Beleg des Anbieters steht ein Depot hier."}, {"titel": "Halal-ETF für Österreich", "text": "Kannst du dort den iShares MSCI World Islamic besparen? Für ihn bestätigt BlackRock die Zulassung in Österreich."}],
    reihenfolge: ["traders-place-sparplan-at", "smartbroker-plus-sparplan-at", "trade-republic-sparplan-at"],
    anteilN: {"halalEtfsFonds": 1, "halalSukuk": 1, "halalEdelmetalle": 1},
    anzeige: ANLAGEN_ANZEIGE,
    anbieter: [
      {
        "id": "traders-place-sparplan-at",
        "name": "Traders Place",
        "produkt": "Depot",
        "domain": "tradersplace.de",
        "haus": "traders-place",
        "werte": {
          "zinsfreiAbStart": "gut",
          "halalEtfsFonds": "1 von 1",
          "halalSukuk": "1 von 1",
          "halalEdelmetalle": "1 von 1",
          "depotgebuehr": "0€",
          "orderkosten": "0,95€ je Order unter 500€, ab 500€: 0€",
          "etfSparplanKosten": "0€ bei Amundi, DWS, DJE, Xtrackers, iShares und Vanguard, sonst 0,50€",
          "sparrate": "1€ bis 7.500€",
          "intervalle": "Woche, Zweiwöchentlich, Monat, Zweimonatlich, Quartal, Halbjahr, Jahr",
          "kundenservice": "E-Mail, Telefon, Chat",
          "handelsplaetze": "AT, Europa (ex-AT), USA, Sonstige, OTC",
          "kapest": false,
          "appIos": "4,3 / 5"
        },
        "quellen": {
          "zinsfreiAbStart": {
            "url": "https://tradersplace.de/konditionen/deine-konditionen",
            "stand": "19.09.2026",
            "hinweis": "Beleg aus dem deutschen Vergleich, dasselbe Produkt für Kunden in Österreich: Reiter Kontokonditionen, „Zinssätze Verrechnungskonto … EUR-Verrechnungskonto Guthabenzinssatz 0% p.a. … Fremdwährungs-Verrechnungskonto (USD, CHF, GBP) Guthabenzinssatz 0% p.a.“ / Zinskonto (tradersplace.de/angebot/uebersicht/zinskonto): „Um das Zinskonto zu eröffnen, benötigst du ein Traders Place Depot. Einzahlungen auf das Zinskonto können nur von deinem bestehenden Traders Place Verrechnungskonto erfolgen“"
          },
          "orderkosten": {
            "url": "https://tradersplace.de/konditionen/deine-konditionen",
            "stand": "06.10.2026",
            "hinweis": "Beleg aus dem deutschen Vergleich, dasselbe Produkt für Kunden in Österreich: Handelsplatz gettex: „Gebühr je Order bei Aktien, ETFs, Fonds und Anleihen“ „€ 0,00“, „Gebühr bei Orders unter € 500,- Kurswert“ „€ 0,95“."
          },
          "etfSparplanKosten": {
            "url": "https://tradersplace.de/konditionen/deine-konditionen",
            "stand": "06.10.2026",
            "hinweis": "Beleg aus dem deutschen Vergleich, dasselbe Produkt für Kunden in Österreich: „Sparpläne in ETFs und Fonds unserer Premium Partner Amundi, DWS, DJE, DWS xtrackers, iShares und Vanguard“ „€ 0,00“, „Sonstige Sparpläne in ETFs und Fonds“ „€ 0,50“."
          },
          "kapest": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026: „Steuereinfach in Österreich“ nein. Die KESt führst du über die Steuererklärung selbst ab."
          },
          "appIos": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "handelsplaetze": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "halalEtfsFonds": {
            "url": "https://www.tradersplace.de/wertpapiersuche",
            "stand": "16.10.2026",
            "hinweis": "Kaufbar: iShares MSCI World Islamic, Invesco MSCI ACWI Islamic, Invesco Dow Jones Islamic Global Developed Markets, HANetf Saturna Al-Kawthar Global Focused Equity. Traders Place Wertpapiersuche (deutscher Vergleich, dasselbe Depot). In Österreich gezählt wird nur der iShares MSCI World Islamic (IE00B27YCN58): BlackRock Österreich nennt ihn „Zum Vertrieb Zugelassen In … Österreich“ (blackrock.com/at, 23.11.2026). Für die übrigen Halal-ETFs fehlt ein Zulassungsbeleg des Emittenten, sie zählen nicht. Nicht zugelassen laut justETF Österreich: iShares MSCI USA und EM Islamic, alle HSBC-ETFs."
          },
          "halalSukuk": {
            "url": "https://www.tradersplace.de/wertpapiersuche",
            "stand": "16.10.2026",
            "hinweis": "Kaufbar: iShares USD Sukuk (IE000929U2U9). Traders Place Wertpapiersuche (deutscher Vergleich, dasselbe Depot). In Österreich zugelassen laut BlackRock Österreich; Xtrackers Salam Sukuk laut justETF Österreich nicht zugelassen."
          },
          "halalEdelmetalle": {
            "url": "https://www.tradersplace.de/wertpapiersuche",
            "stand": "04.11.2026",
            "hinweis": "Kaufbar: Royal Mint Physical Gold ETC (XS2115336336). Traders Place Wertpapiersuche (deutscher Vergleich, dasselbe Depot). In Österreich registriert laut HANetf (Registrations: Austria). Die übrigen Edelmetall-ETCs zählen in Österreich erst mit Beleg der Zulassung."
          }
        },
        "finanzPunkte": {
          "depotgebuehr": 16,
          "etfSparplanProzent": 6,
          "etfSparplanPauschal": 4,
          "orderProzent": 3,
          "orderPauschal": 6,
          "mindestsparrate": 3,
          "maximalsparrate": 0.667,
          "intervalle": 2.5,
          "handelsplaetze": 2,
          "kapest": 0,
          "kundenservice": 5,
          "app": 5,
          "abzug": 0
        },
        "halalAnlagenPunkte": {
          "halalEtfsFonds": 1,
          "halalSukuk": 1,
          "halalEdelmetalle": 1
        },
        "link": "/out/traders-place-at"
      },
      {
        "id": "smartbroker-plus-sparplan-at",
        "name": "Smartbroker+",
        "produkt": "Depot",
        "domain": "smartbrokerplus.de",
        "haus": "smartbroker",
        "werte": {
          "zinsfreiAbStart": "gut",
          "halalEtfsFonds": "1 von 1",
          "halalSukuk": "1 von 1",
          "halalEdelmetalle": "1 von 1",
          "depotgebuehr": "0€",
          "orderkosten": "1€ je Order unter 500€, ab 500€: 0€",
          "etfSparplanKosten": "0€",
          "sparrate": "1€ bis 5.000€",
          "intervalle": "Monat, Zweimonatlich, Quartal, Halbjahr, Jahr",
          "kundenservice": "E-Mail, Telefon, Chat",
          "handelsplaetze": "AT, Europa (ex-AT), USA, Sonstige, OTC",
          "kapest": false,
          "appIos": "4,2 / 5"
        },
        "quellen": {
          "zinsfreiAbStart": {
            "url": "https://www.smartbrokerplus.de/de-de/konditionen/",
            "stand": "20.09.2026",
            "hinweis": "Beleg aus dem deutschen Vergleich, dasselbe Produkt für Kunden in Österreich: Konditionen: „Wertpapierverwahrung und Kontoführung (Baader): Depotführung inklusive Nebendepots kostenlos, Kontoführung inklusive Währungskonten kostenlos“; Guthabenzinsen werden nur unter „Zinskonto (Baader)“ genannt: „Zinssatz für Guthaben auf dem Zinskonto 2,25 % p.a.“ / Zinskonto-Seite: „auf das Guthaben auf einem separat zu eröffnendem Zinskonto“"
          },
          "orderkosten": {
            "url": "https://www.smartbrokerplus.de/de-de/konditionen/",
            "stand": "06.10.2026",
            "hinweis": "Beleg aus dem deutschen Vergleich, dasselbe Produkt für Kunden in Österreich: Transaktionspreise, gettex (Aktien, Anleihen, ETFs/ETPs, Fonds): „0 EUR (ab 500 EUR Ordervolumen)“, „1 EUR (bis 499,99 EUR Ordervolumen)“."
          },
          "kapest": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026: „Steuereinfach in Österreich“ nein. Die KESt führst du über die Steuererklärung selbst ab."
          },
          "appIos": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "handelsplaetze": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "halalEtfsFonds": {
            "url": "https://www.smartbrokerplus.de/",
            "stand": "21.10.2026",
            "hinweis": "Kaufbar: iShares MSCI World Islamic, Invesco MSCI ACWI Islamic, Invesco Dow Jones Islamic Global Developed Markets, HANetf Saturna Al-Kawthar Global Focused Equity. Smartbroker+ (deutscher Vergleich, dasselbe Depot). In Österreich gezählt wird nur der iShares MSCI World Islamic (IE00B27YCN58): BlackRock Österreich nennt ihn „Zum Vertrieb Zugelassen In … Österreich“ (blackrock.com/at, 23.11.2026). Für die übrigen Halal-ETFs fehlt ein Zulassungsbeleg des Emittenten, sie zählen nicht. Nicht zugelassen laut justETF Österreich: iShares MSCI USA und EM Islamic, alle HSBC-ETFs."
          },
          "halalSukuk": {
            "url": "https://www.smartbrokerplus.de/api/data/tradeable-assets/?q=IE000929U2U9",
            "stand": "25.09.2026",
            "hinweis": "Kaufbar: iShares USD Sukuk (IE000929U2U9). Smartbroker+ Wertpapierliste (deutscher Vergleich, dasselbe Depot). In Österreich zugelassen laut BlackRock Österreich; Xtrackers Salam Sukuk laut justETF Österreich nicht zugelassen."
          },
          "halalEdelmetalle": {
            "url": "https://www.smartbrokerplus.de/api/data/tradeable-assets/?q=XS2115336336",
            "stand": "04.11.2026",
            "hinweis": "Kaufbar: Royal Mint Physical Gold ETC (XS2115336336). Smartbroker+ Wertpapierliste (deutscher Vergleich, dasselbe Depot). In Österreich registriert laut HANetf (Registrations: Austria). Die übrigen Edelmetall-ETCs zählen in Österreich erst mit Beleg der Zulassung."
          }
        },
        "finanzPunkte": {
          "depotgebuehr": 16,
          "etfSparplanProzent": 6,
          "etfSparplanPauschal": 4,
          "orderProzent": 3,
          "orderPauschal": 6,
          "mindestsparrate": 3,
          "maximalsparrate": 0.667,
          "intervalle": 2.5,
          "handelsplaetze": 2,
          "kapest": 0,
          "kundenservice": 5,
          "app": 5,
          "abzug": 0
        },
        "halalAnlagenPunkte": {
          "halalEtfsFonds": 1,
          "halalSukuk": 1,
          "halalEdelmetalle": 1
        },
        "link": "/out/smartbroker-at"
      },
      {
        "id": "trade-republic-sparplan-at",
        "name": "Trade Republic",
        "produkt": "Depot",
        "domain": "traderepublic.com",
        "haus": "trade-republic",
        "werte": {
          "zinsfreiAbStart": "gut",
          "halalEtfsFonds": "1 von 1",
          "halalSukuk": "1 von 1",
          "halalEdelmetalle": "1 von 1",
          "depotgebuehr": "0 €",
          "orderkosten": "1 € (Wiener Börse 2 €)",
          "etfSparplanKosten": "0 €",
          "sparrate": "1 € bis 10.000 €",
          "intervalle": "Woche, Zweiwöchentlich, Monat, Quartal",
          "handelsplaetze": "AT, Europa (ex-AT), USA, Sonstige, OTC",
          "kapest": true,
          "appIos": "4,4 / 5",
          "kundenservice": "Telefon, Chat"
        },
        "quellen": {
          "depotgebuehr": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "orderkosten": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "etfSparplanKosten": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "sparrate": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "intervalle": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "handelsplaetze": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "kapest": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "appIos": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "kundenservice": {
            "url": "https://www.finanzfluss.de/vergleich/depot-oesterreich/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Depot-Vergleich Österreich, Stand 01.10.2026, gelesen am 23.11.2026"
          },
          "zinsfreiAbStart": {
            "url": "https://traderepublic.com/de-at/zinsen",
            "stand": "23.11.2026",
            "hinweis": "Trade Republic Österreich, Zinsseite: „Aktiviere die Zinsfunktion in der App und erhalte Zinsen auf dein gesamtes Cash.“ und „Ja, du kannst die Zinsen in der App deaktivieren“. Zinsen laufen also erst nach eigener Aktivierung. Anbieter: „Trade Republic Bank GmbH, Branch Austria, Kärntner Ring 5-7, 1010 Wien“."
          },
          "halalEtfsFonds": {
            "url": "https://www.justetf.com/at/etf-profile.html?isin=IE00B27YCN58",
            "stand": "23.11.2026",
            "hinweis": "Kaufbar: iShares MSCI World Islamic, Invesco MSCI ACWI Islamic, Invesco Dow Jones Islamic Global Developed Markets, HANetf Saturna Al-Kawthar Global Focused Equity. justETF Österreich, Sparplan-Angebote für Österreich, Stand 11/2026: Trade Republic bei allen vier (IE00B27YCN58, IE000LFC57H7, IE000UOXRAM8, IE00BMYMHS24). In Österreich gezählt wird nur der iShares MSCI World Islamic (IE00B27YCN58): BlackRock Österreich nennt ihn „Zum Vertrieb Zugelassen In … Österreich“ (blackrock.com/at, 23.11.2026). Für die übrigen Halal-ETFs fehlt ein Zulassungsbeleg des Emittenten, sie zählen nicht. Nicht zugelassen laut justETF Österreich: iShares MSCI USA und EM Islamic, alle HSBC-ETFs."
          },
          "halalSukuk": {
            "url": "https://www.justetf.com/at/etf-profile.html?isin=IE000929U2U9",
            "stand": "23.11.2026",
            "hinweis": "Kaufbar: iShares USD Sukuk (IE000929U2U9). justETF Österreich, Sparplan-Angebote für Österreich, Stand 11/2026: Trade Republic. In Österreich zugelassen laut BlackRock Österreich; Xtrackers Salam Sukuk laut justETF Österreich nicht zugelassen."
          },
          "halalEdelmetalle": {
            "url": "https://www.justetf.com/at/etf-profile.html?isin=XS2115336336",
            "stand": "23.11.2026",
            "hinweis": "Kaufbar: Royal Mint Physical Gold ETC (XS2115336336). justETF Österreich, Sparplan-Angebote für Österreich, Stand 11/2026: Trade Republic. In Österreich registriert laut HANetf (Registrations: Austria). Die übrigen Edelmetall-ETCs zählen in Österreich erst mit Beleg der Zulassung."
          }
        },
        "finanzPunkte": {
          "depotgebuehr": 16,
          "etfSparplanProzent": 6,
          "etfSparplanPauschal": 4,
          "orderProzent": 3,
          "orderPauschal": 4,
          "mindestsparrate": 3,
          "maximalsparrate": 0.667,
          "intervalle": 2.0,
          "handelsplaetze": 2,
          "kapest": 9,
          "kundenservice": 3,
          "app": 5,
          "abzug": 0
        },
        "halalAnlagenPunkte": {
          "halalEtfsFonds": 1,
          "halalSukuk": 1,
          "halalEdelmetalle": 1
        }
      }
    ],
  },
};
