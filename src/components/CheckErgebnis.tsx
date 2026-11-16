import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowDown, ArrowRight, Check, ChevronLeft, ChevronRight, X } from "lucide-react";
import { AnbieterLogo } from "@/components/AnbieterLogo";
import CheckStimme from "@/components/CheckStimme";
import {
  KEIN_PREIS,
  WERBEHINWEIS,
  antwortZeilen,
  problemVon,
  type Antworten,
  type Ergebnis,
  type Spalte,
  type Zeile,
} from "@/data/halalFinanzCheck";
import { followerGesamt } from "@/data/beweise";
import { leuteBilder } from "@/data/checkStimmen";
import "@/styles/checkErgebnis.css";

/**
 * Endbildschirm des Checks in zwei Fassungen (RN11), umschaltbar über ?ergebnis=a|b, nur damit Elias vergleicht (keine Messung ohne sein Wort).
 *  A (Elias RN10-06 „untereinander“): wie die Ergebnisseite des Perspective-Originals (Blueprint rn10 Abschnitt 5): Kopf mit Überschrift,
 *    Satz und Ring (Depot: Passung in Prozent; Konto: Logo im Ring, weil es für Konten keine gerechnete Zahl gibt), Karte mit Logo, Titel,
 *    Preis, belegten Vorteilen und genau einem Knopf, darunter statt „Passt auch gut“ die Liste heute gegen Match (Elias RN9-01).
 *  B (Elias RN10-03, -05, -06): erst ein Bildschirm „Dein Match“, dann Wischkarten wie der Ergänzungsvergleich im OS (views/ergaenzung.js):
 *    der Vergleich, das Problem des alten Kontos oder Depots (nur belegte Werte), das neue Konto, die Liste gegeneinander, zuletzt
 *    „Jetzt bei <Anbieter> eröffnen“ mit dem einen Knopf; darunter Stimmen.
 * In beiden: „Über 22.000 Menschen informieren sich bei Finanzmuslim“ mit Bildern anderer (Elias RN9-03), Stimmen am Ende, Werbehinweis als
 * Sternchen, genau ein Link zum Anbieter (Elias RN8-02). Beispiel-Bilder und -Stimmen nur im Entwicklungsmodus (checkStimmen.ts).
 */
export type ErgebnisFassung = "a" | "b";
export const ergebnisFassungAus = (wert: string | null): ErgebnisFassung => (wert === "b" ? "b" : "a");

type Props = { e: Ergebnis; antworten: Antworten; onNeu: () => void; fassung: ErgebnisFassung; bereit: boolean };

const Kopf = ({ s, ziel }: { s: Spalte; ziel?: boolean }) => (
  <div className={`hc-bank hc-bank--kopf${ziel ? " hc-bank--ziel" : ""}`}>
    <AnbieterLogo name={s.name} domain={s.domain} gross />
    <p className="hc-bank-name">
      {s.name}
      {s.produkt && <small>{s.produkt}</small>}
    </p>
  </div>
);

const Zelle = ({ z, ziel }: { z: Zeile; ziel?: boolean }) => {
  const lang = z.wert.length > 14;
  const leise = z.wert === KEIN_PREIS;
  return (
    <div className={`hc-bank${ziel ? " hc-bank--ziel" : ""}`}>
      <p className={`hc-bank-wert${lang ? " hc-bank-wert--text" : ""}${leise ? " hc-bank-wert--leise" : ""}`}>{z.wert}</p>
      {z.zusatz?.map((t) => (
        <p key={t} className="hc-bank-zusatz">
          {t}
        </p>
      ))}
    </div>
  );
};

/** Beide nebeneinander: Kopf mit Logo, dann je Zeile die Beschriftung über zwei Zellen. */
const Vergleich = ({ links, rechts }: { links?: Spalte; rechts: Spalte }) => (
  <div className={`hc-vs${links ? "" : " hc-vs--eins"}`}>
    {links && <Kopf s={links} />}
    <Kopf s={rechts} ziel />
    {rechts.zeilen.map((z, i) => (
      <Fragment key={z.label}>
        <p className="hc-vs-label">{z.label}</p>
        {links && links.zeilen[i] && <Zelle z={links.zeilen[i]} />}
        <Zelle z={z} ziel />
      </Fragment>
    ))}
  </div>
);

