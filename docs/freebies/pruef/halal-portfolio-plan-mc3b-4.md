---
titel: Halal-Prüfzeile, frischer Prüfer, Portfolio-Plan (MC3b, Runde 4)
stand: 2026-10-28
sitzung: d494c1d6-d82b-42c8-8ef2-64d2aa54ea54
gegenstand: /Users/eliasel-gendy/Documents/dev/finanzmuslim-finish/docs/freebies/portfolio-plan.txt mit Begleitdatei portfolio-plan.belege.md
gelesen:
  - fundament/grundlage/HALAL_PRUEFZEILE.md (ganz)
  - docs/freebies/portfolio-plan.txt (ganz, 145 Zeilen)
  - docs/freebies/portfolio-plan.belege.md (ganz)
  - Ausgabe halal_aussagen.py mit --belege: 8 Treffer, 0 ohne gültigen Beleg, Ausgang 0
  - src/data/portfolioPlan.ts Z. 135-150 (Quellenliste der Seite)
  - src/data/vergleichAnzeige (gezählt per tsx): Girokonten 54, zinsfreiAbStart gut 47, teils 1, schlecht 6; Depots 27, gut 22, schlecht 5; jede Wertung mit Quellen-URL
  - geöffnet am 28.10.2026: konto.flatex.de 1300100.pdf, dok.dkb.de plv_pk_konten.pdf, tradersplace.de/konditionen/deine-konditionen, xtb.com/de/zinsen, c24.de/preise, blackrock.com iShares II plc Prospekt (PDF), invesco.com SSB-Zertifikat 2025 (PDF), shariyah.net/cryptocurrencies/bitcoin/
---

# Halal-Prüfzeile: Portfolio-Plan, Runde 4

Geprüft wird nur, ob jeder Beleg seine Aussage trägt. Kein eigenes Urteil, ob etwas halal ist.

