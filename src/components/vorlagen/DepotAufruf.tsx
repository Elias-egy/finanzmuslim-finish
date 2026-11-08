import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, X } from "lucide-react";
import AnbieterLogo from "@/components/AnbieterLogo";
import { CHECK, TOP3 } from "@/data/depotTop3";
import { findStartPartner, STARTVIDEO } from "@/data/investmentStart";
import { depotNummerEinsZiel } from "@/lib/depotNummerEins";

type Props = {
  /** Überschrift des Blocks; ohne sie steht der Block unter der Überschrift der Seite. */
  titel?: string;
  /** Ein Satz vor dem Check; seit MC7d13d meist ohne (Elias, 01.11.2026: „Viel simpler. Klarer.“). */
  einleitung?: string;
  /** Link mit der Klickzählung der Seite, je Stelle (Kennungen in `src/lib/attribution.ts`). */
  link: (ziel: string, stelle: "top3" | "nr1" | "alle") => string;
  /** Die zwei bekannten Anbieter über dem Kasten; ohne Angabe Trade Republic und XTB aus dem Depot-Vergleich. */
  check?: readonly CheckKarte[];
  /** Der Link unter den drei Karten; ohne Angabe der Depot-Vergleich. */
  alle?: { ziel: string; text: string };
  /** Die drei Karten im Kasten; ohne Angabe die drei besten Depots (Sukuk auf der Gold-Seite: SUKUK_TOP3). */
  top?: readonly DepotKarte[];
  /** Ohne das Video in der Karte der Nummer 1 (Plan, Elias, 04.11.2026: „bei den drei vergleichen das Video auch rausnehmen“). */
  ohneVideo?: boolean;
};

type DepotKarte = (typeof TOP3)[number];

/**
 * Der Titel über dem Aufruf in allen Freebies (Elias, 02.11.2026, MC7d16: „die besten Broker für Muslime ist noch ein
 * bisschen irreführend … dass du die auf minus 100 setzt und dann wieder auf plus 100“; Vault
 * `raw/2026-11-02-elias-mc7d16-feedback-runde-3.md`). Erst die Hürde mit den Suchwörtern „halal investieren“ und
 * „Broker“, darunter die zwei bekannten mit ihrem Haken, dann der Kasten „Die besten Alternativen“.
 */
export const DEPOT_TITEL = "Halal investieren: Nicht jeder Broker passt";

export type CheckKarte = {
  id: string;
  name: string;
  domain: string;
  vor: string;
  gross: string;
  klein: string;
  ton: "gelb" | "rot";
};

/**
 * Der Depot-Aufruf aller Freebies wie Seite 8 des XXL-Guides (Elias, 31.10.2026, MC7d13d): kein roter Kasten, sondern
 * der Check mit zwei bekannten Depots und darunter die drei besten, blau umrandet. Kennzeichnung wie im Guide:
 * „Werbung“ oben rechts, Sternchen am Knopf, eine Fußnote. Die drei Depot-Karten seit MC7d13e wie die Depot-Karten von
 * Finanzfluss (Elias, 01.11.2026: „Mach das lieber schon so“): Handy Wortmarke oben mittig, Name, sechs Haken, Knopf
 * über die ganze Breite; Laptop links Name und Haken, rechts Wortmarke im Rahmen und Knopf. Das Video der Nummer 1
 * steht direkt in ihrer Karte statt hinter einem Klick (Elias, 31.10.2026, MC7d13d).
 */
