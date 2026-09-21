# finanzmuslim.com: Farbe als Akzent + Klickwege zur Geldquelle

## Context

Elias, 21.09.2026 abends: Die Seite ist zu blau-weiß und leblos, vor allem Rechner, Anlagenliste und Angebote.
Blau-weiß bleibt Fundament, Details bekommen Farbe („schlichtes Zimmer, bunte Accessoires“). CTAs sollen
schmackhaft sein und zur Geldquelle führen (Test, Vergleich), nicht zum nächsten Beitrag. Feedback liegt als
Memory `finanzmuslim-farbe-als-akzent.md`. Aufteilung auf zwei Aufträge, damit Fable nur für Design läuft.

Repo `~/Documents/dev/finanzmuslim-finish`, main auf `425e2dc`, nichts deployed. Dev-Server läuft auf 8081.

## Befund (gemessen am 21.09.)

**Warum Finanzfluss farbiger wirkt, obwohl Basis auch blau-weiß ist:**
1. Echte Farblogos überall (Revolut-Anzeige über dem Rechner, Logo-Kopfzeile im Depot-Vergleich).
2. Zweite Datenfarbe im Diagramm: Zinsen orange, Einzahlungen blau. Das Ergebnis ist nicht einfarbig.
3. Hervorhebungen je Spalte eingefärbt: „Bestes Depot“ blau getönt, „80 € ETF-Bonus“ orange getönt, „4,2 % Zinsen“ grün getönt, Bonus als grüne Pille.
4. Echtes Gesicht klein und rund beim Autor, Icons vor Abschnittsüberschriften.
Emojis übernehmen wir nicht (Repo-Regel), stattdessen farbige Icon-Kacheln.

**Bei uns:**
- Renditerechner: Gewinn `text-primary` (`src/components/ReturnCalculator.tsx:820`), Linie primary (`:792`), CTA-Box `bg-primary` (`:859-876`). Inflation `bg-primary` (`Inflationsrechner.tsx:196`). `Ergebnis`-Block `bg-primary` in `src/components/rechner/Bausteine.tsx:170`.
- Logos: `src/components/AnbieterLogo.tsx` (logo.dev per Domain) gibt es, genutzt in Vergleichen. Fehlt auf Deals (`Deals.tsx:38`), Anlagenliste (`AnlageLogo` in `AnlageZeile.tsx:7-50`, `halalAnlagen.ts:52` Logo leer) und Rechner-CTAs.
- Nummer 1: `NummerEins` in `src/components/vergleich/VergleichsRahmen.tsx:65-122`, Karte nur `border-primary/40` (`VergleichsKarten.tsx:39-44`).
- Assistent: „Dein Paket steht“ `VergleichAssistent.tsx:434-444`, h1 `text-[30px] md:text-[38px]`.
- AnlageDetail: „Broker anzeigen“ dreimal (`MonetarisierungsPlatz` an `anlage_kopf` :174, `partner_streifen` :185, `chart_aktion` :207), Kursverlauf erst bei ~790 px.
- Wissen: `Wissen.tsx:91,98,125,137,158` haben `max-w-3xl` ohne `mx-auto`, daher links.
- Autorenbild: `BeitragSeite.tsx:330-351`, Hochformat 1120×1400 auf 64 px mit `scale(1.9)`: Gesicht zu klein. Foto selbst ist gut.
- Beitrags-CTAs: 6 von 46 Box-Plätzen zeigen auf andere Beiträge (DispoUndSchulden, KreditkarteHalal, TradingForexCfd, AutoKaufenOhneZinsen, ZakatAufAktienEtfKrypto). `werbung.ts` zeigt immer auf `/vergleich/depot`.

## Aufteilung

**Auftrag A, Design (Fable):** alles, was Aussehen und Bausteine ändert.
**Auftrag B, Umsetzung (Opus, Teile Sonnet):** Klickziele, kleine Layout-Fixes, Daten und Release-Faden.
Reihenfolge: A zuerst, B danach (B fasst Komponenten aus A nicht an, nur Daten und Ziele). Beide `git pull` vor Start.

## Auftrag A: Design (Fable)

1. **Akzent-System** in `src/index.css` + `tailwind.config.ts`: Token für Gewinn (bestehendes `success`), Datenfarbe 2 für Diagramme, Aktions-/Bonus-Akzent (warm, Orange/Gold, nicht Grün wegen „Partner nie grün“), getönte Hervorhebungsflächen. Repo-`CLAUDE.md` Abschnitt „Farben“ auf die neue Regel umschreiben (Fundament blau-weiß, Akzente erlaubt, Grün/Gelb/Rot weiter mit Statusbedeutung, Gewinne grün).
2. **Rechner:** Gewinne und Portfoliolinie grün, Eingezahlt neutral, Inflationsverlust warm/rot. `Ergebnis`-Baustein farbiger. Gemeinsamer CTA-Baustein `FindeDeinAngebot` (Logo-Reihe der Partner aus `brokerVergleich` + Knopf „Finde, was zu dir passt“ → `/vergleich/start`) statt der kopierten blauen Boxen. Renditerechner als Muster, dann Inflation, Sparziel, Zakat, Budget, Kredit, Auswanderung, `AnlageRenditerechner`.
3. **Nummer 1** auffälliger rahmen (Akzentrahmen oder Verlauf, Band „Unsere Nummer 1“), Karte in der Liste ebenso. Logos in Deals-Karten.
4. **Halal-Anlagen-Liste** lebendiger: Emittenten-Logos über `AnlageLogo` (Domain je Emittent), Farbakzent je Anlageart (die `--asset-*`-Token existieren), grüne/rote Renditen bleiben.
5. **AnlageDetail:** ein „Verfügbar bei“ mit Broker-Logos im Kopf, die zwei anderen `MonetarisierungsPlatz`-Knöpfe raus, Kursverlauf direkt unter den Kopf.
6. **Assistent-Ergebnis:** „Dein Paket steht“ kleiner (Padding, h1 ~24/30 px), Konfetti unverändert, Fokus auf Depot-Empfehlung.
7. **Beitrags-CTA-Boxen** (`EmpfehlungsBox`) farbig und schmackhaft, mit Logos, wenn Ziel ein Vergleich ist.

