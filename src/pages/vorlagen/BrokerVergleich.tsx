import { ArrowRight } from "lucide-react";
import Seo from "@/components/Seo";
import { MatchUnten } from "@/components/CheckEinstieg";
import AnbieterLogo from "@/components/AnbieterLogo";
import { ANBIETER_LOGOS } from "@/data/anbieterLogos";
import eliasAutor from "@/assets/elias-autor.webp";
import { BROKER_HONORABLE, BROKER_SRC, BROKER_TOP3, brokerLink, type BrokerKarte } from "@/data/brokerFreebie";
import { ereignis } from "@/lib/messung";
import { useEffect, useRef } from "react";

/**
 * /vorlagen/broker-vergleich: Ziel der DM-Wörter BROKER und INVEST.
 * GB1 (Elias 20.11.2026, Vault raw/2026-11-20-elias-gb1-girokonto-broker-freebie-reihenfolge-codex-psychologie.md):
 * Versprechen aus dem Video zuerst („über 30 Broker verglichen … meine Top 3“), dann ein sauberer Vergleich, „am Ende, hey,
 * hier hast du die freie Wahl“, ganz unten der Test für Unsichere. Ersetzt für diese Seite RN16-42 (nur der Check-Kasten,
 * keine Anbieter-Knöpfe). Reihenfolge nach Codex-Gutachten (Vault data/conversion/gb1-codex-gutachten.md); „Kosten pro
 * Order“ fehlt mit Absicht (Regelbuch freebies-und-guides Nie, 07.11.). Zahlen und Belege: `src/data/brokerFreebie.ts`.
 */

const [start, profi, platz3] = BROKER_TOP3;
/** flatex zuerst (Nummer 1 für Profis, BT2), dann Smartbroker+, dann Traders Place: in Tabelle und Wahl dieselbe Reihenfolge. */
const DREI = [profi, start, platz3];
const ROLLE: Record<string, string> = { profi: "Nr. 1 Profis", start: "Nr. 1 Start", platz3: "Nr. 3" };

const grund = (k: BrokerKarte) => {
  if (k.rolle === "profi") return `Für Profis: ${k.etfs} Islamic ETFs und Fonds, dazu Gold und Sukuk.`;
  if (k.rolle === "start")
    return `Für den Start: Sparplan ab ${k.sparplanAb}${k.sparplanKosten === "0 €" ? ", ohne Kosten je Rate" : ""}.`;
  return `${k.etfs} Islamic ETFs und Fonds, Depotgebühr ${k.depotgebuehr}.`;
};

const klick = (k: BrokerKarte) => ereignis("partner_klick", { anbieter: k.out, knopf: k.src, weg: "out", von: "broker-vergleich" });

const ZEILEN: [string, (k: BrokerKarte) => string][] = [
  ["Islamic ETFs und Fonds", (k) => k.etfs],
  ["Gold und Edelmetalle", (k) => k.gold],
  ["Sukuk", (k) => k.sukuk],
  ["Depotgebühr", (k) => k.depotgebuehr],
  ["Sparplan ab", (k) => k.sparplanAb],
  // GB1-02 (Elias 21.11.: „bei Brokern Order ab … Schreibe auch nicht ab“): nur der Grundpreis je Order, ohne „ab“.
  ["Order ab", (k) => k.order.match(/(\d+(?:,\d+)?)\s?€/)?.[1].concat(" €") ?? k.order],
];