/** Die zwei bekannten Anbieter in Gelb und leichtem Rot, über dem Kasten; auch im Girokonto-Aufruf. */
export const CheckRaster = ({ check, className = "" }: { check: readonly CheckKarte[]; className?: string }) => (
  // Eine Karte allein steht über die ganze Breite (Gold und Sukuk: eine Zahl über alle Depots).
  <div className={`${className} grid ${check.length === 1 ? "grid-cols-1" : "grid-cols-2"} gap-2`}>
    {check.map((d) => (
      // Gelb und leicht Rot mit Rand wie im Portfolio-Plan (Elias, 01.11.2026, MC7d13d: „Ich fand das andere irgendwie besser“).
      <div
        key={d.id}
        className={`rounded-lg p-3 ring-1 ${d.ton === "rot" ? "bg-loss-soft ring-loss/20" : "bg-amber-50 ring-amber-200"}`}
      >
        {/* Ohne Namen ist es eine Zahl über alle Depots (Gold, Sukuk), dann ohne Logo-Zeile. */}
        {d.name && (
          <div className="flex items-center gap-2">
            <AnbieterLogo name={d.name} domain={d.domain} klein rand />
            <p className="min-w-0 text-[14px] font-bold leading-tight text-foreground">{d.name}</p>
          </div>
        )}
        <p
          className={`${d.name ? "mt-2" : ""} whitespace-nowrap text-[22px] font-extrabold leading-none tabular-nums ${d.ton === "rot" ? "text-loss" : "text-amber-700"}`}
        >
          {d.vor && <span className="mr-1 text-[13px] font-bold text-foreground">{d.vor}</span>}
          {d.gross}
        </p>
        <p className="mt-1 text-[13px] leading-snug text-muted-foreground">{d.klein}</p>
      </div>
    ))}
  </div>
);

/** Die Wortmarke aus public/guides/assets/logos; fehlt sie (etwa Consorsbank in den Sukuk-Karten), das runde Logo. */
const Wortmarke = ({ name, domain }: { name: string; domain: string }) => {
  const [fehlt, setFehlt] = useState(false);
  return fehlt ? (
    <AnbieterLogo name={name} domain={domain} gross />
  ) : (
    <img
      src={`/guides/assets/logos/${domain}.wortmarke.svg`}
      alt={name}
      loading="lazy"
      onError={() => setFehlt(true)}
      className="max-h-9 w-auto max-w-full object-contain"
    />
  );
};

