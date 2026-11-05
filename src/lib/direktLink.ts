import type { StartPartner } from "@/data/investmentStart";
import { SRC_STORAGE_KEY, istGueltigeQuelle } from "@/lib/attribution";

/**
 * Zwischenseite nur, wo ein Video ist (Elias, 05.11.2026, H16: „Die Zwischenseite generell raus bei überall, wo kein
 * Video ist … Bei Depot gucken wir noch“). Depots behalten ihre Startseite mit Video, alle anderen Arten (Girokonto,
 * Krypto, Steuer, App) gehen von /out/<kurzname> direkt auf den Affiliate-Link.
 */
export const ohneZwischenseite = (partner: StartPartner): boolean => partner.art !== "depot";

/**
 * Affiliate-Link mit SubID wie auf der Startseite: Quelle aus ?src, sonst die gemerkte Quelle der Sitzung, sonst
 * „start“. Angehängt wird „d“ für direkt, so wie die Startseite h, f und s für ihre Knöpfe anhängt.
 */
export const direktLink = (partner: StartPartner, search: string): string => {
  const param = new URLSearchParams(search).get("src");
  let gemerkt: string | null = null;
  try {
    gemerkt = sessionStorage.getItem(SRC_STORAGE_KEY);
  } catch {
    gemerkt = null;
  }
  const quelle = istGueltigeQuelle(param) ? param : istGueltigeQuelle(gemerkt) ? gemerkt : "start";
  try {
    sessionStorage.setItem(SRC_STORAGE_KEY, quelle);
  } catch {
    // Ohne Storage gilt die Quelle nur für diesen Aufruf.
  }
  return partner.link.replace("{SUBID}", `${quelle}d`);
};
