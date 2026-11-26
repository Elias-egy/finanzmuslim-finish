import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight, X } from "lucide-react";
import type { RohAnbieter } from "@/data/vergleichHelfer";
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
import { AngebotsKnopf } from "./VergleichsBausteine";
import { ANKER_VERGLEICH } from "@/data/ankertexte";
import {
  altersGrenze,
  auslandSatz,
  auslandZeilen,
  giroAbgeraten,
  giroOffen,
  giroAuslandListe,
  giroAnzahl,
  giroBeideKarten,
  giroIdents,
  giroJung,
  giroMerkmale,
  giroMitWechsel,
  giroOhneDispo,
  giroOhneMindesteingang,
  giroOhneMindesteingangAnzahl,
  giroOhneZinsen,
  giroSiegerId,
  giroSiegerSatz,
  giroTop3,
  giroVorn,
  kontofuehrung,
  kontoText,
  mindestEingang,
  nachteil,
  sonstPreis,
  vorteile,
} from "@/data/giroRatgeber";

/** „A, B und C“ */
const reihe = (namen: string[]) =>
  namen.length < 2 ? (namen[0] ?? "") : `${namen.slice(0, -1).join(", ")} und ${namen[namen.length - 1]}`;

/**
 * Kontoname als Partnerlink mit Stern, wo es einen Link gibt und die Zinsen nicht „schlecht“ stehen (SEO86 MUSS 7, Muster wie `Nimm` auf
 * /blog/trade-republic-alternative). Sonst der Name als Text.
 */
const Nimm = ({ a, text }: { a: RohAnbieter; text?: string }) => {
  const name = text ?? a.name;
  if (!a.link || a.werte.zinsfreiAbStart === "schlecht") return <>{name}</>;
  return (
    <Link
      to={a.link}
      rel="sponsored nofollow"
      className="font-semibold text-primary underline underline-offset-[3px] hover:text-primary/80"
    >
      {name}*
    </Link>
  );
};

/**
 * Blogteil unter dem Girokonto-Vergleich, Aufbau wie `DepotRatgeber`: Die besten Konten, Konten im Test mit Häkchen,
 * Kosten, Sicherheit, Nicht empfohlen, So vergleichen wir, Fragen, Unsere Vergleiche (Finanzfluss-Girokonto:
 * „Konten im Test“, „Wie funktioniert unser Girokonto-Vergleich?“, „Häufig gestellte Fragen“; RN1, 12.11.2026).
 */

const EINTRAEGE: RatgeberEintrag[] = [
  { id: "beste-halal-girokonten", titel: "Das beste Girokonto" },
  { id: "was-ist-ein-girokonto", titel: "Was ist ein Girokonto?" },
  { id: "konten-im-test", titel: "Konten im Test" },
  { id: "girokonto-kosten", titel: "Kostenloses Girokonto" },
  { id: "zinsen-und-dispo", titel: "Zinsen und Dispo" },
  { id: "welche-karte", titel: "Welche Karte?" },
  { id: "geld-abheben-im-ausland", titel: "Geld abheben im Ausland" },
  { id: "girokonto-eroeffnen", titel: "Konto eröffnen" },
  { id: "girokonto-wechseln", titel: "Konto wechseln" },
  { id: "girokonto-sicher", titel: "Wie sicher ist dein Konto?" },
  { id: "nicht-empfohlen", titel: "Nicht empfohlen" },
  { id: "so-vergleichen-wir", titel: "So vergleichen wir" },
  { id: "fazit", titel: "Fazit" },
  { id: "haeufige-fragen", titel: "Häufige Fragen" },
  { id: "unsere-vergleiche", titel: "Unsere Vergleiche" },
];

