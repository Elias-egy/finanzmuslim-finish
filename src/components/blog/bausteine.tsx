import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Check, ChevronDown, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { AnbieterLogo } from "@/components/AnbieterLogo";

/**
 * Bausteine aller Blogbeiträge im Aufbau von /blog/halal-etf (Elias SEO48, 04.11.2026: „beste Halal ETFs kannst du alles
 * so machen“, Vault raw/2026-11-04-elias-seo48-alle-beitraege-auf-halal-etf-niveau.md). Form und Maße wie in
 * src/pages/blog/HalalEtf.tsx; dort bleiben die Teile, die nur für die ETF-Liste gelten.
 */

export const SITE = "https://finanzmuslim.com";
export const INSTAGRAM = "https://www.instagram.com/finanz.muslim/";
export const YOUTUBE = "https://www.youtube.com/@finanz.muslim";
export const LINKEDIN = "https://www.linkedin.com/in/elias-el-gendy";
export const LINKEDIN_FIRMA = "https://www.linkedin.com/company/finanzmuslim";
export const PROFILE = [INSTAGRAM, "https://www.tiktok.com/@finanz.muslim", YOUTUBE, LINKEDIN];
export const GOOGLE_QUELLE = "https://www.google.com/preferences/source?q=finanzmuslim.com";
export const BIO =
  "Elias El-Gendy hat die Sachkundeprüfungen nach § 34d und § 34f GewO abgeschlossen. Bei TauRes in Hamburg hat er Kunden zu islamkonformen Investments beraten. Auf Instagram (@finanz.muslim) erklärt er über 15.000 Abonnenten, wie Halal Finance funktioniert.";

export const euro = (n: number) => `${Math.round(n).toLocaleString("de-DE")} €`;
export const gross = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function TL({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className="font-medium text-primary underline underline-offset-2 hover:no-underline">
      {children}
    </Link>
  );
}

export const H2 = ({ id, children }: { id: string; children: ReactNode }) => (
  <h2 id={id} className="font-titel scroll-mt-24 text-[25px] leading-[1.2] text-foreground md:text-[28px]">
    {children}
  </h2>
);

export const H3 = ({ children }: { children: ReactNode }) => (
  <h3 className="font-titel mt-10 text-[21px] leading-tight text-foreground">{children}</h3>
);

export const Text = ({ children }: { children: ReactNode }) => (
  <div className="mt-4 max-w-[664px] space-y-4 text-[17px] leading-[1.65] text-foreground/75">{children}</div>
);

/** Kleines Etikett in Großbuchstaben mit Abstand, wie frontal „QUICK COMPARE“. */
export const Etikett = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <p className={`font-mono text-[12px] uppercase tracking-[0.14em] text-muted-foreground ${className}`}>{children}</p>
);

export const Werbung = () => <Etikett>Werbung</Etikett>;

/** Ein Satz, der trägt: groß in Serifen mit blauem Strich, wie unter der ETF-Liste. */
export const Kernsatz = ({ children }: { children: ReactNode }) => (
  <p className="font-titel mt-7 max-w-[664px] border-l-2 border-primary pl-5 text-[20px] leading-[1.4] text-foreground">{children}</p>
);

/** Kleines Etikett hinter dem Namen, nur aus den Daten (Elias SEO47: „so kleine Blöcke“). */
export const Marke = ({ children, ton = "blau" }: { children: ReactNode; ton?: "blau" | "gruen" | "gelb" | "rot" }) => {
  const farbe = {
    blau: "border-primary/25 bg-accent text-primary",
    gruen: "border-gain/30 bg-gain-soft text-gain",
    gelb: "border-amber-300 bg-amber-50 text-amber-800",
    rot: "border-loss/30 bg-loss-soft text-loss",
  }[ton];
  return (
    <span className={`mt-1 inline-block w-fit border px-1.5 py-px font-mono text-[12px] font-normal uppercase tracking-[0.06em] ${farbe}`}>
      {children}
    </span>
  );
};

/**
 * Tabelle wie halalwallet (Elias SEO47): auch am Handy eine echte Tabelle, Name links fest, jede Zahl in einer Zeile,
 * breite Tabellen wischt man seitlich. Spalten mit `text` sind Sätze und dürfen umbrechen.
 */
