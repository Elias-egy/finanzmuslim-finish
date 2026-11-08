import { Link } from "react-router-dom";
import { ArrowRight, X } from "lucide-react";
import { Tabelle } from "@/components/beitrag";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AppBilder, RH2, RH3, RText, VergleichsRatgeber, VorNachteile, type RatgeberEintrag } from "./VergleichsRatgeber";
import { kostenKurz } from "@/data/kostenKurz";
import { APP_BILDER_ERWARTET, DEPOT_APP_BILDER } from "@/data/depotAppBilder";
import {
  brokerText,
  depotAbgeraten,
  depotAnzahl,
  depotMeisteHalalId,
  depotOhneZinsen,
  depotSiegerId,
  depotVorn,
  nachteil,
  sparplanVon,
  sparplanZeilen,
  tradeRepublicText,
  vorteile,
} from "@/data/depotRatgeber";
import type { RohAnbieter } from "@/data/vergleichHelfer";

const EINTRAEGE: RatgeberEintrag[] = [
  { id: "beste-halal-depots", titel: "Die besten Halal-Depots" },
  { id: "broker-vergleich", titel: "Welcher Broker passt?" },
  { id: "trade-republic-alternative", titel: "Trade Republic Alternative" },
  { id: "depot-kosten", titel: "Depot-Kosten im Vergleich" },
  { id: "nicht-empfohlen", titel: "Nicht empfohlen" },
  { id: "so-vergleichen-wir", titel: "So vergleichen wir" },
  { id: "halal-sparplan", titel: "Halal-Sparplan" },
  { id: "haeufige-fragen", titel: "Häufige Fragen" },
  { id: "unsere-vergleiche", titel: "Unsere Vergleiche" },
];

const VERGLEICHE = [
  { to: "/vergleich/girokonto", name: "Girokonto-Vergleich für Muslime" },
  { to: "/vergleich/edelmetalle", name: "Halal Gold kaufen: Depots im Vergleich" },
  { to: "/vergleich/krypto", name: "Krypto-Börsen für Muslime" },
  { to: "/vergleich/steuersoftware", name: "Steuersoftware im Vergleich" },
  { to: "/vergleich/screening-apps", name: "Halal-Aktien prüfen: die Apps im Vergleich" },
];

/** Blauer Name mit Stern, wenn es einen Partnerlink gibt (wie `AnbieterName` in der Tabelle). */
const Name = ({ a }: { a: RohAnbieter }) =>
  a.link ? (
    <Link to={a.link} rel="sponsored nofollow" className="font-semibold text-primary underline underline-offset-2 hover:text-primary-hover">
      {a.name}*
    </Link>
  ) : (
    <span className="font-semibold">{a.name}</span>
  );

