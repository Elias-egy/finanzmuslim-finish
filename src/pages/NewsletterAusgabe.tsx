import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Seo from "@/components/Seo";
import FreitagsbriefFormular from "@/components/FreitagsbriefFormular";
import NotFound from "@/pages/NotFound";
import { ausgabeAusSlug, ausgabePfad, datumLang, nachbarn } from "@/data/newsletterAusgaben";

/**
 * Eine Ausgabe des Freitagsbriefs als Seite. Gleiche Rubriken und Reihenfolge wie in
 * der Mail, Werbeplätze bleiben drin und sind gekennzeichnet. Am Ende das Anmeldefeld,
 * darunter vorige und nächste Ausgabe (~/rebrand/NEWSLETTER_SYSTEM.md, Abschnitt 4).
 */
const NewsletterAusgabe = () => {
  const { slug } = useParams();
  const ausgabe = ausgabeAusSlug(slug);
  if (!ausgabe) return <NotFound />;

  const { vorige, naechste } = nachbarn(ausgabe);

  return (
    <main className="bg-background">
      <Seo
        title={`${ausgabe.titel} | Freitagsbrief Nr. ${ausgabe.nr}`}
        description={ausgabe.kurz}
        path={ausgabePfad(ausgabe)}
        noindex
      />
      <article className="container py-12 md:py-16">
        <header className="mx-auto max-w-[700px]">
          <p className="text-[13px] font-bold uppercase tracking-wide text-violet">Freitagsbrief Nr. {ausgabe.nr}</p>
          <h1 className="mt-2 text-3xl font-bold leading-tight text-foreground md:text-4xl">{ausgabe.titel}</h1>
          <p className="mt-3 text-[14px] text-muted-foreground">
            {datumLang(ausgabe.datum)} · {ausgabe.lesezeitMin} Minuten Lesezeit
          </p>
        </header>

        <div className="mx-auto mt-10 max-w-[700px] space-y-10">
          {ausgabe.rubriken.map((r) => (
            <section key={r.titel}>
              {r.anzeige && (
                <p className="mb-1 text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">Anzeige</p>
              )}
              <h2 className="text-xl font-bold text-foreground">{r.titel}</h2>
              {r.absaetze.map((text) => (
                <p key={text} className="mt-3 text-[17px] leading-relaxed text-foreground/90">
                  {text}
                </p>
              ))}
              {r.link && (
                <Link
                  to={r.link.to}
                  className="mt-3 inline-flex items-center gap-1 text-[16px] font-bold text-primary hover:underline"
                >
                  {r.link.text}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              )}
            </section>
          ))}
        </div>

        <section className="mx-auto mt-14 max-w-[700px] rounded-2xl bg-accent px-5 py-8 text-center md:px-10">
          <h2 className="text-[22px] font-bold leading-tight text-foreground md:text-[26px]">
            Diese Ausgabe hast du verpasst. Die nächste nicht.
          </h2>
          <FreitagsbriefFormular id="ausgabe-email" variante="kasten" />
        </section>

        {(vorige || naechste) && (
          <nav aria-label="Weitere Ausgaben" className="mx-auto mt-10 grid max-w-[700px] gap-3 sm:grid-cols-2">
            {vorige && (
              <Link to={ausgabePfad(vorige)} className="card-surface group p-4">
                <span className="flex items-center gap-1 text-[13px] text-muted-foreground">
                  <ArrowLeft className="h-4 w-4" aria-hidden />
                  Vorige Ausgabe
                </span>
                <span className="mt-1 block text-[16px] font-bold text-foreground group-hover:text-primary">
                  {vorige.titel}
                </span>
              </Link>
            )}
            {naechste && (
              <Link to={ausgabePfad(naechste)} className="card-surface group p-4 sm:col-start-2 sm:text-right">
                <span className="flex items-center gap-1 text-[13px] text-muted-foreground sm:justify-end">
                  Nächste Ausgabe
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </span>
                <span className="mt-1 block text-[16px] font-bold text-foreground group-hover:text-primary">
                  {naechste.titel}
                </span>
              </Link>
            )}
          </nav>
        )}

        <p className="mx-auto mt-8 max-w-[700px] text-center">
          <Link to="/newsletter/archiv" className="text-[15px] font-bold text-primary hover:underline">
            Alle Ausgaben
          </Link>
        </p>
      </article>
    </main>
  );
};

export default NewsletterAusgabe;
