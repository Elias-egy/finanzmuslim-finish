import type { ReactNode } from "react";
import { Lock } from "lucide-react";
import OptinKarte from "@/components/optin/OptinKarte";
import type { OptinFreebie } from "@/data/optin";

type Props = {
  freebie: OptinFreebie;
  /** Wie viele Einträge noch hinter der Schranke liegen, für den Satz über der Karte. */
  weitere: string;
  /** Die Zeilen direkt an der Schranke: Name sichtbar, Inhalt gesperrt. Darunter läuft die Liste verschwommen aus. */
  children?: ReactNode;
  /** Überschrift über den Zeilen. Ohne Angabe die Frage des Freebies. */
  kopf?: ReactNode;
};

/**
 * Blindtext für die verschwommenen Zeilen. Er steht nur als Attribut im HTML und kommt über
 * CSS (`content: attr(…)`) ins Bild: kein Seitentext, nichts zum Markieren, nichts für
 * Suchmaschinen und Vorleseprogramme.
 */
const BLIND: [string, string, string][] = [
  ["Beispielname Eins", "Kurze Zeile dazu", "Wert"],
  ["Zweiter Eintrag", "Noch eine Zeile", "Wert"],
  ["Ein dritter Name hier", "Kurze Zeile", "Wert"],
  ["Vierter Eintrag", "Eine weitere Zeile dazu", "Wert"],
];

const ausAttribut = "before:content-[attr(data-b)]";

/**
 * Das Ende des offenen Ausschnitts (Elias, 08.10.2026: „die ersten drei Aktien siehst, der Rest
 * ist verschwommen und dann musst du einfach deine Mail eingeben“). Unter den Zeilen der Seite
 * läuft die Liste verschwommen aus, direkt darauf sitzt die Opt-in-Karte, Anker `#holen`.
 *
 * Verschwommen ist nur Blindtext, nie der echte Inhalt mit Unschärfe: So steht der gesperrte
 * Teil weder im vorgerenderten HTML noch im JavaScript dieser Seite.
 */
const Schnittkante = ({ freebie, weitere, children, kopf }: Props) => (
  <section aria-labelledby="holen-titel">
    {kopf ?? <h3 className="text-[17px] font-bold text-foreground">{freebie.frage}</h3>}

    <div className="relative mt-3">
      <div className="card-surface overflow-hidden p-0">
        {children}
        <div aria-hidden className="select-none">
          {BLIND.map(([name, unter, wert], i) => (
            <div
              key={name}
              className="grid grid-cols-[1fr_auto] items-center gap-3 border-b border-border px-4 py-3 last:border-b-0"
              style={{ filter: `blur(${3.5 + i * 0.8}px)` }}
            >
              <span className="min-w-0">
                <span data-b={name} className={`block text-[15px] font-bold text-foreground ${ausAttribut}`} />
                <span data-b={unter} className={`block text-[13px] text-muted-foreground ${ausAttribut}`} />
              </span>
              <span
                data-b={wert}
                className={`inline-flex h-7 items-center rounded-full border border-primary/25 bg-accent px-3 text-[12px] font-bold text-primary ${ausAttribut}`}
              />
            </div>
          ))}
        </div>
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-[linear-gradient(to_bottom,hsl(var(--background)/0)_0%,hsl(var(--background))_42%)]"
      />
    </div>

    <div id="holen" className="relative mx-auto -mt-28 max-w-xl scroll-mt-24">
      <p id="holen-titel" className="text-balance text-center text-[15px] font-semibold text-foreground">
        <Lock className="mr-1.5 inline h-4 w-4 align-[-2px] text-primary" aria-hidden />
        {weitere}
      </p>
      <div className="mt-4">
        <OptinKarte freebie={freebie} />
      </div>
    </div>
  </section>
);

export default Schnittkante;
