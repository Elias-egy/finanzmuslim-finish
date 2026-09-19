import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, ChevronDown, ChevronRight, RotateCcw } from "lucide-react";
import Seo from "@/components/Seo";
import { AnbieterLogo } from "@/components/AnbieterLogo";
import { auswahlAus, ziele, type Antworten, type Frage, type Ziel } from "@/data/vergleichAssistent";
import { werteAus, type Prioritaet, type Treffer } from "@/lib/vergleichAssistent";

/**
 * Geführter Vergleich: erst das Ziel, dann eine Frage je Bildschirm, dann das
 * Ergebnis. Gerechnet wird in `src/lib/vergleichAssistent.ts`, die Fragen stehen
 * in `src/data/vergleichAssistent.ts`. Nichts davon verlässt den Browser.
 */

type FragenZiel = Extract<Ziel, { art: "fragen" }>;
type Stand = { zielId: string | null; schritt: number; antworten: Antworten; vertiefen: boolean };

const LEER: Stand = { zielId: null, schritt: 0, antworten: {}, vertiefen: false };
const SPEICHER = "fm-vergleich-start";

const lade = (): Stand => {
  try {
    const roh = sessionStorage.getItem(SPEICHER);
    return roh ? { ...LEER, ...(JSON.parse(roh) as Stand) } : LEER;
  } catch {
    return LEER;
  }
};

const knopf =
  "flex min-h-[52px] w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 text-[16px] font-semibold text-primary-foreground transition-colors hover:bg-primary-hover";
const knopfLeise =
  "flex min-h-[52px] w-full items-center justify-center gap-2 rounded-lg border border-border bg-card px-5 text-[16px] font-semibold text-foreground transition-colors hover:border-primary";

/* ------------------------------------------------------------ Antwortkarte */

