import { useEffect } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, AlertTriangle, ArrowDown, ArrowRight, CheckCircle2, ChevronDown, CircleDot } from "lucide-react";
import Seo from "@/components/Seo";
import NaechsterTeil from "@/components/NaechsterTeil";
import { NAECHSTE_FRAGE } from "@/data/leiter";
import AnbieterLogo from "@/components/AnbieterLogo";
import { AnlageLogo } from "@/components/AnlageZeile";
import { ANLAGEN_QUELLEN, ANLAGEN_RECHTSHINWEIS, artFarbe } from "@/components/vorlagen/anlagenTeile";
import { optinFreebie, vollPfad } from "@/data/optin";
import { kaufZeilen, type KaufZeile } from "@/data/halalAnlagenKauf";
import { DEPOTS_GEPRUEFT, ETF_ZAHL } from "@/data/etfPlan";
import {
  ANZAHL_DEPOT,
  BEKANNTE_DEPOTS,
  SCHMERZ_SATZ,
  SICHTBAR,
  STUFEN_ZAHL,
  UEBERBLICK,
  depotZahl,
  kartenLogos,
  krypto,
  listeLink,
  listenGruppen,
  nachweis,
  ohneBeleg,
  KRYPTO_PRUEFER,
  type Stufe,
} from "@/data/anlagenListe";

/**
 * Die volle Liste „Halal-Anlagen“, das Freebie zum Wort „Liste“. Seit MC7d13 (31.10.2026) im Stil von
 * Fassung 5 des Portfolio-Plans: oben die Frage und was es gibt, ein roter Schmerz (nicht jedes Depot hat
 * sie), dann je Anlage eine kurze Karte mit kleinen Logos, nicht anklickbar. Wege raus sind nur die
 * Vergleiche und der Kasten; PDF-Knopf, „Alle Listen“, Spickzettel und Anmeldeformular sind weg (Plan
 * MC7D11, Baustein 3). Nur über die Danke-Seite und den Link aus der Mail (noindex, nicht in der Sitemap).
 */
const freebie = optinFreebie("halal-anlagen")!;
const pfad = vollPfad(freebie);
/** Datum jedes Einzelbelegs, nicht das Datum des Datenstands (Gegenlese 27.09.2026). */
const staende = [...new Set(kaufZeilen.flatMap((z) => z.kaufbar.kaufbar.map((k) => k.beleg.stand)))].sort(
  (a, b) => Number(a.split(".").reverse().join("")) - Number(b.split(".").reverse().join("")),
);
/** Ein Zeichen je Stufe: wie jung der gelesene Nachweis ist, nie ein eigenes Urteil. */
const STUFE: Record<Stufe, { Icon: typeof CheckCircle2; farbe: string; wort: string }> = {
  aktuell: {
    Icon: CheckCircle2,
    farbe: "text-gain",
    wort: "mit Zertifikat oder Prüfbericht von 2025 oder 2026",
  },
  prospekt: {
    Icon: CircleDot,
    farbe: "text-primary",
    wort: "mit Prüfstelle laut Prospekt oder geprüftem Index",
  },
  aelter: {
    Icon: AlertCircle,
    farbe: "text-warning",
    wort: "mit letztem Nachweis vor 2024",
  },
};

const Karte = ({ z }: { z: KaufZeile }) => {
  const logos = kartenLogos(z);
  const n = nachweis(z);
  const { Icon, farbe } = STUFE[n.stufe];
  return (
    <li className="card-surface p-4">
      <div className="flex items-start gap-3">
        <AnlageLogo a={z.anlage} />
        <div className="min-w-0">
          <p className="text-[16px] font-bold leading-snug text-foreground">{z.anlage.name}</p>
          <p className="mt-1 flex items-center gap-1.5 text-[13px] leading-snug text-foreground/80">
            <Icon className={`h-4 w-4 shrink-0 ${farbe}`} aria-hidden />
            {n.text}
          </p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <span className="flex gap-1">
          {logos.map((d) => (
            <AnbieterLogo key={d.id} name={d.name} domain={d.domain} klein />
          ))}
        </span>
        <span className="flex-1 whitespace-nowrap text-[12px] text-muted-foreground">
          {depotZahl(z)} von {DEPOTS_GEPRUEFT.length} Depots
        </span>
        <span className="whitespace-nowrap text-[12px] tabular-nums text-muted-foreground">{z.anlage.kostenLabel} im Jahr</span>
      </div>
    </li>
  );
};

