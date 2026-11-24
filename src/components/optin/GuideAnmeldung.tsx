import OptinKarte from "@/components/optin/OptinKarte";
import { optinFreebie } from "@/data/optin";
import guideVorschau from "@/assets/halal-starter-guide-vorschau.webp";

const guideFreebie = optinFreebie("guide")!;

/**
 * Der Guide-Block, ein Bauteil für /guide und die Startseite (AG4-06, Elias 24.11.2026: „Und auf der Main-Seite soll es
 * auch … das Design das gleiche sein.“): Pille, Titel mit der Psychologie „Finde heraus, was dich vom Halal-Investieren
 * abhält“, ein Satz, kleines Produktbild, Vorname, E-Mail, Knopf „Guide schicken“ und die eine Zeile zur
 * Datenschutzerklärung (steckt in der Karte).
 */
const GuideAnmeldung = ({ titelAls: Titel = "h1", eager = true }: { titelAls?: "h1" | "h2"; eager?: boolean }) => (
  <section className="container pb-10 pt-4 max-lg:[.einwilligung-offen_&]:pb-[380px] md:pb-16 md:pt-10">
    <div className="mx-auto flex max-w-[560px] flex-col items-center text-center">
      <span className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-[12px] font-bold uppercase tracking-wide text-primary-text sm:text-[13px]">
        <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
        Kostenloser Halal Starter Guide
      </span>

      <Titel className="headline mt-3 text-balance text-[28px] font-extrabold leading-[1.07] sm:text-[42px]">
        Finde heraus, was dich vom Halal-Investieren abhält
      </Titel>

      <p className="mt-2.5 text-[15.5px] leading-snug text-foreground/75 sm:text-[18px]">
        Hol dir deinen Halal Starter Guide in 30 Sekunden. Bei Fragen antworte einfach auf meine Mail, ich helfe dir.
      </p>

      <img
        src={guideVorschau}
        alt="Der Halal Starter Guide von finanzmuslim: Titelseite und zwei Innenseiten"
        width={960}
        height={540}
        {...(eager ? { fetchPriority: "high" as const } : { loading: "lazy" as const })}
        className="mt-1 h-auto w-full max-w-[360px] sm:max-w-[480px]"
        draggable={false}
      />

      <div className="mt-1 w-full">
        <OptinKarte freebie={guideFreebie} ohneUeberschrift knopfHinweis="Kostenlos. Dauert 30 Sekunden." />
      </div>
    </div>
  </section>
);

export default GuideAnmeldung;
