import type { Farbe } from "@/components/vorlagen/ampelTeile";

/**
 * Der volle Auto-Abo-Check (Plan Opt-in-Strecke P3, Elias 27.09.2026: „auto abo (leasing alternative,
 * natürlich auch mit tiefer recherche, wie FINN oder auch angebote von firmen)“). Nur die volle Fassung
 * `AutoAboCheckVoll.tsx` importiert diese Datei, die offene Seite lädt `autoAboCheckAusschnitt.ts`.
 *
 * Jede Klausel steht wortgleich in den AGB oder auf den Seiten des Anbieters, abgerufen am 27.09.2026.
 * Volltexte und URLs liegen im Vault unter `raw/2026-09-27-auto-abo-agb/`, das Prüfprotokoll in
 * `~/rebrand/P3_GOLD_AUTO_PRUEFUNG.md`. Auf der Seite stehen Ziffer und Stand, aber keine Links
 * (Memory `vergleiche-nur-ergebnis-zeigen`). Partnerprogramme sind nur notiert, nichts beantragt.
 */
export type Thema =
  | "Vertragsart"
  | "Haftung"
  | "Versicherung"
  | "Verzugszins"
  | "Kaution"
  | "Kilometer"
  | "Pauschalen"
  | "Laufzeit"
  | "Kauf";

export type Klausel = {
  thema: Thema;
  /** Ziffer oder Seite, z. B. „AGB Ziffer 12.1“ oder „FAQ“. */
  fundstelle: string;
  /** Wortgleich, Auslassungen als […]. `null`, wenn der Anbieter dazu nichts schreibt. */
  zitat: string | null;
  /** Einordnung in eigenen Worten. */
  hinweis?: string;
};

export type AboAnbieter = {
  id: string;
  name: string;
  unter: string;
  farbe: Farbe;
  urteil: string;
  grund: string;
  preisAb: string;
  /** Vertragsgrundlage, wie sie auf der Seite genannt wird. */
  grundlage: string;
  agbUrl: string;
  klauseln: Klausel[];
};

/** Ein Rechenbeispiel: dasselbe Auto über denselben Zeitraum, nur Beträge. */
export type Rechnung = {
  einleitung: string;
  summeWort: string;
  wege: { name: string; posten: { was: string; betrag: number }[]; hinweis: string }[];
  fazit: string;
  quellen: string;
};

