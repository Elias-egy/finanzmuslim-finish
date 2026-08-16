import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight, Menu, Search, X } from "lucide-react";
import { Wordmark } from "@/components/Wordmark";
import { navGroups, type NavEntry } from "@/components/site/navData";
import Suche from "@/components/site/Suche";
import { cn } from "@/lib/utils";

const SoonItem = ({ label }: { label: string }) => (
  <span className="flex min-h-[44px] items-center gap-2 text-[15px] text-muted-foreground/60 cursor-default">
    {label}
    <span className="badge-soon">bald</span>
  </span>
);

const Entry = ({ item, onClick }: { item: NavEntry; onClick?: () => void }) =>
  item.to ? (
    <Link
      to={item.to}
      onClick={onClick}
      className="flex min-h-[44px] items-center text-[15px] text-foreground hover:text-primary transition-colors"
    >
      {item.label}
    </Link>
  ) : (
    <SoonItem label={item.label} />
  );

export const SiteHeader = () => {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const [sucheOffen, setSucheOffen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* Hinweisstreifen. Scrollt mit weg, nur die Kopfleiste bleibt kleben,
          sonst frisst er auf dem Handy dauerhaft ein Sechstel des Bildschirms.
          Drei Zeilen: Etikett und Titel, ein Satz, Textlink mit Chevron. */}
      <Link
        to="/zakat-rechner"
        className="block bg-[hsl(247_84%_96%)] px-6 py-4 transition-colors hover:bg-[hsl(247_84%_93%)]"
      >
        <span className="mx-auto flex w-full max-w-[1200px] flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
          <span className="flex items-center gap-2">
            <span className="badge-new">Neu</span>
            <span className="text-[16px] font-bold text-foreground">Zakat-Rechner</span>
          </span>
          <span className="text-[16px] leading-[24px] text-muted-foreground">
            Berechne in zwei Minuten, wie viel Zakat du zahlst.
          </span>
          <span className="flex items-center gap-1 text-[16px] font-bold text-violet sm:ml-auto">
            Zum Rechner
            <ChevronRight className="h-4 w-4" aria-hidden />
          </span>
        </span>
      </Link>

      <header
        className="sticky top-0 z-50 bg-primary"
        onMouseLeave={() => setOpenGroup(null)}
      >

        <div className="container flex items-center h-[68px] gap-6">
          <Link to="/" aria-label="finanzmuslim – zur Startseite" className="flex items-center">
            <Wordmark inverted className="text-xl md:text-2xl" />
          </Link>

          <nav
            className="hidden min-[900px]:flex items-center gap-8 mx-auto"
            aria-label="Hauptnavigation"
          >
            {navGroups.map((group) => (
              <div key={group.label} onMouseEnter={() => setOpenGroup(group.label)}>
                <button
                  type="button"
                  aria-expanded={openGroup === group.label}
                  onClick={() => setOpenGroup(openGroup === group.label ? null : group.label)}
                  className={cn(
                    "flex min-h-[44px] items-center gap-1 text-[15px] font-medium transition-colors",
                    openGroup === group.label ? "text-white" : "text-white/85 hover:text-white",
                  )}
                >
                  {group.label}
                  <ChevronDown className="h-4 w-4" aria-hidden />
                </button>
              </div>
            ))}
            <span className="flex min-h-[44px] items-center gap-2 text-[15px] font-medium text-white/60 cursor-default">
              Halal-Check
              <span className="inline-flex items-center rounded-md border border-white/30 bg-white/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-white/80">
                bald
              </span>
            </span>
          </nav>

          {/* Handy: nur Logo, Lupe, Menuestriche. Der Guide-Knopf frisst dort
              die halbe Breite und steht ohnehin im Menue. */}
          <div className="ml-auto min-[900px]:ml-0 flex items-center gap-1 min-[900px]:gap-2">
            <button
              type="button"
              aria-label="Suche"
              onClick={() => setSucheOffen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-white/85 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Search className="h-[22px] w-[22px]" aria-hidden />
            </button>
            <Link
              to="/halal-guide"
              className="hidden min-[900px]:inline-flex min-h-[44px] items-center rounded-lg bg-white px-5 text-[14px] font-bold text-primary transition-colors hover:bg-white/90"
            >
              Guide sichern
            </Link>
            <button
              type="button"
              aria-label="Menü öffnen"
              onClick={() => setMobileOpen(true)}
              className="min-[900px]:hidden inline-flex h-11 w-11 items-center justify-center rounded-lg text-white"
            >
              <Menu className="h-[26px] w-[26px]" aria-hidden />
            </button>
          </div>
        </div>

        {/* Mega-Menü */}
        {openGroup && (
          <div className="hidden min-[900px]:block absolute inset-x-0 top-full bg-card border-b border-border shadow-[0_12px_28px_-18px_rgba(0,0,0,0.35)]">
            <div className="container py-8">
              <div className="grid grid-cols-4 gap-8">
                {navGroups
                  .find((g) => g.label === openGroup)!
                  .columns.map((col) => (
                    <div key={col.title}>
                      <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">
                        {col.title}
                      </p>
                      <ul>
                        {col.items.map((item) => (
                          <li key={item.label}>
                            <Entry item={item} onClick={() => setOpenGroup(null)} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile-Menü */}

      {mobileOpen && (
        <div className="min-[900px]:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[86%] max-w-sm bg-card overflow-y-auto">
            <div className="flex items-center justify-between h-[68px] px-4 border-b border-border">
              <Wordmark className="text-xl" />
              <button
                type="button"
                aria-label="Menü schliessen"
                onClick={() => setMobileOpen(false)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-foreground"
              >
                <X className="h-6 w-6" aria-hidden />
              </button>
            </div>

            <div className="px-4 py-2">
              {navGroups.map((group) => (
                <div key={group.label} className="border-b border-border">
                  <button
                    type="button"
                    aria-expanded={mobileSection === group.label}
                    onClick={() => setMobileSection(mobileSection === group.label ? null : group.label)}
                    className="flex w-full min-h-[44px] items-center justify-between text-[16px] font-semibold text-foreground"
                  >
                    {group.label}
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        mobileSection === group.label && "rotate-180",
                      )}
                      aria-hidden
                    />
                  </button>
                  {mobileSection === group.label && (
                    <div className="pb-3 space-y-4">
                      {group.columns.map((col) => (
                        <div key={col.title}>
                          <p className="mb-1 text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">
                            {col.title}
                          </p>
                          <ul>
                            {col.items.map((item) => (
                              <li key={item.label}>
                                <Entry item={item} onClick={() => setMobileOpen(false)} />
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="flex min-h-[44px] items-center gap-2 border-b border-border text-[16px] font-semibold text-muted-foreground/60">
                Halal-Check
                <span className="badge-soon">bald</span>
              </div>

              <Link
                to="/halal-guide"
                onClick={() => setMobileOpen(false)}
                className="mt-4 mb-6 flex min-h-[44px] items-center justify-center rounded-lg bg-primary px-5 text-[15px] font-semibold text-primary-foreground"
              >
                Guide sichern
              </Link>
            </div>
          </div>
        </div>
      )}

      <Suche offen={sucheOffen} schliessen={() => setSucheOffen(false)} />
    </>
  );
};

export default SiteHeader;
