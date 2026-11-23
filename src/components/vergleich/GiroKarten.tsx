import type { ReactNode } from "react";
import { Check, Minus, TriangleAlert } from "lucide-react";
import { dealFuer, schildText } from "@/data/deals";

/**
 * Bausteine der Girokonto-Karten am Handy, wie Finanzfluss (PH2-01, Elias 15.11.2026): eine Hakenzeile,
 * darunter vier Kacheln (Kontoführung, Geldautomaten, Girocard, Debitkarte) und, wo Finanzfluss etwas nennt, eine
 * Zeile „Besonders“. Nur der Girokonto-Vergleich nutzt sie (Prop `giro` an `VergleichsSeite`); Depot und Krypto
 * behalten die Hakenliste. Die Werte kommen aus denselben Zeilen wie die Tabelle, nichts ist neu gerechnet.
 */

/** Was die Bausteine von einem Konto brauchen, gleich ob es als Spalte oder als Eintrag vorliegt. */
export type GiroWerte = {
  zinsfrei: string | undefined;
  keinDispo: string | undefined;
  kontofuehrung: string | null | undefined;
  /** Kurzform mit Bedingung („0 € ab 700 € Geldeingang“), falls vorhanden. */
  kontofuehrungKurz?: string | null;
  geldautomaten: string | null | undefined;
  girocard: string | null | undefined;
  debitkarte: string | null | undefined;
  /**
   * DACH1: Österreich und die Schweiz haben keine Girocard und keine deutsche Automatenzahl (Zeilen fehlen dort,
   * `landTexte.ts`). Dann zeigen die Kacheln statt dessen kostenlose Abhebungen und die Kartenzahlung in Fremdwährung.
   */
  ohneGirocard?: boolean;
  abhebungen?: string | null;
  fremdZahlen?: string | null;
};

export const euro = (s: string) => s.replace(/(\d)\s*€/g, "$1 €").replace(/(\d)\s*CHF/g, "$1 CHF").trim();

/** „0 € ab 700 € Geldeingang“ wird Betrag „0 €“ und Zusatz „ab 700 € Geldeingang“. */
const kontofuehrungTeile = (w: GiroWerte): { betrag: string; zusatz?: string } | null => {
  const m = /^(\d[\d.,]*\s*€)\s*(.*)$/.exec((w.kontofuehrungKurz ?? w.kontofuehrung ?? "").trim());
  if (!m) return null;
  return { betrag: euro(m[1]), zusatz: w.kontofuehrungKurz && m[2] ? euro(m[2]) : undefined };
};

const girocardTeile = (s: string | null | undefined): string | null => {
  if (!s || /^keine/i.test(s)) return null;
  return /^\d/.test(s.trim()) ? euro(s) : null;
};

/** „VISA, 0€“ wird Marke „VISA“ und Preis „0 €“. */
const debitTeile = (s: string | null | undefined): { marke: string; preis: string | null } | null => {
  if (!s || /^keine/i.test(s)) return null;
  const m = /^(.*?),\s*(\d[\d.,]*\s*(?:€|CHF))\s*$/.exec(s.trim());
  return m ? { marke: m[1], preis: euro(m[2]) } : { marke: s.trim(), preis: null };
};

/** Die Zeile mit dem Haken: nur, was die Zins- und Dispo-Ampel des Kontos belegt. */
export const zinsDispoZeile = (zinsfrei: string | undefined, keinDispo: string | undefined): { text: string; zeichen: "ja" | "teils" | "offen" } => {
  if (zinsfrei === "gut" && keinDispo === "gut") return { text: "Ohne Zinsen, ohne Dispo", zeichen: "ja" };
  if (zinsfrei === "gut" && keinDispo === "teils") return { text: "Ohne Zinsen, Dispo abschaltbar", zeichen: "teils" };
  if (zinsfrei === "teils" && keinDispo === "gut") return { text: "Zinsen abschaltbar, ohne Dispo", zeichen: "teils" };
  if (zinsfrei === "teils" && keinDispo === "teils") return { text: "Zinsen und Dispo abschaltbar", zeichen: "teils" };
  if (zinsfrei === "gut") return { text: "Ohne Zinsen", zeichen: "ja" };
  if (zinsfrei === "teils") return { text: "Zinsen abschaltbar", zeichen: "teils" };
  return { text: "Zinsen und Dispo: nicht geprüft", zeichen: "offen" };
};

/* ------------------------------------------------------------------ Kartenbilder (eigene SVG, nichts geladen) */

export const GirocardBild = () => (
  <svg viewBox="0 0 40 26" width="36" height="23" role="img" aria-label="girocard" className="shrink-0">
    <rect x="0.5" y="0.5" width="39" height="25" rx="3.5" fill="#fff" stroke="#9AA4B5" />
    <rect x="3" y="4" width="7" height="5" rx="1" fill="#C9A13B" />
    <rect x="0.5" y="15" width="39" height="10.5" rx="3.5" fill="#0057FA" />
    <rect x="0.5" y="15" width="39" height="4" fill="#0057FA" />
    <text x="20" y="22.6" textAnchor="middle" fontSize="7" fontWeight="700" fill="#fff" fontFamily="Figtree, system-ui, sans-serif">girocard</text>
  </svg>
);

