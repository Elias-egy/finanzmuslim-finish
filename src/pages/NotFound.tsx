import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logoMark from "@/assets/logo-mark.png";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="text-center max-w-md">
        <img src={logoMark} alt="finanzmuslim" className="h-9 w-auto mx-auto mb-8" />
        <p className="text-[12px] font-semibold uppercase tracking-[0.25em] text-primary">Fehler 404</p>
        <h1 className="headline text-4xl md:text-5xl mt-3">Diese Seite gibt es nicht.</h1>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          Die Adresse ist falsch geschrieben oder die Seite wurde verschoben.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/" className="pill-btn bg-primary text-white hover:bg-primary-hover">
            Zur Startseite
          </Link>
          <Link
            to="/tools"
            className="pill-btn bg-transparent text-primary border border-border hover:border-primary"
          >
            Tools ansehen
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
