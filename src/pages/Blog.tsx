import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import Seo from "@/components/Seo";
import blogPlate from "@/assets/blog-plate.webp";

/**
 * /blog — vorbereitete Uebersichtsseite. Es existieren noch keine Artikel;
 * die Karte unten ist die wiederverwendbare Struktur fuer spaetere Beitraege.
 * KEINE erfundenen Artikel oder Daten.
 */

/** Wiederverwendbare Artikelkarte fuer spaetere Blogbeitraege. */
export type BlogArticle = {
  title: string;
  teaser: string;
  category: string;
  date: string;
  href: string;
  image?: string;
};

export const ArticleCard = ({ article }: { article: BlogArticle }) => (
  <Link
    to={article.href}
    className="group block rounded-[1.5rem] overflow-hidden bg-card border border-border/70 shadow-[0_20px_50px_-30px_rgba(80,60,20,0.25)] hover:-translate-y-1 hover:shadow-[0_25px_60px_-25px_rgba(80,60,20,0.3)] transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2"
  >
    {article.image && (
      <div className="aspect-[16/9] overflow-hidden bg-surface">
        <img
          src={article.image}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
        />
      </div>
    )}
    <div className="p-6 md:p-7">
      <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.16em]">
        <span className="text-gold-deep">{article.category}</span>
        <span className="text-muted-foreground/60">{article.date}</span>
      </div>
      <h2 className="headline text-xl md:text-[22px] mt-3">{article.title}</h2>
      <p className="mt-2 text-[15px] text-muted-foreground leading-relaxed">{article.teaser}</p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary">
        Weiterlesen
        <ArrowRight className="h-4 w-4 transition-transform motion-safe:group-hover:translate-x-0.5" aria-hidden />
      </span>
    </div>
  </Link>
);

const upcomingTopics = [
  "Islamische Finanzurteile verständlich erklärt",
  "Versicherungen aus islamischer Sicht",
  "Praktisches Investieren Schritt für Schritt",
];

const Blog = () => (
  <div className="min-h-screen bg-background">
    <Seo
      title="Blog: Halal Investieren verständlich erklärt | finanzmuslim"
      description="Artikel zu islamkonformen Finanzen: Riba, Gharar, Shariah-Screening, Sukuk und halal Anlageklassen. Sorgfältig recherchiert, ohne Anlageberatung."
      path="/blog"
    />
    <SiteHeader active="/blog" />
    <main>
      <section className="container pt-14 md:pt-20 pb-16 md:pb-24">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.25em] text-gold-deep">
            <span className="h-px w-6 bg-gold" aria-hidden /> Blog
          </span>
          <h1 className="headline text-4xl md:text-[52px] leading-[1.05] mt-4">
            Wissen, das dich weiterbringt.
          </h1>
          <p className="mt-4 text-muted-foreground leading-relaxed text-base md:text-[17px]">
            Hier entstehen fundierte Artikel rund um islamkonforme Finanzen,
            sorgfältig recherchiert statt schnell produziert.
          </p>
        </div>

        {/* Leerer Zustand: ehrlich, redaktionell — Materialbild + Themenliste */}
        <div className="mt-10 md:mt-14 grid md:grid-cols-[1fr_1.1fr] gap-8 md:gap-14 items-center">
          <img
            src={blogPlate}
            alt=""
            aria-hidden
            loading="lazy"
            className="w-full rounded-[1.5rem] md:rounded-[1.75rem] object-cover aspect-[3/2]"
          />
          <div>
            <h2 className="headline text-2xl md:text-3xl">Die ersten Artikel sind in Arbeit.</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">Geplante Themen:</p>
            <ul className="mt-4 space-y-3">
              {upcomingTopics.map((topic) => (
                <li key={topic} className="flex items-start gap-3 text-[15px] text-foreground/80">
                  <span className="mt-[0.7em] h-px w-5 shrink-0 bg-gold/70" aria-hidden />
                  {topic}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[15px] text-muted-foreground">
              Bis dahin: Der kostenlose Halal Investment Guide deckt die
              wichtigsten Grundlagen bereits ab.
            </p>
            <Link
              to="/halal-guide"
              className="pill-btn mt-6 bg-[#143328] text-white hover:bg-[#1a4233]"
            >
              Guide sichern
            </Link>
          </div>
        </div>
      </section>
    </main>
    <SiteFooter />
  </div>
);

export default Blog;
