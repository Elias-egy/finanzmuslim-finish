# Decision Log

## 13. Juli 2026 (spaeter Abend, 22:38-22:47) - Visual-Refinement Pass 2 (zeitboxed, nur Teil A/B/C)

- Auftrag verlangte 55 Min. bis spaetestens 23:05; tatsaechliches Budget war nur 27 Min. (Start 22:38). Deshalb bewusst auf die zwei hoechst-wirksamen, risikoarmen Fixes ohne neue Higgsfield-Jobs reduziert statt oberflaechlich alle 7 Prioritaeten anzufassen.
- Diagnose bestaetigt: Die "ausgewaschenen" Kacheln kamen nicht von schlechten Bildern, sondern von einem Vollflaechen-Cream-Gradient (`inset-0`) ueber `PortalTile` (Index.tsx) und `ToolTile` (Tools.tsx). Fix: bodenverankerter dunkler Scrim + Border/Schatten + Ganzkachel-Hover. Details in `01_CURRENT_STATE.md`.
- `/tools`-Platzhalterkacheln (Zakat/Bereinigung/Budget) hatten einen doppelten "BALD"-Text (Badge + Label); durch ein einzelnes Lucide-Icon ersetzt statt eines zweiten Higgsfield-Bildjobs — schneller, kein Risiko einer weiteren "vergurkten Ziffern"-Situation wie beim Taschenrechner-Motiv im Nachtlauf.
- Bewusst NICHT gemacht: keine neuen Higgsfield-Generierungen (Mobile-Hero-Vergleich, Investmentstart-/Blog-Kachelbilder) — ein serioeser Modell-/Identitaets-Vergleich braucht mehr als die verfuegbaren Minuten. Kein Commit/Push/Publish.
- Verifikation: `npx tsc --noEmit` sauber, `npm run build` sauber (2 kosmetische Tailwind-Warnungen), Browser-Konsole leer, `/tools` per frischem Pane-Load fotografisch bestaetigt. Homepage-Kacheln nicht zusaetzlich fotografiert (bekannte Pane-Below-Fold-Eigenheit, s.u. 12.7.).

## 13. Juli 2026 (spaeter Abend, Fortsetzung nach 23:05 auf Nutzerwunsch, Zeitlimit final aufgehoben)

- Guide-Minuszeilen (Prioritaet F) auf Homepage (`GuideStage.tsx`) UND `/halal-guide` (`HalalGuide.tsx`) entfernt — beide hatten dieselben 3 Gold-Hairline-Zeilen dupliziert. Buch in beiden Kontexten vergroessert.
- `/halal-guide` Above-the-fold mobil verdichtet (Prioritaet G, Teil 1).
- Farbrhythmus (Prioritaet D): Homepage-Kachelsektion + `/tools`-Seite von `bg-background` auf `bg-surface` umgestellt, um den geforderten Kapitelwechsel zu erzeugen und die Kacheln plastischer vom Hintergrund abzuheben. Kartenlesbarkeit gegen den waermeren Hintergrund per Zoom-Screenshot geprueft — weiterhin klar abgegrenzt.
- Konsolenfehler-Verdacht (`GuideStage`) abschliessend als Stale-Log-Artefakt eines wiederverwendeten Browser-Tabs entlarvt (frischer Tab: keine Fehler).
- Bewusste Entscheidung gegen neue Higgsfield-Jobs in diesem gesamten Lauf: Mobile-Hero (Prioritaet A) erfuellt die harten Abnahmekriterien bereits (Gesicht frueh sichtbar, Text ueberdeckt es nicht ungluecklich); eine Neugenerierung eines identitaetskritischen Portraits ohne konkreten Mangel und ohne Elias' visuellen Vergleich waere unverhaeltnismaessiges Risiko. Bestehendes Asset beibehalten.
- Zielkonflikt entdeckt und dokumentiert statt selbst entschieden: Master-Prompt verlangt die unveraenderte Story-Originaldatei (nur 580×614px verifiziert), aktuell im Einsatz ist ein bereits identitaetsgeprueftes Higgsfield-2K-Upscale derselben Quelle. Rueckbau auf die 580px-Datei waere eine Qualitaetsverschlechterung — Entscheidung an Elias uebergeben (`07_NEXT_TASK.md`).
- "Kostenlos starten"-Hover/Focus auf tiefes Gruen + Cream-Text + Gold-Kante umgestellt (vorher nur `hover:bg-white`).
- Finale Vollverifikation (tsc, eslint auf allen 4 geaenderten Dateien, `npm run build`, Stichproben-Screenshots auf `/`, `/tools`, `/halal-guide`, `/blog`, `/dein-investmentstart`, `/renditerechner`) durchgehend sauber, keine Regressionen gefunden.
- Kein Commit/Push/Publish/Sync in diesem gesamten Lauf.

