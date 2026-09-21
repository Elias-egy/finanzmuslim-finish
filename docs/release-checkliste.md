# finanzmuslim.com: Checkliste bis Release und 10/10

Stand 21.09.2026 nachmittags. Nichts veröffentlicht. Zahlen aus den Werten, die der Vergleich
tatsächlich anzeigt, nicht aus der alten Prüfmatrix.

## A. Muss vor dem Go (Release-Blocker)

- [x] **Mail-Runde 2 abgeschickt**: 27 Mails am 21.09. aus `eliaselgendy2006@gmail.com`, im Gesendet-Ordner einzeln geprüft.
- [ ] **Antworten eintragen** (Claude): Wortlaut mit Datum als Beleg, dann Tests und Build.
- [ ] **17 Anbieter ohne Mail-Weg** per App oder Chat fragen oder bewusst auf „noch nicht geprüft“ lassen (Elias entscheidet):
      21bitcoin, Binance, BISON, Bitpanda, eToro, Kraken, OKX, Revolut, Freedom24, Plus500, bunq, Klarna, Monese,
      SumUp, Wise, Vivid, BforBank.
- [ ] **Offene Halal-Felder**, heute:
  - Depot: 56 Produkte, 23 komplett grün, 10 abgeraten, 22 mit offenem Zinsfeld
  - Girokonto: 57 Produkte, 6 abgeraten, 33 mit offenen Feldern; Commerzbank-Dispo am 21.09. belegt
  - Krypto: 27 Produkte, 3 komplett grün, 4 abgeraten, 20 mit offenen Feldern (36 Zins- oder Bezahlmodell-Felder)
  - Release geht auch mit offenen Feldern, solange sie sichtbar „noch nicht geprüft“ heißen und nie grün werden.
    Das ist technisch schon so erzwungen. Entscheidung Elias: warten auf Antworten oder mit Lücken live.
- [x] **Datenpipeline repariert**: Korrekturen und Belege liegen in `src/data/vergleichKorrekturenDaten.ts`, `bauen.py`
      bindet sie ein und schreibt sie nie. Echter Lauf geprüft: keine Datenänderung.
- [x] **Partnerlinks technisch geprüft**: alle 8 leiten mit Partnerkennung auf die Anbieterseite. Portalstatus nur mit
      Elias' Login sichtbar.
- [ ] **finvesto**: Zins im Vergleich ungeprüft, die Startseite sagt „Guthaben auf dem Abrechnungskonto wird nicht
      verzinst“. Die FNZ-Zinsseite listet keinen Guthabenzins, ein ausdrückliches 0 % fehlt. Antwort von FNZ abwarten,
      sonst Satz vor dem Go entschärfen.
- [x] **Kraken-Startseite korrigiert**: Auto Earn läuft laut Kraken nur nach eigenem Einschalten.
- [ ] **Deploy-Go** (Elias): Workflow `auslieferung.yml` mit „veröffentlichen“, danach mit curl prüfen.

## B. Für 10/10 (darf nach dem Release kommen)

**Daten**
- [ ] Eindeutige Produkt-IDs. Betroffen sind nur `revolut-standard` und `vivid-standard`; ein Test verhindert, dass ein
      Bonus daran hängt.
- [x] Kaufdaten für alle 27 ISINs, die vier Metall-ETCs über die Traders-Place-Suche belegt.
- [ ] Trade-Republic-Goldtreffer (2 ISINs) in der App gegenprüfen (Elias, braucht Login).
- [ ] Prüfmatrix aus den Laufzeitwerten neu erzeugen statt aus dem Rohimport.

**Deals und Partner**
- [x] `/deals` mit fünf Boni: ING 200 € (bis 30.09.), 1822direkt 200 €, comdirect Depot bis 150 €, BBBank 50 €,
      Commerzbank 50 €. Postbank ohne laufende Aktion. UmweltBank offen: automatische „Debit-Kreditkarte“ erst klären.
- [ ] ING-Bonus endet am 30.09.: Seite nach dem Go neu bauen, sonst zeigt das vorgerenderte HTML ihn weiter.
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
