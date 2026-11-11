import { useEffect, useRef, useState } from "react";

/**
 * Die echte Welt des Halal-Investment-OS auf der Startseite (VS4, Elias 11.11.2026: "dass links dieses OS
 * wirklich einfach wie das echte OS aussieht, was wir auch haben in der App"; "Dark Mode sieht auf jeden
 * Fall schon sehr gut aus"; "dass das so in der Welt ungefähr rumschwebt"; "wenn du etwas anklickst, dann
 * wird der Rest ein bisschen dunkler").
 *
 * Kein Bild und kein Nachbau: Geladen wird der OS-Entwurf selbst (Test-Depot, ?demo=echt), über die
 * Weiterleitung /os-entwurf auf demselben Localhost. Von außen werden nur Knöpfe und Kopf der App
 * ausgeblendet; die Welt bleibt, wie sie in der App ist. Bedienung: Überfahren oder Antippen eines Bereichs
 * dunkelt die anderen ab, sonst nichts (kein Zoom, kein Öffnen, kein Ziehen); der Ring dreht sich von
 * selbst Schritt für Schritt, solange niemand darauf zeigt. Mausrad und Wischen scrollen die Seite weiter.
 * Beim Einbau ersetzt eine eigene Fassung der Welt diesen Umweg (die App gehört der OS-Linie).
 */

const QUELLE = "/os-entwurf/app/?demo=echt#portfolio";

const SCHAUFENSTER_CSS = `
  html, body { overflow: hidden !important; }
  .ka-welt.ka-voll { position: fixed !important; inset: 0 !important; width: 100vw !important; height: 100vh !important;
    z-index: 2147483646 !important; background: var(--grund, #0B0C10) !important; touch-action: pan-y !important; }
  .ka-welt .ka-szene { cursor: default !important; touch-action: pan-y !important; }
  .ka-welt button { cursor: default !important; }
  .ka-unten, .ka-zurueck, .ka-nachbar, .ka-karte, .ka-mehr { display: none !important; }
  .sh-tour, .toast, .schleier { display: none !important; }
`;

type Fenster = Window & { eval: (code: string) => unknown };

const OsWelt = () => {
  const huelle = useRef<HTMLDivElement>(null);
  const rahmen = useRef<HTMLIFrameElement>(null);
  const [laden, setLaden] = useState(false);
  const [bereit, setBereit] = useState(false);

  // Erst laden, wenn der Block in die Nähe kommt: die App ist schwer, die Startseite soll schnell bleiben.
  useEffect(() => {
    const el = huelle.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setLaden(true), { rootMargin: "600px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!laden) return;
    const f = rahmen.current;
    if (!f) return;
    let suche = 0;
    let dreher = 0;
    let darauf = false;
    let sichtbar = true;
    const aufraeumen: Array<() => void> = [];

    const einrichten = () => {
      const win = f.contentWindow as Fenster | null;
      const doc = f.contentDocument;
      if (!win || !doc || !doc.querySelector(".ka-welt.ka-voll")) return false;

      const stil = doc.createElement("style");
      stil.textContent = SCHAUFENSTER_CSS;
      doc.head.appendChild(stil);
      // Dunkel wie in der App (Elias: "Der Dark Mode sieht auf jeden Fall schon sehr gut aus").
      doc.documentElement.dataset.theme = "dark";

      // Zugriff auf die Welt der App, ohne ihre Dateien zu ändern.
      win.eval(`window.__fmSchau = {
        w: () => [...ka_welten].find((w) => w.el.isConnected && w.el.classList.contains("ka-voll")),
        hover: (id) => { const w = window.__fmSchau.w(); if (w && w.ansicht === "ring") ka_hoverSetzen(w, id); },
        dreh: (r) => { const w = window.__fmSchau.w(); if (w && w.ansicht === "ring" && !w.hover) ka_drehen(w, r); },
      };`);
      const schau = (win as unknown as { __fmSchau: { hover: (id: string | null) => void; dreh: (r: number) => void } }).__fmSchau;

      // Alles außer Überfahren abfangen, bevor die App es sieht. Kein preventDefault: so scrollt die Seite weiter.
      const stopp = (e: Event) => {
        e.stopImmediatePropagation();
        if (e.type === "pointerdown" || e.type === "click") {
          const ziel = (e.target as Element | null)?.closest?.(".ka-schild") as HTMLElement | null;
          schau.hover(ziel?.dataset.kaBau ?? null);
        }
      };
      ["pointerdown", "pointerup", "pointermove", "click", "dblclick", "wheel", "touchstart", "touchmove", "keydown"].forEach((t) => {
        const fn = (e: Event) => {
          if (t === "pointermove" && (e as PointerEvent).pointerType === "mouse") return; // Überfahren bleibt
          stopp(e);
        };
        win.addEventListener(t, fn, { capture: true, passive: true });
        aufraeumen.push(() => win.removeEventListener(t, fn, { capture: true }));
      });
      const rein = () => (darauf = true);
      const raus = () => {
        darauf = false;
        schau.hover(null);
      };
      f.addEventListener("pointerenter", rein);
      f.addEventListener("pointerleave", raus);
      aufraeumen.push(() => {
        f.removeEventListener("pointerenter", rein);
        f.removeEventListener("pointerleave", raus);
      });

      // Der Ring dreht sich von selbst weiter, ruhig, nur wenn er zu sehen ist und niemand darauf zeigt.
      const ruhig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!ruhig) {
        dreher = window.setInterval(() => {
          if (!darauf && sichtbar && document.visibilityState === "visible") schau.dreh(1);
        }, 4200);
      }
      setBereit(true);
      return true;
    };

    const io = new IntersectionObserver(([e]) => (sichtbar = e.isIntersecting));
    if (huelle.current) io.observe(huelle.current);

    const beiLaden = () => {
      window.clearInterval(suche);
      let n = 0;
      suche = window.setInterval(() => {
        n += 1;
        try {
          if (einrichten() || n > 80) window.clearInterval(suche);
        } catch {
          window.clearInterval(suche);
        }
      }, 150);
    };
    f.addEventListener("load", beiLaden);
    return () => {
      f.removeEventListener("load", beiLaden);
      window.clearInterval(suche);
      window.clearInterval(dreher);
      io.disconnect();
      aufraeumen.forEach((a) => a());
    };
  }, [laden]);

  return (
    <div ref={huelle} className="os-welt relative h-[380px] w-full overflow-hidden md:h-[520px] lg:h-[560px]">
      {laden && (
        <iframe
          ref={rahmen}
          src={QUELLE}
          title="Dein Halal-Investment-OS"
          tabIndex={-1}
          className={`absolute inset-0 h-full w-full border-0 transition-opacity duration-700 ${bereit ? "opacity-100" : "opacity-0"}`}
        />
      )}
    </div>
  );
};

export default OsWelt;
