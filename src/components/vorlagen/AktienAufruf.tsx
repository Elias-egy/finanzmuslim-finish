import { Link } from "react-router-dom";
import { ArrowRight, Check, Timer } from "lucide-react";
import AnbieterLogo from "@/components/AnbieterLogo";
import { depotAnzeige } from "@/data/vergleichAnzeige";
import { depotNummerEinsZiel } from "@/lib/depotNummerEins";

/**
 * Der Depot-Aufruf im Freebie „Aktie“ (100 Halal-Aktien), seit AF1 (12.11.2026) direkt nach den 15 gefallenen großen
 * Namen. Elias wortgleich (Vault `raw/2026-11-12-elias-af1-01-…`, `-af1-02-…`): „investiere halal in unter 10 Minuten
 * oder so, oder näher dran, werde Teil davon in unter 10 Minuten“, „Und dann kommt, Top Broker für Profis, Top Broker
 * für das und das“, „sag auch nicht, jetzt investiere und werde reich“. Die zwei Anbieter sind die zwei Nummer 1 des
 * Depot-Vergleichs als Kombo (Regelbuch vergleiche-und-rangfolge.md, 09.11.: „links für Neustarter Smartbroker+ (0 Euro
 * Depotgebühren), rechts für Profis flatex (12 von 12 Anlagen …)“); löst Traders Place und flatex vom 07.11. ab. Der
 * Timer kommt aus Regelbuch freebies-und-guides.md (08.11.: „Timer auf 10 Minuten stellen“), das Zitat von dort
 * („Guides oder Informationen, auf die keine Handlungen folgen, sind nur Informationen.“), das Foto statt „Meine besten
 * Alternativen“ ebenso (08.11.: „ein Bild von mir und dann irgendwie Zitat“).
 *
 * Zahlen aus dem Depot-Vergleich (Anbieter-Belege in `brokerVergleich.ts`). Zwei Angaben stehen nur hier:
 * - „Sparplan ab 1 €“ bei flatex: flatex.de/produkte-handel/produkte/sparplaene, gelesen 07.11.2026: „Ab sofort können Sie
 *   Sparpläne bereits ab 1 € Sparrate anlegen – statt bisher 25 €.“ Der Depot-Vergleich führt noch 25 € (Stand 07.10.).
 * - „40 Handelsplätze“: flatex.de, Startseite, gelesen 07.11.2026: „Zugang zu 40 Handelsplätzen“.
 * Der automatische Kreditrahmen von flatex steht als Regel auf der Startseite /dein-investmentstart/flatex, wohin der
 * Knopf führt; darum hier kein „Guthaben ohne Zinsen“ bei flatex.
 */
type Angebot = {
  id: string;
  name: string;
  domain: string;
  etikett: string;
  punkte: { text: string; wert?: string }[];
  ziel: string;
  stelle: "nr1" | "top3";
};

const werte = (id: string) => {
  const a = depotAnzeige.find((x) => x.id === id);
  if (!a) throw new Error(`Depot fehlt im Vergleich: ${id}`);
  return { a, w: a.werte as Record<string, unknown> };
};

const sb = werte("smartbroker-plus-depot");
const fx = werte("flatex-depot");

// Ist ein Anbieter die Nummer 1 des Depot-Vergleichs, führt sein Knopf wie überall auf /depot-nummer-1 (CV15F).
const nr1 = depotNummerEinsZiel();
const ziel = (link?: string) => (link && nr1 === link ? "/depot-nummer-1" : (link ?? "/vergleich/depot"));
const stelle = (link?: string): Angebot["stelle"] => (link && nr1 === link ? "nr1" : "top3");

const ANGEBOTE: readonly Angebot[] = [
  {
    id: sb.a.id,
    name: sb.a.name,
    domain: sb.a.domain ?? "smartbrokerplus.de",
    etikett: "Top für den Start",
    punkte: [
      { text: "Depotgebühr:", wert: String(sb.w.depotgebuehr ?? "").replace("€", " €") },
      ...(sb.w.zinsfreiAbStart === "gut" ? [{ text: "Guthaben ohne Zinsen" }] : []),
      { text: "Sparplan ab", wert: "1 €" },
    ],
    ziel: ziel(sb.a.link),
    stelle: stelle(sb.a.link),
  },
  {
    id: fx.a.id,
    name: fx.a.name,
    domain: fx.a.domain ?? "flatex.de",
    etikett: "Top für Profis",
    punkte: [
      { text: "Islamic ETFs und Fonds:", wert: String(fx.w.halalEtfsFonds ?? "") },
      { text: "Gold und Edelmetalle:", wert: String(fx.w.halalEdelmetalle ?? "") },
      { text: "Handelsplätze:", wert: "40" },
    ],
    ziel: ziel(fx.a.link),
    stelle: stelle(fx.a.link),
  },
];

