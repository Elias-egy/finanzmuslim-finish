import { isValidElement, useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ChevronDown, ChevronRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import EmpfehlungsBox, { type EmpfehlungsBoxProps } from "@/components/EmpfehlungsBox";
import MotivBild from "@/components/MotivBild";
import { beitragBySlug, nachbarn } from "@/data/wissenBeitraege";
import eliasPortrait from "@/assets/elias-hemd.png";

export type BeitragAbschnitt = { id: string; titel: string; inhalt: ReactNode };
export type BeitragFrage = { frage: string; antwort: string };

type Props = {
  /** Der Schlüssel aus `wissenBeitraege`. Liefert Motiv und Nachbarn. */
  slug: string;
  titel: string;
  /** Ein Satz unter der Überschrift, der sagt, warum das jemanden angeht. */
  untertitel?: string;
  kurzGesagt: string[];
  abschnitte: BeitragAbschnitt[];
  faq: BeitragFrage[];
  /** Zum Beispiel "15. August 2026". Das Datum, an dem der Beitrag live ging. */
  datePublished: string;
  /** Nur setzen, wenn der Beitrag nach der Veröffentlichung inhaltlich
   *  überarbeitet wurde — nicht bei Layout, Build, Kursdaten oder anderen
   *  Seiteneffekten. Ohne Beleg bleibt es weg, dann zeigt die Seite nur das
   *  Veröffentlichungsdatum. */
  dateModified?: string;
  rechtshinweis: string;
  boxOben: EmpfehlungsBoxProps;
  boxMitte: EmpfehlungsBoxProps;
  /** Nach welchem Abschnitt (Index, 0-basiert) die mittlere Box steht.
   *  Ohne Angabe nach der Hälfte der Abschnitte. */
  boxMitteNach?: number;
  /** Optionaler Abschlussverweis unter dem Beitrag. */
  children?: ReactNode;
};

/** Reiner Text aus einem ReactNode-Baum, für die Lesezeit-Schätzung. Kein
 *  Rendern, nur die sichtbaren Textknoten einsammeln. */
const textVon = (node: ReactNode): string => {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textVon).join(" ");
  if (isValidElement<{ children?: ReactNode }>(node)) return textVon(node.props.children);
  return "";
};

const WOERTER_PRO_MINUTE = 200;

/** Dünner Balken unter der Kopfzeile, der mit dem Scrollen wächst. */
const Lesefortschritt = () => {
  const [anteil, setAnteil] = useState(0);
  useEffect(() => {
    const messen = () => {
      const h = document.documentElement;
      const gesamt = h.scrollHeight - h.clientHeight;
      setAnteil(gesamt > 0 ? Math.min(1, h.scrollTop / gesamt) : 0);
    };
    messen();
    window.addEventListener("scroll", messen, { passive: true });
    window.addEventListener("resize", messen);
    return () => {
      window.removeEventListener("scroll", messen);
      window.removeEventListener("resize", messen);
    };
  }, []);
  return (
    <div className="fixed left-0 top-[60px] z-40 h-[3px] w-full bg-transparent md:top-[68px]" aria-hidden>
      <div className="h-full bg-primary transition-[width] duration-150" style={{ width: `${anteil * 100}%` }} />
    </div>
  );
};

/** Welcher Abschnitt gerade im Blick ist, für die Sprungmarken. */
const useAktiverAbschnitt = (ids: string[]) => {
  const [aktiv, setAktiv] = useState<string | null>(null);
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const beobachter = new IntersectionObserver(
      (eintraege) => {
        const sichtbar = eintraege
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (sichtbar[0]) setAktiv(sichtbar[0].target.id);
      },
      { rootMargin: "-100px 0px -60% 0px", threshold: 0 },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) beobachter.observe(el);
    });
    return () => beobachter.disconnect();
  }, [ids]);
  return aktiv;
};

