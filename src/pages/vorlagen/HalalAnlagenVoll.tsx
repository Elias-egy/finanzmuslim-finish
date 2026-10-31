import { useEffect } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, ArrowRight } from "lucide-react";
import Seo from "@/components/Seo";
import NaechsterTeil from "@/components/NaechsterTeil";
import AnbieterLogo from "@/components/AnbieterLogo";
import { AnlageLogo } from "@/components/AnlageZeile";
import { ANLAGEN_QUELLEN, ANLAGEN_RECHTSHINWEIS, artFarbe } from "@/components/vorlagen/anlagenTeile";
import { optinFreebie, vollPfad } from "@/data/optin";
import { kaufZeilen, type KaufZeile } from "@/data/halalAnlagenKauf";
import { DEPOTS_MIT_ALLEN } from "@/data/etfPlan";
import {
  ANZAHL_DEPOT,
  SCHMERZ_SATZ,
  UEBERBLICK,
  kartenLogos,
  kaufGruppen,
  krypto,
  listeLink,
  ohneBeleg,
  KRYPTO_PRUEFER,
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
const aktien = UEBERBLICK.find((u) => u.id === "aktien");

const Karte = ({ z }: { z: KaufZeile }) => {
  const logos = kartenLogos(z);
  return (
    <li className="card-surface p-4">
      <div className="flex items-center gap-3">
        <AnlageLogo a={z.anlage} />
        <div className="min-w-0">
          <p className="text-[16px] font-bold leading-snug text-foreground">{z.anlage.name}</p>
          <p className="mt-0.5 text-[12px] leading-snug text-muted-foreground">{z.anlage.zertifizierer}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <span className="flex gap-1">
          {logos.map((d) => (
            <AnbieterLogo key={d.id} name={d.name} domain={d.domain} klein />
          ))}
        </span>
        <span className="flex-1 text-[12px] text-muted-foreground">bei {z.kaufbar.kaufbar.length} Anbietern</span>
        <span className="text-[12px] tabular-nums text-muted-foreground">{z.anlage.kostenLabel} im Jahr</span>
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
        title="Halal-Anlagen: wo du jede kaufen kannst | finanzmuslim"
        description={`Finde alle ${kaufZeilen.length} Halal-Anlagen mit Kaufbeleg und die Anbieter, bei denen du sie kaufen kannst.`}
        path={pfad}
        noindex
      />

      <div className="container max-w-2xl py-8 md:py-12">
        <header className="rounded-3xl bg-hero p-6 md:p-8">
          <h1 className="text-[30px] font-extrabold leading-[1.1] text-foreground md:text-[38px]">
            Was kann ich überhaupt halal kaufen?
          </h1>
          <p className="mt-4 text-[16px] font-semibold text-foreground">
            {ANZAHL_DEPOT} Anlagen, die du im Depot kaufen kannst. Dazu {krypto.length} Coins.
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
          <p className="mt-5 text-[14px] leading-snug text-foreground/75">
            Schon mal vorab: Ich habe gerankt, wo du sie zinsfrei kaufst.{" "}
            <Link to={listeLink("/vergleich/depot", "oben")} className="font-semibold text-primary underline-offset-2 hover:underline">
              Zum Depot-Vergleich
            </Link>
          </p>
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
              <Link
                to={listeLink("/vergleich/depot", "schmerz")}
                className="mt-2 inline-flex min-h-[44px] items-center gap-1 text-[16px] font-semibold text-primary hover:underline"
              >
                {DEPOTS_MIT_ALLEN.length === 1 ? "Depot" : "Depots"} mit allen {aktien?.zahl} ansehen
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </section>

        {kaufGruppen.map((g) => (
          <section key={g.kategorie} id={`gruppe-${g.kategorie}`} className="reveal mt-12 scroll-mt-20" aria-labelledby={`titel-${g.kategorie}`}>
            <h2 id={`titel-${g.kategorie}`} className="flex items-center gap-2.5 text-[24px] font-extrabold leading-tight text-foreground">
              <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: artFarbe(g.kategorie) }} aria-hidden />
              {g.titel.split(",")[0]}
            </h2>
            {g.titel.includes(",") && (
              <p className="mt-1 text-[16px] leading-snug text-foreground/80">{g.titel.split(", ")[1].replace(/^./, (c) => c.toUpperCase())}</p>
            )}
            <ul className="mt-4 grid gap-2">
              {g.zeilen.map((z) => (
                <Karte key={z.anlage.slug} z={z} />
              ))}
            </ul>
            {g.kategorie === "gold" && (
              <div className="mt-3 rounded-2xl bg-accent p-4">
                <p className="text-[14px] font-bold text-violet">Meine Einordnung</p>
                <p className="mt-1 text-[14px] leading-snug text-foreground/90">
                  Beim Gold sind Invesco und WisdomTree offiziell shariah-zertifiziert. Die Amanie-Zertifizierung von Invesco ordne
                  ich persönlich stärker ein als das Al-Qalam-Panel von WisdomTree. Lies beide Zertifikate und entscheide selbst.
                  Bewusst nicht in der Liste: währungsgesicherte Varianten, Hedged, denn die Absicherung läuft über Terminkontrakte.
                </p>
              </div>
            )}
          </section>
        ))}

        {ohneBeleg.length > 0 && (
          <p className="mt-3 px-1 text-[12px] leading-snug text-muted-foreground">
            Auch geprüft, aber ohne Kaufbeleg: {ohneBeleg.map((a) => a.name).join(", ")}. Prüfe in der Suche deines Depots, ob es
            sie führt.
          </p>
        )}

        <section id="gruppe-krypto" className="reveal mt-12 scroll-mt-20" aria-labelledby="titel-krypto">
          <h2 id="titel-krypto" className="flex items-center gap-2.5 text-[24px] font-extrabold leading-tight text-foreground">
            <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: artFarbe("krypto") }} aria-hidden />
            Krypto gibt es an Börsen
          </h2>
          <div className="mt-4 card-surface p-4">
            <div className="flex flex-wrap items-center gap-2">
              {krypto.map((a) => (
                <span key={a.slug} className="flex items-center gap-2 rounded-full bg-accent py-1 pl-1 pr-3 text-[14px] font-semibold text-foreground">
                  <AnlageLogo a={a} />
                  {a.name}
                </span>
              ))}
            </div>
            <p className="mt-3 text-[16px] leading-snug text-foreground/80">
              Die {krypto.length} Coins aus der Anlagen-Datenbank gibt es nicht im Depot, sondern an einer Krypto-Börse. Welche Börse
              echte Coins ohne Zins und Lending führt, steht im Vergleich.
            </p>
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
            Einzelaktien stehen bewusst nicht in dieser Liste. Sie müssen einzeln geprüft werden und danach regelmäßig erneut, denn
            niemand garantiert, dass ein Unternehmen dauerhaft halal bleibt.
          </p>
        </section>

        <NaechsterTeil wort="liste" className="mt-12" />

        <footer className="mt-12 space-y-2 border-t border-border pt-6 text-[12px] leading-relaxed text-muted-foreground">
          <p>Alle Zahlen stammen aus meinen Vergleichen.</p>
          <p>
            {staende.length === 1 ? `Kaufbelege vom ${staende[0]}.` : `Kaufbelege vom ${staende[0]} bis ${staende[staende.length - 1]}.`}
          </p>
          <p>{ANLAGEN_QUELLEN}</p>
          <p>{ANLAGEN_RECHTSHINWEIS}</p>
        </footer>
      </div>
    </main>
  );
};

export default HalalAnlagenVoll;