// Die Startseite der Nummer 1 (/out/<kurzname> → /dein-investmentstart/<kurzname>) sagt, ob ihr Video ein Beispiel ist.
const nr1Start = findStartPartner(TOP3.find((d) => d.nr1)?.link.replace(/^\/out\//, ""));
/* Der Knopf der Nummer 1 führt auf /depot-nummer-1, das eine Ziel aller Geld-Knöpfe (Elias, CV15F-02/-03, 06.11.2026:
   „ein Ziel mit einem Knopf“). So folgt er der Rangfolge von selbst, ein PDF aus dieser Seite veraltet nicht. Nur für die
   drei besten Depots und nur, wenn die Karte wirklich die Nummer 1 des Depot-Vergleichs ist (nicht bei Sukuk-Karten). */
const NR1_ZIEL = depotNummerEinsZiel();
const kartenZiel = (d: DepotKarte, top: readonly DepotKarte[]) => (top === TOP3 && d.nr1 && d.link === NR1_ZIEL ? "/depot-nummer-1" : d.link);
// Elias, 01.11.2026, MC7d13d: über den beiden Karten „die bekanntesten sind nicht gleich die besten“.
// Seit MC7d15 getrennt (Elias, 01.11.2026: „Das steht einzeln, nicht in dem Kasten“): Titel, Satz und die zwei bekannten
// frei, darunter der hellblaue Kasten, der mit „Die besten Alternativen aus meinem Vergleich“ beginnt.
const DepotAufruf = ({
  titel,
  einleitung = "Die bekanntesten sind nicht gleich die besten.",
  link,
  check = CHECK,
  alle = { ziel: "/vergleich/depot", text: "Alle Depots im Vergleich" },
  top = TOP3,
  ohneVideo = false,
}: Props) => (
  <div data-depot-aufruf>
    {titel && (
      <h2 id="wo" className="text-[24px] font-extrabold leading-tight text-foreground">
        {titel}
      </h2>
    )}
    {einleitung && <p className={`${titel ? "mt-1" : ""} text-[16px] leading-snug text-foreground/80`}>{einleitung}</p>}
    <CheckRaster check={check} className={titel || einleitung ? "mt-3" : ""} />
    <div className="relative mt-5 rounded-lg border border-border bg-card p-4 md:p-6" data-depot-kasten>
      <p className="absolute right-4 top-4 text-[12px] text-muted-foreground md:right-6 md:top-6">Werbung</p>
      {/* „Halal-Alternativen“ trägt bei Depots keinen Beleg (Anbieter-Belege in brokerVergleich.ts belegen „ohne Zinsen“);
          Elias' Wort seit MC7d15 ist „die besten Alternativen aus meinem Vergleich“. */}
      {/* Das „plus 100“ nach der Hürde im Titel (MC7d17): größer als vorher (18 px). */}
      <p className="pr-16 text-[22px] font-extrabold leading-tight text-foreground">
        Die besten Alternativen aus meinem Vergleich
      </p>
      <ul className="mt-3 grid gap-4">
        {top.map((d) => (
          <li
            key={d.id}
            className="rounded-lg border border-border bg-card p-4 md:grid md:grid-cols-[1fr_200px] md:gap-x-6 md:p-6"
            data-depot-karte
          >
            {/* Handy: Wortmarke oben mittig; Laptop: rechts im Rahmen, darunter der Knopf. */}
            <div className="md:col-start-2 md:row-start-1">
              <div className="mx-auto flex h-[72px] w-[176px] items-center justify-center rounded-lg border border-border bg-white px-4 md:w-full">
                <Wortmarke name={d.name} domain={d.domain} />
              </div>
            </div>
            <div className="md:col-start-1 md:row-span-2 md:row-start-1">
              <p className="mt-3 text-center text-[24px] font-extrabold leading-tight text-foreground md:mt-0 md:text-left">
                {d.name}
              </p>
              <ul className="mt-3 space-y-2.5">
                {d.punkte.map((p) => (
                  <li key={p.text} className="flex items-start gap-3 text-[17px] leading-snug text-foreground">
                    <span
                      className={`mt-px flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white ${p.ok ? "bg-gain" : "bg-loss"}`}
                    >
                      {p.ok ? (
                        <Check className="h-4 w-4" strokeWidth={3} aria-hidden />
                      ) : (
                        <X className="h-4 w-4" strokeWidth={3} aria-hidden />
                      )}
                    </span>
                    <span>
                      <span className="sr-only">{p.ok ? "Ja: " : "Nein: "}</span>
                      {p.text}
                      {/* Ein kurzer Wert bricht nicht in sich um („9 von 12“ nicht als „9 von“ und „12“); ein langer
                          (Consorsbank-Order „4,95 € + 0,25% (min. …)“) darf umbrechen. */}
                      {p.wert && <span className={p.wert.length <= 16 ? "whitespace-nowrap" : ""}> {p.wert}</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            {d.nr1 && !ohneVideo && nr1Start?.art === "depot" && (
              <div className="mt-4 md:col-span-2 md:row-start-3">
                {/* Im PDF läuft kein Video: dort steht der Link auf die Startseite mit dem Video (MC7d13d, Schritt 232). */}
                <a
                  href={`https://finanzmuslim.com/dein-investmentstart/${nr1Start.kurzname}`}
                  className="nur-druck rounded-lg border border-border bg-card p-3 text-[16px] font-semibold leading-snug text-primary underline underline-offset-2"
                >
                  Video ansehen: {d.name} eröffnen, Schritt für Schritt
                </a>
                <video
                  className="kein-druck aspect-video w-full rounded-lg bg-black"
                  src={STARTVIDEO.src}
                  poster={STARTVIDEO.poster}
                  controls
                  playsInline
                  preload="none"
                  title={`${d.name} eröffnen, Schritt für Schritt`}
                />
                {nr1Start.videoHinweis && (
                  <p className="kein-druck mt-1.5 text-[13px] leading-snug text-muted-foreground">
                    Das Video zeigt die Einrichtung am Beispiel von Scalable Capital. Bei {d.name} läuft sie genauso,
                    nur die Menüs heißen anders.
                  </p>
                )}
              </div>
            )}
            <div className="md:col-start-2 md:row-start-2">
              <Link
                to={link(kartenZiel(d, top), d.nr1 ? "nr1" : "top3")}
                className="mt-4 flex min-h-[52px] w-full items-center justify-center rounded-lg bg-primary text-[17px] font-bold text-primary-foreground hover:bg-primary/90"
              >
                Zum Angebot*
              </Link>
            </div>
          </li>
        ))}
      </ul>
      <Link
        to={link(alle.ziel, "alle")}
        className="mt-2 inline-flex min-h-[44px] items-center gap-1 text-[16px] font-semibold text-primary hover:underline"
      >
        {alle.text}
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
      <p className="mt-1 text-[12px] leading-snug text-muted-foreground">
        * Werbung: Eröffnest du über meinen Link ein Depot, bekomme ich eine Provision, ohne Mehrkosten für dich.
      </p>
    </div>
  </div>
);

export default DepotAufruf;
