# Datenbank-Vorschau: kompakter und farblich klar

## Ziel
Die Vorschau auf der Startseite zeigt nur noch **4 Anlagen gleichzeitig** (Rest per Scrollen erreichbar) und wird dadurch wieder deutlich kleiner. Die Farbpunkte werden feiner nach Art unterschieden. Keine Flaggen — die bleiben als spaeterer Schritt offen, sobald du die Regionen-Liste lieferst.

## Aenderungen

1. **Hoehe der Liste auf 4 Zeilen**
   - Sichtbarer Bereich statt 320px auf genau 4 Zeilen (ca. 4 x 52px) begrenzt, damit die 5. Zeile angeschnitten wirkt und zum Scrollen einlaedt.
   - Liste bleibt scrollbar, Suche filtert weiterhin sofort nach Name, Anbieter oder ISIN.

2. **Punkte-Farben nach Art (5 statt 3)**
   - Fonds (aktiv) = gruen
   - Aktien-ETF (passiv) = blau
   - Sukuk = braun
   - Gold = gold
   - Silber = silber
   - Sortierung folgt derselben Reihenfolge: Aktien-ETF, Fonds, Sukuk, Gold, Silber; innerhalb der Gruppe alphabetisch.

3. **Legende**
   - Fuenf Eintraege in zwei Zeilen, kleine Punkte, gleiche Reihenfolge wie die Sortierung.

4. **Optik**
   - Karte bleibt gleich breit, wird durch die kuerzere Liste ruhiger. Suchfeld, Legende und Link "Alle 23 Anlagen ansehen" bleiben unveraendert.

## Technisch
- Nur `src/components/DatenbankVorschau.tsx` wird angepasst.
- Neue Farbtoken fuer braun, gold und silber kommen als semantische Tokens in `src/index.css` + `tailwind.config.ts` dazu (keine Hex-Werte direkt im Component), gruen/blau nutzen die bestehenden Tokens.
- Keine Datenaenderung, keine neuen Felder.

## Danach offen
Flaggen der Investitionsbereiche (EU, USA, Welt, UK-Lagerung, Malaysia u. a.) — umsetzbar, sobald du die Region je Anlage lieferst.
