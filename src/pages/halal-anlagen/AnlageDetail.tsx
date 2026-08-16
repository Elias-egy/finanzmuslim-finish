import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ChevronRight, ExternalLink } from "lucide-react";
import Seo from "@/components/Seo";
import KursChart from "@/components/KursChart";
import ZeitraumSchalter from "@/components/ZeitraumSchalter";
import { RenditeWert } from "@/components/Rendite";
import { anbieterByName, anlageBySlug } from "@/data/halalAnlagen";
import { kursFuerIsin, kursStand, reiheAusschnitt, zeitraeume, type Zeitraum } from "@/lib/kurse";

const kategorieLabel: Record<string, string> = {
  aktien: "Aktien",
  sukuk: "Sukuk",
  gold: "Gold",
  silber: "Silber",
};

const erklaerung: Record<string, string> = {
  thesaurierend: "Gewinne bleiben im Fonds und werden wieder angelegt",
  ausschuettend: "Gewinne werden dir aufs Konto ausgezahlt",
};

const Zeile = ({ label, wert, klammer }: { label: string; wert: string; klammer?: string }) => (
  <div className="flex flex-col gap-1 border-t border-border py-3 sm:flex-row sm:justify-between sm:gap-6">
    <span className="text-[15px] text-muted-foreground">{label}</span>
    <span className="text-[15px] text-foreground sm:text-right">
      {wert}
      {klammer && <span className="block text-[13px] text-muted-foreground">({klammer})</span>}
    </span>
  </div>
);

