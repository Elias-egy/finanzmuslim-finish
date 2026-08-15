# Datenbank sichtbar machen: Startseite + Suche auf /halal-anlagen

## Startseite, Abschnitt "Finde halal Anlagen"

- Blaues Etikett oben ändert sich von "Halal-Check" zu "Halal-Datenbank".
- "In Arbeit" fällt weg, stattdessen ein blauer Button "Zur Halal-Datenbank" auf /halal-anlagen.
- Der Text beschreibt nicht mehr etwas Zukünftiges, sondern das, was es gibt: 23 geprüfte Anlagen mit Kosten, Größe und Prüfstelle, filterbar und sortierbar.
- Die Vorschaukarte links behält ihr Design, wird aber komplett anklickbar und führt auf /halal-anlagen. Beim Überfahren hebt sie sich leicht ab.
- Statt der Platzhalter stehen drei echte Anlagen aus der Datendatei, je eine pro Art, mit farbigem Punkt als Kategorie-Kennzeichnung:
  - blau: iShares MSCI World Islamic (Aktien-ETF)
  - grün: HANetf Saturna Al-Kawthar (Fonds)
  - gelb: Invesco Physical Gold (Gold)
  Unter der Liste eine kleine Legende, damit die Farben als Art und nicht als Bewertung gelesen werden, plus eine Zeile "Alle 23 Anlagen ansehen".
- Das Suchfeld in der Vorschau bleibt optisch gleich, bekommt aber den Text "ETF, Fonds oder ISIN suchen" und ist Teil des Links.

## /halal-anlagen: Suche oben

- Über den Reitern ein echtes Suchfeld: "ETF, Fonds oder ISIN suchen".
- Sucht live in Name, Anbieter und ISIN, unabhängig von Groß- und Kleinschreibung, kombiniert mit den bestehenden Filtern und der Sortierung.
- Kleines Löschkreuz im Feld, wenn etwas eingetippt ist.
- Die Zeile über der Liste zählt weiterhin die Treffer. Bei null Treffern eine ruhige Meldung mit Knopf "Filter zurücksetzen".

## Technische Hinweise

- `src/pages/Index.tsx`: Abschnitt 4 umbauen, Vorschaudaten aus `src/data/halalAnlagen.ts` beziehen statt der lokalen Platzhalterliste, Karte in ein `Link`-Element hüllen.
- `src/pages/HalalAnlagen.tsx`: Suchzustand ergänzen und in das bestehende `useMemo`-Filter einbauen, keine Änderung an der Datendatei.
- Farben: Blau, Grün und Gelb hier nur als Kategoriepunkte mit Legende, keine Ampelbewertung. Es werden nur vorhandene Tokens verwendet.
