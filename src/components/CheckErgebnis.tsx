import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight, Check, ChevronLeft, ChevronRight, X } from "lucide-react";
import { AnbieterLogo } from "@/components/AnbieterLogo";
import CheckKonfetti from "@/components/CheckKonfetti";
import CheckStimme from "@/components/CheckStimme";
import {
  KEIN_PREIS,
  KEIN_WERT,
  UEBERZUG,
  WECHSEL_ZEIT,
  WERBEHINWEIS,
  antwortZeilen,
  einrichtungVon,
  kurzVorteile,
  vergleichGemeinsam,
  vergleichZeilen,
  type Antworten,
  type AuchGut,
  type Ergebnis,
  type Spalte,
  type VergleichZelle,
  type Zeile,
} from "@/data/halalFinanzCheck";
import { followerGesamt } from "@/data/beweise";
import { leuteBilder } from "@/data/checkStimmen";
import "@/styles/checkErgebnis.css";

/**
 * Endbildschirm des Checks in zwei Fassungen (RN11), umschaltbar über ?ergebnis=a|b, nur damit Elias vergleicht (keine Messung ohne sein Wort).
 *  A (Elias RN10-06 „untereinander“): wie die Ergebnisseite des Perspective-Originals (Blueprint rn10 Abschnitt 5): Kopf mit Überschrift,
 *    Satz und Ring mit der gerechneten Passung in Prozent (Depot passungProzent, Konto seit RN13 kontoPassung), Karte mit Logo, Titel,
 *    Preis, belegten Vorteilen und genau einem Knopf, darunter statt „Passt auch gut“ die Liste heute gegen Match (Elias RN9-01).
 *  B (Elias RN11-01, RN11-02): wie die Bildschirme des Ergänzungsvergleichs im OS, aber weiß: große Überschrift wie im Original, sofort
 *    Wischkarten ohne Weiter-Knopf (Match mit grünen Häkchen, Vergleich heute gegen Match mit beiden Logos, „Jetzt bei <Anbieter> eröffnen“),
 *    darunter Stimmen und ein zweiter Knopf ganz unten; beim Erscheinen Mini-Konfetti (CheckKonfetti).
 * RN13 (Elias RN12-01, -03): in B der Ring in der Match-Karte, alle Wischkarten gleich hoch, nur die letzte klein, immer mindestens drei.
 * Depot in beiden (Elias RN11-03): Ring mit der gerechneten Übereinstimmung, darunter „Passt auch gut“ mit dem anderen Depot und
 *    dessen eigener Übereinstimmung, eigener Knopf (Kennung Zusatz z). Konto ohne „Passt auch gut“.
 * In beiden: „Über 22.000 Menschen informieren sich bei Finanzmuslim“ mit Bildern anderer (Elias RN9-03), Stimmen am Ende, Werbehinweis als
 * Sternchen; in A genau ein Link zum Anbieter (Elias RN8-02), in B zwei (Elias RN11-01). Beispiel-Bilder und -Stimmen nur im Entwicklungsmodus (checkStimmen.ts).
 */
export type ErgebnisFassung = "a" | "b";
export const ergebnisFassungAus = (wert: string | null): ErgebnisFassung =>
  wert === "b" ? "b" : "a";

type Props = {
  e: Ergebnis;
  antworten: Antworten;
  onNeu: () => void;
  fassung: ErgebnisFassung;
  bereit: boolean;
};

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
      <p
        className={`hc-bank-wert${lang ? " hc-bank-wert--text" : ""}${leise ? " hc-bank-wert--leise" : ""}`}
      >
        {z.wert}
      </p>
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

