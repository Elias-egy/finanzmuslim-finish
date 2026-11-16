import { ArrowRight, Check, X } from "lucide-react";
import { AnbieterLogo } from "@/components/AnbieterLogo";
import CheckStimme from "@/components/CheckStimme";
import {
  KEIN_PREIS,
  KEIN_WERT,
  UEBERZUG,
  WECHSEL_ZEIT,
  WERBEHINWEIS,
  antwortZeilen,
  matchSatz,
  vergleichZeilen,
  type Antworten,
  type AuchGut,
  type Ergebnis,
  type VergleichZelle,
} from "@/data/halalFinanzCheck";
import { followerGesamt } from "@/data/beweise";
import { leuteBilder } from "@/data/checkStimmen";
import "@/styles/checkErgebnis.css";

/**
 * Endbildschirm des Checks. Seit RN15 gibt es nur noch Fassung A (Elias RN15-01: „Ich finde Version 1 besser“); die Wischkarten (B) und
 * der Schalter ?ergebnis=a|b sind weg. Aufbau wie die Ergebnisseite des Perspective-Originals (Blueprint rn10 Abschnitt 5):
 *  1. Kopf „Dein Match: …“, darunter ein, zwei Sätze, in denen sich der Leser aus seinen Antworten wiedererkennt (matchSatz), Ring mit der
 *     gerechneten Passung (Depot passungProzent, Konto kontoPassung).
 *  2. Karte mit Logo, Titel, Preis, belegten Vorteilen und dem Knopf zum Anbieter (Link 1).
 *  3. Beim Depot „Passt auch gut“ mit dem anderen Depot (eigener Knopf, Kennung Zusatz z).
 *  4. Vergleich heute gegen Match: die Empfehlung liegt vorn, gleiche Zeilen nur als Füller (vergleichZeilen).
 *  5. „Aus der Community“: „Über 22.000 Menschen informieren sich bei Finanzmuslim“ und zwei Stimmen der Art (Konto oder Depot).
 *  6. Beim Konto mit heutiger Bank die Karte „Alles wird für dich rübergezogen“ mit „Wechsel in 10 Minuten“ (Elias RN15-01: „die zwei letzten
 *     Slides von der zweiten Version in die erste Version unten anständig sichtbar machen“).
 *  7. Offener Block „Jetzt bei <Anbieter> eröffnen“ mit Logo und zweitem Knopf zum Anbieter (Link 2), nicht zurück zum Check.
 *  8. Werbehinweis als Sternchen, ganz am Ende klein „Check neu starten“.
 * Beispiel-Bilder und -Stimmen nur im Entwicklungsmodus (checkStimmen.ts).
 */
type Props = {
  e: Ergebnis;
  antworten: Antworten;
  onNeu: () => void;
  bereit: boolean;
};

/** Ring wie im Original (seit RN15 r 44, Strich 9: Elias RN14-02 „die Übereinstimmung ist ein bisschen dicker bei ihm“; füllt sich 1,2 s ab 0,3 s) mit der gerechneten Passung (Depot passungProzent, Konto kontoPassung, Elias RN12-01).
/** Umfang des Rings bei r 44: 2 · π · 44. */
const RING_UMFANG = 276.5;

const Ring = ({ e }: { e: Ergebnis }) => {
  const prozent = e.passung;
  const ring = (
    <div
      className="hc-erg-ring"
      role="img"
      aria-label={`Passt zu ${prozent} Prozent zu dir`}
    >
      <svg viewBox="0 0 100 100" aria-hidden>
        <circle className="hc-erg-ring-spur" cx="50" cy="50" r="44" />
        <circle
          className="hc-erg-ring-fuell"
          cx="50"
          cy="50"
          r="44"
          style={{ ["--rest" as string]: (RING_UMFANG * (100 - prozent)) / 100 }}
        />
      </svg>
      <span className="hc-erg-ring-zahl" aria-hidden>
        {prozent}
        <small>%</small>
      </span>
    </div>
  );
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

const Fuss = ({ onNeu }: { onNeu: () => void }) => (
  <>
    <p className="hc-werbung">{WERBEHINWEIS}</p>
    <button type="button" onClick={onNeu} className="hc-neu hc-neu--klein">
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
const SchonDa = ({ e, antworten, onNeu, bereit }: Props) => (
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
    </td>
  );
};

/** Beide Seiten nebeneinander: oben die Logos, je Zeile Beschriftung, links heute, rechts Match. Werte nur aus vergleichZeilen (belegt, sonst „–“). */
const Gegenueber = ({ e }: { e: Ergebnis }) => {
  const { links, rechts } = e;
  const zeilen = vergleichZeilen(e);
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
    </>
  );
};

