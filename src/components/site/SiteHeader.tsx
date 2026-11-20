import { lazy, Suspense, useEffect, useState } from "react";
import { MIT_OS } from "@/config/phase";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Menu, Moon, Search, Sun, X } from "lucide-react";
import { Wordmark } from "@/components/Wordmark";
import { navGroups, type NavEntry } from "@/components/site/navData";
import { cn } from "@/lib/utils";
import { ANZAHL_HALAL_ANLAGEN } from "@/data/anzahlen";
import { useThema } from "@/lib/thema";

// Nacht-Tempo (RN25L, 20.11.2026): Die Suche trägt die ganze Anlagendatenbank (rund 35 KB) und wird erst beim
// ersten Antippen der Lupe geladen; Berühren oder Fokus holen sie schon vorher.
const ladeSuche = () => import("@/components/site/Suche");
const Suche = lazy(ladeSuche);

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

/**
 * RN19 (Elias RN16-13/RN16-42: „nur noch diesen einen Call to Action … immer gleich“): Wo der Knopf oben im Beitrag nichts Eigenes zum Thema
 * hat, führt er zum Check und heißt wie überall „Match finden“. Die Girokonto-Beiträge öffnen den Bankkonto-Check, nie „Depot-Vergleich“.
 */
const KOPF_STANDARD = { ziel: "/check?quelle=kopf", text: "Match finden", ohneZum: true };
const KOPF_KONTO = { ziel: "/check?art=konto&quelle=kopf", text: "Match finden", ohneZum: true };

/** Ziel des Kopfknopfs je Beitrag nach der Nische in SEITENKARTE.md (Spalte „Geld am Ende“); sonst der Check (KOPF_STANDARD). */
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
  // Kredit (SEO71): Sparen statt Kredit fängt beim Konto ohne Dispo an (Seiten-Prüfer SEO70 S1, Karte halal-kredit Money Page Girokonto).
  "/blog/halal-kredit": { ziel: "/vergleich/girokonto", text: "Konto ohne Zinsen", ohneZum: true },
  "/blog/girokonto-ohne-zinsen": KOPF_KONTO,
  "/blog/dispo-und-schulden": KOPF_KONTO,
  "/blog/kreditkarte-halal": KOPF_KONTO,
};

