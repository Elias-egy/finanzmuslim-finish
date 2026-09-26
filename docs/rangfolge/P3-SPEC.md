# P3 Rechenkern Rangfolge: Spezifikation (Entwurf 26.09.2026)

Grundlage: Plan `~/.claude/plans/los-gehts-agile-pearl.md`, Abschnitt P3, und Elias' Entscheidungen vom 25.09.2026
(wortgleich `~/Desktop/0_ABLAGE/AgenticOS/AgenticOS/raw/2026-09-25-rangfolge-auftrag/`). Branch `rangfolge`.
Diese Datei ist die Vorlage für die Umsetzung per TDD. Codex prüft sie vorher lesend.

## 1. Ziel

Eine Funktion, die für jeden der sechs Vergleiche (Depot, Girokonto, Krypto, Steuersoftware, Screener, Edelmetalle)
eine nachvollziehbare Rangliste liefert. Vergleichsseite und geführter Vergleich benutzen dieselbe Note und haben
dieselbe Nummer 1. Nur Belegtes zählt. Partner kaufen keine Plätze.

## 2. Schnittstelle

Neue Datei `src/lib/rangfolge.ts`:

```ts
type Kategorie = "depot" | "girokonto" | "krypto" | "steuer" | "screener" | "edelmetall";

type Bewertet = { anbieter: RohAnbieter; platz: number; note: number; halal: number; kosten: number };
type NichtBewertet = { anbieter: RohAnbieter; grund: "noch nicht geprüft" | "Anfrage läuft"; fehlt: string[] };
type Abgeraten = { anbieter: RohAnbieter; grund: string };

rangfolge(liste: RohAnbieter[], kategorie: Kategorie, opt?: { offeneAnfragen?: ReadonlySet<string> }):
  { gerankt: Bewertet[]; nichtBewertet: NichtBewertet[]; abgeraten: Abgeraten[] }
```

- Reine Funktion, keine Seiteneffekte, liest nie `link`, `partnerLinks`, `aktiv`, Deals oder Boni.
- Jede Eingabe landet in genau einer der drei Gruppen.
- `note`, `halal`, `kosten` liegen zwischen 0 und 5, auf zwei Nachkommastellen gerundet (Anzeige mit Komma).
- Sterne auf der Seite = `note` auf halbe Sterne gerundet. Die Seite rechnet nichts selbst.

## 3. Reihenfolge in `gerankt`

1. `note` absteigend
2. `kosten` absteigend
3. `halal` absteigend
4. `name`, dann `produkt`, jeweils `localeCompare(…, "de")`

`platz` = Position + 1. Die Reihenfolge hängt nicht von der Eingabereihenfolge ab (Test mit gemischter Liste).
Finanzfluss-Rang und das lexikografische „islamische Paket“ aus `vergleichAssistent.ts:194-216` fallen weg.

## 4. Gruppen

- **abgeraten:** `abgeraten: true` in den Daten, oder das Zins-Tor steht auf `schlecht`, oder eine Tor-Regel der
  Kategorie greift (unten). `grund` ist ein kurzer Satz für die Seite.
- **nichtBewertet:** Tor offen (`null`) oder ein Pflichtfeld der Formel fehlt. `fehlt` nennt die Schlüssel.
  `grund` ist „Anfrage läuft“, wenn das Haus in `opt.offeneAnfragen` steht, sonst „noch nicht geprüft“.
  Bekommt nie Platz, Sterne oder Note.
- **gerankt:** alles andere.

`offeneAnfragen` kommt aus einer erzeugten Datei `src/data/anfragenOffen.ts` (nur Hausschlüssel, keine Adressen oder
Ticketnummern), gebaut von einem kleinen Skript aus `anfragenLog.ts`: Haus mit ausgehendem Vorgang ohne spätere
inhaltliche Antwort. `anfragenLog.ts` selbst wird nicht ausgeliefert.

## 5. Formeln

Allgemein: `teils` bei einer Halal-Ampel zählt 0,5, `gut` 1, `schlecht` 0, `null` ist fehlend. Zins-Tor `teils`
(abschaltbar, läuft ab Start) halbiert den Halal-Teil wie heute (`FAKTOR_ABSCHALTBAR`). Opt-in-Zinsen stehen in den
Daten schon als `gut` (Elias-Entscheidung 3).

