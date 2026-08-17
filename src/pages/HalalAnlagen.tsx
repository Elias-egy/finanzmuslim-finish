import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, ExternalLink, HelpCircle, Search, X } from "lucide-react";
import Seo from "@/components/Seo";
import NewsletterBox from "@/components/NewsletterBox";
import ZeitraumSchalter from "@/components/ZeitraumSchalter";
import { RenditeWert, Sparkline } from "@/components/Rendite";
import { AnlageLogo } from "@/components/AnlageZeile";
import AnlageFilter, {
  filterStandard,
  type FilterStand,
} from "@/components/anlage/AnlageFilter";
import { kursFuerAnlage, kursStand, kursText, type Zeitraum } from "@/lib/kurse";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { anlageSchluessel, halalAnlagen, type Anlage } from "@/data/halalAnlagen";
import { regionFuer } from "@/data/anlageRegion";
import { inGruppen, type Gruppe } from "@/lib/anlageGruppen";

const BauartHilfe = () => (
  <Popover>
    <PopoverTrigger
      aria-label="Passiv oder aktiv, was heißt das?"
      className="inline-flex h-6 w-6 items-center justify-center rounded-md text-primary transition-colors hover:bg-hero"
    >
      <HelpCircle className="h-4 w-4" aria-hidden />
    </PopoverTrigger>
    <PopoverContent align="start" className="w-[300px] text-left">
      <p className="text-[15px] font-bold text-foreground">Passiv oder aktiv, was heißt das?</p>
      <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
        Ein passiver Fonds bildet einfach eine Liste nach, zum Beispiel alle großen Firmen der Welt, die den
        Halal-Test bestanden haben. Da entscheidet niemand mit, deshalb ist er günstig.
      </p>
      <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
        Bei einem aktiven Fonds sucht ein Team von Menschen die Firmen selbst aus. Die können auf Nachrichten
        reagieren und Sachen aussortieren, die ihnen nicht gefallen. Diese Menschen werden aber bezahlt, und
        dieses Gehalt zahlst du über die laufenden Kosten mit.
      </p>
      <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
        Deshalb kosten aktive Fonds hier bis zu 2,16 % im Jahr, passive ab 0,12 %. Ob sich das lohnt,
        entscheidest du.
      </p>
    </PopoverContent>
  </Popover>
);

const Paar = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between gap-4 border-t border-border py-2 text-[14px]">
    <span className="text-muted-foreground">{label}</span>
    <span className="text-right text-foreground">{value}</span>
  </div>
);

/** Prüfstelle, nur klickbar wo ein Nachweis vorliegt. */
const GeprueftVon = ({ a }: { a: Anlage }) =>
  a.zertifikatLink ? (
    <a
      href={a.zertifikatLink}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className="inline-flex items-start gap-1 text-[13px] font-semibold text-primary underline underline-offset-2"
    >
      {a.zertifizierer}
      <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
    </a>
  ) : (
    <span className="text-[13px] text-muted-foreground">
      {a.zertifizierer}
      {!a.zertifizierer.includes("noch nicht geprüft") && " · Nachweis noch nicht geprüft"}
    </span>
  );

