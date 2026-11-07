import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Copy, PictureInPicture2, Volume2 } from "lucide-react";
import AnbieterLogo from "@/components/AnbieterLogo";
import Seo from "@/components/Seo";
import { Sterne } from "@/components/vergleich/VergleichsBausteine";
import { noteZahl } from "@/components/vergleich/vergleichTypen";
import { anlagenListe, FLATEX_VERZICHT, noteImVergleich, type BrokerStart } from "@/data/brokerStart";
import type { StartPartner } from "@/data/investmentStart";
import { aktuelleSubId, herkunftAufnehmen } from "@/lib/attribution";
import { blockerFest } from "@/lib/direktLink";
import { ereignis } from "@/lib/messung";

/**
 * Schlanke Startseite je Depot (CV21F, Elias 07.11.2026): „direkt der Link und ein Video“, die Seite endet sichtbar
 * mit dem Video. Erst weit darunter die kaufbaren Halal-Anlagen als kleine Liste ohne Links („dass die Leute keine
 * Ablenkung haben, die werden nur bestätigt“) und die blauen Links. Keine Fragen, keine anderen Broker, kein
 * Zinskonto-Text: den Kontext gibt Elias im Video. Inhalte in src/data/brokerStart.ts.
 */

/** Bild-im-Bild: Chrome und Firefox über die Web-API, Safari am iPhone über webkitSetPresentationMode. */
type SafariVideo = HTMLVideoElement & { webkitSetPresentationMode?: (m: "inline" | "picture-in-picture") => void };
const bildImBildMoeglich = (): boolean =>
  typeof document !== "undefined" &&
  (Boolean(document.pictureInPictureEnabled) || "webkitSetPresentationMode" in HTMLVideoElement.prototype);

