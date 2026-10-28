import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { AlertTriangle, ArrowRight, Bitcoin, Building2, Coins, Landmark, TrendingUp, type LucideIcon } from "lucide-react";
import Seo from "@/components/Seo";
import FindeDeinAngebot from "@/components/FindeDeinAngebot";
import {
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
  type BausteinId,
  type Lage,
  type LageId,
} from "@/data/portfolioPlan";

/**
 * /dein-plan/<schluessel>: der Halal-Portfolio-Plan, das Freebie zum Wort „Invest“ (MC3).
 *
 * Aufbau nach dem Bauplan des Gesamtplans (Abschnitt 5): oben das Versprechen mit einem leisen
 * ersten Link, dann das Girokonto als erster Schmerz, die Bausteine, die drei Pläne, direkt
 * darunter der große Aufruf, dann drei Schritte und die Belohnung über das nächste Wort.
 * Die Pläne gehen nach Zeit (Elias, 28.10.2026): ein Umschalter mit Ring statt drei Karten,
 * damit das Ansehen Spaß macht.
 * Versteckt wie der Guide: noindex, nicht in routen.ts, also nicht in Sitemap und Vorrendern.
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
        <span className="text-[30px] font-extrabold tabular-nums text-foreground">{MONATLICH}&nbsp;€</span>
        <span className="text-[13px] font-semibold text-muted-foreground">im Monat</span>
      </div>
    </div>
    <ul className="mt-4 space-y-2.5">
      {lage.anteile.map((a) => {
        const b = bausteinById(a.baustein);
        return (
          <li key={a.baustein} className="flex items-center gap-3 text-[16px]">
            <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: b.farbe }} aria-hidden />
            <span className="flex-1 font-semibold text-foreground">{b.name}</span>
            <span className="w-12 text-right text-muted-foreground">{a.prozent}&nbsp;%</span>
            <span className="w-16 text-right font-bold tabular-nums text-foreground">{euro(a.prozent)}&nbsp;€</span>
          </li>
        );
      })}
    </ul>
    <p className="mt-4 text-[14px] font-medium text-foreground/70">{lage.verhalten}</p>
  </article>
);

const MiniLeiste = ({ lage }: { lage: Lage }) => (
  <span className="flex h-2.5 w-7 overflow-hidden rounded-full" aria-hidden>
    {lage.anteile.map((a) => (
      <span key={a.baustein} style={{ width: `${a.prozent}%`, background: bausteinById(a.baustein).farbe }} />
    ))}
  </span>
);

const Hinweis = ({ text, link, linkText }: { text: string; link?: string; linkText?: string }) => (
  <div className="flex gap-3 rounded-2xl bg-loss-soft p-4">
    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-loss" aria-hidden />
    <div>
      <p className="text-[15px] leading-snug text-foreground">{text}</p>
      {link && (
        <Link to={link} className="mt-2 inline-flex min-h-[44px] items-center gap-1 text-[15px] font-semibold text-primary hover:underline">
          {linkText}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      )}
    </div>
  </div>
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
        title="Dein Halal-Portfolio-Plan | finanzmuslim"
        description="Sieh drei Beispiel-Pläne für 500 € im Monat: für in 1 Jahr, in 3 Jahren und in 5 Jahren und mehr."
        path={PLAN_PFAD}
        noindex
      />

      <div className="container max-w-2xl py-8 md:py-12">
        <header className="rounded-3xl bg-hero p-6 md:p-8">
          <h1 className="text-[30px] font-extrabold leading-[1.1] text-foreground md:text-[38px]">
            Dein Halal-Portfolio in vier Schritten
          </h1>
          <p className="mt-3 text-[17px] leading-snug text-foreground/85">
            Ali ist 25 und hat jeden Monat {MONATLICH}&nbsp;€ übrig. So könnte er sie verteilen, je nachdem, wann er das Geld braucht.
          </p>
          <p className="mt-5 text-[14px] font-semibold text-foreground">Wann brauchst du das Geld?</p>
          <div className="mt-2 grid grid-cols-3 gap-1.5">
            {lagen.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => waehle(l.id, true)}
                className="flex min-h-[44px] flex-col items-center justify-center gap-1 rounded-2xl bg-white px-1 py-2 text-[14px] font-semibold text-foreground ring-1 ring-black/5"
              >
                <MiniLeiste lage={l} />
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
          <p className="text-[13px] font-bold text-violet">Schritt 1</p>
          <h2 id="schritt-1" className="mt-1 text-[24px] font-extrabold text-foreground">
            Erst das Girokonto
          </h2>
          <p className="mt-2 text-[16px] leading-snug text-foreground/80">
            Bevor Ali anlegt, liegt sein Geld auf dem Girokonto oder dem Sparbuch.
          </p>
          <div className="mt-4">
            <Hinweis
              text={SCHMERZ.girokonto}
              link={planLink("/vergleich/girokonto", "giro")}
              linkText="Girokonten ohne Zinsen ansehen"
            />
          </div>
        </section>

        <section className="reveal mt-12" aria-labelledby="schritt-2">
          <p className="text-[13px] font-bold text-violet">Schritt 2</p>
          <h2 id="schritt-2" className="mt-1 text-[24px] font-extrabold text-foreground">
            Deine fünf Bausteine
          </h2>
          <div className="mt-4 grid gap-3">
            {bausteine.map((b) => {
              const Icon = ICON[b.id];
              return (
                <div key={b.id} className="card-surface flex gap-4 p-4">
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                    style={{ background: `${b.farbe}1A`, color: b.farbe }}
                    aria-hidden
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[17px] font-bold text-foreground">
                      {b.name} <span className="font-semibold" style={{ color: b.farbe }}>· {b.rolle}</span>
                    </p>
                    <p className="mt-0.5 text-[15px] leading-snug text-foreground/80">{b.satz}</p>
                    <p className="mt-1.5 text-[13px] leading-snug text-muted-foreground">{b.pruefung}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section id="plan" className="reveal mt-12 scroll-mt-20" aria-labelledby="schritt-3">
          <p className="text-[13px] font-bold text-violet">Schritt 3</p>
          <h2 id="schritt-3" className="mt-1 text-[24px] font-extrabold text-foreground">
            Wann brauchst du es?
          </h2>
          <p className="mt-2 text-[16px] leading-snug text-foreground/80">
            Je länger das Geld liegen bleibt, desto mehr Islamic ETF. Brauchst du es bald, mehr Girokonto und Sukuk.
          </p>
          <div className="mt-5 grid grid-cols-3 gap-1 rounded-2xl bg-muted p-1" role="group" aria-label="Wann brauchst du das Geld?">
            {lagen.map((l) => (
              <button
                key={l.id}
                type="button"
                aria-pressed={l.id === lageId}
                onClick={() => waehle(l.id, false)}
                className={`min-h-[44px] rounded-xl px-1 text-[15px] font-bold transition-colors ${
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
          <p className="mt-3 px-1 text-[14px] leading-snug text-foreground/80">
            Weißt du nicht, wie lange?{" "}
            <button type="button" onClick={() => waehle("mittel", false)} className="font-semibold text-primary hover:underline">
              Nimm 3 Jahre.
            </button>
          </p>
          <p className="mt-2 px-1 text-[12px] leading-snug text-muted-foreground">
            Weniger als 500&nbsp;€? Nimm dieselben Prozente. Beispiele für eine Beispielperson, wie es früher lief, ist keine Garantie für später.
          </p>
        </section>

        <section className="reveal mt-12" aria-labelledby="schritt-4">
          <p className="text-[13px] font-bold text-violet">Schritt 4</p>
          <h2 id="schritt-4" className="mt-1 text-[24px] font-extrabold text-foreground">
            Dein Depot
          </h2>
          <p className="mt-2 text-[16px] leading-snug text-foreground/80">
            Trag im Sparplan je Baustein den Euro-Betrag deines Plans ein. Danach läuft es jeden Monat von selbst.
          </p>
          <div className="mt-4">
            <Hinweis text={SCHMERZ.depot} />
          </div>
          <FindeDeinAngebot
            className="mt-4"
            titel="Lesen ist nicht umsetzen"
            text="Damit Muslime es einfach haben, habe ich gerankt, welche Anbieter zinsfrei sind. Beantworte ein paar Fragen und sieh, welches Depot zu dir passt."
            knopf="Passendes Depot finden"
            ziel={planLink("/vergleich/start", "mitte")}
          />
          <p className="mt-4 px-1 text-[15px] leading-snug text-foreground/80">
            Schon ein Depot?{" "}
            <Link to={planLink("/vergleich/depot", "ende")} className="font-semibold text-primary hover:underline">
              Prüf, ob deins Zinsen zahlt
            </Link>
          </p>
        </section>

        <section className="reveal mt-12 rounded-3xl bg-hero p-6" aria-labelledby="naechster-teil">
          <h2 id="naechster-teil" className="text-[20px] font-extrabold text-foreground">
            Als Nächstes: der Gold-Check
          </h2>
          <p className="mt-2 text-[16px] leading-snug text-foreground/85">
            Depot steht? Kommentiere „Gold“ unter einem meiner Reels. Ich schicke dir jeden Weg, Gold zu kaufen, mit Grund und Beispiel.
          </p>
          <a
            href="https://www.instagram.com/finanz.muslim"
            className="mt-4 inline-flex min-h-[44px] items-center gap-1 text-[15px] font-semibold text-primary hover:underline"
          >
            Zu meinen Reels
            <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        </section>

        <footer className="mt-12 space-y-2 border-t border-border pt-6 text-[12px] leading-relaxed text-muted-foreground">
          <p>
            Die Pläne sind Beispiele für eine Beispielperson, keine persönliche Empfehlung. Persönliche Anlageberatung braucht in
            Deutschland eine Zulassung.
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