/** Ring wie im Original (r 46, Strich 5, füllt sich 1,2 s ab 0,3 s). Depot: die gerechnete Passung; Konto: das Logo, ganz geschlossen. */
const Ring = ({ e }: { e: Ergebnis }) => {
  const prozent = e.art === "depot" ? e.passung : 100;
  return (
    <div className="hc-erg-ring-zeile">
      <div
        className={`hc-erg-ring${e.art === "konto" ? " hc-erg-ring--logo" : ""}`}
        role="img"
        aria-label={e.art === "depot" ? `Passt zu ${prozent} Prozent zu dir` : `Dein Match: ${e.anbieter.name}`}
      >
        <svg viewBox="0 0 100 100" aria-hidden>
          <circle className="hc-erg-ring-spur" cx="50" cy="50" r="46" />
          <circle className="hc-erg-ring-fuell" cx="50" cy="50" r="46" style={{ ["--rest" as string]: (289 * (100 - prozent)) / 100 }} />
        </svg>
        {e.art === "depot" ? (
          <span className="hc-erg-ring-zahl" aria-hidden>
            {prozent}
            <small>%</small>
          </span>
        ) : (
          <span className="hc-erg-ring-logo" aria-hidden>
            <AnbieterLogo name={e.anbieter.name} domain={e.anbieter.domain} gross />
          </span>
        )}
      </div>
      <p className="hc-erg-ring-text">{e.art === "depot" ? "Übereinstimmung mit deinen Antworten" : "Dein Match aus deinen Antworten"}</p>
    </div>
  );
};

const Antworten = ({ a }: { a: Antworten }) => (
  <ul className="hc-erg-antw" aria-label="Deine Antworten">
    {antwortZeilen(a).map((z) => (
      <li key={z}>{z}</li>
    ))}
  </ul>
);

const Haken = ({ zeilen }: { zeilen: string[] }) => (
  <ul className="hc-erg-haken">
    {zeilen.map((v) => (
      <li key={v}>
        <span className="hc-erg-badge" aria-hidden>
          <Check />
        </span>
        {v}
      </li>
    ))}
  </ul>
);

/** Der eine Knopf zum Anbieter über /out (Partnerlink nur dort), Werbehinweis als Sternchen. */
const Knopf = ({ e, text }: { e: Ergebnis; text?: string }) =>
  e.link ? (
    <a href={e.link} className="hc-btn hc-erg-btn">
      {text ?? e.knopf}*
      <ArrowRight className="hc-pfeil" aria-hidden />
    </a>
  ) : null;

const Leute = () => {
  const bilder = leuteBilder(import.meta.env.DEV);
  return (
    <figure className="hc-leute">
      {bilder.length > 0 && (
        <span className="hc-leute-bilder" aria-hidden>
          {bilder.map((b) => (
            <img key={b} src={b} alt="" width={36} height={36} loading="lazy" />
          ))}
        </span>
      )}
      <figcaption>Über {followerGesamt} Menschen informieren sich bei Finanzmuslim</figcaption>
    </figure>
  );
};

const Stimmen = ({ e }: { e: Ergebnis }) => (
  <section className="hc-erg-stimmen" aria-label="Stimmen">
    <p className="hc-erg-kicker">Aus der Community</p>
    <div className="hc-erg-stimmen-gitter">
      {[0, 1, 2].map((i) => (
        <CheckStimme key={i} stelle={i} art={e.art} />
      ))}
    </div>
  </section>
);

const Fuss = ({ onNeu }: { onNeu: () => void }) => (
  <>
    <p className="hc-werbung">{WERBEHINWEIS}</p>
    <button type="button" onClick={onNeu} className="hc-neu">
      Check neu starten
    </button>
  </>
);

/** Wenn das Match schon das eigene Konto oder Depot ist: freundlicher Satz, kein Knopf. */
const SchonDa = ({ e, antworten, onNeu, bereit }: Omit<Props, "fassung">) => (
  <section className={`hc-erg${bereit ? " hc-erg--bereit" : ""}`} aria-live="polite">
    <div className="hc-erg-kopf">
      <div className="hc-erg-kopf-text">
        <h1 className="hc-erg-h1" data-e="1">{e.ueberschrift}</h1>
        <p className="hc-erg-satz" data-e="2">{e.art === "konto" ? e.pflicht : e.satz}</p>
        <Antworten a={antworten} />
      </div>
      <div data-e="3">
        <Ring e={e} />
      </div>
    </div>
    <Leute />
    <Fuss onNeu={onNeu} />
  </section>
);

// ---------------------------------------------------------------------------
// Fassung A: untereinander wie das Original

