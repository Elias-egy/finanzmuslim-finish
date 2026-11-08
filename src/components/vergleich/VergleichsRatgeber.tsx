import { useEffect, useRef, useState, type ReactNode } from "react";
import { AlertTriangle, Check, ChevronRight, Lightbulb, ListTree, X } from "lucide-react";
import { AnbieterLogo } from "@/components/AnbieterLogo";
import { AngebotsKnopf, BonusSchild } from "./VergleichsBausteine";
import type { RohAnbieter } from "@/data/vergleichHelfer";

/**
 * Der Blogteil unter einer Vergleichstabelle wie bei Finanzfluss im hellen Modus (Vault hermes/funnel-pruefung/
 * BENCHMARK-VERGLEICHSSEITE.md Abschnitt 5 V2; SEO77 am 08.11.2026 an finanzfluss.de/vergleich/depot gemessen): ab 1280
 * links das Inhaltsverzeichnis, in der Mitte der Text (höchstens 720 px), rechts mitlaufend die Nummer 1. Am Handy ein
 * runder Knopf unten rechts, der das Verzeichnis als schwebende Karte öffnet. Maße: Fließtext 18/28, H2 26/34, H3 22/30,
 * Abstände H2 40, H3 32, Absatz 16, Kasten 24.
 */

export type RatgeberEintrag = { id: string; titel: string };

/**
 * Aktiv ist der letzte Abschnitt, dessen Überschrift schon unter dem Kopf der Seite durch ist. So bleibt er markiert, auch
 * wenn seine Überschrift längst aus dem Bild ist (der Beobachter aus dem Blog kennt nur sichtbare Überschriften).
 */
const useAbschnitt = (ids: string[]) => {
  const [aktiv, setAktiv] = useState<string | null>(null);
  const schluessel = ids.join(",");
  useEffect(() => {
    let rahmen = 0;
    const messen = () => {
      rahmen = 0;
      let treffer: string | null = null;
      for (const id of schluessel.split(",")) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < 140) treffer = id;
      }
      setAktiv(treffer);
    };
    const anfordern = () => {
      if (!rahmen) rahmen = requestAnimationFrame(messen);
    };
    messen();
    addEventListener("scroll", anfordern, { passive: true });
    addEventListener("resize", anfordern);
    return () => {
      removeEventListener("scroll", anfordern);
      removeEventListener("resize", anfordern);
      cancelAnimationFrame(rahmen);
    };
  }, [schluessel]);
  return aktiv;
};