## 12. Juli 2026 (Abend) - Umsetzung neue Homepage-/Routenstruktur (lokal abgeschlossen)

- Umsetzung von Elias freigegeben und lokal durchgefuehrt. Kein Commit/Push/Publish/Deploy/Higgsfield.
- TYPOGRAFIE-REVISION: Nach ausdruecklicher Vorgabe wurden mit UI UX Pro Max + Anthropic-Frontend-Design-Skill drei seriose Sans-Systeme in echten Browserproben verglichen (Schibsted Grotesk+Source Sans 3 / Archivo+Inter / IBM Plex Sans). GEWAEHLT: **Schibsted Grotesk (600-800, Headlines) + Source Sans 3 (400-600, Body)** — Editorial-/Presse-DNA, warm-serioes, klar kein SaaS-/Tech-Default. Ersetzt die fruehere Inter-Tight-Empfehlung. Nunito vollstaendig entfernt.
- Accessibility-Entscheidung aus Skill-Check: neues Token `--gold-deep` (hsl 38 62% 34%) fuer Gold-Text auf hellen Flaechen; helles Gold #e8af3c bleibt fuer Dunkelflaechen und Linien.
- Umgesetzt: Header-CTA "Guide sichern" (Desktop+Mobile-Menue); Nav Tools/Blog als Routen; Vertrauensbereich mit Stat-Band (echte Zahlen) + Nutzen-Karten; 3 Portal-Kacheln (Signatur: Gold-Innenrahmen, vom V2-Cover-Goldrahmen abgeleitet); `/tools` (4 Kacheln, 1 live), `/renditerechner` (Rechner 1:1 verschoben, verifiziert: Strategie-/Laufzeit-Interaktion, Werte, Chart), `/blog` (Coming-soon + wiederverwendbare ArticleCard), markenkonforme 404; Abschluss-CTA nutzt Guide Cover V2 (`guide-book-cut.webp`); Mobile-H1-Fix; Announcement-Bar-Kurztext mobil; Reveal-Fallback (1.2s) gegen unsichtbare Inhalte nach Ankersprung.
- Performance: Tools/Renditerechner/Blog per React.lazy; Homepage-JS 789->399 KB (recharts nur noch auf /renditerechner, 391 KB separat).
- Kachel-Bilder sind bewusst austauschbare Platzhalter aus vorhandenen echten Assets (hero-studio, guide-stage-bg, Gruen-Gold-Plate); about.jpg/advisor.jpg (generische KI-Stockfotos) bewusst NICHT verwendet.
- QA: Desktop 1440 in echtem Chrome komplett (alle Sektionen, alle Routen, Rechner-Interaktion, keine Konsolen-Fehler); Mobile 375 per frischen Pane-Loads (Hero, Menue via DOM verifiziert, /tools, /blog); Tablet 834 ohne horizontalen Overflow. Pane-Screenshot-Stale-Artefakte erneut bestaetigt (kein Site-Bug).
- Build + tsc sauber; die 2 verbleibenden ESLint-Errors sind vorbestehende shadcn-Boilerplate (command.tsx/textarea.tsx), nicht angefasst.

