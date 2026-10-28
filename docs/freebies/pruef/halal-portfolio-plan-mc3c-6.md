---
titel: Halal-Prüfzeile, frischer Prüfer, Portfolio-Plan (MC3c, Runde 6)
stand: 2026-10-28
sitzung: 30a5647b-807f-4f66-8f94-834ef9f9f40c
gegenstand: /Users/eliasel-gendy/Documents/dev/finanzmuslim-finish/docs/freebies/portfolio-plan.txt mit Begleitdatei portfolio-plan.belege.md
gelesen:
  - fundament/grundlage/HALAL_PRUEFZEILE.md (ganz)
  - docs/freebies/portfolio-plan.txt (ganz, 165 Zeilen)
  - docs/freebies/portfolio-plan.belege.md (ganz, 21 Zeilen)
  - Ausgabe halal_aussagen.py mit --belege: 10 Sätze mit Treffer, 0 ohne gültigen Beleg, Ausgang 0
  - docs/freebies/pruef/halal-portfolio-plan-mc3c-5.md und auftrag-halal-mc3c-6.md (Vorrunde und Auftrag, nur zum Abgleich)
  - src/data/vergleichAnzeige.ts, src/lib/vollstaendig.ts, src/data/girokontoVergleich.ts (Zinsfelder und Anbieter-Hinweise), src/data/anlagenKaufbar.ts, src/data/halalAnlagen.ts
  - geöffnet am 28.10.2026: quran.com/2/275 und /2/278, xtb.com/de/zinsen, c24.de/preise, dok.dkb.de plv_pk_konten.pdf, assets.traderepublic.com Instrument_Universe_DE_de.pdf (nach den 12 ISINs durchsucht)
  - nicht neu geöffnet, Stand der Vorrunde 5 übernommen (Text dort unverändert): konto.flatex.de 1300100.pdf (curl lieferte HTML statt PDF), BlackRock iShares-II-Prospekt, Invesco SSB-Zertifikat, shariyah.net Bitcoin
---

# Halal-Prüfzeile: Portfolio-Plan, Runde 6 (MC3c)

Geprüft wird nur, ob jeder Beleg seine Aussage trägt. Kein eigenes Urteil, ob etwas halal ist.

## Neu in Runde 6

| Kennung oder Zitat | direkt oder mittelbar | Beleg | trägt, trägt nicht oder fehlt | Grund |
|---|---|---|---|---|
| S-9b510453 „Als Muslim meidest du Zinsen.“ (Z. 21) | direkt (was Muslimen erlaubt ist, Zins) | https://quran.com/2/275 und https://quran.com/2/278, Begleitdatei Z. 21, 28.10.2026 | trägt (mit Hinweis 1) | Beide Adressen geöffnet. 2:275: „Allah has permitted trading and forbidden interest.“ 2:278: „give up outstanding interest if you are true believers.“ Die Stelle verbietet Zins ausdrücklich und richtet sich an die Gläubigen, also an Muslime. Das trägt „Als Muslim meidest du Zinsen“ in der Aussagekraft des Satzes. Es ist die Quelle selbst, keine Gelehrtenposition, darum kein Hourani-Zitat nötig. Die Verbindung Koran-Zins und Guthabenzins auf dem Girokonto zieht der Satz nicht ausdrücklich; sie steht im Beitrag /wissen/zinsen-im-islam (Begleitdatei). Ich urteile darüber nicht. |
| S-db6601ce „Etwa jedes achte Girokonto zahlt dir Zinsen auf dein Geld.“ (Z. 19) | direkt (Zins) | https://www.c24.de/preise, Begleitdatei Z. 20, 28.10.2026 | trägt (mit Hinweis 2 und 3) | Neu gezählt an `girokontoAnzeige` (vite-node, 28.10.2026): 54 angezeigte Girokonten, davon `zinsfreiAbStart` schlecht: 6 (BBVA, C24 dreimal, Norisbank, Openbank), teils: 1 (Wise), gut: 47. 7 von 54 sind 13 %, „etwa jedes achte“ (12,5 %) passt. Zins-Belege der Anbieter im Datensatz: BBVA „Rückerstattung der Zinsen … nicht möglich abzulehnen“, Norisbank Preisaushang „Zins auf Guthaben“, C24 „0,75 % Zinsen p.a. auf das Girokonto“ (geöffnet; die Seite listet Smart, Plus, Max in einem Abschnitt, trennt den Wert aber nicht je Modell). Ohne „in meinem Vergleich“ liest sich der Satz wie eine Aussage über alle Girokonten. Er trägt nur, weil unten „Alle Zahlen stammen aus meinen Vergleichen.“ steht (Z. 116). Diese Zeile ist Teil des Belegs und darf nicht fallen. |
| „Alle Zahlen stammen aus meinen Vergleichen.“ (Z. 116) | mittelbar (Geltungsbereich der Zins-Zahl) | Begleitdatei Z. 20 | trägt | Keine Halal-Aussage, aber sie begrenzt die Zahl in Z. 19 auf die Anzeigeliste, an der ich gezählt habe. |

