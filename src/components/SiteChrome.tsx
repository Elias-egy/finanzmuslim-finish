import { Link } from "react-router-dom";
import logoMark from "@/assets/logo-mark.png";

/**
 * Leichte Kopf-/Fusszeile fuer Unterseiten (/tools, /renditerechner, /blog).
 * Die Homepage behaelt ihren eigenen Header mit Anker-Navigation.
 */

const navLinks = [
  { label: "Start", to: "/" },
  { label: "Tools", to: "/tools" },
  { label: "Blog", to: "/blog" },
];

export const SiteHeader = ({ active }: { active?: string }) => (
  <header className="sticky top-0 z-50 bg-nav/95 backdrop-blur-md border-b border-border/60 shadow-[0_4px_20px_-12px_rgba(0,0,0,0.08)]">
    <div className="container flex items-center h-[64px] md:h-[68px]">
      <Link to="/" className="flex items-center gap-2" aria-label="finanzmuslim – zur Startseite">
        <img
          src={logoMark}
          alt="finanzmuslim"
          className="h-7 md:h-8 w-auto object-contain select-none"
          draggable={false}
        />
      </Link>
      <nav className="flex items-center gap-6 md:gap-8 ml-auto mr-4 md:mr-8 font-[family-name:'Source_Sans_3',system-ui,sans-serif]" aria-label="Hauptnavigation">
        {navLinks.map((l) => (
          <Link
            key={l.label}
            to={l.to}
            aria-current={active === l.to ? "page" : undefined}
            className={`relative py-2 text-[15px] font-semibold transition-colors hover:text-primary after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-px after:bg-gold after:transition-all ${
              active === l.to ? "text-primary after:w-full" : "text-[#143328] after:w-0 hover:after:w-full"
            }`}
          >
            {l.label}
          </Link>
        ))}
      </nav>
      <Link
        to="/halal-guide"
        className="hidden sm:inline-flex items-center rounded-full bg-[#143328] text-white px-5 py-2.5 text-[14px] font-semibold hover:bg-[#1a4233] transition-colors font-[family-name:'Source_Sans_3',system-ui,sans-serif]"
      >
        Guide sichern
      </Link>
    </div>
  </header>
);

export const SiteFooter = () => (
  <footer className="bg-[hsl(40_12%_8%)] text-white/80 py-14">
    <div className="container flex flex-col items-center gap-4 text-center">
      <img src={logoMark} alt="finanzmuslim" className="h-10 w-auto brightness-0 invert opacity-90" />
      <div className="h-px w-16 bg-gold/60" />
      <p className="text-xs text-white/50 tracking-wide">
        © {new Date().getFullYear()} finanzmuslim. Alle Rechte vorbehalten.
      </p>
      <div className="flex gap-6 text-xs text-white/50">
        <Link to="/impressum" className="hover:text-white/80 transition-colors">
          Impressum
        </Link>
        <Link to="/datenschutz" className="hover:text-white/80 transition-colors">
          Datenschutz
        </Link>
        <Link to="/wie-ich-geld-verdiene" className="hover:text-white/80 transition-colors">
          Wie ich Geld verdiene
        </Link>
      </div>
    </div>
  </footer>
);
