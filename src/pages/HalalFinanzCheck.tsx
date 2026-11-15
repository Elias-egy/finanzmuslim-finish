import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import Seo from "@/components/Seo";
import { AnbieterLogo } from "@/components/AnbieterLogo";
import FreitagsbriefFormular from "@/components/FreitagsbriefFormular";
import { ereignis } from "@/lib/messung";
import { followerGesamt } from "@/data/beweise";
import {
  FRAGEN,
  UEBERSCHRIFT,
  UNTERZEILE,
  WERBEHINWEIS,
  ergebnisAus,
  fragenGesamt,
  naechsteFrage,
  outLink,
  quelleAus,
  type Antworten,
  type FrageId,
} from "@/data/halalFinanzCheck";

/**
 * Halal-Finanz-Check, RN5 (15.11.2026). Vollbild ohne Menü (Layout.tsx), die erste Frage steht sofort da, ohne
 * „Jetzt starten“ (Perspective-Tipp 13). Nach dem Tipp springt die Seite zur nächsten Frage. Am Ende genau eine
 * Empfehlung mit einem Knopf direkt zum Anbieter über /out (Elias RN3-07: „direkt auf den Partnerlink. Ohne eine
 * Zwischenbrücke“). Die Mail ist freiwillig und kommt ganz am Ende. Logik und Texte: src/data/halalFinanzCheck.ts.
 */
