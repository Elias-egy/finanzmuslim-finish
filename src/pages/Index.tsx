import { useState, useEffect, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Gift, Menu, X, Plus } from "lucide-react";
import GuideStage from "@/components/GuideStage";
import Seo, { organizationJsonLd } from "@/components/Seo";

// Lazy: haelt recharts aus dem initialen Homepage-Bundle heraus.
const ReturnCalculator = lazy(() => import("@/components/ReturnCalculator"));

import logoMark from "@/assets/logo-mark.png";
import guideCoverV2 from "@/assets/guide-book-cut.webp";
import heroWide from "@/assets/hero-elias-wide.jpg";
// Von Elias bereitgestelltes Portrait (Bilder Solo, 27.5.), Higgsfield-2K-Upscale
import storyElias from "@/assets/story-elias-paneele.jpg";
import investmentstartEliasStudio from "@/assets/guide-elias-vortrag.webp";
import blogPlate from "@/assets/blog-plate.webp";
import toolsPlate from "@/assets/tools-plate.webp";

const navLinks = [
  { label: "Start", href: "/", route: true, top: true },
  { label: "Guide", href: "/halal-guide", route: true },
  { label: "Investieren", href: "/dein-investmentstart", route: true },
  { label: "Tools", href: "/tools", route: true },
  { label: "Blog", href: "/blog", route: true },
  { label: "FAQ", href: "#faqs" },
  { label: "Über Amanah", href: "#about" },
];

/** Kontakt bewusst als E-Mail-Link — es gibt (noch) keine eigene Kontaktseite. */
const kontaktMailto =
  "mailto:elias@amanah-invest.de?subject=Kontaktanfrage%20%C3%BCber%20Amanah%20Invest&body=Assalamu%20alaikum%2C%0A%0Aich%20interessiere%20mich%20f%C3%BCr%20Amanah%20Invest%20und%20m%C3%B6chte%20gerne%20Kontakt%20aufnehmen.%0A%0AName%3A%0ATelefonnummer%20(optional)%3A%0ANachricht%3A%0A";

/** Echte, bestaetigte Zahlen — keine erfundenen Werte ergaenzen. */
const stats = [
  { value: "10.000+", label: "Community", note: "Muslime, die ihre Finanzen bewusst gestalten" },
  { value: "1.000.000+", label: "Monatliche Views", note: "Reichweite über Amanah-Inhalte" },
];

const faqs = [
  {
    q: "Was bedeutet halal investieren?",
    a: "Halal investieren bedeutet, Kapital nach islamischen Prinzipien anzulegen – ohne Zinsen (Riba), übermäßige Spekulation (Gharar) und Beteiligung an verbotenen Branchen.",
  },
  {
    q: "Welche Anlagen sind islamkonform?",
    a: "Dazu zählen unter anderem ausgewählte Aktien, Scharia-zertifizierte ETFs, Sukuk (islamische Anleihen) sowie Sachwerte wie Immobilien und ausgewählte Rohstoffe – jeweils geprüft nach klaren Kriterien.",
  },
  {
    q: "Sind Halal-Anlagen schlechter als konventionelle Anlagen?",
    a: "Heutzutage muss man nicht mehr zwischen Halal und Rendite entscheiden. Mit islamkonformen Anlagen lassen sich vergleichbare – und je nach Strategie auch bessere – Ergebnisse erzielen als mit konventionellen Anlagen.",
  },
  {
    q: "Für wen ist Amanah geeignet?",
    a: "Amanah ist für Muslime geeignet, die ihr Geld bewusst, verständlich und islamkonform investieren möchten – egal ob sie ganz am Anfang stehen oder bereits erste Erfahrungen gesammelt haben.",
  },
  {
    q: "Hat Amanah eigene Produkte?",
    a: "Eigene Produkte sind in Planung. Bis dahin ist unser Ziel, Muslimen mit den besten verfügbaren Möglichkeiten den Einstieg in islamkonformes Investieren zu erleichtern.",
  },
];