export const SiteHeader = () => {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const [sucheOffen, setSucheOffen] = useState(false);
  const [sucheGeladen, setSucheGeladen] = useState(false);
  const { pathname } = useLocation();
  // Der Hinweisstreifen gehoert auf die Startseite, nicht auf jede Unterseite.
  const aufStartseite = pathname === "/";
  // Nur auf diesem Beitrag (Elias SEO32, 02.11.2026: „nur hier“): Knopf zum Depot-Vergleich statt Suche
  // und „Dein Geld halal vermehren“ (vorher „Finde, was zu dir passt“; Elias CV4 04.11.2026: „das klickt glaube ich keiner“); beim Scrollen zieht sich die Leiste zur schwebenden Leiste zusammen wie bei frontal.
  // Seit SEO48 auf jedem Beitrag (Elias 04.11.2026 zu Halal Gold: „dieser Depot-Vergleich-Knopf ist hier nicht drin gewesen“).
  const beitragsKopf = pathname.startsWith("/blog/");
  const kopfZiel = KOPF_ZIEL[pathname] ?? KOPF_STANDARD;
  const { dunkel, umschalten } = useThema();
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
      {/* RN5: Phase 1 ohne OS, der Streifen kommt erst mit Phase 2 (src/config/phase.ts). */}
      {MIT_OS && aufStartseite && (
        /* VS5-06: der Streifen wirbt für das Halal-Investment-OS, „Neu“ runder („oben in lila, auch werbung für dein halal investment“) */
        <a
          href="/investment-os/"
          className="flex items-center justify-center gap-2 bg-violet dark:bg-[#5340CF] dark:text-white px-4 py-1.5 text-center text-[15px] font-medium leading-[22px] text-violet-foreground transition-colors hover:bg-violet/90 dark:hover:bg-[#5340CF]/90 sm:text-[16px]"
        >
          <span className="badge-new-inverted shrink-0 !rounded-full !px-2.5">Neu</span>
          {/* Am Handy eine Zeile, sonst schiebt der Streifen die zweite Reihe der Vergleiche
              aus dem ersten Bildschirm (Elias, 14.10.2026: "Am Handy einzeilig"). */}
          <span className="whitespace-nowrap sm:hidden">
            <span className="font-bold">Dein Halal-Investment-OS</span> →
          </span>
          <span className="hidden sm:inline">
            <span className="font-bold">Dein Halal-Investment-OS:</span>{" "}
            <span className="font-normal">kostenlos für jeden Muslim, der investiert →</span>
          </span>
        </a>
      )}

      {/* RN19-04 („wie live“) und RN19-03 (die Halal-Datenbank wird nicht gefunden): Phase 1 trägt wieder die lila Leiste der Live-Seite,
          sie ist der Weg von oben zur Datenbank. Handy eine Zeile, ab sm mit Vorspann (wie live, Stand 19.11.2026). */}
      {!MIT_OS && aufStartseite && (
        <Link
          to="/halal-anlagen"
          className="flex items-center justify-center gap-2 bg-violet dark:bg-[#5340CF] dark:text-white px-4 py-1.5 text-center text-[15px] font-medium leading-[22px] text-violet-foreground transition-colors hover:bg-violet/90 dark:hover:bg-[#5340CF]/90 sm:text-[16px]"
        >
          <span className="badge-new-inverted shrink-0 !rounded-full !px-2.5">Neu</span>
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
          <Link to="/" aria-label="finanzmuslim, zur Startseite" className="flex items-center">
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
            {/* RN19: „alles Mögliche findest du bei Dokumente“ (Elias RN18-20). Ab 1040 px in der Leiste, unter 900 px im Menü,
                dazwischen nur in der Fußleiste, weil die Leiste dort schon voll sein könnte (ungemessen). */}
            <Link
              to="/dokumente"
              onMouseEnter={() => setOpenGroup(null)}
              className="hidden min-h-[44px] items-center whitespace-nowrap text-[15px] font-medium text-white/90 transition-colors hover:text-white min-[1040px]:flex"
            >
              Dokumente
            </Link>
          </nav>

          {/* Handy: nur Logo, Lupe, Menuestriche. Der Guide-Knopf frisst dort
              die halbe Breite und steht ohnehin im Menue. */}
          <div className="ml-auto min-[900px]:ml-0 flex items-center gap-1 min-[900px]:gap-2">
            {/* Hell/dunkel: Grundeinstellung nach Gerät, Wahl wird gemerkt (gleicher Schlüssel wie die Verkaufsseite) */}
            <button
              type="button"
              aria-pressed={dunkel}
              aria-label={dunkel ? "Hellen Modus einschalten" : "Dunklen Modus einschalten"}
              onClick={umschalten}
              // Auf den Beiträgen ist die Leiste am schmalen Handy schon voll (langer Knopftext): dort sitzt der Schalter im Menü.
              className={cn(
                "inline-flex h-11 w-11 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10",
                beitragsKopf && "max-[419px]:hidden",
              )}
            >
              {dunkel ? <Sun className="h-5 w-5" aria-hidden /> : <Moon className="h-5 w-5" aria-hidden />}
            </button>
            {beitragsKopf ? (
              <Link to={kopfZiel.ziel} className="inline-block rounded-full">
                <span className="flex h-11 items-center whitespace-nowrap rounded-full bg-white px-3.5 text-[14px] font-semibold text-primary min-[900px]:px-5 min-[900px]:text-[15px]">
                  {!kopfZiel.ohneZum && <span className="hidden min-[420px]:inline">Zum&nbsp;</span>}
                  {kopfZiel.text}
                </span>
              </Link>
            ) : (
              <>
                <button
                  type="button"
                  aria-label="Suche"
                  onClick={() => {
                    setSucheGeladen(true);
                    setSucheOffen(true);
                  }}
                  onPointerEnter={() => void ladeSuche()}
                  onTouchStart={() => void ladeSuche()}
                  onFocus={() => void ladeSuche()}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-white/90 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <Search className="h-[22px] w-[22px]" aria-hidden />
                </button>
                {/* Oben rechts nur am Laptop: weiß und rund wie „Zugang anfragen“ im Kopf der Verkaufsseite, führt zum
                    Halal-Investment-OS (VS5-05: „nur in der Laptop-Ansicht oben rechts Halal-Investment-OS“; „die Knöpfe bei
                    dem Tab … mit Zugriff anfragen rechts in rund. Das gefällt mir deutlich besser“). Vorher „Dein Geld halal
                    vermehren“ zum geführten Vergleich. */}
                {/* RN5 Phase 1: derselbe Knopf führt zum Halal-Finanz-Check, Text „Investiere halal“ (startseite-und-navigation,
                    Gilt 04.11.: „lieber sowas wie investiere halal“). */}
                <a href={MIT_OS ? "/investment-os/" : "/check?quelle=kopf"} className="hidden rounded-full min-[900px]:inline-block">
                  <span className="flex h-11 items-center whitespace-nowrap rounded-full bg-white px-5 text-[15px] font-semibold text-primary transition-transform active:scale-[.97]">
                    {MIT_OS ? "Halal-Investment-OS" : "Match finden"}
                  </span>
                </a>
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
          <div className="hidden min-[900px]:block absolute inset-x-0 top-full bg-card border-b border-border shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
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
          <div className="absolute inset-0 bg-foreground/40 dark:bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[86%] max-w-sm bg-card overflow-y-auto">
            <div className="flex items-center justify-between h-[68px] px-4 border-b border-border">
              <Wordmark className="text-xl" />
              <button
                type="button"
                aria-pressed={dunkel}
                aria-label={dunkel ? "Hellen Modus einschalten" : "Dunklen Modus einschalten"}
                onClick={umschalten}
                className={cn(
                  "ml-auto mr-1 inline-flex h-11 w-11 items-center justify-center rounded-full text-foreground hover:bg-muted",
                  beitragsKopf ? "min-[420px]:hidden" : "hidden",
                )}
              >
                {dunkel ? <Sun className="h-5 w-5" aria-hidden /> : <Moon className="h-5 w-5" aria-hidden />}
              </button>
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

              <div className="border-b border-border">
                <Link
                  to="/dokumente"
                  onClick={() => setMobileOpen(false)}
                  className="flex min-h-[44px] items-center text-[16px] font-semibold text-foreground"
                >
                  Dokumente
                </Link>
              </div>

              <a
                href={MIT_OS ? "/investment-os/" : "/check?quelle=menue"}
                onClick={() => setMobileOpen(false)}
                className="mt-4 mb-6 flex min-h-[48px] items-center justify-center rounded-full bg-primary px-5 text-[16px] font-semibold text-primary-foreground"
              >
                {MIT_OS ? "Dein Halal-Investment-OS" : "Match finden"}
              </a>
            </div>
          </div>
        </div>
      )}

      {sucheGeladen && (
        <Suspense fallback={null}>
          <Suche offen={sucheOffen} schliessen={() => setSucheOffen(false)} />
        </Suspense>
      )}
    </>
  );
};

export default SiteHeader;
