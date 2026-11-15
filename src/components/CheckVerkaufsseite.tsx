import { ArrowRight, Check, X } from "lucide-react";
import { Link } from "react-router-dom";
import eliasCutout from "@/assets/elias-freigestellt.webp";
import CheckStimme from "@/components/CheckStimme";
import { ANGEBOTE_GETESTET, DEPOTS_GETESTET, KONTEN_GETESTET, type Art } from "@/data/halalFinanzCheck";
import { stimmenFuer } from "@/data/checkStimmen";
import "@/styles/checkVerkaufsseite.css";

/**
 * Verkaufsseite vor dem Halal-Finanz-Check (RN10-Neubau, Elias 16.11.2026: „noch nicht richtig nachgemacht“). Abschnitt für Abschnitt wie
 * die Startseite von Elias' Perspective-Funnel (6afa2cd179f7bfa91bb900d0, Seite „Start“), die Größen des Kopfes aber wie die Startseite
 * von finanzmuslim.com (Titel 30 px fett, grauer Satz, freigestelltes Foto mit Namensschild, Knopf darunter): Kopfleiste, Kopf mit Titel,
 * direkt darunter „35 Depots und 54 Girokonten“ mit Bildern anderer Leute, Community mit einem echten Foto, „So entsteht deine
 * Empfehlung“, Tabelle, Schluss, Werbehinweis im Fuß. Jede klickbare Fläche startet den Check (onStart), Impressum und Datenschutz
 * ausgenommen. Ohne Bestätigung nichts Erfundenes: keine Stimmen, keine Avatare, kein Vortragsfoto, solange Elias sie nicht liefert
 * (im Entwicklungsmodus ein gestrichelter Platzhalter, live nichts). Look und Bewegung: src/styles/checkVerkaufsseite.css, Farben aus .hc.
 */

type Bild = { src: string; alt: string; b: number; h: number; oben?: boolean };

/** Das eine echte Foto der Community-Sektion (Elias' Vortrag an der Uni Hamburg). Elias schickt es, bis dahin Platzhalter im Entwicklungsmodus. */
const COMMUNITY_FOTO: Bild | null = null;

/** Die drei Bilder anderer Leute neben „35 Depots und 54 Girokonten“. Echte Leser oder Fotos, das entscheidet Elias; bis dahin Platzhalter nur im Entwicklungsmodus. */
const AVATARE: string[] = [];

