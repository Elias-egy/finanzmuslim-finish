/**
 * Länderversionen (DACH1, 23.11.2026, Elias: Vergleiche mit Österreich- und Schweiz-Version, Länderwahl mit Flagge,
 * Besucher aus Österreich und der Schweiz bekommen ihre Version).
 *
 * Entschieden (Vault data/international/KETTE.md Abschnitt 3): gleiche Seite finanzmuslim.com, Länderschalter, eigene
 * Rangfolge und eigene Partnerlinks je Land, alles andere wie heute. Umsetzung: Deutschland bleibt unter den alten
 * Adressen (`/vergleich/depot`), Österreich und Schweiz liegen unter `/at/…` und `/ch/…` (eigene Adresse je Version,
 * damit Google jede Fassung einzeln kennt und `hreflang` sie verbindet).
 *
 * Reine Funktionen ohne React, damit sie auch im Build-Skript und im Test laufen.
 */

export type Land = "de" | "at" | "ch";

export const LAND_LISTE: readonly Land[] = ["de", "at", "ch"];

export type LandInfo = {
  kuerzel: Land;
  name: string;
  /** Mit Artikel nach „für“ und „in“: „Österreich“, „die Schweiz“. */
  mitArtikel: string;
  /** Kurz am Handy neben der Flagge. */
  kurz: string;
  /** Vorsatz der Adresse, Deutschland ohne. */
  praefix: "" | "/at" | "/ch";
  /** Sprach- und Regionscode für `hreflang` und `og:locale`. */
  hreflang: "de-DE" | "de-AT" | "de-CH";
  waehrung: "EUR" | "CHF";
};

export const LAENDER: Record<Land, LandInfo> = {
  de: { kuerzel: "de", name: "Deutschland", mitArtikel: "Deutschland", kurz: "DE", praefix: "", hreflang: "de-DE", waehrung: "EUR" },
  at: { kuerzel: "at", name: "Österreich", mitArtikel: "Österreich", kurz: "AT", praefix: "/at", hreflang: "de-AT", waehrung: "EUR" },
  ch: { kuerzel: "ch", name: "Schweiz", mitArtikel: "die Schweiz", kurz: "CH", praefix: "/ch", hreflang: "de-CH", waehrung: "CHF" },
};

/** Welches Land eine Adresse meint: `/at/…` Österreich, `/ch/…` Schweiz, alles andere Deutschland. */
export const landAusPfad = (pfad: string): Land => {
  if (pfad === "/at" || pfad.startsWith("/at/")) return "at";
  if (pfad === "/ch" || pfad.startsWith("/ch/")) return "ch";
  return "de";
};

/** Die deutsche Grundadresse: `/at/vergleich/depot` wird `/vergleich/depot`. */
export const ohneLandPraefix = (pfad: string): string => {
  const land = landAusPfad(pfad);
  if (land === "de") return pfad;
  const rest = pfad.slice(LAENDER[land].praefix.length);
  return rest === "" ? "/" : rest;
};

/** Dieselbe Seite in einem anderen Land: `landPfad("/vergleich/depot", "at")` ist `/at/vergleich/depot`. */
export const landPfad = (pfad: string, land: Land): string => {
  const grund = ohneLandPraefix(pfad);
  if (land === "de") return grund;
  return grund === "/" ? LAENDER[land].praefix : `${LAENDER[land].praefix}${grund}`;
};

/* ------------------------------------------------------------------ Merken (Cookie) */

/** Name des Cookies, in dem die Wahl des Besuchers steht. Nur die Wahl, nie eine Kennung. */
export const LAND_COOKIE = "fm_land";
/** Ein Jahr in Sekunden. */
const EIN_JAHR = 60 * 60 * 24 * 365;

export const istLand = (wert: unknown): wert is Land => wert === "de" || wert === "at" || wert === "ch";

