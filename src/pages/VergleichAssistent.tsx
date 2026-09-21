import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, ChevronDown, ChevronRight, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";
import Seo from "@/components/Seo";
import { AnbieterLogo } from "@/components/AnbieterLogo";
import { BonusSchild } from "@/components/vergleich/VergleichsBausteine";
import { motive, type MotivName } from "@/components/motive";
import {
  aktiveFragen,
  auswahlAus,
  bausteine,
  fragen,
  type Antworten,
  type Baustein,
  type Frage,
} from "@/data/vergleichAssistent";
import { hoechsterBonus } from "@/data/deals";
import { werteAus, type Auswahl, type Treffer } from "@/lib/vergleichAssistent";

/**
 * Geführter Vergleich: ein Fragebogen für alles, eine Frage je Bildschirm, am
 * Ende ein Paket aus Bausteinen. Gerechnet wird in `src/lib/vergleichAssistent.ts`,
 * Fragen und Bausteine stehen in `src/data/vergleichAssistent.ts`. Nichts davon
 * verlässt den Browser, deshalb braucht es hier auch keine Einwilligung.
 *
 * Der Ablauf merkt sich die Frage, nicht ihre Nummer. Welche Fragen kommen,
 * hängt von den Antworten ab, eine Nummer würde beim Zurückgehen verrutschen.
 *
 * Aufbau nach dem Vorbild KassenKompass (von Elias am 19.09.2026 durchgespielt):
 * oben eine Leiste, die mit jeder Antwort mitläuft, große Antwortkarten mit Bild,
 * Zurück und "Direkt zum Ergebnis" unten, kurze Ladeansicht, Ergebnis mit Konfetti.
 * Die Bilder sind unsere eigenen Motive, nicht deren 3D-Emojis.
 *
 * Halal-Grundlagen werden nicht abgefragt (Elias: "Kein Mensch will Zinsen"). Sie
 * gelten immer und stehen im Rechenkern. Anbieter, bei denen ein gewünschtes
 * Merkmal noch nicht geprüft ist, tauchen hier nicht auf: Vor dem Livegang ist
 * alles geprüft, und bis dahin empfehlen wir nur, was belegt ist.
 */

type Ort = string | "laden" | "ergebnis";
type Stand = { ort: Ort; antworten: Antworten };

const START: Stand = { ort: fragen[0].id, antworten: {} };
const SPEICHER = "fm-vergleich-start-4";

const lade = (): Stand => {
  try {
    const roh = sessionStorage.getItem(SPEICHER);
    const stand = roh ? ({ ...START, ...JSON.parse(roh) } as Stand) : START;
    if (stand.ort === "laden") return { ...stand, ort: "ergebnis" };
    const bekannt = stand.ort === "ergebnis" || fragen.some((f) => f.id === stand.ort);
    return bekannt ? stand : START;
  } catch {
    return START;
  }
};

const ruhig = () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------------------------------------- Wegfindung */

const nach = (s: Stand, antworten: Antworten): Ort => {
  const hier = fragen.findIndex((f) => f.id === s.ort);
  return aktiveFragen(antworten).find((f) => fragen.indexOf(f) > hier)?.id ?? "laden";
};

const vor = (s: Stand): Stand => {
  const liste = aktiveFragen(s.antworten);
  const i = liste.findIndex((f) => f.id === s.ort);
  return i <= 0 ? s : { ...s, ort: liste[i - 1].id };
};

/**
 * Was die Leiste oben zeigt: wie viele Anbieter nach den bisherigen Antworten
 * nachweislich passen, und der höchste belegte Bonus unter ihnen. Solange in
 * `deals.ts` kein Betrag mit Quelle steht, bleibt der Bonus null und die Leiste
 * zeigt die Anzahl. Eine Euro-Zahl ohne Beleg gibt es nicht.
 */
const lage = (antworten: Antworten) => {
  const aktive = bausteine.filter((b) => b.aktiv(antworten));
  const ids = new Set<string>();
  for (const b of aktive.length > 0 ? aktive : bausteine) {
    const e = werteAus(b.anbieter, b.kategorie, b.finanzMax, auswahlAus(b.id, antworten));
    for (const t of e.passt) ids.add(t.anbieter.id);
  }
  return { anzahl: ids.size, bonus: hoechsterBonus(ids, new Date().toISOString().slice(0, 10)) };
};

