import { ereignis } from "@/lib/messung";

/**
 * 50:50-Tests auf der Seite (RN5, 15.11.2026: Aktien-Liste „Meine zwei Nummer 1“ gegen den Halal-Finanz-Check,
 * Perspective-Tipp 41, Elias' Wahl „50:50“). Jeder Besucher bekommt einmal zufällig a oder b und behält es (localStorage),
 * damit er bei jedem Besuch dasselbe sieht. ?ab=a oder ?ab=b in der Adresse zeigt eine Fassung gezielt (zum Ansehen) und
 * merkt sie. Die Zuteilung geht einmal als Ereignis „ab_zuteilung“ an die Messung; Klicks zählen über die Kennung am
 * Knopf (Fassung a: aknr1, aktop3; Fassung b: fcak…).
 */
export type Fassung = "a" | "b";

export const abFassung = (test: string): Fassung => {
  const schluessel = `fm_ab_${test}`;
  let speicher: Storage | null = null;
  try {
    speicher = window.localStorage;
  } catch {
    speicher = null;
  }
  let ausAdresse: string | null = null;
  try {
    ausAdresse = new URLSearchParams(window.location.search).get("ab");
  } catch {
    ausAdresse = null;
  }
  if (ausAdresse === "a" || ausAdresse === "b") {
    try {
      speicher?.setItem(schluessel, ausAdresse);
    } catch {
      /* ohne Speicher bleibt es bei dieser Seite */
    }
    return ausAdresse;
  }
  let gemerkt: string | null = null;
  try {
    gemerkt = speicher?.getItem(schluessel) ?? null;
  } catch {
    gemerkt = null;
  }
  if (gemerkt === "a" || gemerkt === "b") return gemerkt;
  const neu: Fassung = Math.random() < 0.5 ? "a" : "b";
  try {
    speicher?.setItem(schluessel, neu);
  } catch {
    /* ohne Speicher bekommt der Besucher beim nächsten Mal neu gelost */
  }
  ereignis("ab_zuteilung", { test, fassung: neu });
  return neu;
};