### Depot
- Tor: `zinsfreiAbStart`.
- Halal = gewichtete belegte Treffer / 22 (12 ETFs, 3 Sukuk, 7 Edelmetalle). Fonds zählen nach Ausgabeaufschlag
  1 / 0,75 / 0,5; **unklarer Aufschlag zählt wie voller (0,5)**, blockiert also nicht mehr (Änderung gegenüber
  `bewertung.ts`, dort blockiert `null`). Umsetzung: `anlagen_verdichten.py` schreibt `halalAnlagenPunkte` immer,
  unklar = 0,5.
- Pflicht: alle drei Zeilen exakt „x von N“ mit N = 12/3/7, also jede der 22 ISINs `ja` oder belegtes `nein`.
  `nicht_gefunden` bleibt offen (Belegmodell v2, `anlagen_regeln.py:15,176`), die Zeile heißt dann „mind. x von N“.
  Sonst nichtBewertet mit `fehlt` = offene Zeilen.
- Kosten = Finanz-Note wie heute (Finanzfluss-Punkte der behaltenen Kriterien / `DEPOT_FINANZ_MAX`, × 5).
- Note = 0,5 × Halal + 0,5 × Kosten.

### Girokonto
- Tor: `zinsfreiAbStart`. Halal = 0,5 × `keinDispoAbStart` + 0,5 × `karteOhneKredit`. Kosten wie heute. Note 50/50.

### Krypto
- Tor: `zinsfreiAbStart`. Halal = 0,4 × `echteCoins` + 0,3 × `eigeneWallet` + 0,3 × `zinsfreiesModell`. Kosten wie
  heute. Note 50/50. `zinsfreiesModell = schlecht` bleibt ein Abzug, kein Abraten (Memory tarifstufen-einzeln-bewerten).

### Steuersoftware (kein Zins-Tor, keine Finanzfluss-Punkte)
- Tor: `kapital`. `null` → nichtBewertet. `"nein"` → abgeraten mit Grund „kann keine Anlage KAP“ (für Anleger nutzlos,
  Zeilen-Hinweis in `steuersoftwareVergleich.ts`).
- Leistung (0 bis 5) = 5 × (0,35 × belegabruf + 0,25 × vermietung + 0,25 × selbststaendige + 0,15 × läuftÜberall).
  `läuftÜberall` = `plattform` enthält nicht „nur Windows“. Felder: „ja“ 1, „teils“/„eingeschränkt“ 0,5, „nein“ 0.
- Preis (0 bis 5): p = erster Eurobetrag in `preis` (Preis für eine Erklärung). 0 € → 5, sonst 5 × (1 − p / 60),
  begrenzt auf 0 bis 5. `PREIS_MAX_STEUER = 60` als Konstante.
- Note = 0,5 × Leistung + 0,5 × Preis. `halal` = Leistung, `kosten` = Preis (für Anzeige und Gleichstand).

### Screener
- Kein Tor. Transparenz = 5 × Mittel aus `gremium`, `begruendung`, `reinigung` (Ampeln).
- Nutzen = 5 × (0,3 × etfs + 0,3 × depot + 0,2 × zakat + 0,2 × kostenlosNutzbar). `kostenlosNutzbar` = Feld
  `kostenlos` belegt und nicht „nein“.
- Note = 0,5 × Transparenz + 0,5 × Nutzen. `halal` = Transparenz, `kosten` = Nutzen.

### Edelmetalle
- Tor: `echtesMetall = schlecht` oder `uebergabe = schlecht` → abgeraten („kein echtes Metall“ bzw. „kein
  Besitzübergang“).
- Halal = 5 × (0,35 × uebergabe + 0,30 × echtesMetall + 0,25 × nachweis + 0,10 × ausliefern).
- Keine Kostenzahl in den Daten: Note = Halal, `kosten` = 0 für alle (Gleichstand fällt auf Name).
- Gewichte am 26.09.2026 per Skill `hourani-fatwa` geprüft (`~/hourani/positionen/gold-silber.md`, Episode 15):
  - Übergabe am höchsten: „Generell dieses von Hand zu Hand ist ja die Grundregel. … Die Eigentumsübertragung muss
    stattfinden.“ (01:08:36 ff.). Virtueller Besitz reicht, wenn die Verfügung wirklich übergeht: „auch wenn du den
    Barren jetzt nicht in deiner Hand hast, du musst die Verfügung darüber haben“.
  - Echtes Metall: Goldpapiere sind „meistens“ nicht physisch gedeckt und deshalb problematisch, gedeckte Papiere
    nur mit Zertifikat (01:39:21 ff., 01:40:06).
  - Nachweis: Der Barren muss individualisierbar sein und dem Käufer zugeordnet werden (Nummer, Zertifikat), sonst
    kein virtueller Besitz (01:09:35 ff.).
  - Auslieferung am niedrigsten: Hourani verlangt sie nicht, die Verfügung genügt. Für Silber gilt dasselbe
    (01:40:30), für Platin und Palladium gelten die Riba-Regeln nicht (01:41:42).
  - Die Gold-Sparplan-Kritik (Abschlussgebühren) ist Houranis persönliche Position, kein Haram-Urteil (01:20:07 ff.),
    sie fließt nicht in die Halal-Gewichte ein.

