# Current State

Stand: 14. Juli 2026, ~13:38 (Visual-Refinement Pass 3 — Fortsetzung nach Elias-Feedback vom Vortag, in dieser Session bis Chat-Laenge-Limit gearbeitet, Fortsetzung in neuer Session noetig).

## Visual-Refinement Pass 3 (14.7. mittags) — Elias-Feedback direkt umgesetzt

Ausgangspunkt: Elias gab qualitatives Feedback ("zu weiss", §34d/§34f raus, FAQ langweilig, Hero-Referenzen Ferdy/Tony Robbins). Plan wurde NICHT vorab in AskUserQuestion/Freigabe-Runden zerlegt, sondern iterativ mit Live-Screenshots pro Schritt abgestimmt.

**Schritt 1 — Creme-Fundament (ERLEDIGT):** `src/index.css` Tokens waermer gestellt: `--background` 96%→94%, `--surface` 93%→89% (mehr Saettigung 38→46%), `--card` 98→97%, `--secondary` 92→89%, `--muted` 90→87%, `--border` 86→83%, `--nav` 97→95%. Homepage-Kachelsektion + `/tools`-Seite liefen bereits auf `bg-surface` (aus Pass 2) und zeigen den Effekt jetzt deutlich sichtbar. Visuell bestaetigt.

**Schritt 2 — §34d/§34f komplett entfernt (ERLEDIGT):** Elias hat die IHK-Pruefung noch nicht abgelegt, will die Lizenz-Referenz vorerst nicht zeigen. Entfernt aus 5 Stellen: Stat-Arrays (Index.tsx, HalalGuide.tsx) → ersetzt durch `{ value: "100%", label: "Islamkonform", note: "Riba-frei, nur geprüfte Branchen" }`; Story-Flieesstext Index.tsx (Satz gekuerzt); Story-Flieesstext HalalGuide.tsx ("Elias hat nach Vorträgen an deutschen Universitäten..."); InvestmentStart.tsx Badge + Flieesstext (Badge → "Vorträge an Universitäten", geschuetzte Seite NUR an dieser einen Stelle angefasst, sonst nichts). `grep -rn "34d\|34f\|GewO"` bestaetigt: keine Treffer mehr. tsc sauber.

**Neue Bilder eingebaut (ERLEDIGT):** Elias hat 3 Bilder in `~/Downloads/landing bilder/` bereitgestellt, per `sips` konvertiert/optimiert (JPG q80-82, max 1400px lange Kante) nach `src/assets/`:
- `hero-elias-talk.jpg` (Elias haelt Praesentation, weisses Hemd, Headset-Mic) → **mobiler Hero** (Index.tsx `heroMobile`-Import). Crop justiert: `object-[42%_top] scale-[1.08]` (Kopf komplett im Bild, vorher war das alte Portrait-Bild mit anderem Crop-Faktor hinterlegt).
- `investmentstart-graph.jpg` (Elias vor leuchtendem gruenen Wachstums-Graph + Moschee-Silhouette, dunkles Editorial-Motiv) → **"Dein Investmentstart"-Kachel auf der Homepage** (Index.tsx `investmentstartEliasStudio`-Import, `portalTiles.investmentstart`). Tile-Theme von `"light"` auf `"dark"` umgestellt (Bild ist selbst dunkel), `imagePos: "object-[center_20%]"`.
- `story-elias-paneele.jpg` (Portrait vor Holzpaneelen, schwarzes Shirt — identisch zum Hero-Video-Look) → **"Über Elias"/Story-Sektion** (Index.tsx `storyElias`-Import). Slot ist exakt 4:5 (1120×1400 Quellbild) → kein Crop noetig. **Damit ist der fruehere Zielkonflikt aus Pass 2 (580px-Original vs. Higgsfield-Upscale) obsolet** — neues Bild ist bereits HD und "echt", keine KI-Generierung mehr noetig.
- Alle drei Originale unangetastet in `~/Downloads/landing bilder/`. Alte Higgsfield-Assets (`story-elias-warm.webp`, `investmentstart-elias-studio.webp`, `hero-elias-mobile.webp`) bleiben ungenutzt im Repo liegen (Rueckfalloption, koennten vor Commit aufgeraeumt werden).
- Build bestaetigt: `hero-elias-talk-*.jpg` 110KB, `investmentstart-graph-*.jpg` 249KB, `story-elias-paneele-*.jpg` 294KB im dist-Output.

