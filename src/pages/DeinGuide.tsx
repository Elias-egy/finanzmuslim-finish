import { useEffect, useRef } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { Download } from "lucide-react";
import Seo from "@/components/Seo";
import { guideBySchluessel } from "@/data/guides";
import "@/guides/guide.css";

import einsteiger from "@/guides/einsteiger.html?raw";
import fortgeschritten from "@/guides/fortgeschritten.html?raw";
import profi from "@/guides/profi.html?raw";
import xxlRoh from "@/guides/xxl.html?raw";

/* Der XXL-Guide zeigt das Logo der Nummer 1 über logo.dev. Das Token steht nicht im Guide-Text, es kommt
   hier aus der Umgebung; fehlt es, steht statt des Logos der Name (guides_v2.py schreibt ihn als alt). */
const logoToken = import.meta.env.VITE_LOVABLE_CONNECTOR_LOGO_DEV_API_KEY;
const xxl = logoToken
  ? xxlRoh.split("__LOGO_TOKEN__").join(logoToken)
  : xxlRoh.replace(/<img class="logo" src="https:\/\/img\.logo\.dev\/[^"]*" alt="([^"]*)">/g, '<span class="marke">$1</span>');

const inhalte: Record<string, string> = { einsteiger, fortgeschritten, profi, xxl };

/**
 * Der Guide als Seite statt als PDF im Postfach.
 *
 * Der Text ist derselbe wie im PDF, wortwoertlich, nur die Groessen sind aus
 * dem A4-Raster in eine Spalte umgerechnet. Umgebaut wird das von
 * ~/rebrand/freebies/fuer_website.py, nicht von Hand. Wer hier etwas am Text
 * aendert, verliert es beim naechsten Lauf.
 *
 * Die Seite steht auf noindex, taucht in keiner Navigation auf und ist aus
 * Sitemap und Vorrendern ausgenommen.
 */
const DeinGuide = () => {
  const { schluessel } = useParams();
  const guide = guideBySchluessel(schluessel);
  const navigate = useNavigate();
  const behaelter = useRef<HTMLDivElement>(null);

  /* Der Guide bringt eigene Verweise auf die Seite mit. Ohne diesen Griff
     laedt jeder davon die ganze Anwendung neu, und der Leser verliert seine
     Stelle im Guide. Fremde Adressen und der Partnerlink laufen weiter
     normal, letzterer muss den Server erreichen. */
  useEffect(() => {
    const el = behaelter.current;
    if (!el) return;
    const klick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a");
      if (!a) return;
      const ziel = a.getAttribute("href") ?? "";
      if (!ziel.startsWith("/") || ziel.startsWith("/out/")) return;
      e.preventDefault();
      navigate(ziel);
    };
    el.addEventListener("click", klick);
    return () => el.removeEventListener("click", klick);
  }, [navigate]);

  /* Sanftes Einblenden beim Scrollen wie im ETF-Plan (src/pages/EtfPlan.tsx), damit die Filter-Grafik des
     XXL-Guides dieselbe Bewegung zeigt wie dort (MC7d9g3, 31.10.2026). Ohne Beobachter steht die fertige Grafik. */
  useEffect(() => {
    const el = behaelter.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    el.querySelectorAll(".reveal").forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [guide]);

  if (!guide) return <Navigate to="/halal-guide" replace />;

  return (
    <main className="bg-surface">
      <Seo
        title={`${guide.titel} | finanzmuslim`}
        description="Dein persönlicher Guide."
        path={`/dein-guide/${guide.schluessel}`}
        noindex
      />

      {/* Kopf. Bleibt beim Scrollen oben, damit der Weg zum PDF und zurueck
          auf die Seite nie mehr als einen Griff entfernt ist. */}
      <div className="sticky top-[60px] z-30 border-b border-border bg-card md:top-[68px]">
        <div className="container flex flex-wrap items-center gap-x-4 gap-y-2 py-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-bold text-foreground md:text-[16px]">
              {guide.titel}
            </p>
            <p className="truncate text-[13px] text-muted-foreground">{guide.untertitel}</p>
          </div>
          <a
            href={guide.pdf}
            download={guide.pdfName}
            className="inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-lg bg-primary px-4 text-[14px] font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            <Download className="h-4 w-4" aria-hidden />
            Als PDF
          </a>
        </div>
      </div>

      <div className="py-6 md:py-10">
        <div
          ref={behaelter}
          className="guide-leser"
          /* Der Inhalt ist eine eigene Datei aus dem Repo, keine fremde
             Eingabe. Anders laesst sich das A4-Layout nicht uebernehmen,
             ohne den Text neu zu schreiben. */
          dangerouslySetInnerHTML={{ __html: inhalte[guide.stufe] }}
        />
      </div>
    </main>
  );
};

export default DeinGuide;
