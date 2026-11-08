import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

/**
 * Aufruf zu einer eigenen Seite (Vergleich, Rechner, Guide, Blog): der dunkle Knopf aus dem Blog,
 * eckig, mit der blauen Leuchtlinie. Führt ein Knopf zu einem Anbieter (/weiter/, /out/), bleibt er
 * blau (`bg-primary`) und ist kein Aufruf. `className` sitzt am äußeren Link (Abstand, Breite).
 */
const Aufruf = ({ to, children, className }: { to: string; children: ReactNode; className?: string }) => (
  <Link to={to} className={cn("leuchtlinie inline-block", className)}>
    <span className="flex min-h-[44px] items-center justify-center gap-2 bg-foreground px-5 py-3 font-mono text-[13px] uppercase tracking-[0.12em] text-background">
      {children}
    </span>
  </Link>
);

export default Aufruf;
