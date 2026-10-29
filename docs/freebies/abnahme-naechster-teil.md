# Abnahme Kasten „Dein nächster Schritt“ (Station g, frischer Prüfer)

Stand 30.10.2026, 00:05. Geprüft: sieben Handy-Bilder (390 px) aus `scratchpad/pruef-schirme/`, Gold als Gegenprobe, dazu eigene Messung mit puppeteer an `localhost:8093` (390 x 844) auf allen sieben Seiten. Vorbild: `src/guides/einsteiger.html` Z. 566 bis 577 mit `guide.css` Z. 218 bis 227. Code: `src/components/NaechsterTeil.tsx`, `src/data/leiter.ts`.

**Wichtig vorab:** `leiter.ts` wurde um 00:04 geändert, nach den Bildern (00:01). Die Bilder zeigen noch „zählt das auch“ und beim Plan „Darin: wo du Islamic ETFs kaufen kannst“. Geprüft ist der heutige Code: „reicht das“ und „Darin: wie ein Islamic ETF Banken aussortiert und welche es gibt“. Der Wortlaut stimmt mit M1 in `~/rebrand/mails/bauen.py` Z. 992 bis 1007 überein.

## Gemessen

| Seite | Kasten hoch | Wörter | Links im Schirm darüber | Link im Kasten |
|---|---|---|---|---|
| liste | 494 px | 86 | Depot-Vergleich (`/vergleich/depot`), Zum Spickzettel (`/vorlagen/aktien-check`) | den Test (`/vergleich/start`) |
| aktie | 494 px | 86 | Depot-Vergleich, Zum Spickzettel | den Test |
| vertrag | 494 px | 86 | Zu den Vergleichen, Depot-Vergleich | den Test |
| amin | 494 px | 86 | Geprüfte Anlagen, Depot-Vergleich | den Test |
| boykott | 494 px | 86 | Prüf, ob deins Zinsen zahlt (`/vergleich/depot`) | den Test |
| plan | 516 px | 91 | Zum Depot-Vergleich (`/vergleich/depot`), Prüf, ob deins Zinsen zahlt (`/vergleich/depot`) | das Depot, das zu dir passt (`/vergleich/start`) |
| etf | 494 px | 84 | Zum Depot-Vergleich (`/vergleich/depot`, 365 px über dem Link im Kasten) | einen Sparplan auf einen Islamic ETF (`/vergleich/depot`) |

Kein seitlicher Überlauf (scrollWidth 390 überall). Der Kasten passt auf einen Schirm. Vorbild zum Vergleich: rund 84 Wörter, aber auf einer ruhigen A4-Seite, nicht am Ende einer langen Handy-Seite.

## 1. Fünf Sekunden je Bild

- **liste, aktie, vertrag, amin** (gleicher Kasten): Ruhig, klar als Abschluss erkennbar. Was liegt bereit: „Dein Portfolio-Plan“, sofort verstanden. Was soll ich tun: „Mach den Test“, hier stocke ich: welcher Test? Auf der Seite wurde kein Test erwähnt. Was passiert dann: FERTIG schreiben, dann kommt er, verstanden. Gefühl: Der Kasten ist der dritte Aufruf hintereinander. Direkt darüber stehen zwei weiße Karten mit blauem Knopf (Depot-Vergleich, bei liste und aktie dazu Zum Spickzettel). Die Seite endet gefühlt dreimal.
- **boykott:** Gleicher Kasten. Darüber steht „Schon ein Depot? Prüf, ob deins Zinsen zahlt“, im Kasten dann „Hast du schon ein Depot ohne Zinsen, reicht das“. Zweimal dieselbe Frage auf 300 px, aber es passt zusammen: Erst prüfen, dann zählt es.
- **plan:** Was liegt bereit: ETF-Plan, klar. Was tun: Depot eröffnen und 5 € anlegen, verstanden, aber der größte Schritt der Leiter. Gefühl: Auf einem Schirm stehen drei Wege zum Depot (Knopf, Prüf-Link, Link im Kasten), zwei davon führen auf den Depot-Vergleich, der im Kasten auf den Fragebogen. Gleiches Anliegen, zwei verschiedene Ziele.
- **etf:** Was liegt bereit: Gold-Plan, „Wette auf den Preis“ macht neugierig. Was tun: Sparplan einrichten, klar. Der Link im Kasten führt aufs selbe Ziel wie der große Knopf direkt darüber.
- **gold (Gegenprobe):** Kein Kasten, richtig so (keine Sukuk-Belohnung). Das Versprechen des etf-Kastens hält: Die Gold-Seite hat den Abschnitt „Beim Broker oft nur eine Wette“.

