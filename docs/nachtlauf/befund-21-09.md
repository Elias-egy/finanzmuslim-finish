# Fortsetzung des Nachtlaufs ab `1102cac`

Stand: 21.09.2026. Diese Liste trennt belegte Befunde von offenen Recherchen. Die Website wurde nicht veröffentlicht.

## Sofort behobene Bewertungsfehler

Die Korrekturschicht `vergleichKorrekturen.ts` konnte für positive Zins- und Bezahlmodellwerte selbst einen allgemeinen Domain-Link als Quelle erzeugen. Damit wurden zuvor gesperrte oder noch ungeprüfte Produkte wieder grün. Positive Korrekturen ohne konkret eingetragenen Anbieterbeleg greifen jetzt nicht mehr. Das betrifft insbesondere pauschale Krypto-Opt-in-Annahmen und Girokonten von Revolut, Tomorrow und Vivid. Unbekannt bleibt unbekannt.

Eine zweite Lücke betraf gleiche IDs in mehreren Vergleichen: `Revolut Standard` kommt etwa bei Depot und Girokonto vor. `empfehlbar(id)` nahm den ersten Treffer und konnte das Girokonto mit dem positiven Depotwert freigeben. Jetzt müssen alle Treffer die Bedingung erfüllen. Vor einer echten Deal-Schaltung müssen die IDs zusätzlich dauerhaft pro Produkt eindeutig gemacht werden.

## Anbieter und Links

| Kategorie | Produkte im Code | Produkte bei Finanzfluss | Finanzfluss-Produkte mit Angebotslink | Eigene aktive Links im Vergleich |
|---|---:|---:|---:|---:|
| Depot | 56 | 56 | 33 | 4 |
| Girokonto | 57 | 57 | 47 | 3 |
| Krypto | 27 | 27 | 19 | 1 |

Die 99 verlinkten Finanzfluss-Produktzeilen entsprechen 76 verschiedenen Finanzfluss-Linkkennungen. Sie sind keine 76 offenen Partnerprogramme: mehrere Tarife nutzen dieselbe Kampagne, und einige Produkte sind für finanzmuslim redaktionell ausgeschlossen. Acht eigene Links sind aktiv: Scalable, Traders Place, DKB Depot, finvesto, DKB Girokonto, N26, BBBank und Kraken Pro. Partnerverfügbarkeit ist getrennt von der Produktempfehlung zu prüfen.