## Weiter unverändert aus Runde 5

| Kennung oder Zitat | direkt oder mittelbar | Beleg | trägt, trägt nicht oder fehlt | Grund |
|---|---|---|---|---|
| Kachel XTB: S-d00660be „Zinsen“ + „automatisch eingeschaltet“ (Z. 101-105) | direkt (Zins) | https://www.xtb.com/de/zinsen, 28.10.2026 | trägt (mit Hinweis 4) | Anbieter-Seite geöffnet, FAQ „Wie funktioniert es?“: „Die Verzinsung wird automatisch aktiviert, es sind keine weiteren Schritte erforderlich.“ Die Kachel gibt nur das wieder, ohne Urteil über halal oder haram und ohne „nicht abschaltbar“. Die rote Farbe ist Gestaltung. |
| Kachel Trade Republic „6 von 12 / Islamic ETFs“ (Z. 95-99) | mittelbar (Kaufbarkeit; „Islamic“ im Namen ist keine Aussage) | Begleitdatei Z. 18; https://assets.traderepublic.com/assets/files/DE/Instrument_Universe_DE_de.pdf | trägt (mit Hinweis 5) | Handelsuniversum neu durchsucht (PDF, 28.10.2026): 6 der 12 ISINs stehen darin (IE00B27YCN58, IE00B27YCP72, IE00B296QM64, IE000UOXRAM8, IE000LFC57H7, IE00BMYMHS24), 6 nicht (IE000X9FTI22, IE000I5NV504, IE000AGFZM58, IE0009BC6K22, IE00B4ZJ4634, LU2458330086). Das deckt sich mit der Kachel. Tatsache zum Angebot, kein Urteil über den Anbieter. |
| „Die bekanntesten Depots sind nicht die besten für Muslime.“ (Z. 93) | mittelbar (Eignung „für Muslime“) | Begleitdatei Z. 19, getragen von den zwei Kacheln darunter | trägt (mit Hinweis 6) | Kein halal oder haram, kein Zitat einer Gelehrtenposition. Der Satz steht über genau zwei belegten Tatsachen (6 von 12 Islamic ETFs, Verzinsung automatisch aktiviert) und misst nach den zwei Maßstäben, die die Seite selbst nennt. Die Belegzeile hat nicht die Form `Beleg: …`, verweist aber auf die zwei Belege, die sie haben. |
| S-b3cfaf2d „… welche Anbieter zinsfrei sind.“ (Z. 9) und S-968de41c „… welche zinsfrei sind und welche deine Islamic ETFs haben.“ (Z. 110) | direkt (Zins) | brokerVergleich.ts, quellen.zinsfreiAbStart (flatex-PDF); anlagenKaufbar.ts | trägt | Der Satz sagt, dass gerankt wurde; je Angebot liegt ein Anbieter-Beleg im Datensatz. Das flatex-PDF habe ich nicht erneut lesen können (curl bekam HTML); Vorrunde 5 hat „Guthabenzins 0,00 % p. a.“ dort gelesen. |
| S-a1ea1096 „Prüf, ob deins Zinsen zahlt“ (Z. 114) | direkt (Zins) | https://www.xtb.com/de/zinsen, 17.09.2026 | trägt | Gleiche Anbieter-Seite wie oben. Der Satz behauptet nur, dass manche Depots Zinsen zahlen. Das Abrufdatum 17.09. ist älter, die Stelle steht am 28.10. unverändert auf der Seite. |
| S-80e26077 „Girokonten ohne Zinsen ansehen“ (Z. 23) und S-d4c52573 „Girokonto ohne Zinsen“ (Z. 131) | direkt (Zins) | https://dok.dkb.de/pdf/plv_pk_konten.pdf, Abschnitt 2 Einlagen auf Konten, 20.09.2026 | trägt | PDF geöffnet: „Guthabenzinsen (variabel) für Guthaben auf dem Girokonto, Girokonto u18 und Basiskonto 0,00% p. a.“ Anbieter-Dokument. |
| „Bei den meisten davon läuft das automatisch.“ | nicht mehr im Text | Begleitdatei Z. 11 | entfällt | Der Satz steht in der Fassung dieser Runde nicht mehr in `portfolio-plan.txt`. Die Belegzeile ist überzählig, kein Fehler. |
| Sukuk „Beispiel: iShares USD Sukuk“ und S-d799ddca „iShares II plc, Verkaufsprospekt (Shari'ah Panels …)“ (Z. 29-33, 122) | mittelbar und direkt | BlackRock iShares-II-Prospekt, Begleitdatei Z. 14 | trägt | Wörtliche Zitate mit Abschnittsnamen: „The Shari'ah Equity Funds Panel has issued a Fatwa …“ und „The Sukuk Fund Panel has issued a Fatwa …“. Nicht neu geöffnet, Vorrunde 5 hat beide Zitate im PDF gefunden. Der Text nennt nur „Shari'ah Panels“, nicht mehr als die Quelle. |
| Islamic ETF „Hunderte Firmen mit einem Kauf, jedes Quartal geprüft.“ (Z. 43) | mittelbar | Begleitdatei Z. 15, Prospekt S. 88 | trägt | „reviewed on a quarterly basis by the MSCI Shari’ah Board“, in Runde 5 im PDF gefunden. „Hunderte Firmen“ ist keine Halal-Aussage. |
| Gold „Beispiel: Invesco Physical Gold“ und S-ff2ae8be „Invesco Physical Gold ETC, Shariah-Zertifikat 2025“ (Z. 35-39, 123) | mittelbar und direkt | Invesco SSB-Zertifikat 2025, Begleitdatei Z. 13 | trägt | Titel des Dokuments „ANNUAL SHARIAH COMPLIANCE CERTIFICATE FINANCIAL YEAR END 2025“, in Runde 5 geöffnet. Der Text nennt es ein Zertifikat, nicht mehr. |
| Krypto „Beispiel: Bitcoin“, „Shariyah Review Bureau, Analyse zu Bitcoin“, „Einzelaktien und Krypto sind freiwillig“ (Z. 55-59, 124, 163) | mittelbar (Baustein im Portfolio „als Muslim“) | https://shariyah.net/cryptocurrencies/bitcoin/ (nur im Code, Begleitdatei Z. 12 erklärt den Titel) | trägt (mit Hinweis 7) | In Runde 5 geöffnet: „by no means a fatwa“. Der Text sagt „Analyse“ und „freiwillig und mit Vorsicht“, er behauptet kein Gutachten und keine Fatwa. In dieser Runde nicht neu geöffnet. |
| Einzelaktien „Jede braucht ihre eigene Prüfung. Beispiel: Zoya, eine App zum Prüfen“ (Z. 49-51) | mittelbar | keiner nötig | trägt | Kein Urteil über eine Firma oder über Zoya, nur die Pflicht zur Prüfung je Firma. |
| Titel „Dein Portfolio als Muslim in vier Schritten“ (Z. 1) und „Die Pläne sind Beispiele, keine persönliche Empfehlung“ (Z. 118) | mittelbar | Belege der Bausteine, Begleitdatei Z. 12 | trägt | „Halal“ steht nicht im Titel. Jeder Baustein hat einen Beleg oder spricht kein Urteil aus. |
| „Wächst ruhig, schwankt mittel“, „brachte langfristig im Schnitt am meisten“, „keine Garantie“ | keine Halal-Aussage | , | trägt (kein Beleg nötig) | Schwankung und Ertrag, keine Erlaubtheit. |
| Mittelbare Sätze ohne Beleg gesucht („bleibt sauber“, „ohne schlechtes Gewissen“, „passt zu deinen Werten“, „für Muslime geeignet“, „erlaubt“, „verboten“) | mittelbar | , | keine gefunden | Im ganzen Text nicht vorhanden. „Du willst die besten finden?“ (Z. 108) bezieht sich auf die Rangliste nach Zinsfreiheit und Islamic ETFs, belegt wie oben. |

## Hinweise ohne Einfluss auf das Urteil

1. Quran-Wortlaut: Die Begleitdatei zitiert „Sahih International“. Die geöffneten quran.com-Seiten zeigten bei mir die Übersetzung von Dr. Mustafa Khattab (The Clear Quran), nicht Sahih International. Sinn und Fundstelle (Sure 2, Vers 275 und 278) sind gleich, aber der angegebene Wortlaut steht nicht auf der Seite, wie sie bei mir erschien. Vorschlag: In der Belegzeile die Übersetzung nennen, die die Seite wirklich zeigt, oder den Wortlaut von dort nehmen. Der veröffentlichte Satz nennt keine Übersetzung.
2. Wise zählt als Konto mit Zinsen (Wert „teils“), die Anbieter-Seite nennt es „cashback“, nicht „Zinsen“. Ohne Wise wären es 6 von 54, also eher „jedes neunte“. Die Zahl „etwa jedes achte“ hängt an diesem einen Konto. Vorschlag: Wise-Zeile in der Begleitdatei erwähnen oder die Zahl auf „etwa jedes achte bis neunte“ weiten, wenn Wise wegfällt.
3. Die Belegzeile S-db6601ce zeigt als Beleg nur C24. Die Zahl 7 von 54 stützt sich auf den Datensatz, nicht auf die C24-Seite. Das C24-Zitat ist der Beleg für „es gibt Girokonten mit Zinsen“, die Zählung steht im Code (`girokontoAnzeige`), und ich habe sie nachgezählt.
4. XTB: Die Seite bindet den Willkommenszins an Bedingungen (Konto ab 14.10.2026, 90 Tage, monatlicher Kauf oder Verkauf). „Die Verzinsung wird automatisch aktiviert“ gilt für die Aktivierung. Die Kachel sagt genau das und nichts über die Höhe.
5. Zwei der 12 Produkte sind aktive Fonds, keine ETFs (Comgest, `halalAnlagen.ts`: „aktiver Fonds, kein ETF“). Die Kachel sagt „Islamic ETFs“. Genauer wäre „Islamic ETFs und Fonds“. Das ist Kaufbarkeit, keine Halal-Aussage.
6. Der Satz „Die bekanntesten Depots sind nicht die besten für Muslime.“ trägt nur über den zwei Kacheln. Wird er von ihnen getrennt oder um weitere Anbieter erweitert, braucht er Belege je Anbieter.
7. Die Wortliste fängt „Shariyah“ nicht (`shari'?a\w*`). Vorschlag aus Runde 4: `shari'?y?a\w*`. Dadurch hat die Bitcoin-Zeile keine Belegzeile in der Begleitdatei, die der Befehl prüft. Offen, ohne Folge für diese Fassung des Textes.

Urteil Halal-Prüfzeile: grün
