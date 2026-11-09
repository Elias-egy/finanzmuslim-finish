import { useRef } from "react";
import { useImBild } from "@/components/portfolioplan/Zaehler";

/**
 * Kleine Flächen-Kurve aus kurse.json `verlauf` (60 Monatswerte 0 bis 100), wie die Finance-Dashboards auf Pinterest
 * (Laufzettel cv28p, Gefühlsblatt: „Flächen-Kurven … Kurven zeichnen sich 1,2 s (stroke-dashoffset) und die Fläche blendet
 * ein“). Linie 2 px in der Baustein-Farbe, Fläche darunter 18 % Deckkraft, kein Verlauf; im Dunkel-Modus leuchtet sie
 * leicht (portfolioplan.css). Zeichnet sich einmal, wenn sie ins Bild kommt.
 */
export const Kurve = ({
  verlauf,
  farbe,
  breite = 96,
  hoehe = 34,
  className = "",
}: {
  verlauf: number[];
  farbe: string;
  breite?: number;
  hoehe?: number;
  className?: string;
}) => {
  const ref = useRef<SVGSVGElement>(null);
  const da = useImBild(ref);
  const rand = 2;
  const n = verlauf.length;
  const punkte = verlauf.map((v, i) => [
    (i / (n - 1)) * breite,
    rand + (1 - Math.max(0, Math.min(100, v)) / 100) * (hoehe - 2 * rand),
  ]);
  const linie = punkte.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const flaeche = `${linie} L${breite} ${hoehe} L0 ${hoehe} Z`;
  return (
    <svg
      ref={ref}
      width={breite}
      height={hoehe}
      viewBox={`0 0 ${breite} ${hoehe}`}
      className={`pp-kurve shrink-0 overflow-visible ${da ? "ist-sichtbar" : ""} ${className}`}
      style={{ ["--pp-kurve" as string]: farbe }}
      aria-hidden
    >
      <path className="pp-kurve-flaeche" d={flaeche} fill={farbe} fillOpacity={0.18} />
      <path
        className="pp-kurve-linie"
        d={linie}
        fill="none"
        stroke={farbe}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
      />
    </svg>
  );
};

export default Kurve;
