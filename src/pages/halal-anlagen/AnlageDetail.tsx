import { Link, Navigate, useParams } from "react-router-dom";
import { ChevronRight, ExternalLink } from "lucide-react";
import Seo from "@/components/Seo";
import AbschnittsNavigation, { type Abschnitt } from "@/components/anlage/AbschnittsNavigation";
import AnlageKurschart from "@/components/anlage/AnlageKurschart";
import FaktenRaster from "@/components/anlage/FaktenRaster";
import KopierWert from "@/components/anlage/KopierWert";
import MonetarisierungsPlatz from "@/components/anlage/MonetarisierungsPlatz";
import { AufteilungsBalken, KeineZusammensetzung } from "@/components/anlage/Zusammensetzung";
import { AnlageLogo } from "@/components/AnlageZeile";
import { anlageBySlug } from "@/data/halalAnlagen";
import { grundOhneZusammensetzung, zusammensetzungFuer } from "@/data/zusammensetzung";
import { regionFuer } from "@/data/anlageRegion";
import { kursFuerAnlage, kursQuelle, kursStand } from "@/lib/kurse";

const erklaerung: Record<string, string> = {
  thesaurierend: "Gewinne bleiben im Fonds und werden wieder angelegt",
  ausschuettend: "Gewinne werden dir aufs Konto ausgezahlt",
};

const abschnitte: Abschnitt[] = [
  { id: "kurs", label: "Kurs" },
  { id: "halal", label: "Halal" },
  { id: "basisinfos", label: "Basisinfos" },
  { id: "zusammensetzung", label: "Zusammensetzung" },
];

/** Eine Zeile nur, wenn ein Wert vorliegt. Krypto hat keine Fondsgröße und
 *  keine Bauart, dort bleibt die Zeile weg statt einen Strich zu zeigen. */
const Zeile = ({
  label,
  wert,
  klammer,
}: {
  label: string;
  wert?: string;
  klammer?: string;
}) => {
  if (!wert) return null;
  return (
    <div className="flex flex-col gap-1 border-t border-border py-3 sm:flex-row sm:justify-between sm:gap-6">
      <span className="text-[15px] text-muted-foreground">{label}</span>
      <span className="text-[15px] text-foreground sm:text-right">
        {wert}
        {klammer && <span className="block text-[13px] text-muted-foreground">({klammer})</span>}
      </span>
    </div>
  );
};