## 12. Juli 2026 (spaeter Nachmittag) - Design-Audit neue Homepage-/Routenstruktur

- Guide Cover V2 kanonisch bestaetigt: `src/assets/guide-3d.png` (Quell-Render) + `src/assets/guide-book-cut.webp` (freigestellte Buehnen-Ableitung). Alte Cover-Familie (`guide-single.png`, `guide-center.png`, `guide-mockup.png`, `guide-three-books.png`) ist NICHT V2.
- Veraltetes Mockup im Homepage-Abschluss-CTA identifiziert: `guide-single.png`; wird im Umsetzungsblock gegen V2 getauscht. `/halal-guide` (nutzt `guide-three-books.png`) bleibt gemaess A2 vertagt.
- Typografie: Zwei Proben verglichen (A: Inter Tight + Inter Grotesk-Editorial; B: Fraunces + Plus Jakarta Sans Serif-Editorial). EMPFOHLEN: System A; Nunito wird vollstaendig ersetzt. Fraunces nicht als Standard.
- Routenstruktur beschlossen (Umsetzung nach Freigabe): `/tools` (4 Kacheln, 1 live), `/renditerechner` (bestehender Rechner zieht 1:1 um), `/blog` (Coming-soon + Artikelkarten-Struktur, keine erfundenen Artikel). Tools-Sektion und Rechner verlassen die Homepage.
- Homepage-Kachelblock nach IMG_3883-Prinzip: 1 grosse Kachel links (Dein Investmentstart), 2 rechts (Tools, Blog); Platzhalter-Assets lokal/austauschbar, Higgsfield nur spaeter und nur nach Freigabe (max. 3 textfreie Plates).
- Header erhaelt dunklen CTA-Button "Guide sichern" (IMG_3883-Prinzip); Hero bleibt als dunkles cineastisches Kapitel erhalten (bewusste Abweichung vom hellen IMG_3883-Hero).
- Gefundene Fehler dokumentiert: Mobile-H1 "willst.Ohne" ohne Leerzeichen; `.reveal`-IO-Ausfaelle nach Anker-Sprung; generische englische 404; Announcement-Bar mobil dreizeilig; 789-KB-JS-Chunk (Recharts auf `/`) und 1.7-2.5-MB-PNGs.
- QA-Methodik bestaetigt: Claude-Preview-Pane rendert nur frische Loads zuverlaessig; Scroll-abhaengige visuelle QA erfolgt in echtem Chrome.
- Kein Code geaendert, kein Commit/Push/Publish, kein git pull, keine Installation, keine Higgsfield-Generierung.

## 12. Juli 2026 - bestaetigt

- Der echte Codebestand ist `/Users/eliasel-gendy/Documents/dev/amanah-landing-elegant`; bestaetigt durch `package.json`, `src`, Vite-Konfiguration, Amanah-Routen, `.git` und Remote.
- Diese erste Aufgabe ist Audit/Dokumentation. Keine Redesign-, Installations-, Publish-, Push- oder Produktionsaenderung.
- Der erste Homepage-Hero bleibt in seiner Grundidee und spaeteren Talking-Video-Komposition geschuetzt.
- Guide Cover V2 bleibt geschuetzt; die bisherige flache und die spaetere zu dunkle Inszenierung sind keine Zielreferenzen.
- Tools erhalten spaeter `/tools`; der Renditerechner zieht spaeter nach `/renditerechner`, ohne Funktionsverlust.
- Das B2-PDF vom 12. Juli ist die aktuelle Skriptquelle fuer `/dein-investmentstart`.
- Beide Pinterest-Referenzen sind vorhanden und wurden auf Prinzipienebene ausgewertet.
- Claude wird nur fuer verbundene externe Dienste eingesetzt.

