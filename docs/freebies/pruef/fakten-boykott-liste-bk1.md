# Faktenprüfung Boykott-Liste (BK1), 28.10.2026

Geprüft: `src/data/boykottListe.ts`, `src/pages/BoykottListe.tsx`, `docs/freebies/boykott-liste.belege.md`, die drei Quelldateien in `docs/freebies/quellen/`. Zusätzlich geprüft: die Live-Seite der BDS (https://bdsmovement.net/get-involved/what-to-boycott), Al Jazeera (05.04.2024), Malay Mail (28.08.2025), Bosch-Pressemeldung zu BSH.

## Urteil: ROT

Ein Fund ist sachlich nicht von der Quelle gedeckt (Fund 1, Disney+). Vier weitere Funde sind Pflicht vor Livegang, weil sie mehr behaupten als die Quelle oder wie ein Urteil klingen (Funde 2 bis 5). Der Rest ist Politur. Die Struktur (25 Firmen, Gruppen, Rechnungen) stimmt.

## Was stimmt

- Gruppen: 13 Firmen Abschnitt 1 (Chevron, Intel, Dell, Siemens, HP, Microsoft, Carrefour, AXA, Reebok, Disney+, Teva, SodaStream, RE/MAX), 7 Abschnitt 2 (McDonald's, Coca-Cola, Burger King, Papa John's, Pizza Hut, Domino's, Wix), 5 Abschnitt 3 (Google, Amazon, Booking, Airbnb, Expedia). Alle in der richtigen Gruppe, keine fehlt, keine erfunden. Live-Seite und Quelldatei stimmen überein. Die Ware (Obst, Gemüse, Wein) ist als Nicht-Firma getrennt, Palantir steht nur unter "More Resources" und gehört zu Recht nicht dazu.
- Rechnung MSCI World: 4,00 + 2,67 + 2,23 + 1,76 = 10,66, gerundet 11. Stimmt mit dem Datenblatt.
- Rechnung MSCI World Islamic: 13,66 + 1,99 = 15,65, gerundet 16. Stimmt mit dem Datenblatt (Microsoft 13,66, Intel 1,99).
- "allein an" ist als Untergrenze ehrlich, weil nur die Top 10 sichtbar sind und weitere Listenfirmen darunter liegen können.
- Dell, HP, Microsoft, Google, Amazon, Intel, RE/MAX, Chevron, AXA: Grund deckt sich mit dem BDS-Absatz, ohne Übertreibung.
- Fußzeile "kein eigenes Urteil" und "Keine Anlageberatung" sind vorhanden.

## Funde

### 1. ROT: Disney+ "Feiert laut BDS Israels Krieg in Disney- und Marvel-Filmen."
- Stelle: `boykottListe.ts`, Disney+, Feld grund.
- Problem: Die BDS sagt nicht, dass die Filme den Krieg feiern. Sie sagt: Disney und Marvel "glorifying Israel's regime of genocide and apartheid", zwei Schauspielerinnen (Shira Haas, Gal Gadot) seien "cultural ambassadors for Israel", Marvel belebe eine Figur mit Mossad-Vergangenheit, daraus folge "enabling Israel's genocide by dehumanizing Palestinians". Von Filmen, die den Krieg feiern, steht dort nichts. "laut BDS" rettet es nicht, weil der Inhalt falsch wiedergegeben ist.
- Quelle: BDS Abschnitt 1, Absatz Disney+.
- Vorschlag: "Laut BDS wirbt Disney für Israel: zwei Filme besetzen Schauspielerinnen, die die BDS als Botschafterinnen Israels sieht." (Gegebenenfalls kürzen auf zwei Zeilen: "Laut BDS werben Disney und Marvel in Filmen für Israel, mit Darstellerinnen als Botschafterinnen.")

### 2. Pflicht: Börsenkasten "von 100 € gehen 11 € / 16 € ... an Microsoft, ..."
- Stelle: `BoykottListe.tsx`, Zeile 93 ("von 100 € gehen") und Zeile 97 ("allein an ...").
- Problem: Wer über die Börse einen Fonds oder ETF kauft, zahlt die Firma nicht. Das Geld geht an den Verkäufer der Anteile, die Firma bekommt es nicht. "gehen an" ist als Geldfluss sachlich unscharf und wird von Kritikern sofort angegriffen. Wahr ist: Dieser Anteil des Depots steckt in Aktien dieser Firmen.
- Quelle: MSCI-Datenblätter (liefern nur Gewichte, keinen Geldfluss).
- Vorschlag: "von 100 € stecken" und "allein in Aktien von Microsoft, Amazon und Google" (Islamic: "in Aktien von Microsoft und Intel").

### 3. Pflicht: "Halal heißt nicht automatisch boykottfrei."
- Stelle: `BoykottListe.tsx`, Überschrift im Börsenabschnitt.
- Problem: Der Satz nennt den MSCI World Islamic implizit "halal". Das ist ein Halal-Urteil ohne Beleg in der Belegdatei (Regel: Halal nur mit Beleg, "Islamic" im Namen ist kein Urteil). Dazu die Kasten-Farbe gelb für den Islamic-Index, die wie eine Wertung wirkt.
- Quelle: `boykott-liste.belege.md` hat keine Zeile zur Shariah-Eignung des Index.
- Vorschlag: "Auch ein Islamic-Index ist nicht automatisch boykottfrei." Alternativ: "Halal geprüft heißt nicht boykottfrei", nur mit Beleg-Zeile.

### 4. Pflicht: "Die Firma oder ihr Ableger in Israel hat Israels Armee offen unterstützt." (Konstante VON_UNTEN, gilt für Coca-Cola, Burger King, Pizza Hut, Domino's, Papa John's, Wix)
- Problem: Die BDS schreibt "have openly supported apartheid Israel **and/or** provided generous in-kind donations to the Israeli military". Das ist Israel offen unterstützt, oder Sachspenden ans Militär, je nach Firma, ohne zu sagen, was für welche Firma gilt. Die Seite macht daraus für alle "die Armee offen unterstützt". Für Wix, das kein Ableger in Israel hat, sondern eine israelische Firma ist, passt "Ableger" gar nicht. Außerdem fehlt hier "laut BDS", obwohl die BDS selbst sagt, sie unterstütze diese Aufrufe nur, sie stammten nicht von ihr ("not initiated by the BDS movement").
- Quelle: BDS Abschnitt 2, Einleitungssatz.
- Vorschlag: "Laut BDS hat die Firma oder ihr Partner in Israel Israel offen unterstützt oder dem Militär Sachspenden gegeben." Für die Legende unter der Kopfzeile ergänzen: "Gelb und rot nach BDS-Einteilung; bei den sieben Firmen mit Rot aus Abschnitt 2 stammt der Aufruf aus der Bevölkerung, die BDS unterstützt ihn."

### 5. Pflicht: SodaStream "Verdrängt Beduinen in der Naqab-Wüste und benachteiligt palästinensische Arbeiter."
- Problem: Die BDS sagt "actively complicit in Israel's **policy** of displacing" Bedouin-Palestinian citizens und "long history of racial discrimination against Palestinian workers". Die Seite macht daraus, SodaStream verdränge selbst. Das ist mehr als die Quelle (Beteiligung an einer Politik). Zudem steht die Aussage als Tatsache ohne "laut BDS".
- Quelle: BDS Abschnitt 1, Absatz SodaStream.
- Vorschlag: "Laut BDS beteiligt sich SodaStream an Israels Vertreibung von Beduinen im Negev (Naqab) und hat Palästinenser bei der Arbeit diskriminiert."

### 6. McDonald's: Grund nicht aus der BDS-Seite, Fußzeile sagt das Gegenteil
- Stelle: `boykottListe.ts` McDonald's, und Fußzeile "Die Liste und jeder Grund geben die Seite der BDS-Bewegung wieder".
- Problem: Der Satz stammt aus Al Jazeera (Alonyal kündigte an, "donating free meals to the Israeli military"), nicht von der BDS-Seite. Der Beleg ist gut, aber die Fußzeile stimmt dann nicht ganz. Außerdem: "geschenkt" ist zu glatt, Al Jazeera berichtet von einer Ankündigung. Und McDonald's hat den Partner 2024 zurückgekauft (225 Filialen), "Der Partner in Israel" steht in der Gegenwart.
- Quelle: Al Jazeera 05.04.2024.
- Vorschlag: "Der frühere Partner in Israel kündigte an, Soldaten Gratis-Essen zu geben. 2024 kaufte McDonald's die Filialen zurück." Fußzeile: "Die Liste und die Gründe geben die Seite der BDS-Bewegung wieder; bei McDonald's und Starbucks stammt der Grund aus der verlinkten Presse."

### 7. Starbucks: "In Malaysia machte der Betreiber 2025 deshalb Rekordverlust."
- Problem: "deshalb" ist zu eindeutig. Laut Malay Mail nennt der Betreiber als Hauptgrund "the prolonged impact of the ongoing sentiment related to the Middle East conflict" (Umsatz minus 36 Prozent), dazu kommen Abschreibungen wegen der Verkleinerung von Filialen. Boykotte in Malaysia stehen als Hintergrund im Artikel. Außerdem "boykottieren ihn viele" ist nur für Malaysia (und Indonesien) belegt. Das Geschäftsjahr endet im Juni 2025.
- Quelle: Malay Mail 28.08.2025.
- Vorschlag: "Steht nicht auf der BDS-Liste. In Malaysia meldete der Betreiber für das Geschäftsjahr bis Juni 2025 einen Rekordverlust und nannte die Stimmung wegen des Nahost-Konflikts als Hauptgrund."

### 8. Obst, Gemüse, Wein: "Stammt oft auch aus Siedlungen, steht aber als Israel drauf."
- Problem: Die BDS sagt, Ware "misleadingly labeled as 'Product of Israel' **often include** products of illegal settlements". Die Seite stellt das für Deutschland als Tatsache hin. In der EU muss Ware aus Siedlungen seit dem EuGH-Urteil vom 12.11.2019 (C-363/18) als Siedlungsware gekennzeichnet sein; "steht als Israel drauf" kann also nur im Verstoß stimmen. Das Etikett-Argument ist BDS-Sicht, nicht geprüfte Tatsache.
- Quelle: BDS Abschnitt 1, letzter Punkt; EuGH 12.11.2019 (Psagot), von mir aus dem Gedächtnis genannt, nicht neu geöffnet.
- Vorschlag: "Laut BDS steckt in Ware mit "Israel" auf dem Etikett oft auch Ware aus Siedlungen." Und den Teil "steht aber als Israel drauf" streichen.

### 9. Siemens: Alltag "Siemens-Hausgeräte"
- Problem: Der Alltagshinweis ist wörtlich BDS ("Siemens-branded electrical appliances"), irreführend ist er aber für Deutschland: Siemens-Hausgeräte werden von BSH gebaut, das seit 2014 komplett Bosch gehört. Siemens AG lizenziert nur den Namen. Wer die Karte liest, glaubt, die Geräte stammten vom Konzern mit dem Kabel-Auftrag.
- Quelle: Bosch-Pressemeldung zum Kauf des 50-Prozent-Anteils (https://www.bosch-presse.de/pressportal/be/en/press-release-632.html); BDS Abschnitt 1, Siemens.
- Vorschlag: Alltag "Geräte mit dem Namen Siemens, die Marke gehört Siemens, gebaut werden sie von Bosch." Oder nur "Hausgeräte mit Siemens-Marke (laut BDS)". Belegzeile ergänzen.

### 10. Microsoft und Reebok: Pille "Boykott"
- Problem: Der Microsoft-Absatz der BDS sagt selbst, Aufruf sei "pressure on Microsoft wherever possible **when reasonable alternatives exist**, including boycotting Microsoft's Xbox and gaming". Das ist die Formulierung der gelben Gruppe. Die Seite zeigt Microsoft rot, "Boykott". Das entspricht der Abschnittseinteilung, aber nicht dem Absatz. Bei Reebok sagt die BDS: Rückzug fordern "or face a global boycott campaign", also ein Ultimatum, noch kein laufender Boykott.
- Quelle: BDS Abschnitt 1, Microsoft und Reebok.
- Vorschlag: Bei Microsoft Alltag "Xbox und Spiele (laut BDS)" und Grund um "wo es Alternativen gibt" ergänzen. Bei Reebok: "...Die BDS fordert den Rückzug, sonst droht ein weltweiter Boykott."

### 11. Booking/Airbnb/Expedia: "steht in der Datenbank der UN"
- Problem: Für Laien unklar. Gemeint ist die UN-Datenbank von Firmen, die mit Siedlungen Geschäfte machen. Ohne das klingt es wie ein UN-Verbot. Ob alle drei Firmen in der aktuellsten Fassung der UN-Liste stehen, habe ich nicht neu geprüft; die BDS behauptet es.
- Quelle: BDS Abschnitt 3.
- Vorschlag: "Vermittelt Unterkünfte in Siedlungen und steht laut BDS in der UN-Liste von Firmen, die in Siedlungen Geschäfte machen."

### 12. Teva: "verdient seit Jahrzehnten am besetzten Markt"
- Problem: "besetzter Markt" versteht niemand. Gemeint: palästinensischer Markt unter Besatzung. Die BDS sagt außerdem "has supported Israel's unfolding genocide since October 2023", das fehlt, ist aber kein Fehler. Der Hinweis zum Medikament ("Setz nie ein Medikament einfach ab...") ist als Vorsicht in Ordnung und in der Belegdatei als Vorsicht ausgewiesen.
- Vorschlag: "Israelische Firma. Laut BDS verdient sie seit Jahrzehnten am Markt der besetzten Gebiete."

### 13. Kleinere Punkte
- Carrefour: BDS sagt "at least one" Filiale in einer Siedlung. Vorschlag: "mindestens eine Filiale".
- Chevron: Alltag "Tankstellen Texaco und Caltex" ist BDS-Wortlaut. Caltex gibt es in Deutschland nicht, Texaco in Europa vor allem als Lizenzmarke. Ohne Beleg für Deutschland. Vorschlag: "Tankstellen unter den Namen Chevron, Texaco, Caltex (je nach Land)". Gleiches Problem bei der Zeile "Texaco gehört zu Chevron" im roten Kasten: BDS-Aussage, für Deutschland ohne eigenen Beleg.
- Intel: "Größter ausländischer Investor in Israel" ist BDS-Aussage ("largest international investor") ohne "laut BDS". Die Seite lässt den Rückzug des 25-Milliarden-Projekts von 2024 weg, ist aber kein Fehler.
- Google, Amazon, Dell, HP, Microsoft, Intel, Disney+ usw. stehen im Präsens ("Liefert"). Die BDS schreibt ebenfalls Präsens. Kein Fehler, der Stand 28.10.2026 steht oben.
- Kopfzeile "Von der offiziellen Liste der BDS-Bewegung": Die BDS nennt es "current top priority ... targets". Besser "Von der Prioritätenliste der BDS-Bewegung".
- Alltagsangaben ohne Beleg in der Belegdatei: Burger/Pizza (McDonald's, Burger King, Pizza Hut, Domino's, Papa John's), Wassersprudler, Suche/Maps/Cloud, Prozessoren in Laptops, Laptops/Bildschirme (Dell), Drucker/Laptops (HP), Filme und Serien, Webseiten-Baukasten, Hotels/Ferienwohnungen/Reisen, Immobilienmakler, Sportschuhe, Versicherungen, Supermärkte. Alles Allgemeinwissen und unkritisch, aber nach eigener Regel (Beleg je Aussage) unbelegt. Belegt sind: Fanta/Sprite/Powerade (Coca-Cola-Seite), Xbox (BDS), Ring (BDS), ratiopharm (Teva-Seite), Siemens-Geräte (BDS), Texaco/Caltex (BDS). Vorschlag: eine Sammelzeile "Alltagsangaben sind allgemein bekannte Markenfelder, geprüft auf den Firmenseiten" in die Belegdatei, erst nach tatsächlicher Prüfung.
- Quelldatei MSCI World: Im Text der Datei steht kein Stichtag, nur in der Islamic-Datei ("SEP 30, 2026"). Die Datei sieht zudem nach einem Auszug aus (grep-Zeilennummern in der Islamic-Datei). Beleg für "30.09.2026" beim World-Index ist deshalb in der Datei selbst nicht sichtbar. Vorschlag: den Stichtag in der World-Datei ergänzen.
- Aufruf "So investierst du halal" (FindeDeinAngebot) und der Satz "Ich habe die Depots gerankt: welche zinsfrei sind": Die Belegdatei verweist nur auf den Portfolio-Plan (Halal-Prüfer Runde 7). Dort steht, dass die Sätze nur "gerankt" und Zinsen betreffen, kein Halal-Urteil. Die Überschrift "So investierst du halal" ist stärker als dieser Beleg: Ein zinsfreies Depot allein macht die Geldanlage nicht halal (Auswahl der Anlagen zählt). Vorschlag: Überschrift "So wählst du ein zinsfreies Depot" oder den Beleg auf die Überschrift ausweiten.

## Deutsche Sprache

- "Dort entscheidest du selbst, welche Firmen dein Geld bekommen." Besser: "Dort wählst du selbst, in welche Firmen dein Geld fließt." (Und zum Fund 2: Aktienkauf zahlt die Firma nicht, "bekommen" ist hier dasselbe Problem.)
- "besetzten Markt" (Teva), "Datenbank der UN" (Booking) und "Naqab-Wüste" (SodaStream): für Laien am Handy unklar. "Negev (arabisch: Naqab)" oder nur "Negev".
- "Setz nie ein Medikament einfach ab": Imperativ ist okay, Ton passt zu Elias.
- "Meiden, wo es geht" (Pille) und "Rot heißt Boykott, gelb heißt meiden, wo es eine Alternative gibt": verständlich und konsistent.
- "Von 100 € gehen" (Zeile 93) steht in zwei Zeilen mit "allein an" darunter; am Handy lesbar, nach der Korrektur zu "stecken ... in Aktien von" prüfen, ob die Kachel noch passt.
- Keine Rechtschreib- oder Umlautfehler gefunden. Keine Gedankenstriche, keine Dreierfloskeln.

## Zusammenfassung Reihenfolge der Korrekturen

1. Disney+ neu fassen (rot).
2. "gehen" zu "stecken" (Börsenkasten).
3. "Halal heißt nicht automatisch boykottfrei" umformulieren.
4. VON_UNTEN auf "oder" und "laut BDS" umstellen.
5. SodaStream abschwächen auf "beteiligt sich".
6. McDonald's und Starbucks präzisieren, Fußzeile anpassen.
7. Ware-Absatz auf "laut BDS" und Etikett-Teil streichen.
8. Siemens-Hinweis, Microsoft/Reebok, Booking-Satz, Teva-Wortwahl, Kleinigkeiten.
