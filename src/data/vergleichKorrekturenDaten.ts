import type { Quelle } from "@/components/vergleich/vergleichTypen";
import type { RohWert } from "./vergleichHelfer";

/**
 * Redaktionelle Korrekturen zu den erzeugten Vergleichsdateien. HANDGEPFLEGT.
 *
 * `bauen.py` in ~/rebrand/data/vergleiche erzeugt brokerVergleich.ts, girokontoVergleich.ts,
 * kryptoVergleich.ts und anlagenKaufbar.ts neu, fasst diese Datei aber nie an. Jede Korrektur
 * hier überlebt also einen neuen Datenlauf. Positive Zins- und Bezahlmodell-Werte greifen nur mit
 * einem Eintrag in den *_QUELLEN (siehe vergleichKorrekturen.ts).
 */

type Werte = Record<string, Partial<Record<string, RohWert>>>;
type Quellen = Record<string, Record<string, Quelle>>;

const kryptoOptIn = {
  zinsfreiAbStart: "gut" as const,
  zinsfreiesModell: "gut" as const,
};

export const DEPOT_WERTE: Werte = {
  "libertex-depot": { zinsfreiAbStart: "gut" },
  "bux-basic": { zinsfreiAbStart: "gut" },
  "consorsbank-depot": { zinsfreiAbStart: "gut" },
  "etoro-depot": { zinsfreiAbStart: "gut" },
  "revolut-standard": { zinsfreiAbStart: "gut" },
  "scalable-capital-prime-plus-broker": { zinsfreiAbStart: "gut" },
  "trading-212-depot": { zinsfreiAbStart: "gut" },
  "vivid-standard": { zinsfreiAbStart: "gut" },
  "trade-republic-depot": { zinsfreiAbStart: "gut", halalEdelmetalle: "mind. 6 von 7" },
  "tradegate-direct-depot": { zinsfreiAbStart: "gut" },
  "finvesto-depot": { zinsfreiAbStart: "gut" },
  "finvesto-depot-basis": { zinsfreiAbStart: "gut" },
  "finvesto-wertpapierdepot": { zinsfreiAbStart: "gut" },
  "plus500-depot": { zinsfreiAbStart: "gut" },
  "freedom24-smart": { zinsfreiAbStart: "gut" },
  "freedom24-all-inclusive": { zinsfreiAbStart: "gut" },
  "willbe-depot": { zinsfreiAbStart: "schlecht" },
  "hypovereinsbank-hvb-depot": { zinsfreiAbStart: "schlecht" },
  "hypovereinsbank-smartdepot": { zinsfreiAbStart: "schlecht" },
  "commerzbank-direktdepot": { zinsfreiAbStart: "gut" },
  "commerzbank-klassikdepot": { zinsfreiAbStart: "gut" },
  "commerzbank-premiumdepot": { zinsfreiAbStart: "gut" },
  "joe-broker-depot": { zinsfreiAbStart: "gut" },
};

