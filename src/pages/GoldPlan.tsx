import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { AlertTriangle, ArrowRight, Coins, Landmark, TrendingUp, type LucideIcon } from "lucide-react";
import Seo from "@/components/Seo";
import FindeDeinAngebot from "@/components/FindeDeinAngebot";
import AnbieterLogo from "@/components/AnbieterLogo";
import { AnlageLogo } from "@/components/AnlageZeile";
import { anlageBySlug } from "@/data/halalAnlagen";
import { edelmetallVergleich } from "@/data/edelmetallVergleich";
import {
  BEKANNTE_GOLD,
  CFD_ANBIETER,
  CFD_ZEILE,
  GOLD_BETRAEGE,
  GOLD_DEPOT_LOGOS,
  GOLD_MONATLICH,
  GOLD_PFAD,
  GOLD_SCHLUESSEL,
  PREIS_STAND,
  SCHMERZ,
  goldLink,
  goldQuellen,
  gramm,
  grammText,
  wege,
  type GoldWeg,
  type GoldWegId,
} from "@/data/goldPlan";

/**
 * /dein-gold/<schluessel>: der Gold-Plan, das Freebie zum Wort „Gold“ (MC4b).
 *
 * Aufbau wie Fassung 5 des Portfolio-Plans (src/pages/PortfolioPlan.tsx, Elias, 28.10.2026: „in dem
 * stil alle anderen auch“): oben die Geld-Frage (der Klick markiert nur), ein roter Schmerz (Gold-CFD
 * ist kein Gold), drei Wege zu echtem Gold mit Beispiel-Kasten, die Gramm für den gewählten Betrag,
 * zuletzt zwei bekannte Apps mit belegter Tatsache und der Aufruf zum Gold-Vergleich. Kein Hinweis auf
 * ein anderes Freebie. Versteckt: noindex, nicht in der Sitemap, aber vorgerendert (routen.ts).
 */
const ICON: Record<GoldWegId, LucideIcon> = {
  barren: Coins,
  sparplan: Landmark,
  etc: TrendingUp,
};

const GOLD = "#E0A21A";

