import { useState } from "react";
import { BadgeCheck } from "lucide-react";
import { RenditeWert } from "@/components/Rendite";
import { aktienLogo, LOGO_DUNKEL } from "@/data/top100Aktien";
import type { AktienKurs } from "@/data/top100Kurse";

/**
 * Eine Zeile der 100 Halal-Aktien seit AF1 (12.11.2026): links das Logo aus dem Investment-OS, in der Mitte Name und
 * wofür man die Firma kennt, rechts die Kurslinie der letzten 7 Tage, der Kurs in Euro und die Veränderung
 * in 7 Tagen, gebaut wie die Zeile der Halal-Datenbank (`AnlageZeile.tsx`: Kurs oben, Veränderung mit Pfeil darunter).
 * Nicht anklickbar (Elias: „nee, die können nicht draufklicken“). Rot und Grün stehen für die Messung.
 */
const euro = (n: number) =>
  `${n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;

/** Kleine Kurslinie, ohne Achsen. Der Punkt am Ende ist der letzte Schlusskurs. */
export const KursLinie = ({ werte, minus, breit = 52 }: { werte: number[]; minus: boolean; breit?: number }) => {
  const b = breit;
  const h = 26;
  const min = Math.min(...werte);
  const max = Math.max(...werte);
  const spanne = max - min || 1;
  const pkt = werte.map((v, i) => [(i / (werte.length - 1)) * (b - 4) + 2, h - 3 - ((v - min) / spanne) * (h - 6)]);
  const d = pkt.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const [ex, ey] = pkt[pkt.length - 1];
  const farbe = minus ? "hsl(var(--loss))" : "hsl(var(--gain))";
  return (
    <svg width={b} height={h} viewBox={`0 0 ${b} ${h}`} aria-hidden className="shrink-0">
      <path d={d} fill="none" stroke={farbe} strokeWidth={1.75} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={ex} cy={ey} r={2.5} fill={farbe} />
    </svg>
  );
};

type Props = {
  name: string;
  ticker: string;
  bekanntFuer: string;
  kurs?: AktienKurs;
};

const KursZeile = ({ name, ticker, bekanntFuer, kurs }: Props) => {
  const [ohneLogo, setOhneLogo] = useState(false);
  return (
    <div className="flex items-center gap-2 border-b border-border px-2.5 py-2.5 last:border-b-0 md:gap-3 md:px-4" data-aktie={ticker}>
      <span
        className={`flex h-9 w-9 shrink-0 items-center md:h-10 md:w-10 justify-center overflow-hidden rounded-full border border-border ${
          LOGO_DUNKEL.has(ticker) ? "bg-[#111827]" : "bg-white"
        }`}
      >
        {ohneLogo ? (
          <span className="text-[12px] font-bold text-foreground">{ticker.replace(/[^A-Z0-9]/g, "").slice(0, 4)}</span>
        ) : (
          <img
            src={aktienLogo(ticker)}
            alt=""
            width={40}
            height={40}
            loading="lazy"
            onError={() => setOhneLogo(true)}
            className="h-full w-full object-contain p-1.5"
          />
        )}
      </span>
      <span className="min-w-0 flex-1">
        {/* Lange Namen brechen um statt abgeschnitten zu werden (390 px: „Marvell Technology“). */}
        <span className="block text-[15px] font-bold leading-tight text-foreground">
          {name}
          <BadgeCheck className="ml-1 inline h-4 w-4 align-[-3px] text-gain" aria-label="halal" />
        </span>
        <span className="mt-0.5 block truncate text-[13px] text-muted-foreground">{bekanntFuer}</span>
      </span>
      {kurs && (
        <>
          <span className="hidden min-[340px]:block">
            {/* Kurs der letzten 7 Tage (Elias, AF1-04: „mach mal kurs 7 tage“). */}
            <KursLinie werte={kurs.wocheLinie} minus={kurs.woche < 0} />
          </span>
          <span className="flex w-[74px] shrink-0 flex-col items-end md:w-[84px]">
            <span className="whitespace-nowrap text-[14px] font-semibold text-foreground">{euro(kurs.kurs)}</span>
            <RenditeWert wert={kurs.woche} mittel />
          </span>
        </>
      )}
    </div>
  );
};

export default KursZeile;
