import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AnbieterLogo } from "@/components/AnbieterLogo";
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
import { zahlwort } from "@/data/anzahlen";
import { geschaeftskontoAnzeige } from "@/data/anzeige/geschaeftskonto";
import {
  bestFuer,
  fuerWen,
  geschaeftsAnbieter,
  geschaeftsAnzahl,
  geschaeftsKt,
  geschaeftsName,
  geschaeftsOhneZinsen,
  geschaeftsSieger,
  geschaeftsTop,
  geschaeftsWasPasst,
  kontoText,
  nachteil,
  siegerMerkmale,
  vorteile,
} from "@/data/geschaeftsRatgeber";

/** „A, B und C“ */
const reihe = (namen: string[]) =>
  namen.length < 2 ? (namen[0] ?? "") : `${namen.slice(0, -1).join(", ")} und ${namen[namen.length - 1]}`;

const wert = (a: { werte: Record<string, unknown> }, k: string) => String(a.werte[k] ?? "").trim() || "Nicht angegeben";

/**
 * Blogteil unter dem Geschäftskonto-Vergleich, Aufbau wie `GiroRatgeber`. Der Inhalt ist der Beitrag „Bestes Geschäftskonto für
 * Muslime“ (SEO84), den Elias unter den Vergleich statt auf eine eigene Seite legen ließ (SEO84-03).
 */

const EINTRAEGE: RatgeberEintrag[] = [
  { id: "beste-geschaeftskonten", titel: "Das beste Geschäftskonto" },
  { id: "konten-im-test", titel: "Konten im Test" },
  { id: "geschaeftskonto-kosten", titel: "Was kostet ein Geschäftskonto?" },
  { id: "worauf-achten", titel: "Worauf du als Muslim achtest" },
  { id: "kt-bank", titel: "KT Bank: Islamic-Konto" },
  { id: "welches-konto", titel: "Welches Konto passt zu dir?" },
  { id: "geschaeftskonto-eroeffnen", titel: "Konto eröffnen" },
  { id: "so-vergleichen-wir", titel: "So vergleichen wir" },
  { id: "fazit", titel: "Fazit" },
  { id: "haeufige-fragen", titel: "Häufige Fragen" },
  { id: "unsere-vergleiche", titel: "Unsere Vergleiche" },
];

const VERGLEICHE = [
  { to: "/vergleich/girokonto", name: "Girokonto-Vergleich 2026" },
  { to: "/vergleich/depot", name: "Depot-Vergleich 2026" },
  { to: "/vergleich/edelmetalle", name: "Halal Gold kaufen: Depots im Vergleich" },
  { to: "/vergleich/krypto", name: "Krypto-Börsen für Muslime" },
  { to: "/vergleich/steuersoftware", name: "Steuersoftware im Vergleich" },
];