**Desktop-Hero komplett neu (Tony-Robbins-/Ferdy-Referenz, ERLEDIGT, iterativ mit Elias abgestimmt):**
- Elias zeigte zwei Referenz-Screenshots (Ferdy.com: zweifarbige Headline + Vollton-CTA + Bild in Markenfarbe abgedaempft; Tony Robbins: EIN zusammenhaengender Spruch ueber 2-3 Zeilen statt zwei getrennter Statements, dann CTA).
- Alte Headline "Halal investieren. Ohne Kompromisse." ERSETZT durch neuen Spruch: **"Vermögen aufbauen, ohne deinen Glauben aufzugeben."** (von Elias aus 3 Vorschlaegen gewaehlt). Laeuft aktuell ueber 3 Zeilen bei der grossen Schrift (`text-[34px] sm:text-[48px] md:text-[56px] lg:text-[62px]`) — Elias wollte explizit "wuchtig lassen" statt auf 2 Zeilen zu verkleinern.
- Zwei Akzentfarben-Varianten gebaut und live verglichen (Gruen `#38d178`/`#15935a` vs. Gold `#e8af3c`) fuer Headline-Zeile-2-Faerbung + Bild-Abdaempfung + CTA. **Elias' finale Entscheidung nach mehreren Iterationen:**
  - Headline **komplett WEISS** (keine Zweifarbigkeit mehr — das war die urspruengliche Ferdy-Idee, wurde von Elias verworfen zugunsten von "alles weiss, wirkt aufgeraeumter").
  - Bild-Abdaempfung **zurueck auf neutral** `#171410` (Gruen-Test `#0d1f17` explizit rueckgaengig gemacht — "das grün im hintergrund... raus, also klar nur hell die panäle").
  - CTA **"Kostenlos starten" in Gold** `bg-[#e8af3c] text-[#143328] hover:bg-[#d49a2a]` (einziger Farbakzent im Hero).
  - Subline "Klare, geprüfte Wege zu islamkonformem Investieren..." **komplett ENTFERNT** (Elias: "soll weg").
  - Abstand Headline→CTA vergroessert: `mt-16 md:mt-24` (vorher `mt-7 md:mt-9`) — CTA sitzt jetzt spuerbar tiefer, mehr Luft. Per JS gemessen: 96px Gap bei 1300×850 Viewport, bestaetigt korrekt.
- Mobiler Hero-Gradient/Crop unangetastet von den Farbaenderungen (nur das Bild selbst wurde getauscht, siehe oben).
- Alle Aenderungen visuell UND per JS (`getComputedStyle`/`getBoundingClientRect`) verifiziert, da die Browser-Pane wiederholt zwischen Mobil-/Desktop-Rendering sprang (bekanntes Artefakt, kein Site-Bug) — JS-Messung ist die verlaesslichere Verifikationsmethode in dieser Umgebung.
- **Kein Elias-Go/Freigabe-Screenshot fuer die FINALE Hero-Version eingeholt** — letzte Nachricht von Elias war "chat ist zu lang, neue Session". Der zuletzt gezeigte Stand (weiss/Gold/kein-Gruen/96px-Gap) war Elias' eigene Anweisung, aber ein abschliessendes "passt" fehlt noch.

## Offen fuer naechste Session

