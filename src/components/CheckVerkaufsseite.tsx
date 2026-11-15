import { ArrowRight, Check, X } from "lucide-react";
import { Link } from "react-router-dom";
import eliasCommunity from "@/assets/story-elias-warm.webp";
import CheckStimme from "@/components/CheckStimme";
import { ANGEBOTE_GETESTET, type Art } from "@/data/halalFinanzCheck";
import { stimmenFuer } from "@/data/checkStimmen";

/**
 * Verkaufsseite vor dem Halal-Finanz-Check, nach der Startseite von Elias' NEUEM Perspective-Funnel (6afa2cd179f7bfa91bb900d0,
 * Seite „Start“), nicht mehr nach der alten V1. Aufbau: Kopf mit rundem dunklem Knopf, Hero mit „89 Angebote selbst getestet“ und
 * drei Bank-Logos daneben, Community (nur echte Stimmen), „So entsteht deine Empfehlung“ in vier Schritten mit Foto, Tabelle
 * gegen Vergleichsportal und Selbst suchen, Schluss mit drei Schritten, Werbehinweis. Nicht übernommen: Avatare und „35 Depots
 * und 54 Girokonten selbst eröffnet“ (nicht bestätigt). Jeder Knopf startet die erste Frage. Look und Bewegung: halalFinanzCheck.css.
 * Bilder: nur eigenes Material aus dem Repo, wo es keines gibt (Konto-App, Konto-Eröffnung) bleibt das Foto aus /bilder/check/.
 */

type Bild = { src: string; alt: string; b: number; h: number; oben?: boolean };

/** Je Schritt ein Bild für Konto und eines für Depot (und ohne art). Eigenes Material zuerst, sonst das vorhandene Stockfoto. */
const SCHRITTE: { nr: string; titel: string; text: string; konto: Bild; depot: Bild }[] = [
  {
    nr: "01",
    titel: "Kurze Fragen",
    text: "Wenige Fragen zu deinem Alltag und dem, was dir wichtig ist. Dauert unter zwei Minuten.",
    konto: { src: "/elias-el-gendy.webp", alt: "Elias El-Gendy, Gründer von Finanzmuslim", b: 480, h: 480, oben: true },
    depot: { src: "/elias-el-gendy.webp", alt: "Elias El-Gendy, Gründer von Finanzmuslim", b: 480, h: 480, oben: true },
  },
  {
    nr: "02",
    titel: "Abgleich mit meinen Testdaten",
    text: "Deine Antworten treffen auf meine Notizen zu Kosten, App und Halal-Blick.",
    konto: { src: "/vergleich/depot-app/scalable-1.webp", alt: "Depot-App aus dem Vergleich", b: 1080, h: 2207, oben: true },
    depot: { src: "/vergleich/depot-app/scalable-1.webp", alt: "Depot-App aus dem Vergleich", b: 1080, h: 2207, oben: true },
  },
  {
    nr: "03",
    titel: "Dein Match mit Begründung",
    text: "Du siehst, welches Angebot passt, mit Kosten und dem Grund dafür.",
    konto: { src: "/bilder/check/krit4.webp", alt: "Mann liest auf dem Smartphone", b: 400, h: 267 },
    depot: { src: "/vergleich/depot-app/flatex-1.webp", alt: "Aktiensparplan in der flatex-App", b: 1080, h: 2341, oben: true },
  },
  {
    nr: "04",
    titel: "Eröffnen, wenn es passt",
    text: "Ein Klick führt dich zum Anbieter. Ob du eröffnest, entscheidest allein du.",
    konto: { src: "/bilder/check/krit3.webp", alt: "Hand mit Bankkarte", b: 400, h: 225 },
    depot: { src: "/videos/einrichtung-flatex-poster.jpg", alt: "Elias zeigt die Eröffnung bei flatex", b: 1280, h: 720 },
  },
];

const ZEILEN = [
  ["Halal-Blick", true, false, false],
  ["Begründung für dein Match", true, false, false],
] as const;

const FRAGEN_ZEILEN = [
  ["01", "Du erzählst kurz von dir", "Ein Tipp pro Frage, ganz im Chat-Ton."],
  ["02", "Wir gleichen ab", "Deine Antworten treffen auf meine Testdaten."],
  ["03", "Du bekommst dein Match", "Eine Empfehlung mit Kosten und den Gründen, warum sie zu dir passt."],
] as const;

const Pfeil = () => <ArrowRight className="hc-pfeil" aria-hidden />;

