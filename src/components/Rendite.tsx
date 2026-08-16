import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { renditeText } from "@/lib/kurse";

/**
 * Renditezahl mit Pfeil. Grün und Rot sind hier bewusst erlaubt,
 * weil eine Rendite eine Messung ist und so überall dargestellt wird.
 */
export const RenditeWert = ({
  wert,
  gross = false,
}: {
  wert: number | null | undefined;
  gross?: boolean;
}) => {
  const text = renditeText(wert);
  if (text === null) {
    return <span className="whitespace-nowrap text-[13px] text-muted-foreground">keine Daten</span>;
  }
  const plus = (wert as number) >= 0;
  const Icon = plus ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap font-bold ${plus ? "text-success" : "text-destructive"} ${
        gross ? "text-[32px] md:text-[40px]" : "text-[17px]"
      }`}
    >
      <Icon className={gross ? "h-8 w-8" : "h-4 w-4"} aria-hidden />
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
