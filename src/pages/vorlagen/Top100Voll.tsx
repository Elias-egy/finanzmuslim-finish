import Seo from "@/components/Seo";
import VorlagenSeite from "@/components/VorlagenSeite";
import AktienZeile from "@/components/vorlagen/AktienZeile";
import { vorlageBySlug } from "@/data/vorlagen";
import { optinFreebie, vollPfad } from "@/data/optin";
import { aktien } from "@/data/top100Aktien";

/**
 * Die volle Fassung der 100 Halal-Aktien, nur über den Link aus der Mail nach der
 * Bestätigung (noindex, nicht in der Sitemap). Die offene Seite mit dem Ausschnitt ist
 * `Top100HalalAktien.tsx`; nur diese Datei hier lädt die ganze Liste.
 */
const v = vorlageBySlug("top-100-halal-aktien")!;
const pfad = vollPfad(optinFreebie("top-100-halal-aktien")!);

const themen = [
  { titel: "Digital & Chips", spanne: "1–20", intro: "Technik, Software und Halbleiter, die viele aus dem Alltag oder Berufsleben kennen." },
  { titel: "Konsum & Alltag", spanne: "21–40", intro: "Marken aus Sport, Kosmetik, Getränken, Elektronik und Handel." },
  { titel: "Gesundheit & Mobilität", spanne: "41–60", intro: "Pharma, Medizintechnik, Autos, Lieferdienste und Fluggesellschaften." },
  { titel: "Industrie & Energie", spanne: "61–80", intro: "Globale Konzerne hinter Energie, Automation, Chemie, Bau und Rohstoffen." },
  { titel: "Global & überraschend", spanne: "81–100", intro: "Fünfzehn globale Namen plus fünf überraschende Highlights ab Platz 96." },
];

const Top100Voll = () => (
  <>
    <Seo
      title="100 bekannte Halal-Aktien, Musaffa-Einzelprüfung | finanzmuslim"
      description="94 von 100 bekannten Aktien sind halal. Von Apple bis Nike, mit Musaffa-Einzelprüfung vom 20.08.2026 und Fundstelle zu jedem Titel."
      path={pfad}
      noindex
    />
    <VorlagenSeite
      kicker={v.kicker}
      motiv={v.motiv}
      titel={v.titel}
      einleitung="Von Apple, Tesla und Nike bis Roblox: bekannte Marken, alltagstauglich sortiert und mit dem zeitgebundenen Screening-Beleg direkt in der Tabelle."
      pdfPfad={v.pdfPfad}
      slug={v.slug}
      quellen="Halal-Screening: Musaffa-Einzelprüfung, Abruf 20.08.2026, Methodik auf Basis der AAOIFI-Kriterien. Gegencheck: Zoya. Boykott-Nachschlagewerke zur eigenen Prüfung: offizieller BDS-Leitfaden, Boycat, Is-Boycott, Brands2Boycott. Halal-Screening und Boykottprüfung sind zwei getrennte Prüfungen, dieses Blatt bildet nur die erste ab."
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
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <div className="text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">
              Stand & Status
            </div>
            <p className="mt-1 text-[15px] leading-relaxed text-foreground/90">
              <b>Musaffa-Einzelprüfung, 20.08.2026.</b> Alle 100 Titel wurden einzeln geprüft: 94
              halal, 6 doubtful. Halal- und Boykottstatus können sich jederzeit ändern und sollten
              vor einer Entscheidung erneut geprüft werden.
            </p>
          </div>
          <div>
            <div className="text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">
              Was „100 bekannte" bedeutet
            </div>
            <p className="mt-1 text-[15px] leading-relaxed text-foreground/90">
              Redaktionelle Auswahl nach Bekanntheit, Alltag und Themenvielfalt, nicht nach Größe,
              Rendite oder Qualität. Die Nummern sind eine Lesehilfe, keine Kauf-Rangliste.
            </p>
          </div>
        </div>
      </section>

      {themen.map((t, i) => (
        <section key={t.titel}>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-2xl font-bold text-foreground">{t.titel}</h2>
            <span className="text-[13px] font-semibold text-muted-foreground">{t.spanne}</span>
          </div>
          <p className="mt-2 text-[15px] text-muted-foreground">{t.intro}</p>
          <div className="card-surface mt-4 overflow-hidden p-0">
            {aktien.slice(i * 20, i * 20 + 20).map((a) => (
              <AktienZeile
                key={a.ticker}
                rang={a.rang}
                name={a.name}
                ticker={a.ticker}
                bekanntFuer={a.bekanntFuer}
                status={a.status}
                highlight={a.rang >= 96}
              />
            ))}
          </div>
        </section>
      ))}

      <section className="rounded-2xl border border-[hsl(var(--warning)/0.4)] bg-[hsl(var(--warning)/0.1)] p-6">
        <h2 className="text-xl font-bold text-foreground">Eine zeitgebundene Momentaufnahme</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-foreground/90">
          Die Einstufung basiert auf dem Stand vom 20.08.2026. Prüfe Name und Ticker am Tag deiner
          Entscheidung erneut, idealerweise in mehr als einem Screener, und ob dein Broker genau
          diese Aktie und Börsenlinie anbietet. Boykottstatus und aktuelle Unternehmensverbindungen
          bitte separat prüfen, das ist eine eigene Prüfung, keine Halal-Frage.
        </p>
      </section>
    </VorlagenSeite>
  </>
);

export default Top100Voll;
