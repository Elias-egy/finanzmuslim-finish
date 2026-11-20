import { lazy, Suspense, useEffect, useRef, useState } from "react";

/**
 * Tagesgewinner erst laden, wenn der Abschnitt in die Nähe des Bildschirms kommt (Nacht-Tempo, RN25L, 20.11.2026).
 * Er steht weit unter dem ersten Bildschirm, zieht aber die ganzen Kursreihen (kurse.json, rund 360 KB, 88 KB gzip)
 * samt Anlagenzeile und Rendite in das Paket der Startseite. Bis dahin steht die leere Karte in gleicher Größe da,
 * damit nichts springt. Der Vorab-Renderer beim Build (Chrome mit navigator.webdriver) lädt sofort, damit die
 * fertige HTML-Datei die Anlagen weiter enthält.
 */
const Tagesgewinner = lazy(() => import("@/components/Tagesgewinner"));

/** Gleiche Hülle wie die echte Karte (Tagesgewinner.tsx), Höhe gemessen am Handy und am Laptop. */
const Huelle = ({ children }: { children?: React.ReactNode }) => (
  <div className="min-h-[443px] w-full min-w-0 rounded-lg border border-border bg-card p-4 lg:min-h-[448px] lg:w-[500px] lg:p-6">
    <h3 className="text-[15px] font-bold text-foreground">Tagesgewinner</h3>
    {children}
  </div>
);

const TagesgewinnerSpaeter = () => {
  const [laden, setLaden] = useState(
    () => typeof window === "undefined" || typeof IntersectionObserver === "undefined" || navigator.webdriver === true,
  );
  const platz = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (laden) return;
    const el = platz.current;
    if (!el) return;
    const beobachter = new IntersectionObserver(
      (eintraege) => {
        if (eintraege.some((e) => e.isIntersecting)) {
          setLaden(true);
          beobachter.disconnect();
        }
      },
      { rootMargin: "1200px 0px" },
    );
    beobachter.observe(el);
    return () => beobachter.disconnect();
  }, [laden]);

  if (!laden) {
    return (
      <div ref={platz}>
        <Huelle />
      </div>
    );
  }
  return (
    <Suspense fallback={<Huelle />}>
      <Tagesgewinner />
    </Suspense>
  );
};

export default TagesgewinnerSpaeter;
