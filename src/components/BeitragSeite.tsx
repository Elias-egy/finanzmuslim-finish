import { LINKEDIN } from "@/components/blog/bausteine";
import { isValidElement, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import EmpfehlungsBox, { type EmpfehlungsBoxProps } from "@/components/EmpfehlungsBox";
import { vergleichFuer, werbungFuer } from "@/data/werbung";
import { beitragBySlug, beitragPfad, fuehrenZurDatenbank, nachbarn, verwandteBeitraege } from "@/data/wissenBeitraege";
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
  /** Seit SEO85 nicht mehr gezeigt (kein oberer Aufruf im Blog), bleibt als Feld, damit die Beiträge unverändert bauen. */
  boxOben?: EmpfehlungsBoxProps;
  boxMitte: EmpfehlungsBoxProps;
  /** Nach welchem Abschnitt (Index, 0-basiert) die mittlere Box steht.
   *  Ohne Angabe nach der Hälfte der Abschnitte. */
  boxMitteNach?: number;
  /** Optionaler Abschlussverweis unter dem Beitrag. */
  children?: ReactNode;
  /** Einleitung mit dem Hauptwort, gleich unter der Autorzeile (A6: höchstens 95 Wörter). Ohne Angabe nichts. */
  einleitung?: ReactNode;
  /** Eigener Anbieter-Kasten statt der EmpfehlungsBox an der ersten Werbestelle (SEO91). */
  werbungKasten?: ReactNode;
  /** Nach welchem Abschnitt (Index, 0-basiert) die erste Werbung steht. Von Hand gesetzt gewinnt; sonst das erste Abschnittsende unter den
   *  ersten vier, das ein Viertel der Wörter der Seite erreicht (S2, SEO86). */
  werbungNach?: number;
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

/**
 * Lesefortschritt: dünne Linie am unteren Rand der Kopfleiste, die mit dem Scrollen wächst. Die Linie selbst steht im CSS
 * (`.beitragskopf-innen::after`, index.css) und folgt so dem Rahmen der schwebenden Leiste; hier wird nur der Anteil gesetzt
 * (S5, SEO86 reviewer: a fixed bar at top:60px hung beside the floating bar once it shrank).
 */
const Lesefortschritt = () => {
  useEffect(() => {
    const wurzel = document.documentElement;
    const messen = () => {
      const gesamt = wurzel.scrollHeight - wurzel.clientHeight;
      const anteil = gesamt > 0 ? Math.min(1, wurzel.scrollTop / gesamt) : 0;
      wurzel.style.setProperty("--lese-anteil", String(anteil));
    };
    messen();
    window.addEventListener("scroll", messen, { passive: true });
    window.addEventListener("resize", messen);
    return () => {
      window.removeEventListener("scroll", messen);
      window.removeEventListener("resize", messen);
      wurzel.style.removeProperty("--lese-anteil");
    };
  }, []);
  return null;
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
  boxMitte,
  boxMitteNach,
  children,
  einleitung,
  werbungKasten,
  werbungNach,
}: Props) => {
  const [offen, setOffen] = useState(false);
  const werbung = werbungFuer(slug);
  // Die Mitte-Box fällt nur weg, wenn sie dasselbe Ziel hätte wie der Hauptaufruf.
  const zeigeMitte = (boxMitte.linkZiel ?? boxMitte.kategorie) !== (werbung.linkZiel ?? werbung.kategorie);
  const eintrag = beitragBySlug(slug);
  const { vorher, nachher } = nachbarn(slug);
  const vergleich = vergleichFuer(slug);
  const verwandt = (verwandteBeitraege[slug] ?? []).map((s) => beitragBySlug(s)).filter((b) => !!b && !b.bald);
  const zurDatenbank = fuehrenZurDatenbank.has(slug);

  /* Automatisch aus dem tatsächlichen Text geschätzt, nicht von Hand gepflegt
     — sonst veraltet die Angabe beim nächsten Textwechsel unbemerkt. */
  const lesezeit = useMemo(() => {
    const text = [kurzGesagt.join(" "), ...abschnitte.map((a) => textVon(a.inhalt))].join(" ");
    const woerter = text.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(woerter / WOERTER_PRO_MINUTE));
  }, [kurzGesagt, abschnitte]);

  const ids = useMemo(() => [...abschnitte.map((a) => a.id), "faq"], [abschnitte]);
  const aktiv = useAktiverAbschnitt(ids);
  /* Erste Werbestelle nach Wortanteil statt fester Zahl (S2, SEO86): Von Hand gesetzt gewinnt. Sonst zählt die Seite nach dem Einhängen die Wörter
     im Browser (Kopf, „Das Wichtigste“ und Einleitung als Vorlauf, dazu die Abschnitte und die Überschriften der Fragen) und setzt die Werbung an das
     erste Abschnittsende unter den ersten vier, das etwa ein Viertel der Seite erreicht, nie davor. Der Text vieler Abschnitte kommt
     aus Bausteinen, nicht aus `children` (Tabellen, Rechenbeispiele): Aus dem React-Baum gezählt, wäre er zu kurz. Bis zur Messung (und im vorgerenderten
     HTML) gilt die Faustregel: bei sechs und mehr Abschnitten nach dem zweiten, sonst nach dem ersten. */
  const artikelRef = useRef<HTMLElement>(null);
  const [gemessen, setGemessen] = useState<number | null>(null);
  useEffect(() => {
    if (werbungNach !== undefined) return;
    const artikel = artikelRef.current;
    const abschnittEl = abschnitte.map((a) => document.getElementById(a.id));
    const erster = abschnittEl[0]?.parentElement?.parentElement;
    if (!artikel || !erster || abschnittEl.some((el) => !el)) return;
    const zaehle = (t: string | null | undefined) => (t ?? "").trim().split(/\s+/).filter(Boolean).length;
    const vorlauf = document.createRange();
    vorlauf.setStart(artikel, 0);
    vorlauf.setEndBefore(erster);
    const woerter = abschnittEl.map((el) => zaehle(el?.textContent));
    const start = zaehle(vorlauf.toString());
    const gesamt = start + woerter.reduce((summe, w) => summe + w, 0) + zaehle(document.getElementById("faq")?.textContent);
    // Der erste Abschnittsschluss, der etwa ein Viertel der Seite erreicht (Elias SEO55: „erst bei etwa einem Drittel“, Regel „ein Viertel bis ein Drittel“);
    // erreicht keiner der ersten vier ein Viertel, der vierte.
    const kandidaten = Math.max(1, Math.min(4, abschnitte.length - 1));
    let summe = start;
    let beste = kandidaten - 1;
    for (let i = 0; i < kandidaten; i++) {
      summe += woerter[i];
      if (summe / gesamt >= 0.24) {
        beste = i;
        break;
      }
    }
    setGemessen(beste);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `abschnitte` is rebuilt on every render of the post page; the section count identifies the content
  }, [slug, abschnitte.length, werbungNach]);
  // Eine von Hand gesetzte mittlere Box geht vor: Die automatische erste Werbung rückt nach vorn, damit mindestens ein Abschnitt dazwischen bleibt.
  const werbungAuto = gemessen ?? (abschnitte.length >= 6 ? 1 : 0);
  const werbungIdx = werbungNach ?? Math.max(0, boxMitteNach === undefined ? werbungAuto : Math.min(werbungAuto, boxMitteNach - 2));
  // Die mittlere Box (Standard) rückt weiter, wenn sie sonst auf oder gleich nach der ersten Werbung stünde: mindestens ein Abschnitt dazwischen
  // (S2, SEO86), sonst stünden zwei Kästen untereinander. Von Hand gesetztes `boxMitteNach` bleibt, wie es ist.
  const mitteStandard = Math.max(1, Math.floor(abschnitte.length / 2) - 1);
  const letzter = abschnitte.length - 1;
  const mitteAbstand = [werbungIdx + 2, werbungIdx + 1].find((i) => i >= mitteStandard && i <= letzter) ?? mitteStandard;
  const mitteNach = boxMitteNach ?? (mitteStandard - werbungIdx >= 2 ? mitteStandard : mitteAbstand);

  const sprungmarken = (
    <ol>
      {[...abschnitte.map((a) => ({ id: a.id, titel: a.titel })), { id: "faq", titel: "Häufige Fragen" }].map((a) => (
        <li key={a.id}>
          <a
            href={`#${a.id}`}
            className={`block border-l-2 py-[7px] pl-3 text-[15px] leading-snug transition-colors hover:text-primary ${
              aktiv === a.id ? "border-primary font-semibold text-primary" : "border-border text-foreground/70"
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
        <div className="relative lg:mx-auto lg:max-w-[976px] lg:pl-[190px] xl:max-w-[1160px] xl:pl-[260px]">
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

          <article ref={artikelRef} className="mt-5">
            {/* Kopf wie /blog/halal-etf (Elias SEO47: „Halte alles wie Halal ETF“): Serifen, ein Satz, Autorzeile, kein Motivbild */}
            <header>
              <h1 className="font-titel text-[32px] leading-[1.1] text-foreground md:text-[42px]">{titel}</h1>
              {untertitel && <p className="mt-4 max-w-[600px] text-[18px] leading-[1.5] text-foreground/75">{untertitel}</p>}
              {/* Money Page gleich oben (RN19): ein Textlink, kein Anbieter-Kasten; der erste Kasten bleibt bei einem Drittel. */}
              <p className="mt-3 text-[16px] font-semibold">
                <Link to={vergleich.pfad} className="text-primary underline-offset-[3px] hover:underline">
                  {vergleich.text} ›
                </Link>
              </p>
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
                    <p className="mt-2 text-[14px] text-foreground/75">
                      Gründer von finanzmuslim ·{" "}
                      <a href={LINKEDIN} target="_blank" rel="noopener noreferrer me" className="underline underline-offset-[3px] hover:text-primary">
                        LinkedIn
                      </a>
                    </p>
                  </div>
                </div>
                <div className="text-right font-mono text-[12px] leading-relaxed text-muted-foreground">
                  {/* SEO86 reviewer (Checkliste A5): published date always visible, updated date below when set */}
                  <p className="uppercase tracking-[0.12em]">Veröffentlicht</p>
                  <p>{datePublished}</p>
                  {dateModified && dateModified !== datePublished && (
                    <>
                      <p className="mt-1 uppercase tracking-[0.12em]">Aktualisiert</p>
                      <p>{dateModified}</p>
                    </>
                  )}
                </div>
              </div>
            </header>

            {einleitung && (
              <div className="beitrag-text mt-8 max-w-[664px] space-y-4 text-[17px] leading-[1.65] text-foreground/75">{einleitung}</div>
            )}

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

            {/* SEO85 (Elias SEO84-03: „dann nochmal oben den Call to Action, der kann weg. Der kommt weg in den Blogs“): kein Kasten
                direkt unter „Das Wichtigste“; der Kopfknopf „Match finden“ und der erste Kasten nach dem ersten Abschnitt bleiben. */}

            <nav aria-label="Auf dieser Seite" className="mt-7 border-y border-border lg:hidden">
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
              {/* Sprungmarken als Leiste links, ab 1024 px (S4, SEO86; darunter das Aufklapp-Menü). Bleibt
                  beim Scrollen stehen und hebt den aktuellen Abschnitt hervor. */}
              <aside className="absolute right-full top-0 hidden h-full w-[170px] pr-6 lg:block xl:w-[220px] xl:pr-10" aria-label="Sprungmarken">
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
                  {i === werbungIdx && abschnitte.length > 1 && (werbungKasten ?? <EmpfehlungsBox {...werbung} />)}
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

            {(verwandt.length > 0 || zurDatenbank) && (
              <aside aria-labelledby="verwandt" className="mt-12">
                <p id="verwandt" className="font-titel text-[22px] text-foreground">
                  Verwandte Beiträge
                </p>
                <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                  {verwandt.map((b) => (
                    <li key={b!.slug}>
                      <Link to={beitragPfad(b!)} className="block h-full border border-border p-4 transition-colors hover:border-primary">
                        <span className="block text-[16px] font-semibold text-foreground">{b!.name}</span>
                        <span className="mt-1 block text-[14px] text-muted-foreground">{b!.desc}</span>
                      </Link>
                    </li>
                  ))}
                  {zurDatenbank && (
                    <li>
                      <Link to="/halal-anlagen" className="block h-full border border-border p-4 transition-colors hover:border-primary">
                        <span className="block text-[16px] font-semibold text-foreground">Halal-Anlagen-Datenbank</span>
                        <span className="mt-1 block text-[14px] text-muted-foreground">
                          Jede Anlage mit ISIN, Kosten und dem Nachweis der Prüfstelle.
                        </span>
                      </Link>
                    </li>
                  )}
                </ul>
              </aside>
            )}

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
