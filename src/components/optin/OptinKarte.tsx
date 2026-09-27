import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import eliasPortrait from "@/assets/elias-autor.webp";
import { emailGueltig } from "@/lib/anmeldung";
import { gemerkteQuelle } from "@/lib/attribution";
import { optinAnmelden, optinDaten, type OptinErgebnis, type Stufe } from "@/lib/optin";
import type { OptinFreebie } from "@/data/optin";

/** Was die Danke-Seite über den Router-State bekommt. Nie über die Adresse. */
export type DankeState = { vorname: string; ergebnis: OptinErgebnis; stufe?: Stufe };

const stufen: { key: Stufe; titel: string; text: string }[] = [
  { key: "einsteiger", titel: "Einstieg", text: "Ich starte neu und brauche klare Grundlagen." },
  { key: "fortgeschritten", titel: "Fortgeschritten", text: "Ich kenne die Grundlagen und will Anlagen besser einordnen." },
  { key: "profi", titel: "Profi", text: "Ich investiere schon und will Prüfung und Reinigung vertiefen." },
];

const feld =
  "h-12 w-full rounded-xl border border-border bg-background px-4 text-[16px] text-foreground placeholder:text-muted-foreground/70 transition focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/15";

type Props = {
  freebie: OptinFreebie;
  /** `seite`: eigene Opt-in-Seite mit Kopf und H1. `eingebettet`: an der Schnittkante einer Vorlage. */
  variante?: "seite" | "eingebettet";
  /** Ohne eigene Überschrift, wenn die Seite drumherum schon eine hat (z. B. /halal-guide). */
  ohneUeberschrift?: boolean;
};

/**
 * Die Opt-in-Karte (Baustein 29 der Bauanleitung). E-Mail zuerst, dann höchstens eine
 * Klickfrage, und die nur beim Guide, weil dort die Stufe entscheidet, welcher Guide kommt.
 * Die Anfrage geht genau einmal raus. Danach Danke-Seite, der Vorname reist im Router-State.
 */
