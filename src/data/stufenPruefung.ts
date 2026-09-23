/**
 * Stand der Stufen-Prüfung je Haus. HANDGEPFLEGT, wird nur vom Prüfstand gelesen (scripts/pruefstand.ts).
 *
 * Regel (Elias, 23.09.2026): Jede Tarifstufe eines Anbieters ist ein eigenes Produkt. Ein Beleg gilt für eine
 * Stufe nur, wenn er sie nennt oder ausdrücklich für alle Stufen gilt. Sobald ein Haus stufenweise nachgeprüft
 * ist, kommt hier ein Eintrag mit Datum, sonst zeigt der Prüfstand „pauschaler Beleg“.
 *
 * Schlüssel ist das Haus (`haus` in den Vergleichsdateien).
 */
export type StufenStand = {
  /** Datum und kurzer Befund der stufenweisen Prüfung. Leer heißt: noch nicht geprüft. */
  geprueft?: string;
  notiz?: string;
};

export const STUFEN_STAND: Record<string, StufenStand> = {
  revolut: {
    geprueft: "23.09.2026, im echten Chrome auf revolut.com",
    notiz: "Zins Girokonto: AGB Privatkunden Abschn. 2 gilt für alle fünf Stufen, Zins nur im Opt-in-Tagesgeld. Der Tagesgeld-Satz hängt vom Abo ab (Standard bis Ultra), kein Einfluss auf die Ampel. Dispo: Hilfeseite „kein Überziehungsdienst in DE“ gilt landesweit. Offen: Zuordnung der Tagesgeld-Prozentwerte je Stufe (sechs Werte für fünf Spalten), für die Bewertung nicht nötig.",
  },  bunq: {
    geprueft: "23.09.2026, Privatkonto-AGB (nennt alle vier Stufen)",
    notiz: "MassInterest nur im selbst eröffneten Sparkonto (AGB Nr. 17), Dispo grundsätzlich nicht (AGB Nr. 25, „normalerweise“). Kein Unterschied zwischen Free, Core, Pro und Elite. Der alte Hilfeartikel zum Dispo ist 404 und ersetzt. Optional: bunq einmal schriftlich zum Dispo bestätigen lassen.",
  },
  vivid: {
    geprueft: "23.09.2026, Vivid-Hilfeartikel nennt Standard, Plus und Prime",
    notiz: "Zins nur im selbst geöffneten Interest Rate Pocket (Standard 0,1 %, Plus 1,0 %, Prime 2,0 %). Dispo: Hilfeartikel von 2023 ohne Stufe, dazu Vivid Now nur auf Antrag, aktuelle Quelle fehlt. Offen: Vivid einmal schriftlich zum Dispo fragen.",
  },
  tomorrow: {
    geprueft: "23.09.2026, Tomorrow-Kontoseite nennt Now, Change, Plus",
    notiz: "Zins nur beim separat eröffneten Tagesgeldkonto, je Plan namentlich (0,75 / 1 / 1,5 %). Dispo ist in allen Plänen nur eine Option. Widersprüche der Anbieterseiten: Dispozins 9,75 % (Tomorrow) gegen 15 % (Solaris), Tagesgeld für Now teils „nicht verfügbar“. Für die Ampeln unerheblich.",
  },
  hvb: {
    notiz: "23.09.2026 geprüft: HVB Depot und SmartDepot nutzen dasselbe Investmentkonto (0,50 % bis 31.12.2026, automatisch), beides rot. AktivKonto und PlusKonto: nur die Kundenservice-Mail belegt „nicht verzinst“, das PLV schweigt dazu (Abwesenheit ist kein Beleg). Die Mail lag beim Investmentkonto falsch, das Girokonto-Urteil ist deshalb weniger sicher.",
  },
  commerzbank: {
    geprueft: "23.09.2026, Preisaushang, PLV und Kundencenter-Mail",
    notiz: "Girokonten: Preisaushang 0,00 % Guthabenzins, Dispo nur auf Wunsch. Depots: Die Mail des Kundencenters galt dem Depot allgemein, keine Commerzbank-Seite legt das Verrechnungskonto je Depotstufe fest. Ampel bleibt grün, Stufenbezug ist nicht ausdrücklich belegt.",
  },
  n26: {
    geprueft: "23.09.2026, N26-Hilfe nennt Standard, Smart, Go, Metal",
    notiz: "Zins nur im separaten Tagesgeldkonto (0,25 / 0,25 / 0,55 / 1,50 %). Flex: weder Zins- noch Dispo-Beleg, deshalb offen.",
  },
  c24: {
    geprueft: "23.09.2026, C24-Preisseite führt Smart, Plus, Max",
    notiz: "Alle drei Stufen: 0,75 % Zins automatisch aufs Girokonto, kein Verzicht. Dispo nur auf Antrag.",
  },
  comdirect: {
    geprueft: "23.09.2026, Vorvertragliche Informationen zum comdirect Depot",
    notiz: "comdirect Depot: Verrechnungskonto „variabel verzinst“, jetzt rot (vorher grün nur aus Abwesenheit im Preisverzeichnis, das war falsch). Pure Depot: nicht genannt, jetzt offen.",
  },
  bitpanda: {
    geprueft: "23.09.2026, Passive Earn nennt Fusion, Standard über die AGB",
    notiz: "Standard und Fusion: Passive Earn läuft per AGB-Annahme, abschaltbar, gelb. Depot (Wertpapiere): der Krypto-Beleg wurde nicht übertragen, jetzt offen. Abo-Stufen mit Zins: nicht gefunden, Bitpanda Club nennt keine Zinsen.",
  },
  tomorrow: {
    geprueft: "23.09.2026, Tomorrow-Kontoseite nennt Now, Change, Plus",
    notiz: "Zins nur beim separat eröffneten Tagesgeldkonto, je Plan namentlich (0,75 / 1 / 1,5 %). Dispo ist in allen Plänen nur eine Option. Widersprüche der Anbieterseiten: Dispozins 9,75 % (Tomorrow) gegen 15 % (Solaris), Tagesgeld für Now teils „nicht verfügbar“. Für die Ampeln unerheblich.",
  },
  hypovereinsbank: {
    geprueft: "23.09.2026, Depotseiten und Produktprofil",
    notiz: "HVB Depot und SmartDepot nutzen dasselbe Investmentkonto (0,50 % bis 31.12.2026, automatisch), beides rot. AktivKonto und PlusKonto: nur die Kundenservice-Mail belegt „nicht verzinst“, das PLV schweigt dazu (Abwesenheit ist kein Beleg). Die Mail lag beim Investmentkonto falsch, das Girokonto-Urteil ist deshalb weniger sicher.",
  },
  commerzbank: {
    geprueft: "23.09.2026, Preisaushang, PLV und Kundencenter-Mail",
    notiz: "Girokonten: Preisaushang 0,00 % Guthabenzins, Dispo nur auf Wunsch. Depots: Die Mail des Kundencenters galt dem Depot allgemein, keine Commerzbank-Seite legt das Verrechnungskonto je Depotstufe fest. Ampel bleibt grün, der Stufenbezug ist nicht ausdrücklich belegt.",
  },
  n26: {
    geprueft: "23.09.2026, N26-Hilfe nennt Standard, Smart, Go, Metal",
    notiz: "Zins nur im separaten Tagesgeldkonto (0,25 / 0,25 / 0,55 / 1,50 %). Flex: weder Zins- noch Dispo-Beleg, deshalb offen.",
  },
  c24: {
    geprueft: "23.09.2026, C24-Preisseite führt Smart, Plus, Max",
    notiz: "Alle drei Stufen: 0,75 % Zins automatisch aufs Girokonto, kein Verzicht. Dispo nur auf Antrag.",
  },
  comdirect: {
    geprueft: "23.09.2026, vorvertragliche Informationen zum comdirect Depot",
    notiz: "comdirect Depot: Verrechnungskonto „variabel verzinst“, jetzt rot (vorher grün nur aus Abwesenheit im Preisverzeichnis, das war falsch). Pure Depot: nicht genannt, jetzt offen.",
  },
  bitpanda: {
    geprueft: "23.09.2026, Passive Earn nennt Fusion, Standard über die AGB",
    notiz: "Standard und Fusion: Passive Earn läuft per AGB-Annahme und ist abschaltbar, gelb. Depot (Wertpapiere): der Krypto-Beleg wurde nicht übertragen, jetzt offen. Abo-Stufen mit Zins nicht gefunden, Bitpanda Club nennt keine Zinsen.",
  },
  "trade-republic": {
    geprueft: "23.09.2026, Zins-FAQ im echten Chrome aufgeklappt",
    notiz: "Depot, Girokonto und Krypto teilen dasselbe Cash-Konto und stehen jetzt einheitlich auf ja. Vorher war Depot ja und Girokonto/Krypto abschaltbar, aus derselben Quelle. Der Anbieter schreibt: „Aktiviere Zinsen in der App“, also Opt-in. Gegenprobe in der App durch Elias steht aus.",
  },
  norisbank: {
    notiz: "23.09.2026: Beim Dispo widerspricht sich die Bank. Werbeseite „erhalten Girokonto-Kunden einen Sofort-Dispo“, Vertragsbedingungen „Auf Antrag … Antragsannahme durch gesonderte Mitteilung“. Top-Girokonto steht beim Dispo deshalb auf offen, vorher rot allein wegen der Werbeseite.",
  },
  targobank: {
    notiz: "23.09.2026: Der Dispo-Beleg des Online-Kontos sagte nichts über einen Dispo und trug das rote Urteil nicht. Jetzt offen. Die Bank verweist für Auskünfte in die Filiale.",
  },
  ing: {
    notiz: "23.09.2026: Direkt-Depot bleibt rot, weil ING Neukunden automatisch ein verzinstes Extra-Konto als Verrechnungskonto eröffnet. Wer schon ein ING-Girokonto hat, kann es stattdessen wählen; das steht jetzt im Beleg. Die Girokonten bleiben grün.",
  },
};
