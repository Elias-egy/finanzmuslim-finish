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

export type StartArt = "depot" | "girokonto";

export type StartPartner = {
  kurzname: string;
  anbieter: string;
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
  /** Nur Girokonten: Schritte statt Video. */
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
    kurzname: "scalable",
    anbieter: "Scalable Capital",
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
    art: "depot",
    pfad: "/dein-investmentstart/traders-place",
    link: "https://c.neqty.net/trck/eclick/5a4b0eecd844504b7de215a0b61bfb55",
    titel: ["In wenigen Minuten steht dein", "Halal-Depot bei Traders Place."],
    knopf: "Depot eröffnen →",
    videoHinweis: true,
    chips: ["Aktien", "ETFs", "Gold", "Sukuk"],
    fakten: [
      {
        titel: "Alle Halal-Anlagen aus unserer Liste",
        text: "Laut der Wertpapiersuche von Traders Place sind alle 12 Halal-ETFs und Fonds, alle 3 Sukuk und alle 8 Gold- und Silber-ETCs aus unserem Vergleich handelbar.",
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
    art: "depot",
    pfad: "/dein-investmentstart/dkb-depot",
    link: "https://c.neqty.net/trck/eclick/175512c2679834b04880de5a3394ea36",
    titel: ["In wenigen Minuten steht dein", "Halal-Depot bei der DKB."],
    knopf: "Depot eröffnen →",
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
    art: "depot",
    pfad: "/dein-investmentstart/finvesto",
    link: "https://c.neqty.net/trck/eclick/ca16f02d65f99bd7e0a84991894b75e3",
    titel: ["Dein Fondsdepot", "bei finvesto."],
    knopf: "Depot eröffnen →",
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
    art: "girokonto",
    pfad: "/dein-investmentstart/dkb-girokonto",
    link: "https://c.neqty.net/trck/eclick/79bc49b9d70debbb2d943925ed126d17",
    titel: ["Dein zinsfreies Girokonto", "bei der DKB."],
    knopf: "Konto eröffnen →",
    videoHinweis: false,
    chips: ["0 € Kontoführung", "Visa-Debitkarte", "Apple Pay", "Kontowechsel"],
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
        titel: "Kontoführung 0 €",
        text: "Keine Kontoführungsgebühr, weltweit an rund 49.750 Automaten Geld abheben, Kontowechsel-Service inklusive.",
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
    art: "girokonto",
    pfad: "/dein-investmentstart/n26",
    link: "https://c.neqty.net/trck/eclick/d7289e91a9dbd189bedb781dc15f3a41",
    titel: ["Dein zinsfreies Girokonto", "bei N26."],
    knopf: "Konto eröffnen →",
    videoHinweis: false,
    chips: ["0 € Kontoführung", "Mastercard", "Apple Pay", "Kein Dispo ab Start"],
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
        titel: "Kontoführung 0 €",
        text: "Das Standard-Konto kostet nichts, zwei Abhebungen im Monat sind inklusive.",
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
        q: "Ist ein Girokonto überhaupt halal?",
        a: "Ein Girokonto ohne Zinsen und ohne genutzten Kredit ist nach den gängigen Gelehrten-Standards erlaubt. Entscheidend sind die 2 Regeln aus der Checkliste.",
      },
    ],
  },
  {
    kurzname: "bbbank",
    anbieter: "BBBank",
    art: "girokonto",
    pfad: "/dein-investmentstart/bbbank",
    link: "https://c.neqty.net/trck/eclick/5a913135bf2744d85558983a6eb6625b",
    titel: ["Dein zinsfreies Girokonto", "bei der BBBank."],
    knopf: "Konto eröffnen →",
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
];

export const findStartPartner = (kurzname?: string): StartPartner | undefined =>
  startPartner.find((p) => p.kurzname === (kurzname ?? "scalable"));
