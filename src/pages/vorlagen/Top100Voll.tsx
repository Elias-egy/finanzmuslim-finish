import { useEffect } from "react";
import { BadgeCheck, TrendingDown } from "lucide-react";
import Seo from "@/components/Seo";
import NaechsterTeil from "@/components/NaechsterTeil";
import KursZeile from "@/components/vorlagen/KursZeile";
import AktienAufruf from "@/components/vorlagen/AktienAufruf";
import { vorlageBySlug } from "@/data/vorlagen";
import { optinFreebie, vollPfad } from "@/data/optin";
import { aktien, aktieLink, PRUEFSTAND, TOP_GEFALLEN } from "@/data/top100Aktien";
import { kurse, KURS_STAND } from "@/data/top100Kurse";

/**
 * Die volle Fassung der 100 Halal-Aktien, das Freebie zum Wort „Aktie“, nur über den Link aus der Mail nach der
 * Bestätigung (noindex, nicht in der Sitemap). Die offene Seite mit dem Ausschnitt ist `Top100HalalAktien.tsx`.
 *
 * Seit AF1 (12.11.2026, Elias wortgleich in Vault `raw/2026-11-12-elias-af1-01-aktien-freebie-logos-wochenkurs-top15-cta.md`
 * und `-af1-02-top15-umrandung-fomo-pruefer-manychat.md`): jede Aktie mit Logo, Kurslinie und Abstand zum Jahreshoch wie
 * in der Halal-Datenbank; alle 100 offen, kein „weitere anzeigen“; zuerst 15 große, tief gefallene Namen in einem roten
 * Rahmen, direkt danach der Aufruf „Werde Teil davon. In unter 10 Minuten.“, dann die übrigen 85 in der alten Reihenfolge.
 * Elias wollte die Woche zeigen; am 12.11. lagen aber nur 50 von 100 in der Woche im Minus und 93 unter dem Jahreshoch,
 * darum zeigt die Spalte den Abstand zum Jahreshoch (die Woche steht in `top100Kurse.ts` bereit). Kurse erneuern:
 * `python3 scripts/top100-kurse.py`.
 */
const v = vorlageBySlug("top-100-halal-aktien")!;
const freebie = optinFreebie("top-100-halal-aktien")!;
const pfad = vollPfad(freebie);

const oben = new Set<string>(TOP_GEFALLEN);
const gefallen = aktien
  .filter((a) => oben.has(a.ticker))
  .sort((x, y) => (kurse[x.ticker]?.hoch ?? 0) - (kurse[y.ticker]?.hoch ?? 0));
const rest = aktien.filter((a) => !oben.has(a.ticker));
const unterHoch = aktien.filter((a) => (kurse[a.ticker]?.hoch ?? 0) < 0).length;

/** Kopf über jeder Liste: was rechts steht (Elias: „ganz oben steht immer … Kurs“). */
const ListenKopf = () => (
  <div className="flex items-center justify-between gap-3 border-b border-border px-2.5 py-2 text-[12px] font-semibold text-muted-foreground md:px-4">
    <span>Aktie</span>
    <span>Kurs · seit Jahreshoch</span>
  </div>
);

const zeile = (a: (typeof aktien)[number]) => (
  <KursZeile key={a.ticker} name={a.name} ticker={a.ticker} bekanntFuer={a.bekanntFuer} kurs={kurse[a.ticker]} />
);

const Top100Voll = () => {
  // Sanftes Einblenden beim Scrollen wie in der Liste und im Portfolio-Plan.
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

  return (
    <main className="bg-background" data-freebie="top-100-aktien" data-vorlage="top-100-halal-aktien">
      <Seo
        title="100 bekannte Halal-Aktien, Musaffa-Einzelprüfung | finanzmuslim"
        description="Sieh alle 100 bekannten Halal-Aktien mit Kurs und Abstand zum Jahreshoch, von Apple bis Nike."
        path={pfad}
        noindex
      />

      <div className="container max-w-2xl py-8 md:py-12">
        <header className="rounded-lg border border-border bg-card p-6 md:p-8">
          <h1 className="text-[30px] font-extrabold leading-[1.1] text-foreground md:text-[38px]">
            {/* „Halal-Aktien“ bricht nicht am Bindestrich um. */}
            {v.titel.replace(/ Halal-Aktien$/, "")} <span className="whitespace-nowrap">Halal-Aktien</span>
          </h1>
          {/* AF1-Prüfer (vier gespielte Leser): die 93 zuerst, in Alltagssprache; Musaffa und Datum stehen in der Fußzeile. */}
          <p className="mt-3 flex items-start gap-2 text-[17px] font-semibold leading-snug text-foreground">
            <TrendingDown className="mt-0.5 h-5 w-5 shrink-0 text-loss" aria-hidden />
            <span>
              <b className="text-loss">{unterHoch} von 100</b> sind gerade günstiger als zu ihrem Jahreshoch.
            </span>
          </p>
          <p className="mt-2 flex items-start gap-2 text-[16px] font-semibold leading-snug text-foreground">
            <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-gain" aria-hidden />
            <span>Alle 100 halal geprüft.</span>
          </p>
        </header>

        <section
          className="reveal mt-8 rounded-2xl border-2 border-loss/60 bg-loss-soft/40 p-2 pt-3 md:p-4"
          aria-labelledby="titel-gefallen"
          data-top-gefallen
        >
          <h2 id="titel-gefallen" className="px-1 text-[24px] font-extrabold leading-tight text-foreground">
            Große Namen, tief gefallen
          </h2>
          <p className="mt-1 px-1 text-[14px] text-muted-foreground">
            {gefallen.length} bekannte Namen, die gerade tief gefallen sind. Stand {KURS_STAND}.
          </p>
          <div className="card-surface mt-3 overflow-hidden p-0">
            <ListenKopf />
            {gefallen.map(zeile)}
          </div>
        </section>

        {/* Direkt nach dem Schmerz die Lösung (Elias, AF1-02: „Und dann danach direkt die Lösung“). */}
        <section className="reveal mt-6" aria-labelledby="wo">
          <AktienAufruf link={aktieLink} />
        </section>

        <section className="reveal mt-10" aria-labelledby="titel-rest">
          <h2 id="titel-rest" className="text-[24px] font-extrabold leading-tight text-foreground">
            Die anderen {rest.length}
          </h2>
          <div className="card-surface mt-3 overflow-hidden p-0">
            <ListenKopf />
            {rest.map(zeile)}
          </div>
        </section>

        <NaechsterTeil wort="aktie" className="mt-12" />

        <footer className="mt-12 space-y-2 border-t border-border pt-6 text-[12px] leading-relaxed text-muted-foreground">
          <p>
            Kurse: Yahoo Finance, Schlusskurse in Euro, Stand {KURS_STAND}. „Seit Jahreshoch“ ist der Abstand zum höchsten
            Schlusskurs der letzten 12 Monate. Vergangene Kurse sagen nichts über künftige.
          </p>
          <p>
            Halal-Screening: Musaffa-Einzelprüfung, Stand {PRUEFSTAND}, Methodik auf Basis der AAOIFI-Kriterien. Halal-Screening
            und Boykottprüfung sind zwei getrennte Prüfungen, diese Liste bildet nur die erste ab.
          </p>
          <p>
            Die genannten Unternehmen und Aktien sind Beispiele, keine Empfehlung zum Kauf, Halten oder Verkauf und keine
            Anlageberatung. Zu Musaffa besteht keine Partnerschaft.
          </p>
        </footer>
      </div>
    </main>
  );
};

export default Top100Voll;
