import { useEffect, useRef, useState } from "react";
import Seo from "@/components/Seo";
import { Link } from "react-router-dom";
import {
  Award,
  Bitcoin,
  Coins,
  Download,
  LineChart,
  Play,
  Plus,
  QrCode,
  ShieldCheck,
  TrendingUp,
  Volume2,
} from "lucide-react";
import logoMark from "@/assets/logo-mark.png";
// Paneelen-Porträt = gleiche Holzwand wie im Tutorial-Video darüber —
// Bild und Video wirken als EINE Szene (Wiedererkennung, Elias 16.7.)
import founderPortrait from "@/assets/story-elias-paneele.jpg";

// ============================================================================
// SCALABLE-AFFILIATE-DEEPLINK — EINZIGE ÄNDERBARE STELLE IM CODE
// TODO(B1): Kompletten Trackinglink aus dem Scalable-Partner-Dashboard einsetzen
//   (Ads → „Deeplink generieren" · PartnerID 1017 · Klickziel = Broker-WEB-
//   Onboarding, NIE App-Store). Der echte Link läuft über
//   partner.scalable-capital.de/go.cgi und enthält bereits pid=1017 + ein
//   subid=-Feld.
//   → SO EINSETZEN: generierten Link hierher kopieren und im subid=-Feld den
//     Wert durch {SUBID} ersetzen — Klammern behalten! (Hat der Link kein
//     subid=, hänge &subid={SUBID} ans Ende.) {SUBID} wird zur Laufzeit durch
//     die Traffic-Quelle ersetzt (Whitelist VALID_SRC unten). NICHT den
//     wmid/target-Teil anfassen.
//   Aktueller Wert = funktionierender Direkt-Fallback OHNE Tracking (die Seite
//   ist noch nicht live) — landet auf der echten Scalable-Broker-Seite.
// ============================================================================
const DEEPLINK_TEMPLATE = "https://partner.scalable-capital.de/go.cgi?pid=1017&wmid=250&cpid=1&prid=1&subid={SUBID}&target=Trading-Broker-M";

// Baut den finalen Klick-Link. Guard: warnt in Dev, falls beim Einsetzen des
// echten Deeplinks der {SUBID}-Token verloren ging — sonst gehen ALLE Klicks
// still ohne Quellen-Attribution raus (Reporting → Sub ID bliebe leer).
const buildDeeplink = (subId: string): string => {
  if (import.meta.env.DEV && !DEEPLINK_TEMPLATE.includes("{SUBID}")) {
    // eslint-disable-next-line no-console
    console.warn("[InvestmentStart] DEEPLINK_TEMPLATE enthält kein {SUBID} — SubID-Tracking greift nicht.");
  }
  return DEEPLINK_TEMPLATE.replace("{SUBID}", subId);
};

// B2: fertiges Tutorial (YouTube "nicht gelistet"; neues Video 19.7.)
const VIDEO_YOUTUBE_ID: string | null = "kuvEca69m9o";

// Steuert den YouTube-Player ohne Reload (enablejsapi=1 im iframe-src nötig)
const ytCommand = (iframe: HTMLIFrameElement | null, func: string) => {
  iframe?.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args: [] }), "*");
};

// Erlaubte Traffic-Quellen (SubID-Whitelist — klein-alphanumerisch, Scalable-Regeln)
const VALID_SRC = ["g1", "g2", "g3", "m1", "m2", "m3", "dm", "dmstart", "bio", "yt", "qr", "start"];

const useSubId = (): string => {
  const [subId, setSubId] = useState("start");
  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("src");
    const stored = sessionStorage.getItem("amanah_src");
    const candidate =
      param && VALID_SRC.includes(param) ? param : stored && VALID_SRC.includes(stored) ? stored : "start";
    sessionStorage.setItem("amanah_src", candidate);
    setSubId(candidate);
  }, []);
  return subId;
};




