import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnbieterLogo } from "@/components/AnbieterLogo";
import { AngebotsKnopf, BonusSchild, HinweisPunkt, ZellInhalt } from "./VergleichsBausteine";
import type { VergleichsSpalte, VergleichsZeile } from "./vergleichTypen";

/**
 * Dieselben Daten wie in der Tabelle, nur als Karten. Auf dem Handy ist die
 * gedrehte Tabelle unbrauchbar: eine Spalte von 208 Pixeln neben einer
 * Kriterienspalte laesst nichts uebrig.
 *
 * Aufbau je Karte: Logo, Name und Etikett oben, dann der
 * Knopf, dann die vier Zahlen, nach denen zuerst gesucht wird. Alles Weitere
 * liegt hinter "Produktdetails". Wer vergleichen will, hakt Karten an und
 * bekommt nur noch diese zu sehen.
 */

const etikettTon: Record<string, string> = {
  empfehlung: "bg-primary/10 text-primary",
  bonus: "bg-success/10 text-success",
  hinweis: "bg-accent/10 text-accent",
};

const Karte = ({
  spalte,
  zeilen,
  gewaehlt,
  waehle,
}: {
  spalte: VergleichsSpalte;
  zeilen: VergleichsZeile[];
  gewaehlt: boolean;
  waehle: (id: string) => void;
}) => {
  const [offen, setOffen] = useState(false);
  const raster = zeilen.filter((z) => z.imRaster).slice(0, 4);
  const rest = zeilen.filter((z) => !z.imRaster && !z.key.startsWith("__"));

  const hervor = spalte.etikett?.ton === "empfehlung";

  return (
    <li
      className={`overflow-hidden rounded-lg border bg-card ${
        spalte.abgeraten ? "border-destructive/40" : hervor ? "border-primary/40" : "border-border"
      }`}
    >
      {spalte.abgeraten && (
        <p className="border-b border-destructive/30 bg-destructive/10 px-3 py-1.5 text-[12px] font-semibold text-destructive">
          Davon raten wir ab
        </p>
      )}
      {/* Kopfstreifen: Logo, Produkt, Etikett. Keine Nummer, solange nicht bewertet ist. */}
      <div className="flex items-stretch border-b border-border">
        <span className="flex shrink-0 items-center pl-3">
          <AnbieterLogo name={spalte.anbieter} domain={spalte.domain} />
        </span>
        <span className="flex min-w-0 flex-1 items-center px-3 py-2 text-[15px] font-bold text-foreground">
          <span className="truncate">
            {spalte.anbieter} <span className="font-medium">{spalte.produkt}</span>
          </span>
        </span>
        {spalte.etikett && !spalte.abgeraten && (
          <span
            className={`flex shrink-0 items-center px-3 text-[12px] font-semibold ${etikettTon[spalte.etikett.ton]}`}
          >
            {spalte.etikett.text}
          </span>
        )}
      </div>

      <div className="p-3">
        {/* Ohne Partnerlink kein Knopf: ein grauer Knopf, den niemand drücken kann, kostet
            auf dem Handy bei 52 von 56 Karten zusammen fünf Bildschirme. */}
        {spalte.link && (
          <div className="mb-3">
            <AngebotsKnopf link={spalte.link} breit />
            <BonusSchild anbieterId={spalte.id} />
          </div>
        )}

        {/* Vier Zahlen, nach denen zuerst gesucht wird */}
        <dl className="grid grid-cols-2 gap-3">
          {raster.map((z) => (
            <div key={z.key} className="rounded-lg border border-border p-3 text-center">
              <dt className="text-[12px] leading-tight text-muted-foreground">
                {z.label}
                <HinweisPunkt text={z.hinweis} />
              </dt>
              <dd className="mt-1 text-[14px] font-semibold">
                <ZellInhalt wert={spalte.werte[z.key]} art={z.art} />
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <label className="flex min-h-[44px] cursor-pointer items-center gap-2 text-[14px] text-foreground">
            <input
              type="checkbox"
              checked={gewaehlt}
              onChange={() => waehle(spalte.id)}
              className="h-4 w-4 rounded border-border accent-[color:hsl(var(--primary))]"
            />
            Produkt vergleichen
          </label>
          <button
            type="button"
            onClick={() => setOffen((v) => !v)}
            aria-expanded={offen}
            className="inline-flex min-h-[44px] items-center gap-1 text-[14px] font-medium text-primary"
          >
            Produktdetails
            <ChevronDown
              className={`h-4 w-4 transition-transform ${offen ? "rotate-180" : ""}`}
              aria-hidden
            />
          </button>
        </div>

        {offen && (
          <dl className="border-t border-border pt-3">
            {rest.map((z) => (
              <div
                key={z.key}
                className="flex flex-wrap items-center justify-between gap-2 border-b border-border py-2 text-[14px] last:border-b-0"
              >
                <dt className="text-muted-foreground">
                  {z.label}
                  <HinweisPunkt text={z.hinweis} />
                </dt>
                <dd className="text-right">
                  <ZellInhalt wert={spalte.werte[z.key]} art={z.art} />
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </li>
  );
};

/** So viele Karten stehen zuerst da. Finanzfluss zeigt 27, bei uns sind die Karten alphabetisch, also weniger. */
const SEITE = 15;

export const VergleichsKarten = ({
  zeilen,
  spalten,
}: {
  zeilen: VergleichsZeile[];
  spalten: VergleichsSpalte[];
}) => {
  const [gewaehlt, setGewaehlt] = useState<string[]>([]);
  const [sichtbar, setSichtbar] = useState(SEITE);

  const waehle = (id: string) =>
    setGewaehlt((alt) => (alt.includes(id) ? alt.filter((x) => x !== id) : [...alt, id]));

  const auswahl = gewaehlt.length > 0;
  const alle = auswahl ? spalten.filter((s) => gewaehlt.includes(s.id)) : spalten;
  const zeigen = auswahl ? alle : alle.slice(0, sichtbar);

  return (
    <>
      {gewaehlt.length > 0 && (
        <div className="mb-4 flex items-center justify-between rounded-lg border border-primary/30 bg-hero px-4 py-3">
          <p className="text-[14px] text-foreground">
            {gewaehlt.length} zum Vergleichen ausgewählt
          </p>
          <button
            type="button"
            onClick={() => setGewaehlt([])}
            className="min-h-[44px] text-[14px] font-semibold text-primary"
          >
            Auswahl aufheben
          </button>
        </div>
      )}

      <ul className="space-y-4">
        {zeigen.map((s) => (
          <Karte
            key={s.id}
            spalte={s}
            zeilen={zeilen}
            gewaehlt={gewaehlt.includes(s.id)}
            waehle={waehle}
          />
        ))}
      </ul>

      {alle.length > zeigen.length && (
        <button
          type="button"
          onClick={() => setSichtbar((n) => n + SEITE)}
          className="mt-4 flex min-h-[52px] w-full items-center justify-center rounded-lg border border-border bg-card text-[16px] font-semibold text-foreground transition-colors hover:border-primary"
        >
          Mehr anzeigen ({alle.length - zeigen.length})
        </button>
      )}
    </>
  );
};

export default VergleichsKarten;
