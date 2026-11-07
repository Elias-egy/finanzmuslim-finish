import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import { Wordmark } from "@/components/Wordmark";
import { istBrokerStartSeite } from "@/lib/brokerStartPfad";

/**
 * Opt-in-Seiten für die Instagram-DM (`/gratis/…`) laufen ohne Menü (Baustein 29):
 * nur die Wortmarke oben, unten nur Impressum und Datenschutz. Die Danke-Seiten (`/danke/…`,
 * Baustein 30) bringen ihren eigenen Kopf mit Knopf mit, wie bei SKAILE (skaile-danke-02).
 * Die schlanken Depot-Startseiten (CV21F) laufen ganz weiß, die Wortmarke ohne Link: Der Knopf zum Anbieter ist das
 * einzige, was man oben antippen kann.
 * Alles andere mit Kopf und Fuß.
 */
const Schlicht = ({
  children,
  eigenerKopf = false,
  ruhig = false,
}: {
  children: ReactNode;
  eigenerKopf?: boolean;
  ruhig?: boolean;
}) => (
  <div className={`flex min-h-screen flex-col ${ruhig ? "bg-white" : eigenerKopf ? "bg-background" : "bg-hero"}`}>
    {!eigenerKopf && (
      <header className="container flex h-16 items-center">
        {ruhig ? (
          <Wordmark className="text-xl" />
        ) : (
          <Link to="/" aria-label="finanzmuslim Startseite">
            <Wordmark className="text-xl" />
          </Link>
        )}
      </header>
    )}
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
  const { pathname, search } = useLocation();
  if (istBrokerStartSeite(pathname, search)) return <Schlicht ruhig>{children}</Schlicht>;
  if (pathname.startsWith("/gratis/")) return <Schlicht>{children}</Schlicht>;
  if (pathname.startsWith("/danke/")) return <Schlicht eigenerKopf>{children}</Schlicht>;
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
};

export default Layout;