const BeispielKasten = ({ w }: { w: GoldWeg }) => {
  const anlage = w.beispiel.slug ? anlageBySlug(w.beispiel.slug) : undefined;
  return (
    <div className="mt-3 flex min-h-[44px] items-center gap-3 rounded-xl bg-accent px-3 py-2 text-[14px] font-semibold text-foreground">
      {anlage ? <AnlageLogo a={anlage} /> : <AnbieterLogo name={w.beispiel.titel} domain={w.beispiel.domain} />}
      <span className="flex-1">
        <span className="font-normal text-muted-foreground">Beispiel: </span>
        {w.beispiel.titel}
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

const GoldPlan = () => {
  const { schluessel } = useParams();
  const [betrag, setBetrag] = useState<number>(GOLD_MONATLICH);

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

  if (schluessel !== GOLD_SCHLUESSEL) return <Navigate to="/halal-guide" replace />;

  const imMonat = gramm(betrag);

  return (
    <main className="bg-background" data-freebie="gold-plan">
      <Seo
        title="Dein Gold als Muslim | finanzmuslim"
        description="Sieh, wie du echtes Gold kaufst, ohne es zu Hause zu haben: drei Wege und wie viel Gramm du für 100, 300 oder 500 € bekommst."
        path={GOLD_PFAD}
        noindex
      />

      <div className="container max-w-2xl py-8 md:py-12">
        <header className="rounded-3xl bg-hero p-6 md:p-8">
          <h1 className="text-[30px] font-extrabold leading-[1.1] text-foreground md:text-[38px]">
            Dein Gold als Muslim in vier Schritten
          </h1>
          <p className="mt-4 text-[16px] font-semibold text-foreground">Wie viel willst du im Monat in Gold stecken?</p>
          <div className="mt-2 grid grid-cols-3 gap-1.5" role="group" aria-label="Wie viel willst du im Monat in Gold stecken?">
            {GOLD_BETRAEGE.map((b) => (
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
          <p className="mt-5 text-[14px] leading-snug text-foreground/75">
            Schon mal vorab: Ich habe gerankt, wo du Gold zinsfrei kaufst.{" "}
            <Link to={goldLink("/vergleich/edelmetalle", "oben")} className="font-semibold text-primary underline-offset-2 hover:underline">
              Zum Gold-Vergleich
            </Link>
          </p>
        </header>
        <p className="mt-2 px-2 text-[12px] text-muted-foreground">Beispiel, keine Anlageberatung.</p>

        <section className="reveal mt-10" aria-labelledby="schritt-1">
          <Schritt nr={1} id="schritt-1" titel="Erst echtes Gold" />
          <p className="mt-2 text-[16px] leading-snug text-foreground/80">Nicht alles, was beim Broker Gold heißt, ist Gold.</p>
          <div className="mt-4 flex gap-3 rounded-2xl bg-loss-soft p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-loss" aria-hidden />
            <div>
              <p className="text-[16px] font-semibold leading-snug text-foreground">{SCHMERZ.gold}</p>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 px-1">
            <span className="text-[12px] text-muted-foreground">{CFD_ZEILE}</span>
            <span className="flex gap-1">
              {CFD_ANBIETER.map((a) => (
                <AnbieterLogo key={a.name} name={a.name} domain={a.domain} klein />
              ))}
            </span>
            <span className="text-[12px] text-muted-foreground">{CFD_ANBIETER.map((a) => a.name).join(", ")}</span>
          </div>
          <p className="mt-4 text-[16px] font-semibold leading-snug text-foreground">{SCHMERZ.muslim}</p>
          <Link
            to={goldLink("/vergleich/edelmetalle", "cfd")}
            className="mt-1 inline-flex min-h-[44px] items-center gap-1 text-[16px] font-semibold text-primary hover:underline"
          >
            Echtes Gold im Vergleich
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </section>

        <section className="reveal mt-12" aria-labelledby="schritt-2">
          <Schritt nr={2} id="schritt-2" titel="Drei Wege zu echtem Gold" />
          <p className="mt-2 text-[16px] leading-snug text-foreground/80">Dein Gold muss nicht bei dir zu Hause liegen.</p>
          <div className="mt-4 grid gap-3">
            {wege.map((w) => {
              const Icon = ICON[w.id];
              return (
                <div key={w.id} className="card-surface p-4">
                  <div className="flex gap-3">
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                      style={{ background: `${GOLD}1A`, color: GOLD }}
                      aria-hidden
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="flex flex-wrap items-center gap-x-2 text-[16px] font-bold text-foreground">
                        {w.name}
                        <span className="rounded-full bg-muted px-2 py-0.5 text-[12px] font-semibold text-muted-foreground">{w.ort}</span>
                      </p>
                      <p className="text-[16px] leading-snug text-foreground/80">{w.satz}</p>
                    </div>
                  </div>
                  <BeispielKasten w={w} />
                </div>
              );
            })}
          </div>
        </section>

        <section className="reveal mt-12" aria-labelledby="schritt-3">
          <Schritt nr={3} id="schritt-3" titel="So viel Gold bekommst du" />
          <article className="card-surface mt-4 p-5 md:p-6">
            <p className="text-[16px] text-foreground/85">Für {betrag}&nbsp;€ im Monat:</p>
            <div className="mt-3 flex items-end gap-3">
              <span className="text-[44px] font-extrabold leading-none tabular-nums" style={{ color: GOLD }}>
                {grammText(imMonat)}&nbsp;g
              </span>
              <span className="pb-1 text-[16px] text-muted-foreground">Gold im Monat</span>
            </div>
            <p className="mt-4 border-t border-border pt-3 text-[16px] text-foreground">
              Nach einem Jahr: rund <span className="font-bold tabular-nums">{grammText(imMonat * 12)}&nbsp;g</span>
            </p>
          </article>
          <p className="mt-2 px-1 text-[12px] leading-snug text-muted-foreground">
            Gerechnet mit dem Goldpreis vom {PREIS_STAND}, ohne Aufschlag. Der Preis schwankt.
          </p>
        </section>

        <section className="reveal mt-12" aria-labelledby="schritt-4">
          <Schritt nr={4} id="schritt-4" titel="Wo du es jetzt kaufst" />
          <p className="mt-2 text-[20px] font-extrabold leading-tight text-foreground">
            Die bekanntesten Apps sind nicht die besten für Muslime.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {BEKANNTE_GOLD.map((d) => (
              <div
                key={d.name}
                className={`rounded-2xl p-4 ring-1 ${d.ton === "rot" ? "bg-loss-soft ring-loss/20" : "bg-amber-50 ring-amber-200"}`}
              >
                <div className="flex items-center gap-2">
                  <AnbieterLogo name={d.name} domain={d.domain} />
                  <p className="min-w-0 text-[14px] font-bold leading-tight text-foreground">{d.name}</p>
                </div>
                {"vor" in d && <p className="mt-3 text-[14px] font-bold leading-none text-foreground">{d.vor}</p>}
                <p
                  className={`${"vor" in d ? "mt-1" : "mt-3"} whitespace-nowrap text-[26px] font-extrabold leading-none tabular-nums ${d.ton === "rot" ? "text-loss" : "text-amber-700"}`}
                >
                  {d.gross}
                </p>
                <p className="mt-1 text-[14px] leading-snug text-muted-foreground">{d.klein}</p>
              </div>
            ))}
          </div>
          <FindeDeinAngebot
            className="mt-4"
            titel="Du willst die besten finden?"
            text="Ich habe die Depots nach Gold gerankt: welche zinsfrei sind und welche deine Gold-ETCs haben."
            knopf="Zum Gold-Vergleich"
            logos={[...GOLD_DEPOT_LOGOS]}
            gesamt={edelmetallVergleich.length}
            ziel={goldLink("/vergleich/edelmetalle", "mitte")}
          />
          <p className="mt-4 px-1 text-[16px] leading-snug text-foreground/80">
            Lieber Barren oder Sparplan?{" "}
            <Link to={goldLink("/vergleich/edelmetalle", "ende")} className="font-semibold text-primary hover:underline">
              Stehen im selben Vergleich
            </Link>
          </p>
        </section>

        <footer className="mt-12 space-y-2 border-t border-border pt-6 text-[12px] leading-relaxed text-muted-foreground">
          <p>Alle Zahlen stammen aus meinen Vergleichen.</p>
          <p>
            Das sind Beispiele, keine persönliche Empfehlung. Persönliche Anlageberatung braucht in Deutschland eine Zulassung.
          </p>
          <p>Prüfungen der Beispiele:</p>
          <ul className="space-y-1">
            {goldQuellen.map((q) => (
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

export default GoldPlan;
