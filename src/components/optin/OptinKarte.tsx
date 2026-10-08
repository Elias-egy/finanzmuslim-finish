import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import eliasPortrait from "@/assets/elias-autor.webp";
import { motive, type MotivName } from "@/components/motive";
import { emailGueltig } from "@/lib/anmeldung";
import { gemerkteQuelle } from "@/lib/attribution";
import { optinAnmelden, optinDaten, optinNachtragen, type Anmeldung, type Stufe, type Vorhaben } from "@/lib/optin";
import type { OptinFreebie } from "@/data/optin";

/** Was die Danke-Seite über den Router-State bekommt. Nie über die Adresse. */
export type DankeState = { vorname: string; stufe?: Stufe; vorhaben?: Vorhaben[] };

export const stufen: { key: Stufe; titel: string; text: string }[] = [
  { key: "einsteiger", titel: "Einstieg", text: "Ich starte neu und brauche klare Grundlagen." },
  { key: "fortgeschritten", titel: "Fortgeschritten", text: "Ich kenne die Grundlagen und will Anlagen besser einordnen." },
  { key: "profi", titel: "Profi", text: "Ich investiere schon und will Prüfung und Reinigung vertiefen." },
];

/** Wortgleich die erste Frage des Vergleichs-Assistenten (Test in `optinKarte.test.ts`). */
export const vorhabenFrage = "Wobei kann ich dir helfen?";
export const vorhabenAntworten: { key: Vorhaben; titel: string; bild: MotivName }[] = [
  { key: "anlegen", titel: "Sparen und anlegen", bild: "wachsen" },
  { key: "konto", titel: "Konto für den Alltag", bild: "karte" },
  { key: "steuer", titel: "Steuererklärung", bild: "steuer" },
];

/**
 * Was diese Seite schon gesendet hat. Nur im Speicher, nie im Browser abgelegt. Auf
 * `/halal-guide` stehen zwei Karten; wer dieselbe Adresse zweimal abschickt, bekäme sonst
 * eine zweite Bestätigungsmail.
 */
const gesendet = new Map<string, Promise<Anmeldung>>();

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
 * Die Opt-in-Karte (Baustein 29 der Bauanleitung), drei Schritte nach GoodMorning
 * (Vault raw 2026-09-26-doomscroll-web/bilder/goodmorning-01): E-Mail zuerst und sofort
 * gespeichert, dann zwei Klickfragen mit „Überspringen“. Die Einwilligung ist ein Häkchen wie
 * bei SKAILE (skaile-danke-04). Danach die Danke-Seite, der Vorname reist im Router-State.
 */
