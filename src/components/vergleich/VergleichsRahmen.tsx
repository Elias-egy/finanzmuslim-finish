import { kostenKurz } from "@/data/kostenKurz";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, ChevronDown, ChevronRight } from "lucide-react";
import { AnbieterLogo } from "@/components/AnbieterLogo";
import { BonusSchild, NotenBlock, ProduktDetails } from "./VergleichsBausteine";
import type { RohAnbieter } from "@/data/vergleichHelfer";
import type { VergleichsSpalte, VergleichsZeile } from "./vergleichTypen";

/**
 * Die Bauteile, die bei Finanzfluss auf jeder Vergleichsseite gleich sind:
 * Brotkrumen, Titel mit Untertitel, Vertrauensleiste mit Kennzahlen und
 * Prüfdatum, dazu der hervorgehobene Platz für die Empfehlung ganz oben.
 *
 * Sie liegen hier gemeinsam, damit Depot und Girokonto nicht auseinanderlaufen
 * und ein dritter Vergleich nur noch die Daten mitbringen muss.
 */

export const VergleichsBrotkrumen = ({ titel }: { titel: string }) => (
  <nav
    aria-label="Brotkrumen"
    className="flex flex-wrap items-center gap-1 text-[13px] text-muted-foreground"
  >
    <Link to="/" className="hover:text-primary">
      Start
    </Link>
    <ChevronRight className="h-3.5 w-3.5" aria-hidden />
    <Link to="/vergleiche" className="hover:text-primary">
      Vergleiche
    </Link>
    <ChevronRight className="h-3.5 w-3.5" aria-hidden />
    <span className="text-foreground">{titel}</span>
  </nav>
);

/**
 * Kennzahlen und Prüfdatum, nur am Laptop, rechts unter der Nummer 1. Ohne Foto
 * und ohne Namen (Elias, 19.09.2026). `stand` ist Pflicht: Ein Vergleich ohne
 * Datum ist wertlos.
 */
export const Kennzahlen = ({
  kennzahlen,
  stand,
  standHinweis,
  className = "",
}: {
  kennzahlen: Array<{ zahl: string | number; text: string }>;
  stand: string;
  standHinweis?: string;
  className?: string;
}) => (
  <div className={`${className} grid-cols-2 gap-3`}>
    {kennzahlen.slice(0, 2).map((k) => (
      <div key={k.text} className="rounded-lg border border-border p-4">
        <p className="text-[20px] font-bold text-foreground">{k.zahl}</p>
        <p className="text-[14px] leading-snug text-muted-foreground">{k.text}</p>
      </div>
    ))}
    <p className="col-span-2 text-[13px] text-muted-foreground">
      Stand: {stand}
      {standHinweis ? `. ${standHinweis}` : ""}
    </p>
  </div>
);

/** Ein Grund im Kasten der Nummer 1. */
type Punkt = { key: string; text: string };

/**
 * Gründe für einen Kasten, aus den Zeilen des Vergleichs: erfüllte Halal-Merkmale (höchstens vier),
 * dann die zwei Kostenwerte aus dem Raster.
 */
const gruende = (anbieter: RohAnbieter, zeilen: VergleichsZeile[]) => {
  const halal = zeilen
    .filter((z) => z.gruppe === "halal")
    .map((z): Punkt | null => {
      const w = anbieter.werte[z.key];
      if (z.art === "ampel") return w === "gut" ? { key: z.key, text: z.label } : null;
      // Zählungen „x von y“ und ein belegtes „ja“ (Royal Mint im Edelmetall-Vergleich, 04.11.2026).
      return typeof w === "string" && (/\d+ von \d+/.test(w) || /^ja\b/.test(w)) ? { key: z.key, text: `${z.label}: ${w}` } : null;
    })
    .filter((x): x is Punkt => !!x)
    .slice(0, 4);
  const kosten = zeilen
    .filter((z) => z.gruppe === "kosten" && z.imRaster && typeof anbieter.werte[z.key] === "string")
    .slice(0, 2)
    .map((z): Punkt => ({ key: z.key, text: `${z.label}: ${kostenKurz(anbieter.id, z.key) ?? anbieter.werte[z.key]}` }));
  return { halal, kosten };
};

/**
 * Der Kasten, der bei Finanzfluss "Bestes Depot" heißt. Die Nummer 1 entsteht aus
 * dem, was belegt ist (siehe `nummerEins` in `src/lib/rangfolge.ts`). Ein Partnerlink
 * ändert keine Note; in Depot, Girokonto und Krypto steht bei gleicher Sternzahl zuerst,
 * was einen eigenen Link hat (`linkVorrang`). Die Gründe darunter kommen aus den Zeilen des
 * Vergleichs: erfüllte Halal-Merkmale zuerst, dann die zwei Kostenwerte aus dem Raster.
 *
 * Auf dem Handy ersetzt der Kasten die Karte der Nummer 1. Deshalb trägt er dort dieselben
 * „Produktdetails“ wie jede Karte; am Laptop stehen sie in der Tabelle darunter.
 */
