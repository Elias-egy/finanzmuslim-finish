import { useEffect, useRef } from "react";
import { Calculator, Check, Layers } from "lucide-react";

/**
 * Das Halal-Investment-OS als schwebender Baum für die Startseite (VS4, Elias 11.11.2026:
 * "die sollen so relativ im Bildschirm sich so bewegen. Das soll nicht wie ein Bild aussehen.
 * Als wäre es in der Page drin."). Vorbild, am 11.11. in Elias' Chrome angesehen:
 * skilltree.altari.ai, Abschnitt "It audits a business and marks the whole tree": weiß, graue
 * Äste, die nacheinander schwarz werden, in der Mitte ein bunter Punkteschwarm, Beschriftung klein
 * in Serifen-Versalien. Kein Rahmen: der Baum steht frei in der Karte.
 * Gezeichnet auf Canvas, damit sich alles flüssig bewegt; läuft nur, solange der Baum zu sehen ist.
 * Bei "Bewegung reduzieren" steht ein ruhiges Standbild.
 */

const BEREICHE = ["AKTIEN", "ETFS", "GOLD", "KRYPTO", "SUKUK", "ZAKAT", "DEPOTS"];
const BLAETTER_JE_BEREICH = 3;
const SCHWARM = 230;
// Bunte Punkte wie im Vorbild, dazu das finanzmuslim-Blau mehrfach.
const SCHWARM_FARBEN = [
  "#111111", "#111111", "#3b3f45", "#8a9099", "#1d6cf2", "#1d6cf2", "#5b9bff",
  "#e5484d", "#f2994a", "#30a46c", "#d6409f", "#c7cbd1",
];

type Punkt = { r: number; w: number; v: number; groesse: number; farbe: string; phase: number };

