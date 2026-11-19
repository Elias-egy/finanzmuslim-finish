import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ereignis } from "@/lib/messung";
import { ANDERES_DEPOT, DEPOT_AUSWAHL, NUR_GIROKONTO, TEXT, pruefeBewerbung } from "@/lib/osBewerbung";

/**
 * Kleine Bewerbung für das Halal-Investment-OS (Elias, RN4-01 15.11.2026: „im Anmeldeformular einfach kein Screenshot,
 * sondern hey, wo hast du denn ein Halal-Depot erstellt und welche Anlagen hast du gekauft … wie so eine kleine
 * Bewerbung“). Ersetzt den Screenshot-Upload aus CV28V (13.11.). Felder, Texte und Prüfung in src/lib/osBewerbung.ts,
 * dieselben wie auf der Verkaufsseite public/investment-os/index.html. Knopf „Fertig“ bleibt (CV44P-14: „der
 * Sende-Button heißt dann Fertig“).
 *
 * Der Danke-Schirm folgt dem „Du bist fertig“-Schirm des OS (Entwurf app/style.css .obb-fin: Verlauf #041A4F →
 * #0A3BB0 → #2F74FF, Figtree 800 groß, Newsreader kursiv, Bogen unten, weißer runder Knopf).
 *
 * Versand: Noch ohne Server, bis zum Livegang schickt das Formular nichts weg und zeigt nach „Fertig“ nur den
 * Danke-Schirm. Die Messung meldet wie bisher nur, dass auf dieser Seite eine Bewerbung abgeschickt wurde, nie Depot,
 * Name, Mail, Anlagen oder Bank (Datenschutz-Notiz hermes/renovierungskampagne/os-bewerbung-datenschutz.md im Vault).
 */

const DankeSchirm = ({ schliessen }: { schliessen: () => void }) => {
  const knopf = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    knopf.current?.focus();
    const esc = (e: KeyboardEvent) => e.key === "Escape" && schliessen();
    const alt = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", esc);
    return () => {
      window.removeEventListener("keydown", esc);
      document.body.style.overflow = alt;
    };
  }, [schliessen]);

  return createPortal(
    <div role="dialog" aria-modal="true" aria-labelledby="os-danke-titel" className="os-danke">
      <p className="os-danke-marke">Finanzmuslim</p>
      <div className="os-danke-text">
        <b id="os-danke-titel">{TEXT.dankeTitel}</b>
        <em>{TEXT.dankeText}</em>
      </div>
      <i className="os-danke-bogen" aria-hidden="true" />
      <button ref={knopf} type="button" onClick={schliessen} className="os-danke-knopf">
        {TEXT.dankeKnopf}
      </button>
    </div>,
    document.body,
  );
};

const feld =
  "mt-1.5 h-12 w-full rounded-[6px] border-2 border-border bg-background px-3 text-[17px] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none";
const titel = "block text-[15px] font-semibold";

