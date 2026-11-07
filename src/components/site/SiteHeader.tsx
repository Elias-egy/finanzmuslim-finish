import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import { Wordmark } from "@/components/Wordmark";
import { navGroups, type NavEntry } from "@/components/site/navData";
import Suche from "@/components/site/Suche";
import { cn } from "@/lib/utils";
import { ANZAHL_HALAL_ANLAGEN } from "@/data/anzahlen";

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

/** Ziel des Kopfknopfs je Beitrag nach der Nische in SEITENKARTE.md (Spalte „Geld am Ende“); sonst der Depot-Vergleich. */
const KOPF_ZIEL: Record<string, { ziel: string; text: string; ohneZum?: boolean }> = {
  // Der Knopf nennt den Schmerz statt des Seitennamens (Elias, 04.11.2026, SEO51: „Gold ohne Preisaufschläge … Der Call
  // to Action muss halt sitzen“); belegt: Händler verkaufen nie zum reinen Metallpreis, der ETC kostet Ordergebühr und
  // laufende Kosten, aber keinen Händleraufschlag (edelmetallVergleich.ts, EDELMETALL_WEGE).
  "/blog/halal-gold-kaufen": { ziel: "/vergleich/edelmetalle", text: "Gold ohne Aufschlag", ohneZum: true },
  // Leasing (SEO54): die Rate, die dir gehört, statt einer Rate, die am Ende weg ist (Karte ist-leasing-haram.md, Station 8a).
  "/blog/ist-leasing-haram": { ziel: "/vergleich/depot", text: "Rate halal anlegen", ohneZum: true },
  // Versicherung (SEO57): Polster statt Police, das Geld für freiwillige Beiträge als Sparplan (REIHE-BEITRAEGE.md, Aufruf).
  "/blog/sind-versicherungen-haram": { ziel: "/vergleich/depot", text: "Halal vorsorgen", ohneZum: true },
  // Aktien (SEO61): der einfache Weg ist ein Halal ETF im Depot (Karte sind-aktien-haram.md, Station 1 Kopfknopf).
  "/blog/sind-aktien-haram": { ziel: "/vergleich/depot", text: "Halal anlegen", ohneZum: true },
};

