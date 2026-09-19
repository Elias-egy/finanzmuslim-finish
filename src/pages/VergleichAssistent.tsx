import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, ChevronDown, ChevronRight, RotateCcw } from "lucide-react";
import Seo from "@/components/Seo";
import { AnbieterLogo } from "@/components/AnbieterLogo";
import {
  aktiveFragen,
  auswahlAus,
  bausteine,
  fragen,
  type Antworten,
  type Baustein,
  type Frage,
} from "@/data/vergleichAssistent";
import { werteAus, type Auswahl, type Treffer } from "@/lib/vergleichAssistent";

/**
 * Geführter Vergleich: ein Fragebogen für alles, eine Frage je Bildschirm, am
 * Ende ein Paket aus Bausteinen. Gerechnet wird in `src/lib/vergleichAssistent.ts`,
 * Fragen und Bausteine stehen in `src/data/vergleichAssistent.ts`. Nichts davon
 * verlässt den Browser.
 *
 * Der Ablauf merkt sich die Frage, nicht ihre Nummer. Welche Fragen kommen,
 * hängt von den Antworten ab, eine Nummer würde beim Zurückgehen verrutschen.
 */

type Ort = string | "zwischen" | "ergebnis";
type Stand = { ort: Ort; antworten: Antworten; vertiefen: boolean };

const START: Stand = { ort: fragen[0].id, antworten: {}, vertiefen: false };
const SPEICHER = "fm-vergleich-start-2";

const lade = (): Stand => {
  try {
    const roh = sessionStorage.getItem(SPEICHER);
    const stand = roh ? ({ ...START, ...JSON.parse(roh) } as Stand) : START;
    const bekannt = stand.ort === "zwischen" || stand.ort === "ergebnis" || fragen.some((f) => f.id === stand.ort);
    return bekannt ? stand : START;
  } catch {
    return START;
  }
};

/* ------------------------------------------------------------- Wegfindung */

const kern = (a: Antworten) => aktiveFragen(a, false);
const tiefe = (a: Antworten) => aktiveFragen(a, true).filter((f) => f.vertiefung);

const nach = (s: Stand, antworten: Antworten): Ort => {
  const liste = s.vertiefen ? [...kern(antworten), ...tiefe(antworten)] : kern(antworten);
  const hier = fragen.findIndex((f) => f.id === s.ort);
  const naechste = liste.find((f) => fragen.indexOf(f) > hier);
  if (naechste) return naechste.id;
  return !s.vertiefen && tiefe(antworten).length > 0 ? "zwischen" : "ergebnis";
};

const vor = (s: Stand): Stand => {
  const k = kern(s.antworten);
  const t = tiefe(s.antworten);
  if (s.ort === "zwischen") return { ...s, ort: k[k.length - 1].id };
  if (s.ort === "ergebnis") {
    if (s.vertiefen && t.length > 0) return { ...s, ort: t[t.length - 1].id };
    return t.length > 0 ? { ...s, ort: "zwischen" } : { ...s, ort: k[k.length - 1].id };
  }
  const liste = [...k, ...(s.vertiefen ? t : [])];
  const i = liste.findIndex((f) => f.id === s.ort);
  if (i <= 0) return s;
  const ziel = liste[i - 1];
  // Aus der ersten Vertiefungsfrage zurück heißt: zurück zur Wahl, ob vertieft wird.
  if (liste[i].vertiefung && !ziel.vertiefung) return { ...s, ort: "zwischen", vertiefen: false };
  return { ...s, ort: ziel.id };
};

const knopf =
  "flex min-h-[52px] w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 text-[16px] font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground";
const knopfLeise =
  "flex min-h-[52px] w-full items-center justify-center gap-2 rounded-lg border border-border bg-card px-5 text-[16px] font-semibold text-foreground transition-colors hover:border-primary";

/* ------------------------------------------------------------ Antwortkarte */

