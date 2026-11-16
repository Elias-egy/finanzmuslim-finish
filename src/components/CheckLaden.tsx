import { useEffect, useRef, useState } from "react";

/**
 * Ladescreen vor dem Ergebnis des Checks (RN10). Vorbild ist das vollblaue Ladebild aus dem OS-Onboarding (Vault
 * fundament/research/sources/W-15_screens/2026-11-09-skilltree/entwurf/app/app.js ob_wfLaden, style.css .obb-laden):
 * blau von unten hochgezogen, zwei Zeilen oben, eine Linie zeichnet sich in 6,5 s, vier Zeilen bekommen nacheinander ihr
 * Häkchen (Zeiten aus dem Videobogen 500/1000, 2500/3000, 4000/4500, 5500/6500 ms, Ende 7070 ms), dann zieht sich das Blau
 * als Bogen nach unten zurück.
 *
 * Elias RN9-01: „Dieser vollblaue Finanzmuslim-Ladescreen. Und dann sagt … passender Ersatz für Sparkasse wird gesucht.“
 * Elias RN9-02: „ein bisschen so orange … so ein Trommelwirbelgefühl … personalisiert, dass es auch Zeit kostet“. Darum:
 * Orange in den Knoten der Linie, im Zähler und im Aufleuchten am Ende; die Zeilen kommen aus den eigenen Antworten; die dritte
 * Zeile zählt die getesteten Konten oder Depots hoch, die vierte schlägt schneller, bevor das Match feststeht.
 * Bei „weniger Bewegung“ (prefers-reduced-motion) steht alles sofort fertig da und es geht nach 400 ms weiter.
 */
export type LadenText = {
  /** Kleine Zeile oben, zum Beispiel „Danke für deine Antworten!“. */
  oben: string;
  /** Die große Zeile: „Passender Ersatz für Sparkasse wird gesucht“. */
  titel: string;
  /** Genau vier Zeilen; die dritte enthält {n} und {max}, dort läuft der Zähler. */
  schritte: [string, string, string, string];
  /** Bis wohin der Zähler läuft (54 Konten oder 35 Depots, aus halalFinanzCheck.ts). */
  zaehlerMax: number;
};

const ZEITEN: [number, number][] = [
  [500, 1000],
  [2500, 3000],
  [4000, 4500],
  [5500, 6500],
];
const ENDE = 7070;
const VORHANG = 700;
const WEG = "M10 30 C20 30 22 36 30 36 S70 22 90 24 S130 38 150 36 S190 22 210 24 S226 30 232 30";
const KNOTEN: [number, number][] = [
  [30, 36],
  [90, 24],
  [150, 36],
  [210, 24],
];

const ruhigGewuenscht = () =>
  typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

type Props = { text: LadenText; onFertig: () => void; zu: boolean };

const CheckLaden = ({ text, onFertig, zu }: Props) => {
  const [stand, setStand] = useState<("aus" | "laedt" | "fertig")[]>(["aus", "aus", "aus", "aus"]);
  const [laeuft, setLaeuft] = useState(false);
  const [n, setN] = useState(0);
  const [knall, setKnall] = useState(false);
  const fertig = useRef(onFertig);
  fertig.current = onFertig;

  useEffect(() => {
    const uhren: number[] = [];
    const nach = (ms: number, f: () => void) => uhren.push(window.setTimeout(f, ms));
    if (ruhigGewuenscht()) {
      setStand(["fertig", "fertig", "fertig", "fertig"]);
      setLaeuft(true);
      setN(text.zaehlerMax);
      nach(400, () => fertig.current());
      return () => uhren.forEach(clearTimeout);
    }
    const bild = requestAnimationFrame(() => requestAnimationFrame(() => setLaeuft(true)));
    ZEITEN.forEach(([an, aus], i) => {
      nach(an, () => setStand((s) => s.map((x, j) => (j === i ? "laedt" : x))));
      nach(aus, () => setStand((s) => s.map((x, j) => (j === i ? "fertig" : x))));
    });
    // Zähler in der dritten Zeile: läuft in 1,4 s hoch, langsam am Ende (wie ein Trommelwirbel, der ausläuft).
    const [start, stopp] = [ZEITEN[2][0] - 1400, ZEITEN[2][1] - 100];
    const dauer = stopp - start;
    let zaehler = 0;
    const tick = () => {
      const t = Math.min(1, (performance.now() - beginn - start) / dauer);
      if (t >= 0) setN(Math.round(text.zaehlerMax * (1 - Math.pow(1 - t, 3))));
      if (t < 1) zaehler = requestAnimationFrame(tick);
    };
    const beginn = performance.now();
    nach(Math.max(0, start), () => (zaehler = requestAnimationFrame(tick)));
    nach(ENDE - 450, () => setKnall(true));
    nach(ENDE, () => fertig.current());
    return () => {
      uhren.forEach(clearTimeout);
      cancelAnimationFrame(bild);
      cancelAnimationFrame(zaehler);
    };
  }, [text.zaehlerMax]);

  const zeile = (s: string) => {
    const teile = s.split(/(\{n\}|\{max\})/);
    return teile.map((t, i) =>
      t === "{n}" ? (
        <b key={i} className="hc-laden-zahl">
          {n}
        </b>
      ) : t === "{max}" ? (
        <span key={i}>{text.zaehlerMax}</span>
      ) : (
        <span key={i}>{t}</span>
      ),
    );
  };

  return (
    <div
      className={`hc-laden${laeuft ? " hc-laden--laeuft" : ""}${knall ? " hc-laden--knall" : ""}${zu ? " hc-laden--zu" : ""}`}
      role="status"
      aria-live="polite"
      style={zu ? { animationDuration: `${VORHANG}ms` } : undefined}
    >
      <div className="hc-laden-innen">
        <p className="hc-laden-titel">
          <span>{text.oben}</span>
          <b>{text.titel} …</b>
        </p>
        <svg className="hc-laden-linie" viewBox="0 0 242 60" aria-hidden focusable="false">
          <path className="hc-laden-geist" d={WEG} />
          <path className="hc-laden-weg" d={WEG} pathLength={1} />
          {KNOTEN.map(([x, y], i) => (
            <circle key={i} className="hc-laden-k" data-an={stand[i] === "fertig" ? "" : undefined} cx={x} cy={y} r={4} />
          ))}
        </svg>
        <ul className="hc-laden-schritte">
          {text.schritte.map((s, i) => (
            <li key={i} data-stand={stand[i]} data-letzte={i === 3 ? "" : undefined}>
              <span className="hc-laden-h" aria-hidden>
                <svg viewBox="0 0 16 16">
                  <path d="M3 8.5l3.2 3L13 4.5" pathLength={1} />
                </svg>
              </span>
              <span>{i === 2 ? zeile(s) : s}</span>
            </li>
          ))}
        </ul>
      </div>
      <span className="hc-laden-ring" aria-hidden />
    </div>
  );
};

export const LADEN_VORHANG_MS = VORHANG;
export default CheckLaden;
