import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, HelpCircle, Search, X } from "lucide-react";
import Seo from "@/components/Seo";
import NewsletterBox from "@/components/NewsletterBox";
import ZeitraumSchalter from "@/components/ZeitraumSchalter";
import { RenditeWert, Sparkline } from "@/components/Rendite";
import {
  kursFuerIsin,
  kursFuerKrypto,
  kursStand,
  type Zeitraum,
} from "@/lib/kurse";
import { ExternalLink } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  anbieterByName,
  halalAnlagen,
  kryptoAnlagen,
  type Anlage,
  type Kategorie,
} from "@/data/halalAnlagen";

type Reiter = "alle" | Kategorie;
type Sortierung = "kosten" | "groesse" | "name" | "renditeAb" | "renditeAuf";

const reiter: { key: Reiter; label: string }[] = [
  { key: "alle", label: "Alle" },
  { key: "aktien", label: "Aktien" },
  { key: "sukuk", label: "Sukuk" },
  { key: "gold", label: "Gold" },
  { key: "silber", label: "Silber" },
];

const kennzahlen = ["23 Anlagen", "4 Kategorien", "ab 0,12 % Kosten"];

/** Quadratische Anbieter-Kachel. Zeigt ein Logo, sobald eines hinterlegt ist. */
const AnbieterKachel = ({ name }: { name: string }) => {
  const a = anbieterByName(name);
  return (
    <span
      className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-hero"
      title={name}
    >
      {a?.logo ? (
        <img src={a.logo} alt={name} className="h-full w-full object-contain" />
      ) : (
        <span className="text-[13px] font-bold text-foreground">{a?.kuerzel ?? name.slice(0, 2)}</span>
      )}
    </span>
  );
};

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

const Karte = ({ a }: { a: Anlage }) => (
  <li className="card-surface p-4">
    <div className="flex items-start gap-3">
      <AnbieterKachel name={a.anbieter} />
      <div className="min-w-0">
        <p className="text-[15px] font-semibold text-foreground">{a.name}</p>
        <p className="mt-0.5 text-[13px] text-muted-foreground">{a.isin}</p>
        {a.hinweis && <p className="mt-1 text-[13px] text-muted-foreground">{a.hinweis}</p>}
      </div>
    </div>
    <p className="mt-3 text-[22px] font-bold text-foreground">
      {a.kostenLabel} <span className="text-[13px] font-normal text-muted-foreground">pro Jahr</span>
    </p>
    <div className="mt-3">
      <Paar label="Größe" value={a.groesse} />
      <Paar label="Ertrag" value={a.ertragDetail} />
      <Paar label="Bauart" value={`${a.bauart}, ${a.replikation}`} />
      <Paar label="Geprüft von" value={a.zertifizierer} />
    </div>
  </li>
);