/** Feste Reihenfolge fuer alle Wissensbeitraege. */
const BeitragSeite = ({
  slug,
  titel,
  untertitel,
  kurzGesagt,
  abschnitte,
  faq,
  datePublished,
  dateModified,
  rechtshinweis,
  boxOben,
  boxMitte,
  boxMitteNach,
  children,
}: Props) => {
  const [offen, setOffen] = useState(false);
  const eintrag = beitragBySlug(slug);
  const { vorher, nachher } = nachbarn(slug);

  /* Automatisch aus dem tatsächlichen Text geschätzt, nicht von Hand gepflegt
     — sonst veraltet die Angabe beim nächsten Textwechsel unbemerkt. */
  const lesezeit = useMemo(() => {
    const text = [kurzGesagt.join(" "), ...abschnitte.map((a) => textVon(a.inhalt))].join(" ");
    const woerter = text.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(woerter / WOERTER_PRO_MINUTE));
  }, [kurzGesagt, abschnitte]);

  const ids = useMemo(() => [...abschnitte.map((a) => a.id), "faq"], [abschnitte]);
  const aktiv = useAktiverAbschnitt(ids);
  const mitteNach = boxMitteNach ?? Math.max(1, Math.floor(abschnitte.length / 2) - 1);

  const sprungmarken = (
    <ol className="space-y-2">
      {abschnitte.map((a, i) => (
        <li key={a.id}>
          <a
            href={`#${a.id}`}
            className={`flex gap-2.5 text-[15px] leading-snug transition-colors hover:text-primary ${
              aktiv === a.id ? "font-semibold text-primary" : "text-foreground/80"
            }`}
          >
            <span className="w-5 shrink-0 tabular-nums text-muted-foreground">{i + 1}</span>
            <span>{a.titel}</span>
          </a>
        </li>
      ))}
      <li>
        <a
          href="#faq"
          className={`flex gap-2.5 text-[15px] leading-snug transition-colors hover:text-primary ${
            aktiv === "faq" ? "font-semibold text-primary" : "text-foreground/80"
          }`}
        >
          <span className="w-5 shrink-0 tabular-nums text-muted-foreground">{abschnitte.length + 1}</span>
          <span>Häufige Fragen</span>
        </a>
      </li>
    </ol>
  );

  return (
    <main className="bg-background">
      <Lesefortschritt />
      <div className="container py-8 md:py-12">
        <div className="relative lg:mx-auto lg:max-w-[820px]">
          <nav aria-label="Brotkrumen" className="flex flex-wrap items-center gap-1 text-[13px] text-muted-foreground">
            <Link to="/" className="hover:text-primary">
              Start
            </Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            <Link to="/wissen" className="hover:text-primary">
              Wissen
            </Link>
            {eintrag && (
              <>
                <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                <span className="text-foreground">{eintrag.thema}</span>
              </>
            )}
          </nav>

          <article className="mt-5">
            <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                {eintrag && <p className="eyebrow">{eintrag.thema}</p>}
                <h1 className="mt-2 text-[30px] font-bold leading-[1.15] text-foreground md:text-[40px]">{titel}</h1>
                {untertitel && (
                  <p className="mt-3 text-[18px] leading-relaxed text-muted-foreground md:text-[19px]">{untertitel}</p>
                )}
                <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[14px] text-muted-foreground">
                  <span>Von Elias El-Gendy</span>
                  <span aria-hidden>·</span>
                  <span>{dateModified ? `Aktualisiert am ${dateModified}` : `Veröffentlicht am ${datePublished}`}</span>
                  <span aria-hidden>·</span>
                  <span>{lesezeit} Min. Lesezeit</span>
                </p>
              </div>
              {eintrag && (
                <div className="w-[132px] shrink-0 overflow-hidden rounded-2xl sm:w-[150px]">
                  <MotivBild name={eintrag.motiv} className="aspect-square" />
                </div>
              )}
            </header>

            <section className="mt-8 rounded-2xl bg-hero p-6 md:p-8" aria-labelledby="kurz-gesagt">
              <h2 id="kurz-gesagt" className="text-[15px] font-semibold uppercase tracking-[0.12em] text-primary">
                Kurz gesagt
              </h2>
              <ul className="mt-4 space-y-3">
                {kurzGesagt.map((p, i) => (
                  <li key={p} className="flex gap-3 text-[16px] leading-relaxed text-foreground md:text-[17px]">
                    <span
                      className="mt-[3px] flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-[12px] font-bold text-primary-foreground"
                      aria-hidden
                    >
                      {i + 1}
                    </span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </section>

            <div className="mt-6">
              <EmpfehlungsBox {...boxOben} />
            </div>

            <nav aria-label="Inhaltsübersicht" className="mt-8 card-surface p-5 xl:hidden">
              <button
                type="button"
                onClick={() => setOffen((v) => !v)}
                aria-expanded={offen}
                className="flex w-full items-center justify-between text-left text-[17px] font-bold text-foreground md:pointer-events-none"
              >
                Inhalt
                <ChevronDown
                  className={`h-5 w-5 text-muted-foreground transition-transform md:hidden ${offen ? "rotate-180" : ""}`}
                  aria-hidden
                />
              </button>
              <div className={`mt-3 ${offen ? "block" : "hidden"} md:block`}>{sprungmarken}</div>
            </nav>

            <div className="relative mt-10 space-y-12">
              {/* Sprungmarken als Leiste links, nur auf breiten Bildschirmen. Bleibt
                  beim Scrollen stehen und hebt den aktuellen Abschnitt hervor. */}
              <aside className="absolute right-full top-0 hidden h-full w-[220px] pr-10 xl:block" aria-label="Sprungmarken">
                <div className="sticky top-28">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Inhalt</p>
                  <div className="mt-3">{sprungmarken}</div>
                </div>
              </aside>
              {abschnitte.map((a, i) => (
                <div key={a.id} className="space-y-12">
                  <section id={a.id} className="scroll-mt-28">
                    <p className="text-[13px] font-semibold tabular-nums text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <h2 className="mt-1 text-[24px] font-bold leading-[1.2] text-foreground md:text-[30px]">{a.titel}</h2>
                    <div className="beitrag-text mt-4 space-y-4 text-[17px] leading-[1.65] text-foreground/85 md:text-[18px]">
                      {a.inhalt}
                    </div>
                  </section>
                  {i === mitteNach && abschnitte.length > 1 && <EmpfehlungsBox {...boxMitte} />}
                </div>
              ))}
            </div>

            <section id="faq" className="mt-14 scroll-mt-28">
              <p className="text-[13px] font-semibold tabular-nums text-muted-foreground">
                {String(abschnitte.length + 1).padStart(2, "0")}
              </p>
              <h2 className="mt-1 text-[24px] font-bold leading-[1.2] text-foreground md:text-[30px]">Häufig gestellte Fragen</h2>
              <Accordion type="single" collapsible className="mt-4">
                {faq.map((f, i) => (
                  <AccordionItem key={f.frage} value={`f${i}`}>
                    <AccordionTrigger className="text-left text-[17px] font-semibold hover:no-underline">
                      {f.frage}
                    </AccordionTrigger>
                    <AccordionContent className="text-[16px] leading-relaxed text-muted-foreground">
                      {f.antwort}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            {children && <div className="mt-12">{children}</div>}

            {(vorher || nachher) && (
              <nav aria-label="Weiterlesen" className="mt-12 grid gap-3 sm:grid-cols-2">
                {vorher ? (
                  <Link
                    to={`/wissen/${vorher.slug}`}
                    className="group flex items-center gap-4 card-surface p-4 transition-colors hover:border-primary"
                  >
                    <ArrowLeft className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-primary" aria-hidden />
                    <span className="min-w-0">
                      <span className="block text-[12px] uppercase tracking-[0.12em] text-muted-foreground">Vorher</span>
                      <span className="block truncate text-[16px] font-bold text-foreground">{vorher.name}</span>
                    </span>
                  </Link>
                ) : (
                  <span />
                )}
                {nachher && (
                  <Link
                    to={`/wissen/${nachher.slug}`}
                    className="group flex items-center justify-end gap-4 card-surface p-4 text-right transition-colors hover:border-primary"
                  >
                    <span className="min-w-0">
                      <span className="block text-[12px] uppercase tracking-[0.12em] text-muted-foreground">Als Nächstes</span>
                      <span className="block truncate text-[16px] font-bold text-foreground">{nachher.name}</span>
                    </span>
                    <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-primary" aria-hidden />
                  </Link>
                )}
              </nav>
            )}

            <section className="mt-12 flex items-center gap-4 card-surface p-6">
              <img
                src={eliasPortrait}
                alt="Elias El-Gendy"
                className="h-16 w-16 shrink-0 rounded-full object-cover"
                style={{ objectPosition: "82% 22%" }}
                loading="lazy"
              />
              <div>
                <p className="text-[17px] font-bold text-foreground">Elias El-Gendy</p>
                <p className="mt-1 text-[15px] text-muted-foreground">
                  Gründer von finanzmuslim, erklärt islamkonforme Finanzen für Einsteiger.
                </p>
                <p className="mt-1 text-[13px] text-muted-foreground">
                  Veröffentlicht am {datePublished}
                  {dateModified && `, zuletzt aktualisiert am ${dateModified}`}
                </p>
              </div>
            </section>

            <p className="mt-8 text-[13px] leading-relaxed text-muted-foreground">{rechtshinweis}</p>
          </article>
        </div>
      </div>
    </main>
  );
};

export default BeitragSeite;
