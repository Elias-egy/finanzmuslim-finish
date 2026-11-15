import { useEffect, useRef, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Trophy } from "lucide-react";
import Seo from "@/components/Seo";
import NewsletterBox from "@/components/NewsletterBox";
import AnbieterLogo from "@/components/AnbieterLogo";
import { BROKER_HONORABLE, BROKER_SRC, BROKER_TOP3, brokerLink, type BrokerKarte } from "@/data/brokerFreebie";
import { ereignis } from "@/lib/messung";

/**
 * /vorlagen/broker-vergleich: das Broker-Freebie zum Kommentar-Wort BROKER (Elias, 13.11.2026, BT1): „ähnlich wie bei den
 * Girokonten-Ding. Jetzt will ich die Top 3 aus Smart Broker, Flatex und … Traders Place. Scalable dann auf Platz 4 oder
 * sag Honorable Mention Scalable.“ Aufbau seit BT2 (Elias, 13.11.2026, raw/2026-11-13-elias-bt2-02-broker-freebie-drei-im-vergleich-zuerst.md):
 * ein Zustand als Titel, als Einleitung die drei im Vergleich in einem Kasten, dann die drei untereinander („Nummer 1 für
 * Profis“ zuerst, „Nummer 1 für den Start“ zweitens, groß und deutlich), darunter klein „Honorable Mention“ mit Scalable,
 * am Ende die Regeln, die das Depot ohne Zinsen halten, Kennzeichnung Werbung. Je Anbieter ein Knopf. Alle Zahlen und Belege: `src/data/brokerFreebie.ts` (aus dem Depot-Vergleich). Keine
 * Prämie, keine Bedingung: Das sieht der Leser beim Anbieter (Regelbuch freebies-und-guides: „Kein Kleingedrucktes“).
 */
const Werbung = () => <span className="text-[12px] text-muted-foreground">Werbung</span>;

const Haken = ({ children }: { children: ReactNode }) => (
  <li className="flex items-start gap-3 text-[17px] leading-snug text-foreground">
    <span className="mt-px flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gain text-white dark:text-[#0B0D12]">
      <Check className="h-4 w-4" strokeWidth={3} aria-hidden />
    </span>
    <span>{children}</span>
  </li>
);

const Knopf = ({ k, children }: { k: BrokerKarte; children: ReactNode }) => (
  <Link to={brokerLink(k.out, k.src)} rel="sponsored" className="btn-spark w-full sm:w-auto" data-broker-knopf={k.out}>
    {children}
    <ArrowRight className="h-5 w-5" aria-hidden />
  </Link>
);

const Zelle = ({ children, fett }: { children: ReactNode; fett?: boolean }) => (
  <td
    className={`px-1.5 py-3 text-center align-middle text-[15px] leading-tight ${/^[\d.,]+( von \d+| €)?$/.test(String(children).replace(/\s/g, " ")) ? "whitespace-nowrap" : ""} ${fett ? "font-extrabold text-foreground" : "text-foreground"}`}
  >
    {children}
  </td>
);

const AUSZEICHNUNG: Partial<Record<BrokerKarte["rolle"], string>> = {
  profi: "Nummer 1 für Profis",
  start: "Nummer 1 für den Start",
};

