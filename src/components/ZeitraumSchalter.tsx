import { zeitraeume, type Zeitraum } from "@/lib/kurse";

type Props = {
  wert: Zeitraum;
  onChange: (z: Zeitraum) => void;
  className?: string;
  /** Kurzform 1M, 6M, 1J, 5J. Auf dem Handy passt die Leiste sonst nicht
   *  neben den Filterknopf. */
  kurz?: boolean;
};

/** Gemeinsame Umschaltleiste für Tabelle und Detailseite. */
const ZeitraumSchalter = ({ wert, onChange, className = "", kurz = false }: Props) => (
  <div
    role="tablist"
    aria-label="Zeitraum der Rendite"
    className={`inline-flex flex-wrap gap-1 rounded-lg bg-muted p-1 ${className}`}
  >
    {zeitraeume.map((z) => (
      <button
        key={z.key}
        type="button"
        role="tab"
        aria-selected={wert === z.key}
        aria-label={z.label}
        onClick={() => onChange(z.key)}
        className={`min-h-[36px] rounded-md px-3 text-[14px] font-semibold transition-colors ${
          wert === z.key ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-background"
        }`}
      >
        {kurz ? z.kurz : z.label}
      </button>
    ))}
  </div>
);

export default ZeitraumSchalter;
