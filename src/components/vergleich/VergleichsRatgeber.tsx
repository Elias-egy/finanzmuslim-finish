import { useEffect, useState, type ReactNode } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { AnbieterLogo } from "@/components/AnbieterLogo";
import { AngebotsKnopf, BonusSchild } from "./VergleichsBausteine";
import type { RohAnbieter } from "@/data/vergleichHelfer";

/**
 * Der Blogteil unter einer Vergleichstabelle wie bei Finanzfluss (Vault hermes/funnel-pruefung/BENCHMARK-VERGLEICHSSEITE.md
 * Abschnitt 5 V2, Bilder ff-depot-laptop-05 und -06): ab 1280 links das Inhaltsverzeichnis, in der Mitte der Text, rechts
 * mitlaufend die Nummer 1. Darunter nur ein Text. Stil der Vergleiche (serifenlos, Ecken 8 px, blauer Knopf), nicht der
 * Blog-Stil mit Serifen.
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

const Verzeichnis = ({ eintraege, aktiv }: { eintraege: RatgeberEintrag[]; aktiv: string | null }) => (
  <ol className="space-y-1">
    {eintraege.map((e, i) => (
      <li key={e.id}>
        <a
          href={`#${e.id}`}
          aria-current={aktiv === e.id ? "location" : undefined}
          className={`block border-l-2 py-1.5 pl-4 text-[15px] leading-snug transition-colors ${
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
);

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
  return (
    <div className="mt-14 border-t border-border pt-10 xl:grid xl:grid-cols-[230px_minmax(0,1fr)_260px] xl:gap-x-10">
      <aside className="hidden xl:block" aria-label="Inhaltsverzeichnis">
        <div className="sticky top-24">
          <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Inhalt</p>
          <Verzeichnis eintraege={eintraege} aktiv={aktiv} />
        </div>
      </aside>

      <div className="min-w-0 max-w-3xl">
        {/* Unter 1280: das Verzeichnis zum Aufklappen, oben über dem Text. */}
        <details className="group mb-8 rounded-lg border border-border xl:hidden">
          <summary className="flex min-h-[52px] cursor-pointer list-none items-center justify-between px-4 text-[16px] font-semibold text-foreground [&::-webkit-details-marker]:hidden">
            Inhalt
            <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden />
          </summary>
          <div className="border-t border-border px-4 py-3">
            <Verzeichnis eintraege={eintraege} aktiv={aktiv} />
          </div>
        </details>
        {children}
      </div>

      {nummerEins && (
        <aside className="hidden xl:block" aria-label={auszeichnung ?? "Unsere Nummer 1"}>
          <div className="sticky top-24 overflow-hidden rounded-lg border border-primary bg-card">
            <p className="bg-primary px-4 py-1.5 text-center text-[14px] font-semibold text-primary-foreground">
              {auszeichnung ?? "Unsere Nummer 1"}
            </p>
            <div className="p-4">
              <div className="flex min-h-[68px] items-center justify-center rounded-lg border border-border p-2">
                <AnbieterLogo name={nummerEins.name} domain={nummerEins.domain} gross />
              </div>
              <p className="mt-3 text-center text-[16px] text-foreground">
                <span className="font-semibold">{nummerEins.name}</span> {nummerEins.produkt}
              </p>
              <div className="mt-3">
                <AngebotsKnopf link={nummerEins.link} klein />
              </div>
              <BonusSchild anbieterId={nummerEins.id} />
            </div>
          </div>
        </aside>
      )}
    </div>
  );
};

/* ------------------------------------------------------------- Bausteine */

export const RH2 = ({ id, children }: { id: string; children: ReactNode }) => (
  <h2 id={id} className="mt-14 scroll-mt-24 text-[26px] font-semibold leading-tight tracking-tight text-foreground first:mt-0 md:text-[30px]">
    {children}
  </h2>
);

export const RH3 = ({ id, children }: { id?: string; children: ReactNode }) => (
  <h3 id={id} className="mt-10 scroll-mt-24 text-[21px] font-semibold leading-snug text-foreground md:text-[23px]">
    {children}
  </h3>
);

export const RText = ({ children }: { children: ReactNode }) => (
  <p className="mt-3 text-[17px] leading-[27px] text-foreground/90">{children}</p>
);

/** Kasten wie bei Finanzfluss: Name, Häkchen aus den Daten, höchstens ein Kreuz, rechts Logo und Knopf. */
export const VorNachteile = ({
  anbieter,
  vorteile,
  nachteil,
}: {
  anbieter: RohAnbieter;
  vorteile: { text: string }[];
  nachteil?: { text: string } | null;
}) => (
  <div className="mt-6 rounded-lg border border-border bg-card p-5 md:grid md:grid-cols-[minmax(0,1fr)_220px] md:gap-8 md:p-6">
    <div>
      <p className="text-[19px] font-semibold leading-snug text-foreground">
        {anbieter.name} {anbieter.produkt}
      </p>
      <ul className="mt-4 space-y-2.5">
        {vorteile.map((v) => (
          <li key={v.text} className="flex items-start gap-2.5 text-[16px] leading-snug text-foreground">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary">
              <Check className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={3} aria-hidden />
            </span>
            <span>{v.text}</span>
          </li>
        ))}
        {nachteil && (
          <li className="flex items-start gap-2.5 text-[16px] leading-snug text-foreground">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-destructive">
              <X className="h-3.5 w-3.5 text-destructive-foreground" strokeWidth={3} aria-hidden />
            </span>
            <span>{nachteil.text}</span>
          </li>
        )}
      </ul>
    </div>
    <div className="mt-5 flex flex-col gap-3 md:mt-0">
      <div className="hidden min-h-[68px] items-center justify-center rounded-lg border border-border bg-background p-2 md:flex">
        <AnbieterLogo name={anbieter.name} domain={anbieter.domain} gross />
      </div>
      <div>
        <AngebotsKnopf link={anbieter.link} klein />
        <BonusSchild anbieterId={anbieter.id} />
      </div>
    </div>
  </div>
);

/** Zwei App-Bilder nebeneinander wie bei Finanzfluss, am Handy ebenfalls zu zweit. */
export const AppBilder = ({
  bilder,
  platzhalter,
}: {
  bilder: { src: string; alt: string; text: string }[];
  /** Nur in der Vorschau: Platz markieren, solange Elias' Bilder fehlen. Live steht dann nichts. */
  platzhalter?: string;
}) => {
  if (bilder.length > 0)
    return (
      <div className="mt-6 grid grid-cols-2 gap-4 md:gap-8 md:px-8">
        {bilder.slice(0, 2).map((b) => (
          <figure key={b.src}>
            <img src={b.src} alt={b.alt} loading="lazy" className="h-auto w-full rounded-lg border border-border" />
            <figcaption className="mt-2 text-center text-[14px] leading-snug text-muted-foreground">{b.text}</figcaption>
          </figure>
        ))}
      </div>
    );
  if (!platzhalter || !import.meta.env.DEV) return null;
  return (
    <div className="mt-6 grid grid-cols-2 gap-4 md:gap-8 md:px-8" data-vorschau-platzhalter>
      {[1, 2].map((n) => (
        <div
          key={n}
          className="flex aspect-[9/16] max-h-[420px] items-center justify-center rounded-lg border-2 border-dashed border-border p-3 text-center text-[13px] text-muted-foreground"
        >
          {platzhalter} {n} folgt
        </div>
      ))}
    </div>
  );
};