export const SiteHeader = () => {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const [sucheOffen, setSucheOffen] = useState(false);
  const { pathname } = useLocation();
  // Der Hinweisstreifen gehoert auf die Startseite, nicht auf jede Unterseite.
  const aufStartseite = pathname === "/";
  // Nur auf diesem Beitrag (Elias SEO32, 02.11.2026: „nur hier“): Knopf zum Depot-Vergleich statt Suche
  // und „Dein Geld halal vermehren“ (vorher „Finde, was zu dir passt“; Elias CV4 04.11.2026: „das klickt glaube ich keiner“); beim Scrollen zieht sich die Leiste zur schwebenden Leiste zusammen wie bei frontal.
  // Seit SEO48 auf jedem Beitrag (Elias 04.11.2026 zu Halal Gold: „dieser Depot-Vergleich-Knopf ist hier nicht drin gewesen“).
  const beitragsKopf = pathname.startsWith("/blog/");
  const kopfZiel = KOPF_ZIEL[pathname] ?? { ziel: "/vergleich/depot", text: "Depot-Vergleich" };
  const [eng, setEng] = useState(false);
  useEffect(() => {
    if (!beitragsKopf) return setEng(false);
    // Rein ab 40 px, raus erst unter 16 px: sonst flackert die Leiste, wenn man um die Schwelle herum scrollt.
    const messen = () => setEng((war) => (war ? window.scrollY > 16 : window.scrollY > 40));
    messen();
    window.addEventListener("scroll", messen, { passive: true });
    return () => window.removeEventListener("scroll", messen);
  }, [beitragsKopf]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* Hinweisstreifen: violett, eine Zeile, kompakt. Genau wie vorher.
          Einzige Änderung gegenüber früher: er klebt nicht mehr oben, sondern
          scrollt mit weg. Sonst frisst er auf dem Handy dauerhaft Platz. */}
      {aufStartseite && (
        <Link
          to="/halal-anlagen"
          className="flex items-center justify-center gap-2 bg-violet px-4 py-1.5 text-center text-[15px] font-medium leading-[22px] text-violet-foreground transition-colors hover:bg-violet/90 sm:text-[16px]"
        >
          <span className="badge-new-inverted shrink-0">Neu</span>
          {/* Am Handy eine Zeile, sonst schiebt der Streifen die zweite Reihe der Vergleiche
              aus dem ersten Bildschirm (Elias, 14.10.2026: "Am Handy einzeilig"). */}
          <span className="whitespace-nowrap sm:hidden">
            <span className="font-bold">{ANZAHL_HALAL_ANLAGEN} Halal-Anlagen</span> an einem Ort →
          </span>
          <span className="hidden sm:inline">
            <span className="font-bold">Halal-Anlagen entdecken:</span>{" "}
            <span className="font-normal">{ANZAHL_HALAL_ANLAGEN} Anlagen an einem Ort →</span>
          </span>
        </Link>
      )}

      <header
        className={cn(
          "sticky top-0 z-50",
          beitragsKopf ? "beitragskopf h-[60px] md:h-[68px]" : "bg-primary",
          eng && "ist-eng",
        )}
        onMouseLeave={() => setOpenGroup(null)}
      >

        <div
          className={cn(
            "container flex h-[60px] items-center md:h-[68px]",
            // Am Handy enger (SEO33 gemessen: bei 390 brauchten Logo, Knopf und Menü 405 px, die Seite lief seitlich)
            beitragsKopf ? "beitragskopf-innen gap-3 sm:gap-6" : "gap-6",
          )}
        >
          <Link to="/" aria-label="finanzmuslim – zur Startseite" className="flex items-center">
            <Wordmark inverted className={cn(beitragsKopf ? "beitragskopf-marke text-[20px] sm:text-[23px] md:text-2xl" : "text-[23px] md:text-2xl")} />
          </Link>

          <nav
            className="hidden min-[900px]:flex items-center gap-6 lg:gap-8 mx-auto"
            aria-label="Hauptnavigation"
          >
            {navGroups.map((group) => (
              <div key={group.label} onMouseEnter={() => setOpenGroup(group.label)}>
                <button
                  type="button"
                  aria-expanded={openGroup === group.label}
                  onClick={() => setOpenGroup(openGroup === group.label ? null : group.label)}
                  className={cn(
                    "flex min-h-[44px] items-center gap-1 whitespace-nowrap text-[15px] font-medium transition-colors",
                    openGroup === group.label ? "text-white" : "text-white/90 hover:text-white",
                  )}
                >
                  {group.label}
                  <ChevronDown className="h-4 w-4" aria-hidden />
                </button>
              </div>
            ))}
          </nav>

          {/* Handy: nur Logo, Lupe, Menuestriche. Der Guide-Knopf frisst dort
              die halbe Breite und steht ohnehin im Menue. */}
          <div className="ml-auto min-[900px]:ml-0 flex items-center gap-1 min-[900px]:gap-2">
            {beitragsKopf ? (
              <Link to={kopfZiel.ziel} className="leuchtlinie leuchtlinie-hell inline-block">
                <span className="flex h-11 items-center whitespace-nowrap bg-white px-2.5 font-mono text-[12px] uppercase tracking-[0.02em] text-foreground min-[390px]:px-3 min-[390px]:tracking-[0.1em] min-[900px]:px-4">
                  {!kopfZiel.ohneZum && <span className="hidden min-[420px]:inline">Zum&nbsp;</span>}
                  {kopfZiel.text}
                </span>
              </Link>
            ) : (
              <>
                <button
                  type="button"
                  aria-label="Suche"
                  onClick={() => setSucheOffen(true)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-white/90 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <Search className="h-[22px] w-[22px]" aria-hidden />
                </button>
                <Link
                  to="/vergleich/start"
                  className="hidden min-[900px]:inline-flex min-h-[44px] items-center whitespace-nowrap rounded-lg bg-white px-5 text-[14px] font-bold text-primary transition-colors hover:bg-white/90"
                >
                  Dein Geld halal vermehren
                </Link>
              </>
            )}
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
                        {col.items.filter((i) => i.to).map((item) => (
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
                aria-label="Menü schließen"
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
                            {col.items.filter((i) => i.to).map((item) => (
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

              <Link
                to="/vergleich/start"
                onClick={() => setMobileOpen(false)}
                className="mt-4 mb-6 flex min-h-[44px] items-center justify-center rounded-lg bg-primary px-5 text-[15px] font-semibold text-primary-foreground"
              >
                Dein Geld halal vermehren
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
