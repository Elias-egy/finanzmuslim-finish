/**
 * Anmeldung über die Opt-in-Karte (Guide und die Vorlagen hinter der Schranke).
 *
 * Schritt 1 postet einmal JSON an das Make-Szenario „finanzmuslim Opt-in-Karte“ (7640717).
 * Make legt die Adresse in die MailerLite-Gruppe des Freebies (Guide: „Guide-Eingang“, die
 * Automation „Guide-Verteiler“ kopiert nach 15 Minuten in die Stufen-Gruppe) und antwortet nur
 * mit einem Zufallsschlüssel, den Make beim Abonnenten ablegt. Kein Status und keine ID: Sonst
 * könnte jeder mit einer fremden Adresse abfragen, ob sie schon bestätigte Leserin ist
 * (Security-Review 27.09.2026). Eine Bot-Anfrage (`firma` gefüllt) oder eine Anfrage ohne
 * Einwilligung verwirft Make, dann kommt nur „Accepted“ zurück.
 *
 * Die Klickfragen danach gehen an ein zweites Szenario („Opt-in Nachtrag“). Es schreibt nur
 * Felder und nur, wenn der Schlüssel zur Adresse passt. Ein zweites „Create/Update“ würde bei
 * unbestätigten Adressen eine zweite Bestätigungsmail auslösen (getestet 27.09.2026).
 *
 * Die zwei alten Szenarien (6105836 Guide, 7427792 Vorlagen) laufen bis zum Launch weiter,
 * sie bedienen die Live-Seite.
 */
import { quelleAusPfad, spracheAus, type Sprache } from "@/lib/anmeldung";

export const OPTIN_WEBHOOK = "https://hook.eu1.make.com/dfaovmwbhhnd7wtdgfwkdf82inyyk820";
export const NACHTRAG_WEBHOOK = "https://hook.eu1.make.com/di13npa7ith0tguzhc954mint11yje1i";

/**
 * Fassung des Einwilligungstexts auf der Karte. Neue Fassung, neuer Wert. Seit 09.10.2026 ein
 * Satz für alle Karten, ohne den Namen des Freebies (`EINWILLIGUNG_TEXT` in `OptinKarte.tsx`).
 */
export const EINWILLIGUNG = "karte-2026-10-09";

export type Stufe = "einsteiger" | "fortgeschritten" | "profi";

/** Die erste Frage des Vergleichs-Assistenten, dieselben Werte (`src/data/vergleichAssistent.ts`). */
export type Vorhaben = "anlegen" | "konto" | "steuer";
export const VORHABEN: Vorhaben[] = ["anlegen", "konto", "steuer"];

export type OptinDaten = {
  email: string;
  vorname: string;
  freebie: string;
  quelle: string;
  sprache: Sprache;
  firma: string;
  einwilligung: string;
};

export type Anmeldung = { token?: string };

/**
 * Woher jemand kommt. Aus einer Instagram-DM (`?src=dmaktie`) wird `dm:aktie`, aus dem
 * alten allgemeinen `dm` wird `dm:allgemein`, sonst die Seite, auf der das Formular stand.
 */
export const quelleFuer = (pfad: string, src: string | null | undefined) => {
  if (src === "dm") return "dm:allgemein";
  if (src && /^dm[a-z0-9]+$/.test(src)) return `dm:${src.slice(2)}`;
  return quelleAusPfad(pfad);
};

export const optinDaten = ({
  email,
  vorname,
  freebie,
  pfad,
  src,
  lang,
  firma,
  einwilligung = EINWILLIGUNG,
}: {
  email: string;
  vorname: string;
  freebie: string;
  pfad: string;
  src?: string | null;
  lang: string | undefined;
  firma: string;
  /** Wer wiederkommt, schickt die Fassung mit, die er damals angehakt hat (`src/lib/merken.ts`). */
  einwilligung?: string;
}): OptinDaten => ({
  email: email.trim(),
  vorname: vorname.trim(),
  freebie,
  quelle: quelleFuer(pfad, src),
  sprache: spracheAus(lang),
  firma,
  einwilligung,
});

type FetchFn = (url: string, init: RequestInit) => Promise<Pick<Response, "ok" | "status" | "text">>;

const TOKEN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

/** Liest die Antwort von Make. Was nicht passt, fällt weg, statt die Karte aufzuhalten. */
export const anmeldungAus = (text: string): Anmeldung => {
  try {
    const d = JSON.parse(text) as { token?: unknown };
    return typeof d.token === "string" && TOKEN.test(d.token) ? { token: d.token } : {};
  } catch {
    return {};
  }
};

export const optinAnmelden = async (daten: OptinDaten, fetchFn: FetchFn = fetch): Promise<Anmeldung> => {
  const res = await fetchFn(OPTIN_WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(daten),
  });
  if (!res.ok) throw new Error(`Webhook ${res.status}`);
  return anmeldungAus(await res.text());
};

/** Mehrfachauswahl als feste, kommagetrennte Liste, wie Make sie prüft. */
export const vorhabenListe = (auswahl: readonly string[]) => VORHABEN.filter((v) => auswahl.includes(v)).join(",");

/**
 * `abonnent` ist die E-Mail-Adresse aus Schritt 1, Make sucht den Abonnenten darüber. Die leeren
 * Felder in den ersten Tests (27.09.2026) kamen vom Testskript (kaputter Content-Type).
 */
export type Nachtrag = { abonnent: string; token: string; freebie: string; stufe?: Stufe; vorhaben?: readonly string[] };

/** Der Inhalt des Nachtrags, oder `null`, wenn es nichts nachzutragen gibt. */
export const nachtragDaten = ({ abonnent, token, freebie, stufe, vorhaben = [] }: Nachtrag) => {
  const liste = vorhabenListe(vorhaben);
  if (!stufe && !liste) return null;
  return { abonnent, token, freebie, stufe: stufe ?? "", vorhaben: liste };
};

/**
 * Trägt Stufe und Vorhaben nach. Scheitert es, merkt es niemand: Die Adresse ist schon
 * gespeichert, und ohne Stufe gilt beim Guide der Einsteiger.
 */
export const optinNachtragen = async (n: Nachtrag, fetchFn: FetchFn = fetch): Promise<boolean> => {
  const daten = nachtragDaten(n);
  if (!daten) return false;
  try {
    const res = await fetchFn(NACHTRAG_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(daten),
    });
    return res.ok;
  } catch {
    return false;
  }
};
