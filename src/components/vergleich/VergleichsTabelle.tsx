import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnbieterLogo } from "@/components/AnbieterLogo";
import { AngebotsDialog } from "./AngebotsDialog";
import {
  AnbieterName,
  AngebotsKnopf,
  BonusSchild,
  NotenBlock,
  ZellInhalt,
  auszeichnungFarbe,
  auszeichnungGrund,
  auszeichnungVon,
} from "./VergleichsBausteine";
import { hatEinzelheiten, type VergleichsSpalte, type VergleichsZeile } from "./vergleichTypen";

/**
 * Die gedrehte Tabelle fuer den Laptop: links stehen die Kriterien, rechts je
 * Anbieter eine Spalte. Man schiebt waagerecht durch die Anbieter.
 *
 * Warum gedreht: bei dreissig Kriterien und dreissig Anbietern ist die normale
 * Richtung unlesbar. So bleibt die Frage stehen und die Antworten wandern.
 *
 * Drei Dinge sind abgeschaut, weil sie den Unterschied machen. Erstens klebt
 * die Anbieterzeile mit Logo oben, sonst weiss man nach zehn Zeilen nicht mehr,
 * wessen Zahl man liest. Zweitens klebt die Kriterienspalte links, sonst
 * verliert man beim Schieben die Frage. Drittens steht die Angebotszeile
 * zweimal, oben und ganz unten, damit der Weg zum Anbieter nie weit ist.
 *
 * Seit SEO74 wie Finanzfluss: Der Kopf je Spalte trägt einen eckigen Reiter mit der Platzzahl und
 * die Auszeichnung als Text, darunter Logo und Name (blau mit Stern); Note mit Sternen und
 * Produktdetails stehen in der ersten Zeile. Eine Spalte mit Auszeichnung ist leicht getönt. Die untere Angebotszeile läuft
 * als Leiste am unteren Rand mit, sobald die obere aus dem Bild ist, und endet an ihrem Platz unter
 * der Tabelle (Elias CV17F „Pop-up“, CV18F „Nur Laptop“).
 *
 * Kopf und Leiste sitzen außerhalb des Schiebers: `overflow-x: auto` macht ihn zum eigenen
 * Scroll-Bereich, ein `sticky top` darin klebt nie am Fenster. Beide folgen ihm über `scrollLeft`.
 *
 * Die Zellen zeigen nur den Wert. Ein Klick auf die Kopfzeile eines Angebots öffnet
 * `AngebotsDialog` mit dem Satz zur Zins-Ampel und den Quellen (Elias, 07.10.2026).
 */
const SPALTE = 208;
const KRITERIEN = 224;
/** Hoehe der Kopfleiste der Website. Die Tabelle klebt darunter, nicht darauf. */
const KOPF = 68;

const gruppenTitel: Record<string, string> = {
  angebot: "Anbieter und Angebot",
  halal: "Halal-Merkmale",
  kosten: "Kosten und Konditionen",
};


