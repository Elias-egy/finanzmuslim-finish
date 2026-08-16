# Logos, weniger Text, klarere Datenbank

Drei Baustellen: echte Anbieter-Logos statt Kürzel-Platzhalter, die subjektiven Zusatzsätze raus, und `/halal-anlagen` so umbauen, dass jede Anlageart nur die Spalten zeigt, die sie hat.

## 1. Logos der Anbieter

Logos kommen über Logo.dev, das läuft rein im Browser über die Domain des Anbieters. Keine Bilddateien im Projekt, keine Pflegearbeit bei neuen Anlagen.

- Je Anbieter kommt eine Domain in `src/data/halalAnlagen.ts` dazu: iShares (ishares.com), Invesco (invesco.com), HSBC (hsbc.com), WisdomTree (wisdomtree.eu), Xtrackers (xtrackers.com), HANetf (hanetf.com), Comgest (comgest.com), Franklin Templeton (franklintempleton.com), BNP Paribas (bnpparibas.com).
- Bitcoin, Ether und Solana über den Ticker-Weg von Logo.dev (BTC, ETH, SOL). Falls ein Zeichen besser aussieht, bleibt das Münzzeichen.
- `AnlageLogo` lädt das Bild und fällt bei Fehler still auf das heutige Kürzel bzw. Münzzeichen zurück. Damit sieht keine Zeile leer aus, egal was Logo.dev liefert.
- Wirkt sofort an allen drei Stellen: Startseiten-Vorschau, Liste `/halal-anlagen`, Detailseite.

Dafür braucht es einmal die Logo.dev-Verbindung; ich öffne die Verbindungskarte im Chat, du bestätigst.

## 2. Individuelle Zusatztexte raus

`hinweis` wird aus den Daten entfernt und aus Liste, Karte und Detailseite ausgebaut:

- „schwankt deutlich stärker als alles andere in dieser Übersicht" (Bitcoin, Ether, Solana) — steht schon einmal im Abschnitt „Krypto in dieser Liste", muss nicht dreimal in Zeilen stehen.
- „teuerste Anlage in dieser Übersicht" — sagt die Kostenspalte selbst.
- „erst seit Februar 2026 am Markt" — steht als Auflagedatum schon in den Stammdaten.

Zwei harte Angaben bleiben erhalten, aber an der richtigen Stelle:

- „zusätzlich bis zu 5,75 % Ausgabeaufschlag, Mindestanlage 1.000 USD" wird ein eigenes Feld und steht auf der Detailseite bei den Kosten.
- „Größe aus dem Factsheet vom 27.03.2024" wird ein Stand-Vermerk am Größe-Wert der Detailseite.

## 3. `/halal-anlagen` übersichtlicher

Statt einer Tabelle mit acht Spalten für alles wird nach Anlageart gruppiert. Jede Gruppe bekommt eine Überschrift und nur die Spalten, die dort Werte haben. Damit verschwinden die leeren Felder bei Krypto.

```text
Aktien-ETF (passiv)     Anlage · Kurs · Kosten · Rendite · Größe · Ertrag · Geprüft von
Aktive Fonds            Anlage · Kurs · Kosten · Rendite · Größe · Ertrag · Geprüft von
Sukuk                   Anlage · Kurs · Kosten · Rendite · Größe · Ertrag · Geprüft von
Gold                    Anlage · Kurs · Kosten · Rendite · Größe · Geprüft von
Silber                  Anlage · Kurs · Kosten · Rendite · Größe · Geprüft von
Krypto                  Anlage · Kurs · Rendite · Geprüft von
```

- Die Bauart-Spalte fällt weg, weil passiv und aktiv jetzt die Gruppenüberschrift sind. Die Erklärung dazu wandert als Hilfe-Symbol an die Überschrift „Aktive Fonds".
- Suche, Filter und Zeitraum-Schalter bleiben oben und wirken über alle Gruppen. Leere Gruppen werden ausgeblendet.
- Filtert man auf eine Art, bleibt genau eine Gruppe stehen, also die heutige Ansicht ohne Doppelung.
- Auf dem Handy bleiben Karten, ebenfalls unter denselben Gruppen-Überschriften. Bei Krypto entfallen die Felder Größe und Ertrag.

## Technisch

- Neu: `logoDomain` an `Anbieter`, `ticker` bzw. Nutzung von `kuerzel` bei Krypto, Logo-URL über `import.meta.env.VITE_LOVABLE_CONNECTOR_LOGO_DEV_API_KEY` mit `size=96&format=png`.
- `AnlageLogo` erhält einen `onError`-Rückfall über lokalen State.
- Gruppenlogik als kleine Hilfsfunktion neben `AnlageFilter`: `aktien-passiv`, `aktien-aktiv`, `sukuk`, `gold`, `silber`, `krypto`; Spaltensatz je Gruppe als Konstante.
- Feld `hinweis` verschwindet aus `Anlage`; neu `ausgabeaufschlag?` und `groesseStand?`.