const AnlageDetail = () => {
  const { slug } = useParams();
  const anlage = anlageBySlug(slug ?? "");

  if (!anlage) return <Navigate to="/halal-anlagen" replace />;

  const kurs = kursFuerAnlage(anlage);
  const zus = anlage.isin ? zusammensetzungFuer(anlage.isin) : undefined;
  const region = anlage.isin ? regionFuer(anlage.isin) : undefined;
  const istKrypto = anlage.kategorie === "krypto";
  const hatZusammensetzung =
    !!zus && ((zus.positionen?.length ?? 0) > 0 || (zus.laender?.length ?? 0) > 0 || (zus.branchen?.length ?? 0) > 0);

  /* Nur Fakten, die es bei dieser Anlageart wirklich gibt. Ein ETC auf Gold
     hat keine Ertragsverwendung im Sinne einer Ausschüttung, das Feld trägt
     dort trotzdem einen sinnvollen Wert aus den Stammdaten. Eine Münze hat
     weder Fondsgröße noch Domizil, dort fällt der Eintrag weg. */
  const fakten = [
    { label: "Kosten pro Jahr", wert: anlage.kostenLabel },
    { label: istKrypto ? "Kürzel" : "Fondsgröße", wert: istKrypto ? anlage.kuerzel : anlage.groesse },
    { label: "Ertragsverwendung", wert: anlage.ertragDetail },
    { label: "Bauart", wert: anlage.replikation },
    { label: "Domizil", wert: anlage.domizil },
    { label: "Auflage", wert: anlage.auflage },
  ].filter((f): f is { label: string; wert: string } => !!f.wert);

  return (
    <main className="bg-background">
      <Seo
        title={`${anlage.name}: Kurs, Kosten und Halal-Einordnung | finanzmuslim`}
        description={
          istKrypto
            ? `${anlage.name} (${anlage.kuerzel}): Kursverlauf in Euro, laufende Kosten und die Stelle, die die Münze nach Shariah-Kriterien eingeordnet hat.`
            : `${anlage.name} (${anlage.isin}): Kursverlauf, ${anlage.kostenLabel} Kosten pro Jahr, Fondsgröße und die Stelle, die die Anlage nach Shariah-Kriterien geprüft hat.`
        }
        path={`/halal-anlagen/${anlage.slug}`}
      />

      {/* 1 — Kopf */}
      <section className="bg-hero">
        <div className="container py-8 md:py-12">
          <nav
            aria-label="Brotkrumen"
            className="flex flex-wrap items-center gap-1 text-[13px] text-muted-foreground"
          >
            <Link to="/" className="hover:text-primary">
              Start
            </Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            <Link to="/halal-anlagen" className="hover:text-primary">
              Halal-Anlagen
            </Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            <span className="text-foreground">{anlage.name}</span>
          </nav>

          <div className="mt-5 flex items-start gap-3">
            <AnlageLogo a={anlage} gross />
            <div className="min-w-0">
              <h1 className="text-[26px] font-bold leading-[1.15] text-foreground md:text-4xl">
                {anlage.name}
              </h1>
              <p className="mt-2 flex flex-wrap items-center gap-2 text-[13px]">
                {anlage.ertrag && (
                  <span className="rounded-full bg-card px-3 py-1 font-semibold text-foreground">
                    {anlage.ertrag === "thesaurierend" ? "Thesaurierend" : "Ausschüttend"}
                  </span>
                )}
                <span className="rounded-full bg-card px-3 py-1 font-semibold text-foreground">
                  {istKrypto ? "Kryptowährung" : anlage.anbieter}
                </span>
                {region && (
                  <span
                    className="rounded-full bg-card px-3 py-1 font-semibold text-foreground"
                    title={region.label}
                  >
                    <span aria-hidden>{region.zeichen}</span> {region.label}
                  </span>
                )}
              </p>
            </div>
          </div>

          {anlage.isin && (
            <div className="mt-4">
              <KopierWert label="ISIN" wert={anlage.isin} />
            </div>
          )}

          <div className="mt-5">
            <FaktenRaster fakten={fakten} />
          </div>

          <div className="mt-5 max-w-xl">
            <MonetarisierungsPlatz platz="anlage_kopf" anlageName={anlage.name} isin={anlage.isin} />
          </div>
        </div>
      </section>

      <AbschnittsNavigation abschnitte={abschnitte} />

      <div className="container space-y-4 py-6 md:space-y-6 md:py-10">
        {/* 2 — Partnerstreifen, direkt unter dem Kopf */}
        <MonetarisierungsPlatz
          platz="partner_streifen"
          anlageName={anlage.name}
          isin={anlage.isin}
        />

        {/* 3 — Kurs */}
        <section id="kurs" className="section-card scroll-mt-32">
          <div className="section-inner">
            <h2 className="text-[22px] font-bold text-foreground md:text-[28px]">Kursverlauf</h2>
            <div className="mt-4">
              <AnlageKurschart
                kurs={kurs}
                id={anlage.slug}
                quelle={kursQuelle}
                stand={kursStand}
              />
            </div>
            <div className="mt-5 max-w-xl">
              <MonetarisierungsPlatz
                platz="chart_aktion"
                anlageName={anlage.name}
                isin={anlage.isin}
              />
            </div>
          </div>
        </section>

        {/* 4 — Halal-Einordnung */}
        <section id="halal" className="scroll-mt-32 rounded-2xl bg-hero p-6 md:p-10">
          <div className="section-inner">
            <h2 className="text-[22px] font-bold text-foreground md:text-[28px]">
              Ist diese Anlage halal?
            </h2>

            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-card px-4 py-3">
                <dt className="text-[13px] text-muted-foreground">Geprüft von</dt>
                <dd className="mt-0.5 text-[15px] font-semibold text-foreground">
                  {anlage.zertifikatLink ? (
                    <a
                      href={anlage.zertifikatLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary underline underline-offset-2"
                    >
                      {anlage.zertifizierer}
                      <ExternalLink className="h-4 w-4" aria-hidden />
                    </a>
                  ) : (
                    anlage.zertifizierer
                  )}
                </dd>
              </div>
              <div className="rounded-lg bg-card px-4 py-3">
                <dt className="text-[13px] text-muted-foreground">Nachweis</dt>
                <dd className="mt-0.5 text-[15px] font-semibold text-foreground">
                  {anlage.zertifikatLink
                    ? anlage.zertifikatArt === "index"
                      ? "liegt vor, gilt dem Index"
                      : "liegt vor"
                    : "noch nicht geprüft"}
                </dd>
              </div>
            </dl>

            <div className="mt-4 space-y-3 text-[16px] leading-[26px] text-muted-foreground">
              {anlage.zertifikatHinweis && <p>{anlage.zertifikatHinweis}</p>}
              {anlage.zertifikatArt === "index" && (
                <p>
                  Für das Produkt selbst gibt der Anbieter kein eigenes Zertifikat heraus. Der
                  Nachweis bezieht sich auf den Index, den es nachbildet.
                </p>
              )}
              {istKrypto ? (
                <>
                  <p>
                    <span className="font-semibold text-foreground">Wie geprüft wird: </span>
                    Eine Gelehrtenstelle schaut sich an, wie die Münze entsteht, wofür sie genutzt
                    wird und ob dabei Zins oder reine Wette im Spiel ist. Ein Gutachten gilt der
                    Münze selbst, nicht deinem Handel damit.
                  </p>
                  <p>
                    Krypto schwankt deutlich stärker als alles andere in dieser Übersicht. Es gilt
                    als kleine Beimischung, nicht als Grundlage eines Depots.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <span className="font-semibold text-foreground">Wie geprüft wird: </span>
                    Eine unabhängige Gelehrtenstelle schaut sich an, womit die Firmen im Fonds ihr
                    Geld verdienen und wie hoch ihre Schulden und Zinserträge sind. Was durchfällt,
                    fliegt raus.
                  </p>
                  <p>
                    Solche Zertifizierungen werden meist jedes Jahr neu erteilt. Prüf vor dem Kauf
                    selbst, ob der Nachweis noch aktuell ist.
                  </p>
                </>
              )}
            </div>
          </div>
        </section>

        {/* 5 — Basisinformationen */}
        <section id="basisinfos" className="section-card scroll-mt-32">
          <div className="section-inner">
            <h2 className="text-[22px] font-bold text-foreground md:text-[28px]">Basisinfos</h2>
            <div className="mt-4">
              <Zeile
                label="Kosten pro Jahr"
                wert={anlage.kostenLabel}
                klammer={
                  istKrypto
                    ? "eine Münze hat keine laufenden Kosten, dein Broker nimmt aber Gebühren beim Kauf"
                    : "zieht der Anbieter automatisch vom Fondsvermögen ab"
                }
              />
              <Zeile
                label="Ausgabeaufschlag"
                wert={anlage.ausgabeaufschlag}
                klammer="einmalige Gebühr beim Kauf"
              />
              <Zeile
                label="Fondsgröße"
                wert={
                  anlage.groesse && anlage.groesseStand
                    ? `${anlage.groesse}, ${anlage.groesseStand}`
                    : anlage.groesse
                }
                klammer="wie viel Geld insgesamt in dieser Anlage steckt"
              />
              <Zeile
                label="Ertragsverwendung"
                wert={anlage.ertragDetail}
                klammer={anlage.ertrag ? erklaerung[anlage.ertrag] : undefined}
              />
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
                  anlage.replikation?.includes("physisch besichert")
                    ? "das Metall liegt wirklich im Tresor"
                    : anlage.replikation?.includes("physisch")
                      ? "der Fonds kauft die Wertpapiere wirklich"
                      : undefined
                }
              />
              <Zeile
                label="Domizil"
                wert={anlage.domizil}
                klammer="Land, in dem der Fonds rechtlich sitzt"
              />
              <Zeile
                label="Auflagedatum"
                wert={anlage.auflage}
                klammer="seit wann es diese Anlage gibt"
              />
              <Zeile
                label="ISIN"
                wert={anlage.isin}
                klammer="die Nummer, mit der du sie im Depot findest"
              />
              <Zeile
                label="Kürzel"
                wert={istKrypto ? anlage.kuerzel : undefined}
                klammer="damit findest du die Münze bei deinem Anbieter"
              />
            </div>
          </div>
        </section>

        {/* 6 — Zusammensetzung */}
        <section id="zusammensetzung" className="section-card scroll-mt-32">
          <div className="section-inner">
            <h2 className="text-[22px] font-bold text-foreground md:text-[28px]">
              Zusammensetzung
            </h2>
            <div className="mt-4">
              {hatZusammensetzung ? (
                <div className="grid gap-8 lg:grid-cols-2">
                  {zus?.positionen && zus.positionen.length > 0 && (
                    <div className="lg:col-span-2">
                      <AufteilungsBalken
                        titel="Größte Positionen"
                        posten={zus.positionen}
                        stand={zus.stand}
                        quelle={zus.quelle}
                      />
                    </div>
                  )}
                  {zus?.laender && zus.laender.length > 0 && (
                    <AufteilungsBalken
                      titel="Länder"
                      posten={zus.laender}
                      stand={zus.stand}
                      quelle={zus.quelle}
                    />
                  )}
                  {zus?.branchen && zus.branchen.length > 0 && (
                    <AufteilungsBalken
                      titel="Branchen"
                      posten={zus.branchen}
                      stand={zus.stand}
                      quelle={zus.quelle}
                    />
                  )}
                </div>
              ) : (
                <KeineZusammensetzung
                  grund={grundOhneZusammensetzung(anlage.kategorie, anlage.replikation ?? "")}
                />
              )}
            </div>
          </div>
        </section>

        {/* 7 — Quellen und rechtlicher Hinweis */}
        <section className="section-card">
          <div className="section-inner space-y-3 text-[13px] leading-[20px] text-muted-foreground">
            <p>
              Kursdaten: {kursQuelle}. Stand {kursStand}. Die Werte werden nicht laufend
              aktualisiert, es sind Schlusskurse, keine Echtzeitkurse.
            </p>
            <p>
              Stammdaten und Halal-Einordnung stammen aus den Unterlagen des Anbieters und der
              jeweils genannten Prüfstelle. Über die Einstufung entscheidet die Prüfstelle, nicht
              eine Kursdatenquelle.
            </p>
            <p>
              Vergangene Renditen sagen nichts über die Zukunft. Diese Seite ist keine
              Anlageberatung und keine Empfehlung. finanzmuslim führt keine Order aus.
            </p>
          </div>
        </section>

        <div className="flex flex-col gap-3 text-[15px] sm:flex-row sm:items-center sm:justify-between">
          <Link to="/halal-anlagen" className="font-semibold text-primary hover:underline">
            Zurück zu allen Halal-Anlagen
          </Link>
          <Link to="/vorlagen/halal-anlagen" className="text-primary hover:underline">
            Die Liste als PDF
          </Link>
        </div>
      </div>
    </main>
  );
};

export default AnlageDetail;
