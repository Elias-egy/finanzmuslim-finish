import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { BANNER_OEFFNEN, leseWahl, messungAktiv, setzeWahl, starteMessung, type Wahl } from "@/lib/messung";

/**
 * Einwilligung zur Messung (CV2, 04.11.2026; umgebaut SEO75, 08.11.2026). Vorbild ist das Cookie-Fenster von
 * finanztip.de, das Elias geschickt hat (raw/2026-11-08-elias-seo75-cookie-wie-finanztip.md, Bild
 * raw/2026-11-08-elias-seo75-cookie-vorbild-finanztip.png): Blatt unten, fetter Titel, drei gleich breite Knöpfe
 * untereinander, „Alles erlauben“ gefüllt, „Nicht erforderliche ablehnen“ und „Einstellungen verwalten“ mit Rand
 * („Die klicken es einfach ganz schnell weg“). Ablehnen bleibt in der ersten Ebene mit einem Klick. Die
 * Einstellungen haben einen Schalter, weil wir nur eine Art Cookie nutzen (Messung). Erst nach dem Laden sichtbar,
 * damit das Vorab-Rendern es nicht in jede Seite schreibt.
 */
const KNOPF =
  "min-h-[44px] w-full rounded-lg px-4 text-[15px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";
const VOLL = `${KNOPF} bg-primary text-primary-foreground hover:bg-primary-hover`;
const RAND = `${KNOPF} border-[1.5px] border-primary bg-card text-primary hover:bg-primary/5`;

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

  // Handy: Blatt unten über die ganze Breite mit runden oberen Ecken wie Finanztip. Laptop (ab 640 px): Fenster
  // mittig, Seite dahinter abgedunkelt.
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="einwilligung-titel"
      aria-describedby="einwilligung-text"
      className="fixed inset-x-0 bottom-0 z-[60] sm:inset-0 sm:flex sm:items-center sm:justify-center sm:bg-black/55 sm:px-6"
    >
      <div className="w-full rounded-t-2xl border border-border bg-card px-5 pb-[max(16px,env(safe-area-inset-bottom))] pt-6 shadow-[0_-12px_40px_-12px_rgba(0,20,60,0.3)] sm:max-w-[560px] sm:rounded-2xl sm:p-8">
        <p id="einwilligung-titel" className="text-[20px] font-bold leading-tight text-foreground">
          Cookie-Einstellungen
        </p>
        {!einstellungen ? (
          <>
            <p id="einwilligung-text" className="mt-3 text-[15px] font-semibold leading-[1.45] text-foreground">
              Wir nutzen Cookies, damit unsere Seite funktioniert und wir sehen, welche Inhalte helfen und wo es hakt.
            </p>
            <p className="mt-2.5 text-[14px] leading-[1.45] text-muted-foreground">
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
            <div className="mt-5 grid gap-2.5">
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
            <p id="einwilligung-text" className="mt-3 text-[15px] leading-[1.45] text-foreground">
              Wähle, was wir nutzen dürfen.
            </p>
            <ul className="mt-4 divide-y divide-border rounded-lg border border-border">
              <li className="flex items-center justify-between gap-4 px-4 py-3">
                <span className="text-[15px] text-foreground">
                  <span className="block font-semibold">Erforderlich</span>
                  Damit die Seite funktioniert
                </span>
                <span className="shrink-0 text-[14px] font-semibold text-muted-foreground">Immer an</span>
              </li>
              <li className="flex items-center justify-between gap-4 px-4 py-3">
                <label htmlFor="einwilligung-messen" className="text-[15px] text-foreground">
                  <span className="block font-semibold">Messung</span>
                  Welche Seiten helfen und wo es hakt
                </label>
                <Switch id="einwilligung-messen" checked={messen} onCheckedChange={setMessen} />
              </li>
            </ul>
            <div className="mt-5 grid gap-2.5">
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
