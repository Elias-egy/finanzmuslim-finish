/**
 * Was sich die Opt-in-Karte auf dem Gerät merkt (Elias, 09.10.2026: „irgendwie musst du
 * speichern, dass er nicht jedes Mal neu alles eingeben muss, wenn man sich mehrere Sachen
 * holt“). Wer einmal Adresse und Häkchen abgeschickt hat, holt die nächste Vorlage mit einem
 * Klick, und was geholt ist, bleibt auf diesem Gerät offen.
 *
 * Geschrieben wird erst nach dem Klick auf den Knopf der Karte, nie beim bloßen Besuch
 * (§ 25 Abs. 2 Nr. 2 TDDDG, Vault wiki/website-playbook.md Abschnitt 9). Der Eintrag bleibt im
 * Browser; an Make geht die Adresse erst wieder, wenn jemand die nächste Vorlage anfordert.
 * „Andere Adresse“ löscht ihn.
 */
import { emailGueltig } from "@/lib/anmeldung";
import type { Stufe } from "@/lib/optin";

export const MERK_SCHLUESSEL = "fm-optin";

export type Gemerkt = {
  email: string;
  vorname: string;
  /** Fassung des Einwilligungstexts, der angehakt wurde, und der Tag dazu. */
  einwilligung: string;
  seit: string;
  stufe?: Stufe;
  /** Kennungen der Freebies, die auf diesem Gerät geholt wurden. */
  geholt: string[];
};

type Speicher = Pick<Storage, "getItem" | "setItem" | "removeItem">;

const STUFEN: readonly string[] = ["einsteiger", "fortgeschritten", "profi"];

/** `localStorage` kann fehlen (Vorab-Rendern) oder gesperrt sein (strenge Browser). */
const geraet = (): Speicher | null => {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
};

/** Liest den Eintrag. Was nicht passt, gilt als nicht vorhanden. */
export const gemerktAus = (roh: string | null): Gemerkt | null => {
  if (!roh) return null;
  try {
    const d = JSON.parse(roh) as Record<string, unknown>;
    if (typeof d.email !== "string" || !emailGueltig(d.email)) return null;
    if (typeof d.einwilligung !== "string" || !d.einwilligung) return null;
    return {
      email: d.email,
      vorname: typeof d.vorname === "string" ? d.vorname : "",
      einwilligung: d.einwilligung,
      seit: typeof d.seit === "string" ? d.seit : "",
      stufe: typeof d.stufe === "string" && STUFEN.includes(d.stufe) ? (d.stufe as Stufe) : undefined,
      geholt: Array.isArray(d.geholt) ? d.geholt.filter((x): x is string => typeof x === "string") : [],
    };
  } catch {
    return null;
  }
};

export const gemerktLesen = (s: Speicher | null = geraet()): Gemerkt | null => {
  try {
    return s ? gemerktAus(s.getItem(MERK_SCHLUESSEL)) : null;
  } catch {
    return null;
  }
};

const schreiben = (g: Gemerkt, s: Speicher | null) => {
  try {
    s?.setItem(MERK_SCHLUESSEL, JSON.stringify(g));
  } catch {
    /* Voller oder gesperrter Speicher: Dann fragt die Karte beim nächsten Mal eben wieder. */
  }
  return g;
};

/**
 * Merkt eine Anmeldung. Dieselbe Adresse behält, was sie schon geholt hat, und den Tag der
 * ersten Einwilligung; eine andere Adresse fängt neu an.
 */
export const merken = (
  neu: { email: string; vorname: string; einwilligung: string; freebie: string; stufe?: Stufe },
  heute: Date = new Date(),
  s: Speicher | null = geraet(),
): Gemerkt => {
  const alt = gemerktLesen(s);
  const email = neu.email.trim();
  const derselbe = alt && alt.email.toLowerCase() === email.toLowerCase() ? alt : null;
  return schreiben(
    {
      email,
      vorname: neu.vorname.trim() || derselbe?.vorname || "",
      einwilligung: derselbe?.einwilligung ?? neu.einwilligung,
      seit: derselbe?.seit || heute.toISOString().slice(0, 10),
      stufe: neu.stufe ?? derselbe?.stufe,
      geholt: [...new Set([...(derselbe?.geholt ?? []), neu.freebie])],
    },
    s,
  );
};

/** Trägt die Stufe aus der ersten Klickfrage nach, damit der Guide beim nächsten Mal passt. */
export const stufeMerken = (stufe: Stufe, s: Speicher | null = geraet()): Gemerkt | null => {
  const alt = gemerktLesen(s);
  return alt ? schreiben({ ...alt, stufe }, s) : null;
};

export const vergessen = (s: Speicher | null = geraet()) => {
  try {
    s?.removeItem(MERK_SCHLUESSEL);
  } catch {
    /* nichts zu tun */
  }
};

export const hatGeholt = (g: Gemerkt | null, freebie: string) => !!g?.geholt.includes(freebie);
