import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import MotivBild from "@/components/MotivBild";
import { type MotivName } from "@/components/motive";
import Seo from "@/components/Seo";
import AdSlot from "@/components/AdSlot";
import NewsletterBox from "@/components/NewsletterBox";
import { vorlagen } from "@/data/vorlagen";
import { themen, wissenBeitraege } from "@/data/wissenBeitraege";

type Artikel = { name: string; desc: string; thema: string; motiv: MotivName; to?: string; neu?: boolean };

/** Eine durchgehende Liste aus dem Register. Reihenfolge = Anzeigereihenfolge. */
const artikel: Artikel[] = [
  ...wissenBeitraege.map((b) => ({
    name: b.name,
    desc: b.desc,
    thema: b.thema,
    motiv: b.motiv,
    to: b.bald ? undefined : `/wissen/${b.slug}`,
    neu: b.neu && !b.bald,
  })),
  { name: "Halal investieren für Anfänger", motiv: "kompass", desc: "Der Einstieg Schritt für Schritt erklärt.", thema: "Grundlagen", to: "/halal-guide" },
  { name: "Zakat berechnen", motiv: "zakat", desc: "So ermittelst du deine Zakat.", thema: "Pflichten", to: "/zakat-rechner" },
];

/** Kategorien in fester Reihenfolge, je mit Ankerpunkt und Erklaersatz. */
const kategorien = themen;

/** Fertige Beitraege zuerst, danach die mit "bald". */
const sortiert = (thema: string) => {
  const liste = artikel.filter((a) => a.thema === thema);
  return [...liste.filter((a) => a.to), ...liste.filter((a) => !a.to)];
};

const Zeile = ({ name, desc, motiv, to, neu }: Artikel) => {
  const inhalt = (
    <>
      <span className="w-28 shrink-0 overflow-hidden rounded-lg sm:w-36">
        <MotivBild name={motiv} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2 text-[17px] font-bold text-foreground">
          {name}
          {neu && <span className="badge-new">Neu</span>}
        </span>
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
      title="Halal Finanzen: von Zinsen bis Zakat erklärt | finanzmuslim"
      description="Ist das halal? Antworten zu Zinsen, Aktien, ETFs, Gold, Krypto, Kredit, Versicherung, Leasing und Zakat. Jede mit Beleg und ohne Fachchinesisch."
      path="/wissen"
      brotkrumen={[{ name: "Wissen", path: "/wissen" }]}
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
          Finde Antworten zu Grundlagen, Alltag und Pflichten. Von der ersten Aktie bis zur Zakat.
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
