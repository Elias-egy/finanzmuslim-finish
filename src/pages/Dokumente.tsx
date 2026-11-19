import { Link } from "react-router-dom";
import { ChevronRight, ExternalLink, Mail } from "lucide-react";
import Seo from "@/components/Seo";
import Aufruf from "@/components/Aufruf";
import { AnbieterLogo } from "@/components/AnbieterLogo";
import { ereignis } from "@/lib/messung";
import {
  DOKUMENTE,
  DOKUMENTE_BESCHREIBUNG,
  DOKUMENTE_EINLEITUNG,
  DOKUMENTE_TITEL,
  alleKarten,
  kartenAdresse,
  type DokBlock,
  type DokGruppe,
  type DokKarte,
} from "@/data/dokumente";

const SITE = "https://finanzmuslim.com";

/** Schema der Übersicht: eine Sammelseite mit der Liste ihrer Einträge (nur Name und Adresse, nichts Erfundenes). */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: DOKUMENTE_TITEL,
  description: DOKUMENTE_BESCHREIBUNG,
  url: `${SITE}/dokumente`,
  inLanguage: "de-DE",
  isPartOf: { "@type": "WebSite", name: "finanzmuslim", url: SITE },
  publisher: { "@type": "Organization", name: "finanzmuslim", url: SITE },
  mainEntity: {
    "@type": "ItemList",
    itemListElement: alleKarten()
      .filter((k) => k.ziel.art !== "partner")
      .map((k, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: k.titel,
        url: k.ziel.art === "extern" ? k.ziel.url : `${SITE}${kartenAdresse(k)}`,
      })),
  },
};

/** Knopf einer Karte: eigene Seite und Anbieter-Weg rund und blau, offizielles Formular weiß mit Rand in neuem Tab. */
const KartenKnopf = ({ karte, gross = false }: { karte: DokKarte; gross?: boolean }) => {
  const z = karte.ziel;
  if (z.art === "extern") {
    return (
      <a
        href={z.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => ereignis("wechsel_klick", { anbieter: new URL(z.url).hostname, wo: "dokumente", karte: karte.id })}
        className="group inline-block w-full rounded-full sm:w-auto"
      >
        <span className="flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-border bg-background px-6 text-[16px] font-semibold text-foreground transition-colors group-hover:border-foreground">
          {karte.knopf}
          <ExternalLink className="h-4 w-4" aria-hidden />
        </span>
      </a>
    );
  }
  const istCheck = z.art === "intern" && z.pfad.startsWith("/check");
  return (
    <span
      className="contents"
      onClick={() => {
        if (istCheck) ereignis("freebie_check_klick", { check: true, quelle: "quiz", art: z.pfad.includes("art=depot") ? "depot" : "konto", im: "dokumente", stelle: "oben" });
      }}
    >
      <Aufruf to={kartenAdresse(karte)} gross={gross} className="block w-full sm:w-auto">
        {karte.knopf}
      </Aufruf>
    </span>
  );
};

const Karte = ({ karte }: { karte: DokKarte }) => (
  <article className="card-surface flex flex-col p-5 md:p-6" data-dok={karte.id}>
    <h3 className="text-[19px] font-bold leading-snug text-foreground">{karte.titel}</h3>
    {karte.gegenEmail && (
      <span className="mt-1 inline-flex items-center gap-1 text-[13px] font-semibold text-primary">
        <Mail className="h-3.5 w-3.5" aria-hidden /> Gegen E-Mail
      </span>
    )}
    <p className="mt-2 flex-1 text-[16px] leading-relaxed text-foreground">{karte.satz}</p>
    <div className="mt-5">
      <KartenKnopf karte={karte} />
    </div>
  </article>
);

const Block = ({ block }: { block: DokBlock }) => (
  <div className="mt-8 first:mt-6" data-dok-block={block.id}>
    {block.anbieter && (
      <div className="mb-3 flex items-center gap-3">
        <AnbieterLogo name={block.anbieter.name} domain={block.anbieter.domain} gross />
        <h3 className="sr-only">{block.titel ?? block.anbieter.name}</h3>
      </div>
    )}
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {block.karten.map((k) => (
        <Karte key={k.id} karte={k} />
      ))}
    </div>
  </div>
);

/** Der Check steht groß oben, einer je Weg (Bankkonto, Depot), wie auf den Freebie-Seiten. */
const MatchGruppe = ({ gruppe }: { gruppe: DokGruppe }) => (
  <section aria-labelledby={`dok-${gruppe.id}`} className="mt-8 rounded-2xl bg-accent p-6 ring-1 ring-primary/20 md:mt-10 md:p-10" data-dok-gruppe={gruppe.id}>
    <h2 id={`dok-${gruppe.id}`} className="text-[30px] font-bold leading-[1.1] tracking-tight text-foreground md:text-[44px]">
      {gruppe.titel}
    </h2>
    {gruppe.satz && <p className="mt-3 text-[19px] font-semibold leading-snug text-foreground md:text-[22px]">{gruppe.satz}</p>}
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      {gruppe.bloecke.flatMap((b) => b.karten).map((k) => (
        <article key={k.id} className="flex flex-col rounded-xl border border-border bg-background p-5 md:p-6" data-dok={k.id}>
          <h3 className="text-[22px] font-bold leading-snug text-foreground">{k.titel}</h3>
          <p className="mt-2 flex-1 text-[17px] leading-relaxed text-foreground">{k.satz}</p>
          <div className="mt-5">
            <KartenKnopf karte={k} gross />
          </div>
        </article>
      ))}
    </div>
  </section>
);

const Gruppe = ({ gruppe }: { gruppe: DokGruppe }) =>
  gruppe.gross ? (
    <MatchGruppe gruppe={gruppe} />
  ) : (
    <section aria-labelledby={`dok-${gruppe.id}`} className="mt-14 md:mt-16" data-dok-gruppe={gruppe.id}>
      <h2 id={`dok-${gruppe.id}`} className="text-[28px] font-bold leading-[1.15] tracking-tight text-foreground md:text-[40px] md:leading-[48px]">
        {gruppe.titel}
      </h2>
      {gruppe.satz && <p className="mt-3 max-w-3xl text-[17px] leading-relaxed text-foreground md:text-[18px]">{gruppe.satz}</p>}
      {gruppe.bloecke.map((b) => (
        <Block key={b.id} block={b} />
      ))}
    </section>
  );

const Dokumente = () => (
  <main className="bg-background" data-seite="dokumente">
    <Seo
      title={DOKUMENTE_TITEL}
      description={DOKUMENTE_BESCHREIBUNG}
      path="/dokumente"
      brotkrumen={[{ name: "Dokumente", path: "/dokumente" }]}
      jsonLd={jsonLd}
    />
    <div className="container py-10 md:py-14">
      <nav aria-label="Brotkrumen" className="flex flex-wrap items-center gap-1 text-[13px] text-muted-foreground">
        <Link to="/" className="hover:text-primary">
          Start
        </Link>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        <span className="text-foreground">Dokumente</span>
      </nav>

      <header className="mt-6 max-w-3xl">
        <h1 className="text-[40px] font-bold leading-[1.05] tracking-tight text-foreground md:text-[56px]">Dokumente</h1>
        <p className="mt-4 text-[18px] leading-relaxed text-foreground md:text-[20px]">{DOKUMENTE_EINLEITUNG}</p>
      </header>

      {DOKUMENTE.map((g) => (
        <Gruppe key={g.id} gruppe={g} />
      ))}
    </div>
  </main>
);

export default Dokumente;