const BANKEN = [
  { src: "/logos/ing.de.svg", alt: "ING", cls: "hc-bank--ing" },
  { src: "/logos/dkb.de.svg", alt: "DKB", cls: "hc-bank--dkb" },
  { src: "/logos/commerzbank.de.svg", alt: "Commerzbank", cls: "hc-bank--cb" },
];

/** Kopf der Verkaufsseite je Art: Konto zwei Fragen (Elias' Wort Bankkonto), Depot drei, ohne art beides. */
const KOPF: Record<"alle" | Art, { h1: string; lead: string; fragen: string; wort: string; vergleich: { text: string; pfad: string } }> = {
  alle: {
    h1: "Welches Konto oder Depot passt wirklich zu dir?",
    lead: "Wenige kurze Fragen, dann siehst du dein Match für Konto oder Depot, mit allen Kosten und dem Grund, warum es zu dir passt.",
    fragen: "2 bis 3",
    wort: "Wenige",
    vergleich: { text: "Erst Depots vergleichen", pfad: "/vergleich/depot" },
  },
  konto: {
    h1: "Welches Bankkonto passt wirklich zu dir?",
    lead: "Zwei kurze Fragen, dann siehst du dein Match mit allen Kosten und dem Grund, warum es zu dir passt.",
    fragen: "2",
    wort: "Zwei",
    vergleich: { text: "Erst Bankkonten vergleichen", pfad: "/vergleich/girokonto" },
  },
  depot: {
    h1: "Welches Depot passt wirklich zu dir?",
    lead: "Drei kurze Fragen, dann siehst du dein Match mit allen Kosten und dem Grund, warum es zu dir passt.",
    fragen: "3",
    wort: "Drei",
    vergleich: { text: "Erst Depots vergleichen", pfad: "/vergleich/depot" },
  },
};