## Bereits zuvor bestaetigt und weiterhin gueltig

- Amanah wirkt premium, ruhig, modern, editorial und serioes.
- Farbwelt: warme helle Basen, kontrolliertes Gruen, wenige begruendete dunkle Sektionen, feines Gold.
- Keine erfundenen Testimonials, keine Produkt-/Renditeempfehlungen, kein ungeprueftes Publishing.
- Guide-PDF-Umbau gemaess A2 erst auf Elias' Ansage.

## Verworfene Richtungen

- komplett dunkle/deep-green-dominierte Website
- komplett weisse oder generische Cream-Template-Loesung
- grossflaechige Gold-Headlines als Standard
- generische KI-/Lovable-/futuristische SaaS-Aesthetik
- normales schraeges Buch plus Textspalte als finale Guide-Inszenierung
- aggressive 3D-Rotation, Scroll-Lock oder Bewegung um ihrer selbst willen
- fremde Seiten oder Pinterest-Designs direkt kopieren

## Offen

- exakte finale Typografie
- finale Hell/Dunkel-Verteilung je Homepage-Kapitel
- welcher konkrete Guide-Assetbestand das kanonische V2-Cover ist
- welche zwei statischen Richtungen in der naechsten Design-Auditphase verglichen werden
- ob Higgsfield fuer die freigegebene Richtung ueberhaupt notwendig ist
- Zeitpunkt und Detailumfang der `/tools`-/`/renditerechner`-Umsetzung

## Ambiguitaeten

- Repository `CLAUDE.md` fordert vor jeder Arbeit `git pull`; die aktuelle Uebergabe verbietet jedoch risikoreiche Zustandsaenderungen bei unklarem Dirty Tree. Im Audit wurde nicht gepullt. Vor Implementierung erst Sync-Strategie freigeben.
- `00_START_HIER.md` nennt B2-Markdown als final (11. Juli), waehrend die bereitgestellte PDF am 12. Juli erstellt wurde und ausdruecklich als aktuelle Quelle vorgegeben ist. Daher hat das PDF Vorrang.
- Historische Uebergabe sagt Pinterest eventuell ausstehend; beide Dateien sind jetzt vorhanden.


## 13. Juli 2026 (Nachtlauf) - Homepage mit echten Elias-Medien fertiggestellt (lokal)