const BrokerVergleich = () => {
  const ende = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ende.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const b = new IntersectionObserver((e) => {
      if (!e.some((x) => x.isIntersecting)) return;
      ereignis("freebie_ende", { wort: "broker-vergleich", seite: window.location.pathname });
      b.disconnect();
    }, { threshold: 0.3 });
    b.observe(el);
    return () => b.disconnect();
  }, []);

  return (
    <>
      <Seo
        title="Meine Top 3 Halal Broker im Vergleich | finanzmuslim"
        description="Aus über 30 Brokern verglichen: flatex, Smartbroker+ und Traders Place mit Islamic ETFs, Gold, Sukuk und Kosten. Dazu Scalable Capital als Honorable Mention."
        path="/vorlagen/broker-vergleich"
        brotkrumen={[{ name: "Top 3 Halal Broker", path: "/vorlagen/broker-vergleich" }]}
      />
      <main className="bg-background" data-vorlage="broker-vergleich">
        <div className="mx-auto w-full max-w-[640px] px-4 pb-16 pt-8 md:pt-12">
          {/* 1. Versprechen aus dem Video */}
          <header data-broker-versprechen>
            <div className="flex items-center gap-3">
              <img src={eliasAutor} alt="Elias El-Gendy" width={44} height={44} className="h-11 w-11 rounded-full object-cover" />
              <p className="text-[15px] leading-tight text-foreground">
                <b>Elias El-Gendy</b>
                <br />
                Über 30 Broker verglichen
              </p>
            </div>
            <h1 className="mt-5 text-[32px] font-extrabold leading-[1.1] tracking-tight text-foreground md:text-[40px]">
              Das sind meine Top 3 Broker
            </h1>
            <p className="mt-3 text-[18px] leading-snug text-foreground">Alle drei zahlen keine Zinsen auf dein Guthaben.</p>
          </header>

          {/* 2. Der Vergleich */}
          <section className="mt-8" data-broker-tabelle>
            <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
              <table className="w-full min-w-[340px] border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th scope="col" className="w-[28%] px-2 py-3"><span className="sr-only">Merkmal</span></th>
                    {DREI.map((k, i) => (
                      <th key={k.id} scope="col" className="px-1 pb-3 pt-2 text-center align-top">
                        <span className={`mb-2 flex min-h-[36px] items-center justify-center rounded px-1.5 py-0.5 text-[12px] font-bold leading-tight ${i < 2 ? "bg-primary text-primary-foreground" : "bg-accent text-primary"}`}>
                          {ROLLE[k.rolle]}
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
                  {ZEILEN.map(([titel, wert], z) => (
                    <tr key={titel}>
                      <th scope="row" className="px-2 py-3 text-left text-[14px] font-semibold leading-tight text-foreground">{titel}</th>
                      {DREI.map((k) => (
                        <td key={k.id} className={`whitespace-nowrap px-1.5 py-3 text-center align-middle text-[15px] leading-tight text-foreground ${z === 0 ? "font-extrabold" : ""}`}>
                          {wert(k)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 3. Zwei Regeln */}
          <section className="mt-8 rounded-xl border border-border bg-card p-4" data-broker-regeln>
            <p className="text-[17px] font-extrabold text-foreground">So bleibt dein Depot ohne Zinsen</p>
            <ul className="mt-2 space-y-1.5 text-[16px] leading-snug text-foreground">
              <li>Bei flatex lehnst du den Kreditrahmen ab.</li>
              <li>Ein Zinskonto oder Tagesgeld eröffnest du nicht.</li>
            </ul>
          </section>

          {/* 4. Freie Wahl */}
          <section ref={ende} className="mt-12" data-broker-wahl>
            <h2 className="text-[26px] font-extrabold leading-tight text-foreground">Du hast die freie Wahl</h2>
            <p className="mt-1 text-[15px] leading-snug text-foreground">Werbung: Über meine Links bekomme ich eine Provision, für dich kostet es nichts extra.</p>
            <ul className="mt-4 grid gap-4">
              {DREI.map((k, i) => (
                <li key={k.id} className={`rounded-xl bg-card p-4 ${i < 2 ? "border-2 border-primary" : "border border-border"}`} data-broker-karte={k.out}>
                  <div className="flex items-center gap-3">
                    <AnbieterLogo name={k.name} domain={k.domain} gross />
                    {!ANBIETER_LOGOS[k.domain] && <p className="text-[20px] font-extrabold leading-tight text-foreground">{k.name}</p>}
                    <span className="ml-auto text-[13px] font-bold text-primary">{ROLLE[k.rolle]}</span>
                  </div>
                  <p className="mt-2 text-[16px] leading-snug text-foreground">{grund(k)}</p>
                  <a href={brokerLink(k.out, k.src)} rel="sponsored noopener" onClick={() => klick(k)} className="btn-spark mt-3 w-full">
                    Bei {k.name} eröffnen*
                    <ArrowRight className="h-5 w-5" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[16px] leading-snug text-foreground" data-broker-weitere>
              Honorable Mention:{" "}
              <a
                href={brokerLink(BROKER_HONORABLE.out, BROKER_HONORABLE.src)}
                rel="sponsored noopener"
                onClick={() => klick(BROKER_HONORABLE)}
                className="font-bold text-primary hover:underline"
              >
                {BROKER_HONORABLE.name}*
              </a>
            </p>
          </section>

          {/* 5. Für Unsichere: der Test */}
          <MatchUnten
            data-broker-test
            className="mt-10"
            frage="Noch unsicher, welcher?"
            art="depot"
            quelle="broker-vergleich"
            to={`/check?quelle=broker-vergleich&src=${BROKER_SRC.vergleich}`}
            onClick={() => ereignis("freebie_check_klick", { check: true, quelle: "broker-vergleich", im: "freebie", stelle: "ende" })}
          />
        </div>
      </main>
    </>
  );
};

export default BrokerVergleich;
