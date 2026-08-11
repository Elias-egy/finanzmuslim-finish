# Next Task

Stand: 13. Juli 2026, ~23:15 (Visual-Refinement Pass 2 abgeschlossen, Zeitlimit auf Nutzerwunsch mehrfach verlaengert und zuletzt aufgehoben). Status: Prioritaeten B, C, F umgesetzt; D (Homepage + `/tools`) und G (teilweise) umgesetzt; A und E bewusst nicht angefasst (siehe Begruendung unten) — alles wartet auf Elias-Review. HOMEPAGE-HEADER/HERO weiterhin wie im Nachmittags-Autolauf finalisiert.

## Zielkonflikt fuer Elias-Entscheidung (Prioritaet E, Story-Bild)

- Der Master-Prompt fordert, die Originaldatei `~/Desktop/Bilder Solo/Bildschirmfoto 2026-05-27 um 08.54.32.png` "direkt und unverfaelscht" ohne Higgsfield zu verwenden.
- Diese Datei ist nachweislich nur 580×614px (per `sips` geprueft). Direkt in den 1120×1400-Slot skaliert, waere sie sichtbar pixelig — das widerspricht dem harten Abnahmekriterium "nicht ausgewaschen/schlecht".
- Aktuell im Einsatz: `story-elias-warm.webp`, ein bereits identitaetsgeprueftes Higgsfield-2K-Upscale derselben Quelle (aus dem Nachmittags-Autolauf, siehe `06_DECISION_LOG.md` 13.7.). Bewusst NICHT zurueckgebaut in diesem Lauf — ein Rueckbau auf die 580px-Datei waere eine Qualitaetsverschlechterung, keine Verbesserung.
- Entscheidung noetig: entweder die Upscale-Fassung als Ausnahme vom "unverfaelscht"-Grundsatz endgueltig freigeben, oder eine hoeher aufgeloeste Originalquelle liefern.

## Offen aus Visual-Refinement Pass 2

1. Homepage-Portal-Kacheln im ECHTEN Browser gegenzupruefen (nicht nur Preview-Pane) — Scrim-/Kanten-/Hover-/Farbrhythmus-Fix ist derselbe Code wie bei `/tools`, dort visuell + geometrisch bestaetigt, aber wegen Pane-Below-Fold-Eigenheit auf `/` nicht fotografisch belegt.
2. Prioritaet A (Mobile Hero Higgsfield-Vergleich Still vs. Loop): bewusst NICHT umgesetzt. Der bestehende mobile Hero erfuellt die harten Abnahmekriterien bereits (Gesicht frueh sichtbar, professionell, Text ueberdeckt es nicht). Eine Neugenerierung eines identitaetskritischen Bilds ohne konkreten Mangel und ohne Elias' Side-by-Side-Vergleich wurde als unverhaeltnismaessiges Risiko eingestuft — falls Elias trotzdem einen Higgsfield-Vergleich wuenscht, bitte explizit anfordern.
3. Prioritaet E (Story-Original): siehe Zielkonflikt oben — Elias-Entscheidung noetig.
4. Prioritaet G Rest: nur Above-the-fold + Produktfenster von `/halal-guide` verdichtet/bereinigt; Trust-Band, Inhalte-Liste, "Fuer wen"/"Was nicht", Elias-Vertrauensabschnitt, FAQ unveraendert (wirkten nicht ueberladen, daher nicht angefasst).
5. `Kostenlos starten`-Hover/Focus: UMGESETZT (tiefes Gruen + Cream-Text + Gold-Kante), per erzwungenem Inline-Style-Test visuell bestaetigt.
6. Farbrhythmus (Prioritaet D): auf Homepage-Kachelsektion + `/tools` umgesetzt (`bg-background` → `bg-surface`). NICHT geprueft: `/halal-guide` restlicher Rhythmus, `/blog`, `/dein-investmentstart` — falls dort noch "zu weiss" wirkt, im naechsten Lauf pruefen.

## Naechster Freigabeblock (fuer Elias)

1. Im echten Browser (Desktop + Handy) pruefen: `npm run dev` → localhost:8080
   - Homepage: Header-Hierarchie, Hero-Hoehe (Laptop!), Mobile-Crop, neue helle Investmentstart-Kachel, neues Story-Portrait.
   - `/halal-guide`: kompletter Durchlauf inkl. einer ECHTEN Test-Anmeldung mit eigener E-Mail (Make-Webhook wurde bewusst nur gemockt getestet) — pruefen, ob die Level-Segmentierung in Make/MailerLite korrekt ankommt (`nachname` kommt jetzt leer an).
   - Below-fold-Sektionen beider Seiten sichten (Preview-Pane hat heute unterhalb des Folds nicht gepaintet — Umgebungs-Artefakt, kein Site-Bug).
2. Entscheidungen bestaetigen oder kippen:
   - Investmentstart-Kachel Variante B (Alternative Variante A liegt im Scratchpad-Verlauf/Higgsfield-History: heller, cleaner, weniger gruen)
   - Story-Portrait (Upscale-Fassung) vs. bisheriges Creme-Studio-Derivat (`story-elias.webp`, liegt noch im Repo)
   - Guide-Headline `Wissen, was wirklich halal ist – bevor du investierst.`
3. Danach: Commit-/Lovable-Sync-Strategie (weiterhin nichts committed).

## Danach offen

- /dein-investmentstart: Deeplink final, Video, PDF, Riba-Checkliste Phase B (A1-Spec)
- Double-Opt-in + Datenschutz-/DSGVO-Pruefung des Guide-Funnels vor Livegang
- Ungenutzte Alt-Assets (`guide-three-books.png`, ggf. `story-elias.webp`) vor Commit aufraeumen
- /dev-guide-stage vor Livegang entfernen; og:image/Meta-Pflege vor Publish
- Scalable-Pre-Approval vor jeder Veroeffentlichung

## Stop Condition

Kein Commit/Push/Publish ohne separate Freigabe.
