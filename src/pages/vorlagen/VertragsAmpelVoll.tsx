import Seo from "@/components/Seo";
import VorlagenSeite from "@/components/VorlagenSeite";
import {
  AMPEL_CTAS,
  AMPEL_EINLEITUNG,
  AMPEL_QUELLEN,
  AMPEL_RECHTSHINWEIS,
  AmpelKarte,
  Legende,
  Pille,
  WarumGelb,
  bewertung,
  legende,
  type Farbe,
} from "@/components/vorlagen/ampelTeile";
import { vorlageBySlug } from "@/data/vorlagen";
import { optinFreebie, vollPdfPfad, vollPfad } from "@/data/optin";
import { fragen, zeilen } from "@/data/vertragsAmpel";

/**
 * Der volle Halal Vertrags-Check, nur über die Danke-Seite und den Link aus der Mail (noindex, nicht
 * in der Sitemap). Nach Farbe gruppiert, mit größeren Ampelpunkten und Karten auf dem Handy
 * (Plan 27.09.2026, „sparsam aufgefrischt“). Die offene Seite ist `VertragsAmpel.tsx`.
 */
const v = vorlageBySlug("vertrags-ampel")!;
const freebie = optinFreebie("vertrags-ampel")!;
const pfad = vollPfad(freebie);
const farben: Farbe[] = ["gruen", "gelb", "rot"];

const VertragsAmpelVoll = () => (
  <>
    <Seo
      title="Halal Vertrags-Check: alle zwölf Verträge mit Farbe | finanzmuslim"
      description="Sieh alle zwölf Verträge aus dem Alltag nach Farbe geordnet, jeweils mit der Bedingung dahinter."
      path={pfad}
      noindex
    />
    <VorlagenSeite
      kicker={v.kicker}
      motiv={v.motiv}
      titel={v.titel}
      einleitung={AMPEL_EINLEITUNG}
      pdfPfad={vollPdfPfad(freebie, v.pdfPfad)}
      slug={v.slug}
      quellen={AMPEL_QUELLEN}
      rechtshinweis={AMPEL_RECHTSHINWEIS}
      ctas={AMPEL_CTAS}
    >
      <Legende />
      <WarumGelb />

      {farben.map((farbe) => {
        const gruppe = zeilen.filter((z) => z.farbe === farbe);
        const b = bewertung[farbe];
        return (
          <section key={farbe} aria-labelledby={`farbe-${farbe}`}>
            <div className="flex items-center gap-3">
              <span className={`h-6 w-6 shrink-0 rounded-full shadow-[inset_0_-2px_4px_rgba(0,0,0,0.15)] ${b.punkt}`} aria-hidden />
              <h2 id={`farbe-${farbe}`} className="text-2xl font-bold text-foreground">
                {b.wort}: {gruppe.length} Verträge
              </h2>
            </div>
            <p className="mt-2 text-[15px] text-muted-foreground">{legende.find((l) => l.farbe === farbe)!.text}</p>

            {/* Tabelle ab md, darunter gestapelte Karten ohne horizontales Scrollen. */}
            <table className="mt-4 hidden w-full border-collapse text-left md:table">
              <thead>
                <tr className="border-b border-border">
                  <th className="w-[28%] py-3 pr-4 text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">Vertrag</th>
                  <th className="w-[14%] py-3 pr-4 text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">Bewertung</th>
                  <th className="py-3 text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">Woran es hängt</th>
                </tr>
              </thead>
              <tbody>
                {gruppe.map((z) => (
                  <tr key={z.vertrag} className="border-b border-border align-top">
                    <td className="py-4 pr-4">
                      <span className="block text-[16px] font-bold text-foreground">{z.vertrag}</span>
                      <span className="mt-1 block text-[13px] text-muted-foreground">{z.unter}</span>
                    </td>
                    <td className="py-4 pr-4">
                      <Pille farbe={z.farbe} />
                    </td>
                    <td className="py-4 text-[15px] leading-relaxed text-foreground/90">{z.woran}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 space-y-3 md:hidden">
              {gruppe.map((z) => (
                <AmpelKarte key={z.vertrag} z={z} />
              ))}
            </div>
          </section>
        );
      })}

      <section>
        <h2 className="text-2xl font-bold text-foreground">Wenn ein Vertrag gelb ist, drei Fragen</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {fragen.map((f) => (
            <div key={f.titel} className="card-surface p-5">
              <h3 className="text-[17px] font-bold text-foreground">{f.titel}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </section>
    </VorlagenSeite>
  </>
);

export default VertragsAmpelVoll;
