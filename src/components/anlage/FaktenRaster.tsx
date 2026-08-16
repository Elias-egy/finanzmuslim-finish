export type Fakt = { label: string; wert: string | null | undefined };

/**
 * Kompaktes Faktenraster im Kopf der Anlageseite. Handy zwei Spalten,
 * Desktop drei. Fakten ohne Wert fallen raus, statt als leerer Kasten zu
 * stehen. Ein leerer Kasten sieht aus wie ein Ladefehler.
 */
const FaktenRaster = ({ fakten }: { fakten: Fakt[] }) => {
  const echte = fakten.filter((f) => f.wert);
  if (echte.length === 0) return null;

  return (
    <dl className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
      {echte.map((f) => (
        <div key={f.label} className="rounded-lg border border-border bg-card px-3 py-2.5">
          <dt className="text-[12px] leading-tight text-muted-foreground">{f.label}</dt>
          <dd className="mt-0.5 text-[15px] font-semibold text-foreground">{f.wert}</dd>
        </div>
      ))}
    </dl>
  );
};

export default FaktenRaster;
