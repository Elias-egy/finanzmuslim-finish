import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import AnbieterLogo from "@/components/AnbieterLogo";
import { CheckRaster, DEPOT_TITEL } from "@/components/vorlagen/DepotAufruf";
import { CHECK } from "@/data/depotTop3";
import { depotAnzeige } from "@/data/vergleichAnzeige";
import { depotNummerEinsZiel } from "@/lib/depotNummerEins";

/**
 * Der Depot-Aufruf im Freebie „Aktie“ (100 Halal-Aktien), seit FA (07.11.2026) mit genau zwei kleinen Angeboten:
 * Traders Place zuerst, flatex als zweites, je drei Haken, kein Video, keine Kosten pro Order, keine Depotgebühr.
 * Elias wortgleich: Vault `raw/2026-11-07-elias-freebie-aktien-umbau-zwei-angebote.md` („Nur 2 Stück und einmal Traders
 * Place und einmal Flatex“) und `raw/2026-11-07-elias-freebie-aktien-flatex-satz-und-kriterien.md` („Kosten pro Order
 * als Kriterium fällt bei beiden weg“, „größter Handelsplatz“, „12 von 12, 7 von 7“).
 *
 * Die Zahlen kommen aus dem Depot-Vergleich (Anbieter-Belege in `brokerVergleich.ts`). Zwei Angaben stehen nur hier:
 * - „Sparplan ab 1 €“ bei flatex: flatex.de/produkte-handel/produkte/sparplaene, gelesen 07.11.2026: „Ab sofort können Sie
 *   Sparpläne bereits ab 1 € Sparrate anlegen – statt bisher 25 €.“ Der Depot-Vergleich führt noch 25 € (Stand 07.10.).
 * - „40 Handelsplätze“ und „größte Auswahl“: flatex.de, Startseite, gelesen 07.11.2026: „Bei flatex hast du die größte
 *   Auswahl“, „Zugang zu 40 Handelsplätzen“. HSBC: die vier HSBC Islamic ETFs in der Beleg-Liste halalEtfsFonds.
 * Der automatische Kreditrahmen von flatex steht als Regel auf der Startseite /dein-investmentstart/flatex, wohin der
 * Knopf führt; darum hier kein „Guthaben ohne Zinsen“ bei flatex.
 */
type Angebot = {
  id: string;
  name: string;
  domain: string;
  etikett: string;
  satz?: string;
  punkte: { text: string; wert?: string }[];
  ziel: string;
  stelle: "nr1" | "top3";
};

const werte = (id: string) => {
  const a = depotAnzeige.find((x) => x.id === id);
  if (!a) throw new Error(`Depot fehlt im Vergleich: ${id}`);
  return { a, w: a.werte as Record<string, unknown> };
};

const tp = werte("traders-place-depot");
const fx = werte("flatex-depot");

// Traders Place ist die Nummer 1 des Depot-Vergleichs: dann führt der Knopf wie überall auf /depot-nummer-1 (CV15F).
const tpZiel = tp.a.link && depotNummerEinsZiel() === tp.a.link ? "/depot-nummer-1" : (tp.a.link ?? "/vergleich/depot");

const AKTIEN_ANGEBOTE: readonly Angebot[] = [
  {
    id: tp.a.id,
    name: tp.a.name,
    domain: tp.a.domain ?? "tradersplace.de",
    etikett: tpZiel === "/depot-nummer-1" ? "Meine Nummer 1" : "Aus meinem Vergleich",
    punkte: [
      ...(tp.w.zinsfreiAbStart === "gut" ? [{ text: "Guthaben ohne Zinsen" }] : []),
      { text: "Islamic ETFs und Fonds:", wert: String(tp.w.halalEtfsFonds ?? "") },
      { text: "Gold und Edelmetalle:", wert: String(tp.w.halalEdelmetalle ?? "") },
    ],
    ziel: tpZiel,
    stelle: tpZiel === "/depot-nummer-1" ? "nr1" : "top3",
  },
  {
    id: fx.a.id,
    name: fx.a.name,
    domain: fx.a.domain ?? "flatex.de",
    etikett: "Größte Auswahl",
    satz: "Du investierst schon und willst alles? Hier handelst du an 40 Handelsplätzen, auch die Islamic ETFs von HSBC.",
    punkte: [
      { text: "Islamic ETFs und Fonds:", wert: String(fx.w.halalEtfsFonds ?? "") },
      { text: "Gold und Edelmetalle:", wert: String(fx.w.halalEdelmetalle ?? "") },
      { text: "Sparplan ab", wert: "1 €" },
    ],
    ziel: fx.a.link ?? "/vergleich/depot",
    stelle: "top3",
  },
];

