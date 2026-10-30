# Abnahme Kasten „Dein nächster Schritt“, Runde 2 (frischer Prüfer, MC7d4)

**Urteil: besteht nicht.** Der Kasten selbst ist gut und trifft Elias' Wunsch fast ganz. Zwei Dinge sperren: Auf dem Gold-Plan steht der Block, den Elias „kann alles weg“ nannte, weiter direkt über dem Kasten (M1). Und die FERTIG-Antwort ist noch nicht gebaut (M2, alter Fund P1, sperrt nur den Livegang, nicht den Zweig).

Stand 30.10.2026, 07:45. Zweig `mc7d3-kasten`, HEAD `316848a`, Diff gegen `00390e2`. Vorschau `localhost:8093`. Bilder in `/private/tmp/claude-501/-Users-eliasel-gendy/e2385bab-5ed2-4593-b52b-1518815df3cb/scratchpad/pruef4/` (`<wort>-390.jpg` je Freebie, `<wort>-uebergang-390.jpg` und `-360.jpg`, `start-390.jpg`, `start-360.jpg`, `depot-ziel.jpg`).

Offenlegung: Die Datei mit Elias' Wortlaut enthält die „Lesart der Sitzung“ im selben Dokument, sie wurde beim ersten Lesen mit ausgegeben. Mein Urteil zu jedem Punkt habe ich am Wortlaut gebildet. Zur Lesart steht unten ein eigener Abschnitt.

## Gemessen und belegt (besteht)

| Prüfung | Ergebnis |
|---|---|
| Kasten auf allen acht Seiten | ja: liste, aktie, vertrag, amin, boykott, plan, etf, gold |
| Höhe bei 390 px | 442 px (vorher 494 bis 516), bei 360 px 486 px. „Kasten ein bisschen kleiner“ erfüllt |
| Wörter | 74 (vorher 86 bis 91) |
| Seitlicher Überlauf | keiner, `scrollWidth` gleich Breite auf allen acht Seiten und `/vergleich/start`, bei 390 und 360 px |
| Links im Kasten | genau einer je Seite, `/vergleich/depot?src=k<wort>`; Route existiert (`src/App.tsx` Z. 150) |
| Klickzählung | alle acht `k<wort>` in `src/lib/attribution.ts` Z. 71 bis 78, `kgold` neu. Klick auf Gold geprüft: `sessionStorage.amanah_src = kgold` |
| Werbezeile weg | ja. Die Zielseite trägt die Kennzeichnung selbst („Zum Angebot*“) |
| „5 €“ hält | Nummer 1 auf der Zielseite (Traders Place) Sparplan ab 1 €, ebenso Scalable, finanzen.net zero, Trading 212, comdirect (`src/data/brokerVergleich.ts`, Feld `sparrate`) |
| Profi-Guide 15 Seiten | selbst gezählt: `public/guides/finanzmuslim-profi-guide.pdf` 15 Seiten, `src/guides/profi.html` 15 Abschnitte, letzte Fußzeile „Seite 15“. Elias sagte „10-seitig“, 15 ist richtig |
| Zahlenfarbe, graue Zeile, „den Test“ | alte Funde P4, P2 (Zeile), P3 erledigt |
| Typprüfung, Tests, Lint | `tsc` 0 Fehler, `vitest` 569 bestanden, `eslint` auf den sechs Dateien ohne Meldung |

## Muss vor live

**M1. Gold-Plan: „Du willst die besten finden?“ steht weiter direkt über dem Kasten.**
- Ort: `src/pages/GoldPlan.tsx` Z. 203 bis 211 (Block `FindeDeinAngebot`), Bild `gold-uebergang-390.jpg`.
- Was falsch ist: Elias: „Du willst die besten finden … das kann alles weg.“ Auf Portfolio- und ETF-Plan ist der Block weg, auf Gold steht derselbe Block mit demselben Titel jetzt sogar zum ersten Mal direkt über einem Kasten. Ergebnis im Bild: zwei hellblaue Kästen hintereinander, zwei Aufrufe, zwei Ziele (Gold-Vergleich, Depot-Vergleich). Genau das hat der letzte Prüfer auf plan und etf als H1 bemängelt.
- Beleg: Wortlaut oben. `~/.claude/CLAUDE.md` Abschnitt 1: „Ein Beispiel ist ein Bild für eine Sorge und gilt für alle Fälle der Art.“ Der Gold-Vergleich bleibt erreichbar über den Link oben auf der Seite (`GoldPlan.tsx` Z. 107).
- Vorschlag: Block auf Gold genauso streichen wie auf plan und etf, oder Elias mit dem Bild fragen, ob Gold die Ausnahme ist.

