import { Link } from "react-router-dom";
import Seo from "@/components/Seo";
import { LandWahl } from "@/components/land/LandWahl";
import { VergleichsBrotkrumen } from "@/components/vergleich/VergleichsRahmen";
import { LAENDER, landPfad, type Land } from "@/lib/land";

/**
 * Länderseite ohne fertige Liste (DACH1, 23.11.2026). Keine Anbieter, keine Zahlen, keine Rangfolge: erfunden wird nichts.
 * Die Seite sagt es offen und führt zur deutschen Fassung. noindex, nicht in der Sitemap, die automatische Umstellung
 * schickt niemanden hierher.
 */
export const LandInVorbereitung = ({
  land,
  pfad,
  brotkrumen,
  titel,
}: {
  land: Exclude<Land, "de">;
  /** Deutsche Grundadresse des Vergleichs. */
  pfad: string;
  brotkrumen: string;
  titel: string;
}) => (
  <main className="bg-background">
    <Seo
      title={`${titel} ${LAENDER[land].name}: in Vorbereitung`}
      description={`Der Vergleich für ${LAENDER[land].mitArtikel} ist in Vorbereitung.`}
      path={landPfad(pfad, land)}
      noindex
      locale={LAENDER[land].hreflang.replace("-", "_")}
    />
    <div className="container py-6 md:py-10">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <VergleichsBrotkrumen titel={brotkrumen} mitLandWahl />
        <LandWahl />
      </div>
      <header className="mt-6 max-w-3xl md:mt-8">
        <h1 className="text-[34px] font-semibold leading-[1.1] tracking-tight text-foreground md:text-[48px]">{titel}</h1>
        <p className="mt-3 text-[20px] leading-snug text-foreground md:text-[26px]">{LAENDER[land].name}</p>
      </header>
      <section className="mt-8 max-w-xl rounded-lg border border-border bg-card p-6" aria-label="In Vorbereitung">
        <p className="text-[18px] font-semibold text-foreground">In Vorbereitung</p>
        <p className="mt-2 text-[16px] leading-relaxed text-foreground">
          Wir prüfen die Anbieter für {LAENDER[land].mitArtikel} gerade. Bis dahin siehst du den Vergleich für Deutschland.
        </p>
        <Link
          to={landPfad(pfad, "de")}
          className="mt-5 inline-flex min-h-[48px] w-full items-center justify-center rounded-lg bg-primary px-6 text-[16px] font-semibold text-primary-foreground transition-colors hover:bg-primary-hover sm:w-auto"
        >
          Deutschland ansehen
        </Link>
      </section>
    </div>
  </main>
);