export const NummerEins = ({
  anbieter,
  zeilen,
  einheit,
  spalte,
  auszeichnung = "Unsere Nummer 1",
  note,
}: {
  anbieter: RohAnbieter;
  zeilen: VergleichsZeile[];
  einheit: string;
  /** Der Vergleich stellt bei gleicher Sternzahl zuerst, was einen eigenen Link hat (bleibt für die Aufrufer, steht nicht mehr am Kasten). */
  linkVorrang?: boolean;
  /** Die Nummer 1 als Spalte des Vergleichs, für die „Produktdetails“ auf dem Handy. */
  spalte?: VergleichsSpalte;
  /** Text im Kopfstreifen, im Depot-Vergleich „Bestes Halal-Depot“ (Elias CV17F, CV18F). */
  auszeichnung?: string;
  /** Unsere Note aus `rangfolge()`, als Wort, Zahl und Sterne wie bei Finanzfluss. */
  note?: number | null;
}) => {
  const [offen, setOffen] = useState(false);
  const { halal, kosten } = gruende(anbieter, zeilen);
  const punkte = [...halal, ...kosten];

  return (
    /* Flach wie Finanzfluss (Elias CV17F: „viereckige Kästen … als hätte das wirklich jemand eine
       Webseite gebaut“): ein Rahmen, eine Ecke von 8 px, kein Verlauf, kein Schatten. Die frühere
       Kleinschrift zur Rangfolge steht nicht mehr am Kasten (Elias 06.11.: kein Kleingedrucktes),
       „So bewerten wir“ steht unter der Tabelle. */
    <section className="overflow-hidden rounded-lg border border-primary bg-card" aria-label={auszeichnung}>
      {/* Streifen mit Platzzahl im Reiter wie die anderen Karten (Finanzfluss: „1 … Bestes Depot“). */}
      <p className="flex items-stretch border-b border-primary bg-primary text-[14px] font-semibold text-primary-foreground">
        <span className="flex min-w-[36px] items-center justify-center border-r border-primary-foreground/30 px-2">1</span>
        <span className="flex-1 px-4 py-1.5 text-center">{auszeichnung}</span>
      </p>
      <div className="p-4 xl:p-5">
        <div>
          <div>
            <p className="text-[18px] leading-snug text-foreground">
              {anbieter.link ? (
                <Link to={anbieter.link} rel="sponsored nofollow" className="text-primary underline underline-offset-2 hover:text-primary-hover">
                  <span className="font-bold">{anbieter.name}</span> {anbieter.produkt}*
                </Link>
              ) : (
                <>
                  <span className="font-bold">{anbieter.name}</span> {anbieter.produkt}
                </>
              )}
            </p>
          </div>
          {/* Logo und Note in zwei Kästchen wie jede Karte darunter. Ohne Note nur das Logo. */}
          <div className={`mt-3 grid gap-2 ${note != null ? "grid-cols-2" : "grid-cols-1"}`}>
            <div className="flex min-h-[68px] items-center justify-center rounded-lg border border-border p-2">
              <AnbieterLogo name={anbieter.name} domain={anbieter.domain} gross />
            </div>
            {note != null && (
              <div className="flex items-center justify-center rounded-lg border border-border p-2">
                <NotenBlock note={note} mittig />
              </div>
            )}
          </div>
        </div>
        {/* Ab `xl` ist der Kasten breit: die Gründe laufen in zwei Spalten, der Kasten wird niedriger. */}
        <ul className="mt-3 xl:mt-4 xl:columns-2 xl:gap-x-8">
          {punkte.map((punkt) => (
            <li key={punkt.key} className="mb-1.5 flex break-inside-avoid items-start gap-2 text-[14px] leading-snug text-foreground xl:mb-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              <span>{punkt.text}</span>
            </li>
          ))}
        </ul>
        {anbieter.link && (
          <div className="mt-2.5 xl:mt-3">
            <Link
              to={anbieter.link}
              rel="sponsored nofollow"
              className="flex min-h-[44px] w-full items-center justify-center rounded-md bg-primary px-4 text-[16px] font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              Zum Angebot*
            </Link>
          </div>
        )}
        <BonusSchild anbieterId={anbieter.id} />
        {spalte && (
          <div className="lg:hidden">
            <button
              type="button"
              onClick={() => setOffen((v) => !v)}
              aria-expanded={offen}
              className="mx-auto mt-1 flex min-h-[44px] items-center gap-1 text-[14px] font-medium text-primary"
            >
              Produktdetails
              <ChevronDown className={`h-4 w-4 transition-transform ${offen ? "rotate-180" : ""}`} aria-hidden />
            </button>
            {offen && <ProduktDetails spalte={spalte} zeilen={zeilen} ohne={punkte.map((x) => x.key)} />}
          </div>
        )}
      </div>
    </section>
  );
};

/**
 * Zwei Nummer 1 in einem Kasten (Elias, 08.11.2026, A11: Smartbroker+ und flatex „ergänzen sich optimal als zwei
 * Nummer 1 … der eine ist richtig gut in wenig Kosten und der andere … in vielen Anlagen“). Links Platz 1 der Liste
 * mit seinen Kosten, rechts der Eintrag mit den meisten belegten Halal-Anlagen mit seinen Zählungen. Kein Platz im
 * Reiter, weil die Liste darunter beide in ihrer Reihenfolge zeigt.
 */
