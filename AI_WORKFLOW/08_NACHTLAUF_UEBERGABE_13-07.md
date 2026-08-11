# Morgen-Übergabe Nachtlauf 12./13. Juli 2026

Status: Homepage-Redesign mit echten Elias-Medien lokal umgesetzt. Kein Commit, kein Push, kein Publish, kein Lovable-Sync. Dev-Server läuft auf Port 8080 (`npm run dev`).

## Was geändert wurde

### Homepage (`src/pages/Index.tsx`)
- **Announcement-Bar entfernt.** Nav auf 5 Punkte reduziert: Start, Investmentstart, Tools, Blog, Über Amanah (mittig zentriert, IMG_3883-Prinzip); dunkler CTA „Guide sichern" rechts bleibt.
- **Hero neu:** echtes Elias-Video (IMG_2522) als nahtloser 5,4-s-Loop, cineastisch dezent abgedunkelt (Grade A: −8 % Helligkeit, leicht entsättigt). Headline neu: **„Halal investieren. Ohne Kompromisse."** — komplett weiß, kein Goldwort. Erklärzeile gekürzt. Nur noch EIN CTA (Creme, „Kostenlos starten" → /halal-guide). Zahlen aus dem Hero entfernt. Mobile: eigene Komposition mit IMG_2528 (statisch, Gesicht frei, Text unten).
- **Neuer heller Schnitt direkt nach dem Hero:** Stat-Band „Amanah in Zahlen" mit den drei echten Belegen (5.000+ / 453.000+ / §34d & §34f). Keine Marketing-Karten, keine Claim-Headline mehr („Vertrauen ist keine Behauptung." und die 3 Nutzen-Karten sind raus).
- **GuideStage:** jetzt dunkles Produktfenster IN der hellen Seite (Cream-Rand sichtbar, rounded, sticky top-5, 150vh statt 165vh). „Kostenloser Guide"-Pill entfernt, Headline komplett weiß, Gold-Bullet-Kreise durch feine Gold-Hairlines ersetzt, CTA creme, Trust-Zeile als reiner Text.
- **Kacheln „Drei Wege, ein Ziel."** (ohne farbiges Wort): Investmentstart = ruhiger Video-Frame (t=5,0 s); Tools = neue helle Papier-Balkendiagramm-Plate; Blog = neue helle Buch-Plate. Goldrahmen + „Entdecken"-Goldmicrotext entfernt; Pfeil inline im Titel.
- **FAQ:** von SaaS-Karten auf redaktionelle Trennlinien-Liste umgestellt.
- **Meine Story:** Collage ersetzt durch EIN echtes Portrait (IMG_2554-Ableitung, heller Creme-Studio-Hintergrund via Higgsfield, identitätstreu). Text unverändert, Typo max-w-prose.
- **Abschluss-CTA:** Muster/Blur-Orbs/Badge entfernt; weiße Headline, Creme-CTA, Kontakt als Textlink; Guide Cover V2 bleibt.

### GuideStage (`src/components/GuideStage.tsx`)
Siehe oben; Scroll-Choreografie (rAF, --p) und Mobile-Statik unverändert erhalten.

### Unterseiten (Konsistenz-Schleife)
- `/tools`: helle Editorial-Kacheln statt dunkler Gold-Rahmen-Karten; Status als stille Kleinbeschriftung (Live/Bald/In Arbeit); Headline ohne Farbwort. Renditerechner-Kachel nutzt die Tools-Plate.
- `/blog`: Headline ohne Farbwort; Empty-State als Bild+Text-Komposition mit Blog-Plate statt SaaS-Karte. ArticleCard-Struktur unverändert vorhanden.
- `/renditerechner`: unangetastet (Rechner GESCHÜTZT, Funktion verifiziert: Strategie-Klick ändert Endkapital korrekt).

## Neue Medien-Assets (alle in `src/assets/`)

