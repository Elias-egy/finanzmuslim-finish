import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BANNER_OEFFNEN, leseWahl, messungAktiv, setzeWahl, starteMessung, type Wahl } from "@/lib/messung";

/**
 * Einwilligung zur Messung (CV2, 04.11.2026; umgebaut SEO75, 08.11.2026). Vorbild ist seit SEO74 das
 * Cookie-Fenster, das Elias geschickt hat (raw/2026-11-07-elias-seo74-cookie-banner-akzeptieren-vorne.md,
 * Bild raw/2026-11-07-elias-seo74-cookie-banner-vorbild.png): neutraler Titel, Akzeptieren als großer Knopf,
 * Ablehnen direkt darunter als gut lesbarer Textknopf. Ablehnen bleibt in der ersten Ebene, mit einem Klick,
 * gleich groß in der Schrift und in voller Textfarbe, nie grau oder versteckt (Graubereich klein bis mittel,
 * Elias genannt). Die Karte deckt nie die ganze Seite. Erst nach dem Laden sichtbar, damit das Vorab-Rendern
 * sie nicht in jede Seite schreibt.
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

  // Handy: Karte unten. Laptop (ab 640 px): Fenster mittig, Seite dahinter abgedunkelt, Knopf über die ganze
  // Breite (Elias CV4 04.11.2026: „Ein bisschen klein“). Eckig wie die Vergleiche, ein Radius von 8 px.
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="einwilligung-titel"
      aria-describedby="einwilligung-text"
      className="fixed inset-x-0 bottom-0 z-[60] px-3 pb-[max(12px,env(safe-area-inset-bottom))] sm:inset-0 sm:flex sm:items-center sm:justify-center sm:bg-black/55 sm:px-6 sm:pb-0"
    >
      <div className="mx-auto w-full max-w-[420px] rounded-lg border border-border bg-card p-5 shadow-[0_20px_60px_-15px_rgba(0,20,60,0.35)] sm:max-w-[620px] sm:p-9">
        <p id="einwilligung-titel" className="text-[16px] font-bold text-foreground sm:text-[18px]">
          Cookie-Einstellungen
        </p>
        <p id="einwilligung-text" className="mt-2 text-[15px] leading-relaxed text-foreground sm:mt-4 sm:text-[17px]">
          Wir nutzen Cookies, um zu sehen, welche Seiten helfen und wo es hakt. Mehr in der{" "}
          <Link to="/datenschutz#messung" className="text-primary underline underline-offset-2">
            Datenschutzerklärung
          </Link>
          .
        </p>
        <div className="mt-5 grid gap-1 sm:mt-7">
          <button
            type="button"
            onClick={() => waehle("ja")}
            className="min-h-[52px] rounded-lg bg-primary px-5 text-[17px] font-semibold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:min-h-[56px]"
          >
            Akzeptieren
          </button>
          <button
            type="button"
            onClick={() => waehle("nein")}
            className="min-h-[48px] rounded-lg px-5 text-[16px] font-semibold text-foreground underline-offset-4 transition-colors hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:text-[17px]"
          >
            Ablehnen
          </button>
        </div>
      </div>
    </div>
  );
};

export default Einwilligung;