## 6. Geführter Vergleich

`werteAus` (`src/lib/vergleichAssistent.ts`) nutzt `rangfolge` als Basis: dieselbe Note, dieselbe Nummer 1 ohne
Antworten. Persönliche Priorität gewichtet nur den Kosten-Teil neu, nie Halal oder Tor. Wünsche filtern weiter;
unbekannt erfüllt nie einen Wunsch. `RANGFOLGE_FREI` fällt weg. Die Gruppe „noch nicht geprüft“ wird ausgegeben
(Anzeige in P4, eingeklappt).

## 7. Tests (vitest, zuerst schreiben)

1. Jede Eingabe in genau einer Gruppe; nichtBewertet und abgeraten haben nie `platz` oder `note`.
2. `link`, `partnerLinks.aktiv` oder ein Deal ändern die Reihenfolge nicht (Liste zweimal rechnen).
3. Gemischte Eingabereihenfolge liefert dieselbe Rangliste.
4. Vergleichsseite und `werteAus` ohne Antworten haben dieselbe Nummer 1 je Kategorie.
5. Je Formel ein Test mit Handrechnung (Depot mit Fonds ohne/reduziert/voll/unklar, Giro, Krypto, Steuer mit 0 € und
   mit 34,95 €, Screener, Edelmetall mit `teils`).
6. Depot mit einer Zeile „mindestens 3“ ist nichtBewertet mit `fehlt`.
7. Steuer mit `kapital = "nein"` ist abgeraten, mit `null` nichtBewertet.
8. Zins-Tor `teils` halbiert den Halal-Teil, `schlecht` ist abgeraten.
9. `offeneAnfragen` setzt den Grund „Anfrage läuft“.
10. Bestehende Tests: `vergleichAssistent.test.ts:70` umschreiben, alphabetischer Datentest bleibt.

## 8. Nicht Teil von P3

Anzeige, Methodik-Seite, Logo-Reihe, `AngebotsKnopf` (alles P4). Datenrecherche (P1b, P2). Freigabe (P5).

## 9. Offene Fragen an die Prüfung

- Ist „unklarer Aufschlag = voller Aufschlag“ in `anlagen_verdichten.py` oder erst in `rangfolge.ts` besser aufgehoben?
- Steuersoftware: Ist „kapital = nein → abgeraten“ zu hart, oder besser nichtBewertet mit eigenem Grund?
- Preisformel Steuer: linear bis 60 € oder Stufen (0 €, bis 20 €, bis 40 €, darüber)?
- Reicht ein Gleichstand-Brecher über Name, oder müssen gleiche Noten denselben Platz teilen?

## 10. Entscheidungen nach der Gegenprüfung (26.09.2026, Vorrang vor den Abschnitten oben)

Bericht wortgleich in `P3-REVIEW-2026-09-26.md`. Die fehlenden Tests dort gehören vollständig zu Abschnitt 7.

1. **`nicht_gefunden` bleibt offen** (Belegmodell v2). Ein Depot bekommt erst Sterne, wenn jede der 22 ISINs `ja` oder
   belegtes `nein` ist. Das deckt sich mit Elias' Entscheidung 1 („erst alle Daten fertig“).
2. **Unklarer Ausgabeaufschlag = 0,5** in `anlagen_regeln.py:185-191` (`AUFSCHLAG_FAKTOR` bekommt „unklar“, fehlende
   Angabe ebenso), dazu die Zahl der unklaren Fonds je Zeile. Python-Test zuerst rot. `rangfolge.ts` wertet einen
   fehlenden Schlüssel oder `null` in `halalAnlagenPunkte` als fehlt, nie als Rohzahl.
3. **Nenner** ist die Summe der N. N ungleich 12/3/7 ist fehlt.
4. **Signatur:** `opt.finanzMax` mit Standard je Kategorie. Neuer Typname `RangKategorie`, damit `Kategorie` aus
   `bewertung.ts` bis zum Rückbau weiterlebt. Leser (`anteil`, `euro`, `finanzNote`) in ein eigenes Modul.