export const DEPOT_QUELLEN: Quellen = {
  "libertex-depot": { zinsfreiAbStart: { url: "https://app.libertex.com/docs/en/Client_Agreement_Shares_Version_1.pdf", stand: "23.09.2026", hinweis: "The Company shall not pay the Client any interest earned on Client funds (other than profit gained through the Investments from his Account(s) under this Agreement), and the Client waives all right to interest." } },
  "finvesto-depot": { zinsfreiAbStart: { url: "https://banking.fnz.de/p/eoxpublic/rest/download-public-formular/getCustomerFormPdf/customerFormId/855/customerFormVersion/1", stand: "21.09.2026", hinweis: "Bedingungen für finvesto Konten bei der FNZ Bank, Nr. 1.5: „Eine Verzinsung für das Guthaben auf dem Konto flex erfolgt derzeit nicht.“ Das Konto flex dient laut denselben Bedingungen der Abwicklung von Wertpapiergeschäften; Tages- und Festgeld sind eigene Konten. Verlinkt von finvesto.de/downloads." } },
  "finvesto-depot-basis": { zinsfreiAbStart: { url: "https://banking.fnz.de/p/eoxpublic/rest/download-public-formular/getCustomerFormPdf/customerFormId/855/customerFormVersion/1", stand: "21.09.2026", hinweis: "Bedingungen für finvesto Konten bei der FNZ Bank, Nr. 1.5: „Eine Verzinsung für das Guthaben auf dem Konto flex erfolgt derzeit nicht.“ Das Konto flex dient laut denselben Bedingungen der Abwicklung von Wertpapiergeschäften; Tages- und Festgeld sind eigene Konten. Verlinkt von finvesto.de/downloads." } },
  "finvesto-wertpapierdepot": { zinsfreiAbStart: { url: "https://banking.fnz.de/p/eoxpublic/rest/download-public-formular/getCustomerFormPdf/customerFormId/855/customerFormVersion/1", stand: "21.09.2026", hinweis: "Bedingungen für finvesto Konten bei der FNZ Bank, Nr. 1.5: „Eine Verzinsung für das Guthaben auf dem Konto flex erfolgt derzeit nicht.“ Das Konto flex dient laut denselben Bedingungen der Abwicklung von Wertpapiergeschäften; Tages- und Festgeld sind eigene Konten. Verlinkt von finvesto.de/downloads." } },
  "plus500-depot": { zinsfreiAbStart: { url: "https://www.plus500.com/Docs/Plus500EE/UserAgreement.pdf", stand: "21.09.2026", hinweis: "Plus500 User Agreement, Nr. 17.5: „No interest is due or will be paid in respect of Client Money. The Client waives all rights to interest.“" } },
  "freedom24-smart": { zinsfreiAbStart: { url: "https://freedom24.com/download/documents/272/Appendix_12_Automatic_Swap_Program_on_D_Accounts_15032024", stand: "21.09.2026", hinweis: "Freedom24, Anhang 12 (Automatic Swap Program): Zinsen laufen nur auf einem eigenen D-Konto. „In order to participate in the Program, the Client must open a special brokerage D-Account and transfer funds there.“" } },
  "freedom24-all-inclusive": { zinsfreiAbStart: { url: "https://freedom24.com/download/documents/272/Appendix_12_Automatic_Swap_Program_on_D_Accounts_15032024", stand: "21.09.2026", hinweis: "Freedom24, Anhang 12 (Automatic Swap Program): Zinsen laufen nur auf einem eigenen D-Konto. „In order to participate in the Program, the Client must open a special brokerage D-Account and transfer funds there.“" } },
  "willbe-depot": { zinsfreiAbStart: { url: "https://willbe-invest.com/de/willbe/faq/faq", stand: "21.09.2026", hinweis: "willbe-FAQ: Ausschüttungen gehen „automatisch auf dein willbe Tagesgeldkonto“, „Dein Guthaben wird ab Eingang auf dem Tagesgeldkonto sofort wieder verzinst.“ Schriftlich vom willbe-Support am 21.09.2026: „Unsere Tagesgeldkonten werden automatisch verzinst, wenn Geld auf dem Konto ist. Leider ist es nicht möglich, auf diese Zinsen zu verzichten bzw. diese zu deaktivieren.“" } },
  "hypovereinsbank-hvb-depot": { zinsfreiAbStart: { url: "https://www.hypovereinsbank.de/content/dam/hypovereinsbank/shared/pdf/Produktprofile/HVB-Investmentkonto-Produktprofil.pdf", stand: "21.09.2026", hinweis: "HVB-Produktprofil Investmentkonto (das Verrechnungskonto für das Depot): „Vom 8. Januar 2025 bis 31. Dezember 2026 wird auf dem HVB Investmentkonto ein Sonderzins vergütet … Ab 26. Juni 2026 beträgt der Zinssatz bis auf weiteres 0,50% p. a.“ Die Aussage des Kundenservice vom 21.09.2026 („grundsätzlich nicht verzinst“) widerspricht dem Produktprofil. Ab 01.01.2027 neu prüfen." } },
  "hypovereinsbank-smartdepot": { zinsfreiAbStart: { url: "https://www.hypovereinsbank.de/content/dam/hypovereinsbank/shared/pdf/Produktprofile/HVB-Investmentkonto-Produktprofil.pdf", stand: "21.09.2026", hinweis: "HVB-Produktprofil Investmentkonto (das Verrechnungskonto für das Depot): „Vom 8. Januar 2025 bis 31. Dezember 2026 wird auf dem HVB Investmentkonto ein Sonderzins vergütet … Ab 26. Juni 2026 beträgt der Zinssatz bis auf weiteres 0,50% p. a.“ Die Aussage des Kundenservice vom 21.09.2026 („grundsätzlich nicht verzinst“) widerspricht dem Produktprofil. Ab 01.01.2027 neu prüfen." } },
  "tradegate-direct-depot": { zinsfreiAbStart: { url: "https://tradegate.direct/?showDocuments=true", stand: "21.09.2026", hinweis: "Schriftlich bestätigt vom tradegate.direct-Support am 21.09.2026 (Ticket SUP-5390): „Nicht investiertes Guthaben auf dem Verrechnungskonto von tradegate.direct wird derzeit nicht verzinst. … Es erfolgt somit auch keine Zinsgutschrift auf dieses Konto.“ Der Support weist darauf hin, dass sich die Konditionen künftig ändern könnten." } },
  "bux-basic": { zinsfreiAbStart: { url: "https://getbux.com/de/preise/", stand: "20.09.2026", hinweis: "Das kostenlose BUX-Basic-Modell enthält keine automatische Verzinsung des nicht investierten Guthabens." } },
  "consorsbank-depot": { zinsfreiAbStart: { url: "https://www.consorsbank.de/web/Sparen-Anlegen/Sparen/Tagesgeld", stand: "20.09.2026", hinweis: "Die Verzinsung gehört zum separat eröffneten Tagesgeldkonto, nicht zum Verrechnungskonto des Depots." } },
  "etoro-depot": { zinsfreiAbStart: { url: "https://www.etoro.com/de/investing/interest-on-balance/", stand: "20.09.2026", hinweis: "Zinsen werden über ein eigenes Interest-on-Balance-Angebot nach Aktivierung gezahlt." } },
  "revolut-standard": { zinsfreiAbStart: { url: "https://www.revolut.com/de-DE/legal/terms/", stand: "20.09.2026", hinweis: "Revolut weist für das Standardkonto keine automatische Verzinsung des Guthabens aus." } },
  "scalable-capital-prime-plus-broker": { zinsfreiAbStart: { url: "https://de.scalable.capital/zinsuebersicht", stand: "20.09.2026", hinweis: "Das Verrechnungskonto wird mit 0 % p. a. geführt; das separate Tagesgeld muss aktiv gewählt und befüllt werden." } },
  "trading-212-depot": { zinsfreiAbStart: { url: "https://www.trading212.com/de/invest", stand: "20.09.2026", hinweis: "Die Verzinsung freier Mittel ist ein aktivierbares Zusatzangebot und nicht automatisch voreingestellt." } },
  "vivid-standard": { zinsfreiAbStart: { url: "https://vivid.money/de-de/personal/interest-rate-pocket/", stand: "20.09.2026", hinweis: "Der Ertrag setzt ein Interest-Rate-Pocket und eine eigene Einzahlung voraus." } },
  "commerzbank-direktdepot": { zinsfreiAbStart: { url: "https://www.commerzbank.de/plv", stand: "22.09.2026", hinweis: "Schriftlich bestätigt vom Commerzbank-Kundencenter am 22.09.2026: „Aktuell wird Guthaben, dass Sie auf einem Girokonto oder Verrechnungskonto Plus anlegen nicht verzinst.“ Ohne Commerzbank-Girokonto eröffnet die Bank zum Depot automatisch ein Verrechnungskonto Plus." } },
  "commerzbank-klassikdepot": { zinsfreiAbStart: { url: "https://www.commerzbank.de/plv", stand: "22.09.2026", hinweis: "Schriftlich bestätigt vom Commerzbank-Kundencenter am 22.09.2026: „Aktuell wird Guthaben, dass Sie auf einem Girokonto oder Verrechnungskonto Plus anlegen nicht verzinst.“ Ohne Commerzbank-Girokonto eröffnet die Bank zum Depot automatisch ein Verrechnungskonto Plus." } },
  "commerzbank-premiumdepot": { zinsfreiAbStart: { url: "https://www.commerzbank.de/plv", stand: "22.09.2026", hinweis: "Schriftlich bestätigt vom Commerzbank-Kundencenter am 22.09.2026: „Aktuell wird Guthaben, dass Sie auf einem Girokonto oder Verrechnungskonto Plus anlegen nicht verzinst.“ Ohne Commerzbank-Girokonto eröffnet die Bank zum Depot automatisch ein Verrechnungskonto Plus." } },
  "joe-broker-depot": { zinsfreiAbStart: { url: "https://www.joebroker.de/", stand: "22.09.2026", hinweis: "Schriftlich bestätigt vom Joe-Broker-Support am 22.09.2026 (Ticket JBSPROD-13897): „Aktuell wird das Guthaben, das auf dem Verrechnungskonto liegt nicht verzinst.“ Eine geplante Verzinsung gilt laut Support nur für Konten, die nach deren Einführung eröffnet werden: „Wenn Du also zum aktuellen Zeitpunkt ein Depot bei uns eröffnest, erhältst Du keine Zinsen auf Dein Guthaben und wirst auch in Zukunft keine erhalten.“" } },
  "trade-republic-depot": {
    zinsfreiAbStart: {
      url: "https://traderepublic.com/de-de/zinsen",
      stand: "20.09.2026",
      hinweis: "„Aktiviere Zinsen in der App“; Zinsen laufen nicht ohne eigene Aktivierung.",
    },
    halalEdelmetalle: {
      url: "https://assets.traderepublic.com/assets/files/DE/Instrument_Universe_DE_de.pdf",
      stand: "20.09.2026",
      hinweis: "Sechs Edelmetall-ISINs bestätigt; IE00B579F325 steht zwar im Katalog, bleibt wegen des App-Widerspruchs ungeklärt.",
    },
  },
};

export const GIRO_WERTE: Werte = {
  "sumup-privatkonto": { zinsfreiAbStart: "gut", keinDispoAbStart: "gut" },
  "santander-bestgiro": { keinDispoAbStart: "gut" },
  "norisbank-girokonto-plus": { keinDispoAbStart: "gut" },
  "dkb-girokonto": { keinDispoAbStart: "schlecht" },
  "meine-bank-mein-girokonto": { zinsfreiAbStart: "gut", keinDispoAbStart: "gut" },
  "hamburger-sparkasse-haspajoker": { zinsfreiAbStart: "gut", keinDispoAbStart: "teils" },
  "ethikbank-girokonto": { keinDispoAbStart: "gut" },
  "hypovereinsbank-aktivkonto": { zinsfreiAbStart: "gut", keinDispoAbStart: "gut" },
  "hypovereinsbank-pluskonto": { zinsfreiAbStart: "gut", keinDispoAbStart: "gut" },
  "commerzbank-girokonto": { keinDispoAbStart: "gut" },
  "commerzbank-klassikkonto": { keinDispoAbStart: "gut" },
  "bforbank-bforbasic-konto": { keinDispoAbStart: "gut" },
  "1822direkt-girodirekt": { zinsfreiAbStart: "gut" },
  "ing-girokonto": { zinsfreiAbStart: "gut" },
  "ing-girokonto-future": { zinsfreiAbStart: "gut" },
  "norisbank-top-girokonto": { zinsfreiAbStart: "gut" },
  "revolut-standard": { zinsfreiAbStart: "gut" },
  "revolut-plus": { zinsfreiAbStart: "gut" },
  "revolut-premium": { zinsfreiAbStart: "gut" },
  "revolut-metal": { zinsfreiAbStart: "gut" },
  "revolut-ultra": { zinsfreiAbStart: "gut" },
  "tomorrow-now": { zinsfreiAbStart: "gut" },
  "tomorrow-change": { zinsfreiAbStart: "gut" },
  "tomorrow-plus": { zinsfreiAbStart: "gut" },
  "vivid-standard": { zinsfreiAbStart: "gut", keinDispoAbStart: "gut" },
  "vivid-plus": { zinsfreiAbStart: "gut", keinDispoAbStart: "gut" },
  "vivid-prime": { zinsfreiAbStart: "gut", keinDispoAbStart: "gut" },
  "wise-konto": { keinDispoAbStart: "gut" },
  "bunq-free": { zinsfreiAbStart: "gut", keinDispoAbStart: "gut" },
  "bunq-core": { zinsfreiAbStart: "gut", keinDispoAbStart: "gut" },
  "bunq-pro": { zinsfreiAbStart: "gut", keinDispoAbStart: "gut" },
  "bunq-elite": { zinsfreiAbStart: "gut", keinDispoAbStart: "gut" },
  "klarna-guthaben": { keinDispoAbStart: "gut", zinsfreiAbStart: "gut" },
  "monese-pay-as-you-go": { zinsfreiAbStart: "gut", keinDispoAbStart: "gut" },
  "pax-bank-pax-bck-individuell": { keinDispoAbStart: "gut" },
  "trade-republic-girokonto": { zinsfreiAbStart: "teils", keinDispoAbStart: "gut" },
  "berliner-volksbank-girokonto": { zinsfreiAbStart: "gut" },
  "psd-bank-n-rnberg-girodirekt": { zinsfreiAbStart: "gut", keinDispoAbStart: "gut" },
};

