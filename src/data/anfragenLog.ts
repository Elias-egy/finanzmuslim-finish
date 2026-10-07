/**
 * Was wir welchen Anbieter wann gefragt haben, und was zurückkam. HANDGEPFLEGT.
 *
 * Zweck: Keine Frage zweimal stellen, und je Anbieter auf einen Blick sehen, welches
 * Fragezeichen noch offen ist. Wird nur vom Prüfstand gelesen (scripts/pruefstand.ts),
 * gehört nicht zur ausgelieferten Website.
 *
 * Schlüssel ist das Haus (`haus` in den Vergleichsdateien), damit alle Tarife eines
 * Anbieters dieselbe Historie zeigen.
 */

export type Vorgang = {
  datum: string;
  richtung: "raus" | "rein";
  kanal: "Mail" | "Ticket" | "Formular" | "App" | "Chat";
  adresse?: string;
  /** Ticket-, Vorgangs- oder Anfragenummer, falls es eine gibt. */
  zeichen?: string;
  /** Ein Satz: was gefragt wurde, oder was geantwortet wurde. */
  kern: string;
  /** Absender bei ausgehenden Mails. Ohne Angabe: Runden 1 bis 3 (16. bis 23.09.2026) kamen meist von eliaselgendy2006@gmail.com, die Einzelmails vom 24.09.2026 von elias@finanzmuslim.com. Ab 26.09.2026 gehen gebündelte Anfragen immer von elias@finanzmuslim.com (Elias-Ansage 25.09.2026). */
  von?: "elias@finanzmuslim.com" | "eliaselgendy2006@gmail.com" | "eliaselgendy566@gmail.com";
  /** Automatische Eingangsbestätigung oder Autoantwort ohne Inhalt. Zählt nicht als Antwort (scripts/anfragen-offen.ts). */
  automatisch?: true;
};

export type Anfrage = {
  anbieter: string;
  vorgaenge: Vorgang[];
  /** Was als Nächstes zu tun ist. Leer heißt: nichts offen. */
  naechsterSchritt?: string;
  /** Kein Postfach, nur Chat, Formular oder App. */
  keinMailWeg?: boolean;
};

const frage1 = "Runde 1: Verzinsung automatisch? dauerhaft abschaltbar? wirklich keine Zinsen? ohne Kredit nutzbar?";
const frage2 = "Runde 2: Wird nicht investiertes Guthaben automatisch verzinst, und kann ich ab Eröffnung dauerhaft verzichten? Dispo nur auf eigenen Antrag?";

const frage3 = "Runde 3 (23.09.2026): Wird nicht investiertes Guthaben automatisch verzinst und kann ich ab Eröffnung dauerhaft verzichten? Kommt ein Kredit oder Dispo automatisch dazu?";

