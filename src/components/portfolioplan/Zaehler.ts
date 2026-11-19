import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * Bewegung des Portfolioplans (CV28P, 09.11.2026, Laufzettel cv28p Gefühlsblatt Punkt 6: „Zahlen zählen 900 ms hoch
 * (requestAnimationFrame, ease-out) … prefers-reduced-motion schaltet alles still“).
 */
export const wenigBewegung = () =>
  typeof window !== "undefined" && Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);

/**
 * Zählt von 0 (beim ersten Mal) oder vom letzten Wert auf `ziel`, sobald `bereit` stimmt; ease-out, ganze Zahlen.
 * Ändert sich `ziel` später (Richtung geändert), zählt sie vom alten Wert weiter, nicht von vorn.
 */
export const useZaehler = (ziel: number, bereit: boolean, dauer = 900): number => {
  const [wert, setWert] = useState(0);
  const jetzt = useRef(0);
  useEffect(() => {
    if (!bereit) return;
    if (wenigBewegung() || typeof window.requestAnimationFrame !== "function") {
      jetzt.current = ziel;
      setWert(ziel);
      return;
    }
    const von = jetzt.current;
    const start = performance.now();
    let rahmen = 0;
    const schritt = (t: number) => {
      const p = Math.min(1, (t - start) / dauer);
      const weich = 1 - Math.pow(1 - p, 3);
      const n = Math.round(von + (ziel - von) * weich);
      jetzt.current = n;
      setWert(n);
      if (p < 1) rahmen = window.requestAnimationFrame(schritt);
    };
    rahmen = window.requestAnimationFrame(schritt);
    return () => window.cancelAnimationFrame(rahmen);
  }, [ziel, bereit, dauer]);
  return wert;
};

/** Wird einmal wahr, sobald das Element ins Bild kommt; danach bleibt es so (Kurven zeichnen sich beim Erscheinen). */
export const useImBild = (ref: RefObject<Element>): boolean => {
  const [da, setDa] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || da) return;
    if (typeof IntersectionObserver === "undefined") {
      setDa(true);
      return;
    }
    const beob = new IntersectionObserver(
      (eintraege) => {
        if (eintraege.some((e) => e.isIntersecting)) {
          setDa(true);
          beob.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    beob.observe(el);
    return () => beob.disconnect();
  }, [ref, da]);
  return da;
};
