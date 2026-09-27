import { useState } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import { ArrowRight, Check, Instagram, Pause, Play, Scale, ShieldCheck } from "lucide-react";
import Seo from "@/components/Seo";
import AnbieterLogo from "@/components/AnbieterLogo";
import { Wordmark } from "@/components/Wordmark";
import eliasFreigestellt from "@/assets/elias-freigestellt.webp";
import { logosFuer, type LogoAnbieter } from "@/lib/anbieterLogos";
import { vorhabenListe } from "@/lib/optin";
import { anbieterZahl, instagramFollower, vergleichsSeiten } from "@/data/beweise";
import { optinFreebie, vollPfad } from "@/data/optin";
import type { DankeState } from "@/components/optin/OptinKarte";

/**
 * /danke/<freebie> (Baustein 30), Aufbau nach der SKAILE-Danke-Seite (Vault raw
 * 2026-09-26-doomscroll-web/bilder/skaile-danke-01 bis -04): tiefblaues Kopfband mit Porträt
 * und Logos am Netz, Pille mit „Direkt öffnen“, nächstes Angebot als Bühne („Teste dich“),
 * Beweisleiste, Laufband, drei Karten, Prüf-Block. Welches Element woher kommt, steht im Plan
 * `~/.claude/plans/shimmering-seeking-spindle.md`.
 *
 * Das Freebie ist sofort offen (Elias, 27.09.2026), aber nur mit dem Router-State aus der Karte.
 * Direkt aufgerufen gibt es keinen Link, nur den Hinweis aufs Postfach. Die Pille sagt allen
 * denselben Satz, damit niemand über eine fremde Adresse erfährt, ob sie schon bestätigt ist.
 */

const gross = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Anbieter-Logos am Netz: Partner zuerst, je Haus eines (`logosFuer`). */
const netzLogos = (): LogoAnbieter[] => {
  const alle = [...logosFuer("Depot").logos.slice(0, 5), ...logosFuer("Girokonto").logos.slice(0, 4)];
  const gesehen = new Set<string>();
  return alle.filter((a) => (gesehen.has(a.domain ?? a.name) ? false : (gesehen.add(a.domain ?? a.name), true))).slice(0, 8);
};

/** Lage der Logos im Kopfband in Prozent, links und rechts gespiegelt. Die äußeren nur ab md. */
const knoten = [
  { x: 7, y: 34, md: true },
  { x: 19, y: 72 },
  { x: 29, y: 24 },
  { x: 37, y: 60, md: true },
  { x: 63, y: 60, md: true },
  { x: 71, y: 24 },
  { x: 81, y: 72 },
  { x: 93, y: 34, md: true },
];
const MITTE = { x: 50, y: 17 };

