import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import Seo from "@/components/Seo";
import NaechsterTeil from "@/components/NaechsterTeil";
import AnbieterLogo from "@/components/AnbieterLogo";
import { AnlageLogo } from "@/components/AnlageZeile";
import { GrafikFilter } from "@/components/EtfGrafik";
import { anlageBySlug } from "@/data/halalAnlagen";
import {
  BEKANNTE_ETF,
  BROKER_SATZ,
  ETF_BEISPIELE,
  ETF_BETRAEGE,
  ETF_MONATLICH,
  ETF_PFAD,
  ETF_SCHLUESSEL,
  GREMIUM_SATZ,
  ISLAMIC_FIRMEN,
  MSCI_STAND,
  MUSLIM_SATZ,
  REGELN,
  REST_SATZ,
  WORLD_ANBIETER,
  WORLD_ZEILE,
  etfLink,
  etfQuellen,
  schmerzSatz,
  zahl,
} from "@/data/etfPlan";

/**
 * /dein-etf/<schluessel>: der ETF-Plan, das Freebie zum Wort „ETF“ (MC4e).
 *
 * Stil wie die Gold-Seite (src/pages/GoldPlan.tsx) und Fassung 5 des Portfolio-Plans (Elias, 28.10.2026:
 * „in dem stil alle anderen auch“): oben die Geld-Frage (der Klick markiert nur), der eine rote Schmerz
 * (im normalen MSCI World stecken Finanzfirmen), wie ein Islamic ETF filtert (Grafik mit dem Betrag),
 * Beispiele mit Shariah-Prüfung, „Wo kann ich sie kaufen?“ ohne Rot, die bekanntesten Apps, der Aufruf
 * zum Depot-Vergleich. Kein Hinweis auf ein anderes Freebie.
 * Versteckt: noindex, nicht in der Sitemap, aber vorgerendert (routen.ts).
 */
const Titel = ({ id, children }: { id: string; children: string }) => (
  <h2 id={id} className="text-[24px] font-extrabold leading-tight text-foreground">
    {children}
  </h2>
);