- Art Direction: zusammenhaengende warme Editorial-Publikation nach IMG_3883-Prinzip; ~2/3 hell, dunkle Kapitel nur Hero, Guide-Fenster, Abschluss-CTA, Footer.
- Announcement-Bar ENTFERNT; Nav auf 5 Punkte (Start, Investmentstart, Tools, Blog, Ueber Amanah), mittig; dunkler Guide-CTA rechts.
- Hero-Headline ERSETZT: "Halal investieren. Ohne Kompromisse." (komplett weiss, kein Goldwort); nur 1 Creme-CTA; Trust-Zahlen aus dem Hero in neues helles Stat-Band direkt danach verschoben.
- Headline-Varianten verglichen (Code-Notiz): "Investieren. Ohne Kompromisse." / "Halal investieren. Ohne Kompromisse." / "Dein Weg zu halal Vermoegen." -> Variante 2 gewaehlt (klarste, markentypisch, keine Renditezusage).
- Hero-Medien: IMG_2522.mov als nahtloser 5,4s-Loop (Crossfade Ende->Anfang, Crop 1560x1080, Grade A -8% Helligkeit); Poster aus ruhigstem Frame t=5,0s; Mobile statisch mit IMG_2528. hero-studio.png (KI-Mockup) nicht mehr verwendet.
- Drei Nutzen-Karten + "Vertrauen ist keine Behauptung." ENTFERNT (Template-Optik); echte Zahlen leben im Stat-Band.
- GuideStage als dunkles Produktfenster mit sichtbarem Cream-Rand (sticky top-5, rounded, 150vh); Pill entfernt, weisse Headline, Gold-Hairline-Bullets, Creme-CTA.
- Kacheln: Investmentstart = Video-Frame; Tools = Higgsfield-Plate Papier-Balkendiagramm (hell); Blog = Higgsfield-Plate offenes Buch (hell). Gold-Innenrahmen und Gold-Microtext entfernt. Taschenrechner-Motive verworfen (KI-vergurkte Ziffern in 2 Versuchen).
- Meine Story: Collage ersetzt durch IMG_2554-Portrait mit Higgsfield-Hintergrund-Swap (nano_banana_pro) auf Creme-Studio - identitaetstreu geprueft; Original jederzeit rueckwechselbar.
- FAQ von Karten auf redaktionelle Trennlinien-Liste umgestellt; Abschluss-CTA entschlackt (kein Muster, kein Badge, weisse Headline).
- /tools und /blog auf helles Editorial-System angeglichen (keine Farbwoerter in H1, keine Gold-Pills); /renditerechner-Rechner unangetastet, Funktion verifiziert.
- Tablet-Fix: Hero-Video ankert links (object-[0%_25%]), damit Text nie das Gesicht ueberdeckt.
- QA: Chrome 1440 komplett, Pane 375/834, Build+tsc sauber, Konsole sauber, kein horizontaler Overflow, Routen ok.
- Kein Commit/Push/Publish/Sync. Details: 08_NACHTLAUF_UEBERGABE_13-07.md

## 13. Juli 2026 - Funnel- und Lead-Magnet-Entscheidungen

- Homepage-Primärziel bestaetigt: kostenloser Halal Investment Guide. `Investmentstart` konkurriert weder in der Hauptnavigation noch im Hero als gleichwertiger CTA.
- Header-Hierarchie bestaetigt: dezenter Textlink `Kontakt aufnehmen` links neben dem einzigen hervorgehobenen Button `Guide sichern`.
- Hero-CTA `Kostenlos starten` darf zum Guide fuehren, solange das Ziel eindeutig bleibt; `Kostenlosen Guide sichern` ist die explizite Testvariante.
- `Dein Investmentstart` bleibt als redaktioneller Direktweg weiter unten auf der Homepage und als Direktlink fuer warmen Social-/Video-Traffic.
- Funnel bestaetigt: kalter Traffic -> Guide -> E-Mail-Follow-up -> Investmentstart; warmer Traffic darf direkt zum Investmentstart.
- `/halal-guide` wird als fokussierte Lead-Magnet-Seite mit einem Hauptziel konzipiert. Vor Anmeldung kein gleichrangiger Investmentstart-CTA; nach Anmeldung optionaler direkter naechster Schritt zum Investmentstart.
- Formular-Default fuer den kommenden Entwurf: Vorname + E-Mail. Nachname, Erfahrung und Telefonnummer nicht ohne nachgewiesenen Bedarf verpflichtend.
- Mike-Killen-Funnel-Transkript ausgewertet. Nutzbare Prinzipien und ausdruecklich nicht uebernommene aggressive Taktiken stehen in `09_FUNNEL_AND_LEAD_MAGNET_PLAYBOOK.md`.
- Neue Persistenzregel: langfristig relevante Entscheidungen/Research nie nur im Chat lassen, sondern in `AI_WORKFLOW/` dokumentieren.
- Bevorzugter neuer `/halal-guide`-Flow: zuerst Level (`Einstieg`, `Aufbau`, `Vertiefung`), danach Vorname + E-Mail. Das Level segmentiert Guide und Newsletter. Nachname ist nicht mehr regulaeres Pflichtfeld.
- Personalisierungsversprechen und drei Cover sind nur erlaubt, wenn auch wirklich unterschiedliche Inhalte ausgeliefert werden.
- `/halal-guide` wird visuell vollstaendig auf das neue Homepage-Niveau gehoben: Guide V2 statt `guide-three-books.png`, reduzierte Editorial-Aesthetik statt alter Gradient-/Glow-/Pill-Sprache.
- Technischer Pflichtpunkt: Webhook-Erfolg abwarten und Fehler behandeln, bevor der Erfolgszustand gezeigt wird.