export const GIRO_QUELLEN: Quellen = {
  "sumup-privatkonto": { zinsfreiAbStart: { url: "https://www.sumup.com/de-de/privat/rechtliches/agb/", stand: "23.09.2026", hinweis: "4.6 Da es sich bei dem Guthaben in Ihrem Wallet um elektronisches Geld handelt: (a) können (und werden) wir Ihnen dieses nicht verzinsen; und (b) ist es nicht durch das litauische Einlagensicherungssystem oder durch ein anderes Einlagensicherungssystem gesichert." }, keinDispoAbStart: { url: "https://www.sumup.com/de-de/privat/rechtliches/agb/", stand: "23.09.2026", hinweis: "4.7 Sie können ausschließlich Geld ausgeben, dass Sie auf Ihrem Wallet halten." } },
  "santander-bestgiro": { keinDispoAbStart: { url: "https://www.santander.de/content/pdf/agb-sonderbedingungen/bedingungen-fuer-girokonten.pdf", stand: "23.09.2026", hinweis: "10.3 Der Vertrag kommt durch einen Antrag des Kunden und die Annahme der Bank zustande. Die Annahmeerklärung der Bank bedarf keiner Unterzeichnung, wenn sie mit Hilfe einer automatischen Einrichtung erstellt wird. Die Bank bestätigt die Annahme des Antrags durch Angabe des Verfügungs- bzw. Dispositionsrahmens auf dem Kontoauszug." } },
  "norisbank-girokonto-plus": { keinDispoAbStart: { url: "https://www.norisbank.de/dam/norisbank/de/shared/pdf/norisbank-antrag-girokonto-plus.pdf", stand: "23.09.2026", hinweis: "Auf Antrag und nach Prüfung der Bonität räumt die Bank dem Kunden auf einem Girokonto einen Dispositionskredit, den noris Dispokredit, ein. Die Einräumung und damit Antragsannahme der Bank erfolgt durch gesonderte Mitteilung. [Antragsformular, eigenes Ankreuzfeld: „Beantragung Dispositionskredit* – Ich nutze mein neues Girokonto plus für monatliche Geldeingänge. Bitte räumen Sie mir einen Dispositionskredit in Höhe von 500 Euro ein.“] Hinweis: Die Werbeseite norisbank.de spricht dagegen von einem Sofort-Dispo bis 500 Euro, Bonität vorausgesetzt. Gewertet wurde das Vertragsdokument." } },
  "dkb-girokonto": { keinDispoAbStart: { url: "https://www.dkb.de/fragen-antworten/ich-habe-mein-konto-ueberzogen-was-muss-ich-tun", stand: "23.09.2026", hinweis: "Für dein Girokonto haben wir dir in der Regel einen Dispokredit eingeräumt. Bis zu diesem Betrag darfst du mit deinem Girokonto ins Minus gehen. Hast du keinen Dispokredit, darfst du das Girokonto nur im Guthaben führen." } },
  "revolut-standard": { zinsfreiAbStart: { url: "https://www.revolut.com/de-DE/legal/savings-how-does-it-work/", stand: "21.09.2026", hinweis: "Revolut: Zinsen gibt es nur auf dem Tagesgeld-Unterkonto, das man selbst befüllt. „Das Tagesgeld-Unterkonto ist ein Sichteinlagenkonto. Wenn du Geld auf ein Tagesgeldkonto einzahlst, wird es von deinem Hauptkonto bei Revolut auf ein Tagesgeld-Unterkonto übertragen“." } },
  "revolut-plus": { zinsfreiAbStart: { url: "https://www.revolut.com/de-DE/legal/savings-how-does-it-work/", stand: "21.09.2026", hinweis: "Revolut: Zinsen gibt es nur auf dem Tagesgeld-Unterkonto, das man selbst befüllt. „Das Tagesgeld-Unterkonto ist ein Sichteinlagenkonto. Wenn du Geld auf ein Tagesgeldkonto einzahlst, wird es von deinem Hauptkonto bei Revolut auf ein Tagesgeld-Unterkonto übertragen“." } },
  "revolut-premium": { zinsfreiAbStart: { url: "https://www.revolut.com/de-DE/legal/savings-how-does-it-work/", stand: "21.09.2026", hinweis: "Revolut: Zinsen gibt es nur auf dem Tagesgeld-Unterkonto, das man selbst befüllt. „Das Tagesgeld-Unterkonto ist ein Sichteinlagenkonto. Wenn du Geld auf ein Tagesgeldkonto einzahlst, wird es von deinem Hauptkonto bei Revolut auf ein Tagesgeld-Unterkonto übertragen“." } },
  "revolut-metal": { zinsfreiAbStart: { url: "https://www.revolut.com/de-DE/legal/savings-how-does-it-work/", stand: "21.09.2026", hinweis: "Revolut: Zinsen gibt es nur auf dem Tagesgeld-Unterkonto, das man selbst befüllt. „Das Tagesgeld-Unterkonto ist ein Sichteinlagenkonto. Wenn du Geld auf ein Tagesgeldkonto einzahlst, wird es von deinem Hauptkonto bei Revolut auf ein Tagesgeld-Unterkonto übertragen“." } },
  "revolut-ultra": { zinsfreiAbStart: { url: "https://www.revolut.com/de-DE/legal/savings-how-does-it-work/", stand: "21.09.2026", hinweis: "Revolut: Zinsen gibt es nur auf dem Tagesgeld-Unterkonto, das man selbst befüllt. „Das Tagesgeld-Unterkonto ist ein Sichteinlagenkonto. Wenn du Geld auf ein Tagesgeldkonto einzahlst, wird es von deinem Hauptkonto bei Revolut auf ein Tagesgeld-Unterkonto übertragen“." } },
  "wise-konto": { keinDispoAbStart: { url: "https://wise.com/de/help/articles/2897226/was-ist-ein-wise-konto", stand: "21.09.2026", hinweis: "Wise-Hilfe: „Du kannst dein Konto nicht überziehen und kein Darlehen erhalten.“" } },
  "tomorrow-now": { zinsfreiAbStart: { url: "https://www.tomorrow.one/de-DE/sparen/tagesgeldkonto/", stand: "21.09.2026", hinweis: "Schriftlich bestätigt vom Tomorrow-Team am 23.09.2026 (Ticket #1568580): „Das Guthaben auf dem Girokonto selbst wird nicht verzinst.“ Dazu die Anbieterseite: Zinsen nur auf dem Tagesgeldkonto, das man zusätzlich eröffnet. „Eröffnest du ein Girokonto bei uns, kannst du ganz unkompliziert zusätzlich ein Tagesgeldkonto eröffnen.“" } },
  "tomorrow-change": { zinsfreiAbStart: { url: "https://www.tomorrow.one/de-DE/sparen/tagesgeldkonto/", stand: "21.09.2026", hinweis: "Schriftlich bestätigt vom Tomorrow-Team am 23.09.2026 (Ticket #1568580): „Das Guthaben auf dem Girokonto selbst wird nicht verzinst.“ Dazu die Anbieterseite: Zinsen nur auf dem Tagesgeldkonto, das man zusätzlich eröffnet. „Eröffnest du ein Girokonto bei uns, kannst du ganz unkompliziert zusätzlich ein Tagesgeldkonto eröffnen.“" } },
  "tomorrow-plus": { zinsfreiAbStart: { url: "https://www.tomorrow.one/de-DE/sparen/tagesgeldkonto/", stand: "21.09.2026", hinweis: "Schriftlich bestätigt vom Tomorrow-Team am 23.09.2026 (Ticket #1568580): „Das Guthaben auf dem Girokonto selbst wird nicht verzinst.“ Dazu die Anbieterseite: Zinsen nur auf dem Tagesgeldkonto, das man zusätzlich eröffnet. „Eröffnest du ein Girokonto bei uns, kannst du ganz unkompliziert zusätzlich ein Tagesgeldkonto eröffnen.“" } },
  "bunq-free": { zinsfreiAbStart: { url: "https://help.bunq.com/articles/why-am-i-not-receiving-massinterest", stand: "21.09.2026", hinweis: "bunq-Hilfe: „To start earning MassInterest, you must open a bunq Savings Account - regular Bank Accounts can’t earn interest.“" }, keinDispoAbStart: { url: "https://help.bunq.com/articles/can-i-get-a-loan-with-my-bunq-account", stand: "21.09.2026", hinweis: "bunq-Hilfe: „bunq doesn't offer loans or overdrafts to help you avoid debt“." } },
  "bunq-core": { zinsfreiAbStart: { url: "https://help.bunq.com/articles/why-am-i-not-receiving-massinterest", stand: "21.09.2026", hinweis: "bunq-Hilfe: „To start earning MassInterest, you must open a bunq Savings Account - regular Bank Accounts can’t earn interest.“" }, keinDispoAbStart: { url: "https://help.bunq.com/articles/can-i-get-a-loan-with-my-bunq-account", stand: "21.09.2026", hinweis: "bunq-Hilfe: „bunq doesn't offer loans or overdrafts to help you avoid debt“." } },
  "bunq-pro": { zinsfreiAbStart: { url: "https://help.bunq.com/articles/why-am-i-not-receiving-massinterest", stand: "21.09.2026", hinweis: "bunq-Hilfe: „To start earning MassInterest, you must open a bunq Savings Account - regular Bank Accounts can’t earn interest.“" }, keinDispoAbStart: { url: "https://help.bunq.com/articles/can-i-get-a-loan-with-my-bunq-account", stand: "21.09.2026", hinweis: "bunq-Hilfe: „bunq doesn't offer loans or overdrafts to help you avoid debt“." } },
  "bunq-elite": { zinsfreiAbStart: { url: "https://help.bunq.com/articles/why-am-i-not-receiving-massinterest", stand: "21.09.2026", hinweis: "bunq-Hilfe: „To start earning MassInterest, you must open a bunq Savings Account - regular Bank Accounts can’t earn interest.“" }, keinDispoAbStart: { url: "https://help.bunq.com/articles/can-i-get-a-loan-with-my-bunq-account", stand: "21.09.2026", hinweis: "bunq-Hilfe: „bunq doesn't offer loans or overdrafts to help you avoid debt“." } },
  "vivid-standard": { zinsfreiAbStart: { url: "https://support.vivid.money/de/articles/9274783-was-ist-das-interest-rate-pocket", stand: "21.09.2026", hinweis: "Vivid-Hilfe: Zinsen laufen nur in einem Interest Rate Pocket, das man selbst eröffnet: „für das erste eröffnete Interest Rate Pocket erhältst du für zwei Monate einen Aktionszinssatz“." }, keinDispoAbStart: { url: "https://support.vivid.money/de/articles/8460434-warum-wird-mir-ein-negativer-saldo-angezeigt", stand: "21.09.2026", hinweis: "Vivid-Hilfe: „Wir bieten keinen Dispokredit an.“" } },
  "vivid-plus": { zinsfreiAbStart: { url: "https://support.vivid.money/de/articles/9274783-was-ist-das-interest-rate-pocket", stand: "21.09.2026", hinweis: "Vivid-Hilfe: Zinsen laufen nur in einem Interest Rate Pocket, das man selbst eröffnet: „für das erste eröffnete Interest Rate Pocket erhältst du für zwei Monate einen Aktionszinssatz“." }, keinDispoAbStart: { url: "https://support.vivid.money/de/articles/8460434-warum-wird-mir-ein-negativer-saldo-angezeigt", stand: "21.09.2026", hinweis: "Vivid-Hilfe: „Wir bieten keinen Dispokredit an.“" } },
  "vivid-prime": { zinsfreiAbStart: { url: "https://support.vivid.money/de/articles/9274783-was-ist-das-interest-rate-pocket", stand: "21.09.2026", hinweis: "Vivid-Hilfe: Zinsen laufen nur in einem Interest Rate Pocket, das man selbst eröffnet: „für das erste eröffnete Interest Rate Pocket erhältst du für zwei Monate einen Aktionszinssatz“." }, keinDispoAbStart: { url: "https://support.vivid.money/de/articles/8460434-warum-wird-mir-ein-negativer-saldo-angezeigt", stand: "21.09.2026", hinweis: "Vivid-Hilfe: „Wir bieten keinen Dispokredit an.“" } },
  "klarna-guthaben": { keinDispoAbStart: { url: "https://cdn.klarna.com/1.0/shared/content/legal/terms/0/de_de/general_conditions_account", stand: "21.09.2026", hinweis: "Klarna-AGB: „Das Klarna Bankkonto hat keine Überziehungsfunktion, d. h. dein Klarna Bankkonto kann nicht unter null fallen.“" }, zinsfreiAbStart: { url: "https://www.klarna.com/de/hilfe/klarna-guthaben/wie-kann-ich-mit-meinem-klarna-guthaben-zinsen-verdienen/", stand: "23.09.2026", hinweis: "Du kannst mit deinem Girokonto Zinsen verdienen, indem du eine unserer Sparoptionen wählst: ein Flexkonto für Flexibilität oder ein Festgeldkonto mit fester Laufzeit. Eröffne einfach ein Sparkonto und lade Geld von deinem Girokonto auf. Dein Geld beginnt sofort, Zinsen zu erwirtschaften." } },
  "monese-pay-as-you-go": { zinsfreiAbStart: { url: "https://www.monese.com/terms/eu-other-personal-terms-and-conditions-09-10-2025", stand: "21.09.2026", hinweis: "Monese-AGB (EU): „As your Monese Account is an e-money account, the law doesn’t let us pay you interest“." }, keinDispoAbStart: { url: "https://support.monese.com/en/articles/41-why-is-my-account-balance-negative", stand: "21.09.2026", hinweis: "Monese-Hilfe: „It’s also worth remembering that we don’t offer overdrafts at the moment.“" } },
  "pax-bank-pax-bck-individuell": { keinDispoAbStart: { url: "https://www.pax-bank.de/privatkunden/kredit-baufinanzierung/kredit/dispokredit.html", stand: "21.09.2026", hinweis: "Pax-Bank: Der Dispo wird selbst beantragt, „So beantragen Sie innerhalb weniger Minuten und ohne viel Papierkram Ihren Dispokredit.“" } },
  "trade-republic-girokonto": { zinsfreiAbStart: { url: "https://traderepublic.com/de-de/zinsen", stand: "21.09.2026", hinweis: "Trade Republic: „Aktiviere Zinsen in der App“ und „Ja, du kannst die Zinsen in der App deaktivieren, indem du zum Tab „Cash“ > Kachel „Zinsen“ > „Verwalten“ > „Deaktivieren“ navigierst.“ Ob sie ab Eröffnung laufen, sagt die Seite nicht eindeutig, deshalb teils." }, keinDispoAbStart: { url: "https://assets.traderepublic.com/assets/files/FeeInformation_PaymentAccount_de.pdf", stand: "23.09.2026", hinweis: "Überziehungen und damit verbundene Dienste / Eingeräumte Kontoüberziehung: Dienst nicht verfügbar / Geduldete Kontoüberziehung: Dienst nicht verfügbar" } },
  "meine-bank-mein-girokonto": { zinsfreiAbStart: { url: "https://www.meinebank.de/konto-und-karte/mein-girokonto.html", stand: "21.09.2026", hinweis: "Schriftlich bestätigt von meine Bank am 21.09.2026: „Nein, Guthaben auf dem MEIN-Girokonto werden nicht verzinst. Eine Verzinsung erfolgt ausschließlich auf gesonderte Anlageprodukte, beispielsweise ein Tagesgeldkonto.“" }, keinDispoAbStart: { url: "https://www.meinebank.de/konto-und-karte/mein-girokonto.html", stand: "21.09.2026", hinweis: "Schriftlich bestätigt von meine Bank am 21.09.2026: „Ja, Sie können das MEIN-Girokonto grundsätzlich auch ohne Dispositionskredit führen. Ein Dispositionskredit wird nicht automatisch genehmigt.“" } },
  "hamburger-sparkasse-haspajoker": { zinsfreiAbStart: { url: "https://www.haspa.de/de/home.html", stand: "21.09.2026", hinweis: "Schriftlich bestätigt von der Hamburger Sparkasse (Privat Direkt Beratung) am 21.09.2026: „Unsere Girokonten haben keine Guthabenverzinsung.“" }, keinDispoAbStart: { url: "https://www.haspa.de/de/home.html", stand: "21.09.2026", hinweis: "Schriftlich von der Hamburger Sparkasse am 21.09.2026: „Zudem wird auch kein Dispositionskredit im Rahmen einer Girokontoeröffnung „automatisch“ eingestellt. … In der Regel gibt es einen kleinen Überziehungspuffer, den wir jedoch mit einer Überziehungssperre vermeiden können.“ Die Sperre muss man bei der Eröffnung selbst verlangen, deshalb nur teilweise." } },
  "ethikbank-girokonto": { keinDispoAbStart: { url: "https://www.ethikbank.de/", stand: "21.09.2026", hinweis: "Schriftlich bestätigt von der EthikBank am 21.09.2026: „Gern können Sie das Konto ohne Überziehungsmöglichkeit eröffnen. In diesem Fall wird das Konto im Guthaben geführt und es fallen keine Dispositionszinsen an.“" } },
  "hypovereinsbank-aktivkonto": { zinsfreiAbStart: { url: "https://www.hypovereinsbank.de/hvb/privatkunden", stand: "21.09.2026", hinweis: "Schriftlich bestätigt vom HypoVereinsbank-Kundenservice (smartbanking@unicredit.de) am 21.09.2026: „Guthaben auf einem Verrechnungskonto zum Depot (oder auch Girokonto) werden grundsätzlich nicht verzinst. Verzinsungen von Guthaben finden nur auf Sparkonten oder bewusst gewählten Anlagen statt.“" }, keinDispoAbStart: { url: "https://www.hypovereinsbank.de/hvb/privatkunden", stand: "21.09.2026", hinweis: "Schriftlich bestätigt vom HypoVereinsbank-Kundenservice am 21.09.2026: „Ein Dispositionskredit kann nur für ein Girokonto welches zum Zahlungsverkehr genutzt wird, aktiv beantragt werden“." } },
  "hypovereinsbank-pluskonto": { zinsfreiAbStart: { url: "https://www.hypovereinsbank.de/hvb/privatkunden", stand: "21.09.2026", hinweis: "Schriftlich bestätigt vom HypoVereinsbank-Kundenservice (smartbanking@unicredit.de) am 21.09.2026: „Guthaben auf einem Verrechnungskonto zum Depot (oder auch Girokonto) werden grundsätzlich nicht verzinst. Verzinsungen von Guthaben finden nur auf Sparkonten oder bewusst gewählten Anlagen statt.“" }, keinDispoAbStart: { url: "https://www.hypovereinsbank.de/hvb/privatkunden", stand: "21.09.2026", hinweis: "Schriftlich bestätigt vom HypoVereinsbank-Kundenservice am 21.09.2026: „Ein Dispositionskredit kann nur für ein Girokonto welches zum Zahlungsverkehr genutzt wird, aktiv beantragt werden“." } },
  "commerzbank-girokonto": { keinDispoAbStart: { url: "https://www.commerzbank.de/privatkunden/girokonten/girokonto-eroeffnen/", stand: "21.09.2026", hinweis: "FAQ „Haben die Girokonten einen Dispokredit?“: „Ja, Sie können auf Wunsch und bei ausreichender Bonität einen Dispositionskredit (eingeräumte Kontoüberziehung) einrichten lassen.“ Kein Dispo ab Start, nur auf Antrag." } },
  "commerzbank-klassikkonto": { keinDispoAbStart: { url: "https://www.commerzbank.de/privatkunden/girokonten/girokonto-eroeffnen/", stand: "21.09.2026", hinweis: "FAQ „Haben die Girokonten einen Dispokredit?“: „Ja, Sie können auf Wunsch und bei ausreichender Bonität einen Dispositionskredit (eingeräumte Kontoüberziehung) einrichten lassen.“ Kein Dispo ab Start, nur auf Antrag." } },
  "bforbank-bforbasic-konto": { keinDispoAbStart: { url: "https://www.bforbank.com/de/haeufig-gestellte-fragen?category=karte&page=4", stand: "21.09.2026", hinweis: "BforBank: Ein Dispositionskredit ist aktuell nicht verfügbar." } },
  "psd-bank-n-rnberg-girodirekt": { zinsfreiAbStart: { url: "https://www.psd-nuernberg.de/", stand: "23.09.2026", hinweis: "Schriftlich bestätigt von der PSD Bank Nürnberg am 23.09.2026: „nein, standardmäßige Girokonten der PSD Bank Nürnberg (wie PSD GiroDirekt oder PSD GiroKlassik) bieten keine generelle Guthabenverzinsung auf dem normalen Girokonto.“ Zum Dispo: „Bei uns wird ein Dispokredit von 500 Euro bei bestimmten Kontoführungsmodellen (wie dem PSD GiroDirekt) auf Wunsch direkt bei der Kontoeröffnung als Sofort-Dispo beantragt, aber er wird nicht vollkommen automatisch ohne Ihre Zustimmung oder Bonitätsprüfung eingerichtet.“" }, keinDispoAbStart: { url: "https://www.psd-nuernberg.de/", stand: "23.09.2026", hinweis: "Schriftlich bestätigt von der PSD Bank Nürnberg am 23.09.2026: „nein, standardmäßige Girokonten der PSD Bank Nürnberg (wie PSD GiroDirekt oder PSD GiroKlassik) bieten keine generelle Guthabenverzinsung auf dem normalen Girokonto.“ Zum Dispo: „Bei uns wird ein Dispokredit von 500 Euro bei bestimmten Kontoführungsmodellen (wie dem PSD GiroDirekt) auf Wunsch direkt bei der Kontoeröffnung als Sofort-Dispo beantragt, aber er wird nicht vollkommen automatisch ohne Ihre Zustimmung oder Bonitätsprüfung eingerichtet.“" } },
  "berliner-volksbank-girokonto": { zinsfreiAbStart: { url: "https://www.berliner-volksbank.de/privatkunden/girokonto-karten.html", stand: "22.09.2026", hinweis: "Schriftlich bestätigt vom Privatkunden-Service der Berliner Volksbank am 22.09.2026: „Sind Sie über 30 Jahre, gibt es keine Guthabenverzinsung auf das Girokonto.“ Beim Girokonto blauorange (18 bis 30 Jahre) gibt es „nur eine Guthabenverzinsung, wenn sie bei uns Mitglied werden“, also nur nach eigener Entscheidung." } },
  "1822direkt-girodirekt": { zinsfreiAbStart: { url: "https://www.1822direkt.de/sparen/tagesgeldkonto/", stand: "20.09.2026", hinweis: "Das automatisch eröffnete Tagesgeldkonto bleibt ohne Einzahlung leer; verzinst wird nur dessen Guthaben." } },
  "ing-girokonto": { zinsfreiAbStart: { url: "https://www.ing.de/girokonto/kundenservice/", stand: "20.09.2026", hinweis: "Das Extra-Konto wird als separates Konto eröffnet; eine Verzinsung setzt eine eigene Einzahlung voraus." } },
  "ing-girokonto-future": { zinsfreiAbStart: { url: "https://www.ing.de/girokonto/kundenservice/", stand: "20.09.2026", hinweis: "Das Extra-Konto wird als separates Konto eröffnet; eine Verzinsung setzt eine eigene Einzahlung voraus." } },
  "norisbank-top-girokonto": { zinsfreiAbStart: { url: "https://www.norisbank.de/produkte/girokonto.html", stand: "20.09.2026", hinweis: "Das optionale Top-Zinskonto ist ein separates Konto und wird erst durch eine eigene Einzahlung relevant." } },
};

