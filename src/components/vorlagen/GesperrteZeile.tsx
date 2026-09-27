import { Lock } from "lucide-react";

type Props = {
  name: string;
  unterzeile: string;
  /** Was nach der Anmeldung dazukommt, für Screenreader. */
  verborgen: string;
};

/** Eine Zeile an der Schnittkante: Name sichtbar, Inhalt hinter der Schranke. Enthält keine Daten. */
const GesperrteZeile = ({ name, unterzeile, verborgen }: Props) => (
  <div className="grid grid-cols-[1fr_auto] items-center gap-3 border-b border-border px-4 py-3 last:border-b-0">
    <div className="min-w-0">
      <span className="block text-[15px] font-bold text-foreground">{name}</span>
      <span className="block text-[13px] text-muted-foreground">{unterzeile}</span>
    </div>
    <span className="inline-flex h-7 items-center gap-1 rounded-full border border-primary/25 bg-accent px-3 text-[12px] font-bold text-primary">
      <Lock className="h-3.5 w-3.5" aria-hidden />
      <span>?</span>
      <span className="sr-only">{verborgen}</span>
    </span>
  </div>
);

export default GesperrteZeile;