export const anbieter: AboAnbieter[] = [
  {
    id: "finn",
    name: "FINN",
    unter: "Unabhängiger Anbieter, privat und für Firmen",
    farbe: "gruen",
    urteil: "Passt zur zulässigen Miete",
    grund:
      "FINN vermietet und zahlt Haftpflicht, Kfz-Steuer, Wartung und Verschleiß. Du haftest nach den allgemeinen Regeln, also für eigenes Verschulden, und in den AGB stehen weder Verzugszinsen noch ein Kauf.",
    preisAb: "ab 149 Euro im Monat, dazu einmalig 1.500 Euro Bereitstellung (finn.com, 27.09.2026)",
    grundlage: "AGB, Stand 30.09.2025, Gebührenkatalog vom 18.09.2026",
    agbUrl: "https://www.finn.com/de-DE/terms",
    klauseln: [
      {
        thema: "Vertragsart",
        fundstelle: "AGB Ziffer 1.2",
        zitat:
          "Gegenstand der Geschäftsbeziehung ist die entgeltliche Gebrauchsüberlassung von Fahrzeugen (Miete) und die Erbringung von damit in Zusammenhang stehender Zusatzleistungen durch FINN an den Kunden.",
      },
      {
        thema: "Haftung",
        fundstelle: "AGB Ziffer 12.1",
        zitat: "Der Kunde haftet bei Fahrzeugschäden, Fahrzeugverlust und Mietvertragsverletzungen nach den allgemeinen gesetzlichen Bestimmungen.",
        hinweis: "Wartung und Verschleiß zahlt FINN (Ziffer 10.2), normale Abnutzung hast du nicht zu vertreten (Ziffer 12.2).",
      },
      {
        thema: "Versicherung",
        fundstelle: "AGB Ziffer 2.5",
        zitat:
          "Das Mietfahrzeug ist stets angemessen haftpflichtversichert. Der Kunde wird von Schäden am Fahrzeug nach dem Leitbild einer Vollkaskoversicherung mit Selbstbeteiligung freigestellt.",
        hinweis: "Die Höhe der Selbstbeteiligung steht erst in der Vertragsbestätigung.",
      },
      {
        thema: "Verzugszins",
        fundstelle: "AGB Ziffer 5.4",
        zitat:
          "Im Fall einer Rücklastschrift im Rahmen eines Lastschrifteinzuges, die vom Kunden zu vertreten ist, hat der Kunde pauschal eine Rücklastschriftgebühr in der im Gebührenkatalog angegebenen Höhe zu zahlen.",
        hinweis: "Keine Klausel zu Verzugszinsen. Die Rücklastschrift kostet laut Gebührenkatalog 9 Euro.",
      },
      {
        thema: "Kaution",
        fundstelle: "AGB Ziffer 3.3",
        zitat: "FINN behält es sich vor, eine Kaution zu erheben. Die maximale Höhe der Kaution ergibt sich aus dem Gebührenkatalog.",
        hinweis: "Laut Gebührenkatalog höchstens drei Monatsraten, abhängig von der Bonität.",
      },
      {
        thema: "Kilometer",
        fundstelle: "AGB Ziffer 8.6",
        zitat: "Die Erstattung oder Verrechnung nicht genutzter Kilometer des vereinbarten Kilometerpakets ist ausgeschlossen.",
        hinweis: "Der Preis je Mehrkilometer steht in der Vertragsbestätigung.",
      },
      {
        thema: "Pauschalen",
        fundstelle: "AGB Ziffer 9.3",
        zitat:
          "Nach Rücknahme des Mietfahrzeugs werden eventuell entstandene Schäden und Minderwerte, die die üblichen Gebrauchs- und Verschleißspuren überschreiten, durch einen sachkundigen Mitarbeiter von FINN oder einen beauftragten sachkundigen Dritten im Rahmen eines Minderwertgutachtens oder einer Zustandsbewertung bewertet.",
        hinweis: "Gebührenkatalog: Raucherreinigung 299 Euro, versäumter Wartungstermin 99 Euro plus bis zu 20 Prozent Minderwert.",
      },
      {
        thema: "Laufzeit",
        fundstelle: "AGB Ziffer 17.2.1",
        zitat: "Während der vereinbarten fixen Laufzeit ist der Mietvertrag nicht ordentlich kündbar.",
      },
    ],
  },
  {
    id: "sixt",
    name: "SIXT+ Auto Abo",
    unter: "Autovermietung, privat und für Firmen",
    farbe: "gelb",
    urteil: "Aufbau passt, zwei Klauseln haken",
    grund:
      "Sixt vermietet, du haftest nur, wenn du den Schaden zu vertreten hast, und es gibt weder Verzugszinsen noch einen Kauf. Aber Rabatte gelten nur bei pünktlicher Zahlung, wer zu spät zahlt, zahlt also mehr, und die Kaution legt Sixt nicht getrennt vom eigenen Geld an.",
    preisAb: "ab 307 Euro im Monat (Seitentitel sixt.de/plus, 27.09.2026)",
    grundlage: "Abo-AGB, Stand April 2026, und ergänzende Vermietbedingungen, Stand 06.26",
    agbUrl: "https://www.sixt.de/shared/plus/subscription_terms_and_conditions_de_DE.pdf",
    klauseln: [
      {
        thema: "Vertragsart",
        fundstelle: "Abo-AGB B.1",
        zitat: "Der Kunde mietet fix für eine vorab gewählte Festlaufzeit ein Fahrzeug aus der vom Kunden gewählten Fahrzeugkategorie.",
      },
      {
        thema: "Haftung",
        fundstelle: "Vermietbedingungen I.1",
        zitat:
          "Bei Fahrzeugschäden, Fahrzeugverlust und Mietvertragsverletzungen haften der Mieter und/oder der Fahrer grundsätzlich nach den allgemeinen Haftungsregeln. Demnach haften der Mieter und/oder Fahrer dann nicht, wenn sie die Pflichtverletzung nicht zu vertreten haben.",
      },
      {
        thema: "Versicherung",
        fundstelle: "Vermietbedingungen I.2",
        zitat:
          "In diesem Fall haften der Mieter sowie die in den Schutzbereich der vertraglichen Haftungsbefreiung einbezogenen Fahrer je einzelnem Schadenereignis bis zu einem Betrag in Höhe des vereinbarten Selbstbehalts;",
        hinweis:
          "Haftpflicht bis 100 Millionen Euro (F.1). Die Höhe des Selbstbehalts steht nicht in den AGB, dass Steuer und Wartung in der Rate stecken, auch nicht.",
      },
      {
        thema: "Verzugszins",
        fundstelle: "Vermietbedingungen D.1",
        zitat: "Sonderpreise und Preisnachlässe gelten nur für den Fall der fristgerechten Zahlung.",
        hinweis: "Keine Verzugszinsen in den AGB. Aber wer zu spät zahlt, verliert den Rabatt und zahlt damit mehr für dieselbe Leistung.",
      },
      {
        thema: "Kaution",
        fundstelle: "Abo-AGB E.7",
        zitat:
          "Die Höhe der Kaution wird dem Kunden im Rahmen der Buchung angezeigt. SIXT ist nicht verpflichtet, die Sicherheit von ihrem Vermögen getrennt anzulegen. Eine Verzinsung der Sicherheit erfolgt nicht.",
      },
      {
        thema: "Kilometer",
        fundstelle: "Abo-AGB B.2",
        zitat:
          "Hat der Kunde die vertraglich vereinbarten Inklusivkilometer pro 30 Tage-Abrechnungsperiode überschritten, werden dem Kunden die gefahrenen Mehrkilometer entsprechend dem vereinbarten Tarif in Rechnung gestellt, soweit das im Kilometertresor angesammelte Kilometerguthaben nicht zur Begleichung der gefahrenen Mehrkilometer ausreicht.",
      },
      {
        thema: "Pauschalen",
        fundstelle: "Abo-AGB E.1.4",
        zitat:
          "Bringt der Kunde das Fahrzeug nicht spätestens zum Ende der Festlaufzeit zurück, fällt zusätzlich zur Verlängerung des Vertrags gemäß Ziffer E.1.3 eine Servicepauschale (pauschalierter Schadensersatz) in Höhe von EUR 500,00 an.",
        hinweis: "Ebenfalls 500 Euro, wenn ein Fahrzeugtausch an dir scheitert (B.1).",
      },
      {
        thema: "Laufzeit",
        fundstelle: "Abo-AGB E.3.1",
        zitat: "Eine ordentliche Kündigung des Vertrags vor Ablauf der Festlaufzeit ist ausgeschlossen.",
      },
    ],
  },
  {
    id: "vwfs",
    name: "VW FS Private Langzeitmiete",
    unter: "Nachfolger des VW-Abos, 3 oder 6 Monate",
    farbe: "gelb",
    urteil: "Verzugszinsen im Vertrag",
    grund:
      "Vermieterin ist die Euromobil GmbH aus dem VW-Konzern, sie ist Halterin und zahlt Steuer, Wartung und Verschleiß, du haftest bei einfacher Fahrlässigkeit nur bis zur Selbstbeteiligung. Aber die Bedingungen schreiben Verzugszinsen ausdrücklich fest, und Rabatte gelten nur bei pünktlicher Zahlung.",
    preisAb: "ab 729 Euro im Monat für den CUPRA Born bei 6 Monaten (Preisliste vom 01.06.2026)",
    grundlage: "Allgemeine Vermietbedingungen Private Langzeitmiete, Stand 27.05.2026, und Preisliste",
    agbUrl:
      "https://autovermietung.vwfs.de/content/dam/bluelabel/valid/autovermietung-vwfs-de/documents/agb/Allgemeine%20Vermietbedingungen_Private%20Langzeitmiete.pdf",
    klauseln: [
      {
        thema: "Vertragsart",
        fundstelle: "AVB VI. 1.",
        zitat: "a) Das Fahrzeug ist auf die Vermieterin zugelassen. b) Die Vermieterin ist Halterin des Fahrzeuges.",
        hinweis: "Wartung, Verschleiß und Hauptuntersuchung trägt die Vermieterin (XV. 1.).",
      },
      {
        thema: "Haftung",
        fundstelle: "AVB XIII. 1. c.",
        zitat: "Greift die Haftungsreduzierung, haftet der Mieter je Schadenfall auch bei einfacher Fahrlässigkeit nur bis zur Höhe der vertraglich vereinbarten Selbstbeteiligung.",
      },
      {
        thema: "Versicherung",
        fundstelle: "Preisliste, Seite 2",
        zitat:
          "Preise inkl. Haftpflichtschutz, Kaskoschutz mit einer Selbstbeteiligung von 950 €, Zulassungsgebühr, Rundfunkgebühr, Kfz-Steuer, Wartung, Verschleiß, saisonale Bereifung oder Ganzjahresreifen.",
      },
      {
        thema: "Verzugszins",
        fundstelle: "AVB III. 3. a)",
        zitat:
          "Befindet sich der Mieter in Zahlungsverzug, hat er Verzugszinsen in gesetzlicher Höhe zu entrichten. Der Verzugszins beträgt 5%-Punkte über dem Basiszinssatz.",
        hinweis: "Dazu II. 2. a): „Etwaige Sonderpreise und Preisnachlässe gelten nur für den Fall der fristgerechten Zahlung.“",
      },
      {
        thema: "Kaution",
        fundstelle: "AVB II. 2. a)",
        zitat: null,
        hinweis: "Für Privatkunden nennen die Bedingungen keine Kaution, nur allgemein eine vereinbarte Sicherheitsleistung. Für Firmen eine bis drei Monatsmieten.",
      },
      {
        thema: "Kilometer",
        fundstelle: "Preisliste, Seite 2",
        zitat:
          "Gefahrene Kilometer, die über die vertraglich vereinbarte Laufleistung hinausgehen, werden pauschal mit 0,39 € pro Kilometer berechnet.",
      },
      {
        thema: "Pauschalen",
        fundstelle: "AVB V. 2. m) und Preisliste",
        zitat:
          "Darüber hinaus ist der Mieter zur Zahlung einer Sicherstellungspauschale der bei Vertragsschluss geltenden Preisliste „Private Langzeitmiete“",
        hinweis: "Laut Preisliste 1.000 Euro plus Auslagen, Ersatzschlüssel 150 Euro, Mietvertragsänderung 100 Euro.",
      },
      {
        thema: "Laufzeit",
        fundstelle: "AVB II. 1. b) und XVII. 1.",
        zitat:
          "Der Mietvertrag wird für eine feste, nicht verlängerbare Vertragslaufzeit abgeschlossen. […] Die ordentliche Kündigung ist ausgeschlossen.",
      },
    ],
  },
  {
    id: "mocean",
    name: "MOCEAN Auto Abo",
    unter: "Abo von Hyundai und Genesis",
    farbe: "gelb",
    urteil: "Aufbau passt, die Haftung hakt",
    grund:
      "Die Hyundai-Tochter vermietet, Versicherung, Kfz-Steuer und Wartung stecken in der Rate, kaufen kannst du nicht, Verzugszinsen gibt es keine. Aber laut eigener FAQ zahlst du die Selbstbeteiligung auch für Schäden, deren Verursacher unbekannt ist, und bei vorzeitiger Kündigung bis zu alle restlichen Raten.",
    preisAb: "ab 380 Euro im Monat für den i20, als Aktion ab 336 Euro (de.subscription.mocean.com, 27.09.2026)",
    grundlage: "AGB der Hyundai Connected Mobility GmbH, ohne Datum, und FAQ",
    agbUrl: "https://de.subscription.mocean.com/agreements/general-terms-b2c",
    klauseln: [
      {
        thema: "Vertragsart",
        fundstelle: "AGB Nr. 3.1",
        zitat:
          "Das MOCEAN Auto Abo ermöglicht Ihnen, ein Fahrzeug aus unserer Fahrzeug-Flotte (das „Mietfahrzeug“) für Ihren persönlichen Gebrauch zu mieten und weitere dazugehörige Mobilitätsdienste in Anspruch zu nehmen („Services“).",
      },
      {
        thema: "Haftung",
        fundstelle: "FAQ „Wer haftet für Schäden, die durch Dritte verursacht werden?“",
        zitat:
          "Solange sich das Fahrzeug in Ihrer Obhut befindet, sind Sie für dessen Zustand verantwortlich, unabhängig davon, wer den Schaden verursacht hat. […] Wenn es jedoch keinen Dritten gibt, von dem die Schadenskosten eingefordert werden können, verbleibt die Verantwortung für die Selbstbeteiligung beim Vertragspartner.",
        hinweis: "In den AGB (Nr. 9.11) steht dagegen, dass du für die von dir verursachten Schäden haftest. Die FAQ geht weiter.",
      },
      {
        thema: "Versicherung",
        fundstelle: "AGB Nr. 7.3 und FAQ",
        zitat:
          "Die Versicherungs-Prämie ist in der monatlichen Rate enthalten. […] Für alle MOCEAN -Abos gilt die standardmäßige Selbstbeteiligung von 1.000 Euro pro Schadensfall.",
      },
      {
        thema: "Verzugszins",
        fundstelle: "AGB Nr. 7.10",
        zitat: "Etwaige Kosten, die uns durch Zahlungsausfall entstehen, sind von Ihnen zu erstatten.",
        hinweis: "Keine Verzugszinsen. Eine fehlgeschlagene Zahlung kostet laut Anhang 2 eine Verwaltungsgebühr von 7 Euro.",
      },
      {
        thema: "Kaution",
        fundstelle: "AGB Nr. 4.4",
        zitat:
          "Wir behalten uns das Recht vor, abhängig von dem Ergebnis der Bonitätsprüfung ggf. eine Sicherheitsleistung (z.B. Kaution, Bürgschaft etc.) von Ihnen zu verlangen.",
      },
      {
        thema: "Kilometer",
        fundstelle: "FAQ Kilometerleistung",
        zitat:
          "Nicht genutzte Kilometer werden am Ende jedes Monats erfasst und auf den nächsten Monat übertragen. Nach Ablauf der Laufzeit werden die insgesamt gefahrenen Kilometer verrechnet.",
        hinweis: "Mehrkilometer kosten laut Anhang 2 der AGB 0,25 Euro je km.",
      },
      {
        thema: "Pauschalen",
        fundstelle: "AGB Anhang 2",
        zitat:
          "Vertragsstrafe bei Nichterscheinen 500 Euro (Abholung/Rückgabe zum vereinbarten Termin verspätet oder nicht möglich und durch Kunden verursacht )",
        hinweis: "Versäumst du die Wartung und geht die Herstellergarantie verloren, bis zu 20 Prozent des ursprünglichen Fahrzeugwertes.",
      },
      {
        thema: "Laufzeit",
        fundstelle: "AGB Nr. 11.1 b)",
        zitat:
          "Im Falle einer vorzeitigen Kündigung verpflichten Sie sich, uns eine Stornierungsgebühr gemäß Anhang 2 zu zahlen",
        hinweis: "Laut Anhang 2 je nach Laufzeit 25 bis 100 Prozent der restlichen Monatsgebühren.",
      },
      {
        thema: "Kauf",
        fundstelle: "FAQ",
        zitat: "Aus diesem Grund ist ein Kauf im Rahmen Ihres MOCEAN -Abos nicht möglich.",
      },
    ],
  },
  {
    id: "kinto",
    name: "KINTO Auto Abo",
    unter: "Abo von Toyota, Vertrag über das Autohaus",
    farbe: "gelb",
    urteil: "Ohne Vertragstext kein Urteil",
    grund:
      "KINTO ist Halter und Versicherungsnehmer, Versicherung, Steuer, Wartung und Reifen stecken in der Rate, eine Kaution gibt es nicht. Aber öffentliche AGB für das Abo fehlen, und den Vertrag schließt das Toyota-Autohaus: Wie die Haftung geregelt ist, lässt sich erst am Vertrag prüfen.",
    preisAb: "Yaris Hybrid 253 Euro im Monat bei 12 Monaten (Angebotsdaten auf toyota.de, 27.09.2026)",
    grundlage: "FAQ und Gebührenordnung der KINTO Deutschland GmbH, keine öffentlichen Abo-AGB",
    agbUrl: "https://www.kinto-mobility.eu/de/de/kinto-auto-abo",
    klauseln: [
      {
        thema: "Vertragsart",
        fundstelle: "FAQ und Produktseite",
        zitat:
          "Alle Fahrzeuge im KINTO Auto Abo sind auf die KINTO Deutschland GmbH zugelassen. Diese ist auch Versicherungsnehmer. […] Der Händler kontaktiert Sie, klärt die Details und schließt den Vertrag mit Ihnen.",
      },
      {
        thema: "Haftung",
        fundstelle: "FAQ „Wie erfolgt die Fahrzeugrückgabe?“",
        zitat:
          "Wir weisen darauf hin, dass Ihnen weder nutzungsgemäße Verschleißspuren, noch zum Vertragsbeginn identifizierte Mängel in Rechnung gestellt werden können.",
      },
      {
        thema: "Versicherung",
        fundstelle: "FAQ",
        zitat: "Jedes Fahrzeug im KINTO Auto Abo ist vollkaskoversichert. Die Höhe der Selbstbeteiligung können Sie in Ihrem Abo-Angebot einsehen.",
      },
      {
        thema: "Verzugszins",
        fundstelle: "Gebührenordnung",
        zitat: null,
        hinweis:
          "Keine Verzugszinsen gefunden. Die Gebührenordnung nennt Mahngebühren von 10 und 25 Euro, ob sie für das Abo gilt, steht dort nicht.",
      },
      {
        thema: "Kaution",
        fundstelle: "FAQ",
        zitat: "Nein, für das KINTO Auto Abo müssen Sie keine Kaution leisten.",
        hinweis: "Im Einzelfall kann nach der Bonitätsprüfung eine Anzahlung verlangt werden.",
      },
      {
        thema: "Kilometer",
        fundstelle: "FAQ",
        zitat: "Den Mehrkilometersatz können Sie Ihrem Abovertrag entnehmen. Eine Abrechnung von Minderkilometern erfolgt nicht.",
      },
      {
        thema: "Pauschalen",
        fundstelle: "FAQ",
        zitat: "Dafür berechnen wir eine Pauschale von 30€ inkl. MwSt.",
        hinweis: "Je Strafzettel. Rückgabe an einem anderen Ort kostet laut Gebührenordnung 300 Euro.",
      },
      {
        thema: "Laufzeit",
        fundstelle: "FAQ",
        zitat:
          "Eine vorzeitige Beendigung Ihres Abo-Vertrages, also eine Beendigung vor Ablauf der gewählten Laufzeit, ist aufgrund der kurzen Laufzeit Ihres Vertrages grundsätzlich ausgeschlossen.",
      },
    ],
  },
  {
    id: "mercedes",
    name: "Mercedes-Benz Rent Langzeitmiete",
    unter: "Nachfolger des Mercedes-Abos, bis 24 Monate",
    farbe: "rot",
    urteil: "Haftung auch ohne Verschulden",
    grund:
      "Mercedes vermietet und bleibt Eigentümer, Wartung und Reifen zahlt der Vermieter. Aber die Selbstbeteiligung zahlst du für jeden Schadenfall, ob du ihn zu vertreten hast oder nicht, und die Bedingungen nennen ausdrücklich Verzugszinsen.",
    preisAb: "kein Monatspreis veröffentlicht, der Preis entsteht erst im Buchungsweg (mieten.mercedes-benz.de, 27.09.2026)",
    grundlage: "Allgemeine Mietbedingungen der Mercedes-Benz Automotive Mobility GmbH, Stand Oktober 2025",
    agbUrl: "https://mieten.mercedes-benz.de/documents/de-DE/Allgemeine_Mietbedingungen_Mercedes-Benz_Rent_PKW.pdf",
    klauseln: [
      {
        thema: "Vertragsart",
        fundstelle: "AMB IX. 1.",
        zitat: "Der Vermieter ist Eigentümer des Mietgegenstands.",
        hinweis: "Inspektion, Wartung und Reifen trägt der Vermieter (XVI. 2. und 3.).",
      },
      {
        thema: "Haftung",
        fundstelle: "AMB XVII. 6.",
        zitat:
          "Ungeachtet der Haftungsfreistellung im Übrigen bleibt der Mieter für jeden Schadenfall, unabhängig davon, ob der Mieter dessen Eintritt zu vertreten hat oder nicht, zur Zahlung eines im Mietvertrag als Selbstbeteiligung vereinbarten Betrags an den Vermieter verpflichtet.",
      },
      {
        thema: "Versicherung",
        fundstelle: "AMB XVII. 1. und 6.",
        zitat:
          "Soweit die Parteien dies im Mietvertrag vereinbart haben, nimmt der Vermieter den Mieter anstelle dieser mietvertraglichen Haftung im Schadenfall bis zur Höhe der Selbstbeteiligung im Sinne von Ziffer XVII.6. in Anspruch […] Ist die Höhe der Selbstbeteiligung im Mietvertrag nicht vereinbart, beträgt diese einheitlich für alle Schadenarten 2.000,00 €.",
        hinweis: "Die Haftpflichtversicherung schließt der Vermieter in eigenem Namen ab (XV. 1.).",
      },
      {
        thema: "Verzugszins",
        fundstelle: "AMB VII. 6.",
        zitat:
          "Zahlt der Mieter den Rechnungsbetrag nicht bis zu dem vereinbarten oder auf der Rechnung ausgewiesenen Fälligkeitstermin und auch nach Mahnung nicht, fallen die gesetzlichen Verzugszinsen an und der Mieter ist zur Zahlung einer Mahngebühr gemäß der Tarif-/Kostenordnung verpflichtet.",
      },
      {
        thema: "Kaution",
        fundstelle: "AMB VII. 1. und FAQ",
        zitat: "Eine Verzinsung von Sicherheiten erfolgt nicht.",
        hinweis: "Die Höhe hängt laut FAQ von Mietdauer und Fahrzeuggruppe ab.",
      },
      {
        thema: "Kilometer",
        fundstelle: "FAQ",
        zitat: "Alle unsere Fahrzeuge verfügen standardmäßig über eine Inklusivkilometerleistung von 80 km am Tag.",
      },
      {
        thema: "Pauschalen",
        fundstelle: "Tarif- und Kostenordnung",
        zitat: "Abwicklung von Schadenfällen, Unfällen und Fehlteilen 30,00 €",
        hinweis: "Dazu 180 Euro, wenn ein Sachverständiger kommt, und 250 Euro je Tag verspäteter Rückgabe.",
      },
      {
        thema: "Laufzeit",
        fundstelle: "AMB IV. 1.",
        zitat: "Für folgende Tarife gelten nachfolgende Mindestmietzeiten: […] Fix-Tarif: 3 Monate, […] Fix-Plus-Tarif: 6 Monate",
      },
    ],
  },
  {
    id: "faaren",
    name: "FAAREN",
    unter: "Marktplatz, Vertrag mit einem Autohaus",
    farbe: "rot",
    urteil: "Fällt bei der Muster-AGB durch",
    grund:
      "FAAREN vermittelt nur, gemietet wird beim Autohaus zu dessen AGB. Die Muster-AGB, die gut die Hälfte der Autohäuser dort nutzt, legt dir ab Übergabe die Gefahr für Diebstahl, Unfall und Hagel auf, genau daran scheitert auch klassisches Leasing.",
    preisAb: "Renault ab 289 Euro im Monat, dazu 79 Euro Servicegebühr je Buchung (faaren.com, 27.09.2026)",
    grundlage: "Endkunden-AGB vom 08.06.2026 und Muster-AGB für Autohäuser, Stand 01.07.2024",
    agbUrl: "https://faaren.com/agbs/agb-de",
    klauseln: [
      {
        thema: "Vertragsart",
        fundstelle: "Endkunden-AGB Ziffer 2.5",
        zitat:
          "Die Mietverträge, die im Zusammenhang mit der Nutzung der Plattform über Fahrzeuge geschlossen werden, kommen stets nur zwischen Ihnen und dem jeweiligen FAAREN-Partner zustande.",
      },
      {
        thema: "Haftung",
        fundstelle: "Muster-AGB Ziffer 4.3.6",
        zitat:
          "Die Gefahr des Untergangs sowie der Verschlechterung des Fahrzeugs (z. B. Abhandenkommen des Fahrzeugs durch Diebstahl, Unfallschäden, Schäden durch Witterungseinflüsse (z. B. Hagel) etc.) geht mit Übergabe an den Kunden über.",
        hinweis: "Dazu Ziffer 7.6: „Sie haften für alle Schäden, soweit sie nicht von einer Versicherung bzw. Dritten gedeckt werden.“",
      },
      {
        thema: "Versicherung",
        fundstelle: "Muster-AGB Ziffer 5.2",
        zitat:
          "Wir schließen für das Fahrzeug eine Vollkasko- und Teilkaskoversicherung mit einer Selbstbeteiligung (Höhe der Selbstbeteiligung wie in der Buchung vereinbart) ab.",
        hinweis: "Zulassung und Kfz-Steuer trägt das Autohaus (Ziffer 5.1), Wartung und Verschleiß ebenso (Ziffer 6.1).",
      },
      {
        thema: "Verzugszins",
        fundstelle: "Endkunden-AGB Ziffer 7.6",
        zitat: "Je fehlgeschlagener Zahlung erheben wir eine Bearbeitungsgebühr in Höhe von brutto 20,-€",
        hinweis: "Keine Verzugszinsen in den Endkunden-AGB und der Muster-AGB. Ein Partner schreibt sie in seine eigenen AGB.",
      },
      {
        thema: "Kaution",
        fundstelle: "AGB eines Autohauses, Ziffer 2.5",
        zitat: "Die Höhe der Kaution beträgt 2.000,00 EUR.",
        hinweis: "Die Muster-AGB sieht keine Kaution vor, 11 von 170 Autohäusern verlangen eine.",
      },
      {
        thema: "Kilometer",
        fundstelle: "Muster-AGB Ziffer 4.2.2.8",
        zitat:
          "Wird das Fahrzeug mit mehr gefahrenen Kilometern zurückgegeben, als vertraglich vereinbart, werden die Mehrkilometer bei Rückgabe des Fahrzeugs gemäß der Buchungsbestätigung berechnet. Minderkilometer werden nicht erstattet.",
      },
      {
        thema: "Pauschalen",
        fundstelle: "Endkunden-AGB Ziffer 6.4",
        zitat:
          "Für die Bereitstellung der Plattformtechnologie sowie die technische und organisatorische Abwicklung einer Buchung über den FAAREN Marktplatz wird je abgeschlossener Buchung eine einmalige Servicegebühr in Höhe von brutto 79 ,-€ erhoben.",
      },
      {
        thema: "Laufzeit",
        fundstelle: "Muster-AGB Ziffer 9.2",
        zitat:
          "Wenn Sie ein Abonnement mit variabler Laufzeit abgeschlossen haben, ist die vereinbarte Laufzeit die Mindestlaufzeit.",
      },
    ],
  },
];