const Karte = ({ k }: { k: BrokerKarte }) => {
  const auszeichnung = AUSZEICHNUNG[k.rolle];
  return (
    <li
      className={`overflow-hidden rounded-lg bg-card ${auszeichnung ? "border-2 border-primary" : "border border-border"}`}
      data-broker-karte={k.out}
    >
      {auszeichnung && (
        <div
          className="flex items-center gap-2.5 bg-primary px-4 py-3 text-[19px] font-extrabold leading-tight text-primary-foreground md:px-5 md:text-[21px]"
          data-broker-auszeichnung
        >
          <Trophy className="h-6 w-6 shrink-0" aria-hidden />
          {auszeichnung}
        </div>
      )}
      <div className="p-4 md:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <AnbieterLogo name={k.name} domain={k.domain} rand />
            <div className="min-w-0">
              <p className="text-[24px] font-extrabold leading-tight text-foreground">{k.name}</p>
              {k.rolle === "platz3" && (
                <span className="mt-1 inline-block rounded bg-accent px-2.5 py-0.5 text-[13px] font-bold text-primary">Platz 3</span>
              )}
            </div>
          </div>
          <Werbung />
        </div>
        <ul className="mt-4 space-y-2.5">
          {k.zinsfrei && <Haken>Guthaben ohne Zinsen</Haken>}
          <Haken>
            Islamic ETFs und Fonds: <b className="whitespace-nowrap">{k.etfs}</b>
          </Haken>
          <Haken>
            Gold und Edelmetalle: <b className="whitespace-nowrap">{k.gold}</b>
          </Haken>
          <Haken>
            Depotgebühr <b className="whitespace-nowrap">{k.depotgebuehr}</b>, Sparplan ab <b className="whitespace-nowrap">{k.sparplanAb}</b>
          </Haken>
        </ul>
        {k.kreditAutomatisch && (
          <p className="mt-3 text-[16px] font-semibold leading-snug text-foreground" data-broker-kredit>
            Bei {k.name} lehnst du den Kreditrahmen ab. Die Anleitung nach dem Klick zeigt dir, wie.
          </p>
        )}
        <div className="mt-4">
          <Knopf k={k}>
            Bei {k.name} eröffnen*
          </Knopf>
        </div>
      </div>
    </li>
  );
};

/**
 * Messung wie auf der Girokonto-Seite: Der letzte Abschnitt (die Regeln) zählt als Ende des Freebies, einmal je Aufruf,
 * ab 30 % im Bild.
 */
const useFreebieEnde = () => {
  const ende = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ende.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const beobachter = new IntersectionObserver((eintraege) => {
      if (!eintraege.some((e) => e.isIntersecting)) return;
      ereignis("freebie_ende", { wort: "broker", seite: window.location.pathname });
      beobachter.disconnect();
    }, { threshold: 0.3 });
    beobachter.observe(el);
    return () => beobachter.disconnect();
  }, []);
  return ende;
};

const [start, profi, platz3] = BROKER_TOP3;
/** Die drei untereinander (Elias, 13.11.2026, BT2): „Nummer 1 für Profis“ zuerst, „Nummer 1 für den Start“ zweitens, dann der dritte. */
const UNTEREINANDER = [profi, start, platz3];