const HalalAnlagen = () => {
  const [kategorie, setKategorie] = useState<Reiter>("alle");
  const [suche, setSuche] = useState("");
  const [nurAusschuettend, setNurAusschuettend] = useState(false);
  const [nurPassiv, setNurPassiv] = useState(false);
  const [sortierung, setSortierung] = useState<Sortierung>("kosten");

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
          a.isin.toLowerCase().includes(q)),
    );
    const sortiert = [...gefiltert];
    if (sortierung === "kosten") sortiert.sort((x, y) => x.kosten - y.kosten);
    if (sortierung === "groesse") sortiert.sort((x, y) => y.groesseSortierwert - x.groesseSortierwert);
    if (sortierung === "name") sortiert.sort((x, y) => x.name.localeCompare(y.name, "de"));
    return sortiert;
  }, [kategorie, suche, nurAusschuettend, nurPassiv, sortierung]);

  const zuruecksetzen = () => {
    setKategorie("alle");
    setSuche("");
    setNurAusschuettend(false);
    setNurPassiv(false);
  };

  return (
    <main className="bg-background">
      <Seo
        title="Halal-Anlagen finden, 23 geprüfte ETFs und Fonds | finanzmuslim"
        description="Alle in Deutschland handelbaren Halal-ETFs, Sukuk, Gold und Silber mit Kosten, Fondsgröße und Zertifizierer. Filterbar und sortierbar, kostenlos."
        path="/halal-anlagen"
      />

      <section className="bg-hero">
        <div className="container py-10 md:py-14">
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

          <h1 className="mt-6 max-w-3xl text-3xl font-bold leading-tight text-foreground md:text-4xl">
            Halal-Anlagen finden
          </h1>
          <p className="mt-3 max-w-2xl text-[17px] leading-relaxed text-muted-foreground">
            23 Anlagen, die es wirklich gibt, mit Kosten, Größe und der Stelle, die sie geprüft hat. Sortier
            nach dem, was dir wichtig ist.
          </p>

          <ul className="mt-6 flex flex-wrap gap-3">
            {kennzahlen.map((k) => (
              <li key={k} className="rounded-lg bg-card px-4 py-2 text-[14px] font-semibold text-foreground">
                {k}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="container py-10 md:py-14">
        {/* Filterleiste */}
        <div className="card-surface p-4 md:p-5">
          <div className="relative mb-4">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <input
              type="search"
              value={suche}
              onChange={(e) => setSuche(e.target.value)}
              aria-label="ETF, Fonds oder ISIN suchen"
              placeholder="ETF, Fonds oder ISIN suchen"
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

          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Kategorie">
            {reiter.map((r) => (
              <button
                key={r.key}
                type="button"
                role="tab"
                aria-selected={kategorie === r.key}
                onClick={() => setKategorie(r.key)}
                className={`min-h-[44px] rounded-lg px-4 text-[15px] font-semibold transition-colors ${
                  kategorie === r.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground hover:bg-hero"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-4 border-t border-border pt-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-6">
              <label className="flex items-center gap-2 text-[15px] text-foreground">
                <Switch checked={nurAusschuettend} onCheckedChange={setNurAusschuettend} />
                nur ausschüttend
              </label>
              <label className="flex items-center gap-2 text-[15px] text-foreground">
                <Switch checked={nurPassiv} onCheckedChange={setNurPassiv} />
                nur passiv
              </label>
            </div>

            <label className="flex items-center gap-2 text-[15px] text-muted-foreground">
              Sortierung
              <select
                value={sortierung}
                onChange={(e) => setSortierung(e.target.value as Sortierung)}
                className="min-h-[44px] rounded-lg border border-border bg-background px-3 text-[15px] text-foreground focus:border-primary focus:outline-none"
              >
                <option value="kosten">Kosten aufsteigend</option>
                <option value="groesse">Größe absteigend</option>
                <option value="name">Name A bis Z</option>
              </select>
            </label>
          </div>
        </div>

        <p className="mt-4 text-[14px] text-muted-foreground" aria-live="polite">
          {liste.length} {liste.length === 1 ? "Anlage wird" : "Anlagen werden"} angezeigt
        </p>

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
        {/* Tabelle ab md, darunter Karten */}
        <div className="mt-4 hidden md:block">
          <table className="w-full table-fixed border-collapse text-left">
            <thead>
              <tr className="text-[13px] text-muted-foreground">
                <th scope="col" className="w-[26%] pb-3 pr-3 font-semibold">Anbieter und Name</th>
                <th scope="col" className="w-[12%] pb-3 pr-3 font-semibold">ISIN</th>
                <th scope="col" className="w-[11%] pb-3 pr-3 font-semibold">Kosten pro Jahr</th>
                <th scope="col" className="w-[12%] pb-3 pr-3 font-semibold">Größe</th>
                <th scope="col" className="w-[13%] pb-3 pr-3 font-semibold">Ertrag</th>
                <th scope="col" className="w-[10%] pb-3 pr-3 font-semibold">Bauart</th>
                <th scope="col" className="w-[16%] pb-3 font-semibold">Geprüft von</th>
              </tr>
            </thead>
            <tbody>
              {liste.map((a) => (
                <tr key={a.isin} className="border-t border-border align-top">
                  <td className="py-4 pr-3">
                    <div className="flex items-start gap-3">
                      <AnbieterKachel name={a.anbieter} />
                      <div className="min-w-0">
                        <p className="text-[15px] font-semibold text-foreground">{a.name}</p>
                        {a.hinweis && <p className="mt-1 text-[13px] text-muted-foreground">{a.hinweis}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 pr-3 text-[13px] text-muted-foreground">{a.isin}</td>
                  <td className="py-4 pr-3 text-[18px] font-bold text-foreground">{a.kostenLabel}</td>
                  <td className="py-4 pr-3 text-[14px] text-foreground">{a.groesse}</td>
                  <td className="py-4 pr-3 text-[14px] text-foreground">{a.ertragDetail}</td>
                  <td className="py-4 pr-3 text-[14px] text-foreground">
                    <span className="inline-flex items-center gap-1">
                      {a.bauart}
                      <BauartHilfe />
                    </span>
                  </td>
                  <td className="py-4 text-[13px] text-muted-foreground">{a.zertifizierer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className="mt-4 space-y-4 md:hidden">
          {liste.map((a) => (
            <Karte key={a.isin} a={a} />
          ))}
        </ul>
          </>
        )}

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
        <section className="mt-10">
          <h2 className="text-xl font-bold text-foreground md:text-2xl">Krypto, nur als kleine Beimischung</h2>
          <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-muted-foreground">
            Bitcoin und Ether haben keine laufenden Kosten und keine ISIN, deshalb stehen sie hier getrennt.
            Für beide gibt es ein Gutachten, das sie als zulässig einordnet.
          </p>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {kryptoAnlagen.map((k) => (
              <li key={k.name} className="card-surface p-5">
                <p className="text-[16px] font-semibold text-foreground">{k.name}</p>
                <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{k.gutachten}</p>
              </li>
            ))}
          </ul>
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
