import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

/**
 * Aufruf zu einer eigenen Seite (Vergleich, Rechner, Guide, Blog). Seit VS5-05 (Elias 11.11.2026) rund wie
 * „Jetzt holen“ im OS-Block: „Ich weiß nicht, ob du alle so rund machen kannst“, „der blaue Runde … sah richtig
 * visuell gut aus“ (VS5-02). Zwei Arten: `haupt` blau gefüllt, `zweit` weiß mit Rand (für ruhige Knöpfe wie
 * „Alle Beiträge“). Knöpfe zu einem Anbieter (/weiter/, /out/) sind kein Aufruf und bleiben, wie sie sind.
 * `className` sitzt am äußeren Link (Abstand, Breite). `gross` ist der Hauptknopf eines ersten Schirms.
 */
const Aufruf = ({
  to,
  children,
  className,
  gross = false,
  nativ = false,
  art = "haupt",
}: {
  to: string;
  children: ReactNode;
  className?: string;
  gross?: boolean;
  /** Ziel liegt außerhalb der React-Seiten (z. B. der OS-Entwurf unter /os-entwurf): normaler Link. */
  nativ?: boolean;
  art?: "haupt" | "zweit";
}) => {
  const innen = (
    <span
      className={cn(
        "flex min-h-[48px] items-center justify-center gap-2 rounded-full px-6 text-[16px] font-semibold transition-colors",
        art === "haupt"
          ? "bg-primary text-white group-hover:bg-[#1f6bff]"
          : "border border-border bg-background text-foreground group-hover:border-foreground",
        gross && "md:min-h-[52px] md:px-8 md:text-[17px]",
      )}
    >
      {children}
    </span>
  );
  const huelle = cn("group inline-block rounded-full", className);
  return nativ ? (
    <a href={to} className={huelle}>
      {innen}
    </a>
  ) : (
    <Link to={to} className={huelle}>
      {innen}
    </Link>
  );
};

export default Aufruf;