5. **Kosten** = Semantik von `finanzNote` (`vergleichAssistent.ts:157-174`): nur Schlüssel aus den Höchstpunkten plus
   `min(0, abzug)`, begrenzt auf 0 bis 5. `finanzPunkte` fehlt oder `{}` ist fehlt.
6. **Ampeln:** `teils` = 0,5 (betrifft Haspa Dispo), `unbekannt` = fehlt.
7. **Seite und geführter Vergleich:** `rangfolge` rankt nach Formel, auch Tor `teils` (Halal halbiert) und rote
   Grundlagen wie DKB-Dispo (Merkmal zählt 0). Der Kasten „Unsere Nummer 1“ und `werteAus` ohne Antworten zeigen
   dieselbe Reihenfolge, aber nur Einträge **ohne Einschränkung** (Tor `gut`, kein `BASIS`-Merkmal `schlecht`). So
   bleiben beide Elias-Regeln stehen: 14.09. „gelb halbiert“ für die Liste, 19.09. „kein Mensch will Zinsen“ für die
   Empfehlung. Gilt, bis Elias anders entscheidet.
8. **Priorität** gewichtet nur Kosten. `halalAnteil` 0,65 fällt weg, `nebenSort` und `grundSort` werden auf Merkmale
   ohne Halal-Bezug beschränkt oder gestrichen.
9. **Steuer:** `belegabruf` ist boolean (true 1, false 0, null fehlt). Texte: beginnt mit „ja“ = 1, beginnt mit
   „nur in der Fassung“ = 0,5, „nein“ = 0. `plattform: null` ist fehlt. Preis kommt aus einem neuen Handfeld
   `preisEinzel` (Zahl in Euro, eine Erklärung, einmalig, reguläre Grundfassung, Quelle wie `preis`), nicht aus dem
   Text. Linear bis 60 €. `kapital = nein` bleibt abgeraten mit neutralem Grund „kann keine Anlage KAP“.
10. **Gleichstand:** gleiche gerundete Note, Kosten und Halal teilen den Platz (1, 1, 3). Reihenfolge darin nach Name,
    Produkt, `id`. Sortiert wird auf gerundeten Werten. Der Kasten „Nummer 1“ erscheint nur bei eindeutigem Platz 1,
    sonst „gleichauf“ (P4). Heute trifft das ELSTER und CHECK24; Test `vergleichAssistent.test.ts:364-369` wird darauf
    umgeschrieben.
11. **Screener:** Nutzen = 5 × (0,5 × `kostenlosReicht` + 0,5 × Mittel aus `etfs`, `depot`, `zakat`), alle boolean.
    `standard` und `deutscheAktien` bleiben Information ohne Gewicht. Musaffa bleibt vor Islamicly (Test 391-397 hält).
12. **`offeneAnfragen`:** Schlüssel `haus`, Rückfall `id`. Log-Einträge unter `scalable` gelten auch für
    `scalable-prime`. `Vorgang` bekommt ein optionales `automatisch: true` für Eingangsbestätigungen, der Generator
    zählt sie nicht als Antwort und ignoriert Vorgänge mit Datum in der Zukunft. Frischetest gegen `anfragenLog.ts`.
13. **Gruppenvorrang:** abgeraten vor nichtBewertet vor gerankt. Edelmetall mit zwei roten Toren: Grund „kein echtes
    Metall“. Edelmetall-`kosten` = `null` (Anzeige ohne Kostenzahl).
14. `halal` wird nach der Halbierung ausgegeben. nichtBewertet und abgeraten sind nach Name sortiert.
15. Anzeige (P4): Note mit einer Nachkommastelle, halbe Sterne, Typ-Kommentar zu `abgeraten` auf „ungeeignet, mit
    Grund“ verallgemeinern.
16. **Umsetzungsreihenfolge:** wie im Bericht, Schritte 1 bis 9 in P3, Schritt 10 in P4.

## 11. Umsetzung (26.09.2026, Opus, TDD)

Schritte 1 bis 9 aus dem Bericht sind gebaut, Schritt 10 bleibt P4. Branch `rangfolge`, 234 Tests grün,
`npx tsc -b --force` sauber, `npm run build:auslieferung` sauber.