const OptinKarte = ({ freebie, variante = "eingebettet", ohneUeberschrift = false }: Props) => {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const [schritt, setSchritt] = useState<1 | 2>(1);
  const [vorname, setVorname] = useState("");
  const [email, setEmail] = useState("");
  const [firma, setFirma] = useState("");
  const [sendet, setSendet] = useState(false);
  const [fehler, setFehler] = useState<string | null>(null);

  const absenden = async (stufe?: Stufe) => {
    if (sendet) return;
    setSendet(true);
    setFehler(null);
    try {
      const src = new URLSearchParams(search).get("src") ?? gemerkteQuelle();
      const ergebnis = await optinAnmelden(
        optinDaten({
          email,
          vorname,
          freebie: freebie.id,
          level: stufe,
          pfad: pathname,
          src,
          lang: document.documentElement.lang,
          firma,
        }),
      );
      const state: DankeState = { vorname: vorname.trim(), ergebnis, stufe };
      navigate(`/danke/${freebie.id}`, { state });
    } catch {
      setFehler("Das hat gerade nicht geklappt. Versuch es gleich noch einmal oder schreib an elias@finanzmuslim.com.");
      setSendet(false);
    }
  };

  const weiter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailGueltig(email)) {
      setFehler("Bitte gib eine gültige E-Mail-Adresse ein.");
      return;
    }
    setFehler(null);
    if (freebie.mitStufe) setSchritt(2);
    else void absenden();
  };

  const Ueberschrift = variante === "seite" ? "h1" : "h2";

  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-primary/15 bg-card p-6 text-left shadow-[0_24px_60px_-32px_hsl(var(--primary)/0.55)] sm:p-8">
      {/* Glanz: ein feiner Farbverlauf an der Oberkante, sonst bleibt die Karte ruhig. */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-[hsl(var(--violet))] to-primary"
      />

      {variante === "seite" && (
        <div className="mb-5 flex items-center gap-3">
          <span className="h-11 w-11 shrink-0 overflow-hidden rounded-full bg-[#EFE7DC]">
            <img src={eliasPortrait} alt="" className="h-full w-full object-cover" />
          </span>
          <span className="leading-tight">
            <span className="block text-[15px] font-bold text-foreground">Elias El-Gendy</span>
            <span className="block text-[13px] text-muted-foreground">finanzmuslim</span>
          </span>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <span className="badge-new">Gratis</span>
        {freebie.mitStufe && (
          <span className="text-[12px] font-semibold text-muted-foreground">Schritt {schritt} von 2</span>
        )}
      </div>
      {freebie.mitStufe && (
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-accent" aria-hidden>
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-300"
            style={{ width: schritt === 1 ? "50%" : "100%" }}
          />
        </div>
      )}

      {schritt === 1 ? (
        <>
          {!ohneUeberschrift && (
            <>
              <Ueberschrift className="mt-4 text-[26px] font-bold leading-[1.15] tracking-tight text-foreground sm:text-[30px]">
                {freebie.ueberschrift[0]} <span className="text-primary">{freebie.ueberschrift[1]}</span>
              </Ueberschrift>
              <p className="mt-3 text-[16px] leading-relaxed text-foreground/75">{freebie.nutzen}</p>
            </>
          )}

          <form onSubmit={weiter} noValidate className="mt-5 flex flex-col gap-3">
            <input
              type="text"
              name="vorname"
              autoComplete="given-name"
              placeholder="Vorname (freiwillig)"
              aria-label="Vorname, freiwillig"
              value={vorname}
              onChange={(e) => setVorname(e.target.value)}
              className={feld}
            />
            <input
              type="email"
              name="email"
              autoComplete="email"
              inputMode="email"
              placeholder="E-Mail-Adresse"
              aria-label="E-Mail-Adresse"
              required
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
            {fehler && (
              <p role="alert" className="text-[14px] leading-relaxed text-destructive">
                {fehler}
              </p>
            )}
            <button type="submit" disabled={sendet} className="btn-spark mt-1 sm:w-full disabled:opacity-60">
              {sendet ? "Wird gesendet …" : freebie.knopf}
              {!sendet && <ArrowRight className="h-5 w-5" aria-hidden />}
            </button>
            {freebie.mitStufe && (
              <p className="text-center text-[13px] text-muted-foreground">Als Nächstes: eine kurze Frage</p>
            )}
          </form>

          <p className="mt-4 text-[12px] leading-relaxed text-muted-foreground">
            Du bekommst {freebie.objekt} und jeden Freitag meinen Freitagsbrief mit Tipps und Empfehlungen.
            Abmelden geht mit einem Klick. Hinweise zur Erfolgsmessung und zum Widerruf:{" "}
            <Link to="/datenschutz" className="text-primary underline underline-offset-2">
              Datenschutz
            </Link>
          </p>
        </>
      ) : (
        <div className="mt-4">
          <p className="text-[22px] font-bold leading-tight text-foreground">Wo stehst du beim halal Investieren?</p>
          <p className="mt-2 text-[15px] text-muted-foreground">Danach weißt du, welcher Guide zu dir passt.</p>
          <div className="mt-5 flex flex-col gap-3">
            {stufen.map((s) => (
              <button
                key={s.key}
                type="button"
                disabled={sendet}
                onClick={() => void absenden(s.key)}
                className="min-h-[64px] rounded-xl border border-border bg-background p-4 text-left transition-colors hover:border-primary hover:bg-accent disabled:opacity-60"
              >
                <span className="block text-[16px] font-semibold text-foreground">{s.titel}</span>
                <span className="mt-0.5 block text-[14px] leading-relaxed text-muted-foreground">{s.text}</span>
              </button>
            ))}
          </div>
          {fehler && (
            <p role="alert" className="mt-3 text-[14px] leading-relaxed text-destructive">
              {fehler}
            </p>
          )}
          <div className="mt-4 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setSchritt(1)}
              className="min-h-[44px] text-[14px] text-muted-foreground underline underline-offset-2 hover:text-foreground"
            >
              Zurück
            </button>
            <button
              type="button"
              disabled={sendet}
              onClick={() => void absenden("einsteiger")}
              className="min-h-[44px] text-[14px] font-semibold text-primary hover:underline disabled:opacity-60"
            >
              {sendet ? "Wird gesendet …" : "Überspringen"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptinKarte;
