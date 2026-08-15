import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import EmpfehlungsBox, { type EmpfehlungsBoxProps } from "@/components/EmpfehlungsBox";
import eliasPortrait from "@/assets/elias-hemd.png.asset.json";

export type BeitragAbschnitt = { id: string; titel: string; inhalt: ReactNode };
export type BeitragFrage = { frage: string; antwort: string };

type Props = {
  titel: string;
  kurzGesagt: string[];
  abschnitte: BeitragAbschnitt[];
  faq: BeitragFrage[];
  /** Zum Beispiel "15. August 2026". */
  geprueftAm: string;
  rechtshinweis: string;
  boxOben: EmpfehlungsBoxProps;
  boxMitte: EmpfehlungsBoxProps;
  /** Optionaler Abschlussverweis unter dem Beitrag. */
  children?: ReactNode;
};

/** Feste Reihenfolge fuer alle Wissensbeitraege. */
const BeitragSeite = ({
  titel,
  kurzGesagt,
  abschnitte,
  faq,
  geprueftAm,
  rechtshinweis,
  boxOben,
  boxMitte,
  children,
}: Props) => {
  const [offen, setOffen] = useState(false);
  const mitteNach = Math.ceil(abschnitte.length / 2);

  return (
    <main className="bg-background">
      <div className="container py-10 md:py-14">
        <nav aria-label="Brotkrumen" className="flex flex-wrap items-center gap-1 text-[13px] text-muted-foreground">
          <Link to="/" className="hover:text-primary">
            Start
          </Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          <Link to="/wissen" className="hover:text-primary">
            Wissen
          </Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          <span className="text-foreground">{titel}</span>
        </nav>

        <article className="mt-6 max-w-3xl">
          <h1 className="text-3xl font-bold leading-tight text-foreground md:text-4xl">{titel}</h1>

          <section className="mt-6 rounded-2xl bg-hero p-6 md:p-8">
            <h2 className="text-[17px] font-bold text-foreground">Kurz gesagt</h2>
            <ul className="mt-3 space-y-2">
              {kurzGesagt.map((p) => (
                <li key={p} className="flex gap-3 text-[16px] leading-relaxed text-foreground/90">
                  <span className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/40" aria-hidden />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="mt-6">
            <EmpfehlungsBox {...boxOben} />
          </div>

          <nav aria-label="Inhaltsübersicht" className="mt-8 card-surface p-5">
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
            <ol className={`mt-3 space-y-2 ${offen ? "block" : "hidden"} md:block`}>
              {abschnitte.map((a) => (
                <li key={a.id}>
                  <a href={`#${a.id}`} className="text-[16px] text-primary hover:underline">
                    {a.titel}
                  </a>
                </li>
              ))}
              <li>
                <a href="#faq" className="text-[16px] text-primary hover:underline">
                  Häufig gestellte Fragen
                </a>
              </li>
            </ol>
          </nav>

          <div className="mt-10 space-y-10">
            {abschnitte.map((a, i) => (
              <div key={a.id} className="space-y-10">
                <section id={a.id} className="scroll-mt-28">
                  <h2 className="text-2xl font-bold leading-snug text-foreground md:text-[28px]">{a.titel}</h2>
                  <div className="mt-3 space-y-4 text-[17px] leading-relaxed text-foreground/90">{a.inhalt}</div>
                </section>
                {i + 1 === mitteNach && i + 1 < abschnitte.length && <EmpfehlungsBox {...boxMitte} />}
              </div>
            ))}
          </div>

          <section id="faq" className="mt-12 scroll-mt-28">
            <h2 className="text-2xl font-bold text-foreground md:text-[28px]">Häufig gestellte Fragen</h2>
            <Accordion type="single" collapsible className="mt-4">
              {faq.map((f, i) => (
                <AccordionItem key={f.frage} value={`f${i}`}>
                  <AccordionTrigger className="text-left text-[17px] font-semibold">{f.frage}</AccordionTrigger>
                  <AccordionContent className="text-[16px] leading-relaxed text-muted-foreground">
                    {f.antwort}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {children && <div className="mt-12">{children}</div>}

          <section className="mt-12 flex items-center gap-4 card-surface p-6">
            <img
              src={eliasPortrait.url}
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
              <p className="mt-1 text-[13px] text-muted-foreground">Zuletzt geprüft am {geprueftAm}</p>
            </div>
          </section>

          <p className="mt-8 text-[13px] leading-relaxed text-muted-foreground">{rechtshinweis}</p>
        </article>
      </div>
    </main>
  );
};

export default BeitragSeite;
