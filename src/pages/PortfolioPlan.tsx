import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import {
  ArrowRight,
  CheckCircle2,
  Bitcoin,
  Building2,
  Coins,
  Landmark,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import Seo from "@/components/Seo";
import NaechsterTeil from "@/components/NaechsterTeil";
import AnbieterLogo from "@/components/AnbieterLogo";
import DepotAufruf, { DEPOT_TITEL } from "@/components/vorlagen/DepotAufruf";
import BetragBalken from "@/components/vorlagen/BetragBalken";
import GiroAufruf from "@/components/vorlagen/GiroAufruf";
import { AnlageLogo } from "@/components/AnlageZeile";
import { anlageBySlug } from "@/data/halalAnlagen";
import {
  GIRO_ACHTEN,
  BETRAEGE,
  PLAN_PFAD,
  PLAN_SCHLUESSEL,
  bausteinById,
  bausteine,
  euro,
  lagen,
  MONATLICH,
  quellen,
  SCHMERZ,
  SPIELRAUM,
  type Baustein,
  type BausteinId,
  type Lage,
  type LageId,
} from "@/data/portfolioPlan";

/**
 * /dein-plan/<schluessel>: der Portfolio-Plan, das Freebie zum Wort „Invest“ (MC3).
 *
 * Aufbau nach dem Bauplan des Gesamtplans (Abschnitt 5): oben die Frage, wie viel im Monat übrig
 * bleibt (der Klick markiert nur und springt nicht, damit niemand die Schritte überspringt; Elias,
 * 28.10.2026, MC3c), mit einem leisen ersten Link; das Girokonto als einziger roter Schmerz; die Bausteine mit
 * je einem Beispiel (Logo, nicht anklickbar); ein Beispiel-Plan als Ring mit Umschalter nach Zeit;
 * zuletzt, wo man das alles kauft: zwei bekannte Depots mit ihrer belegten Schwäche, dann der
 * große Aufruf. Kein Hinweis auf ein anderes Freebie, der Leser
 * bleibt im Thema (Elias, 28.10.2026).
 * Versteckt wie der Guide: noindex, nicht in der Sitemap, aber vorgerendert (routen.ts, nichtIndexiert).
 */
const ICON: Record<BausteinId, LucideIcon> = {
  konto: Landmark,
  sukuk: Landmark,
  gold: Coins,
  etf: TrendingUp,
  aktien: Building2,
  krypto: Bitcoin,
};

const wenigBewegung = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const Punkt = ({ farbe }: { farbe: string }) => (
  <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: farbe }} aria-hidden />
);

