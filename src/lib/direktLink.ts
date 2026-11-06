import type { StartPartner } from "@/data/investmentStart";
import { SRC_STORAGE_KEY, istGueltigeQuelle } from "@/lib/attribution";

/**
 * Zwischenseite nur, wo ein Video ist (Elias, 05.11.2026, H16: „Die Zwischenseite generell raus bei überall, wo kein
 * Video ist … Bei Depot gucken wir noch“). Seit 06.11.2026 („Lass das erstmal weg, dass du das bei jeder Webseite
 * entfernst“) nutzt nur /vorlagen/girokonto-bonus den Direktlink; /out/<kurzname> bleibt wie vorher.
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

/**
 * Werbeblocker verstecken auf jeder Seite jeden Link, der mit https://www.financeads.net/tc.php? beginnt (EasyList,
 * Standard in uBlock Origin, Adblock Plus, Brave und Opera: `##a[href^="https://www.financeads.net/tc.php?"]`). Am
 * Laptop fehlte darum der Knopf zum Eröffnen ganz (Elias, 06.11.2026, Smartbroker+). Gesperrt ist nur das Aussehen
 * des Links, nicht der Aufruf: Der Knopf zeigt auf /weiter/<kurzname> und öffnet beim Klick den echten Link.
 */
export const imBlocker = (href: string): boolean => /^https?:\/\/(www\.)?financeads\.net\/tc\.php\?/i.test(href);

export const blockerFest = (
  kurzname: string,
  ziel: string,
  neuerTab: boolean,
): { href: string; oeffnen?: (e: { preventDefault: () => void; button: number; metaKey: boolean; ctrlKey: boolean; shiftKey: boolean; altKey: boolean }) => void } => {
  if (!imBlocker(ziel)) return { href: ziel };
  return {
    href: `/weiter/${kurzname}`,
    oeffnen: (e) => {
      // Mittelklick und Tasten mit Klick öffnen /weiter/<kurzname>, das selbst weiterleitet.
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      if (neuerTab) window.open(ziel, "_blank", "noopener");
      else window.location.assign(ziel);
    },
  };
};