export type Spalte = { titel: string; zusatz?: string; rechts?: boolean; text?: boolean };
export type Zeile = { schluessel: string; name: ReactNode; unter?: ReactNode; zellen: ReactNode[] };
/** `wischen` zeigt den Wischhinweis am Handy auch bei drei Spalten, wenn eine Satzspalte rechts aus dem Rahmen läuft. */
export const Tabelle = ({ kopf, zeilen, quelle, wischen }: { kopf: Spalte[]; zeilen: Zeile[]; quelle?: ReactNode; wischen?: boolean }) => (
  <div className="mt-5 max-w-[720px]">
    <div className="overflow-x-auto border border-border">
      <table className="w-max min-w-full border-collapse text-[15px]">
        <thead>
          <tr className="bg-muted text-left">
            {kopf.map((k, i) => (
              <th
                key={k.titel}
                scope="col"
                className={`whitespace-nowrap px-3 py-3 align-bottom font-mono text-[12px] font-normal uppercase tracking-[0.08em] text-muted-foreground sm:px-4 ${
                  i === 0 ? "sticky left-0 z-10 bg-muted shadow-[inset_-1px_0_0_hsl(var(--border))]" : ""
                } ${k.rechts ? "text-right" : ""}`}
              >
                {k.titel}
                {k.zusatz && <span className="block font-sans text-[12px] normal-case tracking-normal">{k.zusatz}</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {zeilen.map((z) => (
            <tr key={z.schluessel} className="border-t border-border">
              <th
                scope="row"
                className="sticky left-0 z-10 w-[148px] min-w-[148px] bg-background px-3 py-3 text-left align-middle font-normal shadow-[inset_-1px_0_0_hsl(var(--border))] sm:w-auto sm:min-w-[180px] sm:px-4"
              >
                <span className="block font-semibold leading-snug text-foreground">{z.name}</span>
                {z.unter && <span className="mt-0.5 block text-[13px] leading-snug text-muted-foreground">{z.unter}</span>}
              </th>
              {z.zellen.map((c, i) => (
                <td
                  key={kopf[i + 1]?.titel ?? i}
                  className={`px-3 py-3 align-middle text-foreground/85 sm:px-4 ${
                    kopf[i + 1]?.text ? "min-w-[200px] max-w-[260px] leading-snug" : "whitespace-nowrap tabular-nums"
                  } ${kopf[i + 1]?.rechts ? "text-right" : ""}`}
                >
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    {(kopf.length > 3 || wischen) && <p className="mt-2 text-[13px] text-muted-foreground sm:hidden">Seitlich wischen für alle Spalten</p>}
    {quelle && <p className="mt-2 max-w-[664px] text-[13px] leading-relaxed text-muted-foreground">{quelle}</p>}
  </div>
);

export const Klappzeile = ({ titel, zahl, children }: { titel: string; zahl?: number; children: ReactNode }) => (
  <details className="group border-t border-border">
    <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between py-3 font-mono text-[12px] uppercase tracking-[0.14em] text-foreground [&::-webkit-details-marker]:hidden">
      {titel}
      <span className="flex items-center gap-2 text-muted-foreground">
        {zahl}
        <ChevronDown className="h-3.5 w-3.5 text-foreground transition-transform group-open:rotate-180" aria-hidden />
      </span>
    </summary>
    <div className="pb-3 text-[14px] leading-relaxed text-foreground/75">{children}</div>
  </details>
);

export const RASTER = {
  backgroundImage:
    "linear-gradient(hsl(var(--border) / 0.7) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border) / 0.7) 1px, transparent 1px)",
  backgroundSize: "14px 14px",
};

/** Karten-Reihe „auf einen Blick“ wie /blog/halal-etf: am Handy wischen mit Punkten, am Laptop zwei Pfeile. */
export const KartenReihe = ({ etikett, titel, anzahl, children }: { etikett: string; titel: string; anzahl: number; children: ReactNode }) => {
  const reihe = useRef<HTMLUListElement>(null);
  const [rand, setRand] = useState({ links: true, rechts: false });
  const [karte, setKarte] = useState(0);
  useEffect(() => {
    const el = reihe.current;
    if (!el) return;
    const messen = () => {
      setRand({ links: el.scrollLeft <= 2, rechts: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2 });
      setKarte(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2 ? anzahl - 1 : Math.min(anzahl - 1, Math.round(el.scrollLeft / (220 + 12))));
    };
    messen();
    el.addEventListener("scroll", messen, { passive: true });
    window.addEventListener("resize", messen);
    return () => {
      el.removeEventListener("scroll", messen);
      window.removeEventListener("resize", messen);
    };
  }, [anzahl]);
  const blaettern = (richtung: number) => reihe.current?.scrollBy({ left: richtung * (220 + 12), behavior: "smooth" });
  const pfeil =
    "flex h-11 w-11 items-center justify-center border border-border bg-background text-foreground transition-colors hover:border-foreground disabled:opacity-35 disabled:hover:border-border";
  return (
    <section aria-labelledby="kurzer-vergleich" data-vorlage="quick-compare" className="mt-7">
      <div className="flex items-end justify-between gap-4">
        <div>
          <Etikett>{etikett}</Etikett>
          <p id="kurzer-vergleich" className="font-titel mt-2 text-[22px] leading-tight text-foreground md:text-[24px]">
            {titel}
          </p>
        </div>
        <div className="hidden gap-2 sm:flex">
          <button type="button" onClick={() => blaettern(-1)} disabled={rand.links} aria-label="Vorherige Karten" className={pfeil}>
            <ChevronLeft className="h-4 w-4" aria-hidden />
          </button>
          <button type="button" onClick={() => blaettern(1)} disabled={rand.rechts} aria-label="Nächste Karten" className={pfeil}>
            <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
      <ul
        ref={reihe}
        className="-mx-4 mt-5 flex snap-x snap-mandatory scroll-px-4 items-stretch gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:scroll-px-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </ul>
      <div className="mt-3 flex items-center gap-3 sm:hidden" aria-hidden="true">
        <span className="flex gap-1.5">
          {Array.from({ length: anzahl }, (_, i) => (
            <span key={i} className={`h-1.5 w-1.5 rounded-full ${i === karte ? "bg-foreground" : "bg-border"}`} />
          ))}
        </span>
        <span className="text-[13px] text-muted-foreground">
          {karte + 1} von {anzahl}, wischen
        </span>
      </div>
    </section>
  );
};

/** Eine Karte der Reihe: Kopf mit Nummer, Logo und Name auf Raster, darunter Inhalt. */
export const Karte = ({
  nummer,
  logo,
  kopf,
  erste,
  children,
}: {
  nummer: number;
  logo?: string;
  kopf: string;
  erste?: boolean;
  children: ReactNode;
}) => (
  <li className="flex w-[220px] shrink-0 snap-start flex-col border border-border bg-card">
    <div
      className={`relative flex h-[104px] items-center justify-center gap-2.5 border-b border-border bg-background px-3 ${
        erste ? "shadow-[inset_0_2px_0_hsl(var(--primary))]" : ""
      }`}
      style={RASTER}
    >
      <span className="absolute left-3 top-3 border border-border bg-background px-1.5 py-0.5 font-mono text-[12px] tabular-nums text-foreground">
        {String(nummer).padStart(2, "0")}
      </span>
      {logo && <img src={logo} alt="" aria-hidden="true" width={40} height={40} className="h-10 w-10 object-contain" />}
      <span className="text-center text-[16px] font-semibold leading-tight text-foreground">{kopf}</span>
    </div>
    <div className="flex flex-1 flex-col px-4 pb-1 pt-4">{children}</div>
  </li>
);

/** Kennzahlen in einer Karte, zwei Spalten wie die Fondskarten bei halalwallet. */
export const Kacheln = ({ werte }: { werte: [string, ReactNode, ReactNode?][] }) => (
  <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-3">
    {werte.map(([k, w, unter]) => (
      <div key={k}>
        <dt>
          <Etikett>{k}</Etikett>
        </dt>
        <dd className="mt-1 text-[15px] font-semibold tabular-nums text-foreground">
          {w}
          {unter && <span className="block text-[13px] font-normal text-muted-foreground">{unter}</span>}
        </dd>
      </div>
    ))}
  </dl>
);

const GoogleG = ({ className = "h-7 w-7" }: { className?: string }) => (
  <svg viewBox="0 0 48 48" className={`${className} shrink-0`} aria-hidden>
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
  </svg>
);

/** Google-Kasten wie /blog/halal-etf (Elias SEO32-02: „größer, damit der auch wirklich auffällt“). */
export const GoogleKasten = () => (
  <a
    href={GOOGLE_QUELLE}
    target="_blank"
    rel="noopener noreferrer"
    data-vorlage="google-quelle"
    className="group mt-8 flex flex-wrap items-center gap-x-5 gap-y-4 border border-primary/25 bg-accent px-5 py-5 transition-colors hover:border-primary/60 md:flex-nowrap md:px-6 md:py-6"
  >
    <span className="flex h-14 w-14 shrink-0 items-center justify-center border border-border bg-background">
      <GoogleG className="h-8 w-8" />
    </span>
    <span className="min-w-0 flex-1 basis-[200px]">
      <span className="block text-[18px] font-semibold leading-snug text-foreground md:text-[19px]">
        finanzmuslim als bevorzugte Quelle bei Google hinzufügen
      </span>
      <span className="mt-1 block text-[15px] leading-snug text-muted-foreground">Dann zeigt dir Google unsere Vergleiche öfter.</span>
    </span>
    <span className="inline-flex w-full items-center justify-center gap-1.5 bg-primary px-5 py-3 text-[15px] font-semibold text-primary-foreground transition-colors group-hover:bg-primary-hover md:w-auto">
      Hinzufügen
      <ChevronRight className="h-4 w-4" aria-hidden />
    </span>
  </a>
);

/** YouTube erst nach dem Klick laden: vorher kein Kontakt zu Google. Vorschaubild liegt bei uns. */
export const Video = ({ id, titel, bild }: { id: string; titel: string; bild?: string }) => {
  const [an, setAn] = useState(false);
  return (
    <figure className="mt-5">
      <div className="relative aspect-video overflow-hidden rounded-lg bg-black">
        {an ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title={`${titel}, Video von Finanz Muslim`}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button type="button" onClick={() => setAn(true)} className="group absolute inset-0 h-full w-full" aria-label={`Video abspielen: ${titel}`}>
            {bild ? (
              <img src={bild} alt={`Vorschaubild des Videos ${titel}`} width={480} height={360} loading="lazy" className="h-full w-full object-cover opacity-90" />
            ) : (
              <span className="font-titel absolute inset-x-6 bottom-6 text-left text-[22px] leading-tight text-white">{titel}</span>
            )}
            <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 shadow-lg transition-transform group-hover:scale-105">
              <Play className="ml-1 h-7 w-7 fill-primary text-primary" aria-hidden />
            </span>
          </button>
        )}
      </div>
      <figcaption className="mt-2 text-[13px] text-muted-foreground">
        Erst beim Abspielen lädt YouTube. Auf YouTube:{" "}
        <a href={`https://www.youtube.com/watch?v=${id}`} className="underline" target="_blank" rel="noopener noreferrer">
          {titel}
        </a>
      </figcaption>
    </figure>
  );
};

/** Drei Anbieter untereinander wie „Depots für deine Halal ETFs“: links Häkchen-Zeilen, rechts Logo und Knopf. */
/** Ohne `logo` lädt das runde Logo über die Domain wie in den Vergleichen (AnbieterLogo). */
export type Anbieter = { name: string; logo?: string; domain?: string; out: string; zeilen: string[] };
export const AnbieterKasten = ({ titel, anbieter }: { titel: string; anbieter: Anbieter[] }) => (
  <aside aria-label={titel} className="mt-12">
    <div className="flex items-start justify-between gap-3">
      <p className="font-titel text-[23px] leading-tight text-foreground md:text-[25px]">{titel}</p>
      <Werbung />
    </div>
    <div className="mt-4 space-y-3">
      {anbieter.map((d) => (
        <div key={d.name} className="border border-border bg-card p-5 sm:grid sm:grid-cols-[minmax(0,1fr)_180px] sm:gap-6">
          <div>
            <p className="text-[19px] font-bold text-foreground">{d.name}</p>
            <ul className="mt-3 space-y-2 text-[15px] text-foreground/80">
              {d.zeilen.map((z) => (
                <li key={z} className="flex gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-gain" aria-hidden />
                  <span>{z}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4 flex items-center gap-4 sm:mt-0 sm:flex-col sm:items-stretch sm:gap-3">
            <div className="flex h-[64px] w-[104px] shrink-0 items-center justify-center border border-border bg-background sm:h-[76px] sm:w-full">
              {d.logo ? (
                <img src={d.logo} alt={`Logo ${d.name}`} width={128} height={128} loading="lazy" className="h-12 w-auto max-w-[80%] object-contain" />
              ) : (
                <AnbieterLogo name={d.name} domain={d.domain} gross rand />
              )}
            </div>
            <a
              href={d.out}
              rel="sponsored nofollow"
              className="inline-flex min-h-[48px] flex-1 items-center justify-center whitespace-nowrap bg-primary px-3 py-3 text-[16px] font-semibold text-primary-foreground hover:bg-primary/90 sm:flex-none"
            >
              Zum Angebot*
            </a>
          </div>
        </div>
      ))}
    </div>
  </aside>
);

/** Kasten für ein eigenes Werkzeug (Rechner, Test) im Stil der Seitenleiste: Etikett, Serifen-Titel, schwarzer Knopf. */
export const WerkzeugKasten = ({ etikett, titel, text, ziel, knopf }: { etikett: string; titel: string; text: string; ziel: string; knopf: string }) => (
  <aside className="mt-10 border border-border bg-card p-5 md:p-6">
    <Etikett className="text-primary">{etikett}</Etikett>
    <p className="font-titel mt-2.5 text-[22px] leading-[1.2] text-foreground">{titel}</p>
    <p className="mt-2.5 max-w-[560px] text-[15px] leading-relaxed text-foreground/75">{text}</p>
    <Link to={ziel} className="leuchtlinie mt-5 inline-block">
      <span className="flex min-h-[44px] items-center bg-foreground px-5 py-3 font-mono text-[13px] uppercase tracking-[0.12em] text-background">{knopf}</span>
    </Link>
  </aside>
);

/**
 * Seitenleiste am Laptop: Inhaltsverzeichnis, darunter der Kasten mit dem Aufruf. Der Kasten steht immer ganz im Bild,
 * bei wenig Höhe scrollt das Verzeichnis in sich (Elias SEO31 und SEO60, „der sitzt wieder so ganz unten“, Vault
 * raw/2026-11-05-elias-seo60-versicherung-ersparnisse-haram-nicht-dumm-girokonten.md). Gemessen mit leiste.mjs.
 */
export const Seitenleiste = ({
  inhalt,
  etikett,
  titel,
  text,
  ziel,
  knopf,
}: {
  inhalt: ReactNode;
  etikett: string;
  titel: string;
  text: string;
  ziel: string;
  knopf: string;
}) => {
  // Der aktive Eintrag (aria-current) bleibt im Blick, auch wenn das Verzeichnis in sich scrollt (SEO63 Seiten-Prüfer, 1366 × 650).
  const liste = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const box = liste.current;
    const a = box?.querySelector<HTMLElement>("[aria-current]");
    if (!box || !a) return;
    const b = box.getBoundingClientRect();
    const r = a.getBoundingClientRect();
    if (r.top < b.top) box.scrollTop += r.top - b.top;
    else if (r.bottom > b.bottom) box.scrollTop += r.bottom - b.bottom;
  });
  return (
  <aside className="hidden xl:block" aria-label="Inhaltsverzeichnis">
    <div className="sticky top-24 flex max-h-[calc(100vh-8.5rem)] flex-col">
      <Etikett className="shrink-0 border-t border-border pt-4">Auf dieser Seite</Etikett>
      <div ref={liste} className="mt-3 max-h-[17.5rem] min-h-0 overflow-y-auto [scrollbar-width:thin]">{inhalt}</div>
      <div className="mt-5 shrink-0 border border-border bg-card p-5">
        <Etikett className="text-primary">{etikett}</Etikett>
        <p className="font-titel mt-2.5 text-[21px] leading-[1.2] text-foreground">{titel}</p>
        <p className="mt-2.5 text-[14px] leading-relaxed text-foreground/75">{text}</p>
        <Link to={ziel} className="leuchtlinie mt-4 inline-block">
          <span className="flex min-h-[44px] items-center bg-foreground px-5 py-3 font-mono text-[13px] uppercase tracking-[0.12em] text-background">{knopf}</span>
        </Link>
      </div>
    </div>
  </aside>
  );
};

/** Welcher Abschnitt gerade im Blick ist, für das Inhaltsverzeichnis links. */
export const useAktiv = (ids: string[]) => {
  const [aktiv, setAktiv] = useState<string | null>(null);
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const b = new IntersectionObserver(
      (e) => {
        const s = e.filter((x) => x.isIntersecting).sort((a, c) => a.boundingClientRect.top - c.boundingClientRect.top);
        if (s[0]) setAktiv(s[0].target.id);
      },
      { rootMargin: "-100px 0px -60% 0px", threshold: 0 },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) b.observe(el);
    });
    return () => b.disconnect();
  }, [ids]);
  return aktiv;
};

/**
 * Erklär-Tabelle wie frontal.so/blog/sales-workflow-automation (Elias SEO48-02): ab sm eine echte Tabelle, am Handy
 * je Zeile eine Karte mit kleinen Etiketten über jedem Wert, weil Sätze in schmalen Spalten unlesbar werden.
 */
export const KartenTabelle = ({ kopf, zeilen }: { kopf: string[]; zeilen: { schluessel: string; werte: ReactNode[] }[] }) => (
  <div className="mt-5 max-w-[720px]">
    <div className="hidden overflow-x-auto border border-border sm:block">
      <table className="w-full border-collapse text-[15px]">
        <thead>
          <tr className="bg-muted text-left">
            {kopf.map((k) => (
              <th key={k} scope="col" className="px-4 py-3 align-bottom font-mono text-[12px] font-normal uppercase tracking-[0.08em] text-muted-foreground">
                {k}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {zeilen.map((z) => (
            <tr key={z.schluessel} className="border-t border-border align-top">
              {z.werte.map((w, i) =>
                i === 0 ? (
                  <th key={i} scope="row" className="w-[34%] px-4 py-3.5 text-left font-semibold leading-snug text-foreground">
                    {w}
                  </th>
                ) : (
                  <td key={i} className="px-4 py-3.5 leading-snug text-foreground/80">
                    {w}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <ul className="space-y-3 sm:hidden">
      {zeilen.map((z) => (
        <li key={z.schluessel} className="border border-border bg-card px-4 py-3.5">
          {z.werte.map((w, i) => (
            <div key={i} className={i ? "mt-3" : ""}>
              <Etikett>{kopf[i]}</Etikett>
              <div className={`mt-1 leading-snug ${i ? "text-[15px] text-foreground/80" : "text-[17px] font-semibold text-foreground"}`}>{w}</div>
            </div>
          ))}
        </li>
      ))}
    </ul>
  </div>
);

/** Aufruf mitten im Text mit Elias' Foto wie frontal „Put it into practice“. */
export const AutorAufruf = ({ bild, etikett, titel, text, ziel, knopf }: { bild: string; etikett: string; titel: string; text: string; ziel: string; knopf: string }) => (
  <aside className="mt-10 border-l-2 border-primary bg-muted px-5 py-6 md:px-8">
    <img src={bild} alt="Elias El-Gendy" width={64} height={64} loading="lazy" className="h-16 w-16 object-cover" />
    <Etikett className="mt-4 text-primary">{etikett}</Etikett>
    <p className="font-titel mt-2 text-[24px] leading-[1.2] text-foreground">{titel}</p>
    <p className="mt-2.5 max-w-[560px] text-[15px] leading-relaxed text-foreground/75">{text}</p>
    <Link to={ziel} className="leuchtlinie mt-5 inline-block">
      <span className="flex min-h-[44px] items-center bg-foreground px-5 py-3 font-mono text-[13px] uppercase tracking-[0.12em] text-background">{knopf}</span>
    </Link>
  </aside>
);

/** Gestricheltes Auto, nur Umriss (Elias SEO57: „nicht mal ausgefüllt, wie so gestrichelte, ein gestricheltes Auto“). */
export const AutoUmriss = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x} ${y})`} fill="none" stroke="currentColor" strokeWidth={1.4} strokeDasharray="3 3" strokeLinejoin="round">
    <path d="M2 24 L6 14 Q8 11 12 11 L20 11 L29 3 Q31 1 35 1 L52 1 Q56 1 58 4 L64 11 L70 12 Q74 13 74 17 L74 24 L65 24 M51 24 L23 24 M9 24 L2 24" />
    <circle cx={16} cy={25} r={6.5} />
    <circle cx={58} cy={25} r={6.5} />
  </g>
);

export const Person = ({ x }: { x: number }) => (
  <g fill="none" stroke="currentColor" strokeWidth={1.4}>
    <circle cx={x} cy={40} r={9} />
    <path d={`M${x - 16} 72 Q${x - 16} 54 ${x} 54 Q${x + 16} 54 ${x + 16} 72`} />
  </g>
);

export const Pfeil = ({ von, bis, y }: { von: number; bis: number; y: number }) => {
  const r = bis > von ? 1 : -1;
  return (
    <g stroke="currentColor" strokeWidth={1.4} fill="none">
      <line x1={von} y1={y} x2={bis} y2={y} />
      <path d={`M${bis - r * 7} ${y - 4.5} L${bis} ${y} L${bis - r * 7} ${y + 4.5}`} />
    </g>
  );
};

/**
 * Kleine, frei stehende Tausch-Grafik (Elias SEO57, Vault raw/2026-11-05-elias-seo57-leasing-grafik-gestrichelt-ehrlich-kosten.md):
 * schwarz-weiß, nur gestrichelte Linien. Du zahlst, du bekommst das Auto, und die Pflichten am Auto liegen entweder bei dir
 * (rot markiert, daran scheitert der Vertrag) oder beim Eigentümer, in der Rate drin.
 */
export const Tauschbild = ({
  anbieter,
  pflichten,
  beiDir,
  notiz,
}: {
  anbieter: string;
  pflichten: string[];
  beiDir: boolean;
  notiz: string;
}) => {
  const boxX = beiDir ? 6 : 186;
  const rot = "hsl(var(--loss))";
  return (
    <figure className="mt-7 max-w-[460px]">
      <svg viewBox="0 0 360 250" className="h-auto w-full text-foreground" role="img" aria-label={`${anbieter}: Du zahlst die Rate und bekommst das Auto. ${notiz}`}>
        <Person x={44} />
        <Person x={316} />
        <text x={44} y={96} textAnchor="middle" className="fill-foreground text-[14px] font-semibold">Du</text>
        <text x={312} y={96} textAnchor="middle" className="fill-foreground text-[14px] font-semibold">{anbieter}</text>

        <text x={180} y={21} textAnchor="middle" className="fill-muted-foreground text-[14px]">Rate in €</text>
        <Pfeil von={72} bis={288} y={30} />
        <g transform="translate(137 40) scale(1.16)"><AutoUmriss x={0} y={0} /></g>
        <Pfeil von={272} bis={72} y={84} />
        <text x={172} y={100} textAnchor="middle" className="fill-muted-foreground text-[14px]">Auto zum Fahren</text>

        {beiDir ? (
          <g stroke={rot} strokeWidth={1.4} fill="none" strokeDasharray="4 3">
            <path d={`M316 104 C316 140 262 152 ${boxX + 176} 152`} />
            <path d={`M${boxX + 183} 147.5 L${boxX + 176} 152 L${boxX + 183} 156.5`} strokeDasharray="none" />
          </g>
        ) : (
          <line x1={316} y1={104} x2={316} y2={122} stroke="currentColor" strokeWidth={1.4} strokeDasharray="4 3" />
        )}
        <rect
          x={boxX}
          y={122}
          width={168}
          height={92}
          rx={6}
          fill="none"
          stroke={beiDir ? rot : "currentColor"}
          strokeWidth={1.4}
          strokeDasharray="5 4"
        />
        <text x={boxX + 14} y={143} className="font-mono text-[14px] uppercase tracking-[0.12em]" fill={beiDir ? rot : "hsl(var(--muted-foreground))"}>
          {beiDir ? "Landet bei dir" : "Beim Anbieter"}
        </text>
        {pflichten.map((p, i) => (
          <text key={p} x={boxX + 14} y={166 + i * 18} className="fill-foreground text-[14px]">
            {p}
          </text>
        ))}
        <text x={beiDir ? 6 : 354} y={238} textAnchor={beiDir ? "start" : "end"} className="text-[14px] font-semibold" fill={beiDir ? rot : "hsl(var(--gain))"}>
          {notiz}
        </text>
      </svg>
    </figure>
  );
};
