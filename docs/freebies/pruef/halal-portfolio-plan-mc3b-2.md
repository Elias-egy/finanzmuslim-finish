---
titel: Halal-Prüfzeile, frischer Prüfer, Portfolio-Plan (MC3b, Runde 2)
stand: 2026-10-28
sitzung: e61f4b16-7233-4676-8482-8d57b9eb91fb
gegenstand: /Users/eliasel-gendy/Documents/dev/finanzmuslim-finish/docs/freebies/portfolio-plan.txt mit Begleitdatei portfolio-plan.belege.md
gelesen:
  - fundament/grundlage/HALAL_PRUEFZEILE.md (Vault), ganz
  - docs/freebies/portfolio-plan.txt, ganz (160 Zeilen)
  - docs/freebies/portfolio-plan.belege.md, ganz
  - Ausgabe python3 fundament/audit/halal_aussagen.py … --belege …: 10 Treffer, 0 ohne gültigen Beleg, Ausgang 0
  - iShares II plc Prospekt (blackrock.com, PDF, 28.10.2026 geladen): Begriffe Z. 975-1015, S. 88-89 „MSCI SHARI’AH BOARD“, „SHARI'AH EQUITY FUNDS PANEL“, „SUKUK FUND PANEL“
  - flatex Preis- und Leistungsverzeichnis 1300100.pdf, DKB plv_pk_konten.pdf Abschnitt 2
  - Invesco Annual Shariah Compliance Certificate FYE 2025 (invesco.com, PDF, Adresse aus src/data/halalAnlagen.ts Z. 412-417)
  - shariyah.net/cryptocurrencies/bitcoin, africanews.com 2018/01/02, musaffa.com/shariah-compliance, xtb.com/de/zinsen, c24.de/preise, tradersplace.de/konditionen/deine-konditionen
  - Zählung girokontoAnzeige und depotAnzeige aus src/data/vergleichAnzeige.ts per vite-node (Feld zinsfreiAbStart ungleich „gut“)
---

# Halal-Prüfzeile: Portfolio-Plan, Runde 2

Geprüft wird nur, ob jeder Beleg seine Aussage trägt. Kein eigenes Urteil, ob etwas halal ist. Namen mit „Islamic“ zählen nicht als Aussage.