const Logo = () => (
  <a href="#start" className="flex items-center gap-2" aria-label="Amanah">
    <img
      src={logoMark}
      alt="Amanah Investment"
      className="h-7 md:h-8 w-auto object-contain select-none"
      draggable={false}
    />
  </a>
);

/**
 * Redaktionelle Kapitelvorschau — grosses Bild, kleines Label, kurzer Titel.
 * theme "dark": dunkles Bildmotiv mit hellem Text; "light": helle Materialflaeche.
 */
type PortalTileData = {
  label: string;
  title: string;
  text?: string;
  to: string;
  image: string | null;
  imagePos?: string;
  theme: "dark" | "light";
};

const portalTiles: Record<string, PortalTileData> = {
  investmentstart: {
    label: "Schritt für Schritt",
    title: "Dein Investmentstart",
    text: "In rund 10 Minuten zum eigenen Halal-Depot – im Video begleitet.",
    to: "/dein-investmentstart",
    // Dunkles Editorial-Motiv: Elias rechts, leuchtender Wachstums-Graph +
    // Moschee-Silhouette links; Text sitzt unten links im dunklen Graph-Bereich.
    image: investmentstartEliasStudio,
    imagePos: "object-[center_20%]",
    theme: "dark",
  },
  tools: {
    label: "Rechner & Wissen",
    title: "Tools",
    to: "/tools",
    image: toolsPlate,
    imagePos: "object-[center_45%]",
    theme: "light",
  },
  blog: {
    label: "Artikel & Urteile",
    title: "Blog",
    to: "/blog",
    image: blogPlate,
    imagePos: "object-[center_60%]",
    theme: "light",
  },
};