const Kopfband = () => {
  const logos = netzLogos();
  return (
    <section aria-hidden className="relative h-[230px] overflow-hidden md:h-[320px]">
      {/* Der Verlauf endet zwei Pixel über der Unterkante, sonst blitzt an der Schnittkante
          des Bogens eine graue Linie durch. */}
      <span className="absolute inset-x-0 bottom-0.5 top-0 bg-[radial-gradient(120%_90%_at_50%_0%,#0B3FA8_0%,#07286E_45%,#041A4A_100%)]" />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {knoten.slice(0, logos.length).map((k, i) => (
          <line
            key={i}
            x1={MITTE.x}
            y1={MITTE.y}
            x2={k.x}
            y2={k.y}
            stroke="white"
            strokeOpacity="0.16"
            strokeWidth="0.25"
            vectorEffect="non-scaling-stroke"
            className={k.md ? "hidden md:block" : undefined}
          />
        ))}
        {knoten.slice(0, logos.length - 1).map((k, i) => {
          const n = knoten[i + 1];
          if (i === 3) return null;
          return (
            <line
              key={`n${i}`}
              x1={k.x}
              y1={k.y}
              x2={n.x}
              y2={n.y}
              stroke="white"
              strokeOpacity="0.08"
              strokeWidth="0.25"
              vectorEffect="non-scaling-stroke"
              className={k.md || n.md ? "hidden md:block" : undefined}
            />
          );
        })}
      </svg>

      <span
        className="absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-primary text-[26px] font-extrabold leading-none text-white shadow-[0_0_0_6px_rgba(255,255,255,0.08),0_0_48px_12px_rgba(82,142,255,0.55)] md:h-14 md:w-14"
        style={{ left: `${MITTE.x}%`, top: `${MITTE.y}%` }}
      >
        F
      </span>

      {logos.map((a, i) => (
        <span
          key={a.domain ?? a.name}
          className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/15 bg-white/10 p-1.5 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.5)] ${
            knoten[i].md ? "hidden md:block" : ""
          }`}
          style={{ left: `${knoten[i].x}%`, top: `${knoten[i].y}%` }}
        >
          <AnbieterLogo name={a.name} domain={a.domain} />
        </span>
      ))}

      <span className="absolute bottom-0 left-1/2 h-[260px] w-[340px] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(82,142,255,0.55),transparent)] md:h-[340px] md:w-[460px]" />
      <img
        src={eliasFreigestellt}
        alt=""
        fetchPriority="high"
        className="absolute bottom-0 left-1/2 z-10 h-[190px] w-auto max-w-none -translate-x-1/2 translate-y-6 md:h-[290px] md:translate-y-10"
      />
      <span className="absolute -bottom-12 left-1/2 z-20 h-24 w-[180%] -translate-x-1/2 rounded-[50%] bg-background md:-bottom-16 md:h-32 md:w-[140%]" />
    </section>
  );
};

/** Haupt-Knopf mit sichtbarer Unterkante wie bei SKAILE. */
const TestKnopf = ({ ziel, klein = false }: { ziel: string; klein?: boolean }) => (
  <Link
    to={ziel}
    className={`inline-flex items-center justify-center gap-2 rounded-xl bg-primary font-bold text-primary-foreground shadow-[0_5px_0_0_hsl(219_100%_36%),0_16px_30px_-14px_hsl(var(--primary)/0.8)] transition hover:bg-primary-hover active:translate-y-[3px] active:shadow-[0_2px_0_0_hsl(219_100%_36%)] ${
      klein ? "h-11 px-4 text-[15px]" : "h-14 w-full px-10 text-[18px] sm:w-auto"
    }`}
  >
    Jetzt testen
    {!klein && <ArrowRight className="h-5 w-5" aria-hidden />}
  </Link>
);

const Laufband = () => {
  const [pause, setPause] = useState(false);
  /* Jede Hälfte trägt die Liste zweimal, damit sie auch auf breiten Bildschirmen länger als
     der sichtbare Streifen ist und die Schleife ohne Lücke läuft. */
  const eintraege = (versteckt: boolean) =>
    [...vergleichsSeiten, ...vergleichsSeiten].map((v, i) => (
      <Link
        key={`${v.pfad}-${i}${versteckt ? "-2" : ""}`}
        to={v.pfad}
        tabIndex={versteckt || i >= vergleichsSeiten.length ? -1 : undefined}
        aria-hidden={versteckt || i >= vergleichsSeiten.length || undefined}
        className="inline-flex min-h-[44px] shrink-0 items-center px-5 text-[15px] font-semibold text-foreground/70 hover:text-primary"
      >
        {v.name}
      </Link>
    ));
  return (
    <section className="border-y border-border bg-card">
      <div className="container flex items-center gap-3 py-2">
        <span className="shrink-0 text-[13px] font-semibold text-muted-foreground">Vergleiche für</span>
        <div className="relative min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
          <div className="laufband flex w-max" data-pause={pause}>
            <div className="flex">{eintraege(false)}</div>
            <div className="flex" aria-hidden>
              {eintraege(true)}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setPause((p) => !p)}
          aria-label={pause ? "Laufband starten" : "Laufband anhalten"}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          {pause ? <Play className="h-4 w-4" aria-hidden /> : <Pause className="h-4 w-4" aria-hidden />}
        </button>
      </div>
    </section>
  );
};

const Vorschau = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-44 items-center justify-center rounded-2xl border border-primary/20 bg-accent p-2">{children}</div>
);

const Danke = () => {
  const { freebie: id } = useParams();
  const { state } = useLocation() as { state: DankeState | null };
  const freebie = optinFreebie(id);
  if (!freebie) return <Navigate to="/vorlagen" replace />;

  const ausKarte = !!state;
  const vorhaben = state?.vorhaben?.length ? `?vorhaben=${vorhabenListe(state.vorhaben)}` : "";
  const ziel = `/vergleich/start${vorhaben}`;
  const logos = logosFuer("Depot").logos.slice(0, 3);

  const karten = [
    {
      titel: "Anbieter, die passen",
      text: (
        <>
          Sieh aus <strong>{anbieterZahl} Anbietern</strong> die, die zu deinem Vorhaben passen.
        </>
      ),
      vorschau: (
        <div className="w-full max-w-[220px] space-y-1.5">
          {logos.map((a, i) => (
            <div key={a.name} className="flex items-center gap-2 rounded-xl bg-card p-1 shadow-sm">
              <AnbieterLogo name={a.name} domain={a.domain} />
              <span className="h-2 flex-1 rounded-full bg-primary/15">
                <span className="block h-2 rounded-full bg-primary/60" style={{ width: `${85 - i * 20}%` }} />
              </span>
            </div>
          ))}
        </div>
      ),
    },
    {
      titel: "Jeder Anbieter eingeordnet",
      text: (
        <>
          Prüfe jeden Anbieter nach <strong>drei Regeln</strong>: ohne Zinsen, Halal-Merkmale, Kosten.
        </>
      ),
      vorschau: (
        <div className="flex flex-col items-start gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gain-soft px-3 py-1 text-[13px] font-semibold text-gain">
            <Check className="h-3.5 w-3.5" aria-hidden /> Ohne Zinsen
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1 text-[13px] font-semibold text-primary">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden /> Halal-Merkmale
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1 text-[13px] font-semibold text-violet">
            <Scale className="h-3.5 w-3.5" aria-hidden /> Kosten
          </span>
        </div>
      ),
    },
    {
      titel: "Mit einem Klick loslegen",
      text: (
        <>
          Wechsle mit <strong>einem Klick</strong> zum Anbieter, wenn es passt.
        </>
      ),
      vorschau: logos[0] ? (
        <div className="flex w-full max-w-[220px] items-center gap-3 rounded-xl bg-card p-3 shadow-sm">
          <AnbieterLogo name={logos[0].name} domain={logos[0].domain} />
          <span className="flex-1 text-[14px] font-semibold text-foreground">{logos[0].name}</span>
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
            <ArrowRight className="h-4 w-4" aria-hidden />
          </span>
        </div>
      ) : null,
    },
  ];

  return (
    <div className="bg-background">
      <Seo
        title={ausKarte ? "Freigeschaltet | finanzmuslim" : "Schau in dein Postfach | finanzmuslim"}
        description="Öffne dein Freebie und finde, was zu dir passt."
        path={`/danke/${freebie.id}`}
        noindex
      />

      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" aria-label="finanzmuslim Startseite" className="inline-flex min-h-[44px] items-center">
            <Wordmark className="text-xl" />
          </Link>
          <TestKnopf ziel={ziel} klein />
        </div>
      </header>

      <Kopfband />

      <section className="container relative z-30 -mt-2 text-center md:-mt-4">
        <div
          role="status"
          className="mx-auto inline-flex max-w-full flex-wrap items-center justify-center gap-x-1.5 gap-y-0 rounded-2xl border border-gain/40 bg-card px-3 py-1 text-[14px] text-foreground sm:gap-x-2 sm:px-4 sm:text-[15px] shadow-[0_10px_30px_-18px_rgba(4,26,74,0.5)]"
        >
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gain text-white">
            <Check className="h-3.5 w-3.5" aria-hidden />
          </span>
          {ausKarte ? (
            <>
              <span>{gross(freebie.deinObjekt)} ist freigeschaltet.</span>
              <Link
                to={vollPfad(freebie, state?.stufe)}
                className="inline-flex min-h-[44px] items-center font-semibold text-primary underline underline-offset-2"
              >
                Direkt öffnen
              </Link>
            </>
          ) : (
            <span className="py-2.5">Schau in dein Postfach: Der Link kommt nach der Bestätigung.</span>
          )}
        </div>
        <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-muted-foreground">
          Bestätige kurz die Mail in deinem Postfach, falls du neu bist: Dann kommt jeden Freitag der Freitagsbrief.
        </p>

        <p className="eyebrow mt-8">Teste dich</p>
        <h1 className="mt-2 text-[34px] font-bold leading-[1.1] tracking-tight text-foreground md:text-[52px]">
          Was passt <span className="text-primary">zu dir</span>?
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-[17px] leading-relaxed text-foreground/80 md:text-[19px]">
          Beantworte ein paar Fragen und sieh die <strong className="text-foreground">halal-tauglichen Anbieter</strong> für
          dein Geld.
        </p>
        <div className="mt-7">
          <TestKnopf ziel={ziel} />
        </div>
        <ul className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-1 text-[13px] text-muted-foreground">
          {["Kostenlos", "Ohne Anmeldung", "Halal eingeordnet"].map((c) => (
            <li key={c} className="inline-flex items-center gap-1.5">
              <Check className="h-4 w-4 text-primary" aria-hidden />
              {c}
            </li>
          ))}
        </ul>
      </section>

      <section className="container mt-12">
        <ul className="mx-auto grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-border">
          {[
            { icon: Instagram, zahl: `Über ${instagramFollower}`, text: "folgen auf Instagram" },
            { icon: Scale, zahl: `${anbieterZahl} Anbieter`, text: "verglichen und eingeordnet" },
            { icon: ShieldCheck, zahl: "100 Aktien", text: "auf Halal geprüft" },
          ].map((b) => (
            <li key={b.text} className="flex items-center justify-center gap-3 sm:px-4">
              <b.icon className="h-5 w-5 shrink-0 text-primary" aria-hidden />
              <p className="text-left">
                <span className="block text-[22px] font-bold leading-tight text-foreground">{b.zahl}</span>
                <span className="block text-[13px] text-muted-foreground">{b.text}</span>
              </p>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-10">
        <Laufband />
      </div>

      <section className="container py-12 md:py-16">
        <h2 className="text-center text-[28px] font-bold tracking-tight text-foreground md:text-[40px]">
          Was du <span className="text-primary">mitnimmst</span>
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-center text-[16px] leading-relaxed text-muted-foreground">
          Finde in wenigen Klicks die Anbieter, die zu dir passen.
        </p>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {karten.map((k, i) => (
            <div key={k.titel} className="card-surface p-5">
              <Vorschau>{k.vorschau}</Vorschau>
              <span className="mt-5 inline-flex h-8 min-w-[2rem] items-center justify-center rounded-lg border border-primary/20 bg-accent px-2 text-[13px] font-bold text-primary">
                0{i + 1}
              </span>
              <h3 className="mt-3 text-[19px] font-bold text-foreground">{k.titel}</h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground [&_strong]:text-foreground">{k.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-3xl border border-primary/15 border-l-4 border-l-primary bg-accent p-6 md:flex md:items-center md:justify-between md:gap-8 md:p-8">
          <div>
            <p className="eyebrow">So prüfen wir</p>
            <h2 className="mt-2 text-[24px] font-bold text-foreground md:text-[30px]">Drei Regeln je Anbieter</h2>
            <p className="mt-2 max-w-xl text-[16px] leading-relaxed text-foreground/80">
              Lies, wie wir Zinsen, Halal-Merkmale und Kosten gewichten.
            </p>
          </div>
          <Link
            to="/vergleiche/methodik"
            className="mt-4 inline-flex min-h-[44px] shrink-0 items-center gap-1.5 font-semibold text-primary hover:underline md:mt-0"
          >
            Zur Methodik
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <div className="mt-12 text-center">
          <TestKnopf ziel={ziel} />
          <p className="mt-3 text-[13px] text-muted-foreground">Kostenlos, ohne Anmeldung</p>
          <p className="mt-6">
            <Link to={freebie.seite} className="inline-flex min-h-[44px] items-center text-[15px] font-semibold text-primary hover:underline">
              Zurück zur Seite
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
};

export default Danke;
