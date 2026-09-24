/**
 * Anmeldung zum Freitagsbrief.
 *
 * Das Formular postet JSON an ein Make-Szenario („finanzmuslim Anmeldung Freitagsbrief“,
 * 7597159). Make legt die Adresse mit `quelle`, `sprache` und `interesse` in die
 * MailerLite-Gruppe „Freitagsbrief: direkt“. Kein API-Schlüssel im Frontend.
 *
 * - `quelle` ist die Seite, auf der sich jemand eingetragen hat, z. B. `web:/rechner/zakat`.
 * - `sprache` kommt aus dem lang-Attribut der Seite (de, tr, ar), sonst de.
 * - `interesse` ist das Anliegen, hier immer `freitagsbrief`. Make verwirft alles andere.
 * - `firma` ist ein Honeypot: Menschen sehen das Feld nicht, Bots füllen es aus.
 *
 * Mit Double Opt-in in MailerLite („Double opt-in for API and integrations“) bekommt
 * jede neue Adresse erst eine Bestätigungsmail.
 */
export const FREITAGSBRIEF_WEBHOOK = "https://hook.eu1.make.com/hrs8hqdbo3n5u0zx5hwx6fthphaksx7f";

export type Sprache = "de" | "tr" | "ar";

export type AnmeldeDaten = {
  email: string;
  quelle: string;
  sprache: Sprache;
  interesse: "freitagsbrief";
  firma: string;
};

export const emailGueltig = (wert: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(wert.trim());

export const quelleAusPfad = (pfad: string) => {
  const ohneSchraegstrich = pfad.replace(/\/+$/, "");
  return `web:${ohneSchraegstrich || "/startseite"}`;
};

export const spracheAus = (lang: string | undefined): Sprache => {
  const kurz = (lang ?? "").slice(0, 2).toLowerCase();
  return kurz === "tr" || kurz === "ar" ? kurz : "de";
};

export const anmeldeDaten = ({
  email,
  pfad,
  lang,
  firma,
}: {
  email: string;
  pfad: string;
  lang: string | undefined;
  firma: string;
}): AnmeldeDaten => ({
  email: email.trim(),
  quelle: quelleAusPfad(pfad),
  sprache: spracheAus(lang),
  interesse: "freitagsbrief",
  firma,
});

type FetchFn = (url: string, init: RequestInit) => Promise<Pick<Response, "ok" | "status">>;

export const freitagsbriefAnmelden = async (daten: AnmeldeDaten, fetchFn: FetchFn = fetch) => {
  const res = await fetchFn(FREITAGSBRIEF_WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(daten),
  });
  if (!res.ok) throw new Error(`Webhook ${res.status}`);
};
