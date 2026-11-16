import { ArrowRight, Check, Users, X } from "lucide-react";
import { Link } from "react-router-dom";
import CheckStimme from "@/components/CheckStimme";
import { SchrittSzene, type SzeneId } from "@/components/CheckSchrittBild";
import { followerGesamt } from "@/data/beweise";
import { ANGEBOTE_GETESTET, DEPOTS_GETESTET, KONTEN_GETESTET, type Art } from "@/data/halalFinanzCheck";
import { stimmenFuer } from "@/data/checkStimmen";

/**
 * Verkaufsseite vor dem Halal-Finanz-Check, nach der Startseite von Elias' NEUEM Perspective-Funnel (6afa2cd179f7bfa91bb900d0,
 * Seite „Start“), nicht mehr nach der alten V1. Aufbau: Kopf mit rundem dunklem Knopf, Hero mit „89 Angebote selbst getestet“ und
 * drei Bank-Logos daneben, Community (nur echte Stimmen), „So entsteht deine Empfehlung“ in vier Schritten mit Foto, Tabelle
 * gegen Vergleichsportal und Selbst suchen, Schluss mit drei Schritten, Werbehinweis. Nicht übernommen: Avatare und „35 Depots
 * und 54 Girokonten selbst eröffnet“ (nicht bestätigt). Jeder Knopf startet die erste Frage. Look und Bewegung: halalFinanzCheck.css.
 * Bilder: nur eigenes Material aus dem Repo, wo es keines gibt (Konto-App, Konto-Eröffnung) bleibt das Foto aus /bilder/check/.
 *
 * RN11 (Elias RN10-01 und RN10-05, kein Neubau, nur Anpassungen an dieser Seite): KEIN Gesicht von Elias (Schritt 01, Schritt 04 Depot
 * und das Community-Foto ersetzt); direkt unter dem Titel die Zeile „35 Depots und 54 Girokonten selbst getestet“ mit Bildern anderer
 * (Beispiel nur im Entwicklungsmodus, checkStimmen.ts leuteBilder); „Mit Werbehinweis“ oben raus (steht im Fuß); „Aus der Community“ mit
 * Platz für Elias' Vortragsfoto (Uni Hamburg, COMMUNITY_FOTO); jeder Knopf startet den Check, auch der zweite; Tabelle mit Zeitaufwand
 * und Kosten wie im Original; Bank-Logos oben bleiben.
 */

/**
 * Elias' Foto vom Vortrag an der Uni Hamburg (RN10-01: „ein Bild von meinem Vortrag … Elias an der Uni Hamburg“). RN15: Elias hat das neue
 * Bild gewählt („name vom bild ist allein-am-pult-fein-geschaerft“): Elias allein am Pult der Universität Hamburg, von Codex klassisch
 * farbkorrigiert und fein geschärft, ohne generative Änderung (~/Documents/Codex/2026-11-16/folgendes-ich/outputs/vortrag-neue-motive/
 * allein-am-pult-fein-geschaerft.png, 360 × 480, als webp). Ersetzt vortrag-uni-hamburg.webp aus RN14.
 */
const COMMUNITY_FOTO: { src: string; alt: string; b: number; h: number; zeile: string } | null = {
  src: "/bilder/check/vortrag-allein-am-pult.webp",
  alt: "Elias am Pult der Universität Hamburg",
  b: 360,
  h: 480,
  // RN14-01 „irgendwie steht auch so klein Ilias bei … einen Vortrag … an der Universität Hamburg“.
  zeile: "Elias bei einem Vortrag von Halal Invest an der Universität Hamburg",
};

/**
 * Je Schritt eine Szene aus der echten Oberfläche (RN15, Elias RN14-02, CheckSchrittBild.tsx) statt eines Stockfotos; Konto und Depot
 * zeigen ihre eigenen Logos und Werte. Schritt 05 neu: das Erfolgserlebnis („irgendwas, was so wie ein Erfolgserlebnis wirkt“).
 */
const SCHRITTE: { nr: string; titel: string; text: string; szene: SzeneId }[] = [
  {
    nr: "01",
    titel: "Kurze Fragen",
    text: "Wenige Fragen zu deinem Alltag und dem, was dir wichtig ist. Dauert unter zwei Minuten.",
    szene: "chat",
  },
  {
    nr: "02",
    titel: "Abgleich mit meinen Testdaten",
    text: "Deine Antworten treffen auf meine Notizen zu Kosten, App und Halal-Blick.",
    szene: "raster",
  },
  {
    nr: "03",
    titel: "Dein Match mit Begründung",
    text: "Du siehst, welches Angebot passt, mit Kosten und dem Grund dafür.",
    szene: "analyse",
  },
  {
    nr: "04",
    titel: "Eröffnen, wenn es passt",
    text: "Ein Klick führt dich zum Anbieter. Ob du eröffnest, entscheidest allein du.",
    szene: "oeffnen",
  },
  {
    nr: "05",
    titel: "Halal gestartet",
    text: "Du startest mit einem Angebot, das zu dir passt, und weißt, warum es passt.",
    szene: "erfolg",
  },
];

