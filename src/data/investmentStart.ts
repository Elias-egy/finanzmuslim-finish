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
 * die drei Schritte zur Kontoeröffnung. Steuersoftware (art "steuer") zeigt
 * drei Schritte zur Erklärung und hat keine Halal-Merkmale.
 */

export type StartArt = "depot" | "girokonto" | "krypto" | "steuer";

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
  /**
   * Pflichthinweis aus den Teilnahmebedingungen des Partnerprogramms (justTRADE, Finst).
   * Steht wörtlich und in Textgröße unter den Fakten.
   */
  pflichthinweis?: string;
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
    kurzname: "smartsteuer",
    anbieter: "smartsteuer",
    kurz: "smartsteuer",
    domain: "smartsteuer.de",
    markenfarbe: "#5F6FFF",
    art: "steuer",
    pfad: "/dein-investmentstart/smartsteuer",
    link: "https://www.awin1.com/cread.php?awinmid=15043&awinaffid=3099915&clickref={SUBID}",
    titel: ["Deine Steuererklärung,", "auch mit Kapitalerträgen."],
    knopf: "Bei smartsteuer starten \u2192",
    videoHinweis: false,
    chips: ["Anlage KAP", "Zahlen erst bei Abgabe", "Auch am Handy", "Daten vom Finanzamt"],
    schritte: [
      { titel: "Im Browser starten", text: "smartsteuer läuft direkt im Browser, auch am Handy, ohne Download." },
      { titel: "Daten vom Finanzamt abholen", text: "Im Bereich „vorausgefüllte Steuererklärung“ holst du die Daten ab, die dem Finanzamt schon vorliegen." },
      { titel: "Erstattung sehen, dann abgeben", text: "Bezahlt wird erst im Bereich Abgabe, also am Ende." },
    ],
    fakten: [
      {
        titel: "Kapitalerträge inklusive",
        text: "Laut smartsteuer unterstützt das Programm unter anderem Kapitalanleger, Vermieter und Selbständige. Dividenden und Gewinne aus Verkäufen trägst du in die Anlage KAP ein.",
      },
      {
        titel: "Zahlen erst bei Abgabe",
        text: "Du füllst alles aus und siehst deine Erstattung, bevor du bezahlst. Der Preis liegt bei 39,99 € je Steuerjahr, inklusive Mehrwertsteuer.",
      },
      {
        titel: "Bis zu fünf Abgaben",
        text: "Eine Lizenz gilt für fünf Abgaben im selben Steuerjahr. Geteilt mit der Familie sind das rund 8 € je Person.",
      },
    ],
    checklisteTitel: ["2 Punkte für deine Erträge", "in der Steuererklärung"],
    checkliste: [
      {
        titel: "Auslandsdepot: Die Anlage KAP füllst du selbst aus.",
        text: "Ausländische Broker führen keine deutsche Abgeltungsteuer ab. Zinsen, Dividenden und Verkaufsgewinne trägst du selbst ein.",
      },
      {
        titel: "Krypto zählt anders als Aktien.",
        text: "Gewinne aus Krypto sind private Veräußerungsgeschäfte, keine Kapitalerträge. Nach einem Jahr Haltedauer sind sie steuerfrei, davor nicht.",
      },
    ],
    faqs: [
      allgemeineFaq,
      {
        q: "Gibt es kostenlose Alternativen?",
        a: "Ja. Mein ELSTER und CHECK24 Steuer kosten nichts. Im Steuersoftware-Vergleich stehen beide neben smartsteuer, mit Preis, Kapitalerträgen und Zahlungszeitpunkt.",
      },
      {
        q: "Wann zahle ich bei smartsteuer?",
        a: "Erst im Bereich Abgabe. Vorher füllst du alles aus und siehst, was zurückkommt. Bezahlen geht per PayPal, Lastschrift oder Karte.",
      },
    ],
  },
  {
    kurzname: "wiso-steuer",
    anbieter: "WISO Steuer",
    kurz: "WISO Steuer",
    domain: "buhl.de",
    markenfarbe: "#023E84",
    art: "steuer",
    pfad: "/dein-investmentstart/wiso-steuer",
    link: "https://www.awin1.com/cread.php?awinmid=17387&awinaffid=3099915&clickref={SUBID}",
    titel: ["Deine Steuererklärung", "mit Depot-Import."],
    knopf: "Bei WISO Steuer starten \u2192",
    videoHinweis: false,
    chips: ["Anlage KAP", "Zahlen erst bei Abgabe", "Web, App, Download", "Bis zu 5 Erklärungen"],
    schritte: [
      { titel: "Kostenlos ausprobieren", text: "Du kannst alles ausfüllen, bevor du etwas bezahlst." },
      { titel: "Daten vom Finanzamt abrufen", text: "Der Steuer-Abruf füllt deine Erklärung automatisch vor, laut WISO ein kostenloser Service." },
      { titel: "Erst bei der Abgabe bezahlen", text: "Bezahlt wird, wenn du die Erklärung abgibst, per PayPal, Kreditkarte oder Lastschrift." },
    ],
    fakten: [
      {
        titel: "Depot-Daten und Anlage KAP",
        text: "Laut WISO Steuer importiert das Programm deine Depot-Daten automatisch und erledigt die Anlage KAP für dich.",
      },
      {
        titel: "Zahlen erst bei Abgabe",
        text: "Du probierst alles kostenlos aus. Das Vorteils-Abo kostet 35,99 € im Jahr und verlängert sich automatisch, der Einzelkauf 45,99 €.",
      },
      {
        titel: "Auf jedem Gerät",
        text: "WISO Steuer läuft im Web, als Download für Windows und Mac sowie als App für iOS und Android. Eine Lizenz gilt für bis zu 5 Erklärungen.",
      },
    ],
    checklisteTitel: ["2 Punkte für deine Erträge", "in der Steuererklärung"],
    checkliste: [
      {
        titel: "Auslandsdepot: Die Anlage KAP füllst du selbst aus.",
        text: "Ausländische Broker führen keine deutsche Abgeltungsteuer ab. Zinsen, Dividenden und Verkaufsgewinne trägst du selbst ein.",
      },
      {
        titel: "Krypto zählt anders als Aktien.",
        text: "Gewinne aus Krypto sind private Veräußerungsgeschäfte, keine Kapitalerträge. Nach einem Jahr Haltedauer sind sie steuerfrei, davor nicht.",
      },
    ],
    faqs: [
      allgemeineFaq,
      {
        q: "Abo oder Einzelkauf?",
        a: "Das Vorteils-Abo kostet 35,99 € im Jahr und verlängert sich automatisch. Der Einzelkauf kostet 45,99 € und endet nach der Erklärung. Wer nur einmal abgibt, fährt mit dem Einzelkauf besser.",
      },
      {
        q: "Gibt es kostenlose Alternativen?",
        a: "Ja. Mein ELSTER und CHECK24 Steuer kosten nichts. Im Steuersoftware-Vergleich stehen beide neben WISO Steuer, mit Preis, Kapitalerträgen und Zahlungszeitpunkt.",
      },
    ],
  },
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
    kurzname: "scalable-krypto",
    anbieter: "Scalable Capital",
    kurz: "Scalable",
    domain: "scalable.capital",
    markenfarbe: "#22DFCF",
    art: "krypto",
    pfad: "/dein-investmentstart/scalable-krypto",
    link: "https://partner.scalable-capital.de/go.cgi?pid=1017&wmid=250&cpid=1&prid=1&subid={SUBID}&target=Trading-Broker-M",
    risikoUrl: "https://de.scalable.capital/risiko",
    titel: ["In 10 Minuten steht", "dein Krypto-Zugang."],
    knopf: "Bei Scalable starten →",
    videoHinweis: false,
    chips: ["Krypto-ETPs", "32 Kryptowährungen", "Sparplan ab 1 €", "Ohne Wallet"],
    schritte: [
      { titel: "Depot eröffnen", text: "Krypto läuft bei Scalable über ETPs im Scalable Broker, im selben Depot wie Aktien und ETFs." },
      { titel: "Preismodell wählen", text: "FREE: 0,99 € je Trade und 0,99 % Aufschlag auf den Spread. PRIME+: 4,99 € im Monat, Trades ab 250 € kostenlos, 0,69 % Aufschlag." },
      { titel: "Erste Anteile kaufen", text: "Sparpläne gehen ab 1 €, jede Sparplanausführung kostet 0 €." },
    ],
    fakten: [
      {
        titel: "Keine echten Coins",
        text: "Scalable bietet Krypto nur als ETPs an. Das sind Wertpapiere eines Emittenten, die den Kurs abbilden. Die Coins dahinter verwahrt der Emittent, eine eigene Wallet hast du nicht.",
      },
      {
        titel: "32 Kryptowährungen",
        text: "Bitcoin, Ethereum, Solana und weitere, zusammen 32 Kryptowährungen als ETPs.",
      },
      {
        titel: "Handel zu Börsenzeiten",
        text: "ETPs laufen über regulierte Börsen. Kaufen und verkaufen geht nur, solange die Börse offen ist, nicht rund um die Uhr.",
      },
    ],
    checklisteTitel: ["3 Regeln halten dein Scalable-Krypto", "riba-frei"],
    checkliste: [
      {
        titel: "Tagesgeldkonto nicht aktivieren.",
        text: "Das separate Tagesgeld bringt Zinsen (Riba). Einfach nie aktivieren.",
      },
      {
        titel: "ETPs ohne Staking nehmen.",
        text: "Manche Krypto-ETPs zahlen Staking Rewards von 3 bis 5 % im Jahr. Nimm die Variante ohne Staking.",
      },
      derivate,
    ],
    faqs: [
      allgemeineFaq,
      {
        q: "Sind Krypto-ETPs dasselbe wie echte Coins?",
        a: "Nein. Du kaufst ein Wertpapier des Emittenten, rechtlich eine Inhaberschuldverschreibung. Geht der Emittent pleite und reicht die Besicherung nicht, kann das Geld weg sein. Wer echte Coins will, nimmt einen Anbieter mit eigener Wallet.",
      },
      {
        q: "Warum ist hier kein Video?",
        a: "Das Einrichtungsvideo zeigt ein Depot. Für Krypto sind es drei Schritte, die oben stehen: Depot eröffnen, Preismodell wählen, erste Anteile kaufen.",
      },
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
    kurzname: "traders-place-krypto",
    anbieter: "Traders Place",
    kurz: "Traders Place",
    domain: "tradersplace.de",
    markenfarbe: "#12A391",
    art: "krypto",
    pfad: "/dein-investmentstart/traders-place-krypto",
    link: "https://c.neqty.net/trck/eclick/5a4b0eecd844504b7de215a0b61bfb55",
    titel: ["In 10 Minuten steht", "dein Krypto-Konto."],
    knopf: "Bei Traders Place starten →",
    videoHinweis: false,
    chips: ["Echte Coins", "59 Kryptowerte", "24/7 Handel", "Wallet im Depot"],
    schritte: [
      { titel: "Depot eröffnen", text: "Krypto läuft bei Traders Place im selben Depot wie Aktien und ETFs." },
      { titel: "Wallet freischalten", text: "In der App oder im Web-Portal schaltest du die Krypto-Wallet mit wenigen Klicks frei. Sie ist Teil deines Depots." },
      { titel: "Erste Coins kaufen", text: "Je Order 0,9 % vom Kurswert. Unter 500 € kommt 1 € Zuschlag dazu." },
    ],
    fakten: [
      {
        titel: "Echte Coins, verwahrt in Deutschland",
        text: "Du kaufst echte Kryptowerte, verwahrt bei der Tangany GmbH unter BaFin-Aufsicht. Auf eine eigene Wallet übertragen kannst du sie nicht.",
      },
      {
        titel: "Ohne Zinsen",
        text: "Das Verrechnungskonto hat laut Preisverzeichnis 0 % Guthabenzins.",
      },
      {
        titel: "Nur mit Wohnsitz in Deutschland",
        text: "Den Kryptohandel bietet Traders Place derzeit nur Kunden mit Wohnsitz in Deutschland an.",
      },
    ],
    checklisteTitel: ["2 Regeln halten dein Traders-Place-Konto", "riba-frei"],
    checkliste: [
      {
        titel: "Kein Tagesgeld dazubuchen.",
        text: "Traders Place bietet zusätzlich ein verzinstes Tagesgeld an. Das Depot funktioniert ohne. Einfach nicht abschließen.",
      },
      {
        titel: "Keine Derivate auf Kryptos.",
        text: "Traders Place führt auch Zertifikate und Optionsscheine. Kauf den Coin selbst, kein Papier auf den Kurs.",
      },
    ],
    faqs: [
      allgemeineFaq,
      {
        q: "Warum ist hier kein Video?",
        a: "Das Einrichtungsvideo zeigt ein Depot. Bei Traders Place sind es drei Schritte, die oben stehen: Depot eröffnen, Wallet freischalten, erste Coins kaufen.",
      },
      {
        q: "Kann ich meine Coins auf eine eigene Wallet holen?",
        a: "Nein. Laut Preisverzeichnis von Traders Place ist die Ein- oder Auslieferung auf eigene Wallets nicht möglich. Wer seine Coins selbst verwahren will, braucht einen Anbieter mit Auszahlung.",
      },
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
  {
    kurzname: "consorsbank-depot",
    anbieter: "Consorsbank",
    kurz: "Consorsbank",
    domain: "consorsbank.de",
    markenfarbe: "#0AD0DD",
    art: "depot",
    pfad: "/dein-investmentstart/consorsbank-depot",
    link: "https://www.financeads.net/tc.php?t=87591C15240776T",
    titel: ["In 10 Minuten steht", "dein Halal-Depot."],
    knopf: "Bei Consorsbank eröffnen →",
    videoHinweis: true,
    chips: ["Aktien", "ETFs", "Sukuk", "Sparpläne ab 10 €"],
    fakten: [
      {
        titel: "Verrechnungskonto ohne Zinsen",
        text: "Die Consorsbank hat uns schriftlich bestätigt: Guthaben auf dem Verrechnungskonto wird nicht verzinst.",
      },
      {
        titel: "Halal-Anlagen kaufbar",
        text: "11 von 12 Halal-ETFs und Fonds unserer Liste, alle 3 Sukuk-Fonds und alle 7 Gold- und Silber-Anlagen sind bei der Consorsbank kaufbar.",
      },
      {
        titel: "Keine Depotgebühr",
        text: "Die Depotführung kostet nichts, ETF-Sparpläne laufen kostenlos ab 10 €. Eine Order kostet 4,95 € plus 0,25 %, mindestens 9,95 €.",
      },
    ],
    checklisteTitel: ["2 Regeln halten dein Consorsbank-Depot", "riba-frei"],
    checkliste: [
      {
        titel: "Tagesgeld leer lassen, keinen Wertpapierkredit nutzen.",
        text: "Mit dem Depot eröffnet die Consorsbank ein Tagesgeldkonto, ohne Guthaben darauf fallen laut Consorsbank keine Zinsen an. Der Wertpapierkredit kostet 7,55 % Zinsen im Jahr, das Depot funktioniert ohne.",
      },
      derivate,
    ],
    faqs: [
      allgemeineFaq,
      {
        q: "Warum zeigt das Video Scalable Capital?",
        a: "Das Video zeigt die Einrichtung am Beispiel Scalable. Kontoeröffnung, Ausweis bestätigen, Zinsangebote ablehnen und erste Anlage wählen laufen bei der Consorsbank genauso ab, nur die Menüs heißen anders.",
      },
      {
        q: "Die Consorsbank wirbt mit Tagesgeld-Zinsen. Was heißt das für mich?",
        a: "Das Tagesgeldkonto ist ein eigenes Konto neben dem Verrechnungskonto. Zahlst du dort nichts ein, bekommst du keine Zinsen, das hat die Consorsbank am 24.09.2026 schriftlich bestätigt.",
      },
      boerseFaq,
    ],
  },
  {
    kurzname: "consorsbank-girokonto",
    anbieter: "Consorsbank",
    kurz: "Consorsbank",
    domain: "consorsbank.de",
    markenfarbe: "#0AD0DD",
    art: "girokonto",
    pfad: "/dein-investmentstart/consorsbank-girokonto",
    link: "https://www.financeads.net/tc.php?t=87591C15273616T",
    titel: ["Dein zinsfreies", "Girokonto."],
    knopf: "Bei Consorsbank eröffnen →",
    videoHinweis: false,
    chips: ["Visa Debit 0 €", "Girocard 0 €", "Apple Pay", "Kein Dispo ab Start"],
    schritte: [
      { titel: "Antrag online ausfüllen", text: "Das Girokonto eröffnest du komplett online." },
      { titel: "Per Video-, Post- oder E-Ident bestätigen", text: "Ausweis in die Kamera halten, in der Postfiliale vorzeigen oder mit dem Online-Ausweis bestätigen." },
      { titel: "Loslegen", text: "Die Visa Debitkarte kommt per Post, danach Apple Pay einrichten." },
    ],
    fakten: [
      {
        titel: "Guthaben ohne Zinsen",
        text: "Laut Consorsbank wird Guthaben auf dem Girokonto aktuell nicht verzinst.",
      },
      {
        titel: "Kein Dispo ab Start",
        text: "Einen Dispo gibt es erst, wenn du ihn beantragst und die Bank ihn genehmigt. Die Visa Karte ist eine Debitkarte und bucht direkt vom Konto ab.",
      },
      {
        titel: "Kostenlos ab 700 € Geldeingang",
        text: "Bei mindestens 700 € Geldeingang im Monat oder unter 31 Jahren kostet die Kontoführung nichts, sonst 4 €.",
      },
    ],
    checklisteTitel: ["2 Regeln halten dein Consorsbank-Konto", "riba-frei"],
    checkliste: [
      {
        titel: "Keinen Dispo beantragen.",
        text: "Ein Dispo kostet Zinsen. Einfach nicht beantragen, das Konto funktioniert ohne.",
      },
      {
        titel: "Nicht ins Minus rutschen.",
        text: "Auch ohne Dispo kann ein geduldetes Minus Zinsen kosten. Behalte deinen Kontostand im Blick, bevor Lastschriften abgehen.",
      },
    ],
    faqs: [
      allgemeineFaq,
      {
        q: "Welche Karte gehört zum Konto?",
        a: "Der Link führt auf das Girokonto mit Visa Debitkarte. Sie bucht direkt vom Konto ab, eine Kreditkarte brauchst du nicht.",
      },
      {
        q: "Ist ein Girokonto überhaupt halal?",
        a: "Ein Girokonto ohne Zinsen und ohne genutzten Kredit ist nach den gängigen Gelehrten-Standards erlaubt. Entscheidend sind die 2 Regeln aus der Checkliste.",
      },
    ],
  },
  {
    kurzname: "deutsche-bank-aktivkonto",
    anbieter: "Deutsche Bank",
    kurz: "Deutsche Bank",
    domain: "deutsche-bank.de",
    markenfarbe: "#0018A8",
    art: "girokonto",
    pfad: "/dein-investmentstart/deutsche-bank-aktivkonto",
    link: "https://www.financeads.net/tc.php?t=87591C472101924T",
    titel: ["Dein zinsfreies", "Girokonto."],
    knopf: "Bei Deutsche Bank eröffnen →",
    videoHinweis: false,
    chips: ["Filialen", "Girocard 0 €", "Apple Pay", "Kein Dispo ab Start"],
    schritte: [
      { titel: "AktivKonto wählen", text: "Der Link führt auf die Konten der Deutschen Bank. Wähle dort das AktivKonto und fülle den Antrag aus." },
      { titel: "Per Video- oder Post-Ident bestätigen", text: "Ausweis in die Kamera halten oder in der Postfiliale vorzeigen." },
      { titel: "Loslegen", text: "Die Deutsche Bank Card kommt per Post, danach Apple Pay einrichten." },
    ],
    fakten: [
      {
        titel: "Guthaben ohne Zinsen",
        text: "Der Preisaushang nennt für Guthaben auf persönlichen Konten 0,00 %.",
      },
      {
        titel: "Kein Dispo ab Start",
        text: "Den Dispo musst du eigens im Online-Banking oder in der App beantragen. Die Deutsche Bank Card bucht direkt vom Konto ab.",
      },
      {
        titel: "6,90 € im Monat",
        text: "Die Kontoführung kostet 6,90 € im Monat. Dafür hast du Filialen und zahlst Bargeld am Schalter kostenlos ein.",
      },
    ],
    checklisteTitel: ["2 Regeln halten dein Deutsche-Bank-Konto", "riba-frei"],
    checkliste: [
      {
        titel: "Keinen Dispo beantragen.",
        text: "Ein Dispo kostet Zinsen. Einfach nicht beantragen, das Konto funktioniert ohne.",
      },
      {
        titel: "Nicht ins Minus rutschen.",
        text: "Auch ohne Dispo kann ein geduldetes Minus Zinsen kosten. Behalte deinen Kontostand im Blick, bevor Lastschriften abgehen.",
      },
    ],
    faqs: [
      allgemeineFaq,
      {
        q: "Warum AktivKonto und nicht BestKonto?",
        a: "Bewertet haben wir das AktivKonto. Der Link führt auf die Kontenübersicht der Deutschen Bank, dort wählst du es aus.",
      },
      {
        q: "Ist ein Girokonto überhaupt halal?",
        a: "Ein Girokonto ohne Zinsen und ohne genutzten Kredit ist nach den gängigen Gelehrten-Standards erlaubt. Entscheidend sind die 2 Regeln aus der Checkliste.",
      },
    ],
  },
  {
    kurzname: "maxblue-depot",
    anbieter: "maxblue",
    kurz: "maxblue",
    domain: "maxblue.de",
    markenfarbe: "#0018A8",
    art: "depot",
    pfad: "/dein-investmentstart/maxblue-depot",
    link: "https://www.financeads.net/tc.php?t=87591C47285472T",
    titel: ["In 10 Minuten steht", "dein Halal-Depot."],
    knopf: "Bei maxblue eröffnen →",
    videoHinweis: true,
    chips: ["Aktien", "ETFs", "0 € Depotgebühr", "Depot der Deutschen Bank"],
    fakten: [
      {
        titel: "Depotkonto ohne Zinsen",
        text: "Die Deutsche Bank hat uns am 23.09.2026 schriftlich bestätigt: Das maxblue Depotkonto wird momentan nicht verzinst.",
      },
      {
        titel: "Keine Depotgebühr",
        text: "Die Depotführung kostet nichts. Eine Order kostet 2 € plus 0,25 %, mindestens 10,90 €.",
      },
      {
        titel: "Halal-Anlagen",
        text: "Welche Anlagen aus unserer Halal-Liste bei maxblue kaufbar sind, prüfen wir gerade Anlage für Anlage.",
      },
    ],
    checklisteTitel: ["2 Regeln halten dein maxblue-Depot", "riba-frei"],
    checkliste: [
      {
        titel: "Keine Zinsangebote annehmen.",
        text: "Bietet dir maxblue später Zinsen, Tagesgeld oder einen Kredit an, lehne ab. Dein Depot funktioniert ohne.",
      },
      derivate,
    ],
    faqs: [
      allgemeineFaq,
      {
        q: "Warum zeigt das Video Scalable Capital?",
        a: "Das Video zeigt die Einrichtung am Beispiel Scalable. Kontoeröffnung, Ausweis bestätigen, Zinsangebote ablehnen und erste Anlage wählen laufen bei maxblue genauso ab, nur die Menüs heißen anders.",
      },
      boerseFaq,
    ],
  },
  {
    kurzname: "justtrade",
    anbieter: "justTRADE",
    kurz: "justTRADE",
    domain: "justtrade.com",
    markenfarbe: "#2F3B47",
    art: "depot",
    pfad: "/dein-investmentstart/justtrade",
    link: "https://www.financeads.net/tc.php?t=87591C326261718T",
    pflichthinweis: "Investitionen in Wertpapiere bergen Verlustrisiken.",
    titel: ["In 10 Minuten steht", "dein Halal-Depot."],
    knopf: "Bei justTRADE eröffnen →",
    videoHinweis: true,
    chips: ["Aktien", "ETFs", "ETF-Sparpläne 0 €", "0 € Depotgebühr"],
    fakten: [
      {
        titel: "Guthaben ohne Zinsen",
        text: "Das Preisverzeichnis nennt für Guthaben auf dem Verrechnungskonto 0,00 % Zins.",
      },
      {
        titel: "Halal-Anlagen kaufbar",
        text: "6 von 12 Halal-ETFs und Fonds unserer Liste, 2 von 3 Sukuk-Fonds und 5 von 7 Gold- und Silber-Anlagen sind bei justTRADE kaufbar.",
      },
      {
        titel: "Keine Depotgebühr",
        text: "Das Depot kostet nichts, eine Order kostet 1 € zzgl. marktüblicher Spreads. ETF-Sparpläne laufen kostenlos ab 25 € im Monat.",
      },
    ],
    checklisteTitel: ["2 Regeln halten dein justTRADE-Depot", "riba-frei"],
    checkliste: [
      {
        titel: "Keine Zinsangebote annehmen.",
        text: "Bietet dir justTRADE später Zinsen an, lehne ab. Dein Depot funktioniert ohne.",
      },
      derivate,
    ],
    faqs: [
      allgemeineFaq,
      {
        q: "Warum zeigt das Video Scalable Capital?",
        a: "Das Video zeigt die Einrichtung am Beispiel Scalable. Kontoeröffnung, Ausweis bestätigen, Zinsangebote ablehnen und erste Anlage wählen laufen bei justTRADE genauso ab, nur die Menüs heißen anders.",
      },
      boerseFaq,
    ],
  },
  {
    kurzname: "justtrade-krypto",
    anbieter: "justTRADE",
    kurz: "justTRADE",
    domain: "justtrade.com",
    markenfarbe: "#2F3B47",
    art: "krypto",
    pfad: "/dein-investmentstart/justtrade-krypto",
    link: "https://www.financeads.net/tc.php?t=87591C326261718T",
    pflichthinweis: "Investitionen in Wertpapiere bergen Verlustrisiken.",
    titel: ["In 10 Minuten steht", "dein Krypto-Konto."],
    knopf: "Bei justTRADE starten →",
    videoHinweis: false,
    chips: ["Echte Coins", "74+ Coins", "Sparplan", "MiCA-Lizenz"],
    schritte: [
      { titel: "Konto eröffnen", text: "Krypto handelst du über dein justTRADE-Konto. Bestätigen per Video-, Post- oder E-Ident." },
      { titel: "Verwahrung freischalten", text: "Für deine Coins schließt du einen eigenen Verwahrvertrag mit der Tangany GmbH ab. Er kostet nichts." },
      { titel: "Erste Coins kaufen", text: "Der Mindestbetrag je Kauf liegt bei 50 €. Staking bleibt aus, solange du es nicht selbst aktivierst." },
    ],
    fakten: [
      {
        titel: "Echte Coins, verwahrt in München",
        text: "Du kaufst echte Coins, verwahrt bei der Tangany GmbH in München. Auf eine eigene Wallet übertragen kannst du sie nicht.",
      },
      {
        titel: "Ohne Zinsen",
        text: "justTRADE hat uns schriftlich bestätigt: Es gibt keine Zinsen auf Guthaben und kein automatisches Staking.",
      },
      {
        titel: "Keine Verwahrgebühr",
        text: "Konto, Depot und Verwahrung der Coins kosten nichts. Sparpläne sind möglich.",
      },
    ],
    checklisteTitel: ["2 Regeln halten dein justTRADE-Konto", "riba-frei"],
    checkliste: [
      {
        titel: "Staking aus lassen.",
        text: "Staking startet bei justTRADE nur, wenn du es selbst aktivierst. Lass es aus, dann bleiben deine Coins ohne Zins.",
      },
      derivate,
    ],
    faqs: [
      allgemeineFaq,
      {
        q: "Warum ist hier kein Video?",
        a: "Das Einrichtungsvideo zeigt ein Depot. Bei justTRADE sind es drei Schritte, die oben stehen: Konto eröffnen, Verwahrung freischalten, erste Coins kaufen.",
      },
      {
        q: "Kann ich meine Coins auf eine eigene Wallet holen?",
        a: "Nein. Laut justTRADE ist die Auslieferung von Kryptowerten nicht möglich. Wer seine Coins selbst verwahren will, braucht einen Anbieter mit Auszahlung.",
      },
    ],
  },
  {
    kurzname: "norisbank",
    anbieter: "norisbank",
    kurz: "norisbank",
    domain: "norisbank.de",
    markenfarbe: "#F26522",
    art: "girokonto",
    pfad: "/dein-investmentstart/norisbank",
    link: "https://www.financeads.net/tc.php?t=87591C127132812T",
    titel: ["Dein zinsfreies", "Girokonto."],
    knopf: "Bei norisbank eröffnen →",
    videoHinweis: false,
    chips: ["Debitkarte 0 €", "Girocard 0 €", "Apple Pay", "Online-Konto"],
    schritte: [
      { titel: "Antrag online ausfüllen", text: "Das Top-Girokonto ist ein Online-Konto, du eröffnest es ohne Filiale." },
      { titel: "Per Video- oder Post-Ident bestätigen", text: "Ausweis in die Kamera halten oder in der Postfiliale vorzeigen." },
      { titel: "Loslegen", text: "Die Karte kommt per Post, danach Apple Pay einrichten." },
    ],
    fakten: [
      {
        titel: "Guthaben ohne Zinsen",
        text: "Das Top-Girokonto bringt keine Zinsen. Das Top-Zinskonto, das Neukunden dazu erhalten, ist ein eigenes Konto und bleibt ohne Einzahlung leer.",
      },
      {
        titel: "Kostenlos ab 500 € Geldeingang",
        text: "Bei mindestens 500 € Geldeingang im Monat oder unter 30 Jahren kostet die Kontoführung nichts, sonst 3,90 €.",
      },
      {
        titel: "Sofort-Dispo bis 500 €",
        text: "Die Bank wirbt mit einem Sofort-Dispo bis 500 €, in den Vertragsbedingungen steht er nur auf Antrag. Im Vergleich zählt das Konto deshalb als Konto mit Dispo.",
      },
    ],
    checklisteTitel: ["2 Regeln halten dein norisbank-Konto", "riba-frei"],
    checkliste: [
      {
        titel: "Dispo und Top-Zinskonto nicht nutzen.",
        text: "Ein Dispo kostet Zinsen, das Top-Zinskonto bringt Zinsen. Das Girokonto funktioniert ohne beides.",
      },
      {
        titel: "Nicht ins Minus rutschen.",
        text: "Behalte deinen Kontostand im Blick, bevor Lastschriften abgehen. Ein Minus kostet Zinsen.",
      },
    ],
    faqs: [
      allgemeineFaq,
      {
        q: "Warum Top-Girokonto und nicht Girokonto plus?",
        a: "Das Girokonto plus verzinst Guthaben, deshalb raten wir davon ab. Der Link führt direkt auf das Top-Girokonto.",
      },
      {
        q: "Ist ein Girokonto überhaupt halal?",
        a: "Ein Girokonto ohne Zinsen und ohne genutzten Kredit ist nach den gängigen Gelehrten-Standards erlaubt. Entscheidend sind die 2 Regeln aus der Checkliste.",
      },
    ],
  },
  {
    kurzname: "smartbroker",
    anbieter: "Smartbroker+",
    kurz: "Smartbroker+",
    domain: "smartbrokerplus.de",
    markenfarbe: "#80FF04",
    art: "depot",
    pfad: "/dein-investmentstart/smartbroker",
    link: "https://www.financeads.net/tc.php?t=87591C296855636T",
    titel: ["In 10 Minuten steht", "dein Halal-Depot."],
    knopf: "Bei Smartbroker+ eröffnen →",
    videoHinweis: true,
    chips: ["Aktien", "ETFs", "Sukuk", "Sparpläne ab 1 €"],
    fakten: [
      {
        titel: "Verrechnungskonto ohne Zinsen",
        text: "Laut Konditionen gibt es Guthabenzinsen nur auf dem separaten Zinskonto. Das musst du eigens eröffnen.",
      },
      {
        titel: "Halal-Anlagen kaufbar",
        text: "Mindestens 8 von 12 Halal-ETFs und Fonds unserer Liste, alle 3 Sukuk-Fonds und alle 7 Gold- und Silber-Anlagen sind bei Smartbroker+ kaufbar.",
      },
      {
        titel: "Keine Depotgebühr",
        text: "Die Depotführung kostet nichts. ETF- und Aktien-Sparpläne laufen kostenlos ab 1 € im Monat.",
      },
    ],
    checklisteTitel: ["2 Regeln halten dein Smartbroker+-Depot", "riba-frei"],
    checkliste: [
      {
        titel: "Kein Zinskonto eröffnen.",
        text: "Smartbroker+ bietet ein Zinskonto mit Guthabenzins an. Eröffne es nicht, dein Depot funktioniert ohne.",
      },
      derivate,
    ],
    faqs: [
      allgemeineFaq,
      {
        q: "Warum zeigt das Video Scalable Capital?",
        a: "Das Video zeigt die Einrichtung am Beispiel Scalable. Kontoeröffnung, Ausweis bestätigen, Zinsangebote ablehnen und erste Anlage wählen laufen bei Smartbroker+ genauso ab, nur die Menüs heißen anders.",
      },
      boerseFaq,
    ],
  },
  {
    kurzname: "smartbroker-krypto",
    anbieter: "Smartbroker+",
    kurz: "Smartbroker+",
    domain: "smartbrokerplus.de",
    markenfarbe: "#80FF04",
    art: "krypto",
    pfad: "/dein-investmentstart/smartbroker-krypto",
    link: "https://www.financeads.net/tc.php?t=87591C2968124479T",
    titel: ["In 10 Minuten steht", "dein Krypto-Konto."],
    knopf: "Bei Smartbroker+ starten →",
    videoHinweis: false,
    chips: ["Echte Coins", "39+ Coins", "Sparplan", "MiCA-Lizenz"],
    schritte: [
      { titel: "Depot eröffnen", text: "Krypto handelst du über dein Smartbroker+-Depot. Bestätigen per Video-, Post- oder E-Ident." },
      { titel: "Zinskonto weglassen", text: "Das Zinskonto ist freiwillig. Lass es weg, dann bleibt dein Guthaben ohne Zins." },
      { titel: "Erste Coins kaufen", text: "Der Mindestbetrag je Kauf liegt bei 0,01 €." },
    ],
    fakten: [
      {
        titel: "Echte Coins",
        text: "Du kaufst echte Coins, kein Zertifikat auf den Kurs. Auf eine eigene Wallet übertragen kannst du sie nicht.",
      },
      {
        titel: "Ohne Zinsen",
        text: "Smartbroker+ hat uns schriftlich bestätigt: Das Verrechnungskonto wird nicht verzinst, das Zinskonto ist freiwillig.",
      },
      {
        titel: "39+ Coins, Sparplan möglich",
        text: "MiCA-Lizenz aus Deutschland, Sparpläne sind möglich. Der Mindestbetrag je Kauf liegt bei 0,01 €.",
      },
    ],
    checklisteTitel: ["2 Regeln halten dein Smartbroker+-Konto", "riba-frei"],
    checkliste: [
      {
        titel: "Kein Zinskonto eröffnen.",
        text: "Smartbroker+ bietet ein Zinskonto mit Guthabenzins an. Eröffne es nicht, dein Konto funktioniert ohne.",
      },
      {
        titel: "Keine Kreditfunktionen nutzen.",
        text: "Smartbroker+ bietet Kreditfunktionen an. Laut Kundenservice funktioniert das Konto ohne.",
      },
    ],
    faqs: [
      allgemeineFaq,
      {
        q: "Warum ist hier kein Video?",
        a: "Das Einrichtungsvideo zeigt ein Depot. Bei Smartbroker+ sind es drei Schritte, die oben stehen: Depot eröffnen, Zinskonto weglassen, erste Coins kaufen.",
      },
      {
        q: "Kann ich meine Coins auf eine eigene Wallet holen?",
        a: "Nein. Laut Smartbroker+ ist eine Übertragung in eine externe Wallet nicht möglich. Wer seine Coins selbst verwahren will, braucht einen Anbieter mit Auszahlung.",
      },
    ],
  },
  {
    kurzname: "umweltbank",
    anbieter: "UmweltBank",
    kurz: "UmweltBank",
    domain: "umweltbank.de",
    markenfarbe: "#0B8A3B",
    art: "girokonto",
    pfad: "/dein-investmentstart/umweltbank",
    link: "https://www.financeads.net/tc.php?t=87591C4946128612T",
    titel: ["Dein zinsfreies", "Girokonto."],
    knopf: "Bei UmweltBank eröffnen →",
    videoHinweis: false,
    chips: ["Debitkarte", "Apple Pay", "Kein Dispo ab Start", "Online-Konto"],
    schritte: [
      { titel: "Antrag online ausfüllen", text: "Das UmweltGiro ist ein Online-Konto, du eröffnest es ohne Filiale." },
      { titel: "Per Video-, Post- oder E-Ident bestätigen", text: "Ausweis in die Kamera halten, in der Postfiliale vorzeigen oder mit dem Online-Ausweis bestätigen." },
      { titel: "Loslegen", text: "Die Karte kommt per Post, danach Apple Pay einrichten." },
    ],
    fakten: [
      {
        titel: "Guthaben ohne Zinsen",
        text: "Laut UmweltBank erhältst du für Geld auf dem Girokonto keine Zinsen.",
      },
      {
        titel: "Kein Dispo ab Start",
        text: "Einen Dispo gibt es nur, wenn du ihn beantragst. Die Karte ist eine Debitkarte und bucht direkt vom Konto ab.",
      },
      {
        titel: "4,90 € im Monat",
        text: "Die Kontoführung kostet 4,90 € im Monat, im Jahr 58,80 €.",
      },
    ],
    checklisteTitel: ["2 Regeln halten dein UmweltBank-Konto", "riba-frei"],
    checkliste: [
      {
        titel: "Bei der Eröffnung keinen Dispo beantragen.",
        text: "Die UmweltBank bietet im Antrag einen Dispokredit von 500 € an. Wähle ihn nicht, das Konto funktioniert ohne.",
      },
      {
        titel: "Nicht ins Minus rutschen.",
        text: "Auch ohne Dispo kann ein geduldetes Minus Zinsen kosten. Behalte deinen Kontostand im Blick, bevor Lastschriften abgehen.",
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
    kurzname: "finst",
    anbieter: "Finst",
    kurz: "Finst",
    domain: "finst.com",
    markenfarbe: "#34C4CC",
    art: "krypto",
    pfad: "/dein-investmentstart/finst",
    link: "https://www.financeads.net/tc.php?t=87591C5710135756T",
    pflichthinweis:
      "Investitionen in Kryptowerte sind mit dem Risiko des Kapitalverlusts verbunden. Kryptowerte sind sehr volatil und du kannst einen Teil oder deine gesamte Investition verlieren. Informiere dich immer selbst, bevor du investierst, und investiere nur Geld, dessen Verlust du dir leisten kannst.",
    titel: ["In 10 Minuten steht", "dein Krypto-Konto."],
    knopf: "Bei Finst starten →",
    videoHinweis: false,
    chips: ["Echte Coins", "Eigene Wallet", "400+ Coins", "MiCA-Lizenz"],
    schritte: [
      { titel: "Konto eröffnen", text: "Registrieren, dann per Foto-Ident mit dem Ausweis bestätigen." },
      { titel: "Staking aus lassen", text: "Staking läuft bei Finst nur, wenn du es selbst aktivierst. Lass es aus, dann bleiben deine Coins ohne Zins." },
      { titel: "Erste Coins kaufen", text: "Ab 0,05 € per Echtzeitüberweisung. Danach auf deine eigene Wallet übertragbar." },
    ],
    fakten: [
      {
        titel: "Echte Coins, keine Zertifikate",
        text: "Du kaufst den Coin selbst und kannst ihn laut Finst auf eine eigene Wallet senden. Kein ETP, kein Zertifikat auf den Kurs.",
      },
      {
        titel: "Ohne Zinsen nutzbar",
        text: "Staking startet bei Finst erst, wenn du es mit einem Klick aktivierst. Lass es aus, dann bleiben deine Coins ohne Zins.",
      },
      {
        titel: "400+ Coins, 0,15 % Gebühr",
        text: "MiCA-Lizenz aus den Niederlanden, laut Finst 0,15 % Gebühr ohne extra Spread. Die Auszahlung von Bitcoin kostet 2,61 €.",
      },
    ],
    checklisteTitel: ["2 Regeln halten dein Finst-Konto", "riba-frei"],
    checkliste: [
      {
        titel: "Staking aus lassen.",
        text: "Finst startet Staking erst, wenn du es selbst aktivierst. Lass den Schalter aus.",
      },
      derivate,
    ],
    faqs: [
      allgemeineFaq,
      {
        q: "Warum ist bei Finst kein Video?",
        a: "Das Einrichtungsvideo zeigt ein Depot. Bei Finst sind es drei Schritte, die oben stehen: Konto eröffnen, Staking aus lassen, erste Coins kaufen.",
      },
      {
        q: "Ist Finst halal nutzbar?",
        a: "Mit den 2 Regeln aus der Checkliste. Du besitzt echte Coins, kannst sie auf deine eigene Wallet holen, und ohne Staking fällt kein Zins an.",
      },
    ],
  },
];

export const findStartPartner = (kurzname?: string): StartPartner | undefined =>
  startPartner.find((p) => p.kurzname === (kurzname ?? "scalable"));
