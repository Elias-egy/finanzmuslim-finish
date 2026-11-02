import { Link } from "react-router-dom";
import { AlertCircle, CheckCircle2, ChevronRight, CircleDot } from "lucide-react";
import AnbieterLogo from "@/components/AnbieterLogo";
import { AnlageLogo } from "@/components/AnlageZeile";
import type { KaufZeile } from "@/data/halalAnlagenKauf";
import { kartenLogos, nachweis, type Stufe } from "@/data/anlagenListe";

/** Ein Zeichen je Stufe: wie jung der gelesene Nachweis ist, nie ein eigenes Urteil. */
export const STUFE: Record<Stufe, { Icon: typeof CheckCircle2; farbe: string; wort: string }> = {
  aktuell: {
    Icon: CheckCircle2,
    farbe: "text-gain",
    wort: "mit Zertifikat oder Prüfbericht von 2025 oder 2026",
  },
  prospekt: {
    Icon: CircleDot,
    farbe: "text-primary",
    wort: "mit Prüfstelle laut Prospekt oder geprüftem Index",
  },
  aelter: {
    Icon: AlertCircle,
    farbe: "text-warning",
    wort: "mit jüngstem gefundenem Nachweis für 2023 oder früher",
  },
};

/**
 * Eine Anlage als kurze Karte mit kleinen Logos, in der Liste und seit MC7d15 auch in der ETF-Liste und im Gold-Plan
 * (Elias, 01.11.2026: „sozusagen auch eine Liste nur mit den ETFs“). Die Karte führt auf die Anlage-Seite.
 */
const AnlageKarte = ({ z, href, onTippen }: { z: KaufZeile; href: string; onTippen?: (el: HTMLElement) => void }) => {
  const logos = kartenLogos(z);
  const n = nachweis(z);
  const { Icon, farbe } = STUFE[n.stufe];
  return (
    <li>
      <Link
        to={href}
        onClick={(e) => onTippen?.(e.currentTarget)}
        data-karte={z.anlage.slug}
        className="card-surface block p-4 transition-shadow hover:ring-1 hover:ring-primary/30"
      >
        <div className="flex items-start gap-3">
          <AnlageLogo a={z.anlage} />
          <div className="min-w-0 flex-1">
            <p className="text-[16px] font-bold leading-snug text-foreground">{z.anlage.name}</p>
            <p className="mt-1 flex items-center gap-1.5 text-[13px] leading-snug text-foreground/80">
              <Icon className={`h-4 w-4 shrink-0 ${farbe}`} aria-hidden />
              {n.text}
            </p>
          </div>
          <ChevronRight className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
        </div>
        {/* Nur „Kaufen bei“ und die Logos, ohne Depot-Zahl und Kosten (Elias, 01.11.2026, MC7d15: „Das versteht keiner“). */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-[12px] text-muted-foreground">Kaufen bei</span>
          <span className="flex gap-1">
            {logos.map((d) => (
              <AnbieterLogo key={d.id} name={d.name} domain={d.domain} klein rand />
            ))}
          </span>
        </div>
      </Link>
    </li>
  );
};

export default AnlageKarte;
