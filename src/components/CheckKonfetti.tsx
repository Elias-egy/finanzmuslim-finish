import { useEffect, useMemo, useState } from "react";

/**
 * Mini-Konfetti beim Ergebnis (Elias RN11-02, wie in seiner Umfrage und bei Perspective). Gleiche Technik wie das Konfetti im
 * VergleichAssistent (CSS-Keyframes, keine Bibliothek), aber klein: wenige Teilchen, unter 1,5 s, entfernt sich selbst.
 * Nur bei prefers-reduced-motion: no-preference; ohne matchMedia (Tests) bleibt es aus.
 */
const FARBEN = ["#0057FA", "#705FF1", "#ff8a3d", "#FFBF2F", "#52B788", "#F25FB3"];
const ANZAHL = 26;
const MAX_MS = 1500;

const bewegungOk = () => typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: no-preference)").matches;

const CheckKonfetti = () => {
  const [da, setDa] = useState(bewegungOk);
  const teile = useMemo(
    () =>
      Array.from({ length: ANZAHL }, (_, i) => {
        const winkel = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.95;
        const weite = 90 + Math.random() * 150;
        return {
          farbe: FARBEN[i % FARBEN.length],
          dx: Math.cos(winkel) * weite,
          dy: Math.sin(winkel) * weite,
          dreh: (Math.random() - 0.5) * 720,
          dauer: 0.95 + Math.random() * 0.3,
          start: Math.random() * 0.12,
          rund: i % 3 === 0,
          breite: 6 + Math.random() * 4,
        };
      }),
    [],
  );

  useEffect(() => {
    if (!da) return;
    const t = window.setTimeout(() => setDa(false), MAX_MS);
    return () => window.clearTimeout(t);
  }, [da]);

  if (!da) return null;
  return (
    <div className="hc-konfetti" aria-hidden>
      {teile.map((t, i) => (
        <span
          key={i}
          style={
            {
              width: t.breite,
              height: t.rund ? t.breite : t.breite * 0.5,
              borderRadius: t.rund ? "50%" : 2,
              background: t.farbe,
              "--dx": `${t.dx}px`,
              "--dy": `${t.dy}px`,
              "--dreh": `${t.dreh}deg`,
              animationDuration: `${t.dauer}s`,
              animationDelay: `${t.start}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
};

export default CheckKonfetti;