| Datei | Quelle | Verwendung | Größe |
|---|---|---|---|
| hero-elias-loop.mp4 | IMG_2522.mov, Crop 1560×1080, Grade A, nahtloser Crossfade-Loop (Ende=Anfang) | Hero Desktop (autoplay muted loop playsInline) | 1,5 MB |
| hero-elias-poster.webp | Video-Frame t=5,0 s (ruhigste Mimik), gleicher Crop | Poster/Fallback + prefers-reduced-motion | 118 KB |
| hero-elias-mobile.webp | IMG_2528, Crop oberhalb Kopf, Grade angenähert | Hero Mobile (statisch) | 101 KB |
| investmentstart-elias.webp | Video-Frame t=5,0 s, 4:5-Crop | Kachel „Dein Investmentstart" | 71 KB |
| story-elias.webp | IMG_2554 (4:5) → Higgsfield nano_banana_pro Hintergrund-Swap auf Creme-Studio, Person unverändert | „Meine Story" | 38 KB |
| tools-plate.webp | Higgsfield soul_2, textfreies Papier-Balkendiagramm Cream/Grün/Messing | Kachel Tools + /tools | 41 KB |
| blog-plate.webp | Higgsfield soul_2, offenes Buch, blanko Seiten, grünes Leinen, Gold-Stift | Kachel Blog + /blog | 56 KB |

Higgsfield-Verbrauch: 5 Bildjobs (2 verworfene Taschenrechner-Versuche wegen KI-Ziffern), Restguthaben ~90 Credits. Verworfene Varianten liegen NICHT im Repo.

## QA-Status

- **Desktop 1440 (echtes Chrome):** alle Sektionen geprüft, Hero-Video läuft, Guide-Choreografie reversibel, keine Konsolen-Fehler (nur bekannte React-Router-v7-Warnungen).
- **Mobile 375 (Pane):** Hero-Komposition eigenständig, Gesicht frei, alle Sektionen geprüft, kein horizontaler Overflow.
- **Tablet ~830:** Text-über-Gesicht-Problem gefunden und behoben (Video ankert jetzt links: object-[0%_25%]).
- **Build + tsc:** sauber (2,7 s). Homepage-JS 395 KB gzip 123 KB; recharts weiter nur auf /renditerechner.
- **Routen:** /, /tools, /renditerechner (Interaktion verifiziert), /blog, 404 markenkonform, /dein-investmentstart unangetastet.
- **prefers-reduced-motion:** Video → statisches Poster; GuideStage → statisch (Code-Pfad, nicht im Browser emuliert).
- **QA-Hinweis Video:** Im automatisierten Chrome (Claude-Extension-Instrumentierung) hing der Vite-Video-Stream reproduzierbar (readyState 0) — Datei per ffprobe/Decode-Test verifiziert, Server liefert korrekt (200/206), Claude-Pane spielt das Video (readyState 4). Einstufung: Umgebungs-Artefakt, kein Site-Bug. Bitte morgen einmal kurz in normalem Chrome/Safari gegenprüfen (Loop startet und endet am Poster-Frame, Übergang sollte unsichtbar sein).

## Offene Entscheidungen für Elias

1. **Hero-Headline:** „Halal investieren. Ohne Kompromisse." — Alternativen wären „Investieren. Ohne Kompromisse." oder „Dein Vermögen. Halal." Entscheidung ist reversibel (eine Zeile in Index.tsx).
2. **Video-Loop-Mimik:** Der Loop enthält Sprechmimik/Gesten aus dem Rohclip. Wenn zu unruhig: ruhigeres Material nachdrehen oder statisches Hero-Bild (Poster existiert bereits).
3. **Story-Bild:** Creme-Studio-Ableitung (Higgsfield) ist eingebaut; das Original mit Holzpaneelen liegt in Downloads (IMG_2554) und kann jederzeit zurückgetauscht werden.
4. **/halal-guide** nutzt weiterhin die alte Cover-Familie (A2 vertagt — nicht angefasst).
5. Commit-/Lovable-Sync-Strategie weiterhin offen (nichts committed).

## Startbereit

`cd ~/Documents/dev/amanah-landing-elegant && npm run dev` → http://localhost:8080
