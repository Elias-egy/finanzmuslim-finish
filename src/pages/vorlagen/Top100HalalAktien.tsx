import { BadgeCheck } from "lucide-react";
import Seo from "@/components/Seo";
import VorlagenSeite from "@/components/VorlagenSeite";
import AktienZeile from "@/components/vorlagen/AktienZeile";
import Schnittkante from "@/components/optin/Schnittkante";
import { vorlageBySlug } from "@/data/vorlagen";
import { optinFreebie } from "@/data/optin";
import { kante, offen } from "@/data/top100Ausschnitt";

/**
 * Offene Seite der 100 Halal-Aktien: ein Ausschnitt, der Rest gegen E-Mail (Elias,
 * 27.09.2026). Diese Datei importiert bewusst nicht `top100Aktien.ts`, sonst stünde die
 * ganze Liste samt Ergebnis im JavaScript dieser Seite. Die volle Fassung ist `Top100Voll.tsx`.
 */
const v = vorlageBySlug("top-100-halal-aktien")!;
const freebie = optinFreebie("top-100-halal-aktien")!;

const Top100HalalAktien = () => (
  <>
    <Seo
      title="100 bekannte Halal-Aktien, von Apple bis Nike | finanzmuslim"
      description="Prüfe 100 bekannte Aktien auf halal, von Apple bis Nike. Mit Musaffa-Einzelprüfung vom 20.08. und 27.09.2026 und Fundstelle zu jedem Titel."
      path="/vorlagen/top-100-halal-aktien"
      brotkrumen={[
        { name: "Vorlagen", path: "/vorlagen" },
        { name: "100 Halal-Aktien", path: "/vorlagen/top-100-halal-aktien" },
      ]}
    />
    <VorlagenSeite
      kicker={v.kicker}
      motiv={v.motiv}
      titel={v.titel}
      einleitung="Von Apple bis Nike: bekannte Marken, alltagstauglich sortiert und mit dem Screening-Beleg zu jedem Titel."
      pdfPfad={v.pdfPfad}
      slug={v.slug}
      gesperrt={freebie}
      quellen="Halal-Screening: Musaffa-Einzelprüfung, Abruf 20.08. und 27.09.2026, Methodik auf Basis der AAOIFI-Kriterien. Gegencheck: Zoya. Boykott-Nachschlagewerke zur eigenen Prüfung: offizieller BDS-Leitfaden, Boycat, Is-Boycott, Brands2Boycott. Halal-Screening und Boykottprüfung sind zwei getrennte Prüfungen, diese Liste bildet nur die erste ab."
      rechtshinweis="Die genannten Unternehmen und Aktien sind Beispiele, keine Empfehlung zum Kauf, Halten oder Verkauf und keine Anlageberatung. Die Auswahl ist redaktionell nach Bekanntheit sortiert, nicht nach Größe, Rendite oder Qualität. Halal- und Boykottstatus können sich jederzeit ändern und sollten vor einer eigenen Entscheidung erneut geprüft werden. Zu den genannten Werkzeugen bestehen keine Partnerschaften."
      ctas={[
        {
          titel: "Anbieter im Vergleich",
          text: "Nicht jeder Broker führt jede dieser Aktien. Wer welche Einzeltitel handelbar macht, steht im Depot-Vergleich.",
          buttonLabel: "Depot-Vergleich",
          to: "/vergleich/depot",
        },
        {
          titel: "Eine eigene Aktie prüfen, in 60 Sekunden",
          text: "Steht deine Aktie nicht auf der Liste? Der Spickzettel zeigt dir die drei Grenzwerte, nach denen jeder Screener entscheidet.",
          buttonLabel: "Zum Spickzettel",
          to: "/vorlagen/aktien-check",
        },
      ]}
    >
      <section className="rounded-2xl bg-hero p-6 md:p-8">
        <p className="flex items-start gap-3 text-[22px] font-bold leading-tight text-foreground md:text-[28px]">
          <BadgeCheck className="mt-0.5 h-7 w-7 shrink-0 text-primary md:h-8 md:w-8" aria-hidden />
          Alle 100 Aktien einzeln mit Musaffa geprüft
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <div className="text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">Stand und Prüfung</div>
            <p className="mt-1 text-[15px] leading-relaxed text-foreground/90">
              <b>Musaffa-Einzelprüfung, 20.08. und 27.09.2026.</b> Jeder Titel einzeln geprüft, nach den Kriterien der AAOIFI. Halal- und
              Boykottstatus können sich ändern und sollten vor einer Entscheidung erneut geprüft werden.
            </p>
          </div>
          <div>
            <div className="text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">
              Was „100 bekannte“ bedeutet
            </div>
            <p className="mt-1 text-[15px] leading-relaxed text-foreground/90">
              Redaktionelle Auswahl nach Bekanntheit, Alltag und Themenvielfalt, nicht nach Größe, Rendite oder Qualität. Die
              Nummern sind eine Lesehilfe, keine Kauf-Rangliste.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-foreground">Ein Blick in die Liste</h2>
        <p className="mt-2 text-[15px] text-muted-foreground">Sechs Titel offen, der Rest mit Ergebnis gegen deine E-Mail.</p>
        <div className="card-surface mt-4 overflow-hidden p-0">
          {offen.map((a) => (
            <AktienZeile key={a.ticker} name={a.name} ticker={a.ticker} bekanntFuer={a.bekanntFuer} status="Halal" />
          ))}
        </div>

        <h3 className="mt-8 text-[17px] font-bold text-foreground">{freebie.frage}</h3>
        <div className="card-surface mt-3 overflow-hidden p-0">
          {kante.map((a) => (
            <AktienZeile key={a.name} name={a.name} bekanntFuer={a.bekanntFuer} status="offen" />
          ))}
        </div>
      </section>

      <Schnittkante freebie={freebie} weitere="Alle 100 Titel mit Ergebnis und Fundstelle" />

      <section className="rounded-2xl border border-[hsl(var(--warning)/0.4)] bg-[hsl(var(--warning)/0.1)] p-6">
        <h2 className="text-xl font-bold text-foreground">Eine zeitgebundene Momentaufnahme</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-foreground/90">
          Die Einstufung basiert auf dem Stand vom 20.08.2026, bei sechs Titeln vom 27.09.2026. Prüfe Name und Ticker am Tag deiner
          Entscheidung erneut, idealerweise in mehr als einem Screener, und ob dein Broker genau
          diese Aktie und Börsenlinie anbietet. Boykottstatus und aktuelle Unternehmensverbindungen
          bitte separat prüfen, das ist eine eigene Prüfung, keine Halal-Frage.
        </p>
      </section>
    </VorlagenSeite>
  </>
);

export default Top100HalalAktien;
