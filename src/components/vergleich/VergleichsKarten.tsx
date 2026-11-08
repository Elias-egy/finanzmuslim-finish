import { useState } from "react";
import { Check, ChevronDown, Minus, X } from "lucide-react";
import { AnbieterLogo } from "@/components/AnbieterLogo";
import {
  AnbieterName,
  AngebotsKnopf,
  BonusSchild,
  NotenBlock,
  ProduktDetails,
  auszeichnungFarbe,
  auszeichnungGrund,
  auszeichnungVon,
  KreditHinweis,
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
 * Kopf wie bei Finanzfluss (SEO74): eckiger Reiter mit der Platzzahl links oben, daneben der Name blau
 * mit Stern, rechts die Auszeichnung als Text; darunter zwei Kästchen, Logo und Note mit Sternen.
 * Jede Karte ist der Kasten "Unsere Nummer 1" in klein: Logo, Name und Platz oben, dann die vier
 * Werte, nach denen zuerst gesucht wird, als Liste mit Haken, darunter der Knopf und die
 * Produktdetails (Elias, 14.10.2026: "eher wie Smart Broker in Mini", "zum Angebot eher unten").
 * Keine Kaestchen mehr: lange Kosten liefen dort auf fuenf Zeilen mit Trennstrichen. Das
 * Ankreuzen "Produkt vergleichen" entfaellt hier, am Laptop vergleicht die Tabelle. Alles Weitere
 * liegt hinter "Produktdetails", auch der Satz zur Zins-Ampel und die Quellen.
 */

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

  const auszeichnung = auszeichnungVon(spalte);
  const hervor = auszeichnung?.ton === "empfehlung";

  return (
    <li
      className={`flex flex-col overflow-hidden rounded-lg border ${
        spalte.abgeraten
          ? "border-destructive/40 bg-card"
          : `${hervor ? "border-primary" : "border-border"} ${(auszeichnung && auszeichnungGrund[auszeichnung.ton]) || "bg-card"}`
      }`}
    >
      {spalte.abgeraten && (
        <p className="border-b border-destructive/30 bg-destructive/10 px-4 py-1.5 text-[12px] font-semibold text-destructive">
          Davon raten wir ab
        </p>
      )}

      {/* Kopf: Reiter mit Platz, Name, Auszeichnung. Ohne Platz (alphabetische Vergleiche) kein Reiter. */}
      <div className="flex items-start gap-3 pr-4">
        {spalte.platz != null && (
          <span
            className={`flex h-9 min-w-[36px] shrink-0 items-center justify-center rounded-br-lg border-b border-r px-2 text-[15px] font-semibold ${
              hervor ? "border-primary bg-primary text-primary-foreground" : "border-border text-foreground"
            }`}
          >
            {spalte.platz}
          </span>
        )}
        <p className={`min-w-0 flex-1 py-2 text-[16px] leading-snug ${spalte.platz == null ? "pl-4" : ""}`}>
          <AnbieterName spalte={spalte} />
        </p>
        {auszeichnung && (
          <span className={`shrink-0 py-2.5 text-right text-[13px] font-semibold leading-tight ${auszeichnungFarbe[auszeichnung.ton]}`}>
            {auszeichnung.text}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col px-4 pb-1 pt-2">
        {/* Logo und Note in zwei Kästchen nebeneinander wie Finanzfluss. Ohne Note nur das Logo. */}
        <div className={`grid gap-2 ${spalte.note !== null ? "grid-cols-2" : "grid-cols-1"}`}>
          <div className="flex min-h-[68px] items-center justify-center rounded-lg border border-border bg-card p-2">
            <AnbieterLogo name={spalte.anbieter} domain={spalte.domain} gross />
          </div>
          {spalte.note !== null && (
            <div className="flex items-center justify-center rounded-lg border border-border bg-card p-2">
              <NotenBlock note={spalte.note} mittig />
            </div>
          )}
        </div>

        {spalte.kreditKurz && (
          <div className="mt-2.5">
            <KreditHinweis text={spalte.kreditKurz} />
          </div>
        )}

        {spalte.tarif && (
          <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] leading-snug text-muted-foreground">
            <span className="rounded bg-violet/10 px-2 py-0.5 text-[12px] font-semibold text-violet">
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
