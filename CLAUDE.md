# finanzmuslim — Regeln für jede Session

Stand 16. August 2026. Diese Datei gilt für jeden, der hier arbeitet, auch für
den Lovable-Agenten. Was hier steht, muss nicht in jedem Prompt wiederholt werden.

**Maßstab für alles:** Ein 40-jähriger Deutsch-Türke ohne Finanzvorwissen liest
das auf dem Handy. Er muss sofort verstehen, wo was ist. Weniger ist mehr.

## Sprache, die wichtigste Regel

Vorbild ist Finanzfluss. Deren Beschreibungen halten sich an ein festes Muster:

1. **Höchstens zwei Sätze** je Beschreibung. Nie drei.
2. **Der erste Satz beginnt mit einem Verb, das der Leser tut:** Lerne, Finde,
   Rechne, Vergleiche, Prüfe, Sieh.
3. **Aufzählungen haben genau drei Glieder.**
4. **Doppelpunkt statt Nebensatz:** „Jeden Freitag das Wichtigste für dein Geld:
   geprüfte Anlagen, Fristen und Antworten."
5. **Keine Aussage über den eigenen Text.** Gestrichen sind ausnahmslos:
   „verständlich erklärt", „ohne Fachchinesisch", „einfach erklärt", „ohne
   Fachjargon", „wir zeigen dir", „in diesem Artikel". Der Text ist verständlich,
   indem er es ist, nicht indem er es behauptet. Werbesprache kostet nachweislich
   Nutzbarkeit.
6. **Überschriften: drei bis fünf Wörter.**
7. **Fachwörter werden vermieden, nicht erklärt.** Nur wo ein Wort selbst der
   Suchbegriff ist, bleibt es: ETF, Zakat, Depot, Sukuk.
8. Kein Ausrufezeichen, keine Emojis, keine Großschreibung ganzer Wörter, keine
   Gedankenstriche.

Das gilt für Überschriften, Kacheltexte, Kurzbeschreibungen, Einleitungen und
Seo-Texte. In den Fließtexten der Wissensbeiträge sind längere Sätze richtig.

## Handy zuerst, mit Schwellen

Die meisten Besucher kommen übers Handy (Elias, 19.09.2026). Jede neue oder geänderte Seite wird bei
390 und 360 px Breite gemessen, nicht geschätzt. Der Laptop bleibt dabei, wie er ist.

| Seite | Schwelle bei 390 px |
|---|---|
| Vergleich | erste Anbieterkarte unter 650 px |
| Rechner | erstes Eingabefeld unter 500 px, Felder mindestens 300 px breit |
| Übersicht | der erste eigentliche Inhalt auf dem ersten Bildschirm, keine gestapelte Kachelwand |
| überall | kein seitlicher Überlauf, `scrollWidth` gleich Fensterbreite |

- Eingabefelder haben immer 16 px Schrift. Darunter zoomt das iPhone beim Antippen in die Seite.
- Tabellen in Beiträgen nie mit `min-w`. Der Baustein `Tabelle` macht unter 640 px aus jeder Zeile einen Block.
- Kein Knopf, den man nicht drücken kann.
- Was auf dem Handy vom Nutzen abhält, rutscht per Flex-`order` unter den Inhalt oder steht erst ab `md`.
  Text nie doppelt rendern.
- Ein Satz, der nichts sagt, fliegt auf dem Handy zuerst.

## Farben: blau-weißes Fundament, farbige Details

Elias, 21.09.2026: „Das ist wie ein Zimmer, was schlicht eingerichtet ist: umso mehr stechen ein paar
farbenvolle Accessoires heraus.“ Flächen, Navigation und Text bleiben blau, weiß und schwarz. Farbe sitzt
in den Details: Zahlen, Diagramme, Logos, der Haupt-Aufruf.

| Zweck | Wert |
|---|---|
| Klickbares, Knöpfe, Links | `#0057FA` (`primary`) |
| Etiketten und Kicker | `#705FF1` (`violet`) |
| Helle Fläche, Ergebniskästen | `#EBF2FF` (`accent`) |
| Gewinne, Wachstum, steigende Kurse | `gain` (grün), Fläche `gain-soft` |
| Verlust, Kaufkraftverlust, Zinskosten, fallende Kurse | `loss`, Fläche `loss-soft` |
| Haupt-Aufruf zur Geldquelle | Block `FindeDeinAngebot`: leiser Verlauf, Logos, Knopf `.btn-spark` im Signalblau. Gold (`spark`) nur als kleines Detail, nie als Fläche oder Knopf |
| Grün, Gelb, Rot als Bewertung | Ampel bleibt sachlich. Ein Partner wird nie grün hervorgehoben, dafür gibt es `spark` |