/** Ring wie im Original (r 46, Strich 5, füllt sich 1,2 s ab 0,3 s) mit der gerechneten Passung (Depot passungProzent, Konto kontoPassung, Elias RN12-01). `klein`: nur der Ring, für die Match-Karte in B. */
const Ring = ({ e, klein }: { e: Ergebnis; klein?: boolean }) => {
  const prozent = e.passung;
  const ring = (
    <div
      className={`hc-erg-ring${klein ? " hc-erg-ring--klein" : ""}`}
      role="img"
      aria-label={`Passt zu ${prozent} Prozent zu dir`}
    >
      <svg viewBox="0 0 100 100" aria-hidden>
        <circle className="hc-erg-ring-spur" cx="50" cy="50" r="46" />
        <circle
          className="hc-erg-ring-fuell"
          cx="50"
          cy="50"
          r="46"
          style={{ ["--rest" as string]: (289 * (100 - prozent)) / 100 }}
        />
      </svg>
      <span className="hc-erg-ring-zahl" aria-hidden>
        {prozent}
        <small>%</small>
      </span>
    </div>
  );
  if (klein) return ring;
  return (
    <div className="hc-erg-ring-zeile">
      {ring}
      <p className="hc-erg-ring-text">Übereinstimmung mit deinen Antworten</p>
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
      <figcaption>
        Über {followerGesamt} Menschen informieren sich bei Finanzmuslim
      </figcaption>
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

/** „Passt auch gut“ wie im Original (Blueprint rn10 Abschnitt 5.3): Bild links, Übereinstimmung blau, Name, drei Haken, Preis, heller Knopf. Logo statt Foto. */
const PasstAuchGut = ({ g }: { g: AuchGut }) => (
  <section className="hc-auch" aria-label="Passt auch gut">
    <h2 className="hc-auch-h">Passt auch gut</h2>
    <article className="hc-auch-karte">
      <span className="hc-auch-bild">
        <AnbieterLogo name={g.anbieter.name} domain={g.anbieter.domain} gross />
      </span>
      <div className="hc-auch-text">
        <p className="hc-auch-fit">{g.passung}% Übereinstimmung</p>
        <h3>{g.anbieter.name}</h3>
        <ul className="hc-auch-liste">
          {g.vorteile.map((v) => (
            <li key={v}>
              <Check aria-hidden />
              {v}
            </li>
          ))}
        </ul>
        {g.pflicht && <p className="hc-erg-pflicht">{g.pflicht}</p>}
        <div className="hc-auch-fuss">
          <b>{g.preis}</b>
          <a href={g.link} className="hc-auch-btn">
            Depot ansehen*
            <ArrowRight className="hc-pfeil" aria-hidden />
          </a>
        </div>
      </div>
    </article>
  </section>
);

/** Wenn das Match schon das eigene Konto oder Depot ist: freundlicher Satz, kein Knopf. */
const SchonDa = ({ e, antworten, onNeu, bereit }: Omit<Props, "fassung">) => (
  <section
    className={`hc-erg${bereit ? " hc-erg--bereit" : ""}`}
    aria-live="polite"
  >
    <div className="hc-erg-kopf">
      <div className="hc-erg-kopf-text">
        <h1 className="hc-erg-h1" data-e="1">
          {e.ueberschrift}
        </h1>
        <p className="hc-erg-satz" data-e="2">
          {e.art === "konto" ? e.pflicht : e.satz}
        </p>
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
  <section
    className={`hc-erg${bereit ? " hc-erg--bereit" : ""}`}
    aria-live="polite"
    data-ergebnis="a"
  >
    <div className="hc-erg-kopf">
      <div className="hc-erg-kopf-text">
        <h1 className="hc-erg-h1" data-e="1">
          {e.ueberschrift}
        </h1>
        <p className="hc-erg-satz" data-e="2">
          {e.satz}
        </p>
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
          <AnbieterLogo
            name={e.anbieter.name}
            domain={e.anbieter.domain}
            gross
          />
        </span>
      </div>
      <div className="hc-erg-inhalt">
        <div className="hc-erg-titelzeile">
          <h2>{e.kartenTitel}</h2>
          <p className="hc-erg-preis">{e.preis}</p>
        </div>
        <Haken zeilen={e.vorteile} />
        {e.art === "konto" && e.praemie && (
          <p className="hc-praemie">{e.praemie}</p>
        )}
        <div className="hc-erg-knopfzeile">
          <Knopf e={e} />
        </div>
        {e.pflicht && <p className="hc-erg-pflicht">{e.pflicht}</p>}
      </div>
    </article>

    {e.art === "depot" && e.auchGut && (
      <div data-e="5">
        <PasstAuchGut g={e.auchGut} />
      </div>
    )}

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
// Fassung B (Elias RN11-01 und RN11-02): große Überschrift wie im Original, darunter sofort die Wischkarten (kein Weiter-Knopf):
// Match, Vergleich heute gegen Match (nur mit heutigem Konto oder Depot), Eröffnen. Darunter Leute und Stimmen, ganz unten noch einmal der Knopf.

type Karte = { id: string; ueber: string; match?: boolean; inhalt: ReactNode };

/** Logo auf weißer Platte wie .eg-dlogo im OS; auch im Dunkeln bleibt die Platte weiß. Orange ist nur die Markenfarbe der norisbank (schwarz-weißes Logo, Elias RN11-02). */
const Platte = ({ e, gross }: { e: Ergebnis; gross?: boolean }) => (
  <span
    className={`hc-wb-platte${gross ? " hc-wb-platte--gross" : ""}${e.anbieter.kurz === "no" ? " hc-wb-platte--noris" : ""}`}
  >
    <AnbieterLogo name={e.anbieter.name} domain={e.anbieter.domain} gross />
  </span>
);

/** Häkchen wie auf der Startseite und in der Vergleichstabelle der Verkaufsseite: grün, ohne Kreis. */
const Ja = () => <Check className="hc-wb-ja" aria-hidden />;

const HakenB = ({ zeilen }: { zeilen: string[] }) => (
  <ul className="hc-wb-haken">
    {zeilen.map((v) => (
      <li key={v}>
        <Ja />
        <span>{v}</span>
      </li>
    ))}
  </ul>
);

const GgZelle = ({ z }: { z: VergleichZelle }) => {
  const leise = z.text === KEIN_WERT || z.text === KEIN_PREIS;
  return (
    <td className="hc-gg-zelle">
      <span className="hc-gg-wert">
        {z.ja && <Ja />}
        {z.nein && <X className="hc-gg-nein" aria-hidden />}
        <b className={leise ? "hc-gg-leise" : undefined}>{z.text}</b>
        {z.text === KEIN_WERT && (
          <span className="hc-nur-sr">keine Angabe</span>
        )}
      </span>
      {z.klein && <small>{z.klein}</small>}
      {z.punkte && z.punkte.length > 0 && (
        <span className="hc-gg-punkte">
          {z.punkte.map((p) => (
            <span
              key={p.text}
              className={`hc-gg-punkt${p.gut === true ? " hc-gg-punkt--gut" : p.gut === false ? " hc-gg-punkt--schlecht" : ""}`}
            >
              {p.text}
              {p.gut !== null && <span className="hc-nur-sr">{p.gut ? " (besser oder gleich)" : " (schlechter)"}</span>}
            </span>
          ))}
        </span>
      )}
    </td>
  );
};

/** Beide Seiten nebeneinander: oben die Logos, je Zeile Beschriftung, links heute, rechts Match. Werte nur aus vergleichZeilen (belegt, sonst „–“). */
const Gegenueber = ({ e }: { e: Ergebnis }) => {
  const { links, rechts } = e;
  const zeilen = vergleichZeilen(e);
  const gemeinsam = vergleichGemeinsam(e);
  if (!links || !rechts || zeilen.length === 0) return null;
  return (
    <>
      <table className="hc-gg">
        <thead>
          <tr>
            {[links, rechts].map((s, n) => (
              <th key={s.name} scope="col" className="hc-gg-kopf">
                <span
                  className={`hc-wb-platte hc-wb-platte--tab${n === 1 && e.anbieter.kurz === "no" ? " hc-wb-platte--noris" : ""}`}
                >
                  <AnbieterLogo name={s.name} domain={s.domain} gross />
                </span>
                <span className="hc-gg-name">{s.name}</span>
              </th>
            ))}
          </tr>
        </thead>
        {zeilen.map((z) => (
          <tbody key={z.label}>
            <tr>
              <th scope="colgroup" colSpan={2} className="hc-gg-label">
                {z.label}
              </th>
            </tr>
            <tr>
              <GgZelle z={z.links} />
              <GgZelle z={z.rechts} />
            </tr>
          </tbody>
        ))}
      </table>
      {gemeinsam && (
        <p className="hc-gg-beide">
          <Ja />
          {gemeinsam}
        </p>
      )}
      {e.art === "konto" && (
        <p className={`hc-gg-wechsel${gemeinsam ? " hc-gg-wechsel--dicht" : ""}`}>
          <Ja />
          {WECHSEL_ZEIT}
        </p>
      )}
    </>
  );
};

/** Die Karten: Dein Match, Im Vergleich (nur mit heutigem Konto oder Depot, ersetzt „Deine Vorteile“ und Tabelle), Eröffnen. */
const karten = (e: Ergebnis): Karte[] => {
  const liste: Karte[] = [
    {
      id: "match",
      ueber: "Dein Match",
      match: true,
      inhalt: (
        <>
          <div className="hc-wk-matchkopf">
            <Platte e={e} gross />
            <Ring e={e} klein />
          </div>
          <h3>{e.anbieter.name}</h3>
          <p className="hc-wk-passt">Passt zu {e.passung} % zu dir</p>
          <p className="hc-wk-klein">{e.kartenTitel}</p>
          <HakenB zeilen={kurzVorteile(e)} />
        </>
      ),
    },
  ];
  if (e.links && e.rechts) {
    liste.push({
      id: "vergleich",
      ueber: "Im Vergleich",
      inhalt: (
        <>
          {e.vergleichTitel && <h3>{e.vergleichTitel}</h3>}
          <Gegenueber e={e} />
        </>
      ),
    });
  }
  if (e.art === "konto" && e.anbieter.kurz === "no" && e.links) {
    liste.push({
      id: "ueberzug",
      ueber: "Alles in Butter",
      inhalt: (
        <>
          <h3>{UEBERZUG.titel}</h3>
          <p className="hc-wk-satz">{UEBERZUG.satz}</p>
          <img
            className="hc-ueberzug-bild"
            src={UEBERZUG.bild}
            alt={UEBERZUG.alt}
            width={520}
            height={553}
            loading="lazy"
          />
          <p className="hc-gg-wechsel">
            <Ja />
            {WECHSEL_ZEIT}
          </p>
        </>
      ),
    });
  }
  // Immer mindestens drei Karten (Elias RN12-03 „immer 3 Slides Minimum, 2 Slides ist zu kurz“): ohne Bank oder Depot von heute die Einrichtung.
  const einrichtung = einrichtungVon(e);
  if (einrichtung) {
    liste.push({
      id: "einrichtung",
      ueber: "So geht's",
      inhalt: (
        <>
          <h3>{einrichtung.titel}</h3>
          <HakenB zeilen={einrichtung.zeilen} />
        </>
      ),
    });
  }
  liste.push({
    id: "eroeffnen",
    ueber: "Letzter Schritt",
    inhalt: (
      <div className="hc-wk-oeffnen">
        <Platte e={e} gross />
        <h3>Jetzt bei {e.anbieter.name} eröffnen</h3>
        {e.link && (
          <div className="hc-wb-cta">
            <Knopf e={e} />
            <span className="hc-wb-werbung">Werbung</span>
          </div>
        )}
        {e.pflicht && <p className="hc-erg-pflicht">{e.pflicht}</p>}
      </div>
    ),
  });
  return liste;
};

/** Wischkarten wie der Ergänzungsvergleich im OS: Spur mit Einrasten, Pfeile, Punkte; am Handy schaut die nächste Karte heraus. */
const Wischen = ({ e }: { e: Ergebnis }) => {
  const liste = karten(e);
  const fenster = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);

  useEffect(() => {
    const f = fenster.current;
    if (!f) return;
    const lauscher = () => {
      const k = f.firstElementChild as HTMLElement | null;
      const breite = k ? k.offsetWidth + 12 : f.clientWidth;
      setI(
        Math.max(
          0,
          Math.min(liste.length - 1, Math.round(f.scrollLeft / breite)),
        ),
      );
    };
    f.addEventListener("scroll", lauscher, { passive: true });
    return () => f.removeEventListener("scroll", lauscher);
  }, [liste.length]);

  const geh = (n: number) => {
    const f = fenster.current;
    const ziel = f?.children[n] as HTMLElement | undefined;
    if (!f || !ziel) return;
    const ruhig =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    f.scrollTo?.({
      left:
        ziel.offsetLeft - f.offsetLeft - (f.clientWidth - ziel.offsetWidth) / 2,
      behavior: ruhig ? "auto" : "smooth",
    });
    setI(n);
  };

  return (
    <section
      className="hc-wisch"
      aria-roledescription="Karussell"
      aria-label="Dein Match im Überblick"
    >
      <div className="hc-wisch-fenster" ref={fenster} tabIndex={0}>
        {liste.map((k, n) => (
          <article
            key={k.id}
            className={`hc-wk${k.match ? " hc-wk--match" : ""}`}
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
          <button
            type="button"
            className="hc-wisch-pfeil"
            onClick={() => geh(Math.max(0, i - 1))}
            disabled={i === 0}
            aria-label="Vorige Karte"
          >
            <ChevronLeft aria-hidden />
          </button>
          <div className="hc-wisch-punkte">
            {liste.map((k, n) => (
              <button
                key={k.id}
                type="button"
                className="hc-wisch-pt"
                aria-current={n === i}
                aria-label={`Karte ${n + 1}`}
                onClick={() => geh(n)}
              />
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

/** Zwei Links zum Anbieter gibt es nur in B (Elias RN11-01 ausdrücklich): einer in der letzten Karte, einer ganz unten. */
const FassungB = ({ e, onNeu, bereit }: Omit<Props, "fassung">) => (
  <section
    className={`hc-erg hc-erg--b${bereit ? " hc-erg--bereit" : ""}`}
    aria-live="polite"
    data-ergebnis="b"
  >
    {bereit && <CheckKonfetti />}
    <header className="hc-wb-kopf" data-e="1">
      <h1 className="hc-wb-h1">{e.ueberschrift}</h1>
    </header>
    <div data-e="2">
      <Wischen e={e} />
    </div>
    {e.art === "depot" && e.auchGut && (
      <div data-e="3">
        <PasstAuchGut g={e.auchGut} />
      </div>
    )}
    <div data-e="3">
      <Leute />
    </div>
    <Stimmen e={e} />
    {e.link && (
      <div className="hc-wb-unten">
        <Knopf e={e} text={`Bei ${e.anbieter.name} eröffnen`} />
      </div>
    )}
    <Fuss onNeu={onNeu} />
  </section>
);

const CheckErgebnis = (p: Props) => {
  if (p.e.schonDa) return <SchonDa {...p} />;
  return p.fassung === "b" ? <FassungB {...p} /> : <FassungA {...p} />;
};

export default CheckErgebnis;