## 13. Juli 2026 - Nachmittags-Autolauf (Header/Hero-Finalisierung + /halal-guide-Umbau)

- Header umgesetzt wie beauftragt: `Investmentstart` aus der Hauptnavigation entfernt; `Kontakt aufnehmen` als dunkler Textlink (mailto) rechts neben dem einzigen Button `Guide sichern`; Mobile-Menue entsprechend.
- Hero Desktop fuellt jetzt den sichtbaren Bereich unter dem Header exakt (`min-h-[calc(100svh-72px)]` statt 82vh) - kein angeschnittener heller Folgeblock above the fold; min-h waechst auf kleinen Laptops mit (kein Textabschnitt).
- Hero Mobile: naeherer/hoeherer Crop via `scale-[1.3] -translate-y-[10%]` auf dem bestehenden IMG_2528-Asset - kein neues Bild noetig, Gesicht frueher sichtbar, Text bleibt frei.
- `/halal-guide` komplett neu als fokussierte Lead-Magnet-Seite (ein Ziel, reduzierter Header, Guide-V2-Asset `guide-book-cut.webp` statt `guide-three-books.png`, Editorial-Flaechen statt Gradient/Glow/Pills).
- Flow-Entscheidung umgesetzt: Level-first (`Einstieg`/`Aufbau`/`Vertiefung` mit ruhiger Sprache), danach nur Vorname + E-Mail. Nachname als Feld ENTFERNT, im Payload aber leer mitgesendet (`nachname: ""`) fuer Make-Kompatibilitaet. Level-Mapping `einsteiger`/`fortgeschritten`/`profi` unveraendert.
- Webhook-Handling: Antwort wird abgewartet, Loading-/Fehler-/Retry-Zustand implementiert; Erfolg erst nach `res.ok`. Getestet ausschliesslich mit gemocktem fetch (500 + 200), keine echten Daten an Make.
- Wahrheitsgrenze: Formulierung `dann schicken wir dir die passende Fassung` gemaess Auftrag; keine `perfekt angepasst`-Versprechen, kein DOI-Claim.
- Alte beratungsnahe Level-Texte (`Portfolio optimieren`, `Vermoegensmaximierung`) ersetzt.
- Investmentstart-Kachel: neues helles Studio-Portrait aus der von Elias benannten Quelle (Desktop-Screenshot 13.7., 14:40) via Higgsfield Nano Banana Pro (Hintergrund-Ersatz + 16:9-Outpaint, 2 Varianten erzeugt, Variante B uebernommen: mehr Sage-Waerme, natuerliche Tiefe; Identitaet pixelnah geprueft - Augen/Zaehne/Haende/Reissverschluss ok, keine Halo-Kanten). Kachel auf theme "light" mit dunkler Typo umgestellt.
- `Meine Story`: verbindliche Quelle (Bilder Solo 27.5.) uebernommen; wegen 580px-Quelle Higgsfield-2K-Upscale (bytedance), 4:5-Crop 1120x1400. Kein Hintergrund-Swap noetig. Bisheriges `story-elias.webp` bleibt als Rueckfalloption im Repo.
- Kein Soul-ID-Training verwendet (Nano-Banana-Ergebnis war ohne Zusatzreferenz identitaetstreu; kein Trainingslauf ohne expliziten Bedarf).
- Kein Commit/Push/Publish. Preview-Pane paintet heute below-fold nicht (bekanntes Umgebungs-Artefakt, DOM verifiziert) - echter Browser-Check durch Elias empfohlen.