export const VisaBild = () => (
  <svg viewBox="0 0 40 26" width="36" height="23" role="img" aria-label="VISA" className="shrink-0">
    <rect x="0.5" y="0.5" width="39" height="25" rx="3.5" fill="#fff" stroke="#9AA4B5" />
    <text x="20" y="18" textAnchor="middle" fontSize="11" fontWeight="800" fontStyle="italic" fill="#1A1F71" fontFamily="Figtree, system-ui, sans-serif">VISA</text>
  </svg>
);

export const MastercardBild = () => (
  <svg viewBox="0 0 40 26" width="36" height="23" role="img" aria-label="Mastercard" className="shrink-0">
    <rect x="0.5" y="0.5" width="39" height="25" rx="3.5" fill="#fff" stroke="#9AA4B5" />
    <circle cx="15.5" cy="13" r="7.5" fill="#EB001B" />
    <circle cx="24.5" cy="13" r="7.5" fill="#F79E1B" />
    <path d="M20 7.2a7.5 7.5 0 0 1 0 11.6a7.5 7.5 0 0 1 0-11.6z" fill="#FF5F00" />
  </svg>
);

/* ------------------------------------------------------------------ Kacheln */

export const Kachel = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="flex min-h-[64px] flex-col justify-between rounded-lg border border-border bg-card px-2.5 py-2">
    <p className="text-[12px] leading-tight text-muted-foreground">{label}</p>
    <div className="mt-1 flex items-center justify-between gap-2">{children}</div>
  </div>
);

export const Wert = ({ children, leise = false }: { children: ReactNode; leise?: boolean }) => (
  <span className={`text-[16px] font-bold leading-tight ${leise ? "text-muted-foreground" : "text-foreground"}`}>{children}</span>
);

export const GiroKacheln = ({ w }: { w: GiroWerte }) => {
  const kf = kontofuehrungTeile(w);
  const gc = girocardTeile(w.girocard);
  const db = debitTeile(w.debitkarte);
  const marke = db?.marke ?? "";
  return (
    <div className="grid grid-cols-2 gap-2">
      <Kachel label="Kontoführung (Monat)">
        {kf ? (
          <div className="min-w-0">
            <Wert>{kf.betrag}</Wert>
            {kf.zusatz && <p className="mt-0.5 text-[12px] font-normal leading-tight text-muted-foreground">{kf.zusatz}</p>}
          </div>
        ) : (
          <Wert leise>–</Wert>
        )}
      </Kachel>
      {w.ohneGirocard ? (
        <>
          <Kachel label="Abheben">
            {w.abhebungen ? <span className="text-[14px] font-bold leading-tight text-foreground">{euro(w.abhebungen)}</span> : <Wert leise>–</Wert>}
          </Kachel>
          <Kachel label="Zahlen in Fremdwährung">
            {w.fremdZahlen ? <Wert>{euro(w.fremdZahlen)}</Wert> : <Wert leise>–</Wert>}
          </Kachel>
        </>
      ) : (
        <>
          <Kachel label="Geldautomaten">
            {w.geldautomaten ? <Wert>{w.geldautomaten}</Wert> : <Wert leise>–</Wert>}
          </Kachel>
          <Kachel label="Girocard (Monat)">
            {gc ? (
              <>
                <Wert>{gc}</Wert>
                <GirocardBild />
              </>
            ) : (
              <Wert leise>Keine</Wert>
            )}
          </Kachel>
        </>
      )}
      <Kachel label="Debitkarte (Monat)">
        {db ? (
          <>
            <div className="min-w-0">
              <Wert>{db.preis ?? "–"}</Wert>
              {!/^(visa|mastercard)$/i.test(marke) && <p className="mt-0.5 text-[12px] leading-tight text-muted-foreground">{marke}</p>}
            </div>
            {/^visa$/i.test(marke) ? <VisaBild /> : /^mastercard$/i.test(marke) ? <MastercardBild /> : null}
          </>
        ) : (
          <Wert leise>Keine</Wert>
        )}
      </Kachel>
    </div>
  );
};

/** Haken, Kacheln und „Besonders“ in einem Stück, für Karte und Nummer-1-Kasten. */
export const GiroInhalt = ({ w, besonders }: { w: GiroWerte; besonders?: string[] }) => {
  const z = zinsDispoZeile(w.zinsfrei, w.keinDispo);
  const Icon = z.zeichen === "ja" ? Check : z.zeichen === "teils" ? TriangleAlert : Minus;
  const farbe = z.zeichen === "ja" ? "text-success" : z.zeichen === "teils" ? "text-warning" : "text-muted-foreground/60";
  return (
    <>
      <p className="mt-3 flex items-start gap-2 text-[14px] font-semibold leading-snug text-foreground">
        <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${farbe}`} aria-hidden />
        <span>{z.text}</span>
      </p>
      <div className="mt-2.5">
        <GiroKacheln w={w} />
      </div>
      {besonders && besonders.length > 0 && (
        <p className="mt-2.5 text-[13px] leading-snug text-foreground">
          <span className="font-semibold">Besonders:</span> {besonders.slice(0, 2).join(", ")}
        </p>
      )}
    </>
  );
};

/** Reiter oben an der Karte mit Bonus: der Text aus dem belegten Deal („50 € Bonus“), sonst nichts. */
export const bonusReiter = (anbieterId: string): string | null => {
  const deal = dealFuer(anbieterId);
  return deal ? schildText(deal) : null;
};