export const KRYPTO_WERTE: Werte = {
  "robinhood-krypto": { zinsfreiAbStart: "gut" },
  "crypto-com-app": { zinsfreiAbStart: "gut" },
  "bitpanda-standard": { zinsfreiesModell: "gut" },
  "bitpanda-fusion": { zinsfreiesModell: "gut" },
  "21bitcoin-app": { zinsfreiAbStart: "gut", zinsfreiesModell: "gut" },
  "binance-pro": kryptoOptIn,
  "binance-standard": kryptoOptIn,
  "bison-app": kryptoOptIn,
  "bitget-trading": kryptoOptIn,
  "bitvavo-standard": kryptoOptIn,
  "coinbase-advanced": kryptoOptIn,
  "coinbase-standard": kryptoOptIn,
  "etoro-krypto": { zinsfreiAbStart: "gut", zinsfreiesModell: "schlecht" },
  "finanzen-net-zero-krypto": kryptoOptIn,
  "finst-standard": kryptoOptIn,
  "flatex-krypto": kryptoOptIn,
  "justtrade-krypto": kryptoOptIn,
  "kraken-pro": kryptoOptIn,
  "kraken-standard": kryptoOptIn,
  "okx-trading": kryptoOptIn,
  "revolut-krypto": { zinsfreiAbStart: "teils", zinsfreiesModell: "schlecht" },
  "scalable-capital-krypto": kryptoOptIn,
  "smartbroker-plus-krypto": kryptoOptIn,
  "trade-republic-krypto": { zinsfreiAbStart: "teils", zinsfreiesModell: "gut" },
  "traders-place-krypto": kryptoOptIn,
  "relai-app": kryptoOptIn,
  "bsdex-standard": { zinsfreiAbStart: "gut", zinsfreiesModell: "gut" },
};

