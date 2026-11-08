import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

/**
 * Aufruf zu einer eigenen Seite (Vergleich, Rechner, Guide, Blog): der dunkle Knopf aus dem Blog,
 * eckig, mit der blauen Leuchtlinie. Führt ein Knopf zu einem Anbieter (/weiter/, /out/), bleibt er
 * blau (`bg-primary`) und ist kein Aufruf. `className` sitzt am äußeren Link (Abstand, Breite).
 * `gross` ist der Hauptknopf eines ersten Schirms: am Laptop 52 px hoch und 15 px Schrift, damit er
 * neben dem Kopf-Knopf nicht verliert (SEO80, Prüfer F10).
 */
const Aufruf = ({
  to,
  children,
  className,
  gross = false,
}: {
  to: string;
  children: ReactNode;
  className?: string;
  gross?: boolean;
}) => (
  <Link to={to} className={cn("leuchtlinie inline-block", className)}>
    <span
      className={cn(
        "flex min-h-[44px] items-center justify-center gap-2 bg-foreground px-5 py-3 font-mono text-[13px] uppercase tracking-[0.12em] text-background",
        gross && "md:min-h-[52px] md:px-7 md:text-[15px]",
      )}
    >
      {children}
    </span>
  </Link>
);

export default Aufruf;
