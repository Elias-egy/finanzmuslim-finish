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

/* Grundfarben der beiden Fassungen (VS5, Elias 11.11.: "nicht so als Karte …, sondern komplett, dass auch nach
   links und rechts, wenn du es dunkel machst, es dunkel ist, und bei hell einfach dass es in der Webseite bleibt").
   Die Welt im Rahmen ist durchsichtig; den Grund malt der Abschnitt selbst über die ganze Breite, darum gibt es
   keine Kante zwischen Welt und Abschnitt. Dunkel ist weniger schwarz als VS4 (VS4-03: "vielleicht ein bisschen
   zu schwarz"), ein Schieferblau nahe der dunklen OS-Welt (#20242D); hell ist reines Seitenweiß ohne Punktraster. */
export const OS_GRUND = { dunkel: "#161B27", hell: "#FFFFFF" } as const;

const schaufensterCss = (hell: boolean) => `
  html, body { overflow: hidden !important; background: transparent !important; color-scheme: light !important; }
  body * { visibility: hidden !important; }
  .ka-welt.ka-voll, .ka-welt.ka-voll * { visibility: visible !important; }
  .ka-welt.ka-voll { position: fixed !important; inset: 0 !important; width: 100vw !important; height: 100vh !important;
    z-index: 2147483646 !important; background: transparent !important; touch-action: pan-y !important;
    --ka-grund: ${hell ? OS_GRUND.hell : OS_GRUND.dunkel} !important; }
  .ka-welt .ka-szene { cursor: default !important; touch-action: pan-y !important; }
  .ka-welt button { cursor: default !important; }
  .ka-unten, .ka-zurueck, .ka-nachbar, .ka-karte, .ka-mehr { display: none !important; }
  .sh-tour, .toast, .schleier { display: none !important; }
  /* Handy (VS4-04): Bereichsnamen raus, damit die Welt groesser wird. Gesteuert ueber die Breite der Seite
     (Klasse fm-schmal), nicht des Rahmens: der Rahmen ist am Handy breiter als der Bildschirm. */
  .fm-schmal .ka-schilder, .fm-schmal .ka-schild { display: none !important; }
  /* Scrollen geht ueberall durch (VS5-05: „das Scrollen soll überall möglich sein … wenn ich auf der linken Seite
     vom Halal-Investment-OS bin, kann ich gar nicht scrollen“). Die App sperrt in ihrer Welt das Weiterreichen an die
     Seite (overscroll-behavior none, touch-action none); hier gibt die Welt Mausrad und Wischen an die Startseite ab. */
  html, body, .pf-welt, .pf-welt *, .ka-welt, .ka-welt * { overscroll-behavior: auto !important; }
  .pf-welt, .pf-welt *, .ka-welt, .ka-welt * { touch-action: pan-y !important; }
`;

type Fenster = Window & { eval: (code: string) => unknown };

const OsWelt = ({ hell = false, className = "" }: { hell?: boolean; className?: string }) => {
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
    let weltVersuch = 0;
    const aufraeumen: Array<() => void> = [];

    const einrichten = () => {
      const win = f.contentWindow as Fenster | null;
      const doc = f.contentDocument;
      if (!win || !doc) return false;
      if (!doc.querySelector(".ka-welt.ka-voll")) {
        // Das OS oeffnet das Portfolio seit CV44P in der Hauptansicht, die Welt ist dort ein Knopf (pfWeltAuf). Der Block
        // zeigt immer die Welt im Vollbild.
        // Beim Start setzt die App ihre Ansicht noch selbst; darum alle gut eine Sekunde erneut, bis die Welt steht.
        if (Date.now() - weltVersuch > 1200) {
          weltVersuch = Date.now();
          try {
            win.eval(
              "typeof pfWeltAuf === 'function' ? pfWeltAuf() : typeof pfVollbildAn === 'function' && pfVollbildAn()",
            );
          } catch {
            /* App noch nicht bereit, beim naechsten Versuch wieder */
          }
        }
        return false;
      }

      const stil = doc.createElement("style");
      stil.textContent = schaufensterCss(hell);
      doc.head.appendChild(stil);
      // Dunkel wie in der App (Elias: "Der Dark Mode sieht auf jeden Fall schon sehr gut aus") oder hell (VS4-03).
      doc.documentElement.dataset.theme = hell ? "light" : "dark";
      // Ohne Namen braucht die Welt am Handy keinen Rand dafuer: sie wird um 45 % groesser eingestellt (VS4-04
      // "Auf dem Handy sieht es noch zu klein aus"). Nach jeder Groessenaenderung stellt die App neu ein, darum hier wieder.
      const schmal = () => {
        const eng = window.innerWidth < 640;
        doc.documentElement.classList.toggle("fm-schmal", eng);
        if (eng) window.setTimeout(() => (win as unknown as { __fmSchau?: { gross: (f: number) => void } }).__fmSchau?.gross(1.45), 220);
      };
      schmal();
      window.addEventListener("resize", schmal);
      aufraeumen.push(() => window.removeEventListener("resize", schmal));

      // Zugriff auf die Welt der App, ohne ihre Dateien zu ändern.
      win.eval(`window.__fmSchau = {
        w: () => [...ka_welten].find((w) => w.el.isConnected && w.el.classList.contains("ka-voll")),
        hover: (id) => { const w = window.__fmSchau.w(); if (w && w.ansicht === "ring") ka_hoverSetzen(w, id); },
        dreh: (r) => { const w = window.__fmSchau.w(); if (w && w.ansicht === "ring" && !w.hover) ka_drehen(w, r); },
        gross: (f) => { const w = window.__fmSchau.w(); if (w && w.cam && w.cam.s <= w.cam.fit * 1.01) ka_zoom(w, f); },
      };`);
      const schau = (win as unknown as {
        __fmSchau: { hover: (id: string | null) => void; dreh: (r: number) => void; gross: (f: number) => void };
      }).__fmSchau;

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
    // Ist der Rahmen schon geladen, bevor dieser Teil läuft (schneller Zwischenspeicher), kommt kein load mehr: gleich einrichten.
    try {
      if (f.contentDocument?.readyState === "complete" && f.contentWindow?.location.href !== "about:blank") beiLaden();
    } catch {
      /* fremder Ursprung: nichts zu tun */
    }
    return () => {
      f.removeEventListener("load", beiLaden);
      window.clearInterval(suche);
      window.clearInterval(dreher);
      io.disconnect();
      aufraeumen.forEach((a) => a());
    };
  }, [laden, hell]);

  return (
    <div ref={huelle} className={`os-welt relative w-full overflow-hidden ${className}`}>
      {laden && (
        <iframe
          ref={rahmen}
          src={QUELLE}
          title="Dein Halal-Investment-OS"
          tabIndex={-1}
          style={{ colorScheme: "light", background: "transparent" }}
          className={`absolute inset-0 h-full w-full border-0 transition-opacity duration-700 ${bereit ? "opacity-100" : "opacity-0"}`}
        />
      )}
    </div>
  );
};

export default OsWelt;
