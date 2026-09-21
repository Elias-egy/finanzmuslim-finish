import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Award, CheckCircle2, Download, HelpCircle, Plus, QrCode, ShieldCheck, Volume2 } from "lucide-react";
import AnbieterCheck from "@/components/AnbieterCheck";
import AnbieterLogo from "@/components/AnbieterLogo";
import Seo from "@/components/Seo";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { findStartPartner, type StartPartner } from "@/data/investmentStart";
// Paneelen-Porträt = gleiche Holzwand wie im Tutorial-Video darüber —
// Bild und Video wirken als EINE Szene (Wiedererkennung, Elias 16.7.)
import founderPortrait from "@/assets/story-elias-paneele.jpg";
import { istGueltigeQuelle } from "@/lib/attribution";

/**
 * Startseite je Partner: /dein-investmentstart (Scalable) und
 * /dein-investmentstart/:partner. Inhalte in src/data/investmentStart.ts.
 *
 * Das Video liegt selbst gehostet unter /videos/ (Elias, 15.09.2026: direkt
 * eingebettet konvertiert deutlich besser als YouTube). Es ist der Schnitt vom
 * 05.09. ohne Werbeblock und ohne Broker-Vergleich.
 */
const VIDEO_SRC = "/videos/investmentstart.mp4";
const VIDEO_POSTER = "/videos/investmentstart-poster.jpg";


const useSubId = (): string => {
  const [subId, setSubId] = useState("start");
  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = sessionStorage.getItem("amanah_src");
    } catch {
      stored = null;
    }
    const param = new URLSearchParams(window.location.search).get("src");
    const candidate = istGueltigeQuelle(param) ? param : istGueltigeQuelle(stored) ? stored : "start";
    try {
      sessionStorage.setItem("amanah_src", candidate);
    } catch {
      // Ohne Storage gilt die Quelle nur für diesen Aufruf.
    }
    setSubId(candidate);
  }, []);
  return subId;
};

/** pos = Position des Aufrufs, wird an die SubID gehängt: h = Hero, f = Abschluss, s = Sticky. */
const partnerLink = (partner: StartPartner, subId: string) => partner.link.replace("{SUBID}", subId);