const PortalTile = ({
  tile,
  className = "",
  large = false,
}: {
  tile: PortalTileData;
  className?: string;
  large?: boolean;
}) => {
  const dark = tile.theme === "dark";
  // Bei hinterlegtem Bild liegt jetzt immer ein dunkler Boden-Scrim darunter -> helle Typo.
  const lightText = dark || Boolean(tile.image);
  return (
    <Link
      to={tile.to}
      className={`group relative block overflow-hidden rounded-[1.5rem] md:rounded-[1.75rem] border transition-[transform,box-shadow,border-color] duration-[340ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:hover:-translate-y-2 motion-safe:hover:scale-[1.03] motion-safe:active:scale-[1.015] focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2 ${
        dark
          ? "bg-[#141410] border-white/10 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.6)] group-hover:shadow-[0_18px_38px_-14px_rgba(0,0,0,0.7)]"
          : "bg-[hsl(38_42%_92%)] border-[hsl(38_30%_75%)]/50 shadow-[0_10px_28px_-18px_rgba(20,51,40,0.35)] group-hover:border-gold/50 group-hover:shadow-[0_18px_34px_-16px_rgba(20,51,40,0.4)]"
      } ${className}`}
    >
      {tile.image ? (
        <img
          src={tile.image}
          alt=""
          aria-hidden
          loading="lazy"
          className={`absolute inset-0 h-full w-full object-cover ${tile.imagePos ?? ""} transition-transform duration-700 motion-safe:group-hover:scale-[1.02]`}
        />
      ) : (
        /* Platzhalter-Materialflaeche, wird durch finale Plate ersetzt */
        <div
          className="absolute inset-0"
          aria-hidden
          style={{
            background: dark
              ? "linear-gradient(160deg, #1c1a15 0%, #141410 100%)"
              : "linear-gradient(160deg, hsl(40 48% 94%) 0%, hsl(38 40% 88%) 100%)",
          }}
        />
      )}
      {/* Lesbarkeit: kompakter, bodenverankerter Scrim statt Vollflaechen-Fade */}
      {dark ? (
        <div
          className="absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-[#0d0b08]/92 via-[#0d0b08]/38 to-transparent"
          aria-hidden
        />
      ) : (
        tile.image && (
          <div
            className="absolute inset-x-0 bottom-0 h-[52%] bg-gradient-to-t from-[hsl(38_38%_18%)]/78 via-[hsl(38_38%_18%)]/22 to-transparent"
            aria-hidden
          />
        )
      )}
      <div className="relative h-full flex flex-col justify-end p-6 md:p-8">
        <span
          className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${
            lightText ? "text-gold" : "text-gold-deep"
          }`}
        >
          {tile.label}
        </span>
        <span
          className={`headline mt-1.5 block ${
            lightText ? "text-white" : "text-foreground"
          } ${large ? "text-3xl md:text-[38px]" : "text-2xl md:text-[26px]"}`}
        >
          {tile.title}
          <ArrowRight
            className={`ml-3 inline-block h-[0.62em] w-[0.62em] -translate-y-px transition-transform motion-safe:group-hover:translate-x-1 ${
              lightText ? "text-white/80" : "text-foreground/70"
            }`}
            aria-hidden
          />
        </span>
        {tile.text && (
          <span className={`mt-2 text-[15px] leading-relaxed max-w-sm ${lightText ? "text-white/75" : "text-muted-foreground"}`}>
            {tile.text}
          </span>
        )}
      </div>
    </Link>
  );
};

const GIFT_SEEN_KEY = "amanah_gift_seen";

const Index = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  // Geschenk-Badge in der Mobile-Nav: rote „1", bis der Nutzer es einmal geöffnet hat.
  const [giftSeen, setGiftSeen] = useState<boolean>(() => {
    try {
      return localStorage.getItem(GIFT_SEEN_KEY) === "1";
    } catch {
      return false;
    }
  });
  const dismissGiftBadge = () => {
    try {
      localStorage.setItem(GIFT_SEEN_KEY, "1");
    } catch {
      /* Privatmodus: Badge bleibt dann nur diese Sitzung weg */
    }
    setGiftSeen(true);
  };

  useEffect(() => {
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
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Halal Investieren lernen – Guides, Rechner & Kriterien | Amanah"
        description="Halal investieren ohne Rätselraten: kostenloser Investment Guide, Renditerechner ohne Zinsen und klare Kriterien für islamkonforme Anlagen."
        path="/"
        jsonLd={organizationJsonLd}
      />
      {/* Announcement-Band ganz oben, ueber dem Header — klickbar -> /halal-guide */}
      <Link
        to="/halal-guide"
        className="group block w-full bg-[#143328] text-white"
      >
        <div className="container flex items-center justify-start md:justify-center gap-x-2.5 md:gap-x-3 py-2 md:py-3 text-left md:text-center">
          <span className="shrink-0 rounded-full border border-gold/60 px-2 py-0.5 md:px-3 md:py-1 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.14em] md:tracking-[0.16em] text-gold">
            Neu
          </span>
          <span className="text-[12px] md:text-[15px] font-medium leading-snug">
            Halal Investment Guide verfügbar – sichere dir jetzt deinen kostenlosen Einstieg
            <ArrowRight className="ml-1.5 md:ml-2 inline-block h-3.5 w-3.5 md:h-[18px] md:w-[18px] align-[-2px] transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
      {/* Navigation — ruhige helle Kopfzeile, Logo links, Nav mittig, Kontakt rechts */}
      <header className="sticky top-0 z-50 bg-nav/95 backdrop-blur-md border-b border-border/60">
        <div className="container flex items-center justify-between h-[64px] md:h-[72px] lg:grid lg:grid-cols-[1fr_auto_1fr]">
          <div className="justify-self-start">
            <Logo />
          </div>
          <nav
            className="hidden lg:flex items-center gap-6 xl:gap-8 2xl:gap-9 justify-self-center font-[family-name:'Source_Sans_3',system-ui,sans-serif]"
            aria-label="Hauptnavigation"
          >
            {/* Gründerzugang-Verweis — für alle Besucher sichtbar, Code-Screen wird beim Klick angezeigt */}
            <Link
              to="/early"
              className="inline-flex items-center gap-1.5 rounded-full border border-gold/50 bg-gold-soft px-3.5 py-1.5 text-[13px] font-bold text-primary hover:border-gold transition-colors"
            >
              <Gift className="h-3.5 w-3.5 text-gold-deep" /> Gründervorteile
            </Link>
            {navLinks.map((l) => {
              const cls =
                "relative text-[15px] font-semibold text-[#143328] hover:text-primary transition-colors after:content-[''] after:absolute after:left-0 after:-bottom-1.5 after:h-px after:w-0 after:bg-gold after:transition-all hover:after:w-full";
              return l.route ? (
                <Link
                  key={l.label}
                  to={l.href}
                  onClick={l.top ? () => window.scrollTo({ top: 0, left: 0 }) : undefined}
                  className={cls}
                >
                  {l.label}
                </Link>
              ) : (
                <a key={l.label} href={l.href} className={cls}>
                  {l.label}
                </a>
              );
            })}
          </nav>
          <div className="hidden lg:flex justify-self-end items-center font-[family-name:'Source_Sans_3',system-ui,sans-serif]">
            <a
              href={kontaktMailto}
              className="text-[15px] font-semibold text-[#143328] hover:text-primary transition-colors"
            >
              Kontakt aufnehmen
            </a>
          </div>
          <div className="lg:hidden ml-auto -mr-1 flex items-center gap-1">
            {/* Geschenk direkt sichtbar in der Mobile-Nav — wirkt wie eine neue Belohnung */}
            <Link
              to="/early"
              onClick={dismissGiftBadge}
              aria-label="Gründervorteile ansehen"
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-gold/45 bg-gold-soft text-gold-deep transition-transform active:scale-95"
            >
              <Gift className="h-[19px] w-[19px]" />
              {!giftSeen && (
                <span className="absolute -top-1 -right-1 flex h-[19px] w-[19px] items-center justify-center">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-[#e5484d] opacity-70 animate-ping [animation-duration:1.8s]" />
                  <span className="relative flex h-[19px] w-[19px] items-center justify-center rounded-full bg-[#e5484d] text-[11px] font-bold leading-none text-white ring-2 ring-nav">
                    1
                  </span>
                </span>
              )}
            </Link>
            <button
              className="p-2 text-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menü"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div className="lg:hidden border-t border-border bg-nav font-[family-name:'Source_Sans_3',system-ui,sans-serif]">
            <nav className="container flex flex-col py-1">
              <Link
                to="/early"
                onClick={() => {
                  setMobileOpen(false);
                  dismissGiftBadge();
                }}
                className="py-3.5 inline-flex items-center gap-2 text-[15px] font-bold text-primary border-b border-border/50"
              >
                <Gift className="h-4 w-4 text-gold-deep" /> Gründervorteile
              </Link>
              {navLinks.map((l) => {
                const cls =
                  "py-3.5 text-[15px] font-semibold text-[#143328] hover:text-primary border-b border-border/50 transition-colors";
                return l.route ? (
                  <Link
                    key={l.label}
                    to={l.href}
                    onClick={() => {
                      setMobileOpen(false);
                      if (l.top) window.scrollTo({ top: 0, left: 0 });
                    }}
                    className={cls}
                  >
                    {l.label}
                  </Link>
                ) : (
                  <a key={l.label} href={l.href} onClick={() => setMobileOpen(false)} className={cls}>
                    {l.label}
                  </a>
                );
              })}
              <a
                href={kontaktMailto}
                onClick={() => setMobileOpen(false)}
                className="py-3.5 text-[15px] font-semibold text-[#143328] hover:text-primary transition-colors"
              >
                Kontakt aufnehmen
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* Hero — echtes Elias-Material vor Holzpaneelen, cineastisch abgedunkelt.
          Ein Bild, responsiver Crop: Mobile zentriert auf Elias, Desktop
          zeigt die volle Breite mit Elias rechts der Textspalte. */}
      <section id="start" className="relative overflow-hidden bg-[#171410] -mb-px">
        <div className="absolute inset-0 -bottom-px" aria-hidden>
          <img
            src={heroWide}
            alt=""
            className="block h-full w-full object-cover object-[70%_center] md:object-[center_8%] brightness-[1.18] md:brightness-100"
          />
          {/* Lesbarkeit: links dunkel fuer Text, Bild rechts frei (Desktop);
              unten dunkel fuer Text (Mobile) */}
          <div className="absolute inset-0 hidden md:block bg-gradient-to-r from-[#171410]/80 via-[#171410]/35 to-transparent" />
          <div className="absolute inset-0 md:hidden bg-gradient-to-t from-[#171410]/95 via-[#171410]/45 to-[#171410]/10" />
        </div>

        {/* Vollstaendige Sichtbarkeit above the fold: Ankuendigungsband + Header abziehen.
            Ankuendigung ~40px mobil / ~52px Desktop, Header 64px mobil / 72px Desktop. */}
        <div className="container relative flex min-h-[calc(100svh-104px)] md:min-h-[calc(100svh-122px)] items-end md:items-center pb-20 pt-32 md:py-16">
          <div className="reveal max-w-xl lg:max-w-2xl text-left">
            <h1 className="headline text-white text-[30px] sm:text-[44px] md:text-[56px] lg:text-[62px] leading-[1.07]">
              Vermögen aufbauen,<br />
              ohne deinen<br />
              Glauben aufzugeben.
            </h1>
            <div className="mt-16 md:mt-24">
              <Link
                to="/halal-guide"
                className="pill-btn text-[15px] md:text-base px-8 py-3.5 bg-[#e8af3c] text-[#143328] hover:bg-[#d49a2a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/70 focus-visible:outline-offset-2 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7)]"
              >
                Kostenlos starten
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Harter heller Schnitt: Vertrauenszahlen als ruhiges Stat-Band */}
      <section className="bg-background py-14 md:py-20 border-b border-border/50">
        <div className="container">
          <span className="reveal inline-flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.25em] text-gold-deep">
            <span className="h-px w-6 bg-gold" aria-hidden /> Amanah in Zahlen
          </span>
          <dl className="reveal mt-8 md:mt-10 grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10 max-w-3xl">
            {stats.map((s) => (
              <div key={s.label} className="border-t border-border/70 pt-6">
                <dd className="headline text-4xl md:text-[44px]">{s.value}</dd>
                <dt className="mt-2 text-[13px] font-semibold uppercase tracking-[0.16em] text-foreground/70">
                  {s.label}
                </dt>
                <dd className="mt-1.5 text-[14px] text-muted-foreground leading-relaxed">{s.note}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Guide — ein dunkles Produktfenster in der hellen Seite (Cream-Rand sichtbar) */}
      <GuideStage />

      {/* Rechner-Sektion: interaktiver Einstieg direkt auf der Startseite.
          Lazy geladen, damit recharts nicht ins initiale Homepage-Bundle wandert. */}
      <section id="rechner" className="bg-background border-y border-border/50 pt-16 md:pt-24 pb-4 md:pb-8">
        <div className="container">
          <div className="reveal max-w-2xl">
            <span className="inline-flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.25em] text-gold-deep">
              <span className="h-px w-6 bg-gold" aria-hidden /> Renditerechner
            </span>
            <h2 className="headline text-4xl md:text-5xl mt-4 leading-[1.05]">
              Sieh, was aus deinem Sparplan wird.
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed text-base md:text-[17px]">
              Stell deine Rate ein, wähle dein Portfolio – der Rechner zeigt dir sofort, wie dein Vermögen wachsen kann.
            </p>
          </div>
        </div>
        <Suspense fallback={<div className="min-h-[600px]" aria-hidden />}>
          <ReturnCalculator showHeader={false} />
        </Suspense>
        <div className="container">
          <Link
            to="/renditerechner"
            className="reveal inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            Zur vollen Rechnerseite
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>

      {/* Drei Kapitelvorschauen — 1 gross links, 2 rechts. Waermerer Cream-Ton als
          Kapitelwechsel, damit die Kacheln plastisch vom Hintergrund abstehen. */}
      <section className="bg-surface border-y border-border/50 py-16 md:py-24">
        <div className="container">
          <div className="reveal max-w-2xl">
            <span className="inline-flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.25em] text-gold-deep">
              <span className="h-px w-6 bg-gold" aria-hidden /> Dein nächster Schritt
            </span>
            <h2 className="headline text-4xl md:text-5xl mt-4 leading-[1.05]">Drei Wege, ein Ziel.</h2>
          </div>

          <div className="reveal mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-[1.15fr_1fr] gap-5 md:gap-6">
            <PortalTile tile={portalTiles.investmentstart} className="min-h-[420px] md:min-h-[560px]" large />
            <div className="grid grid-rows-2 gap-5 md:gap-6">
              <PortalTile tile={portalTiles.tools} className="min-h-[220px] md:min-h-0" />
              <PortalTile tile={portalTiles.blog} className="min-h-[220px] md:min-h-0" />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ — Creme-Flaeche mit Gold-Akzenten: aktive Frage gold markiert,
          offene Antwort als zartes helles Panel mit Gold-Hairline links */}
      <section id="faqs" className="bg-surface border-b border-border/50 pt-16 md:pt-24 pb-20 md:pb-28">
        <div className="container max-w-3xl">
          <div className="reveal">
            <span className="inline-flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.25em] text-gold-deep">
              <span className="h-px w-6 bg-gold" aria-hidden /> FAQ
            </span>
            <h2 className="headline text-4xl md:text-5xl mt-4">Häufige Fragen</h2>
          </div>
          <div className="reveal mt-10 border-t border-border/80">
            {faqs.map((f, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i} className="border-b border-border/80">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="group w-full flex items-center justify-between gap-6 py-5 md:py-6 text-left"
                  >
                    <span
                      className={`headline text-base md:text-lg transition-colors ${
                        isOpen ? "text-[#143328]" : "text-foreground group-hover:text-[#143328]"
                      }`}
                    >
                      {f.q}
                    </span>
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors ${
                        isOpen
                          ? "border-gold bg-gold/15 text-gold-deep"
                          : "border-border/80 text-foreground/60 group-hover:border-gold/60 group-hover:text-gold-deep"
                      }`}
                    >
                      <Plus
                        className={`h-4 w-4 transition-transform ${isOpen ? "rotate-45" : ""}`}
                        strokeWidth={1.5}
                        aria-hidden
                      />
                    </span>
                  </button>
                  {isOpen && (
                    <div className="mb-6 rounded-xl border border-gold/25 border-l-2 border-l-gold bg-card px-5 py-4 md:px-6 md:py-5 shadow-[0_10px_24px_-18px_rgba(30,25,10,0.4)]">
                      <p className="text-muted-foreground leading-relaxed text-[15px] md:text-[16px]">
                        {f.a}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Meine Story — ein starkes echtes Portrait, ruhige Textspalte */}
      <section id="about" className="bg-surface border-t border-border/50 py-20 md:py-28">
        <div className="container grid md:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-20 items-start">
          <div className="reveal md:sticky md:top-24">
            <img
              src={storyElias}
              alt="Elias, Gründer von Amanah"
              width={1120}
              height={1400}
              className="w-full max-w-md mx-auto md:max-w-none rounded-[1.5rem] object-cover aspect-[4/5] shadow-[0_30px_60px_-35px_rgba(30,25,10,0.45)]"
              loading="lazy"
            />
          </div>
          <div className="reveal">
            <span className="inline-flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.25em] text-gold-deep">
              <span className="h-px w-6 bg-gold" aria-hidden /> Meine Story
            </span>
            <h2 className="headline text-4xl md:text-5xl mt-4">Über Elias</h2>
            <div className="mt-7 space-y-5 text-muted-foreground leading-[1.75] text-[15px] md:text-[16.5px] max-w-prose">
              <p>
                Schon mit 17 fing ich an, neben dem Abitur in einem Finanzunternehmen zu arbeiten und merkte schnell: Fast jedes verkaufte Standardprodukt enthält Riba/Zinsen. Das schlechte Gewissen vieler Muslime dabei ist berechtigt.
              </p>
              <p>
                Mit wachsendem Iman und wachsendem schlechten Gewissen traf ich eine Entscheidung: Ich spendete alles, was ich bis dahin durch Zinsen verdient hatte und rührte diesen Bereich nie wieder an.
              </p>
              <p>
                Mit zwei Jahren Erfahrung im Finanzvertrieb und dem dazu aufgebauten Wissen im Islamic Finance wollte ich anfangs unter dem Namen "Halal Invest" einfach ein paar Muslimen mit denselben Problemen helfen. Nach Workshops an deutschen Universitäten und offensichtlichem Interesse wurde daraus etwas Größeres – die Vision, der gesamten Ummah in Deutschland islamkonforme Alternativen zugänglich zu machen.
              </p>
              <p>
                Genau dafür ist Amanah entstanden.
              </p>
            </div>
            {/* Qualifikations-Hinweis (Elias 16.7.): bewusst nur die bestandenen
                Sachkundeprüfungen — KEINE Aussage über Erlaubnis/Registrierung als
                Vermittler. ⚠️ Wortlaut vor Livegang juristisch prüfen lassen. */}
            <p className="mt-7 pt-5 border-t border-border/60 text-[13.5px] leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground/80">Qualifikation:</span> Elias hat die
              IHK-Sachkundeprüfungen für Finanzanlagenvermittlung (§ 34f GewO) und
              Versicherungsvermittlung (§ 34d GewO) erfolgreich abgelegt.
            </p>
          </div>
        </div>
      </section>

      {/* Abschluss-CTA — ruhiges dunkles Schlusskapitel */}
      <section className="bg-[#143328] text-white py-20 md:py-28">
        <div className="container grid md:grid-cols-[1fr_1.5fr] gap-10 md:gap-16 items-center">
          <div className="reveal hidden md:flex justify-end">
            <img
              src={guideCoverV2}
              alt="Halal Investment Guide – Premium Hardcover"
              width={557}
              height={825}
              className="max-h-[340px] w-auto object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.45)]"
              loading="lazy"
            />
          </div>
          <div className="reveal text-center md:text-left">
            <h2 className="headline text-white text-4xl md:text-5xl leading-[1.06]">
              Starte heute, mit gutem Gewissen.
            </h2>
            <p className="mt-5 text-white/75 leading-relaxed max-w-xl mx-auto md:mx-0 text-[15px] md:text-base">
              Sichere dir den kostenlosen Halal Investment Guide und beginne,
              dein Vermögen Scharia-konform aufzubauen.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center md:justify-start gap-4">
              <Link
                to="/halal-guide"
                className="pill-btn bg-[hsl(43_60%_95%)] text-[#143328] hover:bg-white shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)]"
              >
                Guide sichern
              </Link>
              <a
                href="mailto:elias@amanah-invest.de?subject=Kontaktanfrage%20%C3%BCber%20Amanah%20Invest&body=Assalamu%20alaikum%2C%0A%0Aich%20interessiere%20mich%20f%C3%BCr%20Amanah%20Invest%20und%20m%C3%B6chte%20gerne%20Kontakt%20aufnehmen.%0A%0AName%3A%0ATelefonnummer%20(optional)%3A%0ANachricht%3A%0A"
                className="text-[15px] font-semibold text-white/80 hover:text-white underline underline-offset-4 decoration-white/40 transition-colors"
              >
                Kontakt aufnehmen
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="kontakt" className="bg-[hsl(40_12%_8%)] text-white/80 py-14">
        <div className="container flex flex-col items-center gap-4 text-center">
          <div className="flex items-center">
            <img src={logoMark} alt="Amanah Investment" className="h-10 w-auto brightness-0 invert opacity-90" />
          </div>
          <div className="h-px w-16 bg-gold/60" />
          <p className="text-xs text-white/50 tracking-wide">
            © {new Date().getFullYear()} Amanah. Alle Rechte vorbehalten.
          </p>
          <div className="flex gap-6 text-xs text-white/50">
            <Link to="/impressum" className="hover:text-white/80 transition-colors">
              Impressum
            </Link>
            <Link to="/datenschutz" className="hover:text-white/80 transition-colors">
              Datenschutz
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
