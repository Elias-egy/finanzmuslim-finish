import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import MotivBild from "@/components/MotivBild";
import { type MotivName } from "@/components/motive";
import Seo from "@/components/Seo";
import AdSlot from "@/components/AdSlot";
import NewsletterBox from "@/components/NewsletterBox";
import { vorlagen } from "@/data/vorlagen";

type Artikel = { name: string; desc: string; thema: string; motiv: MotivName; to?: string };

/** Eine durchgehende Liste. Reihenfolge = Anzeigereihenfolge. */
const artikel: Artikel[] = [
  { name: "Was ist Riba", motiv: "zins", desc: "Zins im Islam: Bedeutung, Formen und Alternativen.", thema: "Grundlagen", to: "/wissen/was-ist-riba" },
  { name: "Was ist Gharar", motiv: "gharar", desc: "Warum übermäßige Unsicherheit in Verträgen problematisch ist.", thema: "Grundlagen" },
  { name: "Halal investieren für Anfänger", motiv: "kompass", desc: "Der Einstieg Schritt für Schritt erklärt.", thema: "Grundlagen", to: "/halal-guide" },
  { name: "Die häufigsten Fehler", motiv: "fehler", desc: "Stolperfallen, die viele am Anfang übersehen.", thema: "Grundlagen" },
  { name: "Halal ETFs", motiv: "etf", desc: "Wie sharia-konforme ETFs aufgebaut sind.", thema: "Investieren" },
  { name: "Aktien richtig prüfen", motiv: "aktienPruefen", desc: "Nach welchen Kriterien Einzelaktien geprüft werden.", thema: "Investieren", to: "/wissen/sind-aktien-halal" },
  { name: "Sukuk", motiv: "sukuk", desc: "Was hinter islamischen Anleihen steckt.", thema: "Investieren" },
  { name: "Gold kaufen", motiv: "gold", desc: "Worauf es beim Kauf von physischem Gold ankommt.", thema: "Investieren" },
  { name: "Krypto", motiv: "krypto", desc: "Die Diskussion um digitale Währungen im Islam.", thema: "Investieren" },
  { name: "Girokonto ohne Zinsfalle", motiv: "karte", desc: "Worauf du bei deinem Alltagskonto achtest.", thema: "Alltag" },
  { name: "Dispo und Kredit", motiv: "kredit", desc: "Warum eingeräumte Kredite problematisch sind.", thema: "Alltag" },
  { name: "Ratenkauf", motiv: "raten", desc: "Wann Ratenzahlung zur Zinsfalle wird.", thema: "Alltag" },
  { name: "Leasing", motiv: "auto", desc: "Wie Leasingverträge aus islamischer Sicht bewertet werden.", thema: "Alltag" },
  { name: "Versicherung", motiv: "versicherung", desc: "Konventionelle Versicherung und Takaful im Vergleich.", thema: "Alltag", to: "/wissen/ist-versicherung-haram" },
  { name: "Zakat berechnen", motiv: "zakat", desc: "So ermittelst du deine Zakat.", thema: "Pflichten", to: "/zakat-rechner" },
  { name: "Nisab verstehen", motiv: "nisab", desc: "Ab welchem Vermögen Zakat fällig wird.", thema: "Pflichten" },
  { name: "Erträge reinigen", motiv: "reinigen", desc: "Wie unreine Erträge ausgesondert werden.", thema: "Pflichten" },
  { name: "Erbe nach islamischem Recht", motiv: "erbe", desc: "Grundzüge der Erbteilung.", thema: "Pflichten" },
];

/** Kategorien in fester Reihenfolge, je mit Ankerpunkt und Erklaersatz. */
const kategorien = [
  { thema: "Grundlagen", id: "grundlagen", satz: "Die Begriffe, ohne die alles andere schwer zu verstehen ist." },
  { thema: "Investieren", id: "investieren", satz: "Wie du dein Geld anlegst, ohne gegen deine Überzeugung zu handeln." },
  { thema: "Alltag", id: "alltag", satz: "Verträge, die dir im normalen Leben begegnen, vom Konto bis zum Leasing." },
  { thema: "Pflichten", id: "pflichten", satz: "Was der Islam an Abgaben und Regeln vorsieht, und wie du es ausrechnest." },
];