export const VergleichsTabelle = ({
  zeilen,
  spalten,
}: {
  zeilen: VergleichsZeile[];
  spalten: VergleichsSpalte[];
}) => {
  const schieber = useRef<HTMLDivElement>(null);
  const kopfLeiste = useRef<HTMLDivElement>(null);
  const untenLeiste = useRef<HTMLDivElement>(null);
  const obenAngebot = useRef<HTMLDivElement>(null);
  const [von, setVon] = useState(1);
  const [bis, setBis] = useState(1);
  const [offen, setOffen] = useState<string | null>(null);
  const [erklaert, setErklaert] = useState<string | null>(null);
  /* Die Leiste unten erscheint erst, wenn die obere Angebotszeile aus dem Bild ist: sonst stünden
     dieselben Knöpfe zweimal im ersten Bildschirm. */
  const [leisteZeigen, setLeisteZeigen] = useState(false);

  const merkeStelle = useCallback(() => {
    const el = schieber.current;
    if (!el) return;
    if (kopfLeiste.current) kopfLeiste.current.scrollLeft = el.scrollLeft;
    if (untenLeiste.current) untenLeiste.current.scrollLeft = el.scrollLeft;
    const sichtbar = Math.max(1, Math.floor((el.clientWidth - KRITERIEN) / SPALTE));
    /* Runden statt Abschneiden: sanftes Blättern endet oft einen Bruchteil vor der Spaltenkante. */
    const erste = Math.round(el.scrollLeft / SPALTE) + 1;
    /* Ganz rechts angekommen zählt die letzte Spalte mit, auch wenn sie nicht voll in die Breite passt. */
    const amEnde = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    setVon(Math.min(erste, spalten.length));
    setBis(amEnde ? spalten.length : Math.min(erste + sichtbar - 1, spalten.length));
  }, [spalten.length]);

  /* ResizeObserver statt window.resize: beim ersten Rendern ist die Breite
     noch 0, ein einmaliger Aufruf misst dann ins Leere und der Zaehler steht
     dauerhaft auf "1 bis 1". */
  useEffect(() => {
    const el = schieber.current;
    if (!el) return;
    const beobachter = new ResizeObserver(merkeStelle);
    beobachter.observe(el);
    return () => beobachter.disconnect();
  }, [merkeStelle]);

  useEffect(() => {
    const ziel = obenAngebot.current;
    if (!ziel) {
      setLeisteZeigen(true);
      return;
    }
    const beobachter = new IntersectionObserver(
      ([e]) => setLeisteZeigen(!e.isIntersecting && e.boundingClientRect.top < KOPF),
      { rootMargin: `-${KOPF}px 0px 0px 0px` },
    );
    beobachter.observe(ziel);
    return () => beobachter.disconnect();
  }, []);

  const schiebe = (richtung: 1 | -1) =>
    schieber.current?.scrollBy({ left: richtung * SPALTE * 2, behavior: "smooth" });

  const raster = {
    gridTemplateColumns: `${KRITERIEN}px repeat(${spalten.length}, ${SPALTE}px)`,
    width: KRITERIEN + spalten.length * SPALTE,
  };
  /* Ohne diesen Fade wirkt die zuletzt angeschnittene Spalte wie ein
     Darstellungsfehler statt wie ein Hinweis zum Weiterschieben. Nur
     aktiv, solange rechts noch etwas folgt; am Ende der Liste steht
     die letzte Spalte wieder scharf. Kopf und Leiste blenden gleich aus. */
  const maske =
    bis < spalten.length
      ? {
          WebkitMaskImage: "linear-gradient(to right, black calc(100% - 96px), transparent 100%)",
          maskImage: "linear-gradient(to right, black calc(100% - 96px), transparent 100%)",
        }
      : undefined;
  const grund = (s: VergleichsSpalte) => {
    const a = auszeichnungVon(s);
    return a ? auszeichnungGrund[a.ton] : "";
  };
  const mitNote = spalten.some((s) => s.note !== null);

  const zelle = "flex min-h-[60px] items-center justify-center border-b border-border px-3 py-2 text-center text-[13px]";
  const kriterium =
    "sticky left-0 z-20 flex min-h-[60px] items-center border-b border-r border-border bg-card px-3 py-2 text-[13px] text-foreground";
  const angebot = (s: VergleichsSpalte) => (
    <div className="w-full">
      <AngebotsKnopf link={s.link} abgeraten={s.abgeraten} />
      {!s.abgeraten && <BonusSchild anbieterId={s.id} />}
    </div>
  );

  let letzteGruppe = "";

  return (
    <div className="relative">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[14px] text-muted-foreground">
          {von} bis {bis} von {spalten.length} Angeboten
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => schiebe(-1)}
            aria-label="Anbieter nach links"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-surface"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => schiebe(1)}
            aria-label="Anbieter nach rechts"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-surface"
          >
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </div>

      {/* `overflow: clip` rundet die Ecken, ohne ein Scroll-Bereich zu werden: Kopf und Leiste kleben am Fenster. */}
      <div className="rounded-lg border border-border bg-card" style={{ overflow: "clip" }}>
        {/* Kopf: Reiter mit Platz und Auszeichnung, darunter das Logo. Klebt unter der Kopfleiste der Website. */}
        <div className="sticky z-30 border-b border-border bg-card" style={{ top: KOPF }}>
          <div ref={kopfLeiste} className="overflow-hidden" style={maske}>
            <div className="grid" style={raster}>
              <div className="sticky left-0 z-10 flex flex-col justify-end border-r border-border bg-card px-3 py-2">
                <p className="text-[14px] font-semibold text-foreground">Anbieter</p>
                <p className="text-[12px] text-muted-foreground">
                  {von} bis {bis} von {spalten.length}
                </p>
              </div>
              {spalten.map((s) => {
                const a = auszeichnungVon(s);
                const hervor = a?.ton === "empfehlung";
                return (
                  <div key={s.id} className="flex flex-col border-r border-border bg-card last:border-r-0">
                    <div className={`flex h-full flex-col ${grund(s)}`}>
                      {s.abgeraten ? (
                        <p className="flex h-7 items-center justify-center bg-destructive/10 px-2 text-[12px] font-semibold text-destructive">
                          Davon raten wir ab
                        </p>
                      ) : (
                        <div className="flex h-7 items-stretch">
                          {s.platz != null && (
                            <span
                              className={`flex min-w-[28px] items-center justify-center rounded-br-lg border-b border-r px-1.5 text-[13px] font-semibold ${
                                hervor ? "border-primary bg-primary text-primary-foreground" : "border-border text-foreground"
                              }`}
                            >
                              {s.platz}
                            </span>
                          )}
                          {a && (
                            <span className={`min-w-0 flex-1 truncate px-2 text-center text-[13px] font-semibold leading-7 ${auszeichnungFarbe[a.ton]}`}>
                              {a.text}
                            </span>
                          )}
                        </div>
                      )}
                      <div className="flex flex-1 flex-col items-center justify-center gap-1.5 px-3 pb-2.5 pt-1.5">
                        <AnbieterLogo name={s.anbieter} domain={s.domain} gross />
                        {/* Der Name klebt mit: nach zehn Zeilen sagt ein Symbol allein nicht mehr, wessen Zahl man liest. */}
                        <p className="w-full truncate text-center text-[13px] leading-snug" title={`${s.anbieter} ${s.produkt}`}>
                          <AnbieterName spalte={s} />
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div ref={schieber} onScroll={merkeStelle} className="overflow-x-auto" style={maske}>
          <div className="grid" style={raster}>
            {/* Bewertung: Note mit Sternen, darunter Tarif und Produktdetails. Ohne Noten heißt die Zeile „Produkt“. */}
            <div className={kriterium}>{mitNote ? "Bewertung" : "Produkt"}</div>
            {spalten.map((s) => {
              const klickbar = Boolean(s.tarif) || hatEinzelheiten(s, zeilen);
              return (
                <div key={`note-${s.id}`} className={`${zelle} flex-col gap-1 border-r last:border-r-0 ${grund(s)}`}>
                  {mitNote && (s.note !== null ? <NotenBlock note={s.note} mittig /> : <span className="text-muted-foreground">–</span>)}
                  {s.tarif && (
                    /* Nur die Marke: Der Satz dazu steht im Dialog, sonst wächst die Zeile aller Spalten mit. */
                    <span className="rounded bg-violet/10 px-2 py-0.5 text-[11px] font-semibold text-violet">
                      {s.tarif.marke}
                    </span>
                  )}
                  {klickbar && (
                    <button
                      type="button"
                      onClick={() => setOffen(s.id)}
                      aria-haspopup="dialog"
                      className="inline-flex min-h-[28px] items-center text-[12px] font-medium text-primary hover:underline"
                    >
                      Produktdetails
                      <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                    </button>
                  )}
                </div>
              );
            })}

            {/* Datenzeilen */}
            {zeilen.map((z) => {
              const neueGruppe = z.gruppe !== letzteGruppe;
              letzteGruppe = z.gruppe;
              return (
                <div key={z.key} className="contents">
                  {neueGruppe && (
                    <>
                      <div className="sticky left-0 z-20 border-b border-r border-border bg-surface px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        {gruppenTitel[z.gruppe]}
                      </div>
                      {spalten.map((s) => (
                        <div
                          key={`${z.key}-g-${s.id}`}
                          className="border-b border-r border-border bg-surface last:border-r-0"
                        />
                      ))}
                    </>
                  )}
                  <div ref={z.key === "__angebot" ? obenAngebot : undefined} className={kriterium}>
                    {z.hinweis ? (
                      /* Wie Finanzfluss: ein Kriterium mit Erklärung ist blau gepunktet unterstrichen, ein Klick
                         zeigt die Erklärung (Elias SEO74: „wie bei Finanzfluss sollten die teilweise auch blau sein“). */
                      <span>
                        <button
                          type="button"
                          onClick={() => setErklaert((alt) => (alt === z.key ? null : z.key))}
                          aria-expanded={erklaert === z.key}
                          title={z.hinweis}
                          className="text-left font-medium text-primary underline decoration-dotted underline-offset-4 hover:text-primary-hover"
                        >
                          {z.label}
                        </button>
                        {erklaert === z.key && (
                          <span className="mt-1 block text-[12px] leading-snug text-muted-foreground">{z.hinweis}</span>
                        )}
                      </span>
                    ) : (
                      <span>{z.label}</span>
                    )}
                  </div>
                  {spalten.map((s) => (
                    <div key={`${z.key}-${s.id}`} className={`${zelle} border-r last:border-r-0 ${grund(s)}`}>
                      {z.key === "__angebot" ? angebot(s) : <ZellInhalt wert={s.werte[z.key]} art={z.art} teilsText={z.teilsText} />}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Angebotszeile unten, nur Laptop: läuft am unteren Rand mit und endet hier an ihrem Platz. */}
        <div
          className={`sticky bottom-0 z-30 border-t border-border bg-card transition-[opacity,visibility] duration-200 ${
            leisteZeigen ? "visible opacity-100" : "invisible opacity-0"
          }`}
        >
          <div ref={untenLeiste} className="overflow-hidden" style={maske}>
            <div className="grid" style={raster}>
              <div className="sticky left-0 z-10 flex items-center border-r border-border bg-card px-3 py-2 text-[14px] font-semibold text-foreground">
                Angebot
              </div>
              {spalten.map((s) => (
                <div key={`unten-${s.id}`} className="border-r border-border bg-card last:border-r-0">
                  <div className={`flex h-full items-center px-3 py-2 ${grund(s)}`}>{angebot(s)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AngebotsDialog
        spalte={spalten.find((s) => s.id === offen) ?? null}
        zeilen={zeilen}
        schliessen={() => setOffen(null)}
        markieren
      />
    </div>
  );
};

export default VergleichsTabelle;
