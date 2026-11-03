import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import Seo from "@/components/Seo";
import NaechsterTeil from "@/components/NaechsterTeil";
import AnlageKarte from "@/components/vorlagen/AnlageKarte";
import DepotAufruf from "@/components/vorlagen/DepotAufruf";
import BetragBalken from "@/components/vorlagen/BetragBalken";
import { IlluSukuk } from "@/components/illu";
import { SUKUK_TOP3 } from "@/data/depotTop3";
import {
  BILD_SATZ,
  ERWARTUNG,
  MERKSATZ,
  MUSLIM_SATZ,
  SCHMERZ,
  SUKUK_BETRAEGE,
  SUKUK_GESAMT_CHECK,
  SUKUK_MONATLICH,
  SUKUK_PFAD,
  SUKUK_SCHLUESSEL,
  SUKUK_ZEILEN,
  euro,
  sukukQuellen,
  vergleich,
} from "@/data/sukukPlan";

/**
 * /dein-sukuk/<schluessel>: der Sukuk-Plan, das Freebie zum Wort „Sukuk“ (MC7f).
 *
 * Stil wie der ETF-Plan (src/pages/EtfPlan.tsx) und der Gold-Plan (src/pages/GoldPlan.tsx): oben die Geld-Frage (der
 * Klick markiert nur), der eine rote Schmerz (eine Anleihe ist ein Kredit), was ein Sukuk ist (Merksatz und Bild aus
 * /wissen/sukuk), Anleihe und Sukuk nebeneinander mit dem Betrag, was du erwarten kannst, alle Sukuk-Fonds als Karten,
 * zuletzt „Die besten Broker für Sukuk“. Kein Hinweis auf ein anderes Freebie.
 * Versteckt: noindex, nicht in der Sitemap, aber vorgerendert (routen.ts).
 */

/** Ruhige Töne im Balken oben: Marke, Hellblau, Violett. */
const BALKEN_FARBEN = [
  { farbe: "#0057FA", anteil: 2 },
  { farbe: "#5B8DEF", anteil: 2 },
  { farbe: "#705FF1", anteil: 1 },
] as const;

const Titel = ({ id, children }: { id: string; children: string }) => (
  <h2 id={id} className="text-[24px] font-extrabold leading-tight text-foreground">
    {children}
  </h2>
);

