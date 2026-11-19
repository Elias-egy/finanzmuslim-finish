/**
 * Das unscharfe graue Gerüst des Dashboards hinter Start, Fragen und „Dein Plan entsteht“ (CV28P, 09.11.2026). Vorbild
 * Skilltree: hinter der Frage liegt unscharf schon „ungefähr so“ das Ergebnis (Laufzettel cv28p, Gefühlsblatt Punkt 1
 * bis 3). Rein dekorativ: blur 6 px, Deckkraft .35, nicht anklickbar, für Vorleser versteckt. `stufe` (0 bis 6) zeigt,
 * wie viele Teile schon stehen; so baut es sich beim Übergang auf.
 */
const Teil = ({ an, className, children }: { an: boolean; className: string; children?: React.ReactNode }) => (
  <div className={`pp-geruest-teil ${an ? "ist-an" : ""} ${className}`}>{children}</div>
);

export const Geruest = ({ stufe = 6 }: { stufe?: number }) => (
  <div className="pp-geruest pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
    <div className="container max-w-5xl pt-24">
      <div className="h-9 w-2/3 max-w-[420px] rounded-lg bg-foreground/25" />
      <div className="mt-6 grid grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => (
          <Teil key={i} an={stufe > i} className="h-20 rounded-2xl border border-foreground/20 bg-foreground/[0.06]" />
        ))}
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <Teil an={stufe > 3} className="flex items-center gap-6 rounded-[20px] border border-foreground/20 p-6">
          <div className="h-36 w-36 shrink-0 rounded-full border-[18px] border-foreground/25" />
          <div className="flex-1 space-y-3">
            <div className="h-3 w-3/4 rounded bg-foreground/25" />
            <div className="h-3 w-1/2 rounded bg-foreground/25" />
            <div className="h-3 w-2/3 rounded bg-foreground/25" />
          </div>
        </Teil>
        <Teil an={stufe > 4} className="rounded-[20px] border border-foreground/20 p-6">
          <svg viewBox="0 0 300 120" className="h-36 w-full" preserveAspectRatio="none">
            <path d="M0 95 L40 80 L80 86 L120 60 L160 66 L200 40 L240 48 L300 18 L300 120 L0 120 Z" className="fill-foreground/20" />
          </svg>
        </Teil>
        <Teil an={stufe > 5} className="rounded-[20px] border border-foreground/20 p-6 md:col-span-2">
          <svg viewBox="0 0 600 100" className="h-28 w-full" preserveAspectRatio="none">
            <path d="M0 80 L60 72 L120 76 L180 54 L240 60 L300 40 L360 46 L420 30 L480 36 L540 18 L600 22 L600 100 L0 100 Z" className="fill-foreground/20" />
          </svg>
        </Teil>
      </div>
    </div>
  </div>
);

export default Geruest;