const Karte = ({ a, zeitraum, gruppe }: { a: Anlage; zeitraum: Zeitraum; gruppe: Gruppe }) => {
  const kurs = kursFuerAnlage(a);
  const preis = kursText(kurs);
  const region = a.isin ? regionFuer(a.isin) : undefined;
  return (
    /* Handy-Karte. Kopfzeile wie in der Vorschau: rundes Logo, Name mit Kürzel
       darunter, rechts Kurs und Veränderung. Darunter Kosten, Anlagegebiet und
       Prüfstelle. Farbpunkt und ausgeschriebene Anlageart sind raus, die
       stehen schon in der Gruppenüberschrift. */
    <li className="card-surface p-4">
      <Link to={`/halal-anlagen/${a.slug}`} className="flex items-center gap-3">
        <AnlageLogo a={a} />
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-semibold text-foreground">{a.name}</span>
          <span className="mt-0.5 block truncate text-[13px] text-muted-foreground">
            {a.kuerzel ?? a.isin}
          </span>
        </span>
        <span className="flex shrink-0 flex-col items-end">
          <span className="whitespace-nowrap text-[15px] font-semibold text-foreground">
            {preis ?? "—"}
          </span>
          <RenditeWert wert={kurs?.[zeitraum]} mittel />
        </span>
      </Link>

      {(gruppe.kosten || region) && (
        <dl className="mt-3 grid grid-cols-2 gap-2">
          {gruppe.kosten && (
            <div className="rounded-lg border border-border px-3 py-2">
              <dt className="text-[12px] text-muted-foreground">Kosten pro Jahr</dt>
              <dd className="mt-0.5 text-[17px] font-bold text-foreground">{a.kostenLabel}</dd>
            </div>
          )}
          {/* Statt der Fondsgröße steht hier, wo die Anlage hinzielt. Die Größe
              sagt einem Privatanleger wenig, das Anlagegebiet entscheidet, ob
              die Anlage überhaupt in Frage kommt. Das Zeichen bringt außerdem
              die einzige Farbe in die Karte. */}
          {region && (
            <div className="rounded-lg border border-border px-3 py-2">
              <dt className="text-[12px] text-muted-foreground">Anlagegebiet</dt>
              <dd className="mt-0.5 flex items-center gap-1.5 text-[14px] font-semibold text-foreground">
                <span className="shrink-0 text-[17px] leading-none" aria-hidden>
                  {region.zeichen}
                </span>
                <span className="truncate">{region.label}</span>
              </dd>
            </div>
          )}
        </dl>
      )}

      <div className="mt-2 flex flex-col gap-1 py-2 text-[14px]">
        <span className="text-muted-foreground">Geprüft von</span>
        <GeprueftVon a={a} />
      </div>

      <Link
        to={`/halal-anlagen/${a.slug}`}
        className="mt-3 flex min-h-[48px] items-center justify-center gap-1 rounded-lg border border-border text-[15px] font-semibold text-primary transition-colors hover:border-primary"
      >
        Kurs und Details
        <ChevronRight className="h-4 w-4" aria-hidden />
      </Link>
    </li>
  );
};

