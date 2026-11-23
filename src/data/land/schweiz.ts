/**
 * Schweiz-Version der Vergleiche (DACH1, 23.11.2026). HANDGEPFLEGT, Stand 23.11.2026. Beträge in CHF direkt im Wert, wo die
 * Quelle CHF nennt (Finanzfluss Broker-Vergleich Schweiz, Stand 01.10.2026; Preislisten der Banken). Reihenfolge nach der
 * Rangfolge-Entscheidung DACH1. flatex trägt die Halal-Belege des deutschen Vergleichs (dasselbe Depot, Wohnsitz außerhalb
 * Deutschlands laut flatex möglich). Krypto, Edelmetalle und ETF-Sparplan bleiben „in Vorbereitung“, bis sie belegt sind.
 */
import { leereListe, type LandDaten } from "./typen";

export const SCHWEIZ: LandDaten = {
  "depot": {
    /* Prüfung DACH1 M-3 (23.11.2026): bis flatex-CH-Vergütung, Saxo-Zinssatz und die Lücken geklärt sind „In Vorbereitung“. */
    entwurf: true,
    stand: "23.11.2026",
    quellenHinweis: "Basis: Finanzfluss Broker-Vergleich Schweiz, Stand 01.10.2026, Preise in CHF; eigene Halal-Prüfung mit Anbieter-Belegen. flatex: Halal-Belege des deutschen Vergleichs, dasselbe Depot.",
    einleitung: ["Hier stehen Depots, die du mit Wohnsitz in der Schweiz eröffnen kannst. Die Preise stehen in CHF, wo der Anbieter sie so nennt.", "Für Muslime entscheiden zwei Punkte: Liegt dein Geld ohne Zinsen, und welche Halal-ETFs, Sukuk und Edelmetalle kannst du dort kaufen?"],
    reihenfolge: ["flatex-depot-ch", "saxo-depot-ch", "swissquote-depot-ch"],
    anteilN: {"halalEtfsFonds": 10, "halalSukuk": 1, "halalEdelmetalle": 0},
    anbieter: [
      {
        "id": "flatex-depot-ch",
        "name": "flatex",
        "produkt": "Depot",
        "domain": "flatex.de",
        "haus": "flatex",
        "werte": {
          "zinsfreiAbStart": "gut",
          "halalEtfsFonds": "10 von 10",
          "halalSukuk": "1 von 1",
          "kreditAbStart": "teils",
          "depotgebuehr": "0 CHF",
          "orderkosten": "5,90 CHF an der SIX",
          "etfSparplanKosten": "0 %",
          "sparrate": "ab 25 CHF",
          "intervalle": "Monat, Quartal, Halbjahr, Jahr",
          "handelsplaetze": "CH, EU, USA, OTC",
          "appIos": "4,4 / 5",
          "kundenservice": "Telefon, Chat"
        },
        "quellen": {
          "zinsfreiAbStart": {
            "url": "https://konto.flatex.de/formularcenter_bank/public/1300100.pdf",
            "stand": "20.09.2026",
            "hinweis": "Beleg aus dem deutschen Vergleich, dasselbe Produkt für Kunden in der Schweiz: Preis- und Leistungsverzeichnis gültig ab 24.08.2026, „Cash-Konto Zinssätze … Guthabenzins 0,00 % p. a. (freibleibend)“ / Fremdwährungskonto (flatex.de FAQ): „Die Eröffnung geht ganz einfach über Ihre flatex classic unter Service > Service > Fremdwährungskonto anlegen.“ Wertpapierkredit (flatex.de/produkte-handel/produkte/wertpapierkredite, gelesen 12.10.2026): „Kreditvergabe: Für Neukunden mit Kontoeröffnung automatisch; eine Antragstellung ist nicht notwendig.“ „Zinsberechnung: quartalsweise nachträglich auf die Inanspruchnahme“. „Ablehnung: Wenn Sie auf die Vorteile des problemlosen und sofort frei verfügbaren Dispositionsrahmens verzichten möchten, teilen Sie uns dies bitte in Textform mit.“ Wohnsitz außerhalb Deutschlands: „Selbstverständlich funktioniert dies auch mit Wohnsitz außerhalb Deutschlands.“ (flatex.de, FAQ Kontoeröffnung aus dem Ausland, gelesen 23.11.2026)."
          },
          "halalEtfsFonds": {
            "url": "https://www.flatex.de/produkte-handel/produkte/etfs/ergebnisse/",
            "stand": "07.10.2026",
            "hinweis": "Beleg aus dem deutschen Vergleich, dasselbe Depot: alle zehn Halal-ETFs der Liste kaufbar (flatex.de ETF-Suche). In der Schweiz zugelassen laut justETF Schweiz (Stand 11/2026): die zehn Halal-ETFs unserer Liste. Comgest und Franklin sind Fonds und hier nicht geprüft."
          },
          "halalSukuk": {
            "url": "https://www.flatex.de/",
            "stand": "07.10.2026",
            "hinweis": "Beleg aus dem deutschen Vergleich, dasselbe Depot: iShares USD Sukuk (IE000929U2U9) kaufbar. In der Schweiz zugelassen laut justETF Schweiz, Xtrackers Salam Sukuk nicht."
          },
          "kreditAbStart": {
            "url": "https://www.flatex.de/produkte-handel/produkte/wertpapierkredite/",
            "stand": "12.10.2026",
            "hinweis": "Beleg aus dem deutschen Vergleich, dasselbe Produkt für Kunden in der Schweiz: flatex.de, Wertpapierkredite, gelesen 12.10.2026: „Kreditvergabe: Für Neukunden mit Kontoeröffnung automatisch; eine Antragstellung ist nicht notwendig.“ „Zinsberechnung: quartalsweise nachträglich auf die Inanspruchnahme“. „Ablehnung: Wenn Sie auf die Vorteile des problemlosen und sofort frei verfügbaren Dispositionsrahmens verzichten möchten, teilen Sie uns dies bitte in Textform mit.“"
          },
          "depotgebuehr": {
            "url": "https://www.finanzfluss.de/vergleich/broker-schweiz/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Broker-Vergleich Schweiz, Stand 01.10.2026, gelesen am 23.11.2026, Preise in CHF"
          },
          "orderkosten": {
            "url": "https://www.finanzfluss.de/vergleich/broker-schweiz/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Broker-Vergleich Schweiz, Stand 01.10.2026, gelesen am 23.11.2026, Preise in CHF"
          },
          "etfSparplanKosten": {
            "url": "https://www.finanzfluss.de/vergleich/broker-schweiz/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Broker-Vergleich Schweiz, Stand 01.10.2026, gelesen am 23.11.2026, Preise in CHF"
          },
          "sparrate": {
            "url": "https://www.finanzfluss.de/vergleich/broker-schweiz/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Broker-Vergleich Schweiz, Stand 01.10.2026, gelesen am 23.11.2026, Preise in CHF"
          },
          "intervalle": {
            "url": "https://www.finanzfluss.de/vergleich/broker-schweiz/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Broker-Vergleich Schweiz, Stand 01.10.2026, gelesen am 23.11.2026, Preise in CHF"
          },
          "handelsplaetze": {
            "url": "https://www.finanzfluss.de/vergleich/broker-schweiz/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Broker-Vergleich Schweiz, Stand 01.10.2026, gelesen am 23.11.2026, Preise in CHF"
          },
          "appIos": {
            "url": "https://www.finanzfluss.de/vergleich/broker-schweiz/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Broker-Vergleich Schweiz, Stand 01.10.2026, gelesen am 23.11.2026, Preise in CHF"
          },
          "kundenservice": {
            "url": "https://www.finanzfluss.de/vergleich/broker-schweiz/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Broker-Vergleich Schweiz, Stand 01.10.2026, gelesen am 23.11.2026, Preise in CHF"
          }
        },
        "finanzPunkte": {
          "depotgebuehr": 16,
          "etfSparplanProzent": 6,
          "etfSparplanPauschal": 4,
          "orderProzent": 3,
          "orderPauschal": 0,
          "mindestsparrate": 1,
          "maximalsparrate": 0,
          "intervalle": 2.0,
          "handelsplaetze": 2,
          "kapest": 0,
          "kundenservice": 3,
          "app": 5,
          "abzug": 0
        },
        "halalAnlagenPunkte": {
          "halalEtfsFonds": 10,
          "halalSukuk": 1
        }
      },
      {
        "id": "saxo-depot-ch",
        "name": "Saxo",
        "produkt": "Online Trading",
        "domain": "home.saxo",
        "haus": "saxo-ch",
        "werte": {
          "zinsfreiAbStart": null,
          "halalEtfsFonds": "mind. 1 von 10",
          "halalSukuk": null,
          "depotgebuehr": "0 CHF",
          "orderkosten": "0,08 %, mindestens 3 CHF",
          "etfSparplanKosten": "0 %",
          "sparrate": "ab 0,01 CHF",
          "intervalle": "Monat",
          "handelsplaetze": "CH, EU, USA, Sonstige",
          "appIos": "4,3 / 5",
          "kundenservice": "Telefon, Chat"
        },
        "quellen": {
          "depotgebuehr": {
            "url": "https://www.finanzfluss.de/vergleich/broker-schweiz/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Broker-Vergleich Schweiz, Stand 01.10.2026, gelesen am 23.11.2026, Preise in CHF"
          },
          "orderkosten": {
            "url": "https://www.finanzfluss.de/vergleich/broker-schweiz/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Broker-Vergleich Schweiz, Stand 01.10.2026, gelesen am 23.11.2026, Preise in CHF"
          },
          "etfSparplanKosten": {
            "url": "https://www.finanzfluss.de/vergleich/broker-schweiz/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Broker-Vergleich Schweiz, Stand 01.10.2026, gelesen am 23.11.2026, Preise in CHF"
          },
          "sparrate": {
            "url": "https://www.finanzfluss.de/vergleich/broker-schweiz/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Broker-Vergleich Schweiz, Stand 01.10.2026, gelesen am 23.11.2026, Preise in CHF"
          },
          "intervalle": {
            "url": "https://www.finanzfluss.de/vergleich/broker-schweiz/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Broker-Vergleich Schweiz, Stand 01.10.2026, gelesen am 23.11.2026, Preise in CHF"
          },
          "handelsplaetze": {
            "url": "https://www.finanzfluss.de/vergleich/broker-schweiz/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Broker-Vergleich Schweiz, Stand 01.10.2026, gelesen am 23.11.2026, Preise in CHF"
          },
          "appIos": {
            "url": "https://www.finanzfluss.de/vergleich/broker-schweiz/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Broker-Vergleich Schweiz, Stand 01.10.2026, gelesen am 23.11.2026, Preise in CHF"
          },
          "kundenservice": {
            "url": "https://www.finanzfluss.de/vergleich/broker-schweiz/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Broker-Vergleich Schweiz, Stand 01.10.2026, gelesen am 23.11.2026, Preise in CHF"
          },
          "halalEtfsFonds": {
            "url": "https://www.home.saxo/de-ch/rates-and-conditions/autoinvest-etf-list",
            "stand": "23.11.2026",
            "hinweis": "Saxo Schweiz, AutoInvest-ETF-Liste: „iShares MSCI World Islamic UCITS ETF“, Ticker ISWD (passt zur SIX-Notierung von IE00B27YCN58). Die übrigen Halal-ETFs: noch nicht geprüft. In der Schweiz zugelassen laut justETF Schweiz (Stand 11/2026): die zehn Halal-ETFs unserer Liste. Comgest und Franklin sind Fonds und hier nicht geprüft."
          }
        },
        "finanzPunkte": {
          "depotgebuehr": 16,
          "etfSparplanProzent": 6,
          "etfSparplanPauschal": 4,
          "orderProzent": 1.5,
          "orderPauschal": 6,
          "mindestsparrate": 3,
          "maximalsparrate": 0,
          "intervalle": 0.5,
          "handelsplaetze": 2,
          "kapest": 0,
          "kundenservice": 3,
          "app": 5,
          "abzug": 0
        },
        "halalAnlagenPunkte": {
          "halalEtfsFonds": 1
        }
      },
      {
        "id": "swissquote-depot-ch",
        "name": "Swissquote",
        "produkt": "Trading-Konto",
        "domain": "swissquote.com",
        "haus": "swissquote",
        "werte": {
          "zinsfreiAbStart": "gut",
          "halalEtfsFonds": null,
          "halalSukuk": null,
          "depotgebuehr": "86 CHF",
          "orderkosten": "5 CHF an der SIX",
          "etfSparplanKosten": "0 %",
          "sparrate": "ab 50 CHF",
          "intervalle": "Tag, Woche, Zweiwöchentlich, Monat",
          "handelsplaetze": "CH, EU, USA, Sonstige",
          "appIos": "4,3 / 5",
          "kundenservice": "Telefon, Chat"
        },
        "quellen": {
          "depotgebuehr": {
            "url": "https://www.finanzfluss.de/vergleich/broker-schweiz/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Broker-Vergleich Schweiz, Stand 01.10.2026, gelesen am 23.11.2026, Preise in CHF"
          },
          "orderkosten": {
            "url": "https://www.finanzfluss.de/vergleich/broker-schweiz/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Broker-Vergleich Schweiz, Stand 01.10.2026, gelesen am 23.11.2026, Preise in CHF"
          },
          "etfSparplanKosten": {
            "url": "https://www.finanzfluss.de/vergleich/broker-schweiz/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Broker-Vergleich Schweiz, Stand 01.10.2026, gelesen am 23.11.2026, Preise in CHF"
          },
          "sparrate": {
            "url": "https://www.finanzfluss.de/vergleich/broker-schweiz/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Broker-Vergleich Schweiz, Stand 01.10.2026, gelesen am 23.11.2026, Preise in CHF"
          },
          "intervalle": {
            "url": "https://www.finanzfluss.de/vergleich/broker-schweiz/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Broker-Vergleich Schweiz, Stand 01.10.2026, gelesen am 23.11.2026, Preise in CHF"
          },
          "handelsplaetze": {
            "url": "https://www.finanzfluss.de/vergleich/broker-schweiz/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Broker-Vergleich Schweiz, Stand 01.10.2026, gelesen am 23.11.2026, Preise in CHF"
          },
          "appIos": {
            "url": "https://www.finanzfluss.de/vergleich/broker-schweiz/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Broker-Vergleich Schweiz, Stand 01.10.2026, gelesen am 23.11.2026, Preise in CHF"
          },
          "kundenservice": {
            "url": "https://www.finanzfluss.de/vergleich/broker-schweiz/",
            "stand": "23.11.2026",
            "hinweis": "Finanzfluss Broker-Vergleich Schweiz, Stand 01.10.2026, gelesen am 23.11.2026, Preise in CHF"
          },
          "zinsfreiAbStart": {
            "url": "https://www.swissquote.com/de-ch/private/bank/pricing/interest-rates",
            "stand": "23.11.2026",
            "hinweis": "Swissquote, Zinssätze: Bareinlagen in CHF, EUR und USD in allen Stufen „0%“."
          }
        },
        "finanzPunkte": {
          "depotgebuehr": 0,
          "etfSparplanProzent": 6,
          "etfSparplanPauschal": 4,
          "orderProzent": 3,
          "orderPauschal": 2,
          "mindestsparrate": 0,
          "maximalsparrate": 0,
          "intervalle": 2.0,
          "handelsplaetze": 2,
          "kapest": 0,
          "kundenservice": 3,
          "app": 5,
          "abzug": 0
        },
        "halalAnlagenPunkte": {}
      }
    ],
  },
  "girokonto": {
    /* Prüfung DACH1 M-3 (23.11.2026): bis flatex-CH-Vergütung, Saxo-Zinssatz und die Lücken geklärt sind „In Vorbereitung“. */
    entwurf: true,
    stand: "23.11.2026",
    quellenHinweis: "Basis: Preislisten und Bedingungen der Banken für die Schweiz, gelesen am 23.11.2026. Eigene Halal-Prüfung mit Anbieter-Belegen.",
    einleitung: ["Hier stehen Privatkonten, die du mit Wohnsitz in der Schweiz eröffnen kannst.", "Für Muslime entscheiden drei Punkte: Liegt dein Geld ohne Zinsen, gibt es keinen Überzug ab Start, und kommt die Karte ohne Kreditrahmen?"],
    reihenfolge: ["n26-standard-ch", "neon-free-ch", "migros-bank-privatkonto-ch", "ubs-privatkonto-easy-ch", "revolut-standard-ch"],
    anbieter: [
      {
        "id": "n26-standard-ch",
        "name": "N26",
        "produkt": "Standard",
        "domain": "n26.com",
        "haus": "n26-ch",
        "link": "/out/n26-ch",
        "werte": {
          "zinsfreiAbStart": "gut",
          "keinDispoAbStart": "gut",
          "karteOhneKredit": "gut",
          "kontofuehrung": "0 € (Konto in Euro)",
          "debitkarte": "Mastercard, 0 €",
          "applePay": null,
          "abhebungen": "2 in Euro im Monat",
          "bargeldEinzahlen": null,
          "auslandAbheben": null,
          "auslandFremdAbheben": null,
          "auslandFremdZahlen": "0 €",
          "sepaKostenlos": true,
          "kundenservice": null,
          "filialen": false,
          "appIos": null
        },
        "quellen": {
          "zinsfreiAbStart": {
            "url": "https://docs.n26.com/legal/06+EU/01+Account/en/03account-terms-and-conditions-en.pdf",
            "stand": "23.11.2026",
            "hinweis": "Allgemeine Geschäftsbedingungen „N26 current account“, Version 3.0 vom 19.06.2026, verlinkt auf n26.com/de-ch: „You will not receive any interest on the account balance.“"
          },
          "keinDispoAbStart": {
            "url": "https://docs.n26.com/legal/06+EU/01+Account/en/03account-terms-and-conditions-en.pdf",
            "stand": "23.11.2026",
            "hinweis": "AGB N26 current account, 2.3: „The account is managed as credit account.“ und „an overdraft credit contract subject to your credit rating can also be concluded with us separately.“ Ein Dispo gibt es also nur mit eigenem Vertrag."
          },
          "karteOhneKredit": {
            "url": "https://docs.n26.com/legal/06+EU/01+Account/en/03account-terms-and-conditions-en.pdf",
            "stand": "23.11.2026",
            "hinweis": "AGB N26 current account, 2.1: „provision of a virtual N26 MasterCard“, die Karte bucht vom Guthaben ab."
          },
          "kontofuehrung": {
            "url": "https://docs.n26.com/legal/06+EU/01+Account/en/13account-pricelist-en.pdf",
            "stand": "23.11.2026",
            "hinweis": "N26 Preisliste für Kunden mit Adresse unter anderem in der Schweiz, Version 4.0 vom 26.06.2026: „N26 Account Free“. Das Konto läuft in Euro (n26.com/de-ch: „Eröffne dein Eurokonto“)."
          },
          "debitkarte": {
            "url": "https://docs.n26.com/legal/06+EU/01+Account/en/13account-pricelist-en.pdf",
            "stand": "23.11.2026",
            "hinweis": "N26 Preisliste Schweiz: Plastikkarte 10,00 €, virtuelle Karte im Konto enthalten."
          },
          "abhebungen": {
            "url": "https://docs.n26.com/legal/06+EU/01+Account/en/13account-pricelist-en.pdf",
            "stand": "23.11.2026",
            "hinweis": "N26 Preisliste Schweiz: „Customers with a N26 standard … account 2 free ATM withdrawals per calendar month, 2.00 € per additional withdrawal“ (Abhebungen in Euro)."
          },
          "auslandFremdZahlen": {
            "url": "https://docs.n26.com/legal/06+EU/01+Account/en/13account-pricelist-en.pdf",
            "stand": "23.11.2026",
            "hinweis": "N26 Preisliste Schweiz: „Cashless payments with Mastercard & Maestro Card in all currencies around the world Free … without foreign currency surcharge“."
          },
          "sepaKostenlos": {
            "url": "https://docs.n26.com/legal/06+EU/01+Account/en/13account-pricelist-en.pdf",
            "stand": "23.11.2026",
            "hinweis": "N26 Preisliste Schweiz: „Transfers within and among EEA states and to Switzerland in … Free“."
          },
          "filialen": {
            "url": "https://n26.com/de-ch",
            "stand": "23.11.2026",
            "hinweis": "N26 Schweiz: „N26 ist die erste 100 % mobile Bank“."
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
          "support": 0,
          "kontowechsel": 0,
          "app": 0,
          "ident": 0,
          "ohneBedingung": 4,
          "ausland": 4.0,
          "abzug": 0
        }
      },
      {
        "id": "neon-free-ch",
        "name": "neon",
        "produkt": "free",
        "domain": "neon-free.ch",
        "haus": "neon",
        "werte": {
          "zinsfreiAbStart": "gut",
          "keinDispoAbStart": null,
          "karteOhneKredit": "gut",
          "kontofuehrung": "0 CHF",
          "debitkarte": "Debit Mastercard",
          "applePay": true,
          "abhebungen": "2,50 CHF je Bezug, gratis an Kassen von Coop, ALDI und LIDL",
          "bargeldEinzahlen": null,
          "auslandAbheben": null,
          "auslandFremdAbheben": null,
          "auslandFremdZahlen": null,
          "sepaKostenlos": null,
          "kundenservice": null,
          "filialen": null,
          "appIos": null
        },
        "quellen": {
          "zinsfreiAbStart": {
            "url": "https://www.neon-free.ch/media/neon_dienstleistungspreise_de.pdf",
            "stand": "23.11.2026",
            "hinweis": "neon Dienstleistungspreise, Stand 01.10.2026: „Zins auf Guthaben 0% 0% 0% 0%“ (alle Pläne)."
          },
          "karteOhneKredit": {
            "url": "https://www.neon-free.ch/media/neon_dienstleistungspreise_de.pdf",
            "stand": "23.11.2026",
            "hinweis": "neon Dienstleistungspreise: Debit Mastercard."
          },
          "kontofuehrung": {
            "url": "https://www.neon-free.ch/media/neon_dienstleistungspreise_de.pdf",
            "stand": "23.11.2026",
            "hinweis": "neon Dienstleistungspreise: neon free 0 CHF, Konto ab 15 Jahren mit Wohnsitz in der Schweiz."
          },
          "debitkarte": {
            "url": "https://www.neon-free.ch/media/neon_dienstleistungspreise_de.pdf",
            "stand": "23.11.2026",
            "hinweis": "neon Dienstleistungspreise: Debit Mastercard inklusive."
          },
          "applePay": {
            "url": "https://www.neon-free.ch/media/neon_dienstleistungspreise_de.pdf",
            "stand": "23.11.2026",
            "hinweis": "neon: Apple Pay, Google Pay und Samsung Pay."
          },
          "abhebungen": {
            "url": "https://www.neon-free.ch/media/neon_dienstleistungspreise_de.pdf",
            "stand": "23.11.2026",
            "hinweis": "neon Dienstleistungspreise, free: am Automaten 2,50 CHF je Bezug, gratis an den Kassen von Coop, ALDI und LIDL."
          }
        },
        "finanzPunkte": {
          "kontofuehrung": 15,
          "bankkarte": 10,
          "girocard": 0,
          "debitkarte": 5,
          "abheben": 2.5,
          "einzahlen": 0,
          "mobilesBezahlen": 8,
          "sepa": 0,
          "support": 0,
          "kontowechsel": 0,
          "app": 0,
          "ident": 0,
          "ohneBedingung": 4,
          "ausland": 0.0,
          "abzug": 0
        }
      },
      {
        "id": "migros-bank-privatkonto-ch",
        "name": "Migros Bank",
        "produkt": "Privatkonto",
        "domain": "migrosbank.ch",
        "haus": "migros-bank",
        "werte": {
          "zinsfreiAbStart": "gut",
          "keinDispoAbStart": null,
          "karteOhneKredit": "gut",
          "kontofuehrung": "0 CHF ab 25 Jahren",
          "debitkarte": "Visa Debit",
          "applePay": true,
          "abhebungen": "gratis an über 1.700 Standorten",
          "bargeldEinzahlen": null,
          "auslandAbheben": null,
          "auslandFremdAbheben": null,
          "auslandFremdZahlen": null,
          "sepaKostenlos": null,
          "kundenservice": null,
          "filialen": null,
          "appIos": null
        },
        "quellen": {
          "zinsfreiAbStart": {
            "url": "https://www.migrosbank.ch/de/privatpersonen/konten-karten/konten/privatkonto.html",
            "stand": "23.11.2026",
            "hinweis": "Migros Bank, Privatkonto: „Privatkonto CHF: 0,000%“."
          },
          "karteOhneKredit": {
            "url": "https://www.migrosbank.ch/de/privatpersonen/konten-karten/konten/privatkonto.html",
            "stand": "23.11.2026",
            "hinweis": "Migros Bank, Privatkonto: Visa Debit als Standardkarte, eine Kreditkarte nur auf Wunsch."
          },
          "kontofuehrung": {
            "url": "https://www.migrosbank.ch/de/privatpersonen/konten-karten/konten/privatkonto.html",
            "stand": "23.11.2026",
            "hinweis": "Migros Bank, Privatkonto: „Kostenlose Kontoführung“ ab 25 Jahren."
          },
          "debitkarte": {
            "url": "https://www.migrosbank.ch/de/privatpersonen/konten-karten/konten/privatkonto.html",
            "stand": "23.11.2026",
            "hinweis": "Migros Bank, Privatkonto: Visa Debit."
          },
          "applePay": {
            "url": "https://www.migrosbank.ch/de/privatpersonen/konten-karten/konten/privatkonto.html",
            "stand": "23.11.2026",
            "hinweis": "Migros Bank: Apple Pay, Google Pay, Samsung Pay und TWINT."
          },
          "abhebungen": {
            "url": "https://www.migrosbank.ch/de/privatpersonen/konten-karten/konten/privatkonto.html",
            "stand": "23.11.2026",
            "hinweis": "Migros Bank: Bargeld gratis an über 1.700 Standorten."
          }
        },
        "finanzPunkte": {
          "kontofuehrung": 15,
          "bankkarte": 10,
          "girocard": 0,
          "debitkarte": 5,
          "abheben": 2.5,
          "einzahlen": 0,
          "mobilesBezahlen": 8,
          "sepa": 0,
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
        "id": "ubs-privatkonto-easy-ch",
        "name": "UBS",
        "produkt": "Privatkonto Easy",
        "domain": "ubs.com",
        "haus": "ubs",
        "werte": {
          "zinsfreiAbStart": "gut",
          "keinDispoAbStart": "gut",
          "karteOhneKredit": "gut",
          "kontofuehrung": "0 CHF (Eröffnung nur in der App)",
          "debitkarte": "UBS Debitkarte, 0 CHF",
          "applePay": null,
          "abhebungen": "gratis an UBS-Bancomaten in CHF",
          "bargeldEinzahlen": null,
          "auslandAbheben": null,
          "auslandFremdAbheben": null,
          "auslandFremdZahlen": null,
          "sepaKostenlos": null,
          "kundenservice": null,
          "filialen": null,
          "appIos": null
        },
        "quellen": {
          "zinsfreiAbStart": {
            "url": "https://www.ubs.com/ch/de/services/accounts-and-cards/interest-rates-privates.html",
            "stand": "23.11.2026",
            "hinweis": "UBS Zinssätze für Privatkunden, gültig ab 24.06.2026: „UBS Privatkonto CHF 0,000%“, dazu „Je nach Zinssituation und Höhe der Guthaben kann eine Guthabengebühr anfallen (aktuell 0,000%).“ Wortlaut per WebFetch gelesen, ubs.com sperrt direkte Abrufe."
          },
          "keinDispoAbStart": {
            "url": "https://www.ubs.com/content/dam/ubs/ch/swissbank/private/zahlen-und-sparen/konten/dienstleistungen-und-preise.pdf",
            "stand": "23.11.2026",
            "hinweis": "UBS Dienstleistungen und Preise, gültig ab 23.09.2026: „Kontoüberziehung: mit Einverständnis der Bank möglich“. Ein Überzug wird also nicht von selbst eingeräumt."
          },
          "karteOhneKredit": {
            "url": "https://www.ubs.com/content/dam/ubs/ch/swissbank/private/zahlen-und-sparen/konten/dienstleistungen-und-preise.pdf",
            "stand": "23.11.2026",
            "hinweis": "UBS Dienstleistungen und Preise, gültig ab 23.09.2026: „UBS Debitkarte“, eine Kreditkarte nur separat dazubuchbar."
          },
          "kontofuehrung": {
            "url": "https://www.ubs.com/content/dam/ubs/ch/swissbank/private/zahlen-und-sparen/konten/dienstleistungen-und-preise.pdf",
            "stand": "23.11.2026",
            "hinweis": "UBS Dienstleistungen und Preise, gültig ab 23.09.2026: „UBS Privatkonto Easy“ und Paket Easy „Kostenlos“, Eröffnung nur über die Mobile Banking App."
          },
          "debitkarte": {
            "url": "https://www.ubs.com/content/dam/ubs/ch/swissbank/private/zahlen-und-sparen/konten/dienstleistungen-und-preise.pdf",
            "stand": "23.11.2026",
            "hinweis": "UBS Dienstleistungen und Preise, gültig ab 23.09.2026: UBS Debitkarte im Paket Easy kostenlos."
          },
          "abhebungen": {
            "url": "https://www.ubs.com/content/dam/ubs/ch/swissbank/private/zahlen-und-sparen/konten/dienstleistungen-und-preise.pdf",
            "stand": "23.11.2026",
            "hinweis": "UBS Dienstleistungen und Preise, gültig ab 23.09.2026: „UBS Bancomaten in CHF: Kostenlos“."
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
          "sepa": 0,
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
        "id": "revolut-standard-ch",
        "name": "Revolut",
        "produkt": "Standard",
        "domain": "revolut.com",
        "haus": "revolut-ch",
        "werte": {
          "zinsfreiAbStart": "gut",
          "keinDispoAbStart": "gut",
          "karteOhneKredit": null,
          "kontofuehrung": "0 CHF",
          "debitkarte": null,
          "applePay": null,
          "abhebungen": "5 Bezüge oder 200 CHF im Monat ohne Gebühr",
          "bargeldEinzahlen": null,
          "auslandAbheben": null,
          "auslandFremdAbheben": null,
          "auslandFremdZahlen": null,
          "sepaKostenlos": null,
          "kundenservice": null,
          "filialen": null,
          "appIos": null
        },
        "quellen": {
          "zinsfreiAbStart": {
            "url": "https://cdn.revolut.com/terms_and_conditions/pdf/allgemeine_gesch_ftsbedingungen_f_r_privatkunden_f_r_schweizer_kunden_der_revolut_bank_uab_c4927da5_1.4.0_1790846276_de.pdf",
            "stand": "23.11.2026",
            "hinweis": "Revolut AGB für Schweizer Kunden der Revolut Bank UAB: „Auf die Einlagen auf deinem Girokonto zahlen wir keine Zinsen.“ Einlagensicherung über Litauen."
          },
          "keinDispoAbStart": {
            "url": "https://cdn.revolut.com/terms_and_conditions/pdf/allgemeine_gesch_ftsbedingungen_f_r_privatkunden_f_r_schweizer_kunden_der_revolut_bank_uab_c4927da5_1.4.0_1790846276_de.pdf",
            "stand": "23.11.2026",
            "hinweis": "Revolut AGB für Schweizer Kunden: „Dein Konto verfügt über keine Überziehungsmöglichkeit.“"
          },
          "kontofuehrung": {
            "url": "https://cdn.revolut.com/terms_and_conditions/pdf/geb_hren_f_r_privatkunden_standard_f_r_schweizer_kunden_der_revolut_bank_uab_59eb6320_2.0.0_1761212457_de.pdf",
            "stand": "23.11.2026",
            "hinweis": "Revolut Gebühren für Schweizer Kunden, Standard: „Abonnementgebühr: Kostenlos.“"
          },
          "abhebungen": {
            "url": "https://cdn.revolut.com/terms_and_conditions/pdf/geb_hren_f_r_privatkunden_standard_f_r_schweizer_kunden_der_revolut_bank_uab_59eb6320_2.0.0_1761212457_de.pdf",
            "stand": "23.11.2026",
            "hinweis": "Revolut Gebühren für Schweizer Kunden, Standard: „bis zu 5 Abhebungen am Geldautomaten oder CHF 200“ ohne Gebühr, danach 2 %, mindestens CHF 1."
          }
        },
        "finanzPunkte": {
          "kontofuehrung": 15,
          "bankkarte": 0,
          "girocard": 0,
          "debitkarte": 0,
          "abheben": 2.5,
          "einzahlen": 0,
          "mobilesBezahlen": 0,
          "sepa": 0,
          "support": 0,
          "kontowechsel": 0,
          "app": 0,
          "ident": 0,
          "ohneBedingung": 4,
          "ausland": 0.0,
          "abzug": 0
        }
      }
    ],
  },
  krypto: leereListe(),
  edelmetalle: leereListe(),
  "etf-sparplan": leereListe(),
};