| Commit | Inhalt |
|---|---|
| `0c1e76e` | Pipeline: unklarer oder fehlender Aufschlag = 0,5, Zähler `aufschlag_unklar` in `depot.json` (finanzen.net zero, ING neu mit Punkten) |
| `ef48b6b` | `src/lib/rangfolge.ts` mit `rangfolge`, `nummerEins`, `sterne`; Leser in `src/lib/vergleichLeser.ts`; Feld `preisEinzel` |
| `3c73fb2` | `scripts/anfragen-offen.ts` erzeugt `src/data/anfragenOffen.ts`; Feld `automatisch` im Log |
| `21a5b40` | `werteAus` sitzt auf `rangfolge`; `RANGFOLGE_FREI`, Rangnote, Paket, `halalBelegt`, `halalAnteil`, Nebensortierungen weg |
| `f6acbeb` | `bewerte()` entfernt, `bewertung.ts` hält nur noch die drei Zahlen der Methodik-Seite |
| `5859064` | bunq: Karte ohne Kreditrahmen mit AGB Nr. 9.2 belegt, alle vier Tarife |

Festlegungen beim Bau, die in den Abschnitten oben nicht wörtlich standen:

- `Bewertet.uneingeschraenkt` trägt Abschnitt 10.7. `nummerEins()` liefert die besten Einträge ohne
  Einschränkung, mehrere heißt gleichauf, keiner heißt kein Kasten.
- Ein Haus ohne Mailweg (`keinMailWeg`) zählt nie als „Anfrage läuft“. Eine eingeplante Mail zählt ab ihrem
  Datum; dann meldet der Frischetest, dass `npx tsx scripts/anfragen-offen.ts` laufen muss.
- `werteAus` übergibt `offeneAnfragen` nur, wenn der Aufrufer es mitgibt. Seite und Assistent reichen es erst in P4
  durch, heute steht in `ungeprueft` noch kein Grund.
- Der geführte Vergleich zeigt jetzt die Note der Rangfolge bei jedem fertig bewerteten Vorschlag (vorher durch
  `RANGFOLGE_FREI` verborgen). Nur auf dem Branch sichtbar.
- Steuer-Satz im Assistenten: „Sortiert nach Leistung und Preis.“ statt „Sortiert nach Preis …“.
- `empfehlbar` ist für alle 155 Anbieter unverändert (vorher und nachher gerechnet).

Stand der echten Daten: Depot 4 gerankt (Nummer 1 Scalable Free Broker 4,87), 41 offen, 11 abgeraten. Giro 46
gerankt (Consorsbank 4,90). Krypto 27 (Bitvavo 4,72). Steuer: ELSTER und CHECK24 gleichauf mit 5,0. Screener:
Musaffa 5,0. Edelmetall: Barren beim Händler 5,0.

## 12. Aufnahmeregel (Elias, 26.09.2026)

Wortgleich im Vault: `raw/2026-09-26-finanzmuslim-online-prio-2.md` und `-prio-3.md`.

- **Depot und Girokonto** zeigen Haram sichtbar: Wer sich nicht zinsfrei nutzen lässt, steht rot am Ende, ohne Link.
  Dort muss der Leser wissen, wovon wir abraten.
- **Alle anderen Vergleiche** (Krypto, Steuer, Screener, Edelmetall) führen nur, was einen halalen Weg bietet und für
  Anleger Sinn ergibt. Kein roter Eintrag, der nur sagt „bieten wir nicht an“. Test: `vergleiche.test.ts`, „Aufnahmeregel“.
- **Reine Trading-Apps ohne halalen Nutzungsweg** gehören in keinen Vergleich, auch nicht ins Depot. Hebel als Zusatz,
  den man nie nutzen muss (Knock-outs, Optionsscheine, Margin), führt nicht zum Ausschluss, wie „Zinsen abschaltbar“.
- Tarife zählen einzeln (Memory `tarifstufen-einzeln-bewerten`): ein Abo mit Zinsen macht das kostenlose Angebot nicht haram.

Umgesetzt am 26.09.2026:
- Raus: Steuerbot (keine Anlage KAP), Gold-Schuldverschreibung (Xetra-Gold, EUWAX Gold II), Zertifikate und CFDs auf den
  Goldpreis. Texte nachgezogen: 12 Steuerprogramme, 3 Wege zu Gold. Die Xetra-Gold-FAQ bleibt und sagt, warum.
- Libertex und Plus500 bleiben vorerst: Beide werben auf der deutschen Seite mit echten Aktien (Plus500 „Invest in Aktien“,
  Libertex „CFDs & Reale Aktien“, gesehen am 26.09.2026). Die Anfragen in Tranche 3 (28.09.) klären, ob Privatkunden in
  Deutschland echte Wertpapiere bekommen. Wenn nein, fliegen sie raus.
