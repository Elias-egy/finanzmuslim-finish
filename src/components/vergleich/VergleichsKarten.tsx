import { useState } from "react";
import { Check, ChevronDown, Minus, X } from "lucide-react";
import { AnbieterLogo } from "@/components/AnbieterLogo";
import {
  AngebotsKnopf,
  BonusSchild,
  ProduktDetails,
} from "./VergleichsBausteine";
import {
  KEINE_ANGABE,
  type VergleichsSpalte,
  type VergleichsZeile,
  type Zellwert,
} from "./vergleichTypen";

/**
 * Dieselben Daten wie in der Tabelle, nur als Karten fuer Handy und Tablet. Auf dem Handy ist die
 * gedrehte Tabelle unbrauchbar: eine Spalte von 208 Pixeln neben einer Kriterienspalte laesst
 * nichts uebrig.
 *
 * Jede Karte ist der Kasten "Unsere Nummer 1" in klein: Logo, Name und Platz oben, dann die vier
 * Werte, nach denen zuerst gesucht wird, als Liste mit Haken, darunter der Knopf und die
 * Produktdetails (Elias, 14.10.2026: "eher wie Smart Broker in Mini", "zum Angebot eher unten").
 * Keine Kaestchen mehr: lange Kosten liefen dort auf fuenf Zeilen mit Trennstrichen. Das
 * Ankreuzen "Produkt vergleichen" entfaellt hier, am Laptop vergleicht die Tabelle. Alles Weitere
 * liegt hinter "Produktdetails", auch der Satz zur Zins-Ampel und die Quellen.
 */

const etikettTon: Record<string, string> = {
  empfehlung: "bg-primary/10 text-primary",
  bonus: "bg-success/10 text-success",
  hinweis: "bg-accent/10 text-accent",
  platz: "bg-muted text-foreground",
};

type Zeichen = "ja" | "teils" | "nein" | "offen";

/** Zeichen und Satz einer Zeile: Kriterium und Wert als ein Satz wie beim Sieger. */
const punktText = (
  zeile: VergleichsZeile,
  wert?: Zellwert,
): [Zeichen, string] => {
  const offen: [Zeichen, string] = ["offen", `${zeile.label}: ${KEINE_ANGABE}`];
  if (zeile.art === "ampel") {
    const status = wert?.status ?? "unbekannt";
    if (status === "gut") return ["ja", zeile.label];
    if (status === "teils") return ["teils", `${zeile.label}: ${zeile.teilsText ?? "abschaltbar"}`];
    if (status === "schlecht") return ["nein", `${zeile.label}: nein`];
    return offen;
  }
  if (zeile.art === "janein") {
    if (wert?.jaNein === true) return ["ja", zeile.label];
    if (wert?.jaNein === false) return ["nein", `${zeile.label}: nein`];
    return offen;
  }
  return wert?.text ? ["ja", `${zeile.label}: ${wert.kurz ?? wert.text}`] : offen;
};

