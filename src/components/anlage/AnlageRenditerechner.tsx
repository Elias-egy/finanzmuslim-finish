import { useMemo, useState } from "react";
import type { Kurs } from "@/lib/kurse";

/**
 * Kleines Rechenmodul direkt auf der Anlageseite: "Was wäre aus meinen
 * Einzahlungen geworden?" Die Rendite ist fest die historische
 * Durchschnittsrendite dieser Anlage, live aus der längsten verfügbaren
 * Kursreihe (`kurs.reihe`, monatlich) berechnet, annualisiert über die
 * tatsächlich verfügbare Zeitspanne. Kein Sparplan-Chart, keine
 * Portfolio-Auswahl — das leistet bereits /renditerechner.
 */

const monatsNamen = [
  "Jan.", "Feb.", "März", "April", "Mai", "Juni",
  "Juli", "Aug.", "Sept.", "Okt.", "Nov.", "Dez.",
];

const datumLang = (s: string) => {
  const [j, m] = s.split("-");
  return `${monatsNamen[Number(m) - 1] ?? m} ${j}`;
};

const euro = (n: number) =>
  new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);

const prozent = (n: number) =>
  `${n > 0 ? "+" : n < 0 ? "−" : ""}${Math.abs(n).toFixed(1).replace(".", ",")}`;

/** Historische Jahresrendite aus der längsten verfügbaren Kursreihe. Unter
 *  sechs Monaten Historie gibt es keine sinnvolle Hochrechnung — bei zwei
 *  Monatspunkten würde eine Annualisierung eine erfundene Zahl vortäuschen. */
const historischeJahresrendite = (kurs: Kurs | undefined) => {
  const punkte = kurs?.reihe;
  if (!punkte || punkte.length < 2) return null;
  const erster = punkte[0];
  const letzter = punkte[punkte.length - 1];
  const monate = punkte.length - 1;
  if (monate < 6 || !erster[1]) return null;
  const jahre = monate / 12;
  const gesamtrendite = (letzter[1] - erster[1]) / erster[1];
  const proJahr = (1 + gesamtrendite) ** (1 / jahre) - 1;
  return { proJahr, startDatum: erster[0], jahre };
};

const inputCls =
  "w-full rounded-lg border border-border bg-card px-3 py-2.5 text-[15px] font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30";

type Props = { kurs: Kurs | undefined; name: string };

const AnlageRenditerechner = ({ kurs, name }: Props) => {
  const [einmalig, setEinmalig] = useState(1000);
  const [monatlich, setMonatlich] = useState(50);
  const [jahre, setJahre] = useState(10);

  const rendite = useMemo(() => historischeJahresrendite(kurs), [kurs]);

  const ergebnis = useMemo(() => {
    if (!rendite) return null;
    const monatsrate = (1 + rendite.proJahr) ** (1 / 12) - 1;
    let wert = Math.max(0, einmalig);
    const beitragMonat = Math.max(0, monatlich);
    for (let i = 0; i < jahre * 12; i++) {
      wert = wert * (1 + monatsrate) + beitragMonat;
    }
    const eingezahlt = Math.max(0, einmalig) + beitragMonat * 12 * jahre;
    return { endwert: wert, eingezahlt, ertrag: wert - eingezahlt };
  }, [rendite, einmalig, monatlich, jahre]);

  if (!rendite || !ergebnis) {
    return (
      <div className="rounded-xl bg-accent px-4 py-6 text-[15px] leading-[24px] text-muted-foreground">
        Für eine Hochrechnung reicht die Kurshistorie dieser Anlage noch nicht.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
      <h3 className="text-[18px] font-bold text-foreground">Was wäre daraus geworden?</h3>
      <p className="mt-1 text-[14px] text-muted-foreground">
        Rechne mit der historischen Rendite von {name}, ohne selbst eine Zahl schätzen zu müssen.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-[13px] font-semibold text-muted-foreground">
            Einmalige Einzahlung
          </label>
          <div className="relative">
            <input
              type="number"
              inputMode="numeric"
              min={0}
              step={100}
              value={einmalig}
              onChange={(e) => setEinmalig(Math.max(0, Number(e.target.value) || 0))}
              className={`${inputCls} pr-8`}
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              €
            </span>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-[13px] font-semibold text-muted-foreground">
            Monatliche Einzahlung
          </label>
          <div className="relative">
            <input
              type="number"
              inputMode="numeric"
              min={0}
              step={10}
              value={monatlich}
              onChange={(e) => setMonatlich(Math.max(0, Number(e.target.value) || 0))}
              className={`${inputCls} pr-8`}
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              €
            </span>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-[13px] font-semibold text-muted-foreground">
            Anlagedauer
          </label>
          <div className="relative">
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={40}
              step={1}
              value={jahre}
              onChange={(e) => setJahre(Math.min(40, Math.max(1, Number(e.target.value) || 1)))}
              className={`${inputCls} pr-14`}
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-muted-foreground">
              Jahre
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-xl bg-accent px-4 py-4 sm:px-5 sm:py-5">
        <p className="text-[13px] text-muted-foreground">
          Geschätzter Wert nach {jahre} {jahre === 1 ? "Jahr" : "Jahren"}
        </p>
        <p className="mt-1 text-[28px] font-bold leading-tight text-foreground md:text-[32px]">
          {euro(ergebnis.endwert)}
        </p>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-[14px]">
          <span className="text-muted-foreground">
            Eingezahlt <span className="font-semibold text-foreground">{euro(ergebnis.eingezahlt)}</span>
          </span>
          <span className="text-muted-foreground">
            Ertrag <span className="font-semibold text-foreground">{euro(ergebnis.ertrag)}</span>
          </span>
        </div>
      </div>

      <p className="mt-3 text-[13px] leading-[20px] text-muted-foreground">
        Gerechnet mit {prozent(rendite.proJahr * 100)} % pro Jahr, der Durchschnittsrendite von{" "}
        {name} seit {datumLang(rendite.startDatum)}. Vergangene Renditen sagen nichts über die
        Zukunft, das ist keine Anlageberatung.
      </p>
    </div>
  );
};

export default AnlageRenditerechner;