/** Liest die gemerkte Wahl aus einem Cookie-String (`document.cookie`). */
export const landAusCookie = (cookie: string): Land | null => {
  for (const teil of cookie.split(";")) {
    const [name, ...rest] = teil.trim().split("=");
    if (name === LAND_COOKIE) {
      const wert = rest.join("=");
      return istLand(wert) ? wert : null;
    }
  }
  return null;
};

/** Der Cookie-Text für `document.cookie`. SameSite=Lax, ein Jahr, nur die Länderwahl. */
export const landCookieText = (land: Land): string => `${LAND_COOKIE}=${land}; Path=/; Max-Age=${EIN_JAHR}; SameSite=Lax`;

export const merkeLand = (land: Land): void => {
  try {
    document.cookie = landCookieText(land);
  } catch {
    /* Cookies gesperrt: die Wahl gilt nur für diese Seite, nichts geht kaputt. */
  }
};

export const gemerktesLand = (): Land | null => {
  try {
    return landAusCookie(document.cookie);
  } catch {
    return null;
  }
};

/* ------------------------------------------------------------------ Erkennen */

/**
 * Crawler, Vorschau-Programme und das Prerendering beim Build werden nie umgeleitet. Google kommt aus den USA und sähe
 * sonst nie die deutsche Seite; Vorschaukarten (WhatsApp, Telegram) und der Build brauchen genau die Seite, die in der
 * Adresse steht.
 */
export const istRobot = (userAgent: string, webdriver = false): boolean =>
  webdriver ||
  /bot|crawl|spider|slurp|facebookexternalhit|whatsapp|telegram|preview|lighthouse|pagespeed|headless|prerender|puppeteer|chrome-lighthouse/i.test(
    userAgent,
  );

/**
 * Welches Land der Browser nahelegt, ohne dass eine Adresse an einen Dritten geht: zuerst die Region der Sprache
 * (`de-AT`, `de-CH`), dann die Zeitzone (Europa/Wien, Europa/Zürich). Eine Erkennung nach IP-Adresse braucht einen Server
 * davor (Cloudflare) und steht im Plan als zweiter Schritt. Ist nichts eindeutig, gilt Deutschland.
 */
export const erkenneLand = (sprachen: readonly string[], zeitzone: string | null | undefined): Land => {
  for (const s of sprachen) {
    const region = s.toLowerCase();
    if (region === "de-at") return "at";
    if (region === "de-ch" || region === "de-li") return "ch";
  }
  if (zeitzone === "Europe/Vienna") return "at";
  if (zeitzone === "Europe/Zurich" || zeitzone === "Europe/Vaduz") return "ch";
  return "de";
};

/** Merkzettel für „diese Sitzung wurde schon geprüft“, damit die Zurück-Taste nie gefangen wird. */
export const SITZUNG_GEPRUEFT = "fm_land_geprueft";
/** Merkzettel für „diese Sitzung wurde automatisch umgestellt“, der Hinweis unter der Länderwahl liest ihn. */
export const SITZUNG_AUTO = "fm_land_auto";

/**
 * Entscheidet, ob ein Besucher auf einer deutschen Vergleichsseite zur Länderversion gehört.
 * Reine Entscheidung ohne Nebenwirkung; `LandErkennung` führt sie aus.
 *
 * - Eine gemerkte Wahl gewinnt immer (auch `de`: wer Deutschland gewählt hat, bleibt dort).
 * - Ohne Wahl entscheidet die Erkennung.
 * - Nie bei Robotern, nie wenn die Sitzung schon geprüft wurde, nie wenn die Länderversion noch keine Daten hat.
 */
export const zielLand = (opt: {
  aktuell: Land;
  gemerkt: Land | null;
  erkannt: Land;
  robot: boolean;
  schonGeprueft: boolean;
  verfuegbar: (land: Land) => boolean;
}): Land | null => {
  if (opt.robot || opt.schonGeprueft || opt.aktuell !== "de") return null;
  const wunsch = opt.gemerkt ?? opt.erkannt;
  if (wunsch === "de" || !opt.verfuegbar(wunsch)) return null;
  return wunsch;
};