type Props = {
  /** Link mit der Klickzählung der Seite (Kennungen aknr1, aktop3, akalle in `src/lib/attribution.ts`). */
  link: (ziel: string, stelle: "top3" | "nr1" | "alle") => string;
};

const AktienAufruf = ({ link }: Props) => (
  <div data-depot-aufruf className="rounded-2xl border-2 border-primary bg-card p-4 md:p-7">
    <h2 id="wo" className="text-[28px] font-extrabold leading-[1.1] text-foreground md:text-[34px]">
      Werde Teil davon.
      <br />
      <span className="text-primary">In unter 10 Minuten.</span>
    </h2>
    <p className="mt-3 text-[17px] leading-snug text-foreground">
      Die Kurse sind jetzt unten. Wie lange, weiß keiner. Mit deinem Halal-Depot kaufst du Aktien aus dieser Liste, im
      Sparplan <b>schon ab 1 €</b>.
    </p>

    <div className="mt-4 flex items-center gap-3 rounded-xl bg-accent p-3">
      <span className="flex h-12 shrink-0 items-center gap-1.5 rounded-lg bg-card px-3 text-[22px] font-extrabold tabular-nums text-primary">
        <Timer className="h-5 w-5" aria-hidden />
        10:00
      </span>
      <p className="text-[15px] font-semibold leading-snug text-foreground">
        Stell dir einen Timer. So lange dauert die Eröffnung online.
      </p>
    </div>

    <div className="relative mt-5">
      <p className="absolute right-0 top-0 text-[12px] text-muted-foreground">Werbung</p>
      <p className="pr-16 text-[18px] font-extrabold leading-tight text-foreground">Meine zwei Nummer 1</p>
      <ul className="mt-3 grid gap-3 md:grid-cols-2">
        {ANGEBOTE.map((d) => (
          <li key={d.id} className="flex flex-col rounded-xl border border-border bg-card p-4" data-depot-karte>
            <div className="flex items-center gap-3">
              <AnbieterLogo name={d.name} domain={d.domain} rand />
              <div className="min-w-0">
                <p className="text-[20px] font-extrabold leading-tight text-foreground">{d.name}</p>
                <span className="mt-1 inline-block rounded bg-violet/10 px-2.5 py-0.5 text-[13px] font-bold text-violet">
                  {d.etikett}
                </span>
              </div>
            </div>
            <ul className="mt-3 space-y-2">
              {d.punkte.map((p) => (
                <li key={p.text} className="flex items-start gap-2.5 text-[17px] leading-snug text-foreground">
                  <span className="mt-px flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gain text-white dark:text-[#0B0D12]">
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
              className="mt-4 flex min-h-[52px] w-full items-center justify-center rounded-full bg-primary text-[17px] font-bold text-primary-foreground hover:bg-primary/90 md:mt-auto"
            >
              Depot eröffnen*
            </Link>
          </li>
        ))}
      </ul>
      {/* AF1-Prüfer: Wer schon ein Depot hat, braucht einen Grund für ein zweites (Depotgebühr 0 € laut Depot-Vergleich). */}
      <p className="mt-3 text-[15px] font-semibold leading-snug text-foreground">
        Schon ein Depot woanders? Ein zweites Halal-Depot kostet bei {sb.a.name} {String(sb.w.depotgebuehr ?? "").replace("€", " €")} im Jahr.
      </p>
      <Link
        to={link("/vergleich/depot", "alle")}
        className="mt-2 inline-flex min-h-[44px] items-center gap-1 text-[16px] font-semibold text-primary hover:underline"
      >
        Alle Depots im Vergleich
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </div>

    <figure className="mt-3 flex items-center gap-3 border-t border-border pt-4">
      <img
        src="/elias-el-gendy.webp"
        alt="Elias El-Gendy"
        width={48}
        height={48}
        loading="lazy"
        className="h-12 w-12 shrink-0 rounded-full object-cover"
      />
      <blockquote className="text-[15px] font-semibold leading-snug text-foreground">
        „Guides oder Informationen, auf die keine Handlungen folgen, sind nur Informationen.“
        <span className="mt-0.5 block text-[13px] font-normal text-muted-foreground">Elias, finanzmuslim</span>
      </blockquote>
    </figure>
    <p className="mt-3 text-[12px] leading-snug text-muted-foreground">
      * Werbung: Eröffnest du über meinen Link ein Depot, bekomme ich eine Provision, ohne Mehrkosten für dich.
    </p>
  </div>
);

export default AktienAufruf;
