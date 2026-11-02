---
titel: Halal-Prüfzeile, frischer Prüfer, Sukuk-Plan (/dein-sukuk/sukuk-6tm2), Runde 2
stand: 2026-11-02
sitzung: MC7f-pruefer-r2
gegenstand: docs/freebies/sukuk-plan.txt (innerText der Seite, Startbetrag 100 €) nach dem Fix aus Runde 1, dazu Begleitdatei docs/freebies/sukuk-plan.txt.belege.md, src/data/sukukPlan.ts (Funktion vergleich) und PDF public/downloads/v/sukuk-6tm2/sukuk-plan.pdf; Stand Commit 8eacc35 (Branch mc7f-sukuk)
gelesen:
  - Vault fundament/grundlage/HALAL_PRUEFZEILE.md (Abschnitte Die Regel, Belegform, Prüfer 2)
  - docs/freebies/pruef/halal-sukuk-plan-r1.md (ganz)
  - docs/freebies/sukuk-plan.txt (ganz, 185 Zeilen)
  - docs/freebies/sukuk-plan.txt.belege.md (ganz, 21 Zeilen)
  - src/pages/wissen/Sukuk.tsx (Zeilen 1 bis 80, Abschnitte „Ein Sukuk ist kein Kredit“ und Tabelle „Sukuk und Anleihe nebeneinander“; der Rest in Runde 1 ganz gelesen)
  - src/data/sukukPlan.ts Zeilen 38 bis 50 (Funktion vergleich)
  - PDF sukuk-plan.pdf per pdftotext, Tabellenteil: gleich wie sukuk-plan.txt, kein „Aufschlag“, kein „am Ende zurück“
  - Ausgabe python3 fundament/audit/halal_aussagen.py … --belege …: 13 Sätze mit Treffer, 0 ohne gültigen Beleg, exit 0
---

# Halal-Prüfzeile Sukuk-Plan, Runde 2

Geprüft sind nur die geänderten und neuen Stellen; alles andere steht unverändert wie in Runde 1 und bleibt dort getragen. Prüfer 1 (Befehl) ist grün: 13 Treffer, alle mit Beleg. Einer weniger als in Runde 1, weil die Anleihe-Kachel „Der Betrag plus Zinsen.“ (S-6062759a) mit der ganzen Zeile entfallen ist; ihre Kennung steht auch nicht mehr in der Begleitdatei.

| Kennung oder Zitat | direkt oder mittelbar | Beleg | trägt, trägt nicht oder fehlt | Grund |
|---|---|---|---|---|
| Zeile „Was kommt am Ende zurück?“ mit „Der Betrag plus Zinsen.“ und „Der eingesetzte Betrag, ohne Aufschlag.“ (Runde 1 rot) | mittelbar (Rückzahlungszusage) | , | entfallen | Weder in sukuk-plan.txt noch im PDF noch in sukukPlan.ts (nur noch im Code-Kommentar, der den Grund nennt, nicht sichtbar). grep nach „Aufschlag“, „am Ende zurück“, „eins zu eins“, „zurück“, „sicher“, „garantiert“ im Text: kein Treffer. Der blockierende Fund ist behoben. |
| Neue Zeilenfrage „Wer trägt das Risiko?“ (Z. 53) | keine Halal-Aussage | Sukuk.tsx Z. 60, Tabelle „Sukuk und Anleihe nebeneinander“, Spalte Frage | trägt | Wortgleich. |
| Kachel Anleihe „Der Schuldner zahlt, solange er zahlungsfähig ist.“ (Z. 57) | keine Halal-Aussage | Sukuk.tsx Z. 60, Spalte Anleihe | trägt | Wortgleich. Beschreibt das Ausfallrisiko der Anleihe, kein Zins-, keine Halal-Aussage. |
| Kachel Sukuk „Grundsätzlich trägst du das Risiko der Sache mit.“ (Z. 61) | mittelbar (Gewinn- und Verlustbeteiligung, also das Gegenteil einer Garantie) | Sukuk.tsx Z. 60, Spalte Sukuk; Begleitdatei Z. 19 | trägt | Wortgleich. Erzeugt keine Zusage und kein Halal-Urteil, sondern nennt das Risiko, das Runde 1 vermisst hat. Zusammen mit „Sukuk-Fonds schwanken weniger …“ (Z. 63) liest sich die Seite nicht mehr als Sicherheit des eingesetzten Geldes. |
| Begleitdatei Z. 19 (neu gefasst) | , | , | trägt | Nennt die neuen Kacheln als wortgleich aus der Tabelle des Beitrags und dass die Zeile „Was kommt am Ende zurück?“ auf den Fund von Runde 1 hin raus ist. Stimmt mit Text, PDF und Code überein. |
| Übrige Kennungen S-a23a54ea, S-54e2ef14, S-d3b99003, S-0feb3a34, S-1b553fa3, S-021b520d, S-62ed3e50, S-3b5dc0e6 (dreimal), S-fad21e10, S-25924247, S-3981426e | wie Runde 1 | wie Runde 1, Begleitdatei unverändert | trägt | Wortlaut im Text und Beleg in der Begleitdatei unverändert gegenüber Runde 1; dort Satz für Satz gegen die Quellen gehalten. Keine neue Aussage zu halal, haram, Zinsen oder einer Garantie durch die Änderung. |

Urteil Halal-Prüfzeile: grün