export const ANFRAGEN: Record<string, Anfrage> = {
  xtb: { anbieter: "XTB", vorgaenge: [
    { datum: "16.09.2026", richtung: "raus", kanal: "Mail", adresse: "info@xtb.de", kern: frage1 },
    { datum: "16.09.2026", richtung: "rein", kanal: "Mail", kern: "Nicht zinsfrei nutzbar. Bleibt rot, kein Partnerlink, Kampagne 2002 nicht einbauen." },
  ] },
  lynx: { anbieter: "LYNX", vorgaenge: [
    { datum: "16.09.2026", richtung: "raus", kanal: "Mail", adresse: "service@lynxbroker.de", kern: frage1 },
    { datum: "17.09.2026", richtung: "rein", kanal: "Mail", kern: "Kein zinsfreies Kontomodell, keine Garantie auf Zinsverzicht. Rot." },
  ] },
  captrader: { anbieter: "CapTrader", vorgaenge: [
    { datum: "16.09.2026", richtung: "raus", kanal: "Mail", adresse: "info@captrader.com", kern: frage1 },
    { datum: "17.09.2026", richtung: "rein", kanal: "Mail", kern: "„immer automatisch verzinst“. Rot." },
  ] },
  c24: { anbieter: "C24", vorgaenge: [
    { datum: "16.09.2026", richtung: "raus", kanal: "Mail", adresse: "kundenservice@c24.de", kern: frage1 },
    { datum: "17.09.2026", richtung: "rein", kanal: "Mail", kern: "Automatisch verzinst, Verzicht „auch nicht schriftlich“ möglich. Rot." },
  ] },
  bbva: { anbieter: "BBVA", vorgaenge: [
    { datum: "16.09.2026", richtung: "raus", kanal: "Mail", adresse: "kundenservice@bbva.de", kern: frage1 },
    { datum: "17.09.2026", richtung: "rein", kanal: "Mail", kern: "Ablehnen der Zinsen nicht möglich. Rot." },
  ] },
  bitvavo: { anbieter: "Bitvavo", vorgaenge: [
    { datum: "16.09.2026", richtung: "raus", kanal: "Mail", adresse: "support@bitvavo.com", kern: frage1 },
    { datum: "18.09.2026", richtung: "rein", kanal: "Ticket", zeichen: "#1934199", kern: "Kein automatisches Staking. Bezahlmodell grün." },
  ] },
  smartbroker: { anbieter: "Smartbroker+", vorgaenge: [
    { datum: "16.09.2026", richtung: "raus", kanal: "Mail", adresse: "kundenservice@smartbrokerplus.de", kern: frage1 },
    { datum: "16.09.2026", richtung: "rein", kanal: "Mail", kern: "Guthaben nicht verzinst, Zinskonto optional, ohne Kreditfunktion nutzbar. Grün." },
    { datum: "26.09.2026", richtung: "raus", kanal: "Mail", adresse: "kundenservice@smartbrokerplus.de", kern: "Gebündelte Anfrage als finanzmuslim.com: Kaufbarkeit der vier HSBC-ETFs, in der Wertpapiersuche nicht gefunden.", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort auf die gebündelte Anfrage vom 26.09. abwarten." },
  bitget: { anbieter: "Bitget", vorgaenge: [
    { datum: "16.09.2026", richtung: "raus", kanal: "Mail", adresse: "support@bitget.com", kern: frage1 },
  ], naechsterSchritt: "Antwortet nur über das eigene Ticket-Portal. Mail läuft ins Leere." },
  "interactive-brokers": { anbieter: "Interactive Brokers", vorgaenge: [
    { datum: "16.09.2026", richtung: "raus", kanal: "Formular", kern: "Kontaktformular, 400 Zeichen. Keine Antwort." },
  ], keinMailWeg: true, naechsterSchritt: "Kein Postfach, nur das Mitteilungscenter im Client Portal. Braucht einen Zugang." },
  hvb: { anbieter: "HypoVereinsbank", vorgaenge: [
    { datum: "16.09.2026", richtung: "raus", kanal: "Mail", adresse: "info@unicredit.de", kern: frage1 },
    { datum: "21.09.2026", richtung: "raus", kanal: "Mail", adresse: "info@unicredit.de", kern: frage2 },
    { datum: "21.09.2026", richtung: "rein", kanal: "Mail", adresse: "smartbanking@unicredit.de", kern: "Girokonten: Guthaben nicht verzinst, Dispo nur auf Antrag. Depots: „grundsätzlich nicht verzinst“ — das widerspricht dem eigenen Produktprofil (0,50 % Sonderzins bis 31.12.2026)." },
    { datum: "23.09.2026", richtung: "raus", kanal: "Mail", adresse: "smartbanking@unicredit.de", kern: "Rückfrage zum Widerspruch: Ist das HVB Investmentkonto das Verrechnungskonto zum Depot, und läuft der Sonderzins von 0,50 Prozent für Neukunden automatisch?" },
    { datum: "25.09.2026", richtung: "rein", kanal: "Mail", adresse: "info@unicredit.de", kern: "Antwort auf die Mail vom 21.09. (Smart Banking Team): Girokonto „wird NICHT verzinst“, Dispo nur auf eigene Anfrage. Bestätigt die grünen Girokonten, beantwortet die Depot-Rückfrage vom 23.09. nicht; die geht gebündelt am 28.09. neu raus.", von: "eliaselgendy2006@gmail.com" },
    { datum: "28.09.2026", richtung: "raus", kanal: "Mail", adresse: "smartbanking@unicredit.de", kern: "In Zoho am 26.09. eingeplant für 28.09., 10 Uhr. Gebündelte Anfrage als finanzmuslim.com: HVB Depot oder SmartDepot mit AktivKonto statt Investmentkonto? Sonderzins automatisch? Girokonten je Stufe, Kaufbarkeit aller 22 ISINs.", von: "elias@finanzmuslim.com" },
    { datum: "28.09.2026", richtung: "rein", kanal: "Mail", adresse: "smartbanking@unicredit.de", automatisch: true, kern: "Automatische Eingangsbestätigung des Smart Banking Teams." },
    { datum: "01.10.2026", richtung: "rein", kanal: "Mail", kern: "HVB Media Relations (Zoho INBOX 445): Alle Girokonten als Buchungskonto für HVB Depot und SmartDepot möglich, „Die Gutschrift der Verzinsung erfolgt automatisch auf das Investmentkonto.“ AktivKonto und PlusKonto ohne Guthabenverzinsung, Dispo nur auf aktiven Antrag. Alle 22 ISINs: Einmalanlage ja, Sparplan nein, eine Tabelle für beide Depots. Ausgabeaufschlag Comgest 4 %, Franklin 5,75 %, keine Mindestanlage. Kaufweg nicht genannt." },
  ], naechsterSchritt: "Elias entscheidet: Bleiben die Depots rot (Neukundenfall mit Investmentkonto, wie ING) oder gelb, weil das Depot auch mit dem unverzinsten AktivKonto läuft?" },
  "trade-republic": { anbieter: "Trade Republic", vorgaenge: [
    { datum: "16.09.2026", richtung: "raus", kanal: "Mail", adresse: "service@traderepublic.com", kern: frage1 },
    { datum: "16.09.2026", richtung: "rein", kanal: "Mail", automatisch: true, kern: "Automatische Antwort, will die Anfrage aus der App." },
  ], keinMailWeg: true, naechsterSchritt: "Nur In-App-Chat. Im Impressum steht allein eine Beschwerde-Adresse. Elias muss in der App fragen, ob Zinsen beim Neukonto sofort laufen." },
  santander: { anbieter: "Santander", vorgaenge: [
    { datum: "16.09.2026", richtung: "raus", kanal: "Mail", adresse: "impressum@santander.de", zeichen: "SCM5145440", kern: frage1 },
    { datum: "21.09.2026", richtung: "raus", kanal: "Mail", adresse: "impressum@santander.de", zeichen: "SCM5156656", kern: frage2 },
    { datum: "21.09.2026", richtung: "rein", kanal: "Mail", kern: "„Für Depots sind nur Filialen zuständig“. Keine inhaltliche Antwort." },
    { datum: "05.10.2026", richtung: "rein", kanal: "Mail", adresse: "email-service@santander.de", zeichen: "SCM5145440", kern: "Antwort an eliaselgendy2006@gmail.com zum BestGiro: Auf die „zeitlich befristeten Habenzinsen“ zu verzichten, sei „aus technischer und prozessualer Sicht“ nicht umsetzbar. Bestätigt rot für das BestGiro. Zum Wertpapierdepot sagt die Antwort nichts." },
    { datum: "07.10.2026", richtung: "raus", kanal: "Mail", adresse: "impressum@santander.de", kern: "Neue Mail als finanzmuslim.com: Kaufbarkeit der drei iShares Islamic ETFs, der vier HSBC Islamic ETFs, des iShares USD Sukuk ETF und der Gold- und Silber-ETCs von Invesco und WisdomTree im Wertpapierdepot. Dazu: Welches Konto ist das Verrechnungskonto zum Depot, und wird Guthaben darauf verzinst?", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort auf die Mail vom 07.10.2026 abwarten (Paket M1, Wortlaut unter belege/santander/99-m1-anfrage-2026-10-07.txt). Antworten mit anlage_setzen.py und Belegart schriftlich eintragen." },
  commerzbank: { anbieter: "Commerzbank", vorgaenge: [
    { datum: "21.09.2026", richtung: "raus", kanal: "Mail", adresse: "info@commerzbank.com", kern: frage2 },
    { datum: "22.09.2026", richtung: "rein", kanal: "Mail", kern: "„Aktuell wird Guthaben, dass Sie auf einem Girokonto oder Verrechnungskonto Plus anlegen nicht verzinst.“ Depots und Konten grün. Zum Dispo nur der allgemeine Hinweis auf die geduldete Überziehung." },
    { datum: "27.09.2026", richtung: "raus", kanal: "Mail", adresse: "info@commerzbank.com", kern: "In Zoho am 26.09. eingeplant für 27.09., 10 Uhr. Gebündelte Anfrage als finanzmuslim.com: Gilt „nicht verzinst“ für DirektDepot, KlassikDepot und PremiumDepot? Kaufbarkeit aller 22 Halal-ISINs je Depotmodell.", von: "elias@finanzmuslim.com" },
    { datum: "07.10.2026", richtung: "raus", kanal: "Mail", adresse: "info@commerzbank.com", kern: "Nachfass im Faden vom 27.09.: Kaufbarkeit der drei iShares Islamic ETFs, der vier HSBC Islamic ETFs, des iShares USD Sukuk ETF und der Gold- und Silber-ETCs von Invesco und WisdomTree im DirektDepot, KlassikDepot und PremiumDepot.", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort auf die Mail vom 07.10.2026 abwarten (Paket M1, Wortlaut unter belege/commerzbank/99-m1-anfrage-2026-10-07.txt). Antworten mit anlage_setzen.py und Belegart schriftlich eintragen." },
  finvesto: { anbieter: "finvesto / FNZ", vorgaenge: [
    { datum: "21.09.2026", richtung: "raus", kanal: "Mail", adresse: "service@fnz.de", kern: frage2 },
    { datum: "22.09.2026", richtung: "rein", kanal: "Mail", zeichen: "WF_46229739", kern: "„Das Guthaben auf dem Verrechnungskonto wird nicht verzinst.“ Grün." },
    { datum: "26.09.2026", richtung: "raus", kanal: "Mail", adresse: "service@fnz.de", zeichen: "WF_46229739", kern: "Gebündelte Anfrage als finanzmuslim.com: Gilt „nicht verzinst“ für Depot, Depot Basis und Wertpapierdepot? Kaufbarkeit von acht ISINs (ETCs, Franklin), beim Wertpapierdepot aller 22.", von: "elias@finanzmuslim.com" },
    { datum: "26.09.2026", richtung: "rein", kanal: "Mail", adresse: "noreply-service@fnz.de", zeichen: "813330104", automatisch: true, kern: "Automatische Eingangsbestätigung der gebündelten Anfrage." },
    { datum: "02.10.2026", richtung: "rein", kanal: "Mail", adresse: "Kundenberatung@finvesto.de", zeichen: "WF_46229739", kern: "Kundenberatung (Zoho INBOX 450): Verrechnungskonto in allen drei Modellen unverzinst („Ja.“). „ETCs können Sie über das Wertpapierdepot ordern, der Franklin Shariah Technology Fund A (acc) USD ist bei uns nicht handelbar.“ ETFs und Fonds im Wertpapierdepot nicht je ISIN beantwortet, Verweis auf die Fondssuche. Die Zusätze „(nur Wertpapierdepot)“ in der Mail stammen aus unserer Anfrage, nicht von finvesto." },
    { datum: "07.10.2026", richtung: "raus", kanal: "Mail", adresse: "Kundenberatung@finvesto.de", zeichen: "WF_46229739", kern: "Rückfragen im Faden zur Antwort vom 02.10.: Wertpapierdepot, drei iShares Islamic ETFs, vier HSBC Islamic ETFs und iShares USD Sukuk ETF über die Börse kaufbar? Depot und Depot Basis: Gold- und Silber-ETCs dort nicht, nur im Wertpapierdepot? Depot: Fällt je Ausführung eines ETF-Sparplans nur das ETF-Transaktionsentgelt von 0,20 % an oder zusätzlich 1,99 Euro?", von: "elias@finanzmuslim.com" },
    { datum: "07.10.2026", richtung: "rein", kanal: "Mail", adresse: "noreply-service@fnz.de", automatisch: true, kern: "Automatische Eingangsbestätigung (Zoho INBOX 571)." },
  ], naechsterSchritt: "Antwort auf die Mail vom 07.10.2026 abwarten (Paket M1, Wortlaut unter belege/finvesto/99-m1-anfrage-2026-10-07.txt). Antworten mit anlage_setzen.py und Belegart schriftlich eintragen." },
  "joe-broker": { anbieter: "JOE Broker", vorgaenge: [
    { datum: "21.09.2026", richtung: "raus", kanal: "Mail", adresse: "support@joebroker.de", kern: frage2 },
    { datum: "22.09.2026", richtung: "rein", kanal: "Ticket", zeichen: "JBSPROD-13897", kern: "Guthaben nicht verzinst. Eine geplante Verzinsung gilt nur für Konten, die nach deren Einführung eröffnet werden. Grün." },
    { datum: "26.09.2026", richtung: "raus", kanal: "Mail", adresse: "support@joebroker.de", zeichen: "JBSPROD-13897", kern: "Gebündelte Anfrage als finanzmuslim.com: Kaufbarkeit aller 22 Halal-ISINs samt Fondsaufschlag.", von: "elias@finanzmuslim.com" },
    { datum: "07.10.2026", richtung: "raus", kanal: "Mail", adresse: "support@joebroker.de", zeichen: "JBSPROD-13897", kern: "Nachfass im Faden vom 26.09.: Kaufbarkeit der drei iShares Islamic ETFs, der vier HSBC Islamic ETFs, des iShares USD Sukuk ETF und der Gold- und Silber-ETCs von Invesco und WisdomTree. Dazu: Fällt für das Depot eine Depotgebühr an?", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort auf die Mail vom 07.10.2026 abwarten (Paket M1, Wortlaut unter belege/joe-broker/99-m1-anfrage-2026-10-07.txt). Antworten mit anlage_setzen.py und Belegart schriftlich eintragen." },
  "berliner-volksbank": { anbieter: "Berliner Volksbank", vorgaenge: [
    { datum: "21.09.2026", richtung: "raus", kanal: "Mail", adresse: "service@berliner-volksbank.de", kern: frage2 },
    { datum: "22.09.2026", richtung: "rein", kanal: "Mail", kern: "Über 30 keine Guthabenverzinsung, blauorange nur mit Mitgliedschaft. Grün." },
  ] },
  "finanzen-net-zero": { anbieter: "finanzen.net zero", vorgaenge: [
    { datum: "21.09.2026", richtung: "raus", kanal: "Mail", adresse: "service@finanzen-zero.net", kern: frage2 },
    { datum: "22.09.2026", richtung: "rein", kanal: "Ticket", zeichen: "3706816", kern: "Weder Zinsmodell noch Abo. Krypto grün." },
    { datum: "27.09.2026", richtung: "raus", kanal: "Mail", adresse: "service@finanzen-zero.net", zeichen: "3706816", kern: "In Zoho am 26.09. eingeplant für 27.09., 10 Uhr. Gebündelte Anfrage als finanzmuslim.com: Ausgabeaufschlag und Mindestanlage für Comgest Growth Europe (IE00B4ZJ4634).", von: "elias@finanzmuslim.com" },
    { datum: "27.09.2026", richtung: "rein", kanal: "Mail", adresse: "service@finanzen-zero.net", zeichen: "3710028", automatisch: true, kern: "Zoho INBOX 339: Eingangsbestätigung mit neuer Vorgangsnummer 3710028. Bittet, künftig das Ticketsystem im Depot zu nutzen, meldet sich aber „persönlich“ zurück." },
  ], naechsterSchritt: "Versand belegt (Zoho Gesendet 87, 27.09. 10 Uhr), nur Eingangsbestätigung. Antwort abwarten." },
  bsdex: { anbieter: "BSDEX", vorgaenge: [
    { datum: "21.09.2026", richtung: "raus", kanal: "Mail", adresse: "support@bsdex.de", kern: frage2 },
    { datum: "21.09.2026", richtung: "rein", kanal: "Ticket", zeichen: "609033", kern: "Staking nur nach eigener ausdrücklicher Weisung im Pop-up, ablehnbar. Zinsfreie Nutzung ab Start möglich, deshalb grün (Elias, 23.09.)." },
  ] },
  "psd-nuernberg": { anbieter: "PSD Bank Nürnberg", vorgaenge: [
    { datum: "21.09.2026", richtung: "raus", kanal: "Mail", adresse: "info@psd-nuernberg.de", kern: frage2 },
    { datum: "23.09.2026", richtung: "rein", kanal: "Mail", kern: "Keine Guthabenverzinsung auf dem Girokonto, Dispo nur auf Wunsch mit Bonitätsprüfung. Beides grün." },
  ] },
  relai: { anbieter: "Relai", vorgaenge: [
    { datum: "21.09.2026", richtung: "raus", kanal: "Mail", adresse: "hello@relai.app", kern: frage2 },
    { datum: "21.09.2026", richtung: "rein", kanal: "Mail", kern: "Antwort des Assistenten „Relai AI“: keine Zinsen, keine Rewards, kein Abo, kein Staking, kein Margin oder Lending. Nach Elias' Regel vom 23.09. gilt das als Beleg. Grün." },
    { datum: "22.09.2026", richtung: "rein", kanal: "Mail", automatisch: true, kern: "Automatischer Nachfass derselben KI, ohne neuen Inhalt." },
  ] },
  "pax-bank": { anbieter: "Pax-Bank", vorgaenge: [
    { datum: "21.09.2026", richtung: "raus", kanal: "Mail", adresse: "info@pax-bkc.de", kern: frage2, von: "eliaselgendy2006@gmail.com" },
    { datum: "22.09.2026", richtung: "rein", kanal: "Mail", kern: "Dispo nicht automatisch, Girokonto grün. Zum Depot nur: „Im Depot selbst werden keine klassischen Sparzinsen gezahlt“ — das Verrechnungskonto bleibt unbeantwortet." },
    { datum: "23.09.2026", richtung: "raus", kanal: "Mail", adresse: "julia.vogt@pax-bkc.de", kern: "Rückfrage: Wird das Guthaben auf dem Verrechnungskonto zum Depot verzinst, und ist ein Verzicht ab Start möglich? Kursgewinne und Dividenden ausdrücklich ausgenommen.", von: "eliaselgendy2006@gmail.com" },
    { datum: "23.09.2026", richtung: "rein", kanal: "Mail", adresse: "teamberatung@pax-bkc.de", kern: "Julia Vogt: Zum Depot wird ein Anlageabwicklungskonto geführt, „auf dieses Guthaben wird aktuell keine Guthabenverzinsung gezahlt“. Ändert sich das später, wäre ein Verzicht nicht möglich. Gleiches Muster wie tradegate.direct („derzeit nicht verzinst“), beide Depots grün (Branch partner-links-2, 25.09.2026)." },
    { datum: "27.09.2026", richtung: "raus", kanal: "Mail", adresse: "julia.vogt@pax-bkc.de", kern: "In Zoho am 26.09. eingeplant für 27.09., 10 Uhr. Gebündelte Anfrage als finanzmuslim.com an Julia Vogt: Kaufbarkeit aller 22 Halal-ISINs für Online-Brokerage und Klassisches Depot.", von: "elias@finanzmuslim.com" },
    { datum: "07.10.2026", richtung: "raus", kanal: "Mail", adresse: "julia.vogt@pax-bkc.de", kern: "Nachfass im Faden vom 27.09. an Julia Vogt: Kaufbarkeit der drei iShares Islamic ETFs, der vier HSBC Islamic ETFs, des iShares USD Sukuk ETF und der Gold- und Silber-ETCs von Invesco und WisdomTree im Pax-Bank Depot (Online-Brokerage und klassisches Depot).", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort auf die Mail vom 07.10.2026 abwarten (Paket M1, Wortlaut unter belege/pax-bank/99-m1-anfrage-2026-10-07.txt). Antworten mit anlage_setzen.py und Belegart schriftlich eintragen." },
  "tradegate-direct": { anbieter: "tradegate.direct", vorgaenge: [
    { datum: "21.09.2026", richtung: "raus", kanal: "Mail", adresse: "support@tradegate.direct", kern: frage2 },
    { datum: "21.09.2026", richtung: "rein", kanal: "Ticket", zeichen: "SUP-5390", kern: "Verrechnungskonto „derzeit nicht verzinst“. Grün." },
    { datum: "27.09.2026", richtung: "raus", kanal: "Mail", adresse: "support@tradegate.direct", zeichen: "SUP-5390", kern: "In Zoho am 26.09. eingeplant für 27.09., 10 Uhr. Gebündelte Anfrage als finanzmuslim.com: Kaufbarkeit aller 22 Halal-ISINs, die Instrumentensuche zeigt kein Kaufmerkmal.", von: "elias@finanzmuslim.com" },
    { datum: "28.09.2026", richtung: "rein", kanal: "Ticket", zeichen: "SUP-5441", kern: "Handelsuniversum = alle an der Tradegate BSX gelisteten Aktien und ETPs, klassische Investmentfonds ausgenommen. Nicht sparplanfähig: Invesco ACWI, 4 × HSBC, 3 Fonds; alle anderen sparplanfähig. Eingetragen: 18 ja, 4 nein, Depot vollständig." },
  ], naechsterSchritt: "Erledigt: alle 22 ISINs belegt." },
  justtrade: { anbieter: "justTRADE", vorgaenge: [
    { datum: "21.09.2026", richtung: "raus", kanal: "Mail", adresse: "service@justtrade.com", kern: frage2 },
    { datum: "21.09.2026", richtung: "rein", kanal: "Ticket", zeichen: "#128140", kern: "Keine automatischen Ausschüttungen als Zins oder Staking. Zinsfrei ab Start grün, Abo und Margin unbeantwortet." },
    { datum: "23.09.2026", richtung: "raus", kanal: "Mail", adresse: "service@justtrade.com", kern: "Rückfrage zu #128140: Gibt es ein kostenpflichtiges Modell mit Zinsbindung, und sind Margin, Hebel und Wertpapierleihe ab Start aus?" },
    { datum: "23.09.2026", richtung: "rein", kanal: "Ticket", zeichen: "#128292", kern: "„Die Depoteröffnung und Depotführung ist gleichermaßen kostenfrei für alle Kunden. Der Handel findet ausschließlich auf Guthabenbasis ab.“ Bezahlmodell damit geklärt." },
    { datum: "26.09.2026", richtung: "raus", kanal: "Mail", adresse: "service@justtrade.com", zeichen: "#128292", kern: "Gebündelte Anfrage als finanzmuslim.com: Kaufbarkeit von 13 ISINs, die in Partner-Listen und Sparplanliste fehlen.", von: "elias@finanzmuslim.com" },
    { datum: "26.09.2026", richtung: "rein", kanal: "Ticket", zeichen: "#128412", automatisch: true, kern: "Automatische Eingangsbestätigung der gebündelten Anfrage." },
    { datum: "28.09.2026", richtung: "rein", kanal: "Ticket", zeichen: "#128412", kern: "Online als Einmalanlage handelbar (keine Sparpläne): Invesco DJ Islamic, Invesco ACWI, iShares Sukuk, Xtrackers Sukuk. „Den Handel von klassischen Fonds bieten wir generell nicht an“. HSBC ×4 und die zwei Invesco-ETCs nicht eindeutig beantwortet." },
    { datum: "28.09.2026", richtung: "raus", kanal: "Mail", adresse: "service@justtrade.com", zeichen: "#128412", kern: "Nachfrage im selben Ticket (Elias-Freigabe 17): HSBC ×4, IE00B579F325, IE00B43VDT70 je Einmalkauf ja/nein. Zoho Gesendet #100." },
    { datum: "28.09.2026", richtung: "rein", kanal: "Ticket", zeichen: "#128412", kern: "„Die von Ihnen genannten Wertpapiere sind derzeit bei uns nicht handelbar.“ Alle sechs nein. Depot vollständig: 6 von 12, 2 von 3, 5 von 7." },
  ], naechsterSchritt: "Erledigt 28.09.2026: alle 22 ISINs belegt." },
  ethikbank: { anbieter: "EthikBank", vorgaenge: [
    { datum: "21.09.2026", richtung: "raus", kanal: "Mail", adresse: "hallo@ethikbank.de", kern: frage2 },
    { datum: "21.09.2026", richtung: "rein", kanal: "Mail", kern: "Konto ohne Überziehungsmöglichkeit eröffenbar. Dispo grün." },
  ] },
  haspa: { anbieter: "Hamburger Sparkasse", vorgaenge: [
    { datum: "21.09.2026", richtung: "raus", kanal: "Mail", adresse: "haspa@haspa.de", kern: frage2 },
    { datum: "21.09.2026", richtung: "rein", kanal: "Mail", kern: "Guthaben unverzinst, aber „in der Regel“ ein Überziehungspuffer, nur per Sperre weg. Dispo steht auf teils." },
  ] },
  "meine-bank": { anbieter: "meine Bank", vorgaenge: [
    { datum: "21.09.2026", richtung: "raus", kanal: "Mail", adresse: "info@meinebank.de", kern: frage2 },
    { datum: "21.09.2026", richtung: "rein", kanal: "Mail", kern: "Guthaben nicht verzinst, kein automatischer Dispo. Beides grün." },
  ] },
  willbe: { anbieter: "WillBe", vorgaenge: [
    { datum: "21.09.2026", richtung: "raus", kanal: "Mail", adresse: "service@willbe-invest.com", kern: frage2 },
    { datum: "21.09.2026", richtung: "rein", kanal: "Mail", kern: "„Unsere Tagesgeldkonten werden automatisch verzinst … nicht möglich, auf diese Zinsen zu verzichten.“ Unklar, ob das Depotguthaben gemeint ist. Rot." },
    { datum: "23.09.2026", richtung: "raus", kanal: "Mail", adresse: "service@willbe-invest.com", kern: "Rückfrage: Ist das verzinste Tagesgeldkonto zugleich das Verrechnungskonto des Depots, und geht das Depot ohne verzinstes Konto?" },
    { datum: "28.09.2026", richtung: "raus", kanal: "Mail", adresse: "service@willbe-invest.com", kern: "In Zoho am 26.09. eingeplant für 28.09., 10 Uhr. Gebündelte Anfrage als finanzmuslim.com: Ist das verzinste Tagesgeld das Verrechnungskonto, Depot ohne verzinstes Konto möglich? Kaufbarkeit aller 22 ISINs.", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Versand belegt (Zoho Gesendet 93, 28.09. 10 Uhr). Antwort abwarten." },
  "traders-place": { anbieter: "Traders Place", vorgaenge: [
    { datum: "21.09.2026", richtung: "raus", kanal: "Mail", adresse: "kundenservice@tradersplace.de", kern: frage2 },
    { datum: "22.09.2026", richtung: "rein", kanal: "Mail", kern: "„Die von Ihnen genannten Vorgaben … können wir bei der Bearbeitung Ihres Anliegens leider nicht separat berücksichtigen.“ Keine inhaltliche Antwort." },
    { datum: "23.09.2026", richtung: "raus", kanal: "Mail", adresse: "kundenservice@tradersplace.de", kern: "Zweite, präzisere Anfrage: Laufen Zinsen, Rewards oder Staking ohne eigenes Zutun, und ist das Zinskonto bei der Baader Bank bei einer normalen Depoteröffnung automatisch dabei?" },
    { datum: "26.09.2026", richtung: "raus", kanal: "Mail", adresse: "kundenservice@tradersplace.de", kern: "Gebündelte Anfrage als finanzmuslim.com: Laufen Zinsen, Rewards oder Staking ohne Zutun, ist das Baader-Zinskonto automatisch dabei? Dazu Kaufbarkeit aller 22 Halal-ISINs samt Fondsaufschlag.", von: "elias@finanzmuslim.com" },
    { datum: "27.09.2026", richtung: "raus", kanal: "Mail", adresse: "kundenservice@tradersplace.de", kern: "Nachtrag im selben Faden: Lassen sich Kryptowerte auf eine eigene, externe Wallet übertragen und umgekehrt? Die Sonderbedingungen Nr. 14 verweisen nur auf Tangany.", von: "elias@finanzmuslim.com" },
    { datum: "07.10.2026", richtung: "raus", kanal: "Mail", adresse: "kundenservice@tradersplace.de", kern: "Nachfass im Faden vom 26.09., eine Mail mit allem Offenen: Kaufbarkeit der drei iShares Islamic ETFs, der vier HSBC Islamic ETFs, des iShares USD Sukuk ETF und der Gold- und Silber-ETCs von Invesco und WisdomTree im Depot. Krypto: Auszahlung auf eine eigene Wallet möglich, und was kostet sie bei Bitcoin?", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort auf die Mail vom 07.10.2026 abwarten (Paket M1, Wortlaut unter belege/traders-place/99-m1-anfrage-2026-10-07.txt). Antworten mit anlage_setzen.py und Belegart schriftlich eintragen." },
  targobank: { anbieter: "Targobank", vorgaenge: [
    { datum: "21.09.2026", richtung: "raus", kanal: "Mail", adresse: "kontakt@targobank.de", kern: frage2 },
    { datum: "23.09.2026", richtung: "rein", kanal: "Mail", zeichen: "#REF0003695700", kern: "Bittet um einen Beratungstermin in der Filiale. Keine inhaltliche Antwort." },
    { datum: "07.10.2026", richtung: "raus", kanal: "Mail", adresse: "kontakt@targobank.de", kern: "Neue Mail als finanzmuslim.com: Gold- und Silber-ETCs von Invesco und WisdomTree im Direkt-Depot online kaufbar? Online-Konto ohne eingeräumte Kontoüberziehung führbar, also nur im Guthaben?", von: "elias@finanzmuslim.com" },
    { datum: "07.10.2026", richtung: "rein", kanal: "Mail", adresse: "NoReply@targobank.de", zeichen: "#REF0003774306", automatisch: true, kern: "Automatische Eingangsbestätigung mit Bearbeitungsnummer (Zoho INBOX 573)." },
  ], naechsterSchritt: "Antwort auf die Mail vom 07.10.2026 abwarten (Paket M1, Wortlaut unter belege/targobank/99-m1-anfrage-2026-10-07.txt). Antworten mit anlage_setzen.py und Belegart schriftlich eintragen." },
  bbbank: { anbieter: "BBBank", vorgaenge: [
    { datum: "21.09.2026", richtung: "raus", kanal: "Mail", adresse: "info@bbbank.de", kern: frage2 },
    { datum: "21.09.2026", richtung: "rein", kanal: "Mail", kern: "Leitet die Anfrage an eine Filiale weiter, will die Postleitzahl." },
    { datum: "07.10.2026", richtung: "raus", kanal: "Mail", adresse: "info@bbbank.de", kern: "Neue Mail als finanzmuslim.com: Kaufbarkeit der drei iShares Islamic ETFs, der vier HSBC Islamic ETFs, des iShares USD Sukuk ETF und der Gold- und Silber-ETCs von Invesco und WisdomTree im BBBank Depot.", von: "elias@finanzmuslim.com" },
    { datum: "07.10.2026", richtung: "rein", kanal: "Mail", adresse: "autoreply@bbbank.de", automatisch: true, kern: "Automatische Eingangsbestätigung (Zoho Spam 5)." },
  ], naechsterSchritt: "Antwort auf die Mail vom 07.10.2026 abwarten (Paket M1, Wortlaut unter belege/bbbank/99-m1-anfrage-2026-10-07.txt). Antworten mit anlage_setzen.py und Belegart schriftlich eintragen." },
  maxblue: { anbieter: "maxblue", vorgaenge: [
    { datum: "21.09.2026", richtung: "raus", kanal: "Mail", adresse: "info.maxblue@db.com", kern: frage2 },
    { datum: "21.09.2026", richtung: "rein", kanal: "Mail", kern: "Auskunft nur nach Legitimation." },
    { datum: "23.09.2026", richtung: "rein", kanal: "Mail", adresse: "online.service@db.com", kern: "„Das maxblue Depotkonto besitzt momentan keine Verzinsung.“ Beide maxblue-Produkte grün. Für eine dauerhafte Zusage verweist die Bank an eine Filiale." },
    { datum: "27.09.2026", richtung: "raus", kanal: "Mail", adresse: "online.service@db.com", kern: "In Zoho am 26.09. eingeplant für 27.09., 10 Uhr. Gebündelte Anfrage als finanzmuslim.com: Kaufbarkeit aller 22 Halal-ISINs im Depot und als maxblue Wertpapier-Sparplan.", von: "elias@finanzmuslim.com" },
    { datum: "28.09.2026", richtung: "rein", kanal: "Mail", adresse: "online.service@db.com", kern: "Keine Auskunft je ISIN, Verweis auf die eigene Suche: „Über den folgenden Link können Sie ganz einfach prüfen, ob das Wertpapier sparplanfähig oder handelbar ist: https://www.maxblue.de/marktdaten/suche.html“." },
    { datum: "07.10.2026", richtung: "raus", kanal: "Mail", adresse: "online.service@db.com", kern: "Antwort im Faden vom 28.09.: Die Suche zeigt nur „sparplanfähig“. Kaufbarkeit der drei iShares Islamic ETFs, der vier HSBC Islamic ETFs, des iShares USD Sukuk ETF und der Gold- und Silber-ETCs von Invesco und WisdomTree als Einmalkauf im maxblue Depot.", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort auf die Mail vom 07.10.2026 abwarten (Paket M1, Wortlaut unter belege/maxblue/99-m1-anfrage-2026-10-07.txt). Antworten mit anlage_setzen.py und Belegart schriftlich eintragen." },
  libertex: { anbieter: "Libertex", vorgaenge: [
    { datum: "21.09.2026", richtung: "raus", kanal: "Mail", adresse: "support@help.libertex.com", kern: frage2 },
    { datum: "21.09.2026", richtung: "rein", kanal: "Mail", kern: "KI-Antwort, sagt nur „keine Hinweise“ auf eine Verzinsung. Zu unklar, zählt nicht als Beleg." },
    { datum: "28.09.2026", richtung: "raus", kanal: "Mail", adresse: "support@help.libertex.com", kern: "In Zoho am 26.09. eingeplant für 28.09., 10 Uhr. Gebündelte Anfrage als finanzmuslim.com: Echte Wertpapiere statt CFDs in Deutschland? Falls ja, Kaufbarkeit aller 22 ISINs.", von: "elias@finanzmuslim.com" },
    { datum: "28.09.2026", richtung: "rein", kanal: "Mail", adresse: "support@help.libertex.com", kern: "KI-Antwort: Libertex hauptsächlich CFD, dazu Libertex Invest mit echten Aktien; zu den ISINs „keine bestätigten Informationen“. Zu unklar, zählt nicht. Die KI bietet an: Antwort „Mit einem Mitarbeiter sprechen“." },
    { datum: "28.09.2026", richtung: "raus", kanal: "Mail", adresse: "support@help.libertex.com", kern: "„Mit einem Mitarbeiter sprechen“ plus Frage: Libertex Invest in Deutschland mit echten Wertpapieren? Je ISIN ja/nein, alle 22. Zoho Gesendet #101." },
    { datum: "28.09.2026", richtung: "rein", kanal: "Mail", adresse: "support@help.libertex.com", kern: "Mitarbeiter (Reiner) verweist auf die Instrumentenliste: „Dort finden Sie alle Aktien die Sie bei und kaufen können. Wählen Sie bitte als Plattform Libertex Invest aus.“ Ausgewertet: 260 Aktien, Gruppe ETF leer, keine der 22 ISINs. Eingetragen als vollständige Liste: 0 von 12, 0 von 3, 0 von 7." },
    { datum: "28.09.2026", richtung: "raus", kanal: "Mail", adresse: "support@help.libertex.com", kern: "Nachfrage im selben Faden: Wird Guthaben auf einem Libertex-Invest-Konto verzinst, automatisch oder gegen Aufpreis? Zoho Gesendet #102. Nur Gegenprobe: das Zins-Tor ist seit 23.09. über das Client Agreement Shares belegt." },
    { datum: "28.09.2026", richtung: "rein", kanal: "Mail", adresse: "support@help.libertex.com", kern: "KI-Antwort zur Gegenprobe: „nicht investiertes Guthaben auf einem Libertex‑Invest‑Konto wird nicht verzinst“, kein Aufpreis-Modell. Bestätigt das Client Agreement." },
  ], naechsterSchritt: "Erledigt 28.09.2026: Depot gerankt, Zins zweifach belegt." },
  "geno-broker": { anbieter: "GENO Broker", vorgaenge: [
    { datum: "21.09.2026", richtung: "raus", kanal: "Mail", adresse: "service@genobroker.de", kern: frage2, von: "eliaselgendy2006@gmail.com" },
    { datum: "25.09.2026", richtung: "raus", kanal: "Mail", adresse: "service@genobroker.de", kern: "Nachfrage im selben Verlauf: Verrechnungskonto zum GENObasis Depot automatisch verzinst, Verzicht ab Eröffnung möglich? Gilt dasselbe für GENOprofi?", von: "eliaselgendy2006@gmail.com" },
    { datum: "25.09.2026", richtung: "rein", kanal: "Mail", adresse: "service@genobroker.de", kern: "Ticket DP02-107847: GENO Broker verzinst das Verrechnungskonto nicht, PLV ohne Guthabenverzinsung; das Konto führt die jeweilige Partnerbank, deren Konditionen gelten. Beide Depots grün mit Hinweis. Kaufbarkeit weiter offen (Tranche 2).", von: "eliaselgendy2006@gmail.com" },
    { datum: "27.09.2026", richtung: "raus", kanal: "Mail", adresse: "service@genobroker.de", kern: "In Zoho am 26.09. eingeplant für 27.09., 10 Uhr. Gebündelte Anfrage als finanzmuslim.com: Verrechnungskonto GENObasis und GENOprofi automatisch verzinst, Verzicht ab Eröffnung? Kaufbarkeit aller 22 Halal-ISINs je Tarif.", von: "elias@finanzmuslim.com" },
    { datum: "27.09.2026", richtung: "rein", kanal: "Mail", adresse: "postfach-service@genobroker.de", automatisch: true, kern: "Zoho INBOX 340: Automatische Antwort, Auftrag erhalten." },
    { datum: "07.10.2026", richtung: "raus", kanal: "Mail", adresse: "service@genobroker.de", zeichen: "DP02-107847", kern: "Nachfass im Faden vom 27.09.: Kaufbarkeit der drei iShares Islamic ETFs, der vier HSBC Islamic ETFs, des iShares USD Sukuk ETF und der Gold- und Silber-ETCs von Invesco und WisdomTree in den Depots GENObasis und GENOprofi.", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort auf die Mail vom 07.10.2026 abwarten (Paket M1, Wortlaut unter belege/geno-broker/99-m1-anfrage-2026-10-07.txt). Antworten mit anlage_setzen.py und Belegart schriftlich eintragen." },
  dkb: { anbieter: "DKB", vorgaenge: [
    { datum: "21.09.2026", richtung: "raus", kanal: "Mail", adresse: "impressum@dkb.de", kern: frage2 },
    { datum: "21.09.2026", richtung: "rein", kanal: "Mail", automatisch: true, kern: "Nur Eingangsbestätigung." },
    { datum: "26.09.2026", richtung: "raus", kanal: "Mail", adresse: "impressum@dkb.de", kern: "Gebündelte Anfrage als finanzmuslim.com: Girokonto ab Eröffnung ohne Dispokredit möglich? Dazu Kaufbarkeit aller 22 Halal-ISINs im Depot.", von: "elias@finanzmuslim.com" },
    { datum: "28.09.2026", richtung: "rein", kanal: "Mail", adresse: "info@dkb.de", automatisch: true, kern: "Standardantwort ohne Inhalt: „können wir Anfragen nur beantworten, wenn sie von der E-Mail-Adresse gesendet werden, die in Ihrem Banking unter „Mein Profil“ hinterlegt ist“. Zählt nicht als Antwort." },
    { datum: "07.10.2026", richtung: "raus", kanal: "Mail", adresse: "sophie.klein@netzeffekt.de", kern: "Über FinanceQuality (Ansprechpartnerin Sophie Klein, netzeffekt), mit der Bitte um Weitergabe an die Partnerbetreuung von DKB und N26: Kaufbarkeit der drei iShares Islamic ETFs, der vier HSBC Islamic ETFs, des iShares USD Sukuk ETF und der Gold- und Silber-ETCs von Invesco und WisdomTree im Depot. Dazu für die DKB: Girokonto ab Eröffnung ohne Dispokredit führbar?", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "DKB bearbeitet nur Mails von der im Banking hinterlegten Adresse, Elias ist kein DKB-Kunde. Antwort über FinanceQuality auf die Mail vom 07.10.2026 abwarten (Paket M1, belege/dkb/99-m1-anfrage-2026-10-07.txt)." },
  scalable: { anbieter: "Scalable Capital", vorgaenge: [
    { datum: "21.09.2026", richtung: "raus", kanal: "Mail", adresse: "service@scalable.capital", kern: frage2, von: "eliaselgendy2006@gmail.com" },
    { datum: "21.09.2026", richtung: "rein", kanal: "Ticket", zeichen: "03153115", automatisch: true, kern: "Nur Eingangsbestätigung." },
    { datum: "24.09.2026", richtung: "raus", kanal: "Mail", adresse: "service@scalable.capital", zeichen: "03153115", kern: "Nachfrage im selben Verlauf: Kann ich den Prime+ Broker komplett ohne Zinsen auf Guthaben nutzen?", von: "eliaselgendy2006@gmail.com" },
    { datum: "26.09.2026", richtung: "raus", kanal: "Mail", adresse: "service@scalable.capital", zeichen: "03153115", kern: "Gebündelte Anfrage als finanzmuslim.com: Bleibt das Verrechnungskonto mit PRIME+ dauerhaft bei 0 %? Kaufbarkeit der vier HSBC-ETFs in FREE und PRIME+ (App gegen ETP-Verzeichnis).", von: "elias@finanzmuslim.com" },
    { datum: "28.09.2026", richtung: "rein", kanal: "Mail", adresse: "service@scalable.capital", zeichen: "03158853", kern: "Verrechnungskonto in FREE und PRIME+ 0 % p.a., Tagesgeld nur bei eigener Eröffnung. HSBC ×4 in beiden Tarifen „Derzeit nicht handelbar (Einmalkauf: Nein | Sparplan: Nein)“, auch nicht telefonisch. Ersetzt Elias' App-Suche vom 15.09.; Prime+ Broker damit vollständig." },
  ], naechsterSchritt: "Erledigt 28.09.2026: beide Fragen schriftlich beantwortet." },
  flatex: { anbieter: "flatex", vorgaenge: [
    { datum: "21.09.2026", richtung: "raus", kanal: "Mail", adresse: "info@flatex.de", kern: frage2 },
    { datum: "21.09.2026", richtung: "rein", kanal: "Mail", automatisch: true, kern: "Nur Eingangsbestätigung." },
    { datum: "26.09.2026", richtung: "raus", kanal: "Mail", adresse: "info@flatex.de", kern: "Gebündelte Anfrage als finanzmuslim.com: Kaufbarkeit von sieben ISINs (Invesco ACWI, vier HSBC, zwei Sukuk-ETFs). Die Krypto-Frage vom 21.09. ist über die Website erledigt.", von: "elias@finanzmuslim.com" },
    { datum: "07.10.2026", richtung: "rein", kanal: "Mail", adresse: "info@flatex.de", kern: "Alle sieben angefragten Wertpapiere sind bei flatex handelbar und regulär online kaufbar. Sparplan nur für LU3123443510 (Xtrackers II Salam Sukuk), für die anderen sechs nicht freigeschaltet. Damit sind alle 22 Halal-Anlagen bei flatex belegt (belege/flatex/99-j3-antwort-2026-10-07.txt)." },
  ], naechsterSchritt: "Erledigt 07.10.2026: Kaufbarkeit der sieben ISINs schriftlich beantwortet." },
  tomorrow: { anbieter: "Tomorrow", vorgaenge: [
    { datum: "21.09.2026", richtung: "raus", kanal: "Mail", adresse: "hello@tomorrow.one", kern: frage2 },
    { datum: "21.09.2026", richtung: "rein", kanal: "Mail", automatisch: true, kern: "Nur Eingangsbestätigung." },
    { datum: "23.09.2026", richtung: "rein", kanal: "Ticket", zeichen: "#1568580", kern: "„Das Guthaben auf dem Girokonto selbst wird nicht verzinst.“ Grün, jetzt mit Mail statt nur Anbieterseite." },
  ] },


  // Runde 3, am 23.09.2026 aus eliaselgendy2006@gmail.com gesendet, jede im Gesendet-Ordner geprüft.
  ing: { anbieter: "ING", vorgaenge: [
    { datum: "23.09.2026", richtung: "raus", kanal: "Mail", adresse: "impressum@ing.de", kern: frage3 + " Frage galt dem Verrechnungskonto des Direkt-Depots." },
    { datum: "23.09.2026", richtung: "rein", kanal: "Mail", zeichen: "A57220434", automatisch: true, kern: "Automatische Eingangsbestätigung: „Eine ganz persönliche Antwort bekommen Sie noch von uns.“" },
    { datum: "23.09.2026", richtung: "rein", kanal: "Mail", automatisch: true, kern: "Automatische Eingangsbestätigung, persönliche Antwort angekündigt." },
    { datum: "23.09.2026", richtung: "rein", kanal: "Ticket", zeichen: "#1568580", kern: "Girokonto-Guthaben wird nicht verzinst. Grün." },
    { datum: "29.09.2026", richtung: "rein", kanal: "Mail", adresse: "info@ing.de", zeichen: "A57220433", kern: "Persönliche Antwort an eliaselgendy2006@gmail.com: „Aber das Verrechnungskonto zum Direkt-Depot wird verzinst. Individuelle Lösungen sind nicht möglich.“ Wertpapierkredite bietet die ING nicht an. Bestätigt rot für das Direkt-Depot." },
  ] },
  "1822direkt": { anbieter: "1822direkt", vorgaenge: [
    { datum: "23.09.2026", richtung: "raus", kanal: "Mail", adresse: "info@1822direkt.de", kern: frage3 + " Frage galt dem Aktiv-Depot." },
    { datum: "27.09.2026", richtung: "raus", kanal: "Mail", adresse: "info@1822direkt.de", kern: "In Zoho am 26.09. eingeplant für 27.09., 10 Uhr. Gebündelte Anfrage als finanzmuslim.com: GiroDirekt statt verzinstem Tagesgeld als Verrechnungskonto möglich? Kaufbarkeit von 17 ISINs.", von: "elias@finanzmuslim.com" },
    { datum: "27.09.2026", richtung: "rein", kanal: "Mail", adresse: "autoreply@1822direkt.de", automatisch: true, kern: "Zoho INBOX 343: Automatische Eingangsbestätigung." },
  ], naechsterSchritt: "Versand belegt (Zoho Gesendet 82, 27.09. 10 Uhr), nur Eingangsbestätigung. Antwort abwarten." },
  bux: { anbieter: "BUX", vorgaenge: [
    { datum: "23.09.2026", richtung: "raus", kanal: "Mail", adresse: "info@getbux.com", kern: frage3 + " Zusätzlich: Unterschied zwischen Basic, Plus und Prime, und ob Hebel und Wertpapierleihe ab Start aus sind." },
    { datum: "27.09.2026", richtung: "raus", kanal: "Mail", adresse: "info@getbux.com", kern: "In Zoho am 26.09. eingeplant für 27.09., 10 Uhr. Gebündelte Anfrage als finanzmuslim.com: Kaufbarkeit von elf ISINs (ETCs, Fonds, iShares World Islamic) für BUX Basic.", von: "elias@finanzmuslim.com" },
    { datum: "27.09.2026", richtung: "rein", kanal: "Mail", adresse: "support@getbux.com", automatisch: true, kern: "Zoho INBOX 341: Automatische Eingangsbestätigung." },
  ], naechsterSchritt: "Versand belegt (Zoho Gesendet 83, 27.09. 10 Uhr), nur Eingangsbestätigung. Antwort abwarten." },
  norisbank: { anbieter: "norisbank", vorgaenge: [
    { datum: "23.09.2026", richtung: "raus", kanal: "Mail", adresse: "service@norisbank.de", kern: frage3 + " Frage galt Top-Girokonto und Girokonto Plus.", von: "eliaselgendy2006@gmail.com" },
    { datum: "23.09.2026", richtung: "rein", kanal: "Mail", adresse: "db.no-reply@db.com", automatisch: true, kern: "Nur automatische Eingangsbestätigung." },
    { datum: "25.09.2026", richtung: "raus", kanal: "Mail", adresse: "service@norisbank.de", kern: "Nachfrage im selben Verlauf, nur Dispo Top-Girokonto: Werbeseite sagt Sofort-Dispo, Bedingungen sagen auf Antrag. Kommt der Dispo bei Eröffnung automatisch?", von: "eliaselgendy2006@gmail.com" },
    { datum: "28.09.2026", richtung: "rein", kanal: "Mail", adresse: "e-mail.service-norisbank@norisbank.de", automatisch: true, kern: "Standardtext an eliaselgendy2006@gmail.com: „senden Ihnen schnellstmöglich die gewünschten Unterlagen zum Top-Girokonto zu“, 0 € ab 500 € Geldeingang. Dispo-Frage nicht beantwortet, zählt nicht als Antwort." },
  ], naechsterSchritt: "Elias fasst im Gmail-2006-Faden „Re: Ihre Anfrage Top Girokonto“ nach (Text im Handoff KONTOFUEHRUNG-6) oder entscheidet N: ohne Antwort rot nach DKB-Maßstab." },
  coinbase: { anbieter: "Coinbase", vorgaenge: [
    { datum: "23.09.2026", richtung: "raus", kanal: "Mail", adresse: "impressum@coinbase.com", kern: "Zinsen und Rewards auf Guthaben, ob Coinbase One Zinsen oder gebundene Token enthält, und ob Margin und Lending ab Start aus sind." },
    { datum: "23.09.2026", richtung: "rein", kanal: "Ticket", zeichen: "Fall 27569519", kern: "Keine automatischen Zinsen oder Rewards, Coinbase One enthält weder Zinsen noch gesperrte Token, Margin und Lending sind ab Start aus. Beide Felder grün." },
  ], },
  revolut: { anbieter: "Revolut", vorgaenge: [
    { datum: "23.09.2026", richtung: "raus", kanal: "Mail", adresse: "support@revolut.com", kern: "Ob automatisches Krypto-Staking bei einem neuen Konto sofort läuft, ob es dauerhaft abschaltbar ist, und ob Euro-Guthaben im Standardkonto automatisch verzinst wird.", von: "eliaselgendy2006@gmail.com" },
    { datum: "23.09.2026", richtung: "rein", kanal: "Mail", zeichen: "Fallnummer 19180-26959-58274", kern: "Keine inhaltliche Antwort: Anfragen von nicht registrierten Adressen bearbeitet Revolut nicht, nur über den In-App-Chat." },
  ], keinMailWeg: true, naechsterSchritt: "Nur über den In-App-Chat zu klären (Elias). Kein weiteres Nachfassen per Mail." },


  // Kein Mail-Weg, aber am 23.09.2026 über die Anbieterseiten belegt:
  // 21bitcoin, BISON, Bitget, Bitpanda, eToro, flatex, Scalable, Traders Place,
  // crypto.com und Robinhood. Die Belege stehen in vergleichKorrekturenDaten.ts.
  // Nie gefragt, weil es kein Postfach gibt. Adressen am 22.09.2026 aus den Impressen geprüft.
  bitpanda: { anbieter: "Bitpanda", vorgaenge: [], keinMailWeg: true, naechsterSchritt: "Nur Kontaktformular. Bezahlmodell am 23.09.2026 über bitpanda.com belegt, nichts mehr offen." },
  wise: { anbieter: "Wise", vorgaenge: [], keinMailWeg: true, naechsterSchritt: "Nur Help Center." },
  "crypto-com": { anbieter: "Crypto.com", vorgaenge: [], keinMailWeg: true, naechsterSchritt: "Nur In-App-Chat. Am 23.09.2026 über help.crypto.com belegt: Rewards erst nach eigener Allocation." },
  robinhood: { anbieter: "Robinhood", vorgaenge: [], keinMailWeg: true, naechsterSchritt: "Nur Beschwerde-Adresse. Am 23.09.2026 über robinhood.com belegt: Staking und Cash sweep sind beide Opt-in." },
  // Stufen-Prüfung 23.09.2026: noch nie gefragt, aber je ein offener nächster Schritt.
  bforbank: { anbieter: "BforBank", vorgaenge: [
    { datum: "27.09.2026", richtung: "raus", kanal: "Mail", adresse: "kundenservice-de@customers.bforbank.com", kern: "Wird Guthaben auf dem Girokonto verzinst oder nur auf Bfor+ und Livret A? Kann das Konto trotz „kein Dispo“ über die geduldete Überziehung (16 %) ohne Antrag ins Minus rutschen?", von: "elias@finanzmuslim.com" },
    { datum: "27.09.2026", richtung: "rein", kanal: "Mail", adresse: "kundenservice-de@customers.bforbank.com", zeichen: "3163751-1790518984", automatisch: true, kern: "Automatische Eingangsbestätigung der Anfrage." },
    { datum: "28.09.2026", richtung: "rein", kanal: "Mail", adresse: "kundenservice-de@customers.bforbank.com", zeichen: "3163751-1790518984", kern: "Girokonto 0,00 % Zinsen, Tagesgeld für Kunden in Deutschland pausiert. Kein Dispositionskredit, kein aktives Überziehen per Karte oder Überweisung; Minus nur durch Entgelte oder technische Buchungen (dann Zins der geduldeten Überziehung). Zins-Tor grün, Girokonto gerankt." },
  ], naechsterSchritt: "Erledigt 28.09.2026: beide Fragen schriftlich beantwortet." },
  kraken: { anbieter: "Kraken", vorgaenge: [], keinMailWeg: true, naechsterSchritt: "Am 25.09.2026 geprüft: Produktsupport nur im Chat oder eingeloggt, das öffentliche Formular (support.kraken.com/forms/648008) ist nur für Compliance und Recht. Beide Stufen stehen über Opt-in schon auf grün, eine Nachfrage ist nicht nötig." },
  consorsbank: { anbieter: "Consorsbank", vorgaenge: [
    { datum: "24.09.2026", richtung: "raus", kanal: "Mail", adresse: "kundenbetreuung@consorsbank.de", kern: "Wird das Verrechnungskonto zum Wertpapierdepot verzinst? Im Preisverzeichnis stehen dort nur Sollzinsen. Bleibt das beworbene Tagesgeldkonto ohne eigene Einzahlung leer?" },
    { datum: "24.09.2026", richtung: "rein", kanal: "Mail", zeichen: "Ticket 86382271-78901a6", kern: "Verrechnungskonto wird nicht verzinst. Das Tagesgeldkonto ist ein eigenes Konto und bleibt ohne Guthaben unverzinst. Depot grün, jetzt mit ausdrücklicher Zusage." },
  ], },
  comdirect: { anbieter: "comdirect", vorgaenge: [
    { datum: "24.09.2026", richtung: "raus", kanal: "Mail", adresse: "info@comdirect.de", kern: "Gilt „Das Guthaben auf dem Verrechnungskonto wird von der Bank variabel verzinst“ auch für das Pure Depot, wie hoch ist der Satz, und ist ein dauerhafter Verzicht möglich?" },
    { datum: "24.09.2026", richtung: "rein", kanal: "Mail", zeichen: "Vorgang 11756451", kern: "Guthaben auf dem Verrechnungskonto wird nicht verzinst, ausdrücklich für das Verrechnungskonto beim comdirect Depot und beim Pure Depot. Beide Depots grün." },
    { datum: "26.09.2026", richtung: "raus", kanal: "Mail", adresse: "info@comdirect.de", zeichen: "Vorgang 11756451", kern: "Antwort im Faden als finanzmuslim.com: Was heißt „Handelbar auf Anfrage“ bei den HSBC-ETFs? Kaufbarkeit von elf ISINs fürs comdirect Depot, aller 22 fürs Pure Depot.", von: "elias@finanzmuslim.com" },
    { datum: "27.09.2026", richtung: "rein", kanal: "Mail", zeichen: "Vorgang 11763010", kern: "„Auf Anfrage“ heißt nur übertragbar, kein Kauf. HSBC-ETFs in beiden Depots „nicht handelbar“. Pure Depot: fünf Islamic-ETFs, HANetf und zwei Sukuk-ETFs handelbar, Hilal Income, Comgest, Franklin und alle Metall-ETCs „nur comdirect Depot“. comdirect Depot: Metall-ETCs per Börsenhandel. Beide Depots jetzt 22 von 22 geprüft." },
  ] },
  n26: { anbieter: "N26", vorgaenge: [
    { datum: "24.09.2026", richtung: "raus", kanal: "Mail", adresse: "support@n26.com", kern: "Wird das Guthaben auf einem N26 Flex Konto verzinst, oder nur auf einem separat eröffneten Tagesgeldkonto? Kommt beim Flex Konto ab Eröffnung ein Dispo dazu?" },
    { datum: "24.09.2026", richtung: "rein", kanal: "Mail", zeichen: "Confirmation 95124651", kern: "Keine inhaltliche Antwort. Verweis auf den Chat (support.n26.com/de-at/chat), Mail-Postfach ist nur automatisch." },
    { datum: "26.09.2026", richtung: "raus", kanal: "Chat", adresse: "support.n26.com Besucher-Chat", kern: "Als finanzmuslim.com: N26 Flex Zins und Dispo; N26 Depot Kaufbarkeit von acht Halal-ETFs." },
    { datum: "26.09.2026", richtung: "rein", kanal: "Chat", adresse: "support.n26.com Besucher-Chat", kern: "KI-Assistent Neon: Flex nicht automatisch verzinst (nur mit selbst eröffnetem Tagesgeld), Dispo nur auf Antrag. Beide Flex-Ampeln grün. Zu einzelnen ISINs keine Auskunft, nur Suche in der App." },
    { datum: "07.10.2026", richtung: "raus", kanal: "Mail", adresse: "sophie.klein@netzeffekt.de", kern: "Über FinanceQuality (Ansprechpartnerin Sophie Klein, netzeffekt), mit der Bitte um Weitergabe an die Partnerbetreuung von DKB und N26: Kaufbarkeit der drei iShares Islamic ETFs, der vier HSBC Islamic ETFs, des iShares USD Sukuk ETF und der Gold- und Silber-ETCs von Invesco und WisdomTree im Depot.", von: "elias@finanzmuslim.com" },
  ], keinMailWeg: true, naechsterSchritt: "Flex erledigt per Chat am 26.09. Depot: Antwort über FinanceQuality auf die Mail vom 07.10.2026 abwarten (Paket M1, belege/n26/99-m1-anfrage-2026-10-07.txt), sonst nur per Suche in der App mit Konto." },
  degiro: { anbieter: "DEGIRO", vorgaenge: [
    { datum: "26.09.2026", richtung: "raus", kanal: "Mail", adresse: "kundenservice@degiro.de", kern: "Gebündelte Anfrage als finanzmuslim.com: Kaufbarkeit von zwölf ISINs außerhalb der ETF-Kernauswahl.", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort auf die gebündelte Anfrage vom 26.09. abwarten. Der Partnerfaden mit affiliates@flatexdegiro.com läuft getrennt." },
  fidelity: { anbieter: "Fidelity Fondsdepot", vorgaenge: [
    { datum: "27.09.2026", richtung: "raus", kanal: "Mail", adresse: "info@fidelity-direkt.de", kern: "In Zoho am 26.09. eingeplant für 27.09., 10 Uhr. Gebündelte Anfrage als finanzmuslim.com: Ausgabeaufschlag und Mindestanlage der drei Halal-Fonds, Kaufbarkeit von 14 ETFs und ETCs.", von: "elias@finanzmuslim.com" },
    { datum: "27.09.2026", richtung: "rein", kanal: "Mail", adresse: "info@fidelity-direkt.de", zeichen: "00269193", automatisch: true, kern: "Zoho INBOX 342: Eingangsbestätigung 00269193." },
  ], naechsterSchritt: "Versand belegt (Zoho Gesendet 88, 27.09. 10 Uhr), nur Eingangsbestätigung. Antwort abwarten." },
  bison: { anbieter: "BISON", vorgaenge: [
    { datum: "27.09.2026", richtung: "raus", kanal: "Mail", adresse: "support@bisonapp.com", kern: "In Zoho am 26.09. eingeplant für 27.09., 10 Uhr. Gebündelte Anfrage als finanzmuslim.com: Kaufbarkeit aller 22 Halal-ISINs. Partnerfaden affiliate@bsdigital.com läuft getrennt.", von: "elias@finanzmuslim.com" },
    { datum: "28.09.2026", richtung: "rein", kanal: "Ticket", zeichen: "#613686", kern: "„Aktuell gibt es bei BISON leider keine Sparplanfunktion für Wertpapiere.“ Einmalkauf nicht beantwortet." },
    { datum: "28.09.2026", richtung: "raus", kanal: "Mail", adresse: "support@bisonapp.com", zeichen: "#613686", kern: "Nachfrage im selben Ticket: Einmalkauf je ISIN ja/nein, alle 22, oder Link auf eine vollständige Liste. Zoho Gesendet #103." },
    { datum: "28.09.2026", richtung: "rein", kanal: "Ticket", zeichen: "#613686", kern: "Zoho INBOX 389, 15:10, vor unserer Nachfrage eingegangen und erst abends gelesen: „Gerne haben wir die Kaufbarkeit der genannten Wertpapiere geprüft. Die folgenden Wertpapiere können bei uns gehandelt werden:“ iShares MSCI World, EM und USA Islamic, WisdomTree Core Physical Silver. Die übrigen 18 nein. Depot vollständig: 3 von 12, 0 von 3, 1 von 7." },
  ], naechsterSchritt: "Nichts offen. Kommt auf #103 noch eine Antwort, gegen die Liste vom 28.09. prüfen." },
  freedom24: { anbieter: "Freedom24", vorgaenge: [
    { datum: "28.09.2026", richtung: "raus", kanal: "Mail", adresse: "support_germany@freedom24.com", kern: "In Zoho am 26.09. eingeplant für 28.09., 10 Uhr. Gebündelte Anfrage als finanzmuslim.com: Zins nur auf selbst eröffnetem D-Konto, gilt das für Smart und All inclusive? Kaufbarkeit aller 22 ISINs je Tarif.", von: "elias@finanzmuslim.com" },
    { datum: "07.10.2026", richtung: "raus", kanal: "Mail", adresse: "support_germany@freedom24.com", kern: "Nachfass im Faden vom 28.09.: Kaufbarkeit der drei iShares Islamic ETFs, der vier HSBC Islamic ETFs, des iShares USD Sukuk ETF und der Gold- und Silber-ETCs von Invesco und WisdomTree in den Tarifen Smart und All inclusive. Dazu Sparplan (Auto Invest): ab welchem Betrag, in welchen Abständen?", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort auf die Mail vom 07.10.2026 abwarten (Paket M1, Wortlaut unter belege/freedom24/99-m1-anfrage-2026-10-07.txt). Antworten mit anlage_setzen.py und Belegart schriftlich eintragen." },
  sbroker: { anbieter: "S Broker", vorgaenge: [
    { datum: "28.09.2026", richtung: "raus", kanal: "Mail", adresse: "service@sbroker.de", kern: "In Zoho am 26.09. eingeplant für 28.09., 10 Uhr. Gebündelte Anfrage als finanzmuslim.com: Kaufbarkeit aller 22 Halal-ISINs im Direkt-Depot.", von: "elias@finanzmuslim.com" },
    { datum: "28.09.2026", richtung: "rein", kanal: "Mail", adresse: "service@sbroker.de", automatisch: true, kern: "Automatische Eingangsbestätigung." },
    { datum: "01.10.2026", richtung: "rein", kanal: "Mail", adresse: "service@sbroker.de", zeichen: "1-3HHQSKX", kern: "Kundenservice (Zoho INBOX 442): „Eine Stichprobe hat ergeben, dass die ETFs/Fonds handelbar sind. Kauf / Sparplan möglich“. Keine Angabe je ISIN, deshalb kein Kaufbeleg, alle 22 bleiben offen. Einzelne ETFs stellt S Broker auf Anfrage handelbar." },
    { datum: "07.10.2026", richtung: "raus", kanal: "Mail", adresse: "service@sbroker.de", zeichen: "1-3HHQSKX", kern: "Rückfrage zur Stichprobe im selben Faden: Kaufbarkeit der drei iShares Islamic ETFs, der vier HSBC Islamic ETFs, des iShares USD Sukuk ETF und der Gold- und Silber-ETCs von Invesco und WisdomTree, „Ein Ja für alle genügt, sonst bitte nur die Ausnahmen“.", von: "elias@finanzmuslim.com" },
    { datum: "07.10.2026", richtung: "rein", kanal: "Mail", adresse: "service@sbroker.de", automatisch: true, kern: "Automatische Eingangsbestätigung (Zoho INBOX 570)." },
  ], naechsterSchritt: "Antwort auf die Mail vom 07.10.2026 abwarten (Paket M1, Wortlaut unter belege/sbroker/99-m1-anfrage-2026-10-07.txt). Antworten mit anlage_setzen.py und Belegart schriftlich eintragen." },
  plus500: { anbieter: "Plus500", vorgaenge: [
    { datum: "28.09.2026", richtung: "raus", kanal: "Mail", adresse: "info@plus500.co.ee", kern: "In Zoho am 26.09. eingeplant für 28.09., 10 Uhr. Gebündelte Anfrage als finanzmuslim.com: Echte Aktien und ETFs statt CFDs in Deutschland? Falls ja, Kaufbarkeit aller 22 ISINs.", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Versand belegt (Zoho Gesendet 97, 28.09. 10 Uhr). Antwort abwarten." },
  vivid: { anbieter: "Vivid", vorgaenge: [
    { datum: "27.09.2026", richtung: "raus", kanal: "Mail", adresse: "press@vivid.money", kern: "Gilt heute für Standard, Plus und Prime: kein Dispokredit, kein Minus ohne eigenen Antrag (Hilfeartikel von 2023, Vivid Now auf Antrag)? Kaufbarkeit aller 22 Halal-Anlagen im Depot Vivid Standard.", von: "elias@finanzmuslim.com" },
    { datum: "27.09.2026", richtung: "rein", kanal: "Mail", adresse: "press@vivid.money", automatisch: true, kern: "Automatische Eingangsbestätigung des Pressebüros: meldet sich „shortly“, beantwortet aber keine Kundenanfragen und verweist auf In-App-Chat und Formular vivid.money/en-eu/support." },
  ], naechsterSchritt: "Antwort abwarten. Presseadresse aus dem Impressum, weil persönliche Konten laut Impressum nur Chat und Formular haben (27.09.2026). Formular vivid.money/support am 28.09. geprüft: verlangt Telefon, bei Vivid registrierte Adresse, Ausweis- oder Passnummer und Geburtsdatum, also nur für Kunden. Kein schriftlicher Weg für Nicht-Kunden." },
  bunq: { anbieter: "bunq", vorgaenge: [], naechsterSchritt: "Optional: schriftlich bestätigen lassen, dass in keiner Stufe automatisch ein Dispo eingeräumt wird (AGB sagen „normalerweise“ nicht)." },
  wundertax: { anbieter: "wundertax", vorgaenge: [
    { datum: "26.09.2026", richtung: "raus", kanal: "Mail", adresse: "support@wundertax.com", kern: "Als finanzmuslim.com: Ruft wundertax die beim Finanzamt vorliegenden Daten ab (vorausgefüllte Steuererklärung), in welchem Paket? KAP und Anlage V sind per Anbieterseite belegt." },
  ], naechsterSchritt: "Antwort abwarten, dann belegabruf setzen." },
  gls: { anbieter: "GLS Bank", vorgaenge: [
    { datum: "07.10.2026", richtung: "raus", kanal: "Mail", adresse: "kundendialog@gls.de", kern: "Erste Mail als finanzmuslim.com an die Kundenberatung (Adresse aus dem Impressum, belege/gls/99-m1-kontaktadresse-2026-10-07.txt): Kaufbarkeit der drei iShares Islamic ETFs, der vier HSBC Islamic ETFs, des iShares USD Sukuk ETF und der Gold- und Silber-ETCs von Invesco und WisdomTree im GLS Depot. Dazu ETF-Sparplan: ab welcher Rate, in welchen Abständen?", von: "elias@finanzmuslim.com" },
    { datum: "07.10.2026", richtung: "rein", kanal: "Mail", adresse: "autoreply@gls.de", automatisch: true, kern: "Automatische Antwort, Anliegen wird bearbeitet (Zoho INBOX 572)." },
  ], naechsterSchritt: "Antwort auf die Mail vom 07.10.2026 abwarten (Paket M1, Wortlaut unter belege/gls/99-m1-anfrage-2026-10-07.txt). Antworten mit anlage_setzen.py und Belegart schriftlich eintragen." },
  etoro: { anbieter: "eToro", vorgaenge: [], keinMailWeg: true, naechsterSchritt: "Besucherformular etoro.com/customer-service am 28.09.2026 abends ausgefüllt (Kaufbarkeit 22 ISINs als echtes Wertpapier, Absender elias@finanzmuslim.com). Beim Absenden kam ein reCAPTCHA, das Claude nicht löst; Elias löst es im offenen Tab und sendet. Danach Vorgang „raus“ eintragen." },
};

export const anfrageFuer = (haus?: string): Anfrage | undefined => (haus ? ANFRAGEN[haus] : undefined);