const AnlageDetail = () => {
  const { slug } = useParams();
  const anlage = anlageBySlug(slug ?? "");
  const [zeitraum, setZeitraum] = useState<Zeitraum>("r1j");

  if (!anlage) return <Navigate to="/halal-anlagen" replace />;

  const kurs = kursFuerIsin(anlage.isin);
  const reihe = reiheAusschnitt(kurs?.reihe, zeitraum);
  const a = anbieterByName(anlage.anbieter);
  const zeitraumLabel = zeitraeume.find((z) => z.key === zeitraum)?.label ?? "1 Jahr";

  return (
    <main className="bg-background">
      <Seo
        title={`${anlage.name} halal? Kosten, Rendite und Zertifikat | finanzmuslim`}
        description={`${anlage.name} (${anlage.isin}): ${anlage.kostenLabel} Kosten pro Jahr, Fondsgröße, Rendite und die Stelle, die die Anlage nach Shariah-Kriterien geprüft hat.`}
        path={`/halal-anlagen/${anlage.slug}`}
      />

      <section className="bg-hero">
        <div className="container py-10 md:py-14">
          <nav aria-label="Brotkrumen" className="flex flex-wrap items-center gap-1 text-[13px] text-muted-foreground">
            <Link to="/" className="hover:text-primary">Start</Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            <Link to="/halal-anlagen" className="hover:text-primary">Halal-Anlagen</Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            <span className="text-foreground">{anlage.name}</span>
          </nav>

          <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-4">
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-card"
                title={anlage.anbieter}
              >
                <span className="text-[15px] font-bold text-foreground">{a?.kuerzel ?? anlage.anbieter.slice(0, 2)}</span>
              </span>
              <div className="min-w-0">
                <h1 className="text-2xl font-bold leading-tight text-foreground md:text-4xl">{anlage.name}</h1>
                <p className="mt-2 text-[15px] text-muted-foreground">
                  {anlage.isin} · {kategorieLabel[anlage.kategorie]} · {anlage.anbieter}
                </p>
              </div>
            </div>

            <div className="md:text-right">
              <RenditeWert wert={kurs?.[zeitraum]} gross />
              <p className="mt-1 text-[14px] text-muted-foreground">Rendite {zeitraumLabel}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-10 md:py-14">
        {/* Chart */}
        <section className="card-surface p-5 md:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-bold text-foreground">Kursverlauf</h2>
            <ZeitraumSchalter wert={zeitraum} onChange={setZeitraum} />
          </div>
          <div className="mt-5">
            <KursChart reihe={reihe} waehrung={kurs?.waehrung} id={anlage.slug} />
          </div>
        </section>

        {/* Halal-Steckbrief */}
        <section className="mt-6 rounded-2xl bg-hero p-6 md:p-8">
          <h2 className="text-xl font-bold text-foreground md:text-2xl">Ist diese Anlage halal?</h2>
          <div className="mt-4 space-y-4 text-[16px] leading-relaxed text-muted-foreground">
            <p>
              <span className="font-semibold text-foreground">Geprüft von: </span>
              {anlage.zertifikatLink ? (
                <a
                  href={anlage.zertifikatLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-primary underline underline-offset-2"
                >
                  {anlage.zertifizierer}
                  <ExternalLink className="h-4 w-4" aria-hidden />
                </a>
              ) : (
                <>
                  {anlage.zertifizierer}{" "}
                  <span className="text-[13px] text-muted-foreground">Nachweis noch nicht geprüft</span>
                </>
              )}
            </p>
            {anlage.zertifikatHinweis && <p>{anlage.zertifikatHinweis}</p>}
            {anlage.zertifikatArt === "index" && (
              <p>
                Für dieses Produkt selbst gibt der Anbieter kein eigenes Zertifikat heraus. Der Nachweis bezieht
                sich auf den zugrunde liegenden Index.
              </p>
            )}
            <p>
              <span className="font-semibold text-foreground">Wie geprüft wird: </span>
              Eine unabhängige Gelehrtenstelle schaut sich an, womit die Firmen im Fonds ihr Geld verdienen und
              wie hoch ihre Schulden und Zinserträge sind. Was durchfällt, fliegt raus.
            </p>
            <p>
              Solche Zertifizierungen werden in der Regel jedes Jahr neu erteilt. Prüf vor dem Kauf selbst, ob
              der Nachweis noch aktuell ist.
            </p>
          </div>
        </section>

        {/* Zahlen */}
        <section className="card-surface mt-6 p-5 md:p-8">
          <h2 className="text-xl font-bold text-foreground md:text-2xl">Die Zahlen</h2>
          <div className="mt-4">
            <Zeile label="Kosten pro Jahr" wert={anlage.kostenLabel} klammer="das zieht der Anbieter automatisch vom Fondsvermögen ab" />
            <Zeile label="Fondsgröße" wert={anlage.groesse} klammer="wie viel Geld insgesamt in dieser Anlage steckt" />
            <Zeile label="Ertragsverwendung" wert={anlage.ertragDetail} klammer={erklaerung[anlage.ertrag]} />
            <Zeile
              label="Bauart"
              wert={anlage.bauart}
              klammer={
                anlage.bauart === "passiv"
                  ? "bildet eine feste Liste nach, niemand entscheidet mit"
                  : "ein Team sucht die Anlagen selbst aus, das kostet mehr"
              }
            />
            <Zeile
              label="Bauweise"
              wert={anlage.replikation}
              klammer={
                anlage.replikation.includes("physisch besichert")
                  ? "das Metall liegt wirklich im Tresor"
                  : anlage.replikation.includes("physisch")
                    ? "der Fonds kauft die Wertpapiere wirklich"
                    : undefined
              }
            />
            <Zeile label="Domizil" wert={anlage.domizil} klammer="Land, in dem der Fonds rechtlich sitzt" />
            <Zeile label="Auflagedatum" wert={anlage.auflage} klammer="seit wann es diese Anlage gibt" />
            <Zeile label="ISIN" wert={anlage.isin} klammer="die Nummer, mit der du sie im Depot findest" />
          </div>
          {anlage.hinweis && <p className="mt-4 text-[14px] text-muted-foreground">Hinweis: {anlage.hinweis}</p>}
        </section>

        {/* CTA */}
        <section className="card-surface mt-6 p-6 md:p-8">
          <h2 className="text-xl font-bold text-foreground md:text-2xl">Wo kannst du das kaufen?</h2>
          <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-muted-foreground">
            Nicht jeder Broker führt diese Anlage. Welcher sie im Angebot hat und was er kostet, steht im
            Depot-Vergleich.
          </p>
          <Link to="/vergleich/depot" className="btn-primary mt-5">
            Depot-Vergleich
          </Link>
        </section>

        <div className="mt-8 flex flex-col gap-3 text-[15px] sm:flex-row sm:items-center sm:justify-between">
          <Link to="/halal-anlagen" className="font-semibold text-primary hover:underline">
            Zurück zu allen Halal-Anlagen
          </Link>
          <Link to="/vorlagen/halal-anlagen" className="text-primary hover:underline">
            Die Liste als PDF
          </Link>
        </div>

        <p className="mt-8 text-[13px] leading-relaxed text-muted-foreground">
          Kursdaten von Yahoo Finance, Stand {kursStand}, in Euro umgerechnet. Die Werte werden nicht
          automatisch aktualisiert. Vergangene Renditen sagen nichts über die Zukunft. Diese Seite ist keine
          Anlageberatung und keine Empfehlung.
        </p>
      </div>
    </main>
  );
};

export default AnlageDetail;