const HalalAnlagen = () => {
  const navigate = useNavigate();
  const [suche, setSuche] = useState("");
  const [zeitraum, setZeitraum] = useState<Zeitraum>("r1j");
  const [filter, setFilter] = useState<FilterStand>(filterStandard);
  const { kategorie, nurAusschuettend, nurPassiv, sortierung } = filter;

  const liste = useMemo(() => {
    const q = suche.trim().toLowerCase();
    const gefiltert = halalAnlagen.filter(
      (a) =>
        (kategorie === "alle" || a.kategorie === kategorie) &&
        (!nurAusschuettend || a.ertrag === "ausschuettend") &&
        (!nurPassiv || a.bauart === "passiv") &&
        (q === "" ||
          a.name.toLowerCase().includes(q) ||
          a.anbieter.toLowerCase().includes(q) ||
          (a.kuerzel ?? "").toLowerCase().includes(q) ||
          (a.isin ?? "").toLowerCase().includes(q)),
    );
    const sortiert = [...gefiltert];
    if (sortierung === "kosten") sortiert.sort((x, y) => x.kosten - y.kosten);
    if (sortierung === "groesse")
      sortiert.sort((x, y) => (y.groesseSortierwert ?? -1) - (x.groesseSortierwert ?? -1));
    if (sortierung === "name") sortiert.sort((x, y) => x.name.localeCompare(y.name, "de"));
    if (sortierung === "renditeAb" || sortierung === "renditeAuf") {
      const wert = (a: Anlage) => kursFuerAnlage(a)?.[zeitraum];
      sortiert.sort((x, y) => {
        const vx = wert(x);
        const vy = wert(y);
        // Anlagen ohne Daten stehen immer hinten.
        if (vx == null && vy == null) return 0;
        if (vx == null) return 1;
        if (vy == null) return -1;
        return sortierung === "renditeAb" ? vy - vx : vx - vy;
      });
    }
    return sortiert;
  }, [kategorie, suche, nurAusschuettend, nurPassiv, sortierung, zeitraum]);

  const zuruecksetzen = () => {
    setFilter(filterStandard);
    setSuche("");
  };

  return (
    <main className="bg-background">
      <Seo
        title={`Halal-Anlagen finden, ${halalAnlagen.length} ETFs, Fonds und Kryptowährungen | finanzmuslim`}
        description="Alle in Deutschland handelbaren Halal-ETFs, Sukuk, Gold, Silber und Kryptowährungen mit Kosten, Größe und Zertifizierer. Filterbar und sortierbar, kostenlos."
        path="/halal-anlagen"
        brotkrumen={[{ name: "Vergleiche", path: "/vergleiche" }, { name: "Halal-Anlagen finden", path: "/halal-anlagen" }]}
      />

      {/* Kopf. Bewusst flach: auf dem Handy stand hier vorher ein Bild, drei
          Kacheln und zwei Sätze, zusammen fast ein halber Bildschirm, bevor
          die erste Anlage kam. Die Anzahl steht jetzt einmal über der Liste. */}
      <section className="bg-hero">
        <div className="container py-5 md:py-12">
          <nav aria-label="Brotkrumen" className="flex flex-wrap items-center gap-1 text-[13px] text-muted-foreground">
            <Link to="/" className="hover:text-primary">
              Start
            </Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            <Link to="/vergleiche" className="hover:text-primary">
              Vergleiche
            </Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            <span className="text-foreground">Halal-Anlagen finden</span>
          </nav>

          <h1 className="mt-3 text-[26px] font-bold leading-tight text-foreground md:mt-5 md:text-4xl">
            Halal-Anlagen finden
          </h1>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted-foreground md:mt-3 md:text-[17px]">
            Vergleich Kosten, Rendite und Prüfstelle.
          </p>
        </div>
      </section>

      <div className="container py-5 md:py-12">
        {/* Filterleiste */}
        <div className="card-surface p-4 md:p-5">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <input
              type="search"
              value={suche}
              onChange={(e) => setSuche(e.target.value)}
              aria-label="Anlage, Kürzel oder ISIN suchen"
              placeholder="Anlage, Kürzel oder ISIN suchen"
              className="min-h-[48px] w-full rounded-lg border border-border bg-background pl-11 pr-11 text-[16px] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
            {suche && (
              <button
                type="button"
                onClick={() => setSuche("")}
                aria-label="Suche löschen"
                className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-hero hover:text-foreground"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            )}
          </div>

          {/* Art, Eigenschaften und Sortierung liegen jetzt hinter einem Knopf.
              Sichtbar bleibt nur, was die Zahlen in der Liste verändert. Beides
              in einer Zeile, damit die erste Anlage früher im Bild steht. */}
          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <AnlageFilter stand={filter} setzen={setFilter} />
              <span className="hidden text-[14px] text-muted-foreground sm:inline" aria-live="polite">
                {liste.length} {liste.length === 1 ? "Anlage" : "Anlagen"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden text-[14px] text-muted-foreground md:inline">Rendite über</span>
              <ZeitraumSchalter wert={zeitraum} onChange={setZeitraum} kurz className="md:hidden" />
              <ZeitraumSchalter wert={zeitraum} onChange={setZeitraum} className="hidden md:inline-flex" />
            </div>
          </div>
          <p className="mt-2 text-[13px] text-muted-foreground sm:hidden" aria-live="polite">
            {liste.length} {liste.length === 1 ? "Anlage" : "Anlagen"}
          </p>
        </div>

        {liste.length === 0 ? (
          <div className="card-surface mt-4 p-8 text-center">
            <p className="text-[16px] font-semibold text-foreground">Keine Anlage passt zu deiner Suche</p>
            <p className="mt-2 text-[15px] text-muted-foreground">
              Probier einen kürzeren Suchbegriff oder setz die Filter zurück.
            </p>
            <button type="button" onClick={zuruecksetzen} className="btn-primary mt-5">
              Filter zurücksetzen
            </button>
          </div>
        ) : (
          <>
        {/* Nach Art gruppiert: jede Gruppe zeigt nur die Spalten, in denen sie
            Werte hat. Vorher stand über allem eine Tabelle mit acht Spalten,
            bei Krypto blieben drei davon leer. Tabelle ab md, darunter Karten. */}
        {inGruppen(liste).map(({ gruppe, anlagen }) => (
          <section key={gruppe.key} className="mt-8 first:mt-4">
            <h2 className="flex items-center gap-1 text-[18px] font-bold text-foreground md:text-xl">
              {gruppe.titel}
              <span className="text-[15px] font-semibold text-muted-foreground">
                {anlagen.length}
              </span>
              {gruppe.bauartHilfe && <BauartHilfe />}
            </h2>
            {gruppe.zusatz && (
              <p className="mt-1 text-[14px] text-muted-foreground">{gruppe.zusatz}</p>
            )}

            <div className="mt-3 hidden md:block">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="text-[13px] text-muted-foreground">
                    <th scope="col" className="pb-3 pr-3 font-semibold">Anlage</th>
                    <th scope="col" className="pb-3 pr-3 font-semibold">Kurs</th>
                    {gruppe.kosten && (
                      <th scope="col" className="pb-3 pr-3 font-semibold">Kosten pro Jahr</th>
                    )}
                    <th scope="col" className="w-[18%] pb-3 pr-3 font-semibold">Rendite</th>
                    {gruppe.groesse && (
                      <th scope="col" className="pb-3 pr-3 font-semibold">Größe</th>
                    )}
                    {gruppe.ertrag && (
                      <th scope="col" className="pb-3 pr-3 font-semibold">Ertrag</th>
                    )}
                    <th scope="col" className="w-[22%] pb-3 font-semibold">Geprüft von</th>
                  </tr>
                </thead>
                <tbody>
                  {anlagen.map((a) => {
                    const kurs = kursFuerAnlage(a);
                    return (
                      <tr
                        key={anlageSchluessel(a)}
                        onClick={() => navigate(`/halal-anlagen/${a.slug}`)}
                        className="cursor-pointer border-t border-border align-top transition-colors hover:bg-hero"
                      >
                        <td className="py-4 pr-3">
                          <div className="flex items-start gap-3">
                            <AnlageLogo a={a} />
                            <div className="min-w-0">
                              <Link
                                to={`/halal-anlagen/${a.slug}`}
                                onClick={(e) => e.stopPropagation()}
                                className="block text-[15px] font-semibold text-foreground hover:text-primary"
                              >
                                {a.name}
                              </Link>
                              <p className="mt-0.5 text-[13px] text-muted-foreground">
                                {a.kuerzel ?? a.isin}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap py-4 pr-3 text-[15px] font-semibold text-foreground">
                          {kursText(kurs) ?? "—"}
                        </td>
                        {gruppe.kosten && (
                          <td className="whitespace-nowrap py-4 pr-3 text-[18px] font-bold text-foreground">
                            {a.kostenLabel}
                          </td>
                        )}
                        <td className="py-4 pr-3">
                          <div className="flex flex-col gap-1">
                            <RenditeWert wert={kurs?.[zeitraum]} />
                            <Sparkline verlauf={kurs?.verlauf} />
                          </div>
                        </td>
                        {gruppe.groesse && (
                          <td className="py-4 pr-3 text-[14px] text-foreground">
                            {a.groesse ?? "—"}
                          </td>
                        )}
                        {gruppe.ertrag && (
                          <td className="py-4 pr-3 text-[14px] text-foreground">
                            {a.ertragDetail ?? "—"}
                          </td>
                        )}
                        <td className="py-4">
                          <GeprueftVon a={a} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <ul className="mt-3 space-y-4 md:hidden">
              {anlagen.map((a) => (
                <Karte key={anlageSchluessel(a)} a={a} zeitraum={zeitraum} gruppe={gruppe} />
              ))}
            </ul>
          </section>
        ))}

          </>
        )}

        {/* Woher die Renditen kommen */}
        <section className="mt-8 rounded-2xl bg-hero p-6 md:p-8">
          <h2 className="text-xl font-bold text-foreground">Woher die Renditen kommen</h2>
          <p className="mt-3 max-w-3xl text-[16px] leading-relaxed text-muted-foreground">
            Kursdaten von Yahoo Finance, Stand {kursStand}. Alle Renditen sind in Euro umgerechnet, damit sie
            untereinander vergleichbar sind. Sonst würde bei Anlagen, die in Dollar oder Pfund notieren, der
            Wechselkurs das Ergebnis verzerren. Die Werte werden nicht automatisch aktualisiert. Vergangene
            Renditen sagen nichts über die Zukunft.
          </p>
        </section>

        {/* CTA Mitte */}
        <section className="card-surface mt-10 p-6 md:p-8">
          <h2 className="text-xl font-bold text-foreground md:text-2xl">Wo kannst du das kaufen?</h2>
          <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-muted-foreground">
            Nicht jeder Broker führt diese Anlagen. Welcher Islamic-ETFs, Sukuk und physisch hinterlegtes Gold
            im Angebot hat und was er kostet, steht im Depot-Vergleich.
          </p>
          <Link to="/vergleich/depot" className="btn-primary mt-5">
            Depot-Vergleich
          </Link>
        </section>

        {/* Krypto */}
        <section className="mt-10 rounded-2xl bg-hero p-6 md:p-8">
          <h2 className="text-xl font-bold text-foreground">Krypto in dieser Liste</h2>
          <p className="mt-3 max-w-3xl text-[16px] leading-relaxed text-muted-foreground">
            Vier Münzen stehen unter denselben Zeilen wie alles andere, sie haben nur keine ISIN und
            keine laufenden Kosten. Zu jeder liegt eine Sharia-Analyse vor, drei davon vom Shariyah
            Review Bureau in Bahrain, verlinkt auf der jeweiligen Seite.
          </p>
          <p className="mt-3 max-w-3xl text-[16px] leading-relaxed text-muted-foreground">
            Krypto schwankt deutlich stärker als alles andere in dieser Übersicht. Es gilt als kleine
            Beimischung, nicht als Grundlage eines Depots.
          </p>
        </section>

        {/* Vorlagen-Verweis */}
        <section className="card-surface mt-10 p-6 md:p-8">
          <h2 className="text-xl font-bold text-foreground md:text-2xl">Die Liste als PDF</h2>
          <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-muted-foreground">
            Dieselben Anlagen zum Ausdrucken und Weitergeben, mit ISIN und Zertifizierer.
          </p>
          <Link to="/vorlagen/halal-anlagen" className="btn-primary mt-5">
            Zur Vorlage
          </Link>
        </section>

        {/* Hinweis */}
        <section className="mt-10 rounded-2xl bg-hero p-6 md:p-8">
          <h2 className="text-xl font-bold text-foreground">Was diese Übersicht nicht ist</h2>
          <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-muted-foreground">
            Keine Empfehlung und keine Anlageberatung. Eine Übersicht dessen, was es gibt und wer es geprüft
            hat. Du entscheidest, was zu dir passt.
          </p>
        </section>

        <p className="mt-8 text-[13px] leading-relaxed text-muted-foreground">
          Produktdaten: Angaben der Anbieter, erhoben über justETF, Stand August 2026. Zertifizierungen werden
          jährlich erneuert, vor dem Kauf selbst prüfen. Beim BNP Paribas Islamic Fund Hilal Income stammt die
          Fondsgröße aus dem Factsheet vom 27.03.2024, aktueller liegt öffentlich nichts vor. Der Zertifizierer
          des Comgest Growth Europe S und des iShares USD Sukuk ist noch nicht geprüft.
        </p>
        <p className="mt-4 text-[13px] leading-relaxed text-muted-foreground">
          Die auf dieser Seite genannten Anlagen sind auch dann, wenn einzelne Emittenten oder
          Finanzinstrumente genannt werden, nicht als Anlageberatung zu verstehen und stellen weder direkt noch
          indirekt eine Empfehlung oder Aufforderung zum Kaufen, Halten oder Verkaufen eines Finanzinstruments
          dar. Dieser Inhalt dient ausschließlich zu Bildungszwecken. Alle Investitionsentscheidungen triffst du
          eigenverantwortlich. Vergangene Renditen sind keine Garantie für zukünftige Ergebnisse.
        </p>

        {/* CTA Ende */}
        <section className="mt-12">
          <div className="mx-auto max-w-[700px] text-center">
            <h2 className="text-xl font-bold text-foreground md:text-2xl">
              Wenn sich eine Zertifizierung ändert, erfährst du es
            </h2>
            <p className="mt-3 text-[16px] leading-relaxed text-muted-foreground">
              Einmal im Monat: neue Vergleiche, neue Vorlagen, und was sich bei den Anbietern verändert hat.
              Jederzeit abbestellbar.
            </p>
          </div>
          <NewsletterBox className="mt-8" />
        </section>
      </div>
    </main>
  );
};

export default HalalAnlagen;
