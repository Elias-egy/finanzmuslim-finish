/**
 * Anmeldung über die Opt-in-Karte (Guide und die Vorlagen hinter der Schranke).
 *
 * Die Karte postet einmal JSON an ein eigenes Make-Szenario („finanzmuslim Opt-in-Karte“,
 * 7640717). Make legt die Adresse in die MailerLite-Gruppe des Freebies und antwortet mit
 * dem Status der Adresse: `unconfirmed` bei neuen Adressen (Double Opt-in, die
 * Bestätigungsmail geht raus), `active` bei Leuten, die schon bestätigt sind. Wer schon
 * dabei ist, bekommt keine Bestätigungsmail mehr, deshalb zeigt die Danke-Seite ihm den
 * Link sofort. Eine Bot-Anfrage (`firma` gefüllt) verwirft Make ohne Antwort, dann kommt
 * nur „Accepted“ zurück.
 *
 * Die zwei alten Szenarien (6105836 Guide, 7427792 Vorlagen) laufen bis zum Launch weiter,
 * sie bedienen die Live-Seite.
 */
import { quelleAusPfad, spracheAus, type Sprache } from "@/lib/anmeldung";

export const OPTIN_WEBHOOK = "https://hook.eu1.make.com/dfaovmwbhhnd7wtdgfwkdf82inyyk820";

export type Stufe = "einsteiger" | "fortgeschritten" | "profi";

export type OptinDaten = {
  email: string;
  vorname: string;
  freebie: string;
  level?: Stufe;
  quelle: string;
  sprache: Sprache;
  firma: string;
};

/**
 * `sofort`: schon bestätigt oder abgemeldet, es kommt keine Bestätigungsmail, der Link
 * steht deshalb direkt auf der Danke-Seite. `bestaetigen`: neu oder noch unbestätigt, das
 * Freebie kommt nach dem Klick in der Bestätigungsmail.
 */
export type OptinErgebnis = "sofort" | "bestaetigen";

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
  level,
  pfad,
  src,
  lang,
  firma,
}: {
  email: string;
  vorname: string;
  freebie: string;
  level?: Stufe;
  pfad: string;
  src?: string | null;
  lang: string | undefined;
  firma: string;
}): OptinDaten => ({
  email: email.trim(),
  vorname: vorname.trim(),
  freebie,
  ...(level ? { level } : {}),
  quelle: quelleFuer(pfad, src),
  sprache: spracheAus(lang),
  firma,
});

export const ergebnisAus = (status: unknown): OptinErgebnis =>
  status === "active" || status === "unsubscribed" ? "sofort" : "bestaetigen";

type FetchFn = (url: string, init: RequestInit) => Promise<Pick<Response, "ok" | "status" | "text">>;

export const optinAnmelden = async (daten: OptinDaten, fetchFn: FetchFn = fetch): Promise<OptinErgebnis> => {
  const res = await fetchFn(OPTIN_WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(daten),
  });
  if (!res.ok) throw new Error(`Webhook ${res.status}`);
  const text = await res.text();
  try {
    return ergebnisAus((JSON.parse(text) as { status?: unknown }).status);
  } catch {
    return "bestaetigen";
  }
};
