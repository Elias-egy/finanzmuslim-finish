# finanzmuslim.com: Checkliste bis Release und 10/10

Stand 21.09.2026, Commit `9dfccad`. Nichts veröffentlicht. Zahlen aus den Werten, die der Vergleich
tatsächlich anzeigt, nicht aus der alten Prüfmatrix.

## A. Muss vor dem Go (Release-Blocker)

- [ ] **Mail-Runde 2 abschicken** (Elias): 27 Entwürfe in `eliaselgendy2006@gmail.com`, Betreff „Frage vor Kontoeröffnung“.
- [ ] **Antworten eintragen** (Claude): Wortlaut mit Datum als Beleg, dann Tests und Build.
- [ ] **17 Anbieter ohne Mail-Weg** per App oder Chat fragen oder bewusst auf „noch nicht geprüft“ lassen (Elias entscheidet):
      21bitcoin, Binance, BISON, Bitpanda, eToro, Kraken, OKX, Revolut, Freedom24, Plus500, bunq, Klarna, Monese,
      SumUp, Wise, Vivid, BforBank.
- [ ] **Offene Halal-Felder**, heute:
  - Depot: 56 Produkte, 23 komplett grün, 10 abgeraten, 22 mit offenem Zinsfeld
  - Girokonto: 57 Produkte, 17 komplett grün, 6 abgeraten, 33 mit offenen Feldern (49 Zins- oder Dispo-Felder)
  - Krypto: 27 Produkte, 3 komplett grün, 4 abgeraten, 20 mit offenen Feldern (36 Zins- oder Bezahlmodell-Felder)
  - Release geht auch mit offenen Feldern, solange sie sichtbar „noch nicht geprüft“ heißen und nie grün werden.
    Das ist technisch schon so erzwungen. Entscheidung Elias: warten auf Antworten oder mit Lücken live.
- [ ] **Datenpipeline reparieren** (Claude): `~/rebrand/data/vergleiche/bauen.py` überschreibt beim nächsten Lauf die
      Korrekturen (BforBank-Name, Belege). Vorher darf niemand neu generieren.
- [ ] **Partnerlinks je Produkt prüfen** (Claude, Portale in Chrome): 8 Links aktiv. Für jeden sicherstellen,
      dass die Kampagne angenommen ist und das Produkt nicht rot oder ungeprüft ist.
- [ ] **Deploy-Go** (Elias): Workflow `auslieferung.yml` mit „veröffentlichen“, danach mit curl prüfen.

## B. Für 10/10 (darf nach dem Release kommen)

**Daten**
- [ ] Eindeutige Produkt-IDs über alle Vergleiche. Heute teilen sich z. B. Revolut Depot und Girokonto eine ID.
- [ ] Kaufdaten für 4 Anlagen: Royal Mint Physical Gold, WisdomTree Physical Platinum, Palladium, Precious Metals.
- [ ] Trade-Republic-Goldtreffer (2 ISINs) in der App gegenprüfen (Elias, braucht Login).
- [ ] Prüfmatrix aus den Laufzeitwerten neu erzeugen statt aus dem Rohimport.

**Deals und Partner**
- [ ] Weitere belegte Boni auf `/deals`: 1822direkt (200 € mit Geldeingang, belegt), ING, Postbank, Commerzbank,
      UmweltBank auf der Anbieterseite prüfen. Nur öffentlich belegte Boni, nie „laut Finanzfluss“.
- [ ] Partnerprogramme für grüne Anbieter beantragen: comdirect, flatex, Smartbroker+, Bitvavo, Consorsbank u. a.
      (MCANISM, Impact, FinanceQuality, CHECK24, Awin; financeAds wartet).
- [ ] Musaffa und Zoya: Status der Anträge prüfen.

**Technik und SEO**
- [ ] Ladezeit messen (Lighthouse mobil, reproduzierbar). Haupt-JavaScript heute 791 KB vor gzip.
- [ ] 50 Suchabsichten gegen die Seiten prüfen: Title, H1, sichtbare Antwort, interne Links.
- [ ] Search Console nach Release wöchentlich lesen; neue Seiten nur bei echter Antwortlücke.

## C. Erledigt am 21.09.

- [x] `/deals` mit Bereichsfilter, zwei beim Anbieter belegte Boni, wieder in der Sitemap
- [x] „Wo kaufen“ in der Anlagendatenbank, Ratgeber-CTA im Kauf-Abschnitt
- [x] Bitvavo- und Smartbroker+-Antworten als Belege eingetragen
- [x] Tagesgeld-Regel festgehalten: bewertet wird das Konto selbst
- [x] 125 Tests grün, 101 Seiten gebaut, 123 Statusprüfungen richtig, 390 und 360 px ohne Überlauf
