import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import Seo from "@/components/Seo";
import NewsletterBox from "@/components/NewsletterBox";
import { vorlagen } from "@/data/vorlagen";
import MotivBild from "@/components/MotivBild";

const Vorlagen = () => (
  <main className="bg-background">
    <Seo
      title="Kostenlose Vorlagen | finanzmuslim"
      description="Halal-Anlagenliste, Vertrags-Ampel und Aktien-Spickzettel. Kurz, konkret, sofort nutzbar. Kein Konto nötig, keine Anmeldung."
      path="/vorlagen"
      brotkrumen={[{ name: "Vorlagen", path: "/vorlagen" }]}
    />
    <div className="container py-10 md:py-14">
      <nav aria-label="Brotkrumen" className="flex flex-wrap items-center gap-1 text-[13px] text-muted-foreground">
        <Link to="/" className="hover:text-primary">
          Start
        </Link>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        <span className="text-foreground">Vorlagen</span>
      </nav>

      <header className="mt-6 max-w-3xl">
        <h1 className="text-3xl font-bold leading-tight text-foreground md:text-4xl">Kostenlose Vorlagen</h1>
        <p className="mt-3 text-[17px] text-muted-foreground">
          Kurz, konkret, sofort nutzbar. Kein Konto nötig, keine Anmeldung, kein Haken.
        </p>
      </header>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {vorlagen.map((v) => (
          <article key={v.slug} className="flex flex-col overflow-hidden rounded-2xl bg-hero">
            <MotivBild name={v.motiv} className="max-h-[104px] md:max-h-none" />
            <div className="flex flex-1 flex-col p-6">
            <span className="badge-new self-start">{v.kicker}</span>
            <h2 className="mt-3 text-[19px] font-bold leading-snug text-foreground">{v.titel}</h2>
            <p className="mt-2 flex-1 text-[15px] leading-relaxed text-muted-foreground">{v.kurzbeschreibung}</p>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <Link to={`/vorlagen/${v.slug}`} className="btn-primary">
                Ansehen
              </Link>
              <a href={v.pdfPfad} download className="text-[15px] font-semibold text-primary hover:underline">
                PDF laden
              </a>
            </div>
            </div>
          </article>
        ))}
      </div>

      <section className="card-surface mt-6 p-6 md:p-8">
        <h2 className="text-xl font-bold text-foreground">Die drei großen Guides</h2>
        <p className="mt-2 max-w-2xl text-[16px] leading-relaxed text-muted-foreground">
          Einsteiger, Fortgeschritten und Profi laufen über die Guide-Seite.
        </p>
        <Link to="/halal-guide" className="btn-primary mt-5">
          Zum Guide
        </Link>
      </section>

      <section className="mt-14">
        <NewsletterBox />
      </section>
    </div>
  </main>
);

export default Vorlagen;
