import Seo from "@/components/Seo";
import OptinKarte from "@/components/optin/OptinKarte";
import { optinFreebie } from "@/data/optin";
import guideCover from "@/assets/halal-starter-guide-cover.webp";

/**
 * /guide: die eine Seite für den einen Guide, den Halal Starter Guide (AG4, 23.11.2026, Elias: „bei der Anmeldung zum
 * Guide kriegt man jetzt nur noch einen … Gib mir deinen Vorname-Mail und ich schicke den Guide direkt zu“).
 * Vorname und E-Mail, ein Knopf, kein Fragebogen: Die Karte schickt an Make (Szenario 7640717, Freebie „guide“),
 * dort landet die Adresse in „Guide-Eingang“, und ohne Stufe kommt der Guide über die Gruppe „Einsteiger“.
 * Danach die Danke-Seite /danke/guide. Ersetzt /halal-guide (leitet hierher) samt Stufenfrage und FAQ.
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
      <section className="container py-8 md:py-16 lg:py-20">
        <div className="mx-auto grid max-w-5xl grid-cols-[1fr_auto] items-center gap-x-5 gap-y-6 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-0">
          <div className="lg:col-start-1 lg:row-start-1 lg:self-end">
            <span className="badge-note">Kostenlos als PDF</span>
            <h1 className="headline mt-4 text-[34px] leading-[1.08] sm:text-[44px] lg:text-[52px] text-foreground">
              Halal Starter Guide
            </h1>
          </div>

          <div className="lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:justify-self-center">
            <img
              src={guideCover}
              alt="Titelseite des Halal Starter Guide von finanzmuslim: Halal starten"
              width={640}
              height={906}
              className="h-auto w-[116px] rounded-md shadow-[0_12px_32px_rgba(10,25,60,0.2)] sm:w-[190px] lg:w-[340px]"
              draggable={false}
            />
          </div>

          <div className="col-span-2 lg:col-span-1 lg:col-start-1 lg:row-start-2 lg:mt-5">
            <p className="max-w-xl text-[17px] leading-relaxed text-foreground/85 md:text-[19px]">
              Erkenne Zinsen im Alltag, wechsle zu einem Bankkonto ohne Zinsen und starte dein erstes Depot ohne die häufigsten Fehler. 14 Seiten, direkt in deinem Postfach.
            </p>
          </div>

          <div className="col-span-2 lg:col-span-1 lg:col-start-1 lg:row-start-3 lg:mt-8 lg:self-start">
            <div className="max-w-[520px]">
              <OptinKarte freebie={guideFreebie} ohneUeberschrift knopfHinweis="Ich schicke dir den Guide direkt zu." />
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
);

export default Guide;