| Kennung oder Zitat | direkt oder mittelbar | Beleg | trägt, trägt nicht oder fehlt | Grund |
|---|---|---|---|---|
| S-b3cfaf2d „Ich habe gerankt, welche Anbieter zinsfrei sind.“ | direkt | brokerVergleich.ts, Feld quellen.zinsfreiAbStart; flatex 1300100.pdf | trägt | flatex-PDF Z. 38: „Guthabenzins 0,00 % p. a.“, Seite des Anbieters. Das Feld zinsfreiAbStart mit Anbieter-Quelle je Angebot gibt es in den Daten. |
| S-8316f5b2 „Etwa jedes achte Girokonto in meinem Vergleich zahlt dir Zinsen auf dein Guthaben.“ | direkt | c24.de/preise; girokontoVergleich.ts | trägt | c24.de/preise: „0,75 % Zinsen p.a. auf das Girokonto“ (Anbieter). Nachgezählt: girokontoAnzeige 7 von 54 nicht zinsfrei, 1 zu 7,7, also etwa jedes achte. |
| „Bei den meisten davon läuft das automatisch.“ | mittelbar (Zinsen, kein Wort der Liste) | Begleitdatei, Zeile „Ohne Wort der Liste“: girokontoVergleich.ts, C24- und BBVA-Kundenservice | trägt | In den Daten: C24 Smart, Plus, Max „wird automatisch verzinst“, BBVA „nicht möglich, … abzulehnen“, Wise „automatically enrolled“: 5 von 7. Schriftliche Auskünfte der Anbieter selbst. |
| S-80e26077 „Girokonten ohne Zinsen ansehen“ | direkt | dok.dkb.de/pdf/plv_pk_konten.pdf, Abschnitt 2 | trägt | DKB-PDF Abschnitt 2 „Einlagen auf Konten“: „für Guthaben auf dem Girokonto … 0,00% p. a.“ (Anbieter). |
| S-f7e966c3 „iShares USD Sukuk, mit eigenem Shariah-Gremium und Fatwa.“ | direkt | iShares II plc Prospekt, Sukuk Fund Panel | trägt | Z. 1015: „"Sukuk Fund", iShares $ Sukuk UCITS ETF.“ S. 88-89: „The Sukuk Fund Panel has issued a Fatwa in respect of the Sukuk Fund.“ Panel aus Amanie Advisors, Vorsitz Elgari. |
| „Invesco Physical Gold, mit jährlichem Shariah-Zertifikat.“ | mittelbar (Shariah-Zertifikat, „Shariah“ trifft das Muster scharia\w* nicht) | in der Begleitdatei keiner; auf der Seite nur der Name „Invesco Physical Gold ETC, Shariah-Zertifikat 2025“ | fehlt | Der Beleg existiert und trägt: Invesco-PDF (Adresse in src/data/halalAnlagen.ts Z. 415) „ANNUAL SHARIAH COMPLIANCE CERTIFICATE, FINANCIAL YEAR END 2025“, Amanie Advisors, 01-June-2026, „The Certificates audited include: Invesco Physical Gold ETC“. Er steht aber nicht in der Begleitdatei, also nicht in Belegform. |
| „Ein Shariah-Gremium prüft jedes Quartal und sortiert aus, was nicht passt.“ | mittelbar (Shariah-Prüfung, kein Wort der Liste) | in der Begleitdatei keiner | fehlt | Der Prospekt trägt die Aussage, S. 88 „MSCI SHARI’AH BOARD“: „deemed to be compliant with Shari’ah by a board appointed by MSCI …, and will be reviewed on a quarterly basis by the MSCI Shari’ah Board“. Achtung für den Wortlaut: Das ist das Gremium des Indexanbieters MSCI, nicht das eigene Gremium des Fonds; laut Prospekt S. 88 ist das Fonds-Gremium ausdrücklich nicht zuständig für „determining which securities form the underlying constituents of any index“. „Ein Shariah-Gremium“ ist damit richtig, der Beleg fehlt nur in der Begleitdatei. |
| S-a0ac41bb „iShares MSCI World Islamic, mit eigenem Shariah-Gremium und Fatwa.“ | direkt | iShares II plc Prospekt, Shari'ah Equity Funds Panel | trägt | Z. 975-976: Shari'ah Equity Funds umfassen „iShares MSCI World Islamic UCITS ETF“. S. 88: Panel „appointed by the Investment Manager“; „The Shari'ah Equity Funds Panel has issued a Fatwa in respect of the Shari'ah Equity Funds.“ |
| „Jede braucht ihre eigene Prüfung. Geprüft wird jede Firma einzeln, nach Umsatz und Schulden.“ | mittelbar | Begleitdatei: musaffa.com/shariah-compliance | trägt | Seite geöffnet: „We check the proportion of a company's total revenue that is generated from non-permissible (haram) activities“ und „… total debt that is interest-based“. Der Satz beschreibt die Prüfweise, er sagt nicht, dass eine Firma bestanden hat. |
| S-fa8d7710 „Gelehrte sind uneins: Das Shariyah Review Bureau fand bei Bitcoin nichts, was gegen die Scharia spricht.“ | direkt | shariyah.net/cryptocurrencies/bitcoin; africanews als Gegenposition | trägt | Wörtlich auf der Seite: „nothing has come to our attention that causes us to believe that Bitcoin is in breach of Sharia“. Der Text nennt es nicht Fatwa oder Zertifikat; die Seite selbst sagt „by no means a fatwa“. Uneinigkeit ist mit der Gegenposition belegt. |
| „Der Großmufti von Ägypten verbot den Handel damit 2018.“ | direkt (Gelehrtenposition, kein Wort der Liste) | Begleitdatei: africanews.com, 02.01.2018 | trägt | Wörtlich: „The Grand Mufti of Egypt has explicitly prohibited trading in Bitcoin“, Artikel vom 02.01.2018 laut Adresse. Wiedergabe einer Nachricht, kein eigenes Urteil. |
| S-8d6d3b1e „Etwa jedes fünfte Depot in meinem Vergleich verzinst dein Guthaben, oft automatisch.“ | direkt | xtb.com/de/zinsen | trägt | XTB: „Die Verzinsung wird automatisch aktiviert, es sind keine weiteren Schritte erforderlich.“ (Anbieter). Nachgezählt: depotAnzeige 5 von 27, 1 zu 5,4; bei 1822direkt, HVB (2), ING, XTB entsteht das verzinste Konto laut Anbieter-Zitat mit der Eröffnung. |
| S-b594ae6e „Damit Muslime es einfach haben, habe ich gerankt, welche Anbieter zinsfrei sind.“ | direkt | brokerVergleich.ts; tradersplace.de | trägt | tradersplace: „Guthabenzinssatz 0% p.a.“ beim EUR-Verrechnungskonto (Anbieter). |
| S-a1ea1096 „Prüf, ob deins Zinsen zahlt“ | direkt | xtb.com/de/zinsen; brokerVergleich.ts | trägt | Aufforderung; dass Depots verzinsen, belegt der XTB-Satz vom Anbieter. |
| S-d4c52573 „Girokonto ohne Zinsen“ (Plan In 1 Jahr) | direkt | DKB-PDF Abschnitt 2 | trägt | wie S-80e26077. |
| Titel „Dein Portfolio als Muslim in vier Schritten“ | mittelbar (Plan für Muslime) | keiner, Begleitdatei begründet nur den Wortlaut | trägt | Der Titel sagt kein halal. Jeder Baustein ist entweder mit Shariah-Gremium oder Zertifikat belegt oder der Text nennt die offene Frage selbst („Gelehrte sind uneins“, „Jede braucht ihre eigene Prüfung“). Trägt erst ganz, wenn der Gold-Beleg in der Begleitdatei steht. |