1. **Hero-Freigabe einholen** — aktuellen Stand nochmal zeigen, Elias bestaetigen lassen bevor weitergearbeitet wird.
2. **Schritt 3 (noch NICHT begonnen): FAQ-Bereich** — Elias' Original-Feedback: "hat momentan zu wenige Akzente, wirkt fast ausschliesslich schwarz-weiss. Dort muss mehr Farbe beziehungsweise mehr Creme eingebracht werden." Plan aus Pass-2-Analyse: FAQ-Sektion auf Creme-Flaeche stellen, offene Antwort in zartem Creme-Panel mit Gold-Hairline links, aktive Frage mit Gold-Akzent (Plus-Icon `gold-deep`, kleine Goldlinie). Datei: `src/pages/Index.tsx`, Sektion `id="faqs"` (Zeile ~424 vor diesem Umbau, Zeilennummern haben sich seitdem verschoben).
3. Elias' urspruengliches Feedback hatte noch einen Punkt, der in dieser Session NICHT bearbeitet wurde: **Guide-Section-Struktur auf `/halal-guide`** naeher ans Lovable-Original bringen (kuerzere Sequenz: Titel → Cover → Fragen → E-Mail → kurze Microcopy, kein langer erklaerender Text). Elias war explizit klar: **visuelles Design der Guide-Section NICHT aendern** (gefaellt ihm sehr gut so), nur die Struktur/Reihenfolge kompakter machen. Noch nicht begonnen.
4. Alte ungenutzte Bild-Assets (`story-elias-warm.webp`, `investmentstart-elias-studio.webp`, `hero-elias-mobile.webp`, `hero-elias-poster.webp`?, `hero-elias-loop.mp4`?) vor einem Commit aufraeumen — pruefen, welche noch als Fallback gebraucht werden (Desktop-Hero-Video laeuft z.B. weiterhin ueber `heroLoop`/`heroPoster`, NICHT ersetzt).
5. Weiterhin: kein Commit/Push/Publish. Dev-Server laeuft ueber Claude-Browser-Pane-`preview_start` (Port 8080) — bei neuer Session ggf. neu starten, falls der Prozess der alten Session beendet wurde.

---

## Aeltere Stände (Visual-Refinement Pass 2, 13.7. abends)

## Visual-Refinement Pass 2 (13.7. abends, TEILWEISE — Zeitbudget war 27 statt 55 Min.)

- Ursache der "ausgewaschenen" Kacheln gefunden und behoben: `PortalTile` (Index.tsx) und `ToolTile` (Tools.tsx) legten einen cremefarbenen `bg-gradient-to-t` mit `inset-0` (Vollflaeche) ueber das gesamte Bild. Ersetzt durch einen bodenverankerten dunklen Scrim (`inset-x-0 bottom-0 h-[52-62%]`) nur hinter der Textzone — Bilder zeigen jetzt volle Tonwerte im oberen Bereich. Texte auf Kacheln mit Bild sind jetzt durchgaengig hell/weiss (vorher dunkel auf jetzt dunklem Scrim waere unlesbar gewesen — bewusst mitgeaendert).
- Klare Kanten ergaenzt: `border` + dezenter Schatten je Kachel (hell: warmer Border + Gruen-Schatten, dunkel: Weiss/10-Border), Hover-Border wird gold.
- Ganzkachel-Hover ergaenzt (vorher nur Bild-Zoom): `-translate-y-2 scale-[1.03]`, 340ms cubic-bezier, `motion-safe`-gated, `active:scale-[1.015]`.
- `/tools`: identischer Kanten-/Kontrast-Fix auf die live Renditerechner-Kachel angewandt. Die 3 "Bald"/"In Arbeit"-Kacheln (Zakat, Bereinigung, Budget) hatten KEIN Bild und wirkten leer — Duplikat-Text-Badge entfernt, stattdessen dezentes Lucide-Icon (Percent/SlidersHorizontal/PieChart) auf strukturiertem Streifenmuster; Status-Label unten links bleibt einzige Textquelle.
- Verifiziert: tsc sauber, `npm run build` sauber (nur 2 kosmetische Tailwind-Ambiguitaets-Warnungen zu `duration-[340ms]`/`ease-[cubic-bezier(...)]`, kein Fehler), Browser-Konsole leer, `/tools` visuell im Pane bestaetigt (volle Bildtonwerte, klare Kante, kein Milchglas mehr). Homepage-Portal-Kacheln nutzen denselben Code, liessen sich aber wegen der bekannten Pane-Below-Fold-Eigenheit (siehe 06_DECISION_LOG) nicht zusaetzlich fotografisch bestaetigen — **echter Browser-Check durch Elias fuer die Homepage-Kacheln empfohlen**.

### Nachtrag 22:46-22:53 (Nutzer bat, Restzeit voll auszunutzen)

