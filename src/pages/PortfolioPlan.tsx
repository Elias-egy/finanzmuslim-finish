import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { AlertTriangle, ArrowRight, Bitcoin, Building2, Coins, Landmark, TrendingUp, type LucideIcon } from "lucide-react";
import Seo from "@/components/Seo";
import FindeDeinAngebot from "@/components/FindeDeinAngebot";
import AnbieterLogo from "@/components/AnbieterLogo";
import { AnlageLogo } from "@/components/AnlageZeile";
import { anlageBySlug } from "@/data/halalAnlagen";
import {
  BEKANNTE,
  PLAN_PFAD,
  PLAN_SCHLUESSEL,
  bausteinById,
  bausteine,
  euro,
  lagen,
  MONATLICH,
  planLink,
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
 * Aufbau nach dem Bauplan des Gesamtplans (Abschnitt 5): oben die Frage, wann das Geld gebraucht
 * wird, mit einem leisen ersten Link; das Girokonto als einziger roter Schmerz; die Bausteine mit
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

const PlanKarte = ({ lage }: { lage: Lage }) => (
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
        <span className="text-[28px] font-extrabold tabular-nums text-foreground">{MONATLICH}&nbsp;€</span>
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
            <span className="w-16 text-right font-bold tabular-nums text-foreground">{euro(a.prozent)}&nbsp;€</span>
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
      {anlage ? <AnlageLogo a={anlage} /> : <AnbieterLogo name={b.beispiel.titel} domain={b.beispiel.domain} />}
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

  const waehle = (id: LageId, springen: boolean) => {
    setLageId(id);
    if (springen) document.getElementById("plan")?.scrollIntoView({ behavior: wenigBewegung() ? "auto" : "smooth" });
  };

  return (
    <main className="bg-background" data-freebie="portfolio-plan">
      <Seo
        title="Dein Portfolio-Plan als Muslim | finanzmuslim"
        description="Sieh ein Beispiel für 500 € im Monat: für in 1 Jahr, in 3 Jahren und in 5 Jahren und mehr."
        path={PLAN_PFAD}
        noindex
      />

      <div className="container max-w-2xl py-8 md:py-12">
        <header className="rounded-3xl bg-hero p-6 md:p-8">
          <h1 className="text-[30px] font-extrabold leading-[1.1] text-foreground md:text-[38px]">
            Dein Portfolio als Muslim in vier Schritten
          </h1>
          <p className="mt-4 text-[16px] font-semibold text-foreground">Wann brauchst du das Geld?</p>
          <div className="mt-2 grid grid-cols-3 gap-1.5">
            {lagen.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => waehle(l.id, true)}
                className="flex min-h-[44px] flex-col items-center justify-center gap-1 rounded-2xl bg-white px-1 py-2 text-[14px] font-semibold text-foreground ring-1 ring-black/5"
              >
                <span className="flex h-2.5 w-7 overflow-hidden rounded-full" aria-hidden>
                  {l.anteile.map((a) => (
                    <span key={a.baustein} style={{ width: `${a.prozent}%`, background: bausteinById(a.baustein).farbe }} />
                  ))}
                </span>
                {l.wann}
              </button>
            ))}
          </div>
          <p className="mt-5 text-[14px] leading-snug text-foreground/75">
            Schon mal vorab: Ich habe gerankt, welche Anbieter zinsfrei sind.{" "}
            <Link to={planLink("/vergleich/start", "oben")} className="font-semibold text-primary underline-offset-2 hover:underline">
              Zum Vergleich
            </Link>
          </p>
        </header>
        <p className="mt-2 px-2 text-[12px] text-muted-foreground">Beispiel, keine Anlageberatung.</p>

        <section className="reveal mt-10" aria-labelledby="schritt-1">
          <Schritt nr={1} id="schritt-1" titel="Erst das Girokonto" />
          <p className="mt-2 text-[16px] leading-snug text-foreground/80">Bevor du anlegst, liegt dein Geld auf dem Girokonto.</p>
          <div className="mt-4 flex gap-3 rounded-2xl bg-loss-soft p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-loss" aria-hidden />
            <div>
              <p className="text-[16px] leading-snug text-foreground">{SCHMERZ.girokonto}</p>
              <Link
                to={planLink("/vergleich/girokonto", "giro")}
                className="mt-2 inline-flex min-h-[44px] items-center gap-1 text-[16px] font-semibold text-primary hover:underline"
              >
                Girokonten ohne Zinsen ansehen
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
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
          <div className="mt-5 grid grid-cols-3 gap-1 rounded-2xl bg-muted p-1" role="group" aria-label="Wann brauchst du das Geld?">
            {lagen.map((l) => (
              <button
                key={l.id}
                type="button"
                aria-pressed={l.id === lageId}
                onClick={() => waehle(l.id, false)}
                className={`min-h-[44px] rounded-xl px-1 text-[14px] font-bold transition-colors ${
                  l.id === lageId ? "bg-white text-primary shadow-sm" : "text-foreground/70"
                }`}
              >
                {l.wann}
              </button>
            ))}
          </div>
          <div className="mt-4">
            <PlanKarte lage={lage} />
          </div>
          <p className="mt-3 px-1 text-[16px] leading-snug text-foreground/80">
            Weißt du nicht, wie lange?{" "}
            <button type="button" onClick={() => waehle("mittel", false)} className="font-semibold text-primary hover:underline">
              Nimm 3 Jahre.
            </button>
          </p>
          <p className="mt-2 px-1 text-[12px] leading-snug text-muted-foreground">
            Weniger als 500&nbsp;€? Nimm dieselben Prozente. Ein Beispiel, keine Empfehlung. Wie es früher lief, ist keine Garantie für später.
          </p>
        </section>

        <section className="reveal mt-12" aria-labelledby="schritt-4">
          <Schritt nr={4} id="schritt-4" titel="Wo du es jetzt kaufst" />
          <p className="mt-2 text-[16px] leading-snug text-foreground/80">
            Im Depot trägst du je Baustein den Euro-Betrag ein. Danach läuft es jeden Monat von selbst.
          </p>
          <p className="mt-4 text-[20px] font-extrabold leading-tight text-foreground">
            Die bekanntesten Depots sind nicht die besten für Muslime.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {BEKANNTE.map((d) => (
              <div key={d.name} className="card-surface p-4">
                <div className="flex items-center gap-2">
                  <AnbieterLogo name={d.name} domain={d.domain} />
                  <p className="min-w-0 text-[14px] font-bold leading-tight text-foreground">{d.name}</p>
                </div>
                <p className="mt-3 text-[28px] font-extrabold leading-none tabular-nums text-foreground">{d.gross}</p>
                <p className="mt-1 text-[14px] leading-snug text-muted-foreground">{d.klein}</p>
              </div>
            ))}
          </div>
          <FindeDeinAngebot
            className="mt-4"
            titel="Du willst die besten finden?"
            text="Ich habe die Depots gerankt: welche zinsfrei sind und welche deine Islamic ETFs haben. Beantworte ein paar Fragen und sieh, welches zu dir passt."
            knopf="Die besten finden"
            ziel={planLink("/vergleich/start", "mitte")}
          />
          <p className="mt-4 px-1 text-[16px] leading-snug text-foreground/80">
            Schon ein Depot?{" "}
            <Link to={planLink("/vergleich/depot", "ende")} className="font-semibold text-primary hover:underline">
              Prüf, ob deins Zinsen zahlt
            </Link>
          </p>
        </section>

        <footer className="mt-12 space-y-2 border-t border-border pt-6 text-[12px] leading-relaxed text-muted-foreground">
          <p>
            Die Pläne sind Beispiele, keine persönliche Empfehlung. Persönliche Anlageberatung braucht in Deutschland eine
            Zulassung.
          </p>
          <p>Prüfungen der Beispiele:</p>
          <ul className="space-y-1">
            {quellen.map((q) => (
              <li key={q.url}>
                <a href={q.url} className="underline underline-offset-2 hover:text-primary" rel="noopener noreferrer" target="_blank">
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
