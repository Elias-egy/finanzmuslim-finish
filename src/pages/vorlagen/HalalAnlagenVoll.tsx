import { Link } from "react-router-dom";
import Seo from "@/components/Seo";
import VorlagenSeite from "@/components/VorlagenSeite";
import KaufbarListe, { DEPOT_PARTNER, WERBE_FUSSNOTE } from "@/components/anlage/KaufbarListe";
import {
  ANLAGEN_CTAS,
  ANLAGEN_EINLEITUNG,
  ANLAGEN_QUELLEN,
  ANLAGEN_RECHTSHINWEIS,
  AnlageKopf,
  WasNicht,
  artFarbe,
} from "@/components/vorlagen/anlagenTeile";
import { vorlageBySlug } from "@/data/vorlagen";
import { optinFreebie, vollPdfPfad, vollPfad } from "@/data/optin";
import { kaufGruppen, kaufZeilen, krypto, ohneBeleg } from "@/data/halalAnlagenKauf";

/**
 * Die volle Vorlage „Halal-Anlagen“: die Kauf-Tabelle, jede Anlage mit den Anbietern, bei denen sie
 * laut Eigenbeleg kaufbar ist, Partner mit Sternchen über /out/ (Plan 27.09.2026, Entscheidung 8).
 * Nur über die Danke-Seite und den Link aus der Mail (noindex, nicht in der Sitemap).
 */
const v = vorlageBySlug("halal-anlagen")!;
const freebie = optinFreebie("halal-anlagen")!;
const pfad = vollPfad(freebie);
const mitPartner = kaufZeilen.some((z) => z.kaufbar.kaufbar.some((k) => DEPOT_PARTNER[k.anbieter]));
/** Datum jedes Einzelbelegs, nicht das Datum des Datenstands (Gegenlese 27.09.2026). */
const staende = [...new Set(kaufZeilen.flatMap((z) => z.kaufbar.kaufbar.map((k) => k.beleg.stand)))].sort(
  (a, b) => Number(a.split(".").reverse().join("")) - Number(b.split(".").reverse().join("")),
);

const HalalAnlagenVoll = () => (
  <>
    <Seo
      title="Halal-Anlagen: wo du jede kaufen kannst | finanzmuslim"
      description={`Finde alle ${kaufZeilen.length} Halal-Anlagen mit Kaufbeleg und die Anbieter, bei denen du sie kaufen kannst.`}
      path={pfad}
      noindex
    />
    <VorlagenSeite
      kicker={v.kicker}
      motiv={v.motiv}
      titel={v.titel}
      einleitung={ANLAGEN_EINLEITUNG}
      pdfPfad={vollPdfPfad(freebie, v.pdfPfad)}
      slug={v.slug}
      quellen={ANLAGEN_QUELLEN}
      rechtshinweis={ANLAGEN_RECHTSHINWEIS}
      ctas={ANLAGEN_CTAS}
    >
      <WasNicht />

      <nav aria-label="Gruppen" className="flex flex-wrap gap-2">
        {kaufGruppen.map((g) => (
          <a
            key={g.kategorie}
            href={`#gruppe-${g.kategorie}`}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-primary/25 bg-accent px-4 text-[14px] font-semibold text-primary hover:bg-primary/10"
          >
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: artFarbe(g.kategorie) }} aria-hidden />
            {g.titel.split(",")[0]} · {g.zeilen.length}
          </a>
        ))}
      </nav>

      {kaufGruppen.map((g) => (
        <section key={g.kategorie} id={`gruppe-${g.kategorie}`} className="scroll-mt-24">
          <h2 className="flex items-center gap-2.5 text-2xl font-bold text-foreground">
            <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: artFarbe(g.kategorie) }} aria-hidden />
            {g.titel}
          </h2>
          <ul className="mt-4 space-y-3">
            {g.zeilen.map((z) => (
              <li key={z.anlage.slug} className="card-surface p-4 md:p-5">
                <AnlageKopf a={z.anlage} />
                <div className="mt-4 border-t border-border pt-4">
                  <p className="mb-2 text-[13px] font-semibold text-muted-foreground">
                    Kaufbar bei {z.kaufbar.kaufbar.length} {z.kaufbar.kaufbar.length === 1 ? "Anbieter" : "Anbietern"}
                  </p>
                  <KaufbarListe kaufbar={z.kaufbar} kompakt />
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section className="space-y-2 text-[13px] text-muted-foreground">
        {mitPartner && <p>{WERBE_FUSSNOTE}</p>}
        <p>
          {staende.length === 1 ? `Belege vom ${staende[0]}.` : `Belege vom ${staende[0]} bis ${staende[staende.length - 1]}.`}
        </p>
      </section>

      {ohneBeleg.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-foreground">Weitere geprüfte Anlagen</h2>
          <p className="mt-2 text-[15px] text-muted-foreground">
            Geprüft und zertifiziert. Prüfe mit der ISIN in der Suche deines Depots, ob es sie führt.
          </p>
          <ul className="mt-4 space-y-3">
            {ohneBeleg.map((a) => (
              <li key={a.slug} className="card-surface p-4 md:p-5">
                <AnlageKopf a={a} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="card-surface p-6 md:p-8">
        <h2 className="text-xl font-bold text-foreground">Krypto gibt es an Börsen</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
          Die {krypto.length} Coins aus der Anlagen-Datenbank gibt es nicht im Depot, sondern an einer Krypto-Börse. Welche Börse
          echte Coins ohne Zins und Lending führt, steht im Vergleich.
        </p>
        <Link to="/vergleich/krypto" className="btn-primary mt-5">
          Krypto-Börsen im Vergleich
        </Link>
      </section>

      <section className="rounded-2xl bg-hero p-6 md:p-8">
        <h2 className="text-xl font-bold text-foreground">Meine Einordnung</h2>
        <p className="mt-2 text-[16px] leading-relaxed text-foreground/90">
          Beim Gold sind Invesco und WisdomTree offiziell shariah-zertifiziert. Die Amanie-Zertifizierung von Invesco ordne ich
          persönlich stärker ein als das Al-Qalam-Panel von WisdomTree. Lies beide Zertifikate und entscheide selbst. Bewusst
          nicht in der Liste: währungsgesicherte Varianten, Hedged, denn die Absicherung läuft über Terminkontrakte.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-foreground">Und was ist mit Einzelaktien?</h2>
        <p className="mt-3 text-[16px] leading-relaxed text-foreground/90">
          Einzelaktien stehen bewusst nicht in dieser Liste. Sie müssen einzeln geprüft werden und danach regelmäßig erneut, denn
          niemand garantiert, dass ein Unternehmen dauerhaft halal bleibt.
        </p>
      </section>
    </VorlagenSeite>
  </>
);

export default HalalAnlagenVoll;