const ZEILEN = [
  ["Halal-Blick", true, false, false],
  ["Begründung für dein Match", true, false, false],
] as const;

/** Wie im Original (Blueprint rn10 Abschnitt 2.5): Zeitaufwand und Kosten für dich; „Werbelinks gekennzeichnet“ bleibt weg (Elias RN10-01). */
const TEXT_ZEILEN = [
  ["Zeitaufwand", "2 Min.", "20 Min.", "Stunden"],
  ["Kosten für dich", "0 €", "0 €", "0 €"],
] as const;

const FRAGEN_ZEILEN = [
  ["01", "Du erzählst kurz von dir", "Ein Tipp pro Frage, ganz im Chat-Ton."],
  ["02", "Wir gleichen ab", "Deine Antworten treffen auf meine Testdaten."],
  ["03", "Du bekommst dein Match", "Eine Empfehlung mit Kosten und den Gründen, warum sie zu dir passt."],
] as const;

const Pfeil = () => <ArrowRight className="hc-pfeil" aria-hidden />;

/**
 * RN15 (Elias RN14-02 „anstatt 35 Depot sind Girokonto selbst getestet, dann machst du da die Logos in dem Runden hin“): in der Zeile unter
 * dem Titel runde Logos getesteter Banken statt Bildern anderer Leute. Die Logo-Leiste neben „89 Angebote selbst getestet“ fällt dafür weg
 * (bei 390 gemessen: zwei Logo-Reihen übereinander wirken unruhig, Regelbuch look-und-design Nie „Nicht zu viel auf einmal“).
 * `w`: Breite des Schriftzugs im Kreis in Prozent, je nach Form der Datei.
 */
const RUNDE_BANKEN: { src: string; alt: string; b: number; h: number; aus: [number, number, number, number] }[] = [
  // `aus`: Ausschnitt der Datei als Anteil (links, oben, rechts, unten), nur das Zeichen der Bank: ING der Löwe, Commerzbank das Band,
  // Deutsche Bank das Quadrat, DKB der Schriftzug ohne „Das kann Bank“. Maße der Dateien in px (naturalWidth × naturalHeight).
  { src: "/logos/ing.de.svg", alt: "ING", b: 2680, h: 500, aus: [0.42, 0.02, 0.66, 0.8] },
  { src: "/logos/commerzbank.de.svg", alt: "Commerzbank", b: 300, h: 40, aus: [0.865, 0, 1, 1] },
  { src: "/logos/deutsche-bank.de.svg", alt: "Deutsche Bank", b: 250, h: 52, aus: [0.785, 0, 1, 1] },
  { src: "/logos/dkb.de.svg", alt: "DKB", b: 265, h: 150, aus: [0, 0.02, 1, 0.55] },
];

