import { Link } from "react-router-dom";
import { Check, ChevronRight } from "lucide-react";
import { AnbieterLogo } from "@/components/AnbieterLogo";
import { BonusSchild } from "./VergleichsBausteine";
import type { RohAnbieter } from "@/data/vergleichHelfer";
import type { VergleichsZeile } from "./vergleichTypen";

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

/**
 * Der Kasten, der bei Finanzfluss "Bestes Depot" heißt. Die Nummer 1 entsteht aus
 * dem, was belegt ist (siehe `halalBelegt` in `src/lib/vergleichAssistent.ts`),
 * Partnerstatus zählt nicht. Die Gründe darunter kommen aus den Zeilen des
 * Vergleichs: erfüllte Halal-Merkmale zuerst, dann die zwei Kostenwerte aus dem Raster.
 */
export const NummerEins = ({ anbieter, zeilen, einheit }: { anbieter: RohAnbieter; zeilen: VergleichsZeile[]; einheit: string }) => {
  const halal = zeilen
    .filter((z) => z.gruppe === "halal")
    .map((z) => {
      const w = anbieter.werte[z.key];
      if (z.art === "ampel") return w === "gut" ? z.label : null;
      return typeof w === "string" && /\d+ von \d+/.test(w) ? `${z.label}: ${w}` : null;
    })
    .filter((x): x is string => !!x)
    .slice(0, 4);
  const kosten = zeilen
    .filter((z) => z.gruppe === "kosten" && z.imRaster && typeof anbieter.werte[z.key] === "string")
    .slice(0, 2)
    .map((z) => `${z.label}: ${anbieter.werte[z.key]}`);

  return (
    <section className="overflow-hidden rounded-2xl border-2 border-primary bg-primary" aria-label="Unsere Nummer 1">
      <p className="px-4 py-2 text-center text-[14px] font-semibold text-primary-foreground">Unsere Nummer 1</p>
      <div className="rounded-t-2xl bg-card p-4">
        <div className="flex items-center gap-3">
          <AnbieterLogo name={anbieter.name} domain={anbieter.domain} gross />
          <p className="min-w-0 flex-1 text-[18px] leading-snug text-foreground">
            <span className="font-bold">{anbieter.name}</span> {anbieter.produkt}
          </p>
        </div>
        <ul className="mt-3 space-y-1.5">
          {[...halal, ...kosten].map((satz) => (
            <li key={satz} className="flex items-start gap-2 text-[14px] leading-snug text-foreground">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              {satz}
            </li>
          ))}
        </ul>
        {anbieter.link && (
          <div className="mt-4">
            <Link
              to={anbieter.link}
              rel="sponsored nofollow"
              className="flex min-h-[48px] w-full items-center justify-center rounded-lg bg-primary px-4 text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              Zum Angebot*
            </Link>
          </div>
        )}
        <BonusSchild anbieterId={anbieter.id} />
        <p className="mt-3 text-[12px] leading-snug text-muted-foreground">
          Aus dem, was wir beim Anbieter belegt haben. Partnerschaften zählen nicht. Die übrigen {einheit} stehen alphabetisch, bis alle
          geprüft sind.{" "}
          <Link to="/vergleiche/methodik" className="font-semibold text-primary hover:underline">
            So bewerten wir
          </Link>
        </p>
      </div>
    </section>
  );
};

/**
 * Steht dort, wo bei Finanzfluss "Bestes Depot" steht. Solange nicht alle
 * Anbieter geprüft sind, gibt es keine Nummer eins und keine Reihenfolge nach
 * Punkten. Eine vorläufige Rangfolge würde Anbieter bewerten, bei denen wir
 * noch nicht nachgesehen haben.
 */
export const ReihenfolgeHinweis = ({ einheit }: { einheit: string }) => (
  <section className="mt-4 rounded-lg border border-border px-4 py-3 lg:mt-10 lg:border-primary/30 lg:bg-hero lg:px-6 lg:py-5">
    {/* Handy: ein Satz. Die lange Fassung steht auf dem Laptop und in der Methodik. */}
    <p className="text-[14px] leading-snug text-muted-foreground lg:hidden">
      Alphabetisch sortiert. Die Bewertung folgt, sobald alle {einheit} geprüft sind.
    </p>
    <p className="hidden text-[16px] font-bold text-foreground lg:block">Die Bewertung folgt, sobald alle {einheit} geprüft sind</p>
    <p className="mt-1 hidden text-[15px] leading-[24px] text-muted-foreground lg:block">
      Bis dahin stehen alle {einheit} alphabetisch. Kosten und Konditionen sind eingetragen, die
      Halal-Merkmale prüfen wir einzeln beim Anbieter. Nur eines ändert die Reihenfolge: Wer sich
      nicht zinsfrei nutzen lässt, steht am Ende, ist rot markiert und bekommt von uns keinen Link.
    </p>
  </section>
);
