import BereinigungsRechner from "@/components/BereinigungsRechner";
import RechnerSeite from "@/components/RechnerSeite";
import Seo, { calculatorJsonLd, faqJsonLd } from "@/components/Seo";
import { Link } from "react-router-dom";

const reinigungFaq = [
  {
    q: "Was ist die Aktienbereinigung?",
    a: "Auch geprüfte Firmen haben kleine Erträge aus Zinsen oder aus Nebengeschäften, die nicht erlaubt sind. Der darauf entfallende Anteil deiner Erträge wird ausgerechnet und weitergegeben, ohne dafür eine Belohnung zu erwarten. Auf Arabisch heißt das Tathir, auf Englisch Purification.",
  },
  {
    q: "Wie viel Prozent muss ich bereinigen?",
    a: "Das hängt vom Fonds oder von der Aktie ab. Viele Anbieter veröffentlichen einmal im Jahr einen Satz, oft im niedrigen einstelligen Prozentbereich der Ausschüttung. Fehlt die Angabe, wird verbreitet der maximal zulässige Anteil aus dem Screening angesetzt, also fünf Prozent.",
  },
  {
    q: "Muss ich bei einem thesaurierenden ETF auch bereinigen?",
    a: "Nach verbreiteter Auffassung ja. Es gibt zwar keine Auszahlung, der Ertrag steckt aber im Kurs. Üblich ist, den vom Anbieter ausgewiesenen Betrag je Anteil mit der Zahl deiner Anteile zu multiplizieren. Dafür ist im Rechner der zweite Weg gedacht.",
  },
  {
    q: "Muss ich Kursgewinne bereinigen?",
    a: "Nach dem AAOIFI-Standard nicht. Bereinigt wird der Anteil der Erträge, der aus unerlaubten Quellen stammt, etwa Zinsen. Der Gewinn aus dem Verkauf deiner Anteile ist davon nicht betroffen.",
  },
  {
    q: "Zählt die Bereinigung als Zakat?",
    a: "Nein. Zakat ist eine eigene Pflicht und wird getrennt gerechnet. Bei der Bereinigung gibst du etwas zurück, das dir nie zustand, und erwartest dafür nichts. Beides fällt oft am selben Tag an, weil man dann ohnehin die Zahlen vor sich hat.",
  },
  {
    q: "Wohin geht der Betrag?",
    a: "An Bedürftige, direkt oder über eine Hilfsorganisation. Viele Gelehrte schließen ehrenhafte Zwecke aus, also Moscheebau und Korankopien. Auch eine Spendenquittung, mit der du Steuern sparst, wäre wieder ein Vorteil für dich.",
  },
];

