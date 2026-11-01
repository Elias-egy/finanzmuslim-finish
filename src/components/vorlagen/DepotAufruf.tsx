import { Link } from "react-router-dom";
import { ArrowRight, Check, X } from "lucide-react";
import AnbieterLogo from "@/components/AnbieterLogo";
import { CHECK, TOP3 } from "@/data/depotTop3";

type Props = {
  /** Überschrift des Blocks; ohne sie steht der Block unter der Überschrift der Seite. */
  titel?: string;
  /** Ein Satz vor dem Check; seit MC7d13d meist ohne (Elias, 01.11.2026: „Viel simpler. Klarer.“). */
  einleitung?: string;
  /** Link mit der Klickzählung der Seite, je Stelle (Kennungen in `src/lib/attribution.ts`). */
  link: (ziel: string, stelle: "top3" | "nr1" | "alle") => string;
};

/**
 * Der Depot-Aufruf aller Freebies wie Seite 8 des XXL-Guides (Elias, 31.10.2026, MC7d13d): kein roter Kasten, sondern
 * der Check mit zwei bekannten Depots und darunter die drei besten, blau umrandet. Kennzeichnung wie im Guide:
 * „Werbung“ oben rechts, Sternchen am Knopf, eine Fußnote. Die drei Depot-Karten seit MC7d13e wie die Depot-Karten von
 * Finanzfluss (Elias, 01.11.2026: „Mach das lieber schon so“): Handy Wortmarke oben mittig, Name, sechs Haken, Knopf
 * über die ganze Breite; Laptop links Name und Haken, rechts Wortmarke im Rahmen und Knopf.
 */

// Elias, 01.11.2026, MC7d13d: über den beiden Karten „die bekanntesten sind nicht gleich die besten“.
const DepotAufruf = ({ titel, einleitung = "Die bekanntesten sind nicht gleich die besten.", link }: Props) => (
  <div className="relative rounded-3xl border border-primary/20 p-4 md:p-6" data-depot-aufruf>
    <p className="absolute right-4 top-4 text-[12px] text-muted-foreground md:right-6 md:top-6">Werbung</p>
    {titel && (
      <h2 id="wo" className="pr-16 text-[24px] font-extrabold leading-tight text-foreground">
        {titel}
      </h2>
    )}
    {einleitung && <p className={`${titel ? "mt-1" : "pr-16"} text-[16px] leading-snug text-foreground/80`}>{einleitung}</p>}
    <div className={`${titel || einleitung ? "mt-3" : "mt-8"} grid grid-cols-2 gap-2`}>
      {CHECK.map((d) => (
        // Gelb und leicht Rot mit Rand wie im Portfolio-Plan (Elias, 01.11.2026, MC7d13d: „Ich fand das andere irgendwie besser“).
        <div
          key={d.id}
          className={`rounded-2xl p-3 ring-1 ${d.ton === "rot" ? "bg-loss-soft ring-loss/20" : "bg-amber-50 ring-amber-200"}`}
        >
          <div className="flex items-center gap-2">
            <AnbieterLogo name={d.name} domain={d.domain} klein rand />
            <p className="min-w-0 text-[14px] font-bold leading-tight text-foreground">{d.name}</p>
          </div>
          <p
            className={`mt-2 whitespace-nowrap text-[22px] font-extrabold leading-none tabular-nums ${d.ton === "rot" ? "text-loss" : "text-amber-700"}`}
          >
            {d.vor && <span className="mr-1 text-[13px] font-bold text-foreground">{d.vor}</span>}
            {d.gross}
          </p>
          <p className="mt-1 text-[13px] leading-snug text-muted-foreground">{d.klein}</p>
        </div>
      ))}
    </div>
    {/* „Halal-Alternativen“ (Elias' Wort) trägt bei Depots keinen Beleg, belegt ist nur „ohne Zinsen“ (Anbieter-Belege
        in brokerVergleich.ts, zinsfreiAbStart); darum diese Fassung. */}
    <p className="mt-4 text-[18px] font-extrabold leading-snug text-foreground">
      Die besten Alternativen ohne Zinsen aus meinem Vergleich
    </p>
    <ul className="mt-3 grid gap-4">
      {TOP3.map((d) => (
        <li
          key={d.id}
          className="rounded-2xl border border-primary/20 bg-background p-4 shadow-[0_6px_24px_-12px_rgba(15,23,42,0.18)] md:grid md:grid-cols-[1fr_200px] md:gap-x-6 md:p-6"
          data-depot-karte
        >
          {/* Handy: Wortmarke oben mittig; Laptop: rechts im Rahmen, darunter der Knopf. */}
          <div className="md:col-start-2 md:row-start-1">
            <div className="mx-auto flex h-[72px] w-[176px] items-center justify-center rounded-xl border border-border bg-white px-4 md:w-full">
              <img
                src={`/guides/assets/logos/${d.domain}.wortmarke.svg`}
                alt={d.name}
                loading="lazy"
                className="max-h-9 w-auto max-w-full object-contain"
              />
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
                    {p.ok ? <Check className="h-4 w-4" strokeWidth={3} aria-hidden /> : <X className="h-4 w-4" strokeWidth={3} aria-hidden />}
                  </span>
                  <span>
                    <span className="sr-only">{p.ok ? "Ja: " : "Nein: "}</span>
                    {p.text}
                    {/* Der Wert bricht nicht in sich um („9 von 12“ nicht als „9 von“ und „12“). */}
                    {p.wert && <span className="whitespace-nowrap"> {p.wert}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          {/* Das Video der Nummer 1 stand hier kurz (MC7d13e) und ist wieder raus: Halal-Prüfer r5 fand darin gesprochene
              Halal-Aussagen ohne Beleg (Krypto „zertifiziert“, „ihr müsst nichts prüfen“). Erst nach Schnitt oder neuer
              Aufnahme mit belegter Abschrift wieder einbauen (pruefung/halal-liste-top3-r5.md im Vault). */}
          <div className="md:col-start-2 md:row-start-2">
            <Link
              to={link(d.link, d.nr1 ? "nr1" : "top3")}
              className="mt-4 flex min-h-[52px] w-full items-center justify-center rounded-xl bg-primary text-[17px] font-bold text-primary-foreground hover:bg-primary/90"
            >
              Zum Angebot*
            </Link>
          </div>
        </li>
      ))}
    </ul>
    <Link
      to={link("/vergleich/depot", "alle")}
      className="mt-2 inline-flex min-h-[44px] items-center gap-1 text-[16px] font-semibold text-primary hover:underline"
    >
      Alle Depots im Vergleich
      <ArrowRight className="h-4 w-4" aria-hidden />
    </Link>
    <p className="mt-1 text-[12px] leading-snug text-muted-foreground">
      * Werbung: Eröffnest du über meinen Link ein Depot, bekomme ich eine Provision, ohne Mehrkosten für dich.
    </p>
  </div>
);

export default DepotAufruf;
