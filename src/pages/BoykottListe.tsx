import { Fragment, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import Seo from "@/components/Seo";
import NaechsterTeil from "@/components/NaechsterTeil";
import CheckEinstieg from "@/components/CheckEinstieg";
import AnbieterLogo from "@/components/AnbieterLogo";
import {
  AUCH_GENANNT,
  BOYKOTT_PFAD,
  BOYKOTT_SCHLUESSEL,
  BOYKOTT_STAND,
  WARE,
  alleFirmen,
  artVon,
  bereiche,
  boykottQuellen,
  listenQuellen,
  type Alternative,
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
    <span className="rounded bg-loss-soft px-2 py-0.5 text-[12px] font-bold text-loss">Boykott</span>
  ) : (
    <span className="rounded bg-amber-50 px-2 py-0.5 text-[12px] font-bold text-amber-700 ring-1 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-500/30">
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
    {f.hinweis && <p className="mt-2 rounded-lg bg-accent px-3 py-2 text-[14px] leading-snug text-foreground">{f.hinweis}</p>}
  </div>
);

/** Alternativen wie die Beispiele in Fassung 5: heller Unterkasten mit Logo, nicht anklickbar. */
const AlternativenKasten = ({ alternativen }: { alternativen: Alternative[] }) => (
  <div className="mt-4 rounded-lg border border-border bg-card p-4" data-alternativen>
    <p className="text-[16px] font-bold text-foreground">Das geht stattdessen</p>
    <p className="text-[12px] text-muted-foreground">Steht auf keiner der geprüften Listen.</p>
    <ul className="mt-3 grid gap-3">
      {alternativen.map((a) => (
        <li key={a.name} className="flex items-center gap-3">
          <AnbieterLogo name={a.name} domain={a.domain} />
          <p className="min-w-0 text-[16px] leading-tight">
            <span className="font-bold text-foreground">{a.name}</span>
            <span className="block text-[14px] text-muted-foreground">statt {a.statt}</span>
          </p>
        </li>
      ))}
    </ul>
  </div>
);

const Bereich = ({ id, titel, firmen, alternativen }: { id: string; titel: string; firmen: BoykottFirma[]; alternativen: Alternative[] }) => (
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
    {alternativen.length > 0 && <AlternativenKasten alternativen={alternativen} />}
  </section>
);

/* RN16-41 (Elias: „dieses Haram ist nicht gleich Boykott und so, das kann alles weg. Also nur ein Call to Action“): Abschnitt Börse mit Gold-Aufruf und Sukuk-Link raus. */

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
        description={`Sieh, welche ${alleFirmen.length} Firmen aus deinem Alltag auf der Boykott-Liste stehen: mit Marken, Grund und Alternativen beim Anlegen.`}
        path={BOYKOTT_PFAD}
        noindex
      />

      <div className="container max-w-2xl py-8 md:py-12">
        <header className="rounded-lg border border-border bg-card p-6 md:p-8">
          <h1 className="text-[30px] font-extrabold leading-[1.1] text-foreground md:text-[38px]">
            Die Boykott-Liste: {alleFirmen.length} Firmen aus deinem Alltag
          </h1>
          <p className="mt-3 text-[16px] leading-snug text-foreground/80">
            Von der offiziellen Liste der BDS-Bewegung, Stand {BOYKOTT_STAND}.
          </p>
          {/* RN16-39 (Elias: „dieses viele Marken kann weg, dann kommt direkt Essen, Trinken“): der rote Kasten mit den versteckten Marken ist raus. */}
          {/* Kein PDF-Knopf mehr (Elias, 02.11.2026, MC7f: „diese PDF-Option rauslassen. Bei den anderen Freebies“; nur die Duas). */}
        </header>
        <p className="mt-2 px-2 text-[12px] text-muted-foreground">
          Rot heißt Boykott, gelb heißt meiden, wo es eine Alternative gibt. So teilt es die BDS-Bewegung ein.
        </p>

        {bereiche.map((b) => (
          <Fragment key={b.id}>
            <Bereich id={b.id} titel={b.titel} firmen={b.firmen} alternativen={b.alternativen} />
            {/* RN16-39 („dann die 4 Alternativen, Streaming und dann kommt direkt der Call to Action mit dem Match“): der große Kasten direkt nach Technik und Streaming */}
            {b.id === "technik" && (
              <CheckEinstieg quelle="boykottliste" className="mt-12" />
            )}
          </Fragment>
        ))}

        <section className="reveal mt-12" aria-labelledby="ware">
          <h2 id="ware" className="text-[24px] font-extrabold text-foreground">
            Dazu im Supermarkt
          </h2>
          <div className="card-surface mt-4 p-4">
            <p className="flex flex-wrap items-center gap-x-2 text-[16px] font-bold text-foreground">
              {WARE.name}
              <span className="rounded bg-loss-soft px-2 py-0.5 text-[12px] font-bold text-loss">Boykott</span>
            </p>
            <p className="mt-0.5 text-[14px] text-muted-foreground">{WARE.alltag}</p>
            <p className="mt-2 text-[16px] leading-snug text-foreground/80">{WARE.grund}</p>
          </div>
          <div className="mt-3 flex items-center gap-3 rounded-lg bg-muted/60 p-4">
            <AnbieterLogo name={AUCH_GENANNT.name} domain={AUCH_GENANNT.domain} />
            <p className="text-[14px] leading-snug text-foreground/80">
              <span className="font-bold text-foreground">{AUCH_GENANNT.name}: </span>
              {AUCH_GENANNT.satz}
            </p>
          </div>
        </section>

        {/* RN16-39 („unten auf der Liste kommt der Call to Action nochmal. Aber der untere … ein bisschen kleiner“): unten nur der kleine Kasten. */}
        <NaechsterTeil wort="boykott" className="mt-12" />

        <footer className="mt-12 space-y-2 border-t border-border pt-6 text-[12px] leading-relaxed text-muted-foreground">
          <p>Die Liste und die Gründe geben die Seite der BDS-Bewegung wieder, kein eigenes Urteil. Der Grund bei McDonald's stammt von Al Jazeera.</p>
          <p>
            Die Alternativen stehen auf keiner dieser Listen, Stand {BOYKOTT_STAND}:{" "}
            {listenQuellen.map((q, i) => (
              <Fragment key={q.url}>
                {i > 0 && ", "}
                <a href={q.url} className="underline underline-offset-2 hover:text-primary" rel="noopener noreferrer" target="_blank">
                  {q.titel}
                </a>
              </Fragment>
            ))}
            . Auch ihre bekannten Eigentümer stehen auf keiner davon. Ob ein Essen halal ist, sagt diese Seite nicht.
          </p>
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