/** Abos, die es für Neukunden nicht mehr gibt, jeweils mit dem Satz des Anbieters. */
export const nichtBuchbar: { name: string; unter: string; beleg?: string; fundstelle: string }[] = [
  {
    name: "Care by Volvo",
    unter: "Abo von Volvo",
    beleg: "Sofern Sie ein Anliegen zu Ihrem derzeit laufenden Care by Volvo Abonnement haben, steht Ihnen Openbank Deutschland AG jederzeit gerne zur Verfügung.",
    fundstelle: "volvocars.com/de/care-by-volvo leitet auf die Seite der Openbank, die sich nur an laufende Abos richtet",
  },
  {
    name: "like2drive und Kia Flex",
    unter: "Abos der Fleetpool GmbH",
    beleg: "Die Online-Shops unserer Marken werden eingestellt.",
    fundstelle: "abo.fleetpool.de",
  },
  {
    name: "Lynk & Co",
    unter: "Mitgliedschaft",
    beleg: "In der ersten Hälfte des Jahres 2026 werden wir alle unsere bestehenden Abonnementverträge beenden.",
    fundstelle: "lynkco.com/de-de/help/subscribe",
  },
  {
    name: "ViveLaCar",
    unter: "Marktplatz für Abos, auch für Firmen",
    fundstelle: "vivelacar.com war am 27.09.2026 nicht mehr erreichbar, vivelacar.de hat keinen Registrar mehr",
  },
  {
    name: "Porsche Drive Abo",
    unter: "Abo der Porsche Financial Services",
    beleg: "Porsche Drive Abo: Bald verfügbar!",
    fundstelle: "Seite von Porsche Drive für Deutschland, derzeit nicht buchbar",
  },
];