const FassungA = ({ e, antworten, onNeu, bereit }: Omit<Props, "fassung">) => (
  <section className={`hc-erg${bereit ? " hc-erg--bereit" : ""}`} aria-live="polite" data-ergebnis="a">
    <div className="hc-erg-kopf">
      <div className="hc-erg-kopf-text">
        <h1 className="hc-erg-h1" data-e="1">{e.ueberschrift}</h1>
        <p className="hc-erg-satz" data-e="2">{e.satz}</p>
        <div data-e="2">
          <Antworten a={antworten} />
        </div>
      </div>
      <div data-e="3">
        <Ring e={e} />
      </div>
    </div>

    <article className="hc-erg-karte" data-e="4">
      <div className="hc-erg-bild">
        <span className="hc-erg-logo">
          <AnbieterLogo name={e.anbieter.name} domain={e.anbieter.domain} gross />
        </span>
      </div>
      <div className="hc-erg-inhalt">
        <div className="hc-erg-titelzeile">
          <h2>{e.kartenTitel}</h2>
          <p className="hc-erg-preis">{e.preis}</p>
        </div>
        <Haken zeilen={e.vorteile} />
        {e.art === "konto" && e.praemie && <p className="hc-praemie">{e.praemie}</p>}
        <div className="hc-erg-knopfzeile">
          <Knopf e={e} />
        </div>
        {e.pflicht && <p className="hc-erg-pflicht">{e.pflicht}</p>}
      </div>
    </article>

    {e.links && e.rechts && (
      <section className="hc-erg-vergleich" data-e="5">
        {e.vergleichTitel && <h2 className="hc-erg-h3">{e.vergleichTitel}</h2>}
        <Vergleich links={e.links} rechts={e.rechts} />
      </section>
    )}

    <div data-e="6">
      <Leute />
    </div>
    <Stimmen e={e} />
    <Fuss onNeu={onNeu} />
  </section>
);

// ---------------------------------------------------------------------------
// Fassung B: erst „Dein Match“, dann Wischkarten wie im OS, darunter Stimmen

type Karte = { id: string; ueber: string; inhalt: ReactNode; ton?: "problem" };

const Kachel = ({ name, wert, ziel }: { name: string; wert: string; ziel?: boolean }) => (
  <div className={`hc-wk-kachel${ziel ? " hc-wk-kachel--ziel" : ""}`}>
    <span>{name}</span>
    <b className={wert.length > 9 ? "hc-wk-kachel-lang" : undefined}>{wert}</b>
  </div>
);

const karten = (e: Ergebnis, a: Antworten): Karte[] => {
  const liste: Karte[] = [];
  const problem = problemVon(e, a);
  if (e.links && e.rechts) {
    const l = e.links.zeilen[0];
    const r = e.rechts.zeilen[0];
    liste.push({
      id: "vergleich",
      ueber: "Hier der Vergleich",
      inhalt: (
        <>
          <div className="hc-wk-logos">
            <AnbieterLogo name={e.links.name} domain={e.links.domain} gross />
            <ArrowRight className="hc-wk-logos-pfeil" aria-hidden />
            <AnbieterLogo name={e.rechts.name} domain={e.rechts.domain} gross />
          </div>
          <h3>{e.vergleichTitel ?? `${e.links.name} und ${e.anbieter.name}`}</h3>
          {l && r && (
            <>
              <p className="hc-wk-klein">{r.label}</p>
              <div className="hc-wk-kacheln">
                <Kachel name={e.links.name} wert={l.wert === KEIN_PREIS ? "im Kontoauszug" : l.wert} />
                <Kachel name={e.rechts.name} wert={r.wert} ziel />
              </div>
            </>
          )}
        </>
      ),
    });
  }
  if (problem) {
    liste.push({
      id: "problem",
      ueber: "Dein altes Konto",
      ton: "problem",
      inhalt: (
        <>
          <h3>{problem.titel}</h3>
          {problem.zeilen.length > 0 && (
            <ul className="hc-wk-punkte hc-wk-punkte--problem">
              {problem.zeilen.map((z) => (
                <li key={z}>
                  <X aria-hidden />
                  {z}
                </li>
              ))}
            </ul>
          )}
          {problem.satz && <p className="hc-wk-satz">{problem.satz}</p>}
        </>
      ),
    });
  }
  liste.push({
    id: "neu",
    ueber: "Dein neues Konto",
    inhalt: (
      <>
        <div className="hc-wk-kopf">
          <AnbieterLogo name={e.anbieter.name} domain={e.anbieter.domain} gross />
          <p>
            <b>{e.anbieter.name}</b>
            <span>{e.kartenTitel}</span>
          </p>
        </div>
        <p className="hc-wk-preis">{e.preis}</p>
        <Haken zeilen={e.vorteile} />
      </>
    ),
  });
  if (e.links && e.rechts) {
    liste.push({
      id: "liste",
      ueber: "Gegeneinander",
      inhalt: (
        <>
          <h3>{e.vergleichTitel}</h3>
          <Vergleich links={e.links} rechts={e.rechts} />
        </>
      ),
    });
  }
  liste.push({
    id: "eroeffnen",
    ueber: "Letzter Schritt",
    inhalt: (
      <div className="hc-wk-oeffnen">
        <span className="hc-erg-logo">
          <AnbieterLogo name={e.anbieter.name} domain={e.anbieter.domain} gross />
        </span>
        <h3>Jetzt bei {e.anbieter.name} eröffnen</h3>
        <p className="hc-wk-preis">{e.preis}</p>
        {e.art === "konto" && e.praemie && <p className="hc-praemie">{e.praemie}</p>}
        <Knopf e={e} />
        {e.pflicht && <p className="hc-erg-pflicht">{e.pflicht}</p>}
      </div>
    ),
  });
  // Ohne altes Konto „Dein Match“ statt „Dein neues Konto“; beim Depot die Wörter des Depots.
  return liste.map((k) => ({
    ...k,
    ueber: e.art === "depot" ? k.ueber.replace("Konto", "Depot") : k.ueber,
  }));
};