const EtfPlan = () => {
  const { schluessel } = useParams();
  const [betrag, setBetrag] = useState<number>(ETF_MONATLICH);

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

  if (schluessel !== ETF_SCHLUESSEL) return <Navigate to="/halal-guide" replace />;

  return (
    <main className="bg-background" data-freebie="etf-plan">
      <Seo
        title="Islamic ETFs kaufen als Muslim | finanzmuslim"
        description="Sieh, wie ein Islamic ETF Banken und Haram-Geschäfte aussortiert, welche es gibt und welche Broker sie führen."
        path={ETF_PFAD}
        noindex
      />

      <div className="container max-w-2xl py-8 md:py-12">
        <header className="rounded-3xl bg-hero p-6 md:p-8">
          <h1 className="text-[30px] font-extrabold leading-[1.1] text-foreground md:text-[38px]">So kaufst du Islamic ETFs</h1>
          <p className="mt-4 text-[16px] font-semibold text-foreground">Wie viel willst du im Monat anlegen?</p>
          <div className="mt-2 grid grid-cols-3 gap-1.5" role="group" aria-label="Wie viel willst du im Monat anlegen?">
            {ETF_BETRAEGE.map((b) => (
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
            Schon mal vorab: Ich habe gerankt, wo du Islamic ETFs zinsfrei kaufst.{" "}
            <Link to={etfLink("/vergleich/depot", "oben")} className="font-semibold text-primary underline-offset-2 hover:underline">
              Zum Depot-Vergleich
            </Link>
          </p>
        </header>
        <p className="mt-2 px-2 text-[12px] text-muted-foreground">Beispiel, keine Anlageberatung.</p>

        <section className="reveal mt-10" aria-labelledby="normal">
          <Titel id="normal">Im normalen ETF stecken Banken</Titel>
          <div className="mt-4 flex gap-3 rounded-2xl bg-loss-soft p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-loss" aria-hidden />
            <div>
              <p className="text-[16px] font-semibold leading-snug text-foreground">{schmerzSatz(betrag)}</p>
              <p className="mt-2 text-[16px] font-bold leading-snug text-foreground">{MUSLIM_SATZ}</p>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 px-1">
            <span className="text-[12px] text-muted-foreground">{WORLD_ZEILE}</span>
            <span className="flex gap-1">
              {WORLD_ANBIETER.map((a) => (
                <AnbieterLogo key={a.name} name={a.name} domain={a.domain} klein />
              ))}
            </span>
            <span className="text-[12px] text-muted-foreground">{WORLD_ANBIETER.map((a) => a.name).join(", ")}</span>
          </div>
        </section>

        <section className="reveal mt-12" aria-labelledby="filter">
          <Titel id="filter">So filtert ein Islamic ETF</Titel>
          <p className="mt-2 text-[16px] leading-snug text-foreground/80">Beim MSCI World Islamic zum Beispiel:</p>
          <ol className="mt-3 grid gap-2">
            {REGELN.map((r, i) => (
              <li key={r.wort} className="card-surface flex items-center gap-3 p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-[16px] font-extrabold text-primary">
                  {i + 1}
                </span>
                <p className="text-[16px] leading-snug text-foreground">
                  <span className="font-bold">{r.wort}:</span> {r.satz}
                </p>
              </li>
            ))}
          </ol>
          <p className="mt-2 px-1 text-[12px] leading-snug text-muted-foreground">
            {REST_SATZ} {GREMIUM_SATZ}
          </p>
          <div className="mt-4">
            <GrafikFilter zeile={`Für ${betrag} € im Monat`} unter={`steckt dein Geld in ${zahl(ISLAMIC_FIRMEN)} Firmen`} />
          </div>
          <p className="mt-2 px-1 text-[12px] leading-snug text-muted-foreground">Punkte als Bild, nicht gezählt. Zahlen von MSCI, Stand {MSCI_STAND}.</p>
          <p className="mt-4 text-[16px] font-semibold text-foreground">Mit Shariah-Prüfung, zum Beispiel:</p>
          <div className="mt-2 grid gap-2">
            {ETF_BEISPIELE.map((e) => {
              const anlage = anlageBySlug(e.slug);
              return (
                <div key={e.slug} className="flex min-h-[44px] items-center gap-3 rounded-xl bg-accent px-3 py-2 text-[14px] font-semibold text-foreground">
                  {anlage && <AnlageLogo a={anlage} />}
                  <span className="flex-1">
                    {e.titel}
                    <span className="block text-[12px] font-normal text-muted-foreground">{e.pruefung}</span>
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="reveal mt-12" aria-labelledby="kaufen">
          <Titel id="kaufen">Wo kann ich sie kaufen?</Titel>
          <p className="mt-2 text-[16px] leading-snug text-foreground/80">{BROKER_SATZ}</p>
          <p className="mt-5 text-[20px] font-extrabold leading-tight text-foreground">
            Die bekanntesten Apps sind nicht die besten für Muslime.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {BEKANNTE_ETF.map((d) => (
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
          {/* Der Aufruf zum Depot-Vergleich steht im Kasten darunter (Elias, 30.10.2026: „Du willst die besten finden …
              das kann alles weg“). */}
        </section>

        <NaechsterTeil wort="etf" className="mt-12" />

        <footer className="mt-12 space-y-2 border-t border-border pt-6 text-[12px] leading-relaxed text-muted-foreground">
          <p>Alle Zahlen stammen aus meinen Vergleichen und von MSCI.</p>
          <p>
            Das sind Beispiele, keine persönliche Empfehlung. Persönliche Anlageberatung braucht in Deutschland eine Zulassung.
          </p>
          <p>Prüfungen der Beispiele:</p>
          <ul className="space-y-1">
            {etfQuellen.map((q) => (
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

export default EtfPlan;
