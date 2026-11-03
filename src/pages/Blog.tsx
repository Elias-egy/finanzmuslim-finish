import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import MotivBild from "@/components/MotivBild";
import Seo from "@/components/Seo";
import AdSlot from "@/components/AdSlot";
import NewsletterBox from "@/components/NewsletterBox";
import { beitragPfad, themen, wissenBeitraege, type WissenBeitrag, type WissenThema } from "@/data/wissenBeitraege";
import eliasPortrait from "@/assets/elias-autor.webp";

const LINKEDIN = "https://www.linkedin.com/in/elias-el-gendy";

/**
 * Blog-Übersicht nach dem frontal-Muster (Vault PLAN.md M2.10, vorbilder/ZERLEGUNG-SEITEN.md Z. 31 bis 49):
 * H1 mit Unterzeile, Filterknöpfe je Thema, Zähler, eine Karte je Beitrag mit Thema, Datum, Titel, Satz
 * und Autor mit LinkedIn. Alle Karten stehen im HTML; der Filter blendet nur aus, Google sieht alle.
 */
const fertig = wissenBeitraege.filter((b) => !b.bald);

const Karte = ({ b }: { b: WissenBeitrag }) => (
  <article className="relative flex items-start gap-4 card-surface p-4 transition-colors hover:border-primary">
    <span className="w-24 shrink-0 overflow-hidden rounded-lg sm:w-36">
      <MotivBild name={b.motiv} />
    </span>
    <div className="min-w-0 flex-1">
      <p className="text-[13px] text-muted-foreground">
        <span className="font-semibold text-primary">{b.thema}</span> · {b.datum}
      </p>
      <h2 className="mt-1 text-[17px] font-bold leading-snug text-foreground">
        {/* Der Titel ist der Link; er spannt über die ganze Karte, der Autor-Link liegt darüber. */}
        <Link to={beitragPfad(b)} className="after:absolute after:inset-0 after:rounded-xl">
          {b.name}
        </Link>
      </h2>
      <p className="mt-1 text-[15px] text-muted-foreground">{b.desc}</p>
      <p className="mt-2 flex items-center gap-2 text-[13px] text-muted-foreground">
        <img src={eliasPortrait} alt="" width={20} height={20} className="h-5 w-5 rounded-full object-cover" loading="lazy" />
        <a href={LINKEDIN} target="_blank" rel="noopener" className="relative z-10 font-semibold text-foreground hover:text-primary">
          Elias El-Gendy
        </a>
      </p>
    </div>
  </article>
);

const Blog = () => {
  const [filter, setFilter] = useState<WissenThema | "alle">("alle");
  const liste = filter === "alle" ? fertig : fertig.filter((b) => b.thema === filter);
  const knoepfe: { wert: WissenThema | "alle"; name: string }[] = [
    { wert: "alle", name: "Alle" },
    ...themen.map((t) => ({ wert: t.thema, name: t.thema })),
  ];

  return (
    <main className="bg-background">
      <Seo
        title="Blog: Halal investieren und Geld anlegen | finanzmuslim"
        description="Lerne, wie du dein Geld halal anlegst: Halal ETFs, Gold und ein Girokonto ohne Zinsen. Beiträge von Elias El-Gendy für Muslime in Deutschland."
        path="/blog"
        brotkrumen={[{ name: "Blog", path: "/blog" }]}
      />
      <div className="container py-10 md:py-14">
        <nav aria-label="Brotkrumen" className="mx-auto flex max-w-3xl flex-wrap items-center gap-1 text-[13px] text-muted-foreground">
          <Link to="/" className="hover:text-primary">
            Start
          </Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          <span className="text-foreground">Blog</span>
        </nav>

        <header className="mx-auto mt-6 max-w-3xl">
          <h1 className="text-3xl font-bold leading-tight text-foreground md:text-4xl">Geld halal anlegen</h1>
          <p className="mt-3 text-[17px] text-muted-foreground">
            Finde, was du kaufst, wo du es kaufst und was es kostet: von Halal ETFs bis zum Girokonto ohne Zinsen.
          </p>
        </header>

        <div className="mx-auto mt-8 max-w-3xl">
          <div role="group" aria-label="Nach Thema filtern" className="flex flex-wrap gap-2">
            {knoepfe.map((k) => (
              <button
                key={k.wert}
                type="button"
                aria-pressed={filter === k.wert}
                onClick={() => setFilter(k.wert)}
                className={`rounded-full border px-4 py-2 text-[15px] font-semibold transition-colors ${
                  filter === k.wert
                    ? "border-primary bg-primary text-white"
                    : "border-border bg-card text-primary hover:border-primary"
                }`}
              >
                {k.name}
              </button>
            ))}
          </div>
          <p className="mt-4 text-[14px] text-muted-foreground" aria-live="polite">
            {liste.length} Beiträge
          </p>
        </div>

        <div className="mx-auto mt-4 max-w-3xl space-y-4">
          {liste.map((b, i) => (
            <div key={b.slug}>
              <Karte b={b} />
              {/* Werbefläche wie vorher nach dem ersten Themenblock, hier nach der sechsten Karte. */}
              {filter === "alle" && i === 5 && (
                <div className="mt-8 mb-4">
                  <AdSlot id="blog-mitte" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-3xl">
          <NewsletterBox />
        </div>
      </div>
    </main>
  );
};

export default Blog;
