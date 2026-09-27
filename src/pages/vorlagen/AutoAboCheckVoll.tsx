import Seo from "@/components/Seo";
import VorlagenSeite from "@/components/VorlagenSeite";
import type { Farbe } from "@/components/vorlagen/ampelTeile";
import {
  AboLegende,
  AnbieterKarte,
  AUTO_CTAS,
  AUTO_EINLEITUNG,
  AUTO_QUELLEN,
  AUTO_RECHTSHINWEIS,
  Rechenbeispiel,
  WarumNicht,
  WasAboAndersMacht,
} from "@/components/vorlagen/autoAboTeile";
import { vorlageBySlug } from "@/data/vorlagen";
import { optinFreebie, vollPdfPfad, vollPfad } from "@/data/optin";
import { anbieter, firmen, fragen, nichtBuchbar, rechnung } from "@/data/autoAboCheck";

/**
 * Der volle Auto-Abo-Check, nur über die Danke-Seite und den Link aus der Mail (noindex, nicht in der
 * Sitemap). Anbieter nach Farbe, je mit dem Wortlaut aus den eigenen Bedingungen, dazu ein Rechenbeispiel,
 * fünf Fragen an den Anbieter und die Abos, die es nicht mehr gibt. Die offene Seite ist `AutoAboCheck.tsx`.
 */
const v = vorlageBySlug("auto-abo-check")!;
const freebie = optinFreebie("auto-abo-check")!;
const pfad = vollPfad(freebie);
const reihenfolge: Farbe[] = ["gruen", "gelb", "rot"];
const sortiert = [...anbieter].sort((a, b) => reihenfolge.indexOf(a.farbe) - reihenfolge.indexOf(b.farbe));

const AutoAboCheckVoll = () => (
  <>
    <Seo
      title="Auto-Abo-Check: alle Anbieter mit Urteil | finanzmuslim"
      description="Sieh alle geprüften Auto-Abos mit Urteil und dem Wortlaut aus den eigenen Bedingungen."
      path={pfad}
      noindex
    />
    <VorlagenSeite
      kicker={v.kicker}
      motiv={v.motiv}
      titel={v.titel}
      einleitung={AUTO_EINLEITUNG}
      pdfPfad={vollPdfPfad(freebie, v.pdfPfad)}
      slug={v.slug}
      quellen={AUTO_QUELLEN}
      rechtshinweis={AUTO_RECHTSHINWEIS}
      ctas={AUTO_CTAS}
    >
      <WarumNicht />
      <WasAboAndersMacht />
      <AboLegende />

      <section aria-labelledby="anbieter">
        <h2 id="anbieter" className="text-2xl font-bold text-foreground">
          {anbieter.length} Anbieter geprüft
        </h2>
        <p className="mt-2 text-[15px] text-muted-foreground">
          Sieh zu jedem Anbieter das Urteil, den Grund und den Wortlaut, auf dem es beruht, Stand 27.09.2026.
          {anbieter.every((a) => a.farbe !== "gruen") && " Grün erreicht keiner, die fünf Fragen unten zeigen, was du vor der Unterschrift klärst."}
        </p>
        <div className="mt-4 space-y-4">
          {sortiert.map((a) => (
            <AnbieterKarte key={a.id} a={a} />
          ))}
        </div>
      </section>

      <Rechenbeispiel r={rechnung} />

      <section aria-labelledby="fragen">
        <h2 id="fragen" className="text-2xl font-bold text-foreground">
          Fünf Fragen an den Anbieter
        </h2>
        <p className="mt-2 text-[15px] text-muted-foreground">Stell sie schriftlich vor der Unterschrift und heb die Antwort auf.</p>
        <ol className="mt-4 space-y-3">
          {fragen.map((f, i) => (
            <li key={f.titel} className="card-surface p-5">
              <span className="text-[13px] font-bold text-primary">Frage {i + 1}</span>
              <h3 className="mt-1 text-[17px] font-bold text-foreground">{f.titel}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{f.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="eingestellt">
        <h2 id="eingestellt" className="text-2xl font-bold text-foreground">
          Nicht mehr buchbar
        </h2>
        <p className="mt-2 text-[15px] text-muted-foreground">Sieh, welche bekannten Abos es für Neukunden nicht mehr gibt, jeweils mit dem Satz des Anbieters.</p>
        <ul className="card-surface mt-4 divide-y divide-border overflow-hidden p-0">
          {nichtBuchbar.map((n) => (
            <li key={n.name} className="p-4">
              <span className="block text-[15px] font-bold text-foreground">{n.name}</span>
              <span className="block text-[13px] text-muted-foreground">{n.unter}</span>
              {n.beleg && <q className="mt-2 block text-[14px] italic text-foreground/90">{n.beleg}</q>}
              <span className="mt-1 block text-[12px] text-muted-foreground">{n.fundstelle}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl bg-hero p-6 md:p-8" aria-labelledby="firmen">
        <h2 id="firmen" className="text-xl font-bold text-foreground">
          Abos für Firmen
        </h2>
        <p className="mt-2 text-[16px] leading-relaxed text-foreground/90">{firmen}</p>
      </section>
    </VorlagenSeite>
  </>
);

export default AutoAboCheckVoll;
