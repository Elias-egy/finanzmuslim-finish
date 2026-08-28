import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnbieterLogo } from "@/components/AnbieterLogo";
import {
  AngebotsKnopf,
  HinweisPunkt,
  NotenBlock,
  ZellInhalt,
} from "./VergleichsBausteine";
import type { VergleichsSpalte, VergleichsZeile } from "./vergleichTypen";

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

const etikettTon: Record<string, string> = {
  empfehlung: "bg-primary/10 text-primary",
  bonus: "bg-success/10 text-success",
  hinweis: "bg-accent/10 text-accent",
};

export const VergleichsTabelle = ({
  zeilen,
  spalten,
}: {
  zeilen: VergleichsZeile[];
  spalten: VergleichsSpalte[];
}) => {
  const schieber = useRef<HTMLDivElement>(null);
  const [von, setVon] = useState(1);
  const [bis, setBis] = useState(1);

  const merkeStelle = useCallback(() => {
    const el = schieber.current;
    if (!el) return;
    const sichtbar = Math.max(1, Math.floor((el.clientWidth - KRITERIEN) / SPALTE));
    const erste = Math.floor(el.scrollLeft / SPALTE) + 1;
    setVon(Math.min(erste, spalten.length));
    setBis(Math.min(erste + sichtbar - 1, spalten.length));
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

  const schiebe = (richtung: 1 | -1) =>
    schieber.current?.scrollBy({ left: richtung * SPALTE * 2, behavior: "smooth" });

  /* Die Angebotszeile steht bewusst zweimal in der Liste. */
  const alleZeilen: VergleichsZeile[] = [
    ...zeilen,
    {
      key: "__angebot_unten",
      label: "Angebot",
      art: "text",
      gruppe: "kosten",
    },
  ];

  const zelle = "flex min-h-[60px] items-center justify-center border-b border-border px-3 py-2 text-center text-[13px]";
  const kriterium =
    "sticky left-0 z-20 flex min-h-[60px] items-center border-b border-r border-border bg-card px-3 py-2 text-[13px] text-foreground";

  let letzteGruppe = "";

  return (
    <div className="relative">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[14px] text-muted-foreground">
          {von} bis {bis} von {spalten.length} Anbietern
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => schiebe(-1)}
            aria-label="Anbieter nach links"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-surface"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => schiebe(1)}
            aria-label="Anbieter nach rechts"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-surface"
          >
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </div>

      <div
        ref={schieber}
        onScroll={merkeStelle}
        className="overflow-x-auto rounded-lg border border-border bg-card"
        /* Ohne diesen Fade wirkt die zuletzt angeschnittene Spalte wie ein
           Darstellungsfehler statt wie ein Hinweis zum Weiterschieben. Nur
           aktiv, solange rechts noch etwas folgt; am Ende der Liste steht
           die letzte Spalte wieder scharf. */
        style={
          bis < spalten.length
            ? {
                WebkitMaskImage:
                  "linear-gradient(to right, black calc(100% - 96px), transparent 100%)",
                maskImage:
                  "linear-gradient(to right, black calc(100% - 96px), transparent 100%)",
              }
            : undefined
        }
      >
        <div
          className="grid"
          style={{
            gridTemplateColumns: `${KRITERIEN}px repeat(${spalten.length}, ${SPALTE}px)`,
            width: KRITERIEN + spalten.length * SPALTE,
          }}
        >
          {/* Kopfzeile: klebt oben, damit beim Scrollen immer sichtbar bleibt,
              wessen Zahl gerade gelesen wird.

              Zwei verschachtelte Ebenen statt einer: ein `sticky top`-Wert
              direkt auf einem Grid-Kind verschiebt in Chrome die Startposition
              der naechsten Zeile um genau diesen Top-Wert nach oben, auch
              wenn die Kopfzeile noch gar nicht klebt. Ergebnis war, dass die
              Angebotszeile sichtbar unter der Kopfzeile verschwand. Das
              aeussere Div bleibt darum ein normales (bzw. nur horizontal
              klebendes) Grid-Kind und traegt nichts als Platzhalter bei, das
              vertikale Kleben passiert ausschliesslich am inneren Div, das
              fuer die Grid-Zeilenberechnung unsichtbar ist. */}
          <div className="sticky left-0 z-30 border-b border-r border-border">
            <div className="flex flex-col justify-end bg-card px-3 py-2" style={{ position: "sticky", top: KOPF }}>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Kriterium
              </p>
              <p className="text-[12px] text-muted-foreground">
                {von} bis {bis} von {spalten.length}
              </p>
            </div>
          </div>
          {spalten.map((s, i) => (
            <div key={s.id} className="z-20 border-b border-r border-border last:border-r-0">
              <div className="bg-card" style={{ position: "sticky", top: KOPF }}>
                <div className="flex items-center gap-2 border-b border-border px-2 py-1.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-surface text-[11px] font-bold text-muted-foreground">
                    {i + 1}
                  </span>
                  {s.etikett ? (
                    <span
                      className={`truncate rounded-full px-2 py-0.5 text-[11px] font-semibold ${etikettTon[s.etikett.ton]}`}
                    >
                      {s.etikett.text}
                    </span>
                  ) : (
                    /* Ohne Etikett bleibt der Platz leer. Ein Wort wie "kein
                       Etikett" dreissig Mal untereinander ist kein Hinweis,
                       sondern Laerm. Die Hoehe bleibt reserviert. */
                    <span className="h-[19px]" aria-hidden />
                  )}
                </div>
                <div className="flex flex-col items-center gap-1 px-3 py-2">
                  <AnbieterLogo name={s.anbieter} domain={s.domain} gross />
                  <p className="w-full truncate text-center text-[13px] font-bold text-foreground">
                    {s.anbieter}
                  </p>
                  <p className="w-full truncate text-center text-[12px] text-muted-foreground">
                    {s.produkt}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Datenzeilen */}
          {alleZeilen.map((z) => {
            const neueGruppe = z.gruppe !== letzteGruppe && z.key !== "__angebot_unten";
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
                <div className={kriterium}>
                  <span>
                    {z.label}
                    <HinweisPunkt text={z.hinweis} />
                  </span>
                </div>
                {spalten.map((s) => (
                  <div key={`${z.key}-${s.id}`} className={`${zelle} border-r last:border-r-0`}>
                    {z.key === "__angebot" || z.key === "__angebot_unten" ? (
                      <AngebotsKnopf link={s.link} />
                    ) : z.key === "__note" ? (
                      <NotenBlock note={s.note} stand={s.noteStand} mittig />
                    ) : (
                      <ZellInhalt wert={s.werte[z.key]} art={z.art} />
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VergleichsTabelle;