const CheckVerkaufsseite = ({ onStart, art }: { onStart: (stelle: string) => void; art?: Art }) => {
  const kopf = KOPF[art ?? "alle"];
  const bilder = art === "konto" ? "konto" : "depot";
  // Ohne echte Stimme entfällt die ganze Community live, nur der Entwicklungsmodus zeigt den gelben Platzhalter (nie ausgedachte Stimmen).
  const zeigeCommunity = stimmenFuer(art).length > 0 || import.meta.env.DEV;
  return (
    <div className="hc-seite">
      <header className="hc-kopf">
        <div className="hc-wrap hc-kopf-innen">
          <img src="/apple-touch-icon.png" alt="finanzmuslim" width={40} height={40} className="hc-logo" />
          <button type="button" className="hc-btn hc-btn--klein hc-btn--dunkel" onClick={() => onStart("kopf")}>
            Match finden
          </button>
        </div>
      </header>

      <main>
        <section className="hc-hero hc-wrap">
          <div className="hc-hero-gitter">
            <div>
              <div className="hc-beweis" data-enter="0">
                <p className="hc-eyebrow">{ANGEBOTE_GETESTET} Angebote selbst getestet</p>
                <span className="hc-banken">
                  {BANKEN.map((b) => (
                    <img key={b.src} src={b.src} alt={b.alt} height={18} className={`hc-bank ${b.cls}`} />
                  ))}
                </span>
              </div>
              <h1 className="hc-h1" data-enter="1">{kopf.h1}</h1>
            </div>
            <div className="hc-hero-rechts">
              <p className="hc-lead" data-enter="2">{kopf.lead}</p>
              <div className="hc-knoepfe" data-enter="3">
                <button type="button" className="hc-btn hc-btn--gross" onClick={() => onStart("hero")}>
                  Match finden
                  <Pfeil />
                </button>
                <Link to={kopf.vergleich.pfad} className="hc-btn hc-btn--rand hc-btn--gross">
                  {kopf.vergleich.text}
                </Link>
              </div>
            </div>
          </div>
          <ul className="hc-haken-zeile" data-enter="4">
            {[`Nur ${kopf.fragen} Fragen`, "Unter 2 Minuten", "Kostenlos", "Mit Werbehinweis"].map((t) => (
              <li key={t}>
                <Check className="hc-haken-icon" aria-hidden />
                {t}
              </li>
            ))}
          </ul>
        </section>

        {zeigeCommunity && (
          <section className="hc-community hc-wrap" data-reveal>
            <p className="hc-kicker">Aus der Community</p>
            <h2 className="hc-h2">Sie haben gewechselt und bereuen es nicht</h2>
            <div className="hc-community-gitter">
              <figure className="hc-community-foto">
                <img src={eliasCommunity} alt="Elias El-Gendy lächelt in die Kamera" width={928} height={1152} loading="lazy" />
              </figure>
              <div className="hc-community-stimmen">
                <CheckStimme stelle={0} art={art} />
                <CheckStimme stelle={1} art={art} />
              </div>
            </div>
          </section>
        )}

        <section className="hc-schritte hc-wrap" data-reveal>
          <div className="hc-schritte-kopf">
            <h2 className="hc-h2">So entsteht deine Empfehlung</h2>
            <p className="hc-grau-text">Kein Ranking nach Provision. Partnerlinks sind offen gekennzeichnet.</p>
          </div>
          <div className="hc-zeilen hc-zeilen--zwei">
            {SCHRITTE.map((s) => {
              const bild = s[bilder];
              return (
                <button key={s.nr} type="button" className="hc-zeile" onClick={() => onStart(`schritt${s.nr}`)}>
                  <span className={`hc-zeile-bild${bild.oben ? " hc-zeile-bild--oben" : ""}`}>
                    <img src={bild.src} alt={bild.alt} width={bild.b} height={bild.h} loading="lazy" />
                  </span>
                  <span className="hc-zeile-text">
                    <span className="hc-zeile-nr"><b>{s.nr}</b> Schritt</span>
                    <span className="hc-zeile-titel">{s.titel}</span>
                    <span className="hc-zeile-beschr">{s.text}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="hc-tabelle-box hc-wrap" data-reveal>
          <h2 className="hc-h2 hc-h2--schmal">Warum nicht einfach das erstbeste Vergleichsportal?</h2>
          <table className="hc-tab">
            <thead>
              <tr>
                <th className="hc-tab-ecke"><span className="hc-nur-sr">Vergleich der Möglichkeiten</span></th>
                <th scope="col" className="hc-tab-wir">Finanz&shy;muslim</th>
                <th scope="col">Vergleichs&shy;portal</th>
                <th scope="col">Selbst suchen</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Selbst getestete Angebote</th>
                <td className="hc-tab-wir"><b>{ANGEBOTE_GETESTET}</b></td>
                <td className="hc-tab-leer">–</td>
                <td className="hc-tab-leer">–</td>
              </tr>
              {ZEILEN.map(([name, ...werte]) => (
                <tr key={name}>
                  <th scope="row">{name}</th>
                  {werte.map((ja, i) => (
                    <td key={i} className={i === 0 ? "hc-tab-wir" : undefined}>
                      {ja ? <Check className="hc-tab-ja" aria-hidden /> : <X className="hc-tab-nein" aria-hidden />}
                      <span className="hc-nur-sr">{ja ? "Enthalten" : "Nicht enthalten"}</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="hc-schluss hc-wrap" data-reveal>
          <div className="hc-schluss-gitter">
            <h2 className="hc-h2">{kopf.wort} kurze Fragen, dann weißt du, was zu dir passt</h2>
            <ol className="hc-nummern">
              {FRAGEN_ZEILEN.map(([nr, t, s]) => (
                <li key={nr}>
                  <span aria-hidden>{nr}</span>
                  <div>
                    <h3>{t}</h3>
                    <p>{s}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="hc-schluss-knopf">
              <button type="button" className="hc-btn hc-btn--gross hc-btn--breit" onClick={() => onStart("schluss")}>
                Erste Frage starten
                <Pfeil />
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="hc-fuss hc-wrap">
        <div className="hc-fuss-karte">
          <img src="/apple-touch-icon.png" alt="finanzmuslim" width={40} height={40} className="hc-logo" />
          <div className="hc-fuss-text">
            <p className="hc-fuss-titel">Werbehinweis &amp; Transparenz</p>
            <p>
              Einige Links auf dieser Seite sind Partnerlinks. Eröffnest du darüber ein Konto oder Depot, erhält Finanzmuslim eine
              Provision, für dich ändert sich am Preis nichts. Die Empfehlung beruht auf deinen Antworten und eigenen Tests, nicht auf
              der Höhe der Provision. Sie ist keine Anlageberatung, und Investitionen bergen das Risiko von Verlusten.
            </p>
          </div>
          <p className="hc-fuss-links">
            <Link to="/impressum">Impressum</Link>
            <Link to="/datenschutz">Datenschutz</Link>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CheckVerkaufsseite;