/** Ausschnitt mittig in einem Quadrat von `s` px: Hintergrundbild so groß und so verschoben, dass genau der Ausschnitt hineinpasst. */
const rundStil = (r: (typeof RUNDE_BANKEN)[number], s: number) => {
  const [x0, y0, x1, y1] = r.aus;
  const k = s / Math.max((x1 - x0) * r.b, (y1 - y0) * r.h);
  const breite = r.b * k;
  const hoehe = r.h * k;
  const links = -x0 * breite + (s - (x1 - x0) * breite) / 2;
  const oben = -y0 * hoehe + (s - (y1 - y0) * hoehe) / 2;
  return {
    width: `${s}px`,
    height: `${s}px`,
    backgroundImage: `url(${r.src})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: `${breite}px ${hoehe}px`,
    backgroundPosition: `${links}px ${oben}px`,
  };
};

/** Kopf der Verkaufsseite je Art: Konto zwei Fragen (Elias' Wort Bankkonto), Depot drei, ohne art beides. */
const KOPF: Record<"alle" | Art, { h1: string; lead: string; fragen: string; wort: string; vergleich: { text: string; pfad: string } }> = {
  alle: {
    h1: "Welches Konto oder Depot passt wirklich zu dir?",
    lead: "Wenige kurze Fragen, dann siehst du dein Match für Konto oder Depot, mit allen Kosten und dem Grund, warum es zu dir passt.",
    fragen: "wenige",
    wort: "Wenige",
    vergleich: { text: "Erst Depots vergleichen", pfad: "/vergleich/depot" },
  },
  konto: {
    h1: "Welches Bankkonto passt wirklich zu dir?",
    lead: "Drei kurze Fragen, dann siehst du dein Match mit allen Kosten und dem Grund, warum es zu dir passt.",
    fragen: "3",
    wort: "Drei",
    vergleich: { text: "Erst Bankkonten vergleichen", pfad: "/vergleich/girokonto" },
  },
  depot: {
    h1: "Welches Depot passt wirklich zu dir?",
    lead: "Wenige kurze Fragen, dann siehst du dein Match mit allen Kosten und dem Grund, warum es zu dir passt.",
    fragen: "wenige",
    wort: "Wenige",
    vergleich: { text: "Erst Depots vergleichen", pfad: "/vergleich/depot" },
  },
};

const CheckVerkaufsseite = ({ onStart, art }: { onStart: (stelle: string) => void; art?: Art }) => {
  const kopf = KOPF[art ?? "alle"];
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
              </div>
              <h1 className="hc-h1" data-enter="1">{kopf.h1}</h1>
              {/* Elias RN14-02: statt Bildern anderer Leute runde Bank-Logos */}
              <p className="hc-leute-zeile" data-enter="2">
                <span className="hc-rund-banken">
                  {RUNDE_BANKEN.map((b) => (
                    <span key={b.src} className="hc-rund-bank" role="img" aria-label={b.alt}>
                      <span style={rundStil(b, 20)} />
                    </span>
                  ))}
                </span>
                <span>
                  {DEPOTS_GETESTET} Depots und {KONTEN_GETESTET} Girokonten selbst getestet
                </span>
              </p>
            </div>
            <div className="hc-hero-rechts">
              <p className="hc-lead" data-enter="2">{kopf.lead}</p>
              <div className="hc-knoepfe" data-enter="3">
                <button type="button" className="hc-btn hc-btn--gross" onClick={() => onStart("hero")}>
                  Match finden
                  <Pfeil />
                </button>
                {/* Elias RN10-01: „egal, was ich klicke, es startet sofort der Vergleich“: auch der zweite Knopf startet den Check. */}
                <button type="button" className="hc-btn hc-btn--rand hc-btn--gross" onClick={() => onStart("hero2")}>
                  {kopf.vergleich.text}
                </button>
              </div>
            </div>
          </div>
          {/* Elias RN14-02: statt „Nur drei Fragen, unter 2 Minuten, kostenlos“ lieber „22.000 Leute vertrauen …“; belegt wie im Ergebnis */}
          <p className="hc-haken-zeile hc-vertrauen" data-enter="4">
            <Users className="hc-haken-icon" aria-hidden />
            <span>Über {followerGesamt} Menschen informieren sich bei Finanzmuslim</span>
          </p>
        </section>

        {zeigeCommunity && (
          <section className="hc-community hc-wrap" data-reveal>
            <p className="hc-kicker">Aus der Community</p>
            <h2 className="hc-h2">Sie haben gewechselt und bereuen es nicht</h2>
            <div className="hc-community-gitter">
              {COMMUNITY_FOTO ? (
                <figure className="hc-community-foto hc-community-foto--bild">
                  <img src={COMMUNITY_FOTO.src} alt={COMMUNITY_FOTO.alt} width={COMMUNITY_FOTO.b} height={COMMUNITY_FOTO.h} loading="lazy" />
                  <figcaption>{COMMUNITY_FOTO.zeile}</figcaption>
                </figure>
              ) : (
                import.meta.env.DEV && (
                  <figure className="hc-community-foto hc-community-foto--platz" data-foto-platzhalter>
                    <span>Platz für dein Foto vom Vortrag an der Uni Hamburg</span>
                  </figure>
                )
              )}
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
              return (
                <button key={s.nr} type="button" className="hc-zeile" onClick={() => onStart(`schritt${s.nr}`)}>
                  <span className="hc-zeile-bild">
                    <SchrittSzene id={s.szene} art={art} />
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
              {TEXT_ZEILEN.map(([name, wir, portal, selbst]) => (
                <tr key={name}>
                  <th scope="row">{name}</th>
                  <td className="hc-tab-wir"><b>{wir}</b></td>
                  <td>{portal}</td>
                  <td>{selbst}</td>
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
