import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";

/**
 * ISIN oder WKN mit Kopierknopf. Ohne Wert wird gar nichts gezeigt, statt
 * eines Knopfes, der nichts kopiert.
 */
const KopierWert = ({ label, wert }: { label: string; wert?: string | null }) => {
  const [kopiert, setKopiert] = useState(false);

  useEffect(() => {
    if (!kopiert) return;
    const t = setTimeout(() => setKopiert(false), 1800);
    return () => clearTimeout(t);
  }, [kopiert]);

  if (!wert) return null;

  const kopieren = async () => {
    try {
      await navigator.clipboard.writeText(wert);
      setKopiert(true);
    } catch {
      /* Zwischenablage gesperrt, dann bleibt der Wert wenigstens lesbar. */
    }
  };

  return (
    <button
      type="button"
      onClick={kopieren}
      aria-label={`${label} ${wert} kopieren`}
      className="inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-border bg-card px-3 text-[14px] transition-colors hover:border-primary"
    >
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground">{wert}</span>
      {kopiert ? (
        <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-success">
          <Check className="h-4 w-4" aria-hidden />
          kopiert
        </span>
      ) : (
        <Copy className="h-4 w-4 text-muted-foreground" aria-hidden />
      )}
    </button>
  );
};

export default KopierWert;
