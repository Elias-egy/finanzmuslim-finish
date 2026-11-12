import { Link } from "react-router-dom";
import { ArrowRight, X } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  RH2,
  RH3,
  RHinweis,
  RListe,
  RTabelle,
  RText,
  VergleichsRatgeber,
  VorNachteile,
  type RatgeberEintrag,
} from "./VergleichsRatgeber";
import {
  giroAbgeraten,
  giroAnzahl,
  giroOhneZinsen,
  giroSiegerId,
  giroVorn,
  kontofuehrung,
  kontoText,
  nachteil,
  vorteile,
} from "@/data/giroRatgeber";

/**
 * Blogteil unter dem Girokonto-Vergleich, Aufbau wie `DepotRatgeber`: Die besten Konten, Konten im Test mit Häkchen,
 * Kosten, Sicherheit, Nicht empfohlen, So vergleichen wir, Fragen, Unsere Vergleiche (Finanzfluss-Girokonto:
 * „Konten im Test“, „Wie funktioniert unser Girokonto-Vergleich?“, „Häufig gestellte Fragen“; RN1, 12.11.2026).
 */

const EINTRAEGE: RatgeberEintrag[] = [
  { id: "beste-halal-girokonten", titel: "Die besten Halal-Girokonten" },
  { id: "konten-im-test", titel: "Konten im Test" },
  { id: "girokonto-kosten", titel: "Kosten im Vergleich" },
  { id: "zinsen-und-dispo", titel: "Zinsen und Dispo" },
  { id: "girokonto-sicher", titel: "Wie sicher ist dein Konto?" },
  { id: "nicht-empfohlen", titel: "Nicht empfohlen" },
  { id: "so-vergleichen-wir", titel: "So vergleichen wir" },
  { id: "haeufige-fragen", titel: "Häufige Fragen" },
  { id: "unsere-vergleiche", titel: "Unsere Vergleiche" },
];

const VERGLEICHE = [
  { to: "/vergleich/depot", name: "Depot-Vergleich 2026" },
  { to: "/vergleich/edelmetalle", name: "Halal Gold kaufen: Depots im Vergleich" },
  { to: "/vergleich/krypto", name: "Krypto-Börsen für Muslime" },
  { to: "/vergleich/steuersoftware", name: "Steuersoftware im Vergleich" },
  { to: "/vergleich/screening-apps", name: "Halal-Aktien prüfen: die Apps im Vergleich" },
];

