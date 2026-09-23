# finanzmuslim.com: Checkliste bis Release und 10/10

Stand 23.09.2026 nachmittags. Veröffentlicht. Nichts veröffentlicht. Zahlen aus den Werten, die der Vergleich
tatsächlich anzeigt, nicht aus der alten Prüfmatrix.

## A. Muss vor dem Go (Release-Blocker)

- [x] **Mail-Runde 2 abgeschickt**: 27 Mails am 21.09. aus `eliaselgendy2006@gmail.com`, im Gesendet-Ordner einzeln geprüft.
- [ ] **Antworten eintragen** (Claude, laufend; Historie je Anbieter in `src/data/anfragenLog.ts`): Wortlaut mit Datum als Beleg, dann Tests und Build. Eingetragen bis 21.09.:
      meine Bank, Haspa, EthikBank, HVB, tradegate.direct, justTRADE, Bitvavo, Smartbroker+. Am 22.09.: Commerzbank-Depots,
      Joe Broker, Berliner Volksbank, finanzen.net zero Krypto. Am 23.09.: PSD Bank Nürnberg (Zins und Dispo) und Relai
      (Krypto, klare Antwort des KI-Assistenten, Elias' Regel vom 23.09.).
      Antworten ohne Inhalt, da kommt nichts mehr: Targobank (verweist in die Filiale, 23.09.), Santander, BBBank, maxblue.
      Noch offen: DKB, Scalable, flatex, Tomorrow, Pax-Depots, Traders Place Krypto, WillBe-Nachfrage. BSDEX: Elias entscheidet.
- [ ] **Anbieter ohne Mail-Weg**: Von den 17 sind 7 über ihre eigene Seite belegt (Binance, Kraken, OKX, Freedom24,
      Plus500, Monese, Vivid). Noch offen, per App oder Chat fragen oder bewusst auf „noch nicht geprüft“ lassen
      (Elias entscheidet): 21bitcoin, BISON, Bitpanda, eToro, Revolut Krypto, bunq, Klarna, SumUp, Wise, BforBank.
- [ ] **Offene Halal-Felder**, heute:
  - Depot: 56 Produkte, 30 alles ja, 15 offen, 11 mit Nein. Partner: 4 grün, 0 offen
  - Girokonto: 57 Produkte, 39 alles ja, 10 offen, 8 mit Nein. Partner: 2 grün, 1 offen (DKB)
  - Krypto: 27 Produkte, 7 alles ja, 10 offen, 10 mit Nein
  - Je Produkt mit Quelle: http://localhost:5200/pruefstand.html, neu erzeugen mit `npx tsx scripts/pruefstand.ts`
  - Release geht auch mit offenen Feldern, solange sie sichtbar „noch nicht geprüft“ heißen und nie grün werden.
    Das ist technisch schon so erzwungen. Entscheidung Elias: warten auf Antworten oder mit Lücken live.
- [x] **Datenpipeline repariert**: Korrekturen und Belege liegen in `src/data/vergleichKorrekturenDaten.ts`, `bauen.py`
      bindet sie ein und schreibt sie nie. Echter Lauf geprüft: keine Datenänderung.
- [x] **Partnerlinks technisch geprüft**: alle 8 leiten mit Partnerkennung auf die Anbieterseite. Portalstatus nur mit
      Elias' Login sichtbar.
- [x] **finvesto**: belegt mit den FNZ-Bedingungen: „Eine Verzinsung für das Guthaben auf dem Konto flex erfolgt
      derzeit nicht“.
- [x] **Anlagen gegen Zertifikate geprüft**: alle 31 Links geladen. Invesco Physical Gold II ist raus (nicht im
      Zertifikat vom 01.06.2026), Weiterleitung steht. Edelmetall-Zähler 7 statt 8. Liste jetzt „23 halal Anlagen“ mit
      Platin, Palladium und Edelmetallkorb, PDF neu gerendert.
- [x] **Design abgenommen** (Elias, 21.09.): Fundament blau-weiß, Farbe in Daten und Logos, ein Aufruf-Block je
      Rechnerseite, keine Einzelanbieter in Rechnern.
- [x] **Kleingedrucktes in den Rechnern gekürzt** (Elias, 22.09.): Wiederholungen raus, Quellen und Hinweise bleiben.
      Erstes Bedienelement bei 390 px überall unter 500 px, kein Überlauf bei 390 und 360 px.
- [x] **Kraken-Startseite korrigiert**: Auto Earn läuft laut Kraken nur nach eigenem Einschalten.
- [x] **Veröffentlicht am 23.09.2026** (Elias' Go im Chat). Läufe 35852465892, 35854350147 und 35856965033, live per curl und CSS-Prüfung bestätigt.

## B. Für 10/10 (darf nach dem Release kommen)

**Daten**
- [x] Eindeutige Produkt-IDs geprüft (23.09.): Innerhalb jedes Bereichs sind alle IDs eindeutig. Nur `revolut-standard`
      und `vivid-standard` kommen in zwei Bereichen vor. Ein Umbau würde Partnerlinks, Korrekturen und Kaufbar-Zuordnung
      anfassen; der Test hält die einzige echte Gefahr (ein Bonus am falschen Produkt) schon auf. Bewusst so gelassen.
- [x] Kaufdaten für alle 27 ISINs, die vier Metall-ETCs über die Traders-Place-Suche belegt.
- [ ] Trade-Republic-Goldtreffer (2 ISINs) in der App gegenprüfen (Elias, braucht Login).
- [x] Prüfstand ist die Matrix aus Laufzeitwerten, jetzt mit Anfragen-Historie je Anbieter und der Tabelle „Fragezeichen“.

**Deals und Partner**
- [x] `/deals` mit fünf Boni: ING 200 € (bis 30.09.), 1822direkt 200 €, comdirect Depot bis 150 €, BBBank 50 €,
      Commerzbank 50 €. Postbank ohne laufende Aktion. UmweltBank offen: automatische „Debit-Kreditkarte“ erst klären.
- [x] ING-Bonus endet am 30.09.: `kurse.yml` liefert jetzt täglich aus, auch ohne Kursänderung. Abgelaufene Boni verschwinden dadurch von selbst.
- [ ] Partnerprogramme für grüne Anbieter beantragen: comdirect, flatex, Smartbroker+, Bitvavo, Consorsbank u. a.
      (MCANISM, Impact, FinanceQuality, CHECK24, Awin; financeAds wartet).
- [ ] Musaffa und Zoya: Status der Anträge prüfen.

**Technik und SEO**
- [x] Ladezeit gemessen (22.09., Lighthouse 13.5 mobil, lokaler Build): Leistung 82 bis 89, Barrierefreiheit 96 bis 100,
      Best Practices und SEO je 100. Größtes Element nach 3,1 bis 3,7 s (Ziel unter 2,5 s), Layoutverschiebung 0.
      Beschriftungen, Zeitraum-Knöpfe, Fortschrittsbalken und Überschriftenfolge behoben.
- [ ] Größtes Element unter 2,5 s: Umstellen von `createRoot` auf `hydrateRoot` getestet, bringt nichts (3,9 s).
      Die Bremse liegt vor dem JavaScript: blockierendes CSS (455 ms) und viele Modul-Vorladungen. Eigene Sitzung.
- [x] Farbkontrast erledigt (23.09.): violet 66 %, gain und success 29 %, destructive 45 %, Navigationsschrift /90.
      Lighthouse auf sechs Seiten: Barrierefreiheit 100, Kontrastprüfung ohne Beanstandung.
- [ ] 50 Suchabsichten gegen die Seiten prüfen: Title, H1, sichtbare Antwort, interne Links.
- [ ] Search Console nach Release wöchentlich lesen; neue Seiten nur bei echter Antwortlücke.

## C. Erledigt am 21. und 22.09.

- [x] `/deals` mit Bereichsfilter, zwei beim Anbieter belegte Boni, wieder in der Sitemap
- [x] „Wo kaufen“ in der Anlagendatenbank, Ratgeber-CTA im Kauf-Abschnitt
- [x] Bitvavo- und Smartbroker+-Antworten als Belege eingetragen
- [x] Tagesgeld-Regel festgehalten: bewertet wird das Konto selbst
- [x] 37 Zins- und Dispo-Ampeln mit wörtlichem Anbieterzitat neu belegt (6 Mail-Antworten, 31 Anbieterseiten)
- [x] Klickwege: kein Beitrag führt per Box auf einen anderen Beitrag, Karte in `docs/klickwege.md`
- [x] 126 Tests grün, 100 Seiten gebaut (89 indexierbar, 15 Weiterleitungen), 123 Statusprüfungen richtig