const BrokerStartSeite = ({ partner, start }: { partner: StartPartner; start: BrokerStart }) => {
  const [subId, setSubId] = useState("start");
  useEffect(() => {
    herkunftAufnehmen(new URLSearchParams(window.location.search).get("src"));
    setSubId(aktuelleSubId());
    window.scrollTo(0, 0);
  }, []);

  const note = noteImVergleich(start.vergleichId);
  const gruppen = anlagenListe(start.vergleichId);
  const href = partner.link.replace("{SUBID}", `${subId}h`);
  const knopf = blockerFest(partner.kurzname, href, true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [stumm, setStumm] = useState(true);
  const [pipMoeglich, setPipMoeglich] = useState(false);
  useEffect(() => setPipMoeglich(bildImBildMoeglich()), []);

  const tonAn = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    v.volume = 1;
    void v.play();
    setStumm(false);
    ereignis("ton_an", { anbieter: partner.kurzname, sekunde: Math.round(v.currentTime) });
  };
  const bildImBild = async () => {
    const v = videoRef.current as SafariVideo | null;
    if (!v) return;
    try {
      if (document.pictureInPictureElement) await document.exitPictureInPicture();
      else if (v.requestPictureInPicture) await v.requestPictureInPicture();
      else v.webkitSetPresentationMode?.("picture-in-picture");
      ereignis("bild_im_bild", { anbieter: partner.kurzname, sekunde: Math.round(v.currentTime) });
    } catch {
      /* Browser lehnt ab: das Video läuft einfach weiter. */
    }
  };
  /* Klick zum Anbieter: Läuft das Video mit Ton, geht es ins Bild-im-Bild und führt weiter durch die Eröffnung.
     Sonst hält es an, damit nichts im Hintergrund weiterspricht. */
  const zumAnbieter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const v = videoRef.current;
    ereignis("partner_klick", {
      anbieter: partner.kurzname,
      weg: "start",
      knopf: "h",
      video_sekunde: v ? Math.round(v.currentTime) : -1,
    });
    if (v && !v.paused && !v.muted && pipMoeglich) void bildImBild();
    else v?.pause();
    knopf.oeffnen?.(e);
  };

  /* Video: Start, jedes Viertel, Ende, wie auf den anderen Startseiten. */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    let gestartet = false;
    let viertel = 0;
    const lauf = () => {
      if (!v.duration) return;
      if (!gestartet && v.currentTime > 0.5) {
        gestartet = true;
        ereignis("video_start", { anbieter: partner.kurzname, ton: !v.muted });
      }
      const jetzt = Math.floor((v.currentTime / v.duration) * 4);
      if (jetzt > viertel && jetzt < 4) {
        viertel = jetzt;
        ereignis("video_viertel", { anbieter: partner.kurzname, viertel: jetzt * 25, ton: !v.muted });
      }
    };
    const ende = () => ereignis("video_ende", { anbieter: partner.kurzname, ton: !v.muted });
    v.addEventListener("timeupdate", lauf);
    v.addEventListener("ended", ende);
    return () => {
      v.removeEventListener("timeupdate", lauf);
      v.removeEventListener("ended", ende);
    };
  }, [partner.kurzname]);

  const [mailOffen, setMailOffen] = useState(false);
  const [kopiert, setKopiert] = useState(false);
  const kopieren = async () => {
    try {
      await navigator.clipboard.writeText(`${FLATEX_VERZICHT.betreff}\n\n${FLATEX_VERZICHT.text}`);
      setKopiert(true);
      ereignis("kredit_mail_kopiert", { anbieter: partner.kurzname });
    } catch {
      setKopiert(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title={`Dein Halal-Depot bei ${partner.anbieter} – finanzmuslim`}
        description={`Dein Halal-Depot bei ${partner.anbieter} in 10 Minuten, Schritt für Schritt im Video.`}
        path={partner.pfad}
        noindex
      />

      {/* Kopf: Titel, Anbieter mit Note und zwei Zeilen, Knopf, Video. Hier endet, was man ohne Scrollen sieht. */}
      <section
        className="relative overflow-hidden bg-primary text-white"
        style={{
          backgroundImage: `radial-gradient(55% 45% at 50% 0%, ${partner.markenfarbe}59 0%, transparent 70%), radial-gradient(45% 40% at 100% 100%, hsl(var(--violet) / 0.45) 0%, transparent 70%)`,
        }}
      >
        <div className="container relative pt-7 pb-10 md:pt-12 md:pb-16">
          <div className="mx-auto max-w-[760px]">
            {/* Elias, CV21F 08.11.: weniger Dinge, die um den Blick kämpfen. Titel klein in einer Zeile, der Kasten führt. */}
            <h1 className="headline text-center text-white text-[24px] sm:text-[30px] md:text-[36px] leading-[1.1]">
              Dein Halal-Depot in 10 Minuten
            </h1>

            <div className="mx-auto mt-4 max-w-[560px] rounded-2xl bg-white p-4 text-foreground shadow-[0_20px_50px_-20px_rgba(0,0,0,0.45)] md:mt-7 md:p-5">
              <div className="flex items-center gap-3">
                <AnbieterLogo name={partner.anbieter} domain={partner.domain} />
                <div className="min-w-0 flex-1">
                  <p className="text-[17px] font-bold leading-tight">{partner.anbieter}</p>
                  <p className="mt-0.5 text-[14px] leading-snug text-muted-foreground">{start.bestaetigung}</p>
                </div>
                {note !== null && (
                  <div className="shrink-0 text-right">
                    <p className="text-[20px] font-bold leading-none">{noteZahl(note)}</p>
                    <div className="mt-1">
                      <Sterne note={note} />
                    </div>
                  </div>
                )}
              </div>
              <ul className="mt-3.5 space-y-2 border-t border-border/70 pt-3.5">
                {start.zeilen.map((z) => (
                  <li key={z} className="flex items-start gap-2 text-[16px] leading-snug">
                    <CheckCircle2 className="mt-[2px] h-[18px] w-[18px] shrink-0 text-gain" aria-hidden />
                    {z}
                  </li>
                ))}
              </ul>
              {start.kostenHinweis && <p className="mt-1.5 pl-[26px] text-[12px] leading-snug text-muted-foreground">{start.kostenHinweis}</p>}
            </div>

            {/* Werbekennzeichnung wie Finanzfluss: Sternchen am Knopf, Erklärung in der Fußnote unten. */}
            <div className="mt-4 flex flex-col items-center gap-2 md:mt-5">
              <a
                href={knopf.href}
                rel="sponsored noopener"
                target="_blank"
                onClick={zumAnbieter}
                className="pill-btn w-full max-w-[560px] bg-white text-primary hover:bg-hero text-base md:text-lg font-bold shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)]"
              >
                Depot bei {partner.anbieter} eröffnen*
              </a>
              {start.pflicht && <p className="max-w-[560px] text-center text-[15px] leading-snug text-white/90">{start.pflicht}</p>}
            </div>

            <div className="mt-8 md:mt-10">
              <div className="relative w-full aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)]">
                {start.video ? (
                  <>
                    <video
                      ref={videoRef}
                      className="absolute inset-0 h-full w-full object-cover"
                      src={start.video.src}
                      poster={start.video.poster}
                      autoPlay
                      muted
                      playsInline
                      controls
                      preload="metadata"
                      title={`Depot bei ${partner.anbieter} einrichten`}
                    />
                    <div className="absolute bottom-14 left-3 flex gap-2 md:bottom-16 md:left-4">
                      {stumm && (
                        <button
                          type="button"
                          onClick={tonAn}
                          className="inline-flex min-h-[40px] items-center gap-2 rounded-lg bg-white/95 px-4 text-[13px] font-bold text-primary shadow-[0_10px_30px_-8px_rgba(0,0,0,0.6)] hover:bg-hero md:text-[14px]"
                        >
                          <Volume2 className="h-4 w-4" aria-hidden /> Ton an
                        </button>
                      )}
                      {pipMoeglich && (
                        <button
                          type="button"
                          onClick={() => void bildImBild()}
                          aria-label="Video als kleines Fenster weiterlaufen lassen"
                          className="inline-flex min-h-[40px] items-center gap-2 rounded-lg bg-white/95 px-3 text-[13px] font-bold text-primary shadow-[0_10px_30px_-8px_rgba(0,0,0,0.6)] hover:bg-hero md:text-[14px]"
                        >
                          <PictureInPicture2 className="h-4 w-4" aria-hidden /> Bild im Bild
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <div data-platzhalter className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-6 text-center">
                    <p className="text-[16px] font-bold text-white">Video folgt</p>
                    <p className="text-[14px] text-white/70">Einrichtung bei {partner.anbieter}, Querformat, startet ohne Ton</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Weit darunter, damit der Blick beim Video bleibt: Bestätigung und die zwei Wege für die, die es brauchen. */}
      <section className="bg-background pb-12 pt-[70vh]">
        <div className="container max-w-[560px]">
          {gruppen.length > 0 && (
            <div className="text-foreground/80">
              <p className="text-[15px] font-semibold text-foreground">Halal-Anlagen bei {partner.anbieter}</p>
              {gruppen.map((g) => (
                <div key={g.titel} className="mt-4">
                  <p className="text-[13px] font-semibold text-muted-foreground">
                    {g.titel} ({g.namen.length})
                  </p>
                  <ul className="mt-1 space-y-0.5 text-[14px] leading-snug">
                    {g.namen.map((n) => (
                      <li key={n}>{n}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          <div className="mt-14 space-y-6 text-[17px]">
            {start.kreditVerzicht && (
              <div>
                <p className="font-bold text-foreground">Kein Kreditrahmen gewünscht?</p>
                <button
                  type="button"
                  onClick={() => setMailOffen((o) => !o)}
                  aria-expanded={mailOffen}
                  aria-controls="kredit-mail"
                  className="mt-0.5 font-semibold text-primary underline-offset-4 hover:underline"
                >
                  Hier zur fertigen Mail
                </button>
                {mailOffen && (
                  <div id="kredit-mail" className="mt-3 rounded-xl border border-border bg-accent/50 p-4 text-[15px] leading-relaxed">
                    <p className="font-semibold">Betreff: {FLATEX_VERZICHT.betreff}</p>
                    <p className="mt-2 whitespace-pre-line">{FLATEX_VERZICHT.text}</p>
                    <button
                      type="button"
                      onClick={() => void kopieren()}
                      className="mt-3 inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-primary px-4 text-[15px] font-bold text-primary-foreground hover:bg-primary-hover"
                    >
                      <Copy className="h-4 w-4" aria-hidden /> {kopiert ? "Kopiert" : "Text kopieren"}
                    </button>
                    <p className="mt-2 text-[14px] text-muted-foreground">Einfügen {FLATEX_VERZICHT.weg.replace(/^In/, "in")}.</p>
                  </div>
                )}
              </div>
            )}
            <div>
              <p className="font-bold text-foreground">Du hast schon ein Depot?</p>
              <a
                href={start.wechselUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => ereignis("wechsel_klick", { anbieter: partner.kurzname })}
                className="mt-0.5 inline-block font-semibold text-primary underline-offset-4 hover:underline"
              >
                Hier zum Depotwechsel
              </a>
            </div>
          </div>

          <p className="mt-16 text-[12px] leading-relaxed text-muted-foreground">
            *Das ist ein Werbe- oder Affiliate-Link: Eröffnest du darüber ein Depot, bekomme ich eine Provision, für dich
            ohne Mehrkosten. Keine Anlageberatung.{" "}
            {partner.risikoUrl ? (
              <a href={partner.risikoUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                Kapitalanlagen bergen Risiken.
              </a>
            ) : (
              "Kapitalanlagen bergen Risiken."
            )}{" "}
            <Link to="/wie-ich-geld-verdiene" className="underline underline-offset-2">
              Wie ich Geld verdiene
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
};

export default BrokerStartSeite;
