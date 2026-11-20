import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { BANNER_OEFFNEN, leseWahl, messungAktiv, setzeWahl, starteMessung, type Wahl } from "@/lib/messung";

/**
 * Einwilligung zur Messung (CV2, 04.11.2026; umgebaut SEO75, 08.11.2026; nachgemessen RN25L, 20.11.2026).
 * Vorbild ist das Cookie-Fenster von finanztip.de, das Elias geschickt hat
 * (raw/2026-11-08-elias-seo75-cookie-wie-finanztip.md, Bild raw/2026-11-08-elias-seo75-cookie-vorbild-finanztip.png).
 * RN25L hat das echte Fenster von Finanztip am Laptop und am Handy gemessen (Cookie-Dienst consentmanager.net):
 * keine Abdunkelung, Handy: Blatt unten mit runden oberen Ecken; Laptop: Leiste über die ganze Breite unten, links
 * Text, rechts die drei Knöpfe untereinander; Titel 18,7 px fett, Text 14,7 px (der erste Absatz fett, der zweite grau),
 * Knöpfe 34 px hoch, 14,7 px fett, ganz rund, „Alles erlauben“ gefüllt, „Nicht erforderliche ablehnen“ und
 * „Einstellungen verwalten“ mit Rand. Bei uns dasselbe in unserem Blau und mit unserem Text. Ablehnen bleibt in der
 * ersten Ebene mit einem Klick. Die Einstellungen öffnen sich als Fenster mit abgedunkelter Seite und haben einen
 * Schalter, weil wir nur eine Art Cookie nutzen (Messung). Erst nach dem Laden sichtbar, damit das Vorab-Rendern es
 * nicht in jede Seite schreibt.
 */
const KNOPF =
  "min-h-[34px] w-full rounded-full px-6 py-2 text-[14.67px] font-bold leading-4 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";
const VOLL = `${KNOPF} border border-primary bg-primary text-primary-foreground hover:bg-primary-hover`;
const RAND = `${KNOPF} border border-primary bg-card text-primary hover:bg-primary/5`;

const Einwilligung = () => {
  const [offen, setOffen] = useState(false);
  const [einstellungen, setEinstellungen] = useState(false);
  const [messen, setMessen] = useState(false);

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
    setEinstellungen(false);
  };

  // Wie Finanztip: ohne Abdunkelung. Handy: Blatt unten mit runden oberen Ecken. Laptop (ab 1024 px): Leiste unten über
  // die ganze Breite, links der Text, rechts die Knöpfe. Die Einstellungen öffnen als Fenster mit abgedunkelter Seite.
  return (
    <div
      role="dialog"
      aria-modal={einstellungen}
      aria-labelledby="einwilligung-titel"
      aria-describedby="einwilligung-text"
      className={
        einstellungen
          ? "fixed inset-0 z-[60] flex items-end justify-center bg-black/55 sm:items-center sm:px-6"
          : "fixed inset-x-0 bottom-0 z-[60]"
      }
    >
      <div
        className={
          einstellungen
            ? "w-full rounded-t-[24px] bg-card px-4 pb-[max(32px,env(safe-area-inset-bottom))] pt-6 shadow-[0_-8px_40px_-8px_rgba(0,20,60,0.35)] sm:max-w-[560px] sm:rounded-[24px] sm:p-8"
            : "w-full rounded-t-[24px] bg-card px-4 pb-[max(24px,env(safe-area-inset-bottom))] pt-6 shadow-[0_-2px_12px_0_rgba(0,0,0,0.18)] lg:flex lg:items-center lg:justify-between lg:gap-10 lg:rounded-t-[8px] lg:px-[35px] lg:pb-5 lg:pt-5"
        }
      >
        {!einstellungen ? (
          <>
            <div className="lg:max-w-[950px] lg:flex-1">
              <p id="einwilligung-titel" className="text-[18.67px] font-bold leading-tight text-foreground">
                Cookie-Einstellungen
              </p>
              <p id="einwilligung-text" className="mt-2.5 text-[14.67px] font-bold leading-[19px] text-foreground">
                Wir nutzen Cookies, damit unsere Seite funktioniert und wir sehen, welche Inhalte helfen und wo es hakt.
              </p>
              <p className="mt-3 text-[14.67px] leading-[19px] text-muted-foreground">
                In den Einstellungen kannst du wählen und deine Einwilligung jederzeit widerrufen. Mehr in{" "}
                <Link to="/datenschutz#messung" className="underline underline-offset-2">
                  Datenschutzerklärung
                </Link>{" "}
                und{" "}
                <Link to="/impressum" className="underline underline-offset-2">
                  Impressum
                </Link>
                .
              </p>
            </div>
            <div className="mt-6 grid gap-3 lg:mt-0 lg:w-[300px] lg:shrink-0 xl:w-[380px]">
              <button type="button" onClick={() => waehle("ja")} className={VOLL}>
                Alles erlauben
              </button>
              <button type="button" onClick={() => waehle("nein")} className={RAND}>
                Nicht erforderliche ablehnen
              </button>
              <button type="button" onClick={() => setEinstellungen(true)} className={RAND}>
                Einstellungen verwalten
              </button>
            </div>
          </>
        ) : (
          <>
            <p id="einwilligung-titel" className="text-[18.67px] font-bold leading-tight text-foreground">
              Cookie-Einstellungen
            </p>
            <p id="einwilligung-text" className="mt-3 text-[14.67px] leading-[19px] text-foreground">
              Wähle, was wir nutzen dürfen.
            </p>
            <ul className="mt-4 divide-y divide-border rounded-lg border border-border">
              <li className="flex items-center justify-between gap-4 px-4 py-3">
                <span className="text-[14.67px] text-foreground">
                  <span className="block font-semibold">Erforderlich</span>
                  Damit die Seite funktioniert
                </span>
                <span className="shrink-0 text-[14px] font-semibold text-muted-foreground">Immer an</span>
              </li>
              <li className="flex items-center justify-between gap-4 px-4 py-3">
                <label htmlFor="einwilligung-messen" className="text-[14.67px] text-foreground">
                  <span className="block font-semibold">Messung</span>
                  Welche Seiten helfen und wo es hakt
                </label>
                <Switch id="einwilligung-messen" checked={messen} onCheckedChange={setMessen} />
              </li>
            </ul>
            <div className="mt-5 grid gap-3">
              <button type="button" onClick={() => waehle(messen ? "ja" : "nein")} className={VOLL}>
                Auswahl speichern
              </button>
              <button type="button" onClick={() => waehle("ja")} className={RAND}>
                Alles erlauben
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Einwilligung;