const HalalFinanzCheck = () => {
  const [params] = useSearchParams();
  const quelle = quelleAus(params.get("quelle"));
  // Aus einem Freebie kommt die erste Antwort schon mit (?ziel=…, CheckEinstieg.tsx): dann beginnt der Check bei Frage 2.
  const zielAusFreebie = params.get("ziel");
  const vorab: Antworten =
    zielAusFreebie === "konto" || zielAusFreebie === "invest" || zielAusFreebie === "beides" ? { ziel: zielAusFreebie } : {};
  const [antworten, setAntworten] = useState<Antworten>(vorab);
  const [verlauf, setVerlauf] = useState<FrageId[]>(vorab.ziel ? ["ziel"] : []);
  const [gewaehlt, setGewaehlt] = useState<string | null>(null);
  const oben = useRef<HTMLDivElement>(null);

  const frageId = naechsteFrage(antworten);
  const ergebnis = useMemo(() => ergebnisAus(antworten, quelle), [antworten, quelle]);
  const nummer = verlauf.length + 1;
  const gesamt = fragenGesamt(antworten);

  useEffect(() => {
    ereignis("check_start", { quelle, ziel: zielAusFreebie ?? "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quelle]);

  useEffect(() => {
    if (!ergebnis) return;
    ereignis("quiz_ergebnis", { check: true, quelle, ergebnis: ergebnis.art, anbieter: ergebnis.anbieter.out });
  }, [ergebnis, quelle]);

  // Beim Wechsel der Frage oben anfangen, ohne dass die Seite selbst wegscrollt (nur zurück an den Anfang).
  useEffect(() => {
    oben.current?.scrollIntoView({ block: "start" });
  }, [frageId]);

  const waehle = (id: FrageId, wert: string) => {
    if (gewaehlt) return;
    setGewaehlt(wert);
    ereignis("quiz_frage", { check: true, quelle, frage: id, antwort: wert, nummer });
    window.setTimeout(() => {
      setAntworten((a) => ({ ...a, [id]: wert }));
      setVerlauf((v) => [...v, id]);
      setGewaehlt(null);
    }, 260);
  };

  const zurueck = () => {
    const letzte = verlauf[verlauf.length - 1];
    if (!letzte) return;
    setVerlauf((v) => v.slice(0, -1));
    setAntworten((a) => {
      const neu = { ...a };
      delete neu[letzte];
      return neu;
    });
  };

  const neu = () => {
    setAntworten({});
    setVerlauf([]);
  };

  return (
    <div ref={oben} className="scroll-mt-0 bg-background">
      <Seo
        title="Halal-Finanz-Check: Konto, Depot oder beides? | finanzmuslim"
        description="Beantworte 3 kurze Fragen und sieh, womit du halal startest: zinsfreies Girokonto, Halal-Depot oder beides."
        path="/check"
        noindex
      />
      <div className="container max-w-[560px] pb-10 pt-2 md:pt-6">
        {frageId && (
          <section aria-live="polite">
            {/* Fortschritt gleich oben, die Zahlen stimmen je Weg (Konto 2 Fragen, sonst 3). */}
            <div className="flex items-center justify-between gap-3 text-[14px] font-semibold text-muted-foreground">
              <span>
                Frage {nummer} von {gesamt}
                {nummer === 1 && " · 60 Sekunden"}
              </span>
              {verlauf.length > 0 && (
                <button
                  type="button"
                  onClick={zurueck}
                  className="inline-flex min-h-[44px] items-center gap-1 text-[15px] font-semibold text-primary"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden />
                  Zurück
                </button>
              )}
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-300"
                style={{ width: `${(nummer / gesamt) * 100}%` }}
              />
            </div>

            {nummer === 1 && (
              <>
                <p className="mt-6 text-[14px] font-bold uppercase tracking-wide text-violet">Halal-Finanz-Check</p>
                <h1 className="mt-2 text-[28px] font-bold leading-[1.15] tracking-tight text-foreground [text-wrap:balance] md:text-[34px]">
                  {UEBERSCHRIFT[quelle]}
                </h1>
                <p className="mt-2 text-[17px] leading-snug text-muted-foreground">{UNTERZEILE}</p>
              </>
            )}

            <h2 className={`${nummer === 1 ? "mt-7" : "mt-8"} text-[22px] font-bold leading-tight text-foreground md:text-[24px]`}>
              {FRAGEN[frageId].titel}
            </h2>
            <ul className="mt-4 space-y-3">
              {FRAGEN[frageId].optionen.map((o) => {
                const aktiv = gewaehlt === o.wert;
                const gruen = Boolean(o.etikett);
                return (
                  <li key={o.wert}>
                    <button
                      type="button"
                      onClick={() => waehle(frageId, o.wert)}
                      className={`flex min-h-[64px] w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-colors ${
                        aktiv
                          ? "border-primary bg-accent"
                          : gruen
                            ? "border-gain bg-gain-soft hover:border-gain"
                            : "border-border bg-card hover:border-primary"
                      }`}
                    >
                      <span className="min-w-0 flex-1">
                        {o.etikett && (
                          <span className="mb-1 inline-block rounded-full bg-gain px-2.5 py-0.5 text-[12px] font-bold text-white">
                            {o.etikett}
                          </span>
                        )}
                        <span className="block text-[17px] font-bold leading-tight text-foreground">{o.titel}</span>
                        {o.unter && <span className="mt-0.5 block text-[15px] leading-snug text-muted-foreground">{o.unter}</span>}
                      </span>
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                          aktiv ? "border-primary bg-primary text-white" : "border-border"
                        }`}
                        aria-hidden
                      >
                        {aktiv && <Check className="h-4 w-4" />}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {nummer === 1 && (
              <p className="mt-5 text-[16px] leading-snug text-foreground">
                <strong>Du musst nicht sofort investieren.</strong> Ein zinsfreies Girokonto ist der leichteste erste Schritt.
              </p>
            )}
            <p className="mt-6 text-center text-[14px] font-medium text-muted-foreground">Kostenlos · ohne Anmeldung · keine Beträge nötig</p>
          </section>
        )}

        {ergebnis && (
          <section aria-live="polite" className="pt-4">
            <p className="text-[14px] font-bold uppercase tracking-wide text-violet">Dein Ergebnis</p>
            <div className="mt-3 rounded-2xl border-2 border-primary bg-card p-5 shadow-[0_4px_24px_rgba(0,0,0,0.06)] md:p-6">
              <p className="text-[16px] font-semibold leading-snug text-muted-foreground">{ergebnis.vorspann}</p>
              <div className="mt-3 flex items-center gap-3">
                <AnbieterLogo name={ergebnis.anbieter.name} domain={ergebnis.anbieter.domain} gross />
                <p className="min-w-0 text-[24px] font-bold leading-tight text-foreground">
                  {ergebnis.anbieter.name}
                  <span className="block text-[16px] font-semibold text-muted-foreground">{ergebnis.anbieter.produkt}</span>
                </p>
              </div>
              <p className="mt-4 text-[17px] leading-snug text-foreground">{ergebnis.warum}</p>
              <p className="mt-4 text-[15px] font-bold text-foreground">Warum das zu dir passt</p>
              <ul className="mt-2 space-y-2">
                {ergebnis.vorteile.map((v) => (
                  <li key={v} className="flex items-start gap-2 text-[16px] leading-snug text-foreground">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-gain" aria-hidden />
                    {v}
                  </li>
                ))}
              </ul>
              {ergebnis.pflicht && <p className="mt-4 text-[16px] font-semibold leading-snug text-foreground">{ergebnis.pflicht}</p>}
              {/* Echte Zahl bei der Empfehlung (Perspective-Frage 4, Elias RN6: „Followerzahl“). */}
              <figure className="mt-4 flex items-center gap-3 border-t border-border pt-4">
                <img src="/elias-el-gendy.webp" alt="Elias El-Gendy" width={44} height={44} className="h-11 w-11 shrink-0 rounded-full object-cover" />
                <figcaption className="text-[15px] font-semibold leading-snug text-foreground">
                  Über {followerGesamt} folgen mir auf Instagram und TikTok.
                  <span className="block text-[14px] font-normal text-muted-foreground">Elias, finanzmuslim</span>
                </figcaption>
              </figure>
              {/* Knopf direkt zum Anbieter über /out (Partnerlinks nur dort), Werbehinweis als Sternchen. */}
              <a
                href={outLink(quelle, ergebnis.anbieter)}
                className="btn-spark mt-5 flex min-h-[56px] w-full items-center justify-center gap-2 rounded-full px-6 text-[18px] font-bold"
              >
                {ergebnis.knopf}*
                <ArrowRight className="h-5 w-5" aria-hidden />
              </a>
            </div>

            {ergebnis.danach && (
              <a
                href={ergebnis.danach.link}
                className="mt-4 flex min-h-[56px] items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-[16px] font-semibold text-foreground hover:border-primary"
              >
                <AnbieterLogo name={ergebnis.danach.anbieter.name} domain={ergebnis.danach.anbieter.domain} klein />
                <span className="min-w-0 flex-1">{ergebnis.danach.satz}*</span>
                <ArrowRight className="h-5 w-5 shrink-0 text-primary" aria-hidden />
              </a>
            )}

            <p className="mt-4 text-[14px] leading-snug text-muted-foreground">{WERBEHINWEIS}</p>

            <div className="mt-10 border-t border-border pt-6">
              <p className="text-[19px] font-bold text-foreground">Jeden Freitag ein Schritt näher</p>
              <p className="mt-1 text-[16px] leading-snug text-muted-foreground">Freiwillig: das Wichtigste für dein Geld per Mail.</p>
              <FreitagsbriefFormular id="check-newsletter-email" variante="startseite" />
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
              <button type="button" onClick={neu} className="inline-flex min-h-[44px] items-center text-[15px] font-semibold text-primary">
                Check neu starten
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default HalalFinanzCheck;
