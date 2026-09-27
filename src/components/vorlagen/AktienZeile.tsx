import { Lock } from "lucide-react";

type Props = {
  rang?: number;
  name: string;
  ticker?: string;
  bekanntFuer: string;
  /** `offen` heißt: Name sichtbar, Urteil hinter der Schranke. */
  status: "Halal" | "Doubtful" | "offen";
  highlight?: boolean;
};

/** Eine Zeile der Aktienliste. Enthält keine Daten, nur die Darstellung. */
const AktienZeile = ({ rang, name, ticker, bekanntFuer, status, highlight }: Props) => (
  <div
    className={`grid items-center gap-3 border-b border-border py-3 last:border-b-0 ${
      rang === undefined ? "grid-cols-[1fr_auto] px-4" : "grid-cols-[2.5rem_1fr_auto] px-2"
    } ${highlight ? "bg-[hsl(var(--primary)/0.05)]" : ""}`}
  >
    {rang !== undefined && <span className="text-[13px] font-semibold text-muted-foreground">{rang}</span>}
    <div className="min-w-0">
      <span className="block text-[15px] font-bold text-foreground">
        {name} {ticker && <span className="font-normal text-muted-foreground">· {ticker}</span>}
      </span>
      <span className="block text-[13px] text-muted-foreground">
        {bekanntFuer}
        {highlight && <span className="ml-1 font-semibold text-primary">· Highlight</span>}
      </span>
    </div>
    {status === "offen" ? (
      <span className="inline-flex h-7 items-center gap-1 rounded-full border border-primary/25 bg-accent px-3 text-[12px] font-bold text-primary">
        <Lock className="h-3.5 w-3.5" aria-hidden />
        <span>?</span>
        <span className="sr-only">Ergebnis nach der Anmeldung</span>
      </span>
    ) : (
      <span
        className={`inline-flex h-7 items-center rounded-full border px-3 text-[12px] font-bold ${
          status === "Halal"
            ? "border-[hsl(var(--success)/0.35)] bg-[hsl(var(--success)/0.12)] text-[hsl(var(--success))]"
            : "border-[hsl(var(--warning)/0.4)] bg-[hsl(var(--warning)/0.14)] text-[hsl(38_92%_32%)]"
        }`}
      >
        {status}
      </span>
    )}
  </div>
);

export default AktienZeile;
