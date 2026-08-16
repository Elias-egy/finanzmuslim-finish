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

## Farben, nicht verhandelbar

| Zweck | Wert |
|---|---|
| Klickbares, Knöpfe, Links, Diagrammlinien | `#0057FA` |
| Etiketten und Kicker | `#7D6EF2` |
| Helle Fläche, Ergebniskästen | `#EBF2FF` |
| Grün, Gelb, Rot | **nur für Bewertungen**, nie als Dekoration |
| Schrift | Figtree |

Ein fallender Kurs wird nicht rot. Ein Partner wird nicht grün hervorgehoben.

## Inhalt

- **Niemals Zahlen erfinden.** Ungeprüftes heißt wörtlich „noch nicht geprüft".
- **Keine Anlageberatung, keine Fatwa.** Wo Gelehrte uneins sind, werden beide
  Seiten genannt und auf einen Gelehrten verwiesen.
- **Nichts verlinken, was es nicht gibt.**
- **`/dein-investmentstart` wird nicht mehr verlinkt.** Jeder Aufruf zum Handeln
  führt auf einen Vergleich, in der Regel `/vergleich/depot`.
- **Partnerlinks ausschließlich** über `src/data/partnerLinks.ts` und die Route
  `/out/name`. Nie ein Direktlink im Text.
- Werbekennzeichnung vor jedem Partnerknopf, Sternchen mit Fußnote.

## Technik

- Vite / React / Tailwind / shadcn.
- Lovable ↔ GitHub-Sync über `main`, Repo `Elias-egy/finanzmuslim-boost`.
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
