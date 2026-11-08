import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { AlertTriangle, ChevronDown } from "lucide-react";
import Seo from "@/components/Seo";
import NaechsterTeil from "@/components/NaechsterTeil";
import AnbieterLogo from "@/components/AnbieterLogo";
import AnlageKarte from "@/components/vorlagen/AnlageKarte";
import DepotAufruf, { DEPOT_TITEL } from "@/components/vorlagen/DepotAufruf";
import BetragBalken from "@/components/vorlagen/BetragBalken";
import { listenGruppen, SICHTBAR } from "@/data/anlagenListe";
import { GrafikFilter } from "@/components/EtfGrafik";
import {
  ETF_BETRAEGE,
  ETF_MONATLICH,
  ETF_PFAD,
  ETF_SCHLUESSEL,
  GREMIUM_SATZ,
  ISLAMIC_FIRMEN,
  MUSLIM_SATZ,
  REGELN,
  REST_SATZ,
  WORLD_ANBIETER,
  WORLD_ZEILE,
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
 * alle Islamic ETFs als Karten, zuletzt der Depot-Aufruf (Titel DEPOT_TITEL). Kein Hinweis auf ein anderes Freebie.
 * Versteckt: noindex, nicht in der Sitemap, aber vorgerendert (routen.ts).
 */
const ETF_ZEILEN = listenGruppen.find((g) => g.kategorie === "aktien")!.zeilen;

/** Die Farben im Balken oben: Marke, Violett, Grün, wie die Bausteine im Plan. */
const BALKEN_FARBEN = [
  { farbe: "#0057FA", anteil: 3 },
  { farbe: "#705FF1", anteil: 2 },
  { farbe: "#0E9F8A", anteil: 1 },
] as const;

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
        <header className="rounded-lg border border-border bg-card p-6 md:p-8">
          <h1 className="text-[30px] font-extrabold leading-[1.1] text-foreground md:text-[38px]">Deine Halal-ETF-Liste</h1>
          <p className="mt-4 text-[16px] font-semibold text-foreground">Wie viel willst du im Monat anlegen?</p>
          <div className="mt-2 grid grid-cols-3 gap-1.5" role="group" aria-label="Wie viel willst du im Monat anlegen?">
            {ETF_BETRAEGE.map((b) => (
              <button
                key={b}
                type="button"
                aria-pressed={b === betrag}
                onClick={() => setBetrag(b)}
                className={`min-h-[48px] rounded-lg bg-white px-1 text-[16px] font-bold tabular-nums transition-shadow ${
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
            max={Math.max(...ETF_BETRAEGE)}
            teile={BALKEN_FARBEN}
            links={`In einem Jahr in ${zahl(ISLAMIC_FIRMEN)} geprüften Firmen`}
            wert={betrag * 12}
            format={(n) => `${Math.round(n).toLocaleString("de-DE")} €`}
          />
          {/* Kein PDF-Knopf mehr (Elias, 02.11.2026, MC7f: „diese PDF-Option rauslassen. Bei den anderen Freebies“; nur die Duas). */}
        </header>
        <p className="mt-2 px-2 text-[12px] text-muted-foreground">Beispiel, keine Anlageberatung.</p>

        <section className="reveal mt-10" aria-labelledby="normal">
          <Titel id="normal">Im normalen ETF stecken Banken</Titel>
          <div className="mt-4 flex gap-3 rounded-lg bg-loss-soft p-4">
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
        </section>

        {/* Alle ETFs als Liste wie in der Liste (Elias, 01.11.2026, MC7d15: „Das sind alle, die es gibt … dann machst du
            irgendwie drei, vier und dann machst du weitere Anzeigen“). Punkte-Hinweis und Beispielnamen sind weg. */}
        <section id="alle-etfs" className="reveal mt-12 scroll-mt-20" aria-labelledby="alle">
          <h2 id="alle" className="text-[28px] font-extrabold leading-tight text-foreground">
            Alle {ETF_ZEILEN.length} Islamic ETFs und Fonds
          </h2>
          <ul className="mt-4 grid gap-2">
            {ETF_ZEILEN.slice(0, SICHTBAR).map((z) => (
              <AnlageKarte key={z.anlage.slug} z={z} href={`/halal-anlagen/${z.anlage.slug}?src=efkarte`} />
            ))}
          </ul>
          {ETF_ZEILEN.length > SICHTBAR && (
            <details className="group mt-2">
              <summary className="flex min-h-[44px] cursor-pointer list-none items-center gap-2 rounded-lg px-1 text-[16px] font-semibold text-primary [&::-webkit-details-marker]:hidden">
                {ETF_ZEILEN.length - SICHTBAR} weitere anzeigen
                <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" aria-hidden />
              </summary>
              <ul className="mt-2 grid gap-2">
                {ETF_ZEILEN.slice(SICHTBAR).map((z) => (
                  <AnlageKarte key={z.anlage.slug} z={z} href={`/halal-anlagen/${z.anlage.slug}?src=efkarte`} />
                ))}
              </ul>
            </details>
          )}
        </section>

        {/* Nur der Depot-Aufruf wie in der Liste (Elias, 01.11.2026, MC7d15: „genau das Gleiche wie die besten Broker für
            Muslime in der ganzen Liste“); „Wo kann ich sie kaufen?“ und der Broker-Satz sind raus (Runde 2: „zu viel Text“). */}
        <section className="reveal mt-12" aria-label={DEPOT_TITEL}>
          <DepotAufruf titel={DEPOT_TITEL} link={(ziel, stelle) => `${ziel}?src=ef${stelle}`} />
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
