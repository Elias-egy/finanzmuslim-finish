# amanah-landing-elegant — Regeln für jede Session

**Kontext & Specs:** `~/Desktop/Webseite/00_START_HIER.md` ist der Wegweiser.
Für Arbeit an /dein-investmentstart gilt ausschließlich
`~/Desktop/Webseite/UMSETZUNG/A1_INVESTMENTSTART_MASTERSPEC.md`.

## Arbeitsweise (wie mit Elias gearbeitet wird)

- **Schritt für Schritt:** EIN Schritt → Elias' Go/Screenshot abwarten → nächster.
- **Kurz antworten** (max. ~8 Zeilen): was passiert ist + nächster Schritt.
- **Nichts ungefragt ändern.** Auffälligkeiten = 1 Satz Hinweis, nicht ausführen.
- Texte aus den Specs wortwörtlich übernehmen — nicht „verbessern".

## Technik (Stand 11. Juli 2026)

- Vite/React/Tailwind/shadcn · Lovable↔GitHub-Sync über `main` (Account Elias-egy).
- **Vor jeder Arbeit `git pull`.** Keine parallelen Lovable-Prompts auf dieselbe Datei.
- Repo nie umbenennen/verschieben (bricht den Lovable-Sync permanent).
- Preview: `npm run dev` → Port 8080.
- **NICHT in Lovable publishen** — Live-Schaltung erst Phase C nach Scalable-Freigabe.
- noindex via react-helmet-async (nur /dein-investmentstart); robots.txt NICHT auf
  Disallow (noindex braucht Crawl-Zugriff).
- Scalable-Deeplink lebt als EINE Konstante am Anfang von InvestmentStart.tsx
  (aktuell Platzhalter); subid-Whitelist: g1/g2/g3/m1/m2/m3/dm/dmstart/bio/yt/qr/start.
- Offen auf der Seite: Deeplink, Video, PDF; Riba-Checkliste auf 2 Punkte kürzen
  (Fakten-Check 11.7.: Verrechnungskonto-Punkt gestrichen — siehe A1-Spec S6).

## Compliance (nicht verhandelbar)

- Keine Anlageempfehlung; Broker-Empfehlung Scalable ok.
- Kennzeichnung „Werbung/Affiliate-Link" VOR jedem Button; Risiko-Zeile gleiche
  Schriftgröße; Scalable-Standard-Disclaimer wortgleich (A1 §S10).
- Keine erfundenen Testimonials. Domain immer amanah-invest.de.