## 2. Drei Laien

- **Student, 19:** Überfliegt, versteht „liegt bereit“ und FERTIG sofort. Tippt „den Test“ und landet auf „Wobei kann ich dir helfen?“ mit „Bonus für dich bis zu 200 €“: kein Test zu sehen, er klickt trotzdem weiter. Schreibt FERTIG per Instagram-DM, weil das sein Kanal ist. Heute kommt dort nichts (siehe Fund P1). Danach glaubt er dem nächsten Versprechen nicht mehr.
- **Mutter, 40:** Liest gründlich. Stockt bei „den Test“ (Test wovon, über mich?) und bei „Hast du schon ein Depot ohne Zinsen“: Sie weiß nicht, ob ihr Depot Zinsen zahlt, also auch nicht, ob ihres zählt. Der Satz „Lesen fühlt sich an wie Fortschritt, ist es aber nicht“ wirkt auf sie leicht belehrend, weil der Schritt danach auch nur Fragen beantworten ist. Würde vermutlich den Test machen und per Mail FERTIG schreiben.
- **Vater, 60:** „Portfolio-Plan“ und „Islamic ETF“ sind fremd, „100, 300 oder 500 € im Monat“ holt ihn zurück. Instagram (@finanz.muslim) nutzt er nicht, die Mail-Antwort versteht er. Den Plan-Schritt (Depot eröffnen, 5 € anlegen) macht er diese Woche nicht. Der Kasten ist ihm nicht zu lang, aber zwei FERTIG in einem Satz liest er doppelt.

Ob sie den Schritt machen und FERTIG schreiben: Student ja, Mutter wahrscheinlich, Vater beim Einstieg ja, beim Plan nein. Was sie am meisten abhält, ist das unklare „den Test“, nicht die Länge.

## 3. Prüfzeilen

