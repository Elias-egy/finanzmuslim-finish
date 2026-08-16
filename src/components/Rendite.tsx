import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { renditeText } from "@/lib/kurse";

/**
 * Renditezahl mit Pfeil. Grün und Rot sind hier bewusst erlaubt,
 * weil eine Rendite eine Messung ist und so überall dargestellt wird.
 */
export const RenditeWert = ({
  wert,
  gross = false,
  mittel = false,
}: {
  wert: number | null | undefined;
  gross?: boolean;
  /** Zweite Zeile unter dem Kurs. Pfeil und Farbe bleiben, nur kleiner. */
  mittel?: boolean;
}) => {
  const text = renditeText(wert);
  if (text === null) {
    return <span className="whitespace-nowrap text-[13px] text-muted-foreground">keine Daten</span>;
  }
  const plus = (wert as number) > 0;
  const Icon = plus ? ArrowUpRight : ArrowDownRight;
  /* Genau null ist keine Bewegung. Grün wäre hier eine Aussage, die die Zahl
     nicht hergibt. */
  const farbe =
    (wert as number) === 0 ? "text-muted-foreground" : plus ? "text-success" : "text-destructive";
  return (
    <span
      className={`inline-flex items-center gap-0.5 whitespace-nowrap font-bold ${farbe} ${
        gross ? "text-[32px] md:text-[40px]" : mittel ? "text-[14px]" : "text-[17px]"
      }`}
    >
      <Icon className={gross ? "h-8 w-8" : mittel ? "h-3.5 w-3.5" : "h-4 w-4"} aria-hidden />
      {text}
    </span>
  );
};

/** Schlichte Linie ohne Achsen, reine Dekoration. */
export const Sparkline = ({ verlauf }: { verlauf: number[] | undefined }) => {
  if (!verlauf || verlauf.length < 2) return null;
  const w = 60;
  const h = 20;
  const min = Math.min(...verlauf);
  const max = Math.max(...verlauf);
  const spanne = max - min || 1;
  const punkte = verlauf
    .map((v, i) => {
      const x = (i / (verlauf.length - 1)) * w;
      const y = h - ((v - min) / spanne) * (h - 2) - 1;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden focusable="false" className="shrink-0">
      <polyline
        points={punkte}
        fill="none"
        stroke="hsl(215 16% 60%)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
