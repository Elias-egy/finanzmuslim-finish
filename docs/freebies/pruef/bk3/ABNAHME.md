# Abnahme BK3: Kasten „Das geht stattdessen“ und Footer-Satz (Boykott-Liste)

Prüfer ohne Bau-Kontext, 28.10.2026. Geprüft nur das Neue: vier Kästen, Footer-Satz mit den sechs Listen. Vorgaben von Elias (nicht anklickbar, „steht auf keiner der geprüften Listen“, HalalBooking als sein Beispiel) gelten und werden nicht beanstandet.

## Urteil: GELB

Fakten tragen: Keine der acht Marken und keiner ihrer genannten Eigentümer steht in einer der sechs gesicherten Listen (selbst mit grep gegengeprüft, Test `boykottListe.test.ts` läuft grün, 9 Tests). Das Bild ist sauber. Zwei Pflicht-Funde sind kleine Textkorrekturen (Jako, Footer-Satz „wem die Marke gehört“). Danach grün.

## A. Fakten

Gegenprobe (grep ohne Groß-/Kleinschreibung in den sechs Dateien): Null Treffer für Fritz, Vita Cola, Hassia, Peter Pane, Paniceus, Call a Pizza, Wilde, LibreOffice, Document Foundation, HalalBooking, Seyidli, Miele, Zinkann, Jako, Sprügel, Karlsberg, Lütvogt, Wiegert. Der Satz „Steht auf keiner der geprüften Listen“ ist für alle acht Namen wörtlich wahr.

Nicht abgedeckt vom Test (nur Namen und Eigentümer, keine Geldgeber oder Förderer), aber in den Listen auffindbar:
- HalalBooking: CB Insights nennt als Geldgeber Barclays (steht bei Ethical Consumer, Boycat Level 1) und **HSBC Life**. HSBC Holdings steht in der AFSC-Datei (Zeile 129, Gefängnis-Finanzierer). Die Belege-Tabelle nennt nur Barclays. Der Satz auf der Seite bleibt wahr, weil Geldgeber keine Eigentümer sind.
- LibreOffice: Wikipedia nennt Google (steht auf der BDS-Liste dieser Seite, Gruppe „Druck“) und Red Hat (Who Profits) als Förderer. Die Kandidaten-Datei nennt das selbst „Angriffspunkt“, die Belege-Tabelle nicht.
- Siemens: „statt Geräten von Siemens“ ist im Sinne der Liste richtig. BDS schreibt: „Siemens-branded electrical appliances are sold globally“, und Ethical Consumer führt den Siemens-Boykott mit Profil „Robert Bosch Stiftung“ (die Hausgeräte baut BSH, Bosch). Miele ist deshalb eine echte Alternative, Bosch wäre keine. Die Seite lässt Bosch richtig weg.

### Fund 1 (Pflicht): Jako ersetzt Reebok nicht
Stelle: `src/data/boykottListe.ts` Bereich haushalt, `{ name: "Jako", statt: "Reebok" }`. Die Reebok-Karte sagt „Sportschuhe“. Die Kandidaten-Datei führt Jako „für Vereins- und Teamkleidung“ und schreibt wörtlich: „Für Laufschuhe: kein Kandidat belegt“. Ein 40-Jähriger, der Sportschuhe kauft, versteht „Jako statt Reebok“ als Schuh-Ersatz, und Jako kennt er kaum.
Regel: CLAUDE.md „Niemals Zahlen erfinden“, sinngemäß nichts behaupten, was der Beleg nicht trägt; Vorbild Kandidaten-Datei.
Vorschlag: `statt: "Reebok bei Vereinskleidung"` (Test greift weiter, „Reebok“ steckt drin), oder Jako streichen, dann hat der Bereich nur Miele. Ich empfehle die erste Fassung.

