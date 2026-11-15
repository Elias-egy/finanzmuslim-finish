import { Fragment } from "react";
import { ArrowRight, Check } from "lucide-react";
import { AnbieterLogo } from "@/components/AnbieterLogo";
import {
  KEIN_PREIS,
  WERBEHINWEIS,
  antwortZeilen,
  type Antworten,
  type DepotErgebnis,
  type KontoErgebnis,
  type Spalte,
  type Zeile,
} from "@/data/halalFinanzCheck";
import { followerGesamt } from "@/data/beweise";

/**
 * Die zwei Ergebnisse des Checks (RN8). In beiden genau ein Knopf: Elias RN8-02 „in dem Ergebnis nur ein … keinen zweiten …
 * nicht eine Konkurrenzpriorität … Die Leute sollen nur auf den Abschluss konzentriert sein.“ Also im Bankkonto-Ergebnis kein
 * Depot, keine Alternative, kein Freitagsbrief; im Depot-Ergebnis kein grüner Girokonto-Kasten und kein „Lieber die
 * Alternative?“. Bankkonto: deine Bank links, die Empfehlung rechts. Depot: groß „Passt zu N % zu dir“ als Ring (RN8-03).
 */
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

/** Beide Banken nebeneinander: Kopf mit Logo, dann je Zeile die Beschriftung über zwei Zellen. */
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

export const KontoAnsicht = ({ e, onNeu }: { e: KontoErgebnis; onNeu: () => void }) => (
  <section className="hc-frage" aria-live="polite">
    <p className="hc-antw-kopf">Dein Bankkonto</p>
    <h1 className="hc-ergebnis-h1">{e.ueberschrift}</h1>

    {e.schonDa ? (
      <p className="hc-schonda">{e.pflicht}</p>
    ) : (
      <>
        <Vergleich links={e.links} rechts={e.rechts} />
        {e.praemie && <p className="hc-praemie">{e.praemie}</p>}
        <p className="hc-pflicht">{e.pflicht}</p>
        <div className="hc-konto-ende">
          {/* Genau ein Knopf, direkt zum Anbieter über /out (Partnerlinks nur dort), Werbehinweis als Sternchen. */}
          <a href={e.link} className="hc-btn">
            {e.knopf}*
            <ArrowRight className="hc-pfeil" aria-hidden />
          </a>
        </div>
        <p className="hc-werbung">{WERBEHINWEIS}</p>
      </>
    )}
    <button type="button" onClick={onNeu} className="hc-neu">
      Check neu starten
    </button>
  </section>
);

export const Passung = ({ prozent }: { prozent: number }) => (
  <div className="hc-passung">
    <div className="hc-ring" role="img" aria-label={`Passt zu ${prozent} Prozent zu dir`}>
      <svg viewBox="0 0 40 40" aria-hidden>
        <circle className="hc-ring-spur" cx="20" cy="20" r="16" pathLength={100} />
        <circle className="hc-ring-fuell" cx="20" cy="20" r="16" pathLength={100} style={{ strokeDashoffset: 100 - prozent }} />
      </svg>
      <span className="hc-ring-zahl" aria-hidden>
        <span>
          {prozent}
          <small>&nbsp;%</small>
        </span>
      </span>
    </div>
    <p className="hc-passung-text">
      <b>Passt zu {prozent}&nbsp;% zu dir</b>
      <span>Gerechnet aus deinen Antworten und den Daten in meinem Vergleich.</span>
    </p>
  </div>
);

export const DepotAnsicht = ({ e, antworten, onNeu }: { e: DepotErgebnis; antworten: Antworten; onNeu: () => void }) => (
  <section className="hc-frage" aria-live="polite">
    <h1 className="hc-ergebnis-h1">Dein Match: {e.anbieter.name}</h1>
    <Passung prozent={e.passung} />
    <p className="hc-antw-kopf">Deine Antworten</p>
    <ul className="hc-antw">
      {antwortZeilen(antworten).map((z) => (
        <li key={z}>
          <Check aria-hidden />
          {z}
        </li>
      ))}
    </ul>

    <div className="hc-nr1">
      <div className="hc-nr1-kopf">
        <span className="hc-nr1-zahl" aria-hidden>
          1
        </span>
        <p className="hc-nr1-label">Passt am besten</p>
      </div>
      <div className="hc-nr1-logo">
        <AnbieterLogo name={e.anbieter.name} domain={e.anbieter.domain} gross />
      </div>
      <p className="hc-nr1-name">
        {e.anbieter.name}
        <small>{e.anbieter.produkt}</small>
      </p>
      <p className="hc-nr1-warum">{e.warum}</p>
      <ul className="hc-gruende">
        {e.vorteile.map((v) => (
          <li key={v}>
            <Check aria-hidden />
            {v}
          </li>
        ))}
      </ul>
      {e.pflicht && <p className="hc-pflicht">{e.pflicht}</p>}
      {/* Genau ein Knopf, direkt zum Anbieter über /out (Elias RN3-07: „Ohne eine Zwischenbrücke“). */}
      <a href={e.link} className="hc-btn">
        {e.knopf}*
        <ArrowRight className="hc-pfeil" aria-hidden />
      </a>
    </div>

    {/* Echte Zahl bei der Empfehlung (Perspective-Frage 4, Elias RN6: „Followerzahl“, src/data/beweise.ts). */}
    <figure className="hc-folger">
      <img src="/elias-el-gendy.webp" alt="Elias El-Gendy" width={44} height={44} />
      <figcaption>Über {followerGesamt} folgen mir auf Instagram und TikTok</figcaption>
    </figure>

    <p className="hc-werbung">{WERBEHINWEIS}</p>
    <button type="button" onClick={onNeu} className="hc-neu">
      Check neu starten
    </button>
  </section>
);
