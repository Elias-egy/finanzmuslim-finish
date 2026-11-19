import { BadgeCheck, ShieldCheck } from "lucide-react";
import Seo from "@/components/Seo";
import KursZeile from "@/components/vorlagen/KursZeile";
import BoykottfreiPruefung from "@/components/vorlagen/BoykottfreiPruefung";
import CheckEinstieg from "@/components/CheckEinstieg";
import { alleBoykottfrei, BF_QUELLE, BF_TEASER_PFAD, videoListe } from "@/data/boykottfreieAktien";

/**
 * Kurze offene Seite zum Freebie „Halal und boykottfrei“ (RN20, 19.11.2026): die ersten fünf Aktien aus dem Video, der Check-Kasten und
 * „So haben wir geprüft“. Die volle Liste liegt unter dem geheimen Pfad (`BoykottfreieAktienVoll.tsx`). noindex, nicht in der Sitemap.
 * Eine E-Mail-Schranke wie bei den anderen Teasern gibt es hier nicht: Sie bräuchte eine eigene MailerLite-Gruppe und ein
 * Make-Szenario für das neue Freebie (src/lib/optin.ts).
 */
const TEASER = 5;

const BoykottfreieAktien = () => {
  const anzahl = alleBoykottfrei.length;
  return (
    <main className="bg-background" data-freebie="boykottfreie-aktien" data-vorlage="boykottfreie-aktien" data-teaser>
      <Seo
        title={`Halal und boykottfrei: ${anzahl} Aktien | finanzmuslim`}
        description="Halal geprüfte Aktien, die auf keiner der geprüften Boykott-Listen stehen. Stand November 2026."
        path={BF_TEASER_PFAD}
        noindex
      />

      <div className="container max-w-2xl py-8 md:py-12">
        <header className="rounded-lg border border-border bg-card p-6 md:p-8">
          <h1 className="text-[30px] font-extrabold leading-[1.1] text-foreground md:text-[38px]">
            Halal und boykottfrei: <span className="whitespace-nowrap">{anzahl} Aktien</span>
          </h1>
          <p className="mt-3 flex items-start gap-2 text-[17px] font-semibold leading-snug text-foreground">
            <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-gain" aria-hidden />
            <span>Alle einzeln bei Musaffa halal geprüft.</span>
          </p>
          <p className="mt-2 flex items-start gap-2 text-[17px] font-semibold leading-snug text-foreground">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-gain" aria-hidden />
            <span>Auf keiner der geprüften Boykott-Listen. Stand November 2026.</span>
          </p>
        </header>

        <section className="mt-8" aria-labelledby="titel-teaser">
          <h2 id="titel-teaser" className="text-[24px] font-extrabold leading-tight text-foreground">
            Die ersten {TEASER} aus dem Video
          </h2>
          <div className="card-surface mt-3 overflow-hidden p-0">
            {videoListe.slice(0, TEASER).map((z) => (
              <KursZeile key={z.ticker} name={z.name} ticker={z.ticker} bekanntFuer={z.text} />
            ))}
          </div>
        </section>

        <CheckEinstieg quelle={BF_QUELLE} className="mt-12" />

        <BoykottfreiPruefung className="mt-12" />
      </div>
    </main>
  );
};

export default BoykottfreieAktien;