/**
 * Fünf Fragen an den Anbieter, abgeleitet aus den Bedingungen für eine zulässige Miete: Eigentum und
 * Kosten beim Vermieter, Haftung nur bei Verschulden, kein Aufschlag für Verzug, kein Kauf.
 */
export const fragen: { titel: string; text: string }[] = [
  {
    titel: "Wem gehört das Auto, und auf wen ist es zugelassen?",
    text: "Richtig ist: auf den Anbieter. Steht dein Name im Fahrzeugbrief, trägst du Pflichten, die zum Eigentümer gehören.",
  },
  {
    titel: "Zahlst du Versicherung, Steuer, Wartung und Verschleiß?",
    text: "Alles, was das Auto fahrbereit hält, gehört zum Vermieter. Er darf es in die Rate einrechnen, aber nicht auf dich abwälzen.",
  },
  {
    titel: "Zahle ich auch, wenn ein Unbekannter den Schaden verursacht?",
    text: "Frag nach der Selbstbeteiligung bei Parkschäden, Diebstahl und Hagel. Zahlen solltest du nur, was du selbst verursacht hast.",
  },
  {
    titel: "Was kostet es, wenn ich eine Rate zu spät zahle?",
    text: "Verzugszinsen, ein Aufschlag oder ein wegfallender Rabatt sind Zins für Zeit. Ohne Klausel erlaubt das Gesetz Verzugszinsen trotzdem, pünktlich zahlen hält dich davon fern.",
  },
  {
    titel: "Muss ich am Ende kaufen, oder läuft etwas über eine Bank?",
    text: "Eine Kaufpflicht, eine Schlussrate oder Bereitstellungskosten über einen Ratenkauf-Dienst machen aus der Miete einen Kredit. Einmal zahlen oder direkt beim Anbieter in festen Teilen.",
  },
];