**Kontrast (23.09.2026):** Alle Akzentfarben erreichen 4,5:1, auch auf ihrer eigenen 10-Prozent-Tönung,
weil die Ampel-Pillen genau so gebaut sind. Deshalb `violet` 66 % statt 69 %, `gain` und `success` 29 %
statt 34 %, `destructive` 45 % statt 52 %, und die Navigationsschrift `text-white/90` statt `/85`.
Gemessen mit Lighthouse auf sechs Seiten: Barrierefreiheit 100, Kontrastprüfung ohne Beanstandung.
Wer diese Werte wieder aufhellt, muss neu messen.
| Schrift | Figtree |

- Anbieter immer mit Logo (`AnbieterLogo`). Logos bringen die Farbe, die Fläche bleibt hell.
- Bester Aufruf ist „Finde, was zu dir passt“ (`FindeDeinAngebot` → `/vergleich/start`), nicht ein einzelner
  Anbieter im Rechner. Höchstens ein solcher Block je Seite.
- Flächen bleiben ruhig (Elias, 21.09.2026 abends: dunkle Ergebniskarte mit Lichtfleck und goldener Knopf waren
  „too much“ und sahen nach KI aus). Farbe gehört in die Daten: Tortenstücke, Linien, die große Zahl, Logos.
  Ergebniskarte ist `.ergebnis-karte` im Marken-Hellblau, die Zahl grün bei Gewinn, `loss` bei Verlust, sonst blau.
- Kurze Erfolgsmomente wie Konfetti dürfen ganz bunt sein.

## Inhalt

- **Niemals Zahlen erfinden.** Ungeprüftes heißt wörtlich „noch nicht geprüft".
- **Keine Anlageberatung, keine Fatwa.** Wo Gelehrte uneins sind, werden beide
  Seiten genannt und auf einen Gelehrten verwiesen.
- **Nichts verlinken, was es nicht gibt.**
- **Startseiten je Partner** (Elias, 15.09.2026): `/dein-investmentstart` (Scalable)
  und `/dein-investmentstart/<kurzname>`, Inhalte in `src/data/investmentStart.ts`.
  Vergleiche und „Wo du sie kaufen kannst“ führen über `/out/<kurzname>` dorthin,
  erst dort steht der Affiliate-Link. Allgemeine Aufrufe führen weiter auf einen Vergleich.
- **Partnerlinks ausschließlich** über `src/data/partnerLinks.ts` und die Route
  `/out/name`. Nie ein Direktlink im Text.
- Werbekennzeichnung vor jedem Partnerknopf, Sternchen mit Fußnote.

## Technik

- Vite / React / Tailwind / shadcn.
- Lovable ↔ GitHub-Sync über `main`, Lovable-Projekt „finanzmuslim finish“ (Studienaccount),
  Repo `Elias-egy/finanzmuslim-finish`. Das alte `finanzmuslim-boost` ist stillgelegt (15.09.2026).
- **Vor jeder Arbeit `git pull`.** Nie gleichzeitig in Lovable und über Git am
  selben Projekt arbeiten, das erzeugt Konflikte.
- Repo nie umbenennen oder verschieben, das bricht den Lovable-Sync dauerhaft.
- Vorschau: `npm run dev`, Port 8080.
- Kursdaten liegen in `src/data/kurse.json`, Metallpreise in `src/data/nisab.json`.
  Beide werden außerhalb erzeugt von `~/rebrand/data/kurse_holen.py`. Nicht von
  Hand ändern, sonst ist der nächste Lauf wieder drüber.
- Grafiken mit **recharts**, das liegt schon im Projekt. Keine zweite
  Grafikbibliothek.
- **Nicht in Lovable veröffentlichen**, solange die Freigabe des Partners fehlt.

## Arbeitsweise

- Ein Schritt, dann Elias' Rückmeldung abwarten.
- Kurz antworten, was passiert ist und was als Nächstes kommt.
- Nichts ungefragt ändern. Auffälligkeiten sind ein Satz Hinweis, keine Tat.
- Fertige Texte aus `~/rebrand/` wortwörtlich übernehmen, nicht „verbessern".
