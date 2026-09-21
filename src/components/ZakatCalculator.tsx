import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown, Info } from "lucide-react";
import nisabDaten from "@/data/nisab.json";

/**
 * Zakat-Rechner.
 *
 * Fuer die Zakat gibt es nur zwei Sorten Vermoegen: Geld, das verfuegbar ist,
 * und Geld, das im Depot liegt. Auf das erste zahlt man 2,5 Prozent, auf das
 * zweite weniger, weil bei langfristig gehaltenen Aktien nur ein Teil des
 * Firmenvermoegens zakatpflichtig ist. Deshalb gibt es genau zwei Felder.
 *
 * Vorher waren es sieben, aufgeteilt nach Gold, Sukuk, Krypto und Forderungen.
 * Das ist fachlich dieselbe Zahl und hat den Rechner nur unuebersichtlich
 * gemacht.
 *
 * Keine Fatwa. Wo Gelehrte uneins sind, steht das da.
 */

const ZAKAT_SATZ = 0.025;

/** Nisab-Schwellen nach klassischer Ueberlieferung. */
const NISAB_GOLD_GRAMM = 85;
const NISAB_SILBER_GRAMM = 595;

type Methode = "voll" | "anteil";

/** Anteil des Unternehmenswerts, der bei langfristig gehaltenen Aktien als
 *  zakatpflichtig angesetzt wird. Verbreiteter Naeherungswert. */
const ANTEIL_SATZ = 0.3;