export const GiroRatgeber = ({
  auszeichnung,
  kriterien,
  faq,
}: {
  auszeichnung: string;
  kriterien: Array<{ titel: string; text: string }>;
  faq: Array<{ frage: string; antwort: string }>;
}) => {
  const sieger = giroVorn.find((a) => a.id === giroSiegerId) ?? null;
  return (
    <VergleichsRatgeber eintraege={EINTRAEGE} nummerEins={sieger} auszeichnung={auszeichnung}>
      <RH2 id="beste-halal-girokonten" gross>
        Die besten Halal-Girokonten 2026
      </RH2>
      <RText>
        Für diesen Girokonto-Vergleich haben wir {giroAnzahl} Konten angesehen. Drei Fragen stehen vorn: Liegt dein Geld ab
        Start ohne Zinsen, wird dir kein Dispo eingeräumt, und kommt die Karte ohne Kredit? Dazu kommen die Kosten.
      </RText>
      <RText>
        {giroOhneZinsen} der {giroAnzahl} Konten kannst du ohne Zinsen nutzen. Bei den übrigen {giroAbgeraten.length} geht das
        nicht, sie stehen unten unter „Nicht empfohlen“.
      </RText>
      <RHinweis titel="Ein Tagesgeld kommt oft dazu: ignoriere es">
        Oft legt die Bank mit dem Girokonto ein Tagesgeld an, zum Beispiel die Norisbank und die BBBank. Zinsen gibt es nur auf
        Geld, das du dort einzahlst. Zahle nichts ein, dann bleibt dein Konto ohne Zinsen.
      </RHinweis>

      <RH2 id="konten-im-test">Konten im Test: Welches Girokonto passt zu Muslimen?</RH2>
      <RText>
        Hier stehen die {giroVorn.length} Konten, die in unserem Vergleich vorn liegen: was du für null Zinsen tust und was
        das Konto kostet.
      </RText>
      {giroVorn.map((a) => {
        const marke = a.id === giroSiegerId ? auszeichnung : null;
        const saetze = kontoText(a);
        return (
          <section key={a.id} aria-labelledby={`konto-${a.id}`}>
            <RH3 id={`konto-${a.id}`}>
              {a.name}
              {marke ? `: ${marke}` : ` ${a.produkt}`}
            </RH3>
            {saetze.length > 0 && <RText>{saetze.join(" ")}</RText>}
            <VorNachteile anbieter={a} vorteile={vorteile(a)} nachteil={nachteil(a)} />
          </section>
        );
      })}

      <RH2 id="girokonto-kosten">Girokonto-Kosten im Vergleich</RH2>
      <RText>So viel zahlst du bei den {giroVorn.length} Konten vorn im Vergleich.</RText>
      <RTabelle
        unterschrift="Kosten der Girokonten vorn im Vergleich"
        kopf={["Konto", "Kontoführung", "Girocard", "Debitkarte", "Bargeld abheben"]}
        zeilen={giroVorn.map((a) => [
          a.name,
          kontofuehrung(a) || "–",
          String(a.werte.girocard ?? "–"),
          String(a.werte.debitkarte ?? "–"),
          String(a.werte.abhebungen ?? "–"),
        ])}
      />

      <RH2 id="zinsen-und-dispo">Zinsen und Dispo beim Girokonto</RH2>
      <RText>
        Für Muslime zählen zwei Dinge, die in normalen Vergleichen fehlen. Erstens zahlen manche Banken Zinsen auf das
        Guthaben, und Zinsen sind Riba. Zweitens räumen viele Banken beim Öffnen des Kontos automatisch einen Dispokredit ein,
        der ebenfalls verzinst ist.
      </RText>
      <RText>
        Beides lässt sich bei vielen Banken abschalten oder auf null setzen, es steht nur selten im Vergleich. Darum zeigt
        unsere Tabelle beides in eigenen Zeilen.
      </RText>

      <RH2 id="girokonto-sicher">Wie sicher ist dein Girokonto?</RH2>
      <RText>
        Dein Guthaben auf dem Girokonto ist wie bei jeder Bank in der EU bis 100.000 € gesetzlich abgesichert. Geht die Bank
        pleite, bekommst du dein Geld bis zu dieser Summe zurück.
      </RText>

      <RH2 id="nicht-empfohlen">Diese Girokonten empfehlen wir nicht</RH2>
      <RText>
        Hier bekommst du Zinsen auf dein Guthaben und kannst sie nicht abschalten. Darum bekommen diese Konten von uns keine
        Note.
      </RText>
      <ul className="mt-6">
        {giroAbgeraten.map(({ anbieter, grund }) => (
          <li key={anbieter.id} className="relative pb-3 pl-7 text-[18px] leading-[28px] text-foreground">
            <span className="absolute left-0 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive">
              <X className="h-3.5 w-3.5 text-destructive-foreground" strokeWidth={3} aria-hidden />
            </span>
            <span className="font-semibold">
              {anbieter.name} {anbieter.produkt}
            </span>
            : {grund}
          </li>
        ))}
      </ul>

      <RH2 id="so-vergleichen-wir">So vergleichen wir die Girokonten</RH2>
      <RText>
        Ein Girokonto-Vergleich schaut meist nur auf die Kosten. Für Muslime kommen drei Fragen dazu, und Halal und Kosten
        zählen bei uns je zur Hälfte:
      </RText>
      <RListe
        punkte={[
          ...kriterien,
          {
            titel: "Kosten",
            text: "Kontoführung, Girocard und Debitkarte, Bargeld abheben und einzahlen, Apple Pay und Google Pay, Überweisung, Support, Kontowechsel, App und Ident-Verfahren.",
          },
        ]}
      />
      <p className="mt-3 text-[18px] leading-[28px]">
        <Link to="/vergleiche/methodik" className="font-semibold text-primary hover:underline">
          So entsteht die Bewertung
        </Link>
      </p>

      <RH2 id="haeufige-fragen">Häufige Fragen</RH2>
      {/* Wie Finanzfluss und der Depot-Vergleich: je Frage ein hellgrauer Kasten, 24 px Abstand, Frage 18 px fett, Pfeil rechts. */}
      <Accordion type="single" collapsible className="mt-6 space-y-6">
        {faq.map((item) => (
          <AccordionItem key={item.frage} value={item.frage} className="rounded-lg border-b-0 bg-muted">
            <AccordionTrigger className="gap-4 px-4 py-3.5 text-left text-[18px] font-semibold leading-6 hover:no-underline [&>svg]:h-5 [&>svg]:w-5">
              {item.frage}
            </AccordionTrigger>
            <AccordionContent className="px-4 text-[18px] leading-[28px] text-foreground">{item.antwort}</AccordionContent>
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
