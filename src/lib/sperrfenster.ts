import { SPERRE } from "@/data/sperrfenster";
import { guideBySchluessel } from "@/data/guides";

/** Logik des Sperrfensters, ohne DOM. Werte: `src/data/sperrfenster.ts`. */

export const ENDE_MS = Date.parse(SPERRE.ende);

export type Restzeit = { tage: number; stunden: number; minuten: number; sekunden: number };

export const restzeit = (jetzt: number, ende: number = ENDE_MS): Restzeit => {
  const rest = Math.max(0, Math.floor((ende - jetzt) / 1000));
  return {
    tage: Math.floor(rest / 86400),
    stunden: Math.floor((rest % 86400) / 3600),
    minuten: Math.floor((rest % 3600) / 60),
    sekunden: rest % 60,
  };
};

export const abgelaufen = (jetzt: number, ende: number = ENDE_MS) => jetzt >= ende;

const ohneSchraegstrich = (pfad: string) => pfad.replace(/\/+$/, "") || "/";

/** Vollfassung einer Vorlage aus der Opt-in-Strecke: /vorlagen/<slug>/<schluessel>. */
const vorlageMitSchluessel = (pfad: string) => /^\/vorlagen\/[^/]+\/[^/]+$/.test(pfad);

export const istFrei = (pfad: string) => {
  const p = ohneSchraegstrich(pfad);
  return SPERRE.frei.some((f) => p === f || p.startsWith(`${f}/`)) || vorlageMitSchluessel(p);
};

/** Wer einen gültigen Guide-Link öffnet, ist schon eingetragen und sieht die ganze Seite. */
export const guideSchaltetFrei = (pfad: string) => {
  const treffer = /^\/dein-guide\/([^/]+)$/.exec(ohneSchraegstrich(pfad));
  return Boolean(treffer && guideBySchluessel(treffer[1]));
};

const hex = (puffer: ArrayBuffer) =>
  [...new Uint8Array(puffer)].map((b) => b.toString(16).padStart(2, "0")).join("");

/** Ohne `crypto.subtle` (http im lokalen Netz) passt kein Schlüssel. */
export const schluesselPasst = async (schluessel: string | null | undefined) => {
  if (!schluessel) return false;
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) return false;
  try {
    const summe = await subtle.digest("SHA-256", new TextEncoder().encode(schluessel));
    return hex(summe) === SPERRE.schluesselHash;
  } catch {
    return false;
  }
};

type Speicher = Pick<Storage, "getItem" | "setItem">;

const speicher = (): Speicher | null => {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

export const istFreigeschaltet = (jetzt: number, ablage: Speicher | null = speicher()) => {
  try {
    const bis = Number(ablage?.getItem(SPERRE.merker));
    return Number.isFinite(bis) && bis > jetzt;
  } catch {
    return false;
  }
};

export const merkeFreischaltung = (ablage: Speicher | null = speicher()) => {
  try {
    ablage?.setItem(SPERRE.merker, String(ENDE_MS));
  } catch {
    /* Privater Modus: die Freischaltung gilt dann nur für diesen Seitenaufruf. */
  }
};

export const sperreZeigen = ({
  pfad,
  jetzt,
  freigeschaltet,
}: {
  pfad: string;
  jetzt: number;
  freigeschaltet: boolean;
}) => SPERRE.aktiv && !abgelaufen(jetzt) && !freigeschaltet && !istFrei(pfad);