- Prioritaet F umgesetzt: die 3 Gold-Hairline-Inhaltszeilen unter dem Homepage-Guide-Buch (`GuideStage.tsx`, vorher `bullets`-Array + `<ul>`) entfernt. Buch vergroessert (Desktop `clamp(300px,26vw,420px)` -> `clamp(340px,30vw,480px)`, Grid-Split `1fr_1.05fr` -> `0.95fr_1.15fr`, Mobile-Buch `56%/280px` -> `62%/320px`). fadeUp-Timings der verbleibenden Elemente nachgezogen.
- Dasselbe Muster im `/halal-guide`-Produktfenster gefunden und behoben (`HalalGuide.tsx`): die identischen 3 Zeilen (`contents.slice(0,3)` als `<ul>`) entfernt, Buch vergroessert (max-h 300/380px -> 360/460px), durch eine einzelne ehrliche Microcopy-Zeile ersetzt ("Sofort als PDF · 100% islamkonform"). Die separate "Was im Guide steht"-Sektion (alle 4 Punkte, redaktionelle Liste weiter unten) ist NICHT die gemeinte Duplikat-Liste und blieb unangetastet.
- Prioritaet G (Teilumsetzung): Above-the-fold auf `/halal-guide` mobil verdichtet — H1 `text-4xl`(36px) -> `text-[32px]`, Subline `16px`->`15px`, Level-Frage `text-xl`->`text-lg`, vertikale Abstaende (`py-10`->`py-7`, `mt-4/5/8`->`mt-3/3/6`) und Level-Options-Padding (`px-5 py-4`->`px-4 py-3.5`) mobil reduziert; `sm:`/`md:`-Groessen unveraendert.
- Verifiziert: tsc + `npm run build` erneut sauber nach allen Aenderungen. Mobile-Screenshot 375x812 von `/halal-guide` bestaetigt sichtbar dichtere Above-the-fold. Homepage-Screenshot 375x812 zeigt Hero weiterhin fehlerfrei; Browser-Konsole zeigt einen wiederholten `GuideStage`-Fehlereintrag mit FIXIERTEM Zeitstempel (`t=1783975740426`) — identisch zum in `01_CURRENT_STATE.md`/`06_DECISION_LOG.md` bereits dokumentierten Pane-Artefakt "historische Eintraege aus einem zwischenzeitlichen (behobenen) Zustand". Seite rendert visuell fehlerfrei, Build/tsc sauber. **Update 23:03: endgueltig verifiziert** — in einem komplett frischen Browser-Tab (nicht nur reload) zeigt die Konsole auf `/` KEINE Fehler mehr. Der GuideStage-Eintrag war zweifelsfrei das Stale-Log-Artefakt des alten Tabs. Kein offener Verdacht mehr, kein Real-Browser-Gegencheck fuer GuideStage noetig.

### Nachtrag 2, 22:53-22:55

- "Kostenlos starten" (Hero-CTA, Index.tsx): Hover-/Focus-Zustand ergaenzt — vorher nur `hover:bg-white`, jetzt `hover:bg-[#143328] hover:text-cream hover:border-gold/60` + `focus-visible`-Aequivalent mit Gold-Outline. Klassen im DOM verifiziert; per erzwungenem Inline-Style-Test (Debug, nicht im Quellcode) visuell bestaetigt: sauberer tiefgruener Zustand mit Cream-Text und feiner Goldkante, genau wie gefordert.

### Nachtrag 3 (Zeitlimit auf Nutzerwunsch aufgehoben, 23:02-23:15)

