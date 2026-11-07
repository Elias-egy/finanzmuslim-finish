import type { StartPartner } from "@/data/investmentStart";
import { gemerkteQuelle, gemerkteStelle, istGueltigeQuelle, istHerkunft, subIdAus } from "@/lib/attribution";

/**
 * Zwischenseite nur, wo ein Video ist (Elias, 05.11.2026, H16: „Die Zwischenseite generell raus bei überall, wo kein
 * Video ist … Bei Depot gucken wir noch“). Seit 06.11.2026 („Lass das erstmal weg, dass du das bei jeder Webseite
 * entfernst“) nutzt nur /vorlagen/girokonto-bonus den Direktlink; /out/<kurzname> bleibt wie vorher.
 */
export const ohneZwischenseite = (partner: StartPartner): boolean => partner.art !== "depot";

/**
 * Affiliate-Link mit SubID wie auf der Startseite: Herkunft (aus der Adresse oder gemerkt) plus Stelle (das ?src im
 * Aufruf, etwa gbkopf), angehängt „d“ für direkt, so wie die Startseite h, f und s anhängt. Schreibt nichts in den
 * Speicher: Bis CV16F (07.11.2026) überschrieb jeder Knopf beim Zeichnen die Herkunft des ganzen Tabs.
 */
export const direktLink = (partner: StartPartner, search: string): string => {
  const param = new URLSearchParams(search).get("src");
  let ausAdresse: string | null = null;
  try {
    ausAdresse = new URLSearchParams(window.location.search).get("src");
  } catch {
    ausAdresse = null;
  }
  const quelle = istHerkunft(param) ? param : istHerkunft(ausAdresse) ? ausAdresse : gemerkteQuelle();
  const stelle = istGueltigeQuelle(param) && !istHerkunft(param) ? param : gemerkteStelle();
  return partner.link.replace("{SUBID}", `${subIdAus(quelle, stelle)}d`);
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
