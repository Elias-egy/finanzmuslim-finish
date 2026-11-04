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

  // Handy: Karte unten wie day-1.com. Laptop (ab 640 px): Fenster mittig, Seite dahinter abgedunkelt, größere
  // Schrift und Knöpfe über die ganze Breite (Elias CV4 04.11.2026: „Ein bisschen klein“, Vorbild-Bild
  // raw/bilder/2026-11-04-elias-cv4-cookie-banner-vorbild-laptop.png). Ablehnen bleibt ein sichtbarer Knopf.
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="einwilligung-titel"
      aria-describedby="einwilligung-text"
      className="fixed inset-x-0 bottom-0 z-[60] px-3 pb-[max(12px,env(safe-area-inset-bottom))] sm:inset-0 sm:flex sm:items-center sm:justify-center sm:bg-black/55 sm:px-6 sm:pb-0"
    >
      <div className="mx-auto w-full max-w-[420px] rounded-2xl border border-border bg-card p-5 shadow-[0_20px_60px_-15px_rgba(0,20,60,0.35)] sm:max-w-[620px] sm:p-9">
        <p id="einwilligung-titel" className="text-[18px] font-bold text-foreground sm:text-[24px]">
          Deine Privatsphäre zählt
        </p>
        <p id="einwilligung-text" className="mt-2 text-[15px] leading-relaxed text-muted-foreground sm:mt-4 sm:text-[17px]">
          Wir nutzen Cookies, um zu sehen, welche Seiten helfen und wo es hakt. Mehr in der{" "}
          <Link to="/datenschutz#messung" className="text-primary underline underline-offset-2">
            Datenschutzerklärung
          </Link>
          .
        </p>
        <div className="mt-4 grid gap-2.5 sm:mt-7 sm:gap-3">
          <button
            type="button"
            onClick={() => waehle("ja")}
            className="min-h-[48px] rounded-xl bg-primary px-5 text-[16px] font-semibold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:min-h-[56px] sm:text-[17px]"
          >
            Akzeptieren
          </button>
          <button
            type="button"
            onClick={() => waehle("nein")}
            className="min-h-[48px] rounded-xl border border-foreground/25 bg-card px-5 text-[16px] font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:min-h-[56px] sm:text-[17px]"
          >
            Ablehnen
          </button>
        </div>
      </div>
    </div>
  );
};

export default Einwilligung;