const knopf =
  "flex min-h-[52px] w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 text-[16px] font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground";
const knopfLeise =
  "flex min-h-[52px] w-full items-center justify-center gap-2 rounded-lg border border-border bg-card px-5 text-[16px] font-semibold text-foreground transition-colors hover:border-primary";

/* ---------------------------------------------------------------- Bauteile */

/** Zahl, die beim Ändern hoch- oder herunterzählt. Ohne Bewegung, wenn der Nutzer das so eingestellt hat. */
const Zaehler = ({ wert }: { wert: number }) => {
  const [zeige, setZeige] = useState(wert);
  const von = useRef(wert);
  useEffect(() => {
    if (ruhig() || von.current === wert) {
      von.current = wert;
      setZeige(wert);
      return;
    }
    const start = von.current;
    const t0 = performance.now();
    let rahmen = 0;
    const schritt = (t: number) => {
      const p = Math.min(1, (t - t0) / 450);
      setZeige(Math.round(start + (wert - start) * (1 - Math.pow(1 - p, 3))));
      if (p < 1) rahmen = requestAnimationFrame(schritt);
      else von.current = wert;
    };
    rahmen = requestAnimationFrame(schritt);
    return () => {
      cancelAnimationFrame(rahmen);
      von.current = wert;
    };
  }, [wert]);
  return <>{zeige}</>;
};

const Bild = ({ name, klein }: { name: MotivName; klein?: boolean }) => {
  const Motiv = motive[name];
  return (
    <span className={`block shrink-0 overflow-hidden rounded-2xl ${klein ? "h-14 w-14" : "h-[72px] w-[72px]"}`} aria-hidden>
      <Motiv />
    </span>
  );
};