**M2. „Schreib mir FERTIG … Dann schicke ich ihn dir.“ hat noch keinen gebauten Weg (alter Fund P1, weiter offen).**
- Ort: `src/components/NaechsterTeil.tsx` Z. 40 bis 44; `~/Desktop/agentos/scripts/scheduler/zoho_antworten.py` Z. 116 bis 122 und Z. 55 bis 63.
- Was falsch ist: Das Wort „sofort“ ist richtig gestrichen. Aber: Eine neue Mail mit „FERTIG“ ohne „guide“ im Betreff wird nicht erkannt. Wer auf M1 antwortet („Ich schicke dir den Profi-Guide nicht.“), wird erkannt, bekommt aber Links auf `amanah-invest.de` und dazu den Fortgeschritten-Guide. Instagram-FERTIG fehlt in ManyChat (Stand `data/stand/rebrand.md` Z. 7).
- Beleg: Code oben; die gelieferte Datei `amanah-invest.de/amanah-profi-guide.pdf` hat zwar auch 15 Seiten, liegt aber auf der alten Domain.
- Vorschlag: Kasten erst mit MC7c live, dort die Antwort auf `finanzmuslim.com/guides/finanzmuslim-profi-guide.pdf` und auf Mails ohne „guide“ im Betreff umstellen.

## Sollte

**S1. Der Leser erfährt nicht, was im Profi-Guide steht.**
- Ort: `src/data/leiter.ts` Z. 21 bis 22 (`grund`).
- Was fehlt: Der alte Fund P2 wollte die graue Zeile weg und die Vorschau in den Satz. Die Zeile ist weg, die Vorschau aber ganz. Der 40-Jährige liest „Guide für echte Profis, 15 Seiten“ und denkt: „Ich bin kein Profi, brauche ich das?“ Sein Antrieb für Depot plus 5 € ist nur Neugier auf ein unbekanntes Etwas. Das Vorbild (`fortgeschritten.html` Z. 286 bis 289) nennt vor dem Kasten genau, was drin ist: Zakat-Faustformel, steuerfreies Gold, Halal-Check für Riester.
- Vorschlag: Den ersten Satz um zwei Inhalte aus der Liste „In diesem Guide lernst du“ der PDF ergänzen, etwa „Ich habe noch einen Guide für echte Profis vorbereitet, 15 Seiten: Zakat auf dein Depot und deine Steuervorteile.“

**S2. „per Mail“ ohne Adresse.**
- Ort: `NaechsterTeil.tsx` Z. 42.
- Was falsch ist: Der Leser steht auf einer Seite, nicht in einer Mail. Er weiß nicht, an welche Adresse. Das Vorbild sagt eindeutig „Antworte auf meine E-Mail mit FERTIG“ (`einsteiger.html` Z. 573). Dazu passt M2: Nur Antworten auf eine Guide-Mail werden erkannt.
- Vorschlag: „Antworte auf meine Mail mit FERTIG oder schreib es mir auf Instagram (@finanz.muslim).“ (Nur, wenn jede Strecke eine Mail hat; beim ETF-Plan lief laut Stand keine Lieferungs-Mail, das gehört dann zu MC7c.)

**S3. Wer schon ein Depot hat, weiß nicht, ob er gemeint ist.**
- Ort: `leiter.ts` Z. 23 bis 25.
- Was fehlt: „Öffne das beste Depot … und investiere deine ersten 5 €“ schließt den Leser aus, der schon investiert. Die alte Fassung hatte „Hast du schon ein Depot ohne Zinsen, reicht das“, das Vorbild „(oder Zweitdepot)“. Wer schon bei Trade Republic spart, rätselt, ob er ein zweites Depot eröffnen muss.
- Vorschlag: Elias fragen, ob der halbe Satz zurück soll („Hast du schon eins ohne Zinsen, reicht das.“); er wollte den Kasten kleiner, darum nicht ohne sein Wort.

**S4. Plan und ETF: Der Abschnitt „Wo kaufe ich?“ endet in zwei Warnungen, die Antwort steht erst im Kasten nach dem Guide-Text.**
- Ort: `PortfolioPlan.tsx` Z. 323, `EtfPlan.tsx` Z. 194; Bilder `plan-uebergang-390.jpg`, `etf-uebergang-390.jpg`.
- Was falsch ist: Die Überschrift „Wo du es jetzt kaufst“ (plan) und „Wo kann ich sie kaufen?“ (etf) verspricht eine Antwort. Der Abschnitt endet jetzt mit der roten Kachel „XTB Zinsen automatisch eingeschaltet“. Danach kommt „Der Profi-Guide liegt schon bereit“, ein Themenwechsel. Der Weg zur Antwort ist da (blauer Link in Schritt 1, im selben Schirm), aber der Abschnitt wirkt abgeschnitten. Die Regel `memory/freebie-seiten-simpel-beispiel-im-kontext.md` Z. 18 und 19 sah nach den schlechten Beispielen genau den jetzt gestrichenen Aufruf vor.
- Vorschlag: Elias die zwei Übergangsbilder zeigen; wirkt es abgeschnitten, eine Zeile ohne Knopf als Brücke setzen, sonst so lassen.

