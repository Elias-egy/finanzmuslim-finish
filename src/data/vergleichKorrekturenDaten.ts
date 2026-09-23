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
  "klarna-guthaben": { keinDispoAbStart: "gut" },
  "monese-pay-as-you-go": { zinsfreiAbStart: "gut", keinDispoAbStart: "gut" },
  "pax-bank-pax-bck-individuell": { keinDispoAbStart: "gut" },
  "trade-republic-girokonto": { zinsfreiAbStart: "teils" },
  "berliner-volksbank-girokonto": { zinsfreiAbStart: "gut" },
  "psd-bank-n-rnberg-girodirekt": { zinsfreiAbStart: "gut", keinDispoAbStart: "gut" },
};

export const GIRO_QUELLEN: Quellen = {
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
  "klarna-guthaben": { keinDispoAbStart: { url: "https://cdn.klarna.com/1.0/shared/content/legal/terms/0/de_de/general_conditions_account", stand: "21.09.2026", hinweis: "Klarna-AGB: „Das Klarna Bankkonto hat keine Überziehungsfunktion, d. h. dein Klarna Bankkonto kann nicht unter null fallen.“" } },
  "monese-pay-as-you-go": { zinsfreiAbStart: { url: "https://www.monese.com/terms/eu-other-personal-terms-and-conditions-09-10-2025", stand: "21.09.2026", hinweis: "Monese-AGB (EU): „As your Monese Account is an e-money account, the law doesn’t let us pay you interest“." }, keinDispoAbStart: { url: "https://support.monese.com/en/articles/41-why-is-my-account-balance-negative", stand: "21.09.2026", hinweis: "Monese-Hilfe: „It’s also worth remembering that we don’t offer overdrafts at the moment.“" } },
  "pax-bank-pax-bck-individuell": { keinDispoAbStart: { url: "https://www.pax-bank.de/privatkunden/kredit-baufinanzierung/kredit/dispokredit.html", stand: "21.09.2026", hinweis: "Pax-Bank: Der Dispo wird selbst beantragt, „So beantragen Sie innerhalb weniger Minuten und ohne viel Papierkram Ihren Dispokredit.“" } },
  "trade-republic-girokonto": { zinsfreiAbStart: { url: "https://traderepublic.com/de-de/zinsen", stand: "21.09.2026", hinweis: "Trade Republic: „Aktiviere Zinsen in der App“ und „Ja, du kannst die Zinsen in der App deaktivieren, indem du zum Tab „Cash“ > Kachel „Zinsen“ > „Verwalten“ > „Deaktivieren“ navigierst.“ Ob sie ab Eröffnung laufen, sagt die Seite nicht eindeutig, deshalb teils." } },
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
  "binance-pro": kryptoOptIn,
  "binance-standard": kryptoOptIn,
  "bison-app": kryptoOptIn,
  "bitget-trading": kryptoOptIn,
  "bitvavo-standard": kryptoOptIn,
  "coinbase-advanced": kryptoOptIn,
  "coinbase-standard": kryptoOptIn,
  "etoro-krypto": kryptoOptIn,
  "finanzen-net-zero-krypto": kryptoOptIn,
  "finst-standard": kryptoOptIn,
  "flatex-krypto": kryptoOptIn,
  "justtrade-krypto": kryptoOptIn,
  "kraken-pro": kryptoOptIn,
  "kraken-standard": kryptoOptIn,
  "okx-trading": kryptoOptIn,
  "revolut-krypto": { zinsfreiAbStart: "teils" },
  "scalable-capital-krypto": kryptoOptIn,
  "smartbroker-plus-krypto": kryptoOptIn,
  "trade-republic-krypto": kryptoOptIn,
  "traders-place-krypto": kryptoOptIn,
  "relai-app": kryptoOptIn,
  "bsdex-standard": { zinsfreiAbStart: "gut" },
};

export const KRYPTO_QUELLEN: Quellen = {
  "bsdex-standard": { zinsfreiAbStart: { url: "https://www.bsdex.de/", stand: "23.09.2026", hinweis: "Schriftlich bestätigt vom BSDEX-Support am 21.09.2026 (Ticket 609033): Staking läuft nur nach eigener Freigabe. „Möchten Sie am künftigen Staking-Angebot von BSDEX teilnehmen, ist es erforderlich, dass Sie die AGB akzeptieren und uns Ihre Weisung geben.“ Die Weisung wird als Pop-up in der App angezeigt und kann abgelehnt werden: „Sie können einfach auf ‚Ablehnen‘ im Pop-up klicken und sich wie gewohnt in Ihren BSDEX Account einloggen.“ Ohne diese Weisung werden keine Coins gestakt, das Konto ist also von Anfang an zinsfrei nutzbar. Die AGB-Zustimmung selbst ist für Neukunden Pflicht, löst aber kein Staking aus." } },
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
  },
  "etoro-krypto": {
    zinsfreiAbStart: { url: "https://help.etoro.com/s/article/How-do-I-earn-staking-rewards?language=en_GB", stand: "21.09.2026", hinweis: "eToro-Hilfe: „If you are a client of eToro (Europe) Ltd, you will need to opt in to receive staking rewards.“ Kunden in Deutschland gehören zu eToro (Europe)." },
  },
  "revolut-krypto": {
    zinsfreiAbStart: { url: "https://help.revolut.com/en-DE/help/wealth/cryptocurrencies/crypto-staking/auto-staking/", stand: "21.09.2026", hinweis: "Revolut-Hilfe (Deutschland): Staking läuft automatisch, „if you buy 100 ADA, it will be auto-staked“, lässt sich aber abschalten: „Tap the 'Auto-earn' toggle to disable it“." },
  },
  "bitget-trading": {
    zinsfreiesModell: { url: "https://www.bitget.com/support/articles/12560603820603", stand: "21.09.2026", hinweis: "Bitget-Hilfe: Margin ist ein eigenes Konto, „Transfer your fund to Margin account“." },
  },
  "binance-standard": {
    zinsfreiAbStart: { url: "https://www.binance.com/en/support/faq/detail/3bd1a6eba20a445da1e94bf6cfa52e80", stand: "21.09.2026", hinweis: "Binance-Hilfe: Simple Earn nur nach eigenem Einschalten, „You can enable Auto-Subscribe for Flexible Products from the subscription pop-up or your Earn Account.“" },
    zinsfreiesModell: { url: "https://www.binance.com/en/support/faq/detail/360030486471", stand: "21.09.2026", hinweis: "Binance-Hilfe: Margin ist ein eigenes Konto, erst nach Quiz: „You must answer all the questions correctly to open a Binance Margin Account.“" },
  },
  "justtrade-krypto": {
    zinsfreiAbStart: { url: "https://www.justtrade.com/faq", stand: "21.09.2026", hinweis: "Schriftlich bestätigt vom justTRADE-Kundenservice am 21.09.2026 (Anfrage #128140): „Gerne bestätigen wir Ihnen, dass Sie nicht automatisch Ausschüttungen in Form von Zinsen oder Staking erhalten. Das Staking kann flexibel aktiviert werden … Eine Verzinsung auf das Guthaben erfolgt bei uns ebenfalls nicht.“" },
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