const brokerFacts = [
  {
    icon: ShieldCheck,
    title: "Große Auswahl islamkonformer Anlagen",
    text: "Bei Scalable ist eine große Auswahl auffindbar: mehrere Shariah-geprüfte Aktien-ETFs, ein Sukuk-ETF und zertifizierte Gold-ETCs.",
  },
  {
    icon: Award,
    title: "Mehrere Halal-Aktien-ETFs handelbar",
    text: "Bei Scalable sind mehrere Shariah-geprüfte Aktien-ETFs handelbar, darunter auch ein aktiv gemanagter globaler Shariah-ETF. Diese Auswahl gibt es bei vielen deutschen Brokern nicht.",
  },
  {
    icon: Coins,
    title: "Start ab 1 €, Depot kostenlos",
    text: "Kostenloses Depot (FREE), Sparpläne ab 1 €, keine Mindestanlage. Du brauchst kein Vermögen, um anzufangen.",
  },
];

const ribaChecklist = [
  {
    nr: "01",
    title: "Tagesgeldkonto nicht aktivieren.",
    text: "Das separate „Scalable Overnight“-Tagesgeld bringt Zinsen (Riba). Einfach nie aktivieren.",
  },
  {
    nr: "02",
    title: "Finger weg von Derivaten, Optionsscheinen und Hebelprodukten.",
    text: "Übermäßige Unsicherheit (Gharar), unabhängig vom Broker nicht islamkonform.",
  },
];

const faqs = [
  {
    q: "Kostet mich der Link etwas?",
    a: "Nein. Konditionen, Gebühren, App: alles identisch. Scalable teilt lediglich einen Teil mit mir, statt alles zu behalten.",
  },
  {
    q: "Ich habe schon ein Depot. Bringt mir das was?",
    a: "Ein Zweitdepot ist kostenlos und in 10 Minuten eröffnet. Fakt: Bei Scalable sind islamkonforme Anlagen handelbar, die es bei vielen deutschen Brokern nicht gibt. Darunter mehrere Shariah-geprüfte Aktien-ETFs und ein aktiv gemanagter globaler Shariah-ETF.",
  },
  {
    q: "Ist Scalable überhaupt halal nutzbar?",
    a: "Ja, mit den 2 Regeln aus der Checkliste oben. Genau deshalb erkläre ich sie dir, bevor du startest.",
  },
  {
    q: "Mein Umfeld sagt, Börse ist haram.",
    a: "Pauschal stimmt das nicht. Entscheidend ist, WAS du kaufst. Es gibt klare Gelehrten-Standards (AAOIFI), nach denen Anlagen geprüft werden. Genau dafür gibt es Shariah-Boards, und genau das erkläre ich in meinen Inhalten.",
  },
];

// Kennzeichnung + Risikohinweis — Pflicht VOR jedem Klick, gleiche Textgröße wie Umgebungstext
/** pos = Position des CTA auf der Seite. Sie wird an die SubID gehaengt, damit
 *  im Scalable-Reporting sichtbar wird, WELCHER Button verkauft.
 *  h = Hero, f = Abschluss, s = Sticky. Aus src=g1 wird also g1h / g1f / g1s. */
const CtaBlock = ({
  subId,
  pos,
  light = false,
  onCtaClick,
}: {
  subId: string;
  pos: "h" | "f";
  light?: boolean;
  onCtaClick?: () => void;
}) => {
  const href = buildDeeplink(`${subId}${pos}`);
  return (
    <div className="flex flex-col items-center gap-3">
      <p className={`text-[14px] leading-tight ${light ? "text-white/55" : "text-muted-foreground"}`}>
        Werbung/Affiliate-Link. Gleiche Konditionen, keine Mehrkosten.
      </p>
      <a
        href={href}
        rel="sponsored noopener"
        target="_blank"
        onClick={onCtaClick}
        className="pill-btn w-full sm:w-auto sm:min-w-[380px] bg-white text-primary hover:bg-primary hover:text-primary-hover text-base md:text-lg font-bold shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)]"
      >
        Halal investieren →
      </a>
      <p className={`text-[14px] leading-tight ${light ? "text-white/55" : "text-muted-foreground"}`}>
        <a
          href="https://de.scalable.capital/risiko"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-primary transition-colors"
        >
          Kapitalanlagen bergen Risiken.
        </a>
      </p>
    </div>
  );
};