**S5. Überschrift des Tests: lässt sich als „Konten fertig in einer Minute“ lesen, und sie hat 7 Wörter.**
- Ort: `src/data/vergleichAssistent.ts` Z. 264, Bild `start-390.jpg`.
- Was falsch ist: „Deine Konten ohne Zinsen in einer Minute“ hat kein Verb. Ein Laie kann lesen, er habe in einer Minute ein Konto, obwohl ein Depot rund 10 Minuten und eine Prüfung braucht. Sprachregel 2 (Verb vorn) und 6 (drei bis fünf Wörter) in `CLAUDE.md`. Elias selbst begann mit „Dann finde dein …“. „Ohne Zinsen“ statt „halal“ ist richtig begründet (Halal-Befehl), „eine Minute“ ist bei elf Fragen haltbar.
- Vorschlag: „Finde in 1 Minute Konten ohne Zinsen“; Regel 6 lässt sich mit Zeit und Gegenstand nicht halten, das entscheidet Elias.

## Hinweise außerhalb des Auftrags

- **H1** `src/data/leiter.ts` Z. 16 bis 17 sagt „Derselbe Wortlaut steht in den Mails M1“. Stimmt nicht: M1 sagt „das Depot, das zu dir passt“ (Superlativ-Verbot in Mails, `~/rebrand/mails/bauen.py` Z. 996 bis 998) und behält die Werbezeile. Kommentar berichtigen, damit niemand „angleicht“.
- **H2** Der Profi-Guide beginnt mit „Stufe 3 von 3 … Du prüfst bereits sauber und baust bewusst auf“. Wer von der Boykottliste kommt, überspringt Stufe 1 und 2. Elias' Entscheidung („Profi-Guide für alles“), nur zum Wissen.
- **H3** Boykott: Direkt über dem Kasten steht weiter „Schon ein Depot? Prüf, ob deins Zinsen zahlt“ (gleiches Ziel wie der Kasten, Bild `boykott-uebergang-390.jpg`). Auf dem Portfolio-Plan ist dieselbe Zeile als Teil von „alles“ gestrichen.
- **H4** Alte Funde H2 und H3 stehen noch: „Zum Spickzettel“ direkt über dem Kasten (liste, aktie) und der Newsletter-Kasten direkt danach (Bild `liste-390.jpg`).
- **H5** Die Regel `memory/freebie-seiten-simpel-beispiel-im-kontext.md` schreibt den Block „Du willst die besten finden?“ weiter vor. Sie braucht einen Nachtrag vom 30.10., sonst baut das nächste Freebie ihn wieder ein.
- **H6** Reste: `DEPOT_LOGOS` und `ETF_DEPOT_LOGOS` nur noch in Tests benutzt, Klickquellen `…mitte` und `planende` werden nicht mehr erzeugt. Aufräumen bei Gelegenheit.
- **H7** Elias: „Guck mal, was du da noch machen kannst.“ Am Test-Einstieg wurde nur die Überschrift geändert. Über ihr steht weiter „Bonus für dich bis zu 200 €“ als zweites Versprechen.

## Laie, 40, am Handy

- Was soll ich tun: verstanden. Ein Depot über den blauen Link öffnen, 5 € anlegen, FERTIG schreiben.
- Was bekomme ich: „einen Guide für echte Profis, 15 Seiten“. Was drin ist, weiß er nicht (S1).
- Warum nicht sofort: verstanden, „Lesen fühlt sich an wie Fortschritt, ist es aber nicht“. Ruhiger als vorher, klingt nach Elias.
- Wo er stockt: „per Mail“ an wen (S2), und „deine ersten 5 €“, wenn er schon ein Depot hat (S3).

## Lesart der Sitzung

Stimmt in allen fünf Punkten mit meinem Urteil am Wortlaut überein: Block weg, Werbezeile nur im Kasten weg, ein Schritt für alle mit „freier wie beim Guide“, Profi-Guide für alle mit 15 statt 10 Seiten, Zusage mit Zeit im Test. Zwei Lücken: Sie hat „kann alles weg“ auf den ETF-Plan übertragen, aber nicht auf den Gold-Plan mit demselben Block (M1). Und „Guck mal, was du da noch machen kannst“ ist nur zum Teil umgesetzt (H7).
