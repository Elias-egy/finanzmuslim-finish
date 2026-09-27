import Seo from "@/components/Seo";
import VorlagenSeite from "@/components/VorlagenSeite";
import GesperrteZeile from "@/components/vorlagen/GesperrteZeile";
import Schnittkante from "@/components/optin/Schnittkante";
import KaufbarListe, { DEPOT_PARTNER, WERBE_FUSSNOTE } from "@/components/anlage/KaufbarListe";
import {
  ANLAGEN_CTAS,
  ANLAGEN_EINLEITUNG,
  ANLAGEN_QUELLEN,
  ANLAGEN_RECHTSHINWEIS,
  ANLAGEN_SEO_TITEL,
  AnlageKopf,
  WasNicht,
  artFarbe,
} from "@/components/vorlagen/anlagenTeile";
import { vorlageBySlug } from "@/data/vorlagen";
import { optinFreebie } from "@/data/optin";
import { halalAnlagen } from "@/data/halalAnlagen";
import { ANZAHL_KAUFBAR, gruppen, kante, offen } from "@/data/halalAnlagenAusschnitt";

/**
 * Offene Seite der Halal-Anlagen: Anzahl je Gruppe und drei Anlagen mit ihren Häusern, die ganze
 * Kauf-Tabelle gegen E-Mail (Elias, 27.09.2026, Vault raw 2026-09-26-doomscroll-web/09). Diese
 * Datei importiert bewusst weder `anlagenKaufbar.ts` noch `halalAnlagenKauf.ts`. Jede Anlage
 * bleibt einzeln auf /halal-anlagen offen. Die volle Fassung ist `HalalAnlagenVoll.tsx`.
 */
const v = vorlageBySlug("halal-anlagen")!;
const freebie = optinFreebie("halal-anlagen")!;
const anlage = (slug: string) => halalAnlagen.find((a) => a.slug === slug)!;

const HalalAnlagen = () => (
  <>
    <Seo
      title={ANLAGEN_SEO_TITEL}
      description="Aktien-ETFs, Sukuk und Edelmetalle, die du in Deutschland wirklich kaufen kannst, jeweils mit ISIN, Prüfstelle und den Häusern mit Kaufbeleg."
      path="/vorlagen/halal-anlagen"
      brotkrumen={[{ name: "Vorlagen", path: "/vorlagen" }, { name: "Halal-Anlagen", path: "/vorlagen/halal-anlagen" }]}
    />
    <VorlagenSeite
      kicker={v.kicker}
      motiv={v.motiv}
      titel={v.titel}
      einleitung={ANLAGEN_EINLEITUNG}
      pdfPfad={v.pdfPfad}
      slug={v.slug}
      gesperrt={freebie}
      quellen={ANLAGEN_QUELLEN}
      rechtshinweis={ANLAGEN_RECHTSHINWEIS}
      ctas={ANLAGEN_CTAS}
    >
      <WasNicht />

      <section>
        <h2 className="text-2xl font-bold text-foreground">{ANZAHL_KAUFBAR} Anlagen mit Kaufbeleg</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          {gruppen.map((g) => (
            <div key={g.kategorie} className="card-surface p-4">
              <span className="block h-3 w-3 rounded-full" style={{ background: artFarbe(g.kategorie) }} aria-hidden />
              <span className="mt-2 block text-[28px] font-bold leading-none text-foreground [font-variant-numeric:tabular-nums]">
                {g.anzahl}
              </span>
              <span className="mt-1 block text-[13px] leading-snug text-muted-foreground">{g.titel.split(",")[0]}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-foreground">Drei Anlagen, alle Häuser</h2>
        <p className="mt-2 text-[15px] text-muted-foreground">So sieht die Kauf-Tabelle aus, die anderen gegen deine E-Mail.</p>
        <ul className="mt-4 space-y-3">
          {offen.map((o) => (
            <li key={o.slug} className="card-surface p-4 md:p-5">
              <AnlageKopf a={anlage(o.slug)} />
              <div className="mt-4 border-t border-border pt-4">
                <KaufbarListe kaufbar={o.kaufbar} kompakt />
              </div>
            </li>
          ))}
        </ul>
        {offen.some((o) => o.kaufbar.kaufbar.some((k) => DEPOT_PARTNER[k.anbieter])) && (
          <p className="mt-3 text-[13px] text-muted-foreground">{WERBE_FUSSNOTE}</p>
        )}

        <h3 className="mt-8 text-[17px] font-bold text-foreground">{freebie.frage}</h3>
        <div className="card-surface mt-3 overflow-hidden p-0">
          {kante.map((k) => (
            <GesperrteZeile
              key={k.name}
              name={k.name}
              unterzeile={`${k.anzahl} Anlagen mit Kaufbeleg`}
              verborgen="Anlagen und Häuser nach der Anmeldung"
            />
          ))}
        </div>
      </section>

      <Schnittkante freebie={freebie} weitere={`Alle ${ANZAHL_KAUFBAR} Anlagen mit ihren Häusern`} />
    </VorlagenSeite>
  </>
);

export default HalalAnlagen;
