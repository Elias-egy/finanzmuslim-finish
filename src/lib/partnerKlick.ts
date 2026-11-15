import { ereignis, jetzigeSeite } from "@/lib/messung";

/**
 * PH4 (16.11.2026, Elias PH3-03: „Die Dazwischenschritt dauert extrem lange vom Knopf auf den Depot-Link“): Jeder
 * Knopf zu /out/<kurzname> springt beim Tippen sofort zum Anbieter. Vorher lud die Seite /out erst drei Teile nach
 * (gut 20 KB), und so lange stand eine leere Seite da: gemessen über eine Handy-Leitung (150 ms, 1,6 Mbit/s) 254 bis
 * 376 ms. Der Knopf bleibt ein normaler Link auf /out: neuer Tab, Mittelklick und ein Tippen, bevor die Tabelle
 * geladen ist, gehen weiter über die Seite /out.
 *
 * Der Lauscher sitzt in der Fangphase am Dokument, vor React. Er ruft nur preventDefault: Der Link von React Router
 * sieht das und navigiert nicht, eigene onClick der Knöpfe laufen trotzdem.
 */
let sprung: typeof import("@/lib/partnerSprung") | null = null;

export const ladePartnerSprung = (): Promise<void> =>
  import("@/lib/partnerSprung").then((m) => {
    sprung = m;
  });

export const partnerKlick = (e: MouseEvent): void => {
  if (!sprung || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
  if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
  let url: URL;
  try {
    url = new URL(a.href);
  } catch {
    return;
  }
  if (url.origin !== window.location.origin) return;
  const treffer = url.pathname.match(/^\/out\/([^/]+)\/?$/);
  if (!treffer) return;
  const kurzname = decodeURIComponent(treffer[1]);
  const ergebnis = sprung.outZiel(kurzname, url.search);
  if (!ergebnis) return;
  e.preventDefault();
  ereignis("partner_klick", {
    anbieter: kurzname,
    weg: "out",
    ...(ergebnis.direkt ? { direkt: true } : {}),
    sofort: true,
    von: jetzigeSeite(),
  });
  window.location.assign(ergebnis.ziel);
};
