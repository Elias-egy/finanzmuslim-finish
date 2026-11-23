import { useState } from "react";
import GiroKnopfHinweis from "@/components/GiroKnopfHinweis";
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
} from "./VergleichsBausteine";
import {
  KEINE_ANGABE,
  type VergleichsSpalte,
  type VergleichsZeile,
  type Zellwert,
} from "./vergleichTypen";
import { istMindestens } from "@/lib/platzAnsicht";
import { platzTon } from "./VergleichsTabelle";
import { GiroInhalt, type GiroWerte } from "./GiroKarten";
import { DepotInhalt, type DepotWerte } from "./DepotKarten";
import { stilVon } from "./karteStil";

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
  const offen: [Zeichen, string] = ["offen", `${zeile.label}: ${zeile.art === "ampel" && wert?.text ? wert.text : KEINE_ANGABE}`];
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
    ja: "text-success",
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

/** Depot-Karte: dieselben Zellen wie die Tabelle, nichts neu gerechnet. Die Kosten pro Order in der Kurzform. */
export const depotWerteVon = (spalte: VergleichsSpalte): DepotWerte => ({
  zinsfrei: spalte.werte.zinsfreiAbStart?.status,
  halalEtfsFonds: spalte.werte.halalEtfsFonds?.text,
  halalSukuk: spalte.werte.halalSukuk?.text,
  depotgebuehr: spalte.werte.depotgebuehr?.text,
  orderkosten: spalte.werte.orderkosten?.kurz ?? spalte.werte.orderkosten?.text,
});

/** Girokonto-Karte: die Werte aus den Zellen der Spalte, damit Kacheln und Tabelle dasselbe sagen. */
export const giroWerteVon = (spalte: VergleichsSpalte): GiroWerte => ({
  zinsfrei: spalte.werte.zinsfreiAbStart?.status,
  keinDispo: spalte.werte.keinDispoAbStart?.status,
  kontofuehrung: spalte.werte.kontofuehrung?.text,
  kontofuehrungKurz: spalte.werte.kontofuehrung?.kurz,
  geldautomaten: spalte.werte.geldautomaten?.text,
  girocard: spalte.werte.girocard?.text,
  debitkarte: spalte.werte.debitkarte?.text,
  // Nur Geschäftskonto: die Zeile gibt es sonst nicht, dann bleibt es bei den Kacheln des Girokontos.
  buchungen: spalte.werte.buchungen ? (spalte.werte.buchungen.kurz ?? spalte.werte.buchungen.text) : undefined,
  abheben: spalte.werte.abheben ? spalte.werte.abheben.text : undefined,
  ohneGirocard: spalte.werte.girocard === undefined,
  abhebungen: spalte.werte.abhebungen?.text,
  fremdZahlen: spalte.werte.auslandFremdZahlen?.text,
});