/** Sprunglink INNERHALB der Seite, kein Affiliate-Link. Deshalb bewusst ohne
 *  Werbekennzeichnung und ohne Risikohinweis: es wird nichts beworben, der
 *  Nutzer springt nur zum CTA. So steigt die CTA-Dichte von 3 auf 9, ohne dass
 *  neun Mal der Pflicht-Sandwich wiederholt werden muss. */
const JumpLink = ({ to, children, light = false }: { to: "#start" | "#los"; children: React.ReactNode; light?: boolean }) => (
  <div className="mt-8 text-center">
    <a
      href={to}
      className={`text-[14px] font-semibold underline underline-offset-4 decoration-primary/60 transition-colors ${
        light ? "text-white/75 hover:text-primary" : "text-foreground/75 hover:text-primary"
      }`}
    >
      {children}
    </a>
  </div>
);

const InvestmentStart = () => {
  const subId = useSubId();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const heroCtaRef = useRef<HTMLDivElement>(null);
  const finalCtaRef = useRef<HTMLDivElement>(null);
  const [heroCtaVisible, setHeroCtaVisible] = useState(true);
  const [finalCtaVisible, setFinalCtaVisible] = useState(false);

  // Video: startet automatisch stumm (o-vegas-Muster). "Ton an" entstummt;
  // jeder CTA-Klick pausiert das Video, damit die Stimme nicht in den
  // Scalable-Flow hineinläuft (v.a. mobil).
  const videoRef = useRef<HTMLIFrameElement>(null);
  const [videoMuted, setVideoMuted] = useState(true);
  const unmuteVideo = () => {
    ytCommand(videoRef.current, "unMute");
    setVideoMuted(false);
  };
  const pauseVideo = () => ytCommand(videoRef.current, "pauseVideo");

  // Immer oben starten (interne Links dürfen nicht mittendrin landen)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Reveal-Animationen (identisch zur Startseite)
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

  // Sticky-CTA (mobil): sichtbar, sobald Hero-Button aus dem Viewport ist — außer am Seitenende
  useEffect(() => {
    const hero = heroCtaRef.current;
    const final = finalCtaRef.current;
    if (!hero || !final) return;
    const heroIo = new IntersectionObserver(([e]) => setHeroCtaVisible(e.isIntersecting));
    const finalIo = new IntersectionObserver(([e]) => setFinalCtaVisible(e.isIntersecting));
    heroIo.observe(hero);
    finalIo.observe(final);
    return () => {
      heroIo.disconnect();
      finalIo.disconnect();
    };
  }, []);

  const showSticky = !heroCtaVisible && !finalCtaVisible;
  const deeplink = buildDeeplink(`${subId}s`);

  return (
    <div className="min-h-screen bg-background">
      {/* Versteckte Conversion-Seite: nicht indexieren, nicht in Sitemap/Navigation
          aufnehmen. Lief vorher ueber react-helmet-async und war damit wirkungslos. */}
      <Seo
        title="Dein Investmentstart – finanzmuslim"
        description="Schritt für Schritt zum islamkonformen Depot."
        path="/dein-investmentstart"
        noindex
      />

      {/* S0 — Header: nur Bildmarke, keine Navigation (Attention Ratio 1:1) */}
      <header className="sticky top-0 z-50 bg-nav/95 backdrop-blur-md border-b border-border/60 shadow-[0_4px_20px_-12px_rgba(0,0,0,0.08)]">
        <div className="container flex items-center h-[64px] md:h-[68px]">
          <span className="flex items-center" aria-label="finanzmuslim">
            <img
              src={logoMark}
              alt="finanzmuslim"
              className="h-7 md:h-8 w-auto object-contain select-none"
              draggable={false}
            />
          </span>
        </div>
      </header>

      {/* S1 — Hero (dunkel, Look der Landingpage-Premium-Sektionen) */}
      <section className="relative overflow-hidden bg-primary text-white">
        <div className="container relative pt-8 pb-8 md:pt-12 md:pb-12">
          <div className="text-center max-w-[820px] mx-auto">
            <h1 className="headline text-white text-[30px] sm:text-[38px] md:text-[46px] leading-[1.06]">
              In 10 Minuten steht <br className="hidden sm:block" />
              dein <span className="text-primary">Halal-Depot.</span>
            </h1>
          </div>

          {/* Video (Platzhalter bis B2) */}
          <div className="mt-5 md:mt-7 mx-auto w-full max-w-[760px]">
            {VIDEO_YOUTUBE_ID ? (
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)]">
                <iframe
                  ref={videoRef}
                  className="absolute inset-0 h-full w-full"
                  src={`https://www.youtube-nocookie.com/embed/${VIDEO_YOUTUBE_ID}?rel=0&modestbranding=1&autoplay=1&mute=1&playsinline=1&enablejsapi=1&cc_load_policy=1&cc_lang_pref=de`}
                  title="Depot-Eröffnung Schritt für Schritt"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                {videoMuted && (
                  <button
                    onClick={unmuteVideo}
                    className="absolute bottom-3 left-3 md:bottom-4 md:left-4 inline-flex items-center gap-2 rounded-full bg-white/95 text-primary px-4 py-2 md:px-5 md:py-2.5 text-[13px] md:text-[14px] font-bold shadow-[0_10px_30px_-8px_rgba(0,0,0,0.6)] hover:bg-primary transition-colors"
                  >
                    <Volume2 className="h-4 w-4" /> Ton an
                  </button>
                )}
              </div>
            ) : (
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-foreground shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)]">
                <div
                  className="absolute inset-0 opacity-40"
                  style={{
                    backgroundImage: "linear-gradient(135deg, hsl(160 30% 10%) 0%, hsl(160 25% 14%) 100%)",
                  }}
                  aria-hidden
                />
                <div className="relative h-full flex flex-col items-center justify-center gap-3">
                  <span className="h-14 w-14 md:h-20 md:w-20 rounded-full bg-white/95 text-primary flex items-center justify-center shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)]">
                    <Play className="h-6 w-6 md:h-9 md:w-9 ml-1 fill-primary" />
                  </span>
                  <span className="text-[10px] md:text-xs uppercase tracking-[0.22em] text-white/55">
                    Tutorial-Video folgt hier
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* CTA direkt unter dem Video, mobil im ersten Viewport */}
          <div id="start" ref={heroCtaRef} className="mt-5 md:mt-7 scroll-mt-24">
            <CtaBlock subId={subId} pos="h" light onCtaClick={pauseVideo} />
          </div>

          {/* Handelbare Anlagen — ruhige Chip-Leiste (ersetzt frühere 4-Schritte-Leiste) */}
          <div className="mt-7 md:mt-9 mx-auto max-w-[760px]">
            <div className="grid grid-cols-4 gap-2.5 md:gap-3">
              {[
                { icon: TrendingUp, label: "Aktien" },
                { icon: LineChart, label: "ETFs" },
                { icon: Coins, label: "Gold" },
                { icon: Bitcoin, label: "Krypto" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex flex-col md:flex-row items-center justify-center gap-1.5 md:gap-2 rounded-xl bg-white/5 border border-white/10 px-2 py-2.5"
                >
                  <Icon className="h-4 w-4 md:h-4 md:w-4 text-primary shrink-0" />
                  <span className="text-[12px] md:text-[13px] font-medium text-white/80 leading-tight">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* S1b — Transparenz-Absatz */}
      <section className="bg-background py-10 md:py-14">
        <div className="container max-w-2xl text-center">
          <p className="reveal text-[15px] md:text-[17px] text-foreground/85 leading-relaxed">
            Du kannst dein Depot auch ohne meinen Link eröffnen: derselbe Broker, dieselben Konditionen. Der einzige
            Unterschied ist, ob Scalable etwas an mich weitergibt.{" "}
            <span className="font-semibold">
              Wenn dir meine Arbeit geholfen hat, freue ich mich. Wenn nicht, Hauptsache du startest halal.
            </span>
          </p>
        </div>
        <JumpLink to="#start">Direkt starten ↑</JumpLink>
      </section>

      {/* S2 — QR-Block (nur Desktop) */}
      <section className="hidden lg:block bg-surface border-y border-border/60 py-10">
        <div className="container max-w-3xl">
          <div className="reveal flex items-center gap-8 rounded-[1.75rem] bg-card border border-border/70 p-8 shadow-[0_20px_50px_-30px_rgba(80,60,20,0.25)]">
            <div className="shrink-0 h-[150px] w-[150px] rounded-xl bg-white border border-border flex items-center justify-center">
              {/* TODO(B1): public/qr-investmentstart.png einsetzen (Inhalt: Seiten-URL mit ?src=qr — NIE der Deeplink) */}
              <img
                src="/qr-investmentstart.png"
                alt="QR-Code: Diese Seite auf dem Handy öffnen"
                width={150}
                height={150}
                className="h-[140px] w-[140px] object-contain"
                onError={(e) => {
                  (e.currentTarget.parentElement as HTMLElement).innerHTML =
                    '<span class="text-xs text-muted-foreground text-center px-3">QR-Code<br/>folgt</span>';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2 text-primary">
                <QrCode className="h-5 w-5" />
                <h2 className="headline text-xl md:text-2xl">Am Laptop? Mach&apos;s direkt am Handy.</h2>
              </div>
              <p className="mt-2 text-[15px] text-muted-foreground leading-relaxed">
                Scann den Code, die Seite öffnet sich auf deinem Handy und du eröffnest dein Depot dort, während das
                Video hier weiterläuft. <span className="font-semibold text-foreground">Wichtig:</span> Klick den Button
                dann auf dem Handy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* S3 entfernt (19.7.): Der 4-Schritte-Ablauf steht jetzt als kompakte
          Leiste direkt unterm Video (siehe S1). Kürzt die Seite, hält aber
          „Text führt neben Video" bei (Fable-Override zu P4). Das steps-Array
          wird weiterhin von dieser Leiste genutzt. */}

      {/* S4 — PDF-Anleitung */}
      <section className="bg-surface border-y border-border/60 py-10 md:py-12">
        <div className="container max-w-2xl text-center">
          <p className="reveal text-[15px] md:text-[16px] text-foreground/85">
            Lieber lesen statt schauen? Die komplette Anleitung mit Screenshots:
          </p>
          <div className="reveal mt-4">
            <a
              href="/anleitung-halal-depot.pdf"
              download
              className="pill-btn bg-transparent text-foreground border border-border hover:border-primary gap-2"
            >
              <Download className="h-4 w-4" />
              Anleitung als PDF herunterladen
            </a>
          </div>
        </div>
        <JumpLink to="#start">Lieber gleich loslegen? ↑</JumpLink>
      </section>

      {/* S5 — Warum Scalable (Fakten) */}
      <section className="bg-background py-14 md:py-20">
        <div className="container">
          <div className="reveal text-center">
            <span className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-primary">
              <span className="h-px w-6 bg-primary" /> Der Broker <span className="h-px w-6 bg-primary" />
            </span>
            <h2 className="headline text-3xl md:text-4xl mt-4">Warum Scalable Capital? Drei Fakten.</h2>
          </div>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-7">
            {brokerFacts.map((f) => (
              <div
                key={f.title}
                className="reveal rounded-[1.75rem] bg-card border border-border/70 p-7 md:p-8 text-center shadow-[0_20px_50px_-30px_rgba(80,60,20,0.25)]"
              >
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 mx-auto">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="headline text-lg md:text-xl mb-3">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-[14px]">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
        <JumpLink to="#los">Zum Depot ↓</JumpLink>
      </section>

      {/* S6 — Riba-Checkliste (Ehrlichkeits-Anker, dunkle Premium-Sektion) */}
      <section className="relative overflow-hidden bg-primary text-white py-14 md:py-20">
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: "repeating-linear-gradient(45deg, hsl(var(--primary)) 0 1px, transparent 1px 24px)",
          }}
          aria-hidden
        />
        <div className="container relative max-w-3xl">
          <div className="reveal text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Ehrlichkeit zuerst
            </span>
            <h2 className="headline text-white text-3xl md:text-4xl mt-4 leading-[1.1]">
              2 Einstellungen machen dein Scalable-Depot <span className="text-primary">riba-frei</span>
            </h2>
          </div>
          <div className="mt-10 space-y-4">
            {ribaChecklist.map((item) => (
              <div
                key={item.nr}
                className="reveal flex gap-5 rounded-2xl bg-white/5 border border-white/10 p-6 md:p-7"
              >
                <span className="headline text-2xl text-primary shrink-0">{item.nr}</span>
                <div>
                  <h3 className="headline text-white text-base md:text-lg">{item.title}</h3>
                  <p className="mt-1.5 text-white/70 leading-relaxed text-[14px] md:text-[15px]">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="reveal mt-8 text-center text-[14px] text-white/60 max-w-xl mx-auto">
            Genau diese Punkte zeige ich dir im Video live, damit deine Empfehlung nicht nur bequem, sondern sauber
            ist.
          </p>
        </div>
        <JumpLink to="#los" light>Alles geklärt? Zum Depot ↓</JumpLink>
      </section>

      {/* S7 — Vertrauens-Block */}
      <section className="bg-background py-14 md:py-20">
        <div className="container max-w-4xl">
          <div className="grid md:grid-cols-[280px_1fr] gap-8 md:gap-12 items-center">
            <div className="reveal relative mx-auto max-w-[240px] md:max-w-none">
              <div
                className="absolute -inset-5 bg-gradient-to-br from-primary/25 via-primary/10/40 to-primary/10 rounded-[2.5rem] blur-2xl"
                aria-hidden
              />
              <div className="relative overflow-hidden rounded-[2rem] bg-secondary shadow-[0_30px_70px_-30px_rgba(80,60,20,0.35)] border border-white/60">
                <img
                  src={founderPortrait}
                  alt="Elias El-Gendy, Gründer von finanzmuslim"
                  className="w-full h-auto object-cover aspect-[4/5]"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="reveal text-center md:text-left">
              <span className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-primary">
                <span className="h-px w-6 bg-primary" /> Über mich
              </span>
              <h2 className="headline text-3xl md:text-4xl mt-4">Wer führt dich hier durch?</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed text-[15px] md:text-base">
                Salam, ich bin Elias, Gründer von finanzmuslim. Über 10.000 Muslime lernen bei finanzmuslim, wie islamkonformes Investieren wirklich
                funktioniert: ehrlich, mit klaren Quellen, ohne Schönreden.
              </p>
              <div className="mt-5 flex items-center justify-center md:justify-start gap-4 text-[12px] text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Vorträge an Universitäten
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5 text-primary" /> 10.000+ Community
                </span>
              </div>
            </div>
          </div>
        </div>
        <JumpLink to="#los">Zum Depot ↓</JumpLink>
      </section>

      {/* S8 — Mini-FAQ */}
      <section className="bg-surface border-t border-border/60 py-14 md:py-20">
        <div className="container max-w-3xl">
          <div className="reveal text-center">
            <span className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-primary">
              <span className="h-px w-6 bg-primary" /> FAQs <span className="h-px w-6 bg-primary" />
            </span>
            <h2 className="headline text-3xl md:text-4xl mt-4">Kurze Fragen, klare Antworten</h2>
          </div>
          <div className="mt-10 space-y-4">
            {faqs.map((f, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  className="reveal rounded-2xl bg-white border border-border/50 shadow-[0_4px_20px_-12px_rgba(20,51,40,0.15)] transition-all hover:shadow-[0_8px_28px_-12px_rgba(20,51,40,0.2)]"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-6 px-6 md:px-8 py-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="headline text-base md:text-lg text-foreground">{f.q}</span>
                    <span
                      className={`shrink-0 inline-flex items-center justify-center h-9 w-9 rounded-full border border-primary/40 text-primary transition-transform ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    >
                      <Plus className="h-4 w-4" />
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-6 md:px-8 pb-6 -mt-1">
                      <p className="text-muted-foreground leading-relaxed text-[15px]">{f.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <JumpLink to="#los">Keine Fragen mehr offen? ↓</JumpLink>
      </section>

      {/* S9 — Abschluss-CTA */}
      <section className="relative overflow-hidden bg-primary text-white py-16 md:py-24">
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 20%, hsl(40 70% 70%) 0, transparent 40%), radial-gradient(circle at 75% 85%, hsl(158 50% 60%) 0, transparent 45%)",
          }}
          aria-hidden
        />
        <div id="los" ref={finalCtaRef} className="container relative max-w-3xl text-center scroll-mt-24">
          <span className="reveal inline-flex items-center gap-2 rounded-full border border-primary/50 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Bereit?
          </span>
          <h2 className="reveal headline text-white text-3xl md:text-5xl mt-5 leading-[1.05]">
            Bereit? Dann jetzt, <span className="text-primary">in einem Rutsch.</span>
          </h2>
          <p className="reveal mt-4 text-white/75 leading-relaxed text-[15px] md:text-base">
            10 Minuten, Schritt für Schritt, und dein Halal-Depot steht.
          </p>
          <div className="reveal mt-8">
            <CtaBlock subId={subId} pos="f" light onCtaClick={pauseVideo} />
          </div>
          <p className="reveal mt-8 text-[13px] text-white/50 max-w-xl mx-auto">
            Depot eröffnet und erstes Investment gemacht? Antworte auf meine E-Mail mit{" "}
            <span className="text-primary font-semibold">FERTIG</span>, dann bekommst du sofort den nächsten Guide.
          </p>
        </div>
      </section>

      {/* S10 — Compliance-Block */}
      <section className="bg-surface border-t border-border/60 py-8">
        <div className="container max-w-3xl text-center">
          <p className="text-[12px] leading-relaxed text-muted-foreground">
            Die in diesem Beitrag enthaltenen Äußerungen, Kommentare und sonstigen Inhalte sind auch dann, wenn einzelne
            Emittenten oder Finanzinstrumente genannt werden, nicht als Anlageberatung zu verstehen und stellen weder
            direkt noch indirekt eine Empfehlung oder Aufforderung zum Kaufen, Halten oder Verkaufen eines
            Finanzinstruments oder eine diesbezügliche Beratung dar.
          </p>
          <p className="mt-3 text-[12px] leading-relaxed text-muted-foreground">
            Kapitalanlagen bergen Risiken. Ausführliche Risikohinweise:{" "}
            <a
              href="https://de.scalable.capital/risiko"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              de.scalable.capital/risiko
            </a>{" "}
            · Diese Seite enthält Werbung/Affiliate-Links zu Scalable Capital.
          </p>
        </div>
      </section>

      {/* Footer (kanonisch wie Startseite) */}
      <footer className="bg-foreground text-white/80 py-14">
        <div className="container flex flex-col items-center gap-4 text-center">
          <div className="flex items-center">
            <img src={logoMark} alt="finanzmuslim" className="h-10 w-auto brightness-0 invert opacity-90" />
          </div>
          <div className="h-px w-16 bg-primary/60" />
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

      {/* Sticky Mobile-CTA */}
      {showSticky && (
        <div className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-background/95 backdrop-blur-md border-t border-border shadow-[0_-8px_30px_-12px_rgba(0,0,0,0.15)] px-4 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]">
          <p className="text-center text-[10px] text-muted-foreground mb-1.5">
            <a
              href="https://de.scalable.capital/risiko"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-primary transition-colors"
            >
              Kapitalanlagen bergen Risiken.
            </a>
          </p>
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground shrink-0">Werbung</span>
            <a
              href={deeplink}
              rel="sponsored noopener"
              target="_blank"
              onClick={pauseVideo}
              className="pill-btn flex-1 py-3 bg-primary text-primary-foreground hover:bg-primary-glow text-[15px] font-bold"
            >
              Depot eröffnen →
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestmentStart;
