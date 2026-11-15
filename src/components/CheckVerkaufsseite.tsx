import { ArrowRight, Check, ChevronDown, X } from "lucide-react";
import { Link } from "react-router-dom";
import CheckStimme from "@/components/CheckStimme";
import { ANGEBOTE_GETESTET, WERBEHINWEIS, type Art } from "@/data/halalFinanzCheck";

/**
 * Verkaufsseite vor dem Halal-Finanz-Check, 1:1 nach Elias' Perspective-Funnel (Seite „Start“, V1). Bauplan: Vault
 * hermes/renovierungskampagne/perspective/eins-zu-eins/index.html, Learnings 23 bis 41. Reihenfolge: Kopf, Hero mit
 * Foto und Stimme, Gründer-Satz mit drei Pillen-Fotos und zweiter Stimme, vier Kriterien, Bekommst/Lassen weg, Fragen,
 * Schluss mit Porträt und Chat-Blase, Werbehinweis. Jeder Knopf startet die erste Frage. Bewegung und Look: halalFinanzCheck.css.
 * Bilder aus dem Perspective-Funnel (Unsplash), liegen unter public/bilder/check/. Texte ohne erfundene Namen, Zitate oder Sterne.
 */
const KRITERIEN = [
  { nr: "01", titel: "Halal-Auswahl", text: "Halal-ETF, Sharia-zertifiziertes Gold, Aktien.", bild: "krit1", alt: "Aktienchart auf einem Laptop", b: 400, h: 267 },
  { nr: "02", titel: "Kosten", text: "Was dich das Konto oder Depot im Jahr kostet.", bild: "krit2", alt: "Hand mit Banking-App", b: 400, h: 225 },
  { nr: "03", titel: "Zinsen", text: "Wo dein Geld ohne Zinsen liegt.", bild: "krit3", alt: "Hand mit Bankkarte", b: 400, h: 225 },
  { nr: "04", titel: "Sparplan", text: "Ob kleine Beträge gehen.", bild: "krit4", alt: "Mann mit Smartphone", b: 400, h: 267 },
] as const;

const BEKOMMST = [
  ["Eine klare Empfehlung", "Nach wenigen kurzen Fragen siehst du das Konto oder Depot, das zu dir passt."],
  ["Der Grund dazu", "Du liest, warum genau dieses Konto oder Depot vorne liegt."],
  ["Alle Kosten offen", "Kontoführung, Depotgebühr und Sparplan stehen vorher da."],
] as const;

const LASSEN_WEG = [
  ["Keine Fatwa", "Ich ordne ein, das Urteil eines Gelehrten ersetze ich nicht."],
  ["Keine Renditeversprechen", "Wie sich deine Anlage entwickelt, weiß niemand."],
  ["Kein versteckter Verkauf", "Partnerlinks sind mit * gekennzeichnet."],
] as const;

const FAQ = [
  ["Verdienst du daran?", "Ja, eine Provision. Dich kostet es nichts."],
  ["Muss ich gleich ein Konto eröffnen?", "Nein, erst siehst du dein Ergebnis."],
  ["Was kostet der Check?", "Nichts."],
  ["Ich habe schon ein Depot. Lohnt sich das?", "Ja, du bekommst das Zweitdepot oder das Konto."],
] as const;

const Pfeil = () => <ArrowRight className="hc-pfeil" aria-hidden />;

/** Kopf der Verkaufsseite je Art (RN8): ohne art das Gesamtbild, mit art nur das eine Thema. */
const KOPF: Record<"alle" | Art, { h1: string; lead: string; fragen: string }> = {
  alle: {
    h1: "Welches Konto und Depot passt zu deinem Glauben und deinem Geld?",
    lead: "Wenige kurze Fragen, dann siehst du, womit du halal startest.",
    fragen: "2 bis 3",
  },
  konto: {
    h1: "Welches Bankkonto passt zu deinem Glauben und deinem Geld?",
    lead: "2 kurze Fragen, dann siehst du, wie du dein Konto halal machst.",
    fragen: "2",
  },
  depot: {
    h1: "Welches Depot passt zu deinem Glauben und deinem Geld?",
    lead: "3 kurze Fragen, dann siehst du, wo du halal investierst.",
    fragen: "3",
  },
};

