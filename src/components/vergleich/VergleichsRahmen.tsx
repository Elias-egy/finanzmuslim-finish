import { Link } from "react-router-dom";
import { Award, Check, ChevronRight } from "lucide-react";
import { AnbieterLogo } from "@/components/AnbieterLogo";
import { BonusSchild } from "./VergleichsBausteine";
import type { RohAnbieter } from "@/data/vergleichHelfer";
import { zinsHinweis } from "@/data/zinsHinweise";
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

/** Ein Grund im Kasten der Nummer 1, bei der Zins-Ampel mit dem Satz darunter. */
type Punkt = { text: string; zusatz?: string };

/**
 * Der Kasten, der bei Finanzfluss "Bestes Depot" heißt. Die Nummer 1 entsteht aus
 * dem, was belegt ist (siehe `nummerEins` in `src/lib/rangfolge.ts`). Ein Partnerlink
 * ändert keine Note; in Depot, Girokonto und Krypto steht bei gleicher Sternzahl zuerst,
 * was einen eigenen Link hat (`linkVorrang`). Die Gründe darunter kommen aus den Zeilen des
 * Vergleichs: erfüllte Halal-Merkmale zuerst, dann die zwei Kostenwerte aus dem Raster.
 */
export const NummerEins = ({
  anbieter,
  zeilen,
  einheit,
  linkVorrang = false,
  kategorie,
}: {
  anbieter: RohAnbieter;
  zeilen: VergleichsZeile[];
  einheit: string;
  /** Der Vergleich stellt bei gleicher Sternzahl zuerst, was einen eigenen Link hat. Dann steht das hier. */
  linkVorrang?: boolean;
  /** Depot, Girokonto und Krypto: unter „Ohne Zinsen nutzbar“ steht, was dafür zu tun oder zu lassen ist. */
  kategorie?: string;
}) => {
  const halal = zeilen
    .filter((z) => z.gruppe === "halal")
    .map((z): Punkt | null => {
      const w = anbieter.werte[z.key];
      if (z.art === "ampel")
        return w === "gut"
          ? { text: z.label, zusatz: z.key === "zinsfreiAbStart" ? zinsHinweis(kategorie, anbieter) : undefined }
          : null;
      return typeof w === "string" && /\d+ von \d+/.test(w) ? { text: `${z.label}: ${w}` } : null;
    })
    .filter((x): x is Punkt => !!x)
    .slice(0, 4);
  const kosten = zeilen
    .filter((z) => z.gruppe === "kosten" && z.imRaster && typeof anbieter.werte[z.key] === "string")
    .slice(0, 2)
    .map((z): Punkt => ({ text: `${z.label}: ${anbieter.werte[z.key]}` }));

  return (
    /* Rahmen im Verlauf Blau, Violett, Gold statt einer blauen Fläche (Elias, 21.09.2026: die
       Nummer 1 darf auffallen, die Fläche bleibt ruhig). Gold nur als Detail: Rahmenende und Siegel. */
    <section
      className="overflow-hidden rounded-2xl bg-[linear-gradient(120deg,#0057FA_0%,#7D6EF2_60%,#FFBE1F_100%)] p-[2px] shadow-[0_14px_34px_-22px_rgba(0,87,250,0.55)]"
      aria-label="Unsere Nummer 1"
    >
      <p className="flex items-center justify-center gap-1.5 px-4 py-2 text-center text-[14px] font-bold text-white">
        <Award className="h-4 w-4 text-spark" aria-hidden />
        Unsere Nummer 1
      </p>
      <div className="rounded-[14px] bg-card p-4 xl:p-5">
        <div className="flex items-center gap-3">
          <AnbieterLogo name={anbieter.name} domain={anbieter.domain} gross />
          <p className="min-w-0 flex-1 text-[18px] leading-snug text-foreground">
            <span className="font-bold">{anbieter.name}</span> {anbieter.produkt}
          </p>
        </div>
        {/* Ab `xl` ist der Kasten breit: die Gründe laufen in zwei Spalten, der Kasten wird niedriger. */}
        <ul className="mt-3 xl:mt-4 xl:columns-2 xl:gap-x-8">
          {[...halal, ...kosten].map((punkt) => (
            <li key={punkt.text} className="mb-1.5 flex break-inside-avoid items-start gap-2 text-[14px] leading-snug text-foreground xl:mb-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              <span>
                {punkt.text}
                {punkt.zusatz && (
                  <span className="mt-0.5 block text-[12px] leading-[16px] text-muted-foreground">{punkt.zusatz}</span>
                )}
              </span>
            </li>
          ))}
        </ul>
        {anbieter.link && (
          <div className="mt-2.5 xl:mt-3">
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
          Aus dem, was wir beim Anbieter belegt haben. Eine Partnerschaft ändert keine Note.{" "}
          {linkVorrang
            ? `Bei gleich vielen Sternen steht zuerst, was du über unseren Link eröffnen kannst, danach folgen die ${einheit} nach unserer Note.`
            : `Die übrigen ${einheit} folgen nach unserer Note.`}{" "}
          <Link to="/vergleiche/methodik" className="font-semibold text-primary hover:underline">
            So bewerten wir
          </Link>
        </p>
      </div>
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
