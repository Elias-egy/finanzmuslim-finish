import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import Seo from "@/components/Seo";
import NaechsterTeil from "@/components/NaechsterTeil";
import PdfKnopf from "@/components/vorlagen/PdfKnopf";
import AnbieterLogo from "@/components/AnbieterLogo";
import AnlageKarte from "@/components/vorlagen/AnlageKarte";
import DepotAufruf from "@/components/vorlagen/DepotAufruf";
import { SUKUK_TOP3 } from "@/data/depotTop3";
import BetragBalken from "@/components/vorlagen/BetragBalken";
import { listenGruppen } from "@/data/anlagenListe";
import { GrafikTresor, GrafikWette } from "@/components/GoldGrafiken";
import {
  GOLD_GESAMT_CHECK,
  SUKUK_GESAMT_CHECK,
  CFD_ANBIETER,
  CFD_ZEILE,
  ETC_SATZ,
  GELEHRTE_SATZ,
  GOLD_BETRAEGE,
  GOLD_MONATLICH,
  GOLD_PFAD,
  GOLD_SCHLUESSEL,
  PREIS_STAND,
  REGELN,
  SCHMERZ,
  goldQuellen,
  gramm,
  grammText,
} from "@/data/goldPlan";

/**
 * /dein-gold/<schluessel>: der Gold-Plan, das Freebie zum Wort „Gold“ (MC4b, umgebaut MC4d).
 *
 * Stil wie Fassung 5 des Portfolio-Plans (src/pages/PortfolioPlan.tsx, Elias, 28.10.2026: „in dem stil
 * alle anderen auch“), Inhalt nach Elias' Bild vom 28.10.2026 („es dreht sich eigentlich alles nur um
 * Broker-Gold“): oben „Gold kannst du online kaufen“ mit der Geld-Frage (der Klick markiert nur), die
 * zwei Regeln, warum Gold beim Broker meist nur eine Wette ist (Grafik, der eine rote Schmerz), die
 * Ausnahme Physical Gold ETC mit Zertifikat (Grafik Tresor mit den Gramm zum Betrag), nicht jeder Broker
 * führt sie, der Aufruf zum Edelmetall-Vergleich. Kein Hinweis auf ein anderes Freebie.
 * Versteckt: noindex, nicht in der Sitemap, aber vorgerendert (routen.ts).
 */
const GOLD_ZEILEN = listenGruppen.find((g) => g.kategorie === "gold")!.zeilen;

/** Die Goldtöne im Balken oben. */
const BALKEN_GOLD = [
  { farbe: "#B7791F", anteil: 1 },
  { farbe: "#E0A21A", anteil: 2 },
  { farbe: "#F2C94C", anteil: 1 },
] as const;

const Titel = ({ id, children }: { id: string; children: string }) => (
  <h2 id={id} className="text-[24px] font-extrabold leading-tight text-foreground">
    {children}
  </h2>
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
        title="Gold online kaufen als Muslim | finanzmuslim"
        description="Sieh, wie du als Muslim Gold online kaufst: die zwei Regeln, warum Gold beim Broker oft nur Papier ist und wo es Gold-ETCs mit Zertifikat gibt."
        path={GOLD_PFAD}
        noindex
      />

      <div className="container max-w-2xl py-8 md:py-12">
        <header className="rounded-3xl bg-hero p-6 md:p-8">
          <h1 className="text-[30px] font-extrabold leading-[1.1] text-foreground md:text-[38px]">Gold kannst du online kaufen</h1>
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
          <BetragBalken
            className="mt-5"
            betrag={betrag}
            max={Math.max(...GOLD_BETRAEGE)}
            teile={BALKEN_GOLD}
            links="In einem Jahr in Gold"
            wert={imMonat * 12}
            format={(n) => `rund ${grammText(n)} g`}
          />
          <PdfKnopf wort="gold" className="mt-4" />
        </header>
        <p className="mt-2 px-2 text-[12px] text-muted-foreground">Beispiel, keine Anlageberatung.</p>

        <section className="reveal mt-10" aria-labelledby="regeln">
          <Titel id="regeln">Zwei Regeln für Gold</Titel>
          <ol className="mt-4 grid gap-2">
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
        </section>

        <section className="reveal mt-12" aria-labelledby="wette">
          <Titel id="wette">Beim Broker oft nur eine Wette</Titel>
          <div className="mt-4">
            <GrafikWette />
          </div>
          <div className="mt-3 flex gap-3 rounded-2xl bg-loss-soft p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-loss" aria-hidden />
            <p className="text-[16px] font-semibold leading-snug text-foreground">{SCHMERZ.broker}</p>
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
        </section>

        <section className="reveal mt-12" aria-labelledby="ausnahme">
          <Titel id="ausnahme">Die Ausnahme mit Zertifikat</Titel>
          <p className="mt-2 text-[16px] leading-snug text-foreground/80">{ETC_SATZ}</p>
          <div className="mt-4">
            <GrafikTresor zeile={`Für ${betrag} € im Monat: rund ${grammText(imMonat)} g`} />
          </div>
          <p className="mt-2 px-1 text-[12px] leading-snug text-muted-foreground">
            Nach einem Jahr rund {grammText(imMonat * 12)}&nbsp;g. Gerechnet mit dem Goldpreis vom {PREIS_STAND}, ohne Aufschlag.
          </p>
          {/* Alle Gold-ETCs statt zwei Beispielen (Elias, 01.11.2026, MC7d15: „Dann machst du einfach alle“). */}
          <p className="mt-4 text-[16px] font-semibold text-foreground">Alle {GOLD_ZEILEN.length} mit Shariah-Zertifikat:</p>
          <ul className="mt-2 grid gap-2">
            {GOLD_ZEILEN.map((z) => (
              <AnlageKarte key={z.anlage.slug} z={z} href={`/halal-anlagen/${z.anlage.slug}?src=gdkarte`} />
            ))}
          </ul>
          <p className="mt-3 px-1 text-[14px] leading-snug text-foreground/80">{GELEHRTE_SATZ}</p>
        </section>

        {/* Der Depot-Aufruf wie in der Liste, mit dem Gold-Vergleich (Elias, 01.11.2026, MC7d15: „dann vielleicht die zwei,
            drei besten Anbieter für Gold, die alle haben“). Die Top 3 haben alle 4 (Test goldPlan.test.ts). Runde 3 (Elias,
            02.11.2026, MC7d16): Titel „Die besten Broker für Edelmetalle“, statt der zwei bekannten die Zahl über alle Depots,
            darunter dasselbe für Sukuk. */}
        <section className="reveal mt-12" aria-label="Die besten Broker für Edelmetalle">
          <DepotAufruf
            titel="Die besten Broker für Edelmetalle"
            einleitung=""
            check={GOLD_GESAMT_CHECK}
            link={(ziel, stelle) => `${ziel}?src=gd${stelle}`}
            alle={{ ziel: "/vergleich/edelmetalle", text: "Zum Gold-Vergleich" }}
          />
        </section>

        <section className="reveal mt-12" aria-label="Die besten Broker für Sukuk">
          <DepotAufruf
            titel="Die besten Broker für Sukuk"
            einleitung="Ein Sukuk ist ein Anteil an einer Sache, nicht ein Anspruch auf Geld."
            check={SUKUK_GESAMT_CHECK}
            top={SUKUK_TOP3}
            link={(ziel, stelle) => `${ziel}?src=gdsk${stelle}`}
          />
        </section>

        <NaechsterTeil wort="gold" className="mt-12" />

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
