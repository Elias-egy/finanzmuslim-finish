import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import { Wordmark } from "@/components/Wordmark";

/**
 * Opt-in-Seiten für die Instagram-DM (`/gratis/…`) laufen ohne Menü (Baustein 29):
 * nur die Wortmarke oben, unten nur Impressum und Datenschutz. Alles andere mit Kopf und Fuß.
 */
const Schlicht = ({ children }: { children: ReactNode }) => (
  <div className="flex min-h-screen flex-col bg-hero">
    <header className="container flex h-16 items-center">
      <Link to="/" aria-label="finanzmuslim Startseite">
        <Wordmark className="text-xl" />
      </Link>
    </header>
    <main className="flex-1">{children}</main>
    <footer className="container flex gap-5 py-6 text-[13px] text-muted-foreground">
      <Link to="/impressum" className="min-h-[44px] inline-flex items-center hover:text-foreground">
        Impressum
      </Link>
      <Link to="/datenschutz" className="min-h-[44px] inline-flex items-center hover:text-foreground">
        Datenschutz
      </Link>
    </footer>
  </div>
);

export const Layout = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();
  if (pathname.startsWith("/gratis/")) return <Schlicht>{children}</Schlicht>;
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
};

export default Layout;