const OsBaum = () => {
  const huelle = useRef<HTMLDivElement>(null);
  const leinwand = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = leinwand.current;
    const box = huelle.current;
    if (!canvas || !box) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const ruhig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Fester Zufall, damit der Schwarm bei jedem Laden gleich aussieht.
    let saat = 7;
    const zufall = () => {
      saat = (saat * 16807) % 2147483647;
      return (saat - 1) / 2147483646;
    };
    const schwarm: Punkt[] = Array.from({ length: SCHWARM }, () => {
      const g = (zufall() + zufall() + zufall()) / 3; // dichter zur Mitte
      return {
        r: Math.abs(g - 0.5) * 2 * 0.11 + zufall() * 0.015,
        w: zufall() * Math.PI * 2,
        v: (zufall() - 0.5) * 0.5,
        groesse: zufall() < 0.12 ? 2.4 : 1.1 + zufall() * 1.1,
        farbe: SCHWARM_FARBEN[Math.floor(zufall() * SCHWARM_FARBEN.length)],
        phase: zufall() * Math.PI * 2,
      };
    });
    // Glut je Bereich und je Blatt: 1 = schwarz (gerade geprüft), 0 = grau.
    const glut = BEREICHE.map(() => 0);
    const blattGlut = BEREICHE.map(() => Array(BLAETTER_JE_BEREICH).fill(0));

    let breite = 0;
    let hoehe = 0;
    const groesse = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      breite = box.clientWidth;
      hoehe = box.clientHeight;
      canvas.width = Math.round(breite * dpr);
      canvas.height = Math.round(hoehe * dpr);
      canvas.style.width = `${breite}px`;
      canvas.style.height = `${hoehe}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    groesse();
    const beobachter = new ResizeObserver(groesse);
    beobachter.observe(box);

    // Maus zieht den Baum leicht mit, so wirkt er wie im Raum statt wie ein Bild.
    let zielX = 0;
    let zielY = 0;
    let mausX = 0;
    let mausY = 0;
    const beiMaus = (e: PointerEvent) => {
      const b = box.getBoundingClientRect();
      zielX = ((e.clientX - b.left) / b.width - 0.5) * 2;
      zielY = ((e.clientY - b.top) / b.height - 0.5) * 2;
    };
    const mausWeg = () => {
      zielX = 0;
      zielY = 0;
    };
    box.addEventListener("pointermove", beiMaus);
    box.addEventListener("pointerleave", mausWeg);

    const zeichne = (t: number) => {
      const s = Math.min(breite, hoehe);
      if (!s) return;
      mausX += (zielX - mausX) * 0.04;
      mausY += (zielY - mausY) * 0.04;
      const cx = breite / 2 + Math.sin(t / 4100) * s * 0.012 + mausX * s * 0.02;
      const cy = hoehe / 2 + Math.sin(t / 3300) * s * 0.018 + mausY * s * 0.02;
      const dreh = Math.sin(t / 9000) * 0.07 + mausX * 0.03;

      // Prüflauf: alle 1,5 s wird der nächste Bereich schwarz, die anderen kühlen langsam ab.
      const aktiv = Math.floor(t / 1500) % BEREICHE.length;
      const imSchritt = (t % 1500) / 1500;
      BEREICHE.forEach((_, i) => {
        const ziel = i === aktiv ? 1 : 0;
        glut[i] += (ziel - glut[i]) * (ziel ? 0.08 : 0.012);
        for (let j = 0; j < BLAETTER_JE_BEREICH; j++) {
          const an = i === aktiv && imSchritt > 0.15 + j * 0.18 ? 1 : 0;
          blattGlut[i][j] += (an - blattGlut[i][j]) * (an ? 0.12 : 0.012);
        }
      });

      ctx.clearRect(0, 0, breite, hoehe);
      const grau = (g: number, hell: number, dunkel: number) => {
        const v = Math.round(hell + (dunkel - hell) * g);
        return `rgb(${v},${v + 2},${v + 5})`;
      };

      const rNabe = s * 0.2;
      const rBlatt = s * 0.095;
      const n = BEREICHE.length;

      BEREICHE.forEach((name, i) => {
        const w = -Math.PI / 2 + (i / n) * Math.PI * 2 + dreh;
        const atem = Math.sin(t / 1800 + i) * s * 0.006;
        const nx = cx + Math.cos(w) * (rNabe + atem);
        const ny = cy + Math.sin(w) * (rNabe + atem);
        const g = glut[i];

        // Feine Punktlinie von der Mitte zur Nabe.
        ctx.setLineDash([1.5, 4]);
        ctx.strokeStyle = grau(g, 205, 120);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(w) * s * 0.1, cy + Math.sin(w) * s * 0.1);
        ctx.lineTo(nx, ny);
        ctx.stroke();
        ctx.setLineDash([]);

        for (let j = 0; j < BLAETTER_JE_BEREICH; j++) {
          const bw = w + (j - 1) * 0.62 + Math.sin(t / 2600 + i * 3 + j) * 0.04;
          const bx = nx + Math.cos(bw) * rBlatt;
          const by = ny + Math.sin(bw) * rBlatt;
          const bg = blattGlut[i][j];
          ctx.strokeStyle = grau(bg, 200, 20);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(nx, ny);
          ctx.lineTo(bx, by);
          ctx.stroke();
          ctx.fillStyle = grau(bg, 192, 15);
          ctx.beginPath();
          ctx.arc(bx, by, s * 0.0085 + bg * s * 0.002, 0, Math.PI * 2);
          ctx.fill();
        }

        // Nabe: grau, beim Prüfen schwarz mit leichtem Schein.
        if (g > 0.05) {
          ctx.fillStyle = `rgba(29,108,242,${0.12 * g})`;
          ctx.beginPath();
          ctx.arc(nx, ny, s * 0.032, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = grau(g, 190, 12);
        ctx.beginPath();
        ctx.arc(nx, ny, s * 0.015, 0, Math.PI * 2);
        ctx.fill();

        // Beschriftung außen, klein, Serifen-Versalien wie im Vorbild.
        const lx = cx + Math.cos(w) * (rNabe + rBlatt + s * 0.055);
        const ly = cy + Math.sin(w) * (rNabe + rBlatt + s * 0.055);
        ctx.font = `${Math.max(10, s * 0.024)}px Georgia, "Times New Roman", serif`;
        ctx.textAlign = Math.abs(Math.cos(w)) < 0.3 ? "center" : Math.cos(w) > 0 ? "left" : "right";
        ctx.textBaseline = "middle";
        ctx.fillStyle = grau(g, 150, 17);
        if ("letterSpacing" in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "2px";
        ctx.fillText(name, lx, ly);
      });

      // Schwarm in der Mitte: kreist langsam, jeder Punkt atmet für sich.
      schwarm.forEach((p, k) => {
        const w = p.w + (t / 1000) * p.v * 0.6;
        const r = (p.r + Math.sin(t / 900 + p.phase) * 0.006) * s;
        const x = cx + Math.cos(w) * r;
        const y = cy + Math.sin(w) * r * 0.92;
        if (k % 9 === 0) {
          ctx.strokeStyle = "rgba(60,64,70,0.18)";
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(x, y);
          ctx.stroke();
        }
        ctx.fillStyle = p.farbe;
        ctx.globalAlpha = 0.85;
        ctx.beginPath();
        ctx.arc(x, y, p.groesse * (s / 420), 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });
    };

    let rahmen = 0;
    let sichtbar = true;
    const lauf = (t: number) => {
      zeichne(t);
      if (sichtbar) rahmen = requestAnimationFrame(lauf);
    };
    const sicht = new IntersectionObserver(([e]) => {
      const vorher = sichtbar;
      sichtbar = e.isIntersecting;
      if (!ruhig && sichtbar && !vorher) rahmen = requestAnimationFrame(lauf);
    });
    sicht.observe(box);

    if (ruhig) {
      // Standbild mitten im Prüflauf, damit zwei Bereiche schwarz stehen.
      for (let t = 0; t < 2400; t += 16) zeichne(t);
    } else {
      rahmen = requestAnimationFrame(lauf);
    }

    return () => {
      cancelAnimationFrame(rahmen);
      beobachter.disconnect();
      sicht.disconnect();
      box.removeEventListener("pointermove", beiMaus);
      box.removeEventListener("pointerleave", mausWeg);
    };
  }, []);

  return (
    <div ref={huelle} className="os-baum relative mx-auto aspect-square w-full max-w-[340px] select-none md:max-w-[480px]" aria-hidden>
      <canvas ref={leinwand} className="absolute inset-0" />
      {/* Schwebende Teile des OS: kleine Karten, die für sich treiben. */}
      <span className="os-teil left-0 top-[4%] [animation-delay:-1s]">
        <Check className="h-3.5 w-3.5 text-[#30a46c]" strokeWidth={3} />
        Halal-Check
      </span>
      <span className="os-teil right-0 top-[9%] max-md:hidden [animation-duration:7.5s] [animation-delay:-3s]">
        <Layers className="h-3.5 w-3.5 text-primary" strokeWidth={2.5} />
        Mehrere Depots
      </span>
      <span className="os-teil bottom-[3%] left-0 [animation-duration:8.5s] [animation-delay:-5s]">
        <Calculator className="h-3.5 w-3.5 text-foreground" strokeWidth={2.5} />
        Zakat-Rechner
      </span>
    </div>
  );
};

export default OsBaum;
