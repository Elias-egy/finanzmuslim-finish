import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Wordmark } from "@/components/Wordmark";
import Seo from "@/components/Seo";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      {/* Eigener Titel, sonst behaelt der Reiter den Titel der zuletzt
          besuchten Seite und die Fehlerseite sieht aus wie ein Treffer.
          noindex, weil es diese Adresse nicht gibt. */}
      <Seo
        title="Diese Seite gibt es nicht | finanzmuslim"
        description="Die aufgerufene Adresse führt ins Leere. Zurück zur Startseite oder in den Wissensbereich."
        path={location.pathname}
        noindex
      />
      <div className="text-center max-w-md">
        <Wordmark className="text-xl block mx-auto mb-8" />
        <p className="text-[12px] font-semibold tracking-wide text-primary">Fehler 404</p>
        <h1 className="headline text-4xl md:text-5xl mt-3">Diese Seite gibt es nicht.</h1>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          Die Adresse ist falsch geschrieben oder die Seite wurde verschoben.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/" className="pill-btn bg-primary text-white hover:bg-primary-hover">
            Zur Startseite
          </Link>
          <Link
            to="/wissen"
            className="pill-btn bg-transparent text-primary border border-border hover:border-primary"
          >
            Zum Wissensbereich
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