const VERGLEICHE = [
  { to: "/vergleich/depot", name: ANKER_VERGLEICH["/vergleich/depot"] },
  { to: "/vergleich/edelmetalle", name: ANKER_VERGLEICH["/vergleich/edelmetalle"] },
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
  const siegerSatz = giroSiegerSatz();
  return (
    <VergleichsRatgeber eintraege={EINTRAEGE} nummerEins={sieger} auszeichnung={auszeichnung}>
      <RH2 id="beste-halal-girokonten" gross>
        Das beste Girokonto 2026 für Muslime
      </RH2>
      {siegerSatz && <RText>{siegerSatz}</RText>}
      <RText>Ich habe {giroAnzahl} Konten verglichen. Drei Fragen stehen vorn.</RText>
      <RText>
        Liegt dein Geld ab Start ohne Zinsen, wird dir kein Dispo eingeräumt, und kommt die Karte ohne Kredit? Dazu kommen die
        Kosten.
      </RText>
      <RText>
        {giroOhneZinsen} der {giroAnzahl} Konten kannst du ohne Zinsen nutzen.
        {giroAbgeraten.length > 0 &&
          ` Bei ${giroAbgeraten.length} zahlt der Anbieter Zinsen, die sich nicht abschalten lassen: Sie stehen ganz hinten.`}
      </RText>
      <RHinweis titel="Ein Tagesgeld kommt oft dazu: ignoriere es">
        Oft legt die Bank mit dem Girokonto ein Tagesgeld an. Zahle dort nichts ein, dann bleibt dein Konto ohne Zinsen.
      </RHinweis>
      {/* VIDEO-PLATZ (SEO85-Prüfbericht): Hier gehört später Elias' Video „So stellst du dein Girokonto ohne Zinsen um“ hin (Dispo auf null, Tagesgeld leer lassen),
          ohne Anbieter oder mit der aktuellen Nummer 1 (SEO83-03). Zweiter Platz: unter „So eröffnest du dein Girokonto“. */}

      <RH2 id="was-ist-ein-girokonto">Was ist ein Girokonto?</RH2>
      <RText>
        Ein Girokonto ist das Konto für deinen Alltag. Dein Gehalt kommt dort an, Miete und Lastschriften gehen von dort ab.
      </RText>
      <RText>Mit der Karte zahlst du im Laden und hebst Bargeld ab.</RText>
      <RText>
        Für Muslime kommt eine Frage dazu: Liegt dein Geld ohne Zinsen, und wird dir kein Dispo eingeräumt? Genau das
        prüfen wir bei jedem Konto.
      </RText>

      <RH2 id="konten-im-test">Konten im Test: Welches Girokonto passt zu Muslimen?</RH2>
      <RText>
        Hier stehen die {["", "ein", "zwei", "drei"][giroTop3.length] ?? giroTop3.length} Konten, die in unserem Vergleich vorn liegen: was du für null Zinsen tust, was das
        Konto kostet und was im Ausland anfällt.
      </RText>
      {giroTop3.map((a) => {
        const marke = a.id === giroSiegerId ? auszeichnung : null;
        const saetze = [...kontoText(a), auslandSatz(a) ?? ""].filter(Boolean); // je Satz ein Absatz, am Handy höchstens vier Zeilen
        return (
          <section key={a.id} aria-labelledby={`konto-${a.id}`}>
            <RH3 id={`konto-${a.id}`}>
              {a.name}
              {marke ? `: ${marke}` : ` ${a.produkt}`}
            </RH3>
            {saetze.map((satz) => (
              <RText key={satz}>{satz}</RText>
            ))}
            <VorNachteile anbieter={a} vorteile={vorteile(a)} nachteil={nachteil(a)} />
          </section>
        );
      })}

      <RH2 id="girokonto-kosten">Kostenloses Girokonto im Vergleich</RH2>
      <RText>
        Kostenlos heißt bei den meisten Banken: 0 € Kontoführung, wenn jeden Monat genug Geld eingeht oder du jung bist.
      </RText>
      <RText>So viel zahlst du bei den {giroVorn.length} Konten vorn im Vergleich.</RText>
      <RTabelle
        unterschrift="Kosten der Girokonten vorn im Vergleich"
        kopf={["Konto", "Kontoführung", "Girocard", "Debitkarte", "Bargeld abheben"]}
        zeilen={giroVorn.map((a) => [
          <Nimm key={a.id} a={a} />,
          kontofuehrung(a) || "–",
          String(a.werte.girocard ?? "–"),
          String(a.werte.debitkarte ?? "–"),
          String(a.werte.abhebungen ?? "–"),
        ])}
      />

      {giroOhneMindesteingang.length > 0 && (
        <>
          <RH3 id="ohne-mindesteingang">Kostenloses Girokonto ohne Mindesteingang</RH3>
          <RText>
            Bei {giroOhneMindesteingangAnzahl} Konten ohne Zinsen kostet die Kontoführung 0 €, egal wie viel Geld eingeht.
            Das passt, wenn dein Gehalt auf ein anderes Konto kommt.
          </RText>
          <ul className="mt-6">
            {giroOhneMindesteingang.map((a) => (
              <li key={a.id} className="relative pb-3 pl-7 text-[18px] leading-[28px] text-foreground">
                <ChevronRight className="absolute left-0 top-1 h-5 w-5 text-primary" strokeWidth={3} aria-hidden />
                <span className="font-semibold">
                  <Nimm a={a} text={`${a.name} ${a.produkt}`} />:
                </span>{" "}
                {nachteil(a)?.text ? `0 € Kontoführung. ${nachteil(a)?.text}.` : "0 € Kontoführung."}
              </li>
            ))}
          </ul>
          {giroOhneMindesteingang[0]?.link && giroOhneMindesteingang[0].werte.zinsfreiAbStart !== "schlecht" && (
            <div className="mt-6 max-w-sm">
              <AngebotsKnopf link={giroOhneMindesteingang[0].link} />
            </div>
          )}
        </>
      )}

      {giroJung.length > 0 && (
        <>
          <RH3 id="junge-leute">Girokonto für junge Leute</RH3>
          <RText>
            Bist du jung, zahlst du bei diesen Konten nichts, auch ohne Gehalt. Danach gilt der Mindesteingang.
          </RText>
          <RTabelle
            unterschrift="Kostenlos für junge Leute"
            kopf={["Konto", "Kostenlos unter", "Danach 0 € ab", "Sonst"]}
            zeilen={giroJung.map((a) => [
              <Nimm key={a.id} a={a} />,
              `${altersGrenze(a)} Jahren`,
              mindestEingang(a) ? `${mindestEingang(a)} Eingang` : "–",
              sonstPreis(a) ? `${sonstPreis(a)} im Monat` : "–",
            ])}
          />
        </>
      )}

      <RH2 id="zinsen-und-dispo">Zinsen und Dispo beim Girokonto</RH2>
      <RText>
        Für Muslime zählen zwei Dinge, die in normalen Vergleichen fehlen: Zinsen auf dein Guthaben und der Dispo. Beides
        steht in unserer Tabelle in eigenen Zeilen.
      </RText>
      <RH3 id="ohne-zinsen">Girokonto ohne Zinsen</RH3>
      {/* Beleg „Zinsen sind Riba“ (SEO86 MUSS 8): ~/hourani/positionen/bankkonten.md, Sheikh Ibrahim Hourani, ilmCast Ep. 13, 00:10:23 („Weil da geht es um Reba.“,
          „Reba“ = Ribā, zu Festgeld-, Tagesgeldkonto und Sparbuch) und 00:12:36 („Das ist Riba und Haram.“ zu jedem Konto, das für die Einlage einen festen Betrag zahlt). */}
      <RText>
        Manche Banken zahlen Zinsen auf das Guthaben, und Zinsen sind Riba. {giroOhneZinsen} der {giroAnzahl} Konten kannst
        du ohne Zinsen nutzen.
      </RText>
      <RText>
        Kommt ein Tagesgeld mit dem Konto, zahle dort nichts ein. Wie du dein Konto in zehn Minuten umstellst, steht im
        Beitrag{" "}
        <Link to="/blog/girokonto-ohne-zinsen" className="font-semibold text-primary hover:underline">
          Girokonto ohne Zinsen
        </Link>
        .
      </RText>
      <RH3 id="ohne-dispo">Girokonto ohne Dispo</RH3>
      <RText>
        Der Dispo ist ein Kredit: Überziehst du dein Konto, zahlst du Zinsen.
      </RText>
      <RText>
        Bei {giroOhneDispo} der {giroAnzahl} Konten bekommst du ab Start keinen Dispo, bei den übrigen lässt er sich abschalten.
      </RText>
      <RText>
        Was du tun kannst, wenn schon ein Dispo im Minus steht, liest du in{" "}
        <Link to="/blog/dispo-und-schulden" className="font-semibold text-primary hover:underline">
          Dispo und Schulden
        </Link>
        .
      </RText>
      <RText>
        Auch bei der Karte geht es um Kredit. Welche Karte islamisch passt, steht im Beitrag{" "}
        <Link to="/blog/kreditkarte-halal" className="font-semibold text-primary hover:underline">
          Kreditkarte oder Debitkarte
        </Link>
        .
      </RText>

      <RH2 id="welche-karte">Welche Karte brauchst du?</RH2>
      <RText>Mit der Girocard zahlst du in fast jedem Laden in Deutschland und hebst Geld ab.</RText>
      <RText>
        Die Debitkarte von Visa oder Mastercard brauchst du online, im Ausland und für Apple Pay oder Google Pay.
      </RText>
      {giroBeideKarten.length > 0 && (
        <RText>
          Beide Karten kostenlos und ohne Kreditrahmen bekommst du zum Beispiel bei{" "}
          {reihe(giroBeideKarten.slice(0, 3).map((a) => a.name))}.
        </RText>
      )}

      <RH2 id="geld-abheben-im-ausland">Geld abheben im Ausland</RH2>
      <RText>
        Auf Reisen, bei Umrah oder beim Besuch in der Heimat zählt, was Bargeld und Kartenzahlung im Ausland kosten.
      </RText>
      <RText>
        Die Tabelle zeigt die Konten vorn im Vergleich und Konten weiter hinten, bei denen Gebühren anfallen.
      </RText>
      <RTabelle
        unterschrift="Gebühren im Ausland, Finanzfluss-Vergleich, Stand 19.09.2026"
        kopf={["Konto", "Abheben im Euro-Ausland", "Abheben in Fremdwährung", "Bezahlen in Fremdwährung"]}
        zeilen={auslandZeilen(giroAuslandListe, (a) => (
          <Nimm key={a.id} a={a} text={`${a.name} ${a.produkt}`} />
        ))}
      />
      <RText>
        In unserer Note zählt jede dieser drei Gebühren ein Drittel des Kriteriums „Ausland“. Den vollen Punkt gibt es nur
        bei 0 €.
      </RText>

      <RH2 id="girokonto-eroeffnen">So eröffnest du dein Girokonto</RH2>
      <RListe
        punkte={[
          { titel: "Schritt 1", text: "Wähle das Konto im Vergleich oben und tippe auf den Knopf zum Anbieter." },
          { titel: "Schritt 2", text: "Fülle den Antrag mit Name, Adresse und Steuer-ID aus. Einen Dispo beantragst du nicht." },
          {
            titel: "Schritt 3",
            text: `Bestätige deinen Ausweis${giroIdents.length ? `, je nach Bank per ${reihe(giroIdents).replace(/ und ([^ ]+)$/, " oder $1")}` : ""}.`,
          },
          { titel: "Schritt 4", text: "Nach ein paar Tagen kommen Karte und Zugang per Post. Ein Tagesgeld, das mitkommt, lässt du leer." },
        ]}
      />

      <RH2 id="girokonto-wechseln">Girokonto wechseln</RH2>
      <RText>
        Bei {giroMitWechsel} der {giroAnzahl} Konten gibt es einen Kontowechsel-Service. Er meldet Arbeitgeber, Lastschriften
        und Daueraufträge für dich um.
      </RText>
      <RListe
        punkte={[
          { titel: "Neues Konto zuerst", text: "Eröffne das neue Konto, bevor du das alte kündigst." },
          { titel: "Wechsel-Service starten", text: "Starte ihn im Online-Banking des neuen Kontos und melde dort dein altes Konto an." },
          { titel: "Altes Konto kündigen", text: "Kündige erst, wenn Gehalt und Lastschriften auf dem neuen Konto ankommen." },
        ]}
      />

      <RH2 id="girokonto-sicher">Wie sicher ist dein Girokonto?</RH2>
      <RText>Dein Guthaben auf dem Girokonto ist wie bei jeder Bank in der EU bis 100.000 € gesetzlich abgesichert.</RText>
      <RText>Geht die Bank pleite, bekommst du dein Geld bis zu dieser Summe zurück.</RText>

      <RH2 id="nicht-empfohlen">Diese Girokonten empfehlen wir nicht</RH2>
      <RText>
        Hier bekommst du Zinsen auf dein Guthaben und kannst sie nicht abschalten. Darum stehen diese Konten ganz hinten.
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
            text: "Kontoführung, Girocard und Debitkarte, Bargeld abheben und einzahlen, Gebühren im Ausland, Apple Pay und Google Pay, Überweisung, Support, Kontowechsel, App und Ident-Verfahren.",
          },
        ]}
      />
      {giroOffen > 0 && (
        <RText>
          Bei {giroOffen} Konten steht der Zins auf „Offen“: Der Anbieter schreibt dazu bisher nichts, wir fragen nach.
        </RText>
      )}
      <p className="mt-3 text-[18px] leading-[28px]">
        <Link to="/vergleiche/methodik" className="font-semibold text-primary hover:underline">
          So entsteht die Bewertung
        </Link>
      </p>

      {sieger && (
        <>
          <RH2 id="fazit">Fazit</RH2>
          <RText>
            In unserem Girokonto-Vergleich liegt {sieger.name} vorn
            {giroMerkmale(sieger).length ? `: ${reihe(giroMerkmale(sieger))}` : ""}
            .
          </RText>
          <RText>Prüfe vor dem Abschluss nur, ob du die Bedingung für 0 € Kontoführung erfüllst.</RText>
          {sieger.link && sieger.werte.zinsfreiAbStart !== "schlecht" && (
            <div className="mt-6 max-w-sm">
              <AngebotsKnopf link={sieger.link} />
            </div>
          )}
        </>
      )}

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
