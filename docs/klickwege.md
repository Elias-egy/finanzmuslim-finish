# Klickwege zur Geldquelle

Stand 21.09.2026. Elias: „Es soll immer ein Beitrag und der soll irgendwie zur Geldquelle führen … manchmal von einem
zum anderen Rechner oder zum Vergleich, damit wir Abwechslung haben. Aber es geht immer noch darum, bestmöglich Geld
zu verdienen.“

## Regeln

- **Hauptaufruf nach Kapitel 1** (`src/data/werbung.ts`): der Vergleich zum Thema oder der geführte Vergleich
  `/vergleich/start`. Der Test wechselt sich mit dem Depot-Vergleich ab.
- **Box oben** (im Beitrag, `boxOben`): weicher Einstieg, Rechner, Vorlage oder Anlagenliste. Nie ein anderer Beitrag.
- **Box Mitte** (`boxMitte`): ein zweiter, anderer Geld-Weg. Fällt weg, wenn das Ziel gleich dem Hauptaufruf ist.
- Vorheriger und nächster Beitrag am Ende bleiben (interne Verlinkung für SEO).
- Rechner enden alle im Block „Finde heraus, welcher Anbieter zu dir passt“ (`FindeDeinAngebot` → `/vergleich/start`)
  und verketten sich thematisch: Inflation → Rendite, Zakat → Bereinigung, Budget → Sparziel, Kredit → Rendite.

## Warum der Test so oft vorne steht

Im geführten Vergleich stehen die Partner mit Link vorn, und er empfiehlt nur, was ab Start ohne Zinsen läuft. Ein
Klick dorthin endet am häufigsten bei einem Partner. Der Depot-Vergleich ist die zweite Wahl, weil dort alle 56
Anbieter stehen, auch die ohne Partnerlink.

## Stand je Beitrag

| Beitrag | oben | Hauptaufruf | Mitte |
|---|---|---|---|
| auto-kaufen-ohne-zinsen | Vertrags-Ampel | Depot | Kreditkostenrechner |
| dispo-und-schulden | Budgetrechner | Girokonto | Test |
| erbe | Zakat-Rechner | Depot | Vertrags-Ampel |
| ertraege-reinigen | Bereinigungsrechner | Depot | Halal-Anlagen |
| gharar | Vertrags-Ampel | Test | Depot |
| girokonto-ohne-zinsen | Test | Girokonto | Depot |
| haeufige-fehler | Halal-Guide | Test | Depot |
| halal-etfs | Halal-Anlagen | Depot | – |
| halal-gold-kaufen | Halal-Anlagen | Depot | – |
| halal-kredit-ohne-zinsen | Vertrags-Ampel | Test | Depot |
| haus-kaufen-ohne-zinsen | Kreditkostenrechner | Depot | – |
| ist-bitcoin-halal | Depot | Krypto | Screening-Apps |
| ist-leasing-haram | Vertrags-Ampel | Test | Depot |
| ist-versicherung-haram | Depot | Test | Girokonto |
| kreditkarte-halal | Test | Girokonto | Vertrags-Ampel |
| maysir | Vertrags-Ampel | Test | Depot |
| nisab | Zakat-Rechner | Depot | Halal-Anlagen |
| ratenzahlung-haram | Kreditkostenrechner | Girokonto | Depot |
| sind-aktien-halal | Depot | Test | Screening-Apps |
| sukuk | Halal-Anlagen | Depot | – |
| trading-forex-cfd | Halal-Anlagen | Depot | Aktien-Check |
| zakat-auf-aktien-etf-krypto | Zakat-Rechner | Depot | Krypto |
| zinsen-im-islam | Vertrags-Ampel | Test | Depot |

`was-ist-riba` nutzt `ArtikelSeite` ohne diese Boxen.

**Später:** Sobald ein Partner eine eigene Aktion hat, wird der Hauptaufruf eines passenden Beitrags zur Empfehlung
mit Werbekennzeichnung (`EmpfehlungsBox` mit `anbieter`), siehe Backlog „Werbe-Box je Wissensbeitrag“.