const PlanKarte = ({ lage, betrag }: { lage: Lage; betrag: number }) => (
  <article className="card-surface p-5 md:p-6">
    <p className="text-[16px] leading-snug text-foreground/85">{lage.seele}</p>
    <div className="relative mx-auto mt-4 h-[220px] w-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            key={lage.id}
            data={lage.anteile.map((a) => ({ ...a, name: bausteinById(a.baustein).name }))}
            dataKey="prozent"
            nameKey="name"
            innerRadius={70}
            outerRadius={104}
            paddingAngle={2}
            startAngle={90}
            endAngle={-270}
            stroke="none"
            isAnimationActive={!wenigBewegung()}
            animationDuration={700}
          >
            {lage.anteile.map((a) => (
              <Cell key={a.baustein} fill={bausteinById(a.baustein).farbe} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[28px] font-extrabold tabular-nums text-foreground">{betrag}&nbsp;€</span>
        <span className="text-[14px] text-muted-foreground">im Monat</span>
      </div>
    </div>
    <ul className="mt-4 space-y-2.5">
      {lage.anteile.map((a) => {
        const b = bausteinById(a.baustein);
        return (
          <li key={a.baustein} className="flex items-center gap-3 text-[16px]">
            <Punkt farbe={b.farbe} />
            <span className="flex-1 font-semibold text-foreground">{b.name}</span>
            <span className="w-12 text-right text-muted-foreground">{a.prozent}&nbsp;%</span>
            <span className="w-16 text-right font-bold tabular-nums text-foreground">
              {euro(a.prozent, betrag)}&nbsp;€
            </span>
          </li>
        );
      })}
    </ul>
    <p className="mt-4 text-[14px] text-muted-foreground">{lage.verhalten}</p>
    {lage.anteile.some((a) => SPIELRAUM.bausteine.includes(a.baustein)) && (
      <div className="mt-4 rounded-2xl bg-accent p-4">
        <p className="flex items-center gap-2 text-[16px] font-semibold text-foreground">
          {SPIELRAUM.bausteine.map((id) => (
            <Punkt key={id} farbe={bausteinById(id).farbe} />
          ))}
          Einzelaktien und Krypto sind freiwillig
        </p>
        <p className="mt-1 text-[14px] leading-snug text-foreground/80">
          Willst du das Risiko nicht? Dann ergänz einfach mit Gold oder ETF.
        </p>
      </div>
    )}
  </article>
);

const BeispielKasten = ({ b }: { b: Baustein }) => {
  if (!b.beispiel) return null;
  const anlage = b.beispiel.slug ? anlageBySlug(b.beispiel.slug) : undefined;
  return (
    <div className="mt-3 flex min-h-[44px] items-center gap-3 rounded-xl bg-accent px-3 py-2 text-[14px] font-semibold text-foreground">
      {anlage ? (
        <AnlageLogo a={anlage} />
      ) : (
        <span className="flex gap-1">
          {(b.beispiel.domains ?? [b.beispiel.domain]).map((d) => (
            <AnbieterLogo key={d} name={b.beispiel!.titel} domain={d} />
          ))}
        </span>
      )}
      <span className="flex-1">
        <span className="font-normal text-muted-foreground">Beispiel: </span>
        {b.beispiel.titel}
      </span>
    </div>
  );
};

const Schritt = ({ nr, id, titel }: { nr: number; id: string; titel: string }) => (
  <>
    <p className="text-[14px] font-bold text-violet">Schritt {nr}</p>
    <h2 id={id} className="mt-1 text-[24px] font-extrabold text-foreground">
      {titel}
    </h2>
  </>
);

const PortfolioPlan = () => {
  const { schluessel } = useParams();
  const [lageId, setLageId] = useState<LageId>("mittel");
  const [betrag, setBetrag] = useState<number>(MONATLICH);
  const lage = lagen.find((l) => l.id === lageId)!;

  // Sanftes Einblenden beim Scrollen wie auf der Startseite (memory einblenden-beim-scrollen-wie-apple).
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  if (schluessel !== PLAN_SCHLUESSEL) return <Navigate to="/halal-guide" replace />;

  const waehle = (id: LageId) => setLageId(id);

  return (
    <main className="bg-background" data-freebie="portfolio-plan">
      <Seo
        title="Dein Portfolio-Plan als Muslim | finanzmuslim"
        description="Sieh ein Beispiel für 100, 300 oder 500 € im Monat: für in 1 Jahr, in 3 Jahren und in 5 Jahren und mehr."
        path={PLAN_PFAD}
        noindex
      />

      <div className="container max-w-2xl py-8 md:py-12">
        <header className="rounded-3xl bg-hero p-6 md:p-8">
          <h1 className="text-[30px] font-extrabold leading-[1.1] text-foreground md:text-[38px]">
            Dein Portfolio als Muslim in vier Schritten
          </h1>
          <p className="mt-4 text-[16px] font-semibold text-foreground">Wie viel Geld hast du im Monat übrig?</p>
          <div
            className="mt-2 grid grid-cols-3 gap-1.5"
            role="group"
            aria-label="Wie viel Geld hast du im Monat übrig?"
          >
            {BETRAEGE.map((b) => (
              <button
                key={b}
                type="button"
                aria-pressed={b === betrag}
                onClick={() => setBetrag(b)}
                className={`min-h-[48px] rounded-2xl bg-white px-1 text-[16px] font-bold tabular-nums transition-shadow ${
                  b === betrag ? "text-primary ring-2 ring-primary" : "text-foreground ring-1 ring-black/5"
                }`}
              >
                {b}&nbsp;€
              </button>
            ))}
          </div>
          <BetragBalken
            className="mt-5"
            betrag={betrag}
            max={Math.max(...BETRAEGE)}
            teile={lage.anteile.map((a) => ({ farbe: bausteinById(a.baustein).farbe, anteil: a.prozent }))}
            links="In einem Jahr im Halal-Portfolio"
            wert={betrag * 12}
            format={(n) => `${Math.round(n).toLocaleString("de-DE")} €`}
          />
          {/* Kein PDF-Knopf mehr (Elias, 02.11.2026, MC7f: „diese PDF-Option rauslassen. Bei den anderen Freebies“; nur die Duas). */}
        </header>
        <p className="mt-2 px-2 text-[12px] text-muted-foreground">Beispiel, keine Anlageberatung.</p>

        <section className="reveal mt-10" aria-labelledby="schritt-1">
          <Schritt nr={1} id="schritt-1" titel="Erst das Girokonto" />
          <p className="mt-2 text-[16px] leading-snug text-foreground/80">
            Bevor du anlegst, liegt dein Geld auf dem Girokonto.
          </p>
          {/* Mehr Kontext vor dem Aufruf (Elias, 01.11.2026, MC7d15: „nicht dass du die direkt mit einer Werbung übertriffst“).
              Seit MC7d17 (Elias, 02.11.2026, MC7d16: „Etwa jedes achte Konto … musst du ein bisschen größer machen … ohne diesen
              Text“): die drei Stichworte, dann der Satz groß, „Zum Beispiel“, „Als Muslim musst du Zinsen meiden“, die zwei besten. */}
          <p className="mt-4 text-[16px] font-bold text-foreground">Darauf achtest du:</p>
          <ul className="mt-2 grid grid-cols-3 gap-2">
            {GIRO_ACHTEN.map((a) => (
              <li key={a} className="card-surface flex flex-col items-center gap-1.5 p-3 text-center">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-gain" aria-hidden />
                <span className="text-[15px] font-bold leading-tight text-foreground">{a}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <GiroAufruf
              gross={SCHMERZ.girokonto}
              einleitung="Zum Beispiel:"
              zwischen={SCHMERZ.muslim}
              klein
              link={(ziel, stelle) => `${ziel}?src=plg${stelle}`}
            />
          </div>
        </section>

        <section className="reveal mt-12" aria-labelledby="schritt-2">
          <Schritt nr={2} id="schritt-2" titel="Deine fünf Bausteine" />
          <div className="mt-4 grid gap-3">
            {bausteine.map((b) => {
              const Icon = ICON[b.id];
              return (
                <div key={b.id} className="card-surface p-4">
                  <div className="flex gap-3">
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                      style={{ background: `${b.farbe}1A`, color: b.farbe }}
                      aria-hidden
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[16px] font-bold text-foreground">{b.name}</p>
                      <p className="text-[16px] leading-snug text-foreground/80">{b.satz}</p>
                    </div>
                  </div>
                  <BeispielKasten b={b} />
                </div>
              );
            })}
          </div>
        </section>

        <section id="plan" className="reveal mt-12 scroll-mt-20" aria-labelledby="schritt-3">
          <Schritt nr={3} id="schritt-3" titel="Wann brauchst du es?" />
          <p className="mt-2 text-[16px] leading-snug text-foreground/80">
            Hier ein Beispiel, wie dein Portfolio aussehen könnte.
          </p>
          <div
            className="mt-5 grid grid-cols-3 gap-1 rounded-2xl bg-muted p-1"
            role="group"
            aria-label="Wann brauchst du das Geld?"
          >
            {lagen.map((l) => (
              <button
                key={l.id}
                type="button"
                aria-pressed={l.id === lageId}
                onClick={() => waehle(l.id)}
                className={`min-h-[44px] rounded-xl px-1 text-[14px] font-bold transition-colors ${
                  l.id === lageId ? "bg-white text-primary shadow-sm" : "text-foreground/70"
                }`}
              >
                {l.wann}
              </button>
            ))}
          </div>
          <div className="mt-4">
            <PlanKarte lage={lage} betrag={betrag} />
          </div>
          <p className="mt-3 px-1 text-[12px] leading-snug text-muted-foreground">
            Ein Beispiel, keine Empfehlung. Wie es früher lief, ist keine Garantie für später.
          </p>
        </section>

        <section className="reveal mt-12" aria-labelledby="schritt-4">
          <Schritt nr={4} id="schritt-4" titel={DEPOT_TITEL} />
          {/* Check und Top 3 wie Seite 8 des XXL-Guides (Elias, 31.10.2026, MC7d13d: „Trade Republic … Zinsen bei XTB, und
              dann hast du die drei besten da liegen“); vorher nur die beiden bekannten Depots, der Aufruf stand im Kasten. */}
          <div className="mt-3">
            <DepotAufruf ohneVideo link={(ziel, stelle) => `${ziel}?src=pl${stelle}`} />
          </div>
        </section>

        <NaechsterTeil wort="plan" className="mt-12" />

        <footer className="mt-12 space-y-2 border-t border-border pt-6 text-[12px] leading-relaxed text-muted-foreground">
          <p>Alle Zahlen stammen aus meinen Vergleichen.</p>
          <p>
            Die Pläne sind Beispiele, keine persönliche Empfehlung. Persönliche Anlageberatung braucht in Deutschland
            eine Zulassung.
          </p>
          <p>Prüfungen der Beispiele:</p>
          <ul className="space-y-1">
            {quellen.map((q) => (
              <li key={q.url}>
                <a
                  href={q.url}
                  className="underline underline-offset-2 hover:text-primary"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {q.titel}
                </a>
              </li>
            ))}
          </ul>
        </footer>
      </div>
    </main>
  );
};

export default PortfolioPlan;