const eur = (n: number) =>
  n.toLocaleString("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

const prozent = (n: number) =>
  n.toLocaleString("de-DE", { minimumFractionDigits: 0, maximumFractionDigits: 2 });

const parseDeDatum = (s: string) => {
  const [tag, monat, jahr] = s.split(".").map(Number);
  return new Date(jahr, (monat || 1) - 1, tag || 1);
};

const istPreisVeraltet = (stand: string) => {
  const diffTage = (Date.now() - parseDeDatum(stand).getTime()) / (1000 * 60 * 60 * 24);
  return diffTage > 45;
};

const inputClass =
  "w-full rounded-xl border border-border bg-white px-4 py-3 pr-10 text-[16px] font-medium text-foreground outline-none transition focus:border-primary/50";

/** Ein Geldfeld mit Beschriftung, Erklaersatz und Euro-Zeichen.
 *
 *  Steht bewusst AUSSERHALB der Rechner-Komponente. Innerhalb definiert waere
 *  es bei jedem Tastendruck eine neue Funktion, React wuerde das Eingabefeld
 *  jedes Mal neu aufbauen, und der Fokus samt eingetipptem Wert ginge verloren.
 */
const Feld = ({
  id,
  label,
  hinweis,
  wert,
  setWert,
}: {
  id: string;
  label: string;
  hinweis: string;
  wert: string;
  setWert: (v: string) => void;
}) => (
    <div>
      <label className="block text-[15px] font-semibold text-foreground" htmlFor={id}>
        {label}
      </label>
      <p className="mb-2 mt-0.5 text-[13px] text-muted-foreground">{hinweis}</p>
      <div className="relative">
        <input
          id={id}
          inputMode="decimal"
          placeholder="0"
          value={wert}
          onChange={(e) => setWert(e.target.value)}
          className={inputClass}
        />
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
          €
        </span>
      </div>
    </div>
  );

const ZakatCalculator = () => {
  const [geld, setGeld] = useState("");
  const [depot, setDepot] = useState("");
  const [schulden, setSchulden] = useState("");
  const [methode, setMethode] = useState<Methode>("anteil");
  const [mehrOffen, setMehrOffen] = useState(false);
  const [nisabOffen, setNisabOffen] = useState(false);

  /** Preis je Gramm in deutscher Schreibweise, also mit Komma.
   *
   *  Wichtig: String(1.809) ergibt "1.809". Das Eingabefeld wird deutsch
   *  gelesen, dort ist der Punkt der Tausendertrenner, und aus 1,809 € wurden
   *  1809 €. Die Nisab-Grenze stand dadurch bei 1.076.355 € statt 1.076 €,
   *  also tausendfach zu hoch. */
  const preisFuer = (basis: "gold" | "silber") =>
    String(basis === "gold" ? nisabDaten.goldPreisJeGramm : nisabDaten.silberPreisJeGramm).replace(
      ".",
      ",",
    );

  const [nisabBasis, setNisabBasis] = useState<"gold" | "silber">("silber");
  const [preis, setPreis] = useState(preisFuer("silber"));

  useEffect(() => {
    setPreis(preisFuer(nisabBasis));
  }, [nisabBasis]);

  const num = (s: string) => {
    const v = parseFloat((s || "").replace(/\./g, "").replace(",", "."));
    return Number.isFinite(v) && v > 0 ? v : 0;
  };

  const ergebnis = useMemo(() => {
    const geldWert = num(geld);
    const depotWert = num(depot);
    const depotAnrechenbar = methode === "voll" ? depotWert : depotWert * ANTEIL_SATZ;
    const brutto = geldWert + depotAnrechenbar;
    const netto = Math.max(0, brutto - num(schulden));

    const nisab = num(preis) * (nisabBasis === "gold" ? NISAB_GOLD_GRAMM : NISAB_SILBER_GRAMM);
    // Wer die Grenze genau erreicht, ist pflichtig, nicht erst wer sie ueberschreitet.
    const pflichtig = nisab > 0 && netto >= nisab;

    return {
      geldWert,
      depotWert,
      depotAnrechenbar,
      netto,
      nisab,
      pflichtig,
      zakat: pflichtig ? netto * ZAKAT_SATZ : 0,
      /** Was effektiv auf den Depotwert faellig wird, in Prozent. */
      depotSatz: (methode === "voll" ? 1 : ANTEIL_SATZ) * ZAKAT_SATZ * 100,
    };
  }, [geld, depot, schulden, methode, preis, nisabBasis]);


  return (
    <section className="container max-w-5xl px-0 pb-0 pt-0 md:px-6 md:pb-4 md:pt-14">
      <div className="grid grid-cols-1 items-start gap-6 md:gap-8 lg:grid-cols-[1.15fr_1fr]">
        {/* ── Eingaben ─────────────────────────────────────────────── */}
        <div className="rounded-[1.5rem] border border-border/70 bg-card p-5 md:p-7">
          <h2 className="headline text-xl md:text-2xl">Dein Vermögen am Stichtag</h2>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            Trag ein, was du seit einem Mondjahr besitzt.
          </p>

          <div className="mt-6 space-y-5">
            <Feld
              id="geld"
              label="Dein Geld"
              hinweis="Konto, Bargeld, Gold, Silber und Krypto zusammen."
              wert={geld}
              setWert={setGeld}
            />
            <Feld
              id="depot"
              label="Im Depot angelegt"
              hinweis="Aktien und ETFs, die du liegen lässt."
              wert={depot}
              setWert={setDepot}
            />

            {/* Alles, was die meisten nicht brauchen, liegt hinter einem Klick. */}
            <div className="rounded-2xl border border-border/70 bg-surface">
              <button
                type="button"
                onClick={() => setMehrOffen((v) => !v)}
                aria-expanded={mehrOffen}
                className="flex w-full items-center justify-between px-4 py-3 text-left text-[14px] font-semibold text-foreground"
              >
                Mehr Angaben
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform ${mehrOffen ? "rotate-180" : ""}`}
                  aria-hidden
                />
              </button>

              {mehrOffen && (
                <div className="space-y-5 border-t border-border/70 px-4 py-4">
                  <Feld
                    id="schulden"
                    label="Kurzfristig fällige Schulden"
                    hinweis="Was in den nächsten zwölf Monaten fällig wird, ziehen wir ab."
                    wert={schulden}
                    setWert={setSchulden}
                  />

                  <div>
                    <p className="mb-2 text-[15px] font-semibold text-foreground">
                      Wie hältst du dein Depot?
                    </p>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {(
                        [
                          ["anteil", "Liegen gelassen", `${prozent(ANTEIL_SATZ * ZAKAT_SATZ * 100)} % vom Depotwert`],
                          ["voll", "Zum Handel gehalten", "2,5 % vom Depotwert"],
                        ] as const
                      ).map(([wert, titel, satz]) => (
                        <button
                          key={wert}
                          type="button"
                          onClick={() => setMethode(wert)}
                          aria-pressed={methode === wert}
                          className={`rounded-xl border px-3 py-2.5 text-left transition ${
                            methode === wert
                              ? "border-primary bg-white"
                              : "border-border bg-white/60 hover:border-primary/40"
                          }`}
                        >
                          <span className="block text-[13px] font-semibold text-foreground">{titel}</span>
                          <span className="block text-[11px] leading-snug text-muted-foreground">{satz}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Ergebnis ─────────────────────────────────────────────── */}
        <div className="space-y-4 lg:sticky lg:top-24">
          <div className="ergebnis-karte" data-ton="neutral">
            {istPreisVeraltet(nisabDaten.stand) && (
              <div className="mb-4 rounded-xl bg-warning px-4 py-3 text-[13px] font-semibold text-warning-foreground">
                Der hinterlegte Preis ist vom {nisabDaten.stand} und damit älter als sechs Wochen.
                Das Ergebnis kann abweichen.
              </div>
            )}
            <span className="ergebnis-ueber">Deine Zakat</span>
            <p className="ergebnis-zahl">{eur(ergebnis.zakat)}</p>

            {/* Das Ergebnis als ganzer Satz. Eine Zahl allein sagt niemandem,
                wie sie zustande kommt. */}
            <p className="ergebnis-satz">
              {ergebnis.pflichtig ? (
                <>
                  Bei <strong>{eur(ergebnis.geldWert)}</strong> Geld
                  {ergebnis.depotWert > 0 && (
                    <>
                      {" "}und <strong>{eur(ergebnis.depotWert)}</strong> im Depot
                    </>
                  )}{" "}
                  zahlst du <strong>{eur(ergebnis.zakat)}</strong> Zakat.
                  {ergebnis.depotWert > 0 && (
                    <>
                      {" "}Auf dein Geld sind es 2,5 Prozent, auf dein Depot{" "}
                      {prozent(ergebnis.depotSatz)} Prozent
                      {methode === "anteil" && ", weil dort nur ein Teil zählt"}.
                    </>
                  )}
                </>
              ) : (
                <>
                  Dein Vermögen liegt unter der Grenze von{" "}
                  <strong>{eur(ergebnis.nisab)}</strong>. Dann zahlst du keine
                  Zakat.
                </>
              )}
            </p>
          </div>

          {/* Nisab: eingeklappt, weil die Voreinstellung fuer die meisten stimmt. */}
          <div className="rounded-2xl border border-border/70 bg-card">
            <button
              type="button"
              onClick={() => setNisabOffen((v) => !v)}
              aria-expanded={nisabOffen}
              className="flex w-full items-center justify-between px-5 py-4 text-left"
            >
              <span>
                <span className="block text-[14px] font-semibold text-foreground">
                  Grenze: {eur(ergebnis.nisab)}
                </span>
                <span className="block text-[12px] text-muted-foreground">
                  nach {nisabBasis === "silber" ? "Silber" : "Gold"}, Stand {nisabDaten.stand}
                </span>
              </span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${nisabOffen ? "rotate-180" : ""}`}
                aria-hidden
              />
            </button>

            {nisabOffen && (
              <div className="border-t border-border/70 px-5 py-4">
                <p className="text-[12px] leading-relaxed text-muted-foreground">
                  Der Nisab ist die Untergrenze, ab der Zakat fällig wird. Er wird über den Gold-
                  oder Silberpreis bestimmt. Silber liegt niedriger und erfasst dadurch mehr
                  Menschen, viele Gelehrte empfehlen ihn deshalb.
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {(["silber", "gold"] as const).map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setNisabBasis(b)}
                      aria-pressed={nisabBasis === b}
                      className={`rounded-xl border px-3 py-2 text-[13px] font-semibold transition ${
                        nisabBasis === b
                          ? "border-primary bg-white text-foreground"
                          : "border-border bg-white/60 text-muted-foreground hover:border-primary/40"
                      }`}
                    >
                      {b === "silber" ? "Silber (595 g)" : "Gold (85 g)"}
                    </button>
                  ))}
                </div>
                <label className="mt-3 block text-xs font-semibold text-foreground/70" htmlFor="preis">
                  Preis je Gramm {nisabBasis === "gold" ? "Gold" : "Silber"}
                </label>
                <div className="relative mt-1.5">
                  <input
                    id="preis"
                    inputMode="decimal"
                    value={preis}
                    onChange={(e) => setPreis(e.target.value)}
                    className={inputClass}
                  />
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    €
                  </span>
                </div>
                <p className="mt-2 text-[12px] text-muted-foreground">
                  Voreingestellt ist der Preis vom {nisabDaten.stand}. Für eine taggenaue Berechnung
                  trag den Preis deines eigenen Stichtags ein.
                </p>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-border/70 bg-surface p-5">
            <div className="flex items-start gap-2.5">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              <p className="text-[12px] leading-relaxed text-muted-foreground">
                Dieser Rechner ist ein Hilfsmittel zur Orientierung und keine Fatwa. Zur Behandlung
                langfristig gehaltener Aktien gibt es unterschiedliche Gelehrtenmeinungen. Im
                Zweifel frag eine Gelehrte oder einen Gelehrten deines Vertrauens.
              </p>
            </div>
          </div>

          <Link
            to="/bereinigungsrechner"
            className="group flex items-center justify-between gap-3 rounded-2xl border border-primary/60 bg-white px-5 py-4 transition hover:-translate-y-[1px] hover:border-primary"
          >
            <span className="text-[14px] font-semibold text-foreground">
              Rechne aus, welchen Teil deiner Erträge du weitergibst
            </span>
            <ArrowRight
              className="h-4 w-4 shrink-0 text-primary transition group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ZakatCalculator;