const CtaBlock = ({
  partner,
  href,
  onCtaClick,
}: {
  partner: StartPartner;
  href: string;
  onCtaClick?: () => void;
}) => (
  <div className="flex flex-col items-center gap-3">
    <p className="text-[14px] leading-tight text-white/60">
      Werbung/Affiliate-Link. Gleiche Konditionen, keine Mehrkosten.
    </p>
    <a
      href={href}
      rel="sponsored noopener"
      target="_blank"
      onClick={onCtaClick}
      className="pill-btn w-full sm:w-auto sm:min-w-[380px] bg-white text-primary hover:bg-hero text-base md:text-lg font-bold shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)]"
    >
      {partner.knopf}
    </a>
    {partner.art === "depot" && (
      <p className="text-[14px] leading-tight text-white/60">
        {partner.risikoUrl ? (
          <a
            href={partner.risikoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 transition-colors hover:text-white"
          >
            Kapitalanlagen bergen Risiken.
          </a>
        ) : (
          "Kapitalanlagen bergen Risiken."
        )}
      </p>
    )}
  </div>
);

/** Sprunglink innerhalb der Seite, kein Affiliate-Link, deshalb ohne Werbekennzeichnung. */
const JumpLink = ({ to, children, light = false }: { to: "#start" | "#los"; children: React.ReactNode; light?: boolean }) => (
  <div className="mt-8 text-center">
    <a
      href={to}
      className={`text-[14px] font-semibold underline underline-offset-4 transition-colors ${
        light
          ? "text-white/80 decoration-white/50 hover:text-white"
          : "text-foreground/75 decoration-primary/60 hover:text-primary"
      }`}
    >
      {children}
    </a>
  </div>
);

const VideoHinweis = ({ anbieter }: { anbieter: string }) => (
  <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[13px] leading-snug text-white/85">
    <span>
      (Dieses Beispielvideo zeigt die App von Scalable Capital. Bei {anbieter} unterscheidet sich die Einrichtung nur
      minimal.)
    </span>
    <Popover>
      <PopoverTrigger
        aria-label="Warum ein Beispielvideo?"
        className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
      >
        <HelpCircle className="h-4 w-4" />
      </PopoverTrigger>
      <PopoverContent className="w-80 text-left text-[14px] leading-relaxed">
        <p className="font-semibold text-foreground">Warum ein Beispielvideo?</p>
        <p className="mt-2 text-muted-foreground">
          Die Schritte sind bei allen Brokern gleich: Konto eröffnen, Ausweis bestätigen, Zinsangebote ablehnen und die
          erste Anlage wählen. Bei {anbieter} heißen nur die Menüs anders. Welche Halal-Anlagen es dort gibt, siehst du
          im{" "}
          <Link to="/vergleich/depot" className="text-primary underline underline-offset-2">
            Depot-Vergleich
          </Link>
          .
        </p>
      </PopoverContent>
    </Popover>
  </p>
);

const InvestmentStartSeite = ({ partner }: { partner: StartPartner }) => {
  const subId = useSubId();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const heroCtaRef = useRef<HTMLDivElement>(null);
  const finalCtaRef = useRef<HTMLDivElement>(null);
  const [heroCtaVisible, setHeroCtaVisible] = useState(true);
  const [finalCtaVisible, setFinalCtaVisible] = useState(false);
  const istDepot = partner.art === "depot";
  const istKrypto = partner.art === "krypto";
  const produktWort = istDepot ? "Depot" : "Konto";
  // Seitentitel je Art: Depot, Girokonto oder Krypto-Konto.
  const seitenWort = istDepot ? "Investmentstart" : istKrypto ? "Krypto-Konto" : "Girokonto";

  // Video startet stumm (o-vegas-Muster). "Ton an" entstummt; jeder Klick auf
  // einen Aufruf pausiert das Video, damit die Stimme nicht in die
  // Kontoeröffnung hineinläuft (vor allem mobil).
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoMuted, setVideoMuted] = useState(true);
  const unmuteVideo = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    v.volume = 1;
    void v.play();
    setVideoMuted(false);
  };
  const pauseVideo = () => videoRef.current?.pause();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [partner.kurzname]);

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
  }, [partner.kurzname]);

  // Sticky-Leiste: sichtbar, sobald der Hero-Knopf aus dem Bild ist, außer am Seitenende
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

  return (
    <div className="min-h-screen bg-background">
      {/* Conversion-Seite: nicht indexieren, nicht in Sitemap oder Navigation. */}
      <Seo
        title={`Dein ${seitenWort} bei ${partner.anbieter} – finanzmuslim`}
        description={
          istDepot
            ? `Schritt für Schritt zum islamkonformen Depot bei ${partner.anbieter}.`
            : istKrypto
              ? `Schritt für Schritt zum zinsfreien Krypto-Konto bei ${partner.anbieter}.`
              : `Schritt für Schritt zum zinsfreien Girokonto bei ${partner.anbieter}.`
        }
        path={partner.pfad}
        noindex
      />

      {/* S1 — Hero */}
      <section
        className="relative overflow-hidden bg-primary text-white"
        style={{
          // Kleines Detail je Partner: Schimmer in der Logofarbe oben, Lila unten rechts, damit die Fläche nicht nur blau ist.
          backgroundImage: `radial-gradient(55% 45% at 50% 0%, ${partner.markenfarbe}59 0%, transparent 70%), radial-gradient(45% 40% at 100% 100%, hsl(var(--violet) / 0.45) 0%, transparent 70%)`,
        }}
      >
        <div className="container relative pt-8 pb-8 md:pt-12 md:pb-12">
          <div className="text-center max-w-[820px] mx-auto">
            <h1 className="headline text-white text-[30px] sm:text-[38px] md:text-[46px] leading-[1.06]">
              {partner.titel[0]} <br className="hidden sm:block" />
              <span className="text-hero">{partner.titel[1]}</span>
            </h1>
            <p
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-white py-1 pl-1 pr-4 text-[14px] font-semibold text-foreground md:text-[15px]"
              style={{ boxShadow: `0 0 0 3px ${partner.markenfarbe}` }}
            >
              <span className="scale-[0.8] -m-1">
                <AnbieterLogo name={partner.anbieter} domain={partner.domain} />
              </span>
              bei {partner.anbieter}
            </p>
          </div>

          {istDepot ? (
            <div className="mt-5 md:mt-7 mx-auto w-full max-w-[760px]">
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)]">
                <video
                  ref={videoRef}
                  className="absolute inset-0 h-full w-full object-cover"
                  src={VIDEO_SRC}
                  poster={VIDEO_POSTER}
                  autoPlay
                  muted
                  playsInline
                  controls
                  preload="metadata"
                  title="Depot-Eröffnung Schritt für Schritt"
                />
                {videoMuted && (
                  <button
                    onClick={unmuteVideo}
                    className="absolute bottom-14 left-3 md:bottom-16 md:left-4 inline-flex items-center gap-2 rounded-lg bg-white/95 text-primary px-4 py-2 md:px-5 md:py-2.5 text-[13px] md:text-[14px] font-bold shadow-[0_10px_30px_-8px_rgba(0,0,0,0.6)] hover:bg-hero transition-colors"
                  >
                    <Volume2 className="h-4 w-4" /> Ton an
                  </button>
                )}
              </div>
              {partner.videoHinweis && <VideoHinweis anbieter={partner.anbieter} />}
            </div>
          ) : (
            <div className="mt-6 md:mt-8 mx-auto grid max-w-[760px] gap-3 sm:grid-cols-3">
              {(partner.schritte ?? []).map((s, i) => (
                <div key={s.titel} className="rounded-2xl border border-white/15 bg-white/10 p-5 text-left">
                  <span className="text-[13px] font-semibold text-white/70">Schritt {i + 1}</span>
                  <p className="mt-1 text-[16px] font-bold text-white">{s.titel}</p>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-white/75">{s.text}</p>
                </div>
              ))}
            </div>
          )}

          <div id="start" ref={heroCtaRef} className="mt-5 md:mt-7 scroll-mt-24">
            <CtaBlock partner={partner} href={partnerLink(partner, `${subId}h`)} onCtaClick={pauseVideo} />
          </div>

          <div className="mt-7 md:mt-9 mx-auto max-w-[760px]">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 md:gap-3">
              {partner.chips.map((label) => (
                <div
                  key={label}
                  className="flex items-center justify-center gap-1.5 md:gap-2 rounded-xl bg-white/10 border border-white/15 px-2 py-2.5"
                >
                  <CheckCircle2 className="h-4 w-4 text-hero shrink-0" aria-hidden />
                  <span className="text-[12px] md:text-[13px] font-medium text-white/90 leading-tight">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* S1a — Check je Anbieter aus den Vergleichsdaten */}
      <AnbieterCheck partner={partner} />

      {/* S1b — Transparenz-Absatz */}
      <section className="bg-background py-10 md:py-14">
        <div className="container max-w-2xl text-center">
          <p className="reveal text-[15px] md:text-[17px] text-foreground/85 leading-relaxed">
            Du kannst dein {produktWort} auch ohne meinen Link eröffnen: derselbe Anbieter, dieselben Konditionen. Der
            einzige Unterschied ist, ob {partner.anbieter} etwas an mich weitergibt.{" "}
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
              <img
                src={`/qr${partner.pfad.replace(/\//g, "-")}.png`}
                alt="QR-Code: Diese Seite auf dem Handy öffnen"
                width={150}
                height={150}
                className="h-[140px] w-[140px] object-contain"
                onError={(e) => {
                  (e.currentTarget.parentElement as HTMLElement).innerHTML =
                    '<span class="text-xs text-muted-foreground text-center px-3">Seite auf dem Handy öffnen</span>';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2 text-primary">
                <QrCode className="h-5 w-5" />
                <h2 className="headline text-xl md:text-2xl">Am Laptop? Mach&apos;s direkt am Handy.</h2>
              </div>
              <p className="mt-2 text-[15px] text-muted-foreground leading-relaxed">
                Scann den Code, die Seite öffnet sich auf deinem Handy und du eröffnest dein {produktWort} dort
                {istDepot ? ", während das Video hier weiterläuft" : ""}.{" "}
                <span className="font-semibold text-foreground">Wichtig:</span> Klick den Button dann auf dem Handy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* S4 — PDF-Anleitung, nur Scalable: die Screenshots zeigen die Scalable-Eröffnung */}
      {partner.kurzname === "scalable" && (
        <section className="bg-surface border-y border-border/60 py-10 md:py-12">
          <div className="container max-w-2xl text-center">
            <p className="reveal text-[15px] md:text-[16px] text-foreground/85">
              Lieber lesen statt schauen? Die komplette Anleitung mit Screenshots:
            </p>
            <div className="reveal mt-4">
              <a
                href="/anleitung-halal-depot.pdf"
                download
                className="pill-btn bg-card text-foreground border border-border hover:border-primary gap-2"
              >
                <Download className="h-4 w-4" />
                Anleitung als PDF herunterladen
              </a>
            </div>
          </div>
          <JumpLink to="#start">Lieber gleich loslegen? ↑</JumpLink>
        </section>
      )}

      {/* S5 — Fakten */}
      <section className="bg-background py-14 md:py-20">
        <div className="container">
          <div className="reveal text-center">
            <span className="inline-flex items-center gap-3 text-[11px] font-semibold tracking-wide text-primary">
              <span className="h-px w-6 bg-primary" /> {istDepot ? "Der Broker" : "Die Bank"}{" "}
              <span className="h-px w-6 bg-primary" />
            </span>
            <h2 className="headline text-3xl md:text-4xl mt-4">Warum {partner.anbieter}? Drei Fakten.</h2>
          </div>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-7">
            {partner.fakten.map((f) => (
              <div
                key={f.titel}
                className="reveal rounded-[1.75rem] bg-card border border-border/70 p-7 md:p-8 text-center shadow-[0_20px_50px_-30px_rgba(80,60,20,0.25)]"
              >
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 mx-auto">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="headline text-lg md:text-xl mb-3">{f.titel}</h3>
                <p className="text-muted-foreground leading-relaxed text-[14px]">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
        <JumpLink to="#los">Zum {produktWort} ↓</JumpLink>
      </section>

      {/* S6 — Riba-Checkliste */}
      <section className="relative overflow-hidden bg-primary text-white py-14 md:py-20">
        <div className="container relative max-w-3xl">
          <div className="reveal text-center">
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-4 py-1.5 text-[11px] font-semibold tracking-wide text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-hero" /> Ehrlichkeit zuerst
            </span>
            <h2 className="headline text-white text-3xl md:text-4xl mt-4 leading-[1.1]">
              {partner.checklisteTitel[0]} <span className="text-hero">{partner.checklisteTitel[1]}</span>
            </h2>
          </div>
          <div className="mt-10 space-y-4">
            {partner.checkliste.map((item, i) => (
              <div key={item.titel} className="reveal flex gap-5 rounded-2xl bg-white/10 border border-white/15 p-6 md:p-7">
                <span className="headline text-2xl text-hero shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="headline text-white text-base md:text-lg">{item.titel}</h3>
                  <p className="mt-1.5 text-white/75 leading-relaxed text-[14px] md:text-[15px]">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
          {istDepot && (
            <p className="reveal mt-8 text-center text-[14px] text-white/70 max-w-xl mx-auto">
              Genau diese Punkte zeige ich dir im Video live, damit dein Start nicht nur bequem, sondern sauber ist.
            </p>
          )}
        </div>
        <JumpLink to="#los" light>
          Alles geklärt? Zum {produktWort} ↓
        </JumpLink>
      </section>

      {/* S7 — Vertrauens-Block */}
      <section className="bg-background py-14 md:py-20">
        <div className="container max-w-4xl">
          <div className="grid md:grid-cols-[280px_1fr] gap-8 md:gap-12 items-center">
            <div className="reveal relative mx-auto max-w-[240px] md:max-w-none">
              <div
                className="absolute -inset-5 bg-gradient-to-br from-primary/25 to-primary/5 rounded-[2.5rem] blur-2xl"
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
              <span className="inline-flex items-center gap-3 text-[11px] font-semibold tracking-wide text-primary">
                <span className="h-px w-6 bg-primary" /> Über mich
              </span>
              <h2 className="headline text-3xl md:text-4xl mt-4">Wer führt dich hier durch?</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed text-[15px] md:text-base">
                Salam, ich bin Elias, Gründer von finanzmuslim. Über 10.000 Muslime lernen bei finanzmuslim, wie
                islamkonformes Investieren wirklich funktioniert: ehrlich, mit klaren Quellen, ohne Schönreden.
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
        <JumpLink to="#los">Zum {produktWort} ↓</JumpLink>
      </section>

      {/* S8 — Mini-FAQ */}
      <section className="bg-surface border-t border-border/60 py-14 md:py-20">
        <div className="container max-w-3xl">
          <div className="reveal text-center">
            <span className="inline-flex items-center gap-3 text-[11px] font-semibold tracking-wide text-primary">
              <span className="h-px w-6 bg-primary" /> FAQs <span className="h-px w-6 bg-primary" />
            </span>
            <h2 className="headline text-3xl md:text-4xl mt-4">Kurze Fragen, klare Antworten</h2>
          </div>
          <div className="mt-10 space-y-4">
            {partner.faqs.map((f, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={f.q}
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

      {/* S9 — Abschluss-Aufruf */}
      <section className="relative overflow-hidden bg-primary text-white py-16 md:py-24">
        <div id="los" ref={finalCtaRef} className="container relative max-w-3xl text-center scroll-mt-24">
          <span className="reveal inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-4 py-1.5 text-[11px] font-semibold tracking-wide text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-hero" /> Bereit?
          </span>
          <h2 className="reveal headline text-white text-3xl md:text-5xl mt-5 leading-[1.05]">
            Dann jetzt, <span className="text-hero">in einem Rutsch.</span>
          </h2>
          <p className="reveal mt-4 text-white/80 leading-relaxed text-[15px] md:text-base">
            {istDepot
              ? "Schritt für Schritt, und dein Halal-Depot steht."
              : "Ein paar Minuten, und dein zinsfreies Konto ist beantragt."}
          </p>
          <div className="reveal mt-8">
            <CtaBlock partner={partner} href={partnerLink(partner, `${subId}f`)} onCtaClick={pauseVideo} />
          </div>
        </div>
      </section>

      {/* S10 — Pflichthinweise */}
      <section className="bg-surface border-t border-border/60 py-8 pb-28">
        <div className="container max-w-3xl text-center">
          {istDepot && (
            <p className="text-[12px] leading-relaxed text-muted-foreground">
              Die in diesem Beitrag enthaltenen Äußerungen, Kommentare und sonstigen Inhalte sind auch dann, wenn
              einzelne Emittenten oder Finanzinstrumente genannt werden, nicht als Anlageberatung zu verstehen und
              stellen weder direkt noch indirekt eine Empfehlung oder Aufforderung zum Kaufen, Halten oder Verkaufen
              eines Finanzinstruments oder eine diesbezügliche Beratung dar.
            </p>
          )}
          <p className="mt-3 text-[12px] leading-relaxed text-muted-foreground">
            {istDepot && "Kapitalanlagen bergen Risiken. "}
            {partner.risikoUrl && (
              <>
                Ausführliche Risikohinweise:{" "}
                <a href={partner.risikoUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                  {partner.risikoUrl.replace(/^https:\/\//, "")}
                </a>{" "}
                ·{" "}
              </>
            )}
            Diese Seite enthält Werbung/Affiliate-Links zu {partner.anbieter}.{" "}
            <Link to="/wie-ich-geld-verdiene" className="underline underline-offset-2">
              Wie ich Geld verdiene
            </Link>
          </p>
        </div>
      </section>

      {/* Sticky-Leiste unten, mobil über die volle Breite, am Desktop als schwebende Leiste */}
      <div
        aria-hidden={!showSticky}
        className={`fixed inset-x-0 bottom-0 z-50 transition-all duration-300 md:bottom-5 md:px-4 ${
          showSticky ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
        }`}
      >
        <div className="mx-auto border-t border-border bg-background/95 px-4 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_-12px_rgba(0,0,0,0.15)] backdrop-blur-md md:max-w-[720px] md:rounded-2xl md:border md:px-5 md:py-3 md:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.35)]">
          <div className="flex items-center gap-3">
            <div className="hidden min-w-0 flex-1 md:block">
              <p className="truncate text-[15px] font-semibold text-foreground">
                {istDepot ? `Dein Halal-Depot bei ${partner.anbieter}` : `Dein zinsfreies Konto bei ${partner.anbieter}`}
              </p>
              <p className="text-[12px] text-muted-foreground">
                Werbung/Affiliate-Link{istDepot ? " · Kapitalanlagen bergen Risiken." : ""}
              </p>
            </div>
            <span className="text-[10px] tracking-wide text-muted-foreground shrink-0 md:hidden">Werbung</span>
            <a
              href={partnerLink(partner, `${subId}s`)}
              rel="sponsored noopener"
              target="_blank"
              tabIndex={showSticky ? 0 : -1}
              onClick={pauseVideo}
              className="pill-btn flex-1 py-3 bg-primary text-primary-foreground hover:bg-primary-hover text-[15px] font-bold md:flex-none md:px-8"
            >
              {partner.knopf}
            </a>
          </div>
          {istDepot && (
            <p className="mt-1.5 text-center text-[10px] text-muted-foreground md:hidden">Kapitalanlagen bergen Risiken.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const InvestmentStart = () => {
  const { partner: kurzname } = useParams();
  const partner = findStartPartner(kurzname);
  if (!partner || (kurzname && kurzname === "scalable")) return <Navigate to="/dein-investmentstart" replace />;
  return <InvestmentStartSeite key={partner.kurzname} partner={partner} />;
};

export default InvestmentStart;