/** Was für Firmen anders ist. */
export const firmen =
  "FINN und SIXT nutzen für Firmen dieselben AGB wie für Privatkunden, die Prüfung oben gilt also genauso. Das Business Abo von VW FS hat eigene Bedingungen, mit 9 Prozentpunkten Verzugszins über dem Basiszins. Für klassisches Leasing als Firma sehen einzelne Gelehrte je nach Lage eine Ausnahme, die klärst du aber mit einem Gelehrten, nicht mit dem Steuerberater.";

/**
 * Rechenbeispiel Hyundai IONIQ 5 (63 kWh, 125 kW, Heckantrieb), die einzige Version, die im Abo, im
 * Leasingbeispiel, in der Preisliste und beim ADAC gleich ist. Nur Beträge je Jahr, keine Zinsrechnung
 * (Elias, 26.09.2026: nichts, was mit Zinsen rechnet). Strom fällt bei allen drei Wegen gleich an und
 * fehlt deshalb. Belege: Vault `raw/2026-09-27-auto-abo-agb/` und `rechnung-quellen` im Scratchpad der
 * Session, übernommen in `~/rebrand/P3_GOLD_AUTO_PRUEFUNG.md`.
 */
const ADAC_FIX = 199; // Kfz-Steuer mit Befreiung, Haftpflicht und Vollkasko je 50 Prozent Beitragssatz, pro Monat
const ADAC_WERKSTATT = 79; // pro Monat, 5 Jahre, 15.000 km
const ADAC_WERTVERLUST = 515; // pro Monat, 5 Jahre, 15.000 km