export const OsAnfrage = ({ anbieter }: { anbieter: string }) => {
  const id = useId();
  const [depot, setDepot] = useState("");
  const [anderesDepot, setAnderesDepot] = useState("");
  const [anlagen, setAnlagen] = useState("");
  const [girokonto, setGirokonto] = useState("");
  const [vorname, setVorname] = useState("");
  const [email, setEmail] = useState("");
  const [einwilligung, setEinwilligung] = useState(false);
  const [firma, setFirma] = useState("");
  const [hinweis, setHinweis] = useState<string | null>(null);
  const [fertig, setFertig] = useState(false);
  const nurGiro = depot === NUR_GIROKONTO;

  const absenden = (e: React.FormEvent) => {
    e.preventDefault();
    const fehlt = pruefeBewerbung({ depot, anderesDepot, anlagen, girokonto, vorname, email, einwilligung });
    if (fehlt) return setHinweis(fehlt);
    setHinweis(null);
    if (firma) return; // Bot
    ereignis("os_anfrage", { anbieter });
    setFertig(true);
  };

  return (
    <>
      <form onSubmit={absenden} noValidate className="mt-3 rounded-[6px] border-2 border-border bg-card p-4 text-left md:p-5">
        <label htmlFor={`${id}-depot`} className={titel}>
          {TEXT.depotFrage}
        </label>
        <select
          id={`${id}-depot`}
          name="depot"
          value={depot}
          onChange={(e) => setDepot(e.target.value)}
          className={`${feld} ${depot ? "" : "text-muted-foreground"}`}
        >
          <option value="" disabled>
            {TEXT.depotLeer}
          </option>
          {DEPOT_AUSWAHL.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
          <option value={ANDERES_DEPOT}>{TEXT.anderesDepot}</option>
          <option value={NUR_GIROKONTO}>{TEXT.nurGirokonto}</option>
        </select>

        {depot === ANDERES_DEPOT && (
          <>
            <label htmlFor={`${id}-anderes`} className={`${titel} mt-4`}>
              {TEXT.anderesFrage}
            </label>
            <input
              id={`${id}-anderes`}
              type="text"
              name="anderesDepot"
              autoComplete="off"
              value={anderesDepot}
              onChange={(e) => setAnderesDepot(e.target.value)}
              className={feld}
            />
          </>
        )}

        {!nurGiro && (
          <>
            <label htmlFor={`${id}-anlagen`} className={`${titel} mt-4`}>
              {TEXT.anlagenFrage}
            </label>
            <input
              id={`${id}-anlagen`}
              type="text"
              name="anlagen"
              autoComplete="off"
              placeholder={TEXT.anlagenBeispiel}
              aria-describedby={`${id}-anlagen-hinweis`}
              value={anlagen}
              onChange={(e) => setAnlagen(e.target.value)}
              className={feld}
            />
            <p id={`${id}-anlagen-hinweis`} className="mt-1 text-[15px] text-foreground">
              {TEXT.anlagenHinweis}
            </p>
          </>
        )}

        <label htmlFor={`${id}-giro`} className={`${titel} mt-4`}>
          {TEXT.giroFrage}
          {!nurGiro && <span className="font-normal"> ({TEXT.giroFreiwillig})</span>}
        </label>
        <input
          id={`${id}-giro`}
          type="text"
          name="girokonto"
          autoComplete="off"
          placeholder={TEXT.giroBeispiel}
          value={girokonto}
          onChange={(e) => setGirokonto(e.target.value)}
          className={feld}
        />

        <label htmlFor={`${id}-vorname`} className={`${titel} mt-4`}>
          {TEXT.vorname}
        </label>
        <input
          id={`${id}-vorname`}
          type="text"
          name="vorname"
          autoComplete="given-name"
          value={vorname}
          onChange={(e) => setVorname(e.target.value)}
          className={feld}
        />

        <label htmlFor={`${id}-mail`} className={`${titel} mt-4`}>
          {TEXT.email}
        </label>
        <input
          id={`${id}-mail`}
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          placeholder="deine@email.de"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={feld}
        />

        <input
          type="text"
          name="firma"
          value={firma}
          onChange={(e) => setFirma(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />

        {/* Ein Häkchen wie bei der Newsletter-Anmeldung, weißes Kästchen (Elias, CV28V-03). Der Text trägt seit RN4-01
            auch die ausdrückliche Einwilligung (Art. 9 DSGVO), offen als Frage an Elias. */}
        <label className="mt-4 flex min-h-[44px] cursor-pointer items-start gap-3 py-1 text-[15px] leading-snug text-foreground">
          <input
            type="checkbox"
            name="einwilligung"
            checked={einwilligung}
            onChange={(e) => setEinwilligung(e.target.checked)}
            className="os-haken mt-0.5 shrink-0"
          />
          <span>
            {TEXT.hakenVor}{" "}
            <Link to="/datenschutz" className="text-primary underline underline-offset-2">
              {TEXT.hakenLink}
            </Link>{" "}
            {TEXT.hakenNach}
          </span>
        </label>

        {hinweis && (
          <p role="alert" className="mt-2 text-[15px] text-destructive">
            {hinweis}
          </p>
        )}

        <button
          type="submit"
          className="mt-4 flex min-h-[56px] w-full items-center justify-center rounded-[6px] bg-primary px-4 text-[18px] font-bold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {TEXT.senden}
        </button>
      </form>
      {fertig && <DankeSchirm schliessen={() => setFertig(false)} />}
    </>
  );
};

/**
 * Der auffällige Knopf „Halal-Investment-OS anfragen“ mit Pfeil, der das Formular aufklappt (Elias, CV28V-02 13.11.2026:
 * „unter dem Video das allererste, was kommt, ist Halal Investment OS anfragen und dann kommt ein Pfeil … ein bisschen
 * offensichtlicher animiert … wie ein Button … wenn du draufklickst, dann öffnet sich halt dieses Formular“; „überall,
 * wo du es anfragen kannst, dass die Anfrage genauso aussieht“). Die OS-Verkaufsseite im Vault baut denselben Knopf
 * nach (verkauf-gegenprobe.html, Klasse os-anfrage-knopf).
 */
export const OsAnfrageKnopf = ({ anbieter }: { anbieter: string }) => {
  const [offen, setOffen] = useState(false);
  return (
    <div>
      <button
        type="button"
        onClick={() => {
          if (!offen) ereignis("fertig_klick", { anbieter });
          setOffen((o) => !o);
        }}
        aria-expanded={offen}
        className="os-anfrage-knopf"
      >
        Halal-Investment-OS anfragen
        <ArrowRight className={`os-anfrage-pfeil h-6 w-6 shrink-0 ${offen ? "offen" : ""}`} aria-hidden />
      </button>
      {offen && <OsAnfrage anbieter={anbieter} />}
    </div>
  );
};

export default OsAnfrage;