| Zeile | Ergebnis | Begründung |
|---|---|---|
| T1 Titel mit Aussage | bestanden | „Dein Portfolio-Plan liegt schon bereit.“ nennt, was der Leser bekommt, weckt Vorfreude, 5 Wörter (Sprachregel 6) |
| T2 keine Unterzeile | **Fund (Pflicht)** | Graue Zeile „Darin: …“ (`text-foreground/80`) direkt unter dem H2. Das Vorbild hat dort keine, unter seinem H2 folgt gleich der Grund-Absatz |
| T3 Obergrenze je Schirm | Fund, durch Elias' Vorbild gemildert | Titel plus Unterzeile plus zwei Sätze plus Liste plus Schlusszeile. Elias wollte den Aufbau „wie früher im Guide“, darum gilt das Vorbild als Obergrenze: Es hat keine Unterzeile, also mindestens die eine Zeile zu viel |
| 3.3 Halbieren-Probe | **Fund (Pflicht)** | Mit rund 50 Wörtern funktioniert der Kasten noch ganz (Vorschlag unten) |
| 3.4 Wörter je Satz | bestanden | Längster Satz 16 Wörter (FERTIG-Satz), Mittel rund 10 |
| 3.6 Zeichen und Wendungen | bestanden | Echte Umlaute, keine Gedankenstriche, kein Ausrufezeichen. „100, 300 oder 500 €“ ist die Geld-Auswahl der Seite, keine rhetorische Dreierreihe. „und das hat einen Grund“, „ist es aber nicht“, „Versprochen.“ sind Elias' Wortlaut aus dem Vorbild |
| Sprachregel 8 keine ganzen Wörter in Großbuchstaben | bestanden mit Grund | FERTIG ist das Antwortwort aus dem Vorbild und wird so erkannt. Aber zweimal im selben Satz ist einmal zu viel (Kürzung 3) |
| 4.4, 4.5 Schrift | bestanden | Drei Größen (14, 16, 22 px), Fließtext 16 px, kleinste 14 px |
| Farben (CLAUDE.md) | Fund (klein) | Fläche `accent`, Etikett `violet`, Link `primary`: richtig. Die Zahlen „1.“ und „2.“ stehen in `primary`, obwohl sie nicht klickbar sind. Blau ist für Klickbares. Das Vorbild färbt die Zahlen in der Etikettenfarbe (`guide.css` Z. 224, `.gn` wie `.gate-label`) |
| 12.1 Etikett über dem Titel | bestanden mit Grund | „Dein nächster Schritt“ steht wortgleich im Vorbild (`gate-label`), Violett ist laut CLAUDE.md die Farbe für Etiketten |
| 12.2, 12.6 | bestanden | Keine Serife, keine Icon-Kacheln, keine Häkchenreihe |
| 12.3 nummerierte Abschnitte | bestanden | Nummern nur in einer Schrittliste innerhalb des Kastens, wie im Vorbild |
| 12.7 jedes Stilmittel mit Regel | Fund (klein) | Siehe Zahlenfarbe |
| 12.8 Mensch oder Maschine, neben dem Vorbild | ja, ja | Wirkt gemacht und ruhig. Gleiche Klasse wie das Vorbild, in Hell statt Dunkel, was zur Regel „Flächen bleiben ruhig“ passt |
| 12.10 Element für Element | Fund | Ohne Vorbild: die graue Zeile „Darin:“ (T2) und der Kanal Instagram. Instagram hat eine Quelle (Entwurf MC7b Abschnitt 2, FERTIG auch per DM), ist aber noch nicht gebaut (P1) |
| T9 ein Weg je Ziel (sinngemäß) | Hinweis | plan: drei Depot-Links auf einem Schirm, zwei Ziele. etf: Link im Kasten = Knopf darüber. Elias entscheidet |
| 11 Handy | bestanden | Kein Überlauf, Kasten 494 bis 516 px, passt in einen Schirm |
| Inhalt: nichts versprechen, was es nicht gibt | **Fund (Pflicht, sperrt live)** | Siehe P1 |

## 4. Funde mit Vorschlag

**P1, alle sieben Seiten, Schritt 2: „Dann kommt er sofort.“ stimmt heute nicht.**
- Mail: `~/Desktop/agentos/scripts/scheduler/zoho_antworten.py` Z. 116 bis 122 erkennt FERTIG nur, wenn im Betreff „guide“ steht, und schickt dann die alten Guide-PDFs von amanah-invest.de (Z. 55 bis 69), nie Portfolio-, ETF- oder Gold-Plan. Stand auf dem Server gleich (letzte Änderung 10.10.).
- Instagram: Der FERTIG-Ablauf in ManyChat ist im Entwurf `2026-10-29-mc7b-bindung-entwurf.md` Abschnitt 2 als „neu“ geführt, der Bau MC7c ist offen (`data/stand/rebrand.md` Z. 9 und 166).
- etf: Die MailerLite-Gruppe ETF-Plan läuft laut Stand „ohne Lieferungs-Mail“. Wer über ETF kam, hat womöglich gar keine Mail von Elias, auf die er antworten kann.
- Vorschlag: Der Kasten geht erst mit MC7c live, gleichzeitig mit der Zuordnung der FERTIG-Antworten. Soll er vorher live, dann muss Schritt 2 ohne „sofort“ auskommen, Wortlaut: „Schreib mir FERTIG, per Mail oder auf Instagram. Dann schicke ich ihn dir.“

