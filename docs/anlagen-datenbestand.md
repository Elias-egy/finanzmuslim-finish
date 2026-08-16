# Datenbestand der 23 Anlagen

Erzeugt am 16.08.2026 aus `src/data/halalAnlagen.ts` und `src/data/kurse.json`.
Nichts hier ist geschätzt. Wo eine Spalte `nein` sagt, fehlt die Angabe wirklich.

| Anlage | Art | ISIN | Anbieter | Kurse | Wochenpunkte | Monatspunkte | Shariah-Nachweis |
|---|---|---|---|---|---|---|---|
| iShares MSCI World Islamic | aktien | IE00B27YCN58 | iShares | ja | 262 | 60 | ja |
| iShares MSCI Emerging Markets Islamic | aktien | IE00B27YCP72 | iShares | ja | 262 | 60 | ja |
| iShares MSCI USA Islamic | aktien | IE00B296QM64 | iShares | ja | 262 | 60 | ja |
| Invesco Dow Jones Islamic Global Developed Markets | aktien | IE000UOXRAM8 | Invesco | ja | 242 | 55 | ja |
| Invesco MSCI ACWI Islamic M-Series | aktien | IE000LFC57H7 | Invesco | ja | 28 | 6 | nein |
| HSBC MSCI World Islamic Screened | aktien | IE000X9FTI22 | HSBC | ja | 195 | 45 | ja |
| HSBC MSCI USA Islamic Screened | aktien | IE000I5NV504 | HSBC | ja | 197 | 45 | ja |
| HSBC MSCI Europe Islamic Screened | aktien | IE000AGFZM58 | HSBC | ja | 194 | 44 | ja |
| HSBC MSCI Emerging Markets Islamic Screened Capped | aktien | IE0009BC6K22 | HSBC | ja | 189 | 43 | ja |
| HANetf Saturna Al-Kawthar Global Focused Equity | aktien | IE00BMYMHS24 | HANetf | ja | 262 | 60 | nein |
| iShares USD Sukuk UCITS ETF | sukuk | IE000929U2U9 | iShares | ja | 136 | 31 | nein |
| Xtrackers II Salam USD Global Aggregate Sukuk | sukuk | LU3123443510 | Xtrackers | nein | 0 | 0 | ja |
| BNP Paribas Islamic Fund Hilal Income Classic C | sukuk | LU1150255971 | BNP Paribas | ja | 231 | 53 | nein |
| Invesco Physical Gold ETC | gold | IE00B579F325 | Invesco | ja | 262 | 60 | ja |
| Invesco Physical Gold II | gold | XS3384723154 | Invesco | ja | 9 | 2 | ja |
| WisdomTree Physical Gold | gold | JE00B1VS3770 | WisdomTree | ja | 262 | 60 | ja |
| WisdomTree Core Physical Gold | gold | JE00BN2CJ301 | WisdomTree | ja | 262 | 60 | ja |
| WisdomTree Physical Swiss Gold | gold | JE00B588CD74 | WisdomTree | ja | 262 | 60 | ja |
| Invesco Physical Silver | silber | IE00B43VDT70 | Invesco | ja | 262 | 60 | ja |
| WisdomTree Physical Silver | silber | JE00B1VS3333 | WisdomTree | ja | 262 | 60 | ja |
| WisdomTree Core Physical Silver | silber | JE00BQRFDY49 | WisdomTree | ja | 104 | 24 | nein |
| Comgest Growth Europe S EUR Acc | aktien | IE00B4ZJ4634 | Comgest | ja | 261 | 60 | nein |
| Franklin Shariah Technology Fund A (acc) USD | aktien | LU2458330086 | Franklin Templeton | nein | 0 | 0 | nein |

## Was fehlt und warum

**Zwei Anlagen ohne jeden Kurs.** Xtrackers II Salam USD Global Aggregate Sukuk
(LU3123443510) und Franklin Shariah Technology Fund (LU2458330086). Yahoo findet
zu beiden ISINs keine Notierung mit Historie. Beide sind jung. Die Detailseite
zeigt dort den Hinweis, dass noch keine Kursdaten vorliegen, keine leere Grafik.

**Kurze Reihen.** Invesco MSCI ACWI Islamic (28 Wochen), Invesco Physical Gold II
(9 Wochen), WisdomTree Core Physical Silver (104), iShares USD Sukuk (136). Das
sind echte Auflagedaten, kein Datenfehler. Renditen über ein Jahr fehlen dort
zu Recht.

**Keine Zusammensetzung.** Für keine Anlage liegen Positionen, Länder oder
Branchen vor. Sie stehen in den Factsheets der Anbieter und müssen einmal
abgeschrieben werden, mit Datum und Quelle. Das Gerüst dafür ist
`src/data/zusammensetzung.ts`, die Seite rendert schon dagegen. Bei Gold und
Silber entfällt der Block dauerhaft: ein Barren im Tresor hat keine Positionen.

**Keine WKN.** In den Stammdaten steht keine WKN. Der Kopierknopf erscheint
deshalb nur für die ISIN, nicht als leerer zweiter Knopf.

**Keine Broker-Zuordnung.** Welcher Broker welche ISIN führt, ist nirgends
belegt. Deshalb stehen die drei Werbeplätze im Zustand `in_vorbereitung`.

## Herkunft der Kurse

`~/rebrand/data/kurse_holen.py` holt für jede ISIN die Notierung mit der besten
Historie, rechnet sie über den monatlichen Wechselkurs in Euro um und schreibt
zwei Reihen: Monatsschlusskurse für Tabelle und Mini-Grafiken,
Wochenschlusskurse für die grosse Grafik. Danach werden
`kurse_kompakt.json` nach `src/data/kurse.json` und `nisab.json` nach
`src/data/nisab.json` kopiert. Etwa alle vier Wochen.

## Abweichungen von der Master-Spezifikation

**recharts statt ECharts.** Die Spezifikation empfiehlt Apache ECharts. Im
Projekt gilt die feste Regel, keine zweite Grafikbibliothek einzubauen, und
recharts liegt bereits im Bundle. recharts kann Fläche, Fadenkreuz, Tooltip,
Achsen und Zeitraumwechsel, das deckt die Anforderung vollständig ab. Ein
zweites Grafikpaket hätte nur das Bundle vergrössert.

**Kein Supabase, keine Edge Function, kein Cron.** Die Spezifikation sieht eine
Datenbank mit täglichem Sync über einen lizenzierten Anbieter vor. Dafür fehlt
die Anbieterentscheidung und der Vertrag. Die bestehende Kette Python-Skript →
JSON im Repo liefert dieselben Daten, kostet nichts und hat keine Secrets im
Browser. Die Datenschicht liegt gekapselt in `src/lib/kurse.ts`; ein späterer
Wechsel auf Supabase betrifft nur diese Datei.

**Zeiträume 1M bis 5J statt bis MAX.** Die Historie reicht fünf Jahre zurück,
MAX wäre dasselbe wie 5J und damit ein Knopf, der nichts tut.