const Karte = ({
  titel,
  unter,
  aktiv,
  mehrfach,
  onClick,
}: {
  titel: string;
  unter?: string;
  aktiv?: boolean;
  mehrfach?: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={aktiv}
    className={`flex min-h-[64px] w-full items-center gap-3 rounded-2xl border bg-card px-4 py-3 text-left transition-colors ${
      aktiv ? "border-primary ring-1 ring-primary" : "border-border hover:border-primary"
    }`}
  >
    <span className="min-w-0 flex-1">
      <span className="block text-[16px] font-semibold leading-snug text-foreground">{titel}</span>
      {unter && <span className="mt-0.5 block text-[14px] leading-snug text-muted-foreground">{unter}</span>}
    </span>
    {mehrfach ? (
      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border ${
          aktiv ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"
        }`}
        aria-hidden
      >
        {aktiv && <Check className="h-4 w-4" />}
      </span>
    ) : (
      <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
    )}
  </button>
);

/* ---------------------------------------------------------------- Ergebnis */

const wertText = (w: unknown) =>
  typeof w === "boolean" ? (w ? "ja" : "nein") : typeof w === "string" && w.trim() ? w : "noch nicht geprüft";

const TrefferKarte = ({ t, baustein, auswahl, vorn }: { t: Treffer; baustein: Baustein; auswahl: Auswahl; vorn?: boolean }) => {
  const a = t.anbieter;
  const fakten = (auswahl.prioritaet?.fakten ?? baustein.fakten).map((k) => ({
    label: baustein.zeilen.find((z) => z.key === k)?.label ?? k,
    wert: wertText(a.werte[k]),
  }));
  const passt = [...t.gruende, ...t.erfuellt.filter((w) => !w.still).map((w) => w.label)];

  return (
    <li className={`rounded-2xl border bg-card p-4 ${vorn ? "border-primary ring-1 ring-primary" : "border-border"}`}>
      {vorn && <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.08em] text-primary">Passt am besten zu deinen Angaben</p>}
      <div className="flex items-center gap-3">
        <AnbieterLogo name={a.name} domain={a.domain} gross />
        <p className="min-w-0 flex-1 text-[17px] leading-snug text-foreground">
          <span className="font-bold">{a.name}</span> {a.produkt}
        </p>
        {t.note && (
          <p className="shrink-0 text-right">
            <span className="block text-[20px] font-bold leading-none text-foreground">{t.note.gesamt.toFixed(1).replace(".", ",")}</span>
            <span className="text-[11px] text-muted-foreground">von 5</span>
          </p>
        )}
      </div>

      {(passt.length > 0 || t.ungeprueft.length > 0) && (
        <>
          {passt.length > 0 && <p className="mt-3 text-[13px] font-semibold text-muted-foreground">Warum das zu dir passt</p>}
          <ul className="mt-1.5 space-y-1.5">
            {passt.map((satz) => (
              <li key={satz} className="flex items-start gap-2 text-[15px] leading-snug text-foreground">
                <Check className="mt-0.5 h-[18px] w-[18px] shrink-0 text-primary" aria-hidden />
                {satz}
              </li>
            ))}
            {t.ungeprueft.map((w) => (
              <li key={w.id} className="flex items-start gap-2 text-[15px] leading-snug text-muted-foreground">
                <span className="mt-[9px] h-1.5 w-[18px] shrink-0 rounded-full bg-muted-foreground/40" aria-hidden />
                {w.label}: noch nicht geprüft
              </li>
            ))}
          </ul>
        </>
      )}

      {fakten.length > 0 && (
        <dl className="mt-3 space-y-1 rounded-xl bg-hero px-3 py-2.5 text-[14px]">
          {fakten.map((f) => (
            <div key={f.label} className="flex justify-between gap-3">
              <dt className="shrink-0 text-muted-foreground">{f.label}</dt>
              <dd className="text-right font-semibold text-foreground">{f.wert}</dd>
            </div>
          ))}
        </dl>
      )}

      {t.zinsenAbschalten && (
        <p className="mt-3 flex items-start gap-2 text-[14px] text-foreground">
          <span className="mt-[7px] h-2 w-2 shrink-0 rounded-full bg-warning" aria-hidden />
          Zinsen laufen ab Start. Du musst sie selbst abschalten.
        </p>
      )}

      <div className="mt-4">
        {a.link ? (
          <>
            <Link to={a.link} rel="sponsored nofollow" className={knopf}>
              Einrichtung ansehen*
            </Link>
            <p className="mt-1 text-center text-[11px] text-muted-foreground">Anzeige</p>
          </>
        ) : (
          <Link to={baustein.vergleich} className={knopfLeise}>
            Im Vergleich ansehen
          </Link>
        )}
      </div>
    </li>
  );
};

/** So viele Anbieter stehen je Baustein zuerst da. */
const OBEN = 3;

const BausteinAbschnitt = ({ baustein, antworten, nummer }: { baustein: Baustein; antworten: Antworten; nummer: number }) => {
  const auswahl = useMemo(() => auswahlAus(baustein.id, antworten), [baustein, antworten]);
  const e = useMemo(() => werteAus(baustein.anbieter, baustein.kategorie, baustein.finanzMax, auswahl), [baustein, auswahl]);
  const [sichtbar, setSichtbar] = useState(OBEN);
  const [offenAuf, setOffenAuf] = useState(false);

  const sortiert = e.gerankt
    ? "Sortiert nach deinen Angaben."
    : auswahl.prioritaet
      ? `Sortiert nach deiner Angabe: ${auswahl.prioritaet.label}.`
      : baustein.kategorie
        ? "Alphabetisch sortiert."
        : null;

  return (
    <section className="mt-8 first:mt-6">
      <div className="flex items-start gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-[15px] font-bold text-primary-foreground">{nummer}</span>
        <div className="min-w-0">
          <h2 className="text-[21px] font-bold leading-tight text-foreground">{baustein.titel}</h2>
          <p className="mt-1 text-[15px] leading-snug text-muted-foreground">{baustein.wozu}</p>
        </div>
      </div>

      {e.passt.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-border bg-card p-4 text-[15px] text-muted-foreground">
          Kein Anbieter erfüllt alle deine Angaben nachweislich. Darunter stehen die, bei denen die Prüfung noch läuft.
        </p>
      ) : (
        <>
          <p className="mt-3 text-[14px] text-muted-foreground">
            {[`${e.passt.length} passen zu dir.`, sortiert, "Partnerschaften zählen dabei nicht."].filter(Boolean).join(" ")}
          </p>
          <ul className="mt-3 space-y-3">
            {e.passt.slice(0, sichtbar).map((t, i) => (
              <TrefferKarte key={t.anbieter.id} t={t} baustein={baustein} auswahl={auswahl} vorn={e.gerankt && i === 0} />
            ))}
          </ul>
        </>
      )}

      {e.passt.length > sichtbar && (
        <button type="button" onClick={() => setSichtbar((n) => n + 5)} className={`${knopfLeise} mt-3`}>
          Mehr anzeigen ({e.passt.length - sichtbar})
        </button>
      )}

      {e.ungeprueft.length > 0 && (
        <div className="mt-3 rounded-2xl border border-border bg-card">
          <button
            type="button"
            onClick={() => setOffenAuf((o) => !o)}
            aria-expanded={offenAuf}
            className="flex min-h-[52px] w-full items-center justify-between gap-3 px-4 text-left text-[15px] font-semibold text-foreground"
          >
            {e.ungeprueft.length} weitere sind noch nicht geprüft
            <ChevronDown className={`h-5 w-5 shrink-0 transition-transform ${offenAuf ? "rotate-180" : ""}`} aria-hidden />
          </button>
          {offenAuf && (
            <div className="border-t border-border p-3">
              <p className="px-1 pb-3 text-[14px] text-muted-foreground">
                Hier fehlt uns noch ein Nachweis. Sie können passen, wir wissen es nur noch nicht.
              </p>
              <ul className="space-y-3">
                {e.ungeprueft.map((t) => (
                  <TrefferKarte key={t.anbieter.id} t={t} baustein={baustein} auswahl={auswahl} />
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <Link to={baustein.vergleich} className="mt-3 inline-flex min-h-[44px] items-center gap-1.5 text-[15px] font-semibold text-primary">
        {baustein.vergleichText}
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </section>
  );
};

const Ergebnis = ({ antworten, neu, aendern }: { antworten: Antworten; neu: () => void; aendern: () => void }) => {
  const paket = bausteine.filter((b) => b.aktiv(antworten));
  const mitDepot = paket.some((b) => b.id === "depot");
  const mitStern = paket.some((b) => b.anbieter.some((a) => a.link));

  return (
    <div>
      <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-primary">Dein Ergebnis</p>
      <h1 className="mt-1 text-[26px] font-bold leading-tight text-foreground md:text-[34px]">
        {paket.length > 1 ? `Dein Paket aus ${paket.length} Bausteinen` : "Das passt zu dir"}
      </h1>
      {paket.length > 1 && (
        <p className="mt-2 text-[15px] text-muted-foreground">{paket.map((b) => b.titel.replace(/^Deine? /, "")).join(" · ")}</p>
      )}

      {paket.map((b, i) => (
        <BausteinAbschnitt key={b.id} baustein={b} antworten={antworten} nummer={i + 1} />
      ))}

      {mitDepot && (
        <section className="mt-8 rounded-2xl bg-hero p-5">
          <h2 className="text-[18px] font-bold text-foreground">Und danach</h2>
          <div className="mt-3 space-y-2">
            {[
              { to: "/halal-anlagen", text: "Sieh, welche Anlagen geprüft sind" },
              { to: "/halal-guide", text: "Hol dir den Guide für die ersten Schritte" },
            ].map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="flex min-h-[52px] items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 text-[15px] font-semibold text-foreground transition-colors hover:border-primary"
              >
                {l.text}
                <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <button type="button" onClick={aendern} className={knopfLeise}>
          <ArrowLeft className="h-[18px] w-[18px]" aria-hidden />
          Antworten ändern
        </button>
        <button type="button" onClick={neu} className={knopfLeise}>
          <RotateCcw className="h-[18px] w-[18px]" aria-hidden />
          Neu starten
        </button>
      </div>

      <p className="mt-5 text-[13px] leading-relaxed text-muted-foreground">
        Das ist ein Vergleich von Anbietern nach deinen Angaben und keine Anlageberatung.
        {mitStern &&
          " * Mit Stern markierte Links sind Werbe- oder Affiliate-Links. Wenn du darüber ein Produkt abschließt, erhalte ich eine Provision. Für dich entstehen dadurch keine Mehrkosten."}
      </p>
    </div>
  );
};

/* ------------------------------------------------------------------- Seite */

const VergleichAssistent = () => {
  const [stand, setStand] = useState<Stand>(lade);
  const { ort, antworten, vertiefen } = stand;

  useEffect(() => {
    try {
      sessionStorage.setItem(SPEICHER, JSON.stringify(stand));
    } catch {
      /* Privater Modus ohne Speicher: der Ablauf geht trotzdem. */
    }
  }, [stand]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [ort]);

  const frage: Frage | undefined = fragen.find((f) => f.id === ort);
  const liste = [...kern(antworten), ...(vertiefen ? tiefe(antworten) : [])];
  const stelle = frage ? liste.findIndex((f) => f.id === frage.id) : liste.length;
  const anteil = ort === "ergebnis" ? 1 : Math.min(1, stelle / Math.max(1, liste.length));
  const amAnfang = ort === fragen[0].id;
  const gewaehlt = frage ? (antworten[frage.id] ?? []) : [];
  const offeneTiefe = tiefe(antworten).length;

  const weiter = (neu: Antworten = antworten) => setStand((s) => ({ ...s, antworten: neu, ort: nach(s, neu) }));
  const zurueck = () => setStand(vor);
  const neu = () => setStand(START);

  const waehle = (f: Frage, id: string) => {
    if (f.mehrfach) {
      const alt = antworten[f.id] ?? [];
      const liste = alt.includes(id) ? alt.filter((x) => x !== id) : [...alt, id];
      setStand((s) => ({ ...s, antworten: { ...s.antworten, [f.id]: liste } }));
      return;
    }
    weiter({ ...antworten, [f.id]: [id] });
  };

  return (
    <>
      <Seo
        title="Was passt zu mir? Depot, Konto und mehr finden | finanzmuslim"
        description="Beantworte ein paar einfache Fragen. Du siehst, welches Depot, welches Konto und welche App zu dir passen und sich ohne Zinsen nutzen lassen."
        path="/vergleich/start"
        brotkrumen={[{ name: "Vergleiche", path: "/vergleiche" }, { name: "Was passt zu mir", path: "/vergleich/start" }]}
      />
      <div className="container min-h-[72svh] max-w-[680px] py-6 md:py-10">
        <div className="mb-6">
          <div className="flex min-h-[44px] items-center justify-between gap-3 text-[13px] text-muted-foreground">
            {amAnfang ? (
              <span />
            ) : (
              <button type="button" onClick={zurueck} className="-ml-2 inline-flex min-h-[44px] items-center gap-1.5 px-2 font-semibold text-foreground">
                <ArrowLeft className="h-4 w-4" aria-hidden />
                Zurück
              </button>
            )}
            {frage && !amAnfang && (
              <span>
                Frage {stelle + 1} von {liste.length}
              </span>
            )}
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-border" role="progressbar" aria-valuenow={Math.round(anteil * 100)} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-full rounded-full bg-primary transition-[width] duration-300" style={{ width: `${Math.max(6, anteil * 100)}%` }} />
          </div>
        </div>

        {frage && (
          <div>
            {amAnfang && <p className="mb-2 text-[15px] text-muted-foreground">Ein paar einfache Fragen, dann siehst du, was zu dir passt.</p>}
            <h1 className="text-[26px] font-bold leading-tight text-foreground md:text-[34px]">{frage.titel}</h1>
            {frage.hinweis && <p className="mt-2 text-[15px] text-muted-foreground">{frage.hinweis}</p>}
            <div className="mt-5 space-y-3">
              {frage.antworten.map((a) => (
                <Karte key={a.id} titel={a.titel} unter={a.unter} mehrfach={frage.mehrfach} aktiv={gewaehlt.includes(a.id)} onClick={() => waehle(frage, a.id)} />
              ))}
            </div>
            {frage.mehrfach && (
              <button type="button" onClick={() => weiter()} disabled={gewaehlt.length === 0 && !frage.ohneWahl} className={`${knopf} mt-4`}>
                {gewaehlt.length > 0 || !frage.ohneWahl ? "Weiter" : frage.ohneWahl}
              </button>
            )}
            {!amAnfang && (
              <div className="mt-3 flex items-center justify-between">
                {frage.mehrfach ? (
                  <span />
                ) : (
                  <button type="button" onClick={() => weiter()} className="min-h-[44px] text-[15px] font-semibold text-muted-foreground hover:text-foreground">
                    Überspringen
                  </button>
                )}
                <button type="button" onClick={() => setStand((s) => ({ ...s, ort: "ergebnis" }))} className="inline-flex min-h-[44px] items-center gap-1.5 text-[15px] font-semibold text-primary">
                  Direkt zum Ergebnis
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </button>
              </div>
            )}
            {amAnfang && (
              <Link to="/vergleiche" className="mt-5 inline-flex min-h-[44px] items-center gap-1.5 text-[15px] font-semibold text-primary">
                Lieber selbst vergleichen
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            )}
          </div>
        )}

        {ort === "zwischen" && (
          <div>
            <h1 className="text-[26px] font-bold leading-tight text-foreground md:text-[34px]">Noch genauer machen?</h1>
            <p className="mt-2 text-[15px] text-muted-foreground">
              Mit {offeneTiefe === 1 ? "einer Frage" : `${offeneTiefe} Fragen`} mehr legst du fest, was sicher erfüllt sein muss: kein Kredit, kein Dispo, keine Zinsbindung.
            </p>
            <div className="mt-5 space-y-3">
              <Karte
                titel={offeneTiefe === 1 ? "Ja, eine Frage mehr" : `Ja, ${offeneTiefe} Fragen mehr`}
                onClick={() => setStand((s) => ({ ...s, vertiefen: true, ort: tiefe(s.antworten)[0].id }))}
              />
              <Karte titel="Nein, direkt zum Ergebnis" onClick={() => setStand((s) => ({ ...s, ort: "ergebnis" }))} />
            </div>
          </div>
        )}

        {ort === "ergebnis" && <Ergebnis antworten={antworten} neu={neu} aendern={() => setStand((s) => ({ ...s, ort: fragen[0].id, vertiefen: false }))} />}
      </div>
    </>
  );
};

export default VergleichAssistent;