**P2, alle Bilder, Zeile „Darin: …“ (T2):** Die graue Zeile streichen. Die Vorschau wandert an den Ort der Belohnung, so wie M1 sie schon schreibt („dann kommt dein ETF-Plan: wie ein Islamic ETF Banken aussortiert und welche es gibt“, `bauen.py` Z. 1001). Wortlaut Schritt 2:
- liste bis boykott: „Schreib mir FERTIG, per Mail oder auf Instagram. Dann kommt dein Plan: wie du 100, 300 oder 500 € im Monat aufteilen könntest.“
- plan: „Schreib mir FERTIG, per Mail oder auf Instagram. Dann kommt dein ETF-Plan: wie ein Islamic ETF Banken aussortiert und welche es gibt.“
- etf: „Schreib mir FERTIG, per Mail oder auf Instagram. Dann kommt dein Gold-Plan: woran du beim Broker eine Wette auf den Preis erkennst.“

**P3, liste bis boykott, Schritt 1 „Mach den Test“:** Der Leser weiß nicht, welcher Test. Die Zielseite heißt „Wobei kann ich dir helfen?“. Wortlaut: „Mach [den Test, welches Depot zu dir passt], nur ein paar Fragen. Hast du schon ein Depot ohne Zinsen, reicht das.“ (Link auf dem Teil in Klammern, gleiches Ziel. Deckt sich mit der älteren Mail, `bauen.py` Z. 416: „Ein paar Fragen, dann siehst du, welches Depot zu dir passt“.)

**P4, alle Bilder, Zahlen „1.“ „2.“:** `text-primary` durch `text-violet` ersetzen, wie `.gn` im Vorbild. Dann bleibt Blau beim einen Link.

**H1, plan und etf, zweiter Weg zum selben Ziel (Hinweis, Elias entscheidet):** Bei plan führt „das Depot, das zu dir passt“ auf den Fragebogen, der Knopf 400 px darüber auf den Depot-Vergleich. Das Anliegen ist dasselbe, die Ziele sind verschieden. Vorschlag: Im Kasten dasselbe Ziel wie der Knopf (`/vergleich/depot`) oder der Wortlaut sagt, dass es der Test ist. Bei etf ist der Link im Kasten derselbe wie der Knopf. Das ist in Ordnung, weil der Kasten den Grund liefert, aber es ist ein zweiter Aufruf.

**H2, liste und aktie, „Zum Spickzettel“ direkt über dem Kasten (nicht Teil dieser Änderung):** Ein Verweis auf ein anderes Freebie am Seitenende. Das widerspricht der Regel „Im Kontext bleiben: kein Hinweis auf ein anderes Freebie am Ende“ (`memory/freebie-seiten-simpel-beispiel-im-kontext.md` Z. 22). Mit dem Kasten stehen jetzt zwei „nächste Freebies“ hintereinander. Elias würde das beanstanden. Vorschlag: Die Spickzettel-Karte auf den Voll-Seiten weglassen, der Kasten ist der eine nächste Schritt.

**H3, liste bis amin, Newsletter-Kasten nach dem Kasten (nicht Teil dieser Änderung):** „Mache mehr aus deinem Geld, in 5 Minuten pro Woche“ folgt direkt. Wer auf der Voll-Seite ist, hat seine Mail schon gegeben. Damit kommt nach dem Abschluss noch ein Aufruf. Vorschlag: Auf Voll-Seiten mit `naechster` die NewsletterBox weglassen.

**H4, liste bis boykott, Grund-Satz (Hinweis):** „Lesen fühlt sich an wie Fortschritt, ist es aber nicht“ passt im Vorbild, weil der Schritt dort eine echte Tat war (Depot, 25 €). Beim Einstieg ist der Schritt ein Fragebogen, also selbst kein Fortschritt. Das ist Elias' Wortlaut, und der Test als Sprosse 1 ist seine Entscheidung (Käuferrunde MC7b2). Darum nur ein Hinweis, keine Änderung.