| Kennung oder Zitat | direkt oder mittelbar | Beleg | trägt, trägt nicht oder fehlt | Grund |
|---|---|---|---|---|
| S-b3cfaf2d „Ich habe gerankt, welche Anbieter zinsfrei sind.“ (Z. 9) | direkt | brokerVergleich.ts, quellen.zinsfreiAbStart; flatex 1300100.pdf | trägt | flatex-PDF zeigt „Guthabenzins 0,00 % p. a. (freibleibend)“ beim Cash-Konto, Anbieter-Dokument. Alle 27 angezeigten Depots haben eine Wertung mit Quellen-URL; 25 auf der Domain des Anbieters, 2 (finvesto) auf banking.fnz.de, der depotführenden Bank. Die Aussage sagt nur, dass gerankt wurde, das trägt die Datenlage. |
| S-8316f5b2 „Etwa jedes achte Girokonto in meinem Vergleich zahlt dir Zinsen auf dein Guthaben.“ (Z. 19) | direkt | c24.de/preise; girokontoVergleich.ts | trägt | Gezählt: 7 von 54 angezeigten Konten mit Zinsen (6 rot, 1 gelb), 54/7 = 7,7, „etwa jedes achte“ stimmt. C24-Preisseite zeigt wörtlich „0,75 % Zinsen p.a. auf das Girokonto“ für Smart, Plus, Max. |
| „Bei den meisten davon läuft das automatisch.“ (Z. 19) | mittelbar (Zins, ohne Wort der Liste) | Begleitdatei Z. 11; quellen.zinsfreiAbStart der 7 Konten | trägt | 5 von 7 mit Anbieter-Wortlaut: C24 drei Konten („wird automatisch verzinst“, schriftlich vom Kundenservice), BBVA („nicht möglich, die Rückerstattung der Zinsen … abzulehnen“, Kundenservice), Wise („automatically enrolled all customers“, Hilfeseite des Anbieters). Mehrheit belegt. |
| S-80e26077 „Girokonten ohne Zinsen ansehen“ (Z. 21) | direkt | dok.dkb.de plv_pk_konten.pdf, Abschnitt 2 | trägt | PDF Abschnitt „2 Einlagen auf Konten“: „für Guthaben auf dem Girokonto … 0,00% p. a.“. DKB steht im Vergleich mit zinsfreiAbStart „gut“. Anbieter-Dokument. |
| Sukuk, „Beispiel: iShares USD Sukuk“ (Z. 27-31) und Quelle Z. 108 | mittelbar (als Baustein im Portfolio für Muslime) | S-d799ddca, iShares II plc Prospekt | trägt | Prospekt definiert „Sukuk Fund“ = iShares $ Sukuk UCITS ETF und sagt wörtlich „The Sukuk Fund Panel has issued a Fatwa in respect of the Sukuk Fund.“ Der Text nennt nur „Shari'ah Panels“, also nicht mehr als die Quelle. |
| Islamic ETF, „Hunderte Firmen mit einem Kauf, jedes Quartal geprüft.“ (Z. 41) | mittelbar | Begleitdatei Z. 15, Prospekt S. 88 | trägt | Seite 88 nachgezählt: „will be reviewed on a quarterly basis by the MSCI Shari’ah Board“. „Shari'ah Equity Funds“ schließt laut Prospekt iShares MSCI World Islamic UCITS ETF ein; dazu „The Shari'ah Equity Funds Panel has issued a Fatwa in respect of the Shari'ah Equity Funds.“ „Islamic“ im Namen allein zählt nicht als Aussage. |
| S-d799ddca „iShares II plc, Verkaufsprospekt (Shari'ah Panels für Islamic- und Sukuk-Fonds)“ (Z. 108) | direkt | blackrock.com Prospekt | trägt | Beide Zitate wörtlich im PDF gefunden (Abschnitte Shari'ah Equity Funds Panel und Sukuk Fund Panel). |
| Gold, „Beispiel: Invesco Physical Gold“ (Z. 33-37) und S-ff2ae8be „Invesco Physical Gold ETC, Shariah-Zertifikat 2025“ (Z. 109) | mittelbar und direkt | invesco.com SSB-Zertifikat 2025 | trägt | PDF geöffnet: „ANNUAL SHARIAH COMPLIANCE CERTIFICATE FINANCIAL YEAR END 2025“, Amanie Advisors SSB, Liste nennt „Invesco Physical Gold ETC“. „Hält seinen Wert“ und „im Tresor“ sind keine Aussagen zu halal. |
| Krypto, „Beispiel: Bitcoin“ (Z. 51-55) und „Shariyah Review Bureau, Analyse zu Bitcoin“ (Z. 110) | mittelbar (Baustein im Portfolio für Muslime) | URL aus src/data/portfolioPlan.ts Z. 149: https://shariyah.net/cryptocurrencies/bitcoin/; keine Zeile in der Begleitdatei | trägt | Seite geöffnet: Analyse vorhanden, Schluss „nothing has come to our attention that causes us to believe that Bitcoin is in breach of Sharia* principles“, Statustabelle „Bitcoin Compliant“, Hinweis „preliminary Sharia research and is by no means a fatwa“. Der Text nennt es „Analyse“ und Krypto „freiwillig und mit Vorsicht“, er behauptet keine Fatwa. Formale Lücke siehe Hinweis 1. |
| Einzelaktien, „Jede braucht ihre eigene Prüfung. Beispiel: Apps zum Prüfen“ (Z. 47-49) | mittelbar | keiner | trägt (kein Beleg nötig) | Der Satz spricht kein Urteil aus, er verlangt eine Prüfung je Firma. |
| Titel „Dein Portfolio als Muslim in vier Schritten“ (Z. 1) | mittelbar | Belege der Bausteine (oben), Begleitdatei Z. 12 | trägt | Jeder Baustein der drei Pläne hat einen Beleg (Girokonto ohne Zinsen, Sukuk, Gold, Islamic ETF, Bitcoin-Analyse) oder spricht kein Urteil aus (Einzelaktien). Kein „Halal-Portfolio“ mehr im Titel. |
| S-d4c52573 „Girokonto ohne Zinsen“ (Plan 1 Jahr, Z. 117) und „Die Hälfte bleibt einfach auf dem Girokonto.“ (Z. 127) | direkt und mittelbar | dok.dkb.de plv_pk_konten.pdf | trägt | Wie S-80e26077: Guthabenzins Girokonto 0,00 % p. a. beim Anbieter. |
| S-b594ae6e „Damit Muslime es einfach haben, habe ich gerankt, welche Anbieter zinsfrei sind. … welches Depot zu dir passt.“ (Z. 98) | direkt, „zu dir passt“ mittelbar | brokerVergleich.ts; tradersplace.de Konditionen | trägt | tradersplace.de wörtlich „EUR-Verrechnungskonto Guthabenzinssatz 0% p.a.“; Datenlage wie S-b3cfaf2d. |
| S-a1ea1096 „Schon ein Depot? Prüf, ob deins Zinsen zahlt“ (Z. 102) | direkt | xtb.com/de/zinsen | trägt | Wörtlich auf der Anbieterseite: „Die Verzinsung wird automatisch aktiviert, es sind keine weiteren Schritte erforderlich.“ 5 von 27 angezeigten Depots tragen Zinsen. |
| „Nicht jedes Depot hat alle Islamic ETFs: Von zwölf geprüften …“ (Z. 91) | keine Halal-Aussage | — | trägt (kein Beleg nötig) | Kaufbarkeit, nicht Erlaubtheit; „Islamic“ im Namen ist keine Aussage. |

## Hinweise ohne Einfluss auf das Urteil

1. Die Wortliste fängt „Shariyah“ nicht: Muster `shari'?a\w*` passt nicht auf „shariy…“. Z. 110 läuft deshalb am Befehl vorbei, und die Begleitdatei hat für die Bitcoin-Analyse keine Belegzeile (nur die Bemerkung in Z. 12). Der Beleg trägt in der Sache; vorgeschlagen sind ein Muster `shari'?y?a\w*` in `HALAL_PRUEFZEILE.md` und eine Zeile mit URL, Stelle („nothing has come to our attention …“, „by no means a fatwa“) und Datum in der Begleitdatei.
2. Santander BestGiro (Zins-Konto im Vergleich) hat den Beleg auf santander.de, die Domain im Datensatz ist openbank.de; beides gehört zur selben Bank. Für die Zählung „jedes achte“ ohne Einfluss.

Urteil Halal-Prüfzeile: grün