const Bereinigungsrechner = () => (
  <>
    <Seo
      title="Aktien reinigen: Bereinigungsrechner für Dividenden | finanzmuslim"
      description="Rechne aus, welchen Anteil deiner Erträge du weitergibst. Betrag und Satz eintragen oder Betrag je Anteil mal Anteile, Ergebnis sofort als ganzer Satz."
      path="/bereinigungsrechner"
      brotkrumen={[{ name: "Rechner", path: "/rechner" }, { name: "Bereinigungsrechner", path: "/bereinigungsrechner" }]}
      jsonLd={[
        calculatorJsonLd({
          name: "Bereinigungsrechner",
          description:
            "Kostenloser Rechner für die Aktienbereinigung: unreiner Ertragsanteil aus Aktien, ETFs und Fonds.",
          path: "/bereinigungsrechner",
        }),
        faqJsonLd(reinigungFaq),
      ]}
    />
    <RechnerSeite
      name="Bereinigungsrechner"
      title="Bereinigungsrechner"
      intro={
        <p>
          Auch eine geprüfte Aktie lässt einen kleinen unreinen Rest übrig. Trag zwei Zahlen ein und
          sieh, welchen Betrag du weitergibst.
        </p>
      }
      unterRechner={
        <>
          <div className="rounded-2xl bg-accent p-5 md:p-6">
            <h2 className="text-[19px] font-bold text-foreground">So wird gerechnet</h2>
            <p className="mt-3 rounded-xl bg-card px-4 py-3 text-[16px] font-semibold leading-[26px] text-foreground md:text-[18px]">
              Ausschüttung × Satz
              <br />
              oder: Betrag je Anteil × Anteile
            </p>
            <p className="mt-3 text-[15px] leading-[24px] text-muted-foreground">
              Beide Wege führen zum selben Ergebnis, sie unterscheiden sich nur darin, welche Zahl dir
              vorliegt. Bei einem ausschüttenden Fonds nennt der Anbieter meist einen Prozentsatz. Bei einem
              Thesaurierer und bei Einzelaktien wird ein Betrag je Anteil ausgewiesen, weil es keine Auszahlung
              gibt, auf die man rechnen könnte.
            </p>

            <h3 className="mt-6 text-[17px] font-bold text-foreground">Ein Beispiel</h3>
            <p className="mt-2 text-[15px] leading-[24px] text-muted-foreground">
              300 € Ausschüttung, der Anbieter weist 1,2 Prozent als unrein aus.
            </p>
            <ul className="mt-3 space-y-1 text-[15px] leading-[24px] text-foreground">
              <li>300 € × 1,2 % = 3,60 €</li>
              <li className="font-semibold">3,60 € gibst du weiter, 296,40 € bleiben bei dir.</li>
            </ul>
          </div>

          <div id="welcher-satz" className="card-surface scroll-mt-24 p-5 md:p-6">
            <h2 className="text-[19px] font-bold text-foreground">Welchen Satz trage ich ein?</h2>
            <p className="mt-2 text-[15px] leading-[24px] text-muted-foreground">
              Der beste Fall ist die Zahl deines Anbieters. Viele Islamic-Fonds veröffentlichen einmal im Jahr,
              wie viel von der Ausschüttung unrein war, bei iShares heißt die Tabelle auf der Produktseite
              Purification Data. Musaffa und Zoya rechnen es für Einzelaktien aus, beide brauchen dafür das
              Bezahl-Abo.
            </p>
            <p className="mt-2 text-[15px] leading-[24px] text-muted-foreground">
              Findest du nichts, bleib bei den fünf Prozent. Das ist der höchste Anteil, den der
              AAOIFI-Standard beim Screening überhaupt zulässt, liegt also fast immer über dem echten Wert. Zu
              viel abzugeben ist der kleinere Fehler.
            </p>
            <p className="mt-2 text-[15px] leading-[24px] text-muted-foreground">
              Welcher Fonds welchen Satz nennt und welcher seit 2026 selbst im Fonds reinigt, steht in{" "}
              <Link to="/wissen/ertraege-reinigen" className="text-primary hover:underline">
                Aktienbereinigung
              </Link>
              .
            </p>
          </div>

          <div id="wohin" className="card-surface scroll-mt-24 p-5 md:p-6">
            <h2 className="text-[19px] font-bold text-foreground">Wohin der Betrag geht</h2>
            <p className="mt-2 text-[15px] leading-[24px] text-muted-foreground">
              An Bedürftige, direkt oder über eine Hilfsorganisation. Viele Gelehrte schließen ehrenhafte
              Zwecke aus, also den Bau einer Moschee und Korankopien, weil unreines Geld dafür nicht verwendet
              werden soll. Verbrauchsgüter für Arme, etwa Essen und Trinken, gehen dagegen.
            </p>
            <p className="mt-2 text-[15px] leading-[24px] text-muted-foreground">
              Und du selbst sollst nichts davon haben, auch keinen Steuervorteil über eine Spendenquittung. Es
              ist keine Spende, für die du Lohn erwartest, sondern die Rückgabe eines Anteils, der dir nie
              zustand.
            </p>
          </div>
        </>
      }
      erklaerung={
        <>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Warum überhaupt etwas übrig bleibt</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Die Prüfung, die einen Fonds oder eine Aktie freigibt, sortiert Firmen aus, die hauptsächlich mit
              Verbotenem Geld verdienen. Sie verlangt nicht, dass eine Firma zu hundert Prozent sauber ist, denn
              das gibt es in der Praxis nicht: Fast jede Firma hat Geld auf einem verzinsten Konto liegen oder
              einen kleinen Nebenumsatz, der nicht in Ordnung ist. Der AAOIFI-Standard lässt dafür bis zu fünf
              Prozent der Einnahmen zu.
            </p>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Diese fünf Prozent sind eine Toleranz beim Kauf, kein Freibrief beim Behalten. Derselbe Standard
              sagt: Du darfst die Aktie kaufen, und du gibst den unreinen Anteil deiner Erträge trotzdem weiter.
              Genau dafür ist dieser Rechner da.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground">Was nicht bereinigt wird</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Kursgewinne. Wenn du Anteile für 1.000 Euro gekauft und für 1.300 verkauft hast, sind die 300 Euro
              dein Gewinn aus dem Verkauf. Bereinigt wird nur der Ertragsanteil, der aus Zinsen oder
              Nebengeschäften stammt. Bei Gold, Silber und Sukuk stellt sich die Frage in der Regel gar nicht,
              dort gibt es keine Firmengewinne.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground">Wann du es machst</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Einmal im Jahr reicht. Der praktischste Termin ist der Tag, an dem du ohnehin deine{" "}
              <Link to="/zakat-rechner" className="text-primary hover:underline">
                Zakat
              </Link>{" "}
              ausrechnest. Dann liegen die Zahlen schon auf dem Tisch, und du vergisst es nicht. Gebraucht wird
              in beiden Fällen dasselbe: der Depotauszug und die Jahressteuerbescheinigung deines Brokers.
            </p>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Wer in den vergangenen Jahren nie bereinigt hat, holt es grob nach. Nimm die Ausschüttungen aus
              den alten Jahressteuerbescheinigungen, rechne mit fünf Prozent und gib den Betrag weg. Eine
              Schätzung ist besser als gar nichts, und niemand verlangt Buchhaltung über zehn Jahre.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground">Häufige Fragen zur Bereinigung</h2>
            <div className="mt-5 divide-y divide-border border-y border-border">
              {reinigungFaq.map((item) => (
                <div key={item.q} className="py-5">
                  <h3 className="font-semibold text-foreground">{item.q}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      }
      weitereRechner={[
        { name: "Zakat-Rechner", desc: "wie viel Zakat auf dein Vermögen fällt.", to: "/zakat-rechner" },
        {
          name: "Renditerechner",
          desc: "wie dein Vermögen mit geprüften Anlagen wachsen kann.",
          to: "/renditerechner",
        },
        {
          name: "Inflationsrechner",
          desc: "was dein Geld auf dem Konto in ein paar Jahren noch wert ist.",
          to: "/inflationsrechner",
        },
      ]}
    >
      <BereinigungsRechner />
    </RechnerSeite>
  </>
);

export default Bereinigungsrechner;
