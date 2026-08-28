# Angebotszeile in der Vergleichstabelle sauber ausrichten

## Problem

Auf `/vergleich/depot` (Laptop) überlappt der aktive blaue „Zum Angebot*“-Knopf die Anbieter-Kopfzeile darüber (deckt den Produktnamen „FreeBroker“ ab). Ursache: Der Knopf wurde zuletzt mit `relative z-50` über alle Tabellenschichten gehoben, um ein Abschneiden zu verhindern. Das löste das alte Problem optisch nicht, schuf aber ein neues: Der Knopf liegt jetzt über der klebenden Kopfzeile, und die Zeile „Angebot“ wirkt verschoben und unsauber.

## Ziel

Jede Zeile bekommt ihren festen Platz: Kopfzeile klebt sauber oben, die Angebotszeile steht als normale erste Datenzeile darunter, nichts überlappt, nichts wird abgeschnitten — aktiv und deaktiviert sehen gleich hoch und mittig aus.

## Schritte

1. **Diagnose bestätigen**: Mit Playwright (Screenshot + DOM-Maße) prüfen, wo der Knopf relativ zur Zelle und zur Kopfzeile liegt, und welche Schicht (sticky header `z-30`/`z-20`, Zelle, Knopf `z-50`) übermalt.

2. **`AngebotsKnopf` zurückbauen** (`src/components/vergleich/VergleichsBausteine.tsx`):
   - `relative z-50` entfernen — der Knopf bleibt in seiner Zelle.
   - Aktiver Link und deaktivierter Button bekommen identische Maße: `flex w-full min-h-[52px] items-center justify-center` mit `leading-tight`, damit beide Zustände gleich hoch sind und der Text vertikal mittig steht.
   - Kein `overflow-hidden` am Knopf selbst nötig, weil die Zelle groß genug ist (min-h-[60px], Padding).

3. **Schichten in der Tabelle aufräumen** (`src/components/vergleich/VergleichsTabelle.tsx`):
   - Sicherstellen, dass die klebende Kopfzeile (`z-30` Kriterium-Ecke, `z-20` Anbieterzellen) mit deckendem `bg-card` immer über den Datenzeilen liegt — Datenzeilen bekommen keinen z-index.
   - Die Angebotszeile bekommt wie alle Datenzeilen die gemeinsame Zellenklasse (`min-h-[60px]`, zentriert), damit der Knopf vertikal Platz hat und nicht an die Kopfzeile stößt.

4. **Prüfen**:
   - Playwright-Screenshots auf `/vergleich/depot` (Laptop-Breite): Kopfzeile, Angebotszeile oben, Angebotszeile unten — aktiv und deaktiviert vollständig sichtbar, keine Überlappung, auch beim Scrollen (Kopf klebt, Zeilen laufen darunter).
   - Kurzer Blick auf die mobile Kartenansicht (`VergleichsKarten.tsx` nutzt denselben `AngebotsKnopf`), dass dort nichts verrutscht.

## Technische Details

- Keine Daten-, Routen- oder Textänderungen — nur CSS-Klassen in den beiden Vergleichskomponenten.
- Betroffene Dateien: `src/components/vergleich/VergleichsBausteine.tsx`, ggf. `src/components/vergleich/VergleichsTabelle.tsx`.
- Der bisherige `z-50`-Workaround wird ersetzt, nicht ergänzt.
