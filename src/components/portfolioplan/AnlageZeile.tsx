import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { AnlageLogo } from "@/components/AnlageZeile";
import { Kurve } from "@/components/portfolioplan/Kurve";
import { prozentText, type Produkt } from "@/data/portfolioQuiz";

const Wert = ({ label, n, text }: { label: string; n?: number; text?: string }) => (
  <span className="mr-3 inline-block whitespace-nowrap text-[13px] tabular-nums text-foreground/75 md:mr-0 md:block md:text-[14px]">
    {label} <b className={n === undefined ? "text-foreground" : n >= 0 ? "text-gain" : "text-loss"}>{n === undefined ? text : prozentText(n)}</b>
  </span>
);

/**
 * Eine Anlage im Dashboard des Portfolioplans (CV28P, 09.11.2026): Logo, Name, kleine Flächen-Kurve, rechts zuerst die
 * Kosten im Jahr (Leser-Regel „Kosten zuerst“, Prüfer CV29P Fund 2; aus `kosten` in halalAnlagen.ts), dann 1 Jahr und
 * 5 Jahre; die ganze Zeile führt in die Halal-Datenbank (Elias CV26P: „wenn du die anklickst, auf meine Datenbank“).
 * Nie eine Prozentzahl für den Anteil an einer Anlage (memory prozente-nur-je-baustein-gold-ausnahme-royal-mint).
 * Am Handy steht die Rendite unter dem Namen, am Laptop rechts; der Text steht nur einmal im Code.
 */
export const PlanAnlageZeile = ({
  produkt,
  farbe,
  unter,
  marke,
  mitLogo = true,
  nurEinJahr = false,
  className = "",
}: {
  produkt: Produkt;
  farbe: string;
  /** Zweite Zeile unter dem Namen, etwa das Kategorie-Wort. */
  unter?: string;
  /** Kleine Pille neben dem Namen, etwa „Unser Favorit“. */
  marke?: ReactNode;
  mitLogo?: boolean;
  nurEinJahr?: boolean;
  className?: string;
}) => {
  const { anlage, r1, r5, verlauf, seit } = produkt;
  const zeigeR5 = !nurEinJahr && r5 !== undefined;
  const hatRendite = true;
  const kosten = anlage.kostenLabel === "keine" ? "keine" : `${anlage.kostenLabel} im Jahr`;
  return (
    <Link
      to={`/halal-anlagen/${anlage.slug}`}
      className={`pp-zeile grid items-center gap-x-3 gap-y-0.5 rounded-xl px-2 py-2.5 transition-colors hover:bg-muted ${
        mitLogo
          ? "grid-cols-[40px_minmax(0,1fr)_auto] md:grid-cols-[40px_minmax(0,1fr)_auto_auto]"
          : "grid-cols-[minmax(0,1fr)_auto] md:grid-cols-[minmax(0,1fr)_auto_auto]"
      } ${className}`}
    >
      {mitLogo && (
        <span className="row-span-2 md:row-span-1">
          <AnlageLogo a={anlage} />
        </span>
      )}
      <span className="min-w-0">
        <span className="block text-[15px] font-semibold leading-tight text-foreground">
          {anlage.name}
          {marke && <span className="block md:inline"> {marke}</span>}
        </span>
        {unter && <span className="mt-0.5 block text-[13px] leading-tight text-foreground/60">{unter}</span>}
      </span>
      <span className="row-span-2 md:row-span-1">
        {verlauf ? (
          <Kurve verlauf={verlauf} farbe={farbe} breite={72} hoehe={30} className="md:hidden" />
        ) : null}
        {verlauf ? <Kurve verlauf={verlauf} farbe={farbe} breite={104} hoehe={34} className="hidden md:block" /> : null}
      </span>
      {hatRendite && (
        <span className={`${mitLogo ? "col-start-2" : "col-start-1"} row-start-2 md:col-start-auto md:row-start-auto md:min-w-[124px] md:text-right`}>
          {!nurEinJahr && <Wert label="Kosten" text={kosten} />}
          {r1 !== undefined && <Wert label="1 Jahr" n={r1} />}
          {zeigeR5 && <Wert label="5 Jahre" n={r5!} />}
          {r1 === undefined && !zeigeR5 && seit && (
            <span className="inline-block whitespace-nowrap text-[13px] text-foreground/75 md:block md:text-[14px]">{seit}</span>
          )}
        </span>
      )}
    </Link>
  );
};

export default PlanAnlageZeile;
