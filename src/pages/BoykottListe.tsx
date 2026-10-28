import { Fragment, useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import Seo from "@/components/Seo";
import FindeDeinAngebot from "@/components/FindeDeinAngebot";
import AnbieterLogo from "@/components/AnbieterLogo";
import { logosFuer } from "@/lib/anbieterLogos";
import { DEPOT_LOGOS } from "@/data/portfolioPlan";
import {
  AUCH_GENANNT,
  BOYKOTT_PFAD,
  BOYKOTT_SCHLUESSEL,
  BOYKOTT_STAND,
  IM_INDEX,
  INDEX_STAND,
  VERSTECKT,
  WARE,
  alleFirmen,
  artVon,
  bereiche,
  boykottLink,
  boykottQuellen,
  euroVon100,
  type BoykottFirma,
} from "@/data/boykottListe";

/**
 * /deine-boykottliste/<schluessel>: die Boykott-Liste, das Freebie zum Wort „Boykott“ (BK1).
 *
 * Aufbau wie Fassung 5 des Portfolio-Plans (src/pages/PortfolioPlan.tsx, Elias, 28.10.2026: „in dem
 * stil alle anderen auch“): oben ein roter Schmerz mit kleinen Logos, die Firmen als kurze Karten
 * nach Alltag geordnet, in der Mitte das Gleiche bei Aktien mit dem Aufruf zum Depot-Vergleich
 * (Bauplan: bei Listen in die Mitte, weil viele direkt zur Liste scrollen). Kein Hinweis auf ein
 * anderes Freebie. Versteckt: noindex, nicht in der Sitemap, aber vorgerendert (routen.ts).
 */

const Pille = ({ f }: { f: BoykottFirma }) =>
  artVon(f) === "boykott" ? (
    <span className="rounded-full bg-loss-soft px-2 py-0.5 text-[12px] font-bold text-loss">Boykott</span>
  ) : (
    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[12px] font-bold text-amber-700 ring-1 ring-amber-200">
      Meiden, wo es geht
    </span>
  );

const Karte = ({ f }: { f: BoykottFirma }) => (
  <div className="card-surface p-4">
    <div className="flex items-center gap-3">
      <AnbieterLogo name={f.name} domain={f.domain} />
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[16px] font-bold leading-tight text-foreground">
          {f.name}
          <Pille f={f} />
        </p>
        <p className="mt-0.5 text-[14px] leading-snug text-muted-foreground">{f.alltag}</p>
      </div>
    </div>
    <p className="mt-2 text-[16px] leading-snug text-foreground/80">{f.grund}</p>
    {f.hinweis && <p className="mt-2 rounded-xl bg-accent px-3 py-2 text-[14px] leading-snug text-foreground">{f.hinweis}</p>}
  </div>
);

const Bereich = ({ id, titel, firmen }: { id: string; titel: string; firmen: BoykottFirma[] }) => (
  <section className="reveal mt-12" aria-labelledby={`bereich-${id}`}>
    <p className="text-[14px] font-bold text-violet">{firmen.length} Firmen</p>
    <h2 id={`bereich-${id}`} className="mt-1 text-[24px] font-extrabold text-foreground">
      {titel}
    </h2>
    <div className="mt-4 grid gap-3">
      {firmen.map((f) => (
        <Karte key={f.name} f={f} />
      ))}
    </div>
  </section>
);

const Boerse = () => (
  <section className="reveal mt-12" aria-labelledby="boerse">
    <p className="text-[14px] font-bold text-violet">Auch bei Aktien</p>
    <h2 id="boerse" className="mt-1 text-[24px] font-extrabold text-foreground">
      Dein Geld an der Börse
    </h2>
    <p className="mt-2 text-[20px] font-extrabold leading-tight text-foreground">
      Halal heißt nicht automatisch boykottfrei.
    </p>
    <div className="mt-3 grid grid-cols-2 gap-2">
      {IM_INDEX.map((i) => (
        <div
          key={i.name}
          className={`rounded-2xl p-4 ring-1 ${i.ton === "rot" ? "bg-loss-soft ring-loss/20" : "bg-amber-50 ring-amber-200"}`}
        >
          <p className="text-[14px] font-bold leading-tight text-foreground">{i.name}</p>
          <p className="mt-3 text-[14px] font-bold leading-none text-foreground">von 100&nbsp;€ gehen</p>
          <p
            className={`mt-1 whitespace-nowrap text-[26px] font-extrabold leading-none tabular-nums ${i.ton === "rot" ? "text-loss" : "text-amber-700"}`}
          >
            {euroVon100(i.gewichte)}&nbsp;€
          </p>
          <p className="mt-1 text-[14px] leading-snug text-muted-foreground">
            allein an {Object.keys(i.gewichte).map((n) => n.split(" (")[0]).join(", ").replace(/, ([^,]*)$/, " und $1")}
          </p>
        </div>
      ))}
    </div>
    <p className="mt-2 px-1 text-[12px] leading-snug text-muted-foreground">
      Gewichte der Indizes vom {INDEX_STAND}, gerundet.
    </p>
    <FindeDeinAngebot
      className="mt-4"
      titel="So investierst du halal"
      text="Ich habe die Depots gerankt: welche zinsfrei sind. Dort entscheidest du selbst, welche Firmen dein Geld bekommen."
      knopf="Zum Depot-Vergleich"
      logos={[...DEPOT_LOGOS]}
      gesamt={logosFuer("Depot").gesamt}
      ziel={boykottLink("/vergleich/depot", "mitte")}
    />
  </section>
);

const BoykottListe = () => {
  const { schluessel } = useParams();

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

  if (schluessel !== BOYKOTT_SCHLUESSEL) return <Navigate to="/halal-guide" replace />;

  return (
    <main className="bg-background" data-freebie="boykott-liste">
      <Seo
        title="Die Boykott-Liste | finanzmuslim"
        description={`Sieh, welche ${alleFirmen.length} Firmen aus deinem Alltag auf der Boykott-Liste stehen: mit Marken, Grund und dem Blick auf dein Depot.`}
        path={BOYKOTT_PFAD}
        noindex
      />

      <div className="container max-w-2xl py-8 md:py-12">
        <header className="rounded-3xl bg-hero p-6 md:p-8">
          <h1 className="text-[30px] font-extrabold leading-[1.1] text-foreground md:text-[38px]">
            Die Boykott-Liste: {alleFirmen.length} Firmen aus deinem Alltag
          </h1>
          <p className="mt-3 text-[16px] leading-snug text-foreground/80">
            Von der offiziellen Liste der BDS-Bewegung, Stand {BOYKOTT_STAND}.
          </p>
          <div className="mt-4 flex gap-3 rounded-2xl bg-loss-soft p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-loss" aria-hidden />
            <div>
              <p className="text-[16px] font-semibold leading-snug text-foreground">
                Viele Marken gehören zu einem Konzern auf der Liste, ohne dass man es sieht.
              </p>
              <div className="mt-1.5 flex items-center gap-2">
                <span className="flex gap-1">
                  {VERSTECKT.map((v) => (
                    <AnbieterLogo key={v.name} name={v.name} domain={v.domain} klein />
                  ))}
                </span>
                <span className="text-[12px] text-muted-foreground">
                  {VERSTECKT.map((v) => `${v.name} gehört zu ${v.konzern}`).join(", ")}
                </span>
              </div>
            </div>
          </div>
        </header>
        <p className="mt-2 px-2 text-[12px] text-muted-foreground">
          Rot heißt Boykott, gelb heißt meiden, wo es eine Alternative gibt. So teilt es die BDS-Bewegung ein.
        </p>

        {bereiche.map((b) => (
          <Fragment key={b.id}>
            <Bereich id={b.id} titel={b.titel} firmen={b.firmen} />
            {b.id === "technik" && <Boerse />}
          </Fragment>
        ))}

        <section className="reveal mt-12" aria-labelledby="ware">
          <h2 id="ware" className="text-[24px] font-extrabold text-foreground">
            Dazu im Supermarkt
          </h2>
          <div className="card-surface mt-4 p-4">
            <p className="flex flex-wrap items-center gap-x-2 text-[16px] font-bold text-foreground">
              {WARE.name}
              <span className="rounded-full bg-loss-soft px-2 py-0.5 text-[12px] font-bold text-loss">Boykott</span>
            </p>
            <p className="mt-0.5 text-[14px] text-muted-foreground">{WARE.alltag}</p>
            <p className="mt-2 text-[16px] leading-snug text-foreground/80">{WARE.grund}</p>
          </div>
          <div className="mt-3 flex items-center gap-3 rounded-2xl bg-muted/60 p-4">
            <AnbieterLogo name={AUCH_GENANNT.name} domain={AUCH_GENANNT.domain} />
            <p className="text-[14px] leading-snug text-foreground/80">
              <span className="font-bold text-foreground">{AUCH_GENANNT.name}: </span>
              {AUCH_GENANNT.satz}
            </p>
          </div>
          <p className="mt-6 px-1 text-[16px] leading-snug text-foreground/80">
            Schon ein Depot?{" "}
            <Link to={boykottLink("/vergleich/depot", "ende")} className="font-semibold text-primary hover:underline">
              Prüf, ob deins Zinsen zahlt
            </Link>
          </p>
        </section>

        <footer className="mt-12 space-y-2 border-t border-border pt-6 text-[12px] leading-relaxed text-muted-foreground">
          <p>Die Liste und jeder Grund geben die Seite der BDS-Bewegung wieder, kein eigenes Urteil.</p>
          <p>Keine Anlageberatung. Persönliche Anlageberatung braucht in Deutschland eine Zulassung.</p>
          <p>Quellen:</p>
          <ul className="space-y-1">
            {boykottQuellen.map((q) => (
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

export default BoykottListe;
