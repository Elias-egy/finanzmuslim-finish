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
    { datum: "12.10.2026", richtung: "raus", kanal: "Mail", adresse: "kundenservice@smartbrokerplus.de", kern: "Nachfass im Faden über sende.py (Zoho Gesendet 131): Smartbroker+ steht auf Platz 1 im Depot-Vergleich; die vier HSBC-ETFs sind in der Wertpapiersuche auch am 12.10. nicht zu finden (Abfrage nach ISIN liefert eine leere Liste, die iShares-ETFs liefern Treffer). Je ISIN Einmalkauf und Sparplan ja oder nein (belege/smartbroker/2026-10-12-w11-nachfass-hsbc-text.txt).", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort auf den Nachfass vom 12.10.2026 abwarten. Dann je ISIN mit anlage_setzen.py und Belegart schriftlich eintragen; solange steht bei den Halal-ETFs „mind. 8 von 12“." },
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
    { datum: "12.10.2026", richtung: "rein", kanal: "Mail", adresse: "service@fnz.de", zeichen: "WF_46229739", kern: "FNZ Bank Service (Zoho INBOX 659) auf die Rückfragen vom 07.10.: Zu 1 keine Auskunft, bittet um Wertpapierkennnummern oder ISINs. Zu 2: „ETCs können nur im finvesto Wertpapierdepot verwahrt und gehandelt werden.“ Zu 3: ETF-Transaktionsentgelt 0,20 %, dazu 1,99 Euro je Order; „Bei Arbeitgebereinzahlungen auf VL-Vertrag und Zahlplänen (regelmäßiger Kauf per Lastschriftseinzug durch FNZ Bank) entfällt das Transaktionsentgelt von EUR 1,99.“ Anhang: Preis- und Leistungsverzeichnis Investment Depot (belege/finvesto/2026-10-12-antwort-fnz-etc-entgelt-bittet-um-isins.txt)." },
    { datum: "12.10.2026", richtung: "raus", kanal: "Mail", adresse: "service@fnz.de", zeichen: "WF_46229739", kern: "Antwort im Faden mit sieben ISINs für das finvesto Wertpapierdepot (sechs Halal-ETFs, ein Sukuk-ETF), je ISIN Einmalkauf ja oder nein (Zoho Gesendet 130, über sende.py, nachdem „islamic“ aus der Sperre gefallen war). Text: belege/finvesto/2026-10-12-w9-antwort-isins-text.txt." },
  ], naechsterSchritt: "Antwort von FNZ auf die sieben ISINs abwarten. Kommt sie, mit anlage_setzen.py und Belegart schriftlich eintragen; frühestens nach 14 Tagen nachfassen und nur mit etwas Neuem." },
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
    { datum: "08.10.2026", richtung: "rein", kanal: "Mail", adresse: "jan.filler@bbbank.de", kern: "BBDirekt Wertpapier (Zoho INBOX 598): keine Auskunft, bittet um die Wertpapierkennnummern oder ISINs, gern als Tabelle (belege/bbbank/2026-10-08-antwort-bittet-um-isins.txt)." },
    { datum: "09.10.2026", richtung: "raus", kanal: "Mail", adresse: "jan.filler@bbbank.de", kern: "Antwort im Faden mit Tabelle der 15 Papiere (Name und ISIN): Kann man jedes im BBBank Depot kaufen? (Zoho Gesendet 120).", von: "elias@finanzmuslim.com" },
    { datum: "12.10.2026", richtung: "rein", kanal: "Mail", adresse: "jan.filler@bbbank.de", kern: "BBDirekt Wertpapier (Zoho INBOX 660) auf die Tabelle vom 09.10.: „Alle von Ihnen aufgeführten Wertpapiere können in unserem Depot gehandelt und verwahrt werden.“ Alle 15 als kaufbar eingetragen, zum Sparplan sagt die Antwort nichts (belege/bbbank/2026-10-12-antwort-alle-15-handelbar.txt)." },
    { datum: "12.10.2026", richtung: "raus", kanal: "Mail", adresse: "jan.filler@bbbank.de", kern: "Dank im Faden über sende.py (Zoho Gesendet 129): Die 15 Papiere sind beim BBBank Depot als handelbar eingetragen. Dazu die Frage nach einem Partnerprogramm für das Depot (belege/bbbank/2026-10-12-w9-dank-text.txt).", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Erledigt 12.10.2026: 15 von 22 Halal-Anlagen schriftlich bestätigt. Partnerprogramm für das Depot: Antwort auf die Frage im Dank vom 12.10.2026 abwarten." },
  maxblue: { anbieter: "maxblue", vorgaenge: [
    { datum: "21.09.2026", richtung: "raus", kanal: "Mail", adresse: "info.maxblue@db.com", kern: frage2 },
    { datum: "21.09.2026", richtung: "rein", kanal: "Mail", kern: "Auskunft nur nach Legitimation." },
    { datum: "23.09.2026", richtung: "rein", kanal: "Mail", adresse: "online.service@db.com", kern: "„Das maxblue Depotkonto besitzt momentan keine Verzinsung.“ Beide maxblue-Produkte grün. Für eine dauerhafte Zusage verweist die Bank an eine Filiale." },
    { datum: "27.09.2026", richtung: "raus", kanal: "Mail", adresse: "online.service@db.com", kern: "In Zoho am 26.09. eingeplant für 27.09., 10 Uhr. Gebündelte Anfrage als finanzmuslim.com: Kaufbarkeit aller 22 Halal-ISINs im Depot und als maxblue Wertpapier-Sparplan.", von: "elias@finanzmuslim.com" },
    { datum: "28.09.2026", richtung: "rein", kanal: "Mail", adresse: "online.service@db.com", kern: "Keine Auskunft je ISIN, Verweis auf die eigene Suche: „Über den folgenden Link können Sie ganz einfach prüfen, ob das Wertpapier sparplanfähig oder handelbar ist: https://www.maxblue.de/marktdaten/suche.html“." },
    { datum: "07.10.2026", richtung: "raus", kanal: "Mail", adresse: "online.service@db.com", kern: "Antwort im Faden vom 28.09.: Die Suche zeigt nur „sparplanfähig“. Kaufbarkeit der drei iShares Islamic ETFs, der vier HSBC Islamic ETFs, des iShares USD Sukuk ETF und der Gold- und Silber-ETCs von Invesco und WisdomTree als Einmalkauf im maxblue Depot.", von: "elias@finanzmuslim.com" },
    { datum: "08.10.2026", richtung: "rein", kanal: "Mail", adresse: "online.service@db.com", kern: "Keine Auskunft je Papier (Zoho INBOX 592): Der Service versteht das Anliegen nicht und verweist zum zweiten Mal auf die Suche: „Sie können über folgenden Link prüfen, ob die genannten Werpapiere handelbar sind: https://www.maxblue.de/marktdaten/suche.html/?SEARCH_FOR=“ (belege/maxblue/2026-10-08-antwort-2-verweist-auf-suche.txt)." },
  ], naechsterSchritt: "Per Mail kommt keine Auskunft je Papier, zweimal Verweis auf die Suche. Kein Kaufbeleg, die Zellen des maxblue Depots bleiben leer. Nicht ein drittes Mal dasselbe fragen." },
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
    { datum: "08.10.2026", richtung: "raus", kanal: "Mail", adresse: "affiliates@scalable.capital", zeichen: "PartnerID 1017", kern: "An das Affiliate-Team (Zoho Gesendet 119): finanzmuslim.com bis 09.10. als Werbefläche freigeben. Wird mit PRIME+ doch etwas automatisch verzinst? Zählt ein PRIME+ Abschluss als Broker-Abschluss?", von: "elias@finanzmuslim.com" },
    { datum: "08.10.2026", richtung: "rein", kanal: "Mail", adresse: "affiliates@scalable.capital", zeichen: "PartnerID 1017", kern: "Affiliate-Team (Zoho INBOX 588): „Selbst mit PRIME+ wird kein Guthaben im Broker verzinst. Dies passiert ausschließlich im separaten Tagesgeldkonto.“ Provision, sobald ein Broker eröffnet und kapitalisiert ist, unabhängig von PRIME+. Bittet um einen Vorschau-Link für die neue Domain (belege/scalable/2026-10-08-antwort-prime-plus-und-domain.txt)." },
    { datum: "09.10.2026", richtung: "raus", kanal: "Mail", adresse: "affiliates@scalable.capital", zeichen: "PartnerID 1017", kern: "Im Faden (Zoho Gesendet 121): Seite ist seit 09.10. 07:00 Uhr offen, Bitte um Freigabe von finanzmuslim.com als Werbefläche für PartnerID 1017.", von: "elias@finanzmuslim.com" },
    { datum: "09.10.2026", richtung: "rein", kanal: "Mail", adresse: "affiliates@scalable.capital", zeichen: "PartnerID 1017", kern: "Affiliate-Team (Zoho INBOX 618): „die Werbefläche ist freigegeben“. Fragt, warum Smartbroker vor Scalable gelistet wird. Empfiehlt, auf QR-Codes zu verzichten, damit alle Abschlüsse sicher getrackt werden (belege/scalable/2026-10-09-werbeflaeche-freigegeben.txt)." },
    { datum: "09.10.2026", richtung: "raus", kanal: "Mail", adresse: "affiliates@scalable.capital", zeichen: "PartnerID 1017", kern: "Im Faden: Warum Smartbroker+ vor Scalable steht (Halal-Teil gleichauf, Smartbroker+ mindestens 8 von 12 mit offener HSBC-Prüfung; Unterschied bei den Kosten: Handelsplätze, Ordergebühr). QR-Codes werden aus der Anleitung genommen.", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Werbefläche freigegeben (09.10.2026). Offen: Fannys Frage, warum Smartbroker vor Scalable gelistet wird (beantwortet am 09.10.2026). QR-Codes sind seit 09.10.2026 von der Anleitung entfernt. Zins-Frage zu PRIME+ ist zweimal schriftlich beantwortet (Kundenservice 28.09., Affiliate-Team 08.10.)." },
  flatex: { anbieter: "flatex", vorgaenge: [
    { datum: "21.09.2026", richtung: "raus", kanal: "Mail", adresse: "info@flatex.de", kern: frage2 },
    { datum: "21.09.2026", richtung: "rein", kanal: "Mail", automatisch: true, kern: "Nur Eingangsbestätigung." },
    { datum: "26.09.2026", richtung: "raus", kanal: "Mail", adresse: "info@flatex.de", kern: "Gebündelte Anfrage als finanzmuslim.com: Kaufbarkeit von sieben ISINs (Invesco ACWI, vier HSBC, zwei Sukuk-ETFs). Die Krypto-Frage vom 21.09. ist über die Website erledigt.", von: "elias@finanzmuslim.com" },
    { datum: "07.10.2026", richtung: "rein", kanal: "Mail", adresse: "info@flatex.de", kern: "Alle sieben angefragten Wertpapiere sind bei flatex handelbar und regulär online kaufbar. Sparplan nur für LU3123443510 (Xtrackers II Salam Sukuk), für die anderen sechs nicht freigeschaltet. Damit sind alle 22 Halal-Anlagen bei flatex belegt (belege/flatex/99-j3-antwort-2026-10-07.txt)." },
    { datum: "12.10.2026", richtung: "raus", kanal: "Mail", adresse: "j.aslander@financeads.net", kern: "Partnerfaden, nicht Kaufbarkeit: Nachfass an die financeAds-Betreuerin zu den offenen Programm-Bewerbungen (Partner 64685), darunter flatex (in Prüfung seit 24.09.). Zoho Gesendet 123.", von: "elias@finanzmuslim.com" },
    { datum: "12.10.2026", richtung: "rein", kanal: "Mail", adresse: "affiliates@flatexdegiro.com", kern: "Partnerfaden (Zoho INBOX 655, Thomas Meier): „I have just accepted you to the flatex program via financeAds. Please make sure to review our compliance requirements first.“ Vorgaben gelesen und abgelegt (belege/flatex/2026-10-12-info-flatex-disclaimers.txt)." },
  ], naechsterSchritt: "Kaufbarkeit erledigt. Partnerlink bei financeAds zugesagt (Programm 130, Textlinks 10749 und 125837, beide am 12.10.2026 geprüft). Eingebaut am 12.10.2026 (W10), nachdem Elias entschieden hat: Der automatische flex-Kredit hat eine eigene Achtung-Meldung und zählt ins Zins-Kriterium (Abzug von einem Zehntel im Halal-Teil, erst ein Viertel, von Elias am selben Abend als zu streng gesehen). Mit Link steht flatex im Depot-Vergleich auf Platz 4 (Note 4,33), nie als Nummer 1. Im geführten Test steht flatex bei Wunsch nach vielen Anlagen vorn." },
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
    { datum: "12.10.2026", richtung: "raus", kanal: "Mail", adresse: "affiliates@flatexdegiro.com", kern: "Partnerfaden, nicht Kaufbarkeit: dritte Mail nach Erstanfrage 13.09. und Nachfass 25.09., ohne Antwort. Zoho Gesendet 125 und 126, acht Sekunden auseinander; Ursache der Doppelung offen.", von: "elias@finanzmuslim.com" },
    { datum: "12.10.2026", richtung: "rein", kanal: "Mail", adresse: "affiliates@flatexdegiro.com", kern: "Partnerfaden (Zoho INBOX 655, Thomas Meier): „Concerning DEGIRO, it would also be possible for you to join. Can you apply via financeAds?“ Verweist auf den DEGIRO Affiliate Disclaimer Guide (belege/degiro/2026-10-12-antwort-affiliates-degiro-ueber-financeads.txt)." },
    { datum: "12.10.2026", richtung: "raus", kanal: "Mail", adresse: "affiliates@flatexdegiro.com", kern: "Antwort im Faden über sende.py (Zoho Gesendet 128): Dank für flatex. In der Programmliste von financeAds steht am 12.10. kein DEGIRO-Programm (Partner 64685), Bitte um Programmlink oder Einladung.", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort auf die gebündelte Anfrage vom 26.09. abwarten. Partnerfaden: Antwort von Thomas Meier auf die Mail vom 12.10.2026 (Zoho Gesendet 128) abwarten, dann bei financeAds bewerben." },
  fidelity: { anbieter: "Fidelity Fondsdepot", vorgaenge: [
    { datum: "27.09.2026", richtung: "raus", kanal: "Mail", adresse: "info@fidelity-direkt.de", kern: "In Zoho am 26.09. eingeplant für 27.09., 10 Uhr. Gebündelte Anfrage als finanzmuslim.com: Ausgabeaufschlag und Mindestanlage der drei Halal-Fonds, Kaufbarkeit von 14 ETFs und ETCs.", von: "elias@finanzmuslim.com" },
    { datum: "27.09.2026", richtung: "rein", kanal: "Mail", adresse: "info@fidelity-direkt.de", zeichen: "00269193", automatisch: true, kern: "Zoho INBOX 342: Eingangsbestätigung 00269193." },
  ], naechsterSchritt: "Versand belegt (Zoho Gesendet 88, 27.09. 10 Uhr), nur Eingangsbestätigung. Antwort abwarten." },
  bison: { anbieter: "BISON", vorgaenge: [
    { datum: "27.09.2026", richtung: "raus", kanal: "Mail", adresse: "support@bisonapp.com", kern: "In Zoho am 26.09. eingeplant für 27.09., 10 Uhr. Gebündelte Anfrage als finanzmuslim.com: Kaufbarkeit aller 22 Halal-ISINs. Partnerfaden affiliate@bsdigital.com läuft getrennt.", von: "elias@finanzmuslim.com" },
    { datum: "28.09.2026", richtung: "rein", kanal: "Ticket", zeichen: "#613686", kern: "„Aktuell gibt es bei BISON leider keine Sparplanfunktion für Wertpapiere.“ Einmalkauf nicht beantwortet." },
    { datum: "28.09.2026", richtung: "raus", kanal: "Mail", adresse: "support@bisonapp.com", zeichen: "#613686", kern: "Nachfrage im selben Ticket: Einmalkauf je ISIN ja/nein, alle 22, oder Link auf eine vollständige Liste. Zoho Gesendet #103." },
    { datum: "28.09.2026", richtung: "rein", kanal: "Ticket", zeichen: "#613686", kern: "Zoho INBOX 389, 15:10, vor unserer Nachfrage eingegangen und erst abends gelesen: „Gerne haben wir die Kaufbarkeit der genannten Wertpapiere geprüft. Die folgenden Wertpapiere können bei uns gehandelt werden:“ iShares MSCI World, EM und USA Islamic, WisdomTree Core Physical Silver. Die übrigen 18 nein. Depot vollständig: 3 von 12, 0 von 3, 1 von 7." },
    { datum: "12.10.2026", richtung: "raus", kanal: "Mail", adresse: "affiliate@bsdigital.com", kern: "Partnerfaden, nicht Kaufbarkeit: Nachfass zur Bewerbung für das BISON Affiliate-Programm (Mails vom 13.09., 17.09. und 25.09. ohne Antwort). Zoho Gesendet 127.", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Kaufbarkeit: nichts offen. Kommt auf #103 noch eine Antwort, gegen die Liste vom 28.09. prüfen. Partnerprogramm: Antwort auf die Mail vom 12.10.2026 abwarten." },
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
    { datum: "08.10.2026", richtung: "rein", kanal: "Mail", adresse: "service@sbroker.de", zeichen: "1-3IB4M3V", kern: "Kundenservice (Zoho INBOX 595) auf die Rückfrage vom 07.10.: „Ja diese sind handelbar.“ Gilt für genau die 15 Papiere der Mail: drei iShares Islamic ETFs, vier HSBC Islamic ETFs, iShares USD Sukuk ETF, sieben Gold- und Silber-ETCs von Invesco und WisdomTree. Als kaufbar eingetragen, zum Sparplan sagt die Antwort nichts (belege/sbroker/2026-10-08-antwort-2-ja-handelbar.txt)." },
    { datum: "12.10.2026", richtung: "raus", kanal: "Mail", adresse: "service@sbroker.de", zeichen: "1-3IB4M3V", kern: "Folgefrage im selben Faden über sende.py (Zoho Gesendet 132): sechs weitere Papiere (Invesco Dow Jones Islamic, Invesco MSCI ACWI Islamic, Saturna Al-Kawthar, Xtrackers Salam Sukuk, BNP Hilal Income, Comgest Europe S), je ISIN Einmalkauf und Sparplan (belege/sbroker/2026-10-12-w11-sechs-isins-text.txt). Franklin Shariah Technology blieb draußen: Die Sperre hält Mails mit dem Wort „Shariah“ im Fondsnamen an.", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort auf die Folgefrage vom 12.10.2026 abwarten (sechs Papiere). Offen bleibt Franklin Shariah Technology (Sperre, Entscheidung bei Elias)." },
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
  trading212: { anbieter: "Trading 212", vorgaenge: [
    { datum: "12.10.2026", richtung: "raus", kanal: "Mail", adresse: "partnerships@trading212.com", kern: "Partnerfaden, nicht Kaufbarkeit: Erinnerung an die am 03.09. zugesagte Compliance-Prüfung (Yoan Galchev), dritte Nachfrage seit dem 13.09. Zoho Gesendet 124.", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort von partnerships@trading212.com abwarten. Kein anderes Netzwerk für Deutschland belegt." },
  etoro: { anbieter: "eToro", vorgaenge: [], keinMailWeg: true, naechsterSchritt: "Besucherformular etoro.com/customer-service am 28.09.2026 abends ausgefüllt (Kaufbarkeit 22 ISINs als echtes Wertpapier, Absender elias@finanzmuslim.com). Beim Absenden kam ein reCAPTCHA, das Claude nicht löst; Elias löst es im offenen Tab und sendet. Danach Vorgang „raus“ eintragen." },
};

/**
 * Mailrunde VG10 (25. und 26.11.2026, 82 Häuser) samt Antworten und Folgemails, erzeugt in VG14 aus runde-vg10.json und
 * ausgang_zustand.json am VPS (Stand 2026-11-26T13:11:13+01:00). Schlüssel sind die Häuser der Vergleiche (`stamm`). Wird an
 * ANFRAGEN angehängt: vorhandene Häuser behalten ihre alten Vorgänge, der nächste Schritt kommt aus der Runde.
 */
const RUNDE_VG10: Record<string, Anfrage> = {
  "1822direkt": { anbieter: "1822direkt", vorgaenge: [
    { datum: "25.11.2026", richtung: "raus", kanal: "Mail", adresse: "info@1822direkt.de", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein). Betreff: finanzmuslim.com: eine kurze Frage zum GiroDirekt", von: "elias@finanzmuslim.com" },
    { datum: "25.11.2026", richtung: "rein", kanal: "Mail", adresse: "autoreply@1822direkt.de", kern: "Automatische Eingangsbestätigung der 1822direkt auf eine eingegangene Nachricht. Es wird auf hohe Nachfrage und längere Bearbeitungszeit hingewiesen. Beleg: ~/rebrand/data/vergleiche/belege/1822direkt/2026-11-25-6b9e0a81.txt", automatisch: true },
  ], naechsterSchritt: "Antwort abwarten; ohne Antwort am 02.12. (Erstmail 25.11.) oder 03.12. (26.11.) der andere Weg (MAILREGELN Abschnitt 5)." },
  "alternative-bank-schweiz": { anbieter: "Alternative Bank Schweiz", vorgaenge: [
    { datum: "25.11.2026", richtung: "raus", kanal: "Mail", adresse: "contact@abs.ch", kern: "Mailrunde VG10: Partnerprogramm. Betreff: finanzmuslim.com: Frage zu einem Partnerprogramm bei Alternative Bank Schweiz", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort abwarten; ohne Antwort am 02.12. (Erstmail 25.11.) oder 03.12. (26.11.) der andere Weg (MAILREGELN Abschnitt 5)." },
  "appenzeller-kantonalbank": { anbieter: "Appenzeller Kantonalbank", vorgaenge: [
    { datum: "25.11.2026", richtung: "raus", kanal: "Mail", adresse: "kantonalbank@appkb.ch", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein); Kaufbarkeit je ISIN (IE000929U2U9, IE00B27YCN58, IE00BMYMHS24, XS2115336336) mit Sparplan; Partnerprogramm. Betreff: finanzmuslim.com: kurze Fragen an Appenzeller Kantonalbank", von: "elias@finanzmuslim.com" },
    { datum: "25.11.2026", richtung: "rein", kanal: "Mail", adresse: "Sandro.Meier@appkb.ch", kern: "Die Appenzeller Kantonalbank antwortet: Es werden keine Überzüge gewährt. Regulatorische Vorgaben lassen bestimmte Investitionen über sie nicht zu. Damit sind die vier Wertpapiere (Einmalkauf und Sparplan) sowie die Partnerprogramm-Frage nicht beantwortet. Beleg: ~/rebrand/data/vergleiche/belege/appenzeller-kantonalbank/2026-11-25-035b1d79.txt" },
  ], naechsterSchritt: "Antwort als Beleg ablegen (kein Dispo/Überzug) und bei den vier Papieren eintragen, dass die Bank sie nicht zulässt; Partnerprogramm offen." },
  "bank-cic": { anbieter: "Bank CIC", vorgaenge: [
    { datum: "25.11.2026", richtung: "raus", kanal: "Mail", adresse: "marketing@cic.ch", kern: "Mailrunde VG10: Kaufbarkeit je ISIN (IE000929U2U9, IE00B27YCN58, IE00BMYMHS24, XS2115336336) mit Sparplan; Partnerprogramm. Betreff: finanzmuslim.com: kurze Fragen an Bank CIC", von: "elias@finanzmuslim.com" },
    { datum: "26.11.2026", richtung: "rein", kanal: "Mail", adresse: "noreply@cic.ch", kern: "Automatischer DMARC-Aggregatbericht der Domain cic.ch an finanzmuslim.com. Keine inhaltliche Antwort auf die Mailrunde. Beleg: ~/rebrand/data/vergleiche/belege/bank-cic/2026-11-26-3f7f33d0.txt" },
  ], naechsterSchritt: "nichts" },
  "bank-cler-und-zak": { anbieter: "Bank Cler und Zak", vorgaenge: [
    { datum: "25.11.2026", richtung: "raus", kanal: "Mail", adresse: "medien@cler.ch", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein); Kaufbarkeit je ISIN (IE000929U2U9, IE00B27YCN58, IE00BMYMHS24, XS2115336336) mit Sparplan. Betreff: finanzmuslim.com: kurze Fragen an Bank Cler und Zak", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort abwarten; ohne Antwort am 02.12. (Erstmail 25.11.) oder 03.12. (26.11.) der andere Weg (MAILREGELN Abschnitt 5)." },
  "bank-linth": { anbieter: "Bank Linth", vorgaenge: [
    { datum: "25.11.2026", richtung: "raus", kanal: "Mail", adresse: "info@llb.ch", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein); Partnerprogramm. Betreff: finanzmuslim.com: kurze Fragen an Bank Linth", von: "elias@finanzmuslim.com" },
    { datum: "26.11.2026", richtung: "rein", kanal: "Mail", adresse: "servicedirekt@llb.ch", kern: "LLB (Schweiz) AG antwortet auf die zwei Fragen: Guthaben auf Konten und Verrechnungskonten wird gemäss den gültigen Konditionen automatisch verzinst, ohne separate Aktivierung. Bei Konto- oder Depoteröffnung werden grundsätzlich keine Kreditlimiten oder Überziehungsmöglichkeiten automatisch eingeräumt; bei Vorliegen bestimmter Voraussetzungen kann im Zusammenhang mit einer Debitkarte eine Überziehungslimite von CHF 1'500 gewährt werden, sofern zwei Konten geführt werden. Zum Partnerprogramm wird nichts gesagt. Beleg: ~/rebrand/data/vergleiche/belege/bank-linth/2026-11-26-b31c9a95.txt" },
  ], naechsterSchritt: "Antwort als Beleg ablegen: Verzinsung ja (automatisch, gemäss Konditionen), Dispo/Überziehung grundsätzlich nein, mit Ausnahme CHF 1'500 Debitkarten-Limite bei zwei Konten. Wegen Partnerprogramm nochmals nachhaken." },
  "bank-wir": { anbieter: "Bank WIR", vorgaenge: [
    { datum: "25.11.2026", richtung: "raus", kanal: "Mail", adresse: "medien@wir.ch", kern: "Mailrunde VG10: Partnerprogramm. Betreff: finanzmuslim.com: Frage zu einem Partnerprogramm bei Bank WIR", von: "elias@finanzmuslim.com" },
    { datum: "25.11.2026", richtung: "rein", kanal: "Mail", adresse: "volker.strohm@wir.ch", kern: "Bank WIR teilt mit, dass sie als Genossenschaftsbank ausschließlich in der Schweiz aktiv ist und kein Partnerprogramm besteht. Beleg: ~/rebrand/data/vergleiche/belege/bank-wir/2026-11-25-8623e005.txt" },
  ], naechsterSchritt: "Antwort als Beleg ablegen und Bank WIR als Anbieter ohne Partnerprogramm eintragen." },
  "bank-zweiplus": { anbieter: "Bank zweiplus", vorgaenge: [
    { datum: "25.11.2026", richtung: "raus", kanal: "Mail", adresse: "bankingline@bankzweiplus.ch", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein); Kaufbarkeit je ISIN (IE000929U2U9, IE00B27YCN58, IE00BMYMHS24, XS2115336336) mit Sparplan; Partnerprogramm. Betreff: finanzmuslim.com: kurze Fragen an Bank zweiplus", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort abwarten; ohne Antwort am 02.12. (Erstmail 25.11.) oder 03.12. (26.11.) der andere Weg (MAILREGELN Abschnitt 5)." },
  "bank99": { anbieter: "bank99", vorgaenge: [
    { datum: "25.11.2026", richtung: "raus", kanal: "Mail", adresse: "service@bank99.at", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein); Kaufbarkeit je ISIN (IE00B27YCN58, XS2115336336) mit Sparplan; Partnerprogramm. Betreff: finanzmuslim.com: kurze Fragen an bank99", von: "elias@finanzmuslim.com" },
    { datum: "25.11.2026", richtung: "rein", kanal: "Mail", adresse: "service@bank99.at", kern: "Automatische Eingangsbestätigung von bank99 auf die Anfrage vom 25.11.2026. Es wird um Geduld gebeten, Mehrfachanfragen sollen unterbleiben. Beleg: ~/rebrand/data/vergleiche/belege/bank99/2026-11-25-817d0a51.txt", automatisch: true },
  ], naechsterSchritt: "Antwort abwarten; ohne Antwort am 02.12. (Erstmail 25.11.) oder 03.12. (26.11.) der andere Weg (MAILREGELN Abschnitt 5)." },
  "banque-cantonale-de-geneve": { anbieter: "Banque Cantonale de Genève", vorgaenge: [
    { datum: "25.11.2026", richtung: "raus", kanal: "Mail", adresse: "info@bcge.ch", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein); Kaufbarkeit je ISIN (IE000929U2U9, IE00B27YCN58, IE00BMYMHS24, XS2115336336) mit Sparplan; Partnerprogramm. Betreff: finanzmuslim.com: kurze Fragen an Banque Cantonale de Genève", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort abwarten; ohne Antwort am 02.12. (Erstmail 25.11.) oder 03.12. (26.11.) der andere Weg (MAILREGELN Abschnitt 5)." },
  "banque-cantonale-du-jura": { anbieter: "Banque Cantonale du Jura", vorgaenge: [
    { datum: "25.11.2026", richtung: "raus", kanal: "Mail", adresse: "bcj@bcj.ch", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein); Partnerprogramm. Betreff: finanzmuslim.com: kurze Fragen an Banque Cantonale du Jura", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort abwarten; ohne Antwort am 02.12. (Erstmail 25.11.) oder 03.12. (26.11.) der andere Weg (MAILREGELN Abschnitt 5)." },
  "banque-cantonale-du-valais": { anbieter: "Banque Cantonale du Valais", vorgaenge: [
    { datum: "25.11.2026", richtung: "raus", kanal: "Mail", adresse: "info@bcvs.ch", kern: "Mailrunde VG10: Kaufbarkeit je ISIN (IE000929U2U9, IE00B27YCN58, IE00BMYMHS24, XS2115336336) mit Sparplan; Partnerprogramm. Betreff: finanzmuslim.com: kurze Fragen an Banque Cantonale du Valais", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort abwarten; ohne Antwort am 02.12. (Erstmail 25.11.) oder 03.12. (26.11.) der andere Weg (MAILREGELN Abschnitt 5)." },
  "banque-cantonale-neuchateloise": { anbieter: "Banque Cantonale Neuchâteloise", vorgaenge: [
    { datum: "25.11.2026", richtung: "raus", kanal: "Mail", adresse: "info@bcn.ch", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein); Kaufbarkeit je ISIN (IE000929U2U9, IE00B27YCN58, IE00BMYMHS24, XS2115336336) mit Sparplan; Partnerprogramm. Betreff: finanzmuslim.com: kurze Fragen an Banque Cantonale Neuchâteloise", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort abwarten; ohne Antwort am 02.12. (Erstmail 25.11.) oder 03.12. (26.11.) der andere Weg (MAILREGELN Abschnitt 5)." },
  "banque-cantonale-vaudoise": { anbieter: "Banque Cantonale Vaudoise", vorgaenge: [
    { datum: "25.11.2026", richtung: "raus", kanal: "Mail", adresse: "presse@bcv.ch", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein); Kaufbarkeit je ISIN (IE000929U2U9, IE00B27YCN58, IE00BMYMHS24, XS2115336336) mit Sparplan; Partnerprogramm. Betreff: finanzmuslim.com: kurze Fragen an Banque Cantonale Vaudoise", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort abwarten; ohne Antwort am 02.12. (Erstmail 25.11.) oder 03.12. (26.11.) der andere Weg (MAILREGELN Abschnitt 5)." },
  "basellandschaftliche-kantonalbank": { anbieter: "Basellandschaftliche Kantonalbank", vorgaenge: [
    { datum: "25.11.2026", richtung: "raus", kanal: "Mail", adresse: "kundencenter@blkb.ch", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein); Kaufbarkeit je ISIN (IE000929U2U9, IE00B27YCN58, IE00BMYMHS24, XS2115336336) mit Sparplan; Partnerprogramm. Betreff: finanzmuslim.com: kurze Fragen an Basellandschaftliche Kantonalbank", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort abwarten; ohne Antwort am 02.12. (Erstmail 25.11.) oder 03.12. (26.11.) der andere Weg (MAILREGELN Abschnitt 5)." },
  "basler-kantonalbank": { anbieter: "Basler Kantonalbank", vorgaenge: [
    { datum: "25.11.2026", richtung: "raus", kanal: "Mail", adresse: "medien@bkb.ch", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein); Kaufbarkeit je ISIN (IE000929U2U9, IE00B27YCN58, IE00BMYMHS24, XS2115336336) mit Sparplan; Partnerprogramm. Betreff: finanzmuslim.com: kurze Fragen an Basler Kantonalbank", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort abwarten; ohne Antwort am 02.12. (Erstmail 25.11.) oder 03.12. (26.11.) der andere Weg (MAILREGELN Abschnitt 5)." },
  "bawag-gruppe-bawag-easybank": { anbieter: "BAWAG und easybank", vorgaenge: [
    { datum: "25.11.2026", richtung: "raus", kanal: "Mail", adresse: "kundenservice@bawag.at", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein); Kaufbarkeit je ISIN (IE000929U2U9, IE000LFC57H7, IE00B27YCN58, XS2115336336). Betreff: finanzmuslim.com: kurze Fragen an BAWAG und easybank", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort abwarten; ohne Antwort am 02.12. (Erstmail 25.11.) oder 03.12. (26.11.) der andere Weg (MAILREGELN Abschnitt 5)." },
  "bbbank": { anbieter: "BBBank", vorgaenge: [
    { datum: "25.11.2026", richtung: "raus", kanal: "Mail", adresse: "jan.filler@bbbank.de", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein). Betreff: AW: finanzmuslim.com: kurze Frage zum BBBank Depot", von: "elias@finanzmuslim.com" },
    { datum: "25.11.2026", richtung: "rein", kanal: "Mail", adresse: "jan.filler@bbbank.de", kern: "Das Depotverrechnungskonto wird nicht automatisch verzinst. Eine Verzinsung hängt davon ab, ob der Kunde ein Girokonto oder Tagesgeld-Konto als Verrechnungskonto einrichtet; Angebote dazu stehen auf der Homepage. Beleg: ~/rebrand/data/vergleiche/belege/bbbank/2026-11-25-1df515b5.txt" },
  ], naechsterSchritt: "Antwort als Beleg ablegen und beim BBBBank Depot eintragen, dass das Verrechnungskonto ohne weiteres Konto nicht verzinst wird; Zinssätze bleiben offen." },
  "berner-kantonalbank": { anbieter: "Berner Kantonalbank", vorgaenge: [
    { datum: "25.11.2026", richtung: "raus", kanal: "Mail", adresse: "bekb@bekb.ch", kern: "Mailrunde VG10: Kaufbarkeit je ISIN (IE000929U2U9, IE00B27YCN58, IE00BMYMHS24, XS2115336336) mit Sparplan; Partnerprogramm. Betreff: finanzmuslim.com: kurze Fragen an Berner Kantonalbank", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort abwarten; ohne Antwort am 02.12. (Erstmail 25.11.) oder 03.12. (26.11.) der andere Weg (MAILREGELN Abschnitt 5)." },
  "bforbank": { anbieter: "BforBank", vorgaenge: [
    { datum: "25.11.2026", richtung: "raus", kanal: "Mail", adresse: "kundenservice-de@customers.bforbank.com", kern: "Mailrunde VG10: Partnerprogramm. Betreff: finanzmuslim.com: Frage zu einem Partnerprogramm bei BforBank", von: "elias@finanzmuslim.com" },
    { datum: "25.11.2026", richtung: "rein", kanal: "Mail", adresse: "kundenservice-de@customers.bforbank.com", kern: "BforBank bestätigt den Eingang der Partnerprogramm-Anfrage vom 25.11.2026 und kündigt eine Antwort der Berater an. Inhaltliche Aussagen zum Partnerprogramm fehlen. Beleg: ~/rebrand/data/vergleiche/belege/bforbank/2026-11-25-6bb581bf.txt", automatisch: true },
  ], naechsterSchritt: "Antwort abwarten; ohne Antwort am 02.12. (Erstmail 25.11.) oder 03.12. (26.11.) der andere Weg (MAILREGELN Abschnitt 5)." },
  "bks-bank": { anbieter: "BKS Bank", vorgaenge: [
    { datum: "25.11.2026", richtung: "raus", kanal: "Mail", adresse: "bks@bks.at", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein); Kaufbarkeit je ISIN (IE00B27YCN58, XS2115336336); Partnerprogramm. Betreff: finanzmuslim.com: kurze Fragen an die BKS Bank", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort abwarten; ohne Antwort am 02.12. (Erstmail 25.11.) oder 03.12. (26.11.) der andere Weg (MAILREGELN Abschnitt 5)." },
  "bps-suisse": { anbieter: "BPS (Suisse)", vorgaenge: [
    { datum: "25.11.2026", richtung: "raus", kanal: "Mail", adresse: "contact@bps-suisse.ch", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein); Partnerprogramm. Betreff: finanzmuslim.com: kurze Fragen an BPS (Suisse)", von: "elias@finanzmuslim.com" },
    { datum: "25.11.2026", richtung: "rein", kanal: "Mail", adresse: "Mailbox.Contact@bps-suisse.ch", kern: "BPS (Suisse) antwortet auf die Anfrage: Bei Kontoeröffnung wird kein Dispo, keine Überziehung und kein Kredit automatisch eingeräumt. Zum Partnerprogramm äußert sich die Bank nicht. Beleg: ~/rebrand/data/vergleiche/belege/bps-suisse/2026-11-25-2ce9e0d2.txt" },
  ], naechsterSchritt: "Antwort als Beleg ablegen und eintragen, dass kein Dispo/keine Überziehung bei Eröffnung eingeräumt wird. Wegen Partnerprogramm nachhaken oder auf eine Antwort warten." },
  "btv-bankhaus-spangler-schelhammer": { anbieter: "BTV, Spängler und Schelhammer", vorgaenge: [
    { datum: "25.11.2026", richtung: "raus", kanal: "Mail", adresse: "info@btv.at", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein); Partnerprogramm. Betreff: finanzmuslim.com: kurze Fragen an BTV, Spängler und Schelhammer", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort abwarten; ohne Antwort am 02.12. (Erstmail 25.11.) oder 03.12. (26.11.) der andere Weg (MAILREGELN Abschnitt 5)." },
  "bunq": { anbieter: "bunq", vorgaenge: [
    { datum: "25.11.2026", richtung: "raus", kanal: "Mail", adresse: "support@bunq.com", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein); Kaufbarkeit je ISIN (IE000929U2U9, IE000LFC57H7, IE000UOXRAM8, IE00B27YCN58, IE00B27YCP72, IE00B296QM64, XS2115336336) mit Sparplan. Betreff: finanzmuslim.com: kurze Fragen an bunq", von: "elias@finanzmuslim.com" },
    { datum: "25.11.2026", richtung: "rein", kanal: "Mail", adresse: "support+02f78c60-4970-41b2-ae82-dac836fc1013@update.bunq.com", kern: "bunq beantwortet die drei Fragen: Guthaben auf dem regulären Konto wird nicht automatisch verzinst, Zinsen nur auf einem separaten Sparkonto mit aktivierter Payday-Funktion; Dispo, Überziehung und persönliche Darlehen werden nicht angeboten, einzige Kreditoption ist ein optionales Kreditlimit auf der Credit Card; ob die ISINs handelbar sind, kann der Support nicht bestätigen, verwiesen wird auf die App und den Partner Ginmon. Beleg: ~/rebrand/data/vergleiche/belege/bunq/2026-11-25-7094dc9f.txt" },
  ], naechsterSchritt: "Antwort als Beleg ablegen, Sparplan-Hinweis (bunq Pro/Elite, ab 10 €) und fehlende Verzinsung des Verrechnungskontos notieren; ISINs einzeln in der App prüfen und das Ergebnis schriftlich festhalten." },
  "commerzbank": { anbieter: "Commerzbank", vorgaenge: [
    { datum: "25.11.2026", richtung: "raus", kanal: "Mail", adresse: "info@commerzbank.com", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein). Betreff: finanzmuslim.com: kurze Fragen an die Commerzbank", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort abwarten; ohne Antwort am 02.12. (Erstmail 25.11.) oder 03.12. (26.11.) der andere Weg (MAILREGELN Abschnitt 5)." },
  "consorsbank": { anbieter: "Consorsbank und Hello bank", vorgaenge: [
    { datum: "25.11.2026", richtung: "raus", kanal: "Mail", adresse: "kundenbetreuung@consorsbank.de", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein); Kaufbarkeit je ISIN (IE00B27YCN58, XS2115336336) mit Sparplan. Betreff: finanzmuslim.com: kurze Fragen zu Hello bank Österreich", von: "elias@finanzmuslim.com" },
    { datum: "25.11.2026", richtung: "rein", kanal: "Mail", adresse: "kundenbetreuung@consorsbank.de", kern: "Automatische Eingangsbestätigung der Consorsbank zur Mailrunde vom 25.11.2026 zu Hello bank Österreich. Eine persönliche Antwort wird angekündigt. Beleg: ~/rebrand/data/vergleiche/belege/consorsbank-und-hello-bank/2026-11-25-f1e94ad0.txt", automatisch: true },
  ], naechsterSchritt: "Antwort abwarten; ohne Antwort am 02.12. (Erstmail 25.11.) oder 03.12. (26.11.) der andere Weg (MAILREGELN Abschnitt 5)." },
  "cornertrader": { anbieter: "Cornèrtrader", vorgaenge: [
    { datum: "25.11.2026", richtung: "raus", kanal: "Mail", adresse: "info@cornertrader.ch", kern: "Mailrunde VG10: Kaufbarkeit je ISIN (IE000929U2U9, IE00B27YCN58, IE00BMYMHS24, XS2115336336) mit Sparplan; Partnerprogramm. Betreff: finanzmuslim.com: kurze Fragen an Cornèrtrader", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort abwarten; ohne Antwort am 02.12. (Erstmail 25.11.) oder 03.12. (26.11.) der andere Weg (MAILREGELN Abschnitt 5)." },
  "dadat-bank": { anbieter: "DADAT Bank", vorgaenge: [
    { datum: "25.11.2026", richtung: "raus", kanal: "Mail", adresse: "office@dad.at", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein); Kaufbarkeit je ISIN (IE000929U2U9, IE000LFC57H7, IE00B27YCN58, XS2115336336). Betreff: finanzmuslim.com: kurze Fragen an die DADAT Bank", von: "elias@finanzmuslim.com" },
    { datum: "25.11.2026", richtung: "rein", kanal: "Mail", adresse: "office@dad.at", kern: "DADAT bestätigt den Eingang der Anfrage vom 25.11.2026 mit Ticketnummer 2026112574002762 und verweist auf telefonischen Kundenservice. Keine inhaltliche Antwort. Beleg: ~/rebrand/data/vergleiche/belege/dadat-bank/2026-11-25-f72f02fe.txt", automatisch: true },
  ], naechsterSchritt: "Antwort abwarten; ohne Antwort am 02.12. (Erstmail 25.11.) oder 03.12. (26.11.) der andere Weg (MAILREGELN Abschnitt 5)." },
  "denizbank-osterreich": { anbieter: "DenizBank", vorgaenge: [
    { datum: "25.11.2026", richtung: "raus", kanal: "Mail", adresse: "service@denizbank.at", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein); Partnerprogramm. Betreff: finanzmuslim.com: kurze Fragen an die DenizBank", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort abwarten; ohne Antwort am 02.12. (Erstmail 25.11.) oder 03.12. (26.11.) der andere Weg (MAILREGELN Abschnitt 5)." },
  "erste-bank-und-sparkassen": { anbieter: "Erste Bank", vorgaenge: [
    { datum: "25.11.2026", richtung: "raus", kanal: "Mail", adresse: "service@s-servicecenter.at", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein); Kaufbarkeit je ISIN (IE000929U2U9, IE00B27YCN58, XS2115336336) mit Sparplan. Betreff: finanzmuslim.com: kurze Fragen an die Erste Bank", von: "elias@finanzmuslim.com" },
    { datum: "25.11.2026", richtung: "rein", kanal: "Mail", adresse: "service@s-servicecenter.at", kern: "Die s Servicecenter GmbH bestätigt den Eingang der Anfrage und vergibt die Vorgangsnummer 4697845. Eine inhaltliche Antwort zu Habenzins, Überziehungsrahmen und den drei Wertpapieren fehlt. Beleg: ~/rebrand/data/vergleiche/belege/erste-bank-und-sparkassen/2026-11-25-97373825.txt", automatisch: true },
    { datum: "25.11.2026", richtung: "rein", kanal: "Mail", adresse: "service@s-servicecenter.at", kern: "Das s ServiceCenter bittet um Nennung einer Filiale, an die die Anfrage weitergeleitet werden kann, damit sie bearbeitet wird. Beleg: ~/rebrand/data/vergleiche/belege/erste-bank-und-sparkassen/2026-11-25-8fe5e6f8.txt" },
    { datum: "26.11.2026", richtung: "raus", kanal: "Mail", adresse: "service@s-servicecenter.at", kern: "Antwort im Faden (2026-11-26-vg13-010-erste-bank-antwort.json): Re: finanzmuslim.com: kurze Fragen an die Erste Bank (KMM11801461V16673L0KM)", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Eine Filiale der Erste Bank in Österreich nennen und um Weiterleitung bitten, am besten mit Hinweis auf das Selfinvest Depot." },
  "finanzen-net-zero": { anbieter: "Finanzen invest", vorgaenge: [
    { datum: "25.11.2026", richtung: "raus", kanal: "Mail", adresse: "service@finanzen-zero.net", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein); Kaufbarkeit je ISIN (XS2115336336). Betreff: finanzmuslim.com: kurze Fragen an Finanzen invest", von: "elias@finanzmuslim.com" },
    { datum: "25.11.2026", richtung: "rein", kanal: "Mail", adresse: "service@finanzen-zero.net", kern: "Automatische Eingangsbestätigung zu Anfrage 3756003. Eine inhaltliche Antwort ist nicht enthalten; es wird eine persönliche Rückmeldung in Aussicht gestellt. Beleg: ~/rebrand/data/vergleiche/belege/finanzen-invest/2026-11-25-c695d591.txt", automatisch: true },
    { datum: "25.11.2026", richtung: "rein", kanal: "Mail", adresse: "service@finanzen-zero.net", kern: "Auf die Anfrage vom 25.11. antwortet Finanzen invest: Bei Eröffnung wird kein Kredit eingeräumt. Für handelbare Produkte wird auf die Übersichtsseite verwiesen. Beleg: ~/rebrand/data/vergleiche/belege/finanzen-invest/2026-11-25-05361c68.txt" },
    { datum: "26.11.2026", richtung: "raus", kanal: "Mail", adresse: "service@finanzen-zero.net", kern: "Antwort im Faden (2026-11-26-vg13-012-finanzen-invest-antwort.json): Re: Deine Anfrage [3756003]: finanzmuslim.com: kurze Fragen an Finanzen invest", von: "elias@finanzmuslim.com" },
    { datum: "26.11.2026", richtung: "rein", kanal: "Mail", adresse: "service@finanzen-zero.net", kern: "Finanzen invest bestätigt, dass die ISIN XS2115336336 über die Partnerbörse gettex handelbar ist. Keine Aussage zu Zins, Ausgabeaufschlag oder Mindestanlage. Beleg: ~/rebrand/data/vergleiche/belege/finanzen-invest/2026-11-26-ee9e64bc.txt" },
  ], naechsterSchritt: "Antwort als Beleg ablegen, XS2115336336 mit Belegart schriftlich eintragen und in der nächsten Runde Zins, Ausgabeaufschlag und Mindestanlage erneut anfragen." },
  "finom": { anbieter: "Finom", vorgaenge: [
    { datum: "25.11.2026", richtung: "raus", kanal: "Mail", adresse: "hello@finom.co", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein). Betreff: finanzmuslim.com: kurze Fragen an Finom", von: "elias@finanzmuslim.com" },
    { datum: "25.11.2026", richtung: "rein", kanal: "Mail", adresse: "hello@finom.co", kern: "Finom antwortet auf zwei Fragen: Auf dem normalen Geschäftskonto werden keine Zinsen gewährt; Zinsen entstehen nur bei aktiver Übertragung in das Interest Wallet. Der Dispokredit wird nicht automatisch eingerichtet, sondern erscheint in der App als Angebot und muss vom Kontoinhaber aktiviert werden. Beleg: ~/rebrand/data/vergleiche/belege/finom/2026-11-25-bf57359c.txt" },
    { datum: "26.11.2026", richtung: "rein", kanal: "Mail", adresse: "hello@finom.co", kern: "Finom fragt nach, ob wir für die Bewertung weitere Details zu Verzinsung und Dispokredit brauchen. Eine inhaltliche Antwort auf die ursprünglichen Fragen ist nicht enthalten. Beleg: ~/rebrand/data/vergleiche/belege/finom/2026-11-26-4e8ad60b.txt" },
  ], naechsterSchritt: "Finom mitteilen, dass wir die Antworten zu Verzinsung und Dispokredit noch brauchen, und um eine schriftliche Auskunft bitten." },
  "finst": { anbieter: "Finst", vorgaenge: [
    { datum: "25.11.2026", richtung: "raus", kanal: "Mail", adresse: "support@finst.com", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein). Betreff: finanzmuslim.com: kurze Fragen an Finst", von: "elias@finanzmuslim.com" },
    { datum: "25.11.2026", richtung: "rein", kanal: "Mail", adresse: "mohamed@mail.finst.com", kern: "Finst antwortet auf die zwei Fragen: Guthaben wird nicht automatisch verzinst (Staking nur optional und deaktiviert); kein Dispo, keine Überziehung, keine Kreditlinie, kein Verleih von Geld. Beleg: ~/rebrand/data/vergleiche/belege/finst/2026-11-25-3afdf86b.txt" },
  ], naechsterSchritt: "Antwort als Beleg ablegen und Finst mit Belegart schriftlich zu den offenen ISINs/kaufbaren Papieren nachhaken." },
  "finvesto": { anbieter: "finvesto (FNZ Bank)", vorgaenge: [
    { datum: "25.11.2026", richtung: "raus", kanal: "Mail", adresse: "Wertpapierdepot@fnz.de", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein); Kaufbarkeit je ISIN (XS2115336336). Betreff: finanzmuslim.com: eine letzte kurze Frage zum finvesto Wertpapierdepot", von: "elias@finanzmuslim.com" },
    { datum: "25.11.2026", richtung: "rein", kanal: "Mail", adresse: "noreply-service@fnz.de", kern: "Automatische Eingangsbestätigung der FNZ Bank zur Mail vom 25.11.2026. Keine inhaltliche Antwort, Hinweis auf spätere Antwort. Beleg: ~/rebrand/data/vergleiche/belege/finvesto-fnz-bank/2026-11-25-25799c5f.txt", automatisch: true },
    { datum: "26.11.2026", richtung: "rein", kanal: "Mail", adresse: "Wertpapierdepot@fnz.de", kern: "Beim finvesto Wertpapierdepot wird mit Eröffnung kein Kreditrahmen eingeräumt; ein Wertpapierkredit muss extra im Online Banking beantragt werden und läuft dann auf einem separaten Konto. Die angefragte ISIN XS2115336336 (Royal Mint Physical Gold ETC) ist im Wertpapierdepot erwerbbar. Beleg: ~/rebrand/data/vergleiche/belege/finvesto-fnz-bank/2026-11-26-a81df4c7.txt" },
  ], naechsterSchritt: "Antwort als Beleg ablegen und XS2115336336 mit Belegart schriftlich eintragen; Kreditrahmen als „nein, nur auf Antrag, separates Konto“ notieren. Die offenen ISINs aus der 07.10.-Runde weiter abwarten." },
  "flatexdegiro": { anbieter: "flatexDEGIRO", vorgaenge: [
    { datum: "25.11.2026", richtung: "raus", kanal: "Mail", adresse: "affiliates@flatexdegiro.com", kern: "Mailrunde VG10: Kaufbarkeit je ISIN (IE000929U2U9). Betreff: RE: Partnership enquiry: finanzmuslim, finance and comparison portal for Muslims", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort abwarten; ohne Antwort am 02.12. (Erstmail 25.11.) oder 03.12. (26.11.) der andere Weg (MAILREGELN Abschnitt 5)." },
  "glarner-kantonalbank": { anbieter: "Glarner Kantonalbank", vorgaenge: [
    { datum: "25.11.2026", richtung: "raus", kanal: "Mail", adresse: "glkb@glkb.ch", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein); Kaufbarkeit je ISIN (IE000929U2U9, IE00B27YCN58, IE00BMYMHS24, XS2115336336) mit Sparplan; Partnerprogramm. Betreff: finanzmuslim.com: kurze Fragen an Glarner Kantonalbank", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort abwarten; ohne Antwort am 02.12. (Erstmail 25.11.) oder 03.12. (26.11.) der andere Weg (MAILREGELN Abschnitt 5)." },
  "gls": { anbieter: "GLS Bank", vorgaenge: [
    { datum: "25.11.2026", richtung: "raus", kanal: "Mail", adresse: "kundendialog@gls.de", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein); Partnerprogramm. Betreff: finanzmuslim.com: kurze Frage zum Geschäftskonto", von: "elias@finanzmuslim.com" },
    { datum: "25.11.2026", richtung: "rein", kanal: "Mail", adresse: "autoreply@gls.de", kern: "Automatische Antwort der GLS Bank auf eine eingegangene Mail. Bestätigt den Eingang und verweist auf Onlinebanking und Selfservice, keine inhaltliche Antwort. Beleg: ~/rebrand/data/vergleiche/belege/gls-bank/2026-11-25-e19b14e2.txt", automatisch: true },
  ], naechsterSchritt: "Antwort abwarten; ohne Antwort am 02.12. (Erstmail 25.11.) oder 03.12. (26.11.) der andere Weg (MAILREGELN Abschnitt 5)." },
  "graubundner-kantonalbank": { anbieter: "Graubündner Kantonalbank", vorgaenge: [
    { datum: "25.11.2026", richtung: "raus", kanal: "Mail", adresse: "info@gkb.ch", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein); Kaufbarkeit je ISIN (IE000929U2U9, IE00B27YCN58, IE00BMYMHS24, XS2115336336) mit Sparplan; Partnerprogramm. Betreff: finanzmuslim.com: kurze Fragen an Graubündner Kantonalbank", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort abwarten; ohne Antwort am 02.12. (Erstmail 25.11.) oder 03.12. (26.11.) der andere Weg (MAILREGELN Abschnitt 5)." },
  "habib-bank-ag-zurich": { anbieter: "Habib Bank AG Zurich", vorgaenge: [
    { datum: "25.11.2026", richtung: "raus", kanal: "Mail", adresse: "customer.support@habibbank.com", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein); Partnerprogramm. Betreff: finanzmuslim.com: kurze Fragen an Habib Bank AG Zurich", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort abwarten; ohne Antwort am 02.12. (Erstmail 25.11.) oder 03.12. (26.11.) der andere Weg (MAILREGELN Abschnitt 5)." },
  "haspa": { anbieter: "Hamburger Sparkasse", vorgaenge: [
    { datum: "25.11.2026", richtung: "raus", kanal: "Mail", adresse: "haspa@haspa.de", kern: "Mailrunde VG10: Partnerprogramm. Betreff: finanzmuslim.com: Frage zu einem Partnerprogramm bei Hamburger Sparkasse", von: "elias@finanzmuslim.com" },
    { datum: "25.11.2026", richtung: "rein", kanal: "Mail", adresse: "noreply@haspa.de", kern: "Automatische Eingangsbestätigung der Hamburger Sparkasse auf eine Mailanfrage. Es wird mitgeteilt, dass die Anfrage bearbeitet wird und eine Antwort innerhalb von 2 Arbeitstagen zu erwarten ist. Beleg: ~/rebrand/data/vergleiche/belege/hamburger-sparkasse/2026-11-25-9ea6c89b.txt", automatisch: true },
  ], naechsterSchritt: "Antwort abwarten; ohne Antwort am 02.12. (Erstmail 25.11.) oder 03.12. (26.11.) der andere Weg (MAILREGELN Abschnitt 5)." },
  "holvi": { anbieter: "Holvi", vorgaenge: [
    { datum: "25.11.2026", richtung: "raus", kanal: "Mail", adresse: "support@holvi.com", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein). Betreff: finanzmuslim.com: kurze Fragen an Holvi", von: "elias@finanzmuslim.com" },
    { datum: "25.11.2026", richtung: "rein", kanal: "Mail", adresse: "support@holvi.com", kern: "Holvi bestätigt den Eingang der Anfrage #1263808 und kündigt eine Antwort innerhalb eines Werktags an. Beleg: ~/rebrand/data/vergleiche/belege/holvi/2026-11-25-9f43b874.txt", automatisch: true },
    { datum: "26.11.2026", richtung: "rein", kanal: "Mail", adresse: "support@holvi.com", kern: "Holvi antwortet auf die Anfrage: keine Verzinsung, da Geschäftskonto; Kontoüberziehung nicht möglich. Beleg: ~/rebrand/data/vergleiche/belege/holvi/2026-11-26-b73d0902.txt" },
    { datum: "26.11.2026", richtung: "rein", kanal: "Mail", adresse: "support@holvi.com", kern: "Holvi Support bestätigt: keine Verzinsung auf dem Geschäftskonto, keine automatische Überziehung. Zusätzlich Bitte um Feedback zur Anfrage. Beleg: ~/rebrand/data/vergleiche/belege/holvi/2026-11-26-f66faa25.txt" },
  ], naechsterSchritt: "Antwort als Beleg ablegen: Holvi Geschäftskonto – keine Verzinsung, keine Überziehung. Feedback-Umfrage ignorieren." },
  "hvb": { anbieter: "HVB und Bank Austria", vorgaenge: [
    { datum: "26.11.2026", richtung: "raus", kanal: "Mail", adresse: "info@unicredit.de", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein); Kaufbarkeit je ISIN (IE00B27YCN58, XS2115336336) mit Sparplan; Partnerprogramm. Betreff: finanzmuslim.com: kurze Fragen an HVB und Bank Austria", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort abwarten; ohne Antwort am 02.12. (Erstmail 25.11.) oder 03.12. (26.11.) der andere Weg (MAILREGELN Abschnitt 5)." },
  "hypo-landesbanken": { anbieter: "HYPO Landesbanken", vorgaenge: [
    { datum: "25.11.2026", richtung: "raus", kanal: "Mail", adresse: "landesbank@hyponoe.at", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein); Partnerprogramm. Betreff: finanzmuslim.com: kurze Fragen an die HYPO Landesbanken", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort abwarten; ohne Antwort am 02.12. (Erstmail 25.11.) oder 03.12. (26.11.) der andere Weg (MAILREGELN Abschnitt 5)." },
  "hypothekarbank-lenzburg": { anbieter: "Hypothekarbank Lenzburg", vorgaenge: [
    { datum: "26.11.2026", richtung: "raus", kanal: "Mail", adresse: "info@hbl.ch", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein); Kaufbarkeit je ISIN (IE000929U2U9, IE00B27YCN58, IE00BMYMHS24, XS2115336336) mit Sparplan; Partnerprogramm. Betreff: finanzmuslim.com: kurze Fragen an Hypothekarbank Lenzburg", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort abwarten; ohne Antwort am 02.12. (Erstmail 25.11.) oder 03.12. (26.11.) der andere Weg (MAILREGELN Abschnitt 5)." },
  "ing": { anbieter: "ING", vorgaenge: [
    { datum: "25.11.2026", richtung: "raus", kanal: "Mail", adresse: "info@ing.de", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein). Betreff: finanzmuslim.com: eine kurze Frage zum Girokonto", von: "elias@finanzmuslim.com" },
    { datum: "25.11.2026", richtung: "rein", kanal: "Mail", adresse: "info@ing.de", kern: "Automatische Eingangsbestätigung der ING auf die Mailrunde vg10 zum Girokonto vom 25.11.2026. Eine persönliche Antwort wird noch angekündigt. Beleg: ~/rebrand/data/vergleiche/belege/ing/2026-11-25-45738a4f.txt", automatisch: true },
    { datum: "26.11.2026", richtung: "rein", kanal: "Mail", adresse: "info@ing.de", kern: "Die ING antwortet auf die Dispo-Frage zum Girokonto: Bei Kontoeröffnung gibt es auf Wunsch eine eingeräumte Überziehung von 500 Euro. Keine Aussage zur automatischen Einräumung nach Gehaltseingang. Keine Aussage zur Verzinsung des Girokontos. Beleg: ~/rebrand/data/vergleiche/belege/ing/2026-11-26-aa3de37b.txt" },
  ], naechsterSchritt: "Antwort als Beleg ablegen und beim Girokonto mit Belegart schriftlich eintragen; Verzinsung Girokonto ist schon im Verlauf dokumentiert." },
  "joe-broker": { anbieter: "JOE Broker", vorgaenge: [
    { datum: "25.11.2026", richtung: "raus", kanal: "Mail", adresse: "support@joebroker.de", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein); Kaufbarkeit je ISIN (IE000LFC57H7, IE000UOXRAM8, IE00B579F325, IE00BMYMHS24, LU1150255971, LU3123443510, XS2115336336) mit Sparplan. Betreff: Re: finanzmuslim.com: Wertpapiere im JOE Broker Depot (Bezug JBSPROD-13897)", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort abwarten; ohne Antwort am 02.12. (Erstmail 25.11.) oder 03.12. (26.11.) der andere Weg (MAILREGELN Abschnitt 5)." },
  "justtrade": { anbieter: "JustTRADE", vorgaenge: [
    { datum: "25.11.2026", richtung: "raus", kanal: "Mail", adresse: "service@justtrade.com", kern: "Mailrunde VG10: Kaufbarkeit je ISIN (XS2115336336). Betreff: Re: Antwort auf Ihre Anfrage Nr. (#128412)", von: "elias@finanzmuslim.com" },
    { datum: "25.11.2026", richtung: "rein", kanal: "Mail", adresse: "service@justtrade.com", kern: "Automatische Eingangsbestätigung zu Ticket #131568, gespeichert am 25.11.2026. Eine persönliche Antwort soll folgen. Beleg: ~/rebrand/data/vergleiche/belege/justtrade/2026-11-25-f5906d78.txt", automatisch: true },
    { datum: "25.11.2026", richtung: "rein", kanal: "Mail", adresse: "service@justtrade.com", kern: "justTRADE bestätigt, dass das Wertpapier XS2115336336 über sie handelbar ist. Die Antwort bezieht sich auf die Nachfrage vom 25.11.2026 (Re: #128412). Beleg: ~/rebrand/data/vergleiche/belege/justtrade/2026-11-25-e469dafa.txt" },
  ], naechsterSchritt: "Antwort als Beleg ablegen und XS2115336336 mit Belegart „schriftlich“ eintragen; Sparplanstatus bleibt offen." },
  "klarna": { anbieter: "Klarna Konto", vorgaenge: [
    { datum: "26.11.2026", richtung: "raus", kanal: "Mail", adresse: "kunde@klarna.de", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein); Partnerprogramm. Betreff: finanzmuslim.com: kurze Fragen zum Klarna Konto", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort abwarten; ohne Antwort am 02.12. (Erstmail 25.11.) oder 03.12. (26.11.) der andere Weg (MAILREGELN Abschnitt 5)." },
  "kontist": { anbieter: "Kontist", vorgaenge: [
    { datum: "26.11.2026", richtung: "raus", kanal: "Mail", adresse: "support@kontist.com", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein). Betreff: finanzmuslim.com: eine kurze Frage an Kontist", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort abwarten; ohne Antwort am 02.12. (Erstmail 25.11.) oder 03.12. (26.11.) der andere Weg (MAILREGELN Abschnitt 5)." },
  "luzerner-kantonalbank": { anbieter: "Luzerner Kantonalbank", vorgaenge: [
    { datum: "26.11.2026", richtung: "raus", kanal: "Mail", adresse: "info@lukb.ch", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein); Kaufbarkeit je ISIN (IE000929U2U9, IE00B27YCN58, IE00BMYMHS24, XS2115336336) mit Sparplan; Partnerprogramm. Betreff: finanzmuslim.com: kurze Fragen an Luzerner Kantonalbank", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort abwarten; ohne Antwort am 02.12. (Erstmail 25.11.) oder 03.12. (26.11.) der andere Weg (MAILREGELN Abschnitt 5)." },
  "maxblue": { anbieter: "Deutsche Bank Gruppe", vorgaenge: [
    { datum: "25.11.2026", richtung: "raus", kanal: "Mail", adresse: "deutsche.bank@db.com", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein). Betreff: finanzmuslim.com: kurze Fragen an die Deutsche Bank Gruppe", von: "elias@finanzmuslim.com" },
    { datum: "25.11.2026", richtung: "rein", kanal: "Mail", adresse: "db.no-reply@db.com", kern: "Automatische Antwort der norisbank auf die Mailrunde an die Deutsche Bank Gruppe. Verweist inhaltlich an service@norisbank.de und bittet, von Rückfragen abzusehen. Beleg: ~/rebrand/data/vergleiche/belege/deutsche-bank-gruppe/2026-11-25-5e32807b.txt", automatisch: true },
    { datum: "25.11.2026", richtung: "rein", kanal: "Mail", adresse: "db.no-reply@db.com", kern: "Automatische Antwort der Deutschen Bank: Anliegen wurde an eine allgemeine Adresse geschickt, Auskunft nur nach Legitimation per Telefon oder Brief. Keine inhaltliche Antwort auf die zwei Fragen zu Verzinsung der Geschäftskonten und Sofort-Dispo bei norisbank. Beleg: ~/rebrand/data/vergleiche/belege/deutsche-bank-gruppe/2026-11-25-748ada2e.txt", automatisch: true },
    { datum: "26.11.2026", richtung: "rein", kanal: "Mail", adresse: "business@postbank.de", kern: "Postbank antwortet nur zu Postbankprodukten und teilt mit, dass Guthaben auf Geschäftskonten nicht verzinst wird. Beleg: ~/rebrand/data/vergleiche/belege/deutsche-bank-gruppe/2026-11-26-78a21e4a.txt" },
  ], naechsterSchritt: "Antwort als Beleg ablegen und Postbank mit Belegart 'schriftlich' eintragen; für die offenen Punkte (kaufbare Papiere, Privatkonto-Verzinsung, Sparplan) bei der Deutschen Bank Gruppe nachhaken." },
  "migros-bank": { anbieter: "Migros Bank", vorgaenge: [
    { datum: "26.11.2026", richtung: "raus", kanal: "Mail", adresse: "kundencenter@migrosbank.ch", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein); Kaufbarkeit je ISIN (IE000929U2U9, IE00B27YCN58, IE00BMYMHS24, XS2115336336) mit Sparplan; Partnerprogramm. Betreff: finanzmuslim.com: kurze Fragen an Migros Bank", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort abwarten; ohne Antwort am 02.12. (Erstmail 25.11.) oder 03.12. (26.11.) der andere Weg (MAILREGELN Abschnitt 5)." },
  "neon": { anbieter: "neon", vorgaenge: [
    { datum: "26.11.2026", richtung: "raus", kanal: "Mail", adresse: "service@neon-free.ch", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein); Kaufbarkeit je ISIN (IE00B27YCN58, IE00B579F325, XS2115336336); Partnerprogramm. Betreff: finanzmuslim.com: kurze Fragen an neon", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort abwarten; ohne Antwort am 02.12. (Erstmail 25.11.) oder 03.12. (26.11.) der andere Weg (MAILREGELN Abschnitt 5)." },
  "norisbank": { anbieter: "Deutsche Bank Gruppe", vorgaenge: [
    { datum: "25.11.2026", richtung: "raus", kanal: "Mail", adresse: "deutsche.bank@db.com", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein). Betreff: finanzmuslim.com: kurze Fragen an die Deutsche Bank Gruppe", von: "elias@finanzmuslim.com" },
    { datum: "25.11.2026", richtung: "rein", kanal: "Mail", adresse: "db.no-reply@db.com", kern: "Automatische Antwort der norisbank auf die Mailrunde an die Deutsche Bank Gruppe. Verweist inhaltlich an service@norisbank.de und bittet, von Rückfragen abzusehen. Beleg: ~/rebrand/data/vergleiche/belege/deutsche-bank-gruppe/2026-11-25-5e32807b.txt", automatisch: true },
    { datum: "25.11.2026", richtung: "rein", kanal: "Mail", adresse: "db.no-reply@db.com", kern: "Automatische Antwort der Deutschen Bank: Anliegen wurde an eine allgemeine Adresse geschickt, Auskunft nur nach Legitimation per Telefon oder Brief. Keine inhaltliche Antwort auf die zwei Fragen zu Verzinsung der Geschäftskonten und Sofort-Dispo bei norisbank. Beleg: ~/rebrand/data/vergleiche/belege/deutsche-bank-gruppe/2026-11-25-748ada2e.txt", automatisch: true },
    { datum: "26.11.2026", richtung: "rein", kanal: "Mail", adresse: "business@postbank.de", kern: "Postbank antwortet nur zu Postbankprodukten und teilt mit, dass Guthaben auf Geschäftskonten nicht verzinst wird. Beleg: ~/rebrand/data/vergleiche/belege/deutsche-bank-gruppe/2026-11-26-78a21e4a.txt" },
  ], naechsterSchritt: "Antwort als Beleg ablegen und Postbank mit Belegart 'schriftlich' eintragen; für die offenen Punkte (kaufbare Papiere, Privatkonto-Verzinsung, Sparplan) bei der Deutschen Bank Gruppe nachhaken." },
  "oberbank": { anbieter: "Oberbank", vorgaenge: [
    { datum: "26.11.2026", richtung: "raus", kanal: "Mail", adresse: "office@oberbank.at", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein); Kaufbarkeit je ISIN (IE00B27YCN58, XS2115336336) mit Sparplan; Partnerprogramm. Betreff: finanzmuslim.com: kurze Fragen an die Oberbank", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort abwarten; ohne Antwort am 02.12. (Erstmail 25.11.) oder 03.12. (26.11.) der andere Weg (MAILREGELN Abschnitt 5)." },
  "obwaldner-kantonalbank": { anbieter: "Obwaldner Kantonalbank", vorgaenge: [
    { datum: "26.11.2026", richtung: "raus", kanal: "Mail", adresse: "info@okb.ch", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein); Kaufbarkeit je ISIN (IE000929U2U9, IE00B27YCN58, IE00BMYMHS24, XS2115336336) mit Sparplan; Partnerprogramm. Betreff: finanzmuslim.com: kurze Fragen an Obwaldner Kantonalbank", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort abwarten; ohne Antwort am 02.12. (Erstmail 25.11.) oder 03.12. (26.11.) der andere Weg (MAILREGELN Abschnitt 5)." },
  "postbank": { anbieter: "Deutsche Bank Gruppe", vorgaenge: [
    { datum: "25.11.2026", richtung: "raus", kanal: "Mail", adresse: "deutsche.bank@db.com", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein). Betreff: finanzmuslim.com: kurze Fragen an die Deutsche Bank Gruppe", von: "elias@finanzmuslim.com" },
    { datum: "25.11.2026", richtung: "rein", kanal: "Mail", adresse: "db.no-reply@db.com", kern: "Automatische Antwort der norisbank auf die Mailrunde an die Deutsche Bank Gruppe. Verweist inhaltlich an service@norisbank.de und bittet, von Rückfragen abzusehen. Beleg: ~/rebrand/data/vergleiche/belege/deutsche-bank-gruppe/2026-11-25-5e32807b.txt", automatisch: true },
    { datum: "25.11.2026", richtung: "rein", kanal: "Mail", adresse: "db.no-reply@db.com", kern: "Automatische Antwort der Deutschen Bank: Anliegen wurde an eine allgemeine Adresse geschickt, Auskunft nur nach Legitimation per Telefon oder Brief. Keine inhaltliche Antwort auf die zwei Fragen zu Verzinsung der Geschäftskonten und Sofort-Dispo bei norisbank. Beleg: ~/rebrand/data/vergleiche/belege/deutsche-bank-gruppe/2026-11-25-748ada2e.txt", automatisch: true },
    { datum: "26.11.2026", richtung: "rein", kanal: "Mail", adresse: "business@postbank.de", kern: "Postbank antwortet nur zu Postbankprodukten und teilt mit, dass Guthaben auf Geschäftskonten nicht verzinst wird. Beleg: ~/rebrand/data/vergleiche/belege/deutsche-bank-gruppe/2026-11-26-78a21e4a.txt" },
  ], naechsterSchritt: "Antwort als Beleg ablegen und Postbank mit Belegart 'schriftlich' eintragen; für die offenen Punkte (kaufbare Papiere, Privatkonto-Verzinsung, Sparplan) bei der Deutschen Bank Gruppe nachhaken." },
  "postfinance": { anbieter: "PostFinance", vorgaenge: [
    { datum: "26.11.2026", richtung: "raus", kanal: "Mail", adresse: "medien@postfinance.ch", kern: "Mailrunde VG10: Kaufbarkeit je ISIN (IE000929U2U9, IE00B27YCN58, IE00BMYMHS24, XS2115336336); Partnerprogramm. Betreff: finanzmuslim.com: kurze Fragen an PostFinance", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort abwarten; ohne Antwort am 02.12. (Erstmail 25.11.) oder 03.12. (26.11.) der andere Weg (MAILREGELN Abschnitt 5)." },
  "qonto": { anbieter: "Qonto", vorgaenge: [
    { datum: "26.11.2026", richtung: "raus", kanal: "Mail", adresse: "hallo@qonto.eu", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein). Betreff: finanzmuslim.com: eine kurze Frage an Qonto", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort abwarten; ohne Antwort am 02.12. (Erstmail 25.11.) oder 03.12. (26.11.) der andere Weg (MAILREGELN Abschnitt 5)." },
  "raiffeisen-oberosterreich-und-niederoste": { anbieter: "Raiffeisen OÖ (Börse Live, Bank Direkt)", vorgaenge: [
    { datum: "26.11.2026", richtung: "raus", kanal: "Mail", adresse: "service@bankdirekt.at", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein); Kaufbarkeit je ISIN (IE000929U2U9, IE000LFC57H7, IE000UOXRAM8, IE00B27YCN58, IE00BMYMHS24, XS2115336336) mit Sparplan; Partnerprogramm. Betreff: finanzmuslim.com: kurze Fragen zu Börse Live und Bank Direkt", von: "elias@finanzmuslim.com" },
    { datum: "26.11.2026", richtung: "rein", kanal: "Mail", adresse: "kundenservice@raiffeisenbank.at", kern: "Automatische Eingangsbestätigung der Raiffeisenlandesbank NÖ-Wien. Es wird auf hohes Anfragevolumen und mögliche Verzögerung hingewiesen, inhaltlich wird nichts beantwortet. Beleg: ~/rebrand/data/vergleiche/belege/raiffeisen-oberosterreich-und-niederoste/2026-11-26-22884442.txt", automatisch: true },
  ], naechsterSchritt: "Antwort abwarten; ohne Antwort am 02.12. (Erstmail 25.11.) oder 03.12. (26.11.) der andere Weg (MAILREGELN Abschnitt 5)." },
  "raiffeisen-schweiz": { anbieter: "Raiffeisen Schweiz", vorgaenge: [
    { datum: "26.11.2026", richtung: "raus", kanal: "Mail", adresse: "direct@raiffeisen.ch", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein); Kaufbarkeit je ISIN (IE000929U2U9, IE00B27YCN58, IE00BMYMHS24, XS2115336336) mit Sparplan; Partnerprogramm. Betreff: finanzmuslim.com: kurze Fragen an Raiffeisen Schweiz", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort abwarten; ohne Antwort am 02.12. (Erstmail 25.11.) oder 03.12. (26.11.) der andere Weg (MAILREGELN Abschnitt 5)." },
  "regiobank-solothurn": { anbieter: "Regiobank Solothurn", vorgaenge: [
    { datum: "26.11.2026", richtung: "raus", kanal: "Mail", adresse: "regioservice@regiobank.ch", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein); Kaufbarkeit je ISIN (IE000929U2U9, IE00B27YCN58, IE00BMYMHS24, XS2115336336) mit Sparplan; Partnerprogramm. Betreff: finanzmuslim.com: kurze Fragen an Regiobank Solothurn", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort abwarten; ohne Antwort am 02.12. (Erstmail 25.11.) oder 03.12. (26.11.) der andere Weg (MAILREGELN Abschnitt 5)." },
  "santander": { anbieter: "Openbank", vorgaenge: [
    { datum: "26.11.2026", richtung: "raus", kanal: "Mail", adresse: "email-service@santander.de", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein); Kaufbarkeit je ISIN (IE000929U2U9, IE000LFC57H7, IE000UOXRAM8, IE00B27YCP72, IE00B296QM64, LU3123443510, XS2115336336) mit Sparplan. Betreff: finanzmuslim.com: kurze Fragen an Openbank", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort abwarten; ohne Antwort am 02.12. (Erstmail 25.11.) oder 03.12. (26.11.) der andere Weg (MAILREGELN Abschnitt 5)." },
  "saxo-bank": { anbieter: "Saxo Bank", vorgaenge: [
    { datum: "26.11.2026", richtung: "raus", kanal: "Mail", adresse: "sales.ch@saxobank.com", kern: "Mailrunde VG10: Kaufbarkeit je ISIN (IE00B27YCN58, IE00B296QM64, IE00BMYMHS24, XS2115336336). Betreff: finanzmuslim.com: a few short questions for Saxo Bank", von: "elias@finanzmuslim.com" },
    { datum: "26.11.2026", richtung: "rein", kanal: "Mail", adresse: "noreply@saxobank.com", kern: "Saxo Bank bestätigt den Eingang der Anfrage vom 26.11.2026 mit einer Vorgangsnummer und verweist auf das Support Center. Keine inhaltliche Antwort auf die gestellten Fragen. Beleg: ~/rebrand/data/vergleiche/belege/saxo-bank/2026-11-26-a837167b.txt", automatisch: true },
  ], naechsterSchritt: "Antwort auf die Mailrunde abwarten." },
  "sbroker": { anbieter: "S Broker", vorgaenge: [
    { datum: "25.11.2026", richtung: "raus", kanal: "Mail", adresse: "service@sbroker.de", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein). Betreff: Re: finanzmuslim.com: Wertpapiere im S Broker Direkt-Depot", von: "elias@finanzmuslim.com" },
    { datum: "25.11.2026", richtung: "rein", kanal: "Mail", adresse: "service@sbroker.de", kern: "Automatische Eingangsbestätigung auf die Mailrunde vom 25.11.2026. Keine inhaltliche Antwort, nur Hinweis auf Telefonzeiten und Sicherheitshinweis. Beleg: ~/rebrand/data/vergleiche/belege/s-broker/2026-11-25-320db2bb.txt", automatisch: true },
  ], naechsterSchritt: "Antwort abwarten; ohne Antwort am 02.12. (Erstmail 25.11.) oder 03.12. (26.11.) der andere Weg (MAILREGELN Abschnitt 5)." },
  "scalable": { anbieter: "Scalable Capital", vorgaenge: [
    { datum: "26.11.2026", richtung: "raus", kanal: "Mail", adresse: "affiliates@scalable.capital", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein). Betreff: Kunden in Österreich: Verrechnungskonto (PartnerID 1017)", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort abwarten; ohne Antwort am 02.12. (Erstmail 25.11.) oder 03.12. (26.11.) der andere Weg (MAILREGELN Abschnitt 5)." },
  "scalable-prime": { anbieter: "Scalable Capital", vorgaenge: [
    { datum: "26.11.2026", richtung: "raus", kanal: "Mail", adresse: "affiliates@scalable.capital", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein). Betreff: Kunden in Österreich: Verrechnungskonto (PartnerID 1017)", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort abwarten; ohne Antwort am 02.12. (Erstmail 25.11.) oder 03.12. (26.11.) der andere Weg (MAILREGELN Abschnitt 5)." },
  "schaffhauser-kantonalbank": { anbieter: "Schaffhauser Kantonalbank", vorgaenge: [
    { datum: "26.11.2026", richtung: "raus", kanal: "Mail", adresse: "info@shkb.ch", kern: "Mailrunde VG10: Kaufbarkeit je ISIN (IE000929U2U9, IE00B27YCN58, IE00BMYMHS24, XS2115336336) mit Sparplan; Partnerprogramm. Betreff: finanzmuslim.com: kurze Fragen an Schaffhauser Kantonalbank", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort abwarten; ohne Antwort am 02.12. (Erstmail 25.11.) oder 03.12. (26.11.) der andere Weg (MAILREGELN Abschnitt 5)." },
  "schwyzer-kantonalbank": { anbieter: "Schwyzer Kantonalbank", vorgaenge: [
    { datum: "26.11.2026", richtung: "raus", kanal: "Mail", adresse: "kundencenter@szkb.ch", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein); Kaufbarkeit je ISIN (IE000929U2U9, IE00B27YCN58, IE00BMYMHS24, XS2115336336) mit Sparplan; Partnerprogramm. Betreff: finanzmuslim.com: kurze Fragen an Schwyzer Kantonalbank", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort abwarten; ohne Antwort am 02.12. (Erstmail 25.11.) oder 03.12. (26.11.) der andere Weg (MAILREGELN Abschnitt 5)." },
  "smartbroker": { anbieter: "Smartbroker+", vorgaenge: [
    { datum: "25.11.2026", richtung: "raus", kanal: "Mail", adresse: "kundenservice@smartbrokerplus.de", kern: "Mailrunde VG10: . Betreff: finanzmuslim.com: eine kurze Frage zu Kunden in Österreich", von: "elias@finanzmuslim.com" },
    { datum: "25.11.2026", richtung: "rein", kanal: "Mail", adresse: "kundenservice@smartbrokerplus.de", kern: "Smartbroker antwortet auf die Österreich-Frage: Ein Wertpapierkredit wird nicht automatisch eingerichtet, sondern muss bei Bedarf eigenständig beantragt werden. Beleg: ~/rebrand/data/vergleiche/belege/smartbroker/2026-11-25-4d6a1352.txt" },
  ], naechsterSchritt: "Antwort als Beleg ablegen und beim Smartbroker-Eintrag die Information zum Wertpapierkredit (kein automatischer Kredit) mit Belegart schriftlich eintragen." },
  "sparkasse-schwyz": { anbieter: "Sparkasse Schwyz", vorgaenge: [
    { datum: "26.11.2026", richtung: "raus", kanal: "Mail", adresse: "servicecenter@sparkasse.ch", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein); Kaufbarkeit je ISIN (IE000929U2U9, IE00B27YCN58, IE00BMYMHS24, XS2115336336) mit Sparplan; Partnerprogramm. Betreff: finanzmuslim.com: kurze Fragen an Sparkasse Schwyz", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort abwarten; ohne Antwort am 02.12. (Erstmail 25.11.) oder 03.12. (26.11.) der andere Weg (MAILREGELN Abschnitt 5)." },
  "st-galler-kantonalbank": { anbieter: "St. Galler Kantonalbank", vorgaenge: [
    { datum: "26.11.2026", richtung: "raus", kanal: "Mail", adresse: "info@sgkb.ch", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein); Kaufbarkeit je ISIN (IE000929U2U9, IE00B27YCN58, IE00BMYMHS24, XS2115336336) mit Sparplan; Partnerprogramm. Betreff: finanzmuslim.com: kurze Fragen an St. Galler Kantonalbank", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort abwarten; ohne Antwort am 02.12. (Erstmail 25.11.) oder 03.12. (26.11.) der andere Weg (MAILREGELN Abschnitt 5)." },
  "swissquote-und-yuh": { anbieter: "Swissquote und Yuh", vorgaenge: [
    { datum: "26.11.2026", richtung: "raus", kanal: "Mail", adresse: "partnerships.yuh@yuh.com", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein); Kaufbarkeit je ISIN (IE000929U2U9, IE00B27YCN58, IE00BMYMHS24, XS2115336336). Betreff: finanzmuslim.com: kurze Fragen an Swissquote und Yuh", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort abwarten; ohne Antwort am 02.12. (Erstmail 25.11.) oder 03.12. (26.11.) der andere Weg (MAILREGELN Abschnitt 5)." },
  "targobank": { anbieter: "Targobank", vorgaenge: [
    { datum: "25.11.2026", richtung: "raus", kanal: "Mail", adresse: "kontakt@targobank.de", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein); Kaufbarkeit je ISIN (IE000929U2U9, IE000LFC57H7, IE000UOXRAM8, IE00B27YCP72, IE00B296QM64, LU1150255971, XS2115336336) mit Sparplan. Betreff: finanzmuslim.com: kurze Fragen (Bezug #REF0003774306)", von: "elias@finanzmuslim.com" },
    { datum: "25.11.2026", richtung: "rein", kanal: "Mail", adresse: "NoReply@targobank.de", kern: "Automatische Antwort der Targobank: persönliche Antwort wird erarbeitet, längere Bearbeitungszeit möglich. Keine inhaltliche Antwort auf die Fragen. Beleg: ~/rebrand/data/vergleiche/belege/targobank/2026-11-25-a5b73520.txt", automatisch: true },
  ], naechsterSchritt: "Antwort auf die Mail vom 07.10.2026 weiter abwarten." },
  "thurgauer-kantonalbank": { anbieter: "Thurgauer Kantonalbank", vorgaenge: [
    { datum: "26.11.2026", richtung: "raus", kanal: "Mail", adresse: "medien@tkb.ch", kern: "Mailrunde VG10: Kaufbarkeit je ISIN (IE000929U2U9, IE00B27YCN58, IE00BMYMHS24, XS2115336336) mit Sparplan; Partnerprogramm. Betreff: finanzmuslim.com: kurze Fragen an Thurgauer Kantonalbank", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort abwarten; ohne Antwort am 02.12. (Erstmail 25.11.) oder 03.12. (26.11.) der andere Weg (MAILREGELN Abschnitt 5)." },
  "tide": { anbieter: "Tide", vorgaenge: [
    { datum: "25.11.2026", richtung: "raus", kanal: "Mail", adresse: "support.de@tide.co", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein). Betreff: finanzmuslim.com: eine kurze Frage an Tide", von: "elias@finanzmuslim.com" },
    { datum: "25.11.2026", richtung: "rein", kanal: "Mail", adresse: "support.de@tide.co", kern: "Tide Support (Teddy) antwortet: Bei Eröffnung eines Hauptkontos wird automatisch ein Tagesgeldkonto eröffnet. Zinsen werden einmal im Monat automatisch ausgezahlt, sobald Guthaben auf das Tagesgeldkonto überwiesen wird. Beleg: ~/rebrand/data/vergleiche/belege/tide/2026-11-25-544c69a2.txt" },
  ], naechsterSchritt: "Antwort als Beleg ablegen und Tide mit Belegart schriftlich eintragen; Zinssatz weiterhin offen." },
  "trading212": { anbieter: "Trading 212", vorgaenge: [
    { datum: "26.11.2026", richtung: "raus", kanal: "Mail", adresse: "partnerships@trading212.com", kern: "Mailrunde VG10: Kaufbarkeit je ISIN (IE000929U2U9, IE000LFC57H7, IE000UOXRAM8, IE00BMYMHS24); Partnerprogramm. Betreff: Re: Partnership enquiry from a German finance publisher", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort abwarten; ohne Antwort am 02.12. (Erstmail 25.11.) oder 03.12. (26.11.) der andere Weg (MAILREGELN Abschnitt 5)." },
  "urner-kantonalbank": { anbieter: "Urner Kantonalbank", vorgaenge: [
    { datum: "26.11.2026", richtung: "raus", kanal: "Mail", adresse: "info@ukb.ch", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein); Partnerprogramm. Betreff: finanzmuslim.com: kurze Fragen an Urner Kantonalbank", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort abwarten; ohne Antwort am 02.12. (Erstmail 25.11.) oder 03.12. (26.11.) der andere Weg (MAILREGELN Abschnitt 5)." },
  "valiant": { anbieter: "Valiant", vorgaenge: [
    { datum: "26.11.2026", richtung: "raus", kanal: "Mail", adresse: "info@valiant.ch", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein); Kaufbarkeit je ISIN (IE000929U2U9, IE00B27YCN58, IE00BMYMHS24, XS2115336336) mit Sparplan; Partnerprogramm. Betreff: finanzmuslim.com: kurze Fragen an Valiant", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort abwarten; ohne Antwort am 02.12. (Erstmail 25.11.) oder 03.12. (26.11.) der andere Weg (MAILREGELN Abschnitt 5)." },
  "volksbank-wien": { anbieter: "Volksbank Wien", vorgaenge: [
    { datum: "26.11.2026", richtung: "raus", kanal: "Mail", adresse: "kundenservice@volksbankwien.at", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein); Kaufbarkeit je ISIN (IE00B27YCN58, XS2115336336); Partnerprogramm. Betreff: finanzmuslim.com: kurze Fragen an die Volksbank Wien", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort abwarten; ohne Antwort am 02.12. (Erstmail 25.11.) oder 03.12. (26.11.) der andere Weg (MAILREGELN Abschnitt 5)." },
  "vz-depotbank": { anbieter: "VZ Depotbank", vorgaenge: [
    { datum: "26.11.2026", richtung: "raus", kanal: "Mail", adresse: "contact@vzdepotbank.ch", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein); Kaufbarkeit je ISIN (IE000929U2U9, IE00B27YCN58, IE00BMYMHS24, XS2115336336) mit Sparplan; Partnerprogramm. Betreff: finanzmuslim.com: kurze Fragen an VZ Depotbank", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort abwarten; ohne Antwort am 02.12. (Erstmail 25.11.) oder 03.12. (26.11.) der andere Weg (MAILREGELN Abschnitt 5)." },
  "wise": { anbieter: "Wise", vorgaenge: [
    { datum: "26.11.2026", richtung: "raus", kanal: "Mail", adresse: "partnerwise@wise.com", kern: "Mailrunde VG10: . Betreff: finanzmuslim.com: one short question as a Wise affiliate", von: "elias@finanzmuslim.com" },
    { datum: "26.11.2026", richtung: "rein", kanal: "Mail", adresse: "partnerwise@wise.com", kern: "Wise bestätigt den Eingang der Affiliate-Anfrage und verweist auf drei separate Anmeldewege (Influencer, Referral, SEO-Affiliate) sowie die Affiliate-Programm-Übersicht. Eine inhaltliche Antwort auf die ursprüngliche Frage fehlt. Beleg: ~/rebrand/data/vergleiche/belege/wise/2026-11-26-dbee3ffd.txt", automatisch: true },
  ], naechsterSchritt: "Abwarten, bis Wise inhaltlich antwortet; die drei Anmeldewege vorerst nicht ausfüllen, da das Protokoll nur Help Center vorsieht." },
  "wustenrot": { anbieter: "Wüstenrot", vorgaenge: [
    { datum: "26.11.2026", richtung: "raus", kanal: "Mail", adresse: "office@wuestenrot.at", kern: "Mailrunde VG10: Partnerprogramm. Betreff: finanzmuslim.com: kurze Fragen an Wüstenrot", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort abwarten; ohne Antwort am 02.12. (Erstmail 25.11.) oder 03.12. (26.11.) der andere Weg (MAILREGELN Abschnitt 5)." },
  "zuger-kantonalbank": { anbieter: "Zuger Kantonalbank", vorgaenge: [
    { datum: "26.11.2026", richtung: "raus", kanal: "Mail", adresse: "service@zugerkb.ch", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein); Kaufbarkeit je ISIN (IE000929U2U9, IE00B27YCN58, IE00BMYMHS24, XS2115336336) mit Sparplan; Partnerprogramm. Betreff: finanzmuslim.com: kurze Fragen an Zuger Kantonalbank", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort abwarten; ohne Antwort am 02.12. (Erstmail 25.11.) oder 03.12. (26.11.) der andere Weg (MAILREGELN Abschnitt 5)." },
  "zurcher-kantonalbank": { anbieter: "Zürcher Kantonalbank", vorgaenge: [
    { datum: "26.11.2026", richtung: "raus", kanal: "Mail", adresse: "medien@zkb.ch", kern: "Mailrunde VG10: Zins und Dispo oder Kredit ab Eröffnung (Ja oder Nein); Kaufbarkeit je ISIN (IE000929U2U9, IE00B27YCN58, IE00BMYMHS24, XS2115336336) mit Sparplan; Partnerprogramm. Betreff: finanzmuslim.com: kurze Fragen an Zürcher Kantonalbank", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort abwarten; ohne Antwort am 02.12. (Erstmail 25.11.) oder 03.12. (26.11.) der andere Weg (MAILREGELN Abschnitt 5)." },
};

for (const [haus, a] of Object.entries(RUNDE_VG10)) {
  const alt = ANFRAGEN[haus];
  ANFRAGEN[haus] = alt ? { ...alt, vorgaenge: [...alt.vorgaenge, ...a.vorgaenge], naechsterSchritt: a.naechsterSchritt ?? alt.naechsterSchritt } : a;
}

export const anfrageFuer = (haus?: string): Anfrage | undefined => (haus ? ANFRAGEN[haus] : undefined);
