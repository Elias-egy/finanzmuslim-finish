import { useEffect, useRef, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import stageBg from "@/assets/guide-stage-bg.webp";
import bookCut from "@/assets/guide-book-cut.webp";

/**
 * Premium-Produktbühne für den Halal Investment Guide.
 *
 * Desktop: Scroll-Choreografie ohne Scroll-Lock — die Sektion ist höher als
 * der Viewport, eine sticky Bühne hält das Bild, während --p (0→1) alle
 * Ebenen interpoliert. Vorwärts- und Rückwärtsscrollen sind voll reversibel.
 *
 * Mobile (<md): statische Premium-Komposition (--p fest auf 1) — eigene
 * Bühne mit Bodenkontakt im Lichtkegel, Text darunter, keine Choreografie.
 */

/** Gestaffeltes Einblenden: Element wird im Progress-Fenster [from, from+span] sichtbar. */
const fadeUp = (from: number, span = 0.16): CSSProperties => ({
  opacity: `clamp(0, (var(--p) - ${from}) / ${span}, 1)` as CSSProperties["opacity"],
  transform: `translateY(calc(26px * (1 - clamp(0, (var(--p) - ${from}) / ${span}, 1))))`,
});

/** Buch mit Sitzschatten und Spiegelung — identisch auf beiden Bühnen. */
const Book = ({ animated }: { animated: boolean }) => (
  <div className="relative w-full">
    {/* Keine echte 3D-Rotation: das Render bringt seine Perspektive mit,
        zusätzliches rotateY würde sie scheren. Settle = Heben + Wachsen. */}
    <div
      className="relative will-change-transform"
      style={
        animated
          ? {
              transform:
                "translateY(calc(7vh * (1 - clamp(0, var(--p) / 0.55, 1)))) " +
                "scale(calc(0.92 + 0.08 * clamp(0, var(--p) / 0.55, 1)))",
            }
          : undefined
      }
    >
      <img
        src={bookCut}
        alt="Halal Investment Guide – Premium Hardcover"
        width={557}
        height={825}
        className="w-full h-auto select-none drop-shadow-[0_35px_50px_rgba(0,0,0,0.55)]"
        draggable={false}
        decoding="async"
      />
      {/* Licht-Sweep: wandert einmal über die Coverfläche (nur Buchpixel via Maske) */}
      {animated && (
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden
          style={{
            WebkitMaskImage: `url(${bookCut})`,
            maskImage: `url(${bookCut})`,
            WebkitMaskSize: "100% 100%",
            maskSize: "100% 100%",
            background:
              "linear-gradient(105deg, transparent 40%, rgba(255,224,150,0.32) 50%, transparent 60%)",
            backgroundSize: "260% 100%",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "calc(130% - 260% * clamp(0, (var(--p) - 0.45) / 0.3, 1)) 0",
          }}
        />
      )}
    </div>

    {/* Sitzschatten auf der Steinfläche */}
    <div
      className="absolute left-1/2 -translate-x-1/2 bottom-[-3.5%] w-[78%] h-[6%] rounded-[50%] pointer-events-none"
      aria-hidden
      style={{
        background: "radial-gradient(ellipse, rgba(0,0,0,0.6) 0%, transparent 68%)",
        filter: "blur(10px)",
        opacity: "clamp(0.4, var(--p) + 0.4, 1)" as CSSProperties["opacity"],
      }}
    />

    {/* Spiegelung auf der polierten Fläche */}
    <img
      src={bookCut}
      alt=""
      aria-hidden
      className="absolute top-full left-0 w-full h-auto -scale-y-100 pointer-events-none select-none"
      style={{
        opacity: 0.22,
        filter: "blur(5px) brightness(0.7)",
        WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,0.9) 55%, transparent 82%)",
        maskImage: "linear-gradient(to top, rgba(0,0,0,0.9) 55%, transparent 82%)",
      }}
      decoding="async"
    />
  </div>
);