export const rechnung: Rechnung = {
  einleitung:
    "Sieh ein Jahr mit demselben Auto, dem Hyundai IONIQ 5 mit 63 kWh. Die Kilometer weichen ab, weil jeder rechnet, wie er anbietet: Abo 12.000, Leasing 10.000, ADAC 15.000 im Jahr.",
  summeWort: "Im Jahr",
  wege: [
    {
      name: "Auto-Abo",
      posten: [
        { was: "12 Raten zu 602 Euro", betrag: 12 * 602 },
        { was: "Versicherung, Steuer, Wartung", betrag: 0 },
      ],
      hinweis: "Alles in der Rate außer Strom. Abholung beim Händler kostenlos, Lieferung nach Hause 249 Euro.",
    },
    {
      name: "Leasing",
      posten: [
        { was: "12 Raten zu 329 Euro", betrag: 12 * 329 },
        { was: "Ein Viertel der Sonderzahlung von 4.000 Euro", betrag: 4000 / 4 },
        { was: "Versicherung und Steuer (ADAC)", betrag: 12 * ADAC_FIX },
        { was: "Werkstatt (ADAC)", betrag: 12 * ADAC_WERKSTATT },
      ],
      hinweis: "Vier Jahre fest, die Vollkasko ist Pflicht und läuft auf dich. Dazu Überführungskosten, deren Höhe das Beispiel nicht nennt.",
    },
    {
      name: "Bar kaufen",
      posten: [
        { was: "Wertverlust (ADAC)", betrag: 12 * ADAC_WERTVERLUST },
        { was: "Versicherung und Steuer (ADAC)", betrag: 12 * ADAC_FIX },
        { was: "Werkstatt (ADAC)", betrag: 12 * ADAC_WERKSTATT },
      ],
      hinweis:
        "Du legst 45.750 Euro plus Überführung auf einmal hin. Der Wertverlust ist ein Schnitt über fünf Jahre, bei zwei Jahren und 10.000 km rechnet der ADAC mit 755 Euro im Monat.",
    },
  ],
  fazit:
    "In diesem Beispiel kostet das Abo im Jahr rund 1.060 Euro weniger als Leasing und rund 2.290 Euro weniger als der Barkauf, weil Versicherung, Wartung und Wertverlust in der Rate stecken. Wer ein Auto viele Jahre fährt oder günstiger versichert ist, kann mit dem Barkauf vorne liegen: Rechne mit deinen eigenen Zahlen.",
  quellen:
    "Abo: MOCEAN, IONIQ 5 63 kWh, 12 Monate, 1.000 km im Monat. Leasing: Leasingbeispiel der HYUNDAI Finance auf hyundai.com, 48 Monate, 40.000 km, gültig bis 30.09.2026. Kaufpreis: Preisliste Hyundai, Stand Juli 2026. Laufende Kosten: ADAC Autokosten für den IONIQ 5 (63 kWh) 2WD, 5 Jahre, 15.000 km im Jahr, Versicherung mit 50 Prozent Beitragssatz. Alles abgerufen am 27.09.2026.",
};
