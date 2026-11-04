import { isValidElement, useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import EmpfehlungsBox, { type EmpfehlungsBoxProps } from "@/components/EmpfehlungsBox";
import { werbungFuer } from "@/data/werbung";
import { beitragBySlug, beitragPfad, nachbarn } from "@/data/wissenBeitraege";
import eliasPortrait from "@/assets/elias-autor.webp";

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
  const werbung = werbungFuer(slug);
  // Die Mitte-Box fällt nur weg, wenn sie dasselbe Ziel hätte wie der Hauptaufruf.
  const zeigeMitte = (boxMitte.linkZiel ?? boxMitte.kategorie) !== (werbung.linkZiel ?? werbung.kategorie);
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
    <ol>
      {[...abschnitte.map((a) => ({ id: a.id, titel: a.titel })), { id: "faq", titel: "Häufige Fragen" }].map((a) => (
        <li key={a.id}>
          <a
            href={`#${a.id}`}
            className={`block border-l py-[7px] pl-3 text-[15px] leading-snug transition-colors hover:text-primary ${
              aktiv === a.id ? "border-primary text-primary" : "border-transparent text-foreground/70"
            }`}
          >
            {a.titel}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <main className="bg-background">
      <Lesefortschritt />
      <div className="container py-8 md:py-12">
        <div className="relative lg:mx-auto lg:max-w-[900px] xl:max-w-[1160px] xl:pl-[260px]">
          <nav aria-label="Brotkrumen" className="flex flex-wrap items-center gap-2 font-mono text-[12px] uppercase tracking-[0.12em] text-muted-foreground">
            <Link to="/blog" className="text-primary hover:underline">
              Blog
            </Link>
            {eintrag && (
              <>
                <span aria-hidden>/</span>
                <span>{eintrag.thema}</span>
              </>
            )}
          </nav>

          <article className="mt-5">
            {/* Kopf wie /blog/halal-etf (Elias SEO47: „Halte alles wie Halal ETF“): Serifen, ein Satz, Autorzeile, kein Motivbild */}
            <header>
              <h1 className="font-titel text-[32px] leading-[1.1] text-foreground md:text-[42px]">{titel}</h1>
              {untertitel && <p className="mt-4 max-w-[600px] text-[18px] leading-[1.5] text-foreground/75">{untertitel}</p>}
              <div className="mt-6 flex items-start justify-between gap-4 border-b border-border pb-6">
                <div className="flex gap-3">
                  <img src={eliasPortrait} alt="Elias El-Gendy" width={48} height={48} className="h-12 w-12 shrink-0 object-cover" />
                  <div className="leading-snug">
                    <Link
                      to="/ueber-mich"
                      rel="author"
                      className="text-[15px] font-semibold text-foreground underline underline-offset-[3px] hover:text-primary"
                    >
                      Elias El-Gendy
                    </Link>
                    <p className="mt-0.5 font-mono text-[12px] text-muted-foreground">{lesezeit} Min. Lesezeit</p>
                    <p className="mt-2 text-[14px] text-foreground/75">Gründer von finanzmuslim</p>
                  </div>
                </div>
                <div className="text-right font-mono text-[12px] leading-relaxed text-muted-foreground">
                  <p className="uppercase tracking-[0.12em]">{dateModified ? "Aktualisiert" : "Veröffentlicht"}</p>
                  <p>{dateModified ?? datePublished}</p>
                </div>
              </div>
            </header>

            <section className="mt-8 border-l-2 border-primary bg-muted px-5 py-6 md:px-8 md:py-7" aria-labelledby="kurz-gesagt">
              <h2 id="kurz-gesagt" className="font-titel text-[25px] leading-[1.2] text-foreground md:text-[28px]">
                Das Wichtigste
              </h2>
              <ul className="mt-5 space-y-3.5 text-[16px] leading-[1.6] text-foreground/80">
                {kurzGesagt.map((p) => (
                  <li key={p} className="flex gap-3">
                    <span className="mt-[10px] h-1.5 w-1.5 shrink-0 bg-primary" aria-hidden />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </section>

            <div className="mt-6">
              <EmpfehlungsBox {...boxOben} />
            </div>

            <nav aria-label="Auf dieser Seite" className="mt-7 border-y border-border xl:hidden">
              <button
                type="button"
                onClick={() => setOffen((v) => !v)}
                aria-expanded={offen}
                className="flex min-h-[48px] w-full items-center justify-between font-mono text-[12px] uppercase tracking-[0.14em] text-foreground"
              >
                Auf dieser Seite
                <ChevronDown className={`h-4 w-4 transition-transform ${offen ? "rotate-180" : ""}`} aria-hidden />
              </button>
              {offen && <div className="pb-3">{sprungmarken}</div>}
            </nav>

            <div className="relative mt-10 space-y-12">
              {/* Sprungmarken als Leiste links, nur auf breiten Bildschirmen. Bleibt
                  beim Scrollen stehen und hebt den aktuellen Abschnitt hervor. */}
              <aside className="absolute right-full top-0 hidden h-full w-[220px] pr-10 xl:block" aria-label="Sprungmarken">
                <div className="sticky top-28">
                  <p className="border-t border-border pt-4 font-mono text-[12px] uppercase tracking-[0.14em] text-muted-foreground">Auf dieser Seite</p>
                  <div className="mt-3">{sprungmarken}</div>
                </div>
              </aside>
              {abschnitte.map((a, i) => (
                <div key={a.id} className="space-y-12">
                  <section id={a.id} className="scroll-mt-28">
                    <h2 className="font-titel text-[25px] leading-[1.2] text-foreground md:text-[28px]">{a.titel}</h2>
                    <div className="beitrag-text mt-4 max-w-[664px] space-y-4 text-[17px] leading-[1.65] text-foreground/75">
                      {a.inhalt}
                    </div>
                  </section>
                  {i === 0 && abschnitte.length > 1 && <EmpfehlungsBox {...werbung} />}
                  {i === mitteNach && i !== 0 && zeigeMitte && <EmpfehlungsBox {...boxMitte} />}
                </div>
              ))}
            </div>

            <section id="faq" className="mt-14 scroll-mt-28">
              <h2 className="font-titel text-[25px] leading-[1.2] text-foreground md:text-[28px]">Häufige Fragen</h2>
              <Accordion type="single" collapsible className="mt-4">
                {faq.map((f, i) => (
                  <AccordionItem key={f.frage} value={`f${i}`}>
                    <AccordionTrigger className="min-h-[48px] text-left text-[17px] font-semibold hover:no-underline">
                      {f.frage}
                    </AccordionTrigger>
                    <AccordionContent className="text-[16px] leading-relaxed text-foreground/75">
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
                    to={beitragPfad(vorher)}
                    className="group flex min-h-[64px] items-center gap-4 border border-border p-4 transition-colors hover:border-foreground"
                  >
                    <ArrowLeft className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-primary" aria-hidden />
                    <span className="min-w-0">
                      <span className="block font-mono text-[12px] uppercase tracking-[0.12em] text-muted-foreground">Vorher</span>
                      <span className="block truncate text-[16px] font-semibold text-foreground">{vorher.name}</span>
                    </span>
                  </Link>
                ) : (
                  <span />
                )}
                {nachher && (
                  <Link
                    to={beitragPfad(nachher)}
                    className="group flex min-h-[64px] items-center justify-end gap-4 border border-border p-4 text-right transition-colors hover:border-foreground"
                  >
                    <span className="min-w-0">
                      <span className="block font-mono text-[12px] uppercase tracking-[0.12em] text-muted-foreground">Als Nächstes</span>
                      <span className="block truncate text-[16px] font-semibold text-foreground">{nachher.name}</span>
                    </span>
                    <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-primary" aria-hidden />
                  </Link>
                )}
              </nav>
            )}

            <section className="mt-12 flex flex-col gap-4 border border-border p-6 sm:flex-row sm:items-center">
              {/* Eigener quadratischer Ausschnitt (Kopf und Schultern, 480 px): T-Shirt-Foto freigestellt auf
                  Markenblau, in allen Kreisen dasselbe (Elias, 30.10.2026, FOTO1). */}
              <img
                src={eliasPortrait}
                alt="Elias El-Gendy"
                width={80}
                height={80}
                className="h-20 w-20 shrink-0 object-cover"
                loading="lazy"
              />
              <div>
                <p className="font-titel text-[21px] leading-tight text-foreground">Elias El-Gendy</p>
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
