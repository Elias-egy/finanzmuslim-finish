# Logos für die Anlagen, Hinweise raus, /halal-anlagen aufräumen

## 1. Echte Logos statt Platzhalter

Statt der Kürzel-Kacheln (iS, IV, HS ...) zeigt jede Zeile künftig das echte Firmenlogo — in der Vorschau auf der Startseite, in der Liste `/halal-anlagen` und auf der Detailseite.

Weg dorthin: Logo.dev anbinden. Damit wird das Logo über die Firmen-Domain geladen, Krypto über das Kürzel. Keine Bilddateien im Projekt, kein Nachpflegen, wenn eine Firma ihr Logo ändert.

Zuordnung, die ich hinterlege:

| Anbieter | Quelle |
|---|---|
| iShares, BlackRock | ishares.com |
| Invesco | invesco.com |
| HSBC | hsbc.com |
| WisdomTree | wisdomtree.eu |
| Xtrackers | xtrackers.com |
| HANetf | hanetf.com |
| Comgest | comgest.com |
| Franklin Templeton | franklintempleton.com |
| BNP Paribas | bnpparibas.com |
| Bitcoin, Ether, Solana | Krypto-Kürzel BTC, ETH, SOL |

Für Gold und Silber ohne Emittenten bleibt es beim bisherigen Zeichen. Lädt ein Logo nicht, erscheint automatisch wieder das Kürzel wie heute — es entsteht also nie ein leeres Kästchen.

Alternative, falls du keine externe Quelle willst: neun Logodateien im Projekt ablegen. Das ist rechtlich dasselbe, muss aber von Hand gepflegt werden und die Dateien müssten von den Anbieter-Seiten kommen.

## 2. Individuelle Hinweistexte entfernen

Aus den Anlagedaten fliegen die Sätze am einzelnen Produkt raus, unter anderem:

- „schwankt deutlich stärker als alles andere in dieser Übersicht" (Bitcoin, Ether, Solana)
- „erst seit Februar 2026 am Markt"
- „teuerste Anlage in dieser Übersicht"
- „sehr kleiner Fonds, die Größe stammt aus dem Factsheet vom 27.03.2024"
- „zusätzlich bis zu 5,75 % Ausgabeaufschlag, Mindestanlage 1.000 USD"

Zwei davon sind harte Fakten, nicht Meinung: Ausgabeaufschlag und Mindestanlage beim BNP-Fonds und die Herkunft der Fondsgröße. Die wandern in die Detailseite in das Faktenraster beziehungsweise in die Fußnote, statt in der Liste zu stehen. Der Schwankungssatz zu Krypto steht ohnehin schon einmal als Absatz unter der Liste, der bleibt dort.

## 3. /halal-anlagen

Die Seite ist inhaltlich stark, aber unten stehen sechs Blöcke hintereinander, und in der Tabelle konkurriert alles um dieselbe Breite. Vorschlag:

**Tabelle** — mit dem Logo vorn wird die erste Spalte breiter, dafür fällt die Hinweis-Zeile weg. Spalten bleiben: Anlage, Kurs, Kosten, Rendite, Größe, Ertrag, Bauart, Geprüft von.

**Handy-Karten** — Logo, Name, Kürzel, Kurs, Veränderung, darunter Kosten und Größe, darunter Prüfstelle. Ohne Hinweiszeile.

**Blöcke darunter zusammenfassen** von sechs auf drei:

1. Woher die Zahlen kommen (Kursquelle, Produktdaten, Einzelfälle in der Fußnote)
2. Wo kannst du das kaufen — Verweis auf `/vergleich/depot`
3. Was diese Übersicht nicht ist, plus Krypto-Absatz und Newsletter

Der PDF-Verweis auf `/vorlagen/halal-anlagen` rutscht als Zeile in Block 1, statt einen eigenen Kasten zu bekommen.

Sag Bescheid, wenn du an dieser Aufteilung etwas anders willst — sonst setze ich sie so um.

## Technisch

- Logo.dev als Connector verbinden, Schlüssel läuft über `VITE_LOVABLE_CONNECTOR_LOGO_DEV_API_KEY`, Bilder direkt von `img.logo.dev`.
- `Anbieter` in `src/data/halalAnlagen.ts` bekommt ein Feld `domain`, Krypto-Anlagen ein Feld für das Logo-Kürzel.
- `AnlageLogo` in `src/components/AnlageZeile.tsx` lädt das Bild und fällt bei Fehler per `onError` auf Zeichen beziehungsweise Kürzel zurück. Eine Stelle, alle drei Ansichten profitieren.
- `hinweis` wird aus dem Typ und den Datensätzen entfernt, ebenso die Ausgabe in `HalalAnlagen.tsx` und `AnlageDetail.tsx`; die zwei Fakten wandern in `FaktenRaster` beziehungsweise die Fußnote.
