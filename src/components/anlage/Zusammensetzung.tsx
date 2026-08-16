export type Posten = { label: string; anteil: number };

/**
 * Waagerechte Balken für Positionen, Länder und Branchen.
 *
 * Auf dem Handy sind Balken einer Weltkarte klar überlegen: sie lassen sich
 * lesen, ohne zu zoomen, und kosten nichts an Ladezeit.
 *
 * Balkenfarbe ist Markenblau. Kein Grün, kein Rot. Ein Länderanteil ist keine
 * Bewertung, und Farbe darf hier nichts behaupten.
 */
export const AufteilungsBalken = ({
  titel,
  posten,
  stand,
  quelle,
}: {
  titel: string;
  posten: Posten[];
  stand?: string;
  quelle?: string;
}) => {
  if (posten.length === 0) return null;
  const groesster = Math.max(...posten.map((p) => p.anteil), 1);

  return (
    <div>
      <h3 className="text-[17px] font-bold text-foreground">{titel}</h3>
      <ul className="mt-3 space-y-2.5">
        {posten.map((p) => (
          <li key={p.label}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="min-w-0 truncate text-[15px] text-foreground">{p.label}</span>
              <span className="shrink-0 text-[14px] font-semibold text-foreground tabular-nums">
                {p.anteil.toFixed(1).replace(".", ",")} %
              </span>
            </div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-accent">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${Math.max(2, (p.anteil / groesster) * 100)}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
      {(stand || quelle) && (
        <p className="mt-3 text-[13px] text-muted-foreground">
          {quelle && `Quelle: ${quelle}`}
          {quelle && stand && " · "}
          {stand && `Stand: ${stand}`}
        </p>
      )}
    </div>
  );
};

/** Sachlicher Leerzustand. Nie Nullen zeichnen, wo keine Daten sind. */
export const KeineZusammensetzung = ({ grund }: { grund: string }) => (
  <div className="rounded-xl bg-accent px-4 py-5">
    <p className="text-[15px] font-bold text-foreground">Zusammensetzung noch nicht erfasst</p>
    <p className="mt-1 text-[14px] leading-[21px] text-muted-foreground">{grund}</p>
  </div>
);
