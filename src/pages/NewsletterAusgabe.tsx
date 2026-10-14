import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Seo from "@/components/Seo";
import FreitagsbriefFormular from "@/components/FreitagsbriefFormular";
import NotFound from "@/pages/NotFound";
import { ausgabeAusSlug, ausgabePfad, datumLang, nachbarn, type Rubrik } from "@/data/newsletterAusgaben";

const WERBEHINWEIS =
  "Werbung: Auf der Seite stehen Partnerlinks. Eröffnest du darüber ein Konto, bekomme ich eine Provision. Für dich ändert sich nichts.";

/** Fett, klein und Links wie in der Mail: `<strong>`, `<small>`, `[[Text|/pfad]]`. */
const Inline = ({ text }: { text: string }) => {
  const teile = text.split(/(<strong>.*?<\/strong>|<small>.*?<\/small>|\[\[[^\]]+\]\])/g).filter(Boolean);
  return (
    <>
      {teile.map((t, i) => {
        if (t.startsWith("<strong>")) return <strong key={i}><Inline text={t.slice(8, -9)} /></strong>;
        if (t.startsWith("<small>")) return <small key={i} className="text-[13px] text-muted-foreground">{t.slice(7, -8)}</small>;
        const link = t.match(/^\[\[([^|\]]+)\|([^\]]+)\]\]$/);
        if (link)
          return (
            <Link key={i} to={link[2].trim()} className="text-primary underline underline-offset-2">
              {link[1].trim()}
            </Link>
          );
        return t.replace(/ (€|%)/g, "\u00a0$1"); // no lone € or % at the start of a line, like the mail
      })}
    </>
  );
};

/** Ein Absatz der Mail: Bild, Zwischentitel, Liste oder Text. */
const Absatz = ({ text }: { text: string }) => {
  const bild = text.match(/^!\[([^\]]*)\]\((https:[^)]+)\)$/);
  if (bild) return <img src={bild[2]} alt={bild[1]} loading="lazy" className="mt-4 h-auto w-full rounded-lg" />;
  if (text.startsWith("## ")) return <h3 className="mt-6 text-[19px] font-bold leading-snug text-foreground"><Inline text={text.slice(3)} /></h3>;
  if (text.startsWith("- "))
    return (
      <ul className="mt-3 list-disc space-y-2 pl-6 text-[17px] leading-relaxed text-foreground/90">
        {text.split("\n").map((z) => <li key={z}><Inline text={z.slice(2)} /></li>)}
      </ul>
    );
  return <p className="mt-3 text-[17px] leading-relaxed text-foreground/90"><Inline text={text} /></p>;
};

const Abschnitt = ({ r }: { r: Rubrik }) => (
  <section id={r.anker} className="scroll-mt-32">
    {(r.anzeige || r.kicker) && (
      <p className="mb-1 text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">
        {r.anzeige ? "Anzeige" : r.kicker}
      </p>
    )}
    <h2 className="text-xl font-bold text-foreground">{r.emoji && !r.anzeige ? `${r.emoji} ${r.titel}` : r.titel}</h2>
    {r.absaetze.map((text) => <Absatz key={text} text={text} />)}
    {r.abstimmung && (
      <p className="mt-3 text-[17px] leading-relaxed text-foreground/90">
        <strong>{r.abstimmung.frage}</strong> {r.abstimmung.woerter.join(" · ")}
      </p>
    )}
    {r.link && (
      <Link
        to={r.link.to}
        className="mt-3 inline-flex items-center gap-1 text-[16px] font-bold text-primary hover:underline"
      >
        {r.link.text}
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    )}
    {(r.anzeige || r.werbung) && (
      <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">{r.werbung ?? WERBEHINWEIS}</p>
    )}
  </section>
);

/**
 * Eine Ausgabe der Halal-News als Seite. Gleiche Rubriken und Reihenfolge wie in
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
        title={`${ausgabe.titel} | Halal-News Nr. ${ausgabe.nr}`}
        description={ausgabe.kurz}
        path={ausgabePfad(ausgabe)}
        noindex
      />
      <article className="container py-12 md:py-16">
        <header className="mx-auto max-w-[700px]">
          <p className="text-[13px] font-bold uppercase tracking-wide text-violet">Halal-News Nr. {ausgabe.nr}</p>
          <h1 className="mt-2 text-3xl font-bold leading-tight text-foreground md:text-4xl">{ausgabe.titel}</h1>
          <p className="mt-3 text-[14px] text-muted-foreground">
            {datumLang(ausgabe.datum)} · {ausgabe.lesezeitMin} Minuten Lesezeit
          </p>
        </header>

        {ausgabe.titelbild && (
          <img
            src={ausgabe.titelbild}
            alt={ausgabe.titelbildAlt ?? ausgabe.titel}
            className="mx-auto mt-8 h-auto w-full max-w-[700px] rounded-lg"
          />
        )}

        {(ausgabe.einleitung || ausgabe.inhalt) && (
          <div className="mx-auto mt-8 max-w-[700px]">
            {ausgabe.einleitung?.map((t) =>
              t.startsWith("# ") ? (
                <p key={t} className="mt-3 text-[22px] font-bold leading-snug text-foreground">{t.slice(2)}</p>
              ) : (
                <Absatz key={t} text={t} />
              ),
            )}
            {ausgabe.inhalt && (
              <ul className="mt-3 list-disc space-y-2 pl-6 text-[17px] leading-relaxed text-foreground/90">
                {ausgabe.inhalt.map((z) => (
                  <li key={z.wort}>
                    {z.emoji} <strong>{z.wort}:</strong>{" "}
                    {z.anker ? (
                      <a href={`#${z.anker}`} className="text-primary underline underline-offset-2">{z.text}</a>
                    ) : z.to ? (
                      <Link to={z.to} className="text-primary underline underline-offset-2">{z.text}</Link>
                    ) : (
                      z.text
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="mx-auto mt-10 max-w-[700px] space-y-10">
          {ausgabe.rubriken.map((r) => <Abschnitt key={r.titel} r={r} />)}
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
