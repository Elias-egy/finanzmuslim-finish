import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import Seo from "@/components/Seo";
import { FINANZ_MAX_SUMME, GEWICHT_FINANZ, GEWICHT_HALAL } from "@/lib/bewertung";
import { AMPEL_GEWICHTE } from "@/lib/rangfolge";
import { KRYPTO_ZEILEN } from "@/data/kryptoVergleich";

/**
 * Offenlegung der Bewertung. Zwei Gründe: Partner wie Trading 212 fragen
 * danach, und ein Vergleichsportal muss die Hauptkriterien seiner Reihenfolge
 * nennen und sagen, ob Provisionen sie beeinflussen.
 *
 * Zahlen kommen aus bewertung.ts. Ein Test prüft, dass sie zu den
 * Datendateien passen, damit Seite und Rechnung nicht auseinanderlaufen.
 */

const prozent = (x: number) => `${Math.round(x * 100)} %`;

const kategorien = [
  {
    titel: "Depot",
    to: "/vergleich/depot",
    halal: [
      "Halal-Anlagen: wie viele der 22 Anlagen aus unserem Halal-Anlagen-Vergleich kaufbar sind, getrennt nach 12 ETFs und Fonds, 3 Sukuk und 7 Edelmetallen, 100 %",
    ],
    finanz: "Depotgebühr, Order- und Sparplankosten, Sparrate, Intervalle, Handelsplätze, Steuerabführung, Service, App",
    max: FINANZ_MAX_SUMME.depot,
  },
  {
    titel: "Edelmetalle",
    to: "/vergleich/edelmetalle",
    halal: [
      "Gold und Silber: wie viele der 7 Gold- und Silber-ETCs aus unserem Halal-Anlagen-Vergleich kaufbar sind, 100 %",
    ],
    finanz: "Depotgebühr, Orderkosten, Handelsplätze, Steuerabführung, Service, App",
    max: FINANZ_MAX_SUMME.edelmetall,
  },
  {
    titel: "Girokonto",
    to: "/vergleich/girokonto",
    halal: [
      "Kein Dispo ab Start: kein Dispokredit nach der Eröffnung, 50 %",
      "Karte ohne Kredit: Girocard oder Debitkarte ohne Kreditrahmen, 50 %",
    ],
    finanz: "Kontoführung (gerechnet mit 1.000 € Geldeingang, Extrapunkte ohne Bedingung), kostenlose Karten, Abheben, Einzahlen, Apple Pay und Google Pay, Überweisung, Support, Kontowechsel, App, Ident-Verfahren",
    max: FINANZ_MAX_SUMME.girokonto,
  },
  {
    titel: "Krypto",
    to: "/vergleich/krypto",
    halal: AMPEL_GEWICHTE.krypto.map(
      ([key, gewicht]) => `${KRYPTO_ZEILEN.find((z) => z.key === key)?.label ?? key}, ${prozent(gewicht)}`,
    ),
    finanz: "Kosten pro 500 €, Kostentransparenz, Kosten der Auszahlung, Sicherheit, Verifizierung, Einzahlungswege, Regulierung, Sparplan, Mindestbetrag",
    max: FINANZ_MAX_SUMME.krypto,
  },
];