### Fund 2 (Pflicht): „Geprüft ist auch, wem die Marke gehört“ geht weiter als die Belege
Stelle: Footer, `BoykottListe.tsx` Zeile 242. Die Eigentümerketten sind nur teils belegt:
- Peter Pane: Paniceus hält 27,33 % der Holding, „weitere Gesellschafter: nicht genannt“.
- Fritz-Kola: zwei Quellen widersprechen sich (Investoren Lütvogt und Rehm gegen alleiniger Gesellschafter Wiegert), Handelsregister war nicht erreichbar.
- Jako: „keine Muttergesellschaft genannt“, nur Wikipedia.
- HalalBooking: Seyidli hält nach Companies House 25 bis 50 %, der Rest steht dort nicht.
„Geprüft“ liest sich wie lückenlos.
Regel: Belege vor Behauptung (CLAUDE.md Inhalt); Gegenstück: Elias will „steht auf keiner Liste“ statt „boykottfrei“, also bewusst die vorsichtige Zusage.
Vorschlag: „Geprüft ist auch, wem die Marke laut öffentlichen Angaben gehört.“ Dazu in der Belege-Tabelle je Zeile „Kette vollständig: ja/nein“.

### Fund 3 (Kann): Geldgeber und Förderer in die Belege-Tabelle
HSBC Life bei HalalBooking (AFSC-Liste) und Google/Red Hat bei LibreOffice als Zeile nachtragen, mit dem Satz, warum die Aussage trotzdem stimmt (Geldgeber, nicht Eigentümer). Seiten-Text unverändert. Grund: Wer es nachschlägt, soll die Antwort schon parat haben.

### Fund 4 (Kann): Boycat und No Thanks waren nicht abrufbar
LISTEN-INDEX: Beide Apps stehen nur in der App, nicht gesichert. Genau diese nutzen viele Boykottierende. Ehrlicher Zusatz im Footer, kurz: „Die Apps Boycat und No Thanks ließen sich nicht einsehen.“

### Fund 5 (Kann): Halal wird nirgends belegt
Die Seite behauptet nichts Halales, das ist richtig. Ein muslimischer Leser fragt trotzdem bei Peter Pane und Call a Pizza, ob das halal ist (Kandidaten-Datei: „Seite sagt nichts zu halal“, „nicht als halal belegt“). Ein halber Satz im Footer reicht: „Ob eine Marke halal ist, sagt diese Liste nicht.“ Das passt zum bestehenden „kein eigenes Urteil“.

## B. Am Bild (390 und 360, alle Kästen und Footer)

Gut: Kein Überlauf, kein Abschneiden, bei 360 nur ein Umbruch mehr („Expedia“ in der dritten Zeile). Logos rund, gleiche Größe, echt (Fritz-Kola, Vita Cola, Peter Pane, Call a Pizza, LibreOffice, HalalBooking, Miele, Jako). Abstände gleichmäßig, Kasten in `accent`-Hellblau wie die Beispiel-Unterkästen in Fassung 5, sitzt als Teil der Seite zwischen weißen Karten und nächstem Bereich. Nicht zu viel: höchstens vier Zeilen je Kasten. Nicht zu wenig: Technik und Reisen haben nur eine Marke, das wirkt dünn, ist aber ehrlich (Kandidaten-Datei: sonst keine belegte Alternative).
KI-Zeichen (Block 12): keine. Keine Icon-Kacheln, kein Verlauf, keine Häkchenreihe, keine Gedankenstriche. Logos sind echte Logos (12.5).

### Fund 6 (Kann): Die graue 12-Pixel-Zeile unter dem Kasten-Titel
Stelle: `AlternativenKasten`, zweite Zeile. Sie ist der leiseste Text im Kasten, steht direkt unter dem Titel und ähnelt damit der grauen Unterzeile, die T2 verbietet. T2 gilt streng nur für H1 und H2, der Kasten-Titel ist ein `<p>`, also kein Verstoß. Elias' Wortlaut bleibt. Wenn nachgeschärft wird: Zeile auf 14 Pixel, damit sie neben den „statt …“-Zeilen nicht kleiner wirkt.
### Fund 7 (Kann): Titel und Markennamen gleich stark
„Das geht stattdessen“ und die Namen sind beide 16 Pixel fett. Die Reihenfolge ist trotzdem lesbar. Nur ändern, wenn Elias den Kasten beim Ansehen als flach empfindet.
### Fund 8 (Kann): Footer-Liste ist schwer zu lesen
Sechs Links in einem Absatz, sieben Zeilen bei 12 Pixel, Titel mit Aktenzeichen („A/HRC/60/19“) und englischen Namen. Kürzer: „UN-Datenbank zu Firmen in Siedlungen“, „Who Profits“, „AFSC Investigate“, „Ethical Consumer, Palästina-Liste“, „Ethical Consumer, Boykott-Liste“. Verstößt sonst gegen CLAUDE.md Sprache 7 (Fachwörter vermeiden) und 3 (Aufzählung genau drei, hier sechs, aus der Sache nötig, daher nur Kann).

