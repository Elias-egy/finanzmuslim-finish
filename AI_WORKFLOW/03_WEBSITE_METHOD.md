# Website Method

Diese Methode extrahiert belastbare Gestaltungsprinzipien aus dem automatisch erzeugten `$10,000 Websites`-Transkript. Fehlerhafte Namen, Preise und Befehle sind keine verifizierten Fakten.

## Achtteilige Qualitaetspruefung

1. Point of view - eine erkennbare, zur Marke passende Haltung statt Moodboard-Mischung
2. Typografie - Hierarchie, Rhythmus, Lesbarkeit und markentypische Paarung
3. Farbe - begrenzte Palette mit klaren Rollen und ausreichendem Kontrast
4. Hierarchie - bewusstes erstes, zweites und drittes Leseziel pro Abschnitt
5. Imagery - markenspezifische Fotos/Grafiken/Assets statt austauschbarer Bilder
6. Motion - zur Handlung passende, subtile Bewegung; nicht Flaeche mit Effekten fuellen
7. Mobile - eigens entworfene mobile Fassung
8. Invisible quality - Performance, Semantik, Accessibility, stabile Layouts, Metadaten und Deploy-Checks

## Validierter Arbeitsablauf

1. Bestehenden Code, Git-Status, Specs und Assets identifizieren.
2. Einen praezisen Brief mit Restriktionen, geschuetzten Elementen und offenen Fragen erstellen.
3. Referenzen in uebertragbare Prinzipien zerlegen; keine fremde Seite kopieren.
4. Hoechstens zwei echte Stilrichtungen vergleichen und eine begruendet auswaehlen.
5. Statische Hierarchie, Typografie, Palette und Bildkomposition zuerst festlegen.
6. Custom Imagery nur gezielt ergaenzen; Markentext und Logos duerfen nicht deformiert werden.
7. Motion erst nach statischer Freigabe und mit reduzierter Mobile-/Reduced-Motion-Fassung.
8. Browserbasiert in realen Viewports pruefen, nicht nur Quellcode lesen.
9. Zusammenhaengende Verbesserungen als begrenzten Batch umsetzen.
10. Danach abschnittsweise die noch flachen Stellen identifizieren und hoechstens eine subtile Interaktion je betroffener Sektion erwägen.

## Browser-Testworkflow

- Sauberen lokalen Build/Preview starten, ohne bestehende Dateien zu ueberschreiben.
- Homepage, `/dein-investmentstart`, `/halal-guide`, Rechtsseiten und 404 pruefen.
- Mindestens Desktop, Tablet, 375x812 Mobile und einen breiteren Mobile-Viewport testen.
- Navigation, Fokus, Tastatur, Hover/Touch, Reduced Motion und Zurueckscrollen pruefen.
- Layout Shift, horizontales Scrollen, Bild-Crops, Schriftladung und CTA-Sichtbarkeit beobachten.
- Console/Network, Build, Lint, Tests und Lighthouse in angemessenem Umfang pruefen.
- Vor Abschluss Git-Diff und Assetgroessen kontrollieren.

## Batch-Revision

- Vorher: konkrete Schwachstellen nach den acht Kriterien benennen.
- Batch: zusammenhaengende Aenderungen an Typografie, Hierarchie, Farbe und Motion als ein Paket planen.
- Danach: Screenshots und Verhalten gegen Ausgangszustand vergleichen.
- Nur eine gezielte Korrekturrunde, sofern der freigegebene Scope dies vorsieht.

## Referenzbild-Workflow

- Quelle und Zweck im Manifest erfassen.
- Komposition, Massstab, Weissraum, Typografie, Farbe, Bildrolle, Bewegung und CTA-Hierarchie notieren.
- Markenfremde Inhalte explizit ausschliessen.
- Ableitung als Regel formulieren, nicht als Kopierauftrag.
- Umsetzung mit Amanah-Assets und -Copy testen.

## Unverifizierte Namen und Befehle - nicht installieren

- "UI/UX Pro Max" / im Transkript verstuemmelt genannte URL oder NPM-Installation
- ein zweiter nicht eindeutig benannter "front end design skill"
- 21st.dev-Komponenten samt Abhaengigkeiten, bis Architektur und Lizenz geprueft sind
- im Transkript genannte "11 Labs" als Bild-/Video-Aggregator; vermutlich Transkriptionsfehler
- ChatGPT-/Google-Video-/Topaz-Modellnamen und behauptete Modellversionen
- Hostinger-Preise, Plaene, Rabattcodes und Uploadbefehle
- jeglicher globaler Installationsbefehl aus dem Auto-Transkript

