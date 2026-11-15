import { findPartnerLink } from "@/data/partnerLinks";
import { istLeerQuelle, startLink } from "@/data/startLinks";
import { direktLinkAus } from "@/lib/direktLink";

/**
 * Wohin /out/<kurzname><search> führt, ohne investmentStart.ts zu laden. Gibt den fertigen Link zum Anbieter zurück
 * oder null, wenn der Router übernimmt: Link inaktiv oder unbekannt, Ziel ist eine Seite bei uns, oder „Depot da,
 * noch leer“ (dmleer…, braucht die Startseite mit den drei Schritten). Out.tsx und der Knopf-Sprung
 * (src/lib/partnerKlick.ts) fragen beide hier, so gibt es die Regel nur einmal.
 */
export const outZiel = (kurzname: string | undefined, search: string): { ziel: string; direkt: boolean } | null => {
  const eintrag = findPartnerLink(kurzname);
  if (!eintrag?.aktiv) return null;
  const link = startLink(kurzname);
  const src = new URLSearchParams(search).get("src");
  // RK1 (14.11.2026): direkt zum Anbieter, ohne Video-Seite dazwischen.
  if (link && !istLeerQuelle(src)) return { ziel: direktLinkAus(link, search), direkt: true };
  if (!/^https?:\/\//i.test(eintrag.ziel)) return null;
  // Vorhandene Abfrageparameter unverändert anhängen (z. B. ?src=...)
  const params = search.startsWith("?") ? search.slice(1) : search;
  const trenner = eintrag.ziel.includes("?") ? "&" : "?";
  return { ziel: params ? `${eintrag.ziel}${trenner}${params}` : eintrag.ziel, direkt: false };
};

export const anbieterName = (kurzname?: string): string | undefined => findPartnerLink(kurzname)?.anbieter;
