import { useMemo, useState } from "react";
import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  AlertTriangle,
  Check,
  ChevronDown,
  HelpCircle,
  Info,
  Minus,
  X,
} from "lucide-react";
import {
  deutschland,
  deutschlandFakten,
  laender,
  preisniveauRelativ,
  wegzug,
  type Einkommen,
  type Fakt,
  type Haushalt,
  type Land,
  type LandId,
  type Ton,
} from "@/data/auswandern";

/**
 * Auswanderungsrechner.
 *
 * Vier Angaben rein, ein Bild raus. Alles Weitere steht hinter einem Klick.
 * Das Preisniveau kommt aus zwei Weltbank-Reihen, die Steuerregeln aus dem
 * Gesetzestext, die Länderfakten von Behördenseiten. Keine Zahl ohne Quelle.
 *
 * Aufbau: links die Eingaben, rechts das Ergebnis mit dem Balkenbild. Darunter
 * die Steuer-Ampel, der Zeitstrahl und die Kacheln zum Zielland und zu
 * Deutschland. Kacheln sind zu, bis man sie öffnet.
 */

const eur = (n: number) =>
  n.toLocaleString("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

const inputClass =
  "w-full rounded-xl border border-border bg-white px-4 py-3 pr-10 text-[16px] font-medium text-foreground outline-none transition focus:border-primary/50";

const parseEuro = (text: string) => {
  const v = parseFloat(text.replace(/\./g, "").replace(",", "."));
  return Number.isFinite(v) && v > 0 ? v : 0;
};

/* Ampelfarben. Farbe ist hier eine Bewertung, kein Schmuck. */
const tonFlaeche: Record<Ton, string> = {
  gruen: "bg-[hsl(var(--success)/0.12)] text-[hsl(var(--success))]",
  gelb: "bg-[hsl(var(--warning)/0.16)] text-[hsl(30_90%_30%)]",
  rot: "bg-[hsl(var(--destructive)/0.12)] text-[hsl(var(--destructive))]",
  grau: "bg-muted text-muted-foreground",
};
const tonPunkt: Record<Ton, string> = {
  gruen: "bg-[hsl(var(--success))]",
  gelb: "bg-[hsl(var(--warning))]",
  rot: "bg-[hsl(var(--destructive))]",
  grau: "bg-muted-foreground/40",
};
const TonIcon = ({ ton }: { ton: Ton }) =>
  ton === "gruen" ? (
    <Check className="h-3.5 w-3.5" aria-hidden />
  ) : ton === "rot" ? (
    <X className="h-3.5 w-3.5" aria-hidden />
  ) : ton === "gelb" ? (
    <AlertTriangle className="h-3.5 w-3.5" aria-hidden />
  ) : (
    <HelpCircle className="h-3.5 w-3.5" aria-hidden />
  );

/* ------------------------------------------------------------------ */
/* Kleine Bausteine                                                     */
/* ------------------------------------------------------------------ */

/** Eine Kachel, die sich aufklappt. Oben eine Zeile, darunter der Rest. */
const Kachel = ({
  fakt,
  offen,
  onToggle,
}: {
  fakt: Fakt;
  offen: boolean;
  onToggle: () => void;
}) => {
  const ton = fakt.ton ?? "grau";
  return (
    <div className={`rounded-2xl border bg-white transition ${offen ? "border-primary/50" : "border-border"}`}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={offen}
        className="flex w-full items-start gap-3 px-4 py-3.5 text-left"
      >
        <span
          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${tonFlaeche[ton]}`}
          aria-hidden
        >
          <TonIcon ton={ton} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-bold leading-snug text-foreground">{fakt.titel}</span>
          <span className="mt-0.5 block text-[13px] leading-snug text-muted-foreground">{fakt.kurz}</span>
        </span>
        <ChevronDown
          className={`mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform ${offen ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      {offen && (
        <div className="border-t border-border/70 px-4 py-3.5">
          <p className="text-[14px] leading-relaxed text-foreground/85">{fakt.detail}</p>
          <a
            href={fakt.quelle.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-[12px] text-primary underline decoration-primary/30 underline-offset-[3px] hover:decoration-primary"
          >
            {fakt.quelle.name}, {fakt.quelle.stand}
          </a>
        </div>
      )}
    </div>
  );
};

/** Auswahl aus zwei oder drei Knöpfen. */
const Wahl = <T extends string>({
  label,
  hinweis,
  wert,
  optionen,
  setWert,
}: {
  label: string;
  hinweis?: string;
  wert: T;
  optionen: { wert: T; titel: string; unter?: string }[];
  setWert: (v: T) => void;
}) => (
  <div>
    <p className="text-[15px] font-semibold text-foreground">{label}</p>
    {hinweis && <p className="mb-2 mt-0.5 text-[13px] text-muted-foreground">{hinweis}</p>}
    <div className={`mt-2 grid gap-2 ${optionen.length === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
      {optionen.map((o) => (
        <button
          key={o.wert}
          type="button"
          onClick={() => setWert(o.wert)}
          aria-pressed={wert === o.wert}
          className={`rounded-xl border px-3 py-2.5 text-left transition ${
            wert === o.wert ? "border-primary bg-white" : "border-border bg-white/60 hover:border-primary/40"
          }`}
        >
          <span className="block text-[13px] font-semibold text-foreground">{o.titel}</span>
          {o.unter && <span className="block text-[11px] leading-snug text-muted-foreground">{o.unter}</span>}
        </button>
      ))}
    </div>
  </div>
);

/** Ja / Nein / weiß nicht. */
const JaNein = ({
  label,
  hinweis,
  wert,
  setWert,
}: {
  label: string;
  hinweis: string;
  wert: boolean | null;
  setWert: (v: boolean | null) => void;
}) => (
  <div>
    <p className="text-[15px] font-semibold text-foreground">{label}</p>
    <p className="mb-2 mt-0.5 text-[13px] text-muted-foreground">{hinweis}</p>
    <div className="grid grid-cols-2 gap-2">
      {(
        [
          [true, "Ja"],
          [false, "Nein"],
        ] as const
      ).map(([v, t]) => (
        <button
          key={t}
          type="button"
          onClick={() => setWert(wert === v ? null : v)}
          aria-pressed={wert === v}
          className={`rounded-xl border px-3 py-2.5 text-[13px] font-semibold transition ${
            wert === v ? "border-primary bg-white text-foreground" : "border-border bg-white/60 text-foreground hover:border-primary/40"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* Der Rechner                                                          */
/* ------------------------------------------------------------------ */

type Ampel = { id: string; titel: string; ton: Ton; wort: string; detail: string; quellen: { name: string; url: string }[] };

const AuswanderungsRechner = () => {
  const [landId, setLandId] = useState<LandId>("tr");
  const [nettoText, setNettoText] = useState("3.000");
  const [haushalt, setHaushalt] = useState<Haushalt>("allein");
  const [einkommen, setEinkommen] = useState<Einkommen>("mitnehmen");
  const [mehrOffen, setMehrOffen] = useState(false);
  const [depotText, setDepotText] = useState("");
  const [beteiligung, setBeteiligung] = useState<boolean | null>(null);
  const [deutsch, setDeutsch] = useState<boolean | null>(null);
  const [offen, setOffen] = useState<string | null>(null);

  const land = useMemo(() => laender.find((l) => l.id === landId) ?? laender[0], [landId]);
  const netto = useMemo(() => parseEuro(nettoText), [nettoText]);
  const depot = useMemo(() => parseEuro(depotText), [depotText]);

  const rel = preisniveauRelativ(land);
  const aequivalent = netto / rel;
  const plus = aequivalent - netto;
  const plusProzent = Math.round((1 / rel - 1) * 100);
  const wir = haushalt === "allein" ? "du" : "ihr";
  const lebst = haushalt === "allein" ? "lebst" : "lebt";

  const vergleich = useMemo(
    () =>
      [
        { id: "de", name: "Deutschland", wert: 100, aktiv: false },
        ...laender.map((l) => ({
          id: l.id,
          name: l.name,
          wert: Math.round(preisniveauRelativ(l) * 100),
          aktiv: l.id === land.id,
        })),
      ].sort((a, b) => b.wert - a.wert),
    [land.id],
  );

  /* Die Ampel. Jede Zeile ist eine Regel aus dem Gesetz, angewendet auf die
     Angaben. Fehlt eine Angabe, bleibt die Zeile grau statt zu raten. */
  /* Fehlt eine Angabe, rechnen wir mit der wahrscheinlichsten Annahme und sagen
     das dazu. Vorher blieb die Zeile grau, und die Ampel sah leer aus, bevor
     jemand „Mehr Angaben" geöffnet hatte. */
  const beteiligungAnn = beteiligung ?? false;
  const deutschAnn = deutsch ?? true;
  const annahme = " (Annahme, unter „Mehr Angaben“ ändern)";

  const ampel: Ampel[] = useMemo(() => {
    const a = wegzug.anteile;
    const f = wegzug.fonds;
    const e = wegzug.erweitert;
    const zeilen: Ampel[] = [];

    zeilen.push({
      id: "anteile",
      titel: "Wegzugssteuer auf Firmenanteile",
      ton: beteiligungAnn ? "rot" : "gruen",
      wort: beteiligung === null ? "keine Firmenanteile" : beteiligungAnn ? "trifft dich" : "nicht betroffen",
      detail:
        (beteiligung === null ? "Wir nehmen an, dass du keine Anteile ab 1 Prozent hältst." + annahme + " " : "") +
        (beteiligungAnn
          ? `Beim Wegzug wird ein Verkauf deiner Anteile fingiert und der Wertzuwachs versteuert, ohne dass Geld fließt. Das greift ab ${a.schwelleProzent} Prozent an einer Kapitalgesellschaft, wenn du in den letzten ${a.vonJahren} Jahren mindestens ${a.vorbesitzJahre} Jahre in Deutschland unbeschränkt steuerpflichtig warst. Auf Antrag zahlst du in ${a.raten} gleichen Jahresraten, zinslos, meist gegen Sicherheit. Kommst du innerhalb von ${a.rueckkehrJahre} Jahren zurück und hast die Anteile behalten, entfällt die Steuer wieder.`
          : `Die Wegzugssteuer nach § 6 AStG greift erst ab ${a.schwelleProzent} Prozent Beteiligung an einer GmbH oder AG. Wer keine solche Beteiligung hält, ist hier nicht betroffen. Für ETF- und Fondsanteile gilt eine eigene Regel, siehe nächste Zeile.`),
      quellen: a.quellen,
    });

    zeilen.push({
      id: "fonds",
      titel: "Wegzugssteuer auf ETF- und Fondsanteile",
      ton: depot >= f.anschaffungskostenEuro ? "rot" : "gruen",
      wort: depot === 0 ? "Depot unter 500.000 €" : depot >= f.anschaffungskostenEuro ? "trifft dich" : "unter der Grenze",
      detail:
        depot >= f.anschaffungskostenEuro
          ? `Seit der Neuregelung gilt die Wegzugssteuer auch für Investmentanteile: ab ${eur(f.anschaffungskostenEuro)} Anschaffungskosten oder ab ${f.schwelleProzent} Prozent aller Anteile eines Fonds, bei ${f.vorbesitzJahre} Jahren Vorbesitz. Deine ${eur(depot)} liegen darüber. Der Kursgewinn wird beim Wegzug so behandelt, als hättest du verkauft. Das ist der Punkt, den fast kein Auswanderer-Ratgeber nennt.`
          : `Für ETF- und Fondsanteile greift die Wegzugssteuer erst ab ${eur(f.anschaffungskostenEuro)} Anschaffungskosten oder ab ${f.schwelleProzent} Prozent aller Anteile eines Fonds. ${depot > 0 ? `Mit ${eur(depot)} bleibst du darunter.` : "Trag unter „Mehr Angaben“ ein, was du für deine Anteile bezahlt hast, dann rechnen wir es ein."} Beim Verkauf des Depots vor dem Umzug fällt aber die normale Abgeltungsteuer an.`,
      quellen: f.quellen,
    });

    const niedrig = land.niedrigsteuer;
    zeilen.push({
      id: "erweitert",
      titel: `${e.dauerJahre} Jahre Nachwirkung in Deutschland`,
      ton: !deutschAnn ? "gruen" : niedrig ? "gelb" : "gruen",
      wort: !deutschAnn
        ? "nur für deutsche Staatsangehörige"
        : niedrig
          ? deutsch === null
            ? "kann greifen, bei deutschem Pass"
            : "kann greifen"
          : "kein Niedrigsteuerland",
      detail: (deutsch === null && niedrig ? "Wir nehmen an, dass du die deutsche Staatsangehörigkeit hast." + annahme + " " : "") + (!deutschAnn
        ? `Die erweiterte beschränkte Steuerpflicht nach § 2 AStG trifft nur deutsche Staatsangehörige. Ohne deutschen Pass bleibt es bei der normalen beschränkten Steuerpflicht auf deutsche Einkünfte.`
        : niedrig
          ? `Deutsche Staatsangehörige, die in den letzten ${e.vonJahren} Jahren mindestens ${e.vorbesitzJahre} Jahre unbeschränkt steuerpflichtig waren und in ein Gebiet mit niedriger Besteuerung ziehen, bleiben ${e.dauerJahre} Jahre lang erweitert beschränkt steuerpflichtig, wenn sie wesentliche wirtschaftliche Interessen in Deutschland behalten: inländische Einkünfte über 30 Prozent oder ab ${eur(e.inlandsEinkuenfteEuro)}, inländisches Vermögen über 30 Prozent oder ab ${eur(e.inlandsVermoegenEuro)}. Niedrig heißt: mehr als ein Drittel unter der deutschen Steuer, gemessen an einer ledigen Person mit ${eur(e.vergleichseinkommenEuro)} Einkommen. ${land.name} erhebt auf Gehälter keine Einkommensteuer und erfüllt das. Unter ${eur(e.bagatellEuro)} deutschen Einkünften im Jahr greift die Regel nicht.`
          : `${land.name} besteuert Einkommen progressiv und gilt damit nicht als Gebiet mit niedriger Besteuerung im Sinne von § 2 AStG. Die zehnjährige Nachwirkung entfällt. Was bleibt, ist die normale beschränkte Steuerpflicht auf deutsche Einkünfte.`),
      quellen: e.quellen,
    });

    zeilen.push({
      id: "einkuenfte",
      titel: einkommen === "mitnehmen" ? "Deine deutschen Einkünfte" : "Dein Gehalt dort",
      ton: einkommen === "mitnehmen" ? "gelb" : "gruen",
      wort: einkommen === "mitnehmen" ? "bleiben hier steuerpflichtig" : "nicht mehr in Deutschland",
      detail:
        einkommen === "mitnehmen"
          ? `Ohne Wohnsitz in Deutschland bist du beschränkt steuerpflichtig auf inländische Einkünfte nach § 49 EStG: Lohn für Arbeit, die in Deutschland ausgeübt wird, Mieten aus deutschen Immobilien, gesetzliche Rente und Kapitalerträge deutscher Schuldner. ${land.dba.kurz} ${land.dba.ton === "gruen" ? "Das Abkommen regelt, welches Land was besteuert." : "Ohne Abkommen gibt es keine Anrechnung, aber weil das Zielland nichts erhebt, auch keine doppelte Steuer."}`
          : `Mit dem Wegzug endet die unbeschränkte Steuerpflicht nach § 1 EStG. Was du ${land.imLand} verdienst, besteuert Deutschland nicht mehr. ${land.einkommensteuer.kurz} Bleiben deutsche Einkünfte wie Mieten oder Kapitalerträge, gelten dafür weiter die Regeln der beschränkten Steuerpflicht.`,
      quellen: wegzug.beschraenkt.quellen,
    });

    return zeilen;
  }, [beteiligung, beteiligungAnn, depot, deutsch, deutschAnn, einkommen, land]);

  /* Der Zeitstrahl. Jahre nach dem Wegzug, in denen Deutschland noch mitredet. */
  const zeitstrahl = useMemo(() => {
    const zeilen: { id: string; label: string; jahre: number; aktiv: boolean; ton: Ton }[] = [
      {
        id: "rueckkehr",
        label: `Rückkehr löscht die Wegzugssteuer`,
        jahre: wegzug.anteile.rueckkehrJahre,
        aktiv: beteiligungAnn || depot >= wegzug.fonds.anschaffungskostenEuro,
        ton: "gruen",
      },
      {
        id: "raten",
        label: `Ratenzahlung der Wegzugssteuer`,
        jahre: wegzug.anteile.raten,
        aktiv: beteiligungAnn || depot >= wegzug.fonds.anschaffungskostenEuro,
        ton: "rot",
      },
      {
        id: "erweitert",
        label: `Erweiterte beschränkte Steuerpflicht`,
        jahre: wegzug.erweitert.dauerJahre,
        aktiv: deutschAnn && land.niedrigsteuer,
        ton: "gelb",
      },
    ];
    return zeilen;
  }, [beteiligungAnn, depot, deutschAnn, land.niedrigsteuer]);

  const landFakten = useMemo(
    () => [land.einkommensteuer, land.dba, ...land.fakten.filter((f) => !f.nurFuer || f.nurFuer.includes(haushalt))],
    [land, haushalt],
  );

  const toggle = (id: string) => setOffen((o) => (o === id ? null : id));

  /* Die Vergleichstabelle. Jede Zelle ist eine Bewertung aus den Länderdaten,
     nichts wird hier neu geschätzt. */
  const blick = useMemo(() => {
    const aufenthaltId: Record<LandId, string> = { tr: "tr-aufenthalt", ae: "ae-visum", sa: "sa-residency" };
    const kurz: Record<LandId, string> = { tr: "Antrag binnen 90 Tagen", ae: "hängt am Arbeitgeber", sa: "Premium Residency" };
    const inflationTon = (w: number): Ton => (w >= 10 ? "rot" : w >= 3 ? "gelb" : "gruen");
    const preisTon = (r: number): Ton => (r <= 0.6 ? "gruen" : r <= 0.85 ? "gelb" : "grau");
    return [
      {
        titel: "Preise",
        zellen: laender.map((l) => ({ ton: preisTon(preisniveauRelativ(l)), text: `${Math.round(preisniveauRelativ(l) * 100)} %` })),
      },
      {
        titel: "Steuer auf Gehalt",
        zellen: laender.map((l) => ({ ton: l.einkommensteuer.ton ?? "grau", text: l.niedrigsteuer ? "keine" : "15 bis 40 %" })),
      },
      {
        titel: "Abkommen mit DE",
        zellen: laender.map((l) => ({ ton: l.dba.ton ?? "grau", text: l.dba.ton === "gruen" ? "ja" : l.id === "ae" ? "seit 2022 keins" : "keins" })),
      },
      {
        titel: `Inflation ${laender[0].inflation[3].jahr}`,
        zellen: laender.map((l) => ({ ton: inflationTon(l.inflation[3].wert), text: `${l.inflation[3].wert.toLocaleString("de-DE")} %` })),
      },
      {
        titel: "Aufenthalt",
        zellen: laender.map((l) => ({
          ton: l.fakten.find((f) => f.id === aufenthaltId[l.id])?.ton ?? "grau",
          text: kurz[l.id],
        })),
      },
    ];
  }, []);

  return (
    <section className="container max-w-5xl px-0 pb-0 pt-0 md:px-6 md:pb-4 md:pt-14">
      <div className="grid grid-cols-1 items-start gap-6 md:gap-8 lg:grid-cols-[1.15fr_1fr]">
        {/* ── Eingaben ─────────────────────────────────────────────── */}
        <div className="rounded-[1.5rem] border border-border/70 bg-card p-5 md:p-7">
          <h2 className="headline text-xl md:text-2xl">Wohin soll es gehen?</h2>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            Vier Angaben. Den Rest rechnen wir.
          </p>

          <div className="mt-5 grid grid-cols-3 gap-2 md:gap-3">
            {laender.map((l) => {
              const aktiv = l.id === land.id;
              return (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setLandId(l.id)}
                  aria-pressed={aktiv}
                  className={`flex flex-col items-center rounded-2xl border px-2 py-4 transition ${
                    aktiv ? "border-primary bg-accent" : "border-border bg-white/60 hover:border-primary/40"
                  }`}
                >
                  <span className="text-[40px] leading-none md:text-[48px]" aria-hidden>
                    {l.flagge}
                  </span>
                  <span className="mt-2 text-[14px] font-bold text-foreground">{l.name}</span>
                  <span className="text-[12px] text-muted-foreground">
                    Preise {Math.round(preisniveauRelativ(l) * 100)} %
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 space-y-6">
            <div>
              <label className="block text-[15px] font-semibold text-foreground" htmlFor="netto">
                Was du netto im Monat hast
              </label>
              <p className="mb-2 mt-0.5 text-[13px] text-muted-foreground">
                Was heute nach Steuern und Abgaben auf dem Konto landet.
              </p>
              <div className="relative">
                <input
                  id="netto"
                  inputMode="decimal"
                  value={nettoText}
                  onChange={(e) => setNettoText(e.target.value)}
                  className={inputClass}
                />
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  €
                </span>
              </div>
            </div>

            <Wahl<Haushalt>
              label="Wer zieht mit?"
              wert={haushalt}
              setWert={setHaushalt}
              optionen={[
                { wert: "allein", titel: "Allein" },
                { wert: "paar", titel: "Zu zweit" },
                { wert: "familie", titel: "Mit Kindern" },
              ]}
            />

            <Wahl<Einkommen>
              label="Woher kommt dein Geld dort?"
              hinweis="Das entscheidet, was Deutschland noch besteuert."
              wert={einkommen}
              setWert={setEinkommen}
              optionen={[
                { wert: "mitnehmen", titel: "Nehme ich mit", unter: "Remote, Rente, Mieten aus Deutschland" },
                { wert: "neu", titel: "Verdiene ich dort", unter: "Neuer Job oder Geschäft vor Ort" },
              ]}
            />

            <div className="rounded-xl border border-border/70 bg-white/60">
              <button
                type="button"
                onClick={() => setMehrOffen((o) => !o)}
                aria-expanded={mehrOffen}
                className="flex w-full items-center justify-between px-4 py-3 text-[14px] font-semibold text-foreground"
              >
                Mehr Angaben, für die Steuer-Ampel
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform ${mehrOffen ? "rotate-180" : ""}`}
                  aria-hidden
                />
              </button>
              {mehrOffen && (
                <div className="space-y-5 border-t border-border/70 px-4 py-4">
                  <div>
                    <label className="block text-[15px] font-semibold text-foreground" htmlFor="depot">
                      Was du für deine ETF- und Fondsanteile bezahlt hast
                    </label>
                    <p className="mb-2 mt-0.5 text-[13px] text-muted-foreground">
                      Kaufpreis, nicht heutiger Wert. Ab 500.000 € wird es beim Wegzug relevant.
                    </p>
                    <div className="relative">
                      <input
                        id="depot"
                        inputMode="decimal"
                        value={depotText}
                        onChange={(e) => setDepotText(e.target.value)}
                        placeholder="0"
                        className={inputClass}
                      />
                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                        €
                      </span>
                    </div>
                  </div>
                  <JaNein
                    label="Hältst du mindestens 1 Prozent an einer GmbH oder AG?"
                    hinweis="Auch die eigene Firma zählt."
                    wert={beteiligung}
                    setWert={setBeteiligung}
                  />
                  <JaNein
                    label="Hast du die deutsche Staatsangehörigkeit?"
                    hinweis="Nur dann greift die zehnjährige Nachwirkung."
                    wert={deutsch}
                    setWert={setDeutsch}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Ergebnis ─────────────────────────────────────────────── */}
        <div className="space-y-4 lg:sticky lg:top-36">
          <div className="rounded-[1.5rem] bg-primary p-6 text-white md:p-7">
            <span className="text-[11px] font-semibold tracking-wide text-white/70">
              {eur(netto)} {land.imLand} fühlen sich an wie
            </span>
            <p className="headline mt-3 text-4xl text-white md:text-5xl">{eur(aequivalent)}</p>
            <p className="mt-3 text-[14px] leading-relaxed text-white/80">
              Mit <strong className="text-white">{eur(netto)}</strong> netto {lebst} {wir} {land.imLand} wie
              mit rund <strong className="text-white">{eur(aequivalent)}</strong> in Deutschland. Das sind{" "}
              <strong className="text-white">{eur(plus)}</strong> mehr Kaufkraft im Monat, plus {plusProzent}{" "}
              Prozent.
            </p>

            <div className="mt-5 h-[96px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={[
                    { name: "Deutschland", wert: Math.round(netto) },
                    { name: land.name, wert: Math.round(aequivalent) },
                  ]}
                  margin={{ top: 0, right: 72, bottom: 0, left: 0 }}
                  barCategoryGap={8}
                >
                  <XAxis type="number" hide domain={[0, Math.max(aequivalent, netto) * 1.05]} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={92}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "rgba(255,255,255,0.85)" }}
                  />
                  <Tooltip
                    cursor={false}
                    formatter={(v: number) => [eur(v), "Kaufkraft"]}
                    contentStyle={{ borderRadius: 12, border: "none", fontSize: 13 }}
                  />
                  <Bar dataKey="wert" radius={[0, 4, 4, 0]} isAnimationActive={false}>
                    <Cell fill="rgba(255,255,255,0.35)" />
                    <Cell fill={rel < 1 ? "hsl(var(--success))" : "hsl(var(--warning))"} />
                    <LabelList
                      dataKey="wert"
                      position="right"
                      formatter={(v: number) => eur(v)}
                      style={{ fill: "#fff", fontSize: 13, fontWeight: 700 }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-white p-5">
            <p className="text-[13px] font-semibold text-foreground">Preisniveau, Deutschland = 100</p>
            <div className="mt-2 h-[132px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={vergleich} margin={{ top: 0, right: 40, bottom: 0, left: 0 }} barCategoryGap={6}>
                  <XAxis type="number" hide domain={[0, 110]} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={100}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  />
                  <Tooltip
                    cursor={false}
                    formatter={(v: number) => [`${v} % von Deutschland`, "Preisniveau"]}
                    contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", fontSize: 13 }}
                  />
                  <Bar dataKey="wert" radius={[0, 4, 4, 0]} isAnimationActive={false}>
                    {vergleich.map((v) => (
                      <Cell key={v.id} fill={v.aktiv ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.22)"} />
                    ))}
                    <LabelList
                      dataKey="wert"
                      position="right"
                      formatter={(v: number) => `${v} %`}
                      style={{ fill: "hsl(var(--foreground))", fontSize: 12, fontWeight: 600 }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex items-start gap-2">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
              <p className="text-[12px] leading-relaxed text-muted-foreground">
                Landesdurchschnitt für den privaten Konsum, Weltbank 2024. {land.stadt} liegt darüber.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Auf einen Blick ────────────────────────────────────────── */}
      <div className="mt-10">
        <h2 className="headline text-xl md:text-2xl">Die drei Länder auf einen Blick</h2>
        <p className="mt-1 text-[14px] text-muted-foreground">Tipp auf ein Land, dann rechnet alles oben mit.</p>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-border/70 bg-white">
          <table className="w-full min-w-[560px] border-collapse text-[13px]">
            <thead>
              <tr>
                <th className="w-[140px] px-4 py-3 text-left text-[12px] font-semibold text-muted-foreground">Deutschland = 100</th>
                {laender.map((l) => (
                  <th key={l.id} className="px-2 py-2 text-center">
                    <button
                      type="button"
                      onClick={() => setLandId(l.id)}
                      aria-pressed={l.id === land.id}
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[13px] font-bold transition ${
                        l.id === land.id ? "border-primary bg-accent text-foreground" : "border-border bg-white text-foreground hover:border-primary/40"
                      }`}
                    >
                      <span aria-hidden>{l.flagge}</span>
                      {l.name}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {blick.map((zeile) => (
                <tr key={zeile.titel} className="border-t border-border/70">
                  <td className="px-4 py-3 font-semibold text-foreground">{zeile.titel}</td>
                  {zeile.zellen.map((z, i) => (
                    <td key={i} className={`px-3 py-3 text-center ${laender[i].id === land.id ? "bg-accent/50" : ""}`}>
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[12px] font-semibold ${tonFlaeche[z.ton]}`}>
                        <span className={`h-2 w-2 rounded-full ${tonPunkt[z.ton]}`} aria-hidden />
                        {z.text}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Steuer-Ampel ───────────────────────────────────────────── */}
      <div className="mt-10">
        <h2 className="headline text-xl md:text-2xl">Was Deutschland beim Wegzug noch will</h2>
        <p className="mt-1 text-[14px] text-muted-foreground">
          Vier Regeln aus dem Gesetz, auf deine Angaben angewendet. Tipp auf eine Zeile.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {ampel.map((z) => {
            const istOffen = offen === z.id;
            return (
              <div
                key={z.id}
                className={`rounded-2xl border bg-white transition ${istOffen ? "border-primary/50" : "border-border"}`}
              >
                <button
                  type="button"
                  onClick={() => toggle(z.id)}
                  aria-expanded={istOffen}
                  className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
                >
                  <span className={`h-3 w-3 shrink-0 rounded-full ${tonPunkt[z.ton]}`} aria-hidden />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-bold leading-snug text-foreground">{z.titel}</span>
                    <span className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[12px] font-semibold ${tonFlaeche[z.ton]}`}>
                      <TonIcon ton={z.ton} />
                      {z.wort}
                    </span>
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${istOffen ? "rotate-180" : ""}`}
                    aria-hidden
                  />
                </button>
                {istOffen && (
                  <div className="border-t border-border/70 px-4 py-3.5">
                    <p className="text-[14px] leading-relaxed text-foreground/85">{z.detail}</p>
                    <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[12px]">
                      {z.quellen.map((q) => (
                        <a
                          key={q.url}
                          href={q.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary underline decoration-primary/30 underline-offset-[3px] hover:decoration-primary"
                        >
                          {q.name}
                        </a>
                      ))}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Zeitstrahl ─────────────────────────────────────────────── */}
      <div className="mt-8 rounded-2xl border border-border/70 bg-white p-5 md:p-6">
        <p className="text-[15px] font-bold text-foreground">Wie lange Deutschland noch mitredet</p>
        <p className="mt-1 text-[13px] text-muted-foreground">Jahre nach dem Wegzug. Grau heißt: gilt nach deinen Angaben nicht für dich.</p>
        <div className="mt-4 space-y-3">
          {zeitstrahl.map((z) => (
            <div key={z.id} className="grid grid-cols-[1fr] gap-1 md:grid-cols-[240px_1fr] md:items-center md:gap-4">
              <span className={`text-[13px] font-semibold ${z.aktiv ? "text-foreground" : "text-muted-foreground"}`}>
                {z.label}
              </span>
              <div className="relative h-7 rounded-full bg-muted">
                <div
                  className={`absolute left-0 top-0 h-7 rounded-full ${z.aktiv ? tonPunkt[z.ton] : "bg-muted-foreground/25"}`}
                  style={{ width: `${(z.jahre / 10) * 100}%` }}
                />
                <span
                  className={`absolute top-1/2 -translate-y-1/2 pl-3 text-[12px] font-bold ${z.aktiv ? "text-white" : "text-muted-foreground"}`}
                >
                  {z.jahre} Jahre
                </span>
              </div>
            </div>
          ))}
          <div className="hidden grid-cols-[240px_1fr] gap-4 md:grid">
            <span />
            <div className="flex justify-between text-[11px] text-muted-foreground">
              {[0, 2, 4, 6, 8, 10].map((j) => (
                <span key={j}>{j}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Zielland ───────────────────────────────────────────────── */}
      <div className="mt-10">
        <h2 className="headline text-xl md:text-2xl">
          <span aria-hidden>{land.flagge}</span> Was {land.imLand} auf dich zukommt
        </h2>
        <p className="mt-1 text-[14px] text-muted-foreground">Jede Kachel hat eine Quelle. Tipp drauf.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {landFakten.map((f) => (
            <Kachel key={f.id} fakt={f} offen={offen === f.id} onToggle={() => toggle(f.id)} />
          ))}
        </div>

        {land.id === "tr" && (
          <div className="mt-4 rounded-2xl border border-border/70 bg-white p-5">
            <p className="text-[13px] font-semibold text-foreground">Inflation in der Türkei, Prozent je Jahr</p>
            <div className="mt-2 h-[120px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={land.inflation} margin={{ top: 18, right: 8, bottom: 0, left: 8 }} barCategoryGap={18}>
                  <XAxis dataKey="jahr" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis hide domain={[0, 80]} />
                  <Tooltip
                    cursor={false}
                    formatter={(v: number) => [`${v.toLocaleString("de-DE")} %`, "Inflation"]}
                    contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", fontSize: 13 }}
                  />
                  <Bar dataKey="wert" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} isAnimationActive={false}>
                    <LabelList
                      dataKey="wert"
                      position="top"
                      formatter={(v: number) => `${v.toLocaleString("de-DE")} %`}
                      style={{ fill: "hsl(var(--foreground))", fontSize: 12, fontWeight: 600 }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-[14px] leading-relaxed text-foreground/85">
              Lässt du <strong>{eur(netto)}</strong> ein Jahr lang in Lira liegen, kaufen sie danach nur noch so viel wie{" "}
              <strong>{eur(netto / (1 + land.inflation[3].wert / 100))}</strong> heute, bei der Inflation von{" "}
              {land.inflation[3].jahr}. In Euro wären es {eur(netto / (1 + deutschland.inflation[3].wert / 100))}.
            </p>
            <p className="mt-1 text-[12px] text-muted-foreground">
              Deutschland {deutschland.inflation[3].jahr}: {deutschland.inflation[3].wert.toLocaleString("de-DE")} Prozent. Weltbank, Verbraucherpreise.
            </p>
          </div>
        )}
      </div>

      {/* ── Deutschland ────────────────────────────────────────────── */}
      <div className="mt-10">
        <h2 className="headline text-xl md:text-2xl">
          <span aria-hidden>🇩🇪</span> Was du hier noch regeln musst
        </h2>
        <p className="mt-1 text-[14px] text-muted-foreground">Drei Dinge, die bei jedem Wegzug anfallen.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {deutschlandFakten.map((f) => (
            <Kachel key={f.id} fakt={{ ...f, ton: f.id === "depot" ? "rot" : "gelb" }} offen={offen === f.id} onToggle={() => toggle(f.id)} />
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-start gap-2.5 rounded-2xl border border-border/70 bg-surface p-5">
        <Minus className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          Das ist eine Einordnung, keine Steuerberatung und keine Fatwa. Wer wirklich geht, spricht vorher
          mit einem Steuerberater, der beide Länder kennt. Die Paragraphen stehen hier, damit du weißt, wonach
          du fragst.
        </p>
      </div>
    </section>
  );
};

export default AuswanderungsRechner;
