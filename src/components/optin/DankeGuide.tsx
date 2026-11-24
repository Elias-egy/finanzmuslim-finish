import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import Aufruf from "@/components/Aufruf";
import Seo from "@/components/Seo";
import { Wordmark } from "@/components/Wordmark";
import guideVorschau from "@/assets/halal-starter-guide-vorschau.webp";

/** Ziel des einen nächsten Schritts: der Match-Test, Quelle „danke“ (Elias AG4-08). */
export const DANKE_GUIDE_TEST = "/check?start=2&src=danke";

const gross = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * Die Glückwunsch-Seite nach dem Absenden des Guide-Formulars (AG4-08, Elias 24.11.2026: „die Seite, wenn man seine Mail
 * abschickt, hat er auch eine richtig gute … diese Glückwunschseite“). Muster der Acquisition-Seite nach dem Absenden
 * (acquisition.com ließ sich nicht öffnen, deshalb nach dem Muster gebaut): groß bestätigen, „schau in dein Postfach“,
 * was als Nächstes passiert, genau ein nächster Schritt. Hier der Match-Test. Weiß, ein Knopf, kein Menü.
 */
const DankeGuide = ({ vorname }: { vorname?: string }) => {
  const name = vorname?.trim() ? gross(vorname.trim()) : "";
  return (
    <div className="bg-background">
      <Seo
        title="Schau in dein Postfach | finanzmuslim"
        description="Dein Halal Starter Guide kommt per Mail."
        path="/danke/guide"
        noindex
      />

      <header className="container flex h-16 items-center justify-center">
        <Link to="/" aria-label="finanzmuslim Startseite" className="inline-flex min-h-[44px] items-center">
          <Wordmark className="text-xl" />
        </Link>
      </header>

      <main className="container pb-12 pt-4 md:pb-20 md:pt-10">
        <div className="mx-auto flex max-w-[560px] flex-col items-center text-center">
          <span
            className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gain text-white dark:text-[#0B0D12]"
            aria-hidden
          >
            <Check className="h-9 w-9" strokeWidth={3} />
          </span>

          <h1 className="headline mt-5 text-balance text-[34px] font-extrabold leading-[1.05] sm:text-[48px]">
            {name ? `Glückwunsch, ${name}!` : "Glückwunsch!"}
          </h1>
          <p role="status" className="mt-3 text-balance text-[18px] leading-snug text-foreground/80 sm:text-[21px]">
            Dein Halal Starter Guide kommt per Mail. <strong className="text-foreground">Schau jetzt in dein Postfach.</strong>
          </p>

          <img
            src={guideVorschau}
            alt="Der Halal Starter Guide: Titelseite und zwei Innenseiten"
            width={960}
            height={540}
            className="mt-2 h-auto w-full max-w-[320px] sm:max-w-[400px]"
            draggable={false}
          />

          <ol className="mt-4 w-full space-y-3 text-left">
            {[
              {
                t: "Öffne die Mail von Elias",
                x: "Sie kommt in wenigen Minuten. Nichts da? Schau im Spam-Ordner nach. Steht dort ein Bestätigungslink, tippe einmal darauf.",
              },
              {
                t: "Tippe auf den Link zum PDF",
                x: "14 Seiten. Von den Zinsen in deinem Alltag bis zu deinem ersten Halal-Investment.",
              },
              {
                t: "Hast du eine Frage?",
                x: "Antworte einfach auf die Mail. Ich lese jede einzeln.",
              },
            ].map((s, i) => (
              <li key={s.t} className="flex items-start gap-3.5 rounded-xl border border-border bg-card p-4">
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-[15px] font-bold text-primary-text">
                  {i + 1}
                </span>
                <span>
                  <span className="block text-[17px] font-bold leading-snug text-foreground">{s.t}</span>
                  <span className="mt-0.5 block text-[15px] leading-snug text-foreground/75">{s.x}</span>
                </span>
              </li>
            ))}
          </ol>

          <div className="mt-8 w-full rounded-2xl border-2 border-primary/30 bg-accent/60 p-6 text-center">
            <p className="text-[13px] font-bold uppercase tracking-wide text-primary-text">Dein nächster Schritt</p>
            <h2 className="headline mt-1.5 text-balance text-[24px] font-extrabold leading-tight sm:text-[30px]">
              Finde jetzt dein passendes Konto
            </h2>
            <p className="mt-2 text-[16px] leading-snug text-foreground/80">
              Ich habe alle Anbieter selbst als Muslim getestet. Ein paar Fragen, dann weißt du, welches Konto zu dir passt. Kostenlos, unter zwei Minuten.
            </p>
            <Aufruf to={DANKE_GUIDE_TEST} gross className="mt-5 block">
              Match finden
              <ArrowRight className="h-5 w-5" aria-hidden />
            </Aufruf>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DankeGuide;
