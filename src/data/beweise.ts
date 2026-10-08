import { depotAnzeige, girokontoAnzeige, kryptoAnzeige, screenerAnzeige, steuerAnzeige } from "@/data/vergleichAnzeige";

/**
 * Zahlen für die Beweisleiste der Danke-Seite (Vorbild SKAILE, Vault raw
 * 2026-09-26-doomscroll-web/bilder/skaile-danke-02). Nur Zahlen mit Quelle, keine Sterne:
 * Es gibt keine Bewertungen (BGH I ZR 143/23).
 */

/**
 * Follower von @finanz.muslim. Quelle: Vault `data/ig-history.csv`, Zeile vom 08.10.2026
 * (13.877, Instagram Graph API). Abgerundet, damit die Zahl auch morgen noch stimmt. Elias will
 * „über 14.000“ (Vault raw 2026-10-08-elias-funnel-instagram-zahl-und-bekannte-logos.md): umstellen,
 * sobald die Messung 14.000 zeigt.
 */
export const instagramFollower = "13.800";

/**
 * Alle Anbieter, die die Vergleiche zeigen, jedes Haus einmal (gleiche Domain, gleiches Haus).
 * Gezählt wird die Anzeige, nicht die Datendatei: Die Zahl stimmt mit dem überein, was der
 * Besucher im Vergleich findet, und wächst mit jedem Beleg. Ohne den Edelmetall-Vergleich: Der
 * vergleicht Produktformen (Barren, Sparplan, ETC), keine Anbieter.
 */
export const anbieterZahl = new Set(
  [...depotAnzeige, ...girokontoAnzeige, ...kryptoAnzeige, ...steuerAnzeige, ...screenerAnzeige].map((a) =>
    (("domain" in a && a.domain) || a.name).trim().toLowerCase(),
  ),
).size;

/** Die Vergleichsseiten, die es gibt, fürs Laufband „Vergleiche für“. */
export const vergleichsSeiten = [
  { name: "Depot", pfad: "/vergleich/depot" },
  { name: "Girokonto", pfad: "/vergleich/girokonto" },
  { name: "Krypto", pfad: "/vergleich/krypto" },
  { name: "Edelmetalle", pfad: "/vergleich/edelmetalle" },
  { name: "Steuersoftware", pfad: "/vergleich/steuersoftware" },
  { name: "Prüf-Apps", pfad: "/vergleich/screening-apps" },
];