## C. Drei Laien

- **40-jähriger Deutsch-Türke:** Versteht sofort: Cola, Burger, Pizza, Büro, Hotel, Geräte. „statt Coca-Cola“ ist klar. Stolpert bei Jako (kennt er nicht, passt nicht zu „Sportschuhe“, Fund 1). Fragt bei Burger und Pizza nach halal (Fund 5).
- **60-jährige Frau:** Versteht „statt …“, kennt Miele und HalalBooking. LibreOffice und Jako sagen ihr nichts, bei LibreOffice hilft das Wort „kostenlos“ (Kann, steht in Wikipedia belegt: „Kostenlos“). „Geprüfte Listen“ bleibt unklar, bis sie den Footer liest. Vita Cola ist im Westen laut Kandidaten-Datei schlecht zu finden; sie könnte suchen und nichts finden.
- **22-jähriger Student:** Kennt Fritz-Kola, Peter Pane, LibreOffice, Call a Pizza. Fragt am ehesten „Wer sagt, dass die sauber sind?“ und wird im Footer fündig. Er könnte Boycat öffnen und Fritz-Kola oder Call a Pizza dort anders sehen (Fund 4).

Was fehlt: nichts Wesentliches im Kasten selbst. Was stört: nichts, außer Jako.

## D. Text gegen CLAUDE.md und T1 bis T3

- T1: „Das geht stattdessen“ trägt eine eigene Aussage, drei Wörter. Bestanden.
- T2: Siehe Fund 6, formal nicht verletzt.
- T3: Je Handy-Schirm ein Titel, ein Satz, eine Gruppe gleicher Zeilen. Bestanden.
- Sprache: Keine Gedankenstriche, kein Ausrufezeichen, keine Aussage über den eigenen Text, keine Werbesprache. „Steht auf keiner der geprüften Listen“ ist sachlich. Aufzählungen im Kasten haben drei oder weniger Glieder.
- Eigene Produkte: Kein Wort gegen Halal ETFs oder eigene Empfehlungen. Boykott bleibt freiwillig. Bestanden.
- Freebie-Regel „nicht anklickbar“: Test schließt `<a`, `<Link`, `href=` im Kasten aus. Bestanden.

## Zusammenfassung der Funde

| Nr | Fund | Schwere | Vorschlag |
|---|---|---|---|
| 1 | Jako statt Reebok (Schuhe gegen Teamkleidung) | Pflicht | `statt: "Reebok bei Vereinskleidung"` oder Jako streichen |
| 2 | Footer „wem die Marke gehört“ zu stark | Pflicht | „laut öffentlichen Angaben“; Belege je Zeile „Kette vollständig“ |
| 3 | HSBC Life und Google/Red Hat nicht in den Belegen | Kann | Zeilen nachtragen |
| 4 | Boycat und No Thanks nicht gesichert | Kann | Ein Halbsatz im Footer |
| 5 | Halal nicht belegt, Leser fragt | Kann | „Ob eine Marke halal ist, sagt diese Liste nicht.“ |
| 6 | Graue 12-Pixel-Zeile | Kann | 14 Pixel |
| 7 | Titel und Namen gleich stark | Kann | Nur auf Wunsch |
| 8 | Footer-Liste lang, Jargon | Kann | Titel kürzen |

Nach Behebung von 1 und 2 grün.