/** Wischkarten wie der Ergänzungsvergleich im OS: Spur mit Einrasten, Pfeile, Punkte; am Handy schaut die nächste Karte heraus. */
const Wischen = ({ e, a }: { e: Ergebnis; a: Antworten }) => {
  const liste = karten(e, a);
  const fenster = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);

  useEffect(() => {
    const f = fenster.current;
    if (!f) return;
    const lauscher = () => {
      const k = f.firstElementChild as HTMLElement | null;
      const breite = k ? k.offsetWidth + 12 : f.clientWidth;
      setI(Math.max(0, Math.min(liste.length - 1, Math.round(f.scrollLeft / breite))));
    };
    f.addEventListener("scroll", lauscher, { passive: true });
    return () => f.removeEventListener("scroll", lauscher);
  }, [liste.length]);

  const geh = (n: number) => {
    const f = fenster.current;
    const ziel = f?.children[n] as HTMLElement | undefined;
    if (!f || !ziel) return;
    const ruhig = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    f.scrollTo?.({ left: ziel.offsetLeft - f.offsetLeft - (f.clientWidth - ziel.offsetWidth) / 2, behavior: ruhig ? "auto" : "smooth" });
    setI(n);
  };

  return (
    <section className="hc-wisch" aria-roledescription="Karussell" aria-label="Deine kleine Analyse">
      <div className="hc-wisch-kopf">
        <span className="hc-erg-kicker">Zum Wischen</span>
        <h2>Deine kleine Analyse</h2>
      </div>
      <div className="hc-wisch-fenster" ref={fenster} tabIndex={0}>
        {liste.map((k, n) => (
          <article
            key={k.id}
            className={`hc-wk${k.ton === "problem" ? " hc-wk--problem" : ""}`}
            aria-roledescription="Karte"
            aria-label={`${n + 1} von ${liste.length}`}
          >
            <span className="hc-wk-ueber">{k.ueber}</span>
            {k.inhalt}
          </article>
        ))}
      </div>
      {liste.length > 1 && (
        <div className="hc-wisch-steuer">
          <button type="button" className="hc-wisch-pfeil" onClick={() => geh(Math.max(0, i - 1))} disabled={i === 0} aria-label="Vorige Karte">
            <ChevronLeft aria-hidden />
          </button>
          <div className="hc-wisch-punkte">
            {liste.map((k, n) => (
              <button key={k.id} type="button" className="hc-wisch-pt" aria-current={n === i} aria-label={`Karte ${n + 1}`} onClick={() => geh(n)} />
            ))}
          </div>
          <button
            type="button"
            className="hc-wisch-pfeil"
            onClick={() => geh(Math.min(liste.length - 1, i + 1))}
            disabled={i === liste.length - 1}
            aria-label="Nächste Karte"
          >
            <ChevronRight aria-hidden />
          </button>
        </div>
      )}
    </section>
  );
};

const FassungB = ({ e, antworten, onNeu, bereit }: Omit<Props, "fassung">) => (
  <section className={`hc-erg hc-erg--b${bereit ? " hc-erg--bereit" : ""}`} aria-live="polite" data-ergebnis="b">
    <div className="hc-wb-start">
      <span className="hc-erg-kicker" data-e="1">Deine Empfehlung</span>
      <div data-e="2">
        <Ring e={e} />
      </div>
      <h1 className="hc-erg-h1" data-e="3">{e.ueberschrift}</h1>
      <p className="hc-erg-satz" data-e="4">{e.satz}</p>
      <div data-e="4">
        <Antworten a={antworten} />
      </div>
      <p className="hc-wb-weiter" data-e="5" aria-hidden>
        Wisch dich durch deine Analyse
        <ArrowDown />
      </p>
    </div>
    <Wischen e={e} a={antworten} />
    <Leute />
    <Stimmen e={e} />
    <Fuss onNeu={onNeu} />
  </section>
);

const CheckErgebnis = (p: Props) => {
  if (p.e.schonDa) return <SchonDa {...p} />;
  return p.fassung === "b" ? <FassungB {...p} /> : <FassungA {...p} />;
};

export default CheckErgebnis;