**Giro-Abgleich:** Finanzfluss führt `BforBank Girokonto` und `SumUp` als zusätzliche beziehungsweise umbenannte Produkte. Beide stehen nun im lokalen Vergleich; SumUp bleibt bei Zins und Dispo ungeprüft und ohne Link; Debitkarte und kostenloses Konto sind durch die Anbieterseite belegt. Beide haben dort keinen „Zum Angebot“-Link. Im generierten Rohimport steht noch `BforBASIC Konto`, die laufende Vergleichsliste korrigiert es; BforBASIC bezeichnet auf der [Anbieterseite](https://www.bforbank.com/de/vertragliche-bedingungen) die Karte, während das Konto als Girokonto geführt wird. [Finanzfluss](https://www.finanzfluss.de/vergleich/girokonto/) nennt es BforBank Girokonto. SumUp bietet sowohl ein [Privatkonto](https://www.sumup.com/de-de/privat/konto/) als auch ein Geschäftskonto; in den Girovergleich gehört ausschließlich das Privatkonto. Die SumUp-Seite belegt Karte und Cashback, aber noch nicht alle Halal- und Kostenmerkmale. Deshalb keine grüne Einstufung aus dem Geschäftskonto ableiten.

**Nächste Partnerwege:** Zugänge und Einzelkampagnen in FinanceQuality, Impact, MCANISM, Awin und CHECK24 direkt im Portal abgleichen; financeAds ist laut Mailstand noch in Prüfung. CHECK24 hat Elias inzwischen selbst als vorhandenen Zugang bestätigt. Priorität haben redaktionell passende Anbieter, die bei Finanzfluss einen Angebotslink haben und für die noch kein eigener Link aktiv ist: unter anderem comdirect, flatex, Smartbroker+, Bitpanda, Bitvavo, BISON, S Broker, Consorsbank, Wise und passende N26-Tarife. Wo ein Produkt rot oder ungeprüft ist, bleibt ein möglicher Affiliate-Link vom Vergleich getrennt.

## Prüfbestand vor einer sichtbaren Note

Die [Prüfmatrix](anbieter-pruefmatrix.tsv) enthält 225 konkrete Merkmalszeilen mit Rohwert, vorhandener Beleg-URL, Finanzfluss-Linkkennung und nächstem Belegweg. Davon sind nach den lokalen BforBank- und SumUp-Nachträgen 122 offen; die Importdatei selbst ist noch nicht synchronisiert. Die Matrix ist ein Snapshot; die Korrekturschicht kann Laufzeitwerte ändern und muss bei der nächsten Datenerzeugung in den Export integriert werden. Kaufbarkeit bleibt pro ISIN separat zu dokumentieren.

- **P0:** Positive Urteile nur mit genauer Anbieterquelle, Tarif, Zitat und Prüfdatum. Automatisch eröffnete Tagesgeldkonten und aktivierte Rewards ausdrücklich prüfen. Die nun konservativ behandelten Korrekturen sind je Anbieter nachzubelegen.
- **P1:** 28 offene Depot-Zinsurteile, 26 offene Giro-Zinsurteile im Rohbestand, 21 offene Krypto-Zinsurteile. Nach Korrekturschicht ist der tatsächlich ungeprüfte Bestand größer; die nächste Matrix muss die *Laufzeitwerte* statt nur die generierten Rohzeilen zählen.
- **P1:** 24 Giro-Dispo- und 22 Krypto-Bezahlmodellwerte waren im Rohbestand offen. Für SumUp bleiben Zins und Dispo sowie weitere Konditionen offen; die Debitkarte ist belegt.
- **P1:** Kaufbarkeit je ISIN und Depot nur mit der Anbieter-Wertpapiersuche oder schriftlicher Anbieterantwort belegen. App-exklusive Suchergebnisse gehen an Elias' App-Prüfliste.
- **P1:** BforBank-Produktbezeichnung ist in der laufenden Vergleichsliste korrigiert. Das Recherche-Mapping und der Generator müssen nachgezogen werden. Der aktuelle Datengenerator schreibt die Vergleichsdateien ohne die spätere Korrekturschicht neu; vor dem nächsten Datenlauf muss deren Schutz in die Pipeline übernommen werden.

## SEO: Research vor neuen Seiten

Search Console meldete 2 Klicks und 46 Impressionen. Bei einer erst wenige Tage indexierten und noch nicht beworbenen Domain ist das kein Qualitätsurteil. Die 15 sichtbaren Suchanfragen sind: `aktien katalog die man nach dem islam kaufen kann`, `aktien islam`, `ist investieren haram`, `zakat berechnen`, `zakat rechner`, `ist ratenzahlung haram`, `ما هو بيع الغرر`, `ishares msci world islamic`, `halal fonds`, `halal aktien`, `ist aktien haram`, `sind aktien haram`, `dövizle askerlik`, `21bitcoin`, `privatkredit rechner zinsen und monatliche rate`. Die letzten beiden fremdsprachigen beziehungsweise markenbezogenen Einzelimpressionen begründen keine neue Seite.

Die 50 Suchabsichten in der folgenden Liste sind **Kandidaten**, keine nach Volumen sortierten Top 50. Die Priorität entsteht aus Suchintention, vorhandener Antwort, Nutzen und späteren Search-Console-Daten. Keine Suchvolumen-Zahl ist belegt.

| Nr. | Suchabsicht | Ziel |
|---:|---|---|
| 1 | halal Aktien | `/halal-anlagen` |
| 2 | Aktien nach Islam kaufen | `/halal-anlagen` |
| 3 | Aktien Islam erlaubt | `/wissen/sind-aktien-halal` |
| 4 | ist Investieren haram | `/halal-guide` |
| 5 | sind Aktien haram | `/wissen/sind-aktien-halal` |
| 6 | halal ETF | `/wissen/halal-etfs` und Produktliste `/halal-anlagen` |
| 7 | halal Fonds | `/halal-anlagen` |
| 8 | iShares MSCI World Islamic | vorhandene Anlagendetailseite |
| 9 | halal Aktien prüfen | `/vergleich/screening-apps` |
| 10 | bekannte Aktien halal | `/vorlagen/top-100-halal-aktien` |
| 11 | halal Depot | `/vergleich/depot` |
| 12 | Depot ohne Zinsen | `/vergleich/depot` |
| 13 | Broker für Muslime | `/vergleich/depot` |
| 14 | halal investieren Anfänger | `/halal-guide` |
| 15 | Halal-Anlagen kaufen | `/halal-anlagen` |
| 16 | halal Girokonto | `/vergleich/girokonto` |
| 17 | Girokonto ohne Zinsen | `/wissen/girokonto-ohne-zinsen` und Vergleich |
| 18 | Konto ohne Dispo | `/vergleich/girokonto` |
| 19 | Guthabenzins abschalten | `/wissen/girokonto-ohne-zinsen` |
| 20 | Kreditkarte halal | `/wissen/kreditkarte-halal` |
| 21 | Bitcoin halal | `/wissen/ist-bitcoin-halal` |
| 22 | Krypto halal | `/wissen/ist-bitcoin-halal` |
| 23 | Krypto-Börse halal | `/vergleich/krypto` |
| 24 | Bitcoin kaufen halal | `/vergleich/krypto` |
| 25 | Staking halal | Antwortlücke prüfen, keine neue Seite ohne Fachbeleg |
| 26 | Gold halal | `/wissen/halal-gold-kaufen` |
| 27 | Gold kaufen Islam | `/vergleich/edelmetalle` |
| 28 | Gold-ETC halal | `/vergleich/edelmetalle` und Anlagendetails |
| 29 | Sukuk | `/wissen/sukuk` |
| 30 | islamische Anleihe | `/wissen/sukuk` |
| 31 | Zakat Rechner | `/zakat-rechner` |
| 32 | Zakat berechnen | `/zakat-rechner` |
| 33 | Nisab | `/wissen/nisab` |
| 34 | Zakat auf Aktien | `/wissen/zakat-auf-aktien-etf-krypto` |
| 35 | Zakat auf ETF | derselbe Beitrag |
| 36 | Zakat auf Krypto | derselbe Beitrag |
| 37 | Rendite berechnen | `/renditerechner` |
| 38 | Sparziel berechnen | `/sparzielrechner` |
| 39 | Budget berechnen | `/budgetrechner` |
| 40 | Inflation berechnen | `/inflationsrechner` |
| 41 | Kreditkosten berechnen | `/kreditkostenrechner` |
| 42 | Monatsrate und Zinsen berechnen | `/kreditkostenrechner` |
| 43 | Aktien bereinigen Rechner | `/bereinigungsrechner` |
| 44 | Ratenzahlung haram | `/wissen/ratenzahlung-haram` |
| 45 | Leasing halal | `/wissen/ist-leasing-haram` |
| 46 | Haus kaufen ohne Zinsen | `/wissen/haus-kaufen-ohne-zinsen` |
| 47 | islamische Baufinanzierung | derselbe Beitrag |
| 48 | Versicherung haram | `/wissen/ist-versicherung-haram` |
| 49 | Erbe Islam | `/wissen/erbe` |
| 50 | Geld ins Ausland senden | Antwortlücke; Vergleich nur mit geprüften Konditionen |

Vor neuen Keyword-Seiten zuerst die vorhandenen Seiten prüfen: beantwortet die H1 die Frage, steht die Antwort sichtbar im Hauptinhalt, sind passender Rechner/Vergleich und Grundlagen mit beschreibenden Ankertexten verlinkt? Der Stichproben-Build zeigt bereits interne Links: `/zakat-rechner` hat elf interne Hauptinhalt-Links, `/wissen/halal-etfs` vierzehn, `/halal-anlagen` neunundneunzig. Mehr Links ohne Nutzen wären kein Fortschritt. Die leere Seite `/deals` bekommt bis zu belegten Angeboten ein `noindex`.

## Browser, Build, Ladezeit

Die lokale Girokonto-Seite zeigte vor der Korrektur bei 390 px die erste Empfehlungskarte bei 440 px, bei 360 px ebenfalls bei 440 px. Kein horizontaler Überlauf bei 360, 390 oder 1470 px. Nach dem Build im Browser verifiziert: 57 von 57 Banken, BforBank und SumUp sichtbar, BforBASIC nicht mehr sichtbar. Bei 390 px kein horizontaler Überlauf; die erste Empfehlungskarte beginnt bei 438 px. Desktop bei 1470 px ebenfalls ohne Überlauf. Eine systematische Ladezeitmessung fehlt noch; der Produktionsbuild meldet ein anfängliches JavaScript-Paket mit 790,71 kB vor gzip (219,67 kB gzip) und ein Chart-Paket mit 349,94 kB (98,13 kB gzip). Das ist ein Prüfpunkt, kein gemessener Core-Web-Vitals-Befund. Search Console liefert für die junge Domain noch keine belastbaren Felddaten.

Typecheck: grün. Vitest: 123 bestanden, 1 übersprungen. Vollständiger Auslieferungs-Build: 101 Seiten erzeugt, 89 indexierbar, 12 auf noindex; 89 SEO-Prüfungen sauber, 123 Adressen mit richtigem Status. `/deals` ist leer und deshalb nicht mehr in der Sitemap. Browser bestätigt `noindex, nofollow`.

## Portal-Stichprobe

MCANISM SKYNET war am 21.09. im vorhandenen Publisher-Konto geöffnet. Die Kampagnensuche nach `SumUp` lieferte keine Zeile. Das belegt keinen netzwerkweiten Ausschluss und ersetzt nicht die Inventur der übrigen Programme.

**Neue Primärbelege 21.09.:** [BforBank](https://www.bforbank.com/de/haeufig-gestellte-fragen?category=karte&page=4) bestätigt, dass derzeit kein Dispositionskredit verfügbar ist. [SumUp](https://www.sumup.com/de-de/privat/konto/) nennt das Privatkonto kostenlos und die Mastercard eine Debitkarte; Zinsfreiheit und Dispo sind dort nicht beantwortet.