Prüfen: 1440, 390, 360 px je geänderter Seite (Schwellen aus Repo-CLAUDE.md), `npx tsc --noEmit -p tsconfig.app.json`, `npx vitest run`, `npm run build:auslieferung`. Screenshots vorher/nachher für Elias.

## Auftrag B: Umsetzung (Opus; B3 kann Sonnet)

1. **Klein:** Wissen zentrieren (`mx-auto` an den `max-w-3xl`-Blöcken oder Raster über volle Breite). Autorenbild: quadratischen Kopf-Ausschnitt aus `story-elias-warm.webp` erzeugen (z. B. 400×400 ab Stirn bis Kinn + Schultern), `scale` raus.
2. **Klickwege zur Geldquelle** (Brainstorm, als Karte in `docs/klickwege.md` festhalten, dann umsetzen):
   - Hauptziel ist `/vergleich/start` (Assistent, Partner stehen vorn, höchste Chance auf Abschluss).
   - Zweitziele abwechselnd: Einzelvergleich passend zum Thema (Girokonto bei Konto-/Dispo-Themen, Krypto bei Krypto, Edelmetalle bei Gold), `/deals`, `/halal-anlagen`.
   - Rechner verketten sich thematisch und enden im Test: Kredit → Rendite → Test, Budget → Sparziel → Rendite.
   - Beiträge: höchstens eine Box auf einen anderen Beitrag, die 6 Beitrag-zu-Beitrag-Plätze auf Test/Vergleich umstellen, `werbung.ts` je Beitrag passend statt immer Depot. Prev/Next-Links bleiben (SEO).
   - Nicht greedy: pro Seite ein Haupt-CTA, Mix aus Test, Vergleich, Rechner.
3. **Lücken „noch nicht geprüft“ schließen** (Handoff-Punkt 1): Gmail `eliaselgendy2006` in Chrome, `subject:"Frage vor Kontoeröffnung"`, Antworten mit Wortlaut + Datum in `src/data/vergleichKorrekturenDaten.ts`. Dann Tests + Build.
4. finvesto-Satz, Release-Checkliste nachziehen, Go-Frage an Elias.

Prüfen: wie A, dazu Link-Check der geänderten Ziele (keine toten Links, `/out/` nur über `partnerLinks.ts`).

## Was Elias entscheidet

- finvesto: warten oder entschärfen. 17 Anbieter ohne Mail-Weg: per App fragen oder offen lassen. Mit Lücken live oder warten.

## Nachträge aus Elias' Rückmeldungen am 21.09. abends

- **Fassung 2 gilt:** ruhige Flächen, Farbe in Daten und Logos, CTA-Knopf blau. Steht in `CLAUDE.md`.
- **A8 Auswanderungsrechner entwirren** (Design): „sieht cool aus, aber sehr unübersichtlich“. Nebeninfos aufklappbar,
  drei Länder auf einen Blick mit Flaggen, Leute nicht überfordern.
- **B5 Anlagen neu prüfen** (Recherche, Opus): alle Anlagen der Datenbank einzeln gegen das aktuelle Zertifikat prüfen
  („nicht dass wir hier falsche Sachen anzeigen“). Platin, Palladium und der Edelmetallkorb stehen in
  `halalAnlagen.ts` schon mit Al-Qalam-Prüfbericht vom 22.06.2026 (Link am 21.09. erreichbar, PDF 306 KB), fehlen aber
  in den anderen Listen: Vorlage „21 halal Anlagen“, PDF-Liste, Vergleichsmerkmal `halalEdelmetalle` (zählt nur 8 Gold-
  und Silber-ETCs).
- **B6 Erklärtexte unter den Rechnern** durchgehen: manche sind generisch („Warum wir von Rendite sprechen, nicht von
  Zins“). Je Rechner prüfen, kürzen oder streichen. Elias nennt die schwachen Stellen oder gibt frei.

## Stand 21.09. abends: Auftrag A (Design, Fable) ist fertig

Erledigt und gepusht bis `777ead7`, nichts veröffentlicht: Farb-Tokens und Regel in `CLAUDE.md`, `FindeDeinAngebot`,
alle acht Rechner (helle Ergebniskarte, Farbe in den Daten, ein Aufruf je Seite, aufklappbare Anlagen-Zeile),
Auswanderungsrechner mit Klappen, Liste „21 halal Anlagen“ mit Logos und Rendite, „Verfügbar bei“ auf der
Anlage-Detailseite, Nummer-1-Rahmen, Logos in Deals und Beitrags-Boxen, Wissen zentriert, neues Autorenbild
(`src/assets/elias-autor.webp`), „Dein Paket steht“ kleiner. Gemeinsame Logo-Auswahl: `src/lib/anbieterLogos.ts`.

Offen für Opus (kein Design mehr nötig): B2 Klickwege in den Beiträgen, B3 Gmail-Antworten, B4 finvesto/Checkliste/Go,
B5 Anlagen neu prüfen und Platin/Palladium in alle Listen, B6 Erklärtexte. Nicht im Browser angesehen, nur gebaut und
gemessen: Assistent-Ergebnis („Dein Paket“), Halal-Guide-Autorenbild. Franklin Shariah Technology Fund steht in der Liste
ohne ISIN, in der Datenbank mit: bei B5 angleichen.
