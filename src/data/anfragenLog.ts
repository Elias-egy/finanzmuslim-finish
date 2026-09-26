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
  kanal: "Mail" | "Ticket" | "Formular" | "App";
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
    { datum: "28.09.2026", richtung: "raus", kanal: "Mail", adresse: "smartbanking@unicredit.de", kern: "In Zoho am 26.09. eingeplant für 28.09., 10 Uhr. Gebündelte Anfrage als finanzmuslim.com: HVB Depot oder SmartDepot mit AktivKonto statt Investmentkonto? Sonderzins automatisch? Girokonten je Stufe, Kaufbarkeit aller 22 ISINs.", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Versand in Zoho prüfen (Ordner Gesendet), dann Antwort abwarten." },
  "trade-republic": { anbieter: "Trade Republic", vorgaenge: [
    { datum: "16.09.2026", richtung: "raus", kanal: "Mail", adresse: "service@traderepublic.com", kern: frage1 },
    { datum: "16.09.2026", richtung: "rein", kanal: "Mail", automatisch: true, kern: "Automatische Antwort, will die Anfrage aus der App." },
  ], keinMailWeg: true, naechsterSchritt: "Nur In-App-Chat. Im Impressum steht allein eine Beschwerde-Adresse. Elias muss in der App fragen, ob Zinsen beim Neukonto sofort laufen." },
  santander: { anbieter: "Santander", vorgaenge: [
    { datum: "16.09.2026", richtung: "raus", kanal: "Mail", adresse: "impressum@santander.de", zeichen: "SCM5145440", kern: frage1 },
    { datum: "21.09.2026", richtung: "raus", kanal: "Mail", adresse: "impressum@santander.de", zeichen: "SCM5156656", kern: frage2 },
    { datum: "21.09.2026", richtung: "rein", kanal: "Mail", kern: "„Für Depots sind nur Filialen zuständig“. Keine inhaltliche Antwort." },
  ], naechsterSchritt: "Per Mail kommt nichts mehr. Bleibt offen oder Filiale." },
  commerzbank: { anbieter: "Commerzbank", vorgaenge: [
    { datum: "21.09.2026", richtung: "raus", kanal: "Mail", adresse: "info@commerzbank.com", kern: frage2 },
    { datum: "22.09.2026", richtung: "rein", kanal: "Mail", kern: "„Aktuell wird Guthaben, dass Sie auf einem Girokonto oder Verrechnungskonto Plus anlegen nicht verzinst.“ Depots und Konten grün. Zum Dispo nur der allgemeine Hinweis auf die geduldete Überziehung." },
    { datum: "27.09.2026", richtung: "raus", kanal: "Mail", adresse: "info@commerzbank.com", kern: "In Zoho am 26.09. eingeplant für 27.09., 10 Uhr. Gebündelte Anfrage als finanzmuslim.com: Gilt „nicht verzinst“ für DirektDepot, KlassikDepot und PremiumDepot? Kaufbarkeit aller 22 Halal-ISINs je Depotmodell.", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Versand in Zoho prüfen (Ordner Gesendet), dann Antwort abwarten." },
  finvesto: { anbieter: "finvesto / FNZ", vorgaenge: [
    { datum: "21.09.2026", richtung: "raus", kanal: "Mail", adresse: "service@fnz.de", kern: frage2 },
    { datum: "22.09.2026", richtung: "rein", kanal: "Mail", zeichen: "WF_46229739", kern: "„Das Guthaben auf dem Verrechnungskonto wird nicht verzinst.“ Grün." },
    { datum: "26.09.2026", richtung: "raus", kanal: "Mail", adresse: "service@fnz.de", zeichen: "WF_46229739", kern: "Gebündelte Anfrage als finanzmuslim.com: Gilt „nicht verzinst“ für Depot, Depot Basis und Wertpapierdepot? Kaufbarkeit von acht ISINs (ETCs, Franklin), beim Wertpapierdepot aller 22.", von: "elias@finanzmuslim.com" },
    { datum: "26.09.2026", richtung: "rein", kanal: "Mail", adresse: "noreply-service@fnz.de", zeichen: "813330104", automatisch: true, kern: "Automatische Eingangsbestätigung der gebündelten Anfrage." },
  ], naechsterSchritt: "Antwort auf die gebündelte Anfrage vom 26.09. abwarten." },
  "joe-broker": { anbieter: "JOE Broker", vorgaenge: [
    { datum: "21.09.2026", richtung: "raus", kanal: "Mail", adresse: "support@joebroker.de", kern: frage2 },
    { datum: "22.09.2026", richtung: "rein", kanal: "Ticket", zeichen: "JBSPROD-13897", kern: "Guthaben nicht verzinst. Eine geplante Verzinsung gilt nur für Konten, die nach deren Einführung eröffnet werden. Grün." },
    { datum: "26.09.2026", richtung: "raus", kanal: "Mail", adresse: "support@joebroker.de", zeichen: "JBSPROD-13897", kern: "Gebündelte Anfrage als finanzmuslim.com: Kaufbarkeit aller 22 Halal-ISINs samt Fondsaufschlag.", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort auf die gebündelte Anfrage vom 26.09. abwarten." },
  "berliner-volksbank": { anbieter: "Berliner Volksbank", vorgaenge: [
    { datum: "21.09.2026", richtung: "raus", kanal: "Mail", adresse: "service@berliner-volksbank.de", kern: frage2 },
    { datum: "22.09.2026", richtung: "rein", kanal: "Mail", kern: "Über 30 keine Guthabenverzinsung, blauorange nur mit Mitgliedschaft. Grün." },
  ] },
  "finanzen-net-zero": { anbieter: "finanzen.net zero", vorgaenge: [
    { datum: "21.09.2026", richtung: "raus", kanal: "Mail", adresse: "service@finanzen-zero.net", kern: frage2 },
    { datum: "22.09.2026", richtung: "rein", kanal: "Ticket", zeichen: "3706816", kern: "Weder Zinsmodell noch Abo. Krypto grün." },
    { datum: "27.09.2026", richtung: "raus", kanal: "Mail", adresse: "service@finanzen-zero.net", zeichen: "3706816", kern: "In Zoho am 26.09. eingeplant für 27.09., 10 Uhr. Gebündelte Anfrage als finanzmuslim.com: Ausgabeaufschlag und Mindestanlage für Comgest Growth Europe (IE00B4ZJ4634).", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Versand in Zoho prüfen (Ordner Gesendet), dann Antwort abwarten." },
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
  ], naechsterSchritt: "Versand in Zoho prüfen (Ordner Gesendet), dann Antwort abwarten." },
  "tradegate-direct": { anbieter: "tradegate.direct", vorgaenge: [
    { datum: "21.09.2026", richtung: "raus", kanal: "Mail", adresse: "support@tradegate.direct", kern: frage2 },
    { datum: "21.09.2026", richtung: "rein", kanal: "Ticket", zeichen: "SUP-5390", kern: "Verrechnungskonto „derzeit nicht verzinst“. Grün." },
    { datum: "27.09.2026", richtung: "raus", kanal: "Mail", adresse: "support@tradegate.direct", zeichen: "SUP-5390", kern: "In Zoho am 26.09. eingeplant für 27.09., 10 Uhr. Gebündelte Anfrage als finanzmuslim.com: Kaufbarkeit aller 22 Halal-ISINs, die Instrumentensuche zeigt kein Kaufmerkmal.", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Versand in Zoho prüfen (Ordner Gesendet), dann Antwort abwarten." },
  justtrade: { anbieter: "justTRADE", vorgaenge: [
    { datum: "21.09.2026", richtung: "raus", kanal: "Mail", adresse: "service@justtrade.com", kern: frage2 },
    { datum: "21.09.2026", richtung: "rein", kanal: "Ticket", zeichen: "#128140", kern: "Keine automatischen Ausschüttungen als Zins oder Staking. Zinsfrei ab Start grün, Abo und Margin unbeantwortet." },
    { datum: "23.09.2026", richtung: "raus", kanal: "Mail", adresse: "service@justtrade.com", kern: "Rückfrage zu #128140: Gibt es ein kostenpflichtiges Modell mit Zinsbindung, und sind Margin, Hebel und Wertpapierleihe ab Start aus?" },
    { datum: "23.09.2026", richtung: "rein", kanal: "Ticket", zeichen: "#128292", kern: "„Die Depoteröffnung und Depotführung ist gleichermaßen kostenfrei für alle Kunden. Der Handel findet ausschließlich auf Guthabenbasis ab.“ Bezahlmodell damit geklärt." },
    { datum: "26.09.2026", richtung: "raus", kanal: "Mail", adresse: "service@justtrade.com", zeichen: "#128292", kern: "Gebündelte Anfrage als finanzmuslim.com: Kaufbarkeit von 13 ISINs, die in Partner-Listen und Sparplanliste fehlen.", von: "elias@finanzmuslim.com" },
    { datum: "26.09.2026", richtung: "rein", kanal: "Ticket", zeichen: "#128412", automatisch: true, kern: "Automatische Eingangsbestätigung der gebündelten Anfrage." },
  ], naechsterSchritt: "Antwort auf die gebündelte Anfrage vom 26.09. abwarten." },
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
  ], naechsterSchritt: "Versand in Zoho prüfen (Ordner Gesendet), dann Antwort abwarten." },
  "traders-place": { anbieter: "Traders Place", vorgaenge: [
    { datum: "21.09.2026", richtung: "raus", kanal: "Mail", adresse: "kundenservice@tradersplace.de", kern: frage2 },
    { datum: "22.09.2026", richtung: "rein", kanal: "Mail", kern: "„Die von Ihnen genannten Vorgaben … können wir bei der Bearbeitung Ihres Anliegens leider nicht separat berücksichtigen.“ Keine inhaltliche Antwort." },
    { datum: "23.09.2026", richtung: "raus", kanal: "Mail", adresse: "kundenservice@tradersplace.de", kern: "Zweite, präzisere Anfrage: Laufen Zinsen, Rewards oder Staking ohne eigenes Zutun, und ist das Zinskonto bei der Baader Bank bei einer normalen Depoteröffnung automatisch dabei?" },
    { datum: "26.09.2026", richtung: "raus", kanal: "Mail", adresse: "kundenservice@tradersplace.de", kern: "Gebündelte Anfrage als finanzmuslim.com: Laufen Zinsen, Rewards oder Staking ohne Zutun, ist das Baader-Zinskonto automatisch dabei? Dazu Kaufbarkeit aller 22 Halal-ISINs samt Fondsaufschlag.", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort auf die gebündelte Anfrage vom 26.09. abwarten." },
  targobank: { anbieter: "Targobank", vorgaenge: [
    { datum: "21.09.2026", richtung: "raus", kanal: "Mail", adresse: "kontakt@targobank.de", kern: frage2 },
    { datum: "23.09.2026", richtung: "rein", kanal: "Mail", zeichen: "#REF0003695700", kern: "Bittet um einen Beratungstermin in der Filiale. Keine inhaltliche Antwort." },
  ], naechsterSchritt: "Per Mail kommt nichts mehr." },
  bbbank: { anbieter: "BBBank", vorgaenge: [
    { datum: "21.09.2026", richtung: "raus", kanal: "Mail", adresse: "info@bbbank.de", kern: frage2 },
    { datum: "21.09.2026", richtung: "rein", kanal: "Mail", kern: "Leitet die Anfrage an eine Filiale weiter, will die Postleitzahl." },
  ], naechsterSchritt: "Per Mail kommt nichts mehr." },
  maxblue: { anbieter: "maxblue", vorgaenge: [
    { datum: "21.09.2026", richtung: "raus", kanal: "Mail", adresse: "info.maxblue@db.com", kern: frage2 },
    { datum: "21.09.2026", richtung: "rein", kanal: "Mail", kern: "Auskunft nur nach Legitimation." },
    { datum: "23.09.2026", richtung: "rein", kanal: "Mail", adresse: "online.service@db.com", kern: "„Das maxblue Depotkonto besitzt momentan keine Verzinsung.“ Beide maxblue-Produkte grün. Für eine dauerhafte Zusage verweist die Bank an eine Filiale." },
    { datum: "27.09.2026", richtung: "raus", kanal: "Mail", adresse: "online.service@db.com", kern: "In Zoho am 26.09. eingeplant für 27.09., 10 Uhr. Gebündelte Anfrage als finanzmuslim.com: Kaufbarkeit aller 22 Halal-ISINs im Depot und als maxblue Wertpapier-Sparplan.", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Versand in Zoho prüfen (Ordner Gesendet), dann Antwort abwarten." },
  libertex: { anbieter: "Libertex", vorgaenge: [
    { datum: "21.09.2026", richtung: "raus", kanal: "Mail", adresse: "support@help.libertex.com", kern: frage2 },
    { datum: "21.09.2026", richtung: "rein", kanal: "Mail", kern: "KI-Antwort, sagt nur „keine Hinweise“ auf eine Verzinsung. Zu unklar, zählt nicht als Beleg." },
    { datum: "28.09.2026", richtung: "raus", kanal: "Mail", adresse: "support@help.libertex.com", kern: "In Zoho am 26.09. eingeplant für 28.09., 10 Uhr. Gebündelte Anfrage als finanzmuslim.com: Echte Wertpapiere statt CFDs in Deutschland? Falls ja, Kaufbarkeit aller 22 ISINs.", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Versand in Zoho prüfen (Ordner Gesendet), dann Antwort abwarten." },
  "geno-broker": { anbieter: "GENO Broker", vorgaenge: [
    { datum: "21.09.2026", richtung: "raus", kanal: "Mail", adresse: "service@genobroker.de", kern: frage2, von: "eliaselgendy2006@gmail.com" },
    { datum: "25.09.2026", richtung: "raus", kanal: "Mail", adresse: "service@genobroker.de", kern: "Nachfrage im selben Verlauf: Verrechnungskonto zum GENObasis Depot automatisch verzinst, Verzicht ab Eröffnung möglich? Gilt dasselbe für GENOprofi?", von: "eliaselgendy2006@gmail.com" },
    { datum: "27.09.2026", richtung: "raus", kanal: "Mail", adresse: "service@genobroker.de", kern: "In Zoho am 26.09. eingeplant für 27.09., 10 Uhr. Gebündelte Anfrage als finanzmuslim.com: Verrechnungskonto GENObasis und GENOprofi automatisch verzinst, Verzicht ab Eröffnung? Kaufbarkeit aller 22 Halal-ISINs je Tarif.", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Versand in Zoho prüfen (Ordner Gesendet), dann Antwort abwarten." },
  dkb: { anbieter: "DKB", vorgaenge: [
    { datum: "21.09.2026", richtung: "raus", kanal: "Mail", adresse: "impressum@dkb.de", kern: frage2 },
    { datum: "21.09.2026", richtung: "rein", kanal: "Mail", automatisch: true, kern: "Nur Eingangsbestätigung." },
    { datum: "26.09.2026", richtung: "raus", kanal: "Mail", adresse: "impressum@dkb.de", kern: "Gebündelte Anfrage als finanzmuslim.com: Girokonto ab Eröffnung ohne Dispokredit möglich? Dazu Kaufbarkeit aller 22 Halal-ISINs im Depot.", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort auf die gebündelte Anfrage vom 26.09. abwarten." },
  scalable: { anbieter: "Scalable Capital", vorgaenge: [
    { datum: "21.09.2026", richtung: "raus", kanal: "Mail", adresse: "service@scalable.capital", kern: frage2, von: "eliaselgendy2006@gmail.com" },
    { datum: "21.09.2026", richtung: "rein", kanal: "Ticket", zeichen: "03153115", automatisch: true, kern: "Nur Eingangsbestätigung." },
    { datum: "24.09.2026", richtung: "raus", kanal: "Mail", adresse: "service@scalable.capital", zeichen: "03153115", kern: "Nachfrage im selben Verlauf: Kann ich den Prime+ Broker komplett ohne Zinsen auf Guthaben nutzen?", von: "eliaselgendy2006@gmail.com" },
    { datum: "26.09.2026", richtung: "raus", kanal: "Mail", adresse: "service@scalable.capital", zeichen: "03153115", kern: "Gebündelte Anfrage als finanzmuslim.com: Bleibt das Verrechnungskonto mit PRIME+ dauerhaft bei 0 %? Kaufbarkeit der vier HSBC-ETFs in FREE und PRIME+ (App gegen ETP-Verzeichnis).", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort auf die gebündelte Anfrage vom 26.09. abwarten, Ticket 03153115." },
  flatex: { anbieter: "flatex", vorgaenge: [
    { datum: "21.09.2026", richtung: "raus", kanal: "Mail", adresse: "info@flatex.de", kern: frage2 },
    { datum: "21.09.2026", richtung: "rein", kanal: "Mail", automatisch: true, kern: "Nur Eingangsbestätigung." },
    { datum: "26.09.2026", richtung: "raus", kanal: "Mail", adresse: "info@flatex.de", kern: "Gebündelte Anfrage als finanzmuslim.com: Kaufbarkeit von sieben ISINs (Invesco ACWI, vier HSBC, zwei Sukuk-ETFs). Die Krypto-Frage vom 21.09. ist über die Website erledigt.", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort auf die gebündelte Anfrage vom 26.09. abwarten." },
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
  ], naechsterSchritt: "Persönliche Antwort abwarten. Die Impressumsadresse nimmt Anfragen an." },
  "1822direkt": { anbieter: "1822direkt", vorgaenge: [
    { datum: "23.09.2026", richtung: "raus", kanal: "Mail", adresse: "info@1822direkt.de", kern: frage3 + " Frage galt dem Aktiv-Depot." },
    { datum: "27.09.2026", richtung: "raus", kanal: "Mail", adresse: "info@1822direkt.de", kern: "In Zoho am 26.09. eingeplant für 27.09., 10 Uhr. Gebündelte Anfrage als finanzmuslim.com: GiroDirekt statt verzinstem Tagesgeld als Verrechnungskonto möglich? Kaufbarkeit von 17 ISINs.", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Versand in Zoho prüfen (Ordner Gesendet), dann Antwort abwarten." },
  bux: { anbieter: "BUX", vorgaenge: [
    { datum: "23.09.2026", richtung: "raus", kanal: "Mail", adresse: "info@getbux.com", kern: frage3 + " Zusätzlich: Unterschied zwischen Basic, Plus und Prime, und ob Hebel und Wertpapierleihe ab Start aus sind." },
    { datum: "27.09.2026", richtung: "raus", kanal: "Mail", adresse: "info@getbux.com", kern: "In Zoho am 26.09. eingeplant für 27.09., 10 Uhr. Gebündelte Anfrage als finanzmuslim.com: Kaufbarkeit von elf ISINs (ETCs, Fonds, iShares World Islamic) für BUX Basic.", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Versand in Zoho prüfen (Ordner Gesendet), dann Antwort abwarten." },
  norisbank: { anbieter: "norisbank", vorgaenge: [
    { datum: "23.09.2026", richtung: "raus", kanal: "Mail", adresse: "service@norisbank.de", kern: frage3 + " Frage galt Top-Girokonto und Girokonto Plus.", von: "eliaselgendy2006@gmail.com" },
    { datum: "23.09.2026", richtung: "rein", kanal: "Mail", adresse: "db.no-reply@db.com", automatisch: true, kern: "Nur automatische Eingangsbestätigung." },
    { datum: "25.09.2026", richtung: "raus", kanal: "Mail", adresse: "service@norisbank.de", kern: "Nachfrage im selben Verlauf, nur Dispo Top-Girokonto: Werbeseite sagt Sofort-Dispo, Bedingungen sagen auf Antrag. Kommt der Dispo bei Eröffnung automatisch?", von: "eliaselgendy2006@gmail.com" },
  ], naechsterSchritt: "Antwort abwarten, und in der Nachfrage den Dispo-Widerspruch klären: Die Werbeseite sagt „erhalten Girokonto-Kunden einen Sofort-Dispo“, die Bedingungen zum Top-Girokonto sagen „Auf Antrag … Antragsannahme durch gesonderte Mitteilung“." },
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
  bforbank: { anbieter: "BforBank", vorgaenge: [], keinMailWeg: true, naechsterSchritt: "Noch nie gefragt. Im Preisverzeichnis fehlt ein Guthabenzins, Abwesenheit ist kein Beleg. Am 25.09.2026 geprüft (bforbank.com/de/kontakt): nur Telefon 0800/0721010 und App-Chat, schriftlich gibt es nur den Beschwerdeweg. Frage per Telefon oder Chat (Elias)." },
  kraken: { anbieter: "Kraken", vorgaenge: [], keinMailWeg: true, naechsterSchritt: "Am 25.09.2026 geprüft: Produktsupport nur im Chat oder eingeloggt, das öffentliche Formular (support.kraken.com/forms/648008) ist nur für Compliance und Recht. Beide Stufen stehen über Opt-in schon auf grün, eine Nachfrage ist nicht nötig." },
  consorsbank: { anbieter: "Consorsbank", vorgaenge: [
    { datum: "24.09.2026", richtung: "raus", kanal: "Mail", adresse: "kundenbetreuung@consorsbank.de", kern: "Wird das Verrechnungskonto zum Wertpapierdepot verzinst? Im Preisverzeichnis stehen dort nur Sollzinsen. Bleibt das beworbene Tagesgeldkonto ohne eigene Einzahlung leer?" },
    { datum: "24.09.2026", richtung: "rein", kanal: "Mail", zeichen: "Ticket 86382271-78901a6", kern: "Verrechnungskonto wird nicht verzinst. Das Tagesgeldkonto ist ein eigenes Konto und bleibt ohne Guthaben unverzinst. Depot grün, jetzt mit ausdrücklicher Zusage." },
  ], },
  comdirect: { anbieter: "comdirect", vorgaenge: [
    { datum: "24.09.2026", richtung: "raus", kanal: "Mail", adresse: "info@comdirect.de", kern: "Gilt „Das Guthaben auf dem Verrechnungskonto wird von der Bank variabel verzinst“ auch für das Pure Depot, wie hoch ist der Satz, und ist ein dauerhafter Verzicht möglich?" },
    { datum: "24.09.2026", richtung: "rein", kanal: "Mail", zeichen: "Vorgang 11756451", kern: "Guthaben auf dem Verrechnungskonto wird nicht verzinst, ausdrücklich für das Verrechnungskonto beim comdirect Depot und beim Pure Depot. Beide Depots grün." },
    { datum: "26.09.2026", richtung: "raus", kanal: "Mail", adresse: "info@comdirect.de", zeichen: "Vorgang 11756451", kern: "Antwort im Faden als finanzmuslim.com: Was heißt „Handelbar auf Anfrage“ bei den HSBC-ETFs? Kaufbarkeit von elf ISINs fürs comdirect Depot, aller 22 fürs Pure Depot.", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort auf die Kaufbarkeitsfragen vom 26.09. abwarten." },
  n26: { anbieter: "N26", vorgaenge: [
    { datum: "24.09.2026", richtung: "raus", kanal: "Mail", adresse: "support@n26.com", kern: "Wird das Guthaben auf einem N26 Flex Konto verzinst, oder nur auf einem separat eröffneten Tagesgeldkonto? Kommt beim Flex Konto ab Eröffnung ein Dispo dazu?" },
    { datum: "24.09.2026", richtung: "rein", kanal: "Mail", zeichen: "Confirmation 95124651", kern: "Keine inhaltliche Antwort. Verweis auf den Chat (support.n26.com/de-at/chat), Mail-Postfach ist nur automatisch." },
  ], keinMailWeg: true, naechsterSchritt: "Nur über den Besucher-Chat zu klären, das machen Elias' Klicks. Flex bleibt bei Zins und Dispo offen, die anderen vier Stufen sind belegt." },
  degiro: { anbieter: "DEGIRO", vorgaenge: [
    { datum: "26.09.2026", richtung: "raus", kanal: "Mail", adresse: "kundenservice@degiro.de", kern: "Gebündelte Anfrage als finanzmuslim.com: Kaufbarkeit von zwölf ISINs außerhalb der ETF-Kernauswahl.", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Antwort auf die gebündelte Anfrage vom 26.09. abwarten. Der Partnerfaden mit affiliates@flatexdegiro.com läuft getrennt." },
  fidelity: { anbieter: "Fidelity Fondsdepot", vorgaenge: [
    { datum: "27.09.2026", richtung: "raus", kanal: "Mail", adresse: "info@fidelity-direkt.de", kern: "In Zoho am 26.09. eingeplant für 27.09., 10 Uhr. Gebündelte Anfrage als finanzmuslim.com: Ausgabeaufschlag und Mindestanlage der drei Halal-Fonds, Kaufbarkeit von 14 ETFs und ETCs.", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Versand in Zoho prüfen (Ordner Gesendet), dann Antwort abwarten." },
  bison: { anbieter: "BISON", vorgaenge: [
    { datum: "27.09.2026", richtung: "raus", kanal: "Mail", adresse: "support@bisonapp.com", kern: "In Zoho am 26.09. eingeplant für 27.09., 10 Uhr. Gebündelte Anfrage als finanzmuslim.com: Kaufbarkeit aller 22 Halal-ISINs. Partnerfaden affiliate@bsdigital.com läuft getrennt.", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Versand in Zoho prüfen (Ordner Gesendet), dann Antwort abwarten." },
  freedom24: { anbieter: "Freedom24", vorgaenge: [
    { datum: "28.09.2026", richtung: "raus", kanal: "Mail", adresse: "support_germany@freedom24.com", kern: "In Zoho am 26.09. eingeplant für 28.09., 10 Uhr. Gebündelte Anfrage als finanzmuslim.com: Zins nur auf selbst eröffnetem D-Konto, gilt das für Smart und All inclusive? Kaufbarkeit aller 22 ISINs je Tarif.", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Versand in Zoho prüfen (Ordner Gesendet), dann Antwort abwarten." },
  sbroker: { anbieter: "S Broker", vorgaenge: [
    { datum: "28.09.2026", richtung: "raus", kanal: "Mail", adresse: "service@sbroker.de", kern: "In Zoho am 26.09. eingeplant für 28.09., 10 Uhr. Gebündelte Anfrage als finanzmuslim.com: Kaufbarkeit aller 22 Halal-ISINs im Direkt-Depot.", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Versand in Zoho prüfen (Ordner Gesendet), dann Antwort abwarten." },
  plus500: { anbieter: "Plus500", vorgaenge: [
    { datum: "28.09.2026", richtung: "raus", kanal: "Mail", adresse: "info@plus500.co.ee", kern: "In Zoho am 26.09. eingeplant für 28.09., 10 Uhr. Gebündelte Anfrage als finanzmuslim.com: Echte Aktien und ETFs statt CFDs in Deutschland? Falls ja, Kaufbarkeit aller 22 ISINs.", von: "elias@finanzmuslim.com" },
  ], naechsterSchritt: "Versand in Zoho prüfen (Ordner Gesendet), dann Antwort abwarten." },
  vivid: { anbieter: "Vivid", vorgaenge: [], naechsterSchritt: "Dispo einmal schriftlich bestätigen lassen: Der Hilfeartikel ist von 2023, Vivid Now gab es nur auf Antrag." },
  bunq: { anbieter: "bunq", vorgaenge: [], naechsterSchritt: "Optional: schriftlich bestätigen lassen, dass in keiner Stufe automatisch ein Dispo eingeräumt wird (AGB sagen „normalerweise“ nicht)." },
};

export const anfrageFuer = (haus?: string): Anfrage | undefined => (haus ? ANFRAGEN[haus] : undefined);
