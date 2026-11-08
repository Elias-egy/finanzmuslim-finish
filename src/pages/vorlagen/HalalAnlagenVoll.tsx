import { useEffect } from "react";
import { useNavigationType } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import Seo from "@/components/Seo";
import NaechsterTeil from "@/components/NaechsterTeil";
import DepotAufruf, { DEPOT_TITEL } from "@/components/vorlagen/DepotAufruf";
import AnlageKarte from "@/components/vorlagen/AnlageKarte";
import { ANLAGEN_QUELLEN, ANLAGEN_RECHTSHINWEIS, artFarbe } from "@/components/vorlagen/anlagenTeile";
import { optinFreebie, vollPfad } from "@/data/optin";
import { kaufZeilen } from "@/data/halalAnlagenKauf";
import {
  SICHTBAR,
  UEBERBLICK,
  listeLink,
  listenGruppen,
  ohneBeleg,
} from "@/data/anlagenListe";

/**
 * Die volle Liste „Halal-Anlagen“, das Freebie zum Wort „Liste“. Seit MC7d13 (31.10.2026) im Stil von
 * Fassung 5 des Portfolio-Plans: oben der Titel „Die Halal-Investment-Liste“ (Elias, 31.10.2026, MC7d13c) und was es gibt,
 * dann je Anlage eine kurze Karte mit kleinen Logos. Seit MC7d13d (Elias nach dem Livegang, Vault
 * `raw/2026-10-31-elias-mc7d13c-liste-live-feedback-top3-unten.md`): kein roter Kasten mehr, nach den Aktien-ETFs die
 * Top 3 Depots wie im XXL-Guide, der Kasten „Dein nächster Schritt“ ganz unten, kein Krypto-Aufruf. Die Karte führt
 * auf die Anlage-Seite, dort stehen die Depots mit Knopf; zurück landet der Leser an seiner Stelle. „Alle Listen“,
 * Spickzettel und Anmeldeformular sind weg (Plan MC7D11, Baustein 3); der PDF-Knopf ist seit MC7d15 zurück, das PDF ist
 * diese Seite im Handy-Maß (`src/data/freebiePdfs.ts`). Seit MC7d15 ohne Stufen-Zähler, Depot-Zahl, Kosten, Gold-Hinweis, Krypto und
 * Einzelaktien-Satz: nach den Anlagen gleich der Kasten (Elias, 01.11.2026, Vault `raw/2026-11-01-elias-mc7d15-feedback-alle-freebies.md`). Nur über die Danke-Seite und den Link aus der Mail (noindex,
 * nicht in der Sitemap).
 */
const freebie = optinFreebie("halal-anlagen")!;
const pfad = vollPfad(freebie);
/** Datum jedes Einzelbelegs, nicht das Datum des Datenstands (Gegenlese 27.09.2026). */
const staende = [...new Set(kaufZeilen.flatMap((z) => z.kaufbar.kaufbar.map((k) => k.beleg.stand)))].sort(
  (a, b) => Number(a.split(".").reverse().join("")) - Number(b.split(".").reverse().join("")),
);
/**
 * Wo der Leser stand, als er auf eine Karte tippte: welche Karte und wie weit sie von der Oberkante entfernt war.
 * Beim Zurück öffnet die Seite die Gruppe der Karte wieder („8 weitere anzeigen“) und stellt die Karte an dieselbe
 * Stelle (Seiten-Prüfer r4, Muss: vorher war die Gruppe zu und nur scrollY gemerkt).
 */
const STELLE = "liste-stelle";
const merken = (slug: string, el: HTMLElement) => {
  try {
    sessionStorage.setItem(STELLE, JSON.stringify({ slug, abstand: el.getBoundingClientRect().top }));
  } catch {
    /* ohne sessionStorage beginnt die Liste oben */
  }
};

/** Der Depot-Aufruf nach den Aktien-ETFs: erst reinlesen, dann kaufen (Elias, 31.10.2026, MC7d13c). */
const TopDrei = () => (
  <section className="reveal mt-10" aria-labelledby="wo">
    <DepotAufruf titel={DEPOT_TITEL} link={listeLink} />
  </section>
);

