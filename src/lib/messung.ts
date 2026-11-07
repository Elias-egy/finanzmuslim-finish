// Messung mit Einwilligung (CV2, 04.11.2026, Elias: „Ich will jedes Tracking, was wichtig sein könnte“).
// PostHog EU (Frankfurt) lädt erst nach „Akzeptieren“ im Banner. Ohne Schlüssel bleibt alles aus,
// dann erscheint auch kein Banner. Gezählt werden Seiten, jeder Klick (autocapture), Herkunft,
// Aufnahmen mit verdeckten Eingabefeldern und die festen Ereignisse unten.
import type { PostHog } from "posthog-js";
import { gemerkteKampagne, gemerkteQuelle, gemerkteStelle } from "@/lib/attribution";

/** Projekt-Schlüssel aus eu.posthog.com (öffentlich, beginnt mit phc_). Leer: keine Messung, kein Banner. */
export const POSTHOG_SCHLUESSEL = "phc_mczwwWCDJH2pb8x7o9vpKhgCTzt694E3NHEZieQvELPY";
const POSTHOG_HOST = "https://eu.i.posthog.com";

const SPEICHER = "fm-einwilligung";
/** Fassung des Bannertexts; ändert sie sich, fragt das Banner neu. */
export const EINWILLIGUNG_FASSUNG = "2026-11-04";

export type Wahl = "ja" | "nein";

/** Die festen Namen der Ereignisse; ein neuer Name kommt hier dazu, nicht frei im Code. */
export type Ereignis =
  | "partner_klick"
  | "video_start"
  | "video_viertel"
  | "video_ende"
  | "ton_an"
  | "quiz_frage"
  | "quiz_ergebnis"
  | "quiz_neu"
  // CV4 (04.11.2026): Kasten „Dein nächster Schritt“ am Ende eines Freebies kam ins Bild; Wechsel auf einen Vergleich.
  | "freebie_ende"
  | "vergleich_klick"
  // CV-LEER (06.11.2026): Fassung „Depot da, noch leer“ der Startseite, Klick auf „Halal-ETFs ansehen“.
  | "leer_klick";

const speicher = (): Storage | null => {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
};

export const messungAktiv = (): boolean => POSTHOG_SCHLUESSEL.startsWith("phc_");

export const leseWahl = (): Wahl | null => {
  try {
    const roh = speicher()?.getItem(SPEICHER);
    if (!roh) return null;
    const d = JSON.parse(roh) as { wahl?: string; fassung?: string };
    if (d.fassung !== EINWILLIGUNG_FASSUNG) return null;
    return d.wahl === "ja" || d.wahl === "nein" ? d.wahl : null;
  } catch {
    return null;
  }
};

let ph: PostHog | null = null;
const warteschlange: [Ereignis, Record<string, string | number | boolean>][] = [];

/** Quelle (?src) und Mail-Kampagne (utm_campaign) an jedes Ereignis hängen; auch nach einem späteren ?src. */
export const merkeHerkunft = (): void => {
  if (!ph) return;
  const quelle = gemerkteQuelle();
  const stelle = gemerkteStelle();
  const mail_kampagne = gemerkteKampagne();
  ph.register({ ...(quelle ? { quelle } : {}), ...(stelle ? { stelle } : {}), ...(mail_kampagne ? { mail_kampagne } : {}) });
};
let laedt: Promise<void> | null = null;

/** Lädt PostHog, wenn eingewilligt wurde. Mehrfacher Aufruf ist harmlos. */
export const starteMessung = (): Promise<void> => {
  if (!messungAktiv() || leseWahl() !== "ja" || typeof window === "undefined") return Promise.resolve();
  if (laedt) return laedt;
  laedt = import("posthog-js").then(({ default: posthog }) => {
    posthog.init(POSTHOG_SCHLUESSEL, {
      api_host: POSTHOG_HOST,
      ui_host: "https://eu.posthog.com",
      person_profiles: "identified_only",
      capture_pageview: "history_change",
      capture_pageleave: true,
      autocapture: true,
      enable_heatmaps: true,
      persistence: "localStorage+cookie",
      session_recording: { maskAllInputs: true },
    });
    ph = posthog;
    merkeHerkunft();
    // Was vor dem Laden geschah (Seitenwechsel, Kasten im Bild), geht jetzt raus.
    for (const [name, eigenschaften] of warteschlange.splice(0)) ereignis(name, eigenschaften);
  });
  return laedt;
};

export const setzeWahl = (wahl: Wahl): void => {
  try {
    speicher()?.setItem(SPEICHER, JSON.stringify({ wahl, fassung: EINWILLIGUNG_FASSUNG, tag: new Date().toISOString().slice(0, 10) }));
  } catch {
    /* Ohne Speicher fragt das Banner beim nächsten Besuch neu. */
  }
  if (wahl === "ja") {
    void starteMessung();
  } else if (ph) {
    // Widerruf: nichts mehr senden und die Kennung von PostHog vom Gerät nehmen.
    ph.opt_out_capturing();
    ph.reset();
  }
};

/** Ein festes Ereignis senden; ohne Einwilligung passiert nichts. Per Beacon, damit es auch beim Verlassen ankommt. */
export const ereignis = (name: Ereignis, eigenschaften: Record<string, string | number | boolean> = {}): void => {
  if (ph) ph.capture(name, eigenschaften, { transport: "sendBeacon" });
  else if (messungAktiv() && leseWahl() === "ja" && warteschlange.length < 20) warteschlange.push([name, eigenschaften]);
};

let seiteJetzt = "";
let seiteDavor = "";
/** Vom Router bei jedem Seitenwechsel gerufen; so weiß ein Partnerklick, von welcher Seite er kam. */
export const merkeSeite = (pfad: string): void => {
  if (pfad === seiteJetzt) return;
  seiteDavor = seiteJetzt;
  seiteJetzt = pfad;
  if (!seiteDavor && typeof document !== "undefined") {
    // Voller Seitenaufruf (Link mit neuem Laden): die Seite davor steht nur im Referrer.
    try {
      const r = new URL(document.referrer);
      if (r.host === window.location.host) seiteDavor = r.pathname;
    } catch {
      /* kein oder fremder Referrer */
    }
  }
  // Klick in einen Vergleich: von welcher Seite (Freebie, Blog, Startseite) kam der Wechsel.
  if (pfad.startsWith("/vergleich") && seiteDavor && !seiteDavor.startsWith("/vergleich")) {
    ereignis("vergleich_klick", { von: seiteDavor, ziel: pfad });
  }
};
export const vorigeSeite = (): string => seiteDavor;

/** Das Banner öffnet sich erneut (Link „Cookie-Einstellungen“ im Fuß). */
export const BANNER_OEFFNEN = "fm-einwilligung-oeffnen";
export const oeffneBanner = (): void => {
  window.dispatchEvent(new Event(BANNER_OEFFNEN));
};