const Karte = ({
  titel,
  unter,
  bild,
  aktiv,
  mehrfach,
  breit,
  onClick,
}: {
  titel: string;
  unter?: string;
  bild: MotivName;
  aktiv?: boolean;
  mehrfach?: boolean;
  breit?: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={aktiv}
    className={`relative flex min-h-[132px] flex-col items-center justify-center gap-2 rounded-2xl border px-3 py-4 text-center transition-colors ${
      breit ? "col-span-2" : ""
    } ${aktiv ? "border-primary bg-hero ring-1 ring-primary" : "border-border bg-card hover:border-primary"}`}
  >
    {mehrfach && (
      <span
        className={`absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-md border ${
          aktiv ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"
        }`}
        aria-hidden
      >
        {aktiv && <Check className="h-4 w-4" />}
      </span>
    )}
    <Bild name={bild} />
    <span className="block text-[15px] font-semibold leading-tight text-foreground">{titel}</span>
    {unter && <span className="-mt-1 block text-[13px] leading-snug text-muted-foreground">{unter}</span>}
  </button>
);

const FARBEN = ["#0057FA", "#7D6EF2", "#00A7A5", "#FFBF2F", "#FF6B6B", "#F25FB3", "#52B788", "#0B2B6B"];

/** Großes, bewusst buntes Konfetti von beiden Seiten, einmal beim Ergebnis. Keine Bibliothek. */
const Konfetti = () => {
  const teile = useMemo(
    () =>
      Array.from({ length: 120 }, (_, i) => {
        const links = i % 2 === 0;
        return {
          links,
          farbe: FARBEN[i % FARBEN.length],
          dx: (links ? 1 : -1) * (120 + Math.random() * 680),
          dy: -(240 + Math.random() * 620),
          dreh: (Math.random() - 0.5) * 1200,
          dauer: 2 + Math.random() * 1.5,
          start: Math.random() * 0.35,
          rund: i % 4 === 0,
          breite: 8 + Math.random() * 10,
        };
      }),
    [],
  );
  if (ruhig()) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden>
      <style>{`@keyframes fm-konfetti{0%{transform:translate(0,0) rotate(0) scale(.7);opacity:0}8%{opacity:1}72%{opacity:1}100%{transform:translate(var(--dx),calc(var(--dy) + 860px)) rotate(var(--dreh)) scale(1);opacity:0}}`}</style>
      {teile.map((t, i) => (
        <span
          key={i}
          style={
            {
              position: "absolute",
              bottom: "18%",
              [t.links ? "left" : "right"]: "-20px",
              width: t.breite,
              height: t.rund ? t.breite : t.breite * 0.45,
              borderRadius: t.rund ? "50%" : 3,
              background: t.farbe,
              "--dx": `${t.dx}px`,
              "--dy": `${t.dy}px`,
              "--dreh": `${t.dreh}deg`,
              animation: `fm-konfetti ${t.dauer}s cubic-bezier(.15,.6,.35,1) ${t.start}s both`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
};

/* ---------------------------------------------------------------- Ergebnis */

const wertText = (w: unknown) =>
  typeof w === "boolean" ? (w ? "ja" : "nein") : typeof w === "string" && w.trim() ? w : "noch nicht geprüft";

const Gruende = ({ t }: { t: Treffer }) => {
  const passt = [...t.gruende, ...t.erfuellt.filter((w) => !w.still).map((w) => w.label)].slice(0, 5);
  if (passt.length === 0) return null;
  return (
    <ul className="mt-3 space-y-1.5">
      {passt.map((satz) => (
        <li key={satz} className="flex items-start gap-2 text-[15px] leading-snug text-foreground">
          <Check className="mt-0.5 h-[18px] w-[18px] shrink-0 text-primary" aria-hidden />
          {satz}
        </li>
      ))}
    </ul>
  );
};

const Fakten = ({ t, baustein, auswahl }: { t: Treffer; baustein: Baustein; auswahl: Auswahl }) => (
  <dl className="mt-3 space-y-1 rounded-xl bg-hero px-3 py-2.5 text-[14px]">
    {(auswahl.prioritaet?.fakten ?? baustein.fakten).map((k) => (
      <div key={k} className="flex justify-between gap-3">
        <dt className="shrink-0 text-muted-foreground">{baustein.zeilen.find((z) => z.key === k)?.label ?? k}</dt>
        <dd className="text-right font-semibold text-foreground">{wertText(t.anbieter.werte[k])}</dd>
      </div>
    ))}
  </dl>
);

const Weiter = ({ t, baustein, gross }: { t: Treffer; baustein: Baustein; gross?: boolean }) =>
  t.anbieter.link ? (
    <div>
      <Link to={t.anbieter.link} rel="sponsored nofollow" className={`${knopf} ${gross ? "min-h-[56px] text-[17px]" : ""}`}>
        Einrichtung ansehen*
      </Link>
      <p className="mt-1 text-center text-[11px] text-muted-foreground">Anzeige</p>
      <BonusSchild anbieterId={t.anbieter.id} />
    </div>
  ) : (
    <div>
      <Link to={baustein.vergleich} className={gross ? knopf : knopfLeise}>
        Im Vergleich ansehen
      </Link>
      <BonusSchild anbieterId={t.anbieter.id} />
    </div>
  );

/** Die eine Karte oben: wer am besten zu den Angaben passt. */
const Empfehlung = ({ t, baustein, auswahl }: { t: Treffer; baustein: Baustein; auswahl: Auswahl }) => {
  const [offen, setOffen] = useState(false);
  const a = t.anbieter;
  return (
    <div className="mt-4 overflow-hidden rounded-2xl border-2 border-primary bg-primary shadow-[0_14px_40px_-18px_rgba(0,87,250,0.55)]">
      <p className="px-4 py-2.5 text-center text-[14px] font-semibold text-primary-foreground">
        Empfehlung für {baustein.titel.charAt(0).toLowerCase() + baustein.titel.slice(1)}
      </p>
      <div className="rounded-t-2xl bg-card p-4">
        <div className="flex items-center gap-3">
          <AnbieterLogo name={a.name} domain={a.domain} gross />
          <p className="min-w-0 flex-1 text-[19px] leading-snug text-foreground">
            <span className="font-bold">{a.name}</span> {a.produkt}
          </p>
          {t.note && (
            <p className="shrink-0 text-right">
              <span className="block text-[22px] font-bold leading-none text-foreground">{t.note.gesamt.toFixed(1).replace(".", ",")}</span>
              <span className="text-[11px] text-muted-foreground">von 5</span>
            </p>
          )}
        </div>
        <p className="mt-3 text-[13px] font-semibold text-muted-foreground">Warum das zu dir passt</p>
        <Gruende t={t} />
        {offen && <Fakten t={t} baustein={baustein} auswahl={auswahl} />}
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="sm:order-2">
            <Weiter t={t} baustein={baustein} gross />
          </div>
          <button type="button" onClick={() => setOffen((o) => !o)} aria-expanded={offen} className={`${knopfLeise} sm:order-1`}>
            Details
            <ChevronDown className={`h-5 w-5 transition-transform ${offen ? "rotate-180" : ""}`} aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
};

const TrefferKarte = ({ t, baustein, auswahl }: { t: Treffer; baustein: Baustein; auswahl: Auswahl }) => (
  <li className="rounded-2xl border border-border bg-card p-4">
    <div className="flex items-center gap-3">
      <AnbieterLogo name={t.anbieter.name} domain={t.anbieter.domain} />
      <p className="min-w-0 flex-1 text-[16px] leading-snug text-foreground">
        <span className="font-bold">{t.anbieter.name}</span> {t.anbieter.produkt}
      </p>
    </div>
    <Gruende t={t} />
    <Fakten t={t} baustein={baustein} auswahl={auswahl} />
    <div className="mt-4">
      <Weiter t={t} baustein={baustein} />
    </div>
  </li>
);

const Klappe = ({ titel, children }: { titel: string; children: React.ReactNode }) => {
  const [offen, setOffen] = useState(false);
  return (
    <div className="mt-3 rounded-2xl border border-border bg-card">
      <button
        type="button"
        onClick={() => setOffen((o) => !o)}
        aria-expanded={offen}
        className="flex min-h-[52px] w-full items-center justify-between gap-3 px-4 text-left text-[15px] font-semibold text-foreground"
      >
        {titel}
        <ChevronDown className={`h-5 w-5 shrink-0 transition-transform ${offen ? "rotate-180" : ""}`} aria-hidden />
      </button>
      {offen && <div className="border-t border-border p-3">{children}</div>}
    </div>
  );
};

const BausteinAbschnitt = ({ baustein, antworten, nummer, mehrere }: { baustein: Baustein; antworten: Antworten; nummer: number; mehrere: boolean }) => {
  const auswahl = useMemo(() => auswahlAus(baustein.id, antworten), [baustein, antworten]);
  const e = useMemo(() => werteAus(baustein.anbieter, baustein.kategorie, baustein.finanzMax, auswahl), [baustein, auswahl]);
  const [sichtbar, setSichtbar] = useState(3);
  const [erster, ...weitere] = e.passt;

  return (
    <section className="mt-10 first:mt-6">
      <div className="flex items-start gap-3">
        {mehrere && (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-[15px] font-bold text-primary-foreground">{nummer}</span>
        )}
        <div className="min-w-0">
          <h2 className="text-[21px] font-bold leading-tight text-foreground">{baustein.titel}</h2>
          <p className="mt-1 text-[15px] leading-snug text-muted-foreground">{typeof baustein.wozu === "function" ? baustein.wozu(antworten) : baustein.wozu}</p>
        </div>
      </div>

      {erster ? (
        <Empfehlung t={erster} baustein={baustein} auswahl={auswahl} />
      ) : (
        <p className="mt-4 rounded-2xl border border-border bg-card p-4 text-[15px] text-muted-foreground">
          Noch erfüllt kein Anbieter alle deine Angaben nachweislich. Nimm eine Angabe zurück oder sieh in den ganzen Vergleich.
        </p>
      )}

      {weitere.length > 0 && (
        <Klappe titel={`${weitere.length} weitere passen auch`}>
          <ul className="space-y-3">
            {weitere.slice(0, sichtbar).map((t) => (
              <TrefferKarte key={t.anbieter.id} t={t} baustein={baustein} auswahl={auswahl} />
            ))}
          </ul>
          {weitere.length > sichtbar && (
            <button type="button" onClick={() => setSichtbar((n) => n + 5)} className={`${knopfLeise} mt-3`}>
              Mehr anzeigen ({weitere.length - sichtbar})
            </button>
          )}
        </Klappe>
      )}

      <Link to={baustein.vergleich} className="mt-3 inline-flex min-h-[44px] items-center gap-1.5 text-[15px] font-semibold text-primary">
        {baustein.vergleichText}
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </section>
  );
};

/** Kleiner als eine Empfehlung: folgt aus den Antworten, wurde aber nicht selbst gewählt. */
const Zusatz = ({ baustein, antworten }: { baustein: Baustein; antworten: Antworten }) => {
  const mit = useMemo(() => ({ ...antworten, ...baustein.zusatzAntworten, vorhaben: [...(antworten.vorhaben ?? []), ...(baustein.zusatzAntworten?.vorhaben ?? [])] }), [antworten, baustein]);
  const auswahl = useMemo(() => auswahlAus(baustein.id, mit), [baustein, mit]);
  const e = useMemo(() => werteAus(baustein.anbieter, baustein.kategorie, baustein.finanzMax, auswahl), [baustein, auswahl]);
  if (e.passt.length === 0) return null;
  return (
    <section className="mt-10">
      <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-primary">Passt auch zu dir</p>
      <h2 className="mt-1 text-[19px] font-bold leading-tight text-foreground">{baustein.titel}</h2>
      <p className="mt-1 text-[15px] leading-snug text-muted-foreground">{typeof baustein.wozu === "function" ? baustein.wozu(antworten) : baustein.wozu}</p>
      <ul className="mt-3 space-y-3">
        {e.passt.slice(0, 2).map((t) => (
          <TrefferKarte key={t.anbieter.id} t={t} baustein={baustein} auswahl={auswahl} />
        ))}
      </ul>
      <Link to={baustein.vergleich} className="mt-3 inline-flex min-h-[44px] items-center gap-1.5 text-[15px] font-semibold text-primary">
        {baustein.vergleichText}
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </section>
  );
};

const Ergebnis = ({ antworten, neu, aendern, feier }: { antworten: Antworten; neu: () => void; aendern: () => void; feier: boolean }) => {
  const paket = bausteine.filter((b) => b.aktiv(antworten));
  const zusatz = bausteine.filter((b) => !b.aktiv(antworten) && b.zusatzWenn?.(antworten));
  const mitDepot = paket.some((b) => b.id === "depot");
  const sparen = antworten.dauer?.includes("kurz");
  const mitStern = paket.some((b) => b.anbieter.some((a) => a.link));
  const danach = [
    ...(sparen ? [{ to: "/sparzielrechner", text: "Rechne aus, wann du dein Ziel erreichst" }] : []),
    ...(mitDepot ? [{ to: "/halal-anlagen", text: "Sieh, welche Anlagen geprüft sind" }] : []),
    { to: "/halal-guide", text: "Hol dir den Guide für die ersten Schritte" },
  ];

  return (
    <div>
      {feier && <Konfetti />}
      <div className="relative overflow-hidden rounded-3xl border border-primary/15 bg-[linear-gradient(135deg,#EBF2FF_0%,#F4EFFF_52%,#FFF4D8_100%)] px-5 py-4 text-center shadow-[0_14px_40px_-28px_rgba(0,87,250,0.5)] md:px-8 md:py-5">
        <span className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#F25FB3]/15 blur-2xl" aria-hidden />
        <span className="absolute -bottom-10 -left-6 h-32 w-32 rounded-full bg-[#00A7A5]/15 blur-2xl" aria-hidden />
        <p className="relative mx-auto inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-[13px] font-bold text-[#6D4FD2] shadow-sm">
          <Sparkles className="h-4 w-4" aria-hidden />
          Geschafft
        </p>
        <h1 className="relative mt-2 text-[22px] font-bold leading-tight text-foreground md:text-[28px]">{paket.length > 1 ? "Dein Paket steht" : "Das passt zu dir"}</h1>
        <p className="relative mt-1 text-[14px] text-muted-foreground">
          Basierend auf deinen Angaben{paket.length > 1 ? `: ${paket.map((b) => b.titel.replace(/^Deine? /, "")).join(", ")}` : ""}
        </p>
      </div>

      {paket.map((b, i) => (
        <BausteinAbschnitt key={b.id} baustein={b} antworten={antworten} nummer={i + 1} mehrere={paket.length > 1} />
      ))}

      {zusatz.map((b) => (
        <Zusatz key={b.id} baustein={b} antworten={antworten} />
      ))}

      <section className="mt-10 rounded-2xl bg-hero p-5">
        <h2 className="text-[18px] font-bold text-foreground">Und danach</h2>
        <div className="mt-3 space-y-2">
          {danach.map((l) => (
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

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <button type="button" onClick={aendern} className={knopfLeise}>
          Antworten ändern
        </button>
        <button type="button" onClick={neu} className={knopfLeise}>
          <RotateCcw className="h-[18px] w-[18px]" aria-hidden />
          Neu starten
        </button>
      </div>

      <p className="mt-5 text-[13px] leading-relaxed text-muted-foreground">
        Die Reihenfolge entsteht aus deinen Angaben und aus dem, was wir beim Anbieter belegt haben. Partnerschaften zählen dabei nicht. Das ist ein Vergleich von
        Anbietern und keine Anlageberatung.
        {mitStern &&
          " * Mit Stern markierte Links sind Werbe- oder Affiliate-Links. Wenn du darüber ein Produkt abschließt, erhalte ich eine Provision. Für dich entstehen dadurch keine Mehrkosten."}
      </p>
    </div>
  );
};

/* ------------------------------------------------------------------- Seite */

const VergleichAssistent = () => {
  const [stand, setStand] = useState<Stand>(lade);
  const [feier, setFeier] = useState(false);
  const { ort, antworten } = stand;

  useEffect(() => {
    try {
      sessionStorage.setItem(SPEICHER, JSON.stringify(stand));
    } catch {
      /* Privater Modus ohne Speicher: der Ablauf geht trotzdem. */
    }
  }, [stand]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    if (ort !== "laden") return;
    const t = window.setTimeout(
      () => {
        setFeier(true);
        setStand((s) => ({ ...s, ort: "ergebnis" }));
      },
      ruhig() ? 0 : 1700,
    );
    return () => window.clearTimeout(t);
  }, [ort]);

  const frage: Frage | undefined = fragen.find((f) => f.id === ort);
  const liste = aktiveFragen(antworten);
  const stelle = frage ? liste.findIndex((f) => f.id === frage.id) : liste.length;
  const amAnfang = ort === fragen[0].id;
  const anteil = ort === "ergebnis" || ort === "laden" ? 1 : amAnfang ? 0.06 : Math.min(0.96, (stelle + 0.5) / Math.max(1, liste.length));
  const gewaehlt = frage ? (antworten[frage.id] ?? []) : [];
  const { anzahl, bonus } = useMemo(() => lage(antworten), [antworten]);
  const gewaehltesVorhaben = (antworten.vorhaben ?? []).length > 0;

  const weiter = (neu: Antworten = antworten) => setStand((s) => ({ ...s, antworten: neu, ort: nach(s, neu) }));
  const neu = () => {
    setFeier(false);
    setStand(START);
  };

  const waehle = (f: Frage, id: string) => {
    if (f.mehrfach) {
      const alt = antworten[f.id] ?? [];
      const auswahl = alt.includes(id) ? alt.filter((x) => x !== id) : [...alt, id];
      setStand((s) => ({ ...s, antworten: { ...s.antworten, [f.id]: auswahl } }));
      return;
    }
    weiter({ ...antworten, [f.id]: [id] });
  };

  const imAblauf = !!frage;

  return (
    <>
      <Seo
        title="Was passt zu mir? Depot, Konto und mehr finden | finanzmuslim"
        description="Beantworte ein paar einfache Fragen. Du siehst, welches Depot, welches Konto und welche App zu dir passen und sich ohne Zinsen nutzen lassen."
        path="/vergleich/start"
        brotkrumen={[{ name: "Vergleiche", path: "/vergleiche" }, { name: "Was passt zu mir", path: "/vergleich/start" }]}
      />
      <div className="container min-h-[78svh] max-w-[640px] py-5 md:py-10">
        {imAblauf && (
          <>
            {/* Läuft mit jeder Antwort mit. Eine Euro-Zahl steht hier erst, wenn wir eine belegen können. */}
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-success/40 bg-card px-4 py-3 shadow-[0_8px_26px_-14px_rgba(22,140,80,0.55)]" aria-live="polite">
              <span className="text-[15px] font-medium leading-tight text-foreground">
                {bonus > 0 ? "Bonus für dich bis zu" : gewaehltesVorhaben ? "Anbieter, die zu dir passen" : "Anbieter im Vergleich"}
              </span>
              <span className="text-[28px] font-bold leading-none tabular-nums text-success">
                <Zaehler wert={bonus > 0 ? bonus : anzahl} />
                {bonus > 0 && " €"}
              </span>
            </div>

            <div className="mt-4 rounded-2xl border border-border bg-card p-4 md:p-6">
              <div className="h-2 overflow-hidden rounded-full bg-border" role="progressbar" aria-label="Fortschritt" aria-valuenow={Math.round(anteil * 100)} aria-valuemin={0} aria-valuemax={100}>
                <div className="h-full rounded-full bg-primary transition-[width] duration-300" style={{ width: `${anteil * 100}%` }} />
              </div>

              {frage && (
                <div key={frage.id} className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-right-4 motion-safe:duration-300">
                  <h1 className="mt-6 text-center text-[24px] font-bold leading-tight text-foreground md:text-[30px]">{frage.titel}</h1>
                  {frage.hinweis && <p className="mt-2 text-center text-[14px] text-muted-foreground">{frage.hinweis}</p>}
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    {frage.antworten.map((a, i) => (
                      <Karte
                        key={a.id}
                        titel={a.titel}
                        unter={a.unter}
                        bild={a.bild}
                        mehrfach={frage.mehrfach}
                        breit={frage.antworten.length % 2 === 1 && i === 0}
                        aktiv={gewaehlt.includes(a.id)}
                        onClick={() => waehle(frage, a.id)}
                      />
                    ))}
                  </div>
                  {frage.mehrfach && (
                    <button type="button" onClick={() => weiter()} disabled={gewaehlt.length === 0 && !frage.ohneWahl} className={`${knopf} mt-4`}>
                      {gewaehlt.length > 0 || !frage.ohneWahl ? "Weiter" : frage.ohneWahl}
                      <ArrowRight className="h-5 w-5" aria-hidden />
                    </button>
                  )}
                </div>
              )}

              {!amAnfang && (
                <div className="mt-5 flex justify-center">
                  <button type="button" onClick={() => setStand(vor)} className="min-h-[44px] rounded-lg border border-primary/40 px-5 text-[15px] font-semibold text-primary hover:border-primary">
                    Zurück
                  </button>
                </div>
              )}

              {gewaehltesVorhaben && (
                <div className="mt-5 border-t border-border pt-4 text-center">
                  <p className="text-[14px] text-muted-foreground">Keine Lust auf weitere Fragen?</p>
                  <button type="button" onClick={() => setStand((s) => ({ ...s, ort: "laden" }))} className="inline-flex min-h-[44px] items-center gap-1.5 text-[15px] font-semibold text-primary underline underline-offset-4">
                    Direkt zum Ergebnis
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </button>
                </div>
              )}
            </div>

            {amAnfang && (
              <p className="mt-4 flex items-center justify-center gap-2 text-center text-[13px] text-muted-foreground">
                <ShieldCheck className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                Kostenlos, ohne Anmeldung. Deine Antworten bleiben auf deinem Gerät.
              </p>
            )}
          </>
        )}

        {ort === "laden" && (
          <div className="pt-16 text-center md:pt-24" role="status">
            <h1 className="text-[26px] font-bold leading-tight text-foreground md:text-[34px]">Wir vergleichen jetzt {anzahl} Anbieter für dich</h1>
            <ul className="mx-auto mt-5 inline-block space-y-2 text-left text-[15px] text-foreground">
              {["Wer Zinsen nicht abschalten lässt, fliegt raus", "Ungeprüftes zählt nie als erfüllt", "Partnerschaften zählen nicht"].map((s) => (
                <li key={s} className="flex items-center gap-2">
                  <ShieldCheck className="h-[18px] w-[18px] shrink-0 text-primary" aria-hidden />
                  {s}
                </li>
              ))}
            </ul>
            <div className="mx-auto mt-10 max-w-[280px] space-y-4" aria-hidden>
              {[0, 1].map((i) => (
                <div key={i} className="flex animate-pulse items-center gap-3" style={{ animationDelay: `${i * 200}ms` }}>
                  <span className="h-12 w-12 rounded-xl bg-border" />
                  <span className="flex-1 space-y-2">
                    <span className="block h-3 w-2/3 rounded bg-border" />
                    <span className="block h-3 w-full rounded bg-border" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {ort === "ergebnis" && (
          <Ergebnis antworten={antworten} feier={feier} neu={neu} aendern={() => {
              setFeier(false);
              setStand((s) => ({ ...s, ort: fragen[0].id }));
            }}
          />
        )}
      </div>
    </>
  );
};

export default VergleichAssistent;
