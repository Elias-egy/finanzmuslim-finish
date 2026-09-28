import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import Countdown from "@/components/Countdown";
import { SPERRE } from "@/data/sperrfenster";
import { emailGueltig, wartelisteAnmelden, wartelisteDaten } from "@/lib/anmeldung";
import {
  guideSchaltetFrei,
  istFreigeschaltet,
  merkeFreischaltung,
  schluesselPasst,
  sperreZeigen,
} from "@/lib/sperrfenster";

/**
 * Sperrfenster bis zum Start am 9. Oktober 2026. Werte: `src/data/sperrfenster.ts`.
 *
 * Die Seite bleibt im Hintergrund sichtbar, das Fenster liegt als Portal am `body`.
 * Auf freien Pfaden wird es nur ausgeblendet, damit Eingabe und „Fast geschafft“
 * erhalten bleiben, wenn jemand den Datenschutz liest und zurückkommt.
 * Im vorgerenderten HTML steht es nie (`window.__PRERENDER__`).
 */

const Sperrfenster = () => {
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();

  const [freigeschaltet, setFreigeschaltet] = useState(() => istFreigeschaltet(Date.now()));
  const [vorbei, setVorbei] = useState(false);
  const [email, setEmail] = useState("");
  const [firma, setFirma] = useState("");
  const [zustand, setZustand] = useState<"offen" | "sendet" | "fertig">("offen");
  const [hinweis, setHinweis] = useState<string | null>(null);

  const zugang = new URLSearchParams(search).get("zugang");

  // Schlüssel aus der Adresse prüfen und danach aus der Adresszeile nehmen.
  useEffect(() => {
    if (zugang === null) return;
    let aktuell = true;
    schluesselPasst(zugang).then((passt) => {
      if (!aktuell) return;
      if (passt) {
        merkeFreischaltung();
        setFreigeschaltet(true);
      }
      const rest = new URLSearchParams(search);
      rest.delete("zugang");
      const neu = rest.toString();
      navigate({ pathname, search: neu ? `?${neu}` : "", hash }, { replace: true });
    });
    return () => {
      aktuell = false;
    };
  }, [zugang, search, pathname, hash, navigate]);

  useEffect(() => {
    if (guideSchaltetFrei(pathname)) {
      merkeFreischaltung();
      setFreigeschaltet(true);
    }
  }, [pathname]);

  const aus = typeof window === "undefined" || Boolean(window.__PRERENDER__);
  const sichtbar =
    !aus && !vorbei && zugang === null && sperreZeigen({ pfad: pathname, jetzt: Date.now(), freigeschaltet });

  // Seite dahinter stilllegen: kein Scrollen, kein Fokus, kein Klick.
  useEffect(() => {
    const html = document.documentElement;
    const wurzel = document.getElementById("root");
    if (sichtbar) {
      html.setAttribute("data-sperre", "an");
      wurzel?.setAttribute("inert", "");
      wurzel?.setAttribute("aria-hidden", "true");
    } else if (zugang === null && !aus) {
      html.removeAttribute("data-sperre");
      wurzel?.removeAttribute("inert");
      wurzel?.removeAttribute("aria-hidden");
    }
    return () => {
      html.removeAttribute("data-sperre");
      wurzel?.removeAttribute("inert");
      wurzel?.removeAttribute("aria-hidden");
    };
  }, [sichtbar, zugang]);

  const ende = useCallback(() => setVorbei(true), []);

  const absenden = async (e: React.FormEvent) => {
    e.preventDefault();
    if (zustand === "sendet") return;
    if (!emailGueltig(email)) {
      setHinweis("Bitte gib eine gültige E-Mail-Adresse ein.");
      return;
    }
    setHinweis(null);
    setZustand("sendet");
    try {
      await wartelisteAnmelden(
        wartelisteDaten({ email, pfad: pathname, lang: document.documentElement.lang, firma }),
      );
      setZustand("fertig");
    } catch {
      setZustand("offen");
      setHinweis("Das hat gerade nicht geklappt. Versuch es gleich noch einmal oder schreib an elias@finanzmuslim.com.");
    }
  };

  if (aus || !SPERRE.aktiv) return null;
  if (vorbei || freigeschaltet) return null;

  const fuss = (
    <p className="mt-6 flex items-center justify-center gap-3 text-[13px] text-white/70">
      <Link to="/impressum" className="underline-offset-2 hover:text-white hover:underline">
        Impressum
      </Link>
      <span aria-hidden className="text-white/30">
        |
      </span>
      <Link to="/datenschutz" className="underline-offset-2 hover:text-white hover:underline">
        Datenschutz
      </Link>
    </p>
  );

  return createPortal(
    <div
      id="sperrfenster"
      data-nosnippet
      role="dialog"
      aria-modal="true"
      aria-labelledby="sperrfenster-titel"
      hidden={!sichtbar}
      className="fixed inset-0 z-[2147483000] text-white [color-scheme:dark]"
    >
      {/* Glas auf eigener Ebene: die Unschärfe wird nicht mit jeder Sekunde neu berechnet. */}
      <div aria-hidden className="absolute inset-0 bg-[rgba(8,10,16,0.76)] backdrop-blur-[4px]" />

      <div className="relative h-[100dvh] overflow-y-auto overscroll-contain">
        <div className="mx-auto flex min-h-full w-full max-w-[560px] flex-col justify-center px-6 py-7 text-center">
          <p className="text-[15px] font-medium text-white/85">Start am 9. Oktober</p>

          {zustand === "fertig" ? (
            <div role="status">
              <div className="mt-5">
                <Countdown onEnde={ende} klein />
              </div>
              <span className="mx-auto mt-8 flex h-14 w-14 items-center justify-center rounded-full border-2 border-white">
                <Check className="h-7 w-7" strokeWidth={2.5} aria-hidden />
              </span>
              <h2
                id="sperrfenster-titel"
                className="mt-5 text-[38px] font-extrabold leading-[1.04] tracking-[-0.02em] sm:text-[52px]"
              >
                Fast geschafft
              </h2>
              <p className="mt-4 text-[17px] leading-snug text-white/90">
                Bestätige kurz den Link in deiner Mail. Danach kommt dein Bonus.
              </p>
              <p className="mt-3 text-[14px] text-white/65">Nichts angekommen? Sieh im Spam-Ordner nach.</p>
            </div>
          ) : (
            <>
              <h2
                id="sperrfenster-titel"
                className="mt-3 text-[38px] font-extrabold leading-[1.04] tracking-[-0.02em] sm:text-[56px]"
              >
                Islamisches Vergleichsportal
              </h2>
              <p className="mt-3 text-[16px] leading-snug text-white/90 [text-wrap:balance] sm:text-[18px]">
                Depot, Girokonto und Halal-Anlagen auf einen Blick.
              </p>

              <div className="mt-6">
                <Countdown onEnde={ende} />
              </div>

              <form onSubmit={absenden} noValidate className="mt-6">
                <label htmlFor="sperrfenster-email" className="block text-[17px] font-semibold">
                  Bleib auf dem neuesten Stand
                </label>
                <div className="mt-3 flex flex-col gap-2.5 sm:flex-row">
                  <input
                    id="sperrfenster-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    inputMode="email"
                    placeholder="Deine E-Mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={hinweis ? true : undefined}
                    aria-describedby={hinweis ? "sperrfenster-hinweis" : undefined}
                    className="h-[52px] w-full rounded-xl border-0 bg-white px-4 text-left text-[16px] text-[#0f1523] placeholder:text-[#5b6577] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0057FA] sm:flex-1"
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
                  <button
                    type="submit"
                    disabled={zustand === "sendet"}
                    className="h-[52px] w-full rounded-xl bg-[#0057FA] px-7 text-[17px] font-semibold text-white transition-colors hover:bg-[#1a6bff] focus:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-60 sm:w-auto"
                  >
                    {zustand === "sendet" ? "Wird gesendet …" : "Eintragen"}
                  </button>
                </div>
                {hinweis && (
                  <p id="sperrfenster-hinweis" role="alert" className="mt-2.5 text-[14px] text-[#ffb4a8]">
                    {hinweis}
                  </p>
                )}
              </form>

              <p className="mt-5 text-[15px] font-semibold leading-snug">
                Dein Bonus: alle {SPERRE.bonusAnzahl} Halal-Anlagen als Liste.
              </p>
              <p className="mt-1 text-[15px] leading-snug text-white/80 [text-wrap:balance]">
                Wo du welche am besten kaufen kannst, siehst du bald.
              </p>

              <p className="mt-5 text-[12.5px] leading-relaxed text-white/60">
                Du bekommst deinen Bonus direkt nach der Bestätigung, zum Start am 9. Oktober eine Mail und danach
                jeden Freitag meinen Freitagsbrief mit Tipps und Empfehlungen. Abmelden geht mit einem Klick. Hinweise
                zur Erfolgsmessung und zum Widerruf:{" "}
                <Link to="/datenschutz" className="text-white/85 underline underline-offset-2">
                  Datenschutz
                </Link>
              </p>
            </>
          )}

          {fuss}
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default Sperrfenster;
