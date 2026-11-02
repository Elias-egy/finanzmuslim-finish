import { useEffect } from "react";
import { BadgeCheck, ChevronDown } from "lucide-react";
import Seo from "@/components/Seo";
import NaechsterTeil from "@/components/NaechsterTeil";
import AktienZeile from "@/components/vorlagen/AktienZeile";
import DepotAufruf, { DEPOT_TITEL } from "@/components/vorlagen/DepotAufruf";
import { vorlageBySlug } from "@/data/vorlagen";
import { optinFreebie, vollPfad } from "@/data/optin";
import { aktien, aktieLink, PRUEFSTAND, themen, SICHTBAR_AKTIEN } from "@/data/top100Aktien";

/**
 * Die volle Fassung der 100 Halal-Aktien, das Freebie zum Wort „Aktie“, nur über den Link aus der Mail nach der
 * Bestätigung (noindex, nicht in der Sitemap). Die offene Seite mit dem Ausschnitt ist `Top100HalalAktien.tsx`.
 *
 * Seit MC7d14 (01.11.2026) im Stil der Liste und des Portfolio-Plans (Vault `memory/freebie-top3-statt-rot-guide-unten.md`,
 * Plan `fundament/upgrade/MC7D11_2026-10-31/plan.html`, Baustein „Aktie neu“): oben der Titel und die fünf Themen, je
 * Thema die ersten Aktien und der Rest zum Aufklappen, nach dem ersten Thema die Top 3 Depots, der Kasten „Dein nächster
 * Schritt“ ganz unten, kein Krypto-Aufruf. Seit MC7d15 ohne Themen-Einleitung, Highlight und die sechs fraglichen
 * Namen, damit nach den 100 gleich der Kasten kommt (Elias, 01.11.2026, Vault `raw/2026-11-01-elias-mc7d15-feedback-alle-freebies.md`). Depot-Vergleich-Kasten, Spickzettel und Anmeldeformular sind weg, damit der
 * Leser beim Thema bleibt. Seit MC7d15 wieder mit PDF-Knopf; das PDF ist diese Seite im Handy-Maß (`src/data/freebiePdfs.ts`).
 */
const v = vorlageBySlug("top-100-halal-aktien")!;
const freebie = optinFreebie("top-100-halal-aktien")!;
const pfad = vollPfad(freebie);

const Gruppe = ({ i }: { i: number }) => {
  const t = themen[i];
  const zeilen = aktien.slice(i * 20, i * 20 + 20);
  const zeile = (a: (typeof aktien)[number]) => (
    <AktienZeile
      key={a.ticker}
      rang={a.rang}
      name={a.name}
      ticker={a.ticker}
      bekanntFuer={a.bekanntFuer}
      status={a.status}
    />
  );
  return (
    <section id={`thema-${i}`} className="reveal mt-12 scroll-mt-20" aria-labelledby={`titel-thema-${i}`}>
      <div className="flex items-baseline justify-between gap-3">
        <h2 id={`titel-thema-${i}`} className="text-[24px] font-extrabold leading-tight text-foreground">
          {t.titel}
        </h2>
        <span className="shrink-0 text-[13px] font-semibold tabular-nums text-muted-foreground">{t.spanne}</span>
      </div>
      <div className="card-surface mt-4 overflow-hidden p-0">{zeilen.slice(0, SICHTBAR_AKTIEN).map(zeile)}</div>
      <details className="group mt-2">
        <summary className="flex min-h-[44px] cursor-pointer list-none items-center gap-2 rounded-2xl px-1 text-[16px] font-semibold text-primary [&::-webkit-details-marker]:hidden">
          {zeilen.length - SICHTBAR_AKTIEN} weitere anzeigen
          <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" aria-hidden />
        </summary>
        <div className="card-surface mt-2 overflow-hidden p-0">{zeilen.slice(SICHTBAR_AKTIEN).map(zeile)}</div>
      </details>
    </section>
  );
};

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
        description="Sieh alle 100 bekannten Aktien mit Musaffa-Einzelprüfung, von Apple bis Nike, nach Themen sortiert."
        path={pfad}
        noindex
      />

      <div className="container max-w-2xl py-8 md:py-12">
        <header className="rounded-3xl bg-hero p-6 md:p-8">
          <h1 className="text-[30px] font-extrabold leading-[1.1] text-foreground md:text-[38px]">
            {/* „Halal-Aktien“ bricht nicht am Bindestrich um. */}
            {v.titel.replace(/ Halal-Aktien$/, "")} <span className="whitespace-nowrap">Halal-Aktien</span>
          </h1>
          <p className="mt-3 flex items-start gap-2 text-[16px] font-semibold leading-snug text-foreground">
            <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-gain" aria-hidden />
            <span>
              Alle 100 einzeln mit Musaffa geprüft, Stand {PRUEFSTAND}.
            </span>
          </p>
          <nav aria-label="Themen" className="mt-5 flex flex-wrap gap-1.5">
            {themen.map((t, i) => (
              <a
                key={t.titel}
                href={`#thema-${i}`}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-2xl bg-white px-3 text-[14px] font-semibold text-foreground ring-1 ring-black/5"
              >
                {t.titel}
              </a>
            ))}
          </nav>
          {/* Kein PDF-Knopf mehr (Elias, 02.11.2026, MC7f: „diese PDF-Option rauslassen. Bei den anderen Freebies“; nur die Duas). */}
        </header>
        <p className="mt-2 px-2 text-[12px] text-muted-foreground">
          Nach Bekanntheit sortiert, keine Kauf-Rangliste und keine Anlageberatung.
        </p>

        <Gruppe i={0} />

        {/* Der Depot-Aufruf nach dem ersten Thema: erst reinlesen, dann kaufen (Elias, 31.10.2026, MC7d13c). */}
        <section className="reveal mt-10" aria-labelledby="wo">
          <DepotAufruf titel={DEPOT_TITEL} link={aktieLink} />
        </section>

        {themen.slice(1).map((t, i) => (
          <Gruppe key={t.titel} i={i + 1} />
        ))}

        <NaechsterTeil wort="aktie" className="mt-12" />

        <footer className="mt-12 space-y-2 border-t border-border pt-6 text-[12px] leading-relaxed text-muted-foreground">
          <p>
            Halal-Screening: Musaffa-Einzelprüfung, Stand {PRUEFSTAND}, Methodik auf Basis der AAOIFI-Kriterien. Halal-Screening
            und Boykottprüfung sind zwei getrennte Prüfungen, diese Liste bildet nur die erste ab.
          </p>
          <p>
            Die genannten Unternehmen und Aktien sind Beispiele, keine Empfehlung zum Kauf, Halten oder Verkauf und keine
            Anlageberatung. Die Auswahl ist redaktionell nach Bekanntheit sortiert, nicht nach Größe, Rendite oder Qualität.
            Zu Musaffa besteht keine Partnerschaft.
          </p>
        </footer>
      </div>
    </main>
  );
};

export default Top100Voll;