export const GeschaeftsRatgeber = ({
  auszeichnung,
  kriterien,
  faq,
}: {
  auszeichnung: string;
  kriterien: Array<{ titel: string; text: string }>;
  faq: Array<{ frage: string; antwort: string }>;
}) => {
  const sieger = geschaeftsSieger;
  /* Kasten „Nummer 1“ und Auszeichnung nur mit Partnerlink (Elias, 08.11.2026), die Liste und das Fazit nicht. */
  const siegerKasten = sieger?.link ? sieger : null;
  const offen = geschaeftskontoAnzeige.filter((a) => a.werte.zinsfreiAbStart === "unbekannt").length;
  const kt = geschaeftsKt;
  return (
    <VergleichsRatgeber eintraege={EINTRAEGE} nummerEins={siegerKasten} auszeichnung={auszeichnung}>
      <RH2 id="beste-geschaeftskonten" gross>
        Das beste Geschäftskonto 2026 für Muslime
      </RH2>
      <RText>
        Du hast dich selbstständig gemacht oder eine GmbH gegründet. Die Bank will dir ein Geschäftskonto mit Tagesgeld und
        Dispo geben. Du fragst dich: Geht das auch ohne Zinsen?
      </RText>
      {sieger && (
        <RText>
          Kurz gesagt: Ja. Das beste Geschäftskonto für Muslime in unserem Vergleich ist {geschaeftsName(sieger)}. Das
          Guthaben wird nicht verzinst, und ab Start gibt es keinen Dispo.
        </RText>
      )}
      <RText>
        Für diesen Vergleich haben wir {geschaeftsAnzahl} Geschäftskonten von {geschaeftsAnbieter} Anbietern angesehen. Bei
        jedem zählen vier Dinge: Zinsen auf dem Guthaben, Dispo ab Start, eine Karte ohne Kredit und die Kosten. Bei{" "}
        {geschaeftsOhneZinsen} der {geschaeftsAnzahl} Konten schreibt der Anbieter selbst, dass das Hauptkonto keinen
        Guthabenzins zahlt.
        {offen > 0 &&
          ` Bei ${offen} schreibt der Anbieter dazu nichts Ausdrückliches: Das ist kein Urteil, die Zeile steht auf „Offen“, und wir fragen nach.`}
      </RText>
      <RHinweis titel="Ein Zinskonto daneben? Eröffne es nicht">
        Bei vielen Geschäftskonten kommt der Zins nur über ein Tagesgeld, ein Zinskonto oder einen Geldmarktfonds daneben. Die
        eröffnest du nicht. Bei den fünf Konten vorn entsteht ein solches Konto nur, wenn du es selbst eröffnest.
      </RHinweis>

      <RH2 id="konten-im-test">Konten im Test: Welches Geschäftskonto passt zu Muslimen?</RH2>
      <RText>
        Hier stehen die {zahlwort(geschaeftsTop.length)} Anbieter, die in unserem Vergleich vorn liegen, jeder mit seinem besten Konto. Bei
        allen gibt es laut Anbieter keine Zinsen auf dem Guthaben und keinen Dispo ab Start.
      </RText>
      {geschaeftsTop.map((a) => {
        const marke = siegerKasten && a.id === siegerKasten.id ? auszeichnung : null;
        return (
          <section key={a.id} aria-labelledby={`konto-${a.id}`}>
            <RH3 id={`konto-${a.id}`}>
              {a.name}
              {marke ? `: ${marke}` : ` ${a.produkt ?? ""}`}
            </RH3>
            <RText>{kontoText(a).join(" ")}</RText>
            <VorNachteile anbieter={a} vorteile={vorteile(a)} nachteil={nachteil(a)} />
          </section>
        );
      })}

      <RH2 id="geschaeftskonto-kosten">Was kostet ein Geschäftskonto?</RH2>
      <RText>
        Die Tabelle zeigt die {zahlwort(geschaeftsTop.length)} Konten vorn nach Kosten und Rechtsform. Alle {geschaeftsAnzahl} Konten
        mit Filter nach deiner Rechtsform stehen im Vergleich oben.
      </RText>
      <RTabelle
        unterschrift="Kosten und Rechtsform der Geschäftskonten vorn im Vergleich"
        kopf={["Konto", "Kontoführung", "Buchungen", "Debitkarte", "Unterkonten", "Für"]}
        zeilen={geschaeftsTop.map((a) => [
          geschaeftsName(a),
          wert(a, "kontofuehrung"),
          wert(a, "buchungen"),
          wert(a, "debitkarte"),
          wert(a, "unterkonten"),
          fuerWen(a),
        ])}
      />

      <RH2 id="worauf-achten">Worauf achtest du als Muslim beim Geschäftskonto?</RH2>
      <RH3 id="zinsen-auf-dem-guthaben">Zinsen auf dem Guthaben</RH3>
      <RText>
        Zinsen sind Riba, und Riba ist im Islam verboten. Zahlt ein Geschäftskonto Zinsen auf dein Guthaben, steht es in
        unserem Vergleich ganz hinten.
      </RText>
      <RH3 id="dispo-und-kreditrahmen">Dispo und Kreditrahmen</RH3>
      <RText>
        Ein Dispo ist ein Kredit mit Sollzinsen. Ob es beim Geschäftskonto Dispo ab der Eröffnung gibt, steht in den
        Bedingungen der Bank. Bei den Konten vorn in unserem Vergleich gibt es keinen: Einen Kredit gibt es dort höchstens auf
        deinen Antrag.
      </RText>
      <RH3 id="kreditkarte-oder-debitkarte">Kreditkarte oder Debitkarte</RH3>
      <RText>
        Eine Kreditkarte ist ein Kredit, den du später zurückzahlst. Mit einer Debitkarte zahlst du nur von deinem Guthaben.
        Alle {zahlwort(geschaeftsTop.length)} Konten vorn haben eine Debitkarte.
      </RText>

      {kt && (
        <>
          <RH2 id="kt-bank">Das KT Bank Geschäftskonto als Islamic-Konto</RH2>
          <div className="mt-4">
            <AnbieterLogo name={kt.name} domain={kt.domain} gross />
          </div>
          <RText>
            Die KT Bank schreibt über sich, sie sei die „erste und einzige Bank in Deutschland und in der Eurozone mit
            islamkonformem Geschäftsmodell“. In unserem Vergleich ist ihr Geschäftskonto als Islamic-Konto markiert. Es läuft
            laut Antrag unverzinslich, und im Antrag steht auch: „Ein Dispositionskredit wird nicht eingeräumt.“
          </RText>
          <RText>
            Die Kontoführung kostet {String(kt.werte.kontofuehrung ?? "")}, beleglose Buchungen sind frei. Die Debitkarte:{" "}
            {String(kt.werte.debitkarte ?? "")}. Eröffnen kannst du das Konto nur in einer Filiale.
          </RText>
        </>
      )}

      {geschaeftsWasPasst.length > 0 && (
        <>
          <RH2 id="welches-konto">Welches Geschäftskonto ohne Zinsen passt zu dir?</RH2>
          <RText>Das passende Konto hängt vor allem an deiner Rechtsform und daran, ob du Bargeld einzahlst.</RText>
          <RTabelle
            unterschrift="Das Konto mit dem besten Platz je Bedarf"
            kopf={["Wenn du …", "Nimm", "Kontoführung"]}
            zeilen={geschaeftsWasPasst.map(({ wenn, a }) => [wenn, geschaeftsName(a), wert(a, "kontofuehrung")])}
          />
          {kt && (
            <RText>
              Willst du ein Konto bei der KT Bank und hast eine Filiale in der Nähe, lies oben, wie das{" "}
              <a href="#kt-bank" className="font-semibold text-primary hover:underline">
                KT Bank Geschäftskonto
              </a>{" "}
              läuft.
            </RText>
          )}
        </>
      )}

      <RH2 id="geschaeftskonto-eroeffnen">So eröffnest du dein Geschäftskonto</RH2>
      <RText>
        Für Freiberufler und Einzelunternehmer ist ein eigenes Geschäftskonto keine Pflicht, es trennt aber Privates und
        Geschäftliches. Eine GmbH oder UG braucht ein Konto auf den Namen der Gesellschaft. Nicht jedes Konto nimmt jede
        Rechtsform.
      </RText>
      <RListe
        punkte={[
          { titel: "Schritt 1", text: "Filtere im Vergleich oben nach deiner Rechtsform. Die Zeile „Für wen“ zeigt, wer das Konto eröffnen darf." },
          { titel: "Schritt 2", text: "Wähle das Konto und tippe auf den Knopf zum Anbieter." },
          { titel: "Schritt 3", text: "Eröffne es online beim Anbieter. Das KT Bank Geschäftskonto eröffnest du nur persönlich in einer Filiale." },
          { titel: "Schritt 4", text: "Ein Tagesgeld, Zinskonto oder einen Geldmarktfonds, der mitkommt, eröffnest du nicht." },
        ]}
      />

      <RH2 id="so-vergleichen-wir">So vergleichen wir die Geschäftskonten</RH2>
      <RText>
        Ein Geschäftskonto-Vergleich schaut meist nur auf die Kosten. Für Muslime kommen drei Fragen dazu, und Halal und Kosten
        zählen bei uns je zur Hälfte:
      </RText>
      <RListe punkte={kriterien} />
      <p className="mt-3 text-[18px] leading-[28px]">
        <Link to="/vergleiche/methodik" className="font-semibold text-primary hover:underline">
          So entsteht die Bewertung
        </Link>
      </p>

      {sieger && (
        <>
          <RH2 id="fazit">Fazit</RH2>
          <RText>
            In unserem Geschäftskonto-Vergleich liegt {sieger.name} vorn
            {siegerMerkmale(sieger).length ? `: ${reihe(siegerMerkmale(sieger))}` : ""}. Such dir das Konto für deine Rechtsform
            aus und eröffne es online. Es ist für {bestFuer(sieger)}.
          </RText>
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
