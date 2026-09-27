import Seo from "@/components/Seo";
import VorlagenSeite from "@/components/VorlagenSeite";
import { bewertung, type Farbe } from "@/components/vorlagen/ampelTeile";
import { FallKarte, GOLD_CTAS, GOLD_EINLEITUNG, GOLD_QUELLEN, GOLD_RECHTSHINWEIS, GoldLegende, Grundregel } from "@/components/vorlagen/goldTeile";
import { vorlageBySlug } from "@/data/vorlagen";
import { optinFreebie, vollPdfPfad, vollPfad } from "@/data/optin";
import { faelle, fragen, gutZuWissen } from "@/data/goldCheck";

/**
 * Der volle Gold-Check, nur über die Danke-Seite und den Link aus der Mail (noindex, nicht in der
 * Sitemap). Nach Farbe gruppiert wie die Vertrags-Ampel, dazu drei Fragen vor jedem Goldkauf.
 * Die offene Seite ist `GoldCheck.tsx`.
 */
const v = vorlageBySlug("gold-check")!;
const freebie = optinFreebie("gold-check")!;
const pfad = vollPfad(freebie);
const farben: Farbe[] = ["gruen", "gelb", "rot"];
const ueberschrift: Record<Farbe, string> = {
  gruen: "Zulässig mit Bedingung",
  gelb: "Kommt auf den Vertrag an",
  rot: "Fällt weg",
};

const GoldCheckVoll = () => (
  <>
    <Seo
      title="Gold-Check: alle Wege mit Urteil | finanzmuslim"
      description="Sieh alle Wege, Gold zu kaufen, nach Farbe geordnet, jeweils mit Grund und Beispiel."
      path={pfad}
      noindex
    />
    <VorlagenSeite
      kicker={v.kicker}
      motiv={v.motiv}
      titel={v.titel}
      einleitung={GOLD_EINLEITUNG}
      pdfPfad={vollPdfPfad(freebie, v.pdfPfad)}
      slug={v.slug}
      quellen={GOLD_QUELLEN}
      rechtshinweis={GOLD_RECHTSHINWEIS}
      ctas={GOLD_CTAS}
    >
      <Grundregel />
      <GoldLegende />

      {farben.map((farbe) => {
        const gruppe = faelle.filter((f) => f.farbe === farbe);
        return (
          <section key={farbe} aria-labelledby={`farbe-${farbe}`}>
            <div className="flex items-center gap-3">
              <span className={`h-6 w-6 shrink-0 rounded-full shadow-[inset_0_-2px_4px_rgba(0,0,0,0.15)] ${bewertung[farbe].punkt}`} aria-hidden />
              <h2 id={`farbe-${farbe}`} className="text-2xl font-bold text-foreground">
                {ueberschrift[farbe]}: {gruppe.length} Wege
              </h2>
            </div>
            <div className="mt-4 space-y-3">
              {gruppe.map((f) => (
                <FallKarte key={f.id} f={f} />
              ))}
            </div>
          </section>
        );
      })}

      <section>
        <h2 className="text-2xl font-bold text-foreground">Drei Fragen vor jedem Kauf</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {fragen.map((f, i) => (
            <div key={f.titel} className="card-surface p-5">
              <span className="text-[13px] font-bold text-primary">Frage {i + 1}</span>
              <h3 className="mt-1 text-[17px] font-bold text-foreground">{f.titel}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-hero p-6 md:p-8">
        <h2 className="text-xl font-bold text-foreground">Gut zu wissen</h2>
        <dl className="mt-3 space-y-3">
          {gutZuWissen.map((g) => (
            <div key={g.titel}>
              <dt className="text-[16px] font-bold text-foreground">{g.titel}</dt>
              <dd className="mt-1 text-[15px] leading-relaxed text-foreground/90">{g.text}</dd>
            </div>
          ))}
        </dl>
      </section>
    </VorlagenSeite>
  </>
);

export default GoldCheckVoll;
