import { Link } from "react-router-dom";
import Seo from "@/components/Seo";
import NewsletterBox from "@/components/NewsletterBox";
import { ausgabePfad, datumLang, neuesteZuerst } from "@/data/newsletterAusgaben";

/**
 * Alle Ausgaben des Freitagsbriefs. Eine einfache Liste, keine Kacheln: je Zeile
 * Datum, Titel und der eine Satz, worum es ging (~/rebrand/NEWSLETTER_SYSTEM.md).
 * noindex, nicht in der Sitemap, verlinkt erst, wenn es eine Ausgabe gibt.
 */
const NewsletterArchiv = () => {
  const liste = neuesteZuerst();

  return (
    <main className="bg-background">
      <Seo
        title="Alle Ausgaben des Freitagsbriefs | finanzmuslim"
        description="Lies jede Ausgabe des Freitagsbriefs nach, die neueste steht oben."
        path="/newsletter/archiv"
        noindex
      />
      <div className="container py-12 md:py-16">
        <header className="mx-auto max-w-[700px]">
          <p className="text-[13px] font-bold uppercase tracking-wide text-violet">Newsletter</p>
          <h1 className="mt-2 text-3xl font-bold leading-tight text-foreground md:text-4xl">Alle Ausgaben</h1>
          <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground">
            Lies jede Ausgabe des Freitagsbriefs nach, die neueste steht oben.
          </p>
        </header>

        <section className="mx-auto mt-10 max-w-[700px]">
          {liste.length > 0 ? (
            <ul className="divide-y divide-border border-y border-border">
              {liste.map((a) => (
                <li key={a.nr}>
                  <Link to={ausgabePfad(a)} className="group block py-5">
                    <p className="text-[13px] text-muted-foreground">
                      Nr. {a.nr} · {datumLang(a.datum)}
                    </p>
                    <p className="mt-1 text-[18px] font-bold text-foreground group-hover:text-primary">{a.titel}</p>
                    <p className="mt-1 text-[15px] leading-relaxed text-muted-foreground">{a.kurz}</p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="card-surface p-5 text-[16px] leading-relaxed text-muted-foreground">
              Noch keine Ausgabe verschickt. Trag dich ein, dann kommt die erste direkt in dein Postfach.
            </p>
          )}
        </section>

        <section className="mt-14">
          <NewsletterBox />
        </section>
      </div>
    </main>
  );
};

export default NewsletterArchiv;