## 5. Was der Inhaber beanstanden würde

- **Länge:** Ja, leicht. 86 Wörter am Ende einer langen Seite. Die graue Zeile und das doppelte FERTIG würde er als zu viel sehen.
- **Klang nach KI:** Kaum. Die tragenden Sätze sind seine aus dem Guide. Am ehesten fällt die graue „Darin:“-Zeile auf, die kleinen grauen Zeilen hat er zweimal ausdrücklich abgelehnt.
- **Verweis, der vom Freebie wegführt:** Der Kasten selbst nicht: Die Belohnung ist nicht verlinkt, der Link führt nur zum Vergleich. Die Spickzettel-Karte darüber schon (H2).
- **Zweiter Aufruf:** Ja. Auf liste und aktie ist der Kasten der dritte Aufruf in Folge (Depot-Vergleich, Spickzettel, Kasten), danach kommt noch der Newsletter. Bei plan führen drei Depot-Links zu zwei Zielen.
- **Farbe:** Ruhig, passt zur Seite. Einzig die blauen Zahlen (P4).
- **Was er am meisten beanstanden würde:** dass jemand FERTIG schreibt und nichts kommt (P1).

## 6. Kürzungsliste (Kasten liste bis boykott, rund 70 statt 86 Wörter)

1. Graue Zeile „Darin: …“ streichen, die Vorschau steht in Schritt 2 (P2).
2. Schritt 1: „Mach den Test, es sind nur ein paar Fragen.“ wird „Mach den Test, welches Depot zu dir passt, nur ein paar Fragen.“ Das ist kaum länger, aber klar (P3).
3. Schritt 2: „Schreib mir FERTIG auf Instagram (@finanz.muslim) oder antworte mit FERTIG auf meine Mail. Dann kommt er sofort.“ wird „Schreib mir FERTIG, per Mail oder auf Instagram. Dann kommt dein Plan: …“ (FERTIG einmal, Handle weg, Vorschau hier).
4. Freiwillig, falls noch kürzer gewünscht: „Ich schicke ihn dir nicht sofort, und das hat einen Grund.“ wird „Ich schicke ihn dir nicht sofort.“ Das kostet allerdings etwas von Elias' Ton, darum nur nach seinem Wort.

Fassung nach Kürzung (liste bis boykott):

> Dein nächster Schritt
> **Dein Portfolio-Plan liegt schon bereit.**
> Ich schicke ihn dir nicht sofort, und das hat einen Grund. Lesen fühlt sich an wie Fortschritt, ist es aber nicht.
> 1. Mach [den Test, welches Depot zu dir passt], nur ein paar Fragen. Hast du schon ein Depot ohne Zinsen, reicht das.
> 2. Schreib mir **FERTIG**, per Mail oder auf Instagram. Dann kommt dein Plan: wie du 100, 300 oder 500 € im Monat aufteilen könntest.
> **Du wirst ihn mit anderen Augen lesen. Versprochen.**

Laut Kopf von `leiter.ts` muss jede Wortänderung auch in M1 (`~/rebrand/mails/bauen.py`) nachgezogen werden.

## Urteil

**Besteht nicht.** Drei Pflicht-Funde: T2 (graue Zeile), 3.3 (halbierbar) und P1 (Versprechen „sofort“ ohne gebaute FERTIG-Antwort auf beiden Wegen). Dazu kleine Funde: P3 („den Test“ unklar) und P4 (Zahlenfarbe). Mit der Kürzungsliste besteht der Text. Live gehen darf der Kasten erst zusammen mit MC7c, also mit der FERTIG-Antwort für Mail und Instagram, oder mit dem Ersatz-Wortlaut aus P1.