/** Je Schritt ein Bild für Konto und eines für Depot (und ohne art). Eigenes Material zuerst, sonst das vorhandene Stockfoto im Repo. */
const SCHRITTE: { nr: string; titel: string; text: string; konto: Bild; depot: Bild }[] = [
  {
    nr: "01",
    titel: "Kurze Fragen",
    text: "",
    konto: { src: "/bilder/check/krit2.webp", alt: "Hände halten ein Smartphone", b: 400, h: 225 },
    depot: { src: "/bilder/check/krit2.webp", alt: "Hände halten ein Smartphone", b: 400, h: 225 },
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

/** Tabelle: Wir gegen Vergleichsportal und Selbst suchen. Nur was belegt ist; über andere steht keine Zahl, nur ein Kreuz oder „–“. */
type Zelle = boolean | string;
const TABELLE: { name: string; werte: [Zelle, Zelle, Zelle] }[] = [
  { name: "Selbst getestete Angebote", werte: [String(ANGEBOTE_GETESTET), "–", "–"] },
  { name: "Halal-Blick", werte: [true, false, false] },
  { name: "Begründung für dein Match", werte: [true, false, false] },
  { name: "Zeitaufwand", werte: ["Unter 2 Min.", "–", "–"] },
  { name: "Kosten für dich", werte: ["0 €", "0 €", "0 €"] },
];

const Pfeil = () => <ArrowRight className="hv-pfeil" aria-hidden />;

/** Wörter und Texte je Art. Konto fragt wirklich drei Dinge (Was suchst du, Wie bezahlst du, Bank von heute), Depot vier bis sechs. */
const KOPF: Record<
  "alle" | Art,
  { h1: string; lead: string; fragen: string; wort: string; schritt1: { titel: string; text: string }; schluss: [string, string, string] }
> = {
  alle: {
    h1: "Welches Konto oder Depot passt wirklich zu dir?",
    lead: "Wenige kurze Fragen, dann siehst du dein Match für Konto oder Depot, mit allen Kosten und dem Grund, warum es zu dir passt.",
    fragen: "wenige",
    wort: "Wenige",
    schritt1: { titel: "Wenige kurze Fragen", text: "Was du suchst, wie viel Erfahrung du hast und was dir wichtig ist. Dauert unter zwei Minuten." },
    schluss: ["Ziel, Erfahrung und deine Bank oder dein Depot heute. Ein Tipp pro Frage, ganz im Chat-Ton.", "Deine Antworten treffen auf jedes Konto und Depot, das ich selbst getestet habe.", "Eine Empfehlung mit Kosten und den Gründen, warum sie zu dir passt."],
  },
  konto: {
    h1: "Welches Girokonto passt wirklich zu dir?",
    lead: "Drei kurze Fragen, dann siehst du dein Match mit allen Kosten und dem Grund, warum es zu dir passt.",
    fragen: "3",
    wort: "Drei",
    schritt1: { titel: "Drei kurze Fragen", text: "Was du suchst, wie du bezahlst und bei welcher Bank du heute bist. Dauert unter zwei Minuten." },
    schluss: ["Was du suchst, wie du bezahlst und deine Bank heute. Ein Tipp pro Frage, ganz im Chat-Ton.", "Deine Antworten treffen auf jedes Girokonto, das ich selbst getestet habe.", "Eine Empfehlung mit Kosten und den Gründen, warum sie zu dir passt."],
  },
  depot: {
    h1: "Welches Depot passt wirklich zu dir?",
    lead: "Wenige kurze Fragen, dann siehst du dein Match mit allen Kosten und dem Grund, warum es zu dir passt.",
    fragen: "wenige",
    wort: "Wenige",
    schritt1: { titel: "Wenige kurze Fragen", text: "Deine Erfahrung, was dir wichtig ist und dein Depot heute. Dauert unter zwei Minuten." },
    schluss: ["Erfahrung, Ziel und dein Depot heute. Ein Tipp pro Frage, ganz im Chat-Ton.", "Deine Antworten treffen auf jedes Depot, das ich selbst getestet habe.", "Eine Empfehlung mit Kosten und den Gründen, warum sie zu dir passt."],
  },
};

const FAKTEN = (fragen: string) => [fragen === "wenige" ? "Nur wenige Fragen" : `Nur ${fragen} Fragen`, "Unter 2 Minuten", "Kostenlos"];

const CheckVerkaufsseite = ({ onStart, art }: { onStart: (stelle: string) => void; art?: Art }) => {
  const kopf = KOPF[art ?? "alle"];
  const bilder = art === "konto" ? "konto" : "depot";
  const stimmen = stimmenFuer(art);
  // Die Community-Sektion trägt die Aussage „Sie haben gewechselt und bereuen es nicht“: live nur mit echter Stimme, im Entwicklungsmodus mit Platzhaltern.
  const zeigeCommunity = stimmen.length > 0 || import.meta.env.DEV;
  const zeigeFoto = COMMUNITY_FOTO !== null || import.meta.env.DEV;
  const avatare = AVATARE.length > 0 ? AVATARE.slice(0, 3) : import.meta.env.DEV ? [null, null, null] : [];
  return (
    <div className="hv-seite">
      <header className="hv-kopf">
        <div className="hv-wrap hv-kopf-innen">
          <img src="/apple-touch-icon.png" alt="finanzmuslim" width={32} height={32} className="hv-logo" />
          <nav className="hv-kopf-links" aria-label="Abschnitte">
            <button type="button" onClick={() => onStart("kopf-schritte")}>So geht&rsquo;s</button>
            <button type="button" onClick={() => onStart("kopf-vergleich")}>Vergleich</button>
          </nav>
          <button type="button" className="hv-btn hv-btn--klein hv-btn--dunkel" onClick={() => onStart("kopf")}>
            Match finden
          </button>
        </div>
      </header>

      <main>
        <section className="hv-hero hv-wrap">
          <div className="hv-hero-gitter">
            <div className="hv-hero-text">
              <p className="hv-eyebrow" data-enter="1">{ANGEBOTE_GETESTET} Angebote selbst getestet</p>
              <h1 className="hv-h1" data-enter="2">{kopf.h1}</h1>
              <div className="hv-beweis" data-enter="3">
                {avatare.length > 0 && (
                  <span className="hv-avatare">
                    {avatare.map((src, i) =>
                      src ? (
                        <img key={src} src={src} alt="" width={32} height={32} className="hv-avatar" />
                      ) : (
                        <span key={i} className="hv-avatar hv-avatar--platz" data-avatar-platzhalter aria-hidden />
                      ),
                    )}
                  </span>
                )}
                <p>{DEPOTS_GETESTET} Depots und {KONTEN_GETESTET} Girokonten selbst getestet</p>
              </div>
              <p className="hv-lead" data-enter="4">{kopf.lead}</p>
            </div>

            <div className="hv-foto" aria-hidden={false}>
              <div className="hv-foto-bild">
                <img src={eliasCutout} alt="" width={528} height={800} loading="eager" />
              </div>
              <div className="hv-name">
                <p>Elias El-Gendy</p>
                <p>Gründer von finanzmuslim</p>
              </div>
            </div>

            <div className="hv-hero-knopf" data-enter="5">
              <button type="button" className="hv-btn hv-btn--gross" onClick={() => onStart("hero")}>
                Match finden
                <Pfeil />
              </button>
              <ul className="hv-fakten">
                {FAKTEN(kopf.fragen).map((t) => (
                  <li key={t}>
                    <Check className="hv-haken" aria-hidden />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {zeigeCommunity && (
          <section className="hv-community hv-wrap" data-reveal>
            <div className="hv-kopfblock">
              <p className="hv-kicker">Aus der Community</p>
              <h2 className="hv-h2">Sie haben gewechselt und bereuen es nicht</h2>
            </div>
            <div className={`hv-community-gitter${zeigeFoto ? "" : " hv-community-gitter--ohne"}`}>
              {COMMUNITY_FOTO ? (
                <figure className="hv-community-foto">
                  <img src={COMMUNITY_FOTO.src} alt={COMMUNITY_FOTO.alt} width={COMMUNITY_FOTO.b} height={COMMUNITY_FOTO.h} loading="lazy" />
                </figure>
              ) : (
                import.meta.env.DEV && (
                  <div className="hv-community-foto hv-platz" data-foto-platzhalter>
                    Hier kommt dein Foto vom Vortrag an der Uni Hamburg
                  </div>
                )
              )}
              <div className="hv-community-stimmen">
                <CheckStimme stelle={0} art={art} />
                <CheckStimme stelle={1} art={art} />
              </div>
            </div>
          </section>
        )}

        <section className="hv-schritte hv-wrap" data-reveal>
          <div className="hv-schritte-kopf">
            <h2 className="hv-h2 hv-h2--mittel">So entsteht deine Empfehlung</h2>
            <p>Kein Ranking nach Provision. Partnerlinks sind offen gekennzeichnet.</p>
          </div>
          <div className="hv-zeilen">
            {SCHRITTE.map((s, i) => {
              const bild = s[bilder];
              const titel = i === 0 ? kopf.schritt1.titel : s.titel;
              const text = i === 0 ? kopf.schritt1.text : s.text;
              return (
                <button key={s.nr} type="button" className="hv-zeile" onClick={() => onStart(`schritt${s.nr}`)}>
                  <span className={`hv-zeile-bild${bild.oben ? " hv-zeile-bild--oben" : ""}`}>
                    <img src={bild.src} alt={bild.alt} width={bild.b} height={bild.h} loading="lazy" />
                  </span>
                  <span className="hv-zeile-text">
                    <span className="hv-zeile-nr"><b>{s.nr}</b> Schritt</span>
                    <span className="hv-zeile-titel">{titel}</span>
                    <span className="hv-zeile-beschr">{text}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="hv-tabelle hv-wrap" data-reveal>
          <h2 className="hv-h2 hv-h2--mittel">Warum nicht einfach das erstbeste Vergleichsportal?</h2>
          <div className="hv-tab-rahmen">
            <table className="hv-tab">
              <thead>
                <tr>
                  <th className="hv-tab-ecke"><span className="hv-nur-sr">Vergleich der Möglichkeiten</span></th>
                  <th scope="col" className="hv-tab-wir">Finanz&shy;muslim</th>
                  <th scope="col">Vergleichs&shy;portal</th>
                  <th scope="col">Selbst suchen</th>
                </tr>
              </thead>
              <tbody>
                {TABELLE.map(({ name, werte }) => (
                  <tr key={name}>
                    <th scope="row">{name}</th>
                    {werte.map((w, i) => (
                      <td key={i} className={i === 0 ? "hv-tab-wir" : undefined}>
                        {typeof w === "string" ? (
                          i === 0 ? <b>{w}</b> : <span className={w === "–" ? "hv-tab-leer" : undefined}>{w}</span>
                        ) : (
                          <>
                            {w ? <Check className="hv-tab-ja" aria-hidden /> : <X className="hv-tab-nein" aria-hidden />}
                            <span className="hv-nur-sr">{w ? "Enthalten" : "Nicht enthalten"}</span>
                          </>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="hv-schluss hv-wrap" data-reveal>
          <div className="hv-schluss-gitter">
            <h2 className="hv-h2 hv-h2--mittel">{kopf.wort} kurze Fragen, dann weißt du, was zu dir passt</h2>
            <ol className="hv-nummern">
              {(["Du erzählst kurz von dir", "Wir gleichen ab", "Du bekommst dein Match"] as const).map((t, i) => (
                <li key={t}>
                  <span aria-hidden>{`0${i + 1}`}</span>
                  <div>
                    <h3>{t}</h3>
                    <p>{kopf.schluss[i]}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="hv-schluss-knopf">
              <button type="button" className="hv-btn hv-btn--gross" onClick={() => onStart("schluss")}>
                Erste Frage starten
                <Pfeil />
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="hv-fuss hv-wrap">
        <div className="hv-fuss-karte">
          <img src="/apple-touch-icon.png" alt="finanzmuslim" width={32} height={32} className="hv-logo" />
          <div className="hv-fuss-text">
            <p className="hv-fuss-titel">Werbehinweis &amp; Transparenz</p>
            <p>
              Einige Links auf dieser Seite sind Partnerlinks. Eröffnest du darüber ein Konto oder Depot, erhält Finanzmuslim eine
              Provision, für dich ändert sich am Preis nichts. Die Empfehlung beruht auf deinen Antworten und eigenen Tests, nicht auf
              der Höhe der Provision. Sie ist keine Anlageberatung, und Investitionen bergen das Risiko von Verlusten.
            </p>
          </div>
          <p className="hv-fuss-links">
            <Link to="/impressum">Impressum</Link>
            <Link to="/datenschutz">Datenschutz</Link>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CheckVerkaufsseite;