const Punkt = ({
  zeile,
  wert,
}: {
  zeile: VergleichsZeile;
  wert?: Zellwert;
}) => {
  const [zeichen, text] = punktText(zeile, wert);
  const Icon = zeichen === "nein" ? X : zeichen === "offen" ? Minus : Check;
  const farbe = {
    ja: "text-primary",
    teils: "text-warning",
    nein: "text-destructive",
    offen: "text-muted-foreground/60",
  }[zeichen];
  return (
    <li className="flex items-start gap-2 text-[14px] leading-snug text-foreground">
      <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${farbe}`} aria-hidden />
      <span
        className={zeichen === "offen" ? "text-muted-foreground" : undefined}
      >
        {text}
      </span>
    </li>
  );
};

const Karte = ({
  spalte,
  zeilen,
}: {
  spalte: VergleichsSpalte;
  zeilen: VergleichsZeile[];
}) => {
  const [offen, setOffen] = useState(false);
  const raster = zeilen.filter((z) => z.imRaster).slice(0, 4);

  const hervor = spalte.etikett?.ton === "empfehlung";

  return (
    <li
      className={`flex flex-col overflow-hidden rounded-xl border bg-card ${
        spalte.abgeraten
          ? "border-destructive/40"
          : hervor
            ? "border-primary ring-2 ring-primary/15"
            : "border-border"
      }`}
    >
      {spalte.abgeraten && (
        <p className="border-b border-destructive/30 bg-destructive/10 px-4 py-1.5 text-[12px] font-semibold text-destructive">
          Davon raten wir ab
        </p>
      )}

      <div className="flex flex-1 flex-col px-4 pb-1 pt-4">
        {/* Kopf: Logo, Produkt, Platz. Keine Nummer, solange nicht bewertet ist. */}
        <div className="flex items-center gap-3">
          <AnbieterLogo name={spalte.anbieter} domain={spalte.domain} />
          <p className="min-w-0 flex-1 text-[16px] leading-snug text-foreground">
            <span className="font-bold">{spalte.anbieter}</span>{" "}
            {spalte.produkt}
          </p>
          {spalte.etikett && !spalte.abgeraten && (
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-[12px] font-semibold ${etikettTon[spalte.etikett.ton]}`}
            >
              {spalte.etikett.text}
            </span>
          )}
        </div>

        {spalte.tarif && (
          <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] leading-snug text-muted-foreground">
            <span className="rounded-full bg-violet/10 px-2 py-0.5 text-[12px] font-semibold text-violet">
              {spalte.tarif.marke}
            </span>
            {spalte.tarif.satz}
          </p>
        )}

        <ul className="mt-3 space-y-1.5">
          {raster.map((z) => (
            <Punkt key={z.key} zeile={z} wert={spalte.werte[z.key]} />
          ))}
        </ul>

        {/* Ohne Partnerlink kein Knopf, nur eine Zeile: ein Knopf, den niemand drücken kann,
            kostet auf dem Handy über viele Karten mehrere Bildschirme. */}
        {/* Knopf und Details unten buendig, auch wenn die Karten auf dem Tablet ungleich lang sind. */}
        <div className="mt-auto">
          {spalte.link ? (
            <div className="mt-3">
              <AngebotsKnopf link={spalte.link} breit klein />
              <BonusSchild anbieterId={spalte.id} />
            </div>
          ) : (
            !spalte.abgeraten && (
              <p className="mt-3 text-[13px] text-muted-foreground">
                Beim Anbieter direkt abschließbar
              </p>
            )
          )}

          <button
            type="button"
            onClick={() => setOffen((v) => !v)}
            aria-expanded={offen}
            className="mx-auto mt-1 flex min-h-[44px] items-center gap-1 text-[14px] font-medium text-primary"
          >
            Produktdetails
            <ChevronDown
              className={`h-4 w-4 transition-transform ${offen ? "rotate-180" : ""}`}
              aria-hidden
            />
          </button>
        </div>

        {offen && <ProduktDetails spalte={spalte} zeilen={zeilen} markieren />}
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
  const [sichtbar, setSichtbar] = useState(SEITE);
  const zeigen = spalten.slice(0, sichtbar);

  return (
    <>
      {/* Tablet: zwei Karten nebeneinander, sonst laufen Liste und Knopf über die ganze Breite. */}
      <ul className="space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
        {zeigen.map((s) => (
          <Karte key={s.id} spalte={s} zeilen={zeilen} />
        ))}
      </ul>

      {spalten.length > zeigen.length && (
        <button
          type="button"
          onClick={() => setSichtbar((n) => n + SEITE)}
          className="mt-4 flex min-h-[52px] w-full items-center justify-center rounded-lg border border-border bg-card text-[16px] font-semibold text-foreground transition-colors hover:border-primary"
        >
          Mehr anzeigen ({spalten.length - zeigen.length})
        </button>
      )}
    </>
  );
};

export default VergleichsKarten;