const BrokerVergleich = () => {
  const ende = useFreebieEnde();
  return (
    <>
      <Seo
        title="Meine Top 3 Halal Broker im Vergleich | finanzmuslim"
        description="Smartbroker+, flatex und Traders Place im Vergleich: Islamic ETFs, Gold, Kosten und der Weg zur Eröffnung. Dazu Scalable Capital als Honorable Mention."
        path="/vorlagen/broker-vergleich"
        brotkrumen={[{ name: "Top 3 Halal Broker", path: "/vorlagen/broker-vergleich" }]}
      />
      <main className="bg-background" data-vorlage="broker-vergleich">
        <div className="mx-auto w-full max-w-[640px] px-4 pb-16 pt-8 md:pt-12">
          {/* Kopf: der Zustand, den der Leser haben will */}
          <header>
            <h1 className="text-[32px] font-extrabold leading-[1.1] tracking-tight text-foreground md:text-[40px]">
              Meine Top 3 Halal Broker im Vergleich
            </h1>
            <p className="mt-3 text-[18px] leading-snug text-foreground/85">
              Alle drei ohne Zinsen auf dein Guthaben, mit Islamic ETFs und Gold. Such dir deinen aus.
            </p>
          </header>

          {/* Einleitung: die drei im Vergleich in einem Kasten */}
          <section className="mt-6" data-broker-vergleich>
            <h2 className="text-[26px] font-extrabold leading-tight text-foreground">Die drei im Vergleich</h2>
            <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-card shadow-sm" data-broker-tabelle>
              <table className="w-full min-w-[340px] border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th scope="col" className="w-[26%] px-2 py-3 text-left text-[13px] font-semibold text-foreground/70">
                      <span className="sr-only">Merkmal</span>
                    </th>
                    {BROKER_TOP3.map((k) => (
                      <th key={k.id} scope="col" className="px-1 py-3 text-center">
                        <span className="mx-auto flex w-fit flex-col items-center gap-1.5">
                          <AnbieterLogo name={k.name} domain={k.domain} rand />
                          <span className="text-[14px] font-extrabold leading-tight text-foreground">{k.name}</span>
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="[&>tr]:border-b [&>tr]:border-border [&>tr:nth-child(even)]:bg-accent/40 last:[&>tr]:border-0">
                  {(
                    [
                      ["Islamic ETFs und Fonds", (k: BrokerKarte) => k.etfs, true],
                      ["Gold und Edelmetalle", (k: BrokerKarte) => k.gold, false],
                      ["Sukuk", (k: BrokerKarte) => k.sukuk, false],
                      ["Depotgebühr", (k: BrokerKarte) => k.depotgebuehr, false],
                      ["Kosten pro Order", (k: BrokerKarte) => k.order, false],
                      ["Sparplan ab", (k: BrokerKarte) => k.sparplanAb, false],
                    ] as const
                  ).map(([titel, wert, fett]) => (
                    <tr key={titel}>
                      <th scope="row" className="px-2 py-3 text-left text-[14px] font-semibold leading-tight text-foreground">
                        {titel}
                      </th>
                      {BROKER_TOP3.map((k) => (
                        <Zelle key={k.id} fett={fett}>
                          {wert(k)}
                        </Zelle>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Die drei untereinander: Profis zuerst, Start zweitens, dann der dritte */}
          <section className="mt-12" data-broker-nr1>
            <h2 className="text-[26px] font-extrabold leading-tight text-foreground">Die drei einzeln</h2>
            <ul className="mt-4 grid gap-5">
              {UNTEREINANDER.map((k) => (
                <Karte key={k.id} k={k} />
              ))}
            </ul>
          </section>

          {/* Honorable Mention */}
          <section className="mt-10" data-broker-weitere>
            <h3 className="text-[15px] font-bold uppercase tracking-wide text-foreground/70">Honorable Mention</h3>
            <ul className="mt-3 grid gap-4">
              <Karte k={BROKER_HONORABLE} />
            </ul>
            <p className="mt-4 text-[17px] leading-snug text-foreground" data-broker-scalable>
              Scalable bleibt bei mir S-Tier. In meiner Liste ist er ganz knapp nach unten gerückt.
            </p>
          </section>

          {/* So bleibt es ohne Zinsen */}
          <section ref={ende} className="mt-12 rounded-lg border border-border bg-card p-5 md:p-6" data-broker-regeln>
            <h2 className="text-[22px] font-extrabold leading-tight text-foreground">Zwei Regeln halten dein Depot ohne Zinsen</h2>
            <ul className="mt-4 space-y-3">
              <Haken>
                <strong>Zinskonto und Tagesgeld nicht eröffnen.</strong> Smartbroker+, Traders Place und Scalable bieten eins als
                eigenes Konto an. Es entsteht nur, wenn du es selbst eröffnest.
              </Haken>
              <Haken>
                <strong>Bei flatex den Kreditrahmen ablehnen.</strong> flatex richtet ihn bei der Eröffnung automatisch ein. Ein Kredit
                kostet Zinsen, sobald du ihn nutzt.
              </Haken>
            </ul>
            <Link
              to={`/vergleich/depot?src=${BROKER_SRC.vergleich}`}
              className="mt-4 inline-flex min-h-[44px] items-center gap-1 text-[16px] font-semibold text-primary hover:underline"
            >
              Alle Depots im Vergleich
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </section>

          <p className="mt-8 text-[14px] leading-snug text-muted-foreground" data-werbehinweis>
            * Werbung: Eröffnest du über meinen Link ein Depot, bekomme ich eine Provision, ohne Mehrkosten für dich. Preise und
            Angebote können sich jederzeit ändern.
          </p>

          <section className="mt-14">
            <NewsletterBox />
          </section>
        </div>
      </main>
    </>
  );
};

export default BrokerVergleich;