const VergleichMethodik = () => (
  <main className="bg-background">
    <Seo
      title="So bewerten wir Anbieter | finanzmuslim"
      description="Lies nach, wie die Vergleiche entstehen: ohne Zinsen nutzbar als Voraussetzung, feste Halal-Merkmale und Kosten nach einer offenen Punktetabelle."
      path="/vergleiche/methodik"
      brotkrumen={[
        { name: "Vergleiche", path: "/vergleiche" },
        { name: "Methodik", path: "/vergleiche/methodik" },
      ]}
    />
    <div className="container max-w-[820px] py-10 md:py-14">
      <nav aria-label="Brotkrumen" className="flex flex-wrap items-center gap-1 text-[13px] text-muted-foreground">
        <Link to="/" className="hover:text-primary">Start</Link>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        <Link to="/vergleiche" className="hover:text-primary">Vergleiche</Link>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        <span className="text-foreground">Methodik</span>
      </nav>

      <header className="mt-6">
        <h1 className="text-3xl font-bold leading-tight text-foreground md:text-4xl">So bewerten wir</h1>
        <p className="mt-3 text-[17px] text-muted-foreground">
          Prüfe selbst, wie eine Note entsteht: erst die Zinsen, dann Halal-Merkmale und Kosten
          nach festen Regeln.
        </p>
      </header>

      <section className="mt-10 space-y-4 text-[16px] leading-[26px] text-foreground/90">
        <h2 className="text-2xl font-bold text-foreground">Drei Regeln</h2>
        <p>
          <strong>Erstens: ohne Zinsen nutzbar.</strong> Ein Anbieter bekommt nur eine Note, wenn
          dein Guthaben ohne Zins liegt oder du die Zinsen abschalten kannst. Startet das Konto mit
          Zinsen und du musst sie selbst abschalten, zählen die Halal-Merkmale nur halb. Lassen sie sich
          nicht abschalten, erscheint der Anbieter im Vergleich, aber ohne Note.
        </p>
        <p>
          <strong>Zweitens: Halal und Kosten zählen gleich.</strong> Die Note setzt sich zu{" "}
          {prozent(GEWICHT_HALAL)} aus den übrigen Halal-Merkmalen und zu {prozent(GEWICHT_FINANZ)} aus
          Kosten und Konditionen zusammen.
        </p>
        <p>
          <strong>Drittens: Haram-Angebote sind kein Minuspunkt.</strong> Fast jeder Anbieter hat auch
          Hebelprodukte, Kredite oder Zinsprodukte im Programm. Wir prüfen, ob du ohne sie auskommst,
          nicht ob es sie gibt.
        </p>
      </section>

      <section className="mt-10 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Die Merkmale je Vergleich</h2>
        {kategorien.map((k) => (
          <div key={k.titel} className="card-surface p-5 md:p-6">
            <h3 className="text-lg font-bold text-foreground">
              <Link to={k.to} className="hover:text-primary">{k.titel}</Link>
            </h3>
            <p className="mt-3 text-[14px] font-semibold uppercase tracking-wide text-muted-foreground">
              Halal-Merkmale nach dem Türsteher
            </p>
            <ul className="mt-2 space-y-1 text-[15px] text-foreground">
              {k.halal.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
            <p className="mt-4 text-[14px] font-semibold uppercase tracking-wide text-muted-foreground">
              Kosten und Konditionen, bis zu {k.max.toLocaleString("de-DE")} Punkte
            </p>
            <p className="mt-2 text-[15px] text-foreground">{k.finanz}</p>
          </div>
        ))}
      </section>

      <section className="mt-10 space-y-4 text-[16px] leading-[26px] text-foreground/90">
        <h2 className="text-2xl font-bold text-foreground">Steuersoftware und Halal-Aktien-Apps</h2>
        <p>
          <strong>
            <Link to="/vergleich/steuersoftware" className="hover:text-primary">Steuersoftware:</Link>
          </strong>{" "}
          Leistung und Preis zählen je zur Hälfte. Zur Leistung gehören Daten vom Finanzamt mit 35 %,
          Vermietung und Selbstständige mit je 25 % und mit 15 %, dass das Programm nicht nur unter
          Windows läuft. Beim Preis gibt ein kostenloses Programm die volle Punktzahl, ab 60 € für
          eine Erklärung gibt es keine Punkte mehr. Voraussetzung für einen Platz sind Kapitalerträge.
        </p>
        <p>
          <strong>
            <Link to="/vergleich/screening-apps" className="hover:text-primary">Halal-Aktien-Apps:</Link>
          </strong>{" "}
          Nachvollziehbarkeit und Nutzen zählen je zur Hälfte. Nachvollziehbar heißt zu gleichen
          Teilen: Prüfgremium mit Namen, Zahlen hinter dem Urteil und Reinigungsbetrag. Beim Nutzen
          zählt zur Hälfte, ob die kostenlose Fassung zum Prüfen reicht, zur anderen Hälfte ETFs und
          Fonds, das Verbinden des Depots und der Zakat-Rechner.
        </p>
      </section>

      <section className="mt-10 space-y-4 text-[16px] leading-[26px] text-foreground/90">
        <h2 className="text-2xl font-bold text-foreground">Woher die Daten kommen</h2>
        <p>
          Kosten und Konditionen übernehmen wir aus dem öffentlichen Vergleich von Finanzfluss (Daten:
          Biallo) und vergeben Punkte nach deren veröffentlichter Punktetabelle. Kriterien, die nur
          für Zinssparer zählen, etwa die Höhe des Guthabenzinses, haben wir gestrichen.
        </p>
        <p>
          Jedes Halal-Merkmal belegen wir beim Anbieter selbst: im Preis- und Leistungsverzeichnis,
          in den Bedingungen oder in der Hilfe. Hat der Anbieter dazu nichts Eindeutiges, nutzen wir
          eine seriöse Finanzredaktion oder einen etablierten Vergleich, etwa Finanzfluss oder extraETF.
        </p>
        <p>
          Bei den Halal-Anlagen suchen wir jede Anlage einzeln in der Wertpapiersuche oder Produktliste
          des Anbieters. Es zählen nur Anlagen mit Beleg. „mind. 3 von 12“ heißt: Für drei Anlagen
          liegt der Beleg vor.
        </p>
        <p>
          Die Reihenfolge folgt der Note. Der Halal-Teil und die Kosten zählen je zur Hälfte. Von
          Anbietern, bei denen sich die Zinsen nicht abschalten lassen, raten wir ab.
        </p>
      </section>

      <section className="mt-10 space-y-4 text-[16px] leading-[26px] text-foreground/90">
        <h2 className="text-2xl font-bold text-foreground">Partnerschaften</h2>
        <p>
          Mit manchen Anbietern arbeite ich zusammen und erhalte eine Provision, wenn du über einen
          mit Stern markierten Link ein Konto eröffnest. Das ändert nichts an der Bewertung: Kriterien
          und Gewichte gelten für alle gleich, auch für Anbieter ohne Partnerschaft. Nur die
          Reihenfolge kennt den Link: Haben mehrere Angebote in Depot, Girokonto oder Krypto gleich
          viele Sterne, steht zuerst, was du über unseren Link eröffnen kannst. Danach entscheidet
          die Note.{" "}
          <Link to="/wie-ich-geld-verdiene" className="font-semibold text-primary hover:underline">
            Wie ich Geld verdiene
          </Link>
        </p>
      </section>
    </div>
  </main>
);

export default VergleichMethodik;
