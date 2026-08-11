import { Link } from "react-router-dom";
import { ArrowRight, Percent, SlidersHorizontal, PieChart } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import Seo from "@/components/Seo";
import renditerechnerPlate from "@/assets/renditerechner-plate.jpg";

/**
 * /tools — redaktionelle Übersicht im hellen Editorial-System der Homepage.
 * Vier gleich große Kacheln; nur der Renditerechner ist live.
 */

const tools = [
  {
    title: "Renditerechner",
    text: "Berechne, wie dein Kapital durch regelmäßiges, islamkonformes Investieren wächst.",
    status: "live" as const,
    to: "/renditerechner",
    image: renditerechnerPlate,
    imagePos: "object-[center_45%]",
  },
  {
    title: "Zakat-Rechner",
    text: "Ermittle deine Zakat auf Erspartes, Gold und Investments, klar und nachvollziehbar.",
    status: "live" as const,
    to: "/zakat-rechner",
    icon: Percent,
  },
  {
    title: "Bereinigungsrechner",
    text: "Berechne, welchen Anteil deiner Erträge du bereinigen solltest.",
    status: "Bald" as const,
    icon: SlidersHorizontal,
  },
  {
    title: "Budget-Coach",
    text: "Dein Einkommen, klar geordnet, mit Empfehlungen für die kommenden Monate.",
    status: "In Arbeit" as const,
    icon: PieChart,
  },
];

const ToolTile = ({ tool }: { tool: (typeof tools)[number] }) => {
  const isLive = tool.status === "live";
  const hasImage = "image" in tool && Boolean(tool.image);
  const inner = (
    <div
      className={`group relative h-full min-h-[280px] md:min-h-[340px] overflow-hidden rounded-[1.5rem] md:rounded-[1.75rem] border ${
        isLive
          ? "bg-surface border-border/50 shadow-[0_10px_28px_-18px_rgba(20,51,40,0.35)] group-hover:border-primary/50 group-hover:shadow-[0_18px_34px_-16px_rgba(20,51,40,0.4)]"
          : "bg-surface border-border/40"
      } transition-[transform,box-shadow,border-color] duration-[340ms] ease-[cubic-bezier(0.16,1,0.3,1)]`}
    >
      {hasImage ? (
        <>
          <img
            src={(tool as { image: string }).image}
            alt=""
            aria-hidden
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-cover ${"imagePos" in tool ? tool.imagePos ?? "" : ""} transition-transform duration-700 motion-safe:group-hover:scale-[1.02]`}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-[52%] bg-gradient-to-t from-foreground/78 via-foreground/22 to-transparent"
            aria-hidden
          />
        </>
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center"
          aria-hidden
          style={{
            background:
              "repeating-linear-gradient(135deg, hsl(var(--border)) 0px, hsl(var(--border)) 1px, transparent 1px, transparent 14px), linear-gradient(160deg, hsl(var(--surface)) 0%, hsl(var(--muted)) 100%)",
          }}
        >
          {"icon" in tool && tool.icon && (
            <tool.icon className="h-10 w-10 text-foreground/25" strokeWidth={1.5} />
          )}
        </div>
      )}
      <div className="relative h-full flex flex-col justify-end p-6 md:p-8">
        <span
          className={`text-[11px] font-semibold tracking-wide ${
            hasImage ? "text-white" : "text-primary"
          }`}
        >
          {isLive ? "Live" : tool.status}
        </span>
        <h2 className={`headline text-2xl md:text-[26px] mt-1.5 ${hasImage ? "text-white" : "text-foreground"}`}>
          {tool.title}
          {isLive && (
            <ArrowRight
              className="ml-3 inline-block h-[0.62em] w-[0.62em] -translate-y-px text-current/80 transition-transform motion-safe:group-hover:translate-x-1"
              aria-hidden
            />
          )}
        </h2>
        <p className={`mt-2 text-[15px] leading-relaxed max-w-md ${hasImage ? "text-white/75" : "text-muted-foreground"}`}>
          {tool.text}
        </p>
      </div>
    </div>
  );

  return isLive && tool.to ? (
    <Link
      to={tool.to}
      className="group block h-full rounded-[1.5rem] md:rounded-[1.75rem] motion-safe:hover:-translate-y-2 motion-safe:hover:scale-[1.03] motion-safe:active:scale-[1.015] transition-transform duration-[340ms] ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
    >
      {inner}
    </Link>
  ) : (
    <div className="h-full" aria-disabled="true">
      {inner}
    </div>
  );
};

const Tools = () => (
  <div className="min-h-screen bg-surface">
    <Seo
      title="Halal Finanz-Tools & Rechner für Muslime | finanzmuslim"
      description="Kostenlose Rechner und Werkzeuge für islamkonformes Investieren: Renditerechner ohne Zinsen, Zakat-Rechner und mehr. Ohne Anmeldung nutzbar."
      path="/tools"
    />
    <SiteHeader active="/tools" />
    <main>
      <section className="container pt-14 md:pt-20 pb-16 md:pb-24">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-3 text-[12px] font-semibold tracking-wide text-primary">
            <span className="h-px w-6 bg-primary" aria-hidden /> Tools &amp; Wissen
          </span>
          <h1 className="headline text-4xl md:text-[52px] leading-[1.05] mt-4">
            Für jede Frage ein Werkzeug.
          </h1>
          <p className="mt-4 text-muted-foreground leading-relaxed text-base md:text-[17px]">
            Rechner und Ratgeber, die dir konkrete Antworten geben. Schritt für
            Schritt kommen neue dazu.
          </p>
        </div>

        <div className="mt-10 md:mt-14 grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
          {tools.map((t) => (
            <ToolTile key={t.title} tool={t} />
          ))}
        </div>

        <p className="mt-10 text-sm text-muted-foreground">
          Ein Tool fehlt dir? Schreib mir über den{" "}
          <a
            href="mailto:elias@finanzmuslim.com?subject=Tool-Wunsch"
            className="font-semibold text-primary underline underline-offset-4 hover:text-primary/80"
          >
            Kontakt
          </a>
          .
        </p>
      </section>
    </main>
    <SiteFooter />
  </div>
);

export default Tools;