const HalalAnlagenVoll = () => {
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
        title="Was kann ich halal kaufen? Jede Anlage mit dem Stand ihrer Prüfung | finanzmuslim"
        description={`${kaufZeilen.length} Anlagen im Depot: je Anlage, was die Prüfstelle bestätigt hat und in welchen Depots du sie kaufst.`}
        path={pfad}
        noindex
      />

      <div className="container max-w-2xl py-8 md:py-12">
        <header className="rounded-3xl bg-hero p-6 md:p-8">
          <h1 className="text-[30px] font-extrabold leading-[1.1] text-foreground md:text-[38px]">
            Was kann ich überhaupt halal kaufen?
          </h1>
          <p className="mt-4 text-[16px] font-semibold text-foreground">
            {ANZAHL_DEPOT} Anlagen, die du im Depot kaufen kannst. Bei jeder steht, was belegt ist.
          </p>
          <nav aria-label="Was es gibt" className="mt-3 flex flex-wrap gap-1.5">
            {UEBERBLICK.map((u) => (
              <a
                key={u.id}
                href={`#gruppe-${u.id}`}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-2xl bg-white px-3 text-[14px] font-semibold text-foreground ring-1 ring-black/5"
              >
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: artFarbe(u.id) }} aria-hidden />
                <span className="font-extrabold tabular-nums">{u.zahl}</span> {u.wort}
              </a>
            ))}
          </nav>
          <ul aria-label="Was geprüft ist" className="mt-5 space-y-1.5">
            {STUFEN_ZAHL.map(({ stufe, zahl }) => {
              const { Icon, farbe, wort } = STUFE[stufe];
              return (
                <li key={stufe} className="flex items-center gap-2 text-[14px] leading-snug text-foreground">
                  <Icon className={`h-4 w-4 shrink-0 ${farbe}`} aria-hidden />
                  <span>
                    <span className="font-extrabold tabular-nums">{zahl}</span> {wort}
                  </span>
                </li>
              );
            })}
          </ul>
        </header>
        <p className="mt-2 px-2 text-[12px] text-muted-foreground">Eine Übersicht, keine Anlageberatung.</p>

        <section className="reveal mt-10" aria-labelledby="wo">
          <h2 id="wo" className="text-[24px] font-extrabold text-foreground">
            Wo bekomme ich sie?
          </h2>
          <div className="mt-4 flex gap-3 rounded-2xl bg-loss-soft p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-loss" aria-hidden />
            <div>
              <p className="text-[16px] font-semibold leading-snug text-foreground">{SCHMERZ_SATZ}</p>
              <ul className="mt-3 space-y-1.5">
                {BEKANNTE_DEPOTS.map((d) => (
                  <li key={d.id} className="flex items-center gap-2 text-[14px] text-foreground">
                    <AnbieterLogo name={d.name} domain={d.domain} klein />
                    <span className="flex-1">{d.name}</span>
                    <span className="tabular-nums">
                      {d.zahl < ETF_ZAHL && <span className="text-[12px] font-semibold">nur </span>}
                      <span className="font-bold">
                        {d.zahl} von {ETF_ZAHL}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                to={listeLink("/vergleich/depot", "schmerz")}
                className="mt-2 inline-flex min-h-[44px] items-center gap-1 text-[16px] font-semibold text-primary hover:underline"
              >
                Alle Depots im Vergleich
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
          <a
            href="#naechster-teil"
            className="mt-3 flex min-h-[44px] items-center gap-2 px-1 text-[16px] font-semibold text-primary hover:underline"
          >
            {NAECHSTE_FRAGE.liste.frage} Steht ganz unten.
            <ArrowDown className="h-4 w-4 shrink-0" aria-hidden />
          </a>
        </section>

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
                <Karte key={z.anlage.slug} z={z} />
              ))}
            </ul>
            {g.zeilen.length > SICHTBAR && (
              <details className="group mt-2">
                <summary className="flex min-h-[44px] cursor-pointer list-none items-center gap-2 rounded-2xl px-1 text-[16px] font-semibold text-primary [&::-webkit-details-marker]:hidden">
                  {g.zeilen.length - SICHTBAR} weitere anzeigen
                  <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" aria-hidden />
                </summary>
                <ul className="mt-2 grid gap-2">
                  {g.zeilen.slice(SICHTBAR).map((z) => (
                    <Karte key={z.anlage.slug} z={z} />
                  ))}
                </ul>
              </details>
            )}
            {g.kategorie === "gold" && (
              <p className="mt-3 px-1 text-[14px] leading-snug text-muted-foreground">
                Beim Gold haben Invesco und WisdomTree ein Shariah-Zertifikat für das Produkt selbst. Währungsgesicherte Varianten
                stehen nicht in der Liste.
              </p>
            )}
          </section>
        ))}

        <section id="gruppe-krypto" className="reveal mt-12 scroll-mt-20" aria-labelledby="titel-krypto">
          <h2 id="titel-krypto" className="flex items-center gap-2.5 text-[24px] font-extrabold leading-tight text-foreground">
            <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: artFarbe("krypto") }} aria-hidden />
            Krypto gibt es an Börsen
          </h2>
          <div className="mt-4 card-surface p-4">
            <div className="flex flex-wrap items-center gap-2">
              {krypto.map((a) => (
                <span
                  key={a.slug}
                  className="flex items-center gap-2 rounded-full bg-accent py-1 pl-1 pr-3 text-[14px] font-semibold text-foreground"
                >
                  <AnlageLogo a={a} />
                  {a.name}
                </span>
              ))}
            </div>
            <p className="mt-3 text-[16px] leading-snug text-foreground/80">Nicht im Depot, sondern an einer Krypto-Börse.</p>
            <p className="mt-2 text-[12px] leading-snug text-muted-foreground">
              Vorläufige Einschätzung des {KRYPTO_PRUEFER}, nach eigener Aussage keine Fatwa.
            </p>
            <Link
              to={listeLink("/vergleich/krypto", "krypto")}
              className="mt-2 inline-flex min-h-[44px] items-center gap-1 text-[16px] font-semibold text-primary hover:underline"
            >
              Krypto-Börsen im Vergleich
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          <p className="mt-4 px-1 text-[14px] leading-snug text-muted-foreground">
            Einzelaktien stehen nicht in der Liste: Jede muss einzeln und immer wieder geprüft werden.
          </p>
        </section>

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