const Karte = ({
  spalte,
  zeilen,
  platzZeilen = [],
  giro,
  depot,
}: {
  spalte: VergleichsSpalte;
  zeilen: VergleichsZeile[];
  platzZeilen?: VergleichsZeile[];
  /** Nur Girokonto: Kacheln statt Hakenliste, blaue und orange Karten (Elias PH2-01). `besonders` je Anbieter-ID. */
  giro?: { besonders: Record<string, string[]> };
  /** Nur Depot: dieselben Karten mit vier Kacheln (Halal-ETFs, Sukuk, Depotgebühr, Kosten pro Order). */
  depot?: boolean;
}) => {
  const [offen, setOffen] = useState(false);
  const [platzOffen, setPlatzOffen] = useState(false);
  const mindestens = zeilen.filter((z) => istMindestens(spalte.werte[z.key]?.text));
  const raster = zeilen.filter((z) => z.imRaster).slice(0, 4);

  const auszeichnung = auszeichnungVon(spalte);
  const hervor = auszeichnung?.ton === "empfehlung";

  /* Girokonto und Depot: Platz 1 hellblau, eine Karte mit Bonus oder zweiter Auszeichnung hellorange (karteStil.ts). Der Reiter trägt den Text. */
  const stilKarte = Boolean(giro || depot);
  const reiter = stilKarte ? stilVon(spalte) : null;
  const giroFarbe = reiter?.stil ?? null;
  const reiterText = reiter?.text ?? null;

  return (
    <li
      className={`flex flex-col overflow-hidden rounded-lg border ${
        spalte.grau
          ? "border-border bg-zinc-200 dark:bg-muted"
          : spalte.abgeraten
          ? "border-destructive/40 bg-card"
          : stilKarte
          ? giroFarbe?.karte ?? "border-border bg-card"
          : `${hervor ? "border-primary" : "border-border"} ${(auszeichnung && auszeichnungGrund[auszeichnung.ton]) || "bg-card"}`
      }`}
    >
      {spalte.abgeraten && (
        <p className="border-b border-destructive/30 bg-destructive/10 px-4 py-1.5 text-[12px] font-semibold text-destructive">
          Davon raten wir ab
        </p>
      )}

      {/* Girokonto mit Reiter (Platz 1, Bonus): ein Streifen mit Platzzahl und Text wie beim Kasten der Nummer 1. */}
      {stilKarte && giroFarbe && reiterText && (
        <p className={`flex items-stretch border-b text-[14px] font-semibold ${giroFarbe.reiter}`}>
          {spalte.platz != null && (
            <span className={`flex min-w-[36px] items-center justify-center border-r ${giroFarbe.trenner} px-2`}>{spalte.platz}</span>
          )}
          <span className="flex-1 px-4 py-1.5 text-center">{reiterText}</span>
        </p>
      )}

      {/* Kopf: Reiter mit Platz, Name, Auszeichnung. Ohne Platz (alphabetische Vergleiche) kein Reiter. */}
      <div className="flex items-start gap-3 pr-4">
        {spalte.platz != null && !(stilKarte && giroFarbe && reiterText) && (
          <span
            className={`flex h-9 min-w-[36px] shrink-0 items-center justify-center rounded-br-lg border-b border-r px-2 text-[15px] font-semibold ${
              hervor ? "border-primary bg-primary text-primary-foreground" : "border-border text-foreground"
            }`}
          >
            {spalte.platz}
          </span>
        )}
        <p className={`min-w-0 flex-1 py-2 text-[16px] leading-snug ${spalte.platz == null || (stilKarte && giroFarbe && reiterText) ? "pl-4" : ""}`}>
          <AnbieterName spalte={spalte} />
        </p>
        {auszeichnung && !stilKarte && (
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

        {spalte.tarif && (
          <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] leading-snug text-muted-foreground">
            <span className="rounded bg-violet/10 px-2 py-0.5 text-[12px] font-semibold text-violet">
              {spalte.tarif.marke}
            </span>
            {spalte.tarif.satz}
          </p>
        )}

        {spalte.grau && spalte.zerlegung?.__platz_fehlt && (
          <p className="mt-2 text-[13px] font-semibold leading-snug text-destructive">
            fehlt: {spalte.zerlegung.__platz_fehlt.text}
          </p>
        )}

        {giro ? (
          <GiroInhalt w={giroWerteVon(spalte)} besonders={giro.besonders[spalte.id]} />
        ) : depot ? (
          <DepotInhalt w={depotWerteVon(spalte)} />
        ) : (
          <ul className="mt-3 space-y-1.5">
            {raster.map((z) => (
              <Punkt key={z.key} zeile={z} wert={spalte.werte[z.key]} />
            ))}
          </ul>
        )}

        {platzZeilen.length > 0 && mindestens.length > 0 && (
          <p className="mt-2 rounded-md bg-warning/15 px-2 py-1 text-[13px] leading-snug text-foreground ring-1 ring-inset ring-warning/50">
            „mind.“: {mindestens.map((z) => `${z.label} ${spalte.werte[z.key]?.text}`).join(", ")}
          </p>
        )}

        {platzZeilen.length > 0 && spalte.zerlegung && (
          <div className="mt-3 rounded-lg bg-accent/60 px-3 py-2">
            <button
              type="button"
              onClick={() => setPlatzOffen((v) => !v)}
              aria-expanded={platzOffen}
              className="flex min-h-[40px] w-full items-center justify-between text-left text-[14px] font-semibold text-foreground"
            >
              <span>
                So entsteht der Platz: Note {spalte.zerlegung.__platz_note?.text.split(" ")[0]}
              </span>
              <ChevronDown className={`h-4 w-4 transition-transform ${platzOffen ? "rotate-180" : ""}`} aria-hidden />
            </button>
            {platzOffen && (
              <dl className="mt-1 space-y-1 pb-1 text-[13px] leading-snug">
                {platzZeilen
                  .filter((z) => z.key !== "__platz_fehlt" || spalte.grau)
                  .map((z) => (
                    <div key={z.key} className="flex justify-between gap-3">
                      <dt className="text-foreground">{z.label}</dt>
                      <dd className={`text-right ${platzTon[spalte.zerlegung?.[z.key]?.ton ?? ""] ?? "text-foreground"}`}>
                        {spalte.zerlegung?.[z.key]?.text ?? "–"}
                      </dd>
                    </div>
                  ))}
              </dl>
            )}
          </div>
        )}

        {/* Ohne Partnerlink kein Knopf, nur eine Zeile: ein Knopf, den niemand drücken kann,
            kostet auf dem Handy über viele Karten mehrere Bildschirme. */}
        {/* Knopf und Details unten buendig, auch wenn die Karten auf dem Tablet ungleich lang sind. */}
        <div className="mt-auto">
          {spalte.link ? (
            <div className="mt-3">
              {/* RN21: grüne Meldung direkt über dem Knopf statt „Achtung“ oben in der Karte (PH3-02) */}
              <GiroKnopfHinweis anbieter={spalte.id} className="mb-2.5" />
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

/** So viele Anbieter stehen zuerst da, wie bei Finanzfluss am Handy und am Laptop (15, gemessen 08.11.2026). */
export const SEITE = 15;

export const VergleichsKarten = ({
  zeilen,
  spalten,
  zuerst = SEITE,
  platzZeilen,
  giro,
  depot,
}: {
  zeilen: VergleichsZeile[];
  spalten: VergleichsSpalte[];
  /** Steht die Nummer 1 als eigener Kasten darüber, zählt sie mit: dann eine Karte weniger. */
  zuerst?: number;
  /** Nur Ansicht A3 (Localhost, `?ansicht=a3`): Zeilen „So entsteht der Platz“. */
  platzZeilen?: VergleichsZeile[];
  /** Nur Girokonto, siehe `Karte`. */
  giro?: { besonders: Record<string, string[]> };
  /** Nur Depot, siehe `Karte`. */
  depot?: boolean;
}) => {
  const [sichtbar, setSichtbar] = useState(zuerst);
  const zeigen = spalten.slice(0, sichtbar);

  return (
    <>
      {/* Tablet: zwei Karten nebeneinander, sonst laufen Liste und Knopf über die ganze Breite. */}
      <ul className="space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
        {zeigen.map((s) => (
          <Karte key={s.id} spalte={s} zeilen={zeilen} platzZeilen={platzZeilen} giro={giro} depot={depot} />
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