const OptinKarte = ({ freebie, variante = "eingebettet", ohneUeberschrift = false }: Props) => {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const [schritt, setSchritt] = useState<1 | 2 | 3>(1);
  const [vorname, setVorname] = useState("");
  const [email, setEmail] = useState("");
  const [zustimmung, setZustimmung] = useState(false);
  const [firma, setFirma] = useState("");
  const [sendet, setSendet] = useState(false);
  const [fehler, setFehler] = useState<string | null>(null);
  const [anmeldung, setAnmeldung] = useState<Anmeldung | null>(null);
  /** Die Adresse, die wirklich gesendet wurde, eingefroren beim Absenden. */
  const [gespeichert, setGespeichert] = useState("");
  const [stufe, setStufe] = useState<Stufe | undefined>();
  const [vorhaben, setVorhaben] = useState<Vorhaben[]>([]);
  const frage = useRef<HTMLParagraphElement>(null);
  const emailFeld = useRef<HTMLInputElement>(null);
  const zurueck = useRef(false);

  useEffect(() => {
    if (schritt > 1) frage.current?.focus();
    else if (zurueck.current) emailFeld.current?.focus();
  }, [schritt]);

  const nachtragen = (werte: { stufe?: Stufe; vorhaben?: Vorhaben[] }) => {
    if (!anmeldung?.token || !gespeichert) return;
    void optinNachtragen({ abonnent: gespeichert, token: anmeldung.token, freebie: freebie.id, ...werte });
  };

  const absenden = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sendet) return;
    if (!emailGueltig(email)) {
      setFehler("Bitte gib eine gültige E-Mail-Adresse ein.");
      return;
    }
    if (!zustimmung) {
      setFehler(`Setz bitte das Häkchen, dann bekommst du ${freebie.objekt}.`);
      return;
    }
    const adresse = email.trim();
    const schluessel = `${freebie.id}|${adresse.toLowerCase()}`;
    setSendet(true);
    setFehler(null);
    try {
      let laeuft = gesendet.get(schluessel);
      if (!laeuft) {
        const src = new URLSearchParams(search).get("src") ?? gemerkteQuelle();
        laeuft = optinAnmelden(
          optinDaten({ email: adresse, vorname, freebie: freebie.id, pfad: pathname, src, lang: document.documentElement.lang, firma }),
        );
        gesendet.set(schluessel, laeuft);
      }
      setAnmeldung(await laeuft);
      setGespeichert(adresse);
      setSchritt(2);
    } catch {
      gesendet.delete(schluessel);
      setFehler("Das hat gerade nicht geklappt. Versuch es gleich noch einmal oder schreib an elias@finanzmuslim.com.");
    } finally {
      setSendet(false);
    }
  };

  const stufeWaehlen = (s?: Stufe) => {
    setStufe(s);
    if (s) nachtragen({ stufe: s });
    setSchritt(3);
  };

  const fertig = (auswahl: Vorhaben[]) => {
    if (auswahl.length) nachtragen({ stufe, vorhaben: auswahl });
    const state: DankeState = { vorname: vorname.trim(), stufe, vorhaben: auswahl };
    navigate(`/danke/${freebie.id}`, { state });
  };

  const andereAdresse = () => {
    zurueck.current = true;
    setSchritt(1);
    setEmail("");
    setGespeichert("");
    setZustimmung(false);
    setAnmeldung(null);
    setStufe(undefined);
    setVorhaben([]);
  };

  const Ueberschrift = variante === "seite" ? "h1" : "h2";

  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-primary/20 bg-card p-6 text-left shadow-[0_28px_64px_-28px_hsl(var(--primary)/0.6),0_0_44px_-6px_hsl(219_100%_62%/0.28)] sm:p-8">
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
        <span className="text-[12px] font-semibold text-muted-foreground">Schritt {schritt} von 3</span>
      </div>
      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-accent" aria-hidden>
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-300"
          style={{ width: `${(schritt / 3) * 100}%` }}
        />
      </div>

      <div>
        {schritt === 1 && (
          <>
            {!ohneUeberschrift && (
              <>
                <Ueberschrift className="mt-4 text-[26px] font-bold leading-[1.15] tracking-tight text-foreground sm:text-[30px]">
                  {freebie.ueberschrift[0]} <span className="text-primary">{freebie.ueberschrift[1]}</span>
                </Ueberschrift>
                <p className="mt-3 text-[16px] leading-relaxed text-foreground/75">{freebie.nutzen}</p>
              </>
            )}

            <form onSubmit={absenden} noValidate className="mt-5">
              <fieldset disabled={sendet} className="flex flex-col gap-3">
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
                ref={emailFeld}
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
              <label className="flex min-h-[44px] cursor-pointer items-start gap-3 py-1 text-[14px] leading-snug text-foreground/80">
                <input
                  type="checkbox"
                  checked={zustimmung}
                  onChange={(e) => setZustimmung(e.target.checked)}
                  className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-border accent-[hsl(var(--primary))]"
                />
                <span>
                  Ich will {freebie.objekt} und jeden Freitag den Freitagsbrief per Mail. Abmelden geht mit einem
                  Klick.
                </span>
              </label>
              {fehler && (
                <p role="alert" className="text-[14px] leading-relaxed text-destructive">
                  {fehler}
                </p>
              )}
              <button type="submit" disabled={sendet} className="btn-leuchte mt-1 h-[52px] w-full px-6 text-[17px] disabled:opacity-60">
                {sendet ? "Wird gesendet …" : freebie.knopf}
                {!sendet && <ArrowRight className="h-5 w-5" aria-hidden />}
              </button>
              <p className="text-center text-[13px] text-muted-foreground">Als Nächstes: zwei kurze Fragen</p>
              </fieldset>
            </form>

            <p className="mt-4 text-[12px] leading-relaxed text-muted-foreground">
              Hinweise zur Erfolgsmessung und zum Widerruf:{" "}
              <Link to="/datenschutz" className="text-primary underline underline-offset-2">
                Datenschutz
              </Link>
            </p>
          </>
        )}

        {schritt === 2 && (
          <div className="mt-4">
            <p ref={frage} tabIndex={-1} className="text-[22px] font-bold leading-tight text-foreground outline-none">
              Wo stehst du beim Anlegen?
            </p>
            <p className="mt-2 text-[15px] text-muted-foreground">
              {freebie.id === "guide" ? "Wähl deine Stufe, dann kommt der passende Guide." : "Wähl deine Stufe, dann passt der Freitagsbrief besser zu dir."}
            </p>
            <div className="mt-5 flex flex-col gap-3">
              {stufen.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => stufeWaehlen(s.key)}
                  className="min-h-[64px] rounded-xl border border-border bg-background p-4 text-left transition-colors hover:border-primary hover:bg-accent"
                >
                  <span className="block text-[16px] font-semibold text-foreground">{s.titel}</span>
                  <span className="mt-0.5 block text-[14px] leading-relaxed text-muted-foreground">{s.text}</span>
                </button>
              ))}
            </div>
            <Fuss adresse={gespeichert} andereAdresse={andereAdresse} ueberspringen={() => stufeWaehlen(undefined)} />
          </div>
        )}

        {schritt === 3 && (
          <div className="mt-4">
            <p ref={frage} tabIndex={-1} className="text-[22px] font-bold leading-tight text-foreground outline-none">
              {vorhabenFrage}
            </p>
            <p className="mt-2 text-[15px] text-muted-foreground">Mehrere möglich.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {vorhabenAntworten.map((a) => {
                const aktiv = vorhaben.includes(a.key);
                const Motiv = motive[a.bild];
                return (
                  <button
                    key={a.key}
                    type="button"
                    aria-pressed={aktiv}
                    onClick={() => setVorhaben((v) => (aktiv ? v.filter((x) => x !== a.key) : [...v, a.key]))}
                    className={`flex min-h-[64px] items-center gap-3 rounded-xl border p-3 text-left transition-colors sm:flex-col sm:items-start ${
                      aktiv ? "border-primary bg-accent" : "border-border bg-background hover:border-primary"
                    }`}
                  >
                    <span className="block h-12 w-12 shrink-0 overflow-hidden rounded-xl" aria-hidden>
                      <Motiv />
                    </span>
                    <span className="flex-1 text-[16px] font-semibold leading-snug text-foreground">{a.titel}</span>
                    {aktiv && <Check className="h-5 w-5 shrink-0 text-primary sm:hidden" aria-hidden />}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              disabled={!vorhaben.length}
              onClick={() => fertig(vorhaben)}
              className="btn-leuchte mt-5 h-[52px] w-full px-6 text-[17px] disabled:opacity-50"
            >
              Weiter
              <ArrowRight className="h-5 w-5" aria-hidden />
            </button>
            <Fuss adresse={gespeichert} andereAdresse={andereAdresse} ueberspringen={() => fertig([])} />
          </div>
        )}
      </div>
    </div>
  );
};

/** Unter den Fragen: die gespeicherte Adresse statt eines Zurück ins Formular, dazu Überspringen. */
const Fuss = ({ adresse, andereAdresse, ueberspringen }: { adresse: string; andereAdresse: () => void; ueberspringen: () => void }) => (
  <div className="mt-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
    <p className="min-w-0 text-[13px] text-muted-foreground">
      Gespeichert: <span className="break-all">{adresse.trim()}</span>{" "}
      <button type="button" onClick={andereAdresse} className="min-h-[44px] underline underline-offset-2 hover:text-foreground">
        Andere Adresse
      </button>
    </p>
    <button
      type="button"
      onClick={ueberspringen}
      className="min-h-[44px] text-[14px] font-semibold text-primary hover:underline"
    >
      Überspringen
    </button>
  </div>
);

export default OptinKarte;
