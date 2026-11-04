import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BANNER_OEFFNEN, leseWahl, messungAktiv, setzeWahl, starteMessung, type Wahl } from "@/lib/messung";

/**
 * Einwilligung zur Messung (CV2, 04.11.2026). Vorbild ist das Banner von day-1.com, das Elias
 * geschickt hat: Karte unten, kurzer Text, zwei gleich große Knöpfe untereinander, Akzeptieren gefüllt,
 * Ablehnen mit Rand (raw/2026-11-04-elias-cv2-banner-wie-day-one.md). Gleich groß, weil ein
 * versteckter Ablehnen-Knopf vor deutschen Gerichten nicht hält. Die Karte deckt nie die ganze Seite.
 * Erst nach dem Laden sichtbar, damit das Vorab-Rendern sie nicht in jede Seite schreibt.
 */
const Einwilligung = () => {
  const [offen, setOffen] = useState(false);

  useEffect(() => {
    if (!messungAktiv()) return;
    const wahl = leseWahl();
    if (wahl === "ja") void starteMessung();
    if (wahl === null) setOffen(true);
    const oeffnen = () => setOffen(true);
    window.addEventListener(BANNER_OEFFNEN, oeffnen);
    return () => window.removeEventListener(BANNER_OEFFNEN, oeffnen);
  }, []);

  if (!offen) return null;

  const waehle = (wahl: Wahl) => {
    setzeWahl(wahl);
    setOffen(false);
  };

  return (
    <div
      role="dialog"
      aria-labelledby="einwilligung-titel"
      aria-describedby="einwilligung-text"
      className="fixed inset-x-0 bottom-0 z-[60] px-3 pb-[max(12px,env(safe-area-inset-bottom))] sm:inset-x-auto sm:left-5 sm:bottom-5 sm:px-0 sm:pb-0"
    >
      <div className="mx-auto w-full max-w-[420px] rounded-2xl border border-border bg-card p-5 shadow-[0_20px_60px_-15px_rgba(0,20,60,0.35)] sm:p-6">
        <p id="einwilligung-titel" className="text-[18px] font-bold text-foreground">
          Deine Privatsphäre zählt
        </p>
        <p id="einwilligung-text" className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
          Wir nutzen Cookies, um zu sehen, welche Seiten helfen und wo es hakt. Mehr in der{" "}
          <Link to="/datenschutz#messung" className="text-primary underline underline-offset-2">
            Datenschutzerklärung
          </Link>
          .
        </p>
        <div className="mt-4 grid gap-2.5">
          <button
            type="button"
            onClick={() => waehle("ja")}
            className="min-h-[48px] rounded-xl bg-primary px-5 text-[16px] font-semibold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Akzeptieren
          </button>
          <button
            type="button"
            onClick={() => waehle("nein")}
            className="min-h-[48px] rounded-xl border border-foreground/25 bg-card px-5 text-[16px] font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Ablehnen
          </button>
        </div>
      </div>
    </div>
  );
};

export default Einwilligung;
