import { useEffect } from "react";
import { BadgeCheck, ShieldCheck } from "lucide-react";
import Seo from "@/components/Seo";
import NaechsterTeil from "@/components/NaechsterTeil";
import KursZeile from "@/components/vorlagen/KursZeile";
import BoykottfreiPruefung from "@/components/vorlagen/BoykottfreiPruefung";
import CheckEinstieg from "@/components/CheckEinstieg";
import {
  alleBoykottfrei,
  BF_QUELLE,
  BF_VOLL_PFAD,
  neuListe,
  videoListe,
  videoNachgeprueft,
  VOR_KASTEN,
  weitereListe,
  type BfZeile,
} from "@/data/boykottfreieAktien";

/**
 * Freebie „Halal und boykottfrei“ (RN20, 19.11.2026), das Freebie zum Video „26 boykottfreie Halal-Aktien“: die volle Liste unter dem
 * geheimen Pfad (noindex, nicht in der Sitemap). Elias: „eine Liste noch mit boykottfreien Aktien … Und dann auch ein Call to Action
 * für den Freebie da. Für den Funnel mit dem Quiz. So wie du es überall gemacht hast.“
 *
 * Aufbau wie `Top100Voll.tsx`: Kopf, die 26 aus dem Video in der Reihenfolge des Videos, der eine große Check-Kasten im ersten Drittel
 * (nach den ersten 10), dann der Rest der 26, darunter die weiteren ohne Befund, „So haben wir geprüft“ und ganz unten der kleine
 * Match-Kasten mit den zwei Stimmen (NaechsterTeil). Keine Partnerknöpfe, kein PDF-Knopf.
 */
const zeile = (z: BfZeile) => <KursZeile key={z.ticker} name={z.name} ticker={z.ticker} bekanntFuer={z.text} />;

const BoykottfreieAktienVoll = () => {
  // Sanftes Einblenden beim Scrollen wie in den anderen Listen.
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const oben = videoListe.slice(0, VOR_KASTEN);
  const restVideo = videoListe.slice(VOR_KASTEN);
  const anzahl = alleBoykottfrei.length;

  return (
    <main className="bg-background" data-freebie="boykottfreie-aktien" data-vorlage="boykottfreie-aktien">
      <Seo
        title={`Halal und boykottfrei: ${anzahl} Aktien | finanzmuslim`}
        description={`Halal geprüfte Aktien, die auf keiner der geprüften Boykott-Listen stehen. Stand November 2026.`}
        path={BF_VOLL_PFAD}
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
            <span>Kein Boykott-Befund, auch keine eigene Firma in Israel. Stand 21. November 2026.</span>
          </p>
        </header>

        <section className="reveal mt-8" aria-labelledby="titel-video" data-video-liste>
          <h2 id="titel-video" className="text-[24px] font-extrabold leading-tight text-foreground">
            Die {videoListe.length} aus dem Video
          </h2>
          <div className="card-surface mt-3 overflow-hidden p-0">{oben.map(zeile)}</div>
        </section>

        <CheckEinstieg quelle={BF_QUELLE} className="mt-12" />

        <section className="reveal mt-10" aria-labelledby="titel-video-rest" data-video-liste>
          <h2 id="titel-video-rest" className="text-[24px] font-extrabold leading-tight text-foreground">
            Weiter mit den {restVideo.length} aus dem Video
          </h2>
          <div className="card-surface mt-3 overflow-hidden p-0">{restVideo.map(zeile)}</div>
        </section>

        <section className="reveal mt-10" aria-labelledby="titel-neu" data-neu-liste>
          <h2 id="titel-neu" className="text-[24px] font-extrabold leading-tight text-foreground">
            Neu dazu: {neuListe.length} Aktien
          </h2>
          <div className="card-surface mt-3 overflow-hidden p-0">{neuListe.map(zeile)}</div>
        </section>

        <section className="reveal mt-10" aria-labelledby="titel-weitere" data-weitere-liste>
          <h2 id="titel-weitere" className="text-[24px] font-extrabold leading-tight text-foreground">
            Weitere {weitereListe.length} ohne Befund
          </h2>
          <div className="card-surface mt-3 overflow-hidden p-0">{weitereListe.map(zeile)}</div>
        </section>

        {/* BK6: die neun aus dem Video mit leichtem Befund, damit Zuschauer ihren Namen finden. */}
        <section className="reveal mt-10" aria-labelledby="titel-nachgeprueft" data-nachgeprueft-liste>
          <h2 id="titel-nachgeprueft" className="text-[24px] font-extrabold leading-tight text-foreground">
            Aus dem Video nachgeprüft: {videoNachgeprueft.length} mit leichtem Befund
          </h2>
          <p className="mt-2 text-[16px] leading-snug text-foreground">
            Leichter Befund heißt: eine eigene Firma oder ein Standort in Israel, aber keine Lieferung an das Militär und keine Siedlung.
          </p>
          <div className="card-surface mt-3 overflow-hidden p-0">{videoNachgeprueft.map(zeile)}</div>
        </section>

        <BoykottfreiPruefung className="mt-12" />

        <NaechsterTeil quelle={BF_QUELLE} className="mt-12" />
      </div>
    </main>
  );
};

export default BoykottfreieAktienVoll;