export const ZweiNummerEins = ({
  titel,
  eintraege,
  zeilen,
}: {
  titel: string;
  /** `spalte` trägt die „Produktdetails“ für das Handy, wo der Kasten beide Karten ersetzt. */
  eintraege: Array<{ anbieter: RohAnbieter; auszeichnung: string; ton: "empfehlung" | "bonus"; note: number | null; zeigt: "kosten" | "halal"; spalte?: VergleichsSpalte }>;
  zeilen: VergleichsZeile[];
}) => {
  const [offen, setOffen] = useState<string | null>(null);
  const details = eintraege.find((e) => e.anbieter.id === offen);
  return (
  <section className="overflow-hidden rounded-lg border border-primary bg-card" aria-label={titel}>
    <p className="border-b border-primary bg-primary px-4 py-1.5 text-center text-[14px] font-semibold text-primary-foreground">{titel}</p>
    <div className="grid grid-cols-2 divide-x divide-border">
      {eintraege.map(({ anbieter, auszeichnung, ton, note, zeigt, spalte }) => {
        const { halal, kosten } = gruende(anbieter, zeilen);
        const punkte = zeigt === "kosten" ? kosten : halal.filter((p) => /\d+ von \d+/.test(p.text));
        return (
          <div key={anbieter.id} className="flex flex-col p-3 xl:p-4">
            <p
              className={`self-start rounded px-2 py-0.5 text-[12px] font-semibold xl:text-[13px] ${
                ton === "bonus" ? "bg-[#FFF8D6] text-[#7A5A00]" : "bg-accent text-primary"
              }`}
            >
              {auszeichnung}
            </p>
            <p className="mt-2 text-[16px] leading-snug text-foreground xl:text-[17px]">
              {anbieter.link ? (
                <Link to={anbieter.link} rel="sponsored nofollow" className="text-primary underline underline-offset-2 hover:text-primary-hover">
                  <span className="font-bold">{anbieter.name}</span>*
                </Link>
              ) : (
                <span className="font-bold">{anbieter.name}</span>
              )}
            </p>
            <div className="mt-2 flex min-h-[56px] items-center justify-center rounded-lg border border-border p-2">
              <AnbieterLogo name={anbieter.name} domain={anbieter.domain} gross />
            </div>
            {note != null && (
              <div className="mt-2">
                <NotenBlock note={note} klein />
              </div>
            )}
            <ul className="mt-2 mb-2.5">
              {punkte.map((punkt) => (
                <li key={punkt.key} className="mb-1 flex items-start gap-1.5 text-[13px] leading-snug text-foreground xl:text-[14px]">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
                  <span>{punkt.text}</span>
                </li>
              ))}
            </ul>
            {anbieter.link && (
              <Link
                to={anbieter.link}
                rel="sponsored nofollow"
                className="mt-auto flex min-h-[44px] w-full items-center justify-center rounded-md bg-primary px-2 text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
              >
                Zum Angebot*
              </Link>
            )}
            <BonusSchild anbieterId={anbieter.id} />
            {spalte && (
              <button
                type="button"
                onClick={() => setOffen((v) => (v === anbieter.id ? null : anbieter.id))}
                aria-expanded={offen === anbieter.id}
                className="mx-auto mt-1 flex min-h-[44px] items-center gap-1 text-[14px] font-medium text-primary lg:hidden"
              >
                Produktdetails
                <ChevronDown className={`h-4 w-4 transition-transform ${offen === anbieter.id ? "rotate-180" : ""}`} aria-hidden />
              </button>
            )}
          </div>
        );
      })}
    </div>
    {details?.spalte && (
      <div className="border-t border-border p-4 lg:hidden">
        <p className="mb-2 text-[15px] font-bold text-foreground">{details.anbieter.name}</p>
        <ProduktDetails spalte={details.spalte} zeilen={zeilen} ohne={[]} />
      </div>
    )}
  </section>
  );
};

/**
 * Ordnung der Liste, wenn es keine Nummer 1 gibt: alphabetisch, Kosten und Konditionen
 * stehen in der Tabelle. Nur ein rotes Zins-Merkmal ändert die Stellung.
 */
export const ReihenfolgeHinweis = ({ einheit }: { einheit: string }) => (
  <section className="mt-4 rounded-lg border border-border px-4 py-3 lg:mt-10 lg:border-primary/30 lg:bg-hero lg:px-6 lg:py-5">
    <p className="text-[14px] leading-snug text-muted-foreground lg:hidden">Alphabetisch sortiert.</p>
    <p className="hidden text-[16px] font-bold text-foreground lg:block">Alle {einheit} stehen alphabetisch</p>
    <p className="mt-1 hidden text-[15px] leading-[24px] text-muted-foreground lg:block">
      Kosten und Konditionen stehen in der Tabelle. Nur eines ändert die Reihenfolge: Wer sich
      nicht zinsfrei nutzen lässt, steht am Ende, ist rot markiert und bekommt von uns keinen Link.
    </p>
  </section>
);