type Props = {
  /** Link mit der Klickzählung der Seite (Kennungen aknr1, aktop3, akalle in `src/lib/attribution.ts`). */
  link: (ziel: string, stelle: "top3" | "nr1" | "alle") => string;
};

const AktienAufruf = ({ link }: Props) => (
  <div data-depot-aufruf>
    <h2 id="wo" className="text-[24px] font-extrabold leading-tight text-foreground">
      {DEPOT_TITEL}
    </h2>
    <p className="mt-1 text-[16px] leading-snug text-foreground/80">Die bekanntesten sind nicht gleich die besten.</p>
    <CheckRaster check={CHECK} className="mt-3" />
    <div className="relative mt-5 rounded-lg border border-border bg-card p-4 md:p-6" data-depot-kasten>
      <p className="absolute right-4 top-4 text-[12px] text-muted-foreground md:right-6 md:top-6">Werbung</p>
      <p className="pr-16 text-[22px] font-extrabold leading-tight text-foreground">
        Die besten Alternativen aus meinem Vergleich
      </p>
      <ul className="mt-3 grid gap-3 md:grid-cols-2">
        {AKTIEN_ANGEBOTE.map((d) => (
          <li
            key={d.id}
            className="flex flex-col rounded-lg border border-border bg-card p-4"
            data-depot-karte
          >
            <div className="flex items-center gap-3">
              <AnbieterLogo name={d.name} domain={d.domain} rand />
              <div className="min-w-0">
                <p className="text-[20px] font-extrabold leading-tight text-foreground">{d.name}</p>
                <span className="mt-1 inline-block rounded bg-violet/10 px-2.5 py-0.5 text-[13px] font-bold text-violet">
                  {d.etikett}
                </span>
              </div>
            </div>
            {d.satz && <p className="mt-3 text-[16px] font-semibold leading-snug text-foreground">{d.satz}</p>}
            <ul className="mt-3 space-y-2">
              {d.punkte.map((p) => (
                <li key={p.text} className="flex items-start gap-2.5 text-[17px] leading-snug text-foreground">
                  <span className="mt-px flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gain text-white">
                    <Check className="h-4 w-4" strokeWidth={3} aria-hidden />
                  </span>
                  <span>
                    {p.text}
                    {p.wert && <span className="whitespace-nowrap font-bold"> {p.wert}</span>}
                  </span>
                </li>
              ))}
            </ul>
            <Link
              to={link(d.ziel, d.stelle)}
              className="mt-4 flex min-h-[48px] w-full items-center justify-center rounded-lg bg-primary text-[17px] font-bold text-primary-foreground hover:bg-primary/90 md:mt-auto"
            >
              Zum Angebot*
            </Link>
          </li>
        ))}
      </ul>
      <Link
        to={link("/vergleich/depot", "alle")}
        className="mt-2 inline-flex min-h-[44px] items-center gap-1 text-[16px] font-semibold text-primary hover:underline"
      >
        Alle Depots im Vergleich
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
      <p className="mt-1 text-[12px] leading-snug text-muted-foreground">
        * Werbung: Eröffnest du über meinen Link ein Depot, bekomme ich eine Provision, ohne Mehrkosten für dich.
      </p>
    </div>
  </div>
);

export default AktienAufruf;