const CheckVerkaufsseite = ({ onStart, art }: { onStart: (stelle: string) => void; art?: Art }) => {
  const kopf = KOPF[art ?? "alle"];
  return (
    <div className="hc-seite">
      <header className="hc-kopf">
        <div className="hc-wrap hc-kopf-innen">
          <img src="/apple-touch-icon.png" alt="finanzmuslim" width={40} height={40} className="hc-logo" />
          <button type="button" className="hc-btn hc-btn--klein" onClick={() => onStart("kopf")}>
            Check starten
          </button>
        </div>
      </header>

      <main>
        <section className="hc-hero hc-wrap">
          <p className="hc-eyebrow" data-enter="0">HALAL-FINANZ-CHECK</p>
          <h1 className="hc-h1" data-enter="1">{kopf.h1}</h1>
          <p className="hc-lead" data-enter="2">{kopf.lead}</p>
          <div className="hc-knoepfe" data-enter="3">
            <button type="button" className="hc-btn" onClick={() => onStart("hero")}>
              Check starten
              <Pfeil />
            </button>
            <a href="#hc-pruefen" className="hc-btn hc-btn--rand">So läuft der Check</a>
          </div>
          <dl className="hc-fakten" data-enter="4">
            <div><dd>{ANGEBOTE_GETESTET}</dd><dt>Angebote selbst getestet</dt></div>
            <div><dd>{kopf.fragen} Fragen</dd><dt>Umfang</dt></div>
            <div><dd>1 Min</dd><dt>Dauer</dt></div>
            <div><dd>0 €</dd><dt>Kosten</dt></div>
          </dl>
          <div className="hc-foto" data-enter="5">
            <div className="hc-foto-rahmen">
              <img
                src="/bilder/check/hero.webp"
                alt="Mann prüft auf dem Smartphone sein Geld"
                width={1600}
                height={1067}
                {...{ fetchpriority: "high" }}
                className="hc-foto-bild"
              />
            </div>
            <CheckStimme stelle={0} art={art} className="hc-stimme--ueber" />
          </div>
        </section>

        <section className="hc-gruender hc-wrap" data-reveal>
          <h2 className="hc-satz">
            Ich wollte investieren, ohne einen Cent Riba.
            <img src="/bilder/check/pille1.webp" alt="" width={300} height={407} loading="lazy" className="hc-pille hc-pille--1" />
            Also habe ich Konten und Depots selbst verglichen,
            <img src="/bilder/check/pille2.webp" alt="" width={300} height={450} loading="lazy" className="hc-pille hc-pille--2" />
            und genau das teile ich hier mit dir.
            <img src="/bilder/check/pille3.webp" alt="" width={300} height={200} loading="lazy" className="hc-pille hc-pille--3" />
          </h2>
          <CheckStimme stelle={1} art={art} className="hc-stimme--zwei" />
        </section>

        <section id="hc-pruefen" className="hc-pruefen hc-wrap" data-reveal>
          <h2 className="hc-h2">Was der Check für dich prüft</h2>
          <div className="hc-zeilen">
            {KRITERIEN.map((k) => (
              <button key={k.nr} type="button" className="hc-zeile" onClick={() => onStart(`kriterium${k.nr}`)}>
                <span className="hc-zeile-bild">
                  <img src={`/bilder/check/${k.bild}.webp`} alt={k.alt} width={k.b} height={k.h} loading="lazy" />
                </span>
                <span className="hc-zeile-text">
                  <span className="hc-zeile-nr"><b>{k.nr}</b> Kriterium</span>
                  <span className="hc-zeile-titel">{k.titel}</span>
                  <span className="hc-zeile-beschr">{k.text}</span>
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="hc-vergleich hc-wrap" data-reveal aria-label="Was der Check leistet">
          <div className="hc-karte-blau">
            <p className="hc-karte-kopf">Das bekommst du</p>
            <ul>
              {BEKOMMST.map(([t, s]) => (
                <li key={t}>
                  <Check className="hc-haken" aria-hidden />
                  <span><b>{t}</b>{s}</span>
                </li>
              ))}
            </ul>
            <button type="button" className="hc-btn hc-btn--weiss" onClick={() => onStart("bekommst")}>
              Check starten
              <Pfeil />
            </button>
          </div>
          <div className="hc-karte-grau">
            <p className="hc-karte-kopf">Das lassen wir weg</p>
            <ul>
              {LASSEN_WEG.map(([t, s]) => (
                <li key={t}>
                  <X className="hc-haken" aria-hidden />
                  <span><b>{t}</b>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="hc-faq hc-wrap" data-reveal>
          <h2 className="hc-h2">Was du vor dem Check wissen willst</h2>
          <p className="hc-hinweis">
            Deine Frage fehlt? Schreib mir auf{" "}
            <a href="https://www.instagram.com/finanz.muslim/" target="_blank" rel="noopener noreferrer">Instagram</a>.
          </p>
          <div className="hc-faq-liste">
            {FAQ.map(([f, a], i) => (
              <details key={f} open={i === 0}>
                <summary>
                  <h3>{f}</h3>
                  <ChevronDown className="hc-chev" aria-hidden />
                </summary>
                <p className="hc-antwort">{a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="hc-schluss hc-wrap">
          <div className="hc-schluss-innen">
            <div className="hc-portraet">
              <img src="/elias-el-gendy.webp" alt="Elias El-Gendy, Gründer von finanzmuslim" width={480} height={480} loading="lazy" />
            </div>
            <div className="hc-blase">
              <p className="hc-blase-wer"><b>Elias</b> · Gründer von Finanzmuslim</p>
              <div className="hc-tipp">
                <span className="hc-punkte" aria-hidden><i /><i /><i /></span>
                <p className="hc-said">Beantworte ein paar kurze Fragen, und ich zeige dir, welches Konto oder Depot zu dir passt.</p>
              </div>
            </div>
            <h2 className="hc-h2 hc-schluss-h2">Noch unsicher, womit du startest?</h2>
            <button type="button" className="hc-btn hc-btn--breit" onClick={() => onStart("schluss")}>
              Check starten
              <Pfeil />
            </button>
          </div>
        </section>
      </main>

      <footer className="hc-fuss hc-wrap">
        <p>{WERBEHINWEIS}</p>
        <p className="hc-fuss-links">
          <Link to="/impressum">Impressum</Link>
          <Link to="/datenschutz">Datenschutz</Link>
        </p>
      </footer>
    </div>
  );
};

export default CheckVerkaufsseite;