const SukukPlan = () => {
  const { schluessel } = useParams();
  const [betrag, setBetrag] = useState<number>(SUKUK_MONATLICH);

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

  if (schluessel !== SUKUK_SCHLUESSEL) return <Navigate to="/halal-guide" replace />;

  return (
    <main className="bg-background" data-freebie="sukuk-plan">
      <Seo
        title="Sukuk kaufen als Muslim | finanzmuslim"
        description="Sieh, warum ein Sukuk kein Kredit ist, welche Sukuk-Fonds es gibt und welche Broker alle führen."
        path={SUKUK_PFAD}
        noindex
      />

      <div className="container max-w-2xl py-8 md:py-12">
        <header className="rounded-3xl bg-hero p-6 md:p-8">
          <h1 className="text-[30px] font-extrabold leading-[1.1] text-foreground md:text-[38px]">Sukuk statt Anleihe</h1>
          <p className="mt-4 text-[16px] font-semibold text-foreground">Wie viel willst du im Monat anlegen?</p>
          <div className="mt-2 grid grid-cols-3 gap-1.5" role="group" aria-label="Wie viel willst du im Monat anlegen?">
            {SUKUK_BETRAEGE.map((b) => (
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
            max={Math.max(...SUKUK_BETRAEGE)}
            teile={BALKEN_FARBEN}
            links="In einem Jahr angelegt"
            wert={betrag * 12}
            format={euro}
          />
          {/* Kein PDF-Knopf mehr (Elias, 02.11.2026, MC7f: „diese PDF-Option rauslassen. Bei den anderen Freebies“; nur die Duas). */}
        </header>
        <p className="mt-2 px-2 text-[12px] text-muted-foreground">Beispiel, keine Anlageberatung.</p>

        <section className="reveal mt-10" aria-labelledby="anleihe">
          <Titel id="anleihe">Eine Anleihe ist ein Kredit</Titel>
          <div className="mt-4 flex gap-3 rounded-2xl bg-loss-soft p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-loss" aria-hidden />
            <div>
              <p className="text-[16px] font-semibold leading-snug text-foreground">{SCHMERZ}</p>
              <p className="mt-2 text-[16px] font-bold leading-snug text-foreground">{MUSLIM_SATZ}</p>
            </div>
          </div>
        </section>

        <section className="reveal mt-12" aria-labelledby="anteil">
          <Titel id="anteil">Ein Sukuk ist ein Anteil</Titel>
          <p className="mt-3 rounded-2xl bg-accent p-4 text-[19px] font-extrabold leading-snug text-foreground">{MERKSATZ}</p>
          <figure className="card-surface mt-3 p-4">
            <IlluSukuk className="mx-auto w-full max-w-[420px]" />
            <figcaption className="mt-2 text-[14px] leading-snug text-foreground/80">{BILD_SATZ}</figcaption>
          </figure>
        </section>

        {/* Drei Zeilen aus der Tabelle im Beitrag, die erste mit dem Betrag von oben (wie die Gramm beim Gold). */}
        <section className="reveal mt-12" aria-labelledby="nebeneinander">
          <Titel id="nebeneinander">Anleihe und Sukuk nebeneinander</Titel>
          <div className="mt-4 grid gap-2">
            {vergleich(betrag).map((z) => (
              <div key={z.frage} className="card-surface p-4">
                <p className="text-[15px] font-bold text-foreground">{z.frage}</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div className="rounded-xl bg-loss-soft p-3">
                    <p className="text-[12px] font-bold text-loss">Anleihe</p>
                    <p className="mt-1 text-[15px] leading-snug text-foreground">{z.anleihe}</p>
                  </div>
                  <div className="rounded-xl bg-accent p-3">
                    <p className="text-[12px] font-bold text-primary">Sukuk</p>
                    <p className="mt-1 text-[15px] font-semibold leading-snug text-foreground">{z.sukuk}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 rounded-xl bg-accent p-3 text-[15px] leading-snug text-foreground">
            <strong>Was du erwarten kannst:</strong> {ERWARTUNG}
          </p>
        </section>

        <section id="alle-sukuk" className="reveal mt-12 scroll-mt-20" aria-labelledby="alle">
          <h2 id="alle" className="text-[28px] font-extrabold leading-tight text-foreground">
            Alle {SUKUK_ZEILEN.length} Sukuk-ETFs und Fonds
          </h2>
          <ul className="mt-4 grid gap-2">
            {SUKUK_ZEILEN.map((z) => (
              <AnlageKarte key={z.anlage.slug} z={z} href={`/halal-anlagen/${z.anlage.slug}?src=skkarte`} />
            ))}
          </ul>
        </section>

        {/* Wie beim Gold: die Zahl über alle Depots, dann die drei besten mit allen Sukuk (Elias, 02.11.2026, MC7d16:
            „Und einmal noch das gleiche als Sukuk“; Runde 4: eigenes Wort statt auf der Gold-Seite). */}
        <section className="reveal mt-12" aria-label="Die besten Broker für Sukuk">
          <DepotAufruf
            titel="Die besten Broker für Sukuk"
            einleitung=""
            check={SUKUK_GESAMT_CHECK}
            top={SUKUK_TOP3}
            link={(ziel, stelle) => `${ziel}?src=sk${stelle}`}
          />
        </section>

        <NaechsterTeil wort="sukuk" className="mt-12" />

        <footer className="mt-12 space-y-2 border-t border-border pt-6 text-[12px] leading-relaxed text-muted-foreground">
          <p>Alle Zahlen stammen aus meinen Vergleichen.</p>
          <p>
            Das sind Beispiele, keine persönliche Empfehlung. Persönliche Anlageberatung braucht in Deutschland eine Zulassung.
          </p>
          <p>Prüfungen der Beispiele:</p>
          <ul className="space-y-1">
            {sukukQuellen.map((q) => (
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

export default SukukPlan;
