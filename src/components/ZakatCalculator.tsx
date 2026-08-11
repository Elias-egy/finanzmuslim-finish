import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Info } from "lucide-react";

/**
 * Zakat-Rechner fuer Vermoegen inklusive Depot.
 *
 * Warum dieses Werkzeug: Auf Deutsch existiert praktisch kein Rechner, der
 * Zakat auf ein Wertpapierdepot abbildet. Genau das ist die Frage, die Muslime
 * nach der Depoteroeffnung stellen. Die Seite bringt Suchtraffic und beantwortet
 * eine echte Folgefrage, statt nur zu werben.
 *
 * Wichtig zur Methodik: Bei langfristig gehaltenen Aktien und ETFs gibt es
 * unterschiedliche Gelehrtenmeinungen. Der Rechner ERZWINGT deshalb keine
 * Position, sondern laesst den Nutzer zwischen zwei verbreiteten Ansaetzen
 * waehlen und benennt beide offen. Das ist keine Fatwa und sagt das auch.
 */

const ZAKAT_SATZ = 0.025;

/** Nisab-Schwellen nach klassischer Ueberlieferung. */
const NISAB_GOLD_GRAMM = 85;
const NISAB_SILBER_GRAMM = 595;

type Methode = "voll" | "anteil";

/** Anteil des Unternehmenswerts, der bei der Anteils-Methode als zakatpflichtig
 *  angesetzt wird. Verbreiteter Naeherungswert, bewusst als Schaetzung benannt. */
const ANTEIL_SATZ = 0.3;

type Feld = { key: string; label: string; hint?: string };

const VERMOEGEN: Feld[] = [
  { key: "bargeld", label: "Bargeld und Guthaben", hint: "Konto, Bargeld, Tagesgeld" },
  { key: "gold", label: "Gold und Silber", hint: "Aktueller Marktwert deines Bestands" },
  { key: "sukuk", label: "Sukuk", hint: "Marktwert, gilt als voll zakatpflichtig" },
  { key: "krypto", label: "Krypto", hint: "Marktwert am Stichtag" },
  { key: "forderungen", label: "Sichere Forderungen", hint: "Geld, das dir zurückgezahlt wird" },
];