/** Wie bei Finanzfluss: eine durchgehende graue Linie von 4 px links, der aktive Abschnitt blau und fett. */
const Verzeichnis = ({
  eintraege,
  aktiv,
  onWahl,
}: {
  eintraege: RatgeberEintrag[];
  aktiv: string | null;
  onWahl?: () => void;
}) => (
  <>
    <p className="mb-3 text-[14px] font-semibold uppercase leading-[22px] tracking-[1px] text-muted-foreground">
      Inhaltsverzeichnis
    </p>
    <ol>
      {eintraege.map((e, i) => (
        <li key={e.id}>
          <a
            href={`#${e.id}`}
            onClick={onWahl}
            aria-current={aktiv === e.id ? "location" : undefined}
            className={`block border-l-4 pb-6 pl-6 text-[16px] leading-6 transition-colors ${
              aktiv === e.id
                ? "border-primary font-semibold text-foreground"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {i + 1}. {e.titel}
          </a>
        </li>
      ))}
    </ol>
  </>
);

/**
 * Am Handy: runder Knopf unten rechts, nur solange der Blogteil im Bild ist. Antippen holt das Verzeichnis
 * als schwebende Karte unten rechts herein, ein Eintrag springt hin und schließt sie.
 */
const HandyVerzeichnis = ({
  eintraege,
  aktiv,
  bereich,
}: {
  eintraege: RatgeberEintrag[];
  aktiv: string | null;
  bereich: React.RefObject<HTMLDivElement>;
}) => {
  const [sichtbar, setSichtbar] = useState(false);
  const [offen, setOffen] = useState(false);
  const knopf = useRef<HTMLButtonElement>(null);
  const zu = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = bereich.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const beobachter = new IntersectionObserver(([e]) => setSichtbar(e.isIntersecting), { rootMargin: "-40% 0px -40% 0px" });
    beobachter.observe(el);
    return () => beobachter.disconnect();
  }, [bereich]);

  useEffect(() => {
    if (!offen) return;
    zu.current?.focus();
    const taste = (e: KeyboardEvent) => e.key === "Escape" && schliessen();
    addEventListener("keydown", taste);
    return () => removeEventListener("keydown", taste);
  }, [offen]);

  const schliessen = () => {
    setOffen(false);
    knopf.current?.focus();
  };

  return (
    <div className="xl:hidden">
      <button
        ref={knopf}
        type="button"
        onClick={() => setOffen(true)}
        aria-label="Inhaltsverzeichnis öffnen"
        aria-expanded={offen}
        className={`fixed bottom-[calc(24px+env(safe-area-inset-bottom,0px))] right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary bg-card text-primary shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-opacity ${
          sichtbar && !offen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        tabIndex={sichtbar ? 0 : -1}
      >
        <ListTree className="h-5 w-5" aria-hidden />
      </button>
      {offen && (
        <>
          <div className="fixed inset-0 z-50" onClick={schliessen} aria-hidden />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Inhaltsverzeichnis"
            className="fixed bottom-[calc(24px+env(safe-area-inset-bottom,0px))] right-6 z-50 max-h-[calc(100dvh-140px)] w-[calc(100%-68px)] max-w-[340px] overflow-y-auto rounded-lg bg-card p-4 shadow-[0_4px_24px_rgba(0,0,0,0.16),0_0_2px_rgba(0,0,0,0.16)]"
          >
            <button
              ref={zu}
              type="button"
              onClick={schliessen}
              aria-label="Inhaltsverzeichnis schließen"
              className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary text-primary"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
            <Verzeichnis eintraege={eintraege} aktiv={aktiv} onWahl={() => setOffen(false)} />
          </div>
        </>
      )}
    </div>
  );
};

export const VergleichsRatgeber = ({
  eintraege,
  nummerEins,
  auszeichnung,
  children,
}: {
  eintraege: RatgeberEintrag[];
  nummerEins?: RohAnbieter | null;
  auszeichnung?: string;
  children: ReactNode;
}) => {
  const aktiv = useAbschnitt(eintraege.map((e) => e.id));
  const bereich = useRef<HTMLDivElement>(null);
  return (
    <div className="mt-14 border-t border-border pt-10 xl:grid xl:grid-cols-[minmax(220px,290px)_minmax(0,720px)_minmax(240px,290px)] xl:justify-between xl:gap-x-4">
      <aside className="hidden xl:block" aria-label="Inhaltsverzeichnis">
        <div className="sticky top-24">
          <Verzeichnis eintraege={eintraege} aktiv={aktiv} />
        </div>
      </aside>

      <div ref={bereich} className="min-w-0 max-w-[720px]">
        {children}
      </div>

      {nummerEins && (
        <aside className="hidden xl:block" aria-label={auszeichnung ?? "Unsere Nummer 1"}>
          <div className="sticky top-24 overflow-hidden rounded-lg border border-primary/50 bg-accent">
            <p className="bg-primary/10 px-2 py-px text-center text-[14px] font-semibold leading-[22px] text-primary">
              {auszeichnung ?? "Unsere Nummer 1"}
            </p>
            <div className="flex justify-center pt-6">
              <AnbieterLogo name={nummerEins.name} domain={nummerEins.domain} gross />
            </div>
            <p className="mt-6 px-3 text-center text-[16px] leading-6 text-foreground">
              {nummerEins.name} {nummerEins.produkt}
            </p>
            <div className="p-3">
              <AngebotsKnopf link={nummerEins.link} klein />
              <BonusSchild anbieterId={nummerEins.id} />
            </div>
          </div>
        </aside>
      )}

      <HandyVerzeichnis eintraege={eintraege} aktiv={aktiv} bereich={bereich} />
    </div>
  );
};

/* ------------------------------------------------------------- Bausteine */

/** Die erste H2 des Blogteils steht groß wie bei Finanzfluss (32 am Handy, 48 am Laptop), alle weiteren 26. */
export const RH2 = ({ id, gross = false, children }: { id: string; gross?: boolean; children: ReactNode }) => (
  <h2
    id={id}
    className={`scroll-mt-24 font-bold text-foreground ${
      gross ? "text-[32px] leading-[40px] md:text-[48px] md:leading-[56px]" : "mt-10 text-[26px] leading-[34px]"
    }`}
  >
    {children}
  </h2>
);

export const RH3 = ({ id, children }: { id?: string; children: ReactNode }) => (
  <h3 id={id} className="mt-8 scroll-mt-24 text-[22px] font-bold leading-[30px] text-foreground">
    {children}
  </h3>
);

export const RText = ({ children }: { children: ReactNode }) => (
  <p className="mt-4 text-[18px] leading-[28px] text-foreground [h2+&]:mt-3 [h3+&]:mt-2">{children}</p>
);

/** Liste mit blauem Pfeil und fettem Anfang wie Finanzfluss bei „Welche Kosten können entstehen?“. */
export const RListe = ({ punkte }: { punkte: { titel: string; text: ReactNode }[] }) => (
  <ul className="mt-6">
    {punkte.map((p) => (
      <li key={p.titel} className="relative pb-3 pl-7 text-[18px] leading-[28px] text-foreground">
        <ChevronRight className="absolute left-0 top-1 h-5 w-5 text-primary" strokeWidth={3} aria-hidden />
        <span className="font-semibold">{p.titel}:</span> {p.text}
      </li>
    ))}
  </ul>
);

/** Hinweiskasten wie Finanzfluss: hell, gestrichelt, Titel 22 px. Statt Emoji ein Zeichen (keine Emojis bei uns). */
export const RHinweis = ({
  titel,
  art = "tipp",
  children,
}: {
  titel: string;
  art?: "tipp" | "warnung";
  children: ReactNode;
}) => {
  const Zeichen = art === "tipp" ? Lightbulb : AlertTriangle;
  return (
    <div
      className={`mt-6 rounded-lg border border-dashed p-6 ${
        art === "tipp" ? "border-primary/60 bg-accent" : "border-destructive/60 bg-destructive/5"
      }`}
    >
      <p className="flex items-start gap-2 text-[22px] font-bold leading-[30px] text-foreground">
        <Zeichen className={`mt-1 h-6 w-6 shrink-0 ${art === "tipp" ? "text-primary" : "text-destructive"}`} aria-hidden />
        {titel}
      </p>
      <p className="mt-2 text-[18px] leading-[28px] text-foreground">{children}</p>
    </div>
  );
};

/**
 * Tabelle wie Finanzfluss: Kopf in Versalien ohne Fläche, Linien von 2 px, erste Spalte fett, Unterschrift klein. Am Handy
 * wischt man sie seitlich, der Name links bleibt stehen (Regel im Repo, Elias 04.11.2026).
 */
export const RTabelle = ({ kopf, zeilen, unterschrift }: { kopf: string[]; zeilen: ReactNode[][]; unterschrift?: string }) => (
  <figure className="mt-6">
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px] border-collapse text-left">
        <thead>
          <tr>
            {kopf.map((k) => (
              <th
                key={k}
                scope="col"
                className="pb-2 pr-4 pt-4 first:sticky first:left-0 first:z-10 first:bg-background md:first:static align-bottom text-[14px] font-semibold uppercase leading-[22px] tracking-[1px] text-muted-foreground"
              >
                {k}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {zeilen.map((z, i) => (
            <tr key={i} className="border-y-2 border-border">
              {z.map((c, j) =>
                j === 0 ? (
                  <th
                    key={j}
                    scope="row"
                    className="sticky left-0 z-10 bg-background pb-2 pr-4 pt-4 align-top text-[16px] font-semibold leading-6 text-foreground md:static"
                  >
                    {c}
                  </th>
                ) : (
                  <td key={j} className="pb-2 pr-4 pt-4 align-top text-[16px] leading-6 text-foreground">
                    {c}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    {unterschrift && (
      <figcaption className="mt-3 text-center text-[12px] leading-[18px] text-muted-foreground">{unterschrift}</figcaption>
    )}
  </figure>
);

/**
 * Kasten wie bei Finanzfluss: weiß mit weichem Schatten. Laptop: links Name und Häkchen, rechts Logo und Knopf.
 * Handy: Logo und Name mittig oben, Häkchen, Knopf über die volle Breite unten. Höchstens ein Kreuz.
 */
export const VorNachteile = ({
  anbieter,
  vorteile,
  nachteil,
}: {
  anbieter: RohAnbieter;
  vorteile: { text: string }[];
  nachteil?: { text: string } | null;
}) => (
  <div className="mt-6 flex flex-col rounded-lg bg-card px-4 pb-4 pt-8 shadow-[0_4px_24px_rgba(0,0,0,0.08),0_0_2px_rgba(0,0,0,0.16)] md:grid md:grid-cols-[minmax(0,392px)_240px] md:justify-between md:gap-x-6 md:p-6">
    <div className="flex justify-center md:col-start-2 md:row-start-1 md:items-start">
      <AnbieterLogo name={anbieter.name} domain={anbieter.domain} gross />
    </div>
    <div className="md:col-start-1 md:row-span-2 md:row-start-1">
      <p className="mt-4 text-center text-[22px] font-bold leading-[30px] text-foreground md:mt-0 md:text-left">
        {anbieter.name} {anbieter.produkt}
      </p>
      <ul className="mt-4">
        {vorteile.map((v) => (
          <li key={v.text} className="relative pb-3 pl-7 text-[18px] leading-[28px] text-foreground">
            <span className="absolute left-0 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-success">
              <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} aria-hidden />
            </span>
            {v.text}
          </li>
        ))}
        {nachteil && (
          <li className="relative pb-3 pl-7 text-[18px] leading-[28px] text-foreground">
            <span className="absolute left-0 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive">
              <X className="h-3.5 w-3.5 text-destructive-foreground" strokeWidth={3} aria-hidden />
            </span>
            {nachteil.text}
          </li>
        )}
      </ul>
    </div>
    <div className="mt-3 md:col-start-2 md:row-start-2 md:mt-7 md:self-start">
      <AngebotsKnopf link={anbieter.link} klein />
    </div>
  </div>
);

/** Zwei App-Bilder wie bei Finanzfluss: am Laptop nebeneinander, am Handy untereinander, je höchstens 274 px breit. */
export const AppBilder = ({
  bilder,
  platzhalter,
  quelle,
}: {
  bilder: { src: string; alt: string; text: string }[];
  /** Nur in der Vorschau: Platz markieren, solange Elias' Bilder fehlen. Live steht dann nichts. */
  platzhalter?: string;
  /** Woher die Bilder sind, eine Zeile darunter. */
  quelle?: string;
}) => {
  if (bilder.length > 0)
    return (
      <figure className="mt-10">
        <div className="grid gap-10 md:grid-cols-2 md:gap-9">
          {bilder.slice(0, 2).map((b) => (
            <img
              key={b.src}
              src={b.src}
              alt={b.alt}
              title={b.text}
              loading="lazy"
              className="mx-auto h-auto w-full max-w-[274px] rounded-lg border border-border"
            />
          ))}
        </div>
        {quelle && (
          <figcaption className="mt-4 text-center text-[15px] text-muted-foreground">{quelle}</figcaption>
        )}
      </figure>
    );
  if (!platzhalter || !import.meta.env.DEV) return null;
  return (
    <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-9" data-vorschau-platzhalter>
      {[1, 2].map((n) => (
        <div
          key={n}
          className="mx-auto flex aspect-[274/542] w-full max-w-[274px] items-center justify-center rounded-lg border-2 border-dashed border-border p-3 text-center text-[13px] text-muted-foreground"
        >
          {platzhalter} {n} folgt
        </div>
      ))}
    </div>
  );
};
