import { Link } from "react-router-dom";
import { ArrowRight, Check, X } from "lucide-react";
import AnbieterLogo from "@/components/AnbieterLogo";
import FindeDeinAngebot from "@/components/FindeDeinAngebot";
import { logosFuer } from "@/lib/anbieterLogos";
import { CheckRaster } from "@/components/vorlagen/DepotAufruf";
import { GIRO_CHECK, GIRO_TOP2 } from "@/data/giroTop2";

type Props = {
  /** Überschrift des Blocks; ohne sie steht der Block unter der Überschrift der Seite. */
  titel?: string;
  /** Ein Satz groß vor der Einleitung (Plan: „Etwa jedes achte Girokonto …“). */
  gross?: string;
  einleitung?: string;
  /** Ein Satz zwischen den zwei bekannten und dem Kasten. */
  zwischen?: string;
  /**
   * Nur der kleine Aufruf zum Girokonto-Vergleich statt der zwei Anbieter-Karten (Elias, 04.11.2026, Freebie Plan:
   * „nur dieses kleine … bei Girokonto. Anstatt jetzt Babybank und Consorbank Werbung direkt zu machen, weil das ist zu
   * früh“; Vault `raw/2026-11-04-elias-plan-freebie-kleiner-aufruf-video-raus.md`). Gleicher Baustein wie im Boykott-Freebie.
   */
  klein?: boolean;
  /** Link mit der Klickzählung der Seite, je Stelle (Kennungen in `src/lib/attribution.ts`). */
  link: (ziel: string, stelle: "top2" | "alle") => string;
};

/**
 * Der Girokonto-Aufruf im Portfolio-Plan (Schritt 1) und im Vertrag (unter dem Girokonto), gebaut wie der Depot-Aufruf
 * (Elias, 01.11.2026, MC7d15: „genau wie bei dem anderen“): frei die zwei bekannten Konten mit Zinsen, darunter der
 * hellblaue Kasten mit den zwei besten ohne Zinsen aus dem Girokonto-Vergleich. Kennzeichnung wie dort.
 */
const GiroAufruf = ({ titel, gross, einleitung = "Diese zwei bekannten zahlen dir Zinsen.", zwischen, klein, link }: Props) => (
  <div data-depot-aufruf>
    {titel && <h3 className="text-[20px] font-extrabold leading-tight text-foreground">{titel}</h3>}
    {gross && (
      <p className={`${titel ? "mt-2" : ""} text-[24px] font-extrabold leading-tight text-foreground`}>{gross}</p>
    )}
    {einleitung && (
      <p className={`${titel || gross ? "mt-2" : ""} text-[16px] leading-snug text-foreground/80`}>{einleitung}</p>
    )}
    <CheckRaster check={GIRO_CHECK} className="mt-3" />
    {zwischen && <p className="mt-3 text-[16px] font-semibold leading-snug text-foreground">{zwischen}</p>}
    {klein ? (
      <FindeDeinAngebot
        className="mt-5"
        titel="Du willst ein Girokonto ohne Zinsen?"
        text="Ich habe gerankt, welche Girokonten ohne Zinsen sind."
        knopf="Zum Vergleich"
        logos={logosFuer("Girokonto").logos}
        gesamt={logosFuer("Girokonto").gesamt}
        ziel={link("/vergleich/girokonto", "alle")}
      />
    ) : (
    <div className="relative mt-5 rounded-3xl bg-accent p-4 ring-1 ring-primary/20 md:p-6" data-depot-kasten>
      <p className="absolute right-4 top-4 text-[12px] text-muted-foreground md:right-6 md:top-6">Werbung</p>
      <p className="pr-16 text-[22px] font-extrabold leading-tight text-foreground">Die besten Alternativen aus meinem Vergleich</p>
      <ul className="mt-3 grid gap-4">
        {GIRO_TOP2.map((d) => (
          <li
            key={d.id}
            className="rounded-2xl border border-primary/20 bg-background p-4 shadow-[0_6px_24px_-12px_rgba(15,23,42,0.18)]"
            data-depot-karte
          >
            <div className="flex items-center gap-3">
              <AnbieterLogo name={d.name} domain={d.domain} rand />
              <p className="text-[22px] font-extrabold leading-tight text-foreground">{d.name}</p>
            </div>
            <ul className="mt-3 space-y-2.5">
              {d.punkte.map((p) => (
                <li key={p.text} className="flex items-start gap-3 text-[17px] leading-snug text-foreground">
                  <span
                    className={`mt-px flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white ${p.ok ? "bg-gain" : "bg-loss"}`}
                  >
                    {p.ok ? <Check className="h-4 w-4" strokeWidth={3} aria-hidden /> : <X className="h-4 w-4" strokeWidth={3} aria-hidden />}
                  </span>
                  <span>
                    <span className="sr-only">{p.ok ? "Ja: " : "Nein: "}</span>
                    {p.text}
                    {p.wert && <span> {p.wert}</span>}
                  </span>
                </li>
              ))}
            </ul>
            <Link
              to={link(d.link, "top2")}
              className="mt-4 flex min-h-[52px] w-full items-center justify-center rounded-xl bg-primary text-[17px] font-bold text-primary-foreground hover:bg-primary/90"
            >
              Zum Angebot*
            </Link>
          </li>
        ))}
      </ul>
      <Link
        to={link("/vergleich/girokonto", "alle")}
        className="mt-2 inline-flex min-h-[44px] items-center gap-1 text-[16px] font-semibold text-primary hover:underline"
      >
        Alle Girokonten im Vergleich
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
      <p className="mt-1 text-[12px] leading-snug text-muted-foreground">
        * Werbung: Eröffnest du über meinen Link ein Konto, bekomme ich eine Provision, ohne Mehrkosten für dich.
      </p>
    </div>
    )}
  </div>
);

export default GiroAufruf;
