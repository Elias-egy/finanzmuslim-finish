import { useEffect, useRef, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import Seo from "@/components/Seo";
import { MatchUnten } from "@/components/CheckEinstieg";
import AnbieterLogo from "@/components/AnbieterLogo";
import { ANBIETER_LOGOS } from "@/data/anbieterLogos";
import GiroKnopfHinweis from "@/components/GiroKnopfHinweis";
import eliasAutor from "@/assets/elias-autor.webp";
import { BONUS_KONTEN, BBBANK_PRAEMIE, GIRO_BONUS_SRC, GIRO_BONUS_STAND, euro, type BonusKonto } from "@/data/girokontoBonus";
import { KONTEN_GETESTET } from "@/data/halalFinanzCheckKern";
import { findStartPartner } from "@/data/investmentStart";
import { blockerFest, direktLink } from "@/lib/direktLink";
import { ereignis } from "@/lib/messung";

/**
 * /vorlagen/girokonto-bonus: Ziel des DM-Worts KONTO.
 * GB1 (Elias 20.11.2026, Vault raw/2026-11-20-elias-gb1-girokonto-broker-freebie-reihenfolge-codex-psychologie.md):
 * „Am Anfang muss erstmal das Versprechen eingehalten werden … ganz clean wie ein Vergleich, sehr kompetent und dann am
 * Ende, hey, hier hast du die freie Wahl … unten vielleicht nicht sicher welches, hier ist ein Test“. Vorher stand der
 * norisbank-Knopf ganz oben („der drückt dir direkt den Norris-Bank-Link rein, bevor du irgendwas gelesen hast“).
 * Reihenfolge nach Codex-Gutachten (Vault data/conversion/gb1-codex-gutachten.md): Versprechen, Vergleich, zwei Regeln,
 * freie Wahl mit drei gleich großen Knöpfen, Test für Unsichere. Steuersatz, Prämien-Schritte, Pillen, Newsletter raus.
 * Zahlen und Belege: `src/data/girokontoBonus.ts`.
 */

const link = (out: string, stelle: string) => {
  const start = findStartPartner(out);
  return start ? direktLink(start, `?src=${stelle}`) : `/out/${out}?src=${stelle}`;
};

const Knopf = ({ to, anbieter, stelle, children }: { to: string; anbieter: string; stelle: string; children: ReactNode }) =>
  to.startsWith("http") ? (
    <a
      href={blockerFest(anbieter, to, false).href}
      rel="sponsored noopener"
      className="btn-spark w-full"
      onClick={(e) => {
        ereignis("partner_klick", { anbieter, knopf: stelle, weg: "direkt", von: "girokonto-bonus" });
        blockerFest(anbieter, to, false).oeffnen?.(e);
      }}
    >
      {children}
    </a>
  ) : (
    <Link to={to} className="btn-spark w-full">
      {children}
    </Link>
  );

const Ja = () => <Check className="mx-auto h-5 w-5 text-gain" strokeWidth={3} aria-label="ja" />;

/** Ein Grund je Konto, nur aus den Werten in girokontoBonus.ts. */
const GRUND: Record<string, (k: BonusKonto) => string> = {
  "norisbank-top-girokonto": (k) => `Für die meisten: schon ab ${euro(k.gratisAb)} Geldeingang kostenlos.`,
  "bbbank-bettersmart": () => `Wenn du Bargeld in der Filiale einzahlst. Dazu ${euro(BBBANK_PRAEMIE.betrag)} Startprämie für Neukunden.`,
  "consorsbank-girokonto": (k) => `Wenn du kein Bargeld einzahlst: bis ${k.gratisUnter} Jahre immer kostenlos.`,
};

const STELLE: Record<string, string> = {
  "norisbank-top-girokonto": GIRO_BONUS_SRC.norisbank,
  "bbbank-bettersmart": GIRO_BONUS_SRC.warum,
  "consorsbank-girokonto": GIRO_BONUS_SRC.consorsbank,
};

const ZEILEN: [string, (k: BonusKonto) => ReactNode][] = [
  ["Keine Zinsen", () => <Ja />],
  ["Kostenlos unter", (k) => `${k.gratisUnter} Jahren`],
  ["Sonst kostenlos ab", (k) => `${euro(k.gratisAb)} Eingang`],
  ["Startprämie", (k) => (k.id === "bbbank-bettersmart" ? <b className="text-primary">{euro(BBBANK_PRAEMIE.betrag)}</b> : "keine")],
  ["Bargeld einzahlen", (k) => k.bargeld],
];

const GirokontoBonus = () => {
  const ende = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ende.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const b = new IntersectionObserver((e) => {
      if (!e.some((x) => x.isIntersecting)) return;
      ereignis("freebie_ende", { wort: "girokonto", seite: window.location.pathname });
      b.disconnect();
    }, { threshold: 0.3 });
    b.observe(el);
    return () => b.disconnect();
  }, []);

  return (
    <>
      <Seo
        title="Meine Top 3 Girokonten ohne Zinsen | finanzmuslim"
        description={`Aus ${KONTEN_GETESTET} Bankkonten verglichen: norisbank, BBBank und Consorsbank ohne Zinsen, mit Kosten, Bargeld und 50 € Startprämie bei der BBBank.`}
        path="/vorlagen/girokonto-bonus"
        brotkrumen={[{ name: "Top 3 Girokonten", path: "/vorlagen/girokonto-bonus" }]}
      />
      <main className="bg-background" data-vorlage="girokonto-bonus">
        <div className="mx-auto w-full max-w-[640px] px-4 pb-16 pt-8 md:pt-12">
          {/* 1. Versprechen aus dem Video einlösen, noch kein Knopf */}
          <header data-gb-versprechen>
            <div className="flex items-center gap-3">
              <img src={eliasAutor} alt="Elias El-Gendy" width={44} height={44} className="h-11 w-11 rounded-full object-cover" />
              <p className="text-[15px] leading-tight text-foreground">
                <b>Elias El-Gendy</b>
                <br />
                {KONTEN_GETESTET} Bankkonten verglichen
              </p>
            </div>
            <h1 className="mt-5 text-[32px] font-extrabold leading-[1.1] tracking-tight text-foreground md:text-[40px]">
              Das sind meine Top 3 Girokonten
            </h1>
            <p className="mt-3 text-[18px] leading-snug text-foreground">Alle drei zahlen keine Zinsen auf dein Guthaben.</p>
          </header>

          {/* 2. Der Vergleich, kompetent und knapp */}
          <section className="mt-8" data-bonus-tabelle>
            <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
              <table className="w-full min-w-[340px] border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th scope="col" className="w-[28%] px-2 py-3"><span className="sr-only">Merkmal</span></th>
                    {BONUS_KONTEN.map((k, i) => (
                      <th key={k.id} scope="col" className="px-1 pb-3 pt-2 text-center align-top">
                        <span className={`mb-2 flex min-h-[36px] items-center justify-center rounded px-1.5 py-0.5 text-[12px] font-bold leading-tight ${i === 0 ? "bg-primary text-primary-foreground" : "bg-accent text-primary"}`}>
                          Nr. {i + 1}
                        </span>
                        <span className="mx-auto flex w-fit flex-col items-center gap-1.5">
                          <AnbieterLogo name={k.name} domain={k.domain} rand />
                          <span className="text-[14px] font-extrabold leading-tight text-foreground">{k.name}</span>
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="[&>tr]:border-b [&>tr]:border-border [&>tr:nth-child(even)]:bg-accent/40 last:[&>tr]:border-0">
                  {ZEILEN.map(([titel, wert]) => (
                    <tr key={titel}>
                      <th scope="row" className="px-2 py-3 text-left text-[14px] font-semibold leading-tight text-foreground">{titel}</th>
                      {BONUS_KONTEN.map((k) => (
                        <td key={k.id} className="px-1.5 py-3 text-center align-middle text-[15px] leading-tight text-foreground">
                          {wert(k)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 3. Zwei Regeln, damit es ohne Zinsen bleibt */}
          <section className="mt-8 rounded-xl border border-border bg-card p-4" data-bonus-regeln>
            <p className="text-[17px] font-extrabold text-foreground">So bleibt dein Konto ohne Zinsen</p>
            <ul className="mt-2 space-y-1.5 text-[16px] leading-snug text-foreground">
              <li>Kommt ein Tagesgeldkonto mit, lässt du es leer.</li>
              <li>Einen Dispo beantragst du nicht.</li>
            </ul>
          </section>

          {/* 4. Freie Wahl: drei gleich große Knöpfe, je ein Grund */}
          <section ref={ende} className="mt-12" data-bonus-wahl>
            <h2 className="text-[26px] font-extrabold leading-tight text-foreground">Du hast die freie Wahl</h2>
            <p className="mt-1 text-[15px] leading-snug text-foreground">Werbung: Über meine Links bekomme ich eine Provision, für dich kostet es nichts extra.*</p>
            <ul className="mt-4 grid gap-4">
              {BONUS_KONTEN.map((k, i) => (
                <li key={k.id} className={`rounded-xl bg-card p-4 ${i === 0 ? "border-2 border-primary" : "border border-border"}`} data-bonus-karte={k.out}>
                  <div className="flex items-center gap-3">
                    <AnbieterLogo name={k.name} domain={k.domain} gross />
                    {!ANBIETER_LOGOS[k.domain] && <p className="text-[20px] font-extrabold leading-tight text-foreground">{k.name}</p>}
                    <span className="ml-auto text-[13px] font-bold text-primary">Nr. {i + 1}</span>
                  </div>
                  <p className="mt-2 text-[16px] leading-snug text-foreground">{GRUND[k.id](k)}</p>
                  <GiroKnopfHinweis anbieter={k.out} className="mt-3" />
                  <div className="mt-3">
                    <Knopf to={link(k.out, STELLE[k.id])} anbieter={k.out} stelle={STELLE[k.id]}>
                      Bei {k.name} eröffnen*
                      <ArrowRight className="h-5 w-5" aria-hidden />
                    </Knopf>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* 5. Für Unsichere: der Test */}
          <MatchUnten
            data-bonus-test
            className="mt-10"
            frage="Noch unsicher, welches?"
            match={`Finde dein Match aus ${KONTEN_GETESTET} verglichenen Bankkonten.`}
            zahl={KONTEN_GETESTET}
            art="konto"
            quelle="homepage"
            to={`/check?start=2&a1=konto&src=${GIRO_BONUS_SRC.vergleich}test`}
            onClick={() => ereignis("freebie_check_klick", { check: true, quelle: "girokonto-bonus", im: "freebie", stelle: "ende", wort: "konto" })}
          />

          <p className="mt-8 text-[14px] leading-snug text-foreground/80" data-werbehinweis>
            * Angaben am {GIRO_BONUS_STAND} bei den Banken gelesen, Aktionen können sich ändern.
          </p>
        </div>
      </main>
    </>
  );
};

export default GirokontoBonus;
