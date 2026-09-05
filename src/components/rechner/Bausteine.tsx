import { type ReactNode } from "react";

/**
 * Kleine Bausteine, die jeder Rechner braucht: Eurofeld, Regler, Auswahl aus
 * wenigen Knöpfen. Vorher hatte jeder Rechner seine eigene Kopie davon.
 *
 * Alle Bausteine stehen außerhalb der Rechner-Komponenten, sonst verliert ein
 * Feld bei jedem Tastendruck den Fokus (derselbe Fehler wie einst im
 * Zakat-Rechner).
 */

export const eur = (n: number) =>
  n.toLocaleString("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

export const prozent = (n: number, stellen = 0) =>
  `${n.toLocaleString("de-DE", { minimumFractionDigits: stellen, maximumFractionDigits: stellen })} %`;

export const parseEuro = (text: string) => {
  const v = parseFloat(text.replace(/\./g, "").replace(",", "."));
  return Number.isFinite(v) && v > 0 ? v : 0;
};

/** Jahre und Monate als Satzteil: "2 Jahren und 4 Monaten". */
export const dauerText = (monate: number, dativ = true) => {
  const j = Math.floor(monate / 12);
  const m = monate % 12;
  const jahr = j === 1 ? "Jahr" : dativ ? "Jahren" : "Jahre";
  const monat = m === 1 ? "Monat" : dativ ? "Monaten" : "Monate";
  if (j === 0) return `${m} ${monat}`;
  if (m === 0) return `${j} ${jahr}`;
  return `${j} ${jahr} und ${m} ${monat}`;
};

export const inputClass =
  "w-full rounded-xl border border-border bg-white px-4 py-3 pr-10 text-[15px] font-medium text-foreground outline-none transition focus:border-primary/50";

export const EuroFeld = ({
  id,
  label,
  hinweis,
  wert,
  setWert,
  placeholder,
}: {
  id: string;
  label: string;
  hinweis?: string;
  wert: string;
  setWert: (v: string) => void;
  placeholder?: string;
}) => (
  <div>
    <label className="block text-[15px] font-semibold text-foreground" htmlFor={id}>
      {label}
    </label>
    {hinweis && <p className="mb-2 mt-0.5 text-[13px] text-muted-foreground">{hinweis}</p>}
    <div className={`relative ${hinweis ? "" : "mt-2"}`}>
      <input
        id={id}
        inputMode="decimal"
        value={wert}
        placeholder={placeholder}
        onChange={(e) => setWert(e.target.value)}
        className={inputClass}
      />
      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
    </div>
  </div>
);

export const Regler = ({
  id,
  label,
  wert,
  min,
  max,
  schritt,
  einheit,
  setWert,
  hinweis,
}: {
  id: string;
  label: string;
  wert: number;
  min: number;
  max: number;
  schritt: number;
  einheit: string;
  setWert: (v: number) => void;
  hinweis?: ReactNode;
}) => (
  <div>
    <div className="flex items-baseline justify-between gap-3">
      <label className="text-[15px] font-semibold text-foreground" htmlFor={id}>
        {label}
      </label>
      <span className="text-[15px] font-bold text-foreground">
        {wert.toLocaleString("de-DE")} {einheit}
      </span>
    </div>
    <input
      id={id}
      type="range"
      min={min}
      max={max}
      step={schritt}
      value={wert}
      onChange={(e) => setWert(Number(e.target.value))}
      className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-accent accent-primary"
    />
    {hinweis && <p className="mt-2 text-[13px] text-muted-foreground">{hinweis}</p>}
  </div>
);

/** Auswahl aus wenigen Knöpfen, zwei bis vier nebeneinander. */
export const Wahl = <T extends string>({
  label,
  hinweis,
  wert,
  optionen,
  setWert,
}: {
  label?: string;
  hinweis?: string;
  wert: T;
  optionen: { wert: T; titel: string; unter?: string; symbol?: ReactNode }[];
  setWert: (v: T) => void;
}) => (
  <div>
    {label && <p className="text-[15px] font-semibold text-foreground">{label}</p>}
    {hinweis && <p className="mb-2 mt-0.5 text-[13px] text-muted-foreground">{hinweis}</p>}
    <div
      className={`grid gap-2 ${label ? "mt-2" : ""} ${
        optionen.length >= 4 ? "grid-cols-2 sm:grid-cols-3" : optionen.length === 3 ? "grid-cols-3" : "grid-cols-2"
      }`}
    >
      {optionen.map((o) => (
        <button
          key={o.wert}
          type="button"
          onClick={() => setWert(o.wert)}
          aria-pressed={wert === o.wert}
          className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition ${
            wert === o.wert ? "border-primary bg-accent" : "border-border bg-white/60 hover:border-primary/40"
          }`}
        >
          {o.symbol && <span className="shrink-0 text-primary" aria-hidden>{o.symbol}</span>}
          <span className="min-w-0">
            <span className="block text-[13px] font-semibold leading-tight text-foreground">{o.titel}</span>
            {o.unter && <span className="block text-[11px] leading-snug text-muted-foreground">{o.unter}</span>}
          </span>
        </button>
      ))}
    </div>
  </div>
);

/** Die blaue Ergebniskarte: eine Zeile oben, die Zahl, ein Satz, darunter das Bild. */
export const Ergebnis = ({
  ueber,
  zahl,
  satz,
  children,
}: {
  ueber: string;
  zahl: string;
  satz: ReactNode;
  children?: ReactNode;
}) => (
  <div className="rounded-[1.5rem] bg-primary p-6 text-white md:p-7">
    <span className="text-[11px] font-semibold tracking-wide text-white/70">{ueber}</span>
    <p className="headline mt-3 text-4xl text-white md:text-5xl">{zahl}</p>
    <p className="mt-3 text-[14px] leading-relaxed text-white/80">{satz}</p>
    {children}
  </div>
);

/** Quellenzeile unter einer Grafik. */
export const QuelleZeile = ({ name, url, stand }: { name: string; url: string; stand: string }) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className="mt-2 inline-block text-[12px] text-primary underline decoration-primary/30 underline-offset-[3px] hover:decoration-primary"
  >
    {name}, {stand}
  </a>
);