- Konsolenfehler-Verdacht abschliessend geklaert: komplett frischer Browser-Tab (nicht nur Reload) zeigt auf `/` und `/renditerechner` KEINE Fehler. Endgueltig bestaetigt als Stale-Log-Artefakt des alten Tabs, kein Code-Problem.
- **Prioritaet D umgesetzt (Homepage + `/tools`)**: Die Kapitelvorschauen-Sektion (Portal-Kacheln) auf der Homepage lief vorher auf `bg-background` direkt neben zwei weiteren `bg-background`-Sektionen (Stat-Band, FAQ) — ein langer reinweisser/uniformer Abschnitt. Umgestellt auf `bg-surface` (waermerer Cream-Ton) + `border-y`, wie explizit gefordert ("Portal-/Tools-Bereiche auf eine waermere Cream-/Stone-Flaeche"). Jetzt sauberer Kapitelwechsel: Stat(background) → Guide(dunkel) → Kacheln(surface) → FAQ(background) → Story(surface) → CTA(dunkel). `/tools`-Seite ebenso von `bg-background` auf `bg-surface` gestellt fuer Konsistenz mit der Homepage-Kachel-Sektion. Kartenabgrenzung visuell gegengeprueft (Zoom-Screenshot): Kacheln bleiben durch Rahmen/Schatten/Musterung klar erkennbar, kein Verschwimmen mit dem waermeren Hintergrund.
- Ganzkachel-Hover geometrisch verifiziert (JS-Messung): Abstand zwischen den zwei gestapelten Homepage-Kacheln (Tools/Blog) betraegt 28px, die Hover-Vergroesserung braucht rechnerisch max. 12px pro Seite — kein Clipping-/Ueberlappungsrisiko.
- **Prioritaet A bewusst NICHT neu generiert**: Mobile-Hero-Screenshot (375×812) frisch prueft — Gesicht ist bereits frueh im Viewport sichtbar, bewusst komponiert, Text schneidet nicht ungluecklich durchs Gesicht, wirkt professionell. Erfuellt die harten Abnahmekriterien bereits. Eine neue Higgsfield-Generierung fuer ein identitaetskritisches Portraitbild ohne konkreten sichtbaren Mangel und ohne Elias' visuellen Side-by-Side-Vergleich waere unverhaeltnismaessiges Risiko (moegliche Identitaetsabweichung) fuer unklaren Gewinn. Bestehendes `hero-elias-mobile.webp`/`hero-elias-loop.mp4` bewusst beibehalten.
- Finale Vollverifikation: `tsc --noEmit`, `eslint` (alle 4 geaenderten Dateien) und `npm run build` alle sauber (nur die 2 bekannten kosmetischen Tailwind-Warnungen). `/dein-investmentstart`, `/blog`, `/renditerechner` per Screenshot gegengeprueft — keine Regression.

### Weiterhin NICHT bearbeitet (bewusst offen, kein Zeitmangel mehr — sondern Elias-Entscheidung oder neue Assets noetig)

- `Dein Investmentstart`-Kachel-Bild, Blog-Kachel-Bild: keine neuen Higgsfield-Jobs; bestehende Assets (`investmentstart-elias-studio.webp`, `blog-plate.webp`) weiterverwendet, nur der Scrim/Kanten-Code drumherum korrigiert.
- Story-Original-Pruefung (Prioritaet E): siehe Zielkonflikt in `07_NEXT_TASK.md` — Elias-Entscheidung noetig (580px-Original vs. bestehendes Higgsfield-Upscale).
- `/halal-guide` Prioritaet G nur teilweise (above-the-fold-Dichte + Produktfenster-Bullets entfernt); restliche Seitenbereiche (Trust-Band, Inhalte-Liste, FAQ) nicht weiter verdichtet, da bereits funktional und nicht Teil der explizit genannten Above-the-fold-Beschwerde.
- Kein Higgsfield-Bildjob in diesem gesamten Lauf ausgefuehrt — bewusste Entscheidung, keine identitaetskritischen Assets ohne Elias' visuelle Freigabe neu zu generieren.

## Technik und Repository

- Vite 5, React 18, TypeScript, React Router, Tailwind 3, shadcn/Radix
- Branch: `main`, verfolgt `origin/main` — weiterhin NICHTS committed/gepusht/gepublisht
- Alle Aenderungen (Nachtlauf + Nachmittagslauf) liegen ungecommitet im Arbeitsbaum
- Dev-Server: `npm run dev` → Port 8080
- Build + `tsc --noEmit`: sauber (2,7 s, Homepage-JS 402 KB / gzip 125 KB)

## Routen

- `/` Homepage (neu: Header ohne Investmentstart, Kontakt-Textlink, volle Hero-Hoehe, Mobile-Crop, helle Investmentstart-Kachel, neues Story-Portrait)
- `/halal-guide` KOMPLETT NEU: fokussierte Lead-Magnet-Seite (Editorial-DNA, Level-first-Flow, async Webhook)
- `/dein-investmentstart` unangetastet
- `/tools`, `/renditerechner` (geschuetzt, unangetastet), `/blog`, `/impressum`, `/datenschutz`, `/dev-guide-stage` (vor Livegang entfernen), 404

## Homepage-Stand (nach Nachmittagslauf)