const Karte = ({
  titel,
  unter,
  aktiv,
  mehrfach,
  onClick,
  icon,
}: {
  titel: string;
  unter?: string;
  aktiv?: boolean;
  mehrfach?: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={aktiv}
    className={`flex min-h-[64px] w-full items-center gap-3 rounded-2xl border bg-card px-4 py-3 text-left transition-colors ${
      aktiv ? "border-primary ring-1 ring-primary" : "border-border hover:border-primary"
    }`}
  >
    {icon}
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

const wertText = (w: unknown) => (typeof w === "boolean" ? (w ? "ja" : "nein") : typeof w === "string" && w.trim() ? w : "noch nicht geprüft");

const TrefferKarte = ({ t, ziel, prio, vorn }: { t: Treffer; ziel: FragenZiel; prio?: Prioritaet; vorn?: boolean }) => {
  const a = t.anbieter;
  const fakten = (prio?.fakten ?? []).map((k) => ({ label: ziel.zeilen.find((z) => z.key === k)?.label ?? k, wert: wertText(a.werte[k]) }));
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

      {(t.erfuellt.length > 0 || t.ungeprueft.length > 0) && (
        <ul className="mt-3 space-y-1.5">
          {t.erfuellt.map((w) => (
            <li key={w.id} className="flex items-start gap-2 text-[15px] text-foreground">
              <Check className="mt-0.5 h-[18px] w-[18px] shrink-0 text-primary" aria-hidden />
              {w.label}
            </li>
          ))}
          {t.ungeprueft.map((w) => (
            <li key={w.id} className="flex items-start gap-2 text-[15px] text-muted-foreground">
              <span className="mt-[9px] h-1.5 w-[18px] shrink-0 rounded-full bg-muted-foreground/40" aria-hidden />
              {w.label}: noch nicht geprüft
            </li>
          ))}
        </ul>
      )}

      {fakten.length > 0 && (
        <dl className="mt-3 grid grid-cols-1 gap-x-4 gap-y-1 rounded-xl bg-hero px-3 py-2.5 text-[14px] sm:grid-cols-2">
          {fakten.map((f) => (
            <div key={f.label} className="flex justify-between gap-3 sm:block">
              <dt className="text-muted-foreground">{f.label}</dt>
              <dd className="text-right font-semibold text-foreground sm:text-left">{f.wert}</dd>
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
          <Link to={ziel.vergleich} className={knopfLeise}>
            Im Vergleich ansehen
          </Link>
        )}
      </div>
    </li>
  );
};

const Ergebnis = ({ ziel, antworten, neu, zurueck }: { ziel: FragenZiel; antworten: Antworten; neu: () => void; zurueck: () => void }) => {
  const auswahl = useMemo(() => auswahlAus(ziel.fragen, antworten), [ziel, antworten]);
  const e = useMemo(() => werteAus(ziel.anbieter, ziel.id, ziel.finanzMax, auswahl), [ziel, auswahl]);
  const [sichtbar, setSichtbar] = useState(5);
  const [offenAuf, setOffenAuf] = useState(false);
  const mitStern = [...e.passt.slice(0, sichtbar), ...(offenAuf ? e.ungeprueft : [])].some((t) => t.anbieter.link);

  return (
    <div>
      <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-primary">Dein Ergebnis</p>
      <h1 className="mt-1 text-[26px] font-bold leading-tight text-foreground md:text-[34px]">
        {e.passt.length > 0 ? `${e.passt.length} Anbieter passen zu dir` : "Noch kein sicherer Treffer"}
      </h1>
      <p className="mt-2 text-[15px] text-muted-foreground">
        {e.passt.length === 0
          ? "Kein Anbieter erfüllt alle deine Angaben nachweislich. Unten stehen die, bei denen die Prüfung noch läuft."
          : e.gerankt
            ? "Sortiert nach deinen Angaben. Partnerschaften zählen dabei nicht."
            : auswahl.prioritaet
              ? `Sortiert nach deiner Angabe: ${auswahl.prioritaet.label}. Partnerschaften zählen dabei nicht.`
              : "Alphabetisch sortiert. Partnerschaften zählen dabei nicht."}
      </p>

      <ul className="mt-5 space-y-3">
        {e.passt.slice(0, sichtbar).map((t, i) => (
          <TrefferKarte key={t.anbieter.id} t={t} ziel={ziel} prio={auswahl.prioritaet} vorn={e.gerankt && i === 0} />
        ))}
      </ul>
      {e.passt.length > sichtbar && (
        <button type="button" onClick={() => setSichtbar((n) => n + 10)} className={`${knopfLeise} mt-3`}>
          Mehr anzeigen ({e.passt.length - sichtbar})
        </button>
      )}

      {e.ungeprueft.length > 0 && (
        <section className="mt-6 rounded-2xl border border-border bg-card">
          <button
            type="button"
            onClick={() => setOffenAuf((o) => !o)}
            aria-expanded={offenAuf}
            className="flex min-h-[56px] w-full items-center justify-between gap-3 px-4 text-left text-[15px] font-semibold text-foreground"
          >
            {e.ungeprueft.length} weitere sind noch nicht geprüft
            <ChevronDown className={`h-5 w-5 shrink-0 transition-transform ${offenAuf ? "rotate-180" : ""}`} aria-hidden />
          </button>
          {offenAuf && (
            <div className="border-t border-border p-3">
              <p className="px-1 pb-3 text-[14px] text-muted-foreground">
                Bei diesen Anbietern fehlt uns noch ein Nachweis. Sie können passen, wir wissen es nur noch nicht.
              </p>
              <ul className="space-y-3">
                {e.ungeprueft.map((t) => (
                  <TrefferKarte key={t.anbieter.id} t={t} ziel={ziel} />
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {e.raus > 0 && (
        <p className="mt-4 text-[14px] text-muted-foreground">
          {e.raus} Anbieter fehlen hier: Ihre Zinsen lassen sich nicht abschalten, oder sie erfüllen eine deiner Angaben nicht.
        </p>
      )}

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Link to={ziel.vergleich} className={knopf}>
          Alle Anbieter vergleichen
        </Link>
        <button type="button" onClick={neu} className={knopfLeise}>
          <RotateCcw className="h-[18px] w-[18px]" aria-hidden />
          Neu starten
        </button>
      </div>
      <button type="button" onClick={zurueck} className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 text-[15px] font-semibold text-primary">
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Antworten ändern
      </button>

      {mitStern && (
        <p className="mt-4 text-[13px] text-muted-foreground">
          * Mit Stern markierte Links sind Werbe- oder Affiliate-Links. Wenn du darüber ein Produkt abschließt, erhalte ich eine
          Provision. Für dich entstehen dadurch keine Mehrkosten.
        </p>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------- Seite */

const VergleichAssistent = () => {
  const navigate = useNavigate();
  const [stand, setStand] = useState<Stand>(lade);
  const ziel = ziele.find((z) => z.id === stand.zielId && z.art === "fragen") as FragenZiel | undefined;

  useEffect(() => {
    try {
      sessionStorage.setItem(SPEICHER, JSON.stringify(stand));
    } catch {
      /* Privater Modus ohne Speicher: der Ablauf geht trotzdem. */
    }
    window.scrollTo({ top: 0 });
  }, [stand.zielId, stand.schritt]); // eslint-disable-line react-hooks/exhaustive-deps

  const kern = ziel?.fragen.filter((f) => !f.vertiefung) ?? [];
  const tiefe = ziel?.fragen.filter((f) => f.vertiefung) ?? [];
  const fragen: Frage[] = stand.vertiefen ? [...kern, ...tiefe] : kern;
  /* Schritte: 0..kern-1 Kernfragen, dann (falls vorhanden) die Zwischenfrage, dann Vertiefung, dann Ergebnis. */
  const zwischen = tiefe.length > 0 && !stand.vertiefen && stand.schritt === kern.length;
  const fertig = !!ziel && !zwischen && stand.schritt >= fragen.length;
  const frage = ziel && !zwischen && !fertig ? fragen[stand.schritt] : undefined;

  const zaehler = useMemo(() => {
    if (!ziel) return null;
    const e = werteAus(ziel.anbieter, ziel.id, ziel.finanzMax, auswahlAus(ziel.fragen, stand.antworten));
    return e.passt.length + e.ungeprueft.length;
  }, [ziel, stand.antworten]);

  const weiter = () => setStand((s) => ({ ...s, schritt: s.schritt + 1 }));
  const zurueck = () =>
    setStand((s) => {
      if (s.schritt === 0) return LEER;
      // Vom Ergebnis aus geht es zur letzten Frage, nicht auf Schritt 98.
      const ziel = Math.min(s.schritt, fragen.length) - 1;
      return { ...s, schritt: ziel, vertiefen: s.vertiefen && ziel >= kern.length };
    });
  const zumErgebnis = () => setStand((s) => ({ ...s, schritt: 99 }));
  const neu = () => setStand(LEER);

  const waehle = (f: Frage, id: string) => {
    if (f.mehrfach) {
      setStand((s) => {
        const alt = s.antworten[f.id] ?? [];
        const neuListe = alt.includes(id) ? alt.filter((x) => x !== id) : [...alt, id];
        return { ...s, antworten: { ...s.antworten, [f.id]: neuListe } };
      });
      return;
    }
    setStand((s) => ({ ...s, antworten: { ...s.antworten, [f.id]: [id] }, schritt: s.schritt + 1 }));
  };

  const gesamt = kern.length + (stand.vertiefen ? tiefe.length : 0);
  const anteil = ziel ? Math.min(1, (fertig ? gesamt : stand.schritt) / Math.max(1, gesamt)) : 0;

  return (
    <>
      <Seo
        title="Vergleich starten: finde deinen Anbieter | finanzmuslim"
        description="Beantworte drei kurze Fragen. Du siehst, welche Depots, Girokonten und Krypto-Börsen zu dir passen und sich ohne Zinsen nutzen lassen."
        path="/vergleich/start"
        brotkrumen={[{ name: "Vergleiche", path: "/vergleiche" }, { name: "Vergleich starten", path: "/vergleich/start" }]}
      />
      <div className="container min-h-[72svh] max-w-[680px] py-6 md:py-10">
        {ziel && (
          <div className="mb-6">
            <div className="flex items-center justify-between gap-3 text-[13px] text-muted-foreground">
              <button type="button" onClick={zurueck} className="-ml-2 inline-flex min-h-[44px] items-center gap-1.5 px-2 font-semibold text-foreground">
                <ArrowLeft className="h-4 w-4" aria-hidden />
                Zurück
              </button>
              <span>
                {fertig || zaehler === null ? ziel.titel : `${zaehler} von ${ziel.anbieter.length} passen noch`}
              </span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-border" role="progressbar" aria-valuenow={Math.round(anteil * 100)} aria-valuemin={0} aria-valuemax={100}>
              <div className="h-full rounded-full bg-primary transition-[width] duration-300" style={{ width: `${Math.max(6, anteil * 100)}%` }} />
            </div>
          </div>
        )}

        {!ziel && (
          <div>
            <h1 className="text-[28px] font-bold leading-tight text-foreground md:text-[40px]">Was suchst du?</h1>
            <p className="mt-2 text-[16px] text-muted-foreground">Beantworte drei kurze Fragen. Du siehst, welche Anbieter zu dir passen.</p>
            <div className="mt-5 space-y-3">
              {ziele.map((z) => (
                <Karte
                  key={z.id}
                  titel={z.titel}
                  unter={z.unter}
                  icon={
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <z.icon className="h-[22px] w-[22px] text-primary" aria-hidden />
                    </span>
                  }
                  onClick={() => (z.art === "weiter" ? navigate(z.vergleich) : setStand({ ...LEER, zielId: z.id }))}
                />
              ))}
            </div>
            <Link to="/vergleiche" className="mt-5 inline-flex min-h-[44px] items-center gap-1.5 text-[15px] font-semibold text-primary">
              Alle Vergleiche ansehen
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        )}

        {frage && (
          <div>
            <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-primary">
              Frage {stand.schritt + 1} von {gesamt}
            </p>
            <h1 className="mt-1 text-[26px] font-bold leading-tight text-foreground md:text-[34px]">{frage.titel}</h1>
            {frage.hinweis && <p className="mt-2 text-[15px] text-muted-foreground">{frage.hinweis}</p>}
            <div className="mt-5 space-y-3">
              {frage.antworten.map((a) => (
                <Karte
                  key={a.id}
                  titel={a.titel}
                  unter={a.unter}
                  mehrfach={frage.mehrfach}
                  aktiv={stand.antworten[frage.id]?.includes(a.id)}
                  onClick={() => waehle(frage, a.id)}
                />
              ))}
            </div>
            {frage.mehrfach && (
              <button type="button" onClick={weiter} className={`${knopf} mt-4`}>
                {(stand.antworten[frage.id]?.length ?? 0) > 0 ? "Weiter" : "Ist mir egal, weiter"}
              </button>
            )}
            <div className="mt-3 flex items-center justify-between">
              {!frage.mehrfach ? (
                <button type="button" onClick={weiter} className="min-h-[44px] text-[15px] font-semibold text-muted-foreground hover:text-foreground">
                  Überspringen
                </button>
              ) : (
                <span />
              )}
              <button type="button" onClick={zumErgebnis} className="inline-flex min-h-[44px] items-center gap-1.5 text-[15px] font-semibold text-primary">
                Direkt zum Ergebnis
                <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </div>
        )}

        {ziel && zwischen && (
          <div>
            <h1 className="text-[26px] font-bold leading-tight text-foreground md:text-[34px]">Noch genauer machen?</h1>
            <p className="mt-2 text-[15px] text-muted-foreground">
              {zaehler} Anbieter kommen in Frage. Mit {tiefe.length === 1 ? "einer Frage" : `${tiefe.length} Fragen`} mehr legst du fest, was sicher erfüllt sein muss.
            </p>
            <div className="mt-5 space-y-3">
              <Karte titel={tiefe.length === 1 ? "Ja, eine Frage mehr" : `Ja, ${tiefe.length} Fragen mehr`} onClick={() => setStand((s) => ({ ...s, vertiefen: true }))} />
              <Karte titel="Nein, direkt zum Ergebnis" onClick={zumErgebnis} />
            </div>
          </div>
        )}

        {ziel && fertig && <Ergebnis ziel={ziel} antworten={stand.antworten} neu={neu} zurueck={() => setStand((s) => ({ ...s, schritt: 0, vertiefen: false }))} />}
      </div>
    </>
  );
};

export default VergleichAssistent;