/** Fertige Beitraege zuerst, danach die mit "bald". */
const sortiert = (thema: string) => {
  const liste = artikel.filter((a) => a.thema === thema);
  return [...liste.filter((a) => a.to), ...liste.filter((a) => !a.to)];
};

const Zeile = ({ name, desc, motiv, to }: Artikel) => {
  const inhalt = (
    <>
      <span className="w-28 shrink-0 overflow-hidden rounded-lg sm:w-36">
        <MotivBild name={motiv} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[17px] font-bold text-foreground">{name}</span>
        <span className="mt-1 block text-[15px] text-muted-foreground">{desc}</span>
      </span>
    </>
  );

  if (to) {
    return (
      <Link
        to={to}
        className="flex w-full items-center gap-4 card-surface p-4 transition-colors hover:border-primary"
      >
        {inhalt}
      </Link>
    );
  }

  return (
    <div
      aria-disabled="true"
      className="relative flex w-full items-center gap-4 rounded-xl border border-border bg-muted p-4 opacity-70"
    >
      <span className="badge-soon absolute right-3 top-3">bald</span>
      {inhalt}
    </div>
  );
};

const Wissen = () => (
  <main className="bg-background">
    <Seo
      title="Halal-Finanzwissen | finanzmuslim"
      description="Halal-Finanzwissen nach Themen sortiert: Grundlagen, Investieren, Alltag und Pflichten. Verständlich erklärt, ohne Fachchinesisch."
      path="/wissen"
    />
    <div className="container py-10 md:py-14">
      <nav aria-label="Brotkrumen" className="flex flex-wrap items-center gap-1 text-[13px] text-muted-foreground">
        <Link to="/" className="hover:text-primary">
          Start
        </Link>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        <span className="text-foreground">Wissen</span>
      </nav>

      <header className="mt-6 max-w-3xl">
        <h1 className="text-3xl font-bold leading-tight text-foreground md:text-4xl">Halal-Finanzwissen</h1>
        <p className="mt-3 text-[17px] text-muted-foreground">
          Verständlich erklärt, ohne Fachchinesisch. Von Riba bis Zakat.
        </p>
      </header>

      <section className="mt-8 max-w-3xl rounded-2xl bg-hero p-6 md:p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-[17px] font-bold text-foreground">Kostenlose Vorlagen</h2>
          <Link to="/vorlagen" className="text-[14px] font-semibold text-primary hover:underline">
            Alle Vorlagen
          </Link>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {vorlagen.map((v) => (
            <Link
              key={v.slug}
              to={`/vorlagen/${v.slug}`}
              className="card-surface flex flex-col overflow-hidden transition-colors hover:border-primary"
            >
              <MotivBild name={v.motiv} className="max-h-[104px] md:max-h-none" />
              <span className="flex flex-1 flex-col p-4">
              <span className="badge-new self-start">{v.kicker}</span>
              <span className="mt-2 block text-[15px] font-bold leading-snug text-foreground">{v.titel}</span>
              <span className="mt-1 block text-[13px] text-muted-foreground">{v.nutzenZeile}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <nav aria-label="Themen" className="mt-8 flex max-w-3xl flex-wrap gap-2">
        {kategorien.map((k) => (
          <a
            key={k.id}
            href={`#${k.id}`}
            className="rounded-full border border-border bg-card px-4 py-2 text-[15px] font-semibold text-primary transition-colors hover:border-primary"
          >
            {k.thema} ({sortiert(k.thema).length})
          </a>
        ))}
      </nav>

      <div className="mt-10 max-w-3xl space-y-12">
        {kategorien.map((k) => (
          <div key={k.id}>
            <section id={k.id} className="scroll-mt-32">
              <h2 className="text-2xl font-bold text-foreground md:text-[28px]">{k.thema}</h2>
              <p className="mt-2 text-[16px] text-muted-foreground">{k.satz}</p>
              <div className="mt-5 space-y-4">
                {sortiert(k.thema).map((a) => (
                  <Zeile key={a.name} {...a} />
                ))}
              </div>
            </section>
            {(k.id === "grundlagen" || k.id === "alltag") && (
              <div className="mt-8">
                <AdSlot id={`wissen-${k.id}`} />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 max-w-3xl">
        <NewsletterBox />
      </div>
    </div>
  </main>
);

export default Wissen;
