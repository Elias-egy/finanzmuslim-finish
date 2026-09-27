/**
 * Inhalte der Startseiten /dein-investmentstart (Scalable) und
 * /dein-investmentstart/<kurzname> (alle anderen Partner).
 *
 * Eine Seite, viele Partner: Aufbau, Video, Sticky-Leiste und Pflichthinweise
 * sind überall gleich. Hier steht nur, was je Partner anders ist. Zahlen kommen
 * aus den Vergleichsdaten (Stand der Vergleiche), nichts ist geschätzt.
 *
 * Das Einrichtungsvideo zeigt Scalable Capital. Für andere Depots läuft
 * dasselbe Video mit einem Hinweis darunter; Girokonten zeigen stattdessen
 * die drei Schritte zur Kontoeröffnung.
 */

export type StartArt = "depot" | "girokonto" | "krypto";

export type StartPartner = {
  kurzname: string;
  anbieter: string;
  /** Kurzer Name für Knopf und Etikett, z. B. „Scalable“. */
  kurz: string;
  /** Domain für das Logo (logo.dev). */
  domain: string;
  /** Hauptfarbe aus dem Logo gemessen (15.09.2026), nur als kleines Detail im Hero. */
  markenfarbe: string;
  art: StartArt;
  /** Pfad der Startseite. */
  pfad: string;
  /** Affiliate-Link. `{SUBID}` wird durch Quelle und Position ersetzt, sonst unverändert. */
  link: string;
  /** Risikohinweis des Anbieters, nur bei Depots. */
  risikoUrl?: string;
  /** Überschrift in zwei Teilen, der zweite Teil ist hervorgehoben. */
  titel: [string, string];
  /** Knopftext der Aufrufe. */
  knopf: string;
  /** Hinweis unter dem Video. Fehlt bei Scalable, weil das Video Scalable zeigt. */
  videoHinweis: boolean;
  /** Kleine Leiste unter dem Hero. */
  chips: string[];
  fakten: { titel: string; text: string }[];
  checkliste: { titel: string; text: string }[];
  checklisteTitel: [string, string];
  faqs: { q: string; a: string }[];
  /** Girokonten und Krypto: Schritte statt Video. */
  schritte?: { titel: string; text: string }[];
};

const allgemeineFaq = {
  q: "Kostet mich der Link etwas?",
  a: "Nein. Konditionen, Gebühren und App sind identisch. Der Anbieter gibt lediglich einen Teil an mich weiter, statt alles zu behalten.",
};

const boerseFaq = {
  q: "Mein Umfeld sagt, Börse ist haram.",
  a: "Pauschal stimmt das nicht. Entscheidend ist, WAS du kaufst. Es gibt klare Gelehrten-Standards (AAOIFI), nach denen Anlagen geprüft werden. Genau dafür gibt es Shariah-Boards, und genau das erkläre ich in meinen Inhalten.",
};

const derivate = {
  titel: "Finger weg von Derivaten, Optionsscheinen und Hebelprodukten.",
  text: "Übermäßige Unsicherheit (Gharar), unabhängig vom Broker nicht islamkonform.",
};

