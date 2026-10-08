import { brokerVergleich } from "@/data/brokerVergleich";
import { girokontoVergleich } from "@/data/girokontoVergleich";
import { kryptoVergleich } from "@/data/kryptoVergleich";
import { screenerVergleich } from "@/data/screenerVergleich";
import { steuersoftwareVergleich } from "@/data/steuersoftwareVergleich";

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
 * Alle Anbieter aus den Vergleichen, jedes Haus einmal. Wächst mit den Daten. Ohne den
 * Edelmetall-Vergleich: Der vergleicht Produktformen (Barren, Sparplan, ETC), keine Anbieter.
 */
export const anbieterZahl = new Set(
  [
    ...brokerVergleich,
    ...girokontoVergleich,
    ...kryptoVergleich,
    ...steuersoftwareVergleich,
    ...screenerVergleich,
  ].map((a) => a.name.trim().toLowerCase()),
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
