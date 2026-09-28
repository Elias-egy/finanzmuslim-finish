import { useEffect, useState } from "react";
import { ENDE_MS, abgelaufen, restzeit } from "@/lib/sperrfenster";

/**
 * Timer bis zum Start. Feste Kästen und Ziffern gleicher Breite, damit beim
 * Sekundenwechsel nichts springt. Der Takt richtet sich an der vollen Sekunde aus.
 */

const zwei = (n: number) => String(n).padStart(2, "0");

type Props = { onEnde: () => void; klein?: boolean };

const Countdown = ({ onEnde, klein = false }: Props) => {
  const [jetzt, setJetzt] = useState(() => Date.now());

  useEffect(() => {
    let uhr: number;
    const tick = () => {
      const t = Date.now();
      setJetzt(t);
      if (abgelaufen(t)) {
        onEnde();
        return;
      }
      uhr = window.setTimeout(tick, 1000 - (t % 1000) + 5);
    };
    tick();
    return () => window.clearTimeout(uhr);
  }, [onEnde]);

  const r = restzeit(jetzt, ENDE_MS);
  const felder = [
    { wert: r.tage, name: "Tage" },
    { wert: r.stunden, name: "Std" },
    { wert: r.minuten, name: "Min" },
    { wert: r.sekunden, name: "Sek" },
  ];

  return (
    <div
      role="timer"
      aria-label={`Noch ${r.tage} Tage und ${r.stunden} Stunden bis zum Start`}
      className="flex justify-center gap-2"
    >
      {felder.map((f) => (
        <div
          key={f.name}
          aria-hidden
          className={`flex flex-col items-center justify-center rounded-xl border border-white/15 bg-white/[0.07] ${
            klein ? "h-[64px] w-[64px]" : "h-[72px] w-[72px] sm:h-[84px] sm:w-[84px]"
          }`}
        >
          <span
            className={`font-bold leading-none tabular-nums text-white ${
              klein ? "text-[22px]" : "text-[26px] sm:text-[30px]"
            }`}
          >
            {zwei(f.wert)}
          </span>
          <span className="mt-1.5 text-[12px] leading-none text-white/70 sm:text-[13px]">{f.name}</span>
        </div>
      ))}
    </div>
  );
};

export default Countdown;
