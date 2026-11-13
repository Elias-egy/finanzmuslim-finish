import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ImagePlus } from "lucide-react";
import { EINWILLIGUNG_TEXT } from "@/components/optin/OptinKarte";
import { ereignis } from "@/lib/messung";

/**
 * Mini-Formular „Halal-Investment-OS anfragen“ statt der FERTIG-Mail (Elias, CV28V 13.11.2026: „was ist deine Mail?
 * Hier jetzt den Screenshot hochladen und jetzt beantragen. Dann dieses herzlichen Glückwunsch. Du hast den Zugang
 * beantragt … Und der Bildschirm nach dem Abschicken ist … designed wie das OS“; vorher CV44P-14 12.11.: „Einfach Mail
 * und dann Screenshot und dann auf Fertig … der Sende-Button heißt dann Fertig“). Vault
 * raw/2026-11-13-elias-cv28v-01-mini-formular-os-anfragen.md und raw/2026-11-12-elias-cv44p-14-…
 *
 * Der Danke-Schirm folgt dem „Du bist fertig“-Schirm des OS (Entwurf app/style.css .obb-fin: Verlauf #041A4F →
 * #0A3BB0 → #2F74FF, Figtree 800 groß, Newsreader kursiv, Bogen unten, weißer runder Knopf).
 *
 * Versand: Noch ohne Server. Make-Szenario (Mail, Einwilligung, MailerLite-Gruppe „OS-Zugang“) und privater Speicher
 * für den Screenshot kommen mit dem Livegang (Plan PLAN-CV45P-ZUGANG-BEWERTUNG.md im Vault). Bis dahin zeigt das
 * Formular nach „Fertig“ nur den Danke-Schirm und schickt nichts weg.
 */

const MAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const DankeSchirm = ({ schliessen }: { schliessen: () => void }) => {
  const knopf = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    knopf.current?.focus();
    const esc = (e: KeyboardEvent) => e.key === "Escape" && schliessen();
    const alt = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", esc);
    return () => {
      window.removeEventListener("keydown", esc);
      document.body.style.overflow = alt;
    };
  }, [schliessen]);

  return createPortal(
    <div role="dialog" aria-modal="true" aria-labelledby="os-danke-titel" className="os-danke">
      <p className="os-danke-marke">Finanzmuslim</p>
      <div className="os-danke-text">
        <b id="os-danke-titel">Herzlichen Glückwunsch</b>
        <em>Du hast deinen Zugang beantragt. In Kürze hast du dein eigenes Halal-Investment-OS.</em>
      </div>
      <i className="os-danke-bogen" aria-hidden="true" />
      <button ref={knopf} type="button" onClick={schliessen} className="os-danke-knopf">
        Zurück zur Seite
      </button>
    </div>,
    document.body,
  );
};

export const OsAnfrage = ({ anbieter }: { anbieter: string }) => {
  const id = useId();
  const [email, setEmail] = useState("");
  const [bild, setBild] = useState<File | null>(null);
  const [vorschau, setVorschau] = useState<string | null>(null);
  const [gelesen, setGelesen] = useState(false);
  const [firma, setFirma] = useState("");
  const [hinweis, setHinweis] = useState<string | null>(null);
  const [fertig, setFertig] = useState(false);

  useEffect(() => {
    if (!bild) return setVorschau(null);
    const url = URL.createObjectURL(bild);
    setVorschau(url);
    return () => URL.revokeObjectURL(url);
  }, [bild]);

  const absenden = (e: React.FormEvent) => {
    e.preventDefault();
    if (!MAIL_OK.test(email.trim())) return setHinweis("Bitte gib deine E-Mail-Adresse ein.");
    if (!bild) return setHinweis("Bitte lade den Screenshot von deinem Depot hoch.");
    if (!gelesen) return setHinweis("Bitte setz das Häkchen.");
    setHinweis(null);
    if (firma) return; // Bot
    ereignis("os_anfrage", { anbieter });
    setFertig(true);
  };

  return (
    <>
      <form onSubmit={absenden} noValidate className="mt-3 rounded-[6px] border-2 border-border bg-card p-4 md:p-5">
        <p className="text-[19px] font-bold leading-tight">Halal-Investment-OS anfragen</p>

        <label htmlFor={`${id}-mail`} className="mt-4 block text-[15px] font-semibold">
          Deine E-Mail
        </label>
        <input
          id={`${id}-mail`}
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          placeholder="deine@email.de"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1.5 h-12 w-full rounded-[6px] border-2 border-border bg-background px-3 text-[17px] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />

        <p className="mt-4 text-[15px] font-semibold">Screenshot von deinem Depot</p>
        <label
          htmlFor={`${id}-bild`}
          className="mt-1.5 flex min-h-[64px] cursor-pointer items-center gap-3 rounded-[6px] border-2 border-dashed border-primary/50 bg-accent/40 px-3 py-2 text-[16px] font-semibold text-primary hover:border-primary"
        >
          {vorschau ? (
            <>
              <img src={vorschau} alt="Dein Screenshot" className="h-12 w-12 shrink-0 rounded-[4px] object-cover" />
              <span className="min-w-0 flex-1 truncate text-foreground">{bild?.name}</span>
              <span className="shrink-0 text-[15px] text-primary">ändern</span>
            </>
          ) : (
            <>
              <ImagePlus className="h-6 w-6 shrink-0" aria-hidden /> Screenshot hochladen
            </>
          )}
        </label>
        <input
          id={`${id}-bild`}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => setBild(e.target.files?.[0] ?? null)}
        />

        <input
          type="text"
          name="firma"
          value={firma}
          onChange={(e) => setFirma(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />

        <label className="mt-4 flex min-h-[44px] cursor-pointer items-start gap-3 py-1 text-[15px] leading-snug text-foreground">
          <input
            type="checkbox"
            checked={gelesen}
            onChange={(e) => setGelesen(e.target.checked)}
            className="mt-0.5 h-5 w-5 shrink-0 rounded accent-primary"
          />
          <span>{EINWILLIGUNG_TEXT}</span>
        </label>

        {hinweis && (
          <p role="alert" className="mt-2 text-[15px] text-destructive">
            {hinweis}
          </p>
        )}

        <button
          type="submit"
          className="mt-4 flex min-h-[56px] w-full items-center justify-center rounded-[6px] bg-primary px-4 text-[18px] font-bold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Fertig
        </button>
      </form>
      {fertig && <DankeSchirm schliessen={() => setFertig(false)} />}
    </>
  );
};

export default OsAnfrage;