Zu tun, damit es grün wird: in `portfolio-plan.belege.md` zwei Zeilen ergänzen, Wortlaut im Text bleibt.

- „Ohne Wort der Liste, trotzdem belegt: „Beispiel: Invesco Physical Gold, mit jährlichem Shariah-Zertifikat.“ Beleg: https://www.invesco.com/content/dam/invesco/emea/en/product-documents/etf/fund/ssb-certificate/invesco-physical-gold-and-silver-etc_ssb-certficate_en_2025.pdf, „ANNUAL SHARIAH COMPLIANCE CERTIFICATE … FINANCIAL YEAR END 2025“, „The Certificates audited include: Invesco Physical Gold ETC“, 28.10.2026“
- „Ohne Wort der Liste, trotzdem belegt: „Ein Shariah-Gremium prüft jedes Quartal und sortiert aus, was nicht passt.“ Beleg: https://www.blackrock.com/ch/individual/en/literature/prospectus/ishares-ii-plc-prospectus-en.pdf, S. 88 „MSCI SHARI’AH BOARD“: „will be reviewed on a quarterly basis by the MSCI Shari’ah Board“, 28.10.2026“

Urteil Halal-Prüfzeile: rot: zwei mittelbare Aussagen ohne Beleg in der Begleitdatei (jährliches Shariah-Zertifikat Invesco Physical Gold, quartalsweise Prüfung durch ein Shariah-Gremium); die Belege gibt es und sie tragen, sie müssen nur als Zeile in portfolio-plan.belege.md stehen.