- Header Desktop: Start, Tools, Blog, Ueber Amanah mittig; rechts `Kontakt aufnehmen` (Textlink, mailto) + `Guide sichern` (einziger dunkler Button). `Investmentstart` aus der Nav entfernt.
- Mobile-Menue: gleiche Links + Kontakt-Textlink + Guide-Button.
- Hero Desktop: fuellt sichtbaren Bereich unter dem 72px-Header komplett (`min-h-[calc(100svh-72px)]`, waechst bei kleinen Laptops mit).
- Hero Mobile: naeherer Crop (`scale-[1.3] -translate-y-[10%]`) — Gesicht frueher sichtbar, weniger leere Paneele, Text ueberdeckt das Gesicht nicht.
- Kachel `Dein Investmentstart`: NEU helles Studio-Portrait `investmentstart-elias-studio.webp` (Higgsfield Nano Banana Pro, Hintergrund-Swap + 16:9-Erweiterung, Variante B), theme "light", Elias rechts, Negativraum links.
- `Meine Story`: NEU `story-elias-warm.webp` — von Elias bereitgestelltes Portrait (Bilder Solo 27.5.), Higgsfield-2K-Upscale, 4:5-Crop 1120x1400.
- Alte Assets `story-elias.webp`, `investmentstart-elias.webp` (nur noch Guide-Autor), `guide-three-books.png` (ungenutzt) liegen weiter im Repo als Rueckfalloption.

## `/halal-guide`-Stand (neu gebaut)

- Reduzierter Header: Logo + `Zur Startseite`; keine volle Navigation.
- Above the fold: Nutzen-Headline, Subline, Level-Auswahl (Schritt 1, ohne personenbezogene Daten), rechts dunkles Produktfenster mit Guide-V2-Cover (`guide-book-cut.webp`) + 3 Gold-Hairline-Inhalte.
- Flow: Level (`Einstieg`/`Aufbau`/`Vertiefung`) → Bestaetigungszeile → Vorname + E-Mail → Submit.
- Webhook (Make, unveraendert): Antwort wird ABGEWARTET; Loading-/Disabled-Zustand; Fehler sichtbar (role="alert") und wiederholbar. Payload kompatibel: `{email, vorname, nachname: "", level: einsteiger|fortgeschritten|profi}`.
- Erfolgszustand: Zustellung bestaetigt (mit Level-Fassung + E-Mail-Adresse, Spam-Hinweis), danach optionale Sekundaeraktion `Zum Investmentstart`.
- Sektionen: Trust-Band (5.000+/453.000+/§34d & §34f) → `Das lernst du` (4 Punkte) → `Fuer wen` / `Was der Guide nicht ist` → Elias-Vertrauensabschnitt (Video-Frame-Portrait) → FAQ (5) → Abschluss-CTA (scrollt zum Formular, bei Erfolg ausgeblendet).
- Consent-Text lesbar (13px) mit Datenschutz-Link; keine DOI-/Personalisierungs-Behauptungen, die technisch nicht verifiziert sind.
- Footer mit Impressum/Datenschutz ergaenzt.

## QA-Status 13.7. nachmittags

- Desktop 1440: Header/Hero/Guide-Seite visuell geprueft (Screenshots im Lauf).
- Mobile 375 + Tablet 834: Hero-Crop, Guide above-the-fold, kein horizontaler Overflow (0px auf / und /halal-guide bei 375/834/1440).
- Formular-Flow mit gemocktem fetch getestet (500-Fehlerpfad + 200-Erfolgspfad); KEINE echten Daten an Make gesendet.
- Build + tsc sauber. Konsole: nur historische Eintraege aus einem zwischenzeitlichen (behobenen) Syntaxfehler.
- BEKANNTE PANE-EIGENHEIT: Im instrumentierten Preview-Browser wird Inhalt unterhalb des ersten Viewports nicht gepaintet (DOM/Opacity/Geometrie per JS verifiziert korrekt). Below-fold-Sektionen bitte einmal im echten Browser sichten.

## Geschuetzte Elemente (unveraendert)

- Renditerechner-Funktion, /dein-investmentstart, Make-Webhook-Segmentierung, Datenschutz-/Impressum-Links, Guide-PDF-Inhalte, Hero-Video-Material
