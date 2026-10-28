# Abnahme BK3, Runde 2: Kasten „Das geht stattdessen“ und Footer (Boykott-Liste)

Prüfer ohne Bau-Kontext, 28.10.2026. Geprüft: Änderungen seit Runde 1 (`ABNAHME.md`), Belege (`boykott-liste.belege.md`, Ende), Kandidaten-Datei, die zehn Listen-Dateien in `docs/freebies/quellen/`, Code, Bilder bei 390 und 360 px.

## Urteil: GRÜN

Beide Pflicht-Funde aus Runde 1 sind erledigt, kein neuer Satz ist falsch. Unten nur Kann-Punkte.

## 1. Pflicht-Funde aus Runde 1

- **Fund 1 (Jako statt Reebok): erledigt.** `boykottListe.ts` Bereich haushalt: `statt: "Reebok bei Vereinskleidung"`. Das deckt sich mit der Kandidaten-Datei („Ersetzt Reebok für Vereins- und Teamkleidung“, für Laufschuhe kein Kandidat). Am Bild bei 390 und 360 px sichtbar. Der Test greift weiter (9 von 9 grün, selbst gelaufen).
- **Fund 2 (Footer „wem die Marke gehört“): erledigt.** Der Satz „Geprüft ist auch, wem die Marke gehört“ ist weg. Jetzt: „Auch ihre bekannten Eigentümer stehen auf keiner davon.“ Die Belege halten fest, warum: Ketten bei Peter Pane, Fritz-Kola, Jako und HalalBooking sind unvollständig, bei Vita Cola, Call a Pizza, LibreOffice und Miele bis zur Mutter vollständig. „Bekannten“ trägt genau das.
- **Gegenprobe mit grep** (ohne Groß-/Kleinschreibung, alle zehn Dateien in `quellen/`): Null Treffer für Hassia, Paniceus, Junge, Wilde, Document Foundation, Seyidli, Miele, Zinkann, Sprügel, Wiegert, außerdem Lütvogt, Rehm, Jägermeister, Mast, Elnur, Thüringer Waldquell, Vita Cola, Fritz, Jako, Peter Pane, Call a Pizza, HalalBooking. („Pane“ trifft nur „Japanese“ in der AFSC-Datei, „Libre“ nur „Libre by Nexus“ bei RLI, „Foundation“ nur Naturewatch bei Ethical Consumer: alles andere Firmen.) Der Footer-Satz ist für jeden in den Belegen genannten Eigentümer wörtlich wahr.
- Die Gegenhinweise stehen jetzt in den Belegen: HSBC Life bei HalalBooking (HSBC steht in AFSC, per grep bestätigt), Google (BDS, Ethical Consumer, AFSC, Who Profits) und Red Hat (Who Profits) als Förderer von LibreOffice, Barclays (beide Ethical-Consumer-Listen). Alles Geldgeber oder Förderer, keine Eigentümer. Die Aussage bleibt wahr, und die Belege sagen auch, warum.

## 2. Neue Sätze

- „Auch ihre bekannten Eigentümer stehen auf keiner davon.“: **nicht falsch, nicht irreführend.** Nur Eigentümer, nicht Geldgeber, und das ist so belegt. Die Seite sagt nirgends „boykottfrei“.
- „Ob ein Essen halal ist, sagt die Liste nicht.“: passt zu „kein eigenes Urteil“, keine Halal-Aussage über Marken.
- „Miele statt Siemens-Geräten“: richtig. BDS nennt Siemens-Geräte, Bosch bleibt weg. Beleg: Eigentum Familien Miele und Zinkann.
- „LibreOffice statt Microsoft Office, kostenlos“: „kostenlos“ per Wikipedia belegt. Stimmt für Privatnutzer.
- UN-Titel „Vereinte Nationen, Firmen in Siedlungen (2025)“: lesbar, kein Aktenzeichen mehr.

## 3. Bild (390 und 360 px, Kästen 2 und 4, Footer)

Kein Überlauf, nichts abgeschnitten, auch Jakos längste Zeile „statt Reebok bei Vereinskleidung“ bleibt bei 360 px in einer Zeile. Logos rund und gleich groß, Miele und Jako klar erkennbar. Footer bei 12 px, Links unterstrichen, der längere Satz bricht ruhig um. Keine KI-Zeichen.

## 4. Sprache (CLAUDE.md Abschnitt Sprache)

Kein Gedankenstrich, kein Ausrufezeichen (grep in beiden Dateien), keine Aussage über den eigenen Text, keine Werbesprache. Sätze kurz.

## Funde (alle Kann)

| Nr | Ort | Schwere | Fund | Vorschlag |
|---|---|---|---|---|
| 1 | `boykottListe.test.ts` Zeile 50 bis 53 | Kann | Der Test prüft nur Hassia, Paniceus, Document Foundation, Seyidli, Zinkann und „Fritz“, dazu die Markennamen. Junge, Wilde, Sprügel, Wiegert, Lütvogt, Rehm stehen in den Belegen, aber nicht im Test. Der Footer-Satz „Eigentümer“ ist damit nur zum Teil vom Test gedeckt (per grep heute alles sauber). | Die Namen ergänzen, damit eine spätere Listen-Aktualisierung nichts übersieht. |
| 2 | Footer, `BoykottListe.tsx` Zeile 242 | Kann | „die Liste“ im letzten Halbsatz steht direkt hinter den „Listen“ (BDS, UN und weitere). Gemeint ist diese Seite, kann aber als die externen Listen gelesen werden. | „sagt diese Seite nicht“ statt „die Liste“. |
| 3 | Belege-Tabelle BK3 | Kann | „Kette vollständig: ja/nein“ steht im Fließtext darunter, nicht je Zeile. Wer nachschlägt, muss lesen statt scannen. | Spalte ergänzen, auf Wunsch. |
| 4 | LibreOffice-Logo | Kann | Das Logo zeigt ein schwarzes Blatt auf weißem Kreis und wirkt wie ein allgemeines Dokument-Symbol, nicht wie die grüne Marke. Gleich groß und sauber, nur weniger erkennbar. | Offizielles Logo prüfen, falls verfügbar. |
| 5 | Footer | Kann (Runde 1, Fund 4, offen) | Boycat und No Thanks ließen sich nicht einsehen, das steht nur im Listen-Index. | Nur falls Elias es will: ein Halbsatz. |
| 6 | Kasten, zweite Zeile | Kann (Runde 1, Fund 6 und 7, offen) | Graue 12-Pixel-Zeile und gleich starke Namen. Kein Verstoß, Wortlaut von Elias. | Unverändert lassen. |