const GuideStage = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const mobile = window.matchMedia("(max-width: 767px)");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty("--p", "1");
      return;
    }
    // Permanenter rAF-Loop statt Scroll-/IO-Listener: eine
    // getBoundingClientRect-Abfrage pro Frame ist vernachlässigbar und
    // funktioniert auch dort, wo Scroll-Events oder IntersectionObserver
    // unzuverlässig sind (z. B. eingebettete Previews, Anker-Sprünge).
    let raf = 0;
    let last = -1;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      let p: number;
      if (mobile.matches) {
        p = 1; // statische Komposition, keine Scroll-Kopplung
      } else {
        const rect = el.getBoundingClientRect();
        // Weit außerhalb des Viewports: nichts zu interpolieren
        if (rect.bottom < -200 || rect.top > window.innerHeight + 200) return;
        const total = rect.height - window.innerHeight;
        // Sticky-Phase: 0 = Bühne rastet ein, 1 = Bühne wird freigegeben
        p = total > 40 ? Math.min(1, Math.max(0, -rect.top / total)) : 1;
      }
      if (Math.abs(p - last) > 0.0005) {
        last = p;
        el.style.setProperty("--p", p.toFixed(4));
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-background px-4 md:px-6 lg:px-10 md:h-[150vh]"
      style={{ "--p": 0 } as CSSProperties}
      aria-label="Halal Investment Guide"
    >
      {/* Anker so platziert, dass #guide-Sprünge bei fertig aufgebauter Szene landen.
          Braucht 1px Größe — 0×0-Ziele werden von scrollIntoView ignoriert. */}
      <div id="guide" className="absolute left-0 top-0 md:top-[39%] h-px w-px scroll-mt-20" aria-hidden />

      {/* Dunkles Produktfenster in der hellen Seite: Cream bleibt rundum sichtbar */}
      <div className="relative md:sticky md:top-5 md:h-[calc(100vh-2.5rem)] overflow-hidden md:flex md:items-center bg-[#0d241c] rounded-[1.5rem] md:rounded-[2.25rem]">
        {/* Desktop-Bühne: Plate mit langsamem Kamera-Settle */}
        <div className="absolute inset-0 hidden md:block" aria-hidden>
          <img
            src={stageBg}
            alt=""
            className="h-full w-full object-cover object-[62%_72%] will-change-transform"
            style={{
              transform: "scale(calc(1.045 - 0.045 * var(--p)))",
              transformOrigin: "62% 75%",
            }}
            decoding="async"
          />
          {/* Sanfte Abdunklung oben fuer Tiefe */}
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/30 to-transparent" />
        </div>

        {/* Mobile-Bühne: Buch mit Bodenkontakt im Lichtkegel, volle Breite */}
        <div className="relative md:hidden w-full aspect-[4/5] overflow-hidden" aria-hidden={false}>
          <img
            src={stageBg}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-[63%_74%]"
            decoding="async"
          />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#0d241c] to-transparent" />
          <div className="absolute left-1/2 -translate-x-1/2 bottom-[12%] w-[62%] max-w-[320px]">
            <Book animated={false} />
          </div>
          {/* Boden blendet in die dunkle Textzone darunter */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0d241c] to-transparent" />
        </div>

        <div className="container relative grid md:grid-cols-[0.95fr_1.15fr] items-center gap-0 md:gap-8 pt-10 pb-20 md:py-0">
          {/* Textspalte — erscheint gestaffelt aus der dunklen Zone */}
          <div className="text-center md:text-left max-w-xl mx-auto md:mx-0">
            <span
              className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-gold"
              style={fadeUp(0.12)}
            >
              <span className="h-px w-6 bg-gold/70" aria-hidden /> Der kostenlose Einstieg
            </span>
            <h2
              className="headline text-white text-3xl md:text-[44px] mt-4 leading-[1.05]"
              style={fadeUp(0.2)}
            >
              Der Halal <br className="hidden sm:block" />
              Investment Guide
            </h2>
            <p
              className="mt-4 text-white/75 leading-relaxed text-[15px] md:text-base max-w-sm mx-auto md:mx-0"
              style={fadeUp(0.28)}
            >
              Dein Einstieg in islamkonforme Geldanlage – kompakt, verständlich
              und sofort umsetzbar.
            </p>

            <div style={fadeUp(0.42)}>
              <Link
                to="/halal-guide"
                className="mt-8 inline-flex items-center justify-center rounded-full bg-[hsl(43_60%_95%)] text-[#143328] px-8 py-3.5 font-semibold shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] hover:bg-white transition-all"
              >
                <span className="text-[15px] md:text-base">Guide kostenlos sichern</span>
              </Link>
            </div>

            <p
              className="mt-5 inline-flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.22em] text-gold"
              style={fadeUp(0.5)}
            >
              <span className="h-px w-6 bg-gold/70" aria-hidden /> In unter 30 Sekunden
            </p>
          </div>

          {/* Desktop-Buch — steigt in den Lichtkegel, settelt in die Endposition */}
          <div className="hidden md:flex justify-center">
            <div className="w-[clamp(340px,30vw,480px)]">
              <Book animated />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default GuideStage;
