import { useState } from "react";
import { Link } from "react-router-dom";
import BlogKachel from "@/components/BlogKachel";
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
/* Reihenfolge nach dem Leser (Seiten-Prüfer SEO46, Skill leser-finanzmuslim): ETF, Girokonto, Gold, Aktien vorn, Krypto und Kredit ans Ende. */
const VORNE = ["halal-etfs", "girokonto-ohne-zinsen", "halal-gold-kaufen", "sind-aktien-halal"];
const HINTEN = ["ist-bitcoin-halal", "halal-kredit-ohne-zinsen"];
const rang = (slug: string) => (VORNE.includes(slug) ? VORNE.indexOf(slug) - 100 : HINTEN.includes(slug) ? 100 + HINTEN.indexOf(slug) : 0);
const fertig = wissenBeitraege.filter((b) => !b.bald).sort((x, y) => rang(x.slug) - rang(y.slug));
/** Karte wie frontal.so/blog: Kachel, Thema und Datum, Titel, ein Satz, Autor, Knopf (Elias SEO47). */
const Karte = ({ b }: { b: WissenBeitrag }) => (
  <article className="relative flex flex-col border border-border bg-background p-4 transition-colors hover:border-foreground sm:p-5">
    <BlogKachel thema={b.thema} />
    <p className="mt-4 flex items-center justify-between gap-3 font-mono text-[12px] uppercase tracking-[0.12em] text-muted-foreground">
      <span className="text-primary">{b.thema}</span>
      <span>{b.datum}</span>
    </p>
    <h2 className="mt-2 text-[18px] font-semibold leading-snug text-foreground">
      {/* Der Titel ist der Link; er spannt über die ganze Karte, der Autor-Link liegt darüber. */}
      <Link to={beitragPfad(b)} className="after:absolute after:inset-0">
        {b.name}
      </Link>
    </h2>
    <p className="mt-1.5 text-[15px] leading-relaxed text-foreground/70">{b.desc}</p>
    <div className="mt-auto pt-4">
      <p className="flex items-center gap-3">
        <img src={eliasPortrait} alt="" width={36} height={36} className="h-9 w-9 object-cover" loading="lazy" />
        <span className="leading-tight">
          <a href={LINKEDIN} target="_blank" rel="noopener" className="relative z-10 text-[14px] font-semibold text-foreground hover:text-primary">
            Elias El-Gendy
          </a>
          <span className="block text-[13px] text-muted-foreground">Gründer von finanzmuslim</span>
        </span>
      </p>
      <span className="mt-4 flex min-h-[44px] items-center justify-center border border-border font-mono text-[12px] uppercase tracking-[0.14em] text-foreground">
        Beitrag lesen
      </span>
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
        <nav aria-label="Brotkrumen" className="mx-auto flex max-w-5xl flex-wrap items-center gap-2 font-mono text-[12px] uppercase tracking-[0.12em] text-muted-foreground">
          <Link to="/" className="text-primary hover:underline">
            Start
          </Link>
          <span aria-hidden>/</span>
          <span>Blog</span>
        </nav>

        <header className="mx-auto mt-6 max-w-5xl">
          <h1 className="font-titel text-[34px] leading-[1.1] text-foreground md:text-[46px]">Geld halal anlegen</h1>
          <p className="mt-4 max-w-[600px] text-[18px] leading-[1.5] text-foreground/75">
            Finde, was du kaufst, wo du es kaufst und was es kostet: von Halal ETFs bis zum Girokonto ohne Zinsen.
          </p>
        </header>

        <div className="mx-auto mt-8 max-w-5xl">
          <div role="group" aria-label="Nach Thema filtern" className="flex flex-wrap gap-2">
            {knoepfe.map((k) => (
              <button
                key={k.wert}
                type="button"
                aria-pressed={filter === k.wert}
                onClick={() => setFilter(k.wert)}
                className={`min-h-[44px] border px-4 py-2 font-mono text-[12px] uppercase tracking-[0.12em] transition-colors ${
                  filter === k.wert
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-background text-foreground hover:border-foreground"
                }`}
              >
                {k.name}
              </button>
            ))}
          </div>
          <p className="mt-5 font-mono text-[12px] uppercase tracking-[0.12em] text-muted-foreground" aria-live="polite">
            {liste.length} Beiträge
          </p>
        </div>

        <div className="mx-auto mt-4 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {liste.map((b) => (
            <Karte key={b.slug} b={b} />
          ))}
        </div>
        {/* Werbefläche unter dem Raster: zwischen den Karten hätte sie das Raster zerrissen; leer stellt sie nichts dar */}
        {filter === "alle" && (
          <div className="mx-auto max-w-5xl">
            <AdSlot id="blog-mitte" />
          </div>
        )}

        <div className="mx-auto mt-12 max-w-3xl">
          <NewsletterBox />
        </div>
      </div>
    </main>
  );
};

export default Blog;