export const DepotRatgeber = ({
  auszeichnungen,
  kriterien,
  faq,
}: {
  auszeichnungen: { nummerEins: string; meisteHalal: string };
  kriterien: Array<{ titel: string; text: string }>;
  faq: Array<{ frage: string; antwort: string }>;
}) => {
  const tr = tradeRepublicText();
  const sieger = depotVorn.find((a) => a.id === depotSiegerId) ?? null;
  const sparplan = sparplanZeilen();
  return (
    <VergleichsRatgeber eintraege={EINTRAEGE} nummerEins={sieger} auszeichnung={auszeichnungen.nummerEins}>
      <RH2 id="beste-halal-depots">Die besten Halal-Depots 2026</RH2>
      <RText>
        Für diesen Depotvergleich haben wir {depotAnzahl} Depots angesehen. Zwei Fragen stehen vorn: Kannst du ein Depot ohne
        Zinsen führen, und wie viele Halal-Anlagen kaufst du dort? Dazu kommen die Kosten.
      </RText>
      <RText>
        {depotOhneZinsen} der {depotAnzahl} Depots kannst du ohne Zinsen nutzen. Bei den übrigen {depotAbgeraten.length} geht
        das nicht, sie stehen unten unter „Nicht empfohlen“.
      </RText>

      <RH2 id="broker-vergleich">Broker-Vergleich: Welcher Broker passt zu Muslimen?</RH2>
      <RText>
        Hier stehen die {depotVorn.length} Depots, die in unserem Vergleich vorn liegen: was du dort kaufst, was du für null
        Zinsen tun musst und was es kostet.
      </RText>
      {depotVorn.map((a) => {
        const marke =
          a.id === depotSiegerId
            ? auszeichnungen.nummerEins
            : a.id === depotMeisteHalalId
              ? auszeichnungen.meisteHalal
              : null;
        const bilder = (a.haus && DEPOT_APP_BILDER[a.haus]) || [];
        return (
          <section key={a.id} aria-labelledby={`broker-${a.id}`}>
            <RH3 id={`broker-${a.id}`}>
              {a.name}
              {marke ? `: ${marke}` : ` ${a.produkt}`}
            </RH3>
            {brokerText(a).length > 0 && <RText>{brokerText(a).join(" ")}</RText>}
            <VorNachteile anbieter={a} vorteile={vorteile(a)} nachteil={nachteil(a)} />
            <AppBilder
              bilder={bilder}
              platzhalter={a.haus && APP_BILDER_ERWARTET.has(a.haus) ? `App-Bild ${a.name} (von Elias)` : undefined}
            />
          </section>
        );
      })}

      {tr && (
        <>
          <RH3 id="trade-republic-alternative">Trade Republic Alternative für Muslime</RH3>
          <RText>Hast du schon ein Depot bei Trade Republic? {tr.saetze.join(" ")}</RText>
          {tr.mehr.length > 0 && (
            <RText>
              Mehr Halal-ETFs und Fonds findest du bei{" "}
              {tr.mehr.map((m, i) => (
                <span key={m.anbieter.id}>
                  {i > 0 && (i === tr.mehr.length - 1 ? " und " : ", ")}
                  <Name a={m.anbieter} /> ({m.zahl})
                </span>
              ))}
              .
            </RText>
          )}
        </>
      )}

      <RH2 id="depot-kosten">Depot-Kosten im Vergleich</RH2>
      <RText>So viel zahlst du bei den {depotVorn.length} Depots vorn im Vergleich.</RText>
      <Tabelle
        kopf={["Depot", "Depotgebühr", "Order", "ETF-Sparplan"]}
        zeilen={depotVorn.map((a) => [
          a.name,
          String(a.werte.depotgebuehr ?? "–"),
          kostenKurz(a.id, "orderkosten") ?? String(a.werte.orderkosten ?? "–"),
          String(a.werte.etfSparplanKosten ?? "–"),
        ])}
      />

      <RH2 id="nicht-empfohlen">Diese Depots empfehlen wir nicht</RH2>
      <RText>
        Hier bekommst du Zinsen auf dein Guthaben und kannst sie nicht abschalten. Darum bekommen diese Depots von uns keine
        Note.
      </RText>
      <ul className="mt-5 divide-y divide-border rounded-lg border border-border">
        {depotAbgeraten.map(({ anbieter, grund }) => (
          <li key={anbieter.id} className="flex items-start gap-3 px-4 py-3.5">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-destructive">
              <X className="h-3.5 w-3.5 text-destructive-foreground" strokeWidth={3} aria-hidden />
            </span>
            <p className="text-[16px] leading-snug text-foreground">
              <span className="font-semibold">
                {anbieter.name} {anbieter.produkt}
              </span>
              : {grund}
            </p>
          </li>
        ))}
      </ul>

      <RH2 id="so-vergleichen-wir">So vergleichen wir die Depots</RH2>
      <RText>
        Ein ETF-Depot-Vergleich oder Aktien-Depot-Vergleich schaut meist nur auf die Kosten. Für Muslime kommen zwei Fragen
        dazu, und alle drei zählen bei uns:
      </RText>
      <ol className="mt-5 space-y-4">
        {[
          ...kriterien,
          {
            titel: "Kosten",
            text: "Depotgebühr, Order und Sparplan, dazu Sparrate, Handelsplätze, Steuer, Service und App. Halal und Kosten zählen je zur Hälfte.",
          },
        ].map((k, i) => (
          <li key={k.titel} className="flex gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary text-[14px] font-semibold text-primary-foreground">
              {i + 1}
            </span>
            <p className="text-[17px] leading-[27px] text-foreground/90">
              <span className="font-semibold text-foreground">{k.titel}:</span> {k.text}
            </p>
          </li>
        ))}
      </ol>
      <p className="mt-5 text-[16px]">
        <Link to="/vergleiche/methodik" className="font-semibold text-primary hover:underline">
          So entsteht die Bewertung
        </Link>
      </p>

      <RH3 id="halal-sparplan">Halal-Sparplan: Wo kannst du Halal ETFs besparen?</RH3>
      <RText>
        Mit einem Sparplan kaufst du jeden Monat automatisch für einen festen Betrag, zum Beispiel 100 €. So viele der{" "}
        {sparplanVon} Halal ETFs aus unserem Beitrag{" "}
        <Link to="/blog/halal-etf" className="font-semibold text-primary hover:underline">
          Beste Halal ETFs 2026
        </Link>{" "}
        kannst du dort besparen:
      </RText>
      <Tabelle
        kopf={["Depot", "Halal ETFs im Sparplan", "Sparplan ab"]}
        zeilen={sparplan.map((z) => [z.anbieter.name, `${z.auf} von ${sparplanVon}`, z.ab ?? "–"])}
      />

      <RH2 id="haeufige-fragen">Häufige Fragen</RH2>
      <Accordion type="single" collapsible className="mt-4">
        {faq.map((item) => (
          <AccordionItem key={item.frage} value={item.frage}>
            <AccordionTrigger className="text-left text-[17px] font-semibold">{item.frage}</AccordionTrigger>
            <AccordionContent className="text-[16px] leading-relaxed text-foreground/85">{item.antwort}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <RH2 id="unsere-vergleiche">Unsere Vergleiche</RH2>
      <ul className="mt-4 divide-y divide-border rounded-lg border border-border">
        {VERGLEICHE.map((v) => (
          <li key={v.to}>
            <Link
              to={v.to}
              className="flex min-h-[52px] items-center justify-between gap-3 px-4 py-3 text-[16px] font-semibold text-foreground transition-colors hover:text-primary"
            >
              {v.name}
              <ArrowRight className="h-5 w-5 shrink-0 text-primary" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </VergleichsRatgeber>
  );
};