const HalalAnlagenVoll = () => {
  const navigation = useNavigationType();
  // Zurück von einer Anlage-Seite: an die Stelle der Karte, nicht nach oben (Elias, 31.10.2026: „nicht hin und her“).
  useEffect(() => {
    let stelle: { slug: string; abstand: number } | null = null;
    try {
      const wert = sessionStorage.getItem(STELLE);
      sessionStorage.removeItem(STELLE);
      if (navigation === "POP" && wert) stelle = JSON.parse(wert);
    } catch {
      /* ohne sessionStorage beginnt die Liste oben */
    }
    if (!stelle) return;
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
    const karte = document.querySelector<HTMLElement>(`[data-karte="${CSS.escape(stelle.slug)}"]`);
    const gruppe = karte?.closest("details");
    if (gruppe) gruppe.open = true;
    // „instant“, weil html auf scroll-behavior: smooth steht und die Liste sonst sichtbar von oben durchläuft (Seiten-Prüfer r5).
    const hin = () =>
      karte &&
      window.scrollTo({ top: karte.getBoundingClientRect().top + window.scrollY - stelle!.abstand, behavior: "instant" });
    // Erst nach dem Aufklappen und noch einmal, wenn Logos und Schrift die Höhen verschoben haben.
    let f = requestAnimationFrame(() => (f = requestAnimationFrame(hin)));
    const t = window.setTimeout(hin, 300);
    return () => {
      cancelAnimationFrame(f);
      window.clearTimeout(t);
    };
  }, [navigation]);

  // Sanftes Einblenden beim Scrollen wie im Portfolio-Plan.
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
    <main className="bg-background" data-freebie="anlagen-liste" data-vorlage="halal-anlagen">
      <Seo
        title="Die Halal-Investment-Liste: jede Anlage mit dem Stand ihrer Prüfung | finanzmuslim"
        description={`${kaufZeilen.length} Anlagen im Depot: je Anlage, was zu ihrer Prüfung belegt ist, und in welchen Depots du sie kaufst.`}
        path={pfad}
        noindex
      />

      <div className="container max-w-2xl py-8 md:py-12">
        <header className="rounded-lg border border-border bg-card p-6 md:p-8">
          <h1 className="text-[30px] font-extrabold leading-[1.1] text-foreground md:text-[38px]">
            Die Halal-<span className="whitespace-nowrap">Investment-Liste</span>
          </h1>
          <nav aria-label="Was es gibt" className="mt-5 flex flex-wrap gap-1.5">
            {UEBERBLICK.map((u) => (
              <a
                key={u.id}
                href={`#gruppe-${u.id}`}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-white px-3 text-[14px] font-semibold text-foreground ring-1 ring-black/5"
              >
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: artFarbe(u.id) }} aria-hidden />
                <span className="font-extrabold tabular-nums">{u.zahl}</span> {u.wort}
              </a>
            ))}
          </nav>
          {/* Kein PDF-Knopf mehr (Elias, 02.11.2026, MC7f: „diese PDF-Option rauslassen. Bei den anderen Freebies“; nur die Duas). */}
        </header>
        <p className="mt-2 px-2 text-[12px] text-muted-foreground">Eine Übersicht, keine Anlageberatung.</p>

        {listenGruppen.map((g) => (
          <section
            key={g.kategorie}
            id={`gruppe-${g.kategorie}`}
            className="reveal mt-12 scroll-mt-20"
            aria-labelledby={`titel-${g.kategorie}`}
          >
            <h2
              id={`titel-${g.kategorie}`}
              className="flex items-center gap-2.5 text-[24px] font-extrabold leading-tight text-foreground"
            >
              <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: artFarbe(g.kategorie) }} aria-hidden />
              {g.titel.split(",")[0]}
            </h2>
            {g.titel.includes(",") && (
              <p className="mt-1 text-[16px] leading-snug text-foreground/80">
                {g.titel.split(", ")[1].replace(/^./, (c) => c.toUpperCase())}
              </p>
            )}
            <ul className="mt-4 grid gap-2">
              {g.zeilen.slice(0, SICHTBAR).map((z) => (
                <AnlageKarte key={z.anlage.slug} z={z} href={listeLink(`/halal-anlagen/${z.anlage.slug}`, "karte")} onTippen={(el) => merken(z.anlage.slug, el)} />
              ))}
            </ul>
            {g.zeilen.length > SICHTBAR && (
              <details className="group mt-2">
                <summary className="flex min-h-[44px] cursor-pointer list-none items-center gap-2 rounded-lg px-1 text-[16px] font-semibold text-primary [&::-webkit-details-marker]:hidden">
                  {g.zeilen.length - SICHTBAR} weitere anzeigen
                  <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" aria-hidden />
                </summary>
                <ul className="mt-2 grid gap-2">
                  {g.zeilen.slice(SICHTBAR).map((z) => (
                    <AnlageKarte key={z.anlage.slug} z={z} href={listeLink(`/halal-anlagen/${z.anlage.slug}`, "karte")} onTippen={(el) => merken(z.anlage.slug, el)} />
                  ))}
                </ul>
              </details>
            )}
            {g.kategorie === "aktien" && <TopDrei />}
          </section>
        ))}

        <NaechsterTeil wort="liste" className="mt-12" />

        <footer className="mt-12 space-y-2 border-t border-border pt-6 text-[12px] leading-relaxed text-muted-foreground">
          <p>Alle Zahlen stammen aus meinen Vergleichen.</p>
          <p>
            {staende.length === 1
              ? `Kaufbelege vom ${staende[0]}.`
              : `Kaufbelege vom ${staende[0]} bis ${staende[staende.length - 1]}.`}
          </p>
          {ohneBeleg.length > 0 && (
            <p>Mit Prüfung, aber ohne Kaufbeleg und darum nicht in der Liste: {ohneBeleg.map((a) => a.name).join(", ")}.</p>
          )}
          <p>{ANLAGEN_QUELLEN}</p>
          <p>{ANLAGEN_RECHTSHINWEIS}</p>
        </footer>
      </div>
    </main>
  );
};

export default HalalAnlagenVoll;