const eur = (n: number) =>
  n.toLocaleString("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

const ZakatCalculator = () => {
  const [werte, setWerte] = useState<Record<string, string>>({});
  const [aktien, setAktien] = useState("");
  const [schulden, setSchulden] = useState("");
  const [methode, setMethode] = useState<Methode>("anteil");
  const [goldpreis, setGoldpreis] = useState("75");
  const [nisabBasis, setNisabBasis] = useState<"gold" | "silber">("silber");

  const num = (s: string) => {
    const v = parseFloat((s || "").replace(/\./g, "").replace(",", "."));
    return Number.isFinite(v) && v > 0 ? v : 0;
  };

  const ergebnis = useMemo(() => {
    const sonstiges = VERMOEGEN.reduce((s, f) => s + num(werte[f.key] ?? ""), 0);
    const aktienWert = num(aktien);
    const aktienAnrechenbar = methode === "voll" ? aktienWert : aktienWert * ANTEIL_SATZ;
    const brutto = sonstiges + aktienAnrechenbar;
    const netto = Math.max(0, brutto - num(schulden));

    // Nisab ueber den Goldpreis je Gramm. Der Silber-Nisab liegt niedriger,
    // erfasst also mehr Menschen; viele Gelehrte empfehlen ihn deshalb, weil er
    // fuer die Empfaenger guenstiger ist.
    const gp = num(goldpreis);
    // Silberpreis wird ueber ein grobes Wertverhaeltnis nicht geschaetzt, sondern
    // separat abgefragt waere praeziser. Bewusste Vereinfachung: der Nutzer traegt
    // den Preis je Gramm der gewaehlten Basis selbst ein.
    const nisab = gp * (nisabBasis === "gold" ? NISAB_GOLD_GRAMM : NISAB_SILBER_GRAMM);
    const pflichtig = nisab > 0 && netto >= nisab;

    return {
      brutto,
      netto,
      nisab,
      pflichtig,
      zakat: pflichtig ? netto * ZAKAT_SATZ : 0,
      aktienWert,
      aktienAnrechenbar,
    };
  }, [werte, aktien, schulden, methode, goldpreis, nisabBasis]);

  const inputClass =
    "w-full rounded-xl border border-border bg-white px-4 py-3 pr-10 text-[15px] font-medium text-foreground outline-none transition focus:border-primary/50";

  return (
    <section className="container max-w-5xl pt-10 md:pt-14 pb-4">
      <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-6 md:gap-8 items-start">
        {/* ── Eingaben ─────────────────────────────────────────────── */}
        <div className="rounded-[1.5rem] bg-card border border-border/70 p-5 md:p-7 shadow-[0_20px_50px_-30px_rgba(80,60,20,0.25)]">
          <h2 className="headline text-xl md:text-2xl">Dein Vermögen am Stichtag</h2>
          <p className="mt-2 text-[14px] text-muted-foreground leading-relaxed">
            Trag ein, was du seit einem Mondjahr besitzt. Leere Felder bleiben null.
          </p>

          <div className="mt-6 space-y-4">
            {VERMOEGEN.map((f) => (
              <div key={f.key}>
                <label className="block text-xs font-semibold text-foreground/70 mb-1.5" htmlFor={f.key}>
                  {f.label}
                </label>
                <div className="relative">
                  <input
                    id={f.key}
                    inputMode="decimal"
                    placeholder="0"
                    value={werte[f.key] ?? ""}
                    onChange={(e) => setWerte((w) => ({ ...w, [f.key]: e.target.value }))}
                    className={inputClass}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                    €
                  </span>
                </div>
                {f.hint && <p className="mt-1 text-[12px] text-muted-foreground">{f.hint}</p>}
              </div>
            ))}

            {/* Aktien und ETFs bekommen eine eigene Behandlung, weil genau hier
                die Gelehrtenmeinungen auseinandergehen. */}
            <div className="rounded-2xl bg-surface border border-border/70 p-4">
              <label className="block text-xs font-semibold text-foreground/70 mb-1.5" htmlFor="aktien">
                Aktien und ETFs
              </label>
              <div className="relative">
                <input
                  id="aktien"
                  inputMode="decimal"
                  placeholder="0"
                  value={aktien}
                  onChange={(e) => setAktien(e.target.value)}
                  className={inputClass}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                  €
                </span>
              </div>

              <p className="mt-3 text-[12px] font-semibold text-foreground/70">
                Wie soll gerechnet werden?
              </p>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMethode("anteil")}
                  className={`rounded-xl border px-3 py-2.5 text-left transition ${
                    methode === "anteil"
                      ? "border-primary bg-white shadow-sm"
                      : "border-border bg-white/60 hover:border-primary/40"
                  }`}
                >
                  <span className="block text-[13px] font-semibold text-foreground">
                    Langfristig gehalten
                  </span>
                  <span className="block text-[11px] text-muted-foreground leading-snug">
                    Nur der zakatpflichtige Anteil, hier mit {Math.round(ANTEIL_SATZ * 100)} % geschätzt
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setMethode("voll")}
                  className={`rounded-xl border px-3 py-2.5 text-left transition ${
                    methode === "voll"
                      ? "border-primary bg-white shadow-sm"
                      : "border-border bg-white/60 hover:border-primary/40"
                  }`}
                >
                  <span className="block text-[13px] font-semibold text-foreground">
                    Zum Handel gehalten
                  </span>
                  <span className="block text-[11px] text-muted-foreground leading-snug">
                    Voller Marktwert, wie Handelsware
                  </span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground/70 mb-1.5" htmlFor="schulden">
                Kurzfristig fällige Schulden
              </label>
              <div className="relative">
                <input
                  id="schulden"
                  inputMode="decimal"
                  placeholder="0"
                  value={schulden}
                  onChange={(e) => setSchulden(e.target.value)}
                  className={inputClass}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                  €
                </span>
              </div>
              <p className="mt-1 text-[12px] text-muted-foreground">
                Was in den nächsten zwölf Monaten fällig wird, wird abgezogen.
              </p>
            </div>
          </div>
        </div>

        {/* ── Ergebnis ─────────────────────────────────────────────── */}
        <div className="lg:sticky lg:top-24 space-y-4">
          <div className="rounded-[1.5rem] bg-primary text-white p-6 md:p-7 shadow-[0_25px_60px_-30px_rgba(0,0,0,0.6)]">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
              Deine Zakat
            </span>
            <p className="headline text-4xl md:text-5xl mt-3 text-white">
              {eur(ergebnis.zakat)}
            </p>
            <p className="mt-2 text-[13px] text-white/70 leading-relaxed">
              {ergebnis.pflichtig
                ? `2,5 % von ${eur(ergebnis.netto)} zakatpflichtigem Vermögen.`
                : "Dein Vermögen liegt unter dem Nisab. Dann ist keine Zakat fällig."}
            </p>

            <div className="mt-5 pt-5 border-t border-white/15 space-y-2.5 text-[13px]">
              <div className="flex justify-between gap-3">
                <span className="text-white/60">Anrechenbares Vermögen</span>
                <span className="font-semibold">{eur(ergebnis.brutto)}</span>
              </div>
              {ergebnis.aktienWert > 0 && (
                <div className="flex justify-between gap-3">
                  <span className="text-white/60">davon Aktien und ETFs</span>
                  <span className="font-semibold">{eur(ergebnis.aktienAnrechenbar)}</span>
                </div>
              )}
              <div className="flex justify-between gap-3">
                <span className="text-white/60">Nach Abzug der Schulden</span>
                <span className="font-semibold">{eur(ergebnis.netto)}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-white/60">Nisab-Schwelle</span>
                <span className="font-semibold">{eur(ergebnis.nisab)}</span>
              </div>
            </div>
          </div>

          {/* Nisab-Einstellung: bewusst sichtbar, weil das Ergebnis daran haengt. */}
          <div className="rounded-2xl bg-card border border-border/70 p-5">
            <h3 className="text-[14px] font-semibold text-foreground">Nisab festlegen</h3>
            <p className="mt-1 text-[12px] text-muted-foreground leading-relaxed">
              Der Nisab ist die Untergrenze, ab der Zakat fällig wird. Er wird über den
              Gold- oder Silberpreis bestimmt.
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {(["silber", "gold"] as const).map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setNisabBasis(b)}
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
                value={goldpreis}
                onChange={(e) => setGoldpreis(e.target.value)}
                className={inputClass}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                €
              </span>
            </div>
            <p className="mt-2 text-[12px] text-muted-foreground">
              Trag den aktuellen Tagespreis ein. Der Silber-Nisab liegt niedriger und wird
              von vielen Gelehrten bevorzugt, weil er mehr Menschen erfasst und damit den
              Empfängern zugutekommt.
            </p>
          </div>

          <div className="rounded-2xl bg-surface border border-border/70 p-5">
            <div className="flex items-start gap-2.5">
              <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" aria-hidden />
              <p className="text-[12px] text-muted-foreground leading-relaxed">
                Dieser Rechner ist ein Hilfsmittel zur Orientierung und keine Fatwa. Zur
                Behandlung langfristig gehaltener Aktien gibt es unterschiedliche
                Gelehrtenmeinungen. Im Zweifel frag eine Gelehrte oder einen Gelehrten
                deines Vertrauens.
              </p>
            </div>
          </div>

          <Link
            to="/dein-investmentstart"
            className="group flex items-center justify-between gap-3 rounded-2xl border border-primary/60 bg-white px-5 py-4 transition hover:border-primary hover:-translate-y-[1px]"
          >
            <span className="text-[14px] font-semibold text-foreground">
              Noch kein Depot für deine Anlagen?
            </span>
            <ArrowRight className="h-4 w-4 text-primary shrink-0 transition group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ZakatCalculator;