export const startPartner: StartPartner[] = [
  {
    kurzname: "kraken",
    anbieter: "Kraken",
    kurz: "Kraken",
    domain: "kraken.com",
    markenfarbe: "#5741D9",
    art: "krypto",
    pfad: "/dein-investmentstart/kraken",
    link: "https://api.skynet.mcanism.com/c/09d9dW",
    titel: ["In 10 Minuten steht", "dein Krypto-Konto."],
    knopf: "Bei Kraken starten \u2192",
    videoHinweis: false,
    chips: ["Echte Coins", "Eigene Wallet", "600+ Coins", "MiCA-Lizenz"],
    schritte: [
      { titel: "Konto er\u00f6ffnen", text: "E-Mail best\u00e4tigen, dann Foto-Ident mit dem Ausweis. Dauert rund 10 Minuten." },
      { titel: "Auto Earn prüfen", text: "In den Kontoeinstellungen muss Auto Earn aus sein, bevor du einzahlst. Dann bleiben deine Coins ohne Zins." },
      { titel: "Erste Coins kaufen", text: "Ab 1 \u20ac per Echtzeit\u00fcberweisung, PayPal oder Karte. Danach auf deine eigene Wallet \u00fcbertragbar." },
    ],
    fakten: [
      {
        titel: "Echte Coins, keine Zertifikate",
        text: "Du kaufst den Coin selbst und kannst ihn auf eine eigene Wallet \u00fcbertragen. Kein ETP, kein Zertifikat auf den Kurs.",
      },
      {
        titel: "Ohne Zinsen nutzbar",
        text: "Auto Earn l\u00e4uft bei Kraken nur, wenn du es selbst einschaltest. Lass es aus, dann bleiben Guthaben und Coins ohne Zins.",
      },
      {
        titel: "600+ Coins, Sparplan ab 1 \u20ac",
        text: "MiCA-Lizenz aus Irland, Gesamtkosten 12,47 \u20ac pro 500 \u20ac, Auszahlung von Bitcoin f\u00fcr 1,00 \u20ac.",
      },
    ],
    checklisteTitel: ["2 Regeln halten dein Kraken-Konto", "riba-frei"],
    checkliste: [
      {
        titel: "Auto Earn aus lassen.",
        text: "Kraken startet Pr\u00e4mienprogramme erst, wenn du sie einschaltest. Den Schalter findest du in den Kontoeinstellungen.",
      },
      {
        titel: "Kein Margin, kein Futures-Handel.",
        text: "Kraken bietet beides an. Beides l\u00e4uft \u00fcber Kredit und Zins, das Konto funktioniert ohne.",
      },
    ],
    faqs: [
      allgemeineFaq,
      {
        q: "Warum ist bei Kraken kein Video?",
        a: "Das Einrichtungsvideo zeigt ein Depot. Bei Kraken sind es drei Schritte, die oben stehen: Konto er\u00f6ffnen, Auto Earn pr\u00fcfen, erste Coins kaufen.",
      },
      {
        q: "Ist Kraken halal nutzbar?",
        a: "Mit den 2 Regeln aus der Checkliste. Du besitzt echte Coins, kannst sie auf deine eigene Wallet holen, und ohne Auto Earn, Margin und Futures f\u00e4llt kein Zins an.",
      },
    ],
  },
  {
    kurzname: "scalable",
    anbieter: "Scalable Capital",
    kurz: "Scalable",
    domain: "scalable.capital",
    markenfarbe: "#22DFCF",
    art: "depot",
    pfad: "/dein-investmentstart",
    link: "https://partner.scalable-capital.de/go.cgi?pid=1017&wmid=250&cpid=1&prid=1&subid={SUBID}&target=Trading-Broker-M",
    risikoUrl: "https://de.scalable.capital/risiko",
    titel: ["In 10 Minuten steht", "dein Halal-Depot."],
    knopf: "Halal investieren →",
    videoHinweis: false,
    chips: ["Aktien", "ETFs", "Gold", "Krypto"],
    fakten: [
      {
        titel: "Große Auswahl islamkonformer Anlagen",
        text: "Bei Scalable ist eine große Auswahl auffindbar: mehrere Shariah-geprüfte Aktien-ETFs, ein Sukuk-ETF und zertifizierte Gold-ETCs.",
      },
      {
        titel: "Mehrere Halal-Aktien-ETFs handelbar",
        text: "Bei Scalable sind mehrere Shariah-geprüfte Aktien-ETFs handelbar, darunter auch ein aktiv gemanagter globaler Shariah-ETF. Diese Auswahl gibt es bei vielen deutschen Brokern nicht.",
      },
      {
        titel: "Start ab 1 €, Depot kostenlos",
        text: "Kostenloses Depot (FREE), Sparpläne ab 1 €, keine Mindestanlage. Du brauchst kein Vermögen, um anzufangen.",
      },
    ],
    checklisteTitel: ["2 Einstellungen machen dein Scalable-Depot", "riba-frei"],
    checkliste: [
      {
        titel: "Tagesgeldkonto nicht aktivieren.",
        text: "Das separate „Scalable Overnight“-Tagesgeld bringt Zinsen (Riba). Einfach nie aktivieren.",
      },
      derivate,
    ],
    faqs: [
      {
        q: "Kostet mich der Link etwas?",
        a: "Nein. Konditionen, Gebühren, App: alles identisch. Scalable teilt lediglich einen Teil mit mir, statt alles zu behalten.",
      },
      {
        q: "Ich habe schon ein Depot. Bringt mir das was?",
        a: "Ein Zweitdepot ist kostenlos und in 10 Minuten eröffnet. Fakt: Bei Scalable sind islamkonforme Anlagen handelbar, die es bei vielen deutschen Brokern nicht gibt. Darunter mehrere Shariah-geprüfte Aktien-ETFs und ein aktiv gemanagter globaler Shariah-ETF.",
      },
      {
        q: "Ist Scalable überhaupt halal nutzbar?",
        a: "Ja, mit den 2 Regeln aus der Checkliste oben. Genau deshalb erkläre ich sie dir, bevor du startest.",
      },
      boerseFaq,
    ],
  },
  {
    kurzname: "traders-place",
    anbieter: "Traders Place",
    kurz: "Traders Place",
    domain: "tradersplace.de",
    markenfarbe: "#12A391",
    art: "depot",
    pfad: "/dein-investmentstart/traders-place",
    link: "https://c.neqty.net/trck/eclick/5a4b0eecd844504b7de215a0b61bfb55",
    titel: ["In 10 Minuten steht", "dein Halal-Depot."],
    knopf: "Bei Traders Place eröffnen →",
    videoHinweis: true,
    chips: ["Aktien", "ETFs", "Gold", "Sukuk"],
    fakten: [
      {
        titel: "Alle Halal-Anlagen aus unserer Liste",
        text: "Laut der Wertpapiersuche von Traders Place sind alle 12 Halal-ETFs und Fonds, alle 3 Sukuk und alle 7 Gold- und Silber-ETCs aus unserem Vergleich handelbar.",
      },
      {
        titel: "Guthaben ohne Zinsen",
        text: "Dein Guthaben liegt ohne Verzinsung, und ein Wertpapierkredit wird dir nach der Eröffnung nicht eingeräumt.",
      },
      {
        titel: "Depot kostenlos, Sparplan ab 1 €",
        text: "Keine Depotgebühr, ETF-Sparpläne ohne Ausführungskosten, Sparraten von 1 € bis 7.500 €.",
      },
    ],
    checklisteTitel: ["2 Regeln halten dein Traders-Place-Depot", "riba-frei"],
    checkliste: [
      {
        titel: "Kein Tagesgeld dazubuchen.",
        text: "Traders Place bietet zusätzlich ein verzinstes Tagesgeld an. Das Depot funktioniert ohne. Einfach nicht abschließen.",
      },
      derivate,
    ],
    faqs: [
      allgemeineFaq,
      {
        q: "Warum zeigt das Video Scalable Capital?",
        a: "Das Video zeigt die Einrichtung am Beispiel Scalable. Kontoeröffnung, Ausweis bestätigen, Zinsangebote ablehnen und erste Anlage wählen laufen bei Traders Place genauso ab, nur die Menüs heißen anders.",
      },
      {
        q: "Ist Traders Place halal nutzbar?",
        a: "Ja, mit den 2 Regeln aus der Checkliste oben. Guthaben wird nicht verzinst, und kein Kredit wird automatisch eingeräumt.",
      },
      boerseFaq,
    ],
  },
  {
    kurzname: "dkb-depot",
    anbieter: "DKB",
    kurz: "DKB",
    domain: "dkb.de",
    markenfarbe: "#1283E0",
    art: "depot",
    pfad: "/dein-investmentstart/dkb-depot",
    link: "https://c.neqty.net/trck/eclick/175512c2679834b04880de5a3394ea36",
    titel: ["In 10 Minuten steht", "dein Halal-Depot."],
    knopf: "Bei DKB eröffnen →",
    videoHinweis: true,
    chips: ["Aktien", "ETFs", "Fonds", "Sparpläne"],
    fakten: [
      {
        titel: "Depot und Girokonto aus einer Hand",
        text: "Das DKB-Depot rechnet über das DKB-Girokonto ab. Das Guthaben dort liegt ohne Zinsen, du brauchst kein Tagesgeld.",
      },
      {
        titel: "Keine Depotgebühr",
        text: "Das Depot kostet nichts. Eine Order kostet 10 €, ein ETF-Sparplan 1,50 € je Ausführung.",
      },
      {
        titel: "Sparpläne ab 25 €",
        text: "Sparraten von 25 € bis 5.000 €, monatlich, zweimonatlich, vierteljährlich, halbjährlich oder jährlich.",
      },
    ],
    checklisteTitel: ["2 Regeln halten dein DKB-Depot", "riba-frei"],
    checkliste: [
      {
        titel: "Kein Tagesgeld und keinen Dispo nutzen.",
        text: "Die DKB bietet Tagesgeld und einen Dispositionskredit an. Beides bringt Zinsen ins Spiel. Das Depot funktioniert ohne.",
      },
      derivate,
    ],
    faqs: [
      allgemeineFaq,
      {
        q: "Warum zeigt das Video Scalable Capital?",
        a: "Das Video zeigt die Einrichtung am Beispiel Scalable. Kontoeröffnung, Ausweis bestätigen, Zinsangebote ablehnen und erste Anlage wählen laufen bei der DKB genauso ab, nur die Menüs heißen anders.",
      },
      {
        q: "Welche Halal-ETFs gibt es bei der DKB?",
        a: "Welche Anlagen aus unserer Halal-Liste bei der DKB kaufbar sind, prüfen wir gerade Anlage für Anlage. Den aktuellen Stand siehst du im Depot-Vergleich.",
      },
      boerseFaq,
    ],
  },
  {
    kurzname: "finvesto",
    anbieter: "finvesto",
    kurz: "finvesto",
    domain: "finvesto.de",
    markenfarbe: "#86B300",
    art: "depot",
    pfad: "/dein-investmentstart/finvesto",
    link: "https://c.neqty.net/trck/eclick/ca16f02d65f99bd7e0a84991894b75e3",
    titel: ["In 10 Minuten steht", "dein Halal-Depot."],
    knopf: "Bei finvesto eröffnen →",
    videoHinweis: true,
    chips: ["Fonds", "ETFs", "Sukuk", "Sparpläne"],
    fakten: [
      {
        titel: "Halal-Fonds und Sukuk kaufbar",
        text: "Laut finvesto sind mindestens 4 der 12 Halal-ETFs und Fonds sowie einer der 3 Sukuk aus unserem Vergleich kaufbar.",
      },
      {
        titel: "Guthaben ohne Zinsen",
        text: "Das Guthaben auf dem Abrechnungskonto wird nicht verzinst.",
      },
      {
        titel: "Sparpläne ohne Mindestbetrag",
        text: "Sparpläne gehen ohne Mindestrate. Die Depotgebühr liegt bei 46 € im Jahr, Käufe kosten 0,2 %.",
      },
    ],
    checklisteTitel: ["2 Regeln halten dein finvesto-Depot", "riba-frei"],
    checkliste: [
      {
        titel: "Kein Tagesgeld oder Festgeld dazubuchen.",
        text: "finvesto bietet verzinste Anlagen an. Dein Depot funktioniert ohne. Einfach nicht abschließen.",
      },
      derivate,
    ],
    faqs: [
      allgemeineFaq,
      {
        q: "Warum zeigt das Video Scalable Capital?",
        a: "Das Video zeigt die Einrichtung am Beispiel Scalable. Kontoeröffnung, Ausweis bestätigen, Zinsangebote ablehnen und erste Anlage wählen laufen bei finvesto genauso ab, nur die Menüs heißen anders.",
      },
      {
        q: "Für wen passt finvesto?",
        a: "Für alle, die vor allem in Fonds sparen wollen. Einzelaktien-Sparpläne gibt es dort nicht, und die Depotgebühr ist höher als bei Neobrokern.",
      },
      boerseFaq,
    ],
  },
  {
    kurzname: "dkb-girokonto",
    anbieter: "DKB",
    kurz: "DKB",
    domain: "dkb.de",
    markenfarbe: "#1283E0",
    art: "girokonto",
    pfad: "/dein-investmentstart/dkb-girokonto",
    link: "https://c.neqty.net/trck/eclick/79bc49b9d70debbb2d943925ed126d17",
    titel: ["Dein zinsfreies", "Girokonto."],
    knopf: "Bei DKB eröffnen →",
    videoHinweis: false,
    chips: ["0 € ab 700 € Geldeingang", "Visa-Debitkarte", "Apple Pay", "Kontowechsel"],
    schritte: [
      { titel: "Antrag online ausfüllen", text: "Name, Adresse, Steuer-ID. Dauert ein paar Minuten." },
      { titel: "Per Video-Ident bestätigen", text: "Ausweis in die Kamera halten, fertig." },
      { titel: "App einrichten", text: "Die Karte kommt per Post, danach Apple Pay einrichten." },
    ],
    fakten: [
      {
        titel: "Guthaben ohne Zinsen",
        text: "Das Girokonto wird nicht verzinst. Du musst nichts abschalten.",
      },
      {
        titel: "Karte ohne Kreditrahmen",
        text: "Die Visa-Debitkarte bucht direkt vom Konto ab, ohne Kreditrahmen und ohne Teilzahlung.",
      },
      {
        titel: "Kostenlos ab 700 € Geldeingang",
        text: "Bei mindestens 700 € Geldeingang im Monat oder unter 28 kostet die Kontoführung nichts, sonst 4,50 €. Weltweit an rund 49.750 Automaten Geld abheben, Kontowechsel-Service inklusive.",
      },
    ],
    checklisteTitel: ["2 Regeln halten dein DKB-Konto", "riba-frei"],
    checkliste: [
      {
        titel: "Keinen Dispo beantragen.",
        text: "Ein Dispositionskredit kostet Zinsen, sobald du ihn nutzt. Lass ihn einfach weg oder auf null.",
      },
      {
        titel: "Kein Tagesgeld und keine Kreditkarte mit Teilzahlung.",
        text: "Beides bringt Zinsen ins Spiel. Die Debitkarte reicht für alles im Alltag.",
      },
    ],
    faqs: [
      allgemeineFaq,
      {
        q: "Ist ein Girokonto überhaupt halal?",
        a: "Ein Girokonto ohne Zinsen und ohne genutzten Kredit ist nach den gängigen Gelehrten-Standards erlaubt. Entscheidend sind die 2 Regeln aus der Checkliste.",
      },
    ],
  },
  {
    kurzname: "n26",
    anbieter: "N26",
    kurz: "N26",
    domain: "n26.com",
    markenfarbe: "#36A18B",
    art: "girokonto",
    pfad: "/dein-investmentstart/n26",
    link: "https://c.neqty.net/trck/eclick/d7289e91a9dbd189bedb781dc15f3a41",
    titel: ["Dein zinsfreies", "Girokonto."],
    knopf: "Bei N26 eröffnen →",
    videoHinweis: false,
    chips: ["ab 0 € im Monat", "Mastercard", "Apple Pay", "Kein Dispo ab Start"],
    schritte: [
      { titel: "Antrag in der App", text: "Name, Adresse, Steuer-ID. Dauert ein paar Minuten." },
      { titel: "Per Video-Ident bestätigen", text: "Ausweis in die Kamera halten, alternativ Post-Ident." },
      { titel: "Loslegen", text: "Die Karte kommt per Post, danach Apple Pay einrichten." },
    ],
    fakten: [
      {
        titel: "Guthaben ohne Zinsen",
        text: "Das Konto wird nicht verzinst. Du musst nichts abschalten.",
      },
      {
        titel: "Kein Dispo ab Start",
        text: "Ein Dispositionskredit wird nicht automatisch eingeräumt, und die Mastercard bucht direkt vom Konto ab.",
      },
      {
        titel: "Tarife ab 0 €",
        text: "Standard kostet nichts, Smart 4,90 €, Go 9,90 € und Metal 16,90 € im Monat. Für die Eröffnung brauchst du keinen Mindestgeldeingang.",
      },
    ],
    checklisteTitel: ["2 Regeln halten dein N26-Konto", "riba-frei"],
    checkliste: [
      {
        titel: "Keinen Dispo oder Ratenkredit beantragen.",
        text: "N26 bietet beides in der App an. Beides kostet Zinsen. Einfach nicht beantragen.",
      },
      {
        titel: "Kein Tagesgeld aktivieren.",
        text: "Das N26-Tagesgeld bringt Zinsen. Dein Girokonto funktioniert ohne.",
      },
    ],
    faqs: [
      allgemeineFaq,
      {
        q: "Welcher N26-Tarif passt?",
        a: "Wir bewerten alle Tarife gleich: ohne Zinsen, ohne Dispo ab Start. Standard reicht für den Alltag, die höheren Tarife bringen mehr kostenlose Abhebungen und Extras.",
      },
      {
        q: "Ist ein Girokonto überhaupt halal?",
        a: "Ein Girokonto ohne Zinsen und ohne genutzten Kredit ist nach den gängigen Gelehrten-Standards erlaubt. Entscheidend sind die 2 Regeln aus der Checkliste.",
      },
    ],
  },
  {
    kurzname: "bbbank",
    anbieter: "BBBank",
    kurz: "BBBank",
    domain: "bbbank.de",
    markenfarbe: "#0050A0",
    art: "girokonto",
    pfad: "/dein-investmentstart/bbbank",
    link: "https://c.neqty.net/trck/eclick/5a913135bf2744d85558983a6eb6625b",
    titel: ["Dein zinsfreies", "Girokonto."],
    knopf: "Bei BBBank eröffnen →",
    videoHinweis: false,
    chips: ["Filialen", "Visa-Debitkarte", "Apple Pay", "Kein Dispo ab Start"],
    schritte: [
      { titel: "Antrag online ausfüllen", text: "Name, Adresse, Steuer-ID. Dauert ein paar Minuten." },
      { titel: "Per Video- oder E-Ident bestätigen", text: "Ausweis in die Kamera halten oder mit dem Online-Ausweis." },
      { titel: "App einrichten", text: "Karte kommt per Post, Beratung gibt es auch in der Filiale." },
    ],
    fakten: [
      {
        titel: "Guthaben ohne Zinsen",
        text: "Das Girokonto wird nicht verzinst. Du musst nichts abschalten.",
      },
      {
        titel: "Kein Dispo ab Start",
        text: "Ein Dispositionskredit wird nicht automatisch eingeräumt, und die Visa-Debitkarte bucht direkt vom Konto ab.",
      },
      {
        titel: "Bank mit Filialen",
        text: "Kontoführung 2,95 € im Monat, dafür Filialen, Telefon und Chat. Bargeld einzahlen geht am Schalter.",
      },
    ],
    checklisteTitel: ["2 Regeln halten dein BBBank-Konto", "riba-frei"],
    checkliste: [
      {
        titel: "Keinen Dispo beantragen.",
        text: "Ein Dispositionskredit kostet Zinsen, sobald du ihn nutzt. Lass ihn einfach weg.",
      },
      {
        titel: "Kein Tagesgeld abschließen.",
        text: "Die BBBank bietet verzinstes Tagesgeld an. Dein Girokonto funktioniert ohne.",
      },
    ],
    faqs: [
      allgemeineFaq,
      {
        q: "Ist ein Girokonto überhaupt halal?",
        a: "Ein Girokonto ohne Zinsen und ohne genutzten Kredit ist nach den gängigen Gelehrten-Standards erlaubt. Entscheidend sind die 2 Regeln aus der Checkliste.",
      },
    ],
  },
  {
    kurzname: "joe-broker",
    anbieter: "JOE Broker",
    kurz: "JOE",
    domain: "joebroker.de",
    markenfarbe: "#78B878",
    art: "depot",
    pfad: "/dein-investmentstart/joe-broker",
    link: "https://www.financeads.net/tc.php?t=87591C5496129308T",
    titel: ["In 10 Minuten steht", "dein Halal-Depot."],
    knopf: "Bei JOE eröffnen →",
    videoHinweis: true,
    chips: ["Aktien", "ETFs", "Sparpläne", "0 € Depotgebühr"],
    fakten: [
      {
        titel: "Guthaben ohne Zinsen",
        text: "Das Guthaben auf dem Verrechnungskonto wird nicht verzinst, schriftlich bestätigt vom Support. Eine geplante Verzinsung gilt laut Support nur für Konten, die danach eröffnet werden.",
      },
      {
        titel: "Keine Depotgebühr",
        text: "Das Depot kostet nichts. Eine Order kostet 1 €, ein Sparplan 0,50 € je Ausführung.",
      },
      {
        titel: "Sparpläne ab 25 €",
        text: "Aktien- und ETF-Sparpläne ab 25 € im Monat. Dein Depot liegt bei der Baader Bank.",
      },
    ],
    checklisteTitel: ["2 Regeln halten dein JOE-Depot", "riba-frei"],
    checkliste: [
      {
        titel: "Keine Zinsangebote annehmen.",
        text: "Bietet dir JOE später Zinsen oder ein Tagesgeld an, lehne ab. Dein Depot funktioniert ohne.",
      },
      derivate,
    ],
    faqs: [
      allgemeineFaq,
      {
        q: "Warum zeigt das Video Scalable Capital?",
        a: "Das Video zeigt die Einrichtung am Beispiel Scalable. Kontoeröffnung, Ausweis bestätigen, Zinsangebote ablehnen und erste Anlage wählen laufen bei JOE genauso ab, nur die Menüs heißen anders.",
      },
      {
        q: "Welche Halal-ETFs gibt es bei JOE?",
        a: "Welche Anlagen aus unserer Halal-Liste bei JOE kaufbar sind, prüfen wir gerade Anlage für Anlage. Den aktuellen Stand siehst du im Depot-Vergleich.",
      },
      boerseFaq,
    ],
  },
  {
    kurzname: "bunq",
    anbieter: "bunq",
    kurz: "bunq",
    domain: "bunq.com",
    markenfarbe: "#208040",
    art: "girokonto",
    pfad: "/dein-investmentstart/bunq",
    link: "https://www.financeads.net/tc.php?t=87591C3156123231T",
    titel: ["Dein zinsfreies", "Girokonto."],
    knopf: "Bei bunq eröffnen →",
    videoHinweis: false,
    chips: ["ab 0 € im Monat", "Mastercard ab Core", "Apple Pay", "Kein Dispo"],
    schritte: [
      { titel: "App laden, Tarif wählen", text: "Free kostet nichts, eine Debitkarte gibt es ab Core." },
      { titel: "Konto eröffnen", text: "Laut bunq dauert die Anmeldung etwa fünf Minuten." },
      { titel: "Loslegen", text: "Ab Core kommt die Mastercard per Post, danach Apple Pay einrichten." },
    ],
    fakten: [
      {
        titel: "Konto ohne Zinsen",
        text: "Zinsen zahlt bunq laut AGB nur auf eigene Sparkonten. Dein Girokonto bleibt ohne, solange du keins eröffnest.",
      },
      {
        titel: "Kein Dispo",
        text: "bunq räumt laut AGB normalerweise keinen Dispokredit ein, ein Minus auf dem Konto ist nicht erlaubt.",
      },
      {
        titel: "Tarife ab 0 €",
        text: "Free kostet nichts, Core mit Mastercard-Debitkarte 3,99 € im Monat. SEPA-Überweisungen sind kostenlos.",
      },
    ],
    checklisteTitel: ["2 Regeln halten dein bunq-Konto", "riba-frei"],
    checkliste: [
      {
        titel: "Kein Sparkonto eröffnen.",
        text: "bunq wirbt stark mit Zinsen auf Ersparnisse. Die gibt es nur auf einem Sparkonto, dein Girokonto funktioniert ohne.",
      },
      {
        titel: "Keine Kreditkarte mit Teilzahlung.",
        text: "Teilzahlung kostet Zinsen. Die Debitkarte bucht direkt vom Konto ab und reicht für den Alltag.",
      },
    ],
    faqs: [
      allgemeineFaq,
      {
        q: "Welcher bunq-Tarif passt?",
        a: "Für eine Debitkarte brauchst du mindestens Core für 3,99 € im Monat. Free kostet nichts, hat laut Finanzfluss-Vergleich aber keine Debitkarte.",
      },
      {
        q: "Ist ein Girokonto überhaupt halal?",
        a: "Ein Girokonto ohne Zinsen und ohne genutzten Kredit ist nach den gängigen Gelehrten-Standards erlaubt. Entscheidend sind die 2 Regeln aus der Checkliste.",
      },
    ],
  },
  {
    kurzname: "wise",
    anbieter: "Wise",
    kurz: "Wise",
    domain: "wise.com",
    markenfarbe: "#9FE870",
    art: "girokonto",
    pfad: "/dein-investmentstart/wise",
    link: "https://wise.prf.hn/click/camref:1011l5RuSL/destination:https%3A%2F%2Fwise.com%2Fde%2F",
    titel: ["Dein zinsfreies", "Wise-Konto."],
    knopf: "Bei Wise eröffnen →",
    videoHinweis: false,
    chips: ["Kein Abo", "Mastercard", "Apple Pay", "Kein Dispo"],
    schritte: [
      { titel: "Konto registrieren", text: "Die Registrierung bei Wise ist kostenlos, ein Abo gibt es nicht." },
      { titel: "Cashback abschalten", text: "Wise meldet Kunden im EWR automatisch für Cashback an. Schalte es in der App ab, bevor du Geld einzahlst." },
      { titel: "Karte bestellen", text: "Die Wise-Debitkarte kostet einmalig 7 €. Danach Apple Pay einrichten." },
    ],
    fakten: [
      {
        titel: "Cashback lässt sich abschalten",
        text: "Wise zahlt monatlich Cashback auf dein Guthaben in EUR, GBP und USD und meldet dich dafür automatisch an. Abmelden kannst du dich laut Wise jederzeit.",
      },
      {
        titel: "Kein Dispo möglich",
        text: "Laut Wise kannst du dein Konto nicht überziehen und kein Darlehen erhalten.",
      },
      {
        titel: "Keine Abo-Gebühren",
        text: "Das Konto kostet nichts, die Karte einmalig 7 €. Abheben ist bis 250 € im Monat kostenlos, darüber kostet es 2,69 %.",
      },
    ],
    checklisteTitel: ["2 Regeln halten dein Wise-Konto", "riba-frei"],
    checkliste: [
      {
        titel: "Cashback abschalten.",
        text: "Das Cashback richtet sich nach deinem Guthaben und ist voreingestellt. Einmal in der App abmelden, dann bleibt dein Geld ohne Ertrag.",
      },
      {
        titel: "Keine Zinsanlage über Assets.",
        text: "Wise bietet in manchen Regionen das Assets-Feature an, damit liegt dein Geld in Aktien oder Zinsanlagen. Dein Konto funktioniert ohne.",
      },
    ],
    faqs: [
      allgemeineFaq,
      {
        q: "Ersetzt Wise mein Girokonto?",
        a: "Eher als Zweitkonto. Eine Girocard gibt es nicht, und Bargeld einzahlen geht laut Finanzfluss-Vergleich nicht.",
      },
      {
        q: "Ist Wise halal nutzbar?",
        a: "Mit den 2 Regeln aus der Checkliste. Auf Guthaben im Konto zahlt Wise laut eigener Hilfe keine Zinsen, das Cashback schaltest du ab, und überziehen geht nicht.",
      },
    ],
  },
  {
    kurzname: "comdirect-girokonto",
    anbieter: "comdirect",
    kurz: "comdirect",
    domain: "comdirect.de",
    markenfarbe: "#FFF500",
    art: "girokonto",
    pfad: "/dein-investmentstart/comdirect-girokonto",
    link: "https://www.financeads.net/tc.php?t=87591C87024068T",
    titel: ["Dein zinsfreies", "Girokonto."],
    knopf: "Bei comdirect eröffnen →",
    videoHinweis: false,
    chips: ["Visa-Debitkarte", "Apple Pay", "Kein Dispo ab Start", "3 Abhebungen im Monat"],
    schritte: [
      { titel: "Antrag online ausfüllen", text: "Die Eröffnung läuft komplett online und dauert laut comdirect wenige Minuten." },
      { titel: "Identität bestätigen", text: "Sofort online oder bei der Post." },
      { titel: "PIN vergeben", text: "Wunsch-PIN wählen, photoTAN aktivieren, danach Apple Pay einrichten." },
    ],
    fakten: [
      {
        titel: "Guthaben ohne Zinsen",
        text: "Im Preis- und Leistungsverzeichnis steht die Guthabenverzinsung nur beim Tagesgeld, nicht beim Girokonto Aktiv.",
      },
      {
        titel: "Kein Dispo ab Start",
        text: "Einen Dispo gibt es nur, wenn du ihn eigens mit comdirect vereinbarst. Die Visa-Debitkarte bucht direkt vom Konto ab.",
      },
      {
        titel: "Kostenlos mit Bedingung",
        text: "Die ersten 6 Monate kosten nichts. Danach bleibt es kostenlos mit 700 € Geldeingang, 3 Zahlungen per Apple Pay oder Google Pay oder einem Trade im Monat. Sonst 4,90 € im Monat.",
      },
    ],
    checklisteTitel: ["2 Regeln halten dein comdirect-Konto", "riba-frei"],
    checkliste: [
      {
        titel: "Kein Geld aufs Tagesgeld legen.",
        text: "Zu jedem comdirect-Konto gehört ein Tagesgeldkonto, derzeit mit 1,75 % Zinsen beworben. Lass es leer, dein Girokonto funktioniert ohne.",
      },
      {
        titel: "Keinen Dispo vereinbaren.",
        text: "Der Dispo kostet laut comdirect 8,90 % Zinsen im Jahr, sobald du ihn nutzt. Einfach nicht beantragen.",
      },
    ],
    faqs: [
      allgemeineFaq,
      {
        q: "Welches comdirect-Konto passt?",
        a: "Bewertet haben wir das Girokonto Aktiv. Für den Alltag reicht es, die Visa-Debitkarte ist dabei.",
      },
      {
        q: "Ist ein Girokonto überhaupt halal?",
        a: "Ein Girokonto ohne Zinsen und ohne genutzten Kredit ist nach den gängigen Gelehrten-Standards erlaubt. Entscheidend sind die 2 Regeln aus der Checkliste.",
      },
    ],
  },
  {
    kurzname: "postbank",
    anbieter: "Postbank",
    kurz: "Postbank",
    domain: "postbank.de",
    markenfarbe: "#FFCC00",
    art: "girokonto",
    pfad: "/dein-investmentstart/postbank",
    link: "https://www.financeads.net/tc.php?t=87591C426125749T",
    titel: ["Dein zinsfreies", "Girokonto."],
    knopf: "Bei Postbank eröffnen →",
    videoHinweis: false,
    chips: ["Filialen", "Debitkarte 0 €", "Apple Pay", "Kein Dispo ab Start"],
    schritte: [
      { titel: "Antrag online ausfüllen", text: "Giro pur ist ein Online-Konto, du eröffnest es ohne Besuch in der Filiale." },
      { titel: "Per Video- oder Post-Ident bestätigen", text: "Ausweis in die Kamera halten oder in der Postfiliale vorzeigen." },
      { titel: "Loslegen", text: "Die Postbank Card kommt per Post, danach Apple Pay einrichten." },
    ],
    fakten: [
      {
        titel: "Guthaben ohne Zinsen",
        text: "Der Preisaushang nennt für Guthaben auf Privat-Girokonten 0,00 %.",
      },
      {
        titel: "Kein Dispo ab Start",
        text: "Eine eingeräumte Überziehung musst du eigens beantragen. Die Postbank Card bucht direkt vom Konto ab.",
      },
      {
        titel: "Kostenlos ab 900 € Geldeingang",
        text: "Bei mindestens 900 € Geldeingang im Monat kostet die Kontoführung nichts, sonst 5,90 €. Die Postbank Card ist inklusive.",
      },
    ],
    checklisteTitel: ["2 Regeln halten dein Postbank-Konto", "riba-frei"],
    checkliste: [
      {
        titel: "Keinen Dispo beantragen.",
        text: "Die eingeräumte Überziehung kostet laut Postbank 11,04 % Zinsen im Jahr. Einfach nicht beantragen.",
      },
      {
        titel: "Nicht ins Minus rutschen.",
        text: "Auch ohne Dispo kostet ein geduldetes Minus 12,85 % Zinsen. Behalte deinen Kontostand im Blick, bevor Lastschriften abgehen.",
      },
    ],
    faqs: [
      allgemeineFaq,
      {
        q: "Warum Giro pur und nicht Giro plus?",
        a: "Bewertet haben wir Giro pur. Der Link führt direkt auf dieses Konto.",
      },
      {
        q: "Ist ein Girokonto überhaupt halal?",
        a: "Ein Girokonto ohne Zinsen und ohne genutzten Kredit ist nach den gängigen Gelehrten-Standards erlaubt. Entscheidend sind die 2 Regeln aus der Checkliste.",
      },
    ],
  },
  {
    kurzname: "bbbank-bettersmart",
    anbieter: "BBBank",
    kurz: "BBBank",
    domain: "bbbank.de",
    markenfarbe: "#0050A0",
    art: "girokonto",
    pfad: "/dein-investmentstart/bbbank-bettersmart",
    link: "https://c.neqty.net/trck/eclick/5a913135bf2744d81a8eb17829b592ec115422fda1f305ee",
    titel: ["Dein zinsfreies", "Girokonto."],
    knopf: "Bei BBBank eröffnen →",
    videoHinweis: false,
    chips: ["Filialen", "Visa-Debitkarte", "Apple Pay", "Kein Dispo ab Start"],
    schritte: [
      { titel: "Antrag online ausfüllen", text: "Name, Adresse, Steuer-ID. Dauert ein paar Minuten." },
      { titel: "Per Video- oder E-Ident bestätigen", text: "Ausweis in die Kamera halten oder mit dem Online-Ausweis." },
      { titel: "App einrichten", text: "Karte kommt per Post, Beratung gibt es auch in der Filiale." },
    ],
    fakten: [
      {
        titel: "Guthaben ohne Zinsen",
        text: "Im Preisverzeichnis der BBBank steht beim BetterSmart Konto kein Guthabenzins.",
      },
      {
        titel: "Kein Dispo ab Start",
        text: "Den Dispo beantragst du laut BBBank eigens online oder in der Filiale. Die Visa-Debitkarte bucht direkt vom Konto ab.",
      },
      {
        titel: "Kostenlos mit Bedingung",
        text: "Kostenlos mit e-Postfach und 1.000 € Geldeingang im Monat, unter 30 auch ohne Geldeingang. Sonst 4,95 € im Monat.",
      },
    ],
    checklisteTitel: ["2 Regeln halten dein BBBank-Konto", "riba-frei"],
    checkliste: [
      {
        titel: "Kein Geld aufs Tagesgeld legen.",
        text: "Zum BetterSmart Konto gehört ein Tagesgeldkonto. Lass es leer, dein Girokonto funktioniert ohne.",
      },
      {
        titel: "Keinen Dispo beantragen.",
        text: "Ein Dispositionskredit kostet Zinsen, sobald du ihn nutzt. Lass ihn einfach weg.",
      },
    ],
    faqs: [
      allgemeineFaq,
      {
        q: "Was ist der Unterschied zum BBBank-Girokonto?",
        a: "Beide sind Girokonten der BBBank. BetterSmart ist unter den genannten Bedingungen kostenlos, das klassische Girokonto kostet 2,95 € im Monat.",
      },
      {
        q: "Ist ein Girokonto überhaupt halal?",
        a: "Ein Girokonto ohne Zinsen und ohne genutzten Kredit ist nach den gängigen Gelehrten-Standards erlaubt. Entscheidend sind die 2 Regeln aus der Checkliste.",
      },
    ],
  },
  {
    kurzname: "comdirect-depot",
    anbieter: "comdirect",
    kurz: "comdirect",
    domain: "comdirect.de",
    markenfarbe: "#FFF500",
    art: "depot",
    pfad: "/dein-investmentstart/comdirect-depot",
    link: "https://www.financeads.net/tc.php?t=87591C87024090T",
    titel: ["In 10 Minuten steht", "dein Halal-Depot."],
    knopf: "Bei comdirect eröffnen →",
    videoHinweis: true,
    chips: ["Aktien", "ETFs", "Sukuk", "Sparpläne"],
    fakten: [
      {
        titel: "Verrechnungskonto ohne Zinsen",
        text: "comdirect hat uns schriftlich bestätigt: Guthaben auf dem Verrechnungskonto wird nicht verzinst.",
      },
      {
        titel: "Halal-Anlagen kaufbar",
        text: "Mindestens 8 von 12 Halal-ETFs und Fonds unserer Liste und alle 3 Sukuk-Fonds sind bei comdirect kaufbar.",
      },
      {
        titel: "Keine Depotgebühr",
        text: "Die Depotführung kostet nichts. Als Neukunde zahlst du 36 Monate lang 3,90 € je Order, dazu Spreads und Börsenentgelte.",
      },
    ],
    checklisteTitel: ["2 Regeln halten dein comdirect-Depot", "riba-frei"],
    checkliste: [
      {
        titel: "Kein Tagesgeld und keinen Dispo nutzen.",
        text: "comdirect bietet verzinstes Tagesgeld und einen Dispositionskredit an. Beides bringt Zinsen ins Spiel. Das Depot funktioniert ohne.",
      },
      derivate,
    ],
    faqs: [
      allgemeineFaq,
      {
        q: "Warum zeigt das Video Scalable Capital?",
        a: "Das Video zeigt die Einrichtung am Beispiel Scalable. Kontoeröffnung, Ausweis bestätigen, Zinsangebote ablehnen und erste Anlage wählen laufen bei comdirect genauso ab, nur die Menüs heißen anders.",
      },
      {
        q: "Pure Depot oder comdirect Depot?",
        a: "Das Pure Depot kostet 1 € je Order, hat aber nicht das volle Wertpapierangebot. Für unsere Halal-Liste ist das comdirect Depot die sichere Wahl.",
      },
      boerseFaq,
    ],
  },
  {
    kurzname: "comdirect-pure-depot",
    anbieter: "comdirect",
    kurz: "comdirect",
    domain: "comdirect.de",
    markenfarbe: "#FFF500",
    art: "depot",
    pfad: "/dein-investmentstart/comdirect-pure-depot",
    link: "https://www.financeads.net/tc.php?t=87591C870133258T",
    titel: ["In 10 Minuten steht", "dein Halal-Depot."],
    knopf: "Bei comdirect eröffnen →",
    videoHinweis: true,
    chips: ["Aktien", "ETFs", "1 € je Order", "Sparpläne 0 €"],
    fakten: [
      {
        titel: "Verrechnungskonto ohne Zinsen",
        text: "comdirect hat uns schriftlich bestätigt, dass Guthaben auf dem Verrechnungskonto nicht verzinst wird, ausdrücklich auch beim Pure Depot.",
      },
      {
        titel: "Günstig handeln",
        text: "Die Depotführung kostet nichts, eine Order 1 €, Sparpläne 0 €. Dazu kommen marktübliche Spreads.",
      },
      {
        titel: "Nicht das volle Angebot",
        text: "Das Pure Depot hat nicht das volle comdirect-Wertpapierangebot. Welche Halal-Anlagen dort kaufbar sind, prüfen wir gerade Anlage für Anlage.",
      },
    ],
    checklisteTitel: ["2 Regeln halten dein comdirect-Depot", "riba-frei"],
    checkliste: [
      {
        titel: "Kein Tagesgeld und keinen Dispo nutzen.",
        text: "comdirect bietet verzinstes Tagesgeld und einen Dispositionskredit an. Beides bringt Zinsen ins Spiel. Das Depot funktioniert ohne.",
      },
      derivate,
    ],
    faqs: [
      allgemeineFaq,
      {
        q: "Warum zeigt das Video Scalable Capital?",
        a: "Das Video zeigt die Einrichtung am Beispiel Scalable. Kontoeröffnung, Ausweis bestätigen, Zinsangebote ablehnen und erste Anlage wählen laufen bei comdirect genauso ab, nur die Menüs heißen anders.",
      },
      boerseFaq,
    ],
  },
  {
    kurzname: "finanzen-net-zero",
    anbieter: "finanzen.net ZERO",
    kurz: "ZERO",
    domain: "finanzen.net",
    markenfarbe: "#FF1C7C",
    art: "depot",
    pfad: "/dein-investmentstart/finanzen-net-zero",
    link: "https://www.financeads.net/tc.php?t=87591C372273516T",
    titel: ["In 10 Minuten steht", "dein Halal-Depot."],
    knopf: "Bei ZERO eröffnen →",
    videoHinweis: true,
    chips: ["Aktien", "ETFs", "Sukuk", "Edelmetalle"],
    fakten: [
      {
        titel: "Verrechnungskonto ohne Zinsen",
        text: "Laut Preis- und Leistungsverzeichnis liegt der Guthabenzins auf dem Verrechnungskonto bei 0 %.",
      },
      {
        titel: "Halal-Anlagen kaufbar",
        text: "5 von 12 Halal-ETFs und Fonds unserer Liste, 2 von 3 Sukuk-Fonds und 5 von 7 Edelmetall-Produkten sind bei ZERO kaufbar.",
      },
      {
        titel: "Ab 0 € Ordergebühr",
        text: "Die Depotführung ist kostenlos, Orders kosten 0 € plus Spread. Unter 500 € Ordervolumen kommt 1 € dazu.",
      },
    ],
    checklisteTitel: ["2 Regeln halten dein ZERO-Depot", "riba-frei"],
    checkliste: [
      {
        titel: "Keinen Depotkredit nutzen.",
        text: "ZERO bietet einen Kredit auf dein Depot an. Der kostet Zinsen, dein Depot funktioniert ohne.",
      },
      {
        titel: "Kein Zinsangebot über Geldmarkt-ETFs.",
        text: "ZERO wirbt mit einem Zinsangebot über Geldmarkt-ETFs. Die bilden Zinsen ab, deshalb Finger weg.",
      },
    ],
    faqs: [
      allgemeineFaq,
      {
        q: "Warum zeigt das Video Scalable Capital?",
        a: "Das Video zeigt die Einrichtung am Beispiel Scalable. Kontoeröffnung, Ausweis bestätigen, Zinsangebote ablehnen und erste Anlage wählen laufen bei ZERO genauso ab, nur die Menüs heißen anders.",
      },
      boerseFaq,
    ],
  },
  {
    kurzname: "finanzen-net-zero-krypto",
    anbieter: "finanzen.net ZERO",
    kurz: "ZERO",
    domain: "finanzen.net",
    markenfarbe: "#FF1C7C",
    art: "krypto",
    pfad: "/dein-investmentstart/finanzen-net-zero-krypto",
    link: "https://www.financeads.net/tc.php?t=87591C372295574T",
    titel: ["In 10 Minuten steht", "dein Krypto-Konto."],
    knopf: "Bei ZERO starten →",
    videoHinweis: false,
    chips: ["Echte Coins", "59 Coins", "Sparplan", "MiCA-Lizenz"],
    schritte: [
      { titel: "Depot eröffnen", text: "Krypto läuft bei ZERO im selben Depot wie Aktien und ETFs. Bestätigen per Video-, Post- oder E-Ident." },
      { titel: "Wallet freischalten", text: "Die Wallet ist Teil des ZERO-Depots und kostet nichts." },
      { titel: "Erste Coins kaufen", text: "Ein Mindestordervolumen gibt es nicht. Unter 500 € kommt 1 € Zuschlag dazu." },
    ],
    fakten: [
      {
        titel: "Echte Coins, verwahrt in Deutschland",
        text: "Du kaufst echte Coins, verwahrt bei der Tangany GmbH unter BaFin-Aufsicht. Auf eine eigene Wallet übertragen kannst du sie nicht.",
      },
      {
        titel: "Ohne Zinsen",
        text: "Das Kontomodell hat keine kostenpflichtige Stufe, der Guthabenzins liegt laut Preisverzeichnis bei 0 %.",
      },
      {
        titel: "1 % Provision, keine Verwahrgebühr",
        text: "Dazu ein reduzierter Spread und unter 500 € Ordervolumen 1 € Zuschlag. Depot- und Verwahrgebühren gibt es nicht.",
      },
    ],
    checklisteTitel: ["2 Regeln halten dein ZERO-Konto", "riba-frei"],
    checkliste: [
      {
        titel: "Keinen Depotkredit nutzen.",
        text: "ZERO bietet einen Kredit auf dein Depot an. Der kostet Zinsen, dein Depot funktioniert ohne.",
      },
      {
        titel: "Keine Derivate auf Kryptos.",
        text: "ZERO führt auch Zertifikate und Optionsscheine. Kauf den Coin selbst, kein Papier auf den Kurs.",
      },
    ],
    faqs: [
      allgemeineFaq,
      {
        q: "Warum ist hier kein Video?",
        a: "Das Einrichtungsvideo zeigt ein Depot. Bei ZERO sind es drei Schritte, die oben stehen: Depot eröffnen, Wallet freischalten, erste Coins kaufen.",
      },
      {
        q: "Kann ich meine Coins auf eine eigene Wallet holen?",
        a: "Nein. Laut Finanzfluss-Vergleich ist bei ZERO keine Auszahlung von Krypto möglich. Wer seine Coins selbst verwahren will, braucht einen Anbieter mit Auszahlung.",
      },
    ],
  },
  {
    kurzname: "s-broker",
    anbieter: "S Broker",
    kurz: "S Broker",
    domain: "sbroker.de",
    markenfarbe: "#EE0000",
    art: "depot",
    pfad: "/dein-investmentstart/s-broker",
    link: "https://www.financeads.net/tc.php?t=87591C19119676T",
    titel: ["In 10 Minuten steht", "dein Halal-Depot."],
    knopf: "Beim S Broker eröffnen →",
    videoHinweis: true,
    chips: ["Aktien", "ETFs", "Sparpläne 0 €", "Broker der Sparkassen"],
    fakten: [
      {
        titel: "Verrechnungskonto ohne Zinsen",
        text: "Laut Preisübersicht liegt der Zins auf dem Euro-Verrechnungskonto bei 0,00 %.",
      },
      {
        titel: "Günstig handeln",
        text: "Die Depotführung ist kostenlos, eine Sofortorder kostet 0,95 €. ETF-Sparpläne sind kostenlos, ab 5 € im Monat.",
      },
      {
        titel: "Halal-Anlagen",
        text: "Welche Anlagen aus unserer Halal-Liste beim S Broker kaufbar sind, prüfen wir gerade Anlage für Anlage.",
      },
    ],
    checklisteTitel: ["2 Regeln halten dein S Broker-Depot", "riba-frei"],
    checkliste: [
      {
        titel: "Nur das Verrechnungskonto nutzen.",
        text: "Das Verrechnungskonto hat laut S Broker 0,00 % Zins. Zusatzkonten wie das KontoPlus musst du eigens beauftragen, das Depot funktioniert ohne.",
      },
      derivate,
    ],
    faqs: [
      allgemeineFaq,
      {
        q: "Warum zeigt das Video Scalable Capital?",
        a: "Das Video zeigt die Einrichtung am Beispiel Scalable. Kontoeröffnung, Ausweis bestätigen, Zinsangebote ablehnen und erste Anlage wählen laufen beim S Broker genauso ab, nur die Menüs heißen anders.",
      },
      boerseFaq,
    ],
  },
];

export const findStartPartner = (kurzname?: string): StartPartner | undefined =>
  startPartner.find((p) => p.kurzname === (kurzname ?? "scalable"));
