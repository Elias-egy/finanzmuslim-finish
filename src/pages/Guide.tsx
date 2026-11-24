import Seo from "@/components/Seo";
import OptinKarte from "@/components/optin/OptinKarte";
import { optinFreebie } from "@/data/optin";
import guideVorschau from "@/assets/halal-starter-guide-vorschau.webp";

/**
 * /guide: die eine Seite für den einen Guide, den Halal Starter Guide (AG4, 23.11.2026, Elias: „bei der Anmeldung zum
 * Guide kriegt man jetzt nur noch einen … Gib mir deinen Vorname-Mail und ich schicke den Guide direkt zu“).
 * Vorname und E-Mail, ein Knopf, kein Fragebogen: Die Karte schickt an Make (Szenario 7640717, Freebie „guide“),
 * dort landet die Adresse in „Guide-Eingang“, und ohne Stufe kommt der Guide über die Gruppe „Einsteiger“.
 * Danach die Danke-Seite /danke/guide. Ersetzt /halal-guide (leitet hierher) samt Stufenfrage und FAQ.
 * AG4-03 (24.11.2026, Elias: „Versuch die Seite mal so zu machen wie bei Acquisition.com“): Handy-Aufbau wie dessen
 * Roadmap-Seite: Marke, Titel mit der Psychologie „Find the constraint holding your business back“, ein Satz mit
 * „in 30 Sekunden“ und dem Hinweis, dass Elias per Mail erreichbar ist (statt „free call“), kleines Produktbild
 * (Titelseite und zwei Innenseiten, ohne Foto von Elias), Vorname, E-Mail, Knopf „Guide schicken“. Sonst nichts.
 */
const guideFreebie = optinFreebie("guide")!;

const Guide = () => (
  <div className="min-h-screen bg-background">
    <Seo
      title="Halal Starter Guide: kostenlos als PDF | finanzmuslim"
      description="Der kostenlose Halal Starter Guide auf 14 Seiten: Zinsen im Alltag erkennen, Bankkonto ohne Zinsen, erstes Depot und die häufigsten Fehler. Per Mail als PDF."
      path="/guide"
      brotkrumen={[{ name: "Halal Starter Guide", path: "/guide" }]}
    />

    <main>
      <section className="container pb-10 pt-4 max-lg:[.einwilligung-offen_&]:pb-[380px] md:pb-16 md:pt-10">
        <div className="mx-auto flex max-w-[560px] flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-[12px] font-bold uppercase tracking-wide text-primary-text sm:text-[13px]">
            <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
            Kostenloser Halal Starter Guide
          </span>

          <h1 className="headline mt-3 text-balance text-[28px] font-extrabold leading-[1.07] sm:text-[42px]">
            Finde heraus, was dich vom Halal-Investieren abhält
          </h1>

          <p className="mt-2.5 text-[15.5px] leading-snug text-foreground/75 sm:text-[18px]">
            Hol dir deinen Halal Starter Guide in 30 Sekunden. Bei Fragen antworte einfach auf meine Mail, ich helfe dir.
          </p>

          <img
            src={guideVorschau}
            alt="Der Halal Starter Guide von finanzmuslim: Titelseite und zwei Innenseiten"
            width={960}
            height={540}
            fetchPriority="high"
            className="mt-1 h-auto w-full max-w-[360px] sm:max-w-[480px]"
            draggable={false}
          />

          <div className="mt-1 w-full">
            <OptinKarte freebie={guideFreebie} ohneUeberschrift knopfHinweis="Kostenlos. Dauert 30 Sekunden." />
          </div>
        </div>
      </section>
    </main>
  </div>
);

export default Guide;
