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
          "halalEtfsFonds": "1 von 10 bestätigt",
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
          "applePay": true,
          "abhebungen": "2 in Euro im Monat",
          "bargeldEinzahlen": null,
          "auslandAbheben": "2 frei im Monat, danach 2 €",
          "auslandFremdAbheben": "1,7 %",
          "auslandFremdZahlen": "0 €",
          "sepaKostenlos": true,
          "kundenservice": "Chat",
          "filialen": false,
          "appIos": "4,7 / 5"
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
          },
          "applePay": {
            "url": "https://n26.com/de-ch/kostenloses-girokonto",
            "stand": "25.11.2026",
            "hinweis": "N26 Schweiz, Standard: „Verknüpfe sie mit Apple Pay, Google Pay oder Garmin Pay, um in Geschäften kontaktlos per Smartphone zu bezahlen.“"
          },
          "auslandAbheben": {
            "url": "https://docs.n26.com/legal/06+EU/01+Account/en/13account-pricelist-en.pdf",
            "stand": "25.11.2026",
            "hinweis": "N26 Preisliste für Kunden mit Adresse unter anderem in der Schweiz, Version 4.0 vom 26.06.2026: „Mastercard withdrawals at ATMs in EUR … Customers with a N26 standard … account 2 free ATM withdrawals per calendar month, 2.00 € per additional withdrawal“."
          },
          "auslandFremdAbheben": {
            "url": "https://docs.n26.com/legal/06+EU/01+Account/en/13account-pricelist-en.pdf",
            "stand": "25.11.2026",
            "hinweis": "N26 Preisliste Schweiz, Version 4.0 vom 26.06.2026: „Mastercard withdrawals at ATMs in other currencies: … For Business, Current Account, N26 Smart, N26 Business Smart 1.7% of amount drawn“."
          },
          "kundenservice": {
            "url": "https://n26.com/de-ch/kostenloses-girokonto",
            "stand": "25.11.2026",
            "hinweis": "N26 Schweiz, Standard: „Erhalte rund um die Uhr Support via Chat“."
          },
          "appIos": {
            "url": "https://apps.apple.com/ch/app/n26-love-your-bank/id956857223",
            "stand": "25.11.2026",
            "hinweis": "App Store Schweiz, App „N26: Love your bank“ (N26 SE), Bewertung 4,72 von 5 aus 4.784 Bewertungen, abgerufen am 25.11.2026 über die öffentliche iTunes-Suche von Apple."
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
          "sepa": 10,
          "support": 2.5,
          "kontowechsel": 0,
          "app": 2,
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
          "bargeldEinzahlen": "nicht möglich",
          "auslandAbheben": "1,5 % des Betrags, dazu 0,35 % Wechselkurs",
          "auslandFremdAbheben": "1,5 % des Betrags, dazu 0,35 % Wechselkurs",
          "auslandFremdZahlen": "0,35 % Wechselkurs",
          "sepaKostenlos": true,
          "kundenservice": null,
          "filialen": null,
          "appIos": "4,5 / 5"
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
          },
          "bargeldEinzahlen": {
            "url": "https://www.neon-free.ch/media/neon_dienstleistungspreise_de.pdf",
            "stand": "25.11.2026",
            "hinweis": "neon Dienstleistungspreise, Stand 1. Oktober 2026, Zahlungen: „Bargeldeinzahlung Nicht möglich“ (alle Pläne)."
          },
          "auslandAbheben": {
            "url": "https://www.neon-free.ch/media/neon_dienstleistungspreise_de.pdf",
            "stand": "25.11.2026",
            "hinweis": "neon Dienstleistungspreise, Stand 1. Oktober 2026, neon Debit Mastercard, free: „Abhebung Ausland 1.5% auf den Betrag“, „Gebühr unabhängig von Währung. Für neon free: zusätzlich Wechselkursaufschlag.“ Wechselkurs free: „0.35%“."
          },
          "auslandFremdAbheben": {
            "url": "https://www.neon-free.ch/media/neon_dienstleistungspreise_de.pdf",
            "stand": "25.11.2026",
            "hinweis": "neon Dienstleistungspreise, Stand 1. Oktober 2026, neon Debit Mastercard, free: „Abhebung Ausland 1.5% auf den Betrag“, dazu Wechselkurs „0.35%“."
          },
          "auslandFremdZahlen": {
            "url": "https://www.neon-free.ch/media/neon_dienstleistungspreise_de.pdf",
            "stand": "25.11.2026",
            "hinweis": "neon Dienstleistungspreise, Stand 1. Oktober 2026, neon Debit Mastercard, free: „Einkauf Ausland“ ohne Gebühr, „Wechselkurs 0.35%“."
          },
          "sepaKostenlos": {
            "url": "https://www.neon-free.ch/media/neon_dienstleistungspreise_de.pdf",
            "stand": "25.11.2026",
            "hinweis": "neon Dienstleistungspreise, Stand 1. Oktober 2026, Zahlungen: „IBAN-Überweisung Inland CHF“ ohne Gebühr (alle Pläne); in EUR „Keine Bearbeitungsgebühr; 1,5% Wechselkursaufschlag“."
          },
          "appIos": {
            "url": "https://apps.apple.com/ch/app/neon-die-schweizer-finanz-app/id1387883068",
            "stand": "25.11.2026",
            "hinweis": "App Store Schweiz, App „neon: Die Schweizer Finanz-App“ (neon Switzerland AG), Bewertung 4,51 von 5 aus 7.925 Bewertungen, abgerufen am 25.11.2026 über die öffentliche iTunes-Suche von Apple."
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
          "sepa": 10,
          "support": 0,
          "kontowechsel": 0,
          "app": 2,
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
          "auslandAbheben": "5 CHF je Bezug",
          "auslandFremdAbheben": "5 CHF je Bezug",
          "auslandFremdZahlen": "1,50 CHF je Einkauf",
          "sepaKostenlos": true,
          "kundenservice": "Telefon",
          "filialen": true,
          "appIos": "4,5 / 5"
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
          },
          "auslandAbheben": {
            "url": "https://www.migrosbank.ch/de/dam/jcr:f49f70eb-c052-49ff-92fc-a06630032018/preise_fuer_dienstleistungen_de.71175a10e17a48ad5565873983130261.pdf",
            "stand": "25.11.2026",
            "hinweis": "Migros Bank, Preise für Dienstleistungen, Karten, Visa Debit CHF: „Bancomat Fremdbank Ausland, je Bezug CHF 5“."
          },
          "auslandFremdAbheben": {
            "url": "https://www.migrosbank.ch/de/dam/jcr:f49f70eb-c052-49ff-92fc-a06630032018/preise_fuer_dienstleistungen_de.71175a10e17a48ad5565873983130261.pdf",
            "stand": "25.11.2026",
            "hinweis": "Migros Bank, Preise für Dienstleistungen, Karten, Visa Debit CHF: „Bancomat Fremdbank Ausland, je Bezug CHF 5“."
          },
          "auslandFremdZahlen": {
            "url": "https://www.migrosbank.ch/de/dam/jcr:f49f70eb-c052-49ff-92fc-a06630032018/preise_fuer_dienstleistungen_de.71175a10e17a48ad5565873983130261.pdf",
            "stand": "25.11.2026",
            "hinweis": "Migros Bank, Preise für Dienstleistungen, Karten, Visa Debit CHF, Einkauf: „Ausland in anderer Währung CHF 1.50“."
          },
          "sepaKostenlos": {
            "url": "https://www.migrosbank.ch/de/dam/jcr:f49f70eb-c052-49ff-92fc-a06630032018/preise_fuer_dienstleistungen_de.71175a10e17a48ad5565873983130261.pdf",
            "stand": "25.11.2026",
            "hinweis": "Migros Bank, Preise für Dienstleistungen, Zahlungsauftrag mit E-Banking: „Einzelzahlung, je Zahlung“ Inlandzahlungen in CHF und EUR „kostenlos“; SEPA-Zahlungen CHF 0.30."
          },
          "kundenservice": {
            "url": "https://www.migrosbank.ch/de/dam/jcr:f49f70eb-c052-49ff-92fc-a06630032018/preise_fuer_dienstleistungen_de.71175a10e17a48ad5565873983130261.pdf",
            "stand": "25.11.2026",
            "hinweis": "Migros Bank, Preise für Dienstleistungen, Weitere Preisangaben, Telefon: „Service Line 0848 845 400“."
          },
          "filialen": {
            "url": "https://www.migrosbank.ch/de/privatpersonen/konten-karten/konten/privatkonto.html",
            "stand": "25.11.2026",
            "hinweis": "Migros Bank, Privatkonto: „von 70 Niederlassungen schweizweit“."
          },
          "appIos": {
            "url": "https://apps.apple.com/ch/app/migros-bank-e-banking/id452805858",
            "stand": "25.11.2026",
            "hinweis": "App Store Schweiz, App „Migros Bank E-Banking“ (Migros Bank AG), Bewertung 4,52 von 5 aus 58.541 Bewertungen, abgerufen am 25.11.2026 über die öffentliche iTunes-Suche von Apple."
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
          "sepa": 10,
          "support": 5,
          "kontowechsel": 0,
          "app": 2,
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
          "applePay": true,
          "abhebungen": "gratis an UBS-Bancomaten in CHF",
          "bargeldEinzahlen": "kostenlos am UBS Bancomat Plus",
          "auslandAbheben": "5 CHF je Bezug",
          "auslandFremdAbheben": "5 CHF je Bezug",
          "auslandFremdZahlen": "2 %, mindestens 1 CHF",
          "sepaKostenlos": true,
          "kundenservice": null,
          "filialen": true,
          "appIos": "4,7 / 5"
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
          },
          "applePay": {
            "url": "https://www.ubs.com/ch/de/help/debitcard/wallet.html",
            "stand": "25.11.2026",
            "hinweis": "UBS Hilfe, Debitkarten: „Alle UBS Debitkarten funktionieren mit Apple Pay, Google Pay, Samsung Pay und Smartwatches.“"
          },
          "bargeldEinzahlen": {
            "url": "https://www.ubs.com/content/dam/ubs/ch/swissbank/private/zahlen-und-sparen/konten/dienstleistungen-und-preise.pdf",
            "stand": "25.11.2026",
            "hinweis": "UBS Dienstleistungen und Preise, gültig ab 23.09.2026, UBS Debitkarten: „Bargeldeinzahlungen am UBS Bancomat Plus – CHF Kostenlos“."
          },
          "auslandAbheben": {
            "url": "https://www.ubs.com/content/dam/ubs/ch/swissbank/private/zahlen-und-sparen/konten/dienstleistungen-und-preise.pdf",
            "stand": "25.11.2026",
            "hinweis": "UBS Dienstleistungen und Preise, gültig ab 23.09.2026, Bargeldbezüge an Bancomaten und Automaten anderer Banken, ohne Modul: „Im Ausland in der jeweiligen Landeswährung CHF 5 pro Bezug, UBS-Devisenverkaufskurs“. Das Paket Easy enthält kein Modul weltweit."
          },
          "auslandFremdAbheben": {
            "url": "https://www.ubs.com/content/dam/ubs/ch/swissbank/private/zahlen-und-sparen/konten/dienstleistungen-und-preise.pdf",
            "stand": "25.11.2026",
            "hinweis": "UBS Dienstleistungen und Preise, gültig ab 23.09.2026: „Im Ausland in der jeweiligen Landeswährung CHF 5 pro Bezug, UBS-Devisenverkaufskurs“."
          },
          "auslandFremdZahlen": {
            "url": "https://www.ubs.com/content/dam/ubs/ch/swissbank/private/zahlen-und-sparen/konten/dienstleistungen-und-preise.pdf",
            "stand": "25.11.2026",
            "hinweis": "UBS Dienstleistungen und Preise, gültig ab 23.09.2026, UBS Debitkarten, Bargeldlos bezahlen: „Im Ausland 2% des Betrages, mindestens CHF 1, UBS-Devisenverkaufskurs“."
          },
          "sepaKostenlos": {
            "url": "https://www.ubs.com/content/dam/ubs/ch/swissbank/private/zahlen-und-sparen/konten/dienstleistungen-und-preise.pdf",
            "stand": "25.11.2026",
            "hinweis": "UBS Dienstleistungen und Preise, gültig ab 23.09.2026, UBS Banking Easy, Weitere Dienstleistungen inklusive: „Inlandzahlungen elektronisch CHF“ mit Haken."
          },
          "filialen": {
            "url": "https://www.ubs.com/content/dam/ubs/ch/swissbank/private/zahlen-und-sparen/konten/dienstleistungen-und-preise.pdf",
            "stand": "25.11.2026",
            "hinweis": "UBS Dienstleistungen und Preise, gültig ab 23.09.2026: Preise für Einzahlungen und Bezüge am „UBS-Schalter“, etwa „CHF auf CHF-Konto Kostenlos“."
          },
          "appIos": {
            "url": "https://apps.apple.com/ch/app/ubs-ubs-key4/id441068021",
            "stand": "25.11.2026",
            "hinweis": "App Store Schweiz, App „UBS & UBS key4“ (UBS AG), Bewertung 4,73 von 5 aus 214.409 Bewertungen, abgerufen am 25.11.2026 über die öffentliche iTunes-Suche von Apple."
          }
        },
        "finanzPunkte": {
          "kontofuehrung": 15,
          "bankkarte": 10,
          "girocard": 0,
          "debitkarte": 5,
          "abheben": 2.5,
          "einzahlen": 3,
          "mobilesBezahlen": 8,
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
          "applePay": true,
          "abhebungen": "5 Bezüge oder 200 CHF im Monat ohne Gebühr",
          "bargeldEinzahlen": null,
          "auslandAbheben": "5 Bezüge oder 200 CHF im Monat frei, danach 2 %, mindestens 1 CHF",
          "auslandFremdAbheben": "5 Bezüge oder 200 CHF im Monat frei, danach 2 %, mindestens 1 CHF",
          "auslandFremdZahlen": "werktags 0 % bis 1.250 CHF Wechsel im Monat, sonst 1 %",
          "sepaKostenlos": true,
          "kundenservice": "Chat",
          "filialen": null,
          "appIos": "4,8 / 5"
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
          },
          "applePay": {
            "url": "https://cdn.revolut.com/terms_and_conditions/pdf/allgemeine_gesch_ftsbedingungen_f_r_privatkunden_f_r_schweizer_kunden_der_revolut_bank_uab_c4927da5_1.4.0_1790846276_de.pdf",
            "stand": "25.11.2026",
            "hinweis": "Revolut AGB für Schweizer Kunden der Revolut Bank UAB (gültig ab 3. Dezember 2026): Zahlungen mit der Revolut-Karte umfassen eine „Karte, die zu Apple Pay oder Google Pay hinzugefügt wurde“."
          },
          "auslandAbheben": {
            "url": "https://cdn.revolut.com/terms_and_conditions/pdf/geb_hren_f_r_privatkunden_standard_f_r_schweizer_kunden_der_revolut_bank_uab_59eb6320_2.0.0_1761212457_de.pdf",
            "stand": "25.11.2026",
            "hinweis": "Revolut Gebühren für Schweizer Kunden, Standard: „Kostenlose Bargeldabhebungen: bis zu 5 Abhebungen am Geldautomaten oder CHF 200 pro laufendem Monat … Diese Gebühr beträgt 2 % des abgehobenen Betrags, mindestens aber CHF 1 pro Abhebung.“ Die Regel gilt ohne Unterschied nach Land."
          },
          "auslandFremdAbheben": {
            "url": "https://cdn.revolut.com/terms_and_conditions/pdf/geb_hren_f_r_privatkunden_standard_f_r_schweizer_kunden_der_revolut_bank_uab_59eb6320_2.0.0_1761212457_de.pdf",
            "stand": "25.11.2026",
            "hinweis": "Revolut Gebühren für Schweizer Kunden, Standard: bis zu 5 Abhebungen oder CHF 200 im Monat frei, danach 2 %, mindestens CHF 1; Währungswechsel im „Wechsellimit von CHF 1’250 pro Monat“ werktags ohne Gebühr, am Wochenende „eine Gebühr von 1 %“."
          },
          "auslandFremdZahlen": {
            "url": "https://cdn.revolut.com/terms_and_conditions/pdf/geb_hren_f_r_privatkunden_standard_f_r_schweizer_kunden_der_revolut_bank_uab_59eb6320_2.0.0_1761212457_de.pdf",
            "stand": "25.11.2026",
            "hinweis": "Revolut Gebühren für Schweizer Kunden, Standard: „Wechsellimit von CHF 1’250 pro Monat. Für jeden zusätzlichen Währungswechsel fällt eine faire Nutzungsgebühr in Höhe von 1 %“; werktags „fallen keine Wechselgebühren an“, am Wochenende „eine Gebühr von 1 %“."
          },
          "sepaKostenlos": {
            "url": "https://cdn.revolut.com/terms_and_conditions/pdf/geb_hren_f_r_privatkunden_standard_f_r_schweizer_kunden_der_revolut_bank_uab_59eb6320_2.0.0_1761212457_de.pdf",
            "stand": "25.11.2026",
            "hinweis": "Revolut Gebühren für Schweizer Kunden, Standard: „Lokale Zahlungen Kostenlos“ und „Zahlungen innerhalb des europäischen Zahlungsraums Kostenlos“."
          },
          "kundenservice": {
            "url": "https://cdn.revolut.com/terms_and_conditions/pdf/allgemeine_gesch_ftsbedingungen_f_r_privatkunden_f_r_schweizer_kunden_der_revolut_bank_uab_c4927da5_1.4.0_1790846276_de.pdf",
            "stand": "25.11.2026",
            "hinweis": "Revolut AGB für Schweizer Kunden: „Der In-App-Chat ist unser Kundenservice-Tool“."
          },
          "appIos": {
            "url": "https://apps.apple.com/ch/app/revolut-mehr-als-eine-bank/id932493382",
            "stand": "25.11.2026",
            "hinweis": "App Store Schweiz, App „Revolut: Mehr als eine Bank“ (Revolut Ltd), Bewertung 4,81 von 5 aus 80.114 Bewertungen, abgerufen am 25.11.2026 über die öffentliche iTunes-Suche von Apple."
          }
        },
        "finanzPunkte": {
          "kontofuehrung": 15,
          "bankkarte": 0,
          "girocard": 0,
          "debitkarte": 0,
          "abheben": 2.5,
          "einzahlen": 0,
          "mobilesBezahlen": 8,
          "sepa": 10,
          "support": 2.5,
          "kontowechsel": 0,
          "app": 2,
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