// ---------------------------------------------------------------------------
// Der Endbildschirm

/** Der offene Block ganz unten (Elias RN15-01: „unten dann nochmal ein Call to Action. Nicht Check, natürlich direkt“): Logo, Überschrift, Knopf, Werbung. */
const Eroeffnen = ({ e }: { e: Ergebnis }) =>
  e.link ? (
    <section className="hc-erg-eroeffnen" aria-label={`Jetzt bei ${e.anbieter.name} eröffnen`} data-e="6">
      <Platte e={e} gross />
      <h2 className="hc-erg-h3">Jetzt bei {e.anbieter.name} eröffnen</h2>
      <div className="hc-wb-cta">
        <Knopf e={e} text={`Bei ${e.anbieter.name} eröffnen`} />
        <span className="hc-wb-werbung">Werbung</span>
      </div>
      {e.pflicht && <p className="hc-erg-pflicht">{e.pflicht}</p>}
    </section>
  ) : null;

/** „Alles wird für dich rübergezogen“ mit „Wechsel in 10 Minuten“, nur norisbank mit heutiger Bank (Beleg bei UEBERZUG). */
const Ueberzug = ({ e }: { e: Ergebnis }) =>
  e.art === "konto" && e.anbieter.kurz === "no" && e.links ? (
    <section className="hc-erg-ueberzug" aria-label={UEBERZUG.titel} data-e="6">
      <h2 className="hc-erg-h3">{UEBERZUG.titel}</h2>
      <p className="hc-erg-ueberzug-satz">{UEBERZUG.satz}</p>
      <img className="hc-ueberzug-bild" src={UEBERZUG.bild} alt={UEBERZUG.alt} width={520} height={553} loading="lazy" />
      <p className="hc-gg-wechsel">
        <Ja />
        {WECHSEL_ZEIT}
      </p>
    </section>
  ) : null;

/**
 * RN15 (Elias RN14-02, RN15-01; Vorbild hermes/renovierungskampagne/perspective/rn9-ergebnis/01 und 02): Kopf kleiner und tiefer wie das
 * Original, darunter die ein, zwei Sätze aus den Antworten, Ring dicker, norisbank-Platte orange; der Vergleich heute gegen Match ist die
 * Haken-Tabelle (Gegenueber) nach der Match-Karte; danach „Aus der Community“ mit 22.000 und zwei Stimmen, dann Überzug und der offene
 * Block „Jetzt bei … eröffnen“ mit zweitem Knopf.
 */
const FassungA = ({ e, antworten, onNeu, bereit }: Props) => {
  const satz = matchSatz(e, antworten);
  return (
    <section className={`hc-erg hc-erg--a${bereit ? " hc-erg--bereit" : ""}`} aria-live="polite" data-ergebnis="a">
      <div className="hc-erg-kopf">
        <div className="hc-erg-kopf-text">
          <h1 className="hc-erg-h1" data-e="1">
            {e.ueberschrift}
          </h1>
          {satz && (
            <p className="hc-erg-match-satz" data-e="2">
              {satz}
            </p>
          )}
        </div>
        <div data-e="3">
          <Ring e={e} />
        </div>
      </div>

      <article className="hc-erg-karte" data-e="4">
        <div className="hc-erg-bild">
          <span className={`hc-erg-logo${e.anbieter.kurz === "no" ? " hc-wb-platte--noris" : ""}`}>
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

      {e.art === "depot" && e.auchGut && (
        <div data-e="5">
          <PasstAuchGut g={e.auchGut} />
        </div>
      )}

      {e.links && e.rechts && vergleichZeilen(e).length > 0 && (
        <section className="hc-erg-vergleich hc-erg-vergleich--a" data-e="5">
          {e.vergleichTitel && <h2 className="hc-erg-h3">{e.vergleichTitel}</h2>}
          <Gegenueber e={e} />
        </section>
      )}

      <section className="hc-erg-community" aria-label="Aus der Community" data-e="6">
        <p className="hc-erg-kicker">Aus der Community</p>
        <Leute />
        <div className="hc-erg-stimmen-gitter">
          {[0, 1].map((i) => (
            <CheckStimme key={i} stelle={i} art={e.art} />
          ))}
        </div>
      </section>

      <Ueberzug e={e} />
      <Eroeffnen e={e} />
      <Fuss onNeu={onNeu} />
    </section>
  );
};

const CheckErgebnis = (p: Props) => (p.e.schonDa ? <SchonDa {...p} /> : <FassungA {...p} />);

export default CheckErgebnis;