export const KRYPTO_QUELLEN: Quellen = {
  "robinhood-krypto": { zinsfreiAbStart: { url: "https://robinhood.com/us/en/support/articles/crypto-staking/", stand: "23.09.2026", hinweis: "„Staking allows you to earn rewards by locking up crypto.“ / „To stake crypto: Select Get started with staking or Manage staking on the coin detail page of the individual crypto you hold and want to stake“ — Cash-Zinsen nur nach Anmeldung: „How do I sign up? Go to Account (person icon) … Select Investing … Scroll to Cash sweep program“ (robinhood.com/us/en/support/articles/deposit-sweep-program/)" } },
  "crypto-com-app": { zinsfreiAbStart: { url: "https://help.crypto.com/en/articles/2996965-crypto-earn-how-does-it-work", stand: "23.09.2026", hinweis: "„Allocate your preferred crypto into Crypto Earn to start accruing rewards daily to grow your crypto assets.“ / „Tap on the Menu on the top left corner of the Crypto.com App's homepage — Then, tap Crypto Earn to enter the Crypto Earn product page; Select our preferred token and term to make an allocation — Once the allocation is confirmed, rewards will start to accrue immediately“" } },
  "traders-place-krypto": { zinsfreiAbStart: { url: "https://tradersplace.de/service/service/konditionen", stand: "23.09.2026", hinweis: "„Zinssätze Verrechnungskonto (gem. Sonderkonditionen zum Preis- und Leistungsverzeichnis der Baader Bank) — EUR-Verrechnungskonto: Guthabenzinssatz 0% p.a.“ und „Fremdwährungs-Verrechnungskonto (USD, CHF, GBP): Guthabenzinssatz 0% p.a.“; das Zinskonto ist getrennt: „Um das Zinskonto zu eröffnen, benötigst du ein Traders Place Depot.“ (tradersplace.de/angebot/uebersicht/zinskonto)" }, zinsfreiesModell: { url: "https://tradersplace.de/service/service/konditionen", stand: "23.09.2026", hinweis: "„Wertpapierverwahrung (Baader Bank) — Depotführung: kostenlos — Verrechnungskonto: kostenlos“; im Preis- und Leistungsverzeichnis ist kein kostenpflichtiges Kontomodell und kein Abo aufgeführt" } },
  "trade-republic-krypto": { zinsfreiAbStart: { url: "https://traderepublic.com/de-de/zinsen", stand: "23.09.2026", hinweis: "„Aktiviere Zinsen in der App und erhalte jeden Monat Geld auf dein unbegrenztes Cash-Guthaben.“ / FAQ „Kann ich die Zinsen deaktivieren?“: „Ja, du kannst die Zinsen in der App deaktivieren, indem du zum Tab ‚Cash‘ > Kachel ‚Zinsen‘ > ‚Verwalten‘ > ‚Deaktivieren‘ navigierst. Wenn du sie deaktivierst, erhältst du auf nicht investiertes Cash keine Zinsen mehr. Du kannst deine Zinsen jederzeit auf demselben Weg wieder aktivieren.“ Das Trade-Republic-Girokonto steht aus demselben Grund auf teils: es nutzt dasselbe Cash-Guthaben. Ob Zinsen bei einem neuen Konto schon laufen, ist nur in der App zu sehen." }, zinsfreiesModell: { url: "https://traderepublic.com/de-de?openModal=pricing-scheme", stand: "23.09.2026", hinweis: "Preisübersicht, Zeile „Girokonto“: „Wir verlangen keine Gebühren für unser Girokonto.“ — Startseite: „Keine monatlichen Kosten.“ (Contentful-Feld „No monthly card subscription fee - Homepage“); die Preisübersicht führt kein kostenpflichtiges Kontomodell" } },
  "scalable-capital-krypto": { zinsfreiAbStart: { url: "https://de.scalable.capital/zinsuebersicht", stand: "23.09.2026", hinweis: "Tabelle „Aktuelle Zinsen“: „Verrechnungskonten — Mit PRIME+ 0 % p.a.* — Ohne PRIME+ 0 % p.a.*“ (Tagesgeld ist ein getrennt zu eröffnendes Konto); Krypto läuft über ETPs: „Aus 32 Kryptowährungen als ETPs wählen und optional von Staking Rewards zwischen 3 und 5 % p.a. profitieren.“ (de.scalable.capital/kryptowaehrung)" }, zinsfreiesModell: { url: "https://de.scalable.capital/prime-plus-broker", stand: "23.09.2026", hinweis: "„Mit PRIME+ machen Sie mehr aus Ihrem Geld. Für nur 4,99 € im Monat.“ / „PRIME+ richtet sich an alle, die regelmäßig handeln und sich zusätzliche Vorteile sichern möchten, darunter unbegrenzte Sparpläne, eine Trading-Flatrate für qualifizierte Trades, niedrigere Crypto-Spreads, erweiterter Einlagenschutz* und exklusive Funktionen.“ — Tagesgeldzins laut Zinsübersicht mit und ohne PRIME+ identisch (2,60 % p.a.)" } },
  "flatex-krypto": { zinsfreiAbStart: { url: "https://konto.flatex.de/formularcenter_bank/public/1300100.pdf", stand: "23.09.2026", hinweis: "Cash-Konto Zinssätze ... Guthabenzins (freibleibend) 0,00 % p. a." }, zinsfreiesModell: { url: "https://konto.flatex.de/formularcenter_bank/public/1300100.pdf", stand: "23.09.2026", hinweis: "1. Konto & Depot Konto-/Depotführung Wertpapierdepot kostenfrei Cash-Konto kostenfrei Fremdwährungskonto kostenfrei" } },
  "bitpanda-standard": { zinsfreiesModell: { url: "https://www.bitpanda.com/de/bitpanda-club", stand: "23.09.2026", hinweis: "Wie werde ich ein Gold Member? Unser Premium-Service basiert auf deinem Trade-Volumen, d. h. 100k in einem der letzten 6 Monate, Assets + Fiat-Guthaben über 400 € und mindestens 5 Trades." } },
  "bitpanda-fusion": { zinsfreiesModell: { url: "https://www.bitpanda.com/de/fusion", stand: "23.09.2026", hinweis: "Degressive Gebührenstruktur: Je mehr du tradest, desto geringer die Gebühren. Deine Gebührenstufe berechnet sich automatisch anhand deines fortlaufenden Trading-Volumens der letzten 30 Tage – ohne manuelle Anträge oder Stufen-Sperren." } },
  "21bitcoin-app": { zinsfreiAbStart: { url: "https://help.21bitcoin.app/de/articles/12831158-ein-blick-auf-die-bitcoin-geschafte-von-21bitcoin", stand: "23.09.2026", hinweis: "Verleiht 21bitcoin meine Bitcoin? Wir lassen niemanden deine Bitcoin ausleihen oder Zinsen darauf verdienen. Das heißt, du kannst rund um die Uhr auf deine Bitcoin zugreifen." }, zinsfreiesModell: { url: "https://21bitcoin.app/gebuehren", stand: "23.09.2026", hinweis: "Kontogebühren Kontoeröffnung & Kontoführung €0 Versicherte BTC Verwahrung €0 ... Konto-, Depot- oder Verwahrgebühren gibt es nicht." } },
  "bsdex-standard": { zinsfreiAbStart: { url: "https://www.bsdex.de/", stand: "23.09.2026", hinweis: "Schriftlich bestätigt vom BSDEX-Support am 21.09.2026 (Ticket 609033): Staking läuft nur nach eigener Freigabe. „Möchten Sie am künftigen Staking-Angebot von BSDEX teilnehmen, ist es erforderlich, dass Sie die AGB akzeptieren und uns Ihre Weisung geben.“ Die Weisung wird als Pop-up in der App angezeigt und kann abgelehnt werden: „Sie können einfach auf ‚Ablehnen‘ im Pop-up klicken und sich wie gewohnt in Ihren BSDEX Account einloggen.“ Ohne diese Weisung werden keine Coins gestakt, das Konto ist also von Anfang an zinsfrei nutzbar. Die AGB-Zustimmung selbst ist für Neukunden Pflicht, löst aber kein Staking aus." }, zinsfreiesModell: { url: "https://www.bsdex.de/de/fees/", stand: "23.09.2026", hinweis: "Darüber hinaus werden keine weiteren Kosten für die Transaktion der Euro-Beträge und Kryptowährungen sowie deren Verwahrung erhoben." } },
  "relai-app": {
    zinsfreiAbStart: { url: "https://relai.app/de/", stand: "23.09.2026", hinweis: "Schriftlich bestätigt vom Relai-Support am 21.09.2026 (Antwort des Assistenten „Relai AI“): „In der Relai App gibt es keine Zinsen, Rewards oder automatische Erträge auf Guthaben.“ und „Es gibt kein Abo oder Kontomodell, das Zinsen, Staking oder gebundene Token enthält. Funktionen wie Margin, Hebel oder Lending sind in der App nicht vorgesehen.“ Dazu relai.app: „Die gekauften Bitcoin werden automatisch in dein persönliches Self-Custody-Wallet in der App übertragen und gehören von Anfang an dir.“" },
    zinsfreiesModell: { url: "https://relai.app/de/", stand: "23.09.2026", hinweis: "Schriftlich bestätigt vom Relai-Support am 21.09.2026 (Antwort des Assistenten „Relai AI“): „In der Relai App gibt es keine Zinsen, Rewards oder automatische Erträge auf Guthaben.“ und „Es gibt kein Abo oder Kontomodell, das Zinsen, Staking oder gebundene Token enthält. Funktionen wie Margin, Hebel oder Lending sind in der App nicht vorgesehen.“ Dazu relai.app: „Die gekauften Bitcoin werden automatisch in dein persönliches Self-Custody-Wallet in der App übertragen und gehören von Anfang an dir.“" },
  },
  "finanzen-net-zero-krypto": {
    zinsfreiAbStart: { url: "https://www.finanzen.net/zero/", stand: "22.09.2026", hinweis: "Schriftlich bestätigt vom finanzen.net-zero-Support am 22.09.2026 (Anfrage 3706816): „Wir bieten aktuell weder ein Modell noch ein Konto an, bei dem wir Zinsen ausschütten. Ein Abomodell wird ebenfalls nicht angeboten.“" },
    zinsfreiesModell: { url: "https://www.finanzen.net/zero/", stand: "22.09.2026", hinweis: "Schriftlich bestätigt vom finanzen.net-zero-Support am 22.09.2026 (Anfrage 3706816): „Wir bieten aktuell weder ein Modell noch ein Konto an, bei dem wir Zinsen ausschütten. Ein Abomodell wird ebenfalls nicht angeboten.“" },
  },
  "kraken-pro": {
    zinsfreiesModell: { url: "https://support.kraken.com/articles/202967016-how-to-trade-using-margin", stand: "21.09.2026", hinweis: "Kraken-Hilfe: Margin wird nur auf Wunsch zugeschaltet, „Oben im Order Form Widget findest du einen Schalter zum Aktivieren der Margin.“ Kraken+ mit höheren Rewards ist ein freiwilliges Abo." },
  },
  "kraken-standard": {
    zinsfreiesModell: { url: "https://support.kraken.com/articles/202967016-how-to-trade-using-margin", stand: "21.09.2026", hinweis: "Kraken-Hilfe: Margin wird nur auf Wunsch zugeschaltet, „Oben im Order Form Widget findest du einen Schalter zum Aktivieren der Margin.“" },
  },
  "okx-trading": {
    zinsfreiAbStart: { url: "https://www.okx.com/en-us/help/introduction-to-trading-account-auto-earn-and-its-rules", stand: "21.09.2026", hinweis: "OKX-Hilfe: „By default, Trading Account Auto Earn is not enabled in users' accounts.“" },
    zinsfreiesModell: { url: "https://www.okx.com/en-us/help/introduction-to-spot-mode-eea", stand: "21.09.2026", hinweis: "OKX-Hilfe (EWR): „In spot mode, only spot trading is available to users, while margin and X-Perps are not supported.“" },
  },
  "binance-pro": {
    zinsfreiAbStart: { url: "https://www.binance.com/en/support/faq/detail/3bd1a6eba20a445da1e94bf6cfa52e80", stand: "21.09.2026", hinweis: "Binance-Hilfe: Simple Earn nur nach eigenem Einschalten, „You can enable Auto-Subscribe for Flexible Products from the subscription pop-up or your Earn Account.“" },
    zinsfreiesModell: { url: "https://www.binance.com/en/support/faq/detail/360030486471", stand: "21.09.2026", hinweis: "Binance-Hilfe: Margin ist ein eigenes Konto, erst nach Quiz: „You must answer all the questions correctly to open a Binance Margin Account.“" },
  },
  "bison-app": {
    zinsfreiAbStart: { url: "https://support.bisonapp.com/hc/de/articles/21476294743709-Staking-Prozess-Aktivierung-Entstaken-und-Rewards", stand: "21.09.2026", hinweis: "BISON-Hilfe: Staking nur nach eigener Anmeldung, „wie du deine Kryptowährungen aktiv zum Staking anmeldest“ … „Klicke auf „Jetzt staken“ und bestätige die Menge“." },
    zinsfreiesModell: { url: "https://bisonapp.com/select/", stand: "23.09.2026", hinweis: "Gibt es eine Membership-Gebühr? BISON Select ist unsere Art, uns bei unseren wertvollsten Kunden zu bedanken. Es fällt keine Membership-Gebühr an." },
  },
  "etoro-krypto": {
    zinsfreiAbStart: { url: "https://help.etoro.com/s/article/How-do-I-earn-staking-rewards?language=en_GB", stand: "21.09.2026", hinweis: "eToro-Hilfe: „If you are a client of eToro (Europe) Ltd, you will need to opt in to receive staking rewards.“ Kunden in Deutschland gehören zu eToro (Europe)." },
    zinsfreiesModell: { url: "https://www.etoro.com/de/about/club/", stand: "23.09.2026", hinweis: "Platin $25.000 Kontostufe -ODER- 4,99€ pro Monat / Platin+ $50.000 Kontostufe -ODER- 14,99 € pro Monat ... Erhalten Sie sofortigen Zugang zu Platinum oder Platinum+ mit einem etoro-Club-Abonnement ... Zinsen auf USD-Barguthaben in allen anderen Regionen 0,75% 2,50% 3,50% 3,80% ... Krypto-Staking 45% 55% 65% 75% 85% 90%" },
  },
  "revolut-krypto": {
    zinsfreiAbStart: { url: "https://help.revolut.com/en-DE/help/wealth/cryptocurrencies/crypto-staking/auto-staking/", stand: "21.09.2026", hinweis: "Revolut-Hilfe (Deutschland): Staking läuft automatisch, „if you buy 100 ADA, it will be auto-staked“, lässt sich aber abschalten: „Tap the 'Auto-earn' toggle to disable it“." },
    zinsfreiesModell: { url: "https://www.revolut.com/de-DE/our-pricing-plans/", stand: "23.09.2026", hinweis: "Revolut-Abovergleich: Premium (8,99 Euro im Monat) wirbt mit 'Schalte Marken-Abonnements und höhere Sparzinsen im Wert von 2.250 Euro pro Jahr frei' und 'Für das gewisse Extra im Alltag mit exklusiven Abos, besseren Zinssätzen und unbegrenztem Geldumtausch'. Die kostenpflichtige Stufe verkauft also ausdrücklich bessere Zinsen." },
  },
  "bitget-trading": {
    zinsfreiesModell: { url: "https://www.bitget.com/support/articles/12560603820603", stand: "21.09.2026", hinweis: "Bitget-Hilfe: Margin ist ein eigenes Konto, „Transfer your fund to Margin account“." },
    zinsfreiAbStart: { url: "https://www.bitget.com/de/support/articles/12560603826506", stand: "23.09.2026", hinweis: "Wenn Sie das Earn-Produkt abonnieren, werden die Assets von Ihrem Spot-Konto abgebucht. ... Schritt 2: Abonnieren Sie „Simple Earn Flexible“ ... Schritt 3: Auto-Subscribe aktivieren (optional)" },
  },
  "binance-standard": {
    zinsfreiAbStart: { url: "https://www.binance.com/en/support/faq/detail/3bd1a6eba20a445da1e94bf6cfa52e80", stand: "21.09.2026", hinweis: "Binance-Hilfe: Simple Earn nur nach eigenem Einschalten, „You can enable Auto-Subscribe for Flexible Products from the subscription pop-up or your Earn Account.“" },
    zinsfreiesModell: { url: "https://www.binance.com/en/support/faq/detail/360030486471", stand: "21.09.2026", hinweis: "Binance-Hilfe: Margin ist ein eigenes Konto, erst nach Quiz: „You must answer all the questions correctly to open a Binance Margin Account.“" },
  },
  "justtrade-krypto": {
    zinsfreiAbStart: { url: "https://www.justtrade.com/faq", stand: "21.09.2026", hinweis: "Schriftlich bestätigt vom justTRADE-Kundenservice am 21.09.2026 (Anfrage #128140): „Gerne bestätigen wir Ihnen, dass Sie nicht automatisch Ausschüttungen in Form von Zinsen oder Staking erhalten. Das Staking kann flexibel aktiviert werden … Eine Verzinsung auf das Guthaben erfolgt bei uns ebenfalls nicht.“" },
    zinsfreiesModell: { url: "https://www.justtrade.com/fileadmin/Formulare/Preis-und-Leistungsverzeichnis.pdf", stand: "23.09.2026", hinweis: "1 Konto und Depot Konto-/Depotführung Verrechnungskonto Euro kostenfrei Depotführung/-auflösung kostenfrei ... Die Verwahrung der Kryptowerte erfolgt durch die Tangany GmbH auf Grundlage eines gesondert abzuschließenden unentgeltlichen Verwahrvertrags." },
  },
  "bitvavo-standard": {
    zinsfreiAbStart: { url: "https://support.bitvavo.com/hc/de/articles/4405227858449", stand: "20.09.2026", hinweis: "Bitvavo beschreibt Erträge als aktivierbare Funktion; ohne Aktivierung wird das Guthaben nicht automatisch verzinst." },
    zinsfreiesModell: { url: "https://support.bitvavo.com/hc/de/articles/4405243949841-Staking-at-Bitvavo", stand: "21.09.2026", hinweis: "Schriftlich bestätigt vom Bitvavo-Kundenservice am 18.09.2026 (Ticket #1934199): „es gibt bei uns kein Kontomodell, das automatisch Zinsen auf ungenutztes Euro-Guthaben generiert“. „Auto Earn“ ist „nicht automatisch aktiv“, Margin- und Hebelhandel sind „bei Kontoeröffnung nicht aktiviert“." },
  },
  "smartbroker-plus-krypto": {
    zinsfreiAbStart: { url: "https://www.smartbrokerplus.de/de-de/kryptowaehrungen-kaufen/", stand: "21.09.2026", hinweis: "Schriftlich bestätigt vom Smartbroker+-Kundenservice am 16.09.2026: „Das Guthaben auf dem Zinskonto wird nicht verzinst. Wir bieten dafür ein Zinskonto an, was Sie eröffnen können aber nicht müssen.“ Gemeint ist das Verrechnungskonto; das Zinskonto ist freiwillig." },
    zinsfreiesModell: { url: "https://www.smartbrokerplus.de/de-de/kryptowaehrungen-kaufen/", stand: "21.09.2026", hinweis: "Schriftlich bestätigt vom Smartbroker+-Kundenservice am 16.09.2026: „Das Konto kann auch ohne Kreditfunktionen genutzt werden.“ Das Zinskonto ist freiwillig." },
  },
};

/** Kaufbar-Treffer, die trotz Beleg bis zur Gegenprobe nicht gezeigt werden: ISIN -> Anbieter.
 *  Die beiden TR-Invesco-Goldtreffer stehen im öffentlichen Katalog, widersprechen aber der App. */
export const KAUFBAR_UNKLAR: Record<string, string[]> = {
  IE00B579F325: ["Trade Republic"],
  XS3384723154: ["Trade Republic"],
};
